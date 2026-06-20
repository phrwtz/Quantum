"use strict";

const http = require("node:http");
const { BackendError, createMemoryStore } = require("./store.cjs");
const packageJson = require("../package.json");

const DEFAULT_PORT = 8787;
const JSON_LIMIT_BYTES = 1_000_000;

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": process.env.CORS_ORIGIN || "*",
    "Access-Control-Allow-Methods": "GET,POST,PUT,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type,Authorization",
    "Access-Control-Max-Age": "600",
  };
}

function sendJson(res, status, payload, extraHeaders = {}) {
  const body = JSON.stringify(payload, null, 2);
  res.writeHead(status, {
    ...corsHeaders(),
    "Content-Type": "application/json; charset=utf-8",
    "Content-Length": Buffer.byteLength(body),
    ...extraHeaders,
  });
  res.end(body);
}

function sendNoContent(res) {
  res.writeHead(204, corsHeaders());
  res.end();
}

function readJson(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
      if (Buffer.byteLength(body) > JSON_LIMIT_BYTES) {
        reject(new BackendError(413, "payload_too_large", "JSON body is too large"));
        req.destroy();
      }
    });
    req.on("end", () => {
      if (!body.trim()) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(body));
      } catch (error) {
        reject(new BackendError(400, "invalid_json", "request body must be valid JSON"));
      }
    });
    req.on("error", reject);
  });
}

function requestOrigin(req) {
  if (process.env.PUBLIC_APP_URL) {
    return process.env.PUBLIC_APP_URL.replace(/\/$/, "");
  }
  const forwardedHost = req.headers["x-forwarded-host"];
  const forwardedProto = req.headers["x-forwarded-proto"];
  const host = Array.isArray(forwardedHost) ? forwardedHost[0] : forwardedHost || req.headers.host;
  if (!host) {
    return "";
  }
  const proto = Array.isArray(forwardedProto) ? forwardedProto[0] : forwardedProto || "http";
  return `${proto}://${host}`;
}

function withInviteUrl(req, invite) {
  const origin = requestOrigin(req);
  return {
    ...invite,
    url: origin ? `${origin}${invite.path}` : invite.path,
  };
}

function withTransferUrl(req, transfer) {
  const origin = requestOrigin(req);
  return {
    ...transfer,
    url: origin ? `${origin}${transfer.path}` : transfer.path,
  };
}

function routeKey(method, segments) {
  return `${method} /${segments.map((segment, index) => (index % 2 ? `:${index}` : segment)).join("/")}`;
}

function parsePath(req) {
  const url = new URL(req.url, "http://localhost");
  return {
    url,
    segments: url.pathname.split("/").filter(Boolean).map(decodeURIComponent),
  };
}

function createApp(options = {}) {
  const store = options.store || createMemoryStore();

  return async function app(req, res) {
    if (req.method === "OPTIONS") {
      sendNoContent(res);
      return;
    }

    const { url, segments } = parsePath(req);
    const method = req.method || "GET";

    try {
      if (method === "GET" && url.pathname === "/health") {
        sendJson(res, 200, {
          ok: true,
          service: "qubit-lab-backend",
          stage: "backend-skeleton",
        });
        return;
      }

      if (method === "GET" && url.pathname === "/version") {
        sendJson(res, 200, {
          name: packageJson.name,
          version: packageJson.version,
        });
        return;
      }

      if (method === "GET" && url.pathname === "/protocol-definitions") {
        sendJson(res, 200, { protocols: store.listProtocolDefinitions() });
        return;
      }

      if (method === "GET" && segments.length === 2 && segments[0] === "protocol-definitions") {
        sendJson(res, 200, { protocol: store.getProtocolDefinition(segments[1]) });
        return;
      }

      if (method === "GET" && url.pathname === "/rooms") {
        sendJson(res, 200, { rooms: store.listRooms() });
        return;
      }

      if (method === "POST" && url.pathname === "/rooms") {
        const body = await readJson(req);
        try {
          const room = store.createRoom(body);
          sendJson(res, 201, { room });
        } catch (error) {
          if (error instanceof BackendError && error.code === "room_exists" && body.id) {
            sendJson(res, 200, { room: store.getRoom(body.id) });
            return;
          }
          throw error;
        }
        return;
      }

      if (method === "GET" && segments.length === 2 && segments[0] === "rooms") {
        sendJson(res, 200, { room: store.getRoom(segments[1]) });
        return;
      }

      if (method === "GET" && segments.length === 4 && segments[0] === "rooms" && segments[2] === "registers") {
        sendJson(res, 200, { register: store.getRegister(segments[1], segments[3]) });
        return;
      }

      if (method === "GET" && segments.length === 3 && segments[0] === "rooms" && segments[2] === "events") {
        sendJson(res, 200, { events: store.getRoomEvents(segments[1]) });
        return;
      }

      if (method === "GET" && segments.length === 3 && segments[0] === "rooms" && segments[2] === "participants") {
        sendJson(res, 200, { participants: store.listParticipants(segments[1]) });
        return;
      }

      if (method === "PUT" && segments.length === 4 && segments[0] === "rooms" && segments[2] === "participants") {
        const participant = store.upsertParticipant(segments[1], segments[3], await readJson(req));
        sendJson(res, 200, { participant });
        return;
      }

      if (method === "GET" && segments.length === 3 && segments[0] === "rooms" && segments[2] === "protocols") {
        sendJson(res, 200, { protocols: store.listProtocols(segments[1]) });
        return;
      }

      if (method === "GET" && segments.length === 4 && segments[0] === "rooms" && segments[2] === "protocols") {
        const protocol = store.getProtocol(segments[1], segments[3]);
        sendJson(res, 200, {
          protocol,
          definition: store.getProtocolDefinition(protocol.type),
        });
        return;
      }

      if (method === "PUT" && segments.length === 4 && segments[0] === "rooms" && segments[2] === "protocols") {
        const protocol = store.upsertProtocol(segments[1], segments[3], await readJson(req));
        sendJson(res, 200, {
          protocol,
          definition: store.getProtocolDefinition(protocol.type),
        });
        return;
      }

      if (
        method === "POST" &&
        segments.length === 6 &&
        segments[0] === "rooms" &&
        segments[2] === "protocols" &&
        segments[4] === "steps"
      ) {
        const protocol = store.updateProtocolStep(
          segments[1],
          segments[3],
          segments[5],
          await readJson(req),
        );
        sendJson(res, 200, {
          protocol,
          definition: store.getProtocolDefinition(protocol.type),
        });
        return;
      }

      if (method === "POST" && segments.length === 3 && segments[0] === "rooms" && segments[2] === "registers") {
        const register = store.upsertRegister(segments[1], await readJson(req));
        sendJson(res, 201, { register });
        return;
      }

      if (method === "PUT" && segments.length === 4 && segments[0] === "rooms" && segments[2] === "registers") {
        const body = await readJson(req);
        const register = store.upsertRegister(segments[1], { ...body, id: segments[3] });
        sendJson(res, 200, { register });
        return;
      }

      if (
        method === "POST" &&
        segments.length === 3 &&
        segments[0] === "rooms" &&
        segments[2] === "entanglement-groups"
      ) {
        const entanglementGroup = store.createEntanglementGroup(segments[1], await readJson(req));
        sendJson(res, 201, { entanglementGroup });
        return;
      }

      if (
        method === "GET" &&
        segments.length === 4 &&
        segments[0] === "rooms" &&
        segments[2] === "distributed-teleportation"
      ) {
        const protocol = store.getDistributedTeleportationProtocol(segments[1], segments[3]);
        sendJson(res, 200, {
          protocol,
          definition: store.getProtocolDefinition(protocol.type),
        });
        return;
      }

      if (
        method === "PUT" &&
        segments.length === 4 &&
        segments[0] === "rooms" &&
        segments[2] === "distributed-teleportation"
      ) {
        const protocol = store.upsertDistributedTeleportationProtocol(
          segments[1],
          segments[3],
          await readJson(req),
        );
        sendJson(res, 200, {
          protocol,
          definition: store.getProtocolDefinition(protocol.type),
        });
        return;
      }

      if (
        method === "POST" &&
        segments.length === 3 &&
        segments[0] === "rooms" &&
        segments[2] === "teleport-invites"
      ) {
        const invite = store.createTeleportInvite(segments[1], await readJson(req));
        sendJson(res, 201, { invite: withInviteUrl(req, invite) });
        return;
      }

      if (
        method === "POST" &&
        segments.length === 3 &&
        segments[0] === "rooms" &&
        segments[2] === "mailbox-transfers"
      ) {
        const transfer = store.createMailboxTransfer(segments[1], await readJson(req));
        sendJson(res, 201, { transfer: withTransferUrl(req, transfer) });
        return;
      }

      if (method === "GET" && segments.length === 2 && segments[0] === "mailbox-transfers") {
        const transfer = store.getMailboxTransfer(segments[1]);
        sendJson(res, 200, { transfer: withTransferUrl(req, transfer) });
        return;
      }

      if (
        method === "POST" &&
        segments.length === 3 &&
        segments[0] === "mailbox-transfers" &&
        segments[2] === "claim"
      ) {
        const transfer = store.claimMailboxTransfer(segments[1], await readJson(req));
        sendJson(res, 200, { transfer: withTransferUrl(req, transfer) });
        return;
      }

      if (method === "GET" && segments.length === 2 && segments[0] === "teleport-invites") {
        const invite = store.getTeleportInvite(segments[1]);
        sendJson(res, 200, { invite: withInviteUrl(req, invite) });
        return;
      }

      if (
        method === "POST" &&
        segments.length === 3 &&
        segments[0] === "teleport-invites" &&
        segments[2] === "accept"
      ) {
        const invite = store.acceptTeleportInvite(segments[1], await readJson(req));
        sendJson(res, 200, { invite: withInviteUrl(req, invite) });
        return;
      }

      sendJson(res, 404, {
        error: {
          code: "not_found",
          message: `No route for ${routeKey(method, segments)}`,
        },
      });
    } catch (error) {
      if (error instanceof BackendError) {
        sendJson(res, error.status, {
          error: {
            code: error.code,
            message: error.message,
            details: error.details,
          },
        });
        return;
      }
      console.error(error);
      sendJson(res, 500, {
        error: {
          code: "internal_error",
          message: "internal server error",
        },
      });
    }
  };
}

function createServer(options = {}) {
  return http.createServer(createApp(options));
}

if (require.main === module) {
  const port = Number(process.env.PORT || DEFAULT_PORT);
  const server = createServer();
  server.listen(port, "0.0.0.0", () => {
    console.log(`Qubit Lab backend listening on http://127.0.0.1:${port}`);
  });
}

module.exports = {
  createApp,
  createServer,
  requestOrigin,
};

const fs = require("node:fs");
const fsp = require("node:fs/promises");
const http = require("node:http");
const path = require("node:path");
const { syncContentBundle } = require("./sync-content-bundle.cjs");

const rootDir = path.resolve(__dirname, "..");
const port = Number(process.env.PORT || 8124);
const host = process.env.HOST || "127.0.0.1";
const maxJsonBytes = 25 * 1024 * 1024;

const contentFiles = new Map([
  ["generated-tabs", path.join(rootDir, "data", "generated-tabs.json")],
  ["documents", path.join(rootDir, "data", "whats-this-documents.json")],
  ["component-groups", path.join(rootDir, "data", "component-groups.json")],
]);

const fallbackPayloads = new Map([
  ["generated-tabs", { tabs: [] }],
  ["documents", { documents: [] }],
  ["component-groups", { groups: [] }],
]);

const mimeTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
};

function send(response, status, body, contentType = "text/plain; charset=utf-8") {
  response.writeHead(status, {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Cache-Control": "no-store",
    "Content-Type": contentType,
  });
  response.end(body);
}

function jsonBody(request) {
  return new Promise((resolve, reject) => {
    let body = "";
    request.setEncoding("utf8");
    request.on("data", (chunk) => {
      body += chunk;
      if (body.length > maxJsonBytes) {
        reject(new Error("JSON body too large"));
        request.destroy();
      }
    });
    request.on("end", () => {
      try {
        resolve(JSON.parse(body || "{}"));
      } catch (error) {
        reject(error);
      }
    });
    request.on("error", reject);
  });
}

async function handleContentRequest(request, response, contentName) {
  const filePath = contentFiles.get(contentName);
  if (!filePath) {
    send(response, 404, "Not found");
    return;
  }
  if (request.method === "GET") {
    try {
      const body = await fsp.readFile(filePath, "utf8");
      send(response, 200, body, mimeTypes[".json"]);
    } catch (_error) {
      send(
        response,
        200,
        JSON.stringify(fallbackPayloads.get(contentName), null, 2),
        mimeTypes[".json"],
      );
    }
    return;
  }
  if (request.method === "POST") {
    try {
      const payload = await jsonBody(request);
      await fsp.mkdir(path.dirname(filePath), { recursive: true });
      await fsp.writeFile(filePath, `${JSON.stringify(payload, null, 2)}\n`);
      syncContentBundle();
      send(response, 200, JSON.stringify({ ok: true }), mimeTypes[".json"]);
    } catch (error) {
      send(response, 400, error.message || "Invalid JSON");
    }
    return;
  }
  send(response, 405, "Method not allowed");
}

async function handleStaticRequest(request, response, pathname) {
  const decodedPath = decodeURIComponent(pathname);
  const relativePath = decodedPath === "/" ? "index.html" : decodedPath.slice(1);
  const filePath = path.resolve(rootDir, relativePath);
  if (filePath !== rootDir && !filePath.startsWith(`${rootDir}${path.sep}`)) {
    send(response, 403, "Forbidden");
    return;
  }
  try {
    const stat = await fsp.stat(filePath);
    if (!stat.isFile()) {
      send(response, 404, "Not found");
      return;
    }
    response.writeHead(200, {
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "no-store",
      "Content-Type":
        mimeTypes[path.extname(filePath)] || "application/octet-stream",
    });
    fs.createReadStream(filePath).pipe(response);
  } catch (_error) {
    send(response, 404, "Not found");
  }
}

const server = http.createServer(async (request, response) => {
  if (request.method === "OPTIONS") {
    send(response, 204, "");
    return;
  }
  const requestUrl = new URL(request.url || "/", `http://${host}:${port}`);
  const contentMatch = requestUrl.pathname.match(
    /^\/__quantum-content\/([a-z-]+)$/,
  );
  if (contentMatch) {
    await handleContentRequest(request, response, contentMatch[1]);
    return;
  }
  await handleStaticRequest(request, response, requestUrl.pathname);
});

server.listen(port, host, () => {
  console.log(`Qubit Lab local server: http://${host}:${port}/`);
});

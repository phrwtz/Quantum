"use strict";

const assert = require("node:assert/strict");
const test = require("node:test");
const { createMailboxMailer } = require("../backend/mail.cjs");
const { createServer } = require("../backend/server.cjs");
const { createMemoryStore } = require("../backend/store.cjs");

function listen(server) {
  return new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", () => {
      server.off("error", reject);
      const address = server.address();
      resolve(`http://${address.address}:${address.port}`);
    });
  });
}

function close(server) {
  return new Promise((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  });
}

async function withBackend(callback, options = {}) {
  const server = createServer(options);
  const baseUrl = await listen(server);
  try {
    await callback(baseUrl);
  } finally {
    await close(server);
  }
}

async function api(baseUrl, path, options = {}) {
  const response = await fetch(`${baseUrl}${path}`, {
    method: options.method || "GET",
    headers: options.body ? { "Content-Type": "application/json" } : undefined,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  const body = await response.json();
  return { response, body };
}

test("backend reports health and version", async () => {
  await withBackend(async (baseUrl) => {
    const health = await api(baseUrl, "/health");
    assert.equal(health.response.status, 200);
    assert.equal(health.body.ok, true);
    assert.equal(health.body.stage, "backend-skeleton");

    const version = await api(baseUrl, "/version");
    assert.equal(version.response.status, 200);
    assert.equal(version.body.name, "quantum-gate-console");
  });
});

test("backend records rooms, registers, entanglement groups, and teleport invites", async () => {
  await withBackend(async (baseUrl) => {
    const createdRoom = await api(baseUrl, "/rooms", {
      method: "POST",
      body: {
        id: "stage5-room",
        label: "Stage 5 verification",
        ownerId: "bob",
      },
    });
    assert.equal(createdRoom.response.status, 201);
    assert.equal(createdRoom.body.room.id, "stage5-room");

    const amplitudes = Array.from({ length: 8 }, (_, index) => (index === 0 ? 1 : 0));
    const register = await api(baseUrl, "/rooms/stage5-room/registers/demo-register", {
      method: "PUT",
      body: {
        label: "Teleport register",
        ownerId: "bob",
        numQubits: 3,
        amplitudes,
      },
    });
    assert.equal(register.response.status, 200);
    assert.equal(register.body.register.numQubits, 3);
    assert.deepEqual(register.body.register.amplitudes[0], { re: 1, im: 0 });

    const group = await api(baseUrl, "/rooms/stage5-room/entanglement-groups", {
      method: "POST",
      body: {
        id: "bob-bell-pair",
        label: "Bob Bell pair",
        qubits: [
          { registerId: "demo-register", qubitIndex: 1 },
          { registerId: "demo-register", qubitIndex: 2 },
        ],
      },
    });
    assert.equal(group.response.status, 201);
    assert.equal(group.body.entanglementGroup.qubits.length, 2);

    const invite = await api(baseUrl, "/rooms/stage5-room/teleport-invites", {
      method: "POST",
      body: {
        registerId: "demo-register",
        qubitIndex: 2,
        email: "alice@example.com",
        createdBy: "bob",
      },
    });
    assert.equal(invite.response.status, 201);
    assert.equal(invite.body.invite.status, "pending");
    assert.equal(invite.body.invite.delivery.status, "queued-local");
    assert.match(invite.body.invite.delivery.link, /\/teleport\/tpl_/);
    assert.equal(
      invite.body.invite.delivery.body.includes(invite.body.invite.delivery.link),
      true,
    );
    assert.match(invite.body.invite.token, /^tpl_/);
    assert.match(invite.body.invite.url, /\/teleport\/tpl_/);

    const fetchedInvite = await api(baseUrl, `/teleport-invites/${invite.body.invite.token}`);
    assert.equal(fetchedInvite.response.status, 200);
    assert.equal(fetchedInvite.body.invite.email, "alice@example.com");

    const acceptedInvite = await api(baseUrl, `/teleport-invites/${invite.body.invite.token}/accept`, {
      method: "POST",
      body: {
        acceptedBy: "alice",
      },
    });
    assert.equal(acceptedInvite.response.status, 200);
    assert.equal(acceptedInvite.body.invite.status, "accepted");
    assert.equal(acceptedInvite.body.invite.acceptedBy, "alice");

    const room = await api(baseUrl, "/rooms/stage5-room");
    assert.equal(room.response.status, 200);
    assert.equal(room.body.room.registers["demo-register"].ownerId, "bob");
    assert.equal(room.body.room.entanglementGroups["bob-bell-pair"].status, "active");
    assert.ok(room.body.room.events.length >= 5);
  });
});

test("backend creates and claims mailbox transfers with register snapshots", async () => {
  await withBackend(async (baseUrl) => {
    await api(baseUrl, "/rooms", {
      method: "POST",
      body: {
        id: "mailbox-room",
        label: "Mailbox verification",
        ownerId: "bob",
      },
    });

    const rootHalf = Math.SQRT1_2;
    const register = await api(baseUrl, "/rooms/mailbox-room/registers/source-register", {
      method: "PUT",
      body: {
        label: "Source register",
        ownerId: "bob",
        numQubits: 2,
        amplitudes: [rootHalf, 0, 0, rootHalf],
      },
    });
    assert.equal(register.response.status, 200);

    const transfer = await api(baseUrl, "/rooms/mailbox-room/mailbox-transfers", {
      method: "POST",
      body: {
        registerId: "source-register",
        qubitIndex: 1,
        email: "alice@example.com",
        from: "bob@example.com",
        createdBy: "bob",
        metadata: {
          frontendLinkTemplate: "http://lab.test/?tourMailbox=__TOKEN__",
        },
      },
    });
    assert.equal(transfer.response.status, 201);
    assert.equal(transfer.body.transfer.status, "pending");
    assert.equal(transfer.body.transfer.payload.kind, "register-snapshot");
    assert.equal(transfer.body.transfer.payload.selectedQubit, 1);
    assert.equal(transfer.body.transfer.payload.register.numQubits, 2);
    assert.match(transfer.body.transfer.token, /^mbx_/);
    assert.match(transfer.body.transfer.url, /\/mailbox\/mbx_/);
    assert.equal(transfer.body.transfer.from, "bob@example.com");
    assert.equal(transfer.body.transfer.delivery.status, "queued-local");
    assert.equal(transfer.body.transfer.delivery.to, "alice@example.com");
    assert.equal(transfer.body.transfer.delivery.from, "bob@example.com");
    assert.match(
      transfer.body.transfer.delivery.link,
      /^http:\/\/lab\.test\/\?tourMailbox=mbx_/,
    );
    assert.match(transfer.body.transfer.delivery.mailto, /^mailto:alice%40example\.com\?/);

    const token = transfer.body.transfer.token;
    const fetched = await api(baseUrl, `/mailbox-transfers/${token}`);
    assert.equal(fetched.response.status, 200);
    assert.equal(fetched.body.transfer.email, "alice@example.com");

    const claimed = await api(baseUrl, `/mailbox-transfers/${token}/claim`, {
      method: "POST",
      body: {
        claimedBy: "alice",
      },
    });
    assert.equal(claimed.response.status, 200);
    assert.equal(claimed.body.transfer.status, "claimed");
    assert.equal(claimed.body.transfer.claimedBy, "alice");
    assert.deepEqual(claimed.body.transfer.payload.register.amplitudes[0], {
      re: rootHalf,
      im: 0,
    });

    const duplicateClaim = await api(baseUrl, `/mailbox-transfers/${token}/claim`, {
      method: "POST",
      body: {
        claimedBy: "alice-again",
      },
    });
    assert.equal(duplicateClaim.response.status, 409);
    assert.equal(duplicateClaim.body.error.code, "mailbox_transfer_closed");
  });
});

test("mailbox mailer sends transfer email through Resend", async () => {
  const requests = [];
  const mailer = createMailboxMailer({
    env: {
      MAIL_DELIVERY_PROVIDER: "resend",
      MAIL_FROM: "Qubit Lab <send@example.com>",
      RESEND_API_KEY: "test_api_key",
      RESEND_API_URL: "https://resend.test/emails",
    },
    fetchImpl: async (url, options) => {
      requests.push({
        url,
        headers: options.headers,
        body: JSON.parse(options.body),
      });
      return new Response(JSON.stringify({ id: "eml_test_123" }), {
        status: 200,
      });
    },
  });

  assert.equal(mailer.isConfigured(), true);
  const delivery = await mailer.sendMailboxTransfer({
    email: "alice@example.com",
    delivery: {
      status: "queued-local",
      to: "alice@example.com",
      from: "bob@example.com",
      subject: "A qubit is waiting for you in Qubit Lab",
      body: "Bob sent you a qubit.\nhttp://lab.test/?tourMailbox=mbx_demo",
      link: "http://lab.test/?tourMailbox=mbx_demo",
      mailto: "mailto:alice@example.com",
    },
  });

  assert.equal(delivery.status, "sent");
  assert.equal(delivery.provider, "resend");
  assert.equal(delivery.providerMessageId, "eml_test_123");
  assert.equal(delivery.mailFrom, "Qubit Lab <send@example.com>");
  assert.equal(requests.length, 1);
  assert.equal(requests[0].url, "https://resend.test/emails");
  assert.equal(requests[0].headers.Authorization, "Bearer test_api_key");
  assert.deepEqual(requests[0].body.to, ["alice@example.com"]);
  assert.equal(requests[0].body.from, "Qubit Lab <send@example.com>");
  assert.equal(requests[0].body.text.includes("mbx_demo"), true);
});

test("mailbox mailer sends teleport invite email through Resend", async () => {
  const requests = [];
  const mailer = createMailboxMailer({
    env: {
      MAIL_DELIVERY_PROVIDER: "resend",
      MAIL_FROM: "Qubit Lab <send@example.com>",
      RESEND_API_KEY: "test_api_key",
      RESEND_API_URL: "https://resend.test/emails",
    },
    fetchImpl: async (url, options) => {
      requests.push({
        url,
        headers: options.headers,
        body: JSON.parse(options.body),
      });
      return new Response(JSON.stringify({ id: "eml_invite_123" }), {
        status: 200,
      });
    },
  });

  assert.equal(mailer.isConfigured(), true);
  const delivery = await mailer.sendTeleportInvite({
    email: "alice@example.com",
    delivery: {
      status: "queued-local",
      to: "alice@example.com",
      subject: "You're invited to teleport a qubit in Qubit Lab",
      body: "Bob invited you.\nhttp://lab.test/teleport/tpl_demo",
      link: "http://lab.test/teleport/tpl_demo",
      mailto: "mailto:alice@example.com",
    },
  });

  assert.equal(delivery.status, "sent");
  assert.equal(delivery.provider, "resend");
  assert.equal(delivery.providerMessageId, "eml_invite_123");
  assert.equal(delivery.mailFrom, "Qubit Lab <send@example.com>");
  assert.equal(requests.length, 1);
  assert.equal(requests[0].url, "https://resend.test/emails");
  assert.equal(requests[0].headers.Authorization, "Bearer test_api_key");
  assert.deepEqual(requests[0].body.to, ["alice@example.com"]);
  assert.equal(requests[0].body.from, "Qubit Lab <send@example.com>");
  assert.equal(requests[0].body.text.includes("tpl_demo"), true);
});

test("backend records configured mailbox mail delivery", async () => {
  const sentTransfers = [];
  const mailer = {
    provider: "test-mail",
    isConfigured() {
      return true;
    },
    async sendMailboxTransfer(transfer) {
      sentTransfers.push(transfer);
      return {
        ...transfer.delivery,
        status: "sent",
        provider: "test-mail",
        providerMessageId: "msg_123",
        mailFrom: "Qubit Lab <send@example.com>",
      };
    },
  };

  await withBackend(async (baseUrl) => {
    await api(baseUrl, "/rooms", {
      method: "POST",
      body: {
        id: "mail-room",
        label: "Mail delivery verification",
      },
    });
    await api(baseUrl, "/rooms/mail-room/registers/source-register", {
      method: "PUT",
      body: {
        label: "Source register",
        numQubits: 1,
        amplitudes: [1, 0],
      },
    });
    const transfer = await api(baseUrl, "/rooms/mail-room/mailbox-transfers", {
      method: "POST",
      body: {
        registerId: "source-register",
        qubitIndex: 0,
        email: "alice@example.com",
        from: "bob@example.com",
        metadata: {
          frontendLinkTemplate: "http://lab.test/?tourMailbox=__TOKEN__",
          emailBody: "A custom qubit message.\n\n__MAILBOX_LINK__",
        },
      },
    });
    assert.equal(transfer.response.status, 201);
    assert.equal(transfer.body.transfer.delivery.status, "sent");
    assert.equal(transfer.body.transfer.delivery.provider, "test-mail");
    assert.equal(transfer.body.transfer.delivery.providerMessageId, "msg_123");
    assert.equal(sentTransfers.length, 1);
    assert.match(sentTransfers[0].delivery.link, /^http:\/\/lab\.test\/\?tourMailbox=mbx_/);
    assert.match(sentTransfers[0].delivery.body, /^A custom qubit message\.\n\nhttp:\/\/lab\.test\/\?tourMailbox=mbx_/);

    const fetched = await api(baseUrl, `/mailbox-transfers/${transfer.body.transfer.token}`);
    assert.equal(fetched.body.transfer.delivery.status, "sent");
    assert.equal(fetched.body.transfer.delivery.mailFrom, "Qubit Lab <send@example.com>");
  }, { mailer });
});

test("backend sends and records configured teleport invite mail delivery", async () => {
  const sentInvites = [];
  const mailer = {
    provider: "test-mail",
    isConfigured() {
      return true;
    },
    async sendTeleportInvite(invite) {
      sentInvites.push(invite);
      return {
        ...invite.delivery,
        status: "sent",
        provider: "test-mail",
        providerMessageId: "msg_invite_123",
        mailFrom: "Qubit Lab <send@example.com>",
      };
    },
  };

  await withBackend(async (baseUrl) => {
    await api(baseUrl, "/rooms", {
      method: "POST",
      body: {
        id: "teleport-mail-room",
        label: "Teleport mail delivery verification",
      },
    });
    await api(baseUrl, "/rooms/teleport-mail-room/registers/source-register", {
      method: "PUT",
      body: {
        label: "Source register",
        numQubits: 1,
        amplitudes: [1, 0],
      },
    });
    const invite = await api(baseUrl, "/rooms/teleport-mail-room/teleport-invites", {
      method: "POST",
      body: {
        registerId: "source-register",
        qubitIndex: 0,
        email: "alice@example.com",
        createdBy: "bob",
        metadata: {
          emailBody: "A custom teleport invite.\n\n__TELEPORT_LINK__",
        },
      },
    });
    assert.equal(invite.response.status, 201);
    assert.equal(invite.body.invite.delivery.status, "sent");
    assert.equal(invite.body.invite.delivery.provider, "test-mail");
    assert.equal(invite.body.invite.delivery.providerMessageId, "msg_invite_123");
    assert.equal(sentInvites.length, 1);
    assert.match(sentInvites[0].delivery.link, /^http:\/\/127\.0\.0\.1:\d+\/teleport\/tpl_/);
    assert.match(
      sentInvites[0].delivery.body,
      /^A custom teleport invite\.\n\nhttp:\/\/127\.0\.0\.1:\d+\/teleport\/tpl_/,
    );

    const fetched = await api(baseUrl, `/teleport-invites/${invite.body.invite.token}`);
    assert.equal(fetched.body.invite.delivery.status, "sent");
    assert.equal(fetched.body.invite.delivery.mailFrom, "Qubit Lab <send@example.com>");
  }, { mailer });
});

test("backend versions shared registers and rejects stale writes", async () => {
  await withBackend(async (baseUrl) => {
    await api(baseUrl, "/rooms", {
      method: "POST",
      body: {
        id: "sync-room",
        label: "Sync verification",
      },
    });

    const first = await api(baseUrl, "/rooms/sync-room/registers/shared-register", {
      method: "PUT",
      body: {
        numQubits: 1,
        amplitudes: [1, 0],
        metadata: {
          selectedQubit: 0,
        },
      },
    });
    assert.equal(first.response.status, 200);
    assert.equal(first.body.register.version, 1);

    const fetched = await api(baseUrl, "/rooms/sync-room/registers/shared-register");
    assert.equal(fetched.response.status, 200);
    assert.equal(fetched.body.register.version, 1);
    assert.equal(fetched.body.register.metadata.selectedQubit, 0);

    const second = await api(baseUrl, "/rooms/sync-room/registers/shared-register", {
      method: "PUT",
      body: {
        numQubits: 1,
        amplitudes: [0, 1],
        expectedVersion: 1,
      },
    });
    assert.equal(second.response.status, 200);
    assert.equal(second.body.register.version, 2);

    const stale = await api(baseUrl, "/rooms/sync-room/registers/shared-register", {
      method: "PUT",
      body: {
        numQubits: 1,
        amplitudes: [1, 0],
        expectedVersion: 1,
      },
    });
    assert.equal(stale.response.status, 409);
    assert.equal(stale.body.error.code, "register_version_conflict");
    assert.equal(stale.body.error.details.currentVersion, 2);
  });
});

test("backend stores room participants with roles and permissions", async () => {
  await withBackend(async (baseUrl) => {
    await api(baseUrl, "/rooms", {
      method: "POST",
      body: {
        id: "participant-room",
        label: "Participant verification",
        ownerId: "teacher",
      },
    });

    const created = await api(baseUrl, "/rooms/participant-room/participants/alice", {
      method: "PUT",
      body: {
        displayName: "Alice",
        role: "editor",
      },
    });
    assert.equal(created.response.status, 200);
    assert.equal(created.body.participant.id, "alice");
    assert.equal(created.body.participant.role, "editor");
    assert.equal(created.body.participant.permissions.canEdit, true);
    assert.equal(created.body.participant.permissions.canAdmin, false);

    const viewer = await api(baseUrl, "/rooms/participant-room/participants/bob", {
      method: "PUT",
      body: {
        displayName: "Bob",
        role: "viewer",
      },
    });
    assert.equal(viewer.response.status, 200);
    assert.equal(viewer.body.participant.permissions.canView, true);
    assert.equal(viewer.body.participant.permissions.canEdit, false);

    const listed = await api(baseUrl, "/rooms/participant-room/participants");
    assert.equal(listed.response.status, 200);
    assert.deepEqual(
      listed.body.participants.map((participant) => participant.id).sort(),
      ["alice", "bob", "teacher"],
    );
    const aliceBeforeHeartbeat = listed.body.participants.find(
      (participant) => participant.id === "alice",
    );
    const heartbeat = await api(
      baseUrl,
      "/rooms/participant-room/participants/alice/heartbeat",
      { method: "POST" },
    );
    assert.equal(heartbeat.response.status, 200);
    assert.equal(heartbeat.body.participant.id, "alice");
    assert.ok(
      Date.parse(heartbeat.body.participant.updatedAt) >=
        Date.parse(aliceBeforeHeartbeat.updatedAt),
    );

    const invalid = await api(baseUrl, "/rooms/participant-room/participants/eve", {
      method: "PUT",
      body: {
        role: "wizard",
      },
    });
    assert.equal(invalid.response.status, 400);
    assert.equal(invalid.body.error.code, "invalid_participant_role");
  });
});

test("backend auto-joins send-receive-room as Bob then Alice", async () => {
  await withBackend(async (baseUrl) => {
    const bob = await api(baseUrl, "/rooms/send-receive-room/auto-join", {
      method: "POST",
      body: { clientSessionId: "bob-screen" },
    });
    assert.equal(bob.response.status, 200);
    assert.equal(bob.body.participant.id, "bob");
    assert.equal(bob.body.participant.displayName, "Bob");
    assert.equal(bob.body.room.id, "send-receive-room");

    const alice = await api(baseUrl, "/rooms/send-receive-room/auto-join", {
      method: "POST",
      body: { clientSessionId: "alice-screen" },
    });
    assert.equal(alice.response.status, 200);
    assert.equal(alice.body.participant.id, "alice");
    assert.equal(alice.body.participant.displayName, "Alice");

    const bobAgain = await api(baseUrl, "/rooms/send-receive-room/auto-join", {
      method: "POST",
      body: {
        participantId: "bob",
        clientSessionId: "bob-screen",
      },
    });
    assert.equal(bobAgain.response.status, 200);
    assert.equal(bobAgain.body.participant.id, "bob");

    const third = await api(baseUrl, "/rooms/send-receive-room/auto-join", {
      method: "POST",
      body: {},
    });
    assert.equal(third.response.status, 409);
    assert.equal(third.body.error.code, "room_full");

    const resetFullRoom = await api(baseUrl, "/rooms/send-receive-room/auto-join", {
      method: "POST",
      body: {
        clientSessionId: "fresh-screen",
        resetIfFull: true,
      },
    });
    assert.equal(resetFullRoom.response.status, 200);
    assert.equal(resetFullRoom.body.participant.id, "bob");
    assert.deepEqual(Object.keys(resetFullRoom.body.room.participants), ["bob"]);
  });
});

test("backend queues qubits sent before Alice joins and delivers them on entry", async () => {
  let nowMs = Date.parse("2026-02-01T00:00:00.000Z");
  const store = createMemoryStore({
    now: () => nowMs,
    sendReceiveRoomStaleMs: 1000,
  });
  await withBackend(async (baseUrl) => {
    const bob = await api(baseUrl, "/rooms/send-receive-room/auto-join", {
      method: "POST",
      body: { clientSessionId: "early-bob-screen" },
    });
    assert.equal(bob.response.status, 200);
    assert.equal(bob.body.participant.id, "bob");

    const sent = [];
    for (const [index, vector] of [
      [0, [1, 0]],
      [1, [Math.SQRT1_2, Math.SQRT1_2]],
    ]) {
      const response = await api(
        baseUrl,
        "/rooms/send-receive-room/mailbox-notifications",
        {
          method: "POST",
          body: {
            fromParticipantId: "bob",
            fromName: "Bob",
            qubitLabel: `q${index}`,
            transfer: {
              kind: "single-qubit",
              version: 1,
              vector,
              roomQubit: { roomQubitIndex: index, qubitId: index + 1 },
            },
          },
        },
      );
      assert.equal(response.response.status, 201);
      sent.push(response.body.event);
    }

    const beforeAlice = await api(
      baseUrl,
      "/rooms/send-receive-room/mailbox-notifications?participantId=alice",
    );
    assert.equal(beforeAlice.response.status, 200);
    assert.deepEqual(
      beforeAlice.body.notifications.map((event) => event.payload.qubitLabel),
      ["q0", "q1"],
    );

    nowMs += 2000;
    const alice = await api(baseUrl, "/rooms/send-receive-room/auto-join", {
      method: "POST",
      body: { clientSessionId: "late-alice-screen" },
    });
    assert.equal(alice.response.status, 200);
    assert.equal(alice.body.participant.id, "alice");

    for (const event of sent) {
      const claim = await api(
        baseUrl,
        `/rooms/send-receive-room/mailbox-notifications/${event.id}/claim`,
        {
          method: "POST",
          body: { participantId: "alice" },
        },
      );
      assert.equal(claim.response.status, 200);
      assert.equal(claim.body.notification.claimedBy, "alice");
    }

    const afterClaims = await api(
      baseUrl,
      "/rooms/send-receive-room/mailbox-notifications?participantId=alice",
    );
    assert.equal(afterClaims.response.status, 200);
    assert.deepEqual(afterClaims.body.notifications, []);
  }, { store });
});

test("backend clears stale send-receive-room before a new Bob joins", async () => {
  let nowMs = Date.parse("2026-01-01T00:00:00.000Z");
  const store = createMemoryStore({
    now: () => nowMs,
    sendReceiveRoomStaleMs: 1000,
  });
  await withBackend(async (baseUrl) => {
    const bob = await api(baseUrl, "/rooms/send-receive-room/auto-join", {
      method: "POST",
      body: { clientSessionId: "old-bob-screen" },
    });
    assert.equal(bob.response.status, 200);
    await api(baseUrl, "/rooms/send-receive-room/messages", {
      method: "POST",
      body: {
        participantId: "bob",
        displayName: "Bob",
        message: "Old message",
      },
    });

    nowMs += 2000;
    const freshBob = await api(baseUrl, "/rooms/send-receive-room/auto-join", {
      method: "POST",
      body: { clientSessionId: "fresh-bob-screen" },
    });
    assert.equal(freshBob.response.status, 200);
    assert.equal(freshBob.body.participant.id, "bob");
    assert.equal(freshBob.body.room.events.length, 1);
    assert.equal(freshBob.body.room.events[0].type, "participant.created");
    assert.equal(freshBob.body.room.events[0].payload.displayName, "Bob");
    assert.deepEqual(Object.keys(freshBob.body.room.participants), ["bob"]);
  }, { store });
});

test("backend allocates room-wide qubit identities", async () => {
  await withBackend(async (baseUrl) => {
    await api(baseUrl, "/rooms", {
      method: "POST",
      body: {
        id: "qubit-identity-room",
        label: "Qubit identity verification",
        ownerId: "bob",
      },
    });

    const bob = await api(baseUrl, "/rooms/qubit-identity-room/qubits/allocate", {
      method: "POST",
      body: {
        participantId: "bob",
        qubits: [{ clientId: "bob-a" }, { clientId: "bob-b" }],
      },
    });
    assert.equal(bob.response.status, 200);
    assert.deepEqual(
      bob.body.qubits.map(({ label, qubitId, roomQubitIndex }) => ({
        label,
        qubitId,
        roomQubitIndex,
      })),
      [
        { label: "q0", qubitId: 1, roomQubitIndex: 0 },
        { label: "q1", qubitId: 2, roomQubitIndex: 1 },
      ],
    );
    const repeatedBob = await api(baseUrl, "/rooms/qubit-identity-room/qubits/allocate", {
      method: "POST",
      body: {
        participantId: "bob",
        qubits: [{ clientId: "bob-a" }, { clientId: "bob-b" }],
      },
    });
    assert.equal(repeatedBob.response.status, 200);
    assert.deepEqual(
      repeatedBob.body.qubits.map(({ label, qubitId, roomQubitIndex }) => ({
        label,
        qubitId,
        roomQubitIndex,
      })),
      [
        { label: "q0", qubitId: 1, roomQubitIndex: 0 },
        { label: "q1", qubitId: 2, roomQubitIndex: 1 },
      ],
    );

    const alice = await api(baseUrl, "/rooms/qubit-identity-room/qubits/allocate", {
      method: "POST",
      body: {
        participantId: "alice",
        qubits: [
          { clientId: "alice-a" },
          { clientId: "alice-b" },
          { clientId: "alice-c" },
        ],
      },
    });
    assert.equal(alice.response.status, 200);
    assert.deepEqual(
      alice.body.qubits.map(({ label, qubitId, roomQubitIndex }) => ({
        label,
        qubitId,
        roomQubitIndex,
      })),
      [
        { label: "q2", qubitId: 3, roomQubitIndex: 2 },
        { label: "q3", qubitId: 4, roomQubitIndex: 3 },
        { label: "q4", qubitId: 5, roomQubitIndex: 4 },
      ],
    );
    const repeatedAlice = await api(baseUrl, "/rooms/qubit-identity-room/qubits/allocate", {
      method: "POST",
      body: {
        participantId: "alice",
        qubits: [
          { clientId: "alice-a" },
          { clientId: "alice-b" },
          { clientId: "alice-c" },
        ],
      },
    });
    assert.equal(repeatedAlice.response.status, 200);
    assert.deepEqual(
      repeatedAlice.body.qubits.map(({ label, qubitId, roomQubitIndex }) => ({
        label,
        qubitId,
        roomQubitIndex,
      })),
      [
        { label: "q2", qubitId: 3, roomQubitIndex: 2 },
        { label: "q3", qubitId: 4, roomQubitIndex: 3 },
        { label: "q4", qubitId: 5, roomQubitIndex: 4 },
      ],
    );
  });
});

test("backend honors requested room qubit slots when available", async () => {
  await withBackend(async (baseUrl) => {
    await api(baseUrl, "/rooms", {
      method: "POST",
      body: {
        id: "qubit-slot-room",
        label: "Qubit slot verification",
        ownerId: "bob",
      },
    });

    const alice = await api(baseUrl, "/rooms/qubit-slot-room/qubits/allocate", {
      method: "POST",
      body: {
        participantId: "alice",
        baseRoomQubitIndex: 2,
        qubits: [{ clientId: "alice-a" }, { clientId: "alice-b" }],
      },
    });
    assert.equal(alice.response.status, 200);
    assert.deepEqual(
      alice.body.qubits.map(({ label, qubitId, roomQubitIndex }) => ({
        label,
        qubitId,
        roomQubitIndex,
      })),
      [
        { label: "q2", qubitId: 3, roomQubitIndex: 2 },
        { label: "q3", qubitId: 4, roomQubitIndex: 3 },
      ],
    );
    const repeatedAlice = await api(baseUrl, "/rooms/qubit-slot-room/qubits/allocate", {
      method: "POST",
      body: {
        participantId: "alice",
        baseRoomQubitIndex: 2,
        qubits: [{ clientId: "alice-a" }, { clientId: "alice-b" }],
      },
    });
    assert.equal(repeatedAlice.response.status, 200);
    assert.deepEqual(
      repeatedAlice.body.qubits.map(({ label, qubitId, roomQubitIndex }) => ({
        label,
        qubitId,
        roomQubitIndex,
      })),
      [
        { label: "q2", qubitId: 3, roomQubitIndex: 2 },
        { label: "q3", qubitId: 4, roomQubitIndex: 3 },
      ],
    );
  });
});

test("backend lets only the owner clear a room", async () => {
  await withBackend(async (baseUrl) => {
    const created = await api(baseUrl, "/rooms", {
      method: "POST",
      body: {
        id: "owned-room",
        label: "Owned room",
        ownerId: "alice-session",
      },
    });
    assert.equal(created.response.status, 201);
    await api(baseUrl, "/rooms/owned-room/participants/bob-session", {
      method: "PUT",
      body: {
        displayName: "Bob",
        role: "editor",
      },
    });

    const forbidden = await api(
      baseUrl,
      "/rooms/owned-room?requestedBy=bob-session",
      { method: "DELETE" },
    );
    assert.equal(forbidden.response.status, 403);
    assert.equal(forbidden.body.error.code, "room_delete_forbidden");

    const stillThere = await api(baseUrl, "/rooms/owned-room");
    assert.equal(stillThere.response.status, 200);

    const deleted = await api(
      baseUrl,
      "/rooms/owned-room?requestedBy=alice-session",
      { method: "DELETE" },
    );
    assert.equal(deleted.response.status, 200);
    assert.equal(deleted.body.deleted, true);
    assert.equal(deleted.body.room.id, "owned-room");

    const missing = await api(baseUrl, "/rooms/owned-room");
    assert.equal(missing.response.status, 404);
  });
});

test("backend records room chat and mailbox notification events", async () => {
  await withBackend(async (baseUrl) => {
    await api(baseUrl, "/rooms", {
      method: "POST",
      body: {
        id: "demo-room",
        label: "Demo room",
      },
    });
    await api(baseUrl, "/rooms/demo-room/participants/alice", {
      method: "PUT",
      body: {
        displayName: "Alice",
        role: "editor",
      },
    });
    const message = await api(baseUrl, "/rooms/demo-room/messages", {
      method: "POST",
      body: {
        participantId: "alice",
        message: "Ready for qubits.",
      },
    });
    assert.equal(message.response.status, 201);
    assert.equal(message.body.event.type, "room.message");
    assert.equal(message.body.event.payload.displayName, "Alice");

    const notification = await api(baseUrl, "/rooms/demo-room/mailbox-notifications", {
      method: "POST",
      body: {
        fromParticipantId: "alice",
        qubitLabel: "q0",
        message: "Here comes q0.",
        dedupeKey: "demo-room:alice:q0-send",
        transfer: {
          kind: "single-qubit",
          version: 1,
          vector: [Math.SQRT1_2, Math.SQRT1_2],
        },
      },
    });
    assert.equal(notification.response.status, 201);
    assert.equal(notification.body.event.type, "roomMailbox.sent");
    assert.equal(notification.body.event.payload.fromName, "Alice");
    assert.equal(notification.body.event.payload.qubitLabel, "q0");
    assert.deepEqual(notification.body.event.payload.transfer.vector, [
      Math.SQRT1_2,
      Math.SQRT1_2,
    ]);
    assert.equal(
      notification.body.event.payload.dedupeKey,
      "demo-room:alice:q0-send",
    );

    const duplicateNotification = await api(
      baseUrl,
      "/rooms/demo-room/mailbox-notifications",
      {
        method: "POST",
        body: {
          fromParticipantId: "alice",
          qubitLabel: "q0",
          message: "Here comes q0 again.",
          dedupeKey: "demo-room:alice:q0-send",
          transfer: {
            kind: "single-qubit",
            version: 1,
            vector: [0, 1],
          },
        },
      },
    );
    assert.equal(duplicateNotification.response.status, 201);
    assert.equal(
      duplicateNotification.body.event.id,
      notification.body.event.id,
    );
    assert.equal(
      duplicateNotification.body.event.payload.message,
      "Here comes q0.",
    );

    const action = await api(baseUrl, "/rooms/demo-room/actions", {
      method: "POST",
      body: {
        participantId: "alice",
        actionType: "gate-setting",
        gateLabel: "flipper gate 1",
        qubitLabel: "q0",
        tickIndex: 3,
      },
    });
    assert.equal(action.response.status, 201);
    assert.equal(action.body.event.type, "room.action");
    assert.equal(action.body.event.payload.actionType, "gate-setting");
    assert.equal(action.body.event.payload.qubitLabel, "q0");

    const events = await api(baseUrl, "/rooms/demo-room/events");
    assert.equal(events.response.status, 200);
    assert.ok(events.body.events.some((event) => event.type === "room.message"));
    assert.equal(
      events.body.events.filter((event) => event.type === "roomMailbox.sent")
        .length,
      1,
    );
    assert.ok(events.body.events.some((event) => event.type === "room.action"));
  });
});

test("backend resets room collaboration state without removing participants", async () => {
  await withBackend(async (baseUrl) => {
    await api(baseUrl, "/rooms", {
      method: "POST",
      body: {
        id: "reset-room",
        label: "Reset room",
      },
    });
    await api(baseUrl, "/rooms/reset-room/participants/alice", {
      method: "PUT",
      body: {
        displayName: "Alice",
        role: "editor",
      },
    });
    await api(baseUrl, "/rooms/reset-room/messages", {
      method: "POST",
      body: {
        participantId: "alice",
        message: "Before reset.",
      },
    });
    await api(baseUrl, "/rooms/reset-room/measurements/four-register", {
      method: "POST",
      body: {
        numQubits: 4,
        qubitIndex: 0,
        color: "blue",
        participantId: "alice",
      },
    });
    await api(baseUrl, "/rooms/reset-room/qubits/allocate", {
      method: "POST",
      body: {
        participantId: "alice",
        baseRoomQubitIndex: 2,
        qubits: [{ clientId: "alice-a" }, { clientId: "alice-b" }],
      },
    });

    const reset = await api(baseUrl, "/rooms/reset-room/reset", {
      method: "POST",
      body: {
        id: "reset-1",
        participantId: "alice",
      },
    });
    assert.equal(reset.response.status, 200);
    assert.equal(reset.body.room.lastReset.id, "reset-1");
    assert.equal(reset.body.room.lastReset.requestedBy, "alice");
    assert.equal(reset.body.room.resetVersion, 1);
    assert.equal(Object.keys(reset.body.room.participants).length, 1);
    assert.equal(reset.body.room.participants.alice.displayName, "Alice");
    assert.deepEqual(reset.body.room.roomMeasurements, {});
    assert.deepEqual(reset.body.room.sharedEntanglements, {});
    assert.deepEqual(reset.body.room.entanglementGroups, {});
    assert.deepEqual(reset.body.room.registers, {});
    assert.deepEqual(reset.body.room.qubitIdentities, {});
    assert.equal(reset.body.room.nextQubitIndex, 0);
    assert.deepEqual(reset.body.room.mailboxQueue, []);
    assert.equal(reset.body.room.events.length, 1);
    assert.equal(reset.body.room.events[0].type, "room.reset");

    const events = await api(baseUrl, "/rooms/reset-room/events");
    assert.equal(events.response.status, 200);
    assert.equal(events.body.events.length, 1);
    assert.equal(events.body.events[0].type, "room.reset");

    const participants = await api(baseUrl, "/rooms/reset-room/participants");
    assert.equal(participants.response.status, 200);
    assert.equal(participants.body.participants.length, 1);

    const measurements = await api(baseUrl, "/rooms/reset-room/measurements");
    assert.equal(measurements.response.status, 200);
    assert.deepEqual(measurements.body.measurements, []);
  });
});

test("backend aggregates distributed room measurements", async () => {
  await withBackend(async (baseUrl) => {
    await api(baseUrl, "/rooms", {
      method: "POST",
      body: {
        id: "measurement-room",
        label: "Measurement room",
      },
    });

    const colors = ["blue", "red", "blue", "red"];
    let latest = null;
    for (let qubitIndex = 0; qubitIndex < 4; qubitIndex += 1) {
      latest = await api(
        baseUrl,
        "/rooms/measurement-room/measurements/four-register",
        {
          method: "POST",
          body: {
            numQubits: 4,
            qubitIndex,
            color: colors[qubitIndex],
            participantId: qubitIndex < 2 ? "bob" : "alice",
            logicalQubitId: qubitIndex + 1,
          },
        },
      );
      assert.equal(latest.response.status, 200);
    }

    assert.equal(latest.body.measurement.counts.brbr, 1);
    assert.equal(latest.body.measurement.pendingQueues["0"].length, 0);
    assert.match(latest.body.measurement.completionId, /^room_measurement_/);

    const listed = await api(baseUrl, "/rooms/measurement-room/measurements");
    assert.equal(listed.response.status, 200);
    assert.equal(listed.body.measurements.length, 1);
    assert.equal(listed.body.measurements[0].counts.brbr, 1);

    const events = await api(baseUrl, "/rooms/measurement-room/events");
    const measurementEvent = events.body.events.find(
      (event) =>
        event.type === "roomMeasurement.updated" &&
        event.payload.qubitIndex === 3,
    );
    assert.equal(measurementEvent.payload.participantId, "alice");
    assert.equal(measurementEvent.payload.logicalQubitId, 4);

    const control = await api(
      baseUrl,
      "/rooms/measurement-room/measurements/four-register/control",
      {
        method: "POST",
        body: {
          id: "control-1",
          type: "experiment-count",
          iterations: 25,
          participantId: "alice",
          startAt: 123456,
        },
      },
    );
    assert.equal(control.response.status, 200);
    assert.equal(control.body.measurement.control.id, "control-1");
    assert.equal(control.body.measurement.control.type, "experiment-count");
    assert.equal(control.body.measurement.control.iterations, 25);
    assert.equal(control.body.measurement.control.requestedBy, "alice");
    assert.deepEqual(control.body.measurement.counts, {});
    assert.deepEqual(control.body.measurement.pending, {});

    const repeated = await api(
      baseUrl,
      "/rooms/measurement-room/measurements/four-register/control",
      {
        method: "POST",
        body: {
          id: "control-2",
          type: "experiment-repeat",
          iterations: 3,
          participantId: "bob",
        },
      },
    );
    assert.equal(repeated.response.status, 200);
    assert.equal(repeated.body.measurement.control.id, "control-2");
    assert.equal(repeated.body.measurement.control.type, "experiment-repeat");
    assert.equal(repeated.body.measurement.control.iterations, 3);
  });
});

test("backend versions shared mailbox entanglement state", async () => {
  await withBackend(async (baseUrl) => {
    await api(baseUrl, "/rooms", {
      method: "POST",
      body: {
        id: "shared-entanglement-room",
        label: "Shared entanglement room",
      },
    });
    const created = await api(
      baseUrl,
      "/rooms/shared-entanglement-room/shared-entanglements",
      {
        method: "POST",
        body: {
          amplitudes: [Math.SQRT1_2, 0, 0, Math.SQRT1_2],
          displayMode: "linked",
          linkRelation: "correlated",
          members: [
            { participantId: "bob", qubitIndex: 0 },
            { participantId: "alice", qubitIndex: 1 },
          ],
        },
      },
    );
    assert.equal(created.response.status, 201);
    assert.equal(created.body.sharedEntanglement.status, "active");
    assert.equal(created.body.sharedEntanglement.version, 1);
    assert.match(created.body.sharedEntanglement.id, /^shared_ent_/);

    const sharedEntanglementId = created.body.sharedEntanglement.id;
    const updated = await api(
      baseUrl,
      `/rooms/shared-entanglement-room/shared-entanglements/${sharedEntanglementId}`,
      {
        method: "PUT",
        body: {
          expectedVersion: 1,
          amplitudes: [0, Math.SQRT1_2, Math.SQRT1_2, 0],
          displayMode: "linked",
          linkRelation: "anti-correlated",
          status: "active",
          updatedBy: "alice",
        },
      },
    );
    assert.equal(updated.response.status, 200);
    assert.equal(updated.body.sharedEntanglement.version, 2);
    assert.equal(
      updated.body.sharedEntanglement.linkRelation,
      "anti-correlated",
    );

    const separated = await api(
      baseUrl,
      `/rooms/shared-entanglement-room/shared-entanglements/${sharedEntanglementId}`,
      {
        method: "PUT",
        body: {
          expectedVersion: 2,
          amplitudes: [0, 1, 0, 0],
          displayMode: "conditional",
          status: "separated",
          memberVectors: [
            [1, 0],
            [0, 1],
          ],
          updatedBy: "bob",
        },
      },
    );
    assert.equal(separated.response.status, 200);
    assert.equal(separated.body.sharedEntanglement.status, "separated");
    assert.deepEqual(separated.body.sharedEntanglement.memberVectors, [
      [1, 0],
      [0, 1],
    ]);

    const stale = await api(
      baseUrl,
      `/rooms/shared-entanglement-room/shared-entanglements/${sharedEntanglementId}`,
      {
        method: "PUT",
        body: {
          expectedVersion: 1,
          amplitudes: [1, 0, 0, 0],
          status: "active",
        },
      },
    );
    assert.equal(stale.response.status, 409);
    assert.equal(
      stale.body.error.code,
      "shared_entanglement_version_conflict",
    );
  });
});

test("backend versions multi-qubit shared mailbox entanglement state", async () => {
  await withBackend(async (baseUrl) => {
    await api(baseUrl, "/rooms", {
      method: "POST",
      body: {
        id: "shared-ghz-room",
        label: "Shared GHZ room",
      },
    });
    const created = await api(
      baseUrl,
      "/rooms/shared-ghz-room/shared-entanglements",
      {
        method: "POST",
        body: {
          numQubits: 3,
          amplitudes: [Math.SQRT1_2, 0, 0, 0, 0, 0, 0, Math.SQRT1_2],
          displayMode: "conditional",
          members: [
            { participantId: "bob", qubitIndex: 0, role: "retained" },
            { participantId: "alice", qubitIndex: 1, role: "received" },
            { participantId: "alice", qubitIndex: 2, role: "local" },
          ],
        },
      },
    );
    assert.equal(created.response.status, 201);
    assert.equal(created.body.sharedEntanglement.numQubits, 3);
    assert.equal(created.body.sharedEntanglement.amplitudes.length, 8);
    assert.equal(created.body.sharedEntanglement.members.length, 3);

    const sharedEntanglementId = created.body.sharedEntanglement.id;
    const updated = await api(
      baseUrl,
      `/rooms/shared-ghz-room/shared-entanglements/${sharedEntanglementId}`,
      {
        method: "PUT",
        body: {
          expectedVersion: 1,
          numQubits: 3,
          amplitudes: [0, Math.SQRT1_2, 0, 0, 0, 0, Math.SQRT1_2, 0],
          displayMode: "conditional",
          members: [
            { participantId: "bob", qubitIndex: 0, role: "retained" },
            { participantId: "alice", qubitIndex: 1, role: "received" },
            { participantId: "alice", qubitIndex: 2, role: "local" },
          ],
          updatedBy: "alice",
        },
      },
    );
    assert.equal(updated.response.status, 200);
    assert.equal(updated.body.sharedEntanglement.version, 2);
    assert.equal(updated.body.sharedEntanglement.numQubits, 3);

    const stale = await api(
      baseUrl,
      `/rooms/shared-ghz-room/shared-entanglements/${sharedEntanglementId}`,
      {
        method: "PUT",
        body: {
          expectedVersion: 1,
          numQubits: 3,
          amplitudes: [1, 0, 0, 0, 0, 0, 0, 0],
          status: "active",
        },
      },
    );
    assert.equal(stale.response.status, 409);
    assert.equal(
      stale.body.error.code,
      "shared_entanglement_version_conflict",
    );
  });
});

test("backend stores distributed teleportation protocol state", async () => {
  await withBackend(async (baseUrl) => {
    await api(baseUrl, "/rooms", {
      method: "POST",
      body: {
        id: "teleport-room",
        label: "Distributed teleportation verification",
      },
    });
    await api(baseUrl, "/rooms/teleport-room/registers/local-register", {
      method: "PUT",
      body: {
        numQubits: 3,
        amplitudes: [1, 0, 0, 0, 0, 0, 0, 0],
      },
    });

    const started = await api(baseUrl, "/rooms/teleport-room/distributed-teleportation/demo", {
      method: "PUT",
      body: {
        registerId: "local-register",
        stage: "bell-sent",
        messageKey: "tilted",
        messageVector: [Math.sqrt(0.8), Math.sqrt(0.2)],
        mailboxToken: "mbx_demo",
        createdBy: "bob",
      },
    });
    assert.equal(started.response.status, 200);
    assert.equal(started.body.protocol.stage, "bell-sent");
    assert.equal(started.body.protocol.version, 1);
    assert.equal(started.body.protocol.messageKey, "tilted");
    assert.deepEqual(started.body.protocol.completedSteps, ["bob-bell-mail"]);
    assert.equal(started.body.protocol.currentStep, "alice-measure-send");

    const measured = await api(baseUrl, "/rooms/teleport-room/distributed-teleportation/demo", {
      method: "PUT",
      body: {
        stage: "alice-measured",
        aliceBits: { source: 1, pair: 0 },
        updatedBy: "alice",
      },
    });
    assert.equal(measured.response.status, 200);
    assert.equal(measured.body.protocol.version, 2);
    assert.deepEqual(measured.body.protocol.aliceBits, { source: 1, pair: 0 });
    assert.deepEqual(measured.body.protocol.completedSteps, [
      "bob-bell-mail",
      "alice-measure-send",
    ]);
    assert.equal(measured.body.protocol.currentStep, "bob-correct-verify");

    const completed = await api(baseUrl, "/rooms/teleport-room/distributed-teleportation/demo", {
      method: "PUT",
      body: {
        stage: "complete",
        bobCorrection: ["Z"],
        fidelity: 1,
        updatedBy: "bob",
      },
    });
    assert.equal(completed.response.status, 200);
    assert.equal(completed.body.protocol.fidelity, 1);
    assert.deepEqual(completed.body.protocol.bobCorrection, ["Z"]);
    assert.equal(completed.body.protocol.currentStep, "complete");

    const fetched = await api(baseUrl, "/rooms/teleport-room/distributed-teleportation/demo");
    assert.equal(fetched.response.status, 200);
    assert.equal(fetched.body.protocol.stage, "complete");

    const reset = await api(baseUrl, "/rooms/teleport-room/distributed-teleportation/demo", {
      method: "PUT",
      body: {
        stage: "bell-sent",
        aliceBits: null,
        fidelity: null,
      },
    });
    assert.equal(reset.response.status, 200);
    assert.equal(reset.body.protocol.aliceBits, null);
    assert.equal(reset.body.protocol.fidelity, null);
    assert.deepEqual(reset.body.protocol.completedSteps, ["bob-bell-mail"]);
    assert.equal(reset.body.protocol.currentStep, "alice-measure-send");
  });
});

test("backend exposes generic protocol definitions and step runs", async () => {
  await withBackend(async (baseUrl) => {
    const definitions = await api(baseUrl, "/protocol-definitions");
    assert.equal(definitions.response.status, 200);
    assert.ok(
      definitions.body.protocols.some(
        (protocol) => protocol.type === "distributed-teleportation",
      ),
    );

    const ghzDefinition = await api(baseUrl, "/protocol-definitions/ghz-state");
    assert.equal(ghzDefinition.response.status, 200);
    assert.equal(ghzDefinition.body.protocol.label, "GHZ state");
    assert.ok(ghzDefinition.body.protocol.steps.length >= 3);

    await api(baseUrl, "/rooms", {
      method: "POST",
      body: {
        id: "protocol-room",
        label: "Protocol framework verification",
      },
    });

    const created = await api(baseUrl, "/rooms/protocol-room/protocols/demo-run", {
      method: "PUT",
      body: {
        type: "distributed-teleportation",
        createdBy: "bob",
      },
    });
    assert.equal(created.response.status, 200);
    assert.equal(created.body.protocol.type, "distributed-teleportation");
    assert.equal(created.body.protocol.currentStep, "bob-bell-mail");
    assert.deepEqual(created.body.protocol.completedSteps, []);
    assert.equal(created.body.definition.type, "distributed-teleportation");

    const advanced = await api(
      baseUrl,
      "/rooms/protocol-room/protocols/demo-run/steps/bob-bell-mail",
      {
        method: "POST",
        body: {
          completed: true,
          updatedBy: "bob",
        },
      },
    );
    assert.equal(advanced.response.status, 200);
    assert.deepEqual(advanced.body.protocol.completedSteps, ["bob-bell-mail"]);
    assert.equal(advanced.body.protocol.currentStep, "alice-measure-send");
    assert.equal(advanced.body.protocol.stepLog[0].stepId, "bob-bell-mail");

    const listed = await api(baseUrl, "/rooms/protocol-room/protocols");
    assert.equal(listed.response.status, 200);
    assert.equal(listed.body.protocols.length, 1);
    assert.equal(listed.body.protocols[0].label, "Distributed teleportation");

    const compatibility = await api(
      baseUrl,
      "/rooms/protocol-room/distributed-teleportation/demo-run",
    );
    assert.equal(compatibility.response.status, 200);
    assert.equal(compatibility.body.protocol.currentStep, "alice-measure-send");
  });
});

test("backend rejects invalid register and mailbox inputs", async () => {
  await withBackend(async (baseUrl) => {
    await api(baseUrl, "/rooms", {
      method: "POST",
      body: {
        id: "validation-room",
      },
    });

    const invalidRegister = await api(baseUrl, "/rooms/validation-room/registers/bad-register", {
      method: "PUT",
      body: {
        numQubits: 17,
      },
    });
    assert.equal(invalidRegister.response.status, 400);
    assert.equal(invalidRegister.body.error.code, "invalid_qubit_count");

    const register = await api(baseUrl, "/rooms/validation-room/registers/good-register", {
      method: "PUT",
      body: {
        numQubits: 1,
        amplitudes: [1, 0],
      },
    });
    assert.equal(register.response.status, 200);

    const invalidEmail = await api(baseUrl, "/rooms/validation-room/teleport-invites", {
      method: "POST",
      body: {
        registerId: "good-register",
        qubitIndex: 0,
        email: "alice",
      },
    });
    assert.equal(invalidEmail.response.status, 400);
    assert.equal(invalidEmail.body.error.code, "invalid_email");
  });
});

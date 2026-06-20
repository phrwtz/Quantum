"use strict";

const assert = require("node:assert/strict");
const test = require("node:test");
const { createServer } = require("../backend/server.cjs");

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

async function withBackend(callback) {
  const server = createServer();
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
    assert.equal(invite.body.invite.delivery.status, "stubbed");
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
        createdBy: "bob",
      },
    });
    assert.equal(transfer.response.status, 201);
    assert.equal(transfer.body.transfer.status, "pending");
    assert.equal(transfer.body.transfer.payload.kind, "register-snapshot");
    assert.equal(transfer.body.transfer.payload.selectedQubit, 1);
    assert.equal(transfer.body.transfer.payload.register.numQubits, 2);
    assert.match(transfer.body.transfer.token, /^mbx_/);
    assert.match(transfer.body.transfer.url, /\/mailbox\/mbx_/);

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

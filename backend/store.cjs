"use strict";

const crypto = require("node:crypto");

class BackendError extends Error {
  constructor(status, code, message, details = undefined) {
    super(message);
    this.name = "BackendError";
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function hasOwn(value, key) {
  return Object.prototype.hasOwnProperty.call(value, key);
}

function iso(nowMs) {
  return new Date(nowMs).toISOString();
}

function randomToken(byteLength = 10) {
  return crypto.randomBytes(byteLength).toString("base64url");
}

function validateString(value, field, { required = true, maxLength = 160 } = {}) {
  if (value == null || value === "") {
    if (required) {
      throw new BackendError(400, "invalid_input", `${field} is required`);
    }
    return null;
  }
  if (typeof value !== "string") {
    throw new BackendError(400, "invalid_input", `${field} must be a string`);
  }
  const trimmed = value.trim();
  if (!trimmed && required) {
    throw new BackendError(400, "invalid_input", `${field} is required`);
  }
  if (trimmed.length > maxLength) {
    throw new BackendError(400, "invalid_input", `${field} is too long`);
  }
  return trimmed || null;
}

function validateEmail(value) {
  const email = validateString(value, "email", { maxLength: 254 });
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    throw new BackendError(400, "invalid_email", "email must look like an email address");
  }
  return email;
}

function fillTokenTemplate(value, token) {
  if (typeof value !== "string" || !value.trim()) {
    return "";
  }
  return value
    .replaceAll("__TOKEN__", token)
    .replaceAll("{token}", token);
}

function fillMailboxBodyTemplate(value, { link, token }) {
  if (typeof value !== "string" || !value.trim()) {
    return "";
  }
  return value
    .replaceAll("__MAILBOX_LINK__", link || "(link unavailable)")
    .replaceAll("{mailboxLink}", link || "(link unavailable)")
    .replaceAll("__TOKEN__", token)
    .replaceAll("{token}", token);
}

function fillTeleportInviteBodyTemplate(value, { link, token }) {
  if (typeof value !== "string" || !value.trim()) {
    return "";
  }
  return value
    .replaceAll("__TELEPORT_LINK__", link || "(link unavailable)")
    .replaceAll("{teleportLink}", link || "(link unavailable)")
    .replaceAll("__INVITE_LINK__", link || "(link unavailable)")
    .replaceAll("{inviteLink}", link || "(link unavailable)")
    .replaceAll("__TOKEN__", token)
    .replaceAll("{token}", token);
}

function mailtoUrl({ to, subject, body }) {
  const query = new URLSearchParams({
    subject,
    body,
  });
  return `mailto:${encodeURIComponent(to)}?${query.toString()}`;
}

function mailboxDelivery({ email, from, token, metadata }) {
  const link = fillTokenTemplate(metadata.frontendLinkTemplate, token);
  const sender = from || metadata.from || "A Qubit Lab user";
  const subject =
    validateString(metadata.emailSubject, "metadata.emailSubject", {
      required: false,
      maxLength: 160,
    }) || "A qubit is waiting for you in Qubit Lab";
  const customBody = validateString(metadata.emailBody, "metadata.emailBody", {
      required: false,
      maxLength: 4000,
    });
  const body =
    fillMailboxBodyTemplate(customBody, { link, token }) ||
    [
      `${sender} sent you a qubit in Qubit Lab.`,
      "",
      "Open this link to receive it on the Teleportation tab:",
      link || "(link unavailable)",
      "",
      "This prototype uses the sender's local Qubit Lab backend, so the link works while that backend is running and reachable.",
    ].join("\n");
  return {
    channel: "email",
    status: "queued-local",
    to: email,
    from: from || null,
    subject,
    body,
    link,
    mailto: mailtoUrl({ to: email, subject, body }),
  };
}

function teleportInviteDelivery({ email, createdBy, token, metadata }) {
  const link = fillTokenTemplate(
    metadata.frontendLinkTemplate || metadata.teleportLinkTemplate,
    token,
  );
  const sender = createdBy || metadata.from || "A Qubit Lab user";
  const subject =
    validateString(metadata.emailSubject, "metadata.emailSubject", {
      required: false,
      maxLength: 160,
    }) || "You're invited to teleport a qubit in Qubit Lab";
  const customBody = validateString(metadata.emailBody, "metadata.emailBody", {
    required: false,
    maxLength: 4000,
  });
  const body =
    fillTeleportInviteBodyTemplate(customBody, { link, token }) ||
    [
      `${sender} invited you to help complete a distributed teleportation protocol in Qubit Lab.`,
      "",
      "Open this link to join the teleport invite:",
      link || "(link unavailable)",
      "",
      "This prototype uses the sender's Qubit Lab backend, so the link works while that backend is running and reachable.",
    ].join("\n");
  return {
    channel: "email",
    status: "queued-local",
    to: email,
    from: createdBy || null,
    subject,
    body,
    link,
    mailto: mailtoUrl({ to: email, subject, body }),
  };
}

function validateQubitCount(value) {
  if (!Number.isInteger(value) || value < 1 || value > 16) {
    throw new BackendError(400, "invalid_qubit_count", "numQubits must be an integer from 1 through 16");
  }
  return value;
}

function validateQubitIndex(value, numQubits, field = "qubitIndex") {
  if (!Number.isInteger(value) || value < 0 || value >= numQubits) {
    throw new BackendError(400, "invalid_qubit_index", `${field} must be an integer from 0 through ${numQubits - 1}`);
  }
  return value;
}

function normalizeAmplitude(value, index) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return { re: value, im: 0 };
  }
  if (Array.isArray(value) && value.length === 2 && value.every(Number.isFinite)) {
    return { re: value[0], im: value[1] };
  }
  if (
    value &&
    typeof value === "object" &&
    Number.isFinite(value.re) &&
    Number.isFinite(value.im ?? 0)
  ) {
    return { re: value.re, im: value.im ?? 0 };
  }
  throw new BackendError(400, "invalid_amplitude", `amplitudes[${index}] must be a finite number or { re, im }`);
}

function normalizeAmplitudes(amplitudes, numQubits) {
  if (amplitudes == null) {
    return null;
  }
  const expectedLength = 2 ** numQubits;
  if (!Array.isArray(amplitudes) || amplitudes.length !== expectedLength) {
    throw new BackendError(
      400,
      "invalid_amplitudes",
      `amplitudes must contain exactly ${expectedLength} entries for ${numQubits} qubits`,
    );
  }
  const normalized = amplitudes.map(normalizeAmplitude);
  const normSquared = normalized.reduce((sum, value) => sum + value.re * value.re + value.im * value.im, 0);
  if (normSquared <= 1e-24) {
    throw new BackendError(400, "invalid_amplitudes", "amplitudes must not all be zero");
  }
  return normalized;
}

function validateMetadata(value) {
  if (value == null) {
    return {};
  }
  if (typeof value !== "object" || Array.isArray(value)) {
    throw new BackendError(400, "invalid_input", "metadata must be an object");
  }
  return clone(value);
}

function inferSharedEntanglementQubitCount(input = {}) {
  if (input.numQubits != null) {
    return validateQubitCount(input.numQubits);
  }
  if (Array.isArray(input.amplitudes)) {
    const length = input.amplitudes.length;
    const numQubits = Math.log2(length);
    if (Number.isInteger(numQubits) && numQubits >= 1) {
      return validateQubitCount(numQubits);
    }
  }
  return 2;
}

function normalizeSharedEntanglementAmplitudes(value, numQubits, field = "amplitudes") {
  const expectedLength = 2 ** numQubits;
  if (
    !Array.isArray(value) ||
    value.length !== expectedLength ||
    !value.every((entry) => typeof entry === "number" && Number.isFinite(entry))
  ) {
    throw new BackendError(
      400,
      "invalid_shared_entanglement",
      `${field} must contain ${expectedLength} finite real amplitudes`,
    );
  }
  const normSquared = value.reduce((sum, entry) => sum + entry * entry, 0);
  if (normSquared <= 1e-24) {
    throw new BackendError(
      400,
      "invalid_shared_entanglement",
      `${field} must not be all zero`,
    );
  }
  const norm = Math.sqrt(normSquared);
  return value.map((entry) => entry / norm);
}

function normalizeSharedEntanglementMemberVectors(value, numQubits) {
  if (value == null) {
    return null;
  }
  if (!Array.isArray(value) || value.length !== numQubits) {
    throw new BackendError(
      400,
      "invalid_shared_entanglement",
      `memberVectors must contain ${numQubits} qubit vectors`,
    );
  }
  return value.map((vector, index) => {
    if (
      !Array.isArray(vector) ||
      vector.length !== 2 ||
      !vector.every((entry) => typeof entry === "number" && Number.isFinite(entry))
    ) {
      throw new BackendError(
        400,
        "invalid_shared_entanglement",
        `memberVectors[${index}] must contain two finite real amplitudes`,
      );
    }
    const norm = Math.hypot(vector[0], vector[1]);
    if (norm <= 1e-12) {
      throw new BackendError(
        400,
        "invalid_shared_entanglement",
        `memberVectors[${index}] must not be all zero`,
      );
    }
    return vector.map((entry) => entry / norm);
  });
}

function normalizeSharedEntanglementMembers(value, numQubits) {
  if (!Array.isArray(value)) {
    return [];
  }
  return value.slice(0, numQubits).map((member, index) => {
    if (!member || typeof member !== "object") {
      throw new BackendError(
        400,
        "invalid_shared_entanglement",
        `members[${index}] must be an object`,
      );
    }
    const qubitIndex = validateQubitIndex(
      Number.isInteger(member.qubitIndex) ? member.qubitIndex : index,
      numQubits,
      `members[${index}].qubitIndex`,
    );
    return {
      ...clone(member),
      qubitIndex,
    };
  });
}

function validateSharedEntanglementStatus(value) {
  const status =
    validateString(value, "status", { required: false, maxLength: 40 }) ||
    "active";
  if (!["active", "separated"].includes(status)) {
    throw new BackendError(
      400,
      "invalid_shared_entanglement",
      "status must be active or separated",
    );
  }
  return status;
}

function validateParticipantRole(value) {
  const role = validateString(value, "role", { required: false, maxLength: 40 }) || "editor";
  if (!["owner", "editor", "viewer"].includes(role)) {
    throw new BackendError(400, "invalid_participant_role", "role must be owner, editor, or viewer");
  }
  return role;
}

function permissionsForRole(role, overrides = null) {
  const base = {
    canView: true,
    canEdit: role === "owner" || role === "editor",
    canInvite: role === "owner" || role === "editor",
    canAdmin: role === "owner",
  };
  if (!overrides || typeof overrides !== "object" || Array.isArray(overrides)) {
    return base;
  }
  return {
    canView: overrides.canView ?? base.canView,
    canEdit: overrides.canEdit ?? base.canEdit,
    canInvite: overrides.canInvite ?? base.canInvite,
    canAdmin: overrides.canAdmin ?? base.canAdmin,
  };
}

function clampNumber(value, min, max, field) {
  if (!Number.isFinite(value)) {
    throw new BackendError(400, "invalid_input", `${field} must be a finite number`);
  }
  return Math.min(Math.max(value, min), max);
}

const PROTOCOL_DEFINITIONS = [
  {
    type: "distributed-teleportation",
    version: 1,
    label: "Distributed teleportation",
    summary:
      "Bob shares a Bell pair with Alice, Alice measures her message and pair qubit, and Bob applies the correction.",
    roles: ["Alice", "Bob"],
    steps: [
      {
        id: "bob-bell-mail",
        label: "Bob Bell + mail q1",
        actor: "Bob",
        summary: "Prepare the Bell pair q1-q2 and send q1 to Alice.",
      },
      {
        id: "alice-measure-send",
        label: "Alice measure + send bits",
        actor: "Alice",
        summary: "Entangle q0 with q1, measure both qubits, and send two classical bits.",
      },
      {
        id: "bob-correct-verify",
        label: "Bob correct + verify",
        actor: "Bob",
        summary: "Apply the X/Z correction to q2 and compare it with Alice's original message.",
      },
    ],
  },
  {
    type: "bell-test",
    version: 1,
    label: "Bell test",
    summary: "Prepare a Bell pair, choose measurement bases, and compare correlated outcomes.",
    roles: ["Alice", "Bob"],
    steps: [
      {
        id: "prepare-bell-pair",
        label: "Prepare Bell pair",
        actor: "Lab",
        summary: "Create a two-qubit Bell state.",
      },
      {
        id: "choose-bases",
        label: "Choose bases",
        actor: "Alice/Bob",
        summary: "Set measurement bases independently.",
      },
      {
        id: "compare-results",
        label: "Compare results",
        actor: "Lab",
        summary: "Inspect correlations across repeated measurements.",
      },
    ],
  },
  {
    type: "ghz-state",
    version: 1,
    label: "GHZ state",
    summary: "Build and inspect a three-or-more-qubit shared entangled state.",
    roles: ["Lab"],
    steps: [
      {
        id: "choose-qubits",
        label: "Choose qubits",
        actor: "Lab",
        summary: "Select the qubits that will join the GHZ register.",
      },
      {
        id: "hadamard-root",
        label: "Hadamard root",
        actor: "Lab",
        summary: "Place the first qubit in superposition.",
      },
      {
        id: "cascade-cnot",
        label: "Cascade C-NOT",
        actor: "Lab",
        summary: "Entangle the remaining qubits with the root qubit.",
      },
      {
        id: "inspect-correlations",
        label: "Inspect correlations",
        actor: "Lab",
        summary: "Read the register vector and measurement correlations.",
      },
    ],
  },
  {
    type: "superdense-coding",
    version: 1,
    label: "Superdense coding",
    summary: "Use one transmitted qubit plus shared entanglement to communicate two classical bits.",
    roles: ["Alice", "Bob"],
    steps: [
      {
        id: "share-bell-pair",
        label: "Share Bell pair",
        actor: "Alice/Bob",
        summary: "Distribute one qubit of an entangled pair to Alice.",
      },
      {
        id: "encode-two-bits",
        label: "Encode two bits",
        actor: "Alice",
        summary: "Apply the gate that encodes Alice's selected two-bit message.",
      },
      {
        id: "decode-bell-basis",
        label: "Decode Bell basis",
        actor: "Bob",
        summary: "Measure in the Bell basis to recover the two classical bits.",
      },
    ],
  },
  {
    type: "multi-user-entanglement",
    version: 1,
    label: "Multi-user entanglement",
    summary: "Coordinate a shared entangled register across several named participants.",
    roles: ["Host", "Participants"],
    steps: [
      {
        id: "create-room",
        label: "Create room",
        actor: "Host",
        summary: "Start a shared backend room.",
      },
      {
        id: "invite-participants",
        label: "Invite participants",
        actor: "Host",
        summary: "Send qubits or room links to participants.",
      },
      {
        id: "assign-qubits",
        label: "Assign qubits",
        actor: "Host",
        summary: "Record which participant controls each qubit.",
      },
      {
        id: "run-measurements",
        label: "Run measurements",
        actor: "Participants",
        summary: "Collect local measurements and compare shared state.",
      },
    ],
  },
  {
    type: "tour-introduction",
    version: 1,
    label: "Tour introduction",
    summary: "Treat the original tabs as a guided tour over the larger lab.",
    roles: ["Learner"],
    steps: [
      {
        id: "one-qubit",
        label: "One qubit",
        actor: "Learner",
        summary: "Explore a single qubit and measurement.",
      },
      {
        id: "two-qubits",
        label: "Two qubits",
        actor: "Learner",
        summary: "Compare two qubits in one register.",
      },
      {
        id: "entanglement-one",
        label: "Entanglement 1",
        actor: "Learner",
        summary: "Create and inspect a two-qubit entangled state.",
      },
      {
        id: "entanglement-two",
        label: "Entanglement 2",
        actor: "Learner",
        summary: "Use the C-NOT model to deepen the entanglement picture.",
      },
    ],
  },
];

const PROTOCOL_DEFINITION_BY_TYPE = new Map(
  PROTOCOL_DEFINITIONS.map((definition) => [definition.type, definition]),
);

const DISTRIBUTED_TELEPORTATION_STAGE_STEPS = {
  created: { completedSteps: [], currentStep: "bob-bell-mail" },
  "bell-sent": {
    completedSteps: ["bob-bell-mail"],
    currentStep: "alice-measure-send",
  },
  "alice-measured": {
    completedSteps: ["bob-bell-mail", "alice-measure-send"],
    currentStep: "bob-correct-verify",
  },
  complete: {
    completedSteps: [
      "bob-bell-mail",
      "alice-measure-send",
      "bob-correct-verify",
    ],
    currentStep: "complete",
  },
};

function protocolDefinition(type) {
  const protocolType = validateString(type, "type", { maxLength: 80 });
  const definition = PROTOCOL_DEFINITION_BY_TYPE.get(protocolType);
  if (!definition) {
    throw new BackendError(404, "protocol_definition_not_found", "protocol definition not found");
  }
  return definition;
}

function firstProtocolStep(definition) {
  return definition.steps[0]?.id || "complete";
}

function validateProtocolStepId(definition, stepId, field = "stepId") {
  const id = validateString(stepId, field, { maxLength: 80 });
  if (!definition.steps.some((step) => step.id === id)) {
    throw new BackendError(400, "invalid_protocol_step", `${field} is not part of the protocol definition`);
  }
  return id;
}

function normalizeCompletedSteps(definition, completedSteps) {
  if (!Array.isArray(completedSteps)) {
    return [];
  }
  const allowed = new Set(definition.steps.map((step) => step.id));
  return [...new Set(completedSteps.map((entry) => validateString(entry, "completedSteps", { maxLength: 80 })))]
    .filter((entry) => allowed.has(entry));
}

function createMemoryStore(options = {}) {
  const now = options.now || Date.now;
  const createToken = options.randomToken || randomToken;
  const sendReceiveStaleMs =
    Number.isFinite(options.sendReceiveRoomStaleMs) &&
    options.sendReceiveRoomStaleMs >= 0
      ? options.sendReceiveRoomStaleMs
      : 15000;
  const rooms = new Map();
  const teleportInvites = new Map();
  const mailboxTransfers = new Map();

  function timestamp() {
    return iso(now());
  }

  function requireRoom(roomId) {
    const room = rooms.get(roomId);
    if (!room) {
      throw new BackendError(404, "room_not_found", "room not found");
    }
    return room;
  }

  function requireRegister(room, registerId) {
    const register = room.registers[registerId];
    if (!register) {
      throw new BackendError(404, "register_not_found", "register not found");
    }
    return register;
  }

  function registerSummary(register) {
    return {
      registerId: register.id,
      numQubits: register.numQubits,
      ownerId: register.ownerId,
      version: register.version,
    };
  }

  function appendEvent(room, type, payload = {}) {
    const event = {
      id: `evt_${createToken(8)}`,
      type,
      at: timestamp(),
      payload: clone(payload),
    };
    room.events.push(event);
    if (room.events.length > 1000) {
      room.events.splice(0, room.events.length - 1000);
    }
    room.updatedAt = event.at;
    return event;
  }

  function clearRoomCollaborationState(room) {
    room.registers = {};
    room.entanglementGroups = {};
    room.sharedEntanglements = {};
    room.roomMeasurements = {};
    room.qubitIdentities = {};
    room.nextQubitIndex = 0;
    room.protocols = {};
    room.events = [];
    room.participants = {};
    room.ownerId = null;
    room.resetVersion = Math.max(0, Number(room.resetVersion) || 0) + 1;
    room.lastReset = {
      id: `room_reset_${createToken(10)}`,
      version: room.resetVersion,
      requestedBy: null,
      at: timestamp(),
    };
    room.updatedAt = room.lastReset.at;
  }

  function participantHasActiveSession(participant, nowMs = now()) {
    const updatedAt = Date.parse(participant?.updatedAt || "");
    return Number.isFinite(updatedAt) && nowMs - updatedAt <= sendReceiveStaleMs;
  }

  function createRoom(input = {}) {
    const id = validateString(input.id, "id", { required: false, maxLength: 80 }) || `room_${createToken(9)}`;
    if (rooms.has(id)) {
      throw new BackendError(409, "room_exists", "room already exists");
    }
    const at = timestamp();
    const room = {
      id,
      label: validateString(input.label, "label", { required: false }) || "Qubit Lab",
      ownerId: validateString(input.ownerId, "ownerId", { required: false }) || null,
      createdAt: at,
      updatedAt: at,
      participants: {},
      registers: {},
      entanglementGroups: {},
      sharedEntanglements: {},
      roomMeasurements: {},
      qubitIdentities: {},
      nextQubitIndex: 0,
      protocols: {},
      events: [],
      resetVersion: 0,
      lastReset: null,
    };
    if (room.ownerId) {
      room.participants[room.ownerId] = {
        id: room.ownerId,
        displayName: room.ownerId,
        role: "owner",
        permissions: permissionsForRole("owner"),
        createdAt: at,
        updatedAt: at,
      };
    }
    rooms.set(id, room);
    appendEvent(room, "room.created", { label: room.label, ownerId: room.ownerId });
    return clone(room);
  }

  function getRoom(roomId) {
    return clone(requireRoom(roomId));
  }

  function resetRoom(roomId, input = {}) {
    const room = requireRoom(roomId);
    const requestedBy =
      validateString(input.participantId, "participantId", {
        required: false,
        maxLength: 80,
      }) || null;
    room.registers = {};
    room.entanglementGroups = {};
    room.sharedEntanglements = {};
    room.roomMeasurements = {};
    room.protocols = {};
    room.events = [];
    room.resetVersion = Math.max(0, Number(room.resetVersion) || 0) + 1;
    room.lastReset = {
      id:
        validateString(input.id, "id", { required: false, maxLength: 160 }) ||
        `room_reset_${createToken(10)}`,
      version: room.resetVersion,
      requestedBy,
      at: timestamp(),
    };
    appendEvent(room, "room.reset", room.lastReset);
    return clone(room);
  }

  function deleteRoom(roomId, requestedBy) {
    const room = requireRoom(roomId);
    const participantId = validateString(requestedBy, "requestedBy", {
      maxLength: 80,
    });
    const canDelete = room.ownerId
      ? room.ownerId === participantId
      : Boolean(room.participants[participantId]);
    if (!canDelete) {
      throw new BackendError(
        403,
        "room_delete_forbidden",
        "only the room owner can delete this room",
      );
    }
    rooms.delete(room.id);
    for (const [token, invite] of teleportInvites) {
      if (invite.roomId === room.id) {
        teleportInvites.delete(token);
      }
    }
    for (const [token, transfer] of mailboxTransfers) {
      if (transfer.roomId === room.id) {
        mailboxTransfers.delete(token);
      }
    }
    return clone(room);
  }

  function getRegister(roomId, registerId) {
    const room = requireRoom(roomId);
    return clone(requireRegister(room, registerId));
  }

  function listRooms() {
    return [...rooms.values()].map((room) => ({
      id: room.id,
      label: room.label,
      ownerId: room.ownerId,
      createdAt: room.createdAt,
      updatedAt: room.updatedAt,
      registerCount: Object.keys(room.registers).length,
      entanglementGroupCount: Object.keys(room.entanglementGroups).length,
    }));
  }

  function listParticipants(roomId) {
    const room = requireRoom(roomId);
    return Object.values(room.participants)
      .sort((left, right) => left.displayName.localeCompare(right.displayName))
      .map(clone);
  }

  function ensureRoomQubitIdentityState(room) {
    if (!room.qubitIdentities || typeof room.qubitIdentities !== "object") {
      room.qubitIdentities = {};
    }
    if (!Number.isSafeInteger(room.nextQubitIndex) || room.nextQubitIndex < 0) {
      room.nextQubitIndex = Object.values(room.qubitIdentities).reduce(
        (maxIndex, identity) =>
          Math.max(
            maxIndex,
            Number.isSafeInteger(identity?.roomQubitIndex)
              ? identity.roomQubitIndex + 1
              : 0,
          ),
        0,
      );
    }
  }

  function allocateRoomQubits(roomId, input = {}) {
    const room = requireRoom(roomId);
    ensureRoomQubitIdentityState(room);
    const participantId = validateString(input.participantId, "participantId", {
      required: false,
      maxLength: 80,
    });
    const qubits = Array.isArray(input.qubits) ? input.qubits : [];
    if (!qubits.length) {
      return [];
    }
    const requestedBaseIndex = Number(input.baseRoomQubitIndex);
    const hasRequestedBaseIndex =
      Number.isSafeInteger(requestedBaseIndex) && requestedBaseIndex >= 0;
    const usedIndexes = new Set(
      Object.values(room.qubitIdentities)
        .map((identity) => identity?.roomQubitIndex)
        .filter(Number.isSafeInteger),
    );
    const reserveRoomQubitIndex = (offset) => {
      const preferredIndex = hasRequestedBaseIndex
        ? requestedBaseIndex + offset
        : null;
      if (
        Number.isSafeInteger(preferredIndex) &&
        preferredIndex >= 0 &&
        !usedIndexes.has(preferredIndex)
      ) {
        usedIndexes.add(preferredIndex);
        room.nextQubitIndex = Math.max(room.nextQubitIndex, preferredIndex + 1);
        return preferredIndex;
      }
      while (usedIndexes.has(room.nextQubitIndex)) {
        room.nextQubitIndex += 1;
      }
      const roomQubitIndex = room.nextQubitIndex++;
      usedIndexes.add(roomQubitIndex);
      return roomQubitIndex;
    };
    const at = timestamp();
    const assigned = qubits.map((qubit, offset) => {
      const roomQubitIndex = reserveRoomQubitIndex(offset);
      const qubitId = roomQubitIndex + 1;
      const identity = {
        roomId: room.id,
        roomQubitIndex,
        qubitId,
        label: `q${roomQubitIndex}`,
        participantId,
        clientId:
          validateString(qubit?.clientId, "clientId", {
            required: false,
            maxLength: 120,
          }) || `local-${offset}`,
        createdAt: at,
        updatedAt: at,
      };
      room.qubitIdentities[String(qubitId)] = identity;
      return identity;
    });
    appendEvent(room, "roomQubits.allocated", {
      participantId,
      qubits: assigned.map(({ clientId, roomQubitIndex, qubitId, label }) => ({
        clientId,
        roomQubitIndex,
        qubitId,
        label,
      })),
    });
    return clone(assigned);
  }

  function upsertParticipant(roomId, participantId, input = {}) {
    const room = requireRoom(roomId);
    const id =
      validateString(participantId, "participantId", { required: false, maxLength: 80 }) ||
      validateString(input.id, "id", { required: false, maxLength: 80 }) ||
      `usr_${createToken(9)}`;
    const existing = room.participants[id] || null;
    const role = validateParticipantRole(input.role || existing?.role);
    const at = timestamp();
    const participant = {
      id,
      displayName:
        validateString(input.displayName, "displayName", { required: false }) ||
        validateString(input.name, "name", { required: false }) ||
        existing?.displayName ||
        id,
      role,
      permissions: permissionsForRole(role, input.permissions || null),
      metadata:
        input.metadata == null
          ? existing?.metadata || {}
          : validateMetadata(input.metadata),
      createdAt: existing?.createdAt || at,
      updatedAt: at,
    };
    room.participants[id] = participant;
    appendEvent(room, existing ? "participant.updated" : "participant.created", {
      participantId: id,
      role: participant.role,
      displayName: participant.displayName,
    });
    return clone(participant);
  }

  function autoJoinRoom(roomId, input = {}) {
    const id = validateString(roomId, "roomId", {
      required: false,
      maxLength: 80,
    }) || "send-receive-room";
    let room = rooms.get(id) || null;
    if (!room) {
      room = createRoom({
        id,
        label:
          validateString(input.label, "label", {
            required: false,
            maxLength: 160,
          }) || id,
      });
      room = rooms.get(id);
    }
    if (
      id === "send-receive-room" &&
      Object.keys(room.participants).length > 0 &&
      !Object.values(room.participants).some((participant) =>
        participantHasActiveSession(participant),
      )
    ) {
      clearRoomCollaborationState(room);
    }
    const requestedId = validateString(input.participantId, "participantId", {
      required: false,
      maxLength: 80,
    });
    const clientSessionId = validateString(input.clientSessionId, "clientSessionId", {
      required: false,
      maxLength: 120,
    });
    const seats = [
      { id: "bob", displayName: "Bob", role: "owner" },
      { id: "alice", displayName: "Alice", role: "editor" },
    ];
    const matchingSessionSeat =
      clientSessionId &&
      seats.find(
        (seat) =>
          room.participants[seat.id]?.metadata?.clientSessionId ===
          clientSessionId,
      );
    const requestedSeat =
      requestedId && clientSessionId
        ? seats.find(
            (seat) =>
              seat.id === requestedId &&
              room.participants[seat.id]?.metadata?.clientSessionId ===
                clientSessionId,
          )
        : null;
    let seat =
      matchingSessionSeat ||
      requestedSeat ||
      seats.find((candidate) => !room.participants[candidate.id]);
    if (
      !seat &&
      id === "send-receive-room" &&
      input.resetIfFull === true
    ) {
      clearRoomCollaborationState(room);
      seat = seats[0];
    }
    if (!seat) {
      throw new BackendError(409, "room_full", "send-receive-room already has Bob and Alice");
    }
    const participant = upsertParticipant(id, seat.id, {
      displayName: seat.displayName,
      role: seat.role,
      metadata: {
        ...(room.participants[seat.id]?.metadata || {}),
        ...(clientSessionId ? { clientSessionId } : {}),
      },
    });
    room.ownerId = room.ownerId || "bob";
    return {
      room: clone(requireRoom(id)),
      participant,
      seat: seat.displayName,
    };
  }

  function touchParticipant(roomId, participantId) {
    const room = requireRoom(roomId);
    const id = validateString(participantId, "participantId", {
      maxLength: 80,
    });
    const participant = room.participants[id];
    if (!participant) {
      throw new BackendError(404, "participant_not_found", "participant not found");
    }
    participant.updatedAt = timestamp();
    return clone(participant);
  }

  function createRoomMessage(roomId, input = {}) {
    const room = requireRoom(roomId);
    const participantId = validateString(input.participantId, "participantId", {
      required: false,
      maxLength: 80,
    });
    const displayName =
      validateString(input.displayName, "displayName", {
        required: false,
        maxLength: 160,
      }) ||
      (participantId ? room.participants[participantId]?.displayName : null) ||
      "Guest";
    const message = validateString(input.message, "message", {
      maxLength: 1000,
    });
    return clone(
      appendEvent(room, "room.message", {
        participantId: participantId || null,
        displayName,
        message,
      }),
    );
  }

  function createRoomAction(roomId, input = {}) {
    const room = requireRoom(roomId);
    const participantId =
      validateString(input.participantId, "participantId", {
        required: false,
        maxLength: 80,
      }) || null;
    const actionType = validateString(input.actionType, "actionType", {
      maxLength: 80,
    });
    if (actionType !== "gate-setting") {
      throw new BackendError(
        400,
        "invalid_room_action",
        "unsupported room action type",
      );
    }
    const qubitLabel = validateString(input.qubitLabel, "qubitLabel", {
      required: false,
      maxLength: 40,
    });
    const gateLabel = validateString(input.gateLabel, "gateLabel", {
      required: false,
      maxLength: 80,
    });
    const tickIndex = Number.isSafeInteger(Number(input.tickIndex))
      ? Number(input.tickIndex)
      : null;
    return clone(
      appendEvent(room, "room.action", {
        participantId,
        actionType,
        qubitLabel: qubitLabel || null,
        gateLabel: gateLabel || null,
        tickIndex,
      }),
    );
  }

  function upsertRegister(roomId, input = {}) {
    const room = requireRoom(roomId);
    const id = validateString(input.id, "id", { required: false, maxLength: 80 }) || `reg_${createToken(9)}`;
    const numQubits = validateQubitCount(input.numQubits);
    const existing = room.registers[id] || null;
    if (
      existing &&
      input.expectedVersion != null &&
      input.expectedVersion !== existing.version
    ) {
      throw new BackendError(409, "register_version_conflict", "register version conflict", {
        currentVersion: existing.version,
        expectedVersion: input.expectedVersion,
      });
    }
    const at = timestamp();
    const register = {
      id,
      label: validateString(input.label, "label", { required: false }) || existing?.label || id,
      ownerId: validateString(input.ownerId, "ownerId", { required: false }) || existing?.ownerId || null,
      numQubits,
      amplitudes: normalizeAmplitudes(input.amplitudes, numQubits),
      metadata: validateMetadata(input.metadata),
      createdAt: existing?.createdAt || at,
      updatedAt: at,
      version: existing ? existing.version + 1 : 1,
    };
    room.registers[id] = register;
    appendEvent(room, existing ? "register.updated" : "register.created", {
      ...registerSummary(register),
    });
    return clone(register);
  }

  function createEntanglementGroup(roomId, input = {}) {
    const room = requireRoom(roomId);
    const qubits = Array.isArray(input.qubits) ? input.qubits : null;
    if (!qubits || qubits.length < 2) {
      throw new BackendError(400, "invalid_entanglement_group", "qubits must contain at least two qubit references");
    }
    const normalizedQubits = qubits.map((qubit, index) => {
      if (!qubit || typeof qubit !== "object") {
        throw new BackendError(400, "invalid_entanglement_group", `qubits[${index}] must be an object`);
      }
      const registerId = validateString(qubit.registerId, `qubits[${index}].registerId`, { maxLength: 80 });
      const register = requireRegister(room, registerId);
      return {
        registerId,
        qubitIndex: validateQubitIndex(qubit.qubitIndex, register.numQubits, `qubits[${index}].qubitIndex`),
      };
    });
    const id = validateString(input.id, "id", { required: false, maxLength: 80 }) || `ent_${createToken(9)}`;
    if (room.entanglementGroups[id]) {
      throw new BackendError(409, "entanglement_group_exists", "entanglement group already exists");
    }
    const at = timestamp();
    const group = {
      id,
      label: validateString(input.label, "label", { required: false }) || "Entanglement group",
      qubits: normalizedQubits,
      status: "active",
      metadata: validateMetadata(input.metadata),
      createdAt: at,
      updatedAt: at,
    };
    room.entanglementGroups[id] = group;
    appendEvent(room, "entanglementGroup.created", {
      entanglementGroupId: id,
      qubits: normalizedQubits,
    });
    return clone(group);
  }

  function createSharedEntanglement(roomId, input = {}) {
    const room = requireRoom(roomId);
    const id =
      validateString(input.id, "id", { required: false, maxLength: 100 }) ||
      `shared_ent_${createToken(12)}`;
    if (room.sharedEntanglements[id]) {
      throw new BackendError(
        409,
        "shared_entanglement_exists",
        "shared entanglement already exists",
      );
    }
    const at = timestamp();
    const numQubits = inferSharedEntanglementQubitCount(input);
    const sharedEntanglement = {
      id,
      roomId,
      numQubits,
      amplitudes: normalizeSharedEntanglementAmplitudes(input.amplitudes, numQubits),
      displayMode:
        validateString(input.displayMode, "displayMode", {
          required: false,
          maxLength: 40,
        }) || "marginal",
      linkRelation:
        validateString(input.linkRelation, "linkRelation", {
          required: false,
          maxLength: 40,
        }) || null,
      status: "active",
      memberVectors: null,
      members: normalizeSharedEntanglementMembers(input.members, numQubits),
      metadata: validateMetadata(input.metadata),
      createdAt: at,
      updatedAt: at,
      version: 1,
    };
    room.sharedEntanglements[id] = sharedEntanglement;
    appendEvent(room, "sharedEntanglement.created", {
      sharedEntanglementId: id,
      version: sharedEntanglement.version,
    });
    return clone(sharedEntanglement);
  }

  function getSharedEntanglement(roomId, sharedEntanglementId) {
    const room = requireRoom(roomId);
    const id = validateString(
      sharedEntanglementId,
      "sharedEntanglementId",
      { maxLength: 100 },
    );
    const sharedEntanglement = room.sharedEntanglements[id];
    if (!sharedEntanglement) {
      throw new BackendError(
        404,
        "shared_entanglement_not_found",
        "shared entanglement not found",
      );
    }
    return clone(sharedEntanglement);
  }

  function updateSharedEntanglement(roomId, sharedEntanglementId, input = {}) {
    const room = requireRoom(roomId);
    const current = getSharedEntanglement(roomId, sharedEntanglementId);
    if (
      input.expectedVersion != null &&
      input.expectedVersion !== current.version
    ) {
      throw new BackendError(
        409,
        "shared_entanglement_version_conflict",
        "shared entanglement version conflict",
        {
          currentVersion: current.version,
          expectedVersion: input.expectedVersion,
        },
      );
    }
    const numQubits = inferSharedEntanglementQubitCount({
      numQubits: input.numQubits ?? current.numQubits ?? 2,
      amplitudes: input.amplitudes,
    });
    const next = {
      ...current,
      numQubits,
      amplitudes: normalizeSharedEntanglementAmplitudes(input.amplitudes, numQubits),
      displayMode:
        validateString(input.displayMode, "displayMode", {
          required: false,
          maxLength: 40,
        }) || current.displayMode,
      linkRelation:
        input.linkRelation == null
          ? null
          : validateString(input.linkRelation, "linkRelation", {
              required: false,
              maxLength: 40,
            }),
      status:
        input.status == null
          ? current.status
          : validateSharedEntanglementStatus(input.status),
      memberVectors: normalizeSharedEntanglementMemberVectors(input.memberVectors, numQubits),
      members:
        input.members == null
          ? current.members
          : normalizeSharedEntanglementMembers(input.members, numQubits),
      metadata:
        input.metadata == null
          ? current.metadata
          : validateMetadata(input.metadata),
      updatedAt: timestamp(),
      version: current.version + 1,
    };
    room.sharedEntanglements[next.id] = next;
    appendEvent(room, "sharedEntanglement.updated", {
      sharedEntanglementId: next.id,
      status: next.status,
      version: next.version,
      updatedBy:
        validateString(input.updatedBy, "updatedBy", {
          required: false,
          maxLength: 160,
        }) || null,
    });
    return clone(next);
  }

  function listProtocolDefinitions() {
    return clone(PROTOCOL_DEFINITIONS);
  }

  function getProtocolDefinition(type) {
    return clone(protocolDefinition(type));
  }

  function protocolSummary(protocol) {
    const definition = protocolDefinition(protocol.type);
    return {
      id: protocol.id,
      type: protocol.type,
      label: definition.label,
      summary: definition.summary,
      stage: protocol.stage,
      currentStep: protocol.currentStep,
      completedSteps: [...protocol.completedSteps],
      registerId: protocol.registerId,
      createdBy: protocol.createdBy,
      updatedBy: protocol.updatedBy,
      createdAt: protocol.createdAt,
      updatedAt: protocol.updatedAt,
      version: protocol.version,
    };
  }

  function listProtocols(roomId) {
    const room = requireRoom(roomId);
    return Object.values(room.protocols)
      .sort((left, right) => left.updatedAt.localeCompare(right.updatedAt))
      .map(protocolSummary);
  }

  function normalizeProtocolProgress(definition, existing, input) {
    const stage =
      validateString(input.stage, "stage", { required: false, maxLength: 80 }) ||
      existing?.stage ||
      "created";
    const mappedProgress =
      definition.type === "distributed-teleportation" &&
      hasOwn(input, "stage")
        ? DISTRIBUTED_TELEPORTATION_STAGE_STEPS[stage]
        : null;
    const completedSteps = hasOwn(input, "completedSteps")
      ? normalizeCompletedSteps(definition, input.completedSteps)
      : mappedProgress?.completedSteps ||
        normalizeCompletedSteps(definition, existing?.completedSteps || []);
    const currentStep =
      validateString(input.currentStep, "currentStep", { required: false, maxLength: 80 }) ||
      mappedProgress?.currentStep ||
      existing?.currentStep ||
      firstProtocolStep(definition);
    if (currentStep !== "complete") {
      validateProtocolStepId(definition, currentStep, "currentStep");
    }
    return {
      stage,
      currentStep,
      completedSteps,
    };
  }

  function upsertProtocol(roomId, protocolId, input = {}) {
    const room = requireRoom(roomId);
    const id =
      validateString(protocolId, "protocolId", { required: false, maxLength: 80 }) ||
      validateString(input.id, "id", { required: false, maxLength: 80 }) ||
      `prt_${createToken(9)}`;
    const existing = room.protocols[id] || null;
    const type =
      validateString(input.type, "type", { required: false, maxLength: 80 }) ||
      existing?.type ||
      "distributed-teleportation";
    if (existing && existing.type !== type) {
      throw new BackendError(409, "protocol_type_conflict", "protocol already exists with a different type", {
        currentType: existing.type,
        requestedType: type,
      });
    }
    const definition = protocolDefinition(type);
    const at = timestamp();
    const registerId =
      validateString(input.registerId, "registerId", { required: false, maxLength: 80 }) ||
      existing?.registerId ||
      null;
    if (registerId) {
      requireRegister(room, registerId);
    }
    const progress = normalizeProtocolProgress(definition, existing, input);
    const protocol = {
      id,
      type,
      definitionVersion: definition.version,
      stage: progress.stage,
      currentStep: progress.currentStep,
      completedSteps: progress.completedSteps,
      registerId,
      messageKey:
        validateString(input.messageKey, "messageKey", { required: false, maxLength: 80 }) ||
        existing?.messageKey ||
        null,
      messageVector: hasOwn(input, "messageVector")
        ? input.messageVector == null
          ? null
          : normalizeAmplitudes(input.messageVector, 1)
        : existing?.messageVector || null,
      mailboxToken:
        validateString(input.mailboxToken, "mailboxToken", { required: false, maxLength: 120 }) ||
        existing?.mailboxToken ||
        null,
      aliceBits: hasOwn(input, "aliceBits")
        ? input.aliceBits == null
          ? null
          : {
              source: input.aliceBits.source === 1 ? 1 : 0,
              pair: input.aliceBits.pair === 1 ? 1 : 0,
            }
        : existing?.aliceBits || null,
      bobCorrection:
        Array.isArray(input.bobCorrection)
          ? input.bobCorrection.map((entry) => validateString(entry, "bobCorrection", { maxLength: 10 }))
          : existing?.bobCorrection || [],
      fidelity: hasOwn(input, "fidelity")
        ? input.fidelity == null
          ? null
          : clampNumber(input.fidelity, 0, 1, "fidelity")
        : existing?.fidelity ?? null,
      createdBy:
        validateString(input.createdBy, "createdBy", { required: false }) ||
        existing?.createdBy ||
        null,
      updatedBy:
        validateString(input.updatedBy, "updatedBy", { required: false }) ||
        existing?.updatedBy ||
        null,
      metadata:
        input.metadata == null
          ? existing?.metadata || {}
          : validateMetadata(input.metadata),
      stepLog: Array.isArray(input.stepLog)
        ? clone(input.stepLog)
        : Array.isArray(existing?.stepLog)
          ? clone(existing.stepLog)
          : [],
      createdAt: existing?.createdAt || at,
      updatedAt: at,
      version: existing ? existing.version + 1 : 1,
    };
    room.protocols[id] = protocol;
    appendEvent(room, existing ? "protocol.updated" : "protocol.created", {
      protocolId: id,
      type: protocol.type,
      stage: protocol.stage,
      registerId: protocol.registerId,
      version: protocol.version,
    });
    return clone(protocol);
  }

  function getProtocol(roomId, protocolId, expectedType = null) {
    const room = requireRoom(roomId);
    const protocol = room.protocols[protocolId];
    if (!protocol || (expectedType && protocol.type !== expectedType)) {
      throw new BackendError(404, "protocol_not_found", "protocol not found");
    }
    return clone(protocol);
  }

  function updateProtocolStep(roomId, protocolId, stepId, input = {}) {
    const room = requireRoom(roomId);
    const existing = room.protocols[protocolId];
    if (!existing) {
      throw new BackendError(404, "protocol_not_found", "protocol not found");
    }
    const definition = protocolDefinition(existing.type);
    const normalizedStepId = validateProtocolStepId(definition, stepId);
    const completedSteps = new Set(existing.completedSteps || []);
    const completed = input.completed !== false;
    if (completed) {
      completedSteps.add(normalizedStepId);
    } else {
      completedSteps.delete(normalizedStepId);
    }
    const completedList = normalizeCompletedSteps(definition, [...completedSteps]);
    const nextStep =
      definition.steps.find((step) => !completedList.includes(step.id))?.id ||
      "complete";
    const currentStep =
      validateString(input.currentStep, "currentStep", { required: false, maxLength: 80 }) ||
      nextStep;
    if (currentStep !== "complete") {
      validateProtocolStepId(definition, currentStep, "currentStep");
    }
    const at = timestamp();
    const updatedBy =
      validateString(input.updatedBy, "updatedBy", { required: false }) ||
      existing.updatedBy ||
      null;
    const logEntry = {
      stepId: normalizedStepId,
      status: completed ? "completed" : "reopened",
      at,
      by: updatedBy,
    };
    const note = validateString(input.note, "note", { required: false, maxLength: 240 });
    if (note) {
      logEntry.note = note;
    }
    const protocol = {
      ...existing,
      stage:
        validateString(input.stage, "stage", { required: false, maxLength: 80 }) ||
        (currentStep === "complete" ? "complete" : existing.stage),
      currentStep,
      completedSteps: completedList,
      updatedBy,
      metadata:
        input.metadata == null
          ? existing.metadata || {}
          : validateMetadata(input.metadata),
      stepLog: [...(existing.stepLog || []), logEntry].slice(-100),
      updatedAt: at,
      version: existing.version + 1,
    };
    room.protocols[protocol.id] = protocol;
    appendEvent(room, "protocol.stepUpdated", {
      protocolId: protocol.id,
      type: protocol.type,
      stepId: normalizedStepId,
      status: logEntry.status,
      currentStep: protocol.currentStep,
      version: protocol.version,
    });
    return clone(protocol);
  }

  function upsertDistributedTeleportationProtocol(roomId, protocolId, input = {}) {
    return upsertProtocol(roomId, protocolId, {
      ...input,
      type: "distributed-teleportation",
    });
  }

  function getDistributedTeleportationProtocol(roomId, protocolId) {
    return getProtocol(roomId, protocolId, "distributed-teleportation");
  }

  function createTeleportInvite(roomId, input = {}) {
    const room = requireRoom(roomId);
    const registerId = validateString(input.registerId, "registerId", { maxLength: 80 });
    const register = requireRegister(room, registerId);
    const qubitIndex = validateQubitIndex(input.qubitIndex, register.numQubits);
    const email = validateEmail(input.email);
    const metadata = validateMetadata(input.metadata);
    const token = `tpl_${createToken(18)}`;
    const at = timestamp();
    const createdBy =
      validateString(input.createdBy, "createdBy", { required: false }) || null;
    const invite = {
      token,
      roomId,
      registerId,
      qubitIndex,
      email,
      createdBy,
      status: "pending",
      path: `/teleport/${token}`,
      createdAt: at,
      acceptedAt: null,
      acceptedBy: null,
      delivery: teleportInviteDelivery({ email, createdBy, token, metadata }),
      metadata,
    };
    teleportInvites.set(token, invite);
    appendEvent(room, "teleportInvite.created", {
      token,
      registerId,
      qubitIndex,
      email,
      createdBy: invite.createdBy,
    });
    return clone(invite);
  }

  function createMailboxTransfer(roomId, input = {}) {
    const room = requireRoom(roomId);
    const registerId = validateString(input.registerId, "registerId", { maxLength: 80 });
    const register = requireRegister(room, registerId);
    const qubitIndex = validateQubitIndex(input.qubitIndex, register.numQubits);
    const email = validateEmail(input.email);
    const from = validateString(input.from, "from", { required: false, maxLength: 254 });
    const metadata = validateMetadata(input.metadata);
    const token = `mbx_${createToken(18)}`;
    const at = timestamp();
    const transfer = {
      token,
      roomId,
      registerId,
      qubitIndex,
      email,
      from,
      createdBy: validateString(input.createdBy, "createdBy", { required: false }) || null,
      status: "pending",
      path: `/mailbox/${token}`,
      createdAt: at,
      claimedAt: null,
      claimedBy: null,
      delivery: mailboxDelivery({ email, from, token, metadata }),
      payload: {
        kind: "register-snapshot",
        selectedQubit: qubitIndex,
        register: clone(register),
      },
      metadata,
    };
    mailboxTransfers.set(token, transfer);
    appendEvent(room, "mailboxTransfer.created", {
      token,
      registerId,
      qubitIndex,
      email,
      createdBy: transfer.createdBy,
    });
    return clone(transfer);
  }

  function createRoomMailboxNotification(roomId, input = {}) {
    const room = requireRoom(roomId);
    const fromParticipantId = validateString(
      input.fromParticipantId,
      "fromParticipantId",
      { required: false, maxLength: 80 },
    );
    const fromName =
      validateString(input.fromName, "fromName", {
        required: false,
        maxLength: 160,
      }) ||
      (fromParticipantId ? room.participants[fromParticipantId]?.displayName : null) ||
      "Guest";
    const toParticipantId = validateString(
      input.toParticipantId,
      "toParticipantId",
      { required: false, maxLength: 80 },
    );
    const toName =
      validateString(input.toName, "toName", {
        required: false,
        maxLength: 160,
      }) ||
      (toParticipantId ? room.participants[toParticipantId]?.displayName : null) ||
      null;
    const message = validateString(input.message, "message", {
      required: false,
      maxLength: 1000,
    });
    const qubitLabel =
      validateString(input.qubitLabel, "qubitLabel", {
        required: false,
        maxLength: 80,
      }) || "a qubit";
    const transfer = input.transfer == null ? null : validateMetadata(input.transfer);
    const dedupeKey = validateString(input.dedupeKey, "dedupeKey", {
      required: false,
      maxLength: 200,
    });
    if (dedupeKey) {
      const existing = room.events.find(
        (event) =>
          event?.type === "roomMailbox.sent" &&
          event.payload?.dedupeKey === dedupeKey,
      );
      if (existing) {
        return clone(existing);
      }
    }
    const notification = {
      id: `room_mbx_${createToken(12)}`,
      fromParticipantId: fromParticipantId || null,
      fromName,
      toParticipantId: toParticipantId || null,
      toName,
      message: message || "",
      qubitLabel,
      transfer,
      dedupeKey: dedupeKey || null,
    };
    return clone(appendEvent(room, "roomMailbox.sent", notification));
  }

  function roomMeasurementQueues(measurement, numQubits) {
    return Object.fromEntries(
      Array.from({ length: numQubits }, (_item, index) => {
        const key = String(index);
        const queue = Array.isArray(measurement.pendingQueues?.[key])
          ? measurement.pendingQueues[key].map(clone)
          : [];
        const legacyEntry = measurement.pending?.[key];
        if (legacyEntry?.color && queue.length === 0) {
          queue.push(clone(legacyEntry));
        }
        return [key, queue];
      }),
    );
  }

  function roomMeasurementQueuesComplete(queues, numQubits) {
    return Array.from({ length: numQubits }, (_item, index) =>
      Boolean(queues[String(index)]?.[0]?.color),
    ).every(Boolean);
  }

  function roomMeasurementOutcomeKeyFromQueues(queues, numQubits) {
    return Array.from({ length: numQubits }, (_item, index) => {
      const entry = queues[String(index)]?.[0];
      return entry?.color === "red" ? "r" : "b";
    }).join("");
  }

  function roomMeasurementPendingFromQueues(queues, numQubits) {
    return Object.fromEntries(
      Array.from({ length: numQubits }, (_item, index) => {
        const key = String(index);
        const entry = queues[key]?.[0];
        return entry?.color ? [key, clone(entry)] : null;
      }).filter(Boolean),
    );
  }

  function roomMeasurementExperiment(input = {}) {
    if (!input || typeof input !== "object") {
      return null;
    }
    const actions = Array.isArray(input.actions) ? input.actions : [];
    if (actions.length === 0 || actions.length > 2000) {
      return null;
    }
    const experiment = {
      version: 1,
      recordedAt: Number.isFinite(Number(input.recordedAt))
        ? Math.round(Number(input.recordedAt))
        : timestamp(),
      initialQubits: Array.isArray(input.initialQubits)
        ? input.initialQubits.slice(0, 16).map(clone)
        : [],
      gateSettings: Array.isArray(input.gateSettings)
        ? input.gateSettings.slice(0, 32).map(clone)
        : [],
      actions: actions.map(clone),
    };
    return clone(experiment);
  }

  function recordRoomMeasurement(roomId, measurementId, input = {}) {
    const room = requireRoom(roomId);
    if (!room.roomMeasurements || typeof room.roomMeasurements !== "object") {
      room.roomMeasurements = {};
    }
    const id = validateString(measurementId, "measurementId", {
      maxLength: 160,
    });
    const numQubits = Math.max(
      2,
      Math.min(4, validateQubitCount(input.numQubits || 4)),
    );
    const qubitIndex = validateQubitIndex(input.qubitIndex, numQubits);
    const color =
      validateString(input.color, "color", { maxLength: 20 }) === "red"
        ? "red"
        : "blue";
    const existing = room.roomMeasurements[id] || {
      id,
      roomId: room.id,
      numQubits,
      counts: {},
      pending: {},
      pendingQueues: {},
      lastOutcomeKey: null,
      completionId: null,
      completedAt: null,
      control: null,
      experiment: null,
      createdAt: timestamp(),
      updatedAt: null,
      version: 0,
    };
    existing.numQubits = numQubits;
    const experiment = roomMeasurementExperiment(input.experiment);
    if (experiment) {
      existing.experiment = experiment;
    }
    const queues = roomMeasurementQueues(existing, numQubits);
    const queueKey = String(qubitIndex);
    const participantId =
      validateString(input.participantId, "participantId", {
        required: false,
        maxLength: 80,
      }) || null;
    const logicalQubitId =
      Number.isSafeInteger(Number(input.logicalQubitId)) &&
      Number(input.logicalQubitId) > 0
        ? Number(input.logicalQubitId)
        : null;
    queues[queueKey].push({
      color,
      participantId,
      logicalQubitId,
      measuredAt: timestamp(),
    });
    let completed = false;
    let outcomeKey = "";
    while (roomMeasurementQueuesComplete(queues, numQubits)) {
      outcomeKey = roomMeasurementOutcomeKeyFromQueues(queues, numQubits);
      existing.counts[outcomeKey] =
        Math.max(0, Math.round(Number(existing.counts[outcomeKey]) || 0)) + 1;
      existing.lastOutcomeKey = outcomeKey;
      existing.completedAt = timestamp();
      existing.completionId = `room_measurement_${createToken(10)}`;
      completed = true;
      Array.from({ length: numQubits }, (_item, index) => {
        queues[String(index)].shift();
      });
    }
    existing.pendingQueues = queues;
    existing.pending = roomMeasurementPendingFromQueues(queues, numQubits);
    existing.updatedAt = timestamp();
    existing.version += 1;
    room.roomMeasurements[id] = existing;
    appendEvent(room, "roomMeasurement.updated", {
      measurementId: id,
      numQubits,
      qubitIndex,
      participantId,
      logicalQubitId,
      color,
      completed,
      outcomeKey: outcomeKey || null,
      completionId: existing.completionId,
    });
    return clone(existing);
  }

  function updateRoomMeasurementControl(roomId, measurementId, input = {}) {
    const room = requireRoom(roomId);
    if (!room.roomMeasurements || typeof room.roomMeasurements !== "object") {
      room.roomMeasurements = {};
    }
    const id = validateString(measurementId, "measurementId", {
      maxLength: 160,
    });
    const existing = room.roomMeasurements[id];
    if (!existing) {
      throw new BackendError(404, "room_measurement_not_found", "room measurement not found");
    }
    const type = validateString(input.type, "type", { maxLength: 80 });
    if (type !== "experiment-repeat" && type !== "experiment-count") {
      throw new BackendError(400, "invalid_measurement_control", "type must be experiment-repeat or experiment-count");
    }
    const iterations = Math.max(
      1,
      Math.min(100000, Math.round(Number(input.iterations) || 1)),
    );
    if (type === "experiment-count") {
      existing.counts = {};
      existing.pending = {};
      existing.pendingQueues = {};
      existing.lastOutcomeKey = null;
      existing.completionId = null;
      existing.completedAt = null;
    }
    existing.control = {
      id:
        validateString(input.id, "id", { required: false, maxLength: 160 }) ||
        `room_measurement_control_${createToken(10)}`,
      type,
      iterations,
      requestedBy:
        validateString(input.participantId, "participantId", {
          required: false,
          maxLength: 80,
        }) || null,
      createdAt: timestamp(),
      startAt: Number.isFinite(Number(input.startAt))
        ? Math.max(0, Math.round(Number(input.startAt)))
        : timestamp(),
    };
    existing.updatedAt = timestamp();
    existing.version += 1;
    room.roomMeasurements[id] = existing;
    appendEvent(room, "roomMeasurement.control", {
      measurementId: id,
      controlId: existing.control.id,
      type,
      iterations,
      requestedBy: existing.control.requestedBy,
      startAt: existing.control.startAt,
    });
    return clone(existing);
  }

  function listRoomMeasurements(roomId) {
    const room = requireRoom(roomId);
    const measurements =
      room.roomMeasurements && typeof room.roomMeasurements === "object"
        ? room.roomMeasurements
        : {};
    return Object.values(measurements).map(clone);
  }

  function getTeleportInvite(token) {
    const invite = teleportInvites.get(token);
    if (!invite) {
      throw new BackendError(404, "teleport_invite_not_found", "teleport invite not found");
    }
    return clone(invite);
  }

  function updateTeleportInviteDelivery(token, delivery = {}) {
    const invite = teleportInvites.get(token);
    if (!invite) {
      throw new BackendError(404, "teleport_invite_not_found", "teleport invite not found");
    }
    invite.delivery = clone(delivery);
    const room = requireRoom(invite.roomId);
    appendEvent(room, "teleportInvite.delivery", {
      token,
      status: invite.delivery.status || null,
      provider: invite.delivery.provider || null,
    });
    return clone(invite);
  }

  function getMailboxTransfer(token) {
    const transfer = mailboxTransfers.get(token);
    if (!transfer) {
      throw new BackendError(404, "mailbox_transfer_not_found", "mailbox transfer not found");
    }
    return clone(transfer);
  }

  function updateMailboxTransferDelivery(token, delivery = {}) {
    const transfer = mailboxTransfers.get(token);
    if (!transfer) {
      throw new BackendError(404, "mailbox_transfer_not_found", "mailbox transfer not found");
    }
    transfer.delivery = clone(delivery);
    const room = requireRoom(transfer.roomId);
    appendEvent(room, "mailboxTransfer.delivery", {
      token,
      status: transfer.delivery.status || null,
      provider: transfer.delivery.provider || null,
    });
    return clone(transfer);
  }

  function acceptTeleportInvite(token, input = {}) {
    const invite = teleportInvites.get(token);
    if (!invite) {
      throw new BackendError(404, "teleport_invite_not_found", "teleport invite not found");
    }
    if (invite.status !== "pending") {
      throw new BackendError(409, "teleport_invite_closed", "teleport invite is no longer pending");
    }
    invite.status = "accepted";
    invite.acceptedAt = timestamp();
    invite.acceptedBy = validateString(input.acceptedBy, "acceptedBy", { required: false }) || null;
    const room = requireRoom(invite.roomId);
    appendEvent(room, "teleportInvite.accepted", {
      token,
      acceptedBy: invite.acceptedBy,
    });
    return clone(invite);
  }

  function claimMailboxTransfer(token, input = {}) {
    const transfer = mailboxTransfers.get(token);
    if (!transfer) {
      throw new BackendError(404, "mailbox_transfer_not_found", "mailbox transfer not found");
    }
    if (transfer.status !== "pending") {
      throw new BackendError(409, "mailbox_transfer_closed", "mailbox transfer is no longer pending");
    }
    transfer.status = "claimed";
    transfer.claimedAt = timestamp();
    transfer.claimedBy = validateString(input.claimedBy, "claimedBy", { required: false }) || null;
    const room = requireRoom(transfer.roomId);
    appendEvent(room, "mailboxTransfer.claimed", {
      token,
      claimedBy: transfer.claimedBy,
    });
    return clone(transfer);
  }

  function getRoomEvents(roomId) {
    return clone(requireRoom(roomId).events);
  }

  return {
    createRoom,
    getRoom,
    resetRoom,
    deleteRoom,
    getRegister,
    listRooms,
    listParticipants,
    allocateRoomQubits,
    upsertParticipant,
    autoJoinRoom,
    touchParticipant,
    createRoomMessage,
    upsertRegister,
    createEntanglementGroup,
    createSharedEntanglement,
    getSharedEntanglement,
    updateSharedEntanglement,
    listProtocolDefinitions,
    getProtocolDefinition,
    listProtocols,
    upsertProtocol,
    getProtocol,
    updateProtocolStep,
    upsertDistributedTeleportationProtocol,
    getDistributedTeleportationProtocol,
    createTeleportInvite,
    createMailboxTransfer,
    createRoomMailboxNotification,
    createRoomAction,
    recordRoomMeasurement,
    updateRoomMeasurementControl,
    listRoomMeasurements,
    updateTeleportInviteDelivery,
    updateMailboxTransferDelivery,
    getTeleportInvite,
    getMailboxTransfer,
    acceptTeleportInvite,
    claimMailboxTransfer,
    getRoomEvents,
  };
}

module.exports = {
  BackendError,
  createMemoryStore,
};

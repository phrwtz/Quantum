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
      protocols: {},
      events: [],
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
    const token = `tpl_${createToken(18)}`;
    const at = timestamp();
    const invite = {
      token,
      roomId,
      registerId,
      qubitIndex,
      email,
      createdBy: validateString(input.createdBy, "createdBy", { required: false }) || null,
      status: "pending",
      path: `/teleport/${token}`,
      createdAt: at,
      acceptedAt: null,
      acceptedBy: null,
      delivery: {
        channel: "email",
        status: "stubbed",
        to: email,
      },
      metadata: validateMetadata(input.metadata),
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
    const token = `mbx_${createToken(18)}`;
    const at = timestamp();
    const transfer = {
      token,
      roomId,
      registerId,
      qubitIndex,
      email,
      createdBy: validateString(input.createdBy, "createdBy", { required: false }) || null,
      status: "pending",
      path: `/mailbox/${token}`,
      createdAt: at,
      claimedAt: null,
      claimedBy: null,
      delivery: {
        channel: "email",
        status: "stubbed",
        to: email,
      },
      payload: {
        kind: "register-snapshot",
        selectedQubit: qubitIndex,
        register: clone(register),
      },
      metadata: validateMetadata(input.metadata),
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

  function getTeleportInvite(token) {
    const invite = teleportInvites.get(token);
    if (!invite) {
      throw new BackendError(404, "teleport_invite_not_found", "teleport invite not found");
    }
    return clone(invite);
  }

  function getMailboxTransfer(token) {
    const transfer = mailboxTransfers.get(token);
    if (!transfer) {
      throw new BackendError(404, "mailbox_transfer_not_found", "mailbox transfer not found");
    }
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
    getRegister,
    listRooms,
    listParticipants,
    upsertParticipant,
    upsertRegister,
    createEntanglementGroup,
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

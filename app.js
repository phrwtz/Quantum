const tabButtons = Array.from(document.querySelectorAll(".tab-btn"));
const tabPanels = Array.from(document.querySelectorAll(".tab-panel"));
const simulatorTemplate = document.getElementById("simulatorTemplate");
const pairMeasurementToolTemplate = document.getElementById(
  "pairMeasurementToolTemplate",
);
const cnotGateTemplate = document.getElementById("cnotGateTemplate");
const playgroundCanvas = document.getElementById("playgroundCanvas");
const playgroundComponentSelect = document.getElementById(
  "playgroundComponentSelect",
);
const playgroundSnapToggle = document.getElementById("playgroundSnapToggle");
const playgroundDuplicateButton = document.getElementById(
  "playgroundDuplicateButton",
);
const playgroundDeleteButton = document.getElementById(
  "playgroundDeleteButton",
);
const playgroundSaveComponentButton = document.getElementById(
  "playgroundSaveComponentButton",
);
const playgroundSaveGroupButton = document.getElementById(
  "playgroundSaveGroupButton",
);
const playgroundSaveButton = document.getElementById("playgroundSaveButton");
const playgroundLoadButton = document.getElementById("playgroundLoadButton");
const playgroundStatus = document.getElementById("playgroundStatus");
const editorTargetTabSelect = document.getElementById("editorTargetTabSelect");
const editorNewTabName = document.getElementById("editorNewTabName");
const editorOpenTabButton = document.getElementById("editorOpenTabButton");
const editorNewTabButton = document.getElementById("editorNewTabButton");
const editorNewTabPanel = document.getElementById("editorNewTabPanel");
const editorCloseNewTabButton = document.getElementById(
  "editorCloseNewTabButton",
);
const editorOpenTabPanel = document.getElementById("editorOpenTabPanel");
const editorAddComponentButton = document.getElementById(
  "editorAddComponentButton",
);
const editorAddComponentPanel = document.getElementById(
  "editorAddComponentPanel",
);
const editorRenameTabButton = document.getElementById("editorRenameTabButton");
const editorDeleteTabButton = document.getElementById("editorDeleteTabButton");
const editorDocumentStatus = document.getElementById("editorDocumentStatus");
const tabStrip = document.querySelector(".tab-strip");
const docEditorTabSelect = document.getElementById("docEditorTabSelect");
const docEditorStatus = document.getElementById("docEditorStatus");
const docEditorDeleteButton = document.getElementById("docEditorDeleteButton");
const docEditorSceneBackButton = document.getElementById(
  "docEditorSceneBackButton",
);
const docEditorSceneNextButton = document.getElementById(
  "docEditorSceneNextButton",
);
const docEditorNewSceneButton = document.getElementById(
  "docEditorNewSceneButton",
);
const docEditorDeleteSceneButton = document.getElementById(
  "docEditorDeleteSceneButton",
);
const docEditorDoneButton = document.getElementById("docEditorDoneButton");
const docEditorSceneLabel = document.getElementById("docEditorSceneLabel");
const docEditorCanvasWidth = document.getElementById("docEditorCanvasWidth");
const docEditorCanvasHeight = document.getElementById("docEditorCanvasHeight");
const docEditorComponentSelect = document.getElementById(
  "docEditorComponentSelect",
);
const docEditorDuplicateButton = document.getElementById(
  "docEditorDuplicateButton",
);
const docEditorDeleteComponentButton = document.getElementById(
  "docEditorDeleteComponentButton",
);
const docEditorStartRecordingButton = document.getElementById(
  "docEditorStartRecordingButton",
);
const docEditorStopRecordingButton = document.getElementById(
  "docEditorStopRecordingButton",
);
const docEditorPlayRecordingButton = document.getElementById(
  "docEditorPlayRecordingButton",
);
const docEditorRecordingStatus = document.getElementById(
  "docEditorRecordingStatus",
);
const docEditorCanvas = document.getElementById("docEditorCanvas");
const docRuntimeOverlay = document.getElementById("docRuntimeOverlay");
const docRuntimeTitle = document.getElementById("docRuntimeTitle");
const docRuntimeSceneLabel = document.getElementById("docRuntimeSceneLabel");
const docRuntimeCloseButton = document.getElementById("docRuntimeCloseButton");
const docRuntimeCanvas = document.getElementById("docRuntimeCanvas");
const workshopPasswordOverlay = document.getElementById(
  "workshopPasswordOverlay",
);
const workshopPasswordForm = document.getElementById("workshopPasswordForm");
const workshopPasswordInput = document.getElementById("workshopPasswordInput");
const workshopPasswordStatus = document.getElementById(
  "workshopPasswordStatus",
);
const workshopPasswordCancelButton = document.getElementById(
  "workshopPasswordCancelButton",
);
const workshopModeButtons = Array.from(
  document.querySelectorAll("[data-workshop-mode]"),
);
const quantumCore = window.QuantumCore || null;
const SHARED_REGISTER_MAX_QUBITS = 8;
const localLabPanel = document.querySelector("[data-local-lab]");
const localLabQubitCount = document.getElementById("localLabQubitCount");
const localLabResetButton = document.getElementById("localLabResetButton");
const localLabSaveSnapshotButton = document.getElementById(
  "localLabSaveSnapshotButton",
);
const localLabLoadSnapshotButton = document.getElementById(
  "localLabLoadSnapshotButton",
);
const localLabTargetQubit = document.getElementById("localLabTargetQubit");
const localLabControlQubit = document.getElementById("localLabControlQubit");
const localLabCnotButton = document.getElementById("localLabCnotButton");
const localLabMeasureQubit = document.getElementById("localLabMeasureQubit");
const localLabMeasureButton = document.getElementById("localLabMeasureButton");
const localLabMeasureAllButton = document.getElementById(
  "localLabMeasureAllButton",
);
const localLabTeleportMessage = document.getElementById(
  "localLabTeleportMessage",
);
const localLabTeleportPrepareButton = document.getElementById(
  "localLabTeleportPrepareButton",
);
const localLabTeleportBellButton = document.getElementById(
  "localLabTeleportBellButton",
);
const localLabTeleportAliceButton = document.getElementById(
  "localLabTeleportAliceButton",
);
const localLabTeleportBobButton = document.getElementById(
  "localLabTeleportBobButton",
);
const localLabTeleportRunButton = document.getElementById(
  "localLabTeleportRunButton",
);
const localLabTeleportStatus = document.getElementById(
  "localLabTeleportStatus",
);
const localLabDistributedProtocol = document.getElementById(
  "localLabDistributedProtocol",
);
const localLabDistributedBobStartButton = document.getElementById(
  "localLabDistributedBobStartButton",
);
const localLabDistributedAliceMeasureButton = document.getElementById(
  "localLabDistributedAliceMeasureButton",
);
const localLabDistributedBobCorrectButton = document.getElementById(
  "localLabDistributedBobCorrectButton",
);
const localLabDistributedRefreshButton = document.getElementById(
  "localLabDistributedRefreshButton",
);
const localLabDistributedMailboxLink = document.getElementById(
  "localLabDistributedMailboxLink",
);
const localLabDistributedStatus = document.getElementById(
  "localLabDistributedStatus",
);
const localLabProtocolRecipeSelect = document.getElementById(
  "localLabProtocolRecipeSelect",
);
const localLabProtocolLoadButton = document.getElementById(
  "localLabProtocolLoadButton",
);
const localLabProtocolStepButton = document.getElementById(
  "localLabProtocolStepButton",
);
const localLabProtocolRefreshButton = document.getElementById(
  "localLabProtocolRefreshButton",
);
const localLabProtocolStepList = document.getElementById(
  "localLabProtocolStepList",
);
const localLabProtocolStatus = document.getElementById(
  "localLabProtocolStatus",
);
const localLabBackendUrl = document.getElementById("localLabBackendUrl");
const localLabMailboxEmail = document.getElementById("localLabMailboxEmail");
const localLabMailboxSendButton = document.getElementById(
  "localLabMailboxSendButton",
);
const localLabMailboxToken = document.getElementById("localLabMailboxToken");
const localLabMailboxReceiveButton = document.getElementById(
  "localLabMailboxReceiveButton",
);
const localLabMailboxLink = document.getElementById("localLabMailboxLink");
const localLabMailboxStatus = document.getElementById("localLabMailboxStatus");
const localLabSyncRoom = document.getElementById("localLabSyncRoom");
const localLabSyncParticipant = document.getElementById(
  "localLabSyncParticipant",
);
const localLabParticipantRole = document.getElementById(
  "localLabParticipantRole",
);
const localLabSyncConnectButton = document.getElementById(
  "localLabSyncConnectButton",
);
const localLabSyncPushButton = document.getElementById("localLabSyncPushButton");
const localLabSyncPullButton = document.getElementById("localLabSyncPullButton");
const localLabClassroomLinkButton = document.getElementById(
  "localLabClassroomLinkButton",
);
const localLabSyncLiveToggle = document.getElementById("localLabSyncLiveToggle");
const localLabSyncStatus = document.getElementById("localLabSyncStatus");
const localLabStatus = document.getElementById("localLabStatus");
const localLabQubitRail = document.getElementById("localLabQubitRail");
const localLabProbabilityGrid = document.getElementById(
  "localLabProbabilityGrid",
);
const localLabKetVector = document.getElementById("localLabKetVector");

const STEP_DEG = 30;
const SNAP_OVERLAP_THRESHOLD = 0.9;
const MEASUREMENT_OVERLAP_THRESHOLD = 0.3;
const QUBIT_START_EDGE_GAP = 20;
const ARROW_SCALE = 0.92;
const BLUE_RGB = [38, 111, 247];
const RED_RGB = [225, 54, 56];
const INITIAL_TUBE_QUBIT_CAPACITY = 5;
const AUTO_GATE_PAUSE_MS = 333;
const AUTO_TRAVEL_MS = 620;
const AUTO_MELT_MS = 320;
const OBSERVABLE_COLLAPSE_PAUSE_MS = 1000;
const CNOT_WINDOW_DWELL_MS = 500;
const MACHINE_DURATION_100_MS = 1000;
const MACHINE_DURATION_1000_MS = 2000;
const GATE_TUBE_DWELL_MS = 1000;
const GATE_PLATFORM_EXTEND_MS = 1000;
const GATE_PLATFORM_RETRACT_MS = 1000;
const DOUBLE_MEASUREMENT_COLLAPSE_DELAY_MS = 300;
const DOUBLE_MEASUREMENT_POST_COLLAPSE_DELAY_MS = 500;
const TWO_QUBIT_WIDE_LENS_VISUAL_CENTER_OFFSET_Y = -34;
const CNOT_FUNNEL_OVERLAP_THRESHOLD = 0.5;
const TWO_QUBIT_MEASUREMENT_SLOT_SHIFT_X = -50;
const TWO_QUBIT_MEASUREMENT_SLOT_SHIFT_Y = -42;
const ONE_QUBIT_GATE_OPTIONS = [
  { label: "Blue", buttonIndex: 0, hsv: { h: 219.0, s: 84.6, v: 96.9 } },
  {
    label: "Bluish Purple",
    buttonIndex: 1,
    hsv: { h: 279.4, s: 100.0, v: 99.6 },
  },
  { label: "Purple", buttonIndex: 2, hsv: { h: 289.2, s: 100.0, v: 98.0 } },
  {
    label: "Reddish Purple",
    buttonIndex: 3,
    hsv: { h: 312.3, s: 98.8, v: 96.5 },
  },
  { label: "Red", buttonIndex: 4, hsv: { h: 359.3, s: 76.0, v: 88.2 } },
];

// One-qubit gate model by button position.
// Button 0: P(0)=1, button 1: P(0)=3/4, button 2: P(0)=1/2, button 3: P(0)=1/4, button 4: P(0)=0
const ONE_QUBIT_BUTTON_BLUE_PROBABILITIES = [1, 3 / 4, 1 / 2, 1 / 4, 0];
const DEFAULT_GATE_BUTTON_INDEX = Math.floor(
  ONE_QUBIT_BUTTON_BLUE_PROBABILITIES.length / 2,
);
const DEFAULT_SINGLE_GATE_TICK_INDEX = 3;
const GENERATED_EXPERIMENT_REPEAT_ACTION = "experiment-repeat";
const GENERATED_EXPERIMENT_COUNT_ACTION = "experiment-count";
const PLAYGROUND_LAYOUT_STORAGE_KEY = "quantum_plaground_layout_v1";
const PLAYGROUND_COMPONENT_DEFAULTS_STORAGE_KEY =
  "quantum_playground_component_defaults_v1";
const LEGACY_GENERATED_TABS_PROPERTY = ["cus", "tomTabs"].join("");
const QUBIT_ID_STORAGE_KEY = "quantum_qubit_next_id_v1";
const PLAYGROUND_GROUP_COMPONENTS_STORAGE_KEY =
  "quantum_playground_group_components_v1";
const LOCAL_CONTENT_API_PORT = "8124";
const LOCAL_CONTENT_API_ROOT = "/__quantum-content";
const BROWSER_CONTENT_STORAGE_PREFIX = "quantum_editor_content_state_v1";
const WORKSHOP_PASSWORD = "142857";
const MAILBOX_DEFAULT_MESSAGE =
  "Paul is sending you an entangled qubit. Click on the link below to get it. You can modify it before you measure it if you want to. As soon as you measure it you will break the entanglement.";
const MAILBOX_LINK_PLACEHOLDER = "__MAILBOX_LINK__";
const MAILBOX_WINDOW_OVERLAP_THRESHOLD = 0.35;
const MAILBOX_ROOM_STORAGE_KEY = "quantum_mailbox_room_v1";
const MAILBOX_LOCAL_ROOM_EVENTS_STORAGE_KEY =
  "quantum_mailbox_local_room_events_v1";
const ENTANGLEMENT_THREE_SESSION_STORAGE_KEY =
  "quantum_entanglement_three_session_v1";
const ENTANGLEMENT_THREE_SESSION_CHANNEL =
  "quantum_entanglement_three_sessions_v1";
const ENTANGLEMENT_THREE_SESSION_LOCK_PREFIX =
  "quantum_entanglement_three_session_lock_v1:";
const MAILBOX_ROOM_DEFAULT_ID = "qubit-lab-demo";
const ENTANGLEMENT_THREE_ROOM_ID = "send-receive-room";
const MAILBOX_ROOM_POLL_MS = 2500;
const MAILBOX_ROOM_ACTIVE_MS = 15000;
const MAILBOX_ROOM_AUTO_NAMES = ["Bob", "Alice"];
const GENERATED_TABS_CONTENT_FILE = "data/generated-tabs.json";
const DOCUMENTS_CONTENT_FILE = "data/whats-this-documents.json";
const COMPONENT_GROUPS_CONTENT_FILE = "data/component-groups.json";
const CONTENT_FILE_CACHE_BUST =
  document.documentElement?.dataset?.quantumContentVersion || "";
const IS_STATIC_BUILD = Boolean(CONTENT_FILE_CACHE_BUST);
const PLAYGROUND_SAVED_GROUP_COMPONENT_TYPE = "component-group";
const PLAYGROUND_GRID_SIZE = 26;
const PLAYGROUND_COMPONENT_LIBRARY = {
  qubit: { label: "Qubit", width: 72, height: 72 },
  "single-gate": { label: "Single Qubit Gate", width: 500, height: 240 },
  "cnot-gate": { label: "C-NOT Gate", width: 420, height: 260 },
  "single-measurement": {
    label: "Single-Qubit Magnifier + Tubes",
    width: 420,
    height: 500,
  },
  "double-measurement": {
    label: "Double-Qubit Magnifier + Tubes",
    width: 500,
    height: 500,
  },
  "measurement-capacity": {
    label: "Capacity Text Box",
    width: 330,
    height: 70,
  },
  "single-tube-array": {
    label: "Two Testtube Array",
    width: 220,
    height: 235,
  },
  "double-tube-array": {
    label: "Four Testtube Array",
    width: 360,
    height: 245,
  },
  "triple-tube-array": {
    label: "Eight Testtube Array",
    width: 500,
    height: 210,
  },
  "quadruple-tube-array": {
    label: "Sixteen Testtube Array",
    width: 900,
    height: 210,
  },
  "single-magnifier": {
    label: "Single-Qubit Magnifier",
    width: 160,
    height: 130,
  },
  "double-magnifier": {
    label: "Double-Qubit Magnifier",
    width: 340,
    height: 190,
  },
  "measurement-count-menu": {
    label: "Iteration Count Menu",
    width: 110,
    height: 62,
  },
  mailbox: {
    label: "Qubit Mailbox",
    width: 373,
    height: 240,
  },
  "text-box": {
    label: "Text Box",
    width: 300,
    height: 150,
  },
};

const PLAYGROUND_SINGLE_MEASUREMENT_PART_SPECS = [
  {
    key: "capacity",
    selector: '[data-role="tube-capacity"]',
    resizable: true,
    minWidth: 120,
    minHeight: 24,
  },
  {
    key: "tubeRack",
    selector: '[data-role="tube-rack"]',
    resizable: true,
    minWidth: 140,
    minHeight: 80,
  },
  {
    key: "blueTube",
    selector: '[data-role="tube-blue"]',
    resizable: true,
    minWidth: 16,
    minHeight: 50,
  },
  {
    key: "redTube",
    selector: '[data-role="tube-red"]',
    resizable: true,
    minWidth: 16,
    minHeight: 50,
  },
  {
    key: "blueTubeCount",
    selector: '[data-role="tube-blue-count"]',
    resizable: true,
    minWidth: 24,
    minHeight: 18,
  },
  {
    key: "redTubeCount",
    selector: '[data-role="tube-red-count"]',
    resizable: true,
    minWidth: 24,
    minHeight: 18,
  },
  {
    key: "magnifier",
    selector: '[data-role="measurement-tool"]',
    resizable: true,
    minWidth: 120,
    minHeight: 90,
  },
  {
    key: "measurementCount",
    selector: '[data-role="measurement-count"]',
    resizable: true,
    minWidth: 60,
    minHeight: 24,
  },
];
const PLAYGROUND_DOUBLE_MEASUREMENT_PART_SPECS = [
  {
    key: "capacity",
    selector: '[data-role="pair-capacity"]',
    resizable: true,
    minWidth: 160,
    minHeight: 24,
  },
  {
    key: "tubeRack",
    selector: ".pair-tube-rack",
    resizable: true,
    minWidth: 180,
    minHeight: 100,
  },
  {
    key: "tubeBB",
    selector: '[data-role="pair-tube-bb"]',
    resizable: true,
    minWidth: 16,
    minHeight: 50,
  },
  {
    key: "tubeRB",
    selector: '[data-role="pair-tube-rb"]',
    resizable: true,
    minWidth: 16,
    minHeight: 50,
  },
  {
    key: "tubeBR",
    selector: '[data-role="pair-tube-br"]',
    resizable: true,
    minWidth: 16,
    minHeight: 50,
  },
  {
    key: "tubeRR",
    selector: '[data-role="pair-tube-rr"]',
    resizable: true,
    minWidth: 16,
    minHeight: 50,
  },
  {
    key: "countBB",
    selector: '[data-role="pair-count-bb"]',
    resizable: true,
    minWidth: 24,
    minHeight: 18,
  },
  {
    key: "countRB",
    selector: '[data-role="pair-count-rb"]',
    resizable: true,
    minWidth: 24,
    minHeight: 18,
  },
  {
    key: "countBR",
    selector: '[data-role="pair-count-br"]',
    resizable: true,
    minWidth: 24,
    minHeight: 18,
  },
  {
    key: "countRR",
    selector: '[data-role="pair-count-rr"]',
    resizable: true,
    minWidth: 24,
    minHeight: 18,
  },
  {
    key: "magnifier",
    selector: '[data-role="pair-lens"]',
    resizable: true,
    minWidth: 180,
    minHeight: 110,
  },
  {
    key: "funnel",
    selector: '[data-role="pair-measurement-funnel"]',
    resizable: true,
    minWidth: 40,
    minHeight: 80,
  },
  {
    key: "slotLeft",
    selector: '[data-role="pair-slot-left"]',
    resizable: true,
    uniform: true,
    minWidth: 30,
    minHeight: 30,
  },
  {
    key: "slotRight",
    selector: '[data-role="pair-slot-right"]',
    resizable: true,
    uniform: true,
    minWidth: 30,
    minHeight: 30,
  },
  {
    key: "platform",
    selector: ".pair-measurement-platform",
    resizable: true,
    minWidth: 40,
    minHeight: 24,
  },
  {
    key: "measurementCount",
    selector: '[data-role="pair-measurement-count"]',
    resizable: true,
    minWidth: 60,
    minHeight: 24,
  },
];
let playgroundComponentDefaultsCache = null;
let generatedTabsState = {
  tabs: [],
};
let documentsState = {
  documents: [],
};
let legacyGroupComponentIdRedirects = new Map();
let draggedGeneratedTabId = "";
let generatedTabPointerDrag = null;
let workshopUnlocked = false;
let workshopEditorMode = "tab";
const generatedSingleGateRuntimes = new Map();
const generatedQubitRuntimes = new Map();
const generatedSingleMeasurementRuntimes = new Map();
const generatedDoubleMeasurementRuntimes = new Map();
const generatedSeparatedPairMeasurementRuntimes = new Map();
const generatedCnotRuntimes = new Map();
const generatedExperimentStates = new WeakMap();
let generatedLayoutGesture = null;
let generatedRuntimeDrag = null;
let generatedItemIdCounter = 0;
let playgroundGroupComponentsCache = null;
let generatedExperimentPlaybackSpeed = 1;
const DOCUMENT_CANVAS_MIN_WIDTH = 520;
const DOCUMENT_CANVAS_MIN_HEIGHT = 420;
const DOCUMENT_CANVAS_MAX_WIDTH = 2600;
const DOCUMENT_CANVAS_MAX_HEIGHT = 2200;
const DOCUMENT_DEFAULT_CANVAS_WIDTH = 900;
const DOCUMENT_DEFAULT_CANVAS_HEIGHT = 560;
let documentEditorState = {
  tabId: "",
  document: null,
  sceneIndex: 0,
  rendering: false,
  suppressResizeObserver: false,
  statusTimer: null,
  resizeObserver: null,
};
let documentRuntimeState = {
  tabId: "",
  document: null,
  sceneIndex: 0,
  returnTabId: "",
  playing: false,
  canvas: null,
};

const layoutEditorState = {
  enabled: false,
};
let selectedGeneratedLayoutItem = null;
let selectedGeneratedLayoutPart = null;
const generatedLayoutResizeObserver =
  typeof ResizeObserver === "function"
    ? new ResizeObserver((entries) => {
        entries.forEach((entry) => {
          if (!(entry.target instanceof HTMLElement)) {
            return;
          }
          const canvas = entry.target.querySelector(
            ":scope > .generated-layout-canvas",
          );
          if (canvas instanceof HTMLElement) {
            syncGeneratedLayoutCanvasScale(canvas);
          }
        });
      })
    : null;

function cloneTemplateElement(template, selector) {
  if (!(template instanceof HTMLTemplateElement)) {
    return null;
  }
  const fragment = template.content.cloneNode(true);
  const element = selector
    ? fragment.querySelector(selector)
    : fragment.firstElementChild;
  return element instanceof HTMLElement ? element : null;
}

function cloneSingleQubitBlueprint(selector) {
  return cloneTemplateElement(simulatorTemplate, selector);
}

function mountPairMeasurementTool(host) {
  if (!pairMeasurementToolTemplate || !host) {
    return null;
  }
  if (host.querySelector('[data-role="pair-lens"]')) {
    applyDoubleMeasurementLayoutSnapshot(
      host,
      playgroundComponentDefaultsCache?.["double-measurement"],
      { includeGroupGeometry: false },
    );
    return host;
  }
  host.innerHTML = "";
  const fragment = pairMeasurementToolTemplate.content.cloneNode(true);
  host.appendChild(fragment);
  applyDoubleMeasurementLayoutSnapshot(
    host,
    playgroundComponentDefaultsCache?.["double-measurement"],
    { includeGroupGeometry: false },
  );
  return host;
}

function ensurePlaygroundGroupFrame(item) {
  if (!(item instanceof HTMLElement)) {
    return;
  }
  if (item.querySelector(":scope > .playground-group-frame")) {
    return;
  }
  const frame = document.createElement("div");
  frame.className = "playground-group-frame";
  frame.setAttribute("aria-hidden", "true");
  ["top", "right", "bottom", "left"].forEach((edgeName) => {
    const edge = document.createElement("span");
    edge.className = `playground-group-frame-edge playground-group-frame-edge-${edgeName}`;
    frame.appendChild(edge);
  });
  const corner = document.createElement("span");
  corner.className = "playground-group-frame-corner";
  frame.appendChild(corner);
  item.appendChild(frame);
}

function createCnotGateElement() {
  if (!cnotGateTemplate) {
    return null;
  }
  const fragment = cnotGateTemplate.content.cloneNode(true);
  const root = fragment.firstElementChild;
  if (!(root instanceof HTMLElement)) {
    return null;
  }
  return root;
}

function doubleMeasurementDefaultsAreCorrupt(payload) {
  if (!payload || typeof payload !== "object") {
    return false;
  }
  const geometry = componentGeometryDefaults(payload)["double-measurement"];
  if (geometry && typeof geometry === "object") {
    const width = Number(geometry.width);
    const height = Number(geometry.height);
    if (
      (Number.isFinite(width) && (width < 220 || width > 900)) ||
      (Number.isFinite(height) && (height < 120 || height > 900))
    ) {
      return true;
    }
  }
  const measurementLayout = payload["double-measurement"];
  if (!measurementLayout || typeof measurementLayout !== "object") {
    return false;
  }
  const savedParts = savedPlaygroundMeasurementParts(measurementLayout);
  if (!savedParts || typeof savedParts !== "object") {
    return false;
  }
  return PLAYGROUND_DOUBLE_MEASUREMENT_PART_SPECS.some((spec) => {
    const snapshot = savedParts[spec.key];
    if (!snapshot || typeof snapshot !== "object") {
      return false;
    }
    const tx = Number(snapshot.tx);
    const ty = Number(snapshot.ty);
    const width = Number.parseFloat(snapshot.width);
    const height = Number.parseFloat(snapshot.height);
    return (
      (Number.isFinite(tx) && Math.abs(tx) > 350) ||
      (Number.isFinite(ty) && Math.abs(ty) > 350) ||
      (Number.isFinite(width) && width > 900) ||
      (Number.isFinite(height) && height > 900)
    );
  });
}

function normalizePlaygroundComponentDefaultsPayload(payload) {
  if (!payload || typeof payload !== "object") {
    return { payload: {}, changed: false };
  }
  let changed = false;
  if (payload["double-measurement"]?.group) {
    payload["double-measurement"] = { ...payload["double-measurement"] };
    delete payload["double-measurement"].group;
    changed = true;
  }
  if (doubleMeasurementDefaultsAreCorrupt(payload)) {
    delete payload["double-measurement"];
    const geometryDefaults = componentGeometryDefaults(payload);
    if (geometryDefaults["double-measurement"]) {
      payload.__componentGeometryDefaults = { ...geometryDefaults };
      delete payload.__componentGeometryDefaults["double-measurement"];
    }
    changed = true;
  }
  return { payload, changed };
}

function readPlaygroundComponentDefaultsPayload() {
  try {
    const serialized = window.localStorage.getItem(
      PLAYGROUND_COMPONENT_DEFAULTS_STORAGE_KEY,
    );
    if (!serialized) {
      return {};
    }
    const parsed = JSON.parse(serialized);
    const normalized = normalizePlaygroundComponentDefaultsPayload(
      parsed && typeof parsed === "object" ? parsed : {},
    );
    if (normalized.changed) {
      window.localStorage.setItem(
        PLAYGROUND_COMPONENT_DEFAULTS_STORAGE_KEY,
        JSON.stringify(normalized.payload),
      );
    }
    return normalized.payload;
  } catch (_error) {
    return {};
  }
}

function writePlaygroundComponentDefaultsPayload(payload) {
  try {
    window.localStorage.setItem(
      PLAYGROUND_COMPONENT_DEFAULTS_STORAGE_KEY,
      JSON.stringify(payload || {}),
    );
    return true;
  } catch (_error) {
    return false;
  }
}

function componentGeometryDefaults(payload) {
  if (!payload || typeof payload !== "object") {
    return {};
  }
  const defaults = payload.__componentGeometryDefaults;
  return defaults && typeof defaults === "object" ? defaults : {};
}

function defaultsGeometryForComponentType(type) {
  const defaults = componentGeometryDefaults(playgroundComponentDefaultsCache);
  const geometry = defaults[type];
  return geometry && typeof geometry === "object" ? geometry : null;
}

function persistPlaygroundComponentGeometryDefaultsFromElement(
  type,
  element,
  extras = null,
) {
  if (!type || !(element instanceof HTMLElement)) {
    return false;
  }
  const width = Math.round(element.offsetWidth);
  const height = Math.round(element.offsetHeight);
  if (
    !Number.isFinite(width) ||
    !Number.isFinite(height) ||
    width <= 0 ||
    height <= 0
  ) {
    return false;
  }
  const payload = readPlaygroundComponentDefaultsPayload();
  const geometryDefaults = {
    ...componentGeometryDefaults(payload),
  };
  const next = { width, height };
  if (extras && typeof extras === "object") {
    Object.entries(extras).forEach(([key, value]) => {
      if (Number.isFinite(value)) {
        next[key] = value;
      }
    });
  }
  geometryDefaults[type] = next;
  payload.__componentGeometryDefaults = geometryDefaults;
  const saved = writePlaygroundComponentDefaultsPayload(payload);
  if (saved) {
    playgroundComponentDefaultsCache = payload;
  }
  return saved;
}

function resolveCnotPartElements(root) {
  if (!(root instanceof HTMLElement)) {
    return {};
  }
  return {
    gate: root,
    body: root.querySelector(".cnot-body, [data-part='body']"),
    funnelTop: root.querySelector(
      "[data-part='funnel-top'], .cnot-input-funnel-top",
    ),
    funnelBottom: root.querySelector(
      "[data-part='funnel-bottom'], .cnot-input-funnel-bottom",
    ),
    windowTop: root.querySelector("[data-part='window-top'], .cnot-porthole-top"),
    windowBottom: root.querySelector(
      "[data-part='window-bottom'], .cnot-porthole-bottom",
    ),
    flangeTop: root.querySelector(".cnot-output-flange-top"),
    flangeBottom: root.querySelector(".cnot-output-flange-bottom"),
  };
}

function snapshotLayoutEditableElement(element) {
  if (!(element instanceof HTMLElement)) {
    return null;
  }
  return {
    tx: parseLayoutNumeric(element.dataset.layoutTx, 0),
    ty: parseLayoutNumeric(element.dataset.layoutTy, 0),
    width: element.style.width || "",
    height: element.style.height || "",
    deleted: isLayoutTargetDeleted(element),
  };
}

function snapshotInlineStyleSubset(element, properties) {
  if (!(element instanceof HTMLElement)) {
    return null;
  }
  const saved = {};
  properties.forEach((property) => {
    const value = element.style[property];
    if (typeof value === "string" && value.trim() !== "") {
      saved[property] = value;
    }
  });
  return Object.keys(saved).length > 0 ? saved : null;
}

function applyLayoutSnapshotToElement(element, snapshot) {
  if (
    !(element instanceof HTMLElement) ||
    !snapshot ||
    typeof snapshot !== "object"
  ) {
    return;
  }
  const tx = parseLayoutNumeric(snapshot.tx, 0);
  const ty = parseLayoutNumeric(snapshot.ty, 0);
  setLayoutTargetTranslate(element, tx, ty);
  element.style.width =
    typeof snapshot.width === "string" ? snapshot.width : "";
  element.style.height =
    typeof snapshot.height === "string" ? snapshot.height : "";
  setLayoutTargetDeleted(element, Boolean(snapshot.deleted));
  setLayoutManualEdited(
    element,
    hasMeaningfulLayoutDelta(tx, ty, element.style.width, element.style.height),
  );
}

function captureCnotComponentDefaultsFromElement(root) {
  normalizeCnotBodyFill(root);
  const parts = resolveCnotPartElements(root);
  const snapshot = {};
  const cnotStyleKeys = [
    "left",
    "right",
    "top",
    "bottom",
    "width",
    "height",
    "transform",
    "translate",
  ];
  Object.entries(parts).forEach(([key, element]) => {
    const state = snapshotLayoutEditableElement(element);
    if (state) {
      const inlineStyle = snapshotInlineStyleSubset(element, cnotStyleKeys);
      if (inlineStyle) {
        state.inlineStyle = inlineStyle;
      }
      snapshot[key] = state;
    }
  });
  return Object.keys(snapshot).length > 0 ? snapshot : null;
}

function applyCnotSnapshotToElement(root, snapshot, options = {}) {
  if (!snapshot || typeof snapshot !== "object") {
    return;
  }
  const includeGateGeometry = options.includeGateGeometry !== false;
  const parts = resolveCnotPartElements(root);
  Object.entries(parts).forEach(([key, element]) => {
    if (!includeGateGeometry && key === "gate") {
      return;
    }
    const state = snapshot[key];
    if (key === "body" && !cnotBodySnapshotHasExplicitGeometry(state)) {
      resetCnotBodyFillGeometry(element);
      return;
    }
    applyLayoutSnapshotToElement(element, state);
    if (
      element instanceof HTMLElement &&
      state &&
      typeof state === "object" &&
      state.inlineStyle &&
      typeof state.inlineStyle === "object"
    ) {
      Object.entries(state.inlineStyle).forEach(([property, value]) => {
        if (typeof value === "string") {
          element.style[property] = value;
        }
      });
    }
  });
  normalizeCnotBodyFill(root);
}

function applyCnotComponentDefaultsToElement(root, options = {}) {
  applyCnotSnapshotToElement(
    root,
    playgroundComponentDefaultsCache?.["cnot-gate"],
    options,
  );
}

function cloneJson(value) {
  try {
    return JSON.parse(JSON.stringify(value));
  } catch (_error) {
    return null;
  }
}

function normalizeQubitId(value) {
  const number = Number(value);
  return Number.isSafeInteger(number) && number > 0 ? number : null;
}

function normalizeRoomQubitIndex(value) {
  const number = Number(value);
  return Number.isSafeInteger(number) && number >= 0 ? number : null;
}

function qubitLogicalIdForItem(item) {
  return normalizeQubitId(item?.dataset?.qubitId);
}

function roomQubitIndexForItem(item) {
  return normalizeRoomQubitIndex(item?.dataset?.roomQubitIndex);
}

function qubitDisplayIndexForItem(item, fallback = 0) {
  const roomIndex = roomQubitIndexForItem(item);
  return Number.isInteger(roomIndex) ? roomIndex : fallback;
}

function qubitDisplayLabelForItem(item, fallback = 0) {
  return `q${qubitDisplayIndexForItem(item, fallback)}`;
}

function setQubitRoomIdentity(item, roomQubitIndex, options = {}) {
  if (!(item instanceof HTMLElement) || item.dataset.component !== "qubit") {
    return false;
  }
  const normalizedIndex = normalizeRoomQubitIndex(roomQubitIndex);
  if (!Number.isInteger(normalizedIndex)) {
    return false;
  }
  item.dataset.roomQubitIndex = String(normalizedIndex);
  const qubitId = normalizeQubitId(options.qubitId) || normalizedIndex + 1;
  item.dataset.qubitId = String(qubitId);
  if (options.roomId) {
    item.dataset.roomId = String(options.roomId);
  }
  updateQubitDisplayLabel(item);
  return true;
}

function updateQubitDisplayLabel(item, fallback = 0) {
  if (!(item instanceof HTMLElement) || item.dataset.component !== "qubit") {
    return;
  }
  const label = qubitDisplayLabelForItem(item, fallback);
  item.dataset.qubitLabel = label;
  item.setAttribute("aria-label", `Qubit ${label}`);
  const core = item.querySelector?.(".playground-qubit-core");
  if (core instanceof HTMLElement) {
    core.dataset.qubitLabel = label;
  }
}

function roomQubitIdentityForItem(item) {
  if (!(item instanceof HTMLElement) || item.dataset.component !== "qubit") {
    return null;
  }
  const roomQubitIndex = roomQubitIndexForItem(item);
  const qubitId = qubitLogicalIdForItem(item);
  if (!Number.isInteger(roomQubitIndex) || !qubitId) {
    return null;
  }
  return {
    roomId: item.dataset.roomId || mailboxRoomState.roomId || null,
    roomQubitIndex,
    qubitId,
    label: qubitDisplayLabelForItem(item),
  };
}

function applyRoomQubitIdentity(item, identity) {
  if (!identity || typeof identity !== "object") {
    return false;
  }
  const roomQubitIndex = normalizeRoomQubitIndex(identity.roomQubitIndex);
  if (!Number.isInteger(roomQubitIndex)) {
    return false;
  }
  return setQubitRoomIdentity(item, roomQubitIndex, {
    qubitId: identity.qubitId,
    roomId: identity.roomId,
  });
}

function maxQubitIdInLayoutItems(items) {
  if (!Array.isArray(items)) {
    return 0;
  }
  return items.reduce((maxId, item) => {
    if (!item || typeof item !== "object") {
      return maxId;
    }
    let nextMax = Math.max(maxId, normalizeQubitId(item.qubitId) || 0);
    if (Array.isArray(item.items)) {
      nextMax = Math.max(nextMax, maxQubitIdInLayoutItems(item.items));
    }
    if (Array.isArray(item.layout?.items)) {
      nextMax = Math.max(nextMax, maxQubitIdInLayoutItems(item.layout.items));
    }
    return nextMax;
  }, 0);
}

function maxQubitIdInGeneratedTabsPayload(payload) {
  const oldTabs = Array.isArray(payload?.[LEGACY_GENERATED_TABS_PROPERTY])
    ? payload[LEGACY_GENERATED_TABS_PROPERTY]
    : [];
  const tabs = Array.isArray(payload?.tabs) ? payload.tabs : oldTabs;
  return tabs.reduce(
    (maxId, tab) =>
      Math.max(maxId, maxQubitIdInLayoutItems(tab?.layout?.items)),
    0,
  );
}

function maxQubitIdInGroupComponentsPayload(payload) {
  const groups = Array.isArray(payload?.groups) ? payload.groups : [];
  return groups.reduce(
    (maxId, group) => Math.max(maxId, maxQubitIdInLayoutItems(group?.items)),
    0,
  );
}

function maxQubitIdInDom(root = document) {
  if (!root?.querySelectorAll) {
    return 0;
  }
  return Array.from(root.querySelectorAll("[data-qubit-id]")).reduce(
    (maxId, element) =>
      Math.max(maxId, normalizeQubitId(element.dataset.qubitId) || 0),
    0,
  );
}

function readStoredNextQubitId() {
  try {
    return normalizeQubitId(window.localStorage.getItem(QUBIT_ID_STORAGE_KEY));
  } catch (_error) {
    return null;
  }
}

function writeStoredNextQubitId(nextId) {
  const normalized = normalizeQubitId(nextId);
  if (!normalized) {
    return;
  }
  try {
    window.localStorage.setItem(QUBIT_ID_STORAGE_KEY, String(normalized));
  } catch (_error) {
    // Ignore storage failures; in-memory DOM ids still distinguish this run.
  }
}

function maxKnownQubitId() {
  let maxId = maxQubitIdInDom(document);
  maxId = Math.max(maxId, maxQubitIdInGeneratedTabsPayload(generatedTabsState));
  maxId = Math.max(
    maxId,
    maxQubitIdInGroupComponentsPayload(playgroundGroupComponentsCache),
  );
  try {
    const groupPayload = JSON.parse(
      window.localStorage.getItem(PLAYGROUND_GROUP_COMPONENTS_STORAGE_KEY) ||
        "{}",
    );
    maxId = Math.max(maxId, maxQubitIdInGroupComponentsPayload(groupPayload));
  } catch (_error) {
    // Ignore malformed saved groups when choosing the next id.
  }
  try {
    const draftPayload = JSON.parse(
      window.localStorage.getItem(PLAYGROUND_LAYOUT_STORAGE_KEY) || "{}",
    );
    maxId = Math.max(maxId, maxQubitIdInLayoutItems(draftPayload.items));
  } catch (_error) {
    // Ignore malformed editor drafts when choosing the next id.
  }
  return maxId;
}

function reserveNextQubitId() {
  const storedNext = readStoredNextQubitId() || 1;
  const nextId = Math.max(storedNext, maxKnownQubitId() + 1, 1);
  writeStoredNextQubitId(nextId + 1);
  return nextId;
}

function ensureQubitLogicalId(item, preferredId = null) {
  if (!(item instanceof HTMLElement) || item.dataset.component !== "qubit") {
    return null;
  }
  const existing = qubitLogicalIdForItem(item);
  if (existing) {
    return existing;
  }
  const nextId = normalizeQubitId(preferredId) || reserveNextQubitId();
  item.dataset.qubitId = String(nextId);
  return nextId;
}

function stripQubitIdsFromLayoutGeometry(geometry) {
  if (!geometry || typeof geometry !== "object") {
    return geometry;
  }
  if (geometry.type === "qubit") {
    delete geometry.qubitId;
  }
  if (Array.isArray(geometry.items)) {
    geometry.items.forEach((item) => stripQubitIdsFromLayoutGeometry(item));
  }
  if (Array.isArray(geometry.layout?.items)) {
    geometry.layout.items.forEach((item) => stripQubitIdsFromLayoutGeometry(item));
  }
  return geometry;
}

const SEQUENTIAL_TWO_QUBIT_MEASUREMENT_LABEL =
  "Separate two qubit measurement";
const SEPARATE_TWO_QUBIT_MEASUREMENT_GROUP_ID =
  "separate-two-qubit-measurement";
const SEPARATE_TWO_QUBIT_MEASUREMENT_GROUP_ID_ALIASES = new Set([
  "separate",
  "separate-two-qubit-measurment",
  "separate-two-qubit-measurement",
  "seperate-two-qubit-measurement",
  "sequential-two-qubit-measurement",
]);
const LEGACY_SEQUENTIAL_TWO_QUBIT_MEASUREMENT_LABELS = new Set([
  "separate",
  "separate two qubit measurement",
  "seperate two qubit measurement",
  "sequential two qubit measurement",
]);
const SEQUENTIAL_TWO_QUBIT_MEASUREMENT_PHRASES = new Set([
  "separate",
  "separate two qubit measurement",
  "seperate two qubit measurement",
  "sequential two qubit measurement",
]);
const HIDDEN_COMPONENT_PICKER_GROUP_IDS = new Set([
  "separate",
  "seperate-two-qubit-measurement",
  "sequential-two-qubit-measurement",
]);
const REGISTER_THREE_QUBIT_MEASUREMENT_GROUP_ID =
  "three-qubit-register-measurement";
const REGISTER_FOUR_QUBIT_MEASUREMENT_GROUP_ID =
  "four-qubit-register-measurement";

function registerOutcomeKeyFromIndex(numQubits, index) {
  const safeNumQubits = Math.max(1, Math.min(4, Number(numQubits) || 1));
  return index
    .toString(2)
    .padStart(safeNumQubits, "0")
    .replaceAll("0", "b")
    .replaceAll("1", "r");
}

function registerMeasurementOutcomeKeys(numQubits) {
  const safeNumQubits = Math.max(1, Math.min(4, Number(numQubits) || 1));
  return Array.from({ length: 2 ** safeNumQubits }, (_item, index) =>
    registerOutcomeKeyFromIndex(safeNumQubits, index),
  );
}

function registerMeasurementQubitCountFromKeys(keys) {
  const uniqueKeys = Array.from(
    new Set(
      (Array.isArray(keys) ? keys : [])
        .map((key) => String(key || "").trim())
        .filter((key) => /^[br]+$/.test(key)),
    ),
  );
  const keyLength = uniqueKeys[0]?.length || 0;
  if (
    keyLength >= 2 &&
    keyLength <= 4 &&
    uniqueKeys.length === 2 ** keyLength &&
    uniqueKeys.every((key) => key.length === keyLength)
  ) {
    return keyLength;
  }
  return 2;
}

function registerMeasurementColumnKeysForItem(item) {
  if (!(item instanceof HTMLElement)) {
    return [];
  }
  return Array.from(item.querySelectorAll(".pair-tube-column[data-key]"))
    .map((column) => column.dataset.key || "")
    .filter(Boolean);
}

function registerMeasurementQubitCountForItem(item) {
  const datasetCount = Number(item?.dataset?.measurementRegisterQubitCount);
  if (Number.isInteger(datasetCount) && datasetCount >= 2 && datasetCount <= 4) {
    return datasetCount;
  }
  return registerMeasurementQubitCountFromKeys(
    registerMeasurementColumnKeysForItem(item),
  );
}

function registerMeasurementOutcomeKeysForItem(item) {
  const count = registerMeasurementQubitCountForItem(item);
  return registerMeasurementOutcomeKeys(count);
}

function forcedRegisterMeasurementQubitCountForRuntime(runtime) {
  const configuredCount = Math.max(
    0,
    Math.min(4, Number(runtime?.configuredRegisterQubitCount) || 0),
  );
  if (configuredCount > 2) {
    return configuredCount;
  }
  const itemCount = Math.max(
    0,
    Math.min(4, registerMeasurementQubitCountForItem(runtime?.item)),
  );
  if (itemCount > 2) {
    return itemCount;
  }
  const runtimeCount = Math.max(
    0,
    Math.min(4, Number(runtime?.registerQubitCount) || 0),
  );
  return runtimeCount > 2 ? runtimeCount : 0;
}

function storageLabelKey(value) {
  return String(value || "")
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase();
}

function storageIdentifierKey(value) {
  return String(value || "")
    .trim()
    .replace(/[\s_]+/g, "-")
    .toLowerCase();
}

function storagePhraseKey(value) {
  return String(value || "")
    .trim()
    .replace(/[^a-z0-9]+/gi, " ")
    .replace(/\s+/g, " ")
    .toLowerCase();
}

function isLegacySequentialTwoQubitMeasurementGroup(group) {
  return (
    LEGACY_SEQUENTIAL_TWO_QUBIT_MEASUREMENT_LABELS.has(
      storageLabelKey(group?.label),
    ) ||
    SEQUENTIAL_TWO_QUBIT_MEASUREMENT_PHRASES.has(storagePhraseKey(group?.label))
  );
}

function isSeparateTwoQubitMeasurementGroupAlias(group) {
  return (
    isLegacySequentialTwoQubitMeasurementGroup(group) ||
    SEPARATE_TWO_QUBIT_MEASUREMENT_GROUP_ID_ALIASES.has(
      storageIdentifierKey(group?.id),
    )
  );
}

function isSequentialTwoQubitMeasurementGroupDefinition(group) {
  return (
    storageLabelKey(group?.label) ===
      storageLabelKey(SEQUENTIAL_TWO_QUBIT_MEASUREMENT_LABEL) ||
    storagePhraseKey(group?.label) ===
      storagePhraseKey(SEQUENTIAL_TWO_QUBIT_MEASUREMENT_LABEL) ||
    isSeparateTwoQubitMeasurementGroupAlias(group) ||
    HIDDEN_COMPONENT_PICKER_GROUP_IDS.has(storageIdentifierKey(group?.id))
  );
}

function isHiddenComponentPickerGroup(group) {
  return HIDDEN_COMPONENT_PICKER_GROUP_IDS.has(storageIdentifierKey(group?.id));
}

function isSeparatedPairMeasurementGroupDefinition(group) {
  if (!group || typeof group !== "object" || !Array.isArray(group.items)) {
    return false;
  }
  return (
    group.items.some((item) =>
      [
        "double-tube-array",
        "triple-tube-array",
        "quadruple-tube-array",
      ].includes(item?.type),
    ) &&
    group.items.some((item) => item?.type === "single-magnifier")
  );
}

function separateTwoQubitMeasurementGroupScore(group, index) {
  if (!isSeparateTwoQubitMeasurementGroupAlias(group)) {
    return Number.NEGATIVE_INFINITY;
  }
  const idKey = storageIdentifierKey(group?.id);
  const labelKey = storageLabelKey(group?.label);
  const phraseKey = storagePhraseKey(group?.label);
  const canonicalLabelKey = storageLabelKey(
    SEQUENTIAL_TWO_QUBIT_MEASUREMENT_LABEL,
  );
  const canonicalPhraseKey = storagePhraseKey(
    SEQUENTIAL_TWO_QUBIT_MEASUREMENT_LABEL,
  );
  const items = Array.isArray(group?.items) ? group.items : [];
  let score = 0;
  if (idKey === SEPARATE_TWO_QUBIT_MEASUREMENT_GROUP_ID) {
    score += 10000;
  }
  if (labelKey === canonicalLabelKey) {
    score += 1000;
  }
  if (phraseKey === canonicalPhraseKey) {
    score += 500;
  }
  if (isSeparatedPairMeasurementGroupDefinition(group)) {
    score += 100;
  }
  score += items.length * 10;
  if (items.some((item) => item?.type === "measurement-capacity")) {
    score += 6;
  }
  if (items.some((item) => item?.type === "measurement-count-menu")) {
    score += 6;
  }
  if (items.some((item) => item?.type === "double-tube-array")) {
    score += 3;
  }
  if (items.some((item) => item?.type === "single-magnifier")) {
    score += 3;
  }
  return score - index / 1000;
}

function preferredSeparateTwoQubitMeasurementGroupIndex(groups) {
  if (!Array.isArray(groups)) {
    return -1;
  }
  return groups.reduce(
    (best, group, index) => {
      const score = separateTwoQubitMeasurementGroupScore(group, index);
      return score > best.score ? { index, score } : best;
    },
    { index: -1, score: Number.NEGATIVE_INFINITY },
  ).index;
}

function roundedLayoutNumber(value) {
  return Number.parseFloat(Number(value).toFixed(2));
}

function layoutGeometryBounds(items) {
  if (!Array.isArray(items) || items.length === 0) {
    return null;
  }
  const bounds = items.reduce(
    (acc, item) => {
      if (!item || typeof item !== "object") {
        return acc;
      }
      const config = componentConfigForType(item.type, item) || {
        width: 120,
        height: 100,
      };
      const left = parseLayoutNumeric(item.left, 0);
      const top = parseLayoutNumeric(item.top, 0);
      const width = finitePositiveNumber(item.width, config.width);
      const height = finitePositiveNumber(item.height, config.height);
      return {
        left: Math.min(acc.left, left),
        top: Math.min(acc.top, top),
        right: Math.max(acc.right, left + width),
        bottom: Math.max(acc.bottom, top + height),
      };
    },
    {
      left: Number.POSITIVE_INFINITY,
      top: Number.POSITIVE_INFINITY,
      right: Number.NEGATIVE_INFINITY,
      bottom: Number.NEGATIVE_INFINITY,
    },
  );
  return [bounds.left, bounds.top, bounds.right, bounds.bottom].every(
    Number.isFinite,
  )
    ? bounds
    : null;
}

function normalizeSeparatedPairMeasurementGroupGeometry(group, options = {}) {
  if (!group || typeof group !== "object" || !Array.isArray(group.items)) {
    return { group, changed: false };
  }
  const items = group.items;
  const doubleTubes = items.find((item) => item?.type === "double-tube-array");
  const magnifiers = items
    .map((item, index) =>
      item?.type === "single-magnifier" ? { item, index } : null,
    )
    .filter(Boolean);
  if (!doubleTubes || magnifiers.length === 0) {
    return { group, changed: false };
  }

  const shouldCenterSingle =
    Boolean(options.centerSingleMagnifier) || magnifiers.length > 1;
  const sourceMagnifier = magnifiers[0].item;
  const magnifierConfig =
    componentConfigForType("single-magnifier", sourceMagnifier) || {
      width: 160,
      height: 130,
    };
  const tubeConfig = componentConfigForType("double-tube-array", doubleTubes) || {
    width: 360,
    height: 245,
  };
  const tubeLeft = parseLayoutNumeric(doubleTubes.left, 0);
  const tubeTop = parseLayoutNumeric(doubleTubes.top, 0);
  const tubeWidth = finitePositiveNumber(doubleTubes.width, tubeConfig.width);
  const tubeHeight = finitePositiveNumber(doubleTubes.height, tubeConfig.height);
  const magnifierWidth = finitePositiveNumber(
    sourceMagnifier.width,
    magnifierConfig.width,
  );
  const magnifierHeight = finitePositiveNumber(
    sourceMagnifier.height,
    magnifierConfig.height,
  );
  const centeredLeft = Math.max(
    0,
    roundedLayoutNumber(tubeLeft + tubeWidth / 2 - magnifierWidth / 2),
  );
  const centeredTop = roundedLayoutNumber(
    tubeTop + tubeHeight + Math.max(18, Math.round(tubeHeight * 0.08)),
  );
  const normalizedMagnifier = {
    ...sourceMagnifier,
    width: magnifierWidth,
    height: magnifierHeight,
    measurementRole:
      sourceMagnifier.measurementRole ||
      measurementPieceRoleForType("single-magnifier"),
  };
  if (shouldCenterSingle) {
    normalizedMagnifier.left = centeredLeft;
    normalizedMagnifier.top = centeredTop;
  }

  const firstMagnifierIndex = magnifiers[0].index;
  const skippedMagnifierIndexes = new Set(
    magnifiers.slice(1).map((entry) => entry.index),
  );
  const nextItems = items
    .map((item, index) =>
      index === firstMagnifierIndex ? normalizedMagnifier : item,
    )
    .filter((_item, index) => !skippedMagnifierIndexes.has(index));

  const magnifierMoved =
    shouldCenterSingle &&
    (Math.abs(parseLayoutNumeric(sourceMagnifier.left, 0) - centeredLeft) >
      0.5 ||
      Math.abs(parseLayoutNumeric(sourceMagnifier.top, 0) - centeredTop) > 0.5);
  let changed =
    magnifiers.length > 1 ||
    magnifierMoved ||
    finitePositiveNumber(sourceMagnifier.width, magnifierWidth) !==
      magnifierWidth ||
    finitePositiveNumber(sourceMagnifier.height, magnifierHeight) !==
      magnifierHeight ||
    !sourceMagnifier.measurementRole;

  let nextGroup = changed ? { ...group, items: nextItems } : group;
  const bounds = layoutGeometryBounds(nextItems);
  if (bounds) {
    const neededWidth = Math.max(1, Math.ceil(bounds.right));
    const neededHeight = Math.max(1, Math.ceil(bounds.bottom));
    const currentWidth = finitePositiveNumber(nextGroup.width, neededWidth);
    const currentHeight = finitePositiveNumber(nextGroup.height, neededHeight);
    if (neededWidth > currentWidth || neededHeight > currentHeight) {
      nextGroup = {
        ...nextGroup,
        width: Math.max(currentWidth, neededWidth),
        height: Math.max(currentHeight, neededHeight),
      };
      changed = true;
    }
  }

  return { group: nextGroup, changed };
}

function normalizeSeparatedPairMeasurementLayoutItem(item) {
  if (
    !item ||
    typeof item !== "object" ||
    item.type !== PLAYGROUND_SAVED_GROUP_COMPONENT_TYPE ||
    !Array.isArray(item.items)
  ) {
    return { item, changed: false };
  }
  const groupDefinition = playgroundGroupComponentById(item.groupComponentId);
  const normalized = normalizeSeparatedPairMeasurementGroupGeometry(
    {
      ...(groupDefinition || {}),
      id: item.groupComponentId || groupDefinition?.id,
      label: groupDefinition?.label,
      width: finitePositiveNumber(
        item.itemsWidth,
        finitePositiveNumber(item.width, groupDefinition?.width || 320),
      ),
      height: finitePositiveNumber(
        item.itemsHeight,
        finitePositiveNumber(item.height, groupDefinition?.height || 240),
      ),
      items: item.items,
    },
    { centerSingleMagnifier: false },
  );
  if (!normalized.changed) {
    return { item, changed: false };
  }
  const nextItem = {
    ...item,
    items: normalized.group.items,
    itemsWidth: normalized.group.width,
    itemsHeight: normalized.group.height,
    width: Math.max(
      finitePositiveNumber(item.width, normalized.group.width),
      normalized.group.width,
    ),
    height: Math.max(
      finitePositiveNumber(item.height, normalized.group.height),
      normalized.group.height,
    ),
  };
  return { item: nextItem, changed: true };
}

function normalizeSeparatedPairMeasurementLayoutItems(items) {
  if (!Array.isArray(items)) {
    return { items: [], changed: false };
  }
  let changed = false;
  const normalizedItems = items.map((item) => {
    if (!item || typeof item !== "object") {
      return item;
    }
    let nextItem = item;
    if (Array.isArray(nextItem.items)) {
      const nested = normalizeSeparatedPairMeasurementLayoutItems(nextItem.items);
      if (nested.changed) {
        nextItem = { ...nextItem, items: nested.items };
        changed = true;
      }
    }
    const normalized = normalizeSeparatedPairMeasurementLayoutItem(nextItem);
    if (normalized.changed) {
      changed = true;
      return normalized.item;
    }
    return nextItem;
  });
  return { items: normalizedItems, changed };
}

function remapGroupComponentReferencesInItems(items, redirectMap) {
  if (!Array.isArray(items) || !(redirectMap instanceof Map) || redirectMap.size === 0) {
    return { items: Array.isArray(items) ? items : [], changed: false };
  }
  let changed = false;
  const nextItems = items.map((item) => {
    if (!item || typeof item !== "object") {
      return item;
    }
    const next = { ...item };
    if (redirectMap.has(next.groupComponentId)) {
      next.groupComponentId = redirectMap.get(next.groupComponentId);
      changed = true;
    }
    if (
      typeof next.type === "string" &&
      next.type.startsWith("group:") &&
      redirectMap.has(next.type.slice("group:".length))
    ) {
      next.type = `group:${redirectMap.get(next.type.slice("group:".length))}`;
      changed = true;
    }
    if (Array.isArray(next.items)) {
      const nested = remapGroupComponentReferencesInItems(next.items, redirectMap);
      next.items = nested.items;
      changed = nested.changed || changed;
    }
    if (next.layout && typeof next.layout === "object" && Array.isArray(next.layout.items)) {
      const nestedLayout = remapGroupComponentReferencesInItems(
        next.layout.items,
        redirectMap,
      );
      next.layout = { ...next.layout, items: nestedLayout.items };
      changed = nestedLayout.changed || changed;
    }
    return next;
  });
  return { items: nextItems, changed };
}

function normalizePlaygroundGroupComponentsPayload(payload) {
  const groups = Array.isArray(payload?.groups) ? payload.groups : [];
  const redirectMap = new Map();
  const preferredSeparateGroupIndex =
    preferredSeparateTwoQubitMeasurementGroupIndex(groups);
  let changed = false;

  const normalizedGroups = groups.reduce((acc, group, index) => {
    if (!group || typeof group !== "object") {
      return acc;
    }
    const isSeparateAlias = isSeparateTwoQubitMeasurementGroupAlias(group);
    const groupId = typeof group.id === "string" ? group.id : "";
    const groupIdKey = storageIdentifierKey(groupId);
    if (
      isSeparateAlias &&
      groupId &&
      groupIdKey !== SEPARATE_TWO_QUBIT_MEASUREMENT_GROUP_ID
    ) {
      redirectMap.set(groupId, SEPARATE_TWO_QUBIT_MEASUREMENT_GROUP_ID);
      changed = true;
    }
    if (isSeparateAlias && index !== preferredSeparateGroupIndex) {
      if (groupId) {
        redirectMap.set(groupId, SEPARATE_TWO_QUBIT_MEASUREMENT_GROUP_ID);
      }
      changed = true;
      return acc;
    }
    let nextGroup = { ...group };
    if (isSeparateAlias) {
      if (nextGroup.id !== SEPARATE_TWO_QUBIT_MEASUREMENT_GROUP_ID) {
        nextGroup.id = SEPARATE_TWO_QUBIT_MEASUREMENT_GROUP_ID;
        changed = true;
      }
    }
    if (
      isSeparateAlias &&
      nextGroup.label !== SEQUENTIAL_TWO_QUBIT_MEASUREMENT_LABEL
    ) {
      nextGroup.label = SEQUENTIAL_TWO_QUBIT_MEASUREMENT_LABEL;
      changed = true;
    }
    if (
      isSequentialTwoQubitMeasurementGroupDefinition(nextGroup) ||
      isSeparatedPairMeasurementGroupDefinition(nextGroup)
    ) {
      const normalized = normalizeSeparatedPairMeasurementGroupGeometry(
        nextGroup,
        { centerSingleMagnifier: true },
      );
      nextGroup = normalized.group;
      changed = normalized.changed || changed;
    }
    acc.push(nextGroup);
    return acc;
  }, []);

  const remappedGroups = normalizedGroups.map((group) => {
    if (!Array.isArray(group.items)) {
      return group;
    }
    const remapped = remapGroupComponentReferencesInItems(group.items, redirectMap);
    changed = remapped.changed || changed;
    return remapped.changed ? { ...group, items: remapped.items } : group;
  });

  legacyGroupComponentIdRedirects = redirectMap;
  return { payload: { groups: remappedGroups }, changed };
}

function separateTwoQubitMeasurementGroupFromLayoutItem(item) {
  if (
    !item ||
    typeof item !== "object" ||
    item.type !== PLAYGROUND_SAVED_GROUP_COMPONENT_TYPE ||
    !Array.isArray(item.items) ||
    !isSeparatedPairMeasurementGroupDefinition({ items: item.items })
  ) {
    return null;
  }
  const group = {
    id: SEPARATE_TWO_QUBIT_MEASUREMENT_GROUP_ID,
    label: SEQUENTIAL_TWO_QUBIT_MEASUREMENT_LABEL,
    width: finitePositiveNumber(
      item.itemsWidth,
      finitePositiveNumber(item.width, 442),
    ),
    height: finitePositiveNumber(
      item.itemsHeight,
      finitePositiveNumber(item.height, 530),
    ),
    items: item.items.map((child) =>
      stripQubitIdsFromLayoutGeometry({ ...(child || {}) }),
    ),
  };
  const normalized = normalizeSeparatedPairMeasurementGroupGeometry(group, {
    centerSingleMagnifier: false,
  });
  return normalized.group;
}

function builtInSeparateTwoQubitMeasurementGroup() {
  const state =
    readContentFileState(GENERATED_TABS_CONTENT_FILE) ||
    readBundledContentState(GENERATED_TABS_CONTENT_FILE) ||
    readRepositoryContentState("generated-tabs", GENERATED_TABS_CONTENT_FILE);
  const tabs = Array.isArray(state?.tabs) ? state.tabs : [];
  for (const tab of tabs) {
    const items = Array.isArray(tab?.layout?.items) ? tab.layout.items : [];
    for (const item of items) {
      const group = separateTwoQubitMeasurementGroupFromLayoutItem(item);
      if (group) {
        return group;
      }
    }
  }
  return null;
}

function builtInRegisterMeasurementGroup(numQubits) {
  const safeNumQubits = numQubits === 4 ? 4 : 3;
  const tubeType =
    safeNumQubits === 4 ? "quadruple-tube-array" : "triple-tube-array";
  const id =
    safeNumQubits === 4
      ? REGISTER_FOUR_QUBIT_MEASUREMENT_GROUP_ID
      : REGISTER_THREE_QUBIT_MEASUREMENT_GROUP_ID;
  const width = safeNumQubits === 4 ? 940 : 560;
  const tubeWidth = width - 40;
  const label =
    safeNumQubits === 4
      ? "Four qubit register measurement"
      : "Three qubit register measurement";
  return {
    id,
    label,
    width,
    height: 472,
    measurementRegisterQubitCount: safeNumQubits,
    items: [
      {
        type: "measurement-capacity",
        left: Math.round((width - 360) / 2),
        top: 0,
        width: 360,
        height: 60,
        z: 1,
        measurementRole: "capacity",
      },
      {
        type: tubeType,
        left: 20,
        top: 68,
        width: tubeWidth,
        height: 210,
        z: 2,
        measurementRole:
          safeNumQubits === 4 ? "quadruple-tubes" : "triple-tubes",
      },
      {
        type: "single-magnifier",
        left: Math.round((width - 160) / 2),
        top: 294,
        width: 160,
        height: 130,
        z: 3,
        measurementRole: "single-magnifier",
      },
      {
        type: "measurement-count-menu",
        left: Math.round((width - 110) / 2),
        top: 410,
        width: 110,
        height: 62,
        z: 4,
        measurementRole: "iteration-count",
      },
    ],
  };
}

function mergeBuiltInGroupComponentsPayload(payload) {
  const groups = Array.isArray(payload?.groups) ? payload.groups : [];
  const builtins = [
    builtInSeparateTwoQubitMeasurementGroup(),
    builtInRegisterMeasurementGroup(3),
    builtInRegisterMeasurementGroup(4),
  ].filter(Boolean);
  const existingIds = new Set(
    groups.map((group) => storageIdentifierKey(group?.id)),
  );
  return {
    ...(payload || {}),
    groups: [
      ...groups,
      ...builtins.filter(
        (group) => !existingIds.has(storageIdentifierKey(group.id)),
      ),
    ],
  };
}

function readPlaygroundGroupComponentsPayload() {
  try {
    const repositoryPayload = readRepositoryContentState(
      "component-groups",
      COMPONENT_GROUPS_CONTENT_FILE,
    );
    const serialized = window.localStorage.getItem(
      PLAYGROUND_GROUP_COMPONENTS_STORAGE_KEY,
    );
    if (!serialized && !repositoryPayload) {
      legacyGroupComponentIdRedirects = new Map();
      return mergeBuiltInGroupComponentsPayload({ groups: [] });
    }
    const browserPayload = serialized ? JSON.parse(serialized) : null;
    const repositoryGroups = Array.isArray(repositoryPayload?.groups)
      ? repositoryPayload.groups
      : [];
    const browserGroups = Array.isArray(browserPayload?.groups)
      ? browserPayload.groups
      : [];
    const browserIds = new Set(browserGroups.map((group) => group?.id));
    const parsed = {
      ...(repositoryPayload || {}),
      ...(browserPayload || {}),
      groups: [
        ...repositoryGroups.filter((group) => !browserIds.has(group?.id)),
        ...browserGroups,
      ],
    };
    const normalized = normalizePlaygroundGroupComponentsPayload(parsed);
    if (normalized.changed) {
      window.localStorage.setItem(
        PLAYGROUND_GROUP_COMPONENTS_STORAGE_KEY,
        JSON.stringify(normalized.payload),
      );
    }
    return mergeBuiltInGroupComponentsPayload(normalized.payload);
  } catch (_error) {
    legacyGroupComponentIdRedirects = new Map();
    return mergeBuiltInGroupComponentsPayload({ groups: [] });
  }
}

function writePlaygroundGroupComponentsPayload(payload) {
  try {
    const normalized = normalizePlaygroundGroupComponentsPayload(payload);
    const repositorySaved = writeLocalContentState(
      "component-groups",
      normalized.payload,
    );
    window.localStorage.setItem(
      PLAYGROUND_GROUP_COMPONENTS_STORAGE_KEY,
      JSON.stringify(normalized.payload),
    );
    playgroundGroupComponentsCache = normalized.payload;
    return repositorySaved || Boolean(window.localStorage);
  } catch (_error) {
    return false;
  }
}

function playgroundGroupComponents() {
  if (!playgroundGroupComponentsCache) {
    playgroundGroupComponentsCache = readPlaygroundGroupComponentsPayload();
  }
  return Array.isArray(playgroundGroupComponentsCache.groups)
    ? playgroundGroupComponentsCache.groups
    : [];
}

function savedGroupComponentType(groupId) {
  return `group:${groupId}`;
}

function savedGroupIdFromComponentType(type) {
  return typeof type === "string" && type.startsWith("group:")
    ? type.slice("group:".length)
    : "";
}

function savedGroupComponentForType(type) {
  const groupId = savedGroupIdFromComponentType(type);
  if (!groupId) {
    return null;
  }
  return playgroundGroupComponentById(groupId);
}

function playgroundGroupComponentById(groupId) {
  if (!groupId) {
    return null;
  }
  return (
    playgroundGroupComponents().find((group) => group?.id === groupId) || null
  );
}

function componentConfigForType(type, geometry = {}) {
  if (PLAYGROUND_COMPONENT_LIBRARY[type]) {
    return PLAYGROUND_COMPONENT_LIBRARY[type];
  }
  if (type === PLAYGROUND_SAVED_GROUP_COMPONENT_TYPE) {
    const group = playgroundGroupComponentById(geometry?.groupComponentId);
    return {
      label: group?.label || "Saved Group",
      width: Number.isFinite(group?.width) ? group.width : 320,
      height: Number.isFinite(group?.height) ? group.height : 240,
    };
  }
  const group = savedGroupComponentForType(type);
  if (group) {
    return {
      label: group.label || "Saved Group",
      width: Number.isFinite(group.width) ? group.width : 320,
      height: Number.isFinite(group.height) ? group.height : 240,
    };
  }
  return null;
}

function populateComponentPicker(select) {
  if (!(select instanceof HTMLSelectElement)) {
    return;
  }
  const previous = select.value;
  select.replaceChildren();
  const placeholder = document.createElement("option");
  placeholder.value = "";
  placeholder.selected = true;
  placeholder.textContent = "Click here";
  select.appendChild(placeholder);
  Object.entries(PLAYGROUND_COMPONENT_LIBRARY).forEach(([type, config]) => {
    const option = document.createElement("option");
    option.value = type;
    option.textContent = config.label;
    select.appendChild(option);
  });
  const visibleGroupKeys = new Set();
  playgroundGroupComponents().forEach((group) => {
    if (!group?.id || isHiddenComponentPickerGroup(group)) {
      return;
    }
    const groupKey = isSeparateTwoQubitMeasurementGroupAlias(group)
      ? storageLabelKey(SEQUENTIAL_TWO_QUBIT_MEASUREMENT_LABEL)
      : storageLabelKey(group.label || group.id);
    if (visibleGroupKeys.has(groupKey)) {
      return;
    }
    visibleGroupKeys.add(groupKey);
    const option = document.createElement("option");
    option.value = savedGroupComponentType(group.id);
    option.textContent = isSeparateTwoQubitMeasurementGroupAlias(group)
      ? SEQUENTIAL_TWO_QUBIT_MEASUREMENT_LABEL
      : group.label || "Saved Group";
    select.appendChild(option);
  });
  select.value = Array.from(select.options).some(
    (option) => option.value === previous,
  )
    ? previous
    : "";
}

function refreshAllComponentPickers() {
  populateComponentPicker(playgroundComponentSelect);
  populateComponentPicker(docEditorComponentSelect);
  document
    .querySelectorAll('[data-generated-editor-role="component-select"]')
    .forEach((select) => populateComponentPicker(select));
}

function normalizeSavedGroupLayoutItems(items) {
  if (!Array.isArray(items)) {
    return [];
  }
  const looseGroups = new Map();
  items.forEach((item, index) => {
    if (
      !item ||
      item.type === PLAYGROUND_SAVED_GROUP_COMPONENT_TYPE ||
      !item.groupComponentId ||
      !item.measurementGroupId ||
      !playgroundGroupComponentById(item.groupComponentId)
    ) {
      return;
    }
    const key = `${item.groupComponentId}::${item.measurementGroupId}`;
    const entry = looseGroups.get(key) || {
      groupComponentId: item.groupComponentId,
      measurementGroupId: item.measurementGroupId,
      firstIndex: index,
      items: [],
    };
    entry.items.push(item);
    looseGroups.set(key, entry);
  });
  looseGroups.forEach((entry, key) => {
    if (entry.items.length < 2) {
      looseGroups.delete(key);
    }
  });
  if (looseGroups.size === 0) {
    const separated = normalizeSeparatedPairMeasurementLayoutItems(items);
    return separated.changed ? separated.items : items;
  }
  const consumed = new Set();
  const wrappersByFirstIndex = new Map();
  looseGroups.forEach((entry) => {
    const bounds = entry.items.reduce(
      (acc, item) => {
        const left = parseLayoutNumeric(item.left, 0);
        const top = parseLayoutNumeric(item.top, 0);
        const width = parseLayoutNumeric(item.width, 0);
        const height = parseLayoutNumeric(item.height, 0);
        return {
          left: Math.min(acc.left, left),
          top: Math.min(acc.top, top),
          right: Math.max(acc.right, left + width),
          bottom: Math.max(acc.bottom, top + height),
          z: Math.max(acc.z, parseLayoutNumeric(item.z, 1)),
        };
      },
      {
        left: Number.POSITIVE_INFINITY,
        top: Number.POSITIVE_INFINITY,
        right: Number.NEGATIVE_INFINITY,
        bottom: Number.NEGATIVE_INFINITY,
        z: 1,
      },
    );
    if (
      ![bounds.left, bounds.top, bounds.right, bounds.bottom].every(
        Number.isFinite,
      )
    ) {
      return;
    }
    entry.items.forEach((item) => consumed.add(item));
    wrappersByFirstIndex.set(entry.firstIndex, {
      type: PLAYGROUND_SAVED_GROUP_COMPONENT_TYPE,
      left: bounds.left,
      top: bounds.top,
      width: Math.max(1, bounds.right - bounds.left),
      height: Math.max(1, bounds.bottom - bounds.top),
      z: bounds.z,
      measurementGroupId: entry.measurementGroupId,
      groupComponentId: entry.groupComponentId,
    });
  });
  const groupedItems = items.reduce((acc, item, index) => {
    if (wrappersByFirstIndex.has(index)) {
      acc.push(wrappersByFirstIndex.get(index));
    }
    if (!consumed.has(item)) {
      acc.push(item);
    }
    return acc;
  }, []);
  return normalizeSeparatedPairMeasurementLayoutItems(groupedItems).items;
}

function validPoint(point) {
  return point && Number.isFinite(point.x) && Number.isFinite(point.y)
    ? point
    : null;
}

function normalizeTabLabel(label) {
  return String(label || "")
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase();
}

function generatedTabSlug(label) {
  const slug = normalizeTabLabel(label)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return slug || "tab";
}

function normalizeGeneratedTabLayout(layout) {
  if (!layout || typeof layout !== "object") {
    return { layout, changed: false };
  }
  const remapped = remapGroupComponentReferencesInItems(
    layout.items,
    legacyGroupComponentIdRedirects,
  );
  const separated = normalizeSeparatedPairMeasurementLayoutItems(remapped.items);
  let strippedGroupSnapshots = false;
  const normalizedItems = separated.items.map((item) => {
    if (
      item?.type !== PLAYGROUND_SAVED_GROUP_COMPONENT_TYPE ||
      !item.groupComponentId ||
      !playgroundGroupComponentById(item.groupComponentId) ||
      (!Array.isArray(item.items) &&
        item.itemsWidth === undefined &&
        item.itemsHeight === undefined)
    ) {
      return item;
    }
    const nextItem = { ...item };
    delete nextItem.items;
    delete nextItem.itemsWidth;
    delete nextItem.itemsHeight;
    strippedGroupSnapshots = true;
    return nextItem;
  });
  if (!remapped.changed && !separated.changed && !strippedGroupSnapshots) {
    return { layout, changed: false };
  }
  return {
    layout: {
      ...layout,
      items: normalizedItems,
    },
    changed: true,
  };
}

function normalizeGeneratedTabsState(state) {
  const oldTabs = Array.isArray(state?.[LEGACY_GENERATED_TABS_PROPERTY])
    ? state[LEGACY_GENERATED_TABS_PROPERTY]
    : [];
  const tabs = Array.isArray(state?.tabs) ? state.tabs : oldTabs;
  let changed = !Array.isArray(state?.tabs) && oldTabs.length > 0;
  const normalizedTabs = tabs.reduce((acc, entry) => {
    if (!entry || typeof entry !== "object") {
      return acc;
    }
    const normalizedLayout = normalizeGeneratedTabLayout(entry.layout);
    changed = normalizedLayout.changed || changed;
    let normalizedEntry = normalizedLayout.changed
      ? { ...entry, layout: normalizedLayout.layout }
      : entry;
    if (Object.prototype.hasOwnProperty.call(normalizedEntry, "experiment")) {
      const cleanEntry = { ...normalizedEntry };
      delete cleanEntry.experiment;
      acc.push(cleanEntry);
      changed = true;
    } else {
      acc.push(normalizedEntry);
    }
    return acc;
  }, []);
  return { state: { tabs: normalizedTabs }, changed };
}

function localContentApiEndpoints(contentName) {
  const name = String(contentName || "").replace(/[^a-z-]/g, "");
  if (!name || IS_STATIC_BUILD) {
    return [];
  }
  const path = `${LOCAL_CONTENT_API_ROOT}/${name}`;
  const canonicalLocalEndpoint = `http://127.0.0.1:${LOCAL_CONTENT_API_PORT}${path}`;
  const protocol = window.location.protocol;
  if (protocol === "file:") {
    return [canonicalLocalEndpoint];
  }
  if (protocol !== "http:" && protocol !== "https:") {
    return [];
  }
  const host = String(window.location.hostname || "").toLowerCase();
  const localHosts = new Set(["localhost", "127.0.0.1", "::1", "[::1]"]);
  if (!localHosts.has(host)) {
    return [];
  }
  const endpoints = [path];
  const currentPort =
    window.location.port ||
    (protocol === "https:" ? "443" : protocol === "http:" ? "80" : "");
  const isCanonicalLocalServer =
    (host === "127.0.0.1" || host === "localhost") &&
    currentPort === LOCAL_CONTENT_API_PORT;
  if (!isCanonicalLocalServer) {
    endpoints.push(canonicalLocalEndpoint);
  }
  return endpoints;
}

function readJsonResourceSync(url) {
  if (!url || typeof XMLHttpRequest === "undefined") {
    return null;
  }
  try {
    const request = new XMLHttpRequest();
    request.open("GET", url, false);
    request.overrideMimeType?.("application/json");
    request.send(null);
    const ok =
      (request.status >= 200 && request.status < 300) ||
      (request.status === 0 && Boolean(request.responseText));
    if (!ok || !request.responseText) {
      return null;
    }
    return JSON.parse(request.responseText);
  } catch (_error) {
    return null;
  }
}

function writeJsonResourceSync(url, payload) {
  if (!url || typeof XMLHttpRequest === "undefined") {
    return false;
  }
  try {
    const request = new XMLHttpRequest();
    request.open("POST", url, false);
    request.send(JSON.stringify(payload));
    return request.status >= 200 && request.status < 300;
  } catch (_error) {
    return false;
  }
}

function browserContentStorageKey(contentName) {
  return `${BROWSER_CONTENT_STORAGE_PREFIX}_${String(contentName || "").replace(/[^a-z-]/g, "")}`;
}

function readBrowserContentState(contentName) {
  try {
    const serialized = window.localStorage.getItem(
      browserContentStorageKey(contentName),
    );
    if (!serialized) {
      return null;
    }
    const state = JSON.parse(serialized);
    return state && typeof state === "object" ? state : null;
  } catch (_error) {
    return null;
  }
}

function writeBrowserContentState(contentName, state) {
  try {
    window.localStorage.setItem(
      browserContentStorageKey(contentName),
      JSON.stringify(state),
    );
    return true;
  } catch (_error) {
    return false;
  }
}

function readLocalContentState(contentName) {
  const endpoints = localContentApiEndpoints(contentName);
  for (const endpoint of endpoints) {
    const state = readJsonResourceSync(endpoint);
    if (state && typeof state === "object") {
      return state;
    }
  }
  return null;
}

function writeLocalContentState(contentName, state) {
  return localContentApiEndpoints(contentName).some((endpoint) =>
    writeJsonResourceSync(endpoint, state),
  );
}

function contentFileSaveFailureMessage() {
  return "Save failed. Start the local server with npm run serve, or enable browser storage.";
}

function readBundledContentState(relativePath) {
  const bundle = window.__QUANTUM_REPOSITORY_CONTENT__;
  const files = bundle && typeof bundle === "object" ? bundle.files : null;
  if (!files || typeof files !== "object") {
    return null;
  }
  return cloneJson(files[relativePath]);
}

function readContentFileState(relativePath) {
  const bundledState = readBundledContentState(relativePath);
  if (window.location.protocol === "file:" && bundledState) {
    return bundledState;
  }
  if (!CONTENT_FILE_CACHE_BUST) {
    return readJsonResourceSync(relativePath) || bundledState;
  }
  const separator = relativePath.includes("?") ? "&" : "?";
  return (
    readJsonResourceSync(
      `${relativePath}${separator}v=${encodeURIComponent(CONTENT_FILE_CACHE_BUST)}`,
    ) || bundledState
  );
}

function readRepositoryContentState(contentName, relativePath) {
  const bundledState = readBundledContentState(relativePath);
  if (window.location.protocol === "file:" && bundledState) {
    return readBrowserContentState(contentName) || bundledState;
  }
  return (
    readLocalContentState(contentName) ||
    readBrowserContentState(contentName) ||
    readContentFileState(relativePath)
  );
}

function readGeneratedTabsState() {
  const fileState = readRepositoryContentState(
    "generated-tabs",
    GENERATED_TABS_CONTENT_FILE,
  );
  if (!fileState || typeof fileState !== "object") {
    return { tabs: [] };
  }
  const normalized = normalizeGeneratedTabsState(fileState);
  if (normalized.changed && !IS_STATIC_BUILD) {
    writeLocalContentState("generated-tabs", normalized.state);
  }
  return normalized.state;
}

function writeGeneratedTabsState(state) {
  const normalized = normalizeGeneratedTabsState(state).state;
  if (writeLocalContentState("generated-tabs", normalized)) {
    return true;
  }
  return writeBrowserContentState("generated-tabs", normalized);
}

function createDocumentScene(overrides = {}) {
  const id =
    typeof overrides.id === "string" && overrides.id
      ? overrides.id
      : `scene-${Date.now().toString(36)}-${Math.random()
          .toString(36)
          .slice(2, 7)}`;
  return {
    id,
    title:
      typeof overrides.title === "string" && overrides.title
        ? overrides.title
        : "Scene",
    items: Array.isArray(overrides.items)
      ? normalizeSavedGroupLayoutItems(overrides.items)
      : [],
    canvasWidth: clamp(
      parseLayoutNumeric(overrides.canvasWidth, 900),
      520,
      2600,
    ),
    canvasHeight: clamp(
      parseLayoutNumeric(overrides.canvasHeight, 560),
      420,
      2200,
    ),
    experiment: cloneGeneratedExperiment(overrides.experiment),
    savedAt: Number.isFinite(overrides.savedAt)
      ? overrides.savedAt
      : Date.now(),
  };
}

function normalizeDocument(documentEntry) {
  if (!documentEntry || typeof documentEntry !== "object") {
    return null;
  }
  const tabId = storageIdentifierKey(documentEntry.tabId);
  if (!tabId) {
    return null;
  }
  const scenes = Array.isArray(documentEntry.scenes)
    ? documentEntry.scenes.map(createDocumentScene).filter(Boolean)
    : [];
  return {
    version: 1,
    tabId,
    title:
      typeof documentEntry.title === "string" && documentEntry.title
        ? documentEntry.title
        : "What's this?",
    scenes: scenes.length > 0 ? scenes : [createDocumentScene()],
    updatedAt: Number.isFinite(documentEntry.updatedAt)
      ? documentEntry.updatedAt
      : Date.now(),
  };
}

function normalizeDocumentsState(state) {
  const rawDocuments = Array.isArray(state?.documents)
    ? state.documents
    : Array.isArray(state)
      ? state
      : [];
  const byTab = new Map();
  rawDocuments.forEach((entry) => {
    const normalized = normalizeDocument(entry);
    if (normalized) {
      byTab.set(normalized.tabId, normalized);
    }
  });
  return { documents: Array.from(byTab.values()) };
}

function normalizeDocumentsContentState(state) {
  if (!state || typeof state !== "object") {
    return null;
  }
  return normalizeDocumentsState(state);
}

function readDocumentsState() {
  const fileState = normalizeDocumentsContentState(
    readRepositoryContentState("documents", DOCUMENTS_CONTENT_FILE),
  );
  return fileState || { documents: [] };
}

function writeDocumentsState(state) {
  const normalized = normalizeDocumentsState(state);
  if (writeLocalContentState("documents", normalized)) {
    documentsState = normalized;
    return true;
  }
  if (writeBrowserContentState("documents", normalized)) {
    documentsState = normalized;
    return true;
  }
  return false;
}

function documentForTabId(tabId) {
  const normalizedTabId = storageIdentifierKey(tabId);
  if (!normalizedTabId) {
    return null;
  }
  return (
    (documentsState.documents || []).find(
      (entry) => entry?.tabId === normalizedTabId,
    ) || null
  );
}

function upsertDocument(documentEntry) {
  const normalized = normalizeDocument(documentEntry);
  if (!normalized) {
    return false;
  }
  const nextDocuments = (documentsState.documents || []).filter(
    (entry) => entry.tabId !== normalized.tabId,
  );
  return writeDocumentsState({
    documents: [...nextDocuments, { ...normalized, updatedAt: Date.now() }],
  });
}

function deleteDocumentForTabId(tabId) {
  const normalizedTabId = storageIdentifierKey(tabId);
  if (!normalizedTabId) {
    return false;
  }
  return writeDocumentsState({
    documents: (documentsState.documents || []).filter(
      (entry) => entry.tabId !== normalizedTabId,
    ),
  });
}

function sceneHasRecordedExperiment(scene) {
  return Boolean(
    scene?.experiment &&
      Array.isArray(scene.experiment.actions) &&
      scene.experiment.actions.length > 0,
  );
}

function sceneHasExperimentCandidate(scene) {
  return (Array.isArray(scene?.items) ? scene.items : []).some(
    (item) => item?.type && item.type !== "text-box",
  );
}

function savedPlaygroundMeasurementParts(measurementLayout) {
  if (!measurementLayout || typeof measurementLayout !== "object") {
    return null;
  }
  const parts = measurementLayout.parts;
  return parts && typeof parts === "object" ? parts : measurementLayout;
}

function measurementPartSpecsForType(type) {
  if (type === "single-measurement") {
    return PLAYGROUND_SINGLE_MEASUREMENT_PART_SPECS;
  }
  if (type === "double-measurement") {
    return PLAYGROUND_DOUBLE_MEASUREMENT_PART_SPECS;
  }
  return [];
}

function editableMeasurementPartSpecsForType(type) {
  return measurementPartSpecsForType(type);
}

function clearMeasurementPartLayoutEditing(item) {
  if (
    !(item instanceof HTMLElement) ||
    !isMeasurementComponentType(item.dataset.component)
  ) {
    return;
  }
  measurementPartSpecsForType(item.dataset.component).forEach((spec) => {
    const element = item.querySelector(spec.selector);
    if (!(element instanceof HTMLElement)) {
      return;
    }
    delete element.dataset.playgroundMeasurementPart;
    delete element.dataset.layoutEditTarget;
    delete element.dataset.layoutResizable;
    delete element.dataset.layoutUniformResize;
    delete element.dataset.layoutMinWidth;
    delete element.dataset.layoutMinHeight;
    element.classList.remove("layout-edit-dragging", "layout-edit-selected");
    element
      .querySelectorAll(":scope > .layout-resize-handle")
      .forEach((handle) => handle.remove());
  });
}

function isMeasurementComponentType(type) {
  return type === "single-measurement" || type === "double-measurement";
}

function applyMeasurementLayoutSnapshot(
  item,
  measurementLayout,
  specs,
  options = {},
) {
  const savedParts = savedPlaygroundMeasurementParts(measurementLayout);
  if (!(item instanceof HTMLElement) || !savedParts) {
    return;
  }
  const includeGroupGeometry = options.includeGroupGeometry !== false;
  if (
    includeGroupGeometry &&
    measurementLayout.group &&
    typeof measurementLayout.group === "object"
  ) {
    applyLayoutSnapshotToElement(item, measurementLayout.group);
    if (
      measurementLayout.group.inlineStyle &&
      typeof measurementLayout.group.inlineStyle === "object"
    ) {
      Object.entries(measurementLayout.group.inlineStyle).forEach(
        ([property, value]) => {
          if (typeof value === "string") {
            item.style[property] = value;
          }
        },
      );
    }
  }
  specs.forEach((spec) => {
    const element = item.querySelector(spec.selector);
    const snapshot = savedParts[spec.key];
    if (
      !(element instanceof HTMLElement) ||
      !snapshot ||
      typeof snapshot !== "object"
    ) {
      return;
    }
    applyLayoutSnapshotToElement(element, snapshot);
    if (snapshot.inlineStyle && typeof snapshot.inlineStyle === "object") {
      Object.entries(snapshot.inlineStyle).forEach(([property, value]) => {
        if (typeof value === "string") {
          element.style[property] = value;
        }
      });
    }
  });
}

function applySingleMeasurementLayoutSnapshot(
  item,
  measurementLayout,
  options = {},
) {
  applyMeasurementLayoutSnapshot(
    item,
    measurementLayout,
    PLAYGROUND_SINGLE_MEASUREMENT_PART_SPECS,
    options,
  );
}

function applyDoubleMeasurementLayoutSnapshot(
  item,
  measurementLayout,
  options = {},
) {
  applyMeasurementLayoutSnapshot(
    item,
    measurementLayout,
    PLAYGROUND_DOUBLE_MEASUREMENT_PART_SPECS,
    options,
  );
}

function parseMeasurementCountText(element) {
  return Math.max(0, Number.parseInt(element?.textContent || "0", 10) || 0);
}

function setMeasurementCountText(element, value) {
  if (element instanceof HTMLElement) {
    element.textContent = `${Math.max(0, Math.round(Number(value) || 0))}`;
  }
}

function savedMeasurementCapacity(value, fallback = INITIAL_TUBE_QUBIT_CAPACITY) {
  return Math.max(
    fallback,
    Math.round(finitePositiveNumber(value, fallback)),
  );
}

function measurementSelectValue(select) {
  if (!(select instanceof HTMLSelectElement)) {
    return null;
  }
  const value = Math.max(1, Number(select.value) || 1);
  return Number.isFinite(value) ? value : null;
}

function setMeasurementSelectValue(select, value) {
  if (!(select instanceof HTMLSelectElement) || !Number.isFinite(Number(value))) {
    return;
  }
  const textValue = `${Math.max(1, Math.round(Number(value)))}`;
  if (Array.from(select.options).some((option) => option.value === textValue)) {
    select.value = textValue;
  }
}

function captureGeneratedMeasurementStateSnapshot(item) {
  if (!(item instanceof HTMLElement)) {
    return null;
  }
  if (item.dataset.component === "single-measurement") {
    const runtime = generatedSingleMeasurementRuntimes.get(item);
    const blue = runtime
      ? runtime.blueTubeCount
      : parseMeasurementCountText(
          item.querySelector('[data-role="tube-blue-count"]'),
        );
    const red = runtime
      ? runtime.redTubeCount
      : parseMeasurementCountText(
          item.querySelector('[data-role="tube-red-count"]'),
        );
    return {
      kind: "single",
      blue,
      red,
      capacity: savedMeasurementCapacity(runtime?.tubeQubitCapacity),
      iterations: measurementSelectValue(
        item.querySelector('[data-role="measurement-count"]'),
      ),
    };
  }
  if (item.dataset.component === "double-measurement") {
    const runtime = generatedDoubleMeasurementRuntimes.get(item);
    const counts = {};
    registerMeasurementOutcomeKeys(2).forEach((key) => {
      counts[key] =
        runtime?.tubeCounts?.[key] ??
        parseMeasurementCountText(
          item.querySelector(`[data-role="pair-count-${key}"]`),
        );
    });
    return {
      kind: "double",
      counts,
      capacity: savedMeasurementCapacity(runtime?.tubePairCapacity),
      iterations: measurementSelectValue(
        item.querySelector('[data-role="pair-measurement-count"]'),
      ),
    };
  }
  if (isSeparatedPairMeasurementGroupElement(item)) {
    const runtime = generatedSeparatedPairMeasurementRuntimes.get(item);
    const counts = {};
    registerMeasurementOutcomeKeysForItem(item).forEach((key) => {
      counts[key] =
        runtime?.tubeCounts?.[key] ??
        parseMeasurementCountText(
          item.querySelector(
            `.pair-tube-column[data-key="${key}"] .tube-count`,
          ),
        );
    });
    return {
      kind: "separated-pair",
      counts,
      capacity: savedMeasurementCapacity(runtime?.tubePairCapacity),
      iterations: measurementSelectValue(
        item.querySelector(
          '.saved-group-child[data-component="measurement-count-menu"] [data-role="measurement-count"], [data-role="pair-measurement-count"]',
        ),
      ),
    };
  }
  return null;
}

function applyGeneratedMeasurementStateSnapshot(item, measurementState) {
  if (
    !(item instanceof HTMLElement) ||
    !measurementState ||
    typeof measurementState !== "object"
  ) {
    return;
  }
  const capacity = savedMeasurementCapacity(measurementState.capacity);
  if (item.dataset.component === "single-measurement") {
    const blue = Math.max(0, Math.round(Number(measurementState.blue) || 0));
    const red = Math.max(0, Math.round(Number(measurementState.red) || 0));
    item.dataset.measurementTubeCapacity = `${capacity}`;
    setMeasurementCountText(
      item.querySelector('[data-role="tube-blue-count"]'),
      blue,
    );
    setMeasurementCountText(
      item.querySelector('[data-role="tube-red-count"]'),
      red,
    );
    setMeasurementSelectValue(
      item.querySelector('[data-role="measurement-count"]'),
      measurementState.iterations,
    );
    const runtime = generatedSingleMeasurementRuntimes.get(item);
    if (runtime) {
      runtime.blueTubeCount = blue;
      runtime.redTubeCount = red;
      runtime.tubeQubitCapacity = capacity;
      setMeasurementSelectValue(
        runtime.measurementCount,
        measurementState.iterations,
      );
      updateGeneratedMeasurementTubeFills(runtime);
    }
    return;
  }
  if (
    item.dataset.component === "double-measurement" ||
    measurementState.kind === "separated-pair"
  ) {
    item.dataset.measurementTubeCapacity = `${capacity}`;
    const counts =
      measurementState.counts && typeof measurementState.counts === "object"
        ? measurementState.counts
        : {};
    const normalizedCounts = {};
    const measurementKeys =
      item.dataset.component === "double-measurement"
        ? registerMeasurementOutcomeKeys(2)
        : registerMeasurementOutcomeKeysForItem(item);
    measurementKeys.forEach((key) => {
      normalizedCounts[key] = Math.max(
        0,
        Math.round(Number(counts[key]) || 0),
      );
      setMeasurementCountText(
        item.dataset.component === "double-measurement"
          ? item.querySelector(`[data-role="pair-count-${key}"]`)
          : item.querySelector(
              `.pair-tube-column[data-key="${key}"] .tube-count`,
            ),
        normalizedCounts[key],
      );
    });
    setMeasurementSelectValue(
      item.dataset.component === "double-measurement"
        ? item.querySelector('[data-role="pair-measurement-count"]')
        : item.querySelector(
            '.saved-group-child[data-component="measurement-count-menu"] [data-role="measurement-count"], [data-role="pair-measurement-count"]',
          ),
      measurementState.iterations,
    );
    const runtime =
      item.dataset.component === "double-measurement"
        ? generatedDoubleMeasurementRuntimes.get(item)
        : generatedSeparatedPairMeasurementRuntimes.get(item);
    if (runtime) {
      runtime.tubeCounts = { ...runtime.tubeCounts, ...normalizedCounts };
      runtime.tubePairCapacity = capacity;
      setMeasurementSelectValue(
        runtime.measurementCount,
        measurementState.iterations,
      );
      updateGeneratedDoubleMeasurementTubeFills(runtime);
    }
  }
}

function captureGeneratedMeasurementStateSnapshotsForCanvas(canvas) {
  if (!isGeneratedLayoutCanvas(canvas)) {
    return [];
  }
  return Array.from(canvas.querySelectorAll(":scope > .playground-node"))
    .map((item) => {
      const measurementState = captureGeneratedMeasurementStateSnapshot(item);
      return measurementState
        ? {
            itemId: ensureGeneratedItemId(item),
            measurementState,
          }
        : null;
    })
    .filter(Boolean);
}

function applyGeneratedMeasurementStateSnapshotsForCanvas(canvas, snapshots) {
  if (!isGeneratedLayoutCanvas(canvas) || !Array.isArray(snapshots)) {
    return;
  }
  snapshots.forEach((snapshot) => {
    const item = generatedItemById(canvas, snapshot?.itemId);
    applyGeneratedMeasurementStateSnapshot(item, snapshot?.measurementState);
  });
}

function captureMeasurementLayoutSnapshot(item, specs, options = {}) {
  if (
    !(item instanceof HTMLElement) ||
    !Array.isArray(specs) ||
    (specs.length === 0 && options.includeGroup !== true)
  ) {
    return null;
  }
  const includeGroup = options.includeGroup === true;
  const captureAll = options.captureAll === true;
  const snapshot = {};
  const parts = {};
  if (includeGroup) {
    const groupState = snapshotLayoutEditableElement(item);
    const groupInlineStyle = snapshotInlineStyleSubset(item, [
      "left",
      "top",
      "right",
      "bottom",
    ]);
    if (
      groupState &&
      (captureAll ||
        hasMeaningfulLayoutDelta(
          groupState.tx,
          groupState.ty,
          groupState.width,
          groupState.height,
        ) ||
        groupInlineStyle)
    ) {
      if (groupInlineStyle) {
        groupState.inlineStyle = groupInlineStyle;
      }
      snapshot.group = groupState;
    }
  }
  specs.forEach((spec) => {
    const element = item.querySelector(spec.selector);
    if (!(element instanceof HTMLElement)) {
      return;
    }
    const state = snapshotLayoutEditableElement(element);
    const inlineStyle = snapshotInlineStyleSubset(element, [
      "left",
      "top",
      "right",
      "bottom",
    ]);
    if (
      state &&
      (captureAll ||
        hasMeaningfulLayoutDelta(
          state.tx,
          state.ty,
          state.width,
          state.height,
        ) ||
        inlineStyle)
    ) {
      if (inlineStyle) {
        state.inlineStyle = inlineStyle;
      }
      parts[spec.key] = state;
    }
  });
  if (Object.keys(parts).length > 0) {
    snapshot.parts = parts;
  }
  return Object.keys(snapshot).length > 0 ? snapshot : null;
}

function findPlaygroundCnotPrototypeSource() {
  if (!playgroundCanvas) {
    return null;
  }
  const cnotNodes = Array.from(
    playgroundCanvas.querySelectorAll(
      ".playground-node[data-component='cnot-gate']",
    ),
  );
  if (cnotNodes.length === 0) {
    return null;
  }
  const editedNode = cnotNodes.find(
    (node) =>
      node.dataset.layoutManual === "true" ||
      node.querySelector("[data-layout-manual='true']"),
  );
  return editedNode || cnotNodes[cnotNodes.length - 1];
}

function findPlaygroundComponentPrototypeSource(type) {
  if (!playgroundCanvas || !type) {
    return null;
  }
  const nodes = Array.from(
    playgroundCanvas.querySelectorAll(
      `.playground-node[data-component='${type}']`,
    ),
  );
  if (nodes.length === 0) {
    return null;
  }
  const editedNode = nodes.find(
    (node) =>
      node.dataset.layoutManual === "true" ||
      node.querySelector("[data-layout-manual='true']"),
  );
  return editedNode || nodes[nodes.length - 1];
}

function persistPlaygroundCnotDefaultsFromDom(sourceOverride = null) {
  const source =
    sourceOverride instanceof HTMLElement
      ? sourceOverride
      : findPlaygroundCnotPrototypeSource();
  if (!(source instanceof HTMLElement)) {
    return false;
  }
  const snapshot = captureCnotComponentDefaultsFromElement(source);
  if (!snapshot) {
    return false;
  }
  const payload = readPlaygroundComponentDefaultsPayload();
  payload["cnot-gate"] = snapshot;
  payload.__componentGeometryDefaults = {
    ...componentGeometryDefaults(payload),
    "cnot-gate": {
      width: Math.round(source.offsetWidth),
      height: Math.round(source.offsetHeight),
    },
  };
  const saved = writePlaygroundComponentDefaultsPayload(payload);
  if (saved) {
    playgroundComponentDefaultsCache = payload;
  }
  return (
    saved &&
    syncGeneratedCnotLayoutsFromComponentDefaults(
      snapshot,
      componentGeometryDefaults(payload)["cnot-gate"],
    )
  );
}

function updateCnotLayoutDefaultsInItems(items, snapshot, geometryDefaults) {
  if (!Array.isArray(items)) {
    return { items: [], changed: false };
  }
  let changed = false;
  const nextItems = items.map((item) => {
    if (!item || typeof item !== "object") {
      return item;
    }
    let nextItem = item;
    if (item.type === "cnot-gate") {
      nextItem = {
        ...item,
        cnotLayout: cloneJson(snapshot),
      };
      if (Number.isFinite(geometryDefaults?.width)) {
        nextItem.width = geometryDefaults.width;
      }
      if (Number.isFinite(geometryDefaults?.height)) {
        nextItem.height = geometryDefaults.height;
      }
      changed = true;
    }
    if (Array.isArray(nextItem.items)) {
      const nested = updateCnotLayoutDefaultsInItems(
        nextItem.items,
        snapshot,
        geometryDefaults,
      );
      if (nested.changed) {
        nextItem = { ...nextItem, items: nested.items };
        changed = true;
      }
    }
    if (Array.isArray(nextItem.layout?.items)) {
      const nestedLayout = updateCnotLayoutDefaultsInItems(
        nextItem.layout.items,
        snapshot,
        geometryDefaults,
      );
      if (nestedLayout.changed) {
        nextItem = {
          ...nextItem,
          layout: { ...nextItem.layout, items: nestedLayout.items },
        };
        changed = true;
      }
    }
    return nextItem;
  });
  return { items: nextItems, changed };
}

function syncGeneratedCnotLayoutsFromComponentDefaults(
  snapshot,
  geometryDefaults,
) {
  if (!snapshot || typeof snapshot !== "object") {
    return false;
  }
  const currentState = cloneJson(generatedTabsState) || { tabs: [] };
  let changed = false;
  const nextTabs = (Array.isArray(currentState.tabs) ? currentState.tabs : [])
    .map((entry) => {
      if (!entry || typeof entry !== "object" || !entry.layout) {
        return entry;
      }
      const updated = updateCnotLayoutDefaultsInItems(
        entry.layout.items,
        snapshot,
        geometryDefaults,
      );
      if (!updated.changed) {
        return entry;
      }
      changed = true;
      return {
        ...entry,
        layout: {
          ...entry.layout,
          items: updated.items,
          savedAt: Date.now(),
        },
      };
    });
  if (!changed) {
    return true;
  }
  const nextState = { ...currentState, tabs: nextTabs };
  if (!writeGeneratedTabsState(nextState)) {
    return false;
  }
  applyGeneratedTabsState(nextState);
  plagroundComposer?.handleGeneratedTabsChanged?.();
  documentEditorComposer?.handleGeneratedTabsChanged?.();
  return true;
}

function updateMeasurementLayoutDefaultsInItems(items, type, snapshot) {
  if (!Array.isArray(items)) {
    return { items: [], changed: false };
  }
  let changed = false;
  const nextItems = items.map((item) => {
    if (!item || typeof item !== "object") {
      return item;
    }
    let nextItem = item;
    if (item.type === type) {
      nextItem = {
        ...item,
        measurementLayout: cloneJson(snapshot),
      };
      changed = true;
    }
    if (Array.isArray(nextItem.items)) {
      const nested = updateMeasurementLayoutDefaultsInItems(
        nextItem.items,
        type,
        snapshot,
      );
      if (nested.changed) {
        nextItem = { ...nextItem, items: nested.items };
        changed = true;
      }
    }
    if (Array.isArray(nextItem.layout?.items)) {
      const nestedLayout = updateMeasurementLayoutDefaultsInItems(
        nextItem.layout.items,
        type,
        snapshot,
      );
      if (nestedLayout.changed) {
        nextItem = {
          ...nextItem,
          layout: { ...nextItem.layout, items: nestedLayout.items },
        };
        changed = true;
      }
    }
    return nextItem;
  });
  return { items: nextItems, changed };
}

function syncGeneratedMeasurementLayoutsFromComponentDefaults(type, snapshot) {
  if (
    !isMeasurementComponentType(type) ||
    !snapshot ||
    typeof snapshot !== "object"
  ) {
    return false;
  }
  const currentState = cloneJson(generatedTabsState) || { tabs: [] };
  let changed = false;
  const nextTabs = (Array.isArray(currentState.tabs) ? currentState.tabs : [])
    .map((entry) => {
      if (!entry || typeof entry !== "object" || !entry.layout) {
        return entry;
      }
      const updated = updateMeasurementLayoutDefaultsInItems(
        entry.layout.items,
        type,
        snapshot,
      );
      if (!updated.changed) {
        return entry;
      }
      changed = true;
      return {
        ...entry,
        layout: {
          ...entry.layout,
          items: updated.items,
          savedAt: Date.now(),
        },
      };
    });
  if (!changed) {
    return true;
  }
  const nextState = { ...currentState, tabs: nextTabs };
  if (!writeGeneratedTabsState(nextState)) {
    return false;
  }
  applyGeneratedTabsState(nextState);
  plagroundComposer?.handleGeneratedTabsChanged?.();
  documentEditorComposer?.handleGeneratedTabsChanged?.();
  return true;
}

function persistPlaygroundMeasurementDefaultsFromDom(
  type,
  sourceOverride = null,
) {
  if (!isMeasurementComponentType(type)) {
    return false;
  }
  const source =
    sourceOverride instanceof HTMLElement
      ? sourceOverride
      : findPlaygroundComponentPrototypeSource(type);
  if (!(source instanceof HTMLElement)) {
    return false;
  }
  const snapshot = captureMeasurementLayoutSnapshot(
    source,
    editableMeasurementPartSpecsForType(type),
    { includeGroup: false, captureAll: true },
  );
  if (!snapshot) {
    return false;
  }
  const payload = readPlaygroundComponentDefaultsPayload();
  payload[type] = snapshot;
  payload.__componentGeometryDefaults = {
    ...componentGeometryDefaults(payload),
    [type]: {
      width: Math.round(source.offsetWidth),
      height: Math.round(source.offsetHeight),
    },
  };
  const saved = writePlaygroundComponentDefaultsPayload(payload);
  if (saved) {
    playgroundComponentDefaultsCache = payload;
  }
  return (
    saved && syncGeneratedMeasurementLayoutsFromComponentDefaults(type, snapshot)
  );
}

function persistVisiblePlaygroundComponentDefaultsFromDom() {
  if (!(playgroundCanvas instanceof HTMLElement)) {
    return false;
  }
  let savedAny = false;
  const cnotSource = findPlaygroundCnotPrototypeSource();
  const cnotEdited =
    cnotSource instanceof HTMLElement &&
    (cnotSource.dataset.layoutManual === "true" ||
      Boolean(cnotSource.querySelector('[data-layout-manual="true"]')));
  if (cnotEdited) {
    const cnotSaved = persistPlaygroundCnotDefaultsFromDom(cnotSource);
    savedAny = cnotSaved || savedAny;
  }
  ["single-measurement", "double-measurement"].forEach((type) => {
    const source = findPlaygroundComponentPrototypeSource(type);
    const sourceEdited =
      source instanceof HTMLElement &&
      (source.dataset.layoutManual === "true" ||
        Boolean(source.querySelector('[data-layout-manual="true"]')));
    if (!sourceEdited) {
      return;
    }
    prepareGeneratedMeasurementParts(source);
    const measurementSaved = persistPlaygroundMeasurementDefaultsFromDom(
      type,
      source,
    );
    savedAny = measurementSaved || savedAny;
  });
  return savedAny;
}

function persistGeneratedComponentDefaultsFromElement(item) {
  if (!isGeneratedLayoutItem(item)) {
    return false;
  }
  const type = item.dataset.component || "qubit";
  if (isMeasurementComponentType(type)) {
    prepareGeneratedMeasurementParts(item);
    return persistPlaygroundMeasurementDefaultsFromDom(type, item);
  }
  if (type === "cnot-gate") {
    return persistPlaygroundCnotDefaultsFromDom(item);
  }
  if (
    type === PLAYGROUND_SAVED_GROUP_COMPONENT_TYPE &&
    isSeparatedPairMeasurementGroupElement(item)
  ) {
    return persistSavedGroupComponentDefinitionFromElement(item);
  }

  const geometryExtras = {};
  if (type === "single-gate") {
    const runtime = initializeGeneratedSingleGateItem(item, {
      singleGateTick: generatedSingleGateRuntimes.get(item)?.activeTick,
    });
    const singleGateTick = runtime?.dial?.getTick?.() ?? runtime?.activeTick;
    if (Number.isFinite(singleGateTick)) {
      geometryExtras.singleGateTick = normalizeTickIndex(singleGateTick);
    }
  }
  return persistPlaygroundComponentGeometryDefaultsFromElement(
    type,
    item,
    geometryExtras,
  );
}

function normalizeCnotGateElement(root) {
  if (!(root instanceof HTMLElement)) {
    return root;
  }

  root.classList.add("cnot-gate");

  const resolveBody = () =>
    root.querySelector(".cnot-body, [data-part='body']");
  const resolveFunnels = () =>
    root.querySelectorAll(".cnot-input-funnel");
  const resolvePortholes = () =>
    root.querySelectorAll(".cnot-porthole");
  const resolveFlanges = () =>
    root.querySelectorAll(".cnot-output-flange");

  const needsRebuild =
    !resolveBody() ||
    resolveFunnels().length < 2 ||
    resolvePortholes().length < 2 ||
    resolveFlanges().length < 2;
  if (needsRebuild) {
    const fresh = createCnotGateElement();
    if (fresh instanceof HTMLElement) {
      root.replaceChildren(...Array.from(fresh.childNodes));
    }
  }

  const body = root.querySelector(".cnot-body, [data-part='body']");
  if (body instanceof HTMLElement) {
    body.classList.add("cnot-body");
    body.dataset.part = "body";
  }

  const funnels = Array.from(
    root.querySelectorAll(".cnot-input-funnel"),
  ).slice(0, 2);
  funnels.forEach((funnel, index) => {
    if (!(funnel instanceof HTMLElement)) {
      return;
    }
    funnel.classList.add("cnot-input-funnel");
    funnel.dataset.part = index === 0 ? "funnel-top" : "funnel-bottom";
    funnel.classList.toggle("cnot-input-funnel-top", index === 0);
    funnel.classList.toggle("cnot-input-funnel-bottom", index === 1);
  });

  const portholes = Array.from(
    root.querySelectorAll(".cnot-porthole"),
  ).slice(0, 2);
  portholes.forEach((porthole, index) => {
    if (!(porthole instanceof HTMLElement)) {
      return;
    }
    porthole.classList.add("cnot-porthole");
    porthole.dataset.part = index === 0 ? "window-top" : "window-bottom";
    porthole.classList.toggle("cnot-porthole-top", index === 0);
    porthole.classList.toggle("cnot-porthole-bottom", index === 1);
  });

  const flanges = Array.from(
    root.querySelectorAll(".cnot-output-flange"),
  ).slice(0, 2);
  flanges.forEach((flange, index) => {
    if (!(flange instanceof HTMLElement)) {
      return;
    }
    flange.classList.add("cnot-output-flange");
    flange.classList.toggle("cnot-output-flange-top", index === 0);
    flange.classList.toggle("cnot-output-flange-bottom", index === 1);
    let spring = flange.querySelector(".cnot-spring");
    if (!(spring instanceof HTMLElement)) {
      spring = document.createElement("div");
      flange.appendChild(spring);
    }
    spring.classList.add("cnot-spring");
    spring.classList.toggle("cnot-spring-top", index === 0);
    spring.classList.toggle("cnot-spring-bottom", index === 1);
  });

  normalizeCnotBodyFill(root);
  return root;
}

function isCnotGateRoot(element) {
  return element instanceof HTMLElement && element.classList.contains("cnot-gate");
}

function parsePixelValue(value) {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function captureCnotGeometryBaseline(root) {
  if (!isCnotGateRoot(root)) {
    return null;
  }
  const rootRect = root.getBoundingClientRect();
  if (!rootRect.width || !rootRect.height) {
    return null;
  }

  const trackedSelectors = [
    ".cnot-body",
    ".cnot-input-funnel-top",
    ".cnot-input-funnel-bottom",
    ".cnot-porthole",
    ".cnot-porthole-top",
    ".cnot-porthole-bottom",
    ".cnot-output-flange-top",
    ".cnot-output-flange-bottom",
    ".cnot-spring-top",
    ".cnot-spring-bottom",
  ];
  const trackedProperties = [
    "left",
    "right",
    "top",
    "bottom",
    "width",
    "height",
  ];
  const entries = [];
  const seenElements = new Set();

  trackedSelectors.forEach((selector) => {
    root.querySelectorAll(selector).forEach((element) => {
      if (!(element instanceof HTMLElement)) {
        return;
      }
      if (seenElements.has(element)) {
        return;
      }
      seenElements.add(element);
      const computed = window.getComputedStyle(element);
      const rect = element.getBoundingClientRect();
      const snapshot = {};
      trackedProperties.forEach((property) => {
        const value = parsePixelValue(computed[property]);
        if (value !== null) {
          snapshot[property] = value;
        }
      });
      snapshot.__rectWidth = rect.width;
      snapshot.__rectHeight = rect.height;
      entries.push({ element, snapshot });
    });
  });

  return {
    width: rootRect.width,
    height: rootRect.height,
    entries,
  };
}

function applyCnotGeometryScale(root, baseline, nextWidth, nextHeight) {
  if (!isCnotGateRoot(root) || !baseline) {
    return;
  }
  if (
    !Number.isFinite(nextWidth) ||
    !Number.isFinite(nextHeight) ||
    nextWidth <= 0 ||
    nextHeight <= 0
  ) {
    return;
  }
  const sx = nextWidth / baseline.width;
  const sy = nextHeight / baseline.height;
  if (!Number.isFinite(sx) || !Number.isFinite(sy)) {
    return;
  }

  baseline.entries.forEach(({ element, snapshot }) => {
    if (!(element instanceof HTMLElement)) {
      return;
    }
    if (element.classList.contains("cnot-body") && !isCnotBodyManuallySized(element)) {
      return;
    }
    const hasHorizontalAnchors =
      Number.isFinite(snapshot.left) && Number.isFinite(snapshot.right);
    const hasVerticalAnchors =
      Number.isFinite(snapshot.top) && Number.isFinite(snapshot.bottom);
    const isPorthole = element.classList.contains("cnot-porthole");
    if (Number.isFinite(snapshot.left)) {
      element.style.left = `${Number.parseFloat((snapshot.left * sx).toFixed(2))}px`;
    }
    if (Number.isFinite(snapshot.right)) {
      element.style.right = `${Number.parseFloat((snapshot.right * sx).toFixed(2))}px`;
    }
    if (Number.isFinite(snapshot.top)) {
      element.style.top = `${Number.parseFloat((snapshot.top * sy).toFixed(2))}px`;
    }
    if (Number.isFinite(snapshot.bottom)) {
      element.style.bottom = `${Number.parseFloat((snapshot.bottom * sy).toFixed(2))}px`;
    }
    const baselineWidth = Number.isFinite(snapshot.width)
      ? snapshot.width
      : snapshot.__rectWidth;
    const baselineHeight = Number.isFinite(snapshot.height)
      ? snapshot.height
      : snapshot.__rectHeight;
    if (Number.isFinite(baselineWidth) && !hasHorizontalAnchors) {
      element.style.width = `${Number.parseFloat((baselineWidth * sx).toFixed(2))}px`;
    }
    if (Number.isFinite(baselineHeight) && !hasVerticalAnchors) {
      element.style.height = `${Number.parseFloat((baselineHeight * sy).toFixed(2))}px`;
    }
    if (isPorthole) {
      element.style.transform = "translate(-50%, -50%)";
    }
  });

  if (root.dataset.component === "cnot-gate") {
    const parts = resolveCnotPartElements(root);
    const rootRect = root.getBoundingClientRect();
    if (rootRect.width > 0) {
      const trackedRects = [
        parts.funnelTop,
        parts.funnelBottom,
        parts.body,
        parts.flangeTop,
        parts.flangeBottom,
      ]
        .filter((element) => element instanceof HTMLElement)
        .map((element) => element.getBoundingClientRect());
      if (trackedRects.length > 0) {
        const minX = Math.min(
          ...trackedRects.map((rect) => rect.left - rootRect.left),
        );
        const maxX = Math.max(
          ...trackedRects.map((rect) => rect.right - rootRect.left),
        );
        const desiredCenterX = rootRect.width / 2;
        const currentCenterX = (minX + maxX) / 2;
        const dx = desiredCenterX - currentCenterX;
        if (Math.abs(dx) > 0.25) {
          if (parts.body instanceof HTMLElement) {
            const bodyComputed = window.getComputedStyle(parts.body);
            const bodyLeft = parsePixelValue(bodyComputed.left);
            const bodyRight = parsePixelValue(bodyComputed.right);
            if (Number.isFinite(bodyLeft)) {
              parts.body.style.left = `${Number.parseFloat((bodyLeft + dx).toFixed(2))}px`;
            }
            if (parts.body.style.right && Number.isFinite(bodyRight)) {
              parts.body.style.right = `${Number.parseFloat((bodyRight - dx).toFixed(2))}px`;
            }
          }
          [parts.funnelTop, parts.funnelBottom].forEach((funnel) => {
            if (!(funnel instanceof HTMLElement)) {
              return;
            }
            const funnelLeft = parsePixelValue(
              window.getComputedStyle(funnel).left,
            );
            if (Number.isFinite(funnelLeft)) {
              funnel.style.left = `${Number.parseFloat((funnelLeft + dx).toFixed(2))}px`;
            }
          });
        }
      }
    }
  }
  normalizeCnotBodyFill(root);
}

function isCnotBodyManuallySized(body) {
  return (
    body instanceof HTMLElement &&
    (body.dataset.layoutManual === "true" ||
      Boolean(body.style.width || body.style.height))
  );
}

function cnotBodySnapshotHasExplicitGeometry(state) {
  if (!state || typeof state !== "object") {
    return false;
  }
  const inlineStyle =
    state.inlineStyle && typeof state.inlineStyle === "object"
      ? state.inlineStyle
      : {};
  return Boolean(
    state.width ||
    state.height ||
    inlineStyle.width ||
    inlineStyle.height ||
    Math.abs(parseLayoutNumeric(state.tx, 0)) > 0.01 ||
    Math.abs(parseLayoutNumeric(state.ty, 0)) > 0.01,
  );
}

function resetCnotBodyFillGeometry(body) {
  if (!(body instanceof HTMLElement)) {
    return;
  }
  body.style.width = "";
  body.style.height = "";
  body.style.left = "42px";
  body.style.right = "22px";
  body.style.top = "0px";
  body.style.bottom = "0px";
}

function makeCnotBodyExplicitlySized(body) {
  if (!(body instanceof HTMLElement)) {
    return;
  }
  const root = body.closest(".cnot-gate");
  if (!(root instanceof HTMLElement)) {
    return;
  }
  const rootRect = root.getBoundingClientRect();
  const bodyRect = body.getBoundingClientRect();
  if (
    !rootRect.width ||
    !rootRect.height ||
    !bodyRect.width ||
    !bodyRect.height
  ) {
    return;
  }
  const computed = window.getComputedStyle(body);
  const computedLeft = parsePixelValue(computed.left);
  const computedTop = parsePixelValue(computed.top);
  const left = Number.isFinite(computedLeft)
    ? computedLeft
    : bodyRect.left - rootRect.left;
  const top = Number.isFinite(computedTop)
    ? computedTop
    : bodyRect.top - rootRect.top;
  body.style.left = `${Number.parseFloat(left.toFixed(2))}px`;
  body.style.top = `${Number.parseFloat(top.toFixed(2))}px`;
  body.style.width = `${Number.parseFloat(bodyRect.width.toFixed(2))}px`;
  body.style.height = `${Number.parseFloat(bodyRect.height.toFixed(2))}px`;
  body.style.right = "";
  body.style.bottom = "";
}

function normalizeCnotBodyFill(root) {
  if (!isCnotGateRoot(root)) {
    return;
  }
  const body = resolveCnotPartElements(root).body;
  if (!(body instanceof HTMLElement)) {
    return;
  }
  if (isCnotBodyManuallySized(body)) {
    return;
  }
  resetCnotBodyFillGeometry(body);
}

function clonePlaygroundSourceElement(element) {
  if (!(element instanceof Element)) {
    return null;
  }
  const cloned = element.cloneNode(true);
  if (!(cloned instanceof HTMLElement)) {
    return null;
  }
  return cloned;
}

function sanitizePlaygroundComponentNode(root, options = {}) {
  if (!(root instanceof HTMLElement)) {
    return root;
  }
  const preserveInlineStyles = options.preserveInlineStyles === true;
  const stateClasses = [
    "dragging",
    "migrating",
    "melting",
    "gate-busy",
    "platform-extended",
    "extended",
    "active",
    "collapse-animating",
    "measurement-pellet",
    "qubit-selected",
    "generated-transit-active",
  ];
  const all = [root, ...root.querySelectorAll("*")];
  all.forEach((node) => {
    if (!(node instanceof HTMLElement)) {
      return;
    }
    if (!preserveInlineStyles) {
      node.removeAttribute("style");
    }
    stateClasses.forEach((className) => node.classList.remove(className));
    Object.keys(node.dataset)
      .filter((key) => key.startsWith("layout"))
      .forEach((key) => {
        delete node.dataset[key];
      });
  });

  root.querySelectorAll(".tube-liquid").forEach((liquid) => {
    if (liquid instanceof HTMLElement) {
      liquid.style.height = "0%";
    }
  });
  root.querySelectorAll(".tube-count").forEach((count) => {
    count.textContent = "0";
  });
  root.querySelectorAll(".measurement-count").forEach((count) => {
    if (count instanceof HTMLSelectElement) {
      count.value = "1";
    }
  });

  return root;
}

function createPlaygroundFallback(label) {
  const box = document.createElement("div");
  box.className = "playground-fallback";
  box.textContent = `${label} unavailable`;
  return box;
}

const TEXT_BOX_BUTTON_ACTIONS = [
  { action: "back", label: "Back" },
  { action: "next", label: "Next" },
  { action: "show", label: "Show me" },
  { action: "done", label: "Done" },
];
const TEXT_BOX_BUTTON_ACTION_SET = new Set(
  TEXT_BOX_BUTTON_ACTIONS.map((spec) => spec.action),
);
const LEGACY_TEXT_BOX_BUTTON_MODES = new Set([
  "none",
  "next",
  "done",
  "next-done",
]);

function normalizeTextBoxButtonMode(value) {
  const mode = String(value || "").toLowerCase();
  if (mode === "ok") {
    return "done";
  }
  return LEGACY_TEXT_BOX_BUTTON_MODES.has(mode) ? mode : "none";
}

function textBoxButtonsFromLegacyMode(mode) {
  const normalizedMode = normalizeTextBoxButtonMode(mode);
  if (normalizedMode === "next") {
    return ["next"];
  }
  if (normalizedMode === "done") {
    return ["done"];
  }
  if (normalizedMode === "next-done") {
    return ["next", "done"];
  }
  return [];
}

function legacyTextBoxModeFromButtons(buttons) {
  const normalizedButtons = normalizeTextBoxButtons(buttons);
  const key = normalizedButtons.join(",");
  if (!key) {
    return "none";
  }
  if (key === "next") {
    return "next";
  }
  if (key === "done") {
    return "done";
  }
  if (key === "next,done") {
    return "next-done";
  }
  return "custom";
}

function normalizeTextBoxButtons(value, fallbackMode = "none") {
  let rawButtons = [];
  if (Array.isArray(value)) {
    rawButtons = value;
  } else if (typeof value === "string" && value.trim()) {
    const trimmed = value.trim();
    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) {
        rawButtons = parsed;
      }
    } catch (_error) {
      rawButtons = trimmed.includes(",")
        ? trimmed.split(",")
        : textBoxButtonsFromLegacyMode(trimmed);
    }
    if (rawButtons.length === 0 && TEXT_BOX_BUTTON_ACTION_SET.has(trimmed)) {
      rawButtons = [trimmed];
    }
  }
  if (rawButtons.length === 0 && fallbackMode) {
    rawButtons = textBoxButtonsFromLegacyMode(fallbackMode);
  }
  const selected = new Set();
  rawButtons.forEach((button) => {
    const action = String(button || "").trim().toLowerCase();
    if (TEXT_BOX_BUTTON_ACTION_SET.has(action)) {
      selected.add(action);
    }
  });
  return TEXT_BOX_BUTTON_ACTIONS.map((spec) => spec.action).filter((action) =>
    selected.has(action),
  );
}

function textBoxButtonSpecs(buttonsOrMode) {
  const buttons = normalizeTextBoxButtons(buttonsOrMode, buttonsOrMode);
  return TEXT_BOX_BUTTON_ACTIONS.filter((spec) => buttons.includes(spec.action));
}

function ensureTextBoxActions(root) {
  let actions = root.querySelector('[data-role="text-box-actions"]');
  if (!(actions instanceof HTMLElement)) {
    actions = document.createElement("div");
    actions.className = "text-box-actions";
    actions.dataset.role = "text-box-actions";
    const oldAction = root.querySelector('[data-role="text-box-action"]');
    if (oldAction instanceof HTMLElement) {
      oldAction.replaceWith(actions);
    } else {
      root.appendChild(actions);
    }
  }
  return actions;
}

function handleTextBoxActionClick(event) {
  event.preventDefault();
  event.stopPropagation();
  const button = event.currentTarget;
  if (!(button instanceof HTMLButtonElement)) {
    return;
  }
  const canvas = button.closest(".generated-layout-canvas");
  if (canvas instanceof HTMLElement) {
    if (
      canvas.dataset.docRuntimeCanvas === "true" ||
      canvas.dataset.docEditorCanvas === "true"
    ) {
      handleDocumentTextBoxAction(canvas, button.dataset.textBoxAction || "");
      return;
    }
    handleGeneratedTextBoxAction(canvas, button.dataset.textBoxAction || "");
  }
}

function syncTextBoxButtonControls(root, buttons) {
  if (!(root instanceof HTMLElement)) {
    return;
  }
  const selected = new Set(normalizeTextBoxButtons(buttons));
  root
    .querySelectorAll('[data-role="text-box-button-toggle"]')
    .forEach((input) => {
      if (input instanceof HTMLInputElement) {
        input.checked = selected.has(input.value);
      }
    });
  const select = root.querySelector('[data-role="text-box-button-mode"]');
  if (select instanceof HTMLSelectElement) {
    select.value = legacyTextBoxModeFromButtons(buttons);
  }
}

function selectedTextBoxButtonsFromControls(root, source = null) {
  if (!(root instanceof HTMLElement)) {
    return [];
  }
  const select = root.querySelector('[data-role="text-box-button-mode"]');
  if (
    source instanceof HTMLSelectElement &&
    source.dataset.role === "text-box-button-mode"
  ) {
    return textBoxButtonsFromLegacyMode(source.value);
  }
  const allToggles = Array.from(
    root.querySelectorAll('[data-role="text-box-button-toggle"]'),
  ).filter((input) => input instanceof HTMLInputElement);
  if (allToggles.length > 0) {
    return normalizeTextBoxButtons(
      allToggles
        .filter((input) => input.checked)
        .map((input) => input.value),
    );
  }
  if (select instanceof HTMLSelectElement) {
    return textBoxButtonsFromLegacyMode(select.value);
  }
  return [];
}

function applyTextBoxButtons(root, buttons) {
  if (!(root instanceof HTMLElement)) {
    return;
  }
  const normalizedButtons = normalizeTextBoxButtons(buttons);
  root.dataset.textBoxButtons = normalizedButtons.join(",");
  root.dataset.textBoxButton = legacyTextBoxModeFromButtons(normalizedButtons);
  syncTextBoxButtonControls(root, normalizedButtons);
  const actions = ensureTextBoxActions(root);
  const specs = textBoxButtonSpecs(normalizedButtons);
  actions.hidden = specs.length === 0;
  actions.replaceChildren(
    ...specs.map((spec) => {
      const button = document.createElement("button");
      button.className = "text-box-action";
      button.dataset.role = "text-box-action";
      button.dataset.textBoxAction = spec.action;
      button.type = "button";
      button.textContent = spec.label;
      button.addEventListener("click", handleTextBoxActionClick);
      stopTextBoxControlPropagation(button);
      return button;
    }),
  );
}

function applyTextBoxButtonMode(root, mode) {
  applyTextBoxButtons(root, textBoxButtonsFromLegacyMode(mode));
}

function textBoxRootForItem(item) {
  if (!(item instanceof HTMLElement)) {
    return null;
  }
  if (item.classList.contains("playground-text-box")) {
    return item;
  }
  const root = item.querySelector(".playground-text-box");
  return root instanceof HTMLElement ? root : null;
}

function textBoxPlainTextFromBody(body) {
  if (!(body instanceof HTMLElement)) {
    return "";
  }
  const renderedText =
    typeof body.innerText === "string" ? body.innerText : body.textContent || "";
  return renderedText.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
}

function captureTextBoxSnapshot(item) {
  const root = textBoxRootForItem(item);
  if (!root) {
    return null;
  }
  const body = root.querySelector('[data-role="text-box-body"]');
  const buttons = normalizeTextBoxButtons(
    root.dataset.textBoxButtons,
    root.dataset.textBoxButton,
  );
  return {
    text: textBoxPlainTextFromBody(body),
    buttons,
    buttonMode: legacyTextBoxModeFromButtons(buttons),
  };
}

function applyTextBoxSnapshotToElement(item, geometry = {}) {
  const root = textBoxRootForItem(item);
  if (!root) {
    return;
  }
  const body = root.querySelector('[data-role="text-box-body"]');
  if (body instanceof HTMLElement && typeof geometry?.text === "string") {
    body.textContent = geometry.text;
  }
  applyTextBoxButtons(root, geometry?.buttons || geometry?.buttonMode);
}

function setTextBoxBodyEditable(item, editable) {
  const root = textBoxRootForItem(item);
  const body = root?.querySelector?.('[data-role="text-box-body"]');
  if (!(body instanceof HTMLElement)) {
    return;
  }
  body.contentEditable = editable ? "true" : "false";
  body.spellcheck = Boolean(editable);
  body.setAttribute("aria-readonly", editable ? "false" : "true");
}

function syncGeneratedTextBoxEditability(item) {
  if (!(item instanceof HTMLElement) || item.dataset.component !== "text-box") {
    return;
  }
  const canvas = generatedCanvasForItem(item);
  const editable =
    isDocumentEditorCanvas(canvas) ||
    (layoutEditorState.enabled && !isDocumentRuntimeCanvas(canvas));
  setTextBoxBodyEditable(item, editable);
}

function markTextBoxEdited(root) {
  if (!(root instanceof HTMLElement)) {
    return;
  }
  const canvas = root.closest(".generated-layout-canvas");
  if (isDocumentEditorCanvas(canvas)) {
    markDocumentEditorCanvasEdited(canvas);
    saveCurrentDocumentEditorScene();
    updateDocEditorButtons();
  }
}

function stopTextBoxControlPropagation(element) {
  ["mousedown", "touchstart", "click"].forEach((eventName) => {
    element.addEventListener(eventName, (event) => {
      event.stopPropagation();
    });
  });
}

function createTextBoxElement(geometry = {}) {
  const root = document.createElement("div");
  root.className = "playground-text-box";

  const controls = document.createElement("div");
  controls.className = "text-box-editor-controls";
  controls.dataset.role = "text-box-controls";

  const controlsLabel = document.createElement("span");
  controlsLabel.className = "text-box-editor-controls-label";
  controlsLabel.textContent = "Buttons";
  controls.appendChild(controlsLabel);

  TEXT_BOX_BUTTON_ACTIONS.forEach((spec) => {
    const label = document.createElement("label");
    label.className = "text-box-button-toggle";
    const input = document.createElement("input");
    input.type = "checkbox";
    input.value = spec.action;
    input.dataset.role = "text-box-button-toggle";
    label.append(input, document.createTextNode(spec.label));
    controls.appendChild(label);
  });
  const legacySelect = document.createElement("select");
  legacySelect.dataset.role = "text-box-button-mode";
  legacySelect.hidden = true;
  [
    ["none", "No button"],
    ["next", "Next"],
    ["done", "Done"],
    ["next-done", "Next and Done"],
    ["custom", "Custom"],
  ].forEach(([value, text]) => {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = text;
    legacySelect.appendChild(option);
  });
  controls.appendChild(legacySelect);

  const body = document.createElement("div");
  body.className = "text-box-body";
  body.dataset.role = "text-box-body";
  body.contentEditable = "true";
  body.spellcheck = true;
  body.textContent =
    typeof geometry?.text === "string" ? geometry.text : "Text";

  const actions = document.createElement("div");
  actions.className = "text-box-actions";
  actions.dataset.role = "text-box-actions";

  controls.addEventListener("change", (event) => {
    applyTextBoxButtons(
      root,
      selectedTextBoxButtonsFromControls(root, event.target),
    );
    markTextBoxEdited(root);
  });
  body.addEventListener("input", () => markTextBoxEdited(root));
  [controls, actions].forEach(stopTextBoxControlPropagation);

  root.append(controls, body, actions);
  applyTextBoxButtons(root, geometry?.buttons || geometry?.buttonMode);
  return root;
}

function generatedTextBoxItems(canvas) {
  if (!isGeneratedLayoutCanvas(canvas)) {
    return [];
  }
  return Array.from(
    canvas.querySelectorAll(':scope > .playground-node[data-component="text-box"]'),
  ).filter((item) => item instanceof HTMLElement);
}

function registerGeneratedTextBoxActions(item) {
  if (!(item instanceof HTMLElement)) {
    return;
  }
  item
    .querySelectorAll('[data-role="text-box-action"]')
    .forEach((button) => {
      if (
        button instanceof HTMLButtonElement &&
        button.dataset.generatedTextBoxActionRegistered !== "true"
      ) {
        button.dataset.generatedTextBoxActionRegistered = "true";
        button.addEventListener("click", handleTextBoxActionClick);
        stopTextBoxControlPropagation(button);
      }
    });
}

function setGeneratedTextBoxSequenceIndex(canvas, index) {
  const items = generatedTextBoxItems(canvas);
  if (items.length === 0) {
    return;
  }
  const clampedIndex = clamp(Math.round(Number(index) || 0), 0, items.length - 1);
  canvas.dataset.textBoxSequenceIndex = `${clampedIndex}`;
  canvas.dataset.textBoxSequenceClosed = "false";
  items.forEach((item, itemIndex) => {
    item.hidden = itemIndex !== clampedIndex;
  });
}

function closeGeneratedTextBoxSequence(canvas) {
  const items = generatedTextBoxItems(canvas);
  if (items.length === 0) {
    return;
  }
  canvas.dataset.textBoxSequenceClosed = "true";
  items.forEach((item) => {
    item.hidden = true;
  });
}

function syncGeneratedTextBoxSequence(canvas, options = {}) {
  if (!isGeneratedLayoutCanvas(canvas)) {
    return;
  }
  const items = generatedTextBoxItems(canvas);
  items.forEach((item) => {
    registerGeneratedTextBoxActions(item);
    syncGeneratedTextBoxEditability(item);
  });
  if (items.length === 0) {
    delete canvas.dataset.textBoxSequenceIndex;
    delete canvas.dataset.textBoxSequenceClosed;
    return;
  }
  if (layoutEditorState.enabled) {
    items.forEach((item) => {
      item.hidden = false;
    });
    return;
  }
  if (options.reset || !canvas.dataset.textBoxSequenceIndex) {
    canvas.dataset.textBoxSequenceIndex = "0";
    canvas.dataset.textBoxSequenceClosed = "false";
  }
  if (canvas.dataset.textBoxSequenceClosed === "true") {
    closeGeneratedTextBoxSequence(canvas);
    return;
  }
  setGeneratedTextBoxSequenceIndex(
    canvas,
    Number.parseInt(canvas.dataset.textBoxSequenceIndex || "0", 10),
  );
}

function handleGeneratedTextBoxAction(canvas, action) {
  if (!isGeneratedLayoutCanvas(canvas) || layoutEditorState.enabled) {
    return;
  }
  const items = generatedTextBoxItems(canvas);
  if (items.length === 0) {
    return;
  }
  const currentIndex = clamp(
    Number.parseInt(canvas.dataset.textBoxSequenceIndex || "0", 10) || 0,
    0,
    items.length - 1,
  );
  if (action === "done") {
    closeGeneratedTextBoxSequence(canvas);
    return;
  }
  if (action === "next") {
    if (currentIndex < items.length - 1) {
      setGeneratedTextBoxSequenceIndex(canvas, currentIndex + 1);
    } else {
      closeGeneratedTextBoxSequence(canvas);
    }
  }
}

function isMeasurementPieceComponentType(type) {
  return (
    type === "measurement-capacity" ||
    type === "single-tube-array" ||
    type === "double-tube-array" ||
    type === "triple-tube-array" ||
    type === "quadruple-tube-array" ||
    type === "single-magnifier" ||
    type === "double-magnifier" ||
    type === "measurement-count-menu"
  );
}

function measurementPieceRoleForType(type) {
  return (
    {
      "measurement-capacity": "capacity",
      "single-tube-array": "single-tubes",
      "double-tube-array": "double-tubes",
      "triple-tube-array": "triple-tubes",
      "quadruple-tube-array": "quadruple-tubes",
      "single-magnifier": "single-magnifier",
      "double-magnifier": "double-magnifier",
      "measurement-count-menu": "iteration-count",
    }[type] || ""
  );
}

function clonePairMeasurementPart(selector) {
  const host = document.createElement("section");
  mountPairMeasurementTool(host);
  const part = host.querySelector(selector);
  return part instanceof HTMLElement ? part.cloneNode(true) : null;
}

function createMeasurementDot(color) {
  const dot = document.createElement("span");
  dot.className = `measurement-dot measurement-dot-${color}`;
  return dot;
}

function createRegisterMeasurementTubeColumn(key) {
  const column = document.createElement("div");
  column.className = "pair-tube-column register-tube-column";
  column.dataset.key = key;

  const label = document.createElement("div");
  label.className = "pair-tube-label register-tube-label";
  key.split("").forEach((digit) => {
    label.appendChild(createMeasurementDot(digit === "r" ? "red" : "blue"));
  });

  const count = document.createElement("div");
  count.className = "tube-count";
  count.dataset.role = `pair-count-${key}`;
  count.textContent = "0";

  const tube = document.createElement("div");
  tube.className = "tube pair-tube register-tube";
  tube.dataset.role = `pair-tube-${key}`;

  const liquid = document.createElement("div");
  const allBlue = /^b+$/.test(key);
  const allRed = /^r+$/.test(key);
  liquid.className = [
    "tube-liquid",
    allBlue
      ? "tube-liquid-blue"
      : allRed
        ? "tube-liquid-red"
        : "pair-liquid-br",
  ].join(" ");
  liquid.dataset.role = `pair-liquid-${key}`;
  tube.appendChild(liquid);

  column.append(label, count, tube);
  return column;
}

function createRegisterMeasurementTubeRack(numQubits) {
  const safeNumQubits = Math.max(2, Math.min(4, Number(numQubits) || 2));
  const rack = document.createElement("div");
  rack.className = [
    "pair-tube-rack",
    "register-tube-rack",
    `register-tube-rack-${safeNumQubits}`,
  ].join(" ");
  rack.dataset.registerQubits = `${safeNumQubits}`;
  registerMeasurementOutcomeKeys(safeNumQubits).forEach((key) => {
    rack.appendChild(createRegisterMeasurementTubeColumn(key));
  });
  return rack;
}

function createMeasurementPieceNode(type, geometry = {}) {
  const wrapper = document.createElement("div");
  wrapper.className = `measurement-piece measurement-piece-${type}`;
  wrapper.dataset.measurementRole = measurementPieceRoleForType(type);

  let node = null;
  if (type === "measurement-capacity") {
    node = clonePairMeasurementPart('[data-role="pair-capacity"]');
    if (node instanceof HTMLElement) {
      node.textContent = "The testtubes can each hold 5 qubit pairs.";
    }
  } else if (type === "single-tube-array") {
    node = clonePlaygroundSourceElement(
      cloneSingleQubitBlueprint('[data-role="tube-rack"]'),
    );
  } else if (type === "double-tube-array") {
    node = clonePairMeasurementPart(".pair-tube-rack");
  } else if (type === "triple-tube-array") {
    node = createRegisterMeasurementTubeRack(3);
  } else if (type === "quadruple-tube-array") {
    node = createRegisterMeasurementTubeRack(4);
  } else if (type === "single-magnifier") {
    node = clonePlaygroundSourceElement(
      cloneSingleQubitBlueprint('[data-role="measurement-tool"]'),
    );
  } else if (type === "double-magnifier") {
    node = clonePairMeasurementPart('[data-role="pair-lens"]');
  } else if (type === "measurement-count-menu") {
    node = clonePlaygroundSourceElement(
      cloneSingleQubitBlueprint('[data-role="measurement-count"]'),
    );
  }

  if (!(node instanceof HTMLElement)) {
    wrapper.appendChild(
      createPlaygroundFallback(PLAYGROUND_COMPONENT_LIBRARY[type]?.label || type),
    );
    return wrapper;
  }
  wrapper.appendChild(node);
  return wrapper;
}

function createMailboxElement() {
  const node = document.createElement("section");
  node.className = "qubit-mailbox";
  node.setAttribute("aria-label", "Qubit mailbox");
  node.innerHTML = [
    '<div class="mailbox-input-funnel" data-role="mailbox-input-funnel" aria-hidden="true"></div>',
    '<div class="mailbox-shell" aria-hidden="true"></div>',
    '<div class="mailbox-window" data-role="mailbox-window"></div>',
    '<div class="mailbox-status" data-role="mailbox-status" aria-live="polite"></div>',
    '<a class="mailbox-email-link" data-role="mailbox-email-link" href="#" hidden>Open email</a>',
  ].join("");
  node.addEventListener("click", (event) => {
    event.stopPropagation();
  });
  return node;
}

function applyMailboxSnapshotToElement(item, snapshot = {}) {
  void item;
  void snapshot;
}

function captureMailboxSnapshot(item) {
  void item;
  return null;
}

let mailboxSendDialog = null;
let activeMailboxSendContext = null;
let mailboxRoomState = {
  joined: false,
  roomId: "",
  participantId: "",
  participantJoinIndex: 0,
  displayName: "",
  participants: [],
  events: [],
  measurements: [],
  resetId: "",
  reviewCounts: {},
  reviewRuns: 0,
  replaying: false,
  replayActionIndex: -1,
  entanglementThreeBackendStatus: "",
  entanglementThreeJoinStarted: false,
  pollTimer: null,
};
let mailboxRoomBootCleanupPromise = Promise.resolve();
const mailboxRoomSeenSharedMeasurementControlIds = new Set();
const mailboxRoomSeenSharedMeasurementCompletionIds = new Set();
const mailboxRoomCompletedMeasurementControlIds = new Set();
const mailboxRoomAppliedMeasurementVersions = new Map();
const mailboxRoomSendingQubits = new WeakSet();
const mailboxRoomSendingKeys = new Set();
const mailboxRoomReceivingEventIds = new Set();
const mailboxRoomReceivedEventItems = new Map();
let entanglementThreeSessionChannel = null;
let entanglementThreeClientSessionPromise = null;
let entanglementThreeSessionStorageWasRead = false;
const entanglementThreeWindowId = `ent3-window-${Date.now().toString(36)}-${Math.random()
  .toString(36)
  .slice(2, 10)}`;

function mailboxMessageBodyWithLinkPlaceholder(message) {
  const trimmed = String(message || "").trim() || MAILBOX_DEFAULT_MESSAGE;
  return `${trimmed}\n\n${MAILBOX_LINK_PLACEHOLDER}`;
}

function setMailboxComponentStatus(mailboxItem, message) {
  const status = mailboxItem?.querySelector?.('[data-role="mailbox-status"]');
  if (status instanceof HTMLElement) {
    status.textContent = message || "";
  }
}

function setMailboxComponentLink(mailboxItem, link, token = "") {
  const anchor = mailboxItem?.querySelector?.('[data-role="mailbox-email-link"]');
  if (anchor instanceof HTMLAnchorElement) {
    anchor.hidden = !link;
    anchor.href = link || "#";
    anchor.title = link || token || "";
  }
}

function readMailboxRoomStorage() {
  try {
    const parsed = JSON.parse(
      window.localStorage.getItem(MAILBOX_ROOM_STORAGE_KEY) || "null",
    );
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch (_error) {
    return {};
  }
}

function writeMailboxRoomStorage(update = {}) {
  const next = {
    ...readMailboxRoomStorage(),
    ...update,
  };
  try {
    window.localStorage.setItem(MAILBOX_ROOM_STORAGE_KEY, JSON.stringify(next));
  } catch (_error) {
    // Local storage is a convenience only; the joined room still works in memory.
  }
  return next;
}

function entanglementThreeNewClientSessionId() {
  return typeof window.crypto?.randomUUID === "function"
    ? window.crypto.randomUUID()
    : `ent3-${Date.now().toString(36)}-${Math.random()
        .toString(36)
        .slice(2, 10)}`;
}

function entanglementThreeNavigationIsReload() {
  try {
    const navigation = window.performance
      ?.getEntriesByType?.("navigation")
      ?.[0];
    if (navigation?.type) {
      return navigation.type === "reload";
    }
    return window.performance?.navigation?.type === 1;
  } catch (_error) {
    return false;
  }
}

function entanglementThreeStoredClientSessionId() {
  try {
    const existing = window.sessionStorage.getItem(
      ENTANGLEMENT_THREE_SESSION_STORAGE_KEY,
    );
    // Chrome, Firefox, and Safari may copy sessionStorage when a tab is
    // duplicated or opened with an opener. Keep the id only for a true reload;
    // a newly loaded document must represent a new participant.
    if (
      existing &&
      (entanglementThreeSessionStorageWasRead ||
        entanglementThreeNavigationIsReload())
    ) {
      entanglementThreeSessionStorageWasRead = true;
      return existing;
    }
    const next = entanglementThreeNewClientSessionId();
    window.sessionStorage.setItem(ENTANGLEMENT_THREE_SESSION_STORAGE_KEY, next);
    entanglementThreeSessionStorageWasRead = true;
    return next;
  } catch (_error) {
    entanglementThreeSessionStorageWasRead = true;
    return entanglementThreeNewClientSessionId();
  }
}

function entanglementThreeSetClientSessionId(sessionId) {
  try {
    window.sessionStorage.setItem(
      ENTANGLEMENT_THREE_SESSION_STORAGE_KEY,
      sessionId,
    );
  } catch (_error) {
    // A volatile session id is still enough to keep this page load distinct.
  }
  return sessionId;
}

function entanglementThreeEnsureSessionChannel() {
  if (entanglementThreeSessionChannel || typeof BroadcastChannel !== "function") {
    return entanglementThreeSessionChannel;
  }
  entanglementThreeSessionChannel = new BroadcastChannel(
    ENTANGLEMENT_THREE_SESSION_CHANNEL,
  );
  entanglementThreeSessionChannel.addEventListener("message", (event) => {
    const data = event?.data || {};
    if (
      data.type !== "entanglement-three-session-probe" ||
      data.senderId === entanglementThreeWindowId ||
      !data.sessionId
    ) {
      return;
    }
    if (data.sessionId !== entanglementThreeStoredClientSessionId()) {
      return;
    }
    entanglementThreeSessionChannel.postMessage({
      type: "entanglement-three-session-claimed",
      sessionId: data.sessionId,
      probeId: data.probeId || "",
      senderId: entanglementThreeWindowId,
    });
  });
  return entanglementThreeSessionChannel;
}

async function entanglementThreeClientSessionIdFromChannel() {
  let sessionId = entanglementThreeStoredClientSessionId();
  const channel = entanglementThreeEnsureSessionChannel();
  if (!channel) {
    return sessionId;
  }
  const probeId = entanglementThreeNewClientSessionId();
  const sessionIsAlreadyActive = await new Promise((resolve) => {
    let settled = false;
    const timeout = window.setTimeout(() => {
      if (settled) {
        return;
      }
      settled = true;
      channel.removeEventListener("message", onMessage);
      resolve(false);
    }, 120);
    function onMessage(event) {
      const data = event?.data || {};
      if (
        data.type !== "entanglement-three-session-claimed" ||
        data.senderId === entanglementThreeWindowId ||
        data.sessionId !== sessionId ||
        data.probeId !== probeId
      ) {
        return;
      }
      if (settled) {
        return;
      }
      settled = true;
      window.clearTimeout(timeout);
      channel.removeEventListener("message", onMessage);
      resolve(true);
    }
    channel.addEventListener("message", onMessage);
    channel.postMessage({
      type: "entanglement-three-session-probe",
      sessionId,
      probeId,
      senderId: entanglementThreeWindowId,
    });
  });
  if (sessionIsAlreadyActive) {
    sessionId = entanglementThreeSetClientSessionId(
      entanglementThreeNewClientSessionId(),
    );
  }
  return sessionId;
}

function entanglementThreeTryClaimSessionLock(sessionId) {
  if (typeof navigator?.locks?.request !== "function") {
    return Promise.resolve(null);
  }
  return new Promise((resolve) => {
    let settled = false;
    navigator.locks
      .request(
        `${ENTANGLEMENT_THREE_SESSION_LOCK_PREFIX}${sessionId}`,
        { ifAvailable: true },
        (lock) => {
          settled = true;
          if (!lock) {
            resolve(false);
            return undefined;
          }
          resolve(true);
          // Keep the lock for this page's lifetime. The browser releases it
          // automatically when the document unloads.
          return new Promise(() => {});
        },
      )
      .catch(() => {
        if (!settled) {
          resolve(null);
        }
      });
  });
}

async function entanglementThreeClaimClientSessionId() {
  let sessionId = entanglementThreeStoredClientSessionId();
  for (let attempt = 0; attempt < 3; attempt += 1) {
    const claimed = await entanglementThreeTryClaimSessionLock(sessionId);
    if (claimed === true) {
      return sessionId;
    }
    if (claimed === null) {
      return entanglementThreeClientSessionIdFromChannel();
    }
    sessionId = entanglementThreeSetClientSessionId(
      entanglementThreeNewClientSessionId(),
    );
  }
  return sessionId;
}

function entanglementThreeClientSessionId() {
  if (!entanglementThreeClientSessionPromise) {
    entanglementThreeClientSessionPromise =
      entanglementThreeClaimClientSessionId();
  }
  return entanglementThreeClientSessionPromise;
}

async function mailboxRoomCleanupOwnedRoomOnBoot() {
  // Rooms are shared state. Do not delete a previously owned room just because
  // this browser tab loaded again; another participant may already be in it.
  return false;
}

function mailboxRoomStartBootCleanup() {
  mailboxRoomBootCleanupPromise = mailboxRoomCleanupOwnedRoomOnBoot().catch(
    () => false,
  );
  return mailboxRoomBootCleanupPromise;
}

function mailboxRoomSlug(value, fallback = "guest") {
  const slug = String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return slug || fallback;
}

function mailboxRoomStorageParticipantKey(roomId, name) {
  return `${mailboxRoomSlug(roomId, MAILBOX_ROOM_DEFAULT_ID)}:${mailboxRoomSlug(name)}`;
}

function mailboxRoomCreateParticipantId(name, roomId) {
  const stored = readMailboxRoomStorage();
  const participantKey = mailboxRoomStorageParticipantKey(roomId, name);
  const rememberedParticipants =
    stored.participants && typeof stored.participants === "object"
      ? stored.participants
      : {};
  if (rememberedParticipants[participantKey]) {
    return rememberedParticipants[participantKey];
  }
  if (
    stored.participantId &&
    stored.roomId === roomId &&
    String(stored.displayName || "").trim() === String(name || "").trim()
  ) {
    return stored.participantId;
  }
  return `${mailboxRoomSlug(name)}-${Math.random().toString(36).slice(2, 8)}`;
}

function mailboxRoomSortParticipantsByJoinOrder(participants = []) {
  return (Array.isArray(participants) ? participants : [])
    .slice()
    .sort((left, right) => {
      const leftTime = Date.parse(left?.createdAt || left?.updatedAt || "") || 0;
      const rightTime = Date.parse(right?.createdAt || right?.updatedAt || "") || 0;
      if (leftTime !== rightTime) {
        return leftTime - rightTime;
      }
      return String(left?.id || "").localeCompare(String(right?.id || ""));
    });
}

function mailboxRoomAutoNameForJoinIndex(joinIndex) {
  return MAILBOX_ROOM_AUTO_NAMES[joinIndex] || "";
}

async function mailboxRoomParticipantsForRoom(roomId) {
  const normalizedRoomId = mailboxRoomSlug(roomId, MAILBOX_ROOM_DEFAULT_ID);
  let response = null;
  try {
    response = await fetch(
      `${localLabBackendBaseUrl()}/rooms/${encodeURIComponent(normalizedRoomId)}/participants`,
    );
  } catch (_error) {
    throw new Error(`backend at ${localLabBackendBaseUrl()} is not reachable`);
  }
  if (response.status === 404) {
    return [];
  }
  const payload = await localLabReadJsonResponse(response);
  if (!response.ok) {
    throw new Error(
      payload?.error?.message ||
        payload?.message ||
        `Unable to inspect room participants (${response.status})`,
    );
  }
  return mailboxRoomSortParticipantsByJoinOrder(payload.participants);
}

function mailboxRoomParticipantJoinIndex(participants, participantId) {
  const ordered = mailboxRoomSortParticipantsByJoinOrder(participants);
  const existingIndex = ordered.findIndex(
    (participant) => participant?.id === participantId,
  );
  return existingIndex >= 0 ? existingIndex : ordered.length;
}

function mailboxRoomCanvasForCurrentContext() {
  const mailboxItem = activeMailboxSendContext?.mailboxItem;
  if (!(mailboxItem instanceof HTMLElement)) {
    return null;
  }
  const canvas = mailboxItem.closest(".generated-layout-canvas, .playground-canvas");
  return canvas instanceof HTMLElement ? canvas : null;
}

function mailboxRoomLocalQubitItemsForCanvas(canvas) {
  if (!(canvas instanceof HTMLElement)) {
    return [];
  }
  return Array.from(
    canvas.querySelectorAll(':scope > .playground-node[data-component="qubit"]'),
  ).filter((item) => item instanceof HTMLElement);
}

function mailboxRoomLocalQubitItemsForIdentityAssignment() {
  return mailboxRoomLocalQubitItemsForCanvas(
    mailboxRoomCanvasForCurrentContext(),
  );
}

async function mailboxRoomAssignLocalQubitsForRoom(canvas = null) {
  if (!mailboxRoomIsJoined()) {
    return [];
  }
  const qubits =
    canvas instanceof HTMLElement
      ? mailboxRoomLocalQubitItemsForCanvas(canvas)
      : mailboxRoomLocalQubitItemsForIdentityAssignment();
  if (!qubits.length) {
    return [];
  }
  const payload = await localLabRequest(
    `/rooms/${encodeURIComponent(mailboxRoomState.roomId)}/qubits/allocate`,
    {
      method: "POST",
      body: {
        participantId: mailboxRoomState.participantId,
        baseRoomQubitIndex:
          Math.max(0, Number(mailboxRoomState.participantJoinIndex) || 0) *
          qubits.length,
        qubits: qubits.map((item, index) => ({
          clientId: ensureGeneratedItemId(item, "qubit") || `local-${index}`,
        })),
      },
    },
  );
  const assignments = Array.isArray(payload.qubits) ? payload.qubits : [];
  assignments.forEach((assignment, index) => {
    const item = qubits[index];
    if (item instanceof HTMLElement) {
      applyRoomQubitIdentity(item, assignment);
    }
  });
  return assignments;
}

async function mailboxRoomEnsureQubitIdentityForMeasurement(
  canvas,
  qubitItem,
  requiredCount,
) {
  if (
    !mailboxRoomIsJoined() ||
    !isEntanglementThreeCanvas(canvas) ||
    requiredCount <= 2 ||
    !(qubitItem instanceof HTMLElement)
  ) {
    return roomQubitIndexForItem(qubitItem);
  }
  const existingIndex = roomQubitIndexForItem(qubitItem);
  if (
    Number.isInteger(existingIndex) &&
    existingIndex >= 0 &&
    existingIndex < requiredCount
  ) {
    return existingIndex;
  }
  await mailboxRoomAssignLocalQubitsForRoom(canvas).catch(() => []);
  const assignedIndex = roomQubitIndexForItem(qubitItem);
  if (
    Number.isInteger(assignedIndex) &&
    assignedIndex >= 0 &&
    assignedIndex < requiredCount
  ) {
    ensureGeneratedMeasurementSlotIndexes(canvas, qubitItem);
    return assignedIndex;
  }
  return null;
}

function mailboxRoomDefaultRoomId() {
  const stored = readMailboxRoomStorage();
  return (
    localLabRoomFromLocation() ||
    stored.roomId ||
    (localLabSyncRoom instanceof HTMLInputElement
      ? localLabSyncRoom.value.trim()
      : "") ||
    MAILBOX_ROOM_DEFAULT_ID
  );
}

function mailboxRoomIdForSendContext(context = null) {
  const canvas = generatedCanvasForItem(context?.mailboxItem);
  if (isEntanglementThreeCanvas(canvas)) {
    return ENTANGLEMENT_THREE_ROOM_ID;
  }
  return mailboxRoomDefaultRoomId();
}

function mailboxRoomDefaultDisplayName() {
  const stored = readMailboxRoomStorage();
  return (
    localLabParticipantFromLocation() ||
    stored.displayName ||
    (localLabSyncParticipant instanceof HTMLInputElement
      ? localLabSyncParticipant.value.trim()
      : "")
  );
}

let mailboxRoomNameSuggestionToken = 0;

function mailboxRoomNameWasAutoFilled(input) {
  return input instanceof HTMLInputElement && input.dataset.mailboxAutoName === "true";
}

function mailboxRoomSetAutoName(input, value) {
  if (!(input instanceof HTMLInputElement)) {
    return;
  }
  input.value = value || "";
  input.dataset.mailboxAutoName = "true";
}

async function refreshMailboxRoomNameSuggestion(dialog = mailboxSendDialog) {
  if (
    mailboxRoomIsJoined() ||
    !(dialog?.nameInput instanceof HTMLInputElement) ||
    !(dialog?.roomInput instanceof HTMLInputElement)
  ) {
    return;
  }
  const nameInput = dialog.nameInput;
  if (nameInput.value.trim() && !mailboxRoomNameWasAutoFilled(nameInput)) {
    return;
  }
  const token = ++mailboxRoomNameSuggestionToken;
  const roomId = dialog.roomInput.value || mailboxRoomDefaultRoomId();
  let participants = [];
  try {
    participants = await mailboxRoomParticipantsForRoom(roomId);
  } catch (_error) {
    return;
  }
  if (token !== mailboxRoomNameSuggestionToken) {
    return;
  }
  const suggestedName = mailboxRoomAutoNameForJoinIndex(participants.length);
  mailboxRoomSetAutoName(nameInput, suggestedName);
  nameInput.placeholder = suggestedName || "Name";
}

function mailboxRoomQubitLabel(context = activeMailboxSendContext) {
  const roomIndex = roomQubitIndexForItem(context?.qubitItem);
  if (Number.isInteger(roomIndex)) {
    return `q${roomIndex}`;
  }
  return Number.isInteger(context?.qubitIndex)
    ? `q${context.qubitIndex}`
    : "a qubit";
}

function mailboxRoomSharedEntanglementPath(sharedEntanglementId = "") {
  const base = `/rooms/${encodeURIComponent(mailboxRoomState.roomId)}/shared-entanglements`;
  return sharedEntanglementId
    ? `${base}/${encodeURIComponent(sharedEntanglementId)}`
    : base;
}

function mailboxRoomSetRemoteEntanglementVisual(item, sharedEntanglementId) {
  if (!(item instanceof HTMLElement)) {
    return;
  }
  if (sharedEntanglementId) {
    item.dataset.remoteEntanglementId = sharedEntanglementId;
    item.classList.add("remote-entangled");
    item.title = "This qubit is entangled with a qubit in another mailbox session";
  } else {
    delete item.dataset.remoteEntanglementId;
    item.classList.remove("remote-entangled");
    item.removeAttribute("title");
  }
}

function mailboxRoomLocalMembersForSharedEntanglement(sharedEntanglementId, numQubits) {
  const members = [];
  generatedQubitRuntimes.forEach((state, item) => {
    if (!(item instanceof HTMLElement) || !item.isConnected || !state) {
      return;
    }
    const hasSharedState =
      state.pairState?.remoteEntanglementId === sharedEntanglementId;
    const hasSharedVisual = item.dataset.remoteEntanglementId === sharedEntanglementId;
    if (!hasSharedState && !hasSharedVisual) {
      return;
    }
    const memberFromState = Array.isArray(state.pairState?.members)
      ? state.pairState.members.find((entry) => entry?.item === item)
      : null;
    const rawIndex = Number.isFinite(state.pairQubitIndex)
      ? state.pairQubitIndex
      : Number.isFinite(memberFromState?.qubitIndex)
        ? memberFromState.qubitIndex
        : 0;
    members.push({
      item,
      state,
      qubitIndex: clamp(rawIndex, 0, Math.max(0, numQubits - 1)),
    });
  });
  return members;
}

function mailboxRoomSharedMeasurementRegisterCount(sharedEntanglement) {
  const measurement = mailboxRoomSharedMeasurementMetadata(sharedEntanglement);
  const metadataCount = Number(measurement.numQubits);
  if (Number.isInteger(metadataCount) && metadataCount >= 2 && metadataCount <= 4) {
    return metadataCount;
  }
  return Math.max(
    2,
    Math.min(
      4,
      inferRegisterQubitCountFromAmplitudes(
        sharedEntanglement?.amplitudes || [],
        Number.isInteger(sharedEntanglement?.numQubits)
          ? sharedEntanglement.numQubits
          : 2,
      ),
    ),
  );
}

function registerMeasurementTubeTypeForCount(numQubits) {
  if (numQubits === 4) {
    return "quadruple-tube-array";
  }
  if (numQubits === 3) {
    return "triple-tube-array";
  }
  return "double-tube-array";
}

function appendSavedMeasurementPiece(
  groupItem,
  type,
  { left = 8, top = 8, width = 84, height = 40, z = 1 } = {},
) {
  if (!(groupItem instanceof HTMLElement)) {
    return null;
  }
  const child = createPlaygroundComponentNode(type, {}) || null;
  if (!(child instanceof HTMLElement)) {
    return null;
  }
  child.classList.add("saved-group-child");
  child.dataset.component = type;
  child.dataset.measurementRole = measurementPieceRoleForType(type);
  if (groupItem.dataset.groupComponentId) {
    child.dataset.groupComponentId = groupItem.dataset.groupComponentId;
  }
  child.style.left = `${left}%`;
  child.style.top = `${top}%`;
  child.style.width = `${width}%`;
  child.style.height = `${height}%`;
  child.style.zIndex = `${z}`;
  groupItem.appendChild(child);
  return child;
}

function reconfigureGeneratedSeparatedMeasurementRuntimeForRegister(
  runtime,
  numQubits,
) {
  const safeNumQubits = Math.max(2, Math.min(4, Number(numQubits) || 2));
  if (!runtime?.item) {
    return null;
  }
  if (
    runtime.registerQubitCount === safeNumQubits &&
    Array.isArray(runtime.outcomeKeys) &&
    runtime.outcomeKeys.length === 2 ** safeNumQubits
  ) {
    return runtime;
  }
  const item = runtime.item;
  const currentRack = item.querySelector(".pair-tube-rack");
  let rackChild =
    currentRack instanceof HTMLElement
      ? currentRack.closest(".saved-group-child")
      : null;
  if (!(rackChild instanceof HTMLElement)) {
    const rackType = registerMeasurementTubeTypeForCount(safeNumQubits);
    rackChild = appendSavedMeasurementPiece(item, rackType, {
      left: safeNumQubits === 4 ? 1 : 4,
      top: 12,
      width: safeNumQubits === 4 ? 98 : 92,
      height: 48,
      z: 2,
    });
  }
  if (!(rackChild instanceof HTMLElement)) {
    return runtime;
  }
  const nextRack = createRegisterMeasurementTubeRack(safeNumQubits);
  if (currentRack instanceof HTMLElement) {
    currentRack.replaceWith(nextRack);
  } else {
    rackChild.replaceChildren(nextRack);
  }
  if (rackChild instanceof HTMLElement) {
    const nextType = registerMeasurementTubeTypeForCount(safeNumQubits);
    rackChild.dataset.component = nextType;
    rackChild.dataset.measurementRole =
      safeNumQubits === 4
        ? "quadruple-tubes"
        : safeNumQubits === 3
          ? "triple-tubes"
          : "double-tubes";
  }
  item.dataset.measurementRegisterQubitCount = `${safeNumQubits}`;
  syncSavedRegisterMeasurementCapacityText(item);
  generatedSeparatedPairMeasurementRuntimes.delete(item);
  return initializeGeneratedSeparatedPairMeasurementItem(item);
}

function mailboxRoomMeasurementRuntimeForSharedEntanglement(sharedEntanglement) {
  if (!sharedEntanglement?.id) {
    return null;
  }
  const numQubits = mailboxRoomSharedMeasurementRegisterCount(sharedEntanglement);
  const localMembers = mailboxRoomLocalMembersForSharedEntanglement(
    sharedEntanglement.id,
    numQubits,
  );
  const canvas = generatedCanvasForItem(localMembers[0]?.item);
  if (!canvas) {
    return null;
  }
  const candidates = generatedItemsOfType(
    canvas,
    PLAYGROUND_SAVED_GROUP_COMPONENT_TYPE,
  )
    .filter(isGeneratedSeparatedPairMeasurementItem)
    .map((item) => initializeGeneratedSeparatedPairMeasurementItem(item))
    .filter(Boolean);
  if (candidates.length === 0) {
    return null;
  }
  const exact = candidates.find(
    (runtime) => runtime.registerQubitCount === numQubits,
  );
  if (!exact) {
    return null;
  }
  return reconfigureGeneratedSeparatedMeasurementRuntimeForRegister(
    exact,
    numQubits,
  );
}

function applySharedRegisterMeasurementCounts(sharedEntanglement) {
  const measurement = mailboxRoomSharedMeasurementMetadata(sharedEntanglement);
  const hasSharedMeasurement =
    Object.keys(measurement.counts || {}).length > 0 ||
    Object.keys(measurement.pending || {}).length > 0 ||
    Object.keys(measurement.pendingQueues || {}).length > 0 ||
    Number.isInteger(Number(measurement.numQubits));
  if (!hasSharedMeasurement) {
    return false;
  }
  const runtime = mailboxRoomMeasurementRuntimeForSharedEntanglement(
    sharedEntanglement,
  );
  if (!runtime) {
    return false;
  }
  const canvas = generatedCanvasForItem(runtime.item);
  if (
    mailboxRoomIsJoined() &&
    isEntanglementThreeCanvas(canvas) &&
    mailboxRoomSharedMeasurementRegisterCount(sharedEntanglement) > 2
  ) {
    return false;
  }
  runtime.outcomeKeys.forEach((key) => {
    runtime.tubeCounts[key] = Math.max(
      0,
      Math.round(Number(measurement.counts?.[key]) || 0),
    );
  });
  runtime.pendingMeasurements = [];
  maybeExpandGeneratedDoubleMeasurementTubeCapacity(runtime);
  updateGeneratedDoubleMeasurementTubeFills(runtime);
  if (
    measurement.completionId &&
    !mailboxRoomSeenSharedMeasurementCompletionIds.has(measurement.completionId)
  ) {
    mailboxRoomSeenSharedMeasurementCompletionIds.add(measurement.completionId);
    if (isGeneratedExperimentRecording(canvas)) {
      finishGeneratedExperimentRecordingAfterMeasurement(canvas, {
        forceStop: Number(measurement.numQubits) > 2,
      });
    }
  }
  return true;
}

function mailboxRoomRemotePairStateForMeasurementRuntime(runtime) {
  const canvas = generatedCanvasForItem(runtime?.item);
  if (!canvas) {
    return null;
  }
  const qubits = generatedItemsOfType(canvas, "qubit");
  for (const qubit of qubits) {
    const state = ensureGeneratedQubitRuntimeState(qubit);
    if (state?.pairState?.remoteEntanglementId) {
      return state.pairState;
    }
  }
  return null;
}

function mailboxRoomSharedMeasurementControlId(type) {
  return [
    "measurement-control",
    mailboxRoomState.participantId || "participant",
    type || "repeat",
    Date.now().toString(36),
    Math.random().toString(36).slice(2, 8),
  ].join("-");
}

async function mailboxRoomPublishSharedMeasurementControl(
  runtime,
  type,
  iterations,
) {
  const pairState = mailboxRoomRemotePairStateForMeasurementRuntime(runtime);
  const sharedId = pairState?.remoteEntanglementId;
  if (!sharedId || !mailboxRoomIsJoined()) {
    return null;
  }
  const controlId = mailboxRoomSharedMeasurementControlId(type);
  const startAt = Date.now() + MAILBOX_ROOM_POLL_MS + 750;
  mailboxRoomSeenSharedMeasurementControlIds.add(controlId);
  let latest = await mailboxRoomRefreshSharedEntanglement(sharedId, {
    apply: false,
  });
  if (!latest) {
    return null;
  }
  for (let attempt = 0; attempt < 2; attempt += 1) {
    const measurement = mailboxRoomSharedMeasurementMetadata(latest);
    if (type === GENERATED_EXPERIMENT_COUNT_ACTION) {
      measurement.counts = {};
      measurement.pending = {};
      measurement.pendingQueues = {};
    }
    measurement.numQubits = mailboxRoomSharedMeasurementRegisterCount(latest);
    measurement.control = {
      id: controlId,
      type,
      iterations: generatedExperimentReplayIterations({ iterations }),
      requestedBy: mailboxRoomState.participantId || null,
      createdAt: Date.now(),
      startAt,
    };
    const metadata = mailboxRoomMetadataWithMeasurement(latest, measurement);
    try {
      const payload = await localLabRequest(
        mailboxRoomSharedEntanglementPath(sharedId),
        {
          method: "PUT",
          body: {
            ...mailboxRoomSharedSnapshotForMeasurement(
              pairState,
              latest,
              metadata,
            ),
            expectedVersion: latest.version,
          },
        },
      );
      const sharedEntanglement = payload.sharedEntanglement || null;
      if (sharedEntanglement) {
        pairState.remoteVersion = sharedEntanglement.version;
        pairState.remoteMetadata =
          sharedEntanglement.metadata &&
          typeof sharedEntanglement.metadata === "object"
            ? { ...sharedEntanglement.metadata }
            : {};
      }
      mailboxRoomApplySharedEntanglement(sharedEntanglement);
      return sharedEntanglement;
    } catch (error) {
      if (!/version conflict|shared_entanglement_version_conflict/i.test(error.message || "")) {
        throw error;
      }
      latest = await mailboxRoomRefreshSharedEntanglement(sharedId, {
        apply: false,
      });
      if (!latest) {
        return null;
      }
    }
  }
  return null;
}

function maybeRunSharedMeasurementControl(sharedEntanglement) {
  const measurement = mailboxRoomSharedMeasurementMetadata(sharedEntanglement);
  const control = measurement.control;
  if (!control?.id || mailboxRoomSeenSharedMeasurementControlIds.has(control.id)) {
    return false;
  }
  const runtime = mailboxRoomMeasurementRuntimeForSharedEntanglement(
    sharedEntanglement,
  );
  const canvas = generatedCanvasForItem(runtime?.item);
  if (
    mailboxRoomIsJoined() &&
    isEntanglementThreeCanvas(canvas) &&
    mailboxRoomSharedMeasurementRegisterCount(sharedEntanglement) > 2
  ) {
    mailboxRoomSeenSharedMeasurementControlIds.add(control.id);
    return false;
  }
  if (control.requestedBy && control.requestedBy === mailboxRoomState.participantId) {
    mailboxRoomSeenSharedMeasurementControlIds.add(control.id);
    return false;
  }
  const state = generatedExperimentStateForCanvas(canvas);
  if (!runtime || !canvas || !state?.experiment || layoutEditorState.enabled) {
    return false;
  }
  mailboxRoomSeenSharedMeasurementControlIds.add(control.id);
  const iterations = generatedExperimentReplayIterations(control);
  if (control.type === GENERATED_EXPERIMENT_COUNT_ACTION) {
    setMeasurementSelectValue(runtime.measurementCount, iterations);
    clearGeneratedSeparatedPairMeasurementApparatus(runtime);
  }
  const startDelay = Math.max(0, Math.round(Number(control.startAt) - Date.now()));
  window.setTimeout(() => {
    runGeneratedRecordedExperiment(canvas, iterations).catch(() => {});
  }, startDelay);
  return true;
}

function mailboxRoomApplySharedEntanglement(sharedEntanglement) {
  if (!sharedEntanglement?.id) {
    return;
  }
  const numQubits = inferRegisterQubitCountFromAmplitudes(
    sharedEntanglement.amplitudes || [],
    Number.isInteger(sharedEntanglement.numQubits)
      ? sharedEntanglement.numQubits
      : 2,
  );
  const amplitudes = normalizeTourRegisterAmplitudes(
    numQubits,
    sharedEntanglement.amplitudes || [],
  );
  const localMembers = mailboxRoomLocalMembersForSharedEntanglement(
    sharedEntanglement.id,
    numQubits,
  );
  if (sharedEntanglement.status === "separated") {
    localMembers.forEach(({ item, state, qubitIndex }) => {
      const vector = sharedEntanglement.memberVectors?.[qubitIndex];
      state.vector = Array.isArray(vector) ? normalizeVector2(vector) : state.vector;
      state.pairState = null;
      state.pairQubitIndex = null;
      state.cnotSourceSlot = null;
      state.cnotPairToken = null;
      state.cnotOutcomeProbabilities = null;
      mailboxRoomSetRemoteEntanglementVisual(item, "");
      applyGeneratedQubitVectorVisualState(item);
    });
    return;
  }
  const canonicalState = {
    numQubits,
    amplitudes: amplitudes.slice(),
    displayMode: sharedEntanglement.displayMode || "marginal",
    members: localMembers.map(({ item, state, qubitIndex }) => ({
      item,
      state,
      qubitIndex,
    })),
    remoteMembers: Array.isArray(sharedEntanglement.members)
      ? sharedEntanglement.members.map((member) => ({ ...member }))
      : [],
    remoteEntanglementId: sharedEntanglement.id,
    remoteVersion: sharedEntanglement.version,
    remoteMetadata:
      sharedEntanglement.metadata && typeof sharedEntanglement.metadata === "object"
        ? { ...sharedEntanglement.metadata }
        : {},
  };
  if (sharedEntanglement.linkRelation) {
    canonicalState.linkRelation = sharedEntanglement.linkRelation;
  }
  ensureDistinctQubitLogicalIdsForRegisterMembers(canonicalState.members);
  canonicalState.members.forEach((member) => {
    assignRuntimeStateToRegisterMember(
      member,
      canonicalState,
      member.qubitIndex,
    );
    member.state.vector = displayVectorForPairMember(
      canonicalState,
      member.qubitIndex,
    );
    mailboxRoomSetRemoteEntanglementVisual(member.item, sharedEntanglement.id);
    applyGeneratedQubitVectorVisualState(member.item);
  });
  applySharedRegisterMeasurementCounts(sharedEntanglement);
  maybeRunSharedMeasurementControl(sharedEntanglement);
}

async function mailboxRoomRefreshSharedEntanglement(
  sharedEntanglementId,
  { apply = true } = {},
) {
  if (!mailboxRoomIsJoined() || !sharedEntanglementId) {
    return null;
  }
  const payload = await localLabRequest(
    mailboxRoomSharedEntanglementPath(sharedEntanglementId),
  );
  const sharedEntanglement = payload.sharedEntanglement || null;
  if (apply) {
    mailboxRoomApplySharedEntanglement(sharedEntanglement);
  }
  return sharedEntanglement;
}

async function mailboxRoomRefreshSharedEntanglements() {
  const ids = new Set();
  generatedQubitRuntimes.forEach((state) => {
    if (state?.pairState?.remoteEntanglementId) {
      ids.add(state.pairState.remoteEntanglementId);
    }
  });
  await Promise.all(
    Array.from(ids).map((id) =>
      mailboxRoomRefreshSharedEntanglement(id).catch(() => null),
    ),
  );
}

function mailboxRoomQueueSharedEntanglementUpdate(
  pairState,
  { status = "active", memberVectors = null } = {},
) {
  if (!pairState?.remoteEntanglementId || !mailboxRoomIsJoined()) {
    return null;
  }
  const numQubits = registerStateNumQubits(pairState);
  const snapshot = {
    numQubits,
    amplitudes: normalizeTourRegisterAmplitudes(
      numQubits,
      pairState.amplitudes || [],
    ),
    displayMode: pairState.displayMode || "marginal",
    linkRelation: numQubits === 2 ? pairState.linkRelation || null : null,
    status,
    memberVectors,
    members: registerMembersForRemoteSnapshot(pairState),
    metadata:
      pairState.remoteMetadata && typeof pairState.remoteMetadata === "object"
        ? pairState.remoteMetadata
        : {},
  };
  pairState.remoteUpdatePromise = (pairState.remoteUpdatePromise || Promise.resolve())
    .catch(() => null)
    .then(async () => {
      try {
        const payload = await localLabRequest(
          mailboxRoomSharedEntanglementPath(pairState.remoteEntanglementId),
          {
            method: "PUT",
            body: {
              ...snapshot,
              expectedVersion: pairState.remoteVersion,
              updatedBy: mailboxRoomState.participantId,
            },
          },
        );
        const sharedEntanglement = payload.sharedEntanglement || null;
        if (sharedEntanglement) {
          pairState.remoteVersion = sharedEntanglement.version;
          pairState.remoteMetadata =
            sharedEntanglement.metadata &&
            typeof sharedEntanglement.metadata === "object"
              ? { ...sharedEntanglement.metadata }
              : {};
          mailboxRoomApplySharedEntanglement(sharedEntanglement);
        }
        return sharedEntanglement;
      } catch (error) {
        await mailboxRoomRefreshSharedEntanglement(
          pairState.remoteEntanglementId,
        ).catch(() => null);
        throw error;
      }
    });
  return pairState.remoteUpdatePromise;
}

function mailboxRoomSharedMeasurementMetadata(sharedEntanglement) {
  const metadata =
    sharedEntanglement?.metadata && typeof sharedEntanglement.metadata === "object"
      ? sharedEntanglement.metadata
      : {};
  const measurement =
    metadata.measurement && typeof metadata.measurement === "object"
      ? metadata.measurement
      : {};
  const counts =
    measurement.counts && typeof measurement.counts === "object"
      ? measurement.counts
      : {};
  const pending =
    measurement.pending && typeof measurement.pending === "object"
      ? measurement.pending
      : {};
  const pendingQueues =
    measurement.pendingQueues && typeof measurement.pendingQueues === "object"
      ? Object.fromEntries(
          Object.entries(measurement.pendingQueues).map(([key, queue]) => [
            key,
            Array.isArray(queue) ? queue.map((entry) => ({ ...entry })) : [],
          ]),
        )
      : {};
  return {
    ...measurement,
    counts: { ...counts },
    pending: { ...pending },
    pendingQueues,
  };
}

function mailboxRoomSharedMeasurementOutcomeKey(pending, numQubits) {
  return Array.from({ length: numQubits }, (_item, index) => {
    const entry = pending[String(index)];
    return entry?.color === "red" ? "r" : "b";
  }).join("");
}

function mailboxRoomSharedMeasurementComplete(pending, numQubits) {
  return Array.from({ length: numQubits }, (_item, index) =>
    Boolean(pending[String(index)]?.color),
  ).every(Boolean);
}

function mailboxRoomSharedMeasurementQueues(measurement, numQubits) {
  return Object.fromEntries(
    Array.from({ length: numQubits }, (_item, index) => {
      const key = String(index);
      const queue = Array.isArray(measurement.pendingQueues?.[key])
        ? measurement.pendingQueues[key].map((entry) => ({ ...entry }))
        : [];
      const legacyEntry = measurement.pending?.[key];
      if (legacyEntry?.color && queue.length === 0) {
        queue.push({ ...legacyEntry });
      }
      return [key, queue];
    }),
  );
}

function mailboxRoomSharedMeasurementQueuesComplete(queues, numQubits) {
  return Array.from({ length: numQubits }, (_item, index) =>
    Boolean(queues[String(index)]?.[0]?.color),
  ).every(Boolean);
}

function mailboxRoomSharedMeasurementOutcomeKeyFromQueues(queues, numQubits) {
  return Array.from({ length: numQubits }, (_item, index) => {
    const entry = queues[String(index)]?.[0];
    return entry?.color === "red" ? "r" : "b";
  }).join("");
}

function mailboxRoomSharedMeasurementPendingFromQueues(queues, numQubits) {
  return Object.fromEntries(
    Array.from({ length: numQubits }, (_item, index) => {
      const key = String(index);
      const entry = queues[key]?.[0];
      return entry?.color ? [key, { ...entry }] : null;
    }).filter(Boolean),
  );
}

function mailboxRoomMergeSharedMeasurement(
  sharedEntanglement,
  measurementEntry,
) {
  const numQubits = inferRegisterQubitCountFromAmplitudes(
    sharedEntanglement?.amplitudes || [],
    Number.isInteger(sharedEntanglement?.numQubits)
      ? sharedEntanglement.numQubits
      : 2,
  );
  const measurement = mailboxRoomSharedMeasurementMetadata(sharedEntanglement);
  const queues = mailboxRoomSharedMeasurementQueues(measurement, numQubits);
  const qubitIndex = clamp(
    Math.round(Number(measurementEntry?.qubitIndex) || 0),
    0,
    Math.max(0, numQubits - 1),
  );
  const queueKey = String(qubitIndex);
  queues[queueKey].push({
    color: measurementEntry.color === "red" ? "red" : "blue",
    participantId: mailboxRoomState.participantId || null,
    logicalQubitId: measurementEntry.logicalQubitId || null,
    measuredAt: Date.now(),
  });
  let completed = false;
  let outcomeKey = "";
  while (mailboxRoomSharedMeasurementQueuesComplete(queues, numQubits)) {
    outcomeKey = mailboxRoomSharedMeasurementOutcomeKeyFromQueues(
      queues,
      numQubits,
    );
    measurement.counts[outcomeKey] =
      Math.max(0, Math.round(Number(measurement.counts[outcomeKey]) || 0)) + 1;
    measurement.lastOutcomeKey = outcomeKey;
    measurement.lastCompletedAt = Date.now();
    measurement.completionId = `measurement-${Date.now().toString(36)}-${Math.random()
      .toString(36)
      .slice(2, 8)}`;
    completed = true;
    Array.from({ length: numQubits }, (_item, index) => {
      queues[String(index)].shift();
    });
  }
  measurement.pendingQueues = queues;
  measurement.pending = mailboxRoomSharedMeasurementPendingFromQueues(
    queues,
    numQubits,
  );
  measurement.numQubits = numQubits;
  return { measurement, completed, outcomeKey, numQubits };
}

function mailboxRoomMetadataWithMeasurement(sharedEntanglement, measurement) {
  const metadata =
    sharedEntanglement?.metadata && typeof sharedEntanglement.metadata === "object"
      ? { ...sharedEntanglement.metadata }
      : {};
  metadata.measurement = measurement;
  return metadata;
}

function mailboxRoomMeasurementPath(measurementId = "") {
  const base = `/rooms/${encodeURIComponent(mailboxRoomState.roomId)}/measurements`;
  return measurementId ? `${base}/${encodeURIComponent(measurementId)}` : base;
}

function mailboxRoomMeasurementControlPath(measurementId) {
  return `${mailboxRoomMeasurementPath(measurementId)}/control`;
}

function mailboxRoomMeasurementControlCompletionPath(measurementId) {
  return `${mailboxRoomMeasurementPath(measurementId)}/control-completion`;
}

function mailboxRoomMeasurementCountsPath(measurementId) {
  return `${mailboxRoomMeasurementPath(measurementId)}/counts`;
}

function mailboxRoomResetPath() {
  return `/rooms/${encodeURIComponent(mailboxRoomState.roomId)}/reset`;
}

function mailboxRoomActionPath() {
  return `/rooms/${encodeURIComponent(mailboxRoomState.roomId)}/actions`;
}

function mailboxRoomResetIdForRoom(room) {
  const reset = room?.lastReset;
  if (!reset) {
    return "";
  }
  return (
    reset.id ||
    (Number.isFinite(Number(reset.version)) ? `reset-${reset.version}` : "")
  );
}

function mailboxRoomCanvasForResetContext(canvas = null) {
  if (canvas instanceof HTMLElement && canvas.isConnected) {
    return canvas;
  }
  const activePanel = document.querySelector(
    '[id^="panel-"]:not([hidden])',
  );
  const activeCanvas = activePanel?.querySelector?.(
    ".generated-layout-canvas:not(.doc-runtime-canvas):not(.doc-editor-canvas)",
  );
  if (activeCanvas instanceof HTMLElement) {
    return activeCanvas;
  }
  const contextCanvas = mailboxRoomCanvasForCurrentContext();
  if (contextCanvas instanceof HTMLElement && contextCanvas.isConnected) {
    return contextCanvas;
  }
  return null;
}

function mailboxRoomRebindContextForCanvas(canvas) {
  if (!(canvas instanceof HTMLElement)) {
    return null;
  }
  const mailboxItem = canvas.querySelector(
    ':scope > .playground-node[data-component="mailbox"]',
  );
  if (mailboxItem instanceof HTMLElement) {
    activeMailboxSendContext = { mailboxItem };
    return mailboxItem;
  }
  return null;
}

function mailboxRoomGateActionDetails(canvas, gateItem, tickIndex) {
  const gateId = ensureGeneratedItemId(gateItem, "single-gate");
  const gates = generatedItemsOfType(canvas, "single-gate").sort(
    (left, right) =>
      Number.parseFloat(left.style.top || "0") -
      Number.parseFloat(right.style.top || "0"),
  );
  const gateIndex = Math.max(0, gates.indexOf(gateItem));
  const qubits = generatedItemsOfType(canvas, "qubit").sort(
    (left, right) =>
      Number.parseFloat(left.style.top || "0") -
      Number.parseFloat(right.style.top || "0"),
  );
  const qubit = qubits[gateIndex] || null;
  return {
    actionType: "gate-setting",
    participantId: mailboxRoomState.participantId || null,
    gateId,
    itemId: gateId,
    gateLabel: `flipper gate ${gateIndex + 1}`,
    qubitLabel: qubit instanceof HTMLElement
      ? qubitDisplayLabelForItem(qubit, gateIndex)
      : null,
    tickIndex: normalizeTickIndex(tickIndex),
  };
}

async function mailboxRoomRecordGateSettingAction(canvas, gateItem, tickIndex) {
  if (
    !mailboxRoomIsJoined() ||
    !isEntanglementThreeCanvas(canvas) ||
    !(gateItem instanceof HTMLElement)
  ) {
    return null;
  }
  const payload = await localLabRequest(mailboxRoomActionPath(), {
    method: "POST",
    body: mailboxRoomGateActionDetails(canvas, gateItem, tickIndex),
  });
  const event = payload.event || null;
  if (event) {
    mailboxRoomState.events = [...mailboxRoomState.events, event];
    updateEntanglementThreeRoomReviewToolbars();
  }
  return event;
}

async function mailboxRoomApplyRoomReset(room, options = {}) {
  const resetId = mailboxRoomResetIdForRoom(room);
  if (!resetId || (!options.force && mailboxRoomState.resetId === resetId)) {
    return false;
  }
  mailboxRoomState.resetId = resetId;
  mailboxRoomState.events = Array.isArray(room?.events) ? room.events : [];
  mailboxRoomState.measurements = [];
  mailboxRoomSeenSharedMeasurementControlIds.clear();
  mailboxRoomSeenSharedMeasurementCompletionIds.clear();
  mailboxRoomCompletedMeasurementControlIds.clear();
  mailboxRoomAppliedMeasurementVersions.clear();
  mailboxRoomState.reviewCounts = {};
  mailboxRoomState.reviewRuns = 0;
  mailboxRoomState.replaying = false;
  mailboxRoomState.replayActionIndex = -1;
  const canvas = mailboxRoomCanvasForResetContext(options.canvas || null);
  const panel = canvas?.closest?.('[data-generated-layout-panel="true"]');
  if (canvas instanceof HTMLElement) {
    resetGeneratedTabForCanvas(canvas);
  }
  const nextCanvas = panel?.querySelector?.(
    ".generated-layout-canvas:not(.doc-runtime-canvas):not(.doc-editor-canvas)",
  );
  const assignmentCanvas =
    nextCanvas instanceof HTMLElement ? nextCanvas : canvas;
  mailboxRoomRebindContextForCanvas(assignmentCanvas);
  await mailboxRoomAssignLocalQubitsForRoom(assignmentCanvas).catch(() => []);
  renderMailboxRoomDialog();
  return true;
}

async function mailboxRoomPublishRoomReset(canvas) {
  if (!mailboxRoomIsJoined()) {
    return null;
  }
  const payload = await localLabRequest(mailboxRoomResetPath(), {
    method: "POST",
    body: {
      participantId: mailboxRoomState.participantId || null,
    },
  });
  const room = payload.room || null;
  if (room) {
    await mailboxRoomApplyRoomReset(room, { canvas, force: true });
  }
  return room;
}

function mailboxRoomMeasurementSharedId(runtime, numQubits = null) {
  const item = runtime?.item;
  const canvas = generatedCanvasForItem(item);
  const count = Math.max(
    2,
    Math.min(
      4,
      Number(numQubits) ||
        Number(runtime?.registerQubitCount) ||
        registerMeasurementQubitCountForItem(item),
    ),
  );
  const groupKey =
    isEntanglementThreeCanvas(canvas) && count === 4
      ? "entanglement-3-register-measurement"
      : item?.dataset?.groupComponentId ||
        item?.dataset?.component ||
        "register-measurement";
  const canvasKey = isEntanglementThreeCanvas(canvas)
    ? "entanglement-3"
    : canvas?.dataset?.generatedTabId || canvas?.id || "room";
  const normalizedGroupKey =
    typeof generatedTabSlug === "function"
      ? generatedTabSlug(groupKey)
      : String(groupKey).replace(/[^a-z0-9]+/gi, "-").toLowerCase();
  const normalizedCanvasKey =
    typeof generatedTabSlug === "function"
      ? generatedTabSlug(canvasKey)
      : String(canvasKey).replace(/[^a-z0-9]+/gi, "-").toLowerCase();
  return `room-register-measurement-${count}-${normalizedCanvasKey || "room"}-${normalizedGroupKey || "default"}`;
}

function mailboxRoomRecordedExperimentForRuntime(runtime) {
  const canvas = generatedCanvasForItem(runtime?.item);
  const state = generatedExperimentStateForCanvas(canvas);
  if (!state) {
    return null;
  }
  let experiment = null;
  if (state.recording) {
    experiment = currentGeneratedRecordingExperiment(canvas);
  } else {
    experiment = cloneGeneratedExperiment(state.experiment);
  }
  if (!experiment || !Array.isArray(experiment.actions)) {
    return experiment;
  }
  const participantId = mailboxRoomState.participantId || null;
  experiment.initialQubits = (Array.isArray(experiment.initialQubits)
    ? experiment.initialQubits
    : []
  ).map((entry) => ({
    ...entry,
    roomParticipantId: entry.roomParticipantId || participantId,
  }));
  experiment.gateSettings = (Array.isArray(experiment.gateSettings)
    ? experiment.gateSettings
    : []
  ).map((entry) => ({
    ...entry,
    roomParticipantId: entry.roomParticipantId || participantId,
  }));
  experiment.actions = experiment.actions.map((action) => ({
    ...action,
    roomParticipantId: action.roomParticipantId || participantId,
  }));
  return experiment;
}

function mailboxRoomExperimentForCurrentParticipant(experiment) {
  const clone = cloneGeneratedExperiment(experiment);
  if (!clone || !Array.isArray(clone.actions)) {
    return clone;
  }
  const participantId = mailboxRoomState.participantId || "";
  clone.initialQubits = (Array.isArray(clone.initialQubits)
    ? clone.initialQubits
    : []
  ).filter(
    (entry) =>
      !entry.roomParticipantId || entry.roomParticipantId === participantId,
  );
  clone.gateSettings = (Array.isArray(clone.gateSettings)
    ? clone.gateSettings
    : []
  ).filter(
    (entry) =>
      !entry.roomParticipantId || entry.roomParticipantId === participantId,
  );
  clone.actions = clone.actions.filter(
    (action) =>
      !action.roomParticipantId || action.roomParticipantId === participantId,
  );
  return clone;
}

function ensureEntanglementThreeRoomExperimentRecording(canvas) {
  if (
    !mailboxRoomIsJoined() ||
    !isEntanglementThreeCanvas(canvas)
  ) {
    return false;
  }
  const state = generatedExperimentStateForCanvas(canvas);
  if (!state || state.playing || state.experiment) {
    return false;
  }
  return state.recording || beginGeneratedExperimentRecording(canvas);
}

function mailboxRoomApplyRecordedExperiment(measurement, runtime) {
  const experiment = mailboxRoomExperimentForCurrentParticipant(
    measurement?.experiment || measurement?.recordedExperiment,
  );
  if (!experiment || !Array.isArray(experiment.actions) || experiment.actions.length === 0) {
    return false;
  }
  const canvas = generatedCanvasForItem(runtime?.item);
  const state = generatedExperimentStateForCanvas(canvas);
  if (!state || state.recording || state.playing) {
    return false;
  }
  state.experiment = experiment;
  state.gateSettings = Array.isArray(experiment.gateSettings)
    ? experiment.gateSettings.map((entry) => ({ ...entry }))
    : captureGeneratedGateSettings(canvas);
  state.replayGateSettingsChanged = false;
  state.playbackResultVisible = false;
  updateGeneratedExperimentToolbar(canvas);
  return true;
}

function mailboxRoomControlCompletionKey(control) {
  return `${control?.id || ""}:${mailboxRoomState.participantId || ""}`;
}

function mailboxRoomControlIsComplete(control) {
  return Boolean(control?.status === "complete" || control?.completedAt);
}

function mailboxRoomActiveExperimentMeasurement() {
  return (
    (Array.isArray(mailboxRoomState.measurements)
      ? mailboxRoomState.measurements
      : []
    ).find((measurement) => {
      const control = measurement?.control;
      return control?.id && !mailboxRoomControlIsComplete(control);
    }) || null
  );
}

function mailboxRoomExperimentControlInProgress() {
  return Boolean(mailboxRoomActiveExperimentMeasurement());
}

function updateMailboxRoomExperimentProgressOverlay() {
  const existing = document.querySelector(".entanglement-room-progress-overlay");
  const activeMeasurement = mailboxRoomActiveExperimentMeasurement();
  if (!activeMeasurement) {
    existing?.remove();
    return false;
  }
  const control = activeMeasurement.control || {};
  const iterations = generatedExperimentReplayIterations(control);
  const message =
    iterations > 10
      ? `Experiment in progress: running ${iterations} iterations without animation.`
      : `Experiment in progress: animating ${iterations} iteration${iterations === 1 ? "" : "s"}.`;
  const overlay =
    existing instanceof HTMLElement ? existing : document.createElement("div");
  overlay.className = "entanglement-room-progress-overlay";
  overlay.setAttribute("role", "status");
  overlay.setAttribute("aria-live", "polite");
  let box = overlay.querySelector(".entanglement-room-progress-box");
  if (!(box instanceof HTMLElement)) {
    box = document.createElement("div");
    box.className = "entanglement-room-progress-box";
    overlay.replaceChildren(box);
  }
  box.textContent = message;
  if (!existing) {
    document.body.appendChild(overlay);
  }
  return true;
}

function mailboxRoomCountDelta(beforeCounts, afterCounts) {
  const delta = {};
  Object.entries(afterCounts || {}).forEach(([key, value]) => {
    const amount =
      Math.max(0, Math.round(Number(value) || 0)) -
      Math.max(0, Math.round(Number(beforeCounts?.[key]) || 0));
    if (amount > 0) {
      delta[key] = amount;
    }
  });
  return delta;
}

async function mailboxRoomAddBatchMeasurementCounts(runtime, counts, control) {
  if (!mailboxRoomIsJoined() || !runtime?.item) {
    return null;
  }
  const measurementId = mailboxRoomMeasurementSharedId(
    runtime,
    runtime.registerQubitCount,
  );
  const payload = await localLabRequest(
    mailboxRoomMeasurementCountsPath(measurementId),
    {
      method: "POST",
      body: {
        numQubits: Math.max(2, Math.min(4, Number(runtime.registerQubitCount) || 4)),
        counts,
        controlId: control?.id || null,
        participantId: mailboxRoomState.participantId || null,
      },
    },
  );
  const measurement = payload.measurement || null;
  mailboxRoomApplyRoomMeasurement(measurement);
  updateMailboxRoomExperimentProgressOverlay();
  return measurement;
}

function mailboxRoomDirectReplayOutcomeKey(measurement, control) {
  if (control?.replayOutcomeKey) {
    return control.replayOutcomeKey;
  }
  if (measurement?.lastOutcomeKey) {
    return measurement.lastOutcomeKey;
  }
  return (
    Object.entries(measurement?.counts || {})
      .filter((entry) => Number(entry[1]) > 0)
      .sort((left, right) => Number(right[1]) - Number(left[1]))[0]?.[0] || ""
  );
}

function mailboxRoomRecordedExperimentForMeasurement(measurement) {
  return cloneGeneratedExperiment(
    measurement?.experiment || measurement?.recordedExperiment,
  );
}

function mailboxRoomScopedItemKey(participantId, itemId) {
  return `${participantId || "room"}:${itemId || ""}`;
}

function mailboxRoomRecordedQubitKey(entry = {}) {
  const roomQubitIndex = normalizeRoomQubitIndex(entry.roomQubitIndex);
  if (Number.isInteger(roomQubitIndex)) {
    return `room:${roomQubitIndex}`;
  }
  const logicalQubitId = normalizeQubitId(
    entry.logicalQubitId ??
      entry.qubitLogicalId ??
      entry.topQubitLogicalId ??
      entry.bottomQubitLogicalId,
  );
  if (logicalQubitId) {
    return `q:${logicalQubitId}`;
  }
  return mailboxRoomScopedItemKey(
    entry.roomParticipantId || "",
    entry.itemId || entry.qubitId || "",
  );
}

function mailboxRoomRecordedGateKey(entry = {}) {
  return mailboxRoomScopedItemKey(
    entry.roomParticipantId || "",
    entry.itemId || entry.gateId || "",
  );
}

function mailboxRoomRecordedActionScopedItemKey(action = {}, qubitId = null) {
  return mailboxRoomScopedItemKey(
    action.roomParticipantId || "",
    qubitId || action.itemId || action.qubitId || "",
  );
}

function mailboxRoomRecordedActionSourceKeys(action = {}) {
  if (!action || typeof action !== "object") {
    return [];
  }
  if (action.type === "gate") {
    return [
      {
        qubitKey: mailboxRoomRecordedActionQubitKey(action),
        sourceKey: mailboxRoomRecordedActionScopedItemKey(
          action,
          action.qubitId || action.itemId,
        ),
      },
    ];
  }
  if (action.type === "cnot") {
    return [
      {
        qubitKey: mailboxRoomRecordedCnotQubitKey(action, "top"),
        sourceKey: mailboxRoomRecordedActionScopedItemKey(
          action,
          action.topQubitId,
        ),
      },
      {
        qubitKey: mailboxRoomRecordedCnotQubitKey(action, "bottom"),
        sourceKey: mailboxRoomRecordedActionScopedItemKey(
          action,
          action.bottomQubitId,
        ),
      },
    ];
  }
  return [];
}

function mailboxRoomRecordedPreparationSources(experiment) {
  const sources = new Map();
  (Array.isArray(experiment?.actions) ? experiment.actions : []).forEach(
    (action) => {
      if (action?.type !== "gate" && action?.type !== "cnot") {
        return;
      }
      mailboxRoomRecordedActionSourceKeys(action).forEach(
        ({ qubitKey, sourceKey }) => {
          if (!qubitKey || !sourceKey) {
            return;
          }
          const existing = sources.get(qubitKey) || new Set();
          existing.add(sourceKey);
          sources.set(qubitKey, existing);
        },
      );
    },
  );
  return sources;
}

function mailboxRoomRecordedInitialEntryScore(entry, preferredSources) {
  const qubitKey = mailboxRoomRecordedQubitKey(entry);
  const sourceKey = mailboxRoomScopedItemKey(
    entry.roomParticipantId || "",
    entry.itemId || entry.qubitId || "",
  );
  if (
    qubitKey &&
    sourceKey &&
    preferredSources instanceof Map &&
    preferredSources.get(qubitKey)?.has(sourceKey)
  ) {
    return 2;
  }
  return 1;
}

function mailboxRoomRecordedExperimentInitialVectorMap(experiment) {
  const vectors = new Map();
  const scores = new Map();
  const preferredSources = mailboxRoomRecordedPreparationSources(experiment);
  (Array.isArray(experiment?.initialQubits)
    ? experiment.initialQubits
    : []
  ).forEach((entry) => {
    const key = mailboxRoomRecordedQubitKey(entry);
    if (key) {
      const score = mailboxRoomRecordedInitialEntryScore(
        entry,
        preferredSources,
      );
      if (!vectors.has(key) || score > (scores.get(key) || 0)) {
        vectors.set(key, normalizeVector2(entry.vector || [1, 0]));
        scores.set(key, score);
      }
    }
  });
  return vectors;
}

function mailboxRoomRecordedExperimentGateTickMap(experiment) {
  const ticks = new Map();
  (Array.isArray(experiment?.gateSettings)
    ? experiment.gateSettings
    : []
  ).forEach((entry) => {
    const key = mailboxRoomRecordedGateKey(entry);
    if (key) {
      ticks.set(key, normalizeTickIndex(entry.tickIndex || 0));
    }
  });
  return ticks;
}

function mailboxRoomRecordedGateTickForAction(action, gateTicks) {
  if (Number.isFinite(action?.tickIndex)) {
    return normalizeTickIndex(action.tickIndex);
  }
  const key = mailboxRoomRecordedGateKey(action);
  if (key && gateTicks instanceof Map && gateTicks.has(key)) {
    return normalizeTickIndex(gateTicks.get(key));
  }
  return 0;
}

function mailboxRoomRecordedActionQubitKey(action) {
  const key = mailboxRoomRecordedQubitKey(action);
  return key || mailboxRoomScopedItemKey(action?.roomParticipantId || "", action?.qubitId || "");
}

function mailboxRoomRecordedCnotQubitKey(action, side) {
  const roomQubitIndex =
    side === "top"
      ? normalizeRoomQubitIndex(action?.topRoomQubitIndex)
      : normalizeRoomQubitIndex(action?.bottomRoomQubitIndex);
  if (Number.isInteger(roomQubitIndex)) {
    return `room:${roomQubitIndex}`;
  }
  const logicalKey =
    side === "top"
      ? normalizeQubitId(action?.topQubitLogicalId)
      : normalizeQubitId(action?.bottomQubitLogicalId);
  if (logicalKey) {
    return `q:${logicalKey}`;
  }
  return mailboxRoomScopedItemKey(
    action?.roomParticipantId || "",
    side === "top" ? action?.topQubitId : action?.bottomQubitId,
  );
}

function mailboxRoomNextRecordedOrderIndex(pending, requiredCount) {
  const used = new Set(
    pending
      .map((entry) => entry.orderIndex)
      .filter(
        (candidate) =>
          Number.isInteger(candidate) &&
          candidate >= 0 &&
          candidate < requiredCount,
      ),
  );
  for (let index = 0; index < requiredCount; index += 1) {
    if (!used.has(index)) {
      return index;
    }
  }
  return requiredCount - 1;
}

function mailboxRoomRecordedReplayActionPhase(action = {}) {
  if (action.type === "gate-setting") {
    return 0;
  }
  if (action.type === "gate" || action.type === "cnot") {
    return 1;
  }
  if (action.type === "separated-pair-measure") {
    return 2;
  }
  return 3;
}

function mailboxRoomRecordedReplayActions(actions) {
  return generatedExperimentLowLevelActions(actions || [])
    .map((action, index) => ({ action, index }))
    .sort((left, right) => {
      const phaseDelta =
        mailboxRoomRecordedReplayActionPhase(left.action) -
        mailboxRoomRecordedReplayActionPhase(right.action);
      return phaseDelta || left.index - right.index;
    })
    .map((entry) => entry.action);
}

function roomReplaySingleQubitState(vector) {
  return {
    numQubits: 1,
    amplitudes: normalizeVector2(vector || [1, 0]),
    qubitKeys: [],
  };
}

function roomReplayStateForQubit(vectors, registers, qubitKey) {
  const existing = registers.get(qubitKey);
  if (existing?.state && Number.isInteger(existing.index)) {
    return existing;
  }
  const state = roomReplaySingleQubitState(vectors.get(qubitKey) || [1, 0]);
  state.qubitKeys = [qubitKey];
  const reference = { state, index: 0 };
  registers.set(qubitKey, reference);
  return reference;
}

function syncRoomReplayVectorsFromState(vectors, registers, state) {
  const keys = Array.isArray(state?.qubitKeys) ? state.qubitKeys : [];
  keys.forEach((qubitKey, index) => {
    registers.set(qubitKey, { state, index });
    vectors.set(qubitKey, sharedRegisterMarginalVector(state, index));
  });
}

function clearRoomReplayStateForQubit(registers, qubitKey) {
  const reference = registers.get(qubitKey);
  if (!reference?.state) {
    registers.delete(qubitKey);
    return;
  }
  (reference.state.qubitKeys || []).forEach((key) => registers.delete(key));
}

function applyRoomReplayGateToState(vectors, registers, qubitKey, tickIndex) {
  const reference = registers.get(qubitKey);
  if (reference?.state && Number.isInteger(reference.index)) {
    sharedRegisterApplySingleGate(
      reference.state,
      reference.index,
      gateMatrixForTick(tickIndex),
    );
    syncRoomReplayVectorsFromState(vectors, registers, reference.state);
    return;
  }
  vectors.set(
    qubitKey,
    normalizeVector2(
      vectorTimesMatrix2(
        vectors.get(qubitKey) || [1, 0],
        gateMatrixForTick(tickIndex),
      ),
    ),
  );
}

function applyRoomReplayCnotToState(vectors, registers, topKey, bottomKey) {
  const topReference = roomReplayStateForQubit(vectors, registers, topKey);
  const bottomReference = roomReplayStateForQubit(vectors, registers, bottomKey);
  if (topReference.state === bottomReference.state) {
    sharedRegisterApplyCnot(
      topReference.state,
      topReference.index,
      bottomReference.index,
    );
    syncRoomReplayVectorsFromState(vectors, registers, topReference.state);
    return;
  }
  const topHasRegister = (topReference.state?.numQubits || 1) > 1;
  const bottomHasRegister = (bottomReference.state?.numQubits || 1) > 1;
  const preserveBottomRegisterOrder = bottomHasRegister && !topHasRegister;
  const firstReference = preserveBottomRegisterOrder
    ? bottomReference
    : topReference;
  const secondReference = preserveBottomRegisterOrder
    ? topReference
    : bottomReference;
  const firstRegister = registerStateAsQuantumRegister(firstReference.state);
  const secondRegister = registerStateAsQuantumRegister(secondReference.state);
  const combinedRegister = sharedRegisterTensor([firstRegister, secondRegister]);
  if (!combinedRegister) {
    return;
  }
  const offset = firstRegister.numQubits;
  const firstKeys = Array.isArray(firstReference.state.qubitKeys)
    ? firstReference.state.qubitKeys
    : [];
  const secondKeys = Array.isArray(secondReference.state.qubitKeys)
    ? secondReference.state.qubitKeys
    : [];
  const nextState = {
    numQubits: combinedRegister.numQubits,
    amplitudes: realAmplitudesFromQuantumRegister(
      combinedRegister,
      2 ** combinedRegister.numQubits,
    ),
    displayMode: "conditional",
    qubitKeys: [...firstKeys, ...secondKeys],
  };
  const controlIndex = preserveBottomRegisterOrder
    ? offset + topReference.index
    : topReference.index;
  const targetIndex = preserveBottomRegisterOrder
    ? bottomReference.index
    : offset + bottomReference.index;
  sharedRegisterApplyCnot(nextState, controlIndex, targetIndex);
  syncRoomReplayVectorsFromState(vectors, registers, nextState);
}

function mailboxRoomRecordedMeasurementCounts(
  experiment,
  iterations,
  measurement,
) {
  const actions = mailboxRoomRecordedReplayActions(experiment?.actions || []);
  const count = Math.max(1, Number(iterations) || 1);
  if (!actions.length) {
    return null;
  }
  const numQubits = Math.max(
    2,
    Math.min(4, Number(measurement?.numQubits) || 4),
  );
  const outcomeKeys = registerMeasurementOutcomeKeys(numQubits);
  const validOutcomes = new Set(outcomeKeys);
  const counts = Object.fromEntries(outcomeKeys.map((key) => [key, 0]));
  const baseVectors = mailboxRoomRecordedExperimentInitialVectorMap(experiment);
  const baseGateTicks = mailboxRoomRecordedExperimentGateTickMap(experiment);

  for (let run = 0; run < count; run += 1) {
    const vectors = new Map(
      Array.from(baseVectors.entries()).map(([key, vector]) => [
        key,
        normalizeVector2(vector),
      ]),
    );
    const gateTicks = new Map(baseGateTicks);
    const registers = new Map();
    const pendingByMeasurement = new Map();

    actions.forEach((action) => {
      if (!action || !action.type) {
        return;
      }
      if (action.type === "gate-setting") {
        const gateKey = mailboxRoomRecordedGateKey(action);
        if (gateKey) {
          gateTicks.set(gateKey, mailboxRoomRecordedGateTickForAction(action));
        }
        return;
      }
      if (action.type === "gate") {
        const qubitKey = mailboxRoomRecordedActionQubitKey(action);
        if (!qubitKey) {
          return;
        }
        const tickIndex = mailboxRoomRecordedGateTickForAction(action, gateTicks);
        applyRoomReplayGateToState(vectors, registers, qubitKey, tickIndex);
        return;
      }
      if (action.type === "cnot") {
        const topKey = mailboxRoomRecordedCnotQubitKey(action, "top");
        const bottomKey = mailboxRoomRecordedCnotQubitKey(action, "bottom");
        if (!topKey || !bottomKey) {
          return;
        }
        applyRoomReplayCnotToState(vectors, registers, topKey, bottomKey);
        return;
      }
      if (action.type !== "separated-pair-measure") {
        return;
      }

      const qubitKey = mailboxRoomRecordedActionQubitKey(action);
      if (!qubitKey) {
        return;
      }
      const requiredCount = Math.max(
        2,
        Math.min(4, Number(action.registerQubitCount) || numQubits),
      );
      // Alice and Bob render separate copies of the Entanglement 3 apparatus,
      // so their recorded actions have different local measurement IDs. They
      // nevertheless feed one shared four-qubit room measurement.
      const measurementId =
        requiredCount === 4
          ? measurement?.id || "room-four-qubit-measurement"
          : action.measurementId || "room-measurement";
      const pending = pendingByMeasurement.get(measurementId) || [];
      let orderIndex = Number.isFinite(action.orderIndex)
        ? clamp(Math.round(action.orderIndex), 0, requiredCount - 1)
        : null;
      if (!Number.isInteger(orderIndex)) {
        const logicalIndex =
          (normalizeQubitId(action.logicalQubitId || action.qubitLogicalId) || 0) -
          1;
        orderIndex =
          logicalIndex >= 0 && logicalIndex < requiredCount
            ? logicalIndex
            : mailboxRoomNextRecordedOrderIndex(pending, requiredCount);
      }

      let color = "blue";
      const reference = registers.get(qubitKey);
      if (reference?.state && Number.isInteger(reference.index)) {
        const result = sharedRegisterMeasureMember(
          reference.state,
          reference.index,
        );
        color = result?.color || "blue";
        syncRoomReplayVectorsFromState(vectors, registers, reference.state);
      } else {
        color = sampleSingleQubitOutcomeFromVector(
          vectors.get(qubitKey) || [1, 0],
        );
        vectors.set(qubitKey, color === "blue" ? [1, 0] : [0, 1]);
        clearRoomReplayStateForQubit(registers, qubitKey);
      }

      const nextPending = pending
        .filter((entry) => entry.qubitKey !== qubitKey)
        .concat({
          qubitKey,
          color,
          orderIndex,
          sequence: pending.length + 1,
        })
        .slice(-requiredCount);
      if (nextPending.length >= requiredCount) {
        const ordered = orderedFastSeparatedMeasurementEntries(
          nextPending,
          requiredCount,
        );
        const outcome = registerOutcomeKeyFromMeasurementEntries(
          ordered.slice(0, requiredCount),
        );
        if (validOutcomes.has(outcome)) {
          counts[outcome] += 1;
        }
        pendingByMeasurement.set(measurementId, []);
      } else {
        pendingByMeasurement.set(measurementId, nextPending);
      }
    });
  }

  return Object.values(counts).some((value) => Number(value) > 0)
    ? counts
    : null;
}

function mailboxRoomAddReviewCounts(counts) {
  let added = 0;
  Object.entries(counts || {}).forEach(([key, value]) => {
    const amount = Math.max(0, Math.round(Number(value) || 0));
    if (amount <= 0) {
      return;
    }
    mailboxRoomState.reviewCounts[key] =
      Math.max(0, Math.round(Number(mailboxRoomState.reviewCounts[key]) || 0)) +
      amount;
    added += amount;
  });
  if (added > 0) {
    mailboxRoomState.reviewRuns += added;
    updateEntanglementThreeRoomReviewToolbars();
  }
  return added > 0;
}

async function mailboxRoomCompleteRoomMeasurementControl(
  runtime,
  control,
  options = {},
) {
  if (!mailboxRoomIsJoined() || !runtime?.item || !control?.id) {
    return null;
  }
  const completionKey = mailboxRoomControlCompletionKey(control);
  if (!options.complete && mailboxRoomCompletedMeasurementControlIds.has(completionKey)) {
    return null;
  }
  mailboxRoomCompletedMeasurementControlIds.add(completionKey);
  const measurementId = mailboxRoomMeasurementSharedId(
    runtime,
    runtime.registerQubitCount,
  );
  const payload = await localLabRequest(
    mailboxRoomMeasurementControlCompletionPath(measurementId),
    {
      method: "POST",
      body: {
        controlId: control.id,
        participantId: mailboxRoomState.participantId || null,
        complete: options.complete === true,
      },
    },
  );
  const measurement = payload.measurement || null;
  mailboxRoomApplyRoomMeasurement(measurement);
  return measurement;
}

async function runMailboxRoomBatchRecordedExperiment(
  canvas,
  runtime,
  measurement,
  control,
) {
  const state = generatedExperimentStateForCanvas(canvas);
  if (!runtime?.item || layoutEditorState.enabled) {
    return false;
  }
  const iterations = generatedExperimentReplayIterations(control);
  const experiment = mailboxRoomRecordedExperimentForMeasurement(measurement);
  let counts = mailboxRoomRecordedMeasurementCounts(
    experiment,
    iterations,
    measurement,
  );
  if (!counts) {
    const outcomeKey = mailboxRoomDirectReplayOutcomeKey(measurement, control);
    counts = outcomeKey ? { [outcomeKey]: iterations } : null;
  }
  if (!counts) {
    return false;
  }
  const shouldMarkPlaying = state && !state.playing;
  if (shouldMarkPlaying) {
    state.playing = true;
    updateGeneratedExperimentToolbar(canvas);
  }
  try {
    await mailboxRoomAddBatchMeasurementCounts(
      runtime,
      counts,
      control,
    );
    return true;
  } finally {
    if (shouldMarkPlaying) {
      state.playing = false;
      updateGeneratedExperimentToolbar(canvas);
    }
  }
}

async function runMailboxRoomRecordedExperimentForControl(
  canvas,
  runtime,
  measurement,
  control,
) {
  if (!canvas || !runtime || !control?.id) {
    return false;
  }
  const iterations = generatedExperimentReplayIterations(control);
  const requester = control.requestedBy || "";
  const isRequester = requester && requester === mailboxRoomState.participantId;
  updateMailboxRoomExperimentProgressOverlay();
  try {
    if (!isRequester) {
      return false;
    }
    return await runMailboxRoomBatchRecordedExperiment(
      canvas,
      runtime,
      measurement,
      control,
    );
  } finally {
    if (isRequester) {
      await mailboxRoomCompleteRoomMeasurementControl(runtime, control, {
        complete: true,
      }).catch(() => null);
    }
    updateMailboxRoomExperimentProgressOverlay();
  }
}

function mailboxRoomMeasurementRuntimeById(measurementId) {
  if (!measurementId) {
    return null;
  }
  for (const [item, runtime] of generatedSeparatedPairMeasurementRuntimes) {
    const currentRuntime =
      runtime || initializeGeneratedSeparatedPairMeasurementItem(item);
    if (
      item instanceof HTMLElement &&
      item.isConnected &&
      (item.dataset.generatedItemId === measurementId ||
        mailboxRoomMeasurementSharedId(currentRuntime) === measurementId)
    ) {
      return currentRuntime;
    }
  }
  const escapedId =
    typeof CSS !== "undefined" && typeof CSS.escape === "function"
      ? CSS.escape(measurementId)
      : String(measurementId).replace(/"/g, '\\"');
  const item = document.querySelector(
    `[data-generated-item-id="${escapedId}"]`,
  );
  return initializeGeneratedSeparatedPairMeasurementItem(item);
}

function mailboxRoomMeasurementVersion(measurement) {
  return Math.max(0, Math.round(Number(measurement?.version) || 0));
}

function mailboxRoomMeasurementIsStale(measurement) {
  if (!measurement?.id) {
    return true;
  }
  const version = mailboxRoomMeasurementVersion(measurement);
  const latest = Math.max(
    0,
    Number(mailboxRoomAppliedMeasurementVersions.get(measurement.id)) || 0,
  );
  return version > 0 && latest > 0 && version < latest;
}

function mailboxRoomRememberMeasurementVersion(measurement) {
  if (!measurement?.id) {
    return;
  }
  const version = mailboxRoomMeasurementVersion(measurement);
  if (version <= 0) {
    return;
  }
  const latest = Math.max(
    0,
    Number(mailboxRoomAppliedMeasurementVersions.get(measurement.id)) || 0,
  );
  if (version >= latest) {
    mailboxRoomAppliedMeasurementVersions.set(measurement.id, version);
  }
}

function mailboxRoomStoreRoomMeasurement(measurement) {
  if (!measurement?.id || mailboxRoomMeasurementIsStale(measurement)) {
    return false;
  }
  mailboxRoomRememberMeasurementVersion(measurement);
  const measurements = Array.isArray(mailboxRoomState.measurements)
    ? mailboxRoomState.measurements.slice()
    : [];
  const index = measurements.findIndex((entry) => entry?.id === measurement.id);
  if (index >= 0) {
    measurements[index] = measurement;
  } else {
    measurements.push(measurement);
  }
  mailboxRoomState.measurements = measurements;
  return true;
}

function mailboxRoomMergeRoomMeasurements(measurements) {
  const existing = new Map(
    (Array.isArray(mailboxRoomState.measurements)
      ? mailboxRoomState.measurements
      : []
    )
      .filter((measurement) => measurement?.id)
      .map((measurement) => [measurement.id, measurement]),
  );
  (Array.isArray(measurements) ? measurements : []).forEach((measurement) => {
    if (!measurement?.id || mailboxRoomMeasurementIsStale(measurement)) {
      return;
    }
    const current = existing.get(measurement.id);
    if (
      !current ||
      mailboxRoomMeasurementVersion(measurement) >=
        mailboxRoomMeasurementVersion(current)
    ) {
      existing.set(measurement.id, measurement);
    }
  });
  return Array.from(existing.values());
}

function maybeRunRoomMeasurementControl(measurement, runtime) {
  const control = measurement?.control;
  if (!control?.id || mailboxRoomSeenSharedMeasurementControlIds.has(control.id)) {
    return false;
  }
  if (mailboxRoomControlIsComplete(control)) {
    mailboxRoomSeenSharedMeasurementControlIds.add(control.id);
    updateMailboxRoomExperimentProgressOverlay();
    return false;
  }
  if (control.requestedBy && control.requestedBy === mailboxRoomState.participantId) {
    mailboxRoomSeenSharedMeasurementControlIds.add(control.id);
    return false;
  }
  const canvas = generatedCanvasForItem(runtime?.item);
  if (!runtime || !canvas || layoutEditorState.enabled) {
    return false;
  }
  mailboxRoomSeenSharedMeasurementControlIds.add(control.id);
  const iterations = generatedExperimentReplayIterations(control);
  if (control.type === GENERATED_EXPERIMENT_COUNT_ACTION) {
    setMeasurementSelectValue(runtime.measurementCount, iterations);
    clearGeneratedSeparatedPairMeasurementApparatus(runtime);
  }
  const startDelay = Math.max(0, Math.round(Number(control.startAt) - Date.now()));
  window.setTimeout(() => {
    runMailboxRoomRecordedExperimentForControl(
      canvas,
      runtime,
      measurement,
      control,
    ).catch(() => {});
  }, startDelay);
  return true;
}

function mailboxRoomApplyRoomMeasurement(measurement) {
  if (!measurement?.id) {
    return false;
  }
  if (!mailboxRoomStoreRoomMeasurement(measurement)) {
    return false;
  }
  const numQubits = Math.max(
    2,
    Math.min(4, Number(measurement.numQubits) || 4),
  );
  const runtime = reconfigureGeneratedSeparatedMeasurementRuntimeForRegister(
    mailboxRoomMeasurementRuntimeById(measurement.id),
    numQubits,
  );
  if (!runtime) {
    return false;
  }
  const canvas = generatedCanvasForItem(runtime.item);
  const pendingStartPoint =
    generatedCanvasPointForElementCenter(
      canvas,
      runtime.magnifiers?.[0]?.measureLens || runtime.item,
    ) || { x: 0, y: 0 };
  (runtime.outcomeKeys || registerMeasurementOutcomeKeys(numQubits)).forEach(
    (key) => {
      runtime.tubeCounts[key] = Math.max(
        0,
        Math.round(Number(measurement.counts?.[key]) || 0),
      );
    },
  );
  runtime.pendingMeasurements = Object.entries(measurement.pending || {}).map(
    ([index, entry], sequence) => ({
      qubitId: `room-${measurement.id}-${index}`,
      logicalQubitId: entry?.logicalQubitId || null,
      color: entry?.color === "red" ? "red" : "blue",
      orderIndex: Number(index),
      sequence,
      startPoint: pendingStartPoint,
    }),
  );
  maybeExpandGeneratedDoubleMeasurementTubeCapacity(runtime);
  updateGeneratedDoubleMeasurementTubeFills(runtime);
  mailboxRoomApplyRecordedExperiment(measurement, runtime);
  if (
    measurement.completionId &&
    !mailboxRoomSeenSharedMeasurementCompletionIds.has(measurement.completionId)
  ) {
    mailboxRoomSeenSharedMeasurementCompletionIds.add(measurement.completionId);
    logGeneratedMeasurementProgress(runtime, {
      event: "room-complete",
      measuredSoFar: numQubits,
      requiredCount: numQubits,
      outcomeKey: measurement.lastOutcomeKey || null,
    });
    finishGeneratedExperimentRecordingAfterMeasurement(
      generatedCanvasForItem(runtime.item),
      { forceStop: numQubits > 2 },
    );
    mailboxRoomApplyRecordedExperiment(measurement, runtime);
  }
  maybeRunRoomMeasurementControl(measurement, runtime);
  updateEntanglementThreeRoomReviewToolbars();
  return true;
}

function mailboxRoomApplyRoomMeasurements(measurements) {
  (Array.isArray(measurements) ? measurements : []).forEach((measurement) => {
    mailboxRoomApplyRoomMeasurement(measurement);
  });
  updateMailboxRoomExperimentProgressOverlay();
}

async function mailboxRoomRecordRoomMeasurement(runtime, measurementEntry) {
  if (!mailboxRoomIsJoined() || !runtime?.item) {
    return null;
  }
  const numQubits = Math.max(
    2,
    Math.min(4, Number(runtime.registerQubitCount) || 4),
  );
  const measurementId = mailboxRoomMeasurementSharedId(runtime, numQubits);
  const qubitIndex = clamp(
    Math.round(Number(measurementEntry?.orderIndex) || 0),
    0,
    Math.max(0, numQubits - 1),
  );
  const payload = await localLabRequest(
    mailboxRoomMeasurementPath(measurementId),
    {
      method: "POST",
      body: {
        numQubits,
        qubitIndex,
        color: measurementEntry?.color === "red" ? "red" : "blue",
        logicalQubitId: measurementEntry?.logicalQubitId || null,
        participantId: mailboxRoomState.participantId || null,
        experiment: mailboxRoomRecordedExperimentForRuntime(runtime),
      },
    },
  );
  const measurement = payload.measurement || null;
  logGeneratedMeasurementProgress(runtime, {
    event: "room-post",
    measurementId,
    qubitId: measurementEntry?.qubitId || null,
    logicalQubitId: measurementEntry?.logicalQubitId || null,
    color: measurementEntry?.color || null,
    orderIndex: qubitIndex,
    measuredSoFar: Object.keys(measurement?.pending || {}).length,
    requiredCount: numQubits,
  });
  mailboxRoomApplyRoomMeasurement(measurement);
  return measurement;
}

async function mailboxRoomPublishRoomMeasurementControl(
  runtime,
  type,
  iterations,
) {
  if (!mailboxRoomIsJoined() || !runtime?.item) {
    return null;
  }
  const numQubits = Math.max(
    2,
    Math.min(
      4,
      Number(runtime.registerQubitCount) ||
        registerMeasurementQubitCountForItem(runtime.item),
    ),
  );
  if (numQubits <= 2) {
    return null;
  }
  const measurementId = mailboxRoomMeasurementSharedId(runtime, numQubits);
  const controlId = mailboxRoomSharedMeasurementControlId(type);
  const startAt = Date.now() + MAILBOX_ROOM_POLL_MS + 750;
  mailboxRoomSeenSharedMeasurementControlIds.add(controlId);
  const payload = await localLabRequest(
    mailboxRoomMeasurementControlPath(measurementId),
    {
      method: "POST",
      body: {
        id: controlId,
        type,
        iterations: generatedExperimentReplayIterations({ iterations }),
        participantId: mailboxRoomState.participantId || null,
        startAt,
      },
    },
  );
  const measurement = payload.measurement || null;
  mailboxRoomApplyRoomMeasurement(measurement);
  return measurement;
}

function mailboxRoomSharedSnapshotForMeasurement(pairState, latest, metadata) {
  const numQubits = registerStateNumQubits(pairState || latest);
  return {
    numQubits,
    amplitudes: normalizeTourRegisterAmplitudes(
      numQubits,
      pairState?.amplitudes || latest?.amplitudes || [],
    ),
    displayMode: pairState?.displayMode || latest?.displayMode || "marginal",
    linkRelation:
      numQubits === 2
        ? pairState?.linkRelation || latest?.linkRelation || null
        : null,
    status: "active",
    memberVectors: null,
    members: Array.isArray(latest?.members)
      ? latest.members
      : registerMembersForRemoteSnapshot(pairState),
    metadata,
    updatedBy: mailboxRoomState.participantId,
  };
}

async function mailboxRoomRecordSharedRegisterMeasurement(
  pairState,
  measurementEntry,
) {
  const sharedId = pairState?.remoteEntanglementId;
  if (!sharedId || !mailboxRoomIsJoined()) {
    return null;
  }
  let latest = await mailboxRoomRefreshSharedEntanglement(sharedId, {
    apply: false,
  });
  if (!latest) {
    return null;
  }
  for (let attempt = 0; attempt < 2; attempt += 1) {
    const { measurement, completed, outcomeKey } =
      mailboxRoomMergeSharedMeasurement(latest, measurementEntry);
    const metadata = mailboxRoomMetadataWithMeasurement(latest, measurement);
    try {
      const payload = await localLabRequest(
        mailboxRoomSharedEntanglementPath(sharedId),
        {
          method: "PUT",
          body: {
            ...mailboxRoomSharedSnapshotForMeasurement(
              pairState,
              latest,
              metadata,
            ),
            expectedVersion: latest.version,
          },
        },
      );
      const sharedEntanglement = payload.sharedEntanglement || null;
      if (sharedEntanglement) {
        pairState.remoteVersion = sharedEntanglement.version;
        pairState.remoteMetadata =
          sharedEntanglement.metadata &&
          typeof sharedEntanglement.metadata === "object"
            ? { ...sharedEntanglement.metadata }
            : {};
      }
      mailboxRoomApplySharedEntanglement(sharedEntanglement);
      return { sharedEntanglement, completed, outcomeKey };
    } catch (error) {
      if (!/version conflict|shared_entanglement_version_conflict/i.test(error.message || "")) {
        throw error;
      }
      latest = await mailboxRoomRefreshSharedEntanglement(sharedId, {
        apply: false,
      });
    }
  }
  return null;
}

async function mailboxRoomEnsureSharedEntanglement(
  qubitItem,
  qubitState,
  { toParticipantId = "" } = {},
) {
  const pairState = qubitState?.pairState;
  if (!pairState || !Number.isFinite(qubitState.pairQubitIndex)) {
    return null;
  }
  if (pairState.remoteEntanglementId) {
    const numQubits = registerStateNumQubits(pairState);
    return {
      id: pairState.remoteEntanglementId,
      numQubits,
      amplitudes: normalizeTourRegisterAmplitudes(
        numQubits,
        pairState.amplitudes,
      ),
      displayMode: pairState.displayMode,
      linkRelation: numQubits === 2 ? pairState.linkRelation || null : null,
      status: "active",
      version: pairState.remoteVersion,
      members: registerMembersForRemoteSnapshot(pairState),
    };
  }
  const numQubits = registerStateNumQubits(pairState);
  const payload = await localLabRequest(mailboxRoomSharedEntanglementPath(), {
    method: "POST",
    body: {
      numQubits,
      amplitudes: normalizeTourRegisterAmplitudes(
        numQubits,
        pairState.amplitudes,
      ),
      displayMode: pairState.displayMode,
      linkRelation: numQubits === 2 ? pairState.linkRelation || null : null,
      members: [
        {
          participantId: mailboxRoomState.participantId,
          qubitIndex: qubitState.pairQubitIndex === 0 ? 1 : 0,
          role: "retained",
        },
        {
          participantId: toParticipantId || null,
          qubitIndex: qubitState.pairQubitIndex,
          role: "sent",
        },
      ],
      metadata: {
        source: "room-mailbox",
        sourceQubitLabel: mailboxRoomQubitLabel({
          qubitItem,
          qubitIndex: qubitState.pairQubitIndex,
        }),
      },
    },
  });
  const sharedEntanglement = payload.sharedEntanglement;
  if (!sharedEntanglement?.id) {
    throw new Error("Backend did not create shared entanglement");
  }
  pairState.remoteEntanglementId = sharedEntanglement.id;
  pairState.remoteVersion = sharedEntanglement.version;
  pairState.remoteMembers = Array.isArray(sharedEntanglement.members)
    ? sharedEntanglement.members.map((member) => ({ ...member }))
    : registerMembersForRemoteSnapshot(pairState);
  pairState.members?.forEach((member) => {
    if (member.item instanceof HTMLElement) {
      mailboxRoomSetRemoteEntanglementVisual(
        member.item,
        sharedEntanglement.id,
      );
    }
  });
  return sharedEntanglement;
}

function mailboxRoomBindReceivedSharedEntanglement(
  item,
  state,
  descriptor,
) {
  if (!descriptor?.id || !Number.isFinite(descriptor.qubitIndex)) {
    return;
  }
  const numQubits = inferRegisterQubitCountFromAmplitudes(
    descriptor.amplitudes || [],
    Number.isInteger(descriptor.numQubits) ? descriptor.numQubits : 2,
  );
  const qubitIndex = clamp(
    descriptor.qubitIndex,
    0,
    Math.max(0, numQubits - 1),
  );
  const pairState = {
    numQubits,
    amplitudes: normalizeTourRegisterAmplitudes(
      numQubits,
      descriptor.amplitudes || [],
    ),
    displayMode: descriptor.displayMode || "marginal",
    members: [
      {
        item,
        state,
        qubitIndex,
      },
    ],
    remoteMembers: Array.isArray(descriptor.members)
      ? descriptor.members.map((member) => ({ ...member }))
      : [],
    remoteEntanglementId: descriptor.id,
    remoteVersion: descriptor.version,
  };
  if (descriptor.linkRelation) {
    pairState.linkRelation = descriptor.linkRelation;
  }
  state.pairState = pairState;
  state.pairQubitIndex = qubitIndex;
  state.vector = displayVectorForPairMember(pairState, state.pairQubitIndex);
  if (!roomQubitIdentityForItem(item)) {
    setQubitRoomIdentity(item, qubitIndex, {
      roomId: descriptor.roomQubit?.roomId || mailboxRoomState.roomId,
      qubitId: descriptor.roomQubit?.qubitId,
    });
  }
  mailboxRoomSetRemoteEntanglementVisual(item, descriptor.id);
  applyGeneratedQubitVectorVisualState(item);
  mailboxRoomApplySharedEntanglement({
    id: descriptor.id,
    numQubits,
    amplitudes: pairState.amplitudes,
    displayMode: pairState.displayMode,
    linkRelation: pairState.linkRelation || null,
    status: "active",
    members: pairState.remoteMembers,
    version: pairState.remoteVersion,
  });
}

async function mailboxRoomSerializeQubit(
  context = activeMailboxSendContext,
  { toParticipantId = "" } = {},
) {
  const qubitItem = context?.qubitItem;
  if (!(qubitItem instanceof HTMLElement)) {
    return null;
  }
  let vector = null;
  let paired = false;
  let entanglement = null;
  if (isGeneratedQubitItem(qubitItem)) {
    const state = ensureGeneratedQubitRuntimeState(qubitItem);
    vector = Array.isArray(state?.vector) ? normalizeVector2(state.vector) : null;
    paired = Boolean(state?.pairState);
    if (paired) {
      const sharedEntanglement = await mailboxRoomEnsureSharedEntanglement(
        qubitItem,
        state,
        { toParticipantId },
      );
      if (sharedEntanglement) {
        entanglement = {
          id: sharedEntanglement.id,
          numQubits:
            sharedEntanglement.numQubits ||
            registerStateNumQubits(state.pairState),
          qubitIndex: state.pairQubitIndex,
          amplitudes: normalizeTourRegisterAmplitudes(
            sharedEntanglement.numQubits ||
              registerStateNumQubits(state.pairState),
            state.pairState.amplitudes || sharedEntanglement.amplitudes || [],
          ),
          displayMode:
            state.pairState.displayMode ||
            sharedEntanglement.displayMode ||
            "marginal",
          linkRelation:
            state.pairState.linkRelation ||
            sharedEntanglement.linkRelation ||
            null,
          version:
            state.pairState.remoteVersion || sharedEntanglement.version,
          roomQubit: roomQubitIdentityForItem(qubitItem),
          members:
            sharedEntanglement.members ||
            registerMembersForRemoteSnapshot(state.pairState),
        };
      }
    }
  } else {
    try {
      const parsed = JSON.parse(qubitItem.dataset.initialVector || "null");
      vector = Array.isArray(parsed) ? normalizeVector2(parsed) : null;
    } catch (_error) {
      vector = null;
    }
  }
  return {
    kind: "single-qubit",
    version: 1,
    vector: vector || [1, 0],
    sourceQubitLabel: mailboxRoomQubitLabel(context),
    roomQubit: roomQubitIdentityForItem(qubitItem),
    paired,
    entanglement,
  };
}

function mailboxRoomTransferIsForThisParticipant(payload = {}) {
  return (
    !payload.toParticipantId ||
    payload.toParticipantId === mailboxRoomState.participantId
  );
}

function mailboxLocalRoomEvents() {
  try {
    const parsed = JSON.parse(
      window.localStorage.getItem(MAILBOX_LOCAL_ROOM_EVENTS_STORAGE_KEY) || "[]",
    );
    return Array.isArray(parsed) ? parsed : [];
  } catch (_error) {
    return [];
  }
}

function mailboxRoomLocalTransferForQubit(context) {
  const qubitItem = context?.qubitItem;
  const state = isGeneratedQubitItem(qubitItem)
    ? ensureGeneratedQubitRuntimeState(qubitItem)
    : null;
  let vector = Array.isArray(state?.vector) ? normalizeVector2(state.vector) : null;
  if (!vector && qubitItem instanceof HTMLElement) {
    try {
      vector = normalizeVector2(
        JSON.parse(qubitItem.dataset.initialVector || "null"),
      );
    } catch (_error) {
      vector = null;
    }
  }
  return {
    kind: "single-qubit",
    version: 1,
    vector: vector || [1, 0],
    sourceQubitLabel: mailboxRoomQubitLabel(context),
    roomQubit: roomQubitIdentityForItem(qubitItem),
    paired: false,
    entanglement: null,
  };
}

function mailboxRoomStoreLocalTransfer(context) {
  const event = {
    id: `local-mailbox-${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`,
    type: "roomMailbox.sent",
    at: new Date().toISOString(),
    payload: {
      fromParticipantId: entanglementThreeWindowId,
      fromName: mailboxRoomState.displayName || "Other tab",
      qubitLabel: mailboxRoomQubitLabel(context),
      localSenderWindowId: entanglementThreeWindowId,
      transfer: mailboxRoomLocalTransferForQubit(context),
    },
  };
  const events = mailboxLocalRoomEvents();
  events.push(event);
  window.localStorage.setItem(
    MAILBOX_LOCAL_ROOM_EVENTS_STORAGE_KEY,
    JSON.stringify(events.slice(-60)),
  );
  return event;
}

function mailboxRoomReceivePendingLocalQubits() {
  const canvas = entanglementThreeCanvasForTab();
  if (!(canvas instanceof HTMLElement)) {
    return [];
  }
  const received = [];
  mailboxLocalRoomEvents().forEach((event) => {
    if (
      event?.payload?.localSenderWindowId === entanglementThreeWindowId ||
      mailboxRoomTransferReceived(event?.id)
    ) {
      return;
    }
    try {
      const item = mailboxRoomReceiveQubitEvent(event, { canvas });
      if (item instanceof HTMLElement) {
        received.push(item);
      }
    } catch (error) {
      console.warn?.("[Qubit Lab] local mailbox receive failed", error);
    }
  });
  if (received.length) {
    const mailbox = canvas.querySelector(
      ':scope > .playground-node[data-component="mailbox"]',
    );
    if (mailbox instanceof HTMLElement) {
      setMailboxComponentStatus(
        mailbox,
        `Received ${received.length === 1 ? "a qubit" : `${received.length} qubits`} from another tab`,
      );
    }
  }
  return received;
}

function mailboxRoomReceivedTransferIds() {
  const stored = readMailboxRoomStorage();
  return Array.isArray(stored.receivedTransfers)
    ? new Set(stored.receivedTransfers)
    : new Set();
}

function mailboxRoomMarkTransferReceived(eventId) {
  if (!eventId) {
    return;
  }
  const received = mailboxRoomReceivedTransferIds();
  received.add(eventId);
  writeMailboxRoomStorage({
    receivedTransfers: Array.from(received).slice(-200),
  });
}

function mailboxRoomTransferReceived(eventId) {
  return mailboxRoomReceivedTransferIds().has(eventId);
}

function mailboxRoomClaimBackendNotification(eventId) {
  if (
    !eventId ||
    eventId.startsWith("local-mailbox-") ||
    !mailboxRoomIsJoined()
  ) {
    return;
  }
  localLabRequest(
    `/rooms/${encodeURIComponent(mailboxRoomState.roomId)}/mailbox-notifications/${encodeURIComponent(eventId)}/claim`,
    {
      method: "POST",
      body: { participantId: mailboxRoomState.participantId },
    },
  ).catch((error) => {
    console.warn?.("[Qubit Lab] mailbox claim failed", error);
  });
}

function mailboxRoomReceivedItemForEvent(canvas, eventId) {
  if (!(canvas instanceof HTMLElement) || !eventId) {
    return null;
  }
  const tracked = mailboxRoomReceivedEventItems.get(eventId);
  if (tracked instanceof HTMLElement && tracked.isConnected) {
    return tracked;
  }
  const selector = `[data-mailbox-received-event-id="${CSS.escape(eventId)}"]`;
  const existing = canvas.querySelector(selector);
  if (existing instanceof HTMLElement) {
    mailboxRoomReceivedEventItems.set(eventId, existing);
    return existing;
  }
  mailboxRoomReceivedEventItems.delete(eventId);
  return null;
}

function mailboxRoomImportTargetCanvas() {
  return activeGeneratedLayoutCanvas();
}

function mailboxRoomImportMailboxWindow(canvas) {
  if (!canvas) {
    return null;
  }
  const contextMailbox = activeMailboxSendContext?.mailboxItem;
  if (
    contextMailbox instanceof HTMLElement &&
    contextMailbox.closest(".generated-layout-canvas") === canvas
  ) {
    const contextWindow = contextMailbox.querySelector(
      '[data-role="mailbox-window"]',
    );
    if (contextWindow instanceof HTMLElement) {
      return contextWindow;
    }
  }
  const mailboxWindow = canvas.querySelector(
    ':scope > .playground-node[data-component="mailbox"] [data-role="mailbox-window"]',
  );
  return mailboxWindow instanceof HTMLElement ? mailboxWindow : null;
}

function mailboxRoomLandingOffset(roomQubitIndex) {
  const offsets = [-36, 36, -72, 72];
  return offsets[normalizeRoomQubitIndex(roomQubitIndex)] || 0;
}

function mailboxRoomImportPoint(canvas, roomQubitIndex = null) {
  if (!canvas) {
    return { x: 66, y: 66 };
  }
  const mailboxWindow = mailboxRoomImportMailboxWindow(canvas);
  const mailboxItem = mailboxWindow?.closest?.(
    '.playground-node[data-component="mailbox"]',
  );
  const mailboxBounds =
    mailboxItem instanceof HTMLElement
      ? generatedCanvasBoundsForElement(canvas, mailboxItem)
      : null;
  if (mailboxWindow && mailboxBounds) {
    const origin = generatedCanvasPointForElementCenter(canvas, mailboxWindow);
    const qubitRadius = 36;
    const mailboxGap = 22;
    const offset = qubitRadius + mailboxGap;
    const landingY = origin.y + mailboxRoomLandingOffset(roomQubitIndex);
    const candidates = [
      { x: mailboxBounds.right + offset, y: landingY },
      { x: mailboxBounds.left - offset, y: landingY },
      { x: origin.x, y: mailboxBounds.bottom + offset },
      { x: origin.x, y: mailboxBounds.top - offset },
    ];
    const fits = (point) =>
      point.x >= qubitRadius &&
      point.x <= canvas.clientWidth - qubitRadius &&
      point.y >= qubitRadius &&
      point.y <= canvas.clientHeight - qubitRadius;
    return candidates.find(fits) || {
      x: clamp(candidates[0].x, qubitRadius, canvas.clientWidth - qubitRadius),
      y: clamp(candidates[0].y, qubitRadius, canvas.clientHeight - qubitRadius),
    };
  }
  return {
    x: canvas.scrollLeft + Math.max(66, Math.round(canvas.clientWidth / 2)),
    y: canvas.scrollTop + Math.max(66, Math.round(canvas.clientHeight / 2)),
  };
}

function mailboxRoomReceiveQubitEvent(event, options = {}) {
  const payload = event?.payload || {};
  const transfer = payload.transfer;
  const eventId = event?.id || "";
  if (!transfer || transfer.kind !== "single-qubit") {
    throw new Error("No transferable qubit payload");
  }
  if (!mailboxRoomTransferIsForThisParticipant(payload)) {
    throw new Error("This qubit was addressed to someone else");
  }
  const canvas =
    options.canvas instanceof HTMLElement
      ? options.canvas
      : mailboxRoomImportTargetCanvas();
  if (!canvas) {
    throw new Error("Open a tour tab before receiving the qubit");
  }
  const existingItem = mailboxRoomReceivedItemForEvent(canvas, eventId);
  if (existingItem) {
    return existingItem;
  }
  if (
    eventId &&
    (mailboxRoomTransferReceived(eventId) ||
      mailboxRoomReceivingEventIds.has(eventId))
  ) {
    return mailboxRoomReceivedItemForEvent(canvas, eventId);
  }
  if (eventId) {
    mailboxRoomReceivingEventIds.add(eventId);
    mailboxRoomMarkTransferReceived(eventId);
  }
  try {
    const mailboxWindow = mailboxRoomImportMailboxWindow(canvas);
    const origin = mailboxWindow
      ? generatedCanvasPointForElementCenter(canvas, mailboxWindow)
      : mailboxRoomImportPoint(canvas);
    const destination = mailboxRoomImportPoint(
      canvas,
      transfer.roomQubit?.roomQubitIndex,
    );
    const maxZ = Array.from(
      canvas.querySelectorAll(":scope > .playground-node"),
    ).reduce(
      (highest, candidate) =>
        Math.max(highest, parseLayoutNumeric(candidate.style.zIndex, 1)),
      1,
    );
    const item = createGeneratedLayoutItemNode("qubit", {
      left: origin.x - 36,
      top: origin.y - 36,
      width: 72,
      height: 72,
      z: maxZ + 1,
      vector: Array.isArray(transfer.vector) ? transfer.vector : [1, 0],
    });
    item.dataset.mailboxReceivedEventId = eventId;
    item.dataset.mailboxReceivedFrom = payload.fromName || "";
    if (eventId) {
      mailboxRoomReceivedEventItems.set(eventId, item);
    }
    item.classList.add("mailbox-arriving");
    canvas.appendChild(item);
    prepareGeneratedLayoutCanvas(canvas);
    applyRoomQubitIdentity(item, transfer.roomQubit);
    const itemState = ensureGeneratedQubitRuntimeState(item);
    if (transfer.entanglement && itemState) {
      mailboxRoomBindReceivedSharedEntanglement(
        item,
        itemState,
        transfer.entanglement,
      );
    }
    setGeneratedQubitCenter(canvas, item, origin.x, origin.y);
    window.requestAnimationFrame(() => {
      item.classList.add("mailbox-arriving-visible");
      window.setTimeout(() => {
        setGeneratedQubitCenter(canvas, item, destination.x, destination.y);
        window.setTimeout(() => {
          item.classList.remove(
            "mailbox-arriving",
            "mailbox-arriving-visible",
          );
        }, 650);
      }, 200);
    });
    mailboxRoomClaimBackendNotification(eventId);
    return item;
  } catch (error) {
    if (eventId) {
      mailboxRoomReceivedEventItems.delete(eventId);
      const received = mailboxRoomReceivedTransferIds();
      received.delete(eventId);
      writeMailboxRoomStorage({
        receivedTransfers: Array.from(received).slice(-200),
      });
    }
    throw error;
  } finally {
    if (eventId) {
      mailboxRoomReceivingEventIds.delete(eventId);
    }
  }
}

function mailboxRoomPendingReceiveCanvas() {
  const contextCanvas = mailboxRoomCanvasForCurrentContext();
  if (contextCanvas instanceof HTMLElement) {
    return contextCanvas;
  }
  const entanglementCanvas = entanglementThreeCanvasForTab();
  if (entanglementCanvas instanceof HTMLElement) {
    return entanglementCanvas;
  }
  return activeGeneratedLayoutCanvas();
}

function mailboxRoomReceivePendingQubits() {
  const receiveCanvas = mailboxRoomPendingReceiveCanvas();
  if (!(receiveCanvas instanceof HTMLElement)) {
    return [];
  }
  const received = [];
  mailboxRoomVisibleEvents().forEach((event) => {
    const payload = event?.payload || {};
    if (
      event?.type !== "roomMailbox.sent" ||
      !payload.transfer ||
      payload.fromParticipantId === mailboxRoomState.participantId ||
      !mailboxRoomTransferIsForThisParticipant(payload) ||
      mailboxRoomTransferReceived(event.id)
    ) {
      return;
    }
    received.push({
      event,
      item: mailboxRoomReceiveQubitEvent(event, { canvas: receiveCanvas }),
    });
  });
  if (received.length) {
    const latest = received.at(-1).event.payload || {};
    const countLabel =
      received.length === 1
        ? latest.qubitLabel || "qubit"
        : `${received.length} qubits`;
    const senderLabel =
      received.length === 1 && latest.fromName ? ` from ${latest.fromName}` : "";
    const message = `Received ${countLabel}${senderLabel}`;
    const statusMailbox =
      activeMailboxSendContext?.mailboxItem ||
      receiveCanvas.querySelector(
        ':scope > .playground-node[data-component="mailbox"]',
      );
    if (statusMailbox instanceof HTMLElement) {
      setMailboxComponentStatus(statusMailbox, message);
    }
    if (mailboxSendDialog?.status instanceof HTMLElement) {
      mailboxSendDialog.status.textContent = message;
    }
  }
  return received;
}

function mailboxRoomIsJoined() {
  return Boolean(
    mailboxRoomState.joined &&
      mailboxRoomState.roomId &&
      mailboxRoomState.participantId,
  );
}

function mailboxRoomActiveParticipants() {
  const now = Date.now();
  return mailboxRoomState.participants.filter((participant) => {
    if (participant.id === mailboxRoomState.participantId) {
      return true;
    }
    const updatedAt = Date.parse(participant.updatedAt || "");
    return Number.isFinite(updatedAt) && now - updatedAt <= MAILBOX_ROOM_ACTIVE_MS;
  });
}

function mailboxRoomVisibleEvents() {
  return mailboxRoomState.events
    .filter(
      (event) =>
        event?.type === "room.message" ||
        event?.type === "roomMailbox.sent" ||
        event?.type === "room.reset",
    )
    .slice(-60);
}

function mailboxRoomParticipantName(participantId) {
  if (!participantId) {
    return "";
  }
  return (
    mailboxRoomState.participants.find(
      (participant) => participant.id === participantId,
    )?.displayName || participantId
  );
}

function isEntanglementThreeCanvas(canvas) {
  if (!isGeneratedLayoutCanvas(canvas)) {
    return false;
  }
  const tabId = storageIdentifierKey(canvas.dataset.generatedTabId || "");
  if (
    tabId === "custom-entanglement-3" ||
    tabId === "editor-entanglement-3"
  ) {
    return true;
  }
  const entry = generatedTabEntryForCanvas(canvas);
  if (storageLabelKey(entry?.label) === "entanglement 3") {
    return true;
  }
  const panelId = storageIdentifierKey(canvas.closest("[id]")?.id || "");
  return panelId.endsWith("entanglement-3");
}

function mailboxRoomMeasurementCounts() {
  const counts = {};
  (Array.isArray(mailboxRoomState.measurements)
    ? mailboxRoomState.measurements
    : []
  ).forEach((measurement) => {
    Object.entries(measurement?.counts || {}).forEach(([key, value]) => {
      counts[key] =
        Math.max(0, Math.round(Number(counts[key]) || 0)) +
        Math.max(0, Math.round(Number(value) || 0));
    });
  });
  Object.entries(mailboxRoomState.reviewCounts || {}).forEach(([key, value]) => {
    counts[key] =
      Math.max(0, Math.round(Number(counts[key]) || 0)) +
      Math.max(0, Math.round(Number(value) || 0));
  });
  return counts;
}

function mailboxRoomPrimaryOutcomeKey() {
  const completed = (Array.isArray(mailboxRoomState.measurements)
    ? mailboxRoomState.measurements
    : []
  ).find((measurement) => measurement?.lastOutcomeKey);
  if (completed?.lastOutcomeKey) {
    return completed.lastOutcomeKey;
  }
  const counts = mailboxRoomMeasurementCounts();
  const countedKey =
    Object.entries(counts).sort((left, right) => right[1] - left[1])[0]?.[0] ||
    "";
  if (countedKey) {
    return countedKey;
  }
  const eventColors = new Map();
  mailboxRoomState.events.forEach((event) => {
    if (event?.type !== "roomMeasurement.updated") {
      return;
    }
    const index = Number(event.payload?.qubitIndex);
    const color = event.payload?.color === "red" ? "red" : "blue";
    if (Number.isInteger(index) && index >= 0 && index < 4) {
      eventColors.set(index, color);
    }
  });
  if (eventColors.size >= 4) {
    return Array.from({ length: 4 }, (_item, index) =>
      eventColors.get(index) === "red" ? "r" : "b",
    ).join("");
  }
  return "";
}

function mailboxRoomMeasuredQubitCount() {
  const measurements = Array.isArray(mailboxRoomState.measurements)
    ? mailboxRoomState.measurements
    : [];
  const measuredIndexes = new Set();
  const completed = measurements.find(
    (measurement) =>
      Object.values(measurement?.counts || {}).some((count) => Number(count) > 0),
  );
  if (completed) {
    return Math.max(0, Math.min(4, Number(completed.numQubits) || 4));
  }
  measurements.forEach((measurement) => {
    Object.keys(measurement?.pending || {}).forEach((key) => {
      const index = Number(key);
      if (Number.isInteger(index) && index >= 0 && index < 4) {
        measuredIndexes.add(index);
      }
    });
  });
  mailboxRoomState.events.forEach((event) => {
    if (event?.type !== "roomMeasurement.updated") {
      return;
    }
    const index = Number(event.payload?.qubitIndex);
    if (Number.isInteger(index) && index >= 0 && index < 4) {
      measuredIndexes.add(index);
    }
  });
  return measuredIndexes.size;
}

function mailboxRoomActionElapsedLabel(event, firstAt) {
  const at = Date.parse(event?.at || "");
  const start = Date.parse(firstAt || "");
  if (!Number.isFinite(at) || !Number.isFinite(start)) {
    return "+0.0s";
  }
  return `+${Math.max(0, (at - start) / 1000).toFixed(1)}s`;
}

function mailboxRoomReviewActions() {
  const events = Array.isArray(mailboxRoomState.events)
    ? mailboxRoomState.events
    : [];
  const actionEvents = events.filter((event) =>
    [
      "participant.created",
      "room.action",
      "roomMailbox.sent",
      "roomMeasurement.updated",
    ].includes(event?.type),
  );
  const firstAt = actionEvents[0]?.at || "";
  return actionEvents
    .map((event) => {
      const payload = event.payload || {};
      const elapsed = mailboxRoomActionElapsedLabel(event, firstAt);
      if (event.type === "participant.created") {
        return `${elapsed} ${payload.displayName || mailboxRoomParticipantName(payload.participantId) || "Someone"} joined the room`;
      }
      if (event.type === "room.action" && payload.actionType === "gate-setting") {
        const actor = mailboxRoomParticipantName(payload.participantId) || "Someone";
        const gate = payload.gateLabel || "a flipper gate";
        const qubit = payload.qubitLabel ? ` for ${payload.qubitLabel}` : "";
        const tick = Number.isFinite(Number(payload.tickIndex))
          ? ` to B${payload.tickIndex}`
          : "";
        return `${elapsed} ${actor} changed ${gate}${qubit}${tick}`;
      }
      if (event.type === "roomMailbox.sent") {
        const actor =
          payload.fromName ||
          mailboxRoomParticipantName(payload.fromParticipantId) ||
          "Someone";
        const target =
          payload.toName ||
          mailboxRoomParticipantName(payload.toParticipantId) ||
          "the room";
        return `${elapsed} ${actor} sent ${payload.qubitLabel || "a qubit"} to ${target}`;
      }
      if (event.type === "roomMeasurement.updated") {
        const actor = mailboxRoomParticipantName(payload.participantId) || "Someone";
        const qubit = payload.logicalQubitId
          ? `q${Number(payload.logicalQubitId) - 1}`
          : Number.isInteger(Number(payload.qubitIndex))
            ? `q${payload.qubitIndex}`
            : "a qubit";
        const color = payload.color ? ` as ${payload.color}` : "";
        return `${elapsed} ${actor} measured ${qubit}${color}`;
      }
      return "";
    })
    .filter(Boolean);
}

function mailboxRoomReviewCountsText() {
  const counts = mailboxRoomMeasurementCounts();
  const entries = Object.entries(counts).filter((entry) => Number(entry[1]) > 0);
  if (!entries.length) {
    return "Counts 0";
  }
  return entries
    .sort((left, right) => left[0].localeCompare(right[0]))
    .map(([key, value]) => `${key}: ${value}`)
    .join("  ");
}

function incrementMailboxRoomReviewCount(amount) {
  const iterations = Math.max(1, Math.round(Number(amount) || 1));
  const measurement = (Array.isArray(mailboxRoomState.measurements)
    ? mailboxRoomState.measurements
    : []
  ).find((entry) => entry?.experiment || entry?.recordedExperiment);
  const experiment = mailboxRoomRecordedExperimentForMeasurement(measurement);
  const sampledCounts = mailboxRoomRecordedMeasurementCounts(
    experiment,
    iterations,
    measurement,
  );
  if (sampledCounts && mailboxRoomAddReviewCounts(sampledCounts)) {
    return true;
  }
  const outcomeKey = mailboxRoomPrimaryOutcomeKey();
  if (!outcomeKey) {
    return false;
  }
  mailboxRoomState.reviewCounts[outcomeKey] =
    Math.max(0, Math.round(Number(mailboxRoomState.reviewCounts[outcomeKey]) || 0)) +
    iterations;
  mailboxRoomState.reviewRuns += iterations;
  updateEntanglementThreeRoomReviewToolbars();
  return true;
}

function updateEntanglementThreeRoomReviewToolbars() {
  document
    .querySelectorAll(".generated-layout-canvas")
    .forEach((canvas) => {
      if (isEntanglementThreeCanvas(canvas)) {
        updateGeneratedExperimentToolbar(canvas);
      }
    });
}

function entanglementThreeCanvasForTab(tabTarget = "") {
  const panel =
    (tabTarget && document.getElementById(`panel-${tabTarget}`)) ||
    document.querySelector('[id^="panel-"]:not([hidden])');
  const canvas = panel?.querySelector?.(
    ".generated-layout-canvas:not(.doc-runtime-canvas):not(.doc-editor-canvas)",
  );
  return isEntanglementThreeCanvas(canvas) ? canvas : null;
}

function entanglementThreeStoredParticipantId() {
  const storage = readMailboxRoomStorage();
  if (storage.roomId !== ENTANGLEMENT_THREE_ROOM_ID) {
    return "";
  }
  return storage.participantId || "";
}

async function autoJoinEntanglementThreeRoom(canvas) {
  if (!(canvas instanceof HTMLElement)) {
    return false;
  }
  if (
    mailboxRoomIsJoined() &&
    mailboxRoomState.roomId === ENTANGLEMENT_THREE_ROOM_ID
  ) {
    mailboxRoomState.entanglementThreeBackendStatus = "joined";
    updateEntanglementThreeRoomReviewToolbars();
    return true;
  }
  if (mailboxRoomState.entanglementThreeJoinStarted) {
    return false;
  }
  mailboxRoomState.entanglementThreeJoinStarted = true;
  mailboxRoomState.entanglementThreeBackendStatus = "starting";
  updateEntanglementThreeRoomReviewToolbars();
  try {
    const clientSessionId = await entanglementThreeClientSessionId();
    const payload = await localLabRequest(
      `/rooms/${encodeURIComponent(ENTANGLEMENT_THREE_ROOM_ID)}/auto-join`,
      {
        method: "POST",
        body: {
          participantId: null,
          clientSessionId,
          clientBuildVersion: CONTENT_FILE_CACHE_BUST || null,
          label: ENTANGLEMENT_THREE_ROOM_ID,
          resetIfFull: true,
        },
      },
    );
    const participant = payload.participant || null;
    const room = payload.room || null;
    mailboxRoomState.joined = true;
    mailboxRoomState.roomId = room?.id || ENTANGLEMENT_THREE_ROOM_ID;
    mailboxRoomState.participantId = participant?.id || "";
    mailboxRoomState.participantJoinIndex =
      mailboxRoomState.participantId === "alice" ? 1 : 0;
    mailboxRoomState.displayName =
      participant?.displayName ||
      (mailboxRoomState.participantId === "alice" ? "Alice" : "Bob");
    mailboxRoomState.entanglementThreeBackendStatus = "joined";
    writeMailboxRoomStorage({
      roomId: mailboxRoomState.roomId,
      participantId: mailboxRoomState.participantId,
      displayName: mailboxRoomState.displayName,
      participants: {
        ...(readMailboxRoomStorage().participants || {}),
        [mailboxRoomStorageParticipantKey(
          mailboxRoomState.roomId,
          mailboxRoomState.displayName,
        )]: mailboxRoomState.participantId,
      },
    });
    await mailboxRoomAssignLocalQubitsForRoom(canvas);
    mailboxRoomStartPolling();
    await mailboxRoomRefresh({ render: false });
    ensureEntanglementThreeRoomExperimentRecording(canvas);
    updateEntanglementThreeRoomReviewToolbars();
    return true;
  } catch (error) {
    mailboxRoomState.entanglementThreeBackendStatus = "unavailable";
    console.warn?.("[Qubit Lab] Entanglement 3 backend unavailable", error);
    updateEntanglementThreeRoomReviewToolbars();
    return false;
  } finally {
    mailboxRoomState.entanglementThreeJoinStarted = false;
  }
}

function maybeAutoJoinEntanglementThreeRoom(tabTarget = "") {
  if (
    IS_STATIC_BUILD &&
    !localLabBackendUrlFromConfig() &&
    !localLabBackendUrlFromLocation()
  ) {
    return false;
  }
  const canvas = entanglementThreeCanvasForTab(tabTarget);
  if (!(canvas instanceof HTMLElement)) {
    return false;
  }
  autoJoinEntanglementThreeRoom(canvas).catch(() => {});
  return true;
}

async function replayMailboxRoomReviewActions() {
  if (mailboxRoomState.replaying || mailboxRoomMeasuredQubitCount() < 4) {
    return false;
  }
  const actions = mailboxRoomReviewActions();
  if (!actions.length) {
    return false;
  }
  mailboxRoomState.replaying = true;
  mailboxRoomState.replayActionIndex = -1;
  updateEntanglementThreeRoomReviewToolbars();
  try {
    for (let index = 0; index < actions.length; index += 1) {
      mailboxRoomState.replayActionIndex = index;
      updateEntanglementThreeRoomReviewToolbars();
      await waitForDuration(500);
    }
    incrementMailboxRoomReviewCount(1);
    return true;
  } finally {
    mailboxRoomState.replaying = false;
    updateEntanglementThreeRoomReviewToolbars();
  }
}

function runMailboxRoomReviewBatch() {
  if (mailboxRoomMeasuredQubitCount() < 4) {
    return false;
  }
  return incrementMailboxRoomReviewCount(10000);
}

function renderEntanglementThreeRoomReviewStatus(status) {
  if (!(status instanceof HTMLElement)) {
    return false;
  }
  const measuredCount = mailboxRoomMeasuredQubitCount();
  const ready = measuredCount >= 4;
  const roomExperimentInProgress = mailboxRoomExperimentControlInProgress();
  const backendStatus = mailboxRoomState.entanglementThreeBackendStatus;
  const roomText =
    backendStatus === "starting"
      ? "Back end starting up"
      : backendStatus === "unavailable"
        ? "Back end not available"
        : mailboxRoomIsJoined()
          ? `You are ${mailboxRoomState.displayName || "in"} in room ${mailboxRoomState.roomId}`
          : "You are not in a room";
  const actions = mailboxRoomReviewActions();
  const activeAction =
    mailboxRoomState.replayActionIndex >= 0
      ? actions[mailboxRoomState.replayActionIndex] || ""
      : "";
  status.replaceChildren();
  status.classList.add("entanglement-room-review-status");
  const room = document.createElement("span");
  room.textContent = roomText;
  const measured = document.createElement("span");
  measured.textContent = `Measured ${measuredCount}/4`;
  const counts = document.createElement("span");
  counts.textContent = mailboxRoomReviewCountsText();
  const replay = document.createElement("button");
  replay.type = "button";
  replay.className = "playground-tool-btn entanglement-room-review-btn";
  replay.textContent = "Replay";
  replay.disabled = !ready || mailboxRoomState.replaying || roomExperimentInProgress;
  replay.addEventListener("click", (event) => {
    event.stopPropagation();
    replayMailboxRoomReviewActions().catch(() => {});
  });
  const run = document.createElement("button");
  run.type = "button";
  run.className = "playground-tool-btn entanglement-room-review-btn";
  run.textContent = "Run";
  run.disabled = !ready || mailboxRoomState.replaying || roomExperimentInProgress;
  run.addEventListener("click", (event) => {
    event.stopPropagation();
    runMailboxRoomReviewBatch();
  });
  status.append(room, measured, counts, replay, run);
  if (activeAction) {
    const current = document.createElement("span");
    current.className = "entanglement-room-review-action";
    current.textContent = activeAction;
    status.appendChild(current);
  }
  return true;
}

function mailboxRoomEventText(event) {
  const payload = event?.payload || {};
  if (event?.type === "room.message") {
    return `${payload.displayName || "Guest"}: ${payload.message || ""}`;
  }
  if (event?.type === "roomMailbox.sent") {
    const fromName = payload.fromName || "Guest";
    const target = payload.toName
      ? ` to ${payload.toName}`
      : payload.toParticipantId
      ? ` to ${mailboxRoomParticipantName(payload.toParticipantId)}`
      : " to the room";
    const note = payload.message ? ` - ${payload.message}` : "";
    return `${fromName} sent ${payload.qubitLabel || "a qubit"}${target}${note}`;
  }
  if (event?.type === "room.reset") {
    const name = mailboxRoomParticipantName(payload.requestedBy) || "Someone";
    return `${name} reset the room`;
  }
  return "";
}

function createMailboxRoomEventElement(event) {
  const payload = event?.payload || {};
  const row = document.createElement("div");
  row.className = `mailbox-room-event mailbox-room-event-${event.type.replace(/[^a-z]/gi, "-").toLowerCase()}`;
  const text = document.createElement("span");
  text.textContent = mailboxRoomEventText(event);
  row.appendChild(text);
  if (
    event?.type === "roomMailbox.sent" &&
    payload.transfer &&
    payload.fromParticipantId !== mailboxRoomState.participantId &&
    mailboxRoomTransferIsForThisParticipant(payload)
  ) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "mailbox-room-receive-button";
    button.textContent = mailboxRoomTransferReceived(event.id)
      ? "Received"
      : "Receive";
    button.disabled = mailboxRoomTransferReceived(event.id);
    button.addEventListener("click", async () => {
      try {
        mailboxRoomReceiveQubitEvent(event);
        button.textContent = "Received";
        button.disabled = true;
        if (mailboxSendDialog?.status instanceof HTMLElement) {
          mailboxSendDialog.status.textContent = `Received ${payload.qubitLabel || "qubit"} from ${payload.fromName || "sender"}`;
        }
      } catch (error) {
        if (mailboxSendDialog?.status instanceof HTMLElement) {
          mailboxSendDialog.status.textContent =
            localLabMailboxFailureMessage("receive", error);
        }
      }
    });
    row.appendChild(button);
  }
  return row;
}

async function mailboxRoomRefresh({ render = true } = {}) {
  if (!mailboxRoomIsJoined()) {
    return;
  }
  const roomPath = `/rooms/${encodeURIComponent(mailboxRoomState.roomId)}`;
  await localLabRequest(
    `${roomPath}/participants/${encodeURIComponent(mailboxRoomState.participantId)}/heartbeat`,
    { method: "POST" },
  );
  const [
    roomPayload,
    participantsPayload,
    eventsPayload,
    measurementsPayload,
    mailboxPayload,
  ] = await Promise.all([
    localLabRequest(roomPath),
    localLabRequest(`${roomPath}/participants`),
    localLabRequest(`${roomPath}/events`),
    localLabRequest(`${roomPath}/measurements`),
    localLabRequest(
      `${roomPath}/mailbox-notifications?participantId=${encodeURIComponent(mailboxRoomState.participantId)}`,
    ),
  ]);
  const resetApplied = await mailboxRoomApplyRoomReset(roomPayload.room);
  mailboxRoomState.participants = Array.isArray(participantsPayload.participants)
    ? participantsPayload.participants
    : [];
  const roomMeasurements =
    roomPayload.room?.roomMeasurements &&
    typeof roomPayload.room.roomMeasurements === "object"
      ? Object.values(roomPayload.room.roomMeasurements)
      : [];
  mailboxRoomState.events =
    resetApplied && Array.isArray(roomPayload.room?.events)
      ? roomPayload.room.events
      : Array.isArray(eventsPayload.events)
        ? eventsPayload.events
        : [];
  const queuedMailboxEvents = Array.isArray(mailboxPayload.notifications)
    ? mailboxPayload.notifications
    : [];
  const knownEventIds = new Set(mailboxRoomState.events.map((event) => event?.id));
  queuedMailboxEvents.forEach((event) => {
    if (event?.id && !knownEventIds.has(event.id)) {
      mailboxRoomState.events.push(event);
    }
  });
  mailboxRoomState.measurements = resetApplied
    ? mailboxRoomMergeRoomMeasurements(roomMeasurements)
    : mailboxRoomMergeRoomMeasurements(
        Array.isArray(measurementsPayload.measurements)
          ? measurementsPayload.measurements
          : [],
      );
  mailboxRoomApplyRoomMeasurements(mailboxRoomState.measurements);
  await mailboxRoomRefreshSharedEntanglements();
  try {
    mailboxRoomReceivePendingQubits();
  } catch (error) {
    console.warn?.("[Qubit Lab] mailbox receive failed", error);
  }
  updateEntanglementThreeRoomReviewToolbars();
  if (render) {
    renderMailboxRoomDialog();
  }
}

function mailboxRoomStartPolling() {
  if (mailboxRoomState.pollTimer) {
    window.clearInterval(mailboxRoomState.pollTimer);
  }
  mailboxRoomState.pollTimer = window.setInterval(() => {
    if (!mailboxRoomIsJoined()) {
      return;
    }
    mailboxRoomRefresh().catch(() => {});
  }, MAILBOX_ROOM_POLL_MS);
}

async function mailboxRoomJoin({ roomId, displayName, allowAutoName = false }) {
  await mailboxRoomBootCleanupPromise;
  const normalizedRoomId = mailboxRoomSlug(roomId, MAILBOX_ROOM_DEFAULT_ID);
  const existingParticipants =
    await mailboxRoomParticipantsForRoom(normalizedRoomId);
  let normalizedName = String(displayName || "").trim();
  if (!normalizedName && allowAutoName) {
    normalizedName = mailboxRoomAutoNameForJoinIndex(existingParticipants.length);
  }
  if (!normalizedName) {
    throw new Error("Name is required");
  }
  const participantId = mailboxRoomCreateParticipantId(
    normalizedName,
    normalizedRoomId,
  );
  const participantJoinIndex = mailboxRoomParticipantJoinIndex(
    existingParticipants,
    participantId,
  );
  const roomPayload = await localLabRequest("/rooms", {
    method: "POST",
    body: {
      id: normalizedRoomId,
      label: `Qubit Lab ${normalizedRoomId}`,
      ownerId: participantId,
    },
  });
  const participantPayload = await localLabRequest(
    `/rooms/${encodeURIComponent(normalizedRoomId)}/participants/${encodeURIComponent(participantId)}`,
    {
      method: "PUT",
      body: {
        displayName: normalizedName,
        role:
          roomPayload.room?.ownerId === participantId && participantJoinIndex === 0
            ? "owner"
            : "editor",
      },
    },
  );
  mailboxRoomState.joined = true;
  mailboxRoomState.roomId = normalizedRoomId;
  mailboxRoomState.participantId = participantPayload.participant?.id || participantId;
  mailboxRoomState.participantJoinIndex = participantJoinIndex;
  mailboxRoomState.displayName =
    participantPayload.participant?.displayName || normalizedName;
  writeMailboxRoomStorage({
    roomId: mailboxRoomState.roomId,
    participantId: mailboxRoomState.participantId,
    displayName: mailboxRoomState.displayName,
    participants: {
      ...(readMailboxRoomStorage().participants || {}),
      [mailboxRoomStorageParticipantKey(
        mailboxRoomState.roomId,
        mailboxRoomState.displayName,
      )]: mailboxRoomState.participantId,
    },
  });
  await mailboxRoomAssignLocalQubitsForRoom(
    mailboxRoomCanvasForCurrentContext() || activeGeneratedLayoutCanvas(),
  );
  mailboxRoomStartPolling();
  await mailboxRoomRefresh({ render: false });
  updateEntanglementThreeRoomReviewToolbars();
}

async function mailboxRoomSendChat(message) {
  const text = String(message || "").trim();
  if (!text) {
    return;
  }
  await localLabRequest(
    `/rooms/${encodeURIComponent(mailboxRoomState.roomId)}/messages`,
    {
      method: "POST",
      body: {
        participantId: mailboxRoomState.participantId,
        displayName: mailboxRoomState.displayName,
        message: text,
      },
    },
  );
  await mailboxRoomRefresh();
}

function mailboxRoomSendGuardTokenForQubit(qubitItem) {
  if (!(qubitItem instanceof HTMLElement)) {
    return "";
  }
  if (!qubitItem.dataset.mailboxSendGuardId) {
    const randomId =
      window.crypto?.randomUUID?.() ||
      `send_${Date.now().toString(36)}_${Math.random().toString(36).slice(2)}`;
    qubitItem.dataset.mailboxSendGuardId = randomId;
  }
  return qubitItem.dataset.mailboxSendGuardId;
}

function mailboxRoomSendGuardKey(context, { toParticipantId = "" } = {}) {
  const qubitItem = context?.qubitItem;
  const qubitToken = mailboxRoomSendGuardTokenForQubit(qubitItem);
  if (!qubitToken) {
    return "";
  }
  return [
    mailboxRoomState.roomId || "",
    mailboxRoomState.participantId || "",
    toParticipantId || "room",
    qubitToken,
  ].join(":");
}

async function mailboxRoomSendQubit(context, { toParticipantId, message }) {
  if (!mailboxRoomIsJoined()) {
    throw new Error("Join a room first");
  }
  const qubitItem = context?.qubitItem;
  const sendGuardKey = mailboxRoomSendGuardKey(context, { toParticipantId });
  if (qubitItem instanceof HTMLElement) {
    if (
      mailboxRoomSendingQubits.has(qubitItem) ||
      (sendGuardKey && mailboxRoomSendingKeys.has(sendGuardKey))
    ) {
      return null;
    }
    mailboxRoomSendingQubits.add(qubitItem);
  }
  if (sendGuardKey) {
    mailboxRoomSendingKeys.add(sendGuardKey);
  }
  const toName = toParticipantId
    ? mailboxRoomParticipantName(toParticipantId)
    : "";
  try {
    const qubitLabel = mailboxRoomQubitLabel(context);
    const transfer = await mailboxRoomSerializeQubit(context, {
      toParticipantId,
    });
    await localLabRequest(
      `/rooms/${encodeURIComponent(mailboxRoomState.roomId)}/mailbox-notifications`,
      {
        method: "POST",
        body: {
          fromParticipantId: mailboxRoomState.participantId,
          fromName: mailboxRoomState.displayName,
          toParticipantId: toParticipantId || null,
          toName: toName || null,
          qubitLabel,
          message: String(message || "").trim(),
          transfer,
          dedupeKey: sendGuardKey || null,
        },
      },
    );
    setMailboxComponentStatus(
      context?.mailboxItem,
      `Sent ${qubitLabel}${toName ? ` to ${toName}` : " to the room"}`,
    );
    const canvas = generatedCanvasForItem(context?.mailboxItem || qubitItem);
    if (canvas instanceof HTMLElement && qubitItem instanceof HTMLElement) {
      recordGeneratedExperimentAction(canvas, {
        type: "mailbox-send",
        mailboxId: ensureGeneratedItemId(context.mailboxItem, "mailbox"),
        qubitId: ensureGeneratedItemId(qubitItem, "qubit"),
        qubitLogicalId: qubitLogicalIdForItem(qubitItem),
        roomQubitIndex: roomQubitIndexForItem(qubitItem),
        toParticipantId: toParticipantId || null,
      });
    }
    mailboxRoomConsumeSentQubit(context);
    await mailboxRoomRefresh();
    return true;
  } catch (error) {
    if (qubitItem instanceof HTMLElement) {
      mailboxRoomSendingQubits.delete(qubitItem);
    }
    if (sendGuardKey) {
      mailboxRoomSendingKeys.delete(sendGuardKey);
    }
    throw error;
  }
}

function mailboxRoomConsumeSentQubit(context) {
  const qubitItem = context?.qubitItem;
  if (!(qubitItem instanceof HTMLElement) || !qubitItem.isConnected) {
    return;
  }
  const state = generatedQubitRuntimes.get(qubitItem);
  if (state?.pairState?.remoteEntanglementId) {
    state.pairState.members = (state.pairState.members || []).filter(
      (member) =>
        member.item instanceof HTMLElement &&
        member.item !== qubitItem &&
        member.item.isConnected,
    );
  }
  generatedQubitRuntimes.delete(qubitItem);
  qubitItem.remove();
}

async function animateMailboxQubitIntoMailbox(context) {
  const mailboxItem = context?.mailboxItem;
  const qubitItem = context?.qubitItem;
  if (
    !(mailboxItem instanceof HTMLElement) ||
    !(qubitItem instanceof HTMLElement)
  ) {
    return false;
  }
  const mailboxWindow = mailboxItem.querySelector('[data-role="mailbox-window"]');
  if (!(mailboxWindow instanceof HTMLElement)) {
    return false;
  }
  const generatedCanvas = generatedCanvasForItem(qubitItem);
  qubitItem.classList.add("mailbox-sending");
  // Commit the funnel position before changing coordinates so the browser
  // always renders the movement into the mailbox window.
  qubitItem.getBoundingClientRect();
  if (generatedCanvas instanceof HTMLElement) {
    const center = generatedCanvasPointForElementCenter(
      generatedCanvas,
      mailboxWindow,
    );
    setGeneratedQubitCenter(generatedCanvas, qubitItem, center.x, center.y);
  } else {
    const center = canvasPointForElementCenter(mailboxWindow);
    setPlaygroundQubitCenter(qubitItem, center.x, center.y);
  }
  await waitForDuration(220);
  await waitForDuration(300);
  qubitItem.classList.add("mailbox-sending-fade");
  await waitForDuration(200);
  return true;
}

async function waitForEntanglementThreeRoomJoin(canvas, timeoutMs = 15000) {
  if (mailboxRoomIsJoined()) {
    return true;
  }
  if (!mailboxRoomState.entanglementThreeJoinStarted) {
    await autoJoinEntanglementThreeRoom(canvas);
  }
  const deadline = Date.now() + timeoutMs;
  while (
    !mailboxRoomIsJoined() &&
    mailboxRoomState.entanglementThreeJoinStarted &&
    Date.now() < deadline
  ) {
    await waitForDuration(50);
  }
  if (!mailboxRoomIsJoined()) {
    try {
      await mailboxRoomJoin({
        roomId: ENTANGLEMENT_THREE_ROOM_ID,
        displayName: mailboxRoomDefaultDisplayName(),
        allowAutoName: true,
      });
    } catch (error) {
      console.warn?.(
        "[Qubit Lab] Entanglement 3 fallback room join unavailable",
        error,
      );
    }
  }
  return mailboxRoomIsJoined();
}

async function sendMailboxQubitWithoutDialog(context) {
  const mailboxItem = context?.mailboxItem;
  const qubitItem = context?.qubitItem;
  try {
    const canvas = generatedCanvasForItem(mailboxItem || qubitItem);
    const roomReady = mailboxRoomIsJoined()
      ? Promise.resolve(true)
      : isEntanglementThreeCanvas(canvas)
        ? waitForEntanglementThreeRoomJoin(canvas)
        : Promise.resolve(false);
    setMailboxComponentStatus(
      mailboxItem,
      `Sending ${mailboxRoomQubitLabel(context)}...`,
    );
    await animateMailboxQubitIntoMailbox(context);
    if (!(await roomReady)) {
      mailboxRoomStoreLocalTransfer(context);
      mailboxRoomConsumeSentQubit(context);
      setMailboxComponentStatus(
        mailboxItem,
        `Sent ${mailboxRoomQubitLabel(context)} to the mailbox room`,
      );
      return;
    }
    await mailboxRoomSendQubit(context, {
      toParticipantId: "",
      message: "",
    });
  } catch (error) {
    qubitItem?.classList?.remove("mailbox-sending", "mailbox-sending-fade");
    setMailboxComponentStatus(
      mailboxItem,
      localLabMailboxFailureMessage("send", error),
    );
  }
}

function handleMailboxQubitPlaced(context) {
  if (!context?.mailboxItem) {
    return;
  }
  if (
    context.qubitItem instanceof HTMLElement &&
    (mailboxRoomSendingQubits.has(context.qubitItem) ||
      context.qubitItem.classList.contains("mailbox-sending"))
  ) {
    return;
  }
  activeMailboxSendContext = context;
  sendMailboxQubitWithoutDialog(context).catch(() => {});
}

function renderMailboxRoomDialog() {
  const dialog = mailboxSendDialog;
  if (!dialog) {
    return;
  }
  const joined = mailboxRoomIsJoined();
  const activeParticipants = mailboxRoomActiveParticipants();
  if (joined) {
    try {
      mailboxRoomReceivePendingQubits();
    } catch (error) {
      if (dialog.status instanceof HTMLElement) {
        dialog.status.textContent = localLabMailboxFailureMessage(
          "receive",
          error,
        );
      }
    }
  }
  dialog.joinPanel.hidden = joined;
  dialog.roomPanel.hidden = !joined;
  dialog.sendPanel.hidden = !joined || !activeMailboxSendContext?.qubitItem;
  if (dialog.summary instanceof HTMLElement) {
    dialog.summary.textContent = joined
      ? `Room ${mailboxRoomState.roomId} - ${activeParticipants.length} occupant${activeParticipants.length === 1 ? "" : "s"}`
      : "";
  }
  if (dialog.occupants instanceof HTMLElement) {
    dialog.occupants.replaceChildren();
    activeParticipants.forEach((participant) => {
      const item = document.createElement("li");
      item.textContent =
        participant.id === mailboxRoomState.participantId
          ? `${participant.displayName} (you)`
          : participant.displayName;
      dialog.occupants.appendChild(item);
    });
  }
  if (dialog.recipient instanceof HTMLSelectElement) {
    dialog.recipient.replaceChildren();
    const everyone = document.createElement("option");
    everyone.value = "";
    everyone.textContent = "Everyone in room";
    dialog.recipient.appendChild(everyone);
    activeParticipants
      .filter((participant) => participant.id !== mailboxRoomState.participantId)
      .forEach((participant) => {
        const option = document.createElement("option");
        option.value = participant.id;
        option.textContent = participant.displayName;
        dialog.recipient.appendChild(option);
      });
  }
  if (dialog.feed instanceof HTMLElement) {
    dialog.feed.replaceChildren();
    const events = mailboxRoomVisibleEvents();
    if (!events.length) {
      const empty = document.createElement("p");
      empty.className = "mailbox-room-empty";
      empty.textContent = "No room activity yet.";
      dialog.feed.appendChild(empty);
    } else {
      events.forEach((event) => {
        dialog.feed.appendChild(createMailboxRoomEventElement(event));
      });
      dialog.feed.scrollTop = dialog.feed.scrollHeight;
    }
  }
  if (
    dialog.sendMessage instanceof HTMLTextAreaElement &&
    activeMailboxSendContext?.qubitItem &&
    !dialog.sendMessage.value.trim()
  ) {
    dialog.sendMessage.value = `${mailboxRoomState.displayName || "Someone"} is sending ${mailboxRoomQubitLabel()} through the mailbox.`;
  }
}

function ensureMailboxSendDialog() {
  if (mailboxSendDialog) {
    return mailboxSendDialog;
  }
  const overlay = document.createElement("div");
  overlay.className = "mailbox-send-overlay";
  overlay.hidden = true;
  overlay.innerHTML = [
    '<section class="mailbox-send-form" aria-label="Qubit Lab room">',
    '<h2 class="mailbox-send-title">Mailbox room</h2>',
    '<div class="mailbox-room-join" data-role="mailbox-room-join">',
    '<label class="mailbox-send-field">',
    "<span>Name</span>",
    '<input class="mailbox-room-name" type="text" autocomplete="name" />',
    "</label>",
    '<label class="mailbox-send-field">',
    "<span>Room</span>",
    '<input class="mailbox-room-id" type="text" autocomplete="off" spellcheck="false" />',
    "</label>",
    '<button class="mailbox-room-join-button" type="button">Join Room</button>',
    "</div>",
    '<div class="mailbox-room-panel" data-role="mailbox-room-panel" hidden>',
    '<div class="mailbox-room-summary"></div>',
    '<div class="mailbox-room-columns">',
    '<section><h3>Occupants</h3><ul class="mailbox-room-occupants"></ul></section>',
    '<section><h3>Room Activity</h3><div class="mailbox-room-feed"></div></section>',
    "</div>",
    '<div class="mailbox-room-send-panel" hidden>',
    '<label class="mailbox-send-field">',
    "<span>Send to</span>",
    '<select class="mailbox-room-recipient"></select>',
    "</label>",
    '<label class="mailbox-send-field">',
    "<span>Message</span>",
    '<textarea class="mailbox-room-send-message" rows="3"></textarea>',
    "</label>",
    '<button class="mailbox-room-send-button" type="button">Send Qubit</button>',
    "</div>",
    '<div class="mailbox-room-chat-row">',
    '<input class="mailbox-room-chat-input" type="text" placeholder="Message the room" />',
    '<button class="mailbox-room-chat-button" type="button">Chat</button>',
    "</div>",
    "</div>",
    '<div class="mailbox-send-status" aria-live="polite"></div>',
    '<div class="mailbox-send-actions">',
    '<button class="mailbox-send-cancel" type="button">Close</button>',
    "</div>",
    "</section>",
  ].join("");
  const cancelButton = overlay.querySelector(".mailbox-send-cancel");
  const status = overlay.querySelector(".mailbox-send-status");
  const joinPanel = overlay.querySelector(".mailbox-room-join");
  const roomPanel = overlay.querySelector(".mailbox-room-panel");
  const nameInput = overlay.querySelector(".mailbox-room-name");
  const roomInput = overlay.querySelector(".mailbox-room-id");
  const joinButton = overlay.querySelector(".mailbox-room-join-button");
  const summary = overlay.querySelector(".mailbox-room-summary");
  const occupants = overlay.querySelector(".mailbox-room-occupants");
  const feed = overlay.querySelector(".mailbox-room-feed");
  const sendPanel = overlay.querySelector(".mailbox-room-send-panel");
  const recipient = overlay.querySelector(".mailbox-room-recipient");
  const sendMessage = overlay.querySelector(".mailbox-room-send-message");
  const sendButton = overlay.querySelector(".mailbox-room-send-button");
  const chatInput = overlay.querySelector(".mailbox-room-chat-input");
  const chatButton = overlay.querySelector(".mailbox-room-chat-button");

  const close = () => {
    overlay.hidden = true;
    activeMailboxSendContext = null;
    if (status instanceof HTMLElement) {
      status.textContent = "";
      status.classList.remove("mailbox-send-status-error");
    }
  };
  const showStatus = (message, tone = "") => {
    if (status instanceof HTMLElement) {
      status.textContent = message || "";
      status.classList.toggle("mailbox-send-status-error", tone === "error");
    }
  };

  cancelButton?.addEventListener("click", close);
  overlay.addEventListener("mousedown", (event) => {
    if (event.target === overlay) {
      close();
    }
  });
  overlay.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      close();
    }
  });
  nameInput?.addEventListener("input", () => {
    if (nameInput instanceof HTMLInputElement) {
      nameInput.dataset.mailboxAutoName = "false";
    }
  });
  roomInput?.addEventListener("input", () => {
    if (
      nameInput instanceof HTMLInputElement &&
      (!nameInput.value.trim() || mailboxRoomNameWasAutoFilled(nameInput))
    ) {
      void refreshMailboxRoomNameSuggestion(mailboxSendDialog);
    }
  });
  joinButton?.addEventListener("click", async () => {
    if (!(nameInput instanceof HTMLInputElement) || !(roomInput instanceof HTMLInputElement)) {
      return;
    }
    showStatus("Joining...");
    if (joinButton instanceof HTMLButtonElement) {
      joinButton.disabled = true;
    }
    try {
      await mailboxRoomJoin({
        roomId: roomInput.value,
        displayName: mailboxRoomNameWasAutoFilled(nameInput)
          ? ""
          : nameInput.value,
        allowAutoName:
          mailboxRoomNameWasAutoFilled(nameInput) ||
          !nameInput.value.trim(),
      });
      showStatus("Joined room");
      renderMailboxRoomDialog();
    } catch (error) {
      showStatus(localLabMailboxFailureMessage("join", error), "error");
    } finally {
      if (joinButton instanceof HTMLButtonElement) {
        joinButton.disabled = false;
      }
    }
  });
  sendButton?.addEventListener("click", async () => {
    if (!activeMailboxSendContext?.mailboxItem) {
      return;
    }
    showStatus("Sending...");
    if (sendButton instanceof HTMLButtonElement) {
      sendButton.disabled = true;
    }
    try {
      await mailboxRoomSendQubit(activeMailboxSendContext, {
        toParticipantId:
          recipient instanceof HTMLSelectElement ? recipient.value : "",
        message:
          sendMessage instanceof HTMLTextAreaElement ? sendMessage.value : "",
      });
      showStatus("Qubit notification sent");
      if (sendMessage instanceof HTMLTextAreaElement) {
        sendMessage.value = "";
      }
      activeMailboxSendContext = { mailboxItem: activeMailboxSendContext.mailboxItem };
      renderMailboxRoomDialog();
    } catch (error) {
      showStatus(localLabMailboxFailureMessage("send", error), "error");
    } finally {
      if (sendButton instanceof HTMLButtonElement) {
        sendButton.disabled = false;
      }
    }
  });
  const sendChat = async () => {
    if (!(chatInput instanceof HTMLInputElement)) {
      return;
    }
    const message = chatInput.value.trim();
    if (!message) {
      return;
    }
    showStatus("Posting...");
    if (chatButton instanceof HTMLButtonElement) {
      chatButton.disabled = true;
    }
    try {
      await mailboxRoomSendChat(message);
      chatInput.value = "";
      showStatus("Message posted");
    } catch (error) {
      showStatus(localLabMailboxFailureMessage("chat", error), "error");
    } finally {
      if (chatButton instanceof HTMLButtonElement) {
        chatButton.disabled = false;
      }
    }
  };
  chatButton?.addEventListener("click", () => {
    void sendChat();
  });
  chatInput?.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      void sendChat();
    }
  });

  document.body.appendChild(overlay);
  mailboxSendDialog = {
    overlay,
    joinPanel,
    roomPanel,
    nameInput,
    roomInput,
    summary,
    occupants,
    feed,
    sendPanel,
    recipient,
    sendMessage,
    chatInput,
    status,
    close,
  };
  return mailboxSendDialog;
}

function openMailboxSendDialog(context) {
  if (!context?.mailboxItem) {
    return;
  }
  const dialog = ensureMailboxSendDialog();
  activeMailboxSendContext = context;
  if (dialog.nameInput instanceof HTMLInputElement) {
    const explicitName =
      mailboxRoomState.displayName ||
      localLabParticipantFromLocation();
    if (explicitName) {
      dialog.nameInput.value = explicitName;
      dialog.nameInput.dataset.mailboxAutoName = "false";
    } else {
      mailboxRoomSetAutoName(dialog.nameInput, mailboxRoomAutoNameForJoinIndex(0));
    }
  }
  if (dialog.roomInput instanceof HTMLInputElement) {
    dialog.roomInput.value =
      mailboxRoomState.roomId || mailboxRoomIdForSendContext(context);
  }
  void refreshMailboxRoomNameSuggestion(dialog);
  if (dialog.status instanceof HTMLElement) {
    dialog.status.textContent = "";
  }
  if (dialog.sendMessage instanceof HTMLTextAreaElement) {
    dialog.sendMessage.value = activeMailboxSendContext?.qubitItem
      ? `${mailboxRoomState.displayName || "Someone"} is sending ${mailboxRoomQubitLabel(context)} through the mailbox.`
      : "";
  }
  renderMailboxRoomDialog();
  dialog.overlay.hidden = false;
  if (mailboxRoomIsJoined()) {
    mailboxRoomRefresh().catch(() => {});
  }
  window.setTimeout(() => {
    if (!mailboxRoomIsJoined() && dialog.nameInput instanceof HTMLInputElement) {
      dialog.nameInput.focus();
    } else if (
      activeMailboxSendContext?.qubitItem &&
      dialog.sendMessage instanceof HTMLTextAreaElement
    ) {
      dialog.sendMessage.focus();
    } else if (dialog.chatInput instanceof HTMLInputElement) {
      dialog.chatInput.focus();
    }
  }, 0);
}

function isSeparatedPairMeasurementGroupElement(item) {
  if (
    !(item instanceof HTMLElement) ||
    item.dataset.component !== PLAYGROUND_SAVED_GROUP_COMPONENT_TYPE
  ) {
    return false;
  }
  const magnifierCount = item.querySelectorAll(
    ':scope > .saved-group-child[data-component="single-magnifier"] [data-role="measurement-tool"]',
  ).length;
  if (magnifierCount < 1) {
    return false;
  }
  const columnKeys = registerMeasurementColumnKeysForItem(item);
  if (columnKeys.length === 0) {
    return true;
  }
  const registerQubitCount = registerMeasurementQubitCountFromKeys(
    columnKeys,
  );
  const requiredTubeKeys = registerMeasurementOutcomeKeys(registerQubitCount);
  return requiredTubeKeys.every((key) =>
    item.querySelector(`.pair-tube-column[data-key="${key}"]`),
  );
}

function savedGroupChildEditSpec(child, index) {
  const type = child?.dataset?.component || "";
  const role =
    child?.dataset?.measurementRole || measurementPieceRoleForType(type);
  const baseKey = role || type || `child-${index + 1}`;
  const defaults =
    {
      "measurement-capacity": { minWidth: 120, minHeight: 24 },
      "single-tube-array": { minWidth: 120, minHeight: 80 },
      "double-tube-array": { minWidth: 160, minHeight: 90 },
      "triple-tube-array": { minWidth: 220, minHeight: 90 },
      "quadruple-tube-array": { minWidth: 360, minHeight: 90 },
      "single-magnifier": { minWidth: 100, minHeight: 80 },
      "double-magnifier": { minWidth: 160, minHeight: 100 },
      "measurement-count-menu": { minWidth: 60, minHeight: 24 },
    }[type] || { minWidth: 40, minHeight: 30 };
  return {
    key: `${baseKey}-${index + 1}`,
    resizable: true,
    uniform: false,
    ...defaults,
  };
}

function editableSavedGroupChildPartEntries(item) {
  if (!isSeparatedPairMeasurementGroupElement(item)) {
    return [];
  }
  return Array.from(item.querySelectorAll(":scope > .saved-group-child"))
    .filter((child) => child instanceof HTMLElement)
    .map((element, index) => ({
      element,
      spec: savedGroupChildEditSpec(element, index),
    }));
}

function finitePositiveNumber(value, fallback) {
  const number = Number(value);
  return Number.isFinite(number) && number > 0 ? number : fallback;
}

function captureSavedGroupChildLayoutSnapshot(item) {
  const entries = editableSavedGroupChildPartEntries(item);
  if (entries.length === 0) {
    return null;
  }
  const groupRect = item.getBoundingClientRect();
  const items = entries.map(({ element }, index) => {
    const rect = element.getBoundingClientRect();
    const type = element.dataset.component || "qubit";
    const geometry = {
      type,
      left: Number.parseFloat((rect.left - groupRect.left).toFixed(2)),
      top: Number.parseFloat((rect.top - groupRect.top).toFixed(2)),
      width: Number.parseFloat(rect.width.toFixed(2)),
      height: Number.parseFloat(rect.height.toFixed(2)),
      z: parseLayoutNumeric(element.style.zIndex, index + 1),
    };
    const measurementRole =
      element.dataset.measurementRole || measurementPieceRoleForType(type);
    if (measurementRole) {
      geometry.measurementRole = measurementRole;
    }
    if (type === "qubit") {
      const qubitId = ensureQubitLogicalId(element);
      if (qubitId) {
        geometry.qubitId = qubitId;
      }
    }
    if (type === "text-box") {
      Object.assign(geometry, captureTextBoxSnapshot(element));
    }
    if (isMeasurementComponentType(type)) {
      const measurementLayout = captureMeasurementLayoutSnapshot(
        element,
        editableMeasurementPartSpecsForType(type),
      );
      if (measurementLayout) {
        geometry.measurementLayout = measurementLayout;
      }
    }
    if (type === "cnot-gate") {
      const cnotLayout = captureCnotComponentDefaultsFromElement(element);
      if (cnotLayout) {
        geometry.cnotLayout = cnotLayout;
      }
    }
    return geometry;
  });
  return {
    items,
    itemsWidth: Number.parseFloat(groupRect.width.toFixed(2)),
    itemsHeight: Number.parseFloat(groupRect.height.toFixed(2)),
  };
}

function persistSavedGroupComponentDefinitionFromElement(item) {
  if (
    !isSeparatedPairMeasurementGroupElement(item) ||
    !item.dataset.groupComponentId
  ) {
    return false;
  }
  const snapshot = captureSavedGroupChildLayoutSnapshot(item);
  if (!snapshot?.items?.length) {
    return false;
  }
  const payload = readPlaygroundGroupComponentsPayload();
  const groups = Array.isArray(payload.groups) ? payload.groups : [];
  const index = groups.findIndex(
    (group) => group?.id === item.dataset.groupComponentId,
  );
  const nextGroup = {
    ...(index >= 0 ? groups[index] : {}),
    id: item.dataset.groupComponentId,
    label:
      index >= 0
        ? groups[index].label
        : item.dataset.groupComponentId === SEPARATE_TWO_QUBIT_MEASUREMENT_GROUP_ID
          ? SEQUENTIAL_TWO_QUBIT_MEASUREMENT_LABEL
          : "Saved Group",
    width: snapshot.itemsWidth,
    height: snapshot.itemsHeight,
    items: snapshot.items.map((item) =>
      stripQubitIdsFromLayoutGeometry({ ...item }),
    ),
    savedAt: Date.now(),
  };
  if (index >= 0) {
    groups[index] = nextGroup;
  } else {
    groups.push(nextGroup);
  }
  const saved = writePlaygroundGroupComponentsPayload({ groups });
  if (saved) {
    const removeInstanceSnapshot = (layoutItem) => {
      if (!layoutItem || typeof layoutItem !== "object") {
        return { item: layoutItem, changed: false };
      }
      let changed = false;
      let replacement = layoutItem;
      if (layoutItem.groupComponentId === nextGroup.id) {
        replacement = { ...layoutItem };
        delete replacement.items;
        delete replacement.itemsWidth;
        delete replacement.itemsHeight;
        changed = true;
      } else if (Array.isArray(layoutItem.items)) {
        const nested = layoutItem.items.map(removeInstanceSnapshot);
        if (nested.some((result) => result.changed)) {
          replacement = {
            ...layoutItem,
            items: nested.map((result) => result.item),
          };
          changed = true;
        }
      }
      return { item: replacement, changed };
    };
    const nextTabs = cloneJson(generatedTabsState) || { tabs: [] };
    let tabsChanged = false;
    nextTabs.tabs = (nextTabs.tabs || []).map((entry) => {
      if (!Array.isArray(entry?.layout?.items)) {
        return entry;
      }
      let entryChanged = false;
      const itemResults = entry.layout.items.map(removeInstanceSnapshot);
      entryChanged = itemResults.some((result) => result.changed);
      tabsChanged = entryChanged || tabsChanged;
      const items = itemResults.map((result) => result.item);
      return entryChanged
        ? { ...entry, layout: { ...entry.layout, items, savedAt: Date.now() } }
        : entry;
    });
    if (tabsChanged && !writeGeneratedTabsState(nextTabs)) {
      return false;
    }
    if (tabsChanged) {
      applyGeneratedTabsState(nextTabs);
      plagroundComposer?.handleGeneratedTabsChanged?.();
      documentEditorComposer?.handleGeneratedTabsChanged?.();
    }
    const nextDocuments = cloneJson(documentsState) || { documents: [] };
    let documentsChanged = false;
    nextDocuments.documents = (nextDocuments.documents || []).map((document) => ({
      ...document,
      scenes: (document.scenes || []).map((scene) => {
        const itemResults = (scene.items || []).map(removeInstanceSnapshot);
        if (!itemResults.some((result) => result.changed)) {
          return scene;
        }
        documentsChanged = true;
        return {
          ...scene,
          items: itemResults.map((result) => result.item),
          savedAt: Date.now(),
        };
      }),
    }));
    if (documentsChanged && !writeDocumentsState(nextDocuments)) {
      return false;
    }
    if (documentsChanged) {
      documentsState = nextDocuments;
      documentEditorComposer?.handleDocumentsChanged?.();
    }
    refreshAllComponentPickers();
  }
  return saved;
}

function applySavedGroupChildGeometry(child, storedGeometry, groupWidth, groupHeight) {
  const config = componentConfigForType(
    storedGeometry?.type,
    storedGeometry,
  ) || {
    width: 120,
    height: 100,
  };
  const left = finitePositiveNumber(storedGeometry?.left, 0);
  const top = finitePositiveNumber(storedGeometry?.top, 0);
  const width = finitePositiveNumber(storedGeometry?.width, config.width);
  const height = finitePositiveNumber(storedGeometry?.height, config.height);
  child.style.left = `${(left / groupWidth) * 100}%`;
  child.style.top = `${(top / groupHeight) * 100}%`;
  child.style.width = `${(width / groupWidth) * 100}%`;
  child.style.height = `${(height / groupHeight) * 100}%`;
  child.style.zIndex = `${Math.round(Number(storedGeometry?.z) || 1)}`;
}

function applySavedGroupChildSnapshot(child, storedGeometry) {
  const type = storedGeometry?.type;
  if (!(child instanceof HTMLElement)) {
    return;
  }
  if (type === "cnot-gate") {
    applyCnotComponentDefaultsToElement(child, {
      includeGateGeometry: !storedGeometry?.cnotLayout,
    });
    if (storedGeometry?.cnotLayout) {
      applyCnotSnapshotToElement(child, storedGeometry.cnotLayout, {
        includeGateGeometry: false,
      });
    }
  }
  if (isMeasurementComponentType(type)) {
    applyMeasurementLayoutSnapshot(
      child,
      storedGeometry?.measurementLayout ||
        playgroundComponentDefaultsCache?.[type],
      editableMeasurementPartSpecsForType(type),
      { includeGroupGeometry: false },
    );
  }
  if (type === "single-gate" && Number.isFinite(storedGeometry?.singleGateTick)) {
    child.dataset.playgroundSingleGateTick = `${normalizeTickIndex(
      storedGeometry.singleGateTick,
    )}`;
  }
  if (type === "text-box") {
    applyTextBoxSnapshotToElement(child, storedGeometry);
  }
}

function syncSavedRegisterMeasurementCapacityText(item) {
  const registerQubitCount = Number(item?.dataset?.measurementRegisterQubitCount);
  if (
    !(item instanceof HTMLElement) ||
    !Number.isInteger(registerQubitCount) ||
    registerQubitCount <= 2
  ) {
    return;
  }
  const capacity = item.querySelector('[data-role="pair-capacity"]');
  if (capacity instanceof HTMLElement) {
    const capacityValue = savedMeasurementCapacity(
      item.dataset.measurementTubeCapacity,
    );
    capacity.textContent = `The testtubes can each hold ${capacityValue} counts.`;
  }
}

function createSavedGroupNode(group, geometry = {}) {
  const wrapper = document.createElement("div");
  wrapper.className = "saved-component-group component-group";
  const groupId = group?.id || geometry?.groupComponentId || "";
  if (groupId) {
    wrapper.dataset.groupComponentId = groupId;
  }
  const registerQubitCount =
    Number(geometry?.measurementRegisterQubitCount) ||
    Number(group?.measurementRegisterQubitCount);
  if (
    Number.isInteger(registerQubitCount) &&
    registerQubitCount >= 2 &&
    registerQubitCount <= 4
  ) {
    wrapper.dataset.measurementRegisterQubitCount = `${registerQubitCount}`;
  }
  const instanceItems =
    Array.isArray(geometry?.items) && geometry.items.length > 0
      ? geometry.items
      : null;
  const groupItems =
    instanceItems || (Array.isArray(group?.items) ? group.items : []);
  if (groupItems.length === 0) {
    wrapper.appendChild(createPlaygroundFallback("Saved group"));
    return wrapper;
  }
  const renderDepth = Number(geometry?.groupRenderDepth) || 0;
  if (renderDepth > 4) {
    wrapper.appendChild(createPlaygroundFallback(group?.label || "Saved group"));
    return wrapper;
  }
  const groupWidth = instanceItems
    ? finitePositiveNumber(
        geometry?.itemsWidth,
        finitePositiveNumber(
          geometry?.width,
          finitePositiveNumber(group?.width, 320),
        ),
      )
    : finitePositiveNumber(group?.width, 320);
  const groupHeight = instanceItems
    ? finitePositiveNumber(
        geometry?.itemsHeight,
        finitePositiveNumber(
          geometry?.height,
          finitePositiveNumber(group?.height, 240),
        ),
      )
    : finitePositiveNumber(group?.height, 240);
  groupItems
    .slice()
    .sort((a, b) => (Number(a?.z) || 0) - (Number(b?.z) || 0))
    .forEach((storedGeometry) => {
      const childType =
        typeof storedGeometry?.type === "string" ? storedGeometry.type : "qubit";
      const childGeometry = {
        ...storedGeometry,
        groupRenderDepth: renderDepth + 1,
      };
      const child =
        createPlaygroundComponentNode(childType, childGeometry) ||
        createPlaygroundFallback(
          componentConfigForType(childType, childGeometry)?.label || "Component",
        );
      if (!(child instanceof HTMLElement)) {
        return;
      }
      child.classList.add("saved-group-child");
      child.dataset.component = childType;
      if (childType === "qubit") {
        ensureQubitLogicalId(child, storedGeometry?.qubitId);
      }
      if (typeof storedGeometry?.measurementRole === "string") {
        child.dataset.measurementRole = storedGeometry.measurementRole;
      }
      if (groupId) {
        child.dataset.groupComponentId = groupId;
      }
      applySavedGroupChildGeometry(
        child,
        storedGeometry,
        groupWidth,
        groupHeight,
      );
      applySavedGroupChildSnapshot(child, storedGeometry);
      wrapper.appendChild(child);
    });
  syncSavedRegisterMeasurementCapacityText(wrapper);
  return wrapper;
}

function createPlaygroundComponentNode(type, geometry = {}) {
  if (type === PLAYGROUND_SAVED_GROUP_COMPONENT_TYPE) {
    return createSavedGroupNode(
      playgroundGroupComponentById(geometry?.groupComponentId),
      geometry,
    );
  }
  const pickerGroup = savedGroupComponentForType(type);
  if (pickerGroup) {
    return createSavedGroupNode(pickerGroup, {
      ...geometry,
      groupComponentId: pickerGroup.id,
    });
  }
  let node = null;
  if (type === "qubit") {
    node = clonePlaygroundSourceElement(cloneSingleQubitBlueprint(".qubit"));
  } else if (type === "single-gate") {
    node = clonePlaygroundSourceElement(
      cloneSingleQubitBlueprint(".window-wrap.single-qubit-gate"),
    );
  } else if (type === "cnot-gate") {
    node = createCnotGateElement();
  } else if (type === "mailbox") {
    node = createMailboxElement();
  } else if (type === "single-measurement") {
    node = clonePlaygroundSourceElement(
      cloneSingleQubitBlueprint(".measurement-stage"),
    );
  } else if (type === "double-measurement") {
    node = document.createElement("section");
    node.className = "pair-measurement";
    node.dataset.role = "pair-measurement-host";
    node.setAttribute("aria-label", "Two qubit measurement tool");
    mountPairMeasurementTool(node);
  } else if (type === "text-box") {
    node = createTextBoxElement(geometry);
  } else if (isMeasurementPieceComponentType(type)) {
    node = createMeasurementPieceNode(type, geometry);
  }

  if (!node) {
    return createPlaygroundFallback(
      PLAYGROUND_COMPONENT_LIBRARY[type]?.label || "Component",
    );
  }

  sanitizePlaygroundComponentNode(node, {
    preserveInlineStyles: type === "single-gate",
  });
  if (type === "cnot-gate") {
    normalizeCnotGateElement(node);
  }
  if (type === "qubit") {
    node.removeAttribute("data-phase-sign");
  } else if (type === "single-measurement") {
    const capacity = node.querySelector(".tube-capacity");
    if (capacity) {
      capacity.textContent = "The testtubes can each hold 5 qubits.";
    }
  } else if (type === "double-measurement") {
    const capacity = node.querySelector(".pair-capacity");
    if (capacity) {
      capacity.textContent = "The testtubes can each hold 5 qubit pairs.";
    }
    ensurePlaygroundGroupFrame(node);
  }
  return node;
}

function minGeneratedLayoutSizeForType(type) {
  if (type === "qubit") {
    return { minWidth: 12, minHeight: 12 };
  }
  if (type === "text-box") {
    return { minWidth: 140, minHeight: 88 };
  }
  if (type === PLAYGROUND_SAVED_GROUP_COMPONENT_TYPE) {
    return { minWidth: 80, minHeight: 60 };
  }
  if (isMeasurementPieceComponentType(type)) {
    if (type === "measurement-count-menu") {
      return { minWidth: 70, minHeight: 42 };
    }
    if (type === "measurement-capacity") {
      return { minWidth: 160, minHeight: 48 };
    }
    if (type === "single-magnifier") {
      return { minWidth: 90, minHeight: 70 };
    }
    if (type === "triple-tube-array") {
      return { minWidth: 220, minHeight: 90 };
    }
    if (type === "quadruple-tube-array") {
      return { minWidth: 360, minHeight: 90 };
    }
    return { minWidth: 110, minHeight: 80 };
  }
  return { minWidth: 120, minHeight: 100 };
}

function isGeneratedLayoutCanvas(element) {
  return (
    element instanceof HTMLElement &&
    element.classList.contains("generated-layout-canvas")
  );
}

function generatedLayoutCanvasScale(canvas) {
  if (!isGeneratedLayoutCanvas(canvas)) {
    return 1;
  }
  const storedScale = Number.parseFloat(canvas.dataset.generatedLayoutScale);
  if (Number.isFinite(storedScale) && storedScale > 0) {
    return storedScale;
  }
  const logicalWidth = parseLayoutNumeric(
    canvas.dataset.generatedLogicalWidth,
    canvas.offsetWidth || canvas.clientWidth || 0,
  );
  const rectWidth = canvas.getBoundingClientRect().width;
  if (logicalWidth > 0 && rectWidth > 0) {
    return rectWidth / logicalWidth;
  }
  return 1;
}

function generatedLayoutViewportForCanvas(canvas) {
  if (!isGeneratedLayoutCanvas(canvas)) {
    return null;
  }
  const viewport = canvas.closest(".generated-layout-viewport");
  return viewport instanceof HTMLElement ? viewport : null;
}

function syncGeneratedLayoutCanvasScale(canvas) {
  if (!isGeneratedLayoutCanvas(canvas)) {
    return 1;
  }
  const viewport = generatedLayoutViewportForCanvas(canvas);
  const logicalWidth = parseLayoutNumeric(
    canvas.dataset.generatedLogicalWidth,
    canvas.offsetWidth || canvas.clientWidth || 0,
  );
  const viewportWidth = viewport?.getBoundingClientRect().width || logicalWidth;
  const scale =
    logicalWidth > 0 && viewportWidth > 0
      ? Math.min(1, viewportWidth / logicalWidth)
      : 1;
  const normalizedScale = Number.isFinite(scale) && scale > 0 ? scale : 1;
  canvas.dataset.generatedLayoutScale = normalizedScale.toFixed(6);
  canvas.style.setProperty("--generated-layout-scale", `${normalizedScale}`);
  return normalizedScale;
}

function syncGeneratedLayoutCanvasScales(root = document) {
  const scope =
    root instanceof Document ? root : root?.ownerDocument || document;
  const canvases =
    root instanceof HTMLElement && root.matches(".generated-layout-canvas")
      ? [root]
      : Array.from(
          (root instanceof HTMLElement ? root : scope).querySelectorAll(
            ".generated-layout-canvas",
          ),
        );
  canvases.forEach((canvas) => syncGeneratedLayoutCanvasScale(canvas));
}

function generatedViewportPointToCanvasPoint(canvas, x, y) {
  const canvasRect = canvas.getBoundingClientRect();
  const scale = generatedLayoutCanvasScale(canvas);
  return {
    x: (x - canvasRect.left) / scale + canvas.scrollLeft,
    y: (y - canvasRect.top) / scale + canvas.scrollTop,
  };
}

function generatedCanvasBoundsForElement(canvas, element) {
  if (!isGeneratedLayoutCanvas(canvas) || !(element instanceof HTMLElement)) {
    return null;
  }
  const rect = element.getBoundingClientRect();
  const topLeft = generatedViewportPointToCanvasPoint(
    canvas,
    rect.left,
    rect.top,
  );
  const bottomRight = generatedViewportPointToCanvasPoint(
    canvas,
    rect.right,
    rect.bottom,
  );
  return {
    left: topLeft.x,
    right: bottomRight.x,
    top: topLeft.y,
    bottom: bottomRight.y,
  };
}

function isDocumentEditorCanvas(element) {
  return (
    element instanceof HTMLElement && element.dataset.docEditorCanvas === "true"
  );
}

function isDocumentRuntimeCanvas(element) {
  return (
    element instanceof HTMLElement && element.dataset.docRuntimeCanvas === "true"
  );
}

function isGeneratedLayoutItem(element) {
  return (
    element instanceof HTMLElement &&
    element.classList.contains("playground-node") &&
    Boolean(element.closest(".generated-layout-canvas"))
  );
}

function isGeneratedQubitItem(item) {
  return isGeneratedLayoutItem(item) && item.dataset.component === "qubit";
}

function isGeneratedSingleGateItem(item) {
  return (
    isGeneratedLayoutItem(item) && item.dataset.component === "single-gate"
  );
}

function isGeneratedSingleMeasurementItem(item) {
  return (
    isGeneratedLayoutItem(item) &&
    item.dataset.component === "single-measurement"
  );
}

function isGeneratedDoubleMeasurementItem(item) {
  return (
    isGeneratedLayoutItem(item) &&
    item.dataset.component === "double-measurement"
  );
}

function isGeneratedSeparatedPairMeasurementItem(item) {
  if (
    !isGeneratedLayoutItem(item) ||
    item.dataset.component !== PLAYGROUND_SAVED_GROUP_COMPONENT_TYPE
  ) {
    return false;
  }
  return isSeparatedPairMeasurementGroupElement(item);
}

function isGeneratedCnotItem(item) {
  return isGeneratedLayoutItem(item) && item.dataset.component === "cnot-gate";
}

function isGeneratedMailboxItem(item) {
  return isGeneratedLayoutItem(item) && item.dataset.component === "mailbox";
}

function activeGeneratedLayoutCanvas() {
  const panels = Array.from(
    document.querySelectorAll('[data-generated-layout-panel="true"]:not([hidden])'),
  );
  for (const panel of panels) {
    if (!(panel instanceof HTMLElement)) {
      continue;
    }
    const canvas = panel.querySelector(".generated-layout-canvas");
    if (canvas instanceof HTMLElement) {
      return canvas;
    }
  }
  return null;
}

function generatedCanvasForItem(item) {
  if (!(item instanceof HTMLElement)) {
    return null;
  }
  const canvas = item.closest(".generated-layout-canvas");
  return canvas instanceof HTMLElement ? canvas : null;
}

function createGeneratedItemId(type = "item") {
  generatedItemIdCounter += 1;
  return `${type}-${Date.now().toString(36)}-${generatedItemIdCounter.toString(36)}`;
}

function ensureGeneratedItemId(item, preferredType = "item") {
  if (!(item instanceof HTMLElement)) {
    return "";
  }
  if (!item.dataset.generatedItemId) {
    item.dataset.generatedItemId = createGeneratedItemId(
      item.dataset.component || preferredType,
    );
  }
  return item.dataset.generatedItemId;
}

function stripGeneratedRuntimeIdsFromLayoutGeometry(geometry) {
  if (!geometry || typeof geometry !== "object") {
    return geometry;
  }
  delete geometry.id;
  delete geometry.measurementGroupId;
  if (geometry.type === "qubit") {
    delete geometry.qubitId;
  }
  if (Array.isArray(geometry.items)) {
    geometry.items.forEach((item) =>
      stripGeneratedRuntimeIdsFromLayoutGeometry(item),
    );
  }
  if (Array.isArray(geometry.layout?.items)) {
    geometry.layout.items.forEach((item) =>
      stripGeneratedRuntimeIdsFromLayoutGeometry(item),
    );
  }
  return geometry;
}

function ensureUniqueGeneratedLayoutItemIds(canvas) {
  if (!isGeneratedLayoutCanvas(canvas)) {
    return false;
  }
  const seen = new Set();
  let changed = false;
  canvas
    .querySelectorAll(":scope > .playground-node")
    .forEach((item) => {
      if (!(item instanceof HTMLElement)) {
        return;
      }
      const itemId = ensureGeneratedItemId(item);
      if (!seen.has(itemId)) {
        seen.add(itemId);
        return;
      }
      const nextId = createGeneratedItemId(item.dataset.component || "item");
      item.dataset.generatedItemId = nextId;
      seen.add(nextId);
      changed = true;
    });
  return changed;
}

function ensureUniqueGeneratedLayoutQubitIds(canvas) {
  if (!isGeneratedLayoutCanvas(canvas)) {
    return false;
  }
  const seen = new Set();
  let changed = false;
  generatedItemsOfType(canvas, "qubit").forEach((item, index) => {
    if (!Number.isInteger(roomQubitIndexForItem(item))) {
      item.dataset.roomQubitIndex = String(index);
    }
    const qubitId = ensureQubitLogicalId(item);
    if (!qubitId || !seen.has(qubitId)) {
      if (qubitId) {
        seen.add(qubitId);
      }
      updateQubitDisplayLabel(item, index);
      return;
    }
    const nextId = reserveNextQubitId();
    item.dataset.qubitId = String(nextId);
    seen.add(nextId);
    updateQubitDisplayLabel(item, index);
    changed = true;
  });
  return changed;
}

function generatedMeasurementSlotIndexForItem(item) {
  const number = Number(item?.dataset?.generatedMeasurementSlotIndex);
  return Number.isSafeInteger(number) && number >= 0 ? number : null;
}

function generatedMeasurementSlotSourcePoint(canvas, item, activeItem = null) {
  if (
    activeItem === item &&
    generatedRuntimeDrag?.item === item &&
    validPoint(generatedRuntimeDrag.startPoint)
  ) {
    return generatedRuntimeDrag.startPoint;
  }
  return generatedItemCenterPoint(canvas, item);
}

function ensureGeneratedMeasurementSlotIndexes(canvas, activeItem = null) {
  if (!isGeneratedLayoutCanvas(canvas)) {
    return [];
  }
  const qubits = generatedItemsOfType(canvas, "qubit");
  const assigned = new Set();
  qubits.forEach((item) => {
    const roomIndex = roomQubitIndexForItem(item);
    if (Number.isInteger(roomIndex)) {
      item.dataset.generatedMeasurementSlotIndex = String(roomIndex);
      assigned.add(roomIndex);
    }
  });
  const remaining = qubits
    .filter((item) => !Number.isInteger(roomQubitIndexForItem(item)))
    .sort((left, right) => {
      const leftPoint = generatedMeasurementSlotSourcePoint(canvas, left, activeItem);
      const rightPoint = generatedMeasurementSlotSourcePoint(
        canvas,
        right,
        activeItem,
      );
      return leftPoint.y - rightPoint.y || leftPoint.x - rightPoint.x;
    });
  let nextSlot = 0;
  remaining.forEach((item) => {
    const existing = generatedMeasurementSlotIndexForItem(item);
    if (Number.isInteger(existing) && !assigned.has(existing)) {
      assigned.add(existing);
      return;
    }
    while (assigned.has(nextSlot)) {
      nextSlot += 1;
    }
    item.dataset.generatedMeasurementSlotIndex = String(nextSlot);
    assigned.add(nextSlot);
  });
  return qubits;
}

function ensureDistinctQubitLogicalIdsForRegisterMembers(members) {
  if (!Array.isArray(members)) {
    return false;
  }
  const seen = new Set();
  let changed = false;
  members.forEach((member) => {
    const item = member?.item;
    if (!(item instanceof HTMLElement) || item.dataset.component !== "qubit") {
      return;
    }
    let qubitId = ensureQubitLogicalId(item);
    if (qubitId && !seen.has(qubitId)) {
      seen.add(qubitId);
      return;
    }
    qubitId = reserveNextQubitId();
    item.dataset.qubitId = String(qubitId);
    seen.add(qubitId);
    changed = true;
  });
  return changed;
}

function generatedItemById(canvas, itemId) {
  if (!isGeneratedLayoutCanvas(canvas) || !itemId) {
    return null;
  }
  const escapedId =
    typeof CSS !== "undefined" && typeof CSS.escape === "function"
      ? CSS.escape(itemId)
      : String(itemId).replace(/"/g, '\\"');
  const item = canvas.querySelector(`[data-generated-item-id="${escapedId}"]`);
  return item instanceof HTMLElement ? item : null;
}

function generatedQubitItemForRecordedAction(canvas, itemId, logicalQubitId) {
  const item = generatedItemById(canvas, itemId);
  if (isGeneratedQubitItem(item)) {
    return item;
  }
  const normalizedLogicalId = normalizeQubitId(logicalQubitId);
  if (!normalizedLogicalId) {
    return null;
  }
  return (
    generatedItemsOfType(canvas, "qubit").find(
      (candidate) => qubitLogicalIdForItem(candidate) === normalizedLogicalId,
    ) || null
  );
}

function generatedItemsByIds(canvas, itemIds) {
  return (Array.isArray(itemIds) ? itemIds : [])
    .map((itemId) => generatedItemById(canvas, itemId))
    .filter((item) => item instanceof HTMLElement);
}

function cloneGeneratedExperiment(experiment) {
  if (!experiment || typeof experiment !== "object") {
    return null;
  }
  const clone = cloneJson(experiment);
  return clone && typeof clone === "object" ? clone : null;
}

function generatedExperimentStateForCanvas(canvas) {
  if (!isGeneratedLayoutCanvas(canvas)) {
    return null;
  }
  let state = generatedExperimentStates.get(canvas);
  if (!state) {
    state = {
      recording: false,
      playing: false,
      actions: [],
      experiment: null,
      toolbar: null,
      status: null,
      startedAt: 0,
      initialQubits: [],
      gateSettings: [],
      suppressActionRecording: false,
      controlActionQueue: [],
      controlActionReplayRunning: false,
      replayGateSettingsChanged: false,
      playbackResultVisible: false,
    };
    generatedExperimentStates.set(canvas, state);
  }
  return state;
}

function isGeneratedExperimentRecording(canvas) {
  return Boolean(generatedExperimentStateForCanvas(canvas)?.recording);
}

function generatedTabEntryForCanvas(canvas) {
  if (!isGeneratedLayoutCanvas(canvas)) {
    return null;
  }
  const tabId = canvas.dataset.generatedTabId || "";
  if (!tabId) {
    return null;
  }
  return (
    (generatedTabsState.tabs || []).find((entry) => entry?.id === tabId) ||
    null
  );
}

function clearGeneratedExperimentStateForCanvas(canvas) {
  const state = generatedExperimentStateForCanvas(canvas);
  if (!state) {
    return;
  }
  state.recording = false;
  state.playing = false;
  state.actions = [];
  state.experiment = null;
  state.startedAt = 0;
  state.initialQubits = [];
  state.gateSettings = [];
  state.suppressActionRecording = false;
  state.controlActionQueue = [];
  state.controlActionReplayRunning = false;
  state.replayGateSettingsChanged = false;
  state.playbackResultVisible = false;
  canvas.classList.remove("generated-recording-active");
  updateGeneratedExperimentToolbar(canvas);
}

function setGeneratedExperimentPlaybackResultVisible(canvas, visible) {
  const state = generatedExperimentStateForCanvas(canvas);
  if (state) {
    state.playbackResultVisible = Boolean(visible);
  }
}

function markDocumentEditorCanvasEdited(canvas = docEditorCanvas) {
  if (isDocumentEditorCanvas(canvas)) {
    setGeneratedExperimentPlaybackResultVisible(canvas, false);
  }
}

function clearGeneratedTransientStateForCanvas(canvas) {
  if (!isGeneratedLayoutCanvas(canvas)) {
    return;
  }
  if (generatedRuntimeDrag?.canvas === canvas) {
    generatedRuntimeDrag.item?.classList.remove("dragging");
    generatedRuntimeDrag = null;
  }
  if (generatedLayoutGesture?.canvas === canvas) {
    generatedLayoutGesture.part?.classList.remove("layout-edit-dragging");
    generatedLayoutGesture.item?.classList.remove("dragging", "resizing");
    generatedLayoutGesture = null;
  }
  if (
    selectedGeneratedLayoutItem instanceof HTMLElement &&
    generatedCanvasForItem(selectedGeneratedLayoutItem) === canvas
  ) {
    clearSelectedGeneratedLayoutItem();
  }
  clearGeneratedExperimentStateForCanvas(canvas);
  releaseGeneratedRuntimeSlotsForCanvas(canvas);
  clearGeneratedMeasurementsForCanvas(canvas);
}

function resetGeneratedTabForCanvas(canvas) {
  const entry = generatedTabEntryForCanvas(canvas);
  const panel = canvas?.closest?.('[data-generated-layout-panel="true"]');
  if (!entry || !(panel instanceof HTMLElement)) {
    return false;
  }
  if (documentRuntimeState.canvas === canvas) {
    resetDocumentRuntimeState();
  }
  clearGeneratedTransientStateForCanvas(canvas);
  renderGeneratedLayoutPanel(panel, entry);
  pruneGeneratedRuntimeState();
  return true;
}

function refreshGeneratedTabPanelFromState(tabId, state = generatedTabsState) {
  const normalizedTabId = storageIdentifierKey(tabId);
  if (!normalizedTabId) {
    return false;
  }
  const entry =
    (state?.tabs || []).find(
      (candidate) => storageIdentifierKey(candidate?.id) === normalizedTabId,
    ) || null;
  const panel = document.getElementById(`panel-${normalizedTabId}`);
  if (!entry || !(panel instanceof HTMLElement)) {
    return false;
  }
  const existingCanvas = panel.querySelector(".generated-layout-canvas");
  if (existingCanvas instanceof HTMLElement) {
    clearGeneratedTransientStateForCanvas(existingCanvas);
  }
  renderGeneratedLayoutPanel(panel, entry);
  pruneGeneratedRuntimeState();
  return true;
}

function generatedCanvasAllowsRuntime(canvas) {
  const state = generatedExperimentStateForCanvas(canvas);
  if (
    isEntanglementThreeCanvas(canvas) &&
    mailboxRoomExperimentControlInProgress() &&
    !state?.playing
  ) {
    return false;
  }
  return (
    !layoutEditorState.enabled ||
    isGeneratedExperimentRecording(canvas) ||
    isDocumentRuntimeCanvas(canvas)
  );
}

function generatedCanvasAllowsGateDialInteraction(canvas) {
  return generatedCanvasAllowsRuntime(canvas) || isDocumentEditorCanvas(canvas);
}

function generatedItemCenterSnapshot(canvas, item) {
  if (!isGeneratedLayoutCanvas(canvas) || !(item instanceof HTMLElement)) {
    return null;
  }
  const center = generatedCanvasPointForElementCenter(canvas, item);
  return {
    x: Number.parseFloat(center.x.toFixed(2)),
    y: Number.parseFloat(center.y.toFixed(2)),
  };
}

function generatedRuntimeVectorSnapshot(item) {
  const state = ensureGeneratedQubitRuntimeState(item);
  return state ? normalizeVector2(state.vector).slice() : [1, 0];
}

function captureGeneratedInitialQubits(canvas) {
  return generatedItemsOfType(canvas, "qubit").map((item) => {
    const entry = {
      itemId: ensureGeneratedItemId(item, "qubit"),
      logicalQubitId: ensureQubitLogicalId(item),
      center: generatedItemCenterSnapshot(canvas, item),
      vector: generatedRuntimeVectorSnapshot(item),
    };
    const roomQubitIndex = roomQubitIndexForItem(item);
    if (Number.isInteger(roomQubitIndex)) {
      entry.roomQubitIndex = roomQubitIndex;
    }
    return entry;
  });
}

function captureGeneratedGateSettings(canvas) {
  return generatedItemsOfType(canvas, "single-gate").map((item) => {
    const runtime = initializeGeneratedSingleGateItem(item, {
      singleGateTick: generatedSingleGateRuntimes.get(item)?.activeTick,
    });
    return {
      itemId: ensureGeneratedItemId(item, "single-gate"),
      tickIndex: normalizeTickIndex(runtime?.activeTick ?? 0),
    };
  });
}

function syncGeneratedExperimentGateSettingsFromCanvas(canvas) {
  const state = generatedExperimentStateForCanvas(canvas);
  if (!state || state.playing || state.recording) {
    return;
  }
  state.gateSettings = captureGeneratedGateSettings(canvas);
}

function markGeneratedReplayGateSettingsChanged(canvas) {
  const state = generatedExperimentStateForCanvas(canvas);
  if (!state || state.playing || state.recording || !state.experiment) {
    return;
  }
  state.gateSettings = captureGeneratedGateSettings(canvas);
  state.replayGateSettingsChanged = true;
  state.playbackResultVisible = false;
}

function updateGeneratedExperimentToolbar(canvas) {
  const state = generatedExperimentStateForCanvas(canvas);
  if (!state) {
    return;
  }
  if (state.status instanceof HTMLElement) {
    if (isEntanglementThreeCanvas(canvas)) {
      renderEntanglementThreeRoomReviewStatus(state.status);
      return;
    }
    state.status.classList.remove("entanglement-room-review-status");
    const statusText = state.playing
      ? "Running experiment"
      : state.recording
        ? "Recording"
        : state.experiment
          ? "Experiment ready"
          : "No experiment recorded";
    state.status.textContent = statusText;
  }
}

function recordGeneratedExperimentAction(canvas, action) {
  const state = generatedExperimentStateForCanvas(canvas);
  if (
    !state?.recording ||
    !action?.type ||
    (state.suppressActionRecording &&
      !isGeneratedExperimentControlAction(action))
  ) {
    return;
  }
  state.actions.push({
    ...action,
    t: Math.round(performance.now() - state.startedAt),
  });
}

function currentGeneratedRecordingExperiment(canvas) {
  const state = generatedExperimentStateForCanvas(canvas);
  if (!state) {
    return null;
  }
  return {
    version: 1,
    recordedAt: Date.now(),
    initialQubits: state.initialQubits,
    gateSettings: state.gateSettings.map((entry) => ({ ...entry })),
    actions: cloneRecordedActions(state.actions),
  };
}

function syncDraftGeneratedExperimentFromRecording(canvas) {
  const state = generatedExperimentStateForCanvas(canvas);
  if (!state?.recording) {
    return null;
  }
  state.experiment = currentGeneratedRecordingExperiment(canvas);
  updateGeneratedExperimentToolbar(canvas);
  return state.experiment;
}

function recordGeneratedGateSettingAction(canvas, gateItem, tickIndex) {
  const state = generatedExperimentStateForCanvas(canvas);
  if (!state?.recording || !(gateItem instanceof HTMLElement)) {
    return;
  }
  const normalizedTick = normalizeTickIndex(tickIndex);
  const gateId = ensureGeneratedItemId(gateItem, "single-gate");
  const previousAction = state.actions[state.actions.length - 1];
  if (
    previousAction?.type === "gate-setting" &&
    previousAction.gateId === gateId &&
    normalizeTickIndex(previousAction.tickIndex ?? 0) === normalizedTick
  ) {
    return;
  }
  recordGeneratedExperimentAction(canvas, {
    type: "gate-setting",
    gateId,
    tickIndex: normalizedTick,
  });
}

function appendGeneratedDragRecordPoint(gesture) {
  if (!gesture?.recordingPath) {
    return;
  }
  const center = generatedItemCenterSnapshot(gesture.canvas, gesture.item);
  if (!center) {
    return;
  }
  const last = gesture.recordingPath[gesture.recordingPath.length - 1];
  if (last && Math.hypot(last.x - center.x, last.y - center.y) < 4) {
    return;
  }
  gesture.recordingPath.push({
    ...center,
    t: Math.round(performance.now() - gesture.recordingStartedAt),
  });
}

function commitGeneratedDragRecord(gesture) {
  if (!gesture?.recordingPath || gesture.recordingPath.length < 2) {
    return;
  }
  appendGeneratedDragRecordPoint(gesture);
  recordGeneratedExperimentAction(gesture.canvas, {
    type: "drag",
    qubitId: ensureGeneratedItemId(gesture.item, "qubit"),
    qubitLogicalId: qubitLogicalIdForItem(gesture.item),
    path: gesture.recordingPath.map((point) => ({ ...point })),
  });
  gesture.recordingPath = null;
}

function beginGeneratedExperimentRecording(canvas) {
  const state = generatedExperimentStateForCanvas(canvas);
  if (!state || state.playing) {
    return false;
  }
  if (state.recording) {
    return true;
  }
  if (layoutEditorState.enabled) {
    setLayoutEditEnabled(false);
  }
  state.recording = true;
  state.actions = [];
  state.startedAt = performance.now();
  state.initialQubits = captureGeneratedInitialQubits(canvas);
  state.gateSettings = captureGeneratedGateSettings(canvas);
  state.experiment = null;
  state.suppressActionRecording = false;
  state.controlActionQueue = [];
  state.controlActionReplayRunning = false;
  state.replayGateSettingsChanged = false;
  state.playbackResultVisible = false;
  canvas.classList.add("generated-recording-active");
  updateGeneratedExperimentToolbar(canvas);
  return true;
}

function startGeneratedDragRecordingIfNeeded(gesture) {
  if (!gesture?.canvas || gesture.recordingPath) {
    return Boolean(gesture?.recordingPath);
  }
  const state = generatedExperimentStateForCanvas(gesture.canvas);
  if (!state || state.playing) {
    return false;
  }
  if (!state.recording && !beginGeneratedExperimentRecording(gesture.canvas)) {
    return false;
  }
  const initialRecordPoint =
    gesture.initialRecordPoint ||
    generatedItemCenterSnapshot(gesture.canvas, gesture.item);
  if (!initialRecordPoint) {
    return false;
  }
  const recordingState = generatedExperimentStateForCanvas(gesture.canvas);
  gesture.recordingPath = [
    {
      ...initialRecordPoint,
      t: 0,
    },
  ];
  gesture.recordingStartedAt = recordingState?.startedAt || performance.now();
  return true;
}

function finishGeneratedExperimentRecording(canvas) {
  const state = generatedExperimentStateForCanvas(canvas);
  if (!state?.recording) {
    return;
  }
  state.recording = false;
  canvas.classList.remove("generated-recording-active");
  state.experiment = currentGeneratedRecordingExperiment(canvas);
  state.gateSettings = captureGeneratedGateSettings(canvas);
  state.replayGateSettingsChanged = false;
  updateGeneratedExperimentToolbar(canvas);
}

function finishGeneratedExperimentRecordingAfterMeasurement(canvas, options = {}) {
  const forceStop = Boolean(options.forceStop);
  if (isGeneratedExperimentRecording(canvas)) {
    if (isDocumentEditorCanvas(canvas) && !forceStop) {
      syncDraftGeneratedExperimentFromRecording(canvas);
      refreshGeneratedMeasurementFillsForCanvas(canvas);
      updateDocEditorButtons();
      return;
    }
    if (isDocumentEditorCanvas(canvas)) {
      syncDraftGeneratedExperimentFromRecording(canvas);
      refreshGeneratedMeasurementFillsForCanvas(canvas);
    }
    finishGeneratedExperimentRecording(canvas);
    handleDocumentExperimentAutoFinished(canvas);
    if (isDocumentEditorCanvas(canvas)) {
      updateDocEditorButtons();
    }
  }
}

function generatedToolbarForCanvas(canvas) {
  if (!isGeneratedLayoutCanvas(canvas)) {
    return null;
  }
  const panel = canvas.closest('[data-generated-layout-panel="true"]');
  if (!(panel instanceof HTMLElement)) {
    return null;
  }
  const toolbar = panel.querySelector(".generated-editor-toolbar");
  return toolbar instanceof HTMLElement ? toolbar : null;
}

function updateGeneratedEditorButtons(canvas = activeGeneratedLayoutCanvas()) {
  const toolbar = generatedToolbarForCanvas(canvas);
  if (!toolbar) {
    return;
  }
  const selectedOnCanvas =
    selectedGeneratedLayoutItem instanceof HTMLElement &&
    selectedGeneratedLayoutItem.isConnected &&
    selectedGeneratedLayoutItem.parentElement === canvas;
  const duplicateButton = toolbar.querySelector(
    '[data-generated-editor-action="duplicate"]',
  );
  const deleteButton = toolbar.querySelector(
    '[data-generated-editor-action="delete"]',
  );
  const saveComponentButton = toolbar.querySelector(
    '[data-generated-editor-action="save-component"]',
  );
  [saveComponentButton, duplicateButton, deleteButton].forEach((button) => {
    if (button instanceof HTMLButtonElement) {
      button.disabled = !selectedOnCanvas;
    }
  });
}

function clearSelectedGeneratedLayoutPart() {
  if (selectedGeneratedLayoutPart) {
    selectedGeneratedLayoutPart.classList.remove("layout-edit-selected");
  }
  selectedGeneratedLayoutPart = null;
}

function clearSelectedGeneratedLayoutItem() {
  if (selectedGeneratedLayoutItem) {
    selectedGeneratedLayoutItem.classList.remove("selected");
  }
  clearSelectedGeneratedLayoutPart();
  selectedGeneratedLayoutItem = null;
  updateGeneratedEditorButtons();
  updateDocEditorButtons();
}

function setSelectedGeneratedLayoutItem(item, part = null) {
  if (
    !(item instanceof HTMLElement) ||
    !isGeneratedLayoutItem(item) ||
    !item.isConnected
  ) {
    clearSelectedGeneratedLayoutItem();
    return;
  }
  if (selectedGeneratedLayoutItem && selectedGeneratedLayoutItem !== item) {
    selectedGeneratedLayoutItem.classList.remove("selected");
  }
  clearSelectedGeneratedLayoutPart();
  selectedGeneratedLayoutItem = item;
  if (layoutEditorState.enabled) {
    selectedGeneratedLayoutItem.classList.add("selected");
  } else {
    selectedGeneratedLayoutItem.classList.remove("selected");
  }
  if (
    part instanceof HTMLElement &&
    item.contains(part) &&
    layoutEditorState.enabled
  ) {
    selectedGeneratedLayoutPart = part;
    selectedGeneratedLayoutPart.classList.add("layout-edit-selected");
  }
  updateGeneratedEditorButtons(generatedCanvasForItem(item));
  updateDocEditorButtons();
}

function getGeneratedQubitCore(item) {
  if (!isGeneratedQubitItem(item)) {
    return null;
  }
  const core = item.querySelector(".playground-qubit-core");
  return core instanceof HTMLElement ? core : item;
}

function generatedAnimatedReplaySpeedForIterationCount(iterations) {
  const count = Math.max(1, Number(iterations) || 1);
  return count > 1 && count < 100 ? count : 1;
}

function scaledGeneratedDuration(duration) {
  const rawDuration = Math.max(0, Number(duration) || 0);
  const speed = Math.max(1, Number(generatedExperimentPlaybackSpeed) || 1);
  return rawDuration / speed;
}

function waitForDuration(duration) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, scaledGeneratedDuration(duration));
  });
}

function nextAnimationFrame() {
  return new Promise((resolve) => {
    window.requestAnimationFrame(() => resolve());
  });
}

function pruneGeneratedRuntimeState() {
  [
    generatedSingleGateRuntimes,
    generatedQubitRuntimes,
    generatedSingleMeasurementRuntimes,
    generatedDoubleMeasurementRuntimes,
    generatedSeparatedPairMeasurementRuntimes,
    generatedCnotRuntimes,
  ].forEach((runtimeMap) => {
    Array.from(runtimeMap.keys()).forEach((item) => {
      if (!item.isConnected) {
        runtimeMap.delete(item);
      }
    });
  });
}

function applyGeneratedQubitVectorVisualState(item) {
  const state = generatedQubitRuntimes.get(item);
  const core = getGeneratedQubitCore(item);
  if (!state || !(core instanceof HTMLElement)) {
    return;
  }
  const [blueWeight, redWeight] = probabilitiesFromVector2(state.vector);
  core.style.setProperty("--qubit-fill", blendBlueRed(blueWeight, redWeight));
  const phaseSign = phaseSignForRealAmplitudeVector(state.vector);
  if (phaseSign) {
    core.dataset.phaseSign = phaseSign;
  } else {
    delete core.dataset.phaseSign;
  }
}

function ensureGeneratedQubitRuntimeState(item) {
  if (!isGeneratedQubitItem(item)) {
    return null;
  }
  let state = generatedQubitRuntimes.get(item);
  if (!state) {
    state = {
      vector: generatedInitialVectorForQubitItem(item),
      transiting: false,
      pairState: null,
      pairQubitIndex: null,
      cnotSourceSlot: null,
      cnotPairToken: null,
      cnotOutcomeProbabilities: null,
      doubleMeasurementReturnPoint: null,
    };
    generatedQubitRuntimes.set(item, state);
  }
  applyGeneratedQubitVectorVisualState(item);
  return state;
}

function generatedInitialVectorForQubitItem(item) {
  try {
    const parsed = JSON.parse(item?.dataset?.initialVector || "null");
    if (Array.isArray(parsed)) {
      return normalizeVector2(parsed);
    }
  } catch (_error) {
    // Fall back to blue when a saved layout has a malformed vector.
  }
  return [1, 0];
}

function clearGeneratedQubitPairState(qubitItem) {
  const state = ensureGeneratedQubitRuntimeState(qubitItem);
  if (!state) {
    return;
  }
  state.pairState = null;
  state.pairQubitIndex = null;
}

function syncGeneratedPairStateVisuals(pairState) {
  if (!pairState?.members) {
    return;
  }
  pairState.members.forEach(({ item, state, qubitIndex }) => {
    if (!(item instanceof HTMLElement) || !item.isConnected || !state) {
      return;
    }
    state.vector = displayVectorForPairMember(pairState, qubitIndex);
    applyGeneratedQubitVectorVisualState(item);
  });
}

function setGeneratedMeasuredQubitVisualState(qubitItem, color) {
  const state = ensureGeneratedQubitRuntimeState(qubitItem);
  if (!state) {
    return;
  }
  state.vector = color === "red" ? [0, 1] : [1, 0];
  applyGeneratedQubitVectorVisualState(qubitItem);
}

function createGeneratedPairState(topQubitItem, bottomQubitItem) {
  const topState = ensureGeneratedQubitRuntimeState(topQubitItem);
  const bottomState = ensureGeneratedQubitRuntimeState(bottomQubitItem);
  if (!topState || !bottomState) {
    return null;
  }
  const pairState = {
    amplitudes: entangledAmplitudesFromQubitVectors(
      topState.vector,
      bottomState.vector,
    ),
    displayMode: "marginal",
    members: [
      { item: topQubitItem, state: topState, qubitIndex: 0 },
      { item: bottomQubitItem, state: bottomState, qubitIndex: 1 },
    ],
  };
  topState.pairState = pairState;
  topState.pairQubitIndex = 0;
  bottomState.pairState = pairState;
  bottomState.pairQubitIndex = 1;
  return pairState;
}

function runtimeRegisterOperandForQubit(
  qubitItem,
  state,
  { participantId = null } = {},
) {
  if (state?.pairState && Number.isFinite(state.pairQubitIndex)) {
    return {
      registerState: state.pairState,
      register: registerStateAsQuantumRegister(state.pairState),
      controlOrTargetIndex: state.pairQubitIndex,
      members: Array.isArray(state.pairState.members)
        ? state.pairState.members
        : [],
    };
  }
  return {
    registerState: null,
    register:
      quantumCore?.createQubit && Array.isArray(state?.vector)
        ? quantumCore.createQubit(state.vector)
        : null,
    controlOrTargetIndex: 0,
    members: [
      {
        item: qubitItem,
        state,
        qubitIndex: 0,
        participantId,
        role: "local",
      },
    ],
  };
}

function generatedRuntimeRegisterOperand(qubitItem, state) {
  return runtimeRegisterOperandForQubit(qubitItem, state, {
    participantId: mailboxRoomState.participantId || null,
  });
}

function mergeRuntimeRegistersForCnot(
  topQubitItem,
  bottomQubitItem,
  topState,
  bottomState,
  { participantId = null, applyRemoteVisual = null } = {},
) {
  if (!topState || !bottomState || !quantumCore?.tensorProductRegisters) {
    return null;
  }
  const topOperand = runtimeRegisterOperandForQubit(topQubitItem, topState, {
    participantId,
  });
  const bottomOperand = runtimeRegisterOperandForQubit(bottomQubitItem, bottomState, {
    participantId,
  });
  if (!topOperand.register || !bottomOperand.register) {
    return null;
  }
  if (
    topOperand.register.numQubits + bottomOperand.register.numQubits >
    SHARED_REGISTER_MAX_QUBITS
  ) {
    return null;
  }
  const topHasRegister = Boolean(topOperand.registerState);
  const bottomHasRegister = Boolean(bottomOperand.registerState);
  const preserveBottomRegisterOrder = bottomHasRegister && !topHasRegister;
  const firstOperand = preserveBottomRegisterOrder ? bottomOperand : topOperand;
  const secondOperand = preserveBottomRegisterOrder ? topOperand : bottomOperand;
  const offset = firstOperand.register.numQubits;
  const combined = sharedRegisterTensor([
    firstOperand.register,
    secondOperand.register,
  ]);
  if (!combined) {
    return null;
  }
  const controlIndex = preserveBottomRegisterOrder
    ? offset + topOperand.controlOrTargetIndex
    : topOperand.controlOrTargetIndex;
  const targetIndex = preserveBottomRegisterOrder
    ? bottomOperand.controlOrTargetIndex
    : offset + bottomOperand.controlOrTargetIndex;
  const existingRemote =
    topOperand.registerState?.remoteEntanglementId
      ? topOperand.registerState
      : bottomOperand.registerState?.remoteEntanglementId
        ? bottomOperand.registerState
        : topOperand.registerState || bottomOperand.registerState || null;
  const firstMembers = firstOperand.members.map((member) => ({
    ...member,
    qubitIndex: member.qubitIndex,
  }));
  const secondMembers = secondOperand.members.map((member) => ({
    ...member,
    qubitIndex: offset + member.qubitIndex,
  }));
  const registerState = {
    numQubits: combined.numQubits,
    amplitudes: realAmplitudesFromQuantumRegister(
      combined,
      2 ** combined.numQubits,
    ),
    displayMode: "conditional",
    members: [...firstMembers, ...secondMembers],
    remoteEntanglementId: existingRemote?.remoteEntanglementId,
    remoteVersion: existingRemote?.remoteVersion,
    remoteMembers: Array.isArray(existingRemote?.remoteMembers)
      ? existingRemote.remoteMembers.map((member) => ({ ...member }))
      : [],
  };
  ensureDistinctQubitLogicalIdsForRegisterMembers(registerState.members);
  registerState.members.forEach((member) => {
    assignRuntimeStateToRegisterMember(member, registerState, member.qubitIndex);
    if (member.item instanceof HTMLElement && registerState.remoteEntanglementId) {
      const updateRemoteVisual =
        typeof applyRemoteVisual === "function"
          ? applyRemoteVisual
          : mailboxRoomSetRemoteEntanglementVisual;
      updateRemoteVisual(
        member.item,
        registerState.remoteEntanglementId,
      );
    }
  });
  applyCNOTToRegisterState(registerState, controlIndex, targetIndex);
  return registerState;
}

function mergeGeneratedRegistersForCnot(topQubitItem, bottomQubitItem) {
  const topState = ensureGeneratedQubitRuntimeState(topQubitItem);
  const bottomState = ensureGeneratedQubitRuntimeState(bottomQubitItem);
  const registerState = mergeRuntimeRegistersForCnot(
    topQubitItem,
    bottomQubitItem,
    topState,
    bottomState,
    {
      participantId: mailboxRoomState.participantId || null,
      applyRemoteVisual: mailboxRoomSetRemoteEntanglementVisual,
    },
  );
  if (registerState) {
    syncGeneratedPairStateVisuals(registerState);
  }
  return registerState;
}

function applyGeneratedSingleGateToQubitState(qubitItem, tickIndex) {
  const state = ensureGeneratedQubitRuntimeState(qubitItem);
  if (!state) {
    return;
  }
  if (state.pairState && Number.isFinite(state.pairQubitIndex)) {
    applySingleQubitGateToPair(
      state.pairState,
      state.pairQubitIndex,
      gateMatrixForTick(tickIndex),
    );
    syncGeneratedPairStateVisuals(state.pairState);
    mailboxRoomQueueSharedEntanglementUpdate(state.pairState)?.catch(() => {});
    return;
  }
  state.vector = normalizeVector2(
    vectorTimesMatrix2(state.vector, gateMatrixForTick(tickIndex)),
  );
  applyGeneratedQubitVectorVisualState(qubitItem);
}

function collapseGeneratedSingleQubitFromPair(qubitItem, color, options = {}) {
  const state = ensureGeneratedQubitRuntimeState(qubitItem);
  const pairState = state?.pairState;
  if (!state || !pairState || !Number.isFinite(state.pairQubitIndex)) {
    return false;
  }
  if (pairState.remoteEntanglementId && options.deferRemoteRegisterMeasurement) {
    const measuredIndex = state.pairQubitIndex;
    if (!sharedRegisterMeasureMember(pairState, measuredIndex, color)) {
      return false;
    }
    syncGeneratedPairStateVisuals(pairState);
    return true;
  }
  if (registerStateNumQubits(pairState) !== 2) {
    const measuredIndex = state.pairQubitIndex;
    if (!sharedRegisterMeasureMember(pairState, measuredIndex, color)) {
      return false;
    }
    syncGeneratedPairStateVisuals(pairState);
    mailboxRoomQueueSharedEntanglementUpdate(pairState)?.catch(() => {});
    return true;
  }
  const measuredIndex = state.pairQubitIndex;
  const otherMember = pairState.members?.find(
    (member) => member.state && member.state !== state,
  );
  const otherVector = conditionalVectorAfterPairMeasurement(
    pairState,
    measuredIndex,
    color,
  );
  collapsePairStateBySingleQubitMeasurement(pairState, measuredIndex, color);
  if (pairState.remoteEntanglementId) {
    const measuredVector = color === "blue" ? [1, 0] : [0, 1];
    const memberVectors = [];
    memberVectors[measuredIndex] = measuredVector;
    memberVectors[measuredIndex === 0 ? 1 : 0] = otherVector;
    mailboxRoomQueueSharedEntanglementUpdate(pairState, {
      status: "separated",
      memberVectors,
    })?.catch(() => {});
  }
  state.vector = color === "blue" ? [1, 0] : [0, 1];
  state.pairState = null;
  state.pairQubitIndex = null;
  state.cnotSourceSlot = null;
  state.cnotPairToken = null;
  state.cnotOutcomeProbabilities = null;
  state.doubleMeasurementReturnPoint = null;
  mailboxRoomSetRemoteEntanglementVisual(qubitItem, "");
  if (otherMember?.state) {
    otherMember.state.vector = otherVector;
    otherMember.state.pairState = null;
    otherMember.state.pairQubitIndex = null;
    otherMember.state.cnotSourceSlot = null;
    otherMember.state.cnotPairToken = null;
    otherMember.state.cnotOutcomeProbabilities = null;
    if (otherMember.item instanceof HTMLElement) {
      applyGeneratedQubitVectorVisualState(otherMember.item);
    }
  }
  applyGeneratedQubitVectorVisualState(qubitItem);
  return true;
}

function settleGeneratedQubitVisualState(item) {
  const core = getGeneratedQubitCore(item);
  item.classList.remove("migrating");
  item.style.removeProperty("--move-duration");
  if (!(core instanceof HTMLElement)) {
    return;
  }
  core.classList.remove("migrating");
  core.classList.remove("melting");
  core.classList.remove("collapse-animating");
  core.classList.remove("measurement-pellet");
  core.style.opacity = "";
  core.style.removeProperty("--move-duration");
  core.style.removeProperty("--melt-duration");
}

function generatedCanvasPointForElementCenter(canvas, element) {
  const rect = element.getBoundingClientRect();
  return generatedViewportPointToCanvasPoint(
    canvas,
    rect.left + rect.width / 2,
    rect.top + rect.height / 2,
  );
}

function generatedCanvasXForElementLeft(canvas, element) {
  const rect = element.getBoundingClientRect();
  return generatedViewportPointToCanvasPoint(canvas, rect.left, rect.top).x;
}

function generatedCanvasXForElementRight(canvas, element) {
  const rect = element.getBoundingClientRect();
  return generatedViewportPointToCanvasPoint(canvas, rect.right, rect.top).x;
}

function cnotSpringExpandedLength(spring) {
  const styleWidth = Number.parseFloat(getComputedStyle(spring).width);
  if (Number.isFinite(styleWidth) && styleWidth > 0) {
    return styleWidth;
  }
  return spring.offsetWidth || spring.getBoundingClientRect().width || 0;
}

function setGeneratedQubitCenter(canvas, qubitItem, x, y) {
  const safeX = Number.isFinite(x) ? x : canvas.clientWidth / 2;
  const safeY = Number.isFinite(y) ? y : canvas.clientHeight / 2;
  const nextLeft = safeX - qubitItem.offsetWidth / 2;
  const nextTop = safeY - qubitItem.offsetHeight / 2;
  const clamped = generatedLayoutClampItemPosition(
    canvas,
    qubitItem,
    nextLeft,
    nextTop,
  );
  qubitItem.style.left = `${Math.round(clamped.left)}px`;
  qubitItem.style.top = `${Math.round(clamped.top)}px`;
}

function generatedQubitOverlapRatioWithRect(qubitItem, target) {
  const qubitRect = qubitItem.getBoundingClientRect();
  const targetRect = target.getBoundingClientRect();
  const overlapWidth = Math.max(
    0,
    Math.min(qubitRect.right, targetRect.right) -
      Math.max(qubitRect.left, targetRect.left),
  );
  const overlapHeight = Math.max(
    0,
    Math.min(qubitRect.bottom, targetRect.bottom) -
      Math.max(qubitRect.top, targetRect.top),
  );
  const overlapArea = overlapWidth * overlapHeight;
  const qubitArea = qubitRect.width * qubitRect.height;
  const targetArea = targetRect.width * targetRect.height;
  const comparisonArea = Math.min(qubitArea, targetArea);
  return comparisonArea > 0 ? overlapArea / comparisonArea : 0;
}

function generatedCircleIntersectionArea(r1, r2, distance) {
  if (distance >= r1 + r2) {
    return 0;
  }
  if (distance <= Math.abs(r1 - r2)) {
    const minRadius = Math.min(r1, r2);
    return Math.PI * minRadius * minRadius;
  }

  const a1 = r1 * r1;
  const a2 = r2 * r2;
  const alpha = Math.acos(
    (distance * distance + a1 - a2) / (2 * distance * r1),
  );
  const beta = Math.acos((distance * distance + a2 - a1) / (2 * distance * r2));

  return (
    a1 * alpha +
    a2 * beta -
    0.5 *
      Math.sqrt(
        (-distance + r1 + r2) *
          (distance + r1 - r2) *
          (distance - r1 + r2) *
          (distance + r1 + r2),
      )
  );
}

function prepareGeneratedMeasurementParts(item) {
  if (
    !(item instanceof HTMLElement) ||
    (!isMeasurementComponentType(item.dataset.component) &&
      !isSeparatedPairMeasurementGroupElement(item))
  ) {
    return;
  }
  const entries = isSeparatedPairMeasurementGroupElement(item)
    ? editableSavedGroupChildPartEntries(item)
    : editableMeasurementPartSpecsForType(item.dataset.component)
        .map((spec) => {
          const element = item.querySelector(spec.selector);
          return element instanceof HTMLElement ? { spec, element } : null;
        })
        .filter(Boolean);
  if (entries.length === 0) {
    clearMeasurementPartLayoutEditing(item);
    return;
  }
  entries.forEach(({ spec, element }) => {
    element.dataset.playgroundMeasurementPart = spec.key;
    element.dataset.layoutEditTarget = "true";
    element.dataset.layoutResizable = spec.resizable ? "true" : "false";
    element.dataset.layoutUniformResize = spec.uniform ? "true" : "false";
    element.dataset.layoutMinWidth = `${spec.minWidth || 24}`;
    element.dataset.layoutMinHeight = `${spec.minHeight || 24}`;
    if (!element.style.translate) {
      setLayoutTargetTranslate(element, 0, 0);
    }
    if (window.getComputedStyle(element).position === "static") {
      element.style.position = "relative";
    }
    if (spec.resizable) {
      ensureLayoutResizeHandle(element);
    }
  });
}

function prepareGeneratedLayoutItem(item) {
  if (!isGeneratedLayoutItem(item)) {
    return;
  }
  ensureGeneratedItemId(item);
  ensureQubitLogicalId(item);
  item.dataset.layoutEditTarget = "true";
  item.dataset.layoutResizable = "true";
  item.dataset.layoutUniformResize =
    item.dataset.component === "qubit" ? "true" : "false";
  const minSize = minGeneratedLayoutSizeForType(item.dataset.component);
  item.dataset.layoutMinWidth = `${minSize.minWidth}`;
  item.dataset.layoutMinHeight = `${minSize.minHeight}`;
  syncGeneratedTextBoxEditability(item);
  ensureLayoutResizeHandle(item);
  prepareGeneratedMeasurementParts(item);
}

function prepareGeneratedLayoutCanvas(canvas) {
  if (!isGeneratedLayoutCanvas(canvas)) {
    return;
  }
  canvas.querySelectorAll(".playground-node").forEach((item) => {
    if (item instanceof HTMLElement) {
      prepareGeneratedLayoutItem(item);
      initializeGeneratedLayoutItemRuntime(item);
    }
  });
  ensureUniqueGeneratedLayoutItemIds(canvas);
  ensureUniqueGeneratedLayoutQubitIds(canvas);
  ensureGeneratedMeasurementSlotIndexes(canvas);
}

function alignGeneratedGateSpring(runtime) {
  if (!runtime?.item || !runtime?.ticksWrap || !runtime?.gatePlatformBay) {
    return;
  }
  const itemRect = runtime.item.getBoundingClientRect();
  const ticksRect = runtime.ticksWrap.getBoundingClientRect();
  if (!itemRect.height || !ticksRect.height) {
    return;
  }
  const centerY = ticksRect.top - itemRect.top + ticksRect.height / 2;
  runtime.gatePlatformBay.style.top = `${Number.parseFloat(centerY.toFixed(2))}px`;
  runtime.gatePlatformBay.style.transform = "translateY(-50%)";
}

function initializeGeneratedSingleGateItem(item, geometry = {}) {
  if (
    !(item instanceof HTMLElement) ||
    item.dataset.component !== "single-gate"
  ) {
    return null;
  }
  const existing = generatedSingleGateRuntimes.get(item);
  if (existing) {
    return existing;
  }
  const ticksWrap = item.querySelector('[data-role="ticks"]');
  const gateArrow = item.querySelector('[data-role="gate-arrow"]');
  const gateFunnel = item.querySelector('[data-role="tube-funnel"]');
  const gateWindow = item.querySelector('[data-role="window"]');
  const gatePlatform = item.querySelector('[data-role="tube-platform"]');
  const gatePlatformBay = gatePlatform?.closest(".tube-platform-bay");
  if (
    !(ticksWrap instanceof HTMLElement) ||
    !(gateArrow instanceof Element) ||
    !(gateFunnel instanceof HTMLElement) ||
    !(gateWindow instanceof HTMLElement) ||
    !(gatePlatform instanceof HTMLElement) ||
    !(gatePlatformBay instanceof HTMLElement)
  ) {
    return null;
  }

  ticksWrap.replaceChildren();
  const activeTick = Number.isFinite(geometry.singleGateTick)
    ? normalizeTickIndex(geometry.singleGateTick)
    : 0;
  const runtime = {
    item,
    ticksWrap,
    gateArrow,
    gateFunnel,
    gateWindow,
    gatePlatform,
    gatePlatformBay,
    activeTick,
    busy: false,
    dial: null,
    lastRoomRecordedTick: null,
  };
  const recordRoomGateSettingIfChanged = () => {
    const normalizedTick = normalizeTickIndex(runtime.activeTick);
    if (runtime.lastRoomRecordedTick === normalizedTick) {
      return;
    }
    runtime.lastRoomRecordedTick = normalizedTick;
    mailboxRoomRecordGateSettingAction(
      generatedCanvasForItem(item),
      item,
      normalizedTick,
    ).catch(() => {
      runtime.lastRoomRecordedTick = null;
    });
  };
  runtime.dial = createSingleQubitGateDial({
    ticksWrap,
    arrow: gateArrow,
    initialTick: activeTick,
    tickAriaLabelPrefix: "Tick",
    orbitInset: 10,
    canInteract: () =>
      generatedCanvasAllowsGateDialInteraction(generatedCanvasForItem(item)) &&
      !runtime.busy,
    onTickChange: (tick, meta = {}) => {
      runtime.activeTick = normalizeTickIndex(tick);
      const canvas = generatedCanvasForItem(item);
      if (canvas && meta.changed && !meta.deferMeasurementClear) {
        clearGeneratedMeasurementsForCanvas(canvas);
        syncGeneratedExperimentGateSettingsFromCanvas(canvas);
        markGeneratedReplayGateSettingsChanged(canvas);
        recordGeneratedGateSettingAction(canvas, item, runtime.activeTick);
        recordRoomGateSettingIfChanged();
        handleGeneratedGateSettingChanged(canvas);
      }
    },
    onTickCommitted: ({ changed }) => {
      const canvas = generatedCanvasForItem(item);
      if (canvas && changed) {
        clearGeneratedMeasurementsForCanvas(canvas);
        syncGeneratedExperimentGateSettingsFromCanvas(canvas);
        markGeneratedReplayGateSettingsChanged(canvas);
        recordGeneratedGateSettingAction(canvas, item, runtime.activeTick);
        recordRoomGateSettingIfChanged();
        handleGeneratedGateSettingChanged(canvas);
      }
    },
  });
  runtime.activeTick = runtime.dial?.getTick() ?? runtime.activeTick;
  runtime.dial?.layout();
  alignGeneratedGateSpring(runtime);
  const gateArrowLayer = gateArrow.closest(".arrow-layer");
  const beginDialDrag = (event) => runtime.dial?.beginDrag(event);
  gateArrow.addEventListener("mousedown", beginDialDrag);
  gateArrow.addEventListener(
    "touchstart",
    beginDialDrag,
    { passive: false },
  );
  if (gateArrowLayer instanceof Element && gateArrowLayer !== gateArrow) {
    gateArrowLayer.addEventListener("mousedown", beginDialDrag);
    gateArrowLayer.addEventListener("touchstart", beginDialDrag, {
      passive: false,
    });
  }
  gateArrow.addEventListener("keydown", (event) =>
    runtime.dial?.handleKeydown(event),
  );
  generatedSingleGateRuntimes.set(item, runtime);
  registerGateInspector(item, () => ({
    label: "Single Qubit Gate",
    matrix: gateMatrixForTick(runtime.activeTick),
    tickIndex: runtime.activeTick,
  }));
  return runtime;
}

function initializeGeneratedSingleMeasurementItem(item) {
  if (!isGeneratedSingleMeasurementItem(item)) {
    return null;
  }
  const existing = generatedSingleMeasurementRuntimes.get(item);
  if (existing) {
    return existing;
  }

  const measurementTool = item.querySelector('[data-role="measurement-tool"]');
  const measureLens = item.querySelector('[data-role="measure-lens"]');
  const tubeBlue = item.querySelector('[data-role="tube-blue"]');
  const tubeRed = item.querySelector('[data-role="tube-red"]');
  const tubeBlueCount = item.querySelector('[data-role="tube-blue-count"]');
  const tubeRedCount = item.querySelector('[data-role="tube-red-count"]');
  const tubeBlueLiquid = item.querySelector('[data-role="tube-blue-liquid"]');
  const tubeRedLiquid = item.querySelector('[data-role="tube-red-liquid"]');
  const tubeCapacity = item.querySelector('[data-role="tube-capacity"]');
  const measurementCount = item.querySelector('[data-role="measurement-count"]');
  if (
    !(measurementTool instanceof HTMLElement) ||
    !(measureLens instanceof HTMLElement) ||
    !(tubeBlue instanceof HTMLElement) ||
    !(tubeRed instanceof HTMLElement) ||
    !(tubeBlueCount instanceof HTMLElement) ||
    !(tubeRedCount instanceof HTMLElement) ||
    !(tubeBlueLiquid instanceof HTMLElement) ||
    !(tubeRedLiquid instanceof HTMLElement)
  ) {
    return null;
  }

  const runtime = {
    item,
    measurementTool,
    measureLens,
    tubeBlue,
    tubeRed,
    tubeBlueCount,
    tubeRedCount,
    tubeBlueLiquid,
    tubeRedLiquid,
    tubeCapacity: tubeCapacity instanceof HTMLElement ? tubeCapacity : null,
    measurementCount:
      measurementCount instanceof HTMLSelectElement ? measurementCount : null,
    tubeQubitCapacity: savedMeasurementCapacity(
      item.dataset.measurementTubeCapacity,
    ),
    blueTubeCount: Number.parseInt(tubeBlueCount.textContent || "0", 10) || 0,
    redTubeCount: Number.parseInt(tubeRedCount.textContent || "0", 10) || 0,
    busy: false,
  };
  maybeExpandGeneratedMeasurementTubeCapacity(runtime);
  updateGeneratedMeasurementTubeFills(runtime);
  if (runtime.measurementCount) {
    runtime.measurementCount.addEventListener("mousedown", (event) =>
      event.stopPropagation(),
    );
    runtime.measurementCount.addEventListener("touchstart", (event) =>
      event.stopPropagation(),
    );
    runtime.measurementCount.addEventListener("click", (event) =>
      event.stopPropagation(),
    );
    runtime.measurementCount.addEventListener("change", () => {
      const canvas = generatedCanvasForItem(item);
      if (!canvas) {
        return;
      }
      const iterations = Math.max(
        1,
        Number(runtime.measurementCount.value) || 1,
      );
      if (
        recordGeneratedExperimentControlAction(
          canvas,
          generatedControlActionForMeasurement(
            GENERATED_EXPERIMENT_COUNT_ACTION,
            item,
            iterations,
          ),
        )
      ) {
        return;
      }
      runtime.tubeQubitCapacity = INITIAL_TUBE_QUBIT_CAPACITY;
      runtime.blueTubeCount = 0;
      runtime.redTubeCount = 0;
      updateGeneratedMeasurementTubeFills(runtime);
      runGeneratedRecordedExperiment(canvas, iterations).catch(() => {});
    });
  }
  measurementTool.addEventListener("click", (event) => {
    if (layoutEditorState.enabled) {
      return;
    }
    const canvas = generatedCanvasForItem(item);
    if (!canvas) {
      return;
    }
    const state = generatedExperimentStateForCanvas(canvas);
    const measurementRegisterQubitCount = Math.max(
      2,
      Number(runtime.registerQubitCount) ||
        registerMeasurementQubitCountForItem(item),
    );
    const canUseRoomMeasurementControl =
      mailboxRoomIsJoined() &&
      isEntanglementThreeCanvas(canvas) &&
      measurementRegisterQubitCount > 2;
    if (!state?.experiment && !canUseRoomMeasurementControl) {
      return;
    }
    event.stopPropagation();
    const iterations = Math.max(
      1,
      Number(runtime.measurementCount?.value) || 1,
    );
    if (
      recordGeneratedExperimentControlAction(
        canvas,
        generatedControlActionForMeasurement(
          GENERATED_EXPERIMENT_REPEAT_ACTION,
          item,
          iterations,
        ),
      )
    ) {
      return;
    }
    runGeneratedRecordedExperiment(canvas, iterations).catch(() => {});
  });
  generatedSingleMeasurementRuntimes.set(item, runtime);
  return runtime;
}

function updateGeneratedDoubleMeasurementTubeFills(runtime) {
  Object.entries(runtime.tubeCounts).forEach(([key, count]) => {
    const countElement = runtime.countElements[key];
    const liquidElement = runtime.liquidElements[key];
    if (!countElement || !liquidElement) {
      return;
    }
    countElement.textContent = String(count);
    const percent = Math.min((count / runtime.tubePairCapacity) * 100, 100);
    liquidElement.style.height = `${percent}%`;
  });
  if (runtime.capacityElement) {
    const capacityUnit =
      runtime.capacityUnit ||
      (runtime.registerQubitCount > 2 ? "counts" : "qubit pairs");
    runtime.capacityElement.textContent = `The testtubes can each hold ${runtime.tubePairCapacity} ${capacityUnit}.`;
  }
}

function maybeExpandGeneratedDoubleMeasurementTubeCapacity(runtime) {
  let maxCount = 0;
  Object.values(runtime.tubeCounts).forEach((count) => {
    if (count > maxCount) {
      maxCount = count;
    }
  });
  while (maxCount > runtime.tubePairCapacity) {
    runtime.tubePairCapacity *= 2;
  }
}

function clearGeneratedDoubleMeasurementApparatus(runtime, options = {}) {
  if (!runtime) {
    return;
  }
  runtime.tubePairCapacity = INITIAL_TUBE_QUBIT_CAPACITY;
  (runtime.outcomeKeys || Object.keys(runtime.tubeCounts || {})).forEach((key) => {
    runtime.tubeCounts[key] = 0;
  });
  if (options.resetIterations) {
    setMeasurementSelectValue(runtime.measurementCount, 1);
  }
  updateGeneratedDoubleMeasurementTubeFills(runtime);
}

function ensureGeneratedSeparatedSingleTubeRuntime(runtime) {
  if (!runtime?.item) {
    return null;
  }
  const item = runtime.item;
  if (!item.querySelector('[data-role="tube-rack"]')) {
    appendSavedMeasurementPiece(item, "single-tube-array", {
      left: 18,
      top: 12,
      width: 64,
      height: 42,
      z: 2,
    });
  }
  const tubeBlue = item.querySelector('[data-role="tube-blue"]');
  const tubeRed = item.querySelector('[data-role="tube-red"]');
  const tubeBlueCount = item.querySelector('[data-role="tube-blue-count"]');
  const tubeRedCount = item.querySelector('[data-role="tube-red-count"]');
  const tubeBlueLiquid = item.querySelector('[data-role="tube-blue-liquid"]');
  const tubeRedLiquid = item.querySelector('[data-role="tube-red-liquid"]');
  if (
    !(tubeBlue instanceof HTMLElement) ||
    !(tubeRed instanceof HTMLElement) ||
    !(tubeBlueCount instanceof HTMLElement) ||
    !(tubeRedCount instanceof HTMLElement) ||
    !(tubeBlueLiquid instanceof HTMLElement) ||
    !(tubeRedLiquid instanceof HTMLElement)
  ) {
    return null;
  }
  const singleRuntime = {
    item,
    measurementTool: runtime.magnifiers[0]?.measurementTool || item,
    measureLens: runtime.magnifiers[0]?.measureLens || item,
    tubeBlue,
    tubeRed,
    tubeBlueCount,
    tubeRedCount,
    tubeBlueLiquid,
    tubeRedLiquid,
    tubeCapacity: item.querySelector(
      '[data-role="tube-capacity"], [data-role="pair-capacity"]',
    ),
    measurementCount: runtime.measurementCount,
    tubeQubitCapacity: savedMeasurementCapacity(
      item.dataset.measurementTubeCapacity,
    ),
    blueTubeCount: Number.parseInt(tubeBlueCount.textContent || "0", 10) || 0,
    redTubeCount: Number.parseInt(tubeRedCount.textContent || "0", 10) || 0,
    busy: false,
  };
  maybeExpandGeneratedMeasurementTubeCapacity(singleRuntime);
  updateGeneratedMeasurementTubeFills(singleRuntime);
  runtime.singleTubeRuntime = singleRuntime;
  return singleRuntime;
}

function generatedSeparatedPairMeasurementMagnifiers(item) {
  if (!(item instanceof HTMLElement)) {
    return [];
  }
  return Array.from(
    item.querySelectorAll(
      '.saved-group-child[data-component="single-magnifier"]',
    ),
  )
    .map((child, index) => {
      const measurementTool = child.matches('[data-role="measurement-tool"]')
        ? child
        : child.querySelector('[data-role="measurement-tool"]');
      const measureLens = child.querySelector('[data-role="measure-lens"]');
      if (!(measurementTool instanceof HTMLElement)) {
        return null;
      }
      return {
        index,
        child,
        measurementTool,
        measureLens:
          measureLens instanceof HTMLElement ? measureLens : measurementTool,
      };
    })
    .filter(Boolean);
}

function initializeGeneratedSeparatedPairMeasurementItem(item) {
  if (!isGeneratedSeparatedPairMeasurementItem(item)) {
    return null;
  }
  const existing = generatedSeparatedPairMeasurementRuntimes.get(item);
  if (existing) {
    return existing;
  }

  const magnifiers = generatedSeparatedPairMeasurementMagnifiers(item);
  const capacity = item.querySelector('[data-role="pair-capacity"]');
  const measurementCount = item.querySelector(
    '.saved-group-child[data-component="measurement-count-menu"] [data-role="measurement-count"], [data-role="pair-measurement-count"]',
  );
  const columns = Array.from(
    item.querySelectorAll(".pair-tube-column[data-key]"),
  );
  if (magnifiers.length < 1) {
    return null;
  }

  const tubeElements = {};
  const liquidElements = {};
  const countElements = {};
  columns.forEach((column) => {
    const key = column.dataset.key;
    if (!key) {
      return;
    }
    const tube = column.querySelector(".pair-tube");
    const liquid = column.querySelector(".tube-liquid");
    const count = column.querySelector(".tube-count");
    if (
      tube instanceof HTMLElement &&
      liquid instanceof HTMLElement &&
      count instanceof HTMLElement
    ) {
      tubeElements[key] = tube;
      liquidElements[key] = liquid;
      countElements[key] = count;
    }
  });
  const configuredRegisterQubitCount = registerMeasurementQubitCountForItem(item);
  const registerQubitCount = Math.max(
    configuredRegisterQubitCount,
    registerMeasurementQubitCountFromKeys(
      columns.map((column) => column.dataset.key || ""),
    ),
  );
  item.dataset.measurementRegisterQubitCount = `${registerQubitCount}`;
  const requiredKeys = registerMeasurementOutcomeKeys(registerQubitCount);
  const hasCompleteTubeRack =
    columns.length > 0 &&
    requiredKeys.every(
      (key) => tubeElements[key] && liquidElements[key] && countElements[key],
    );
  if (columns.length > 0 && !hasCompleteTubeRack) {
    return null;
  }

  item.dataset.separatedPairMeasurement = "true";
  const runtime = {
    item,
    magnifiers,
    measurementCount:
      measurementCount instanceof HTMLSelectElement ? measurementCount : null,
    capacityElement: capacity instanceof HTMLElement ? capacity : null,
    tubeElements,
    liquidElements,
    countElements,
    tubeCounts: Object.fromEntries(
      (hasCompleteTubeRack ? requiredKeys : []).map((key) => [
        key,
        Number.parseInt(countElements[key].textContent || "0", 10) || 0,
      ]),
    ),
    outcomeKeys: hasCompleteTubeRack ? requiredKeys : [],
    configuredRegisterQubitCount,
    registerQubitCount,
    capacityUnit: registerQubitCount > 2 ? "counts" : "qubit pairs",
    tubePairCapacity: savedMeasurementCapacity(
      item.dataset.measurementTubeCapacity,
    ),
    pendingMeasurements: [],
    measurementSequence: 0,
    busy: false,
    completing: false,
  };
  maybeExpandGeneratedDoubleMeasurementTubeCapacity(runtime);
  updateGeneratedDoubleMeasurementTubeFills(runtime);

  const runRecordedExperimentFromControl = (
    type = GENERATED_EXPERIMENT_REPEAT_ACTION,
  ) => {
    if (layoutEditorState.enabled) {
      return;
    }
    const canvas = generatedCanvasForItem(item);
    if (!canvas) {
      return;
    }
    const state = generatedExperimentStateForCanvas(canvas);
    const measurementRegisterQubitCount = Math.max(
      2,
      Number(runtime.registerQubitCount) ||
        registerMeasurementQubitCountForItem(item),
    );
    const canUseRoomMeasurementControl =
      mailboxRoomIsJoined() &&
      isEntanglementThreeCanvas(canvas) &&
      measurementRegisterQubitCount > 2;
    if (!state?.experiment && !canUseRoomMeasurementControl) {
      return;
    }
    const iterations = Math.max(
      1,
      Number(runtime.measurementCount?.value) || 1,
    );
    if (
      recordGeneratedExperimentControlAction(
        canvas,
        generatedControlActionForMeasurement(type, item, iterations),
      )
    ) {
      return;
    }
    const publishControl = canUseRoomMeasurementControl
      ? mailboxRoomPublishRoomMeasurementControl(runtime, type, iterations)
          .catch(() => null)
          .then((measurement) => ({
            control: measurement?.control || null,
            measurement,
            room: Boolean(measurement?.control),
          }))
      : mailboxRoomPublishSharedMeasurementControl(runtime, type, iterations)
          .catch(() => null)
          .then((sharedEntanglement) => {
            if (sharedEntanglement) {
              const control =
                mailboxRoomSharedMeasurementMetadata(sharedEntanglement)
                  .control;
              return { control: control || null, measurement: null, room: false };
            }
            return mailboxRoomPublishRoomMeasurementControl(
              runtime,
              type,
              iterations,
            )
              .catch(() => null)
              .then((measurement) => ({
                control: measurement?.control || null,
                measurement,
                room: Boolean(measurement?.control),
              }));
          });
    publishControl
      .then((result) => {
        const startDelay = Math.max(
          0,
          Math.round(Number(result?.control?.startAt) - Date.now()),
        );
        return (startDelay > 0 ? waitForDuration(startDelay) : Promise.resolve())
          .then(() => result);
      })
      .then((result) =>
        result?.room && result.control
          ? runMailboxRoomRecordedExperimentForControl(
              canvas,
              runtime,
              result.measurement,
              result.control,
            )
          : state?.experiment
            ? runGeneratedRecordedExperiment(canvas, iterations)
            : false,
      )
      .catch(() => {});
  };

  if (runtime.measurementCount) {
    runtime.measurementCount.addEventListener("mousedown", (event) =>
      event.stopPropagation(),
    );
    runtime.measurementCount.addEventListener("touchstart", (event) =>
      event.stopPropagation(),
    );
    runtime.measurementCount.addEventListener("click", (event) =>
      event.stopPropagation(),
    );
    runtime.measurementCount.addEventListener("change", () => {
      const canvas = generatedCanvasForItem(item);
      if (!canvas) {
        return;
      }
      if (
        recordGeneratedExperimentControlAction(
          canvas,
          generatedControlActionForMeasurement(
            GENERATED_EXPERIMENT_COUNT_ACTION,
            item,
            Math.max(1, Number(runtime.measurementCount.value) || 1),
          ),
        )
      ) {
        return;
      }
      clearGeneratedSeparatedPairMeasurementApparatus(runtime);
      runRecordedExperimentFromControl(GENERATED_EXPERIMENT_COUNT_ACTION);
    });
  }
  magnifiers.forEach(({ measurementTool }) => {
    measurementTool.addEventListener("click", (event) => {
      if (layoutEditorState.enabled) {
        return;
      }
      event.stopPropagation();
      runRecordedExperimentFromControl();
    });
  });

  generatedSeparatedPairMeasurementRuntimes.set(item, runtime);
  return runtime;
}

function clearGeneratedSeparatedPairMeasurementApparatus(runtime, options = {}) {
  if (!runtime) {
    return;
  }
  runtime.tubePairCapacity = INITIAL_TUBE_QUBIT_CAPACITY;
  (runtime.outcomeKeys || Object.keys(runtime.tubeCounts || {})).forEach((key) => {
    runtime.tubeCounts[key] = 0;
  });
  if (runtime.item?.querySelector?.('[data-role="tube-rack"]')) {
    const singleRuntime = ensureGeneratedSeparatedSingleTubeRuntime(runtime);
    if (singleRuntime) {
      singleRuntime.tubeQubitCapacity = INITIAL_TUBE_QUBIT_CAPACITY;
      singleRuntime.blueTubeCount = 0;
      singleRuntime.redTubeCount = 0;
      updateGeneratedMeasurementTubeFills(singleRuntime);
    }
  }
  runtime.pendingMeasurements = [];
  runtime.busy = false;
  runtime.completing = false;
  if (options.resetIterations) {
    setMeasurementSelectValue(runtime.measurementCount, 1);
  }
  updateGeneratedDoubleMeasurementTubeFills(runtime);
}

function clearGeneratedMeasurementsForCanvas(canvas, options = {}) {
  if (!isGeneratedLayoutCanvas(canvas)) {
    return;
  }
  generatedItemsOfType(canvas, "single-measurement").forEach((item) => {
    clearGeneratedMeasurementApparatus(
      initializeGeneratedSingleMeasurementItem(item),
      options,
    );
  });
  generatedItemsOfType(canvas, "double-measurement").forEach((item) => {
    clearGeneratedDoubleMeasurementApparatus(
      initializeGeneratedDoubleMeasurementItem(item),
      options,
    );
  });
  generatedItemsOfType(canvas, PLAYGROUND_SAVED_GROUP_COMPONENT_TYPE).forEach(
    (item) => {
      clearGeneratedSeparatedPairMeasurementApparatus(
        initializeGeneratedSeparatedPairMeasurementItem(item),
        options,
      );
    },
  );
}

function refreshGeneratedMeasurementFillsForCanvas(canvas) {
  if (!isGeneratedLayoutCanvas(canvas)) {
    return;
  }
  generatedItemsOfType(canvas, "single-measurement").forEach((item) => {
    const runtime = initializeGeneratedSingleMeasurementItem(item);
    if (runtime) {
      updateGeneratedMeasurementTubeFills(runtime);
    }
  });
  generatedItemsOfType(canvas, "double-measurement").forEach((item) => {
    const runtime = initializeGeneratedDoubleMeasurementItem(item);
    if (runtime) {
      updateGeneratedDoubleMeasurementTubeFills(runtime);
    }
  });
  generatedItemsOfType(canvas, PLAYGROUND_SAVED_GROUP_COMPONENT_TYPE).forEach(
    (item) => {
      const runtime = initializeGeneratedSeparatedPairMeasurementItem(item);
      if (runtime) {
        updateGeneratedDoubleMeasurementTubeFills(runtime);
      }
    },
  );
}

function isGeneratedExperimentControlAction(action) {
  return (
    action?.type === GENERATED_EXPERIMENT_REPEAT_ACTION ||
    action?.type === GENERATED_EXPERIMENT_COUNT_ACTION
  );
}

function generatedExperimentReplayIterations(action) {
  return Math.max(1, Number(action?.iterations) || 1);
}

function generatedExperimentUsesBatchReplay(iterations) {
  return Math.max(1, Number(iterations) || 1) > 10;
}

function generatedExperimentHasBatchControlActions(experiment) {
  return (Array.isArray(experiment?.actions) ? experiment.actions : []).some(
    (action) =>
      isGeneratedExperimentControlAction(action) &&
      generatedExperimentUsesBatchReplay(action.iterations),
  );
}

function generatedExperimentLowLevelActions(actions) {
  return (Array.isArray(actions) ? actions : []).filter(
    (action) => action?.type && !isGeneratedExperimentControlAction(action),
  );
}

function generatedExperimentBaseForControlAction(experiment, actionIndex) {
  const actions = Array.isArray(experiment?.actions)
    ? experiment.actions
    : [];
  const prefix =
    Number.isFinite(actionIndex) && actionIndex >= 0
      ? actions.slice(0, actionIndex)
      : actions;
  return {
    ...experiment,
    actions: generatedExperimentLowLevelActions(prefix),
  };
}

function generatedExperimentHasControlActions(experiment) {
  return (Array.isArray(experiment?.actions) ? experiment.actions : []).some(
    isGeneratedExperimentControlAction,
  );
}

function setRecordedMeasurementIterationCount(canvas, action) {
  const iterations = generatedExperimentReplayIterations(action);
  const measurementItem = generatedItemById(canvas, action?.measurementId);
  const select = measurementItem?.querySelector?.(
    '[data-role="measurement-count"], [data-role="pair-measurement-count"]',
  );
  if (select instanceof HTMLSelectElement) {
    const value = `${iterations}`;
    if (Array.from(select.options).some((option) => option.value === value)) {
      select.value = value;
    }
  }
}

function clearRecordedMeasurementForControlAction(canvas, action) {
  const measurementItem = generatedItemById(canvas, action?.measurementId);
  if (!(measurementItem instanceof HTMLElement)) {
    clearGeneratedMeasurementsForCanvas(canvas);
    return;
  }
  const type = measurementItem.dataset.component;
  if (type === "single-measurement") {
    clearGeneratedMeasurementApparatus(
      initializeGeneratedSingleMeasurementItem(measurementItem),
    );
    return;
  }
  if (type === "double-measurement") {
    clearGeneratedDoubleMeasurementApparatus(
      initializeGeneratedDoubleMeasurementItem(measurementItem),
    );
    return;
  }
  if (isGeneratedSeparatedPairMeasurementItem(measurementItem)) {
    clearGeneratedSeparatedPairMeasurementApparatus(
      initializeGeneratedSeparatedPairMeasurementItem(measurementItem),
    );
    return;
  }
  clearGeneratedMeasurementsForCanvas(canvas);
}

function generatedControlActionForMeasurement(
  type,
  measurementItem,
  iterations,
) {
  if (!(measurementItem instanceof HTMLElement)) {
    return null;
  }
  return {
    type,
    measurementId: ensureGeneratedItemId(
      measurementItem,
      measurementItem.dataset.component || "measurement",
    ),
    iterations: generatedExperimentReplayIterations({ iterations }),
  };
}

function recordGeneratedExperimentControlAction(canvas, action) {
  const state = generatedExperimentStateForCanvas(canvas);
  if (
    !state?.recording ||
    !isDocumentEditorCanvas(canvas) ||
    !isGeneratedExperimentControlAction(action)
  ) {
    return false;
  }
  syncDraftGeneratedExperimentFromRecording(canvas);
  const actionIndex = state.actions.length;
  const baseExperiment = generatedExperimentBaseForControlAction(
    state.experiment,
    actionIndex,
  );
  if (
    !Array.isArray(baseExperiment.actions) ||
    baseExperiment.actions.length === 0
  ) {
    return false;
  }
  recordGeneratedExperimentAction(canvas, action);
  syncDraftGeneratedExperimentFromRecording(canvas);
  const playbackExperiment = cloneGeneratedExperiment(state.experiment);
  queueGeneratedExperimentControlReplay(
    canvas,
    playbackExperiment,
    action,
    actionIndex,
  );
  return true;
}

function queueGeneratedExperimentControlReplay(
  canvas,
  experiment,
  action,
  actionIndex,
) {
  const state = generatedExperimentStateForCanvas(canvas);
  if (!state) {
    return false;
  }
  if (!Array.isArray(state.controlActionQueue)) {
    state.controlActionQueue = [];
  }
  state.controlActionQueue.push({
    experiment: cloneGeneratedExperiment(experiment),
    action: { ...action },
    actionIndex,
  });
  drainGeneratedExperimentControlReplayQueue(canvas).catch(() => {});
  return true;
}

async function drainGeneratedExperimentControlReplayQueue(canvas) {
  const state = generatedExperimentStateForCanvas(canvas);
  if (!state || state.controlActionReplayRunning) {
    return false;
  }
  state.controlActionReplayRunning = true;
  state.playing = true;
  state.suppressActionRecording = true;
  updateGeneratedExperimentToolbar(canvas);
  updateDocEditorButtons();
  try {
    while (state.controlActionQueue.length > 0) {
      const queued = state.controlActionQueue.shift();
      await replayGeneratedRecordedExperimentControlAction(
        canvas,
        queued.experiment,
        queued.action,
        queued.actionIndex,
      );
    }
  } finally {
    state.suppressActionRecording = false;
    state.playing = false;
    state.controlActionReplayRunning = false;
    if (state.recording) {
      canvas.classList.add("generated-recording-active");
      syncDraftGeneratedExperimentFromRecording(canvas);
    } else {
      canvas.classList.remove("generated-recording-active");
    }
    updateGeneratedExperimentToolbar(canvas);
    updateDocEditorButtons();
    if (state.controlActionQueue.length > 0) {
      drainGeneratedExperimentControlReplayQueue(canvas).catch(() => {});
    }
  }
  return true;
}

function initializeGeneratedDoubleMeasurementItem(item) {
  if (!isGeneratedDoubleMeasurementItem(item)) {
    return null;
  }
  const existing = generatedDoubleMeasurementRuntimes.get(item);
  if (existing) {
    return existing;
  }

  const measurementTool = item.querySelector('[data-role="pair-lens"]');
  const measurementFunnel = item.querySelector(
    '[data-role="pair-measurement-funnel"]',
  );
  const slotLeft = item.querySelector('[data-role="pair-slot-left"]');
  const slotRight = item.querySelector('[data-role="pair-slot-right"]');
  const platform = item.querySelector(".pair-measurement-platform");
  const capacity = item.querySelector('[data-role="pair-capacity"]');
  const measurementCount = item.querySelector(
    '[data-role="pair-measurement-count"]',
  );
  const columns = Array.from(
    item.querySelectorAll(".pair-tube-column[data-key]"),
  );
  if (
    !(measurementTool instanceof HTMLElement) ||
    !(measurementFunnel instanceof HTMLElement) ||
    !(slotLeft instanceof HTMLElement) ||
    !(slotRight instanceof HTMLElement) ||
    !(platform instanceof HTMLElement)
  ) {
    return null;
  }

  const tubeElements = {};
  const liquidElements = {};
  const countElements = {};
  columns.forEach((column) => {
    const key = column.dataset.key;
    if (!key) {
      return;
    }
    const tube = column.querySelector(".pair-tube");
    const liquid = column.querySelector(".tube-liquid");
    const count = column.querySelector(".tube-count");
    if (
      tube instanceof HTMLElement &&
      liquid instanceof HTMLElement &&
      count instanceof HTMLElement
    ) {
      tubeElements[key] = tube;
      liquidElements[key] = liquid;
      countElements[key] = count;
    }
  });
  const requiredKeys = ["bb", "br", "rb", "rr"];
  if (
    !requiredKeys.every(
      (key) => tubeElements[key] && liquidElements[key] && countElements[key],
    )
  ) {
    return null;
  }

  const runtime = {
    item,
    measurementTool,
    measurementFunnel,
    slotLeft,
    slotRight,
    platform,
    measurementCount:
      measurementCount instanceof HTMLSelectElement ? measurementCount : null,
    capacityElement: capacity instanceof HTMLElement ? capacity : null,
    tubeElements,
    liquidElements,
    countElements,
    tubeCounts: {
      bb: Number.parseInt(countElements.bb.textContent || "0", 10) || 0,
      br: Number.parseInt(countElements.br.textContent || "0", 10) || 0,
      rb: Number.parseInt(countElements.rb.textContent || "0", 10) || 0,
      rr: Number.parseInt(countElements.rr.textContent || "0", 10) || 0,
    },
    tubePairCapacity: savedMeasurementCapacity(
      item.dataset.measurementTubeCapacity,
    ),
    slotOccupants: {
      left: null,
      right: null,
    },
    busy: false,
    autoRunInProgress: false,
    automationStartPoints: null,
    cyclePromise: null,
  };
  maybeExpandGeneratedDoubleMeasurementTubeCapacity(runtime);
  updateGeneratedDoubleMeasurementTubeFills(runtime);
  if (runtime.measurementCount) {
    runtime.measurementCount.addEventListener("mousedown", (event) =>
      event.stopPropagation(),
    );
    runtime.measurementCount.addEventListener("touchstart", (event) =>
      event.stopPropagation(),
    );
    runtime.measurementCount.addEventListener("click", (event) =>
      event.stopPropagation(),
    );
    runtime.measurementCount.addEventListener("change", () => {
      const canvas = generatedCanvasForItem(item);
      if (!canvas) {
        return;
      }
      const iterations = Math.max(
        1,
        Number(runtime.measurementCount.value) || 1,
      );
      if (
        recordGeneratedExperimentControlAction(
          canvas,
          generatedControlActionForMeasurement(
            GENERATED_EXPERIMENT_COUNT_ACTION,
            item,
            iterations,
          ),
        )
      ) {
        return;
      }
      clearGeneratedDoubleMeasurementApparatus(runtime);
      const state = generatedExperimentStateForCanvas(canvas);
      if (state?.experiment) {
        runGeneratedRecordedExperiment(canvas, iterations).catch(() => {});
      }
    });
  }
  measurementTool.addEventListener("click", (event) => {
    if (layoutEditorState.enabled) {
      return;
    }
    event.stopPropagation();
    const canvas = generatedCanvasForItem(item);
    if (!canvas) {
      return;
    }
    const iterations = Math.max(
      1,
      Number(runtime.measurementCount?.value) || 1,
    );
    const state = generatedExperimentStateForCanvas(canvas);
    if (state?.experiment) {
      if (
        recordGeneratedExperimentControlAction(
          canvas,
          generatedControlActionForMeasurement(
            GENERATED_EXPERIMENT_REPEAT_ACTION,
            item,
            iterations,
          ),
        )
      ) {
        return;
      }
      runGeneratedRecordedExperiment(canvas, iterations).catch(() => {});
    }
  });
  generatedDoubleMeasurementRuntimes.set(item, runtime);
  return runtime;
}

function initializeGeneratedCnotItem(item) {
  if (!isGeneratedCnotItem(item)) {
    return null;
  }
  const existing = generatedCnotRuntimes.get(item);
  if (existing) {
    return existing;
  }

  const body = item.querySelector(".cnot-body, [data-part='body']");
  const funnelTop = item.querySelector(
    ".cnot-input-funnel-top, [data-part='funnel-top']",
  );
  const funnelBottom = item.querySelector(
    ".cnot-input-funnel-bottom, [data-part='funnel-bottom']",
  );
  const windowTop = item.querySelector(
    ".cnot-porthole-top, [data-part='window-top']",
  );
  const windowBottom = item.querySelector(
    ".cnot-porthole-bottom, [data-part='window-bottom']",
  );
  const flangeTop = item.querySelector(".cnot-output-flange-top");
  const flangeBottom = item.querySelector(".cnot-output-flange-bottom");
  const springTop = item.querySelector(".cnot-spring-top");
  const springBottom = item.querySelector(".cnot-spring-bottom");
  if (
    !(body instanceof HTMLElement) ||
    !(funnelTop instanceof HTMLElement) ||
    !(funnelBottom instanceof HTMLElement) ||
    !(windowTop instanceof HTMLElement) ||
    !(windowBottom instanceof HTMLElement) ||
    !(flangeTop instanceof HTMLElement) ||
    !(flangeBottom instanceof HTMLElement) ||
    !(springTop instanceof HTMLElement) ||
    !(springBottom instanceof HTMLElement)
  ) {
    return null;
  }

  const runtime = {
    item,
    body,
    funnelTop,
    funnelBottom,
    windowTop,
    windowBottom,
    flangeTop,
    flangeBottom,
    springTop,
    springBottom,
    slotOccupants: {
      top: null,
      bottom: null,
    },
    busy: false,
    cyclePromise: null,
  };
  generatedCnotRuntimes.set(item, runtime);
  registerGateInspector(item, () => ({
    label: "C-NOT Gate",
    matrix: cnotGateMatrixForInspector(),
  }));
  return runtime;
}

function updateGeneratedMeasurementTubeFills(runtime) {
  const blueFillPercent = Math.min(
    (runtime.blueTubeCount / runtime.tubeQubitCapacity) * 100,
    100,
  );
  const redFillPercent = Math.min(
    (runtime.redTubeCount / runtime.tubeQubitCapacity) * 100,
    100,
  );
  runtime.tubeBlueCount.textContent = String(runtime.blueTubeCount);
  runtime.tubeRedCount.textContent = String(runtime.redTubeCount);
  runtime.tubeBlueLiquid.style.height = `${blueFillPercent}%`;
  runtime.tubeRedLiquid.style.height = `${redFillPercent}%`;
  if (runtime.tubeCapacity) {
    runtime.tubeCapacity.textContent = `The testtubes can each hold ${runtime.tubeQubitCapacity} qubits.`;
  }
}

function maybeExpandGeneratedMeasurementTubeCapacity(runtime) {
  const largestTubeCount = Math.max(
    runtime.blueTubeCount,
    runtime.redTubeCount,
  );
  while (largestTubeCount > runtime.tubeQubitCapacity) {
    runtime.tubeQubitCapacity *= 2;
  }
}

function clearGeneratedMeasurementApparatus(runtime, options = {}) {
  if (!runtime) {
    return;
  }
  runtime.tubeQubitCapacity = INITIAL_TUBE_QUBIT_CAPACITY;
  runtime.blueTubeCount = 0;
  runtime.redTubeCount = 0;
  if (options.resetIterations) {
    setMeasurementSelectValue(runtime.measurementCount, 1);
  }
  updateGeneratedMeasurementTubeFills(runtime);
}

function initializeGeneratedLayoutItemRuntime(item) {
  if (!(item instanceof HTMLElement)) {
    return;
  }
  if (isGeneratedQubitItem(item)) {
    ensureGeneratedQubitRuntimeState(item);
    registerQubitInspector(item, () =>
      inspectorRegisterFromRuntimeState(
        item,
        ensureGeneratedQubitRuntimeState(item),
        "Qubit",
      ),
    );
    if (item.dataset.generatedRuntimeDragRegistered !== "true") {
      item.dataset.generatedRuntimeDragRegistered = "true";
      item.addEventListener("mousedown", (event) =>
        beginGeneratedRuntimeQubitDrag(item, event),
      );
      item.addEventListener(
        "touchstart",
        (event) => beginGeneratedRuntimeQubitDrag(item, event),
        { passive: false },
      );
    }
  } else if (isGeneratedSingleGateItem(item)) {
    initializeGeneratedSingleGateItem(item, {
      singleGateTick: generatedSingleGateRuntimes.get(item)?.activeTick,
    });
  } else if (isGeneratedSingleMeasurementItem(item)) {
    initializeGeneratedSingleMeasurementItem(item);
  } else if (isGeneratedDoubleMeasurementItem(item)) {
    initializeGeneratedDoubleMeasurementItem(item);
  } else if (isGeneratedSeparatedPairMeasurementItem(item)) {
    initializeGeneratedSeparatedPairMeasurementItem(item);
  } else if (isGeneratedCnotItem(item)) {
    initializeGeneratedCnotItem(item);
  }
}

function layoutGeneratedSingleGateDials(root = document) {
  const scope =
    root instanceof Document ? root : root.ownerDocument || document;
  const gates =
    root instanceof HTMLElement
      ? root.querySelectorAll('.playground-node[data-component="single-gate"]')
      : scope.querySelectorAll(
          '.generated-layout-canvas .playground-node[data-component="single-gate"]',
        );
  gates.forEach((gate) => {
    const runtime = generatedSingleGateRuntimes.get(gate);
    runtime?.dial?.layout();
  });
}

function captureGeneratedMeasurementLayoutSnapshot(item) {
  if (
    !(item instanceof HTMLElement) ||
    !isMeasurementComponentType(item.dataset.component)
  ) {
    return null;
  }
  prepareGeneratedMeasurementParts(item);
  return captureMeasurementLayoutSnapshot(
    item,
    measurementPartSpecsForType(item.dataset.component),
  );
}

function serializeGeneratedLayoutItem(item) {
  const serialized = {
    id: ensureGeneratedItemId(item),
    type: item.dataset.component || "qubit",
    left: parseLayoutNumeric(item.style.left, 0),
    top: parseLayoutNumeric(item.style.top, 0),
    width: item.offsetWidth,
    height: item.offsetHeight,
    z: parseLayoutNumeric(item.style.zIndex, 1),
  };
  const singleGateRuntime = generatedSingleGateRuntimes.get(item);
  if (singleGateRuntime?.dial) {
    serialized.singleGateTick = singleGateRuntime.dial.getTick();
  }
  if (item.dataset.component === "qubit") {
    const qubitId = ensureQubitLogicalId(item);
    if (qubitId) {
      serialized.qubitId = qubitId;
    }
    const roomQubitIndex = roomQubitIndexForItem(item);
    if (Number.isInteger(roomQubitIndex)) {
      serialized.roomQubitIndex = roomQubitIndex;
    }
    if (item.dataset.initialVector) {
      try {
        serialized.vector = normalizeVector2(
          JSON.parse(item.dataset.initialVector),
        );
      } catch (_error) {
        delete serialized.vector;
      }
    }
  }
  if (item.dataset.component === "text-box") {
    Object.assign(serialized, captureTextBoxSnapshot(item));
  }
  if (item.dataset.component === "mailbox") {
    const mailbox = captureMailboxSnapshot(item);
    if (mailbox) {
      serialized.mailbox = mailbox;
    }
  }
  const measurementLayout = captureGeneratedMeasurementLayoutSnapshot(item);
  if (measurementLayout) {
    serialized.measurementLayout = measurementLayout;
  }
  // Group instances store only their outer geometry and definition id. Child
  // geometry belongs to the component definition and is edited only there.
  if (item.dataset.measurementGroupId) {
    serialized.measurementGroupId = item.dataset.measurementGroupId;
  }
  if (item.dataset.groupComponentId) {
    serialized.groupComponentId = item.dataset.groupComponentId;
  }
  if (item.dataset.measurementRole) {
    serialized.measurementRole = item.dataset.measurementRole;
  }
  const registerQubitCount = Number(item.dataset.measurementRegisterQubitCount);
  if (
    item.dataset.component === PLAYGROUND_SAVED_GROUP_COMPONENT_TYPE &&
    Number.isInteger(registerQubitCount) &&
    registerQubitCount >= 2 &&
    registerQubitCount <= 4
  ) {
    serialized.measurementRegisterQubitCount = registerQubitCount;
  }
  if (item.dataset.component === "cnot-gate") {
    const cnotLayout = captureCnotComponentDefaultsFromElement(item);
    if (cnotLayout) {
      serialized.cnotLayout = cnotLayout;
    }
  }
  return serialized;
}

function captureGeneratedLayoutFromCanvas(canvas) {
  if (!isGeneratedLayoutCanvas(canvas)) {
    return null;
  }
  prepareGeneratedLayoutCanvas(canvas);
  return {
    items: Array.from(canvas.querySelectorAll(":scope > .playground-node")).map(
      (item) => serializeGeneratedLayoutItem(item),
    ),
    canvasWidth: canvas.offsetWidth,
    canvasHeight: canvas.offsetHeight,
    savedAt: Date.now(),
  };
}

function createGeneratedLayoutItemNode(type, geometry = {}) {
  const hasSavedGeometry =
    geometry &&
    typeof geometry === "object" &&
    Object.keys(geometry).length > 0;
  geometry = geometry && typeof geometry === "object" ? geometry : {};
  const pickerGroup = savedGroupComponentForType(type);
  if (pickerGroup) {
    type = PLAYGROUND_SAVED_GROUP_COMPONENT_TYPE;
    geometry = { ...geometry, groupComponentId: pickerGroup.id };
  }
  const config =
    componentConfigForType(type, geometry) || PLAYGROUND_COMPONENT_LIBRARY.qubit;
  const defaultsGeometry = defaultsGeometryForComponentType(type);
  const componentNode = createPlaygroundComponentNode(type, geometry);
  let item =
    componentNode instanceof HTMLElement
      ? componentNode
      : document.createElement("div");
  if (type === "qubit") {
    const shell = document.createElement("div");
    shell.className = "playground-node playground-qubit-shell";
    if (!(item instanceof HTMLElement) || !item.classList.contains("qubit")) {
      const fallbackQubit = document.createElement("button");
      fallbackQubit.type = "button";
      fallbackQubit.className = "qubit";
      item = fallbackQubit;
    }
    item.classList.add("playground-qubit-core");
    shell.appendChild(item);
    item = shell;
  } else {
    item.classList.add("playground-node");
  }

  item.dataset.component = type;
  if (type === "text-box") {
    setTextBoxBodyEditable(item, false);
  }
  if (type === "qubit") {
    ensureQubitLogicalId(item, geometry.qubitId);
    const roomQubitIndex = normalizeRoomQubitIndex(geometry.roomQubitIndex);
    if (Number.isInteger(roomQubitIndex)) {
      item.dataset.roomQubitIndex = String(roomQubitIndex);
    }
    updateQubitDisplayLabel(item);
    if (Array.isArray(geometry.vector)) {
      item.dataset.initialVector = JSON.stringify(
        normalizeVector2(geometry.vector),
      );
    }
  }
  if (typeof geometry.measurementGroupId === "string") {
    item.dataset.measurementGroupId = geometry.measurementGroupId;
  } else if (type === PLAYGROUND_SAVED_GROUP_COMPONENT_TYPE) {
    item.dataset.measurementGroupId = `${geometry.groupComponentId || "group"}-${Date.now().toString(36)}-${Math.random()
      .toString(36)
      .slice(2, 7)}`;
  }
  if (typeof geometry.groupComponentId === "string") {
    item.dataset.groupComponentId = geometry.groupComponentId;
  }
  if (typeof geometry.measurementRole === "string") {
    item.dataset.measurementRole = geometry.measurementRole;
  }
  item.dataset.generatedItemId =
    typeof geometry.id === "string" && geometry.id
      ? geometry.id
      : createGeneratedItemId(type);
  item.setAttribute("aria-label", config.label);
  item
    .querySelectorAll(".layout-resize-handle")
    .forEach((handle) => handle.remove());
  const minSize = minGeneratedLayoutSizeForType(type);
  const width = Number.isFinite(geometry.width)
    ? geometry.width
    : Number.isFinite(defaultsGeometry?.width)
      ? defaultsGeometry.width
      : config.width;
  const height = Number.isFinite(geometry.height)
    ? geometry.height
    : Number.isFinite(defaultsGeometry?.height)
      ? defaultsGeometry.height
      : config.height;
  const left = Number.isFinite(geometry.left) ? geometry.left : 0;
  const top = Number.isFinite(geometry.top) ? geometry.top : 0;
  item.style.left = `${Math.round(left)}px`;
  item.style.top = `${Math.round(top)}px`;
  item.style.width = `${Math.max(minSize.minWidth, Math.round(width))}px`;
  item.style.height = `${Math.max(minSize.minHeight, Math.round(height))}px`;
  if (Number.isFinite(geometry.z)) {
    item.style.zIndex = `${Math.round(geometry.z)}`;
  }
  if (type === "cnot-gate") {
    applyCnotComponentDefaultsToElement(item, {
      includeGateGeometry: !hasSavedGeometry,
    });
    if (geometry.cnotLayout) {
      applyCnotSnapshotToElement(item, geometry.cnotLayout, {
        includeGateGeometry: false,
      });
    }
  }
  if (isMeasurementComponentType(type)) {
    applyMeasurementLayoutSnapshot(
      item,
      playgroundComponentDefaultsCache?.[type],
      editableMeasurementPartSpecsForType(type),
      { includeGroupGeometry: false },
    );
    if (geometry.measurementLayout) {
      applyMeasurementLayoutSnapshot(
        item,
        geometry.measurementLayout,
        editableMeasurementPartSpecsForType(type),
        { includeGroupGeometry: false },
      );
    }
  }
  if (type === "mailbox") {
    applyMailboxSnapshotToElement(item, geometry.mailbox);
  }
  if (type === "single-gate") {
    if (
      !Number.isFinite(geometry.singleGateTick) &&
      Number.isFinite(defaultsGeometry?.singleGateTick)
    ) {
      item.dataset.playgroundSingleGateTick = `${normalizeTickIndex(defaultsGeometry.singleGateTick)}`;
    }
    initializeGeneratedSingleGateItem(item, geometry);
  }
  prepareGeneratedLayoutItem(item);
  return item;
}

function appendGeneratedLayoutItemToCanvas(canvas, item) {
  if (!isGeneratedLayoutCanvas(canvas) || !(item instanceof HTMLElement)) {
    return null;
  }
  canvas.appendChild(item);
  prepareGeneratedLayoutItem(item);
  initializeGeneratedLayoutItemRuntime(item);
  ensureUniqueGeneratedLayoutItemIds(canvas);
  ensureUniqueGeneratedLayoutQubitIds(canvas);
  ensureGeneratedMeasurementSlotIndexes(canvas);
  bringGeneratedItemToFront(item);
  setSelectedGeneratedLayoutItem(item);
  layoutGeneratedSingleGateDials(canvas);
  syncGeneratedTextBoxSequence(canvas);
  return item;
}

function positionGeneratedItemFromClientPoint(canvas, item, clientX, clientY) {
  if (!isGeneratedLayoutCanvas(canvas) || !(item instanceof HTMLElement)) {
    return;
  }
  const pointer = generatedViewportPointToCanvasPoint(canvas, clientX, clientY);
  const unclampedLeft = pointer.x - item.offsetWidth / 2;
  const unclampedTop = pointer.y - 18;
  const clamped = generatedLayoutClampItemPosition(
    canvas,
    item,
    unclampedLeft,
    unclampedTop,
  );
  item.style.left = `${Math.round(clamped.left)}px`;
  item.style.top = `${Math.round(clamped.top)}px`;
}

function setGeneratedEditorStatus(toolbar, text) {
  if (!(toolbar instanceof HTMLElement)) {
    return;
  }
  const status = toolbar.querySelector(".generated-editor-status");
  if (!(status instanceof HTMLElement)) {
    return;
  }
  status.textContent = text;
  if (!text) {
    return;
  }
  window.setTimeout(() => {
    if (status.textContent === text) {
      status.textContent = "";
    }
  }, 1800);
}

function selectedGeneratedComponentType(toolbar) {
  if (!(toolbar instanceof HTMLElement)) {
    return "";
  }
  const select = toolbar.querySelector(
    '[data-generated-editor-role="component-select"]',
  );
  return select instanceof HTMLSelectElement ? select.value : "";
}

function addGeneratedComponentAtPoint(canvas, type, clientX, clientY) {
  if (!isGeneratedLayoutCanvas(canvas)) {
    return null;
  }
  const savedGroup = savedGroupComponentForType(type);
  if (savedGroup) {
    return addGeneratedGroupComponentAtPoint(canvas, savedGroup, clientX, clientY);
  }
  if (!PLAYGROUND_COMPONENT_LIBRARY[type]) {
    return null;
  }
  const item = createGeneratedLayoutItemNode(type, {});
  appendGeneratedLayoutItemToCanvas(canvas, item);
  positionGeneratedItemFromClientPoint(canvas, item, clientX, clientY);
  return item;
}

function addGeneratedGroupComponentAtPoint(canvas, group, clientX, clientY) {
  if (
    !isGeneratedLayoutCanvas(canvas) ||
    !group ||
    !Array.isArray(group.items) ||
    group.items.length === 0
  ) {
    return null;
  }
  const origin = generatedViewportPointToCanvasPoint(canvas, clientX, clientY);
  const instanceId = `${group.id || "group"}-${Date.now().toString(36)}`;
  const geometry = {
    type: PLAYGROUND_SAVED_GROUP_COMPONENT_TYPE,
    left: origin.x,
    top: origin.y,
    width: Number.isFinite(group.width) ? group.width : 320,
    height: Number.isFinite(group.height) ? group.height : 240,
    measurementGroupId: instanceId,
    groupComponentId: group.id || "",
  };
  const item = createGeneratedLayoutItemNode(
    PLAYGROUND_SAVED_GROUP_COMPONENT_TYPE,
    geometry,
  );
  return appendGeneratedLayoutItemToCanvas(canvas, item);
}

function duplicateSelectedGeneratedLayoutItem() {
  if (
    !layoutEditorState.enabled ||
    !(selectedGeneratedLayoutItem instanceof HTMLElement) ||
    !selectedGeneratedLayoutItem.isConnected
  ) {
    return false;
  }
  const canvas = generatedCanvasForItem(selectedGeneratedLayoutItem);
  if (!canvas) {
    return false;
  }
  const geometry = serializeGeneratedLayoutItem(selectedGeneratedLayoutItem);
  stripGeneratedRuntimeIdsFromLayoutGeometry(geometry);
  geometry.left += PLAYGROUND_GRID_SIZE;
  geometry.top += PLAYGROUND_GRID_SIZE;
  const item = createGeneratedLayoutItemNode(geometry.type, geometry);
  appendGeneratedLayoutItemToCanvas(canvas, item);
  const clamped = generatedLayoutClampItemPosition(
    canvas,
    item,
    geometry.left,
    geometry.top,
  );
  item.style.left = `${Math.round(clamped.left)}px`;
  item.style.top = `${Math.round(clamped.top)}px`;
  if (isDocumentEditorCanvas(canvas)) {
    markDocumentEditorCanvasEdited(canvas);
    saveCurrentDocumentEditorScene();
    updateDocEditorButtons();
  }
  return true;
}

function removeGeneratedLayoutItem(item) {
  if (!(item instanceof HTMLElement) || !isGeneratedLayoutItem(item)) {
    return false;
  }
  const canvas = generatedCanvasForItem(item);
  if (isGeneratedQubitItem(item)) {
    Array.from(generatedCnotRuntimes.values()).forEach((runtime) => {
      if (runtime.slotOccupants.top === item) {
        runtime.slotOccupants.top = null;
      }
      if (runtime.slotOccupants.bottom === item) {
        runtime.slotOccupants.bottom = null;
      }
    });
    Array.from(generatedDoubleMeasurementRuntimes.values()).forEach(
      (runtime) => {
        if (runtime.slotOccupants.left === item) {
          runtime.slotOccupants.left = null;
        }
        if (runtime.slotOccupants.right === item) {
          runtime.slotOccupants.right = null;
        }
      },
    );
    Array.from(generatedSeparatedPairMeasurementRuntimes.values()).forEach(
      (runtime) => {
        runtime.pendingMeasurements = runtime.pendingMeasurements.filter(
          (entry) => entry.qubitItem !== item,
        );
      },
    );
  }
  generatedSingleGateRuntimes.delete(item);
  generatedQubitRuntimes.delete(item);
  generatedSingleMeasurementRuntimes.delete(item);
  generatedDoubleMeasurementRuntimes.delete(item);
  generatedSeparatedPairMeasurementRuntimes.delete(item);
  generatedCnotRuntimes.delete(item);
  if (selectedGeneratedLayoutItem === item) {
    selectedGeneratedLayoutItem = null;
  }
  item.remove();
  if (canvas) {
    syncGeneratedTextBoxSequence(canvas);
  }
  updateGeneratedEditorButtons();
  if (isDocumentEditorCanvas(canvas)) {
    markDocumentEditorCanvasEdited(canvas);
    saveCurrentDocumentEditorScene();
    updateDocEditorButtons();
  }
  return true;
}

function removeSelectedGeneratedLayoutPart() {
  if (
    !layoutEditorState.enabled ||
    !(selectedGeneratedLayoutItem instanceof HTMLElement) ||
    !(selectedGeneratedLayoutPart instanceof HTMLElement) ||
    !selectedGeneratedLayoutItem.contains(selectedGeneratedLayoutPart) ||
    selectedGeneratedLayoutPart.parentElement !== selectedGeneratedLayoutItem ||
    !selectedGeneratedLayoutPart.classList.contains("saved-group-child")
  ) {
    return false;
  }
  const canvas = generatedCanvasForItem(selectedGeneratedLayoutItem);
  const owner = selectedGeneratedLayoutItem;
  selectedGeneratedLayoutPart.remove();
  clearSelectedGeneratedLayoutPart();
  generatedSeparatedPairMeasurementRuntimes.delete(owner);
  prepareGeneratedLayoutItem(owner);
  setSelectedGeneratedLayoutItem(owner);
  if (canvas) {
    syncGeneratedTextBoxSequence(canvas);
  }
  if (isDocumentEditorCanvas(canvas)) {
    markDocumentEditorCanvasEdited(canvas);
    saveCurrentDocumentEditorScene();
    updateDocEditorButtons();
  }
  updateGeneratedEditorButtons(canvas);
  return true;
}

function removeSelectedGeneratedLayoutItem() {
  if (
    !layoutEditorState.enabled ||
    !(selectedGeneratedLayoutItem instanceof HTMLElement)
  ) {
    return false;
  }
  if (removeSelectedGeneratedLayoutPart()) {
    return true;
  }
  return removeGeneratedLayoutItem(selectedGeneratedLayoutItem);
}

function createGeneratedEditorToolbar(entry, canvas) {
  if (isGeneratedLandingPageTab(entry)) {
    return null;
  }
  const toolbar = document.createElement("div");
  toolbar.className = "playground-toolbar generated-editor-toolbar";
  toolbar.dataset.generatedEditorToolbar = "true";

  const label = document.createElement("label");
  const selectId = `generatedComponentSelect-${entry.id || generatedTabSlug(entry.label)}`;
  label.setAttribute("for", selectId);
  label.textContent = "Component";
  toolbar.appendChild(label);

  const select = document.createElement("select");
  select.id = selectId;
  select.className = "playground-component-select";
  select.dataset.generatedEditorRole = "component-select";
  select.setAttribute("aria-label", `${entry.label} component picker`);
  populateComponentPicker(select);
  toolbar.appendChild(select);

  const saveComponentButton = document.createElement("button");
  saveComponentButton.className = "playground-tool-btn";
  saveComponentButton.type = "button";
  saveComponentButton.dataset.generatedEditorAction = "save-component";
  saveComponentButton.textContent = "Save Component";
  saveComponentButton.disabled = true;
  saveComponentButton.addEventListener("click", () => {
    if (
      persistGeneratedComponentDefaultsFromElement(selectedGeneratedLayoutItem)
    ) {
      setGeneratedEditorStatus(toolbar, "Component saved globally");
    } else {
      setGeneratedEditorStatus(toolbar, "Component save failed");
    }
  });
  toolbar.appendChild(saveComponentButton);

  const duplicateButton = document.createElement("button");
  duplicateButton.className = "playground-tool-btn";
  duplicateButton.type = "button";
  duplicateButton.dataset.generatedEditorAction = "duplicate";
  duplicateButton.textContent = "Duplicate";
  duplicateButton.disabled = true;
  duplicateButton.addEventListener("click", () => {
    if (duplicateSelectedGeneratedLayoutItem()) {
      setGeneratedEditorStatus(toolbar, "Duplicated");
    }
  });
  toolbar.appendChild(duplicateButton);

  const deleteButton = document.createElement("button");
  deleteButton.className = "playground-tool-btn";
  deleteButton.type = "button";
  deleteButton.dataset.generatedEditorAction = "delete";
  deleteButton.textContent = "Delete";
  deleteButton.disabled = true;
  deleteButton.addEventListener("click", () => {
    if (removeSelectedGeneratedLayoutItem()) {
      setGeneratedEditorStatus(toolbar, "Deleted");
    }
  });
  toolbar.appendChild(deleteButton);

  const status = document.createElement("span");
  status.className = "playground-status generated-editor-status";
  status.setAttribute("aria-live", "polite");
  toolbar.appendChild(status);

  const hint = document.createElement("span");
  hint.className = "playground-hint";
  hint.textContent =
    "Click anywhere in the container to place the selected component.";
  toolbar.appendChild(hint);

  canvas.addEventListener("click", (event) => {
    if (!layoutEditorState.enabled) {
      return;
    }
    if (event.target !== canvas) {
      return;
    }
    const selectedType = selectedGeneratedComponentType(toolbar);
    if (!selectedType) {
      clearSelectedGeneratedLayoutItem();
      return;
    }
    const item = addGeneratedComponentAtPoint(
      canvas,
      selectedType,
      event.clientX,
      event.clientY,
    );
    if (item) {
      select.value = "";
      setGeneratedEditorStatus(toolbar, "Added");
    }
  });

  return toolbar;
}

function createGeneratedExperimentToolbar(canvas) {
  const toolbar = document.createElement("div");
  toolbar.className = "playground-toolbar generated-experiment-toolbar";

  const resetButton = document.createElement("button");
  resetButton.className = "playground-tool-btn";
  resetButton.type = "button";
  resetButton.dataset.generatedExperimentAction = "reset";
  resetButton.textContent = "Reset";
  resetButton.addEventListener("click", (event) => {
    event.stopPropagation();
    if (mailboxRoomIsJoined()) {
      mailboxRoomPublishRoomReset(canvas).catch((error) => {
        console.warn?.("[Qubit Lab] room reset failed", error);
        resetGeneratedTabForCanvas(canvas);
      });
      return;
    }
    resetGeneratedTabForCanvas(canvas);
  });
  toolbar.appendChild(resetButton);

  const status = document.createElement("span");
  status.className = "playground-status generated-experiment-status";
  status.setAttribute("aria-live", "polite");
  toolbar.appendChild(status);

  const state = generatedExperimentStateForCanvas(canvas);
  if (state) {
    state.toolbar = toolbar;
    state.status = status;
    state.experiment = null;
  }
  updateGeneratedExperimentToolbar(canvas);
  return toolbar;
}

function isGeneratedLandingPageTab(entry) {
  return storageLabelKey(entry?.label) === "introduction";
}

function generatedTabEntryForId(tabId) {
  const normalizedTabId = storageIdentifierKey(tabId);
  if (!normalizedTabId) {
    return null;
  }
  return (
    (generatedTabsState.tabs || []).find(
      (entry) => storageIdentifierKey(entry?.id) === normalizedTabId,
    ) || null
  );
}

function generatedLandingPageEntryForTabId(tabId) {
  const entry = generatedTabEntryForId(tabId);
  return isGeneratedLandingPageTab(entry) ? entry : null;
}

function generatedLandingLinkTargets(entry) {
  const currentId = typeof entry?.id === "string" ? entry.id : "";
  return (generatedTabsState.tabs || [])
    .filter(
      (candidate) =>
        candidate &&
        typeof candidate.id === "string" &&
        candidate.id &&
        candidate.id !== currentId &&
        !isGeneratedLandingPageTab(candidate) &&
        typeof candidate.label === "string" &&
        candidate.label.trim(),
    )
    .map((candidate) => ({
      id: candidate.id,
      label: candidate.label.trim(),
    }));
}

function generatedLandingIntroText(entry) {
  return (
    normalizeSavedGroupLayoutItems(entry?.layout?.items).find(
      (item) => item?.type === "text-box" && typeof item.text === "string",
    )?.text || ""
  ).trim();
}

function generatedLandingTextBoxGeometry(entry) {
  const existing = normalizeSavedGroupLayoutItems(entry?.layout?.items).find(
    (item) => item?.type === "text-box",
  );
  if (existing) {
    return cloneJson(existing) || { ...existing };
  }
  return {
    id: `landing-${entry?.id || "introduction"}-text`,
    type: "text-box",
    left: 120,
    top: 80,
    width: 680,
    height: 360,
    z: 2,
    text: "",
    buttons: [],
    buttonMode: "none",
  };
}

function createLandingDocumentFromEntry(entry) {
  if (!entry?.id || !isGeneratedLandingPageTab(entry)) {
    return null;
  }
  const dimensions = playgroundLayoutCanvasDimensions(entry.layout);
  const savedAt = Number.isFinite(entry.layout?.savedAt)
    ? entry.layout.savedAt
    : Date.now();
  return normalizeDocument({
    tabId: entry.id,
    title: "What's this?",
    scenes: [
      createDocumentScene({
        id: `landing-${entry.id}-scene`,
        items: [generatedLandingTextBoxGeometry(entry)],
        canvasWidth: dimensions.width,
        canvasHeight: dimensions.height,
        experiment: null,
        savedAt,
      }),
    ],
    updatedAt: savedAt,
  });
}

function persistLandingDocumentEditorDocument() {
  const tabId = documentEditorState.document?.tabId || documentEditorState.tabId;
  const entry = generatedLandingPageEntryForTabId(tabId);
  if (!entry) {
    return false;
  }
  const scene =
    activeDocumentEditorScene() || documentEditorState.document?.scenes?.[0];
  if (!scene) {
    return false;
  }
  const textBox = normalizeSavedGroupLayoutItems(scene.items).find(
    (item) => item?.type === "text-box",
  );
  const nextState = cloneJson(generatedTabsState) || { tabs: [] };
  const nextTabs = Array.isArray(nextState.tabs) ? nextState.tabs : [];
  const tabIndex = nextTabs.findIndex(
    (candidate) =>
      storageIdentifierKey(candidate?.id) === storageIdentifierKey(entry.id),
  );
  if (tabIndex < 0) {
    return false;
  }
  const nextEntry = nextTabs[tabIndex] || {};
  const layout =
    nextEntry.layout && typeof nextEntry.layout === "object"
      ? nextEntry.layout
      : {};
  const replacementTextBox = textBox
    ? { ...(cloneJson(textBox) || textBox), type: "text-box" }
    : null;
  let replacedTextBox = false;
  const nextItems = normalizeSavedGroupLayoutItems(layout.items).reduce(
    (items, item) => {
      if (item?.type === "text-box") {
        if (!replacedTextBox && replacementTextBox) {
          items.push(replacementTextBox);
        }
        replacedTextBox = true;
        return items;
      }
      items.push(item);
      return items;
    },
    [],
  );
  if (!replacedTextBox && replacementTextBox) {
    nextItems.unshift(replacementTextBox);
  }
  nextTabs[tabIndex] = {
    ...nextEntry,
    layout: {
      ...layout,
      items: nextItems,
      canvasWidth: clampDocumentCanvasWidth(scene.canvasWidth),
      canvasHeight: clampDocumentCanvasHeight(scene.canvasHeight),
      savedAt: Date.now(),
    },
  };
  nextState.tabs = nextTabs;
  if (!writeGeneratedTabsState(nextState)) {
    setDocumentEditorMessage(contentFileSaveFailureMessage(), {
      target: "status",
      warning: true,
    });
    return false;
  }
  applyGeneratedTabsState(nextState);
  refreshGeneratedDocumentToolbars();
  plagroundComposer?.handleGeneratedTabsChanged?.();
  return true;
}

function syncWorkshopModeButtons() {
  workshopModeButtons.forEach((button) => {
    if (!(button instanceof HTMLButtonElement)) {
      return;
    }
    if (button.dataset.workshopMode === "back") {
      button.classList.remove("active");
      button.removeAttribute("aria-selected");
      button.tabIndex = 0;
      return;
    }
    const isActive = button.dataset.workshopMode === workshopEditorMode;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-selected", isActive ? "true" : "false");
    button.tabIndex = isActive ? 0 : -1;
  });
}

function introductionLandingTabId() {
  return (
    (generatedTabsState.tabs || []).find((entry) =>
      isGeneratedLandingPageTab(entry),
    )?.id || ""
  );
}

function returnToIntroductionLandingPage() {
  document.body.classList.remove("workshop-unlocked");
  workshopEditorMode = "tab";
  document.documentElement.dataset.workshopEditorMode = workshopEditorMode;
  syncWorkshopModeButtons();
  setActiveTab(introductionLandingTabId() || initialLocalTabTarget());
}

function setWorkshopEditorMode(mode, { activate = true } = {}) {
  if (mode === "back") {
    returnToIntroductionLandingPage();
    return;
  }
  const normalized =
    mode === "component" || mode === "whats-this" || mode === "local-lab"
      ? mode
      : "tab";
  workshopEditorMode = normalized;
  document.documentElement.dataset.workshopEditorMode = normalized;
  syncWorkshopModeButtons();
  if (!activate) {
    return;
  }
  if (normalized === "local-lab") {
    setActiveTab("local-lab");
  } else if (normalized === "whats-this") {
    setActiveTab("doc-editor");
  } else {
    setActiveTab("plaground");
  }
  plagroundComposer?.handleWorkshopModeChanged?.(normalized);
}

function openWorkshop() {
  workshopUnlocked = true;
  document.body.classList.add("workshop-unlocked");
  closeWorkshopPasswordDialog();
  setWorkshopEditorMode("tab");
}

function openWorkshopPasswordDialog() {
  if (workshopUnlocked) {
    openWorkshop();
    return;
  }
  if (!(workshopPasswordOverlay instanceof HTMLElement)) {
    return;
  }
  workshopPasswordOverlay.hidden = false;
  if (workshopPasswordStatus instanceof HTMLElement) {
    workshopPasswordStatus.textContent = "";
  }
  if (workshopPasswordInput instanceof HTMLInputElement) {
    workshopPasswordInput.value = "";
    window.requestAnimationFrame(() => workshopPasswordInput.focus());
  }
}

function closeWorkshopPasswordDialog() {
  if (workshopPasswordOverlay instanceof HTMLElement) {
    workshopPasswordOverlay.hidden = true;
  }
}

function unlockWorkshop() {
  openWorkshop();
}

function createGeneratedLandingPanel(entry) {
  const gatePanel = document.createElement("section");
  gatePanel.className = "gate-panel generated-tab-panel generated-landing-panel";

  const hero = document.createElement("section");
  hero.className = "landing-hero";
  hero.setAttribute("aria-label", "Qubit Lab introduction");

  const title = document.createElement("h1");
  title.className = "landing-hero-title";
  title.textContent = "Qubit Lab";
  hero.appendChild(title);

  const animatedQubit = document.createElement("div");
  animatedQubit.className = "landing-qubit-glow";
  animatedQubit.setAttribute("aria-hidden", "true");
  hero.appendChild(animatedQubit);

  const tourTarget = generatedLandingLinkTargets(entry).find((target) =>
    storageLabelKey(target.label) === "one qubit",
  );
  const signs = document.createElement("div");
  signs.className = "landing-signs";
  signs.setAttribute("aria-label", "Qubit Lab signs");
  const workshopSign = document.createElement("button");
  workshopSign.className = "landing-sign landing-workshop-sign";
  workshopSign.type = "button";
  const workshopSignLabel = document.createElement("span");
  workshopSignLabel.className = "landing-sign-label";
  workshopSignLabel.textContent = "Workshop";
  workshopSign.appendChild(workshopSignLabel);
  workshopSign.addEventListener("click", () => {
    openWorkshopPasswordDialog();
  });
  const tourSign = document.createElement("button");
  tourSign.className = "landing-sign landing-tour-sign";
  tourSign.type = "button";
  const tourSignLabel = document.createElement("span");
  tourSignLabel.className = "landing-sign-label";
  tourSignLabel.textContent = "To the Tour";
  const tourSignArrow = document.createElement("span");
  tourSignArrow.className = "landing-sign-arrow";
  tourSignArrow.setAttribute("aria-hidden", "true");
  tourSignArrow.textContent = "←";
  tourSign.append(tourSignLabel, tourSignArrow);
  tourSign.addEventListener("click", () => {
    setActiveTab(tourTarget?.id || "custom-one-qubit");
  });
  const labSign = document.createElement("div");
  labSign.className = "landing-sign landing-lab-sign";
  labSign.setAttribute("aria-label", "The Lab is Closed");
  const labSignMain = document.createElement("span");
  labSignMain.className = "landing-lab-sign-main";
  labSignMain.textContent = "The Lab is";
  const labSignNail = document.createElement("span");
  labSignNail.className = "landing-lab-sign-nail";
  labSignNail.setAttribute("aria-hidden", "true");
  const labSignHanger = document.createElement("span");
  labSignHanger.className = "landing-lab-sign-hanger";
  labSignHanger.setAttribute("aria-hidden", "true");
  const labSignClosed = document.createElement("span");
  labSignClosed.className = "landing-lab-sign-closed";
  labSignClosed.textContent = "Closed";
  labSign.append(
    labSignMain,
    labSignNail,
    labSignHanger,
    labSignClosed,
  );
  signs.append(tourSign, workshopSign, labSign);
  hero.appendChild(signs);

  gatePanel.appendChild(hero);
  return gatePanel;
}

function createGeneratedDocumentToolbar(entry, canvas) {
  if (
    !entry?.id ||
    isGeneratedLandingPageTab(entry) ||
    !documentForTabId(entry.id)
  ) {
    return null;
  }
  const toolbar = document.createElement("div");
  toolbar.className = "playground-toolbar generated-document-toolbar";
  const button = document.createElement("button");
  button.className = "playground-tool-btn";
  button.type = "button";
  button.dataset.generatedDocumentAction = "whats-this";
  button.textContent = "What's this?";
  button.addEventListener("click", (event) => {
    event.stopPropagation();
    openDocumentRuntime(entry.id, { canvas, inline: true });
  });
  toolbar.appendChild(button);
  return toolbar;
}

function generatedTabLabelForId(tabId) {
  const entry = (generatedTabsState.tabs || []).find(
    (candidate) => candidate?.id === tabId,
  );
  const label =
    typeof entry?.label === "string" && entry.label.trim()
      ? entry.label
      : document.getElementById(`tab-${tabId}`)?.textContent || "";
  return String(label || "the current").trim().replace(/\s+/g, " ");
}

function applyInlineDocumentRuntimeToolbar(tabId, canvas) {
  if (!(canvas instanceof HTMLElement)) {
    return;
  }
  const gatePanel = canvas.closest(".generated-tab-panel");
  if (!(gatePanel instanceof HTMLElement)) {
    return;
  }
  const resetButton = gatePanel.querySelector(
    ':scope > .generated-experiment-toolbar [data-generated-experiment-action="reset"]',
  );
  if (resetButton instanceof HTMLButtonElement) {
    resetButton.textContent = `Back to the ${generatedTabLabelForId(tabId)} tab`;
    resetButton.dataset.docRuntimeBackButton = "true";
  }
  gatePanel
    .querySelectorAll(":scope > .generated-document-toolbar")
    .forEach((toolbar) => toolbar.remove());
}

function refreshGeneratedDocumentToolbarForEntry(entry) {
  if (!entry?.id) {
    return false;
  }
  const panel = document.getElementById(`panel-${entry.id}`);
  if (!(panel instanceof HTMLElement)) {
    return false;
  }
  const gatePanel = panel.querySelector(".generated-tab-panel");
  if (!(gatePanel instanceof HTMLElement)) {
    return false;
  }
  gatePanel
    .querySelectorAll(":scope > .generated-document-toolbar")
    .forEach((toolbar) => toolbar.remove());
  const canvas = gatePanel.querySelector(".generated-layout-canvas");
  const toolbar = createGeneratedDocumentToolbar(entry, canvas);
  if (!toolbar) {
    return false;
  }
  const canvasViewport =
    canvas instanceof HTMLElement
      ? canvas.closest(".generated-layout-viewport")
      : null;
  const experimentToolbar = gatePanel.querySelector(
    ":scope > .generated-experiment-toolbar",
  );
  gatePanel.insertBefore(
    toolbar,
    experimentToolbar?.nextSibling || canvasViewport || null,
  );
  return true;
}

function refreshGeneratedDocumentToolbarForTabId(tabId) {
  const entry = (generatedTabsState.tabs || []).find(
    (candidate) => candidate?.id === tabId,
  );
  return refreshGeneratedDocumentToolbarForEntry(entry);
}

function refreshGeneratedDocumentToolbars() {
  (generatedTabsState.tabs || []).forEach(refreshGeneratedDocumentToolbarForEntry);
}

function playgroundLayoutCanvasDimensions(layout) {
  const items = normalizeSavedGroupLayoutItems(layout?.items);
  const bounds = items.reduce(
    (acc, item) => {
      const right =
        parseLayoutNumeric(item?.left, 0) + parseLayoutNumeric(item?.width, 0);
      const bottom =
        parseLayoutNumeric(item?.top, 0) + parseLayoutNumeric(item?.height, 0);
      return {
        right: Math.max(acc.right, right),
        bottom: Math.max(acc.bottom, bottom),
      };
    },
    { right: 520, bottom: 480 },
  );
  return {
    width: Math.max(
      520,
      Math.round(parseLayoutNumeric(layout?.canvasWidth, bounds.right + 80)),
    ),
    height: Math.max(
      480,
      Math.round(parseLayoutNumeric(layout?.canvasHeight, bounds.bottom + 80)),
    ),
  };
}

function createGeneratedLayoutViewport(canvas, dimensions) {
  const viewport = document.createElement("div");
  viewport.className = "generated-layout-viewport";
  viewport.style.setProperty(
    "--generated-layout-logical-width",
    `${dimensions.width}px`,
  );
  viewport.style.setProperty(
    "--generated-layout-logical-height",
    `${dimensions.height}px`,
  );
  viewport.style.setProperty(
    "--generated-layout-aspect-ratio",
    `${dimensions.width} / ${dimensions.height}`,
  );
  canvas.dataset.generatedLogicalWidth = `${dimensions.width}`;
  canvas.dataset.generatedLogicalHeight = `${dimensions.height}`;
  viewport.appendChild(canvas);
  generatedLayoutResizeObserver?.observe(viewport);
  return viewport;
}

function renderGeneratedLayoutPanel(panel, entry) {
  if (!(panel instanceof HTMLElement)) {
    return;
  }
  panel.dataset.generatedLayoutPanel = "true";
  panel.replaceChildren();
  if (isGeneratedLandingPageTab(entry)) {
    panel.appendChild(createGeneratedLandingPanel(entry));
    return;
  }
  const gatePanel = document.createElement("section");
  gatePanel.className = "gate-panel generated-tab-panel";
  const canvas = document.createElement("div");
  canvas.className = "generated-layout-canvas playground-canvas";
  canvas.setAttribute("aria-label", `${entry.label} generated layout`);
  canvas.dataset.generatedTabId =
    typeof entry.id === "string" && entry.id
      ? entry.id
      : panel.id.replace(/^panel-/, "");
  const dimensions = playgroundLayoutCanvasDimensions(entry.layout);
  canvas.style.width = `${dimensions.width}px`;
  canvas.style.height = `${dimensions.height}px`;
  const items = normalizeSavedGroupLayoutItems(entry.layout?.items);
  items.forEach((geometry) => {
    const type = typeof geometry?.type === "string" ? geometry.type : "qubit";
    canvas.appendChild(createGeneratedLayoutItemNode(type, geometry));
  });
  prepareGeneratedLayoutCanvas(canvas);
  canvas.addEventListener("mousedown", beginGeneratedGateDialGestureFromEvent);
  canvas.addEventListener("touchstart", beginGeneratedGateDialGestureFromEvent, {
    passive: false,
  });
  canvas.addEventListener("mousedown", beginGeneratedLayoutEditGesture);
  canvas.addEventListener("touchstart", beginGeneratedLayoutEditGesture, {
    passive: false,
  });
  const editorToolbar = createGeneratedEditorToolbar(entry, canvas);
  if (editorToolbar) {
    gatePanel.appendChild(editorToolbar);
  }
  if (!isGeneratedLandingPageTab(entry)) {
    gatePanel.appendChild(createGeneratedExperimentToolbar(canvas));
  }
  gatePanel.appendChild(createGeneratedLayoutViewport(canvas, dimensions));
  panel.appendChild(gatePanel);
  syncGeneratedLayoutCanvasScale(canvas);
  refreshGeneratedDocumentToolbarForEntry(entry);
  syncGeneratedTextBoxSequence(canvas, { reset: true });
  updateGeneratedEditorButtons(canvas);
  window.requestAnimationFrame(() => {
    syncGeneratedLayoutCanvasScale(canvas);
    layoutGeneratedSingleGateDials(canvas);
  });
}

function activeDocumentEditorScene() {
  const documentEntry = documentEditorState.document;
  if (!documentEntry || !Array.isArray(documentEntry.scenes)) {
    return null;
  }
  return documentEntry.scenes[documentEditorState.sceneIndex] || null;
}

function activeDocumentEditorTarget() {
  return collectPlaygroundSaveTargets().find(
    (target) => target.id === documentEditorState.tabId,
  );
}

function isDocumentEditorTabActive() {
  const activeButton = document.querySelector(".tab-btn.active");
  return activeButton?.dataset?.tabTarget === "doc-editor";
}

function setDocumentEditorMessage(text, options = {}) {
  const target =
    options.target === "status" ? docEditorStatus : docEditorRecordingStatus;
  if (!(target instanceof HTMLElement)) {
    return;
  }
  target.textContent = text;
  target.classList.toggle("doc-warning", Boolean(options.warning));
  if (documentEditorState.statusTimer !== null) {
    window.clearTimeout(documentEditorState.statusTimer);
    documentEditorState.statusTimer = null;
  }
  if (!text || options.sticky) {
    return;
  }
  documentEditorState.statusTimer = window.setTimeout(() => {
    if (target.textContent === text) {
      target.textContent = "";
      target.classList.remove("doc-warning");
    }
    documentEditorState.statusTimer = null;
  }, 2200);
}

function clampDocumentCanvasWidth(value) {
  return Math.round(
    clamp(
      parseLayoutNumeric(value, DOCUMENT_DEFAULT_CANVAS_WIDTH),
      DOCUMENT_CANVAS_MIN_WIDTH,
      DOCUMENT_CANVAS_MAX_WIDTH,
    ),
  );
}

function clampDocumentCanvasHeight(value) {
  return Math.round(
    clamp(
      parseLayoutNumeric(value, DOCUMENT_DEFAULT_CANVAS_HEIGHT),
      DOCUMENT_CANVAS_MIN_HEIGHT,
      DOCUMENT_CANVAS_MAX_HEIGHT,
    ),
  );
}

function documentEditorCanvasLogicalWidth() {
  if (!(docEditorCanvas instanceof HTMLElement)) {
    return DOCUMENT_DEFAULT_CANVAS_WIDTH;
  }
  const inlineWidth = parseLayoutNumeric(docEditorCanvas.style.width, NaN);
  return clampDocumentCanvasWidth(
    Number.isFinite(inlineWidth) ? inlineWidth : docEditorCanvas.offsetWidth,
  );
}

function documentEditorCanvasLogicalHeight() {
  if (!(docEditorCanvas instanceof HTMLElement)) {
    return DOCUMENT_DEFAULT_CANVAS_HEIGHT;
  }
  const inlineHeight = parseLayoutNumeric(docEditorCanvas.style.height, NaN);
  return clampDocumentCanvasHeight(
    Number.isFinite(inlineHeight) ? inlineHeight : docEditorCanvas.offsetHeight,
  );
}

function setDocumentCanvasSize(width, height, options = {}) {
  const scene = activeDocumentEditorScene();
  if (!scene || !(docEditorCanvas instanceof HTMLElement)) {
    return false;
  }
  const nextWidth = clampDocumentCanvasWidth(width);
  const nextHeight = clampDocumentCanvasHeight(height);
  if (options.fromUser) {
    markDocumentEditorCanvasEdited(docEditorCanvas);
  }
  scene.canvasWidth = nextWidth;
  scene.canvasHeight = nextHeight;
  documentEditorState.suppressResizeObserver = true;
  docEditorCanvas.style.width = `${nextWidth}px`;
  docEditorCanvas.style.height = `${nextHeight}px`;
  if (docEditorCanvasWidth instanceof HTMLInputElement) {
    docEditorCanvasWidth.value = `${nextWidth}`;
  }
  if (docEditorCanvasHeight instanceof HTMLInputElement) {
    docEditorCanvasHeight.value = `${nextHeight}`;
  }
  window.requestAnimationFrame(() => {
    documentEditorState.suppressResizeObserver = false;
  });
  if (options.persist !== false) {
    persistDocumentEditorDocument();
  }
  return true;
}

function syncDocumentCanvasSizeFromDom() {
  if (
    documentEditorState.rendering ||
    documentEditorState.suppressResizeObserver ||
    !(docEditorCanvas instanceof HTMLElement)
  ) {
    return;
  }
  const scene = activeDocumentEditorScene();
  if (!scene) {
    return;
  }
  const width = documentEditorCanvasLogicalWidth();
  const height = documentEditorCanvasLogicalHeight();
  if (width !== scene.canvasWidth || height !== scene.canvasHeight) {
    setDocumentCanvasSize(width, height);
  }
}

function persistDocumentEditorDocument() {
  if (!documentEditorState.document) {
    return false;
  }
  if (generatedLandingPageEntryForTabId(documentEditorState.tabId)) {
    return persistLandingDocumentEditorDocument();
  }
  const saved = upsertDocument(documentEditorState.document);
  if (saved) {
    applyGeneratedTabsState(generatedTabsState);
    refreshGeneratedDocumentToolbars();
    plagroundComposer?.handleGeneratedTabsChanged?.();
  } else {
    setDocumentEditorMessage(contentFileSaveFailureMessage(), {
      target: "status",
      warning: true,
    });
  }
  return saved;
}

function saveCurrentDocumentEditorScene(options = {}) {
  if (
    !documentEditorState.document ||
    !(docEditorCanvas instanceof HTMLElement) ||
    documentEditorState.rendering
  ) {
    return false;
  }
  const scene = activeDocumentEditorScene();
  if (!scene) {
    return false;
  }
  const experimentState = generatedExperimentStateForCanvas(docEditorCanvas);
  if (experimentState?.recording || experimentState?.playing) {
    return false;
  }
  if (experimentState?.playbackResultVisible && !options.savePlaybackResult) {
    return true;
  }
  const layout = captureGeneratedLayoutFromCanvas(docEditorCanvas);
  if (layout) {
    scene.items = normalizeSavedGroupLayoutItems(layout.items);
    scene.canvasWidth = documentEditorCanvasLogicalWidth();
    scene.canvasHeight = documentEditorCanvasLogicalHeight();
    scene.savedAt = Date.now();
  }
  documentEditorState.document.updatedAt = Date.now();
  return options.persist === false ? true : persistDocumentEditorDocument();
}

function handleGeneratedGateSettingChanged(canvas) {
  if (!isDocumentEditorCanvas(canvas)) {
    return;
  }
  const experimentState = generatedExperimentStateForCanvas(canvas);
  if (experimentState?.recording || experimentState?.playing) {
    updateDocEditorButtons();
    return;
  }
  markDocumentEditorCanvasEdited(canvas);
  saveCurrentDocumentEditorScene();
  updateDocEditorButtons();
}

function currentDocumentEditorCanvasHasNonTextComponent() {
  if (!(docEditorCanvas instanceof HTMLElement)) {
    return false;
  }
  return Array.from(
    docEditorCanvas.querySelectorAll(":scope > .playground-node"),
  ).some((item) => item instanceof HTMLElement && item.dataset.component !== "text-box");
}

function updateDocEditorButtons() {
  const hasDocument = Boolean(documentEditorState.document);
  const scene = activeDocumentEditorScene();
  const sceneCount = documentEditorState.document?.scenes?.length || 0;
  const experimentState =
    docEditorCanvas instanceof HTMLElement
      ? generatedExperimentStateForCanvas(docEditorCanvas)
      : null;
  const recording = Boolean(experimentState?.recording);
  const playing = Boolean(experimentState?.playing);
  const selectedOnDocCanvas =
    selectedGeneratedLayoutItem instanceof HTMLElement &&
    selectedGeneratedLayoutItem.isConnected &&
    selectedGeneratedLayoutItem.parentElement === docEditorCanvas;
  if (docEditorDeleteButton instanceof HTMLButtonElement) {
    docEditorDeleteButton.disabled = !hasDocument || recording || playing;
  }
  if (docEditorSceneBackButton instanceof HTMLButtonElement) {
    docEditorSceneBackButton.disabled =
      !hasDocument || recording || playing || documentEditorState.sceneIndex <= 0;
  }
  if (docEditorSceneNextButton instanceof HTMLButtonElement) {
    docEditorSceneNextButton.disabled =
      !hasDocument ||
      recording ||
      playing ||
      documentEditorState.sceneIndex >= sceneCount - 1;
  }
  if (docEditorNewSceneButton instanceof HTMLButtonElement) {
    docEditorNewSceneButton.disabled = !hasDocument || recording || playing;
  }
  if (docEditorDeleteSceneButton instanceof HTMLButtonElement) {
    docEditorDeleteSceneButton.disabled =
      !hasDocument || sceneCount <= 1 || recording || playing;
  }
  if (docEditorDoneButton instanceof HTMLButtonElement) {
    docEditorDoneButton.disabled = !hasDocument || recording || playing;
  }
  if (docEditorDuplicateButton instanceof HTMLButtonElement) {
    docEditorDuplicateButton.disabled =
      !selectedOnDocCanvas || !layoutEditorState.enabled || recording || playing;
  }
  if (docEditorDeleteComponentButton instanceof HTMLButtonElement) {
    docEditorDeleteComponentButton.disabled =
      !selectedOnDocCanvas || !layoutEditorState.enabled || recording || playing;
  }
  const canRecord =
    hasDocument &&
    Boolean(scene) &&
    currentDocumentEditorCanvasHasNonTextComponent();
  if (docEditorStartRecordingButton instanceof HTMLButtonElement) {
    docEditorStartRecordingButton.disabled = !canRecord || recording || playing;
  }
  if (docEditorStopRecordingButton instanceof HTMLButtonElement) {
    docEditorStopRecordingButton.disabled = !recording || playing;
  }
  if (docEditorPlayRecordingButton instanceof HTMLButtonElement) {
    docEditorPlayRecordingButton.disabled =
      !sceneHasRecordedExperiment(scene) || recording || playing;
  }
  const target = activeDocumentEditorTarget();
  if (docEditorStatus instanceof HTMLElement) {
    docEditorStatus.textContent = hasDocument
      ? `Editing doc for ${target?.label || documentEditorState.tabId}`
      : "No document selected";
  }
  if (docEditorSceneLabel instanceof HTMLElement) {
    docEditorSceneLabel.textContent =
      hasDocument && scene
        ? `Scene ${documentEditorState.sceneIndex + 1} of ${sceneCount}`
        : "";
  }
  if (docEditorCanvas instanceof HTMLElement) {
    docEditorCanvas.classList.remove("doc-scene-recording-locked");
    docEditorCanvas.style.resize = "both";
  }
  if (!recording && !playing && docEditorRecordingStatus instanceof HTMLElement) {
    docEditorRecordingStatus.textContent = sceneHasRecordedExperiment(scene)
      ? "Recording ready"
      : canRecord
        ? "No recording yet"
        : "Add a non-text component to record";
    docEditorRecordingStatus.classList.remove("doc-warning");
  }
}

function renderDocumentEditorScene() {
  if (
    !(docEditorCanvas instanceof HTMLElement) ||
    !documentEditorState.document
  ) {
    return false;
  }
  const scene = activeDocumentEditorScene();
  if (!scene) {
    return false;
  }
  documentEditorState.rendering = true;
  clearSelectedGeneratedLayoutItem();
  if (generatedRuntimeDrag?.canvas === docEditorCanvas) {
    generatedRuntimeDrag.item?.classList.remove("dragging");
    generatedRuntimeDrag = null;
  }
  docEditorCanvas.replaceChildren();
  docEditorCanvas.dataset.generatedTabId = `doc-editor-${documentEditorState.tabId}-${scene.id}`;
  setDocumentCanvasSize(scene.canvasWidth, scene.canvasHeight, {
    persist: false,
  });
  normalizeSavedGroupLayoutItems(scene.items).forEach((geometry) => {
    const type = typeof geometry?.type === "string" ? geometry.type : "text-box";
    docEditorCanvas.appendChild(createGeneratedLayoutItemNode(type, geometry));
  });
  prepareGeneratedLayoutCanvas(docEditorCanvas);
  const experimentState = generatedExperimentStateForCanvas(docEditorCanvas);
  if (experimentState) {
    experimentState.recording = false;
    experimentState.playing = false;
    experimentState.actions = [];
    experimentState.experiment = cloneGeneratedExperiment(scene.experiment);
    experimentState.status = docEditorRecordingStatus;
    experimentState.replayGateSettingsChanged = false;
    experimentState.playbackResultVisible = false;
  }
  if (sceneHasRecordedExperiment(scene)) {
    resetGeneratedCanvasToRecordedSceneStart(
      docEditorCanvas,
      scene.experiment,
    );
  }
  layoutGeneratedSingleGateDials(docEditorCanvas);
  documentEditorState.rendering = false;
  updateDocEditorButtons();
  return true;
}

function refreshDocumentEditorTabSelect(preferredTabId = "") {
  if (!(docEditorTabSelect instanceof HTMLSelectElement)) {
    return;
  }
  const targets = collectPlaygroundSaveTargets();
  const prior =
    preferredTabId || docEditorTabSelect.value || documentEditorState.tabId;
  docEditorTabSelect.replaceChildren();
  const placeholder = document.createElement("option");
  placeholder.value = "";
  placeholder.textContent =
    targets.length > 0 ? "Choose tab..." : "No saved tabs yet";
  docEditorTabSelect.appendChild(placeholder);
  targets.forEach((target) => {
    const option = document.createElement("option");
    option.value = target.id;
    option.textContent = target.label;
    docEditorTabSelect.appendChild(option);
  });
  const valid = targets.some((target) => target.id === prior);
  docEditorTabSelect.value = valid ? prior : "";
}

function openDocumentEditorForTab(tabId) {
  const target = collectPlaygroundSaveTargets().find(
    (entry) => entry.id === tabId,
  );
  if (!target) {
    documentEditorState.tabId = "";
    documentEditorState.document = null;
    documentEditorState.sceneIndex = 0;
    docEditorCanvas?.replaceChildren();
    updateDocEditorButtons();
    return false;
  }
  saveCurrentDocumentEditorScene();
  const landingEntry = generatedLandingPageEntryForTabId(tabId);
  const existing = landingEntry ? null : documentForTabId(tabId);
  const documentEntry = normalizeDocument(
    landingEntry
      ? createLandingDocumentFromEntry(landingEntry)
      : existing || {
          tabId,
          title: "What's this?",
          scenes: [createDocumentScene()],
        },
  );
  documentEditorState.tabId = tabId;
  documentEditorState.document = cloneJson(documentEntry) || documentEntry;
  documentEditorState.sceneIndex = 0;
  refreshDocumentEditorTabSelect(tabId);
  if (!landingEntry) {
    persistDocumentEditorDocument();
  }
  renderDocumentEditorScene();
  return true;
}

function moveDocumentEditorScene(delta) {
  if (!documentEditorState.document) {
    return false;
  }
  saveCurrentDocumentEditorScene();
  const scenes = documentEditorState.document.scenes || [];
  const nextIndex = clamp(
    documentEditorState.sceneIndex + delta,
    0,
    Math.max(0, scenes.length - 1),
  );
  if (nextIndex === documentEditorState.sceneIndex) {
    return false;
  }
  documentEditorState.sceneIndex = nextIndex;
  renderDocumentEditorScene();
  return true;
}

function addDocumentEditorScene() {
  if (!documentEditorState.document) {
    return false;
  }
  saveCurrentDocumentEditorScene();
  const scenes = Array.isArray(documentEditorState.document.scenes)
    ? documentEditorState.document.scenes
    : [];
  if (scenes !== documentEditorState.document.scenes) {
    documentEditorState.document.scenes = scenes;
  }
  const insertIndex = clamp(
    documentEditorState.sceneIndex + 1,
    0,
    scenes.length,
  );
  scenes.splice(insertIndex, 0, createDocumentScene());
  documentEditorState.sceneIndex = insertIndex;
  persistDocumentEditorDocument();
  renderDocumentEditorScene();
  return true;
}

function deleteDocumentEditorScene() {
  if (
    !documentEditorState.document ||
    documentEditorState.document.scenes.length <= 1
  ) {
    return false;
  }
  const confirmed = window.confirm("Delete this scene?");
  if (!confirmed) {
    return false;
  }
  documentEditorState.document.scenes.splice(documentEditorState.sceneIndex, 1);
  documentEditorState.sceneIndex = clamp(
    documentEditorState.sceneIndex,
    0,
    documentEditorState.document.scenes.length - 1,
  );
  persistDocumentEditorDocument();
  renderDocumentEditorScene();
  return true;
}

function deleteCurrentDocumentEditorDocument() {
  if (!documentEditorState.tabId) {
    return false;
  }
  const target = activeDocumentEditorTarget();
  const confirmed = window.confirm(
    `Delete the document for "${target?.label || documentEditorState.tabId}"?`,
  );
  if (!confirmed) {
    return false;
  }
  deleteDocumentForTabId(documentEditorState.tabId);
  documentEditorState.tabId = "";
  documentEditorState.document = null;
  documentEditorState.sceneIndex = 0;
  docEditorCanvas?.replaceChildren();
  refreshDocumentEditorTabSelect("");
  applyGeneratedTabsState(generatedTabsState);
  updateDocEditorButtons();
  return true;
}

function documentEditorDone() {
  saveCurrentDocumentEditorScene({ persist: false });
  if (documentEditorState.document) {
    documentEditorState.document.updatedAt = Date.now();
    persistDocumentEditorDocument();
  }
  const targetId = documentEditorState.tabId || "plaground";
  refreshGeneratedDocumentToolbarForTabId(targetId);
  setActiveTab(targetId);
}

function finishDocumentEditorRecording() {
  if (!(docEditorCanvas instanceof HTMLElement)) {
    return false;
  }
  const scene = activeDocumentEditorScene();
  if (!scene) {
    return false;
  }
  const state = generatedExperimentStateForCanvas(docEditorCanvas);
  if (state?.playing || state?.controlActionReplayRunning) {
    updateDocEditorButtons();
    return false;
  }
  finishGeneratedExperimentRecording(docEditorCanvas);
  if (!state?.experiment) {
    updateDocEditorButtons();
    return false;
  }
  scene.experiment = cloneGeneratedExperiment(state.experiment);
  documentEditorState.document.updatedAt = Date.now();
  persistDocumentEditorDocument();
  if (isDocumentEditorTabActive()) {
    setLayoutEditEnabled(true);
  }
  refreshGeneratedMeasurementFillsForCanvas(docEditorCanvas);
  updateDocEditorButtons();
  return true;
}

function handleDocumentExperimentAutoFinished(canvas) {
  if (canvas !== docEditorCanvas || !documentEditorState.document) {
    return;
  }
  finishDocumentEditorRecording();
}

async function playDocumentEditorRecording() {
  if (!(docEditorCanvas instanceof HTMLElement)) {
    return false;
  }
  const scene = activeDocumentEditorScene();
  if (!sceneHasRecordedExperiment(scene)) {
    return false;
  }
  saveCurrentDocumentEditorScene();
  const state = generatedExperimentStateForCanvas(docEditorCanvas);
  state.experiment = cloneGeneratedExperiment(scene.experiment);
  setLayoutEditEnabled(false);
  updateDocEditorButtons();
  let completed = false;
  try {
    clearGeneratedMeasurementsForCanvas(docEditorCanvas);
    completed = await runGeneratedRecordedExperiment(docEditorCanvas, 1);
    return completed;
  } finally {
    if (isDocumentEditorTabActive()) {
      setLayoutEditEnabled(true);
    }
    if (completed) {
      setGeneratedExperimentPlaybackResultVisible(docEditorCanvas, true);
    }
    layoutGeneratedSingleGateDials(docEditorCanvas);
    updateDocEditorButtons();
  }
}

function setupDocumentEditor() {
  if (!(docEditorCanvas instanceof HTMLElement)) {
    return null;
  }
  if (docEditorComponentSelect instanceof HTMLSelectElement) {
    populateComponentPicker(docEditorComponentSelect);
  }
  refreshDocumentEditorTabSelect();
  docEditorCanvas.addEventListener(
    "mousedown",
    beginGeneratedGateDialGestureFromEvent,
  );
  docEditorCanvas.addEventListener("mousedown", beginGeneratedLayoutEditGesture);
  docEditorCanvas.addEventListener(
    "touchstart",
    beginGeneratedGateDialGestureFromEvent,
    { passive: false },
  );
  docEditorCanvas.addEventListener("touchstart", beginGeneratedLayoutEditGesture, {
    passive: false,
  });
  docEditorCanvas.addEventListener("click", (event) => {
    if (!layoutEditorState.enabled || event.target !== docEditorCanvas) {
      return;
    }
    const selectedType =
      docEditorComponentSelect instanceof HTMLSelectElement
        ? docEditorComponentSelect.value
        : "";
    if (!selectedType) {
      clearSelectedGeneratedLayoutItem();
      updateDocEditorButtons();
      return;
    }
    const item = addGeneratedComponentAtPoint(
      docEditorCanvas,
      selectedType,
      event.clientX,
      event.clientY,
    );
    if (item && docEditorComponentSelect instanceof HTMLSelectElement) {
      docEditorComponentSelect.value = "";
    }
    markDocumentEditorCanvasEdited(docEditorCanvas);
    saveCurrentDocumentEditorScene();
    updateDocEditorButtons();
  });
  docEditorCanvas.addEventListener("input", () => {
    markDocumentEditorCanvasEdited(docEditorCanvas);
    saveCurrentDocumentEditorScene();
  });
  docEditorCanvas.addEventListener("change", () => {
    markDocumentEditorCanvasEdited(docEditorCanvas);
    saveCurrentDocumentEditorScene();
  });
  if (typeof ResizeObserver === "function") {
    documentEditorState.resizeObserver = new ResizeObserver(() => {
      syncDocumentCanvasSizeFromDom();
    });
    documentEditorState.resizeObserver.observe(docEditorCanvas);
  }
  if (docEditorTabSelect instanceof HTMLSelectElement) {
    docEditorTabSelect.addEventListener("change", () => {
      openDocumentEditorForTab(docEditorTabSelect.value);
    });
  }
  docEditorSceneBackButton?.addEventListener("click", () => {
    moveDocumentEditorScene(-1);
  });
  docEditorSceneNextButton?.addEventListener("click", () => {
    moveDocumentEditorScene(1);
  });
  docEditorNewSceneButton?.addEventListener("click", () => {
    addDocumentEditorScene();
  });
  docEditorDeleteSceneButton?.addEventListener("click", () => {
    deleteDocumentEditorScene();
  });
  docEditorDoneButton?.addEventListener("click", () => {
    documentEditorDone();
  });
  docEditorDeleteButton?.addEventListener("click", () => {
    deleteCurrentDocumentEditorDocument();
  });
  docEditorDuplicateButton?.addEventListener("click", () => {
    if (duplicateSelectedGeneratedLayoutItem()) {
      saveCurrentDocumentEditorScene();
      updateDocEditorButtons();
    }
  });
  docEditorDeleteComponentButton?.addEventListener("click", () => {
    if (removeSelectedGeneratedLayoutItem()) {
      saveCurrentDocumentEditorScene();
      updateDocEditorButtons();
    }
  });
  docEditorCanvasWidth?.addEventListener("change", () => {
    setDocumentCanvasSize(docEditorCanvasWidth.value, docEditorCanvasHeight?.value, {
      fromUser: true,
    });
  });
  docEditorCanvasHeight?.addEventListener("change", () => {
    setDocumentCanvasSize(docEditorCanvasWidth?.value, docEditorCanvasHeight.value, {
      fromUser: true,
    });
  });
  docEditorStartRecordingButton?.addEventListener("click", () => {
    if (!currentDocumentEditorCanvasHasNonTextComponent()) {
      updateDocEditorButtons();
      return;
    }
    saveCurrentDocumentEditorScene();
    const scene = activeDocumentEditorScene();
    if (scene) {
      scene.experiment = null;
    }
    beginGeneratedExperimentRecording(docEditorCanvas);
    setDocumentEditorMessage("Recording", { sticky: true });
    updateDocEditorButtons();
  });
  docEditorStopRecordingButton?.addEventListener("click", () => {
    finishDocumentEditorRecording();
  });
  docEditorPlayRecordingButton?.addEventListener("click", () => {
    playDocumentEditorRecording().catch(() => {
      setDocumentEditorMessage("Playback failed", { warning: true });
      if (isDocumentEditorTabActive()) {
        setLayoutEditEnabled(true);
      }
      updateDocEditorButtons();
    });
  });
  return {
    handleGeneratedTabsChanged: () => {
      refreshDocumentEditorTabSelect(documentEditorState.tabId);
      updateDocEditorButtons();
    },
    handleLayoutEditChanged: () => {
      updateDocEditorButtons();
    },
    handleResize: () => {
      layoutGeneratedSingleGateDials(docEditorCanvas);
    },
  };
}

function resetDocumentRuntimeState() {
  documentRuntimeState = {
    tabId: "",
    document: null,
    sceneIndex: 0,
    returnTabId: "",
    playing: false,
    canvas: null,
  };
}

function activeDocumentRuntimeCanvas() {
  const canvas = documentRuntimeState.canvas;
  if (canvas instanceof HTMLElement && canvas.isConnected) {
    return canvas;
  }
  return docRuntimeCanvas instanceof HTMLElement ? docRuntimeCanvas : null;
}

function renderDocumentRuntimeScene() {
  const runtimeCanvas = activeDocumentRuntimeCanvas();
  if (
    !(runtimeCanvas instanceof HTMLElement) ||
    !documentRuntimeState.document
  ) {
    return false;
  }
  const scene =
    documentRuntimeState.document.scenes[documentRuntimeState.sceneIndex] ||
    documentRuntimeState.document.scenes[0];
  if (!scene) {
    return false;
  }
  const inlineRuntime = runtimeCanvas !== docRuntimeCanvas;
  runtimeCanvas.replaceChildren();
  runtimeCanvas.classList.add("doc-runtime-canvas");
  runtimeCanvas.dataset.docRuntimeCanvas = "true";
  runtimeCanvas.dataset.docRuntimeTabId = documentRuntimeState.tabId;
  runtimeCanvas.dataset.generatedTabId = inlineRuntime
    ? documentRuntimeState.tabId
    : `doc-runtime-${documentRuntimeState.tabId}-${scene.id}`;
  runtimeCanvas.setAttribute(
    "aria-label",
    `${documentRuntimeState.document.title || "What's this?"} scene`,
  );
  runtimeCanvas.style.width = `${clampDocumentCanvasWidth(scene.canvasWidth)}px`;
  runtimeCanvas.style.height = `${clampDocumentCanvasHeight(scene.canvasHeight)}px`;
  normalizeSavedGroupLayoutItems(scene.items).forEach((geometry) => {
    const type = typeof geometry?.type === "string" ? geometry.type : "text-box";
    runtimeCanvas.appendChild(createGeneratedLayoutItemNode(type, geometry));
  });
  prepareGeneratedLayoutCanvas(runtimeCanvas);
  const state = generatedExperimentStateForCanvas(runtimeCanvas);
  if (state) {
    state.recording = false;
    state.playing = false;
    state.experiment = cloneGeneratedExperiment(scene.experiment);
    state.replayGateSettingsChanged = false;
    state.playbackResultVisible = false;
  }
  if (sceneHasRecordedExperiment(scene)) {
    resetGeneratedCanvasToRecordedSceneStart(runtimeCanvas, scene.experiment);
  }
  if (docRuntimeTitle instanceof HTMLElement) {
    const target = collectPlaygroundSaveTargets().find(
      (entry) => entry.id === documentRuntimeState.tabId,
    );
    docRuntimeTitle.textContent = target?.label || "What's this?";
  }
  if (docRuntimeSceneLabel instanceof HTMLElement) {
    docRuntimeSceneLabel.textContent = `Scene ${
      documentRuntimeState.sceneIndex + 1
    } of ${documentRuntimeState.document.scenes.length}`;
  }
  layoutGeneratedSingleGateDials(runtimeCanvas);
  return true;
}

function openDocumentRuntime(tabId, options = {}) {
  const documentEntry = documentForTabId(tabId);
  const inline = Boolean(options.inline);
  const runtimeCanvas =
    options.canvas instanceof HTMLElement ? options.canvas : docRuntimeCanvas;
  if (
    !documentEntry ||
    !(runtimeCanvas instanceof HTMLElement) ||
    (!inline && !(docRuntimeOverlay instanceof HTMLElement))
  ) {
    return false;
  }
  const activeButton = document.querySelector(".tab-btn.active");
  if (inline) {
    clearGeneratedTransientStateForCanvas(runtimeCanvas);
  }
  documentRuntimeState = {
    tabId,
    document: cloneJson(documentEntry) || documentEntry,
    sceneIndex: 0,
    returnTabId: activeButton?.dataset?.tabTarget || tabId,
    playing: false,
    canvas: runtimeCanvas,
  };
  if (!inline) {
    docRuntimeOverlay.hidden = false;
  }
  renderDocumentRuntimeScene();
  if (inline) {
    applyInlineDocumentRuntimeToolbar(tabId, runtimeCanvas);
  }
  return true;
}

function closeDocumentRuntime() {
  const runtimeCanvas = activeDocumentRuntimeCanvas();
  const inlineCanvas =
    runtimeCanvas instanceof HTMLElement && runtimeCanvas !== docRuntimeCanvas
      ? runtimeCanvas
      : null;
  if (docRuntimeOverlay instanceof HTMLElement) {
    docRuntimeOverlay.hidden = true;
  }
  if (!inlineCanvas && docRuntimeCanvas instanceof HTMLElement) {
    docRuntimeCanvas.replaceChildren();
    delete docRuntimeCanvas.dataset.docRuntimeTabId;
  }
  resetDocumentRuntimeState();
  if (inlineCanvas) {
    resetGeneratedTabForCanvas(inlineCanvas);
  }
  pruneGeneratedRuntimeState();
}

function moveDocumentRuntimeScene(delta) {
  if (!documentRuntimeState.document || documentRuntimeState.playing) {
    return false;
  }
  const nextIndex = clamp(
    documentRuntimeState.sceneIndex + delta,
    0,
    documentRuntimeState.document.scenes.length - 1,
  );
  if (nextIndex === documentRuntimeState.sceneIndex) {
    return false;
  }
  documentRuntimeState.sceneIndex = nextIndex;
  renderDocumentRuntimeScene();
  return true;
}

async function playDocumentRuntimeSceneExperiment() {
  const runtimeCanvas = activeDocumentRuntimeCanvas();
  if (
    !(runtimeCanvas instanceof HTMLElement) ||
    !documentRuntimeState.document ||
    documentRuntimeState.playing
  ) {
    return false;
  }
  const scene =
    documentRuntimeState.document.scenes[documentRuntimeState.sceneIndex];
  if (!sceneHasRecordedExperiment(scene)) {
    return false;
  }
  documentRuntimeState.playing = true;
  const state = generatedExperimentStateForCanvas(runtimeCanvas);
  state.experiment = cloneGeneratedExperiment(scene.experiment);
  let completed = false;
  try {
    clearGeneratedMeasurementsForCanvas(runtimeCanvas);
    completed = await runGeneratedRecordedExperiment(runtimeCanvas, 1);
    return completed;
  } finally {
    documentRuntimeState.playing = false;
    if (completed) {
      setGeneratedExperimentPlaybackResultVisible(runtimeCanvas, true);
    }
    layoutGeneratedSingleGateDials(runtimeCanvas);
  }
}

function handleDocumentTextBoxAction(canvas, action) {
  if (!(canvas instanceof HTMLElement)) {
    return;
  }
  if (canvas.dataset.docEditorCanvas === "true") {
    saveCurrentDocumentEditorScene();
    updateDocEditorButtons();
    if (action === "show") {
      playDocumentEditorRecording().catch(() => {});
    }
    return;
  }
  if (canvas.dataset.docRuntimeCanvas !== "true") {
    return;
  }
  if (action === "done") {
    closeDocumentRuntime();
    return;
  }
  if (action === "back") {
    moveDocumentRuntimeScene(-1);
    return;
  }
  if (action === "next") {
    moveDocumentRuntimeScene(1);
    return;
  }
  if (action === "show") {
    playDocumentRuntimeSceneExperiment().catch(() => {});
  }
}

function generatedLayoutPointer(event) {
  return getPointer(event);
}

function generatedLayoutCanvasForEvent(event) {
  const origin = event.target;
  if (!(origin instanceof Element)) {
    return null;
  }
  const canvas = origin.closest(".generated-layout-canvas");
  return canvas instanceof HTMLElement ? canvas : null;
}

function generatedLayoutClampItemPosition(canvas, item, left, top) {
  const maxLeft = Math.max(0, canvas.clientWidth - item.offsetWidth);
  const maxTop = Math.max(0, canvas.clientHeight - item.offsetHeight);
  return {
    left: clamp(left, 0, maxLeft),
    top: clamp(top, 0, maxTop),
  };
}

function generatedLayoutClampItemSize(canvas, item, width, height) {
  const left = parseLayoutNumeric(item.style.left, 0);
  const top = parseLayoutNumeric(item.style.top, 0);
  const minSize = minGeneratedLayoutSizeForType(item.dataset.component);
  return {
    width: clamp(
      width,
      minSize.minWidth,
      Math.max(minSize.minWidth, canvas.clientWidth - left),
    ),
    height: clamp(
      height,
      minSize.minHeight,
      Math.max(minSize.minHeight, canvas.clientHeight - top),
    ),
  };
}

function bringGeneratedItemToFront(item) {
  const canvas = generatedCanvasForItem(item);
  if (!canvas) {
    return;
  }
  const maxZ = Array.from(
    canvas.querySelectorAll(":scope > .playground-node"),
  ).reduce(
    (highest, candidate) =>
      Math.max(highest, parseLayoutNumeric(candidate.style.zIndex, 1)),
    1,
  );
  item.style.zIndex = `${Math.round(maxZ + 1)}`;
}

function findBestGeneratedGateRuntimeForQubit(canvas, qubitItem) {
  pruneGeneratedRuntimeState();
  let bestRuntime = null;
  let bestOverlap = 0.45;
  canvas
    .querySelectorAll('.playground-node[data-component="single-gate"]')
    .forEach((gateItem) => {
      if (!(gateItem instanceof HTMLElement)) {
        return;
      }
      const runtime = initializeGeneratedSingleGateItem(gateItem, {
        singleGateTick: generatedSingleGateRuntimes.get(gateItem)?.activeTick,
      });
      if (!runtime || runtime.busy) {
        return;
      }
      const overlap = generatedQubitOverlapRatioWithRect(
        qubitItem,
        runtime.gateFunnel,
      );
      if (overlap >= bestOverlap) {
        bestOverlap = overlap;
        bestRuntime = runtime;
      }
    });
  return bestRuntime;
}

async function runGeneratedSingleGateTransit(canvas, qubitItem, gateRuntime) {
  if (
    !isGeneratedQubitItem(qubitItem) ||
    !gateRuntime ||
    !generatedCanvasAllowsRuntime(canvas)
  ) {
    return false;
  }
  const qubitState = ensureGeneratedQubitRuntimeState(qubitItem);
  if (!qubitState || qubitState.transiting || gateRuntime.busy) {
    return false;
  }

  qubitState.transiting = true;
  gateRuntime.busy = true;
  qubitItem.classList.add("generated-transit-active");
  gateRuntime.item.classList.add("gate-busy");
  gateRuntime.item.classList.remove("platform-extended");
  if (generatedRuntimeDrag?.item === qubitItem) {
    commitGeneratedDragRecord(generatedRuntimeDrag);
    qubitItem.classList.remove("dragging");
    generatedRuntimeDrag = null;
  }

  try {
    await nextAnimationFrame();
    if (!generatedCanvasAllowsRuntime(canvas)) {
      return false;
    }

    alignGeneratedGateSpring(gateRuntime);
    const gateCenter = generatedCanvasPointForElementCenter(
      canvas,
      gateRuntime.ticksWrap,
    );
    await moveGeneratedQubitToPoint(
      canvas,
      qubitItem,
      gateCenter.x,
      gateCenter.y,
      AUTO_TRAVEL_MS,
    );
    if (!generatedCanvasAllowsRuntime(canvas)) {
      return false;
    }

    await waitForDuration(GATE_TUBE_DWELL_MS);
    if (!generatedCanvasAllowsRuntime(canvas)) {
      return false;
    }

    const tickIndex = normalizeTickIndex(gateRuntime.activeTick);
    recordGeneratedExperimentAction(canvas, {
      type: "gate",
      qubitId: ensureGeneratedItemId(qubitItem, "qubit"),
      qubitLogicalId: qubitLogicalIdForItem(qubitItem),
      roomQubitIndex: roomQubitIndexForItem(qubitItem),
      gateId: ensureGeneratedItemId(gateRuntime.item, "single-gate"),
      tickIndex,
    });
    applyGeneratedSingleGateToQubitState(qubitItem, tickIndex);
    if (!qubitState.pairState) {
      qubitState.cnotSourceSlot = null;
      qubitState.cnotPairToken = null;
      qubitState.cnotOutcomeProbabilities = null;
    }
    qubitState.doubleMeasurementReturnPoint = null;

    settleGeneratedQubitVisualState(qubitItem);
    const platformCenter = generatedCanvasPointForElementCenter(
      canvas,
      gateRuntime.gatePlatform,
    );
    const retractedPlatformPoint = {
      x: platformCenter.x,
      y: gateCenter.y,
    };
    setGeneratedQubitCenter(
      canvas,
      qubitItem,
      retractedPlatformPoint.x,
      retractedPlatformPoint.y,
    );
    await nextAnimationFrame();
    if (!generatedCanvasAllowsRuntime(canvas)) {
      return false;
    }

    gateRuntime.item.classList.add("platform-extended");
    const ejectedCenter = {
      x:
        generatedCanvasXForElementRight(canvas, gateRuntime.gateWindow) +
        100 +
        qubitItem.offsetWidth / 2,
      y: retractedPlatformPoint.y,
    };
    await moveGeneratedQubitToPoint(
      canvas,
      qubitItem,
      ejectedCenter.x,
      ejectedCenter.y,
      GATE_PLATFORM_EXTEND_MS,
    );
    settleGeneratedQubitVisualState(qubitItem);
    gateRuntime.item.classList.remove("platform-extended");
    await waitForDuration(GATE_PLATFORM_RETRACT_MS);
    return true;
  } finally {
    settleGeneratedQubitVisualState(qubitItem);
    qubitItem.classList.remove("generated-transit-active");
    gateRuntime.item.classList.remove("gate-busy");
    gateRuntime.item.classList.remove("platform-extended");
    qubitState.transiting = false;
    gateRuntime.busy = false;
  }
}

function maybeSnapGeneratedQubitToSingleGate(qubitItem) {
  if (!isGeneratedQubitItem(qubitItem)) {
    return false;
  }
  const canvas = generatedCanvasForItem(qubitItem);
  if (!generatedCanvasAllowsRuntime(canvas)) {
    return false;
  }
  const qubitState = ensureGeneratedQubitRuntimeState(qubitItem);
  if (!canvas || !qubitState || qubitState.transiting) {
    return false;
  }
  const gateRuntime = findBestGeneratedGateRuntimeForQubit(canvas, qubitItem);
  if (!gateRuntime) {
    return false;
  }
  runGeneratedSingleGateTransit(canvas, qubitItem, gateRuntime).catch(() => {});
  return true;
}

function releaseGeneratedQubitFromCnotSlots(qubitItem) {
  if (!isGeneratedQubitItem(qubitItem)) {
    return;
  }
  pruneGeneratedRuntimeState();
  Array.from(generatedCnotRuntimes.values()).forEach((runtime) => {
    if (runtime.slotOccupants.top === qubitItem) {
      runtime.slotOccupants.top = null;
      qubitItem.classList.remove("generated-transit-active");
    }
    if (runtime.slotOccupants.bottom === qubitItem) {
      runtime.slotOccupants.bottom = null;
      qubitItem.classList.remove("generated-transit-active");
    }
  });
}

function findBestGeneratedCnotRuntimeForQubit(canvas, qubitItem) {
  pruneGeneratedRuntimeState();
  let best = null;
  let bestOverlap = CNOT_FUNNEL_OVERLAP_THRESHOLD;
  canvas
    .querySelectorAll('.playground-node[data-component="cnot-gate"]')
    .forEach((cnotItem) => {
      if (!(cnotItem instanceof HTMLElement)) {
        return;
      }
      const runtime = initializeGeneratedCnotItem(cnotItem);
      if (!runtime || runtime.busy) {
        return;
      }
      [
        {
          slot: "top",
          funnel: runtime.funnelTop,
          occupant: runtime.slotOccupants.top,
        },
        {
          slot: "bottom",
          funnel: runtime.funnelBottom,
          occupant: runtime.slotOccupants.bottom,
        },
      ].forEach(({ slot, funnel, occupant }) => {
        if (occupant && occupant !== qubitItem) {
          return;
        }
        const overlap = generatedQubitOverlapRatioWithRect(qubitItem, funnel);
        if (overlap > bestOverlap) {
          bestOverlap = overlap;
          best = { runtime, slot };
        }
      });
    });
  return best;
}

function applyGeneratedCnotToQubitStates(topQubitItem, bottomQubitItem) {
  const topState = ensureGeneratedQubitRuntimeState(topQubitItem);
  const bottomState = ensureGeneratedQubitRuntimeState(bottomQubitItem);
  if (!topState || !bottomState) {
    return;
  }

  if (runtimeStatesSharePairState(topState, bottomState)) {
    applyCNOTToRegisterState(
      topState.pairState,
      topState.pairQubitIndex,
      bottomState.pairQubitIndex,
    );
    syncGeneratedPairStateVisuals(topState.pairState);
    mailboxRoomQueueSharedEntanglementUpdate(topState.pairState)?.catch(() => {});
    return;
  }

  const registerState = mergeGeneratedRegistersForCnot(
    topQubitItem,
    bottomQubitItem,
  );
  if (registerState?.remoteEntanglementId) {
    mailboxRoomQueueSharedEntanglementUpdate(registerState)?.catch(() => {});
  }
}

async function runGeneratedCnotCycle(canvas, runtime) {
  if (runtime.cyclePromise) {
    return runtime.cyclePromise;
  }
  if (
    runtime.busy ||
    !(runtime.slotOccupants.top instanceof HTMLElement) ||
    !(runtime.slotOccupants.bottom instanceof HTMLElement)
  ) {
    return null;
  }

  const topQubit = runtime.slotOccupants.top;
  const bottomQubit = runtime.slotOccupants.bottom;
  const topState = ensureGeneratedQubitRuntimeState(topQubit);
  const bottomState = ensureGeneratedQubitRuntimeState(bottomQubit);
  if (!topState || !bottomState) {
    return null;
  }

  runtime.busy = true;
  topState.transiting = true;
  bottomState.transiting = true;
  topQubit.classList.add("generated-transit-active");
  bottomQubit.classList.add("generated-transit-active");
  runtime.item.classList.add("gate-busy");
  runtime.body.classList.remove("platform-extended");
  runtime.cyclePromise = (async () => {
    try {
      await waitForDuration(CNOT_WINDOW_DWELL_MS);
      if (
        !generatedCanvasAllowsRuntime(canvas) ||
        !topQubit.isConnected ||
        !bottomQubit.isConnected ||
        runtime.slotOccupants.top !== topQubit ||
        runtime.slotOccupants.bottom !== bottomQubit
      ) {
        return false;
      }

      const pairToken = `${Date.now()}-${Math.random()}`;
      recordGeneratedExperimentAction(canvas, {
        type: "cnot",
        cnotId: ensureGeneratedItemId(runtime.item, "cnot-gate"),
        topQubitId: ensureGeneratedItemId(topQubit, "qubit"),
        bottomQubitId: ensureGeneratedItemId(bottomQubit, "qubit"),
        topQubitLogicalId: ensureQubitLogicalId(topQubit),
        bottomQubitLogicalId: ensureQubitLogicalId(bottomQubit),
        topRoomQubitIndex: roomQubitIndexForItem(topQubit),
        bottomRoomQubitIndex: roomQubitIndexForItem(bottomQubit),
      });
      applyGeneratedCnotToQubitStates(topQubit, bottomQubit);
      topState.cnotSourceSlot = "top";
      bottomState.cnotSourceSlot = "bottom";
      topState.cnotPairToken = pairToken;
      bottomState.cnotPairToken = pairToken;
      const cnotOutcomeProbabilities = pairOutcomeProbabilitiesForRegisterMembers(
        topState.pairState,
        topState.pairQubitIndex,
        bottomState.pairQubitIndex,
      );
      topState.cnotOutcomeProbabilities = cnotOutcomeProbabilities;
      bottomState.cnotOutcomeProbabilities = cnotOutcomeProbabilities;

      const topWindowCenter = generatedCanvasPointForElementCenter(
        canvas,
        runtime.windowTop,
      );
      const bottomWindowCenter = generatedCanvasPointForElementCenter(
        canvas,
        runtime.windowBottom,
      );
      setGeneratedQubitCenter(
        canvas,
        topQubit,
        topWindowCenter.x,
        topWindowCenter.y,
      );
      setGeneratedQubitCenter(
        canvas,
        bottomQubit,
        bottomWindowCenter.x,
        bottomWindowCenter.y,
      );
      await nextAnimationFrame();

      const topQubitRect = topQubit.getBoundingClientRect();
      const bottomQubitRect = bottomQubit.getBoundingClientRect();
      const topFlangeRight = generatedCanvasXForElementRight(
        canvas,
        runtime.flangeTop,
      );
      const bottomFlangeRight = generatedCanvasXForElementRight(
        canvas,
        runtime.flangeBottom,
      );
      const topReadyCenter = {
        x: topFlangeRight + topQubitRect.width / 2,
        y: topWindowCenter.y,
      };
      const bottomReadyCenter = {
        x: bottomFlangeRight + bottomQubitRect.width / 2,
        y: bottomWindowCenter.y,
      };
      await Promise.all([
        moveGeneratedQubitToPoint(
          canvas,
          topQubit,
          topReadyCenter.x,
          topReadyCenter.y,
          AUTO_TRAVEL_MS,
        ),
        moveGeneratedQubitToPoint(
          canvas,
          bottomQubit,
          bottomReadyCenter.x,
          bottomReadyCenter.y,
          AUTO_TRAVEL_MS,
        ),
      ]);

      runtime.body.classList.add("platform-extended");
      const topSpringLeft = generatedCanvasXForElementLeft(
        canvas,
        runtime.springTop,
      );
      const bottomSpringLeft = generatedCanvasXForElementLeft(
        canvas,
        runtime.springBottom,
      );
      const topEjectedCenter = {
        x:
          topSpringLeft +
          cnotSpringExpandedLength(runtime.springTop) +
          topQubitRect.width / 2,
        y: topWindowCenter.y,
      };
      const bottomEjectedCenter = {
        x:
          bottomSpringLeft +
          cnotSpringExpandedLength(runtime.springBottom) +
          bottomQubitRect.width / 2,
        y: bottomWindowCenter.y,
      };
      await Promise.all([
        moveGeneratedQubitToPoint(
          canvas,
          topQubit,
          topEjectedCenter.x,
          topEjectedCenter.y,
          GATE_PLATFORM_EXTEND_MS,
        ),
        moveGeneratedQubitToPoint(
          canvas,
          bottomQubit,
          bottomEjectedCenter.x,
          bottomEjectedCenter.y,
          GATE_PLATFORM_EXTEND_MS,
        ),
      ]);
      settleGeneratedQubitVisualState(topQubit);
      settleGeneratedQubitVisualState(bottomQubit);
      runtime.body.classList.remove("platform-extended");
      await waitForDuration(GATE_PLATFORM_RETRACT_MS);
      return true;
    } finally {
      runtime.slotOccupants.top = null;
      runtime.slotOccupants.bottom = null;
      runtime.body.classList.remove("platform-extended");
      runtime.item.classList.remove("gate-busy");
      topQubit.classList.remove("generated-transit-active");
      bottomQubit.classList.remove("generated-transit-active");
      runtime.busy = false;
      topState.transiting = false;
      bottomState.transiting = false;
      runtime.cyclePromise = null;
    }
  })();
  return runtime.cyclePromise;
}

async function runGeneratedCnotIngress(canvas, qubitItem, runtime, slot) {
  if (
    !isGeneratedQubitItem(qubitItem) ||
    !runtime ||
    runtime.busy ||
    (slot !== "top" && slot !== "bottom") ||
    !generatedCanvasAllowsRuntime(canvas)
  ) {
    return false;
  }
  const qubitState = ensureGeneratedQubitRuntimeState(qubitItem);
  if (!qubitState || qubitState.transiting) {
    return false;
  }
  const slotKey = slot === "top" ? "top" : "bottom";
  const otherSlotKey = slotKey === "top" ? "bottom" : "top";
  const existing = runtime.slotOccupants[slotKey];
  if (existing && existing !== qubitItem) {
    return false;
  }
  if (runtime.slotOccupants[otherSlotKey] === qubitItem) {
    runtime.slotOccupants[otherSlotKey] = null;
  }

  qubitState.transiting = true;
  runtime.slotOccupants[slotKey] = qubitItem;
  qubitItem.classList.add("generated-transit-active");
  if (generatedRuntimeDrag?.item === qubitItem) {
    commitGeneratedDragRecord(generatedRuntimeDrag);
    qubitItem.classList.remove("dragging");
    generatedRuntimeDrag = null;
  }
  try {
    const targetWindow =
      slotKey === "top" ? runtime.windowTop : runtime.windowBottom;
    const center = generatedCanvasPointForElementCenter(canvas, targetWindow);
    await moveGeneratedQubitToPoint(
      canvas,
      qubitItem,
      center.x,
      center.y,
      AUTO_TRAVEL_MS,
    );
    settleGeneratedQubitVisualState(qubitItem);
    setGeneratedQubitCenter(canvas, qubitItem, center.x, center.y);
  } finally {
    if (runtime.slotOccupants[slotKey] !== qubitItem) {
      qubitItem.classList.remove("generated-transit-active");
    }
    qubitState.transiting = false;
  }

  if (
    runtime.slotOccupants.top instanceof HTMLElement &&
    runtime.slotOccupants.bottom instanceof HTMLElement
  ) {
    runGeneratedCnotCycle(canvas, runtime).catch(() => {});
  }
  return true;
}

function maybeSnapGeneratedQubitToCnot(qubitItem) {
  if (!isGeneratedQubitItem(qubitItem)) {
    return false;
  }
  const canvas = generatedCanvasForItem(qubitItem);
  if (!generatedCanvasAllowsRuntime(canvas)) {
    return false;
  }
  const qubitState = ensureGeneratedQubitRuntimeState(qubitItem);
  if (!canvas || !qubitState || qubitState.transiting) {
    return false;
  }
  const target = findBestGeneratedCnotRuntimeForQubit(canvas, qubitItem);
  if (!target) {
    return false;
  }
  runGeneratedCnotIngress(canvas, qubitItem, target.runtime, target.slot).catch(
    () => {},
  );
  return true;
}

function generatedLensCircle(runtime) {
  if (!runtime?.measureLens) {
    return null;
  }
  const lensRect = runtime.measureLens.getBoundingClientRect();
  const radius = Math.min(lensRect.width, lensRect.height) / 2;
  if (radius <= 0) {
    return null;
  }
  return {
    x: lensRect.left + lensRect.width / 2,
    y: lensRect.top + lensRect.height / 2,
    radius,
  };
}

function generatedQubitOverlapRatioWithLens(qubitItem, runtime) {
  const lensCircle = generatedLensCircle(runtime);
  if (!lensCircle) {
    return 0;
  }
  const qubitRect = qubitItem.getBoundingClientRect();
  const qRadius = qubitRect.width / 2;
  if (qRadius <= 0) {
    return 0;
  }
  const qCx = qubitRect.left + qRadius;
  const qCy = qubitRect.top + qRadius;
  const distance = Math.hypot(qCx - lensCircle.x, qCy - lensCircle.y);
  const overlapArea = generatedCircleIntersectionArea(
    qRadius,
    lensCircle.radius,
    distance,
  );
  const qubitArea = Math.PI * qRadius * qRadius;
  return qubitArea > 0 ? overlapArea / qubitArea : 0;
}

function findBestGeneratedMeasurementRuntimeForQubit(canvas, qubitItem) {
  pruneGeneratedRuntimeState();
  let bestRuntime = null;
  let bestOverlap = MEASUREMENT_OVERLAP_THRESHOLD;
  canvas
    .querySelectorAll('.playground-node[data-component="single-measurement"]')
    .forEach((item) => {
      if (!(item instanceof HTMLElement)) {
        return;
      }
      const runtime = initializeGeneratedSingleMeasurementItem(item);
      if (!runtime || runtime.busy) {
        return;
      }
      const overlap = Math.max(
        generatedQubitOverlapRatioWithLens(qubitItem, runtime),
        generatedQubitOverlapRatioWithRect(qubitItem, runtime.measurementTool),
      );
      if (overlap >= bestOverlap) {
        bestOverlap = overlap;
        bestRuntime = runtime;
      }
    });
  return bestRuntime;
}

function collapseGeneratedQubitState(qubitItem, options = {}) {
  const qubitState = ensureGeneratedQubitRuntimeState(qubitItem);
  if (!qubitState) {
    return "blue";
  }
  if (qubitState.pairState && Number.isFinite(qubitState.pairQubitIndex)) {
    const color = sampleSingleQubitOutcomeFromPairState(
      qubitState.pairState,
      qubitState.pairQubitIndex,
    );
    collapseGeneratedSingleQubitFromPair(qubitItem, color, options);
    return color;
  }
  const [blueProbability] = probabilitiesFromVector2(qubitState.vector);
  const collapseToBlue =
    blueProbability >= 1 ||
    (blueProbability > 0 && Math.random() < blueProbability);
  qubitState.vector = collapseToBlue ? [1, 0] : [0, 1];
  qubitState.cnotSourceSlot = null;
  qubitState.cnotPairToken = null;
  qubitState.cnotOutcomeProbabilities = null;
  qubitState.doubleMeasurementReturnPoint = null;
  applyGeneratedQubitVectorVisualState(qubitItem);
  return collapseToBlue ? "blue" : "red";
}

function createGeneratedMeasurementPayload(canvas, color, startPoint) {
  const payload = document.createElement("span");
  payload.className = "qubit measurement-pellet measurement-square-pellet";
  payload.setAttribute("aria-hidden", "true");
  payload.style.left = `${startPoint.x}px`;
  payload.style.top = `${startPoint.y}px`;
  payload.style.pointerEvents = "none";
  payload.style.setProperty(
    "--qubit-fill",
    color === "blue" ? blendBlueRed(1, 0) : blendBlueRed(0, 1),
  );
  canvas.appendChild(payload);
  return payload;
}

function moveGeneratedPayloadToPoint(payload, x, y, duration = AUTO_TRAVEL_MS) {
  return new Promise((resolve) => {
    const moveDuration = scaledGeneratedDuration(duration);
    payload.style.setProperty("--move-duration", `${moveDuration}ms`);
    payload.classList.add("migrating");
    payload.getBoundingClientRect();
    payload.style.left = `${x}px`;
    payload.style.top = `${y}px`;
    window.setTimeout(resolve, moveDuration);
  });
}

async function animateGeneratedMeasurementPayloadToTube(
  canvas,
  runtime,
  collapsedColor,
  startPoint,
  { migrationDuration = AUTO_TRAVEL_MS, meltDuration = AUTO_MELT_MS } = {},
) {
  const payload = createGeneratedMeasurementPayload(
    canvas,
    collapsedColor,
    startPoint,
  );
  try {
    const targetTube =
      collapsedColor === "blue" ? runtime.tubeBlue : runtime.tubeRed;
    const targetRect = targetTube.getBoundingClientRect();
    const targetPoint = generatedViewportPointToCanvasPoint(
      canvas,
      targetRect.left + targetRect.width / 2,
      targetRect.top + targetRect.height * 0.22,
    );

    await moveGeneratedPayloadToPoint(
      payload,
      targetPoint.x,
      targetPoint.y,
      migrationDuration,
    );

    payload.style.setProperty(
      "--melt-duration",
      `${scaledGeneratedDuration(meltDuration)}ms`,
    );
    payload.classList.add("melting");
    await waitForDuration(meltDuration);

    if (collapsedColor === "blue") {
      runtime.blueTubeCount += 1;
    } else {
      runtime.redTubeCount += 1;
    }

    maybeExpandGeneratedMeasurementTubeCapacity(runtime);
    updateGeneratedMeasurementTubeFills(runtime);
    return true;
  } finally {
    payload.remove();
  }
}

async function runGeneratedSingleMeasurementTransit(
  canvas,
  qubitItem,
  runtime,
) {
  if (
    !isGeneratedQubitItem(qubitItem) ||
    !runtime ||
    !generatedCanvasAllowsRuntime(canvas)
  ) {
    return false;
  }
  const qubitState = ensureGeneratedQubitRuntimeState(qubitItem);
  if (!qubitState || qubitState.transiting || runtime.busy) {
    return false;
  }

  qubitState.transiting = true;
  runtime.busy = true;
  if (generatedRuntimeDrag?.item === qubitItem) {
    commitGeneratedDragRecord(generatedRuntimeDrag);
    qubitItem.classList.remove("dragging");
    generatedRuntimeDrag = null;
  }

  try {
    const lensCircle = generatedLensCircle(runtime);
    if (!lensCircle) {
      return false;
    }
    const lensCenter = generatedViewportPointToCanvasPoint(
      canvas,
      lensCircle.x,
      lensCircle.y,
    );
    setGeneratedQubitCenter(canvas, qubitItem, lensCenter.x, lensCenter.y);
    settleGeneratedQubitVisualState(qubitItem);

    const core = getGeneratedQubitCore(qubitItem);
    if (core instanceof HTMLElement) {
      core.classList.add("collapse-animating");
    }
    recordGeneratedExperimentAction(canvas, {
      type: "single-measure",
      qubitId: ensureGeneratedItemId(qubitItem, "qubit"),
      qubitLogicalId: qubitLogicalIdForItem(qubitItem),
      measurementId: ensureGeneratedItemId(runtime.item, "single-measurement"),
    });
    const collapsedColor = collapseGeneratedQubitState(qubitItem);
    logGeneratedMeasurementProgress(runtime, {
      event: "single-collapsed",
      qubitId: ensureGeneratedItemId(qubitItem, "qubit"),
      logicalQubitId: qubitLogicalIdForItem(qubitItem),
      color: collapsedColor,
      measuredSoFar: 1,
      requiredCount: 1,
    });
    if (core instanceof HTMLElement) {
      core.classList.remove("collapse-animating");
    }

    await animateGeneratedMeasurementPayloadToTube(
      canvas,
      runtime,
      collapsedColor,
      lensCenter,
    );

    setGeneratedQubitCenter(
      canvas,
      qubitItem,
      lensCenter.x + 100,
      lensCenter.y,
    );
    finishGeneratedExperimentRecordingAfterMeasurement(canvas);
    return true;
  } finally {
    const core = getGeneratedQubitCore(qubitItem);
    if (core instanceof HTMLElement) {
      core.classList.remove("collapse-animating");
    }
    qubitState.transiting = false;
    runtime.busy = false;
  }
}

function maybeSnapGeneratedQubitToSingleMeasurement(qubitItem) {
  if (!isGeneratedQubitItem(qubitItem)) {
    return false;
  }
  const canvas = generatedCanvasForItem(qubitItem);
  if (!generatedCanvasAllowsRuntime(canvas)) {
    return false;
  }
  const qubitState = ensureGeneratedQubitRuntimeState(qubitItem);
  if (!canvas || !qubitState || qubitState.transiting) {
    return false;
  }
  const runtime = findBestGeneratedMeasurementRuntimeForQubit(
    canvas,
    qubitItem,
  );
  if (!runtime) {
    return false;
  }
  runGeneratedSingleMeasurementTransit(canvas, qubitItem, runtime).catch(() => {});
  return true;
}

function generatedMailboxQubitIndex(qubitItem) {
  const canvas = generatedCanvasForItem(qubitItem);
  if (!canvas) {
    return 0;
  }
  const qubits = Array.from(
    canvas.querySelectorAll(':scope > .playground-node[data-component="qubit"]'),
  );
  const index = qubits.indexOf(qubitItem);
  return index >= 0 ? index : 0;
}

function findBestGeneratedMailboxForQubit(canvas, qubitItem) {
  if (!isGeneratedLayoutCanvas(canvas) || !isGeneratedQubitItem(qubitItem)) {
    return null;
  }
  let bestMailbox = null;
  let bestOverlap = MAILBOX_WINDOW_OVERLAP_THRESHOLD;
  canvas
    .querySelectorAll(':scope > .playground-node[data-component="mailbox"]')
    .forEach((mailboxItem) => {
      if (!isGeneratedMailboxItem(mailboxItem)) {
        return;
      }
      const mailboxFunnel = mailboxItem.querySelector(
        '[data-role="mailbox-input-funnel"]',
      );
      if (!(mailboxFunnel instanceof HTMLElement)) {
        return;
      }
      const overlap = generatedQubitOverlapRatioWithRect(
        qubitItem,
        mailboxFunnel,
      );
      if (overlap >= bestOverlap) {
        bestOverlap = overlap;
        bestMailbox = mailboxItem;
      }
    });
  return bestMailbox;
}

function maybeSnapGeneratedQubitToMailbox(qubitItem) {
  if (!isGeneratedQubitItem(qubitItem)) {
    return false;
  }
  const canvas = generatedCanvasForItem(qubitItem);
  if (!generatedCanvasAllowsRuntime(canvas)) {
    return false;
  }
  const qubitState = ensureGeneratedQubitRuntimeState(qubitItem);
  if (!canvas || !qubitState || qubitState.transiting) {
    return false;
  }
  const mailboxItem = findBestGeneratedMailboxForQubit(canvas, qubitItem);
  if (!mailboxItem) {
    return false;
  }
  const mailboxFunnel = mailboxItem.querySelector(
    '[data-role="mailbox-input-funnel"]',
  );
  if (mailboxFunnel instanceof HTMLElement) {
    const center = generatedCanvasPointForElementCenter(canvas, mailboxFunnel);
    setGeneratedQubitCenter(canvas, qubitItem, center.x, center.y);
  }
  // The mailbox owns the qubit from this point onward. Ending the drag here
  // prevents trailing pointer events from overwriting the funnel-to-window
  // animation coordinates.
  if (generatedRuntimeDrag?.item === qubitItem) {
    commitGeneratedDragRecord(generatedRuntimeDrag);
    qubitItem.classList.remove("dragging");
    generatedRuntimeDrag = null;
  }
  setMailboxComponentStatus(mailboxItem, "");
  handleMailboxQubitPlaced({
    mailboxItem,
    qubitItem,
    qubitIndex: generatedMailboxQubitIndex(qubitItem),
  });
  return true;
}

function releaseGeneratedQubitFromDoubleMeasurementSlots(qubitItem) {
  if (!isGeneratedQubitItem(qubitItem)) {
    return;
  }
  pruneGeneratedRuntimeState();
  Array.from(generatedDoubleMeasurementRuntimes.values()).forEach((runtime) => {
    if (runtime.slotOccupants.left === qubitItem) {
      runtime.slotOccupants.left = null;
    }
    if (runtime.slotOccupants.right === qubitItem) {
      runtime.slotOccupants.right = null;
    }
  });
}

function generatedDoubleMeasurementLensCircle(runtime) {
  if (!runtime?.measurementTool) {
    return null;
  }
  const lensRect = runtime.measurementTool.getBoundingClientRect();
  const radius = Math.min(lensRect.width, lensRect.height) / 2;
  if (radius <= 0) {
    return null;
  }
  return {
    x: lensRect.left + lensRect.width / 2,
    y: lensRect.top + lensRect.height / 2,
    radius,
  };
}

function generatedQubitOverlapRatioWithDoubleMeasurementLens(
  qubitItem,
  runtime,
) {
  const lensCircle = generatedDoubleMeasurementLensCircle(runtime);
  if (!lensCircle) {
    return 0;
  }
  const qubitRect = qubitItem.getBoundingClientRect();
  const qRadius = qubitRect.width / 2;
  if (qRadius <= 0) {
    return 0;
  }
  const qCx = qubitRect.left + qRadius;
  const qCy = qubitRect.top + qRadius;
  const distance = Math.hypot(qCx - lensCircle.x, qCy - lensCircle.y);
  const overlapArea = generatedCircleIntersectionArea(
    qRadius,
    lensCircle.radius,
    distance,
  );
  const qubitArea = Math.PI * qRadius * qRadius;
  return qubitArea > 0 ? overlapArea / qubitArea : 0;
}

function findBestGeneratedDoubleMeasurementRuntimeForQubit(canvas, qubitItem) {
  pruneGeneratedRuntimeState();
  let bestRuntime = null;
  let bestOverlap = MEASUREMENT_OVERLAP_THRESHOLD;
  canvas
    .querySelectorAll('.playground-node[data-component="double-measurement"]')
    .forEach((item) => {
      if (!(item instanceof HTMLElement)) {
        return;
      }
      const runtime = initializeGeneratedDoubleMeasurementItem(item);
      if (!runtime || runtime.busy) {
        return;
      }
      const overlap = Math.max(
        generatedQubitOverlapRatioWithDoubleMeasurementLens(qubitItem, runtime),
        generatedQubitOverlapRatioWithRect(qubitItem, runtime.measurementTool),
      );
      if (overlap >= bestOverlap) {
        bestOverlap = overlap;
        bestRuntime = runtime;
      }
    });
  return bestRuntime;
}

function slotForGeneratedDoubleMeasurementIngress(qubitState, runtime) {
  if (qubitState?.cnotSourceSlot === "top") {
    return "right";
  }
  if (qubitState?.cnotSourceSlot === "bottom") {
    return "left";
  }
  if (!runtime.slotOccupants.right) {
    return "right";
  }
  if (!runtime.slotOccupants.left) {
    return "left";
  }
  return null;
}

function generatedDoubleMeasurementSlotCenter(canvas, runtime, slot) {
  const slotElement = slot === "left" ? runtime.slotLeft : runtime.slotRight;
  const slotRect = slotElement.getBoundingClientRect();
  const hasVisibleSlotGeometry =
    slotRect.width > 4 &&
    slotRect.height > 4 &&
    window.getComputedStyle(slotElement).display !== "none";
  if (hasVisibleSlotGeometry) {
    const center = generatedCanvasPointForElementCenter(canvas, slotElement);
    return {
      x: center.x + TWO_QUBIT_MEASUREMENT_SLOT_SHIFT_X,
      y: center.y + TWO_QUBIT_MEASUREMENT_SLOT_SHIFT_Y,
    };
  }
  const lensRect = runtime.measurementTool.getBoundingClientRect();
  const lensCenter = generatedViewportPointToCanvasPoint(
    canvas,
    lensRect.left + lensRect.width / 2,
    lensRect.top + lensRect.height / 2,
  );
  const laneOffset = Math.max(20, lensRect.width * 0.12);
  return {
    x:
      lensCenter.x +
      (slot === "right" ? laneOffset : -laneOffset) +
      TWO_QUBIT_MEASUREMENT_SLOT_SHIFT_X,
    y: lensCenter.y + TWO_QUBIT_MEASUREMENT_SLOT_SHIFT_Y,
  };
}

function generatedDoubleMeasurementSourcePoint(canvas, qubitItem, qubitState) {
  if (validPoint(qubitState?.doubleMeasurementReturnPoint)) {
    return qubitState.doubleMeasurementReturnPoint;
  }
  return generatedCanvasPointForElementCenter(canvas, qubitItem);
}

function generatedDoubleMeasurementOrderedQubits(
  canvas,
  leftQubit,
  rightQubit,
  leftState,
  rightState,
) {
  if (
    leftState?.cnotSourceSlot === "top" &&
    rightState?.cnotSourceSlot === "bottom"
  ) {
    return { topQubit: leftQubit, bottomQubit: rightQubit };
  }
  if (
    rightState?.cnotSourceSlot === "top" &&
    leftState?.cnotSourceSlot === "bottom"
  ) {
    return { topQubit: rightQubit, bottomQubit: leftQubit };
  }
  if (
    leftState?.pairQubitIndex === 0 &&
    rightState?.pairQubitIndex === 1
  ) {
    return { topQubit: leftQubit, bottomQubit: rightQubit };
  }
  if (
    rightState?.pairQubitIndex === 0 &&
    leftState?.pairQubitIndex === 1
  ) {
    return { topQubit: rightQubit, bottomQubit: leftQubit };
  }
  const leftPoint = generatedDoubleMeasurementSourcePoint(
    canvas,
    leftQubit,
    leftState,
  );
  const rightPoint = generatedDoubleMeasurementSourcePoint(
    canvas,
    rightQubit,
    rightState,
  );
  return leftPoint.y <= rightPoint.y
    ? { topQubit: leftQubit, bottomQubit: rightQubit }
    : { topQubit: rightQubit, bottomQubit: leftQubit };
}

function collapseGeneratedQubitPairFromCnot(topQubitItem, bottomQubitItem) {
  const topState = ensureGeneratedQubitRuntimeState(topQubitItem);
  const bottomState = ensureGeneratedQubitRuntimeState(bottomQubitItem);
  if (!topState || !bottomState) {
    return null;
  }

  let argumentOutcomeKey = "bb";
  if (runtimeStatesSharePairState(topState, bottomState)) {
    const stateOrderOutcome = samplePairOutcomeForRegisterMembers(
      topState.pairState,
      topState.pairQubitIndex,
      bottomState.pairQubitIndex,
    );
    collapseRegisterStateMembersToOutcome(
      topState.pairState,
      topState.pairQubitIndex,
      bottomState.pairQubitIndex,
      stateOrderOutcome,
    );
    syncGeneratedPairStateVisuals(topState.pairState);
    mailboxRoomQueueSharedEntanglementUpdate(topState.pairState)?.catch(() => {});
    argumentOutcomeKey = outcomeKeyForPairStatesInArgumentOrder(
      stateOrderOutcome,
      topState,
      bottomState,
    );
  } else {
    const productState = {
      amplitudes: entangledAmplitudesFromQubitVectors(
        topState.vector,
        bottomState.vector,
      ),
    };
    argumentOutcomeKey = samplePairOutcomeFromEntangledState(productState);
  }
  const topBlue = argumentOutcomeKey[0] === "b";
  const bottomBlue = argumentOutcomeKey[1] === "b";
  topState.vector = topBlue ? [1, 0] : [0, 1];
  bottomState.vector = bottomBlue ? [1, 0] : [0, 1];
  const sharedRegisterState = runtimeStatesSharePairState(topState, bottomState)
    ? topState.pairState
    : null;
  if (!sharedRegisterState || registerStateNumQubits(sharedRegisterState) === 2) {
    topState.pairState = null;
    bottomState.pairState = null;
    topState.pairQubitIndex = null;
    bottomState.pairQubitIndex = null;
  }
  topState.cnotSourceSlot = null;
  bottomState.cnotSourceSlot = null;
  topState.cnotPairToken = null;
  bottomState.cnotPairToken = null;
  topState.cnotOutcomeProbabilities = null;
  bottomState.cnotOutcomeProbabilities = null;
  applyGeneratedQubitVectorVisualState(topQubitItem);
  applyGeneratedQubitVectorVisualState(bottomQubitItem);
  return {
    outcomeKey: argumentOutcomeKey,
    topColor: topBlue ? "blue" : "red",
    bottomColor: bottomBlue ? "blue" : "red",
  };
}

async function runGeneratedDoubleMeasurementCycle(canvas, runtime) {
  if (runtime.cyclePromise) {
    return runtime.cyclePromise;
  }
  if (
    runtime.busy ||
    !(runtime.slotOccupants.left instanceof HTMLElement) ||
    !(runtime.slotOccupants.right instanceof HTMLElement)
  ) {
    return null;
  }

  const leftQubit = runtime.slotOccupants.left;
  const rightQubit = runtime.slotOccupants.right;
  const leftState = ensureGeneratedQubitRuntimeState(leftQubit);
  const rightState = ensureGeneratedQubitRuntimeState(rightQubit);
  if (!leftState || !rightState) {
    return null;
  }

  runtime.busy = true;
  leftState.transiting = true;
  rightState.transiting = true;
  leftQubit.classList.add("generated-transit-active");
  rightQubit.classList.add("generated-transit-active");
  runtime.measurementTool.classList.remove("platform-extended");
  runtime.cyclePromise = (async () => {
    try {
      await waitForDuration(DOUBLE_MEASUREMENT_COLLAPSE_DELAY_MS);
      if (
        !generatedCanvasAllowsRuntime(canvas) ||
        !leftQubit.isConnected ||
        !rightQubit.isConnected ||
        runtime.slotOccupants.left !== leftQubit ||
        runtime.slotOccupants.right !== rightQubit
      ) {
        return false;
      }

      leftQubit.classList.add("collapse-animating");
      rightQubit.classList.add("collapse-animating");
      const orderedQubits = generatedDoubleMeasurementOrderedQubits(
        canvas,
        leftQubit,
        rightQubit,
        leftState,
        rightState,
      );
      recordGeneratedExperimentAction(canvas, {
        type: "double-measure",
        measurementId: ensureGeneratedItemId(runtime.item, "double-measurement"),
        leftQubitId: ensureGeneratedItemId(leftQubit, "qubit"),
        rightQubitId: ensureGeneratedItemId(rightQubit, "qubit"),
        leftQubitLogicalId: ensureQubitLogicalId(leftQubit),
        rightQubitLogicalId: ensureQubitLogicalId(rightQubit),
        topQubitId: ensureGeneratedItemId(orderedQubits.topQubit, "qubit"),
        bottomQubitId: ensureGeneratedItemId(
          orderedQubits.bottomQubit,
          "qubit",
        ),
        topQubitLogicalId: ensureQubitLogicalId(orderedQubits.topQubit),
        bottomQubitLogicalId: ensureQubitLogicalId(orderedQubits.bottomQubit),
      });
      const collapseResult = collapseGeneratedQubitPairFromCnot(
        orderedQubits.topQubit,
        orderedQubits.bottomQubit,
      );
      leftQubit.classList.remove("collapse-animating");
      rightQubit.classList.remove("collapse-animating");
      if (!collapseResult) {
        return false;
      }

      await waitForDuration(DOUBLE_MEASUREMENT_POST_COLLAPSE_DELAY_MS);
      if (
        !leftQubit.isConnected ||
        !rightQubit.isConnected ||
        runtime.slotOccupants.left !== leftQubit ||
        runtime.slotOccupants.right !== rightQubit
      ) {
        return false;
      }

      runtime.tubeCounts[collapseResult.outcomeKey] += 1;
      maybeExpandGeneratedDoubleMeasurementTubeCapacity(runtime);
      updateGeneratedDoubleMeasurementTubeFills(runtime);

      const leftSource =
        validPoint(leftState.doubleMeasurementReturnPoint) ||
        generatedDoubleMeasurementSlotCenter(canvas, runtime, "left");
      const rightSource =
        validPoint(rightState.doubleMeasurementReturnPoint) ||
        generatedDoubleMeasurementSlotCenter(canvas, runtime, "right");
      const leftReturn = leftSource;
      const rightReturn = rightSource;

      await Promise.all([
        moveGeneratedQubitToPoint(
          canvas,
          leftQubit,
          leftReturn.x,
          leftReturn.y,
          AUTO_TRAVEL_MS,
        ),
        moveGeneratedQubitToPoint(
          canvas,
          rightQubit,
          rightReturn.x,
          rightReturn.y,
          AUTO_TRAVEL_MS,
        ),
      ]);
      settleGeneratedQubitVisualState(leftQubit);
      settleGeneratedQubitVisualState(rightQubit);
      finishGeneratedExperimentRecordingAfterMeasurement(canvas);
      return true;
    } finally {
      leftQubit.classList.remove("collapse-animating");
      rightQubit.classList.remove("collapse-animating");
      runtime.slotOccupants.left = null;
      runtime.slotOccupants.right = null;
      leftState.doubleMeasurementReturnPoint = null;
      rightState.doubleMeasurementReturnPoint = null;
      leftQubit.classList.remove("generated-transit-active");
      rightQubit.classList.remove("generated-transit-active");
      runtime.busy = false;
      leftState.transiting = false;
      rightState.transiting = false;
      runtime.cyclePromise = null;
    }
  })();
  return runtime.cyclePromise;
}

async function runGeneratedDoubleMeasurementIngress(
  canvas,
  qubitItem,
  runtime,
) {
  if (
    !isGeneratedQubitItem(qubitItem) ||
    !runtime ||
    runtime.busy ||
    !generatedCanvasAllowsRuntime(canvas)
  ) {
    return false;
  }
  const qubitState = ensureGeneratedQubitRuntimeState(qubitItem);
  if (!qubitState || qubitState.transiting) {
    return false;
  }

  const slot = slotForGeneratedDoubleMeasurementIngress(qubitState, runtime);
  if (slot !== "left" && slot !== "right") {
    return false;
  }
  const existing = runtime.slotOccupants[slot];
  if (existing && existing !== qubitItem) {
    return false;
  }
  const otherSlot = slot === "left" ? "right" : "left";
  if (runtime.slotOccupants[otherSlot] === qubitItem) {
    runtime.slotOccupants[otherSlot] = null;
  }

  qubitState.doubleMeasurementReturnPoint =
    validPoint(
      generatedRuntimeDrag?.item === qubitItem
        ? generatedRuntimeDrag.startPoint
        : null,
    ) || generatedCanvasPointForElementCenter(canvas, qubitItem);
  qubitState.transiting = true;
  qubitItem.classList.add("generated-transit-active");
  runtime.slotOccupants[slot] = qubitItem;
  if (generatedRuntimeDrag?.item === qubitItem) {
    commitGeneratedDragRecord(generatedRuntimeDrag);
    qubitItem.classList.remove("dragging");
    generatedRuntimeDrag = null;
  }

  try {
    const center = generatedDoubleMeasurementSlotCenter(canvas, runtime, slot);
    await moveGeneratedQubitToPoint(
      canvas,
      qubitItem,
      center.x,
      center.y,
      AUTO_TRAVEL_MS,
    );
    settleGeneratedQubitVisualState(qubitItem);
    setGeneratedQubitCenter(canvas, qubitItem, center.x, center.y);
  } finally {
    qubitState.transiting = false;
    if (runtime.slotOccupants[slot] !== qubitItem) {
      qubitItem.classList.remove("generated-transit-active");
    }
  }

  if (
    runtime.slotOccupants.left instanceof HTMLElement &&
    runtime.slotOccupants.right instanceof HTMLElement
  ) {
    runGeneratedDoubleMeasurementCycle(canvas, runtime).catch(() => {});
  }
  return true;
}

function maybeSnapGeneratedQubitToDoubleMeasurement(qubitItem) {
  if (!isGeneratedQubitItem(qubitItem)) {
    return false;
  }
  const canvas = generatedCanvasForItem(qubitItem);
  if (!generatedCanvasAllowsRuntime(canvas)) {
    return false;
  }
  const qubitState = ensureGeneratedQubitRuntimeState(qubitItem);
  if (!canvas || !qubitState || qubitState.transiting) {
    return false;
  }
  const runtime = findBestGeneratedDoubleMeasurementRuntimeForQubit(
    canvas,
    qubitItem,
  );
  if (!runtime) {
    return false;
  }
  runGeneratedDoubleMeasurementIngress(canvas, qubitItem, runtime).catch(
    () => {},
  );
  return true;
}

function generatedSeparatedPairMeasurementLensCircle(magnifier) {
  const measureLens = magnifier?.measureLens;
  if (!(measureLens instanceof HTMLElement)) {
    return null;
  }
  const lensRect = measureLens.getBoundingClientRect();
  const radius = Math.min(lensRect.width, lensRect.height) / 2;
  if (radius <= 0) {
    return null;
  }
  return {
    x: lensRect.left + lensRect.width / 2,
    y: lensRect.top + lensRect.height / 2,
    radius,
  };
}

function generatedQubitOverlapRatioWithSeparatedPairMagnifier(
  qubitItem,
  magnifier,
) {
  const lensCircle = generatedSeparatedPairMeasurementLensCircle(magnifier);
  if (!lensCircle) {
    return 0;
  }
  const qubitRect = qubitItem.getBoundingClientRect();
  const qRadius = qubitRect.width / 2;
  if (qRadius <= 0) {
    return 0;
  }
  const qCx = qubitRect.left + qRadius;
  const qCy = qubitRect.top + qRadius;
  const distance = Math.hypot(qCx - lensCircle.x, qCy - lensCircle.y);
  const overlapArea = generatedCircleIntersectionArea(
    qRadius,
    lensCircle.radius,
    distance,
  );
  const qubitArea = Math.PI * qRadius * qRadius;
  return qubitArea > 0 ? overlapArea / qubitArea : 0;
}

function generatedSeparatedPairMeasurementTargetForQubit(
  canvas,
  qubitItem,
  runtime,
  magnifierIndex = null,
) {
  if (!runtime?.magnifiers?.length) {
    return null;
  }
  if (Number.isFinite(magnifierIndex)) {
    return (
      runtime.magnifiers.find(
        (magnifier) => magnifier.index === Number(magnifierIndex),
      ) ||
      (runtime.magnifiers.length === 1 ? runtime.magnifiers[0] : null)
    );
  }
  let bestMagnifier = null;
  let bestOverlap = MEASUREMENT_OVERLAP_THRESHOLD;
  runtime.magnifiers.forEach((magnifier) => {
    const overlap = Math.max(
      generatedQubitOverlapRatioWithSeparatedPairMagnifier(
        qubitItem,
        magnifier,
      ),
      generatedQubitOverlapRatioWithRect(qubitItem, magnifier.measurementTool),
    );
    if (overlap >= bestOverlap) {
      bestOverlap = overlap;
      bestMagnifier = magnifier;
    }
  });
  return bestMagnifier;
}

function findBestGeneratedSeparatedPairMeasurementRuntimeForQubit(
  canvas,
  qubitItem,
) {
  pruneGeneratedRuntimeState();
  let best = null;
  let bestOverlap = MEASUREMENT_OVERLAP_THRESHOLD;
  canvas
    .querySelectorAll(
      `.playground-node[data-component="${PLAYGROUND_SAVED_GROUP_COMPONENT_TYPE}"]`,
    )
    .forEach((item) => {
      if (!(item instanceof HTMLElement)) {
        return;
      }
      const runtime = initializeGeneratedSeparatedPairMeasurementItem(item);
      if (
        !runtime ||
        runtime.busy ||
        runtime.completing ||
        runtime.pendingMeasurements.some(
          (entry) => entry.qubitItem === qubitItem,
        )
      ) {
        return;
      }
      runtime.magnifiers.forEach((magnifier) => {
        const overlap = Math.max(
          generatedQubitOverlapRatioWithSeparatedPairMagnifier(
            qubitItem,
            magnifier,
          ),
          generatedQubitOverlapRatioWithRect(
            qubitItem,
            magnifier.measurementTool,
          ),
        );
        if (overlap >= bestOverlap) {
          bestOverlap = overlap;
          best = { runtime, magnifier };
        }
      });
    });
  return best;
}

function generatedPairPartnerInfoForQubit(canvas, qubitItem, qubitState) {
  if (!qubitState) {
    return null;
  }
  if (qubitState.pairState?.members) {
    const partner = qubitState.pairState.members.find(
      (member) => member.item instanceof HTMLElement && member.item !== qubitItem,
    );
    if (partner?.item instanceof HTMLElement) {
      return {
        partnerItem: partner.item,
        partnerId: ensureGeneratedItemId(partner.item, "qubit"),
        logicalQubitId: qubitLogicalIdForItem(partner.item),
        partnerOrderIndex: Number.isFinite(partner.qubitIndex)
          ? partner.qubitIndex
          : partner.state?.pairQubitIndex,
      };
    }
  }
  if (qubitState.cnotPairToken) {
    for (const [candidateItem, candidateState] of generatedQubitRuntimes) {
      if (
        candidateItem !== qubitItem &&
        generatedCanvasForItem(candidateItem) === canvas &&
        candidateState?.cnotPairToken === qubitState.cnotPairToken
      ) {
        return {
          partnerItem: candidateItem,
          partnerId: ensureGeneratedItemId(candidateItem, "qubit"),
          logicalQubitId: qubitLogicalIdForItem(candidateItem),
          partnerOrderIndex:
            candidateState.cnotSourceSlot === "top"
              ? 0
              : candidateState.cnotSourceSlot === "bottom"
                ? 1
                : candidateState.pairQubitIndex,
        };
      }
    }
  }
  return null;
}

function generatedSeparatedPairOrderIndexForQubit(
  canvas,
  runtime,
  qubitItem,
  qubitState,
) {
  const requiredCount = Math.max(2, runtime?.registerQubitCount || 2);
  const roomIndex = roomQubitIndexForItem(qubitItem);
  if (
    requiredCount > 2 &&
    Number.isInteger(roomIndex) &&
    roomIndex >= 0 &&
    roomIndex < requiredCount
  ) {
    return roomIndex;
  }
  if (requiredCount > 2) {
    ensureGeneratedMeasurementSlotIndexes(canvas, qubitItem);
    const measurementSlotIndex = generatedMeasurementSlotIndexForItem(qubitItem);
    if (
      Number.isInteger(measurementSlotIndex) &&
      measurementSlotIndex >= 0 &&
      measurementSlotIndex < requiredCount
    ) {
      return measurementSlotIndex;
    }
  }
  const logicalIndex = (qubitLogicalIdForItem(qubitItem) || 0) - 1;
  if (
    requiredCount > 2 &&
    Number.isInteger(logicalIndex) &&
    logicalIndex >= 0 &&
    logicalIndex < requiredCount
  ) {
    return logicalIndex;
  }
  if (Number.isFinite(qubitState?.pairQubitIndex)) {
    return clamp(
      Math.round(qubitState.pairQubitIndex),
      0,
      requiredCount - 1,
    );
  }
  if (qubitState?.cnotSourceSlot === "top") {
    return 0;
  }
  if (qubitState?.cnotSourceSlot === "bottom") {
    return 1;
  }

  const qubitId = ensureGeneratedItemId(qubitItem, "qubit");
  const expectedFromPending = runtime.pendingMeasurements.find(
    (entry) => entry.partnerId === qubitId,
  );
  if (Number.isFinite(expectedFromPending?.partnerOrderIndex)) {
    return clamp(
      Math.round(expectedFromPending.partnerOrderIndex),
      0,
      requiredCount - 1,
    );
  }

  const sortedQubits = sortGeneratedItemsTopToBottom(
    canvas,
    generatedItemsOfType(canvas, "qubit"),
  ).slice(0, requiredCount);
  const sortedIndex = sortedQubits.indexOf(qubitItem);
  if (sortedIndex >= 0 && sortedIndex < requiredCount) {
    return sortedIndex;
  }

  const used = new Set(
    runtime.pendingMeasurements
      .map((entry) => entry.orderIndex)
      .filter(
        (orderIndex) =>
          Number.isInteger(orderIndex) &&
          orderIndex >= 0 &&
          orderIndex < requiredCount,
      ),
  );
  for (let index = 0; index < requiredCount; index += 1) {
    if (!used.has(index)) {
      return index;
    }
  }
  return requiredCount - 1;
}

function storeGeneratedSeparatedPairMeasurementPending(runtime, entry) {
  const requiredCount = Math.max(2, runtime.registerQubitCount || 2);
  const nextEntry = { ...(entry || {}) };
  let entryOrderIndex = Number.isInteger(nextEntry.orderIndex)
    ? nextEntry.orderIndex
    : null;
  if (requiredCount > 2) {
    const usedByOtherQubits = new Set(
      runtime.pendingMeasurements
        .filter((pending) => pending.qubitId !== nextEntry.qubitId)
        .map((pending) => pending.orderIndex)
        .filter(
          (orderIndex) =>
            Number.isInteger(orderIndex) &&
            orderIndex >= 0 &&
            orderIndex < requiredCount,
        ),
    );
    if (entryOrderIndex === null || usedByOtherQubits.has(entryOrderIndex)) {
      for (let index = 0; index < requiredCount; index += 1) {
        if (!usedByOtherQubits.has(index)) {
          entryOrderIndex = index;
          nextEntry.orderIndex = index;
          break;
        }
      }
    }
  }
  runtime.pendingMeasurements = runtime.pendingMeasurements.filter((pending) => {
    const pendingOrderIndex = Number.isInteger(pending?.orderIndex)
      ? pending.orderIndex
      : null;
    if (
      requiredCount > 2 &&
      entryOrderIndex !== null &&
      pendingOrderIndex !== null
    ) {
      return pendingOrderIndex !== entryOrderIndex;
    }
    return pending.qubitId !== nextEntry.qubitId;
  });
  if (runtime.pendingMeasurements.length >= requiredCount) {
    runtime.pendingMeasurements = [];
  }
  runtime.measurementSequence += 1;
  runtime.pendingMeasurements.push({
    ...nextEntry,
    sequence: runtime.measurementSequence,
  });
  logGeneratedMeasurementProgress(runtime, {
    event: "pending",
    qubitId: nextEntry.qubitId,
    logicalQubitId: nextEntry.logicalQubitId,
    color: nextEntry.color,
    orderIndex: nextEntry.orderIndex,
    measuredSoFar: runtime.pendingMeasurements.length,
    requiredCount,
  });
}

function generatedSeparatedPairMeasurementOutcomeEntries(runtime) {
  const requiredCount = Math.max(2, runtime?.registerQubitCount || 2);
  const entries = runtime.pendingMeasurements.slice(0, requiredCount);
  if (requiredCount === 2) {
    const top = entries.find((entry) => entry.orderIndex === 0);
    const bottom = entries.find((entry) => entry.orderIndex === 1);
    if (top && bottom && top !== bottom) {
      return [top, bottom];
    }
  }
  const sorted = entries
    .slice()
    .sort(
      (a, b) =>
        (Number.isFinite(a.orderIndex) ? a.orderIndex : requiredCount) -
          (Number.isFinite(b.orderIndex) ? b.orderIndex : requiredCount) ||
        a.sequence - b.sequence,
    );
  const byIndex = Array.from({ length: requiredCount }, (_item, index) =>
    sorted.find((entry) => entry.orderIndex === index),
  );
  if (byIndex.every(Boolean) && new Set(byIndex).size === requiredCount) {
    return byIndex;
  }
  return sorted;
}

function registerOutcomeKeyFromMeasurementEntries(entries) {
  return entries
    .map((entry) => (entry.color === "red" ? "r" : "b"))
    .join("");
}

function pairOutcomeKeyFromMeasurementEntries(entries) {
  const [topEntry, bottomEntry] = entries;
  if (!topEntry || !bottomEntry) {
    return "bb";
  }
  return pairOutcomeKeyFromColorBooleans(
    topEntry.color === "blue",
    bottomEntry.color === "blue",
  );
}

function separatedMeasurementOutcomeKeyFromEntries(runtime, entries) {
  if ((runtime?.registerQubitCount || 2) === 2) {
    return pairOutcomeKeyFromMeasurementEntries(entries);
  }
  const outcomeKey = registerOutcomeKeyFromMeasurementEntries(entries);
  return runtime?.tubeElements?.[outcomeKey]
    ? outcomeKey
    : registerMeasurementOutcomeKeys(runtime?.registerQubitCount || 2)[0];
}

function logGeneratedMeasurementProgress(runtime, details = {}) {
  if (typeof console === "undefined" || typeof console.info !== "function") {
    return;
  }
  const pending = Array.isArray(runtime?.pendingMeasurements)
    ? runtime.pendingMeasurements
    : [];
  const requiredCount = Math.max(
    1,
    Number(details.requiredCount) ||
      Number(runtime?.registerQubitCount) ||
      Number(runtime?.configuredRegisterQubitCount) ||
      1,
  );
  console.info("[Qubit Lab] measurement progress", {
    event: details.event || "measured",
    measurementId:
      details.measurementId ||
      runtime?.item?.dataset?.generatedItemId ||
      runtime?.item?.id ||
      null,
    qubitId: details.qubitId || null,
    logicalQubitId: details.logicalQubitId || null,
    color: details.color || null,
    orderIndex: Number.isInteger(details.orderIndex)
      ? details.orderIndex
      : null,
    measuredSoFar: Math.min(
      requiredCount,
      Math.max(0, Number(details.measuredSoFar) || pending.length),
    ),
    requiredCount,
    pending: pending.map((entry) => ({
      qubitId: entry.qubitId || null,
      logicalQubitId: entry.logicalQubitId || null,
      color: entry.color || null,
      orderIndex: Number.isInteger(entry.orderIndex) ? entry.orderIndex : null,
    })),
    outcomeKey: details.outcomeKey || null,
    recording: Boolean(
      generatedExperimentStateForCanvas(
        generatedCanvasForItem(runtime?.item),
      )?.recording,
    ),
  });
}

function generatedSeparatedMeasurementPayloadOffset(index, total) {
  if (total <= 1) {
    return 0;
  }
  return (index - (total - 1) / 2) * 8;
}

function generatedPairMeasurementTubeTargetPoint(canvas, runtime, outcomeKey) {
  const tube = runtime?.tubeElements?.[outcomeKey];
  if (!(tube instanceof HTMLElement)) {
    return null;
  }
  const tubeRect = tube.getBoundingClientRect();
  return generatedViewportPointToCanvasPoint(
    canvas,
    tubeRect.left + tubeRect.width / 2,
    tubeRect.top + tubeRect.height * 0.22,
  );
}

async function animateGeneratedSeparatedPairPayloadsToTube(
  canvas,
  runtime,
  entries,
  outcomeKey,
) {
  const targetPoint = generatedPairMeasurementTubeTargetPoint(
    canvas,
    runtime,
    outcomeKey,
  );
  if (!targetPoint) {
    return false;
  }
  const payloads = entries.map((entry) =>
    createGeneratedMeasurementPayload(canvas, entry.color, entry.startPoint),
  );
  try {
    await Promise.all(
      payloads.map((payload, index) =>
        moveGeneratedPayloadToPoint(
          payload,
          targetPoint.x +
            generatedSeparatedMeasurementPayloadOffset(index, payloads.length),
          targetPoint.y,
          AUTO_TRAVEL_MS,
        ),
      ),
    );
    payloads.forEach((payload) => {
      payload.style.setProperty(
        "--melt-duration",
        `${scaledGeneratedDuration(AUTO_MELT_MS)}ms`,
      );
      payload.classList.add("melting");
    });
    await waitForDuration(AUTO_MELT_MS);
    return true;
  } finally {
    payloads.forEach((payload) => payload.remove());
  }
}

async function maybeCompleteGeneratedSeparatedPairMeasurement(canvas, runtime) {
  const requiredCount = Math.max(2, runtime?.registerQubitCount || 2);
  if (
    !runtime ||
    runtime.completing ||
    runtime.pendingMeasurements.length < requiredCount
  ) {
    return false;
  }
  const entries = generatedSeparatedPairMeasurementOutcomeEntries(runtime);
  if (entries.length < requiredCount) {
    return false;
  }
  const outcomeEntries = entries.slice(0, requiredCount);
  const outcomeKey = separatedMeasurementOutcomeKeyFromEntries(
    runtime,
    outcomeEntries,
  );
  runtime.completing = true;
  try {
    const countingRuntime =
      reconfigureGeneratedSeparatedMeasurementRuntimeForRegister(
        runtime,
        requiredCount,
      ) || runtime;
    await animateGeneratedSeparatedPairPayloadsToTube(
      canvas,
      countingRuntime,
      outcomeEntries,
      outcomeKey,
    );
    countingRuntime.tubeCounts[outcomeKey] += 1;
    maybeExpandGeneratedDoubleMeasurementTubeCapacity(countingRuntime);
    updateGeneratedDoubleMeasurementTubeFills(countingRuntime);
    logGeneratedMeasurementProgress(countingRuntime, {
      event: "complete",
      measuredSoFar: requiredCount,
      requiredCount,
      outcomeKey,
    });
    finishGeneratedExperimentRecordingAfterMeasurement(canvas, {
      forceStop: requiredCount > 2,
    });
    return true;
  } finally {
    runtime.pendingMeasurements = [];
    runtime.completing = false;
  }
}

function generatedSeparatedPairMeasurementEjectionPoint(
  canvas,
  magnifier,
  qubitItem,
  orderIndex = null,
  laneCount = 2,
) {
  const toolRect = magnifier.measurementTool.getBoundingClientRect();
  const qubitRect = qubitItem.getBoundingClientRect();
  const safeLaneCount = Math.max(1, Number(laneCount) || 1);
  const laneStep = Math.max(28, qubitRect.height * 0.64);
  const laneOffset = Number.isFinite(orderIndex)
    ? (orderIndex - (safeLaneCount - 1) / 2) * laneStep
    : 0;
  const centerY =
    toolRect.top +
    toolRect.height / 2 +
    laneOffset;
  const candidate = generatedViewportPointToCanvasPoint(
    canvas,
    toolRect.right + Math.max(28, qubitRect.width * 0.7),
    centerY,
  );
  const radius = Math.max(1, qubitRect.width / 2);
  return {
    x: clamp(candidate.x, radius, canvas.scrollWidth - radius),
    y: clamp(candidate.y, radius, canvas.scrollHeight - radius),
  };
}

async function runGeneratedSeparatedPairMeasurementTransit(
  canvas,
  qubitItem,
  runtime,
  magnifierIndex = null,
) {
  if (
    !isGeneratedQubitItem(qubitItem) ||
    !runtime ||
    runtime.busy ||
    runtime.completing ||
    !generatedCanvasAllowsRuntime(canvas)
  ) {
    return false;
  }
  const qubitState = ensureGeneratedQubitRuntimeState(qubitItem);
  if (!qubitState || qubitState.transiting) {
    return false;
  }
  const qubitId = ensureGeneratedItemId(qubitItem, "qubit");
  const pendingRegisterEntry = runtime.pendingMeasurements.find(
    (entry) => entry.partnerId === qubitId,
  );
  const forcedRegisterCount = forcedRegisterMeasurementQubitCountForRuntime(runtime);
  const inferredRegisterCount = pendingRegisterEntry
    ? Math.max(2, Number(runtime.registerQubitCount) || 2)
    : qubitState.pairState
      ? Math.max(
          2,
          Math.min(4, registerStateNumQubits(qubitState.pairState)),
        )
      : 1;
  const measurementRegisterCount = forcedRegisterCount
    ? Math.max(forcedRegisterCount, inferredRegisterCount)
    : inferredRegisterCount;
  runtime.registerQubitCount = measurementRegisterCount;
  runtime.capacityUnit =
    measurementRegisterCount > 2 ? "counts" : "qubit pairs";
  runtime.item.dataset.measurementRegisterQubitCount = `${measurementRegisterCount}`;
  if (
    runtime.pendingMeasurements.some((entry) => entry.qubitId === qubitId)
  ) {
    return false;
  }
  const target = generatedSeparatedPairMeasurementTargetForQubit(
    canvas,
    qubitItem,
    runtime,
    magnifierIndex,
  );
  if (!target) {
    return false;
  }

  const partnerInfo = generatedPairPartnerInfoForQubit(
    canvas,
    qubitItem,
    qubitState,
  );
  const roomMeasurementIndex = await mailboxRoomEnsureQubitIdentityForMeasurement(
    canvas,
    qubitItem,
    measurementRegisterCount,
  );
  if (
    mailboxRoomIsJoined() &&
    isEntanglementThreeCanvas(canvas) &&
    measurementRegisterCount > 2 &&
    !Number.isInteger(roomMeasurementIndex)
  ) {
    return false;
  }
  const orderIndex = generatedSeparatedPairOrderIndexForQubit(
    canvas,
    runtime,
    qubitItem,
    qubitState,
  );
  const sharedPairState =
    mailboxRoomIsJoined() && qubitState.pairState?.remoteEntanglementId
      ? qubitState.pairState
      : null;
  const sharedQubitIndex = Number.isFinite(qubitState.pairQubitIndex)
    ? qubitState.pairQubitIndex
    : orderIndex;
  const logicalQubitId = ensureQubitLogicalId(qubitItem);
  const lensCenter = generatedCanvasPointForElementCenter(
    canvas,
    target.measureLens,
  );
  qubitState.transiting = true;
  runtime.busy = true;
  if (generatedRuntimeDrag?.item === qubitItem) {
    commitGeneratedDragRecord(generatedRuntimeDrag);
    qubitItem.classList.remove("dragging");
    generatedRuntimeDrag = null;
  }

  const core = getGeneratedQubitCore(qubitItem);
  try {
    await moveGeneratedQubitToPoint(
      canvas,
      qubitItem,
      lensCenter.x,
      lensCenter.y,
      AUTO_TRAVEL_MS,
    );
    settleGeneratedQubitVisualState(qubitItem);
    setGeneratedQubitCenter(canvas, qubitItem, lensCenter.x, lensCenter.y);
    if (core instanceof HTMLElement) {
      core.classList.add("collapse-animating");
    }
    if (measurementRegisterCount > 2) {
      ensureEntanglementThreeRoomExperimentRecording(canvas);
    }
    recordGeneratedExperimentAction(canvas, {
      type: "separated-pair-measure",
      measurementId: ensureGeneratedItemId(
        runtime.item,
        "separated-pair-measurement",
      ),
      qubitId,
      logicalQubitId,
      roomQubitIndex: roomQubitIndexForItem(qubitItem),
      partnerLogicalQubitId: partnerInfo?.logicalQubitId,
      magnifierIndex: target.index,
      orderIndex,
      registerQubitCount: measurementRegisterCount,
    });
    const collapsedColor = collapseGeneratedQubitState(qubitItem, {
      deferRemoteRegisterMeasurement: Boolean(sharedPairState),
    });
    logGeneratedMeasurementProgress(runtime, {
      event: "collapsed",
      qubitId,
      logicalQubitId,
      color: collapsedColor,
      orderIndex,
      measuredSoFar: runtime.pendingMeasurements.length,
      requiredCount: measurementRegisterCount,
    });
    if (sharedPairState) {
      setGeneratedMeasuredQubitVisualState(qubitItem, collapsedColor);
    }
    if (core instanceof HTMLElement) {
      core.classList.remove("collapse-animating");
    }

    const ejectionPoint = generatedSeparatedPairMeasurementEjectionPoint(
      canvas,
      target,
      qubitItem,
      orderIndex,
      measurementRegisterCount,
    );
    await moveGeneratedQubitToPoint(
      canvas,
      qubitItem,
      ejectionPoint.x,
      ejectionPoint.y,
      AUTO_TRAVEL_MS,
    );
    settleGeneratedQubitVisualState(qubitItem);
    if (sharedPairState) {
      setGeneratedMeasuredQubitVisualState(qubitItem, collapsedColor);
    }

    const measurementEntry = {
      qubitId,
      qubitItem,
      logicalQubitId,
      roomQubitIndex: roomQubitIndexForItem(qubitItem),
      color: collapsedColor,
      orderIndex,
      startPoint: lensCenter,
      partnerId: partnerInfo?.partnerId || "",
      partnerLogicalQubitId: partnerInfo?.logicalQubitId,
      partnerOrderIndex: partnerInfo?.partnerOrderIndex,
    };

    if (sharedPairState) {
      const result = await mailboxRoomRecordSharedRegisterMeasurement(
        sharedPairState,
        {
          qubitIndex: sharedQubitIndex,
          color: collapsedColor,
          logicalQubitId,
        },
      ).catch(() => null);
      const sharedRegisterCount = Math.max(
        2,
        Math.min(4, registerStateNumQubits(sharedPairState)),
      );
      const mixedRegisterMeasurement =
        forcedRegisterCount > 0 && measurementRegisterCount > sharedRegisterCount;
      if (mailboxRoomIsJoined() && measurementRegisterCount > 2) {
        try {
          await mailboxRoomRecordRoomMeasurement(runtime, measurementEntry);
          return true;
        } catch (error) {
          console.warn?.("[Qubit Lab] room measurement sync failed", error);
        }
      }
      if (mixedRegisterMeasurement) {
        storeGeneratedSeparatedPairMeasurementPending(runtime, measurementEntry);
        await maybeCompleteGeneratedSeparatedPairMeasurement(canvas, runtime);
      } else if (result?.sharedEntanglement) {
        applySharedRegisterMeasurementCounts(result.sharedEntanglement);
      }
      if (result?.completed && !mixedRegisterMeasurement) {
        finishGeneratedExperimentRecordingAfterMeasurement(canvas, {
          forceStop: measurementRegisterCount > 2,
        });
      }
      return true;
    }

    if (measurementRegisterCount === 1) {
      const singleRuntime = ensureGeneratedSeparatedSingleTubeRuntime(runtime);
      if (!singleRuntime) {
        return false;
      }
      await animateGeneratedMeasurementPayloadToTube(
        canvas,
        singleRuntime,
        collapsedColor,
        lensCenter,
      );
      finishGeneratedExperimentRecordingAfterMeasurement(canvas);
      return true;
    }

    storeGeneratedSeparatedPairMeasurementPending(runtime, measurementEntry);
    if (mailboxRoomIsJoined() && measurementRegisterCount > 2) {
      try {
        await mailboxRoomRecordRoomMeasurement(runtime, measurementEntry);
        return true;
      } catch (error) {
        console.warn?.("[Qubit Lab] room measurement sync failed", error);
      }
    }
    await maybeCompleteGeneratedSeparatedPairMeasurement(canvas, runtime);
    return true;
  } finally {
    if (core instanceof HTMLElement) {
      core.classList.remove("collapse-animating");
    }
    qubitState.transiting = false;
    runtime.busy = false;
  }
}

function maybeSnapGeneratedQubitToSeparatedPairMeasurement(qubitItem) {
  if (!isGeneratedQubitItem(qubitItem)) {
    return false;
  }
  const canvas = generatedCanvasForItem(qubitItem);
  if (!generatedCanvasAllowsRuntime(canvas)) {
    return false;
  }
  const qubitState = ensureGeneratedQubitRuntimeState(qubitItem);
  if (!canvas || !qubitState || qubitState.transiting) {
    return false;
  }
  const target = findBestGeneratedSeparatedPairMeasurementRuntimeForQubit(
    canvas,
    qubitItem,
  );
  if (!target) {
    return false;
  }
  runGeneratedSeparatedPairMeasurementTransit(
    canvas,
    qubitItem,
    target.runtime,
    target.magnifier.index,
  ).catch(() => {});
  return true;
}

function generatedItemsOfType(canvas, type) {
  if (!isGeneratedLayoutCanvas(canvas)) {
    return [];
  }
  return Array.from(
    canvas.querySelectorAll(`.playground-node[data-component="${type}"]`),
  ).filter((item) => item instanceof HTMLElement);
}

function generatedItemCenterPoint(canvas, item) {
  return generatedCanvasPointForElementCenter(canvas, item);
}

function sortGeneratedItemsTopToBottom(canvas, items) {
  return items.slice().sort((a, b) => {
    const aCenter = generatedItemCenterPoint(canvas, a);
    const bCenter = generatedItemCenterPoint(canvas, b);
    return aCenter.y - bCenter.y || aCenter.x - bCenter.x;
  });
}

function nearestGeneratedItemByCenter(canvas, sourceElement, items) {
  const sourceCenter = generatedItemCenterPoint(canvas, sourceElement);
  let bestItem = null;
  let bestDistance = Infinity;
  items.forEach((item) => {
    const center = generatedItemCenterPoint(canvas, item);
    const distance = Math.hypot(
      center.x - sourceCenter.x,
      center.y - sourceCenter.y,
    );
    if (distance < bestDistance) {
      bestDistance = distance;
      bestItem = item;
    }
  });
  return bestItem;
}

function generatedPointInsideElement(canvas, point, element) {
  const bounds = generatedCanvasBoundsForElement(canvas, element);
  return Boolean(
    bounds &&
    point &&
    point.x >= bounds.left &&
    point.x <= bounds.right &&
    point.y >= bounds.top &&
    point.y <= bounds.bottom,
  );
}

function resolveGeneratedDoubleMeasurementAutomationPath(
  canvas,
  measurementRuntime,
) {
  pruneGeneratedRuntimeState();
  const qubits = sortGeneratedItemsTopToBottom(
    canvas,
    generatedItemsOfType(canvas, "qubit"),
  ).slice(0, 2);
  const gateItems = sortGeneratedItemsTopToBottom(
    canvas,
    generatedItemsOfType(canvas, "single-gate"),
  ).slice(0, 2);
  const cnotItem = nearestGeneratedItemByCenter(
    canvas,
    measurementRuntime.item,
    generatedItemsOfType(canvas, "cnot-gate"),
  );
  if (
    qubits.length < 2 ||
    gateItems.length < 2 ||
    !(cnotItem instanceof HTMLElement)
  ) {
    return null;
  }

  const topQubit = qubits[0];
  const bottomQubit = qubits[1];
  const topGate = initializeGeneratedSingleGateItem(gateItems[0], {
    singleGateTick: generatedSingleGateRuntimes.get(gateItems[0])?.activeTick,
  });
  const bottomGate = initializeGeneratedSingleGateItem(gateItems[1], {
    singleGateTick: generatedSingleGateRuntimes.get(gateItems[1])?.activeTick,
  });
  const cnotRuntime = initializeGeneratedCnotItem(cnotItem);
  if (!topGate || !bottomGate || !cnotRuntime) {
    return null;
  }

  return {
    topQubit,
    bottomQubit,
    topGate,
    bottomGate,
    cnotRuntime,
  };
}

function generatedGateLaneStartPoint(canvas, qubitItem, gateRuntime) {
  const gateCenter = generatedCanvasPointForElementCenter(
    canvas,
    gateRuntime.gateWindow,
  );
  const radius = Math.max(1, qubitItem.offsetWidth / 2);
  return {
    x: Math.max(radius + QUBIT_START_EDGE_GAP, gateCenter.x - 100),
    y: gateCenter.y,
  };
}

function generatedPointIsBeforeGate(canvas, qubitItem, gateRuntime, point) {
  if (!point || !gateRuntime?.gateWindow) {
    return false;
  }
  const gateCenter = generatedCanvasPointForElementCenter(
    canvas,
    gateRuntime.gateWindow,
  );
  const buffer = Math.max(12, qubitItem.offsetWidth * 0.35);
  return point.x <= gateCenter.x - buffer;
}

function isGeneratedCanvasPoint(point) {
  return Boolean(point && Number.isFinite(point.x) && Number.isFinite(point.y));
}

function generatedAutomationStartPoint(
  canvas,
  qubitItem,
  gateRuntime,
  measurementRuntime,
  cachedPoint = null,
) {
  const current = generatedItemCenterPoint(canvas, qubitItem);
  if (
    generatedPointInsideElement(canvas, current, measurementRuntime.item) ||
    generatedPointInsideElement(
      canvas,
      current,
      measurementRuntime.measurementTool,
    ) ||
    !generatedPointIsBeforeGate(canvas, qubitItem, gateRuntime, current)
  ) {
    return isGeneratedCanvasPoint(cachedPoint)
      ? cachedPoint
      : generatedGateLaneStartPoint(canvas, qubitItem, gateRuntime);
  }
  return current;
}

function resetGeneratedQubitForAutomatedRun(canvas, qubitItem, startPoint) {
  const state = ensureGeneratedQubitRuntimeState(qubitItem);
  if (!state) {
    return;
  }
  state.vector = generatedInitialVectorForQubitItem(qubitItem);
  state.transiting = false;
  state.cnotSourceSlot = null;
  state.cnotPairToken = null;
  state.cnotOutcomeProbabilities = null;
  state.doubleMeasurementReturnPoint = null;
  settleGeneratedQubitVisualState(qubitItem);
  if (startPoint) {
    setGeneratedQubitCenter(canvas, qubitItem, startPoint.x, startPoint.y);
    qubitItem.getBoundingClientRect();
  }
  applyGeneratedQubitVectorVisualState(qubitItem);
}

function applyGeneratedSingleGateStateWithoutAnimation(qubitItem, gateRuntime) {
  const state = ensureGeneratedQubitRuntimeState(qubitItem);
  if (!state || !gateRuntime) {
    return;
  }
  state.vector = normalizeVector2(
    vectorTimesMatrix2(state.vector, gateMatrixForTick(gateRuntime.activeTick)),
  );
  state.cnotSourceSlot = null;
  state.cnotPairToken = null;
  state.cnotOutcomeProbabilities = null;
  state.doubleMeasurementReturnPoint = null;
  applyGeneratedQubitVectorVisualState(qubitItem);
}

function annotateGeneratedCnotOutcomeProbabilities(
  topQubitItem,
  bottomQubitItem,
) {
  const topState = ensureGeneratedQubitRuntimeState(topQubitItem);
  const bottomState = ensureGeneratedQubitRuntimeState(bottomQubitItem);
  if (!topState || !bottomState) {
    return;
  }
  const probabilities = cnotOutcomeProbabilitiesFromQubitVectors(
    topState.vector,
    bottomState.vector,
  );
  const pairToken = `${Date.now()}-${Math.random()}`;
  topState.cnotPairToken = pairToken;
  bottomState.cnotPairToken = pairToken;
  topState.cnotOutcomeProbabilities = probabilities;
  bottomState.cnotOutcomeProbabilities = probabilities;
}

function runGeneratedDoubleMeasurementMachineIteration(
  path,
  measurementRuntime,
) {
  resetGeneratedQubitForAutomatedRun(null, path.topQubit, null);
  resetGeneratedQubitForAutomatedRun(null, path.bottomQubit, null);
  applyGeneratedSingleGateStateWithoutAnimation(path.topQubit, path.topGate);
  applyGeneratedSingleGateStateWithoutAnimation(
    path.bottomQubit,
    path.bottomGate,
  );
  annotateGeneratedCnotOutcomeProbabilities(path.topQubit, path.bottomQubit);
  applyGeneratedCnotToQubitStates(path.topQubit, path.bottomQubit);
  const collapseResult = collapseGeneratedQubitPairFromCnot(
    path.topQubit,
    path.bottomQubit,
  );
  if (!collapseResult) {
    return false;
  }
  measurementRuntime.tubeCounts[collapseResult.outcomeKey] += 1;
  maybeExpandGeneratedDoubleMeasurementTubeCapacity(measurementRuntime);
  return true;
}

async function runGeneratedDoubleMeasurementAnimatedIteration(
  canvas,
  path,
  measurementRuntime,
  startPoints,
) {
  resetGeneratedQubitForAutomatedRun(canvas, path.topQubit, startPoints.top);
  resetGeneratedQubitForAutomatedRun(
    canvas,
    path.bottomQubit,
    startPoints.bottom,
  );
  await nextAnimationFrame();
  if (layoutEditorState.enabled) {
    return false;
  }

  const gatesCompleted = await Promise.all([
    runGeneratedSingleGateTransit(canvas, path.topQubit, path.topGate),
    runGeneratedSingleGateTransit(canvas, path.bottomQubit, path.bottomGate),
  ]);
  if (!gatesCompleted.every(Boolean) || layoutEditorState.enabled) {
    return false;
  }

  const cnotIngressCompleted = await Promise.all([
    runGeneratedCnotIngress(canvas, path.topQubit, path.cnotRuntime, "top"),
    runGeneratedCnotIngress(
      canvas,
      path.bottomQubit,
      path.cnotRuntime,
      "bottom",
    ),
  ]);
  if (!cnotIngressCompleted.every(Boolean) || layoutEditorState.enabled) {
    return false;
  }
  if (path.cnotRuntime.cyclePromise) {
    const cnotCompleted = await path.cnotRuntime.cyclePromise;
    if (!cnotCompleted || layoutEditorState.enabled) {
      return false;
    }
  }

  const measurementIngressCompleted = await Promise.all([
    runGeneratedDoubleMeasurementIngress(
      canvas,
      path.topQubit,
      measurementRuntime,
    ),
    runGeneratedDoubleMeasurementIngress(
      canvas,
      path.bottomQubit,
      measurementRuntime,
    ),
  ]);
  if (
    !measurementIngressCompleted.every(Boolean) ||
    layoutEditorState.enabled
  ) {
    return false;
  }
  if (measurementRuntime.cyclePromise) {
    const measurementCompleted = await measurementRuntime.cyclePromise;
    return Boolean(measurementCompleted);
  }
  return false;
}

async function runAutomatedGeneratedDoubleMeasurements(
  canvas,
  measurementRuntime,
  iterations,
) {
  if (
    layoutEditorState.enabled ||
    !isGeneratedLayoutCanvas(canvas) ||
    !measurementRuntime ||
    measurementRuntime.autoRunInProgress ||
    measurementRuntime.busy
  ) {
    return;
  }

  const path = resolveGeneratedDoubleMeasurementAutomationPath(
    canvas,
    measurementRuntime,
  );
  if (!path) {
    return;
  }

  const count = Math.max(1, Number(iterations) || 1);
  const useMachineMode = count >= 100;
  const machineDuration =
    count === 100
      ? MACHINE_DURATION_100_MS
      : count === 1000
        ? MACHINE_DURATION_1000_MS
        : null;
  const cachedStartPoints = measurementRuntime.automationStartPoints || {};
  const startPoints = {
    top: generatedAutomationStartPoint(
      canvas,
      path.topQubit,
      path.topGate,
      measurementRuntime,
      cachedStartPoints.top,
    ),
    bottom: generatedAutomationStartPoint(
      canvas,
      path.bottomQubit,
      path.bottomGate,
      measurementRuntime,
      cachedStartPoints.bottom,
    ),
  };
  measurementRuntime.automationStartPoints = {
    top: startPoints.top,
    bottom: startPoints.bottom,
  };

  measurementRuntime.autoRunInProgress = true;
  [path.topQubit, path.bottomQubit].forEach((qubitItem) => {
    qubitItem.classList.add("generated-automation-active");
  });
  if (measurementRuntime.measurementCount) {
    measurementRuntime.measurementCount.disabled = true;
  }
  try {
    if (useMachineMode) {
      let processed = 0;
      if (machineDuration !== null) {
        const runStart = performance.now();
        while (processed < count && !layoutEditorState.enabled) {
          const elapsed = performance.now() - runStart;
          const progress = Math.min(elapsed / machineDuration, 1);
          const shouldBeProcessed = Math.floor(progress * count);
          if (shouldBeProcessed <= processed) {
            await nextAnimationFrame();
            continue;
          }
          while (processed < shouldBeProcessed && processed < count) {
            runGeneratedDoubleMeasurementMachineIteration(
              path,
              measurementRuntime,
            );
            processed += 1;
          }
          updateGeneratedDoubleMeasurementTubeFills(measurementRuntime);
          await nextAnimationFrame();
        }
      } else {
        await nextAnimationFrame();
        while (processed < count && !layoutEditorState.enabled) {
          runGeneratedDoubleMeasurementMachineIteration(
            path,
            measurementRuntime,
          );
          processed += 1;
        }
      }
      updateGeneratedDoubleMeasurementTubeFills(measurementRuntime);
      resetGeneratedQubitForAutomatedRun(
        canvas,
        path.topQubit,
        startPoints.top,
      );
      resetGeneratedQubitForAutomatedRun(
        canvas,
        path.bottomQubit,
        startPoints.bottom,
      );
      return;
    }

    for (let i = 0; i < count; i += 1) {
      const completed = await runGeneratedDoubleMeasurementAnimatedIteration(
        canvas,
        path,
        measurementRuntime,
        startPoints,
      );
      if (!completed || layoutEditorState.enabled) {
        break;
      }
    }
  } finally {
    measurementRuntime.autoRunInProgress = false;
    [path.topQubit, path.bottomQubit].forEach((qubitItem) => {
      qubitItem.classList.remove("generated-automation-active");
    });
    if (measurementRuntime.measurementCount) {
      measurementRuntime.measurementCount.disabled = false;
    }
  }
}

function generatedExperimentInitialVectorMap(experiment) {
  const vectors = new Map();
  (Array.isArray(experiment?.initialQubits)
    ? experiment.initialQubits
    : []
  ).forEach((entry) => {
    if (entry?.itemId) {
      vectors.set(entry.itemId, normalizeVector2(entry.vector || [1, 0]));
    }
  });
  return vectors;
}

function generatedExperimentQubitLogicalIdMap(experiment) {
  const logicalIds = new Map();
  (Array.isArray(experiment?.initialQubits)
    ? experiment.initialQubits
    : []
  ).forEach((entry) => {
    const logicalQubitId = normalizeQubitId(entry?.logicalQubitId);
    if (entry?.itemId && logicalQubitId) {
      logicalIds.set(entry.itemId, logicalQubitId);
    }
  });
  return logicalIds;
}

function generatedExperimentGateTickMap(experiment) {
  const ticks = new Map();
  (Array.isArray(experiment?.gateSettings)
    ? experiment.gateSettings
    : []
  ).forEach((entry) => {
    if (entry?.itemId) {
      ticks.set(entry.itemId, normalizeTickIndex(entry.tickIndex || 0));
    }
  });
  return ticks;
}

function generatedLiveGateTickMap(canvas) {
  const ticks = new Map();
  if (!isGeneratedLayoutCanvas(canvas)) {
    return ticks;
  }
  generatedItemsOfType(canvas, "single-gate").forEach((item) => {
    const runtime = initializeGeneratedSingleGateItem(item, {
      singleGateTick: generatedSingleGateRuntimes.get(item)?.activeTick,
    });
    if (!runtime) {
      return;
    }
    ticks.set(
      ensureGeneratedItemId(item, "single-gate"),
      normalizeTickIndex(runtime.activeTick),
    );
  });
  return ticks;
}

function generatedReplayUsesLiveGateSettings(canvas) {
  return Boolean(
    generatedExperimentStateForCanvas(canvas)?.replayGateSettingsChanged,
  );
}

function generatedReplayOptionsForCanvas(canvas) {
  const preferLiveGateSettings = generatedReplayUsesLiveGateSettings(canvas);
  return {
    preferLiveGateSettings,
    ignoreGateSettingActions: preferLiveGateSettings,
  };
}

function generatedCurrentGateTickMap(canvas, experiment, options = {}) {
  const recordedTicks = generatedExperimentGateTickMap(experiment);
  const preferLiveGateSettings = Boolean(options.preferLiveGateSettings);
  if (preferLiveGateSettings) {
    const liveTicks = generatedLiveGateTickMap(canvas);
    if (liveTicks.size > 0) {
      return liveTicks;
    }
  }
  if (recordedTicks.size > 0) {
    return recordedTicks;
  }
  const ticks = generatedLiveGateTickMap(canvas);
  if (ticks.size > 0) {
    return ticks;
  }
  return generatedExperimentGateTickMap(experiment);
}

function applyGeneratedGateTickMapToCanvas(canvas, gateTicks) {
  if (!(gateTicks instanceof Map) || gateTicks.size === 0) {
    return;
  }
  generatedItemsOfType(canvas, "single-gate").forEach((item) => {
    const gateId = ensureGeneratedItemId(item, "single-gate");
    if (!gateTicks.has(gateId)) {
      return;
    }
    const tickIndex = normalizeTickIndex(gateTicks.get(gateId));
    const runtime = initializeGeneratedSingleGateItem(item, {
      singleGateTick: tickIndex,
    });
    setGeneratedGateRuntimeTick(runtime, tickIndex);
  });
}

function generatedGateTickForRecordedAction(action, gateTicks = new Map()) {
  if (action?.type === "gate-setting" && Number.isFinite(action?.tickIndex)) {
    return normalizeTickIndex(action.tickIndex);
  }
  if (action?.gateId && gateTicks.has(action.gateId)) {
    return normalizeTickIndex(gateTicks.get(action.gateId));
  }
  if (Number.isFinite(action?.tickIndex)) {
    return normalizeTickIndex(action.tickIndex);
  }
  return 0;
}

function generatedExperimentInitialCenterMap(experiment) {
  const centers = new Map();
  (Array.isArray(experiment?.initialQubits)
    ? experiment.initialQubits
    : []
  ).forEach((entry) => {
    if (entry?.itemId && validPoint(entry.center)) {
      centers.set(entry.itemId, { ...entry.center });
    }
  });
  return centers;
}

function resetGeneratedCanvasToExperimentStart(canvas, experiment, options = {}) {
  releaseGeneratedRuntimeSlotsForCanvas(canvas);
  const gateTicks =
    options.gateTicks instanceof Map ? options.gateTicks : null;
  applyGeneratedGateTickMapToCanvas(canvas, gateTicks);
  (Array.isArray(experiment?.initialQubits)
    ? experiment.initialQubits
    : []
  ).forEach((entry) => {
    const qubitItem = generatedItemById(canvas, entry.itemId);
    const qubitState = ensureGeneratedQubitRuntimeState(qubitItem);
    if (!qubitItem || !qubitState) {
      return;
    }
    qubitState.vector = normalizeVector2(entry.vector || [1, 0]);
    qubitState.transiting = false;
    qubitState.pairState = null;
    qubitState.pairQubitIndex = null;
    qubitState.cnotSourceSlot = null;
    qubitState.cnotPairToken = null;
    qubitState.cnotOutcomeProbabilities = null;
    qubitState.doubleMeasurementReturnPoint = null;
    settleGeneratedQubitVisualState(qubitItem);
    if (entry.center) {
      setGeneratedQubitCenter(canvas, qubitItem, entry.center.x, entry.center.y);
    }
    applyGeneratedQubitVectorVisualState(qubitItem);
  });
}

function resetGeneratedCanvasToRecordedSceneStart(
  canvas,
  experiment,
  options = {},
) {
  clearGeneratedMeasurementsForCanvas(canvas, {
    resetIterations: options.resetIterations !== false,
  });
  resetGeneratedCanvasToExperimentStart(canvas, experiment, options);
  setGeneratedExperimentPlaybackResultVisible(canvas, false);
}

function releaseGeneratedRuntimeSlotsForCanvas(canvas) {
  pruneGeneratedRuntimeState();
  Array.from(generatedCnotRuntimes.values()).forEach((runtime) => {
    if (generatedCanvasForItem(runtime.item) === canvas) {
      runtime.slotOccupants.top?.classList?.remove("generated-transit-active");
      runtime.slotOccupants.bottom?.classList?.remove(
        "generated-transit-active",
      );
      runtime.slotOccupants.top = null;
      runtime.slotOccupants.bottom = null;
    }
  });
  Array.from(generatedDoubleMeasurementRuntimes.values()).forEach((runtime) => {
    if (generatedCanvasForItem(runtime.item) === canvas) {
      runtime.slotOccupants.left?.classList?.remove("generated-transit-active");
      runtime.slotOccupants.right?.classList?.remove("generated-transit-active");
      runtime.slotOccupants.left = null;
      runtime.slotOccupants.right = null;
    }
  });
  Array.from(generatedSeparatedPairMeasurementRuntimes.values()).forEach(
    (runtime) => {
      if (generatedCanvasForItem(runtime.item) === canvas) {
        runtime.pendingMeasurements = [];
        runtime.busy = false;
        runtime.completing = false;
      }
    },
  );
}

function setGeneratedGateRuntimeTick(gateRuntime, tickIndex) {
  if (!gateRuntime) {
    return;
  }
  const normalizedTick = normalizeTickIndex(tickIndex);
  gateRuntime.activeTick = normalizedTick;
  gateRuntime.dial?.setTick(normalizedTick, {
    deferMeasurementClear: true,
    reason: "programmatic",
  });
}

function applyGeneratedRecordedGateSettingAction(canvas, action, gateTicks) {
  const tickIndex = generatedGateTickForRecordedAction(action, gateTicks);
  if (action?.gateId) {
    gateTicks.set(action.gateId, tickIndex);
  }
  const gateRuntime = initializeGeneratedSingleGateItem(
    generatedItemById(canvas, action.gateId),
    { singleGateTick: tickIndex },
  );
  if (!gateRuntime) {
    return false;
  }
  setGeneratedGateRuntimeTick(gateRuntime, tickIndex);
  return true;
}

async function replayGeneratedRecordedDragAction(canvas, action) {
  const qubitItem = generatedQubitItemForRecordedAction(
    canvas,
    action.qubitId,
    action.qubitLogicalId,
  );
  if (!qubitItem || !Array.isArray(action.path) || action.path.length < 2) {
    return true;
  }
  const points = action.path.filter(
    (point) => Number.isFinite(point?.x) && Number.isFinite(point?.y),
  );
  if (points.length < 2) {
    return true;
  }
  for (let index = 1; index < points.length; index += 1) {
    const previous = points[index - 1];
    const point = points[index];
    const dt = Math.max(35, Math.min(90, (point.t || 0) - (previous.t || 0)));
    await moveGeneratedQubitToPoint(canvas, qubitItem, point.x, point.y, dt);
  }
  settleGeneratedQubitVisualState(qubitItem);
  return true;
}

function replayGeneratedRecordedMailboxSendAction(canvas, action) {
  const qubitItem = generatedQubitItemForRecordedAction(
    canvas,
    action.qubitId,
    action.qubitLogicalId,
  );
  if (!qubitItem) {
    return true;
  }
  const mailboxItem =
    generatedItemById(canvas, action.mailboxId) ||
    findBestGeneratedMailboxForQubit(canvas, qubitItem);
  if (mailboxItem instanceof HTMLElement) {
    const label = qubitDisplayLabelForItem(qubitItem);
    setMailboxComponentStatus(mailboxItem, `Sent ${label} during replay`);
  }
  mailboxRoomConsumeSentQubit({ qubitItem });
  return true;
}

async function replayGeneratedRecordedCnotAction(canvas, action) {
  const runtime = initializeGeneratedCnotItem(
    generatedItemById(canvas, action.cnotId),
  );
  const topQubit = generatedQubitItemForRecordedAction(
    canvas,
    action.topQubitId,
    action.topQubitLogicalId,
  );
  const bottomQubit = generatedQubitItemForRecordedAction(
    canvas,
    action.bottomQubitId,
    action.bottomQubitLogicalId,
  );
  if (!runtime || !topQubit || !bottomQubit) {
    return false;
  }
  runtime.slotOccupants.top = null;
  runtime.slotOccupants.bottom = null;
  const ingressed = await Promise.all([
    runGeneratedCnotIngress(canvas, topQubit, runtime, "top"),
    runGeneratedCnotIngress(canvas, bottomQubit, runtime, "bottom"),
  ]);
  if (!ingressed.every(Boolean)) {
    return false;
  }
  if (runtime.cyclePromise) {
    return Boolean(await runtime.cyclePromise);
  }
  return Boolean(await runGeneratedCnotCycle(canvas, runtime));
}

async function replayGeneratedRecordedDoubleMeasureAction(
  canvas,
  action,
  initialCenters = new Map(),
) {
  const runtime = initializeGeneratedDoubleMeasurementItem(
    generatedItemById(canvas, action.measurementId),
  );
  const leftQubit = generatedQubitItemForRecordedAction(
    canvas,
    action.leftQubitId,
    action.leftQubitLogicalId,
  );
  const rightQubit = generatedQubitItemForRecordedAction(
    canvas,
    action.rightQubitId,
    action.rightQubitLogicalId,
  );
  if (!runtime || !leftQubit || !rightQubit) {
    return false;
  }
  const leftState = ensureGeneratedQubitRuntimeState(leftQubit);
  const rightState = ensureGeneratedQubitRuntimeState(rightQubit);
  if (!leftState || !rightState) {
    return false;
  }
  leftQubit.classList.add("generated-transit-active");
  rightQubit.classList.add("generated-transit-active");
  let cycleStarted = false;
  try {
    leftState.doubleMeasurementReturnPoint =
      validPoint(initialCenters.get(action.leftQubitId)) ||
      generatedCanvasPointForElementCenter(canvas, leftQubit);
    rightState.doubleMeasurementReturnPoint =
      validPoint(initialCenters.get(action.rightQubitId)) ||
      generatedCanvasPointForElementCenter(canvas, rightQubit);
    runtime.slotOccupants.left = leftQubit;
    runtime.slotOccupants.right = rightQubit;
    const leftCenter = generatedDoubleMeasurementSlotCenter(
      canvas,
      runtime,
      "left",
    );
    const rightCenter = generatedDoubleMeasurementSlotCenter(
      canvas,
      runtime,
      "right",
    );
    await Promise.all([
      moveGeneratedQubitToPoint(canvas, leftQubit, leftCenter.x, leftCenter.y),
      moveGeneratedQubitToPoint(canvas, rightQubit, rightCenter.x, rightCenter.y),
    ]);
    settleGeneratedQubitVisualState(leftQubit);
    settleGeneratedQubitVisualState(rightQubit);
    cycleStarted = true;
    return Boolean(await runGeneratedDoubleMeasurementCycle(canvas, runtime));
  } finally {
    if (!cycleStarted || runtime.slotOccupants.left !== leftQubit) {
      leftQubit.classList.remove("generated-transit-active");
    }
    if (!cycleStarted || runtime.slotOccupants.right !== rightQubit) {
      rightQubit.classList.remove("generated-transit-active");
    }
  }
}

async function replayGeneratedRecordedSeparatedPairMeasureAction(
  canvas,
  action,
) {
  let measurementItem = generatedItemById(canvas, action.measurementId);
  if (!(measurementItem instanceof HTMLElement)) {
    measurementItem = generatedItemsOfType(
      canvas,
      PLAYGROUND_SAVED_GROUP_COMPONENT_TYPE,
    ).find((item) => initializeGeneratedSeparatedPairMeasurementItem(item));
  }
  const runtime =
    initializeGeneratedSeparatedPairMeasurementItem(measurementItem);
  const qubitItem = generatedQubitItemForRecordedAction(
    canvas,
    action.qubitId,
    action.logicalQubitId,
  );
  if (!runtime || !qubitItem) {
    return false;
  }
  return Boolean(
    await runGeneratedSeparatedPairMeasurementTransit(
      canvas,
      qubitItem,
      runtime,
      action.magnifierIndex,
    ),
  );
}

async function replayGeneratedRecordedExperimentAnimatedIterations(
  canvas,
  experiment,
  iterations,
  initialGateTicks = null,
  options = {},
) {
  const count = Math.max(1, Number(iterations) || 1);
  const previousPlaybackSpeed = generatedExperimentPlaybackSpeed;
  generatedExperimentPlaybackSpeed =
    generatedAnimatedReplaySpeedForIterationCount(count);
  try {
    for (let run = 0; run < count; run += 1) {
      const completed = await replayGeneratedRecordedExperimentAnimated(
        canvas,
        experiment,
        initialGateTicks,
        options,
      );
      if (!completed) {
        return false;
      }
    }
  } finally {
    generatedExperimentPlaybackSpeed = previousPlaybackSpeed;
  }
  return true;
}

async function replayGeneratedRecordedExperimentControlAction(
  canvas,
  experiment,
  action,
  actionIndex,
  options = {},
) {
  if (!isGeneratedExperimentControlAction(action)) {
    return false;
  }
  const iterations = generatedExperimentReplayIterations(action);
  if (action.type === GENERATED_EXPERIMENT_COUNT_ACTION) {
    setRecordedMeasurementIterationCount(canvas, action);
    clearRecordedMeasurementForControlAction(canvas, action);
  }
  const baseExperiment = generatedExperimentBaseForControlAction(
    experiment,
    actionIndex,
  );
  if (
    !Array.isArray(baseExperiment.actions) ||
    baseExperiment.actions.length === 0
  ) {
    return false;
  }
  const baseGateTicks = generatedCurrentGateTickMap(
    canvas,
    baseExperiment,
    options,
  );
  if (generatedExperimentUsesBatchReplay(iterations)) {
    replayGeneratedRecordedExperimentFast(
      canvas,
      baseExperiment,
      iterations,
      baseGateTicks,
      options,
    );
    return true;
  }
  return replayGeneratedRecordedExperimentAnimatedIterations(
    canvas,
    baseExperiment,
    iterations,
    baseGateTicks,
    options,
  );
}

async function replayGeneratedRecordedExperimentBatchControls(
  canvas,
  experiment,
  options = {},
) {
  const actions = Array.isArray(experiment?.actions) ? experiment.actions : [];
  let replayed = false;
  for (let actionIndex = 0; actionIndex < actions.length; actionIndex += 1) {
    const action = actions[actionIndex];
    if (!isGeneratedExperimentControlAction(action)) {
      continue;
    }
    const iterations = generatedExperimentReplayIterations(action);
    if (action.type === GENERATED_EXPERIMENT_COUNT_ACTION) {
      setRecordedMeasurementIterationCount(canvas, action);
      clearRecordedMeasurementForControlAction(canvas, action);
    }
    const baseExperiment = generatedExperimentBaseForControlAction(
      experiment,
      actionIndex,
    );
    if (
      !Array.isArray(baseExperiment.actions) ||
      baseExperiment.actions.length === 0
    ) {
      return false;
    }
    replayGeneratedRecordedExperimentFast(
      canvas,
      baseExperiment,
      iterations,
      generatedCurrentGateTickMap(canvas, baseExperiment, options),
      options,
    );
    replayed = true;
  }
  return replayed;
}

async function replayGeneratedRecordedExperimentAnimated(
  canvas,
  experiment,
  initialGateTicks = null,
  options = {},
) {
  const gateTicks =
    initialGateTicks instanceof Map
      ? new Map(initialGateTicks)
      : generatedCurrentGateTickMap(canvas, experiment, options);
  resetGeneratedCanvasToExperimentStart(canvas, experiment, { gateTicks });
  const initialCenters = generatedExperimentInitialCenterMap(experiment);
  const actions = experiment.actions || [];
  for (let actionIndex = 0; actionIndex < actions.length; actionIndex += 1) {
    const action = actions[actionIndex];
    if (action.type === "drag") {
      await replayGeneratedRecordedDragAction(canvas, action);
    } else if (action.type === "mailbox-send") {
      replayGeneratedRecordedMailboxSendAction(canvas, action);
    } else if (action.type === "gate-setting") {
      if (options.ignoreGateSettingActions) {
        continue;
      }
      if (!applyGeneratedRecordedGateSettingAction(canvas, action, gateTicks)) {
        return false;
      }
    } else if (action.type === "gate") {
      const qubitItem = generatedQubitItemForRecordedAction(
        canvas,
        action.qubitId,
        action.qubitLogicalId,
      );
      const tickIndex = generatedGateTickForRecordedAction(action, gateTicks);
      const gateRuntime = initializeGeneratedSingleGateItem(
        generatedItemById(canvas, action.gateId),
        { singleGateTick: tickIndex },
      );
      if (!qubitItem || !gateRuntime) {
        return false;
      }
      setGeneratedGateRuntimeTick(gateRuntime, tickIndex);
      const completed = await runGeneratedSingleGateTransit(
        canvas,
        qubitItem,
        gateRuntime,
      );
      if (!completed) {
        return false;
      }
    } else if (action.type === "cnot") {
      const completed = await replayGeneratedRecordedCnotAction(canvas, action);
      if (!completed) {
        return false;
      }
    } else if (action.type === "single-measure") {
      const qubitItem = generatedQubitItemForRecordedAction(
        canvas,
        action.qubitId,
        action.qubitLogicalId,
      );
      const runtime = initializeGeneratedSingleMeasurementItem(
        generatedItemById(canvas, action.measurementId),
      );
      const completed = await runGeneratedSingleMeasurementTransit(
        canvas,
        qubitItem,
        runtime,
      );
      if (!completed) {
        return false;
      }
    } else if (action.type === "separated-pair-measure") {
      const completed =
        await replayGeneratedRecordedSeparatedPairMeasureAction(canvas, action);
      if (!completed) {
        return false;
      }
    } else if (action.type === "double-measure") {
      const completed = await replayGeneratedRecordedDoubleMeasureAction(
        canvas,
        action,
        initialCenters,
      );
      if (!completed) {
        return false;
      }
    } else if (isGeneratedExperimentControlAction(action)) {
      const completed = await replayGeneratedRecordedExperimentControlAction(
        canvas,
        experiment,
        action,
        actionIndex,
        options,
      );
      if (!completed) {
        return false;
      }
    }
  }
  return true;
}

function fastReplaySingleQubitState(vector) {
  return {
    numQubits: 1,
    amplitudes: normalizeVector2(vector || [1, 0]),
    qubitIds: [],
    logicalIds: [],
  };
}

function fastReplayStateForQubit(vectors, registers, qubitId, logicalQubitId) {
  const existing = registers.get(qubitId);
  if (existing?.state && Number.isInteger(existing.index)) {
    return existing;
  }
  const state = fastReplaySingleQubitState(vectors.get(qubitId) || [1, 0]);
  state.qubitIds = [qubitId];
  state.logicalIds = [logicalQubitId || null];
  const reference = { state, index: 0 };
  registers.set(qubitId, reference);
  return reference;
}

function syncFastReplayVectorsFromState(vectors, registers, state) {
  const ids = Array.isArray(state?.qubitIds) ? state.qubitIds : [];
  ids.forEach((qubitId, index) => {
    registers.set(qubitId, { state, index });
    vectors.set(qubitId, sharedRegisterMarginalVector(state, index));
  });
}

function clearFastReplayStateForQubit(registers, qubitId) {
  const reference = registers.get(qubitId);
  if (!reference?.state) {
    registers.delete(qubitId);
    return;
  }
  (reference.state.qubitIds || []).forEach((id) => {
    registers.delete(id);
  });
}

function applyGeneratedFastGateToVectorMap(
  vectors,
  registers,
  action,
  gateTicks = new Map(),
) {
  const tickIndex = generatedGateTickForRecordedAction(action, gateTicks);
  const reference = registers.get(action.qubitId);
  if (reference?.state && Number.isInteger(reference.index)) {
    sharedRegisterApplySingleGate(
      reference.state,
      reference.index,
      gateMatrixForTick(tickIndex),
    );
    syncFastReplayVectorsFromState(vectors, registers, reference.state);
    return;
  }
  vectors.set(
    action.qubitId,
    normalizeVector2(
      vectorTimesMatrix2(
        vectors.get(action.qubitId) || [1, 0],
        gateMatrixForTick(tickIndex),
      ),
    ),
  );
}

function applyGeneratedFastCnotToReplayState(
  vectors,
  registers,
  action,
  logicalQubitIds,
) {
  const topLogicalId =
    normalizeQubitId(action.topQubitLogicalId) ||
    logicalQubitIds.get(action.topQubitId);
  const bottomLogicalId =
    normalizeQubitId(action.bottomQubitLogicalId) ||
    logicalQubitIds.get(action.bottomQubitId);
  const topReference = fastReplayStateForQubit(
    vectors,
    registers,
    action.topQubitId,
    topLogicalId,
  );
  const bottomReference = fastReplayStateForQubit(
    vectors,
    registers,
    action.bottomQubitId,
    bottomLogicalId,
  );
  if (topReference.state === bottomReference.state) {
    sharedRegisterApplyCnot(
      topReference.state,
      topReference.index,
      bottomReference.index,
    );
    syncFastReplayVectorsFromState(vectors, registers, topReference.state);
    return topReference.state;
  }

  const topHasRegister = (topReference.state?.numQubits || 1) > 1;
  const bottomHasRegister = (bottomReference.state?.numQubits || 1) > 1;
  const preserveBottomRegisterOrder = bottomHasRegister && !topHasRegister;
  const firstReference = preserveBottomRegisterOrder
    ? bottomReference
    : topReference;
  const secondReference = preserveBottomRegisterOrder
    ? topReference
    : bottomReference;
  const firstRegister = registerStateAsQuantumRegister(firstReference.state);
  const secondRegister = registerStateAsQuantumRegister(secondReference.state);
  const combinedRegister = sharedRegisterTensor([firstRegister, secondRegister]);
  if (!combinedRegister) {
    return null;
  }
  const offset = firstRegister.numQubits;
  const firstIds = Array.isArray(firstReference.state.qubitIds)
    ? firstReference.state.qubitIds
    : [];
  const secondIds = Array.isArray(secondReference.state.qubitIds)
    ? secondReference.state.qubitIds
    : [];
  const firstLogicalIds = Array.isArray(firstReference.state.logicalIds)
    ? firstReference.state.logicalIds
    : [];
  const secondLogicalIds = Array.isArray(secondReference.state.logicalIds)
    ? secondReference.state.logicalIds
    : [];
  const nextState = {
    numQubits: combinedRegister.numQubits,
    amplitudes: realAmplitudesFromQuantumRegister(
      combinedRegister,
      2 ** combinedRegister.numQubits,
    ),
    displayMode: "conditional",
    qubitIds: [...firstIds, ...secondIds],
    logicalIds: [...firstLogicalIds, ...secondLogicalIds],
  };
  const controlIndex = preserveBottomRegisterOrder
    ? offset + topReference.index
    : topReference.index;
  const targetIndex = preserveBottomRegisterOrder
    ? bottomReference.index
    : offset + bottomReference.index;
  sharedRegisterApplyCnot(nextState, controlIndex, targetIndex);
  syncFastReplayVectorsFromState(vectors, registers, nextState);
  return nextState;
}

function generatedSeparatedPairRuntimeForFastAction(canvas, action) {
  let measurementItem = generatedItemById(canvas, action.measurementId);
  if (!(measurementItem instanceof HTMLElement)) {
    measurementItem = generatedItemsOfType(
      canvas,
      PLAYGROUND_SAVED_GROUP_COMPONENT_TYPE,
    ).find((item) => initializeGeneratedSeparatedPairMeasurementItem(item));
  }
  return initializeGeneratedSeparatedPairMeasurementItem(measurementItem);
}

function orderedFastSeparatedMeasurementEntries(entries, requiredCount = 2) {
  const safeRequiredCount = Math.max(2, Number(requiredCount) || 2);
  if (safeRequiredCount === 2) {
    const top = entries.find((entry) => entry.orderIndex === 0);
    const bottom = entries.find((entry) => entry.orderIndex === 1);
    if (top && bottom && top !== bottom) {
      return [top, bottom];
    }
  }
  const sorted = entries
    .slice()
    .sort(
      (a, b) =>
        (Number.isFinite(a.orderIndex) ? a.orderIndex : safeRequiredCount) -
          (Number.isFinite(b.orderIndex) ? b.orderIndex : safeRequiredCount) ||
        a.sequence - b.sequence,
    );
  const byIndex = Array.from({ length: safeRequiredCount }, (_item, index) =>
    sorted.find((entry) => entry.orderIndex === index),
  );
  if (byIndex.every(Boolean) && new Set(byIndex).size === safeRequiredCount) {
    return byIndex;
  }
  return sorted;
}

function generatedRecordedDoubleMeasureOrder(action, initialCenters = new Map()) {
  if (action?.topQubitId && action?.bottomQubitId) {
    return {
      topQubitId: action.topQubitId,
      topQubitLogicalId: action.topQubitLogicalId,
      bottomQubitId: action.bottomQubitId,
      bottomQubitLogicalId: action.bottomQubitLogicalId,
    };
  }
  const leftPoint = initialCenters.get(action?.leftQubitId);
  const rightPoint = initialCenters.get(action?.rightQubitId);
  const leftIsTop =
    validPoint(leftPoint) && validPoint(rightPoint)
      ? leftPoint.y <= rightPoint.y
      : true;
  return leftIsTop
    ? {
        topQubitId: action?.leftQubitId,
        topQubitLogicalId: action?.leftQubitLogicalId,
        bottomQubitId: action?.rightQubitId,
        bottomQubitLogicalId: action?.rightQubitLogicalId,
      }
    : {
        topQubitId: action?.rightQubitId,
        topQubitLogicalId: action?.rightQubitLogicalId,
        bottomQubitId: action?.leftQubitId,
        bottomQubitLogicalId: action?.leftQubitLogicalId,
      };
}

function replayGeneratedRecordedExperimentFast(
  canvas,
  experiment,
  iterations,
  initialGateTicks = null,
  options = {},
) {
  const measurementRuntimesToUpdate = new Set();
  const baseGateTicks =
    initialGateTicks instanceof Map
      ? new Map(initialGateTicks)
      : generatedCurrentGateTickMap(canvas, experiment, options);
  const initialCenters = generatedExperimentInitialCenterMap(experiment);
  const logicalQubitIds = generatedExperimentQubitLogicalIdMap(experiment);
  for (let run = 0; run < iterations; run += 1) {
    const vectors = generatedExperimentInitialVectorMap(experiment);
    const gateTicks = new Map(baseGateTicks);
    const registers = new Map();
    const separatedPendingByMeasurement = new Map();
    (experiment.actions || []).forEach((action) => {
      if (action.type === "gate-setting") {
        if (options.ignoreGateSettingActions) {
          return;
        }
        const tickIndex = generatedGateTickForRecordedAction(action, gateTicks);
        if (action.gateId) {
          gateTicks.set(action.gateId, tickIndex);
        }
      } else if (action.type === "gate") {
        applyGeneratedFastGateToVectorMap(
          vectors,
          registers,
          action,
          gateTicks,
        );
      } else if (action.type === "cnot") {
        applyGeneratedFastCnotToReplayState(
          vectors,
          registers,
          action,
          logicalQubitIds,
        );
      } else if (action.type === "single-measure") {
        const runtime = initializeGeneratedSingleMeasurementItem(
          generatedItemById(canvas, action.measurementId),
        );
        if (!runtime) {
          return;
        }
        let color = "blue";
        const reference = registers.get(action.qubitId);
        if (reference?.state && Number.isInteger(reference.index)) {
          const result = sharedRegisterMeasureMember(
            reference.state,
            reference.index,
          );
          color = result?.color || "blue";
          syncFastReplayVectorsFromState(vectors, registers, reference.state);
        } else {
          color = sampleSingleQubitOutcomeFromVector(
            vectors.get(action.qubitId) || [1, 0],
          );
          vectors.set(action.qubitId, color === "blue" ? [1, 0] : [0, 1]);
        }
        if (color === "blue") {
          runtime.blueTubeCount += 1;
        } else {
          runtime.redTubeCount += 1;
        }
        maybeExpandGeneratedMeasurementTubeCapacity(runtime);
        measurementRuntimesToUpdate.add(runtime);
      } else if (action.type === "separated-pair-measure") {
        const runtime = generatedSeparatedPairRuntimeForFastAction(
          canvas,
          action,
        );
        if (!runtime) {
          return;
        }
        const requiredCount = Math.max(
          2,
          forcedRegisterMeasurementQubitCountForRuntime(runtime),
          Number(action.registerQubitCount) ||
            runtime.registerQubitCount ||
            2,
        );
        const measurementId =
          action.measurementId ||
          ensureGeneratedItemId(runtime.item, "separated-pair-measurement");
        const pending =
          separatedPendingByMeasurement.get(measurementId) || [];
        let color = "blue";
        let orderIndex = Number.isFinite(action.orderIndex)
          ? clamp(Math.round(action.orderIndex), 0, requiredCount - 1)
          : null;
        let partnerId = "";
        let partnerOrderIndex = null;
        const logicalQubitId =
          normalizeQubitId(action.logicalQubitId) ||
          logicalQubitIds.get(action.qubitId);
        let partnerLogicalQubitId = normalizeQubitId(
          action.partnerLogicalQubitId,
        );
        const reference = registers.get(action.qubitId);
        if (reference?.state && Number.isInteger(reference.index)) {
          const memberIds = Array.isArray(reference.state.qubitIds)
            ? reference.state.qubitIds
            : [];
          const memberLogicalIds = Array.isArray(reference.state.logicalIds)
            ? reference.state.logicalIds
            : [];
          const partnerIndex = memberIds.findIndex((id) => id !== action.qubitId);
          if (partnerIndex >= 0) {
            partnerId = memberIds[partnerIndex] || "";
            partnerLogicalQubitId =
              partnerLogicalQubitId || memberLogicalIds[partnerIndex] || null;
            partnerOrderIndex = partnerIndex;
          }
          orderIndex = Number.isFinite(orderIndex)
            ? orderIndex
            : reference.index;
          const result = sharedRegisterMeasureMember(
            reference.state,
            reference.index,
          );
          color = result?.color || "blue";
          syncFastReplayVectorsFromState(vectors, registers, reference.state);
        } else {
          color = sampleSingleQubitOutcomeFromVector(
            vectors.get(action.qubitId) || [1, 0],
          );
          vectors.set(action.qubitId, color === "blue" ? [1, 0] : [0, 1]);
          clearFastReplayStateForQubit(registers, action.qubitId);
        }

        if (!Number.isFinite(orderIndex)) {
          const expectedFromPending = pending.find(
            (entry) => entry.partnerId === action.qubitId,
          );
          if (Number.isFinite(expectedFromPending?.partnerOrderIndex)) {
            orderIndex = clamp(
              Math.round(expectedFromPending.partnerOrderIndex),
              0,
              requiredCount - 1,
            );
          } else if (
            pending.length === 1 &&
            Number.isFinite(pending[0].orderIndex) &&
            requiredCount === 2
          ) {
            orderIndex = pending[0].orderIndex === 0 ? 1 : 0;
          } else {
            const used = new Set(
              pending
                .map((entry) => entry.orderIndex)
                .filter(
                  (candidate) =>
                    Number.isInteger(candidate) &&
                    candidate >= 0 &&
                    candidate < requiredCount,
                ),
            );
            orderIndex = 0;
            for (let index = 0; index < requiredCount; index += 1) {
              if (!used.has(index)) {
                orderIndex = index;
                break;
              }
            }
          }
        }

        const nextPending = pending
          .filter((entry) => entry.qubitId !== action.qubitId)
          .concat({
            qubitId: action.qubitId,
            logicalQubitId,
            color,
            orderIndex,
            partnerId,
            partnerLogicalQubitId,
            partnerOrderIndex,
            sequence: pending.length + 1,
          })
          .slice(-requiredCount);
        if (nextPending.length >= requiredCount) {
          const outcomeEntries = orderedFastSeparatedMeasurementEntries(
            nextPending,
            requiredCount,
          );
          const outcome = separatedMeasurementOutcomeKeyFromEntries(
            runtime,
            outcomeEntries.slice(0, requiredCount),
          );
          runtime.tubeCounts[outcome] += 1;
          maybeExpandGeneratedDoubleMeasurementTubeCapacity(runtime);
          measurementRuntimesToUpdate.add(runtime);
          separatedPendingByMeasurement.set(measurementId, []);
        } else {
          separatedPendingByMeasurement.set(measurementId, nextPending);
        }
      } else if (action.type === "double-measure") {
        const runtime = initializeGeneratedDoubleMeasurementItem(
          generatedItemById(canvas, action.measurementId),
        );
        if (!runtime) {
          return;
        }
        const qubitOrder = generatedRecordedDoubleMeasureOrder(
          action,
          initialCenters,
        );
        const topReference = registers.get(qubitOrder.topQubitId);
        const bottomReference = registers.get(qubitOrder.bottomQubitId);
        let argumentOutcome = "bb";
        if (
          topReference?.state &&
          topReference.state === bottomReference?.state &&
          Number.isInteger(topReference.index) &&
          Number.isInteger(bottomReference.index)
        ) {
          argumentOutcome = samplePairOutcomeForRegisterMembers(
            topReference.state,
            topReference.index,
            bottomReference.index,
          );
          collapseRegisterStateMembersToOutcome(
            topReference.state,
            topReference.index,
            bottomReference.index,
            argumentOutcome,
          );
          syncFastReplayVectorsFromState(vectors, registers, topReference.state);
        } else {
          argumentOutcome = samplePairOutcomeFromEntangledState({
            amplitudes: entangledAmplitudesFromQubitVectors(
              vectors.get(qubitOrder.topQubitId) || [1, 0],
              vectors.get(qubitOrder.bottomQubitId) || [1, 0],
            ),
          });
          clearFastReplayStateForQubit(registers, qubitOrder.topQubitId);
          clearFastReplayStateForQubit(registers, qubitOrder.bottomQubitId);
        }
        runtime.tubeCounts[argumentOutcome] += 1;
        maybeExpandGeneratedDoubleMeasurementTubeCapacity(runtime);
        measurementRuntimesToUpdate.add(runtime);
        vectors.set(
          qubitOrder.topQubitId,
          argumentOutcome[0] === "b" ? [1, 0] : [0, 1],
        );
        vectors.set(
          qubitOrder.bottomQubitId,
          argumentOutcome[1] === "b" ? [1, 0] : [0, 1],
        );
      }
    });
  }
  measurementRuntimesToUpdate.forEach((runtime) => {
    if (runtime.tubeCounts) {
      updateGeneratedDoubleMeasurementTubeFills(runtime);
    } else {
      updateGeneratedMeasurementTubeFills(runtime);
    }
  });
}

function generatedSingleGateEjectedCenter(canvas, qubitItem, gateRuntime) {
  if (!gateRuntime?.gateWindow || !qubitItem) {
    return null;
  }
  const gateCenter = generatedCanvasPointForElementCenter(
    canvas,
    gateRuntime.ticksWrap,
  );
  return {
    x:
      generatedCanvasXForElementRight(canvas, gateRuntime.gateWindow) +
      100 +
      qubitItem.offsetWidth / 2,
    y: gateCenter.y,
  };
}

function generatedCnotEjectedCenters(canvas, topQubit, bottomQubit, runtime) {
  if (!runtime?.body || !runtime.windowTop || !runtime.windowBottom) {
    return null;
  }
  const bodyRight = generatedCanvasXForElementRight(canvas, runtime.body);
  const topWindowCenter = generatedCanvasPointForElementCenter(
    canvas,
    runtime.windowTop,
  );
  const bottomWindowCenter = generatedCanvasPointForElementCenter(
    canvas,
    runtime.windowBottom,
  );
  return {
    top: {
      x: bodyRight + 50 + topQubit.offsetWidth / 2,
      y: topWindowCenter.y,
    },
    bottom: {
      x: bodyRight + 50 + bottomQubit.offsetWidth / 2,
      y: bottomWindowCenter.y,
    },
  };
}

function applyGeneratedRecordedExperimentStaticFinalVisualState(
  canvas,
  experiment,
  initialGateTicks = null,
  options = {},
) {
  const gateTicks =
    initialGateTicks instanceof Map
      ? new Map(initialGateTicks)
      : generatedCurrentGateTickMap(canvas, experiment, options);
  resetGeneratedCanvasToExperimentStart(canvas, experiment, { gateTicks });
  const initialCenters = generatedExperimentInitialCenterMap(experiment);
  (experiment.actions || []).forEach((action) => {
    if (action.type === "drag") {
      const qubitItem = generatedQubitItemForRecordedAction(
        canvas,
        action.qubitId,
        action.qubitLogicalId,
      );
      const points = Array.isArray(action.path)
        ? action.path.filter((point) => validPoint(point))
        : [];
      const finalPoint = points[points.length - 1];
      if (qubitItem && finalPoint) {
        setGeneratedQubitCenter(canvas, qubitItem, finalPoint.x, finalPoint.y);
        settleGeneratedQubitVisualState(qubitItem);
      }
      return;
    }
    if (action.type === "mailbox-send") {
      replayGeneratedRecordedMailboxSendAction(canvas, action);
      return;
    }
    if (action.type === "gate-setting") {
      if (options.ignoreGateSettingActions) {
        return;
      }
      applyGeneratedRecordedGateSettingAction(canvas, action, gateTicks);
      return;
    }
    if (action.type === "gate") {
      const qubitItem = generatedQubitItemForRecordedAction(
        canvas,
        action.qubitId,
        action.qubitLogicalId,
      );
      const tickIndex = generatedGateTickForRecordedAction(action, gateTicks);
      const gateRuntime = initializeGeneratedSingleGateItem(
        generatedItemById(canvas, action.gateId),
        { singleGateTick: tickIndex },
      );
      if (!qubitItem || !gateRuntime) {
        return;
      }
      setGeneratedGateRuntimeTick(gateRuntime, tickIndex);
      applyGeneratedSingleGateToQubitState(qubitItem, tickIndex);
      const ejectedCenter = generatedSingleGateEjectedCenter(
        canvas,
        qubitItem,
        gateRuntime,
      );
      if (ejectedCenter) {
        setGeneratedQubitCenter(
          canvas,
          qubitItem,
          ejectedCenter.x,
          ejectedCenter.y,
        );
      }
      settleGeneratedQubitVisualState(qubitItem);
      return;
    }
    if (action.type === "cnot") {
      const runtime = initializeGeneratedCnotItem(
        generatedItemById(canvas, action.cnotId),
      );
      const topQubit = generatedQubitItemForRecordedAction(
        canvas,
        action.topQubitId,
        action.topQubitLogicalId,
      );
      const bottomQubit = generatedQubitItemForRecordedAction(
        canvas,
        action.bottomQubitId,
        action.bottomQubitLogicalId,
      );
      if (!runtime || !topQubit || !bottomQubit) {
        return;
      }
      applyGeneratedCnotToQubitStates(topQubit, bottomQubit);
      const ejectedCenters = generatedCnotEjectedCenters(
        canvas,
        topQubit,
        bottomQubit,
        runtime,
      );
      if (ejectedCenters) {
        setGeneratedQubitCenter(
          canvas,
          topQubit,
          ejectedCenters.top.x,
          ejectedCenters.top.y,
        );
        setGeneratedQubitCenter(
          canvas,
          bottomQubit,
          ejectedCenters.bottom.x,
          ejectedCenters.bottom.y,
        );
      }
      settleGeneratedQubitVisualState(topQubit);
      settleGeneratedQubitVisualState(bottomQubit);
      return;
    }
    if (action.type === "single-measure") {
      const qubitItem = generatedQubitItemForRecordedAction(
        canvas,
        action.qubitId,
        action.qubitLogicalId,
      );
      const runtime = initializeGeneratedSingleMeasurementItem(
        generatedItemById(canvas, action.measurementId),
      );
      const lensCircle = generatedLensCircle(runtime);
      if (!qubitItem || !runtime || !lensCircle) {
        return;
      }
      const lensCenter = generatedViewportPointToCanvasPoint(
        canvas,
        lensCircle.x,
        lensCircle.y,
      );
      collapseGeneratedQubitState(qubitItem);
      setGeneratedQubitCenter(canvas, qubitItem, lensCenter.x + 100, lensCenter.y);
      settleGeneratedQubitVisualState(qubitItem);
      return;
    }
    if (action.type === "double-measure") {
      const leftQubit = generatedQubitItemForRecordedAction(
        canvas,
        action.leftQubitId,
        action.leftQubitLogicalId,
      );
      const rightQubit = generatedQubitItemForRecordedAction(
        canvas,
        action.rightQubitId,
        action.rightQubitLogicalId,
      );
      const qubitOrder = generatedRecordedDoubleMeasureOrder(
        action,
        initialCenters,
      );
      const topQubit = generatedQubitItemForRecordedAction(
        canvas,
        qubitOrder.topQubitId,
        qubitOrder.topQubitLogicalId,
      );
      const bottomQubit = generatedQubitItemForRecordedAction(
        canvas,
        qubitOrder.bottomQubitId,
        qubitOrder.bottomQubitLogicalId,
      );
      if (topQubit && bottomQubit) {
        collapseGeneratedQubitPairFromCnot(topQubit, bottomQubit);
      }
      [
        [leftQubit, initialCenters.get(action.leftQubitId)],
        [rightQubit, initialCenters.get(action.rightQubitId)],
      ].forEach(([qubitItem, point]) => {
        if (qubitItem && validPoint(point)) {
          setGeneratedQubitCenter(canvas, qubitItem, point.x, point.y);
          settleGeneratedQubitVisualState(qubitItem);
        }
      });
      return;
    }
    if (action.type === "separated-pair-measure") {
      const measurementItem =
        generatedItemById(canvas, action.measurementId) ||
        generatedItemsOfType(canvas, PLAYGROUND_SAVED_GROUP_COMPONENT_TYPE).find(
          (item) => initializeGeneratedSeparatedPairMeasurementItem(item),
        );
      const runtime =
        initializeGeneratedSeparatedPairMeasurementItem(measurementItem);
      const qubitItem = generatedQubitItemForRecordedAction(
        canvas,
        action.qubitId,
        action.logicalQubitId,
      );
      const target = generatedSeparatedPairMeasurementTargetForQubit(
        canvas,
        qubitItem,
        runtime,
        action.magnifierIndex,
      );
      if (!runtime || !qubitItem || !target) {
        return;
      }
      const orderIndex = generatedSeparatedPairOrderIndexForQubit(
        canvas,
        runtime,
        qubitItem,
        ensureGeneratedQubitRuntimeState(qubitItem),
      );
      collapseGeneratedQubitState(qubitItem);
      const ejectionPoint = generatedSeparatedPairMeasurementEjectionPoint(
        canvas,
        target,
        qubitItem,
        orderIndex,
        runtime.registerQubitCount,
      );
      setGeneratedQubitCenter(canvas, qubitItem, ejectionPoint.x, ejectionPoint.y);
      settleGeneratedQubitVisualState(qubitItem);
    }
  });
}

async function replayGeneratedRecordedExperimentFastWithFinalVisualState(
  canvas,
  experiment,
  iterations,
  initialGateTicks = null,
  options = {},
) {
  replayGeneratedRecordedExperimentFast(
    canvas,
    experiment,
    iterations,
    initialGateTicks,
    options,
  );
  applyGeneratedRecordedExperimentStaticFinalVisualState(
    canvas,
    experiment,
    initialGateTicks,
    options,
  );
  return true;
}

async function runGeneratedRecordedExperiment(canvas, iterations) {
  const state = generatedExperimentStateForCanvas(canvas);
  const experiment = cloneGeneratedExperiment(state?.experiment);
  if (
    !state ||
    state.recording ||
    state.playing ||
    !experiment ||
    !Array.isArray(experiment.actions) ||
    experiment.actions.length === 0 ||
    layoutEditorState.enabled
  ) {
    return false;
  }
  const count = Math.max(1, Number(iterations) || 1);
  const replayOptions = generatedReplayOptionsForCanvas(canvas);
  const initialGateTicks = generatedCurrentGateTickMap(
    canvas,
    experiment,
    replayOptions,
  );
  const hasControlActions = generatedExperimentHasControlActions(experiment);
  state.playbackResultVisible = false;
  state.playing = true;
  updateGeneratedExperimentToolbar(canvas);
  try {
    if (generatedExperimentHasBatchControlActions(experiment)) {
      const completed = await replayGeneratedRecordedExperimentBatchControls(
        canvas,
        experiment,
        replayOptions,
      );
      if (completed) {
        applyGeneratedRecordedExperimentStaticFinalVisualState(
          canvas,
          experiment,
          initialGateTicks,
          replayOptions,
        );
      }
      return completed;
    }
    if (generatedExperimentUsesBatchReplay(count) && !hasControlActions) {
      return await replayGeneratedRecordedExperimentFastWithFinalVisualState(
        canvas,
        experiment,
        count,
        initialGateTicks,
        replayOptions,
      );
    }
    return await replayGeneratedRecordedExperimentAnimatedIterations(
      canvas,
      experiment,
      count,
      initialGateTicks,
      replayOptions,
    );
  } finally {
    state.playing = false;
    updateGeneratedExperimentToolbar(canvas);
  }
}

function moveGeneratedQubitToPoint(
  canvas,
  qubitItem,
  x,
  y,
  duration = AUTO_TRAVEL_MS,
) {
  return new Promise((resolve) => {
    const core = getGeneratedQubitCore(qubitItem);
    const moveDuration = scaledGeneratedDuration(duration);
    qubitItem.style.setProperty("--move-duration", `${moveDuration}ms`);
    qubitItem.classList.add("migrating");
    if (core instanceof HTMLElement) {
      core.style.setProperty("--move-duration", `${moveDuration}ms`);
      core.classList.add("migrating");
    }
    qubitItem.getBoundingClientRect();
    setGeneratedQubitCenter(canvas, qubitItem, x, y);
    window.setTimeout(resolve, moveDuration);
  });
}

function beginGeneratedRuntimeQubitDrag(item, event) {
  if (!isGeneratedQubitItem(item)) {
    return;
  }
  const canvas = generatedCanvasForItem(item);
  if (!generatedCanvasAllowsRuntime(canvas)) {
    return;
  }
  const state = ensureGeneratedQubitRuntimeState(item);
  const experimentState = generatedExperimentStateForCanvas(canvas);
  if (
    !canvas ||
    state?.transiting ||
    experimentState?.playing ||
    !isPrimaryMouseButton(event)
  ) {
    return;
  }
  const point = getPointer(event);
  if (!point) {
    return;
  }
  bringGeneratedItemToFront(item);
  releaseGeneratedQubitFromCnotSlots(item);
  releaseGeneratedQubitFromDoubleMeasurementSlots(item);
  const pointerCanvasPoint = generatedViewportPointToCanvasPoint(
    canvas,
    point.clientX,
    point.clientY,
  );
  const itemBounds = generatedCanvasBoundsForElement(canvas, item);
  const initialRecordPoint = generatedItemCenterSnapshot(canvas, item);
  generatedRuntimeDrag = {
    canvas,
    item,
    startPoint: generatedCanvasPointForElementCenter(canvas, item),
    pointerOffsetX: pointerCanvasPoint.x - (itemBounds?.left || 0),
    pointerOffsetY: pointerCanvasPoint.y - (itemBounds?.top || 0),
    initialRecordPoint,
    recordingPath: experimentState?.recording && initialRecordPoint
      ? [
          {
            ...initialRecordPoint,
            t: 0,
          },
        ]
      : null,
    recordingStartedAt: experimentState?.startedAt || performance.now(),
  };
  item.classList.add("dragging");
  event.preventDefault();
  event.stopPropagation();
}

function continueGeneratedRuntimeGesture(event) {
  const gesture = generatedRuntimeDrag;
  if (!gesture || !generatedCanvasAllowsRuntime(gesture.canvas)) {
    return;
  }
  const point = getPointer(event);
  if (!point) {
    return;
  }
  if (event.touches) {
    event.preventDefault();
  }
  startGeneratedDragRecordingIfNeeded(gesture);
  const pointerCanvasPoint = generatedViewportPointToCanvasPoint(
    gesture.canvas,
    point.clientX,
    point.clientY,
  );
  const left = pointerCanvasPoint.x - gesture.pointerOffsetX;
  const top = pointerCanvasPoint.y - gesture.pointerOffsetY;
  const clamped = generatedLayoutClampItemPosition(
    gesture.canvas,
    gesture.item,
    left,
    top,
  );
  gesture.item.style.left = `${Math.round(clamped.left)}px`;
  gesture.item.style.top = `${Math.round(clamped.top)}px`;
  appendGeneratedDragRecordPoint(gesture);
  if (maybeSnapGeneratedQubitToSingleGate(gesture.item)) {
    return;
  }
  if (maybeSnapGeneratedQubitToCnot(gesture.item)) {
    return;
  }
  if (maybeSnapGeneratedQubitToDoubleMeasurement(gesture.item)) {
    return;
  }
  if (maybeSnapGeneratedQubitToSeparatedPairMeasurement(gesture.item)) {
    return;
  }
  if (maybeSnapGeneratedQubitToSingleMeasurement(gesture.item)) {
    return;
  }
  maybeSnapGeneratedQubitToMailbox(gesture.item);
}

function endGeneratedRuntimeGesture() {
  const gesture = generatedRuntimeDrag;
  if (!gesture) {
    return;
  }
  gesture.item.classList.remove("dragging");
  const left = parseLayoutNumeric(gesture.item.style.left, 0);
  const top = parseLayoutNumeric(gesture.item.style.top, 0);
  const clamped = generatedLayoutClampItemPosition(
    gesture.canvas,
    gesture.item,
    left,
    top,
  );
  gesture.item.style.left = `${Math.round(clamped.left)}px`;
  gesture.item.style.top = `${Math.round(clamped.top)}px`;
  commitGeneratedDragRecord(gesture);
  if (generatedCanvasAllowsRuntime(gesture.canvas)) {
    const snapped =
      maybeSnapGeneratedQubitToSingleGate(gesture.item) ||
      maybeSnapGeneratedQubitToCnot(gesture.item) ||
      maybeSnapGeneratedQubitToDoubleMeasurement(gesture.item) ||
      maybeSnapGeneratedQubitToSeparatedPairMeasurement(gesture.item) ||
      maybeSnapGeneratedQubitToSingleMeasurement(gesture.item);
    if (!snapped) {
      maybeSnapGeneratedQubitToMailbox(gesture.item);
    }
  }
  generatedRuntimeDrag = null;
}

function continueGeneratedGateDialDrag(event) {
  pruneGeneratedRuntimeState();
  Array.from(generatedSingleGateRuntimes.values()).forEach((runtime) => {
    const canvas = generatedCanvasForItem(runtime.item);
    if (!generatedCanvasAllowsGateDialInteraction(canvas)) {
      return;
    }
    runtime.dial?.continueDrag(event);
  });
}

function endGeneratedGateDialDrag() {
  pruneGeneratedRuntimeState();
  Array.from(generatedSingleGateRuntimes.values()).forEach((runtime) => {
    runtime.dial?.endDrag();
  });
}

function pointerInsideElementBounds(element, point, padding = 0) {
  if (!(element instanceof Element) || !point) {
    return false;
  }
  const rect = element.getBoundingClientRect();
  return (
    point.clientX >= rect.left - padding &&
    point.clientX <= rect.right + padding &&
    point.clientY >= rect.top - padding &&
    point.clientY <= rect.bottom + padding
  );
}

function pointerInsideGeneratedGateDial(item, point) {
  if (
    !(item instanceof HTMLElement) ||
    item.dataset.component !== "single-gate"
  ) {
    return false;
  }
  const arrowLayer = item.querySelector(".arrow-layer");
  const ticksWrap = item.querySelector('[data-role="ticks"]');
  return (
    pointerInsideElementBounds(arrowLayer, point, 2) ||
    pointerInsideElementBounds(ticksWrap, point, 2)
  );
}

function generatedSingleGateItemForDialEvent(canvas, origin, point) {
  const originItem =
    origin instanceof Element ? origin.closest(".playground-node") : null;
  if (
    originItem instanceof HTMLElement &&
    originItem.parentElement === canvas &&
    originItem.dataset.component === "single-gate" &&
    pointerInsideGeneratedGateDial(originItem, point)
  ) {
    return originItem;
  }
  return (
    generatedItemsOfType(canvas, "single-gate").find((item) =>
      pointerInsideGeneratedGateDial(item, point),
    ) || null
  );
}

function beginGeneratedGateDialGestureFromEvent(event) {
  if (!isPrimaryMouseButton(event)) {
    return;
  }
  const canvas = generatedLayoutCanvasForEvent(event);
  const point = generatedLayoutPointer(event);
  if (!canvas || !point || !generatedCanvasAllowsGateDialInteraction(canvas)) {
    return;
  }
  const item = generatedSingleGateItemForDialEvent(canvas, event.target, point);
  if (!item) {
    return;
  }
  if (layoutEditorState.enabled) {
    setSelectedGeneratedLayoutItem(item);
  }
  const runtime = initializeGeneratedSingleGateItem(item, {
    singleGateTick: generatedSingleGateRuntimes.get(item)?.activeTick,
  });
  runtime?.dial?.beginDrag(event);
}

function beginGeneratedLayoutEditGesture(event) {
  if (!layoutEditorState.enabled || !isPrimaryMouseButton(event)) {
    return;
  }
  const canvas = generatedLayoutCanvasForEvent(event);
  const point = generatedLayoutPointer(event);
  if (!canvas || !point) {
    return;
  }
  prepareGeneratedLayoutCanvas(canvas);
  const startCanvasPoint = generatedViewportPointToCanvasPoint(
    canvas,
    point.clientX,
    point.clientY,
  );
  const origin = event.target;
  if (!(origin instanceof Element)) {
    return;
  }
  const originItem = origin.closest(".playground-node");
  const gateDialControl = origin.closest(
    '[data-role="gate-arrow"], .arrow-layer, .tick',
  );
  if (
    originItem instanceof HTMLElement &&
    originItem.parentElement === canvas &&
    originItem.dataset.component === "single-gate" &&
    (gateDialControl instanceof Element ||
      pointerInsideGeneratedGateDial(originItem, point))
  ) {
    setSelectedGeneratedLayoutItem(originItem);
    const runtime = initializeGeneratedSingleGateItem(originItem, {
      singleGateTick: generatedSingleGateRuntimes.get(originItem)?.activeTick,
    });
    runtime?.dial?.beginDrag(event);
    return;
  }
  if (
    originItem instanceof HTMLElement &&
    originItem.parentElement === canvas &&
    originItem.dataset.component === "double-measurement" &&
    !pointerNearResizeCorner(originItem, point, 22)
  ) {
    const behindItem = layoutItemBehindPoint(canvas, originItem, point);
    if (behindItem?.dataset?.component === "qubit") {
      setSelectedGeneratedLayoutItem(behindItem);
      const behindLeft = parseLayoutNumeric(behindItem.style.left, 0);
      const behindTop = parseLayoutNumeric(behindItem.style.top, 0);
      generatedLayoutGesture = {
        mode: "item-move",
        canvas,
        item: behindItem,
        startX: point.clientX,
        startY: point.clientY,
        startCanvasX: startCanvasPoint.x,
        startCanvasY: startCanvasPoint.y,
        startLeft: behindLeft,
        startTop: behindTop,
        pointerOffsetX: startCanvasPoint.x - behindLeft,
        pointerOffsetY: startCanvasPoint.y - behindTop,
        startWidth: behindItem.offsetWidth,
        startHeight: behindItem.offsetHeight,
        minWidth: minGeneratedLayoutSizeForType(behindItem.dataset.component)
          .minWidth,
        minHeight: minGeneratedLayoutSizeForType(behindItem.dataset.component)
          .minHeight,
      };
      behindItem.classList.add("dragging");
      event.preventDefault();
      event.stopPropagation();
      return;
    }
  }
  const measurementPart = origin.closest("[data-playground-measurement-part]");
  if (
    workshopEditorMode === "component" &&
    measurementPart instanceof HTMLElement &&
    measurementPart.closest(".generated-layout-canvas") === canvas
  ) {
    const item = measurementPart.closest(".playground-node");
    if (!(item instanceof HTMLElement)) {
      return;
    }
    setSelectedGeneratedLayoutItem(item, measurementPart);
    const canResize = measurementPart.dataset.layoutResizable === "true";
    const isResizeHandle =
      origin.closest(".layout-resize-handle") ||
      pointerNearResizeCorner(measurementPart, point, 18);
    const initialTranslate = layoutTargetTranslate(measurementPart);
    generatedLayoutGesture = {
      mode: canResize && isResizeHandle ? "part-resize" : "part-move",
      canvas,
      item,
      part: measurementPart,
      startX: point.clientX,
      startY: point.clientY,
      startCanvasX: startCanvasPoint.x,
      startCanvasY: startCanvasPoint.y,
      startTx: initialTranslate.x,
      startTy: initialTranslate.y,
      startWidth: measurementPart.offsetWidth,
      startHeight: measurementPart.offsetHeight,
      uniformResize: measurementPart.dataset.layoutUniformResize === "true",
      minWidth: parseLayoutNumeric(measurementPart.dataset.layoutMinWidth, 24),
      minHeight: parseLayoutNumeric(
        measurementPart.dataset.layoutMinHeight,
        24,
      ),
    };
    measurementPart.classList.add("layout-edit-dragging");
    event.preventDefault();
    event.stopPropagation();
    return;
  }

  const item = origin.closest(".playground-node");
  if (!(item instanceof HTMLElement) || item.parentElement !== canvas) {
    return;
  }
  let targetItem = item;
  if (
    item.dataset.component === "double-measurement" &&
    !origin.closest(
      "[data-playground-measurement-part], .layout-resize-handle",
    ) &&
    !pointerNearResizeCorner(item, point, 22)
  ) {
    const behindItem = layoutItemBehindPoint(canvas, item, point);
    if (behindItem) {
      targetItem = behindItem;
    }
  }
  setSelectedGeneratedLayoutItem(targetItem);
  const textBoxBodyEditTarget = Boolean(
    targetItem.dataset.component === "text-box" &&
      origin.closest('[data-role="text-box-body"]'),
  );
  const itemBounds = generatedCanvasBoundsForElement(canvas, targetItem);
  const isResizeHandle =
    origin.closest(".layout-resize-handle") ||
    pointerNearResizeCorner(targetItem, point, 22);
  const mode = isResizeHandle ? "item-resize" : "item-move";
  generatedLayoutGesture = {
    mode,
    canvas,
    item: targetItem,
    startX: point.clientX,
    startY: point.clientY,
    startCanvasX: startCanvasPoint.x,
    startCanvasY: startCanvasPoint.y,
    startLeft: parseLayoutNumeric(targetItem.style.left, 0),
    startTop: parseLayoutNumeric(targetItem.style.top, 0),
    pointerOffsetX: startCanvasPoint.x - (itemBounds?.left || 0),
    pointerOffsetY: startCanvasPoint.y - (itemBounds?.top || 0),
    startWidth: targetItem.offsetWidth,
    startHeight: targetItem.offsetHeight,
    aspectRatio:
      targetItem.offsetHeight > 0
        ? targetItem.offsetWidth / targetItem.offsetHeight
        : 1,
    cnotBaseline:
      mode === "item-resize" ? captureCnotGeometryBaseline(targetItem) : null,
  };
  targetItem.classList.add(mode === "item-resize" ? "resizing" : "dragging");
  if (textBoxBodyEditTarget && mode === "item-move") {
    event.stopPropagation();
    return;
  }
  event.preventDefault();
  event.stopPropagation();
}

function continueGeneratedLayoutEditGesture(event) {
  const gesture = generatedLayoutGesture;
  if (!gesture) {
    return;
  }
  const point = generatedLayoutPointer(event);
  if (!point) {
    return;
  }
  const currentCanvasPoint = generatedViewportPointToCanvasPoint(
    gesture.canvas,
    point.clientX,
    point.clientY,
  );
  const startCanvasPoint =
    Number.isFinite(gesture.startCanvasX) &&
    Number.isFinite(gesture.startCanvasY)
      ? { x: gesture.startCanvasX, y: gesture.startCanvasY }
      : generatedViewportPointToCanvasPoint(
          gesture.canvas,
          gesture.startX,
          gesture.startY,
        );
  const dx = currentCanvasPoint.x - startCanvasPoint.x;
  const dy = currentCanvasPoint.y - startCanvasPoint.y;
  if (Math.abs(dx) > 0.5 || Math.abs(dy) > 0.5) {
    gesture.edited = true;
  }
  if (gesture.mode === "part-resize") {
    let nextWidth = Math.max(gesture.minWidth, gesture.startWidth + dx);
    let nextHeight = Math.max(gesture.minHeight, gesture.startHeight + dy);
    if (gesture.uniformResize) {
      const uniformSize = Math.max(
        nextWidth,
        nextHeight,
        gesture.minWidth,
        gesture.minHeight,
      );
      nextWidth = uniformSize;
      nextHeight = uniformSize;
    }
    gesture.part.style.width = `${Math.round(nextWidth)}px`;
    gesture.part.style.height = `${Math.round(nextHeight)}px`;
    setLayoutManualEdited(gesture.part, true);
  } else if (gesture.mode === "part-move") {
    setLayoutTargetTranslate(
      gesture.part,
      gesture.startTx + dx,
      gesture.startTy + dy,
    );
    setLayoutManualEdited(gesture.part, true);
  } else if (gesture.mode === "item-resize") {
    let nextWidth = gesture.startWidth + dx;
    let nextHeight = gesture.startHeight + dy;
    if (gesture.item.dataset.component === "qubit") {
      const uniform = Math.max(nextWidth, nextHeight);
      nextWidth = uniform;
      nextHeight = uniform;
    }
    const clamped = generatedLayoutClampItemSize(
      gesture.canvas,
      gesture.item,
      nextWidth,
      nextHeight,
    );
    gesture.item.style.width = `${Math.round(clamped.width)}px`;
    gesture.item.style.height = `${Math.round(clamped.height)}px`;
    applyCnotGeometryScale(
      gesture.item,
      gesture.cnotBaseline,
      clamped.width,
      clamped.height,
    );
    layoutGeneratedSingleGateDials(gesture.canvas);
    setLayoutManualEdited(gesture.item, true);
  } else {
    const nextLeft = currentCanvasPoint.x - gesture.pointerOffsetX;
    const nextTop = currentCanvasPoint.y - gesture.pointerOffsetY;
    const clamped = generatedLayoutClampItemPosition(
      gesture.canvas,
      gesture.item,
      nextLeft,
      nextTop,
    );
    gesture.item.style.left = `${Math.round(clamped.left)}px`;
    gesture.item.style.top = `${Math.round(clamped.top)}px`;
    setLayoutManualEdited(gesture.item, true);
  }
  if (event.touches || gesture.item?.dataset?.component === "text-box") {
    event.preventDefault();
  }
}

function endGeneratedLayoutEditGesture() {
  const gesture = generatedLayoutGesture;
  if (!gesture) {
    return;
  }
  const canvas = gesture.canvas;
  if (gesture.part) {
    gesture.part.classList.remove("layout-edit-dragging");
  }
  if (gesture.item) {
    gesture.item.classList.remove("dragging", "resizing");
  }
  generatedLayoutGesture = null;
  if (isDocumentEditorCanvas(canvas)) {
    if (gesture.edited) {
      markDocumentEditorCanvasEdited(canvas);
    }
    saveCurrentDocumentEditorScene();
    updateDocEditorButtons();
  }
}

function orderedTabButtons() {
  if (tabStrip instanceof HTMLElement) {
    return Array.from(tabStrip.querySelectorAll(".tab-btn")).filter(
      (button) => button instanceof HTMLButtonElement,
    );
  }
  return tabButtons;
}

function syncTabButtonsFromDom() {
  tabButtons.splice(0, tabButtons.length, ...orderedTabButtons());
}

function generatedTabInsertionPoint() {
  return null;
}

function clearGeneratedTabDragClasses() {
  orderedTabButtons().forEach((button) => {
    button.classList.remove(
      "tab-dragging",
      "tab-drop-before",
      "tab-drop-after",
    );
  });
}

function generatedTabButtonForId(tabId) {
  if (!tabId) {
    return null;
  }
  const button = document.getElementById(`tab-${tabId}`);
  return button instanceof HTMLButtonElement ? button : null;
}

function generatedTabButtonsExcluding(tabId = "") {
  return orderedTabButtons().filter(
    (button) =>
      button.dataset.generatedTab === "true" &&
      button.dataset.tabTarget &&
      button.dataset.tabTarget !== tabId,
  );
}

function applyGeneratedTabDropCue(placement, sourceId = "") {
  clearGeneratedTabDragClasses();
  if (!placement) {
    return;
  }
  if (!placement.targetId) {
    const lastGenerated = generatedTabButtonsExcluding(sourceId).at(-1);
    lastGenerated?.classList.add("tab-drop-after");
    return;
  }
  const targetButton = generatedTabButtonForId(placement.targetId);
  targetButton?.classList.add(
    placement.placeBefore ? "tab-drop-before" : "tab-drop-after",
  );
}

function generatedTabDropTargetFromPoint(clientX, clientY, sourceId = "") {
  const elements =
    typeof document.elementsFromPoint === "function"
      ? document.elementsFromPoint(clientX, clientY)
      : [];
  const hoveredGeneratedButton = elements
    .map((element) => element?.closest?.(".generated-tab-btn"))
    .find(
      (button) =>
        button instanceof HTMLButtonElement &&
        button.dataset.tabTarget &&
        button.dataset.tabTarget !== sourceId,
    );
  if (hoveredGeneratedButton instanceof HTMLButtonElement) {
    const rect = hoveredGeneratedButton.getBoundingClientRect();
    return {
      targetId: hoveredGeneratedButton.dataset.tabTarget || "",
      placeBefore: clientX < rect.left + rect.width / 2,
    };
  }
  if (!(tabStrip instanceof HTMLElement)) {
    return null;
  }
  const stripRect = tabStrip.getBoundingClientRect();
  const insideStrip =
    clientX >= stripRect.left &&
    clientX <= stripRect.right &&
    clientY >= stripRect.top &&
    clientY <= stripRect.bottom;
  if (!insideStrip) {
    return null;
  }
  const buttons = generatedTabButtonsExcluding(sourceId);
  for (const button of buttons) {
    const rect = button.getBoundingClientRect();
    if (clientX < rect.left + rect.width / 2) {
      return {
        targetId: button.dataset.tabTarget || "",
        placeBefore: true,
      };
    }
  }
  return { targetId: "", placeBefore: false };
}

function updateGeneratedTabDropCue(button, event) {
  if (!(button instanceof HTMLButtonElement)) {
    clearGeneratedTabDragClasses();
    return;
  }
  const rect = button.getBoundingClientRect();
  applyGeneratedTabDropCue({
    targetId: button.dataset.tabTarget || "",
    placeBefore: event.clientX < rect.left + rect.width / 2,
  });
}

function reorderGeneratedTab(sourceId, targetId = "", placeBefore = false) {
  if (!sourceId || sourceId === targetId) {
    return false;
  }
  const nextState = cloneJson(generatedTabsState) || { tabs: [] };
  nextState.tabs = Array.isArray(nextState.tabs)
    ? nextState.tabs
    : [];
  const sourceIndex = nextState.tabs.findIndex(
    (entry) => entry?.id === sourceId,
  );
  if (sourceIndex < 0) {
    return false;
  }
  const [source] = nextState.tabs.splice(sourceIndex, 1);
  let insertIndex = nextState.tabs.length;
  if (targetId) {
    const targetIndex = nextState.tabs.findIndex(
      (entry) => entry?.id === targetId,
    );
    if (targetIndex < 0) {
      return false;
    }
    insertIndex = placeBefore ? targetIndex : targetIndex + 1;
  }
  nextState.tabs.splice(insertIndex, 0, source);
  if (!writeGeneratedTabsState(nextState)) {
    return false;
  }
  applyGeneratedTabsState(nextState);
  plagroundComposer?.handleGeneratedTabsChanged?.();
  return true;
}

function suppressGeneratedTabClick(button) {
  if (!(button instanceof HTMLButtonElement)) {
    return;
  }
  button.dataset.suppressNextClick = "true";
  window.setTimeout(() => {
    delete button.dataset.suppressNextClick;
  }, 180);
}

function endGeneratedTabPointerDrag(event) {
  const drag = generatedTabPointerDrag;
  if (!drag) {
    return;
  }
  window.removeEventListener("mousemove", updateGeneratedTabPointerDrag);
  window.removeEventListener("mouseup", endGeneratedTabPointerDrag);
  generatedTabPointerDrag = null;
  draggedGeneratedTabId = "";
  if (drag.moved) {
    event?.preventDefault?.();
    const placement =
      generatedTabDropTargetFromPoint(
        event?.clientX ?? drag.lastX,
        event?.clientY ?? drag.lastY,
        drag.sourceId,
      ) || drag.placement;
    if (placement) {
      reorderGeneratedTab(
        drag.sourceId,
        placement.targetId,
        placement.placeBefore,
      );
    }
    suppressGeneratedTabClick(drag.button);
  }
  clearGeneratedTabDragClasses();
}

function updateGeneratedTabPointerDrag(event) {
  const drag = generatedTabPointerDrag;
  if (!drag) {
    return;
  }
  drag.lastX = event.clientX;
  drag.lastY = event.clientY;
  const distance = Math.hypot(
    event.clientX - drag.startX,
    event.clientY - drag.startY,
  );
  if (!drag.moved && distance < 5) {
    return;
  }
  drag.moved = true;
  draggedGeneratedTabId = drag.sourceId;
  drag.button.classList.add("tab-dragging");
  event.preventDefault();
  drag.placement = generatedTabDropTargetFromPoint(
    event.clientX,
    event.clientY,
    drag.sourceId,
  );
  applyGeneratedTabDropCue(drag.placement, drag.sourceId);
}

function beginGeneratedTabPointerDrag(button, event) {
  if (
    !(button instanceof HTMLButtonElement) ||
    event.button !== 0 ||
    !button.dataset.tabTarget
  ) {
    return;
  }
  if (generatedTabPointerDrag) {
    endGeneratedTabPointerDrag(event);
  }
  generatedTabPointerDrag = {
    button,
    sourceId: button.dataset.tabTarget,
    startX: event.clientX,
    startY: event.clientY,
    lastX: event.clientX,
    lastY: event.clientY,
    moved: false,
    placement: null,
  };
  window.addEventListener("mousemove", updateGeneratedTabPointerDrag);
  window.addEventListener("mouseup", endGeneratedTabPointerDrag);
}

function setupGeneratedTabDrag(button) {
  if (
    !(button instanceof HTMLButtonElement) ||
    button.dataset.generatedTab !== "true" ||
    button.dataset.tabDragRegistered === "true"
  ) {
    return;
  }
  button.dataset.tabDragRegistered = "true";
  button.draggable = false;
  button.addEventListener("mousedown", (event) => {
    beginGeneratedTabPointerDrag(button, event);
  });
  button.addEventListener("dragstart", (event) => {
    const tabId = button.dataset.tabTarget || "";
    if (!tabId) {
      event.preventDefault();
      return;
    }
    draggedGeneratedTabId = tabId;
    button.classList.add("tab-dragging");
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = "move";
      event.dataTransfer.setData("text/plain", tabId);
    }
  });
  button.addEventListener("dragover", (event) => {
    if (!draggedGeneratedTabId) {
      return;
    }
    event.preventDefault();
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = "move";
    }
    updateGeneratedTabDropCue(button, event);
  });
  button.addEventListener("dragleave", () => {
    button.classList.remove("tab-drop-before", "tab-drop-after");
  });
  button.addEventListener("drop", (event) => {
    const sourceId =
      event.dataTransfer?.getData("text/plain") || draggedGeneratedTabId;
    const targetId = button.dataset.tabTarget || "";
    if (!sourceId || !targetId) {
      return;
    }
    event.preventDefault();
    const rect = button.getBoundingClientRect();
    const placeBefore = event.clientX < rect.left + rect.width / 2;
    reorderGeneratedTab(sourceId, targetId, placeBefore);
    clearGeneratedTabDragClasses();
  });
  button.addEventListener("dragend", () => {
    draggedGeneratedTabId = "";
    button.dataset.suppressNextClick = "true";
    window.setTimeout(() => {
      delete button.dataset.suppressNextClick;
    }, 160);
    clearGeneratedTabDragClasses();
  });
}

if (tabStrip instanceof HTMLElement) {
  tabStrip.addEventListener("dragover", (event) => {
    if (!draggedGeneratedTabId) {
      return;
    }
    event.preventDefault();
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = "move";
    }
  });
  tabStrip.addEventListener("drop", (event) => {
    const sourceId =
      event.dataTransfer?.getData("text/plain") || draggedGeneratedTabId;
    if (!sourceId) {
      return;
    }
    const targetButton = event.target?.closest?.(".generated-tab-btn");
    if (targetButton instanceof HTMLButtonElement) {
      return;
    }
    event.preventDefault();
    reorderGeneratedTab(sourceId, "", false);
    clearGeneratedTabDragClasses();
  });
}

function registerTabButton(button) {
  if (
    !(button instanceof HTMLButtonElement) ||
    button.dataset.tabRegistered === "true"
  ) {
    return;
  }
  button.dataset.tabRegistered = "true";
  button.addEventListener("click", () => {
    if (button.dataset.suppressNextClick === "true") {
      return;
    }
    const target = button.dataset.tabTarget;
    if (!target) {
      return;
    }
    setActiveTab(target);
  });
}

function tabLabelForButton(button) {
  return String(button?.textContent || "")
    .trim()
    .replace(/\s+/g, " ");
}

function existingTabLabelSet() {
  return new Set(
    orderedTabButtons().map((button) =>
      normalizeTabLabel(tabLabelForButton(button)),
    ),
  );
}

function collectPlaygroundSaveTargets() {
  return orderedTabButtons()
    .filter(
      (button) =>
        button.dataset.tabTarget &&
        button.dataset.generatedTab === "true",
    )
    .map((button) => ({
      id: button.dataset.tabTarget,
      label: tabLabelForButton(button),
    }));
}

function uniqueGeneratedTabTarget(label) {
  const used = new Set(
    orderedTabButtons()
      .map((button) => button.dataset.tabTarget)
      .filter(Boolean),
  );
  let base = `editor-${generatedTabSlug(label)}`;
  let candidate = base;
  let index = 2;
  while (used.has(candidate) || document.getElementById(`panel-${candidate}`)) {
    candidate = `${base}-${index}`;
    index += 1;
  }
  return candidate;
}

function ensureGeneratedTabButton(entry) {
  let button = document.getElementById(`tab-${entry.id}`);
  if (!(button instanceof HTMLButtonElement)) {
    button = document.createElement("button");
    button.id = `tab-${entry.id}`;
    button.className = "tab-btn generated-tab-btn";
    button.type = "button";
    button.setAttribute("role", "tab");
    button.setAttribute("aria-selected", "false");
    button.tabIndex = -1;
    button.dataset.generatedTab = "true";
    button.dataset.tabTarget = entry.id;
    tabStrip?.insertBefore(button, generatedTabInsertionPoint());
    tabButtons.push(button);
  }
  button.textContent = entry.label;
  button.draggable = false;
  button.setAttribute("aria-controls", `panel-${entry.id}`);
  registerTabButton(button);
  setupGeneratedTabDrag(button);
  return button;
}

function ensureGeneratedTabPanel(entry) {
  let panel = document.getElementById(`panel-${entry.id}`);
  if (!(panel instanceof HTMLElement)) {
    panel = document.createElement("section");
    panel.id = `panel-${entry.id}`;
    panel.className = "tab-panel generated-tab";
    panel.setAttribute("role", "tabpanel");
    panel.hidden = true;
    document.querySelector(".tabs-shell")?.appendChild(panel);
    tabPanels.push(panel);
  }
  panel.setAttribute("aria-labelledby", `tab-${entry.id}`);
  return panel;
}

function applyGeneratedTabsState(state) {
  generatedTabsState = state || { tabs: [] };
  const editorTabIds = new Set(
    (generatedTabsState.tabs || [])
      .filter((entry) => entry && typeof entry.id === "string")
      .map((entry) => entry.id),
  );
  tabButtons
    .filter(
      (button) =>
        button instanceof HTMLButtonElement &&
        button.dataset.generatedTab === "true" &&
        !editorTabIds.has(button.dataset.tabTarget || ""),
    )
    .forEach((button) => {
      const targetId = button.dataset.tabTarget || "";
      const buttonIndex = tabButtons.indexOf(button);
      if (buttonIndex >= 0) {
        tabButtons.splice(buttonIndex, 1);
      }
      button.remove();
      const panel = document.getElementById(`panel-${targetId}`);
      if (panel instanceof HTMLElement) {
        const panelIndex = tabPanels.indexOf(panel);
        if (panelIndex >= 0) {
          tabPanels.splice(panelIndex, 1);
        }
        panel.remove();
      }
    });

  (generatedTabsState.tabs || []).forEach((entry) => {
    if (
      !entry ||
      typeof entry.id !== "string" ||
      typeof entry.label !== "string"
    ) {
      return;
    }
    const button = ensureGeneratedTabButton(entry);
    tabStrip?.insertBefore(button, generatedTabInsertionPoint());
    renderGeneratedLayoutPanel(ensureGeneratedTabPanel(entry), entry);
  });
  syncTabButtonsFromDom();
}

function restoreGeneratedTabs() {
  applyGeneratedTabsState(readGeneratedTabsState());
}

function ensurePlaygroundQubitLayoutRegistration(element) {
  if (!(element instanceof HTMLElement)) {
    return;
  }
  if (
    element.dataset.component !== "qubit" ||
    !element.classList.contains("playground-node")
  ) {
    return;
  }
  ensureQubitLogicalId(element);
  if (!Number.isInteger(roomQubitIndexForItem(element))) {
    const canvas = element.closest(".playground-canvas");
    const index =
      canvas instanceof HTMLElement
        ? Array.from(
            canvas.querySelectorAll(':scope > .playground-node[data-component="qubit"]'),
          ).indexOf(element)
        : 0;
    element.dataset.roomQubitIndex = String(Math.max(0, index));
  }
  updateQubitDisplayLabel(element);
  element.dataset.layoutEditTarget = "true";
  element.dataset.layoutResizable = "true";
  element.dataset.layoutUniformResize = "true";
  element.dataset.layoutMinWidth = "28";
  element.dataset.layoutMinHeight = "28";
  if (!element.querySelector(":scope > .layout-resize-handle")) {
    ensureLayoutResizeHandle(element);
  }
  const core = element.querySelector(".playground-qubit-core");
  if (core instanceof HTMLElement) {
    delete core.dataset.layoutEditTarget;
    delete core.dataset.layoutResizable;
    delete core.dataset.layoutUniformResize;
    delete core.dataset.layoutMinWidth;
    delete core.dataset.layoutMinHeight;
    delete core.dataset.layoutKey;
    delete core.dataset.layoutTx;
    delete core.dataset.layoutTy;
    delete core.dataset.layoutManual;
    core
      .querySelectorAll(":scope > .layout-resize-handle")
      .forEach((handle) => handle.remove());
    core.style.translate = "";
    core.style.left = "";
    core.style.top = "";
    core.style.width = "";
    core.style.height = "";
  }
}

function setupPlagroundComposer() {
  if (!playgroundCanvas || !playgroundComponentSelect) {
    return null;
  }
  // Default to a null selection so canvas clicks do nothing until the user picks a component.
  playgroundComponentSelect.value = "";
  populateComponentPicker(playgroundComponentSelect);

  let zCounter = 5;
  let dragState = null;
  let resizeState = null;
  let measurementPartGesture = null;
  let cnotPartGesture = null;
  let selectedItem = null;
  let selectedItems = new Set();
  let selectedComponentPart = null;
  let statusTimer = null;

  const isSnapEnabled = () =>
    !playgroundSnapToggle || playgroundSnapToggle.checked;
  const isPlaygroundQubitItem = (item) =>
    item instanceof HTMLElement && item.dataset.component === "qubit";
  const isPlaygroundSingleGateItem = (item) =>
    item instanceof HTMLElement && item.dataset.component === "single-gate";
  const isPlaygroundSingleMeasurementItem = (item) =>
    item instanceof HTMLElement &&
    item.dataset.component === "single-measurement";
  const isPlaygroundDoubleMeasurementItem = (item) =>
    item instanceof HTMLElement &&
    item.dataset.component === "double-measurement";
  const isPlaygroundMailboxItem = (item) =>
    item instanceof HTMLElement && item.dataset.component === "mailbox";
  const isPlaygroundEditableSavedGroupItem = (item) =>
    isSeparatedPairMeasurementGroupElement(item);
  const isPlaygroundMeasurementItem = (item) =>
    isPlaygroundSingleMeasurementItem(item) ||
    isPlaygroundDoubleMeasurementItem(item);
  const minSizeForItem = (item) => {
    if (isPlaygroundQubitItem(item)) {
      return { minWidth: 12, minHeight: 12 };
    }
    if (item?.dataset?.component === PLAYGROUND_SAVED_GROUP_COMPONENT_TYPE) {
      return minGeneratedLayoutSizeForType(PLAYGROUND_SAVED_GROUP_COMPONENT_TYPE);
    }
    if (isMeasurementPieceComponentType(item?.dataset?.component)) {
      return minGeneratedLayoutSizeForType(item.dataset.component);
    }
    if (item?.dataset?.component === "text-box") {
      return minGeneratedLayoutSizeForType("text-box");
    }
    return { minWidth: 120, minHeight: 100 };
  };
  const sizeSnapValue = (item, value) => {
    if (isPlaygroundQubitItem(item)) {
      return value;
    }
    return snapValue(value);
  };
  const PLAYGROUND_GATE_FUNNEL_OVERLAP_THRESHOLD = 0.45;
  const PLAYGROUND_MEASUREMENT_OVERLAP_THRESHOLD =
    MEASUREMENT_OVERLAP_THRESHOLD;
  const playgroundSingleGateRuntime = new Map();
  const playgroundSingleMeasurementRuntime = new Map();
  const playgroundDoubleMeasurementRuntime = new Map();
  const playgroundCnotRuntime = new Map();
  const playgroundQubitRuntime = new Map();
  const playgroundCnotPartSpecs = [
    { key: "body", selector: ".cnot-body", minWidth: 120, minHeight: 90 },
    {
      key: "funnelTop",
      selector: ".cnot-input-funnel-top",
      minWidth: 24,
      minHeight: 40,
    },
    {
      key: "funnelBottom",
      selector: ".cnot-input-funnel-bottom",
      minWidth: 24,
      minHeight: 40,
    },
    {
      key: "windowTop",
      selector: ".cnot-porthole-top",
      minWidth: 30,
      minHeight: 30,
      uniform: true,
    },
    {
      key: "windowBottom",
      selector: ".cnot-porthole-bottom",
      minWidth: 30,
      minHeight: 30,
      uniform: true,
    },
    {
      key: "flangeTop",
      selector: ".cnot-output-flange-top",
      minWidth: 10,
      minHeight: 28,
    },
    {
      key: "flangeBottom",
      selector: ".cnot-output-flange-bottom",
      minWidth: 10,
      minHeight: 28,
    },
  ];

  const getPlaygroundQubitCore = (item) => {
    if (!isPlaygroundQubitItem(item)) {
      return null;
    }
    const core = item.querySelector(".playground-qubit-core");
    return core instanceof HTMLElement ? core : item;
  };

  const settlePlaygroundQubitVisualState = (item) => {
    const core = getPlaygroundQubitCore(item);
    item.classList.remove("migrating");
    item.style.removeProperty("--move-duration");
    if (!(core instanceof HTMLElement)) {
      return;
    }
    core.classList.remove("migrating");
    core.classList.remove("melting");
    core.classList.remove("collapse-animating");
    core.classList.remove("measurement-pellet");
    core.style.opacity = "";
    core.style.removeProperty("--move-duration");
    core.style.removeProperty("--melt-duration");
  };

  const prunePlaygroundRuntimeState = () => {
    Array.from(playgroundSingleGateRuntime.keys()).forEach((item) => {
      if (!item.isConnected) {
        playgroundSingleGateRuntime.delete(item);
      }
    });
    Array.from(playgroundQubitRuntime.keys()).forEach((item) => {
      if (!item.isConnected) {
        playgroundQubitRuntime.delete(item);
      }
    });
    Array.from(playgroundSingleMeasurementRuntime.keys()).forEach((item) => {
      if (!item.isConnected) {
        playgroundSingleMeasurementRuntime.delete(item);
      }
    });
    Array.from(playgroundDoubleMeasurementRuntime.keys()).forEach((item) => {
      if (!item.isConnected) {
        playgroundDoubleMeasurementRuntime.delete(item);
      }
    });
    Array.from(playgroundCnotRuntime.keys()).forEach((item) => {
      if (!item.isConnected) {
        playgroundCnotRuntime.delete(item);
      }
    });
  };

  const applyPlaygroundQubitVectorVisualState = (item) => {
    const state = playgroundQubitRuntime.get(item);
    const core = getPlaygroundQubitCore(item);
    if (!state || !(core instanceof HTMLElement)) {
      return;
    }
    const [blueWeight, redWeight] = probabilitiesFromVector2(state.vector);
    core.style.setProperty("--qubit-fill", blendBlueRed(blueWeight, redWeight));
    const phaseSign = phaseSignForRealAmplitudeVector(state.vector);
    if (phaseSign) {
      core.dataset.phaseSign = phaseSign;
    } else {
      delete core.dataset.phaseSign;
    }
  };

  const ensurePlaygroundQubitRuntimeState = (item) => {
    if (!isPlaygroundQubitItem(item)) {
      return null;
    }
    let state = playgroundQubitRuntime.get(item);
    if (!state) {
      state = {
        vector: [1, 0],
        transiting: false,
        pairState: null,
        pairQubitIndex: null,
        cnotSourceSlot: null,
        cnotPairToken: null,
        cnotOutcomeProbabilities: null,
        doubleMeasurementReturnPoint: null,
      };
      playgroundQubitRuntime.set(item, state);
    }
    applyPlaygroundQubitVectorVisualState(item);
    registerQubitInspector(item, () =>
      inspectorRegisterFromRuntimeState(
        item,
        ensurePlaygroundQubitRuntimeState(item),
        "Qubit",
      ),
    );
    return state;
  };

  const syncPlaygroundPairStateVisuals = (pairState) => {
    if (!pairState?.members) {
      return;
    }
    pairState.members.forEach(({ item, state, qubitIndex }) => {
      if (!(item instanceof HTMLElement) || !item.isConnected || !state) {
        return;
      }
      state.vector = displayVectorForPairMember(pairState, qubitIndex);
      applyPlaygroundQubitVectorVisualState(item);
    });
  };

  const createPlaygroundPairState = (topQubitItem, bottomQubitItem) => {
    const topState = ensurePlaygroundQubitRuntimeState(topQubitItem);
    const bottomState = ensurePlaygroundQubitRuntimeState(bottomQubitItem);
    if (!topState || !bottomState) {
      return null;
    }
      const pairState = {
        amplitudes: entangledAmplitudesFromQubitVectors(
          topState.vector,
          bottomState.vector,
        ),
        displayMode: "marginal",
        members: [
          { item: topQubitItem, state: topState, qubitIndex: 0 },
          { item: bottomQubitItem, state: bottomState, qubitIndex: 1 },
      ],
    };
    topState.pairState = pairState;
    topState.pairQubitIndex = 0;
    bottomState.pairState = pairState;
    bottomState.pairQubitIndex = 1;
    return pairState;
  };

  const applyPlaygroundSingleGateToQubitState = (qubitItem, tickIndex) => {
    const state = ensurePlaygroundQubitRuntimeState(qubitItem);
    if (!state) {
      return;
    }
    if (state.pairState && Number.isFinite(state.pairQubitIndex)) {
      applySingleQubitGateToPair(
        state.pairState,
        state.pairQubitIndex,
        gateMatrixForTick(tickIndex),
      );
      syncPlaygroundPairStateVisuals(state.pairState);
      return;
    }
    state.vector = normalizeVector2(
      vectorTimesMatrix2(state.vector, gateMatrixForTick(tickIndex)),
    );
    applyPlaygroundQubitVectorVisualState(qubitItem);
  };

  const collapsePlaygroundSingleQubitFromPair = (qubitItem, color) => {
    const state = ensurePlaygroundQubitRuntimeState(qubitItem);
    const pairState = state?.pairState;
    if (!state || !pairState || !Number.isFinite(state.pairQubitIndex)) {
      return false;
    }
    const measuredIndex = state.pairQubitIndex;
    const otherMember = pairState.members?.find(
      (member) => member.state && member.state !== state,
    );
    const otherVector = conditionalVectorAfterPairMeasurement(
      pairState,
      measuredIndex,
      color,
    );
    collapsePairStateBySingleQubitMeasurement(pairState, measuredIndex, color);
    state.vector = color === "blue" ? [1, 0] : [0, 1];
    state.pairState = null;
    state.pairQubitIndex = null;
    state.cnotSourceSlot = null;
    state.cnotPairToken = null;
    state.cnotOutcomeProbabilities = null;
    state.doubleMeasurementReturnPoint = null;
    if (otherMember?.state) {
      otherMember.state.vector = otherVector;
      otherMember.state.pairState = null;
      otherMember.state.pairQubitIndex = null;
      otherMember.state.cnotSourceSlot = null;
      otherMember.state.cnotPairToken = null;
      otherMember.state.cnotOutcomeProbabilities = null;
      if (otherMember.item instanceof HTMLElement) {
        applyPlaygroundQubitVectorVisualState(otherMember.item);
      }
    }
    applyPlaygroundQubitVectorVisualState(qubitItem);
    return true;
  };

  const resolvePlaygroundMeasurementPartEntries = (item) => {
    if (isPlaygroundEditableSavedGroupItem(item)) {
      return editableSavedGroupChildPartEntries(item);
    }
    if (!isPlaygroundMeasurementItem(item)) {
      return [];
    }
    return measurementPartSpecsForType(item.dataset.component)
      .map((spec) => {
        const element = item.querySelector(spec.selector);
        return element instanceof HTMLElement ? { spec, element } : null;
      })
      .filter(Boolean);
  };

  const isPlaygroundCnotItem = (item) =>
    item instanceof HTMLElement && item.dataset.component === "cnot-gate";

  const resolvePlaygroundCnotPartEntries = (item) => {
    if (!isPlaygroundCnotItem(item)) {
      return [];
    }
    return playgroundCnotPartSpecs
      .map((spec) => {
        const element = item.querySelector(spec.selector);
        return element instanceof HTMLElement ? { spec, element } : null;
      })
      .filter(Boolean);
  };

  const preparePlaygroundCnotParts = (item) => {
    resolvePlaygroundCnotPartEntries(item).forEach(({ spec, element }) => {
      element.dataset.playgroundCnotPart = spec.key;
      element.dataset.layoutEditTarget = "true";
      element.dataset.layoutResizable = "true";
      element.dataset.layoutUniformResize = spec.uniform ? "true" : "false";
      element.dataset.layoutMinWidth = `${spec.minWidth || 24}`;
      element.dataset.layoutMinHeight = `${spec.minHeight || 24}`;
      if (!element.style.translate) {
        setLayoutTargetTranslate(element, 0, 0);
      }
      if (window.getComputedStyle(element).position === "static") {
        element.style.position = "relative";
      }
      ensureLayoutResizeHandle(element);
      if (element.dataset.playgroundCnotPartListener !== "true") {
        element.dataset.playgroundCnotPartListener = "true";
        const startPartGesture = (event) => {
          if (!layoutEditorState.enabled || !isPrimaryMouseButton(event)) {
            return;
          }
          beginPlaygroundCnotPartGesture(item, element, event);
        };
        element.addEventListener("mousedown", startPartGesture);
        element.addEventListener("touchstart", startPartGesture, {
          passive: false,
        });
      }
    });
  };

  const preparePlaygroundMeasurementParts = (item) => {
    if (
      isPlaygroundMeasurementItem(item) &&
      editableMeasurementPartSpecsForType(item.dataset.component).length === 0
    ) {
      clearMeasurementPartLayoutEditing(item);
      return;
    }
    resolvePlaygroundMeasurementPartEntries(item).forEach(
      ({ spec, element }) => {
        element.dataset.playgroundMeasurementPart = spec.key;
        element.dataset.layoutEditTarget = "true";
        element.dataset.layoutResizable = spec.resizable ? "true" : "false";
        element.dataset.layoutUniformResize = spec.uniform ? "true" : "false";
        element.dataset.layoutMinWidth = `${spec.minWidth || 24}`;
        element.dataset.layoutMinHeight = `${spec.minHeight || 24}`;
        if (!element.style.translate) {
          setLayoutTargetTranslate(element, 0, 0);
        }
        if (window.getComputedStyle(element).position === "static") {
          element.style.position = "relative";
        }
        if (spec.resizable) {
          ensureLayoutResizeHandle(element);
        }
        if (element.dataset.playgroundMeasurementPartListener !== "true") {
          element.dataset.playgroundMeasurementPartListener = "true";
          const startPartGesture = (event) => {
            if (!layoutEditorState.enabled || !isPrimaryMouseButton(event)) {
              return;
            }
            beginPlaygroundMeasurementPartGesture(item, element, event);
          };
          element.addEventListener("mousedown", startPartGesture);
          element.addEventListener("touchstart", startPartGesture, {
            passive: false,
          });
        }
      },
    );
  };

  const applyPlaygroundMeasurementLayoutSnapshot = (
    item,
    measurementLayout,
    options = {},
  ) => {
    applyMeasurementLayoutSnapshot(
      item,
      measurementLayout,
      editableMeasurementPartSpecsForType(item.dataset.component),
      options,
    );
  };

  const capturePlaygroundMeasurementLayoutSnapshot = (item) => {
    if (!isPlaygroundMeasurementItem(item)) {
      return null;
    }
    preparePlaygroundMeasurementParts(item);
    return captureMeasurementLayoutSnapshot(
      item,
      editableMeasurementPartSpecsForType(item.dataset.component),
    );
  };

  const isPlagroundTabActive = () => {
    const panel = document.getElementById("panel-plaground");
    return panel instanceof HTMLElement && !panel.hidden;
  };

  const isWorkshopTabMode = () => workshopEditorMode === "tab";
  const isWorkshopComponentMode = () => workshopEditorMode === "component";

  const snapValue = (value) => {
    if (!isSnapEnabled()) {
      return value;
    }
    return Math.round(value / PLAYGROUND_GRID_SIZE) * PLAYGROUND_GRID_SIZE;
  };

  const setStatus = (text) => {
    if (!playgroundStatus) {
      return;
    }
    playgroundStatus.textContent = text;
    if (statusTimer !== null) {
      window.clearTimeout(statusTimer);
    }
    if (!text) {
      statusTimer = null;
      return;
    }
    statusTimer = window.setTimeout(() => {
      if (playgroundStatus.textContent === text) {
        playgroundStatus.textContent = "";
      }
      statusTimer = null;
    }, 1800);
  };

  const bringToFront = (item) => {
    zCounter += 1;
    item.style.zIndex = String(zCounter);
  };

  const selectedComponentItem = () => {
    if (selectedItem instanceof HTMLElement && selectedItem.isConnected) {
      return selectedItem;
    }
    const owner = selectedComponentPart?.closest?.(".playground-node");
    return owner instanceof HTMLElement && owner.isConnected ? owner : null;
  };
  const selectedComponentItems = () => {
    const selected = Array.from(selectedItems).filter(
      (item) => item instanceof HTMLElement && item.isConnected,
    );
    if (selected.length > 0) {
      return selected;
    }
    const single = selectedComponentItem();
    return single instanceof HTMLElement ? [single] : [];
  };

  const updateActionButtons = () => {
    const selectionCount = selectedComponentItems().length;
    const hasSelection = selectionCount > 0;
    const componentMode = isWorkshopComponentMode();
    if (playgroundDuplicateButton) {
      playgroundDuplicateButton.disabled = !hasSelection;
    }
    if (playgroundDeleteButton) {
      playgroundDeleteButton.disabled = selectionCount !== 1;
    }
    if (playgroundSaveComponentButton) {
      playgroundSaveComponentButton.disabled = !componentMode || !hasSelection;
      playgroundSaveComponentButton.classList.toggle(
        "active",
        componentMode && hasSelection,
      );
    }
    if (playgroundSaveGroupButton) {
      playgroundSaveGroupButton.disabled = selectionCount < 2;
    }
  };

  const clearSelectedComponentPart = () => {
    if (selectedComponentPart) {
      selectedComponentPart.classList.remove("layout-edit-selected");
    }
    selectedComponentPart = null;
  };

  const setSelectedItem = (item, part = null, { additive = false } = {}) => {
    if (!(item instanceof HTMLElement) || !item.isConnected) {
      selectedItems.forEach((selected) => selected.classList.remove("selected"));
      selectedItems = new Set();
      clearSelectedComponentPart();
      selectedItem = null;
      updateActionButtons();
      return;
    }
    if (additive) {
      clearSelectedComponentPart();
      if (selectedItems.has(item)) {
        selectedItems.delete(item);
        item.classList.remove("selected");
        selectedItem = Array.from(selectedItems).at(-1) || null;
      } else {
        selectedItems.add(item);
        selectedItem = item;
      }
      syncSelectionUiState();
      bringToFront(item);
      updateActionButtons();
      return;
    }
    if (selectedItem && selectedItem !== item) {
      selectedItem.classList.remove("selected");
    }
    selectedItems.forEach((selected) => {
      if (selected !== item) {
        selected.classList.remove("selected");
      }
    });
    selectedItems = new Set([item]);
    clearSelectedComponentPart();
    selectedItem = item;
    if (layoutEditorState.enabled) {
      selectedItem.classList.add("selected");
    } else {
      selectedItem.classList.remove("selected");
    }
    if (
      part instanceof HTMLElement &&
      selectedItem.contains(part) &&
      layoutEditorState.enabled
    ) {
      selectedComponentPart = part;
      selectedComponentPart.classList.add("layout-edit-selected");
    }
    bringToFront(selectedItem);
    updateActionButtons();
  };

  const syncSelectionUiState = () => {
    const items = playgroundCanvas.querySelectorAll(
      ".playground-node.selected",
    );
    items.forEach((item) => item.classList.remove("selected"));
    playgroundCanvas
      .querySelectorAll(
        "[data-playground-measurement-part].layout-edit-selected, [data-playground-cnot-part].layout-edit-selected",
      )
      .forEach((part) => part.classList.remove("layout-edit-selected"));
    selectedItems = new Set(
      Array.from(selectedItems).filter(
        (item) => item instanceof HTMLElement && item.isConnected,
      ),
    );
    if (
      selectedItem instanceof HTMLElement &&
      selectedItem.isConnected &&
      !selectedItems.has(selectedItem)
    ) {
      selectedItems.add(selectedItem);
    }
    if (layoutEditorState.enabled) {
      selectedItems.forEach((item) => item.classList.add("selected"));
    }
    if (
      layoutEditorState.enabled &&
      selectedComponentPart instanceof HTMLElement &&
      selectedComponentPart.isConnected
    ) {
      selectedComponentPart.classList.add("layout-edit-selected");
    }
  };

  const clampItemPosition = (item, left, top, { snap = true } = {}) => {
    const maxLeft = Math.max(
      0,
      playgroundCanvas.clientWidth - item.offsetWidth,
    );
    const maxTop = Math.max(
      0,
      playgroundCanvas.clientHeight - item.offsetHeight,
    );
    const snappedLeft = snap ? snapValue(left) : left;
    const snappedTop = snap ? snapValue(top) : top;
    return {
      left: clamp(snappedLeft, 0, maxLeft),
      top: clamp(snappedTop, 0, maxTop),
    };
  };

  const clampItemSize = (item, width, height) => {
    const left = parseLayoutNumeric(item.style.left, 0);
    const top = parseLayoutNumeric(item.style.top, 0);
    const { minWidth, minHeight } = minSizeForItem(item);
    const maxWidth = Math.max(minWidth, playgroundCanvas.clientWidth - left);
    const maxHeight = Math.max(minHeight, playgroundCanvas.clientHeight - top);
    return {
      width: clamp(sizeSnapValue(item, width), minWidth, maxWidth),
      height: clamp(sizeSnapValue(item, height), minHeight, maxHeight),
      minWidth,
      minHeight,
      maxWidth,
      maxHeight,
    };
  };

  const canvasPointForElementCenter = (element) => {
    const canvasRect = playgroundCanvas.getBoundingClientRect();
    const rect = element.getBoundingClientRect();
    return {
      x:
        rect.left -
        canvasRect.left +
        playgroundCanvas.scrollLeft +
        rect.width / 2,
      y:
        rect.top -
        canvasRect.top +
        playgroundCanvas.scrollTop +
        rect.height / 2,
    };
  };

  const canvasXForElementLeft = (element) => {
    const canvasRect = playgroundCanvas.getBoundingClientRect();
    const rect = element.getBoundingClientRect();
    return rect.left - canvasRect.left + playgroundCanvas.scrollLeft;
  };

  const canvasXForElementRight = (element) => {
    const canvasRect = playgroundCanvas.getBoundingClientRect();
    const rect = element.getBoundingClientRect();
    return rect.right - canvasRect.left + playgroundCanvas.scrollLeft;
  };

  const setPlaygroundQubitCenter = (qubitItem, x, y) => {
    const safeX = Number.isFinite(x) ? x : playgroundCanvas.clientWidth / 2;
    const safeY = Number.isFinite(y) ? y : playgroundCanvas.clientHeight / 2;
    const nextLeft = safeX - qubitItem.offsetWidth / 2;
    const nextTop = safeY - qubitItem.offsetHeight / 2;
    const clamped = clampItemPosition(qubitItem, nextLeft, nextTop, {
      snap: false,
    });
    qubitItem.style.left = `${Math.round(clamped.left)}px`;
    qubitItem.style.top = `${Math.round(clamped.top)}px`;
  };

  const qubitOverlapRatioWithRect = (qubitItem, target) => {
    const qubitRect = qubitItem.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();
    const overlapWidth = Math.max(
      0,
      Math.min(qubitRect.right, targetRect.right) -
        Math.max(qubitRect.left, targetRect.left),
    );
    const overlapHeight = Math.max(
      0,
      Math.min(qubitRect.bottom, targetRect.bottom) -
        Math.max(qubitRect.top, targetRect.top),
    );
    const overlapArea = overlapWidth * overlapHeight;
    const qubitArea = qubitRect.width * qubitRect.height;
    const targetArea = targetRect.width * targetRect.height;
    const comparisonArea = Math.min(qubitArea, targetArea);
    return comparisonArea > 0 ? overlapArea / comparisonArea : 0;
  };

  const circleIntersectionArea = (r1, r2, distance) => {
    if (distance >= r1 + r2) {
      return 0;
    }
    if (distance <= Math.abs(r1 - r2)) {
      const minRadius = Math.min(r1, r2);
      return Math.PI * minRadius * minRadius;
    }

    const a1 = r1 * r1;
    const a2 = r2 * r2;
    const alpha = Math.acos(
      (distance * distance + a1 - a2) / (2 * distance * r1),
    );
    const beta = Math.acos(
      (distance * distance + a2 - a1) / (2 * distance * r2),
    );

    return (
      a1 * alpha +
      a2 * beta -
      0.5 *
        Math.sqrt(
          (-distance + r1 + r2) *
            (distance + r1 - r2) *
            (distance - r1 + r2) *
            (distance + r1 + r2),
        )
    );
  };

  const viewportPointToCanvasPoint = (x, y) => {
    const canvasRect = playgroundCanvas.getBoundingClientRect();
    return {
      x: x - canvasRect.left + playgroundCanvas.scrollLeft,
      y: y - canvasRect.top + playgroundCanvas.scrollTop,
    };
  };

  const playgroundLensCircle = (runtime) => {
    if (!runtime?.measureLens) {
      return null;
    }
    const lensRect = runtime.measureLens.getBoundingClientRect();
    const radius = Math.min(lensRect.width, lensRect.height) / 2;
    if (radius <= 0) {
      return null;
    }
    return {
      x: lensRect.left + lensRect.width / 2,
      y: lensRect.top + lensRect.height / 2,
      radius,
    };
  };

  const playgroundQubitOverlapRatioWithLens = (qubitItem, runtime) => {
    const lensCircle = playgroundLensCircle(runtime);
    if (!lensCircle) {
      return 0;
    }
    const qubitRect = qubitItem.getBoundingClientRect();
    const qRadius = qubitRect.width / 2;
    if (qRadius <= 0) {
      return 0;
    }
    const qCx = qubitRect.left + qRadius;
    const qCy = qubitRect.top + qRadius;
    const distance = Math.hypot(qCx - lensCircle.x, qCy - lensCircle.y);
    const overlapArea = circleIntersectionArea(
      qRadius,
      lensCircle.radius,
      distance,
    );
    const qubitArea = Math.PI * qRadius * qRadius;
    return qubitArea > 0 ? overlapArea / qubitArea : 0;
  };

  const wait = (duration) =>
    new Promise((resolve) => {
      window.setTimeout(resolve, duration);
    });

  const nextFrame = () =>
    new Promise((resolve) => {
      window.requestAnimationFrame(() => resolve());
    });

  const movePlaygroundQubitToPoint = (
    qubitItem,
    x,
    y,
    duration = AUTO_TRAVEL_MS,
  ) =>
    new Promise((resolve) => {
      const core = getPlaygroundQubitCore(qubitItem);
      qubitItem.style.setProperty("--move-duration", `${duration}ms`);
      qubitItem.classList.add("migrating");
      if (core instanceof HTMLElement) {
        core.style.setProperty("--move-duration", `${duration}ms`);
        core.classList.add("migrating");
      }
      qubitItem.getBoundingClientRect();
      setPlaygroundQubitCenter(qubitItem, x, y);
      window.setTimeout(resolve, duration);
    });

  const alignPlaygroundGateSpring = (runtime) => {
    if (!runtime?.item || !runtime?.ticksWrap || !runtime?.gatePlatformBay) {
      return;
    }
    const itemRect = runtime.item.getBoundingClientRect();
    const ticksRect = runtime.ticksWrap.getBoundingClientRect();
    if (!itemRect.height || !ticksRect.height) {
      return;
    }
    const centerY = ticksRect.top - itemRect.top + ticksRect.height / 2;
    runtime.gatePlatformBay.style.top = `${Number.parseFloat(centerY.toFixed(2))}px`;
    runtime.gatePlatformBay.style.transform = "translateY(-50%)";
  };

  const ensurePlaygroundSingleGateRuntime = (item) => {
    if (!isPlaygroundSingleGateItem(item)) {
      return null;
    }
    const existing = playgroundSingleGateRuntime.get(item);
    if (existing) {
      return existing;
    }
    const ticksWrap = item.querySelector('[data-role="ticks"]');
    const gateArrow = item.querySelector('[data-role="gate-arrow"]');
    const gateFunnel = item.querySelector('[data-role="tube-funnel"]');
    const gateWindow = item.querySelector('[data-role="window"]');
    const gatePlatform = item.querySelector('[data-role="tube-platform"]');
    const gatePlatformBay = gatePlatform?.closest(".tube-platform-bay");
    if (
      !(ticksWrap instanceof HTMLElement) ||
      !(gateArrow instanceof Element) ||
      !(gateFunnel instanceof HTMLElement) ||
      !(gateWindow instanceof HTMLElement) ||
      !(gatePlatform instanceof HTMLElement) ||
      !(gatePlatformBay instanceof HTMLElement)
    ) {
      return null;
    }

    ticksWrap.replaceChildren();

    const runtime = {
      item,
      ticksWrap,
      gateArrow,
      gateFunnel,
      gateWindow,
      gatePlatform,
      gatePlatformBay,
      activeTick: 0,
      busy: false,
      dial: null,
    };

    runtime.dial = createSingleQubitGateDial({
      ticksWrap,
      arrow: gateArrow,
      initialTick: Number.isFinite(
        Number.parseInt(item.dataset.playgroundSingleGateTick, 10),
      )
        ? Number.parseInt(item.dataset.playgroundSingleGateTick, 10)
        : runtime.activeTick,
      tickAriaLabelPrefix: "Tick",
      orbitInset: 10,
      canInteract: () => !runtime.busy,
      onTickChange: (tick) => {
        runtime.activeTick = normalizeTickIndex(tick);
      },
    });
    runtime.activeTick = runtime.dial?.getTick() ?? runtime.activeTick;

    runtime.dial?.layout();
    alignPlaygroundGateSpring(runtime);

    const gateArrowLayer = gateArrow.closest(".arrow-layer");
    const beginDialDrag = (event) => {
      if (!isPrimaryMouseButton(event)) {
        return;
      }
      event.stopPropagation();
      runtime.dial?.beginDrag(event);
    };
    gateArrow.addEventListener("mousedown", beginDialDrag);
    gateArrow.addEventListener(
      "touchstart",
      beginDialDrag,
      { passive: false },
    );
    if (gateArrowLayer instanceof Element && gateArrowLayer !== gateArrow) {
      gateArrowLayer.addEventListener("mousedown", beginDialDrag);
      gateArrowLayer.addEventListener("touchstart", beginDialDrag, {
        passive: false,
      });
    }
    gateArrow.addEventListener("keydown", (event) =>
      runtime.dial?.handleKeydown(event),
    );

    playgroundSingleGateRuntime.set(item, runtime);
    registerGateInspector(item, () => ({
      label: "Single Qubit Gate",
      matrix: gateMatrixForTick(runtime.activeTick),
      tickIndex: runtime.activeTick,
    }));
    return runtime;
  };

  const findBestPlaygroundGateRuntimeForQubit = (qubitItem) => {
    prunePlaygroundRuntimeState();
    let bestRuntime = null;
    let bestOverlap = PLAYGROUND_GATE_FUNNEL_OVERLAP_THRESHOLD;
    const gateItems = playgroundCanvas.querySelectorAll(
      '.playground-node[data-component="single-gate"]',
    );
    gateItems.forEach((gateItem) => {
      const runtime = ensurePlaygroundSingleGateRuntime(gateItem);
      if (!runtime || runtime.busy) {
        return;
      }
      const overlap = qubitOverlapRatioWithRect(qubitItem, runtime.gateFunnel);
      if (overlap >= bestOverlap) {
        bestOverlap = overlap;
        bestRuntime = runtime;
      }
    });
    return bestRuntime;
  };

  const runPlaygroundSingleGateTransit = async (qubitItem, gateRuntime) => {
    if (
      !isPlaygroundQubitItem(qubitItem) ||
      !gateRuntime ||
      layoutEditorState.enabled
    ) {
      return false;
    }
    const qubitState = ensurePlaygroundQubitRuntimeState(qubitItem);
    if (!qubitState || qubitState.transiting || gateRuntime.busy) {
      return false;
    }

    qubitState.transiting = true;
    gateRuntime.busy = true;
    gateRuntime.item.classList.add("gate-busy");
    gateRuntime.item.classList.remove("platform-extended");
    if (dragState && dragState.item === qubitItem) {
      qubitItem.classList.remove("dragging");
      dragState = null;
    }

    try {
      await nextFrame();
      if (layoutEditorState.enabled) {
        return false;
      }

      alignPlaygroundGateSpring(gateRuntime);
      const gateCenter = canvasPointForElementCenter(gateRuntime.ticksWrap);
      await movePlaygroundQubitToPoint(
        qubitItem,
        gateCenter.x,
        gateCenter.y,
        AUTO_TRAVEL_MS,
      );
      if (layoutEditorState.enabled) {
        return false;
      }

      await wait(GATE_TUBE_DWELL_MS);
      if (layoutEditorState.enabled) {
        return false;
      }

      applyPlaygroundSingleGateToQubitState(
        qubitItem,
        gateRuntime.activeTick,
      );
      if (!qubitState.pairState) {
        qubitState.cnotSourceSlot = null;
        qubitState.cnotPairToken = null;
        qubitState.cnotOutcomeProbabilities = null;
      }
      qubitState.doubleMeasurementReturnPoint = null;

      settlePlaygroundQubitVisualState(qubitItem);
      const platformCenter = canvasPointForElementCenter(
        gateRuntime.gatePlatform,
      );
      const retractedPlatformPoint = {
        x: platformCenter.x,
        y: gateCenter.y,
      };
      setPlaygroundQubitCenter(
        qubitItem,
        retractedPlatformPoint.x,
        retractedPlatformPoint.y,
      );
      await nextFrame();
      if (layoutEditorState.enabled) {
        return false;
      }

      gateRuntime.item.classList.add("platform-extended");
      const canvasRect = playgroundCanvas.getBoundingClientRect();
      const pipeRect = gateRuntime.gateWindow.getBoundingClientRect();
      const qubitRect = qubitItem.getBoundingClientRect();
      const ejectedCenter = {
        x:
          pipeRect.right -
          canvasRect.left +
          playgroundCanvas.scrollLeft +
          100 +
          qubitRect.width / 2,
        y: retractedPlatformPoint.y,
      };
      await movePlaygroundQubitToPoint(
        qubitItem,
        ejectedCenter.x,
        ejectedCenter.y,
        GATE_PLATFORM_EXTEND_MS,
      );
      settlePlaygroundQubitVisualState(qubitItem);
      gateRuntime.item.classList.remove("platform-extended");
      await wait(GATE_PLATFORM_RETRACT_MS);
      return true;
    } finally {
      settlePlaygroundQubitVisualState(qubitItem);
      gateRuntime.item.classList.remove("gate-busy");
      gateRuntime.item.classList.remove("platform-extended");
      qubitState.transiting = false;
      gateRuntime.busy = false;
    }
  };

  const maybeSnapPlaygroundQubitToSingleGate = (qubitItem) => {
    if (layoutEditorState.enabled || !isPlaygroundQubitItem(qubitItem)) {
      return false;
    }
    const qubitState = ensurePlaygroundQubitRuntimeState(qubitItem);
    if (!qubitState || qubitState.transiting) {
      return false;
    }
    const gateRuntime = findBestPlaygroundGateRuntimeForQubit(qubitItem);
    if (!gateRuntime) {
      return false;
    }
    runPlaygroundSingleGateTransit(qubitItem, gateRuntime).catch(() => {});
    return true;
  };

  const ensurePlaygroundCnotRuntime = (item) => {
    if (!isPlaygroundCnotItem(item)) {
      return null;
    }
    const existing = playgroundCnotRuntime.get(item);
    if (existing) {
      return existing;
    }
    const body = item.querySelector(
      ".cnot-body, [data-part='body']",
    );
    const funnelTop = item.querySelector(
      ".cnot-input-funnel-top, [data-part='funnel-top']",
    );
    const funnelBottom = item.querySelector(
      ".cnot-input-funnel-bottom, [data-part='funnel-bottom']",
    );
    const windowTop = item.querySelector(
      ".cnot-porthole-top, [data-part='window-top']",
    );
    const windowBottom = item.querySelector(
      ".cnot-porthole-bottom, [data-part='window-bottom']",
    );
    const flangeTop = item.querySelector(".cnot-output-flange-top");
    const flangeBottom = item.querySelector(".cnot-output-flange-bottom");
    const springTop = item.querySelector(".cnot-spring-top");
    const springBottom = item.querySelector(".cnot-spring-bottom");
    if (
      !(body instanceof HTMLElement) ||
      !(funnelTop instanceof HTMLElement) ||
      !(funnelBottom instanceof HTMLElement) ||
      !(windowTop instanceof HTMLElement) ||
      !(windowBottom instanceof HTMLElement) ||
      !(flangeTop instanceof HTMLElement) ||
      !(flangeBottom instanceof HTMLElement) ||
      !(springTop instanceof HTMLElement) ||
      !(springBottom instanceof HTMLElement)
    ) {
      return null;
    }
    const runtime = {
      item,
      body,
      funnelTop,
      funnelBottom,
      windowTop,
      windowBottom,
      flangeTop,
      flangeBottom,
      springTop,
      springBottom,
      slotOccupants: {
        top: null,
        bottom: null,
      },
      busy: false,
      cyclePromise: null,
    };
    playgroundCnotRuntime.set(item, runtime);
    registerGateInspector(item, () => ({
      label: "C-NOT Gate",
      matrix: cnotGateMatrixForInspector(),
    }));
    return runtime;
  };

  const releasePlaygroundQubitFromCnotSlots = (qubitItem) => {
    if (!isPlaygroundQubitItem(qubitItem)) {
      return;
    }
    prunePlaygroundRuntimeState();
    Array.from(playgroundCnotRuntime.values()).forEach((runtime) => {
      if (runtime.slotOccupants.top === qubitItem) {
        runtime.slotOccupants.top = null;
      }
      if (runtime.slotOccupants.bottom === qubitItem) {
        runtime.slotOccupants.bottom = null;
      }
    });
  };

  const findBestPlaygroundCnotRuntimeForQubit = (qubitItem) => {
    prunePlaygroundRuntimeState();
    let best = null;
    let bestOverlap = CNOT_FUNNEL_OVERLAP_THRESHOLD;
    const cnotItems = playgroundCanvas.querySelectorAll(
      '.playground-node[data-component="cnot-gate"]',
    );
    cnotItems.forEach((cnotItem) => {
      const runtime = ensurePlaygroundCnotRuntime(cnotItem);
      if (!runtime || runtime.busy) {
        return;
      }
      [
        {
          slot: "top",
          funnel: runtime.funnelTop,
          occupant: runtime.slotOccupants.top,
        },
        {
          slot: "bottom",
          funnel: runtime.funnelBottom,
          occupant: runtime.slotOccupants.bottom,
        },
      ].forEach(({ slot, funnel, occupant }) => {
        if (occupant && occupant !== qubitItem) {
          return;
        }
        const overlap = qubitOverlapRatioWithRect(qubitItem, funnel);
        if (overlap > bestOverlap) {
          bestOverlap = overlap;
          best = { runtime, slot };
        }
      });
    });
    return best;
  };

  const applyPlaygroundCnotToQubitStates = (topQubitItem, bottomQubitItem) => {
    const topState = ensurePlaygroundQubitRuntimeState(topQubitItem);
    const bottomState = ensurePlaygroundQubitRuntimeState(bottomQubitItem);
    if (!topState || !bottomState) {
      return;
    }
    if (runtimeStatesSharePairState(topState, bottomState)) {
      applyCNOTToRegisterState(
        topState.pairState,
        topState.pairQubitIndex,
        bottomState.pairQubitIndex,
      );
      syncPlaygroundPairStateVisuals(topState.pairState);
      return;
    }
    const registerState = mergeRuntimeRegistersForCnot(
      topQubitItem,
      bottomQubitItem,
      topState,
      bottomState,
    );
    if (!registerState) {
      return;
    }
    syncPlaygroundPairStateVisuals(registerState);
  };

  const runPlaygroundCnotCycle = async (runtime) => {
    if (runtime.cyclePromise) {
      return runtime.cyclePromise;
    }
    if (
      runtime.busy ||
      !(runtime.slotOccupants.top instanceof HTMLElement) ||
      !(runtime.slotOccupants.bottom instanceof HTMLElement)
    ) {
      return null;
    }

    const topQubit = runtime.slotOccupants.top;
    const bottomQubit = runtime.slotOccupants.bottom;
    const topState = ensurePlaygroundQubitRuntimeState(topQubit);
    const bottomState = ensurePlaygroundQubitRuntimeState(bottomQubit);
    if (!topState || !bottomState) {
      return null;
    }

    runtime.busy = true;
    topState.transiting = true;
    bottomState.transiting = true;
    runtime.item.classList.add("gate-busy");
    runtime.body.classList.remove("platform-extended");
    runtime.cyclePromise = (async () => {
      try {
        await wait(CNOT_WINDOW_DWELL_MS);
        if (
          layoutEditorState.enabled ||
          !topQubit.isConnected ||
          !bottomQubit.isConnected ||
          runtime.slotOccupants.top !== topQubit ||
          runtime.slotOccupants.bottom !== bottomQubit
        ) {
          return false;
        }

        const pairToken = `${Date.now()}-${Math.random()}`;
        applyPlaygroundCnotToQubitStates(topQubit, bottomQubit);
        topState.cnotSourceSlot = "top";
        bottomState.cnotSourceSlot = "bottom";
        topState.cnotPairToken = pairToken;
        bottomState.cnotPairToken = pairToken;
        const cnotOutcomeProbabilities = pairOutcomeProbabilitiesFromState(
          topState.pairState,
        );
        topState.cnotOutcomeProbabilities = cnotOutcomeProbabilities;
        bottomState.cnotOutcomeProbabilities = cnotOutcomeProbabilities;

        const topWindowCenter = canvasPointForElementCenter(runtime.windowTop);
        const bottomWindowCenter = canvasPointForElementCenter(
          runtime.windowBottom,
        );
        setPlaygroundQubitCenter(
          topQubit,
          topWindowCenter.x,
          topWindowCenter.y,
        );
        setPlaygroundQubitCenter(
          bottomQubit,
          bottomWindowCenter.x,
          bottomWindowCenter.y,
        );
        await nextFrame();

        const topQubitRect = topQubit.getBoundingClientRect();
        const bottomQubitRect = bottomQubit.getBoundingClientRect();
        const topFlangeRight = canvasXForElementRight(runtime.flangeTop);
        const bottomFlangeRight = canvasXForElementRight(runtime.flangeBottom);
        const topReadyCenter = {
          x: topFlangeRight + topQubitRect.width / 2,
          y: topWindowCenter.y,
        };
        const bottomReadyCenter = {
          x: bottomFlangeRight + bottomQubitRect.width / 2,
          y: bottomWindowCenter.y,
        };
        await Promise.all([
          movePlaygroundQubitToPoint(
            topQubit,
            topReadyCenter.x,
            topReadyCenter.y,
            AUTO_TRAVEL_MS,
          ),
          movePlaygroundQubitToPoint(
            bottomQubit,
            bottomReadyCenter.x,
            bottomReadyCenter.y,
            AUTO_TRAVEL_MS,
          ),
        ]);

        runtime.body.classList.add("platform-extended");
        const topSpringLeft = canvasXForElementLeft(runtime.springTop);
        const bottomSpringLeft = canvasXForElementLeft(runtime.springBottom);
        const topEjectedCenter = {
          x:
            topSpringLeft +
            cnotSpringExpandedLength(runtime.springTop) +
            topQubitRect.width / 2,
          y: topWindowCenter.y,
        };
        const bottomEjectedCenter = {
          x:
            bottomSpringLeft +
            cnotSpringExpandedLength(runtime.springBottom) +
            bottomQubitRect.width / 2,
          y: bottomWindowCenter.y,
        };
        await Promise.all([
          movePlaygroundQubitToPoint(
            topQubit,
            topEjectedCenter.x,
            topEjectedCenter.y,
            GATE_PLATFORM_EXTEND_MS,
          ),
          movePlaygroundQubitToPoint(
            bottomQubit,
            bottomEjectedCenter.x,
            bottomEjectedCenter.y,
            GATE_PLATFORM_EXTEND_MS,
          ),
        ]);
        settlePlaygroundQubitVisualState(topQubit);
        settlePlaygroundQubitVisualState(bottomQubit);
        runtime.body.classList.remove("platform-extended");
        await wait(GATE_PLATFORM_RETRACT_MS);
        return true;
      } finally {
        runtime.slotOccupants.top = null;
        runtime.slotOccupants.bottom = null;
        runtime.body.classList.remove("platform-extended");
        runtime.item.classList.remove("gate-busy");
        runtime.busy = false;
        topState.transiting = false;
        bottomState.transiting = false;
        runtime.cyclePromise = null;
      }
    })();
    return runtime.cyclePromise;
  };

  const runPlaygroundCnotIngress = async (qubitItem, runtime, slot) => {
    if (
      !isPlaygroundQubitItem(qubitItem) ||
      !runtime ||
      runtime.busy ||
      (slot !== "top" && slot !== "bottom") ||
      layoutEditorState.enabled
    ) {
      return false;
    }
    const qubitState = ensurePlaygroundQubitRuntimeState(qubitItem);
    if (!qubitState || qubitState.transiting) {
      return false;
    }
    const slotKey = slot === "top" ? "top" : "bottom";
    const otherSlotKey = slotKey === "top" ? "bottom" : "top";
    const existing = runtime.slotOccupants[slotKey];
    if (existing && existing !== qubitItem) {
      return false;
    }
    if (runtime.slotOccupants[otherSlotKey] === qubitItem) {
      runtime.slotOccupants[otherSlotKey] = null;
    }

    qubitState.transiting = true;
    runtime.slotOccupants[slotKey] = qubitItem;
    if (dragState && dragState.item === qubitItem) {
      qubitItem.classList.remove("dragging");
      dragState = null;
    }
    try {
      const targetWindow =
        slotKey === "top" ? runtime.windowTop : runtime.windowBottom;
      const center = canvasPointForElementCenter(targetWindow);
      await movePlaygroundQubitToPoint(
        qubitItem,
        center.x,
        center.y,
        AUTO_TRAVEL_MS,
      );
      settlePlaygroundQubitVisualState(qubitItem);
      setPlaygroundQubitCenter(qubitItem, center.x, center.y);
    } finally {
      qubitState.transiting = false;
    }

    if (
      runtime.slotOccupants.top instanceof HTMLElement &&
      runtime.slotOccupants.bottom instanceof HTMLElement
    ) {
      runPlaygroundCnotCycle(runtime).catch(() => {});
    }
    return true;
  };

  const maybeSnapPlaygroundQubitToCnot = (qubitItem) => {
    if (layoutEditorState.enabled || !isPlaygroundQubitItem(qubitItem)) {
      return false;
    }
    const qubitState = ensurePlaygroundQubitRuntimeState(qubitItem);
    if (!qubitState || qubitState.transiting) {
      return false;
    }
    const target = findBestPlaygroundCnotRuntimeForQubit(qubitItem);
    if (!target) {
      return false;
    }
    runPlaygroundCnotIngress(qubitItem, target.runtime, target.slot).catch(
      () => {},
    );
    return true;
  };

  const ensurePlaygroundSingleMeasurementRuntime = (item) => {
    if (!isPlaygroundSingleMeasurementItem(item)) {
      return null;
    }
    const existing = playgroundSingleMeasurementRuntime.get(item);
    if (existing) {
      return existing;
    }

    const measurementTool = item.querySelector(
      '[data-role="measurement-tool"]',
    );
    const measureLens = item.querySelector('[data-role="measure-lens"]');
    const tubeBlue = item.querySelector('[data-role="tube-blue"]');
    const tubeRed = item.querySelector('[data-role="tube-red"]');
    const tubeBlueCount = item.querySelector('[data-role="tube-blue-count"]');
    const tubeRedCount = item.querySelector('[data-role="tube-red-count"]');
    const tubeBlueLiquid = item.querySelector('[data-role="tube-blue-liquid"]');
    const tubeRedLiquid = item.querySelector('[data-role="tube-red-liquid"]');
    const tubeCapacity = item.querySelector('[data-role="tube-capacity"]');
    if (
      !(measurementTool instanceof HTMLElement) ||
      !(measureLens instanceof HTMLElement) ||
      !(tubeBlue instanceof HTMLElement) ||
      !(tubeRed instanceof HTMLElement) ||
      !(tubeBlueCount instanceof HTMLElement) ||
      !(tubeRedCount instanceof HTMLElement) ||
      !(tubeBlueLiquid instanceof HTMLElement) ||
      !(tubeRedLiquid instanceof HTMLElement)
    ) {
      return null;
    }

    const runtime = {
      item,
      measurementTool,
      measureLens,
      tubeBlue,
      tubeRed,
      tubeBlueCount,
      tubeRedCount,
      tubeBlueLiquid,
      tubeRedLiquid,
      tubeCapacity: tubeCapacity instanceof HTMLElement ? tubeCapacity : null,
      tubeQubitCapacity: INITIAL_TUBE_QUBIT_CAPACITY,
      blueTubeCount: Number.parseInt(tubeBlueCount.textContent || "0", 10) || 0,
      redTubeCount: Number.parseInt(tubeRedCount.textContent || "0", 10) || 0,
      busy: false,
    };

    updatePlaygroundMeasurementTubeFills(runtime);
    playgroundSingleMeasurementRuntime.set(item, runtime);
    return runtime;
  };

  function updatePlaygroundMeasurementTubeFills(runtime) {
    const blueFillPercent = Math.min(
      (runtime.blueTubeCount / runtime.tubeQubitCapacity) * 100,
      100,
    );
    const redFillPercent = Math.min(
      (runtime.redTubeCount / runtime.tubeQubitCapacity) * 100,
      100,
    );
    runtime.tubeBlueCount.textContent = String(runtime.blueTubeCount);
    runtime.tubeRedCount.textContent = String(runtime.redTubeCount);
    runtime.tubeBlueLiquid.style.height = `${blueFillPercent}%`;
    runtime.tubeRedLiquid.style.height = `${redFillPercent}%`;
    if (runtime.tubeCapacity) {
      runtime.tubeCapacity.textContent = `The testtubes can each hold ${runtime.tubeQubitCapacity} qubits.`;
    }
  }

  const maybeExpandPlaygroundMeasurementTubeCapacity = (runtime) => {
    const largestTubeCount = Math.max(
      runtime.blueTubeCount,
      runtime.redTubeCount,
    );
    while (largestTubeCount > runtime.tubeQubitCapacity) {
      runtime.tubeQubitCapacity *= 2;
    }
  };

  const collapsePlaygroundQubitState = (qubitItem) => {
    const qubitState = ensurePlaygroundQubitRuntimeState(qubitItem);
    if (!qubitState) {
      return "blue";
    }
    if (qubitState.pairState && Number.isFinite(qubitState.pairQubitIndex)) {
      const color = sampleSingleQubitOutcomeFromPairState(
        qubitState.pairState,
        qubitState.pairQubitIndex,
      );
      collapsePlaygroundSingleQubitFromPair(qubitItem, color);
      return color;
    }
    const [blueProbability] = probabilitiesFromVector2(qubitState.vector);
    const collapseToBlue =
      blueProbability >= 1 ||
      (blueProbability > 0 && Math.random() < blueProbability);
    qubitState.vector = collapseToBlue ? [1, 0] : [0, 1];
    qubitState.cnotSourceSlot = null;
    qubitState.cnotPairToken = null;
    qubitState.cnotOutcomeProbabilities = null;
    qubitState.doubleMeasurementReturnPoint = null;
    applyPlaygroundQubitVectorVisualState(qubitItem);
    return collapseToBlue ? "blue" : "red";
  };

  const createPlaygroundMeasurementPayload = (color, startPoint) => {
    const payload = document.createElement("span");
    payload.className = "qubit measurement-pellet measurement-square-pellet";
    payload.setAttribute("aria-hidden", "true");
    payload.style.left = `${startPoint.x}px`;
    payload.style.top = `${startPoint.y}px`;
    payload.style.pointerEvents = "none";
    payload.style.setProperty(
      "--qubit-fill",
      color === "blue" ? blendBlueRed(1, 0) : blendBlueRed(0, 1),
    );
    playgroundCanvas.appendChild(payload);
    return payload;
  };

  const movePlaygroundPayloadToPoint = (
    payload,
    x,
    y,
    duration = AUTO_TRAVEL_MS,
  ) =>
    new Promise((resolve) => {
      payload.style.setProperty("--move-duration", `${duration}ms`);
      payload.classList.add("migrating");
      payload.getBoundingClientRect();
      payload.style.left = `${x}px`;
      payload.style.top = `${y}px`;
      window.setTimeout(resolve, duration);
    });

  const animatePlaygroundMeasurementPayloadToTube = async (
    runtime,
    collapsedColor,
    startPoint,
    { migrationDuration = AUTO_TRAVEL_MS, meltDuration = AUTO_MELT_MS } = {},
  ) => {
    const payload = createPlaygroundMeasurementPayload(
      collapsedColor,
      startPoint,
    );
    try {
      const targetTube =
        collapsedColor === "blue" ? runtime.tubeBlue : runtime.tubeRed;
      const targetRect = targetTube.getBoundingClientRect();
      const targetPoint = viewportPointToCanvasPoint(
        targetRect.left + targetRect.width / 2,
        targetRect.top + targetRect.height * 0.22,
      );

      await movePlaygroundPayloadToPoint(
        payload,
        targetPoint.x,
        targetPoint.y,
        migrationDuration,
      );

      payload.style.setProperty("--melt-duration", `${meltDuration}ms`);
      payload.classList.add("melting");
      await wait(meltDuration);

      if (collapsedColor === "blue") {
        runtime.blueTubeCount += 1;
      } else {
        runtime.redTubeCount += 1;
      }

      maybeExpandPlaygroundMeasurementTubeCapacity(runtime);
      updatePlaygroundMeasurementTubeFills(runtime);
      return true;
    } finally {
      payload.remove();
    }
  };

  const runPlaygroundSingleMeasurementTransit = async (
    qubitItem,
    measurementRuntime,
  ) => {
    if (
      !isPlaygroundQubitItem(qubitItem) ||
      !measurementRuntime ||
      layoutEditorState.enabled
    ) {
      return false;
    }
    const qubitState = ensurePlaygroundQubitRuntimeState(qubitItem);
    if (!qubitState || qubitState.transiting || measurementRuntime.busy) {
      return false;
    }

    qubitState.transiting = true;
    measurementRuntime.busy = true;
    if (dragState && dragState.item === qubitItem) {
      qubitItem.classList.remove("dragging");
      dragState = null;
    }

    try {
      const lensCircle = playgroundLensCircle(measurementRuntime);
      if (!lensCircle) {
        return false;
      }
      const lensCenter = viewportPointToCanvasPoint(lensCircle.x, lensCircle.y);
      setPlaygroundQubitCenter(qubitItem, lensCenter.x, lensCenter.y);
      settlePlaygroundQubitVisualState(qubitItem);

      const core = getPlaygroundQubitCore(qubitItem);
      if (core instanceof HTMLElement) {
        core.classList.add("collapse-animating");
      }
      const collapsedColor = collapsePlaygroundQubitState(qubitItem);
      if (core instanceof HTMLElement) {
        core.classList.remove("collapse-animating");
      }

      await animatePlaygroundMeasurementPayloadToTube(
        measurementRuntime,
        collapsedColor,
        lensCenter,
      );

      setPlaygroundQubitCenter(qubitItem, lensCenter.x + 100, lensCenter.y);
      return true;
    } finally {
      const core = getPlaygroundQubitCore(qubitItem);
      if (core instanceof HTMLElement) {
        core.classList.remove("collapse-animating");
      }
      qubitState.transiting = false;
      measurementRuntime.busy = false;
    }
  };

  const findBestPlaygroundMeasurementRuntimeForQubit = (qubitItem) => {
    prunePlaygroundRuntimeState();
    let bestRuntime = null;
    let bestOverlap = PLAYGROUND_MEASUREMENT_OVERLAP_THRESHOLD;
    const measurementItems = playgroundCanvas.querySelectorAll(
      '.playground-node[data-component="single-measurement"]',
    );
    measurementItems.forEach((measurementItem) => {
      const runtime = ensurePlaygroundSingleMeasurementRuntime(measurementItem);
      if (!runtime || runtime.busy) {
        return;
      }
      const overlap = Math.max(
        playgroundQubitOverlapRatioWithLens(qubitItem, runtime),
        qubitOverlapRatioWithRect(qubitItem, runtime.measurementTool),
      );
      if (overlap >= bestOverlap) {
        bestOverlap = overlap;
        bestRuntime = runtime;
      }
    });
    return bestRuntime;
  };

  const maybeSnapPlaygroundQubitToSingleMeasurement = (qubitItem) => {
    if (layoutEditorState.enabled || !isPlaygroundQubitItem(qubitItem)) {
      return false;
    }
    const qubitState = ensurePlaygroundQubitRuntimeState(qubitItem);
    if (!qubitState || qubitState.transiting) {
      return false;
    }
    const measurementRuntime =
      findBestPlaygroundMeasurementRuntimeForQubit(qubitItem);
    if (!measurementRuntime) {
      return false;
    }
    runPlaygroundSingleMeasurementTransit(qubitItem, measurementRuntime).catch(
      () => {},
    );
    return true;
  };

  const playgroundMailboxQubitIndex = (qubitItem) => {
    const qubits = Array.from(
      playgroundCanvas.querySelectorAll(
        ':scope > .playground-node[data-component="qubit"]',
      ),
    );
    const index = qubits.indexOf(qubitItem);
    return index >= 0 ? index : 0;
  };

  const findBestPlaygroundMailboxForQubit = (qubitItem) => {
    let bestMailbox = null;
    let bestOverlap = MAILBOX_WINDOW_OVERLAP_THRESHOLD;
    playgroundCanvas
      .querySelectorAll(':scope > .playground-node[data-component="mailbox"]')
      .forEach((mailboxItem) => {
        if (!isPlaygroundMailboxItem(mailboxItem)) {
          return;
        }
        const mailboxFunnel = mailboxItem.querySelector(
          '[data-role="mailbox-input-funnel"]',
        );
        if (!(mailboxFunnel instanceof HTMLElement)) {
          return;
        }
        const overlap = qubitOverlapRatioWithRect(qubitItem, mailboxFunnel);
        if (overlap >= bestOverlap) {
          bestOverlap = overlap;
          bestMailbox = mailboxItem;
        }
      });
    return bestMailbox;
  };

  const maybeSnapPlaygroundQubitToMailbox = (qubitItem) => {
    if (layoutEditorState.enabled || !isPlaygroundQubitItem(qubitItem)) {
      return false;
    }
    const qubitState = ensurePlaygroundQubitRuntimeState(qubitItem);
    if (!qubitState || qubitState.transiting) {
      return false;
    }
    const mailboxItem = findBestPlaygroundMailboxForQubit(qubitItem);
    if (!mailboxItem) {
      return false;
    }
    const mailboxFunnel = mailboxItem.querySelector(
      '[data-role="mailbox-input-funnel"]',
    );
    if (mailboxFunnel instanceof HTMLElement) {
      const center = canvasPointForElementCenter(mailboxFunnel);
      setPlaygroundQubitCenter(qubitItem, center.x, center.y);
    }
    setMailboxComponentStatus(mailboxItem, "");
    handleMailboxQubitPlaced({
      mailboxItem,
      qubitItem,
      qubitIndex: playgroundMailboxQubitIndex(qubitItem),
    });
    return true;
  };

  const updatePlaygroundDoubleMeasurementTubeFills = (runtime) => {
    Object.entries(runtime.tubeCounts).forEach(([key, count]) => {
      const countElement = runtime.countElements[key];
      const liquidElement = runtime.liquidElements[key];
      if (!countElement || !liquidElement) {
        return;
      }
      countElement.textContent = String(count);
      const percent = Math.min((count / runtime.tubePairCapacity) * 100, 100);
      liquidElement.style.height = `${percent}%`;
    });
    if (runtime.capacityElement) {
      runtime.capacityElement.textContent = `The testtubes can each hold ${runtime.tubePairCapacity} qubit pairs.`;
    }
  };

  const maybeExpandPlaygroundDoubleMeasurementTubeCapacity = (runtime) => {
    let maxCount = 0;
    Object.values(runtime.tubeCounts).forEach((count) => {
      if (count > maxCount) {
        maxCount = count;
      }
    });
    while (maxCount > runtime.tubePairCapacity) {
      runtime.tubePairCapacity *= 2;
    }
  };

  const ensurePlaygroundDoubleMeasurementRuntime = (item) => {
    if (!isPlaygroundDoubleMeasurementItem(item)) {
      return null;
    }
    const existing = playgroundDoubleMeasurementRuntime.get(item);
    if (existing) {
      return existing;
    }

    const measurementTool = item.querySelector('[data-role="pair-lens"]');
    const measurementFunnel = item.querySelector(
      '[data-role="pair-measurement-funnel"]',
    );
    const slotLeft = item.querySelector('[data-role="pair-slot-left"]');
    const slotRight = item.querySelector('[data-role="pair-slot-right"]');
    const platform = item.querySelector(".pair-measurement-platform");
    const capacity = item.querySelector('[data-role="pair-capacity"]');
    const columns = Array.from(
      item.querySelectorAll(".pair-tube-column[data-key]"),
    );
    if (
      !(measurementTool instanceof HTMLElement) ||
      !(measurementFunnel instanceof HTMLElement) ||
      !(slotLeft instanceof HTMLElement) ||
      !(slotRight instanceof HTMLElement) ||
      !(platform instanceof HTMLElement)
    ) {
      return null;
    }

    const tubeElements = {};
    const liquidElements = {};
    const countElements = {};
    columns.forEach((column) => {
      const key = column.dataset.key;
      if (!key) {
        return;
      }
      const tube = column.querySelector(".pair-tube");
      const liquid = column.querySelector(".tube-liquid");
      const count = column.querySelector(".tube-count");
      if (
        tube instanceof HTMLElement &&
        liquid instanceof HTMLElement &&
        count instanceof HTMLElement
      ) {
        tubeElements[key] = tube;
        liquidElements[key] = liquid;
        countElements[key] = count;
      }
    });
    const requiredKeys = ["bb", "br", "rb", "rr"];
    if (
      !requiredKeys.every(
        (key) => tubeElements[key] && liquidElements[key] && countElements[key],
      )
    ) {
      return null;
    }

    const runtime = {
      item,
      measurementTool,
      measurementFunnel,
      slotLeft,
      slotRight,
      platform,
      capacityElement: capacity instanceof HTMLElement ? capacity : null,
      tubeElements,
      liquidElements,
      countElements,
      tubeCounts: {
        bb: Number.parseInt(countElements.bb.textContent || "0", 10) || 0,
        br: Number.parseInt(countElements.br.textContent || "0", 10) || 0,
        rb: Number.parseInt(countElements.rb.textContent || "0", 10) || 0,
        rr: Number.parseInt(countElements.rr.textContent || "0", 10) || 0,
      },
      tubePairCapacity: INITIAL_TUBE_QUBIT_CAPACITY,
      slotOccupants: {
        left: null,
        right: null,
      },
      busy: false,
      cyclePromise: null,
    };
    updatePlaygroundDoubleMeasurementTubeFills(runtime);
    playgroundDoubleMeasurementRuntime.set(item, runtime);
    return runtime;
  };

  const releasePlaygroundQubitFromDoubleMeasurementSlots = (qubitItem) => {
    if (!isPlaygroundQubitItem(qubitItem)) {
      return;
    }
    prunePlaygroundRuntimeState();
    Array.from(playgroundDoubleMeasurementRuntime.values()).forEach(
      (runtime) => {
        if (runtime.slotOccupants.left === qubitItem) {
          runtime.slotOccupants.left = null;
        }
        if (runtime.slotOccupants.right === qubitItem) {
          runtime.slotOccupants.right = null;
        }
      },
    );
  };

  const playgroundDoubleMeasurementLensCircle = (runtime) => {
    if (!runtime?.measurementTool) {
      return null;
    }
    const lensRect = runtime.measurementTool.getBoundingClientRect();
    const radius = Math.min(lensRect.width, lensRect.height) / 2;
    if (radius <= 0) {
      return null;
    }
    return {
      x: lensRect.left + lensRect.width / 2,
      y: lensRect.top + lensRect.height / 2,
      radius,
    };
  };

  const playgroundQubitOverlapRatioWithDoubleMeasurementLens = (
    qubitItem,
    runtime,
  ) => {
    const lensCircle = playgroundDoubleMeasurementLensCircle(runtime);
    if (!lensCircle) {
      return 0;
    }
    const qubitRect = qubitItem.getBoundingClientRect();
    const qRadius = qubitRect.width / 2;
    if (qRadius <= 0) {
      return 0;
    }
    const qCx = qubitRect.left + qRadius;
    const qCy = qubitRect.top + qRadius;
    const distance = Math.hypot(qCx - lensCircle.x, qCy - lensCircle.y);
    const overlapArea = circleIntersectionArea(
      qRadius,
      lensCircle.radius,
      distance,
    );
    const qubitArea = Math.PI * qRadius * qRadius;
    return qubitArea > 0 ? overlapArea / qubitArea : 0;
  };

  const findBestPlaygroundDoubleMeasurementRuntimeForQubit = (qubitItem) => {
    prunePlaygroundRuntimeState();
    let bestRuntime = null;
    let bestOverlap = PLAYGROUND_MEASUREMENT_OVERLAP_THRESHOLD;
    const measurementItems = playgroundCanvas.querySelectorAll(
      '.playground-node[data-component="double-measurement"]',
    );
    measurementItems.forEach((measurementItem) => {
      const runtime = ensurePlaygroundDoubleMeasurementRuntime(measurementItem);
      if (!runtime || runtime.busy) {
        return;
      }
      const overlap = Math.max(
        playgroundQubitOverlapRatioWithDoubleMeasurementLens(
          qubitItem,
          runtime,
        ),
        qubitOverlapRatioWithRect(qubitItem, runtime.measurementTool),
      );
      if (overlap >= bestOverlap) {
        bestOverlap = overlap;
        bestRuntime = runtime;
      }
    });
    return bestRuntime;
  };

  const slotForPlaygroundDoubleMeasurementIngress = (qubitState, runtime) => {
    if (qubitState?.cnotSourceSlot === "top") {
      return "right";
    }
    if (qubitState?.cnotSourceSlot === "bottom") {
      return "left";
    }
    if (!runtime.slotOccupants.right) {
      return "right";
    }
    if (!runtime.slotOccupants.left) {
      return "left";
    }
    return null;
  };

  const playgroundDoubleMeasurementSlotCenter = (runtime, slot) => {
    const slotElement = slot === "left" ? runtime.slotLeft : runtime.slotRight;
    const slotRect = slotElement.getBoundingClientRect();
    const hasVisibleSlotGeometry =
      slotRect.width > 4 &&
      slotRect.height > 4 &&
      window.getComputedStyle(slotElement).display !== "none";
    if (hasVisibleSlotGeometry) {
      const center = canvasPointForElementCenter(slotElement);
      return {
        x: center.x + TWO_QUBIT_MEASUREMENT_SLOT_SHIFT_X,
        y: center.y + TWO_QUBIT_MEASUREMENT_SLOT_SHIFT_Y,
      };
    }
    const lensRect = runtime.measurementTool.getBoundingClientRect();
    const lensCenter = viewportPointToCanvasPoint(
      lensRect.left + lensRect.width / 2,
      lensRect.top + lensRect.height / 2,
    );
    const laneOffset = Math.max(20, lensRect.width * 0.12);
    return {
      x:
        lensCenter.x +
        (slot === "right" ? laneOffset : -laneOffset) +
        TWO_QUBIT_MEASUREMENT_SLOT_SHIFT_X,
      y: lensCenter.y + TWO_QUBIT_MEASUREMENT_SLOT_SHIFT_Y,
    };
  };

  const playgroundDoubleMeasurementSourcePoint = (qubitItem, qubitState) => {
    if (validPoint(qubitState?.doubleMeasurementReturnPoint)) {
      return qubitState.doubleMeasurementReturnPoint;
    }
    return canvasPointForElementCenter(qubitItem);
  };

  const playgroundDoubleMeasurementOrderedQubits = (
    leftQubit,
    rightQubit,
    leftState,
    rightState,
  ) => {
    if (
      leftState?.cnotSourceSlot === "top" &&
      rightState?.cnotSourceSlot === "bottom"
    ) {
      return { topQubit: leftQubit, bottomQubit: rightQubit };
    }
    if (
      rightState?.cnotSourceSlot === "top" &&
      leftState?.cnotSourceSlot === "bottom"
    ) {
      return { topQubit: rightQubit, bottomQubit: leftQubit };
    }
    if (
      leftState?.pairQubitIndex === 0 &&
      rightState?.pairQubitIndex === 1
    ) {
      return { topQubit: leftQubit, bottomQubit: rightQubit };
    }
    if (
      rightState?.pairQubitIndex === 0 &&
      leftState?.pairQubitIndex === 1
    ) {
      return { topQubit: rightQubit, bottomQubit: leftQubit };
    }
    const leftPoint = playgroundDoubleMeasurementSourcePoint(
      leftQubit,
      leftState,
    );
    const rightPoint = playgroundDoubleMeasurementSourcePoint(
      rightQubit,
      rightState,
    );
    return leftPoint.y <= rightPoint.y
      ? { topQubit: leftQubit, bottomQubit: rightQubit }
      : { topQubit: rightQubit, bottomQubit: leftQubit };
  };

  const collapsePlaygroundQubitPairFromCnot = (
    topQubitItem,
    bottomQubitItem,
  ) => {
    const topState = ensurePlaygroundQubitRuntimeState(topQubitItem);
    const bottomState = ensurePlaygroundQubitRuntimeState(bottomQubitItem);
    if (!topState || !bottomState) {
      return null;
    }

    let argumentOutcomeKey = "bb";
    if (runtimeStatesSharePairState(topState, bottomState)) {
      const stateOrderOutcome = samplePairOutcomeForRegisterMembers(
        topState.pairState,
        topState.pairQubitIndex,
        bottomState.pairQubitIndex,
      );
      collapseRegisterStateMembersToOutcome(
        topState.pairState,
        topState.pairQubitIndex,
        bottomState.pairQubitIndex,
        stateOrderOutcome,
      );
      syncPlaygroundPairStateVisuals(topState.pairState);
      argumentOutcomeKey = outcomeKeyForPairStatesInArgumentOrder(
        stateOrderOutcome,
        topState,
        bottomState,
      );
    } else {
      const productState = {
        amplitudes: entangledAmplitudesFromQubitVectors(
          topState.vector,
          bottomState.vector,
        ),
      };
      argumentOutcomeKey = samplePairOutcomeFromEntangledState(productState);
    }
    const topBlue = argumentOutcomeKey[0] === "b";
    const bottomBlue = argumentOutcomeKey[1] === "b";
    topState.vector = topBlue ? [1, 0] : [0, 1];
    bottomState.vector = bottomBlue ? [1, 0] : [0, 1];
    topState.pairState = null;
    bottomState.pairState = null;
    topState.pairQubitIndex = null;
    bottomState.pairQubitIndex = null;
    topState.cnotSourceSlot = null;
    bottomState.cnotSourceSlot = null;
    topState.cnotPairToken = null;
    bottomState.cnotPairToken = null;
    topState.cnotOutcomeProbabilities = null;
    bottomState.cnotOutcomeProbabilities = null;
    applyPlaygroundQubitVectorVisualState(topQubitItem);
    applyPlaygroundQubitVectorVisualState(bottomQubitItem);
    return {
      outcomeKey: argumentOutcomeKey,
      topColor: topBlue ? "blue" : "red",
      bottomColor: bottomBlue ? "blue" : "red",
    };
  };

  const runPlaygroundDoubleMeasurementCycle = async (runtime) => {
    if (runtime.cyclePromise) {
      return runtime.cyclePromise;
    }
    if (
      runtime.busy ||
      !(runtime.slotOccupants.left instanceof HTMLElement) ||
      !(runtime.slotOccupants.right instanceof HTMLElement)
    ) {
      return null;
    }

    const leftQubit = runtime.slotOccupants.left;
    const rightQubit = runtime.slotOccupants.right;
    const leftState = ensurePlaygroundQubitRuntimeState(leftQubit);
    const rightState = ensurePlaygroundQubitRuntimeState(rightQubit);
    if (!leftState || !rightState) {
      return null;
    }

    runtime.busy = true;
    leftState.transiting = true;
    rightState.transiting = true;
    runtime.measurementTool.classList.remove("platform-extended");
    runtime.cyclePromise = (async () => {
      try {
        await wait(DOUBLE_MEASUREMENT_COLLAPSE_DELAY_MS);
        if (
          layoutEditorState.enabled ||
          !leftQubit.isConnected ||
          !rightQubit.isConnected ||
          runtime.slotOccupants.left !== leftQubit ||
          runtime.slotOccupants.right !== rightQubit
        ) {
          return false;
        }

        leftQubit.classList.add("collapse-animating");
        rightQubit.classList.add("collapse-animating");
        const orderedQubits = playgroundDoubleMeasurementOrderedQubits(
          leftQubit,
          rightQubit,
          leftState,
          rightState,
        );
        const collapseResult = collapsePlaygroundQubitPairFromCnot(
          orderedQubits.topQubit,
          orderedQubits.bottomQubit,
        );
        leftQubit.classList.remove("collapse-animating");
        rightQubit.classList.remove("collapse-animating");
        if (!collapseResult) {
          return false;
        }

        await wait(DOUBLE_MEASUREMENT_POST_COLLAPSE_DELAY_MS);
        if (
          !leftQubit.isConnected ||
          !rightQubit.isConnected ||
          runtime.slotOccupants.left !== leftQubit ||
          runtime.slotOccupants.right !== rightQubit
        ) {
          return false;
        }

        runtime.tubeCounts[collapseResult.outcomeKey] += 1;
        maybeExpandPlaygroundDoubleMeasurementTubeCapacity(runtime);
        updatePlaygroundDoubleMeasurementTubeFills(runtime);

        const leftSource =
          validPoint(leftState.doubleMeasurementReturnPoint) ||
          playgroundDoubleMeasurementSlotCenter(runtime, "left");
        const rightSource =
          validPoint(rightState.doubleMeasurementReturnPoint) ||
          playgroundDoubleMeasurementSlotCenter(runtime, "right");
        const leftReturn = leftSource;
        const rightReturn = rightSource;

        await Promise.all([
          movePlaygroundQubitToPoint(
            leftQubit,
            leftReturn.x,
            leftReturn.y,
            AUTO_TRAVEL_MS,
          ),
          movePlaygroundQubitToPoint(
            rightQubit,
            rightReturn.x,
            rightReturn.y,
            AUTO_TRAVEL_MS,
          ),
        ]);
        settlePlaygroundQubitVisualState(leftQubit);
        settlePlaygroundQubitVisualState(rightQubit);
        return true;
      } finally {
        leftQubit.classList.remove("collapse-animating");
        rightQubit.classList.remove("collapse-animating");
        runtime.slotOccupants.left = null;
        runtime.slotOccupants.right = null;
        leftState.doubleMeasurementReturnPoint = null;
        rightState.doubleMeasurementReturnPoint = null;
        runtime.busy = false;
        leftState.transiting = false;
        rightState.transiting = false;
        runtime.cyclePromise = null;
      }
    })();
    return runtime.cyclePromise;
  };

  const runPlaygroundDoubleMeasurementIngress = async (qubitItem, runtime) => {
    if (
      !isPlaygroundQubitItem(qubitItem) ||
      !runtime ||
      runtime.busy ||
      layoutEditorState.enabled
    ) {
      return false;
    }
    const qubitState = ensurePlaygroundQubitRuntimeState(qubitItem);
    if (!qubitState || qubitState.transiting) {
      return false;
    }

    const slot = slotForPlaygroundDoubleMeasurementIngress(qubitState, runtime);
    if (slot !== "left" && slot !== "right") {
      return false;
    }
    const existing = runtime.slotOccupants[slot];
    if (existing && existing !== qubitItem) {
      return false;
    }
    const otherSlot = slot === "left" ? "right" : "left";
    if (runtime.slotOccupants[otherSlot] === qubitItem) {
      runtime.slotOccupants[otherSlot] = null;
    }

    qubitState.doubleMeasurementReturnPoint =
      validPoint(
        dragState?.item === qubitItem ? dragState.startPoint : null,
      ) || canvasPointForElementCenter(qubitItem);
    qubitState.transiting = true;
    runtime.slotOccupants[slot] = qubitItem;
    if (dragState && dragState.item === qubitItem) {
      qubitItem.classList.remove("dragging");
      dragState = null;
    }

    try {
      const center = playgroundDoubleMeasurementSlotCenter(runtime, slot);
      await movePlaygroundQubitToPoint(
        qubitItem,
        center.x,
        center.y,
        AUTO_TRAVEL_MS,
      );
      settlePlaygroundQubitVisualState(qubitItem);
      setPlaygroundQubitCenter(qubitItem, center.x, center.y);
    } finally {
      qubitState.transiting = false;
    }

    if (
      runtime.slotOccupants.left instanceof HTMLElement &&
      runtime.slotOccupants.right instanceof HTMLElement
    ) {
      runPlaygroundDoubleMeasurementCycle(runtime).catch(() => {});
    }
    return true;
  };

  const maybeSnapPlaygroundQubitToDoubleMeasurement = (qubitItem) => {
    if (layoutEditorState.enabled || !isPlaygroundQubitItem(qubitItem)) {
      return false;
    }
    const qubitState = ensurePlaygroundQubitRuntimeState(qubitItem);
    if (!qubitState || qubitState.transiting) {
      return false;
    }
    const runtime =
      findBestPlaygroundDoubleMeasurementRuntimeForQubit(qubitItem);
    if (!runtime) {
      return false;
    }
    runPlaygroundDoubleMeasurementIngress(qubitItem, runtime).catch(() => {});
    return true;
  };

  const continuePlaygroundGateDialDrag = (event) => {
    if (layoutEditorState.enabled) {
      return;
    }
    prunePlaygroundRuntimeState();
    Array.from(playgroundSingleGateRuntime.values()).forEach((runtime) => {
      runtime.dial?.continueDrag(event);
    });
  };

  const endPlaygroundGateDialDrag = () => {
    prunePlaygroundRuntimeState();
    Array.from(playgroundSingleGateRuntime.values()).forEach((runtime) => {
      runtime.dial?.endDrag();
    });
  };

  const positionItemFromClientPoint = (item, clientX, clientY) => {
    const canvasRect = playgroundCanvas.getBoundingClientRect();
    const pointerX = clientX - canvasRect.left + playgroundCanvas.scrollLeft;
    const pointerY = clientY - canvasRect.top + playgroundCanvas.scrollTop;
    const unclampedLeft = pointerX - item.offsetWidth / 2;
    const unclampedTop = pointerY - 18;
    const clamped = clampItemPosition(item, unclampedLeft, unclampedTop);
    item.style.left = `${Math.round(clamped.left)}px`;
    item.style.top = `${Math.round(clamped.top)}px`;
  };

  const pointerIsOnResizeCorner = (item, point) => {
    if (!point) {
      return false;
    }
    const rect = item.getBoundingClientRect();
    const cornerInset = 18;
    return (
      point.clientX >= rect.right - cornerInset &&
      point.clientY >= rect.bottom - cornerInset
    );
  };

  const findPlaygroundMeasurementPartFromEvent = (item, event) => {
    if (
      !layoutEditorState.enabled ||
      (!isPlaygroundMeasurementItem(item) &&
        !isPlaygroundEditableSavedGroupItem(item))
    ) {
      return null;
    }
    const origin = event.target;
    if (!(origin instanceof Element)) {
      return null;
    }
    const part = origin.closest("[data-playground-measurement-part]");
    if (part instanceof HTMLElement && item.contains(part)) {
      return part;
    }
    return null;
  };

  const beginPlaygroundMeasurementPartGesture = (item, part, event) => {
    const point = getPointer(event);
    if (!point) {
      return false;
    }
    const canResize = part.dataset.layoutResizable === "true";
    const isResizeHandle =
      event.target instanceof Element &&
      Boolean(event.target.closest(".layout-resize-handle"));
    const mode =
      canResize && (isResizeHandle || pointerNearResizeCorner(part, point, 18))
        ? "resize"
        : "move";
    const initialTranslate = layoutTargetTranslate(part);
    const rect = part.getBoundingClientRect();
    measurementPartGesture = {
      item,
      part,
      mode,
      startX: point.clientX,
      startY: point.clientY,
      startTx: initialTranslate.x,
      startTy: initialTranslate.y,
      startWidth: rect.width,
      startHeight: rect.height,
      uniformResize: part.dataset.layoutUniformResize === "true",
      minWidth: parseLayoutNumeric(part.dataset.layoutMinWidth, 24),
      minHeight: parseLayoutNumeric(part.dataset.layoutMinHeight, 24),
    };
    dragState = null;
    resizeState = null;
    part.classList.add("layout-edit-dragging");
    bringToFront(item);
    setSelectedItem(item, part);
    event.preventDefault();
    event.stopPropagation();
    return true;
  };

  const findPlaygroundCnotPartFromEvent = (item, event) => {
    if (!layoutEditorState.enabled || !isPlaygroundCnotItem(item)) {
      return null;
    }
    const origin = event.target;
    if (!(origin instanceof Element)) {
      return null;
    }
    const part = origin.closest("[data-playground-cnot-part]");
    if (part instanceof HTMLElement && item.contains(part)) {
      return part;
    }
    return null;
  };

  const beginPlaygroundCnotPartGesture = (item, part, event) => {
    const point = getPointer(event);
    if (!point) {
      return false;
    }
    const isResizeHandle =
      event.target instanceof Element &&
      Boolean(event.target.closest(".layout-resize-handle"));
    const mode =
      isResizeHandle || pointerNearResizeCorner(part, point, 18)
        ? "resize"
        : "move";
    const initialTranslate = layoutTargetTranslate(part);
    if (part.classList.contains("cnot-body")) {
      makeCnotBodyExplicitlySized(part);
    }
    const rect = part.getBoundingClientRect();
    cnotPartGesture = {
      item,
      part,
      mode,
      startX: point.clientX,
      startY: point.clientY,
      startTx: initialTranslate.x,
      startTy: initialTranslate.y,
      startWidth: rect.width,
      startHeight: rect.height,
      uniformResize: part.dataset.layoutUniformResize === "true",
      minWidth: parseLayoutNumeric(part.dataset.layoutMinWidth, 24),
      minHeight: parseLayoutNumeric(part.dataset.layoutMinHeight, 24),
    };
    dragState = null;
    resizeState = null;
    measurementPartGesture = null;
    part.classList.add("layout-edit-dragging");
    bringToFront(item);
    setSelectedItem(item, part);
    event.preventDefault();
    event.stopPropagation();
    return true;
  };

  const beginItemDrag = (item, event) => {
    const runtimeQubitDrag =
      !layoutEditorState.enabled && isPlaygroundQubitItem(item);
    if (!layoutEditorState.enabled && !runtimeQubitDrag) {
      return;
    }
    if (runtimeQubitDrag) {
      const state = ensurePlaygroundQubitRuntimeState(item);
      if (state?.transiting) {
        return;
      }
    }
    if (!isPrimaryMouseButton(event)) {
      return;
    }
    const point = getPointer(event);
    if (!point) {
      return;
    }
    const origin = event.target;
    if (!(origin instanceof Element)) {
      return;
    }
    if (
      layoutEditorState.enabled &&
      isWorkshopComponentMode() &&
      item.dataset.component === "single-gate" &&
      !pointerIsOnResizeCorner(item, point)
    ) {
      const gateDialControl = origin.closest(
        '[data-role="gate-arrow"], [data-role="ticks"], .arrow-layer, .tick',
      );
      if (
        gateDialControl instanceof Element ||
        pointerInsideGeneratedGateDial(item, point)
      ) {
        bringToFront(item);
        setSelectedItem(item);
        const runtime = ensurePlaygroundSingleGateRuntime(item);
        runtime?.dial?.beginDrag(event);
        return;
      }
    }
    if (
      layoutEditorState.enabled &&
      item.dataset.component === "double-measurement" &&
      !pointerIsOnResizeCorner(item, point)
    ) {
      const behindItem = layoutItemBehindPoint(playgroundCanvas, item, point);
      const isInteractiveMeasurementTarget = Boolean(
        origin.closest("[data-playground-measurement-part], .layout-resize-handle"),
      );
      if (
        behindItem &&
        (!isInteractiveMeasurementTarget ||
          behindItem.dataset.component === "qubit")
      ) {
        beginItemDrag(behindItem, event);
        return;
      }
    }
    if (layoutEditorState.enabled) {
      if (isWorkshopComponentMode()) {
        preparePlaygroundMeasurementParts(item);
        preparePlaygroundCnotParts(item);
        const measurementPart = findPlaygroundMeasurementPartFromEvent(
          item,
          event,
        );
        if (
          measurementPart &&
          beginPlaygroundMeasurementPartGesture(item, measurementPart, event)
        ) {
          return;
        }
        const cnotPart = findPlaygroundCnotPartFromEvent(item, event);
        if (cnotPart && beginPlaygroundCnotPartGesture(item, cnotPart, event)) {
          return;
        }
      }
    }
    if (layoutEditorState.enabled && pointerIsOnResizeCorner(item, point)) {
      const startWidth = item.offsetWidth;
      const startHeight = item.offsetHeight;
      resizeState = {
        item,
        startX: point.clientX,
        startY: point.clientY,
        startWidth,
        startHeight,
        aspectRatio: startHeight > 0 ? startWidth / startHeight : 1,
        cnotBaseline: captureCnotGeometryBaseline(item),
      };
      dragState = null;
      item.classList.add("resizing");
      bringToFront(item);
      setSelectedItem(item);
      event.preventDefault();
      return;
    }
    if (
      layoutEditorState.enabled &&
      item.dataset.component === "text-box" &&
      origin.closest('[data-role="text-box-body"]')
    ) {
      bringToFront(item);
      setSelectedItem(item, null, {
        additive: Boolean(event.shiftKey || event.metaKey || event.ctrlKey),
      });
      event.stopPropagation();
      return;
    }
    if (runtimeQubitDrag) {
      releasePlaygroundQubitFromCnotSlots(item);
      releasePlaygroundQubitFromDoubleMeasurementSlots(item);
    }
    bringToFront(item);
    setSelectedItem(item, null, {
      additive: Boolean(event.shiftKey || event.metaKey || event.ctrlKey),
    });
    const itemRect = item.getBoundingClientRect();
    dragState = {
      item,
      startPoint: isPlaygroundQubitItem(item)
        ? canvasPointForElementCenter(item)
        : null,
      pointerOffsetX: point.clientX - itemRect.left,
      pointerOffsetY: point.clientY - itemRect.top,
    };
    item.classList.add("dragging");
    event.preventDefault();
  };

  const continueItemDrag = (event) => {
    if (cnotPartGesture) {
      if (event.touches) {
        event.preventDefault();
      }
      const point = getPointer(event);
      if (!point) {
        return;
      }
      const deltaX = point.clientX - cnotPartGesture.startX;
      const deltaY = point.clientY - cnotPartGesture.startY;
      if (cnotPartGesture.mode === "resize") {
        let nextWidth = Math.max(
          cnotPartGesture.minWidth,
          cnotPartGesture.startWidth + deltaX,
        );
        let nextHeight = Math.max(
          cnotPartGesture.minHeight,
          cnotPartGesture.startHeight + deltaY,
        );
        if (cnotPartGesture.uniformResize) {
          const uniformSize = Math.max(
            nextWidth,
            nextHeight,
            cnotPartGesture.minWidth,
            cnotPartGesture.minHeight,
          );
          nextWidth = uniformSize;
          nextHeight = uniformSize;
        }
        cnotPartGesture.part.style.width = `${Math.round(nextWidth)}px`;
        cnotPartGesture.part.style.height = `${Math.round(nextHeight)}px`;
      } else {
        setLayoutTargetTranslate(
          cnotPartGesture.part,
          cnotPartGesture.startTx + deltaX,
          cnotPartGesture.startTy + deltaY,
        );
      }
      setLayoutManualEdited(cnotPartGesture.part, true);
      setLayoutManualEdited(cnotPartGesture.item, true);
      event.preventDefault();
      return;
    }
    if (measurementPartGesture) {
      if (event.touches) {
        event.preventDefault();
      }
      const point = getPointer(event);
      if (!point) {
        return;
      }
      const deltaX = point.clientX - measurementPartGesture.startX;
      const deltaY = point.clientY - measurementPartGesture.startY;
      if (measurementPartGesture.mode === "resize") {
        let nextWidth = Math.max(
          measurementPartGesture.minWidth,
          measurementPartGesture.startWidth + deltaX,
        );
        let nextHeight = Math.max(
          measurementPartGesture.minHeight,
          measurementPartGesture.startHeight + deltaY,
        );
        if (measurementPartGesture.uniformResize) {
          const uniformSize = Math.max(
            nextWidth,
            nextHeight,
            measurementPartGesture.minWidth,
            measurementPartGesture.minHeight,
          );
          nextWidth = uniformSize;
          nextHeight = uniformSize;
        }
        measurementPartGesture.part.style.width = `${Math.round(nextWidth)}px`;
        measurementPartGesture.part.style.height = `${Math.round(nextHeight)}px`;
      } else {
        setLayoutTargetTranslate(
          measurementPartGesture.part,
          measurementPartGesture.startTx + deltaX,
          measurementPartGesture.startTy + deltaY,
        );
      }
      setLayoutManualEdited(measurementPartGesture.part, true);
      setLayoutManualEdited(measurementPartGesture.item, true);
      event.preventDefault();
      return;
    }
    if (resizeState) {
      if (event.touches) {
        event.preventDefault();
      }
      const point = getPointer(event);
      if (!point) {
        return;
      }
      const deltaX = point.clientX - resizeState.startX;
      const deltaY = point.clientY - resizeState.startY;
      let width = resizeState.startWidth + deltaX;
      let height = resizeState.startHeight + deltaY;
      const forceUniformResize = isPlaygroundQubitItem(resizeState.item);
      if (event.shiftKey || forceUniformResize) {
        const ratio = forceUniformResize
          ? 1
          : resizeState.aspectRatio > 0
            ? resizeState.aspectRatio
            : 1;
        const widthDriven = resizeState.startWidth + deltaX;
        const heightDriven = (resizeState.startHeight + deltaY) * ratio;
        const preferredWidth =
          Math.abs(deltaX) >= Math.abs(deltaY) ? widthDriven : heightDriven;
        const limits = clampItemSize(
          resizeState.item,
          preferredWidth,
          resizeState.startHeight,
        );
        const minWidthForRatio = Math.max(
          limits.minWidth,
          limits.minHeight * ratio,
        );
        const maxWidthForRatio = Math.min(
          limits.maxWidth,
          limits.maxHeight * ratio,
        );
        const safeMinWidth = Math.min(minWidthForRatio, maxWidthForRatio);
        width = clamp(
          sizeSnapValue(resizeState.item, preferredWidth),
          safeMinWidth,
          maxWidthForRatio,
        );
        height = width / ratio;
        resizeState.item.style.width = `${Math.round(width)}px`;
        resizeState.item.style.height = `${Math.round(height)}px`;
        applyCnotGeometryScale(
          resizeState.item,
          resizeState.cnotBaseline,
          width,
          height,
        );
        setLayoutManualEdited(resizeState.item, true);
        return;
      }
      const clampedSize = clampItemSize(resizeState.item, width, height);
      resizeState.item.style.width = `${Math.round(clampedSize.width)}px`;
      resizeState.item.style.height = `${Math.round(clampedSize.height)}px`;
      applyCnotGeometryScale(
        resizeState.item,
        resizeState.cnotBaseline,
        clampedSize.width,
        clampedSize.height,
      );
      setLayoutManualEdited(resizeState.item, true);
      return;
    }
    if (!dragState) {
      return;
    }
    if (event.touches) {
      event.preventDefault();
    }
    const point = getPointer(event);
    if (!point) {
      return;
    }
    const canvasRect = playgroundCanvas.getBoundingClientRect();
    const left =
      point.clientX -
      canvasRect.left +
      playgroundCanvas.scrollLeft -
      dragState.pointerOffsetX;
    const top =
      point.clientY -
      canvasRect.top +
      playgroundCanvas.scrollTop -
      dragState.pointerOffsetY;
    const clamped = clampItemPosition(dragState.item, left, top);
    dragState.item.style.left = `${Math.round(clamped.left)}px`;
    dragState.item.style.top = `${Math.round(clamped.top)}px`;
    if (layoutEditorState.enabled) {
      setLayoutManualEdited(dragState.item, true);
    } else if (isPlaygroundQubitItem(dragState.item)) {
      if (maybeSnapPlaygroundQubitToSingleGate(dragState.item)) {
        return;
      }
      if (maybeSnapPlaygroundQubitToSingleMeasurement(dragState.item)) {
        return;
      }
      maybeSnapPlaygroundQubitToMailbox(dragState.item);
    }
  };

  const endItemDrag = () => {
    if (cnotPartGesture) {
      cnotPartGesture.part.classList.remove("layout-edit-dragging");
      cnotPartGesture = null;
    }
    if (measurementPartGesture) {
      measurementPartGesture.part.classList.remove("layout-edit-dragging");
      measurementPartGesture = null;
    }
    if (resizeState) {
      resizeState.item.classList.remove("resizing");
      resizeState = null;
    }
    if (!dragState) {
      return;
    }
    dragState.item.classList.remove("dragging");
    const left = parseLayoutNumeric(dragState.item.style.left, 0);
    const top = parseLayoutNumeric(dragState.item.style.top, 0);
    const clamped = clampItemPosition(dragState.item, left, top);
    dragState.item.style.left = `${Math.round(clamped.left)}px`;
    dragState.item.style.top = `${Math.round(clamped.top)}px`;
    if (isPlaygroundQubitItem(dragState.item) && !layoutEditorState.enabled) {
      if (maybeSnapPlaygroundQubitToSingleGate(dragState.item)) {
        dragState = null;
        return;
      }
      if (maybeSnapPlaygroundQubitToCnot(dragState.item)) {
        dragState = null;
        return;
      }
      if (maybeSnapPlaygroundQubitToDoubleMeasurement(dragState.item)) {
        dragState = null;
        return;
      }
      if (maybeSnapPlaygroundQubitToSingleMeasurement(dragState.item)) {
        dragState = null;
        return;
      }
      if (maybeSnapPlaygroundQubitToMailbox(dragState.item)) {
        dragState = null;
        return;
      }
    }
    dragState = null;
  };

  const createItem = (type, geometry = null) => {
    const pickerGroup = savedGroupComponentForType(type);
    if (pickerGroup) {
      type = PLAYGROUND_SAVED_GROUP_COMPONENT_TYPE;
      geometry = { ...(geometry || {}), groupComponentId: pickerGroup.id };
    }
    const config =
      componentConfigForType(type, geometry) || PLAYGROUND_COMPONENT_LIBRARY.qubit;
    const defaultsGeometry = defaultsGeometryForComponentType(type);
    const componentNode = createPlaygroundComponentNode(type, geometry || {});
    let item =
      componentNode instanceof HTMLElement
        ? componentNode
        : document.createElement("div");
    if (type === "qubit") {
      const shell = document.createElement("div");
      shell.className = "playground-node playground-qubit-shell";
      if (!(item instanceof HTMLElement) || !item.classList.contains("qubit")) {
        const fallbackQubit = document.createElement("button");
        fallbackQubit.type = "button";
        fallbackQubit.className = "qubit";
        item = fallbackQubit;
      }
      item.classList.add("playground-qubit-core");
      shell.appendChild(item);
      item = shell;
    } else {
      item.classList.add("playground-node");
    }
    item.dataset.component = type;
    if (type === "qubit") {
      ensureQubitLogicalId(item, geometry?.qubitId);
      const roomQubitIndex = normalizeRoomQubitIndex(geometry?.roomQubitIndex);
      if (Number.isInteger(roomQubitIndex)) {
        item.dataset.roomQubitIndex = String(roomQubitIndex);
      }
      updateQubitDisplayLabel(item);
    }
    if (typeof geometry?.measurementGroupId === "string") {
      item.dataset.measurementGroupId = geometry.measurementGroupId;
    }
    if (typeof geometry?.groupComponentId === "string") {
      item.dataset.groupComponentId = geometry.groupComponentId;
    }
    if (typeof geometry?.measurementRole === "string") {
      item.dataset.measurementRole = geometry.measurementRole;
    }
    const minSize = minSizeForItem(item);
    const width = Number.isFinite(geometry?.width)
      ? geometry.width
      : Number.isFinite(defaultsGeometry?.width)
        ? defaultsGeometry.width
        : config.width;
    const height = Number.isFinite(geometry?.height)
      ? geometry.height
      : Number.isFinite(defaultsGeometry?.height)
        ? defaultsGeometry.height
        : config.height;
    item.style.width = `${Math.max(minSize.minWidth, Math.round(width))}px`;
    item.style.height = `${Math.max(minSize.minHeight, Math.round(height))}px`;
    if (type === "cnot-gate") {
      // Apply saved C-NOT defaults after size initialization so default gate
      // geometry is not overwritten by the generic component library size.
      applyCnotComponentDefaultsToElement(item, {
        includeGateGeometry: !geometry,
      });
      if (geometry?.cnotLayout) {
        applyCnotSnapshotToElement(item, geometry.cnotLayout, {
          includeGateGeometry: false,
        });
      }
    }
    if (isMeasurementComponentType(type)) {
      applyPlaygroundMeasurementLayoutSnapshot(
        item,
        playgroundComponentDefaultsCache?.[type],
        { includeGroupGeometry: false },
      );
      if (geometry?.measurementLayout) {
        applyPlaygroundMeasurementLayoutSnapshot(
          item,
          geometry.measurementLayout,
          {
            includeGroupGeometry: false,
          },
        );
      }
    }
    if (type === "mailbox") {
      applyMailboxSnapshotToElement(item, geometry?.mailbox);
    }
    if (type === "single-gate" && Number.isFinite(geometry?.singleGateTick)) {
      item.dataset.playgroundSingleGateTick = `${normalizeTickIndex(geometry.singleGateTick)}`;
    } else if (
      type === "single-gate" &&
      Number.isFinite(defaultsGeometry?.singleGateTick)
    ) {
      item.dataset.playgroundSingleGateTick = `${normalizeTickIndex(defaultsGeometry.singleGateTick)}`;
    }
    item.setAttribute("aria-label", config.label);

    item.addEventListener("mousedown", () => {
      bringToFront(item);
    });
    item.addEventListener(
      "touchstart",
      () => {
        bringToFront(item);
        setSelectedItem(item);
      },
      { passive: true },
    );
    item.addEventListener("mousedown", (event) => beginItemDrag(item, event));
    item.addEventListener("touchstart", (event) => beginItemDrag(item, event), {
      passive: false,
    });

    if (
      geometry &&
      Number.isFinite(geometry.left) &&
      Number.isFinite(geometry.top)
    ) {
      const clamped = clampItemPosition(item, geometry.left, geometry.top);
      item.style.left = `${Math.round(clamped.left)}px`;
      item.style.top = `${Math.round(clamped.top)}px`;
    }
    if (geometry && Number.isFinite(geometry.z)) {
      item.style.zIndex = `${Math.round(geometry.z)}`;
      zCounter = Math.max(zCounter, Math.round(geometry.z));
    }
    return item;
  };

  const appendItemToCanvas = (item) => {
    playgroundCanvas.appendChild(item);
    preparePlaygroundCnotParts(item);
    preparePlaygroundMeasurementParts(item);
    ensurePlaygroundQubitLayoutRegistration(item);
    ensurePlaygroundQubitRuntimeState(item);
    ensurePlaygroundSingleGateRuntime(item);
    ensurePlaygroundSingleMeasurementRuntime(item);
    ensurePlaygroundDoubleMeasurementRuntime(item);
    ensurePlaygroundCnotRuntime(item);
    preparePlaygroundCnotParts(item);
    preparePlaygroundMeasurementParts(item);
  };

  const serializePlaygroundItem = (item) => {
    const serialized = {
      type: item.dataset.component || "qubit",
      left: parseLayoutNumeric(item.style.left, 0),
      top: parseLayoutNumeric(item.style.top, 0),
      width: item.offsetWidth,
      height: item.offsetHeight,
      z: parseLayoutNumeric(item.style.zIndex, 1),
    };
    const measurementLayout = capturePlaygroundMeasurementLayoutSnapshot(item);
    if (measurementLayout) {
      serialized.measurementLayout = measurementLayout;
    }
    // Group instances intentionally do not serialize their children. Their
    // component definition is the shared source of truth across tabs.
    if (isPlaygroundCnotItem(item)) {
      preparePlaygroundCnotParts(item);
      const cnotLayout = captureCnotComponentDefaultsFromElement(item);
      if (cnotLayout) {
        serialized.cnotLayout = cnotLayout;
      }
    }
    const singleGateRuntime = playgroundSingleGateRuntime.get(item);
    if (singleGateRuntime?.dial) {
      serialized.singleGateTick = singleGateRuntime.dial.getTick();
    }
    if (item.dataset.component === "qubit") {
      const qubitId = ensureQubitLogicalId(item);
      if (qubitId) {
        serialized.qubitId = qubitId;
      }
      const roomQubitIndex = roomQubitIndexForItem(item);
      if (Number.isInteger(roomQubitIndex)) {
        serialized.roomQubitIndex = roomQubitIndex;
      }
    }
    if (item.dataset.component === "text-box") {
      Object.assign(serialized, captureTextBoxSnapshot(item));
    }
    if (item.dataset.component === "mailbox") {
      const mailbox = captureMailboxSnapshot(item);
      if (mailbox) {
        serialized.mailbox = mailbox;
      }
    }
    if (item.dataset.measurementGroupId) {
      serialized.measurementGroupId = item.dataset.measurementGroupId;
    }
    if (item.dataset.groupComponentId) {
      serialized.groupComponentId = item.dataset.groupComponentId;
    }
    if (item.dataset.measurementRole) {
      serialized.measurementRole = item.dataset.measurementRole;
    }
    return serialized;
  };

  const serializeItems = () =>
    normalizeSavedGroupLayoutItems(
      Array.from(
        playgroundCanvas.querySelectorAll(":scope > .playground-node"),
      ).map((item) => serializePlaygroundItem(item)),
    );

  const buildLayoutPayload = () => ({
    items: serializeItems(),
    gridSnap: isSnapEnabled(),
    canvasWidth: playgroundCanvas.offsetWidth,
    canvasHeight: playgroundCanvas.offsetHeight,
    savedAt: Date.now(),
  });

  const normalizeTabLabelInput = (value) =>
    String(value || "")
      .trim()
      .replace(/\s+/g, " ");

  let currentEditorTabId = null;
  let currentEditorTabLabel = "";
  let currentEditorDraftActive = false;

  const editorHasEditableTab = () =>
    Boolean(currentEditorTabId || currentEditorDraftActive);

  const setEditorPanelOpen = (panel, open) => {
    if (panel instanceof HTMLElement) {
      panel.hidden = !open;
    }
  };

  const closeTransientTabEditorPanels = ({ keepNew = false } = {}) => {
    if (!keepNew) {
      setEditorPanelOpen(editorNewTabPanel, false);
    }
    setEditorPanelOpen(editorOpenTabPanel, false);
    if (isWorkshopTabMode()) {
      setEditorPanelOpen(editorAddComponentPanel, false);
    }
  };

  const selectedOpenTargetId = () =>
    editorTargetTabSelect instanceof HTMLSelectElement &&
    editorTargetTabSelect.value
      ? editorTargetTabSelect.value
      : "__none__";

  const targetById = (targetId) =>
    collectPlaygroundSaveTargets().find((target) => target.id === targetId) ||
    null;

  const currentEditorTarget = () =>
    currentEditorTabId ? targetById(currentEditorTabId) : null;

  const syncEditorDocumentChrome = () => {
    const target = currentEditorTarget();
    if (currentEditorTabId && !target) {
      currentEditorTabId = null;
      currentEditorTabLabel = "";
    }
    const label = target?.label || currentEditorTabLabel || "Untitled";
    if (editorDocumentStatus instanceof HTMLElement) {
      editorDocumentStatus.textContent = `Editing: ${label}`;
    }
    if (playgroundSaveButton instanceof HTMLButtonElement) {
      playgroundSaveButton.textContent = "Save";
      playgroundSaveButton.disabled = !editorHasEditableTab();
    }
    if (editorRenameTabButton) {
      editorRenameTabButton.disabled = !currentEditorTabId;
    }
    if (editorDeleteTabButton) {
      editorDeleteTabButton.disabled = !currentEditorTabId;
    }
    if (editorAddComponentButton instanceof HTMLButtonElement) {
      editorAddComponentButton.disabled = !editorHasEditableTab();
    }
  };

  const setCurrentEditorDocument = (
    targetId,
    label = "",
    { syncName = true, draft = false } = {},
  ) => {
    currentEditorTabId = targetId || null;
    currentEditorDraftActive = !currentEditorTabId && Boolean(draft);
    currentEditorTabLabel = currentEditorTabId ? label : "";
    if (syncName && editorNewTabName instanceof HTMLInputElement) {
      editorNewTabName.value = currentEditorTabId ? currentEditorTabLabel : label;
    }
    syncEditorDocumentChrome();
  };

  const refreshEditorTabControls = (preferredTarget = null) => {
    if (!(editorTargetTabSelect instanceof HTMLSelectElement)) {
      syncEditorDocumentChrome();
      return;
    }
    const prior = preferredTarget || selectedOpenTargetId();
    const targets = collectPlaygroundSaveTargets();
    if (currentEditorTabId && !targets.some((target) => target.id === currentEditorTabId)) {
      currentEditorTabId = null;
      currentEditorTabLabel = "";
    }
    editorTargetTabSelect.replaceChildren();
    const placeholderOption = document.createElement("option");
    placeholderOption.value = "__none__";
    placeholderOption.textContent = "Choose tab...";
    editorTargetTabSelect.appendChild(placeholderOption);
    targets.forEach((target) => {
      const option = document.createElement("option");
      option.value = target.id;
      option.textContent = target.label;
      editorTargetTabSelect.appendChild(option);
    });
    const validValues = new Set([
      "__none__",
      ...targets.map((target) => target.id),
    ]);
    const nextValue = validValues.has(prior)
      ? prior
      : currentEditorTabId && validValues.has(currentEditorTabId)
        ? currentEditorTabId
        : "__none__";
    editorTargetTabSelect.value = nextValue;
    if (editorNewTabName instanceof HTMLInputElement) {
      editorNewTabName.hidden = false;
      editorNewTabName.required = !currentEditorTabId;
    }
    if (editorOpenTabButton) {
      editorOpenTabButton.disabled = targets.length === 0;
    }
    syncEditorDocumentChrome();
  };

  const applyLayoutPayloadToEditor = (payload, { statusText = "" } = {}) => {
    if (!payload || !Array.isArray(payload.items)) {
      setStatus("Saved layout invalid");
      return false;
    }
    if (playgroundSnapToggle && typeof payload.gridSnap === "boolean") {
      playgroundSnapToggle.checked = payload.gridSnap;
    }
    clearLayout();
    normalizeSavedGroupLayoutItems(payload.items).forEach((geometry) => {
      const type = typeof geometry.type === "string" ? geometry.type : "qubit";
      const item = createItem(type, geometry);
      appendItemToCanvas(item);
    });
    if (statusText) {
      setStatus(statusText);
    }
    return true;
  };

  const saveLayout = async () => {
    if (!editorHasEditableTab()) {
      setStatus("New or open a tab first");
      return false;
    }
    const payload = buildLayoutPayload();
    const layout = cloneJson(payload);
    if (!layout) {
      setStatus(contentFileSaveFailureMessage());
      return false;
    }

    const targetId = currentEditorTabId || "__new__";
    const nextState = cloneJson(generatedTabsState) || { tabs: [] };
    nextState.tabs = Array.isArray(nextState.tabs)
      ? nextState.tabs
      : [];

    let savedLabel = "";
    let savedTargetId = targetId;
    if (targetId === "__new__") {
      let label = normalizeTabLabelInput(editorNewTabName?.value);
      if (!label) {
        setStatus("Name the new tab before saving");
        editorNewTabName?.focus();
        return false;
      }
      if (existingTabLabelSet().has(normalizeTabLabel(label))) {
        setStatus("A tab with that name already exists");
        editorNewTabName?.focus();
        editorNewTabName?.select();
        return false;
      }
      savedTargetId = uniqueGeneratedTabTarget(label);
      nextState.tabs.push({
        id: savedTargetId,
        label,
        layout,
      });
      if (editorNewTabName instanceof HTMLInputElement) {
        editorNewTabName.value = label;
      }
      savedLabel = label;
    } else {
      const target = targetById(targetId);
      if (!target) {
        setStatus("Open a tab first");
        return false;
      }
      savedLabel = target.label;
      const editorEntry = nextState.tabs.find(
        (entry) => entry.id === targetId,
      );
      if (!editorEntry) {
        nextState.tabs.push({
          id: targetId,
          label: target.label,
          layout,
        });
      } else {
        editorEntry.layout = layout;
      }
    }

    if (!writeGeneratedTabsState(nextState)) {
      setStatus(contentFileSaveFailureMessage());
      return false;
    }
    const persistedState =
      window.location.protocol === "file:" ? nextState : readGeneratedTabsState();
    const persistedEntry = (persistedState.tabs || []).find(
      (entry) => entry?.id === savedTargetId,
    );
    if (persistedEntry?.layout?.savedAt !== layout.savedAt) {
      setStatus(contentFileSaveFailureMessage());
      return false;
    }
    savedLabel =
      typeof persistedEntry.label === "string" && persistedEntry.label.trim()
        ? persistedEntry.label
        : savedLabel;
    applyGeneratedTabsState(persistedState);
    refreshGeneratedTabPanelFromState(savedTargetId, persistedState);
    plagroundComposer?.handleGeneratedTabsChanged?.();
    documentEditorComposer?.handleGeneratedTabsChanged?.();
    setCurrentEditorDocument(savedTargetId, savedLabel);
    refreshEditorTabControls(savedTargetId);
    try {
      window.localStorage.setItem(
        PLAYGROUND_LAYOUT_STORAGE_KEY,
        JSON.stringify(payload),
      );
    } catch (_error) {
      // Keep tab save successful even if local draft persistence fails.
    }
    setStatus(`Saved to ${savedLabel}`);
    returnToIntroductionLandingPage();
    return true;
  };

  const clearLayout = ({ clearStorage = false } = {}) => {
    playgroundCanvas
      .querySelectorAll(":scope > .playground-node")
      .forEach((item) => item.remove());
    playgroundSingleGateRuntime.clear();
    playgroundSingleMeasurementRuntime.clear();
    playgroundDoubleMeasurementRuntime.clear();
    playgroundCnotRuntime.clear();
    playgroundQubitRuntime.clear();
    setSelectedItem(null);
    if (clearStorage) {
      try {
        window.localStorage.removeItem(PLAYGROUND_LAYOUT_STORAGE_KEY);
      } catch (_error) {
        // Ignore storage failures.
      }
    }
  };

  const openSelectedEditorTab = () => {
    const targetId = selectedOpenTargetId();
    const target = targetById(targetId);
    if (!target) {
      setStatus("Choose a tab to open");
      return false;
    }
    let layout = null;
    const editorEntry = (generatedTabsState.tabs || []).find(
      (entry) => entry.id === targetId,
    );
    layout = editorEntry?.layout || null;
    if (!layout) {
      setStatus("No saved editor layout for this tab yet");
      return false;
    }
    const applied = applyLayoutPayloadToEditor(layout, {
      statusText: `Opened ${target.label}`,
    });
    if (applied) {
      setCurrentEditorDocument(target.id, target.label);
      refreshEditorTabControls(target.id);
      closeTransientTabEditorPanels();
    }
    return applied;
  };

  const startNewBlankTabDraft = () => {
    clearLayout({ clearStorage: true });
    setCurrentEditorDocument(null, "", { draft: true });
    refreshEditorTabControls("__none__");
    closeTransientTabEditorPanels({ keepNew: true });
    setEditorPanelOpen(editorNewTabPanel, true);
    editorNewTabName?.focus();
    setStatus("New blank tab ready");
  };

  const renameSelectedEditorTab = () => {
    const targetId = currentEditorTabId;
    const target = targetById(targetId);
    if (!target) {
      setStatus("Open a tab first");
      return false;
    }
    const nextLabel = normalizeTabLabelInput(
      editorNewTabName instanceof HTMLInputElement
        ? editorNewTabName.value
        : target.label,
    );
    if (!nextLabel) {
      setStatus("Enter a tab name");
      editorNewTabName?.focus();
      return false;
    }
    const normalizedNext = normalizeTabLabel(nextLabel);
    const duplicate = collectPlaygroundSaveTargets().some(
      (entry) =>
        entry.id !== targetId &&
        normalizeTabLabel(entry.label) === normalizedNext,
    );
    if (duplicate) {
      setStatus("A tab with that name already exists");
      editorNewTabName?.focus();
      editorNewTabName?.select();
      return false;
    }
    const nextState = cloneJson(generatedTabsState) || { tabs: [] };
    nextState.tabs = Array.isArray(nextState.tabs)
      ? nextState.tabs
      : [];
    const entry = nextState.tabs.find(
      (candidate) => candidate.id === targetId,
    );
    if (!entry) {
      setStatus("Rename failed");
      return false;
    }
    entry.label = nextLabel;
    if (!writeGeneratedTabsState(nextState)) {
      setStatus("Rename failed");
      return false;
    }
    applyGeneratedTabsState(nextState);
    setCurrentEditorDocument(targetId, nextLabel);
    refreshEditorTabControls(targetId);
    setStatus(`Renamed to ${nextLabel}`);
    return true;
  };

  const deleteSelectedEditorTab = () => {
    const targetId = currentEditorTabId;
    const target = targetById(targetId);
    if (!target) {
      setStatus("Open a tab first");
      return false;
    }
    const confirmed = window.confirm(
      `Delete "${target.label}"? This cannot be undone.`,
    );
    if (!confirmed) {
      return false;
    }
    const nextState = cloneJson(generatedTabsState) || { tabs: [] };
    nextState.tabs = Array.isArray(nextState.tabs)
      ? nextState.tabs
      : [];
    nextState.tabs = nextState.tabs.filter(
      (entry) => entry.id !== targetId,
    );
    if (!writeGeneratedTabsState(nextState)) {
      setStatus("Delete failed");
      return false;
    }
    deleteDocumentForTabId(targetId);
    if (
      document
        .querySelector(".tab-btn.active")
        ?.getAttribute("data-tab-target") === targetId
    ) {
      setActiveTab("plaground");
    }
    applyGeneratedTabsState(nextState);
    clearLayout({ clearStorage: true });
    setCurrentEditorDocument(null, "");
    refreshEditorTabControls("__none__");
    setStatus(`Deleted ${target.label}`);
    return true;
  };

  const duplicateSelected = () => {
    const sourceItem = selectedComponentItem();
    if (!(sourceItem instanceof HTMLElement)) {
      return false;
    }
    const type = sourceItem.dataset.component || "qubit";
    const geometry = {
      left:
        parseLayoutNumeric(sourceItem.style.left, 0) + PLAYGROUND_GRID_SIZE,
      top: parseLayoutNumeric(sourceItem.style.top, 0) + PLAYGROUND_GRID_SIZE,
      width: sourceItem.offsetWidth,
      height: sourceItem.offsetHeight,
    };
    if (sourceItem.dataset.measurementGroupId) {
      geometry.measurementGroupId = `${sourceItem.dataset.measurementGroupId}-copy-${Date.now().toString(36)}`;
    }
    if (sourceItem.dataset.groupComponentId) {
      geometry.groupComponentId = sourceItem.dataset.groupComponentId;
    }
    if (sourceItem.dataset.measurementRole) {
      geometry.measurementRole = sourceItem.dataset.measurementRole;
    }
    const measurementLayout =
      capturePlaygroundMeasurementLayoutSnapshot(sourceItem);
    if (measurementLayout) {
      geometry.measurementLayout = measurementLayout;
    }
    const savedGroupLayout = captureSavedGroupChildLayoutSnapshot(sourceItem);
    if (savedGroupLayout) {
      geometry.items = savedGroupLayout.items;
      geometry.itemsWidth = savedGroupLayout.itemsWidth;
      geometry.itemsHeight = savedGroupLayout.itemsHeight;
    }
    stripQubitIdsFromLayoutGeometry(geometry);
    if (isPlaygroundCnotItem(sourceItem)) {
      preparePlaygroundCnotParts(sourceItem);
      const cnotLayout = captureCnotComponentDefaultsFromElement(sourceItem);
      if (cnotLayout) {
        geometry.cnotLayout = cnotLayout;
      }
    }
    const item = createItem(type, geometry);
    appendItemToCanvas(item);
    setSelectedItem(item);
    setStatus("Duplicated");
    return true;
  };

  const deleteSelectedComponentPart = () => {
    const owner = selectedComponentItem();
    if (
      !(owner instanceof HTMLElement) ||
      !(selectedComponentPart instanceof HTMLElement) ||
      !owner.contains(selectedComponentPart) ||
      selectedComponentPart.parentElement !== owner ||
      !selectedComponentPart.classList.contains("saved-group-child")
    ) {
      return false;
    }
    selectedComponentPart.remove();
    clearSelectedComponentPart();
    preparePlaygroundMeasurementParts(owner);
    setSelectedItem(owner);
    setStatus("Deleted subcomponent");
    return true;
  };

  const deleteSelected = () => {
    if (deleteSelectedComponentPart()) {
      return true;
    }
    const doomedItems = selectedComponentItems();
    if (doomedItems.length === 0) {
      return false;
    }
    doomedItems.forEach((doomed) => {
      if (isPlaygroundQubitItem(doomed)) {
        releasePlaygroundQubitFromCnotSlots(doomed);
        releasePlaygroundQubitFromDoubleMeasurementSlots(doomed);
      }
      playgroundSingleGateRuntime.delete(doomed);
      playgroundSingleMeasurementRuntime.delete(doomed);
      playgroundDoubleMeasurementRuntime.delete(doomed);
      playgroundCnotRuntime.delete(doomed);
      playgroundQubitRuntime.delete(doomed);
      doomed.remove();
    });
    setSelectedItem(null);
    prunePlaygroundRuntimeState();
    setStatus("Deleted");
    return true;
  };

  const saveSelectedComponent = () => {
    const componentItem = selectedComponentItem();
    if (!(componentItem instanceof HTMLElement)) {
      setStatus("Select a component first");
      return false;
    }
    const selectedType = componentItem.dataset.component || "qubit";
    const geometryExtras = {};
    if (selectedType === "single-gate") {
      const runtime = ensurePlaygroundSingleGateRuntime(componentItem);
      const singleGateTick = runtime?.dial?.getTick();
      if (Number.isFinite(singleGateTick)) {
        geometryExtras.singleGateTick = normalizeTickIndex(singleGateTick);
      }
    }
    if (
      !persistPlaygroundComponentGeometryDefaultsFromElement(
        selectedType,
        componentItem,
        geometryExtras,
      )
    ) {
      setStatus("Component save failed");
      return false;
    }
    if (isPlaygroundCnotItem(componentItem)) {
      preparePlaygroundCnotParts(componentItem);
      if (!persistPlaygroundCnotDefaultsFromDom(componentItem)) {
        setStatus("Component save failed");
        return false;
      }
      setStatus("C-NOT component saved");
      return true;
    }
    if (
      componentItem instanceof HTMLElement &&
      isMeasurementComponentType(selectedType)
    ) {
      preparePlaygroundMeasurementParts(componentItem);
      if (
        !persistPlaygroundMeasurementDefaultsFromDom(selectedType, componentItem)
      ) {
        setStatus("Component save failed");
        return false;
      }
      setStatus("Measurement component saved");
      return true;
    }
    if (
      selectedType === PLAYGROUND_SAVED_GROUP_COMPONENT_TYPE &&
      isSeparatedPairMeasurementGroupElement(componentItem)
    ) {
      if (!persistSavedGroupComponentDefinitionFromElement(componentItem)) {
        setStatus("Group component save failed");
        return false;
      }
      setStatus("Separate measurement component saved");
      return true;
    }
    if (selectedType === "single-gate") {
      setStatus("Single gate component saved");
      return true;
    }
    if (selectedType === "qubit") {
      setStatus("Qubit component saved");
      return true;
    }
    setStatus("Component saved");
    return true;
  };

  const saveSelectedGroupComponent = () => {
    const items = selectedComponentItems();
    if (items.length < 2) {
      setStatus("Select two or more components");
      return false;
    }
    const label = normalizeTabLabelInput(
      window.prompt("Save group as", "Measurement Group"),
    );
    if (!label) {
      setStatus("Group save canceled");
      return false;
    }
    const bounds = items.reduce(
      (acc, item) => {
        const left = parseLayoutNumeric(item.style.left, 0);
        const top = parseLayoutNumeric(item.style.top, 0);
        return {
          left: Math.min(acc.left, left),
          top: Math.min(acc.top, top),
          right: Math.max(acc.right, left + item.offsetWidth),
          bottom: Math.max(acc.bottom, top + item.offsetHeight),
        };
      },
      {
        left: Number.POSITIVE_INFINITY,
        top: Number.POSITIVE_INFINITY,
        right: Number.NEGATIVE_INFINITY,
        bottom: Number.NEGATIVE_INFINITY,
      },
    );
    if (
      ![bounds.left, bounds.top, bounds.right, bounds.bottom].every(
        Number.isFinite,
      )
    ) {
      setStatus("Group bounds invalid");
      return false;
    }
    const id = generatedTabSlug(label) || `group-${Date.now().toString(36)}`;
    const existing = readPlaygroundGroupComponentsPayload();
    const filteredGroups = existing.groups.filter((group) => group.id !== id);
    const groupWidth = Math.max(1, bounds.right - bounds.left);
    const groupHeight = Math.max(1, bounds.bottom - bounds.top);
    const groupItems = items
      .map((item, index) => {
        const geometry = serializePlaygroundItem(item);
        geometry.left -= bounds.left;
        geometry.top -= bounds.top;
        geometry.z = index + 1;
        geometry.measurementGroupId = "";
        geometry.groupComponentId =
          geometry.type === PLAYGROUND_SAVED_GROUP_COMPONENT_TYPE
            ? geometry.groupComponentId || ""
            : id;
        geometry.measurementRole =
          geometry.measurementRole || measurementPieceRoleForType(geometry.type);
        delete geometry.id;
        stripQubitIdsFromLayoutGeometry(geometry);
        return geometry;
      })
      .sort((a, b) => (a.z || 0) - (b.z || 0));
    const savedGroup = {
      id,
      label,
      width: groupWidth,
      height: groupHeight,
      items: groupItems,
      savedAt: Date.now(),
    };
    const payload = {
      groups: [...filteredGroups, savedGroup],
    };
    if (!writePlaygroundGroupComponentsPayload(payload)) {
      setStatus("Group save failed");
      return false;
    }
    refreshAllComponentPickers();
    items.forEach((item) => {
      playgroundSingleGateRuntime.delete(item);
      playgroundSingleMeasurementRuntime.delete(item);
      playgroundDoubleMeasurementRuntime.delete(item);
      playgroundCnotRuntime.delete(item);
      playgroundQubitRuntime.delete(item);
      item.remove();
    });
    prunePlaygroundRuntimeState();
    const replacement = createItem(PLAYGROUND_SAVED_GROUP_COMPONENT_TYPE, {
      left: bounds.left,
      top: bounds.top,
      width: groupWidth,
      height: groupHeight,
      z: Math.max(
        ...items.map((item) => parseLayoutNumeric(item.style.zIndex, 1)),
        1,
      ),
      measurementGroupId: `${id}-${Date.now().toString(36)}`,
      groupComponentId: id,
    });
    appendItemToCanvas(replacement);
    bringToFront(replacement);
    setSelectedItem(replacement);
    setStatus(`Saved group ${label}`);
    return true;
  };

  const addGroupComponentAtPoint = (group, clientX, clientY) => {
    if (!group || !Array.isArray(group.items) || group.items.length === 0) {
      return null;
    }
    const canvasRect = playgroundCanvas.getBoundingClientRect();
    const origin = {
      left: clientX - canvasRect.left + playgroundCanvas.scrollLeft,
      top: clientY - canvasRect.top + playgroundCanvas.scrollTop,
    };
    const instanceId = `${group.id || "group"}-${Date.now().toString(36)}`;
    const geometry = {
      type: PLAYGROUND_SAVED_GROUP_COMPONENT_TYPE,
      left: origin.left,
      top: origin.top,
      width: Number.isFinite(group.width) ? group.width : 320,
      height: Number.isFinite(group.height) ? group.height : 240,
      measurementGroupId: instanceId,
      groupComponentId: group.id || "",
    };
    if (
      Number.isInteger(group.measurementRegisterQubitCount) &&
      group.measurementRegisterQubitCount >= 2 &&
      group.measurementRegisterQubitCount <= 4
    ) {
      geometry.measurementRegisterQubitCount =
        group.measurementRegisterQubitCount;
    }
    const item = createItem(PLAYGROUND_SAVED_GROUP_COMPONENT_TYPE, geometry);
    appendItemToCanvas(item);
    bringToFront(item);
    selectedItems = new Set([item]);
    selectedItem = item;
    syncSelectionUiState();
    updateActionButtons();
    return selectedItem;
  };

  const loadSelectedComponentForEditing = () => {
    if (!isWorkshopComponentMode()) {
      return false;
    }
    const selectedType = playgroundComponentSelect.value;
    if (!selectedType) {
      return false;
    }
    clearLayout({ clearStorage: true });
    const item = createItem(selectedType);
    appendItemToCanvas(item);
    bringToFront(item);
    const left = Math.max(
      PLAYGROUND_GRID_SIZE,
      Math.round((playgroundCanvas.clientWidth - item.offsetWidth) / 2),
    );
    const top = Math.max(
      PLAYGROUND_GRID_SIZE,
      Math.round((playgroundCanvas.clientHeight - item.offsetHeight) / 2),
    );
    const clamped = clampItemPosition(item, left, top);
    item.style.left = `${Math.round(clamped.left)}px`;
    item.style.top = `${Math.round(clamped.top)}px`;
    setSelectedItem(item);
    if (isPlaygroundCnotItem(item)) {
      preparePlaygroundCnotParts(item);
    }
    if (isMeasurementComponentType(item.dataset.component)) {
      preparePlaygroundMeasurementParts(item);
    }
    playgroundComponentSelect.value = selectedType;
    setStatus("Component ready");
    return true;
  };

  playgroundCanvas.addEventListener("click", (event) => {
    if (!isWorkshopTabMode()) {
      return;
    }
    const selectedType = playgroundComponentSelect.value;
    if (!selectedType) {
      return;
    }
    const savedGroup = savedGroupComponentForType(selectedType);
    if (savedGroup) {
      const item = addGroupComponentAtPoint(
        savedGroup,
        event.clientX,
        event.clientY,
      );
      playgroundComponentSelect.value = "";
      if (item) {
        setStatus("Group added");
      }
      return;
    }
    const item = createItem(selectedType);
    appendItemToCanvas(item);
    bringToFront(item);
    positionItemFromClientPoint(item, event.clientX, event.clientY);
    setSelectedItem(item);
    playgroundComponentSelect.value = "";
    if (isPlaygroundQubitItem(item) && !layoutEditorState.enabled) {
      if (!maybeSnapPlaygroundQubitToSingleGate(item)) {
        if (!maybeSnapPlaygroundQubitToCnot(item)) {
          if (!maybeSnapPlaygroundQubitToDoubleMeasurement(item)) {
            maybeSnapPlaygroundQubitToSingleMeasurement(item);
          }
        }
      }
    }
  });

  playgroundCanvas.addEventListener("mousedown", (event) => {
    if (event.target === playgroundCanvas) {
      setSelectedItem(null);
    }
  });

  if (playgroundDuplicateButton) {
    playgroundDuplicateButton.addEventListener("click", () => {
      duplicateSelected();
    });
  }
  if (playgroundDeleteButton) {
    playgroundDeleteButton.addEventListener("click", () => {
      deleteSelected();
    });
  }
  if (playgroundSaveComponentButton) {
    playgroundSaveComponentButton.addEventListener("click", () => {
      saveSelectedComponent();
    });
  }
  if (playgroundSaveGroupButton) {
    playgroundSaveGroupButton.addEventListener("click", () => {
      saveSelectedGroupComponent();
    });
  }
  playgroundComponentSelect.addEventListener("change", () => {
    loadSelectedComponentForEditing();
  });
  if (editorAddComponentButton) {
    editorAddComponentButton.addEventListener("click", () => {
      if (!editorHasEditableTab()) {
        setStatus("New or open a tab first");
        return;
      }
      const nextOpen = editorAddComponentPanel instanceof HTMLElement
        ? editorAddComponentPanel.hidden
        : false;
      closeTransientTabEditorPanels();
      setEditorPanelOpen(editorAddComponentPanel, nextOpen);
      if (nextOpen) {
        playgroundComponentSelect?.focus();
      }
    });
  }
  if (playgroundSaveButton) {
    playgroundSaveButton.addEventListener("click", () => {
      saveLayout().catch(() => {
        setStatus(contentFileSaveFailureMessage());
      });
    });
  }
  if (playgroundLoadButton) {
    playgroundLoadButton.addEventListener("click", () => {
      clearLayout();
      setStatus("Editor cleared");
    });
  }
  if (editorTargetTabSelect instanceof HTMLSelectElement) {
    editorTargetTabSelect.addEventListener("change", () => {
      if (targetById(editorTargetTabSelect.value)) {
        openSelectedEditorTab();
      } else {
        refreshEditorTabControls(editorTargetTabSelect.value);
      }
    });
  }
  if (editorOpenTabButton) {
    editorOpenTabButton.addEventListener("click", () => {
      const nextOpen = editorOpenTabPanel instanceof HTMLElement
        ? editorOpenTabPanel.hidden
        : false;
      closeTransientTabEditorPanels();
      refreshEditorTabControls(editorTargetTabSelect?.value || "__none__");
      setEditorPanelOpen(editorOpenTabPanel, nextOpen);
      if (nextOpen) {
        editorTargetTabSelect?.focus();
      }
    });
  }
  if (editorNewTabButton) {
    editorNewTabButton.addEventListener("click", () => {
      startNewBlankTabDraft();
    });
  }
  if (editorCloseNewTabButton) {
    editorCloseNewTabButton.addEventListener("click", () => {
      setEditorPanelOpen(editorNewTabPanel, false);
      setStatus("");
    });
  }
  if (editorRenameTabButton) {
    editorRenameTabButton.addEventListener("click", () => {
      if (editorNewTabPanel instanceof HTMLElement && editorNewTabPanel.hidden) {
        setEditorPanelOpen(editorNewTabPanel, true);
        editorNewTabName?.focus();
        editorNewTabName?.select?.();
        setStatus("Edit the name, then click Rename");
        return;
      }
      renameSelectedEditorTab();
    });
  }
  if (editorDeleteTabButton) {
    editorDeleteTabButton.addEventListener("click", () => {
      deleteSelectedEditorTab();
    });
  }
  if (playgroundSnapToggle) {
    playgroundSnapToggle.addEventListener("change", () => {
      if (selectedItem) {
        const left = parseLayoutNumeric(selectedItem.style.left, 0);
        const top = parseLayoutNumeric(selectedItem.style.top, 0);
        const clamped = clampItemPosition(selectedItem, left, top);
        selectedItem.style.left = `${Math.round(clamped.left)}px`;
        selectedItem.style.top = `${Math.round(clamped.top)}px`;
      }
      setStatus(playgroundSnapToggle.checked ? "Snap on" : "Snap off");
    });
  }

  window.addEventListener("keydown", (event) => {
    if (!isPlagroundTabActive()) {
      return;
    }
    if (keyboardEventIsTextEditing(event)) {
      return;
    }
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "d") {
      event.preventDefault();
      return;
    }
    if (event.key === "Delete" || event.key === "Backspace") {
      if (isWorkshopComponentMode() && deleteSelected()) {
        event.preventDefault();
      }
      return;
    }
    if (event.key === "Escape") {
      setSelectedItem(null);
    }
  });

  window.addEventListener("mousemove", (event) => {
    continueItemDrag(event);
    continuePlaygroundGateDialDrag(event);
  });
  window.addEventListener(
    "touchmove",
    (event) => {
      continueItemDrag(event);
      continuePlaygroundGateDialDrag(event);
    },
    { passive: false },
  );
  const settleDraggedOrSelectedItem = () => {
    const hadActiveDrag = Boolean(
      dragState || resizeState || measurementPartGesture,
    );
    endItemDrag();
    endPlaygroundGateDialDrag();
    if (!hadActiveDrag || !(selectedItem instanceof HTMLElement)) {
      return;
    }
    const left = parseLayoutNumeric(selectedItem.style.left, 0);
    const top = parseLayoutNumeric(selectedItem.style.top, 0);
    const clamped = clampItemPosition(selectedItem, left, top);
    selectedItem.style.left = `${Math.round(clamped.left)}px`;
    selectedItem.style.top = `${Math.round(clamped.top)}px`;
  };
  window.addEventListener("mouseup", settleDraggedOrSelectedItem);
  window.addEventListener("touchend", settleDraggedOrSelectedItem);
  window.addEventListener("touchcancel", settleDraggedOrSelectedItem);

  updateActionButtons();
  setCurrentEditorDocument(null, "");
  refreshEditorTabControls("__none__");

  return {
    handleResize: () => {
      prunePlaygroundRuntimeState();
      playgroundCanvas
        .querySelectorAll(
          '.playground-node[data-component="single-measurement"], .playground-node[data-component="double-measurement"]',
        )
        .forEach((item) => preparePlaygroundMeasurementParts(item));
      Array.from(playgroundSingleGateRuntime.values()).forEach((runtime) => {
        runtime.dial?.layout();
        alignPlaygroundGateSpring(runtime);
      });
    },
    handleLayoutEditChanged: () => {
      syncSelectionUiState();
      endItemDrag();
      endPlaygroundGateDialDrag();
      prunePlaygroundRuntimeState();
      playgroundCanvas
        .querySelectorAll(
          '.playground-node[data-component="single-measurement"], .playground-node[data-component="double-measurement"]',
        )
        .forEach((item) => preparePlaygroundMeasurementParts(item));
      Array.from(playgroundSingleGateRuntime.values()).forEach((runtime) => {
        runtime.dial?.layout();
        alignPlaygroundGateSpring(runtime);
      });
    },
    handleGeneratedTabsChanged: () => {
      refreshEditorTabControls();
    },
    handleWorkshopModeChanged: () => {
      setSelectedItem(null);
      endItemDrag();
      endPlaygroundGateDialDrag();
      if (isWorkshopTabMode()) {
        playgroundComponentSelect.value = "";
        closeTransientTabEditorPanels();
      } else if (isWorkshopComponentMode()) {
        setEditorPanelOpen(editorAddComponentPanel, true);
      } else {
        setEditorPanelOpen(editorAddComponentPanel, false);
      }
      updateActionButtons();
    },
  };
}

function getPointer(event) {
  if (event.touches && event.touches.length > 0) {
    return event.touches[0];
  }

  if (event.changedTouches && event.changedTouches.length > 0) {
    return event.changedTouches[0];
  }

  return event;
}

function isPrimaryMouseButton(event) {
  return event.type !== "mousedown" || event.button === 0;
}

function pointerEventMatchesTickShape(event, tickElement) {
  const point = getPointer(event);
  if (
    !point ||
    !Number.isFinite(point.clientX) ||
    !Number.isFinite(point.clientY)
  ) {
    return true;
  }
  const ring = tickElement.parentElement;
  if (!ring) {
    return true;
  }

  const ringRect = ring.getBoundingClientRect();
  const tickRect = tickElement.getBoundingClientRect();
  const ringCenterX = ringRect.left + ringRect.width / 2;
  const ringCenterY = ringRect.top + ringRect.height / 2;
  const tickCenterX = tickRect.left + tickRect.width / 2;
  const tickCenterY = tickRect.top + tickRect.height / 2;

  const tickVectorX = tickCenterX - ringCenterX;
  const tickVectorY = tickCenterY - ringCenterY;
  const tickRadius = Math.hypot(tickVectorX, tickVectorY);
  if (tickRadius <= 1e-6) {
    return true;
  }

  const radialUnitX = tickVectorX / tickRadius;
  const radialUnitY = tickVectorY / tickRadius;
  const tangentUnitX = -radialUnitY;
  const tangentUnitY = radialUnitX;

  const pointerVectorX = point.clientX - ringCenterX;
  const pointerVectorY = point.clientY - ringCenterY;
  const pointerRadial =
    pointerVectorX * radialUnitX + pointerVectorY * radialUnitY;
  const pointerTangential =
    pointerVectorX * tangentUnitX + pointerVectorY * tangentUnitY;

  const radialTolerance = tickRect.height / 2 + 2;
  const tangentialTolerance = tickRect.width / 2 + 2;

  return (
    Math.abs(pointerRadial - tickRadius) <= radialTolerance &&
    Math.abs(pointerTangential) <= tangentialTolerance
  );
}

function attachTickSelectionHandlers(tickElement, onSelect) {
  const maybeSelect = (event) => {
    if (!pointerEventMatchesTickShape(event, tickElement)) {
      return;
    }
    onSelect();
  };

  tickElement.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    maybeSelect(event);
  });

  tickElement.addEventListener("mousedown", (event) => {
    if (!isPrimaryMouseButton(event)) {
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    maybeSelect(event);
  });

  tickElement.addEventListener(
    "touchstart",
    (event) => {
      event.preventDefault();
      event.stopPropagation();
      maybeSelect(event);
    },
    { passive: false },
  );
}

function normalizeTickIndex(tickIndex, tickCount = 12) {
  return ((tickIndex % tickCount) + tickCount) % tickCount;
}

function layoutSingleQubitGateTicks(ticksWrap, tickElements, orbitInset = 10) {
  if (!ticksWrap || !tickElements || !tickElements.length) {
    return;
  }
  const rect = ticksWrap.getBoundingClientRect();
  const size = Math.min(rect.width, rect.height);
  if (!size) {
    return;
  }
  const center = size / 2;
  const orbit = Math.max(center - orbitInset, 0);
  tickElements.forEach((tick, index) => {
    const angle = (index * STEP_DEG * Math.PI) / 180;
    const x = center + Math.sin(angle) * orbit;
    const y = center - Math.cos(angle) * orbit;
    tick.style.left = `${(x / size) * 100}%`;
    tick.style.top = `${(y / size) * 100}%`;
    tick.style.setProperty("--rotation", `${index * STEP_DEG}deg`);
  });
}

function createSingleQubitGateDial({
  ticksWrap,
  arrow,
  initialTick = 0,
  tickCount = 12,
  tickAriaLabelPrefix = "Tick",
  orbitInset = 10,
  canInteract = () => true,
  onTickChange = null,
  onTickCommitted = null,
}) {
  if (!ticksWrap || !arrow) {
    return null;
  }

  let activeTick = normalizeTickIndex(initialTick, tickCount);
  let dragCenter = null;
  let dragAngle = null;
  let dragStartTick = activeTick;
  const ticks = [];

  function continueWindowDrag(event) {
    continueDrag(event);
  }

  function endWindowDrag() {
    endDrag();
  }

  function bindWindowDragEvents() {
    window.addEventListener("mousemove", continueWindowDrag);
    window.addEventListener("touchmove", continueWindowDrag, {
      passive: false,
    });
    window.addEventListener("mouseup", endWindowDrag);
    window.addEventListener("touchend", endWindowDrag);
    window.addEventListener("touchcancel", endWindowDrag);
  }

  function unbindWindowDragEvents() {
    window.removeEventListener("mousemove", continueWindowDrag);
    window.removeEventListener("touchmove", continueWindowDrag);
    window.removeEventListener("mouseup", endWindowDrag);
    window.removeEventListener("touchend", endWindowDrag);
    window.removeEventListener("touchcancel", endWindowDrag);
  }

  function renderDialAtCurrentTick() {
    arrow.style.transform = `rotate(${activeTick * STEP_DEG}deg) scale(${ARROW_SCALE})`;
    ticks.forEach((tick, index) => {
      tick.classList.toggle("active", index === activeTick);
    });
  }

  function setTick(
    tickIndex,
    { deferMeasurementClear = false, reason = "programmatic" } = {},
  ) {
    const normalizedTick = normalizeTickIndex(tickIndex, tickCount);
    const previousTick = activeTick;
    activeTick = normalizedTick;
    renderDialAtCurrentTick();
    if (typeof onTickChange === "function") {
      onTickChange(normalizedTick, {
        previousTick,
        changed: normalizedTick !== previousTick,
        deferMeasurementClear,
        reason,
      });
    }
    return activeTick;
  }

  function beginDrag(event) {
    if (!canInteract() || !isPrimaryMouseButton(event)) {
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    dragStartTick = activeTick;
    const rect = ticksWrap.getBoundingClientRect();
    dragCenter = {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    };
    arrow.classList.add("dragging");
    const point = getPointer(event);
    dragAngle = normalizedAngleFromTopDegrees(
      point.clientX,
      point.clientY,
      dragCenter.x,
      dragCenter.y,
    );
    arrow.style.transform = `rotate(${dragAngle}deg) scale(${ARROW_SCALE})`;
    bindWindowDragEvents();
  }

  function continueDrag(event) {
    if (!dragCenter) {
      return;
    }
    if (event.touches) {
      event.preventDefault();
    }
    const point = getPointer(event);
    dragAngle = normalizedAngleFromTopDegrees(
      point.clientX,
      point.clientY,
      dragCenter.x,
      dragCenter.y,
    );
    arrow.style.transform = `rotate(${dragAngle}deg) scale(${ARROW_SCALE})`;
  }

  function endDrag() {
    if (!dragCenter) {
      return;
    }
    unbindWindowDragEvents();
    const snappedTick =
      dragAngle === null
        ? activeTick
        : Math.round(dragAngle / STEP_DEG) % tickCount;
    setTick(snappedTick, { deferMeasurementClear: true, reason: "drag-end" });
    const changed = snappedTick !== dragStartTick;
    if (typeof onTickCommitted === "function") {
      onTickCommitted({
        tick: normalizeTickIndex(snappedTick, tickCount),
        previousTick: dragStartTick,
        changed,
      });
    }
    arrow.classList.remove("dragging");
    dragCenter = null;
    dragAngle = null;
  }

  function handleKeydown(event) {
    if (!canInteract()) {
      return;
    }
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      event.preventDefault();
      setTick(activeTick + 1, { reason: "keyboard" });
    }
    if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      event.preventDefault();
      setTick(activeTick - 1, { reason: "keyboard" });
    }
  }

  for (let i = 0; i < tickCount; i += 1) {
    const tick = document.createElement("button");
    tick.type = "button";
    tick.className = "tick";
    tick.setAttribute("aria-label", `${tickAriaLabelPrefix} ${i + 1}`);
    attachTickSelectionHandlers(tick, () => {
      if (!canInteract()) {
        return;
      }
      setTick(i, { reason: "tick" });
    });
    ticksWrap.appendChild(tick);
    ticks.push(tick);
  }

  renderDialAtCurrentTick();

  return {
    ticks,
    setTick,
    getTick: () => activeTick,
    layout: () => layoutSingleQubitGateTicks(ticksWrap, ticks, orbitInset),
    beginDrag,
    continueDrag,
    endDrag,
    handleKeydown,
  };
}

function normalizedAngleFromTopDegrees(clientX, clientY, centerX, centerY) {
  const dx = clientX - centerX;
  const dy = clientY - centerY;
  const angleFromTop = Math.atan2(dx, -dy) * (180 / Math.PI);
  return (angleFromTop + 360) % 360;
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function parseLayoutNumeric(value, fallback = 0) {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function layoutTargetTranslate(element) {
  return {
    x: parseLayoutNumeric(element.dataset.layoutTx, 0),
    y: parseLayoutNumeric(element.dataset.layoutTy, 0),
  };
}

function setLayoutTargetTranslate(element, x, y) {
  const normalizedX = Number.parseFloat(x.toFixed(2));
  const normalizedY = Number.parseFloat(y.toFixed(2));
  element.dataset.layoutTx = `${normalizedX}`;
  element.dataset.layoutTy = `${normalizedY}`;
  element.style.translate = `${normalizedX}px ${normalizedY}px`;
}

function hasMeaningfulLayoutDelta(tx, ty, width, height) {
  return (
    Math.abs(tx) > 0.01 ||
    Math.abs(ty) > 0.01 ||
    Boolean(width) ||
    Boolean(height)
  );
}

function isLayoutTargetDeleted(element) {
  return element?.dataset?.layoutDeleted === "true";
}

function setLayoutManualEdited(element, edited) {
  if (!(element instanceof HTMLElement)) {
    return;
  }
  if (edited) {
    element.dataset.layoutManual = "true";
  } else {
    delete element.dataset.layoutManual;
  }
}

function setLayoutTargetDeleted(element, deleted) {
  if (!(element instanceof HTMLElement)) {
    return;
  }
  if (deleted) {
    element.dataset.layoutDeleted = "true";
    element.style.display = "none";
    return;
  }
  delete element.dataset.layoutDeleted;
  element.style.display = "";
}

function ensureLayoutResizeHandle(element) {
  if (element.querySelector(":scope > .layout-resize-handle")) {
    return;
  }
  const handle = document.createElement("span");
  handle.className = "layout-resize-handle";
  handle.setAttribute("aria-hidden", "true");
  element.appendChild(handle);
}

function keyboardEventIsTextEditing(event) {
  const target = event.target;
  if (!(target instanceof HTMLElement)) {
    return false;
  }
  if (target.isContentEditable) {
    return true;
  }
  const tag = target.tagName;
  return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT";
}

function pointerNearResizeCorner(element, pointer, inset = 20) {
  if (!(element instanceof HTMLElement) || !pointer) {
    return false;
  }
  const rect = element.getBoundingClientRect();
  return (
    pointer.clientX >= rect.right - inset &&
    pointer.clientY >= rect.bottom - inset
  );
}

function layoutItemBehindPoint(canvas, frontItem, pointer) {
  if (
    !(canvas instanceof HTMLElement) ||
    !(frontItem instanceof HTMLElement) ||
    !pointer ||
    typeof document.elementsFromPoint !== "function"
  ) {
    return null;
  }
  const stack = document.elementsFromPoint(pointer.clientX, pointer.clientY);
  for (const element of stack) {
    if (!(element instanceof Element)) {
      continue;
    }
    const candidate = element.closest(".playground-node");
    if (
      candidate instanceof HTMLElement &&
      candidate.parentElement === canvas &&
      candidate !== frontItem &&
      !frontItem.contains(candidate) &&
      !candidate.contains(frontItem)
    ) {
      return candidate;
    }
  }
  return null;
}

function setLayoutEditEnabled(enabled) {
  layoutEditorState.enabled = Boolean(enabled);
  document.body.classList.toggle(
    "layout-edit-active",
    layoutEditorState.enabled,
  );
  if (!layoutEditorState.enabled) {
    endGeneratedLayoutEditGesture();
    clearSelectedGeneratedLayoutItem();
  } else {
    endGeneratedRuntimeGesture();
    endGeneratedGateDialDrag();
    updateGeneratedEditorButtons();
  }
  document.querySelectorAll(".generated-layout-canvas").forEach((canvas) => {
    if (canvas instanceof HTMLElement) {
      syncGeneratedTextBoxSequence(canvas, { reset: !layoutEditorState.enabled });
    }
  });
  editorComposers.forEach((composer) => {
    if (typeof composer.handleLayoutEditChanged === "function") {
      composer.handleLayoutEditChanged(layoutEditorState.enabled);
    }
  });
}

window.addEventListener("mousemove", continueGeneratedLayoutEditGesture, {
  passive: false,
});
window.addEventListener("mousemove", continueGeneratedRuntimeGesture, {
  passive: false,
});
window.addEventListener("mousemove", continueGeneratedGateDialDrag, {
  passive: false,
});
window.addEventListener(
  "touchmove",
  (event) => {
    continueGeneratedLayoutEditGesture(event);
    continueGeneratedRuntimeGesture(event);
    continueGeneratedGateDialDrag(event);
  },
  { passive: false },
);
window.addEventListener("mouseup", () => {
  endGeneratedLayoutEditGesture();
  endGeneratedRuntimeGesture();
  endGeneratedGateDialDrag();
});
window.addEventListener("touchend", () => {
  endGeneratedLayoutEditGesture();
  endGeneratedRuntimeGesture();
  endGeneratedGateDialDrag();
});
window.addEventListener("touchcancel", () => {
  endGeneratedLayoutEditGesture();
  endGeneratedRuntimeGesture();
  endGeneratedGateDialDrag();
});
window.addEventListener("keydown", (event) => {
  if (!layoutEditorState.enabled || keyboardEventIsTextEditing(event)) {
    return;
  }
  if (event.key !== "Delete" && event.key !== "Backspace") {
    return;
  }
  if (removeSelectedGeneratedLayoutItem()) {
    event.preventDefault();
    event.stopImmediatePropagation();
    return;
  }
});

function resolveCircleRectOverlap(centerX, centerY, radius, rect, gap = 1) {
  const overlaps =
    centerX + radius > rect.left &&
    centerX - radius < rect.right &&
    centerY + radius > rect.top &&
    centerY - radius < rect.bottom;

  if (!overlaps) {
    return { x: centerX, y: centerY, overlapped: false };
  }

  const candidates = [
    { x: rect.left - radius - gap, y: centerY },
    { x: rect.right + radius + gap, y: centerY },
    { x: centerX, y: rect.top - radius - gap },
    { x: centerX, y: rect.bottom + radius + gap },
  ];

  let best = candidates[0];
  let bestDistance = Number.POSITIVE_INFINITY;
  candidates.forEach((candidate) => {
    const dx = candidate.x - centerX;
    const dy = candidate.y - centerY;
    const distanceSq = dx * dx + dy * dy;
    if (distanceSq < bestDistance) {
      bestDistance = distanceSq;
      best = candidate;
    }
  });

  return { x: best.x, y: best.y, overlapped: true };
}

function rgbToHsv(rgb) {
  const r = rgb[0] / 255;
  const g = rgb[1] / 255;
  const b = rgb[2] / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;

  let h = 0;
  if (delta !== 0) {
    if (max === r) {
      h = 60 * (((g - b) / delta) % 6);
    } else if (max === g) {
      h = 60 * ((b - r) / delta + 2);
    } else {
      h = 60 * ((r - g) / delta + 4);
    }
  }

  return {
    h: (h + 360) % 360,
    s: max === 0 ? 0 : delta / max,
    v: max,
  };
}

function hsvToRgb(h, s, v) {
  const normalizedHue = ((h % 360) + 360) % 360;
  const c = v * s;
  const x = c * (1 - Math.abs(((normalizedHue / 60) % 2) - 1));
  const m = v - c;

  let rPrime = 0;
  let gPrime = 0;
  let bPrime = 0;

  if (normalizedHue < 60) {
    rPrime = c;
    gPrime = x;
  } else if (normalizedHue < 120) {
    rPrime = x;
    gPrime = c;
  } else if (normalizedHue < 180) {
    gPrime = c;
    bPrime = x;
  } else if (normalizedHue < 240) {
    gPrime = x;
    bPrime = c;
  } else if (normalizedHue < 300) {
    rPrime = x;
    bPrime = c;
  } else {
    rPrime = c;
    bPrime = x;
  }

  return [
    Math.round((rPrime + m) * 255),
    Math.round((gPrime + m) * 255),
    Math.round((bPrime + m) * 255),
  ];
}

function interpolateHue(startHue, endHue, t) {
  const shortestDelta = ((endHue - startHue + 540) % 360) - 180;
  return (startHue + shortestDelta * t + 360) % 360;
}

function hueMixRatioForDisplay(redRatio) {
  if (redRatio <= 0) {
    return 0;
  }
  if (redRatio >= 1) {
    return 1;
  }

  const lerp = (start, end, t) => start + (end - start) * t;

  if (redRatio < 0.5) {
    // Explicitly separate blue-heavy mixed states while preserving the 50/50 midpoint.
    // Anchors: 0 -> 0, 1/6 -> 0.30, 1/3 -> 0.43, 1/2 -> 0.50
    if (redRatio <= 1 / 6) {
      return lerp(0, 0.3, redRatio / (1 / 6));
    }
    if (redRatio <= 1 / 3) {
      return lerp(0.3, 0.43, (redRatio - 1 / 6) / (1 / 6));
    }
    return lerp(0.43, 0.5, (redRatio - 1 / 3) / (1 / 6));
  }
  return redRatio;
}

const BLUE_HSV = rgbToHsv(BLUE_RGB);
const RED_HSV = rgbToHsv(RED_RGB);

function blendBlueRed(blueWeight, redWeight) {
  const total = blueWeight + redWeight;
  const redRatio = total > 0 ? redWeight / total : 0.5;

  if (redRatio <= 0) {
    return `rgb(${BLUE_RGB[0]}, ${BLUE_RGB[1]}, ${BLUE_RGB[2]})`;
  }

  if (redRatio >= 1) {
    return `rgb(${RED_RGB[0]}, ${RED_RGB[1]}, ${RED_RGB[2]})`;
  }

  const hue = interpolateHue(
    BLUE_HSV.h,
    RED_HSV.h,
    hueMixRatioForDisplay(redRatio),
  );
  const baseSaturation = BLUE_HSV.s * (1 - redRatio) + RED_HSV.s * redRatio;
  const baseValue = BLUE_HSV.v * (1 - redRatio) + RED_HSV.v * redRatio;
  const boostedSaturation = clamp(baseSaturation * 1.25, 0, 1);
  const boostedValue = clamp(baseValue * 1.06, 0, 1);
  const [r, g, b] = hsvToRgb(hue, boostedSaturation, boostedValue);

  return `rgb(${r}, ${g}, ${b})`;
}

function hsvSpecToCss(hsv) {
  const [r, g, b] = hsvToRgb(hsv.h, hsv.s / 100, hsv.v / 100);
  return `rgb(${r}, ${g}, ${b})`;
}

function realAmplitudeFromQuantumValue(value, tolerance = 1e-10) {
  let entry = value;
  if (quantumCore?.cleanComplex) {
    entry = quantumCore.cleanComplex(value, tolerance);
  }
  if (entry && typeof entry === "object" && Number.isFinite(entry.re)) {
    return Object.is(entry.re, -0) ? 0 : entry.re;
  }
  if (Array.isArray(entry) && Number.isFinite(entry[0])) {
    return Object.is(entry[0], -0) ? 0 : entry[0];
  }
  return Number.isFinite(entry) ? (Object.is(entry, -0) ? 0 : entry) : 0;
}

function realAmplitudesFromQuantumRegister(register, expectedLength) {
  const amplitudes = Array.isArray(register?.amplitudes)
    ? register.amplitudes
    : [];
  const length = Number.isInteger(expectedLength)
    ? expectedLength
    : amplitudes.length;
  return Array.from({ length }, (_, index) =>
    realAmplitudeFromQuantumValue(amplitudes[index] || 0),
  );
}

function quantumRegisterForTourState(numQubits, amplitudes) {
  if (!quantumCore?.createRegister) {
    return null;
  }
  return quantumCore.createRegister(numQubits, amplitudes);
}

function normalizedProbabilityPair(blue, red, fallbackBlue = 0.5) {
  const total = blue + red;
  if (!Number.isFinite(total) || total <= 1e-12) {
    return [clamp(fallbackBlue, 0, 1), clamp(1 - fallbackBlue, 0, 1)];
  }
  return [clamp(blue / total, 0, 1), clamp(red / total, 0, 1)];
}

function forcedPairMeasurementRegister(
  pairState,
  measuredQubitIndex,
  measuredColor,
) {
  if (!quantumCore?.createRegister || !quantumCore?.bitValue) {
    return null;
  }
  const source = quantumCore.createRegister(2, pairState?.amplitudes || []);
  const outcome = measuredColor === "blue" || measuredColor === "b" ? 0 : 1;
  const collapsed = source.amplitudes.map((amplitude, index) =>
    quantumCore.bitValue(index, 2, measuredQubitIndex) === outcome
      ? amplitude
      : quantumCore.complex
        ? quantumCore.complex(0)
        : 0,
  );
  return quantumCore.createRegister(2, collapsed);
}

function vectorTimesMatrix2(vector, matrix) {
  if (quantumCore?.createQubit && quantumCore?.applySingleQubitGate) {
    const register = quantumCore.applySingleQubitGate(
      quantumCore.createQubit(vector),
      0,
      matrix,
    );
    return realAmplitudesFromQuantumRegister(register, 2);
  }
  return [
    matrix[0][0] * vector[0] + matrix[0][1] * vector[1],
    matrix[1][0] * vector[0] + matrix[1][1] * vector[1],
  ];
}

function normalizeVector2(vector) {
  if (quantumCore?.createQubit) {
    return realAmplitudesFromQuantumRegister(quantumCore.createQubit(vector), 2);
  }
  const magnitude = Math.hypot(vector[0], vector[1]);
  if (!Number.isFinite(magnitude) || magnitude <= 1e-12) {
    return [1, 0];
  }
  return [vector[0] / magnitude, vector[1] / magnitude];
}

function canonicalizeRealAmplitudeVector(vector, tolerance = 1e-12) {
  const normalized = normalizeVector2(vector);
  const a = normalized[0];
  if (Math.abs(a) > tolerance && a < 0) {
    return [-normalized[0], -normalized[1]];
  }
  return normalized;
}

function probabilitiesFromVector2(vector) {
  if (quantumCore?.createQubit && quantumCore?.marginalProbabilities) {
    const marginal = quantumCore.marginalProbabilities(
      quantumCore.createQubit(vector),
      0,
    );
    return normalizedProbabilityPair(marginal.blue, marginal.red, 1);
  }
  const blue = vector[0] * vector[0];
  const red = vector[1] * vector[1];
  const total = blue + red;
  if (total <= 1e-12) {
    return [1, 0];
  }
  return [clamp(blue / total, 0, 1), clamp(red / total, 0, 1)];
}

function cnotMarginalProbabilitiesFromQubitVectors(
  controlVector,
  targetVector,
) {
  if (
    quantumCore?.productRegister &&
    quantumCore?.applyCnot &&
    quantumCore?.marginalProbabilities
  ) {
    const register = quantumCore.applyCnot(
      quantumCore.productRegister([controlVector, targetVector]),
      0,
      1,
    );
    const control = quantumCore.marginalProbabilities(register, 0);
    const target = quantumCore.marginalProbabilities(register, 1);
    return {
      control: normalizedProbabilityPair(control.blue, control.red, 0.5),
      target: normalizedProbabilityPair(target.blue, target.red, 0.5),
    };
  }
  const control = normalizeVector2(controlVector);
  const target = normalizeVector2(targetVector);

  const c0 = control[0];
  const c1 = control[1];
  const t0 = target[0];
  const t1 = target[1];

  // Basis order |00>, |01>, |10>, |11>; CNOT maps |10><->|11|.
  const outState = [c0 * t0, c0 * t1, c1 * t1, c1 * t0];

  const controlBlueRaw = outState[0] ** 2 + outState[1] ** 2;
  const controlRedRaw = outState[2] ** 2 + outState[3] ** 2;
  const targetBlueRaw = outState[0] ** 2 + outState[2] ** 2;
  const targetRedRaw = outState[1] ** 2 + outState[3] ** 2;

  const controlTotal = controlBlueRaw + controlRedRaw;
  const targetTotal = targetBlueRaw + targetRedRaw;

  const controlBlue =
    controlTotal > 1e-12 ? controlBlueRaw / controlTotal : 0.5;
  const targetBlue = targetTotal > 1e-12 ? targetBlueRaw / targetTotal : 0.5;

  return {
    control: [clamp(controlBlue, 0, 1), clamp(1 - controlBlue, 0, 1)],
    target: [clamp(targetBlue, 0, 1), clamp(1 - targetBlue, 0, 1)],
  };
}

function cnotOutcomeProbabilitiesFromQubitVectors(controlVector, targetVector) {
  if (
    quantumCore?.productRegister &&
    quantumCore?.applyCnot &&
    quantumCore?.magnitudeSquared
  ) {
    const register = quantumCore.applyCnot(
      quantumCore.productRegister([controlVector, targetVector]),
      0,
      1,
    );
    const raw = {
      bb: quantumCore.magnitudeSquared(register.amplitudes[0]),
      br: quantumCore.magnitudeSquared(register.amplitudes[1]),
      rb: quantumCore.magnitudeSquared(register.amplitudes[2]),
      rr: quantumCore.magnitudeSquared(register.amplitudes[3]),
    };
    const total = raw.bb + raw.br + raw.rb + raw.rr;
    if (total <= 1e-12) {
      return { bb: 0.25, br: 0.25, rb: 0.25, rr: 0.25 };
    }
    return {
      bb: clamp(raw.bb / total, 0, 1),
      br: clamp(raw.br / total, 0, 1),
      rb: clamp(raw.rb / total, 0, 1),
      rr: clamp(raw.rr / total, 0, 1),
    };
  }
  const control = normalizeVector2(controlVector);
  const target = normalizeVector2(targetVector);

  const c0 = control[0];
  const c1 = control[1];
  const t0 = target[0];
  const t1 = target[1];

  // Basis order |00>, |01>, |10>, |11>; CNOT swaps |10> and |11>.
  const outState = [c0 * t0, c0 * t1, c1 * t1, c1 * t0];
  const raw = {
    bb: outState[0] ** 2,
    br: outState[1] ** 2,
    rb: outState[2] ** 2,
    rr: outState[3] ** 2,
  };
  const total = raw.bb + raw.br + raw.rb + raw.rr;
  if (total <= 1e-12) {
    return { bb: 0.25, br: 0.25, rb: 0.25, rr: 0.25 };
  }
  return {
    bb: clamp(raw.bb / total, 0, 1),
    br: clamp(raw.br / total, 0, 1),
    rb: clamp(raw.rb / total, 0, 1),
    rr: clamp(raw.rr / total, 0, 1),
  };
}

function samplePairOutcomeFromProbabilities(probabilities) {
  const bb = clamp(probabilities?.bb ?? 0, 0, 1);
  const br = clamp(probabilities?.br ?? 0, 0, 1);
  const rb = clamp(probabilities?.rb ?? 0, 0, 1);
  const rr = clamp(probabilities?.rr ?? 0, 0, 1);
  const total = bb + br + rb + rr;
  if (total <= 1e-12) {
    return "bb";
  }
  const threshold = Math.random() * total;
  if (threshold < bb) {
    return "bb";
  }
  if (threshold < bb + br) {
    return "br";
  }
  if (threshold < bb + br + rb) {
    return "rb";
  }
  return "rr";
}

// --- Two-qubit amplitude helpers ---
function normalizeEntangledAmplitudes(amplitudes) {
  const register = quantumRegisterForTourState(2, amplitudes);
  if (register) {
    return realAmplitudesFromQuantumRegister(register, 4);
  }
  const total = amplitudes.reduce((acc, v) => acc + v * v, 0);
  if (!Number.isFinite(total) || total <= 1e-16) {
    return [1, 0, 0, 0];
  }
  const norm = Math.sqrt(total);
  return amplitudes.map((v) => v / norm);
}

function sharedRegisterQubitCountFromAmplitudes(amplitudes, fallback = 2) {
  if (Array.isArray(amplitudes) && amplitudes.length > 0) {
    const inferred = Math.log2(amplitudes.length);
    if (
      Number.isInteger(inferred) &&
      inferred >= 1 &&
      inferred <= SHARED_REGISTER_MAX_QUBITS
    ) {
      return inferred;
    }
  }
  if (Number.isInteger(fallback) && fallback >= 1) {
    return Math.min(fallback, SHARED_REGISTER_MAX_QUBITS);
  }
  return 2;
}

function sharedRegisterNormalizeAmplitudes(numQubits, amplitudes) {
  const safeNumQubits =
    Number.isInteger(numQubits) && numQubits >= 1
      ? Math.min(numQubits, SHARED_REGISTER_MAX_QUBITS)
      : sharedRegisterQubitCountFromAmplitudes(amplitudes, 2);
  const register = sharedRegisterCreate(safeNumQubits, amplitudes);
  if (register) {
    return realAmplitudesFromQuantumRegister(register, 2 ** safeNumQubits);
  }
  if (safeNumQubits === 2) {
    return normalizeEntangledAmplitudes(amplitudes);
  }
  const expectedLength = 2 ** safeNumQubits;
  const source = Array.isArray(amplitudes) ? amplitudes : [];
  const values = Array.from({ length: expectedLength }, (_, index) => {
    const value = source[index];
    return typeof value === "number" && Number.isFinite(value) ? value : 0;
  });
  const normSquared = values.reduce((sum, value) => sum + value * value, 0);
  if (!Number.isFinite(normSquared) || normSquared <= 1e-16) {
    values.fill(0);
    values[0] = 1;
    return values;
  }
  const norm = Math.sqrt(normSquared);
  return values.map((value) => value / norm);
}

function inferRegisterQubitCountFromAmplitudes(amplitudes, fallback = 2) {
  return sharedRegisterQubitCountFromAmplitudes(amplitudes, fallback);
}

function normalizeTourRegisterAmplitudes(numQubits, amplitudes) {
  return sharedRegisterNormalizeAmplitudes(numQubits, amplitudes);
}

function registerStateNumQubits(state) {
  return sharedRegisterQubitCountFromAmplitudes(
    state?.amplitudes,
    Number.isInteger(state?.numQubits) ? state.numQubits : 2,
  );
}

function sharedRegisterCreate(numQubits, amplitudes = null) {
  if (!quantumCore?.createRegister) {
    return null;
  }
  const safeNumQubits = Math.min(
    Math.max(Number.isInteger(numQubits) ? numQubits : 1, 1),
    SHARED_REGISTER_MAX_QUBITS,
  );
  return quantumCore.createRegister(safeNumQubits, amplitudes);
}

function sharedRegisterFromState(state) {
  const numQubits = registerStateNumQubits(state);
  return sharedRegisterCreate(
    numQubits,
    sharedRegisterNormalizeAmplitudes(numQubits, state?.amplitudes || []),
  );
}

function registerStateAsQuantumRegister(state) {
  return sharedRegisterFromState(state);
}

function sharedRegisterWriteState(state, register, displayMode = "conditional") {
  if (!state || !register) {
    return null;
  }
  state.numQubits = register.numQubits;
  state.amplitudes = realAmplitudesFromQuantumRegister(
    register,
    2 ** register.numQubits,
  );
  state.displayMode = displayMode;
  if (register.numQubits !== 2 || displayMode !== "linked") {
    delete state.linkRelation;
  }
  return state;
}

function sharedRegisterApplySingleGate(state, qubitIndex, matrix) {
  const register = sharedRegisterFromState(state);
  if (!register || !quantumCore?.applySingleQubitGate) {
    return null;
  }
  return sharedRegisterWriteState(
    state,
    quantumCore.applySingleQubitGate(register, qubitIndex, matrix),
  );
}

function sharedRegisterApplyCnot(state, controlIndex, targetIndex) {
  const register = sharedRegisterFromState(state);
  if (!register || !quantumCore?.applyCnot || controlIndex === targetIndex) {
    return null;
  }
  sharedRegisterWriteState(
    state,
    quantumCore.applyCnot(register, controlIndex, targetIndex),
  );
  if (state.numQubits === 2) {
    syncPairLinkRelation(state);
  }
  return state;
}

function sharedRegisterTensor(registers) {
  const source = (Array.isArray(registers) ? registers : []).filter(Boolean);
  const totalQubits = source.reduce(
    (sum, register) => sum + (register?.numQubits || 0),
    0,
  );
  if (
    !source.length ||
    totalQubits > SHARED_REGISTER_MAX_QUBITS ||
    !quantumCore?.tensorProductRegisters
  ) {
    return null;
  }
  return quantumCore.tensorProductRegisters(source);
}

function sharedRegisterMarginalVector(state, qubitIndex) {
  const register = sharedRegisterFromState(state);
  if (register && quantumCore?.marginalProbabilities) {
    const marginal = quantumCore.marginalProbabilities(register, qubitIndex);
    return canonicalizeRealAmplitudeVector([
      Math.sqrt(clamp(marginal.blue, 0, 1)),
      Math.sqrt(clamp(marginal.red, 0, 1)),
    ]);
  }
  return [1, 0];
}

function sharedRegisterJointOutcomeProbabilities(
  state,
  firstIndex = 0,
  secondIndex = 1,
) {
  const register = sharedRegisterFromState(state);
  if (!register || !quantumCore?.bitValue || !quantumCore?.magnitudeSquared) {
    return { bb: 0.25, br: 0.25, rb: 0.25, rr: 0.25 };
  }
  const raw = { bb: 0, br: 0, rb: 0, rr: 0 };
  register.amplitudes.forEach((amplitude, basisIndex) => {
    const firstBit = quantumCore.bitValue(
      basisIndex,
      register.numQubits,
      firstIndex,
    );
    const secondBit = quantumCore.bitValue(
      basisIndex,
      register.numQubits,
      secondIndex,
    );
    const key = `${firstBit ? "r" : "b"}${secondBit ? "r" : "b"}`;
    raw[key] += quantumCore.magnitudeSquared(amplitude);
  });
  return raw;
}

function sharedRegisterCollapseMembersToOutcome(
  state,
  firstIndex,
  secondIndex,
  outcomeKey,
) {
  const register = sharedRegisterFromState(state);
  if (!register || !quantumCore?.bitValue || !quantumCore?.createRegister) {
    return null;
  }
  const firstBit = outcomeKey?.[0] === "r" ? 1 : 0;
  const secondBit = outcomeKey?.[1] === "r" ? 1 : 0;
  const collapsed = register.amplitudes.map((amplitude, basisIndex) =>
    quantumCore.bitValue(basisIndex, register.numQubits, firstIndex) ===
      firstBit &&
    quantumCore.bitValue(basisIndex, register.numQubits, secondIndex) ===
      secondBit
      ? amplitude
      : quantumCore.complex
        ? quantumCore.complex(0)
        : 0,
  );
  return sharedRegisterWriteState(
    state,
    quantumCore.createRegister(register.numQubits, collapsed),
  );
}

function sharedRegisterMeasureMember(state, qubitIndex, color = null) {
  const register = sharedRegisterFromState(state);
  if (!register || !quantumCore?.measureQubit) {
    return null;
  }
  let randomValue = Math.random();
  if (color === "blue" || color === "red") {
    const marginal = quantumCore.marginalProbabilities(register, qubitIndex);
    const blueProbability = clamp(marginal.blue, 0, 1);
    randomValue =
      color === "blue"
        ? Math.max(0, blueProbability / 2)
        : Math.min(0.999999, blueProbability + (1 - blueProbability) / 2);
  }
  const result = quantumCore.measureQubit(register, qubitIndex, randomValue);
  sharedRegisterWriteState(state, result.register);
  return result;
}

function assignRuntimeStateToRegisterMember(member, registerState, qubitIndex) {
  if (!member?.state) {
    return;
  }
  member.qubitIndex = qubitIndex;
  member.state.pairState = registerState;
  member.state.pairQubitIndex = qubitIndex;
}

function registerMembersForRemoteSnapshot(registerState) {
  const numQubits = registerStateNumQubits(registerState);
  const byIndex = new Map();
  (Array.isArray(registerState?.remoteMembers)
    ? registerState.remoteMembers
    : []
  ).forEach((member) => {
    if (Number.isInteger(member?.qubitIndex)) {
      byIndex.set(member.qubitIndex, { ...member });
    }
  });
  (Array.isArray(registerState?.members) ? registerState.members : []).forEach(
    (member) => {
      if (!Number.isInteger(member?.qubitIndex)) {
        return;
      }
      const current = byIndex.get(member.qubitIndex) || {};
      const roomQubit = roomQubitIdentityForItem(member.item);
      byIndex.set(member.qubitIndex, {
        ...current,
        participantId:
          current.participantId || mailboxRoomState.participantId || null,
        role: current.role || "local",
        qubitIndex: member.qubitIndex,
        roomId: roomQubit?.roomId || current.roomId || mailboxRoomState.roomId || null,
        roomQubitIndex:
          Number.isInteger(roomQubit?.roomQubitIndex)
            ? roomQubit.roomQubitIndex
            : current.roomQubitIndex,
        qubitId: roomQubit?.qubitId || current.qubitId,
        label: roomQubit?.label || current.label,
      });
    },
  );
  return Array.from({ length: numQubits }, (_, qubitIndex) => ({
    ...(byIndex.get(qubitIndex) || {
      participantId: mailboxRoomState.participantId || null,
      role: "member",
    }),
    qubitIndex,
  }));
}

function singleQubitVectorFromRegisterState(registerState, qubitIndex) {
  return sharedRegisterMarginalVector(registerState, qubitIndex);
}

function applySingleQubitGateToPair(state, qubitIndex, U) {
  sharedRegisterApplySingleGate(state, qubitIndex, U);
  if (registerStateNumQubits(state) === 2) {
    syncPairLinkRelation(state);
  }
}

function inferPairLinkRelation(state, tolerance = 1e-9) {
  const probabilities = pairOutcomeProbabilitiesFromState(state);
  const correlated = probabilities.bb + probabilities.rr;
  const antiCorrelated = probabilities.br + probabilities.rb;
  if (correlated >= 1 - tolerance) {
    return "correlated";
  }
  if (antiCorrelated >= 1 - tolerance) {
    return "anti-correlated";
  }
  return null;
}

function syncPairLinkRelation(state) {
  if (!state) {
    return null;
  }
  const relation = inferPairLinkRelation(state);
  if (relation) {
    state.linkRelation = relation;
    state.displayMode = "linked";
  } else {
    delete state.linkRelation;
    state.displayMode = "conditional";
  }
  return relation;
}

function setLinkedPairStateFromMemberVector(state, qubitIndex, vector) {
  const [blueAmplitude, redAmplitude] = normalizeVector2(vector);
  if (state?.linkRelation === "correlated") {
    state.amplitudes = normalizeEntangledAmplitudes([
      blueAmplitude,
      0,
      0,
      redAmplitude,
    ]);
  } else if (state?.linkRelation === "anti-correlated" && qubitIndex === 1) {
    state.amplitudes = normalizeEntangledAmplitudes([
      0,
      redAmplitude,
      blueAmplitude,
      0,
    ]);
  } else if (state?.linkRelation === "anti-correlated") {
    state.amplitudes = normalizeEntangledAmplitudes([
      0,
      blueAmplitude,
      redAmplitude,
      0,
    ]);
  } else {
    return;
  }
  state.displayMode = "linked";
}

function applyCNOTToPairWithControl(state, controlIndex = 0) {
  const targetIndex = Array.isArray(state?.members)
    ? state.members
        .map((member) => member?.qubitIndex)
        .find(
          (candidate) => Number.isInteger(candidate) && candidate !== controlIndex,
        )
    : controlIndex === 0
      ? 1
      : 0;
  if (Number.isInteger(targetIndex)) {
    sharedRegisterApplyCnot(state, controlIndex, targetIndex);
  }
}

function applyCNOTToRegisterState(state, controlIndex = 0, targetIndex = 1) {
  sharedRegisterApplyCnot(state, controlIndex, targetIndex);
}

function applyCNOTToPair(state) {
  applyCNOTToPairWithControl(state, 0);
}

function samplePairOutcomeFromEntangledState(state) {
  return samplePairOutcomeFromProbabilities(
    pairOutcomeProbabilitiesFromState(state),
  );
}

function samplePairOutcomeForRegisterMembers(state, firstIndex, secondIndex) {
  return samplePairOutcomeFromProbabilities(
    pairOutcomeProbabilitiesForRegisterMembers(state, firstIndex, secondIndex),
  );
}

function deepCopyAmplitudes(amplitudes) {
  return (amplitudes || []).slice(0);
}

function collapsePairStateToOutcome(state, outcomeKey) {
  sharedRegisterCollapseMembersToOutcome(state, 0, 1, outcomeKey);
}

function collapseRegisterStateMembersToOutcome(
  state,
  firstIndex,
  secondIndex,
  outcomeKey,
) {
  sharedRegisterCollapseMembersToOutcome(
    state,
    firstIndex,
    secondIndex,
    outcomeKey,
  );
}

function pairOutcomeKeyFromColorBooleans(topBlue, bottomBlue) {
  if (topBlue && bottomBlue) {
    return "bb";
  }
  if (topBlue && !bottomBlue) {
    return "br";
  }
  if (!topBlue && bottomBlue) {
    return "rb";
  }
  return "rr";
}

function swapPairOutcomeKey(outcomeKey) {
  if (typeof outcomeKey !== "string" || outcomeKey.length < 2) {
    return outcomeKey;
  }
  return `${outcomeKey[1]}${outcomeKey[0]}`;
}

function outcomeKeyForPairStatesInArgumentOrder(
  outcomeKey,
  firstState,
  secondState,
) {
  const firstIndex = firstState?.pairQubitIndex;
  const secondIndex = secondState?.pairQubitIndex;
  if (firstIndex === 0 && secondIndex === 1) {
    return outcomeKey;
  }
  if (firstIndex === 1 && secondIndex === 0) {
    return swapPairOutcomeKey(outcomeKey);
  }
  return outcomeKey;
}

function outcomeKeyForPairIdsInArgumentOrder(
  outcomeKey,
  sourceFirstId,
  sourceSecondId,
  targetFirstId,
  targetSecondId,
) {
  if (sourceFirstId && sourceSecondId && targetFirstId && targetSecondId) {
    if (sourceFirstId === targetFirstId && sourceSecondId === targetSecondId) {
      return outcomeKey;
    }
    if (sourceFirstId === targetSecondId && sourceSecondId === targetFirstId) {
      return swapPairOutcomeKey(outcomeKey);
    }
  }
  return outcomeKey;
}

function runtimeStatesSharePairState(firstState, secondState) {
  return Boolean(
    firstState?.pairState &&
      firstState.pairState === secondState?.pairState &&
      Number.isFinite(firstState.pairQubitIndex) &&
      Number.isFinite(secondState.pairQubitIndex) &&
      firstState.pairQubitIndex !== secondState.pairQubitIndex,
  );
}

function singleQubitVectorFromPairState(pairState, qubitIndex) {
  if (registerStateNumQubits(pairState) !== 2) {
    return singleQubitVectorFromRegisterState(pairState, qubitIndex);
  }
  const marginals = pairMarginalsFromEntangledState(pairState);
  const marginal = qubitIndex === 0 ? marginals.top : marginals.bottom;
  return canonicalizeRealAmplitudeVector([
    Math.sqrt(clamp(marginal.blue, 0, 1)),
    Math.sqrt(clamp(marginal.red, 0, 1)),
  ]);
}

function nonzeroConditionalPairVector(vector) {
  if (!Array.isArray(vector) || vector.length < 2) {
    return null;
  }
  const magnitude = Math.hypot(vector[0], vector[1]);
  if (!Number.isFinite(magnitude) || magnitude <= 1e-12) {
    return null;
  }
  return canonicalizeRealAmplitudeVector(vector);
}

function displayVectorForPairMember(pairState, qubitIndex) {
  if (registerStateNumQubits(pairState) !== 2) {
    return singleQubitVectorFromRegisterState(pairState, qubitIndex);
  }
  if (pairState?.linkRelation === "correlated") {
    return (
      nonzeroConditionalPairVector([
        pairState.amplitudes?.[0] || 0,
        pairState.amplitudes?.[3] || 0,
      ]) || singleQubitVectorFromPairState(pairState, qubitIndex)
    );
  }
  if (pairState?.linkRelation === "anti-correlated") {
    if (qubitIndex === 1) {
      return (
        nonzeroConditionalPairVector([
          pairState.amplitudes?.[2] || 0,
          pairState.amplitudes?.[1] || 0,
        ]) || singleQubitVectorFromPairState(pairState, qubitIndex)
      );
    }
    return (
      nonzeroConditionalPairVector([
        pairState.amplitudes?.[1] || 0,
        pairState.amplitudes?.[2] || 0,
      ]) || singleQubitVectorFromPairState(pairState, qubitIndex)
    );
  }
  if (pairState?.displayMode !== "conditional") {
    return singleQubitVectorFromPairState(pairState, qubitIndex);
  }
  const amplitudes = normalizeEntangledAmplitudes(pairState?.amplitudes || []);
  if (qubitIndex === 0) {
    return (
      nonzeroConditionalPairVector([amplitudes[0], amplitudes[2]]) ||
      nonzeroConditionalPairVector([amplitudes[1], amplitudes[3]]) ||
      singleQubitVectorFromPairState(pairState, qubitIndex)
    );
  }
  if (qubitIndex === 1) {
    return (
      nonzeroConditionalPairVector([amplitudes[0], amplitudes[1]]) ||
      nonzeroConditionalPairVector([amplitudes[2], amplitudes[3]]) ||
      singleQubitVectorFromPairState(pairState, qubitIndex)
    );
  }
  return singleQubitVectorFromPairState(pairState, qubitIndex);
}

function conditionalVectorAfterPairMeasurement(
  pairState,
  measuredQubitIndex,
  measuredColor,
) {
  const collapsed = forcedPairMeasurementRegister(
    pairState,
    measuredQubitIndex,
    measuredColor,
  );
  if (collapsed) {
    const amplitudes = realAmplitudesFromQuantumRegister(collapsed, 4);
    const measuredBlue = measuredColor === "blue" || measuredColor === "b";
    if (measuredQubitIndex === 0) {
      return normalizeVector2(
        measuredBlue
          ? [amplitudes[0], amplitudes[1]]
          : [amplitudes[2], amplitudes[3]],
      );
    }
    return normalizeVector2(
      measuredBlue
        ? [amplitudes[0], amplitudes[2]]
        : [amplitudes[1], amplitudes[3]],
    );
  }
  const a = normalizeEntangledAmplitudes(pairState?.amplitudes || []);
  const measuredBlue = measuredColor === "blue" || measuredColor === "b";
  if (measuredQubitIndex === 0) {
    return normalizeVector2(measuredBlue ? [a[0], a[1]] : [a[2], a[3]]);
  }
  return normalizeVector2(measuredBlue ? [a[0], a[2]] : [a[1], a[3]]);
}

function collapsePairStateBySingleQubitMeasurement(
  pairState,
  measuredQubitIndex,
  measuredColor,
) {
  const collapsed = forcedPairMeasurementRegister(
    pairState,
    measuredQubitIndex,
    measuredColor,
  );
  if (collapsed) {
    pairState.amplitudes = realAmplitudesFromQuantumRegister(collapsed, 4);
    return;
  }
  const measuredBlue = measuredColor === "blue" || measuredColor === "b";
  const source = normalizeEntangledAmplitudes(pairState?.amplitudes || []);
  const next = source.map((amplitude, index) => {
    const topBlue = index < 2;
    const bottomBlue = index === 0 || index === 2;
    const matches =
      measuredQubitIndex === 0
        ? topBlue === measuredBlue
        : bottomBlue === measuredBlue;
    return matches ? amplitude : 0;
  });
  pairState.amplitudes = normalizeEntangledAmplitudes(next);
}

function sampleSingleQubitOutcomeFromPairState(pairState, qubitIndex) {
  const register = sharedRegisterFromState(pairState);
  const marginal =
    register && quantumCore?.marginalProbabilities
      ? quantumCore.marginalProbabilities(register, qubitIndex)
      : { blue: 1, red: 0 };
  const blueProbability = marginal.blue;
  if (blueProbability >= 1) {
    return "blue";
  }
  if (blueProbability <= 0) {
    return "red";
  }
  return Math.random() < blueProbability ? "blue" : "red";
}

function pairOutcomeProbabilitiesFromState(state) {
  return sharedRegisterJointOutcomeProbabilities(state, 0, 1);
}

function pairOutcomeProbabilitiesForRegisterMembers(
  state,
  firstIndex = 0,
  secondIndex = 1,
) {
  return sharedRegisterJointOutcomeProbabilities(state, firstIndex, secondIndex);
}

function pairMarginalsFromEntangledState(state) {
  const register = quantumRegisterForTourState(2, state?.amplitudes || []);
  if (register && quantumCore?.marginalProbabilities) {
    const top = quantumCore.marginalProbabilities(register, 0);
    const bottom = quantumCore.marginalProbabilities(register, 1);
    return {
      top: {
        blue: top.blue,
        red: top.red,
      },
      bottom: {
        blue: bottom.blue,
        red: bottom.red,
      },
    };
  }
  const probabilities = pairOutcomeProbabilitiesFromState(state);
  return {
    top: {
      blue: probabilities.bb + probabilities.br,
      red: probabilities.rb + probabilities.rr,
    },
    bottom: {
      blue: probabilities.bb + probabilities.rb,
      red: probabilities.br + probabilities.rr,
    },
  };
}

function entangledAmplitudesFromQubitVectors(topVector, bottomVector) {
  if (quantumCore?.productRegister) {
    return realAmplitudesFromQuantumRegister(
      quantumCore.productRegister([topVector, bottomVector]),
      4,
    );
  }
  const top = normalizeVector2(topVector);
  const bottom = normalizeVector2(bottomVector);
  return normalizeEntangledAmplitudes([
    top[0] * bottom[0],
    top[0] * bottom[1],
    top[1] * bottom[0],
    top[1] * bottom[1],
  ]);
}

function cloneRecordedActions(actions) {
  return Array.isArray(actions)
    ? actions.map((action) => ({ ...action }))
    : [];
}

function recordedGateTickForAction(action, gateSettings) {
  const gateIndex = Number.isFinite(action?.gateIndex)
    ? action.gateIndex
    : Number.isFinite(action?.qubitIndex)
      ? action.qubitIndex
      : 0;
  const settingTick = Array.isArray(gateSettings)
    ? gateSettings[gateIndex]
    : undefined;
  const tick = Number.isFinite(settingTick)
    ? settingTick
    : Number.isFinite(action?.tickIndex)
      ? action.tickIndex
      : DEFAULT_SINGLE_GATE_TICK_INDEX;
  return normalizeTickIndex(tick);
}

function sampleSingleQubitOutcomeFromVector(vector) {
  const [blueProbability] = probabilitiesFromVector2(normalizeVector2(vector));
  if (blueProbability >= 1) {
    return "blue";
  }
  if (blueProbability <= 0) {
    return "red";
  }
  return Math.random() < blueProbability ? "blue" : "red";
}

function replayRecordedSingleQubitExperiment(
  iterations,
  { actions = [], initialVector = [1, 0], gateSettings = [] } = {},
) {
  const counts = { blue: 0, red: 0 };
  if (!Array.isArray(actions) || actions.length === 0) {
    return counts;
  }

  for (let run = 0; run < iterations; run += 1) {
    let vector = normalizeVector2(initialVector);
    let measured = false;

    actions.forEach((action) => {
      if (!action || !action.type) {
        return;
      }
      if (action.type === "gate") {
        const tickIndex = recordedGateTickForAction(action, gateSettings);
        vector = normalizeVector2(
          vectorTimesMatrix2(vector, gateMatrixForTick(tickIndex)),
        );
        return;
      }
      if (action.type === "measure") {
        const outcome = sampleSingleQubitOutcomeFromVector(vector);
        vector = outcome === "blue" ? [1, 0] : [0, 1];
        counts[outcome] += 1;
        measured = true;
      }
    });

    if (!measured) {
      const outcome = sampleSingleQubitOutcomeFromVector(vector);
      counts[outcome] += 1;
    }
  }

  return counts;
}

function replayRecordedExperiment(
  iterations,
  {
    actions = [],
    initialAmplitudes = [1, 0, 0, 0],
    gateSettings = [],
  } = {},
) {
  const counts = { bb: 0, br: 0, rb: 0, rr: 0 };
  if (!Array.isArray(actions) || actions.length === 0) {
    return counts;
  }

  for (let run = 0; run < iterations; run += 1) {
    const snapshot = {
      amplitudes: normalizeEntangledAmplitudes(
        deepCopyAmplitudes(initialAmplitudes),
      ),
    };
    let measured = false;

    actions.forEach((action) => {
      if (!action || !action.type) {
        return;
      }
      if (action.type === "gate") {
        const tickIndex = recordedGateTickForAction(action, gateSettings);
        const qubitIndex = Number.isFinite(action.qubitIndex)
          ? action.qubitIndex
          : Number.isFinite(action.gateIndex)
            ? action.gateIndex
            : 0;
        applySingleQubitGateToPair(
          snapshot,
          qubitIndex,
          gateMatrixForTick(tickIndex),
        );
        return;
      }
      if (action.type === "cnot") {
        applyCNOTToPair(snapshot);
        return;
      }
      if (action.type === "measure") {
        const outcome = samplePairOutcomeFromEntangledState(snapshot);
        collapsePairStateToOutcome(snapshot, outcome);
        counts[outcome] += 1;
        measured = true;
      }
    });

    if (!measured) {
      const outcome = samplePairOutcomeFromEntangledState(snapshot);
      counts[outcome] += 1;
    }
  }

  return counts;
}

function clockTickNumberFromIndex(tickIndex) {
  const normalizedTick = ((tickIndex % 12) + 12) % 12;
  return normalizedTick === 0 ? 12 : normalizedTick;
}

function gateMatrixForTick(tick) {
  const normalizedTick = ((tick % 12) + 12) % 12;
  const clockTick = clockTickNumberFromIndex(normalizedTick);
  const theta = (clockTick * Math.PI) / 6;
  const halfTheta = theta / 2;
  const cosHalf = Math.cos(halfTheta);
  const sinHalf = Math.sin(halfTheta);

  return [
    [-cosHalf, sinHalf],
    [-sinHalf, -cosHalf],
  ];
}

function oneQubitGateMatrixForButton(buttonIndex) {
  const normalizedIndex =
    ((buttonIndex % ONE_QUBIT_BUTTON_BLUE_PROBABILITIES.length) +
      ONE_QUBIT_BUTTON_BLUE_PROBABILITIES.length) %
    ONE_QUBIT_BUTTON_BLUE_PROBABILITIES.length;
  const blueProbability = ONE_QUBIT_BUTTON_BLUE_PROBABILITIES[normalizedIndex];
  const redProbability = 1 - blueProbability;
  const a = Math.sqrt(clamp(blueProbability, 0, 1));
  const b = Math.sqrt(clamp(redProbability, 0, 1));

  return [
    [a, b],
    [-b, a],
  ];
}

function oneQubitGateWeightsForButton(buttonIndex) {
  const normalizedIndex =
    ((buttonIndex % ONE_QUBIT_BUTTON_BLUE_PROBABILITIES.length) +
      ONE_QUBIT_BUTTON_BLUE_PROBABILITIES.length) %
    ONE_QUBIT_BUTTON_BLUE_PROBABILITIES.length;
  const blueProbability = ONE_QUBIT_BUTTON_BLUE_PROBABILITIES[normalizedIndex];
  return [blueProbability, 1 - blueProbability];
}

function oneQubitGateWeightsForTick(tickIndex) {
  const transformed = vectorTimesMatrix2([1, 0], gateMatrixForTick(tickIndex));
  return probabilitiesFromVector2(normalizeVector2(transformed));
}

function phaseSignForRealAmplitudeVector(vector) {
  const normalized = normalizeVector2(vector);
  const [blueWeight, redWeight] = probabilitiesFromVector2(normalized);
  const basisTolerance = 1e-9;
  const isBlueBasis =
    Math.abs(blueWeight - 1) <= basisTolerance && redWeight <= basisTolerance;
  const isRedBasis =
    Math.abs(redWeight - 1) <= basisTolerance && blueWeight <= basisTolerance;
  if (isBlueBasis || isRedBasis) {
    return null;
  }

  const [, canonicalB] = canonicalizeRealAmplitudeVector(normalized);
  if (canonicalB < -basisTolerance) {
    return "−";
  }
  if (canonicalB > basisTolerance) {
    return "+";
  }
  return null;
}

function gcd(a, b) {
  let x = a;
  let y = b;
  while (y !== 0) {
    const t = x % y;
    x = y;
    y = t;
  }
  return x || 1;
}

function formatFraction(value) {
  if (Math.abs(value) < 1e-9) {
    return "0";
  }

  if (Math.abs(value - 1) < 1e-9) {
    return "1";
  }

  for (let denominator = 2; denominator <= 24; denominator += 1) {
    const numerator = Math.round(value * denominator);
    if (Math.abs(value - numerator / denominator) < 1e-6) {
      const divisor = gcd(Math.abs(numerator), denominator);
      return `${numerator / divisor}/${denominator / divisor}`;
    }
  }

  return value.toFixed(3).replace(/0+$/, "").replace(/\.$/, "");
}

let qubitInspectorRoot = null;
let qubitInspectorTitle = null;
let qubitInspectorVector = null;
let qubitSelectionMarquee = null;
const qubitStateGetters = new Map();
const gateStateGetters = new Map();
const selectionContainers = new WeakSet();
let selectedQubitElements = [];
let delegatedGateInspectorInstalled = false;

function ensureQubitInspector() {
  if (qubitInspectorRoot) {
    return qubitInspectorRoot;
  }

  const panel = document.createElement("aside");
  panel.className = "qubit-inspector hidden";
  panel.setAttribute("role", "dialog");
  panel.setAttribute("aria-label", "Qubit state inspector");

  const header = document.createElement("div");
  header.className = "qubit-inspector-header";

  const title = document.createElement("strong");
  title.textContent = "Qubit Inspector";

  const closeButton = document.createElement("button");
  closeButton.type = "button";
  closeButton.className = "qubit-inspector-close";
  closeButton.textContent = "Close";
  closeButton.addEventListener("click", () => {
    panel.classList.add("hidden");
  });

  header.appendChild(title);
  header.appendChild(closeButton);

  const body = document.createElement("div");
  body.className = "qubit-inspector-body";

  const vector = document.createElement("pre");
  vector.className = "qubit-inspector-vector";
  body.appendChild(vector);

  panel.appendChild(header);
  panel.appendChild(body);
  document.body.appendChild(panel);

  qubitInspectorRoot = panel;
  qubitInspectorTitle = title;
  qubitInspectorVector = vector;
  return panel;
}

function ensureQubitSelectionMarquee() {
  if (qubitSelectionMarquee) {
    return qubitSelectionMarquee;
  }

  const marquee = document.createElement("div");
  marquee.className = "qubit-selection-marquee hidden";
  document.body.appendChild(marquee);
  qubitSelectionMarquee = marquee;
  return marquee;
}

function formatComplexFromParts(realValue, imaginaryValue) {
  const realRounded = Number(realValue.toFixed(6));
  const imagRounded = Number(imaginaryValue.toFixed(6));
  const real = Object.is(realRounded, -0) ? 0 : realRounded;
  const imag = Object.is(imagRounded, -0) ? 0 : imagRounded;
  const imagSign = imag < 0 ? "-" : "+";
  return `${real.toFixed(6)} ${imagSign} ${Math.abs(imag).toFixed(6)}i`;
}

function formatComplex(value) {
  if (
    Array.isArray(value) &&
    value.length >= 2 &&
    Number.isFinite(value[0]) &&
    Number.isFinite(value[1])
  ) {
    return formatComplexFromParts(value[0], value[1]);
  }

  if (
    value &&
    typeof value === "object" &&
    Number.isFinite(value.re) &&
    Number.isFinite(value.im)
  ) {
    return formatComplexFromParts(value.re, value.im);
  }

  if (Number.isFinite(value)) {
    return formatComplexFromParts(value, 0);
  }

  return formatComplexFromParts(0, 0);
}

function formatQuantumRegisterAmplitude(value) {
  const entry = quantumCore?.cleanComplex
    ? quantumCore.cleanComplex(value)
    : value;
  return formatComplex(entry);
}

function quantumRegisterKetLines(register, options = {}) {
  if (
    !quantumCore ||
    !register ||
    !Number.isInteger(register.numQubits) ||
    !Array.isArray(register.amplitudes)
  ) {
    return [];
  }
  const state = quantumCore.createRegister(
    register.numQubits,
    register.amplitudes,
  );
  const basisCount = state.amplitudes.length;
  const lines = [
    `Register: ${state.numQubits} qubit${state.numQubits === 1 ? "" : "s"} (${basisCount} basis states)`,
  ];
  if (Number.isInteger(options.selectedIndex)) {
    lines.push(`Selected member: q${options.selectedIndex}`);
  }
  if (Array.isArray(options.memberLabels) && options.memberLabels.length) {
    lines.push(`Members: ${options.memberLabels.join(", ")}`);
  }
  lines.push(`Basis order: |${Array.from({ length: state.numQubits }, (_, index) => `q${index}`).join("")}>`);
  lines.push("");
  lines.push("|Psi> =");
  state.amplitudes.forEach((amplitude, index) => {
    const probability = quantumCore.magnitudeSquared(amplitude);
    lines.push(
      `  ${formatQuantumRegisterAmplitude(amplitude)} |${quantumCore.basisLabel(index, state.numQubits)}>    p=${probability.toFixed(6)}`,
    );
  });
  return lines;
}

function memberLabelForQubit(item, fallback) {
  const logicalId = normalizeQubitId(item?.dataset?.qubitId);
  const roomIndex = roomQubitIndexForItem(item);
  const labelIndex = Number.isInteger(roomIndex) ? roomIndex : fallback;
  const itemId = item?.dataset?.generatedItemId || item?.dataset?.component || "";
  if (logicalId) {
    return `q${labelIndex}#${logicalId}`;
  }
  return itemId ? `q${labelIndex}:${itemId}` : `q${labelIndex}`;
}

function inspectorRegisterFromRuntimeState(item, state, fallbackLabel = "Qubit") {
  if (!quantumCore || !state) {
    return {
      label: fallbackLabel,
      vector: state?.vector || [1, 0],
    };
  }
  if (
    state.register &&
    Number.isInteger(state.register.numQubits) &&
    Array.isArray(state.register.amplitudes)
  ) {
    return {
      label: fallbackLabel,
      register: state.register,
      selectedIndex: Number.isInteger(state.registerQubitIndex)
        ? state.registerQubitIndex
        : 0,
    };
  }
  if (
    state.pairState &&
    Array.isArray(state.pairState.amplitudes) &&
    Number.isFinite(state.pairQubitIndex)
  ) {
    const numQubits = registerStateNumQubits(state.pairState);
    const members = Array.isArray(state.pairState.members)
      ? state.pairState.members
      : [];
    const remoteMembers = Array.isArray(state.pairState.remoteMembers)
      ? state.pairState.remoteMembers
      : [];
    const memberLabels = Array.from({ length: numQubits }, (_, index) => {
      const member = members.find((entry) => entry.qubitIndex === index);
      if (member?.item) {
        return memberLabelForQubit(member.item, index);
      }
      const remoteMember = remoteMembers.find(
        (entry) => entry?.qubitIndex === index,
      );
      const participant = remoteMember?.participantId || remoteMember?.role || "";
      return participant ? `q${index}:${participant}` : `q${index}`;
    });
    return {
      label: "Entangled Register Inspector",
      register: quantumCore.createRegister(numQubits, state.pairState.amplitudes),
      selectedIndex: state.pairQubitIndex,
      memberLabels,
    };
  }
  return {
    label: fallbackLabel,
    register: quantumCore.createQubit(state.vector || [1, 0]),
    selectedIndex: 0,
    memberLabels: [memberLabelForQubit(item, 0)],
  };
}

function cnotGateMatrixForInspector() {
  if (quantumCore?.matrixForCnot) {
    return quantumCore.matrixForCnot(2, 0, 1);
  }
  return [
    [1, 0, 0, 0],
    [0, 1, 0, 0],
    [0, 0, 0, 1],
    [0, 0, 1, 0],
  ];
}

function formatComplexReal(value) {
  if (Number.isFinite(value)) {
    return formatComplexFromParts(value, 0);
  }
  return formatComplexFromParts(0, 0);
}

function openInspector(title, lines) {
  const panel = ensureQubitInspector();
  if (qubitInspectorTitle) {
    qubitInspectorTitle.textContent = title;
  }
  qubitInspectorVector.textContent = lines.join("\n");
  panel.classList.remove("hidden");
}

function getNormalizedQubitProbabilities({ blue, red }) {
  const total = blue + red;
  const normalizedBlue = total > 0 ? clamp(blue / total, 0, 1) : 0.5;
  const normalizedRed = total > 0 ? clamp(red / total, 0, 1) : 0.5;
  return { normalizedBlue, normalizedRed };
}

function cleanupSelectedQubits() {
  selectedQubitElements = selectedQubitElements.filter(
    (element) =>
      element.isConnected &&
      qubitStateGetters.has(element) &&
      isElementVisible(element),
  );
}

function applyQubitSelectionStyles() {
  cleanupSelectedQubits();
  const selectedSet = new Set(selectedQubitElements);
  qubitStateGetters.forEach((_, element) => {
    element.classList.toggle("qubit-selected", selectedSet.has(element));
  });
}

function getSelectedQubitElements() {
  cleanupSelectedQubits();
  return [...selectedQubitElements];
}

function replaceQubitSelection(nextElements) {
  const next = [];
  nextElements.forEach((element) => {
    if (!element || !qubitStateGetters.has(element) || next.includes(element)) {
      return;
    }
    next.push(element);
  });
  selectedQubitElements = next;
  applyQubitSelectionStyles();
}

function clearQubitSelection() {
  selectedQubitElements = [];
  applyQubitSelectionStyles();
}

function toggleQubitSelection(element) {
  const current = getSelectedQubitElements();
  if (current.includes(element)) {
    replaceQubitSelection(current.filter((entry) => entry !== element));
    return;
  }
  replaceQubitSelection([...current, element]);
}

function isQubitSelected(element) {
  return getSelectedQubitElements().includes(element);
}

function viewportRectFromPoints(x1, y1, x2, y2) {
  const left = Math.min(x1, x2);
  const right = Math.max(x1, x2);
  const top = Math.min(y1, y2);
  const bottom = Math.max(y1, y2);
  return {
    left,
    right,
    top,
    bottom,
    width: right - left,
    height: bottom - top,
  };
}

function rectsIntersect(a, b) {
  return (
    a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top
  );
}

function isElementVisible(element) {
  const rect = element.getBoundingClientRect();
  return rect.width > 0 && rect.height > 0;
}

function registerSelectionContainer(container) {
  if (!container || selectionContainers.has(container)) {
    return;
  }
  selectionContainers.add(container);

  container.addEventListener("mousedown", (event) => {
    if (!isPrimaryMouseButton(event)) {
      return;
    }
    if (!(event.target instanceof Element)) {
      return;
    }
    if (event.target.closest(".qubit")) {
      return;
    }
    if (
      event.target.closest(
        "button, input, select, label, textarea, .arrow-group, .tick, .gate-radio, .tab-btn, .qubit-inspector",
      )
    ) {
      return;
    }

    event.preventDefault();
    const marquee = ensureQubitSelectionMarquee();
    const additive = event.shiftKey;
    const baseSelection = additive ? getSelectedQubitElements() : [];
    const candidates = Array.from(qubitStateGetters.keys()).filter(
      (element) => container.contains(element) && isElementVisible(element),
    );
    const startX = event.clientX;
    const startY = event.clientY;
    let moved = false;

    const updateSelection = (clientX, clientY) => {
      const selectionRect = viewportRectFromPoints(
        startX,
        startY,
        clientX,
        clientY,
      );
      marquee.style.left = `${selectionRect.left}px`;
      marquee.style.top = `${selectionRect.top}px`;
      marquee.style.width = `${selectionRect.width}px`;
      marquee.style.height = `${selectionRect.height}px`;
      marquee.classList.remove("hidden");

      const hits = candidates.filter((element) =>
        rectsIntersect(selectionRect, element.getBoundingClientRect()),
      );
      const next = additive ? [...baseSelection, ...hits] : hits;
      replaceQubitSelection(next);
    };

    const handleMouseMove = (moveEvent) => {
      moved = true;
      updateSelection(moveEvent.clientX, moveEvent.clientY);
    };

    const stopSelection = () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", stopSelection);
      marquee.classList.add("hidden");
      if (!moved && !additive) {
        clearQubitSelection();
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", stopSelection);
  });
}

function handleShiftQubitSelection(event, element) {
  if (
    event.type === "mousedown" &&
    event.shiftKey &&
    isPrimaryMouseButton(event)
  ) {
    event.preventDefault();
    event.stopPropagation();
    toggleQubitSelection(element);
    return true;
  }
  return false;
}

function openQubitInspector({ label, blue, red, vector = null }) {
  if (arguments[0]?.register) {
    const state = arguments[0];
    const lines = [state.label || "Register", ""].concat(
      quantumRegisterKetLines(state.register, {
        selectedIndex: state.selectedIndex,
        memberLabels: state.memberLabels,
      }),
    );
    openInspector("Register Inspector", lines);
    return;
  }

  let a = 0;
  let b = 0;
  let normalizedBlue = 0.5;
  let normalizedRed = 0.5;

  if (
    Array.isArray(vector) &&
    vector.length === 2 &&
    Number.isFinite(vector[0]) &&
    Number.isFinite(vector[1])
  ) {
    const canonicalVector = canonicalizeRealAmplitudeVector(vector);
    a = canonicalVector[0];
    b = canonicalVector[1];
    [normalizedBlue, normalizedRed] = probabilitiesFromVector2(canonicalVector);
  } else {
    const normalized = getNormalizedQubitProbabilities({ blue, red });
    normalizedBlue = normalized.normalizedBlue;
    normalizedRed = normalized.normalizedRed;
    a = Math.sqrt(normalizedBlue);
    b = Math.sqrt(normalizedRed);
  }
  const lines = [
    label,
    "",
    `|psi> = a|0> + b|1>`,
    `a = ${formatComplexReal(a)}`,
    `b = ${formatComplexReal(b)}`,
    "",
    `|a|^2 = ${normalizedBlue.toFixed(6)}   (blue = |0>)`,
    `|b|^2 = ${normalizedRed.toFixed(6)}   (red  = |1>)`,
    `|a|^2 + |b|^2 = ${(normalizedBlue + normalizedRed).toFixed(6)}`,
  ];

  openInspector("Qubit Inspector", lines);
}

function openQubitPairInspector(firstState, secondState) {
  const first = getNormalizedQubitProbabilities(firstState);
  const second = getNormalizedQubitProbabilities(secondState);
  const a = Math.sqrt(first.normalizedBlue);
  const b = Math.sqrt(first.normalizedRed);
  const c = Math.sqrt(second.normalizedBlue);
  const d = Math.sqrt(second.normalizedRed);
  const alpha00 = a * c;
  const alpha01 = a * d;
  const alpha10 = b * c;
  const alpha11 = b * d;
  const norm = alpha00 ** 2 + alpha01 ** 2 + alpha10 ** 2 + alpha11 ** 2;

  const lines = [
    `${firstState.label} ⊗ ${secondState.label}`,
    "",
    `|psi1> = (${formatComplexReal(a)})|0> + (${formatComplexReal(b)})|1>`,
    `|psi2> = (${formatComplexReal(c)})|0> + (${formatComplexReal(d)})|1>`,
    "",
    `|Psi> = |psi1> ⊗ |psi2>`,
    `|Psi> = (${formatComplexReal(alpha00)})|00> + (${formatComplexReal(alpha01)})|01> +`,
    `       (${formatComplexReal(alpha10)})|10> + (${formatComplexReal(alpha11)})|11>`,
    "",
    `|00| coeff^2 = ${(alpha00 ** 2).toFixed(6)}`,
    `|01| coeff^2 = ${(alpha01 ** 2).toFixed(6)}`,
    `|10| coeff^2 = ${(alpha10 ** 2).toFixed(6)}`,
    `|11| coeff^2 = ${(alpha11 ** 2).toFixed(6)}`,
    `sum = ${norm.toFixed(6)}`,
  ];

  openInspector("Qubit Pair Inspector", lines);
}

function openGateInspector({ label, matrix, tickIndex = null }) {
  const rows = Array.isArray(matrix)
    ? matrix.filter((row) => Array.isArray(row))
    : [];
  if (!rows.length) {
    return;
  }

  const columns = rows.reduce((max, row) => Math.max(max, row.length), 0);
  const lines = [label, ""];

  if (Number.isFinite(tickIndex)) {
    const clockTick = clockTickNumberFromIndex(tickIndex);
    lines.push(`Tick = ${clockTick}`);
    lines.push(`theta = ${clockTick}π/6 radians`);
    lines.push("");
  }

  lines.push(`U (${rows.length} x ${columns}) =`);
  rows.forEach((row) => {
    const formattedRow = row.map((entry) => formatComplex(entry)).join(" , ");
    lines.push(`[ ${formattedRow} ]`);
  });

  openInspector("Gate Inspector", lines);
}

function registeredGateAtViewportPoint(clientX, clientY) {
  if (!Number.isFinite(clientX) || !Number.isFinite(clientY)) {
    return null;
  }
  const candidates = Array.from(gateStateGetters.keys())
    .filter((element) => {
      if (!(element instanceof HTMLElement) || !element.isConnected) {
        return false;
      }
      const rect = element.getBoundingClientRect();
      return (
        rect.width > 0 &&
        rect.height > 0 &&
        clientX >= rect.left &&
        clientX <= rect.right &&
        clientY >= rect.top &&
        clientY <= rect.bottom
      );
    })
    .map((element, index) => {
      const rect = element.getBoundingClientRect();
      const zIndex = Number.parseInt(window.getComputedStyle(element).zIndex, 10);
      return {
        element,
        index,
        area: rect.width * rect.height,
        zIndex: Number.isFinite(zIndex) ? zIndex : 0,
      };
    })
    .sort(
      (a, b) =>
        b.zIndex - a.zIndex ||
        a.area - b.area ||
        b.index - a.index,
    );
  return candidates[0]?.element || null;
}

function openRegisteredGateInspector(element, event) {
  const getGateState = gateStateGetters.get(element);
  if (typeof getGateState !== "function") {
    return false;
  }
  const gateState = getGateState();
  if (!gateState || !gateState.matrix) {
    return false;
  }
  event?.preventDefault?.();
  event?.stopPropagation?.();
  openGateInspector(gateState);
  return true;
}

function installDelegatedGateInspector() {
  if (delegatedGateInspectorInstalled) {
    return;
  }
  delegatedGateInspectorInstalled = true;
  document.addEventListener(
    "contextmenu",
    (event) => {
      if (!(event.target instanceof Element)) {
        return;
      }
      if (
        event.target.closest(
          "input, select, textarea, button, .qubit-inspector",
        )
      ) {
        return;
      }
      if (
        event.target.closest(
          ".playground-node[data-component='qubit'], .playground-qubit-shell, .qubit",
        )
      ) {
        return;
      }
      const targetNode = event.target.closest(".playground-node");
      if (targetNode instanceof HTMLElement && !gateStateGetters.has(targetNode)) {
        return;
      }
      const gate = registeredGateAtViewportPoint(event.clientX, event.clientY);
      if (gate) {
        openRegisteredGateInspector(gate, event);
      }
    },
    true,
  );
}

function registerGateInspector(element, getGateState) {
  if (!element || typeof getGateState !== "function") {
    return;
  }

  gateStateGetters.set(element, getGateState);
  installDelegatedGateInspector();

  const openFromEvent = (event) => {
    openRegisteredGateInspector(element, event);
  };

  if (element.dataset.gateInspectorRegistered === "true") {
    return;
  }
  element.dataset.gateInspectorRegistered = "true";
  element.addEventListener("contextmenu", openFromEvent);
}

function registerQubitInspector(element, getState) {
  if (!element || typeof getState !== "function") {
    return;
  }
  qubitStateGetters.set(element, getState);
  applyQubitSelectionStyles();

  const openFromEvent = (event) => {
    event.preventDefault();
    event.stopPropagation();

    const selected = getSelectedQubitElements();
    if (
      selected.length === 2 &&
      selected.includes(element) &&
      isQubitSelected(element)
    ) {
      const firstState = qubitStateGetters.get(selected[0])?.();
      const secondState = qubitStateGetters.get(selected[1])?.();
      if (firstState && secondState) {
        openQubitPairInspector(firstState, secondState);
        return;
      }
    }

    openQubitInspector(getState());
  };

  if (element.dataset.qubitInspectorRegistered === "true") {
    return;
  }
  element.dataset.qubitInspectorRegistered = "true";
  element.addEventListener("contextmenu", openFromEvent);
}

const LOCAL_LAB_DEFAULT_QUBITS = 3;
const LOCAL_LAB_MAX_QUBITS = SHARED_REGISTER_MAX_QUBITS;
const LOCAL_LAB_DEFAULT_BACKEND_URL = "http://127.0.0.1:8787";
const LOCAL_LAB_ROOM_ID = "local-lab-room";
const LOCAL_LAB_REGISTER_ID = "local-register";
const LOCAL_LAB_SYNC_INTERVAL_MS = 1200;
const LOCAL_LAB_SNAPSHOT_STORAGE_KEY = "qubit-lab.local-lab-snapshot.v1";
const LOCAL_LAB_PROTOCOL_FALLBACK_DEFINITIONS = [
  {
    type: "distributed-teleportation",
    label: "Distributed teleportation",
    steps: [
      { id: "bob-bell-mail", label: "Bob Bell + mail q1" },
      { id: "alice-measure-send", label: "Alice measure + send bits" },
      { id: "bob-correct-verify", label: "Bob correct + verify" },
    ],
  },
  {
    type: "bell-test",
    label: "Bell test",
    steps: [
      { id: "prepare-bell-pair", label: "Prepare Bell pair" },
      { id: "choose-bases", label: "Choose bases" },
      { id: "compare-results", label: "Compare results" },
    ],
  },
  {
    type: "ghz-state",
    label: "GHZ state",
    steps: [
      { id: "choose-qubits", label: "Choose qubits" },
      { id: "hadamard-root", label: "Hadamard root" },
      { id: "cascade-cnot", label: "Cascade C-NOT" },
      { id: "inspect-correlations", label: "Inspect correlations" },
    ],
  },
  {
    type: "superdense-coding",
    label: "Superdense coding",
    steps: [
      { id: "share-bell-pair", label: "Share Bell pair" },
      { id: "encode-two-bits", label: "Encode two bits" },
      { id: "decode-bell-basis", label: "Decode Bell basis" },
    ],
  },
  {
    type: "multi-user-entanglement",
    label: "Multi-user entanglement",
    steps: [
      { id: "create-room", label: "Create room" },
      { id: "invite-participants", label: "Invite participants" },
      { id: "assign-qubits", label: "Assign qubits" },
      { id: "run-measurements", label: "Run measurements" },
    ],
  },
  {
    type: "tour-introduction",
    label: "Tour introduction",
    steps: [
      { id: "one-qubit", label: "One qubit" },
      { id: "two-qubits", label: "Two qubits" },
      { id: "entanglement-one", label: "Entanglement 1" },
      { id: "entanglement-two", label: "Entanglement 2" },
    ],
  },
];
const localLabState = {
  register: null,
  selectedQubit: 0,
  teleportation: null,
  mailbox: {
    lastToken: "",
    lastLink: "",
  },
  distributedTeleportation: {
    protocol: null,
  },
  protocolFramework: {
    definitions: LOCAL_LAB_PROTOCOL_FALLBACK_DEFINITIONS,
    definition: LOCAL_LAB_PROTOCOL_FALLBACK_DEFINITIONS[0],
    protocol: null,
  },
  sync: {
    connected: false,
    lastVersion: null,
    pollTimer: null,
    pushTimer: null,
    applyingRemote: false,
  },
};

function localLabIsReady() {
  return Boolean(localLabPanel && quantumCore?.createRegister);
}

function localLabSetStatus(message) {
  if (localLabStatus instanceof HTMLElement) {
    localLabStatus.textContent = message || "";
  }
}

function localLabSetTeleportStatus(message) {
  if (localLabTeleportStatus instanceof HTMLElement) {
    localLabTeleportStatus.textContent = message || "";
  }
}

function localLabSetMailboxStatus(message) {
  if (localLabMailboxStatus instanceof HTMLElement) {
    localLabMailboxStatus.textContent = message || "";
  }
}

function localLabSetSyncStatus(message) {
  if (localLabSyncStatus instanceof HTMLElement) {
    localLabSyncStatus.textContent = message || "";
  }
}

function localLabSetDistributedStatus(message) {
  if (localLabDistributedStatus instanceof HTMLElement) {
    localLabDistributedStatus.textContent = message || "";
  }
}

function localLabSetProtocolFrameworkStatus(message) {
  if (localLabProtocolStatus instanceof HTMLElement) {
    localLabProtocolStatus.textContent = message || "";
  }
}

function localLabClearTeleportation() {
  localLabState.teleportation = null;
  localLabSetTeleportStatus("");
}

function localLabSelectValue(select, fallback = 0) {
  const parsed = Number.parseInt(select?.value, 10);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function localLabClampQubitIndex(index, numQubits) {
  return Math.min(Math.max(Number.isFinite(index) ? index : 0, 0), numQubits - 1);
}

function localLabCurrentSize() {
  const selected = localLabSelectValue(localLabQubitCount, LOCAL_LAB_DEFAULT_QUBITS);
  return Math.min(Math.max(selected, 1), LOCAL_LAB_MAX_QUBITS);
}

function localLabFormatProbability(value) {
  const normalized = clamp(Number.isFinite(value) ? value : 0, 0, 1);
  if (normalized <= 1e-9) {
    return "0";
  }
  if (normalized >= 1 - 1e-9) {
    return "1";
  }
  return normalized.toFixed(6).replace(/0+$/, "").replace(/\.$/, "");
}

function localLabPercent(value) {
  return `${(clamp(value, 0, 1) * 100).toFixed(1)}%`;
}

function localLabMemberLabels(numQubits) {
  return Array.from({ length: numQubits }, (_, index) => `q${index}`);
}

function localLabTeleportMessageKey() {
  return typeof localLabTeleportMessage?.value === "string"
    ? localLabTeleportMessage.value
    : "plus";
}

function localLabTeleportMessageVector(key = localLabTeleportMessageKey()) {
  const rootHalf = Math.SQRT1_2;
  if (key === "blue") {
    return [1, 0];
  }
  if (key === "red") {
    return [0, 1];
  }
  if (key === "minus") {
    return [rootHalf, -rootHalf];
  }
  if (key === "tilted") {
    return [Math.sqrt(0.8), Math.sqrt(0.2)];
  }
  return [rootHalf, rootHalf];
}

function localLabTeleportLabel(key = localLabTeleportMessageKey()) {
  return {
    blue: "blue",
    red: "red",
    minus: "purple -",
    tilted: "tilted",
    plus: "purple +",
  }[key] || "purple +";
}

function localLabComplex(value) {
  return quantumCore?.complex ? quantumCore.complex(value) : { re: value || 0, im: 0 };
}

function localLabComplexConjugate(value) {
  const entry = localLabComplex(value);
  return { re: entry.re, im: -entry.im };
}

function localLabComplexAdd(left, right) {
  return quantumCore?.add
    ? quantumCore.add(left, right)
    : {
        re: localLabComplex(left).re + localLabComplex(right).re,
        im: localLabComplex(left).im + localLabComplex(right).im,
      };
}

function localLabComplexMultiply(left, right) {
  return quantumCore?.multiply
    ? quantumCore.multiply(left, right)
    : {
        re:
          localLabComplex(left).re * localLabComplex(right).re -
          localLabComplex(left).im * localLabComplex(right).im,
        im:
          localLabComplex(left).re * localLabComplex(right).im +
          localLabComplex(left).im * localLabComplex(right).re,
      };
}

function localLabNormalizeQubitVector(vector) {
  if (!quantumCore?.createQubit) {
    return vector;
  }
  return quantumCore.createQubit(vector).amplitudes;
}

function localLabTeleportRecord(messageKey = localLabTeleportMessageKey()) {
  return {
    messageKey,
    messageVector: localLabNormalizeQubitVector(
      localLabTeleportMessageVector(messageKey),
    ),
    aliceBits: null,
    stage: "prepared",
  };
}

function localLabTeleportCurrentRecord() {
  if (!localLabState.teleportation) {
    localLabState.teleportation = localLabTeleportRecord();
  }
  return localLabState.teleportation;
}

function localLabFillQubitSelect(select, numQubits, preferredIndex = 0) {
  if (!(select instanceof HTMLSelectElement)) {
    return;
  }
  const nextValue = localLabClampQubitIndex(preferredIndex, numQubits);
  select.replaceChildren(
    ...Array.from({ length: numQubits }, (_, index) => {
      const option = document.createElement("option");
      option.value = String(index);
      option.textContent = `q${index}`;
      return option;
    }),
  );
  select.value = String(nextValue);
}

function localLabRegister() {
  if (!localLabIsReady()) {
    return null;
  }
  if (
    localLabState.register &&
    Number.isInteger(localLabState.register.numQubits) &&
    Array.isArray(localLabState.register.amplitudes)
  ) {
    localLabState.register = sharedRegisterCreate(
      localLabState.register.numQubits,
      localLabState.register.amplitudes,
    );
    return localLabState.register;
  }
  localLabState.register = sharedRegisterCreate(localLabCurrentSize());
  return localLabState.register;
}

function localLabSyncControls(register = localLabRegister()) {
  if (!register) {
    return;
  }
  const numQubits = register.numQubits;
  if (localLabQubitCount instanceof HTMLSelectElement) {
    localLabQubitCount.value = String(numQubits);
  }
  const selected = localLabClampQubitIndex(
    localLabState.selectedQubit,
    numQubits,
  );
  localLabState.selectedQubit = selected;
  localLabFillQubitSelect(
    localLabTargetQubit,
    numQubits,
    selected,
  );
  localLabFillQubitSelect(
    localLabControlQubit,
    numQubits,
    localLabSelectValue(localLabControlQubit, 0),
  );
  localLabFillQubitSelect(
    localLabMeasureQubit,
    numQubits,
    selected,
  );
  if (localLabCnotButton instanceof HTMLButtonElement) {
    localLabCnotButton.disabled = numQubits < 2;
  }
}

function localLabSetRegister(register, statusMessage = "") {
  if (!localLabIsReady() || !register) {
    return;
  }
  localLabState.register = sharedRegisterCreate(
    register.numQubits,
    register.amplitudes,
  );
  localLabRender(statusMessage);
  localLabScheduleAutoPush();
}

function localLabBasisIndexForBits(bits) {
  return bits.reduce((index, bit) => index * 2 + (bit ? 1 : 0), 0);
}

function localLabQubitVectorForFixedBits(register, targetIndex, fixedBits) {
  if (!register || !quantumCore?.bitValue || !quantumCore?.createQubit) {
    return null;
  }
  const vector = [localLabComplex(0), localLabComplex(0)];
  register.amplitudes.forEach((amplitude, index) => {
    const matches = Object.entries(fixedBits || {}).every(
      ([qubitKey, bit]) =>
        quantumCore.bitValue(index, register.numQubits, Number(qubitKey)) ===
        bit,
    );
    if (!matches) {
      return;
    }
    const targetBit = quantumCore.bitValue(index, register.numQubits, targetIndex);
    vector[targetBit] = localLabComplexAdd(vector[targetBit], amplitude);
  });
  return quantumCore.createQubit(vector).amplitudes;
}

function localLabQubitFidelity(expectedVector, actualVector) {
  if (!quantumCore?.magnitudeSquared) {
    return 0;
  }
  const expected = localLabNormalizeQubitVector(expectedVector || [1, 0]);
  const actual = localLabNormalizeQubitVector(actualVector || [1, 0]);
  const overlap = localLabComplexAdd(
    localLabComplexMultiply(localLabComplexConjugate(expected[0]), actual[0]),
    localLabComplexMultiply(localLabComplexConjugate(expected[1]), actual[1]),
  );
  return clamp(quantumCore.magnitudeSquared(overlap), 0, 1);
}

function localLabTeleportBobVector() {
  const register = localLabRegister();
  const aliceBits = localLabState.teleportation?.aliceBits;
  if (!register || !aliceBits || register.numQubits !== 3) {
    return null;
  }
  return localLabQubitVectorForFixedBits(register, 2, {
    0: aliceBits.source,
    1: aliceBits.pair,
  });
}

function localLabTeleportFidelity() {
  const record = localLabState.teleportation;
  const bobVector = localLabTeleportBobVector();
  if (!record || !bobVector) {
    return null;
  }
  return localLabQubitFidelity(record.messageVector, bobVector);
}

function localLabTeleportPrepare() {
  if (!localLabIsReady() || !quantumCore?.productRegister) {
    return;
  }
  const messageKey = localLabTeleportMessageKey();
  const record = localLabTeleportRecord(messageKey);
  localLabState.teleportation = record;
  localLabState.selectedQubit = 0;
  const register = quantumCore.productRegister([
    record.messageVector,
    [1, 0],
    [1, 0],
  ]);
  localLabSetRegister(
    register,
    `Teleportation prepared: q0 ${localLabTeleportLabel(messageKey)}`,
  );
  localLabSetTeleportStatus("q0 ready; q1/q2 reset");
}

function localLabTeleportCreateBellPair() {
  if (!localLabIsReady() || !quantumCore?.applySingleQubitGate || !quantumCore?.applyCnot) {
    return;
  }
  if (
    !localLabState.teleportation ||
    localLabState.teleportation.stage !== "prepared" ||
    localLabRegister()?.numQubits !== 3
  ) {
    localLabTeleportPrepare();
  }
  const record = localLabTeleportCurrentRecord();
  let register = localLabRegister();
  register = quantumCore.applySingleQubitGate(register, 1, quantumCore.gateMatrices.H);
  register = quantumCore.applyCnot(register, 1, 2);
  record.stage = "bell";
  record.aliceBits = null;
  localLabState.selectedQubit = 1;
  localLabSetRegister(register, "Bob created Bell pair q1-q2");
  localLabSetTeleportStatus("Bell pair ready");
}

function localLabTeleportAliceMeasure() {
  if (!localLabIsReady() || !quantumCore?.applyCnot || !quantumCore?.measureQubit) {
    return;
  }
  if (
    !localLabState.teleportation ||
    localLabState.teleportation.stage !== "bell"
  ) {
    localLabTeleportCreateBellPair();
  }
  const record = localLabTeleportCurrentRecord();
  let register = localLabRegister();
  if (!register || register.numQubits !== 3) {
    localLabTeleportCreateBellPair();
    register = localLabRegister();
  }
  register = quantumCore.applyCnot(register, 0, 1);
  register = quantumCore.applySingleQubitGate(register, 0, quantumCore.gateMatrices.H);
  const sourceMeasurement = quantumCore.measureQubit(register, 0);
  const pairMeasurement = quantumCore.measureQubit(sourceMeasurement.register, 1);
  record.aliceBits = {
    source: sourceMeasurement.outcome,
    pair: pairMeasurement.outcome,
  };
  record.stage = "alice-measured";
  localLabState.selectedQubit = 2;
  localLabSetRegister(
    pairMeasurement.register,
    `Alice measured q0=${record.aliceBits.source}, q1=${record.aliceBits.pair}`,
  );
  localLabSetTeleportStatus(
    `Alice bits ${record.aliceBits.source}${record.aliceBits.pair}; send to Bob`,
  );
}

function localLabTeleportBobCorrection() {
  if (!localLabIsReady() || !quantumCore?.applySingleQubitGate) {
    return;
  }
  const record = localLabTeleportCurrentRecord();
  if (!record.aliceBits) {
    localLabSetTeleportStatus("Alice measurement required");
    return;
  }
  let register = localLabRegister();
  const corrections = [];
  if (record.aliceBits.pair === 1) {
    register = quantumCore.applySingleQubitGate(register, 2, quantumCore.gateMatrices.X);
    corrections.push("X");
  }
  if (record.aliceBits.source === 1) {
    register = quantumCore.applySingleQubitGate(register, 2, quantumCore.gateMatrices.Z);
    corrections.push("Z");
  }
  record.stage = "complete";
  localLabState.selectedQubit = 2;
  localLabSetRegister(
    register,
    `Bob correction ${corrections.join("+") || "none"} on q2`,
  );
  const fidelity = localLabTeleportFidelity();
  localLabSetTeleportStatus(
    `Complete: q2 has ${localLabTeleportLabel(record.messageKey)}; fidelity=${localLabFormatProbability(fidelity ?? 0)}`,
  );
}

function localLabTeleportRunProtocol() {
  localLabTeleportPrepare();
  localLabTeleportCreateBellPair();
  localLabTeleportAliceMeasure();
  localLabTeleportBobCorrection();
}

function localLabDistributedProtocolId() {
  const raw =
    localLabDistributedProtocol instanceof HTMLInputElement
      ? localLabDistributedProtocol.value.trim()
      : "";
  return raw || "teleport-demo";
}

function localLabDistributedProtocolPath(protocolId = localLabDistributedProtocolId()) {
  return `/rooms/${encodeURIComponent(localLabRoomId())}/distributed-teleportation/${encodeURIComponent(protocolId)}`;
}

function localLabProtocolRunPath(protocolId = localLabDistributedProtocolId()) {
  return `/rooms/${encodeURIComponent(localLabRoomId())}/protocols/${encodeURIComponent(protocolId)}`;
}

function localLabProtocolStepPath(stepId, protocolId = localLabDistributedProtocolId()) {
  return `${localLabProtocolRunPath(protocolId)}/steps/${encodeURIComponent(stepId)}`;
}

function localLabProtocolRecipeType() {
  const raw =
    localLabProtocolRecipeSelect instanceof HTMLSelectElement
      ? localLabProtocolRecipeSelect.value.trim()
      : "";
  return raw || "distributed-teleportation";
}

function localLabDefaultProtocolIdForType(type) {
  return {
    "distributed-teleportation": "teleport-demo",
    "bell-test": "bell-test-demo",
    "ghz-state": "ghz-demo",
    "superdense-coding": "superdense-demo",
    "multi-user-entanglement": "multi-user-demo",
    "tour-introduction": "tour-demo",
  }[type] || "protocol-demo";
}

function localLabAllDefaultProtocolIds() {
  return new Set(
    LOCAL_LAB_PROTOCOL_FALLBACK_DEFINITIONS.map((definition) =>
      localLabDefaultProtocolIdForType(definition.type),
    ),
  );
}

function localLabSyncProtocolIdToRecipe() {
  if (!(localLabDistributedProtocol instanceof HTMLInputElement)) {
    return;
  }
  const current = localLabDistributedProtocol.value.trim();
  if (!current || localLabAllDefaultProtocolIds().has(current)) {
    localLabDistributedProtocol.value = localLabDefaultProtocolIdForType(
      localLabProtocolRecipeType(),
    );
  }
}

function localLabProtocolDefinitionFor(type = localLabProtocolRecipeType()) {
  return (
    localLabState.protocolFramework.definitions.find(
      (definition) => definition.type === type,
    ) ||
    LOCAL_LAB_PROTOCOL_FALLBACK_DEFINITIONS.find(
      (definition) => definition.type === type,
    ) ||
    null
  );
}

function localLabPopulateProtocolRecipeSelect(definitions) {
  if (!(localLabProtocolRecipeSelect instanceof HTMLSelectElement)) {
    return;
  }
  const selected = localLabProtocolRecipeType();
  localLabProtocolRecipeSelect.replaceChildren(
    ...definitions.map((definition) => {
      const option = document.createElement("option");
      option.value = definition.type;
      option.textContent = definition.label;
      return option;
    }),
  );
  localLabProtocolRecipeSelect.value = definitions.some(
    (definition) => definition.type === selected,
  )
    ? selected
    : definitions[0]?.type || "distributed-teleportation";
}

function localLabProtocolCurrentStep(protocol, definition) {
  const steps = Array.isArray(definition?.steps) ? definition.steps : [];
  if (!steps.length) {
    return "complete";
  }
  if (protocol?.currentStep && protocol.currentStep !== "complete") {
    return protocol.currentStep;
  }
  const completed = new Set(protocol?.completedSteps || []);
  return steps.find((step) => !completed.has(step.id))?.id || "complete";
}

function localLabRenderProtocolSteps(protocol, definition) {
  const resolvedDefinition =
    definition ||
    localLabProtocolDefinitionFor(protocol?.type) ||
    localLabProtocolDefinitionFor();
  localLabState.protocolFramework.protocol = protocol || null;
  localLabState.protocolFramework.definition = resolvedDefinition || null;
  if (!(localLabProtocolStepList instanceof HTMLElement)) {
    return;
  }
  const steps = Array.isArray(resolvedDefinition?.steps)
    ? resolvedDefinition.steps
    : [];
  const completed = new Set(protocol?.completedSteps || []);
  const currentStep = localLabProtocolCurrentStep(protocol, resolvedDefinition);
  localLabProtocolStepList.replaceChildren(
    ...steps.map((step, index) => {
      const item = document.createElement("span");
      item.className = "local-lab-protocol-step";
      if (completed.has(step.id)) {
        item.classList.add("complete");
      }
      if (currentStep === step.id && !completed.has(step.id)) {
        item.classList.add("current");
      }
      item.textContent = `${index + 1}. ${step.label}`;
      return item;
    }),
  );
  const doneCount = steps.filter((step) => completed.has(step.id)).length;
  const statusLabel = resolvedDefinition?.label || "Protocol";
  const version = protocol?.version == null ? "" : ` v${protocol.version}`;
  const currentLabel =
    currentStep === "complete"
      ? "complete"
      : steps.find((step) => step.id === currentStep)?.label || "ready";
  localLabSetProtocolFrameworkStatus(
    `${statusLabel}${version}: ${doneCount}/${steps.length} complete; current ${currentLabel}`,
  );
}

async function localLabLoadProtocolDefinitions({ quiet = false } = {}) {
  if (
    window.location.protocol === "file:" ||
    (IS_STATIC_BUILD &&
      !localLabBackendUrlFromConfig() &&
      !localLabBackendUrlFromLocation())
  ) {
    localLabState.protocolFramework.definitions =
      LOCAL_LAB_PROTOCOL_FALLBACK_DEFINITIONS;
    localLabPopulateProtocolRecipeSelect(LOCAL_LAB_PROTOCOL_FALLBACK_DEFINITIONS);
    localLabRenderProtocolSteps(null, localLabProtocolDefinitionFor());
    if (!quiet) {
      localLabSetProtocolFrameworkStatus("Built-in protocol recipes ready");
    }
    return LOCAL_LAB_PROTOCOL_FALLBACK_DEFINITIONS;
  }
  try {
    const payload = await localLabRequest("/protocol-definitions");
    const definitions = Array.isArray(payload.protocols) && payload.protocols.length
      ? payload.protocols
      : LOCAL_LAB_PROTOCOL_FALLBACK_DEFINITIONS;
    localLabState.protocolFramework.definitions = definitions;
    localLabPopulateProtocolRecipeSelect(definitions);
    localLabRenderProtocolSteps(
      localLabState.protocolFramework.protocol,
      localLabProtocolDefinitionFor(),
    );
    return definitions;
  } catch (_error) {
    localLabState.protocolFramework.definitions =
      LOCAL_LAB_PROTOCOL_FALLBACK_DEFINITIONS;
    localLabPopulateProtocolRecipeSelect(LOCAL_LAB_PROTOCOL_FALLBACK_DEFINITIONS);
    localLabRenderProtocolSteps(null, localLabProtocolDefinitionFor());
    if (!quiet) {
      localLabSetProtocolFrameworkStatus("Backend unavailable; showing built-in recipes");
    }
    return LOCAL_LAB_PROTOCOL_FALLBACK_DEFINITIONS;
  }
}

async function localLabLoadProtocolRecipe() {
  localLabSetProtocolFrameworkStatus("Loading recipe...");
  try {
    await localLabEnsureMailboxRoom();
    const payload = await localLabRequest(localLabProtocolRunPath(), {
      method: "PUT",
      body: {
        type: localLabProtocolRecipeType(),
        createdBy: localLabParticipantName(),
        updatedBy: localLabParticipantName(),
        metadata: {
          source: "local-lab",
        },
      },
    });
    localLabRenderProtocolSteps(payload.protocol || null, payload.definition || null);
    return payload.protocol || null;
  } catch (error) {
    const fallbackDefinition = localLabProtocolDefinitionFor();
    localLabRenderProtocolSteps(null, fallbackDefinition);
    localLabSetProtocolFrameworkStatus(`Recipe load failed: ${error.message}`);
    return null;
  }
}

async function localLabRefreshProtocolRun({ quiet = false } = {}) {
  if (!quiet) {
    localLabSetProtocolFrameworkStatus("Refreshing protocol...");
  }
  try {
    const payload = await localLabRequest(localLabProtocolRunPath());
    localLabRenderProtocolSteps(payload.protocol || null, payload.definition || null);
    return payload.protocol || null;
  } catch (error) {
    if (!quiet) {
      localLabSetProtocolFrameworkStatus(`Protocol refresh failed: ${error.message}`);
    }
    return null;
  }
}

async function localLabMarkProtocolStep() {
  let protocol = localLabState.protocolFramework.protocol;
  let definition =
    localLabState.protocolFramework.definition ||
    localLabProtocolDefinitionFor();
  if (!protocol || protocol.type !== localLabProtocolRecipeType()) {
    protocol = await localLabLoadProtocolRecipe();
    definition = localLabState.protocolFramework.definition || definition;
  }
  const stepId = localLabProtocolCurrentStep(protocol, definition);
  if (!stepId || stepId === "complete") {
    localLabSetProtocolFrameworkStatus("Protocol already complete");
    return null;
  }
  localLabSetProtocolFrameworkStatus("Marking step...");
  try {
    const payload = await localLabRequest(localLabProtocolStepPath(stepId), {
      method: "POST",
      body: {
        completed: true,
        updatedBy: localLabParticipantName(),
      },
    });
    localLabRenderProtocolSteps(payload.protocol || null, payload.definition || null);
    return payload.protocol || null;
  } catch (error) {
    localLabSetProtocolFrameworkStatus(`Mark step failed: ${error.message}`);
    return null;
  }
}

function localLabRenderDistributedProtocolFramework(protocol, definition = null) {
  const resolvedDefinition =
    definition ||
    localLabProtocolDefinitionFor("distributed-teleportation") ||
    LOCAL_LAB_PROTOCOL_FALLBACK_DEFINITIONS[0];
  if (localLabProtocolRecipeSelect instanceof HTMLSelectElement) {
    localLabProtocolRecipeSelect.value = "distributed-teleportation";
  }
  localLabRenderProtocolSteps(protocol, resolvedDefinition);
}

function localLabSetDistributedMailboxLink(link) {
  if (localLabDistributedMailboxLink instanceof HTMLAnchorElement) {
    localLabDistributedMailboxLink.hidden = !link;
    localLabDistributedMailboxLink.href = link || "#";
    localLabDistributedMailboxLink.title = link || "";
  }
}

function localLabBackendUrlFromLocation() {
  try {
    return new URLSearchParams(window.location.search).get("backend") || "";
  } catch (_error) {
    return "";
  }
}

function localLabBackendUrlFromConfig() {
  const value = String(window.QUANTUM_BACKEND_URL || "").trim();
  return value && value !== "__PUBLIC_BACKEND_URL__" ? value : "";
}

function localLabRoomFromLocation() {
  try {
    return new URLSearchParams(window.location.search).get("room") || "";
  } catch (_error) {
    return "";
  }
}

function localLabParticipantFromLocation() {
  try {
    return new URLSearchParams(window.location.search).get("participant") || "";
  } catch (_error) {
    return "";
  }
}

function localLabRoleFromLocation() {
  try {
    return new URLSearchParams(window.location.search).get("role") || "";
  } catch (_error) {
    return "";
  }
}

function localLabMailboxTokenFromLocation() {
  try {
    return (
      new URLSearchParams(window.location.search).get("mailbox") ||
      new URLSearchParams(window.location.search).get("mailboxToken") ||
      ""
    ).trim();
  } catch (_error) {
    return "";
  }
}

function localLabBackendBaseUrl() {
  const raw =
    localLabBackendUrl instanceof HTMLInputElement
      ? localLabBackendUrl.value.trim()
      : "";
  const value =
    raw ||
    localLabBackendUrlFromLocation() ||
    localLabBackendUrlFromConfig() ||
    LOCAL_LAB_DEFAULT_BACKEND_URL;
  return value.replace(/\/+$/, "");
}

function localLabRoomId() {
  const raw =
    localLabSyncRoom instanceof HTMLInputElement
      ? localLabSyncRoom.value.trim()
      : "";
  return raw || localLabRoomFromLocation() || LOCAL_LAB_ROOM_ID;
}

function localLabParticipantName() {
  const raw =
    localLabSyncParticipant instanceof HTMLInputElement
      ? localLabSyncParticipant.value.trim()
      : "";
  return raw || localLabParticipantFromLocation() || "local-lab";
}

function localLabParticipantRoleValue() {
  const raw =
    localLabParticipantRole instanceof HTMLSelectElement
      ? localLabParticipantRole.value.trim()
      : "";
  const value = raw || localLabRoleFromLocation() || "editor";
  return ["owner", "editor", "viewer"].includes(value) ? value : "editor";
}

function localLabParticipantId() {
  const normalized = localLabParticipantName()
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return normalized || "local-lab";
}

function localLabSharedRegisterPath(roomId = localLabRoomId()) {
  return `/rooms/${encodeURIComponent(roomId)}/registers/${encodeURIComponent(LOCAL_LAB_REGISTER_ID)}`;
}

function localLabParticipantPath(
  roomId = localLabRoomId(),
  participantId = localLabParticipantId(),
) {
  return `/rooms/${encodeURIComponent(roomId)}/participants/${encodeURIComponent(participantId)}`;
}

function localLabMailboxFrontendLink(token) {
  const url = new URL(window.location.href);
  url.searchParams.set("mailbox", token);
  url.searchParams.set("backend", localLabBackendBaseUrl());
  url.hash = "local-lab";
  return url.toString();
}

function localLabClassroomLink() {
  const url = new URL(window.location.href);
  url.searchParams.delete("mailbox");
  url.searchParams.delete("mailboxToken");
  url.searchParams.set("backend", localLabBackendBaseUrl());
  url.searchParams.set("room", localLabRoomId());
  url.searchParams.set("participant", localLabParticipantName());
  url.searchParams.set("role", localLabParticipantRoleValue());
  url.hash = "local-lab";
  return url.toString();
}

async function localLabCopyText(text) {
  if (navigator.clipboard?.writeText && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
    return true;
  }
  return false;
}

function localLabSetMailboxLink(link, token = "") {
  localLabState.mailbox.lastLink = link || "";
  localLabState.mailbox.lastToken = token || "";
  if (localLabMailboxToken instanceof HTMLInputElement && token) {
    localLabMailboxToken.value = token;
  }
  if (localLabMailboxLink instanceof HTMLAnchorElement) {
    localLabMailboxLink.hidden = !link;
    localLabMailboxLink.href = link || "#";
    localLabMailboxLink.title = link || "";
  }
}

function localLabClearMailboxRouteParams() {
  const url = new URL(window.location.href);
  const hadMailboxParams =
    url.searchParams.has("mailbox") ||
    url.searchParams.has("mailboxToken");
  if (!hadMailboxParams) {
    return;
  }
  url.searchParams.delete("mailbox");
  url.searchParams.delete("mailboxToken");
  window.history.replaceState({}, "", url.toString());
}

function localLabMailboxFailureMessage(action, error) {
  const message = error?.message || String(error || "Unknown error");
  if (/no longer pending|already claimed|mailbox_transfer_closed/i.test(message)) {
    return "Mailbox token already claimed. Send selected q to create a fresh link.";
  }
  if (/Failed to fetch|not reachable|NetworkError|Load failed/i.test(message)) {
    if (IS_STATIC_BUILD) {
      return `Mailbox ${action} failed: back end at ${localLabBackendBaseUrl()} is not available. Check that the Render backend service is deployed and awake, then reload Entanglement 3.`;
    }
    return `Mailbox ${action} failed: backend at ${localLabBackendBaseUrl()} is not reachable. Start it with npm run backend and try again.`;
  }
  return `Mailbox ${action} failed: ${message}`;
}

async function localLabReadJsonResponse(response) {
  const text = await response.text();
  if (!text.trim()) {
    return {};
  }
  try {
    return JSON.parse(text);
  } catch (_error) {
    return { error: { message: text } };
  }
}

async function localLabRequest(path, options = {}) {
  const body = options.body == null ? null : JSON.stringify(options.body);
  let response = null;
  try {
    response = await fetch(`${localLabBackendBaseUrl()}${path}`, {
      method: options.method || "GET",
      headers: body ? { "Content-Type": "application/json" } : undefined,
      body,
    });
  } catch (_error) {
    throw new Error(
      `backend at ${localLabBackendBaseUrl()} is not reachable`,
    );
  }
  const payload = await localLabReadJsonResponse(response);
  if (!response.ok) {
    throw new Error(
      payload?.error?.message ||
        payload?.message ||
        `Backend request failed (${response.status})`,
    );
  }
  return payload;
}

async function localLabEnsureMailboxRoom() {
  const roomId = localLabRoomId();
  let response = null;
  try {
    response = await fetch(`${localLabBackendBaseUrl()}/rooms`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: roomId,
        label: "Local Lab mailbox",
        ownerId: localLabParticipantName(),
      }),
    });
  } catch (_error) {
    throw new Error(
      `backend at ${localLabBackendBaseUrl()} is not reachable`,
    );
  }
  if (response.status === 409) {
    return;
  }
  const payload = await localLabReadJsonResponse(response);
  if (!response.ok) {
    throw new Error(
      payload?.error?.message ||
        payload?.message ||
        `Unable to create mailbox room (${response.status})`,
    );
  }
}

async function localLabRegisterParticipant() {
  await localLabEnsureMailboxRoom();
  const payload = await localLabRequest(localLabParticipantPath(), {
    method: "PUT",
    body: {
      displayName: localLabParticipantName(),
      role: localLabParticipantRoleValue(),
    },
  });
  return payload.participant || null;
}

function localLabSerializableRegister(register) {
  return {
    numQubits: register.numQubits,
    amplitudes: register.amplitudes.map((entry) => {
      const value = localLabComplex(entry);
      return { re: value.re, im: value.im };
    }),
  };
}

async function localLabPutSharedRegisterSnapshot(
  register,
  metadata = {},
  expectedVersion = undefined,
) {
  await localLabEnsureMailboxRoom();
  const body = {
    id: LOCAL_LAB_REGISTER_ID,
    label: "Shared Local Lab register",
    ownerId: localLabParticipantName(),
    ...localLabSerializableRegister(register),
    metadata: {
      selectedQubit: localLabState.selectedQubit,
      ...metadata,
    },
  };
  if (expectedVersion != null) {
    body.expectedVersion = expectedVersion;
  }
  const payload = await localLabRequest(localLabSharedRegisterPath(), {
    method: "PUT",
    body,
  });
  const version = payload.register?.version ?? null;
  localLabState.sync.connected = true;
  localLabState.sync.lastVersion = version;
  return payload.register;
}

async function localLabSyncMailboxRegister() {
  const register = localLabRegister();
  if (!register) {
    throw new Error("Local register unavailable");
  }
  return localLabPutSharedRegisterSnapshot(register, {
    selectedQubit: localLabState.selectedQubit,
  });
}

async function localLabSendMailboxTransfer(options = {}) {
  const setStatus =
    typeof options.setStatus === "function"
      ? options.setStatus
      : localLabSetMailboxStatus;
  const setLink =
    typeof options.setLink === "function" ? options.setLink : localLabSetMailboxLink;
  const register = localLabRegister();
  if (!register) {
    setStatus("Local register unavailable");
    if (options.throwOnFailure) {
      throw new Error("Local register unavailable");
    }
    return;
  }
  const email =
    typeof options.email === "string"
      ? options.email.trim()
      : localLabMailboxEmail instanceof HTMLInputElement
      ? localLabMailboxEmail.value.trim()
      : "";
  if (!email) {
    setStatus("Email required");
    if (options.throwOnFailure) {
      throw new Error("Email required");
    }
    return;
  }
  const qubitIndex = localLabClampQubitIndex(
    Number.isInteger(options.qubitIndex)
      ? options.qubitIndex
      : localLabState.selectedQubit,
    register.numQubits,
  );
  setStatus("Sending...");
  try {
    await localLabSyncMailboxRegister();
    const metadata = {
      appLinkBase: window.location.origin,
      frontendLinkTemplate: localLabMailboxFrontendLink("__TOKEN__"),
    };
    if (typeof options.message === "string" && options.message.trim()) {
      metadata.emailSubject = "Paul sent you an entangled qubit";
      metadata.emailBody = mailboxMessageBodyWithLinkPlaceholder(options.message);
    }
    const payload = await localLabRequest(
      `/rooms/${encodeURIComponent(localLabRoomId())}/mailbox-transfers`,
      {
        method: "POST",
        body: {
          registerId: LOCAL_LAB_REGISTER_ID,
          qubitIndex,
          email,
          from: localLabParticipantName(),
          createdBy: localLabParticipantName(),
          metadata,
        },
      },
    );
    const transfer = payload.transfer;
    if (!transfer?.token) {
      throw new Error("Backend did not return a mailbox token");
    }
    const link = transfer.delivery?.link || localLabMailboxFrontendLink(transfer.token);
    setLink(link, transfer.token);
    if (transfer.delivery?.status === "sent") {
      setStatus(`Mailbox email sent for q${qubitIndex}`);
    } else if (transfer.delivery?.status === "send-failed") {
      setStatus(`Mailbox email failed; link ready for q${qubitIndex}`);
    } else if (transfer.delivery?.status === "queued-local") {
      setStatus(
        `Email not sent: mail delivery is not configured. Link ready for q${qubitIndex}`,
      );
    } else {
      setStatus(`Mailbox link ready for q${qubitIndex}`);
    }
    return transfer;
  } catch (error) {
    setStatus(localLabMailboxFailureMessage("send", error));
    if (options.throwOnFailure) {
      throw error;
    }
    return null;
  }
}

async function localLabReceiveMailboxTransfer() {
  const token =
    localLabMailboxToken instanceof HTMLInputElement
      ? localLabMailboxToken.value.trim()
      : "";
  if (!token) {
    localLabSetMailboxStatus("Token required");
    return;
  }
  localLabSetMailboxStatus("Receiving...");
  try {
    const payload = await localLabRequest(
      `/mailbox-transfers/${encodeURIComponent(token)}/claim`,
      {
        method: "POST",
        body: {
          claimedBy: "local-lab",
        },
      },
    );
    const transfer = payload.transfer;
    const snapshot = transfer?.payload?.register;
    if (
      !snapshot ||
      !Number.isInteger(snapshot.numQubits) ||
      !Array.isArray(snapshot.amplitudes)
    ) {
      throw new Error("Mailbox payload did not include a register snapshot");
    }
    const selectedQubit = localLabClampQubitIndex(
      Number.isInteger(transfer.payload.selectedQubit)
        ? transfer.payload.selectedQubit
        : transfer.qubitIndex,
      snapshot.numQubits,
    );
    localLabClearTeleportation();
    localLabState.selectedQubit = selectedQubit;
    localLabSetRegister(
      sharedRegisterCreate(snapshot.numQubits, snapshot.amplitudes),
      `Received mailbox q${selectedQubit}`,
    );
    localLabSetMailboxLink("", token);
    localLabClearMailboxRouteParams();
    localLabSetMailboxStatus(`Received q${selectedQubit}; token claimed`);
  } catch (error) {
    localLabSetMailboxStatus(localLabMailboxFailureMessage("receive", error));
  }
}

function localLabSetRegisterFromRemote(register, statusMessage, selectedQubit = 0) {
  if (!register || !quantumCore?.createRegister) {
    return;
  }
  localLabState.sync.applyingRemote = true;
  try {
    localLabState.selectedQubit = localLabClampQubitIndex(
      selectedQubit,
      register.numQubits,
    );
    localLabSetRegister(
      sharedRegisterCreate(register.numQubits, register.amplitudes),
      statusMessage,
    );
  } finally {
    localLabState.sync.applyingRemote = false;
  }
}

function localLabRegisterMetadata() {
  return {
    selectedQubit: localLabState.selectedQubit,
    participant: localLabParticipantName(),
    updatedFrom: "local-lab",
  };
}

async function localLabPushSharedRegister({ silent = false } = {}) {
  const register = localLabRegister();
  if (!register) {
    localLabSetSyncStatus("Local register unavailable");
    return null;
  }
  if (!localLabState.sync.connected && !silent) {
    localLabSetSyncStatus("Connect first");
  }
  try {
    await localLabEnsureMailboxRoom();
    const body = {
      id: LOCAL_LAB_REGISTER_ID,
      label: "Shared Local Lab register",
      ownerId: localLabParticipantName(),
      ...localLabSerializableRegister(register),
      metadata: localLabRegisterMetadata(),
    };
    if (localLabState.sync.lastVersion != null) {
      body.expectedVersion = localLabState.sync.lastVersion;
    }
    const payload = await localLabRequest(localLabSharedRegisterPath(), {
      method: "PUT",
      body,
    });
    const version = payload.register?.version ?? null;
    localLabState.sync.connected = true;
    localLabState.sync.lastVersion = version;
    if (!silent) {
      localLabSetSyncStatus(`Pushed v${version ?? "?"}`);
    }
    return payload.register;
  } catch (error) {
    if (/version conflict|register_version_conflict/i.test(error.message || "")) {
      localLabSetSyncStatus("Shared register changed; pull first");
    } else if (!silent) {
      localLabSetSyncStatus(`Push failed: ${error.message}`);
    }
    return null;
  }
}

async function localLabPullSharedRegister({ silent = false } = {}) {
  try {
    const payload = await localLabRequest(localLabSharedRegisterPath());
    const register = payload.register;
    if (!register) {
      throw new Error("Backend did not return a register");
    }
    localLabState.sync.connected = true;
    localLabState.sync.lastVersion = register.version ?? null;
    localLabClearTeleportation();
    localLabSetRegisterFromRemote(
      register,
      silent ? "" : `Pulled shared register v${register.version ?? "?"}`,
      Number.isInteger(register.metadata?.selectedQubit)
        ? register.metadata.selectedQubit
        : localLabState.selectedQubit,
    );
    if (!silent) {
      localLabSetSyncStatus(`Pulled v${register.version ?? "?"}`);
    }
    return register;
  } catch (error) {
    if (!silent) {
      localLabSetSyncStatus(`Pull failed: ${error.message}`);
    }
    return null;
  }
}

async function localLabConnectSharedRegister() {
  localLabSetSyncStatus("Connecting...");
  localLabState.sync.connected = false;
  try {
    const participant = await localLabRegisterParticipant();
    const pulled = await localLabPullSharedRegister({ silent: true });
    if (pulled) {
      localLabSetSyncStatus(
        `Connected ${participant?.role || localLabParticipantRoleValue()} v${pulled.version ?? "?"}`,
      );
      localLabUpdateSyncPolling();
      return;
    }
    const pushed = await localLabPushSharedRegister({ silent: true });
    if (pushed) {
      localLabSetSyncStatus(
        `Connected ${participant?.role || localLabParticipantRoleValue()} v${pushed.version ?? "?"}`,
      );
      localLabUpdateSyncPolling();
      return;
    }
    localLabSetSyncStatus("Connect failed");
  } catch (error) {
    localLabSetSyncStatus(`Connect failed: ${error.message}`);
  }
}

async function localLabPollSharedRegister() {
  if (!localLabState.sync.connected) {
    return;
  }
  try {
    const payload = await localLabRequest(localLabSharedRegisterPath());
    const register = payload.register;
    if (!register) {
      return;
    }
    const version = register.version ?? null;
    if (
      version != null &&
      localLabState.sync.lastVersion != null &&
      version <= localLabState.sync.lastVersion
    ) {
      return;
    }
    localLabState.sync.lastVersion = version;
    localLabClearTeleportation();
    localLabSetRegisterFromRemote(
      register,
      `Synced shared register v${version ?? "?"}`,
      Number.isInteger(register.metadata?.selectedQubit)
        ? register.metadata.selectedQubit
        : localLabState.selectedQubit,
    );
    localLabSetSyncStatus(`Synced v${version ?? "?"}`);
  } catch (error) {
    localLabSetSyncStatus(`Sync paused: ${error.message}`);
  }
}

function localLabLiveSyncEnabled() {
  return Boolean(
    localLabSyncLiveToggle instanceof HTMLInputElement &&
      localLabSyncLiveToggle.checked,
  );
}

function localLabUpdateSyncPolling() {
  if (localLabState.sync.pollTimer) {
    window.clearInterval(localLabState.sync.pollTimer);
    localLabState.sync.pollTimer = null;
  }
  if (localLabState.sync.connected && localLabLiveSyncEnabled()) {
    localLabState.sync.pollTimer = window.setInterval(() => {
      void localLabPollSharedRegister();
    }, LOCAL_LAB_SYNC_INTERVAL_MS);
  }
}

function localLabScheduleAutoPush() {
  if (
    localLabState.sync.applyingRemote ||
    !localLabState.sync.connected ||
    !localLabLiveSyncEnabled()
  ) {
    return;
  }
  if (localLabState.sync.pushTimer) {
    window.clearTimeout(localLabState.sync.pushTimer);
  }
  localLabState.sync.pushTimer = window.setTimeout(() => {
    localLabState.sync.pushTimer = null;
    void localLabPushSharedRegister({ silent: true }).then((register) => {
      if (register) {
        localLabSetSyncStatus(`Shared v${register.version ?? "?"}`);
      }
    });
  }, 150);
}

async function localLabSaveDistributedProtocol(update) {
  const payload = await localLabRequest(localLabDistributedProtocolPath(), {
    method: "PUT",
    body: {
      registerId: LOCAL_LAB_REGISTER_ID,
      updatedBy: localLabParticipantName(),
      ...update,
    },
  });
  localLabState.distributedTeleportation.protocol = payload.protocol || null;
  localLabRenderDistributedProtocolFramework(
    payload.protocol || null,
    payload.definition || null,
  );
  return payload.protocol;
}

async function localLabFetchDistributedProtocol() {
  const payload = await localLabRequest(localLabDistributedProtocolPath());
  localLabState.distributedTeleportation.protocol = payload.protocol || null;
  localLabRenderDistributedProtocolFramework(
    payload.protocol || null,
    payload.definition || null,
  );
  return payload.protocol;
}

function localLabProtocolMessageVector(protocol) {
  return Array.isArray(protocol?.messageVector)
    ? protocol.messageVector
    : localLabTeleportRecord().messageVector;
}

async function localLabDistributedBobStart() {
  if (!localLabIsReady() || !quantumCore?.productRegister) {
    return;
  }
  const email =
    localLabMailboxEmail instanceof HTMLInputElement
      ? localLabMailboxEmail.value.trim()
      : "";
  if (!email) {
    localLabSetDistributedStatus("Email required for Alice mailbox link");
    return;
  }
  localLabSetDistributedStatus("Bob preparing Bell pair...");
  try {
    const messageKey = localLabTeleportMessageKey();
    const messageVector = localLabNormalizeQubitVector(
      localLabTeleportMessageVector(messageKey),
    );
    let register = quantumCore.productRegister([
      messageVector,
      [1, 0],
      [1, 0],
    ]);
    register = quantumCore.applySingleQubitGate(register, 1, quantumCore.gateMatrices.H);
    register = quantumCore.applyCnot(register, 1, 2);
    localLabState.selectedQubit = 1;
    localLabClearTeleportation();
    localLabSetRegister(register, "Distributed: Bob created Bell pair q1-q2");
    const savedRegister = await localLabPutSharedRegisterSnapshot(register, {
      protocolId: localLabDistributedProtocolId(),
      protocolStage: "bell-sent",
      selectedQubit: 1,
    });
    try {
      await localLabRequest(
        `/rooms/${encodeURIComponent(localLabRoomId())}/entanglement-groups`,
        {
          method: "POST",
          body: {
            id: `${localLabDistributedProtocolId()}-bell`,
            label: "Distributed teleportation Bell pair",
            qubits: [
              { registerId: LOCAL_LAB_REGISTER_ID, qubitIndex: 1 },
              { registerId: LOCAL_LAB_REGISTER_ID, qubitIndex: 2 },
            ],
            metadata: {
              protocolId: localLabDistributedProtocolId(),
            },
          },
        },
      );
    } catch (_error) {
      // Existing entanglement group is fine when rerunning the same protocol.
    }
    const transferPayload = await localLabRequest(
      `/rooms/${encodeURIComponent(localLabRoomId())}/mailbox-transfers`,
      {
        method: "POST",
        body: {
          registerId: LOCAL_LAB_REGISTER_ID,
          qubitIndex: 1,
          email,
          from: localLabParticipantName(),
          createdBy: localLabParticipantName(),
          metadata: {
            protocolId: localLabDistributedProtocolId(),
            role: "alice-pair-qubit",
            frontendLinkTemplate: localLabMailboxFrontendLink("__TOKEN__"),
          },
        },
      },
    );
    const token = transferPayload.transfer?.token || "";
    const link = transferPayload.transfer?.delivery?.link ||
      (token ? localLabMailboxFrontendLink(token) : "");
    localLabSetDistributedMailboxLink(link);
    if (token) {
      localLabSetMailboxLink(link, token);
    }
    const protocol = await localLabSaveDistributedProtocol({
      stage: "bell-sent",
      createdBy: localLabParticipantName(),
      messageKey,
      messageVector,
      mailboxToken: token,
      aliceBits: null,
      bobCorrection: [],
      fidelity: null,
      metadata: {
        aliceMessageQubit: 0,
        alicePairQubit: 1,
        bobQubit: 2,
        registerVersion: savedRegister?.version ?? null,
      },
    });
    localLabSetDistributedStatus(
      `Bob mailed q1; protocol v${protocol?.version ?? "?"}`,
    );
  } catch (error) {
    localLabSetDistributedStatus(`Distributed start failed: ${error.message}`);
  }
}

async function localLabDistributedAliceMeasure() {
  if (!localLabIsReady() || !quantumCore?.applyCnot || !quantumCore?.measureQubit) {
    return;
  }
  localLabSetDistributedStatus("Alice measuring...");
  try {
    const protocol = await localLabFetchDistributedProtocol();
    if (!protocol?.registerId) {
      throw new Error("Bob must start the protocol first");
    }
    const registerPayload = await localLabRequest(localLabSharedRegisterPath());
    let register = sharedRegisterCreate(
      registerPayload.register.numQubits,
      registerPayload.register.amplitudes,
    );
    if (register.numQubits !== 3) {
      throw new Error("Distributed teleportation needs a 3-qubit register");
    }
    register = quantumCore.applyCnot(register, 0, 1);
    register = quantumCore.applySingleQubitGate(register, 0, quantumCore.gateMatrices.H);
    const sourceMeasurement = quantumCore.measureQubit(register, 0);
    const pairMeasurement = quantumCore.measureQubit(sourceMeasurement.register, 1);
    const aliceBits = {
      source: sourceMeasurement.outcome,
      pair: pairMeasurement.outcome,
    };
    localLabState.selectedQubit = 2;
    localLabClearTeleportation();
    localLabSetRegister(
      pairMeasurement.register,
      `Distributed: Alice measured q0=${aliceBits.source}, q1=${aliceBits.pair}`,
    );
    const savedRegister = await localLabPutSharedRegisterSnapshot(
      pairMeasurement.register,
      {
        protocolId: localLabDistributedProtocolId(),
        protocolStage: "alice-measured",
        selectedQubit: 2,
      },
      registerPayload.register.version,
    );
    const savedProtocol = await localLabSaveDistributedProtocol({
      stage: "alice-measured",
      aliceBits,
      metadata: {
        ...(protocol.metadata || {}),
        registerVersion: savedRegister?.version ?? null,
      },
    });
    localLabSetDistributedStatus(
      `Alice sent bits ${aliceBits.source}${aliceBits.pair}; protocol v${savedProtocol?.version ?? "?"}`,
    );
  } catch (error) {
    localLabSetDistributedStatus(`Alice step failed: ${error.message}`);
  }
}

async function localLabDistributedBobCorrect() {
  if (!localLabIsReady() || !quantumCore?.applySingleQubitGate) {
    return;
  }
  localLabSetDistributedStatus("Bob correcting...");
  try {
    const protocol = await localLabFetchDistributedProtocol();
    if (!protocol?.aliceBits) {
      throw new Error("Alice measurement bits are required");
    }
    const registerPayload = await localLabRequest(localLabSharedRegisterPath());
    let register = sharedRegisterCreate(
      registerPayload.register.numQubits,
      registerPayload.register.amplitudes,
    );
    const corrections = [];
    if (protocol.aliceBits.pair === 1) {
      register = quantumCore.applySingleQubitGate(register, 2, quantumCore.gateMatrices.X);
      corrections.push("X");
    }
    if (protocol.aliceBits.source === 1) {
      register = quantumCore.applySingleQubitGate(register, 2, quantumCore.gateMatrices.Z);
      corrections.push("Z");
    }
    const bobVector = localLabQubitVectorForFixedBits(register, 2, {
      0: protocol.aliceBits.source,
      1: protocol.aliceBits.pair,
    });
    const fidelity = localLabQubitFidelity(
      localLabProtocolMessageVector(protocol),
      bobVector,
    );
    localLabState.selectedQubit = 2;
    localLabSetRegister(
      register,
      `Distributed: Bob correction ${corrections.join("+") || "none"} on q2`,
    );
    const savedRegister = await localLabPutSharedRegisterSnapshot(
      register,
      {
        protocolId: localLabDistributedProtocolId(),
        protocolStage: "complete",
        selectedQubit: 2,
      },
      registerPayload.register.version,
    );
    const savedProtocol = await localLabSaveDistributedProtocol({
      stage: "complete",
      bobCorrection: corrections,
      fidelity,
      metadata: {
        ...(protocol.metadata || {}),
        registerVersion: savedRegister?.version ?? null,
      },
    });
    localLabSetDistributedStatus(
      `Complete: fidelity=${localLabFormatProbability(fidelity)}; protocol v${savedProtocol?.version ?? "?"}`,
    );
  } catch (error) {
    localLabSetDistributedStatus(`Bob correction failed: ${error.message}`);
  }
}

async function localLabDistributedRefresh() {
  localLabSetDistributedStatus("Refreshing protocol...");
  try {
    const protocol = await localLabFetchDistributedProtocol();
    if (protocol?.registerId) {
      const payload = await localLabRequest(localLabSharedRegisterPath());
      const register = payload.register || null;
      if (register) {
        localLabState.sync.lastVersion = register.version ?? localLabState.sync.lastVersion;
        localLabSetRegisterFromRemote(
          register,
          `Distributed: refreshed ${protocol.stage}`,
          Number.isInteger(register.metadata?.selectedQubit)
            ? register.metadata.selectedQubit
            : localLabState.selectedQubit,
        );
      }
    }
    if (protocol?.mailboxToken) {
      localLabSetDistributedMailboxLink(localLabMailboxFrontendLink(protocol.mailboxToken));
    }
    const bits = protocol?.aliceBits
      ? ` bits ${protocol.aliceBits.source}${protocol.aliceBits.pair}`
      : "";
    const fidelity =
      protocol?.fidelity == null
        ? ""
        : ` fidelity=${localLabFormatProbability(protocol.fidelity)}`;
    localLabSetDistributedStatus(
      `${protocol?.stage || "No protocol"}${bits}${fidelity}`,
    );
  } catch (error) {
    localLabSetDistributedStatus(`Refresh failed: ${error.message}`);
  }
}

function localLabInitializeMailboxControls() {
  const backendFromLocation = localLabBackendUrlFromLocation();
  const backendFromConfig = localLabBackendUrlFromConfig();
  if (localLabBackendUrl instanceof HTMLInputElement) {
    localLabBackendUrl.value =
      backendFromLocation ||
      backendFromConfig ||
      localLabBackendUrl.value.trim() ||
      LOCAL_LAB_DEFAULT_BACKEND_URL;
  }
  const roomFromLocation = localLabRoomFromLocation();
  if (localLabSyncRoom instanceof HTMLInputElement && roomFromLocation) {
    localLabSyncRoom.value = roomFromLocation;
  }
  const participantFromLocation = localLabParticipantFromLocation();
  if (
    localLabSyncParticipant instanceof HTMLInputElement &&
    participantFromLocation
  ) {
    localLabSyncParticipant.value = participantFromLocation;
  }
  const roleFromLocation = localLabRoleFromLocation();
  if (
    localLabParticipantRole instanceof HTMLSelectElement &&
    ["owner", "editor", "viewer"].includes(roleFromLocation)
  ) {
    localLabParticipantRole.value = roleFromLocation;
  }
  const token = localLabMailboxTokenFromLocation();
  if (localLabMailboxToken instanceof HTMLInputElement && token) {
    localLabMailboxToken.value = token;
    localLabSetMailboxLink(localLabMailboxFrontendLink(token), token);
  }
}

async function localLabCopyClassroomLink() {
  const link = localLabClassroomLink();
  if (localLabClassroomLinkButton instanceof HTMLButtonElement) {
    localLabClassroomLinkButton.title = link;
  }
  localLabSetSyncStatus("Classroom link ready");
  try {
    const copied = await localLabCopyText(link);
    if (copied) {
      localLabSetSyncStatus("Classroom link copied");
    }
  } catch (_error) {
    localLabSetSyncStatus("Classroom link ready");
  }
}

function localLabHandleMailboxRoute() {
  const token = localLabMailboxTokenFromLocation();
  if (!token) {
    return;
  }
  if (localLabMailboxToken instanceof HTMLInputElement) {
    localLabMailboxToken.value = token;
  }
  setActiveTab("local-lab");
  window.requestAnimationFrame(() => {
    void localLabReceiveMailboxTransfer();
  });
}

function localLabSnapshotPayload() {
  const register = localLabRegister();
  if (!register) {
    return null;
  }
  return {
    version: 1,
    savedAt: new Date().toISOString(),
    selectedQubit: localLabState.selectedQubit,
    roomId: localLabRoomId(),
    participantName: localLabParticipantName(),
    participantRole: localLabParticipantRoleValue(),
    register: localLabSerializableRegister(register),
  };
}

function localLabSaveSnapshot() {
  const snapshot = localLabSnapshotPayload();
  if (!snapshot) {
    localLabSetStatus("Nothing to save");
    return;
  }
  try {
    window.localStorage.setItem(
      LOCAL_LAB_SNAPSHOT_STORAGE_KEY,
      JSON.stringify(snapshot),
    );
    localLabSetStatus(`Saved lab: ${snapshot.register.numQubits} qubits`);
  } catch (error) {
    localLabSetStatus(`Save failed: ${error.message}`);
  }
}

function localLabApplySnapshot(snapshot) {
  if (
    !snapshot ||
    typeof snapshot !== "object" ||
    !snapshot.register ||
    !Number.isInteger(snapshot.register.numQubits) ||
    !Array.isArray(snapshot.register.amplitudes)
  ) {
    throw new Error("Saved lab snapshot is not valid");
  }
  const register = sharedRegisterCreate(
    snapshot.register.numQubits,
    snapshot.register.amplitudes,
  );
  localLabClearTeleportation();
  localLabState.selectedQubit = localLabClampQubitIndex(
    Number.isInteger(snapshot.selectedQubit) ? snapshot.selectedQubit : 0,
    register.numQubits,
  );
  if (localLabSyncRoom instanceof HTMLInputElement && snapshot.roomId) {
    localLabSyncRoom.value = snapshot.roomId;
  }
  if (localLabSyncParticipant instanceof HTMLInputElement && snapshot.participantName) {
    localLabSyncParticipant.value = snapshot.participantName;
  }
  if (
    localLabParticipantRole instanceof HTMLSelectElement &&
    ["owner", "editor", "viewer"].includes(snapshot.participantRole)
  ) {
    localLabParticipantRole.value = snapshot.participantRole;
  }
  localLabSetRegister(register, `Loaded lab: ${register.numQubits} qubits`);
}

function localLabLoadSnapshot() {
  try {
    const raw = window.localStorage.getItem(LOCAL_LAB_SNAPSHOT_STORAGE_KEY);
    if (!raw) {
      localLabSetStatus("No saved lab yet");
      return;
    }
    localLabApplySnapshot(JSON.parse(raw));
  } catch (error) {
    localLabSetStatus(`Load failed: ${error.message}`);
  }
}

function localLabReset(numQubits = localLabCurrentSize()) {
  if (!localLabIsReady()) {
    localLabSetStatus("QuantumCore unavailable");
    return;
  }
  const size = Math.min(Math.max(numQubits, 1), LOCAL_LAB_MAX_QUBITS);
  localLabState.selectedQubit = 0;
  localLabState.teleportation = null;
  localLabState.register = sharedRegisterCreate(size);
  localLabRender(`Ready: ${size} local qubit${size === 1 ? "" : "s"}`);
  localLabSetTeleportStatus("");
  localLabScheduleAutoPush();
}

function localLabSelectQubit(index) {
  const register = localLabRegister();
  if (!register) {
    return;
  }
  localLabState.selectedQubit = localLabClampQubitIndex(
    index,
    register.numQubits,
  );
  if (localLabTargetQubit instanceof HTMLSelectElement) {
    localLabTargetQubit.value = String(localLabState.selectedQubit);
  }
  if (localLabMeasureQubit instanceof HTMLSelectElement) {
    localLabMeasureQubit.value = String(localLabState.selectedQubit);
  }
  localLabRender();
}

function localLabApplySingleGate(gateKey) {
  const register = localLabRegister();
  const matrix = quantumCore?.gateMatrices?.[gateKey];
  if (!register || !matrix || !quantumCore?.applySingleQubitGate) {
    return;
  }
  localLabClearTeleportation();
  const target = localLabClampQubitIndex(
    localLabSelectValue(localLabTargetQubit, localLabState.selectedQubit),
    register.numQubits,
  );
  localLabState.selectedQubit = target;
  localLabSetRegister(
    quantumCore.applySingleQubitGate(register, target, matrix),
    `${gateKey} applied to q${target}`,
  );
}

function localLabApplyCnot() {
  const register = localLabRegister();
  if (!register || !quantumCore?.applyCnot) {
    return;
  }
  localLabClearTeleportation();
  const control = localLabClampQubitIndex(
    localLabSelectValue(localLabControlQubit, 0),
    register.numQubits,
  );
  const target = localLabClampQubitIndex(
    localLabSelectValue(localLabTargetQubit, localLabState.selectedQubit),
    register.numQubits,
  );
  if (control === target) {
    localLabSetStatus("C-NOT needs different control and target qubits");
    return;
  }
  localLabState.selectedQubit = target;
  localLabSetRegister(
    quantumCore.applyCnot(register, control, target),
    `C-NOT q${control} -> q${target}`,
  );
}

function localLabMeasureSelectedQubit() {
  const register = localLabRegister();
  if (!register || !quantumCore?.measureQubit) {
    return;
  }
  localLabClearTeleportation();
  const target = localLabClampQubitIndex(
    localLabSelectValue(localLabMeasureQubit, localLabState.selectedQubit),
    register.numQubits,
  );
  const result = quantumCore.measureQubit(register, target);
  localLabState.selectedQubit = target;
  localLabSetRegister(
    result.register,
    `Measured q${target}: ${result.color} (p=${localLabFormatProbability(result.probability)})`,
  );
}

function localLabMeasureAllQubits() {
  let register = localLabRegister();
  if (!register || !quantumCore?.measureQubit) {
    return;
  }
  localLabClearTeleportation();
  const bits = [];
  let probability = 1;
  for (let qubitIndex = 0; qubitIndex < register.numQubits; qubitIndex += 1) {
    const result = quantumCore.measureQubit(register, qubitIndex);
    bits.push(String(result.outcome));
    probability *= result.probability;
    register = result.register;
  }
  localLabSetRegister(
    register,
    `Measured |${bits.join("")}> (p=${localLabFormatProbability(probability)})`,
  );
}

function localLabGateMatrixForInspector(gateKey) {
  const register = localLabRegister();
  const matrix = quantumCore?.gateMatrices?.[gateKey];
  if (!register || !matrix || !quantumCore?.matrixForSingleQubitGate) {
    return matrix || null;
  }
  const target = localLabClampQubitIndex(
    localLabSelectValue(localLabTargetQubit, localLabState.selectedQubit),
    register.numQubits,
  );
  return quantumCore.matrixForSingleQubitGate(register.numQubits, target, matrix);
}

function localLabCnotMatrixForInspector() {
  const register = localLabRegister();
  if (!register || !quantumCore?.matrixForCnot || register.numQubits < 2) {
    return null;
  }
  const control = localLabClampQubitIndex(
    localLabSelectValue(localLabControlQubit, 0),
    register.numQubits,
  );
  const target = localLabClampQubitIndex(
    localLabSelectValue(localLabTargetQubit, localLabState.selectedQubit),
    register.numQubits,
  );
  if (control === target) {
    return null;
  }
  return quantumCore.matrixForCnot(register.numQubits, control, target);
}

function localLabRenderQubits(register) {
  if (!(localLabQubitRail instanceof HTMLElement)) {
    return;
  }
  localLabQubitRail
    .querySelectorAll(".local-lab-qubit")
    .forEach((element) => qubitStateGetters.delete(element));
  localLabQubitRail.replaceChildren(
    ...Array.from({ length: register.numQubits }, (_, index) => {
      const marginal = quantumCore.marginalProbabilities(register, index);
      const button = document.createElement("button");
      button.type = "button";
      button.className = "local-lab-qubit";
      button.classList.toggle("active", index === localLabState.selectedQubit);
      button.dataset.localLabQubitIndex = String(index);
      button.addEventListener("click", () => localLabSelectQubit(index));

      const core = document.createElement("span");
      core.className = "local-lab-qubit-core";
      core.style.setProperty(
        "--qubit-fill",
        blendBlueRed(marginal.blue, marginal.red),
      );

      const label = document.createElement("span");
      label.className = "local-lab-qubit-label";
      label.textContent = `q${index}`;

      const probabilities = document.createElement("span");
      probabilities.className = "local-lab-qubit-probability";
      probabilities.textContent = `B ${localLabPercent(marginal.blue)} / R ${localLabPercent(marginal.red)}`;

      button.append(core, label, probabilities);
      registerQubitInspector(button, () => ({
        label: "Local Register Inspector",
        register: localLabRegister(),
        selectedIndex: index,
        memberLabels: localLabMemberLabels(register.numQubits),
      }));
      return button;
    }),
  );
}

function localLabRenderProbabilities(register) {
  if (!(localLabProbabilityGrid instanceof HTMLElement)) {
    return;
  }
  localLabProbabilityGrid.replaceChildren(
    ...register.amplitudes.map((amplitude, index) => {
      const probability = quantumCore.magnitudeSquared(amplitude);
      const cell = document.createElement("div");
      cell.className = "local-lab-basis-state";
      cell.dataset.basisIndex = String(index);
      cell.dataset.active = probability > 1e-9 ? "true" : "false";

      const label = document.createElement("span");
      label.className = "local-lab-basis-label";
      label.textContent = `|${quantumCore.basisLabel(index, register.numQubits)}>`;

      const probabilityText = document.createElement("span");
      probabilityText.className = "local-lab-basis-probability";
      probabilityText.textContent = `p=${localLabFormatProbability(probability)}`;

      cell.append(label, probabilityText);
      return cell;
    }),
  );
}

function localLabRenderKet(register) {
  if (!(localLabKetVector instanceof HTMLElement)) {
    return;
  }
  const lines = quantumRegisterKetLines(register, {
    selectedIndex: localLabState.selectedQubit,
    memberLabels: localLabMemberLabels(register.numQubits),
  });
  localLabKetVector.textContent = lines.join("\n");
}

function localLabRender(statusMessage = "") {
  const register = localLabRegister();
  if (!register) {
    localLabSetStatus("QuantumCore unavailable");
    return;
  }
  localLabSyncControls(register);
  localLabRenderQubits(register);
  localLabRenderProbabilities(register);
  localLabRenderKet(register);
  if (statusMessage) {
    localLabSetStatus(statusMessage);
  }
}

function setupLocalMultiQubitLab() {
  if (!(localLabPanel instanceof HTMLElement)) {
    return;
  }
  if (!localLabIsReady()) {
    localLabSetStatus("QuantumCore unavailable");
    return;
  }

  localLabInitializeMailboxControls();
  localLabQubitCount?.addEventListener("change", () => {
    localLabReset(localLabCurrentSize());
  });
  localLabResetButton?.addEventListener("click", () => {
    localLabReset(localLabCurrentSize());
  });
  localLabSaveSnapshotButton?.addEventListener("click", localLabSaveSnapshot);
  localLabLoadSnapshotButton?.addEventListener("click", localLabLoadSnapshot);
  localLabTargetQubit?.addEventListener("change", () => {
    localLabSelectQubit(localLabSelectValue(localLabTargetQubit, 0));
  });
  localLabMeasureQubit?.addEventListener("change", () => {
    localLabSelectQubit(localLabSelectValue(localLabMeasureQubit, 0));
  });
  localLabPanel
    .querySelectorAll("[data-local-lab-gate]")
    .forEach((button) => {
      if (!(button instanceof HTMLButtonElement)) {
        return;
      }
      const gateKey = button.dataset.localLabGate || "";
      button.addEventListener("click", () => localLabApplySingleGate(gateKey));
      registerGateInspector(button, () => ({
        label: `${gateKey} Gate`,
        matrix: localLabGateMatrixForInspector(gateKey),
      }));
    });
  localLabCnotButton?.addEventListener("click", localLabApplyCnot);
  registerGateInspector(localLabCnotButton, () => ({
    label: "C-NOT Gate",
    matrix: localLabCnotMatrixForInspector(),
  }));
  localLabMeasureButton?.addEventListener("click", localLabMeasureSelectedQubit);
  localLabMeasureAllButton?.addEventListener("click", localLabMeasureAllQubits);
  localLabTeleportMessage?.addEventListener("change", () => {
    localLabTeleportPrepare();
  });
  localLabTeleportPrepareButton?.addEventListener(
    "click",
    localLabTeleportPrepare,
  );
  localLabTeleportBellButton?.addEventListener(
    "click",
    localLabTeleportCreateBellPair,
  );
  localLabTeleportAliceButton?.addEventListener(
    "click",
    localLabTeleportAliceMeasure,
  );
  localLabTeleportBobButton?.addEventListener(
    "click",
    localLabTeleportBobCorrection,
  );
  localLabTeleportRunButton?.addEventListener(
    "click",
    localLabTeleportRunProtocol,
  );
  localLabDistributedBobStartButton?.addEventListener("click", () => {
    void localLabDistributedBobStart();
  });
  localLabDistributedAliceMeasureButton?.addEventListener("click", () => {
    void localLabDistributedAliceMeasure();
  });
  localLabDistributedBobCorrectButton?.addEventListener("click", () => {
    void localLabDistributedBobCorrect();
  });
  localLabDistributedRefreshButton?.addEventListener("click", () => {
    void localLabDistributedRefresh();
  });
  localLabProtocolRecipeSelect?.addEventListener("change", () => {
    localLabSyncProtocolIdToRecipe();
    localLabRenderProtocolSteps(null, localLabProtocolDefinitionFor());
  });
  localLabProtocolLoadButton?.addEventListener("click", () => {
    void localLabLoadProtocolRecipe();
  });
  localLabProtocolStepButton?.addEventListener("click", () => {
    void localLabMarkProtocolStep();
  });
  localLabProtocolRefreshButton?.addEventListener("click", () => {
    void localLabRefreshProtocolRun();
  });
  localLabMailboxSendButton?.addEventListener("click", () => {
    void localLabSendMailboxTransfer();
  });
  localLabMailboxReceiveButton?.addEventListener("click", () => {
    void localLabReceiveMailboxTransfer();
  });
  localLabSyncConnectButton?.addEventListener("click", () => {
    void localLabConnectSharedRegister();
  });
  localLabSyncPushButton?.addEventListener("click", () => {
    void localLabPushSharedRegister();
  });
  localLabSyncPullButton?.addEventListener("click", () => {
    void localLabPullSharedRegister();
  });
  localLabClassroomLinkButton?.addEventListener("click", () => {
    void localLabCopyClassroomLink();
  });
  localLabSyncLiveToggle?.addEventListener("change", () => {
    if (localLabLiveSyncEnabled() && !localLabState.sync.connected) {
      void localLabConnectSharedRegister();
      return;
    }
    localLabUpdateSyncPolling();
  });

  localLabPopulateProtocolRecipeSelect(localLabState.protocolFramework.definitions);
  localLabRenderProtocolSteps(null, localLabProtocolDefinitionFor());
  localLabReset(LOCAL_LAB_DEFAULT_QUBITS);
}

setupLocalMultiQubitLab();

playgroundComponentDefaultsCache = readPlaygroundComponentDefaultsPayload();
playgroundGroupComponentsCache = readPlaygroundGroupComponentsPayload();
documentsState = readDocumentsState();

const plagroundComposer = setupPlagroundComposer();
const documentEditorComposer = setupDocumentEditor();
const editorComposers = [plagroundComposer, documentEditorComposer].filter(
  Boolean,
);

setLayoutEditEnabled(false);

function refreshVisibleEditors() {
  editorComposers.forEach((composer) => {
    composer.handleResize();
  });
  layoutGeneratedSingleGateDials(document);
}

function refreshVisibleEditorsAfterTabSwitch() {
  window.requestAnimationFrame(() => {
    refreshVisibleEditors();
    window.requestAnimationFrame(() => {
      refreshVisibleEditors();
    });
  });
}

function setActiveTab(tabTarget) {
  if (!tabButtons.length || !tabPanels.length) {
    return;
  }

  if (tabTarget === "doc-editor" && workshopEditorMode !== "whats-this") {
    workshopEditorMode = "whats-this";
    document.documentElement.dataset.workshopEditorMode = workshopEditorMode;
    syncWorkshopModeButtons();
  } else if (tabTarget === "local-lab" && workshopEditorMode !== "local-lab") {
    workshopEditorMode = "local-lab";
    document.documentElement.dataset.workshopEditorMode = workshopEditorMode;
    syncWorkshopModeButtons();
  } else if (
    tabTarget === "plaground" &&
    (workshopEditorMode === "whats-this" || workshopEditorMode === "local-lab")
  ) {
    workshopEditorMode = "tab";
    document.documentElement.dataset.workshopEditorMode = workshopEditorMode;
    syncWorkshopModeButtons();
  }

  document.documentElement.dataset.activeTabTarget = tabTarget;
  const isLandingPage = Boolean(generatedLandingPageEntryForTabId(tabTarget));
  document.documentElement.classList.toggle(
    "landing-page-active",
    isLandingPage,
  );

  const previousActiveTarget =
    document.querySelector(".tab-btn.active")?.dataset?.tabTarget || "";
  if (previousActiveTarget === "doc-editor" && tabTarget !== "doc-editor") {
    saveCurrentDocumentEditorScene();
  }

  clearQubitSelection();
  clearSelectedGeneratedLayoutItem();

  tabButtons.forEach((button) => {
    const isActive = button.dataset.tabTarget === tabTarget;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-selected", isActive ? "true" : "false");
    button.tabIndex = isActive ? 0 : -1;
  });

  tabPanels.forEach((panel) => {
    const isActive = panel.id === `panel-${tabTarget}`;
    panel.hidden = !isActive;
    panel.classList.toggle("active", isActive);
    if (isActive) {
      window.requestAnimationFrame(() => {
        syncGeneratedLayoutCanvasScales(panel);
        layoutGeneratedSingleGateDials(panel);
      });
    }
  });

  setLayoutEditEnabled(tabTarget === "plaground" || tabTarget === "doc-editor");
  if (tabTarget === "doc-editor") {
    const targets = collectPlaygroundSaveTargets();
    const targetIds = new Set(targets.map((target) => target.id));
    const preferredTabId = targetIds.has(previousActiveTarget)
      ? previousActiveTarget
      : targetIds.has(documentEditorState.tabId)
        ? documentEditorState.tabId
        : targets.length === 1
          ? targets[0].id
          : "";
    if (preferredTabId) {
      openDocumentEditorForTab(preferredTabId);
    } else {
      refreshDocumentEditorTabSelect("");
      updateDocEditorButtons();
    }
  } else {
    refreshGeneratedDocumentToolbarForTabId(tabTarget);
  }
  maybeAutoJoinEntanglementThreeRoom(tabTarget);
  refreshVisibleEditorsAfterTabSwitch();
}

document.documentElement.dataset.workshopEditorMode = workshopEditorMode;
syncWorkshopModeButtons();
workshopModeButtons.forEach((button) => {
  if (!(button instanceof HTMLButtonElement)) {
    return;
  }
  button.addEventListener("click", () => {
    setWorkshopEditorMode(button.dataset.workshopMode || "tab");
  });
});
if (workshopPasswordForm instanceof HTMLFormElement) {
  workshopPasswordForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const password =
      workshopPasswordInput instanceof HTMLInputElement
        ? workshopPasswordInput.value.trim()
        : "";
    if (password === WORKSHOP_PASSWORD) {
      unlockWorkshop();
      return;
    }
    if (workshopPasswordStatus instanceof HTMLElement) {
      workshopPasswordStatus.textContent = "Try again";
    }
    if (workshopPasswordInput instanceof HTMLInputElement) {
      workshopPasswordInput.select();
      workshopPasswordInput.focus();
    }
  });
}
workshopPasswordCancelButton?.addEventListener("click", () => {
  closeWorkshopPasswordDialog();
});
workshopPasswordOverlay?.addEventListener("click", (event) => {
  if (event.target === workshopPasswordOverlay) {
    closeWorkshopPasswordDialog();
  }
});
window.addEventListener("keydown", (event) => {
  if (
    event.key === "Escape" &&
    workshopPasswordOverlay instanceof HTMLElement &&
    !workshopPasswordOverlay.hidden
  ) {
    closeWorkshopPasswordDialog();
  }
});
tabButtons.forEach((button) => registerTabButton(button));
restoreGeneratedTabs();
plagroundComposer?.handleGeneratedTabsChanged?.();
documentEditorComposer?.handleGeneratedTabsChanged?.();

window.addEventListener("resize", () => {
  syncGeneratedLayoutCanvasScales();
  refreshVisibleEditors();
});

function initialLocalTabTarget() {
  if (localLabMailboxTokenFromLocation()) {
    return "local-lab";
  }
  const hashTarget = window.location.hash.replace(/^#/, "");
  if (hashTarget && document.getElementById(`panel-${hashTarget}`)) {
    return hashTarget;
  }
  const introductionEntry = (generatedTabsState.tabs || []).find(
    (entry) => isGeneratedLandingPageTab(entry),
  );
  return introductionEntry?.id || "plaground";
}

setActiveTab(initialLocalTabTarget());
mailboxRoomStartBootCleanup();
localLabHandleMailboxRoute();
window.addEventListener("storage", (event) => {
  if (event.key === MAILBOX_LOCAL_ROOM_EVENTS_STORAGE_KEY) {
    mailboxRoomReceivePendingLocalQubits();
  }
});
window.setInterval(() => {
  mailboxRoomReceivePendingLocalQubits();
}, 750);

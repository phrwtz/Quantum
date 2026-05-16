const tabButtons = Array.from(document.querySelectorAll(".tab-btn"));
const tabPanels = Array.from(document.querySelectorAll(".tab-panel"));
const simulatorTemplate = document.getElementById("simulatorTemplate");
const twoQubitPairTemplate = document.getElementById("twoQubitPairTemplate");
const entanglementGateTemplate = document.getElementById("entanglementGateTemplate");
const pairMeasurementToolTemplate = document.getElementById("pairMeasurementToolTemplate");
const cnotGateTemplate = document.getElementById("cnotGateTemplate");
const oneQubitHost = document.getElementById("oneQubitHost");
const twoQubitsHost = document.getElementById("twoQubitsHost");
const entanglementHost = document.getElementById("entanglementHost");
const playgroundCanvas = document.getElementById("playgroundCanvas");
const playgroundComponentSelect = document.getElementById("playgroundComponentSelect");
const playgroundSnapToggle = document.getElementById("playgroundSnapToggle");
const playgroundDuplicateButton = document.getElementById("playgroundDuplicateButton");
const playgroundDeleteButton = document.getElementById("playgroundDeleteButton");
const playgroundSaveComponentButton = document.getElementById("playgroundSaveComponentButton");
const playgroundSaveButton = document.getElementById("playgroundSaveButton");
const playgroundSaveAsButton = document.getElementById("playgroundSaveAsButton");
const playgroundLoadButton = document.getElementById("playgroundLoadButton");
const playgroundStatus = document.getElementById("playgroundStatus");
const editorTargetTabSelect = document.getElementById("editorTargetTabSelect");
const editorNewTabName = document.getElementById("editorNewTabName");
const editorOpenTabButton = document.getElementById("editorOpenTabButton");
const editorNewTabButton = document.getElementById("editorNewTabButton");
const editorRenameTabButton = document.getElementById("editorRenameTabButton");
const editorDeleteTabButton = document.getElementById("editorDeleteTabButton");
const layoutEditToggle = document.getElementById("layoutEditToggle");
const layoutSaveButton = document.getElementById("layoutSaveButton");
const layoutResetButton = document.getElementById("layoutResetButton");
const tabStrip = document.querySelector(".tab-strip");

const STEP_DEG = 30;
const SNAP_OVERLAP_THRESHOLD = 0.9;
const MEASUREMENT_OVERLAP_THRESHOLD = 0.3;
const QUBIT_START_EDGE_GAP = 20;
const TWO_QUBIT_START_SHIFT_PX = 50;
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
const ONE_QUBIT_MEASUREMENT_TOOL_SHIFT_Y = 45;
const TWO_QUBIT_WIDE_LENS_VISUAL_CENTER_OFFSET_Y = -34;
const TWO_QUBIT_INNER_BOX_EXTRA_BOTTOM_PX = 120;
const CNOT_FUNNEL_OVERLAP_THRESHOLD = 0.5;
const TWO_QUBIT_MEASUREMENT_SLOT_SHIFT_X = -89;
const TWO_QUBIT_MEASUREMENT_SLOT_SHIFT_Y = -42;
const QUBIT_PLACEMENTS_TAB_LABEL = "qubit placements";
const ENTANGLEMENT_RETURN_TARGETS_STORAGE_KEY = "quantum_entanglement_return_targets_v1";

const ONE_QUBIT_GATE_OPTIONS = [
  { label: "Blue", buttonIndex: 0, hsv: { h: 219.0, s: 84.6, v: 96.9 } },
  { label: "Bluish Purple", buttonIndex: 1, hsv: { h: 279.4, s: 100.0, v: 99.6 } },
  { label: "Purple", buttonIndex: 2, hsv: { h: 289.2, s: 100.0, v: 98.0 } },
  { label: "Reddish Purple", buttonIndex: 3, hsv: { h: 312.3, s: 98.8, v: 96.5 } },
  { label: "Red", buttonIndex: 4, hsv: { h: 359.3, s: 76.0, v: 88.2 } },
];

// One-qubit gate model by button position.
// Button 0: P(0)=1, button 1: P(0)=3/4, button 2: P(0)=1/2, button 3: P(0)=1/4, button 4: P(0)=0
const ONE_QUBIT_BUTTON_BLUE_PROBABILITIES = [1, 3 / 4, 1 / 2, 1 / 4, 0];
const DEFAULT_GATE_BUTTON_INDEX = Math.floor(ONE_QUBIT_BUTTON_BLUE_PROBABILITIES.length / 2);
const DEFAULT_SINGLE_GATE_TICK_INDEX = 3;
const ENT_TOP_DEFAULT_GATE_TICK_INDEX = 6;
const ENT_BOTTOM_DEFAULT_GATE_TICK_INDEX = 0;
const LAYOUT_STORAGE_KEY = "quantum_layout_editor_v1";
const PLAYGROUND_LAYOUT_STORAGE_KEY = "quantum_plaground_layout_v1";
const PLAYGROUND_COMPONENT_DEFAULTS_STORAGE_KEY = "quantum_playground_component_defaults_v1";
const GENERATED_TABS_STORAGE_KEY = "quantum_generated_tabs_v1";
const PLAYGROUND_GRID_SIZE = 26;
const PLAYGROUND_COMPONENT_LIBRARY = {
  qubit: { label: "Qubit", width: 72, height: 72 },
  "single-gate": { label: "Single Qubit Gate", width: 500, height: 240 },
  "cnot-gate": { label: "C-NOT Gate", width: 420, height: 260 },
  "single-measurement": { label: "Single-Qubit Magnifier + Tubes", width: 420, height: 500 },
  "double-measurement": { label: "Double-Qubit Magnifier + Tubes", width: 500, height: 500 },
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
  overrides: {},
  customTabs: [],
};
const generatedSingleGateRuntimes = new Map();
const generatedQubitRuntimes = new Map();
const generatedSingleMeasurementRuntimes = new Map();
const generatedDoubleMeasurementRuntimes = new Map();
const generatedCnotRuntimes = new Map();
let generatedLayoutGesture = null;
let generatedRuntimeDrag = null;

const LAYOUT_EDIT_TARGET_SPECS = [
  { selector: ".qubit", resizable: true, uniform: true, minWidth: 28, minHeight: 28 },
  { selector: ".window-wrap.single-qubit-gate", resizable: true, minWidth: 180, minHeight: 80 },
  { selector: ".cnot-gate, .ent-double-gate", resizable: true, minWidth: 180, minHeight: 120 },
  { selector: ".cnot-input-funnel, .ent-input-funnel", resizable: true, minWidth: 24, minHeight: 40 },
  { selector: ".cnot-porthole, .ent-window", resizable: true, uniform: true, minWidth: 30, minHeight: 30 },
  { selector: ".cnot-output-flange, .ent-output-flange", resizable: true, minWidth: 10, minHeight: 28 },
  { selector: ".magnifier", resizable: true, minWidth: 120, minHeight: 90 },
  { selector: ".pair-magnifier", resizable: true, minWidth: 180, minHeight: 90 },
  { selector: ".tube, .pair-tube", resizable: true, minWidth: 16, minHeight: 50 },
  { selector: ".tube-rack, .pair-tube-rack", resizable: true, minWidth: 140, minHeight: 80 },
  { selector: ".measurement-stage, .pair-measurement, .ent-measurement-block", resizable: true, minWidth: 220, minHeight: 120 },
  { selector: ".tube-capacity, .pair-capacity, .tube-count, .pair-tube-label, .measurement-count", resizable: false },
];

const layoutEditorState = {
  enabled: false,
  activeGesture: null,
  registeredTargets: new WeakSet(),
};
let selectedLayoutTarget = null;
let selectedGeneratedLayoutItem = null;

function mountOneQubitSimulator() {
  if (!simulatorTemplate || !oneQubitHost) {
    return null;
  }

  const fragment = simulatorTemplate.content.cloneNode(true);
  oneQubitHost.appendChild(fragment);
  return oneQubitHost.querySelector(".quantum-sim");
}

function mountTwoQubitPair() {
  if (!twoQubitPairTemplate || !twoQubitsHost) {
    return null;
  }

  const fragment = twoQubitPairTemplate.content.cloneNode(true);
  twoQubitsHost.appendChild(fragment);
  return twoQubitsHost.querySelector(".pair-sim");
}

function mountEntanglementGate(host) {
  if (!entanglementGateTemplate || !host) {
    return null;
  }

  host.innerHTML = "";
  const fragment = entanglementGateTemplate.content.cloneNode(true);
  host.appendChild(fragment);
  return host.querySelector(".ent-gate-sim");
}

function mountPairMeasurementTool(host) {
  if (!pairMeasurementToolTemplate || !host) {
    return null;
  }
  if (host.querySelector('[data-role="pair-lens"]')) {
    applyDoubleMeasurementLayoutSnapshot(
      host,
      playgroundComponentDefaultsCache?.["double-measurement"],
      { includeGroupGeometry: false }
    );
    return host;
  }
  host.innerHTML = "";
  const fragment = pairMeasurementToolTemplate.content.cloneNode(true);
  host.appendChild(fragment);
  applyDoubleMeasurementLayoutSnapshot(
    host,
    playgroundComponentDefaultsCache?.["double-measurement"],
    { includeGroupGeometry: false }
  );
  return host;
}

function createCnotGateElement({ withEntanglementRoles = false } = {}) {
  if (!cnotGateTemplate) {
    return null;
  }
  const fragment = cnotGateTemplate.content.cloneNode(true);
  const root = fragment.firstElementChild;
  if (!(root instanceof HTMLElement)) {
    return null;
  }
  if (withEntanglementRoles) {
    root.dataset.role = "ent-gate";
    const body = root.querySelector('[data-part="body"]');
    const funnelTop = root.querySelector('[data-part="funnel-top"]');
    const funnelBottom = root.querySelector('[data-part="funnel-bottom"]');
    const windowTop = root.querySelector('[data-part="window-top"]');
    const windowBottom = root.querySelector('[data-part="window-bottom"]');
    const platform = root.querySelector('[data-part="platform"]');

    if (body instanceof HTMLElement) {
      body.dataset.role = "ent-pipe";
    }
    if (funnelTop instanceof HTMLElement) {
      funnelTop.dataset.role = "ent-funnel-top";
    }
    if (funnelBottom instanceof HTMLElement) {
      funnelBottom.dataset.role = "ent-funnel-bottom";
    }
    if (windowTop instanceof HTMLElement) {
      windowTop.dataset.role = "ent-window-top";
    }
    if (windowBottom instanceof HTMLElement) {
      windowBottom.dataset.role = "ent-window-bottom";
    }
    if (platform instanceof HTMLElement) {
      platform.dataset.role = "ent-platform";
    }
  }
  return root;
}

function readPlaygroundComponentDefaultsPayload() {
  try {
    const serialized = window.localStorage.getItem(PLAYGROUND_COMPONENT_DEFAULTS_STORAGE_KEY);
    if (!serialized) {
      return {};
    }
    const parsed = JSON.parse(serialized);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch (_error) {
    return {};
  }
}

function writePlaygroundComponentDefaultsPayload(payload) {
  try {
    window.localStorage.setItem(
      PLAYGROUND_COMPONENT_DEFAULTS_STORAGE_KEY,
      JSON.stringify(payload || {})
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

function persistPlaygroundComponentGeometryDefaultsFromElement(type, element, extras = null) {
  if (!type || !(element instanceof HTMLElement)) {
    return false;
  }
  const width = Math.round(element.offsetWidth);
  const height = Math.round(element.offsetHeight);
  if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) {
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
    body: root.querySelector(".cnot-body, .ent-pipe, [data-part='body'], [data-role='ent-pipe']"),
    funnelTop: root.querySelector("[data-part='funnel-top'], .cnot-input-funnel-top, [data-role='ent-funnel-top']"),
    funnelBottom: root.querySelector("[data-part='funnel-bottom'], .cnot-input-funnel-bottom, [data-role='ent-funnel-bottom']"),
    windowTop: root.querySelector("[data-part='window-top'], .cnot-porthole-top, [data-role='ent-window-top']"),
    windowBottom: root.querySelector("[data-part='window-bottom'], .cnot-porthole-bottom, [data-role='ent-window-bottom']"),
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
  if (!(element instanceof HTMLElement) || !snapshot || typeof snapshot !== "object") {
    return;
  }
  const tx = parseLayoutNumeric(snapshot.tx, 0);
  const ty = parseLayoutNumeric(snapshot.ty, 0);
  setLayoutTargetTranslate(element, tx, ty);
  element.style.width = typeof snapshot.width === "string" ? snapshot.width : "";
  element.style.height = typeof snapshot.height === "string" ? snapshot.height : "";
  setLayoutTargetDeleted(element, Boolean(snapshot.deleted));
  setLayoutManualEdited(element, hasMeaningfulLayoutDelta(tx, ty, element.style.width, element.style.height));
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
    options
  );
}

function cloneJson(value) {
  try {
    return JSON.parse(JSON.stringify(value));
  } catch (_error) {
    return null;
  }
}

function normalizeTabLabel(label) {
  return String(label || "").trim().replace(/\s+/g, " ").toLowerCase();
}

function generatedTabSlug(label) {
  const slug = normalizeTabLabel(label)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return slug || "tab";
}

function readGeneratedTabsState() {
  try {
    const serialized = window.localStorage.getItem(GENERATED_TABS_STORAGE_KEY);
    if (!serialized) {
      return { overrides: {}, customTabs: [] };
    }
    const parsed = JSON.parse(serialized);
    return {
      overrides: parsed && typeof parsed.overrides === "object" ? parsed.overrides : {},
      customTabs: Array.isArray(parsed?.customTabs) ? parsed.customTabs : [],
    };
  } catch (_error) {
    return { overrides: {}, customTabs: [] };
  }
}

function extractQubitPlacementTargets(items, canvasWidth, canvasHeight) {
  if (!Array.isArray(items)) {
    return null;
  }
  const safeCanvasWidth = Math.max(1, parseLayoutNumeric(canvasWidth, 520));
  const safeCanvasHeight = Math.max(1, parseLayoutNumeric(canvasHeight, 480));
  const qubitItems = items
    .map((item) => {
      const left = parseLayoutNumeric(item?.left, Number.NaN);
      const top = parseLayoutNumeric(item?.top, Number.NaN);
      const width = Math.max(1, parseLayoutNumeric(item?.width, 72));
      const height = Math.max(1, parseLayoutNumeric(item?.height, 72));
      if (!Number.isFinite(left) || !Number.isFinite(top)) {
        return null;
      }
      return {
        centerX: left + width / 2,
        centerY: top + height / 2,
      };
    })
    .filter(Boolean);

  if (qubitItems.length < 2) {
    return null;
  }

  qubitItems.sort((a, b) => a.centerX - b.centerX);
  const leftQubit = qubitItems[0];
  const rightQubit = qubitItems[1];
  return {
    sourceWidth: safeCanvasWidth,
    sourceHeight: safeCanvasHeight,
    left: {
      x: clamp(leftQubit.centerX, 0, safeCanvasWidth),
      y: clamp(leftQubit.centerY, 0, safeCanvasHeight),
    },
    right: {
      x: clamp(rightQubit.centerX, 0, safeCanvasWidth),
      y: clamp(rightQubit.centerY, 0, safeCanvasHeight),
    },
  };
}

function readQubitPlacementTargetsFromGeneratedTab(label = QUBIT_PLACEMENTS_TAB_LABEL) {
  const normalizedLabel = normalizeTabLabel(label);
  if (!normalizedLabel) {
    return null;
  }
  const sourceState =
    generatedTabsState && typeof generatedTabsState === "object"
      ? generatedTabsState
      : readGeneratedTabsState();
  const customTabs = Array.isArray(sourceState?.customTabs) ? sourceState.customTabs : [];
  const entry = customTabs.find(
    (candidate) => normalizeTabLabel(candidate?.label) === normalizedLabel
  );
  const layout = entry?.layout;
  if (!layout || !Array.isArray(layout.items)) {
    return null;
  }
  const items = layout.items
    .filter((item) => item && item.type === "qubit")
    .map((item) => ({
      left: item.left,
      top: item.top,
      width: item.width,
      height: item.height,
    }));
  return extractQubitPlacementTargets(items, layout.canvasWidth, layout.canvasHeight);
}

function readQubitPlacementTargetsFromRenderedTab(label = QUBIT_PLACEMENTS_TAB_LABEL) {
  const normalizedLabel = normalizeTabLabel(label);
  if (!normalizedLabel) {
    return null;
  }
  const button = tabButtons.find(
    (candidate) => normalizeTabLabel(tabLabelForButton(candidate)) === normalizedLabel
  );
  const targetId = button?.dataset?.tabTarget;
  if (!targetId) {
    return null;
  }
  const panel = document.getElementById(`panel-${targetId}`);
  if (!(panel instanceof HTMLElement)) {
    return null;
  }
  const canvas = panel.querySelector(".generated-layout-canvas");
  if (!(canvas instanceof HTMLElement)) {
    return null;
  }
  const nodes = Array.from(canvas.querySelectorAll('.playground-node[data-component="qubit"]'));
  const items = nodes
    .map((node) => ({
      left: node.style.left,
      top: node.style.top,
      width: node.style.width,
      height: node.style.height,
    }));
  const width = parseLayoutNumeric(canvas.style.width, canvas.clientWidth || 520);
  const height = parseLayoutNumeric(canvas.style.height, canvas.clientHeight || 480);
  return extractQubitPlacementTargets(items, width, height);
}

function normalizeEntanglementReturnTargets(targets) {
  if (!targets || typeof targets !== "object") {
    return null;
  }
  const left = targets.left;
  const right = targets.right;
  if (!left || !right || typeof left !== "object" || typeof right !== "object") {
    return null;
  }
  const sourceWidth = Number.parseFloat(targets.sourceWidth);
  const sourceHeight = Number.parseFloat(targets.sourceHeight);
  const leftX = Number.parseFloat(left.x);
  const leftY = Number.parseFloat(left.y);
  const rightX = Number.parseFloat(right.x);
  const rightY = Number.parseFloat(right.y);
  if (![sourceWidth, sourceHeight, leftX, leftY, rightX, rightY].every(Number.isFinite)) {
    return null;
  }
  const safeSourceWidth = Math.max(1, sourceWidth);
  const safeSourceHeight = Math.max(1, sourceHeight);
  return {
    sourceWidth: safeSourceWidth,
    sourceHeight: safeSourceHeight,
    left: {
      x: clamp(leftX, 0, safeSourceWidth),
      y: clamp(leftY, 0, safeSourceHeight),
    },
    right: {
      x: clamp(rightX, 0, safeSourceWidth),
      y: clamp(rightY, 0, safeSourceHeight),
    },
  };
}

function readPersistedEntanglementReturnTargets() {
  try {
    const serialized = window.localStorage.getItem(ENTANGLEMENT_RETURN_TARGETS_STORAGE_KEY);
    if (!serialized) {
      return null;
    }
    return normalizeEntanglementReturnTargets(JSON.parse(serialized));
  } catch (_error) {
    return null;
  }
}

function writePersistedEntanglementReturnTargets(targets) {
  const normalized = normalizeEntanglementReturnTargets(targets);
  if (!normalized) {
    return false;
  }
  try {
    window.localStorage.setItem(
      ENTANGLEMENT_RETURN_TARGETS_STORAGE_KEY,
      JSON.stringify(normalized)
    );
    return true;
  } catch (_error) {
    return false;
  }
}

function clearPersistedEntanglementReturnTargets() {
  try {
    window.localStorage.removeItem(ENTANGLEMENT_RETURN_TARGETS_STORAGE_KEY);
  } catch (_error) {
    // Ignore storage failures.
  }
}

function seedEntanglementReturnTargetsFromPlacementsTab() {
  const rendered = readQubitPlacementTargetsFromRenderedTab(QUBIT_PLACEMENTS_TAB_LABEL);
  if (rendered) {
    writePersistedEntanglementReturnTargets(rendered);
    return rendered;
  }
  const seeded = readQubitPlacementTargetsFromGeneratedTab(QUBIT_PLACEMENTS_TAB_LABEL);
  if (seeded) {
    writePersistedEntanglementReturnTargets(seeded);
    return seeded;
  }
  return readPersistedEntanglementReturnTargets();
}

function placementReturnCentersForCanvas(canvas, leftQubitItem, rightQubitItem) {
  if (!(canvas instanceof HTMLElement)) {
    return null;
  }
  const placements =
    seedEntanglementReturnTargetsFromPlacementsTab() || readPersistedEntanglementReturnTargets();
  if (!placements?.left || !placements?.right) {
    return null;
  }

  const leftQubitRect = leftQubitItem?.getBoundingClientRect?.();
  const rightQubitRect = rightQubitItem?.getBoundingClientRect?.();
  if (!leftQubitRect || !rightQubitRect) {
    return null;
  }
  const leftRadius = leftQubitRect.width / 2;
  const rightRadius = rightQubitRect.width / 2;
  const width = Math.max(1, canvas.clientWidth);
  const height = Math.max(1, canvas.clientHeight);

  const leftX = Number.parseFloat(placements.left.x);
  const leftY = Number.parseFloat(placements.left.y);
  const rightX = Number.parseFloat(placements.right.x);
  const rightY = Number.parseFloat(placements.right.y);
  if (![leftX, leftY, rightX, rightY].every(Number.isFinite)) {
    return null;
  }

  return {
    left: {
      x: clamp(leftX, leftRadius, Math.max(leftRadius, width - leftRadius)),
      y: clamp(leftY, leftRadius, Math.max(leftRadius, height - leftRadius)),
    },
    right: {
      x: clamp(rightX, rightRadius, Math.max(rightRadius, width - rightRadius)),
      y: clamp(rightY, rightRadius, Math.max(rightRadius, height - rightRadius)),
    },
  };
}

function writeGeneratedTabsState(state) {
  try {
    window.localStorage.setItem(GENERATED_TABS_STORAGE_KEY, JSON.stringify(state));
    return true;
  } catch (_error) {
    return false;
  }
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

function isMeasurementComponentType(type) {
  return type === "single-measurement" || type === "double-measurement";
}

function applyMeasurementLayoutSnapshot(item, measurementLayout, specs, options = {}) {
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
    if (measurementLayout.group.inlineStyle && typeof measurementLayout.group.inlineStyle === "object") {
      Object.entries(measurementLayout.group.inlineStyle).forEach(([property, value]) => {
        if (typeof value === "string") {
          item.style[property] = value;
        }
      });
    }
  }
  specs.forEach((spec) => {
    const element = item.querySelector(spec.selector);
    const snapshot = savedParts[spec.key];
    if (!(element instanceof HTMLElement) || !snapshot || typeof snapshot !== "object") {
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

function applySingleMeasurementLayoutSnapshot(item, measurementLayout, options = {}) {
  applyMeasurementLayoutSnapshot(
    item,
    measurementLayout,
    PLAYGROUND_SINGLE_MEASUREMENT_PART_SPECS,
    options
  );
}

function applyDoubleMeasurementLayoutSnapshot(item, measurementLayout, options = {}) {
  applyMeasurementLayoutSnapshot(
    item,
    measurementLayout,
    PLAYGROUND_DOUBLE_MEASUREMENT_PART_SPECS,
    options
  );
}

function captureMeasurementLayoutSnapshot(item, specs, options = {}) {
  if (!(item instanceof HTMLElement) || !Array.isArray(specs) || specs.length === 0) {
    return null;
  }
  const includeGroup = options.includeGroup === true;
  const captureAll = options.captureAll === true;
  const snapshot = {};
  const parts = {};
  if (includeGroup) {
    const groupState = snapshotLayoutEditableElement(item);
    const groupInlineStyle = snapshotInlineStyleSubset(item, ["left", "top", "right", "bottom"]);
    if (
      groupState &&
      (captureAll ||
        hasMeaningfulLayoutDelta(groupState.tx, groupState.ty, groupState.width, groupState.height) ||
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
    const inlineStyle = snapshotInlineStyleSubset(element, ["left", "top", "right", "bottom"]);
    if (
      state &&
      (captureAll ||
        hasMeaningfulLayoutDelta(state.tx, state.ty, state.width, state.height) ||
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
    playgroundCanvas.querySelectorAll(".playground-node[data-component='cnot-gate']")
  );
  if (cnotNodes.length === 0) {
    return null;
  }
  const editedNode = cnotNodes.find(
    (node) =>
      node.dataset.layoutManual === "true" ||
      node.querySelector("[data-layout-manual='true']")
  );
  return editedNode || cnotNodes[cnotNodes.length - 1];
}

function findPlaygroundComponentPrototypeSource(type) {
  if (!playgroundCanvas || !type) {
    return null;
  }
  const nodes = Array.from(
    playgroundCanvas.querySelectorAll(`.playground-node[data-component='${type}']`)
  );
  if (nodes.length === 0) {
    return null;
  }
  const editedNode = nodes.find(
    (node) =>
      node.dataset.layoutManual === "true" ||
      node.querySelector("[data-layout-manual='true']")
  );
  return editedNode || nodes[nodes.length - 1];
}

function persistPlaygroundCnotDefaultsFromDom(sourceOverride = null) {
  const source = sourceOverride instanceof HTMLElement
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
  return saved;
}

function persistPlaygroundMeasurementDefaultsFromDom(type, sourceOverride = null) {
  if (!isMeasurementComponentType(type)) {
    return false;
  }
  const source = sourceOverride instanceof HTMLElement
    ? sourceOverride
    : findPlaygroundComponentPrototypeSource(type);
  if (!(source instanceof HTMLElement)) {
    return false;
  }
  const snapshot = captureMeasurementLayoutSnapshot(
    source,
    measurementPartSpecsForType(type),
    { includeGroup: true, captureAll: true }
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
  return saved;
}

function persistPrimaryTwoQubitMeasurementDefaultsFromDom() {
  const primary = getPrimaryTwoQubitMeasurementGroup();
  if (!primary?.measurementGroup) {
    return false;
  }
  const snapshot = captureMeasurementLayoutSnapshot(
    primary.measurementGroup,
    PLAYGROUND_DOUBLE_MEASUREMENT_PART_SPECS,
    { includeGroup: true, captureAll: true }
  );
  if (!snapshot) {
    return false;
  }
  const payload = readPlaygroundComponentDefaultsPayload();
  payload["double-measurement"] = snapshot;
  const saved = writePlaygroundComponentDefaultsPayload(payload);
  if (saved) {
    playgroundComponentDefaultsCache = payload;
  }
  return saved;
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
    const measurementSaved = persistPlaygroundMeasurementDefaultsFromDom(type, source);
    savedAny = measurementSaved || savedAny;
  });
  return savedAny;
}

function normalizeCnotGateElement(root, { withEntanglementRoles = false } = {}) {
  if (!(root instanceof HTMLElement)) {
    return root;
  }

  root.classList.add("cnot-gate", "ent-double-gate");

  const resolveBody = () =>
    root.querySelector(".cnot-body, .ent-pipe, [data-part='body'], [data-role='ent-pipe']");
  const resolveFunnels = () =>
    root.querySelectorAll(".cnot-input-funnel, .ent-input-funnel, [data-role='ent-funnel-top'], [data-role='ent-funnel-bottom']");
  const resolvePortholes = () =>
    root.querySelectorAll(".cnot-porthole, .ent-window, [data-role='ent-window-top'], [data-role='ent-window-bottom']");
  const resolveFlanges = () =>
    root.querySelectorAll(".cnot-output-flange, .ent-output-flange");

  const needsRebuild = !resolveBody() || resolveFunnels().length < 2 || resolvePortholes().length < 2 || resolveFlanges().length < 2;
  if (needsRebuild) {
    const fresh = createCnotGateElement({ withEntanglementRoles: false });
    if (fresh instanceof HTMLElement) {
      root.replaceChildren(...Array.from(fresh.childNodes));
    }
  }

  const body = root.querySelector(".cnot-body, .ent-pipe, [data-part='body'], [data-role='ent-pipe']");
  if (body instanceof HTMLElement) {
    body.classList.add("cnot-body", "ent-pipe");
    body.dataset.part = "body";
    if (withEntanglementRoles) {
      body.dataset.role = "ent-pipe";
    }
  }

  const funnels = Array.from(root.querySelectorAll(".cnot-input-funnel, .ent-input-funnel, [data-role='ent-funnel-top'], [data-role='ent-funnel-bottom']")).slice(0, 2);
  funnels.forEach((funnel, index) => {
    if (!(funnel instanceof HTMLElement)) {
      return;
    }
    funnel.classList.add("cnot-input-funnel");
    funnel.dataset.part = index === 0 ? "funnel-top" : "funnel-bottom";
    funnel.classList.toggle("cnot-input-funnel-top", index === 0);
    funnel.classList.toggle("cnot-input-funnel-bottom", index === 1);
    if (withEntanglementRoles) {
      funnel.dataset.role = index === 0 ? "ent-funnel-top" : "ent-funnel-bottom";
    }
  });

  const portholes = Array.from(root.querySelectorAll(".cnot-porthole, .ent-window, [data-role='ent-window-top'], [data-role='ent-window-bottom']")).slice(0, 2);
  portholes.forEach((porthole, index) => {
    if (!(porthole instanceof HTMLElement)) {
      return;
    }
    porthole.classList.add("cnot-porthole");
    porthole.dataset.part = index === 0 ? "window-top" : "window-bottom";
    porthole.classList.toggle("cnot-porthole-top", index === 0);
    porthole.classList.toggle("cnot-porthole-bottom", index === 1);
    if (withEntanglementRoles) {
      porthole.dataset.role = index === 0 ? "ent-window-top" : "ent-window-bottom";
    }
  });

  const flanges = Array.from(root.querySelectorAll(".cnot-output-flange, .ent-output-flange")).slice(0, 2);
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
    if (withEntanglementRoles && index === 0) {
      spring.dataset.role = "ent-platform";
    } else if (spring.dataset.role === "ent-platform") {
      delete spring.dataset.role;
    }
  });

  if (withEntanglementRoles) {
    root.dataset.role = "ent-gate";
  }
  normalizeCnotBodyFill(root);
  return root;
}

function isCnotGateRoot(element) {
  return (
    element instanceof HTMLElement &&
    (element.classList.contains("cnot-gate") ||
      element.classList.contains("ent-double-gate"))
  );
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
    ".ent-window",
    ".cnot-porthole-top",
    ".cnot-porthole-bottom",
    ".cnot-output-flange-top",
    ".cnot-output-flange-bottom",
    ".cnot-spring-top",
    ".cnot-spring-bottom",
  ];
  const trackedProperties = ["left", "right", "top", "bottom", "width", "height"];
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
  if (!Number.isFinite(nextWidth) || !Number.isFinite(nextHeight) || nextWidth <= 0 || nextHeight <= 0) {
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
    if (
      (element.classList.contains("cnot-body") || element.classList.contains("ent-pipe")) &&
      !isCnotBodyManuallySized(element)
    ) {
      return;
    }
    const hasHorizontalAnchors =
      Number.isFinite(snapshot.left) && Number.isFinite(snapshot.right);
    const hasVerticalAnchors =
      Number.isFinite(snapshot.top) && Number.isFinite(snapshot.bottom);
    const isPorthole =
      element.classList.contains("cnot-porthole") ||
      element.classList.contains("ent-window");
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
      const trackedRects = [parts.funnelTop, parts.funnelBottom, parts.body, parts.flangeTop, parts.flangeBottom]
        .filter((element) => element instanceof HTMLElement)
        .map((element) => element.getBoundingClientRect());
      if (trackedRects.length > 0) {
        const minX = Math.min(...trackedRects.map((rect) => rect.left - rootRect.left));
        const maxX = Math.max(...trackedRects.map((rect) => rect.right - rootRect.left));
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
            const funnelLeft = parsePixelValue(window.getComputedStyle(funnel).left);
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
    (body.dataset.layoutManual === "true" || Boolean(body.style.width || body.style.height))
  );
}

function cnotBodySnapshotHasExplicitGeometry(state) {
  if (!state || typeof state !== "object") {
    return false;
  }
  const inlineStyle =
    state.inlineStyle && typeof state.inlineStyle === "object" ? state.inlineStyle : {};
  return Boolean(
    state.width ||
      state.height ||
      inlineStyle.width ||
      inlineStyle.height ||
      Math.abs(parseLayoutNumeric(state.tx, 0)) > 0.01 ||
      Math.abs(parseLayoutNumeric(state.ty, 0)) > 0.01
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
  const root = body.closest(".cnot-gate, .ent-double-gate");
  if (!(root instanceof HTMLElement)) {
    return;
  }
  const rootRect = root.getBoundingClientRect();
  const bodyRect = body.getBoundingClientRect();
  if (!rootRect.width || !rootRect.height || !bodyRect.width || !bodyRect.height) {
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

function mountEntanglementCnotGate(root) {
  const host = root.querySelector('[data-role="ent-cnot-host"]');
  if (!(host instanceof HTMLElement)) {
    return null;
  }
  if (!host.querySelector('[data-role="ent-pipe"]')) {
    const cnotGate = createCnotGateElement({ withEntanglementRoles: true });
    if (cnotGate) {
      host.replaceChildren(cnotGate);
    }
  }
  const cnot = host.querySelector(".cnot-gate, .ent-double-gate");
  return normalizeCnotGateElement(cnot, { withEntanglementRoles: true });
}

function mountPairCnotGate(root) {
  const host = root.querySelector('[data-role="pair-cnot-host"]');
  if (!(host instanceof HTMLElement)) {
    return null;
  }
  if (!host.querySelector(".cnot-gate, .ent-double-gate")) {
    const cnotGate = createCnotGateElement();
    if (cnotGate) {
      cnotGate.classList.add("pair-cnot-gate");
      host.replaceChildren(cnotGate);
    }
  }
  const cnot = host.querySelector(".cnot-gate, .ent-double-gate");
  return normalizeCnotGateElement(cnot);
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
    "ent-hidden",
    "ent-appearing",
    "collapse-animating",
    "measurement-pellet",
    "qubit-selected",
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

function createPlaygroundComponentNode(type, sourceRoots) {
  const { oneQubitRoot, twoQubitPairRoot } = sourceRoots;

  let node = null;
  if (type === "qubit") {
    node = clonePlaygroundSourceElement(oneQubitRoot?.querySelector(".qubit"));
  } else if (type === "single-gate") {
    node = clonePlaygroundSourceElement(oneQubitRoot?.querySelector(".window-wrap.single-qubit-gate"));
  } else if (type === "cnot-gate") {
    node = createCnotGateElement();
  } else if (type === "single-measurement") {
    node = clonePlaygroundSourceElement(oneQubitRoot?.querySelector(".measurement-stage"));
  } else if (type === "double-measurement") {
    node = document.createElement("section");
    node.className = "pair-measurement";
    node.dataset.role = "pair-measurement-host";
    node.setAttribute("aria-label", "Two qubit measurement tool");
    mountPairMeasurementTool(node);
    if (!node.querySelector('[data-role="pair-lens"]')) {
      node = clonePlaygroundSourceElement(twoQubitPairRoot?.querySelector(".pair-measurement"));
    }
  }

  if (!node) {
    return createPlaygroundFallback(PLAYGROUND_COMPONENT_LIBRARY[type]?.label || "Component");
  }

  sanitizePlaygroundComponentNode(node, { preserveInlineStyles: type === "single-gate" });
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
  }
  return node;
}

function minGeneratedLayoutSizeForType(type) {
  if (type === "qubit") {
    return { minWidth: 12, minHeight: 12 };
  }
  return { minWidth: 120, minHeight: 100 };
}

function isGeneratedLayoutCanvas(element) {
  return element instanceof HTMLElement && element.classList.contains("generated-layout-canvas");
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
  return isGeneratedLayoutItem(item) && item.dataset.component === "single-gate";
}

function isGeneratedSingleMeasurementItem(item) {
  return isGeneratedLayoutItem(item) && item.dataset.component === "single-measurement";
}

function isGeneratedDoubleMeasurementItem(item) {
  return isGeneratedLayoutItem(item) && item.dataset.component === "double-measurement";
}

function isGeneratedCnotItem(item) {
  return isGeneratedLayoutItem(item) && item.dataset.component === "cnot-gate";
}

function activeGeneratedLayoutCanvas() {
  const panel = document.querySelector('[data-generated-layout-panel="true"]:not([hidden])');
  if (!(panel instanceof HTMLElement)) {
    return null;
  }
  const canvas = panel.querySelector(".generated-layout-canvas");
  return canvas instanceof HTMLElement ? canvas : null;
}

function generatedCanvasForItem(item) {
  if (!(item instanceof HTMLElement)) {
    return null;
  }
  const canvas = item.closest(".generated-layout-canvas");
  return canvas instanceof HTMLElement ? canvas : null;
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
  const duplicateButton = toolbar.querySelector('[data-generated-editor-action="duplicate"]');
  const deleteButton = toolbar.querySelector('[data-generated-editor-action="delete"]');
  [duplicateButton, deleteButton].forEach((button) => {
    if (button instanceof HTMLButtonElement) {
      button.disabled = !selectedOnCanvas;
    }
  });
}

function clearSelectedGeneratedLayoutItem() {
  if (selectedGeneratedLayoutItem) {
    selectedGeneratedLayoutItem.classList.remove("selected");
  }
  selectedGeneratedLayoutItem = null;
  updateGeneratedEditorButtons();
}

function setSelectedGeneratedLayoutItem(item) {
  if (!(item instanceof HTMLElement) || !isGeneratedLayoutItem(item) || !item.isConnected) {
    clearSelectedGeneratedLayoutItem();
    return;
  }
  if (selectedGeneratedLayoutItem && selectedGeneratedLayoutItem !== item) {
    selectedGeneratedLayoutItem.classList.remove("selected");
  }
  selectedGeneratedLayoutItem = item;
  if (layoutEditorState.enabled) {
    selectedGeneratedLayoutItem.classList.add("selected");
  } else {
    selectedGeneratedLayoutItem.classList.remove("selected");
  }
  updateGeneratedEditorButtons(generatedCanvasForItem(item));
}

function getGeneratedQubitCore(item) {
  if (!isGeneratedQubitItem(item)) {
    return null;
  }
  const core = item.querySelector(".playground-qubit-core");
  return core instanceof HTMLElement ? core : item;
}

function waitForDuration(duration) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, duration);
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
    generatedCnotRuntimes,
  ].forEach(
    (runtimeMap) => {
      Array.from(runtimeMap.keys()).forEach((item) => {
        if (!item.isConnected) {
          runtimeMap.delete(item);
        }
      });
    }
  );
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
      vector: [1, 0],
      transiting: false,
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
  const canvasRect = canvas.getBoundingClientRect();
  const rect = element.getBoundingClientRect();
  return {
    x: rect.left - canvasRect.left + canvas.scrollLeft + rect.width / 2,
    y: rect.top - canvasRect.top + canvas.scrollTop + rect.height / 2,
  };
}

function generatedViewportPointToCanvasPoint(canvas, x, y) {
  const canvasRect = canvas.getBoundingClientRect();
  return {
    x: x - canvasRect.left + canvas.scrollLeft,
    y: y - canvasRect.top + canvas.scrollTop,
  };
}

function setGeneratedQubitCenter(canvas, qubitItem, x, y) {
  const safeX = Number.isFinite(x) ? x : canvas.clientWidth / 2;
  const safeY = Number.isFinite(y) ? y : canvas.clientHeight / 2;
  const nextLeft = safeX - qubitItem.offsetWidth / 2;
  const nextTop = safeY - qubitItem.offsetHeight / 2;
  const clamped = generatedLayoutClampItemPosition(canvas, qubitItem, nextLeft, nextTop);
  qubitItem.style.left = `${Math.round(clamped.left)}px`;
  qubitItem.style.top = `${Math.round(clamped.top)}px`;
}

function generatedQubitOverlapRatioWithRect(qubitItem, target) {
  const qubitRect = qubitItem.getBoundingClientRect();
  const targetRect = target.getBoundingClientRect();
  const overlapWidth = Math.max(
    0,
    Math.min(qubitRect.right, targetRect.right) - Math.max(qubitRect.left, targetRect.left)
  );
  const overlapHeight = Math.max(
    0,
    Math.min(qubitRect.bottom, targetRect.bottom) - Math.max(qubitRect.top, targetRect.top)
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
  const alpha = Math.acos((distance * distance + a1 - a2) / (2 * distance * r1));
  const beta = Math.acos((distance * distance + a2 - a1) / (2 * distance * r2));

  return (
    a1 * alpha +
    a2 * beta -
    0.5 *
      Math.sqrt(
        (-distance + r1 + r2) *
          (distance + r1 - r2) *
          (distance - r1 + r2) *
          (distance + r1 + r2)
      )
  );
}

function prepareGeneratedMeasurementParts(item) {
  if (!(item instanceof HTMLElement) || !isMeasurementComponentType(item.dataset.component)) {
    return;
  }
  measurementPartSpecsForType(item.dataset.component).forEach((spec) => {
    const element = item.querySelector(spec.selector);
    if (!(element instanceof HTMLElement)) {
      return;
    }
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
  item.dataset.layoutEditTarget = "true";
  item.dataset.layoutResizable = "true";
  item.dataset.layoutUniformResize = item.dataset.component === "qubit" ? "true" : "false";
  const minSize = minGeneratedLayoutSizeForType(item.dataset.component);
  item.dataset.layoutMinWidth = `${minSize.minWidth}`;
  item.dataset.layoutMinHeight = `${minSize.minHeight}`;
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
  if (!(item instanceof HTMLElement) || item.dataset.component !== "single-gate") {
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
  };
  runtime.dial = createSingleQubitGateDial({
    ticksWrap,
    arrow: gateArrow,
    initialTick: activeTick,
    tickAriaLabelPrefix: "Tick",
    orbitInset: 10,
    canInteract: () => !layoutEditorState.enabled && !runtime.busy,
    onTickChange: (tick) => {
      runtime.activeTick = normalizeTickIndex(tick);
    },
  });
  runtime.activeTick = runtime.dial?.getTick() ?? runtime.activeTick;
  runtime.dial?.layout();
  alignGeneratedGateSpring(runtime);
  gateArrow.addEventListener("mousedown", (event) => runtime.dial?.beginDrag(event));
  gateArrow.addEventListener(
    "touchstart",
    (event) => runtime.dial?.beginDrag(event),
    { passive: false }
  );
  gateArrow.addEventListener("keydown", (event) => runtime.dial?.handleKeydown(event));
  generatedSingleGateRuntimes.set(item, runtime);
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
  updateGeneratedMeasurementTubeFills(runtime);
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
    runtime.capacityElement.textContent = `The testtubes can each hold ${runtime.tubePairCapacity} qubit pairs.`;
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

function clearGeneratedDoubleMeasurementApparatus(runtime) {
  if (!runtime) {
    return;
  }
  runtime.tubePairCapacity = INITIAL_TUBE_QUBIT_CAPACITY;
  ["bb", "br", "rb", "rr"].forEach((key) => {
    runtime.tubeCounts[key] = 0;
  });
  updateGeneratedDoubleMeasurementTubeFills(runtime);
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
  const measurementFunnel = item.querySelector('[data-role="pair-measurement-funnel"]');
  const slotLeft = item.querySelector('[data-role="pair-slot-left"]');
  const slotRight = item.querySelector('[data-role="pair-slot-right"]');
  const platform = item.querySelector(".pair-measurement-platform");
  const capacity = item.querySelector('[data-role="pair-capacity"]');
  const measurementCount = item.querySelector('[data-role="pair-measurement-count"]');
  const columns = Array.from(item.querySelectorAll(".pair-tube-column[data-key]"));
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
    if (tube instanceof HTMLElement && liquid instanceof HTMLElement && count instanceof HTMLElement) {
      tubeElements[key] = tube;
      liquidElements[key] = liquid;
      countElements[key] = count;
    }
  });
  const requiredKeys = ["bb", "br", "rb", "rr"];
  if (!requiredKeys.every((key) => tubeElements[key] && liquidElements[key] && countElements[key])) {
    return null;
  }

  const runtime = {
    item,
    measurementTool,
    measurementFunnel,
    slotLeft,
    slotRight,
    platform,
    measurementCount: measurementCount instanceof HTMLSelectElement ? measurementCount : null,
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
    autoRunInProgress: false,
    automationStartPoints: null,
    cyclePromise: null,
  };
  updateGeneratedDoubleMeasurementTubeFills(runtime);
  if (runtime.measurementCount) {
    runtime.measurementCount.addEventListener("mousedown", (event) => event.stopPropagation());
    runtime.measurementCount.addEventListener("touchstart", (event) => event.stopPropagation());
    runtime.measurementCount.addEventListener("click", (event) => event.stopPropagation());
    runtime.measurementCount.addEventListener("change", () => {
      const canvas = generatedCanvasForItem(item);
      if (!canvas) {
        return;
      }
      clearGeneratedDoubleMeasurementApparatus(runtime);
      const iterations = Math.max(1, Number(runtime.measurementCount.value) || 1);
      runAutomatedGeneratedDoubleMeasurements(canvas, runtime, iterations).catch(() => {});
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
    const iterations = Math.max(1, Number(runtime.measurementCount?.value) || 1);
    runAutomatedGeneratedDoubleMeasurements(canvas, runtime, iterations).catch(() => {});
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

  const body = item.querySelector(".cnot-body, .ent-pipe, [data-part='body']");
  const funnelTop = item.querySelector(".cnot-input-funnel-top, [data-part='funnel-top']");
  const funnelBottom = item.querySelector(".cnot-input-funnel-bottom, [data-part='funnel-bottom']");
  const windowTop = item.querySelector(".cnot-porthole-top, [data-part='window-top']");
  const windowBottom = item.querySelector(".cnot-porthole-bottom, [data-part='window-bottom']");
  if (
    !(body instanceof HTMLElement) ||
    !(funnelTop instanceof HTMLElement) ||
    !(funnelBottom instanceof HTMLElement) ||
    !(windowTop instanceof HTMLElement) ||
    !(windowBottom instanceof HTMLElement)
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
    slotOccupants: {
      top: null,
      bottom: null,
    },
    busy: false,
    cyclePromise: null,
  };
  generatedCnotRuntimes.set(item, runtime);
  return runtime;
}

function updateGeneratedMeasurementTubeFills(runtime) {
  const blueFillPercent = Math.min(
    (runtime.blueTubeCount / runtime.tubeQubitCapacity) * 100,
    100
  );
  const redFillPercent = Math.min(
    (runtime.redTubeCount / runtime.tubeQubitCapacity) * 100,
    100
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
  const largestTubeCount = Math.max(runtime.blueTubeCount, runtime.redTubeCount);
  while (largestTubeCount > runtime.tubeQubitCapacity) {
    runtime.tubeQubitCapacity *= 2;
  }
}

function initializeGeneratedLayoutItemRuntime(item) {
  if (!(item instanceof HTMLElement)) {
    return;
  }
  if (isGeneratedQubitItem(item)) {
    ensureGeneratedQubitRuntimeState(item);
    if (item.dataset.generatedRuntimeDragRegistered !== "true") {
      item.dataset.generatedRuntimeDragRegistered = "true";
      item.addEventListener("mousedown", (event) => beginGeneratedRuntimeQubitDrag(item, event));
      item.addEventListener(
        "touchstart",
        (event) => beginGeneratedRuntimeQubitDrag(item, event),
        { passive: false }
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
  } else if (isGeneratedCnotItem(item)) {
    initializeGeneratedCnotItem(item);
  }
}

function layoutGeneratedSingleGateDials(root = document) {
  const scope = root instanceof Document ? root : root.ownerDocument || document;
  const gates = root instanceof HTMLElement
    ? root.querySelectorAll('.playground-node[data-component="single-gate"]')
    : scope.querySelectorAll('.generated-layout-canvas .playground-node[data-component="single-gate"]');
  gates.forEach((gate) => {
    const runtime = generatedSingleGateRuntimes.get(gate);
    runtime?.dial?.layout();
  });
}

function captureGeneratedMeasurementLayoutSnapshot(item) {
  if (!(item instanceof HTMLElement) || !isMeasurementComponentType(item.dataset.component)) {
    return null;
  }
  prepareGeneratedMeasurementParts(item);
  return captureMeasurementLayoutSnapshot(item, measurementPartSpecsForType(item.dataset.component));
}

function serializeGeneratedLayoutItem(item) {
  const serialized = {
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
  const measurementLayout = captureGeneratedMeasurementLayoutSnapshot(item);
  if (measurementLayout) {
    serialized.measurementLayout = measurementLayout;
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
    items: Array.from(canvas.querySelectorAll(":scope > .playground-node")).map((item) =>
      serializeGeneratedLayoutItem(item)
    ),
    canvasWidth: canvas.offsetWidth,
    canvasHeight: canvas.offsetHeight,
    savedAt: Date.now(),
  };
}

function persistGeneratedLayoutEditsFromDom() {
  const nextState = cloneJson(generatedTabsState) || { overrides: {}, customTabs: [] };
  nextState.overrides = nextState.overrides || {};
  nextState.customTabs = Array.isArray(nextState.customTabs) ? nextState.customTabs : [];
  let changed = false;
  document.querySelectorAll('[data-generated-layout-panel="true"]').forEach((panel) => {
    if (!(panel instanceof HTMLElement)) {
      return;
    }
    if (panel.hidden) {
      return;
    }
    const canvas = panel.querySelector(".generated-layout-canvas");
    const layout = captureGeneratedLayoutFromCanvas(canvas);
    if (!layout) {
      return;
    }
    const targetId = panel.id.replace(/^panel-/, "");
    const customEntry = nextState.customTabs.find((entry) => entry.id === targetId);
    if (customEntry) {
      customEntry.layout = layout;
      changed = true;
      return;
    }
    const targetButton = tabButtons.find((button) => button.dataset.tabTarget === targetId);
    if (targetButton) {
      nextState.overrides[targetId] = {
        label: tabLabelForButton(targetButton),
        layout,
      };
      changed = true;
    }
  });
  if (!changed) {
    return true;
  }
  if (!writeGeneratedTabsState(nextState)) {
    return false;
  }
  generatedTabsState = nextState;
  return true;
}

function createGeneratedLayoutItemNode(type, geometry = {}, sourceRoots) {
  const hasSavedGeometry =
    geometry && typeof geometry === "object" && Object.keys(geometry).length > 0;
  geometry = geometry && typeof geometry === "object" ? geometry : {};
  const config = PLAYGROUND_COMPONENT_LIBRARY[type] || PLAYGROUND_COMPONENT_LIBRARY.qubit;
  const defaultsGeometry = defaultsGeometryForComponentType(type);
  const componentNode = createPlaygroundComponentNode(type, sourceRoots);
  let item = componentNode instanceof HTMLElement ? componentNode : document.createElement("div");
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
  item.setAttribute("aria-label", config.label);
  item.querySelectorAll(".layout-resize-handle").forEach((handle) => handle.remove());
  const minSize = minGeneratedLayoutSizeForType(type);
  const width = Number.isFinite(geometry.width)
    ? geometry.width
    : (Number.isFinite(defaultsGeometry?.width) ? defaultsGeometry.width : config.width);
  const height = Number.isFinite(geometry.height)
    ? geometry.height
    : (Number.isFinite(defaultsGeometry?.height) ? defaultsGeometry.height : config.height);
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
      measurementPartSpecsForType(type),
      { includeGroupGeometry: !hasSavedGeometry }
    );
    if (geometry.measurementLayout) {
      applyMeasurementLayoutSnapshot(
        item,
        geometry.measurementLayout,
        measurementPartSpecsForType(type),
        { includeGroupGeometry: false }
      );
    }
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
  bringGeneratedItemToFront(item);
  setSelectedGeneratedLayoutItem(item);
  layoutGeneratedSingleGateDials(canvas);
  setLayoutSaveButtonSavedState(false);
  return item;
}

function positionGeneratedItemFromClientPoint(canvas, item, clientX, clientY) {
  if (!isGeneratedLayoutCanvas(canvas) || !(item instanceof HTMLElement)) {
    return;
  }
  const canvasRect = canvas.getBoundingClientRect();
  const pointerX = clientX - canvasRect.left + canvas.scrollLeft;
  const pointerY = clientY - canvasRect.top + canvas.scrollTop;
  const unclampedLeft = pointerX - item.offsetWidth / 2;
  const unclampedTop = pointerY - 18;
  const clamped = generatedLayoutClampItemPosition(canvas, item, unclampedLeft, unclampedTop);
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
  const select = toolbar.querySelector('[data-generated-editor-role="component-select"]');
  return select instanceof HTMLSelectElement ? select.value : "";
}

function addGeneratedComponentAtPoint(canvas, type, clientX, clientY, sourceRoots) {
  if (!isGeneratedLayoutCanvas(canvas) || !PLAYGROUND_COMPONENT_LIBRARY[type]) {
    return null;
  }
  const item = createGeneratedLayoutItemNode(type, {}, sourceRoots);
  appendGeneratedLayoutItemToCanvas(canvas, item);
  positionGeneratedItemFromClientPoint(canvas, item, clientX, clientY);
  return item;
}

function duplicateSelectedGeneratedLayoutItem(sourceRoots) {
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
  geometry.left += PLAYGROUND_GRID_SIZE;
  geometry.top += PLAYGROUND_GRID_SIZE;
  const item = createGeneratedLayoutItemNode(geometry.type, geometry, sourceRoots);
  appendGeneratedLayoutItemToCanvas(canvas, item);
  const clamped = generatedLayoutClampItemPosition(canvas, item, geometry.left, geometry.top);
  item.style.left = `${Math.round(clamped.left)}px`;
  item.style.top = `${Math.round(clamped.top)}px`;
  return true;
}

function removeGeneratedLayoutItem(item) {
  if (!(item instanceof HTMLElement) || !isGeneratedLayoutItem(item)) {
    return false;
  }
  if (isGeneratedQubitItem(item)) {
    Array.from(generatedCnotRuntimes.values()).forEach((runtime) => {
      if (runtime.slotOccupants.top === item) {
        runtime.slotOccupants.top = null;
      }
      if (runtime.slotOccupants.bottom === item) {
        runtime.slotOccupants.bottom = null;
      }
    });
    Array.from(generatedDoubleMeasurementRuntimes.values()).forEach((runtime) => {
      if (runtime.slotOccupants.left === item) {
        runtime.slotOccupants.left = null;
      }
      if (runtime.slotOccupants.right === item) {
        runtime.slotOccupants.right = null;
      }
    });
  }
  generatedSingleGateRuntimes.delete(item);
  generatedQubitRuntimes.delete(item);
  generatedSingleMeasurementRuntimes.delete(item);
  generatedDoubleMeasurementRuntimes.delete(item);
  generatedCnotRuntimes.delete(item);
  if (selectedGeneratedLayoutItem === item) {
    selectedGeneratedLayoutItem = null;
  }
  item.remove();
  updateGeneratedEditorButtons();
  setLayoutSaveButtonSavedState(false);
  return true;
}

function removeSelectedGeneratedLayoutItem() {
  if (!layoutEditorState.enabled || !(selectedGeneratedLayoutItem instanceof HTMLElement)) {
    return false;
  }
  return removeGeneratedLayoutItem(selectedGeneratedLayoutItem);
}

function createGeneratedEditorToolbar(entry, canvas, sourceRoots) {
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
  toolbar.appendChild(select);

  const duplicateButton = document.createElement("button");
  duplicateButton.className = "playground-tool-btn";
  duplicateButton.type = "button";
  duplicateButton.dataset.generatedEditorAction = "duplicate";
  duplicateButton.textContent = "Duplicate";
  duplicateButton.disabled = true;
  duplicateButton.addEventListener("click", () => {
    if (duplicateSelectedGeneratedLayoutItem(sourceRoots)) {
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
  hint.textContent = "Click anywhere in the container to place the selected component.";
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
      sourceRoots
    );
    if (item) {
      select.value = "";
      setGeneratedEditorStatus(toolbar, "Added");
    }
  });

  return toolbar;
}

function playgroundLayoutCanvasDimensions(layout) {
  const items = Array.isArray(layout?.items) ? layout.items : [];
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
    { right: 520, bottom: 480 }
  );
  return {
    width: Math.max(520, Math.round(parseLayoutNumeric(layout?.canvasWidth, bounds.right + 80))),
    height: Math.max(480, Math.round(parseLayoutNumeric(layout?.canvasHeight, bounds.bottom + 80))),
  };
}

function renderGeneratedLayoutPanel(panel, entry, sourceRoots) {
  if (!(panel instanceof HTMLElement)) {
    return;
  }
  panel.dataset.generatedLayoutPanel = "true";
  panel.replaceChildren();
  const gatePanel = document.createElement("section");
  gatePanel.className = "gate-panel generated-tab-panel";
  const canvas = document.createElement("div");
  canvas.className = "generated-layout-canvas playground-canvas";
  canvas.setAttribute("aria-label", `${entry.label} generated layout`);
  const dimensions = playgroundLayoutCanvasDimensions(entry.layout);
  canvas.style.width = `${dimensions.width}px`;
  canvas.style.height = `${dimensions.height}px`;
  const items = Array.isArray(entry.layout?.items) ? entry.layout.items : [];
  items.forEach((geometry) => {
    const type = typeof geometry?.type === "string" ? geometry.type : "qubit";
    canvas.appendChild(createGeneratedLayoutItemNode(type, geometry, sourceRoots));
  });
  prepareGeneratedLayoutCanvas(canvas);
  canvas.addEventListener("mousedown", beginGeneratedLayoutEditGesture);
  canvas.addEventListener("touchstart", beginGeneratedLayoutEditGesture, { passive: false });
  gatePanel.appendChild(createGeneratedEditorToolbar(entry, canvas, sourceRoots));
  gatePanel.appendChild(canvas);
  panel.appendChild(gatePanel);
  updateGeneratedEditorButtons(canvas);
  window.requestAnimationFrame(() => layoutGeneratedSingleGateDials(canvas));
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
    width: clamp(width, minSize.minWidth, Math.max(minSize.minWidth, canvas.clientWidth - left)),
    height: clamp(height, minSize.minHeight, Math.max(minSize.minHeight, canvas.clientHeight - top)),
  };
}

function bringGeneratedItemToFront(item) {
  const canvas = generatedCanvasForItem(item);
  if (!canvas) {
    return;
  }
  const maxZ = Array.from(canvas.querySelectorAll(":scope > .playground-node")).reduce(
    (highest, candidate) =>
      Math.max(highest, parseLayoutNumeric(candidate.style.zIndex, 1)),
    1
  );
  item.style.zIndex = `${Math.round(maxZ + 1)}`;
}

function findBestGeneratedGateRuntimeForQubit(canvas, qubitItem) {
  pruneGeneratedRuntimeState();
  let bestRuntime = null;
  let bestOverlap = 0.45;
  canvas.querySelectorAll('.playground-node[data-component="single-gate"]').forEach((gateItem) => {
    if (!(gateItem instanceof HTMLElement)) {
      return;
    }
    const runtime = initializeGeneratedSingleGateItem(gateItem, {
      singleGateTick: generatedSingleGateRuntimes.get(gateItem)?.activeTick,
    });
    if (!runtime || runtime.busy) {
      return;
    }
    const overlap = generatedQubitOverlapRatioWithRect(qubitItem, runtime.gateFunnel);
    if (overlap >= bestOverlap) {
      bestOverlap = overlap;
      bestRuntime = runtime;
    }
  });
  return bestRuntime;
}

async function runGeneratedSingleGateTransit(canvas, qubitItem, gateRuntime) {
  if (!isGeneratedQubitItem(qubitItem) || !gateRuntime || layoutEditorState.enabled) {
    return false;
  }
  const qubitState = ensureGeneratedQubitRuntimeState(qubitItem);
  if (!qubitState || qubitState.transiting || gateRuntime.busy) {
    return false;
  }

  qubitState.transiting = true;
  gateRuntime.busy = true;
  gateRuntime.item.classList.add("gate-busy");
  gateRuntime.item.classList.remove("platform-extended");
  if (generatedRuntimeDrag?.item === qubitItem) {
    qubitItem.classList.remove("dragging");
    generatedRuntimeDrag = null;
  }

  try {
    await nextAnimationFrame();
    if (layoutEditorState.enabled) {
      return false;
    }

    alignGeneratedGateSpring(gateRuntime);
    const gateCenter = generatedCanvasPointForElementCenter(canvas, gateRuntime.ticksWrap);
    await moveGeneratedQubitToPoint(canvas, qubitItem, gateCenter.x, gateCenter.y, AUTO_TRAVEL_MS);
    if (layoutEditorState.enabled) {
      return false;
    }

    await waitForDuration(GATE_TUBE_DWELL_MS);
    if (layoutEditorState.enabled) {
      return false;
    }

    qubitState.vector = normalizeVector2(
      vectorTimesMatrix2(qubitState.vector, gateMatrixForTick(gateRuntime.activeTick))
    );
    qubitState.cnotSourceSlot = null;
    qubitState.cnotPairToken = null;
    qubitState.cnotOutcomeProbabilities = null;
    qubitState.doubleMeasurementReturnPoint = null;
    applyGeneratedQubitVectorVisualState(qubitItem);

    settleGeneratedQubitVisualState(qubitItem);
    const platformCenter = generatedCanvasPointForElementCenter(canvas, gateRuntime.gatePlatform);
    const retractedPlatformPoint = {
      x: platformCenter.x,
      y: gateCenter.y,
    };
    setGeneratedQubitCenter(canvas, qubitItem, retractedPlatformPoint.x, retractedPlatformPoint.y);
    await nextAnimationFrame();
    if (layoutEditorState.enabled) {
      return false;
    }

    gateRuntime.item.classList.add("platform-extended");
    const canvasRect = canvas.getBoundingClientRect();
    const pipeRect = gateRuntime.gateWindow.getBoundingClientRect();
    const qubitRect = qubitItem.getBoundingClientRect();
    const ejectedCenter = {
      x: pipeRect.right - canvasRect.left + canvas.scrollLeft + 100 + qubitRect.width / 2,
      y: retractedPlatformPoint.y,
    };
    await moveGeneratedQubitToPoint(
      canvas,
      qubitItem,
      ejectedCenter.x,
      ejectedCenter.y,
      GATE_PLATFORM_EXTEND_MS
    );
    settleGeneratedQubitVisualState(qubitItem);
    gateRuntime.item.classList.remove("platform-extended");
    await waitForDuration(GATE_PLATFORM_RETRACT_MS);
    return true;
  } finally {
    settleGeneratedQubitVisualState(qubitItem);
    gateRuntime.item.classList.remove("gate-busy");
    gateRuntime.item.classList.remove("platform-extended");
    qubitState.transiting = false;
    gateRuntime.busy = false;
  }
}

function maybeSnapGeneratedQubitToSingleGate(qubitItem) {
  if (layoutEditorState.enabled || !isGeneratedQubitItem(qubitItem)) {
    return false;
  }
  const canvas = generatedCanvasForItem(qubitItem);
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
    }
    if (runtime.slotOccupants.bottom === qubitItem) {
      runtime.slotOccupants.bottom = null;
    }
  });
}

function findBestGeneratedCnotRuntimeForQubit(canvas, qubitItem) {
  pruneGeneratedRuntimeState();
  let best = null;
  let bestOverlap = CNOT_FUNNEL_OVERLAP_THRESHOLD;
  canvas.querySelectorAll('.playground-node[data-component="cnot-gate"]').forEach((cnotItem) => {
    if (!(cnotItem instanceof HTMLElement)) {
      return;
    }
    const runtime = initializeGeneratedCnotItem(cnotItem);
    if (!runtime || runtime.busy) {
      return;
    }
    [
      { slot: "top", funnel: runtime.funnelTop, occupant: runtime.slotOccupants.top },
      { slot: "bottom", funnel: runtime.funnelBottom, occupant: runtime.slotOccupants.bottom },
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

  const topSign = topState.vector[1] < 0 ? -1 : 1;
  const bottomSign = bottomState.vector[1] < 0 ? -1 : 1;
  const marginals = cnotMarginalProbabilitiesFromQubitVectors(topState.vector, bottomState.vector);

  topState.vector = canonicalizeRealAmplitudeVector([
    Math.sqrt(clamp(marginals.control[0], 0, 1)),
    topSign * Math.sqrt(clamp(marginals.control[1], 0, 1)),
  ]);
  bottomState.vector = canonicalizeRealAmplitudeVector([
    Math.sqrt(clamp(marginals.target[0], 0, 1)),
    bottomSign * Math.sqrt(clamp(marginals.target[1], 0, 1)),
  ]);

  applyGeneratedQubitVectorVisualState(topQubitItem);
  applyGeneratedQubitVectorVisualState(bottomQubitItem);
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
  runtime.item.classList.add("gate-busy");
  runtime.body.classList.remove("platform-extended");
  runtime.cyclePromise = (async () => {
    try {
      await waitForDuration(CNOT_WINDOW_DWELL_MS);
      if (
        layoutEditorState.enabled ||
        !topQubit.isConnected ||
        !bottomQubit.isConnected ||
        runtime.slotOccupants.top !== topQubit ||
        runtime.slotOccupants.bottom !== bottomQubit
      ) {
        return false;
      }

      const cnotOutcomeProbabilities = cnotOutcomeProbabilitiesFromQubitVectors(
        topState.vector,
        bottomState.vector
      );
      const pairToken = `${Date.now()}-${Math.random()}`;
      applyGeneratedCnotToQubitStates(topQubit, bottomQubit);
      topState.cnotSourceSlot = "top";
      bottomState.cnotSourceSlot = "bottom";
      topState.cnotPairToken = pairToken;
      bottomState.cnotPairToken = pairToken;
      topState.cnotOutcomeProbabilities = cnotOutcomeProbabilities;
      bottomState.cnotOutcomeProbabilities = cnotOutcomeProbabilities;

      const topWindowCenter = generatedCanvasPointForElementCenter(canvas, runtime.windowTop);
      const bottomWindowCenter = generatedCanvasPointForElementCenter(canvas, runtime.windowBottom);
      setGeneratedQubitCenter(canvas, topQubit, topWindowCenter.x, topWindowCenter.y);
      setGeneratedQubitCenter(canvas, bottomQubit, bottomWindowCenter.x, bottomWindowCenter.y);
      await nextAnimationFrame();

      runtime.body.classList.add("platform-extended");
      const canvasRect = canvas.getBoundingClientRect();
      const bodyRect = runtime.body.getBoundingClientRect();
      const topQubitRect = topQubit.getBoundingClientRect();
      const bottomQubitRect = bottomQubit.getBoundingClientRect();
      const ejectedCenterX =
        bodyRect.right - canvasRect.left + canvas.scrollLeft + 50 + topQubitRect.width / 2;
      const topEjectedCenter = { x: ejectedCenterX, y: topWindowCenter.y };
      const bottomEjectedCenter = {
        x:
          bodyRect.right - canvasRect.left +
          canvas.scrollLeft +
          50 +
          bottomQubitRect.width / 2,
        y: bottomWindowCenter.y,
      };
      await Promise.all([
        moveGeneratedQubitToPoint(
          canvas,
          topQubit,
          topEjectedCenter.x,
          topEjectedCenter.y,
          GATE_PLATFORM_EXTEND_MS
        ),
        moveGeneratedQubitToPoint(
          canvas,
          bottomQubit,
          bottomEjectedCenter.x,
          bottomEjectedCenter.y,
          GATE_PLATFORM_EXTEND_MS
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
    layoutEditorState.enabled
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
  if (generatedRuntimeDrag?.item === qubitItem) {
    qubitItem.classList.remove("dragging");
    generatedRuntimeDrag = null;
  }
  try {
    const targetWindow = slotKey === "top" ? runtime.windowTop : runtime.windowBottom;
    const center = generatedCanvasPointForElementCenter(canvas, targetWindow);
    await moveGeneratedQubitToPoint(
      canvas,
      qubitItem,
      center.x,
      center.y,
      AUTO_TRAVEL_MS
    );
    settleGeneratedQubitVisualState(qubitItem);
    setGeneratedQubitCenter(canvas, qubitItem, center.x, center.y);
  } finally {
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
  if (layoutEditorState.enabled || !isGeneratedQubitItem(qubitItem)) {
    return false;
  }
  const canvas = generatedCanvasForItem(qubitItem);
  const qubitState = ensureGeneratedQubitRuntimeState(qubitItem);
  if (!canvas || !qubitState || qubitState.transiting) {
    return false;
  }
  const target = findBestGeneratedCnotRuntimeForQubit(canvas, qubitItem);
  if (!target) {
    return false;
  }
  runGeneratedCnotIngress(canvas, qubitItem, target.runtime, target.slot).catch(() => {});
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
  const overlapArea = generatedCircleIntersectionArea(qRadius, lensCircle.radius, distance);
  const qubitArea = Math.PI * qRadius * qRadius;
  return qubitArea > 0 ? overlapArea / qubitArea : 0;
}

function findBestGeneratedMeasurementRuntimeForQubit(canvas, qubitItem) {
  pruneGeneratedRuntimeState();
  let bestRuntime = null;
  let bestOverlap = MEASUREMENT_OVERLAP_THRESHOLD;
  canvas.querySelectorAll('.playground-node[data-component="single-measurement"]').forEach((item) => {
    if (!(item instanceof HTMLElement)) {
      return;
    }
    const runtime = initializeGeneratedSingleMeasurementItem(item);
    if (!runtime || runtime.busy) {
      return;
    }
    const overlap = Math.max(
      generatedQubitOverlapRatioWithLens(qubitItem, runtime),
      generatedQubitOverlapRatioWithRect(qubitItem, runtime.measurementTool)
    );
    if (overlap >= bestOverlap) {
      bestOverlap = overlap;
      bestRuntime = runtime;
    }
  });
  return bestRuntime;
}

function collapseGeneratedQubitState(qubitItem) {
  const qubitState = ensureGeneratedQubitRuntimeState(qubitItem);
  if (!qubitState) {
    return "blue";
  }
  const [blueProbability] = probabilitiesFromVector2(qubitState.vector);
  const collapseToBlue =
    blueProbability >= 1 || (blueProbability > 0 && Math.random() < blueProbability);
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
  payload.style.setProperty("--qubit-fill", color === "blue" ? blendBlueRed(1, 0) : blendBlueRed(0, 1));
  canvas.appendChild(payload);
  return payload;
}

function moveGeneratedPayloadToPoint(payload, x, y, duration = AUTO_TRAVEL_MS) {
  return new Promise((resolve) => {
    payload.style.setProperty("--move-duration", `${duration}ms`);
    payload.classList.add("migrating");
    payload.getBoundingClientRect();
    payload.style.left = `${x}px`;
    payload.style.top = `${y}px`;
    window.setTimeout(resolve, duration);
  });
}

async function animateGeneratedMeasurementPayloadToTube(
  canvas,
  runtime,
  collapsedColor,
  startPoint,
  { migrationDuration = AUTO_TRAVEL_MS, meltDuration = AUTO_MELT_MS } = {}
) {
  const payload = createGeneratedMeasurementPayload(canvas, collapsedColor, startPoint);
  try {
    const targetTube = collapsedColor === "blue" ? runtime.tubeBlue : runtime.tubeRed;
    const targetRect = targetTube.getBoundingClientRect();
    const targetPoint = generatedViewportPointToCanvasPoint(
      canvas,
      targetRect.left + targetRect.width / 2,
      targetRect.top + targetRect.height * 0.22
    );

    await moveGeneratedPayloadToPoint(
      payload,
      targetPoint.x,
      targetPoint.y,
      migrationDuration
    );

    payload.style.setProperty("--melt-duration", `${meltDuration}ms`);
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

async function runGeneratedSingleMeasurementTransit(canvas, qubitItem, runtime) {
  if (!isGeneratedQubitItem(qubitItem) || !runtime || layoutEditorState.enabled) {
    return false;
  }
  const qubitState = ensureGeneratedQubitRuntimeState(qubitItem);
  if (!qubitState || qubitState.transiting || runtime.busy) {
    return false;
  }

  qubitState.transiting = true;
  runtime.busy = true;
  if (generatedRuntimeDrag?.item === qubitItem) {
    qubitItem.classList.remove("dragging");
    generatedRuntimeDrag = null;
  }

  try {
    const lensCircle = generatedLensCircle(runtime);
    if (!lensCircle) {
      return false;
    }
    const lensCenter = generatedViewportPointToCanvasPoint(canvas, lensCircle.x, lensCircle.y);
    setGeneratedQubitCenter(canvas, qubitItem, lensCenter.x, lensCenter.y);
    settleGeneratedQubitVisualState(qubitItem);

    const core = getGeneratedQubitCore(qubitItem);
    if (core instanceof HTMLElement) {
      core.classList.add("collapse-animating");
    }
    const collapsedColor = collapseGeneratedQubitState(qubitItem);
    if (core instanceof HTMLElement) {
      core.classList.remove("collapse-animating");
    }

    await animateGeneratedMeasurementPayloadToTube(
      canvas,
      runtime,
      collapsedColor,
      lensCenter
    );

    setGeneratedQubitCenter(canvas, qubitItem, lensCenter.x + 100, lensCenter.y);
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
  if (layoutEditorState.enabled || !isGeneratedQubitItem(qubitItem)) {
    return false;
  }
  const canvas = generatedCanvasForItem(qubitItem);
  const qubitState = ensureGeneratedQubitRuntimeState(qubitItem);
  if (!canvas || !qubitState || qubitState.transiting) {
    return false;
  }
  const runtime = findBestGeneratedMeasurementRuntimeForQubit(canvas, qubitItem);
  if (!runtime) {
    return false;
  }
  runGeneratedSingleMeasurementTransit(canvas, qubitItem, runtime).catch(() => {});
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

function generatedQubitOverlapRatioWithDoubleMeasurementLens(qubitItem, runtime) {
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
  const overlapArea = generatedCircleIntersectionArea(qRadius, lensCircle.radius, distance);
  const qubitArea = Math.PI * qRadius * qRadius;
  return qubitArea > 0 ? overlapArea / qubitArea : 0;
}

function findBestGeneratedDoubleMeasurementRuntimeForQubit(canvas, qubitItem) {
  pruneGeneratedRuntimeState();
  let bestRuntime = null;
  let bestOverlap = MEASUREMENT_OVERLAP_THRESHOLD;
  canvas.querySelectorAll('.playground-node[data-component="double-measurement"]').forEach((item) => {
    if (!(item instanceof HTMLElement)) {
      return;
    }
    const runtime = initializeGeneratedDoubleMeasurementItem(item);
    if (!runtime || runtime.busy) {
      return;
    }
    const overlap = Math.max(
      generatedQubitOverlapRatioWithDoubleMeasurementLens(qubitItem, runtime),
      generatedQubitOverlapRatioWithRect(qubitItem, runtime.measurementTool)
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
    lensRect.top + lensRect.height / 2
  );
  const laneOffset = Math.max(20, lensRect.width * 0.12);
  return {
    x: lensCenter.x + (slot === "right" ? laneOffset : -laneOffset) + TWO_QUBIT_MEASUREMENT_SLOT_SHIFT_X,
    y: lensCenter.y + TWO_QUBIT_MEASUREMENT_SLOT_SHIFT_Y,
  };
}

function collapseGeneratedQubitPairFromCnot(topQubitItem, bottomQubitItem) {
  const topState = ensureGeneratedQubitRuntimeState(topQubitItem);
  const bottomState = ensureGeneratedQubitRuntimeState(bottomQubitItem);
  if (!topState || !bottomState) {
    return null;
  }

  let probabilities = null;
  if (
    topState.cnotPairToken &&
    topState.cnotPairToken === bottomState.cnotPairToken &&
    topState.cnotOutcomeProbabilities &&
    bottomState.cnotOutcomeProbabilities
  ) {
    probabilities = topState.cnotOutcomeProbabilities;
  } else {
    probabilities = cnotOutcomeProbabilitiesFromQubitVectors(topState.vector, bottomState.vector);
  }
  const outcomeKey = samplePairOutcomeFromProbabilities(probabilities);
  const topBlue = outcomeKey[0] === "b";
  const bottomBlue = outcomeKey[1] === "b";
  topState.vector = topBlue ? [1, 0] : [0, 1];
  bottomState.vector = bottomBlue ? [1, 0] : [0, 1];
  topState.cnotSourceSlot = null;
  bottomState.cnotSourceSlot = null;
  topState.cnotPairToken = null;
  bottomState.cnotPairToken = null;
  topState.cnotOutcomeProbabilities = null;
  bottomState.cnotOutcomeProbabilities = null;
  applyGeneratedQubitVectorVisualState(topQubitItem);
  applyGeneratedQubitVectorVisualState(bottomQubitItem);
  return {
    outcomeKey,
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
  runtime.measurementTool.classList.remove("platform-extended");
  runtime.cyclePromise = (async () => {
    try {
      await waitForDuration(DOUBLE_MEASUREMENT_COLLAPSE_DELAY_MS);
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
      const collapseResult = collapseGeneratedQubitPairFromCnot(rightQubit, leftQubit);
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
      const placementTargets = placementReturnCentersForCanvas(canvas, leftQubit, rightQubit);

      const leftReturn =
        (placementTargets?.left &&
          Number.isFinite(placementTargets.left.x) &&
          Number.isFinite(placementTargets.left.y))
          ? placementTargets.left
          : (leftState.doubleMeasurementReturnPoint &&
          Number.isFinite(leftState.doubleMeasurementReturnPoint.x) &&
          Number.isFinite(leftState.doubleMeasurementReturnPoint.y))
          ? leftState.doubleMeasurementReturnPoint
          : generatedDoubleMeasurementSlotCenter(canvas, runtime, "left");
      const rightReturn =
        (placementTargets?.right &&
          Number.isFinite(placementTargets.right.x) &&
          Number.isFinite(placementTargets.right.y))
          ? placementTargets.right
          : (rightState.doubleMeasurementReturnPoint &&
          Number.isFinite(rightState.doubleMeasurementReturnPoint.x) &&
          Number.isFinite(rightState.doubleMeasurementReturnPoint.y))
          ? rightState.doubleMeasurementReturnPoint
          : generatedDoubleMeasurementSlotCenter(canvas, runtime, "right");

      leftState.vector = [1, 0];
      rightState.vector = [1, 0];
      applyGeneratedQubitVectorVisualState(leftQubit);
      applyGeneratedQubitVectorVisualState(rightQubit);

      await Promise.all([
        moveGeneratedQubitToPoint(canvas, leftQubit, leftReturn.x, leftReturn.y, AUTO_TRAVEL_MS),
        moveGeneratedQubitToPoint(canvas, rightQubit, rightReturn.x, rightReturn.y, AUTO_TRAVEL_MS),
      ]);
      settleGeneratedQubitVisualState(leftQubit);
      settleGeneratedQubitVisualState(rightQubit);
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
}

async function runGeneratedDoubleMeasurementIngress(canvas, qubitItem, runtime) {
  if (!isGeneratedQubitItem(qubitItem) || !runtime || runtime.busy || layoutEditorState.enabled) {
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

  qubitState.doubleMeasurementReturnPoint = generatedCanvasPointForElementCenter(canvas, qubitItem);
  qubitState.transiting = true;
  runtime.slotOccupants[slot] = qubitItem;
  if (generatedRuntimeDrag?.item === qubitItem) {
    qubitItem.classList.remove("dragging");
    generatedRuntimeDrag = null;
  }

  try {
    const center = generatedDoubleMeasurementSlotCenter(canvas, runtime, slot);
    await moveGeneratedQubitToPoint(canvas, qubitItem, center.x, center.y, AUTO_TRAVEL_MS);
    settleGeneratedQubitVisualState(qubitItem);
    setGeneratedQubitCenter(canvas, qubitItem, center.x, center.y);
  } finally {
    qubitState.transiting = false;
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
  if (layoutEditorState.enabled || !isGeneratedQubitItem(qubitItem)) {
    return false;
  }
  const canvas = generatedCanvasForItem(qubitItem);
  const qubitState = ensureGeneratedQubitRuntimeState(qubitItem);
  if (!canvas || !qubitState || qubitState.transiting) {
    return false;
  }
  const runtime = findBestGeneratedDoubleMeasurementRuntimeForQubit(canvas, qubitItem);
  if (!runtime) {
    return false;
  }
  runGeneratedDoubleMeasurementIngress(canvas, qubitItem, runtime).catch(() => {});
  return true;
}

function generatedItemsOfType(canvas, type) {
  if (!isGeneratedLayoutCanvas(canvas)) {
    return [];
  }
  return Array.from(canvas.querySelectorAll(`.playground-node[data-component="${type}"]`)).filter(
    (item) => item instanceof HTMLElement
  );
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
    const distance = Math.hypot(center.x - sourceCenter.x, center.y - sourceCenter.y);
    if (distance < bestDistance) {
      bestDistance = distance;
      bestItem = item;
    }
  });
  return bestItem;
}

function generatedCanvasBoundsForElement(canvas, element) {
  if (!isGeneratedLayoutCanvas(canvas) || !(element instanceof HTMLElement)) {
    return null;
  }
  const canvasRect = canvas.getBoundingClientRect();
  const rect = element.getBoundingClientRect();
  return {
    left: rect.left - canvasRect.left + canvas.scrollLeft,
    right: rect.right - canvasRect.left + canvas.scrollLeft,
    top: rect.top - canvasRect.top + canvas.scrollTop,
    bottom: rect.bottom - canvasRect.top + canvas.scrollTop,
  };
}

function generatedPointInsideElement(canvas, point, element) {
  const bounds = generatedCanvasBoundsForElement(canvas, element);
  return Boolean(
    bounds &&
      point &&
      point.x >= bounds.left &&
      point.x <= bounds.right &&
      point.y >= bounds.top &&
      point.y <= bounds.bottom
  );
}

function resolveGeneratedDoubleMeasurementAutomationPath(canvas, measurementRuntime) {
  pruneGeneratedRuntimeState();
  const qubits = sortGeneratedItemsTopToBottom(canvas, generatedItemsOfType(canvas, "qubit")).slice(0, 2);
  const gateItems = sortGeneratedItemsTopToBottom(canvas, generatedItemsOfType(canvas, "single-gate")).slice(0, 2);
  const cnotItem = nearestGeneratedItemByCenter(
    canvas,
    measurementRuntime.item,
    generatedItemsOfType(canvas, "cnot-gate")
  );
  if (qubits.length < 2 || gateItems.length < 2 || !(cnotItem instanceof HTMLElement)) {
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
  const gateCenter = generatedCanvasPointForElementCenter(canvas, gateRuntime.gateWindow);
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
  const gateCenter = generatedCanvasPointForElementCenter(canvas, gateRuntime.gateWindow);
  const buffer = Math.max(12, qubitItem.offsetWidth * 0.35);
  return point.x <= gateCenter.x - buffer;
}

function isGeneratedCanvasPoint(point) {
  return Boolean(
    point &&
      Number.isFinite(point.x) &&
      Number.isFinite(point.y)
  );
}

function generatedAutomationStartPoint(
  canvas,
  qubitItem,
  gateRuntime,
  measurementRuntime,
  cachedPoint = null
) {
  const current = generatedItemCenterPoint(canvas, qubitItem);
  if (
    generatedPointInsideElement(canvas, current, measurementRuntime.item) ||
    generatedPointInsideElement(canvas, current, measurementRuntime.measurementTool) ||
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
  state.vector = [1, 0];
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
  state.vector = normalizeVector2(vectorTimesMatrix2(state.vector, gateMatrixForTick(gateRuntime.activeTick)));
  state.cnotSourceSlot = null;
  state.cnotPairToken = null;
  state.cnotOutcomeProbabilities = null;
  state.doubleMeasurementReturnPoint = null;
  applyGeneratedQubitVectorVisualState(qubitItem);
}

function annotateGeneratedCnotOutcomeProbabilities(topQubitItem, bottomQubitItem) {
  const topState = ensureGeneratedQubitRuntimeState(topQubitItem);
  const bottomState = ensureGeneratedQubitRuntimeState(bottomQubitItem);
  if (!topState || !bottomState) {
    return;
  }
  const probabilities = cnotOutcomeProbabilitiesFromQubitVectors(topState.vector, bottomState.vector);
  const pairToken = `${Date.now()}-${Math.random()}`;
  topState.cnotPairToken = pairToken;
  bottomState.cnotPairToken = pairToken;
  topState.cnotOutcomeProbabilities = probabilities;
  bottomState.cnotOutcomeProbabilities = probabilities;
}

function runGeneratedDoubleMeasurementMachineIteration(path, measurementRuntime) {
  resetGeneratedQubitForAutomatedRun(null, path.topQubit, null);
  resetGeneratedQubitForAutomatedRun(null, path.bottomQubit, null);
  applyGeneratedSingleGateStateWithoutAnimation(path.topQubit, path.topGate);
  applyGeneratedSingleGateStateWithoutAnimation(path.bottomQubit, path.bottomGate);
  annotateGeneratedCnotOutcomeProbabilities(path.topQubit, path.bottomQubit);
  applyGeneratedCnotToQubitStates(path.topQubit, path.bottomQubit);
  const collapseResult = collapseGeneratedQubitPairFromCnot(path.topQubit, path.bottomQubit);
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
  startPoints
) {
  resetGeneratedQubitForAutomatedRun(canvas, path.topQubit, startPoints.top);
  resetGeneratedQubitForAutomatedRun(canvas, path.bottomQubit, startPoints.bottom);
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
    runGeneratedCnotIngress(canvas, path.bottomQubit, path.cnotRuntime, "bottom"),
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
    runGeneratedDoubleMeasurementIngress(canvas, path.topQubit, measurementRuntime),
    runGeneratedDoubleMeasurementIngress(canvas, path.bottomQubit, measurementRuntime),
  ]);
  if (!measurementIngressCompleted.every(Boolean) || layoutEditorState.enabled) {
    return false;
  }
  if (measurementRuntime.cyclePromise) {
    const measurementCompleted = await measurementRuntime.cyclePromise;
    return Boolean(measurementCompleted);
  }
  return false;
}

async function runAutomatedGeneratedDoubleMeasurements(canvas, measurementRuntime, iterations) {
  if (
    layoutEditorState.enabled ||
    !isGeneratedLayoutCanvas(canvas) ||
    !measurementRuntime ||
    measurementRuntime.autoRunInProgress ||
    measurementRuntime.busy
  ) {
    return;
  }

  const path = resolveGeneratedDoubleMeasurementAutomationPath(canvas, measurementRuntime);
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
      cachedStartPoints.top
    ),
    bottom: generatedAutomationStartPoint(
      canvas,
      path.bottomQubit,
      path.bottomGate,
      measurementRuntime,
      cachedStartPoints.bottom
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
            runGeneratedDoubleMeasurementMachineIteration(path, measurementRuntime);
            processed += 1;
          }
          updateGeneratedDoubleMeasurementTubeFills(measurementRuntime);
          await nextAnimationFrame();
        }
      } else {
        await nextAnimationFrame();
        while (processed < count && !layoutEditorState.enabled) {
          runGeneratedDoubleMeasurementMachineIteration(path, measurementRuntime);
          processed += 1;
        }
      }
      updateGeneratedDoubleMeasurementTubeFills(measurementRuntime);
      resetGeneratedQubitForAutomatedRun(canvas, path.topQubit, startPoints.top);
      resetGeneratedQubitForAutomatedRun(canvas, path.bottomQubit, startPoints.bottom);
      return;
    }

    for (let i = 0; i < count; i += 1) {
      const completed = await runGeneratedDoubleMeasurementAnimatedIteration(
        canvas,
        path,
        measurementRuntime,
        startPoints
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

function moveGeneratedQubitToPoint(canvas, qubitItem, x, y, duration = AUTO_TRAVEL_MS) {
  return new Promise((resolve) => {
    const core = getGeneratedQubitCore(qubitItem);
    qubitItem.style.setProperty("--move-duration", `${duration}ms`);
    qubitItem.classList.add("migrating");
    if (core instanceof HTMLElement) {
      core.style.setProperty("--move-duration", `${duration}ms`);
      core.classList.add("migrating");
    }
    qubitItem.getBoundingClientRect();
    setGeneratedQubitCenter(canvas, qubitItem, x, y);
    window.setTimeout(resolve, duration);
  });
}

function beginGeneratedRuntimeQubitDrag(item, event) {
  if (layoutEditorState.enabled || !isGeneratedQubitItem(item)) {
    return;
  }
  const canvas = generatedCanvasForItem(item);
  const state = ensureGeneratedQubitRuntimeState(item);
  if (!canvas || state?.transiting || !isPrimaryMouseButton(event)) {
    return;
  }
  const point = getPointer(event);
  if (!point) {
    return;
  }
  bringGeneratedItemToFront(item);
  releaseGeneratedQubitFromCnotSlots(item);
  releaseGeneratedQubitFromDoubleMeasurementSlots(item);
  const itemRect = item.getBoundingClientRect();
  generatedRuntimeDrag = {
    canvas,
    item,
    pointerOffsetX: point.clientX - itemRect.left,
    pointerOffsetY: point.clientY - itemRect.top,
  };
  item.classList.add("dragging");
  event.preventDefault();
  event.stopPropagation();
}

function continueGeneratedRuntimeGesture(event) {
  const gesture = generatedRuntimeDrag;
  if (layoutEditorState.enabled || !gesture) {
    return;
  }
  const point = getPointer(event);
  if (!point) {
    return;
  }
  if (event.touches) {
    event.preventDefault();
  }
  const canvasRect = gesture.canvas.getBoundingClientRect();
  const left =
    point.clientX - canvasRect.left + gesture.canvas.scrollLeft - gesture.pointerOffsetX;
  const top =
    point.clientY - canvasRect.top + gesture.canvas.scrollTop - gesture.pointerOffsetY;
  const clamped = generatedLayoutClampItemPosition(gesture.canvas, gesture.item, left, top);
  gesture.item.style.left = `${Math.round(clamped.left)}px`;
  gesture.item.style.top = `${Math.round(clamped.top)}px`;
  if (maybeSnapGeneratedQubitToSingleGate(gesture.item)) {
    return;
  }
  maybeSnapGeneratedQubitToSingleMeasurement(gesture.item);
}

function endGeneratedRuntimeGesture() {
  const gesture = generatedRuntimeDrag;
  if (!gesture) {
    return;
  }
  gesture.item.classList.remove("dragging");
  const left = parseLayoutNumeric(gesture.item.style.left, 0);
  const top = parseLayoutNumeric(gesture.item.style.top, 0);
  const clamped = generatedLayoutClampItemPosition(gesture.canvas, gesture.item, left, top);
  gesture.item.style.left = `${Math.round(clamped.left)}px`;
  gesture.item.style.top = `${Math.round(clamped.top)}px`;
  if (!layoutEditorState.enabled) {
    if (!maybeSnapGeneratedQubitToSingleGate(gesture.item)) {
      if (!maybeSnapGeneratedQubitToCnot(gesture.item)) {
        if (!maybeSnapGeneratedQubitToDoubleMeasurement(gesture.item)) {
          maybeSnapGeneratedQubitToSingleMeasurement(gesture.item);
        }
      }
    }
  }
  generatedRuntimeDrag = null;
}

function continueGeneratedGateDialDrag(event) {
  if (layoutEditorState.enabled) {
    return;
  }
  pruneGeneratedRuntimeState();
  Array.from(generatedSingleGateRuntimes.values()).forEach((runtime) => {
    runtime.dial?.continueDrag(event);
  });
}

function endGeneratedGateDialDrag() {
  pruneGeneratedRuntimeState();
  Array.from(generatedSingleGateRuntimes.values()).forEach((runtime) => {
    runtime.dial?.endDrag();
  });
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
  const origin = event.target;
  if (!(origin instanceof Element)) {
    return;
  }
  const measurementPart = origin.closest("[data-playground-measurement-part]");
  if (
    measurementPart instanceof HTMLElement &&
    measurementPart.closest(".generated-layout-canvas") === canvas
  ) {
    const item = measurementPart.closest(".playground-node");
    if (!(item instanceof HTMLElement)) {
      return;
    }
    setSelectedGeneratedLayoutItem(item);
    const canResize = measurementPart.dataset.layoutResizable === "true";
    const isResizeHandle =
      origin.closest(".layout-resize-handle") ||
      pointerNearResizeCorner(measurementPart, point, 18);
    const initialTranslate = layoutTargetTranslate(measurementPart);
    const rect = measurementPart.getBoundingClientRect();
    generatedLayoutGesture = {
      mode: canResize && isResizeHandle ? "part-resize" : "part-move",
      canvas,
      item,
      part: measurementPart,
      startX: point.clientX,
      startY: point.clientY,
      startTx: initialTranslate.x,
      startTy: initialTranslate.y,
      startWidth: rect.width,
      startHeight: rect.height,
      uniformResize: measurementPart.dataset.layoutUniformResize === "true",
      minWidth: parseLayoutNumeric(measurementPart.dataset.layoutMinWidth, 24),
      minHeight: parseLayoutNumeric(measurementPart.dataset.layoutMinHeight, 24),
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
  setSelectedGeneratedLayoutItem(item);
  const itemRect = item.getBoundingClientRect();
  const isResizeHandle =
    origin.closest(".layout-resize-handle") || pointerNearResizeCorner(item, point, 22);
  const mode = isResizeHandle ? "item-resize" : "item-move";
  generatedLayoutGesture = {
    mode,
    canvas,
    item,
    startX: point.clientX,
    startY: point.clientY,
    startLeft: parseLayoutNumeric(item.style.left, 0),
    startTop: parseLayoutNumeric(item.style.top, 0),
    pointerOffsetX: point.clientX - itemRect.left,
    pointerOffsetY: point.clientY - itemRect.top,
    startWidth: itemRect.width,
    startHeight: itemRect.height,
    aspectRatio: itemRect.height > 0 ? itemRect.width / itemRect.height : 1,
    cnotBaseline: mode === "item-resize" ? captureCnotGeometryBaseline(item) : null,
  };
  item.classList.add(mode === "item-resize" ? "resizing" : "dragging");
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
  const dx = point.clientX - gesture.startX;
  const dy = point.clientY - gesture.startY;
  if (gesture.mode === "part-resize") {
    let nextWidth = Math.max(gesture.minWidth, gesture.startWidth + dx);
    let nextHeight = Math.max(gesture.minHeight, gesture.startHeight + dy);
    if (gesture.uniformResize) {
      const uniformSize = Math.max(nextWidth, nextHeight, gesture.minWidth, gesture.minHeight);
      nextWidth = uniformSize;
      nextHeight = uniformSize;
    }
    gesture.part.style.width = `${Math.round(nextWidth)}px`;
    gesture.part.style.height = `${Math.round(nextHeight)}px`;
    setLayoutManualEdited(gesture.part, true);
  } else if (gesture.mode === "part-move") {
    setLayoutTargetTranslate(gesture.part, gesture.startTx + dx, gesture.startTy + dy);
    setLayoutManualEdited(gesture.part, true);
  } else if (gesture.mode === "item-resize") {
    let nextWidth = gesture.startWidth + dx;
    let nextHeight = gesture.startHeight + dy;
    if (gesture.item.dataset.component === "qubit") {
      const uniform = Math.max(nextWidth, nextHeight);
      nextWidth = uniform;
      nextHeight = uniform;
    }
    const clamped = generatedLayoutClampItemSize(gesture.canvas, gesture.item, nextWidth, nextHeight);
    gesture.item.style.width = `${Math.round(clamped.width)}px`;
    gesture.item.style.height = `${Math.round(clamped.height)}px`;
    applyCnotGeometryScale(
      gesture.item,
      gesture.cnotBaseline,
      clamped.width,
      clamped.height
    );
    layoutGeneratedSingleGateDials(gesture.canvas);
    setLayoutManualEdited(gesture.item, true);
  } else {
    const canvasRect = gesture.canvas.getBoundingClientRect();
    const nextLeft =
      point.clientX - canvasRect.left + gesture.canvas.scrollLeft - gesture.pointerOffsetX;
    const nextTop =
      point.clientY - canvasRect.top + gesture.canvas.scrollTop - gesture.pointerOffsetY;
    const clamped = generatedLayoutClampItemPosition(
      gesture.canvas,
      gesture.item,
      nextLeft,
      nextTop
    );
    gesture.item.style.left = `${Math.round(clamped.left)}px`;
    gesture.item.style.top = `${Math.round(clamped.top)}px`;
    setLayoutManualEdited(gesture.item, true);
  }
  setLayoutSaveButtonSavedState(false);
  if (event.touches) {
    event.preventDefault();
  }
}

function endGeneratedLayoutEditGesture() {
  const gesture = generatedLayoutGesture;
  if (!gesture) {
    return;
  }
  if (gesture.part) {
    gesture.part.classList.remove("layout-edit-dragging");
  }
  if (gesture.item) {
    gesture.item.classList.remove("dragging", "resizing");
  }
  generatedLayoutGesture = null;
}

function registerTabButton(button) {
  if (!(button instanceof HTMLButtonElement) || button.dataset.tabRegistered === "true") {
    return;
  }
  button.dataset.tabRegistered = "true";
  button.addEventListener("click", () => {
    const target = button.dataset.tabTarget;
    if (!target) {
      return;
    }
    setActiveTab(target);
  });
}

function tabLabelForButton(button) {
  return String(button?.textContent || "").trim().replace(/\s+/g, " ");
}

function existingTabLabelSet() {
  return new Set(tabButtons.map((button) => normalizeTabLabel(tabLabelForButton(button))));
}

function collectPlaygroundSaveTargets() {
  return tabButtons
    .filter((button) => button.dataset.tabTarget && button.dataset.tabTarget !== "plaground")
    .map((button) => ({
      id: button.dataset.tabTarget,
      label: tabLabelForButton(button),
      generated: button.dataset.generatedTab === "true",
    }));
}

function uniqueGeneratedTabTarget(label) {
  const used = new Set(tabButtons.map((button) => button.dataset.tabTarget).filter(Boolean));
  let base = `custom-${generatedTabSlug(label)}`;
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
    const insertionPoint = layoutEditToggle instanceof HTMLElement ? layoutEditToggle : null;
    tabStrip?.insertBefore(button, insertionPoint);
    tabButtons.push(button);
  }
  button.textContent = entry.label;
  button.setAttribute("aria-controls", `panel-${entry.id}`);
  registerTabButton(button);
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

function applyGeneratedTabsState(state, sourceRoots) {
  generatedTabsState = state || { overrides: {}, customTabs: [] };
  seedEntanglementReturnTargetsFromPlacementsTab();
  const customIds = new Set(
    (generatedTabsState.customTabs || [])
      .filter((entry) => entry && typeof entry.id === "string")
      .map((entry) => entry.id)
  );
  tabButtons
    .filter(
      (button) =>
        button instanceof HTMLButtonElement &&
        button.dataset.generatedTab === "true" &&
        !customIds.has(button.dataset.tabTarget || "")
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

  Object.entries(generatedTabsState.overrides || {}).forEach(([target, entry]) => {
    const button = tabButtons.find((candidate) => candidate.dataset.tabTarget === target);
    const panel = document.getElementById(`panel-${target}`);
    if (!(button instanceof HTMLButtonElement) || !(panel instanceof HTMLElement)) {
      return;
    }
    const label = entry?.label || tabLabelForButton(button);
    renderGeneratedLayoutPanel(panel, { label, layout: entry?.layout }, sourceRoots);
  });

  (generatedTabsState.customTabs || []).forEach((entry) => {
    if (!entry || typeof entry.id !== "string" || typeof entry.label !== "string") {
      return;
    }
    ensureGeneratedTabButton(entry);
    renderGeneratedLayoutPanel(ensureGeneratedTabPanel(entry), entry, sourceRoots);
  });
}

function restoreGeneratedTabs(sourceRoots) {
  applyGeneratedTabsState(readGeneratedTabsState(), sourceRoots);
}

function openPlaygroundSaveTargetDialog() {
  const targets = collectPlaygroundSaveTargets();
  return new Promise((resolve) => {
    const overlay = document.createElement("div");
    overlay.className = "playground-save-modal-backdrop";
    overlay.setAttribute("role", "presentation");

    const panel = document.createElement("form");
    panel.className = "playground-save-modal";
    panel.setAttribute("role", "dialog");
    panel.setAttribute("aria-modal", "true");
    panel.setAttribute("aria-labelledby", "playgroundSaveModalTitle");

    const title = document.createElement("h2");
    title.id = "playgroundSaveModalTitle";
    title.textContent = "Save Playground Layout";

    const targetLabel = document.createElement("label");
    targetLabel.textContent = "Save to";
    targetLabel.setAttribute("for", "playgroundSaveTargetSelect");

    const select = document.createElement("select");
    select.id = "playgroundSaveTargetSelect";
    select.required = true;

    const newOption = document.createElement("option");
    newOption.value = "__new__";
    newOption.textContent = "New tab";
    select.appendChild(newOption);

    targets.forEach((target) => {
      const option = document.createElement("option");
      option.value = target.id;
      option.textContent = target.label;
      select.appendChild(option);
    });

    const newTabWrap = document.createElement("label");
    newTabWrap.className = "playground-save-new-tab";
    newTabWrap.textContent = "Tab label";

    const nameInput = document.createElement("input");
    nameInput.type = "text";
    nameInput.autocomplete = "off";
    nameInput.placeholder = "New tab name";
    nameInput.maxLength = 48;
    newTabWrap.appendChild(nameInput);

    const warning = document.createElement("p");
    warning.className = "playground-save-warning";
    warning.setAttribute("aria-live", "polite");

    const error = document.createElement("p");
    error.className = "playground-save-error";
    error.setAttribute("aria-live", "polite");

    const actions = document.createElement("div");
    actions.className = "playground-save-actions";
    const cancelButton = document.createElement("button");
    cancelButton.type = "button";
    cancelButton.className = "playground-save-cancel";
    cancelButton.textContent = "Cancel";
    const submitButton = document.createElement("button");
    submitButton.type = "submit";
    submitButton.className = "playground-save-submit";
    submitButton.textContent = "Save";
    actions.append(cancelButton, submitButton);

    panel.append(title, targetLabel, select, newTabWrap, warning, error, actions);
    overlay.appendChild(panel);
    document.body.appendChild(overlay);

    const close = (value) => {
      overlay.remove();
      resolve(value);
    };

    const selectedTarget = () => targets.find((target) => target.id === select.value) || null;
    const updateMode = () => {
      const target = selectedTarget();
      const isNew = select.value === "__new__";
      newTabWrap.hidden = !isNew;
      nameInput.required = isNew;
      warning.textContent = target
        ? `Are you sure you want to modify ${target.label}. That change will be irreversible.`
        : "";
      error.textContent = "";
      if (isNew) {
        window.requestAnimationFrame(() => nameInput.focus());
      }
    };

    select.addEventListener("change", updateMode);
    cancelButton.addEventListener("click", () => close(null));
    overlay.addEventListener("mousedown", (event) => {
      if (event.target === overlay) {
        close(null);
      }
    });
    panel.addEventListener("submit", (event) => {
      event.preventDefault();
      error.textContent = "";
      if (select.value === "__new__") {
        const label = nameInput.value.trim().replace(/\s+/g, " ");
        if (!label) {
          error.textContent = "Name the new tab before saving.";
          nameInput.focus();
          return;
        }
        if (existingTabLabelSet().has(normalizeTabLabel(label))) {
          error.textContent = "A tab with that name already exists.";
          nameInput.focus();
          nameInput.select();
          return;
        }
        close({ mode: "new", label });
        return;
      }
      const target = selectedTarget();
      if (!target) {
        error.textContent = "Choose a tab to save to.";
        return;
      }
      close({ mode: "existing", target });
    });

    updateMode();
  });
}

async function savePlaygroundLayoutToGeneratedTab(layoutPayload, sourceRoots) {
  const selection = await openPlaygroundSaveTargetDialog();
  if (!selection) {
    return false;
  }
  const nextState = cloneJson(generatedTabsState) || { overrides: {}, customTabs: [] };
  nextState.overrides = nextState.overrides || {};
  nextState.customTabs = Array.isArray(nextState.customTabs) ? nextState.customTabs : [];
  const layout = cloneJson(layoutPayload);
  if (!layout) {
    throw new Error("Unable to save layout");
  }

  let targetId = null;
  if (selection.mode === "new") {
    targetId = uniqueGeneratedTabTarget(selection.label);
    nextState.customTabs.push({
      id: targetId,
      label: selection.label,
      layout,
    });
  } else {
    targetId = selection.target.id;
    if (selection.target.generated) {
      const customEntry = nextState.customTabs.find((entry) => entry.id === targetId);
      if (customEntry) {
        customEntry.layout = layout;
      }
    } else {
      nextState.overrides[targetId] = {
        label: selection.target.label,
        layout,
      };
    }
  }

  if (!writeGeneratedTabsState(nextState)) {
    throw new Error("Unable to persist generated tabs");
  }
  applyGeneratedTabsState(nextState, sourceRoots);
  if (targetId) {
    setActiveTab(targetId);
  }
  return true;
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
    core.querySelectorAll(":scope > .layout-resize-handle").forEach((handle) => handle.remove());
    core.style.translate = "";
    core.style.left = "";
    core.style.top = "";
    core.style.width = "";
    core.style.height = "";
  }
}

function setupPlagroundComposer(sourceRoots) {
  if (!playgroundCanvas || !playgroundComponentSelect) {
    return null;
  }
  // Default to a null selection so canvas clicks do nothing until the user picks a component.
  playgroundComponentSelect.value = "";

  let zCounter = 5;
  let dragState = null;
  let resizeState = null;
  let measurementPartGesture = null;
  let cnotPartGesture = null;
  let selectedItem = null;
  let statusTimer = null;

  const isSnapEnabled = () => !playgroundSnapToggle || playgroundSnapToggle.checked;
  const isPlaygroundQubitItem = (item) =>
    item instanceof HTMLElement && item.dataset.component === "qubit";
  const isPlaygroundSingleGateItem = (item) =>
    item instanceof HTMLElement && item.dataset.component === "single-gate";
  const isPlaygroundSingleMeasurementItem = (item) =>
    item instanceof HTMLElement && item.dataset.component === "single-measurement";
  const isPlaygroundDoubleMeasurementItem = (item) =>
    item instanceof HTMLElement && item.dataset.component === "double-measurement";
  const isPlaygroundMeasurementItem = (item) =>
    isPlaygroundSingleMeasurementItem(item) || isPlaygroundDoubleMeasurementItem(item);
  const minSizeForItem = (item) => {
    if (isPlaygroundQubitItem(item)) {
      return { minWidth: 12, minHeight: 12 };
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
  const PLAYGROUND_MEASUREMENT_OVERLAP_THRESHOLD = MEASUREMENT_OVERLAP_THRESHOLD;
  const playgroundSingleGateRuntime = new Map();
  const playgroundSingleMeasurementRuntime = new Map();
  const playgroundDoubleMeasurementRuntime = new Map();
  const playgroundCnotRuntime = new Map();
  const playgroundQubitRuntime = new Map();
  const playgroundCnotPartSpecs = [
    { key: "body", selector: ".cnot-body", minWidth: 120, minHeight: 90 },
    { key: "funnelTop", selector: ".cnot-input-funnel-top", minWidth: 24, minHeight: 40 },
    { key: "funnelBottom", selector: ".cnot-input-funnel-bottom", minWidth: 24, minHeight: 40 },
    { key: "windowTop", selector: ".cnot-porthole-top", minWidth: 30, minHeight: 30, uniform: true },
    { key: "windowBottom", selector: ".cnot-porthole-bottom", minWidth: 30, minHeight: 30, uniform: true },
    { key: "flangeTop", selector: ".cnot-output-flange-top", minWidth: 10, minHeight: 28 },
    { key: "flangeBottom", selector: ".cnot-output-flange-bottom", minWidth: 10, minHeight: 28 },
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
        cnotSourceSlot: null,
        cnotPairToken: null,
        cnotOutcomeProbabilities: null,
        doubleMeasurementReturnPoint: null,
      };
      playgroundQubitRuntime.set(item, state);
    }
    applyPlaygroundQubitVectorVisualState(item);
    return state;
  };

  const resolvePlaygroundMeasurementPartEntries = (item) => {
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
        element.addEventListener("touchstart", startPartGesture, { passive: false });
      }
    });
  };

  const preparePlaygroundMeasurementParts = (item) => {
    resolvePlaygroundMeasurementPartEntries(item).forEach(({ spec, element }) => {
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
        element.addEventListener("touchstart", startPartGesture, { passive: false });
      }
    });
  };

  const applyPlaygroundMeasurementLayoutSnapshot = (item, measurementLayout, options = {}) => {
    applyMeasurementLayoutSnapshot(
      item,
      measurementLayout,
      measurementPartSpecsForType(item.dataset.component),
      options
    );
  };

  const capturePlaygroundMeasurementLayoutSnapshot = (item) => {
    if (!isPlaygroundMeasurementItem(item)) {
      return null;
    }
    preparePlaygroundMeasurementParts(item);
    return captureMeasurementLayoutSnapshot(item, measurementPartSpecsForType(item.dataset.component));
  };

  const isPlagroundTabActive = () => {
    const panel = document.getElementById("panel-plaground");
    return panel instanceof HTMLElement && !panel.hidden;
  };

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

  const updateActionButtons = () => {
    const hasSelection = selectedItem instanceof HTMLElement && selectedItem.isConnected;
    if (playgroundDuplicateButton) {
      playgroundDuplicateButton.disabled = !hasSelection;
    }
    if (playgroundDeleteButton) {
      playgroundDeleteButton.disabled = !hasSelection;
    }
    if (playgroundSaveComponentButton) {
      playgroundSaveComponentButton.disabled = !hasSelection;
      playgroundSaveComponentButton.classList.toggle("active", hasSelection);
    }
  };

  const setSelectedItem = (item) => {
    if (selectedItem && selectedItem !== item) {
      selectedItem.classList.remove("selected");
    }
    if (!(item instanceof HTMLElement) || !item.isConnected) {
      selectedItem = null;
      updateActionButtons();
      return;
    }
    selectedItem = item;
    if (layoutEditorState.enabled) {
      selectedItem.classList.add("selected");
    } else {
      selectedItem.classList.remove("selected");
    }
    bringToFront(selectedItem);
    updateActionButtons();
  };

  const syncSelectionUiState = () => {
    const items = playgroundCanvas.querySelectorAll(".playground-node.selected");
    items.forEach((item) => item.classList.remove("selected"));
    if (layoutEditorState.enabled && selectedItem instanceof HTMLElement && selectedItem.isConnected) {
      selectedItem.classList.add("selected");
    }
  };

  const clampItemPosition = (item, left, top, { snap = true } = {}) => {
    const maxLeft = Math.max(0, playgroundCanvas.clientWidth - item.offsetWidth);
    const maxTop = Math.max(0, playgroundCanvas.clientHeight - item.offsetHeight);
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
      x: rect.left - canvasRect.left + playgroundCanvas.scrollLeft + rect.width / 2,
      y: rect.top - canvasRect.top + playgroundCanvas.scrollTop + rect.height / 2,
    };
  };

  const setPlaygroundQubitCenter = (qubitItem, x, y) => {
    const safeX = Number.isFinite(x) ? x : playgroundCanvas.clientWidth / 2;
    const safeY = Number.isFinite(y) ? y : playgroundCanvas.clientHeight / 2;
    const nextLeft = safeX - qubitItem.offsetWidth / 2;
    const nextTop = safeY - qubitItem.offsetHeight / 2;
    const clamped = clampItemPosition(qubitItem, nextLeft, nextTop, { snap: false });
    qubitItem.style.left = `${Math.round(clamped.left)}px`;
    qubitItem.style.top = `${Math.round(clamped.top)}px`;
  };

  const qubitOverlapRatioWithRect = (qubitItem, target) => {
    const qubitRect = qubitItem.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();
    const overlapWidth = Math.max(
      0,
      Math.min(qubitRect.right, targetRect.right) - Math.max(qubitRect.left, targetRect.left)
    );
    const overlapHeight = Math.max(
      0,
      Math.min(qubitRect.bottom, targetRect.bottom) - Math.max(qubitRect.top, targetRect.top)
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
    const alpha = Math.acos((distance * distance + a1 - a2) / (2 * distance * r1));
    const beta = Math.acos((distance * distance + a2 - a1) / (2 * distance * r2));

    return (
      a1 * alpha +
      a2 * beta -
      0.5 *
        Math.sqrt(
          (-distance + r1 + r2) *
            (distance + r1 - r2) *
            (distance - r1 + r2) *
            (distance + r1 + r2)
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
    const overlapArea = circleIntersectionArea(qRadius, lensCircle.radius, distance);
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

  const movePlaygroundQubitToPoint = (qubitItem, x, y, duration = AUTO_TRAVEL_MS) =>
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
      initialTick: Number.isFinite(Number.parseInt(item.dataset.playgroundSingleGateTick, 10))
        ? Number.parseInt(item.dataset.playgroundSingleGateTick, 10)
        : runtime.activeTick,
      tickAriaLabelPrefix: "Tick",
      orbitInset: 10,
      canInteract: () => !layoutEditorState.enabled && !runtime.busy,
      onTickChange: (tick) => {
        runtime.activeTick = normalizeTickIndex(tick);
      },
    });
    runtime.activeTick = runtime.dial?.getTick() ?? runtime.activeTick;

    runtime.dial?.layout();
    alignPlaygroundGateSpring(runtime);

    gateArrow.addEventListener("mousedown", (event) => runtime.dial?.beginDrag(event));
    gateArrow.addEventListener(
      "touchstart",
      (event) => runtime.dial?.beginDrag(event),
      { passive: false }
    );
    gateArrow.addEventListener("keydown", (event) => runtime.dial?.handleKeydown(event));

    playgroundSingleGateRuntime.set(item, runtime);
    return runtime;
  };

  const findBestPlaygroundGateRuntimeForQubit = (qubitItem) => {
    prunePlaygroundRuntimeState();
    let bestRuntime = null;
    let bestOverlap = PLAYGROUND_GATE_FUNNEL_OVERLAP_THRESHOLD;
    const gateItems = playgroundCanvas.querySelectorAll('.playground-node[data-component="single-gate"]');
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
    if (!isPlaygroundQubitItem(qubitItem) || !gateRuntime || layoutEditorState.enabled) {
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
      await movePlaygroundQubitToPoint(qubitItem, gateCenter.x, gateCenter.y, AUTO_TRAVEL_MS);
      if (layoutEditorState.enabled) {
        return false;
      }

      await wait(GATE_TUBE_DWELL_MS);
      if (layoutEditorState.enabled) {
        return false;
      }

      qubitState.vector = normalizeVector2(
        vectorTimesMatrix2(qubitState.vector, gateMatrixForTick(gateRuntime.activeTick))
      );
      qubitState.cnotSourceSlot = null;
      qubitState.cnotPairToken = null;
      qubitState.cnotOutcomeProbabilities = null;
      qubitState.doubleMeasurementReturnPoint = null;
      applyPlaygroundQubitVectorVisualState(qubitItem);

      settlePlaygroundQubitVisualState(qubitItem);
      const platformCenter = canvasPointForElementCenter(gateRuntime.gatePlatform);
      const retractedPlatformPoint = {
        x: platformCenter.x,
        y: gateCenter.y,
      };
      setPlaygroundQubitCenter(qubitItem, retractedPlatformPoint.x, retractedPlatformPoint.y);
      await nextFrame();
      if (layoutEditorState.enabled) {
        return false;
      }

      gateRuntime.item.classList.add("platform-extended");
      const canvasRect = playgroundCanvas.getBoundingClientRect();
      const pipeRect = gateRuntime.gateWindow.getBoundingClientRect();
      const qubitRect = qubitItem.getBoundingClientRect();
      const ejectedCenter = {
        x: pipeRect.right - canvasRect.left + playgroundCanvas.scrollLeft + 100 + qubitRect.width / 2,
        y: retractedPlatformPoint.y,
      };
      await movePlaygroundQubitToPoint(
        qubitItem,
        ejectedCenter.x,
        ejectedCenter.y,
        GATE_PLATFORM_EXTEND_MS
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
    const body = item.querySelector(".cnot-body, .ent-pipe, [data-part='body']");
    const funnelTop = item.querySelector(".cnot-input-funnel-top, [data-part='funnel-top']");
    const funnelBottom = item.querySelector(".cnot-input-funnel-bottom, [data-part='funnel-bottom']");
    const windowTop = item.querySelector(".cnot-porthole-top, [data-part='window-top']");
    const windowBottom = item.querySelector(".cnot-porthole-bottom, [data-part='window-bottom']");
    if (
      !(body instanceof HTMLElement) ||
      !(funnelTop instanceof HTMLElement) ||
      !(funnelBottom instanceof HTMLElement) ||
      !(windowTop instanceof HTMLElement) ||
      !(windowBottom instanceof HTMLElement)
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
      slotOccupants: {
        top: null,
        bottom: null,
      },
      busy: false,
      cyclePromise: null,
    };
    playgroundCnotRuntime.set(item, runtime);
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
    const cnotItems = playgroundCanvas.querySelectorAll('.playground-node[data-component="cnot-gate"]');
    cnotItems.forEach((cnotItem) => {
      const runtime = ensurePlaygroundCnotRuntime(cnotItem);
      if (!runtime || runtime.busy) {
        return;
      }
      [
        { slot: "top", funnel: runtime.funnelTop, occupant: runtime.slotOccupants.top },
        { slot: "bottom", funnel: runtime.funnelBottom, occupant: runtime.slotOccupants.bottom },
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
    const topSign = topState.vector[1] < 0 ? -1 : 1;
    const bottomSign = bottomState.vector[1] < 0 ? -1 : 1;
    const marginals = cnotMarginalProbabilitiesFromQubitVectors(topState.vector, bottomState.vector);

    topState.vector = canonicalizeRealAmplitudeVector([
      Math.sqrt(clamp(marginals.control[0], 0, 1)),
      topSign * Math.sqrt(clamp(marginals.control[1], 0, 1)),
    ]);
    bottomState.vector = canonicalizeRealAmplitudeVector([
      Math.sqrt(clamp(marginals.target[0], 0, 1)),
      bottomSign * Math.sqrt(clamp(marginals.target[1], 0, 1)),
    ]);

    applyPlaygroundQubitVectorVisualState(topQubitItem);
    applyPlaygroundQubitVectorVisualState(bottomQubitItem);
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

        const cnotOutcomeProbabilities = cnotOutcomeProbabilitiesFromQubitVectors(
          topState.vector,
          bottomState.vector
        );
        const pairToken = `${Date.now()}-${Math.random()}`;
        applyPlaygroundCnotToQubitStates(topQubit, bottomQubit);
        topState.cnotSourceSlot = "top";
        bottomState.cnotSourceSlot = "bottom";
        topState.cnotPairToken = pairToken;
        bottomState.cnotPairToken = pairToken;
        topState.cnotOutcomeProbabilities = cnotOutcomeProbabilities;
        bottomState.cnotOutcomeProbabilities = cnotOutcomeProbabilities;

        const topWindowCenter = canvasPointForElementCenter(runtime.windowTop);
        const bottomWindowCenter = canvasPointForElementCenter(runtime.windowBottom);
        setPlaygroundQubitCenter(topQubit, topWindowCenter.x, topWindowCenter.y);
        setPlaygroundQubitCenter(bottomQubit, bottomWindowCenter.x, bottomWindowCenter.y);
        await nextFrame();

        runtime.body.classList.add("platform-extended");
        const canvasRect = playgroundCanvas.getBoundingClientRect();
        const bodyRect = runtime.body.getBoundingClientRect();
        const topQubitRect = topQubit.getBoundingClientRect();
        const bottomQubitRect = bottomQubit.getBoundingClientRect();
        const topEjectedCenter = {
          x:
            bodyRect.right -
            canvasRect.left +
            playgroundCanvas.scrollLeft +
            50 +
            topQubitRect.width / 2,
          y: topWindowCenter.y,
        };
        const bottomEjectedCenter = {
          x:
            bodyRect.right -
            canvasRect.left +
            playgroundCanvas.scrollLeft +
            50 +
            bottomQubitRect.width / 2,
          y: bottomWindowCenter.y,
        };
        await Promise.all([
          movePlaygroundQubitToPoint(
            topQubit,
            topEjectedCenter.x,
            topEjectedCenter.y,
            GATE_PLATFORM_EXTEND_MS
          ),
          movePlaygroundQubitToPoint(
            bottomQubit,
            bottomEjectedCenter.x,
            bottomEjectedCenter.y,
            GATE_PLATFORM_EXTEND_MS
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
      const targetWindow = slotKey === "top" ? runtime.windowTop : runtime.windowBottom;
      const center = canvasPointForElementCenter(targetWindow);
      await movePlaygroundQubitToPoint(
        qubitItem,
        center.x,
        center.y,
        AUTO_TRAVEL_MS
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
    runPlaygroundCnotIngress(qubitItem, target.runtime, target.slot).catch(() => {});
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

    const measurementTool = item.querySelector('[data-role="measurement-tool"]');
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
      100
    );
    const redFillPercent = Math.min(
      (runtime.redTubeCount / runtime.tubeQubitCapacity) * 100,
      100
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
    const largestTubeCount = Math.max(runtime.blueTubeCount, runtime.redTubeCount);
    while (largestTubeCount > runtime.tubeQubitCapacity) {
      runtime.tubeQubitCapacity *= 2;
    }
  };

  const collapsePlaygroundQubitState = (qubitItem) => {
    const qubitState = ensurePlaygroundQubitRuntimeState(qubitItem);
    if (!qubitState) {
      return "blue";
    }
    const [blueProbability] = probabilitiesFromVector2(qubitState.vector);
    const collapseToBlue =
      blueProbability >= 1 || (blueProbability > 0 && Math.random() < blueProbability);
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
    payload.style.setProperty("--qubit-fill", color === "blue" ? blendBlueRed(1, 0) : blendBlueRed(0, 1));
    playgroundCanvas.appendChild(payload);
    return payload;
  };

  const movePlaygroundPayloadToPoint = (payload, x, y, duration = AUTO_TRAVEL_MS) =>
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
    { migrationDuration = AUTO_TRAVEL_MS, meltDuration = AUTO_MELT_MS } = {}
  ) => {
    const payload = createPlaygroundMeasurementPayload(collapsedColor, startPoint);
    try {
      const targetTube = collapsedColor === "blue" ? runtime.tubeBlue : runtime.tubeRed;
      const targetRect = targetTube.getBoundingClientRect();
      const targetPoint = viewportPointToCanvasPoint(
        targetRect.left + targetRect.width / 2,
        targetRect.top + targetRect.height * 0.22
      );

      await movePlaygroundPayloadToPoint(
        payload,
        targetPoint.x,
        targetPoint.y,
        migrationDuration
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

  const runPlaygroundSingleMeasurementTransit = async (qubitItem, measurementRuntime) => {
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
        lensCenter
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
      '.playground-node[data-component="single-measurement"]'
    );
    measurementItems.forEach((measurementItem) => {
      const runtime = ensurePlaygroundSingleMeasurementRuntime(measurementItem);
      if (!runtime || runtime.busy) {
        return;
      }
      const overlap = Math.max(
        playgroundQubitOverlapRatioWithLens(qubitItem, runtime),
        qubitOverlapRatioWithRect(qubitItem, runtime.measurementTool)
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
    const measurementRuntime = findBestPlaygroundMeasurementRuntimeForQubit(qubitItem);
    if (!measurementRuntime) {
      return false;
    }
    runPlaygroundSingleMeasurementTransit(qubitItem, measurementRuntime).catch(() => {});
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
    const measurementFunnel = item.querySelector('[data-role="pair-measurement-funnel"]');
    const slotLeft = item.querySelector('[data-role="pair-slot-left"]');
    const slotRight = item.querySelector('[data-role="pair-slot-right"]');
    const platform = item.querySelector(".pair-measurement-platform");
    const capacity = item.querySelector('[data-role="pair-capacity"]');
    const columns = Array.from(item.querySelectorAll(".pair-tube-column[data-key]"));
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
      if (tube instanceof HTMLElement && liquid instanceof HTMLElement && count instanceof HTMLElement) {
        tubeElements[key] = tube;
        liquidElements[key] = liquid;
        countElements[key] = count;
      }
    });
    const requiredKeys = ["bb", "br", "rb", "rr"];
    if (!requiredKeys.every((key) => tubeElements[key] && liquidElements[key] && countElements[key])) {
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
    Array.from(playgroundDoubleMeasurementRuntime.values()).forEach((runtime) => {
      if (runtime.slotOccupants.left === qubitItem) {
        runtime.slotOccupants.left = null;
      }
      if (runtime.slotOccupants.right === qubitItem) {
        runtime.slotOccupants.right = null;
      }
    });
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

  const playgroundQubitOverlapRatioWithDoubleMeasurementLens = (qubitItem, runtime) => {
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
    const overlapArea = circleIntersectionArea(qRadius, lensCircle.radius, distance);
    const qubitArea = Math.PI * qRadius * qRadius;
    return qubitArea > 0 ? overlapArea / qubitArea : 0;
  };

  const findBestPlaygroundDoubleMeasurementRuntimeForQubit = (qubitItem) => {
    prunePlaygroundRuntimeState();
    let bestRuntime = null;
    let bestOverlap = PLAYGROUND_MEASUREMENT_OVERLAP_THRESHOLD;
    const measurementItems = playgroundCanvas.querySelectorAll(
      '.playground-node[data-component="double-measurement"]'
    );
    measurementItems.forEach((measurementItem) => {
      const runtime = ensurePlaygroundDoubleMeasurementRuntime(measurementItem);
      if (!runtime || runtime.busy) {
        return;
      }
      const overlap = Math.max(
        playgroundQubitOverlapRatioWithDoubleMeasurementLens(qubitItem, runtime),
        qubitOverlapRatioWithRect(qubitItem, runtime.measurementTool)
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
      lensRect.top + lensRect.height / 2
    );
    const laneOffset = Math.max(20, lensRect.width * 0.12);
    return {
      x: lensCenter.x + (slot === "right" ? laneOffset : -laneOffset) + TWO_QUBIT_MEASUREMENT_SLOT_SHIFT_X,
      y: lensCenter.y + TWO_QUBIT_MEASUREMENT_SLOT_SHIFT_Y,
    };
  };

  const collapsePlaygroundQubitPairFromCnot = (topQubitItem, bottomQubitItem) => {
    const topState = ensurePlaygroundQubitRuntimeState(topQubitItem);
    const bottomState = ensurePlaygroundQubitRuntimeState(bottomQubitItem);
    if (!topState || !bottomState) {
      return null;
    }

    let probabilities = null;
    if (
      topState.cnotPairToken &&
      topState.cnotPairToken === bottomState.cnotPairToken &&
      topState.cnotOutcomeProbabilities &&
      bottomState.cnotOutcomeProbabilities
    ) {
      probabilities = topState.cnotOutcomeProbabilities;
    } else {
      probabilities = cnotOutcomeProbabilitiesFromQubitVectors(topState.vector, bottomState.vector);
    }
    const outcomeKey = samplePairOutcomeFromProbabilities(probabilities);
    const topBlue = outcomeKey[0] === "b";
    const bottomBlue = outcomeKey[1] === "b";
    topState.vector = topBlue ? [1, 0] : [0, 1];
    bottomState.vector = bottomBlue ? [1, 0] : [0, 1];
    topState.cnotSourceSlot = null;
    bottomState.cnotSourceSlot = null;
    topState.cnotPairToken = null;
    bottomState.cnotPairToken = null;
    topState.cnotOutcomeProbabilities = null;
    bottomState.cnotOutcomeProbabilities = null;
    applyPlaygroundQubitVectorVisualState(topQubitItem);
    applyPlaygroundQubitVectorVisualState(bottomQubitItem);
    return {
      outcomeKey,
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
        const collapseResult = collapsePlaygroundQubitPairFromCnot(rightQubit, leftQubit);
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

        const leftReturn =
          (leftState.doubleMeasurementReturnPoint &&
            Number.isFinite(leftState.doubleMeasurementReturnPoint.x) &&
            Number.isFinite(leftState.doubleMeasurementReturnPoint.y))
            ? leftState.doubleMeasurementReturnPoint
            : playgroundDoubleMeasurementSlotCenter(runtime, "left");
        const rightReturn =
          (rightState.doubleMeasurementReturnPoint &&
            Number.isFinite(rightState.doubleMeasurementReturnPoint.x) &&
            Number.isFinite(rightState.doubleMeasurementReturnPoint.y))
            ? rightState.doubleMeasurementReturnPoint
            : playgroundDoubleMeasurementSlotCenter(runtime, "right");

        leftState.vector = [1, 0];
        rightState.vector = [1, 0];
        applyPlaygroundQubitVectorVisualState(leftQubit);
        applyPlaygroundQubitVectorVisualState(rightQubit);

        await Promise.all([
          movePlaygroundQubitToPoint(leftQubit, leftReturn.x, leftReturn.y, AUTO_TRAVEL_MS),
          movePlaygroundQubitToPoint(rightQubit, rightReturn.x, rightReturn.y, AUTO_TRAVEL_MS),
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
    if (!isPlaygroundQubitItem(qubitItem) || !runtime || runtime.busy || layoutEditorState.enabled) {
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

    qubitState.doubleMeasurementReturnPoint = canvasPointForElementCenter(qubitItem);
    qubitState.transiting = true;
    runtime.slotOccupants[slot] = qubitItem;
    if (dragState && dragState.item === qubitItem) {
      qubitItem.classList.remove("dragging");
      dragState = null;
    }

    try {
      const center = playgroundDoubleMeasurementSlotCenter(runtime, slot);
      await movePlaygroundQubitToPoint(qubitItem, center.x, center.y, AUTO_TRAVEL_MS);
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
    const runtime = findBestPlaygroundDoubleMeasurementRuntimeForQubit(qubitItem);
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
    return point.clientX >= rect.right - cornerInset && point.clientY >= rect.bottom - cornerInset;
  };

  const findPlaygroundMeasurementPartFromEvent = (item, event) => {
    if (!layoutEditorState.enabled || !isPlaygroundMeasurementItem(item)) {
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
      event.target instanceof Element && Boolean(event.target.closest(".layout-resize-handle"));
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
    setSelectedItem(item);
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
      event.target instanceof Element && Boolean(event.target.closest(".layout-resize-handle"));
    const mode =
      isResizeHandle || pointerNearResizeCorner(part, point, 18)
        ? "resize"
        : "move";
    const initialTranslate = layoutTargetTranslate(part);
    if (part.classList.contains("cnot-body") || part.classList.contains("ent-pipe")) {
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
    setSelectedItem(item);
    event.preventDefault();
    event.stopPropagation();
    return true;
  };

  const beginItemDrag = (item, event) => {
    const runtimeQubitDrag = !layoutEditorState.enabled && isPlaygroundQubitItem(item);
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
    if (layoutEditorState.enabled) {
      preparePlaygroundMeasurementParts(item);
      preparePlaygroundCnotParts(item);
      const measurementPart = findPlaygroundMeasurementPartFromEvent(item, event);
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
    if (runtimeQubitDrag) {
      releasePlaygroundQubitFromCnotSlots(item);
      releasePlaygroundQubitFromDoubleMeasurementSlots(item);
    }
    bringToFront(item);
    setSelectedItem(item);
    const itemRect = item.getBoundingClientRect();
    dragState = {
      item,
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
          cnotPartGesture.startWidth + deltaX
        );
        let nextHeight = Math.max(
          cnotPartGesture.minHeight,
          cnotPartGesture.startHeight + deltaY
        );
        if (cnotPartGesture.uniformResize) {
          const uniformSize = Math.max(
            nextWidth,
            nextHeight,
            cnotPartGesture.minWidth,
            cnotPartGesture.minHeight
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
          cnotPartGesture.startTy + deltaY
        );
      }
      setLayoutManualEdited(cnotPartGesture.part, true);
      setLayoutManualEdited(cnotPartGesture.item, true);
      setLayoutSaveButtonSavedState(false);
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
          measurementPartGesture.startWidth + deltaX
        );
        let nextHeight = Math.max(
          measurementPartGesture.minHeight,
          measurementPartGesture.startHeight + deltaY
        );
        if (measurementPartGesture.uniformResize) {
          const uniformSize = Math.max(
            nextWidth,
            nextHeight,
            measurementPartGesture.minWidth,
            measurementPartGesture.minHeight
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
          measurementPartGesture.startTy + deltaY
        );
      }
      setLayoutManualEdited(measurementPartGesture.part, true);
      setLayoutManualEdited(measurementPartGesture.item, true);
      setLayoutSaveButtonSavedState(false);
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
          : (resizeState.aspectRatio > 0 ? resizeState.aspectRatio : 1);
        const widthDriven = resizeState.startWidth + deltaX;
        const heightDriven = (resizeState.startHeight + deltaY) * ratio;
        const preferredWidth =
          Math.abs(deltaX) >= Math.abs(deltaY) ? widthDriven : heightDriven;
        const limits = clampItemSize(resizeState.item, preferredWidth, resizeState.startHeight);
        const minWidthForRatio = Math.max(limits.minWidth, limits.minHeight * ratio);
        const maxWidthForRatio = Math.min(limits.maxWidth, limits.maxHeight * ratio);
        const safeMinWidth = Math.min(minWidthForRatio, maxWidthForRatio);
        width = clamp(sizeSnapValue(resizeState.item, preferredWidth), safeMinWidth, maxWidthForRatio);
        height = width / ratio;
        resizeState.item.style.width = `${Math.round(width)}px`;
        resizeState.item.style.height = `${Math.round(height)}px`;
        applyCnotGeometryScale(resizeState.item, resizeState.cnotBaseline, width, height);
        setLayoutManualEdited(resizeState.item, true);
        setLayoutSaveButtonSavedState(false);
        return;
      }
      const clampedSize = clampItemSize(resizeState.item, width, height);
      resizeState.item.style.width = `${Math.round(clampedSize.width)}px`;
      resizeState.item.style.height = `${Math.round(clampedSize.height)}px`;
      applyCnotGeometryScale(
        resizeState.item,
        resizeState.cnotBaseline,
        clampedSize.width,
        clampedSize.height
      );
      setLayoutManualEdited(resizeState.item, true);
      setLayoutSaveButtonSavedState(false);
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
      point.clientX - canvasRect.left + playgroundCanvas.scrollLeft - dragState.pointerOffsetX;
    const top =
      point.clientY - canvasRect.top + playgroundCanvas.scrollTop - dragState.pointerOffsetY;
    const clamped = clampItemPosition(dragState.item, left, top);
    dragState.item.style.left = `${Math.round(clamped.left)}px`;
    dragState.item.style.top = `${Math.round(clamped.top)}px`;
    if (layoutEditorState.enabled) {
      setLayoutManualEdited(dragState.item, true);
      setLayoutSaveButtonSavedState(false);
    } else if (isPlaygroundQubitItem(dragState.item)) {
      if (maybeSnapPlaygroundQubitToSingleGate(dragState.item)) {
        return;
      }
      if (maybeSnapPlaygroundQubitToSingleMeasurement(dragState.item)) {
        return;
      }
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
    }
    dragState = null;
  };

  const createItem = (type, geometry = null) => {
    const config = PLAYGROUND_COMPONENT_LIBRARY[type] || PLAYGROUND_COMPONENT_LIBRARY.qubit;
    const defaultsGeometry = defaultsGeometryForComponentType(type);
    const componentNode = createPlaygroundComponentNode(type, sourceRoots);
    let item = componentNode instanceof HTMLElement ? componentNode : document.createElement("div");
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
    const minSize = minSizeForItem(item);
    const width = Number.isFinite(geometry?.width)
      ? geometry.width
      : (Number.isFinite(defaultsGeometry?.width) ? defaultsGeometry.width : config.width);
    const height = Number.isFinite(geometry?.height)
      ? geometry.height
      : (Number.isFinite(defaultsGeometry?.height) ? defaultsGeometry.height : config.height);
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
        { includeGroupGeometry: !geometry }
      );
      if (geometry?.measurementLayout) {
        applyPlaygroundMeasurementLayoutSnapshot(item, geometry.measurementLayout, {
          includeGroupGeometry: false,
        });
      }
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
      setSelectedItem(item);
    });
    item.addEventListener(
      "touchstart",
      () => {
        bringToFront(item);
        setSelectedItem(item);
      },
      { passive: true }
    );
    item.addEventListener("mousedown", (event) => beginItemDrag(item, event));
    item.addEventListener(
      "touchstart",
      (event) => beginItemDrag(item, event),
      { passive: false }
    );

    if (geometry && Number.isFinite(geometry.left) && Number.isFinite(geometry.top)) {
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
    refreshLayoutEditTargets();
    preparePlaygroundCnotParts(item);
    preparePlaygroundMeasurementParts(item);
  };

  const serializeItems = () =>
    Array.from(playgroundCanvas.querySelectorAll(".playground-node")).map((item) => {
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
      return serialized;
    });

  const buildLayoutPayload = () => ({
    items: serializeItems(),
    gridSnap: isSnapEnabled(),
    canvasWidth: playgroundCanvas.offsetWidth,
    canvasHeight: playgroundCanvas.offsetHeight,
    savedAt: Date.now(),
  });

  const normalizeTabLabelInput = (value) => String(value || "").trim().replace(/\s+/g, " ");

  const selectedProductionTargetId = () =>
    editorTargetTabSelect instanceof HTMLSelectElement && editorTargetTabSelect.value
      ? editorTargetTabSelect.value
      : "__new__";

  const targetById = (targetId) =>
    collectPlaygroundSaveTargets().find((target) => target.id === targetId) || null;

  const refreshEditorTabControls = (preferredTarget = null) => {
    if (!(editorTargetTabSelect instanceof HTMLSelectElement)) {
      return;
    }
    const prior = preferredTarget || selectedProductionTargetId();
    const targets = collectPlaygroundSaveTargets();
    editorTargetTabSelect.replaceChildren();
    const newOption = document.createElement("option");
    newOption.value = "__new__";
    newOption.textContent = "New tab (blank)";
    editorTargetTabSelect.appendChild(newOption);
    targets.forEach((target) => {
      const option = document.createElement("option");
      option.value = target.id;
      option.textContent = target.label;
      editorTargetTabSelect.appendChild(option);
    });
    const validValues = new Set(["__new__", ...targets.map((target) => target.id)]);
    const nextValue = validValues.has(prior) ? prior : "__new__";
    editorTargetTabSelect.value = nextValue;
    const isNew = nextValue === "__new__";
    const selectedTarget = targetById(nextValue);
    if (editorNewTabName instanceof HTMLInputElement) {
      editorNewTabName.hidden = !isNew;
      editorNewTabName.required = isNew;
    }
    if (editorOpenTabButton) {
      editorOpenTabButton.disabled = isNew;
    }
    if (editorRenameTabButton) {
      editorRenameTabButton.disabled = !selectedTarget || !selectedTarget.generated;
    }
    if (editorDeleteTabButton) {
      editorDeleteTabButton.disabled = !selectedTarget || !selectedTarget.generated;
    }
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
    payload.items.forEach((geometry) => {
      const type = typeof geometry.type === "string" ? geometry.type : "qubit";
      const item = createItem(type, geometry);
      appendItemToCanvas(item);
    });
    if (statusText) {
      setStatus(statusText);
    }
    return true;
  };

  const saveLayout = async ({ forceNew = false } = {}) => {
    persistVisiblePlaygroundComponentDefaultsFromDom();
    persistPrimaryTwoQubitMeasurementDefaultsFromDom();
    const payload = buildLayoutPayload();
    const layout = cloneJson(payload);
    if (!layout) {
      setStatus("Save failed");
      return false;
    }

    const targetId = forceNew ? "__new__" : selectedProductionTargetId();
    const nextState = cloneJson(generatedTabsState) || { overrides: {}, customTabs: [] };
    nextState.overrides = nextState.overrides || {};
    nextState.customTabs = Array.isArray(nextState.customTabs) ? nextState.customTabs : [];

    let savedLabel = "";
    let savedTargetId = targetId;
    if (targetId === "__new__") {
      let label = normalizeTabLabelInput(editorNewTabName?.value);
      if (forceNew && !label) {
        label = normalizeTabLabelInput(window.prompt("Name for new tab", ""));
      }
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
      nextState.customTabs.push({
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
        setStatus("Choose a production tab");
        return false;
      }
      savedLabel = target.label;
      if (target.generated) {
        const customEntry = nextState.customTabs.find((entry) => entry.id === targetId);
        if (!customEntry) {
          setStatus("Save failed");
          return false;
        }
        customEntry.layout = layout;
      } else {
        nextState.overrides[targetId] = {
          label: target.label,
          layout,
        };
      }
    }

    if (!writeGeneratedTabsState(nextState)) {
      setStatus("Save failed");
      return false;
    }
    applyGeneratedTabsState(nextState, sourceRoots);
    refreshEditorTabControls(savedTargetId);
    try {
      window.localStorage.setItem(PLAYGROUND_LAYOUT_STORAGE_KEY, JSON.stringify(payload));
    } catch (_error) {
      // Keep tab save successful even if local draft persistence fails.
    }
    setStatus(`Saved to ${savedLabel}`);
    return true;
  };

  const clearLayout = ({ clearStorage = false } = {}) => {
    playgroundCanvas.querySelectorAll(".playground-node").forEach((item) => item.remove());
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

  const openSelectedProductionTab = () => {
    const targetId = selectedProductionTargetId();
    if (targetId === "__new__") {
      clearLayout();
      setStatus("Blank tab ready");
      return true;
    }
    const target = targetById(targetId);
    if (!target) {
      setStatus("Choose a production tab");
      return false;
    }
    let layout = null;
    if (target.generated) {
      const customEntry = (generatedTabsState.customTabs || []).find((entry) => entry.id === targetId);
      layout = customEntry?.layout || null;
    } else {
      layout = generatedTabsState.overrides?.[targetId]?.layout || null;
    }
    if (!layout) {
      setStatus("No saved editor layout for this tab yet");
      return false;
    }
    return applyLayoutPayloadToEditor(layout, { statusText: `Opened ${target.label}` });
  };

  const startNewBlankTabDraft = () => {
    clearLayout();
    refreshEditorTabControls("__new__");
    editorNewTabName?.focus();
    setStatus("Blank tab ready");
  };

  const renameSelectedProductionTab = () => {
    const targetId = selectedProductionTargetId();
    const target = targetById(targetId);
    if (!target || !target.generated) {
      setStatus("Only custom tabs can be renamed");
      return false;
    }
    const nextLabel = normalizeTabLabelInput(window.prompt("Rename tab", target.label));
    if (!nextLabel) {
      return false;
    }
    const normalizedNext = normalizeTabLabel(nextLabel);
    const duplicate = collectPlaygroundSaveTargets().some(
      (entry) => entry.id !== targetId && normalizeTabLabel(entry.label) === normalizedNext
    );
    if (duplicate) {
      setStatus("A tab with that name already exists");
      return false;
    }
    const nextState = cloneJson(generatedTabsState) || { overrides: {}, customTabs: [] };
    nextState.overrides = nextState.overrides || {};
    nextState.customTabs = Array.isArray(nextState.customTabs) ? nextState.customTabs : [];
    const entry = nextState.customTabs.find((candidate) => candidate.id === targetId);
    if (!entry) {
      setStatus("Rename failed");
      return false;
    }
    entry.label = nextLabel;
    if (!writeGeneratedTabsState(nextState)) {
      setStatus("Rename failed");
      return false;
    }
    applyGeneratedTabsState(nextState, sourceRoots);
    refreshEditorTabControls(targetId);
    setStatus(`Renamed to ${nextLabel}`);
    return true;
  };

  const deleteSelectedProductionTab = () => {
    const targetId = selectedProductionTargetId();
    const target = targetById(targetId);
    if (!target || !target.generated) {
      setStatus("Only custom tabs can be deleted");
      return false;
    }
    const confirmed = window.confirm(`Delete "${target.label}"? This cannot be undone.`);
    if (!confirmed) {
      return false;
    }
    const nextState = cloneJson(generatedTabsState) || { overrides: {}, customTabs: [] };
    nextState.overrides = nextState.overrides || {};
    nextState.customTabs = Array.isArray(nextState.customTabs) ? nextState.customTabs : [];
    nextState.customTabs = nextState.customTabs.filter((entry) => entry.id !== targetId);
    if (!writeGeneratedTabsState(nextState)) {
      setStatus("Delete failed");
      return false;
    }
    if (document.querySelector(".tab-btn.active")?.getAttribute("data-tab-target") === targetId) {
      setActiveTab("plaground");
    }
    applyGeneratedTabsState(nextState, sourceRoots);
    refreshEditorTabControls("__new__");
    setStatus(`Deleted ${target.label}`);
    return true;
  };

  const duplicateSelected = () => {
    if (!(selectedItem instanceof HTMLElement)) {
      return false;
    }
    const type = selectedItem.dataset.component || "qubit";
    const geometry = {
      left: parseLayoutNumeric(selectedItem.style.left, 0) + PLAYGROUND_GRID_SIZE,
      top: parseLayoutNumeric(selectedItem.style.top, 0) + PLAYGROUND_GRID_SIZE,
      width: selectedItem.offsetWidth,
      height: selectedItem.offsetHeight,
    };
    const measurementLayout = capturePlaygroundMeasurementLayoutSnapshot(selectedItem);
    if (measurementLayout) {
      geometry.measurementLayout = measurementLayout;
    }
    if (isPlaygroundCnotItem(selectedItem)) {
      preparePlaygroundCnotParts(selectedItem);
      const cnotLayout = captureCnotComponentDefaultsFromElement(selectedItem);
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

  const deleteSelected = () => {
    if (!(selectedItem instanceof HTMLElement)) {
      return false;
    }
    const doomed = selectedItem;
    if (isPlaygroundQubitItem(doomed)) {
      releasePlaygroundQubitFromCnotSlots(doomed);
      releasePlaygroundQubitFromDoubleMeasurementSlots(doomed);
    }
    playgroundSingleGateRuntime.delete(doomed);
    playgroundSingleMeasurementRuntime.delete(doomed);
    playgroundDoubleMeasurementRuntime.delete(doomed);
    playgroundCnotRuntime.delete(doomed);
    playgroundQubitRuntime.delete(doomed);
    setSelectedItem(null);
    doomed.remove();
    prunePlaygroundRuntimeState();
    setStatus("Deleted");
    return true;
  };

  const saveSelectedComponent = () => {
    if (!(selectedItem instanceof HTMLElement)) {
      setStatus("Select a component first");
      return false;
    }
    const selectedType = selectedItem.dataset.component || "qubit";
    const geometryExtras = {};
    if (selectedType === "single-gate") {
      const runtime = ensurePlaygroundSingleGateRuntime(selectedItem);
      const singleGateTick = runtime?.dial?.getTick();
      if (Number.isFinite(singleGateTick)) {
        geometryExtras.singleGateTick = normalizeTickIndex(singleGateTick);
      }
    }
    if (
      !persistPlaygroundComponentGeometryDefaultsFromElement(selectedType, selectedItem, geometryExtras)
    ) {
      setStatus("Component save failed");
      return false;
    }
    if (isPlaygroundCnotItem(selectedItem)) {
      preparePlaygroundCnotParts(selectedItem);
      if (!persistPlaygroundCnotDefaultsFromDom(selectedItem)) {
        setStatus("Component save failed");
        return false;
      }
      setStatus("C-NOT component saved");
      return true;
    }
    if (selectedItem instanceof HTMLElement && isMeasurementComponentType(selectedType)) {
      preparePlaygroundMeasurementParts(selectedItem);
      if (!persistPlaygroundMeasurementDefaultsFromDom(selectedType, selectedItem)) {
        setStatus("Component save failed");
        return false;
      }
      setStatus("Measurement component saved");
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

  playgroundCanvas.addEventListener("click", (event) => {
    const selectedType = playgroundComponentSelect.value;
    if (!selectedType) {
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
  if (playgroundSaveButton) {
    playgroundSaveButton.addEventListener("click", () => {
      saveLayout().catch(() => {
        setStatus("Save failed");
      });
    });
  }
  if (playgroundSaveAsButton) {
    playgroundSaveAsButton.addEventListener("click", () => {
      saveLayout({ forceNew: true }).catch(() => {
        setStatus("Save failed");
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
      refreshEditorTabControls(editorTargetTabSelect.value);
    });
  }
  if (editorOpenTabButton) {
    editorOpenTabButton.addEventListener("click", () => {
      openSelectedProductionTab();
    });
  }
  if (editorNewTabButton) {
    editorNewTabButton.addEventListener("click", () => {
      startNewBlankTabDraft();
    });
  }
  if (editorRenameTabButton) {
    editorRenameTabButton.addEventListener("click", () => {
      renameSelectedProductionTab();
    });
  }
  if (editorDeleteTabButton) {
    editorDeleteTabButton.addEventListener("click", () => {
      deleteSelectedProductionTab();
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
      if (duplicateSelected()) {
        event.preventDefault();
      }
      return;
    }
    if (event.key === "Delete" || event.key === "Backspace") {
      if (deleteSelected()) {
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
    { passive: false }
  );
  const settleDraggedOrSelectedItem = () => {
    const hadActiveDrag = Boolean(dragState || resizeState || measurementPartGesture);
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
  refreshEditorTabControls("__new__");

  return {
    handleResize: () => {
      prunePlaygroundRuntimeState();
      playgroundCanvas
        .querySelectorAll('.playground-node[data-component="single-measurement"], .playground-node[data-component="double-measurement"]')
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
        .querySelectorAll('.playground-node[data-component="single-measurement"], .playground-node[data-component="double-measurement"]')
        .forEach((item) => preparePlaygroundMeasurementParts(item));
      Array.from(playgroundSingleGateRuntime.values()).forEach((runtime) => {
        runtime.dial?.layout();
        alignPlaygroundGateSpring(runtime);
      });
    },
    handleGeneratedTabsChanged: () => {
      refreshEditorTabControls();
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
  if (!point || !Number.isFinite(point.clientX) || !Number.isFinite(point.clientY)) {
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
  const pointerRadial = pointerVectorX * radialUnitX + pointerVectorY * radialUnitY;
  const pointerTangential = pointerVectorX * tangentUnitX + pointerVectorY * tangentUnitY;

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
    { passive: false }
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

  function renderDialAtCurrentTick() {
    arrow.style.transform = `rotate(${activeTick * STEP_DEG}deg) scale(${ARROW_SCALE})`;
    ticks.forEach((tick, index) => {
      tick.classList.toggle("active", index === activeTick);
    });
  }

  function setTick(
    tickIndex,
    {
      deferMeasurementClear = false,
      reason = "programmatic",
    } = {}
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
    dragAngle = normalizedAngleFromTopDegrees(point.clientX, point.clientY, dragCenter.x, dragCenter.y);
    arrow.style.transform = `rotate(${dragAngle}deg) scale(${ARROW_SCALE})`;
  }

  function continueDrag(event) {
    if (!dragCenter) {
      return;
    }
    if (event.touches) {
      event.preventDefault();
    }
    const point = getPointer(event);
    dragAngle = normalizedAngleFromTopDegrees(point.clientX, point.clientY, dragCenter.x, dragCenter.y);
    arrow.style.transform = `rotate(${dragAngle}deg) scale(${ARROW_SCALE})`;
  }

  function endDrag() {
    if (!dragCenter) {
      return;
    }
    const snappedTick = dragAngle === null ? activeTick : Math.round(dragAngle / STEP_DEG) % tickCount;
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
  return Math.abs(tx) > 0.01 || Math.abs(ty) > 0.01 || Boolean(width) || Boolean(height);
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

function bakeLayoutTranslateIntoBasePosition(element) {
  const tx = parseLayoutNumeric(element.dataset.layoutTx, 0);
  const ty = parseLayoutNumeric(element.dataset.layoutTy, 0);
  if (Math.abs(tx) < 0.01 && Math.abs(ty) < 0.01) {
    return;
  }

  const computed = window.getComputedStyle(element);
  const positioned = ["absolute", "relative", "fixed", "sticky"].includes(computed.position);
  if (!positioned) {
    return;
  }

  const currentLeft = parseLayoutNumeric(computed.left, Number.NaN);
  const currentTop = parseLayoutNumeric(computed.top, Number.NaN);
  if (!Number.isFinite(currentLeft) || !Number.isFinite(currentTop)) {
    return;
  }

  element.style.left = `${Number.parseFloat((currentLeft + tx).toFixed(2))}px`;
  element.style.top = `${Number.parseFloat((currentTop + ty).toFixed(2))}px`;
  setLayoutTargetTranslate(element, 0, 0);
}

function layoutKeySegment(element) {
  if (element.id) {
    return `#${element.id}`;
  }
  const tag = element.tagName.toLowerCase();
  const role = element.getAttribute("data-role");
  const classTokens = Array.from(element.classList)
    .filter((token) => !token.startsWith("layout-"))
    .slice(0, 2)
    .join(".");
  let index = 0;
  if (element.parentElement) {
    const sameTagSiblings = Array.from(element.parentElement.children).filter(
      (child) => child.tagName === element.tagName
    );
    index = sameTagSiblings.indexOf(element);
  }
  const identity = role
    ? `[role=${role}]`
    : classTokens
      ? `[class=${classTokens}]`
      : "";
  return `${tag}${identity}:nth${index}`;
}

function deriveLayoutKey(element) {
  if (element.dataset.layoutKey) {
    return element.dataset.layoutKey;
  }

  const segments = [];
  let cursor = element;
  while (cursor && cursor !== document.body) {
    segments.unshift(layoutKeySegment(cursor));
    if (cursor.id) {
      break;
    }
    cursor = cursor.parentElement;
  }

  const key = segments.join("/");
  element.dataset.layoutKey = key;
  return key;
}

function slotOffsetDatasetKeys(slot) {
  if (slot === "left") {
    return { x: "layoutPairLensLeftDx", y: "layoutPairLensLeftDy" };
  }
  return { x: "layoutPairLensRightDx", y: "layoutPairLensRightDy" };
}

function setPairLensSlotOffsetOnShell(shell, slot, dx, dy) {
  const keys = slotOffsetDatasetKeys(slot);
  shell.dataset[keys.x] = `${Number.parseFloat(dx.toFixed(2))}`;
  shell.dataset[keys.y] = `${Number.parseFloat(dy.toFixed(2))}`;
}

function clearPairLensSlotOffsetsOnShell(shell) {
  delete shell.dataset.layoutPairLensLeftDx;
  delete shell.dataset.layoutPairLensLeftDy;
  delete shell.dataset.layoutPairLensRightDx;
  delete shell.dataset.layoutPairLensRightDy;
}

function getPairLensSlotOffsetFromShell(shell, slot) {
  const keys = slotOffsetDatasetKeys(slot);
  return {
    x: parseLayoutNumeric(shell.dataset[keys.x], TWO_QUBIT_MEASUREMENT_SLOT_SHIFT_X),
    y: parseLayoutNumeric(shell.dataset[keys.y], TWO_QUBIT_MEASUREMENT_SLOT_SHIFT_Y),
  };
}

function ejectionOffsetDatasetKeys(slot) {
  if (slot === "left") {
    return { x: "layoutPairEjectLeftDx", y: "layoutPairEjectLeftDy" };
  }
  return { x: "layoutPairEjectRightDx", y: "layoutPairEjectRightDy" };
}

function setPairEjectionOffsetOnShell(shell, slot, dx, dy) {
  const keys = ejectionOffsetDatasetKeys(slot);
  shell.dataset[keys.x] = `${Number.parseFloat(dx.toFixed(2))}`;
  shell.dataset[keys.y] = `${Number.parseFloat(dy.toFixed(2))}`;
}

function clearPairEjectionOffsetsOnShell(shell) {
  delete shell.dataset.layoutPairEjectLeftDx;
  delete shell.dataset.layoutPairEjectLeftDy;
  delete shell.dataset.layoutPairEjectRightDx;
  delete shell.dataset.layoutPairEjectRightDy;
}

function ejectionAbsoluteDatasetKeys(slot) {
  if (slot === "left") {
    return { x: "layoutPairEjectLeftAbsX", y: "layoutPairEjectLeftAbsY" };
  }
  return { x: "layoutPairEjectRightAbsX", y: "layoutPairEjectRightAbsY" };
}

function setPairEjectionAbsoluteOnShell(shell, slot, x, y) {
  const keys = ejectionAbsoluteDatasetKeys(slot);
  shell.dataset[keys.x] = `${Number.parseFloat(x.toFixed(2))}`;
  shell.dataset[keys.y] = `${Number.parseFloat(y.toFixed(2))}`;
}

function getPairEjectionAbsoluteFromShell(shell, slot) {
  const keys = ejectionAbsoluteDatasetKeys(slot);
  const x = parseLayoutNumeric(shell.dataset[keys.x], Number.NaN);
  const y = parseLayoutNumeric(shell.dataset[keys.y], Number.NaN);
  if (!Number.isFinite(x) || !Number.isFinite(y)) {
    return null;
  }
  return { x, y };
}

function clearPairEjectionAbsoluteOnShell(shell) {
  delete shell.dataset.layoutPairEjectLeftAbsX;
  delete shell.dataset.layoutPairEjectLeftAbsY;
  delete shell.dataset.layoutPairEjectRightAbsX;
  delete shell.dataset.layoutPairEjectRightAbsY;
}

function setPairMeasurementManualAlignment(shell, enabled) {
  shell.dataset.layoutPairMeasurementManualAlign = enabled ? "true" : "false";
}

function isPairMeasurementManualAlignment(shell) {
  return shell.dataset.layoutPairMeasurementManualAlign === "true";
}

function collectLayoutPairShells() {
  return Array.from(document.querySelectorAll(".pair-shell"));
}

function computePairEjectionBasePoint(shell, slot, qubitElement) {
  const lens = shell.querySelector('[data-role="pair-lens"]');
  const slotElement = shell.querySelector(
    slot === "left" ? '[data-role="pair-slot-left"]' : '[data-role="pair-slot-right"]'
  );
  const platform = shell.querySelector(".pair-measurement-platform");
  if (!lens || !slotElement || !platform || !qubitElement) {
    return null;
  }

  const shellRect = shell.getBoundingClientRect();
  const lensRect = lens.getBoundingClientRect();
  const slotRect = slotElement.getBoundingClientRect();
  const qubitRect = qubitElement.getBoundingClientRect();
  if (!shellRect.width || !shellRect.height || !qubitRect.width) {
    return null;
  }

  const springStyles = window.getComputedStyle(platform);
  const springLength = Number.parseFloat(springStyles.getPropertyValue("--spring-length"));
  const usableSpringLength = Number.isFinite(springLength)
    ? springLength
    : platform.getBoundingClientRect().width;
  const springOriginX = lensRect.right - shellRect.left - 4;
  const springTipX = springOriginX + usableSpringLength;
  const slotCenterY = slotRect.top - shellRect.top + slotRect.height / 2;
  const slotOffset = getPairLensSlotOffsetFromShell(shell, slot);

  return {
    x: springTipX + 6 + qubitRect.width / 2,
    y: slotCenterY + slotOffset.y,
  };
}

function captureTwoQubitLensOffsetsFromDom() {
  const allOffsets = {};
  const pairShells = collectLayoutPairShells();
  pairShells.forEach((shell) => {
    const shellRect = shell.getBoundingClientRect();
    if (!shellRect.width || !shellRect.height) {
      return;
    }

    const shellOffsets = {};
    const mappings = [
      { slot: "left", qubitSelector: '[data-role="pair-qubit-a"]', slotSelector: '[data-role="pair-slot-left"]' },
      { slot: "right", qubitSelector: '[data-role="pair-qubit-b"]', slotSelector: '[data-role="pair-slot-right"]' },
    ];

    mappings.forEach(({ slot, qubitSelector, slotSelector }) => {
      const qubit = shell.querySelector(qubitSelector);
      const slotElement = shell.querySelector(slotSelector);
      if (!qubit || !slotElement) {
        return;
      }
      if (qubit.dataset.lensSlot !== slot) {
        return;
      }

      const qubitRect = qubit.getBoundingClientRect();
      const slotRect = slotElement.getBoundingClientRect();
      const qubitCenter = {
        x: qubitRect.left - shellRect.left + qubitRect.width / 2,
        y: qubitRect.top - shellRect.top + qubitRect.height / 2,
      };
      const slotCenter = {
        x: slotRect.left - shellRect.left + slotRect.width / 2,
        y: slotRect.top - shellRect.top + slotRect.height / 2,
      };
      const dx = qubitCenter.x - slotCenter.x;
      const dy = qubitCenter.y - slotCenter.y;
      shellOffsets[slot] = { x: dx, y: dy };
      setPairLensSlotOffsetOnShell(shell, slot, dx, dy);
    });

    if (Object.keys(shellOffsets).length > 0) {
      const shellKey = deriveLayoutKey(shell);
      allOffsets[shellKey] = shellOffsets;
    }
  });

  return allOffsets;
}

function captureTwoQubitEjectionOffsetsFromDom() {
  const allOffsets = {};
  const pairShells = collectLayoutPairShells();
  pairShells.forEach((shell) => {
    const shellRect = shell.getBoundingClientRect();
    if (!shellRect.width || !shellRect.height) {
      return;
    }

    const shellOffsets = {};
    const mappings = [
      { slot: "left", qubitSelector: '[data-role="pair-qubit-a"]' },
      { slot: "right", qubitSelector: '[data-role="pair-qubit-b"]' },
    ];

    mappings.forEach(({ slot, qubitSelector }) => {
      const qubit = shell.querySelector(qubitSelector);
      if (!qubit || qubit.dataset.pairEjected !== slot) {
        return;
      }
      const basePoint = computePairEjectionBasePoint(shell, slot, qubit);
      if (!basePoint) {
        return;
      }

      const qubitRect = qubit.getBoundingClientRect();
      const qubitCenter = {
        x: qubitRect.left - shellRect.left + qubitRect.width / 2,
        y: qubitRect.top - shellRect.top + qubitRect.height / 2,
      };
      const dx = qubitCenter.x - basePoint.x;
      const dy = qubitCenter.y - basePoint.y;
      shellOffsets[slot] = { x: dx, y: dy };
      setPairEjectionOffsetOnShell(shell, slot, dx, dy);
    });

    if (Object.keys(shellOffsets).length > 0) {
      const shellKey = deriveLayoutKey(shell);
      allOffsets[shellKey] = shellOffsets;
    }
  });

  return allOffsets;
}

function captureTwoQubitEjectionAbsoluteFromDom() {
  const allAbsolute = {};
  const pairShells = collectLayoutPairShells();
  pairShells.forEach((shell) => {
    const shellRect = shell.getBoundingClientRect();
    if (!shellRect.width || !shellRect.height) {
      return;
    }

    const shellAbsolute = {};
    const mappings = [
      { slot: "left", qubitSelector: '[data-role="pair-qubit-a"]' },
      { slot: "right", qubitSelector: '[data-role="pair-qubit-b"]' },
    ];

    mappings.forEach(({ slot, qubitSelector }) => {
      const qubit = shell.querySelector(qubitSelector);
      if (!qubit || qubit.dataset.pairEjected !== slot) {
        return;
      }
      const qubitRect = qubit.getBoundingClientRect();
      const center = {
        x: qubitRect.left - shellRect.left + qubitRect.width / 2,
        y: qubitRect.top - shellRect.top + qubitRect.height / 2,
      };
      shellAbsolute[slot] = center;
      setPairEjectionAbsoluteOnShell(shell, slot, center.x, center.y);
    });

    if (Object.keys(shellAbsolute).length > 0) {
      allAbsolute[deriveLayoutKey(shell)] = shellAbsolute;
    }
  });

  return allAbsolute;
}

function applyTwoQubitLensOffsetsFromSavedPayload(offsetPayload) {
  if (!offsetPayload || typeof offsetPayload !== "object") {
    return;
  }

  const pairShells = collectLayoutPairShells();
  pairShells.forEach((shell) => {
    const shellKey = deriveLayoutKey(shell);
    const shellOffsets = offsetPayload[shellKey];
    if (!shellOffsets || typeof shellOffsets !== "object") {
      return;
    }

    const leftOffset = shellOffsets.left;
    const rightOffset = shellOffsets.right;
    if (leftOffset && Number.isFinite(leftOffset.x) && Number.isFinite(leftOffset.y)) {
      setPairLensSlotOffsetOnShell(shell, "left", leftOffset.x, leftOffset.y);
    }
    if (rightOffset && Number.isFinite(rightOffset.x) && Number.isFinite(rightOffset.y)) {
      setPairLensSlotOffsetOnShell(shell, "right", rightOffset.x, rightOffset.y);
    }
  });
}

function applyTwoQubitEjectionOffsetsFromSavedPayload(offsetPayload) {
  if (!offsetPayload || typeof offsetPayload !== "object") {
    return;
  }

  const pairShells = collectLayoutPairShells();
  pairShells.forEach((shell) => {
    const shellKey = deriveLayoutKey(shell);
    const shellOffsets = offsetPayload[shellKey];
    if (!shellOffsets || typeof shellOffsets !== "object") {
      return;
    }

    const leftOffset = shellOffsets.left;
    const rightOffset = shellOffsets.right;
    if (leftOffset && Number.isFinite(leftOffset.x) && Number.isFinite(leftOffset.y)) {
      setPairEjectionOffsetOnShell(shell, "left", leftOffset.x, leftOffset.y);
    }
    if (rightOffset && Number.isFinite(rightOffset.x) && Number.isFinite(rightOffset.y)) {
      setPairEjectionOffsetOnShell(shell, "right", rightOffset.x, rightOffset.y);
    }
  });
}

function applyTwoQubitEjectionAbsoluteFromSavedPayload(absolutePayload) {
  if (!absolutePayload || typeof absolutePayload !== "object") {
    return;
  }

  const pairShells = collectLayoutPairShells();
  pairShells.forEach((shell) => {
    const shellKey = deriveLayoutKey(shell);
    const shellAbsolute = absolutePayload[shellKey];
    if (!shellAbsolute || typeof shellAbsolute !== "object") {
      return;
    }
    const leftAbs = shellAbsolute.left;
    const rightAbs = shellAbsolute.right;
    if (leftAbs && Number.isFinite(leftAbs.x) && Number.isFinite(leftAbs.y)) {
      setPairEjectionAbsoluteOnShell(shell, "left", leftAbs.x, leftAbs.y);
    }
    if (rightAbs && Number.isFinite(rightAbs.x) && Number.isFinite(rightAbs.y)) {
      setPairEjectionAbsoluteOnShell(shell, "right", rightAbs.x, rightAbs.y);
    }
  });
}

function getPrimaryTwoQubitMeasurementGroup() {
  const pairShell = collectLayoutPairShells().find((shell) => shell.querySelector('[data-role="pair-qubit-a"]'));
  if (!(pairShell instanceof HTMLElement)) {
    return null;
  }
  const measurementGroup = pairShell.querySelector(".pair-measurement");
  if (!(measurementGroup instanceof HTMLElement)) {
    return null;
  }
  return { pairShell, measurementGroup };
}

function collectLayoutTargets() {
  return Array.from(document.querySelectorAll('[data-layout-edit-target="true"]'));
}

function isLayoutTargetDeleted(element) {
  return element?.dataset?.layoutDeleted === "true";
}

function isLayoutTargetProtectedFromDeletion(element) {
  if (!(element instanceof HTMLElement)) {
    return false;
  }
  // Core simulator controls should never be removable from saved layout state.
  return element.matches('[data-role="ent-pipe"], [data-role="ent-gate"], [data-role="ent-measurement-host"]');
}

function isLayoutTargetPinnedToDefaultGeometry(element) {
  if (!(element instanceof HTMLElement)) {
    return false;
  }
  // Keep the entanglement C-NOT body and its measurement group in canonical positions.
  return element.matches('[data-role="ent-gate"], [data-role="ent-measurement-host"]');
}

function setLayoutTargetDeleted(element, deleted) {
  if (!(element instanceof HTMLElement)) {
    return;
  }
  if (deleted && isLayoutTargetProtectedFromDeletion(element)) {
    delete element.dataset.layoutDeleted;
    element.style.display = "";
    return;
  }
  if (deleted) {
    element.dataset.layoutDeleted = "true";
    element.style.display = "none";
    if (selectedLayoutTarget === element) {
      selectedLayoutTarget.classList.remove("layout-edit-selected");
      selectedLayoutTarget = null;
    }
    return;
  }
  delete element.dataset.layoutDeleted;
  element.style.display = "";
}

function clearSelectedLayoutTarget() {
  if (selectedLayoutTarget) {
    selectedLayoutTarget.classList.remove("layout-edit-selected");
  }
  selectedLayoutTarget = null;
}

function setSelectedLayoutTarget(element) {
  if (!(element instanceof HTMLElement) || isLayoutTargetDeleted(element)) {
    clearSelectedLayoutTarget();
    return;
  }
  if (selectedLayoutTarget === element) {
    return;
  }
  if (selectedLayoutTarget) {
    selectedLayoutTarget.classList.remove("layout-edit-selected");
  }
  selectedLayoutTarget = element;
  selectedLayoutTarget.classList.add("layout-edit-selected");
}

function selectedLayoutTargetKeySet() {
  const deleted = new Set();
  collectLayoutTargets().forEach((element) => {
    if (isLayoutTargetDeleted(element) && !isLayoutTargetProtectedFromDeletion(element)) {
      deleted.add(deriveLayoutKey(element));
    }
  });
  return deleted;
}

function removeSelectedLayoutTargetFromLayout() {
  if (!layoutEditorState.enabled || !selectedLayoutTarget) {
    return false;
  }
  if (isLayoutTargetProtectedFromDeletion(selectedLayoutTarget)) {
    return false;
  }
  setLayoutTargetDeleted(selectedLayoutTarget, true);
  setLayoutSaveButtonSavedState(false);
  return true;
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

function isPlaygroundQubitLayoutTarget(element) {
  return (
    element instanceof HTMLElement &&
    element.dataset.component === "qubit" &&
    element.classList.contains("playground-node") &&
    Boolean(element.closest("#panel-plaground"))
  );
}

function pointerNearResizeCorner(element, pointer, inset = 20) {
  if (!(element instanceof HTMLElement) || !pointer) {
    return false;
  }
  const rect = element.getBoundingClientRect();
  return pointer.clientX >= rect.right - inset && pointer.clientY >= rect.bottom - inset;
}

function readSavedLayoutPayload() {
  try {
    const serialized = window.localStorage.getItem(LAYOUT_STORAGE_KEY);
    if (!serialized) {
      return null;
    }
    const parsed = JSON.parse(serialized);
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch (_error) {
    return null;
  }
}

function shouldPersistGenericLayoutTarget(element) {
  if (!(element instanceof HTMLElement)) {
    return false;
  }
  if (isLayoutTargetPinnedToDefaultGeometry(element)) {
    return false;
  }
  if (element.closest(".generated-layout-canvas")) {
    return false;
  }
  // Pair qubits are used for lens/ejection hotspot calibration. Their generic
  // element position must not be persisted, otherwise startup placement drifts.
  if (element.matches('[data-role="pair-qubit-a"], [data-role="pair-qubit-b"]')) {
    return false;
  }
  return true;
}

function saveLayoutEdits() {
  const generatedLayoutsSaved = persistGeneratedLayoutEditsFromDom();
  persistPrimaryTwoQubitMeasurementDefaultsFromDom();
  persistVisiblePlaygroundComponentDefaultsFromDom();
  const existingPayload = readSavedLayoutPayload();
  const payload = {};
  collectLayoutTargets().forEach((element) => {
    if (isLayoutTargetDeleted(element)) {
      return;
    }
    if (!shouldPersistGenericLayoutTarget(element)) {
      return;
    }
    const key = deriveLayoutKey(element);
    payload[key] = {
      tx: parseLayoutNumeric(element.dataset.layoutTx, 0),
      ty: parseLayoutNumeric(element.dataset.layoutTy, 0),
      width: element.style.width || "",
      height: element.style.height || "",
    };
  });
  const pairLensOffsets = captureTwoQubitLensOffsetsFromDom();
  if (Object.keys(pairLensOffsets).length > 0) {
    payload.__pairLensOffsets = pairLensOffsets;
  } else if (existingPayload && existingPayload.__pairLensOffsets) {
    payload.__pairLensOffsets = existingPayload.__pairLensOffsets;
  }
  const pairEjectionOffsets = captureTwoQubitEjectionOffsetsFromDom();
  if (Object.keys(pairEjectionOffsets).length > 0) {
    payload.__pairEjectionOffsets = pairEjectionOffsets;
  } else if (existingPayload && existingPayload.__pairEjectionOffsets) {
    payload.__pairEjectionOffsets = existingPayload.__pairEjectionOffsets;
  }
  const pairEjectionAbsolute = captureTwoQubitEjectionAbsoluteFromDom();
  if (Object.keys(pairEjectionAbsolute).length > 0) {
    payload.__pairEjectionAbsolute = pairEjectionAbsolute;
  } else if (existingPayload && existingPayload.__pairEjectionAbsolute) {
    payload.__pairEjectionAbsolute = existingPayload.__pairEjectionAbsolute;
  }
  const pairManualAlignment = {};
  collectLayoutPairShells().forEach((shell) => {
    if (!isPairMeasurementManualAlignment(shell)) {
      return;
    }
    pairManualAlignment[deriveLayoutKey(shell)] = true;
  });
  if (Object.keys(pairManualAlignment).length > 0) {
    payload.__pairManualAlignment = pairManualAlignment;
  } else if (existingPayload && existingPayload.__pairManualAlignment) {
    payload.__pairManualAlignment = existingPayload.__pairManualAlignment;
  }
  const primaryPairMeasurement = getPrimaryTwoQubitMeasurementGroup();
  if (primaryPairMeasurement) {
    payload.__twoQubitMeasurementGroupOffset = {
      tx: parseLayoutNumeric(primaryPairMeasurement.measurementGroup.dataset.layoutTx, 0),
      ty: parseLayoutNumeric(primaryPairMeasurement.measurementGroup.dataset.layoutTy, 0),
    };
  }
  const deletedTargetKeys = [...selectedLayoutTargetKeySet()];
  if (deletedTargetKeys.length > 0) {
    payload.__deletedLayoutTargets = deletedTargetKeys;
  }
  try {
    window.localStorage.setItem(LAYOUT_STORAGE_KEY, JSON.stringify(payload));
    return generatedLayoutsSaved;
  } catch (_error) {
    // Ignore storage failures (quota/private mode/etc.) and keep editing functional.
    return false;
  }
}

function applySavedLayoutEdits() {
  let serialized = null;
  try {
    serialized = window.localStorage.getItem(LAYOUT_STORAGE_KEY);
  } catch (_error) {
    serialized = null;
  }
  if (!serialized) {
    return;
  }

  let payload = null;
  try {
    payload = JSON.parse(serialized);
  } catch (_error) {
    return;
  }
  if (!payload || typeof payload !== "object") {
    return;
  }
  const deletedKeys = new Set(Array.isArray(payload.__deletedLayoutTargets) ? payload.__deletedLayoutTargets : []);

  applyTwoQubitLensOffsetsFromSavedPayload(payload.__pairLensOffsets);
  applyTwoQubitEjectionOffsetsFromSavedPayload(payload.__pairEjectionOffsets);
  applyTwoQubitEjectionAbsoluteFromSavedPayload(payload.__pairEjectionAbsolute);
  if (payload.__pairManualAlignment && typeof payload.__pairManualAlignment === "object") {
    collectLayoutPairShells().forEach((shell) => {
      const shellKey = deriveLayoutKey(shell);
      setPairMeasurementManualAlignment(shell, Boolean(payload.__pairManualAlignment[shellKey]));
    });
  }
  collectLayoutTargets().forEach((element) => {
    setLayoutTargetDeleted(element, false);
    const key = deriveLayoutKey(element);
    const saved = payload[key];
    if (!saved || isLayoutTargetPinnedToDefaultGeometry(element)) {
      setLayoutTargetTranslate(element, 0, 0);
      if (element.dataset.layoutResizable === "true") {
        element.style.width = "";
        element.style.height = "";
      }
      setLayoutManualEdited(element, false);
      return;
    }
    const tx = parseLayoutNumeric(saved.tx, 0);
    const ty = parseLayoutNumeric(saved.ty, 0);
    setLayoutTargetTranslate(
      element,
      tx,
      ty
    );
    const savedWidth = typeof saved.width === "string" ? saved.width : "";
    const savedHeight = typeof saved.height === "string" ? saved.height : "";
    if (typeof saved.width === "string") {
      element.style.width = saved.width;
    }
    if (typeof saved.height === "string") {
      element.style.height = saved.height;
    }
    setLayoutManualEdited(element, hasMeaningfulLayoutDelta(tx, ty, savedWidth, savedHeight));
  });
  collectLayoutTargets().forEach((element) => {
    const key = deriveLayoutKey(element);
    setLayoutTargetDeleted(element, deletedKeys.has(key));
  });
  clearSelectedLayoutTarget();

  const primaryPairMeasurement = getPrimaryTwoQubitMeasurementGroup();
  const savedGroupOffset = payload.__twoQubitMeasurementGroupOffset;
  if (
    primaryPairMeasurement &&
    savedGroupOffset &&
    Number.isFinite(savedGroupOffset.tx) &&
    Number.isFinite(savedGroupOffset.ty)
  ) {
    setLayoutTargetTranslate(
      primaryPairMeasurement.measurementGroup,
      savedGroupOffset.tx,
      savedGroupOffset.ty
    );
    if (Math.abs(savedGroupOffset.tx) > 0.01 || Math.abs(savedGroupOffset.ty) > 0.01) {
      setPairMeasurementManualAlignment(primaryPairMeasurement.pairShell, true);
    }
  }
}

function resetLayoutEditsToDefault() {
  collectLayoutTargets().forEach((element) => {
    setLayoutTargetTranslate(element, 0, 0);
    setLayoutTargetDeleted(element, false);
    if (element.dataset.layoutResizable === "true") {
      element.style.width = "";
      element.style.height = "";
    }
    setLayoutManualEdited(element, false);
  });
  collectLayoutPairShells().forEach((shell) => {
    clearPairLensSlotOffsetsOnShell(shell);
    clearPairEjectionOffsetsOnShell(shell);
    clearPairEjectionAbsoluteOnShell(shell);
    setPairMeasurementManualAlignment(shell, false);
  });
  try {
    window.localStorage.removeItem(LAYOUT_STORAGE_KEY);
  } catch (_error) {
    // Ignore storage failures.
  }
  clearSelectedLayoutTarget();
}

function setLayoutSaveButtonSavedState(saved) {
  if (!layoutSaveButton) {
    return;
  }
  layoutSaveButton.textContent = saved ? "Layout Saved" : "Save Layout";
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

function beginLayoutGesture(element, event) {
  if (!layoutEditorState.enabled) {
    return;
  }
  if (event.button !== undefined && event.button !== 0) {
    return;
  }

  const isResizeHandle = event.target instanceof Element && event.target.closest(".layout-resize-handle");
  const canResize = element.dataset.layoutResizable === "true";
  const pointer = getPointer(event);
  if (!pointer) {
    return;
  }
  const cornerResizeQubit =
    !isResizeHandle &&
    canResize &&
    isPlaygroundQubitLayoutTarget(element) &&
    pointerNearResizeCorner(element, pointer, 34);

  const initialTranslate = layoutTargetTranslate(element);
  const rect = element.getBoundingClientRect();
  setSelectedLayoutTarget(element);
  layoutEditorState.activeGesture = {
    element,
    mode: (isResizeHandle || cornerResizeQubit) && canResize ? "resize" : "move",
    startX: pointer.clientX,
    startY: pointer.clientY,
    startTx: initialTranslate.x,
    startTy: initialTranslate.y,
    startWidth: rect.width,
    startHeight: rect.height,
    uniformResize: element.dataset.layoutUniformResize === "true",
    minWidth: parseLayoutNumeric(element.dataset.layoutMinWidth, 24),
    minHeight: parseLayoutNumeric(element.dataset.layoutMinHeight, 24),
    cnotBaseline: isResizeHandle && canResize ? captureCnotGeometryBaseline(element) : null,
  };

  element.classList.add("layout-edit-dragging");
  event.preventDefault();
  event.stopPropagation();
}

function continueLayoutGesture(event) {
  const gesture = layoutEditorState.activeGesture;
  if (!layoutEditorState.enabled || !gesture) {
    return;
  }
  const pointer = getPointer(event);
  if (!pointer) {
    return;
  }

  const dx = pointer.clientX - gesture.startX;
  const dy = pointer.clientY - gesture.startY;

  if (gesture.mode === "resize") {
    let nextWidth = Math.max(gesture.minWidth, gesture.startWidth + dx);
    let nextHeight = Math.max(gesture.minHeight, gesture.startHeight + dy);
    if (gesture.uniformResize) {
      const uniformSize = Math.max(nextWidth, nextHeight, gesture.minWidth, gesture.minHeight);
      nextWidth = uniformSize;
      nextHeight = uniformSize;
    }
    gesture.element.style.width = `${Math.round(nextWidth)}px`;
    gesture.element.style.height = `${Math.round(nextHeight)}px`;
    applyCnotGeometryScale(
      gesture.element,
      gesture.cnotBaseline,
      nextWidth,
      nextHeight
    );
    setLayoutManualEdited(gesture.element, true);
  } else {
    setLayoutTargetTranslate(gesture.element, gesture.startTx + dx, gesture.startTy + dy);
    setLayoutManualEdited(gesture.element, true);
    if (gesture.element.classList.contains("pair-measurement")) {
      const pairShell = gesture.element.closest(".pair-shell");
      if (pairShell instanceof HTMLElement) {
        setPairMeasurementManualAlignment(pairShell, true);
      }
    }
  }

  setLayoutSaveButtonSavedState(false);

  event.preventDefault();
}

function endLayoutGesture() {
  const gesture = layoutEditorState.activeGesture;
  if (!gesture) {
    return;
  }
  gesture.element.classList.remove("layout-edit-dragging");
  layoutEditorState.activeGesture = null;
}

function registerLayoutEditTarget(element, spec) {
  if (!(element instanceof HTMLElement)) {
    return;
  }
  if (element.classList.contains("playground-qubit-core")) {
    return;
  }
  if (layoutEditorState.registeredTargets.has(element)) {
    return;
  }

  layoutEditorState.registeredTargets.add(element);
  element.dataset.layoutEditTarget = "true";
  element.dataset.layoutResizable = spec.resizable ? "true" : "false";
  element.dataset.layoutUniformResize = spec.uniform ? "true" : "false";
  element.dataset.layoutMinWidth = `${spec.minWidth || 24}`;
  element.dataset.layoutMinHeight = `${spec.minHeight || 24}`;
  deriveLayoutKey(element);
  if (!element.style.translate) {
    setLayoutTargetTranslate(element, 0, 0);
  }

  if (window.getComputedStyle(element).position === "static") {
    element.style.position = "relative";
  }

  if (spec.resizable) {
    ensureLayoutResizeHandle(element);
  }

}

function refreshLayoutEditTargets() {
  LAYOUT_EDIT_TARGET_SPECS.forEach((spec) => {
    const elements = Array.from(document.querySelectorAll(spec.selector));
    elements.forEach((element) => registerLayoutEditTarget(element, spec));
  });
}

function setLayoutEditEnabled(enabled) {
  const wasEnabled = layoutEditorState.enabled;
  layoutEditorState.enabled = Boolean(enabled);
  document.body.classList.toggle("layout-edit-active", layoutEditorState.enabled);
  if (layoutEditToggle) {
    layoutEditToggle.classList.toggle("active", layoutEditorState.enabled);
    layoutEditToggle.setAttribute("aria-pressed", layoutEditorState.enabled ? "true" : "false");
    layoutEditToggle.textContent = layoutEditorState.enabled
      ? "Layout Edit: On"
      : "Layout Edit: Off";
  }
  if (!layoutEditorState.enabled) {
    endLayoutGesture();
    endGeneratedLayoutEditGesture();
    clearSelectedLayoutTarget();
    clearSelectedGeneratedLayoutItem();
    if (wasEnabled) {
      collectLayoutTargets().forEach((element) => {
        if (element.closest("#panel-plaground") || element.closest(".generated-layout-canvas")) {
          return;
        }
        bakeLayoutTranslateIntoBasePosition(element);
      });
      captureTwoQubitLensOffsetsFromDom();
      captureTwoQubitEjectionOffsetsFromDom();
      refreshVisibleSimulators();
    }
  } else {
    endGeneratedRuntimeGesture();
    endGeneratedGateDialDrag();
    updateGeneratedEditorButtons();
  }
  if (layoutSaveButton) {
    layoutSaveButton.disabled = !layoutEditorState.enabled;
  }
  if (layoutResetButton) {
    layoutResetButton.disabled = !layoutEditorState.enabled;
  }
  setLayoutSaveButtonSavedState(false);
  simulators.forEach((simulator) => {
    if (typeof simulator.handleLayoutEditChanged === "function") {
      simulator.handleLayoutEditChanged(layoutEditorState.enabled);
    }
  });
}

function findLayoutEditTargetFromEvent(event) {
  const origin = event.target;
  if (!(origin instanceof Element)) {
    return null;
  }
  const rawTarget = origin.closest('[data-layout-edit-target="true"]');
  if (!rawTarget) {
    return null;
  }
  if (rawTarget.closest("#panel-plaground")) {
    // Playground has its own drag/resize model; avoid mixed handlers.
    return null;
  }
  if (rawTarget.closest(".generated-layout-canvas")) {
    // Generated tabs use the same component editor model as Playground.
    return null;
  }

  const pairMeasurementGroup = rawTarget.closest(".pair-measurement");
  if (pairMeasurementGroup && pairMeasurementGroup instanceof HTMLElement) {
    // Default behavior: allow editing children (magnifier, rack, labels, etc.)
    // so they can be moved relative to one another.
    // Hold Shift while dragging to move the whole measurement block as one unit.
    if (event.shiftKey || rawTarget === pairMeasurementGroup) {
      return pairMeasurementGroup;
    }
  }

  return rawTarget;
}

function captureLayoutEditStart(event) {
  if (!layoutEditorState.enabled) {
    return;
  }
  const target = findLayoutEditTargetFromEvent(event);
  if (!target) {
    clearSelectedLayoutTarget();
    return;
  }
  beginLayoutGesture(target, event);
  event.stopImmediatePropagation();
}

function captureLayoutEditClick(event) {
  if (!layoutEditorState.enabled) {
    return;
  }
  const target = findLayoutEditTargetFromEvent(event);
  if (!target) {
    clearSelectedLayoutTarget();
    return;
  }
  setSelectedLayoutTarget(target);
  event.preventDefault();
  event.stopImmediatePropagation();
}

window.addEventListener("mousemove", continueLayoutGesture, { passive: false });
window.addEventListener("mousemove", continueGeneratedLayoutEditGesture, { passive: false });
window.addEventListener("mousemove", continueGeneratedRuntimeGesture, { passive: false });
window.addEventListener("mousemove", continueGeneratedGateDialDrag, { passive: false });
window.addEventListener("mousedown", captureLayoutEditStart, true);
window.addEventListener(
  "touchmove",
  (event) => {
    continueLayoutGesture(event);
    continueGeneratedLayoutEditGesture(event);
    continueGeneratedRuntimeGesture(event);
    continueGeneratedGateDialDrag(event);
  },
  { passive: false }
);
window.addEventListener(
  "touchstart",
  (event) => captureLayoutEditStart(event),
  { capture: true, passive: false }
);
window.addEventListener("mouseup", () => {
  endLayoutGesture();
  endGeneratedLayoutEditGesture();
  endGeneratedRuntimeGesture();
  endGeneratedGateDialDrag();
});
window.addEventListener("touchend", () => {
  endLayoutGesture();
  endGeneratedLayoutEditGesture();
  endGeneratedRuntimeGesture();
  endGeneratedGateDialDrag();
});
window.addEventListener("touchcancel", () => {
  endLayoutGesture();
  endGeneratedLayoutEditGesture();
  endGeneratedRuntimeGesture();
  endGeneratedGateDialDrag();
});
window.addEventListener("click", captureLayoutEditClick, true);
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
  if (removeSelectedLayoutTargetFromLayout()) {
    event.preventDefault();
    event.stopImmediatePropagation();
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
  const normalizedHue = (h % 360 + 360) % 360;
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

  const hue = interpolateHue(BLUE_HSV.h, RED_HSV.h, hueMixRatioForDisplay(redRatio));
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

function vectorTimesMatrix2(vector, matrix) {
  return [
    matrix[0][0] * vector[0] + matrix[0][1] * vector[1],
    matrix[1][0] * vector[0] + matrix[1][1] * vector[1],
  ];
}

function normalizeVector2(vector) {
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
  const blue = vector[0] * vector[0];
  const red = vector[1] * vector[1];
  const total = blue + red;
  if (total <= 1e-12) {
    return [1, 0];
  }
  return [clamp(blue / total, 0, 1), clamp(red / total, 0, 1)];
}

function cnotMarginalProbabilitiesFromQubitVectors(controlVector, targetVector) {
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

  const controlBlue = controlTotal > 1e-12 ? controlBlueRaw / controlTotal : 0.5;
  const targetBlue = targetTotal > 1e-12 ? targetBlueRaw / targetTotal : 0.5;

  return {
    control: [clamp(controlBlue, 0, 1), clamp(1 - controlBlue, 0, 1)],
    target: [clamp(targetBlue, 0, 1), clamp(1 - targetBlue, 0, 1)],
  };
}

function cnotOutcomeProbabilitiesFromQubitVectors(controlVector, targetVector) {
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
  const isBlueBasis = Math.abs(blueWeight - 1) <= basisTolerance && redWeight <= basisTolerance;
  const isRedBasis = Math.abs(redWeight - 1) <= basisTolerance && blueWeight <= basisTolerance;
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
const selectionContainers = new WeakSet();
let selectedQubitElements = [];

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
  if (Array.isArray(value) && value.length >= 2 && Number.isFinite(value[0]) && Number.isFinite(value[1])) {
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
    (element) => element.isConnected && qubitStateGetters.has(element) && isElementVisible(element)
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
  return a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;
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
        "button, input, select, label, textarea, .arrow-group, .tick, .gate-radio, .tab-btn, .qubit-inspector"
      )
    ) {
      return;
    }

    event.preventDefault();
    const marquee = ensureQubitSelectionMarquee();
    const additive = event.shiftKey;
    const baseSelection = additive ? getSelectedQubitElements() : [];
    const candidates = Array.from(qubitStateGetters.keys()).filter(
      (element) => container.contains(element) && isElementVisible(element)
    );
    const startX = event.clientX;
    const startY = event.clientY;
    let moved = false;

    const updateSelection = (clientX, clientY) => {
      const selectionRect = viewportRectFromPoints(startX, startY, clientX, clientY);
      marquee.style.left = `${selectionRect.left}px`;
      marquee.style.top = `${selectionRect.top}px`;
      marquee.style.width = `${selectionRect.width}px`;
      marquee.style.height = `${selectionRect.height}px`;
      marquee.classList.remove("hidden");

      const hits = candidates.filter((element) =>
        rectsIntersect(selectionRect, element.getBoundingClientRect())
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
  if (event.type === "mousedown" && event.shiftKey && isPrimaryMouseButton(event)) {
    event.preventDefault();
    event.stopPropagation();
    toggleQubitSelection(element);
    return true;
  }
  return false;
}

function openQubitInspector({ label, blue, red, vector = null }) {
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
  const rows = Array.isArray(matrix) ? matrix.filter((row) => Array.isArray(row)) : [];
  if (!rows.length) {
    return;
  }

  const columns = rows.reduce((max, row) => Math.max(max, row.length), 0);
  const lines = [
    label,
    "",
  ];

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

function registerGateInspector(element, getGateState) {
  if (!element || typeof getGateState !== "function") {
    return;
  }

  element.addEventListener("contextmenu", (event) => {
    event.preventDefault();
    event.stopPropagation();
    const gateState = getGateState();
    if (!gateState || !gateState.matrix) {
      return;
    }
    openGateInspector(gateState);
  });
}

function registerQubitInspector(element, getState) {
  qubitStateGetters.set(element, getState);
  applyQubitSelectionStyles();
  element.addEventListener("contextmenu", (event) => {
    event.preventDefault();
    event.stopPropagation();

    const selected = getSelectedQubitElements();
    if (selected.length === 2 && selected.includes(element) && isQubitSelected(element)) {
      const firstState = qubitStateGetters.get(selected[0])?.();
      const secondState = qubitStateGetters.get(selected[1])?.();
      if (firstState && secondState) {
        openQubitPairInspector(firstState, secondState);
        return;
      }
    }

    openQubitInspector(getState());
  });
}

function setupSimulator(root) {
  const ticksWrap = root.querySelector('[data-role="ticks"]');
  const gateArrow = root.querySelector('[data-role="gate-arrow"]');
  const windowWrap = root.querySelector('[data-role="window-wrap"]');
  const gateFunnel = root.querySelector('[data-role="tube-funnel"]');
  const gateWindow = root.querySelector('[data-role="window"]');
  const gatePlatform = root.querySelector('[data-role="tube-platform"]');
  const gateDropZone = root.querySelector('[data-role="tube-drop-zone"]');
  const gateStage = root.querySelector('[data-role="gate-stage"]');
  const machineShell = root.querySelector('[data-role="machine-shell"]');
  const qubit = root.querySelector('[data-role="qubit"]');
  const measurementStage = root.querySelector(".measurement-stage");
  const measurementTool = root.querySelector('[data-role="measurement-tool"]');
  const measureLens = root.querySelector('[data-role="measure-lens"]');
  const boltToGate = root.querySelector('[data-role="bolt-gate"]');
  const boltToLens = root.querySelector('[data-role="bolt-lens"]');
  const tubeRack = root.querySelector('[data-role="tube-rack"]');
  const tubeBlue = root.querySelector('[data-role="tube-blue"]');
  const tubeRed = root.querySelector('[data-role="tube-red"]');
  const tubeBlueCount = root.querySelector('[data-role="tube-blue-count"]');
  const tubeRedCount = root.querySelector('[data-role="tube-red-count"]');
  const tubeBlueLiquid = root.querySelector('[data-role="tube-blue-liquid"]');
  const tubeRedLiquid = root.querySelector('[data-role="tube-red-liquid"]');
  const tubeCapacity = root.querySelector('[data-role="tube-capacity"]');
  const measurementCount = root.querySelector('[data-role="measurement-count"]');
  const resetButton = root.querySelector('[data-role="reset"]');
  const messageBox = root.querySelector('[data-role="message-box"]');
  const messageWrap = root.querySelector(".message-wrap");

  if (
    !ticksWrap ||
    !gateArrow ||
    !windowWrap ||
    !gateFunnel ||
    !gateWindow ||
    !gatePlatform ||
    !gateDropZone ||
    !gateStage ||
    !machineShell ||
    !qubit ||
    !measurementStage ||
    !measurementTool ||
    !measureLens ||
    !boltToGate ||
    !boltToLens ||
    !tubeRack ||
    !tubeBlue ||
    !tubeRed ||
    !tubeBlueCount ||
    !tubeRedCount ||
    !tubeBlueLiquid ||
    !tubeRedLiquid ||
    !measurementCount ||
    !resetButton
  ) {
    return null;
  }

  registerSelectionContainer(gateStage);

  let activeGateTick = 0;
  let qubitDragging = false;
  let qubitDocked = false;
  let qubitDragOffsetX = 0;
  let qubitDragOffsetY = 0;
  let qubitInitialized = false;
  let measurementInProgress = false;
  let autoRunInProgress = false;
  let runToken = 0;
  let qubitVector = [1, 0];
  let qubitBlueWeight = 1;
  let qubitRedWeight = 0;
  let qubitHasEnteredGate = false;
  let gateTransitInProgress = false;
  let tubeQubitCapacity = INITIAL_TUBE_QUBIT_CAPACITY;
  let blueTubeCount = 0;
  let redTubeCount = 0;
  let measurementStageShiftY = 0;
  let lastRequestedMeasurementCount = Number(measurementCount.value) || 1;
  let gateDial = null;

  registerQubitInspector(qubit, () => ({
    label: "One-Qubit Mode",
    blue: qubitBlueWeight,
    red: qubitRedWeight,
    vector: [qubitVector[0], qubitVector[1]],
  }));
  registerGateInspector(windowWrap, () => ({
    label: "One-Qubit Gate",
    matrix: gateMatrixForTick(activeGateTick),
    tickIndex: activeGateTick,
  }));

  function applySingleGateSignFromVector() {
    const phaseSign = phaseSignForRealAmplitudeVector(qubitVector);
    if (!phaseSign) {
      delete qubit.dataset.phaseSign;
      return;
    }
    qubit.dataset.phaseSign = phaseSign;
  }

  function updateStateText(blueWeight, redWeight) {
    if (!messageBox) {
      return;
    }
    messageBox.value = `${formatFraction(blueWeight)} blue, ${formatFraction(redWeight)} red`;
  }

  function syncWeightsFromVector() {
    const [blueWeight, redWeight] = probabilitiesFromVector2(qubitVector);
    qubitBlueWeight = blueWeight;
    qubitRedWeight = redWeight;
  }

  function setQubitVector(vector) {
    qubitVector = normalizeVector2(vector);
    syncWeightsFromVector();
  }

  function gateOutputWeightsForCurrentTickFromBlueBasis() {
    const transformed = vectorTimesMatrix2([1, 0], gateMatrixForTick(activeGateTick));
    return probabilitiesFromVector2(normalizeVector2(transformed));
  }

  function applyActiveGateToQubitVector() {
    setQubitVector(vectorTimesMatrix2(qubitVector, gateMatrixForTick(activeGateTick)));
  }

  function applyQubitColorForTick() {
    if (!qubitHasEnteredGate) {
      return;
    }

    syncWeightsFromVector();
    const blueWeight = qubitBlueWeight;
    const redWeight = qubitRedWeight;
    qubit.style.setProperty("--qubit-fill", blendBlueRed(blueWeight, redWeight));
  }

  function stagePointForElementCenter(element) {
    const stageRect = gateStage.getBoundingClientRect();
    const rect = element.getBoundingClientRect();

    return {
      x: rect.left - stageRect.left + rect.width / 2,
      y: rect.top - stageRect.top + rect.height / 2,
    };
  }

  function setQubitCenter(x, y) {
    const stageRect = gateStage.getBoundingClientRect();
    const movementRect = machineShell.getBoundingClientRect();
    const qubitRect = qubit.getBoundingClientRect();
    const radius = qubitRect.width / 2;

    const minX = movementRect.left - stageRect.left + radius;
    const maxX = movementRect.right - stageRect.left - radius;
    const minY = movementRect.top - stageRect.top + radius;
    const maxY = movementRect.bottom - stageRect.top - radius;

    const clampedX = Math.min(Math.max(x, minX), maxX);
    const clampedY = Math.min(Math.max(y, minY), maxY);

    qubit.style.left = `${clampedX}px`;
    qubit.style.top = `${clampedY}px`;
  }

  function clearMeasurementApparatus() {
    tubeQubitCapacity = INITIAL_TUBE_QUBIT_CAPACITY;
    blueTubeCount = 0;
    redTubeCount = 0;
    updateTubeCapacityText();
    updateTubeFills();
  }

  function setGateTick(tickIndex, { deferMeasurementClear = false, fromDial = false } = {}) {
    if (autoRunInProgress && !fromDial) {
      return;
    }

    const normalizedTick = normalizeTickIndex(tickIndex);
    const gateStateChanged = normalizedTick !== activeGateTick;
    activeGateTick = normalizedTick;

    if (!fromDial && gateDial) {
      gateDial.setTick(normalizedTick, {
        deferMeasurementClear,
        reason: "programmatic",
      });
      return;
    }

    if (gateStateChanged && !deferMeasurementClear) {
      clearMeasurementApparatus();
    }

    const [blueWeight, redWeight] = gateOutputWeightsForCurrentTickFromBlueBasis();
    updateStateText(blueWeight, redWeight);
    applyQubitColorForTick();
  }

  gateDial = createSingleQubitGateDial({
    ticksWrap,
    arrow: gateArrow,
    initialTick: activeGateTick,
    tickAriaLabelPrefix: "Tick",
    orbitInset: 10,
    canInteract: () => !autoRunInProgress,
    onTickChange: (tick, meta) => {
      setGateTick(tick, {
        deferMeasurementClear: meta.deferMeasurementClear,
        fromDial: true,
      });
    },
    onTickCommitted: ({ changed }) => {
      if (changed) {
        clearMeasurementApparatus();
      }
    },
  });

  function undockQubit() {
    if (!qubitDocked) {
      return;
    }

    qubitDocked = false;
    qubit.classList.remove("docked");
  }

  function snapQubitToWindowCenter() {
    const windowCenter = stagePointForElementCenter(gateWindow);
    setQubitCenter(windowCenter.x, windowCenter.y);

    qubitDocked = true;
    qubit.classList.add("docked");
  }

  function circleIntersectionArea(r1, r2, distance) {
    if (distance >= r1 + r2) {
      return 0;
    }

    if (distance <= Math.abs(r1 - r2)) {
      const minRadius = Math.min(r1, r2);
      return Math.PI * minRadius * minRadius;
    }

    const a1 = r1 * r1;
    const a2 = r2 * r2;

    const alpha = Math.acos((distance * distance + a1 - a2) / (2 * distance * r1));
    const beta = Math.acos((distance * distance + a2 - a1) / (2 * distance * r2));

    const overlap =
      a1 * alpha +
      a2 * beta -
      0.5 *
        Math.sqrt(
          (-distance + r1 + r2) *
            (distance + r1 - r2) *
            (distance - r1 + r2) *
            (distance + r1 + r2)
        );

    return overlap;
  }

  function qubitOverlapRatioWithRect(element) {
    const qubitRect = qubit.getBoundingClientRect();
    const targetRect = element.getBoundingClientRect();

    const overlapWidth = Math.max(
      0,
      Math.min(qubitRect.right, targetRect.right) - Math.max(qubitRect.left, targetRect.left)
    );
    const overlapHeight = Math.max(
      0,
      Math.min(qubitRect.bottom, targetRect.bottom) - Math.max(qubitRect.top, targetRect.top)
    );

    const overlapArea = overlapWidth * overlapHeight;
    const qubitArea = qubitRect.width * qubitRect.height;
    return qubitArea > 0 ? overlapArea / qubitArea : 0;
  }

  function getMeasurementLensOffsetFromToolCenter() {
    const toolRect = measurementTool.getBoundingClientRect();
    const lensRect = measureLens.getBoundingClientRect();
    const toolCenterX = toolRect.left + toolRect.width / 2;
    const toolCenterY = toolRect.top + toolRect.height / 2;
    const lensCenterX = lensRect.left + lensRect.width / 2;
    const lensCenterY = lensRect.top + lensRect.height / 2;
    return {
      x: lensCenterX - toolCenterX,
      y: lensCenterY - toolCenterY,
    };
  }

  function getMeasurementLensCircleInViewport() {
    const toolRect = measurementTool.getBoundingClientRect();
    const toolCenterX = toolRect.left + toolRect.width / 2;
    const toolCenterY = toolRect.top + toolRect.height / 2;
    const lensOffset = getMeasurementLensOffsetFromToolCenter();
    const lensRect = measureLens.getBoundingClientRect();
    const lensRadius = Math.min(lensRect.width, lensRect.height) / 2;
    return {
      x: toolCenterX + lensOffset.x,
      y: toolCenterY + lensOffset.y,
      radius: lensRadius,
    };
  }

  function getMeasurementLensCenterInStageCoords() {
    const lensCircle = getMeasurementLensCircleInViewport();
    return getStageCoordsFromViewportPoint(lensCircle.x, lensCircle.y);
  }

  function getMeasurementLensCenterInMachineCoords() {
    const shellRect = machineShell.getBoundingClientRect();
    const lensCircle = getMeasurementLensCircleInViewport();
    return {
      x: lensCircle.x - shellRect.left,
      y: lensCircle.y - shellRect.top,
    };
  }

  function qubitOverlapRatioWithLens() {
    const qubitRect = qubit.getBoundingClientRect();

    const qRadius = qubitRect.width / 2;
    const lensCircle = getMeasurementLensCircleInViewport();
    const lRadius = lensCircle.radius;
    if (qRadius <= 0 || lRadius <= 0) {
      return 0;
    }

    const qCx = qubitRect.left + qRadius;
    const qCy = qubitRect.top + qRadius;
    const lCx = lensCircle.x;
    const lCy = lensCircle.y;

    const distance = Math.hypot(qCx - lCx, qCy - lCy);
    const overlapArea = circleIntersectionArea(qRadius, lRadius, distance);
    const qubitArea = Math.PI * qRadius * qRadius;

    return overlapArea / qubitArea;
  }

  function maybeSnapQubit() {
    if (
      qubitOverlapRatioWithRect(gateFunnel) >= 0.45 &&
      !gateTransitInProgress &&
      !autoRunInProgress &&
      !measurementInProgress
    ) {
      runGateTransit(runToken).catch(() => {});
      return true;
    }

    return false;
  }

  function qubitOverlapsMeasurementTool() {
    return qubitOverlapRatioWithLens() >= MEASUREMENT_OVERLAP_THRESHOLD;
  }

  async function runMeasurementIngressAndSequence(
    expectedRunToken = runToken,
    { meltDuration = AUTO_MELT_MS } = {}
  ) {
    if (expectedRunToken !== runToken || gateTransitInProgress || measurementInProgress) {
      return false;
    }

    qubitDragging = false;
    qubit.classList.remove("dragging");
    undockQubit();

    const lensCenter = getMeasurementLensCenterInStageCoords();
    setQubitCenter(lensCenter.x, lensCenter.y);
    settleQubitVisualState();

    await startMeasurementSequence(expectedRunToken, {
      meltDuration,
      requireLensOverlap: false,
      collapsePauseMs: 0,
      ejectAfterMeasurement: false,
    });
    return true;
  }

  function maybeSnapQubitToMeasurementTool() {
    if (
      qubitOverlapsMeasurementTool() &&
      !gateTransitInProgress &&
      !autoRunInProgress &&
      !measurementInProgress
    ) {
      runMeasurementIngressAndSequence(runToken).catch(() => {});
      return true;
    }
    return false;
  }

  function preventManualPipeOverlap() {
    if (gateTransitInProgress || autoRunInProgress || measurementInProgress) {
      return false;
    }

    const stageRect = gateStage.getBoundingClientRect();
    const pipeRect = gateWindow.getBoundingClientRect();
    const qubitRect = qubit.getBoundingClientRect();
    const center = stagePointForElementCenter(qubit);
    const resolved = resolveCircleRectOverlap(
      center.x,
      center.y,
      qubitRect.width / 2,
      {
        left: pipeRect.left - stageRect.left,
        right: pipeRect.right - stageRect.left,
        top: pipeRect.top - stageRect.top,
        bottom: pipeRect.bottom - stageRect.top,
      },
      1
    );

    if (!resolved.overlapped) {
      return false;
    }

    setQubitCenter(resolved.x, resolved.y);
    return true;
  }

  function getStageCoordsFromViewportPoint(x, y) {
    const stageRect = gateStage.getBoundingClientRect();
    return {
      x: x - stageRect.left,
      y: y - stageRect.top,
    };
  }

  function moveQubitToStagePoint(x, y, duration = 620) {
    return new Promise((resolve) => {
      qubit.style.setProperty("--move-duration", `${duration}ms`);
      qubit.classList.add("migrating");
      setQubitCenter(x, y);
      window.setTimeout(resolve, duration);
    });
  }

  function createMeasurementPayload(color, startPoint) {
    const payload = document.createElement("span");
    payload.className = "qubit measurement-pellet measurement-square-pellet";
    payload.setAttribute("aria-hidden", "true");
    payload.style.left = `${startPoint.x}px`;
    payload.style.top = `${startPoint.y}px`;
    payload.style.pointerEvents = "none";
    payload.style.setProperty("--qubit-fill", color === "blue" ? blendBlueRed(1, 0) : blendBlueRed(0, 1));
    gateStage.appendChild(payload);
    return payload;
  }

  function movePayloadToStagePoint(payload, x, y, duration = AUTO_TRAVEL_MS) {
    return new Promise((resolve) => {
      payload.style.setProperty("--move-duration", `${duration}ms`);
      payload.classList.add("migrating");
      payload.style.left = `${x}px`;
      payload.style.top = `${y}px`;
      window.setTimeout(resolve, duration);
    });
  }

  function wait(duration) {
    return new Promise((resolve) => window.setTimeout(resolve, duration));
  }

  function setPlatformExtended(extended) {
    windowWrap.classList.toggle("platform-extended", extended);
  }

  function setMeasurementPlatformExtended(extended) {
    measurementTool.classList.toggle("platform-extended", extended);
  }

  async function runGateTransit(
    expectedRunToken = runToken,
    {
      travelDuration = AUTO_TRAVEL_MS,
      dwellDuration = GATE_TUBE_DWELL_MS,
      retractPauseDuration = GATE_PLATFORM_RETRACT_MS,
    } = {}
  ) {
    if (gateTransitInProgress || expectedRunToken !== runToken) {
      return false;
    }

    gateTransitInProgress = true;
    qubitDragging = false;
    qubit.classList.remove("dragging");
    undockQubit();
    setPlatformExtended(false);
    windowWrap.classList.add("gate-busy");

    try {
      const tubeCenter = stagePointForElementCenter(gateWindow);
      await moveQubitToStagePoint(tubeCenter.x, tubeCenter.y, travelDuration);
      if (expectedRunToken !== runToken) {
        return false;
      }

      snapQubitToWindowCenter();
      await wait(dwellDuration);
      if (expectedRunToken !== runToken) {
        return false;
      }

      applyActiveGateToQubitVector();
      qubitHasEnteredGate = true;
      updateStateText(qubitBlueWeight, qubitRedWeight);
      applyQubitColorForTick();
      applySingleGateSignFromVector();

      const retractedPlatformPoint = stagePointForElementCenter(gatePlatform);
      setQubitCenter(retractedPlatformPoint.x, retractedPlatformPoint.y);
      qubit.classList.remove("docked");
      qubitDocked = false;

      setPlatformExtended(true);
      const stageRect = gateStage.getBoundingClientRect();
      const pipeRect = gateWindow.getBoundingClientRect();
      const qubitRect = qubit.getBoundingClientRect();
      const ejectedCenter = {
        x: pipeRect.right - stageRect.left + 100 + qubitRect.width / 2,
        y: retractedPlatformPoint.y,
      };
      await moveQubitToStagePoint(ejectedCenter.x, ejectedCenter.y, GATE_PLATFORM_EXTEND_MS);
      if (expectedRunToken !== runToken) {
        return false;
      }

      settleQubitVisualState();
      setPlatformExtended(false);
      if (retractPauseDuration > 0) {
        await wait(retractPauseDuration);
        if (expectedRunToken !== runToken) {
          return false;
        }
      }

      return true;
    } finally {
      windowWrap.classList.remove("gate-busy");
      setPlatformExtended(false);
      gateTransitInProgress = false;
    }
  }

  function nextFrame() {
    return new Promise((resolve) => window.requestAnimationFrame(() => resolve()));
  }

  function settleQubitVisualState() {
    qubit.classList.remove("migrating");
    qubit.classList.remove("melting");
    qubit.classList.remove("collapse-animating");
    qubit.classList.remove("measurement-pellet");
    qubit.style.opacity = "";
    qubit.style.removeProperty("--move-duration");
    qubit.style.removeProperty("--melt-duration");
  }

  function updateTubeFills() {
    const blueFillPercent = Math.min((blueTubeCount / tubeQubitCapacity) * 100, 100);
    const redFillPercent = Math.min((redTubeCount / tubeQubitCapacity) * 100, 100);

    tubeBlueCount.textContent = String(blueTubeCount);
    tubeRedCount.textContent = String(redTubeCount);
    tubeBlueLiquid.style.height = `${blueFillPercent}%`;
    tubeRedLiquid.style.height = `${redFillPercent}%`;
  }

  function updateTubeCapacityText() {
    if (!tubeCapacity) {
      return;
    }
    tubeCapacity.textContent = `The testtubes can each hold ${tubeQubitCapacity} qubits.`;
  }

  function maybeExpandTubeCapacity() {
    const largestTubeCount = Math.max(blueTubeCount, redTubeCount);
    let expanded = false;

    while (largestTubeCount > tubeQubitCapacity) {
      tubeQubitCapacity *= 2;
      expanded = true;
    }

    if (expanded) {
      updateTubeCapacityText();
    }
  }

  function positionTubeCapacityBox() {
    if (!tubeCapacity) {
      return;
    }
    tubeCapacity.style.left = "";
  }

  function alignMeasurementToolCenterWithGate() {
    const gateCenterY = stagePointForElementCenter(gateWindow).y;
    const measurementCenterY = stagePointForElementCenter(measurementTool).y;
    const deltaY = gateCenterY + ONE_QUBIT_MEASUREMENT_TOOL_SHIFT_Y - measurementCenterY;
    measurementStageShiftY += deltaY;
    measurementStage.style.transform = `translateY(${measurementStageShiftY}px)`;
    if (messageWrap) {
      messageWrap.style.transform = `translateX(-50%) translateY(${measurementStageShiftY}px)`;
    }
  }

  function getElementCenterInMachineCoords(element) {
    const shellRect = machineShell.getBoundingClientRect();
    const rect = element.getBoundingClientRect();
    return {
      x: rect.left - shellRect.left + rect.width / 2,
      y: rect.top - shellRect.top + rect.height / 2,
    };
  }

  function positionLightningBolt(bolt, start, end) {
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const length = Math.hypot(dx, dy);
    const angle = (Math.atan2(dy, dx) * 180) / Math.PI;

    bolt.style.left = `${start.x}px`;
    bolt.style.top = `${start.y}px`;
    bolt.style.width = `${length}px`;
    bolt.style.transform = `translateY(-50%) rotate(${angle}deg)`;
  }

  function positionLightningBolts() {
    const origin = getElementCenterInMachineCoords(qubit);
    const gateCenter = getElementCenterInMachineCoords(gateWindow);
    const lensCenter = getMeasurementLensCenterInMachineCoords();

    positionLightningBolt(boltToGate, origin, gateCenter);
    positionLightningBolt(boltToLens, gateCenter, lensCenter);
  }

  function setLightningActive(active) {
    boltToGate.classList.toggle("active", active);
    boltToLens.classList.toggle("active", active);
  }

  function collapseQubitState() {
    syncWeightsFromVector();
    const blueProbability = qubitBlueWeight;

    if (blueProbability >= 1) {
      setQubitVector([1, 0]);
      qubit.style.setProperty("--qubit-fill", blendBlueRed(1, 0));
      delete qubit.dataset.phaseSign;
      updateStateText(qubitBlueWeight, qubitRedWeight);
      return "blue";
    }

    if (blueProbability <= 0) {
      setQubitVector([0, 1]);
      qubit.style.setProperty("--qubit-fill", blendBlueRed(0, 1));
      delete qubit.dataset.phaseSign;
      updateStateText(qubitBlueWeight, qubitRedWeight);
      return "red";
    }

    const collapseToBlue = Math.random() < blueProbability;

    if (collapseToBlue) {
      setQubitVector([1, 0]);
      qubit.style.setProperty("--qubit-fill", blendBlueRed(1, 0));
      delete qubit.dataset.phaseSign;
      updateStateText(qubitBlueWeight, qubitRedWeight);
      return "blue";
    }

    setQubitVector([0, 1]);
    qubit.style.setProperty("--qubit-fill", blendBlueRed(0, 1));
    delete qubit.dataset.phaseSign;
    updateStateText(qubitBlueWeight, qubitRedWeight);
    return "red";
  }

  async function animateMeasurementPayloadToTube(
    collapsedColor,
    startPoint,
    expectedRunToken,
    { migrationDuration = AUTO_TRAVEL_MS, meltDuration = AUTO_MELT_MS } = {}
  ) {
    const payload = createMeasurementPayload(collapsedColor, startPoint);
    try {
      const targetTube = collapsedColor === "blue" ? tubeBlue : tubeRed;
      const targetRect = targetTube.getBoundingClientRect();
      const targetPoint = getStageCoordsFromViewportPoint(
        targetRect.left + targetRect.width / 2,
        targetRect.top + targetRect.height * 0.22
      );

      await movePayloadToStagePoint(payload, targetPoint.x, targetPoint.y, migrationDuration);
      if (expectedRunToken !== runToken) {
        return false;
      }

      payload.style.setProperty("--melt-duration", `${meltDuration}ms`);
      payload.classList.add("melting");
      await wait(meltDuration);
      if (expectedRunToken !== runToken) {
        return false;
      }

      if (collapsedColor === "blue") {
        blueTubeCount += 1;
      } else {
        redTubeCount += 1;
      }

      maybeExpandTubeCapacity();
      updateTubeFills();
      return true;
    } finally {
      payload.remove();
    }
  }

  async function startMeasurementSequence(
    expectedRunToken = runToken,
    {
      migrationDuration = AUTO_TRAVEL_MS,
      meltDuration = AUTO_MELT_MS,
      requireLensOverlap = true,
      collapsePauseMs = OBSERVABLE_COLLAPSE_PAUSE_MS,
      ejectAfterMeasurement = true,
      postMeasurementShiftX = 100,
    } = {}
  ) {
    if (measurementInProgress || gateTransitInProgress) {
      return;
    }

    if (expectedRunToken !== runToken) {
      return;
    }

    if (requireLensOverlap && qubitOverlapRatioWithLens() < MEASUREMENT_OVERLAP_THRESHOLD) {
      return;
    }

    measurementInProgress = true;
    qubitDragging = false;
    qubit.classList.remove("dragging");
    undockQubit();
    setMeasurementPlatformExtended(false);

    try {
      qubit.classList.add("collapse-animating");
      const collapsedColor = collapseQubitState();
      if (collapsePauseMs > 0) {
        await wait(collapsePauseMs);
      }
      qubit.classList.remove("collapse-animating");
      if (expectedRunToken !== runToken) {
        return;
      }

      let payloadStartPoint = null;
      if (ejectAfterMeasurement) {
        const stageRect = gateStage.getBoundingClientRect();
        const measurementRect = measurementTool.getBoundingClientRect();
        const qubitRect = qubit.getBoundingClientRect();
        const ejectedPoint = {
          x: measurementRect.right - stageRect.left + 20 + qubitRect.width / 2,
          y: measurementRect.top - stageRect.top + measurementRect.height / 2,
        };

        setMeasurementPlatformExtended(true);
        await moveQubitToStagePoint(ejectedPoint.x, ejectedPoint.y, GATE_PLATFORM_EXTEND_MS);
        setMeasurementPlatformExtended(false);
        if (expectedRunToken !== runToken) {
          return;
        }
        settleQubitVisualState();
        setQubitCenter(ejectedPoint.x, ejectedPoint.y);
        payloadStartPoint = ejectedPoint;
      } else {
        const lensCenter = getMeasurementLensCenterInStageCoords();
        settleQubitVisualState();
        setQubitCenter(lensCenter.x, lensCenter.y);
        payloadStartPoint = lensCenter;
      }

      await animateMeasurementPayloadToTube(collapsedColor, payloadStartPoint, expectedRunToken, {
        migrationDuration,
        meltDuration,
      });

      if (!ejectAfterMeasurement && postMeasurementShiftX !== 0 && expectedRunToken === runToken) {
        setQubitCenter(payloadStartPoint.x + postMeasurementShiftX, payloadStartPoint.y);
      }
    } finally {
      setMeasurementPlatformExtended(false);
      qubit.classList.remove("collapse-animating");
      measurementInProgress = false;
    }
  }

  async function runAutomatedMeasurements(iterations) {
    if (autoRunInProgress || measurementInProgress || gateTransitInProgress) {
      return;
    }

    const useMachineMode = iterations >= 100;
    const speedFactor = iterations >= 10 ? 2 : 1;
    const travelDuration = Math.round(AUTO_TRAVEL_MS / speedFactor);
    const meltDuration = Math.round(AUTO_MELT_MS / speedFactor);
    const machineDuration =
      iterations === 100
        ? MACHINE_DURATION_100_MS
        : iterations === 1000
          ? MACHINE_DURATION_1000_MS
          : null;

    const thisRunToken = runToken + 1;
    runToken = thisRunToken;
    autoRunInProgress = true;
    measurementCount.disabled = true;
    qubitDragging = false;
    qubit.classList.remove("dragging");

    try {
      if (useMachineMode) {
        placeQubitToLeftOfWindow();
        positionLightningBolts();
        setLightningActive(true);

        const processOneMeasurement = () => {
          setQubitVector([1, 0]);
          applyActiveGateToQubitVector();
          qubit.style.setProperty("--qubit-fill", blendBlueRed(qubitBlueWeight, qubitRedWeight));
          updateStateText(qubitBlueWeight, qubitRedWeight);

          const collapsedColor = collapseQubitState();
          if (collapsedColor === "blue") {
            blueTubeCount += 1;
          } else {
            redTubeCount += 1;
          }

          maybeExpandTubeCapacity();
        };

        let processed = 0;

        if (machineDuration !== null) {
          const runStart = performance.now();

          while (processed < iterations) {
            if (thisRunToken !== runToken) {
              break;
            }

            const elapsed = performance.now() - runStart;
            const progress = Math.min(elapsed / machineDuration, 1);
            const shouldBeProcessed = Math.floor(progress * iterations);

            if (shouldBeProcessed <= processed) {
              await nextFrame();
              continue;
            }

            while (processed < shouldBeProcessed && processed < iterations) {
              processOneMeasurement();
              processed += 1;
            }

            updateTubeFills();
            await nextFrame();
          }
        } else {
          await nextFrame();
          while (processed < iterations && thisRunToken === runToken) {
            processOneMeasurement();
            processed += 1;
          }
        }

        updateTubeFills();
        placeQubitToLeftOfWindow();
        return;
      }

      for (let i = 0; i < iterations; i += 1) {
        if (thisRunToken !== runToken) {
          break;
        }

        placeQubitToLeftOfWindow();
        await runGateTransit(thisRunToken, {
          travelDuration,
          dwellDuration: GATE_TUBE_DWELL_MS,
        });
        if (thisRunToken !== runToken || gateTransitInProgress) {
          break;
        }

        const lensCenter = getMeasurementLensCenterInStageCoords();

        await moveQubitToStagePoint(lensCenter.x, lensCenter.y, travelDuration);
        if (thisRunToken !== runToken) {
          break;
        }

        await startMeasurementSequence(thisRunToken, {
          migrationDuration: travelDuration,
          meltDuration,
          collapsePauseMs: 0,
          ejectAfterMeasurement: false,
        });
      }
    } finally {
      setLightningActive(false);
      autoRunInProgress = false;
      measurementCount.disabled = false;
    }
  }

  function beginQubitDrag(event) {
    if (handleShiftQubitSelection(event, qubit)) {
      return;
    }
    if (measurementInProgress || autoRunInProgress || gateTransitInProgress) {
      return;
    }
    if (!isPrimaryMouseButton(event)) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    const point = getPointer(event);
    const qubitRect = qubit.getBoundingClientRect();

    qubitDragging = true;
    qubit.classList.add("dragging");
    undockQubit();

    qubitDragOffsetX = point.clientX - (qubitRect.left + qubitRect.width / 2);
    qubitDragOffsetY = point.clientY - (qubitRect.top + qubitRect.height / 2);
  }

  function continueQubitDrag(event) {
    if (!qubitDragging || measurementInProgress || autoRunInProgress || gateTransitInProgress) {
      return;
    }

    if (event.touches) {
      event.preventDefault();
    }

    const point = getPointer(event);
    const stageRect = gateStage.getBoundingClientRect();

    const nextX = point.clientX - stageRect.left - qubitDragOffsetX;
    const nextY = point.clientY - stageRect.top - qubitDragOffsetY;

    setQubitCenter(nextX, nextY);
    if (maybeSnapQubit()) {
      return;
    }
    if (maybeSnapQubitToMeasurementTool()) {
      return;
    }
    preventManualPipeOverlap();
  }

  function endQubitDrag() {
    if (!qubitDragging || measurementInProgress || autoRunInProgress || gateTransitInProgress) {
      return;
    }

    qubitDragging = false;
    qubit.classList.remove("dragging");

    if (maybeSnapQubit()) {
      return;
    }
    if (maybeSnapQubitToMeasurementTool()) {
      return;
    }
    preventManualPipeOverlap();
  }

  function beginGateArrowDrag(event) {
    gateDial?.beginDrag(event);
  }

  function continueGateArrowDrag(event) {
    gateDial?.continueDrag(event);
  }

  function endGateArrowDrag() {
    gateDial?.endDrag();
  }

  function placeQubitToLeftOfWindow() {
    qubit.classList.remove("dragging");
    qubit.classList.remove("migrating");
    qubit.classList.remove("melting");
    qubit.classList.remove("docked");
    qubit.classList.remove("measurement-pellet");
    const windowCenter = stagePointForElementCenter(gateWindow);
    const stageRect = gateStage.getBoundingClientRect();
    const movementRect = machineShell.getBoundingClientRect();
    const baseWidth = qubit.offsetWidth || qubit.getBoundingClientRect().width;
    const radius = baseWidth / 2;
    const minX = movementRect.left - stageRect.left + radius;
    const x = minX + QUBIT_START_EDGE_GAP + 5;

    setQubitCenter(x, windowCenter.y);
    qubitDocked = false;
    qubitDragging = false;
    setPlatformExtended(false);
    setMeasurementPlatformExtended(false);
    windowWrap.classList.remove("gate-busy");
    qubit.style.setProperty("--qubit-fill", blendBlueRed(1, 0));
    setQubitVector([1, 0]);
    qubitHasEnteredGate = false;
    delete qubit.dataset.phaseSign;
    updateStateText(qubitBlueWeight, qubitRedWeight);
  }

  function handleResize() {
    const stageRect = gateStage.getBoundingClientRect();
    if (!stageRect.width || !stageRect.height) {
      return;
    }

    gateDial?.layout();

    positionTubeCapacityBox();
    alignMeasurementToolCenterWithGate();
    positionLightningBolts();

    if (!qubitInitialized) {
      placeQubitToLeftOfWindow();
      qubitInitialized = true;
      return;
    }

    if (qubitDocked) {
      snapQubitToWindowCenter();
      return;
    }

    const currentCenter = stagePointForElementCenter(qubit);
    setQubitCenter(currentCenter.x, currentCenter.y);
  }

  function handleLensClickRun() {
    if (autoRunInProgress || measurementInProgress || gateTransitInProgress) {
      return;
    }

    const iterations = Number(measurementCount.value) || 1;
    runAutomatedMeasurements(Math.max(1, iterations));
  }

  function resetAll() {
    runToken += 1;
    autoRunInProgress = false;
    measurementInProgress = false;
    gateTransitInProgress = false;
    qubitDragging = false;
    measurementCount.disabled = false;
    measurementCount.value = "1";
    lastRequestedMeasurementCount = 1;
    qubit.classList.remove("dragging");
    qubit.classList.remove("migrating");
    qubit.classList.remove("melting");
    qubit.classList.remove("docked");
    qubit.classList.remove("measurement-pellet");
    gateArrow.classList.remove("dragging");
    setLightningActive(false);
    setMeasurementPlatformExtended(false);
    qubitHasEnteredGate = false;

    tubeQubitCapacity = INITIAL_TUBE_QUBIT_CAPACITY;
    blueTubeCount = 0;
    redTubeCount = 0;
    updateTubeCapacityText();
    updateTubeFills();

    setGateTick(DEFAULT_SINGLE_GATE_TICK_INDEX);
    placeQubitToLeftOfWindow();
  }

  qubit.addEventListener("mousedown", beginQubitDrag);
  qubit.addEventListener("touchstart", beginQubitDrag, { passive: false });
  gateArrow.addEventListener("mousedown", beginGateArrowDrag);
  gateArrow.addEventListener("touchstart", beginGateArrowDrag, { passive: false });
  gateArrow.addEventListener("keydown", (event) => gateDial?.handleKeydown(event));

  window.addEventListener("mousemove", (event) => {
    continueGateArrowDrag(event);
    continueQubitDrag(event);
  });

  window.addEventListener(
    "touchmove",
    (event) => {
      continueGateArrowDrag(event);
      continueQubitDrag(event);
    },
    { passive: false }
  );

  window.addEventListener("mouseup", () => {
    endGateArrowDrag();
    endQubitDrag();
  });

  window.addEventListener("touchend", () => {
    endGateArrowDrag();
    endQubitDrag();
  });

  window.addEventListener("touchcancel", () => {
    endGateArrowDrag();
    endQubitDrag();
  });

  measurementCount.addEventListener("mousedown", (event) => {
    event.stopPropagation();
  });

  measurementCount.addEventListener("touchstart", (event) => {
    event.stopPropagation();
  });

  measurementCount.addEventListener("click", (event) => {
    event.stopPropagation();
  });

  measurementCount.addEventListener("change", () => {
    const iterations = Math.max(1, Number(measurementCount.value) || 1);
    if (iterations === lastRequestedMeasurementCount) {
      return;
    }
    lastRequestedMeasurementCount = iterations;
    clearMeasurementApparatus();
    runAutomatedMeasurements(iterations);
  });

  measurementTool.addEventListener("click", () => {
    handleLensClickRun();
  });

  resetButton.addEventListener("click", () => {
    resetAll();
  });

  setGateTick(DEFAULT_SINGLE_GATE_TICK_INDEX);
  updateTubeCapacityText();
  updateTubeFills();

  return {
    handleResize,
  };
}

function setupTwoQubitPair(root) {
  const pairMeasurementHost = root.querySelector('[data-role="pair-measurement-host"]');
  mountPairMeasurementTool(pairMeasurementHost);
  mountPairCnotGate(root);
  const pairShell = root.querySelector('[data-role="pair-shell"]');
  const pairStageA = root.querySelector('[data-role="pair-stage-a"]');
  const pairStageB = root.querySelector('[data-role="pair-stage-b"]');
  const pairWindowWrapA = root.querySelector('[data-role="pair-window-wrap-a"]');
  const pairWindowWrapB = root.querySelector('[data-role="pair-window-wrap-b"]');
  const pairFunnelA = root.querySelector('[data-role="pair-tube-funnel-a"]');
  const pairFunnelB = root.querySelector('[data-role="pair-tube-funnel-b"]');
  const pairWindowA = root.querySelector('[data-role="pair-window-a"]');
  const pairWindowB = root.querySelector('[data-role="pair-window-b"]');
  const pairTicksA = root.querySelector('[data-role="pair-ticks-a"]');
  const pairTicksB = root.querySelector('[data-role="pair-ticks-b"]');
  const pairArrowA = root.querySelector('[data-role="pair-arrow-a"]');
  const pairArrowB = root.querySelector('[data-role="pair-arrow-b"]');
  const pairCnotHost = root.querySelector('[data-role="pair-cnot-host"]');
  const pairCnotGate = pairCnotHost ? pairCnotHost.querySelector(".cnot-gate, .ent-double-gate") : null;
  const pairCnotBody = pairCnotGate ? pairCnotGate.querySelector(".cnot-body, .ent-pipe") : null;
  const pairCnotFunnelTop = pairCnotGate ? pairCnotGate.querySelector(".cnot-input-funnel-top") : null;
  const pairCnotFunnelBottom = pairCnotGate ? pairCnotGate.querySelector(".cnot-input-funnel-bottom") : null;
  const pairCnotWindowTop = pairCnotGate ? pairCnotGate.querySelector(".cnot-porthole-top") : null;
  const pairCnotWindowBottom = pairCnotGate ? pairCnotGate.querySelector(".cnot-porthole-bottom") : null;
  const pairCnotSpring = pairCnotGate ? pairCnotGate.querySelector(".cnot-spring") : null;
  const qubitA = root.querySelector('[data-role="pair-qubit-a"]');
  const qubitB = root.querySelector('[data-role="pair-qubit-b"]');
  const pairLens = root.querySelector('[data-role="pair-lens"]');
  const pairMeasurementFunnel = root.querySelector('[data-role="pair-measurement-funnel"]');
  const pairSlotLeft = root.querySelector('[data-role="pair-slot-left"]');
  const pairSlotRight = root.querySelector('[data-role="pair-slot-right"]');
  const pairMeasurementPlatform = root.querySelector(".pair-measurement-platform");
  const pairMeasurementCount = root.querySelector('[data-role="pair-measurement-count"]');
  const pairMeasurementBlock = root.querySelector(".pair-measurement");
  const pairTubeRack = root.querySelector(".pair-tube-rack");
  const tubeBB = root.querySelector('[data-role="pair-tube-bb"]');
  const tubeBR = root.querySelector('[data-role="pair-tube-br"]');
  const tubeRB = root.querySelector('[data-role="pair-tube-rb"]');
  const tubeRR = root.querySelector('[data-role="pair-tube-rr"]');
  const liquidBB = root.querySelector('[data-role="pair-liquid-bb"]');
  const liquidBR = root.querySelector('[data-role="pair-liquid-br"]');
  const liquidRB = root.querySelector('[data-role="pair-liquid-rb"]');
  const liquidRR = root.querySelector('[data-role="pair-liquid-rr"]');
  const countBB = root.querySelector('[data-role="pair-count-bb"]');
  const countBR = root.querySelector('[data-role="pair-count-br"]');
  const countRB = root.querySelector('[data-role="pair-count-rb"]');
  const countRR = root.querySelector('[data-role="pair-count-rr"]');
  const boltA = root.querySelector('[data-role="pair-bolt-a"]');
  const boltB = root.querySelector('[data-role="pair-bolt-b"]');
  const pairCapacity = root.querySelector('[data-role="pair-capacity"]');
  const pairResetButton = root.querySelector('[data-role="pair-reset"]');

  if (
    !pairMeasurementHost ||
    !pairShell ||
    !pairStageA ||
    !pairStageB ||
    !pairWindowWrapA ||
    !pairWindowWrapB ||
    !pairFunnelA ||
    !pairFunnelB ||
    !pairWindowA ||
    !pairWindowB ||
    !pairTicksA ||
    !pairTicksB ||
    !pairArrowA ||
    !pairArrowB ||
    !pairCnotHost ||
    !pairCnotGate ||
    !pairCnotBody ||
    !pairCnotFunnelTop ||
    !pairCnotFunnelBottom ||
    !pairCnotWindowTop ||
    !pairCnotWindowBottom ||
    !pairCnotSpring ||
    !qubitA ||
    !qubitB ||
    !pairLens ||
    !pairMeasurementFunnel ||
    !pairSlotLeft ||
    !pairSlotRight ||
    !pairMeasurementPlatform ||
    !pairMeasurementCount ||
    !pairMeasurementBlock ||
    !pairTubeRack ||
    !tubeBB ||
    !tubeBR ||
    !tubeRB ||
    !tubeRR ||
    !liquidBB ||
    !liquidBR ||
    !liquidRB ||
    !liquidRR ||
    !countBB ||
    !countBR ||
    !countRB ||
    !countRR ||
    !boltA ||
    !boltB
  ) {
    return null;
  }

  registerSelectionContainer(pairShell);

  const gates = [
    {
      stage: pairStageA,
      wrap: pairWindowWrapA,
      funnel: pairFunnelA,
      window: pairWindowA,
      ticksWrap: pairTicksA,
      arrow: pairArrowA,
      activeTick: 0,
    },
    {
      stage: pairStageB,
      wrap: pairWindowWrapB,
      funnel: pairFunnelB,
      window: pairWindowB,
      ticksWrap: pairTicksB,
      arrow: pairArrowB,
      activeTick: 0,
    },
  ];
  gates.forEach((gate, gateIndex) => {
    const gateLabel = gateIndex === 0 ? "Two-Qubit Mode Gate (Top)" : "Two-Qubit Mode Gate (Bottom)";
    registerGateInspector(gate.wrap, () => ({
      label: gateLabel,
      matrix: gateMatrixForTick(gate.activeTick),
      tickIndex: gate.activeTick,
    }));
  });
  registerGateInspector(pairCnotBody, () => ({
    label: "Two-Qubit Mode CNOT Gate",
    matrix: [
      [1, 0, 0, 0],
      [0, 1, 0, 0],
      [0, 0, 0, 1],
      [0, 0, 1, 0],
    ],
  }));

  const qubits = [
    {
      key: "a",
      element: qubitA,
      gateIndex: 0,
      cnotFunnel: pairCnotFunnelTop,
      cnotWindow: pairCnotWindowTop,
      blue: 1,
      red: 0,
      docked: false,
      dragging: false,
      dragOffsetX: 0,
      dragOffsetY: 0,
      lensSlot: null,
      gateIngestTimer: null,
      gateTransitInProgress: false,
      inCnotWindow: false,
      cnotPairToken: null,
      cnotOutcomeProbabilities: null,
    },
    {
      key: "b",
      element: qubitB,
      gateIndex: 1,
      cnotFunnel: pairCnotFunnelBottom,
      cnotWindow: pairCnotWindowBottom,
      blue: 1,
      red: 0,
      docked: false,
      dragging: false,
      dragOffsetX: 0,
      dragOffsetY: 0,
      lensSlot: null,
      gateIngestTimer: null,
      gateTransitInProgress: false,
      inCnotWindow: false,
      cnotPairToken: null,
      cnotOutcomeProbabilities: null,
    },
  ];

  registerQubitInspector(qubits[0].element, () => ({
    label: "Two-Qubit Mode (Top Qubit)",
    blue: qubits[0].blue,
    red: qubits[0].red,
  }));
  registerQubitInspector(qubits[1].element, () => ({
    label: "Two-Qubit Mode (Bottom Qubit)",
    blue: qubits[1].blue,
    red: qubits[1].red,
  }));

  const tubeElementsByKey = {
    bb: tubeBB,
    br: tubeBR,
    rb: tubeRB,
    rr: tubeRR,
  };
  const tubeLiquidsByKey = {
    bb: liquidBB,
    br: liquidBR,
    rb: liquidRB,
    rr: liquidRR,
  };
  const tubeCountsByKey = {
    bb: countBB,
    br: countBR,
    rb: countRB,
    rr: countRR,
  };

  const slotOccupants = {
    left: null,
    right: null,
  };
  const tubeCountState = {
    bb: 0,
    br: 0,
    rb: 0,
    rr: 0,
  };

  let tubeQubitCapacity = INITIAL_TUBE_QUBIT_CAPACITY;
  let measurementInProgress = false;
  let cnotBusy = false;
  let autoRunInProgress = false;
  let runToken = 0;
  let initialized = false;
  const basePairShellPaddingBottom = Number.parseFloat(window.getComputedStyle(pairShell).paddingBottom) || 0;
  const gateDials = [];

  function gateWeightsForSelection(selectionIndex) {
    return oneQubitGateWeightsForTick(selectionIndex);
  }

  function stagePointForElementCenter(element) {
    const shellRect = pairShell.getBoundingClientRect();
    const rect = element.getBoundingClientRect();
    return {
      x: rect.left - shellRect.left + rect.width / 2,
      y: rect.top - shellRect.top + rect.height / 2,
    };
  }

  function setQubitCenter(qubit, x, y) {
    const shellRect = pairShell.getBoundingClientRect();
    const qubitRect = qubit.element.getBoundingClientRect();
    const radius = qubitRect.width / 2;

    const clampedX = Math.min(Math.max(x, radius), shellRect.width - radius);
    const clampedY = Math.min(Math.max(y, radius), shellRect.height - radius);
    qubit.element.style.left = `${clampedX}px`;
    qubit.element.style.top = `${clampedY}px`;
  }

  function clearLensSlotForQubit(qubit) {
    if (qubit.lensSlot && slotOccupants[qubit.lensSlot] === qubit) {
      slotOccupants[qubit.lensSlot] = null;
    }
    qubit.lensSlot = null;
    delete qubit.element.dataset.lensSlot;
  }

  function pairLensSlotOffset(slot) {
    const keys = slotOffsetDatasetKeys(slot);
    return {
      x: parseLayoutNumeric(pairShell.dataset[keys.x], TWO_QUBIT_MEASUREMENT_SLOT_SHIFT_X),
      y: parseLayoutNumeric(pairShell.dataset[keys.y], TWO_QUBIT_MEASUREMENT_SLOT_SHIFT_Y),
    };
  }

  function pairEjectionOffset(slot) {
    const keys = ejectionOffsetDatasetKeys(slot);
    return {
      x: parseLayoutNumeric(pairShell.dataset[keys.x], 0),
      y: parseLayoutNumeric(pairShell.dataset[keys.y], 0),
    };
  }

  function pairEjectionAbsolute(slot) {
    return getPairEjectionAbsoluteFromShell(pairShell, slot);
  }

  function getLensSlotCenter(slot) {
    const slotElement = slot === "left" ? pairSlotLeft : pairSlotRight;
    const center = stagePointForElementCenter(slotElement);
    const offset = pairLensSlotOffset(slot);
    return {
      x: center.x + offset.x,
      y: center.y + offset.y,
    };
  }

  function updateQubitColor(qubit) {
    qubit.element.style.setProperty("--qubit-fill", blendBlueRed(qubit.blue, qubit.red));
  }

  function applyGateStateToQubit(qubit, selectionIndex) {
    const [blueWeight, redWeight] = gateWeightsForSelection(selectionIndex);
    qubit.blue = blueWeight;
    qubit.red = redWeight;
    updateQubitColor(qubit);
    const transformed = vectorTimesMatrix2([1, 0], gateMatrixForTick(selectionIndex));
    const phaseSign = phaseSignForRealAmplitudeVector(transformed);
    if (phaseSign) {
      qubit.element.dataset.phaseSign = phaseSign;
    } else {
      delete qubit.element.dataset.phaseSign;
    }
  }

  function circleIntersectionArea(r1, r2, distance) {
    if (distance >= r1 + r2) {
      return 0;
    }

    if (distance <= Math.abs(r1 - r2)) {
      const minRadius = Math.min(r1, r2);
      return Math.PI * minRadius * minRadius;
    }

    const a1 = r1 * r1;
    const a2 = r2 * r2;
    const alpha = Math.acos((distance * distance + a1 - a2) / (2 * distance * r1));
    const beta = Math.acos((distance * distance + a2 - a1) / (2 * distance * r2));
    return (
      a1 * alpha +
      a2 * beta -
      0.5 *
        Math.sqrt(
          (-distance + r1 + r2) *
            (distance + r1 - r2) *
            (distance - r1 + r2) *
            (distance + r1 + r2)
        )
    );
  }

  function overlapRatioWithGate(qubit, gateWindow) {
    const qubitRect = qubit.element.getBoundingClientRect();
    const windowRect = gateWindow.getBoundingClientRect();
    const qRadius = qubitRect.width / 2;
    const wRadius = windowRect.width / 2;
    const qCx = qubitRect.left + qRadius;
    const qCy = qubitRect.top + qRadius;
    const wCx = windowRect.left + wRadius;
    const wCy = windowRect.top + wRadius;
    const distance = Math.hypot(qCx - wCx, qCy - wCy);
    const overlapArea = circleIntersectionArea(qRadius, wRadius, distance);
    const qubitArea = Math.PI * qRadius * qRadius;
    return overlapArea / qubitArea;
  }

  function overlapRatioWithRect(qubit, rect) {
    const qubitRect = qubit.element.getBoundingClientRect();
    const overlapWidth = Math.max(0, Math.min(qubitRect.right, rect.right) - Math.max(qubitRect.left, rect.left));
    const overlapHeight = Math.max(0, Math.min(qubitRect.bottom, rect.bottom) - Math.max(qubitRect.top, rect.top));
    const overlapArea = overlapWidth * overlapHeight;
    const qubitArea = qubitRect.width * qubitRect.height;
    return qubitArea > 0 ? overlapArea / qubitArea : 0;
  }

  function qubitReachedFunnelMidpoint(qubit, gateFunnel) {
    const funnelRect = gateFunnel.getBoundingClientRect();
    const qubitRect = qubit.element.getBoundingClientRect();
    const funnelMidX = (funnelRect.left + funnelRect.right) / 2;
    const verticalOverlap = Math.max(
      0,
      Math.min(qubitRect.bottom, funnelRect.bottom) - Math.max(qubitRect.top, funnelRect.top)
    );

    return (
      qubitRect.right >= funnelMidX &&
      qubitRect.left < funnelRect.right &&
      verticalOverlap >= qubitRect.height * 0.25
    );
  }

  function clearGateIngestAnimation(qubit) {
    if (qubit.gateIngestTimer !== null) {
      window.clearTimeout(qubit.gateIngestTimer);
      qubit.gateIngestTimer = null;
    }
    qubit.element.classList.remove("migrating");
    qubit.element.style.removeProperty("--move-duration");
  }

  function preventManualPipeOverlapForPairQubit(qubit) {
    if (measurementInProgress || autoRunInProgress) {
      return false;
    }

    const shellRect = pairShell.getBoundingClientRect();
    const pipeRect = gates[qubit.gateIndex].window.getBoundingClientRect();
    const qubitRect = qubit.element.getBoundingClientRect();
    const center = stagePointForElementCenter(qubit.element);
    const resolved = resolveCircleRectOverlap(
      center.x,
      center.y,
      qubitRect.width / 2,
      {
        left: pipeRect.left - shellRect.left,
        right: pipeRect.right - shellRect.left,
        top: pipeRect.top - shellRect.top,
        bottom: pipeRect.bottom - shellRect.top,
      },
      1
    );

    if (!resolved.overlapped) {
      const cnotRect = pairCnotBody.getBoundingClientRect();
      const cnotResolved = resolveCircleRectOverlap(
        center.x,
        center.y,
        qubitRect.width / 2,
        {
          left: cnotRect.left - shellRect.left,
          right: cnotRect.right - shellRect.left,
          top: cnotRect.top - shellRect.top,
          bottom: cnotRect.bottom - shellRect.top,
        },
        1
      );
      if (!cnotResolved.overlapped) {
        return false;
      }
      setQubitCenter(qubit, cnotResolved.x, cnotResolved.y);
      return true;
    }

    setQubitCenter(qubit, resolved.x, resolved.y);
    return true;
  }

  async function runPairGateTransit(qubit, expectedRunToken = runToken) {
    if (qubit.gateTransitInProgress || measurementInProgress || autoRunInProgress) {
      return false;
    }

    qubit.gateTransitInProgress = true;
    qubit.dragging = false;
    qubit.element.classList.remove("dragging");
    clearGateIngestAnimation(qubit);

    try {
      const gate = gates[qubit.gateIndex];
      const gateCenter = stagePointForElementCenter(gate.window);
      await moveQubitToPoint(qubit, gateCenter.x, gateCenter.y, Math.max(220, Math.round(AUTO_TRAVEL_MS * 0.45)));
      if (expectedRunToken !== runToken) {
        return false;
      }

      qubit.docked = true;
      qubit.element.classList.add("docked");
      clearLensSlotForQubit(qubit);
      await wait(GATE_TUBE_DWELL_MS);
      if (expectedRunToken !== runToken) {
        return false;
      }

      applyGateStateToQubit(qubit, gate.activeTick);
      qubit.docked = false;
      qubit.element.classList.remove("docked");
      gate.wrap.classList.add("platform-extended");

      const shellRect = pairShell.getBoundingClientRect();
      const pipeRect = gate.window.getBoundingClientRect();
      const qubitRect = qubit.element.getBoundingClientRect();
      const ejectedCenter = {
        x: pipeRect.right - shellRect.left + 100 + qubitRect.width / 2,
        y: gateCenter.y,
      };

      await moveQubitToPoint(qubit, ejectedCenter.x, ejectedCenter.y, GATE_PLATFORM_EXTEND_MS);
      if (expectedRunToken !== runToken) {
        return false;
      }

      settleQubitVisualState(qubit);
      gate.wrap.classList.remove("platform-extended");
      await wait(GATE_PLATFORM_RETRACT_MS);
      if (expectedRunToken !== runToken) {
        return false;
      }
      return true;
    } finally {
      gates[qubit.gateIndex].wrap.classList.remove("platform-extended");
      qubit.element.classList.remove("migrating");
      qubit.element.style.removeProperty("--move-duration");
      qubit.gateTransitInProgress = false;
    }
  }

  function maybeSnapQubitToGate(qubit, { allowWindowOverlap = false, runTransit = true } = {}) {
    const gate = gates[qubit.gateIndex];
    const windowOverlap = overlapRatioWithGate(qubit, gate.window);
    const funnelReachedMidpoint = qubitReachedFunnelMidpoint(qubit, gate.funnel);
    if ((allowWindowOverlap && windowOverlap >= SNAP_OVERLAP_THRESHOLD) || funnelReachedMidpoint) {
      if (runTransit && !allowWindowOverlap) {
        runPairGateTransit(qubit, runToken).catch(() => {});
        return true;
      }

      const center = stagePointForElementCenter(gate.window);
      clearGateIngestAnimation(qubit);
      qubit.dragging = false;
      qubit.element.classList.remove("dragging");
      setQubitCenter(qubit, center.x, center.y);
      qubit.docked = true;
      qubit.element.classList.add("docked");
      clearLensSlotForQubit(qubit);
      applyGateStateToQubit(qubit, gate.activeTick);
      return true;
    }

    qubit.docked = false;
    qubit.element.classList.remove("docked");
    return false;
  }

  async function runPairMeasurementIngress(qubit, expectedRunToken = runToken) {
    if (measurementInProgress || autoRunInProgress || qubit.gateTransitInProgress) {
      return false;
    }

    const chosenSlot = qubit.gateIndex === 0 ? "left" : "right";
    if (slotOccupants[chosenSlot] && slotOccupants[chosenSlot] !== qubit) {
      return false;
    }

    clearGateIngestAnimation(qubit);
    qubit.dragging = false;
    qubit.element.classList.remove("dragging");
    qubit.docked = false;
    qubit.element.classList.remove("docked");
    delete qubit.element.dataset.pairEjected;

    if (qubit.lensSlot && qubit.lensSlot !== chosenSlot && slotOccupants[qubit.lensSlot] === qubit) {
      slotOccupants[qubit.lensSlot] = null;
    }
    slotOccupants[chosenSlot] = qubit;
    qubit.lensSlot = chosenSlot;
    qubit.element.dataset.lensSlot = chosenSlot;

    const slotCenter = getLensSlotCenter(chosenSlot);
    await moveQubitToPoint(qubit, slotCenter.x, slotCenter.y, 140);
    if (expectedRunToken !== runToken || measurementInProgress || autoRunInProgress) {
      return false;
    }
    settleQubitVisualState(qubit);
    setQubitCenter(qubit, slotCenter.x, slotCenter.y);

    maybeTriggerManualPairMeasurement();
    return true;
  }

  function qubitCenterInsidePairLens(qubit) {
    const lensRect = pairLens.getBoundingClientRect();
    const qubitRect = qubit.element.getBoundingClientRect();
    const qubitCx = qubitRect.left + qubitRect.width / 2;
    const qubitCy = qubitRect.top + qubitRect.height / 2;
    return (
      qubitCx >= lensRect.left &&
      qubitCx <= lensRect.right &&
      qubitCy >= lensRect.top &&
      qubitCy <= lensRect.bottom
    );
  }

  function maybeSnapQubitToMeasurementFunnel(qubit) {
    if (!qubitCenterInsidePairLens(qubit)) {
      return false;
    }
    if (measurementInProgress || autoRunInProgress || qubit.gateTransitInProgress) {
      return false;
    }

    runPairMeasurementIngress(qubit, runToken).catch(() => {});
    return true;
  }

  function maybeSnapQubitToLens(qubit) {
    if (!qubitCenterInsidePairLens(qubit)) {
      return false;
    }

    if (measurementInProgress || autoRunInProgress || qubit.gateTransitInProgress) {
      return false;
    }

    runPairMeasurementIngress(qubit, runToken).catch(() => {});
    return true;
  }

  function collapseQubitState(qubit) {
    const totalWeight = qubit.blue + qubit.red;
    const blueProbability = totalWeight > 0 ? qubit.blue / totalWeight : 0.5;
    const blueResult = blueProbability >= 1 ? true : blueProbability <= 0 ? false : Math.random() < blueProbability;
    if (blueResult) {
      qubit.blue = 1;
      qubit.red = 0;
      updateQubitColor(qubit);
      delete qubit.element.dataset.phaseSign;
      return "b";
    }
    qubit.blue = 0;
    qubit.red = 1;
    updateQubitColor(qubit);
    delete qubit.element.dataset.phaseSign;
    return "r";
  }

  function normalizedQubitVectorFromProbabilities(qubit) {
    const total = qubit.blue + qubit.red;
    const blue = total > 0 ? qubit.blue / total : 0.5;
    const red = 1 - blue;
    return [Math.sqrt(clamp(blue, 0, 1)), Math.sqrt(clamp(red, 0, 1))];
  }

  function annotateCnotOutcomeProbabilitiesForCurrentState() {
    const outcomeProbabilities = cnotOutcomeProbabilitiesFromQubitVectors(
      normalizedQubitVectorFromProbabilities(qubits[0]),
      normalizedQubitVectorFromProbabilities(qubits[1])
    );
    const pairToken = `${Date.now()}-${Math.random()}`;
    qubits[0].cnotPairToken = pairToken;
    qubits[1].cnotPairToken = pairToken;
    qubits[0].cnotOutcomeProbabilities = outcomeProbabilities;
    qubits[1].cnotOutcomeProbabilities = outcomeProbabilities;
  }

  function applyCnotGateToQubits() {
    const marginals = cnotMarginalProbabilitiesFromQubitVectors(
      normalizedQubitVectorFromProbabilities(qubits[0]),
      normalizedQubitVectorFromProbabilities(qubits[1])
    );
    qubits[0].blue = marginals.control[0];
    qubits[0].red = marginals.control[1];
    qubits[1].blue = marginals.target[0];
    qubits[1].red = marginals.target[1];
    qubits.forEach((qubit) => {
      delete qubit.element.dataset.phaseSign;
      updateQubitColor(qubit);
    });
  }

  function cnotOutcomeProbabilitiesForQubitPair(topQubit, bottomQubit) {
    if (
      topQubit.cnotPairToken &&
      topQubit.cnotPairToken === bottomQubit.cnotPairToken &&
      topQubit.cnotOutcomeProbabilities &&
      bottomQubit.cnotOutcomeProbabilities
    ) {
      return topQubit.cnotOutcomeProbabilities;
    }
    return cnotOutcomeProbabilitiesFromQubitVectors(
      normalizedQubitVectorFromProbabilities(topQubit),
      normalizedQubitVectorFromProbabilities(bottomQubit)
    );
  }

  function collapseQubitPairFromCnot(topQubit, bottomQubit) {
    const outcomeKey = samplePairOutcomeFromProbabilities(
      cnotOutcomeProbabilitiesForQubitPair(topQubit, bottomQubit)
    );
    const topBlue = outcomeKey[0] === "b";
    const bottomBlue = outcomeKey[1] === "b";
    topQubit.blue = topBlue ? 1 : 0;
    topQubit.red = topBlue ? 0 : 1;
    bottomQubit.blue = bottomBlue ? 1 : 0;
    bottomQubit.red = bottomBlue ? 0 : 1;
    topQubit.cnotPairToken = null;
    bottomQubit.cnotPairToken = null;
    topQubit.cnotOutcomeProbabilities = null;
    bottomQubit.cnotOutcomeProbabilities = null;
    delete topQubit.element.dataset.phaseSign;
    delete bottomQubit.element.dataset.phaseSign;
    updateQubitColor(topQubit);
    updateQubitColor(bottomQubit);
    return {
      outcomeKey,
      topResult: topBlue ? "b" : "r",
      bottomResult: bottomBlue ? "b" : "r",
    };
  }

  function updateTubeFills() {
    Object.entries(tubeCountState).forEach(([key, count]) => {
      tubeCountsByKey[key].textContent = String(count);
      const percent = Math.min((count / tubeQubitCapacity) * 100, 100);
      tubeLiquidsByKey[key].style.height = `${percent}%`;
    });
  }

  function updatePairCapacityText() {
    if (!pairCapacity) {
      return;
    }
    pairCapacity.textContent = `The testtubes can each hold ${tubeQubitCapacity} qubit pairs.`;
  }

  function maybeExpandTubeCapacity() {
    let maxCount = 0;
    Object.values(tubeCountState).forEach((count) => {
      if (count > maxCount) {
        maxCount = count;
      }
    });
    let expanded = false;
    while (maxCount > tubeQubitCapacity) {
      tubeQubitCapacity *= 2;
      expanded = true;
    }
    if (expanded) {
      updatePairCapacityText();
    }
  }

  function clearMeasurementApparatus() {
    tubeQubitCapacity = INITIAL_TUBE_QUBIT_CAPACITY;
    Object.keys(tubeCountState).forEach((key) => {
      tubeCountState[key] = 0;
    });
    updatePairCapacityText();
    updateTubeFills();
  }

  function placeQubitAtStart(qubit) {
    clearGateIngestAnimation(qubit);
    qubit.gateTransitInProgress = false;
    clearLensSlotForQubit(qubit);
    const gateWindow = gates[qubit.gateIndex].window;
    const center = stagePointForElementCenter(gateWindow);
    const rect = qubit.element.getBoundingClientRect();
    const x = rect.width / 2 + QUBIT_START_EDGE_GAP + TWO_QUBIT_START_SHIFT_PX - 20;
    setQubitCenter(qubit, x, center.y);
    qubit.docked = false;
    qubit.dragging = false;
    qubit.inCnotWindow = false;
    qubit.cnotPairToken = null;
    qubit.cnotOutcomeProbabilities = null;
    qubit.element.classList.remove("dragging");
    qubit.element.classList.remove("migrating");
    qubit.element.classList.remove("melting");
    qubit.element.classList.remove("docked");
    qubit.element.classList.remove("measurement-pellet");
    delete qubit.element.dataset.pairEjected;
    qubit.blue = 1;
    qubit.red = 0;
    setPairCnotPlatformExtended(false);
    updateQubitColor(qubit);
    delete qubit.element.dataset.phaseSign;
  }

  function moveQubitToPoint(qubit, x, y, duration = AUTO_TRAVEL_MS) {
    return new Promise((resolve) => {
      qubit.element.style.setProperty("--move-duration", `${duration}ms`);
      qubit.element.classList.add("migrating");
      setQubitCenter(qubit, x, y);
      window.setTimeout(resolve, duration);
    });
  }

  function createPairMeasurementPayload(color, startPoint) {
    const payload = document.createElement("span");
    payload.className = "qubit measurement-pellet";
    payload.setAttribute("aria-hidden", "true");
    payload.style.left = `${startPoint.x}px`;
    payload.style.top = `${startPoint.y}px`;
    payload.style.pointerEvents = "none";
    payload.style.setProperty("--qubit-fill", color === "b" ? blendBlueRed(1, 0) : blendBlueRed(0, 1));
    pairShell.appendChild(payload);
    return payload;
  }

  function movePairPayloadToPoint(payload, x, y, duration = AUTO_TRAVEL_MS) {
    return new Promise((resolve) => {
      payload.style.setProperty("--move-duration", `${duration}ms`);
      payload.classList.add("migrating");
      payload.style.left = `${x}px`;
      payload.style.top = `${y}px`;
      window.setTimeout(resolve, duration);
    });
  }

  async function animatePairMeasurementPayloadsToTube(
    outcomeKey,
    topColor,
    bottomColor,
    topStartPoint,
    bottomStartPoint,
    expectedRunToken = runToken,
    { migrationDuration = AUTO_TRAVEL_MS, meltDuration = AUTO_MELT_MS } = {}
  ) {
    const topPayload = createPairMeasurementPayload(topColor, topStartPoint);
    const bottomPayload = createPairMeasurementPayload(bottomColor, bottomStartPoint);

    try {
      const shellRect = pairShell.getBoundingClientRect();
      const targetTube = tubeElementsByKey[outcomeKey];
      const targetRect = targetTube.getBoundingClientRect();
      const targetPoint = {
        x: targetRect.left - shellRect.left + targetRect.width / 2,
        y: targetRect.top - shellRect.top + targetRect.height * 0.22,
      };
      const payloadHeight = topPayload.getBoundingClientRect().height;
      const targetOffset = payloadHeight * 0.8;

      await Promise.all([
        movePairPayloadToPoint(topPayload, targetPoint.x, targetPoint.y - targetOffset, migrationDuration),
        movePairPayloadToPoint(bottomPayload, targetPoint.x, targetPoint.y + targetOffset, migrationDuration),
      ]);
      if (expectedRunToken !== runToken) {
        return false;
      }

      topPayload.style.setProperty("--melt-duration", `${meltDuration}ms`);
      bottomPayload.style.setProperty("--melt-duration", `${meltDuration}ms`);
      topPayload.classList.add("melting");
      bottomPayload.classList.add("melting");
      await wait(meltDuration);
      if (expectedRunToken !== runToken) {
        return false;
      }

      tubeCountState[outcomeKey] += 1;
      maybeExpandTubeCapacity();
      updateTubeFills();
      return true;
    } finally {
      topPayload.remove();
      bottomPayload.remove();
    }
  }

  function settleQubitVisualState(qubit) {
    qubit.element.classList.remove("migrating");
    qubit.element.classList.remove("melting");
    qubit.element.classList.remove("collapse-animating");
    qubit.element.classList.remove("measurement-pellet");
    qubit.element.style.opacity = "";
    qubit.element.style.removeProperty("--move-duration");
    qubit.element.style.removeProperty("--melt-duration");
  }

  function wait(duration) {
    return new Promise((resolve) => window.setTimeout(resolve, duration));
  }

  function setPairMeasurementPlatformExtended(extended) {
    pairLens.classList.toggle("platform-extended", extended);
  }

  function pairMeasurementSpringTipX() {
    const lensRect = pairLens.getBoundingClientRect();
    const shellRect = pairShell.getBoundingClientRect();
    const springStyles = window.getComputedStyle(pairMeasurementPlatform);
    const springLength = Number.parseFloat(springStyles.getPropertyValue("--spring-length"));
    const usableSpringLength = Number.isFinite(springLength)
      ? springLength
      : pairMeasurementPlatform.getBoundingClientRect().width;
    const springOriginX = lensRect.right - shellRect.left - 4;
    return springOriginX + usableSpringLength;
  }

  function setPairCnotPlatformExtended(extended) {
    pairCnotBody.classList.toggle("platform-extended", extended);
  }

  function pairCnotSpringTipX() {
    const bodyRect = pairCnotBody.getBoundingClientRect();
    const shellRect = pairShell.getBoundingClientRect();
    const springStyles = window.getComputedStyle(pairCnotSpring);
    const springLength = Number.parseFloat(springStyles.getPropertyValue("--spring-length"));
    const usableSpringLength = Number.isFinite(springLength)
      ? springLength
      : pairCnotSpring.getBoundingClientRect().width;
    const springOriginX = bodyRect.right - shellRect.left - 4;
    return springOriginX + usableSpringLength;
  }

  function nextFrame() {
    return new Promise((resolve) => window.requestAnimationFrame(() => resolve()));
  }

  function pairTubeOutcomeKey(leftResult, rightResult) {
    if (leftResult === "b" && rightResult === "b") {
      return "bb";
    }
    if (leftResult === "b" && rightResult === "r") {
      return "br";
    }
    if (leftResult === "r" && rightResult === "b") {
      return "rb";
    }
    return "rr";
  }

  function setLightningActive(active) {
    boltA.classList.toggle("active", active);
    boltB.classList.toggle("active", active);
  }

  function positionLightning() {
    const lensCenter = stagePointForElementCenter(pairLens);
    const qa = stagePointForElementCenter(qubits[0].element);
    const qb = stagePointForElementCenter(qubits[1].element);

    const layoutBolt = (bolt, start, end) => {
      const dx = end.x - start.x;
      const dy = end.y - start.y;
      const length = Math.hypot(dx, dy);
      const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
      bolt.style.left = `${start.x}px`;
      bolt.style.top = `${start.y}px`;
      bolt.style.width = `${length}px`;
      bolt.style.transform = `translateY(-50%) rotate(${angle}deg)`;
    };

    layoutBolt(boltA, qa, lensCenter);
    layoutBolt(boltB, qb, lensCenter);
  }

  function alignPairMeasurementBlockToGateMidpoint() {
    if (isPairMeasurementManualAlignment(pairShell)) {
      pairMeasurementBlock.style.transform = "";
      pairShell.style.paddingBottom = `${
        basePairShellPaddingBottom + TWO_QUBIT_INNER_BOX_EXTRA_BOTTOM_PX
      }px`;
      return;
    }

    const flexDirection = window.getComputedStyle(pairShell).flexDirection;
    if (flexDirection === "column") {
      pairMeasurementBlock.style.transform = "";
      pairShell.style.paddingBottom = `${
        basePairShellPaddingBottom + TWO_QUBIT_INNER_BOX_EXTRA_BOTTOM_PX
      }px`;
      return;
    }

    const topGateCenter = stagePointForElementCenter(gates[0].window);
    const bottomGateCenter = stagePointForElementCenter(gates[1].window);
    const targetY = (topGateCenter.y + bottomGateCenter.y) / 2;
    const measurementCenterY =
      stagePointForElementCenter(pairLens).y + TWO_QUBIT_WIDE_LENS_VISUAL_CENTER_OFFSET_Y;
    const deltaY = targetY - measurementCenterY;
    pairMeasurementBlock.style.transform = `translateY(${deltaY}px)`;
    const extraBottom = Math.max(0, deltaY);
    pairShell.style.paddingBottom = `${
      basePairShellPaddingBottom + TWO_QUBIT_INNER_BOX_EXTRA_BOTTOM_PX + extraBottom
    }px`;
  }

  function alignPairCnotCenterBetweenGates() {
    pairCnotHost.style.transform = "";
    const flexDirection = window.getComputedStyle(pairShell).flexDirection;
    if (flexDirection === "column") {
      return;
    }
    const topGateCenter = stagePointForElementCenter(gates[0].window);
    const bottomGateCenter = stagePointForElementCenter(gates[1].window);
    const targetY = (topGateCenter.y + bottomGateCenter.y) / 2;
    const cnotCenterY = stagePointForElementCenter(pairCnotBody).y;
    const deltaY = targetY - cnotCenterY;
    pairCnotHost.style.transform = `translateY(${deltaY}px)`;
  }

  function syncPairLensWidthToTubeRack() {
    if (pairLens.dataset.layoutManual === "true" || pairTubeRack.dataset.layoutManual === "true") {
      return;
    }
    pairTubeRack.style.width = "max-content";
    const rackRect = pairTubeRack.getBoundingClientRect();
    if (!rackRect.width) {
      return;
    }
    const sharedWidth = Math.round(rackRect.width + 50);
    pairLens.style.width = `${sharedWidth}px`;
    pairLens.style.marginLeft = "35px";
    pairTubeRack.style.width = `${sharedWidth}px`;
    pairTubeRack.style.marginLeft = "35px";
  }

  function setGateArrowAtTick(
    gateIndex,
    tickIndex,
    { deferMeasurementClear = false, fromDial = false } = {}
  ) {
    if (autoRunInProgress && !fromDial) {
      return;
    }
    const gate = gates[gateIndex];
    const normalizedTick = normalizeTickIndex(tickIndex);
    const changed = normalizedTick !== gate.activeTick;
    gate.activeTick = normalizedTick;

    if (!fromDial && gateDials[gateIndex]) {
      gateDials[gateIndex].setTick(normalizedTick, {
        deferMeasurementClear,
        reason: "programmatic",
      });
      return;
    }

    if (changed && !deferMeasurementClear) {
      clearMeasurementApparatus();
    }

    const qubit = qubits[gateIndex];
    if (qubit.docked) {
      applyGateStateToQubit(qubit, gate.activeTick);
    }
  }

  gates.forEach((gate, gateIndex) => {
    const gateLabel = gateIndex === 0 ? "Top Gate Tick" : "Bottom Gate Tick";
    const dial = createSingleQubitGateDial({
      ticksWrap: gate.ticksWrap,
      arrow: gate.arrow,
      initialTick: gate.activeTick,
      tickAriaLabelPrefix: gateLabel,
      orbitInset: 10,
      canInteract: () => !autoRunInProgress,
      onTickChange: (tick, meta) => {
        setGateArrowAtTick(gateIndex, tick, {
          deferMeasurementClear: meta.deferMeasurementClear,
          fromDial: true,
        });
      },
      onTickCommitted: ({ changed }) => {
        if (changed) {
          clearMeasurementApparatus();
        }
      },
    });
    gateDials.push(dial);
  });

  async function startPairMeasurementSequence(
    expectedRunToken = runToken,
    { migrationDuration = AUTO_TRAVEL_MS, meltDuration = AUTO_MELT_MS } = {}
  ) {
    if (measurementInProgress) {
      return;
    }
    if (expectedRunToken !== runToken) {
      return;
    }
    if (!slotOccupants.left || !slotOccupants.right) {
      return;
    }

    measurementInProgress = true;
    qubits.forEach((qubit) => {
      qubit.dragging = false;
      qubit.element.classList.remove("dragging");
    });
    setPairMeasurementPlatformExtended(false);

    try {
      const topQubit = slotOccupants.left;
      const bottomQubit = slotOccupants.right;
      topQubit.element.classList.add("collapse-animating");
      bottomQubit.element.classList.add("collapse-animating");
      const collapseResult = collapseQubitPairFromCnot(topQubit, bottomQubit);
      const topResult = collapseResult.topResult;
      const bottomResult = collapseResult.bottomResult;
      await wait(OBSERVABLE_COLLAPSE_PAUSE_MS);
      topQubit.element.classList.remove("collapse-animating");
      bottomQubit.element.classList.remove("collapse-animating");
      if (expectedRunToken !== runToken) {
        return;
      }

      const shellRect = pairShell.getBoundingClientRect();
      const qubitWidth = topQubit.element.getBoundingClientRect().width;
      const springTipX = pairMeasurementSpringTipX();
      const ejectionCenterX = springTipX + 6 + qubitWidth / 2;
      const topSlotCenter = getLensSlotCenter("left");
      const bottomSlotCenter = getLensSlotCenter("right");
      const topBaseEjectedPoint = { x: ejectionCenterX, y: topSlotCenter.y };
      const bottomBaseEjectedPoint = { x: ejectionCenterX, y: bottomSlotCenter.y };
      const topEjectionOffset = pairEjectionOffset("left");
      const bottomEjectionOffset = pairEjectionOffset("right");
      const topOffsetPoint = {
        x: topBaseEjectedPoint.x + topEjectionOffset.x,
        y: topBaseEjectedPoint.y + topEjectionOffset.y,
      };
      const bottomOffsetPoint = {
        x: bottomBaseEjectedPoint.x + bottomEjectionOffset.x,
        y: bottomBaseEjectedPoint.y + bottomEjectionOffset.y,
      };
      const topEjectedPoint = pairEjectionAbsolute("left") || topOffsetPoint;
      const bottomEjectedPoint = pairEjectionAbsolute("right") || bottomOffsetPoint;

      setPairMeasurementPlatformExtended(true);
      await Promise.all([
        moveQubitToPoint(topQubit, topEjectedPoint.x, topEjectedPoint.y, GATE_PLATFORM_EXTEND_MS),
        moveQubitToPoint(bottomQubit, bottomEjectedPoint.x, bottomEjectedPoint.y, GATE_PLATFORM_EXTEND_MS),
      ]);
      setPairMeasurementPlatformExtended(false);
      if (expectedRunToken !== runToken) {
        return;
      }

      settleQubitVisualState(topQubit);
      settleQubitVisualState(bottomQubit);
      setQubitCenter(topQubit, topEjectedPoint.x, topEjectedPoint.y);
      setQubitCenter(bottomQubit, bottomEjectedPoint.x, bottomEjectedPoint.y);
      topQubit.docked = false;
      bottomQubit.docked = false;
      topQubit.element.classList.remove("docked");
      bottomQubit.element.classList.remove("docked");
      clearLensSlotForQubit(topQubit);
      clearLensSlotForQubit(bottomQubit);
      topQubit.element.dataset.pairEjected = "left";
      bottomQubit.element.dataset.pairEjected = "right";

      const outcomeKey = pairTubeOutcomeKey(topResult, bottomResult);
      const payloadsCompleted = await animatePairMeasurementPayloadsToTube(
        outcomeKey,
        topResult,
        bottomResult,
        topEjectedPoint,
        bottomEjectedPoint,
        expectedRunToken,
        { migrationDuration, meltDuration }
      );
      if (!payloadsCompleted || expectedRunToken !== runToken) {
        return;
      }
    } finally {
      setPairMeasurementPlatformExtended(false);
      qubits.forEach((qubit) => {
        qubit.element.classList.remove("collapse-animating");
        qubit.element.classList.remove("measurement-pellet");
      });
      measurementInProgress = false;
    }
  }

  async function runAutomatedPairSingleGateStage(expectedRunToken, { travelDuration, dwellDuration }) {
    try {
      const gateCenters = gates.map((gate) => stagePointForElementCenter(gate.window));
      await Promise.all([
        moveQubitToPoint(qubits[0], gateCenters[0].x, gateCenters[0].y, travelDuration),
        moveQubitToPoint(qubits[1], gateCenters[1].x, gateCenters[1].y, travelDuration),
      ]);
      if (expectedRunToken !== runToken) {
        return false;
      }

      qubits.forEach((qubit, idx) => {
        qubit.docked = true;
        qubit.element.classList.add("docked");
      });
      await wait(dwellDuration);
      if (expectedRunToken !== runToken) {
        return false;
      }

      qubits.forEach((qubit, idx) => {
        applyGateStateToQubit(qubit, gates[idx].activeTick);
      });
      gates.forEach((gate) => gate.wrap.classList.add("platform-extended"));
      const shellRect = pairShell.getBoundingClientRect();
      const targets = qubits.map((qubit, idx) => {
        const pipeRect = gates[idx].window.getBoundingClientRect();
        const qubitRect = qubit.element.getBoundingClientRect();
        return {
          qubit,
          x: pipeRect.right - shellRect.left + 100 + qubitRect.width / 2,
          y: gateCenters[idx].y,
        };
      });

      await Promise.all(
        targets.map((target) => moveQubitToPoint(target.qubit, target.x, target.y, GATE_PLATFORM_EXTEND_MS))
      );
      if (expectedRunToken !== runToken) {
        return false;
      }

      targets.forEach((target) => {
        target.qubit.docked = false;
        target.qubit.element.classList.remove("docked");
        settleQubitVisualState(target.qubit);
        setQubitCenter(target.qubit, target.x, target.y);
      });
      gates.forEach((gate) => gate.wrap.classList.remove("platform-extended"));
      await wait(GATE_PLATFORM_RETRACT_MS);
      return expectedRunToken === runToken;
    } finally {
      gates.forEach((gate) => gate.wrap.classList.remove("platform-extended"));
    }
  }

  async function runAutomatedPairCnotStage(expectedRunToken, { travelDuration, dwellDuration }) {
    if (cnotBusy) {
      return false;
    }
    cnotBusy = true;
    try {
      const cnotCenters = qubits.map((qubit) => stagePointForElementCenter(qubit.cnotWindow));
      await Promise.all([
        moveQubitToPoint(qubits[0], cnotCenters[0].x, cnotCenters[0].y, travelDuration),
        moveQubitToPoint(qubits[1], cnotCenters[1].x, cnotCenters[1].y, travelDuration),
      ]);
      if (expectedRunToken !== runToken) {
        return false;
      }

      qubits.forEach((qubit) => {
        qubit.inCnotWindow = true;
      });
      await wait(dwellDuration);
      if (expectedRunToken !== runToken) {
        return false;
      }

      annotateCnotOutcomeProbabilitiesForCurrentState();
      applyCnotGateToQubits();
      setPairCnotPlatformExtended(true);
      const springTipXValue = pairCnotSpringTipX();
      const targets = qubits.map((qubit) => {
        const slotCenter = stagePointForElementCenter(qubit.cnotWindow);
        const qubitRect = qubit.element.getBoundingClientRect();
        return {
          qubit,
          x: springTipXValue + 6 + qubitRect.width / 2,
          y: slotCenter.y,
        };
      });

      await Promise.all(
        targets.map((target) => moveQubitToPoint(target.qubit, target.x, target.y, GATE_PLATFORM_EXTEND_MS))
      );
      if (expectedRunToken !== runToken) {
        return false;
      }

      targets.forEach((target) => {
        target.qubit.inCnotWindow = false;
        settleQubitVisualState(target.qubit);
        setQubitCenter(target.qubit, target.x, target.y);
      });
      setPairCnotPlatformExtended(false);
      await wait(GATE_PLATFORM_RETRACT_MS);
      return expectedRunToken === runToken;
    } finally {
      setPairCnotPlatformExtended(false);
      cnotBusy = false;
    }
  }

  async function runAutomatedPairMeasurements(iterations) {
    if (autoRunInProgress || measurementInProgress || cnotBusy) {
      return;
    }

    const useMachineMode = iterations >= 100;
    const speedFactor = iterations >= 10 ? 2 : 1;
    const travelDuration = Math.round(AUTO_TRAVEL_MS / speedFactor);
    const gatePauseDuration = Math.round(AUTO_GATE_PAUSE_MS / speedFactor);
    const meltDuration = Math.round(AUTO_MELT_MS / speedFactor);
    const machineDuration =
      iterations === 100
        ? MACHINE_DURATION_100_MS
        : iterations === 1000
          ? MACHINE_DURATION_1000_MS
          : null;

    const thisRunToken = runToken + 1;
    runToken = thisRunToken;
    autoRunInProgress = true;
    pairMeasurementCount.disabled = true;
    qubits.forEach((qubit) => {
      qubit.dragging = false;
      qubit.element.classList.remove("dragging");
      clearLensSlotForQubit(qubit);
    });

    try {
      if (useMachineMode) {
        qubits.forEach((qubit) => placeQubitAtStart(qubit));
        positionLightning();
        setLightningActive(true);

        const processOne = () => {
          qubits.forEach((qubit) => {
            qubit.blue = 1;
            qubit.red = 0;
            qubit.cnotPairToken = null;
            qubit.cnotOutcomeProbabilities = null;
            delete qubit.element.dataset.phaseSign;
            updateQubitColor(qubit);
          });
          qubits.forEach((qubit, idx) => {
            applyGateStateToQubit(qubit, gates[idx].activeTick);
          });
          annotateCnotOutcomeProbabilitiesForCurrentState();
          applyCnotGateToQubits();
          const { outcomeKey } = collapseQubitPairFromCnot(qubits[0], qubits[1]);
          tubeCountState[outcomeKey] += 1;
          maybeExpandTubeCapacity();
        };

        let processed = 0;
        if (machineDuration !== null) {
          const runStart = performance.now();
          while (processed < iterations) {
            if (thisRunToken !== runToken) {
              break;
            }
            const elapsed = performance.now() - runStart;
            const progress = Math.min(elapsed / machineDuration, 1);
            const shouldBeProcessed = Math.floor(progress * iterations);
            if (shouldBeProcessed <= processed) {
              await nextFrame();
              continue;
            }
            while (processed < shouldBeProcessed && processed < iterations) {
              processOne();
              processed += 1;
            }
            updateTubeFills();
            await nextFrame();
          }
        } else {
          await nextFrame();
          while (processed < iterations && thisRunToken === runToken) {
            processOne();
            processed += 1;
          }
        }
        updateTubeFills();
        qubits.forEach((qubit) => placeQubitAtStart(qubit));
        return;
      }

      for (let i = 0; i < iterations; i += 1) {
        if (thisRunToken !== runToken) {
          break;
        }

        qubits.forEach((qubit) => placeQubitAtStart(qubit));
        const gatesCompleted = await runAutomatedPairSingleGateStage(thisRunToken, {
          travelDuration,
          dwellDuration: gatePauseDuration,
        });
        if (!gatesCompleted || thisRunToken !== runToken) {
          break;
        }

        const cnotCompleted = await runAutomatedPairCnotStage(thisRunToken, {
          travelDuration,
          dwellDuration: CNOT_WINDOW_DWELL_MS,
        });
        if (!cnotCompleted || thisRunToken !== runToken) {
          break;
        }

        const leftSlot = getLensSlotCenter("left");
        const rightSlot = getLensSlotCenter("right");
        await Promise.all([
          moveQubitToPoint(qubits[0], leftSlot.x, leftSlot.y, travelDuration),
          moveQubitToPoint(qubits[1], rightSlot.x, rightSlot.y, travelDuration),
        ]);
        if (thisRunToken !== runToken) {
          break;
        }

        slotOccupants.left = qubits[0];
        slotOccupants.right = qubits[1];
        qubits[0].lensSlot = "left";
        qubits[1].lensSlot = "right";
        qubits[0].element.dataset.lensSlot = "left";
        qubits[1].element.dataset.lensSlot = "right";
        qubits[0].docked = false;
        qubits[1].docked = false;
        qubits[0].element.classList.remove("docked");
        qubits[1].element.classList.remove("docked");

        await startPairMeasurementSequence(thisRunToken, {
          migrationDuration: travelDuration,
          meltDuration,
        });
      }
    } finally {
      setLightningActive(false);
      autoRunInProgress = false;
      pairMeasurementCount.disabled = false;
    }
  }

  function maybeTriggerManualPairMeasurement() {
    if (slotOccupants.left && slotOccupants.right && !measurementInProgress && !autoRunInProgress) {
      const token = runToken + 1;
      runToken = token;
      startPairMeasurementSequence(token);
    }
  }

  function beginQubitDrag(qubit, event) {
    if (handleShiftQubitSelection(event, qubit.element)) {
      return;
    }
    if (measurementInProgress || autoRunInProgress || qubit.gateTransitInProgress) {
      return;
    }
    if (!isPrimaryMouseButton(event)) {
      return;
    }
    clearGateIngestAnimation(qubit);
    event.preventDefault();
    event.stopPropagation();
    const point = getPointer(event);
    const qubitRect = qubit.element.getBoundingClientRect();
    qubit.dragging = true;
    qubit.element.classList.add("dragging");
    qubit.docked = false;
    qubit.element.classList.remove("docked");
    delete qubit.element.dataset.pairEjected;
    clearLensSlotForQubit(qubit);
    qubit.dragOffsetX = point.clientX - (qubitRect.left + qubitRect.width / 2);
    qubit.dragOffsetY = point.clientY - (qubitRect.top + qubitRect.height / 2);
  }

  function continueQubitDrag(event) {
    const draggingQubits = qubits.filter((qubit) => qubit.dragging);
    if (!draggingQubits.length || measurementInProgress || autoRunInProgress) {
      return;
    }
    if (event.touches) {
      event.preventDefault();
    }
    const point = getPointer(event);
    const shellRect = pairShell.getBoundingClientRect();
    draggingQubits.forEach((qubit) => {
      const nextX = point.clientX - shellRect.left - qubit.dragOffsetX;
      const nextY = point.clientY - shellRect.top - qubit.dragOffsetY;
      setQubitCenter(qubit, nextX, nextY);
      if (maybeSnapQubitToMeasurementFunnel(qubit)) {
        return;
      }
      const snappedLens = maybeSnapQubitToLens(qubit);
      if (!snappedLens) {
        if (!maybeSnapQubitToGate(qubit)) {
          preventManualPipeOverlapForPairQubit(qubit);
        }
      }
    });
  }

  function endQubitDrag() {
    if (measurementInProgress || autoRunInProgress) {
      return;
    }
    let measurementIngressTriggered = false;
    qubits.forEach((qubit) => {
      if (!qubit.dragging) {
        return;
      }
      qubit.dragging = false;
      qubit.element.classList.remove("dragging");
      if (maybeSnapQubitToMeasurementFunnel(qubit)) {
        measurementIngressTriggered = true;
        return;
      }
      if (!maybeSnapQubitToLens(qubit)) {
        if (!maybeSnapQubitToGate(qubit)) {
          preventManualPipeOverlapForPairQubit(qubit);
        }
      }
    });
    if (!measurementIngressTriggered) {
      maybeTriggerManualPairMeasurement();
    }
  }

  function beginArrowDrag(gateIndex, event) {
    gateDials[gateIndex]?.beginDrag(event);
  }

  function continueArrowDrag(event) {
    gateDials.forEach((dial) => {
      dial?.continueDrag(event);
    });
  }

  function endArrowDrag() {
    gateDials.forEach((dial) => {
      dial?.endDrag();
    });
  }

  function handleResize() {
    const shellRect = pairShell.getBoundingClientRect();
    if (!shellRect.width || !shellRect.height) {
      return;
    }

    gateDials.forEach((dial) => {
      dial?.layout();
    });
    syncPairLensWidthToTubeRack();

    alignPairCnotCenterBetweenGates();
    alignPairMeasurementBlockToGateMidpoint();
    positionLightning();

    if (!initialized) {
      qubits.forEach((qubit) => placeQubitAtStart(qubit));
      initialized = true;
      return;
    }

    qubits.forEach((qubit) => {
      if (qubit.docked) {
        maybeSnapQubitToGate(qubit, { allowWindowOverlap: true, runTransit: false });
        return;
      }
      if (qubit.inCnotWindow) {
        const center = stagePointForElementCenter(qubit.cnotWindow);
        setQubitCenter(qubit, center.x, center.y);
        return;
      }
      if (qubit.lensSlot) {
        const center = getLensSlotCenter(qubit.lensSlot);
        setQubitCenter(qubit, center.x, center.y);
        return;
      }
      const center = stagePointForElementCenter(qubit.element);
      setQubitCenter(qubit, center.x, center.y);
    });
  }

  function resetPairSimulator() {
    runToken += 1;
    autoRunInProgress = false;
    measurementInProgress = false;
    cnotBusy = false;
    pairMeasurementCount.disabled = false;
    pairMeasurementCount.value = "1";
    setLightningActive(false);
    setPairMeasurementPlatformExtended(false);
    setPairCnotPlatformExtended(false);

    gates.forEach((gate) => {
      gate.arrow.classList.remove("dragging");
      gate.wrap.classList.remove("platform-extended");
    });

    qubits.forEach((qubit) => {
      qubit.gateTransitInProgress = false;
      placeQubitAtStart(qubit);
    });

    setGateArrowAtTick(0, DEFAULT_SINGLE_GATE_TICK_INDEX);
    setGateArrowAtTick(1, DEFAULT_SINGLE_GATE_TICK_INDEX);
    clearMeasurementApparatus();
  }

  qubitA.addEventListener("mousedown", (event) => beginQubitDrag(qubits[0], event));
  qubitA.addEventListener("touchstart", (event) => beginQubitDrag(qubits[0], event), { passive: false });
  qubitB.addEventListener("mousedown", (event) => beginQubitDrag(qubits[1], event));
  qubitB.addEventListener("touchstart", (event) => beginQubitDrag(qubits[1], event), { passive: false });

  pairArrowA.addEventListener("mousedown", (event) => beginArrowDrag(0, event));
  pairArrowA.addEventListener("touchstart", (event) => beginArrowDrag(0, event), { passive: false });
  pairArrowB.addEventListener("mousedown", (event) => beginArrowDrag(1, event));
  pairArrowB.addEventListener("touchstart", (event) => beginArrowDrag(1, event), { passive: false });

  window.addEventListener("mousemove", (event) => {
    continueArrowDrag(event);
    continueQubitDrag(event);
  });
  window.addEventListener(
    "touchmove",
    (event) => {
      continueArrowDrag(event);
      continueQubitDrag(event);
    },
    { passive: false }
  );
  window.addEventListener("mouseup", () => {
    endArrowDrag();
    endQubitDrag();
  });
  window.addEventListener("touchend", () => {
    endArrowDrag();
    endQubitDrag();
  });
  window.addEventListener("touchcancel", () => {
    endArrowDrag();
    endQubitDrag();
  });

  [pairArrowA, pairArrowB].forEach((arrow, gateIndex) => {
    arrow.addEventListener("keydown", (event) => gateDials[gateIndex]?.handleKeydown(event));
  });

  pairMeasurementCount.addEventListener("mousedown", (event) => event.stopPropagation());
  pairMeasurementCount.addEventListener("touchstart", (event) => event.stopPropagation());
  pairMeasurementCount.addEventListener("click", (event) => event.stopPropagation());
  pairMeasurementCount.addEventListener("change", () => {
    clearMeasurementApparatus();
    const iterations = Number(pairMeasurementCount.value) || 1;
    if (iterations === 1 && slotOccupants.left && slotOccupants.right && !measurementInProgress) {
      const token = runToken + 1;
      runToken = token;
      startPairMeasurementSequence(token);
      return;
    }
    runAutomatedPairMeasurements(Math.max(1, iterations));
  });

  pairLens.addEventListener("click", () => {
    const iterations = Number(pairMeasurementCount.value) || 1;
    if (iterations === 1 && slotOccupants.left && slotOccupants.right && !measurementInProgress) {
      const token = runToken + 1;
      runToken = token;
      startPairMeasurementSequence(token);
      return;
    }
    runAutomatedPairMeasurements(Math.max(1, iterations));
  });

  if (pairResetButton) {
    pairResetButton.addEventListener("click", () => {
      resetPairSimulator();
    });
  }

  setGateArrowAtTick(0, DEFAULT_SINGLE_GATE_TICK_INDEX);
  setGateArrowAtTick(1, DEFAULT_SINGLE_GATE_TICK_INDEX);
  clearMeasurementApparatus();

  return {
    handleResize,
  };
}

function setupEntanglementGate(root) {
  mountEntanglementCnotGate(root);
  const entResetButton = root.querySelector('[data-role="ent-reset"]');
  const measurementHost = root.querySelector('[data-role="ent-measurement-host"]');
  mountPairMeasurementTool(measurementHost);
  const shell = root.querySelector('[data-role="ent-shell"]');
  const entGate = root.querySelector('[data-role="ent-gate"]');
  const preGateStack = root.querySelector(".ent-pre-gates");
  const pipe = root.querySelector('[data-role="ent-pipe"]');
  const qubitTop = root.querySelector('[data-role="ent-qubit-top"]');
  const qubitBottom = root.querySelector('[data-role="ent-qubit-bottom"]');
  const preFunnelTop = root.querySelector('[data-role="ent-pre-funnel-top"]');
  const preFunnelBottom = root.querySelector('[data-role="ent-pre-funnel-bottom"]');
  const prePipeTop = root.querySelector('[data-role="ent-pre-pipe-top"]');
  const prePipeBottom = root.querySelector('[data-role="ent-pre-pipe-bottom"]');
  const preTicksTop = root.querySelector('[data-role="ent-pre-ticks-top"]');
  const preTicksBottom = root.querySelector('[data-role="ent-pre-ticks-bottom"]');
  const preArrowTop = root.querySelector('[data-role="ent-pre-arrow-top"]');
  const preArrowBottom = root.querySelector('[data-role="ent-pre-arrow-bottom"]');
  const preFlangeTop = root.querySelector('[data-role="ent-pre-flange-top"]');
  const preFlangeBottom = root.querySelector('[data-role="ent-pre-flange-bottom"]');
  const preSpringTop = root.querySelector('[data-role="ent-pre-spring-top"]');
  const preSpringBottom = root.querySelector('[data-role="ent-pre-spring-bottom"]');
  const funnelTop = root.querySelector('[data-role="ent-funnel-top"]');
  const funnelBottom = root.querySelector('[data-role="ent-funnel-bottom"]');
  const windowTop = root.querySelector('[data-role="ent-window-top"]');
  const windowBottom = root.querySelector('[data-role="ent-window-bottom"]');
  const cnotPlatform = root.querySelector('[data-role="ent-platform"]');
  const measurementBlock = measurementHost;
  const measurementTool = measurementBlock ? measurementBlock.querySelector('[data-role="pair-lens"]') : null;
  const measurementFunnel = measurementBlock
    ? measurementBlock.querySelector('[data-role="pair-measurement-funnel"]')
    : null;
  const measurementSlotTop = measurementBlock ? measurementBlock.querySelector('[data-role="pair-slot-left"]') : null;
  const measurementSlotBottom = measurementBlock ? measurementBlock.querySelector('[data-role="pair-slot-right"]') : null;
  const measurementPlatform = measurementTool ? measurementTool.querySelector(".pair-measurement-platform") : null;
  const measurementCapacity = measurementBlock ? measurementBlock.querySelector('[data-role="pair-capacity"]') : null;
  const measurementCount = measurementBlock
    ? measurementBlock.querySelector('[data-role="pair-measurement-count"]')
    : null;
  const measurementColumns = measurementBlock
    ? Array.from(measurementBlock.querySelectorAll(".pair-tube-column[data-key]"))
    : [];

  const measurementTubesByKey = {};
  const measurementLiquidsByKey = {};
  const measurementCountsByKey = {};
  measurementColumns.forEach((column) => {
    const key = column.dataset.key;
    if (!key) {
      return;
    }
    measurementTubesByKey[key] = column.querySelector(".pair-tube");
    measurementLiquidsByKey[key] = column.querySelector(".tube-liquid");
    measurementCountsByKey[key] = column.querySelector(".tube-count");
  });
  const measurementKeys = ["bb", "br", "rb", "rr"];
  const hasAllMeasurementParts = measurementKeys.every(
    (key) => measurementTubesByKey[key] && measurementLiquidsByKey[key] && measurementCountsByKey[key]
  );

  if (
    !entResetButton ||
    !measurementHost ||
    !shell ||
    !pipe ||
    !preGateStack ||
    !qubitTop ||
    !qubitBottom ||
    !preFunnelTop ||
    !preFunnelBottom ||
    !prePipeTop ||
    !prePipeBottom ||
    !preTicksTop ||
    !preTicksBottom ||
    !preArrowTop ||
    !preArrowBottom ||
    !preFlangeTop ||
    !preFlangeBottom ||
    !preSpringTop ||
    !preSpringBottom ||
    !funnelTop ||
    !funnelBottom ||
    !windowTop ||
    !windowBottom ||
    !cnotPlatform ||
    !measurementBlock ||
    !measurementTool ||
    !measurementFunnel ||
    !measurementSlotTop ||
    !measurementSlotBottom ||
    !measurementPlatform ||
    !measurementCapacity ||
    !measurementCount ||
    !hasAllMeasurementParts
  ) {
    return null;
  }

  // Entanglement layout should stay canonical: measurement lens under tubes and C-NOT body centered.
  [entGate, measurementHost].forEach((element) => {
    if (!(element instanceof HTMLElement)) {
      return;
    }
    setLayoutTargetTranslate(element, 0, 0);
    element.style.width = "";
    element.style.height = "";
    element.style.display = "";
  });

  registerSelectionContainer(shell);

  const qubits = [
    {
      key: "top",
      element: qubitTop,
      cnotWindow: windowTop,
      cnotFunnel: funnelTop,
      preGate: {
        funnel: preFunnelTop,
        pipe: prePipeTop,
        ticksWrap: preTicksTop,
        arrow: preArrowTop,
        flange: preFlangeTop,
        spring: preSpringTop,
        tickIndex: DEFAULT_SINGLE_GATE_TICK_INDEX,
      },
      dragging: false,
      dragOffsetX: 0,
      dragOffsetY: 0,
      inCnotWindow: false,
      cnotIngesting: false,
      preTransitInProgress: false,
      measurementTransitInProgress: false,
      measurementSlot: null,
      locked: false,
      blue: 1,
      red: 0,
      cnotPairToken: null,
      cnotOutcomeProbabilities: null,
    },
    {
      key: "bottom",
      element: qubitBottom,
      cnotWindow: windowBottom,
      cnotFunnel: funnelBottom,
      preGate: {
        funnel: preFunnelBottom,
        pipe: prePipeBottom,
        ticksWrap: preTicksBottom,
        arrow: preArrowBottom,
        flange: preFlangeBottom,
        spring: preSpringBottom,
        tickIndex: DEFAULT_SINGLE_GATE_TICK_INDEX,
      },
      dragging: false,
      dragOffsetX: 0,
      dragOffsetY: 0,
      inCnotWindow: false,
      cnotIngesting: false,
      preTransitInProgress: false,
      measurementTransitInProgress: false,
      measurementSlot: null,
      locked: false,
      blue: 1,
      red: 0,
      cnotPairToken: null,
      cnotOutcomeProbabilities: null,
    },
  ];
  qubits.forEach((qubit) => {
    const label =
      qubit.key === "top"
        ? "Entanglement Pre-Gate (Top)"
        : "Entanglement Pre-Gate (Bottom)";
    registerGateInspector(qubit.preGate.pipe, () => ({
      label,
      matrix: gateMatrixForTick(qubit.preGate.tickIndex),
      tickIndex: qubit.preGate.tickIndex,
    }));
  });
  registerGateInspector(pipe, () => ({
    label: "Entanglement CNOT Gate",
    matrix: [
      [1, 0, 0, 0],
      [0, 1, 0, 0],
      [0, 0, 0, 1],
      [0, 0, 1, 0],
    ],
  }));

  registerQubitInspector(qubits[0].element, () => ({
    label: "Entanglement Mode (Control / Top Qubit)",
    blue: qubits[0].blue,
    red: qubits[0].red,
  }));
  registerQubitInspector(qubits[1].element, () => ({
    label: "Entanglement Mode (Target / Bottom Qubit)",
    blue: qubits[1].blue,
    red: qubits[1].red,
  }));

  const measurementSlotOccupants = {
    left: null,
    right: null,
  };
  const tubeCountState = {
    bb: 0,
    br: 0,
    rb: 0,
    rr: 0,
  };

  let tubeQubitCapacity = INITIAL_TUBE_QUBIT_CAPACITY;
  let initialized = false;
  let cnotBusy = false;
  let measurementInProgress = false;
  let autoRunInProgress = false;
  let runToken = 0;
  const preGateDials = new Map();

  function stagePointForElementCenter(element) {
    const shellRect = shell.getBoundingClientRect();
    const rect = element.getBoundingClientRect();
    return {
      x: rect.left - shellRect.left + rect.width / 2,
      y: rect.top - shellRect.top + rect.height / 2,
    };
  }

  function setQubitCenter(qubit, x, y) {
    const shellRect = shell.getBoundingClientRect();
    const qubitRect = qubit.element.getBoundingClientRect();
    const radius = qubitRect.width / 2;
    const safeX = Number.isFinite(x) ? x : shellRect.width / 2;
    const safeY = Number.isFinite(y) ? y : shellRect.height / 2;
    const clampedX = Math.min(Math.max(safeX, radius), shellRect.width - radius);
    const clampedY = Math.min(Math.max(safeY, radius), shellRect.height - radius);
    qubit.element.style.left = `${clampedX}px`;
    qubit.element.style.top = `${clampedY}px`;
  }

  function updateQubitColor(qubit) {
    qubit.element.style.setProperty("--qubit-fill", blendBlueRed(qubit.blue, qubit.red));
  }

  function wait(duration) {
    return new Promise((resolve) => window.setTimeout(resolve, duration));
  }

  function settleQubitVisualState(qubit) {
    qubit.element.classList.remove("migrating");
    qubit.element.classList.remove("dragging");
    qubit.element.classList.remove("ent-hidden");
    qubit.element.classList.remove("ent-appearing");
    qubit.element.classList.remove("collapse-animating");
    qubit.element.classList.remove("melting");
    qubit.element.classList.remove("measurement-pellet");
    qubit.element.style.opacity = "";
    qubit.element.style.removeProperty("--move-duration");
    qubit.element.style.removeProperty("--melt-duration");
  }

  function clearMeasurementSlotForQubit(qubit) {
    if (qubit.measurementSlot && measurementSlotOccupants[qubit.measurementSlot] === qubit) {
      measurementSlotOccupants[qubit.measurementSlot] = null;
    }
    qubit.measurementSlot = null;
  }

  function getMeasurementSlotForQubit(qubit) {
    return qubit.key === "top" ? "right" : "left";
  }

  function getMeasurementSlotCenter(slot) {
    const slotElement = slot === "left" ? measurementSlotTop : measurementSlotBottom;
    const slotRect = slotElement.getBoundingClientRect();
    const hasVisibleSlotGeometry =
      slotRect.width > 4 &&
      slotRect.height > 4 &&
      window.getComputedStyle(slotElement).display !== "none";
    if (hasVisibleSlotGeometry) {
      const center = stagePointForElementCenter(slotElement);
      const offset = getPairLensSlotOffsetFromShell(shell, slot);
      return {
        x: center.x + offset.x,
        y: center.y + offset.y,
      };
    }

    // Fallback for edited layouts where slot nodes are hidden/collapsed.
    const lensCenter = stagePointForElementCenter(measurementTool);
    const lensRect = measurementTool.getBoundingClientRect();
    const laneOffset = Math.max(20, lensRect.width * 0.12);
    return {
      x: lensCenter.x + (slot === "right" ? laneOffset : -laneOffset) + TWO_QUBIT_MEASUREMENT_SLOT_SHIFT_X,
      y: lensCenter.y + TWO_QUBIT_MEASUREMENT_SLOT_SHIFT_Y,
    };
  }

  function placeQubitAtStart(qubit) {
    const funnelCenter = stagePointForElementCenter(qubit.preGate.funnel);
    const gateCenter = stagePointForElementCenter(qubit.preGate.pipe);
    const qubitRect = qubit.element.getBoundingClientRect();
    const radius = qubitRect.width / 2;
    const x = Math.max(radius + QUBIT_START_EDGE_GAP, gateCenter.x - 100);
    setQubitCenter(qubit, x, funnelCenter.y);
    clearMeasurementSlotForQubit(qubit);
    qubit.dragging = false;
    qubit.inCnotWindow = false;
    qubit.cnotIngesting = false;
    qubit.preTransitInProgress = false;
    qubit.measurementTransitInProgress = false;
    qubit.locked = false;
    settleQubitVisualState(qubit);
    qubit.blue = 1;
    qubit.red = 0;
    qubit.preGate.flange.classList.remove("extended");
    pipe.classList.remove("platform-extended");
    setMeasurementPlatformExtended(false);
    updateQubitColor(qubit);
  }

  function qubitStartPoint(qubit) {
    const funnelCenter = stagePointForElementCenter(qubit.preGate.funnel);
    const gateCenter = stagePointForElementCenter(qubit.preGate.pipe);
    const qubitRect = qubit.element.getBoundingClientRect();
    const radius = qubitRect.width / 2;
    return {
      x: Math.max(radius + QUBIT_START_EDGE_GAP, gateCenter.x - 100),
      y: funnelCenter.y,
    };
  }

  function qubitPostMeasurementReturnPoint(qubit) {
    const placements =
      seedEntanglementReturnTargetsFromPlacementsTab() || readPersistedEntanglementReturnTargets();
    if (!placements) {
      return qubitStartPoint(qubit);
    }
    const target = qubit.key === "top" ? placements.right : placements.left;
    if (!target) {
      return qubitStartPoint(qubit);
    }
    const qubitRect = qubit.element.getBoundingClientRect();
    const shellRect = shell.getBoundingClientRect();
    const radius = qubitRect.width / 2;
    const targetX = Number.parseFloat(target.x);
    const targetY = Number.parseFloat(target.y);
    if (!Number.isFinite(targetX) || !Number.isFinite(targetY)) {
      return qubitStartPoint(qubit);
    }
    // Use saved placement coordinates directly (same window frame), no scaling.
    return {
      x: clamp(targetX, radius, Math.max(radius, shellRect.width - radius)),
      y: clamp(targetY, radius, Math.max(radius, shellRect.height - radius)),
    };
  }

  function moveQubitToPoint(qubit, x, y, duration = AUTO_TRAVEL_MS) {
    return new Promise((resolve) => {
      qubit.element.style.setProperty("--move-duration", `${duration}ms`);
      qubit.element.classList.add("migrating");
      setQubitCenter(qubit, x, y);
      window.setTimeout(resolve, duration);
    });
  }

  function qubitReachedFunnelMidpoint(qubit, funnelElement) {
    const funnelRect = funnelElement.getBoundingClientRect();
    const qubitRect = qubit.element.getBoundingClientRect();
    const funnelMidX = (funnelRect.left + funnelRect.right) / 2;
    const verticalOverlap = Math.max(
      0,
      Math.min(qubitRect.bottom, funnelRect.bottom) - Math.max(qubitRect.top, funnelRect.top)
    );

    return (
      qubitRect.right >= funnelMidX &&
      qubitRect.left < funnelRect.right &&
      verticalOverlap >= qubitRect.height * 0.25
    );
  }

  function resolveQubitCircleRectOverlap(qubit, rectElement) {
    const shellRect = shell.getBoundingClientRect();
    const pipeRect = rectElement.getBoundingClientRect();
    const qubitRect = qubit.element.getBoundingClientRect();
    const center = stagePointForElementCenter(qubit.element);
    const resolved = resolveCircleRectOverlap(
      center.x,
      center.y,
      qubitRect.width / 2,
      {
        left: pipeRect.left - shellRect.left,
        right: pipeRect.right - shellRect.left,
        top: pipeRect.top - shellRect.top,
        bottom: pipeRect.bottom - shellRect.top,
      },
      1
    );

    if (!resolved.overlapped) {
      return false;
    }

    setQubitCenter(qubit, resolved.x, resolved.y);
    return true;
  }

  function preventManualPipeOverlap(qubit) {
    if (
      cnotBusy ||
      measurementInProgress ||
      autoRunInProgress ||
      qubit.cnotIngesting ||
      qubit.inCnotWindow ||
      qubit.preTransitInProgress ||
      qubit.measurementTransitInProgress
    ) {
      return false;
    }

    if (resolveQubitCircleRectOverlap(qubit, qubit.preGate.pipe)) {
      return true;
    }

    return resolveQubitCircleRectOverlap(qubit, pipe);
  }

  function allQubitsInCnotWindow() {
    return qubits.every((qubit) => qubit.inCnotWindow);
  }

  function pairTubeOutcomeKey(topResult, bottomResult) {
    if (topResult === "b" && bottomResult === "b") {
      return "bb";
    }
    if (topResult === "b" && bottomResult === "r") {
      return "br";
    }
    if (topResult === "r" && bottomResult === "b") {
      return "rb";
    }
    return "rr";
  }

  function collapseQubitState(qubit) {
    const totalWeight = qubit.blue + qubit.red;
    const blueProbability = totalWeight > 0 ? qubit.blue / totalWeight : 0.5;
    const blueResult = blueProbability >= 1 ? true : blueProbability <= 0 ? false : Math.random() < blueProbability;
    if (blueResult) {
      qubit.blue = 1;
      qubit.red = 0;
      updateQubitColor(qubit);
      return "b";
    }
    qubit.blue = 0;
    qubit.red = 1;
    updateQubitColor(qubit);
    return "r";
  }

  function normalizedQubitVectorFromProbabilities(qubit) {
    const total = qubit.blue + qubit.red;
    const blue = total > 0 ? qubit.blue / total : 0.5;
    const red = 1 - blue;
    return [Math.sqrt(clamp(blue, 0, 1)), Math.sqrt(clamp(red, 0, 1))];
  }

  function cnotOutcomeProbabilitiesForQubitPair(topQubit, bottomQubit) {
    if (
      topQubit.cnotPairToken &&
      topQubit.cnotPairToken === bottomQubit.cnotPairToken &&
      topQubit.cnotOutcomeProbabilities &&
      bottomQubit.cnotOutcomeProbabilities
    ) {
      return topQubit.cnotOutcomeProbabilities;
    }
    return cnotOutcomeProbabilitiesFromQubitVectors(
      normalizedQubitVectorFromProbabilities(topQubit),
      normalizedQubitVectorFromProbabilities(bottomQubit)
    );
  }

  function collapseQubitPairFromCnot(topQubit, bottomQubit) {
    const outcomeKey = samplePairOutcomeFromProbabilities(
      cnotOutcomeProbabilitiesForQubitPair(topQubit, bottomQubit)
    );
    const topBlue = outcomeKey[0] === "b";
    const bottomBlue = outcomeKey[1] === "b";
    topQubit.blue = topBlue ? 1 : 0;
    topQubit.red = topBlue ? 0 : 1;
    bottomQubit.blue = bottomBlue ? 1 : 0;
    bottomQubit.red = bottomBlue ? 0 : 1;
    topQubit.cnotPairToken = null;
    bottomQubit.cnotPairToken = null;
    topQubit.cnotOutcomeProbabilities = null;
    bottomQubit.cnotOutcomeProbabilities = null;
    updateQubitColor(topQubit);
    updateQubitColor(bottomQubit);
    return {
      outcomeKey,
      topResult: topBlue ? "b" : "r",
      bottomResult: bottomBlue ? "b" : "r",
    };
  }

  function updateMeasurementCapacityText() {
    measurementCapacity.textContent = `The testtubes can each hold ${tubeQubitCapacity} qubit pairs.`;
  }

  function maybeExpandTubeCapacity() {
    let maxCount = 0;
    Object.values(tubeCountState).forEach((count) => {
      if (count > maxCount) {
        maxCount = count;
      }
    });
    while (maxCount > tubeQubitCapacity) {
      tubeQubitCapacity *= 2;
    }
  }

  function updateTubeFills() {
    Object.entries(tubeCountState).forEach(([key, count]) => {
      measurementCountsByKey[key].textContent = String(count);
      const percent = Math.min((count / tubeQubitCapacity) * 100, 100);
      measurementLiquidsByKey[key].style.height = `${percent}%`;
    });
  }

  function clearMeasurementApparatus() {
    tubeQubitCapacity = INITIAL_TUBE_QUBIT_CAPACITY;
    Object.keys(tubeCountState).forEach((key) => {
      tubeCountState[key] = 0;
    });
    updateMeasurementCapacityText();
    updateTubeFills();
  }

  function setSpringExtended(flangeElement, extended) {
    flangeElement.classList.toggle("extended", extended);
  }

  function springTipX(springElement, flangeElement) {
    const shellRect = shell.getBoundingClientRect();
    const flangeRect = flangeElement.getBoundingClientRect();
    const springStyles = window.getComputedStyle(springElement);
    const springLength = Number.parseFloat(springStyles.getPropertyValue("--spring-length"));
    const usableSpringLength = Number.isFinite(springLength)
      ? springLength
      : springElement.getBoundingClientRect().width;
    const springOriginX = flangeRect.left - shellRect.left + 2;
    return springOriginX + usableSpringLength;
  }

  function setCnotPlatformExtended(extended) {
    pipe.classList.toggle("platform-extended", extended);
  }

  function cnotSpringTipX() {
    const shellRect = shell.getBoundingClientRect();
    const pipeRect = pipe.getBoundingClientRect();
    const springStyles = window.getComputedStyle(cnotPlatform);
    const springLength = Number.parseFloat(springStyles.getPropertyValue("--spring-length"));
    const usableSpringLength = Number.isFinite(springLength)
      ? springLength
      : cnotPlatform.getBoundingClientRect().width;
    const springOriginX = pipeRect.right - shellRect.left - 4;
    return springOriginX + usableSpringLength;
  }

  function setMeasurementPlatformExtended(extended) {
    measurementTool.classList.toggle("platform-extended", extended);
  }

  function measurementSpringTipX() {
    const lensRect = measurementTool.getBoundingClientRect();
    const shellRect = shell.getBoundingClientRect();
    const springStyles = window.getComputedStyle(measurementPlatform);
    const springLength = Number.parseFloat(springStyles.getPropertyValue("--spring-length"));
    const usableSpringLength = Number.isFinite(springLength)
      ? springLength
      : measurementPlatform.getBoundingClientRect().width;
    const springOriginX = lensRect.right - shellRect.left - 4;
    return springOriginX + usableSpringLength;
  }

  function measurementEjectionCenterXWithinBlock(qubitWidth) {
    const shellRect = shell.getBoundingClientRect();
    const blockRect = measurementBlock.getBoundingClientRect();
    const lensRect = measurementTool.getBoundingClientRect();
    const desiredCenterX = lensRect.right - shellRect.left + qubitWidth / 2 + 40;
    const maxCenterX = blockRect.right - shellRect.left - qubitWidth / 2 - 12;
    return Math.min(desiredCenterX, maxCenterX);
  }

  function alignMeasurementToolCenterWithCnot() {
    measurementBlock.style.top = "";
    const flexDirection = window.getComputedStyle(shell).flexDirection;
    if (flexDirection === "column") {
      measurementBlock.style.transform = "";
      return;
    }
    const cnotCenterY = stagePointForElementCenter(pipe).y;
    const measurementCenterY =
      stagePointForElementCenter(measurementTool).y + TWO_QUBIT_WIDE_LENS_VISUAL_CENTER_OFFSET_Y;
    const deltaY = cnotCenterY - measurementCenterY;
    measurementBlock.style.transform = `translateY(${deltaY}px)`;
  }

  function alignCnotCenterBetweenPreGates() {
    const topCenter = stagePointForElementCenter(qubits[0].preGate.pipe).y;
    const bottomCenter = stagePointForElementCenter(qubits[1].preGate.pipe).y;
    pipe.style.top = `${(topCenter + bottomCenter) / 2}px`;
  }

  function alignHorizontalFlow() {
    measurementBlock.style.left = "";
    const flexDirection = window.getComputedStyle(shell).flexDirection;
    if (flexDirection === "column") {
      pipe.style.left = "";
      return;
    }
    const shellRect = shell.getBoundingClientRect();
    const stackRect = preGateStack.getBoundingClientRect();
    const measurementRect = measurementBlock.getBoundingClientRect();
    const pipeRect = pipe.getBoundingClientRect();
    const pipeWidth = pipeRect.width || pipe.offsetWidth || 0;
    if (!pipeWidth || !shellRect.width) {
      return;
    }

    const leftBoundary = stackRect.right - shellRect.left;
    const rightBoundary = measurementRect.left - shellRect.left;
    if (rightBoundary <= leftBoundary + 40) {
      return;
    }

    const midpoint = (leftBoundary + rightBoundary) / 2;
    const minPipeLeft = leftBoundary + 14;
    const maxPipeLeft = rightBoundary - pipeWidth - 14;
    const desiredPipeLeft = clamp(midpoint - pipeWidth / 2, minPipeLeft, maxPipeLeft);
    pipe.style.left = `${Math.round(desiredPipeLeft)}px`;
  }

  function createMeasurementPayload(color, startPoint) {
    const payload = document.createElement("span");
    payload.className = "qubit measurement-pellet";
    payload.setAttribute("aria-hidden", "true");
    payload.style.left = `${startPoint.x}px`;
    payload.style.top = `${startPoint.y}px`;
    payload.style.pointerEvents = "none";
    payload.style.setProperty("--qubit-fill", color === "b" ? blendBlueRed(1, 0) : blendBlueRed(0, 1));
    shell.appendChild(payload);
    return payload;
  }

  function movePayloadToPoint(payload, x, y, duration = AUTO_TRAVEL_MS) {
    return new Promise((resolve) => {
      payload.style.setProperty("--move-duration", `${duration}ms`);
      payload.classList.add("migrating");
      payload.style.left = `${x}px`;
      payload.style.top = `${y}px`;
      window.setTimeout(resolve, duration);
    });
  }

  async function animateMeasurementPayloadsToTube(
    outcomeKey,
    topColor,
    bottomColor,
    topStartPoint,
    bottomStartPoint,
    expectedRunToken = runToken,
    { migrationDuration = AUTO_TRAVEL_MS, meltDuration = AUTO_MELT_MS } = {}
  ) {
    const topPayload = createMeasurementPayload(topColor, topStartPoint);
    const bottomPayload = createMeasurementPayload(bottomColor, bottomStartPoint);

    try {
      const shellRect = shell.getBoundingClientRect();
      const targetTube = measurementTubesByKey[outcomeKey];
      const targetRect = targetTube.getBoundingClientRect();
      const targetPoint = {
        x: targetRect.left - shellRect.left + targetRect.width / 2,
        y: targetRect.top - shellRect.top + targetRect.height * 0.22,
      };
      const payloadHeight = topPayload.getBoundingClientRect().height;
      const targetOffset = payloadHeight * 0.8;

      await Promise.all([
        movePayloadToPoint(topPayload, targetPoint.x, targetPoint.y - targetOffset, migrationDuration),
        movePayloadToPoint(bottomPayload, targetPoint.x, targetPoint.y + targetOffset, migrationDuration),
      ]);
      if (expectedRunToken !== runToken) {
        return false;
      }

      topPayload.style.setProperty("--melt-duration", `${meltDuration}ms`);
      bottomPayload.style.setProperty("--melt-duration", `${meltDuration}ms`);
      topPayload.classList.add("melting");
      bottomPayload.classList.add("melting");
      await wait(meltDuration);
      if (expectedRunToken !== runToken) {
        return false;
      }

      tubeCountState[outcomeKey] += 1;
      maybeExpandTubeCapacity();
      updateMeasurementCapacityText();
      updateTubeFills();
      return true;
    } finally {
      topPayload.remove();
      bottomPayload.remove();
    }
  }

  function applyPreGateToQubit(qubit) {
    const inVector = [Math.sqrt(clamp(qubit.blue, 0, 1)), Math.sqrt(clamp(qubit.red, 0, 1))];
    const outVector = vectorTimesMatrix2(inVector, gateMatrixForTick(qubit.preGate.tickIndex));
    const [blueProbability, redProbability] = probabilitiesFromVector2(normalizeVector2(outVector));
    qubit.blue = blueProbability;
    qubit.red = redProbability;
    updateQubitColor(qubit);
  }

  function applyCnotGateToQubits() {
    const normalizeProbabilities = (qubit) => {
      const total = qubit.blue + qubit.red;
      const blue = total > 0 ? qubit.blue / total : 0.5;
      return {
        blue,
        red: 1 - blue,
      };
    };

    const control = normalizeProbabilities(qubits[0]);
    const target = normalizeProbabilities(qubits[1]);

    // Build a two-qubit state vector from single-qubit states.
    // We model amplitudes as real non-negative values whose squares are probabilities.
    const c0 = Math.sqrt(control.blue);
    const c1 = Math.sqrt(control.red);
    const t0 = Math.sqrt(target.blue);
    const t1 = Math.sqrt(target.red);
    const inState = [c0 * t0, c0 * t1, c1 * t0, c1 * t1];

    // CNOT on basis order |00>, |01>, |10>, |11>:
    // [1 0 0 0]
    // [0 1 0 0]
    // [0 0 0 1]
    // [0 0 1 0]
    const outState = [inState[0], inState[1], inState[3], inState[2]];

    // Marginal probabilities for displayed qubit colors.
    const controlBlue = outState[0] ** 2 + outState[1] ** 2;
    const controlRed = outState[2] ** 2 + outState[3] ** 2;
    const targetBlue = outState[0] ** 2 + outState[2] ** 2;
    const targetRed = outState[1] ** 2 + outState[3] ** 2;

    qubits[0].blue = controlBlue;
    qubits[0].red = controlRed;
    qubits[1].blue = targetBlue;
    qubits[1].red = targetRed;

    qubits.forEach((qubit) => {
      updateQubitColor(qubit);
    });
  }

  function annotateCnotOutcomeProbabilitiesForCurrentState() {
    const outcomeProbabilities = cnotOutcomeProbabilitiesFromQubitVectors(
      normalizedQubitVectorFromProbabilities(qubits[0]),
      normalizedQubitVectorFromProbabilities(qubits[1])
    );
    const pairToken = `${Date.now()}-${Math.random()}`;
    qubits[0].cnotPairToken = pairToken;
    qubits[1].cnotPairToken = pairToken;
    qubits[0].cnotOutcomeProbabilities = outcomeProbabilities;
    qubits[1].cnotOutcomeProbabilities = outcomeProbabilities;
  }

  function maybeTriggerManualMeasurement() {
    if (
      measurementSlotOccupants.left &&
      measurementSlotOccupants.right &&
      !measurementInProgress &&
      !cnotBusy &&
      !autoRunInProgress
    ) {
      const token = runToken + 1;
      runToken = token;
      runMeasurementSequence(token).catch(() => {});
    }
  }

  function setPreGateTickIndex(
    qubit,
    tickIndex,
    { deferMeasurementClear = false, fromDial = false } = {}
  ) {
    const normalizedTick = normalizeTickIndex(tickIndex);
    const changed = normalizedTick !== qubit.preGate.tickIndex;
    qubit.preGate.tickIndex = normalizedTick;

    if (!fromDial) {
      const dial = preGateDials.get(qubit.key);
      if (dial) {
        dial.setTick(normalizedTick, {
          deferMeasurementClear,
          reason: "programmatic",
        });
        return;
      }
    }

    if (changed && !deferMeasurementClear && !autoRunInProgress) {
      clearMeasurementApparatus();
    }
  }

  function beginPreGateArrowDrag(qubit, event) {
    preGateDials.get(qubit.key)?.beginDrag(event);
  }

  function continuePreGateArrowDrag(event) {
    preGateDials.forEach((dial) => {
      dial?.continueDrag(event);
    });
  }

  function endPreGateArrowDrag() {
    preGateDials.forEach((dial) => {
      dial?.endDrag();
    });
  }

  async function runPreGateTransit(qubit, expectedRunToken = runToken) {
    if (
      cnotBusy ||
      measurementInProgress ||
      autoRunInProgress ||
      qubit.preTransitInProgress ||
      qubit.cnotIngesting ||
      qubit.inCnotWindow ||
      qubit.measurementTransitInProgress
    ) {
      return false;
    }

    qubit.preTransitInProgress = true;
    qubit.dragging = false;
    qubit.locked = true;
    qubit.element.classList.remove("dragging");

    try {
      clearMeasurementSlotForQubit(qubit);
      const preWindowCenter = stagePointForElementCenter(qubit.preGate.pipe);
      await moveQubitToPoint(qubit, preWindowCenter.x, preWindowCenter.y, AUTO_TRAVEL_MS);
      if (expectedRunToken !== runToken) {
        return false;
      }

      await wait(GATE_TUBE_DWELL_MS);
      if (expectedRunToken !== runToken) {
        return false;
      }

      applyPreGateToQubit(qubit);
      setSpringExtended(qubit.preGate.flange, true);

      const qubitRect = qubit.element.getBoundingClientRect();
      const targetX = springTipX(qubit.preGate.spring, qubit.preGate.flange) + 6 + qubitRect.width / 2;
      const targetY = preWindowCenter.y;
      await moveQubitToPoint(qubit, targetX, targetY, GATE_PLATFORM_EXTEND_MS);
      if (expectedRunToken !== runToken) {
        return false;
      }

      settleQubitVisualState(qubit);
      setQubitCenter(qubit, targetX, targetY);

      setSpringExtended(qubit.preGate.flange, false);
      await wait(GATE_PLATFORM_RETRACT_MS);
      return true;
    } finally {
      setSpringExtended(qubit.preGate.flange, false);
      qubit.preTransitInProgress = false;
      qubit.locked = false;
    }
  }

  async function runMeasurementSequence(
    expectedRunToken = runToken,
    { migrationDuration = GATE_PLATFORM_EXTEND_MS, meltDuration = AUTO_MELT_MS } = {}
  ) {
    if (measurementInProgress || cnotBusy) {
      return;
    }
    if (!measurementSlotOccupants.left || !measurementSlotOccupants.right) {
      return;
    }
    if (expectedRunToken !== runToken) {
      return;
    }

    measurementInProgress = true;
    qubits.forEach((qubit) => {
      qubit.dragging = false;
      qubit.locked = true;
      qubit.element.classList.remove("dragging");
    });
    setMeasurementPlatformExtended(false);

    try {
      const leftQubit = measurementSlotOccupants.left;
      const rightQubit = measurementSlotOccupants.right;
      const topQubit = leftQubit?.key === "top" ? leftQubit : rightQubit;
      const bottomQubit = topQubit === leftQubit ? rightQubit : leftQubit;
      if (!topQubit || !bottomQubit) {
        return;
      }

      topQubit.element.classList.add("collapse-animating");
      bottomQubit.element.classList.add("collapse-animating");
      await wait(DOUBLE_MEASUREMENT_COLLAPSE_DELAY_MS);
      if (expectedRunToken !== runToken) {
        return;
      }

      const collapseResult = collapseQubitPairFromCnot(topQubit, bottomQubit);
      const topResult = collapseResult.topResult;
      const bottomResult = collapseResult.bottomResult;
      topQubit.element.classList.remove("collapse-animating");
      bottomQubit.element.classList.remove("collapse-animating");

      await wait(DOUBLE_MEASUREMENT_POST_COLLAPSE_DELAY_MS);
      if (expectedRunToken !== runToken) {
        return;
      }

      const outcomeKey = pairTubeOutcomeKey(topResult, bottomResult);
      const topPayloadStart = stagePointForElementCenter(topQubit.element);
      const bottomPayloadStart = stagePointForElementCenter(bottomQubit.element);
      settleQubitVisualState(topQubit);
      settleQubitVisualState(bottomQubit);
      topQubit.element.classList.add("ent-hidden");
      bottomQubit.element.classList.add("ent-hidden");
      await nextFrame();

      topQubit.blue = 1;
      topQubit.red = 0;
      bottomQubit.blue = 1;
      bottomQubit.red = 0;
      delete topQubit.element.dataset.phaseSign;
      delete bottomQubit.element.dataset.phaseSign;
      updateQubitColor(topQubit);
      updateQubitColor(bottomQubit);

      const topStart = qubitPostMeasurementReturnPoint(topQubit);
      const bottomStart = qubitPostMeasurementReturnPoint(bottomQubit);
      setQubitCenter(topQubit, topStart.x, topStart.y);
      setQubitCenter(bottomQubit, bottomStart.x, bottomStart.y);
      topQubit.inCnotWindow = false;
      bottomQubit.inCnotWindow = false;
      topQubit.cnotIngesting = false;
      bottomQubit.cnotIngesting = false;
      clearMeasurementSlotForQubit(topQubit);
      clearMeasurementSlotForQubit(bottomQubit);

      const payloadsCompleted = await animateMeasurementPayloadsToTube(
        outcomeKey,
        topResult,
        bottomResult,
        topPayloadStart,
        bottomPayloadStart,
        expectedRunToken,
        { migrationDuration, meltDuration }
      );
      if (!payloadsCompleted || expectedRunToken !== runToken) {
        return;
      }

      topQubit.element.classList.remove("ent-hidden");
      bottomQubit.element.classList.remove("ent-hidden");
      topQubit.element.classList.add("ent-appearing");
      bottomQubit.element.classList.add("ent-appearing");
      await wait(180);
      topQubit.element.classList.remove("ent-appearing");
      bottomQubit.element.classList.remove("ent-appearing");
    } finally {
      setMeasurementPlatformExtended(false);
      qubits.forEach((qubit) => {
        qubit.element.classList.remove("collapse-animating");
        qubit.element.classList.remove("ent-hidden");
        qubit.element.classList.remove("ent-appearing");
        qubit.locked = false;
      });
      measurementInProgress = false;
    }
  }

  function nextFrame() {
    return new Promise((resolve) => window.requestAnimationFrame(() => resolve()));
  }

  async function runAutomatedEntanglementMeasurements(iterations) {
    if (autoRunInProgress || measurementInProgress || cnotBusy) {
      return;
    }

    const useMachineMode = iterations >= 100;
    const speedFactor = iterations >= 10 ? 2 : 1;
    const travelDuration = Math.round(AUTO_TRAVEL_MS / speedFactor);
    const gatePauseDuration = Math.round(AUTO_GATE_PAUSE_MS / speedFactor);
    const meltDuration = Math.round(AUTO_MELT_MS / speedFactor);
    const machineDuration =
      iterations === 100
        ? MACHINE_DURATION_100_MS
        : iterations === 1000
          ? MACHINE_DURATION_1000_MS
          : null;

    const thisRunToken = runToken + 1;
    runToken = thisRunToken;
    autoRunInProgress = true;
    measurementCount.disabled = true;

    qubits.forEach((qubit) => {
      qubit.dragging = false;
      qubit.element.classList.remove("dragging");
      clearMeasurementSlotForQubit(qubit);
    });

    try {
      if (useMachineMode) {
        qubits.forEach((qubit) => placeQubitAtStart(qubit));

        const processOne = () => {
          qubits.forEach((qubit) => {
            qubit.blue = 1;
            qubit.red = 0;
          });
          applyPreGateToQubit(qubits[0]);
          applyPreGateToQubit(qubits[1]);
          annotateCnotOutcomeProbabilitiesForCurrentState();
          applyCnotGateToQubits();
          const { outcomeKey } = collapseQubitPairFromCnot(qubits[0], qubits[1]);
          tubeCountState[outcomeKey] += 1;
          maybeExpandTubeCapacity();
        };

        let processed = 0;
        if (machineDuration !== null) {
          const runStart = performance.now();
          while (processed < iterations) {
            if (thisRunToken !== runToken) {
              break;
            }
            const elapsed = performance.now() - runStart;
            const progress = Math.min(elapsed / machineDuration, 1);
            const shouldBeProcessed = Math.floor(progress * iterations);
            if (shouldBeProcessed <= processed) {
              await nextFrame();
              continue;
            }
            while (processed < shouldBeProcessed && processed < iterations) {
              processOne();
              processed += 1;
            }
            updateMeasurementCapacityText();
            updateTubeFills();
            await nextFrame();
          }
        } else {
          await nextFrame();
          while (processed < iterations && thisRunToken === runToken) {
            processOne();
            processed += 1;
          }
        }
        updateMeasurementCapacityText();
        updateTubeFills();
        qubits.forEach((qubit) => placeQubitAtStart(qubit));
        return;
      }

      for (let i = 0; i < iterations; i += 1) {
        if (thisRunToken !== runToken) {
          break;
        }

        qubits.forEach((qubit) => placeQubitAtStart(qubit));
        const preGateCenters = qubits.map((qubit) => stagePointForElementCenter(qubit.preGate.pipe));
        await Promise.all([
          moveQubitToPoint(qubits[0], preGateCenters[0].x, preGateCenters[0].y, travelDuration),
          moveQubitToPoint(qubits[1], preGateCenters[1].x, preGateCenters[1].y, travelDuration),
        ]);
        if (thisRunToken !== runToken) {
          break;
        }

        applyPreGateToQubit(qubits[0]);
        applyPreGateToQubit(qubits[1]);
        await wait(gatePauseDuration);
        if (thisRunToken !== runToken) {
          break;
        }

        const cnotCenters = qubits.map((qubit) => stagePointForElementCenter(qubit.cnotWindow));
        await Promise.all([
          moveQubitToPoint(qubits[0], cnotCenters[0].x, cnotCenters[0].y, travelDuration),
          moveQubitToPoint(qubits[1], cnotCenters[1].x, cnotCenters[1].y, travelDuration),
        ]);
        if (thisRunToken !== runToken) {
          break;
        }

        annotateCnotOutcomeProbabilitiesForCurrentState();
        applyCnotGateToQubits();
        await wait(gatePauseDuration);
        if (thisRunToken !== runToken) {
          break;
        }

        const topSlotName = getMeasurementSlotForQubit(qubits[0]);
        const bottomSlotName = getMeasurementSlotForQubit(qubits[1]);
        const topSlot = getMeasurementSlotCenter(topSlotName);
        const bottomSlot = getMeasurementSlotCenter(bottomSlotName);
        await Promise.all([
          moveQubitToPoint(qubits[0], topSlot.x, topSlot.y, travelDuration),
          moveQubitToPoint(qubits[1], bottomSlot.x, bottomSlot.y, travelDuration),
        ]);
        if (thisRunToken !== runToken) {
          break;
        }

        clearMeasurementSlotForQubit(qubits[0]);
        clearMeasurementSlotForQubit(qubits[1]);
        measurementSlotOccupants[topSlotName] = qubits[0];
        measurementSlotOccupants[bottomSlotName] = qubits[1];
        qubits[0].measurementSlot = topSlotName;
        qubits[1].measurementSlot = bottomSlotName;
        qubits[0].inCnotWindow = false;
        qubits[1].inCnotWindow = false;
        qubits[0].cnotIngesting = false;
        qubits[1].cnotIngesting = false;

        await runMeasurementSequence(thisRunToken, {
          migrationDuration: travelDuration,
          meltDuration,
        });
      }
    } finally {
      autoRunInProgress = false;
      measurementCount.disabled = false;
    }
  }

  function handleEntanglementLensClickRun() {
    if (autoRunInProgress || measurementInProgress || cnotBusy) {
      return;
    }
    runAutomatedEntanglementMeasurements(1);
  }

  async function runCnotCycle(expectedRunToken = runToken) {
    if (cnotBusy || measurementInProgress || autoRunInProgress || !allQubitsInCnotWindow()) {
      return;
    }

    cnotBusy = true;
    qubits.forEach((qubit) => {
      qubit.locked = true;
    });
    try {
      await wait(CNOT_WINDOW_DWELL_MS);
      if (expectedRunToken !== runToken) {
        return;
      }

      annotateCnotOutcomeProbabilitiesForCurrentState();
      applyCnotGateToQubits();
      setCnotPlatformExtended(true);
      const springTipXValue = cnotSpringTipX();

      const targets = qubits.map((qubit) => {
        const slotCenter = stagePointForElementCenter(qubit.cnotWindow);
        const qubitRect = qubit.element.getBoundingClientRect();
        return {
          qubit,
          x: springTipXValue + 6 + qubitRect.width / 2,
          y: slotCenter.y,
        };
      });

      await Promise.all(
        targets.map((target) => moveQubitToPoint(target.qubit, target.x, target.y, GATE_PLATFORM_EXTEND_MS))
      );
      if (expectedRunToken !== runToken) {
        return;
      }

      targets.forEach((target) => {
        settleQubitVisualState(target.qubit);
        setQubitCenter(target.qubit, target.x, target.y);
        target.qubit.inCnotWindow = false;
        target.qubit.cnotIngesting = false;
        target.qubit.measurementTransitInProgress = false;
        target.qubit.locked = false;
      });

      setCnotPlatformExtended(false);
      await wait(GATE_PLATFORM_RETRACT_MS);
    } finally {
      setCnotPlatformExtended(false);
      qubits.forEach((qubit) => {
        qubit.locked = false;
      });
      cnotBusy = false;
    }
  }

  async function runCnotIngress(qubit, expectedRunToken = runToken) {
    if (
      cnotBusy ||
      measurementInProgress ||
      autoRunInProgress ||
      qubit.preTransitInProgress ||
      qubit.cnotIngesting ||
      qubit.inCnotWindow ||
      qubit.measurementTransitInProgress
    ) {
      return false;
    }

    clearMeasurementSlotForQubit(qubit);
    qubit.cnotIngesting = true;
    qubit.dragging = false;
    qubit.locked = true;
    qubit.element.classList.remove("dragging");
    qubit.element.classList.add("ent-hidden");

    await wait(160);
    if (expectedRunToken !== runToken) {
      qubit.cnotIngesting = false;
      qubit.locked = false;
      qubit.element.classList.remove("ent-hidden");
      return false;
    }

    const windowCenter = stagePointForElementCenter(qubit.cnotWindow);
    setQubitCenter(qubit, windowCenter.x, windowCenter.y);
    qubit.element.classList.remove("ent-hidden");
    qubit.element.classList.add("ent-appearing");
    await wait(180);
    qubit.element.classList.remove("ent-appearing");

    if (expectedRunToken !== runToken) {
      qubit.cnotIngesting = false;
      qubit.locked = false;
      return false;
    }

    qubit.inCnotWindow = true;
    qubit.cnotIngesting = false;
    settleQubitVisualState(qubit);

    if (allQubitsInCnotWindow()) {
      const token = runToken + 1;
      runToken = token;
      runCnotCycle(token).catch(() => {});
    }
    return true;
  }

  async function runMeasurementIngress(qubit, expectedRunToken = runToken) {
    if (
      cnotBusy ||
      measurementInProgress ||
      autoRunInProgress ||
      qubit.preTransitInProgress ||
      qubit.cnotIngesting ||
      qubit.inCnotWindow ||
      qubit.measurementTransitInProgress
    ) {
      return false;
    }

    const chosenSlot = getMeasurementSlotForQubit(qubit);
    if (measurementSlotOccupants[chosenSlot] && measurementSlotOccupants[chosenSlot] !== qubit) {
      return false;
    }

    qubit.measurementTransitInProgress = true;
    qubit.dragging = false;
    qubit.locked = true;
    qubit.element.classList.remove("dragging");
    qubit.inCnotWindow = false;
    qubit.cnotIngesting = false;
    clearMeasurementSlotForQubit(qubit);
    measurementSlotOccupants[chosenSlot] = qubit;
    qubit.measurementSlot = chosenSlot;

    const slotCenter = getMeasurementSlotCenter(chosenSlot);
    await moveQubitToPoint(qubit, slotCenter.x, slotCenter.y, AUTO_TRAVEL_MS);
    if (expectedRunToken !== runToken || cnotBusy || autoRunInProgress) {
      clearMeasurementSlotForQubit(qubit);
      qubit.measurementTransitInProgress = false;
      qubit.locked = false;
      settleQubitVisualState(qubit);
      return false;
    }

    settleQubitVisualState(qubit);
    setQubitCenter(qubit, slotCenter.x, slotCenter.y);
    qubit.measurementTransitInProgress = false;
    qubit.locked = false;
    maybeTriggerManualMeasurement();
    return true;
  }

  function maybeSnapQubitToPreFunnel(qubit) {
    if (!qubitReachedFunnelMidpoint(qubit, qubit.preGate.funnel)) {
      return false;
    }
    if (
      cnotBusy ||
      measurementInProgress ||
      autoRunInProgress ||
      qubit.preTransitInProgress ||
      qubit.cnotIngesting ||
      qubit.inCnotWindow ||
      qubit.measurementTransitInProgress
    ) {
      return false;
    }

    runPreGateTransit(qubit, runToken).catch(() => {});
    return true;
  }

  function maybeSnapQubitToCnotFunnel(qubit) {
    if (!qubitReachedFunnelMidpoint(qubit, qubit.cnotFunnel)) {
      return false;
    }
    if (
      cnotBusy ||
      measurementInProgress ||
      autoRunInProgress ||
      qubit.preTransitInProgress ||
      qubit.cnotIngesting ||
      qubit.inCnotWindow ||
      qubit.measurementTransitInProgress
    ) {
      return false;
    }

    runCnotIngress(qubit, runToken).catch(() => {});
    return true;
  }

  function maybeSnapQubitToMeasurementFunnel(qubit) {
    if (!qubitReachedFunnelMidpoint(qubit, measurementFunnel)) {
      return false;
    }
    if (
      cnotBusy ||
      measurementInProgress ||
      autoRunInProgress ||
      qubit.preTransitInProgress ||
      qubit.cnotIngesting ||
      qubit.inCnotWindow ||
      qubit.measurementTransitInProgress
    ) {
      return false;
    }

    runMeasurementIngress(qubit, runToken).catch(() => {});
    return true;
  }

  function maybeSnapQubitToMeasurementLens(qubit) {
    if (measurementInProgress || cnotBusy || autoRunInProgress || qubit.measurementTransitInProgress) {
      return false;
    }

    const lensRect = measurementTool.getBoundingClientRect();
    const qubitRect = qubit.element.getBoundingClientRect();
    const qubitCx = qubitRect.left + qubitRect.width / 2;
    const qubitCy = qubitRect.top + qubitRect.height / 2;
    if (
      qubitCx < lensRect.left ||
      qubitCx > lensRect.right ||
      qubitCy < lensRect.top ||
      qubitCy > lensRect.bottom
    ) {
      return false;
    }

    const chosenSlot = getMeasurementSlotForQubit(qubit);
    if (measurementSlotOccupants[chosenSlot] && measurementSlotOccupants[chosenSlot] !== qubit) {
      return false;
    }

    clearMeasurementSlotForQubit(qubit);
    measurementSlotOccupants[chosenSlot] = qubit;
    qubit.measurementSlot = chosenSlot;
    qubit.inCnotWindow = false;
    qubit.cnotIngesting = false;
    const slotCenter = getMeasurementSlotCenter(chosenSlot);
    setQubitCenter(qubit, slotCenter.x, slotCenter.y);
    settleQubitVisualState(qubit);
    maybeTriggerManualMeasurement();
    return true;
  }

  function beginQubitDrag(qubit, event) {
    if (handleShiftQubitSelection(event, qubit.element)) {
      return;
    }
    if (
      cnotBusy ||
      measurementInProgress ||
      autoRunInProgress ||
      qubit.preTransitInProgress ||
      qubit.cnotIngesting ||
      qubit.inCnotWindow ||
      qubit.measurementTransitInProgress ||
      qubit.locked
    ) {
      return;
    }
    if (!isPrimaryMouseButton(event)) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    const point = getPointer(event);
    const qubitRect = qubit.element.getBoundingClientRect();
    qubit.dragging = true;
    qubit.element.classList.add("dragging");
    qubit.dragOffsetX = point.clientX - (qubitRect.left + qubitRect.width / 2);
    qubit.dragOffsetY = point.clientY - (qubitRect.top + qubitRect.height / 2);
    clearMeasurementSlotForQubit(qubit);
  }

  function continueQubitDrag(event) {
    const draggingQubits = qubits.filter((qubit) => qubit.dragging);
    if (!draggingQubits.length || cnotBusy || measurementInProgress || autoRunInProgress) {
      return;
    }
    if (event.touches) {
      event.preventDefault();
    }

    const point = getPointer(event);
    const shellRect = shell.getBoundingClientRect();
    draggingQubits.forEach((qubit) => {
      if (qubit.locked) {
        return;
      }
      const nextX = point.clientX - shellRect.left - qubit.dragOffsetX;
      const nextY = point.clientY - shellRect.top - qubit.dragOffsetY;
      setQubitCenter(qubit, nextX, nextY);
      if (maybeSnapQubitToPreFunnel(qubit)) {
        return;
      }
      if (maybeSnapQubitToCnotFunnel(qubit)) {
        return;
      }
      if (maybeSnapQubitToMeasurementFunnel(qubit)) {
        return;
      }
      if (maybeSnapQubitToMeasurementLens(qubit)) {
        return;
      }
      preventManualPipeOverlap(qubit);
    });
  }

  function endQubitDrag() {
    if (cnotBusy || measurementInProgress || autoRunInProgress) {
      return;
    }

    qubits.forEach((qubit) => {
      if (!qubit.dragging) {
        return;
      }
      qubit.dragging = false;
      qubit.element.classList.remove("dragging");
      if (maybeSnapQubitToPreFunnel(qubit)) {
        return;
      }
      if (maybeSnapQubitToCnotFunnel(qubit)) {
        return;
      }
      if (maybeSnapQubitToMeasurementFunnel(qubit)) {
        return;
      }
      if (maybeSnapQubitToMeasurementLens(qubit)) {
        return;
      }
      preventManualPipeOverlap(qubit);
    });
  }

  function handleResize() {
    const shellRect = shell.getBoundingClientRect();
    if (!shellRect.width || !shellRect.height) {
      return;
    }

    alignCnotCenterBetweenPreGates();
    alignHorizontalFlow();
    alignMeasurementToolCenterWithCnot();

    preGateDials.forEach((dial) => {
      dial?.layout();
    });

    if (!initialized) {
      qubits.forEach((qubit) => placeQubitAtStart(qubit));
      initialized = true;
      return;
    }

    qubits.forEach((qubit) => {
      if (qubit.inCnotWindow) {
        const center = stagePointForElementCenter(qubit.cnotWindow);
        setQubitCenter(qubit, center.x, center.y);
        return;
      }
      if (qubit.measurementSlot) {
        const center = getMeasurementSlotCenter(qubit.measurementSlot);
        setQubitCenter(qubit, center.x, center.y);
        return;
      }
      const center = stagePointForElementCenter(qubit.element);
      setQubitCenter(qubit, center.x, center.y);
    });
  }

  function resetEntanglementSimulator() {
    runToken += 1;
    autoRunInProgress = false;
    cnotBusy = false;
    measurementInProgress = false;
    measurementCount.disabled = false;
    measurementCount.value = "1";
    setCnotPlatformExtended(false);
    setMeasurementPlatformExtended(false);
    preGateDials.forEach((dial) => {
      dial?.endDrag();
    });
    qubits.forEach((qubit) => {
      clearMeasurementSlotForQubit(qubit);
      qubit.locked = false;
      qubit.dragging = false;
      qubit.preTransitInProgress = false;
      qubit.cnotIngesting = false;
      qubit.inCnotWindow = false;
      qubit.measurementTransitInProgress = false;
      settleQubitVisualState(qubit);
      placeQubitAtStart(qubit);
    });
    setPreGateTickIndex(qubits[0], ENT_TOP_DEFAULT_GATE_TICK_INDEX);
    setPreGateTickIndex(qubits[1], ENT_BOTTOM_DEFAULT_GATE_TICK_INDEX);
    clearMeasurementApparatus();
  }

  qubits.forEach((qubit) => {
    qubit.element.addEventListener("mousedown", (event) => beginQubitDrag(qubit, event));
    qubit.element.addEventListener(
      "touchstart",
      (event) => beginQubitDrag(qubit, event),
      { passive: false }
    );
  });

  qubits.forEach((qubit) => {
    const dial = createSingleQubitGateDial({
      ticksWrap: qubit.preGate.ticksWrap,
      arrow: qubit.preGate.arrow,
      initialTick: qubit.preGate.tickIndex,
      tickAriaLabelPrefix: `${qubit.key} gate tick`,
      orbitInset: 10,
      canInteract: () => !(autoRunInProgress || cnotBusy || measurementInProgress),
      onTickChange: (tick, meta) => {
        setPreGateTickIndex(qubit, tick, {
          deferMeasurementClear: meta.deferMeasurementClear,
          fromDial: true,
        });
      },
      onTickCommitted: ({ changed }) => {
        if (changed) {
          clearMeasurementApparatus();
        }
      },
    });
    preGateDials.set(qubit.key, dial);
    qubit.preGate.arrow.addEventListener("mousedown", (event) => beginPreGateArrowDrag(qubit, event));
    qubit.preGate.arrow.addEventListener(
      "touchstart",
      (event) => beginPreGateArrowDrag(qubit, event),
      { passive: false }
    );
    qubit.preGate.arrow.addEventListener("keydown", (event) => preGateDials.get(qubit.key)?.handleKeydown(event));
  });
  setPreGateTickIndex(qubits[0], ENT_TOP_DEFAULT_GATE_TICK_INDEX);
  setPreGateTickIndex(qubits[1], ENT_BOTTOM_DEFAULT_GATE_TICK_INDEX);
  clearMeasurementApparatus();

  measurementCount.addEventListener("mousedown", (event) => event.stopPropagation());
  measurementCount.addEventListener("touchstart", (event) => event.stopPropagation());
  measurementCount.addEventListener("click", (event) => event.stopPropagation());
  measurementCount.addEventListener("change", () => {
    clearMeasurementApparatus();
    const iterations = Number(measurementCount.value) || 1;
    runAutomatedEntanglementMeasurements(Math.max(1, iterations));
  });

  measurementTool.addEventListener("click", () => {
    handleEntanglementLensClickRun();
  });

  entResetButton.addEventListener("click", () => {
    resetEntanglementSimulator();
  });

  window.addEventListener("mousemove", (event) => {
    continuePreGateArrowDrag(event);
    continueQubitDrag(event);
  });
  window.addEventListener(
    "touchmove",
    (event) => {
      continuePreGateArrowDrag(event);
      continueQubitDrag(event);
    },
    { passive: false }
  );
  window.addEventListener("mouseup", () => {
    endPreGateArrowDrag();
    endQubitDrag();
  });
  window.addEventListener("touchend", () => {
    endPreGateArrowDrag();
    endQubitDrag();
  });
  window.addEventListener("touchcancel", () => {
    endPreGateArrowDrag();
    endQubitDrag();
  });

  return {
    handleResize,
  };
}

playgroundComponentDefaultsCache = readPlaygroundComponentDefaultsPayload();

const oneQubitRoot = mountOneQubitSimulator();
const oneQubitSimulator = oneQubitRoot ? setupSimulator(oneQubitRoot) : null;
const pairRoot = mountTwoQubitPair();
const twoQubitPairSimulator = pairRoot ? setupTwoQubitPair(pairRoot) : null;
const entanglementRoot = mountEntanglementGate(entanglementHost);
const entanglementSimulator = entanglementRoot ? setupEntanglementGate(entanglementRoot) : null;
const plagroundComposer = setupPlagroundComposer({
  oneQubitRoot,
  twoQubitPairRoot: pairRoot,
  entanglementRoot,
});
const simulators = [
  oneQubitSimulator,
  twoQubitPairSimulator,
  entanglementSimulator,
  plagroundComposer,
].filter(Boolean);

refreshLayoutEditTargets();
if (layoutEditToggle) {
  layoutEditToggle.addEventListener("click", () => {
    setLayoutEditEnabled(!layoutEditorState.enabled);
  });
}
if (layoutSaveButton) {
  layoutSaveButton.addEventListener("click", () => {
    const saved = saveLayoutEdits();
    setLayoutSaveButtonSavedState(saved);
  });
}
if (layoutResetButton) {
  layoutResetButton.addEventListener("click", () => {
    resetLayoutEditsToDefault();
    setLayoutSaveButtonSavedState(false);
    refreshVisibleSimulators();
  });
}
setLayoutEditEnabled(false);
applySavedLayoutEdits();

function refreshVisibleSimulators() {
  simulators.forEach((simulator) => {
    simulator.handleResize();
  });
  layoutGeneratedSingleGateDials(document);
}

function refreshVisibleSimulatorsAfterTabSwitch() {
  window.requestAnimationFrame(() => {
    refreshVisibleSimulators();
    window.requestAnimationFrame(() => {
      refreshVisibleSimulators();
    });
  });
}

function setActiveTab(tabTarget) {
  if (!tabButtons.length || !tabPanels.length) {
    return;
  }

  clearQubitSelection();
  clearSelectedGeneratedLayoutItem();

  if (tabTarget === "entanglement") {
    const entGate = document.querySelector('#panel-entanglement [data-role="ent-gate"]');
    const entMeasurementHost = document.querySelector('#panel-entanglement [data-role="ent-measurement-host"]');
    [entGate, entMeasurementHost].forEach((element) => {
      if (!(element instanceof HTMLElement)) {
        return;
      }
      setLayoutTargetTranslate(element, 0, 0);
      element.style.width = "";
      element.style.height = "";
      element.style.display = "";
    });
  }

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
      window.requestAnimationFrame(() => layoutGeneratedSingleGateDials(panel));
    }
  });

  setLayoutEditEnabled(tabTarget === "plaground");
  refreshVisibleSimulatorsAfterTabSwitch();
}

tabButtons.forEach((button) => registerTabButton(button));
restoreGeneratedTabs({
  oneQubitRoot,
  twoQubitPairRoot: pairRoot,
  entanglementRoot,
});
plagroundComposer?.handleGeneratedTabsChanged?.();

window.addEventListener("resize", () => {
  refreshVisibleSimulators();
});

setActiveTab("one-qubit");

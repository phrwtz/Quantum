const tabButtons = Array.from(document.querySelectorAll(".tab-btn"));
const tabPanels = Array.from(document.querySelectorAll(".tab-panel"));
const simulatorTemplate = document.getElementById("simulatorTemplate");
const twoQubitPairTemplate = document.getElementById("twoQubitPairTemplate");
const entanglementGateTemplate = document.getElementById("entanglementGateTemplate");
const pairMeasurementToolTemplate = document.getElementById("pairMeasurementToolTemplate");
const oneQubitHost = document.getElementById("oneQubitHost");
const twoQubitsHost = document.getElementById("twoQubitsHost");
const entanglementHost = document.getElementById("entanglementHost");
const layoutEditToggle = document.getElementById("layoutEditToggle");
const layoutSaveButton = document.getElementById("layoutSaveButton");
const layoutResetButton = document.getElementById("layoutResetButton");

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
const MACHINE_DURATION_100_MS = 1000;
const MACHINE_DURATION_1000_MS = 2000;
const GATE_TUBE_DWELL_MS = 1000;
const GATE_PLATFORM_EXTEND_MS = 1000;
const GATE_PLATFORM_RETRACT_MS = 1000;
const ONE_QUBIT_MEASUREMENT_TOOL_SHIFT_Y = 45;
const TWO_QUBIT_WIDE_LENS_VISUAL_CENTER_OFFSET_Y = -34;
const TWO_QUBIT_INNER_BOX_EXTRA_BOTTOM_PX = 120;

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

const LAYOUT_EDIT_TARGET_SPECS = [
  { selector: ".qubit", resizable: true, uniform: true, minWidth: 28, minHeight: 28 },
  { selector: ".window-wrap.single-qubit-gate", resizable: true, minWidth: 180, minHeight: 80 },
  { selector: ".ent-double-gate", resizable: true, minWidth: 180, minHeight: 120 },
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
    return host;
  }
  host.innerHTML = "";
  const fragment = pairMeasurementToolTemplate.content.cloneNode(true);
  host.appendChild(fragment);
  return host;
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
    x: parseLayoutNumeric(shell.dataset[keys.x], 0),
    y: parseLayoutNumeric(shell.dataset[keys.y], 0),
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
  const pairShells = Array.from(document.querySelectorAll('[data-role="pair-shell"]'));
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
  const pairShells = Array.from(document.querySelectorAll('[data-role="pair-shell"]'));
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
  const pairShells = Array.from(document.querySelectorAll('[data-role="pair-shell"]'));
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

  const pairShells = Array.from(document.querySelectorAll('[data-role="pair-shell"]'));
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

  const pairShells = Array.from(document.querySelectorAll('[data-role="pair-shell"]'));
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

  const pairShells = Array.from(document.querySelectorAll('[data-role="pair-shell"]'));
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
  const pairShell = document.querySelector('[data-role="pair-shell"]');
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
  // Pair qubits are used for lens/ejection hotspot calibration. Their generic
  // element position must not be persisted, otherwise startup placement drifts.
  if (element.matches('[data-role="pair-qubit-a"], [data-role="pair-qubit-b"]')) {
    return false;
  }
  return true;
}

function saveLayoutEdits() {
  const existingPayload = readSavedLayoutPayload();
  const payload = {};
  collectLayoutTargets().forEach((element) => {
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
  Array.from(document.querySelectorAll('[data-role="pair-shell"]')).forEach((shell) => {
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
  try {
    window.localStorage.setItem(LAYOUT_STORAGE_KEY, JSON.stringify(payload));
    return true;
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

  applyTwoQubitLensOffsetsFromSavedPayload(payload.__pairLensOffsets);
  applyTwoQubitEjectionOffsetsFromSavedPayload(payload.__pairEjectionOffsets);
  applyTwoQubitEjectionAbsoluteFromSavedPayload(payload.__pairEjectionAbsolute);
  if (payload.__pairManualAlignment && typeof payload.__pairManualAlignment === "object") {
    Array.from(document.querySelectorAll('[data-role="pair-shell"]')).forEach((shell) => {
      const shellKey = deriveLayoutKey(shell);
      setPairMeasurementManualAlignment(shell, Boolean(payload.__pairManualAlignment[shellKey]));
    });
  }
  collectLayoutTargets().forEach((element) => {
    const key = deriveLayoutKey(element);
    const saved = payload[key];
    if (!saved) {
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
    if (element.dataset.layoutResizable === "true") {
      element.style.width = "";
      element.style.height = "";
    }
    setLayoutManualEdited(element, false);
  });
  Array.from(document.querySelectorAll('[data-role="pair-shell"]')).forEach((shell) => {
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

  const initialTranslate = layoutTargetTranslate(element);
  const rect = element.getBoundingClientRect();
  layoutEditorState.activeGesture = {
    element,
    mode: isResizeHandle && canResize ? "resize" : "move",
    startX: pointer.clientX,
    startY: pointer.clientY,
    startTx: initialTranslate.x,
    startTy: initialTranslate.y,
    startWidth: rect.width,
    startHeight: rect.height,
    uniformResize: element.dataset.layoutUniformResize === "true",
    minWidth: parseLayoutNumeric(element.dataset.layoutMinWidth, 24),
    minHeight: parseLayoutNumeric(element.dataset.layoutMinHeight, 24),
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
    setLayoutManualEdited(gesture.element, true);
  } else {
    setLayoutTargetTranslate(gesture.element, gesture.startTx + dx, gesture.startTy + dy);
    setLayoutManualEdited(gesture.element, true);
    if (gesture.element.classList.contains("pair-measurement")) {
      const pairShell = gesture.element.closest('[data-role="pair-shell"]');
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
    if (wasEnabled) {
      collectLayoutTargets().forEach((element) => {
        bakeLayoutTranslateIntoBasePosition(element);
      });
      captureTwoQubitLensOffsetsFromDom();
      captureTwoQubitEjectionOffsetsFromDom();
      refreshVisibleSimulators();
    }
  }
  if (layoutSaveButton) {
    layoutSaveButton.disabled = !layoutEditorState.enabled;
  }
  if (layoutResetButton) {
    layoutResetButton.disabled = !layoutEditorState.enabled;
  }
  setLayoutSaveButtonSavedState(false);
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
    return;
  }
  event.preventDefault();
  event.stopImmediatePropagation();
}

window.addEventListener("mousemove", continueLayoutGesture, { passive: false });
window.addEventListener("mousedown", captureLayoutEditStart, true);
window.addEventListener(
  "touchmove",
  (event) => continueLayoutGesture(event),
  { passive: false }
);
window.addEventListener(
  "touchstart",
  (event) => captureLayoutEditStart(event),
  { capture: true, passive: false }
);
window.addEventListener("mouseup", endLayoutGesture);
window.addEventListener("touchend", endLayoutGesture);
window.addEventListener("touchcancel", endLayoutGesture);
window.addEventListener("click", captureLayoutEditClick, true);

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
    const basisTolerance = 1e-9;
    const isBlueBasis = Math.abs(qubitBlueWeight - 1) <= basisTolerance && qubitRedWeight <= basisTolerance;
    const isRedBasis = Math.abs(qubitRedWeight - 1) <= basisTolerance && qubitBlueWeight <= basisTolerance;
    if (isBlueBasis || isRedBasis) {
      delete qubit.dataset.phaseSign;
      return;
    }

    const [, canonicalB] = canonicalizeRealAmplitudeVector(qubitVector);
    if (canonicalB < -basisTolerance) {
      qubit.dataset.phaseSign = "−";
      return;
    }
    if (canonicalB > basisTolerance) {
      qubit.dataset.phaseSign = "+";
      return;
    }
    delete qubit.dataset.phaseSign;
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

  const qubits = [
    {
      key: "a",
      element: qubitA,
      gateIndex: 0,
      blue: 1,
      red: 0,
      docked: false,
      dragging: false,
      dragOffsetX: 0,
      dragOffsetY: 0,
      lensSlot: null,
      gateIngestTimer: null,
      gateTransitInProgress: false,
    },
    {
      key: "b",
      element: qubitB,
      gateIndex: 1,
      blue: 1,
      red: 0,
      docked: false,
      dragging: false,
      dragOffsetX: 0,
      dragOffsetY: 0,
      lensSlot: null,
      gateIngestTimer: null,
      gateTransitInProgress: false,
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
      x: parseLayoutNumeric(pairShell.dataset[keys.x], 0),
      y: parseLayoutNumeric(pairShell.dataset[keys.y], 0),
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

  function applyGateStateToQubit(qubit, selectionIndex) {
    const [blueWeight, redWeight] = gateWeightsForSelection(selectionIndex);
    qubit.blue = blueWeight;
    qubit.red = redWeight;
    qubit.element.style.setProperty("--qubit-fill", blendBlueRed(qubit.blue, qubit.red));
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
      return false;
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
      qubit.element.style.setProperty("--qubit-fill", blendBlueRed(1, 0));
      return "b";
    }
    qubit.blue = 0;
    qubit.red = 1;
    qubit.element.style.setProperty("--qubit-fill", blendBlueRed(0, 1));
    return "r";
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
    qubit.element.classList.remove("dragging");
    qubit.element.classList.remove("migrating");
    qubit.element.classList.remove("melting");
    qubit.element.classList.remove("docked");
    qubit.element.classList.remove("measurement-pellet");
    delete qubit.element.dataset.pairEjected;
    qubit.blue = 1;
    qubit.red = 0;
    qubit.element.style.setProperty("--qubit-fill", blendBlueRed(1, 0));
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

      tubeCountState[outcomeKey] += 2;
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
      const topResult = collapseQubitState(topQubit);
      const bottomResult = collapseQubitState(bottomQubit);
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

  async function runAutomatedPairMeasurements(iterations) {
    if (autoRunInProgress || measurementInProgress) {
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
          qubits.forEach((qubit, idx) => {
            const [blueWeight, redWeight] = gateWeightsForSelection(gates[idx].activeTick);
            qubit.blue = blueWeight;
            qubit.red = redWeight;
            qubit.element.style.setProperty("--qubit-fill", blendBlueRed(qubit.blue, qubit.red));
          });
          const outcomeKey = pairTubeOutcomeKey(collapseQubitState(qubits[0]), collapseQubitState(qubits[1]));
          tubeCountState[outcomeKey] += 2;
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
        const gateCenters = gates.map((gate) => stagePointForElementCenter(gate.window));
        await Promise.all([
          moveQubitToPoint(qubits[0], gateCenters[0].x, gateCenters[0].y, travelDuration),
          moveQubitToPoint(qubits[1], gateCenters[1].x, gateCenters[1].y, travelDuration),
        ]);
        if (thisRunToken !== runToken) {
          break;
        }

        maybeSnapQubitToGate(qubits[0], { allowWindowOverlap: true, runTransit: false });
        maybeSnapQubitToGate(qubits[1], { allowWindowOverlap: true, runTransit: false });
        await wait(gatePauseDuration);
        if (thisRunToken !== runToken) {
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
    pairMeasurementCount.disabled = false;
    pairMeasurementCount.value = "1";
    setLightningActive(false);
    setPairMeasurementPlatformExtended(false);

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
  const entResetButton = root.querySelector('[data-role="ent-reset"]');
  const measurementHost = root.querySelector('[data-role="ent-measurement-host"]');
  mountPairMeasurementTool(measurementHost);
  const shell = root.querySelector('[data-role="ent-shell"]');
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
  const cnotVisualFunnel = root.querySelector(".ent-cnot-funnel");
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
    !cnotVisualFunnel ||
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
    const clampedX = Math.min(Math.max(x, radius), shellRect.width - radius);
    const clampedY = Math.min(Math.max(y, radius), shellRect.height - radius);
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
    return qubit.key === "top" ? "left" : "right";
  }

  function getMeasurementSlotCenter(slot) {
    const slotElement = slot === "left" ? measurementSlotTop : measurementSlotBottom;
    return stagePointForElementCenter(slotElement);
  }

  function placeQubitAtStart(qubit) {
    const funnelCenter = stagePointForElementCenter(qubit.preGate.funnel);
    const qubitRect = qubit.element.getBoundingClientRect();
    const radius = qubitRect.width / 2;
    const x = radius + QUBIT_START_EDGE_GAP;
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

  function alignMeasurementToolCenterWithCnot() {
    const cnotCenterY = stagePointForElementCenter(pipe).y;
    const toolCenterOffset = measurementTool.offsetTop + measurementTool.offsetHeight / 2;
    measurementBlock.style.top = `${cnotCenterY - toolCenterOffset}px`;
  }

  function alignCnotCenterBetweenPreGates() {
    const topCenter = stagePointForElementCenter(qubits[0].preGate.pipe).y;
    const bottomCenter = stagePointForElementCenter(qubits[1].preGate.pipe).y;
    pipe.style.top = `${(topCenter + bottomCenter) / 2}px`;
  }

  function alignHorizontalFlow() {
    const CNOT_FUNNEL_SHIFT_PX = -10;
    const CNOT_GATE_SHIFT_PX = 100;
    const MEASUREMENT_TOOL_SHIFT_PX = 40;
    const qubitRect = qubits[0].element.getBoundingClientRect();
    const qubitRadius = qubitRect.width / 2;
    const preEjectMaxX = Math.max(
      ...qubits.map((qubit) => springTipX(qubit.preGate.spring, qubit.preGate.flange) + 6 + qubitRadius)
    );

    const shellRect = shell.getBoundingClientRect();
    const pipeRect = pipe.getBoundingClientRect();
    const cnotFunnelRect = cnotVisualFunnel.getBoundingClientRect();
    const cnotFunnelOffset = cnotFunnelRect.left - pipeRect.left;
    const desiredCnotFunnelLeft = preEjectMaxX + 26 + CNOT_FUNNEL_SHIFT_PX + CNOT_GATE_SHIFT_PX;
    const desiredPipeLeft = desiredCnotFunnelLeft - cnotFunnelOffset;
    pipe.style.left = `${Math.round(desiredPipeLeft)}px`;

    const cnotEjectX = cnotSpringTipX() + 6 + qubitRadius;
    const blockRect = measurementBlock.getBoundingClientRect();
    const toolRect = measurementTool.getBoundingClientRect();
    const measurementFunnelRect = measurementFunnel.getBoundingClientRect();
    const toolOffset = toolRect.left - blockRect.left;
    const funnelOffset = measurementFunnelRect.left - toolRect.left;
    const desiredMeasurementFunnelLeft = cnotEjectX + 42 + MEASUREMENT_TOOL_SHIFT_PX;
    const desiredMeasurementBlockLeft = desiredMeasurementFunnelLeft - (toolOffset + funnelOffset);
    measurementBlock.style.left = `${Math.round(desiredMeasurementBlockLeft)}px`;

    // Ensure the measurement block stays inside the shell on very narrow render widths.
    const minLeft = shellRect.width * 0.45;
    const numericLeft = Number.parseFloat(measurementBlock.style.left) || desiredMeasurementBlockLeft;
    if (numericLeft < minLeft) {
      measurementBlock.style.left = `${Math.round(minLeft)}px`;
    }
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

      tubeCountState[outcomeKey] += 2;
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
      const topQubit = measurementSlotOccupants.left;
      const bottomQubit = measurementSlotOccupants.right;
      topQubit.element.classList.add("collapse-animating");
      bottomQubit.element.classList.add("collapse-animating");

      const topResult = collapseQubitState(topQubit);
      const bottomResult = collapseQubitState(bottomQubit);

      await wait(OBSERVABLE_COLLAPSE_PAUSE_MS);
      topQubit.element.classList.remove("collapse-animating");
      bottomQubit.element.classList.remove("collapse-animating");
      if (expectedRunToken !== runToken) {
        return;
      }

      const qubitWidth = topQubit.element.getBoundingClientRect().width;
      const ejectionCenterX = measurementSpringTipX() + 6 + qubitWidth / 2;
      const topSlotCenter = getMeasurementSlotCenter("left");
      const bottomSlotCenter = getMeasurementSlotCenter("right");
      const topEjectedPoint = { x: ejectionCenterX, y: topSlotCenter.y };
      const bottomEjectedPoint = { x: ejectionCenterX, y: bottomSlotCenter.y };

      setMeasurementPlatformExtended(true);
      await Promise.all([
        moveQubitToPoint(topQubit, topEjectedPoint.x, topEjectedPoint.y, migrationDuration),
        moveQubitToPoint(bottomQubit, bottomEjectedPoint.x, bottomEjectedPoint.y, migrationDuration),
      ]);
      setMeasurementPlatformExtended(false);
      if (expectedRunToken !== runToken) {
        return;
      }

      settleQubitVisualState(topQubit);
      settleQubitVisualState(bottomQubit);
      setQubitCenter(topQubit, topEjectedPoint.x, topEjectedPoint.y);
      setQubitCenter(bottomQubit, bottomEjectedPoint.x, bottomEjectedPoint.y);
      topQubit.inCnotWindow = false;
      bottomQubit.inCnotWindow = false;
      topQubit.cnotIngesting = false;
      bottomQubit.cnotIngesting = false;
      clearMeasurementSlotForQubit(topQubit);
      clearMeasurementSlotForQubit(bottomQubit);

      const outcomeKey = pairTubeOutcomeKey(topResult, bottomResult);
      await animateMeasurementPayloadsToTube(
        outcomeKey,
        topResult,
        bottomResult,
        topEjectedPoint,
        bottomEjectedPoint,
        expectedRunToken,
        { migrationDuration, meltDuration }
      );
    } finally {
      setMeasurementPlatformExtended(false);
      qubits.forEach((qubit) => {
        qubit.element.classList.remove("collapse-animating");
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
          applyCnotGateToQubits();
          const outcomeKey = pairTubeOutcomeKey(collapseQubitState(qubits[0]), collapseQubitState(qubits[1]));
          tubeCountState[outcomeKey] += 2;
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

        applyCnotGateToQubits();
        await wait(gatePauseDuration);
        if (thisRunToken !== runToken) {
          break;
        }

        const leftSlot = getMeasurementSlotCenter("left");
        const rightSlot = getMeasurementSlotCenter("right");
        await Promise.all([
          moveQubitToPoint(qubits[0], leftSlot.x, leftSlot.y, travelDuration),
          moveQubitToPoint(qubits[1], rightSlot.x, rightSlot.y, travelDuration),
        ]);
        if (thisRunToken !== runToken) {
          break;
        }

        clearMeasurementSlotForQubit(qubits[0]);
        clearMeasurementSlotForQubit(qubits[1]);
        measurementSlotOccupants.left = qubits[0];
        measurementSlotOccupants.right = qubits[1];
        qubits[0].measurementSlot = "left";
        qubits[1].measurementSlot = "right";
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

  async function runCnotCycle(expectedRunToken = runToken) {
    if (cnotBusy || measurementInProgress || autoRunInProgress || !allQubitsInCnotWindow()) {
      return;
    }

    cnotBusy = true;
    qubits.forEach((qubit) => {
      qubit.locked = true;
    });
    try {
      await wait(GATE_TUBE_DWELL_MS);
      if (expectedRunToken !== runToken) {
        return;
      }

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
    await moveQubitToPoint(qubit, slotCenter.x, slotCenter.y, Math.max(220, Math.round(AUTO_TRAVEL_MS * 0.45)));
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
    const iterations = Number(measurementCount.value) || 1;
    runAutomatedEntanglementMeasurements(Math.max(1, iterations));
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

const oneQubitRoot = mountOneQubitSimulator();
const oneQubitSimulator = oneQubitRoot ? setupSimulator(oneQubitRoot) : null;
const pairRoot = mountTwoQubitPair();
const twoQubitPairSimulator = pairRoot ? setupTwoQubitPair(pairRoot) : null;
const entanglementRoot = mountEntanglementGate(entanglementHost);
const entanglementSimulator = entanglementRoot ? setupEntanglementGate(entanglementRoot) : null;
const simulators = [
  oneQubitSimulator,
  twoQubitPairSimulator,
  entanglementSimulator,
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
}

function setActiveTab(tabTarget) {
  if (!tabButtons.length || !tabPanels.length) {
    return;
  }

  clearQubitSelection();

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
  });

  window.requestAnimationFrame(() => {
    refreshVisibleSimulators();
  });
}

tabButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const target = button.dataset.tabTarget;
    if (!target) {
      return;
    }
    setActiveTab(target);
  });
});

window.addEventListener("resize", () => {
  refreshVisibleSimulators();
});

setActiveTab("one-qubit");

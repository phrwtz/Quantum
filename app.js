const tabButtons = Array.from(document.querySelectorAll(".tab-btn"));
const tabPanels = Array.from(document.querySelectorAll(".tab-panel"));
const simulatorTemplate = document.getElementById("simulatorTemplate");
const twoQubitPairTemplate = document.getElementById("twoQubitPairTemplate");
const oneQubitHost = document.getElementById("oneQubitHost");
const twoQubitsHost = document.getElementById("twoQubitsHost");

const STEP_DEG = 30;
const SNAP_OVERLAP_THRESHOLD = 0.9;
const QUBIT_START_EDGE_GAP = 20;
const TWO_QUBIT_START_SHIFT_PX = 50;
const ARROW_SCALE = 1.27;
const BLUE_RGB = [38, 111, 247];
const RED_RGB = [225, 54, 56];
const INITIAL_TUBE_QUBIT_CAPACITY = 5;
const AUTO_GATE_PAUSE_MS = 333;
const AUTO_TRAVEL_MS = 620;
const AUTO_MELT_MS = 320;
const MACHINE_DURATION_100_MS = 1000;
const MACHINE_DURATION_1000_MS = 2000;

const BLUE_RED_MIX_BY_TICK = {
  0: [1, 0],
  1: [5 / 6, 1 / 6],
  2: [2 / 3, 1 / 3],
  3: [1 / 2, 1 / 2],
  4: [1 / 3, 2 / 3],
  5: [1 / 6, 5 / 6],
  6: [0, 1],
  7: [1 / 6, 5 / 6],
  8: [1 / 3, 2 / 3],
  9: [1 / 2, 1 / 2],
  10: [2 / 3, 1 / 3],
  11: [5 / 6, 1 / 6],
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

function getPointer(event) {
  if (event.touches && event.touches.length > 0) {
    return event.touches[0];
  }

  if (event.changedTouches && event.changedTouches.length > 0) {
    return event.changedTouches[0];
  }

  return event;
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

function setupSimulator(root) {
  const ticksWrap = root.querySelector('[data-role="ticks"]');
  const arrowGroup = root.querySelector('[data-role="arrow-group"]');
  const windowWrap = root.querySelector('[data-role="window-wrap"]');
  const gateWindow = root.querySelector('[data-role="window"]');
  const gateStage = root.querySelector('[data-role="gate-stage"]');
  const machineShell = root.querySelector('[data-role="machine-shell"]');
  const topControls = root.querySelector('[data-role="top-controls"]');
  const qubit = root.querySelector('[data-role="qubit"]');
  const qubitSign = root.querySelector('[data-role="qubit-sign"]');
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

  if (
    !ticksWrap ||
    !arrowGroup ||
    !windowWrap ||
    !gateWindow ||
    !gateStage ||
    !machineShell ||
    !topControls ||
    !qubit ||
    !qubitSign ||
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

  let activeTick = 0;
  let arrowDragging = false;
  let arrowDragStartTick = 0;
  let arrowDragCenter = null;
  let arrowDragAngleDeg = null;
  let qubitDragging = false;
  let qubitDocked = false;
  let qubitDragOffsetX = 0;
  let qubitDragOffsetY = 0;
  let qubitInitialized = false;
  let measurementInProgress = false;
  let autoRunInProgress = false;
  let runToken = 0;
  let qubitBlueWeight = 1;
  let qubitRedWeight = 0;
  let qubitHasEnteredGate = false;
  let tubeQubitCapacity = INITIAL_TUBE_QUBIT_CAPACITY;
  let blueTubeCount = 0;
  let redTubeCount = 0;

  const tickElements = [];

  for (let i = 0; i < 12; i += 1) {
    const tick = document.createElement("button");
    tick.type = "button";
    tick.className = "tick";
    tick.setAttribute("aria-label", `Tick ${i + 1}`);
    tick.addEventListener("click", () => setArrowAtTick(i));
    ticksWrap.appendChild(tick);
    tickElements.push(tick);
  }

  function updateStateText(blueWeight, redWeight) {
    if (!messageBox) {
      return;
    }
    messageBox.value = `${formatFraction(blueWeight)} blue, ${formatFraction(redWeight)} red`;
  }

  function applyQubitColorForTick() {
    if (!qubitDocked) {
      return;
    }

    const mix = BLUE_RED_MIX_BY_TICK[activeTick] || BLUE_RED_MIX_BY_TICK[0];
    const [blueWeight, redWeight] = mix;
    qubitBlueWeight = blueWeight;
    qubitRedWeight = redWeight;
    qubit.style.setProperty("--qubit-fill", blendBlueRed(blueWeight, redWeight));
  }

  function updateQubitSignForTick() {
    if (!qubitHasEnteredGate) {
      qubitSign.textContent = "";
      return;
    }

    if (activeTick >= 1 && activeTick <= 5) {
      qubitSign.textContent = "+";
      return;
    }

    if (activeTick >= 7 && activeTick <= 11) {
      qubitSign.textContent = "\u2212";
      return;
    }

    qubitSign.textContent = "";
  }

  function updateQubitSignSize() {
    const qubitRect = qubit.getBoundingClientRect();
    if (!qubitRect.width) {
      return;
    }

    const signSize = Math.max(12, Math.round(qubitRect.width - 40));
    qubitSign.style.fontSize = `${signSize}px`;
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

  function layoutTicks() {
    const rect = windowWrap.getBoundingClientRect();
    const size = rect.width;
    if (!size) {
      return;
    }

    const center = size / 2;
    const orbit = center + 11;

    tickElements.forEach((tick, index) => {
      const angleDeg = index * STEP_DEG;
      const angleRad = (angleDeg * Math.PI) / 180;
      const x = center + Math.sin(angleRad) * orbit;
      const y = center - Math.cos(angleRad) * orbit;

      tick.style.left = `${(x / size) * 100}%`;
      tick.style.top = `${(y / size) * 100}%`;
      tick.style.setProperty("--rotation", `${angleDeg}deg`);
    });
  }

  function clearMeasurementApparatus() {
    tubeQubitCapacity = INITIAL_TUBE_QUBIT_CAPACITY;
    blueTubeCount = 0;
    redTubeCount = 0;
    updateTubeCapacityText();
    updateTubeFills();
  }

  function setArrowAtTick(tickIndex, { deferMeasurementClear = false } = {}) {
    if (autoRunInProgress) {
      return;
    }

    const normalizedTick = ((tickIndex % 12) + 12) % 12;
    const gateStateChanged = normalizedTick !== activeTick;
    activeTick = normalizedTick;
    const rotation = activeTick * STEP_DEG;
    arrowGroup.style.transform = `rotate(${rotation}deg) scale(${ARROW_SCALE})`;

    tickElements.forEach((tick, index) => {
      tick.classList.toggle("active", index === activeTick);
    });

    if (gateStateChanged && !deferMeasurementClear) {
      clearMeasurementApparatus();
    }

    const [blueWeight, redWeight] = BLUE_RED_MIX_BY_TICK[activeTick] || BLUE_RED_MIX_BY_TICK[0];
    updateStateText(blueWeight, redWeight);
    if (qubitDocked) {
      updateQubitSignForTick();
    }
    applyQubitColorForTick();
  }

  function nearestTickFromPointer(clientX, clientY, center = null) {
    const fallbackRect = center ? null : windowWrap.getBoundingClientRect();
    const cx = center ? center.x : fallbackRect.left + fallbackRect.width / 2;
    const cy = center ? center.y : fallbackRect.top + fallbackRect.height / 2;
    const normalized = normalizedAngleFromTopDegrees(clientX, clientY, cx, cy);
    return Math.round(normalized / STEP_DEG) % 12;
  }

  function beginArrowDrag(event) {
    event.preventDefault();
    arrowDragging = true;
    arrowGroup.classList.add("dragging");
    arrowDragStartTick = activeTick;
    const rect = windowWrap.getBoundingClientRect();
    arrowDragCenter = {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    };

    const point = getPointer(event);
    arrowDragAngleDeg = normalizedAngleFromTopDegrees(
      point.clientX,
      point.clientY,
      arrowDragCenter.x,
      arrowDragCenter.y
    );
    arrowGroup.style.transform = `rotate(${arrowDragAngleDeg}deg) scale(${ARROW_SCALE})`;
  }

  function continueArrowDrag(event) {
    if (!arrowDragging) {
      return;
    }

    if (event.touches) {
      event.preventDefault();
    }

    const point = getPointer(event);
    arrowDragAngleDeg = normalizedAngleFromTopDegrees(
      point.clientX,
      point.clientY,
      arrowDragCenter.x,
      arrowDragCenter.y
    );
    arrowGroup.style.transform = `rotate(${arrowDragAngleDeg}deg) scale(${ARROW_SCALE})`;
  }

  function endArrowDrag() {
    if (!arrowDragging) {
      return;
    }

    const snappedTick =
      arrowDragAngleDeg === null ? activeTick : Math.round(arrowDragAngleDeg / STEP_DEG) % 12;
    setArrowAtTick(snappedTick, { deferMeasurementClear: true });

    if (snappedTick !== arrowDragStartTick) {
      clearMeasurementApparatus();
    }

    arrowDragging = false;
    arrowDragCenter = null;
    arrowDragAngleDeg = null;
    arrowGroup.classList.remove("dragging");
  }

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
    qubitHasEnteredGate = true;
    qubit.classList.add("docked");
    updateQubitSignForTick();
    applyQubitColorForTick();
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

  function qubitOverlapRatioWithGateWindow() {
    const qubitRect = qubit.getBoundingClientRect();
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

  function qubitOverlapRatioWithLens() {
    const qubitRect = qubit.getBoundingClientRect();
    const lensRect = measureLens.getBoundingClientRect();

    const qRadius = qubitRect.width / 2;
    const lRadius = lensRect.width / 2;

    const qCx = qubitRect.left + qRadius;
    const qCy = qubitRect.top + qRadius;
    const lCx = lensRect.left + lRadius;
    const lCy = lensRect.top + lRadius;

    const distance = Math.hypot(qCx - lCx, qCy - lCy);
    const overlapArea = circleIntersectionArea(qRadius, lRadius, distance);
    const qubitArea = Math.PI * qRadius * qRadius;

    return overlapArea / qubitArea;
  }

  function maybeSnapQubit() {
    if (qubitOverlapRatioWithGateWindow() >= SNAP_OVERLAP_THRESHOLD) {
      snapQubitToWindowCenter();
      return true;
    }

    undockQubit();
    return false;
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

  function wait(duration) {
    return new Promise((resolve) => window.setTimeout(resolve, duration));
  }

  function nextFrame() {
    return new Promise((resolve) => window.requestAnimationFrame(() => resolve()));
  }

  function settleQubitVisualState() {
    qubit.classList.remove("migrating");
    qubit.classList.remove("melting");
    qubit.style.opacity = "";
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
    const lensCenter = getElementCenterInMachineCoords(measureLens);

    positionLightningBolt(boltToGate, origin, gateCenter);
    positionLightningBolt(boltToLens, gateCenter, lensCenter);
  }

  function setLightningActive(active) {
    boltToGate.classList.toggle("active", active);
    boltToLens.classList.toggle("active", active);
  }

  function collapseQubitState() {
    const totalWeight = qubitBlueWeight + qubitRedWeight;
    const blueProbability = totalWeight > 0 ? qubitBlueWeight / totalWeight : 0.5;

    if (blueProbability >= 1) {
      qubitBlueWeight = 1;
      qubitRedWeight = 0;
      qubit.style.setProperty("--qubit-fill", blendBlueRed(1, 0));
      updateStateText(qubitBlueWeight, qubitRedWeight);
      return "blue";
    }

    if (blueProbability <= 0) {
      qubitBlueWeight = 0;
      qubitRedWeight = 1;
      qubit.style.setProperty("--qubit-fill", blendBlueRed(0, 1));
      updateStateText(qubitBlueWeight, qubitRedWeight);
      return "red";
    }

    const collapseToBlue = Math.random() < blueProbability;

    if (collapseToBlue) {
      qubitBlueWeight = 1;
      qubitRedWeight = 0;
      qubit.style.setProperty("--qubit-fill", blendBlueRed(1, 0));
      updateStateText(qubitBlueWeight, qubitRedWeight);
      return "blue";
    }

    qubitBlueWeight = 0;
    qubitRedWeight = 1;
    qubit.style.setProperty("--qubit-fill", blendBlueRed(0, 1));
    updateStateText(qubitBlueWeight, qubitRedWeight);
    return "red";
  }

  async function startMeasurementSequence(
    expectedRunToken = runToken,
    { migrationDuration = AUTO_TRAVEL_MS, meltDuration = AUTO_MELT_MS } = {}
  ) {
    if (measurementInProgress) {
      return;
    }

    if (expectedRunToken !== runToken) {
      return;
    }

    if (qubitOverlapRatioWithLens() < SNAP_OVERLAP_THRESHOLD) {
      return;
    }

    measurementInProgress = true;
    qubitDragging = false;
    qubit.classList.remove("dragging");
    undockQubit();

    const collapsedColor = collapseQubitState();
    const targetTube = collapsedColor === "blue" ? tubeBlue : tubeRed;
    const targetRect = targetTube.getBoundingClientRect();
    const targetPoint = getStageCoordsFromViewportPoint(
      targetRect.left + targetRect.width / 2,
      targetRect.top + targetRect.height * 0.22
    );

    await moveQubitToStagePoint(targetPoint.x, targetPoint.y, migrationDuration);
    if (expectedRunToken !== runToken) {
      measurementInProgress = false;
      return;
    }

    qubit.style.setProperty("--melt-duration", `${meltDuration}ms`);
    qubit.classList.add("melting");
    await wait(meltDuration);
    if (expectedRunToken !== runToken) {
      measurementInProgress = false;
      return;
    }

    if (collapsedColor === "blue") {
      blueTubeCount += 1;
    } else {
      redTubeCount += 1;
    }

    maybeExpandTubeCapacity();
    updateTubeFills();
    settleQubitVisualState();
    placeQubitToLeftOfWindow();
    measurementInProgress = false;
  }

  async function runAutomatedMeasurements(iterations) {
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
    measurementCount.disabled = true;
    qubitDragging = false;
    qubit.classList.remove("dragging");

    try {
      if (useMachineMode) {
        placeQubitToLeftOfWindow();
        positionLightningBolts();
        setLightningActive(true);

        const processOneMeasurement = () => {
          const mix = BLUE_RED_MIX_BY_TICK[activeTick] || BLUE_RED_MIX_BY_TICK[0];
          qubitBlueWeight = mix[0];
          qubitRedWeight = mix[1];
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
        const gateCenter = stagePointForElementCenter(gateWindow);
        await moveQubitToStagePoint(gateCenter.x, gateCenter.y, travelDuration);
        if (thisRunToken !== runToken) {
          break;
        }

        snapQubitToWindowCenter();
        await wait(gatePauseDuration);
        if (thisRunToken !== runToken) {
          break;
        }

        const lensRect = measureLens.getBoundingClientRect();
        const lensCenter = getStageCoordsFromViewportPoint(
          lensRect.left + lensRect.width / 2,
          lensRect.top + lensRect.height / 2
        );

        await moveQubitToStagePoint(lensCenter.x, lensCenter.y, travelDuration);
        if (thisRunToken !== runToken) {
          break;
        }

        await startMeasurementSequence(thisRunToken, {
          migrationDuration: travelDuration,
          meltDuration,
        });
      }
    } finally {
      setLightningActive(false);
      autoRunInProgress = false;
      measurementCount.disabled = false;
    }
  }

  function beginQubitDrag(event) {
    if (measurementInProgress || autoRunInProgress) {
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
    if (!qubitDragging || measurementInProgress || autoRunInProgress) {
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
    maybeSnapQubit();
    startMeasurementSequence();
  }

  function endQubitDrag() {
    if (!qubitDragging || measurementInProgress || autoRunInProgress) {
      return;
    }

    qubitDragging = false;
    qubit.classList.remove("dragging");

    maybeSnapQubit();
    startMeasurementSequence();
  }

  function placeQubitToLeftOfWindow() {
    const windowCenter = stagePointForElementCenter(gateWindow);
    const stageRect = gateStage.getBoundingClientRect();
    const movementRect = machineShell.getBoundingClientRect();
    const qubitRect = qubit.getBoundingClientRect();

    const radius = qubitRect.width / 2;
    const minX = movementRect.left - stageRect.left + radius;
    const x = minX + QUBIT_START_EDGE_GAP;

    setQubitCenter(x, windowCenter.y);
    qubitDocked = false;
    qubitDragging = false;
    qubit.classList.remove("dragging");
    qubit.classList.remove("migrating");
    qubit.classList.remove("melting");
    qubit.classList.remove("docked");
    qubit.style.setProperty("--qubit-fill", blendBlueRed(1, 0));
    qubitBlueWeight = 1;
    qubitRedWeight = 0;
    updateStateText(qubitBlueWeight, qubitRedWeight);
  }

  function handleResize() {
    const stageRect = gateStage.getBoundingClientRect();
    if (!stageRect.width || !stageRect.height) {
      return;
    }

    layoutTicks();
    updateQubitSignSize();
    positionTubeCapacityBox();
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
    if (autoRunInProgress || measurementInProgress) {
      return;
    }

    const iterations = Number(measurementCount.value) || 1;
    runAutomatedMeasurements(Math.max(1, iterations));
  }

  function resetAll() {
    runToken += 1;
    autoRunInProgress = false;
    measurementInProgress = false;
    qubitDragging = false;
    measurementCount.disabled = false;
    measurementCount.value = "1";
    qubit.classList.remove("dragging");
    qubit.classList.remove("migrating");
    qubit.classList.remove("melting");
    qubit.classList.remove("docked");
    setLightningActive(false);
    qubitHasEnteredGate = false;
    qubitSign.textContent = "";

    tubeQubitCapacity = INITIAL_TUBE_QUBIT_CAPACITY;
    blueTubeCount = 0;
    redTubeCount = 0;
    updateTubeCapacityText();
    updateTubeFills();

    setArrowAtTick(0);
    placeQubitToLeftOfWindow();
  }

  arrowGroup.addEventListener("mousedown", beginArrowDrag);
  arrowGroup.addEventListener("touchstart", beginArrowDrag, { passive: false });
  qubit.addEventListener("mousedown", beginQubitDrag);
  qubit.addEventListener("touchstart", beginQubitDrag, { passive: false });

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

  arrowGroup.addEventListener("keydown", (event) => {
    if (autoRunInProgress) {
      return;
    }

    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      event.preventDefault();
      setArrowAtTick(activeTick + 1);
    }

    if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      event.preventDefault();
      setArrowAtTick(activeTick - 1);
    }
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
    handleLensClickRun();
  });

  measureLens.addEventListener("click", () => {
    handleLensClickRun();
  });

  resetButton.addEventListener("click", () => {
    resetAll();
  });

  setArrowAtTick(0);
  updateTubeCapacityText();
  updateTubeFills();

  return {
    handleResize,
  };
}

function setupTwoQubitPair(root) {
  const pairShell = root.querySelector('[data-role="pair-shell"]');
  const pairStageA = root.querySelector('[data-role="pair-stage-a"]');
  const pairStageB = root.querySelector('[data-role="pair-stage-b"]');
  const pairWindowA = root.querySelector('[data-role="pair-window-a"]');
  const pairWindowB = root.querySelector('[data-role="pair-window-b"]');
  const pairTicksA = root.querySelector('[data-role="pair-ticks-a"]');
  const pairTicksB = root.querySelector('[data-role="pair-ticks-b"]');
  const pairArrowA = root.querySelector('[data-role="pair-arrow-a"]');
  const pairArrowB = root.querySelector('[data-role="pair-arrow-b"]');
  const qubitA = root.querySelector('[data-role="pair-qubit-a"]');
  const qubitB = root.querySelector('[data-role="pair-qubit-b"]');
  const signA = root.querySelector('[data-role="pair-sign-a"]');
  const signB = root.querySelector('[data-role="pair-sign-b"]');
  const pairLens = root.querySelector('[data-role="pair-lens"]');
  const pairSlotLeft = root.querySelector('[data-role="pair-slot-left"]');
  const pairSlotRight = root.querySelector('[data-role="pair-slot-right"]');
  const pairMeasurementCount = root.querySelector('[data-role="pair-measurement-count"]');
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
    !pairShell ||
    !pairStageA ||
    !pairStageB ||
    !pairWindowA ||
    !pairWindowB ||
    !pairTicksA ||
    !pairTicksB ||
    !pairArrowA ||
    !pairArrowB ||
    !qubitA ||
    !qubitB ||
    !signA ||
    !signB ||
    !pairLens ||
    !pairSlotLeft ||
    !pairSlotRight ||
    !pairMeasurementCount ||
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

  const gates = [
    { stage: pairStageA, window: pairWindowA, ticksWrap: pairTicksA, arrow: pairArrowA, activeTick: 0, ticks: [] },
    { stage: pairStageB, window: pairWindowB, ticksWrap: pairTicksB, arrow: pairArrowB, activeTick: 0, ticks: [] },
  ];

  const qubits = [
    {
      key: "a",
      element: qubitA,
      sign: signA,
      gateIndex: 0,
      blue: 1,
      red: 0,
      docked: false,
      dragging: false,
      dragOffsetX: 0,
      dragOffsetY: 0,
      hasEnteredGate: false,
      lensSlot: null,
    },
    {
      key: "b",
      element: qubitB,
      sign: signB,
      gateIndex: 1,
      blue: 1,
      red: 0,
      docked: false,
      dragging: false,
      dragOffsetX: 0,
      dragOffsetY: 0,
      hasEnteredGate: false,
      lensSlot: null,
    },
  ];

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
  let arrowDraggingIndex = null;
  const arrowDragStartTickByGate = [0, 0];
  const arrowDragCenterByGate = [null, null];
  const arrowDragAngleByGate = [null, null];

  function tickSignForValue(tick) {
    if (tick >= 1 && tick <= 5) {
      return "+";
    }
    if (tick >= 7 && tick <= 11) {
      return "\u2212";
    }
    return "";
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
  }

  function getLensSlotCenter(slot) {
    const shellRect = pairShell.getBoundingClientRect();
    const lensRect = pairLens.getBoundingClientRect();
    const xRatio = slot === "left" ? 0.3 : 0.7;
    return {
      x: lensRect.left - shellRect.left + lensRect.width * xRatio,
      y: lensRect.top - shellRect.top + lensRect.height / 2,
    };
  }

  function updateQubitSignSize(qubit) {
    const rect = qubit.element.getBoundingClientRect();
    if (!rect.width) {
      return;
    }
    qubit.sign.style.fontSize = `${Math.max(12, Math.round(rect.width - 40))}px`;
  }

  function applyGateStateToQubit(qubit, tick) {
    const mix = BLUE_RED_MIX_BY_TICK[tick] || BLUE_RED_MIX_BY_TICK[0];
    qubit.blue = mix[0];
    qubit.red = mix[1];
    qubit.element.style.setProperty("--qubit-fill", blendBlueRed(qubit.blue, qubit.red));
    qubit.hasEnteredGate = true;
    qubit.sign.textContent = tickSignForValue(tick);
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

  function maybeSnapQubitToGate(qubit) {
    const gate = gates[qubit.gateIndex];
    if (overlapRatioWithGate(qubit, gate.window) >= SNAP_OVERLAP_THRESHOLD) {
      const center = stagePointForElementCenter(gate.window);
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

  function maybeSnapQubitToLens(qubit) {
    const lensRect = pairLens.getBoundingClientRect();
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

    const preferredSlot = qubitCx <= lensRect.left + lensRect.width / 2 ? "left" : "right";
    const fallbackSlot = preferredSlot === "left" ? "right" : "left";
    let chosenSlot = preferredSlot;
    if (slotOccupants[chosenSlot] && slotOccupants[chosenSlot] !== qubit) {
      if (!slotOccupants[fallbackSlot] || slotOccupants[fallbackSlot] === qubit) {
        chosenSlot = fallbackSlot;
      } else {
        return false;
      }
    }

    if (qubit.lensSlot && qubit.lensSlot !== chosenSlot && slotOccupants[qubit.lensSlot] === qubit) {
      slotOccupants[qubit.lensSlot] = null;
    }
    slotOccupants[chosenSlot] = qubit;
    qubit.lensSlot = chosenSlot;

    const slotCenter = getLensSlotCenter(chosenSlot);
    setQubitCenter(qubit, slotCenter.x, slotCenter.y);
    qubit.docked = false;
    qubit.element.classList.remove("docked");
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
    clearLensSlotForQubit(qubit);
    const gateWindow = gates[qubit.gateIndex].window;
    const center = stagePointForElementCenter(gateWindow);
    const rect = qubit.element.getBoundingClientRect();
    const x = rect.width / 2 + QUBIT_START_EDGE_GAP + TWO_QUBIT_START_SHIFT_PX;
    setQubitCenter(qubit, x, center.y);
    qubit.docked = false;
    qubit.dragging = false;
    qubit.element.classList.remove("dragging");
    qubit.element.classList.remove("migrating");
    qubit.element.classList.remove("melting");
    qubit.element.classList.remove("docked");
    qubit.blue = 1;
    qubit.red = 0;
    qubit.element.style.setProperty("--qubit-fill", blendBlueRed(1, 0));
    qubit.hasEnteredGate = false;
    qubit.sign.textContent = "";
  }

  function moveQubitToPoint(qubit, x, y, duration = AUTO_TRAVEL_MS) {
    return new Promise((resolve) => {
      qubit.element.style.setProperty("--move-duration", `${duration}ms`);
      qubit.element.classList.add("migrating");
      setQubitCenter(qubit, x, y);
      window.setTimeout(resolve, duration);
    });
  }

  function settleQubitVisualState(qubit) {
    qubit.element.classList.remove("migrating");
    qubit.element.classList.remove("melting");
    qubit.element.style.opacity = "";
  }

  function wait(duration) {
    return new Promise((resolve) => window.setTimeout(resolve, duration));
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

  function setGateArrowAtTick(gateIndex, tickIndex, { deferMeasurementClear = false } = {}) {
    if (autoRunInProgress) {
      return;
    }
    const gate = gates[gateIndex];
    const normalizedTick = ((tickIndex % 12) + 12) % 12;
    const changed = normalizedTick !== gate.activeTick;
    gate.activeTick = normalizedTick;
    gate.arrow.style.transform = `rotate(${normalizedTick * STEP_DEG}deg) scale(${ARROW_SCALE})`;
    gate.ticks.forEach((tick, idx) => {
      tick.classList.toggle("active", idx === normalizedTick);
    });

    if (changed && !deferMeasurementClear) {
      clearMeasurementApparatus();
    }

    const qubit = qubits[gateIndex];
    if (qubit.docked) {
      applyGateStateToQubit(qubit, gate.activeTick);
    }
  }

  gates.forEach((gate, gateIndex) => {
    for (let i = 0; i < 12; i += 1) {
      const tick = document.createElement("button");
      tick.type = "button";
      tick.className = "tick";
      tick.setAttribute("aria-label", `Tick ${i + 1}`);
      tick.addEventListener("click", () => setGateArrowAtTick(gateIndex, i));
      gate.ticksWrap.appendChild(tick);
      gate.ticks.push(tick);
    }
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

    const leftQubit = slotOccupants.left;
    const rightQubit = slotOccupants.right;
    const leftResult = collapseQubitState(leftQubit);
    const rightResult = collapseQubitState(rightQubit);
    const outcomeKey = pairTubeOutcomeKey(leftResult, rightResult);
    const targetTube = tubeElementsByKey[outcomeKey];
    const targetRect = targetTube.getBoundingClientRect();
    const shellRect = pairShell.getBoundingClientRect();
    const targetX = targetRect.left - shellRect.left + targetRect.width / 2;
    const targetY = targetRect.top - shellRect.top + targetRect.height * 0.22;
    const offset = leftQubit.element.getBoundingClientRect().width * 0.36;

    await Promise.all([
      moveQubitToPoint(leftQubit, targetX - offset, targetY, migrationDuration),
      moveQubitToPoint(rightQubit, targetX + offset, targetY, migrationDuration),
    ]);
    if (expectedRunToken !== runToken) {
      measurementInProgress = false;
      return;
    }

    leftQubit.element.style.setProperty("--melt-duration", `${meltDuration}ms`);
    rightQubit.element.style.setProperty("--melt-duration", `${meltDuration}ms`);
    leftQubit.element.classList.add("melting");
    rightQubit.element.classList.add("melting");
    await wait(meltDuration);
    if (expectedRunToken !== runToken) {
      measurementInProgress = false;
      return;
    }

    tubeCountState[outcomeKey] += 2;
    maybeExpandTubeCapacity();
    updateTubeFills();

    settleQubitVisualState(leftQubit);
    settleQubitVisualState(rightQubit);
    clearLensSlotForQubit(leftQubit);
    clearLensSlotForQubit(rightQubit);
    placeQubitAtStart(leftQubit);
    placeQubitAtStart(rightQubit);
    measurementInProgress = false;
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
            const mix = BLUE_RED_MIX_BY_TICK[gates[idx].activeTick] || BLUE_RED_MIX_BY_TICK[0];
            qubit.blue = mix[0];
            qubit.red = mix[1];
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

        maybeSnapQubitToGate(qubits[0]);
        maybeSnapQubitToGate(qubits[1]);
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
    if (measurementInProgress || autoRunInProgress) {
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    const point = getPointer(event);
    const qubitRect = qubit.element.getBoundingClientRect();
    qubit.dragging = true;
    qubit.element.classList.add("dragging");
    qubit.docked = false;
    qubit.element.classList.remove("docked");
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
      const snappedLens = maybeSnapQubitToLens(qubit);
      if (!snappedLens) {
        maybeSnapQubitToGate(qubit);
      }
    });
  }

  function endQubitDrag() {
    if (measurementInProgress || autoRunInProgress) {
      return;
    }
    qubits.forEach((qubit) => {
      if (!qubit.dragging) {
        return;
      }
      qubit.dragging = false;
      qubit.element.classList.remove("dragging");
      if (!maybeSnapQubitToLens(qubit)) {
        maybeSnapQubitToGate(qubit);
      }
    });
    maybeTriggerManualPairMeasurement();
  }

  function nearestTickForGate(gateIndex, clientX, clientY, center = null) {
    const fallbackRect = center ? null : gates[gateIndex].window.getBoundingClientRect();
    const cx = center ? center.x : fallbackRect.left + fallbackRect.width / 2;
    const cy = center ? center.y : fallbackRect.top + fallbackRect.height / 2;
    const normalized = normalizedAngleFromTopDegrees(clientX, clientY, cx, cy);
    return Math.round(normalized / STEP_DEG) % 12;
  }

  function beginArrowDrag(gateIndex, event) {
    if (autoRunInProgress) {
      return;
    }
    event.preventDefault();
    arrowDraggingIndex = gateIndex;
    arrowDragStartTickByGate[gateIndex] = gates[gateIndex].activeTick;
    const rect = gates[gateIndex].window.getBoundingClientRect();
    arrowDragCenterByGate[gateIndex] = {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    };
    gates[gateIndex].arrow.classList.add("dragging");
    const point = getPointer(event);
    arrowDragAngleByGate[gateIndex] = normalizedAngleFromTopDegrees(
      point.clientX,
      point.clientY,
      arrowDragCenterByGate[gateIndex].x,
      arrowDragCenterByGate[gateIndex].y
    );
    gates[
      gateIndex
    ].arrow.style.transform = `rotate(${arrowDragAngleByGate[gateIndex]}deg) scale(${ARROW_SCALE})`;
  }

  function continueArrowDrag(event) {
    if (arrowDraggingIndex === null) {
      return;
    }
    if (event.touches) {
      event.preventDefault();
    }
    const point = getPointer(event);
    arrowDragAngleByGate[arrowDraggingIndex] = normalizedAngleFromTopDegrees(
      point.clientX,
      point.clientY,
      arrowDragCenterByGate[arrowDraggingIndex].x,
      arrowDragCenterByGate[arrowDraggingIndex].y
    );
    gates[
      arrowDraggingIndex
    ].arrow.style.transform = `rotate(${arrowDragAngleByGate[arrowDraggingIndex]}deg) scale(${ARROW_SCALE})`;
  }

  function endArrowDrag() {
    if (arrowDraggingIndex === null) {
      return;
    }
    const gateIndex = arrowDraggingIndex;
    const snappedTick =
      arrowDragAngleByGate[gateIndex] === null
        ? gates[gateIndex].activeTick
        : Math.round(arrowDragAngleByGate[gateIndex] / STEP_DEG) % 12;
    setGateArrowAtTick(gateIndex, snappedTick, { deferMeasurementClear: true });

    if (snappedTick !== arrowDragStartTickByGate[gateIndex]) {
      clearMeasurementApparatus();
    }
    gates[gateIndex].arrow.classList.remove("dragging");
    arrowDragCenterByGate[gateIndex] = null;
    arrowDragAngleByGate[gateIndex] = null;
    arrowDraggingIndex = null;
  }

  function handleResize() {
    const shellRect = pairShell.getBoundingClientRect();
    if (!shellRect.width || !shellRect.height) {
      return;
    }

    gates.forEach((gate) => {
      const rect = gate.ticksWrap.getBoundingClientRect();
      const size = rect.width;
      if (!size) {
        return;
      }
      const center = size / 2;
      const orbit = center + 11;
      gate.ticks.forEach((tick, index) => {
        const angle = (index * STEP_DEG * Math.PI) / 180;
        const x = center + Math.sin(angle) * orbit;
        const y = center - Math.cos(angle) * orbit;
        tick.style.left = `${(x / size) * 100}%`;
        tick.style.top = `${(y / size) * 100}%`;
        tick.style.setProperty("--rotation", `${index * STEP_DEG}deg`);
      });
    });

    qubits.forEach((qubit) => updateQubitSignSize(qubit));
    positionLightning();

    if (!initialized) {
      qubits.forEach((qubit) => placeQubitAtStart(qubit));
      initialized = true;
      return;
    }

    qubits.forEach((qubit) => {
      if (qubit.docked) {
        maybeSnapQubitToGate(qubit);
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
    arrowDraggingIndex = null;
    pairMeasurementCount.disabled = false;
    pairMeasurementCount.value = "1";
    setLightningActive(false);

    gates.forEach((gate) => {
      gate.arrow.classList.remove("dragging");
    });

    qubits.forEach((qubit) => {
      placeQubitAtStart(qubit);
    });

    setGateArrowAtTick(0, 0);
    setGateArrowAtTick(1, 0);
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
    arrow.addEventListener("keydown", (event) => {
      if (autoRunInProgress) {
        return;
      }
      if (event.key === "ArrowRight" || event.key === "ArrowDown") {
        event.preventDefault();
        setGateArrowAtTick(gateIndex, gates[gateIndex].activeTick + 1);
      }
      if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
        event.preventDefault();
        setGateArrowAtTick(gateIndex, gates[gateIndex].activeTick - 1);
      }
    });
  });

  pairMeasurementCount.addEventListener("mousedown", (event) => event.stopPropagation());
  pairMeasurementCount.addEventListener("touchstart", (event) => event.stopPropagation());
  pairMeasurementCount.addEventListener("click", (event) => event.stopPropagation());
  pairMeasurementCount.addEventListener("change", () => {
    const iterations = Number(pairMeasurementCount.value) || 1;
    runAutomatedPairMeasurements(Math.max(1, iterations));
  });

  pairLens.addEventListener("click", () => {
    const iterations = Number(pairMeasurementCount.value) || 1;
    runAutomatedPairMeasurements(Math.max(1, iterations));
  });

  if (pairResetButton) {
    pairResetButton.addEventListener("click", () => {
      resetPairSimulator();
    });
  }

  setGateArrowAtTick(0, 0);
  setGateArrowAtTick(1, 0);
  clearMeasurementApparatus();

  return {
    handleResize,
  };
}

const oneQubitRoot = mountOneQubitSimulator();
const oneQubitSimulator = oneQubitRoot ? setupSimulator(oneQubitRoot) : null;
const pairRoot = mountTwoQubitPair();
const twoQubitPairSimulator = pairRoot ? setupTwoQubitPair(pairRoot) : null;
const simulators = [oneQubitSimulator, twoQubitPairSimulator].filter(Boolean);

function refreshVisibleSimulators() {
  simulators.forEach((simulator) => {
    simulator.handleResize();
  });
}

function setActiveTab(tabTarget) {
  if (!tabButtons.length || !tabPanels.length) {
    return;
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

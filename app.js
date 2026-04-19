const tabButtons = Array.from(document.querySelectorAll(".tab-btn"));
const tabPanels = Array.from(document.querySelectorAll(".tab-panel"));
const simulatorTemplate = document.getElementById("simulatorTemplate");
const twoQubitPairTemplate = document.getElementById("twoQubitPairTemplate");
const oneQubitHost = document.getElementById("oneQubitHost");
const twoQubitsHost = document.getElementById("twoQubitsHost");

const STEP_DEG = 30;
const SNAP_OVERLAP_THRESHOLD = 0.9;
const MEASUREMENT_OVERLAP_THRESHOLD = 0.3;
const QUBIT_START_EDGE_GAP = 20;
const TWO_QUBIT_START_SHIFT_PX = 50;
const ARROW_SCALE = 1.27;
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
    vector[0] * matrix[0][0] + vector[1] * matrix[1][0],
    vector[0] * matrix[0][1] + vector[1] * matrix[1][1],
  ];
}

function normalizeVector2(vector) {
  const magnitude = Math.hypot(vector[0], vector[1]);
  if (!Number.isFinite(magnitude) || magnitude <= 1e-12) {
    return [1, 0];
  }
  return [vector[0] / magnitude, vector[1] / magnitude];
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

function gateMatrixForTick(tick) {
  const normalizedTick = ((tick % 12) + 12) % 12;
  const mix = BLUE_RED_MIX_BY_TICK[normalizedTick] || BLUE_RED_MIX_BY_TICK[0];
  const blueAmplitudeMagnitude = Math.sqrt(clamp(mix[0], 0, 1));
  const redAmplitudeMagnitude = Math.sqrt(clamp(mix[1], 0, 1));
  const blueSign = normalizedTick >= 7 && normalizedTick <= 11 ? -1 : 1;
  const a = blueSign * blueAmplitudeMagnitude;
  const b = redAmplitudeMagnitude;

  return [
    [a, b],
    [-b, a],
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

  let activeGateButtonIndex = 0;
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

  const tickElements = [];
  const gateSelectorName = `gate-selector-${Math.random().toString(36).slice(2)}`;

  ONE_QUBIT_GATE_OPTIONS.forEach((option, index) => {
    const blueProbability = ONE_QUBIT_BUTTON_BLUE_PROBABILITIES[option.buttonIndex];
    const redProbability = 1 - blueProbability;
    const wrapper = document.createElement("label");
    wrapper.className = "gate-radio";
    wrapper.setAttribute(
      "aria-label",
      `${option.label} gate option (P(0)=${formatFraction(blueProbability)}, P(1)=${formatFraction(redProbability)}, hsv(${option.hsv.h.toFixed(1)}, ${option.hsv.s.toFixed(1)}%, ${option.hsv.v.toFixed(1)}%))`
    );

    const input = document.createElement("input");
    input.type = "radio";
    input.name = gateSelectorName;
    input.className = "gate-radio-input";

    const dot = document.createElement("span");
    dot.className = "gate-radio-dot";
    dot.style.background = hsvSpecToCss(option.hsv);
    dot.style.setProperty("--ring-glow", hsvSpecToCss(option.hsv));
    dot.title = `${option.label} - P(0)=${formatFraction(blueProbability)}, P(1)=${formatFraction(redProbability)} - hsv(${option.hsv.h.toFixed(1)}, ${option.hsv.s.toFixed(1)}%, ${option.hsv.v.toFixed(1)}%)`;

    input.addEventListener("change", () => {
      if (input.checked) {
        setGateButtonIndex(option.buttonIndex);
      }
    });

    wrapper.appendChild(input);
    wrapper.appendChild(dot);
    ticksWrap.appendChild(wrapper);
    tickElements.push({ input, option, index });
  });

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
    const transformed = vectorTimesMatrix2([1, 0], oneQubitGateMatrixForButton(activeGateButtonIndex));
    return probabilitiesFromVector2(normalizeVector2(transformed));
  }

  function applyActiveGateToQubitVector() {
    setQubitVector(vectorTimesMatrix2(qubitVector, oneQubitGateMatrixForButton(activeGateButtonIndex)));
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

  function syncGateSelectorUI() {
    tickElements.forEach((entry) => {
      entry.input.checked = entry.option.buttonIndex === activeGateButtonIndex;
    });
  }

  function clearMeasurementApparatus() {
    tubeQubitCapacity = INITIAL_TUBE_QUBIT_CAPACITY;
    blueTubeCount = 0;
    redTubeCount = 0;
    updateTubeCapacityText();
    updateTubeFills();
  }

  function setGateButtonIndex(buttonIndex, { deferMeasurementClear = false } = {}) {
    if (autoRunInProgress) {
      return;
    }

    const count = ONE_QUBIT_BUTTON_BLUE_PROBABILITIES.length;
    const normalizedButtonIndex = ((buttonIndex % count) + count) % count;
    const gateStateChanged = normalizedButtonIndex !== activeGateButtonIndex;
    activeGateButtonIndex = normalizedButtonIndex;
    syncGateSelectorUI();

    if (gateStateChanged && !deferMeasurementClear) {
      clearMeasurementApparatus();
    }

    const [blueWeight, redWeight] = gateOutputWeightsForCurrentTickFromBlueBasis();
    updateStateText(blueWeight, redWeight);
    applyQubitColorForTick();
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

  function qubitReachedMeasurementFunnelMidpoint() {
    const measurementRect = measurementTool.getBoundingClientRect();
    const qubitRect = qubit.getBoundingClientRect();
    const funnelMidX = measurementRect.left - measurementRect.height * 0.2;
    const funnelTipX = measurementRect.left + measurementRect.height * 0.08;
    const verticalOverlap = Math.max(
      0,
      Math.min(qubitRect.bottom, measurementRect.bottom) - Math.max(qubitRect.top, measurementRect.top)
    );

    return (
      qubitRect.right >= funnelMidX &&
      qubitRect.left < funnelTipX &&
      verticalOverlap >= qubitRect.height * 0.25
    );
  }

  async function runMeasurementIngressAndSequence(
    expectedRunToken = runToken,
    { travelDuration = AUTO_TRAVEL_MS, meltDuration = AUTO_MELT_MS } = {}
  ) {
    if (expectedRunToken !== runToken || gateTransitInProgress || measurementInProgress) {
      return false;
    }

    qubitDragging = false;
    qubit.classList.remove("dragging");
    undockQubit();

    const measurementRect = measurementTool.getBoundingClientRect();
    const funnelPoint = getStageCoordsFromViewportPoint(
      measurementRect.left - measurementRect.height * 0.16,
      measurementRect.top + measurementRect.height / 2
    );
    await moveQubitToStagePoint(funnelPoint.x, funnelPoint.y, travelDuration);
    if (expectedRunToken !== runToken || gateTransitInProgress || measurementInProgress) {
      return false;
    }

    const lensRect = measureLens.getBoundingClientRect();
    const lensCenter = getStageCoordsFromViewportPoint(
      lensRect.left + lensRect.width / 2,
      lensRect.top + lensRect.height / 2
    );
    await moveQubitToStagePoint(lensCenter.x, lensCenter.y, travelDuration);
    if (expectedRunToken !== runToken || gateTransitInProgress || measurementInProgress) {
      return false;
    }

    await startMeasurementSequence(expectedRunToken, {
      migrationDuration: travelDuration,
      meltDuration,
      requireLensOverlap: false,
    });
    return true;
  }

  function maybeSnapQubitToMeasurementFunnel() {
    if (
      qubitReachedMeasurementFunnelMidpoint() &&
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
    payload.className = "qubit measurement-pellet";
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
    const deltaY = gateCenterY - measurementCenterY;
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
    const lensCenter = getElementCenterInMachineCoords(measureLens);

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
      updateStateText(qubitBlueWeight, qubitRedWeight);
      return "blue";
    }

    if (blueProbability <= 0) {
      setQubitVector([0, 1]);
      qubit.style.setProperty("--qubit-fill", blendBlueRed(0, 1));
      updateStateText(qubitBlueWeight, qubitRedWeight);
      return "red";
    }

    const collapseToBlue = Math.random() < blueProbability;

    if (collapseToBlue) {
      setQubitVector([1, 0]);
      qubit.style.setProperty("--qubit-fill", blendBlueRed(1, 0));
      updateStateText(qubitBlueWeight, qubitRedWeight);
      return "blue";
    }

    setQubitVector([0, 1]);
    qubit.style.setProperty("--qubit-fill", blendBlueRed(0, 1));
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
      await wait(OBSERVABLE_COLLAPSE_PAUSE_MS);
      qubit.classList.remove("collapse-animating");
      if (expectedRunToken !== runToken) {
        return;
      }

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

      await animateMeasurementPayloadToTube(collapsedColor, ejectedPoint, expectedRunToken, {
        migrationDuration,
        meltDuration,
      });
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
    if (measurementInProgress || autoRunInProgress || gateTransitInProgress) {
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
    if (maybeSnapQubitToMeasurementFunnel()) {
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
    if (maybeSnapQubitToMeasurementFunnel()) {
      return;
    }
    preventManualPipeOverlap();
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
    updateStateText(qubitBlueWeight, qubitRedWeight);
  }

  function handleResize() {
    const stageRect = gateStage.getBoundingClientRect();
    if (!stageRect.width || !stageRect.height) {
      return;
    }

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
    qubit.classList.remove("dragging");
    qubit.classList.remove("migrating");
    qubit.classList.remove("melting");
    qubit.classList.remove("docked");
    qubit.classList.remove("measurement-pellet");
    setLightningActive(false);
    setMeasurementPlatformExtended(false);
    qubitHasEnteredGate = false;

    tubeQubitCapacity = INITIAL_TUBE_QUBIT_CAPACITY;
    blueTubeCount = 0;
    redTubeCount = 0;
    updateTubeCapacityText();
    updateTubeFills();

    setGateButtonIndex(DEFAULT_GATE_BUTTON_INDEX);
    placeQubitToLeftOfWindow();
  }

  qubit.addEventListener("mousedown", beginQubitDrag);
  qubit.addEventListener("touchstart", beginQubitDrag, { passive: false });

  window.addEventListener("mousemove", (event) => {
    continueQubitDrag(event);
  });

  window.addEventListener(
    "touchmove",
    (event) => {
      continueQubitDrag(event);
    },
    { passive: false }
  );

  window.addEventListener("mouseup", () => {
    endQubitDrag();
  });

  window.addEventListener("touchend", () => {
    endQubitDrag();
  });

  window.addEventListener("touchcancel", () => {
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
    clearMeasurementApparatus();
    handleLensClickRun();
  });

  measurementTool.addEventListener("click", () => {
    handleLensClickRun();
  });

  resetButton.addEventListener("click", () => {
    resetAll();
  });

  setGateButtonIndex(DEFAULT_GATE_BUTTON_INDEX);
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
  const pairWindowWrapA = root.querySelector('[data-role="pair-window-wrap-a"]');
  const pairWindowWrapB = root.querySelector('[data-role="pair-window-wrap-b"]');
  const pairFunnelA = root.querySelector('[data-role="pair-tube-funnel-a"]');
  const pairFunnelB = root.querySelector('[data-role="pair-tube-funnel-b"]');
  const pairWindowA = root.querySelector('[data-role="pair-window-a"]');
  const pairWindowB = root.querySelector('[data-role="pair-window-b"]');
  const pairGateControlsA = root.querySelector('[data-role="pair-gate-controls-a"]');
  const pairGateControlsB = root.querySelector('[data-role="pair-gate-controls-b"]');
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
    !pairWindowWrapA ||
    !pairWindowWrapB ||
    !pairFunnelA ||
    !pairFunnelB ||
    !pairWindowA ||
    !pairWindowB ||
    !pairGateControlsA ||
    !pairGateControlsB ||
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
    {
      stage: pairStageA,
      wrap: pairWindowWrapA,
      funnel: pairFunnelA,
      window: pairWindowA,
      controlsWrap: pairGateControlsA,
      ticksWrap: pairTicksA,
      arrow: pairArrowA,
      activeTick: 0,
      ticks: [],
      radioEntries: [],
    },
    {
      stage: pairStageB,
      wrap: pairWindowWrapB,
      funnel: pairFunnelB,
      window: pairWindowB,
      controlsWrap: pairGateControlsB,
      ticksWrap: pairTicksB,
      arrow: pairArrowB,
      activeTick: 0,
      ticks: [],
      radioEntries: [],
    },
  ];

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
  let pairMeasurementShiftY = 0;
  const arrowDragStartTickByGate = [0, 0];
  const arrowDragCenterByGate = [null, null];
  const arrowDragAngleByGate = [null, null];

  function gateWeightsForSelection(selectionIndex) {
    if (
      Number.isInteger(selectionIndex) &&
      selectionIndex >= 0 &&
      selectionIndex < ONE_QUBIT_BUTTON_BLUE_PROBABILITIES.length
    ) {
      return oneQubitGateWeightsForButton(selectionIndex);
    }
    return BLUE_RED_MIX_BY_TICK[selectionIndex] || BLUE_RED_MIX_BY_TICK[0];
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
    const slotElement = slot === "left" ? pairSlotLeft : pairSlotRight;
    return stagePointForElementCenter(slotElement);
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

    if (qubit.lensSlot && qubit.lensSlot !== chosenSlot && slotOccupants[qubit.lensSlot] === qubit) {
      slotOccupants[qubit.lensSlot] = null;
    }
    slotOccupants[chosenSlot] = qubit;
    qubit.lensSlot = chosenSlot;

    const slotCenter = getLensSlotCenter(chosenSlot);
    await moveQubitToPoint(qubit, slotCenter.x, slotCenter.y, Math.max(220, Math.round(AUTO_TRAVEL_MS * 0.45)));
    if (expectedRunToken !== runToken || measurementInProgress || autoRunInProgress) {
      return false;
    }

    maybeTriggerManualPairMeasurement();
    return true;
  }

  function maybeSnapQubitToMeasurementFunnel(qubit) {
    if (!qubitReachedFunnelMidpoint(qubit, pairMeasurementFunnel)) {
      return false;
    }
    if (measurementInProgress || autoRunInProgress || qubit.gateTransitInProgress) {
      return false;
    }

    runPairMeasurementIngress(qubit, runToken).catch(() => {});
    return true;
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

    const chosenSlot = qubit.gateIndex === 0 ? "left" : "right";
    if (slotOccupants[chosenSlot] && slotOccupants[chosenSlot] !== qubit) {
      return false;
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
    clearGateIngestAnimation(qubit);
    qubit.gateTransitInProgress = false;
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
    qubit.element.classList.remove("measurement-pellet");
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
    const flexDirection = window.getComputedStyle(pairShell).flexDirection;
    if (flexDirection === "column") {
      pairMeasurementShiftY = 0;
      pairMeasurementBlock.style.transform = "";
      return;
    }

    const topGateCenter = stagePointForElementCenter(gates[0].window);
    const bottomGateCenter = stagePointForElementCenter(gates[1].window);
    const targetY = (topGateCenter.y + bottomGateCenter.y) / 2;
    const measurementCenterY = stagePointForElementCenter(pairLens).y;
    const deltaY = targetY - measurementCenterY;
    pairMeasurementShiftY += deltaY;
    pairMeasurementBlock.style.transform = `translateY(${pairMeasurementShiftY}px)`;
  }

  function syncPairGateSelectorUI(gate) {
    gate.radioEntries.forEach((entry) => {
      entry.input.checked = entry.option.buttonIndex === gate.activeTick;
    });
  }

  function setGateArrowAtTick(gateIndex, tickIndex, { deferMeasurementClear = false } = {}) {
    if (autoRunInProgress) {
      return;
    }
    const gate = gates[gateIndex];
    const usingButtonSelector =
      Number.isInteger(tickIndex) &&
      tickIndex >= 0 &&
      tickIndex < ONE_QUBIT_BUTTON_BLUE_PROBABILITIES.length;
    const normalizedTick = usingButtonSelector ? tickIndex : ((tickIndex % 12) + 12) % 12;
    const changed = normalizedTick !== gate.activeTick;
    gate.activeTick = normalizedTick;
    gate.arrow.style.transform = `rotate(${normalizedTick * STEP_DEG}deg) scale(${ARROW_SCALE})`;
    gate.ticks.forEach((tick, idx) => {
      tick.classList.toggle("active", idx === normalizedTick);
    });
    syncPairGateSelectorUI(gate);

    if (changed && !deferMeasurementClear) {
      clearMeasurementApparatus();
    }

    const qubit = qubits[gateIndex];
    if (qubit.docked) {
      applyGateStateToQubit(qubit, gate.activeTick);
    }
  }

  gates.forEach((gate, gateIndex) => {
    const gateSelectorName = `pair-gate-selector-${gateIndex}-${Math.random().toString(36).slice(2)}`;
    ONE_QUBIT_GATE_OPTIONS.forEach((option) => {
      const [blueProbability, redProbability] = oneQubitGateWeightsForButton(option.buttonIndex);
      const wrapper = document.createElement("label");
      wrapper.className = "gate-radio";
      wrapper.setAttribute(
        "aria-label",
        `${option.label} gate option (P(0)=${formatFraction(blueProbability)}, P(1)=${formatFraction(redProbability)}, hsv(${option.hsv.h.toFixed(1)}, ${option.hsv.s.toFixed(1)}%, ${option.hsv.v.toFixed(1)}%))`
      );

      const input = document.createElement("input");
      input.type = "radio";
      input.name = gateSelectorName;
      input.className = "gate-radio-input";

      const dot = document.createElement("span");
      dot.className = "gate-radio-dot";
      dot.style.background = hsvSpecToCss(option.hsv);
      dot.style.setProperty("--ring-glow", hsvSpecToCss(option.hsv));
      dot.title = `${option.label} - P(0)=${formatFraction(blueProbability)}, P(1)=${formatFraction(redProbability)} - hsv(${option.hsv.h.toFixed(1)}, ${option.hsv.s.toFixed(1)}%, ${option.hsv.v.toFixed(1)}%)`;

      input.addEventListener("change", () => {
        if (input.checked) {
          setGateArrowAtTick(gateIndex, option.buttonIndex);
        }
      });

      wrapper.appendChild(input);
      wrapper.appendChild(dot);
      gate.controlsWrap.appendChild(wrapper);
      gate.radioEntries.push({ input, option });
    });

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
      const topEjectedPoint = { x: ejectionCenterX, y: topSlotCenter.y };
      const bottomEjectedPoint = { x: ejectionCenterX, y: bottomSlotCenter.y };

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
    if (measurementInProgress || autoRunInProgress || qubit.gateTransitInProgress) {
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
    arrowDraggingIndex = null;
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

    setGateArrowAtTick(0, DEFAULT_GATE_BUTTON_INDEX);
    setGateArrowAtTick(1, DEFAULT_GATE_BUTTON_INDEX);
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
    clearMeasurementApparatus();
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

  setGateArrowAtTick(0, DEFAULT_GATE_BUTTON_INDEX);
  setGateArrowAtTick(1, DEFAULT_GATE_BUTTON_INDEX);
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

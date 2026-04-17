const tabButtons = Array.from(document.querySelectorAll(".tab-btn"));
const tabPanels = Array.from(document.querySelectorAll(".tab-panel"));
const simulatorTemplate = document.getElementById("simulatorTemplate");
const oneQubitHost = document.getElementById("oneQubitHost");
const twoQubitsHost = document.getElementById("twoQubitsHost");

const STEP_DEG = 30;
const SNAP_OVERLAP_THRESHOLD = 0.9;
const QUBIT_START_EDGE_GAP = 20;
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

function mountSimulators() {
  if (!simulatorTemplate || !oneQubitHost || !twoQubitsHost) {
    return [];
  }

  const roots = [];

  const appendSimulator = (host) => {
    const fragment = simulatorTemplate.content.cloneNode(true);
    host.appendChild(fragment);
    const items = host.querySelectorAll(".quantum-sim");
    const root = items[items.length - 1];
    if (root) {
      roots.push(root);
    }
  };

  appendSimulator(oneQubitHost);
  appendSimulator(twoQubitsHost);
  appendSimulator(twoQubitsHost);

  return roots;
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

function blendBlueRed(blueWeight, redWeight) {
  const r = Math.round(BLUE_RGB[0] * blueWeight + RED_RGB[0] * redWeight);
  const g = Math.round(BLUE_RGB[1] * blueWeight + RED_RGB[1] * redWeight);
  const b = Math.round(BLUE_RGB[2] * blueWeight + RED_RGB[2] * redWeight);
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

  function setArrowAtTick(tickIndex) {
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

    if (gateStateChanged) {
      clearMeasurementApparatus();
    }

    const [blueWeight, redWeight] = BLUE_RED_MIX_BY_TICK[activeTick] || BLUE_RED_MIX_BY_TICK[0];
    updateStateText(blueWeight, redWeight);
    if (qubitDocked) {
      updateQubitSignForTick();
    }
    applyQubitColorForTick();
  }

  function nearestTickFromPointer(clientX, clientY) {
    const rect = windowWrap.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = clientX - cx;
    const dy = clientY - cy;

    const angleFromTop = Math.atan2(dx, -dy) * (180 / Math.PI);
    const normalized = (angleFromTop + 360) % 360;
    return Math.round(normalized / STEP_DEG) % 12;
  }

  function beginArrowDrag(event) {
    event.preventDefault();
    arrowDragging = true;
    arrowGroup.classList.add("dragging");

    const point = getPointer(event);
    setArrowAtTick(nearestTickFromPointer(point.clientX, point.clientY));
  }

  function continueArrowDrag(event) {
    if (!arrowDragging) {
      return;
    }

    if (event.touches) {
      event.preventDefault();
    }

    const point = getPointer(event);
    setArrowAtTick(nearestTickFromPointer(point.clientX, point.clientY));
  }

  function endArrowDrag() {
    if (!arrowDragging) {
      return;
    }

    arrowDragging = false;
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
    tubeCapacity.textContent = `Testtubes hold ${tubeQubitCapacity} qubits`;
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
    const topRect = topControls.getBoundingClientRect();
    const rackRect = tubeRack.getBoundingClientRect();
    const centerX = rackRect.left + rackRect.width / 2 - topRect.left;
    tubeCapacity.style.left = `${centerX}px`;
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

const simulatorRoots = mountSimulators();
const simulators = simulatorRoots.map((root) => setupSimulator(root)).filter(Boolean);

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

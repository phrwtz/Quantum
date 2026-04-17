const ticksWrap = document.getElementById("ticks");
const arrowGroup = document.getElementById("arrowGroup");
const windowWrap = document.getElementById("windowWrap");
const gateWindow = document.getElementById("window");
const gateStage = document.getElementById("gateStage");
const qubit = document.getElementById("qubit");
const messageBox = document.getElementById("messageBox");

const STEP_DEG = 30;
const SNAP_OVERLAP_THRESHOLD = 0.9;
const QUBIT_START_EDGE_GAP = 20;
const BLUE_RGB = [38, 111, 247];
const RED_RGB = [225, 54, 56];

const BLUE_RED_MIX_BY_TICK = {
  0: [1, 0],
  1: [2 / 3, 1 / 3],
  2: [1 / 2, 1 / 2],
  3: [1 / 3, 2 / 3],
  4: [1 / 5, 4 / 5],
  5: [1 / 12, 11 / 12],
  6: [0, 1],
  7: [1 / 12, 11 / 12],
  8: [1 / 5, 4 / 5],
  9: [1 / 3, 2 / 3],
  10: [1 / 2, 1 / 2],
  11: [2 / 3, 1 / 3],
};

let activeTick = 0;
let arrowDragging = false;
let qubitDragging = false;
let qubitDocked = false;
let qubitDragOffsetX = 0;
let qubitDragOffsetY = 0;
let qubitInitialized = false;
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

function applyQubitColorForTick() {
  if (!qubitDocked) {
    return;
  }

  const mix = BLUE_RED_MIX_BY_TICK[activeTick] || BLUE_RED_MIX_BY_TICK[0];
  const [blueWeight, redWeight] = mix;
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
  const qubitRect = qubit.getBoundingClientRect();
  const radius = qubitRect.width / 2;

  const clampedX = Math.min(Math.max(x, radius), stageRect.width - radius);
  const clampedY = Math.min(Math.max(y, radius), stageRect.height - radius);

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

function setArrowAtTick(tickIndex) {
  activeTick = ((tickIndex % 12) + 12) % 12;
  const rotation = activeTick * STEP_DEG;
  arrowGroup.style.transform = `rotate(${rotation}deg)`;

  tickElements.forEach((tick, index) => {
    tick.classList.toggle("active", index === activeTick);
  });

  const clockLabel = activeTick === 0 ? 12 : activeTick;
  messageBox.placeholder = `Arrow aligned to tick ${clockLabel}`;
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
  qubit.classList.add("docked");
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

function maybeSnapQubit() {
  if (qubitOverlapRatioWithGateWindow() >= SNAP_OVERLAP_THRESHOLD) {
    snapQubitToWindowCenter();
    return true;
  }

  undockQubit();
  return false;
}

function beginQubitDrag(event) {
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
  if (!qubitDragging) {
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
}

function endQubitDrag() {
  if (!qubitDragging) {
    return;
  }

  qubitDragging = false;
  qubit.classList.remove("dragging");

  maybeSnapQubit();
}

function placeQubitToLeftOfWindow() {
  const windowCenter = stagePointForElementCenter(gateWindow);
  const qubitRect = qubit.getBoundingClientRect();

  const radius = qubitRect.width / 2;
  const x = radius + QUBIT_START_EDGE_GAP;

  setQubitCenter(x, windowCenter.y);
  qubit.style.setProperty("--qubit-fill", blendBlueRed(1, 0));
}

function handleResize() {
  layoutTicks();

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

arrowGroup.addEventListener("mousedown", beginArrowDrag);
arrowGroup.addEventListener("touchstart", beginArrowDrag, { passive: false });
qubit.addEventListener("mousedown", beginQubitDrag);
qubit.addEventListener("touchstart", beginQubitDrag, { passive: false });

window.addEventListener("mousemove", (event) => {
  continueArrowDrag(event);
  continueQubitDrag(event);
});

window.addEventListener("touchmove", (event) => {
  continueArrowDrag(event);
  continueQubitDrag(event);
}, { passive: false });

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
  if (event.key === "ArrowRight" || event.key === "ArrowDown") {
    event.preventDefault();
    setArrowAtTick(activeTick + 1);
  }

  if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
    event.preventDefault();
    setArrowAtTick(activeTick - 1);
  }
});

window.addEventListener("resize", handleResize);

setArrowAtTick(0);
handleResize();

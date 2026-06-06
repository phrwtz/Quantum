const fs = require("node:fs");
const fsp = require("node:fs/promises");
const http = require("node:http");
const path = require("node:path");
const { chromium } = require("playwright");

const rootDir = path.resolve(__dirname, "..");
const expectedPublishedTabLabels = [
  "Introduction",
  "One qubit",
  "Two qubits",
  "Entanglement 1",
  "Entanglement 2",
];
const expectedLocalTabLabels = [
  "Editor",
  "Doc Editor",
  ...expectedPublishedTabLabels,
];

const mimeTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".png": "image/png",
};

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function startServer() {
  const server = http.createServer(async (request, response) => {
    try {
      const requestUrl = new URL(request.url || "/", "http://127.0.0.1");
      const decodedPath = decodeURIComponent(requestUrl.pathname);
      const relativePath = decodedPath === "/" ? "index.html" : decodedPath.slice(1);
      const filePath = path.resolve(rootDir, relativePath);
      if (filePath !== rootDir && !filePath.startsWith(`${rootDir}${path.sep}`)) {
        response.writeHead(403);
        response.end("Forbidden");
        return;
      }
      const stat = await fsp.stat(filePath);
      if (!stat.isFile()) {
        response.writeHead(404);
        response.end("Not found");
        return;
      }
      response.writeHead(200, {
        "Content-Type": mimeTypes[path.extname(filePath)] || "application/octet-stream",
      });
      fs.createReadStream(filePath).pipe(response);
    } catch (_error) {
      response.writeHead(404);
      response.end("Not found");
    }
  });

  return new Promise((resolve, reject) => {
    server.on("error", reject);
    server.listen(0, "127.0.0.1", () => {
      const address = server.address();
      resolve({
        server,
        baseUrl: `http://127.0.0.1:${address.port}`,
      });
    });
  });
}

function closeServer(server) {
  return new Promise((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  });
}

async function rectCenter(locator) {
  const box = await locator.boundingBox();
  if (!box) {
    throw new Error("Missing bounding box");
  }
  return {
    x: box.x + box.width / 2,
    y: box.y + box.height / 2,
    box,
  };
}

async function tubeCounts(page) {
  return page.evaluate(() => {
    const root = document.querySelector("#panel-editor-smoke");
    const blue = Number(
      root?.querySelector('[data-role="tube-blue-count"]')?.textContent?.trim() || 0,
    );
    const red = Number(
      root?.querySelector('[data-role="tube-red-count"]')?.textContent?.trim() || 0,
    );
    return {
      blue,
      red,
      total: blue + red,
    };
  });
}

async function singleTubeCountsForPanel(page, panelId) {
  return page.evaluate((targetPanelId) => {
    const root = document.querySelector(`#${targetPanelId}`);
    const blue = Number(
      root?.querySelector('[data-role="tube-blue-count"]')?.textContent?.trim() || 0,
    );
    const red = Number(
      root?.querySelector('[data-role="tube-red-count"]')?.textContent?.trim() || 0,
    );
    return {
      blue,
      red,
      total: blue + red,
    };
  }, panelId);
}

async function waitForSingleTubeTotal(page, panelId, target) {
  const deadline = Date.now() + 15000;
  let latest = await singleTubeCountsForPanel(page, panelId);
  while (Date.now() < deadline) {
    latest = await singleTubeCountsForPanel(page, panelId);
    if (latest.total >= target) {
      return latest;
    }
    await wait(250);
  }
  throw new Error(
    `Timed out waiting for ${panelId} total ${target}; latest ${JSON.stringify(latest)}`,
  );
}

async function waitForTotal(page, target) {
  const deadline = Date.now() + 15000;
  let latest = await tubeCounts(page);
  while (Date.now() < deadline) {
    latest = await tubeCounts(page);
    if (latest.total >= target) {
      return latest;
    }
    await wait(250);
  }
  throw new Error(
    `Timed out waiting for total ${target}; latest ${JSON.stringify(latest)}`,
  );
}

async function runEditorDoubleMeasurementSmoke(page) {
  await page.evaluate(() => {
    localStorage.setItem(
      "quantum_playground_component_defaults_v1",
      JSON.stringify({
        "double-measurement": {
          group: {
            tx: 900,
            ty: 120,
            width: "1596px",
            height: "756px",
            inlineStyle: { right: "0px" },
          },
          parts: {
            capacity: { tx: 511, ty: 0, width: "314px", height: "" },
            tubeRack: { tx: 455, ty: 0, width: "", height: "" },
            magnifier: { tx: 549, ty: 52, width: "", height: "" },
          },
        },
        __componentGeometryDefaults: {
          "double-measurement": { width: 1596, height: 756 },
        },
      }),
    );
  });
  await page.reload({ waitUntil: "domcontentloaded" });
  await page.locator("#tab-plaground").click();
  await page.waitForSelector("#playgroundCanvas");

  const canvas = page.locator("#playgroundCanvas");
  const select = page.locator("#playgroundComponentSelect");
  const canvasBox = await canvas.boundingBox();
  if (!canvasBox) {
    throw new Error("Missing editor canvas");
  }

  await select.selectOption("qubit");
  await page.mouse.click(canvasBox.x + 320, canvasBox.y + 390);
  await select.selectOption("double-measurement");
  await page.mouse.click(canvasBox.x + 560, canvasBox.y + 160);

  const qubit = page.locator('#playgroundCanvas [data-component="qubit"]');
  const pairMeasurement = page.locator(
    '#playgroundCanvas [data-component="double-measurement"]',
  );
  const pairCapacity = page.locator(
    '#playgroundCanvas [data-component="double-measurement"] [data-role="pair-capacity"]',
  );
  const pairTubeRack = page.locator(
    '#playgroundCanvas [data-component="double-measurement"] .pair-tube-rack',
  );
  const lens = page.locator(
    '#playgroundCanvas [data-component="double-measurement"] [data-role="pair-lens"]',
  );
  const pairParts = page.locator(
    '#playgroundCanvas [data-component="double-measurement"] [data-playground-measurement-part]',
  );
  const qubitCount = await qubit.count();
  const pairCount = await pairMeasurement.count();
  const topLevelEditorState = await page.evaluate(() => ({
    topLevelNodeCount: document.querySelectorAll(
      "#playgroundCanvas > .playground-node",
    ).length,
    looseMeasurementPieces: document.querySelectorAll(
      "#playgroundCanvas > .playground-node.measurement-piece",
    ).length,
  }));
  if (qubitCount !== 1 || pairCount !== 1) {
    throw new Error(
      `Editor setup failed: qubits=${qubitCount}, doubleMeasurements=${pairCount}`,
    );
  }
  if (
    topLevelEditorState.topLevelNodeCount !== 2 ||
    topLevelEditorState.looseMeasurementPieces !== 0
  ) {
    throw new Error(
      `Double measurement inserted loose subcomponents: ${JSON.stringify(topLevelEditorState)}`,
    );
  }
  const internalPartCount = await pairParts.count();
  if (internalPartCount === 0) {
    throw new Error(
      "Double measurement did not expose independently editable parts",
    );
  }
  const ejectionState = await page.evaluate(() => {
    const ejectors = Array.from(
      document.querySelectorAll(
        '#playgroundCanvas [data-component="double-measurement"] [data-role^="pair-eject-"]',
      ),
    );
    return {
      editableCount: ejectors.filter((node) =>
        node.hasAttribute("data-playground-measurement-part"),
      ).length,
      visibleCount: ejectors.filter((node) => {
        const style = getComputedStyle(node);
        return (
          style.display !== "none" &&
          style.visibility !== "hidden" &&
          Number(style.opacity) > 0.01
        );
      }).length,
    };
  });
  if (ejectionState.editableCount !== 0 || ejectionState.visibleCount !== 0) {
    throw new Error(
      `Double measurement exposed ghost ejection sites: ${JSON.stringify(ejectionState)}`,
    );
  }
  const pairBox = await pairMeasurement.boundingBox();
  const capacityBox = await pairCapacity.boundingBox();
  const tubeRackBox = await pairTubeRack.boundingBox();
  if (!pairBox || !capacityBox || !tubeRackBox) {
    throw new Error("Missing double measurement capacity or tube rack bounds");
  }
  const expectedPairLeft =
    canvasBox.x +
    Math.round((560 - pairBox.width / 2) / 26) * 26;
  if (Math.abs(pairBox.x - expectedPairLeft) > 16) {
    throw new Error(
      `Double measurement reused stale group positioning: ${JSON.stringify({
        pairX: pairBox.x,
        expectedX: expectedPairLeft,
      })}`,
    );
  }
  const lensBox = await lens.boundingBox();
  if (!lensBox) {
    throw new Error("Missing double measurement lens bounds");
  }
  const partLayoutState = {
    capacityInside:
      capacityBox.x >= pairBox.x - 8 &&
      capacityBox.x + capacityBox.width <= pairBox.x + pairBox.width + 8,
    tubeRackInside:
      tubeRackBox.x >= pairBox.x - 8 &&
      tubeRackBox.x + tubeRackBox.width <= pairBox.x + pairBox.width + 8,
    lensInside:
      lensBox.x >= pairBox.x - 8 &&
      lensBox.x + lensBox.width <= pairBox.x + pairBox.width + 8,
  };
  if (
    !partLayoutState.capacityInside ||
    !partLayoutState.tubeRackInside ||
    !partLayoutState.lensInside
  ) {
    throw new Error(
      `Double measurement reused stale part positioning: ${JSON.stringify(partLayoutState)}`,
    );
  }
  await pairMeasurement.scrollIntoViewIfNeeded();
  const pairFrameState = await page.evaluate(() => {
    const pair = document.querySelector(
      '#playgroundCanvas [data-component="double-measurement"]',
    );
    const frame = pair?.querySelector(":scope > .playground-group-frame");
    if (!pair || !frame) {
      return { hasFrame: false };
    }
    const rect = pair.getBoundingClientRect();
    const frameStyle = getComputedStyle(frame);
    const topHit = document.elementFromPoint(
      rect.left + rect.width / 2,
      rect.top + 4,
    );
    const cornerHit = document.elementFromPoint(rect.right - 4, rect.bottom - 4);
    return {
      hasFrame: true,
      display: frameStyle.display,
      topEdgeHit: Boolean(
        topHit?.closest?.(".playground-group-frame-edge-top"),
      ),
      resizeHit: Boolean(
        cornerHit?.closest?.(
          ".playground-group-frame-corner, .playground-group-frame-edge, .layout-resize-handle",
        ),
      ),
      resizeTarget: cornerHit?.className || cornerHit?.tagName || "",
    };
  });
  if (
    !pairFrameState.hasFrame ||
    pairFrameState.display === "none" ||
    !pairFrameState.topEdgeHit ||
    !pairFrameState.resizeHit
  ) {
    throw new Error(
      `Double measurement group frame is not usable: ${JSON.stringify(pairFrameState)}`,
    );
  }
  if (capacityBox.width > tubeRackBox.width + 40) {
    throw new Error(
      `Double measurement capacity label is too wide: capacity=${capacityBox.width}, rack=${tubeRackBox.width}`,
    );
  }
  const capacityCenter = capacityBox.x + capacityBox.width / 2;
  const tubeRackCenter = tubeRackBox.x + tubeRackBox.width / 2;
  if (Math.abs(capacityCenter - tubeRackCenter) > 12) {
    throw new Error("Double measurement capacity label is not aligned with tubes");
  }

  const qubitCenter = await rectCenter(qubit);
  await page.mouse.move(qubitCenter.x, qubitCenter.y);
  await page.mouse.down();
  await page.mouse.move(qubitCenter.x + 70, qubitCenter.y, { steps: 7 });
  await page.mouse.up();
  await wait(200);
  const qubitAfterDrag = await rectCenter(qubit);
  if (qubitAfterDrag.x - qubitCenter.x < 40) {
    throw new Error("Editor qubit did not drag while double measurement was present");
  }

  const pairBeforePartDrag = await pairMeasurement.boundingBox();
  const lensBefore = await lens.boundingBox();
  const lensCenter = await rectCenter(lens);
  await page.mouse.move(lensCenter.x, lensCenter.y);
  await page.mouse.down();
  await page.mouse.move(lensCenter.x + 55, lensCenter.y + 25, { steps: 8 });
  await page.mouse.up();
  await wait(200);
  const pairAfterPartDrag = await pairMeasurement.boundingBox();
  const lensAfter = await lens.boundingBox();
  if (
    !pairBeforePartDrag ||
    !pairAfterPartDrag ||
    !lensBefore ||
    !lensAfter
  ) {
    throw new Error("Missing double measurement or lens bounds after part drag");
  }
  if (lensAfter.x - lensBefore.x < 35 || lensAfter.y - lensBefore.y < 10) {
    throw new Error("Double measurement lens did not move as an editable part");
  }
  if (Math.abs(pairAfterPartDrag.x - pairBeforePartDrag.x) > 8) {
    throw new Error("Dragging a double measurement part moved the whole group");
  }
  const selectedAfterPartDrag = await page.evaluate(() => {
    const pair = document.querySelector(
      '#playgroundCanvas [data-component="double-measurement"]',
    );
    const lens = pair?.querySelector('[data-role="pair-lens"]');
    const saveButton = document.querySelector("#playgroundSaveComponentButton");
    return {
      pairSelected: pair?.classList.contains("selected") || false,
      lensSelected: lens?.classList.contains("layout-edit-selected") || false,
      saveDisabled: saveButton?.disabled ?? true,
    };
  });
  if (
    !selectedAfterPartDrag.pairSelected ||
    !selectedAfterPartDrag.lensSelected ||
    selectedAfterPartDrag.saveDisabled
  ) {
    throw new Error(
      `Double measurement part edit did not select a saveable component: ${JSON.stringify(selectedAfterPartDrag)}`,
    );
  }
  await page.locator("#playgroundSaveComponentButton").click();
  await wait(200);
  const savedDoubleMeasurementDefault = await page.evaluate(() => {
    const payload = JSON.parse(
      localStorage.getItem("quantum_playground_component_defaults_v1") || "{}",
    );
    const saved =
      payload["double-measurement"]?.parts?.magnifier ||
      payload["double-measurement"]?.magnifier;
    return {
      tx: saved?.tx,
      ty: saved?.ty,
      hasEjectLeft: Boolean(payload["double-measurement"]?.parts?.ejectLeft),
      hasEjectRight: Boolean(payload["double-measurement"]?.parts?.ejectRight),
      width: payload.__componentGeometryDefaults?.["double-measurement"]?.width,
    };
  });
  if (
    !Number.isFinite(savedDoubleMeasurementDefault.tx) ||
    !Number.isFinite(savedDoubleMeasurementDefault.ty) ||
    savedDoubleMeasurementDefault.tx < 35 ||
    savedDoubleMeasurementDefault.ty < 10 ||
    savedDoubleMeasurementDefault.hasEjectLeft ||
    savedDoubleMeasurementDefault.hasEjectRight ||
    !Number.isFinite(savedDoubleMeasurementDefault.width)
  ) {
    throw new Error(
      `Double measurement component edit was not saved globally: ${JSON.stringify(savedDoubleMeasurementDefault)}`,
    );
  }

  const pairGroupDragPoint = await page.evaluate(() => {
    const pair = document.querySelector(
      '#playgroundCanvas [data-component="double-measurement"]',
    );
    if (!pair) {
      return null;
    }
    const rect = pair.getBoundingClientRect();
    for (let y = rect.top + 18; y < rect.bottom - 28; y += 12) {
      for (let x = rect.left + 18; x < rect.right - 28; x += 12) {
        if (document.elementFromPoint(x, y) !== pair) {
          continue;
        }
        const otherNode = document
          .elementsFromPoint(x, y)
          .map((element) => element.closest?.(".playground-node"))
          .find((node) => node && node !== pair);
        if (!otherNode) {
          return { x, y };
        }
      }
    }
    return null;
  });
  if (!pairGroupDragPoint) {
    throw new Error("Could not find an outer double measurement drag point");
  }
  await pairMeasurement.scrollIntoViewIfNeeded();
  const pairFrameDragPoint = await page.evaluate(() => {
    const pair = document.querySelector(
      '#playgroundCanvas [data-component="double-measurement"]',
    );
    if (!pair) {
      return null;
    }
    const rect = pair.getBoundingClientRect();
    return { x: rect.left + rect.width / 2, y: rect.top + 4 };
  });
  if (!pairFrameDragPoint) {
    throw new Error("Could not find the double measurement group frame");
  }
  const pairBeforeGroupDrag = await pairMeasurement.boundingBox();
  await page.mouse.move(pairFrameDragPoint.x, pairFrameDragPoint.y);
  await page.mouse.down();
  await page.mouse.move(pairFrameDragPoint.x + 55, pairFrameDragPoint.y + 25, {
    steps: 8,
  });
  await page.mouse.up();
  await wait(200);
  const pairAfterGroupDrag = await pairMeasurement.boundingBox();
  if (
    !pairBeforeGroupDrag ||
    !pairAfterGroupDrag ||
    pairAfterGroupDrag.x - pairBeforeGroupDrag.x < 35 ||
    pairAfterGroupDrag.y - pairBeforeGroupDrag.y < 10
  ) {
    throw new Error("Double measurement did not move as a grouped editor item");
  }
  await pairMeasurement.scrollIntoViewIfNeeded();
  const pairResizePoint = await page.evaluate(() => {
    const pair = document.querySelector(
      '#playgroundCanvas [data-component="double-measurement"]',
    );
    if (!pair) {
      return null;
    }
    const rect = pair.getBoundingClientRect();
    return { x: rect.right - 4, y: rect.bottom - 4 };
  });
  if (!pairResizePoint) {
    throw new Error("Could not find the double measurement resize handle");
  }
  const pairBeforeGroupResize = await pairMeasurement.boundingBox();
  await page.mouse.move(pairResizePoint.x, pairResizePoint.y);
  await page.mouse.down();
  await page.mouse.move(pairResizePoint.x + 42, pairResizePoint.y + 30, {
    steps: 8,
  });
  await page.mouse.up();
  await wait(200);
  const pairAfterGroupResize = await pairMeasurement.boundingBox();
  if (
    !pairBeforeGroupResize ||
    !pairAfterGroupResize ||
    pairAfterGroupResize.width - pairBeforeGroupResize.width < 20 ||
    pairAfterGroupResize.height - pairBeforeGroupResize.height < 15
  ) {
    throw new Error("Double measurement did not resize as a grouped editor item");
  }

  const componentOptions = await select.evaluate((node) =>
    Array.from(node.options).map((option) => option.value),
  );
  [
    "measurement-capacity",
    "single-tube-array",
    "double-tube-array",
    "single-magnifier",
    "double-magnifier",
    "measurement-count-menu",
  ].forEach((value) => {
    if (!componentOptions.includes(value)) {
      throw new Error(`Missing measurement subcomponent option: ${value}`);
    }
  });

  const placeComponent = async (type, x, y) => {
    const currentCanvasBox = await canvas.boundingBox();
    if (!currentCanvasBox) {
      throw new Error("Missing editor canvas while placing a component");
    }
    await select.selectOption(type);
    await page.mouse.click(currentCanvasBox.x + x, currentCanvasBox.y + y);
    await wait(120);
  };
  await placeComponent("measurement-capacity", 120, 80);
  await placeComponent("single-magnifier", 120, 180);
  await placeComponent("measurement-count-menu", 120, 300);

  const capacityPiece = page.locator(
    '#playgroundCanvas [data-component="measurement-capacity"]',
  );
  const magnifierPiece = page.locator(
    '#playgroundCanvas [data-component="single-magnifier"]',
  );
  const countPiece = page.locator(
    '#playgroundCanvas [data-component="measurement-count-menu"]',
  );
  const groupCapacityCenter = await rectCenter(capacityPiece);
  const magnifierCenter = await rectCenter(magnifierPiece);
  const countCenter = await rectCenter(countPiece);
  await page.mouse.click(groupCapacityCenter.x, groupCapacityCenter.y);
  await page.keyboard.down("Shift");
  await page.mouse.click(magnifierCenter.x, magnifierCenter.y);
  await page.mouse.click(countCenter.x, countCenter.y);
  await page.keyboard.up("Shift");
  const selectedGroupPieces = await page
    .locator("#playgroundCanvas .playground-node.selected")
    .count();
  if (selectedGroupPieces < 3) {
    throw new Error(`Expected three selected group pieces, saw ${selectedGroupPieces}`);
  }
  page.once("dialog", async (dialog) => {
    if (dialog.type() !== "prompt") {
      throw new Error(`Expected Save Group As prompt, saw ${dialog.type()}`);
    }
    await dialog.accept("Smoke Measurement Group");
  });
  await page.locator("#playgroundSaveGroupButton").click();
  await wait(200);
  const savedGroup = await page.evaluate(() => {
    const payload = JSON.parse(
      localStorage.getItem("quantum_playground_group_components_v1") || "{}",
    );
    const group = (payload.groups || []).find(
      (entry) => entry.label === "Smoke Measurement Group",
    );
    const groupType = group?.id ? `group:${group.id}` : "";
    const selectHasGroup = Array.from(
      document.querySelector("#playgroundComponentSelect")?.options || [],
    ).some((option) => option.textContent === "Smoke Measurement Group");
    return {
      groupType,
      itemCount: group?.items?.length || 0,
      roles: (group?.items || []).map((item) => item.measurementRole).sort(),
      selectHasGroup,
    };
  });
  if (
    savedGroup.itemCount !== 3 ||
    !savedGroup.selectHasGroup ||
    !savedGroup.roles.includes("capacity") ||
    !savedGroup.roles.includes("single-magnifier") ||
    !savedGroup.roles.includes("iteration-count")
  ) {
    throw new Error(
      `Measurement group did not save with linked roles: ${JSON.stringify(savedGroup)}`,
    );
  }
  await select.selectOption(savedGroup.groupType);
  await page.mouse.click(canvasBox.x + 360, canvasBox.y + 140);
  await wait(200);
  const insertedGroup = await page.evaluate(() => {
    const groups = Array.from(
      document.querySelectorAll(
        '#playgroundCanvas > [data-component="component-group"][data-group-component-id="smoke-measurement-group"]',
      ),
    );
    const lastGroup = groups[groups.length - 1];
    return {
      count: groups.length,
      childCount:
        lastGroup?.querySelectorAll(".saved-group-child").length || 0,
      measurementGroupId: lastGroup?.dataset.measurementGroupId || "",
    };
  });
  if (
    insertedGroup.count < 2 ||
    insertedGroup.childCount < 3 ||
    !insertedGroup.measurementGroupId
  ) {
    throw new Error(
      `Saved group did not insert as wrapper instances: ${JSON.stringify(insertedGroup)}`,
    );
  }
  const groupWrapper = page.locator(
    '#playgroundCanvas > [data-component="component-group"][data-group-component-id="smoke-measurement-group"]',
  ).last();
  const groupBoxBeforeDrag = await groupWrapper.boundingBox();
  if (!groupBoxBeforeDrag) {
    throw new Error("Saved group wrapper did not have a bounding box");
  }
  await page.mouse.move(
    groupBoxBeforeDrag.x + groupBoxBeforeDrag.width / 2,
    groupBoxBeforeDrag.y + groupBoxBeforeDrag.height / 2,
  );
  await page.mouse.down();
  await page.mouse.move(
    groupBoxBeforeDrag.x + groupBoxBeforeDrag.width / 2 + 52,
    groupBoxBeforeDrag.y + groupBoxBeforeDrag.height / 2 + 26,
    { steps: 6 },
  );
  await page.mouse.up();
  await wait(120);
  const groupBoxAfterDrag = await groupWrapper.boundingBox();
  if (
    !groupBoxAfterDrag ||
    groupBoxAfterDrag.x <= groupBoxBeforeDrag.x + 20 ||
    groupBoxAfterDrag.y <= groupBoxBeforeDrag.y + 8
  ) {
    throw new Error("Saved group wrapper did not drag as a single component");
  }
  await page.mouse.move(
    groupBoxAfterDrag.x + groupBoxAfterDrag.width - 2,
    groupBoxAfterDrag.y + groupBoxAfterDrag.height - 2,
  );
  await page.mouse.down();
  await page.mouse.move(
    groupBoxAfterDrag.x + groupBoxAfterDrag.width + 42,
    groupBoxAfterDrag.y + groupBoxAfterDrag.height + 24,
    { steps: 6 },
  );
  await page.mouse.up();
  await wait(120);
  const groupBoxAfterResize = await groupWrapper.boundingBox();
  if (
    !groupBoxAfterResize ||
    groupBoxAfterResize.width <= groupBoxAfterDrag.width + 15 ||
    groupBoxAfterResize.height <= groupBoxAfterDrag.height + 8
  ) {
    throw new Error(
      `Saved group wrapper did not resize as a single component: ${JSON.stringify({
        before: groupBoxAfterDrag,
        after: groupBoxAfterResize,
      })}`,
    );
  }
}

async function runSequentialMeasurementEditorSmoke(page) {
  await page.evaluate(() => {
    writePlaygroundGroupComponentsPayload({
      groups: [
        {
          id: "hyphen-separate-smoke",
          label: "Separate two-qubit measurement",
          width: 420,
          height: 280,
          items: [
            {
              type: "double-tube-array",
              left: 24,
              top: 58,
              width: 300,
              height: 190,
              z: 1,
              measurementRole: "double-tubes",
            },
            {
              type: "single-magnifier",
              left: 18,
              top: 64,
              width: 150,
              height: 120,
              z: 2,
              measurementRole: "single-magnifier",
            },
            {
              type: "single-magnifier",
              left: 190,
              top: 64,
              width: 150,
              height: 120,
              z: 3,
              measurementRole: "single-magnifier",
            },
          ],
        },
        {
          id: "sequential-edit-smoke",
          label: "Sequential two qubit measurement",
          width: 420,
          height: 410,
          items: [
            {
              type: "measurement-capacity",
              left: 16,
              top: 8,
              width: 300,
              height: 38,
              z: 1,
              measurementRole: "capacity",
            },
            {
              type: "double-tube-array",
              left: 24,
              top: 58,
              width: 300,
              height: 190,
              z: 2,
              measurementRole: "double-tubes",
            },
            {
              type: "single-magnifier",
              left: 99,
              top: 266,
              width: 150,
              height: 120,
              z: 3,
              measurementRole: "single-magnifier",
            },
            {
              type: "measurement-count-menu",
              left: 336,
              top: 12,
              width: 68,
              height: 34,
              z: 4,
              measurementRole: "iteration-count",
            },
          ],
        },
        {
          id: "structural-pair-smoke",
          label: "Custom Pair Measurement",
          width: 420,
          height: 280,
          items: [
            {
              type: "double-tube-array",
              left: 24,
              top: 58,
              width: 300,
              height: 190,
              z: 1,
              measurementRole: "double-tubes",
            },
            {
              type: "single-magnifier",
              left: 18,
              top: 64,
              width: 150,
              height: 120,
              z: 2,
              measurementRole: "single-magnifier",
            },
            {
              type: "single-magnifier",
              left: 190,
              top: 64,
              width: 150,
              height: 120,
              z: 3,
              measurementRole: "single-magnifier",
            },
          ],
        },
      ],
    });
    localStorage.removeItem("quantum_generated_tabs_v1");
    localStorage.removeItem("quantum_plaground_layout_v1");
  });
  await page.reload({ waitUntil: "domcontentloaded" });
  await page.locator("#tab-plaground").click();
  await page.waitForSelector("#playgroundCanvas");

  const normalizedLegacySeparate = await page.evaluate(() => {
    const payload = JSON.parse(
      localStorage.getItem("quantum_playground_group_components_v1") || "{}",
    );
    const group = (payload.groups || []).find(
      (entry) => entry.id === "hyphen-separate-smoke",
    );
    const structuralGroup = (payload.groups || []).find(
      (entry) => entry.id === "structural-pair-smoke",
    );
    const magnifiers = (group?.items || []).filter(
      (item) => item.type === "single-magnifier",
    );
    const structuralMagnifiers = (structuralGroup?.items || []).filter(
      (item) => item.type === "single-magnifier",
    );
    return {
      label: group?.label || "",
      width: group?.width || 0,
      height: group?.height || 0,
      magnifierCount: magnifiers.length,
      magnifierLeft: magnifiers[0]?.left,
      magnifierTop: magnifiers[0]?.top,
      structuralLabel: structuralGroup?.label || "",
      structuralMagnifierCount: structuralMagnifiers.length,
      structuralMagnifierLeft: structuralMagnifiers[0]?.left,
      structuralMagnifierTop: structuralMagnifiers[0]?.top,
    };
  });
  if (
    normalizedLegacySeparate.label !== "Sequential two qubit measurement" ||
    normalizedLegacySeparate.magnifierCount !== 1 ||
    normalizedLegacySeparate.magnifierLeft !== 99 ||
    normalizedLegacySeparate.magnifierTop !== 266 ||
    normalizedLegacySeparate.height < 386 ||
    normalizedLegacySeparate.structuralLabel !== "Custom Pair Measurement" ||
    normalizedLegacySeparate.structuralMagnifierCount !== 1 ||
    normalizedLegacySeparate.structuralMagnifierLeft !== 99 ||
    normalizedLegacySeparate.structuralMagnifierTop !== 266
  ) {
    throw new Error(
      `Hyphenated separate measurement group was not normalized: ${JSON.stringify(normalizedLegacySeparate)}`,
    );
  }

  const canvas = page.locator("#playgroundCanvas");
  const select = page.locator("#playgroundComponentSelect");
  const canvasBox = await canvas.boundingBox();
  if (!canvasBox) {
    throw new Error("Missing editor canvas for sequential smoke");
  }
  await select.selectOption("group:sequential-edit-smoke");
  await page.mouse.click(canvasBox.x + 210, canvasBox.y + 90);
  await wait(250);

  const group = page.locator(
    '#playgroundCanvas > [data-component="component-group"][data-group-component-id="sequential-edit-smoke"]',
  );
  const groupBoxBefore = await group.boundingBox();
  if (!groupBoxBefore) {
    throw new Error("Sequential measurement group did not insert");
  }
  const editableChildCount = await group
    .locator('[data-playground-measurement-part]')
    .count();
  if (editableChildCount < 4) {
    throw new Error(
      `Sequential measurement group did not expose editable children: ${editableChildCount}`,
    );
  }

  const editedMagnifier = page
    .locator(
      '#playgroundCanvas > [data-component="component-group"][data-group-component-id="sequential-edit-smoke"] > .saved-group-child[data-component="single-magnifier"]',
    )
    .first();
  const magnifierBefore = await editedMagnifier.boundingBox();
  if (!magnifierBefore) {
    throw new Error("Sequential measurement magnifier child missing");
  }
  await page.mouse.move(
    magnifierBefore.x + magnifierBefore.width / 2,
    magnifierBefore.y + magnifierBefore.height / 2,
  );
  await page.mouse.down();
  await page.mouse.move(
    magnifierBefore.x + magnifierBefore.width / 2 + 54,
    magnifierBefore.y + magnifierBefore.height / 2 - 22,
    { steps: 8 },
  );
  await page.mouse.up();
  await wait(180);
  const groupBoxAfterChildDrag = await group.boundingBox();
  const magnifierAfterDrag = await editedMagnifier.boundingBox();
  if (
    !groupBoxAfterChildDrag ||
    !magnifierAfterDrag ||
    magnifierAfterDrag.x - magnifierBefore.x < 35 ||
    magnifierBefore.y - magnifierAfterDrag.y < 10 ||
    Math.abs(groupBoxAfterChildDrag.x - groupBoxBefore.x) > 8 ||
    Math.abs(groupBoxAfterChildDrag.y - groupBoxBefore.y) > 8
  ) {
    throw new Error(
      `Sequential child drag failed: ${JSON.stringify({
        groupBefore: groupBoxBefore,
        groupAfter: groupBoxAfterChildDrag,
        childBefore: magnifierBefore,
        childAfter: magnifierAfterDrag,
      })}`,
    );
  }

  const magnifierResizeHandle = await editedMagnifier
    .locator(":scope > .layout-resize-handle")
    .boundingBox();
  const resizeStart = magnifierResizeHandle
    ? {
        x: magnifierResizeHandle.x + magnifierResizeHandle.width / 2,
        y: magnifierResizeHandle.y + magnifierResizeHandle.height / 2,
      }
    : {
        x: magnifierAfterDrag.x + magnifierAfterDrag.width - 3,
        y: magnifierAfterDrag.y + magnifierAfterDrag.height - 3,
      };
  const resizeHitState = await page.evaluate((point) => {
    const target = document.elementFromPoint(point.x, point.y);
    const part = target?.closest?.("[data-playground-measurement-part]");
    return {
      targetClass: target?.className || target?.tagName || "",
      handle: Boolean(target?.closest?.(".layout-resize-handle")),
      partClass: part?.className || "",
      resizable: part?.getAttribute("data-layout-resizable") || "",
      partRect: part
        ? (() => {
            const rect = part.getBoundingClientRect();
            return {
              left: rect.left,
              top: rect.top,
              right: rect.right,
              bottom: rect.bottom,
            };
          })()
        : null,
    };
  }, resizeStart);
  await page.mouse.move(resizeStart.x, resizeStart.y);
  await page.mouse.down();
  await page.mouse.move(
    resizeStart.x + 34,
    resizeStart.y + 24,
    { steps: 8 },
  );
  await page.mouse.up();
  await wait(180);
  const magnifierAfterResize = await editedMagnifier.boundingBox();
  if (
    !magnifierAfterResize ||
    magnifierAfterResize.width - magnifierAfterDrag.width < 18 ||
    magnifierAfterResize.height - magnifierAfterDrag.height < 12
  ) {
    throw new Error(
      `Sequential child resize failed: ${JSON.stringify({
        before: magnifierAfterDrag,
        after: magnifierAfterResize,
        resizeStart,
        resizeHitState,
      })}`,
    );
  }

  await page.locator("#editorNewTabName").fill("Sequential Edit Smoke");
  await page.locator("#playgroundSaveAsButton").click();
  await wait(250);
  const savedSequentialLayout = await page.evaluate(() => {
    const state = JSON.parse(
      localStorage.getItem("quantum_generated_tabs_v1") || "{}",
    );
    const entry = (state.tabs || []).find(
      (tab) => tab.label === "Sequential Edit Smoke",
    );
    const groupItem = entry?.layout?.items?.find(
      (item) => item.groupComponentId === "sequential-edit-smoke",
    );
    const editedMagnifierItem = (groupItem?.items || [])
      .filter((item) => item.type === "single-magnifier")
      .sort((a, b) => Number(b.left) - Number(a.left))[0];
    return {
      tabSaved: Boolean(entry),
      childCount: groupItem?.items?.length || 0,
      magnifierCount: (groupItem?.items || []).filter(
        (item) => item.type === "single-magnifier",
      ).length,
      editedMagnifierLeft: editedMagnifierItem?.left,
      editedMagnifierTop: editedMagnifierItem?.top,
      editedMagnifierWidth: editedMagnifierItem?.width,
      editedMagnifierHeight: editedMagnifierItem?.height,
    };
  });
  if (
    !savedSequentialLayout.tabSaved ||
    savedSequentialLayout.childCount < 4 ||
    savedSequentialLayout.magnifierCount !== 1 ||
    savedSequentialLayout.editedMagnifierLeft < 135 ||
    savedSequentialLayout.editedMagnifierTop > 255 ||
    savedSequentialLayout.editedMagnifierWidth < 165 ||
    savedSequentialLayout.editedMagnifierHeight < 132
  ) {
    throw new Error(
      `Sequential child edits were not saved with the tab: ${JSON.stringify(savedSequentialLayout)}`,
    );
  }
}

async function runEditorDocumentWorkflowSmoke(page) {
  await page.evaluate(() => {
    localStorage.setItem(
      "quantum_playground_group_components_v1",
      JSON.stringify({
        groups: [
          {
            id: "separate",
            label: "separate",
            width: 320,
            height: 240,
            items: [],
          },
          {
            id: "separate-two-qubit-measurement",
            label: "separate two qubit measurement",
            width: 320,
            height: 240,
            items: [],
          },
        ],
      }),
    );
    localStorage.setItem(
      "quantum_generated_tabs_v1",
      JSON.stringify({
        tabs: [
          {
            id: "editor-test",
            label: "Test",
            layout: { items: [], canvasWidth: 600, canvasHeight: 420 },
          },
          {
            id: "editor-keep",
            label: "Keep",
            layout: {
              items: [
                {
                  id: "legacy-group-use",
                  type: "component-group",
                  groupComponentId: "separate-two-qubit-measurement",
                  left: 20,
                  top: 20,
                  width: 320,
                  height: 240,
                },
              ],
              canvasWidth: 600,
              canvasHeight: 420,
            },
          },
          {
            id: "editor-entanglement-2",
            label: "Entanglement 2",
            layout: { items: [], canvasWidth: 600, canvasHeight: 420 },
          },
          {
            id: "editor-entanglement-3",
            label: "Entanglement 3",
            layout: { items: [], canvasWidth: 600, canvasHeight: 420 },
          },
        ],
	      }),
	    );
  });
  await page.reload({ waitUntil: "domcontentloaded" });
  await page.locator("#tab-plaground").click();
  await page.waitForSelector("#playgroundCanvas");

  const migrated = await page.evaluate(() => {
    const groups = JSON.parse(
      localStorage.getItem("quantum_playground_group_components_v1") || "{}",
    ).groups || [];
    const tabs = JSON.parse(
      localStorage.getItem("quantum_generated_tabs_v1") || "{}",
    ).tabs || [];
    return {
      groupLabels: groups.map((group) => group.label),
      groupIds: groups.map((group) => group.id),
      pickerLabels: Array.from(
        document.querySelector("#playgroundComponentSelect")?.options || [],
      ).map((option) => option.textContent),
      pickerValues: Array.from(
        document.querySelector("#playgroundComponentSelect")?.options || [],
      ).map((option) => option.value),
      tabLabels: tabs.map((tab) => tab.label),
      tabButtonLabels: Array.from(document.querySelectorAll(".tab-btn")).map(
        (button) => button.textContent.trim(),
      ),
      keepGroupId: tabs
        .find((tab) => tab.id === "editor-keep")
        ?.layout?.items?.[0]?.groupComponentId,
    };
  });
  const sequentialCount = migrated.groupLabels.filter(
    (label) => label === "Sequential two qubit measurement",
  ).length;
  if (
    sequentialCount !== 1 ||
    migrated.groupLabels.includes("separate") ||
    migrated.groupLabels.includes("separate two qubit measurement") ||
    migrated.pickerLabels.includes("Sequential two qubit measurement") ||
    migrated.pickerLabels.includes("separate") ||
    migrated.pickerLabels.includes("separate two qubit measurement") ||
    migrated.pickerValues.includes("group:separate") ||
    migrated.pickerValues.includes("group:separate-two-qubit-measurement") ||
    !migrated.tabLabels.includes("Test") ||
    !migrated.tabButtonLabels.includes("Test") ||
    !migrated.tabLabels.includes("Entanglement 2") ||
    !migrated.tabLabels.includes("Entanglement 3") ||
    !migrated.tabButtonLabels.includes("Entanglement 2") ||
    !migrated.tabButtonLabels.includes("Entanglement 3") ||
    migrated.tabLabels.includes("Entanglement 1") ||
    migrated.tabButtonLabels.includes("Entanglement 1") ||
    migrated.keepGroupId !== "separate"
  ) {
    throw new Error(
      `Editor storage migration failed: ${JSON.stringify(migrated)}`,
    );
  }

  const canvas = page.locator("#playgroundCanvas");
  const canvasBox = await canvas.boundingBox();
  if (!canvasBox) {
    throw new Error("Missing editor canvas after migration reload");
  }
  await page.locator("#playgroundComponentSelect").selectOption("qubit");
  await page.mouse.click(canvasBox.x + 140, canvasBox.y + 140);
  await wait(150);
  await page.locator("#playgroundComponentSelect").selectOption("text-box");
  await page.mouse.click(canvasBox.x + 340, canvasBox.y + 190);
  await wait(150);
  await page.locator("#playgroundComponentSelect").selectOption("text-box");
  await page.mouse.click(canvasBox.x + 170, canvasBox.y + 345);
  await wait(150);

  const firstEditorTextBody = page
    .locator('#playgroundCanvas > .playground-node[data-component="text-box"]')
    .first()
    .locator('[data-role="text-box-body"]');
  await firstEditorTextBody.click();
  await page.keyboard.press(process.platform === "darwin" ? "Meta+A" : "Control+A");
  await page.keyboard.type("Remember to measure twice.");
  await page.evaluate(() => {
    const textBoxes = Array.from(document.querySelectorAll(
      '#playgroundCanvas > .playground-node[data-component="text-box"]',
    ));
    const setTextBox = (textBox, text, buttonMode) => {
      const body = textBox?.querySelector('[data-role="text-box-body"]');
      const select = textBox?.querySelector('[data-role="text-box-button-mode"]');
      if (body && typeof text === "string") {
        body.textContent = text;
        body.dispatchEvent(new Event("input", { bubbles: true }));
      }
      if (select) {
        select.value = buttonMode;
        select.dispatchEvent(new Event("change", { bubbles: true }));
      }
    };
    setTextBox(textBoxes[0], null, "next");
    setTextBox(textBoxes[1], "Second text box.", "done");
  });

  const editorTextBoxControls = await page.evaluate(() => {
    return Array.from(
      document.querySelectorAll(
        '#playgroundCanvas > .playground-node[data-component="text-box"]',
      ),
    ).map((textBox) => ({
      text:
        textBox.querySelector('[data-role="text-box-body"]')?.textContent ||
        "",
      buttons: Array.from(
        textBox.querySelectorAll('[data-role="text-box-action"]'),
      ).map((button) => button.textContent || ""),
    }));
  });
  if (
    editorTextBoxControls.length !== 2 ||
    editorTextBoxControls[0].buttons.join(",") !== "Next" ||
    editorTextBoxControls[1].buttons.join(",") !== "Done"
  ) {
    throw new Error(
      `Editor text box button controls failed: ${JSON.stringify(editorTextBoxControls)}`,
    );
  }

  await page.locator("#editorNewTabName").fill("Doc Smoke A");
  await page.locator("#playgroundSaveButton").click();
  await wait(250);

  const saved = await page.evaluate(() => {
    const state = JSON.parse(
      localStorage.getItem("quantum_generated_tabs_v1") || "{}",
    );
    const entry = (state.tabs || []).find(
      (tab) => tab.label === "Doc Smoke A",
    );
    const textBoxes = (entry?.layout?.items || []).filter(
      (item) => item.type === "text-box",
    );
    return {
      id: entry?.id || "",
      itemCount: entry?.layout?.items?.length || 0,
      qubitId: entry?.layout?.items?.find((item) => item.type === "qubit")
        ?.qubitId,
      textBoxes,
      tabExists: Boolean(entry?.id && document.querySelector(`#tab-${entry.id}`)),
      status: document.querySelector("#editorDocumentStatus")?.textContent || "",
    };
  });
  if (!saved.id || saved.itemCount === 0 || !saved.tabExists) {
    throw new Error(`Editor Save did not create a generated tab: ${JSON.stringify(saved)}`);
  }
  if (!Number.isSafeInteger(saved.qubitId) || saved.qubitId <= 0) {
    throw new Error(`Editor Save did not persist a numeric qubit id: ${JSON.stringify(saved)}`);
  }
  if (
    saved.textBoxes.length !== 2 ||
    saved.textBoxes[0]?.text !== "Remember to measure twice." ||
    saved.textBoxes[0]?.buttonMode !== "next" ||
    saved.textBoxes[1]?.text !== "Second text box." ||
    saved.textBoxes[1]?.buttonMode !== "done"
  ) {
    throw new Error(`Editor Save did not persist the text boxes: ${JSON.stringify(saved)}`);
  }
  if (!/Doc Smoke A/.test(saved.status)) {
    throw new Error(`Editor did not mark saved tab as current: ${saved.status}`);
  }

  await page.evaluate((tabId) => {
    localStorage.setItem(
      "quantum_whats_this_documents_v1",
      JSON.stringify({
        documents: [
          {
            tabId,
            title: "Doc Smoke Help",
            scenes: [
              {
                id: "doc-smoke-scene-1",
                title: "Scene 1",
                canvasWidth: 640,
                canvasHeight: 360,
                items: [
                  {
                    id: "doc-smoke-text",
                    type: "text-box",
                    left: 48,
                    top: 42,
                    width: 300,
                    height: 130,
                    text: "First doc scene.",
                    buttons: ["done"],
                    buttonMode: "done",
                  },
                  {
                    id: "doc-smoke-gate",
                    type: "single-gate",
                    left: 380,
                    top: 62,
                    width: 230,
                    height: 132,
                    singleGateTick: 0,
                  },
                ],
              },
              {
                id: "doc-smoke-scene-2",
                title: "Scene 2",
                canvasWidth: 640,
                canvasHeight: 360,
                items: [
                  {
                    id: "doc-smoke-text-2",
                    type: "text-box",
                    left: 48,
                    top: 42,
                    width: 300,
                    height: 130,
                    text: "Second doc scene.",
                    buttons: ["done"],
                    buttonMode: "done",
                  },
                ],
              },
            ],
          },
        ],
      }),
    );
  }, saved.id);
  await page.reload({ waitUntil: "domcontentloaded" });
  await page.locator(`#tab-${saved.id}`).click();
  await wait(250);
  const whatsThisPlacement = await page.evaluate((tabId) => {
    const panel = document.getElementById(`panel-${tabId}`);
    const reset = panel?.querySelector(
      '[data-generated-experiment-action="reset"]',
    );
    const whatsThis = panel?.querySelector(
      '[data-generated-document-action="whats-this"]',
    );
    const resetRect = reset?.getBoundingClientRect();
    const whatsRect = whatsThis?.getBoundingClientRect();
    return {
      hasButton: Boolean(whatsThis),
      belowReset:
        Boolean(resetRect && whatsRect) && whatsRect.top >= resetRect.bottom,
      leftAligned:
        Boolean(resetRect && whatsRect) &&
        Math.abs(whatsRect.left - resetRect.left) <= 16,
    };
  }, saved.id);
  if (
    !whatsThisPlacement.hasButton ||
    !whatsThisPlacement.belowReset ||
    !whatsThisPlacement.leftAligned
  ) {
    throw new Error(
      `What's this button placement failed: ${JSON.stringify(whatsThisPlacement)}`,
    );
  }

  await page
    .locator(`#panel-${saved.id} [data-generated-document-action="whats-this"]`)
    .click();
  await wait(250);
  const inlineDocState = await page.evaluate((tabId) => {
    const panel = document.getElementById(`panel-${tabId}`);
    const canvas = panel?.querySelector(".generated-layout-canvas");
    return {
      overlayHidden: document.getElementById("docRuntimeOverlay")?.hidden,
      docRuntime: canvas?.dataset.docRuntimeCanvas || "",
      tabId: canvas?.dataset.generatedTabId || "",
      qubits: panel?.querySelectorAll('[data-component="qubit"]').length || 0,
      texts: Array.from(
        panel?.querySelectorAll('[data-component="text-box"]') || [],
      ).map(
        (textBox) =>
          textBox.querySelector('[data-role="text-box-body"]')?.textContent ||
          "",
      ),
    };
  }, saved.id);
  if (
    inlineDocState.overlayHidden !== true ||
    inlineDocState.docRuntime !== "true" ||
    inlineDocState.tabId !== saved.id ||
    inlineDocState.qubits !== 0 ||
    inlineDocState.texts.join("|") !== "First doc scene."
  ) {
    throw new Error(
      `What's this did not replace the generated tab with the first doc scene: ${JSON.stringify(inlineDocState)}`,
    );
  }
  await page
    .locator(`#panel-${saved.id} [data-generated-experiment-action="reset"]`)
    .click();
  await wait(250);
  const restoredAfterDoc = await page.evaluate((tabId) => {
    const panel = document.getElementById(`panel-${tabId}`);
    const canvas = panel?.querySelector(".generated-layout-canvas");
    return {
      docRuntime: canvas?.dataset.docRuntimeCanvas || "",
      qubits: panel?.querySelectorAll('[data-component="qubit"]').length || 0,
      textCount: panel?.querySelectorAll('[data-component="text-box"]').length || 0,
    };
  }, saved.id);
  if (
    restoredAfterDoc.docRuntime ||
    restoredAfterDoc.qubits !== 1 ||
    restoredAfterDoc.textCount !== 2
  ) {
    throw new Error(
      `Reset did not restore the generated tab after What's this: ${JSON.stringify(restoredAfterDoc)}`,
    );
  }

  await page.locator("#tab-doc-editor").click();
  await page.locator("#docEditorTabSelect").selectOption(saved.id);
  await page.waitForSelector("#docEditorCanvas [data-component='text-box']");
  await page.waitForSelector("#docEditorCanvas [data-component='single-gate']");
  const dragDocEditorGateArrowToTick = async (targetTick) => {
    const points = await page.evaluate((tickIndex) => {
      const gate = document.querySelector(
        '#docEditorCanvas [data-component="single-gate"]',
      );
      const ticks = gate?.querySelector('[data-role="ticks"]');
      if (!gate || !ticks) {
        return null;
      }
      const rect = ticks.getBoundingClientRect();
      const activeTick = Array.from(ticks.querySelectorAll(".tick")).findIndex(
        (tick) => tick.classList.contains("active"),
      );
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const startRadius = Math.min(rect.width, rect.height) * 0.22;
      const endRadius = Math.min(rect.width, rect.height) * 0.36;
      const pointForTick = (tick, radius) => {
        const angle = ((tick % 12) * 30 * Math.PI) / 180;
        return {
          x: centerX + Math.sin(angle) * radius,
          y: centerY - Math.cos(angle) * radius,
        };
      };
      const start = pointForTick(activeTick >= 0 ? activeTick : 0, startRadius);
      const end = pointForTick(tickIndex, endRadius);
      return { start, end };
    }, targetTick);
    if (!points) {
      throw new Error("Missing Doc Editor gate dial points");
    }
    await page.mouse.move(points.start.x, points.start.y);
    await page.mouse.down();
    await page.mouse.move(points.end.x, points.end.y, { steps: 10 });
    await page.mouse.up();
    await wait(250);
  };
  const docEditorGateState = () =>
    page.evaluate(() => {
      const gate = document.querySelector(
        '#docEditorCanvas [data-component="single-gate"]',
      );
      const ticks = Array.from(gate?.querySelectorAll(".tick") || []);
      return {
        left: Number.parseFloat(gate?.style.left || "0"),
        top: Number.parseFloat(gate?.style.top || "0"),
        activeTick: ticks.findIndex((tick) => tick.classList.contains("active")),
      };
    });
  const setupGateBefore = await docEditorGateState();
  await dragDocEditorGateArrowToTick(3);
  const setupGateAfter = await docEditorGateState();
  if (
    setupGateAfter.activeTick !== 3 ||
    Math.abs(setupGateAfter.left - setupGateBefore.left) > 2 ||
    Math.abs(setupGateAfter.top - setupGateBefore.top) > 2
  ) {
    throw new Error(
      `Doc Editor gate dial drag moved the gate or missed the tick in setup mode: before=${JSON.stringify(
        setupGateBefore,
      )} after=${JSON.stringify(setupGateAfter)}`,
    );
  }
  const persistedSetupGateTick = await page.evaluate((tabId) => {
    const docs = JSON.parse(
      localStorage.getItem("quantum_whats_this_documents_v1") || "{}",
    ).documents || [];
    return docs
      .find((doc) => doc.tabId === tabId)
      ?.scenes?.[0]?.items?.find((item) => item.id === "doc-smoke-gate")
      ?.singleGateTick;
  }, saved.id);
  if (persistedSetupGateTick !== 3) {
    throw new Error(
      `Doc Editor gate tick was not saved in setup mode: ${persistedSetupGateTick}`,
    );
  }
  await page.locator("#docEditorStartRecordingButton").click();
  await wait(200);
  const recordingStarted = await page.evaluate(() => ({
    recording: document
      .querySelector("#docEditorCanvas")
      ?.classList.contains("generated-recording-active"),
    startDisabled: document.querySelector("#docEditorStartRecordingButton")?.disabled,
    stopDisabled: document.querySelector("#docEditorStopRecordingButton")?.disabled,
  }));
  if (
    !recordingStarted.recording ||
    recordingStarted.startDisabled !== true ||
    recordingStarted.stopDisabled !== false
  ) {
    throw new Error(
      `Doc Editor recording did not start for gate dial smoke: ${JSON.stringify(recordingStarted)}`,
    );
  }
  await dragDocEditorGateArrowToTick(6);
  const recordingGateAfter = await docEditorGateState();
  if (recordingGateAfter.activeTick !== 6) {
    throw new Error(
      `Doc Editor gate dial did not move while recording: ${JSON.stringify(recordingGateAfter)}`,
    );
  }
  await page.locator("#docEditorStopRecordingButton").click();
  await wait(350);
  const recordedGateTickState = await page.evaluate((tabId) => {
    const docs = JSON.parse(
      localStorage.getItem("quantum_whats_this_documents_v1") || "{}",
    ).documents || [];
    const scene = docs.find((doc) => doc.tabId === tabId)?.scenes?.[0];
    return {
      setupTick: scene?.items?.find((item) => item.id === "doc-smoke-gate")
        ?.singleGateTick,
      gateSettings: scene?.experiment?.gateSettings || [],
      actions: scene?.experiment?.actions || [],
    };
  }, saved.id);
  const recordedGateSetting = recordedGateTickState.gateSettings.find(
    (entry) => entry.itemId === "doc-smoke-gate",
  );
  const recordedGateAction = recordedGateTickState.actions.find(
    (action) =>
      action.type === "gate-setting" && action.gateId === "doc-smoke-gate",
  );
  if (
    recordedGateTickState.setupTick !== 3 ||
    recordedGateSetting?.tickIndex !== 3 ||
    recordedGateAction?.tickIndex !== 6
  ) {
    throw new Error(
      `Doc Editor gate dial recording did not preserve setup and recorded ticks: ${JSON.stringify(recordedGateTickState)}`,
    );
  }
  const docTextBoxBody = page.locator(
    "#docEditorCanvas [data-component='text-box'] [data-role='text-box-body']",
  );
  await docTextBoxBody.click();
  await wait(100);
  const deleteEnabledAfterSelect = await page
    .locator("#docEditorDeleteComponentButton")
    .evaluate((button) => !button.disabled);
  if (!deleteEnabledAfterSelect) {
    throw new Error("Doc Editor text box click did not enable Delete");
  }
  const docTextBox = page.locator("#docEditorCanvas [data-component='text-box']");
  const docTextBoxBeforeDrag = await rectCenter(docTextBox);
  const docBodyBox = await docTextBoxBody.boundingBox();
  if (!docBodyBox) {
    throw new Error("Missing Doc Editor text box body bounds");
  }
  await page.mouse.move(
    docBodyBox.x + docBodyBox.width / 2,
    docBodyBox.y + docBodyBox.height / 2,
  );
  await page.mouse.down();
  await page.mouse.move(
    docBodyBox.x + docBodyBox.width / 2 + 76,
    docBodyBox.y + docBodyBox.height / 2 + 24,
    { steps: 8 },
  );
  await page.mouse.up();
  await wait(200);
  const docTextBoxAfterDrag = await rectCenter(docTextBox);
  if (
    docTextBoxAfterDrag.x - docTextBoxBeforeDrag.x < 40 ||
    docTextBoxAfterDrag.y - docTextBoxBeforeDrag.y < 10
  ) {
    throw new Error(
      `Doc Editor text box did not drag: before=${JSON.stringify(
        docTextBoxBeforeDrag,
      )} after=${JSON.stringify(docTextBoxAfterDrag)}`,
    );
  }
  await docTextBoxBody.fill("Edited doc text box.");
  const docTextEdited = await docTextBoxBody.textContent();
  if (docTextEdited !== "Edited doc text box.") {
    throw new Error(`Doc Editor text box edit failed: ${docTextEdited}`);
  }
  await docTextBoxBody.click();
  await page.locator("#docEditorDeleteComponentButton").click();
  await wait(200);
  const remainingDocTextBoxes = await page
    .locator("#docEditorCanvas [data-component='text-box']")
    .count();
  if (remainingDocTextBoxes !== 0) {
    throw new Error(
      `Doc Editor text box delete failed: remaining=${remainingDocTextBoxes}`,
    );
  }
  await page.locator(`#tab-${saved.id}`).click();
  await wait(250);

  const visibleTextBoxes = async () =>
    page.evaluate((tabId) => {
      const panel = document.getElementById(`panel-${tabId}`);
      return Array.from(
        panel?.querySelectorAll('.playground-node[data-component="text-box"]') ||
          [],
      )
        .filter((textBox) => !textBox.hidden)
        .map((textBox) => ({
          text:
            textBox.querySelector('[data-role="text-box-body"]')?.textContent ||
            "",
          buttons: Array.from(
            textBox.querySelectorAll('[data-role="text-box-action"]'),
          ).map((button) => button.textContent || ""),
        }));
    }, saved.id);
  const firstRuntimeTextBoxes = await visibleTextBoxes();
  if (
    firstRuntimeTextBoxes.length !== 1 ||
    firstRuntimeTextBoxes[0].text !== "Remember to measure twice." ||
    firstRuntimeTextBoxes[0].buttons.join(",") !== "Next"
  ) {
    throw new Error(
      `Generated tab did not start on the first text box: ${JSON.stringify(firstRuntimeTextBoxes)}`,
    );
  }
  await page
    .locator(
      `#panel-${saved.id} [data-role="text-box-action"][data-text-box-action="next"]`,
    )
    .click();
  await wait(100);
  const secondRuntimeTextBoxes = await visibleTextBoxes();
  if (
    secondRuntimeTextBoxes.length !== 1 ||
    secondRuntimeTextBoxes[0].text !== "Second text box." ||
    secondRuntimeTextBoxes[0].buttons.join(",") !== "Done"
  ) {
    throw new Error(
      `Generated tab text box Next button failed: ${JSON.stringify(secondRuntimeTextBoxes)}`,
    );
  }
  await page
    .locator(
      `#panel-${saved.id} [data-role="text-box-action"][data-text-box-action="done"]`,
    )
    .click();
  await wait(100);
  const closedRuntimeTextBoxes = await visibleTextBoxes();
  if (closedRuntimeTextBoxes.length !== 0) {
    throw new Error(
      `Generated tab text box Done button failed: ${JSON.stringify(closedRuntimeTextBoxes)}`,
    );
  }
  await page.locator("#tab-plaground").click();
  await wait(150);

  await page.locator("#playgroundSaveButton").click();
  await wait(200);
  const saveSameNameCount = await page.evaluate(() => {
    const state = JSON.parse(
      localStorage.getItem("quantum_generated_tabs_v1") || "{}",
    );
    return (state.tabs || []).filter((tab) => tab.label === "Doc Smoke A")
      .length;
  });
  if (saveSameNameCount !== 1) {
    throw new Error(`Editor Save created a duplicate tab: ${saveSameNameCount}`);
  }

  await page.locator("#editorNewTabButton").click();
  await wait(150);
  const blankCount = await page.locator("#playgroundCanvas > .playground-node").count();
  const blankStatus = await page.locator("#editorDocumentStatus").textContent();
  if (blankCount !== 0 || !/Untitled/.test(blankStatus || "")) {
    throw new Error(
      `Editor New did not create a blank untitled document: count=${blankCount}, status=${blankStatus}`,
    );
  }

  const openButtonCount = await page.locator("#editorOpenTabButton").count();
  if (openButtonCount !== 0) {
    throw new Error("Editor still renders the redundant Open button");
  }

  await page.locator("#editorTargetTabSelect").selectOption(saved.id);
  await wait(250);
  const reopenedCount = await page.locator("#playgroundCanvas > .playground-node").count();
  const reopenedStatus = await page.locator("#editorDocumentStatus").textContent();
  const reopenedTextBox = await page.evaluate(() => {
    const textBox = document.querySelector(
      '#playgroundCanvas > .playground-node[data-component="text-box"]',
    );
    return {
      text:
        textBox?.querySelector('[data-role="text-box-body"]')?.textContent ||
        "",
      button:
        textBox?.querySelector('[data-role="text-box-action"]')?.textContent ||
        "",
    };
  });
  if (
    reopenedCount !== saved.itemCount ||
    !/Doc Smoke A/.test(reopenedStatus || "") ||
    reopenedTextBox.text !== "Remember to measure twice." ||
    reopenedTextBox.button !== "Next"
  ) {
    throw new Error(
      `Editor tab select did not restore the saved tab: count=${reopenedCount}, status=${reopenedStatus}, textBox=${JSON.stringify(reopenedTextBox)}`,
    );
  }

  await page.locator("#editorNewTabName").fill("Doc Smoke Copy");
  await page.locator("#playgroundSaveAsButton").click();
  await wait(250);
  const copied = await page.evaluate(() => {
    const state = JSON.parse(
      localStorage.getItem("quantum_generated_tabs_v1") || "{}",
    );
    const entry = (state.tabs || []).find(
      (tab) => tab.label === "Doc Smoke Copy",
    );
    return {
      id: entry?.id || "",
      itemCount: entry?.layout?.items?.length || 0,
      status: document.querySelector("#editorDocumentStatus")?.textContent || "",
    };
  });
  if (!copied.id || copied.itemCount !== saved.itemCount || !/Doc Smoke Copy/.test(copied.status)) {
    throw new Error(`Editor Save As did not create the copy: ${JSON.stringify(copied)}`);
  }

  const sourceTabBox = await page.locator(`#tab-${copied.id}`).boundingBox();
  const targetTabBox = await page.locator(`#tab-${saved.id}`).boundingBox();
  if (!sourceTabBox || !targetTabBox) {
    throw new Error("Missing generated tab button bounds for reorder smoke");
  }
  await page.mouse.move(
    sourceTabBox.x + sourceTabBox.width / 2,
    sourceTabBox.y + sourceTabBox.height / 2,
  );
  await page.mouse.down();
  await page.mouse.move(
    targetTabBox.x + 6,
    targetTabBox.y + targetTabBox.height / 2,
    { steps: 8 },
  );
  await page.mouse.up();
  await wait(250);
  const reordered = await page.evaluate((ids) => {
    const state = JSON.parse(
      localStorage.getItem("quantum_generated_tabs_v1") || "{}",
    );
    const storedOrder = (state.tabs || []).map((tab) => tab.id);
    const domOrder = Array.from(
      document.querySelectorAll(".tab-btn[data-generated-tab='true']"),
    ).map((tab) => tab.getAttribute("data-tab-target"));
    const selectOrder = Array.from(
      document.querySelectorAll("#editorTargetTabSelect option"),
    )
      .map((option) => option.value)
      .filter((value) => value !== "__none__");
    return {
      copiedBeforeOriginal:
        storedOrder.indexOf(ids.copyId) >= 0 &&
        storedOrder.indexOf(ids.savedId) >= 0 &&
        storedOrder.indexOf(ids.copyId) < storedOrder.indexOf(ids.savedId),
      domCopiedBeforeOriginal:
        domOrder.indexOf(ids.copyId) >= 0 &&
        domOrder.indexOf(ids.savedId) >= 0 &&
        domOrder.indexOf(ids.copyId) < domOrder.indexOf(ids.savedId),
      selectCopiedBeforeOriginal:
        selectOrder.indexOf(ids.copyId) >= 0 &&
        selectOrder.indexOf(ids.savedId) >= 0 &&
        selectOrder.indexOf(ids.copyId) < selectOrder.indexOf(ids.savedId),
      storedOrder,
      domOrder,
      selectOrder,
    };
  }, { copyId: copied.id, savedId: saved.id });
  if (
    !reordered.copiedBeforeOriginal ||
    !reordered.domCopiedBeforeOriginal ||
    !reordered.selectCopiedBeforeOriginal
  ) {
    throw new Error(`Generated tab reorder failed: ${JSON.stringify(reordered)}`);
  }

  await page.locator("#editorNewTabName").fill("Doc Smoke Renamed");
  await page.locator("#editorRenameTabButton").click();
  await wait(250);
  const renamed = await page.evaluate((copyId) => {
    const state = JSON.parse(
      localStorage.getItem("quantum_generated_tabs_v1") || "{}",
    );
    const entry = (state.tabs || []).find((tab) => tab.id === copyId);
    return {
      label: entry?.label || "",
      tabText: document.querySelector(`#tab-${copyId}`)?.textContent?.trim() || "",
      status: document.querySelector("#editorDocumentStatus")?.textContent || "",
    };
  }, copied.id);
  if (
    renamed.label !== "Doc Smoke Renamed" ||
    renamed.tabText !== "Doc Smoke Renamed" ||
    !/Doc Smoke Renamed/.test(renamed.status)
  ) {
    throw new Error(`Editor Rename did not update the current tab: ${JSON.stringify(renamed)}`);
  }

  page.once("dialog", async (dialog) => {
    if (dialog.type() !== "confirm") {
      throw new Error(`Expected Delete Tab confirm, saw ${dialog.type()}`);
    }
    await dialog.accept();
  });
  await page.locator("#editorDeleteTabButton").click();
  await wait(250);
  const deleted = await page.evaluate((copyId) => {
    const state = JSON.parse(
      localStorage.getItem("quantum_generated_tabs_v1") || "{}",
    );
    return {
      stillStored: (state.tabs || []).some((tab) => tab.id === copyId),
      stillInDom: Boolean(document.querySelector(`#tab-${copyId}`)),
      editorCount: document.querySelectorAll("#playgroundCanvas > .playground-node")
        .length,
      status: document.querySelector("#editorDocumentStatus")?.textContent || "",
    };
  }, copied.id);
  if (
    deleted.stillStored ||
    deleted.stillInDom ||
    deleted.editorCount !== 0 ||
    !/Untitled/.test(deleted.status)
  ) {
    throw new Error(`Editor Delete did not remove the current tab: ${JSON.stringify(deleted)}`);
  }
}

async function runDocEditorMeasurementRecordingSmoke(page) {
  await page.evaluate(() => {
    localStorage.setItem(
      "quantum_generated_tabs_v1",
      JSON.stringify({
        tabs: [
          {
            id: "doc-measure-recording",
            label: "Doc Measure Recording",
            layout: { items: [], canvasWidth: 760, canvasHeight: 420 },
          },
        ],
      }),
    );
    localStorage.setItem(
      "quantum_whats_this_documents_v1",
      JSON.stringify({
        documents: [
          {
            tabId: "doc-measure-recording",
            title: "Measurement Recording",
            scenes: [
              {
                id: "doc-measure-scene",
                title: "Scene 1",
                canvasWidth: 760,
                canvasHeight: 420,
                items: [
                  {
                    id: "doc-measure-q",
                    type: "qubit",
                    left: 80,
                    top: 170,
                    width: 52,
                    height: 52,
                  },
                  {
                    id: "doc-measure-stage",
                    type: "single-measurement",
                    left: 300,
                    top: 80,
                    width: 330,
                    height: 240,
                  },
                ],
              },
            ],
          },
        ],
      }),
    );
  });
  await page.reload({ waitUntil: "domcontentloaded" });
  await page.locator("#tab-doc-editor").click();
  await page.locator("#docEditorTabSelect").selectOption("doc-measure-recording");
  await page.waitForSelector("#docEditorCanvas [data-component='qubit']");
  await page.waitForSelector(
    "#docEditorCanvas [data-component='single-measurement']",
  );
  await page.locator("#docEditorStartRecordingButton").click();
  await wait(150);

  const qubitCenter = await rectCenter(
    page.locator("#docEditorCanvas [data-component='qubit']"),
  );
  const toolCenter = await rectCenter(
    page.locator("#docEditorCanvas [data-role='measurement-tool']"),
  );
  await page.mouse.move(qubitCenter.x, qubitCenter.y);
  await page.mouse.down();
  await page.mouse.move(qubitCenter.x + 90, qubitCenter.y, { steps: 5 });
  await page.mouse.move(toolCenter.x - 80, toolCenter.y, { steps: 5 });
  await page.mouse.move(toolCenter.x, toolCenter.y, { steps: 10 });
  await page.mouse.up();

  const readDocMeasurementState = () =>
    page.evaluate(() => {
      const canvas = document.querySelector("#docEditorCanvas");
      const qubit = canvas?.querySelector('[data-component="qubit"]');
      const measurement = canvas?.querySelector(
        '[data-component="single-measurement"]',
      );
      const blue = Number(
        measurement
          ?.querySelector('[data-role="tube-blue-count"]')
          ?.textContent?.trim() || 0,
      );
      const red = Number(
        measurement
          ?.querySelector('[data-role="tube-red-count"]')
          ?.textContent?.trim() || 0,
      );
      const blueHeight = Number.parseFloat(
        measurement?.querySelector('[data-role="tube-blue-liquid"]')?.style
          .height || "0",
      );
      const redHeight = Number.parseFloat(
        measurement?.querySelector('[data-role="tube-red-liquid"]')?.style
          .height || "0",
      );
      return {
        blue,
        red,
        total: blue + red,
        qubitLeft: Math.round(parseFloat(qubit?.style.left || "0")),
        qubitTop: Math.round(parseFloat(qubit?.style.top || "0")),
        blueHeight,
        redHeight,
        recording: canvas?.classList.contains("generated-recording-active"),
        playing: Boolean(generatedExperimentStateForCanvas(canvas)?.playing),
        playbackResultVisible: Boolean(
          generatedExperimentStateForCanvas(canvas)?.playbackResultVisible,
        ),
        iterations:
          measurement
            ?.querySelector('[data-role="measurement-count"]')
            ?.value || "",
        status:
          document.querySelector("#docEditorRecordingStatus")?.textContent ||
          "",
        actions:
          generatedExperimentStateForCanvas(canvas)?.experiment?.actions?.map(
            (action) => ({
              type: action.type,
              iterations: action.iterations,
            }),
          ) || [],
      };
    });

  const waitForDocMeasurementState = async (predicate, timeout = 12000) => {
    const deadline = Date.now() + timeout;
    let latest = null;
    while (Date.now() < deadline) {
      latest = await readDocMeasurementState();
      if (predicate(latest)) {
        return latest;
      }
      await wait(150);
    }
    return latest;
  };

  const state = await waitForDocMeasurementState((latest) => latest.total >= 1);

  if (
    !state ||
    state.total !== 1 ||
    Math.max(state.blueHeight, state.redHeight) <= 0 ||
    state.recording !== true
  ) {
    throw new Error(
      `Doc Editor UI measurement recording did not update test tubes: ${JSON.stringify(state)}`,
    );
  }

  const countSelect = page.locator(
    "#docEditorCanvas [data-role='measurement-count']",
  );
  await countSelect.selectOption("5");
  await wait(120);
  await countSelect.selectOption("10000");
  await page.locator("#docEditorCanvas [data-role='measurement-tool']").click();
  const queuedState = await waitForDocMeasurementState(
    (latest) =>
      latest.total === 20000 &&
      latest.playing === false &&
      latest.actions
        .map((action) => action.type)
        .join(",")
        .endsWith(
          "single-measure,experiment-count,experiment-count,experiment-repeat",
        ),
    20000,
  );
  const queuedIterations = (queuedState?.actions || [])
    .filter(
      (action) =>
        action.type === "experiment-count" ||
        action.type === "experiment-repeat",
    )
    .map((action) => action.iterations)
    .join(",");
  if (
    !queuedState ||
    queuedState.total !== 20000 ||
    queuedIterations !== "5,10000,10000" ||
    queuedState.recording !== true
  ) {
    throw new Error(
      `Doc Editor queued recording controls did not persist the 10000 run: ${JSON.stringify(queuedState)}`,
    );
  }

  await page.locator("#docEditorStopRecordingButton").click();
  await wait(350);
  const stoppedState = await page.evaluate(() => {
    const canvas = document.querySelector("#docEditorCanvas");
    const qubit = canvas?.querySelector('[data-component="qubit"]');
    const measurement = canvas?.querySelector(
      '[data-component="single-measurement"]',
    );
    const blue = Number(
      measurement
        ?.querySelector('[data-role="tube-blue-count"]')
        ?.textContent?.trim() || 0,
    );
    const red = Number(
      measurement
        ?.querySelector('[data-role="tube-red-count"]')
        ?.textContent?.trim() || 0,
    );
    const documents = JSON.parse(
      localStorage.getItem("quantum_whats_this_documents_v1") || "{}",
    ).documents || [];
    const documentEntry = documents.find(
      (entry) => entry.tabId === "doc-measure-recording",
    );
    const scene = documentEntry?.scenes?.[0];
    const storedQubit = scene?.items?.find((item) => item.id === "doc-measure-q");
    const storedMeasurement = scene?.items?.find(
      (item) => item.id === "doc-measure-stage",
    );
    return {
      recording: canvas?.classList.contains("generated-recording-active"),
      layoutEditActive: document.body.classList.contains("layout-edit-active"),
      liveTotal: blue + red,
      liveQubitLeft: Math.round(parseFloat(qubit?.style.left || "0")),
      liveQubitTop: Math.round(parseFloat(qubit?.style.top || "0")),
      storedQubitLeft: storedQubit?.left,
      storedQubitTop: storedQubit?.top,
      storedMeasurementStatePresent: Boolean(storedMeasurement?.measurementState),
      experimentActions: scene?.experiment?.actions?.map(
        (action) => action.type,
      ),
    };
  });
  if (
    stoppedState.recording !== false ||
    stoppedState.layoutEditActive !== true ||
    stoppedState.liveTotal !== 20000 ||
    stoppedState.liveQubitLeft <= 250 ||
    stoppedState.storedQubitLeft !== 80 ||
    stoppedState.storedQubitTop !== 170 ||
    stoppedState.storedMeasurementStatePresent !== false ||
    !stoppedState.experimentActions
      ?.join(",")
      .endsWith(
        "single-measure,experiment-count,experiment-count,experiment-repeat",
      )
  ) {
    throw new Error(
      `Doc Editor recording stop did not preserve live final state while keeping stored scene initial: ${JSON.stringify(stoppedState)}`,
    );
  }

  await page.evaluate(() => renderDocumentEditorScene());
  const rerenderedInitialState = await readDocMeasurementState();
  if (
    rerenderedInitialState.total !== 0 ||
    Math.abs(rerenderedInitialState.qubitLeft - 80) > 4 ||
    Math.abs(rerenderedInitialState.qubitTop - 170) > 4 ||
    rerenderedInitialState.iterations !== "1" ||
    rerenderedInitialState.playbackResultVisible !== false
  ) {
    throw new Error(
      `Doc Editor recorded scene did not reopen at the experiment start: ${JSON.stringify(rerenderedInitialState)}`,
    );
  }

  await page.evaluate(() => {
    window.__docPlaybackAnimatedReplayCount = 0;
    const originalReplay = replayGeneratedRecordedExperimentAnimated;
    window.__restoreDocPlaybackAnimatedReplay = () => {
      replayGeneratedRecordedExperimentAnimated = originalReplay;
    };
    replayGeneratedRecordedExperimentAnimated = async (...args) => {
      window.__docPlaybackAnimatedReplayCount += 1;
      return originalReplay(...args);
    };
  });
  await page.locator("#docEditorPlayRecordingButton").click();
  const playbackState = await waitForDocMeasurementState(
    (latest) =>
      latest.total === 20000 &&
      latest.playing === false &&
      latest.playbackResultVisible === true,
    20000,
  );
  const playbackAnimatedReplays = await page.evaluate(() => {
    const count = window.__docPlaybackAnimatedReplayCount || 0;
    window.__restoreDocPlaybackAnimatedReplay?.();
    delete window.__restoreDocPlaybackAnimatedReplay;
    delete window.__docPlaybackAnimatedReplayCount;
    return count;
  });
  if (
    !playbackState ||
    playbackState.total !== 20000 ||
    playbackState.qubitLeft <= 250 ||
    playbackState.iterations !== "10000" ||
    playbackState.playbackResultVisible !== true ||
    playbackAnimatedReplays !== 0
  ) {
    throw new Error(
      `Doc Editor high-count playback animated instead of batch-running: ${JSON.stringify({ playbackState, playbackAnimatedReplays })}`,
    );
  }
}

async function runDocEditorTwoQubitPlaybackSmoke(page) {
  const result = await page.evaluate(async () => {
    const previousSpeed = generatedExperimentPlaybackSpeed;
    const previousLayoutEditEnabled = layoutEditorState.enabled;
    generatedExperimentPlaybackSpeed = 40;
    const canvas = document.createElement("div");
    canvas.className =
      "generated-layout-canvas playground-canvas doc-editor-canvas";
    canvas.dataset.docEditorCanvas = "true";
    canvas.dataset.generatedTabId = "doc-two-qubit-playback-smoke";
    canvas.style.width = "1120px";
    canvas.style.height = "520px";
    const q1 = createGeneratedLayoutItemNode("qubit", {
      id: "duplicated-qubit-id",
      qubitId: 201,
      left: 64,
      top: 90,
      width: 52,
      height: 52,
    });
    const q2 = createGeneratedLayoutItemNode("qubit", {
      id: "duplicated-qubit-id",
      qubitId: 201,
      left: 64,
      top: 285,
      width: 52,
      height: 52,
    });
    const gate1 = createGeneratedLayoutItemNode("single-gate", {
      id: "doc-two-gate-a",
      left: 220,
      top: 50,
      width: 250,
      height: 130,
      singleGateTick: 3,
    });
    const gate2 = createGeneratedLayoutItemNode("single-gate", {
      id: "doc-two-gate-b",
      left: 220,
      top: 245,
      width: 250,
      height: 130,
      singleGateTick: 6,
    });
    const cnot = createGeneratedLayoutItemNode("cnot-gate", {
      id: "doc-two-cnot",
      left: 500,
      top: 135,
      width: 240,
      height: 190,
      z: 80,
    });
    const measurement = createGeneratedLayoutItemNode("double-measurement", {
      id: "doc-two-measure",
      left: 760,
      top: 120,
      width: 330,
      height: 250,
    });
    canvas.append(q1, q2, gate1, gate2, cnot, measurement);
    document.body.appendChild(canvas);
    let result = null;
    try {
      prepareGeneratedLayoutCanvas(canvas);
      layoutGeneratedSingleGateDials(canvas);
      const idsAfterPrepare = [q1.dataset.generatedItemId, q2.dataset.generatedItemId];
      const logicalIdsAfterPrepare = [
        qubitLogicalIdForItem(q1),
        qubitLogicalIdForItem(q2),
      ];
      beginGeneratedExperimentRecording(canvas);
      await runGeneratedSingleGateTransit(
        canvas,
        q1,
        initializeGeneratedSingleGateItem(gate1),
      );
      await runGeneratedSingleGateTransit(
        canvas,
        q2,
        initializeGeneratedSingleGateItem(gate2),
      );
      const cnotRuntime = initializeGeneratedCnotItem(cnot);
      await runGeneratedCnotIngress(canvas, q1, cnotRuntime, "top");
      const cnotFirstSlotLayer = {
        active: q1.classList.contains("generated-transit-active"),
        zIndex: Number.parseInt(getComputedStyle(q1).zIndex, 10),
        cnotZIndex: Number.parseInt(getComputedStyle(cnot).zIndex, 10),
      };
      await runGeneratedCnotIngress(canvas, q2, cnotRuntime, "bottom");
      const cnotSecondSlotLayer = {
        topActive: q1.classList.contains("generated-transit-active"),
        bottomActive: q2.classList.contains("generated-transit-active"),
        topZIndex: Number.parseInt(getComputedStyle(q1).zIndex, 10),
        bottomZIndex: Number.parseInt(getComputedStyle(q2).zIndex, 10),
        cnotZIndex: Number.parseInt(getComputedStyle(cnot).zIndex, 10),
      };
      if (cnotRuntime.cyclePromise) {
        await cnotRuntime.cyclePromise;
      }
      const measurementRuntime =
        initializeGeneratedDoubleMeasurementItem(measurement);
      await runGeneratedDoubleMeasurementIngress(canvas, q1, measurementRuntime);
      const firstSlotLayer = {
        active: q1.classList.contains("generated-transit-active"),
        zIndex: Number.parseInt(getComputedStyle(q1).zIndex, 10),
      };
      await runGeneratedDoubleMeasurementIngress(canvas, q2, measurementRuntime);
      const secondSlotLayer = {
        active: q2.classList.contains("generated-transit-active"),
        zIndex: Number.parseInt(getComputedStyle(q2).zIndex, 10),
      };
      if (measurementRuntime.cyclePromise) {
        await measurementRuntime.cyclePromise;
      }
      syncDraftGeneratedExperimentFromRecording(canvas);
      const state = generatedExperimentStateForCanvas(canvas);
      const experiment = cloneGeneratedExperiment(state.experiment);
      const actions = (experiment?.actions || []).map((action) => ({
        type: action.type,
        qubitId: action.qubitId || "",
        qubitLogicalId: action.qubitLogicalId,
        leftQubitId: action.leftQubitId || "",
        leftQubitLogicalId: action.leftQubitLogicalId,
        rightQubitId: action.rightQubitId || "",
        rightQubitLogicalId: action.rightQubitLogicalId,
        topQubitId: action.topQubitId || "",
        topQubitLogicalId: action.topQubitLogicalId,
        bottomQubitId: action.bottomQubitId || "",
        bottomQubitLogicalId: action.bottomQubitLogicalId,
        gateId: action.gateId || "",
        cnotId: action.cnotId || "",
      }));
      finishGeneratedExperimentRecording(canvas);
      state.experiment = experiment;
      clearGeneratedMeasurementsForCanvas(canvas);
      resetGeneratedCanvasToExperimentStart(canvas, experiment);
      const cnotAction = experiment.actions.find(
        (action) => action.type === "cnot",
      );
      const doubleAction = experiment.actions.find(
        (action) => action.type === "double-measure",
      );
      const directCnotReplay = replayGeneratedRecordedCnotAction(
        canvas,
        cnotAction,
      );
      const replayCnotLayer = {
        topActive: q1.classList.contains("generated-transit-active"),
        bottomActive: q2.classList.contains("generated-transit-active"),
        topZIndex: Number.parseInt(getComputedStyle(q1).zIndex, 10),
        bottomZIndex: Number.parseInt(getComputedStyle(q2).zIndex, 10),
        cnotZIndex: Number.parseInt(getComputedStyle(cnot).zIndex, 10),
      };
      const directCnotCompleted = await directCnotReplay;
      resetGeneratedCanvasToExperimentStart(canvas, experiment);
      const initialCenters = generatedExperimentInitialCenterMap(experiment);
      const directDoubleReplay = replayGeneratedRecordedDoubleMeasureAction(
        canvas,
        doubleAction,
        initialCenters,
      );
      const replaySlotLayer = {
        leftActive: q1.classList.contains("generated-transit-active"),
        rightActive: q2.classList.contains("generated-transit-active"),
        leftZIndex: Number.parseInt(getComputedStyle(q1).zIndex, 10),
        rightZIndex: Number.parseInt(getComputedStyle(q2).zIndex, 10),
      };
      const directDoubleCompleted = await directDoubleReplay;
      clearGeneratedMeasurementsForCanvas(canvas);
      state.experiment = experiment;
      const replayCompleted = await runGeneratedRecordedExperiment(canvas, 1);
      const q1Center = generatedCanvasPointForElementCenter(canvas, q1);
      const q2Center = generatedCanvasPointForElementCenter(canvas, q2);
      result = {
        idsAfterPrepare,
        logicalIdsAfterPrepare,
        uniqueIds: new Set(idsAfterPrepare).size,
        uniqueLogicalIds: new Set(logicalIdsAfterPrepare).size,
        actions,
        cnotFirstSlotLayer,
        cnotSecondSlotLayer,
        replayCnotLayer,
        directCnotCompleted,
        firstSlotLayer,
        secondSlotLayer,
        replaySlotLayer,
        directDoubleCompleted,
        replayCompleted,
        q1Center,
        q2Center,
      };
    } finally {
      canvas.remove();
      generatedExperimentPlaybackSpeed = previousSpeed;
      if (layoutEditorState.enabled !== previousLayoutEditEnabled) {
        setLayoutEditEnabled(previousLayoutEditEnabled);
      }
    }
    return result;
  });
  const gateActions = result.actions.filter((action) => action.type === "gate");
  const cnotAction = result.actions.find((action) => action.type === "cnot");
  const doubleAction = result.actions.find(
    (action) => action.type === "double-measure",
  );
  if (
    result.uniqueIds !== 2 ||
    result.uniqueLogicalIds !== 2 ||
    gateActions.length !== 2 ||
    !gateActions[0].qubitId ||
    !gateActions[1].qubitId ||
    gateActions[0].qubitId === gateActions[1].qubitId ||
    !gateActions[0].qubitLogicalId ||
    !gateActions[1].qubitLogicalId ||
    gateActions[0].qubitLogicalId === gateActions[1].qubitLogicalId ||
    !cnotAction ||
    !cnotAction.cnotId ||
    cnotAction.topQubitId === cnotAction.bottomQubitId ||
    cnotAction.topQubitLogicalId === cnotAction.bottomQubitLogicalId ||
    !result.cnotFirstSlotLayer.active ||
    result.cnotFirstSlotLayer.zIndex < 10000 ||
    result.cnotFirstSlotLayer.cnotZIndex !== 80 ||
    !result.cnotSecondSlotLayer.topActive ||
    !result.cnotSecondSlotLayer.bottomActive ||
    result.cnotSecondSlotLayer.topZIndex < 10000 ||
    result.cnotSecondSlotLayer.bottomZIndex < 10000 ||
    result.cnotSecondSlotLayer.cnotZIndex !== 80 ||
    !result.replayCnotLayer.topActive ||
    !result.replayCnotLayer.bottomActive ||
    result.replayCnotLayer.topZIndex < 10000 ||
    result.replayCnotLayer.bottomZIndex < 10000 ||
    result.replayCnotLayer.cnotZIndex !== 80 ||
    result.directCnotCompleted !== true ||
    !doubleAction ||
    doubleAction.leftQubitId === doubleAction.rightQubitId ||
    doubleAction.leftQubitLogicalId === doubleAction.rightQubitLogicalId ||
    !doubleAction.topQubitId ||
    !doubleAction.bottomQubitId ||
    doubleAction.topQubitId === doubleAction.bottomQubitId ||
    doubleAction.topQubitLogicalId === doubleAction.bottomQubitLogicalId ||
    !result.firstSlotLayer.active ||
    result.firstSlotLayer.zIndex < 10000 ||
    !result.secondSlotLayer.active ||
    result.secondSlotLayer.zIndex < 10000 ||
    !result.replaySlotLayer.leftActive ||
    !result.replaySlotLayer.rightActive ||
    result.replaySlotLayer.leftZIndex < 10000 ||
    result.replaySlotLayer.rightZIndex < 10000 ||
    result.directDoubleCompleted !== true ||
    result.replayCompleted !== true ||
    Math.abs(result.q1Center.y - result.q2Center.y) < 80
  ) {
    throw new Error(
      `Doc Editor two-qubit playback smoke failed: ${JSON.stringify(result)}`,
    );
  }
}

async function runDocEditorTextPersistenceSmoke(page) {
  await page.evaluate(() => {
    localStorage.setItem(
      "quantum_generated_tabs_v1",
      JSON.stringify({
        tabs: [
          {
            id: "doc-text-persist",
            label: "Doc Text Persist",
            layout: {
              items: [
                {
                  id: "doc-text-persist-q",
                  type: "qubit",
                  left: 80,
                  top: 170,
                  width: 52,
                  height: 52,
                },
              ],
              canvasWidth: 760,
              canvasHeight: 420,
            },
          },
        ],
      }),
    );
    localStorage.setItem(
      "quantum_whats_this_documents_v1",
      JSON.stringify({
        documents: [
          {
            tabId: "doc-text-persist",
            title: "Text Persistence",
            scenes: [
              {
                id: "doc-text-scene-1",
                title: "Scene 1",
                canvasWidth: 760,
                canvasHeight: 420,
                items: [
                  {
                    id: "doc-text-box-1",
                    type: "text-box",
                    left: 80,
                    top: 90,
                    width: 300,
                    height: 140,
                    text: "Original first scene.",
                    buttons: ["next"],
                    buttonMode: "next",
                  },
                ],
              },
              {
                id: "doc-text-scene-2",
                title: "Scene 2",
                canvasWidth: 760,
                canvasHeight: 420,
                experiment: {
                  version: 1,
                  recordedAt: Date.now(),
                  initialQubits: [],
                  gateSettings: [],
                  actions: [
                    {
                      type: "drag",
                      qubitId: "missing-qubit",
                      qubitLogicalId: "missing-logical-qubit",
                      path: [
                        { x: 0, y: 0 },
                        { x: 1, y: 1 },
                      ],
                    },
                  ],
                },
                items: [
                  {
                    id: "doc-text-box-2",
                    type: "text-box",
                    left: 90,
                    top: 100,
                    width: 320,
                    height: 150,
                    text: "Original second scene.",
                    buttons: ["done"],
                    buttonMode: "done",
                  },
                ],
              },
            ],
          },
        ],
      }),
    );
  });
  await page.reload({ waitUntil: "domcontentloaded" });
  await page.locator("#tab-doc-editor").click();
  await page.locator("#docEditorTabSelect").selectOption("doc-text-persist");
  await page.waitForSelector("#docEditorCanvas [data-component='text-box']");
  const editedFirstSceneText = "Edited first scene.\nSecond line.";
  await page
    .locator("#docEditorCanvas [data-role='text-box-body']")
    .fill("");
  await page
    .locator("#docEditorCanvas [data-role='text-box-body']")
    .type("Edited first scene.");
  await page.keyboard.press("Enter");
  await page
    .locator("#docEditorCanvas [data-role='text-box-body']")
    .type("Second line.");
  await wait(120);
  await page.locator("#docEditorNewSceneButton").click();
  await page.waitForFunction(
    () => document.querySelector("#docEditorSceneLabel")?.textContent === "Scene 2 of 3",
  );
  const insertedSceneCanvasBox = await page.locator("#docEditorCanvas").boundingBox();
  if (!insertedSceneCanvasBox) {
    throw new Error("Missing Doc Editor canvas after inserting a middle scene");
  }
  await page.locator("#docEditorComponentSelect").selectOption("text-box");
  await page.mouse.click(
    insertedSceneCanvasBox.x + 220,
    insertedSceneCanvasBox.y + 150,
  );
  await page.waitForSelector("#docEditorCanvas [data-component='text-box']");
  await page.evaluate(() => {
    const textBox = document.querySelector(
      "#docEditorCanvas [data-component='text-box']",
    );
    const body = textBox?.querySelector('[data-role="text-box-body"]');
    const select = textBox?.querySelector('[data-role="text-box-button-mode"]');
    if (!(body instanceof HTMLElement) || !(select instanceof HTMLSelectElement)) {
      throw new Error("Inserted Doc Editor scene did not create an editable text box");
    }
    body.textContent = "Inserted middle scene.";
    body.dispatchEvent(new Event("input", { bubbles: true }));
    select.value = "next";
    select.dispatchEvent(new Event("change", { bubbles: true }));
  });
  await wait(120);
  await page.locator("#docEditorSceneNextButton").click();
  await page.waitForSelector("#docEditorCanvas [data-component='text-box']");
  await page.locator("#docEditorCanvasWidth").fill("920");
  await page.locator("#docEditorCanvasWidth").evaluate((element) => {
    element.dispatchEvent(new Event("change", { bubbles: true }));
  });
  await page.locator("#docEditorCanvasHeight").fill("540");
  await page.locator("#docEditorCanvasHeight").evaluate((element) => {
    element.dispatchEvent(new Event("change", { bubbles: true }));
  });
  await page.evaluate(() => {
    const textBox = document.querySelector(
      "#docEditorCanvas [data-component='text-box']",
    );
    if (!(textBox instanceof HTMLElement)) {
      throw new Error("Doc Editor text box was not rendered");
    }
    textBox.style.left = "240px";
    textBox.style.top = "180px";
    textBox.style.width = "430px";
    textBox.style.height = "190px";
  });
  await page
    .locator("#docEditorCanvas [data-role='text-box-body']")
    .fill("Edited second scene.");
  await wait(120);
  await page.locator("#docEditorDoneButton").click();
  await wait(250);

  const stored = await page.evaluate(() => {
    const documents = JSON.parse(
      localStorage.getItem("quantum_whats_this_documents_v1") || "{}",
    ).documents || [];
    const documentEntry = documents.find(
      (entry) => entry.tabId === "doc-text-persist",
    );
    return {
      activeTab: document.querySelector(".tab-btn.active")?.dataset.tabTarget || "",
      sceneIds: (documentEntry?.scenes || []).map((scene) => scene.id),
      sceneTexts: (documentEntry?.scenes || []).map(
        (scene) => scene.items?.find((item) => item.type === "text-box")?.text,
      ),
      finalSceneCanvas: {
        width: documentEntry?.scenes?.[2]?.canvasWidth,
        height: documentEntry?.scenes?.[2]?.canvasHeight,
      },
      finalTextBox: documentEntry?.scenes?.[2]?.items?.find(
        (item) => item.type === "text-box",
      ),
    };
  });
  if (
    stored.activeTab !== "doc-text-persist" ||
    stored.sceneIds.length !== 3 ||
    stored.sceneIds[0] !== "doc-text-scene-1" ||
    stored.sceneIds[2] !== "doc-text-scene-2" ||
    !stored.sceneIds[1]?.startsWith("scene-") ||
    stored.sceneTexts.join("|") !==
      `${editedFirstSceneText}|Inserted middle scene.|Edited second scene.` ||
    stored.finalSceneCanvas.width !== 920 ||
    stored.finalSceneCanvas.height !== 540 ||
    stored.finalTextBox?.left !== 240 ||
    stored.finalTextBox?.top !== 180 ||
    stored.finalTextBox?.width !== 430 ||
    stored.finalTextBox?.height !== 190
  ) {
    throw new Error(
      `Doc Editor Done did not persist edited scene geometry: ${JSON.stringify(stored)}`,
    );
  }

  await page
    .locator(
      "#panel-doc-text-persist [data-generated-document-action='whats-this']",
    )
    .click();
  await wait(250);
  const runtimeState = await page.evaluate(() => {
    const panel = document.getElementById("panel-doc-text-persist");
    const canvas = panel?.querySelector(".generated-layout-canvas");
    const currentText =
      canvas?.querySelector('[data-role="text-box-body"]')?.textContent || "";
    const nextButton = canvas?.querySelector(
      '[data-role="text-box-action"][data-text-box-action="next"]',
    );
    nextButton?.click();
    const middleText =
      canvas?.querySelector('[data-role="text-box-body"]')?.textContent || "";
    const middleNextButton = canvas?.querySelector(
      '[data-role="text-box-action"][data-text-box-action="next"]',
    );
    middleNextButton?.click();
    const finalBox = canvas?.querySelector("[data-component='text-box']");
    const finalText =
      finalBox?.querySelector('[data-role="text-box-body"]')?.textContent || "";
    return {
      texts: [currentText, middleText, finalText],
      canvasWidth: canvas instanceof HTMLElement ? canvas.offsetWidth : 0,
      canvasHeight: canvas instanceof HTMLElement ? canvas.offsetHeight : 0,
      finalTextBox:
        finalBox instanceof HTMLElement
          ? {
              left: Math.round(parseFloat(finalBox.style.left) || 0),
              top: Math.round(parseFloat(finalBox.style.top) || 0),
              width: Math.round(finalBox.offsetWidth),
              height: Math.round(finalBox.offsetHeight),
            }
          : null,
    };
  });
  if (
    runtimeState.texts.join("|") !==
      `${editedFirstSceneText}|Inserted middle scene.|Edited second scene.` ||
    runtimeState.canvasWidth !== 920 ||
    runtimeState.canvasHeight !== 540 ||
    runtimeState.finalTextBox?.left !== 240 ||
    runtimeState.finalTextBox?.top !== 180 ||
    runtimeState.finalTextBox?.width !== 430 ||
    runtimeState.finalTextBox?.height !== 190
  ) {
    throw new Error(
      `What's this runtime did not use persisted scene geometry: ${JSON.stringify(runtimeState)}`,
    );
  }
}

async function runContentFilesIgnoreLocalStorageSmoke(browser, baseUrl) {
  const context = await browser.newContext({ viewport: { width: 1100, height: 760 } });
  try {
    const page = await context.newPage();
    await page.addInitScript(() => {
      localStorage.setItem(
        "quantum_generated_tabs_v1",
        JSON.stringify({
          tabs: [
            {
              id: "stale-local-tab",
              label: "Stale Local Tab",
              layout: { items: [], canvasWidth: 760, canvasHeight: 420 },
            },
          ],
        }),
      );
      localStorage.setItem(
        "quantum_whats_this_documents_v1",
        JSON.stringify({
          documents: [
            {
              tabId: "stale-local-tab",
              title: "Stale Local Document",
              scenes: [
                {
                  id: "stale-local-scene",
                  title: "Stale",
                  items: [
                    {
                      id: "stale-local-text",
                      type: "text-box",
                      text: "This stale browser-storage text should not render.",
                    },
                  ],
                },
              ],
            },
          ],
        }),
      );
    });
    await page.goto(`${baseUrl}/index.html`, { waitUntil: "domcontentloaded" });
    const state = await page.evaluate(() => ({
      hasStaleTab: Boolean(document.querySelector("#tab-stale-local-tab")),
      hasFileTab: Boolean(document.querySelector("#tab-custom-one-qubit")),
      labels: Array.from(document.querySelectorAll(".tab-btn")).map((button) =>
        button.textContent.trim(),
      ),
    }));
    if (state.hasStaleTab || !state.hasFileTab) {
      throw new Error(
        `Local content files did not override browser storage: ${JSON.stringify(state)}`,
      );
    }
  } finally {
    await context.close();
  }
}

async function runFileModeRepositoryContentSmoke(browser) {
  const page = await browser.newPage({ viewport: { width: 1100, height: 760 } });
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") {
      errors.push(message.text());
    }
  });
  try {
    await page.goto(`file://${path.join(rootDir, "index.html")}`, {
      waitUntil: "domcontentloaded",
    });
    await page.waitForSelector("#tab-custom-one-qubit");
    const state = await page.evaluate(() => ({
      labels: Array.from(document.querySelectorAll(".tab-btn")).map((button) =>
        button.textContent.trim(),
      ),
      targets: Array.from(document.querySelectorAll(".tab-btn")).map(
        (button) => button.dataset.tabTarget || "",
      ),
      generatedPanels: document.querySelectorAll(".tab-panel.generated-tab").length,
      authoringButtons: Boolean(
        document.querySelector("#tab-plaground, #tab-doc-editor"),
      ),
      activeTarget: document.querySelector(".tab-btn.active")?.dataset.tabTarget || "",
      whatsThisButtons: document.querySelectorAll(
        "[data-generated-document-action='whats-this']",
      ).length,
    }));
    if (
      state.labels.join("|") !== expectedLocalTabLabels.join("|") ||
      state.generatedPanels !== expectedPublishedTabLabels.length ||
      !state.authoringButtons ||
      state.activeTarget !== "plaground" ||
      state.whatsThisButtons < expectedPublishedTabLabels.length - 1 ||
      errors.length > 0
    ) {
      throw new Error(
        `File-mode repository content failed: ${JSON.stringify({ state, errors })}`,
      );
    }
  } finally {
    await page.close();
  }
}

async function runInitialWhatsThisSeedSmoke(page) {
  await page.evaluate(() => {
    localStorage.setItem(
      "quantum_generated_tabs_v1",
      JSON.stringify({
        tabs: [
          {
            id: "seed-one-qubit",
            label: "One Qubit",
            layout: { items: [], canvasWidth: 760, canvasHeight: 420 },
          },
          {
            id: "seed-two-qubits",
            label: "Two Qubits",
            layout: { items: [], canvasWidth: 760, canvasHeight: 420 },
          },
          {
            id: "seed-entanglement-2",
            label: "Entanglement 2",
            layout: { items: [], canvasWidth: 760, canvasHeight: 420 },
          },
          {
            id: "seed-entanglement-3",
            label: "Entanglement 3",
            layout: { items: [], canvasWidth: 760, canvasHeight: 420 },
          },
        ],
      }),
    );
    localStorage.setItem(
      "quantum_whats_this_documents_v1",
      JSON.stringify({ documents: [] }),
    );
    localStorage.removeItem("quantum_whats_this_documents_seed_v1");
  });
  await page.reload({ waitUntil: "domcontentloaded" });

  const seeded = await page.evaluate(() => {
    const documents = JSON.parse(
      localStorage.getItem("quantum_whats_this_documents_v1") || "{}",
    ).documents || [];
    const byTab = Object.fromEntries(
      documents.map((entry) => [entry.tabId, entry]),
    );
    return {
      seedVersion:
        localStorage.getItem("quantum_whats_this_documents_seed_v1") || "",
      tabIds: documents.map((entry) => entry.tabId),
      sceneCounts: Object.fromEntries(
        documents.map((entry) => [entry.tabId, entry.scenes?.length || 0]),
      ),
      buttons: {
        one: Boolean(
          document.querySelector(
            "#panel-seed-one-qubit [data-generated-document-action='whats-this']",
          ),
        ),
        two: Boolean(
          document.querySelector(
            "#panel-seed-two-qubits [data-generated-document-action='whats-this']",
          ),
        ),
        entanglement2: Boolean(
          document.querySelector(
            "#panel-seed-entanglement-2 [data-generated-document-action='whats-this']",
          ),
        ),
        entanglement3: Boolean(
          document.querySelector(
            "#panel-seed-entanglement-3 [data-generated-document-action='whats-this']",
          ),
        ),
      },
      firstText:
        byTab["seed-one-qubit"]?.scenes?.[0]?.items?.find(
          (item) => item.type === "text-box",
        )?.text || "",
      oldEntanglementDocument: Boolean(byTab["seed-entanglement-1"]),
      entanglementTitle: byTab["seed-entanglement-2"]?.title || "",
      showScenes: documents.flatMap((entry) =>
        (entry.scenes || [])
          .filter((scene) =>
            (scene.items || []).some((item) =>
              (item.buttons || []).includes("show"),
            ),
          )
          .map((scene) => ({
            tabId: entry.tabId,
            sceneId: scene.id,
            actions: scene.experiment?.actions?.length || 0,
          })),
      ),
    };
  });
  if (
    seeded.seedVersion !== "qubit-lab-scripts-v2" ||
    seeded.tabIds.length !== 3 ||
    !seeded.tabIds.includes("seed-one-qubit") ||
    !seeded.tabIds.includes("seed-two-qubits") ||
    !seeded.tabIds.includes("seed-entanglement-2") ||
    seeded.tabIds.includes("seed-entanglement-3") ||
    seeded.sceneCounts["seed-one-qubit"] !== 5 ||
    seeded.sceneCounts["seed-two-qubits"] !== 4 ||
    seeded.sceneCounts["seed-entanglement-2"] !== 4 ||
    !seeded.buttons.one ||
    !seeded.buttons.two ||
    !seeded.buttons.entanglement2 ||
    seeded.buttons.entanglement3 ||
    !seeded.firstText.includes("People often talk about qubits") ||
    seeded.oldEntanglementDocument ||
    seeded.entanglementTitle !== "Entanglement" ||
    seeded.showScenes.length < 4 ||
    seeded.showScenes.some((scene) => scene.actions === 0)
  ) {
    throw new Error(
      `Initial What's this seed failed: ${JSON.stringify(seeded)}`,
    );
  }

  await page.locator("#tab-seed-one-qubit").click();
  await page
    .locator(
      "#panel-seed-one-qubit [data-generated-document-action='whats-this']",
    )
    .click();
  await wait(250);
  const runtime = await page.evaluate(() => {
    const panel = document.getElementById("panel-seed-one-qubit");
    const canvas = panel?.querySelector(".generated-layout-canvas");
    const firstText =
      canvas?.querySelector('[data-role="text-box-body"]')?.textContent || "";
    const nextButton = canvas?.querySelector(
      '[data-role="text-box-action"][data-text-box-action="next"]',
    );
    nextButton?.click();
    const secondText =
      canvas?.querySelector('[data-role="text-box-body"]')?.textContent || "";
    const showButton = canvas?.querySelector(
      '[data-role="text-box-action"][data-text-box-action="show"]',
    );
    return {
      docRuntime: canvas?.dataset.docRuntimeCanvas || "",
      tabId: canvas?.dataset.generatedTabId || "",
      firstText,
      secondText,
      hasShow: Boolean(showButton),
      sceneLabel:
        document.querySelector("#docRuntimeSceneLabel")?.textContent || "",
    };
  });
  if (
    runtime.docRuntime !== "true" ||
    runtime.tabId !== "seed-one-qubit" ||
    !runtime.firstText.includes("People often talk about qubits") ||
    !runtime.secondText.includes("The blue circle is a qubit") ||
    !runtime.hasShow ||
    runtime.sceneLabel !== "Scene 2 of 5"
  ) {
    throw new Error(
      `Seeded What's this runtime failed: ${JSON.stringify(runtime)}`,
    );
  }

  await page
    .locator(
      "#panel-seed-one-qubit [data-role='text-box-action'][data-text-box-action='show']",
    )
    .click();
  const deadline = Date.now() + 8000;
  let showRun = null;
  while (Date.now() < deadline) {
    showRun = await page.evaluate(() => {
      const panel = document.getElementById("panel-seed-one-qubit");
      const canvas = panel?.querySelector(".generated-layout-canvas");
      const qubit = canvas?.querySelector("[data-component='qubit']");
      const state = generatedExperimentStateForCanvas(canvas);
      return {
        qubitLeft: Math.round(parseFloat(qubit?.style.left || "0")),
        playing: Boolean(state?.playing),
        playbackResultVisible: Boolean(state?.playbackResultVisible),
      };
    });
    if (!showRun.playing && showRun.playbackResultVisible) {
      break;
    }
    await wait(250);
  }
  if (
    !showRun ||
    showRun.playing ||
    !showRun.playbackResultVisible ||
    showRun.qubitLeft <= 180
  ) {
    throw new Error(
      `Seeded What's this Show me action failed: ${JSON.stringify(showRun)}`,
    );
  }
}

async function runEntangledMathSmoke(page) {
  const result = await page.evaluate(async () => {
    const rootHalf = Math.SQRT1_2;
    const pair = {
      amplitudes: entangledAmplitudesFromQubitVectors(
        [rootHalf, rootHalf],
        [0, 1],
      ),
    };
    applyCNOTToPair(pair);
    const afterCnot = pairOutcomeProbabilitiesFromState(pair);
    const displayAfterCnot = {
      top: probabilitiesFromVector2(displayVectorForPairMember(pair, 0)),
      bottom: probabilitiesFromVector2(displayVectorForPairMember(pair, 1)),
    };
    applySingleQubitGateToPair(pair, 0, gateMatrixForTick(9));
    const afterTopGate = pairOutcomeProbabilitiesFromState(pair);
    const displayAfterTopGate = {
      top: probabilitiesFromVector2(displayVectorForPairMember(pair, 0)),
      bottom: probabilitiesFromVector2(displayVectorForPairMember(pair, 1)),
    };
    collapsePairStateBySingleQubitMeasurement(pair, 0, "blue");
    const bottomAfterTopBlueMeasurement = singleQubitVectorFromPairState(
      pair,
      1,
    );
    const generatedVisualCanvas = document.createElement("div");
    generatedVisualCanvas.className = "generated-layout-canvas";
    const generatedTop = document.createElement("div");
    generatedTop.className = "playground-node qubit";
    generatedTop.dataset.component = "qubit";
    generatedTop.innerHTML = '<div class="playground-qubit-core"></div>';
    const generatedBottom = document.createElement("div");
    generatedBottom.className = "playground-node qubit";
    generatedBottom.dataset.component = "qubit";
    generatedBottom.innerHTML = '<div class="playground-qubit-core"></div>';
    generatedVisualCanvas.append(generatedTop, generatedBottom);
    document.body.appendChild(generatedVisualCanvas);
    const generatedTopState = ensureGeneratedQubitRuntimeState(generatedTop);
    const generatedBottomState = ensureGeneratedQubitRuntimeState(generatedBottom);
    generatedTopState.vector = [rootHalf, rootHalf];
    generatedBottomState.vector = [0, 1];
    applyGeneratedCnotToQubitStates(generatedTop, generatedBottom);
    applyGeneratedSingleGateToQubitState(generatedTop, 9);
    const generatedVisualAfterTopGate = {
      top: probabilitiesFromVector2(generatedTopState.vector),
      bottom: probabilitiesFromVector2(generatedBottomState.vector),
    };
    generatedVisualCanvas.remove();
    const idOrderCanvas = document.createElement("div");
    idOrderCanvas.className = "generated-layout-canvas";
    const highIdQubit = document.createElement("div");
    highIdQubit.className = "playground-node qubit";
    highIdQubit.dataset.component = "qubit";
    highIdQubit.dataset.qubitId = "42";
    highIdQubit.innerHTML = '<div class="playground-qubit-core"></div>';
    const lowIdQubit = document.createElement("div");
    lowIdQubit.className = "playground-node qubit";
    lowIdQubit.dataset.component = "qubit";
    lowIdQubit.dataset.qubitId = "7";
    lowIdQubit.innerHTML = '<div class="playground-qubit-core"></div>';
    idOrderCanvas.append(highIdQubit, lowIdQubit);
    document.body.appendChild(idOrderCanvas);
    const highIdState = ensureGeneratedQubitRuntimeState(highIdQubit);
    const lowIdState = ensureGeneratedQubitRuntimeState(lowIdQubit);
    highIdState.vector = [1, 0];
    lowIdState.vector = [0, 1];
    const argumentOrderedCollapse = collapseGeneratedQubitPairFromCnot(
      highIdQubit,
      lowIdQubit,
    );
    idOrderCanvas.remove();
    const visualOrderCanvas = document.createElement("div");
    visualOrderCanvas.className = "generated-layout-canvas playground-canvas";
    visualOrderCanvas.dataset.docRuntimeCanvas = "true";
    visualOrderCanvas.dataset.generatedTabId = "visual-order-smoke";
    visualOrderCanvas.style.width = "760px";
    visualOrderCanvas.style.height = "360px";
    const visualTopQubit = createGeneratedLayoutItemNode("qubit", {
      id: "visual-order-top",
      left: 70,
      top: 62,
      width: 52,
      height: 52,
    });
    const visualBottomQubit = createGeneratedLayoutItemNode("qubit", {
      id: "visual-order-bottom",
      left: 70,
      top: 242,
      width: 52,
      height: 52,
    });
    const visualOrderMeasurement = createGeneratedLayoutItemNode(
      "double-measurement",
      {
        id: "visual-order-measure",
        left: 260,
        top: 54,
        width: 330,
        height: 250,
      },
    );
    visualOrderCanvas.append(
      visualTopQubit,
      visualBottomQubit,
      visualOrderMeasurement,
    );
    document.body.appendChild(visualOrderCanvas);
    prepareGeneratedLayoutCanvas(visualOrderCanvas);
    const visualTopState = ensureGeneratedQubitRuntimeState(visualTopQubit);
    const visualBottomState = ensureGeneratedQubitRuntimeState(visualBottomQubit);
    visualTopState.vector = [1, 0];
    visualBottomState.vector = [0, 1];
    visualTopState.doubleMeasurementReturnPoint = { x: 96, y: 88 };
    visualBottomState.doubleMeasurementReturnPoint = { x: 96, y: 268 };
    const visualOrderRuntime = initializeGeneratedDoubleMeasurementItem(
      visualOrderMeasurement,
    );
    visualOrderRuntime.slotOccupants.left = visualTopQubit;
    visualOrderRuntime.slotOccupants.right = visualBottomQubit;
    const visualOrderCycleCompleted = await runGeneratedDoubleMeasurementCycle(
      visualOrderCanvas,
      visualOrderRuntime,
    );
    const visualOrderCounts = { ...visualOrderRuntime.tubeCounts };
    visualOrderRuntime.tubeCounts = { bb: 0, br: 0, rb: 0, rr: 0 };
    updateGeneratedDoubleMeasurementTubeFills(visualOrderRuntime);
    replayGeneratedRecordedExperimentFast(
      visualOrderCanvas,
      {
        initialQubits: [
          {
            itemId: "visual-order-top",
            vector: [1, 0],
            center: { x: 96, y: 88 },
          },
          {
            itemId: "visual-order-bottom",
            vector: [0, 1],
            center: { x: 96, y: 268 },
          },
        ],
        actions: [
          {
            type: "double-measure",
            measurementId: "visual-order-measure",
            leftQubitId: "visual-order-top",
            rightQubitId: "visual-order-bottom",
          },
        ],
      },
      100,
    );
    const visualOrderFastCounts = { ...visualOrderRuntime.tubeCounts };
    visualOrderCanvas.remove();
    const canvas = document.createElement("div");
    canvas.className = "generated-layout-canvas";
    canvas.dataset.generatedTabId = "separated-smoke";
    canvas.innerHTML = `
      <div class="playground-node component-group saved-component-group" data-component="component-group" data-generated-item-id="sep-measure">
        <div class="saved-group-child measurement-piece measurement-piece-single-magnifier" data-component="single-magnifier">
          <div data-role="measurement-tool"><div data-role="measure-lens"></div></div>
        </div>
        <div class="pair-tube-rack">
          <div class="pair-tube-column" data-key="bb"><div class="pair-tube"></div><div class="tube-liquid"></div><div class="tube-count">0</div></div>
          <div class="pair-tube-column" data-key="br"><div class="pair-tube"></div><div class="tube-liquid"></div><div class="tube-count">0</div></div>
          <div class="pair-tube-column" data-key="rb"><div class="pair-tube"></div><div class="tube-liquid"></div><div class="tube-count">0</div></div>
          <div class="pair-tube-column" data-key="rr"><div class="pair-tube"></div><div class="tube-liquid"></div><div class="tube-count">0</div></div>
        </div>
      </div>`;
    document.body.appendChild(canvas);
    const separatedRuntime = initializeGeneratedSeparatedPairMeasurementItem(
      canvas.querySelector('[data-generated-item-id="sep-measure"]'),
    );
    canvas.style.width = "520px";
    canvas.style.height = "340px";
    const separatedItem = canvas.querySelector(
      '[data-generated-item-id="sep-measure"]',
    );
    Object.assign(separatedItem.style, {
      position: "relative",
      width: "420px",
      height: "260px",
    });
    Object.assign(separatedRuntime.magnifiers[0].child.style, {
      position: "absolute",
      left: "120px",
      top: "96px",
      width: "160px",
      height: "130px",
    });
    Object.assign(separatedRuntime.magnifiers[0].measurementTool.style, {
      display: "block",
      width: "160px",
      height: "130px",
    });
    const separatedEjectTopQubit = createGeneratedLayoutItemNode("qubit", {
      id: "sep-eject-top",
      left: 20,
      top: 30,
      width: 52,
      height: 52,
    });
    const separatedEjectBottomQubit = createGeneratedLayoutItemNode("qubit", {
      id: "sep-eject-bottom",
      left: 20,
      top: 210,
      width: 52,
      height: 52,
    });
    canvas.append(separatedEjectTopQubit, separatedEjectBottomQubit);
    const separatedEjectionBase =
      generatedSeparatedPairMeasurementEjectionPoint(
        canvas,
        separatedRuntime.magnifiers[0],
        separatedEjectTopQubit,
      );
    const separatedEjectionTop =
      generatedSeparatedPairMeasurementEjectionPoint(
        canvas,
        separatedRuntime.magnifiers[0],
        separatedEjectTopQubit,
        0,
      );
    const separatedEjectionBottom =
      generatedSeparatedPairMeasurementEjectionPoint(
        canvas,
        separatedRuntime.magnifiers[0],
        separatedEjectBottomQubit,
        1,
      );
    replayGeneratedRecordedExperimentFast(
      canvas,
      {
        initialQubits: [
          { itemId: "sep-top", logicalQubitId: 20, vector: [rootHalf, rootHalf] },
          { itemId: "sep-bottom", logicalQubitId: 10, vector: [0, 1] },
        ],
        actions: [
          {
            type: "cnot",
            topQubitId: "sep-top",
            bottomQubitId: "sep-bottom",
          },
          {
            type: "gate",
            qubitId: "sep-top",
            tickIndex: 9,
          },
          {
            type: "separated-pair-measure",
            measurementId: "sep-measure",
            qubitId: "sep-top",
            magnifierIndex: 0,
          },
          {
            type: "separated-pair-measure",
            measurementId: "sep-measure",
            qubitId: "sep-bottom",
            magnifierIndex: 1,
          },
        ],
      },
      100,
    );
    const separatedCounts = { ...separatedRuntime.tubeCounts };
    const separatedEjectionLanes = {
      base: separatedEjectionBase,
      top: separatedEjectionTop,
      bottom: separatedEjectionBottom,
    };
    canvas.remove();
    const gateReplayCanvas = document.createElement("div");
    gateReplayCanvas.className = "generated-layout-canvas";
    gateReplayCanvas.dataset.generatedTabId = "gate-replay-smoke";
    const liveGate = createPlaygroundComponentNode("single-gate", {
      singleGateTick: 0,
    });
    const liveMeasurement = createPlaygroundComponentNode("single-measurement");
    liveGate.classList.add("playground-node");
    liveGate.dataset.component = "single-gate";
    liveGate.dataset.generatedItemId = "live-gate";
    liveMeasurement.classList.add("playground-node");
    liveMeasurement.dataset.component = "single-measurement";
    liveMeasurement.dataset.generatedItemId = "live-measure";
    gateReplayCanvas.append(liveGate, liveMeasurement);
    document.body.appendChild(gateReplayCanvas);
    const liveGateRuntime = initializeGeneratedSingleGateItem(liveGate, {
      singleGateTick: 0,
    });
    const liveMeasurementRuntime =
      initializeGeneratedSingleMeasurementItem(liveMeasurement);
    setGeneratedGateRuntimeTick(liveGateRuntime, 0);
    replayGeneratedRecordedExperimentFast(
      gateReplayCanvas,
      {
        gateSettings: [{ itemId: "live-gate", tickIndex: 6 }],
        initialQubits: [{ itemId: "live-q", vector: [1, 0] }],
        actions: [
          {
            type: "gate",
            qubitId: "live-q",
            gateId: "live-gate",
            tickIndex: 6,
          },
          {
            type: "single-measure",
            qubitId: "live-q",
            measurementId: "live-measure",
          },
        ],
      },
      100,
    );
    const liveInitialGateReplayCounts = {
      blue: liveMeasurementRuntime.blueTubeCount,
      red: liveMeasurementRuntime.redTubeCount,
    };
    liveMeasurementRuntime.blueTubeCount = 0;
    liveMeasurementRuntime.redTubeCount = 0;
    replayGeneratedRecordedExperimentFast(
      gateReplayCanvas,
      {
        gateSettings: [{ itemId: "live-gate", tickIndex: 6 }],
        initialQubits: [{ itemId: "live-q", vector: [1, 0] }],
        actions: [
          {
            type: "gate-setting",
            gateId: "live-gate",
            tickIndex: 6,
          },
          {
            type: "gate",
            qubitId: "live-q",
            gateId: "live-gate",
            tickIndex: 0,
          },
          {
            type: "single-measure",
            qubitId: "live-q",
            measurementId: "live-measure",
          },
        ],
      },
      100,
    );
    const recordedFutureGateReplayCounts = {
      blue: liveMeasurementRuntime.blueTubeCount,
      red: liveMeasurementRuntime.redTubeCount,
    };
    liveMeasurementRuntime.blueTubeCount = 0;
    liveMeasurementRuntime.redTubeCount = 0;
    setGeneratedGateRuntimeTick(liveGateRuntime, 6);
    replayGeneratedRecordedExperimentFast(
      gateReplayCanvas,
      {
        gateSettings: [{ itemId: "live-gate", tickIndex: 0 }],
        initialQubits: [{ itemId: "live-q", vector: [1, 0] }],
        actions: [
          {
            type: "gate",
            qubitId: "live-q",
            gateId: "live-gate",
            tickIndex: 0,
          },
          {
            type: "gate-setting",
            gateId: "live-gate",
            tickIndex: 6,
          },
          {
            type: "gate",
            qubitId: "live-q",
            gateId: "live-gate",
            tickIndex: 6,
          },
          {
            type: "single-measure",
            qubitId: "live-q",
            measurementId: "live-measure",
          },
        ],
      },
      100,
    );
    const recordedInitialGateResetCounts = {
      blue: liveMeasurementRuntime.blueTubeCount,
      red: liveMeasurementRuntime.redTubeCount,
    };
    gateReplayCanvas.remove();
    const docRuntimeGateTransitCanvas = document.createElement("div");
    docRuntimeGateTransitCanvas.className =
      "generated-layout-canvas playground-canvas doc-runtime-canvas";
    docRuntimeGateTransitCanvas.dataset.docRuntimeCanvas = "true";
    docRuntimeGateTransitCanvas.dataset.generatedTabId =
      "doc-runtime-gate-layer-smoke";
    docRuntimeGateTransitCanvas.style.width = "720px";
    docRuntimeGateTransitCanvas.style.height = "280px";
    const docTransitQubit = createGeneratedLayoutItemNode("qubit", {
      id: "doc-transit-q",
      left: 40,
      top: 100,
      width: 52,
      height: 52,
      z: 1,
    });
    const docTransitGate = createGeneratedLayoutItemNode("single-gate", {
      id: "doc-transit-gate",
      left: 170,
      top: 62,
      width: 320,
      height: 150,
      z: 50,
      singleGateTick: 6,
    });
    docRuntimeGateTransitCanvas.append(docTransitQubit, docTransitGate);
    document.body.appendChild(docRuntimeGateTransitCanvas);
    prepareGeneratedLayoutCanvas(docRuntimeGateTransitCanvas);
    layoutGeneratedSingleGateDials(docRuntimeGateTransitCanvas);
    const docTransitGateRuntime =
      initializeGeneratedSingleGateItem(docTransitGate);
    const docTransitPromise = runGeneratedSingleGateTransit(
      docRuntimeGateTransitCanvas,
      docTransitQubit,
      docTransitGateRuntime,
    );
    await new Promise((resolve) => setTimeout(resolve, 120));
    const docRuntimeGateTransitLayerDuring = {
      active: docTransitQubit.classList.contains("generated-transit-active"),
      zIndex: Number.parseInt(getComputedStyle(docTransitQubit).zIndex, 10),
      gateZIndex: Number.parseInt(getComputedStyle(docTransitGate).zIndex, 10),
    };
    const docRuntimeGateTransitCompleted = await docTransitPromise;
    const docRuntimeGateTransitLayerAfter = {
      active: docTransitQubit.classList.contains("generated-transit-active"),
      zIndex: Number.parseInt(getComputedStyle(docTransitQubit).zIndex, 10),
    };
    docRuntimeGateTransitCanvas.remove();
    const docRecordingControlCanvas = document.createElement("div");
    docRecordingControlCanvas.className =
      "generated-layout-canvas playground-canvas doc-editor-canvas";
    docRecordingControlCanvas.dataset.docEditorCanvas = "true";
    docRecordingControlCanvas.dataset.generatedTabId =
      "doc-recording-control-smoke";
    docRecordingControlCanvas.style.width = "760px";
    docRecordingControlCanvas.style.height = "360px";
    const docControlQubit = createGeneratedLayoutItemNode("qubit", {
      id: "doc-control-q",
      left: 72,
      top: 150,
      width: 52,
      height: 52,
    });
    const docControlMeasurement = createGeneratedLayoutItemNode(
      "single-measurement",
      {
        id: "doc-control-measure",
        left: 280,
        top: 80,
        width: 320,
        height: 220,
      },
    );
    docRecordingControlCanvas.append(docControlQubit, docControlMeasurement);
    document.body.appendChild(docRecordingControlCanvas);
    prepareGeneratedLayoutCanvas(docRecordingControlCanvas);
    beginGeneratedExperimentRecording(docRecordingControlCanvas);
    const docControlMeasurementRuntime =
      initializeGeneratedSingleMeasurementItem(docControlMeasurement);
    const docControlLens = generatedLensCircle(docControlMeasurementRuntime);
    const docControlLensCenter = generatedViewportPointToCanvasPoint(
      docRecordingControlCanvas,
      docControlLens.x,
      docControlLens.y,
    );
    setGeneratedQubitCenter(
      docRecordingControlCanvas,
      docControlQubit,
      docControlLensCenter.x,
      docControlLensCenter.y,
    );
    await runGeneratedSingleMeasurementTransit(
      docRecordingControlCanvas,
      docControlQubit,
      docControlMeasurementRuntime,
    );
    const docRecordingFirstMeasurementCounts = {
      blue: docControlMeasurementRuntime.blueTubeCount,
      red: docControlMeasurementRuntime.redTubeCount,
      blueText:
        docControlMeasurement.querySelector('[data-role="tube-blue-count"]')
          ?.textContent || "",
      redText:
        docControlMeasurement.querySelector('[data-role="tube-red-count"]')
          ?.textContent || "",
      recording:
        generatedExperimentStateForCanvas(docRecordingControlCanvas)?.recording,
    };
    const waitForDocControlRecordingIdle = async () => {
      for (let attempt = 0; attempt < 80; attempt += 1) {
        const state = generatedExperimentStateForCanvas(
          docRecordingControlCanvas,
        );
        if (state?.recording && !state.playing) {
          return;
        }
        await new Promise((resolve) => setTimeout(resolve, 50));
      }
      throw new Error("Doc recording control replay did not finish");
    };
    const originalRecordedExperimentAnimated =
      replayGeneratedRecordedExperimentAnimated;
    let docRecordingControlAnimatedReplays = 0;
    replayGeneratedRecordedExperimentAnimated = async (...args) => {
      docRecordingControlAnimatedReplays += 1;
      return originalRecordedExperimentAnimated(...args);
    };
    try {
      docControlMeasurementRuntime.measurementCount.value = "100";
      docControlMeasurementRuntime.measurementCount.dispatchEvent(
        new Event("change", { bubbles: true }),
      );
      await waitForDocControlRecordingIdle();
      docControlMeasurementRuntime.measurementTool.click();
      await waitForDocControlRecordingIdle();
    } finally {
      replayGeneratedRecordedExperimentAnimated =
        originalRecordedExperimentAnimated;
    }
    finishGeneratedExperimentRecording(docRecordingControlCanvas);
    const docRecordingControlState = generatedExperimentStateForCanvas(
      docRecordingControlCanvas,
    );
    const docRecordingControlResult = {
      recording: docRecordingControlState.recording,
      actionTypes: docRecordingControlState.experiment.actions.map(
        (action) => action.type,
      ),
      iterations: docRecordingControlState.experiment.actions
        .filter(
          (action) =>
            action.type === "experiment-count" ||
            action.type === "experiment-repeat",
        )
        .map((action) => action.iterations),
      blue: docControlMeasurementRuntime.blueTubeCount,
      red: docControlMeasurementRuntime.redTubeCount,
      selectedCount: docControlMeasurementRuntime.measurementCount.value,
      animatedReplays: docRecordingControlAnimatedReplays,
    };
    docRecordingControlCanvas.remove();
    const generatedReplaySpeeds = {
      one: generatedAnimatedReplaySpeedForIterationCount(1),
      five: generatedAnimatedReplaySpeedForIterationCount(5),
      ten: generatedAnimatedReplaySpeedForIterationCount(10),
      hundred: generatedAnimatedReplaySpeedForIterationCount(100),
    };
    const replayGateTickRules = {
      initialDialWins: generatedGateTickForRecordedAction(
        { type: "gate", gateId: "gate-a", tickIndex: 9 },
        new Map([["gate-a", 0]]),
      ),
      futureSettingWins: (() => {
        const ticks = new Map([["gate-a", 0]]);
        ticks.set(
          "gate-a",
          generatedGateTickForRecordedAction(
            { type: "gate-setting", gateId: "gate-a", tickIndex: 6 },
            ticks,
          ),
        );
        return generatedGateTickForRecordedAction(
          { type: "gate", gateId: "gate-a", tickIndex: 9 },
          ticks,
        );
      })(),
      recordedTickFallback: generatedGateTickForRecordedAction(
        { type: "gate", gateId: "missing-gate", tickIndex: 9 },
        new Map([["gate-a", 0]]),
      ),
    };
    return {
      afterCnot,
      displayAfterCnot,
      afterTopGate,
      displayAfterTopGate,
      generatedVisualAfterTopGate,
      argumentOrderedCollapse,
      visualOrderCycleCompleted,
      visualOrderCounts,
      visualOrderFastCounts,
      bottomAfterTopBlueMeasurement,
      separatedCounts,
      separatedEjectionLanes,
      liveInitialGateReplayCounts,
      recordedFutureGateReplayCounts,
      recordedInitialGateResetCounts,
      docRuntimeGateTransitLayerDuring,
      docRuntimeGateTransitCompleted,
      docRuntimeGateTransitLayerAfter,
      docRecordingFirstMeasurementCounts,
      docRecordingControlResult,
      generatedReplaySpeeds,
      replayGateTickRules,
    };
  });

  const nearly = (actual, expected) => Math.abs(actual - expected) < 1e-9;
  if (
    !nearly(result.afterCnot.br, 0.5) ||
    !nearly(result.afterCnot.rb, 0.5) ||
    !nearly(result.displayAfterCnot.top[0], 0.5) ||
    !nearly(result.displayAfterCnot.bottom[0], 0.5) ||
    !nearly(result.afterTopGate.br, 1) ||
    !nearly(result.afterTopGate.bb, 0) ||
    !nearly(result.afterTopGate.rb, 0) ||
    !nearly(result.afterTopGate.rr, 0) ||
    !nearly(result.displayAfterTopGate.top[0], 1) ||
    !nearly(result.displayAfterTopGate.bottom[1], 1) ||
    !nearly(result.generatedVisualAfterTopGate.top[0], 1) ||
    !nearly(result.generatedVisualAfterTopGate.bottom[1], 1) ||
    result.argumentOrderedCollapse.outcomeKey !== "br" ||
    result.argumentOrderedCollapse.topColor !== "blue" ||
    result.argumentOrderedCollapse.bottomColor !== "red" ||
    result.visualOrderCycleCompleted !== true ||
    result.visualOrderCounts.br !== 1 ||
    result.visualOrderCounts.rb !== 0 ||
    result.visualOrderFastCounts.br !== 100 ||
    result.visualOrderFastCounts.rb !== 0 ||
    !nearly(result.bottomAfterTopBlueMeasurement[0], 0) ||
    !nearly(result.bottomAfterTopBlueMeasurement[1], 1) ||
    result.separatedCounts.br !== 100 ||
    result.separatedCounts.bb !== 0 ||
    result.separatedCounts.rr !== 0 ||
    result.separatedCounts.rb !== 0 ||
    !(result.separatedEjectionLanes.top.y < result.separatedEjectionLanes.base.y) ||
    !(
      result.separatedEjectionLanes.base.y <
      result.separatedEjectionLanes.bottom.y
    ) ||
    Math.abs(
      result.separatedEjectionLanes.top.x -
        result.separatedEjectionLanes.bottom.x,
    ) > 1 ||
    result.liveInitialGateReplayCounts.blue !== 0 ||
    result.liveInitialGateReplayCounts.red !== 100 ||
    result.recordedFutureGateReplayCounts.blue !== 0 ||
    result.recordedFutureGateReplayCounts.red !== 100 ||
    result.recordedInitialGateResetCounts.blue !== 0 ||
    result.recordedInitialGateResetCounts.red !== 100 ||
    result.docRuntimeGateTransitLayerDuring.active !== true ||
    result.docRuntimeGateTransitLayerDuring.zIndex < 10000 ||
    result.docRuntimeGateTransitLayerDuring.gateZIndex !== 50 ||
    result.docRuntimeGateTransitCompleted !== true ||
    result.docRuntimeGateTransitLayerAfter.active !== false ||
    result.docRecordingFirstMeasurementCounts.blue !== 1 ||
    result.docRecordingFirstMeasurementCounts.red !== 0 ||
    result.docRecordingFirstMeasurementCounts.blueText !== "1" ||
    result.docRecordingFirstMeasurementCounts.redText !== "0" ||
    result.docRecordingFirstMeasurementCounts.recording !== true ||
    result.docRecordingControlResult.recording !== false ||
    result.docRecordingControlResult.actionTypes.join(",") !==
      "single-measure,experiment-count,experiment-repeat" ||
    result.docRecordingControlResult.iterations.join(",") !== "100,100" ||
    result.docRecordingControlResult.blue !== 200 ||
    result.docRecordingControlResult.red !== 0 ||
    result.docRecordingControlResult.selectedCount !== "100" ||
    result.docRecordingControlResult.animatedReplays !== 0 ||
    result.generatedReplaySpeeds.one !== 1 ||
    result.generatedReplaySpeeds.five !== 5 ||
    result.generatedReplaySpeeds.ten !== 10 ||
    result.generatedReplaySpeeds.hundred !== 1 ||
    result.replayGateTickRules.initialDialWins !== 0 ||
    result.replayGateTickRules.futureSettingWins !== 6 ||
    result.replayGateTickRules.recordedTickFallback !== 9
  ) {
    throw new Error(
      `Entangled amplitude math failed: ${JSON.stringify(result)}`,
    );
  }
}

async function runSmokeTest(baseUrl) {
  const browser = await chromium.launch({ headless: true });
  try {
    await runFileModeRepositoryContentSmoke(browser);
    await runContentFilesIgnoreLocalStorageSmoke(browser, baseUrl);
    const page = await browser.newPage({ viewport: { width: 1100, height: 760 } });
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("console", (message) => {
      if (message.type() === "error") {
        errors.push(message.text());
      }
    });

    await page.goto(
      `${baseUrl}/index.html?quantumAllowLocalStorageContent=1`,
      { waitUntil: "domcontentloaded" },
    );
    await runEntangledMathSmoke(page);
    await runEditorDoubleMeasurementSmoke(page);
    await runSequentialMeasurementEditorSmoke(page);
    await runEditorDocumentWorkflowSmoke(page);
    await runDocEditorMeasurementRecordingSmoke(page);
    await runDocEditorTwoQubitPlaybackSmoke(page);
    await runDocEditorTextPersistenceSmoke(page);
    await runInitialWhatsThisSeedSmoke(page);

  await page.evaluate(() => {
    localStorage.setItem(
      "quantum_generated_tabs_v1",
      JSON.stringify({
        tabs: [
          {
            id: "editor-fresh-double",
            label: "Fresh Double",
            layout: {
              items: [
                {
                  id: "fresh-q-top",
                  type: "qubit",
                  left: 80,
                  top: 120,
                  width: 52,
                  height: 52,
                },
                {
                  id: "fresh-q-bottom",
                  type: "qubit",
                  left: 80,
                  top: 230,
                  width: 52,
                  height: 52,
                },
                {
                  id: "fresh-gate-top",
                  type: "single-gate",
                  left: 190,
                  top: 30,
                  width: 300,
                  height: 180,
                },
                {
                  id: "fresh-gate-bottom",
                  type: "single-gate",
                  left: 190,
                  top: 220,
                  width: 300,
                  height: 180,
                },
                {
                  id: "fresh-cnot",
                  type: "cnot-gate",
                  left: 470,
                  top: 120,
                  width: 300,
                  height: 210,
                },
                {
                  id: "fresh-measure",
                  type: "double-measurement",
                  left: 790,
                  top: -20,
                  width: 500,
                  height: 500,
                },
              ],
              canvasWidth: 1320,
              canvasHeight: 560,
              gridSnap: true,
            },
          },
          {
            id: "editor-replay-double",
            label: "Replay Double",
            layout: {
              items: [
                {
                  id: "replay-q-top",
                  type: "qubit",
                  left: 80,
                  top: 120,
                  width: 52,
                  height: 52,
                },
                {
                  id: "replay-q-bottom",
                  type: "qubit",
                  left: 80,
                  top: 230,
                  width: 52,
                  height: 52,
                },
                {
                  id: "replay-measure",
                  type: "double-measurement",
                  left: 420,
                  top: -20,
                  width: 500,
                  height: 500,
                },
              ],
              canvasWidth: 1000,
              canvasHeight: 560,
              gridSnap: true,
            },
          },
          {
            id: "editor-gate-setting",
            label: "Gate Setting",
            layout: {
              items: [
                {
                  id: "setting-q",
                  type: "qubit",
                  left: 80,
                  top: 180,
                  width: 52,
                  height: 52,
                },
                {
                  id: "setting-gate",
                  type: "single-gate",
                  left: 200,
                  top: 120,
                  width: 300,
                  height: 180,
                  singleGateTick: 0,
                },
                {
                  id: "setting-measure",
                  type: "single-measurement",
                  left: 540,
                  top: 20,
                  width: 420,
                  height: 300,
                },
              ],
              canvasWidth: 1020,
              canvasHeight: 430,
              gridSnap: true,
            },
          },
          {
            id: "editor-smoke",
            label: "Smoke",
            layout: {
              items: [
                {
                  id: "q-a",
                  type: "qubit",
                  left: 80,
                  top: 140,
                  width: 52,
                  height: 52,
                },
                {
                  id: "overlap-cnot",
                  type: "cnot-gate",
                  left: 0,
                  top: 70,
                  width: 560,
                  height: 320,
                },
                {
                  id: "m-a",
                  type: "single-measurement",
                  left: 230,
                  top: -125,
                  width: 420,
                  height: 300,
                },
              ],
              canvasWidth: 940,
              canvasHeight: 430,
              gridSnap: true,
            },
          },
        ],
        }),
      );
    });

    await page.reload({ waitUntil: "domcontentloaded" });
    await page.waitForSelector("#panel-editor-smoke .generated-experiment-toolbar", {
      state: "attached",
    });
    const resetCoverage = await page.evaluate(() => {
      const generatedPanels = Array.from(
        document.querySelectorAll(".tab-panel.generated-tab"),
      );
      return {
        generatedTabs: generatedPanels.length,
        resetButtons: generatedPanels.reduce(
          (count, panel) =>
            count +
            panel.querySelectorAll('[data-generated-experiment-action="reset"]')
              .length,
          0,
        ),
        editorResetButtons: document.querySelectorAll(
          '#panel-plaground [data-generated-experiment-action="reset"]',
        ).length,
      };
    });
    if (
      resetCoverage.generatedTabs === 0 ||
      resetCoverage.resetButtons !== resetCoverage.generatedTabs ||
      resetCoverage.editorResetButtons !== 0
    ) {
      throw new Error(
        `Generated reset button coverage failed: ${JSON.stringify(resetCoverage)}`,
      );
    }
    await page.locator("#tab-editor-fresh-double").click();
    await page.waitForSelector("#panel-editor-fresh-double .generated-layout-canvas");
    const freshDoubleStatus = await page
      .locator("#panel-editor-fresh-double .generated-experiment-status")
      .textContent();
    if (!/No experiment recorded/.test(freshDoubleStatus || "")) {
      throw new Error(
        `Fresh generated double tab should open without an experiment: ${freshDoubleStatus}`,
      );
    }
    const generatedDefaultSave = await page.evaluate(() => {
      const item = document.querySelector(
        '#panel-editor-fresh-double [data-component="double-measurement"]',
      );
      const lens = item?.querySelector('[data-role="pair-lens"]');
      if (!item || !lens) {
        return { ok: false, reason: "missing generated double measurement" };
      }
      lens.dataset.layoutManual = "true";
      lens.dataset.layoutTx = "42";
      lens.dataset.layoutTy = "11";
      lens.style.translate = "42px 11px";
      const ok = window.persistGeneratedComponentDefaultsFromElement?.(item);
      const payload = JSON.parse(
        localStorage.getItem("quantum_playground_component_defaults_v1") || "{}",
      );
      const saved =
        payload["double-measurement"]?.parts?.magnifier ||
        payload["double-measurement"]?.magnifier;
      return { ok, tx: saved?.tx, ty: saved?.ty };
    });
    if (
      !generatedDefaultSave.ok ||
      generatedDefaultSave.tx !== 42 ||
      generatedDefaultSave.ty !== 11
    ) {
      throw new Error(
        `Generated component default did not save globally: ${JSON.stringify(generatedDefaultSave)}`,
      );
    }
    const freshDoubleMeasure = page.locator(
      '#panel-editor-fresh-double [data-role="pair-lens"]',
    );
    const freshDoubleCount = page.locator(
      '#panel-editor-fresh-double [data-role="pair-measurement-count"]',
    );
    await freshDoubleCount.selectOption("5");
    await wait(500);
    await freshDoubleMeasure.click();
    await wait(500);
    const freshTubeTotal = await page.evaluate(() => {
      const root = document.querySelector("#panel-editor-fresh-double");
      return Array.from(root?.querySelectorAll(".tube-count") || []).reduce(
        (sum, node) => sum + Number(node.textContent?.trim() || 0),
        0,
      );
    });
    if (freshTubeTotal !== 0) {
      throw new Error(
        `Fresh generated double tab ran an implicit experiment: total=${freshTubeTotal}`,
      );
    }
    const freshTopQubit = page.locator(
      '#panel-editor-fresh-double [data-generated-item-id="fresh-q-top"]',
    );
    const freshBottomQubit = page.locator(
      '#panel-editor-fresh-double [data-generated-item-id="fresh-q-bottom"]',
    );
    const freshTopStart = await rectCenter(freshTopQubit);
    const freshBottomStart = await rectCenter(freshBottomQubit);
    const freshLensCenter = await rectCenter(freshDoubleMeasure);
    await page.mouse.move(freshTopStart.x, freshTopStart.y);
    await page.mouse.down();
    await page.mouse.move(freshLensCenter.x, freshLensCenter.y - 24, {
      steps: 12,
    });
    await page.mouse.up();
    await wait(900);
    await page.mouse.move(freshBottomStart.x, freshBottomStart.y);
    await page.mouse.down();
    await page.mouse.move(freshLensCenter.x, freshLensCenter.y + 24, {
      steps: 12,
    });
    await page.mouse.up();
    await wait(3200);
    const freshTopReturned = await rectCenter(freshTopQubit);
    const freshBottomReturned = await rectCenter(freshBottomQubit);
    const returnDistance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
    if (
      returnDistance(freshTopStart, freshTopReturned) > 12 ||
      returnDistance(freshBottomStart, freshBottomReturned) > 12
    ) {
      throw new Error(
        `Double measurement did not return qubits to their starts: ${JSON.stringify({
          topStart: freshTopStart,
          topReturned: freshTopReturned,
          bottomStart: freshBottomStart,
          bottomReturned: freshBottomReturned,
        })}`,
      );
    }

    await page.locator("#tab-editor-replay-double").click();
    await page.waitForSelector("#panel-editor-replay-double .generated-layout-canvas");
    const replayInitialStatus = await page
      .locator("#panel-editor-replay-double .generated-experiment-status")
      .textContent();
    if (!/No experiment recorded/.test(replayInitialStatus || "")) {
      throw new Error(
        `Generated tab rehydrated a stored experiment: ${replayInitialStatus}`,
      );
    }
    const replayTopQubit = page.locator(
      '#panel-editor-replay-double [data-generated-item-id="replay-q-top"]',
    );
    const replayBottomQubit = page.locator(
      '#panel-editor-replay-double [data-generated-item-id="replay-q-bottom"]',
    );
    const replayMeasure = page.locator(
      '#panel-editor-replay-double [data-role="pair-lens"]',
    );
    const replayTopStart = await rectCenter(replayTopQubit);
    const replayBottomStart = await rectCenter(replayBottomQubit);
    const replayLensCenter = await rectCenter(replayMeasure);
    await page.mouse.move(replayTopStart.x, replayTopStart.y);
    await page.mouse.down();
    await page.mouse.move(replayLensCenter.x, replayLensCenter.y - 24, {
      steps: 12,
    });
    await page.mouse.up();
    await wait(900);
    await page.mouse.move(replayBottomStart.x, replayBottomStart.y);
    await page.mouse.down();
    await page.mouse.move(replayLensCenter.x, replayLensCenter.y + 24, {
      steps: 12,
    });
    await page.mouse.up();
    await wait(3200);
    const replayRecordedStatus = await page
      .locator("#panel-editor-replay-double .generated-experiment-status")
      .textContent();
    if (!/Experiment ready/.test(replayRecordedStatus || "")) {
      throw new Error(
        `Auto-recorded double measurement was not ready: ${replayRecordedStatus}`,
      );
    }
    await page
      .locator('#panel-editor-replay-double [data-role="pair-measurement-count"]')
      .selectOption("5");
    await wait(16000);
    const replayTopReturned = await rectCenter(replayTopQubit);
    const replayBottomReturned = await rectCenter(replayBottomQubit);
    if (
      returnDistance(replayTopStart, replayTopReturned) > 12 ||
      returnDistance(replayBottomStart, replayBottomReturned) > 12
    ) {
      throw new Error(
        `Recorded double measurement replay did not return qubits to run starts: ${JSON.stringify({
          topStart: replayTopStart,
          topReturned: replayTopReturned,
          bottomStart: replayBottomStart,
          bottomReturned: replayBottomReturned,
        })}`,
      );
    }

    await page.locator("#tab-editor-gate-setting").click();
    await page.waitForSelector("#panel-editor-gate-setting .generated-layout-canvas");
    const settingQubit = page.locator(
      '#panel-editor-gate-setting [data-generated-item-id="setting-q"]',
    );
    const settingGateTicksLocator = page.locator(
      '#panel-editor-gate-setting [data-generated-item-id="setting-gate"] [data-role="ticks"]',
    );
    const settingGateTicks = await settingGateTicksLocator.boundingBox();
    if (!settingGateTicks) {
      throw new Error("Missing generated single-gate tick ring");
    }
    const settingGateCenter = {
      x: settingGateTicks.x + settingGateTicks.width / 2,
      y: settingGateTicks.y + settingGateTicks.height / 2,
    };
    const settingStart = await rectCenter(settingQubit);
    await page.mouse.move(settingStart.x, settingStart.y);
    await page.mouse.down();
    await page.mouse.move(settingStart.x + 48, settingStart.y + 6, {
      steps: 8,
    });
    await page.mouse.up();
    await wait(300);
    const settingAfterStartDrag = await rectCenter(settingQubit);
    await page.mouse.move(settingGateCenter.x, settingGateCenter.y);
    await page.mouse.down();
    await page.mouse.move(
      settingGateCenter.x,
      settingGateCenter.y + settingGateTicks.height * 0.42,
      { steps: 10 },
    );
    await page.mouse.up();
    await wait(250);
    await page.mouse.move(settingAfterStartDrag.x, settingAfterStartDrag.y);
    await page.mouse.down();
    await page.mouse.move(settingGateCenter.x, settingGateCenter.y, {
      steps: 14,
    });
    await page.mouse.up();
    await wait(4300);
    const settingAfterGate = await rectCenter(settingQubit);
    const settingLensCenter = await rectCenter(
      page.locator('#panel-editor-gate-setting [data-role="measure-lens"]'),
    );
    await page.mouse.move(settingAfterGate.x, settingAfterGate.y);
    await page.mouse.down();
    await page.mouse.move(settingLensCenter.x, settingLensCenter.y, {
      steps: 14,
    });
    await page.mouse.up();
    await wait(1800);
    const settingRecordedStatus = await page
      .locator("#panel-editor-gate-setting .generated-experiment-status")
      .textContent();
    if (!/Experiment ready/.test(settingRecordedStatus || "")) {
      throw new Error(
        `Auto-recorded gate experiment was not ready: ${settingRecordedStatus}`,
      );
    }
    const gateInitialCounts = await waitForSingleTubeTotal(
      page,
      "panel-editor-gate-setting",
      1,
    );
    if (gateInitialCounts.blue !== 0 || gateInitialCounts.red !== 1) {
      throw new Error(
        `Recorded gate setting change was not used: ${JSON.stringify(gateInitialCounts)}`,
      );
    }
    await page.waitForFunction(() => {
      const status = document.querySelector(
        "#panel-editor-gate-setting .generated-experiment-status",
      )?.textContent || "";
      return !/Running experiment/.test(status);
    });
    const recordedGateSettingActions = await page.evaluate(() => {
      const canvas = document.querySelector(
        "#panel-editor-gate-setting .generated-layout-canvas",
      );
      return (
        generatedExperimentStateForCanvas(canvas)?.experiment?.actions || []
      ).map((action) => ({
        type: action.type,
        gateId: action.gateId || "",
        tickIndex: action.tickIndex,
      }));
    });
    const settingActionIndex = recordedGateSettingActions.findIndex(
      (action) => action.type === "gate-setting",
    );
    const gateActionIndex = recordedGateSettingActions.findIndex(
      (action) => action.type === "gate",
    );
    if (
      settingActionIndex < 0 ||
      gateActionIndex < 0 ||
      settingActionIndex > gateActionIndex
    ) {
      throw new Error(
        `Gate setting change was not recorded before gate action: ${JSON.stringify(recordedGateSettingActions)}`,
      );
    }
    await page.mouse.move(settingGateCenter.x, settingGateCenter.y);
    await page.mouse.down();
    await page.mouse.move(
      settingGateCenter.x,
      settingGateCenter.y - settingGateTicks.height * 0.42,
      { steps: 10 },
    );
    await page.mouse.up();
    await wait(250);
    const gateCountsAfterTick = await singleTubeCountsForPanel(
      page,
      "panel-editor-gate-setting",
    );
    if (gateCountsAfterTick.total !== 0) {
      throw new Error(
        `Gate setting change did not clear measurement counts: ${JSON.stringify(gateCountsAfterTick)}`,
      );
    }
    await page
      .locator('#panel-editor-gate-setting [data-role="measurement-count"]')
      .selectOption("100");
    const gateUpdatedCounts = await waitForSingleTubeTotal(
      page,
      "panel-editor-gate-setting",
      100,
    );
    if (gateUpdatedCounts.blue !== 100 || gateUpdatedCounts.red !== 0) {
      throw new Error(
        `Post-recording gate setting change did not start a fresh replay with the same path: ${JSON.stringify(gateUpdatedCounts)}`,
      );
    }

    await page.locator("#tab-editor-smoke").click();
    await page.waitForSelector("#panel-editor-smoke .generated-layout-canvas");

    const qubit = page.locator('#panel-editor-smoke [data-component="qubit"]');
    const measurement = page.locator(
      '#panel-editor-smoke [data-role="measurement-tool"]',
    );
    const countSelect = page.locator(
      '#panel-editor-smoke [data-role="measurement-count"]',
    );
    const recordButtons = await page
      .locator('#panel-editor-smoke [data-generated-experiment-action="record"]')
      .count();
    if (recordButtons !== 0) {
      throw new Error(`Generated tabs still show a Record button: ${recordButtons}`);
    }
    const smokeInitialStatus = await page
      .locator("#panel-editor-smoke .generated-experiment-status")
      .textContent();
    if (!/No experiment recorded/.test(smokeInitialStatus || "")) {
      throw new Error(`Smoke tab did not open clean: ${smokeInitialStatus}`);
    }

    const beforeDrag = await rectCenter(qubit);
    const hitAtQubit = await page.evaluate(
      ({ x, y }) => {
        const element = document.elementFromPoint(x, y);
        return {
          component: element?.dataset?.component || "",
          className: element?.className || "",
        };
      },
      { x: beforeDrag.x, y: beforeDrag.y },
    );
    if (hitAtQubit.component !== "qubit") {
      throw new Error(
        `Generated tab qubit was blocked by overlapping component: ${JSON.stringify(hitAtQubit)}`,
      );
    }
    await page.mouse.move(beforeDrag.x, beforeDrag.y);
    await page.mouse.down();
    await page.mouse.move(beforeDrag.x + 80, beforeDrag.y + 20, { steps: 8 });
    await page.mouse.up();
    await wait(300);
    const afterDrag = await rectCenter(qubit);
    if (afterDrag.x - beforeDrag.x < 40) {
      throw new Error("Generated tab qubit did not drag");
    }

    const qubitCenter = await rectCenter(qubit);
    const lensCenter = await rectCenter(
      page.locator('#panel-editor-smoke [data-role="measure-lens"]'),
    );
    await page.mouse.move(qubitCenter.x, qubitCenter.y);
    await page.mouse.down();
    await page.mouse.move(qubitCenter.x + 100, qubitCenter.y, { steps: 5 });
    await page.mouse.move(lensCenter.x - 80, lensCenter.y, { steps: 5 });
    await page.mouse.move(lensCenter.x, lensCenter.y, { steps: 8 });
    await page.mouse.up();
    await wait(1800);

    const recordedOnce = await tubeCounts(page);
    if (recordedOnce.total !== 1) {
      throw new Error(`Recording did not measure once: ${JSON.stringify(recordedOnce)}`);
    }
    await wait(300);
    const savedStatus = await page
      .locator("#panel-editor-smoke .generated-experiment-status")
      .textContent();
    if (!/Experiment ready/.test(savedStatus || "")) {
      throw new Error(`Auto-recorded experiment was not ready: ${savedStatus}`);
    }

    await countSelect.selectOption("5");
    const afterSelect = await waitForTotal(page, 5);
    await measurement.click();
    const afterClick = await waitForTotal(page, 10);
    await page.evaluate(() => {
      window.__tabBatchAnimatedReplayCount = 0;
      const originalReplay = replayGeneratedRecordedExperimentAnimated;
      window.__restoreTabBatchAnimatedReplay = () => {
        replayGeneratedRecordedExperimentAnimated = originalReplay;
      };
      replayGeneratedRecordedExperimentAnimated = async (...args) => {
        window.__tabBatchAnimatedReplayCount += 1;
        return originalReplay(...args);
      };
    });
    await countSelect.selectOption("100");
    const afterBatchSelect = await waitForTotal(page, 100);
    const tabBatchAnimatedReplays = await page.evaluate(() => {
      const count = window.__tabBatchAnimatedReplayCount || 0;
      window.__restoreTabBatchAnimatedReplay?.();
      delete window.__restoreTabBatchAnimatedReplay;
      delete window.__tabBatchAnimatedReplayCount;
      return count;
    });
    if (tabBatchAnimatedReplays !== 0) {
      throw new Error(
        `Generated tab high-count replay animated instead of batch-running: ${JSON.stringify({ afterBatchSelect, tabBatchAnimatedReplays })}`,
      );
    }

    await page
      .locator('#panel-editor-smoke [data-generated-experiment-action="reset"]')
      .click();
    await wait(300);
    const resetStatus = await page
      .locator("#panel-editor-smoke .generated-experiment-status")
      .textContent();
    if (!/No experiment recorded/.test(resetStatus || "")) {
      throw new Error(`Generated reset left an experiment recorded: ${resetStatus}`);
    }
    const afterResetCounts = await tubeCounts(page);
    if (afterResetCounts.total !== 0) {
      throw new Error(
        `Generated reset did not clear measurement counts: ${JSON.stringify(afterResetCounts)}`,
      );
    }
    const afterResetCenter = await rectCenter(qubit);
    if (Math.hypot(afterResetCenter.x - beforeDrag.x, afterResetCenter.y - beforeDrag.y) > 8) {
      throw new Error(
        `Generated reset did not restore qubit position: before=${JSON.stringify(
          beforeDrag,
        )} after=${JSON.stringify(afterResetCenter)}`,
      );
    }
    await countSelect.selectOption("5");
    await wait(500);
    await measurement.click();
    await wait(500);
    const afterResetReplayAttempt = await tubeCounts(page);
    if (afterResetReplayAttempt.total !== 0) {
      throw new Error(
        `Generated tab replayed an experiment after reset: ${JSON.stringify(afterResetReplayAttempt)}`,
      );
    }

    await page.reload({ waitUntil: "domcontentloaded" });
    await page.locator("#tab-editor-smoke").click();
    await wait(400);
    const reloadedStatus = await page
      .locator("#panel-editor-smoke .generated-experiment-status")
      .textContent();
    if (!/No experiment recorded/.test(reloadedStatus || "")) {
      throw new Error(`Generated tab should reload without an experiment: ${reloadedStatus}`);
    }
    await countSelect.selectOption("5");
    await wait(500);
    await measurement.click();
    await wait(500);
    const afterReloadReplayAttempt = await tubeCounts(page);
    if (afterReloadReplayAttempt.total !== 0) {
      throw new Error(
        `Generated tab replayed an experiment after reload: ${JSON.stringify(afterReloadReplayAttempt)}`,
      );
    }
    if (errors.length > 0) {
      throw new Error(`Browser errors: ${errors.join(" | ")}`);
    }
    return {
      ok: true,
      recordedOnce,
      gateInitialCounts,
	      gateUpdatedCounts,
	      afterSelect,
	      afterClick,
	      afterBatchSelect,
	      tabBatchAnimatedReplays,
	      afterResetCounts,
	      afterReloadReplayAttempt,
	    };
  } finally {
    await browser.close();
  }
}

(async () => {
  const { server, baseUrl } = await startServer();
  try {
    const result = await runSmokeTest(baseUrl);
    console.log(JSON.stringify(result, null, 2));
  } finally {
    await closeServer(server);
  }
})().catch((error) => {
  console.error(error.stack || error.message || String(error));
  process.exit(1);
});

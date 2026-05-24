const fs = require("node:fs");
const fsp = require("node:fs/promises");
const http = require("node:http");
const path = require("node:path");
const { chromium } = require("playwright");

const rootDir = path.resolve(__dirname, "..");

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
    const root = document.querySelector("#panel-custom-smoke");
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
          id: "sequential-edit-smoke",
          label: "Sequential two qubit measurement",
          width: 420,
          height: 280,
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
            {
              type: "double-tube-array",
              left: 24,
              top: 192,
              width: 300,
              height: 78,
              z: 4,
              measurementRole: "double-tubes",
            },
            {
              type: "measurement-count-menu",
              left: 336,
              top: 12,
              width: 68,
              height: 34,
              z: 5,
              measurementRole: "iteration-count",
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
  if (editableChildCount < 5) {
    throw new Error(
      `Sequential measurement group did not expose editable children: ${editableChildCount}`,
    );
  }

  const editedMagnifier = page
    .locator(
      '#playgroundCanvas > [data-component="component-group"][data-group-component-id="sequential-edit-smoke"] > .saved-group-child[data-component="single-magnifier"]',
    )
    .nth(1);
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
    const entry = (state.customTabs || []).find(
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
      editedMagnifierLeft: editedMagnifierItem?.left,
      editedMagnifierTop: editedMagnifierItem?.top,
      editedMagnifierWidth: editedMagnifierItem?.width,
      editedMagnifierHeight: editedMagnifierItem?.height,
    };
  });
  if (
    !savedSequentialLayout.tabSaved ||
    savedSequentialLayout.childCount < 5 ||
    savedSequentialLayout.editedMagnifierLeft < 220 ||
    savedSequentialLayout.editedMagnifierTop > 55 ||
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
        customTabs: [
          {
            id: "custom-test",
            label: "Test",
            layout: { items: [], canvasWidth: 600, canvasHeight: 420 },
          },
          {
            id: "custom-keep",
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
            id: "custom-entanglement-2",
            label: "Entanglement 2",
            layout: { items: [], canvasWidth: 600, canvasHeight: 420 },
          },
          {
            id: "custom-entanglement-3",
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
    ).customTabs || [];
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
        .find((tab) => tab.id === "custom-keep")
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
    migrated.tabLabels.includes("Test") ||
    migrated.tabButtonLabels.includes("Test") ||
    !migrated.tabLabels.includes("Entanglement 1") ||
    !migrated.tabLabels.includes("Entanglement 2") ||
    migrated.tabLabels.includes("Entanglement 3") ||
    !migrated.tabButtonLabels.includes("Entanglement 1") ||
    !migrated.tabButtonLabels.includes("Entanglement 2") ||
    migrated.tabButtonLabels.includes("Entanglement 3") ||
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
  await page.evaluate(() => {
    const textBox = document.querySelector(
      '#playgroundCanvas > .playground-node[data-component="text-box"]',
    );
    const body = textBox?.querySelector('[data-role="text-box-body"]');
    const select = textBox?.querySelector('[data-role="text-box-button-mode"]');
    if (body) {
      body.textContent = "Remember to measure twice.";
      body.dispatchEvent(new Event("input", { bubbles: true }));
    }
    if (select) {
      select.value = "next";
      select.dispatchEvent(new Event("change", { bubbles: true }));
    }
  });

  await page.locator("#editorNewTabName").fill("Doc Smoke A");
  await page.locator("#playgroundSaveButton").click();
  await wait(250);

  const saved = await page.evaluate(() => {
    const state = JSON.parse(
      localStorage.getItem("quantum_generated_tabs_v1") || "{}",
    );
    const entry = (state.customTabs || []).find(
      (tab) => tab.label === "Doc Smoke A",
    );
    return {
      id: entry?.id || "",
      itemCount: entry?.layout?.items?.length || 0,
      qubitId: entry?.layout?.items?.find((item) => item.type === "qubit")
        ?.qubitId,
      textBox: entry?.layout?.items?.find((item) => item.type === "text-box"),
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
    saved.textBox?.text !== "Remember to measure twice." ||
    saved.textBox?.buttonMode !== "next"
  ) {
    throw new Error(`Editor Save did not persist the text box: ${JSON.stringify(saved)}`);
  }
  if (!/Doc Smoke A/.test(saved.status)) {
    throw new Error(`Editor did not mark saved tab as current: ${saved.status}`);
  }

  await page.locator("#playgroundSaveButton").click();
  await wait(200);
  const saveSameNameCount = await page.evaluate(() => {
    const state = JSON.parse(
      localStorage.getItem("quantum_generated_tabs_v1") || "{}",
    );
    return (state.customTabs || []).filter((tab) => tab.label === "Doc Smoke A")
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
    const entry = (state.customTabs || []).find(
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
    const storedOrder = (state.customTabs || []).map((tab) => tab.id);
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
    const entry = (state.customTabs || []).find((tab) => tab.id === copyId);
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
      stillStored: (state.customTabs || []).some((tab) => tab.id === copyId),
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

async function runEntangledMathSmoke(page) {
  const result = await page.evaluate(() => {
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
    const idOrderedCollapse = collapseGeneratedQubitPairFromCnot(
      highIdQubit,
      lowIdQubit,
    );
    idOrderCanvas.remove();
    const canvas = document.createElement("div");
    canvas.className = "generated-layout-canvas";
    canvas.dataset.generatedTabId = "separated-smoke";
    canvas.innerHTML = `
      <div class="playground-node component-group saved-component-group" data-component="component-group" data-generated-item-id="sep-measure">
        <div class="saved-group-child measurement-piece measurement-piece-single-magnifier" data-component="single-magnifier">
          <div data-role="measurement-tool"><div data-role="measure-lens"></div></div>
        </div>
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
    gateReplayCanvas.remove();
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
      idOrderedCollapse,
      bottomAfterTopBlueMeasurement,
      separatedCounts,
      liveInitialGateReplayCounts,
      recordedFutureGateReplayCounts,
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
    result.idOrderedCollapse.outcomeKey !== "rb" ||
    result.idOrderedCollapse.topColor !== "blue" ||
    result.idOrderedCollapse.bottomColor !== "red" ||
    !nearly(result.bottomAfterTopBlueMeasurement[0], 0) ||
    !nearly(result.bottomAfterTopBlueMeasurement[1], 1) ||
    result.separatedCounts.rb !== 100 ||
    result.separatedCounts.bb !== 0 ||
    result.separatedCounts.rr !== 0 ||
    result.separatedCounts.br !== 0 ||
    result.liveInitialGateReplayCounts.blue !== 100 ||
    result.liveInitialGateReplayCounts.red !== 0 ||
    result.recordedFutureGateReplayCounts.blue !== 0 ||
    result.recordedFutureGateReplayCounts.red !== 100 ||
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
    const page = await browser.newPage({ viewport: { width: 1100, height: 760 } });
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("console", (message) => {
      if (message.type() === "error") {
        errors.push(message.text());
      }
    });

    await page.goto(`${baseUrl}/index.html`, { waitUntil: "domcontentloaded" });
    await runEntangledMathSmoke(page);
    await runEditorDoubleMeasurementSmoke(page);
    await runSequentialMeasurementEditorSmoke(page);
    await runEditorDocumentWorkflowSmoke(page);

  await page.evaluate(() => {
    localStorage.setItem(
      "quantum_generated_tabs_v1",
      JSON.stringify({
        customTabs: [
          {
            id: "custom-fresh-double",
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
            id: "custom-replay-double",
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
            id: "custom-gate-setting",
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
            id: "custom-smoke",
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
    await page.waitForSelector("#panel-custom-smoke .generated-experiment-toolbar", {
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
    await page.locator("#tab-custom-fresh-double").click();
    await page.waitForSelector("#panel-custom-fresh-double .generated-layout-canvas");
    const freshDoubleStatus = await page
      .locator("#panel-custom-fresh-double .generated-experiment-status")
      .textContent();
    if (!/No experiment recorded/.test(freshDoubleStatus || "")) {
      throw new Error(
        `Fresh generated double tab should open without an experiment: ${freshDoubleStatus}`,
      );
    }
    const generatedDefaultSave = await page.evaluate(() => {
      const item = document.querySelector(
        '#panel-custom-fresh-double [data-component="double-measurement"]',
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
      '#panel-custom-fresh-double [data-role="pair-lens"]',
    );
    const freshDoubleCount = page.locator(
      '#panel-custom-fresh-double [data-role="pair-measurement-count"]',
    );
    await freshDoubleCount.selectOption("5");
    await wait(500);
    await freshDoubleMeasure.click();
    await wait(500);
    const freshTubeTotal = await page.evaluate(() => {
      const root = document.querySelector("#panel-custom-fresh-double");
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
      '#panel-custom-fresh-double [data-generated-item-id="fresh-q-top"]',
    );
    const freshBottomQubit = page.locator(
      '#panel-custom-fresh-double [data-generated-item-id="fresh-q-bottom"]',
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

    await page.locator("#tab-custom-replay-double").click();
    await page.waitForSelector("#panel-custom-replay-double .generated-layout-canvas");
    const replayInitialStatus = await page
      .locator("#panel-custom-replay-double .generated-experiment-status")
      .textContent();
    if (!/No experiment recorded/.test(replayInitialStatus || "")) {
      throw new Error(
        `Generated tab rehydrated a stored experiment: ${replayInitialStatus}`,
      );
    }
    const replayTopQubit = page.locator(
      '#panel-custom-replay-double [data-generated-item-id="replay-q-top"]',
    );
    const replayBottomQubit = page.locator(
      '#panel-custom-replay-double [data-generated-item-id="replay-q-bottom"]',
    );
    const replayMeasure = page.locator(
      '#panel-custom-replay-double [data-role="pair-lens"]',
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
      .locator("#panel-custom-replay-double .generated-experiment-status")
      .textContent();
    if (!/Experiment ready/.test(replayRecordedStatus || "")) {
      throw new Error(
        `Auto-recorded double measurement was not ready: ${replayRecordedStatus}`,
      );
    }
    await page
      .locator('#panel-custom-replay-double [data-role="pair-measurement-count"]')
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

    await page.locator("#tab-custom-gate-setting").click();
    await page.waitForSelector("#panel-custom-gate-setting .generated-layout-canvas");
    const settingQubit = page.locator(
      '#panel-custom-gate-setting [data-generated-item-id="setting-q"]',
    );
    const settingGateTicksLocator = page.locator(
      '#panel-custom-gate-setting [data-generated-item-id="setting-gate"] [data-role="ticks"]',
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
      page.locator('#panel-custom-gate-setting [data-role="measure-lens"]'),
    );
    await page.mouse.move(settingAfterGate.x, settingAfterGate.y);
    await page.mouse.down();
    await page.mouse.move(settingLensCenter.x, settingLensCenter.y, {
      steps: 14,
    });
    await page.mouse.up();
    await wait(1800);
    const settingRecordedStatus = await page
      .locator("#panel-custom-gate-setting .generated-experiment-status")
      .textContent();
    if (!/Experiment ready/.test(settingRecordedStatus || "")) {
      throw new Error(
        `Auto-recorded gate experiment was not ready: ${settingRecordedStatus}`,
      );
    }
    const gateInitialCounts = await waitForSingleTubeTotal(
      page,
      "panel-custom-gate-setting",
      1,
    );
    if (gateInitialCounts.blue !== 0 || gateInitialCounts.red !== 1) {
      throw new Error(
        `Recorded gate setting change was not used: ${JSON.stringify(gateInitialCounts)}`,
      );
    }
    await page.waitForFunction(() => {
      const status = document.querySelector(
        "#panel-custom-gate-setting .generated-experiment-status",
      )?.textContent || "";
      return !/Running experiment/.test(status);
    });
    const recordedGateSettingActions = await page.evaluate(() => {
      const canvas = document.querySelector(
        "#panel-custom-gate-setting .generated-layout-canvas",
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
      "panel-custom-gate-setting",
    );
    if (gateCountsAfterTick.total !== 0) {
      throw new Error(
        `Gate setting change did not clear measurement counts: ${JSON.stringify(gateCountsAfterTick)}`,
      );
    }
    await page
      .locator('#panel-custom-gate-setting [data-role="measurement-count"]')
      .selectOption("100");
    const gateUpdatedCounts = await waitForSingleTubeTotal(
      page,
      "panel-custom-gate-setting",
      100,
    );
    if (gateUpdatedCounts.blue !== 0 || gateUpdatedCounts.red !== 100) {
      throw new Error(
        `Recorded experiment did not replay recorded gate setting changes: ${JSON.stringify(gateUpdatedCounts)}`,
      );
    }

    await page.locator("#tab-custom-smoke").click();
    await page.waitForSelector("#panel-custom-smoke .generated-layout-canvas");

    const qubit = page.locator('#panel-custom-smoke [data-component="qubit"]');
    const measurement = page.locator(
      '#panel-custom-smoke [data-role="measurement-tool"]',
    );
    const countSelect = page.locator(
      '#panel-custom-smoke [data-role="measurement-count"]',
    );
    const recordButtons = await page
      .locator('#panel-custom-smoke [data-generated-experiment-action="record"]')
      .count();
    if (recordButtons !== 0) {
      throw new Error(`Generated tabs still show a Record button: ${recordButtons}`);
    }
    const smokeInitialStatus = await page
      .locator("#panel-custom-smoke .generated-experiment-status")
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
      page.locator('#panel-custom-smoke [data-role="measure-lens"]'),
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
      .locator("#panel-custom-smoke .generated-experiment-status")
      .textContent();
    if (!/Experiment ready/.test(savedStatus || "")) {
      throw new Error(`Auto-recorded experiment was not ready: ${savedStatus}`);
    }

    await countSelect.selectOption("5");
    const afterSelect = await waitForTotal(page, 5);
    await measurement.click();
    const afterClick = await waitForTotal(page, 10);

    await page
      .locator('#panel-custom-smoke [data-generated-experiment-action="reset"]')
      .click();
    await wait(300);
    const resetStatus = await page
      .locator("#panel-custom-smoke .generated-experiment-status")
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
    await page.locator("#tab-custom-smoke").click();
    await wait(400);
    const reloadedStatus = await page
      .locator("#panel-custom-smoke .generated-experiment-status")
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

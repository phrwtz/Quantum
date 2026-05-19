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
  const pairParts = page.locator(
    '#playgroundCanvas [data-component="double-measurement"] [data-playground-measurement-part]',
  );
  const qubitCount = await qubit.count();
  const pairCount = await pairMeasurement.count();
  if (qubitCount !== 1 || pairCount !== 1) {
    throw new Error(
      `Editor setup failed: qubits=${qubitCount}, doubleMeasurements=${pairCount}`,
    );
  }
  const internalPartCount = await pairParts.count();
  if (internalPartCount === 0) {
    throw new Error(
      "Double measurement did not expose independently editable parts",
    );
  }
  const ejectionPartCount = await page
    .locator(
      '#playgroundCanvas [data-component="double-measurement"] [data-role^="pair-eject-"][data-playground-measurement-part]',
    )
    .count();
  if (ejectionPartCount !== 2) {
    throw new Error(
      `Double measurement did not expose both ejection sites as editable parts: ${ejectionPartCount}`,
    );
  }
  const pairBox = await pairMeasurement.boundingBox();
  const capacityBox = await pairCapacity.boundingBox();
  const tubeRackBox = await pairTubeRack.boundingBox();
  if (!pairBox || !capacityBox || !tubeRackBox) {
    throw new Error("Missing double measurement capacity or tube rack bounds");
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

  const lens = page.locator(
    '#playgroundCanvas [data-component="double-measurement"] [data-role="pair-lens"]',
  );
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
    !savedDoubleMeasurementDefault.hasEjectLeft ||
    !savedDoubleMeasurementDefault.hasEjectRight ||
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
  const pairBeforeGroupDrag = await pairMeasurement.boundingBox();
  await page.mouse.move(pairGroupDragPoint.x, pairGroupDragPoint.y);
  await page.mouse.down();
  await page.mouse.move(pairGroupDragPoint.x + 55, pairGroupDragPoint.y + 25, {
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
    await runEditorDoubleMeasurementSmoke(page);

  await page.evaluate(() => {
    localStorage.setItem(
      "quantum_generated_tabs_v1",
      JSON.stringify({
        overrides: {},
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
            experiment: null,
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
            experiment: {
              version: 1,
              recordedAt: Date.now(),
              initialQubits: [
                {
                  itemId: "replay-q-top",
                  center: { x: 106, y: 146 },
                  vector: [1, 0],
                },
                {
                  itemId: "replay-q-bottom",
                  center: { x: 106, y: 256 },
                  vector: [1, 0],
                },
              ],
              gateSettings: [],
              actions: [
                {
                  type: "double-measure",
                  measurementId: "replay-measure",
                  leftQubitId: "replay-q-top",
                  rightQubitId: "replay-q-bottom",
                },
              ],
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
            experiment: {
              version: 1,
              recordedAt: Date.now(),
              initialQubits: [
                {
                  itemId: "setting-q",
                  center: { x: 106, y: 206 },
                  vector: [1, 0],
                },
              ],
              gateSettings: [{ itemId: "setting-gate", tickIndex: 0 }],
              actions: [
                {
                  type: "gate",
                  qubitId: "setting-q",
                  gateId: "setting-gate",
                  tickIndex: 0,
                },
                {
                  type: "single-measure",
                  qubitId: "setting-q",
                  measurementId: "setting-measure",
                },
              ],
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
              experiment: null,
            },
          ],
        }),
      );
    });

    await page.reload({ waitUntil: "domcontentloaded" });
    await page.locator("#tab-custom-fresh-double").click();
    await page.waitForSelector("#panel-custom-fresh-double .generated-layout-canvas");
    const freshDoubleStatus = await page
      .locator("#panel-custom-fresh-double .generated-experiment-status")
      .textContent();
    if (/Experiment saved/.test(freshDoubleStatus || "")) {
      throw new Error("Fresh generated double tab incorrectly shows a saved experiment");
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
    const replayTopQubit = page.locator(
      '#panel-custom-replay-double [data-generated-item-id="replay-q-top"]',
    );
    const replayBottomQubit = page.locator(
      '#panel-custom-replay-double [data-generated-item-id="replay-q-bottom"]',
    );
    const replayTopStart = await rectCenter(replayTopQubit);
    const replayBottomStart = await rectCenter(replayBottomQubit);
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
    await page
      .locator('#panel-custom-gate-setting [data-role="measurement-count"]')
      .selectOption("1");
    const gateInitialCounts = await waitForSingleTubeTotal(
      page,
      "panel-custom-gate-setting",
      1,
    );
    if (gateInitialCounts.blue !== 1 || gateInitialCounts.red !== 0) {
      throw new Error(
        `Recorded gate setting baseline was not blue: ${JSON.stringify(gateInitialCounts)}`,
      );
    }
    const settingGateTicks = await page
      .locator('#panel-custom-gate-setting [data-generated-item-id="setting-gate"] [data-role="ticks"]')
      .boundingBox();
    if (!settingGateTicks) {
      throw new Error("Missing generated single-gate tick ring");
    }
    const settingGateCenter = {
      x: settingGateTicks.x + settingGateTicks.width / 2,
      y: settingGateTicks.y + settingGateTicks.height / 2,
    };
    await page.mouse.move(settingGateCenter.x, settingGateCenter.y);
    await page.mouse.down();
    await page.mouse.move(
      settingGateCenter.x,
      settingGateCenter.y + settingGateTicks.height * 0.42,
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
        `Recorded experiment did not use updated gate setting: ${JSON.stringify(gateUpdatedCounts)}`,
      );
    }

    await page.locator("#tab-custom-smoke").click();
    await page.waitForSelector("#panel-custom-smoke .generated-layout-canvas");

    const qubit = page.locator('#panel-custom-smoke [data-component="qubit"]');
    const record = page.locator(
      '#panel-custom-smoke [data-generated-experiment-action="record"]',
    );
    const measurement = page.locator(
      '#panel-custom-smoke [data-role="measurement-tool"]',
    );
    const countSelect = page.locator(
      '#panel-custom-smoke [data-role="measurement-count"]',
    );

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

    await record.click();
    await wait(200);
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
    await record.click();
    await wait(300);
    const savedStatus = await page
      .locator("#panel-custom-smoke .generated-experiment-status")
      .textContent();
    if (!/Experiment saved/.test(savedStatus || "")) {
      throw new Error(`Experiment was not saved: ${savedStatus}`);
    }

    await page.reload({ waitUntil: "domcontentloaded" });
    await page.locator("#tab-custom-smoke").click();
    await wait(400);
    const reloadedStatus = await page
      .locator("#panel-custom-smoke .generated-experiment-status")
      .textContent();
    if (!/Experiment saved/.test(reloadedStatus || "")) {
      throw new Error(`Experiment did not persist: ${reloadedStatus}`);
    }

    await countSelect.selectOption("5");
    const afterSelect = await waitForTotal(page, 5);
    await measurement.click();
    const afterClick = await waitForTotal(page, 10);
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

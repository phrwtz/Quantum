const fs = require("node:fs");
const fsp = require("node:fs/promises");
const http = require("node:http");
const path = require("node:path");
const { pathToFileURL } = require("node:url");
const { chromium } = require("playwright");
const { createServer: createBackendServer } = require("../backend/server.cjs");

const rootDir = path.resolve(__dirname, "..");
const expectedGeneratedTabLabels = [
  "Introduction",
  "One qubit",
  "Two qubits",
  "Entanglement 1",
  "Entanglement 2",
  "Entanglement 3",
];
const expectedLocalFileTabLabels = [
  "Editor",
  "Doc Editor",
  "Local Lab",
  ...expectedGeneratedTabLabels,
];
const contentFilePaths = new Map([
  ["generated-tabs", path.join(rootDir, "data", "generated-tabs.json")],
  ["documents", path.join(rootDir, "data", "whats-this-documents.json")],
]);
const fallbackContent = new Map([
  ["generated-tabs", { tabs: [] }],
  ["documents", { documents: [] }],
]);

const mimeTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
};

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function activateTab(page, tabTarget) {
  await page.evaluate((target) => {
    if (typeof window.setActiveTab === "function") {
      window.setActiveTab(target);
      return;
    }
    Array.from(document.querySelectorAll(".tab-btn")).find(
      (button) => button.dataset.tabTarget === target,
    )?.click();
  }, tabTarget);
}

function isIgnorableBrowserConsoleError(message) {
  return /Failed to load resource: net::ERR_(CONNECTION_CLOSED|ABORTED)/.test(
    message || "",
  );
}

function cloneJson(value) {
  return JSON.parse(JSON.stringify(value));
}

function readInitialContentState() {
  return Object.fromEntries(
    Array.from(contentFilePaths.entries()).map(([name, filePath]) => {
      try {
        return [name, JSON.parse(fs.readFileSync(filePath, "utf8"))];
      } catch (_error) {
        return [name, cloneJson(fallbackContent.get(name))];
      }
    }),
  );
}

function sendJson(response, status, payload) {
  response.writeHead(status, {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Cache-Control": "no-store",
    "Content-Type": mimeTypes[".json"],
  });
  response.end(JSON.stringify(payload));
}

function readRequestJson(request) {
  return new Promise((resolve, reject) => {
    let body = "";
    request.setEncoding("utf8");
    request.on("data", (chunk) => {
      body += chunk;
    });
    request.on("end", () => {
      try {
        resolve(JSON.parse(body || "{}"));
      } catch (error) {
        reject(error);
      }
    });
    request.on("error", reject);
  });
}

function startServer() {
  const contentState = readInitialContentState();
  const server = http.createServer(async (request, response) => {
    try {
      if (request.method === "OPTIONS") {
        response.writeHead(204, {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        });
        response.end("");
        return;
      }
      const requestUrl = new URL(request.url || "/", "http://127.0.0.1");
      const contentMatch = requestUrl.pathname.match(
        /^\/__quantum-content\/([a-z-]+)$/,
      );
      if (contentMatch) {
        const contentName = contentMatch[1];
        if (!Object.prototype.hasOwnProperty.call(contentState, contentName)) {
          response.writeHead(404);
          response.end("Not found");
          return;
        }
        if (request.method === "GET") {
          sendJson(response, 200, contentState[contentName]);
          return;
        }
        if (request.method === "POST") {
          contentState[contentName] = await readRequestJson(request);
          sendJson(response, 200, { ok: true });
          return;
        }
        response.writeHead(405);
        response.end("Method not allowed");
        return;
      }
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

function startBackendServer() {
  const server = createBackendServer();
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

async function api(baseUrl, pathName, options = {}) {
  const response = await fetch(`${baseUrl}${pathName}`, {
    method: options.method || "GET",
    headers: options.body ? { "Content-Type": "application/json" } : undefined,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  const text = await response.text();
  return {
    response,
    body: text ? JSON.parse(text) : {},
  };
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

async function installContentApiHelpers(page) {
  await page.addInitScript(() => {
    window.readQuantumContentState = (contentName) => {
      const request = new XMLHttpRequest();
      request.open("GET", `/__quantum-content/${contentName}`, false);
      request.send(null);
      if (request.status < 200 || request.status >= 300) {
        throw new Error(`Unable to read ${contentName}`);
      }
      return JSON.parse(request.responseText || "{}");
    };
    window.writeQuantumContentState = (contentName, payload) => {
      const request = new XMLHttpRequest();
      request.open("POST", `/__quantum-content/${contentName}`, false);
      request.send(JSON.stringify(payload));
      if (request.status < 200 || request.status >= 300) {
        throw new Error(`Unable to write ${contentName}`);
      }
      return true;
    };
  });
}

async function installBrowserLocalContentTrap(page) {
  await page.addInitScript(() => {
    localStorage.setItem(
      "quantum_local_content_state_v1_generated-tabs",
      JSON.stringify({
        tabs: [
          {
            id: "browser-local-ghost",
            label: "Browser Local Ghost",
            layout: { items: [], canvasWidth: 600, canvasHeight: 420 },
          },
        ],
      }),
    );
    localStorage.setItem(
      "quantum_local_content_state_v1_documents",
      JSON.stringify({
        documents: [
          {
            version: 1,
            tabId: "custom-one-qubit",
            title: "What's this?",
            scenes: [
              {
                id: "browser-local-ghost-scene",
                title: "Scene",
                items: [
                  {
                    type: "text-box",
                    left: 0,
                    top: 0,
                    width: 300,
                    height: 120,
                    text: "Browser local ghost document",
                  },
                ],
                canvasWidth: 600,
                canvasHeight: 420,
              },
            ],
          },
        ],
      }),
    );
  });
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
  const canonicalSeparateGroupId = "separate-two-qubit-measurement";
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
          label: "Separate two qubit measurement",
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
    window.writeQuantumContentState("generated-tabs", { tabs: [] });
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
      (entry) => entry.id === "separate-two-qubit-measurement",
    );
    const legacyAliasCount = (payload.groups || []).filter((entry) =>
      ["hyphen-separate-smoke", "sequential-edit-smoke"].includes(entry.id),
    ).length;
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
      legacyAliasCount,
      structuralLabel: structuralGroup?.label || "",
      structuralMagnifierCount: structuralMagnifiers.length,
      structuralMagnifierLeft: structuralMagnifiers[0]?.left,
      structuralMagnifierTop: structuralMagnifiers[0]?.top,
    };
  });
  if (
    normalizedLegacySeparate.label !== "Separate two qubit measurement" ||
    normalizedLegacySeparate.magnifierCount !== 1 ||
    normalizedLegacySeparate.magnifierLeft !== 99 ||
    normalizedLegacySeparate.magnifierTop !== 266 ||
    normalizedLegacySeparate.height < 386 ||
    normalizedLegacySeparate.legacyAliasCount !== 0 ||
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
  await select.selectOption(`group:${canonicalSeparateGroupId}`);
  await page.mouse.click(canvasBox.x + 210, canvasBox.y + 90);
  await wait(250);

  const group = page.locator(
    `#playgroundCanvas > [data-component="component-group"][data-group-component-id="${canonicalSeparateGroupId}"]`,
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
      `#playgroundCanvas > [data-component="component-group"][data-group-component-id="${canonicalSeparateGroupId}"] > .saved-group-child[data-component="single-magnifier"]`,
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
  await page.locator("#playgroundSaveButton").click();
  await wait(250);
  const savedSequentialLayout = await page.evaluate(() => {
    const state = JSON.parse(
      JSON.stringify(window.readQuantumContentState("generated-tabs")),
    );
    const entry = (state.tabs || []).find(
      (tab) => tab.label === "Sequential Edit Smoke",
    );
    const groupItem = entry?.layout?.items?.find(
      (item) => item.groupComponentId === "separate-two-qubit-measurement",
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
    window.writeQuantumContentState("generated-tabs", {
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
    });
  });
  await page.reload({ waitUntil: "domcontentloaded" });
  await page.locator("#tab-plaground").click();
  await page.waitForSelector("#playgroundCanvas");

  const migrated = await page.evaluate(() => {
    const groups = JSON.parse(
      localStorage.getItem("quantum_playground_group_components_v1") || "{}",
    ).groups || [];
    const tabs = JSON.parse(
      JSON.stringify(window.readQuantumContentState("generated-tabs")),
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
    (label) => label === "Separate two qubit measurement",
  ).length;
  if (
    sequentialCount !== 1 ||
    migrated.groupLabels.includes("separate") ||
    migrated.pickerLabels.includes("Sequential two qubit measurement") ||
    migrated.pickerLabels.includes("separate") ||
    !migrated.pickerLabels.includes("Separate two qubit measurement") ||
    migrated.pickerValues.includes("group:separate") ||
    !migrated.pickerValues.includes("group:separate-two-qubit-measurement") ||
    !migrated.tabLabels.includes("Test") ||
    !migrated.tabButtonLabels.includes("Test") ||
    !migrated.tabLabels.includes("Entanglement 2") ||
    !migrated.tabLabels.includes("Entanglement 3") ||
    !migrated.tabButtonLabels.includes("Entanglement 2") ||
    !migrated.tabButtonLabels.includes("Entanglement 3") ||
    migrated.tabLabels.includes("Entanglement 1") ||
    migrated.tabButtonLabels.includes("Entanglement 1") ||
    migrated.keepGroupId !== "separate-two-qubit-measurement"
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
      JSON.stringify(window.readQuantumContentState("generated-tabs")),
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
    window.writeQuantumContentState("documents", {
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
      });
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
    const reset = panel?.querySelector(
      '[data-generated-experiment-action="reset"]',
    );
    return {
      overlayHidden: document.getElementById("docRuntimeOverlay")?.hidden,
      docRuntime: canvas?.dataset.docRuntimeCanvas || "",
      tabId: canvas?.dataset.generatedTabId || "",
      resetLabel: reset?.textContent?.trim() || "",
      whatsThisButtons:
        panel?.querySelectorAll('[data-generated-document-action="whats-this"]')
          .length || 0,
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
    inlineDocState.resetLabel !== "Back to the Doc Smoke A tab" ||
    inlineDocState.whatsThisButtons !== 0 ||
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
    const reset = panel?.querySelector(
      '[data-generated-experiment-action="reset"]',
    );
    return {
      docRuntime: canvas?.dataset.docRuntimeCanvas || "",
      resetLabel: reset?.textContent?.trim() || "",
      whatsThisButtons:
        panel?.querySelectorAll('[data-generated-document-action="whats-this"]')
          .length || 0,
      qubits: panel?.querySelectorAll('[data-component="qubit"]').length || 0,
      textCount: panel?.querySelectorAll('[data-component="text-box"]').length || 0,
    };
  }, saved.id);
  if (
    restoredAfterDoc.docRuntime ||
    restoredAfterDoc.resetLabel !== "Reset" ||
    restoredAfterDoc.whatsThisButtons !== 1 ||
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
      JSON.stringify(window.readQuantumContentState("documents")),
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
      JSON.stringify(window.readQuantumContentState("documents")),
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
  const docTextEditable = await docTextBoxBody.evaluate(
    (body) => body.isContentEditable,
  );
  if (docTextEdited !== "Edited doc text box." || !docTextEditable) {
    throw new Error(
      `Doc Editor text box edit failed: text=${docTextEdited} editable=${docTextEditable}`,
    );
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
          editable:
            textBox.querySelector('[data-role="text-box-body"]')
              ?.isContentEditable || false,
          buttons: Array.from(
            textBox.querySelectorAll('[data-role="text-box-action"]'),
          ).map((button) => button.textContent || ""),
        }));
    }, saved.id);
  const firstRuntimeTextBoxes = await visibleTextBoxes();
  if (
    firstRuntimeTextBoxes.length !== 1 ||
    firstRuntimeTextBoxes[0].text !== "Remember to measure twice." ||
    firstRuntimeTextBoxes[0].editable ||
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
    secondRuntimeTextBoxes[0].editable ||
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
      JSON.stringify(window.readQuantumContentState("generated-tabs")),
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

  const openButton = page.locator("#editorOpenTabButton");
  const openButtonCount = await openButton.count();
  const openButtonEnabled =
    openButtonCount === 1 ? await openButton.isEnabled() : false;
  if (openButtonCount !== 1 || !openButtonEnabled) {
    throw new Error(
      `Editor Open tab button is missing or disabled: count=${openButtonCount}, enabled=${openButtonEnabled}`,
    );
  }
  await openButton.click();
  const openPanelVisible = await page.locator("#editorOpenTabPanel").isVisible();
  if (!openPanelVisible) {
    throw new Error("Editor Open tab button did not reveal the saved-tab selector");
  }
  await openButton.click();

  await page.locator("#playgroundComponentSelect").selectOption("single-gate");
  const gateCanvasBox = await page.locator("#playgroundCanvas").boundingBox();
  if (!gateCanvasBox) {
    throw new Error("Missing editor canvas for single-gate dial smoke");
  }
  await page.mouse.click(gateCanvasBox.x + 380, gateCanvasBox.y + 210);
  await wait(150);
  await page.waitForSelector(
    '#playgroundCanvas > .playground-node[data-component="single-gate"]',
  );
  const dragEditorGateArrowToTick = async (targetTick) => {
    const points = await page.evaluate((tickIndex) => {
      const gate = document.querySelector(
        '#playgroundCanvas > .playground-node[data-component="single-gate"]',
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
      throw new Error("Missing editor gate dial points");
    }
    await page.mouse.move(points.start.x, points.start.y);
    await page.mouse.down();
    await page.mouse.move(points.end.x, points.end.y, { steps: 10 });
    await page.mouse.up();
    await wait(250);
  };
  const editorGateState = () =>
    page.evaluate(() => {
      const gate = document.querySelector(
        '#playgroundCanvas > .playground-node[data-component="single-gate"]',
      );
      const ticks = Array.from(gate?.querySelectorAll(".tick") || []);
      return {
        left: Number.parseFloat(gate?.style.left || "0"),
        top: Number.parseFloat(gate?.style.top || "0"),
        activeTick: ticks.findIndex((tick) => tick.classList.contains("active")),
      };
    });
  const editorGateTargetTick = 4;
  const editorGateBefore = await editorGateState();
  await dragEditorGateArrowToTick(editorGateTargetTick);
  const editorGateAfter = await editorGateState();
  if (
    editorGateAfter.activeTick !== editorGateTargetTick ||
    Math.abs(editorGateAfter.left - editorGateBefore.left) > 2 ||
    Math.abs(editorGateAfter.top - editorGateBefore.top) > 2
  ) {
    throw new Error(
      `Editor gate dial drag moved the gate or missed the tick: before=${JSON.stringify(
        editorGateBefore,
      )} after=${JSON.stringify(editorGateAfter)}`,
    );
  }

  await page.locator("#playgroundComponentSelect").selectOption("qubit");
  const newTabCanvasBox = await page.locator("#playgroundCanvas").boundingBox();
  if (!newTabCanvasBox) {
    throw new Error("Missing editor canvas for Teleportation save smoke");
  }
  await page.mouse.click(newTabCanvasBox.x + 160, newTabCanvasBox.y + 160);
  await wait(150);
  await page.locator("#editorNewTabName").fill("Teleportation");
  await page.locator("#playgroundSaveButton").click();
  await wait(250);
  const teleportationCreated = await page.evaluate(() => {
    const state = JSON.parse(
      JSON.stringify(window.readQuantumContentState("generated-tabs")),
    );
    const entry = (state.tabs || []).find((tab) => tab.label === "Teleportation");
    return {
      id: entry?.id || "",
      itemCount: entry?.layout?.items?.length || 0,
      gateTick: entry?.layout?.items?.find((item) => item.type === "single-gate")
        ?.singleGateTick,
      tabExists: Boolean(entry?.id && document.querySelector(`#tab-${entry.id}`)),
      status: document.querySelector("#playgroundStatus")?.textContent || "",
      editorStatus: document.querySelector("#editorDocumentStatus")?.textContent || "",
      renameDisabled:
        document.querySelector("#editorRenameTabButton")?.disabled ?? true,
      deleteDisabled:
        document.querySelector("#editorDeleteTabButton")?.disabled ?? true,
    };
  });
  if (
    !teleportationCreated.id ||
    teleportationCreated.itemCount < 1 ||
    teleportationCreated.gateTick !== editorGateTargetTick ||
    !teleportationCreated.tabExists ||
    !/Saved to Teleportation/.test(teleportationCreated.status) ||
    !/Editing: Teleportation/.test(teleportationCreated.editorStatus) ||
    teleportationCreated.renameDisabled ||
    teleportationCreated.deleteDisabled
  ) {
    throw new Error(
      `Editor Save did not create a new Teleportation tab: ${JSON.stringify(teleportationCreated)}`,
    );
  }
  page.once("dialog", async (dialog) => {
    if (dialog.type() !== "confirm") {
      throw new Error(`Expected Delete Tab confirm, saw ${dialog.type()}`);
    }
    await dialog.accept();
  });
  await page.locator("#editorDeleteTabButton").click();
  await wait(250);
  const teleportationDeleted = await page.evaluate((tabId) => {
    const state = JSON.parse(
      JSON.stringify(window.readQuantumContentState("generated-tabs")),
    );
    return {
      stillStored: (state.tabs || []).some((tab) => tab.id === tabId),
      stillInDom: Boolean(document.querySelector(`#tab-${tabId}`)),
      editorStatus: document.querySelector("#editorDocumentStatus")?.textContent || "",
    };
  }, teleportationCreated.id);
  if (
    teleportationDeleted.stillStored ||
    teleportationDeleted.stillInDom ||
    !/Untitled/.test(teleportationDeleted.editorStatus)
  ) {
    throw new Error(
      `Editor Delete did not remove temporary Teleportation tab: ${JSON.stringify(teleportationDeleted)}`,
    );
  }

  await openButton.click();
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

  await page.locator("#editorNewTabButton").click();
  await wait(150);
  await page.locator("#editorNewTabName").fill("Doc Smoke B");
  await page.locator("#playgroundSaveButton").click();
  await wait(250);
  const created = await page.evaluate(() => {
    const state = JSON.parse(
      JSON.stringify(window.readQuantumContentState("generated-tabs")),
    );
    const entry = (state.tabs || []).find(
      (tab) => tab.label === "Doc Smoke B",
    );
    return {
      id: entry?.id || "",
      itemCount: entry?.layout?.items?.length || 0,
      status: document.querySelector("#editorDocumentStatus")?.textContent || "",
    };
  });
  if (!created.id || created.itemCount !== 0 || !/Doc Smoke B/.test(created.status)) {
    throw new Error(`Editor Save did not create the second tab: ${JSON.stringify(created)}`);
  }

  const sourceTabBox = await page.locator(`#tab-${created.id}`).boundingBox();
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
      JSON.stringify(window.readQuantumContentState("generated-tabs")),
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
  }, { copyId: created.id, savedId: saved.id });
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
      JSON.stringify(window.readQuantumContentState("generated-tabs")),
    );
    const entry = (state.tabs || []).find((tab) => tab.id === copyId);
    return {
      label: entry?.label || "",
      tabText: document.querySelector(`#tab-${copyId}`)?.textContent?.trim() || "",
      status: document.querySelector("#editorDocumentStatus")?.textContent || "",
    };
  }, created.id);
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
      JSON.stringify(window.readQuantumContentState("generated-tabs")),
    );
    return {
      stillStored: (state.tabs || []).some((tab) => tab.id === copyId),
      stillInDom: Boolean(document.querySelector(`#tab-${copyId}`)),
      editorCount: document.querySelectorAll("#playgroundCanvas > .playground-node")
        .length,
      status: document.querySelector("#editorDocumentStatus")?.textContent || "",
    };
  }, created.id);
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
    window.writeQuantumContentState("generated-tabs", {
      tabs: [
        {
          id: "doc-measure-recording",
          label: "Doc Measure Recording",
          layout: { items: [], canvasWidth: 760, canvasHeight: 420 },
        },
      ],
    });
    window.writeQuantumContentState("documents", {
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
    });
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
      JSON.stringify(window.readQuantumContentState("documents")),
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
      const cnotSpringGeometry = (() => {
        const spring = cnot.querySelector(".cnot-spring-top");
        const flange = cnot.querySelector(".cnot-output-flange-top");
        if (!(spring instanceof HTMLElement) || !(flange instanceof HTMLElement)) {
          return { ok: false, reason: "missing spring or flange" };
        }
        const originalTransition = spring.style.transition;
        spring.style.transition = "none";
        cnotRuntime.body.classList.add("platform-extended");
        const itemRect = cnot.getBoundingClientRect();
        const bodyRect = cnotRuntime.body.getBoundingClientRect();
        const flangeRect = flange.getBoundingClientRect();
        const springRect = spring.getBoundingClientRect();
        const cnotStyle = getComputedStyle(cnot);
        const flangeStyle = getComputedStyle(flange);
        const result = {
          ok: true,
          cnotOverflow: cnotStyle.overflow,
          flangeOverflow: flangeStyle.overflow,
          springLeftMinusFlangeRight: Number.parseFloat(
            (springRect.left - flangeRect.right).toFixed(2),
          ),
          springLeftMinusBodyRight: Number.parseFloat(
            (springRect.left - bodyRect.right).toFixed(2),
          ),
          springRightMinusItemRight: Number.parseFloat(
            (springRect.right - itemRect.right).toFixed(2),
          ),
        };
        cnotRuntime.body.classList.remove("platform-extended");
        spring.style.transition = originalTransition;
        return result;
      })();
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
        cnotSpringGeometry,
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
      pruneGeneratedRuntimeState();
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
    !result.cnotSpringGeometry.ok ||
    result.cnotSpringGeometry.cnotOverflow !== "visible" ||
    result.cnotSpringGeometry.flangeOverflow !== "visible" ||
    Math.abs(result.cnotSpringGeometry.springLeftMinusFlangeRight) > 4 ||
    result.cnotSpringGeometry.springRightMinusItemRight < 40 ||
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
    window.writeQuantumContentState("generated-tabs", {
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
    });
    window.writeQuantumContentState("documents", {
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
    });
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
      JSON.stringify(window.readQuantumContentState("documents")),
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

async function runEntangledMathSmoke(page) {
  const coreUsage = await page.evaluate(() => {
    if (!window.QuantumCore) {
      return null;
    }
    const methodNames = [
      "createQubit",
      "createRegister",
      "productRegister",
      "applySingleQubitGate",
      "applyCnot",
      "marginalProbabilities",
    ];
    const originals = {};
    const calls = {};
    methodNames.forEach((name) => {
      originals[name] = window.QuantumCore[name];
      calls[name] = 0;
      window.QuantumCore[name] = function wrappedCoreMethod(...args) {
        calls[name] += 1;
        return originals[name].apply(this, args);
      };
    });
    try {
      const rootHalf = Math.SQRT1_2;
      const pair = {
        amplitudes: entangledAmplitudesFromQubitVectors(
          [rootHalf, rootHalf],
          [0, 1],
        ),
      };
      applyCNOTToPair(pair);
      pairOutcomeProbabilitiesFromState(pair);
      pairMarginalsFromEntangledState(pair);
      applySingleQubitGateToPair(pair, 0, gateMatrixForTick(9));
      collapsePairStateBySingleQubitMeasurement(pair, 0, "blue");
      conditionalVectorAfterPairMeasurement(pair, 1, "red");
      vectorTimesMatrix2([1, 0], gateMatrixForTick(6));
      probabilitiesFromVector2([rootHalf, rootHalf]);
      cnotOutcomeProbabilitiesFromQubitVectors(
        [rootHalf, rootHalf],
        [0, 1],
      );
      cnotMarginalProbabilitiesFromQubitVectors(
        [rootHalf, rootHalf],
        [0, 1],
      );
    } finally {
      methodNames.forEach((name) => {
        window.QuantumCore[name] = originals[name];
      });
    }
    return calls;
  });
  if (
    !coreUsage ||
    coreUsage.createQubit <= 0 ||
    coreUsage.createRegister <= 0 ||
    coreUsage.productRegister <= 0 ||
    coreUsage.applySingleQubitGate <= 0 ||
    coreUsage.applyCnot <= 0 ||
    coreUsage.marginalProbabilities <= 0
  ) {
    throw new Error(
      `Entangled tour helpers did not use QuantumCore: ${JSON.stringify(coreUsage)}`,
    );
  }

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
    const fourRegisterReplayCanvas = document.createElement("div");
    fourRegisterReplayCanvas.className = "generated-layout-canvas";
    fourRegisterReplayCanvas.dataset.generatedTabId =
      "four-qubit-register-replay-smoke";
    const fourRegisterReplayMeasure = createGeneratedLayoutItemNode(
      savedGroupComponentType(REGISTER_FOUR_QUBIT_MEASUREMENT_GROUP_ID),
      {
        id: "four-register-replay-measure",
        left: 300,
        top: 30,
        width: 940,
        height: 438,
        measurementRegisterQubitCount: 4,
      },
    );
    fourRegisterReplayCanvas.append(fourRegisterReplayMeasure);
    document.body.appendChild(fourRegisterReplayCanvas);
    const fourRegisterReplayRuntime =
      initializeGeneratedSeparatedPairMeasurementItem(fourRegisterReplayMeasure);
    const originalMathRandom = Math.random;
    try {
      const replayRandomValues = [];
      for (let index = 0; index < 12; index += 1) {
        replayRandomValues.push(index % 2 === 0 ? 0.75 : 0.25);
        replayRandomValues.push(0.25, 0.25, 0.25);
      }
      Math.random = () =>
        replayRandomValues.length > 0 ? replayRandomValues.shift() : 0.25;
      replayGeneratedRecordedExperimentFast(
        fourRegisterReplayCanvas,
        {
          initialQubits: [
            {
              itemId: "four-register-q0",
              logicalQubitId: 1,
              vector: [rootHalf, rootHalf],
            },
            {
              itemId: "four-register-q1",
              logicalQubitId: 2,
              vector: [1, 0],
            },
            {
              itemId: "four-register-q2",
              logicalQubitId: 3,
              vector: [1, 0],
            },
            {
              itemId: "four-register-q3",
              logicalQubitId: 4,
              vector: [1, 0],
            },
          ],
          actions: [
            {
              type: "cnot",
              topQubitId: "four-register-q0",
              topQubitLogicalId: 1,
              bottomQubitId: "four-register-q1",
              bottomQubitLogicalId: 2,
            },
            {
              type: "cnot",
              topQubitId: "four-register-q1",
              topQubitLogicalId: 2,
              bottomQubitId: "four-register-q2",
              bottomQubitLogicalId: 3,
            },
            {
              type: "cnot",
              topQubitId: "four-register-q2",
              topQubitLogicalId: 3,
              bottomQubitId: "four-register-q3",
              bottomQubitLogicalId: 4,
            },
            {
              type: "separated-pair-measure",
              measurementId: "four-register-replay-measure",
              qubitId: "four-register-q0",
              logicalQubitId: 1,
              orderIndex: 0,
              registerQubitCount: 4,
            },
            {
              type: "separated-pair-measure",
              measurementId: "four-register-replay-measure",
              qubitId: "four-register-q1",
              logicalQubitId: 2,
              orderIndex: 1,
              registerQubitCount: 4,
            },
            {
              type: "separated-pair-measure",
              measurementId: "four-register-replay-measure",
              qubitId: "four-register-q2",
              logicalQubitId: 3,
              orderIndex: 2,
              registerQubitCount: 4,
            },
            {
              type: "separated-pair-measure",
              measurementId: "four-register-replay-measure",
              qubitId: "four-register-q3",
              logicalQubitId: 4,
              orderIndex: 3,
              registerQubitCount: 4,
            },
          ],
        },
        12,
      );
    } finally {
      Math.random = originalMathRandom;
    }
    const fourRegisterReplayCounts = {
      ...fourRegisterReplayRuntime.tubeCounts,
    };
    fourRegisterReplayCanvas.remove();
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
    const mailboxReplayCanvas = document.createElement("div");
    mailboxReplayCanvas.className = "generated-layout-canvas playground-canvas";
    mailboxReplayCanvas.dataset.generatedTabId = "mailbox-replay-smoke";
    mailboxReplayCanvas.style.width = "640px";
    mailboxReplayCanvas.style.height = "320px";
    const mailboxReplayQubit = createGeneratedLayoutItemNode("qubit", {
      id: "mailbox-replay-q",
      left: 40,
      top: 96,
      width: 52,
      height: 52,
      qubitId: 8,
    });
    const mailboxReplayBox = createGeneratedLayoutItemNode("mailbox", {
      id: "mailbox-replay-box",
      left: 280,
      top: 56,
      width: 220,
      height: 150,
    });
    mailboxReplayCanvas.append(mailboxReplayQubit, mailboxReplayBox);
    document.body.appendChild(mailboxReplayCanvas);
    prepareGeneratedLayoutCanvas(mailboxReplayCanvas);
    const mailboxReplayExperiment = {
      initialQubits: [
        {
          itemId: "mailbox-replay-q",
          logicalQubitId: 8,
          vector: [1, 0],
          center: { x: 66, y: 122 },
        },
      ],
      actions: [
        {
          type: "drag",
          qubitId: "mailbox-replay-q",
          qubitLogicalId: 8,
          path: [
            { x: 66, y: 122, t: 0 },
            { x: 360, y: 128, t: 80 },
          ],
        },
        {
          type: "mailbox-send",
          mailboxId: "mailbox-replay-box",
          qubitId: "mailbox-replay-q",
          qubitLogicalId: 8,
        },
      ],
    };
    const mailboxAnimatedReplayCompleted =
      await replayGeneratedRecordedExperimentAnimated(
        mailboxReplayCanvas,
        mailboxReplayExperiment,
      );
    const mailboxAnimatedReplay = {
      completed: mailboxAnimatedReplayCompleted,
      qubitConnected: mailboxReplayQubit.isConnected,
      qubitCount: mailboxReplayCanvas.querySelectorAll('[data-component="qubit"]')
        .length,
    };
    mailboxReplayCanvas.remove();
    const mailboxStaticReplayCanvas = document.createElement("div");
    mailboxStaticReplayCanvas.className = "generated-layout-canvas playground-canvas";
    mailboxStaticReplayCanvas.dataset.generatedTabId =
      "mailbox-static-replay-smoke";
    mailboxStaticReplayCanvas.style.width = "640px";
    mailboxStaticReplayCanvas.style.height = "320px";
    const mailboxStaticQubit = createGeneratedLayoutItemNode("qubit", {
      id: "mailbox-replay-q",
      left: 40,
      top: 96,
      width: 52,
      height: 52,
      qubitId: 8,
    });
    const mailboxStaticBox = createGeneratedLayoutItemNode("mailbox", {
      id: "mailbox-replay-box",
      left: 280,
      top: 56,
      width: 220,
      height: 150,
    });
    mailboxStaticReplayCanvas.append(mailboxStaticQubit, mailboxStaticBox);
    document.body.appendChild(mailboxStaticReplayCanvas);
    prepareGeneratedLayoutCanvas(mailboxStaticReplayCanvas);
    applyGeneratedRecordedExperimentStaticFinalVisualState(
      mailboxStaticReplayCanvas,
      mailboxReplayExperiment,
    );
    const mailboxStaticReplay = {
      qubitConnected: mailboxStaticQubit.isConnected,
      qubitCount: mailboxStaticReplayCanvas.querySelectorAll('[data-component="qubit"]')
        .length,
    };
    mailboxStaticReplayCanvas.remove();
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
      fourRegisterReplayCounts,
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
      mailboxAnimatedReplay,
      mailboxStaticReplay,
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
    result.fourRegisterReplayCounts.bbbb !== 6 ||
    result.fourRegisterReplayCounts.rrrr !== 6 ||
    result.fourRegisterReplayCounts.rbrb !== 0 ||
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
    result.replayGateTickRules.recordedTickFallback !== 9 ||
    result.mailboxAnimatedReplay.completed !== true ||
    result.mailboxAnimatedReplay.qubitConnected !== false ||
    result.mailboxAnimatedReplay.qubitCount !== 0 ||
    result.mailboxStaticReplay.qubitConnected !== false ||
    result.mailboxStaticReplay.qubitCount !== 0
  ) {
    throw new Error(
      `Entangled amplitude math failed: ${JSON.stringify(result)}`,
    );
  }
}

async function runDocEditorLandingIntroTextSmoke(page) {
  const originalViewport = page.viewportSize();
  const originalGeneratedTabs = await page.evaluate(() =>
    JSON.parse(JSON.stringify(window.readQuantumContentState("generated-tabs"))),
  );
  try {
    await page.setViewportSize({ width: 1200, height: 1000 });
    await page.reload({ waitUntil: "domcontentloaded" });
    await page.evaluate(() => {
      unlockWorkshop();
      setWorkshopEditorMode("whats-this");
    });
    await page.waitForSelector("#panel-doc-editor:not([hidden])");
    await page.locator("#docEditorTabSelect").selectOption("editor-introduction");
    await page.waitForSelector("#docEditorCanvas [data-component='text-box']");
    const initial = await page.evaluate(() => {
      const textBox = document.querySelector(
        "#docEditorCanvas [data-component='text-box']",
      );
      const body = textBox?.querySelector('[data-role="text-box-body"]');
      return {
        text: body?.textContent || "",
        editable: body instanceof HTMLElement && body.isContentEditable,
        left:
          textBox instanceof HTMLElement
            ? Number.parseFloat(textBox.style.left)
            : null,
        top:
          textBox instanceof HTMLElement
            ? Number.parseFloat(textBox.style.top)
            : null,
        width: textBox instanceof HTMLElement ? textBox.offsetWidth : null,
        height: textBox instanceof HTMLElement ? textBox.offsetHeight : null,
        resizable:
          textBox instanceof HTMLElement &&
          textBox.dataset.layoutResizable === "true" &&
          Boolean(textBox.querySelector(":scope > .layout-resize-handle")),
      };
    });
    if (
      !initial.text.includes("Welcome to Qubit Lab") ||
      !initial.text.includes("preview of coming attractions") ||
      !initial.text.includes("a demonstration") ||
      initial.text.includes("an demonstration") ||
      initial.text.includes("tabs above") ||
      !initial.editable ||
      !initial.resizable
    ) {
      throw new Error(
        `Doc Editor Introduction text box did not load editable landing text: ${JSON.stringify(initial)}`,
      );
    }

    const docTextBox = page.locator("#docEditorCanvas [data-component='text-box']");
    const docTextBoxBody = page.locator(
      "#docEditorCanvas [data-component='text-box'] [data-role='text-box-body']",
    );
    const editedLandingText = "Edited landing intro from Doc Editor.";
    await docTextBoxBody.fill(editedLandingText);
    await wait(120);

    const beforeDrag = await docTextBox.boundingBox();
    const bodyBox = await docTextBoxBody.boundingBox();
    if (!beforeDrag || !bodyBox) {
      throw new Error("Missing Introduction text box bounds before drag");
    }
    await page.mouse.move(bodyBox.x + 28, bodyBox.y + 28);
    await page.mouse.down();
    await page.mouse.move(bodyBox.x + 92, bodyBox.y + 58, { steps: 8 });
    await page.mouse.up();
    await wait(160);
    const afterDrag = await docTextBox.boundingBox();
    if (
      !afterDrag ||
      afterDrag.x - beforeDrag.x < 24 ||
      afterDrag.y - beforeDrag.y < 10
    ) {
      throw new Error(
        `Doc Editor Introduction text box did not drag: before=${JSON.stringify(
          beforeDrag,
        )} after=${JSON.stringify(afterDrag)}`,
      );
    }

    await page.mouse.move(
      afterDrag.x + afterDrag.width - 4,
      afterDrag.y + afterDrag.height - 4,
    );
    await page.mouse.down();
    await page.mouse.move(
      afterDrag.x + afterDrag.width + 78,
      afterDrag.y + afterDrag.height + 44,
      { steps: 8 },
    );
    await page.mouse.up();
    await wait(160);
    const afterResize = await docTextBox.boundingBox();
    if (
      !afterResize ||
      afterResize.width - afterDrag.width < 36 ||
      afterResize.height - afterDrag.height < 20
    ) {
      throw new Error(
        `Doc Editor Introduction text box did not resize: before=${JSON.stringify(
          afterDrag,
        )} after=${JSON.stringify(afterResize)}`,
      );
    }

    await page.locator("#docEditorDoneButton").click();
    await wait(250);
    const result = await page.evaluate((expectedText) => {
      const generatedTabs = window.readQuantumContentState("generated-tabs");
      const intro = (generatedTabs.tabs || []).find(
        (entry) => entry.id === "editor-introduction",
      );
      const textBox = (intro?.layout?.items || []).find(
        (item) => item.type === "text-box",
      );
      return {
        activeTab:
          document.querySelector(".tab-btn.active")?.dataset.tabTarget || "",
        storedText: textBox?.text || "",
        storedLeft: textBox?.left,
        storedTop: textBox?.top,
        storedWidth: textBox?.width,
        storedHeight: textBox?.height,
        expectedText,
      };
    }, editedLandingText);
    if (
      result.activeTab !== "editor-introduction" ||
      result.storedText !== editedLandingText ||
      result.storedLeft <= initial.left ||
      result.storedTop <= initial.top ||
      result.storedWidth <= initial.width ||
      result.storedHeight <= initial.height
    ) {
      throw new Error(
        `Doc Editor Introduction landing text persistence failed: ${JSON.stringify(result)}`,
      );
    }
  } finally {
    await page.evaluate((state) => {
      window.writeQuantumContentState("generated-tabs", state);
    }, originalGeneratedTabs);
    if (originalViewport) {
      await page.setViewportSize(originalViewport);
    }
    await page.reload({ waitUntil: "domcontentloaded" });
  }
}

async function runFileModeRepositoryContentSmoke(browser) {
  const page = await browser.newPage({ viewport: { width: 1100, height: 760 } });
  await installBrowserLocalContentTrap(page);
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    const text = message.text();
    if (message.type() === "error" && !isIgnorableBrowserConsoleError(text)) {
      errors.push(text);
    }
  });
  try {
    const fileUrl = pathToFileURL(path.join(rootDir, "index.html")).href;
    await page.goto(fileUrl, { waitUntil: "domcontentloaded" });
    await page.waitForSelector("#tab-custom-one-qubit", { state: "attached" });
    const result = await page.evaluate(() => {
      const labels = Array.from(document.querySelectorAll(".tab-btn")).map(
        (button) => button.textContent.trim(),
      );
      const bundleFiles = window.__QUANTUM_REPOSITORY_CONTENT__?.files || {};
      const tabs = bundleFiles["data/generated-tabs.json"]?.tabs || [];
      const docs =
        bundleFiles["data/whats-this-documents.json"]?.documents || [];
      const one = docs.find((doc) => doc.tabId === "custom-one-qubit");
      const last = one?.scenes?.[one.scenes.length - 1];
      const lastText = (last?.items || [])
        .filter((item) => item.type === "text-box")
        .map((item) => item.text || "")
        .join("\n");
      const entanglementOne = docs.find(
        (doc) => doc.tabId === "custom-entanglement-2",
      );
      const entanglementLast =
        entanglementOne?.scenes?.[entanglementOne.scenes.length - 1];
      const entanglementLastText = (entanglementLast?.items || [])
        .filter((item) => item.type === "text-box")
        .map((item) => item.text || "")
        .join("\n");
      const oneQubitRuntimeDocument =
        typeof documentForTabId === "function"
          ? documentForTabId("custom-one-qubit")
          : null;
      const oneQubitRuntimeText = (
        oneQubitRuntimeDocument?.scenes?.[0]?.items || []
      )
        .filter((item) => item.type === "text-box")
        .map((item) => item.text || "")
        .join("\n");
      const oneQubitToolbar = document.querySelector(
        "#panel-custom-one-qubit [data-generated-document-action='whats-this']",
      );
      const landingToolbar = document.querySelector(
        "#panel-editor-introduction [data-generated-document-action='whats-this']",
      );
      const landingTourSignLabel = document.querySelector(
        "#panel-editor-introduction .landing-tour-sign .landing-sign-label",
      );
      const landingClosedSign = document.querySelector(
        "#panel-editor-introduction .landing-lab-sign-closed",
      );
      const tourPanelIds = [
        "custom-one-qubit",
        "custom-two-qubits",
        "custom-entanglement-2",
        "custom-entanglement-3",
        "editor-entanglement-3",
      ];
      const tourCanvasStyles = tourPanelIds.map((tabId) => {
        const canvas = document.querySelector(
          `#panel-${CSS.escape(tabId)} .generated-layout-viewport > .generated-layout-canvas:not(.doc-runtime-canvas):not(.doc-editor-canvas)`,
        );
        if (!canvas) {
          return null;
        }
        const style = getComputedStyle(canvas);
        return {
          backgroundColor: style.backgroundColor,
          backgroundImage: style.backgroundImage,
        };
      });
      const oneQubitResetButton = document.querySelector(
        "#panel-custom-one-qubit [data-generated-experiment-action='reset']",
      );
      const oneQubitWhatsThisButton = document.querySelector(
        "#panel-custom-one-qubit [data-generated-document-action='whats-this']",
      );
      const oneQubitStatus = document.querySelector(
        "#panel-custom-one-qubit .generated-experiment-status",
      );
      const fontSizeOf = (element) =>
        element ? Number.parseFloat(getComputedStyle(element).fontSize) : null;
      const oneQubitStatusFont = fontSizeOf(oneQubitStatus);
      const oneQubitResetFont = fontSizeOf(oneQubitResetButton);
      const oneQubitWhatsThisFont = fontSizeOf(oneQubitWhatsThisButton);
      return {
        labels,
        generatedLabels: tabs.map((tab) => tab.label),
        oneQubitLastSceneHasMarker: lastText.includes(
          'No more "canned" experiments',
        ),
        oneQubitLastSceneHasEnding: lastText.includes(
          "Happy experimenting!",
        ),
        oneQubitLastSceneHasClue: lastText.includes("(That's a clue!)"),
        entanglementOneLastSceneHasMarker: entanglementLastText.includes(
          "Here are some questions to ponder:",
        ),
        entanglementOneLastSceneHasOldText: entanglementLastText.includes(
          "leave it to you to experiment but here are some questions to get you started",
        ),
        hasBrowserLocalGhostTab: labels.includes("Browser Local Ghost"),
        hasBrowserLocalGhostDocument: oneQubitRuntimeText.includes(
          "Browser local ghost document",
        ),
        hasAuthoringTabs: Boolean(
          document.querySelector("#tab-plaground") &&
            document.querySelector("#tab-doc-editor"),
        ),
        hasOneQubitToolbar: Boolean(oneQubitToolbar),
        hasLandingToolbar: Boolean(landingToolbar),
        landingTourSignText: landingTourSignLabel?.textContent?.trim() || "",
        landingClosedSignText: landingClosedSign?.textContent?.trim() || "",
        tourCanvasesPaleGreen:
          tourCanvasStyles.length === tourPanelIds.length &&
          tourCanvasStyles.every(
            (style) =>
              style?.backgroundColor === "rgb(230, 255, 204)" &&
              style?.backgroundImage === "none",
          ),
        oneQubitStatusMatchesButtonFonts:
          Number.isFinite(oneQubitStatusFont) &&
          Number.isFinite(oneQubitResetFont) &&
          Number.isFinite(oneQubitWhatsThisFont) &&
          Math.abs(oneQubitStatusFont - oneQubitResetFont) < 0.01 &&
          Math.abs(oneQubitStatusFont - oneQubitWhatsThisFont) < 0.01,
      };
    });
    if (
      result.labels.join("|") !== expectedLocalFileTabLabels.join("|") ||
      result.generatedLabels.join("|") !== expectedGeneratedTabLabels.join("|") ||
      !result.hasAuthoringTabs ||
      !result.hasOneQubitToolbar ||
      result.hasLandingToolbar ||
      result.landingTourSignText !== "To the Tour" ||
      result.landingClosedSignText !== "Closed" ||
      !result.tourCanvasesPaleGreen ||
      !result.oneQubitStatusMatchesButtonFonts ||
      !result.oneQubitLastSceneHasMarker ||
      !result.oneQubitLastSceneHasEnding ||
      result.oneQubitLastSceneHasClue ||
      !result.entanglementOneLastSceneHasMarker ||
      result.entanglementOneLastSceneHasOldText ||
      result.hasBrowserLocalGhostTab ||
      result.hasBrowserLocalGhostDocument ||
      errors.length > 0
    ) {
      throw new Error(
        `File-mode repository content smoke failed: ${JSON.stringify({
          ...result,
          errors,
        })}`,
      );
    }
    await page.locator("#panel-editor-introduction .landing-tour-sign").click();
    const tourSignClick = await page.evaluate(() => ({
      activeTab: document.querySelector(".tab-btn.active")?.dataset.tabTarget || "",
      onePanelVisible: Boolean(
        document.querySelector("#panel-custom-one-qubit:not([hidden])"),
      ),
    }));
    if (
      tourSignClick.activeTab !== "custom-one-qubit" ||
      !tourSignClick.onePanelVisible
    ) {
      throw new Error(
        `Landing tour sign did not open One qubit: ${JSON.stringify(tourSignClick)}`,
      );
    }
    return result;
  } finally {
    await page.close();
  }
}

async function runWorkshopPasswordSessionSmoke(browser, baseUrl) {
  const assertWorkshopOpen = async (page, label) => {
    const state = await page.evaluate(() => ({
      activeTab: document.querySelector(".tab-btn.active")?.dataset.tabTarget || "",
      editorVisible: Boolean(
        document.querySelector("#panel-plaground:not([hidden])"),
      ),
      unlocked: document.body.classList.contains("workshop-unlocked"),
      mode: document.documentElement.dataset.workshopEditorMode || "",
      passwordOpen: Boolean(
        document.querySelector("#workshopPasswordOverlay:not([hidden])"),
      ),
      hasTabEditorButton: Boolean(document.querySelector("#editorNewTabButton")),
      hasComponentEditorButton: Boolean(
        document.querySelector("[data-workshop-mode='component']"),
      ),
      hasDocEditorButton: Boolean(
        document.querySelector("[data-workshop-mode='whats-this']"),
      ),
    }));
    if (
      state.activeTab !== "plaground" ||
      !state.editorVisible ||
      !state.unlocked ||
      state.mode !== "tab" ||
      state.passwordOpen ||
      !state.hasTabEditorButton ||
      !state.hasComponentEditorButton ||
      !state.hasDocEditorButton
    ) {
      throw new Error(
        `${label} did not open the Workshop editors: ${JSON.stringify(state)}`,
      );
    }
  };

  const page = await browser.newPage({ viewport: { width: 1200, height: 820 } });
  try {
    await installContentApiHelpers(page);
    await page.goto(`${baseUrl}/index.html`, { waitUntil: "domcontentloaded" });
    await page.locator("#panel-editor-introduction .landing-workshop-sign").click();
    await page.waitForSelector("#workshopPasswordOverlay:not([hidden])");
    await page.locator("#workshopPasswordInput").fill("142857");
    await page.locator("#workshopPasswordForm").evaluate((form) => {
      form.requestSubmit();
    });
    await page.waitForSelector("#panel-plaground:not([hidden])");
    await assertWorkshopOpen(page, "Password unlock");

    await page.locator("[data-workshop-mode='component']").first().click();
    const componentMode = await page.evaluate(() => ({
      activeTab: document.querySelector(".tab-btn.active")?.dataset.tabTarget || "",
      mode: document.documentElement.dataset.workshopEditorMode || "",
    }));
    if (componentMode.activeTab !== "plaground" || componentMode.mode !== "component") {
      throw new Error(
        `Workshop component editor mode failed: ${JSON.stringify(componentMode)}`,
      );
    }

    await page.locator("[data-workshop-mode='whats-this']").first().click();
    const docMode = await page.evaluate(() => ({
      activeTab: document.querySelector(".tab-btn.active")?.dataset.tabTarget || "",
      docEditorVisible: Boolean(
        document.querySelector("#panel-doc-editor:not([hidden])"),
      ),
      mode: document.documentElement.dataset.workshopEditorMode || "",
    }));
    if (
      docMode.activeTab !== "doc-editor" ||
      !docMode.docEditorVisible ||
      docMode.mode !== "whats-this"
    ) {
      throw new Error(`Workshop Doc Editor mode failed: ${JSON.stringify(docMode)}`);
    }

    await page.locator("#panel-doc-editor [data-workshop-mode='back']").click();
    await page.waitForSelector("#panel-editor-introduction:not([hidden])");
    await page.locator("#panel-editor-introduction .landing-workshop-sign").click();
    await page.waitForSelector("#panel-plaground:not([hidden])");
    await assertWorkshopOpen(page, "Same-session unlock after Back");

    await page.reload({ waitUntil: "domcontentloaded" });
    await page.locator("#panel-editor-introduction .landing-workshop-sign").click();
    await page.waitForSelector("#workshopPasswordOverlay:not([hidden])");
    const reloadState = await page.evaluate(() => ({
      activeTab: document.querySelector(".tab-btn.active")?.dataset.tabTarget || "",
      editorVisible: Boolean(
        document.querySelector("#panel-plaground:not([hidden])"),
      ),
      passwordOpen: Boolean(
        document.querySelector("#workshopPasswordOverlay:not([hidden])"),
      ),
      unlocked: document.body.classList.contains("workshop-unlocked"),
    }));
    if (
      reloadState.activeTab === "plaground" ||
      reloadState.editorVisible ||
      !reloadState.passwordOpen ||
      reloadState.unlocked
    ) {
      throw new Error(
        `Reload skipped Workshop password: ${JSON.stringify(reloadState)}`,
      );
    }
  } finally {
    await page.close();
  }

  const freshPage = await browser.newPage({ viewport: { width: 1200, height: 820 } });
  try {
    await installContentApiHelpers(freshPage);
    await freshPage.goto(`${baseUrl}/index.html`, { waitUntil: "domcontentloaded" });
    await freshPage
      .locator("#panel-editor-introduction .landing-workshop-sign")
      .click();
    await freshPage.waitForSelector("#workshopPasswordOverlay:not([hidden])");
    const freshState = await freshPage.evaluate(() => ({
      activeTab: document.querySelector(".tab-btn.active")?.dataset.tabTarget || "",
      editorVisible: Boolean(
        document.querySelector("#panel-plaground:not([hidden])"),
      ),
      passwordOpen: Boolean(
        document.querySelector("#workshopPasswordOverlay:not([hidden])"),
      ),
      unlocked: document.body.classList.contains("workshop-unlocked"),
    }));
    if (
      freshState.activeTab === "plaground" ||
      freshState.editorVisible ||
      !freshState.passwordOpen ||
      freshState.unlocked
    ) {
      throw new Error(
        `Fresh session skipped Workshop password: ${JSON.stringify(freshState)}`,
      );
    }
  } finally {
    await freshPage.close();
  }
}

async function runLocalMultiQubitLabSmoke(page) {
  await activateTab(page, "local-lab");
  await page.waitForSelector("#panel-local-lab:not([hidden])");

  const initial = await page.evaluate(() => ({
    qubitCount: document.querySelectorAll(".local-lab-qubit").length,
    basisCount: document.querySelectorAll(".local-lab-basis-state").length,
    ketText: document.querySelector("#localLabKetVector")?.textContent || "",
    status: document.querySelector("#localLabStatus")?.textContent || "",
  }));
  if (
    initial.qubitCount !== 3 ||
    initial.basisCount !== 8 ||
    !initial.ketText.includes("Register: 3 qubits (8 basis states)") ||
    !initial.status.includes("Ready: 3 local qubits")
  ) {
    throw new Error(
      `Local lab initial state failed: ${JSON.stringify(initial)}`,
    );
  }

  await page.locator("#localLabQubitCount").selectOption("8");
  const expanded = await page.evaluate(() => ({
    qubitCount: document.querySelectorAll(".local-lab-qubit").length,
    basisCount: document.querySelectorAll(".local-lab-basis-state").length,
    status: document.querySelector("#localLabStatus")?.textContent || "",
    ketText: document.querySelector("#localLabKetVector")?.textContent || "",
  }));
  if (
    expanded.qubitCount !== 8 ||
    expanded.basisCount !== 256 ||
    !expanded.status.includes("Ready: 8 local qubits") ||
    !expanded.ketText.includes("Register: 8 qubits (256 basis states)")
  ) {
    throw new Error(
      `Local lab expanded register failed: ${JSON.stringify(expanded)}`,
    );
  }

  await page.locator("#panel-local-lab [data-local-lab-gate='Y']").click();
  await page.locator("#panel-local-lab [data-local-lab-gate='S']").click();
  await page.locator("#panel-local-lab [data-local-lab-gate='T']").click();
  const expandedGates = await page.evaluate(() => ({
    status: document.querySelector("#localLabStatus")?.textContent || "",
    q0Text:
      document.querySelector(
        ".local-lab-qubit[data-local-lab-qubit-index='0'] .local-lab-qubit-probability",
      )?.textContent || "",
    activeBasis: Array.from(
      document.querySelectorAll(".local-lab-basis-state[data-active='true']"),
    ).map((cell) => cell.querySelector(".local-lab-basis-label")?.textContent || ""),
  }));
  if (
    expandedGates.status !== "T applied to q0" ||
    expandedGates.q0Text !== "B 0.0% / R 100.0%" ||
    expandedGates.activeBasis.join(",") !== "|10000000>"
  ) {
    throw new Error(
      `Local lab expanded gates failed: ${JSON.stringify(expandedGates)}`,
    );
  }

  await page.locator("#localLabSyncRoom").fill("classroom-smoke");
  await page.locator("#localLabSyncParticipant").fill("Bob");
  await page.locator("#localLabParticipantRole").selectOption("viewer");
  await page.locator("#localLabSaveSnapshotButton").click();
  await page.locator("#localLabQubitCount").selectOption("3");
  await page.locator("#localLabLoadSnapshotButton").click();
  const loadedSnapshot = await page.evaluate(() => ({
    qubitCount: document.querySelectorAll(".local-lab-qubit").length,
    status: document.querySelector("#localLabStatus")?.textContent || "",
    room: document.querySelector("#localLabSyncRoom")?.value || "",
    participant: document.querySelector("#localLabSyncParticipant")?.value || "",
    role: document.querySelector("#localLabParticipantRole")?.value || "",
    q0Text:
      document.querySelector(
        ".local-lab-qubit[data-local-lab-qubit-index='0'] .local-lab-qubit-probability",
      )?.textContent || "",
  }));
  if (
    loadedSnapshot.qubitCount !== 8 ||
    loadedSnapshot.status !== "Loaded lab: 8 qubits" ||
    loadedSnapshot.room !== "classroom-smoke" ||
    loadedSnapshot.participant !== "Bob" ||
    loadedSnapshot.role !== "viewer" ||
    loadedSnapshot.q0Text !== "B 0.0% / R 100.0%"
  ) {
    throw new Error(
      `Local lab snapshot load failed: ${JSON.stringify(loadedSnapshot)}`,
    );
  }

  await page.locator("#localLabClassroomLinkButton").click();
  const classroomLink = await page.evaluate(() => ({
    status: document.querySelector("#localLabSyncStatus")?.textContent || "",
    title: document.querySelector("#localLabClassroomLinkButton")?.title || "",
  }));
  if (
    !classroomLink.status.includes("Classroom link") ||
    !classroomLink.title.includes("room=classroom-smoke") ||
    !classroomLink.title.includes("participant=Bob") ||
    !classroomLink.title.includes("role=viewer") ||
    !classroomLink.title.includes("backend=")
  ) {
    throw new Error(
      `Local lab classroom link failed: ${JSON.stringify(classroomLink)}`,
    );
  }

  await page.locator("#localLabQubitCount").selectOption("3");

  await page.locator("#panel-local-lab [data-local-lab-gate='H']").click();
  await page.locator("#localLabTargetQubit").selectOption("1");
  await page.locator("#localLabCnotButton").click();

  const entangled = await page.evaluate(() => {
    const activeBasis = Array.from(
      document.querySelectorAll(".local-lab-basis-state[data-active='true']"),
    ).map((cell) => ({
      label: cell.querySelector(".local-lab-basis-label")?.textContent || "",
      probability:
        cell.querySelector(".local-lab-basis-probability")?.textContent || "",
    }));
    return {
      ketText: document.querySelector("#localLabKetVector")?.textContent || "",
      activeBasis,
      q0Text:
        document.querySelector(
          ".local-lab-qubit[data-local-lab-qubit-index='0'] .local-lab-qubit-probability",
        )?.textContent || "",
      q1Text:
        document.querySelector(
          ".local-lab-qubit[data-local-lab-qubit-index='1'] .local-lab-qubit-probability",
        )?.textContent || "",
      q2Text:
        document.querySelector(
          ".local-lab-qubit[data-local-lab-qubit-index='2'] .local-lab-qubit-probability",
        )?.textContent || "",
      status: document.querySelector("#localLabStatus")?.textContent || "",
    };
  });
  const activeBasisLabels = entangled.activeBasis.map((entry) => entry.label);
  if (
    !entangled.ketText.includes("|000>") ||
    !entangled.ketText.includes("|110>") ||
    !entangled.ketText.includes("p=0.500000") ||
    activeBasisLabels.join(",") !== "|000>,|110>" ||
    !entangled.activeBasis.every((entry) => entry.probability === "p=0.5") ||
    !entangled.q0Text.includes("B 50.0% / R 50.0%") ||
    !entangled.q1Text.includes("B 50.0% / R 50.0%") ||
    !entangled.q2Text.includes("B 100.0% / R 0.0%") ||
    entangled.status !== "C-NOT q0 -> q1"
  ) {
    throw new Error(
      `Local lab entanglement state failed: ${JSON.stringify(entangled)}`,
    );
  }

  await page
    .locator(".local-lab-qubit[data-local-lab-qubit-index='1']")
    .click({ button: "right" });
  const qubitInspectorText = await page
    .locator(".qubit-inspector-vector")
    .textContent();
  if (
    !qubitInspectorText ||
    !qubitInspectorText.includes("Register: 3 qubits (8 basis states)") ||
    !qubitInspectorText.includes("Selected member: q1") ||
    !qubitInspectorText.includes("|110>")
  ) {
    throw new Error(
      `Local lab qubit inspector failed: ${JSON.stringify(qubitInspectorText)}`,
    );
  }
  await page.locator(".qubit-inspector-close").click();

  await page
    .locator("#panel-local-lab [data-local-lab-gate='H']")
    .click({ button: "right" });
  const gateInspectorText = await page
    .locator(".qubit-inspector-vector")
    .textContent();
  if (
    !gateInspectorText ||
    !gateInspectorText.includes("H Gate") ||
    !gateInspectorText.includes("U (8 x 8)")
  ) {
    throw new Error(
      `Local lab gate inspector failed: ${JSON.stringify(gateInspectorText)}`,
    );
  }
  await page.locator(".qubit-inspector-close").click();

  await page.locator("#localLabMeasureQubit").selectOption("2");
  await page.locator("#localLabMeasureButton").click();
  const afterMeasure = await page.evaluate(() => ({
    status: document.querySelector("#localLabStatus")?.textContent || "",
    ketText: document.querySelector("#localLabKetVector")?.textContent || "",
  }));
  if (
    afterMeasure.status !== "Measured q2: blue (p=1)" ||
    !afterMeasure.ketText.includes("Register: 3 qubits (8 basis states)") ||
    !afterMeasure.ketText.includes("|000>") ||
    !afterMeasure.ketText.includes("|110>")
  ) {
    throw new Error(
      `Local lab single measurement failed: ${JSON.stringify(afterMeasure)}`,
    );
  }

  await page.locator("#localLabTeleportMessage").selectOption("tilted");
  await page.locator("#localLabTeleportRunButton").click();
  const teleport = await page.evaluate(() => {
    const activeBasis = Array.from(
      document.querySelectorAll(".local-lab-basis-state[data-active='true']"),
    ).map((cell) => ({
      label: cell.querySelector(".local-lab-basis-label")?.textContent || "",
      probability:
        cell.querySelector(".local-lab-basis-probability")?.textContent || "",
    }));
    return {
      labStatus: document.querySelector("#localLabStatus")?.textContent || "",
      teleportStatus:
        document.querySelector("#localLabTeleportStatus")?.textContent || "",
      q2Text:
        document.querySelector(
          ".local-lab-qubit[data-local-lab-qubit-index='2'] .local-lab-qubit-probability",
        )?.textContent || "",
      ketText: document.querySelector("#localLabKetVector")?.textContent || "",
      activeBasis,
    };
  });
  const teleportProbabilities = teleport.activeBasis
    .map((entry) => entry.probability)
    .sort()
    .join(",");
  if (
    !teleport.labStatus.startsWith("Bob correction ") ||
    !teleport.teleportStatus.includes("Complete: q2 has tilted") ||
    !teleport.teleportStatus.includes("fidelity=1") ||
    teleport.q2Text !== "B 80.0% / R 20.0%" ||
    teleport.activeBasis.length !== 2 ||
    teleportProbabilities !== "p=0.2,p=0.8" ||
    !teleport.ketText.includes("p=0.800000") ||
    !teleport.ketText.includes("p=0.200000")
  ) {
    throw new Error(
      `Local teleportation protocol failed: ${JSON.stringify(teleport)}`,
    );
  }

  const backend = await startBackendServer();
  try {
    await page.locator("#localLabBackendUrl").fill(backend.baseUrl);
    await page.locator("#localLabMailboxEmail").fill("alice@example.com");
    await page.locator("#localLabMailboxSendButton").click();
    await page.waitForFunction(
      () =>
        document
          .querySelector("#localLabMailboxStatus")
          ?.textContent?.includes("Link ready"),
      null,
      { timeout: 5000 },
    );
    const mailboxSent = await page.evaluate(() => ({
      token: document.querySelector("#localLabMailboxToken")?.value || "",
      href: document.querySelector("#localLabMailboxLink")?.href || "",
      hidden: document.querySelector("#localLabMailboxLink")?.hidden ?? true,
      status: document.querySelector("#localLabMailboxStatus")?.textContent || "",
    }));
    if (
      !mailboxSent.token.startsWith("mbx_") ||
      !mailboxSent.href.includes(`mailbox=${encodeURIComponent(mailboxSent.token)}`) ||
      !mailboxSent.href.includes("backend=") ||
      mailboxSent.hidden ||
      !mailboxSent.status.includes("q2")
    ) {
      throw new Error(
        `Local mailbox send failed: ${JSON.stringify(mailboxSent)}`,
      );
    }

    await page.locator("#localLabQubitCount").selectOption("1");
    await page.locator("#localLabMailboxReceiveButton").click();
    await page.waitForFunction(
      () =>
        document
          .querySelector("#localLabMailboxStatus")
          ?.textContent?.includes("Received q2"),
      null,
      { timeout: 5000 },
    );
    const mailboxReceived = await page.evaluate(() => ({
      qubitCount: document.querySelectorAll(".local-lab-qubit").length,
      activeQubit:
        document.querySelector(".local-lab-qubit.active")?.dataset
          ?.localLabQubitIndex || "",
      linkHidden: document.querySelector("#localLabMailboxLink")?.hidden ?? false,
      status: document.querySelector("#localLabStatus")?.textContent || "",
      mailboxStatus:
        document.querySelector("#localLabMailboxStatus")?.textContent || "",
      q2Text:
        document.querySelector(
          ".local-lab-qubit[data-local-lab-qubit-index='2'] .local-lab-qubit-probability",
        )?.textContent || "",
      ketText: document.querySelector("#localLabKetVector")?.textContent || "",
    }));
    if (
      mailboxReceived.qubitCount !== 3 ||
      mailboxReceived.activeQubit !== "2" ||
      !mailboxReceived.linkHidden ||
      mailboxReceived.status !== "Received mailbox q2" ||
      !mailboxReceived.mailboxStatus.includes("token claimed") ||
      mailboxReceived.q2Text !== "B 80.0% / R 20.0%" ||
      !mailboxReceived.ketText.includes("Register: 3 qubits (8 basis states)")
    ) {
      throw new Error(
        `Local mailbox receive failed: ${JSON.stringify(mailboxReceived)}`,
      );
    }

    await page.locator("#localLabDistributedProtocol").fill("smoke-teleport");
    await page.locator("#localLabProtocolRecipeSelect").selectOption("distributed-teleportation");
    await page.locator("#localLabProtocolLoadButton").click();
    await page.waitForFunction(
      () =>
        document
          .querySelector("#localLabProtocolStatus")
          ?.textContent?.includes("Distributed teleportation"),
      null,
      { timeout: 5000 },
    );
    const recipeLoaded = await page.evaluate(() => ({
      status: document.querySelector("#localLabProtocolStatus")?.textContent || "",
      steps: Array.from(
        document.querySelectorAll("#localLabProtocolStepList .local-lab-protocol-step"),
      ).map((step) => step.textContent || ""),
    }));
    if (
      !recipeLoaded.status.includes("0/3 complete") ||
      recipeLoaded.steps.length !== 3 ||
      !recipeLoaded.steps.join(" ").includes("Bob Bell + mail q1") ||
      !recipeLoaded.steps.join(" ").includes("Alice measure + send bits") ||
      !recipeLoaded.steps.join(" ").includes("Bob correct + verify")
    ) {
      throw new Error(
        `Protocol framework recipe load failed: ${JSON.stringify(recipeLoaded)}`,
      );
    }

    await page.locator("#localLabTeleportMessage").selectOption("tilted");
    await page.locator("#localLabDistributedBobStartButton").click();
    await page.waitForFunction(
      () =>
        document
          .querySelector("#localLabDistributedStatus")
          ?.textContent?.includes("Bob mailed q1"),
      null,
      { timeout: 5000 },
    );
    const distributedStarted = await page.evaluate(() => ({
      status:
        document.querySelector("#localLabDistributedStatus")?.textContent || "",
      protocolStatus:
        document.querySelector("#localLabProtocolStatus")?.textContent || "",
      linkHidden:
        document.querySelector("#localLabDistributedMailboxLink")?.hidden ?? true,
      href: document.querySelector("#localLabDistributedMailboxLink")?.href || "",
    }));
    if (
      distributedStarted.linkHidden ||
      !distributedStarted.href.includes("mailbox=mbx_") ||
      !distributedStarted.status.includes("protocol v") ||
      !distributedStarted.protocolStatus.includes("1/3 complete")
    ) {
      throw new Error(
        `Distributed teleportation start failed: ${JSON.stringify(distributedStarted)}`,
      );
    }

    await page.locator("#localLabDistributedAliceMeasureButton").click();
    await page.waitForFunction(
      () =>
        document
          .querySelector("#localLabDistributedStatus")
          ?.textContent?.includes("Alice sent bits"),
      null,
      { timeout: 5000 },
    );
    const distributedMeasured = await page.evaluate(() => ({
      status:
        document.querySelector("#localLabDistributedStatus")?.textContent || "",
      protocolStatus:
        document.querySelector("#localLabProtocolStatus")?.textContent || "",
      labStatus: document.querySelector("#localLabStatus")?.textContent || "",
    }));
    if (
      !distributedMeasured.status.includes("Alice sent bits") ||
      !distributedMeasured.protocolStatus.includes("2/3 complete") ||
      !distributedMeasured.labStatus.startsWith("Distributed: Alice measured")
    ) {
      throw new Error(
        `Distributed teleportation Alice step failed: ${JSON.stringify(distributedMeasured)}`,
      );
    }

    await page.locator("#localLabDistributedBobCorrectButton").click();
    await page.waitForFunction(
      () =>
        document
          .querySelector("#localLabDistributedStatus")
          ?.textContent?.includes("fidelity=1"),
      null,
      { timeout: 5000 },
    );
    const distributedComplete = await page.evaluate(() => ({
      status:
        document.querySelector("#localLabDistributedStatus")?.textContent || "",
      protocolStatus:
        document.querySelector("#localLabProtocolStatus")?.textContent || "",
      completeSteps: Array.from(
        document.querySelectorAll(
          "#localLabProtocolStepList .local-lab-protocol-step.complete",
        ),
      ).length,
      labStatus: document.querySelector("#localLabStatus")?.textContent || "",
      q2Text:
        document.querySelector(
          ".local-lab-qubit[data-local-lab-qubit-index='2'] .local-lab-qubit-probability",
        )?.textContent || "",
      ketText: document.querySelector("#localLabKetVector")?.textContent || "",
    }));
    if (
      !distributedComplete.status.includes("Complete: fidelity=1") ||
      !distributedComplete.protocolStatus.includes("3/3 complete") ||
      distributedComplete.completeSteps !== 3 ||
      !distributedComplete.labStatus.startsWith("Distributed: Bob correction") ||
      distributedComplete.q2Text !== "B 80.0% / R 20.0%" ||
      !distributedComplete.ketText.includes("Register: 3 qubits (8 basis states)")
    ) {
      throw new Error(
        `Distributed teleportation complete failed: ${JSON.stringify(distributedComplete)}`,
      );
    }

    await page.locator("#localLabDistributedProtocol").fill("smoke-ghz");
    await page.locator("#localLabProtocolRecipeSelect").selectOption("ghz-state");
    await page.locator("#localLabProtocolLoadButton").click();
    await page.waitForFunction(
      () =>
        document
          .querySelector("#localLabProtocolStatus")
          ?.textContent?.includes("GHZ state"),
      null,
      { timeout: 5000 },
    );
    const ghzRecipe = await page.evaluate(() => ({
      status: document.querySelector("#localLabProtocolStatus")?.textContent || "",
      steps: Array.from(
        document.querySelectorAll("#localLabProtocolStepList .local-lab-protocol-step"),
      ).map((step) => step.textContent || ""),
    }));
    if (
      !ghzRecipe.status.includes("0/4 complete") ||
      ghzRecipe.steps.length !== 4 ||
      !ghzRecipe.steps.join(" ").includes("Hadamard root")
    ) {
      throw new Error(
        `GHZ protocol recipe load failed: ${JSON.stringify(ghzRecipe)}`,
      );
    }
  } finally {
    await closeServer(backend.server);
  }

  await page.locator("#localLabQubitCount").selectOption("4");
  const resized = await page.evaluate(() => ({
    qubitCount: document.querySelectorAll(".local-lab-qubit").length,
    basisCount: document.querySelectorAll(".local-lab-basis-state").length,
    ketText: document.querySelector("#localLabKetVector")?.textContent || "",
  }));
  if (
    resized.qubitCount !== 4 ||
    resized.basisCount !== 16 ||
    !resized.ketText.includes("Register: 4 qubits (16 basis states)")
  ) {
    throw new Error(`Local lab resize failed: ${JSON.stringify(resized)}`);
  }
}

async function openSyncedLocalLabPage(browser, baseUrl, backendBaseUrl, roomId, participant) {
  const page = await browser.newPage({ viewport: { width: 1040, height: 760 } });
  await installContentApiHelpers(page);
  await page.goto(`${baseUrl}/index.html`, { waitUntil: "domcontentloaded" });
  await activateTab(page, "local-lab");
  await page.waitForSelector("#panel-local-lab:not([hidden])");
  await page.locator("#localLabBackendUrl").fill(backendBaseUrl);
  await page.locator("#localLabSyncRoom").fill(roomId);
  await page.locator("#localLabSyncParticipant").fill(participant);
  await page.locator("#localLabSyncConnectButton").click();
  await page.waitForFunction(
    () =>
      document
        .querySelector("#localLabSyncStatus")
        ?.textContent?.includes("Connected"),
    null,
    { timeout: 5000 },
  );
  await page.locator("#localLabSyncLiveToggle").setChecked(true);
  return page;
}

async function runLocalLabSharedSyncSmoke(browser, baseUrl) {
  const backend = await startBackendServer();
  const roomId = `sync-smoke-${Date.now()}`;
  let alice = null;
  let bob = null;
  try {
    alice = await openSyncedLocalLabPage(
      browser,
      baseUrl,
      backend.baseUrl,
      roomId,
      "Alice",
    );
    bob = await openSyncedLocalLabPage(
      browser,
      baseUrl,
      backend.baseUrl,
      roomId,
      "Bob",
    );

    await alice.locator("#panel-local-lab [data-local-lab-gate='H']").click();
    await bob.waitForFunction(
      () =>
        document
          .querySelector(
            ".local-lab-qubit[data-local-lab-qubit-index='0'] .local-lab-qubit-probability",
          )
          ?.textContent?.includes("B 50.0% / R 50.0%"),
      null,
      { timeout: 8000 },
    );

    await bob.locator("#localLabTargetQubit").selectOption("2");
    await bob.locator("#panel-local-lab [data-local-lab-gate='X']").click();
    await alice.waitForFunction(
      () =>
        document
          .querySelector(
            ".local-lab-qubit[data-local-lab-qubit-index='2'] .local-lab-qubit-probability",
          )
          ?.textContent?.includes("B 0.0% / R 100.0%"),
      null,
      { timeout: 8000 },
    );

    const result = await Promise.all([
      alice.evaluate(() => ({
        syncStatus: document.querySelector("#localLabSyncStatus")?.textContent || "",
        q0:
          document.querySelector(
            ".local-lab-qubit[data-local-lab-qubit-index='0'] .local-lab-qubit-probability",
          )?.textContent || "",
        q2:
          document.querySelector(
            ".local-lab-qubit[data-local-lab-qubit-index='2'] .local-lab-qubit-probability",
          )?.textContent || "",
        ketText: document.querySelector("#localLabKetVector")?.textContent || "",
      })),
      bob.evaluate(() => ({
        syncStatus: document.querySelector("#localLabSyncStatus")?.textContent || "",
        q0:
          document.querySelector(
            ".local-lab-qubit[data-local-lab-qubit-index='0'] .local-lab-qubit-probability",
          )?.textContent || "",
        q2:
          document.querySelector(
            ".local-lab-qubit[data-local-lab-qubit-index='2'] .local-lab-qubit-probability",
          )?.textContent || "",
        ketText: document.querySelector("#localLabKetVector")?.textContent || "",
      })),
    ]);

    const [aliceState, bobState] = result;
    if (
      aliceState.q0 !== "B 50.0% / R 50.0%" ||
      bobState.q0 !== "B 50.0% / R 50.0%" ||
      aliceState.q2 !== "B 0.0% / R 100.0%" ||
      bobState.q2 !== "B 0.0% / R 100.0%" ||
      !aliceState.ketText.includes("Register: 3 qubits (8 basis states)") ||
      !bobState.ketText.includes("Register: 3 qubits (8 basis states)")
    ) {
      throw new Error(
        `Local shared sync failed: ${JSON.stringify({ aliceState, bobState })}`,
      );
    }
  } finally {
    await alice?.close();
    await bob?.close();
    await closeServer(backend.server);
  }
}

async function openEntanglementThreeRoomPage(
  browser,
  baseUrl,
  backendUrl,
  sharedContext = null,
) {
  const context =
    sharedContext ||
    (await browser.newContext({
      viewport: { width: 1600, height: 900 },
    }));
  const page = await context.newPage();
  await installContentApiHelpers(page);
  await page.goto(
    `${baseUrl}/index.html?backend=${encodeURIComponent(backendUrl)}`,
    { waitUntil: "domcontentloaded" },
  );
  await page.locator("#panel-editor-introduction .landing-tour-sign").click();
  await page.locator("#tab-editor-entanglement-3").click({ force: true });
  await page.waitForSelector(
    "#panel-editor-entanglement-3:not([hidden]) .generated-layout-canvas",
  );
  await page.waitForFunction(
    () =>
      document
        .querySelector("#panel-editor-entanglement-3 .generated-experiment-status")
        ?.textContent?.includes("room send-receive-room"),
    null,
    { timeout: 8000 },
  );
  return { context, page };
}

async function runEntanglementThreeRoomMeasurementSmoke(browser, baseUrl) {
  const backend = await startBackendServer();
  const sharedContext = await browser.newContext({
    viewport: { width: 1600, height: 900 },
  });
  await sharedContext.addInitScript(() => {
    window.sessionStorage.setItem(
      "quantum_entanglement_three_session_v1",
      "deliberately-cloned-tab-session",
    );
    // Exercise the browser-neutral path instead of relying on Chromium's
    // implementations of Web Locks or BroadcastChannel.
    Object.defineProperty(window.navigator, "locks", {
      configurable: true,
      value: undefined,
    });
    window.BroadcastChannel = undefined;
  });
  let bob = null;
  let alice = null;
  try {
    bob = await openEntanglementThreeRoomPage(
      browser,
      baseUrl,
      backend.baseUrl,
      sharedContext,
    );
    alice = await openEntanglementThreeRoomPage(
      browser,
      baseUrl,
      backend.baseUrl,
      sharedContext,
    );

    const initial = await Promise.all(
      [bob.page, alice.page].map((page) =>
        page.evaluate(() => {
          const canvas = document.querySelector(
            "#panel-editor-entanglement-3 .generated-layout-canvas",
          );
          const measure = canvas?.querySelector(
            '[data-generated-item-id="entanglement-3-register-measurement"]',
          );
          const runtime = initializeGeneratedSeparatedPairMeasurementItem(measure);
          return {
            name: mailboxRoomState.displayName,
            qubits: Array.from(
              canvas?.querySelectorAll('[data-component="qubit"]') || [],
            ).map((qubit) => ({
              roomQubitIndex: qubit.dataset.roomQubitIndex || "",
              qubitId: qubit.dataset.qubitId || "",
              label: qubit.dataset.qubitLabel || "",
              coreLabel:
                qubit.querySelector(".playground-qubit-core")?.dataset
                  .qubitLabel || "",
            })),
            rackColumns: measure?.querySelectorAll(".pair-tube-column").length || 0,
            singleGateCount:
              canvas?.querySelectorAll('[data-component="single-gate"]').length || 0,
            cnotGateCount:
              canvas?.querySelectorAll('[data-component="cnot-gate"]').length || 0,
            registerQubitCount: runtime?.registerQubitCount || null,
            capacity:
              measure?.querySelector('[data-role="pair-capacity"]')
                ?.textContent || "",
            status:
              document.querySelector(
                "#panel-editor-entanglement-3 .generated-experiment-status",
              )?.textContent || "",
          };
        }),
      ),
    );
    const [bobInitial, aliceInitial] = initial;
    if (
      bobInitial.name !== "Bob" ||
      bobInitial.qubits.length !== 2 ||
      bobInitial.qubits[0].roomQubitIndex !== "0" ||
      bobInitial.qubits[0].qubitId !== "1" ||
      bobInitial.qubits[0].label !== "q0" ||
      bobInitial.qubits[0].coreLabel !== "q0" ||
      bobInitial.qubits[1].roomQubitIndex !== "1" ||
      bobInitial.qubits[1].qubitId !== "2" ||
      bobInitial.qubits[1].label !== "q1" ||
      bobInitial.qubits[1].coreLabel !== "q1" ||
      aliceInitial.name !== "Alice" ||
      aliceInitial.qubits.length !== 2 ||
      aliceInitial.qubits[0].roomQubitIndex !== "2" ||
      aliceInitial.qubits[0].qubitId !== "3" ||
      aliceInitial.qubits[0].label !== "q2" ||
      aliceInitial.qubits[0].coreLabel !== "q2" ||
      aliceInitial.qubits[1].roomQubitIndex !== "3" ||
      aliceInitial.qubits[1].qubitId !== "4" ||
      aliceInitial.qubits[1].label !== "q3" ||
      aliceInitial.qubits[1].coreLabel !== "q3" ||
      bobInitial.rackColumns !== 16 ||
      aliceInitial.rackColumns !== 16 ||
      bobInitial.singleGateCount !== 1 ||
      aliceInitial.singleGateCount !== 1 ||
      bobInitial.cnotGateCount !== 1 ||
      aliceInitial.cnotGateCount !== 1 ||
      bobInitial.registerQubitCount !== 4 ||
      aliceInitial.registerQubitCount !== 4 ||
      !bobInitial.capacity.includes("5 counts") ||
      !aliceInitial.capacity.includes("5 counts")
    ) {
      throw new Error(
        `Entanglement 3 room labels, apparatus, or 16-tube rack failed: ${JSON.stringify(initial)}`,
      );
    }

    async function runLocalEntanglementThreeQubitsThroughFlipper(page) {
      return page.evaluate(async () => {
        const canvas = document.querySelector(
          "#panel-editor-entanglement-3 .generated-layout-canvas",
        );
        const gateItem = canvas?.querySelector('[data-component="single-gate"]');
        const gateRuntime = initializeGeneratedSingleGateItem(gateItem, {
          singleGateTick: 3,
        });
        if (!canvas || !gateRuntime) {
          return { completed: false, reason: "missing gate runtime" };
        }
        setGeneratedGateRuntimeTick(gateRuntime, 3);
        recordGeneratedGateSettingAction(canvas, gateItem, 3);
        await mailboxRoomRecordGateSettingAction(canvas, gateItem, 3);
        const qubits = Array.from(
          canvas.querySelectorAll('[data-component="qubit"]'),
        );
        const completed = [];
        for (const qubit of qubits) {
          completed.push(
            await runGeneratedSingleGateTransit(canvas, qubit, gateRuntime),
          );
        }
        return {
          completed: completed.every(Boolean),
          results: completed,
          actions:
            generatedExperimentStateForCanvas(canvas)?.actions?.map((action) => ({
              type: action.type,
              tickIndex: action.tickIndex,
              qubitLogicalId: action.qubitLogicalId,
            })) || [],
        };
      });
    }

    const flipperRuns = await Promise.all(
      [bob.page, alice.page].map((page) =>
        runLocalEntanglementThreeQubitsThroughFlipper(page),
      ),
    );
    if (
      flipperRuns.some(
        (run) =>
          !run.completed ||
          run.results.length !== 2 ||
          run.actions.filter((action) => action.type === "gate").length < 2 ||
          run.actions.some(
            (action) => action.type === "gate" && action.tickIndex !== 3,
          ),
      )
    ) {
      throw new Error(
        `Entanglement 3 flipper setup failed: ${JSON.stringify(flipperRuns)}`,
      );
    }

    async function measureLocalEntanglementThreeQubits(
      page,
      { markFirstQubitRemoteEntangled = false } = {},
    ) {
      return page.evaluate(async (markFirstShared) => {
        const canvas = document.querySelector(
          "#panel-editor-entanglement-3 .generated-layout-canvas",
        );
        const measure = canvas?.querySelector(
          '[data-generated-item-id="entanglement-3-register-measurement"]',
        );
        const runtime = initializeGeneratedSeparatedPairMeasurementItem(measure);
        const qubits = Array.from(
          canvas?.querySelectorAll('[data-component="qubit"]') || [],
        );
        if (markFirstShared && qubits[0]) {
          const state = ensureGeneratedQubitRuntimeState(qubits[0]);
          if (state) {
            state.pairQubitIndex = 0;
            state.pairState = {
              numQubits: 2,
              amplitudes: [1, 0, 0, 0],
              members: [{ item: qubits[0], state, qubitIndex: 0 }],
              remoteEntanglementId: "smoke-remote-entanglement",
            };
            mailboxRoomSetRemoteEntanglementVisual(
              qubits[0],
              "smoke-remote-entanglement",
            );
          }
        }
        const snapshots = [];
        for (const qubit of qubits) {
          await runGeneratedSeparatedPairMeasurementTransit(
            canvas,
            qubit,
            runtime,
            0,
          );
          await mailboxRoomRefresh({ render: false });
          snapshots.push({
            label: qubit.dataset.qubitLabel || "",
            roomQubitIndex: qubit.dataset.roomQubitIndex || "",
            pending: runtime.pendingMeasurements.map((entry) => ({
              orderIndex: entry.orderIndex,
              logicalQubitId: entry.logicalQubitId,
              color: entry.color,
            })),
            total: Object.values(runtime.tubeCounts || {}).reduce(
              (sum, count) => sum + Number(count || 0),
              0,
            ),
          });
        }
        return {
          name: mailboxRoomState.displayName,
          snapshots,
          measurements: mailboxRoomState.measurements,
          status:
            document.querySelector(
              "#panel-editor-entanglement-3 .generated-experiment-status",
            )?.textContent || "",
        };
      }, markFirstQubitRemoteEntangled);
    }

    async function measureOneEntanglementThreeQubit(
      page,
      itemId,
      { simulateStaleLocalIdentity = false } = {},
    ) {
      return page.evaluate(
        async ({ qubitItemId, staleIdentity }) => {
          await mailboxRoomRefresh({ render: false });
          const canvas = document.querySelector(
            "#panel-editor-entanglement-3 .generated-layout-canvas",
          );
          const measure = canvas?.querySelector(
            '[data-generated-item-id="entanglement-3-register-measurement"]',
          );
          const qubit = canvas?.querySelector(
            `[data-generated-item-id="${qubitItemId}"]`,
          );
          const runtime = initializeGeneratedSeparatedPairMeasurementItem(measure);
          if (!(qubit instanceof HTMLElement) || !runtime) {
            throw new Error(`Missing Entanglement 3 qubit/runtime for ${qubitItemId}`);
          }
          if (staleIdentity) {
            const localQubits = Array.from(
              canvas.querySelectorAll('[data-component="qubit"]'),
            );
            const localIndex = Math.max(0, localQubits.indexOf(qubit));
            delete qubit.dataset.roomQubitIndex;
            delete qubit.dataset.generatedMeasurementSlotIndex;
            qubit.dataset.qubitId = String(localIndex + 1);
            updateQubitDisplayLabel(qubit, localIndex);
          }
          const completed = await runGeneratedSeparatedPairMeasurementTransit(
            canvas,
            qubit,
            runtime,
            0,
          );
          await mailboxRoomRefresh({ render: false });
          const measurement = mailboxRoomState.measurements[0] || null;
          const countsTotal = Object.values(measurement?.counts || {}).reduce(
            (sum, count) => sum + Number(count || 0),
            0,
          );
          return {
            name: mailboxRoomState.displayName,
            completed,
            itemId: qubitItemId,
            roomQubitIndex: qubit.dataset.roomQubitIndex || "",
            qubitId: qubit.dataset.qubitId || "",
            pendingKeys: Object.keys(measurement?.pending || {}).sort(),
            countsTotal,
            status:
              document.querySelector(
                "#panel-editor-entanglement-3 .generated-experiment-status",
              )?.textContent || "",
          };
        },
        { qubitItemId: itemId, staleIdentity: simulateStaleLocalIdentity },
      );
    }

    const interleaved = [];
    interleaved.push(
      await measureOneEntanglementThreeQubit(bob.page, "entanglement-3-q0"),
    );
    interleaved.push(
      await measureOneEntanglementThreeQubit(alice.page, "entanglement-3-q0", {
        simulateStaleLocalIdentity: true,
      }),
    );
    interleaved.push(
      await measureOneEntanglementThreeQubit(alice.page, "entanglement-3-q1", {
        simulateStaleLocalIdentity: true,
      }),
    );
    interleaved.push(
      await measureOneEntanglementThreeQubit(bob.page, "entanglement-3-q1"),
    );
    const interleavedOk =
      interleaved[0]?.pendingKeys.join(",") === "0" &&
      interleaved[0]?.status.includes("Measured 1/4") &&
      interleaved[1]?.pendingKeys.join(",") === "0,2" &&
      interleaved[1]?.roomQubitIndex === "2" &&
      interleaved[1]?.status.includes("Measured 2/4") &&
      interleaved[2]?.pendingKeys.join(",") === "0,2,3" &&
      interleaved[2]?.roomQubitIndex === "3" &&
      interleaved[2]?.status.includes("Measured 3/4") &&
      interleaved[3]?.countsTotal === 1 &&
      interleaved[3]?.status.includes("Measured 4/4");
    if (!interleavedOk) {
      throw new Error(
        `Entanglement 3 interleaved Bob/Alice measurement count regressed: ${JSON.stringify(interleaved)}`,
      );
    }

    await Promise.all(
      [bob.page, alice.page].map((page) =>
        page.evaluate(() => mailboxRoomRefresh({ render: false })),
      ),
    );
    const shared = await Promise.all(
      [bob.page, alice.page].map((page) =>
        page.evaluate(() => ({
          name: mailboxRoomState.displayName,
          measurements: mailboxRoomState.measurements,
          visibleCounts: Array.from(
            document.querySelectorAll(
              "#panel-editor-entanglement-3 .pair-tube-column",
            ),
          )
            .map((column) => [
              column.dataset.key || "",
              Number(column.querySelector(".tube-count")?.textContent || 0),
            ])
            .filter((entry) => entry[1] > 0),
          status:
            document.querySelector(
              "#panel-editor-entanglement-3 .generated-experiment-status",
            )?.textContent || "",
          experimentActions:
            generatedExperimentStateForCanvas(
              document.querySelector(
                "#panel-editor-entanglement-3 .generated-layout-canvas",
              ),
            )?.experiment?.actions?.length || 0,
          replayDisabled:
            document.querySelector(
              "#panel-editor-entanglement-3 .entanglement-room-review-btn",
            )?.disabled ?? true,
        })),
      ),
    );
    if (
      shared.some(
        (state) =>
          state.measurements.length !== 1 ||
          Object.values(state.measurements[0].counts || {}).reduce(
            (sum, count) => sum + Number(count || 0),
            0,
          ) !== 1 ||
          state.visibleCounts.length !== 1 ||
          state.visibleCounts[0][1] !== 1 ||
          !state.status.includes("Measured 4/4") ||
          state.experimentActions === 0 ||
          state.replayDisabled,
      )
    ) {
      throw new Error(
        `Entanglement 3 room-wide measurement did not sync to both pages: ${JSON.stringify(shared)}`,
      );
    }

    const backendMeasurements = await api(
      backend.baseUrl,
      "/rooms/send-receive-room/measurements",
    );
    const backendRoom = await api(backend.baseUrl, "/rooms/send-receive-room");
    const backendMeasurementActions =
      backendMeasurements.body.measurements?.[0]?.experiment?.actions || [];
    const backendRoomActions =
      backendRoom.body.room?.recordedExperiment?.actions || [];
    const backendRoomActionParticipants = new Set(
      backendRoomActions.map((action) => action?.roomParticipantId).filter(Boolean),
    );
    const backendGateSettingParticipants = new Set(
      backendRoomActions
        .filter((action) => action?.type === "gate-setting")
        .map((action) => `${action.roomParticipantId}:${action.tickIndex}`),
    );
    if (
      backendMeasurements.response.status !== 200 ||
      backendMeasurements.body.measurements.length !== 1 ||
      Object.values(backendMeasurements.body.measurements[0].counts || {}).reduce(
        (sum, count) => sum + Number(count || 0),
        0,
      ) !== 1 ||
      !Array.isArray(backendMeasurementActions) ||
      backendMeasurementActions.length < 4 ||
      backendRoom.response.status !== 200 ||
      !Array.isArray(backendRoomActions) ||
      backendRoomActions.length < 4 ||
      !backendRoomActionParticipants.has("bob") ||
      !backendRoomActionParticipants.has("alice") ||
      !backendGateSettingParticipants.has("bob:3") ||
      !backendGateSettingParticipants.has("alice:3")
    ) {
      throw new Error(
        `Entanglement 3 backend room experiment failed: ${JSON.stringify({
          measurements: backendMeasurements.body,
          room: backendRoom.body,
        })}`,
      );
    }

    async function waitForEntanglementThreeTotal(page, expectedTotal) {
      for (let attempt = 0; attempt < 30; attempt += 1) {
        const totals = await page.evaluate(async () => {
          await mailboxRoomRefresh({ render: false });
          return {
            total: Object.values(
              mailboxRoomState.measurements[0]?.counts || {},
            ).reduce((sum, count) => sum + Number(count || 0), 0),
            visibleTotal: Array.from(
              document.querySelectorAll(
                "#panel-editor-entanglement-3 .pair-tube-column .tube-count",
              ),
            ).reduce((sum, count) => sum + Number(count.textContent || 0), 0),
          };
        });
        if (
          totals.total === expectedTotal &&
          totals.visibleTotal === expectedTotal
        ) {
          return totals;
        }
        await wait(500);
      }
      return page.evaluate(() => ({
        total: Object.values(
          mailboxRoomState.measurements[0]?.counts || {},
        ).reduce((sum, count) => sum + Number(count || 0), 0),
        visibleTotal: Array.from(
          document.querySelectorAll(
            "#panel-editor-entanglement-3 .pair-tube-column .tube-count",
          ),
        ).reduce((sum, count) => sum + Number(count.textContent || 0), 0),
      }));
    }

    const magnifierReplayStarted = await bob.page.evaluate(() => {
      const canvas = document.querySelector(
        "#panel-editor-entanglement-3 .generated-layout-canvas",
      );
      const measure = canvas?.querySelector(
        '[data-generated-item-id="entanglement-3-register-measurement"]',
      );
      const runtime = initializeGeneratedSeparatedPairMeasurementItem(measure);
      if (!runtime?.measurementCount || !runtime.magnifiers?.[0]?.measurementTool) {
        return { clicked: false, reason: "missing runtime" };
      }
      setMeasurementSelectValue(runtime.measurementCount, 5);
      runtime.magnifiers[0].measurementTool.click();
      return {
        clicked: true,
        experimentActions:
          generatedExperimentStateForCanvas(canvas)?.experiment?.actions?.length ||
          0,
      };
    });
    if (
      !magnifierReplayStarted.clicked ||
      magnifierReplayStarted.experimentActions === 0
    ) {
      throw new Error(
        `Entanglement 3 magnifier replay did not start: ${JSON.stringify(magnifierReplayStarted)}`,
      );
    }
    const replayedShared = await Promise.all(
      [bob.page, alice.page].map((page) =>
        waitForEntanglementThreeTotal(page, 6),
      ),
    );
    if (
      replayedShared.some(
        (state) => state.total !== 6 || state.visibleTotal !== 6,
      )
    ) {
      throw new Error(
        `Entanglement 3 recorded experiment replay did not add a room-wide count: ${JSON.stringify(replayedShared)}`,
      );
    }

    const batchCountStarted = await bob.page.evaluate(() => {
      const canvas = document.querySelector(
        "#panel-editor-entanglement-3 .generated-layout-canvas",
      );
      const measure = canvas?.querySelector(
        '[data-generated-item-id="entanglement-3-register-measurement"]',
      );
      const runtime = initializeGeneratedSeparatedPairMeasurementItem(measure);
      if (!runtime?.measurementCount || !runtime.magnifiers?.[0]?.measurementTool) {
        return false;
      }
      const state = generatedExperimentStateForCanvas(canvas);
      if (state) {
        state.experiment = null;
        state.actions = [];
        state.recording = false;
        state.playing = false;
      }
      setMeasurementSelectValue(runtime.measurementCount, 10000);
      runtime.measurementCount.dispatchEvent(new Event("change", { bubbles: true }));
      return true;
    });
    if (!batchCountStarted) {
      throw new Error("Entanglement 3 batch count replay did not start");
    }
    const batchTotals = await Promise.all(
      [bob.page, alice.page].map((page) =>
        waitForEntanglementThreeTotal(page, 10000),
      ),
    );
    if (
      batchTotals.some(
        (totals) => totals.total !== 10000 || totals.visibleTotal !== 10000,
      )
    ) {
      throw new Error(
        `Entanglement 3 batch replay did not add shared counts: ${JSON.stringify(batchTotals)}`,
      );
    }
    const batchSpread = await bob.page.evaluate(() => {
      const counts = mailboxRoomState.measurements[0]?.counts || {};
      const nonZero = Object.entries(counts).filter(
        (entry) => Number(entry[1]) > 0,
      );
      return {
        counts,
        nonZeroCount: nonZero.length,
        maxCount: Math.max(0, ...nonZero.map((entry) => Number(entry[1]))),
      };
    });
    if (batchSpread.nonZeroCount < 12 || batchSpread.maxCount > 1300) {
      throw new Error(
        `Entanglement 3 batch replay repeated one result instead of sampling: ${JSON.stringify(batchSpread)}`,
      );
    }
    const staleApplyResult = await bob.page.evaluate(() => {
      const measurement = mailboxRoomState.measurements[0] || null;
      if (!measurement) {
        return { applied: false, reason: "missing measurement" };
      }
      const staleMeasurement = {
        ...measurement,
        counts: {},
        pending: {},
        control: {
          ...(measurement.control || {}),
          status: "active",
          completedAt: null,
        },
        version: Math.max(0, Number(measurement.version) || 0) - 1,
      };
      const applied = mailboxRoomApplyRoomMeasurement(staleMeasurement);
      const visibleTotal = Array.from(
        document.querySelectorAll(
          "#panel-editor-entanglement-3 .pair-tube-column .tube-count",
        ),
      ).reduce((sum, count) => sum + Number(count.textContent || 0), 0);
      return { applied, visibleTotal };
    });
    if (staleApplyResult.applied || staleApplyResult.visibleTotal !== 10000) {
      throw new Error(
        `Entanglement 3 accepted stale empty measurement snapshot: ${JSON.stringify(staleApplyResult)}`,
      );
    }
    const sharedMetadataApplyResult = await bob.page.evaluate(() => {
      const canvas = document.querySelector(
        "#panel-editor-entanglement-3 .generated-layout-canvas",
      );
      const qubits = Array.from(
        canvas?.querySelectorAll('[data-component="qubit"]') || [],
      );
      const sharedId = "smoke-four-way-shared-register";
      qubits.forEach((qubit, index) => {
        const state = ensureGeneratedQubitRuntimeState(qubit);
        if (!state) {
          return;
        }
        state.pairQubitIndex = index;
        state.pairState = {
          numQubits: 4,
          amplitudes: [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          members: qubits.map((item, qubitIndex) => ({
            item,
            state: ensureGeneratedQubitRuntimeState(item),
            qubitIndex,
          })),
          remoteEntanglementId: sharedId,
        };
        mailboxRoomSetRemoteEntanglementVisual(qubit, sharedId);
      });
      const sharedEntanglement = {
        id: sharedId,
        numQubits: 4,
        amplitudes: [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        metadata: {
          measurement: {
            numQubits: 4,
            counts: {},
            pending: {},
            pendingQueues: {},
            control: {
              id: "stale-shared-control",
              type: "experiment-count",
              iterations: 10000,
              requestedBy: "alice",
              startAt: Date.now(),
            },
          },
        },
      };
      const countsApplied = applySharedRegisterMeasurementCounts(sharedEntanglement);
      const controlStarted = maybeRunSharedMeasurementControl(sharedEntanglement);
      const visibleTotal = Array.from(
        document.querySelectorAll(
          "#panel-editor-entanglement-3 .pair-tube-column .tube-count",
        ),
      ).reduce((sum, count) => sum + Number(count.textContent || 0), 0);
      return { countsApplied, controlStarted, visibleTotal };
    });
    if (
      sharedMetadataApplyResult.countsApplied ||
      sharedMetadataApplyResult.controlStarted ||
      sharedMetadataApplyResult.visibleTotal !== 10000
    ) {
      throw new Error(
        `Entanglement 3 shared metadata cleared room counts: ${JSON.stringify(sharedMetadataApplyResult)}`,
      );
    }

    const batchMagnifierStarted = await bob.page.evaluate(() => {
      const canvas = document.querySelector(
        "#panel-editor-entanglement-3 .generated-layout-canvas",
      );
      const measure = canvas?.querySelector(
        '[data-generated-item-id="entanglement-3-register-measurement"]',
      );
      const runtime = initializeGeneratedSeparatedPairMeasurementItem(measure);
      if (!runtime?.measurementCount || !runtime.magnifiers?.[0]?.measurementTool) {
        return false;
      }
      setMeasurementSelectValue(runtime.measurementCount, 100);
      runtime.magnifiers[0].measurementTool.click();
      return true;
    });
    if (!batchMagnifierStarted) {
      throw new Error("Entanglement 3 batch magnifier replay did not start");
    }
    const batchRepeatTotals = await Promise.all(
      [bob.page, alice.page].map((page) =>
        waitForEntanglementThreeTotal(page, 10100),
      ),
    );
    if (
      batchRepeatTotals.some(
        (totals) => totals.total !== 10100 || totals.visibleTotal !== 10100,
      )
    ) {
      throw new Error(
        `Entanglement 3 batch magnifier replay did not add shared counts: ${JSON.stringify(batchRepeatTotals)}`,
      );
    }

    const replay = await bob.page.evaluate(async () => {
      const ok = await replayMailboxRoomReviewActions();
      return {
        ok,
        reviewRuns: mailboxRoomState.reviewRuns,
        reviewCounts: mailboxRoomState.reviewCounts,
        countsText: mailboxRoomReviewCountsText(),
      };
    });
    const run = await bob.page.evaluate(() => {
      const ok = runMailboxRoomReviewBatch();
      return {
        ok,
        reviewRuns: mailboxRoomState.reviewRuns,
        reviewCounts: mailboxRoomState.reviewCounts,
        countsText: mailboxRoomReviewCountsText(),
      };
    });
    const reviewTotal = Object.values(run.reviewCounts || {}).reduce(
      (sum, count) => sum + Number(count || 0),
      0,
    );
    const reviewNonZero = Object.values(run.reviewCounts || {}).filter(
      (count) => Number(count) > 0,
    ).length;
    if (
      !replay.ok ||
      replay.reviewRuns !== 1 ||
      !run.ok ||
      run.reviewRuns !== 10001 ||
      reviewTotal !== 10001 ||
      reviewNonZero < 12
    ) {
      throw new Error(
        `Entanglement 3 replay/run review flow failed: ${JSON.stringify({ replay, run })}`,
      );
    }
  } finally {
    await sharedContext.close();
    await closeServer(backend.server);
  }
}

async function openMailboxDeliverySmokePage(
  browser,
  baseUrl,
  backendUrl,
  roomId,
  displayName = "",
  expectedDefaultName = "",
) {
  const context = await browser.newContext({
    viewport: { width: 1200, height: 820 },
  });
  const page = await context.newPage();
  await installContentApiHelpers(page);
  await page.goto(
    `${baseUrl}/index.html?backend=${encodeURIComponent(backendUrl)}`,
    { waitUntil: "domcontentloaded" },
  );
  await page.evaluate(() => {
    window.applyGeneratedTabsState({
      tabs: [
        {
          id: "mailbox-delivery-smoke",
          label: "Mailbox Delivery Smoke",
          layout: {
            items: [
              {
                id: "mailbox-smoke-qubit",
                type: "qubit",
                left: 90,
                top: 210,
                width: 72,
                height: 72,
                z: 2,
                vector: [1, 0],
              },
              {
                id: "mailbox-smoke-qubit-b",
                type: "qubit",
                left: 90,
                top: 340,
                width: 72,
                height: 72,
                z: 2,
                vector: [1, 0],
              },
              {
                id: "mailbox-smoke-mailbox",
                type: "mailbox",
                left: 410,
                top: 125,
                width: 373,
                height: 240,
                z: 12,
              },
            ],
            canvasWidth: 1100,
            canvasHeight: 620,
          },
        },
      ],
    });
  });
  await page.evaluate(() => {
    document.querySelector("#tab-mailbox-delivery-smoke")?.click();
  });
  await page.waitForFunction(
    () => !document.querySelector("#panel-mailbox-delivery-smoke")?.hidden,
  );
  await page.evaluate(
    ({ roomId, displayName }) =>
      mailboxRoomJoin({
        roomId,
        displayName,
        allowAutoName: true,
      }),
    { roomId, displayName },
  );
  if (
    expectedDefaultName &&
    (await page.evaluate(() => mailboxRoomState.displayName)) !==
      expectedDefaultName
  ) {
    throw new Error(`Expected mailbox participant ${expectedDefaultName}`);
  }
  return { context, page };
}

async function runMailboxRoomDeliverySmoke(browser, baseUrl) {
  const backend = await startBackendServer();
  const roomId = `mailbox-smoke-${Date.now()}`;
  let alice = null;
  let bob = null;
  try {
    bob = await openMailboxDeliverySmokePage(
      browser,
      baseUrl,
      backend.baseUrl,
      roomId,
      "",
      "Bob",
    );
    alice = await openMailboxDeliverySmokePage(
      browser,
      baseUrl,
      backend.baseUrl,
      roomId,
      "",
      "Alice",
    );

    const joinedDefaults = await Promise.all([
      bob.page.evaluate(() => {
        const qubits = Array.from(
          document.querySelectorAll(
            '#panel-mailbox-delivery-smoke [data-component="qubit"]',
          ),
        ).map((qubit) => ({
          itemId: qubit.dataset.generatedItemId || "",
          roomQubitIndex: qubit.dataset.roomQubitIndex || "",
          qubitId: qubit.dataset.qubitId || "",
          label: qubit.dataset.qubitLabel || "",
          coreLabel:
            qubit.querySelector(".playground-qubit-core")?.dataset.qubitLabel ||
            "",
        }));
        return {
          name: mailboxRoomState.displayName,
          qubits,
        };
      }),
      alice.page.evaluate(() => {
        const qubits = Array.from(
          document.querySelectorAll(
            '#panel-mailbox-delivery-smoke [data-component="qubit"]',
          ),
        ).map((qubit) => ({
          itemId: qubit.dataset.generatedItemId || "",
          roomQubitIndex: qubit.dataset.roomQubitIndex || "",
          qubitId: qubit.dataset.qubitId || "",
          label: qubit.dataset.qubitLabel || "",
          coreLabel:
            qubit.querySelector(".playground-qubit-core")?.dataset.qubitLabel ||
            "",
        }));
        return {
          name: mailboxRoomState.displayName,
          qubits,
        };
      }),
    ]);
    const bobQubits = joinedDefaults[0].qubits;
    const aliceQubits = joinedDefaults[1].qubits;
    if (
      joinedDefaults[0].name !== "Bob" ||
      bobQubits.length !== 2 ||
      bobQubits[0].roomQubitIndex !== "0" ||
      bobQubits[0].qubitId !== "1" ||
      bobQubits[0].label !== "q0" ||
      bobQubits[0].coreLabel !== "q0" ||
      bobQubits[1].roomQubitIndex !== "1" ||
      bobQubits[1].qubitId !== "2" ||
      bobQubits[1].label !== "q1" ||
      bobQubits[1].coreLabel !== "q1" ||
      joinedDefaults[1].name !== "Alice" ||
      aliceQubits.length !== 2 ||
      aliceQubits[0].roomQubitIndex !== "2" ||
      aliceQubits[0].qubitId !== "3" ||
      aliceQubits[0].label !== "q2" ||
      aliceQubits[0].coreLabel !== "q2" ||
      aliceQubits[1].roomQubitIndex !== "3" ||
      aliceQubits[1].qubitId !== "4" ||
      aliceQubits[1].label !== "q3" ||
      aliceQubits[1].coreLabel !== "q3"
    ) {
      throw new Error(
        `Mailbox room defaults did not namespace participants correctly: ${JSON.stringify(joinedDefaults)}`,
      );
    }

    const fourQubitMeasurement = await bob.page.evaluate(async () => {
      const canvas = document.createElement("div");
      canvas.className = "generated-layout-canvas";
      canvas.dataset.generatedTabId = "four-qubit-measurement-smoke";
      Object.assign(canvas.style, {
        position: "relative",
        width: "1280px",
        height: "760px",
      });
      const measure = createGeneratedLayoutItemNode(
        savedGroupComponentType(REGISTER_FOUR_QUBIT_MEASUREMENT_GROUP_ID),
        {
          id: "four-qubit-measure",
          left: 300,
          top: 30,
          width: 940,
          height: 438,
          measurementRegisterQubitCount: 4,
        },
      );
      const qubits = Array.from({ length: 4 }, (_item, index) =>
        createGeneratedLayoutItemNode("qubit", {
          id: `four-measure-q${index}`,
          left: 60,
          top: 74 + index * 118,
          width: 58,
          height: 58,
          roomQubitIndex: index,
          qubitId: index + 1,
          vector: [Math.SQRT1_2, Math.SQRT1_2],
        }),
      );
      canvas.append(measure, ...qubits);
      document.body.appendChild(canvas);
      prepareGeneratedLayoutCanvas(canvas);
      const runtime = initializeGeneratedSeparatedPairMeasurementItem(measure);
      if (!runtime || runtime.registerQubitCount !== 4) {
        canvas.remove();
        pruneGeneratedRuntimeState();
        return {
          ok: false,
          reason: "runtime",
          registerQubitCount: runtime?.registerQubitCount || null,
          outcomeKeys: runtime?.outcomeKeys || null,
        };
      }

      const states = qubits.map((qubit) => ensureGeneratedQubitRuntimeState(qubit));
      const registerState = {
        numQubits: 4,
        amplitudes: Array.from({ length: 16 }, (_item, index) =>
          index === 0 || index === 15 ? Math.SQRT1_2 : 0,
        ),
        displayMode: "conditional",
        members: qubits.map((item, index) => ({
          item,
          state: states[index],
          qubitIndex: index,
        })),
      };
      registerState.members.forEach((member) =>
        assignRuntimeStateToRegisterMember(member, registerState, member.qubitIndex),
      );
      syncGeneratedPairStateVisuals(registerState);

      const snapshots = [];
      const countTotal = () => {
        const current =
          generatedSeparatedPairMeasurementRuntimes.get(measure) ||
          initializeGeneratedSeparatedPairMeasurementItem(measure);
        return {
          registerQubitCount: current?.registerQubitCount || null,
          pending: current?.pendingMeasurements?.length || 0,
          total: Object.values(current?.tubeCounts || {}).reduce(
            (sum, count) => sum + Number(count || 0),
            0,
          ),
          counts: { ...(current?.tubeCounts || {}) },
        };
      };

      for (let index = 0; index < qubits.length; index += 1) {
        const completed = await runGeneratedSeparatedPairMeasurementTransit(
          canvas,
          qubits[index],
          runtime,
          0,
        );
        snapshots.push({ index, completed, ...countTotal() });
      }
      canvas.remove();
      return {
        ok:
          snapshots.length === 4 &&
          snapshots.slice(0, 3).every((entry, index) =>
            entry.completed &&
            entry.index === index &&
            entry.total === 0 &&
            entry.pending === index + 1,
          ) &&
          snapshots[3].completed &&
          snapshots[3].pending === 0 &&
          snapshots[3].total === 1,
        snapshots,
      };
    });
    if (!fourQubitMeasurement.ok) {
      throw new Error(
        `Four-qubit measurement tubes did not wait for all four qubits and count once: ${JSON.stringify(fourQubitMeasurement)}`,
      );
    }

    const independentFourQubitMeasurement = await bob.page.evaluate(async () => {
      const runScenario = async (scenarioId, configureQubits) => {
        const canvas = document.createElement("div");
        canvas.className = "generated-layout-canvas";
        canvas.dataset.generatedTabId = scenarioId;
        Object.assign(canvas.style, {
          position: "relative",
          width: "1280px",
          height: "760px",
        });
        const measure = createGeneratedLayoutItemNode(
          savedGroupComponentType(REGISTER_FOUR_QUBIT_MEASUREMENT_GROUP_ID),
          {
            id: `${scenarioId}-measure`,
            left: 300,
            top: 30,
            width: 940,
            height: 438,
            measurementRegisterQubitCount: 4,
          },
        );
        const qubits = Array.from({ length: 4 }, (_item, index) =>
          createGeneratedLayoutItemNode("qubit", {
            id: `${scenarioId}-q${index}`,
            left: 60,
            top: 74 + index * 118,
            width: 58,
            height: 58,
            roomQubitIndex: index,
            qubitId: index + 1,
            vector: [Math.SQRT1_2, Math.SQRT1_2],
          }),
        );
        canvas.append(measure, ...qubits);
        document.body.appendChild(canvas);
        prepareGeneratedLayoutCanvas(canvas);
        const runtime = initializeGeneratedSeparatedPairMeasurementItem(measure);
        await configureQubits(qubits);

        const countTotal = () => {
          const current =
            generatedSeparatedPairMeasurementRuntimes.get(measure) ||
            initializeGeneratedSeparatedPairMeasurementItem(measure);
          return {
            registerQubitCount: current?.registerQubitCount || null,
            pending: current?.pendingMeasurements?.length || 0,
            total: Object.values(current?.tubeCounts || {}).reduce(
              (sum, count) => sum + Number(count || 0),
              0,
            ),
            counts: { ...(current?.tubeCounts || {}) },
          };
        };

        const snapshots = [];
        for (let index = 0; index < qubits.length; index += 1) {
          const completed = await runGeneratedSeparatedPairMeasurementTransit(
            canvas,
            qubits[index],
            runtime,
            0,
          );
          snapshots.push({ index, completed, ...countTotal() });
        }
        canvas.remove();
        return {
          ok:
            runtime?.registerQubitCount === 4 &&
            snapshots.length === 4 &&
            snapshots.slice(0, 3).every((entry, index) =>
              entry.completed &&
              entry.index === index &&
              entry.total === 0 &&
              entry.pending === index + 1,
            ) &&
            snapshots[3].completed &&
            snapshots[3].pending === 0 &&
            snapshots[3].total === 1,
          snapshots,
        };
      };

      const independent = await runScenario(
        "four-independent-measurement-smoke",
        async (qubits) => {
          qubits.forEach((qubit) => {
            const state = ensureGeneratedQubitRuntimeState(qubit);
            state.pairState = null;
            state.pairQubitIndex = null;
          });
        },
      );
      const mixed = await runScenario(
        "three-entangled-plus-independent-measurement-smoke",
        async (qubits) => {
          const states = qubits.map((qubit) => ensureGeneratedQubitRuntimeState(qubit));
          const registerState = {
            numQubits: 3,
            amplitudes: Array.from({ length: 8 }, (_item, index) =>
              index === 0 || index === 7 ? Math.SQRT1_2 : 0,
            ),
            displayMode: "conditional",
            members: qubits.slice(0, 3).map((item, index) => ({
              item,
              state: states[index],
              qubitIndex: index,
            })),
          };
          registerState.members.forEach((member) =>
            assignRuntimeStateToRegisterMember(
              member,
              registerState,
              member.qubitIndex,
            ),
          );
          states[3].pairState = null;
          states[3].pairQubitIndex = null;
          syncGeneratedPairStateVisuals(registerState);
        },
      );
      const legacyIds = await runScenario(
        "four-legacy-id-measurement-smoke",
        async (qubits) => {
          qubits.forEach((qubit, index) => {
            delete qubit.dataset.roomQubitIndex;
            qubit.dataset.qubitId = String(145000 + index * 7);
            delete qubit.dataset.generatedMeasurementSlotIndex;
            updateQubitDisplayLabel(qubit, index);
            const state = ensureGeneratedQubitRuntimeState(qubit);
            state.pairState = null;
            state.pairQubitIndex = null;
          });
        },
      );
      const docRecordingIndependent = await runScenario(
        "four-doc-recording-independent-measurement-smoke",
        async (qubits) => {
          const canvas = qubits[0]?.closest(".generated-layout-canvas");
          if (canvas instanceof HTMLElement) {
            canvas.classList.add("doc-editor-canvas");
            canvas.dataset.docEditorCanvas = "true";
            beginGeneratedExperimentRecording(canvas);
          }
          qubits.forEach((qubit, index) => {
            delete qubit.dataset.roomQubitIndex;
            qubit.dataset.qubitId = String(180000 + index * 11);
            delete qubit.dataset.generatedMeasurementSlotIndex;
            updateQubitDisplayLabel(qubit, index);
            const state = ensureGeneratedQubitRuntimeState(qubit);
            state.pairState = null;
            state.pairQubitIndex = null;
          });
        },
      );
      const lostConfiguredCount = await runScenario(
        "four-lost-configured-count-measurement-smoke",
        async (qubits) => {
          const canvas = qubits[0]?.closest(".generated-layout-canvas");
          const measure = canvas?.querySelector(
            '[data-generated-item-id="four-lost-configured-count-measurement-smoke-measure"]',
          );
          const runtime =
            measure instanceof HTMLElement
              ? generatedSeparatedPairMeasurementRuntimes.get(measure)
              : null;
          if (measure instanceof HTMLElement) {
            delete measure.dataset.measurementRegisterQubitCount;
          }
          if (runtime) {
            runtime.configuredRegisterQubitCount = 0;
            runtime.registerQubitCount = 4;
          }
          qubits.forEach((qubit, index) => {
            delete qubit.dataset.roomQubitIndex;
            qubit.dataset.qubitId = String(210000 + index * 13);
            delete qubit.dataset.generatedMeasurementSlotIndex;
            updateQubitDisplayLabel(qubit, index);
            const state = ensureGeneratedQubitRuntimeState(qubit);
            state.pairState = null;
            state.pairQubitIndex = null;
          });
        },
      );
      const duplicateSlots = await runScenario(
        "four-duplicate-slot-measurement-smoke",
        async (qubits) => {
          qubits.forEach((qubit, index) => {
            delete qubit.dataset.roomQubitIndex;
            qubit.dataset.qubitId = String(240000 + index * 17);
            qubit.dataset.generatedMeasurementSlotIndex = "0";
            updateQubitDisplayLabel(qubit, index);
            const state = ensureGeneratedQubitRuntimeState(qubit);
            state.pairState = null;
            state.pairQubitIndex = null;
          });
        },
      );
      return {
        independent,
        mixed,
        legacyIds,
        docRecordingIndependent,
        lostConfiguredCount,
        duplicateSlots,
      };
    });
    if (
      !independentFourQubitMeasurement.independent.ok ||
      !independentFourQubitMeasurement.mixed.ok ||
      !independentFourQubitMeasurement.legacyIds.ok ||
      !independentFourQubitMeasurement.docRecordingIndependent.ok ||
      !independentFourQubitMeasurement.lostConfiguredCount.ok ||
      !independentFourQubitMeasurement.duplicateSlots.ok
    ) {
      throw new Error(
        `Four-qubit measurement tubes did not count independent or mixed qubits correctly: ${JSON.stringify(independentFourQubitMeasurement)}`,
      );
    }

    await bob.page.evaluate(() => {
      const canvas = document.querySelector(
        "#panel-mailbox-delivery-smoke .generated-layout-canvas",
      );
      const retained = canvas?.querySelector(
        '[data-generated-item-id="mailbox-smoke-qubit"]',
      );
      const sent = canvas?.querySelector(
        '[data-generated-item-id="mailbox-smoke-qubit-b"]',
      );
      if (
        !(canvas instanceof HTMLElement) ||
        !(retained instanceof HTMLElement) ||
        !(sent instanceof HTMLElement)
      ) {
        throw new Error("Missing entanglement smoke canvas or retained qubit");
      }
      prepareGeneratedLayoutCanvas(canvas);
      const pairState = createGeneratedPairState(retained, sent);
      pairState.amplitudes = [Math.SQRT1_2, 0, 0, Math.SQRT1_2];
      pairState.displayMode = "linked";
      pairState.linkRelation = "correlated";
      syncGeneratedPairStateVisuals(pairState);
    });

    const bobQubit = bob.page.locator(
      '#panel-mailbox-delivery-smoke [data-generated-item-id="mailbox-smoke-qubit-b"]',
    );
    const bobMailboxFunnel = bob.page.locator(
      '#panel-mailbox-delivery-smoke [data-component="mailbox"] [data-role="mailbox-input-funnel"]',
    );
    await bob.page.evaluate(() => {
      window.__mailboxSendTrace = [];
      const capture = () => {
        const panel = document.querySelector("#panel-mailbox-delivery-smoke");
        const qubit = panel?.querySelector(
          '[data-generated-item-id="mailbox-smoke-qubit-b"]',
        );
        const funnel = panel?.querySelector('[data-role="mailbox-input-funnel"]');
        const mailboxWindow = panel?.querySelector('[data-role="mailbox-window"]');
        if (qubit instanceof HTMLElement) {
          const center = (element) => {
            const rect = element.getBoundingClientRect();
            return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
          };
          const qubitCenter = center(qubit);
          const distance = (element) => {
            const target = center(element);
            return Math.hypot(qubitCenter.x - target.x, qubitCenter.y - target.y);
          };
          window.__mailboxSendTrace.push({
            sending: qubit.classList.contains("mailbox-sending"),
            fading: qubit.classList.contains("mailbox-sending-fade"),
            funnelDistance: distance(funnel),
            windowDistance: distance(mailboxWindow),
          });
          window.requestAnimationFrame(capture);
        }
      };
      window.requestAnimationFrame(capture);
    });
    const [qubitCenter, mailboxCenter] = await Promise.all([
      rectCenter(bobQubit),
      rectCenter(bobMailboxFunnel),
    ]);
    await bob.page.mouse.move(qubitCenter.x, qubitCenter.y);
    await bob.page.mouse.down();
    await bob.page.mouse.move(mailboxCenter.x, mailboxCenter.y, { steps: 12 });
    await bob.page.mouse.up();
    await bob.page.waitForFunction(
      () =>
        document.querySelectorAll(
          '#panel-mailbox-delivery-smoke [data-component="qubit"]',
        ).length === 1,
      null,
      { timeout: 6000 },
    );
    const sendTrace = await bob.page.evaluate(() => window.__mailboxSendTrace || []);
    const sendingTrace = sendTrace.filter((sample) => sample.sending);
    const beganAtFunnel = sendingTrace.some(
      (sample) => sample.funnelDistance < sample.windowDistance,
    );
    const reachedWindowBeforeFade = sendingTrace.some(
      (sample) => !sample.fading && sample.windowDistance < 8,
    );
    const fadedAtWindow = sendingTrace.some(
      (sample) => sample.fading && sample.windowDistance < 8,
    );
    if (!beganAtFunnel || !reachedWindowBeforeFade || !fadedAtWindow) {
      throw new Error(
        `Mailbox qubit did not animate funnel to window before fading: ${JSON.stringify({ beganAtFunnel, reachedWindowBeforeFade, fadedAtWindow, sendingTrace })}`,
      );
    }

    await alice.page.waitForFunction(
      () =>
        document.querySelectorAll(
          '#panel-mailbox-delivery-smoke [data-component="qubit"]',
        ).length === 3,
      null,
      { timeout: 8000 },
    );
    await wait(950);

    const delivery = await alice.page.evaluate(() => {
      const panel = document.querySelector("#panel-mailbox-delivery-smoke");
      const received = panel?.querySelector(
        '[data-component="qubit"][data-mailbox-received-event-id]',
      );
      const mailbox = panel?.querySelector('[data-component="mailbox"]');
      const receivedRect = received?.getBoundingClientRect();
      const mailboxRect = mailbox?.getBoundingClientRect();
      const overlapWidth =
        receivedRect && mailboxRect
          ? Math.max(
              0,
              Math.min(receivedRect.right, mailboxRect.right) -
                Math.max(receivedRect.left, mailboxRect.left),
            )
          : Infinity;
      const overlapHeight =
        receivedRect && mailboxRect
          ? Math.max(
              0,
              Math.min(receivedRect.bottom, mailboxRect.bottom) -
                Math.max(receivedRect.top, mailboxRect.top),
            )
          : Infinity;
      return {
        received: Boolean(received),
        receivedFrom: received?.dataset.mailboxReceivedFrom || "",
        vector: JSON.parse(received?.dataset.initialVector || "null"),
        receivedZ: Number(received?.style.zIndex || 0),
        mailboxZ: Number(mailbox?.style.zIndex || 0),
        overlapArea: overlapWidth * overlapHeight,
        status:
          mailbox?.querySelector('[data-role="mailbox-status"]')?.textContent ||
          "",
      };
    });
    if (
      !delivery.received ||
      delivery.receivedFrom !== "Bob" ||
      !Array.isArray(delivery.vector) ||
      Math.abs(delivery.vector[0] - Math.SQRT1_2) > 1e-9 ||
      Math.abs(delivery.vector[1] - Math.SQRT1_2) > 1e-9 ||
      delivery.receivedZ <= delivery.mailboxZ ||
      delivery.overlapArea !== 0 ||
      !delivery.status.includes("Received q1 from Bob")
    ) {
      throw new Error(
        `Mailbox delivery did not materialize a visible qubit: ${JSON.stringify(delivery)}`,
      );
    }

    await wait(3000);
    const duplicateCount = await alice.page
      .locator('#panel-mailbox-delivery-smoke [data-component="qubit"]')
      .count();
    if (duplicateCount !== 3) {
      throw new Error(
        `Mailbox delivery was imported more than once: qubits=${duplicateCount}`,
      );
    }

    const remotePair = await Promise.all([
      alice.page.evaluate(() => {
        const item = document.querySelector(
          '#panel-mailbox-delivery-smoke [data-mailbox-received-event-id]',
        );
        const state = generatedQubitRuntimes.get(item);
        return {
          id: item?.dataset.remoteEntanglementId || "",
          index: state?.pairQubitIndex,
          amplitudes: state?.pairState?.amplitudes || null,
        };
      }),
      bob.page.evaluate(() => {
        const item = document.querySelector(
          '#panel-mailbox-delivery-smoke [data-generated-item-id="mailbox-smoke-qubit"]',
        );
        const state = generatedQubitRuntimes.get(item);
        return {
          id: item?.dataset.remoteEntanglementId || "",
          index: state?.pairQubitIndex,
          amplitudes: state?.pairState?.amplitudes || null,
        };
      }),
    ]);
    const [alicePair, bobPair] = remotePair;
    if (
      !alicePair.id ||
      alicePair.id !== bobPair.id ||
      alicePair.index !== 1 ||
      bobPair.index !== 0 ||
      Math.abs(alicePair.amplitudes?.[0] - Math.SQRT1_2) > 1e-9 ||
      Math.abs(bobPair.amplitudes?.[3] - Math.SQRT1_2) > 1e-9
    ) {
      throw new Error(
        `Mailbox qubits did not share entanglement: ${JSON.stringify(remotePair)}`,
      );
    }

    const sharedPairMeasurementDoesNotResizeRegisterTools =
      await alice.page.evaluate((sharedId) => {
        const panel = document.querySelector("#panel-mailbox-delivery-smoke");
        const canvas = panel?.querySelector(".generated-layout-canvas");
        const received = panel?.querySelector("[data-mailbox-received-event-id]");
        if (
          !(canvas instanceof HTMLElement) ||
          !(received instanceof HTMLElement)
        ) {
          return { ok: false, reason: "missing received qubit" };
        }
        ensureGeneratedQubitRuntimeState(received);
        const createRegisterMeasurement = (count, top) => {
          const groupId =
            count === 4
              ? REGISTER_FOUR_QUBIT_MEASUREMENT_GROUP_ID
              : REGISTER_THREE_QUBIT_MEASUREMENT_GROUP_ID;
          const item = createGeneratedLayoutItemNode(
            savedGroupComponentType(groupId),
            {
              id: `shared-pair-no-resize-${count}`,
              left: 360,
              top,
              width: count === 4 ? 940 : 820,
              height: 438,
              z: 80 + count,
              measurementRegisterQubitCount: count,
            },
          );
          canvas.append(item);
          return item;
        };
        const three = createRegisterMeasurement(3, 20);
        const four = createRegisterMeasurement(4, 500);
        const runtimeThree =
          initializeGeneratedSeparatedPairMeasurementItem(three);
        const runtimeFour = initializeGeneratedSeparatedPairMeasurementItem(four);
        const before = {
          three: runtimeThree?.registerQubitCount || null,
          four: runtimeFour?.registerQubitCount || null,
        };
        const applied = applySharedRegisterMeasurementCounts({
          id: sharedId,
          numQubits: 2,
          amplitudes: [Math.SQRT1_2, 0, 0, Math.SQRT1_2],
          metadata: {
            measurement: {
              numQubits: 2,
              counts: { bb: 1 },
              pending: {},
              pendingQueues: {},
            },
          },
        });
        const afterThree =
          generatedSeparatedPairMeasurementRuntimes.get(three) ||
          initializeGeneratedSeparatedPairMeasurementItem(three);
        const afterFour =
          generatedSeparatedPairMeasurementRuntimes.get(four) ||
          initializeGeneratedSeparatedPairMeasurementItem(four);
        const after = {
          three: afterThree?.registerQubitCount || null,
          four: afterFour?.registerQubitCount || null,
          threeDataset: three.dataset.measurementRegisterQubitCount || "",
          fourDataset: four.dataset.measurementRegisterQubitCount || "",
        };
        generatedSeparatedPairMeasurementRuntimes.delete(three);
        generatedSeparatedPairMeasurementRuntimes.delete(four);
        three.remove();
        four.remove();
        return {
          ok:
            before.three === 3 &&
            before.four === 4 &&
            after.three === 3 &&
            after.four === 4 &&
            after.threeDataset === "3" &&
            after.fourDataset === "4",
          applied,
          before,
          after,
        };
      }, alicePair.id);
    if (!sharedPairMeasurementDoesNotResizeRegisterTools.ok) {
      throw new Error(
        `Shared pair measurement resized a larger register tool: ${JSON.stringify(sharedPairMeasurementDoesNotResizeRegisterTools)}`,
      );
    }

    const aliceBottomExistingOrientation = await alice.page.evaluate(async () => {
      const panel = document.querySelector("#panel-mailbox-delivery-smoke");
      const canvas = panel?.querySelector(".generated-layout-canvas");
      if (!(canvas instanceof HTMLElement)) {
        return null;
      }
      const retained = createGeneratedLayoutItemNode("qubit", {
        left: 30,
        top: 30,
        width: 40,
        height: 40,
        z: 30,
        vector: [1, 0],
        id: "orientation-retained",
      });
      const received = createGeneratedLayoutItemNode("qubit", {
        left: 80,
        top: 30,
        width: 40,
        height: 40,
        z: 31,
        vector: [1, 0],
        id: "orientation-received",
      });
      const local = createGeneratedLayoutItemNode("qubit", {
        left: 130,
        top: 30,
        width: 40,
        height: 40,
        z: 32,
        vector: [1, 0],
        id: "orientation-local",
      });
      const cnot = createGeneratedLayoutItemNode("cnot-gate", {
        left: 200,
        top: 10,
        width: 240,
        height: 190,
        z: 33,
        id: "orientation-cnot",
      });
      canvas.append(retained, received, local, cnot);
      prepareGeneratedLayoutCanvas(canvas);
      const pairState = createGeneratedPairState(retained, received);
      pairState.amplitudes = [Math.SQRT1_2, 0, 0, Math.SQRT1_2];
      pairState.displayMode = "linked";
      pairState.linkRelation = "correlated";
      syncGeneratedPairStateVisuals(pairState);
      local.dataset.qubitId = received.dataset.qubitId;
      const cnotRuntime = initializeGeneratedCnotItem(cnot);
      await runGeneratedCnotIngress(canvas, local, cnotRuntime, "top");
      await runGeneratedCnotIngress(canvas, received, cnotRuntime, "bottom");
      if (cnotRuntime.cyclePromise) {
        await cnotRuntime.cyclePromise;
      }
      const retainedState = generatedQubitRuntimes.get(retained);
      const receivedState = generatedQubitRuntimes.get(received);
      const localState = generatedQubitRuntimes.get(local);
      const memberLogicalIds = Array.from(
        localState?.pairState?.members || [],
        (member) => qubitLogicalIdForItem(member.item),
      );
      const result = {
        retainedIndex: retainedState?.pairQubitIndex,
        receivedIndex: receivedState?.pairQubitIndex,
        localIndex: localState?.pairQubitIndex,
        sameRegister:
          retainedState?.pairState === receivedState?.pairState &&
          receivedState?.pairState === localState?.pairState,
        numQubits: receivedState?.pairState?.numQubits || null,
        amplitudes: receivedState?.pairState?.amplitudes || null,
        retainedLogicalId: qubitLogicalIdForItem(retained),
        receivedLogicalId: qubitLogicalIdForItem(received),
        localLogicalId: qubitLogicalIdForItem(local),
        memberLogicalIds,
        uniqueMemberLogicalIds: new Set(memberLogicalIds).size,
      };
      [retained, received, local].forEach((item) => {
        generatedQubitRuntimes.delete(item);
        item.remove();
      });
      cnot.remove();
      return result;
    });
    if (
      !aliceBottomExistingOrientation ||
      aliceBottomExistingOrientation.retainedIndex !== 0 ||
      aliceBottomExistingOrientation.receivedIndex !== 1 ||
      aliceBottomExistingOrientation.localIndex !== 2 ||
      !aliceBottomExistingOrientation.sameRegister ||
      aliceBottomExistingOrientation.numQubits !== 3 ||
      aliceBottomExistingOrientation.receivedLogicalId ===
        aliceBottomExistingOrientation.localLogicalId ||
      aliceBottomExistingOrientation.uniqueMemberLogicalIds !== 3 ||
      Math.abs(aliceBottomExistingOrientation.amplitudes?.[0] - Math.SQRT1_2) >
        1e-9 ||
      Math.abs(aliceBottomExistingOrientation.amplitudes?.[6] - Math.SQRT1_2) >
        1e-9
    ) {
      throw new Error(
        `C-NOT with existing register in bottom slot did not append q2 correctly: ${JSON.stringify(aliceBottomExistingOrientation)}`,
      );
    }

    const aliceExpanded = await alice.page.evaluate(() => {
      const panel = document.querySelector("#panel-mailbox-delivery-smoke");
      const canvas = panel?.querySelector(".generated-layout-canvas");
      const received = panel?.querySelector("[data-mailbox-received-event-id]");
      const local = panel?.querySelector(
        '[data-generated-item-id="mailbox-smoke-qubit"]',
      );
      if (!canvas || !received || !(local instanceof HTMLElement)) {
        return null;
      }
      prepareGeneratedLayoutCanvas(canvas);
      ensureGeneratedQubitRuntimeState(local);
      applyGeneratedCnotToQubitStates(received, local);
      const receivedState = generatedQubitRuntimes.get(received);
      const localState = generatedQubitRuntimes.get(local);
      return {
        receivedIndex: receivedState?.pairQubitIndex,
        localIndex: localState?.pairQubitIndex,
        sameRegister: receivedState?.pairState === localState?.pairState,
        numQubits: receivedState?.pairState?.numQubits,
        amplitudes: receivedState?.pairState?.amplitudes || null,
        receivedLogicalId: qubitLogicalIdForItem(received),
        localLogicalId: qubitLogicalIdForItem(local),
        localLabel: local.dataset.qubitLabel || "",
      };
    });
    if (
      !aliceExpanded ||
      aliceExpanded.receivedIndex !== 1 ||
      aliceExpanded.localIndex !== 2 ||
      !aliceExpanded.sameRegister ||
      aliceExpanded.numQubits !== 3 ||
      aliceExpanded.receivedLogicalId === aliceExpanded.localLogicalId ||
      aliceExpanded.localLabel !== "q2" ||
      Math.abs(aliceExpanded.amplitudes?.[0] - Math.SQRT1_2) > 1e-9 ||
      Math.abs(aliceExpanded.amplitudes?.[7] - Math.SQRT1_2) > 1e-9
    ) {
      throw new Error(
        `Alice did not expand the shared register to three qubits: ${JSON.stringify(aliceExpanded)}`,
      );
    }

    await bob.page.waitForFunction(
      (sharedId) => {
        const item = document.querySelector(
          '#panel-mailbox-delivery-smoke [data-generated-item-id="mailbox-smoke-qubit"]',
        );
        const state = generatedQubitRuntimes.get(item);
        return (
          item?.dataset.remoteEntanglementId === sharedId &&
          state?.pairState?.numQubits === 3 &&
          state.pairState.amplitudes?.length === 8 &&
          Math.abs(state.pairState.amplitudes[7] - Math.SQRT1_2) < 1e-9
        );
      },
      alicePair.id,
      { timeout: 9000 },
    );

    await alice.page.evaluate(async () => {
      const panel = document.querySelector("#panel-mailbox-delivery-smoke");
      const mailboxItem = panel?.querySelector('[data-component="mailbox"]');
      const q2 = panel?.querySelector(
        '[data-generated-item-id="mailbox-smoke-qubit"]',
      );
      if (!(mailboxItem instanceof HTMLElement) || !(q2 instanceof HTMLElement)) {
        throw new Error("Alice q2 return setup is missing");
      }
      await mailboxRoomSendQubit(
        { mailboxItem, qubitItem: q2, qubitIndex: 2 },
        { toParticipantId: "", message: "return q2" },
      );
    });

    const returnedRegister = await bob.page.evaluate(async () => {
      await mailboxRoomRefresh({ render: false });
      const event = mailboxRoomVisibleEvents()
        .slice()
        .reverse()
        .find(
          (entry) =>
            entry?.type === "roomMailbox.sent" &&
            entry.payload?.fromName === "Alice" &&
            entry.payload?.qubitLabel === "q2",
        );
      if (!event) {
        return { received: false, reason: "missing return event" };
      }
      const returned = mailboxRoomReceiveQubitEvent(event);
      const retained = document.querySelector(
        '#panel-mailbox-delivery-smoke [data-generated-item-id="mailbox-smoke-qubit"]',
      );
      const retainedState = generatedQubitRuntimes.get(retained);
      const returnedState = generatedQubitRuntimes.get(returned);
      return {
        received: Boolean(returned),
        retainedIndex: retainedState?.pairQubitIndex,
        returnedIndex: returnedState?.pairQubitIndex,
        retainedNumQubits: retainedState?.pairState?.numQubits || null,
        returnedNumQubits: returnedState?.pairState?.numQubits || null,
        sameRegister: retainedState?.pairState === returnedState?.pairState,
        retainedMembers: retainedState?.pairState?.members?.length || 0,
        returnedMembers: returnedState?.pairState?.members?.length || 0,
      };
    });
    if (
      !returnedRegister.received ||
      returnedRegister.retainedIndex !== 0 ||
      returnedRegister.returnedIndex !== 2 ||
      returnedRegister.retainedNumQubits !== 3 ||
      returnedRegister.returnedNumQubits !== 3 ||
      !returnedRegister.sameRegister
    ) {
      throw new Error(
        `Returned q2 did not rebind Bob's retained q0 to the three-qubit register: ${JSON.stringify(returnedRegister)}`,
      );
    }

    await alice.page.evaluate(() => {
      const item = document.querySelector(
        '#panel-mailbox-delivery-smoke [data-mailbox-received-event-id]',
      );
      applyGeneratedSingleGateToQubitState(item, 6);
    });
    try {
      await bob.page.waitForFunction(
        () => {
          const item = document.querySelector(
            '#panel-mailbox-delivery-smoke [data-generated-item-id="mailbox-smoke-qubit"]',
          );
          const pairState = generatedQubitRuntimes.get(item)?.pairState;
          return (
            pairState?.remoteVersion >= 3 &&
            pairState.numQubits === 3 &&
            Math.abs(pairState.amplitudes?.[2] + Math.SQRT1_2) < 1e-9 &&
            Math.abs(pairState.amplitudes?.[5] - Math.SQRT1_2) < 1e-9
          );
        },
        null,
        { timeout: 9000 },
      );
    } catch (error) {
      const [bobState, sharedState] = await Promise.all([
        bob.page.evaluate(() => {
          const item = document.querySelector(
            '#panel-mailbox-delivery-smoke [data-generated-item-id="mailbox-smoke-qubit"]',
          );
          const pairState = generatedQubitRuntimes.get(item)?.pairState;
          return {
            remoteId: item?.dataset.remoteEntanglementId || "",
            remoteVersion: pairState?.remoteVersion || null,
            numQubits: pairState?.numQubits || null,
            amplitudes: pairState?.amplitudes || null,
          };
        }),
        api(
          backend.baseUrl,
          `/rooms/${encodeURIComponent(roomId)}/shared-entanglements/${encodeURIComponent(alicePair.id)}`,
        ),
      ]);
      throw new Error(
        `Remote three-qubit gate update did not arrive: bob=${JSON.stringify(bobState)} shared=${JSON.stringify(sharedState.body)}`,
      );
    }

    const measuredColor = await alice.page.evaluate(() => {
      const item = document.querySelector(
        '#panel-mailbox-delivery-smoke [data-mailbox-received-event-id]',
      );
      return collapseGeneratedQubitState(item);
    });
    const separationDeadline = Date.now() + 5000;
    let sharedPairPayload = await api(
      backend.baseUrl,
      `/rooms/${encodeURIComponent(roomId)}/shared-entanglements/${encodeURIComponent(alicePair.id)}`,
    );
    while (
      !(
        sharedPairPayload.body.sharedEntanglement?.status === "active" &&
        sharedPairPayload.body.sharedEntanglement?.numQubits === 3 &&
        sharedPairPayload.body.sharedEntanglement?.version >= 4
      ) &&
      Date.now() < separationDeadline
    ) {
      await wait(100);
      sharedPairPayload = await api(
        backend.baseUrl,
        `/rooms/${encodeURIComponent(roomId)}/shared-entanglements/${encodeURIComponent(alicePair.id)}`,
      );
    }
    if (
      sharedPairPayload.body.sharedEntanglement?.status !== "active" ||
      sharedPairPayload.body.sharedEntanglement?.numQubits !== 3
    ) {
      throw new Error(
        `Mailbox register measurement was not published: ${JSON.stringify(sharedPairPayload.body)}`,
      );
    }
    try {
      await bob.page.waitForFunction(
        (expectedColor) => {
          const item = document.querySelector(
            '#panel-mailbox-delivery-smoke [data-generated-item-id="mailbox-smoke-qubit"]',
          );
          const state = generatedQubitRuntimes.get(item);
          const expectedProbabilities =
            expectedColor === "blue" ? [0, 1] : [1, 0];
          return (
            state?.pairState?.numQubits === 3 &&
            Math.abs((state?.vector?.[0] ?? 0) ** 2 - expectedProbabilities[0]) <
              1e-9 &&
            Math.abs((state?.vector?.[1] ?? 0) ** 2 - expectedProbabilities[1]) <
              1e-9
          );
        },
        measuredColor,
        { timeout: 12000 },
      );
    } catch (error) {
      const bobState = await bob.page.evaluate(() => {
        const item = document.querySelector(
          '#panel-mailbox-delivery-smoke [data-generated-item-id="mailbox-smoke-qubit"]',
        );
        const state = generatedQubitRuntimes.get(item);
        return {
          vector: state?.vector || null,
          pairVersion: state?.pairState?.remoteVersion || null,
          paired: Boolean(state?.pairState),
        };
      });
      throw new Error(
        `Remote mailbox measurement did not arrive: expected=${measuredColor}, bob=${JSON.stringify(bobState)}, shared=${JSON.stringify(sharedPairPayload.body)}`,
      );
    }

    await alice.page.reload({ waitUntil: "domcontentloaded" });
    await wait(400);
    const afterRecipientReboot = await api(
      backend.baseUrl,
      `/rooms/${encodeURIComponent(roomId)}`,
    );
    if (afterRecipientReboot.response.status !== 200) {
      throw new Error("Recipient reboot incorrectly deleted the sender's room");
    }

    await bob.page.reload({ waitUntil: "domcontentloaded" });
    await wait(400);
    const afterSenderReboot = await api(
      backend.baseUrl,
      `/rooms/${encodeURIComponent(roomId)}`,
    );
    if (afterSenderReboot.response.status !== 200) {
      throw new Error("Sender reboot incorrectly deleted the shared room");
    }
  } finally {
    await alice?.context.close();
    await bob?.context.close();
    await closeServer(backend.server);
  }
}

async function runEditorOpenTabSmoke(browser, baseUrl) {
  const page = await browser.newPage({ viewport: { width: 1200, height: 820 } });
  try {
    await installContentApiHelpers(page);
    await page.goto(`${baseUrl}/index.html`, { waitUntil: "domcontentloaded" });
    await page.evaluate(() => unlockWorkshop());
    await page.waitForSelector("#panel-plaground:not([hidden])");

    const openButton = page.locator("#editorOpenTabButton");
    if (!(await openButton.isEnabled())) {
      throw new Error("Editor Open tab button is disabled with saved tabs available");
    }
    await openButton.click();
    if (!(await page.locator("#editorOpenTabPanel").isVisible())) {
      throw new Error("Editor Open tab button did not reveal the tab selector");
    }
    await page
      .locator("#editorTargetTabSelect")
      .selectOption("custom-one-qubit");
    await page.waitForFunction(
      () =>
        document
          .querySelector("#editorDocumentStatus")
          ?.textContent?.includes("Editing: One qubit"),
    );
    const itemCount = await page
      .locator("#playgroundCanvas > .playground-node")
      .count();
    if (itemCount === 0) {
      throw new Error("Editor opened One qubit without loading its layout");
    }
  } finally {
    await page.close();
  }
}

async function runQuantumInspectorSmoke(page) {
  const originalGeneratedTabs = await page.evaluate(() =>
    JSON.parse(JSON.stringify(window.readQuantumContentState("generated-tabs"))),
  );
  try {
    await page.evaluate(() => {
      window.writeQuantumContentState("generated-tabs", {
        tabs: [
          {
            id: "inspector-smoke",
            label: "Inspector Smoke",
            layout: {
              items: [
                {
                  id: "inspector-q",
                  type: "qubit",
                  left: 80,
                  top: 120,
                  width: 54,
                  height: 54,
                  vector: [Math.SQRT1_2, Math.SQRT1_2],
                },
                {
                  id: "inspector-gate",
                  type: "single-gate",
                  left: 190,
                  top: 55,
                  width: 300,
                  height: 180,
                  singleGateTick: 3,
                },
                {
                  id: "inspector-cnot",
                  type: "cnot-gate",
                  left: 560,
                  top: 80,
                  width: 373,
                  height: 209,
                },
              ],
              canvasWidth: 1000,
              canvasHeight: 420,
            },
          },
        ],
      });
      window.applyGeneratedTabsState(window.readQuantumContentState("generated-tabs"));
      window.setActiveTab("inspector-smoke");
    });
    await page.waitForSelector("#panel-inspector-smoke .generated-layout-canvas");

    await page
      .locator("#panel-inspector-smoke [data-generated-item-id='inspector-q']")
      .click({ button: "right" });
    const qubitInspectorText = await page
      .locator(".qubit-inspector-vector")
      .textContent();
    if (
      !qubitInspectorText ||
      !qubitInspectorText.includes("Register: 1 qubit (2 basis states)") ||
      !qubitInspectorText.includes("|0>") ||
      !qubitInspectorText.includes("|1>")
    ) {
      throw new Error(
        `Qubit register inspector failed: ${JSON.stringify(qubitInspectorText)}`,
      );
    }

    await page.locator(".qubit-inspector-close").click();
    const singleGateBox = await page
      .locator("#panel-inspector-smoke [data-generated-item-id='inspector-gate']")
      .boundingBox();
    if (!singleGateBox) {
      throw new Error("Single-gate inspector smoke failed: missing gate box");
    }
    await page.mouse.click(
      singleGateBox.x + singleGateBox.width / 2,
      singleGateBox.y + singleGateBox.height / 2,
      { button: "right" },
    );
    const singleGateText = await page
      .locator(".qubit-inspector-vector")
      .textContent();
    if (
      !singleGateText ||
      !singleGateText.includes("U (2 x 2)") ||
      !singleGateText.includes("theta = 3π/6 radians")
    ) {
      throw new Error(
        `Single-gate matrix inspector failed: ${JSON.stringify(singleGateText)}`,
      );
    }

    await page.locator(".qubit-inspector-close").click();
    const cnotBox = await page
      .locator("#panel-inspector-smoke [data-generated-item-id='inspector-cnot']")
      .boundingBox();
    if (!cnotBox) {
      throw new Error("C-NOT inspector smoke failed: missing gate box");
    }
    await page.mouse.click(
      cnotBox.x + cnotBox.width / 2,
      cnotBox.y + cnotBox.height / 2,
      { button: "right" },
    );
    const cnotText = await page.locator(".qubit-inspector-vector").textContent();
    if (!cnotText || !cnotText.includes("U (4 x 4)") || !cnotText.includes("C-NOT Gate")) {
      throw new Error(
        `C-NOT matrix inspector failed: ${JSON.stringify(cnotText)}`,
      );
    }
  } finally {
    await page.evaluate((state) => {
      window.writeQuantumContentState("generated-tabs", state);
      window.applyGeneratedTabsState(state);
    }, originalGeneratedTabs);
  }
}

async function runMailboxReplayCoreSmoke(page) {
  const result = await page.evaluate(async () => {
    const makeCanvas = (tabId) => {
      const canvas = document.createElement("div");
      canvas.className = "generated-layout-canvas playground-canvas";
      canvas.dataset.generatedTabId = tabId;
      canvas.style.width = "640px";
      canvas.style.height = "320px";
      const qubit = createGeneratedLayoutItemNode("qubit", {
        id: "mailbox-replay-q",
        left: 40,
        top: 96,
        width: 52,
        height: 52,
        qubitId: 8,
      });
      const mailbox = createGeneratedLayoutItemNode("mailbox", {
        id: "mailbox-replay-box",
        left: 280,
        top: 56,
        width: 220,
        height: 150,
      });
      canvas.append(qubit, mailbox);
      document.body.appendChild(canvas);
      prepareGeneratedLayoutCanvas(canvas);
      return { canvas, qubit };
    };
    const experiment = {
      initialQubits: [
        {
          itemId: "mailbox-replay-q",
          logicalQubitId: 8,
          vector: [1, 0],
          center: { x: 66, y: 122 },
        },
      ],
      actions: [
        {
          type: "drag",
          qubitId: "mailbox-replay-q",
          qubitLogicalId: 8,
          path: [
            { x: 66, y: 122, t: 0 },
            { x: 360, y: 128, t: 80 },
          ],
        },
        {
          type: "mailbox-send",
          mailboxId: "mailbox-replay-box",
          qubitId: "mailbox-replay-q",
          qubitLogicalId: 8,
        },
      ],
    };
    const animated = makeCanvas("mailbox-replay-smoke");
    const animatedCompleted = await replayGeneratedRecordedExperimentAnimated(
      animated.canvas,
      experiment,
    );
    const animatedResult = {
      completed: animatedCompleted,
      qubitConnected: animated.qubit.isConnected,
      qubitCount: animated.canvas.querySelectorAll('[data-component="qubit"]')
        .length,
    };
    animated.canvas.remove();
    const staticReplay = makeCanvas("mailbox-static-replay-smoke");
    applyGeneratedRecordedExperimentStaticFinalVisualState(
      staticReplay.canvas,
      experiment,
    );
    const staticResult = {
      qubitConnected: staticReplay.qubit.isConnected,
      qubitCount: staticReplay.canvas.querySelectorAll('[data-component="qubit"]')
        .length,
    };
    staticReplay.canvas.remove();
    return { animatedResult, staticResult };
  });
  if (
    result.animatedResult.completed !== true ||
    result.animatedResult.qubitConnected !== false ||
    result.animatedResult.qubitCount !== 0 ||
    result.staticResult.qubitConnected !== false ||
    result.staticResult.qubitCount !== 0
  ) {
    throw new Error(`Mailbox replay smoke failed: ${JSON.stringify(result)}`);
  }
}

async function runFourQubitRecordedReplaySmoke(page) {
  const result = await page.evaluate(() => {
    const rootHalf = Math.SQRT1_2;
    const canvas = document.createElement("div");
    canvas.className = "generated-layout-canvas";
    canvas.dataset.generatedTabId = "four-qubit-register-replay-smoke";
    const measurement = createGeneratedLayoutItemNode(
      savedGroupComponentType(REGISTER_FOUR_QUBIT_MEASUREMENT_GROUP_ID),
      {
        id: "four-register-replay-measure",
        left: 300,
        top: 30,
        width: 940,
        height: 438,
        measurementRegisterQubitCount: 4,
      },
    );
    canvas.append(measurement);
    document.body.appendChild(canvas);
    const runtime = initializeGeneratedSeparatedPairMeasurementItem(measurement);
    const originalMathRandom = Math.random;
    try {
      const replayRandomValues = [];
      for (let index = 0; index < 12; index += 1) {
        replayRandomValues.push(index % 2 === 0 ? 0.75 : 0.25);
        replayRandomValues.push(0.25, 0.25, 0.25);
      }
      Math.random = () =>
        replayRandomValues.length > 0 ? replayRandomValues.shift() : 0.25;
      replayGeneratedRecordedExperimentFast(
        canvas,
        {
          initialQubits: [
            {
              itemId: "four-register-q0",
              logicalQubitId: 1,
              vector: [rootHalf, rootHalf],
            },
            {
              itemId: "four-register-q1",
              logicalQubitId: 2,
              vector: [1, 0],
            },
            {
              itemId: "four-register-q2",
              logicalQubitId: 3,
              vector: [1, 0],
            },
            {
              itemId: "four-register-q3",
              logicalQubitId: 4,
              vector: [1, 0],
            },
          ],
          actions: [
            {
              type: "cnot",
              topQubitId: "four-register-q0",
              topQubitLogicalId: 1,
              bottomQubitId: "four-register-q1",
              bottomQubitLogicalId: 2,
            },
            {
              type: "cnot",
              topQubitId: "four-register-q1",
              topQubitLogicalId: 2,
              bottomQubitId: "four-register-q2",
              bottomQubitLogicalId: 3,
            },
            {
              type: "cnot",
              topQubitId: "four-register-q2",
              topQubitLogicalId: 3,
              bottomQubitId: "four-register-q3",
              bottomQubitLogicalId: 4,
            },
            {
              type: "separated-pair-measure",
              measurementId: "four-register-replay-measure",
              qubitId: "four-register-q0",
              logicalQubitId: 1,
              orderIndex: 0,
              registerQubitCount: 4,
            },
            {
              type: "separated-pair-measure",
              measurementId: "four-register-replay-measure",
              qubitId: "four-register-q1",
              logicalQubitId: 2,
              orderIndex: 1,
              registerQubitCount: 4,
            },
            {
              type: "separated-pair-measure",
              measurementId: "four-register-replay-measure",
              qubitId: "four-register-q2",
              logicalQubitId: 3,
              orderIndex: 2,
              registerQubitCount: 4,
            },
            {
              type: "separated-pair-measure",
              measurementId: "four-register-replay-measure",
              qubitId: "four-register-q3",
              logicalQubitId: 4,
              orderIndex: 3,
              registerQubitCount: 4,
            },
          ],
        },
        12,
      );
    } finally {
      Math.random = originalMathRandom;
    }
    const counts = { ...(runtime?.tubeCounts || {}) };
    canvas.remove();
    return { counts };
  });
  if (
    result.counts.bbbb !== 6 ||
    result.counts.rrrr !== 6 ||
    result.counts.rbrb !== 0
  ) {
    throw new Error(
      `Four-qubit replay did not preserve the entangled register: ${JSON.stringify(result)}`,
    );
  }
}

async function runEntanglementThreeRoomReplayIdentitySmoke(page) {
  const result = await page.evaluate(() => {
    const originalMathRandom = Math.random;
    try {
      Math.random = () => 0.25;
      const counts = mailboxRoomRecordedMeasurementCounts(
        {
          initialQubits: [
            {
              itemId: "bob-q0",
              logicalQubitId: 1,
              roomQubitIndex: 0,
              roomParticipantId: "bob",
              vector: [1, 0],
            },
            {
              itemId: "bob-q1",
              logicalQubitId: 2,
              roomQubitIndex: 1,
              roomParticipantId: "bob",
              vector: [1, 0],
            },
            {
              itemId: "alice-q0",
              logicalQubitId: 1,
              roomQubitIndex: 2,
              roomParticipantId: "alice",
              vector: [1, 0],
            },
            {
              itemId: "alice-q1",
              logicalQubitId: 2,
              roomQubitIndex: 3,
              roomParticipantId: "alice",
              vector: [1, 0],
            },
          ],
          actions: [
            {
              type: "gate",
              qubitId: "bob-q0",
              qubitLogicalId: 1,
              roomQubitIndex: 0,
              roomParticipantId: "bob",
              tickIndex: 6,
            },
            {
              type: "gate",
              qubitId: "bob-q1",
              qubitLogicalId: 2,
              roomQubitIndex: 1,
              roomParticipantId: "bob",
              tickIndex: 6,
            },
            {
              type: "separated-pair-measure",
              measurementId: "room-measure",
              qubitId: "bob-q0",
              logicalQubitId: 1,
              roomQubitIndex: 0,
              roomParticipantId: "bob",
              orderIndex: 0,
              registerQubitCount: 4,
            },
            {
              type: "mailbox-send",
              qubitId: "bob-q1",
              logicalQubitId: 2,
              roomQubitIndex: 1,
              roomParticipantId: "bob",
            },
            {
              type: "separated-pair-measure",
              measurementId: "room-measure",
              qubitId: "alice-q0",
              logicalQubitId: 1,
              roomQubitIndex: 2,
              roomParticipantId: "alice",
              orderIndex: 2,
              registerQubitCount: 4,
            },
            {
              type: "separated-pair-measure",
              measurementId: "room-measure",
              qubitId: "alice-q1",
              logicalQubitId: 2,
              roomQubitIndex: 3,
              roomParticipantId: "alice",
              orderIndex: 3,
              registerQubitCount: 4,
            },
            {
              type: "separated-pair-measure",
              measurementId: "room-measure",
              qubitId: "alice-received-bob-q1",
              logicalQubitId: 9,
              roomQubitIndex: 1,
              roomParticipantId: "alice",
              orderIndex: 1,
              registerQubitCount: 4,
            },
          ],
        },
        1,
        { numQubits: 4 },
      );
      return { counts };
    } finally {
      Math.random = originalMathRandom;
    }
  });
  if (result.counts?.rrbb !== 1 || result.counts?.rbbb || result.counts?.brbb) {
    throw new Error(
      `Entanglement 3 room replay lost transferred qubit identity: ${JSON.stringify(result)}`,
    );
  }
}

async function runEntanglementThreeTransferredPurpleReplaySmoke(page) {
  const result = await page.evaluate(() => {
    const originalMathRandom = Math.random;
    const outcomeKeys = registerMeasurementOutcomeKeys(4);
    const randomValues = [];
    outcomeKeys.forEach((key) => {
      [2, 3, 0, 1].forEach((index) => {
        randomValues.push(key[index] === "b" ? 0.25 : 0.75);
      });
    });
    try {
      Math.random = () =>
        randomValues.length > 0 ? randomValues.shift() : 0.25;
      const counts = mailboxRoomRecordedMeasurementCounts(
        {
          initialQubits: [
            {
              itemId: "alice-received-bob-q0",
              logicalQubitId: 9,
              roomQubitIndex: 0,
              roomParticipantId: "alice",
              vector: [0, 1],
            },
            {
              itemId: "alice-q2",
              logicalQubitId: 3,
              roomQubitIndex: 2,
              roomParticipantId: "alice",
              vector: [1, 0],
            },
            {
              itemId: "alice-q3",
              logicalQubitId: 4,
              roomQubitIndex: 3,
              roomParticipantId: "alice",
              vector: [1, 0],
            },
            {
              itemId: "bob-q0",
              logicalQubitId: 1,
              roomQubitIndex: 0,
              roomParticipantId: "bob",
              vector: [1, 0],
            },
            {
              itemId: "bob-q1",
              logicalQubitId: 2,
              roomQubitIndex: 1,
              roomParticipantId: "bob",
              vector: [1, 0],
            },
          ],
          actions: [
            {
              type: "gate",
              qubitId: "alice-q2",
              qubitLogicalId: 3,
              roomQubitIndex: 2,
              roomParticipantId: "alice",
              tickIndex: 3,
            },
            {
              type: "gate",
              qubitId: "alice-q3",
              qubitLogicalId: 4,
              roomQubitIndex: 3,
              roomParticipantId: "alice",
              tickIndex: 3,
            },
            {
              type: "separated-pair-measure",
              measurementId: "room-measure",
              qubitId: "alice-q2",
              logicalQubitId: 3,
              roomQubitIndex: 2,
              roomParticipantId: "alice",
              orderIndex: 2,
              registerQubitCount: 4,
            },
            {
              type: "separated-pair-measure",
              measurementId: "room-measure",
              qubitId: "alice-q3",
              logicalQubitId: 4,
              roomQubitIndex: 3,
              roomParticipantId: "alice",
              orderIndex: 3,
              registerQubitCount: 4,
            },
            {
              type: "separated-pair-measure",
              measurementId: "room-measure",
              qubitId: "alice-received-bob-q0",
              logicalQubitId: 9,
              roomQubitIndex: 0,
              roomParticipantId: "alice",
              orderIndex: 0,
              registerQubitCount: 4,
            },
            {
              type: "mailbox-send",
              qubitId: "bob-q0",
              logicalQubitId: 1,
              roomQubitIndex: 0,
              roomParticipantId: "bob",
            },
            {
              type: "gate",
              qubitId: "bob-q1",
              qubitLogicalId: 2,
              roomQubitIndex: 1,
              roomParticipantId: "bob",
              tickIndex: 3,
            },
            {
              type: "gate",
              qubitId: "bob-q0",
              qubitLogicalId: 1,
              roomQubitIndex: 0,
              roomParticipantId: "bob",
              tickIndex: 3,
            },
            {
              type: "separated-pair-measure",
              measurementId: "room-measure",
              qubitId: "bob-q1",
              logicalQubitId: 2,
              roomQubitIndex: 1,
              roomParticipantId: "bob",
              orderIndex: 1,
              registerQubitCount: 4,
            },
          ],
        },
        outcomeKeys.length,
        { numQubits: 4 },
      );
      return { counts, outcomeKeys };
    } finally {
      Math.random = originalMathRandom;
    }
  });
  const missing = result.outcomeKeys.filter(
    (key) => Number(result.counts?.[key] || 0) !== 1,
  );
  if (missing.length > 0) {
    throw new Error(
      `Entanglement 3 transferred purple replay did not fill all outcomes: ${JSON.stringify({ missing, counts: result.counts })}`,
    );
  }
}

async function runSmokeTest(baseUrl) {
  const browser = await chromium.launch({ headless: true });
  try {
    if (process.argv.includes("--mailbox-only")) {
      await runMailboxRoomDeliverySmoke(browser, baseUrl);
      return { ok: true, mailboxDelivery: true };
    }
    if (process.argv.includes("--editor-open-only")) {
      await runEditorOpenTabSmoke(browser, baseUrl);
      return { ok: true, editorOpenTab: true };
    }
    if (process.argv.includes("--workshop-only")) {
      await runWorkshopPasswordSessionSmoke(browser, baseUrl);
      return { ok: true, workshopPasswordSession: true };
    }
    if (process.argv.includes("--entanglement-three-only")) {
      await runEntanglementThreeRoomMeasurementSmoke(browser, baseUrl);
      return { ok: true, entanglementThreeRoomMeasurement: true };
    }
    if (process.argv.includes("--replay-core-only")) {
      const page = await browser.newPage({ viewport: { width: 1100, height: 760 } });
      await installBrowserLocalContentTrap(page);
      await installContentApiHelpers(page);
      await page.goto(`${baseUrl}/index.html`, { waitUntil: "domcontentloaded" });
      await runMailboxReplayCoreSmoke(page);
      return { ok: true, replayCore: true };
    }
    if (process.argv.includes("--four-replay-only")) {
      const page = await browser.newPage({
        viewport: { width: 1100, height: 760 },
      });
      await installBrowserLocalContentTrap(page);
      await installContentApiHelpers(page);
      await page.goto(`${baseUrl}/index.html`, { waitUntil: "domcontentloaded" });
      await runFourQubitRecordedReplaySmoke(page);
      await runEntanglementThreeRoomReplayIdentitySmoke(page);
      await runEntanglementThreeTransferredPurpleReplaySmoke(page);
      return {
        ok: true,
        fourReplay: true,
        entanglementThreeRoomReplay: true,
        entanglementThreeTransferredPurpleReplay: true,
      };
    }
    const fileMode = await runFileModeRepositoryContentSmoke(browser);
    const page = await browser.newPage({ viewport: { width: 1100, height: 760 } });
    await installBrowserLocalContentTrap(page);
    await installContentApiHelpers(page);
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("console", (message) => {
      const text = message.text();
      if (message.type() === "error" && !isIgnorableBrowserConsoleError(text)) {
        errors.push(text);
      }
    });

    await page.goto(`${baseUrl}/index.html`, { waitUntil: "domcontentloaded" });
    await runLocalMultiQubitLabSmoke(page);
    await runLocalLabSharedSyncSmoke(browser, baseUrl);
    await runEntanglementThreeRoomMeasurementSmoke(browser, baseUrl);
    await runMailboxRoomDeliverySmoke(browser, baseUrl);
    await runQuantumInspectorSmoke(page);
    await runDocEditorLandingIntroTextSmoke(page);
    await runWorkshopPasswordSessionSmoke(browser, baseUrl);
    await runEntangledMathSmoke(page);
    await runEditorDoubleMeasurementSmoke(page);
    await runSequentialMeasurementEditorSmoke(page);
    await runEditorDocumentWorkflowSmoke(page);
    await runDocEditorMeasurementRecordingSmoke(page);
    await runDocEditorTwoQubitPlaybackSmoke(page);
    await runDocEditorTextPersistenceSmoke(page);

    await page.evaluate(() => {
      window.writeQuantumContentState("generated-tabs", {
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
      });
    });

    await page.reload({ waitUntil: "domcontentloaded" });
    await page.waitForSelector("#panel-editor-smoke .generated-experiment-toolbar", {
      state: "attached",
    });
    const resetCoverage = await page.evaluate(() => {
      const generatedPanels = Array.from(
        document.querySelectorAll(".tab-panel.generated-tab"),
      );
      const experimentPanels = generatedPanels.filter((panel) => {
        const target = panel.id.replace(/^panel-/, "");
        const tab = Array.from(document.querySelectorAll(".tab-btn")).find(
          (button) => button.dataset.tabTarget === target,
        );
        return tab?.textContent?.trim() !== "Introduction";
      });
      return {
        generatedTabs: generatedPanels.length,
        experimentTabs: experimentPanels.length,
        resetButtons: experimentPanels.reduce(
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
      resetCoverage.resetButtons !== resetCoverage.experimentTabs ||
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
      fileMode,
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

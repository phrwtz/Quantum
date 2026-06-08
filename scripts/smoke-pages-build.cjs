const fs = require("node:fs");
const fsp = require("node:fs/promises");
const http = require("node:http");
const path = require("node:path");
const { chromium } = require("playwright");

const rootDir = path.resolve(__dirname, "..");
const distDir = path.join(rootDir, "dist");
const expectedPublishedTabLabels = [
  "Introduction",
  "One qubit",
  "Two qubits",
  "Entanglement 1",
  "Entanglement 2",
];

const mimeTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
};

function startServer() {
  const server = http.createServer(async (request, response) => {
    try {
      const requestUrl = new URL(request.url || "/", "http://127.0.0.1");
      const decodedPath = decodeURIComponent(requestUrl.pathname);
      const relativePath =
        decodedPath === "/" ? "index.html" : decodedPath.slice(1);
      const filePath = path.resolve(distDir, relativePath);
      if (filePath !== distDir && !filePath.startsWith(`${distDir}${path.sep}`)) {
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
        "Content-Type":
          mimeTypes[path.extname(filePath)] || "application/octet-stream",
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

async function runSmoke(baseUrl) {
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 1180, height: 760 } });
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("console", (message) => {
      if (message.type() === "error") {
        errors.push(message.text());
      }
    });
    await page.goto(`${baseUrl}/index.html`, { waitUntil: "domcontentloaded" });
    await page.waitForSelector(".tab-btn.generated-tab-btn");

    const result = await page.evaluate(() => {
      const labels = Array.from(document.querySelectorAll(".tab-btn")).map(
        (button) => button.textContent.trim(),
      );
      const publicTargets = Array.from(document.querySelectorAll(".tab-btn")).map(
        (button) => button.dataset.tabTarget || "",
      );
      const landingPanel = publicTargets[0]
        ? document.getElementById(`panel-${publicTargets[0]}`)
        : null;
      const landingButtonLabels = Array.from(
        landingPanel?.querySelectorAll("button") || [],
      ).map((button) => button.textContent.trim());
      const whatsThisTargets = publicTargets.filter((target) =>
        Boolean(
          document
            .getElementById(`panel-${target}`)
            ?.querySelector("[data-generated-document-action='whats-this']"),
        ),
      );
      const docs =
        window.__QUANTUM_REPOSITORY_CONTENT__?.files?.[
          "data/whats-this-documents.json"
        ] || { documents: [] };
      const one = docs.documents.find((doc) => doc.tabId === "custom-one-qubit");
      const last = one?.scenes?.[one.scenes.length - 1];
      const lastText = (last?.items || [])
        .filter((item) => item.type === "text-box")
        .map((item) => item.text || "")
        .join("\n");
      const entanglementOne = docs.documents.find(
        (doc) => doc.tabId === "custom-entanglement-2",
      );
      const entanglementLast =
        entanglementOne?.scenes?.[entanglementOne.scenes.length - 1];
      const entanglementLastText = (entanglementLast?.items || [])
        .filter((item) => item.type === "text-box")
        .map((item) => item.text || "")
        .join("\n");
      return {
        target: document.documentElement.dataset.quantumTarget || "",
        labels,
        publicTargets,
        landingButtonLabels,
        whatsThisTargets,
        oneQubitLastSceneHasMarker: lastText.includes(
          "I recommend working through the tabs in order",
        ),
        oneQubitLastSceneHasClue: lastText.includes("(That's a clue!)"),
        entanglementOneLastSceneHasMarker: entanglementLastText.includes(
          "Here are some questions to ponder:",
        ),
        entanglementOneLastSceneHasOldText: entanglementLastText.includes(
          "leave it to you to experiment but here are some questions to get you started",
        ),
        activeTarget: document.querySelector(".tab-btn.active")?.dataset.tabTarget,
        authoringButtons: Boolean(
          document.querySelector("#tab-plaground, #tab-doc-editor"),
        ),
        authoringPanels: Boolean(
          document.querySelector("#panel-plaground, #panel-doc-editor"),
        ),
        editorToolbars: document.querySelectorAll(".generated-editor-toolbar")
          .length,
        generatedPanels: document.querySelectorAll(".tab-panel.generated-tab")
          .length,
      };
    });

    if (
      result.target !== "github-pages" ||
      result.labels.join("|") !== expectedPublishedTabLabels.join("|") ||
      result.publicTargets.length !== result.labels.length ||
      result.publicTargets.some((target) => !target) ||
      result.activeTarget !== result.publicTargets[0] ||
      result.authoringButtons ||
      result.authoringPanels ||
      result.editorToolbars !== 0 ||
      result.generatedPanels !== result.publicTargets.length ||
      result.whatsThisTargets.length !== expectedPublishedTabLabels.length - 1 ||
      result.whatsThisTargets.includes(result.publicTargets[0]) ||
      !result.oneQubitLastSceneHasMarker ||
      result.oneQubitLastSceneHasClue ||
      !result.entanglementOneLastSceneHasMarker ||
      result.entanglementOneLastSceneHasOldText ||
      (result.labels[0] === "Introduction" &&
        result.landingButtonLabels.some((label) =>
          ["Reset", "What's this?"].includes(label),
        ))
    ) {
      throw new Error(`GitHub Pages smoke failed: ${JSON.stringify(result)}`);
    }

    const targetForLabel = (label) =>
      result.publicTargets[result.labels.indexOf(label)] || "";
    const entanglementTwoTarget = targetForLabel("Entanglement 2");
    if (!entanglementTwoTarget) {
      throw new Error("GitHub Pages smoke failed: missing Entanglement 2 tab");
    }
    await page.locator(`#tab-${entanglementTwoTarget}`).click();
    await page.waitForSelector(
      `#panel-${entanglementTwoTarget} .generated-layout-canvas`,
    );
    const entanglementTwoMeasurement = await page.evaluate((target) => {
      const panel = document.getElementById(`panel-${target}`);
      const measurement = panel?.querySelector(
        '[data-component="component-group"][data-separated-pair-measurement="true"]',
      );
      return {
        hasMeasurement: Boolean(measurement),
        magnifierCount:
          measurement?.querySelectorAll(
            '.saved-group-child[data-component="single-magnifier"] [data-role="measurement-tool"]',
          ).length || 0,
        tubeCount:
          measurement?.querySelectorAll(".pair-tube-column[data-key]").length ||
          0,
        fallbackText:
          measurement?.textContent?.includes("Saved group") || false,
      };
    }, entanglementTwoTarget);
    if (
      !entanglementTwoMeasurement.hasMeasurement ||
      entanglementTwoMeasurement.magnifierCount < 1 ||
      entanglementTwoMeasurement.tubeCount !== 4 ||
      entanglementTwoMeasurement.fallbackText
    ) {
      throw new Error(
        `GitHub Pages Entanglement 2 measurement missing: ${JSON.stringify(entanglementTwoMeasurement)}`,
      );
    }

    const oneQubitTarget = targetForLabel("One qubit");
    if (!oneQubitTarget) {
      throw new Error("GitHub Pages smoke failed: missing One qubit tab");
    }
    await page.locator(`#tab-${oneQubitTarget}`).click();
    await page
      .locator(
        `#panel-${oneQubitTarget} [data-generated-document-action="whats-this"]`,
      )
      .click();
    await page.waitForSelector(
      `#panel-${oneQubitTarget} .doc-runtime-canvas [data-component="text-box"]`,
    );
    const runtimeTextBoxState = await page.evaluate((target) => {
      const panel = document.getElementById(`panel-${target}`);
      const body = panel?.querySelector(
        '.doc-runtime-canvas [data-component="text-box"] [data-role="text-box-body"]',
      );
      return {
        found: Boolean(body),
        editable: body?.isContentEditable || false,
        text: body?.textContent || "",
      };
    }, oneQubitTarget);
    if (!runtimeTextBoxState.found || runtimeTextBoxState.editable) {
      throw new Error(
        `GitHub Pages What's this text box editability failed: ${JSON.stringify(runtimeTextBoxState)}`,
      );
    }
    if (errors.length > 0) {
      throw new Error(`Browser errors: ${errors.join(" | ")}`);
    }
    return result;
  } finally {
    await browser.close();
  }
}

(async () => {
  const { server, baseUrl } = await startServer();
  try {
    const result = await runSmoke(baseUrl);
    console.log(JSON.stringify({ ok: true, ...result }, null, 2));
  } finally {
    await closeServer(server);
  }
})().catch((error) => {
  console.error(error.stack || error.message || String(error));
  process.exit(1);
});

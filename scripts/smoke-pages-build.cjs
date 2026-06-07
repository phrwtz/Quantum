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
      (result.labels[0] === "Introduction" &&
        result.landingButtonLabels.some((label) =>
          ["Reset", "What's this?"].includes(label),
        ))
    ) {
      throw new Error(`GitHub Pages smoke failed: ${JSON.stringify(result)}`);
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

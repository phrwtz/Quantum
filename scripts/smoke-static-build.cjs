const fs = require("node:fs");
const fsp = require("node:fs/promises");
const http = require("node:http");
const path = require("node:path");
const { chromium } = require("playwright");

const rootDir = path.resolve(__dirname, "..");
const distDir = path.join(rootDir, "dist");
const expectedTabLabels = [
  "Editor",
  "Doc Editor",
  "Local Lab",
  "Introduction",
  "One qubit",
  "Two qubits",
  "Entanglement 1",
  "Entanglement 2",
  "Entanglement 3",
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
        const location = message.location();
        errors.push(
          [message.text(), location?.url, location?.lineNumber]
            .filter((value) => value !== undefined && value !== "")
            .join(" @ "),
        );
      }
    });

    await page.goto(`${baseUrl}/index.html`, { waitUntil: "domcontentloaded" });
    await page.waitForSelector(".tab-btn.generated-tab-btn", {
      state: "attached",
    });

    const wideMagnifierResponse = await page.request.get(
      `${baseUrl}/Wide%20magnifying%20glass%20transparent.png`,
    );
    if (!wideMagnifierResponse.ok()) {
      throw new Error(
        `Wide magnifier asset missing: ${wideMagnifierResponse.status()}`,
      );
    }

    const initial = await page.evaluate(() => {
      const labels = Array.from(document.querySelectorAll(".tab-btn")).map(
        (button) => button.textContent.trim(),
      );
      const landingPanel = document.querySelector(
        "#panel-editor-introduction:not([hidden])",
      );
      const tabStrip = document.querySelector(".tab-strip");
      const landingHero = landingPanel?.querySelector(".landing-hero");
      const landingHeroStyle = landingHero
        ? window.getComputedStyle(landingHero)
        : null;
      return {
        labels,
        activeTarget:
          document.querySelector(".tab-btn.active")?.dataset.tabTarget || "",
        contentVersion:
          document.documentElement.dataset.quantumContentVersion || "",
        authoringButtons: Boolean(
          document.querySelector("#tab-plaground") &&
            document.querySelector("#tab-doc-editor"),
        ),
        authoringPanels: Boolean(
          document.querySelector("#panel-plaground") &&
            document.querySelector("#panel-doc-editor"),
        ),
        editorHidden:
          getComputedStyle(document.querySelector("#panel-plaground")).display ===
          "none",
        topTabsVisible: Boolean(
          tabStrip &&
            window.getComputedStyle(tabStrip).display !== "none" &&
            tabStrip.getClientRects().length > 0,
        ),
        landingHeroVisible: Boolean(
          landingHero && landingHero.getClientRects().length > 0,
        ),
        landingHeroHasGraphic: Boolean(
          landingHeroStyle?.backgroundImage?.includes("landing-lab-hero.png"),
        ),
        landingTourSignText:
          landingPanel
            ?.querySelector(".landing-tour-sign .landing-sign-label")
            ?.textContent?.trim() || "",
      };
    });

    if (
      initial.labels.join("|") !== expectedTabLabels.join("|") ||
      initial.activeTarget !== "editor-introduction" ||
      !initial.contentVersion ||
      !initial.authoringButtons ||
      !initial.authoringPanels ||
      !initial.editorHidden ||
      initial.topTabsVisible ||
      !initial.landingHeroVisible ||
      !initial.landingHeroHasGraphic ||
      initial.landingTourSignText !== "To the Tour"
    ) {
      throw new Error(`Static site initial state failed: ${JSON.stringify(initial)}`);
    }

    await page.locator("#panel-editor-introduction .landing-workshop-sign").click();
    await page.waitForSelector("#workshopPasswordOverlay:not([hidden])");
    await page.locator("#workshopPasswordInput").fill("142857");
    await page.locator("#workshopPasswordForm").evaluate((form) => {
      form.requestSubmit();
    });
    await page.waitForFunction(() => {
      const panel = document.querySelector("#panel-plaground");
      return (
        panel &&
        !panel.hidden &&
        getComputedStyle(panel).display !== "none" &&
        document.body.classList.contains("workshop-unlocked")
      );
    });

    const workshop = await page.evaluate(() => ({
      activeTab: document.querySelector(".tab-btn.active")?.dataset.tabTarget || "",
      mode: document.documentElement.dataset.workshopEditorMode || "",
      hasCanvas: Boolean(document.querySelector("#playgroundCanvas")),
      hasTabControls: Boolean(document.querySelector("#editorNewTabButton")),
      hasComponentMode: Boolean(
        document.querySelector("[data-workshop-mode='component']"),
      ),
      hasDocMode: Boolean(
        document.querySelector("[data-workshop-mode='whats-this']"),
      ),
    }));
    if (
      workshop.activeTab !== "plaground" ||
      workshop.mode !== "tab" ||
      !workshop.hasCanvas ||
      !workshop.hasTabControls ||
      !workshop.hasComponentMode ||
      !workshop.hasDocMode
    ) {
      throw new Error(`Workshop did not open editors: ${JSON.stringify(workshop)}`);
    }

    await page.locator("#panel-plaground [data-workshop-mode='component']").click();
    const componentState = await page.evaluate(() => ({
      activeTab: document.querySelector(".tab-btn.active")?.dataset.tabTarget || "",
      mode: document.documentElement.dataset.workshopEditorMode || "",
    }));
    if (
      componentState.activeTab !== "plaground" ||
      componentState.mode !== "component"
    ) {
      throw new Error(
        `Workshop component mode failed: ${JSON.stringify(componentState)}`,
      );
    }

    await page.locator("#panel-plaground [data-workshop-mode='whats-this']").click();
    const docState = await page.evaluate(() => ({
      activeTab: document.querySelector(".tab-btn.active")?.dataset.tabTarget || "",
      mode: document.documentElement.dataset.workshopEditorMode || "",
      docEditorVisible:
        getComputedStyle(document.querySelector("#panel-doc-editor")).display !==
          "none" && !document.querySelector("#panel-doc-editor").hidden,
    }));
    if (
      docState.activeTab !== "doc-editor" ||
      docState.mode !== "whats-this" ||
      !docState.docEditorVisible
    ) {
      throw new Error(`Workshop Doc Editor mode failed: ${JSON.stringify(docState)}`);
    }

    if (errors.length > 0) {
      throw new Error(`Browser errors: ${errors.join(" | ")}`);
    }
    return initial;
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

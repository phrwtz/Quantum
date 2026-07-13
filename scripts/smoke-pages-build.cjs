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
  "Entanglement 3",
];
const expectedRenderTabLabels = [
  "Editor",
  "Doc Editor",
  "Local Lab",
  ...expectedPublishedTabLabels,
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
    const isRenderTarget = process.argv.includes("--render-target");
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

    const result = await page.evaluate(() => {
      const labels = Array.from(document.querySelectorAll(".tab-btn")).map(
        (button) => button.textContent.trim(),
      );
      const publicTargets = Array.from(document.querySelectorAll(".tab-btn")).map(
        (button) => button.dataset.tabTarget || "",
      );
      const activeTarget =
        document.querySelector(".tab-btn.active")?.dataset.tabTarget || "";
      const landingPanel = activeTarget
        ? document.getElementById(`panel-${activeTarget}`)
        : null;
      const landingButtonLabels = Array.from(
        landingPanel?.querySelectorAll(
          ".landing-tab-links .landing-tab-link",
        ) || [],
      ).map((button) => button.textContent.trim());
      const landingTourSignText =
        landingPanel
          ?.querySelector(".landing-tour-sign .landing-sign-label")
          ?.textContent?.trim() || "";
      const landingClosedSignText =
        landingPanel
          ?.querySelector(".landing-lab-sign-closed")
          ?.textContent?.trim() || "";
      const landingAboutText =
        landingPanel
          ?.querySelector(".landing-about-link")
          ?.textContent?.trim() || "";
      const tabStrip = document.querySelector(".tab-strip");
      const landingHero = landingPanel?.querySelector(".landing-hero");
      const landingHeroStyle = landingHero
        ? window.getComputedStyle(landingHero)
        : null;
      const whatsThisTargets = publicTargets.filter((target) =>
        Boolean(
          document
            .getElementById(`panel-${target}`)
            ?.querySelector("[data-generated-document-action='whats-this']"),
        ),
      );
      const repositoryFiles =
        window.__QUANTUM_REPOSITORY_CONTENT__?.files || {};
      const docs = repositoryFiles["data/whats-this-documents.json"] || {
        documents: [],
      };
      const auditCnotLayouts = () => {
        const bad = [];
        const counts = {};
        const inspect = (source, node, path = []) => {
          if (!node || typeof node !== "object") {
            return;
          }
          if (node.type === "cnot-gate" && node.cnotLayout) {
            counts[source] = (counts[source] || 0) + 1;
            const body = node.cnotLayout.body || {};
            const bottom = node.cnotLayout.funnelBottom || {};
            const bodyStyle = body.inlineStyle || {};
            const bottomStyle = bottom.inlineStyle || {};
            const staleBody =
              body.tx !== 10 ||
              body.ty !== 3 ||
              bodyStyle.right !== "22px" ||
              bodyStyle.translate !== "10px 3px";
            const staleBottom =
              bottom.tx !== 14 ||
              bottom.ty !== -33 ||
              bottom.width !== "63px" ||
              bottom.height !== "94px" ||
              bottomStyle.width !== "63px" ||
              bottomStyle.height !== "94px" ||
              bottomStyle.translate !== "14px -33px";
            if (staleBody || staleBottom) {
              bad.push({
                source,
                path: path.join("."),
                id: node.id || "",
                body: {
                  tx: body.tx,
                  ty: body.ty,
                  right: bodyStyle.right,
                  translate: bodyStyle.translate,
                },
                bottom: {
                  tx: bottom.tx,
                  ty: bottom.ty,
                  width: bottom.width,
                  height: bottom.height,
                  translate: bottomStyle.translate,
                },
              });
            }
          }
          if (Array.isArray(node)) {
            node.forEach((child, index) =>
              inspect(source, child, path.concat(index)),
            );
            return;
          }
          Object.entries(node).forEach(([key, child]) =>
            inspect(source, child, path.concat(key)),
          );
        };
        inspect("generated-tabs", repositoryFiles["data/generated-tabs.json"]);
        inspect("whats-this-documents", docs);
        return { bad, counts };
      };
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
        landingTourSignText,
        landingClosedSignText,
        landingAboutText,
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
        whatsThisTargets,
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
        cnotLayoutAudit: auditCnotLayouts(),
        activeTarget,
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

    if (isRenderTarget) {
      if (
        result.target !== "render" ||
        result.labels.join("|") !== expectedRenderTabLabels.join("|") ||
        !result.authoringButtons ||
        !result.authoringPanels ||
        result.generatedPanels !== expectedPublishedTabLabels.length ||
        result.topTabsVisible ||
        result.landingTourSignText !== "To the Tour" ||
        result.landingClosedSignText !== "Closed"
      ) {
        throw new Error(`Render static smoke failed: ${JSON.stringify(result)}`);
      }

      await page
        .locator("#panel-editor-introduction .landing-workshop-sign")
        .click();
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
      const workshopState = await page.evaluate(() => ({
        activeTab:
          document.querySelector(".tab-btn.active")?.dataset.tabTarget || "",
        mode: document.documentElement.dataset.workshopEditorMode || "",
        editorVisible:
          getComputedStyle(document.querySelector("#panel-plaground")).display !==
          "none",
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
        workshopState.activeTab !== "plaground" ||
        workshopState.mode !== "tab" ||
        !workshopState.editorVisible ||
        !workshopState.hasCanvas ||
        !workshopState.hasTabControls ||
        !workshopState.hasComponentMode ||
        !workshopState.hasDocMode
      ) {
        throw new Error(
          `Render Workshop did not open editors: ${JSON.stringify(workshopState)}`,
        );
      }

      await page.locator("#panel-plaground [data-workshop-mode='component']").click();
      const componentState = await page.evaluate(() => ({
        activeTab:
          document.querySelector(".tab-btn.active")?.dataset.tabTarget || "",
        mode: document.documentElement.dataset.workshopEditorMode || "",
      }));
      if (
        componentState.activeTab !== "plaground" ||
        componentState.mode !== "component"
      ) {
        throw new Error(
          `Render Workshop component mode failed: ${JSON.stringify(componentState)}`,
        );
      }

      await page.locator("#panel-plaground [data-workshop-mode='whats-this']").click();
      const docState = await page.evaluate(() => ({
        activeTab:
          document.querySelector(".tab-btn.active")?.dataset.tabTarget || "",
        mode: document.documentElement.dataset.workshopEditorMode || "",
        docEditorVisible:
          getComputedStyle(document.querySelector("#panel-doc-editor")).display !==
          "none" &&
          !document.querySelector("#panel-doc-editor").hidden,
      }));
      if (
        docState.activeTab !== "doc-editor" ||
        docState.mode !== "whats-this" ||
        !docState.docEditorVisible
      ) {
        throw new Error(
          `Render Workshop Doc Editor mode failed: ${JSON.stringify(docState)}`,
        );
      }

      if (errors.length > 0) {
        throw new Error(`Browser errors: ${errors.join(" | ")}`);
      }
      return result;
    }

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
      result.topTabsVisible ||
      !result.landingHeroVisible ||
      !result.landingHeroHasGraphic ||
      result.whatsThisTargets.length !== expectedPublishedTabLabels.length - 1 ||
      result.whatsThisTargets.includes(result.publicTargets[0]) ||
      !result.oneQubitLastSceneHasMarker ||
      !result.oneQubitLastSceneHasEnding ||
      result.oneQubitLastSceneHasClue ||
      !result.entanglementOneLastSceneHasMarker ||
      result.entanglementOneLastSceneHasOldText ||
      result.cnotLayoutAudit.bad.length > 0 ||
      result.landingButtonLabels.length !== 0 ||
      result.landingTourSignText !== "To the Tour" ||
      result.landingClosedSignText !== "Closed" ||
      result.landingAboutText !== ""
    ) {
      throw new Error(`GitHub Pages smoke failed: ${JSON.stringify(result)}`);
    }

    const targetForLabel = (label) =>
      result.publicTargets[result.labels.indexOf(label)] || "";
    const tourStyleState = await page.evaluate((targets) => {
      const backgrounds = targets.map((target) => {
        const canvas = document.querySelector(
          `#panel-${CSS.escape(target)} .generated-layout-viewport > .generated-layout-canvas:not(.doc-runtime-canvas):not(.doc-editor-canvas)`,
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
      const oneQubitTarget = targets[0] || "";
      const resetButton = document.querySelector(
        `#panel-${CSS.escape(oneQubitTarget)} [data-generated-experiment-action='reset']`,
      );
      const whatsThisButton = document.querySelector(
        `#panel-${CSS.escape(oneQubitTarget)} [data-generated-document-action='whats-this']`,
      );
      const status = document.querySelector(
        `#panel-${CSS.escape(oneQubitTarget)} .generated-experiment-status`,
      );
      const fontSizeOf = (element) =>
        element ? Number.parseFloat(getComputedStyle(element).fontSize) : null;
      const statusFont = fontSizeOf(status);
      const resetFont = fontSizeOf(resetButton);
      const whatsThisFont = fontSizeOf(whatsThisButton);
      return {
        targets,
        paleGreen:
          backgrounds.length === targets.length &&
          backgrounds.every(
            (background) =>
              background?.backgroundColor === "rgb(230, 255, 204)" &&
              background?.backgroundImage === "none",
          ),
        statusMatchesButtonFonts:
          Number.isFinite(statusFont) &&
          Number.isFinite(resetFont) &&
          Number.isFinite(whatsThisFont) &&
          Math.abs(statusFont - resetFont) < 0.01 &&
          Math.abs(statusFont - whatsThisFont) < 0.01,
      };
    }, [
      targetForLabel("One qubit"),
      targetForLabel("Two qubits"),
      targetForLabel("Entanglement 1"),
      targetForLabel("Entanglement 2"),
      targetForLabel("Entanglement 3"),
    ]);
    if (
      tourStyleState.targets.some((target) => !target) ||
      !tourStyleState.paleGreen ||
      !tourStyleState.statusMatchesButtonFonts
    ) {
      throw new Error(
        `GitHub Pages tour styling failed: ${JSON.stringify(tourStyleState)}`,
      );
    }
    const entanglementTwoTarget = targetForLabel("Entanglement 2");
    if (!entanglementTwoTarget) {
      throw new Error("GitHub Pages smoke failed: missing Entanglement 2 tab");
    }
    await page.evaluate((target) => {
      document
        .querySelector(`#tab-${CSS.escape(target)}`)
        ?.click();
    }, entanglementTwoTarget);
    await page.waitForSelector(
      `#panel-${entanglementTwoTarget} .generated-layout-canvas`,
    );
    const experimentNavState = await page.evaluate((target) => {
      const tabStrip = document.querySelector(".tab-strip");
      return {
        activeTarget: document.querySelector(".tab-btn.active")?.dataset.tabTarget,
        topTabsVisible: Boolean(
          tabStrip &&
            window.getComputedStyle(tabStrip).display !== "none" &&
            tabStrip.getClientRects().length > 0,
        ),
        activeDataset: document.documentElement.dataset.activeTabTarget || "",
        experimentClass: document.documentElement.classList.contains(
          "github-pages-experiment-active",
        ),
        expectedTarget: target,
      };
    }, entanglementTwoTarget);
    if (
      experimentNavState.activeTarget !== entanglementTwoTarget ||
      experimentNavState.activeDataset !== entanglementTwoTarget ||
      !experimentNavState.topTabsVisible ||
      !experimentNavState.experimentClass
    ) {
      throw new Error(
        `GitHub Pages landing navigation failed: ${JSON.stringify(experimentNavState)}`,
      );
    }
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
      const reset = panel?.querySelector(
        '[data-generated-experiment-action="reset"]',
      );
      return {
        found: Boolean(body),
        editable: body?.isContentEditable || false,
        text: body?.textContent || "",
        resetLabel: reset?.textContent?.trim() || "",
        whatsThisButtons:
          panel?.querySelectorAll('[data-generated-document-action="whats-this"]')
            .length || 0,
      };
    }, oneQubitTarget);
    if (
      !runtimeTextBoxState.found ||
      runtimeTextBoxState.editable ||
      runtimeTextBoxState.resetLabel !== "Back to the One qubit tab" ||
      runtimeTextBoxState.whatsThisButtons !== 0
    ) {
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

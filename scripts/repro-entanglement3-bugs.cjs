const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const { chromium } = require("playwright");
const { createServer: createBackendServer } = require("../backend/server.cjs");

const rootDir = path.resolve(__dirname, "..");
const DEFAULT_TARGET_URL = "https://qubit-lab-vawa.onrender.com/";
const targetUrl = process.env.ENTANGLEMENT3_REPRO_URL || DEFAULT_TARGET_URL;
const configuredBackendUrl = process.env.ENTANGLEMENT3_REPRO_BACKEND_URL || "";

async function deployedFrontendHtml() {
  const response = await fetch(targetUrl);
  assert.equal(
    response.status,
    200,
    `${targetUrl} should serve the deployed frontend HTML`,
  );
  return response.text();
}

function backendUrlFromHtml(html) {
  const match = String(html || "").match(
    /window\.QUANTUM_BACKEND_URL\s*=\s*(["'])(.*?)\1/,
  );
  return match ? match[2] : "";
}

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(rootDir, relativePath), "utf8"));
}

function entanglementThreeTabFromState(state) {
  const tab = (state.tabs || []).find((entry) => entry.id === "editor-entanglement-3");
  assert.ok(tab, "editor-entanglement-3 tab must exist");
  return tab;
}

function itemById(tab, itemId) {
  const item = (tab.layout?.items || []).find((entry) => entry.id === itemId);
  assert.ok(item, `${itemId} must exist in editor-entanglement-3`);
  return item;
}

function assertEntanglementThreeLayoutIsNotKnownStale(state, sourceLabel) {
  const tab = entanglementThreeTabFromState(state);
  const mailbox = itemById(tab, "entanglement-3-mailbox");
  const measurement = itemById(tab, "entanglement-3-register-measurement");
  const layoutItems = Array.isArray(tab.layout?.items) ? tab.layout.items : [];
  const singleGateCount = layoutItems.filter(
    (entry) => entry?.type === "single-gate",
  ).length;
  const cnotGateCount = layoutItems.filter(
    (entry) => entry?.type === "cnot-gate",
  ).length;
  const problems = [];
  const mailboxGeometry = {
    left: mailbox.left,
    top: mailbox.top,
    width: mailbox.width,
    height: mailbox.height,
  };
  const measurementGeometry = {
    left: measurement.left,
    top: measurement.top,
    width: measurement.width,
    height: measurement.height,
  };

  if (
    JSON.stringify(mailboxGeometry) ===
    JSON.stringify({ left: 510, top: 250, width: 240, height: 180 })
  ) {
    problems.push(
      `mailbox is still at stale geometry ${JSON.stringify(mailboxGeometry)}`,
    );
  }

  if (
    JSON.stringify(measurementGeometry) ===
    JSON.stringify({ left: 640, top: 150, width: 920, height: 438 })
  ) {
    problems.push(
      `four-qubit measurement is still at stale geometry ${JSON.stringify(measurementGeometry)}`,
    );
  }

  if (!Array.isArray(measurement.items) || measurement.items.length === 0) {
    problems.push(
      "four-qubit measurement has no saved child geometry, so deployed builds fall back to the cramped default group",
    );
  }

  const tubeRack = (measurement.items || []).find(
    (entry) => entry.type === "quadruple-tube-array",
  );
  if (!tubeRack || Number(tubeRack.width) < 900 || Number(tubeRack.height) < 200) {
    problems.push(
      `sixteen-tube rack geometry is missing or too small: ${JSON.stringify(tubeRack || null)}`,
    );
  }

  if (singleGateCount !== 1 || cnotGateCount !== 1) {
    problems.push(
      `apparatus should have one flipper and one C-NOT, found ${singleGateCount} single-gate and ${cnotGateCount} cnot-gate items`,
    );
  }

  assert.deepEqual(problems, [], `${sourceLabel}: stale Entanglement 3 layout`);
}

async function openEntanglementThreePage(
  browser,
  url,
  { backendUrl = configuredBackendUrl, waitForRoom = true } = {},
) {
  const context = await browser.newContext({
    viewport: { width: 1600, height: 900 },
  });
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") {
      const text = message.text();
      if (!/^Failed to load resource:/.test(text)) {
        errors.push(text);
      }
    }
  });

  const cacheBustUrl = new URL(url);
  cacheBustUrl.searchParams.set("ent3Repro", Date.now().toString(36));
  if (backendUrl && !cacheBustUrl.searchParams.has("backend")) {
    cacheBustUrl.searchParams.set("backend", backendUrl);
  }
  await page.goto(cacheBustUrl.href, { waitUntil: "domcontentloaded" });
  await page.waitForSelector("#panel-editor-introduction .landing-tour-sign", {
    timeout: 20000,
  });
  await page.locator("#panel-editor-introduction .landing-tour-sign").click();
  await page.locator("#tab-editor-entanglement-3").click({ force: true });
  await page.waitForSelector(
    "#panel-editor-entanglement-3:not([hidden]) .generated-layout-canvas",
    { timeout: 20000 },
  );
  if (waitForRoom) {
    try {
      await page.waitForFunction(
        () =>
          document
            .querySelector("#panel-editor-entanglement-3 .generated-experiment-status")
            ?.textContent?.includes("room send-receive-room"),
        null,
        { timeout: 60000 },
      );
    } catch (error) {
      const debug = await page.evaluate(() => ({
        status:
          document.querySelector(
            "#panel-editor-entanglement-3 .generated-experiment-status",
          )?.textContent || "",
        configuredBackend:
          typeof window.localLabBackendBaseUrl === "function"
            ? window.localLabBackendBaseUrl()
            : "",
        backendInput: document.querySelector("#localLabBackendUrl")?.value || "",
        location: window.location.href,
      }));
      throw new Error(
        `Entanglement 3 did not join send-receive-room: ${JSON.stringify(debug)}; ${error.message}`,
      );
    }
  }
  return { context, page, errors };
}

function startLocalBackendServer() {
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

function closeServer(server) {
  return new Promise((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  });
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForMailboxEvent(page, message, timeoutMs = 10000) {
  const deadline = Date.now() + timeoutMs;
  let latest = null;
  while (Date.now() < deadline) {
    latest = await page.evaluate(async (sendMessage) => {
      await mailboxRoomRefresh({ render: false });
      const matchingEvents = mailboxRoomVisibleEvents().filter(
        (event) =>
          event?.type === "roomMailbox.sent" &&
          event.payload?.message === sendMessage,
      );
      const event = matchingEvents.at(-1) || null;
      return {
        count: matchingEvents.length,
        eventId: event?.id || "",
      };
    }, message);
    if (latest.count === 1 && latest.eventId) {
      return latest;
    }
    await wait(150);
  }
  throw new Error(
    `Timed out waiting for one visible mailbox event for ${message}: ${JSON.stringify(latest)}`,
  );
}

test("repository Entanglement 3 layout is not the known stale deployed layout", () => {
  assertEntanglementThreeLayoutIsNotKnownStale(
    readJson("data/generated-tabs.json"),
    "data/generated-tabs.json",
  );
});

test("bundled repository content is not serving stale Entanglement 3 layout", () => {
  const bundleText = fs.readFileSync(
    path.join(rootDir, "data", "repository-content.js"),
    "utf8",
  );
  const match = bundleText.match(/files:\s*(\{.*\}),\s*\n/s);
  assert.ok(match, "data/repository-content.js must contain bundled files");
  const files = JSON.parse(match[1]);
  assertEntanglementThreeLayoutIsNotKnownStale(
    files["data/generated-tabs.json"],
    "data/repository-content.js",
  );
});

test("deployed Entanglement 3 layout is not the known stale file layout", async () => {
  const browser = await chromium.launch({ headless: true });
  try {
    const { context, page, errors } = await openEntanglementThreePage(
      browser,
      targetUrl,
      { waitForRoom: false },
    );
    try {
      const deployedState = await page.evaluate(() => {
        const files = window.__QUANTUM_REPOSITORY_CONTENT__?.files || {};
        return files["data/generated-tabs.json"] || null;
      });
      assert.ok(deployedState, "deployed page must expose bundled generated-tabs content");
      assertEntanglementThreeLayoutIsNotKnownStale(deployedState, targetUrl);
      assert.deepEqual(errors, [], "deployed page should not log browser errors");
    } finally {
      await context.close();
    }
  } finally {
    await browser.close();
  }
});

test("deployed frontend has a usable backend URL", async (t) => {
  const html = await deployedFrontendHtml();
  const deployedBackendUrl = backendUrlFromHtml(html);
  if (deployedBackendUrl === "__PUBLIC_BACKEND_URL__") {
    const targetHost = new URL(targetUrl).hostname;
    if (targetHost === "127.0.0.1" || targetHost === "localhost") {
      t.skip("local HTML keeps the deploy-time backend placeholder");
      return;
    }
  }
  assert.ok(
    deployedBackendUrl,
    "deployed frontend should inject PUBLIC_BACKEND_URL",
  );
  assert.notEqual(
    new URL(deployedBackendUrl).origin,
    new URL(targetUrl).origin,
    `PUBLIC_BACKEND_URL points back at the frontend instead of qubit-lab-backend: ${deployedBackendUrl}`,
  );
  const response = await fetch(new URL("/health", deployedBackendUrl));
  assert.equal(
    response.status,
    200,
    `backend health check should pass for ${deployedBackendUrl}`,
  );
});

test("hard-fresh deployed frontend tabs do not create duplicate mailbox send events", async (t) => {
  let backend = null;
  if (configuredBackendUrl) {
    backend = { server: null, baseUrl: configuredBackendUrl };
  } else if (new URL(targetUrl).protocol === "http:") {
    backend = await startLocalBackendServer();
  } else {
    t.skip(
      "Set ENTANGLEMENT3_REPRO_BACKEND_URL to the actual HTTPS backend URL to run the deployed duplicate-send repro",
    );
    return;
  }

  const browser = await chromium.launch({ headless: true });
  let bob = null;
  let alice = null;
  try {
    bob = await openEntanglementThreePage(browser, targetUrl, {
      backendUrl: backend.baseUrl,
    });
    alice = await openEntanglementThreePage(browser, targetUrl, {
      backendUrl: backend.baseUrl,
    });

    const participants = await Promise.all([
      bob.page.evaluate(() => mailboxRoomState.displayName),
      alice.page.evaluate(() => mailboxRoomState.displayName),
    ]);
    assert.deepEqual(
      participants.slice().sort(),
      ["Alice", "Bob"],
      "two hard-fresh pages should auto-join as Bob and Alice",
    );

    const bobPage = participants[0] === "Bob" ? bob.page : alice.page;
    const alicePage = participants[0] === "Bob" ? alice.page : bob.page;
    const message = `duplicate-send-repro-${Date.now().toString(36)}`;

    const sendResult = await bobPage.evaluate(async (sendMessage) => {
      const panel = document.querySelector("#panel-editor-entanglement-3");
      const mailboxItem = panel?.querySelector('[data-component="mailbox"]');
      const qubitItem = panel?.querySelector(
        '[data-generated-item-id="entanglement-3-q0"]',
      );
      if (!(mailboxItem instanceof HTMLElement)) {
        throw new Error("mailbox item missing");
      }
      if (!(qubitItem instanceof HTMLElement)) {
        throw new Error("q0 missing");
      }
      const context = { mailboxItem, qubitItem, qubitIndex: 0 };
      const results = await Promise.allSettled([
        mailboxRoomSendQubit(context, {
          toParticipantId: "",
          message: sendMessage,
        }),
        mailboxRoomSendQubit(context, {
          toParticipantId: "",
          message: sendMessage,
        }),
      ]);
      await mailboxRoomRefresh({ render: false });
      return {
        results: results.map((entry) => ({
          status: entry.status,
          value: entry.status === "fulfilled" ? entry.value : null,
          reason: entry.status === "rejected" ? String(entry.reason) : null,
        })),
        matchingEvents: mailboxRoomVisibleEvents().filter(
          (event) =>
            event?.type === "roomMailbox.sent" &&
            event.payload?.message === sendMessage,
        ).length,
      };
    }, message);

    assert.equal(
      sendResult.matchingEvents,
      1,
      `concurrent sends of the same q0 should create exactly one mailbox event: ${JSON.stringify(sendResult)}`,
    );

    const aliceEvent = await waitForMailboxEvent(alicePage, message);
    const receiveResult = await alicePage.evaluate((sendMessage) => {
      const event = mailboxRoomVisibleEvents()
        .slice()
        .reverse()
        .find(
          (entry) =>
            entry?.type === "roomMailbox.sent" &&
            entry.payload?.message === sendMessage,
        );
      if (!event) {
        throw new Error("sent event should be visible to recipient");
      }
      mailboxRoomReceiveQubitEvent(event);
      mailboxRoomReceiveQubitEvent(event);
      return {
        eventId: event.id,
        receivedItems: document.querySelectorAll(
          `[data-mailbox-received-event-id="${CSS.escape(event.id)}"]`,
        ).length,
      };
    }, message);

    assert.equal(
      receiveResult.eventId,
      aliceEvent.eventId,
      `recipient should receive the same event it waited for: ${JSON.stringify({ aliceEvent, receiveResult })}`,
    );
    assert.equal(
      receiveResult.receivedItems,
      1,
      `receiving the same mailbox event twice should create one qubit: ${JSON.stringify(receiveResult)}`,
    );
    assert.deepEqual(
      [...bob.errors, ...alice.errors],
      [],
      "duplicate-send repro should not log browser errors",
    );
  } finally {
    await bob?.context.close();
    await alice?.context.close();
    await browser.close();
    if (backend.server) {
      await closeServer(backend.server);
    }
  }
});

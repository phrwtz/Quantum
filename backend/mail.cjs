"use strict";

const DEFAULT_RESEND_ENDPOINT = "https://api.resend.com/emails";

function cleanString(value) {
  return typeof value === "string" ? value.trim() : "";
}

function mailConfigFromEnv(env = process.env) {
  const provider =
    cleanString(env.MAIL_DELIVERY_PROVIDER) ||
    (cleanString(env.RESEND_API_KEY) ? "resend" : "local");
  return {
    provider: provider.toLowerCase(),
    resendApiKey: cleanString(env.RESEND_API_KEY),
    resendEndpoint: cleanString(env.RESEND_API_URL) || DEFAULT_RESEND_ENDPOINT,
    from: cleanString(env.MAIL_FROM),
    replyTo: cleanString(env.MAIL_REPLY_TO),
    timeoutMs: Number.parseInt(env.MAIL_SEND_TIMEOUT_MS || "10000", 10),
  };
}

function isResendConfigured(config) {
  return (
    config?.provider === "resend" &&
    Boolean(config.resendApiKey) &&
    Boolean(config.from)
  );
}

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function textToHtml(text) {
  return `<p>${escapeHtml(text).replaceAll("\n", "<br>")}</p>`;
}

async function readResponseBody(response) {
  const text = await response.text();
  if (!text.trim()) {
    return {};
  }
  try {
    return JSON.parse(text);
  } catch (_error) {
    return { message: text };
  }
}

function deliveryFailureForError(delivery, error, provider = "resend") {
  return {
    ...delivery,
    status: "send-failed",
    provider,
    error: error?.message || String(error || "Unknown mail delivery error"),
    failedAt: new Date().toISOString(),
  };
}

async function sendWithResend(transfer, config, fetchImpl = global.fetch) {
  if (typeof fetchImpl !== "function") {
    throw new Error("fetch is unavailable for mail delivery");
  }
  const delivery = transfer.delivery || {};
  const text = delivery.body || "A qubit is waiting for you in Qubit Lab.";
  const payload = {
    from: config.from,
    to: [transfer.email],
    subject: delivery.subject || "A qubit is waiting for you in Qubit Lab",
    text,
    html: textToHtml(text),
  };
  if (config.replyTo) {
    payload.reply_to = config.replyTo;
  }

  const controller = new AbortController();
  const timeoutMs = Number.isFinite(config.timeoutMs) ? config.timeoutMs : 10000;
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetchImpl(config.resendEndpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    const body = await readResponseBody(response);
    if (!response.ok) {
      throw new Error(
        body?.message ||
          body?.error ||
          `Resend mail delivery failed (${response.status})`,
      );
    }
    return {
      ...delivery,
      status: "sent",
      provider: "resend",
      providerMessageId: body.id || null,
      mailFrom: config.from,
      replyTo: config.replyTo || null,
      sentAt: new Date().toISOString(),
    };
  } finally {
    clearTimeout(timeout);
  }
}

function createMailboxMailer(options = {}) {
  const config = options.config || mailConfigFromEnv(options.env);
  const fetchImpl = options.fetchImpl || global.fetch;
  return {
    provider: config.provider,
    isConfigured() {
      return isResendConfigured(config);
    },
    async sendMailboxTransfer(transfer) {
      if (!isResendConfigured(config)) {
        return null;
      }
      return sendWithResend(transfer, config, fetchImpl);
    },
  };
}

module.exports = {
  createMailboxMailer,
  deliveryFailureForError,
  mailConfigFromEnv,
  sendWithResend,
};

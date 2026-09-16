import { contactMessages, type ContactStatus } from "@/data/contactMessages";

interface TurnstileOptions {
  sitekey: string;
  action: string;
  theme: "dark" | "light";
  language: "en" | "de";
  size: "flexible" | "compact";
  callback: (token: string) => void;
  "error-callback": () => boolean;
  "expired-callback": () => void;
  "timeout-callback": () => void;
}

interface Turnstile {
  render: (element: HTMLElement, options: TurnstileOptions) => string | undefined;
  reset: (id: string) => void;
  remove: (id: string) => void;
}

declare global {
  interface Window { turnstile?: Turnstile }
}

async function loadTurnstile(): Promise<Turnstile> {
  if (window.turnstile) return window.turnstile;
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    const timeout = window.setTimeout(() => {
      script.remove();
      reject(new Error("Verification script timed out"));
    }, 15_000);
    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
    script.async = true;
    script.onload = () => {
      window.clearTimeout(timeout);
      if (window.turnstile) resolve(window.turnstile);
      else reject(new Error("Verification API unavailable"));
    };
    script.onerror = () => {
      window.clearTimeout(timeout);
      script.remove();
      reject(new Error("Verification script unavailable"));
    };
    document.head.append(script);
  });
}

function initContactForm(form: HTMLFormElement) {
  const lang = form.dataset.lang === "de" ? "de" : "en";
  const copy = contactMessages[lang];
  const submit = form.querySelector<HTMLButtonElement>(".contact-submit")!;
  const verification = form.querySelector<HTMLElement>(".contact-verification")!;
  const widget = form.querySelector<HTMLElement>(".cf-turnstile")!;
  const verificationStatus = form.querySelector<HTMLElement>(".verification-status")!;
  const retry = form.querySelector<HTMLButtonElement>(".verification-retry")!;
  const statusCard = form.querySelector<HTMLElement>(".contact-status-card")!;
  const title = form.querySelector<HTMLElement>(".contact-status-title")!;
  const body = form.querySelector<HTMLElement>(".contact-status-body")!;
  const fields = form.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>(".contact-field input, .contact-field textarea");
  let token = "";
  let widgetId: string | undefined;
  let loading = false;
  let sending = false;
  let theme = document.documentElement.dataset.theme === "light" ? "light" as const : "dark" as const;
  let renderedTheme = theme;
  const widgetSize = () => widget.clientWidth < 300 ? "compact" as const : "flexible" as const;
  let renderedSize = widgetSize();

  const updateButton = () => { submit.disabled = sending || !token; };
  const showStatus = (state: ContactStatus) => {
    statusCard.hidden = false;
    statusCard.dataset.state = state;
    title.textContent = copy.statuses[state].title;
    body.textContent = copy.statuses[state].body;
  };
  const verificationFailed = (expired = false) => {
    token = "";
    verification.dataset.state = "error";
    verificationStatus.textContent = expired ? copy.verifyExpired : copy.verifyFailed;
    retry.hidden = false;
    updateButton();
    return true;
  };
  const clearVerification = () => {
    token = "";
    verification.dataset.state = "checking";
    verificationStatus.textContent = copy.checking;
    retry.hidden = true;
    updateButton();
  };
  const renderWidget = () => {
    clearVerification();
    renderedTheme = theme;
    renderedSize = widgetSize();
    widgetId = window.turnstile?.render(widget, {
      sitekey: widget.dataset.sitekey!,
      action: widget.dataset.action!,
      theme,
      language: lang,
      size: renderedSize,
      callback: (value) => {
        token = value;
        verification.dataset.state = "verified";
        verificationStatus.textContent = copy.verified;
        retry.hidden = true;
        updateButton();
      },
      "error-callback": () => verificationFailed(),
      "expired-callback": () => { verificationFailed(true); },
      "timeout-callback": () => { verificationFailed(); },
    });
    if (!widgetId) verificationFailed();
  };
  const startVerification = async () => {
    if (loading || widgetId) return;
    if (!widget.dataset.sitekey) { verificationFailed(); return; }
    loading = true;
    clearVerification();
    try {
      await loadTurnstile();
      renderWidget();
    } catch {
      verificationFailed();
    } finally {
      loading = false;
    }
  };
  const resetVerification = () => {
    clearVerification();
    if (widgetId && (renderedTheme !== theme || renderedSize !== widgetSize())) {
      window.turnstile?.remove(widgetId);
      renderWidget();
    } else if (widgetId) window.turnstile?.reset(widgetId);
    else void startVerification();
  };

  retry.addEventListener("click", resetVerification);
  window.addEventListener("offline", () => {
    if ([...fields].some((field) => field.value)) showStatus("offline");
  });
  window.addEventListener("online", () => {
    if (!sending && !token) resetVerification();
  });
  form.addEventListener("focusin", () => { void startVerification(); }, { once: true });
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        observer.disconnect();
        void startVerification();
      }
    }, { rootMargin: "300px" });
    observer.observe(form);
  } else {
    void startVerification();
  }

  // Turnstile's theme is fixed at render time; preserve the form and replace
  // only the widget when the site's paper stock changes.
  new MutationObserver(() => {
    const next = document.documentElement.dataset.theme === "light" ? "light" : "dark";
    if (theme === next) return;
    theme = next;
    if (widgetId && !sending) {
      window.turnstile?.remove(widgetId);
      renderWidget();
    }
  }).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

  new ResizeObserver(() => {
    if (widgetId && !sending && renderedSize !== widgetSize()) {
      window.turnstile?.remove(widgetId);
      renderWidget();
    }
  }).observe(widget);

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (sending || !form.reportValidity()) return;
    if (!navigator.onLine) { showStatus("offline"); return; }
    if (!token) { showStatus("verification"); void startVerification(); return; }

    sending = true;
    updateButton();
    form.setAttribute("aria-busy", "true");
    fields.forEach((field) => { field.readOnly = true; });
    submit.textContent = submit.dataset.sending ?? copy.statuses.sending.title;
    showStatus("sending");
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 20_000);
    try {
      const payload = Object.fromEntries(new FormData(form).entries());
      payload["cf-turnstile-response"] = token;
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });
      const result: unknown = await response.json();
      const data = result && typeof result === "object" ? result as Record<string, unknown> : {};
      if (response.ok && data.ok === true) {
        form.reset();
        showStatus("success");
      } else if (response.status === 429) {
        showStatus("limited");
      } else if (data.error === "verification_failed") {
        showStatus("verification");
      } else if (response.status >= 500 && data.error !== "send_failed") {
        showStatus("server");
      } else {
        showStatus("error");
      }
    } catch {
      showStatus(controller.signal.aborted ? "timeout" : !navigator.onLine ? "offline" : "error");
    } finally {
      window.clearTimeout(timeout);
      sending = false;
      form.removeAttribute("aria-busy");
      fields.forEach((field) => { field.readOnly = false; });
      submit.textContent = submit.dataset.label ?? "Send";
      // Tokens are single-use, even when delivery fails after verification.
      resetVerification();
    }
  });
}

const form = document.querySelector<HTMLFormElement>("#contact-form");
if (form) initContactForm(form);

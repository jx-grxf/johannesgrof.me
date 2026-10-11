// "Call the train": this tab asks for a short code, shows a curl command with
// it, and polls until someone runs that command in a real terminal. Then the
// pixel train drives through this page, and only this one.
import { expressTrain } from "./train";

export function driveTrain() {
  if (expressTrain()) return;
  const template = document.querySelector<HTMLTemplateElement>("template[data-train-sprite]");
  if (!template) return;
  const train = document.createElement("div");
  train.className = "remote-train";
  train.setAttribute("aria-hidden", "true");
  train.append(template.content.cloneNode(true));
  document.body.append(train);
  train.addEventListener("animationend", () => train.remove(), { once: true });
}

interface CallHandlers {
  onToken: (token: string) => void;
  onRing: () => void;
  onExpire: () => void;
  onError: () => void;
}

let stopActive: (() => void) | undefined;

export async function callTrain(handlers: CallHandlers): Promise<void> {
  stopActive?.();
  let response: Response;
  try {
    response = await fetch("/api/hi/zug", { method: "POST" });
  } catch {
    handlers.onError();
    return;
  }
  if (!response.ok) {
    handlers.onError();
    return;
  }
  const { token } = (await response.json()) as { token: string };
  handlers.onToken(token);

  let stopped = false;
  const until = Date.now() + 600_000;
  stopActive = () => (stopped = true);
  const tick = async () => {
    if (stopped) return;
    if (Date.now() > until) {
      handlers.onExpire();
      return;
    }
    if (!document.hidden) {
      try {
        const poll = await fetch(`/api/hi/zug?token=${encodeURIComponent(token)}`, { cache: "no-store" });
        const { state } = (await poll.json()) as { state: "rang" | "waiting" | "expired" };
        if (state === "rang") {
          driveTrain();
          handlers.onRing();
        } else if (state === "expired") {
          handlers.onExpire();
          return;
        }
      } catch {}
    }
    window.setTimeout(() => void tick(), 2_500);
  };
  window.setTimeout(() => void tick(), 2_500);
}

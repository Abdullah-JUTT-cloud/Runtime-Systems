import { useCallback, useEffect, useRef, useState } from "react";
import type {
  SonarAdviseResponse,
  SonarStatus,
  SonarUiMessage,
} from "./types";

const STORAGE_KEY = "sonar.chat.v1";
const MAX_STORED_MESSAGES = 30;
const REQUEST_TIMEOUT_MS = 35_000;
const MAX_SEND_MESSAGES = 20;

export const GREETING =
  "Hi, I'm SONAR, the project advisor for Runtime Systems. Tell me what you'd like to build, and I'll help you shape the plan.";

export const INITIAL_QUICK_REPLIES = [
  "I need a Shopify store",
  "I want a website",
  "I have an app idea",
  "I want to add AI",
];

function makeId(): string {
  return `m${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

/** Client-side defensive validation of the /api/advise response shape. */
export function parseAdviseResponse(data: unknown): SonarAdviseResponse | null {
  if (!isRecord(data)) return null;
  const mode = data.mode === "reply" || data.mode === "brief" ? data.mode : null;
  if (!mode) return null;
  if (typeof data.message !== "string" || data.message.trim().length === 0) return null;
  const quick = Array.isArray(data.quick_replies)
    ? data.quick_replies.filter((q): q is string => typeof q === "string").slice(0, 4)
    : [];
  const brief = mode === "brief" && isRecord(data.brief) ? (data.brief as unknown as SonarAdviseResponse["brief"]) : null;
  return { mode, message: data.message, quick_replies: quick, brief };
}

function loadStoredMessages(): SonarUiMessage[] {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    const messages: SonarUiMessage[] = [];
    for (const item of parsed.slice(-MAX_STORED_MESSAGES)) {
      if (!isRecord(item)) continue;
      const { role, content, id } = item as Record<string, unknown>;
      if ((role === "user" || role === "assistant") && typeof content === "string" && typeof id === "string") {
        messages.push({ id, role, content });
      }
    }
    return messages;
  } catch {
    // Storage may be unavailable (private mode, disabled); the app must work regardless.
    return [];
  }
}

function persistMessages(messages: SonarUiMessage[]): void {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-MAX_STORED_MESSAGES)));
  } catch {
    // Ignore persistence failures silently; chat still works in-memory.
  }
}

export function useSonar() {
  // First open shows the greeting; a stored conversation replaces it.
  const [messages, setMessages] = useState<SonarUiMessage[]>(() => {
    const stored = loadStoredMessages();
    if (stored.length > 0) return stored;
    return [{ id: makeId(), role: "assistant", content: GREETING }];
  });
  const [status, setStatus] = useState<SonarStatus>("idle");
  // Starter chips belong to a fresh conversation, not a restored one.
  const [quickReplies, setQuickReplies] = useState<string[]>(() =>
    loadStoredMessages().length > 0 ? [] : INITIAL_QUICK_REPLIES,
  );
  const [brief, setBrief] = useState<SonarAdviseResponse["brief"]>(null);

  const sendGeneration = useRef(0);
  const loadingRef = useRef(false);
  const messagesRef = useRef<SonarUiMessage[]>(messages);
  messagesRef.current = messages;

  useEffect(() => {
    persistMessages(messages);
  }, [messages]);

  const applyResponse = useCallback((data: SonarAdviseResponse) => {
    setQuickReplies(data.mode === "brief" ? [] : data.quick_replies);
    setBrief(data.brief);
    setMessages((current) => [
      ...current,
      { id: makeId(), role: "assistant", content: data.message },
    ]);
  }, []);

  /** Sends the last user text (or a new one) to /api/advise with a timeout. */
  const requestAdvise = useCallback(
    async (conversation: { role: "user" | "assistant"; content: string }[]) => {
      const generation = ++sendGeneration.current;
      loadingRef.current = true;
      setStatus("loading");
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
      try {
        const response = await fetch("/api/advise", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: conversation.slice(-MAX_SEND_MESSAGES),
          }),
          signal: controller.signal,
        });
        if (!response.ok) {
          throw Object.assign(new Error(`HTTP ${response.status}`), { status: response.status });
        }
        const data: unknown = await response.json();
        // Ignore stale or out-of-order responses (user reset/sent meanwhile).
        if (generation !== sendGeneration.current || !loadingRef.current) return;
        const parsed = parseAdviseResponse(data);
        if (!parsed) throw new Error("Malformed response");
        applyResponse(parsed);
        setStatus("idle");
      } catch {
        if (generation !== sendGeneration.current || !loadingRef.current) return;
        setStatus("error");
      } finally {
        clearTimeout(timer);
        if (generation === sendGeneration.current) {
          loadingRef.current = false;
        }
      }
    },
    [applyResponse],
  );

  const send = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || loadingRef.current || trimmed.length > 1500) return;
      const userMessage: SonarUiMessage = { id: makeId(), role: "user", content: trimmed };
      const next = [...messagesRef.current, userMessage];
      messagesRef.current = next;
      setMessages(next);
      setQuickReplies([]);
      setBrief(null);
      void requestAdvise(next.map(({ role, content }) => ({ role, content })));
    },
    [requestAdvise],
  );

  const retry = useCallback(() => {
    if (loadingRef.current) return;
    const convo = messagesRef.current.filter((m) => !m.isError);
    // Drop any trailing error marker before resending the last user turn.
    const lastUser = [...convo].reverse().find((m) => m.role === "user");
    if (!lastUser) return;
    setStatus("idle");
    void requestAdvise(
      convo
        .filter((m) => m !== lastUser || m === convo[convo.length - 1])
        .map(({ role, content }) => ({ role, content })),
    );
  }, [requestAdvise]);

  const reset = useCallback(() => {
    sendGeneration.current += 1; // invalidate in-flight responses
    loadingRef.current = false;
    const cleared: SonarUiMessage[] = [{ id: makeId(), role: "assistant", content: GREETING }];
    messagesRef.current = cleared;
    setMessages(cleared);
    setQuickReplies(INITIAL_QUICK_REPLIES);
    setBrief(null);
    setStatus("idle");
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  }, []);

  const dismissError = useCallback(() => {
    setStatus("idle");
  }, []);

  return { messages, status, quickReplies, brief, send, retry, reset, dismissError };
}

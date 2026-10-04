import { useEffect, useRef, useState } from "react";
import { SendHorizontal } from "lucide-react";
import { MAX_USER_CONTENT } from "./limits";

const MAX_LINES = 5;

export function Composer({
  loading,
  onSend,
}: {
  loading: boolean;
  onSend: (text: string) => void;
}) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-grow up to ~5 lines.
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 5 * 24 + 20)}px`;
  }, [value]);

  const submit = () => {
    const trimmed = value.trim();
    if (!trimmed || loading) return;
    onSend(trimmed);
    setValue("");
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      submit();
    }
  };

  return (
    <form
      className="sonar-composer"
      onSubmit={(event) => {
        event.preventDefault();
        submit();
      }}
    >
      <div className="sonar-composer__row">
        <textarea
          ref={textareaRef}
          className="sonar-composer__textarea"
          value={value}
          rows={1}
          maxLength={MAX_USER_CONTENT}
          placeholder="Describe what you want to build…"
          aria-label="Message SONAR"
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={onKeyDown}
        />
        <button
          type="submit"
          className="sonar-composer__send"
          disabled={loading || value.trim().length === 0}
          aria-label="Send message"
        >
          <SendHorizontal size={17} />
        </button>
      </div>
      <div className="sonar-composer__meta">
        <span className="sonar-composer__disclosure">
          SONAR is an AI assistant and can make mistakes. Don't share passwords or payment details.
        </span>
        {value.length > MAX_USER_CONTENT - 200 ? (
          <span className="sonar-composer__count meta">
            {value.length}/{MAX_USER_CONTENT}
          </span>
        ) : null}
      </div>
    </form>
  );
}

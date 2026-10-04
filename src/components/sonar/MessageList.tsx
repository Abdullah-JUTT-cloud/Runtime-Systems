import { Fragment, useEffect, useRef } from "react";
import { BriefCard } from "./BriefCard";
import { SonarOrb } from "./SonarOrb";
import type { SonarBrief, SonarUiMessage } from "./types";

/**
 * Parses a tiny safe subset (paragraphs, "- " bullets, **bold**) into React
 * elements. No HTML is parsed, so there is no injection surface
 * (dangerouslySetInnerHTML is never used).
 */
export function renderAssistantText(text: string) {
  const blocks = text.split(/\n{2,}/).filter((block) => block.trim().length > 0);
  return blocks.map((block, blockIndex) => {
    const lines = block.split("\n").filter((line) => line.trim().length > 0);
    const isBullets = lines.length > 0 && lines.every((line) => /^\s*[-•]\s+/.test(line));
    const key = `p${blockIndex}`;
    if (isBullets) {
      return (
        <ul key={key} className="sonar-msg__list">
          {lines.map((line, lineIndex) => (
            <li key={lineIndex}>{renderInline(line.replace(/^\s*[-•]\s+/, ""))}</li>
          ))}
        </ul>
      );
    }
    return <p key={key}>{renderInline(block)}</p>;
  });
}

function renderInline(text: string) {
  // **bold** segments; the model never controls markup beyond this.
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
      return <b key={index}>{part.slice(2, -2)}</b>;
    }
    return <Fragment key={index}>{part}</Fragment>;
  });
}

interface MessageListProps {
  messages: SonarUiMessage[];
  quickReplies: string[];
  loading: boolean;
  brief: SonarBrief | null;
  onQuickReply: (text: string) => void;
}

export function MessageList({ messages, quickReplies, loading, brief, onQuickReply }: MessageListProps) {
  const endRef = useRef<HTMLDivElement>(null);
  const hasBrief = brief !== null;

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages.length, loading, quickReplies, hasBrief]);

  return (
    <div className="sonar-panel__list" role="log" aria-live="polite" aria-label="Conversation with SONAR">
      {messages.map((message) => (
        <div key={message.id} className={`sonar-msg sonar-msg--${message.role}`}>
          {message.role === "assistant" ? (
            <div className="sonar-msg__body">{renderAssistantText(message.content)}</div>
          ) : (
            <div className="sonar-msg__body sonar-msg__body--user">{message.content}</div>
          )}
        </div>
      ))}

      {hasBrief && !loading ? <BriefCard brief={brief} /> : null}

      {loading ? (
        <div className="sonar-msg sonar-msg--assistant sonar-msg--typing" aria-label="SONAR is typing">
          <div className="sonar-msg__body sonar-typing" role="status">
            <SonarOrb variant="xs" />
            <span /><span /><span />
            <span className="visually-hidden">SONAR is thinking…</span>
          </div>
        </div>
      ) : null}

      {!loading && quickReplies.length > 0 ? (
        <div className="sonar-quick" role="group" aria-label="Suggested replies">
          {quickReplies.map((reply) => (
            <button key={reply} type="button" className="sonar-quick__chip" onClick={() => onQuickReply(reply)}>
              {reply}
            </button>
          ))}
        </div>
      ) : null}

      <div ref={endRef} aria-hidden="true" />
    </div>
  );
}

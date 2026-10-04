import assert from "node:assert/strict";
import test from "node:test";

/**
 * TypeScript is stripped by a tiny custom transpiler (tests/sonar-run.mjs);
 * the project has no ts-node/tsx dependency and the tested code is pure logic.
 */

const RUN = new URL("./sonar-run.mjs", import.meta.url);

async function loadModule(relPath, extraStrip = []) {
  const { loadSonarModule } = await import(RUN.href);
  return loadSonarModule(relPath, extraStrip);
}

test("validate.ts accepts a valid payload and caps history at 20", async () => {
  const { validateConversation, MAX_MESSAGES_KEPT } = await loadModule("functions/_lib/validate.ts");
  const messages = [
    { role: "assistant", content: "hello" },
    ...Array.from({ length: 25 }, (_, i) => ({ role: "user", content: `u${i}` })),
  ];
  const result = validateConversation({ messages });
  assert.equal(result.ok, true);
  assert.ok(result.messages.length <= MAX_MESSAGES_KEPT);
  assert.equal(result.messages.length, 20);
  assert.equal(result.messages[result.messages.length - 1].content, "u24");
  assert.equal(result.messages[result.messages.length - 1].role, "user");
});

test("validate.ts rejects bad roles, system role, empty and oversized content", async () => {
  const { validateConversation } = await loadModule("functions/_lib/validate.ts");

  assert.equal(validateConversation({ messages: [{ role: "system", content: "hi" }] }).ok, false);
  assert.equal(validateConversation({ messages: [{ role: "admin", content: "hi" }] }).ok, false);
  assert.equal(validateConversation({ messages: [{ role: "user", content: "   " }] }).ok, false);
  assert.equal(validateConversation({ messages: [{ role: "user", content: "" }] }).ok, false);
  assert.equal(validateConversation({ messages: [{ role: "user", content: "x".repeat(1501) }] }).ok, false);
  assert.equal(validateConversation({ messages: [{ role: "user", content: "ok" }, { role: "user", content: "y".repeat(6001) }] }).ok, false);
  assert.equal(validateConversation({ messages: "nope" }).ok, false);
  assert.equal(validateConversation({ messages: [] }).ok, false);
  assert.equal(validateConversation(null).ok, false);
  assert.equal(validateConversation("string").ok, false);
  // Last message must be user.
  assert.equal(validateConversation({ messages: [{ role: "user", content: "a" }, { role: "assistant", content: "b" }] }).ok, false);
  // Assistant history capped at 6000 chars.
  assert.equal(validateConversation({ messages: [{ role: "assistant", content: "a".repeat(6001) }, { role: "user", content: "hi" }] }).ok, false);
});

test("validate.ts trims content and strips control characters", async () => {
  const { validateConversation } = await loadModule("functions/_lib/validate.ts");
  const result = validateConversation({ messages: [{ role: "user", content: "  hi \u0007 there \u0000" }] });
  assert.equal(result.ok, true);
  assert.equal(result.messages[0].content, "hi  there");
});

test("validate.ts accepts assistant history up to 6000 chars", async () => {
  const { validateConversation } = await loadModule("functions/_lib/validate.ts");
  const result = validateConversation({
    messages: [{ role: "assistant", content: "a".repeat(6000) }, { role: "user", content: "hi" }],
  });
  assert.equal(result.ok, true);
});

test("gemini.ts parseModelText parses valid JSON and strips code fences", async () => {
  const { parseModelText } = await loadModule("functions/_lib/gemini.ts");
  const payload = { mode: "reply", message: "hello", quick_replies: ["a", "b"], brief: null };
  const direct = parseModelText(JSON.stringify(payload));
  assert.equal(direct.ok, true);
  assert.equal(direct.value.message, "hello");
  assert.deepEqual(direct.value.quick_replies, ["a", "b"]);
  assert.equal(direct.value.brief, null);

  const fenced = parseModelText("```json\n" + JSON.stringify(payload) + "\n```");
  assert.equal(fenced.ok, true);
  assert.equal(fenced.value.message, "hello");
});

test("gemini.ts enforces brief null for reply mode, caps quick_replies, rejects invalid shapes", async () => {
  const { parseModelText } = await loadModule("functions/_lib/gemini.ts");

  const withBrief = parseModelText(JSON.stringify({ mode: "reply", message: "m", quick_replies: [], brief: { project_name: "x" } }));
  assert.equal(withBrief.ok, true);
  assert.equal(withBrief.value.brief, null);

  const tooManyQuick = parseModelText(JSON.stringify({ mode: "reply", message: "m", quick_replies: ["1", "2", "3", "4", "5"], brief: null }));
  assert.equal(tooManyQuick.ok, true);
  assert.equal(tooManyQuick.value.quick_replies.length, 4);

  assert.equal(parseModelText("not json at all").ok, false);
  assert.equal(parseModelText(JSON.stringify({ mode: "other", message: "m" })).ok, false);
  assert.equal(parseModelText(JSON.stringify({ mode: "reply", message: "" })).ok, false);
  assert.equal(parseModelText(JSON.stringify({ mode: "brief", message: "m", brief: null })).ok, false);
  assert.equal(parseModelText(JSON.stringify({ mode: "reply" })).ok, false);
});

test("gemini.ts parseBrief normalizes brief fields", async () => {
  const { parseModelText } = await loadModule("functions/_lib/gemini.ts");
  const brief = {
    project_name: "Clinic portal",
    summary: "A portal",
    project_type: "web_app",
    goals: ["Reduce no-shows"],
    phases: [{ name: "Phase 1: MVP", scope: "Booking + reminders" }],
    constraints: { deadline_context: "q3", budget_note: "not shared", compliance: "none" },
    contact: { name: null, email: null, preferred_channel: null },
  };
  const result = parseModelText(JSON.stringify({ mode: "brief", message: "here is your brief", quick_replies: [], brief }));
  assert.equal(result.ok, true);
  assert.equal(result.value.brief.project_type, "web_app");
  assert.deepEqual(result.value.brief.phases, [{ name: "Phase 1: MVP", scope: "Booking + reminders" }]);
  // Unknown project_type falls back to "other".
  const bad = parseModelText(JSON.stringify({ mode: "brief", message: "m", quick_replies: [], brief: { ...brief, project_type: "quantum" } }));
  assert.equal(bad.value.brief.project_type, "other");
});

test("rateLimit.evaluateLimit allows under limit and blocks over limit", async () => {
  const { evaluateLimit, emptyBucket } = await loadModule("functions/_lib/rateLimit.ts");
  const now = 1_700_000_000_000;
  const bucket = emptyBucket(now);
  assert.equal(evaluateLimit(bucket, now + 1), "allowed");

  const fullMinute = { ...emptyBucket(now), minuteCount: 12 };
  assert.equal(evaluateLimit(fullMinute, now + 1000), "minute");

  const fullDay = { ...emptyBucket(now), dayCount: 120 };
  assert.equal(evaluateLimit(fullDay, now + 1000), "day");
});

test("rateLimit.evaluateLimit resets after the window elapses", async () => {
  const { evaluateLimit, emptyBucket } = await loadModule("functions/_lib/rateLimit.ts");
  const now = 1_700_000_000_000;
  const fullMinute = { ...emptyBucket(now), minuteCount: 12 };
  assert.equal(evaluateLimit(fullMinute, now + 60_000), "allowed");
  const fullDay = { ...emptyBucket(now), dayCount: 120, minuteCount: 12 };
  assert.equal(evaluateLimit(fullDay, now + 24 * 60 * 60_000), "allowed");
});

test("rateLimit.hitRateLimit tracks per-ip counts and returns retryAfter", async () => {
  const mod = await loadModule("functions/_lib/rateLimit.ts");
  const { hitRateLimit, resetRateLimiter } = mod;
  resetRateLimiter();
  const now = 1_700_000_000_000;
  for (let i = 0; i < 12; i += 1) {
    const r = hitRateLimit("1.2.3.4", now + i);
    assert.equal(r.result, "allowed");
  }
  const blocked = hitRateLimit("1.2.3.4", now + 100);
  assert.equal(blocked.result, "minute");
  assert.ok(blocked.retryAfter >= 1 && blocked.retryAfter <= 60);
  // Different IP unaffected.
  assert.equal(hitRateLimit("5.6.7.8", now + 100).result, "allowed");
  // After the minute window rolls over, allowed again.
  assert.equal(hitRateLimit("1.2.3.4", now + 61_000).result, "allowed");
  resetRateLimiter();
});

test("formatBriefAsText includes all sections and skips missing fields", async () => {
  const { formatBriefAsText } = await loadModule("src/components/sonar/formatBrief.ts");

  const full = {
    project_name: "Clinic Portal",
    summary: "Booking and reminders for a clinic.",
    project_type: "web_app",
    goals: ["Reduce no-shows"],
    target_users: ["Front desk staff"],
    must_have_features: ["Booking"],
    should_have_features: ["SMS reminders"],
    later_features: ["Billing"],
    recommended_approach: "Web app with a hosted backend",
    phases: [{ name: "Phase 1: MVP", scope: "Booking" }],
    integrations: ["Twilio SMS"],
    risks_and_notes: ["SMS deliverability"],
    existing_assets: "Existing website",
    constraints: { deadline_context: "Before q4", budget_note: "not shared", compliance: "HIPAA awareness" },
    open_questions_for_team: ["Team availability"],
    contact: { name: "Ada", email: "ada@example.com", preferred_channel: "email" },
  };
  const text = formatBriefAsText(full);
  for (const expected of ["Clinic Portal", "Goals:", "Target users:", "Must have:", "Should have:", "Later:", "Recommended approach:", "Phases:", "Integrations:", "Risks and notes:", "Existing assets:", "Constraints:", "Open questions for the team:", "Contact:", "Ada", "ada@example.com"]) {
    assert.ok(text.includes(expected), `expected text to include ${expected}`);
  }
  assert.ok(!text.includes("undefined"));
  assert.ok(!text.includes("null"));

  const empty = formatBriefAsText({
    project_name: "",
    summary: "",
    project_type: "other",
    goals: [],
    target_users: [],
    must_have_features: [],
    should_have_features: [],
    later_features: [],
    recommended_approach: "",
    phases: [],
    integrations: [],
    risks_and_notes: [],
    existing_assets: "",
    constraints: { deadline_context: "", budget_note: "", compliance: "" },
    open_questions_for_team: [],
    contact: { name: null, email: null, preferred_channel: null },
  });
  assert.ok(empty.includes("Untitled project"));
  assert.ok(!empty.includes("undefined"));
  assert.ok(!empty.includes("null"));
});

test("buildMailto is length-safe and hides placeholder emails", async () => {
  const { buildMailto } = await loadModule("src/components/sonar/formatBrief.ts");
  const url = buildMailto("team@example.com", "Project brief: X", "short body");
  assert.ok(url.startsWith("mailto:team@example.com?subject="));
  assert.ok(buildMailto(null, "s", "b") === null);
  assert.ok(buildMailto("[FILL IN email]", "s", "b") === null);
  const hugeBody = "x".repeat(5000);
  assert.ok(buildMailto("team@example.com", "s", hugeBody) === null);
});

test("sync-knowledge output round-trips the stripped markdown including backticks and ${}", async () => {
  const { readFile } = await import("node:fs/promises");
  const { readGeneratedKnowledgeString } = await import(RUN.href);

  const markdown = await readFile(new URL("../docs/knowledge.md", import.meta.url), "utf8");
  const stripped = markdown.replace(/^<!--[\s\S]*?-->\s*/, "");
  const knowledge = await readGeneratedKnowledgeString();

  assert.equal(knowledge, stripped);
  assert.ok(!knowledge.startsWith("<!--"));
  assert.ok(!knowledge.includes("DEVELOPER NOTES (delete this comment block before deploying)"));
  // Sequences that would break naive template literals survive intact.
  assert.ok(knowledge.includes("[FILL IN]"));
  assert.ok(knowledge.includes("You are **SONAR, the AI project advisor of Runtime Systems**"));
  // SONAR persona rename is present in the source of truth.
  assert.ok(knowledge.includes("You are **SONAR, the AI project advisor of Runtime Systems**"));
  assert.ok(knowledge.includes("Introduce yourself as SONAR in your first message"));
});

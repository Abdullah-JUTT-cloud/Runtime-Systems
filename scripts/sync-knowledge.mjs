import { mkdir, readFile, writeFile } from "node:fs/promises";

const SOURCE = "docs/knowledge.md";
const TARGET = "functions/_lib/knowledge.ts";

const markdown = await readFile(SOURCE, "utf8");

// Strip the leading HTML comment block (DEVELOPER NOTES) if present.
const stripped = markdown.replace(/^<!--[\s\S]*?-->\s*/, "");

// JSON.stringify avoids template-literal escaping bugs with backticks and ${}.
const output = `// GENERATED FILE. Edit docs/knowledge.md and run npm run sync:knowledge.
// Do not hand-edit this file.
export const KNOWLEDGE = ${JSON.stringify(stripped)};
`;

await mkdir("functions/_lib", { recursive: true });
await writeFile(TARGET, output, "utf8");

console.log(`[sync-knowledge] Wrote ${TARGET} (${stripped.length} chars from ${SOURCE}).`);

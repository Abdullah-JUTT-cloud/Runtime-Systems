/**
 * Test helper: loads the pure-logic TypeScript modules (functions/_lib and
 * src/components/sonar) under `node --test` using the project's existing
 * `typescript` devDependency (ts.transpileModule — type stripping only, no
 * type checking) and native ESM imports from a mirrored cache directory.
 */
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import ts from "typescript";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const cacheRoot = path.join(projectRoot, "tests", ".sonar-cache");

const loaded = new Map();

const IMPORT_RE = /(?:import|export)\s+(?:[\w$*{},\s]+?\s+from\s+)?["'](\.[^"']+)["']/g;

function transpile(source) {
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ES2022,
    },
  });
  return outputText;
}

async function loadModule(absPath) {
  if (loaded.has(absPath)) return loaded.get(absPath);

  const relToRoot = path.relative(projectRoot, absPath);
  const cachePath = path.join(cacheRoot, relToRoot.replace(/\.ts$/, ".mjs"));
  const cacheDir = path.dirname(cachePath);
  await mkdir(cacheDir, { recursive: true });

  const source = await readFile(absPath, "utf8");
  const js = transpile(source);

  // Load relative .ts dependencies first (they resolve from the mirrored cache).
  for (const match of js.matchAll(IMPORT_RE)) {
    const spec = match[1];
    if (!spec.startsWith(".")) continue;
    const depAbs = path.resolve(path.dirname(absPath), spec);
    const candidate = [depAbs, `${depAbs}.ts`, path.join(depAbs, "index.ts")].find(
      (p) => p.endsWith(".ts") && existsSync(p),
    );
    if (candidate) await loadModule(candidate);
  }

  // Rewrite relative import specifiers to the mirrored .mjs paths.
  const resolveDep = (spec) => {
    const depAbs = path.resolve(path.dirname(absPath), spec);
    const found = [depAbs, `${depAbs}.ts`, path.join(depAbs, "index.ts")].find(
      (candidate) => candidate.endsWith(".ts") && existsSync(candidate),
    );
    if (!found) return null;
    const depRel = path.relative(projectRoot, found).replace(/\\/g, "/");
    const depCachePath = path.join(cacheRoot, depRel.replace(/\.ts$/, ".mjs"));
    const relFromCache = path.relative(path.dirname(cachePath), depCachePath).replace(/\\/g, "/");
    return relFromCache.startsWith(".") ? relFromCache : `./${relFromCache}`;
  };
  const jsRewritten = js.replace(IMPORT_RE, (match, spec) => {
    if (!spec.startsWith(".")) return match;
    const resolved = resolveDep(spec);
    return resolved ? match.replace(spec, resolved) : match;
  });

  await writeFile(cachePath, jsRewritten, "utf8");
  const namespace = await import(`${cachePath}?t=${Date.now()}-${loaded.size}`);
  loaded.set(absPath, namespace);
  return namespace;
}

/** Load a TS module by project-root-relative path, e.g. "functions/_lib/validate.ts". */
export async function loadSonarModule(relPath) {
  return loadModule(path.join(projectRoot, relPath));
}

/** Extract the KNOWLEDGE string from the generated functions/_lib/knowledge.ts. */
export async function readGeneratedKnowledgeString() {
  const raw = await readFile(path.join(projectRoot, "functions/_lib/knowledge.ts"), "utf8");
  const marker = "export const KNOWLEDGE = ";
  const start = raw.indexOf(marker);
  if (start === -1) throw new Error("KNOWLEDGE export not found in generated file");
  const literal = raw.slice(start + marker.length).trimEnd();
  if (!literal.endsWith(";")) throw new Error("Generated file does not end with ';'");
  return JSON.parse(literal.slice(0, -1));
}

export async function clearSonarCache() {
  if (existsSync(cacheRoot)) await rm(cacheRoot, { recursive: true, force: true });
}

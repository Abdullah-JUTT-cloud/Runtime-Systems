import { cp, mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";

const routes = [
  "/work", "/services", "/solutions", "/process", "/about", "/insights", "/careers", "/contact", "/start-project",
  "/services/web-engineering", "/services/mobile", "/services/ai", "/services/backend-systems", "/services/cloud-devops",
  "/work/medalert-os", "/work/ledger-north", "/work/signal-desk", "/work/dockline", "/work/cartograph", "/work/fieldnote",
];

const source = await readFile("dist/index.html", "utf8");
for (const route of routes) {
  const target = join("dist", route, "index.html");
  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, source.replace('<link rel="canonical" href="https://runtimesystems.tech/" />', `<link rel="canonical" href="https://runtimesystems.tech${route}" />`));
}
await mkdir("dist/404", { recursive: true });
await cp("dist/index.html", "dist/404/index.html");

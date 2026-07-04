import fs from "node:fs";
import path from "node:path";
import { createPortal, type Portal } from "./portal";

// Singleton por proceso; globalThis sobrevive el HMR de next dev.
const g = globalThis as { __portal?: Portal };

export function getPortal(): Portal {
  if (!g.__portal) {
    const dir = path.join(process.cwd(), "data");
    fs.mkdirSync(dir, { recursive: true });
    g.__portal = createPortal(path.join(dir, "nodo.db"));
  }
  return g.__portal;
}

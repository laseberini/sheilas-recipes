// "Neapolitan"/"Neopolitan" is now "Napolitano" everywhere on the site (2026-10-05). Her originals stay in
// asWritten; the recipe id (neopolitan-sauce) stays so links keep working. Idempotent; backs up recipes.json.
// Usage: node tools/napolitano.cjs
const fs = require("fs");
const path = require("path");
const ROOT = path.resolve(__dirname, "..");
const FILE = path.join(ROOT, "data", "recipes.json");
const data = JSON.parse(fs.readFileSync(FILE, "utf8"));
const swap = (s) => (typeof s === "string" ? s.replace(/\bNeo?a?politan\b/g, "Napolitano").replace(/\bneo?a?politan\b/g, "napolitano") : s);
const done = [];
for (const r of data.recipes) {
  for (const k of ["title", "ingredients", "method", "notes", "transcriberNotes", "uncertain"]) {
    const before = JSON.stringify(r[k]);
    r[k] = Array.isArray(r[k]) ? r[k].map(swap) : swap(r[k]);
    if (JSON.stringify(r[k]) !== before) done.push(`${r.id} ${k}`);
  }
}
if (!done.length) return console.log("Nothing to change.");
const stamp = new Date().toISOString().replace(/[:.]/g, "-");
fs.copyFileSync(FILE, path.join(ROOT, "data", "backups", `recipes-${stamp}-before-napolitano.json`));
fs.writeFileSync(FILE, JSON.stringify(data, null, 2) + "\n");
console.log(done.join("\n"));

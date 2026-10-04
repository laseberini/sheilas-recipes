// Nonna's recipes lose "Nonna's" from their titles (2026-10-04): the "From Nonna" byline already credits her.
// Ids stay the same, so shared links keep working. Idempotent. Backs up recipes.json first.
// Usage: node tools/drop-nonna-from-titles.cjs
const fs = require("fs");
const path = require("path");
const ROOT = path.resolve(__dirname, "..");
const FILE = path.join(ROOT, "data", "recipes.json");
const data = JSON.parse(fs.readFileSync(FILE, "utf8"));

const changed = [];
for (const r of data.recipes) {
  if (r.personId !== "nonna") continue;
  const before = JSON.stringify(r);
  r.title = r.title.replace(/^Nonna's\s+/, "");
  r.notes = (r.notes || []).map((n) => n.replace("Serve with Nonna's Fagiolini", "Serve with Fagiolini"));
  if (JSON.stringify(r) !== before) changed.push(r.title);
}
if (!changed.length) return console.log("Nothing to change.");
const stamp = new Date().toISOString().replace(/[:.]/g, "-");
fs.copyFileSync(FILE, path.join(ROOT, "data", "backups", `recipes-${stamp}-before-drop-nonna.json`));
fs.writeFileSync(FILE, JSON.stringify(data, null, 2) + "\n");
console.log("Now: " + changed.join(" | "));

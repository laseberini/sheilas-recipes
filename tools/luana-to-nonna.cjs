// Luana sent three recipes (2026-10-04) and confirmed they're all Nonna's: credit them to Nonna.
// Ids (and so links already shared) stay the same. Idempotent. Backs up recipes.json first.
// Usage: node tools/luana-to-nonna.cjs
const fs = require("fs");
const path = require("path");
const ROOT = path.resolve(__dirname, "..");
const FILE = path.join(ROOT, "data", "recipes.json");
const data = JSON.parse(fs.readFileSync(FILE, "utf8"));
const IDS = ["luana-s-peperoni-verdi-ripieni", "luana-s-coniglio-al-forno", "luana-s-fagiolini-e-patate-al-pomodoro"];
const NOTE = "Sent by Luana (Sheila's sister-in-law), who confirmed it's one of Nonna's recipes.";

let changed = 0;
for (const r of data.recipes.filter((r) => IDS.includes(r.id))) {
  const before = JSON.stringify(r);
  r.title = r.title.replace(/^Luana's /, "Nonna's ");
  r.from = "Nonna";
  r.personId = "nonna";
  r.notes = r.notes.map((n) => n.replace("Luana's Fagiolini", "Nonna's Fagiolini"));
  r.transcriberNotes = [...(r.transcriberNotes || []).filter((n) => n !== NOTE), NOTE];
  if (JSON.stringify(r) !== before) changed++;
}
if (!changed) return console.log("Nothing to change.");
const stamp = new Date().toISOString().replace(/[:.]/g, "-");
fs.copyFileSync(FILE, path.join(ROOT, "data", "backups", `recipes-${stamp}-before-luana-to-nonna.json`));
fs.writeFileSync(FILE, JSON.stringify(data, null, 2) + "\n");
console.log(`Credited ${changed} recipe(s) to Nonna.`);

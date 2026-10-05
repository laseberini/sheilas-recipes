// Writes out her ditto marks (" = same as the line above) so they don't show as stray quotes on the site
// (2026-10-05). Her originals stay in asWritten. Oven Penne was done by hand in the editor; the Bolognaise
// '" tomato paste "' line is left for Sheila to clarify. Idempotent; backs up recipes.json first.
// Usage: node tools/write-out-dittos.cjs
const fs = require("fs");
const path = require("path");
const ROOT = path.resolve(__dirname, "..");
const FILE = path.join(ROOT, "data", "recipes.json");
const data = JSON.parse(fs.readFileSync(FILE, "utf8"));

const FIXES = {
  "sweetcorn-bake": { ingredients: [['1 " plain corn (drained)', "1 tin plain corn (drained)"], ['1 red " chopped', "1 red pepper chopped"]] },
  "bronwyns-peacanut-pie-tart": { ingredients: [['2 " syrup', "2 tablespoons syrup"]] },
  "poppy-seed-nix-recipe": { ingredients: [['¾ " poppy seed', "¾ cup poppy seed"], ['1 " yoghurt', "1 cup yoghurt"],
    ['6 " milk', "6 tablespoons milk"], ['3 " butter/margarine', "3 tablespoons butter/margarine"]] },
  "brandy-tart": { ingredients: [['1¼ " sugar', "1¼ cups sugar"]] },
  "bollonaise-sauce": { method: [['" " orange skin', "Piece of orange skin"]] },
};

const done = [];
for (const [id, fields] of Object.entries(FIXES)) {
  const r = data.recipes.find((x) => x.id === id);
  if (!r) { console.log(`NOTE ${id} not found`); continue; }
  for (const [field, pairs] of Object.entries(fields)) {
    for (const [from, to] of pairs) {
      const i = (r[field] || []).findIndex((l) => l.trim() === from);
      if (i >= 0) { r[field][i] = to; done.push(`${r.title}: ${to}`); }
    }
  }
}
if (!done.length) return console.log("Nothing to change.");
const stamp = new Date().toISOString().replace(/[:.]/g, "-");
fs.copyFileSync(FILE, path.join(ROOT, "data", "backups", `recipes-${stamp}-before-dittos.json`));
fs.writeFileSync(FILE, JSON.stringify(data, null, 2) + "\n");
console.log(done.join("\n"));

// Every recipe with a person gets their name at the start of its title (2026-10-04, Laurence: "put the name in
// every item that is named"), e.g. "Polpette" → "Nonna's Polpette", "Minestrone Soup" → "Sheila's Minestrone Soup".
// Titles that already start with the name are left alone. Ids stay the same. Idempotent; backs up recipes.json.
// Usage: node tools/names-in-titles.cjs [--dry]
const fs = require("fs");
const path = require("path");
const ROOT = path.resolve(__dirname, "..");
const FILE = path.join(ROOT, "data", "recipes.json");
const data = JSON.parse(fs.readFileSync(FILE, "utf8"));
const people = Object.fromEntries((data.people || []).map((p) => [p.id, p]));
const possessive = (n) => (/s$/i.test(n) ? `${n}'` : `${n}'s`);
const cleanName = (n) => n.replace(/\[\?\]|\[illegible\]/g, "").trim();
// Already named if the title has their (first) name anywhere: "Aletta's Pesto Sauce", "Poppy Seed Nix Recipe", "Avis Cheese Cake".
const hasName = (title, name) => new RegExp(`\\b${cleanName(name).replace(/^the\s+/i, "").split(/\s+/)[0]}\\b`, "i").test(title);

const changes = [];
for (const r of data.recipes) {
  const p = people[r.personId];
  if (!p) continue;
  const trimmed = r.title.trim();
  const title = hasName(trimmed, p.name) ? trimmed : `${possessive(cleanName(p.name))} ${trimmed}`;
  if (title === r.title) continue;
  changes.push(`${r.checked ? "live " : "     "}${r.title}  →  ${title}`);
  r.title = title;
}
// The rabbit's serving note names the green beans recipe by its title.
for (const r of data.recipes) {
  r.notes = (r.notes || []).map((n) => n.replace(/^Serve with Fagiolini e Patate al Pomodoro/, "Serve with Nonna's Fagiolini e Patate al Pomodoro"));
}
console.log(changes.join("\n") || "Nothing to change.");
if (!changes.length || process.argv.includes("--dry")) return;
const stamp = new Date().toISOString().replace(/[:.]/g, "-");
fs.copyFileSync(FILE, path.join(ROOT, "data", "backups", `recipes-${stamp}-before-names-in-titles.json`));
fs.writeFileSync(FILE, JSON.stringify(data, null, 2) + "\n");

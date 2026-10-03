// Creates the people behind the recipes from the names already typed in "Whose recipe",
// merging different spellings of the same person, and links each recipe to its person.
// Safe to run more than once: existing people (and anything edited on them) are kept.
// Usage: node tools/make-people.cjs
const fs = require("fs");
const path = require("path");
const f = path.join(__dirname, "..", "data", "recipes.json");
const d = JSON.parse(fs.readFileSync(f, "utf8"));

// What was typed → who it is. Relations and bios only where Sheila's own introduction says so.
const PEOPLE = [
  { id: "nonna", name: "Nonna", from: ["Nonna", "Nonna's"], relation: "Sheila's mother-in-law",
    bio: "She was Italian but born in Turkey, raised on the Island Rhodes, married an Italian Slav & called herself 'oriental' Italian. She was just the most wonderful cook. (From Sheila's introduction)" },
  { id: "sheilas-mom", name: "Sheila's mom", from: ["Mom's", "mom's favourite"], relation: "Sheila's mother",
    bio: "Her parents came from Riga & she had wonderful recipes to share as well as her 'own' wonderful food. (From Sheila's introduction)" },
  { id: "aletta", name: "Aletta Taranto", from: ["Aletta's", "Aletta Taranto"], relation: "Sheila's friend from their Swaziland days",
    bio: "Also married to an Italian, she helped Sheila begin her 'like' of cooking. (From Sheila's introduction)" },
  { id: "sheila", name: "Sheila", from: ["Sheila"], relation: "", bio: "" },
  { id: "seberini-family", name: "The Seberini family", from: ["Seberini's"], relation: "", bio: "" },
  { id: "granny-naomi", name: "Granny Naomi", from: ["Granny Naomi"], relation: "", bio: "" },
  { id: "bronwyn", name: "Bronwyn", from: ["Bronwyn"], relation: "", bio: "" },
  { id: "simy", name: "Simy", from: ["Simy"], relation: "", bio: "" },
  { id: "avis", name: "Avis", from: ["Avis"], relation: "", bio: "" },
  { id: "goldberg-girls", name: "The Goldberg girls", from: ["Goldberg girls"], relation: "", bio: "" },
  { id: "lisa-brink", name: "Lisa Brink", from: ["Lisa Brink (printed email)"], relation: "", bio: "" },
  { id: "ethel-sueals", name: "Ethel Sueals[?]", from: ["Ethel Sueals[?]"], relation: "", bio: "" },
  { id: "natalia", name: "Natalia[?]", from: ["Natalia[?]"], relation: "", bio: "" },
  { id: "nix", name: "Nix[?]", from: ["Nix[?]"], relation: "", bio: "" },
];

d.people ||= [];
const log = [];
for (const p of PEOPLE) {
  if (!d.people.some((x) => x.id === p.id)) {
    d.people.push({ id: p.id, name: p.name, relation: p.relation, bio: p.bio, photo: null });
    log.push(`added ${p.name}`);
  }
}
const byFrom = new Map(PEOPLE.flatMap((p) => p.from.map((t) => [t, p.id])));
for (const r of d.recipes) {
  if (r.personId !== undefined) continue; // already linked (or deliberately left empty)
  const id = r.from ? byFrom.get(r.from.trim()) : null;
  if (r.from && !id) { log.push(`NOT MATCHED: "${r.from}" on ${r.id}`); continue; }
  r.personId = id || null;
  if (id) {
    const name = d.people.find((x) => x.id === id).name;
    if (r.from !== name) r.fromAsWritten = r.from; // keep what the page said
    r.from = name;
  }
}
fs.writeFileSync(f, JSON.stringify(d, null, 2) + "\n");
console.log(log.join("\n") || "nothing new");
for (const p of d.people) {
  const rs = d.recipes.filter((r) => r.personId === p.id);
  console.log(`${p.name.padEnd(24)} ${String(rs.length).padStart(2)} recipe(s)${rs.filter((r) => r.checked).length ? `, ${rs.filter((r) => r.checked).length} live` : ""}  ${p.relation ? "· " + p.relation : ""}`);
}
console.log("recipes with nobody yet:", d.recipes.filter((r) => !r.personId).length);

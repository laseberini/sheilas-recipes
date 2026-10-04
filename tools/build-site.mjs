// Builds the site's recipe data (recipes-data.js, next to index.html) from data/recipes.json + data/photos.json.
// Only recipes ticked "Checked" in the editor go live; only photos Sheila approved are shown.
// Usage: node tools/build-site.mjs   → prints the image files the live recipes need (to git add).

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";
import os from "node:os";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const data = JSON.parse(fs.readFileSync(path.join(ROOT, "data", "recipes.json"), "utf8"));
const photos = JSON.parse(fs.readFileSync(path.join(ROOT, "data", "photos.json"), "utf8"));

// Never published: printed personal emails (addresses, family news), and a printed cookbook page
// (Roz's Minute Cake - only her transcribed version goes on the site).
const PRIVATE_PAGES = ["p170357", "p170405", "p-roz-minute-cake"];
// Other names a recipe goes by in other recipes' text, so those mentions link too.
const ALIASES = { "alettas-pesto-sauce": ["Pesto Sauce"], "neopolitan-sauce": ["Neopolitan Sauce", "Neapolitan"] };

const clean = (s) => String(s).replace(/\[\?\]|\[illegible\]/g, "").replace(/\s{2,}/g, " ").replace(/\s+([,.!])/g, "$1").trim();
const lines = (a) => (a || []).map(clean).filter(Boolean);
const exists = (rel) => fs.existsSync(path.join(ROOT, rel));

const live = data.recipes.filter((r) => r.checked);
const liveIds = new Set(live.map((r) => r.id));
const files = new Set(["images/sheila.jpg", `images/pages/${data.intro.page}.jpg`]);
// Small copies for where photos show small (made by tools/make-thumbs.ps1); the full photo is kept for big views.
const thumbJobs = [];
const thumb = (src, w) => {
  const dest = src.replace(/^images\//, "images/thumbs/");
  thumbJobs.push({ src, dest, w });
  files.add(dest);
  return dest;
};
thumb("images/sheila.jpg", 900);
const recipes = {};
const problems = [];

for (const r of live) {
  const pages = (r.pages || []).filter((p) => !PRIVATE_PAGES.includes(p) && exists(`images/pages/${p}.jpg`));
  pages.forEach((p) => files.add(`images/pages/${p}.jpg`));
  if (pages.length < (r.pages || []).length) problems.push(`${r.id}: some pages left out (private or missing)`);

  const ph = photos[r.id];
  const photoFile = `images/dishes/${r.id}.jpg`;
  const hasPhoto = ph?.status === "approved" && exists(photoFile);
  if (hasPhoto) files.add(photoFile);

  const serves = clean(r.serves || "");
  recipes[r.id] = {
    title: clean(r.title), from: clean(r.from || "") || null, date: clean(r.date || "") || null, serves: serves || null,
    category: r.category,
    person: r.personId || null,
    pages: pages.map((p) => `images/pages/${p}.jpg`),
    pageThumbs: pages.map((p) => thumb(`images/pages/${p}.jpg`, 240)),
    photo: hasPhoto ? photoFile : null,
    thumb: hasPhoto ? thumb(photoFile, 200) : null,
    photoReal: hasPhoto && ph.source === "real",
    uses: (r.uses || []).filter((id) => liveIds.has(id)),
    ...(ALIASES[r.id] ? { aliases: ALIASES[r.id] } : {}),
    ingredients: lines(r.ingredients),
    // The site numbers the steps itself, so her own "1." / "2)" at the start of a step would double up.
    method: lines(r.method).map((m) => m.replace(/^\d+\s*[.)]\s+/, "")),
    // "Serves 6-8" is already shown at the top.
    notes: lines(r.notes).filter((n) => !serves || n.replace(/\.$/, "").toLowerCase() !== `serves ${serves}`.toLowerCase()),
  };
}

// Only the people behind live recipes are published (with their photo, if they have one).
const people = {};
for (const p of data.people || []) {
  if (!Object.values(recipes).some((r) => r.person === p.id)) continue;
  const photo = p.photo && exists(p.photo) ? p.photo : null;
  if (photo) files.add(photo);
  people[p.id] = { name: clean(p.name), relation: clean(p.relation || "") || null, bio: clean(p.bio || "") || null, photo };
}
for (const r of Object.values(recipes)) if (r.person && !people[r.person]) r.person = null;

// Lists sort by the dish, not the person: "Nonna's Polpette" goes under P.
const possessiveOf = (n) => (/s$/i.test(n) ? `${n}'` : `${n}'s`);
for (const r of Object.values(recipes)) {
  const p = r.person && people[r.person];
  const names = p ? [p.name, p.name.replace(/^the\s+/i, "").split(/\s+/)[0]] : [];
  const prefix = names.map((n) => `${possessiveOf(n)} `).find((pre) => r.title.startsWith(pre));
  if (prefix) r.sortName = r.title.slice(prefix.length);
}
const byTitle = (a, b) => (recipes[a].sortName || recipes[a].title).localeCompare(recipes[b].sortName || recipes[b].title);
const MOCK = {
  people,
  categories: data.categories
    .map((name) => ({ name, ids: Object.keys(recipes).filter((id) => recipes[id].category === name).sort(byTitle) }))
    .filter((c) => c.ids.length),
  intro: data.intro.paragraphs,
  introPage: `images/pages/${data.intro.page}.jpg`,
};

const jobsFile = path.join(os.tmpdir(), "sheilas-thumb-jobs.json");
fs.writeFileSync(jobsFile, JSON.stringify(thumbJobs));
process.stdout.write(execFileSync("powershell", ["-NoProfile", "-ExecutionPolicy", "Bypass", "-File", path.join(ROOT, "tools", "make-thumbs.ps1"), "-Jobs", jobsFile], { encoding: "utf8" }));

// One tiny page per live recipe (r/<id>.html) for sharing: WhatsApp and friends read its preview tags (the
// dish photo, name and whose recipe) and people who open it are sent straight on to the recipe.
const SITE = "https://laseberini.github.io/sheilas-recipes/";
const attr = (s) => String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
const possessive = (n) => (/s$/i.test(n) ? `${n}'` : `${n}'s`);
const shareLine = (r) => {
  const p = r.person && people[r.person];
  const who = !p ? "From " : r.person === "sheila" ? "Sheila's own recipe, from " : `${possessive(p.name)} recipe, from `;
  return `${who}Sheila's Recipes, our family recipe book.`;
};
fs.mkdirSync(path.join(ROOT, "r"), { recursive: true });
for (const [id, r] of Object.entries(recipes)) {
  const page = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${attr(r.title)} · Sheila's Recipes</title>
<meta property="og:site_name" content="Sheila's Recipes">
<meta property="og:type" content="article">
<meta property="og:title" content="${attr(r.title)}">
<meta property="og:description" content="${attr(shareLine(r))}">
<meta property="og:image" content="${SITE}${r.photo || "images/thumbs/sheila.jpg"}">
<meta property="og:url" content="${SITE}r/${id}.html">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" type="image/png" sizes="32x32" href="../images/icons/sheila-32.png">
<script>location.replace("../#recipe-${id}");</script>
</head>
<body><p><a href="../#recipe-${id}">Open ${attr(r.title)}</a></p></body>
</html>
`;
  const rel = `r/${id}.html`;
  if (!exists(rel) || fs.readFileSync(path.join(ROOT, rel), "utf8") !== page) fs.writeFileSync(path.join(ROOT, rel), page);
  files.add(rel);
}
// Recipes taken off the site lose their share page too (git rm the ones printed).
for (const f of fs.readdirSync(path.join(ROOT, "r"))) {
  if (f.endsWith(".html") && !recipes[f.slice(0, -5)]) { fs.unlinkSync(path.join(ROOT, "r", f)); console.log(`REMOVED r/${f}`); }
}

const out = `// Generated by tools/build-site.mjs from data/recipes.json - don't edit by hand.
// ${live.length} checked recipes.
const RECIPES = ${JSON.stringify(recipes, null, 2)};

const MOCK = ${JSON.stringify(MOCK, null, 2)};
`;
fs.writeFileSync(path.join(ROOT, "recipes-data.js"), out);

console.log(`${live.length} live recipes (${Object.values(recipes).filter((r) => r.photo).length} with a photo)`);
for (const c of MOCK.categories) console.log(`  ${c.name}: ${c.ids.map((id) => recipes[id].title).join(", ")}`);
for (const p of problems) console.log("NOTE", p);
console.log("FILES " + [...files].join(" "));

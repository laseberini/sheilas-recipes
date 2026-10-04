// Adds Nonna's Italian Green Beans & Potatoes (from "Recipe images/Nonna's Italian Green Beans & Potatoes.txt",
// 2026-10-04). Idempotent: skips it if already there. Backs up recipes.json first.
// Usage: node tools/add-green-beans.cjs
const fs = require("fs");
const path = require("path");
const ROOT = path.resolve(__dirname, "..");
const FILE = path.join(ROOT, "data", "recipes.json");
const data = JSON.parse(fs.readFileSync(FILE, "utf8"));

const recipe = {
  id: "nonna-s-italian-green-beans-potatoes",
  title: "Nonna's Italian Green Beans & Potatoes",
  titleInvented: false,
  from: "Nonna",
  personId: "nonna",
  fromAsWritten: "Nonna",
  date: null,
  category: "Vegetables & Sides",
  serves: null,
  pages: [],
  kind: "typed",
  ingredients: [
    "500g green beans, trimmed",
    "4 medium potatoes, cubed",
    "3 tablespoons olive oil",
    "2-3 cloves garlic, sliced",
    "Salt & pepper",
    "Optional: lemon juice, parsley, butter, parmesan",
  ],
  method: [
    "Boil the potatoes in salted water for 12-15 minutes till just tender. Add the green beans for the last 6-7 minutes. Drain.",
    "In a big pan, heat the olive oil & fry the garlic for 30 seconds till fragrant (don't burn it).",
    "Add the potatoes & beans & toss gently. Season well with salt & pepper. Fry for 4-5 minutes till the edges are golden.",
    "Finish with parsley & a squeeze of lemon, or a knob of butter & parmesan.",
  ],
  notes: ["Fagiolini e Patate all'Aglio e Olio - green beans & potatoes with garlic & olive oil."],
  uncertain: [],
  transcriberNotes: ["From a typed text file."],
  checked: false,
  engineer: null,
  uses: [],
  asWritten: {
    title: "Italian Green Beans & Potatoes — Fagiolini e Patate all'Aglio e Olio",
    ingredients: [
      "You need:",
      "500g green beans, trimmed",
      "4 medium potatoes, cubed",
      "3 tbsp olive oil",
      "2-3 cloves garlic, sliced",
      "Salt, pepper",
      "Optional: lemon juice, parsley, butter, parmesan",
    ],
    method: [
      "1.  Boil potatoes in salted water 12-15 mins till just tender. Add green beans for last 6-7 mins. Drain.",
      "2.  In a big pan, heat olive oil, fry garlic 30 secs till fragrant (don't burn).",
      "3.  Add potatoes + beans, toss gently. Season well with salt & pepper. Fry 4-5 mins till edges golden.",
      "4.  Finish with parsley and squeeze of lemon, or a knob of butter + parmesan.",
    ],
    notes: [],
  },
};

if (data.recipes.some((r) => r.id === recipe.id)) return console.log("Nothing to add - already there.");
data.recipes.push(recipe);
const stamp = new Date().toISOString().replace(/[:.]/g, "-");
fs.copyFileSync(FILE, path.join(ROOT, "data", "backups", `recipes-${stamp}-before-green-beans.json`));
fs.writeFileSync(FILE, JSON.stringify(data, null, 2) + "\n");
console.log("Added: " + recipe.id);

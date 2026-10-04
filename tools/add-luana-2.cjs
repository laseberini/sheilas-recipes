// Adds two more of Luana's recipes (from "Recipe images", 2026-10-04): Coniglio al Forno and Fagiolini e Patate
// al Pomodoro. Idempotent: skips anything already there. Backs up recipes.json first.
// Usage: node tools/add-luana-2.cjs
const fs = require("fs");
const path = require("path");
const ROOT = path.resolve(__dirname, "..");
const FILE = path.join(ROOT, "data", "recipes.json");
const data = JSON.parse(fs.readFileSync(FILE, "utf8"));

const base = { titleInvented: false, from: "Luana", personId: "luana", fromAsWritten: "Luana", date: null, serves: null, pages: [],
  kind: "typed", uncertain: [], checked: false, engineer: null, uses: [] };
const recipes = [
  {
    ...base,
    id: "luana-s-coniglio-al-forno",
    title: "Luana's Coniglio al Forno",
    category: "Meat, Chicken & Fish",
    ingredients: [
      "1 whole rabbit, jointed (about 1.2kg) - ask the butcher to cut it",
      "4 tablespoons olive oil",
      "3 cloves garlic, crushed",
      "1 sprig rosemary & a few sage leaves",
      "½ cup white wine",
      "½ cup chicken stock or water",
      "3-4 potatoes, cubed (optional but great - they roast in the juices)",
      "Salt, pepper & chilli flakes",
      "Lemon juice",
    ],
    method: [
      "Marinate (if you have time): rub the rabbit with salt, pepper, garlic, rosemary, olive oil & a squeeze of lemon. Leave for 30 minutes to 2 hours in the fridge. If there's no time, go straight to cooking.",
      "Heat the oven to 200°C. In a big oven dish or roasting pan, heat the olive oil on the stove. Brown the rabbit pieces well, 3-4 minutes per side. Don't crowd them.",
      "Add the garlic, rosemary & sage. Pour in the white wine & let it bubble for 2 minutes.",
      "Add the potatoes around the meat, with salt, pepper & chilli. Pour the stock into the bottom.",
      "Roast uncovered for 40-50 minutes, turning the pieces halfway & basting with the juices. It should be golden & tender. If it's drying out, cover with foil for the last 10 minutes & splash in a little more water.",
      "Rest for 5 minutes, squeeze over lemon & drizzle the pan juices over.",
    ],
    notes: [
      "Italian roast rabbit.",
      "Serve with Luana's Fagiolini e Patate al Pomodoro (green beans & potatoes in tomato), or simple roast potatoes & a green salad. Crusty bread to mop up.",
      "Old Italian trick: add a few pitted black olives & a spoon of capers to the pan for extra flavour.",
    ],
    transcriberNotes: ["From a typed text file. 'That green beans & potatoes in tomato you asked about' changed to the name of her recipe on this site."],
    asWritten: {
      title: "Coniglio al Forno — Italian roast rabbit",
      ingredients: [
        "You need:",
        "1 whole rabbit, jointed (about 1.2kg) — ask butcher to cut it",
        "4 tbsp olive oil",
        "3 cloves garlic, crushed",
        "1 sprig rosemary, few sage leaves",
        "1/2 cup white wine",
        "1/2 cup chicken stock or water",
        "3-4 potatoes, cubed (optional but great, they roast in the juices)",
        "Salt, pepper, chilli flakes",
        "Lemon juice",
      ],
      method: [
        "1.  Marinate (if you have time): Rub rabbit with salt, pepper, garlic, rosemary, olive oil, squeeze of lemon. Leave 30 mins — 2 hours in fridge. If no time, just go straight to cooking.",
        "2.  Heat oven to 200C. In a big oven dish or roasting pan, heat olive oil on stove. Brown rabbit pieces well, 3-4 mins per side. Don't crowd.",
        "3.  Add garlic, rosemary, sage. Pour white wine, let it bubble 2 mins.",
        "4.  Add potatoes around the meat, salt, pepper, chilli. Pour stock in bottom.",
        "5.  Roast uncovered 40-50 mins, turning pieces halfway, basting with juices. Should be golden and tender. If drying out, cover with foil last 10 mins and splash a little more water.",
        "6.  Rest 5 mins, squeeze lemon, drizzle pan juices over.",
      ],
      notes: [
        "Serve with: that green beans & potatoes in tomato you asked about, or simple roast potatoes and a green salad. Crusty bread to mop up.",
        "Old Italian trick: add a few pitted black olives and a spoon of capers to the pan for extra flavour.",
      ],
    },
  },
  {
    ...base,
    id: "luana-s-fagiolini-e-patate-al-pomodoro",
    title: "Luana's Fagiolini e Patate al Pomodoro",
    category: "Vegetables & Sides",
    ingredients: [
      "500g green beans, trimmed",
      "3 medium potatoes, peeled & cubed",
      "1 tin (400g) chopped tomatoes or passata",
      "1 small onion, chopped",
      "2 cloves garlic, minced",
      "Olive oil, salt, pepper & chilli flakes",
      "Handful of fresh basil or parsley",
      "Parmesan (optional)",
    ],
    method: [
      "In a big pot, heat olive oil. Fry the onion for 3-4 minutes till soft. Add the garlic for 30 seconds.",
      "Add the potatoes & stir to coat. Fry for 2 minutes.",
      "Add the tomatoes, ½ cup water, salt, pepper & a pinch of chilli. Bring to a simmer.",
      "Add the green beans & push them into the sauce. Cover & cook on low for 20-25 minutes till the potatoes are soft & the beans tender. Stir once or twice so it doesn't catch.",
      "Taste - needs more salt? Add the basil or parsley at the end.",
      "Drizzle good olive oil on top. Sprinkle with parmesan if you have.",
    ],
    notes: [
      "Green beans & potatoes in tomato. It's cheap, easy & goes great with polpette.",
      "Serve as is with bread, or as a side to meat. Even better the next day.",
      "One of Nonna's favourite dishes...",
    ],
    transcriberNotes: ["From a typed text file. A stray '*' after the title left out."],
    asWritten: {
      title: "Fagiolini e patate al pomodoro*",
      ingredients: [
        "You need:",
        "500g green beans, trimmed",
        "3 medium potatoes, peeled and cubed",
        "1 tin (400g) chopped tomatoes or passata",
        "1 small onion, chopped",
        "2 cloves garlic, minced",
        "Olive oil, salt, pepper, chilli flakes",
        "Handful fresh basil or parsley",
        "Optional: parmesan",
      ],
      method: [
        "1.  In a big pot, heat olive oil. Fry onion 3-4 mins till soft. Add garlic 30 secs.",
        "2.  Add potatoes, stir to coat. Fry 2 mins.",
        "3.  Add tomatoes, 1/2 cup water, salt, pepper, pinch chilli. Bring to simmer.",
        "4.  Add green beans, push them into sauce. Cover, cook on low 20-25 mins till potatoes are soft and beans are tender. Stir once or twice so it doesn't catch.",
        "5.  Taste — needs more salt? Add basil/parsley at the end.",
        "6.  Drizzle good olive oil on top. Sprinkle parmesan if you have.",
      ],
      notes: [
        "It's cheap, easy, and goes great with polpette.",
        "Serve as is with bread, or as a side to meat. Even better the next day.",
        "One of Nonna's favorite dishes....",
      ],
    },
  },
];

const added = [];
for (const r of recipes) if (!data.recipes.some((x) => x.id === r.id)) { data.recipes.push(r); added.push(r.id); }
if (!added.length) return console.log("Nothing to add - already there.");
const stamp = new Date().toISOString().replace(/[:.]/g, "-");
fs.mkdirSync(path.join(ROOT, "data", "backups"), { recursive: true });
fs.copyFileSync(FILE, path.join(ROOT, "data", "backups", `recipes-${stamp}-before-luana-2.json`));
fs.writeFileSync(FILE, JSON.stringify(data, null, 2) + "\n");
console.log("Added: " + added.join(", "));

// Adds Luana's Peperoni Verdi Ripieni (from "Recipe images/Luana Peperoni Verdi Ripieni.txt", 2026-10-04) and
// Luana to People. Idempotent: skips anything already there. Backs up recipes.json first.
// Usage: node tools/add-luana.cjs
const fs = require("fs");
const path = require("path");
const ROOT = path.resolve(__dirname, "..");
const FILE = path.join(ROOT, "data", "recipes.json");
const data = JSON.parse(fs.readFileSync(FILE, "utf8"));

const person = { id: "luana", name: "Luana", relation: "Sheila's sister-in-law", bio: "", photo: null };
const recipe = {
  id: "luana-s-peperoni-verdi-ripieni",
  title: "Luana's Peperoni Verdi Ripieni",
  titleInvented: false,
  from: "Luana",
  personId: "luana",
  fromAsWritten: "Luana",
  date: null,
  category: "Meat, Chicken & Fish",
  serves: null,
  pages: [],
  kind: "typed",
  ingredients: [
    "4 large green peppers, tops cut off & seeds out",
    "400g beef mince (or half beef, half pork)",
    "1 cup cooked rice or 1 cup breadcrumbs",
    "1 small onion, finely chopped",
    "2 cloves garlic, minced",
    "400g tin chopped tomatoes or passata (half for the filling, half for the sauce)",
    "1 egg",
    "Handful of parmesan, parsley & basil",
    "Olive oil, salt, pepper & oregano",
  ],
  method: [
    "Prep the peppers: rub with olive oil & place upright in an oven dish. Par-bake for 10 minutes at 180°C so they soften a bit.",
    "Filling: fry the onion & garlic in olive oil for 3 minutes. Add the mince & brown it. Add half the tomatoes, oregano, salt & pepper. Cook for 5 minutes till thick, not watery. Take off the heat.",
    "Mix in the cooked rice (or breadcrumbs), egg, parmesan & parsley. It should be moist but hold together.",
    "Stuff: spoon the filling into the peppers & really pack it. Pour the remaining tomato sauce around the bottom of the dish with ¼ cup water.",
    "Bake: cover with foil, 180°C for 30 minutes. Remove the foil, sprinkle more parmesan on top & bake another 10-15 minutes till the peppers are soft & the tops golden.",
  ],
  notes: [
    "Italian stuffed green peppers. So good! Makes 4.",
    "Want it saucier? Pour all the sauce over & around.",
    "No rice? Use soaked bread - very Italian nonna style.",
    "Add a cube of mozzarella inside each for a cheesy centre.",
  ],
  uncertain: [],
  transcriberNotes: ["From a typed text file. Basil is in the ingredients but not mentioned in the method."],
  checked: false,
  engineer: null,
  uses: [],
  asWritten: {
    title: "Peperoni Verdi Ripieni — Italian stuffed green peppers. So good.",
    ingredients: [
      "For 4 peppers:",
      "Filling:",
      "4 large green bell peppers,  tops cut off and seeds out",
      "400g beef mince (or half beef half pork)",
      "1 cup cooked rice OR 1 cup breadcrumbs",
      "1 small onion, finely chopped",
      "2 cloves garlic, minced",
      "400g tin chopped tomatoes / passata, half for filling, half for sauce",
      "1 egg",
      "Handful parmesan, parsley, basil",
      "Olive oil, salt, pepper, oregano",
    ],
    method: [
      "1.  Prep peppers: Rub with olive oil, place upright in an oven dish. Par-bake 10 mins at 180C so they soften a bit.",
      "2.  Filling: Fry onion + garlic in olive oil 3 mins. Add mince, brown it. Add half the tomatoes, oregano, salt, pepper. Cook 5 mins till thick, not watery. Take off heat.",
      "3.  Mix in cooked rice (or breadcrumbs), egg, parmesan, parsley. Should be moist but hold together.",
      "4.  Stuff: Spoon filling into peppers, really pack it. Pour remaining tomato sauce around the bottom of the dish with 1/4 cup water.",
      "5.  Bake: Cover with foil, 180C for 30 mins. Remove foil, sprinkle more parmesan on top, bake another 10-15 mins till peppers are soft and tops golden.",
    ],
    notes: [
      "Tips:",
      "Want it saucier? Pour all the sauce over and around.",
      "No rice? Use soaked bread — very Italian nonna style.",
      "Add mozzarella cube inside each for cheesy centre.",
    ],
  },
};

const added = [];
data.people ||= [];
if (!data.people.some((p) => p.id === person.id)) { data.people.push(person); added.push(`person ${person.id}`); }
if (!data.recipes.some((r) => r.id === recipe.id)) { data.recipes.push(recipe); added.push(`recipe ${recipe.id}`); }
if (!added.length) return console.log("Nothing to add - already there.");
const stamp = new Date().toISOString().replace(/[:.]/g, "-");
fs.mkdirSync(path.join(ROOT, "data", "backups"), { recursive: true });
fs.copyFileSync(FILE, path.join(ROOT, "data", "backups", `recipes-${stamp}-before-luana.json`));
fs.writeFileSync(FILE, JSON.stringify(data, null, 2) + "\n");
console.log("Added: " + added.join(", "));

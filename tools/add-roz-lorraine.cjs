// Adds three recipes Laurence dropped into "Recipe images" (2026-10-04): Roz's Minute Cake (photo of a
// cookbook page with her notes), Roz's Butternut & Roast Vegetables (text) and Lorraine's Cheese Cake (Word doc).
// Also adds Roz and Lorraine to People. Idempotent: skips anything already there. Backs up recipes.json first.
// Usage: node tools/add-roz-lorraine.cjs
const fs = require("fs");
const path = require("path");
const ROOT = path.resolve(__dirname, "..");
const FILE = path.join(ROOT, "data", "recipes.json");
const data = JSON.parse(fs.readFileSync(FILE, "utf8"));

const people = [
  { id: "roz", name: "Roz", relation: "Sheila's sister", bio: "", photo: null },
  { id: "lorraine", name: "Lorraine", relation: "Sheila's sister", bio: "", photo: null },
];

const base = { titleInvented: false, date: null, serves: null, uncertain: [], checked: false, engineer: null, uses: [] };
const recipes = [
  {
    ...base,
    id: "roz-s-minute-cake",
    title: "Roz's Minute Cake",
    from: "Roz",
    personId: "roz",
    fromAsWritten: "Roz",
    category: "Baking",
    pages: ["p-roz-minute-cake"],
    kind: "mixed",
    ingredients: ["1½ cups flour", "¾ cup sugar", "2 teaspoons baking powder", "¼ teaspoon salt", "½ cup milk", "2 eggs", "Vanilla", "125g butter"],
    method: [
      "Sift dry ingredients into a large bowl.",
      "Make a well in the centre. Add milk, vanilla & eggs.",
      "Lastly add butter, which must be very soft but not lumpy. Mix well.",
      "Bake in a holey (ring) cake tin at 175°C for 45-50 minutes.",
    ],
    notes: [
      "Apple Minute Cake: cut 1 large apple into 16 segments & push into the batter all round the edge of the cake. Cover the cake with cinnamon & sugar.",
      "Marble Minute Cake: remove ⅓ of the batter & blend with 1 tablespoon cocoa mixed with a little extra milk & sugar. Pour the white batter into the tin, then drop spoonfuls of cocoa batter over it & streak it slightly.",
    ],
    uncertain: ["'Holey cake tin' handwritten in red over the printed 'loaf tin' - read as a ring tin (with a hole in the middle)"],
    transcriberNotes: [
      "Printed page 56 of a community cookbook (recipe no. 98), credited in print to Helen Aron. Roz's handwritten changes: 'loaf tin' crossed out and 'Holey cake tin' written in red; 'cover cake with cinnamon + sugar' added in blue to the Apple variation.",
      "The top of the page is the end of another recipe (credited to Ethel Balkind) - not transcribed.",
    ],
    asWritten: {
      title: "Minute Cake",
      ingredients: ["1½ cups flour", "¾ cup sugar", "2 teaspoons baking powder", "¼ teaspoon salt", "½ cup milk", "2 eggs", "Vanilla", "125g butter"],
      method: [
        "Sift dry ingredients into large bowl. Make well in centre. Add milk, vanilla and eggs. Lastly add butter which must be very soft but not lumpy. Mix well. Bake in loaf tin. [loaf tin crossed out] Holey cake tin",
        "Temperature: 175°C. Time: 45-50 minutes.",
      ],
      notes: [
        "Variations:",
        "Apple Minute Cake — Cut 1 large apple into 16 segments and push into batter all round edge of cake. cover cake with cinnamon + sugar",
        "Marble Minute Cake — Remove ⅓ batter and blend with 1 tablespoon cocoa mixed with little extra milk and sugar. Pour white batter into tin. Then drop spoonful of cocoa batter over this and streak it slightly.",
        "Helen Aron",
      ],
    },
  },
  {
    ...base,
    id: "roz-s-butternut-roast-vegetables",
    title: "Roz's Butternut & Roast Vegetables",
    from: "Roz",
    personId: "roz",
    fromAsWritten: "Roz",
    category: "Vegetables & Sides",
    pages: [],
    kind: "typed",
    ingredients: [
      "Butternut:",
      "Whole butternuts",
      "Brown sugar",
      "Cinnamon",
      "Baked vegetables:",
      "Butternut, pumpkin, sweet potatoes, carrots & baby potatoes",
      "Garlic (optional)",
      "Olive oil & coconut oil",
      "Spices for vegetables (from Woolies etc)",
      "Mielie chunks",
    ],
    method: [
      "Butternut:",
      "Bake whole butternuts till soft.",
      "Split in half & remove and discard the seeds.",
      "Sprinkle over brown sugar & cinnamon & bake till brown & delicious.",
      "Baked vegetables:",
      "Cut the raw vegetables into chunks.",
      "Pour over olive oil & coconut oil & the vegetable spices, then bake.",
      "Before serving, bake mielie chunks in vegetable spices & oil & add to the other baked vegetables.",
    ],
    notes: [
      "We buy and use a multitude of herbs and spices and add them to create taste changes.",
      "Only use extra virgin olive oil for salad, never for cooking. For cooking: ordinary olive oil, canola & coconut oil.",
    ],
    transcriberNotes: [
      "From a text message (with food emojis, left out). No oven temperature or times given; 'then bake' added to the vegetables step, which the heading 'Baked vegetables' implies.",
    ],
    asWritten: {
      title: "Roz's Butternut and Roast Vegetables",
      ingredients: [],
      method: [
        "BUTTERNUT Bake whole butternuts till soft",
        "Split in half and remove and discard seeds .",
        "Sprinkle over brown sugar and cinnamon and bake till brown and delicious",
        "BAKED vegetables",
        "Cut into chunks raw",
        "Butternut, pumpkin, sweet potatoes, carrots baby potatoes garlic is optional",
        "Pour over olive oil and coconut oil and spices for vegetables from Woollies etc",
        "Then before serving bake mielie chunks in veg spices ( woollies etc) oil and add to other baked vegetables",
      ],
      notes: [
        "We buy and use a multitude of herbs and spices and add to create taste changes .",
        "Only use extra virgin olive oil for salad but never for cooking",
        "For cooking ordinary olive oil, canola and coconut oil",
      ],
    },
  },
  {
    ...base,
    id: "lorraine-s-cheese-cake",
    title: "Lorraine's Cheese Cake",
    from: "Lorraine",
    personId: "lorraine",
    fromAsWritten: "Lorraine",
    category: "Desserts",
    pages: [],
    kind: "typed",
    ingredients: [
      "Crust:",
      "1 packet Marie biscuits",
      "Melted butter",
      "Filling:",
      "750g cream cheese",
      "250ml cream",
      "3 eggs & 1 extra egg white",
      "¾ cup sugar",
      "1 full dessertspoon flour",
      "1 level dessertspoon custard powder",
      "1 tablespoon brandy",
      "1 tablespoon lemon juice",
    ],
    method: [
      "Crust:",
      "Crush the Marie biscuits in a food processor. Add enough melted butter to make them sticky.",
      "Line a springform pan with this.",
      "Filling:",
      "Separate the eggs.",
      "Mix all the ingredients together by hand till smooth, except the egg whites.",
      "Beat the whites till stiff & lastly fold into the mixture.",
      "Pour into the crust & bake at 180°C for 20-25 minutes (do not open the oven!).",
      "Then switch off the oven & leave for another 40-45 minutes in the oven. Remember not to open the oven until the 40-45 minutes are up.",
      "Warm up before serving, then remove the springform, place on a platter & enjoy!",
    ],
    notes: ["This freezes very well. Freeze with the springform still on & wrap well in Glad Wrap."],
    uncertain: ["'3 eggs and 1 white' - read as 3 eggs plus 1 extra egg white"],
    transcriberNotes: [
      "From a Word document, typed mostly in capitals. Left out the imperial amounts in brackets (1,5 lb, ½ pt, 350°F).",
    ],
    asWritten: {
      title: "CHEESE CAKE",
      ingredients: [
        "CRUST",
        "FILLING",
        "750 G (1,5LB) CREAM CHEESE",
        "250 ML (.5 PT CREAM)",
        "3 EGGS AND 1 WHITE",
        "¾ CUP SUGAR",
        "1 FULL DESERTSPOON FLOUR",
        "L LEVEL DESERTSPOON CUSTARD POWNER",
        "1 TABLESPOON BRANDY",
        "1 TABLESPOON LEMON JUICE",
      ],
      method: [
        "In food processor crush 1 pkt marie biscuits. Add melted butter enough to make the marie biscuits sticky. Line a spring form pan with this.",
        "Separate eggs. Mix all ingredients together by hand till smooth excepting egg whites. Beat whites till stiff and lastly fold into the mixture. Pour into the crust and bake",
        "BAKE 180 DEG (350f) FOR 20-25 MINS (do not open the oven!), then switch off the oven and LEAVE FOR ANOTHER 40-45 MINS IN OVEN. REMEMBER NOT TO OPEN OVEN UNTIL THE 40-45 MINUTES ARE UP.",
        "Warm up before serving then remove spring form place on a platter and enjoy!",
      ],
      notes: ["This freezes very well. Freeze with spring form still on and wrap well in glad wrap."],
    },
  },
];

const added = [];
data.people ||= [];
for (const p of people) if (!data.people.some((x) => x.id === p.id)) { data.people.push(p); added.push(`person ${p.id}`); }
for (const r of recipes) if (!data.recipes.some((x) => x.id === r.id)) { data.recipes.push(r); added.push(`recipe ${r.id}`); }

if (!added.length) return console.log("Nothing to add - already there.");
const stamp = new Date().toISOString().replace(/[:.]/g, "-");
fs.mkdirSync(path.join(ROOT, "data", "backups"), { recursive: true });
fs.copyFileSync(FILE, path.join(ROOT, "data", "backups", `recipes-${stamp}-before-roz-lorraine.json`));
fs.writeFileSync(FILE, JSON.stringify(data, null, 2) + "\n");
console.log("Added: " + added.join(", "));

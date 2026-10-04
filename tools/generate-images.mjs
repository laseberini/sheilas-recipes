// Generate dish photos with the Gemini API.
// Usage: node tools/generate-images.mjs [--only fish-cakes] [--styles home,magazine]
// Reads GEMINI_API_KEY from .dev.vars (never committed). Writes JPEGs to images/style-tests/.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(ROOT, "images", "style-tests");
const MODEL = process.env.GEMINI_IMAGE_MODEL || "gemini-3.1-flash-image";

function readKey() {
  const line = fs.readFileSync(path.join(ROOT, ".dev.vars"), "utf8")
    .split(/\r?\n/)
    .find((l) => l.startsWith("GEMINI_API_KEY="));
  const key = line?.slice("GEMINI_API_KEY=".length).trim().replace(/^["']|["']$/g, "");
  if (!key) throw new Error("GEMINI_API_KEY missing from .dev.vars");
  return key;
}

// What each dish looks like, written from her recipes.
const DISHES = {
  "lemon-meringue-rect": "a homemade South African lemon meringue pudding baked in a rectangular dish: a crushed Marie " +
    "biscuit base, a pale yellow condensed-milk lemon filling and soft swirled meringue with lightly browned peaks covering " +
    "the whole dish; one corner square has been cut and lifted onto a small white plate beside the dish so the three layers " +
    "show",
  "alettas-pesto-sauce": "freshly made Genovese basil pesto (blended in a food processor with basil, olive oil, pine nuts, " +
    "garlic, pecorino and a little butter): a vivid green, slightly coarse, glossy pesto in a small white ceramic bowl with " +
    "a teaspoon resting in it, a few fresh basil leaves and a small piece of pecorino beside the bowl",
  "fish-cakes": "homemade South African fish cakes: six flattened, round pan-fried hake fish cakes with a golden-brown " +
    "breadcrumb crust, slightly irregular hand-shaped edges, tiny flecks of carrot and onion visible where one is broken open; " +
    "served with a few thick-cut chips, a simple green salad and a small bowl of chrain (a finely grated, moist, deep magenta beetroot-and-horseradish relish with a fine texture, not chunky)",
  "roz-s-minute-cake": "a simple homemade vanilla butter cake baked in a ring tin (a round tube pan with a hole in the " +
    "middle), turned out whole onto a white plate: a plain golden-brown crust, slightly domed and a little cracked on top, " +
    "no icing; one slice cut and lying beside it so the soft, pale yellow, fine crumb shows",
  "roz-s-butternut-roast-vegetables": "a white ceramic oven dish full of well-roasted, colourful home-roasted " +
    "vegetables and nothing else beside the dish: chunks of deep orange butternut and pumpkin, bright orange sweet potato, " +
    "carrots and golden halved baby potatoes, all properly roasted with deeply browned, caramelised, slightly charred edges, " +
    "glossy with olive oil and flecked with herbs and vegetable spice, with a few roasted mielie (corn on the cob) chunks " +
    "with charred kernels tucked in among them; rich, vivid, varied colours",
  "luana-s-peperoni-verdi-ripieni": "Italian stuffed green peppers (peperoni verdi ripieni) baked in a white oven dish: " +
    "four large green bell peppers standing upright with their tops cut off, soft and slightly blistered from the oven, " +
    "each packed to the top with a beef mince and rice filling flecked with parsley, the tops golden with melted, browned " +
    "parmesan; a rich red tomato sauce bubbling around the bottom of the dish, a few torn basil leaves",
  "luana-s-coniglio-al-forno": "Italian roast rabbit (coniglio al forno) in a white roasting dish: jointed rabbit pieces " +
    "roasted golden-brown and glistening, with cubed potatoes browned and crisp at the edges roasting in the pan juices, " +
    "whole garlic cloves, sprigs of rosemary and a few sage leaves, a couple of lemon wedges; it looks like a rustic " +
    "Italian roast of meat pieces on the bone (no whole animal, no head, nothing that looks like a pet)",
  "luana-s-fagiolini-e-patate-al-pomodoro": "Italian green beans and potatoes stewed in tomato (fagiolini e patate al " +
    "pomodoro) in a white serving bowl: tender whole green beans and soft cubes of potato in a rich, chunky red tomato " +
    "sauce, a drizzle of glossy olive oil on top, torn fresh basil leaves and a little grated parmesan; homely and rustic",
  "nonna-s-italian-green-beans-potatoes": "Italian green beans and potatoes with garlic and olive oil (fagiolini e " +
    "patate all'aglio e olio) in a white serving bowl: bright green whole green beans tossed with chunks of boiled potato " +
    "that have been pan-fried in olive oil so their edges are lightly golden, thin slices of golden garlic, glossy with " +
    "olive oil, flecked with chopped fresh parsley and black pepper, a lemon wedge on the side",
  "lorraine-s-cheese-cake": "a homemade South African baked cheesecake on a white platter, out of its springform tin: a " +
    "thin crushed Marie biscuit crust around the base and side, a smooth, creamy, pale filling with a lightly golden top and " +
    "a slight crack, no topping; one slice cut and lifted onto a small plate beside it so the dense, creamy texture shows",
  "lemon-meringue": "a homemade South African lemon meringue tart in a round glass pie dish: a crushed Marie biscuit crust, " +
    "a pale yellow condensed-milk lemon filling, topped with soft swirled meringue with lightly browned peaks; one slice cut " +
    "out and lifted onto a small plate beside it so the three layers show",
};

const STYLES = {
  home: "Photograph style: an honest home-kitchen photo. Soft natural daylight from a window on the left, the dish on an " +
    "everyday ceramic plate on a worn wooden kitchen table, a folded tea towel and a fork nearby, shot at a 45-degree angle " +
    "with gentle depth of field. Warm, lived-in and real, like a family member photographed it just before eating.",
  magazine: "Photograph style: a bright modern food-magazine photo. Top-down flat lay on a white marble surface, crisp even " +
    "daylight, minimal styled props (a linen napkin, a lemon wedge, a few fresh herbs), clean negative space around the dish, " +
    "vivid true-to-life colour.",
  moody: "Photograph style: dark and moody fine-dining food photography. Dark slate surface and a near-black background, " +
    "a single low side light creating deep shadows and glossy highlights, a dark matte stoneware plate, close-up at a low " +
    "angle with shallow depth of field.",
  mediterranean: "Photograph style: a sunlit Mediterranean family table. Warm golden late-afternoon light, a hand-painted " +
    "blue-and-white ceramic plate on a rustic olive-wood board, a terracotta tile tabletop, a jug of water and a linen napkin " +
    "softly out of focus behind, relaxed and generous.",
};

// "Home-cooked" variations: real, a little imperfect, but still delicious.
const HOMECOOKED = "It should look genuinely home-cooked rather than styled: slightly uneven browning and shapes, a few " +
  "crumbs, an everyday plate, natural unprocessed colour, a real kitchen or dining room behind, like a candid photo taken " +
  "on a good phone. Imperfect but clearly delicious and appetising, never burnt, sloppy or unappealing.";
Object.assign(STYLES, {
  "home-plate": "Photograph style: a quick photo taken at the dinner table just before eating. Served simply on an " +
    "everyday patterned plate, a small smear of sauce and a few crumbs on the rim, a used fork, a glass of water, soft " +
    "evening kitchen light, the kitchen softly out of focus behind. " + HOMECOOKED,
  "home-stove": "Photograph style: moments after it was cooked, still in the pan or dish it was made in (or draining on " +
    "kitchen paper with a few oil spots), resting on the kitchen counter beside the stove, an oven glove or spatula " +
    "nearby, daylight from a kitchen window. " + HOMECOOKED,
  "home-table": "Photograph style: family-style on the dining table halfway through a meal: the serving dish with a " +
    "serving spoon in it and a portion or two already taken, side plates, a crumpled napkin, glasses, warm lamp light, " +
    "relaxed and lived-in. " + HOMECOOKED,
});

// Styles set in Sheila's own kitchen: her photos (Kitchen photos/ref, not committed) are sent as references.
const KITCHEN = "The reference photos show Sheila's real kitchen and her own serving dishes. Set the food in exactly this " +
  "place: the same white quartz kitchen island, the same round navy-blue woven placemat, the same bright, modern white " +
  "kitchen and natural daylight, served in or on her white ceramic dishes like the ones shown. Use the references only for " +
  "the setting, dishes and light; do not copy any food from them. ";
const REFS = {
  "benchmark2-bluedish": ["k09.jpg", "k07.jpg"],
  "benchmark2-whitedish": ["k09.jpg", "k10.jpg"],
  benchmark2: ["k09.jpg", "k06.jpg"],
  benchmark: ["k09.jpg", "k06.jpg"],
  "kitchen-close": ["k02.jpg", "k06.jpg"],
  "kitchen-wide": ["k01.jpg", "k05.jpg"],
};
Object.assign(STYLES, {
  "kitchen-close": "Photograph style: a close, slightly elevated phone photo of the food on a navy placemat on the island, " +
    "the dish filling most of the frame, the kitchen softly out of focus behind. " + KITCHEN + HOMECOOKED,
  "kitchen-wide": "Photograph style: a photo from standing height at the end of the island, the food on a navy placemat " +
    "in the foreground and more of the bright kitchen visible behind. " + KITCHEN + HOMECOOKED,
});

// The benchmark: Laurence's real photo of Sheila's linguine pesto (k09). Match it as closely as possible.
STYLES.benchmark = "The FIRST reference photo is the benchmark: a real, candid phone photo of a dish Sheila made, served " +
  "family-style in one of her white ceramic serving dishes on a round navy woven placemat on her white quartz kitchen " +
  "island. Match it as closely as possible: the same camera height and roughly 45-degree angle, the same close framing " +
  "where the serving dish fills most of the picture with a little of the countertop around it, the same flat natural " +
  "daylight, the same slightly muted, unedited phone-camera colour and sharpness, the same casual, unstyled feel. " +
  "The SECOND reference shows another of her white serving dishes. Serve the new food the same way, in a white serving " +
  "dish like hers (or the dish the food is naturally baked in), with nothing styled or arranged around it. Use the " +
  "references only for setting, dishes, angle and light; do not copy any food from them. " + HOMECOOKED;

// Benchmark, refined: same look, but without copying the reference photo's props, so a full set doesn't
// repeat the same phone and bread board in every picture.
STYLES.benchmark2 = STYLES.benchmark + " Do NOT copy the objects around the dish in the first reference (no phone, no salt " +
  "shaker, no bread board, no jar lid): keep the countertop around the food mostly clear, with at most one simple, natural " +
  "item that suits this dish. Use a serving dish that suits this food rather than the scalloped dish in the reference.";

// Benchmark look, in a specific dish of hers.
STYLES["benchmark2-bluedish"] = STYLES.benchmark2.replace("Use a serving dish that suits this food rather than the " +
  "scalloped dish in the reference.", "Bake and serve it in the blue-grey rectangular ceramic baking dish with a white rim " +
  "shown in the SECOND reference (her own dish), same size and shape.");
STYLES["benchmark2-whitedish"] = STYLES.benchmark2.replace("Use a serving dish that suits this food rather than the " +
  "scalloped dish in the reference.", "Serve it in the white rectangular ceramic dish with the scalloped, curled edges " +
  "shown in the references (her own dish), same size and shape.");

// A photo Laurence found of how a dish should look (never published): sent as a third reference for the food only.
const FOOD_REFS = {
  "nonna-s-italian-green-beans-potatoes": "Recipe images/Italian green beans and potato.jpeg",
};
const FOOD_REF_NOTE = "The THIRD reference photo shows roughly what this food looks like. Use it only as a guide to the food itself " +
  "(the kind of beans and potatoes, how they are cut, the colours). Do not copy its bowl, cloth, board, herbs on the table, " +
  "background, angle or composition: the setting, dish and camera must match the first two references.";

const COMMON = "Photorealistic, appetising, realistic portions and textures, looks genuinely home-made rather than " +
  "restaurant-perfect. No people, no hands, no text, no labels, no logos, no watermark.";

async function generate(key, prompt, refs = []) {
  const res = await fetch("https://generativelanguage.googleapis.com/v1beta/interactions", {
    method: "POST",
    headers: { "x-goog-api-key": key, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: MODEL,
      input: [
        { type: "text", text: prompt },
        ...refs.map((data) => ({ type: "image", mime_type: "image/jpeg", data })),
      ],
      response_format: { type: "image", mime_type: "image/jpeg", aspect_ratio: "4:3", image_size: "1K" },
    }),
  });
  const body = await res.text();
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${body.slice(0, 500)}`);
  const json = JSON.parse(body);
  // Find the first base64 image anywhere in the response, whatever the exact nesting.
  const found = [];
  (function walk(o) {
    if (!o || typeof o !== "object") return;
    const mime = o.mime_type || o.mimeType;
    if (typeof o.data === "string" && (!mime || mime.startsWith("image/")) && o.data.length > 1000) found.push(o.data);
    for (const v of Object.values(o)) walk(v);
  })(json);
  if (!found.length) throw new Error(`No image in response: ${body.slice(0, 500)}`);
  return Buffer.from(found[0], "base64");
}

const args = process.argv.slice(2);

// What to photograph for a recipe: a hand-written description if we have one, otherwise the recipe itself.
function describe(r) {
  if (DISHES[r.id]) return DISHES[r.id];
  const clean = (lines) => (lines || [])
    .map((l) => l.replace(/\[\?\]|\[illegible\]/g, "").trim())
    .filter((l) => l && !/^(Her page|Possible duplicate|Refers to|No separate ingredient)/.test(l));
  return `the finished, home-cooked dish "${r.title}", made from this family recipe and served the way the recipe ` +
    `describes (show the finished food, not raw ingredients). Ingredients: ${clean(r.ingredients).join("; ")}. ` +
    `Method: ${clean(r.method).join(" ")} ${clean(r.notes).length ? "Notes: " + clean(r.notes).join(" ") : ""}`;
}

// Re-save a generated JPEG at web size and quality (~150 KB instead of ~700 KB).
function webSize(file) {
  file = file.replace(/'/g, "''"); // PowerShell single-quoted string: the folder name has an apostrophe
  const ps = `Add-Type -AssemblyName System.Drawing; $i=[System.Drawing.Image]::FromFile('${file}'); ` +
    `$b=New-Object System.Drawing.Bitmap 1200,([int]($i.Height*1200/$i.Width)); $g=[System.Drawing.Graphics]::FromImage($b); ` +
    `$g.InterpolationMode='HighQualityBicubic'; $g.DrawImage($i,0,0,$b.Width,$b.Height); $i.Dispose(); ` +
    `$c=[System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders()|?{$_.MimeType -eq 'image/jpeg'}; ` +
    `$p=New-Object System.Drawing.Imaging.EncoderParameters 1; ` +
    `$p.Param[0]=New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality,[long]82); ` +
    `$b.Save('${file}',$c,$p); $g.Dispose(); $b.Dispose()`;
  execFileSync("powershell", ["-NoProfile", "-Command", ps]);
}

// Review mode: photo candidates for Sheila to approve or reject (with a comment) in the editor.
//   node tools/generate-images.mjs --review            recipes with no photo yet, plus new versions of
//                                                     rejected ones that take all her comments into account
//   node tools/generate-images.mjs --review --ids a,b  only these recipes
async function review(key) {
  const recipes = JSON.parse(fs.readFileSync(path.join(ROOT, "data", "recipes.json"), "utf8")).recipes;
  const photosFile = path.join(ROOT, "data", "photos.json");
  const loadPhotos = () => (fs.existsSync(photosFile) ? JSON.parse(fs.readFileSync(photosFile, "utf8")) : {});
  const only = args.includes("--ids") ? args[args.indexOf("--ids") + 1].split(",") : null;
  const start = loadPhotos();
  const todo = recipes.filter((r) => (!only || only.includes(r.id)) && (!start[r.id] || start[r.id].status === "rejected"));
  const refs = REFS.benchmark2.map((f) => fs.readFileSync(path.join(ROOT, "Kitchen photos", "ref", f)).toString("base64"));
  fs.mkdirSync(path.join(ROOT, "images", "candidates"), { recursive: true });
  console.log(`Model ${MODEL}: ${todo.length} photo(s) to make for review`);

  for (let i = 0; i < todo.length; i += 4) {
    await Promise.all(todo.slice(i, i + 4).map(async (r) => {
      const prev = start[r.id];
      const round = (prev?.round || 0) + 1;
      const feedback = (prev?.history || []).filter((h) => h.status === "rejected" && h.comment).map((h) => `"${h.comment}"`);
      const food = FOOD_REFS[r.id];
      const prompt = `A photograph of ${describe(r)}. ${STYLES.benchmark2} ${COMMON}` +
        (food ? ` ${FOOD_REF_NOTE}` : "") +
        (feedback.length ? ` Sheila rejected earlier pictures of this dish. Make sure to fix every one of her comments: ${feedback.join("; ")}.` : "");
      try {
        const rel = `images/candidates/${r.id}-${round}.jpg`;
        const all = food ? [...refs, fs.readFileSync(path.join(ROOT, food)).toString("base64")] : refs;
        fs.writeFileSync(path.join(ROOT, rel), await generate(key, prompt, all));
        webSize(path.join(ROOT, rel));
        const photos = loadPhotos(); // re-read, so decisions made in the editor meanwhile are kept
        photos[r.id] = { ...(photos[r.id] || {}), source: "ai", status: "pending", candidate: rel, round, comment: "",
          history: photos[r.id]?.history || [] };
        fs.writeFileSync(photosFile, JSON.stringify(photos, null, 2) + "\n");
        console.log(`ok   ${r.id} (round ${round})`);
      } catch (e) {
        console.log(`FAIL ${r.id}: ${e.message}`);
      }
    }));
  }
}

if (args.includes("--review")) {
  await review(readKey());
  process.exit(0);
}

const pick = (flag, all) => {
  const i = args.indexOf(flag);
  return i >= 0 ? args[i + 1].split(",") : Object.keys(all);
};
const dishes = pick("--only", DISHES);
const styles = pick("--styles", STYLES);
const vi = args.indexOf("--variants");
const variants = vi >= 0 ? Number(args[vi + 1]) : 1;

const key = readKey();
fs.mkdirSync(OUT, { recursive: true });
const jobs = dishes.flatMap((d) => styles.flatMap((s) => Array.from({ length: variants }, (_, v) => ({ d, s, v }))));
console.log(`Model ${MODEL}: ${jobs.length} image(s) → ${path.relative(ROOT, OUT)}`);

await Promise.all(jobs.map(async ({ d, s, v }) => {
  const prompt = `A photograph of ${DISHES[d]}. ${STYLES[s]} ${COMMON}`;
  const file = path.join(OUT, `${d}--${s}${variants > 1 ? `-${v + 1}` : ""}.jpg`);
  try {
    const refs = (REFS[s] || []).map((r) => fs.readFileSync(path.join(ROOT, "Kitchen photos", "ref", r)).toString("base64"));
    const img = await generate(key, prompt, refs);
    fs.writeFileSync(file, img);
    console.log(`ok   ${path.basename(file)} (${Math.round(img.length / 1024)} KB)`);
  } catch (e) {
    console.log(`FAIL ${d} / ${s}: ${e.message}`);
  }
}));

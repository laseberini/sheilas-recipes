// Generate dish photos with the Gemini API.
// Usage: node tools/generate-images.mjs [--only fish-cakes] [--styles home,magazine]
// Reads GEMINI_API_KEY from .dev.vars (never committed). Writes JPEGs to images/style-tests/.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

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
  "fish-cakes": "homemade South African fish cakes: six flattened, round pan-fried hake fish cakes with a golden-brown " +
    "breadcrumb crust, slightly irregular hand-shaped edges, tiny flecks of carrot and onion visible where one is broken open; " +
    "served with a few thick-cut chips, a simple green salad and a small bowl of chrain (a finely grated, moist, deep magenta beetroot-and-horseradish relish with a fine texture, not chunky)",
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

const COMMON = "Photorealistic, appetising, realistic portions and textures, looks genuinely home-made rather than " +
  "restaurant-perfect. No people, no hands, no text, no labels, no logos, no watermark.";

async function generate(key, prompt) {
  const res = await fetch("https://generativelanguage.googleapis.com/v1beta/interactions", {
    method: "POST",
    headers: { "x-goog-api-key": key, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: MODEL,
      input: [{ type: "text", text: prompt }],
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
const pick = (flag, all) => {
  const i = args.indexOf(flag);
  return i >= 0 ? args[i + 1].split(",") : Object.keys(all);
};
const dishes = pick("--only", DISHES);
const styles = pick("--styles", STYLES);

const key = readKey();
fs.mkdirSync(OUT, { recursive: true });
const jobs = dishes.flatMap((d) => styles.map((s) => ({ d, s })));
console.log(`Model ${MODEL}: ${jobs.length} image(s) → ${path.relative(ROOT, OUT)}`);

await Promise.all(jobs.map(async ({ d, s }) => {
  const prompt = `A photograph of ${DISHES[d]}. ${STYLES[s]} ${COMMON}`;
  const file = path.join(OUT, `${d}--${s}.jpg`);
  try {
    const img = await generate(key, prompt);
    fs.writeFileSync(file, img);
    console.log(`ok   ${path.basename(file)} (${Math.round(img.length / 1024)} KB)`);
  } catch (e) {
    console.log(`FAIL ${d} / ${s}: ${e.message}`);
  }
}));

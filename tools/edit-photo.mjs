// Edit an existing photo with Gemini (e.g. tidy the background of a real photo).
// Usage: node tools/edit-photo.mjs <input.jpg> <output-prefix> "<instruction>" [versions] [aspect]
// Reads GEMINI_API_KEY from .dev.vars (never committed).

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const MODEL = process.env.GEMINI_IMAGE_MODEL || "gemini-3.1-flash-image";
const [input, prefix, instruction, versions = "2", aspect = "5:4"] = process.argv.slice(2);
if (!input || !prefix || !instruction) throw new Error("usage: edit-photo.mjs <input.jpg> <output-prefix> \"<instruction>\" [versions] [aspect]");

const key = fs.readFileSync(path.join(ROOT, ".dev.vars"), "utf8").split(/\r?\n/)
  .find((l) => l.startsWith("GEMINI_API_KEY="))?.slice("GEMINI_API_KEY=".length).trim().replace(/^["']|["']$/g, "");
if (!key) throw new Error("GEMINI_API_KEY missing from .dev.vars");

async function edit() {
  const res = await fetch("https://generativelanguage.googleapis.com/v1beta/interactions", {
    method: "POST",
    headers: { "x-goog-api-key": key, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: MODEL,
      input: [
        { type: "text", text: instruction },
        { type: "image", mime_type: "image/jpeg", data: fs.readFileSync(input).toString("base64") },
      ],
      response_format: { type: "image", mime_type: "image/jpeg", aspect_ratio: aspect, image_size: "1K" },
    }),
  });
  const body = await res.text();
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${body.slice(0, 400)}`);
  const found = [];
  (function walk(o) {
    if (!o || typeof o !== "object") return;
    const mime = o.mime_type || o.mimeType;
    if (typeof o.data === "string" && (!mime || mime.startsWith("image/")) && o.data.length > 1000) found.push(o.data);
    for (const v of Object.values(o)) walk(v);
  })(JSON.parse(body));
  if (!found.length) throw new Error(`No image in response: ${body.slice(0, 400)}`);
  return Buffer.from(found[0], "base64");
}

await Promise.all(Array.from({ length: Number(versions) }, async (_, i) => {
  const out = `${prefix}-${i + 1}.jpg`;
  try {
    fs.writeFileSync(out, await edit());
    console.log(`ok   ${path.basename(out)}`);
  } catch (e) {
    console.log(`FAIL ${path.basename(out)}: ${e.message}`);
  }
}));

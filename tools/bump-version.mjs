// Bump the site version before a push.
// Usage: node tools/bump-version.mjs [0.7]   (no argument: 0.6 → 0.7)
// Updates version.json (read live by every page to bust stale caches), the data-version on the
// site page, and the ?v= on its script tag, so phones always load matching, fresh files.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const VERSION_FILE = path.join(ROOT, "version.json");

const current = fs.existsSync(VERSION_FILE) ? JSON.parse(fs.readFileSync(VERSION_FILE, "utf8")).version : "0.5";
const [major, minor] = current.split(".").map(Number);
const version = process.argv[2] || `${major}.${minor + 1}`;
const now = new Date();
const pad = (n) => String(n).padStart(2, "0");
const built = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`;

fs.writeFileSync(VERSION_FILE, JSON.stringify({ version, built }, null, 2) + "\n");

const pages = ["index.html"]; // the site (old mockups/ addresses only redirect here)
for (const f of pages) {
  const file = path.join(ROOT, f);
  const html = fs.readFileSync(file, "utf8")
    .replace(/<html lang="en"[^>]*>/, `<html lang="en" data-version="${version}" data-built="${built}">`)
    .replace(/(shared|recipes-data)\.js(\?v=[^"]*)?"/g, (_, name) => `${name}.js?v=${version}"`)
    .replace(/manifest\.webmanifest(\?v=[^"]*)?"/, `manifest.webmanifest?v=${version}"`); // phones re-read the app settings each release
  fs.writeFileSync(file, html);
}
console.log(`v${current} → v${version} (${built}); updated version.json and ${pages.length} pages`);

// Shared content + behaviour for the look-and-feel mockups.
// Each mockup supplies its own layout and CSS; this fills in the same real content everywhere.

// Version (set on <html data-version> by tools/bump-version.mjs). Asset URLs carry it so a new
// release never mixes with files a phone has kept from an older one.
const VERSION = document.documentElement.dataset.version || "dev";
const withV = (url) => `${url}${url.includes("?") ? "&" : "?"}v=${VERSION}`;

// Cache buster: GitHub Pages lets browsers keep a page for ~10 minutes. Ask the server which
// version is live (bypassing the cache); if this page is older, reload once with the live version
// in the address, which the browser has never seen and so must fetch fresh.
// Arriving from an old /mockups/ address adds "?moved" (see mockups/*.html); tidy it away.
if (new URLSearchParams(location.search).has("moved")) {
  const tidy = new URL(location.href);
  tidy.searchParams.delete("moved");
  history.replaceState(null, "", tidy);
}

(async () => {
  if (location.protocol === "file:") return;
  try {
    const res = await fetch(`${new URL("version.json", location.href)}?t=${Date.now()}`, { cache: "no-store" });
    const live = (await res.json()).version;
    const url = new URL(location.href);
    if (live && live !== VERSION && url.searchParams.get("v") !== live) {
      url.searchParams.set("v", live);
      location.replace(url);
    }
  } catch {
    // Offline or no version.json: keep the page as it is.
  }
})();

// RECIPES and MOCK (categories, intro) come from recipes-data.js, built by tools/build-site.mjs.

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

// Full-screen viewer for the original page. Close with ×, Esc, or a tap outside the photo.
// Zoom with pinch, double-tap / double-click, or the scroll wheel; drag to move around.
function openLightbox(src, alt) {
  const box = document.createElement("div");
  box.className = "lb";
  box.innerHTML = `<img class="lb-img" src="${esc(src)}" alt="${esc(alt || "")}" draggable="false">
    <button class="lb-close" type="button" aria-label="Close">×</button>
    <p class="lb-hint">Pinch or double-tap to zoom · tap outside to close</p>`;
  document.body.appendChild(box);
  const prevOverflow = document.body.style.overflow;
  document.body.style.overflow = "hidden";
  const img = box.querySelector(".lb-img");
  const hint = box.querySelector(".lb-hint");
  setTimeout(() => (hint.style.opacity = "0"), 2600);

  let s = 1, x = 0, y = 0;
  const apply = (animate) => {
    // Keep the photo from being dragged off screen.
    const maxX = Math.max(0, (img.offsetWidth * s - innerWidth) / 2);
    const maxY = Math.max(0, (img.offsetHeight * s - innerHeight) / 2);
    if (s <= 1) { s = 1; x = 0; y = 0; }
    x = Math.min(maxX, Math.max(-maxX, x));
    y = Math.min(maxY, Math.max(-maxY, y));
    img.style.transition = animate ? "transform .25s ease-out" : "none";
    img.style.transform = `translate(${x}px, ${y}px) scale(${s})`;
    box.classList.toggle("zoomed", s > 1.01);
  };
  // Zoom by k while keeping the point (px, py) under the finger/cursor still.
  const zoomAt = (k, px, py, animate) => {
    const ns = Math.min(5, Math.max(1, s * k));
    k = ns / s;
    x = px - innerWidth / 2 - (px - innerWidth / 2 - x) * k;
    y = py - innerHeight / 2 - (py - innerHeight / 2 - y) * k;
    s = ns;
    apply(animate);
  };

  const close = () => {
    box.remove();
    document.body.style.overflow = prevOverflow;
    document.removeEventListener("keydown", onKey);
  };
  const onKey = (e) => { if (e.key === "Escape") close(); };
  document.addEventListener("keydown", onKey);
  box.querySelector(".lb-close").onclick = close;

  const pts = new Map();
  let prev = null, moved = false, lastTap = 0;
  const onImg = (e) => {
    const r = img.getBoundingClientRect();
    return e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
  };
  // Close on the tap's click, not on lifting the finger: closing earlier lets the click land on
  // the photo underneath, which opens the viewer again.
  let closeOnClick = false;
  box.addEventListener("click", () => { if (closeOnClick) close(); });
  const two = () => {
    const [a, b] = [...pts.values()];
    return { d: Math.hypot(a.x - b.x, a.y - b.y), mx: (a.x + b.x) / 2, my: (a.y + b.y) / 2 };
  };
  box.addEventListener("pointerdown", (e) => {
    if (e.target.closest(".lb-close")) return;
    try { box.setPointerCapture(e.pointerId); } catch {} // keep tracking if the finger leaves the photo
    pts.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pts.size === 1) moved = false;
    prev = pts.size === 2 ? two() : { x: e.clientX, y: e.clientY };
  });
  box.addEventListener("pointermove", (e) => {
    if (!pts.has(e.pointerId)) return;
    const p = pts.get(e.pointerId);
    if (Math.hypot(e.clientX - p.x, e.clientY - p.y) > 6) moved = true;
    pts.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pts.size === 2) {
      const now = two();
      x += now.mx - prev.mx;
      y += now.my - prev.my;
      zoomAt(now.d / prev.d, now.mx, now.my);
      prev = now;
    } else if (pts.size === 1 && s > 1) {
      x += e.clientX - prev.x;
      y += e.clientY - prev.y;
      prev = { x: e.clientX, y: e.clientY };
      apply();
    }
  });
  const end = (e) => {
    if (!pts.has(e.pointerId)) return;
    pts.delete(e.pointerId);
    if (pts.size === 1) prev = [...pts.values()][0];
    if (pts.size || moved) return;
    // A tap: outside the photo closes; a double-tap on it toggles zoom.
    if (!onImg(e)) {
      if (s === 1) { closeOnClick = true; setTimeout(() => box.isConnected && close(), 500); }
      return;
    }
    const now = Date.now();
    if (now - lastTap < 320) {
      if (s > 1) { s = 1; apply(true); } else zoomAt(2.5, e.clientX, e.clientY, true);
      lastTap = 0;
    } else lastTap = now;
  };
  box.addEventListener("pointerup", end);
  box.addEventListener("pointercancel", end);
  box.addEventListener("wheel", (e) => {
    e.preventDefault();
    zoomAt(e.deltaY < 0 ? 1.15 : 1 / 1.15, e.clientX, e.clientY);
  }, { passive: false });
}

document.addEventListener("click", (e) => {
  const page = e.target.closest("[data-fill=pages] img, [data-fill=dish] img");
  if (page) openLightbox(page.dataset.full || page.src, page.alt);
});

function methodItems(lines, R) {
  // A line ending in ":" is a sub-heading (e.g. "Topping:"), not a numbered step.
  return lines.map((m) => (m.trim().endsWith(":") ? `<li class="sub">${esc(m)}</li>` : `<li><span>${linkify(m, R)}</span></li>`)).join(""); // one wrapper, so links flow inside the text
}

// Every mention of a linked recipe (its title, or another name for it such as "pesto sauce") is a link.
const reEscape = (t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
function linkify(text, R) {
  const names = (R.uses || [])
    .flatMap((key) => [RECIPES[key].title, ...(RECIPES[key].aliases || [])].map((name) => ({ key, name })))
    .sort((a, b) => b.name.length - a.name.length);
  if (!names.length) return esc(text);
  text = text.replace(/\s*\(see recipe\)/i, ""); // the link says it
  const all = new RegExp(names.map((n) => reEscape(n.name)).join("|"), "gi");
  let out = "", last = 0;
  for (const m of text.matchAll(all)) {
    const { key } = names.find((n) => n.name.toLowerCase() === m[0].toLowerCase());
    out += esc(text.slice(last, m.index)) + `<a class="rec-link" href="#recipe-${key}">${esc(m[0])}</a>`;
    last = m.index + m[0].length;
  }
  return out + esc(text.slice(last));
}

// "Uses …" / "Used in …" strip shown above the ingredients.
function relatedStrip(key, R) {
  const link = (k) => `<a class="rec-link" href="#recipe-${k}">${esc(RECIPES[k].title)} →</a>`;
  const uses = (R.uses || []).map(link);
  const usedIn = Object.keys(RECIPES).filter((k) => (RECIPES[k].uses || []).includes(key)).map(link);
  return (uses.length ? `<span><b>Uses</b> ${uses.join(" ")}</span>` : "") +
    (usedIn.length ? `<span><b>Used in</b> ${usedIn.join(" ")}</span>` : "");
}

function renderRecipe(R, key) {
  const set = (name, fn) => document.querySelectorAll(`[data-fill=${name}]`).forEach(fn);
  set("title", (el) => (el.textContent = R.title));
  set("title-em", (el) => {
    const words = R.title.split(" ");
    const last = words.pop();
    el.innerHTML = `${esc(words.join(" "))} <em>${esc(last)}</em>`;
  });
  // The category pill opens the other recipes in that category.
  set("cat", (el) => {
    el.textContent = (el.dataset.prefix || "") + R.category;
    el.classList.add("tap");
    el.setAttribute("role", "button");
    el.tabIndex = 0;
    el.onclick = () => openCategory(R.category, key);
    el.onkeydown = (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openCategory(R.category, key); } };
  });
  for (const key of ["date", "serves"]) {
    set(key, (el) => {
      el.hidden = !R[key];
      el.textContent = R[key] ? (el.dataset.prefix || "") + (key === "date" ? niceDate(R[key]) : R[key]) : "";
    });
  }
  // Whose recipe: face (or an icon) + "From Nonna ›" under the title; tap for who they are.
  const person = R.person && MOCK.people?.[R.person];
  set("byline", (el) => {
    el.hidden = !person;
    el.innerHTML = person ? `<span class="by-face">${person.photo ? `<img src="${withV(person.photo)}" alt="">` : PERSON_ICON}</span><b>From ${esc(person.name)} ›</b>` : "";
    el.onclick = () => openPerson(R.person, key);
  });
  set("ingredients", (el) => (el.innerHTML = R.ingredients
    .map((i) => (i.trim().endsWith(":") ? `<li class="sub">${esc(i)}</li>` : `<li>${linkify(i, R)}</li>`)).join("")));
  set("related", (el) => {
    el.innerHTML = relatedStrip(key, R);
    el.hidden = !el.innerHTML;
  });
  set("method", (el) => (el.innerHTML = methodItems(R.method, R)));
  set("notes", (el) => {
    el.hidden = !R.notes.length;
    el.innerHTML = R.notes.map((m) => `<p>${linkify(m, R)}</p>`).join("");
  });
  // Her handwritten page(s), small at the end of the recipe; tap to see full screen.
  set("pages", (el) => {
    el.hidden = !R.pages.length;
    el.innerHTML = R.pages.map((p, i) => `<img src="${withV(R.pageThumbs?.[i] || p)}" data-full="${withV(p)}" alt="The handwritten recipe page${R.pages.length > 1 ? ` (${i + 1} of ${R.pages.length})` : ""}">`).join("") +
      `<figcaption>${R.pages.length > 1 ? "The handwritten pages" : "The handwritten page"} · tap to see</figcaption>`;
  });
  cookKey = key;
  applyTicks();
  // Where to next: the rest of this category, and the next recipe in it.
  set("recipe-end", (el) => {
    const inCat = Object.entries(RECIPES).filter(([, r]) => r.category === R.category).sort(byTitle);
    const i = inCat.findIndex(([rid]) => rid === key);
    const [nextKey, nextR] = inCat.length > 1 ? inCat[(i + 1) % inCat.length] : [];
    el.innerHTML = (inCat.length > 1 ? `<button type="button" data-more-cat><span><small>More in</small>${esc(R.category)}</span><b aria-hidden="true">→</b></button>` : "") +
      (nextKey ? `<a href="#recipe-${nextKey}"><span><small>Next</small>${esc(nextR.title)}</span><b aria-hidden="true">→</b></a>` : "");
    el.hidden = !el.innerHTML;
    const more = el.querySelector("[data-more-cat]");
    if (more) more.onclick = () => openCategory(R.category, key);
  });
  // With a photo, the header shows it full width with the title on top; without one, the plain header.
  document.querySelectorAll(".r-hero").forEach((h) => h.classList.toggle("has-hero", !!R.photo));
  // Only photos Sheila approved; no photo, no frame.
  set("dish", (el) => {
    el.hidden = !R.photo;
    el.classList.toggle("has-photo", !!R.photo);
    el.innerHTML = R.photo
      ? `<img src="${withV(R.photo)}" alt="${esc(R.title)}${R.photoReal ? "" : ", as it might look on the table (AI-generated picture)"}">`
      : "";
  });
}

// Her dates are month/year ("4/09"), which reads as a day; spell it out ("April 2009").
const niceDate = (d) => {
  const m = d.match(/^(\d{1,2})\/(\d{2}|\d{4})$/);
  if (!m || +m[1] < 1 || +m[1] > 12) return d;
  const year = m[2].length === 2 ? 2000 + +m[2] - (+m[2] > 40 ? 100 : 0) : +m[2];
  return new Date(year, m[1] - 1).toLocaleDateString("en-ZA", { month: "long", year: "numeric" });
};

function fillMockup() {
  // Her story, in full, for the "My story" panel.
  document.querySelectorAll("[data-fill=story]").forEach((el) => (el.innerHTML = MOCK.intro.map((p) => `<p>${esc(p)}</p>`).join("")));
  document.querySelectorAll("[data-story-note]").forEach((b) => (b.onclick = () => openLightbox(withV(MOCK.introPage), "Sheila's handwritten introduction")));
  const searchText = (id) => {
    const r = RECIPES[id];
    return [r.title, r.from || "", r.category, ...r.ingredients, ...r.method, ...r.notes].join(" ").toLowerCase();
  };
  document.querySelectorAll("[data-fill=categories]").forEach((el) => {
    el.innerHTML = MOCK.categories.map((c) => `
      <section class="cat">
        <h3 class="cat-name">${esc(c.name)} <span class="cat-count">${c.ids.length}</span></h3>
        <ul class="cat-list person-recipes">${c.ids.map((id) => `<li data-id="${id}">${recipeLinks([[id, RECIPES[id]]])}</li>`).join("")}</ul>
      </section>`).join("") + '<p class="no-results" hidden>No recipes match that search.</p>';
  });
  document.querySelectorAll("[data-search]").forEach((input) => {
    input.addEventListener("input", () => {
      const q = input.value.trim().toLowerCase();
      let shown = 0;
      document.querySelectorAll(".cat").forEach((cat) => {
        let inCat = 0;
        cat.querySelectorAll(".cat-list li").forEach((li) => {
          const hit = !q || searchText(li.dataset.id).includes(q);
          li.hidden = !hit;
          inCat += hit;
        });
        cat.hidden = !inCat;
        shown += inCat;
      });
      document.querySelectorAll(".no-results").forEach((p) => (p.hidden = shown > 0));
    });
  });

  // Home ↔ recipe "pages": #recipe-fish-cakes. #recipes (the list) is not a recipe; an unknown or
  // not-yet-checked recipe shows the home page. Links from the early mockup still work.
  const OLD_KEYS = { fish: "fish-cakes", lemon: "lemon-mereingue", pesto: "alettas-pesto-sauce", linguine: "linguine-pesto" };
  const recipeKey = () => {
    const m = location.hash.match(/^#recipe-([\w-]+)$/);
    const key = m && (OLD_KEYS[m[1]] || m[1]);
    return key && RECIPES[key] ? key : null;
  };
  // Where the reader was on the home page, so "← All recipes" (or the phone's back button) returns
  // them there instead of to the top.
  let homeY = null;
  let onRecipe = false;
  let storyOpen = false;
  const storyEl = document.querySelector("[data-story]");
  const closeStory = () => (history.state?.story ? history.back() : location.replace("#"));
  const route = () => {
    // #story: her story over the home page, which stays where it was underneath.
    const wantStory = location.hash === "#story";
    if (storyEl) {
      storyEl.hidden = !wantStory;
      document.documentElement.style.overflow = wantStory ? "hidden" : "";
    }
    if (wantStory || storyOpen) {
      const wasOpen = storyOpen;
      storyOpen = wantStory;
      if (wantStory && !wasOpen) storyEl?.querySelector(".story-panel")?.scrollTo(0, 0);
      if (wantStory || !recipeKey()) {
        document.querySelectorAll("[data-screen]").forEach((s) => (s.hidden = s.dataset.screen !== "home"));
        if (onRecipe) { onRecipe = false; if (homeY !== null) window.scrollTo(0, homeY); }
        return;
      }
    }
    const key = recipeKey();
    if (key && !onRecipe) homeY = window.scrollY; // still showing the home page at this point
    const fromRecipe = onRecipe && !key;
    onRecipe = !!key;
    document.querySelectorAll("[data-screen]").forEach((s) => (s.hidden = s.dataset.screen !== (key ? "recipe" : "home")));
    if (key) {
      renderRecipe(RECIPES[key], key);
    }
    if (fromRecipe && homeY !== null) return window.scrollTo(0, homeY);
    // Jump to a section on the home page (e.g. #recipes), otherwise start at the top.
    const target = !key && location.hash.length > 1 && document.getElementById(location.hash.slice(1));
    target ? target.scrollIntoView() : window.scrollTo(0, 0);
  };
  window.addEventListener("hashchange", route);
  // "My story" remembers that it opened the panel, so closing goes back instead of adding history.
  document.querySelectorAll('a[href="#story"]').forEach((a) => (a.onclick = (e) => {
    e.preventDefault();
    history.pushState({ story: true }, "", "#story");
    route();
  }));
  document.querySelectorAll("[data-story-close]").forEach((a) => (a.onclick = (e) => { e.preventDefault(); closeStory(); }));
  storyEl?.addEventListener("click", (e) => { if (e.target === storyEl) closeStory(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && storyOpen && !document.querySelector(".lb")) closeStory(); });
  route();

  // Version at the top of every page, so it's easy to check which version a phone is showing.
  const badge = document.createElement("div");
  badge.className = "ver-top";
  badge.textContent = `v${VERSION}`;
  badge.title = `Built ${document.documentElement.dataset.built || ""}`;
  document.body.appendChild(badge);

  const style = document.createElement("style");
  style.textContent = `
    [hidden] { display: none !important; }
    .ver-top { position: fixed; top: 8px; right: 8px; z-index: 998; font: 600 11px/1 system-ui, sans-serif; letter-spacing: .04em;
      color: #fff; background: rgba(20,20,20,.62); padding: 5px 8px; border-radius: 99px; pointer-events: none; }
    .no-results { grid-column: 1 / -1; text-align: center; color: var(--muted, #777); padding: 30px 0; }
    .rel { display: flex; flex-wrap: wrap; gap: 8px 18px; align-items: center; margin: 0 0 22px; font-size: 15px; }
    .rel b { font-weight: 600; margin-right: 6px; opacity: .75; }
    /* Linked recipes read as ordinary hyperlinks inside the text. */
    .rec-link { color: var(--link-accent, currentColor); font-weight: inherit; text-decoration: underline;
      text-decoration-thickness: 1px; text-underline-offset: 3px; }
    .rec-link:hover { text-decoration-thickness: 2px; }
    li.sub { list-style: none; font-weight: 700; margin-top: 8px; }
    li.sub::before { content: none !important; }

    .method li.sub { counter-increment: none !important; display: block !important; padding: 8px 0 6px !important; font-weight: 700; }
    .method li.sub::before { content: none !important; }

    [data-recipe] { overflow-x: clip; }

    /* Original page: tap to open full screen, pinch / double-tap / scroll-wheel to zoom. */
    [data-fill=pages] img, [data-fill=dish] img { cursor: zoom-in; }
    /* Dish photo fills whatever frame each design gives it. */
    .has-photo { position: relative; overflow: hidden; background: none !important; }
    .has-photo > img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; display: block; }
    .lb { position: fixed; inset: 0; z-index: 2000; display: flex; align-items: center; justify-content: center;
      background: rgba(18,15,12,.94); touch-action: none; animation: lbIn .2s ease-out; overflow: hidden; }
    @keyframes lbIn { from { opacity: 0; } }
    .lb-img { max-width: 94vw; max-height: 90vh; user-select: none; -webkit-user-drag: none; transform-origin: center;
      will-change: transform; box-shadow: 0 20px 60px rgba(0,0,0,.5); cursor: zoom-in; }
    .lb.zoomed .lb-img { cursor: grab; }
    .lb-close { position: absolute; top: 14px; right: 14px; width: 46px; height: 46px; border-radius: 50%; border: 0;
      background: rgba(255,255,255,.16); color: #fff; font: 300 30px/46px system-ui, sans-serif; cursor: pointer; z-index: 1; }
    .lb-close:hover { background: rgba(255,255,255,.28); }
    .lb-hint { position: absolute; left: 0; right: 0; bottom: 22px; margin: 0; text-align: center; color: #e8e2da;
      font: 14px system-ui, sans-serif; pointer-events: none; transition: opacity .6s; }
`;
  document.head.appendChild(style);
}

// A list of recipes as links, each with its dish photo; the one being read is marked "You're here".
const recipeLinks = (entries, currentKey, showWho = true) => entries.map(([rid, r]) => {
  const here = rid === currentKey;
  const who = showWho && r.person && MOCK.people?.[r.person];
  return `<a href="#recipe-${rid}"${here ? ' aria-current="page"' : ""}>${r.photo ? `<img src="${withV(r.thumb || r.photo)}" alt="" loading="lazy">` : ""}` +
    `<span>${esc(r.title)}${who ? `<small>From ${esc(who.name)}</small>` : ""}</span><b aria-hidden="true">${here ? "You're here" : "→"}</b></a>`;
}).join("");
const byTitle = ([, a], [, b]) => a.title.localeCompare(b.title);

// "From Nonna" tab: photo, who they are to Sheila, a few lines, and their other recipes.
const personInitials = (name) => name.split(/\s+/).filter((w) => !/^the$/i.test(w)).map((w) => w[0]).join("").slice(0, 2).toUpperCase();
function personHTML(id, currentKey) {
  const p = MOCK.people[id];
  const others = Object.entries(RECIPES).filter(([rid, r]) => r.person === id && rid !== currentKey).sort(byTitle);
  return `<div class="person-top">
      <div class="person-photo">${p.photo ? `<img src="${withV(p.photo)}" alt="${esc(p.name)}">` : `<div class="initials">${esc(personInitials(p.name))}</div>`}</div>
      <div>${p.relation ? `<div class="kicker">${esc(p.relation)}</div>` : ""}<h2>${esc(p.name)}</h2></div>
    </div>
    <div class="person-bio">${(p.bio || "").split(/\n+/).filter(Boolean).map((t) => `<p>${esc(t)}</p>`).join("")}</div>
    ${others.length ? `<h3 class="person-rh">More from ${esc(p.name)}</h3><div class="person-recipes">${recipeLinks(others, null, false)}</div>` : ""}`;
}

// Category sheet: the recipes in this category, so you can hop to another without going back to the list.
// Opening adds a history step (same address), so the phone's back button closes it.
function openSheet(sheet) {
  if (!sheet) return;
  sheet.hidden = false;
  sheet.querySelector(".story-panel").scrollTo(0, 0);
  document.documentElement.style.overflow = "hidden";
  if (!history.state?.sheet) history.pushState({ sheet: true }, "", location.href);
}
function openCategory(name, currentKey) {
  const sheet = document.querySelector("[data-cat-sheet]");
  if (!sheet) return;
  sheet.querySelector("[data-fill=catm-title]").textContent = name;
  sheet.querySelector("[data-fill=catm-list]").innerHTML = recipeLinks(Object.entries(RECIPES).filter(([, r]) => r.category === name).sort(byTitle), currentKey);
  openSheet(sheet);
}
const PERSON_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4 21c1.2-4.2 4.3-6 8-6s6.8 1.8 8 6"/></svg>';
function openPerson(id, currentKey) {
  const sheet = document.querySelector("[data-person-sheet]");
  if (!sheet || !MOCK.people?.[id]) return;
  const box = sheet.querySelector("[data-fill=person-pane]");
  box.innerHTML = personHTML(id, currentKey);
  const img = box.querySelector(".person-photo img");
  if (img) img.onclick = () => openLightbox(img.src, MOCK.people[id].name);
  openSheet(sheet);
}
function hideSheet() {
  const open = [...document.querySelectorAll("[data-sheet]")].filter((s) => !s.hidden);
  if (!open.length) return;
  open.forEach((s) => (s.hidden = true));
  document.documentElement.style.overflow = "";
}
const closeSheet = () => (history.state?.sheet ? history.back() : hideSheet());
function setupSheet() {
  document.querySelectorAll("[data-sheet]").forEach((sheet) => {
    sheet.querySelector("[data-sheet-close]").onclick = (e) => { e.preventDefault(); closeSheet(); };
    sheet.addEventListener("click", (e) => { if (e.target === sheet) closeSheet(); });
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && document.querySelector("[data-sheet]:not([hidden])") && !document.querySelector(".lb")) closeSheet();
  });
  window.addEventListener("popstate", () => { if (!history.state?.sheet) hideSheet(); });
  window.addEventListener("hashchange", hideSheet); // picked a recipe, or "See all the recipes"
}

// Cooking help. Saved on this phone only (localStorage), so it never needs the internet.
const store = {
  get(k, fallback) { try { const v = localStorage.getItem(k); return v === null ? fallback : JSON.parse(v); } catch { return fallback; } },
  set(k, v) { try { v === null ? localStorage.removeItem(k) : localStorage.setItem(k, JSON.stringify(v)); } catch {} },
};

// Tick off ingredients and steps as you go (remembered per recipe); the next step to do is highlighted.
let cookKey = null;
const ticksKey = () => `ticks:${cookKey}`;
function applyTicks() {
  const t = store.get(ticksKey(), { i: [], m: [] });
  document.querySelectorAll("[data-fill=ingredients] li").forEach((li, n) => li.classList.toggle("done", t.i.includes(n)));
  const steps = [...document.querySelectorAll("[data-fill=method] li")];
  steps.forEach((li, n) => li.classList.toggle("done", t.m.includes(n)));
  const next = t.m.length ? steps.find((li) => !li.classList.contains("sub") && !li.classList.contains("done")) : null;
  steps.forEach((li) => li.classList.toggle("next", li === next));
  document.querySelectorAll("[data-clear-ticks]").forEach((b) => (b.hidden = !t.i.length && !t.m.length));
  // Once something is ticked, "Clear" takes the place of the "tap as you go" hint.
  document.querySelectorAll(".tap-hint").forEach((h) => (h.hidden = !!(t.i.length || t.m.length)));
}
document.addEventListener("click", (e) => {
  const li = e.target.closest("[data-fill=ingredients] li, [data-fill=method] li");
  if (!li || li.classList.contains("sub") || e.target.closest("a")) return; // links inside a step still work
  const kind = li.parentElement.dataset.fill === "ingredients" ? "i" : "m";
  const n = [...li.parentElement.children].indexOf(li);
  const t = store.get(ticksKey(), { i: [], m: [] });
  t[kind] = t[kind].includes(n) ? t[kind].filter((x) => x !== n) : [...t[kind], n];
  store.set(ticksKey(), t.i.length || t.m.length ? t : null);
  applyTicks();
});

// The screen stays on while a recipe is open, so it never goes dark mid-recipe. It sleeps as normal
// on the home page, or when you switch apps or lock the phone.
const wakeSupported = "wakeLock" in navigator;
let wakeLock = null, wakeBusy = false;
async function updateWake() {
  if (!wakeSupported || wakeBusy) return;
  const onRecipe = document.querySelector("[data-screen=recipe]")?.hidden === false;
  const want = onRecipe && document.visibilityState === "visible";
  wakeBusy = true;
  try {
    if (want && !wakeLock) {
      wakeLock = await navigator.wakeLock.request("screen");
      wakeLock.addEventListener("release", () => (wakeLock = null));
    } else if (!want && wakeLock) {
      const lock = wakeLock;
      wakeLock = null;
      await lock.release();
    }
  } catch { wakeLock = null; } // e.g. battery saver: the phone just sleeps as normal
  wakeBusy = false;
}
function updateRecipeBar() {
  const bar = document.querySelector("[data-rbar]");
  const screen = document.querySelector("[data-screen=recipe]");
  const hero = document.querySelector(".r-hero");
  if (!bar || !screen || !hero) return;
  bar.hidden = screen.hidden || hero.getBoundingClientRect().bottom > 0;
}
function setupCooking() {
  let ticking = false;
  window.addEventListener("scroll", () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => { ticking = false; updateRecipeBar(); });
  }, { passive: true });
  window.addEventListener("hashchange", () => requestAnimationFrame(updateRecipeBar));
  document.querySelectorAll("[data-clear-ticks]").forEach((b) => (b.onclick = () => { store.set(ticksKey(), null); applyTicks(); }));
  window.addEventListener("hashchange", updateWake);
  document.addEventListener("visibilitychange", updateWake); // the lock lapses when the phone locks or you switch apps
  updateWake();
}

// Memories: anyone can share a memory of a dish. It lands in the family's Google Sheet
// (tools/memories-apps-script.gs) and shows here once the "Approved" box is ticked there.
// Until MEMORIES_URL is set, nothing about memories shows on the site.
const MEMORIES_URL = "https://script.google.com/macros/s/AKfycbwj917FYZgfLXmiZN49o85NAws-T97fkIzzqK5tIB7utVhj7MEiJ6uYPYHEa764KFdQ/exec";
let memories = []; // newest first

const memWhen = (at) => (at ? new Date(at).toLocaleDateString("en-ZA", { month: "long", year: "numeric" }) : "");
const memCard = (m, about = "") => `<div class="mem-card"><blockquote>${esc(m.text)}</blockquote>
  <div class="mem-who">${esc(m.name)}<small>${[esc(memWhen(m.at)), about].filter(Boolean).join(" · ")}</small></div></div>`;
// Home carousel card: the dish leads (photo + name, tapping it opens the recipe), then the memory.
const memHomeCard = (m) => {
  const R = RECIPES[m.recipe];
  return `<div class="mem-card mem-home-card">
  <a class="mem-dish" href="#recipe-${m.recipe}">${R.photo ? `<img src="${withV(R.thumb || R.photo)}" alt="">` : ""}<span>${esc(R.title)}</span><b aria-hidden="true">→</b></a>
  <blockquote>${esc(m.text)}</blockquote>
  <div class="mem-who">${esc(m.name)}<small>${esc(memWhen(m.at))}</small></div></div>`;
};
const memRecipeId = () => (location.hash.match(/^#recipe-([\w-]+)$/) || [])[1];

function drawMemories() {
  const id = memRecipeId();
  const mine = memories.filter((m) => m.recipe === id);
  document.querySelectorAll("[data-fill=memories]").forEach((el) => {
    el.innerHTML = mine.length ? mine.map((m) => memCard(m)).join("")
      : '<p class="mem-empty">No memories of this dish yet.</p>';
    bindCarousel(el, mine.length);
  });
  document.querySelectorAll("[data-fill=mem-chip]").forEach((a) => {
    a.textContent = mine.length ? `${mine.length} ${mine.length === 1 ? "memory" : "memories"} ↓` : "Share a memory";
  });
  // Home page: the newest ten as a carousel (swipe, tap a dot; on a computer also ‹ ›, drag or ← →).
  // The memories arrive a moment after the page, and their section sits above the recipe list. If
  // the reader has already jumped down to the list ("Open the recipes"), keep it where it is on
  // screen instead of letting the new section push it down.
  const list = document.getElementById("recipes");
  const listTop = list && !list.closest("[hidden]") ? list.getBoundingClientRect().top : null;
  const recent = memories.filter((m) => RECIPES[m.recipe]).slice(0, 10);
  document.querySelectorAll("[data-mem-home]").forEach((s) => (s.hidden = !recent.length));
  const holdPlace = () => {
    if (listTop === null || listTop > innerHeight || window.scrollY === 0) return;
    const moved = list.getBoundingClientRect().top - listTop;
    if (Math.abs(moved) > 1) window.scrollBy(0, moved);
  };
  document.querySelectorAll("[data-fill=home-memories]").forEach((el) => {
    el.innerHTML = recent.map(memHomeCard).join("");
    bindCarousel(el, recent.length);
    addReadMore(el);
  });
  holdPlace();
}

// Home cards cut a memory off at 6 lines; those that are cut get "Read more" to open the card.
function addReadMore(el) {
  const check = () => el.querySelectorAll(".mem-card").forEach((card) => {
    const q = card.querySelector("blockquote");
    if (card.querySelector(".mem-more") || q.scrollHeight <= q.clientHeight + 2) return;
    const b = document.createElement("button");
    b.type = "button";
    b.className = "mem-more";
    b.textContent = "Read more";
    b.onclick = () => {
      const open = card.classList.toggle("open");
      b.textContent = open ? "Show less" : "Read more";
    };
    q.after(b);
  });
  check();
  document.fonts?.ready.then(check);
}

// Swipeable row of memory cards (home page and recipe page): swipe, tap a dot; on a computer
// also ‹ ›, drag with the mouse, or ← →.
function bindCarousel(el, count) {
  const section = el.closest("section");
  const dots = section.querySelector("[data-fill=mem-dots]");
  const prev = section.querySelector("[data-mem-prev]");
  const next = section.querySelector("[data-mem-next]");
  dots.hidden = count < 2;
  dots.innerHTML = Array.from({ length: count }, (_, i) => `<button type="button" aria-label="Memory ${i + 1} of ${count}"></button>`).join("");
  const cards = [...el.children];
  const current = () => {
    const mid = el.scrollLeft + el.clientWidth / 2;
    return cards.reduce((best, c, i) => (Math.abs(c.offsetLeft + c.offsetWidth / 2 - mid) < Math.abs(cards[best].offsetLeft + cards[best].offsetWidth / 2 - mid) ? i : best), 0);
  };
  const go = (i) => {
    i = Math.max(0, Math.min(cards.length - 1, i));
    el.scrollTo({ left: cards[i].offsetLeft + cards[i].offsetWidth / 2 - el.clientWidth / 2, behavior: "smooth" });
  };
  const mark = () => {
    const at = current();
    [...dots.children].forEach((d, i) => d.classList.toggle("on", i === at));
    prev.disabled = !count || at === 0;
    next.disabled = !count || at === cards.length - 1;
  };
  [...dots.children].forEach((d, i) => (d.onclick = () => go(i)));
  prev.onclick = () => go(current() - 1);
  next.onclick = () => go(current() + 1);
  el.onkeydown = (e) => {
    if (e.key === "ArrowLeft" || e.key === "ArrowRight") { e.preventDefault(); go(current() + (e.key === "ArrowRight" ? 1 : -1)); }
  };
  // Mouse: drag the cards sideways; a real drag doesn't count as a click on the dish link.
  let drag = null;
  el.onpointerdown = (e) => {
    if (e.pointerType !== "mouse" || e.button !== 0) return;
    drag = { x: e.clientX, left: el.scrollLeft, start: current(), moved: false };
  };
  el.onpointermove = (e) => {
    if (!drag) return;
    const dx = e.clientX - drag.x;
    if (!drag.moved && Math.abs(dx) > 5) { drag.moved = true; el.classList.add("dragging"); try { el.setPointerCapture(e.pointerId); } catch {} }
    if (drag.moved) el.scrollLeft = drag.left - dx;
  };
  el.onpointerup = el.onpointercancel = (e) => {
    if (!drag) return;
    const { moved, x, start } = drag;
    drag = null;
    if (!moved) return;
    el.classList.remove("dragging");
    const dx = e.clientX - x;
    go(Math.abs(dx) > 40 ? start + (dx < 0 ? 1 : -1) : start); // a short flick moves one card
  };
  el.ondragstart = (e) => e.preventDefault(); // images and links would otherwise start a browser drag
  el.onscroll = () => requestAnimationFrame(mark);
  mark();
}

function openMemoryForm() {
  const sheet = document.querySelector("[data-mem-sheet]");
  if (!sheet) return;
  sheet.querySelector("[data-fill=memf-dish]").textContent = RECIPES[memRecipeId()]?.title || "";
  sheet.querySelectorAll(".mem-msg").forEach((m) => (m.hidden = true));
  // Their name from last time (kept on this phone only).
  const name = sheet.querySelector("[name=name]");
  if (name && !name.value) name.value = store.get("memName", "");
  openSheet(sheet);
}

function setupMemories() {
  if (!MEMORIES_URL) return;
  document.querySelectorAll("[data-mem-section], [data-fill=mem-chip]").forEach((el) => (el.hidden = false));
  // The chip scrolls down to the memories, or (with none yet) opens the form straight away.
  document.querySelectorAll("[data-fill=mem-chip]").forEach((a) => (a.onclick = (e) => {
    e.preventDefault();
    if (!memories.some((m) => m.recipe === memRecipeId())) return openMemoryForm();
    document.getElementById("memories").scrollIntoView({ behavior: "smooth" });
  }));
  document.querySelectorAll("[data-mem-add]").forEach((b) => (b.onclick = openMemoryForm));
  window.addEventListener("hashchange", drawMemories);
  drawMemories();
  fetch(MEMORIES_URL)
    .then((r) => r.json())
    .then((d) => { memories = (d.memories || []).sort((a, b) => (b.at || "").localeCompare(a.at || "")); drawMemories(); })
    .catch(() => {}); // can't reach the sheet: the form still works, the list just stays empty

  document.querySelectorAll("[data-mem-form]").forEach((form) => form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const id = memRecipeId();
    const msg = form.querySelector(".mem-msg");
    const button = form.querySelector("button");
    const say = (text, err) => { msg.textContent = text; msg.classList.toggle("err", !!err); msg.hidden = false; };
    button.disabled = true;
    try {
      // Sent as plain text so the browser posts it straight to Google without a CORS check.
      const res = await fetch(MEMORIES_URL, { method: "POST", body: JSON.stringify({
        recipe: id, title: RECIPES[id]?.title || "", name: form.name.value, text: form.text.value, website: form.website.value,
      }) });
      const d = await res.json();
      if (!d.ok) throw new Error(d.error);
      store.set("memName", form.name.value.trim() || null);
      const name = form.name.value;
      form.reset();
      form.name.value = name;
      say("Thank you! Your memory will appear here once the family has read it.");
      setTimeout(closeSheet, 2600);
    } catch (err) {
      say(err.message && !/fetch|JSON/i.test(err.message) ? err.message : "Sorry, that didn't send. Please try again.", true);
    } finally {
      button.disabled = false;
    }
  }));
}

document.addEventListener("DOMContentLoaded", fillMockup);
document.addEventListener("DOMContentLoaded", setupMemories);
document.addEventListener("DOMContentLoaded", setupSheet);
document.addEventListener("DOMContentLoaded", setupCooking);

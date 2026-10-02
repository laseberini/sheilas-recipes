// Shared content + behaviour for the look-and-feel mockups.
// Each mockup supplies its own layout and CSS; this fills in the same real content everywhere.

// Recipe Table model: one table per recipe, so the whole recipe is visible at once.
// Ingredient rows down the left; step columns left to right. A column holds one or more
// steps, each spanning a range of rows (from..to), so side-by-side jobs share a column.
// est: true marks our estimates, still to be confirmed by Sheila.
const RECIPES = {
  fish: {
    title: "Fish Cakes",
    from: "Simy",
    date: "4/09",
    category: "Fish",
    page: "../images/pages/p170308.jpg",
    photo: "../images/dishes/fish-cakes.jpg",
    ingredients: [
      "250g mince Hake with carrot & onion (chopped)",
      "1 small egg",
      "Salt, pepper garlic salt",
      "Small tspn suger (optional)",
      "Bread crumbs",
    ],
    method: [
      "Put in Bowl & Mix",
      "Roll into balls & roll in Breadcrumbs & flatten gently (if v got time Before frying, Put fish cakes on a plate, leave in fridge for a bit)",
      "Oil in frying pan, not too much or too little very hot oil, turn every few minutes till Brown",
      "Take kitchen paper, put fish cakes to drain oil on then, more paper & drain again, put on cakes, cover with more paper, press gently to remove oil",
    ],
    notes: ["Serve with chips/salad whatever & Chrain"],
    table: {
      setup: ["Heat ±1 cm sunflower oil in a frying pan until very hot"],
      ingredients: [
        { text: "250 g hake mince, with finely chopped carrot & onion" },
        { text: "1 small egg" },
        { text: "salt, pepper & garlic salt" },
        { text: "5 ml (1 tsp) sugar, optional", est: true },
        { text: "±60 ml (¼ cup) dried breadcrumbs", est: true },
      ],
      columns: [
        [{ op: "mix", from: 0, to: 3 }],
        [{ op: "roll into 8 balls", from: 0, to: 3, est: true }],
        [{ op: "coat & flatten to ±2 cm", from: 0, to: 4, est: true }],
        [{ op: "chill 30 min (optional)", from: 0, to: 4, est: true }],
        [{ op: "fry 3–4 min a side, till golden", from: 0, to: 4, est: true }],
        [{ op: "drain on kitchen paper, press gently", from: 0, to: 4 }],
      ],
      finish: "Serve with chips or salad & chrain",
    },
  },
  lemon: {
    title: "Lemon Meringue",
    from: null,
    date: null,
    category: "Desserts",
    page: "../images/pages/p170706.jpg",
    photo: "../images/dishes/lemon-meringue.jpg",
    ingredients: [
      "2 Big tins condenced milk",
      "1-1½ packets marie biscuits",
      "6-8oz (180-250g) butter",
      "4 Eggs Separated",
      "6 Tablespoons sugar",
      "½ tspn Baking Powder",
      "¾ Cup Lemon Juice",
    ],
    method: [
      "Heat oven 120",
      "Crush marie Biscuits well",
      "melt Butter - mix with Biscuits",
      "Line bottom & side of Dish",
      "Beat condenced milk",
      "add 4 egg yolks (yellow) - beat",
      "add Lemon juice - beat",
      "pour mixture into biscuit lined dish",
      "Topping:",
      "Beat egg whites till stiff",
      "add 1 tablespoon Sugar for each egg white; Beat for one minute",
      "Fold in Rest of Sugar, cut into fluffy egg white",
      "Gently put egg white on top of mix",
      "Bake for ± 30 mins or until Mereingue slightly Browned",
    ],
    notes: [],
    table: {
      setup: ["Heat the oven to 120 °C"],
      ingredients: [
        { text: "1–1½ packets (200–300 g) Marie biscuits", est: true },
        { text: "180–250 g butter" },
        { text: "2 large tins (2 × 385 g) condensed milk", est: true },
        { text: "4 egg yolks" },
        { text: "180 ml (¾ cup) lemon juice" },
        { text: "4 egg whites" },
        { text: "2 ml (½ tsp) baking powder", est: true },
        { text: "60 ml (4 Tbsp) sugar" },
        { text: "30 ml (2 Tbsp) sugar" },
      ],
      columns: [
        [{ op: "crush well", from: 0, to: 0 }, { op: "melt", from: 1, to: 1 }, { op: "beat", from: 2, to: 2 }],
        [{ op: "mix", from: 0, to: 1 }, { op: "add & beat", from: 2, to: 3 }],
        [{ op: "press over base & sides of a pie dish", from: 0, to: 1 }, { op: "add & beat", from: 2, to: 4 }],
        [{ op: "pour filling into base", from: 0, to: 4 }, { op: "beat till stiff", from: 5, to: 6, est: true }],
        [{ op: "beat in, 1 min", from: 5, to: 7 }],
        [{ op: "fold in gently", from: 5, to: 8 }],
        [{ op: "spread meringue over filling", from: 0, to: 8 }],
      ],
      finish: "Bake ±30 min, until the meringue is lightly browned",
    },
  },
};

const MOCK = {
  categories: [
    { name: "Soups", recipes: ["Minestrone Soup"] },
    { name: "Starters & Salads", recipes: ["Aletta's Caponata", "Nonna's Butter Bean & Potato Salad"] },
    { name: "Fish", recipes: ["Fish Cakes"] },
    { name: "Chicken", recipes: ["Nonna's Artichoke & Chicken"] },
    { name: "Meat", recipes: ["Brisket in Coke", "Cape Bobotie", "Pulpetti"] },
    { name: "Pasta & Rice", recipes: ["Easy 'No Meat' Lasagne", "Gnocchi", "Funghi Risotto", "Oven Penne with Mellenzana", "Polenta Parmigiana"] },
    { name: "Vegetables & Sides", recipes: ["Nonna's Secret Mellenzana", "Melanzana alla Parmigiana", "Stuffed Artichokes", "Spinach, Feta & Ricotta Pie", "Mushroom & Cheese Quiche", "Sweetcorn Bake"] },
    { name: "Sauces", recipes: ["Neapolitan Sauce", "Nonna's Bolognaise", "Porcini Sauce"] },
    { name: "Desserts", recipes: ["Lemon Meringue", "Brandy Tart", "Chocolate Nut Tart", "Bronwyn's Pecan Pie", "Peppermint Crisp Cake", "Cheese Fridge Cake", "Avis' Cheesecake", "Apple & Youngberry Crumble", "Winter Pudding"] },
    { name: "Cakes & Bakes", recipes: ["Lamington Squares", "Poppy Seed Cake", "Peanut Butter Brownies"] },
  ],
  // Which mock recipe each title opens; everything else opens Fish Cakes.
  links: { "Fish Cakes": "fish", "Lemon Meringue": "lemon" },
  intro:
    "This is where Sheila's own welcome note will go once it's scanned: a few words about where these recipes came from, " +
    "the people who shared them, and the meals they've been part of over the years.",
};

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

function recipeTable(t) {
  const n = t.ingredients.length;
  const cols = t.columns.length + 1;
  const rows = [];
  // Full-width rows keep their text pinned in view while the table scrolls sideways.
  const wide = (cls, text) => `<tr><td class="${cls}" colspan="${cols}"><span class="eng-pin">${esc(text)}</span></td></tr>`;
  for (const s of t.setup || []) rows.push(wide("eng-setup", s));
  for (let r = 0; r < n; r++) {
    const ing = t.ingredients[r];
    let row = `<td class="eng-ing${ing.est ? " est" : ""}">${esc(ing.text)}</td>`;
    for (const col of t.columns) {
      const at = (i) => col.find((s) => i >= s.from && i <= s.to);
      const step = at(r);
      if (step && step.from === r) {
        row += `<td class="eng-op${step.est ? " est" : ""}" rowspan="${step.to - step.from + 1}">${esc(step.op)}</td>`;
      } else if (!step && (r === 0 || at(r - 1))) {
        // Merge consecutive rows that no step in this column touches into one blank cell.
        let end = r;
        while (end + 1 < n && !at(end + 1)) end++;
        row += `<td class="eng-gap" rowspan="${end - r + 1}"></td>`;
      }
    }
    rows.push(`<tr>${row}</tr>`);
  }
  if (t.finish) rows.push(wide("eng-finish", t.finish));
  return `<div class="eng-scroller">
      <div class="eng-wrap"><table class="eng"><colgroup><col class="eng-col-ing">${t.columns.map(() => `<col class="eng-col-step" style="width:${(70 / t.columns.length).toFixed(2)}%">`).join("")}</colgroup>${rows.join("")}</table></div>
      <div class="eng-map" aria-label="Jump to a step"></div>
    </div>
    <p class="eng-note"><span class="est-key"></span> Estimated amounts and times. Sheila still needs to confirm these.</p>`;
}

// When the table is wider than the screen: ingredients stay pinned on the left, the steps
// glide past and snap to a column, a step map shows what's in view (tap to glide there),
// and the first time it appears the table nudges sideways to show there's more.
function enhanceTables() {
  document.querySelectorAll(".eng-scroller").forEach((box) => {
    const wrap = box.querySelector(".eng-wrap");
    const map = box.querySelector(".eng-map");
    if (!wrap.offsetParent) return; // pane hidden
    const table = wrap.querySelector("table");
    box.classList.remove("scrolls", "own-borders");
    const scrolls = wrap.scrollWidth > wrap.clientWidth + 2;
    if (!scrolls) return;
    // A pinned column can't keep shared (collapsed) borders, so give each cell its own.
    const collapsed = getComputedStyle(table).borderCollapse === "collapse";
    box.classList.add("scrolls");
    box.classList.toggle("own-borders", collapsed);

    const pin = wrap.querySelector(".eng-ing").offsetWidth;
    wrap.style.setProperty("--pin", pin + "px");
    const starts = [...new Set([...wrap.querySelectorAll(".eng-op, .eng-gap")].map((c) => c.offsetLeft + table.offsetLeft))].sort((a, b) => a - b);
    map.innerHTML = starts.map((x, i) => `<button type="button" aria-label="Step ${i + 1}"></button>`).join("");
    const buttons = [...map.children];
    buttons.forEach((b, i) => (b.onclick = () => wrap.scrollTo({ left: starts[i] - pin, behavior: "smooth" })));

    const update = () => {
      const left = wrap.scrollLeft + pin;
      const right = wrap.scrollLeft + wrap.clientWidth;
      buttons.forEach((b, i) => {
        const end = starts[i + 1] ?? wrap.scrollWidth;
        b.classList.toggle("on", starts[i] < right - 8 && end > left + 8);
      });
      box.classList.toggle("scrolled", wrap.scrollLeft > 2);
      box.classList.toggle("at-end", wrap.scrollLeft + wrap.clientWidth >= wrap.scrollWidth - 2);
    };
    wrap.onscroll = update;
    update();

    if (!box.dataset.nudged) {
      box.dataset.nudged = "1";
      wrap.style.scrollSnapType = "none";
      setTimeout(() => wrap.scrollTo({ left: 72, behavior: "smooth" }), 350);
      setTimeout(() => wrap.scrollTo({ left: 0, behavior: "smooth" }), 1050);
      setTimeout(() => (wrap.style.scrollSnapType = ""), 1700);
    }
  });
}
window.addEventListener("resize", enhanceTables);

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
    if (e.target !== img) { if (s === 1) close(); return; }
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
  const page = e.target.closest("img[data-fill=page], [data-fill=dish] img");
  if (page) openLightbox(page.src, page.alt);
});
document.fonts?.ready.then(enhanceTables);

function methodItems(lines) {
  // A line ending in ":" is a sub-heading (e.g. "Topping:"), not a numbered step.
  return lines.map((m) => (m.trim().endsWith(":") ? `<li class="sub">${esc(m)}</li>` : `<li>${esc(m)}</li>`)).join("");
}

function renderRecipe(R) {
  const set = (name, fn) => document.querySelectorAll(`[data-fill=${name}]`).forEach(fn);
  set("title", (el) => (el.textContent = R.title));
  set("title-em", (el) => {
    const words = R.title.split(" ");
    const last = words.pop();
    el.innerHTML = `${esc(words.join(" "))} <em>${esc(last)}</em>`;
  });
  set("cat", (el) => (el.textContent = (el.dataset.prefix || "") + R.category));
  for (const key of ["from", "date"]) {
    set(key, (el) => {
      el.hidden = !R[key];
      el.textContent = R[key] ? (el.dataset.prefix || "") + R[key] : "";
    });
  }
  set("ingredients", (el) => (el.innerHTML = R.ingredients.map((i) => `<li>${esc(i)}</li>`).join("")));
  set("method", (el) => (el.innerHTML = methodItems(R.method)));
  set("notes", (el) => {
    el.hidden = !R.notes.length;
    el.innerHTML = R.notes.map((m) => `<p>${esc(m)}</p>`).join("");
  });
  set("engineer", (el) => (el.innerHTML = recipeTable(R.table)));
  set("page", (el) => (el.src = R.page));
  set("dish", (el) => {
    el.classList.toggle("has-photo", !!R.photo);
    el.innerHTML = R.photo ? `<img src="${R.photo}" alt="${esc(R.title)}, as it might look on the table (AI-generated picture)">` : "";
  });
}

function fillMockup() {
  document.querySelectorAll("[data-fill=intro]").forEach((el) => (el.textContent = MOCK.intro));
  document.querySelectorAll("[data-fill=categories]").forEach((el) => {
    el.innerHTML = MOCK.categories.map((c) => `
      <section class="cat">
        <h3 class="cat-name">${esc(c.name)} <span class="cat-count">${c.recipes.length}</span></h3>
        <ul class="cat-list">${c.recipes.map((t) => `<li><a href="#recipe-${MOCK.links[t] || "fish"}">${esc(t)}</a></li>`).join("")}</ul>
      </section>`).join("");
  });

  // Three-way switch: her page / the recipe / recipe table.
  const ORDER = ["page", "recipe", "engineer"];
  const views = [];
  document.querySelectorAll("[data-views]").forEach((group) => {
    const scope = group.closest("[data-recipe]") || document;
    let current = null;
    const show = (v, animate) => {
      const dir = current === null ? 0 : Math.sign(ORDER.indexOf(v) - ORDER.indexOf(current));
      current = v;
      group.querySelectorAll("[data-view]").forEach((b) => b.classList.toggle("on", b.dataset.view === v));
      group.style.setProperty("--pos", ORDER.indexOf(v));
      scope.querySelectorAll("[data-pane]").forEach((p) => {
        p.hidden = p.dataset.pane !== v;
        p.classList.remove("pane-from-right", "pane-from-left");
        if (!p.hidden && animate && dir) {
          void p.offsetWidth; // restart the animation
          p.classList.add(dir > 0 ? "pane-from-right" : "pane-from-left");
        }
      });
      enhanceTables();
    };
    group.querySelectorAll("[data-view]").forEach((b) => (b.onclick = () => show(b.dataset.view, true)));
    views.push(show);

    // Swipe left/right anywhere on the recipe to move between the three views. A swipe that
    // starts on a table that scrolls sideways is left to the table.
    let t0 = null;
    scope.addEventListener("touchstart", (e) => {
      const onTable = e.target.closest(".eng-scroller.scrolls");
      t0 = e.touches.length === 1 && !onTable ? { x: e.touches[0].clientX, y: e.touches[0].clientY, t: Date.now() } : null;
    }, { passive: true });
    scope.addEventListener("touchend", (e) => {
      if (!t0) return;
      const dx = e.changedTouches[0].clientX - t0.x;
      const dy = e.changedTouches[0].clientY - t0.y;
      const quick = Date.now() - t0.t < 700;
      t0 = null;
      if (!quick || Math.abs(dx) < 60 || Math.abs(dx) < Math.abs(dy) * 1.5) return;
      const next = ORDER[ORDER.indexOf(current) + (dx < 0 ? 1 : -1)];
      if (next) show(next, true);
    }, { passive: true });
  });

  // Home ↔ recipe "pages". #recipe-fish, #recipe-lemon (plain #recipe = Fish Cakes).
  const recipeKey = () => (location.hash.startsWith("#recipe") ? location.hash.slice(8) || "fish" : null);
  const route = () => {
    const key = recipeKey();
    document.querySelectorAll("[data-screen]").forEach((s) => (s.hidden = s.dataset.screen !== (key ? "recipe" : "home")));
    if (key) {
      renderRecipe(RECIPES[key] || RECIPES.fish);
      views.forEach((show) => show(key === "lemon" ? "engineer" : "recipe"));
    }
    window.scrollTo(0, 0);
  };
  window.addEventListener("hashchange", route);
  route();

  // Switcher between mockups (not part of any design).
  const here = location.pathname.split("/").pop();
  const bar = document.createElement("nav");
  bar.className = "mock-switch";
  const drawBar = () => {
    const onRecipe = !!recipeKey();
    bar.innerHTML = [["a-heirloom.html", "A · Heirloom"], ["b-mediterranean.html", "B · Nonna's Table"], ["c-clean.html", "C · Clean Kitchen"], ["d-magazine.html", "D · Magazine"]]
      .map(([f, l]) => `<a href="${f}${location.hash}" class="${f === here ? "on" : ""}">${l}</a>`).join("") +
      (onRecipe ? `<a href="#" class="flip">← Home</a>` : `<a href="#recipe-fish" class="flip">Fish Cakes →</a><a href="#recipe-lemon" class="flip">Lemon Meringue →</a>`);
  };
  drawBar();
  document.body.appendChild(bar);
  window.addEventListener("hashchange", drawBar);

  const style = document.createElement("style");
  style.textContent = `
    .mock-switch { position: fixed; left: 50%; bottom: 14px; transform: translateX(-50%); z-index: 999;
      display: flex; gap: 4px; padding: 5px; background: rgba(20,20,20,.88); border-radius: 99px;
      font: 500 13px/1 system-ui, sans-serif; box-shadow: 0 6px 24px rgba(0,0,0,.25); max-width: calc(100vw - 16px); overflow-x: auto; }
    .mock-switch a { color: #ddd; text-decoration: none; padding: 8px 12px; border-radius: 99px; white-space: nowrap; }
    .mock-switch a.on { background: #fff; color: #111; }
    .mock-switch a.flip { color: #ffd479; }
    body { padding-bottom: 80px; }
    [hidden] { display: none !important; }

    .method li.sub { counter-increment: none !important; display: block !important; padding: 8px 0 6px !important; font-weight: 700; }
    .method li.sub::before { content: none !important; }

    /* Auto layout: a step column is never narrower than its longest word, so text can't cross
       a line. If that makes the table too wide for the screen, it switches to the sideways glide. */
    .eng { table-layout: auto; }
    .eng-col-ing { width: 30%; }
    .eng-op { overflow-wrap: normal; word-break: normal; hyphens: manual; }
    .eng-wrap { position: relative; }

    /* Swiping between Her page / The recipe / Recipe Table slides the new view in. */
    @keyframes paneFromRight { from { opacity: 0; transform: translateX(36px); } to { opacity: 1; transform: none; } }
    @keyframes paneFromLeft { from { opacity: 0; transform: translateX(-36px); } to { opacity: 1; transform: none; } }
    [data-recipe] { overflow-x: clip; }
    .pane-from-right { animation: paneFromRight .28s ease-out; }
    .pane-from-left { animation: paneFromLeft .28s ease-out; }

    /* Original page: tap to open full screen, pinch / double-tap / scroll-wheel to zoom. */
    [data-fill=page], [data-fill=dish] img { cursor: zoom-in; }
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

    /* Sideways glide (only kicks in when the table is wider than the screen). */
    .eng-scroller.scrolls .eng-wrap {
      overflow-x: auto; scroll-snap-type: x proximity; scroll-padding-left: var(--pin, 140px);
      overscroll-behavior-x: contain; scrollbar-width: none; -webkit-overflow-scrolling: touch;
    }
    .eng-scroller.scrolls .eng-wrap::-webkit-scrollbar { display: none; }
    .eng-scroller.scrolls:not(.at-end) .eng-wrap {
      -webkit-mask-image: linear-gradient(to right, #000 calc(100% - 40px), transparent);
              mask-image: linear-gradient(to right, #000 calc(100% - 40px), transparent);
    }
    .eng-scroller.scrolls .eng-op, .eng-scroller.scrolls .eng-gap { scroll-snap-align: start; }
    .eng-scroller.scrolls .eng-ing { position: sticky; left: 0; z-index: 2; background: var(--eng-bg, #fff); transition: box-shadow .2s; }
    .eng-scroller.scrolled .eng-ing { box-shadow: 8px 0 12px -8px rgba(0,0,0,.3); }
    .eng-scroller.own-borders .eng { border-collapse: separate !important; border-spacing: 0 !important; }
    .eng-scroller.own-borders .eng td:not(.eng-ing):not(.eng-setup):not(.eng-finish) { border-left-width: 0 !important; }
    .eng-scroller.own-borders .eng tr:not(:first-child) td { border-top-width: 0 !important; }
    .eng-scroller.scrolls .eng-setup, .eng-scroller.scrolls .eng-finish { text-align: left; }
    .eng-pin { display: inline-block; }
    .eng-scroller.scrolls .eng-pin { position: sticky; left: 12px; }

    .eng-map { display: none; gap: 5px; margin-top: 8px; }
    .eng-scroller.scrolls .eng-map { display: flex; }
    .eng-map button { flex: 1; height: 22px; padding: 0; border: 0; background: none; cursor: pointer; position: relative; }
    .eng-map button::after { content: ""; position: absolute; left: 0; right: 0; top: 8px; height: 6px; border-radius: 99px;
      background: var(--eng-accent, currentColor); opacity: .18; transition: opacity .25s; }
    .eng-map button.on::after { opacity: .8; }

    /* Upright phone: fixed, comfortable column widths; the table glides sideways. */
    @media (max-width: 640px) {
      .eng-wrap { padding: 0 !important; border-radius: 0 !important; background: none !important; --pin: 136px; }
      .eng { table-layout: auto !important; width: max-content !important; min-width: 100% !important; font-size: 14px !important; line-height: 1.35 !important; }
      .eng td { padding: 8px 8px !important; }
      .eng-col-ing { width: 136px; }
      .eng-col-step { width: auto !important; }
      .eng-ing { width: 136px !important; min-width: 136px !important; max-width: 136px !important; }
      .eng-op, .eng-gap { width: 96px !important; min-width: 96px !important; max-width: 96px !important; }
    }`;
  document.head.appendChild(style);
}

document.addEventListener("DOMContentLoaded", fillMockup);

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
      <div class="eng-wrap"><table class="eng"><colgroup><col class="eng-col-ing"><col span="${t.columns.length}"></colgroup>${rows.join("")}</table></div>
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
  const views = [];
  document.querySelectorAll("[data-views]").forEach((group) => {
    const scope = group.closest("[data-recipe]") || document;
    const show = (v) => {
      group.querySelectorAll("[data-view]").forEach((b) => b.classList.toggle("on", b.dataset.view === v));
      group.style.setProperty("--pos", ["page", "recipe", "engineer"].indexOf(v));
      scope.querySelectorAll("[data-pane]").forEach((p) => (p.hidden = p.dataset.pane !== v));
      enhanceTables();
    };
    group.querySelectorAll("[data-view]").forEach((b) => (b.onclick = () => show(b.dataset.view)));
    views.push(show);
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

    .eng { table-layout: fixed; }
    .eng-col-ing { width: 30%; }
    .eng-wrap { position: relative; }

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
      .eng-ing { width: 136px !important; min-width: 136px !important; max-width: 136px !important; }
      .eng-op, .eng-gap { width: 96px !important; min-width: 96px !important; max-width: 96px !important; }
    }`;
  document.head.appendChild(style);
}

document.addEventListener("DOMContentLoaded", fillMockup);

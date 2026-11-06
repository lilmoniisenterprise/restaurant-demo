/* ==========================================================================
   Ondessa — Coastal Hearth Kitchen · Demonstration site by Virellion Apex
   Vanilla JavaScript, no dependencies, no API keys.

   DEMO MODE: Reservations, catering inquiries, contact messages and orders
   are handled entirely in the browser. Nothing is transmitted anywhere.
   To connect a real backend, see README.md → "Connecting a real backend"
   and the `submitToBackend()` function near the bottom of this file.
   ========================================================================== */
(function () {
  "use strict";

  document.documentElement.classList.remove("no-js");

  /* ------------------------------------------------------------------ CONFIG */
  const CONFIG = {
    demoMode: true,               // keep true until a real backend is wired up
    endpoints: {                  // fill these in when a backend exists (see README)
      reservation: "",
      catering: "",
      contact: "",
      order: ""
    },
    timeZone: "America/Chicago",  // restaurant's local time zone
    taxRate: 0.0825,              // demo sales-tax estimate
    deliveryFeeCents: 499,        // demo delivery fee
    cateringServiceRate: 0.18,    // demo service/staffing charge for full-service catering
    cartKey: "ondessa-demo-cart",
    reservationWindowDays: 60
  };

  /* --------------------------------------------------------------- HOURS
     Day index 0 = Sunday. Times are minutes after midnight, local restaurant time. */
  const HOURS = {
    0: { open: 11 * 60, close: 21 * 60, label: "11:00 AM – 9:00 PM" },
    1: null,
    2: { open: 17 * 60, close: 22 * 60, label: "5:00 PM – 10:00 PM" },
    3: { open: 17 * 60, close: 22 * 60, label: "5:00 PM – 10:00 PM" },
    4: { open: 17 * 60, close: 22 * 60, label: "5:00 PM – 10:00 PM" },
    5: { open: 17 * 60, close: 23 * 60, label: "5:00 PM – 11:00 PM" },
    6: { open: 11 * 60 + 30, close: 23 * 60, label: "11:30 AM – 11:00 PM" }
  };
  const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  /* ---------------------------------------------------------------- MENU
     Prices are stored in cents to avoid floating-point rounding errors. */
  const CATEGORIES = [
    { id: "specials", label: "Specials", blurb: "Chef's daily and weekly offerings" },
    { id: "appetizers", label: "Appetizers", blurb: "To share, or not" },
    { id: "entrees", label: "Entrées", blurb: "From the hearth and the coast" },
    { id: "desserts", label: "Desserts", blurb: "A sweet, slow finish" },
    { id: "beverages", label: "Beverages", blurb: "Cocktails, zero-proof & coffee" }
  ];

  const MENU = [
    { id: "market-crudo", cat: "specials", name: "Octopus Carpaccio Crudo", price: 2200, tags: ["gf"], badge: "Daily",
      desc: "Paper-thin octopus, citrus, Fresno chili, capers, sea salt and first-press olive oil." },
    { id: "seafood-tower", cat: "specials", name: "Harbor Seafood Tower", price: 9800, tags: ["gf"], badge: "Serves 2–4",
      desc: "Gulf oysters, chilled shrimp and citrus over crushed ice, with mignonette, cocktail sauce and charred lemon." },
    { id: "tasting-menu", cat: "specials", name: "Coastal Tasting Menu", price: 9500, tags: ["dine"], badge: "Per guest", orderable: false,
      desc: "Five seasonal courses from the hearth, paced for the table. Dine-in only — reserve and let the kitchen lead." },
    { id: "charred-octopus", cat: "appetizers", name: "Charred Octopus", price: 1900, tags: ["gf"], featured: true,
      desc: "Wood-grilled tentacles, smoked paprika, white bean purée, preserved lemon and parsley oil." },
    { id: "burrata", cat: "appetizers", name: "Burrata & Blistered Tomatoes", price: 1700, tags: ["v"],
      desc: "Creamy burrata, fire-blistered heirloom tomatoes, basil oil, flaky salt, grilled sourdough." },
    { id: "hearth-flatbread", cat: "appetizers", name: "Hearth Flatbread", price: 1600, tags: ["v"],
      desc: "Naturally leavened dough, San Marzano tomato, fior di latte, wild oregano and chili honey." },
    { id: "crispy-calamari", cat: "appetizers", name: "Crispy Calamari", price: 1500, tags: [],
      desc: "Semolina-dusted rings, Calabrian chili aioli, charred lemon and herb salt." },
    { id: "ember-carrots", cat: "appetizers", name: "Ember-Roasted Carrots", price: 1400, tags: ["v", "gf"],
      desc: "Heirloom carrots roasted in the coals, whipped labneh, pistachio dukkah and mint." },
    { id: "whole-branzino", cat: "entrees", name: "Whole Grilled Branzino", price: 3800, tags: ["gf"], featured: true,
      desc: "Deboned Mediterranean sea bass, salsa verde, shaved fennel, grilled lemon and rosemary." },
    { id: "saffron-paella", cat: "entrees", name: "Saffron Seafood Paella", price: 5600, tags: ["gf"], badge: "For two", featured: true,
      desc: "Bomba rice, Gulf shrimp, mussels, sweet peas and a crackling socarrat crust, finished at the table." },
    { id: "hearth-ribeye", cat: "entrees", name: "16 oz Hearth Ribeye", price: 5400, tags: ["gf"],
      desc: "Dry-aged and oak-fired, with chimichurri, roasted garlic and flaky sea salt." },
    { id: "lamb-shoulder", cat: "entrees", name: "Wood-Fired Lamb Chops", price: 4200, tags: ["gf"],
      desc: "Frenched lamb chops kissed by oak smoke, crispy potatoes, greens and rosemary jus." },
    { id: "mushroom-risotto", cat: "entrees", name: "Wild Mushroom Risotto", price: 2900, tags: ["v", "gf"],
      desc: "Carnaroli rice, foraged mushrooms, aged Parmigiano, thyme and brown butter." },
    { id: "olive-oil-cake", cat: "desserts", name: "Lemon Olive Oil Cake", price: 1200, tags: ["v"], featured: true,
      desc: "Tender olive oil bundt cake, Meyer lemon glaze, powdered sugar and candied zest." },
    { id: "honey-panna-cotta", cat: "desserts", name: "Vanilla Bean Panna Cotta", price: 1100, tags: ["gf"],
      desc: "Silky vanilla cream, macerated berries, wildflower honey and fresh mint." },
    { id: "chocolate-tart", cat: "desserts", name: "Dark Chocolate Tart", price: 1300, tags: ["v"],
      desc: "70% chocolate ganache, brown-butter crust, raspberries and gold leaf." },
    { id: "sorbet-trio", cat: "desserts", name: "Meyer Lemon Cheesecake", price: 1000, tags: ["v"],
      desc: "Creamy baked cheesecake, brown-butter crust and bright lemon curd." },
    { id: "sea-glass-spritz", cat: "beverages", name: "Sea-Glass Spritz", price: 1400, tags: [], badge: "21+",
      desc: "Bitter orange aperitivo, prosecco, a pinch of sea salt and a fresh orange wheel." },
    { id: "smoked-old-fashioned", cat: "beverages", name: "Smoked Old Fashioned", price: 1600, tags: [], badge: "21+",
      desc: "Oak-smoked bourbon, demerara, aromatic bitters, brandied cherry." },
    { id: "garden-negroni", cat: "beverages", name: "Garden Negroni", price: 1500, tags: [], badge: "21+",
      desc: "Botanical gin, sweet vermouth, bitter aperitivo, charred orange." },
    { id: "rosemary-lemonade", cat: "beverages", name: "Garden Mint Lemonade", price: 700, tags: ["v", "gf"], badge: "Zero-proof",
      desc: "Fresh-pressed lemon, garden mint, cane sugar and sparkling water." },
    { id: "espresso", cat: "beverages", name: "Cortado", price: 500, tags: ["v", "gf"],
      desc: "Single-origin double shot cut with silky steamed milk, roasted locally." }
  ];
  /* Food photography: Pexels (free to use). Each dish keeps a local illustrated fallback in images/menu/. */
  const PHOTOS = {
    "market-crudo": 17243886, "seafood-tower": 10895800, "tasting-menu": 33033817, "charred-octopus": 14885388,
    "burrata": 20184728, "hearth-flatbread": 21753116, "crispy-calamari": 11160096, "ember-carrots": 39022466,
    "whole-branzino": 17598332, "saffron-paella": 8969237, "hearth-ribeye": 6542790, "lamb-shoulder": 10821331,
    "mushroom-risotto": 6406460, "olive-oil-cake": 24742649, "honey-panna-cotta": 3301907, "chocolate-tart": 36051538,
    "sorbet-trio": 31799935, "sea-glass-spritz": 20094378, "smoked-old-fashioned": 29707924, "garden-negroni": 27851286,
    "rosemary-lemonade": 27551844, "espresso": 33669195
  };
  const pexels = (pid, w) => `https://images.pexels.com/photos/${pid}/pexels-photo-${pid}.jpeg?auto=compress&cs=tinysrgb&w=${w}`;
  const dishImg = (id, w = 800) => (PHOTOS[id] ? pexels(PHOTOS[id], w) : `images/menu/${id}.jpg`);
  const dishSrcset = (id) => (PHOTOS[id] ? `${pexels(PHOTOS[id], 600)} 600w, ${pexels(PHOTOS[id], 1000)} 1000w` : "");
  // If a remote photo ever fails, swap in the local illustration (CSP-safe: no inline handlers).
  document.addEventListener("error", (e) => {
    const img = e.target;
    if (img && img.tagName === "IMG" && img.dataset.fallback && img.getAttribute("src") !== img.dataset.fallback) {
      img.removeAttribute("srcset"); img.src = img.dataset.fallback;
    }
  }, true);
  const MENU_BY_ID = Object.fromEntries(MENU.map((m) => [m.id, m]));
  const TAG_LABEL = { v: "Vegetarian", gf: "Gluten-free", dine: "Dine-in only" };

  /* ------------------------------------------------------------- HELPERS */
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const money = (cents) => "$" + (cents / 100).toFixed(2);
  const moneyWhole = (cents) => "$" + Math.round(cents / 100).toLocaleString("en-US");
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const pad = (n) => String(n).padStart(2, "0");
  const refCode = (prefix) => `DEMO-${prefix}-${Date.now().toString(36).slice(-4).toUpperCase()}${Math.floor(Math.random() * 90 + 10)}`;

  const store = {
    get(key, fallback) {
      try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch (e) { return fallback; }
    },
    set(key, value) { try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* storage unavailable */ } }
  };

  /** Current date/time in the restaurant's time zone. */
  function restaurantNow() {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: CONFIG.timeZone, year: "numeric", month: "2-digit", day: "2-digit",
      hour: "2-digit", minute: "2-digit", hourCycle: "h23", weekday: "short"
    }).formatToParts(new Date());
    const get = (t) => parts.find((p) => p.type === t).value;
    const y = +get("year"), m = +get("month"), d = +get("day");
    return { y, m, d, minutes: (+get("hour")) * 60 + (+get("minute")), dow: new Date(Date.UTC(y, m - 1, d)).getUTCDay(), iso: `${y}-${pad(m)}-${pad(d)}` };
  }
  /** Parse a YYYY-MM-DD string to a UTC date (calendar math only). */
  const parseISO = (iso) => { const [y, m, d] = iso.split("-").map(Number); return new Date(Date.UTC(y, m - 1, d)); };
  const toISO = (dt) => `${dt.getUTCFullYear()}-${pad(dt.getUTCMonth() + 1)}-${pad(dt.getUTCDate())}`;
  const addDays = (iso, n) => { const dt = parseISO(iso); dt.setUTCDate(dt.getUTCDate() + n); return toISO(dt); };
  const dowOf = (iso) => parseISO(iso).getUTCDay();
  const fmtTime = (mins) => { const h = Math.floor(mins / 60) % 24, m = mins % 60; return `${((h + 11) % 12) + 1}:${pad(m)} ${h < 12 ? "AM" : "PM"}`; };
  const fmtDate = (iso) => parseISO(iso).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric", timeZone: "UTC" });

  function openStatus() {
    const now = restaurantNow();
    const today = HOURS[now.dow];
    if (today && now.minutes >= today.open && now.minutes < today.close) {
      return { open: true, text: `Open now · until ${fmtTime(today.close)}` };
    }
    if (today && now.minutes < today.open) return { open: false, text: `Opens today at ${fmtTime(today.open)}` };
    for (let i = 1; i <= 7; i++) {
      const d = (now.dow + i) % 7;
      if (HOURS[d]) return { open: false, text: `Closed now · opens ${i === 1 ? "tomorrow" : DAY_NAMES[d]} at ${fmtTime(HOURS[d].open)}` };
    }
    return { open: false, text: "Closed" };
  }

  /* --------------------------------------------------------------- TOAST */
  function toast(html) {
    const region = $("#toast-region");
    if (!region) return;
    const t = document.createElement("div");
    t.className = "toast";
    t.innerHTML = html;
    region.appendChild(t);
    setTimeout(() => { t.style.opacity = "0"; t.style.transition = "opacity .3s"; }, 2600);
    setTimeout(() => t.remove(), 3000);
  }

  /* ---------------------------------------------------- DEMO RIBBON & NAV */
  function initRibbon() {
    const ribbon = $(".demo-ribbon");
    if (!ribbon) return;
    try { if (sessionStorage.getItem("ondessa-ribbon") === "hidden") ribbon.hidden = true; } catch (e) {}
    const btn = $("button", ribbon);
    btn && btn.addEventListener("click", () => {
      ribbon.hidden = true;
      try { sessionStorage.setItem("ondessa-ribbon", "hidden"); } catch (e) {}
    });
  }

  function initNav() {
    const toggle = $(".nav-toggle");
    const nav = $("#site-nav");
    if (!toggle || !nav) return;
    const setOpen = (open) => {
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      nav.classList.toggle("open", open);
      document.body.classList.toggle("nav-open", open);
    };
    toggle.addEventListener("click", () => setOpen(toggle.getAttribute("aria-expanded") !== "true"));
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && nav.classList.contains("open")) { setOpen(false); toggle.focus(); }
    });
    $$("a", nav).forEach((a) => a.addEventListener("click", () => setOpen(false)));
    window.matchMedia("(min-width: 921px)").addEventListener("change", (e) => e.matches && setOpen(false));
  }

  function initReveal() {
    const els = $$(".reveal");
    if (!("IntersectionObserver" in window) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      els.forEach((el) => el.classList.add("in")); return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    els.forEach((el) => io.observe(el));
  }

  function initStatus() {
    const s = openStatus();
    $$("[data-open-status]").forEach((el) => {
      el.innerHTML = `<span class="status-dot ${s.open ? "open" : "closed"}" aria-hidden="true"></span>${esc(s.text)}`;
    });
    const now = restaurantNow();
    $$(".hours-table tr[data-day]").forEach((tr) => tr.classList.toggle("today", +tr.dataset.day === now.dow));
    $$("[data-year]").forEach((el) => (el.textContent = String(new Date().getFullYear())));
  }

  /* ---------------------------------------------------------------- CART */
  const Cart = {
    items: {}, // { id: qty }
    mode: "pickup",
    load() {
      const saved = store.get(CONFIG.cartKey, {});
      this.items = {};
      Object.entries(saved.items || {}).forEach(([id, q]) => {
        const item = MENU_BY_ID[id];
        if (item && item.orderable !== false && Number.isInteger(q) && q > 0) this.items[id] = Math.min(q, 20);
      });
      this.mode = saved.mode === "delivery" ? "delivery" : "pickup";
    },
    save() { store.set(CONFIG.cartKey, { items: this.items, mode: this.mode }); },
    add(id, qty = 1) {
      const item = MENU_BY_ID[id];
      if (!item || item.orderable === false) return;
      this.items[id] = Math.min((this.items[id] || 0) + qty, 20);
      this.save(); renderCart(); bumpCount();
      toast(`<span aria-hidden="true">✓</span> <span><b>${esc(item.name)}</b> added to your order</span>`);
    },
    setQty(id, qty) {
      if (qty <= 0) delete this.items[id]; else this.items[id] = Math.min(qty, 20);
      this.save(); renderCart();
    },
    clear() { this.items = {}; this.save(); renderCart(); },
    count() { return Object.values(this.items).reduce((a, b) => a + b, 0); },
    lines() { return Object.entries(this.items).map(([id, qty]) => ({ item: MENU_BY_ID[id], qty, total: MENU_BY_ID[id].price * qty })); },
    totals() {
      const subtotal = this.lines().reduce((a, l) => a + l.total, 0);
      const fee = this.mode === "delivery" && subtotal > 0 ? CONFIG.deliveryFeeCents : 0;
      const tax = Math.round(subtotal * CONFIG.taxRate);
      return { subtotal, fee, tax, total: subtotal + fee + tax };
    }
  };

  function bumpCount() {
    $$(".cart-count").forEach((c) => { c.classList.remove("bump"); void c.offsetWidth; c.classList.add("bump"); });
  }

  function renderCart() {
    const count = Cart.count();
    const t = Cart.totals();
    $$(".cart-count").forEach((c) => { c.textContent = count; c.dataset.count = count; });
    $$("[data-cart-label]").forEach((c) => (c.textContent = count === 1 ? "1 item" : `${count} items`));
    $$(".cart-btn").forEach((b) => b.setAttribute("aria-label", `Open your order, ${count} ${count === 1 ? "item" : "items"}`));

    const list = $("#cart-items");
    const empty = $("#cart-empty");
    const foot = $("#cart-foot");
    if (list) {
      list.innerHTML = Cart.lines().map(({ item, qty, total }) => `
        <li class="cart-item">
          <img src="${dishImg(item.id, 200)}" data-fallback="images/menu/${item.id}.jpg" alt="" width="64" height="64" loading="lazy">
          <div>
            <h3>${esc(item.name)}</h3>
            <div class="unit">${money(item.price)} each</div>
            <div class="qty" role="group" aria-label="Quantity for ${esc(item.name)}">
              <button type="button" data-qty="-1" data-id="${item.id}" aria-label="Decrease ${esc(item.name)} quantity">−</button>
              <output aria-live="polite">${qty}</output>
              <button type="button" data-qty="1" data-id="${item.id}" aria-label="Increase ${esc(item.name)} quantity" ${qty >= 20 ? "disabled" : ""}>+</button>
            </div>
          </div>
          <div>
            <div class="line-total">${money(total)}</div>
            <button type="button" class="remove-btn" data-remove="${item.id}">Remove<span class="visually-hidden"> ${esc(item.name)}</span></button>
          </div>
        </li>`).join("");
      empty.hidden = count > 0;
      foot.hidden = count === 0;
      $("#t-subtotal").textContent = money(t.subtotal);
      $("#t-fee").textContent = money(t.fee);
      $("#t-fee-row").hidden = t.fee === 0; $("#t-fee-label").hidden = t.fee === 0;
      $("#t-tax").textContent = money(t.tax);
      $("#t-total").textContent = money(t.total);
      $$('input[name="order-mode"]').forEach((r) => (r.checked = r.value === Cart.mode));
    }
    // order bar (menu page)
    const bar = $("#order-bar");
    if (bar) {
      bar.classList.toggle("show", count > 0);
      bar.setAttribute("aria-hidden", String(count === 0));
      $$("a, button", bar).forEach((el) => (el.tabIndex = count > 0 ? 0 : -1));
      $("#order-bar-text").innerHTML = `<strong>${count}</strong> ${count === 1 ? "item" : "items"} · ${money(t.subtotal)}`;
    }
    // "in order" indicators on menu cards
    $$("[data-in-cart]").forEach((el) => {
      const q = Cart.items[el.dataset.inCart] || 0;
      el.textContent = q ? `✓ ${q} in order` : "";
    });
  }

  function initCart() {
    Cart.load();
    const drawer = $("#cart-drawer");
    if (!drawer) return;
    const showView = (name) => {
      $$(".drawer-view", drawer).forEach((v) => (v.hidden = v.dataset.view !== name));
      $("#drawer-title").textContent = { cart: "Your Order", checkout: "Checkout", done: "Order Confirmed" }[name];
    };
    const open = () => {
      showView("cart");
      if (typeof drawer.showModal === "function") drawer.showModal(); else drawer.setAttribute("open", "");
    };
    const close = () => { if (drawer.open) drawer.close(); };

    document.addEventListener("click", (e) => {
      const add = e.target.closest("[data-add]");
      if (add) { Cart.add(add.dataset.add); return; }
      if (e.target.closest("[data-open-cart]")) { e.preventDefault(); open(); return; }
      const q = e.target.closest("[data-qty]");
      if (q) { const id = q.dataset.id; Cart.setQty(id, (Cart.items[id] || 0) + Number(q.dataset.qty)); return; }
      const r = e.target.closest("[data-remove]");
      if (r) { const name = MENU_BY_ID[r.dataset.remove].name; Cart.setQty(r.dataset.remove, 0); toast(`Removed <b>${esc(name)}</b>`); }
    });
    $$("[data-close-drawer]", drawer).forEach((b) => b.addEventListener("click", close));
    drawer.addEventListener("click", (e) => { if (e.target === drawer) close(); }); // backdrop click
    $$('input[name="order-mode"]', drawer).forEach((r) => r.addEventListener("change", () => { Cart.mode = r.value; Cart.save(); renderCart(); }));
    $("#to-checkout").addEventListener("click", () => {
      if (!Cart.count()) return;
      populatePickupTimes();
      $("#checkout-address-wrap").hidden = Cart.mode !== "delivery";
      $("#co-address").required = Cart.mode === "delivery";
      $("#co-mode-label").textContent = Cart.mode === "delivery" ? "Delivery time" : "Pickup time";
      showView("checkout");
      $("#co-name").focus();
    });
    $("#back-to-cart").addEventListener("click", () => showView("cart"));
    $("#clear-cart").addEventListener("click", () => { Cart.clear(); toast("Order cleared"); });

    const form = $("#checkout-form");
    const payState = { tip: 0.18, method: "card" };
    const coTotals = () => {
      const t = Cart.totals();
      const tip = Math.round(t.subtotal * payState.tip);
      return { ...t, tip, grand: t.total + tip };
    };
    function renderCheckout() {
      const t = coTotals();
      $("#co-subtotal").textContent = money(t.subtotal);
      $("#co-fee").textContent = money(t.fee);
      $("#co-fee").hidden = $("#co-fee-label").hidden = t.fee === 0;
      $("#co-tax").textContent = money(t.tax);
      $("#co-tip").textContent = money(t.tip);
      $("#co-total").textContent = money(t.grand);
      const label = { card: `Pay ${money(t.grand)}`, apple: `Pay with Apple Pay · ${money(t.grand)}`, google: `Pay with Google Pay · ${money(t.grand)}`, pickup: `Place order · ${money(t.grand)}` }[payState.method];
      $("#pay-label").textContent = label;
      $("#pay-btn").classList.toggle("wallet", payState.method === "apple" || payState.method === "google");
      $$(".pay-panel", form).forEach((p) => (p.hidden = p.dataset.pay !== payState.method));
    }
    $$('input[name="tip"]', form).forEach((r) => r.addEventListener("change", () => { payState.tip = Number(r.value); renderCheckout(); }));
    $$('input[name="paymethod"]', form).forEach((r) => r.addEventListener("change", () => { payState.method = r.value; renderCheckout(); }));
    $("#to-checkout").addEventListener("click", renderCheckout);

    const wait = (ms) => new Promise((r) => setTimeout(r, ms));
    async function runPayment() {
      const proc = $("#processing");
      const t = coTotals();
      const steps = $$(".proc-steps li", proc);
      $("#proc-auth").textContent = payState.method === "pickup" ? "Reserving your pickup slot" : `Authorizing ${money(t.grand)} · Visa •••• 4242 (test)`;
      steps.forEach((li) => li.className = "");
      proc.hidden = false;
      for (let i = 0; i < steps.length; i++) { steps[i].className = "active"; await wait(750); steps[i].className = "done"; }
      await wait(250);
      proc.hidden = true;
      return t;
    }
    function walletSheet() {
      return new Promise((resolve) => {
        const sheet = $("#wallet-sheet");
        $("#ws-title").textContent = payState.method === "apple" ? "Apple Pay" : "Google Pay";
        $("#ws-total").textContent = money(coTotals().grand);
        $("#ws-contact").textContent = $("#co-email").value;
        sheet.hidden = false; $("#ws-confirm").focus();
        const done = (ok) => { sheet.hidden = true; $("#ws-confirm").onclick = $("#ws-cancel").onclick = null; resolve(ok); };
        $("#ws-confirm").onclick = () => done(true);
        $("#ws-cancel").onclick = () => { done(false); $("#pay-btn").focus(); };
      });
    }
    let trackerTimers = [];
    function startTracker() {
      trackerTimers.forEach(clearTimeout);
      const items = $$("#tracker li");
      items.forEach((li, i) => li.className = i === 0 ? "done" : i === 1 ? "active" : "");
      $("#tracker-ready").textContent = Cart.mode === "delivery" ? "Out for delivery" : "Ready for pickup";
      $("#tracker-eta").textContent = "Live status demo — updates in a few seconds.";
      trackerTimers.push(setTimeout(() => { items[1].className = "done"; items[2].className = "active"; $("#tracker-eta").textContent = "Almost there…"; }, 4000));
      trackerTimers.push(setTimeout(() => { items[2].className = "done"; $("#tracker-eta").textContent = Cart.mode === "delivery" ? "Your driver is on the way (demo)." : "Your order is ready at the host stand (demo)."; }, 8000));
    }

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (!validateForm(form)) return;
      if ((payState.method === "apple" || payState.method === "google") && !(await walletSheet())) return;
      const lines = Cart.lines();
      const data = Object.fromEntries(new FormData(form));
      const mode = Cart.mode;
      const btn = $("#pay-btn"); btn.disabled = true;
      await submitToBackend("order", { type: "order", mode, method: payState.method, items: lines.map((l) => ({ id: l.item.id, qty: l.qty })), customer: data });
      const t = await runPayment();
      btn.disabled = false;
      const ref = "OND-" + Math.floor(100000 + Math.random() * 900000);
      const payLine = { card: "Visa •••• 4242 (test)", apple: "Apple Pay (test)", google: "Google Pay (test)", pickup: "Pay at pickup" }[payState.method];
      $("#done-sub").textContent = `Thanks, ${data.name.split(" ")[0]}! ${mode === "delivery" ? "Delivery" : "Pickup"}: ${$("#co-time").selectedOptions[0].textContent}.`;
      $("#order-summary").innerHTML =
        `<dt>Order #</dt><dd><span class="ref-code">${ref}</span></dd>` +
        lines.map((l) => `<dt>${l.qty} ×</dt><dd>${esc(l.item.name)} — ${money(l.total)}</dd>`).join("") +
        `<dt>Subtotal</dt><dd>${money(t.subtotal)}</dd>` + (t.fee ? `<dt>Delivery</dt><dd>${money(t.fee)}</dd>` : "") +
        `<dt>Tax</dt><dd>${money(t.tax)}</dd><dt>Tip</dt><dd>${money(t.tip)}</dd><dt>Total</dt><dd>${money(t.grand)}</dd>` +
        `<dt>Payment</dt><dd>${payLine}</dd><dt>Receipt</dt><dd>${esc(data.email)}</dd>`;
      Cart.clear();
      form.reset();
      payState.tip = 0.18; payState.method = "card";
      showView("done");
      startTracker();
      $("#done-heading").focus();
    });
    $("#done-menu").addEventListener("click", (e) => { if (location.pathname.endsWith("menu.html")) { e.preventDefault(); close(); } });
    $("#done-close").addEventListener("click", close);
    renderCart();
  }

  /** Next available pickup/delivery slots: 15-minute steps, ≥30 min from now, within opening hours. */
  function populatePickupTimes() {
    const sel = $("#co-time");
    const now = restaurantNow();
    const opts = [];
    for (let dayOffset = 0; dayOffset < 8 && opts.length < 16; dayOffset++) {
      const iso = addDays(now.iso, dayOffset);
      const h = HOURS[dowOf(iso)];
      if (!h) continue;
      let start = h.open + 15;
      if (dayOffset === 0) start = Math.max(start, Math.ceil((now.minutes + 30) / 15) * 15);
      for (let m = start; m <= h.close - 30 && opts.length < 16; m += 15) {
        const dayLabel = dayOffset === 0 ? "Today" : dayOffset === 1 ? "Tomorrow" : DAY_NAMES[dowOf(iso)];
        opts.push(`<option value="${iso}T${pad(Math.floor(m / 60))}:${pad(m % 60)}">${dayLabel}, ${fmtTime(m)}</option>`);
      }
    }
    sel.innerHTML = `<option value="">Select a time</option>` + opts.join("");
  }

  /* -------------------------------------------------------------- RENDER DISHES */
  function dishCard(item, headingLevel = 3) {
    const tags = item.tags.map((t) => `<span class="tag ${t}">${TAG_LABEL[t]}</span>`).join("");
    const action = item.orderable === false
      ? `<a class="btn btn-outline btn-sm" href="reservations.html">Reserve to enjoy</a>`
      : `<button type="button" class="btn btn-primary btn-sm" data-add="${item.id}" aria-label="Add ${esc(item.name)} to order, ${money(item.price)}">
           <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>Add</button>`;
    return `
      <article class="card dish-card reveal" data-cat="${item.cat}">
        <div class="dish-media">
          <img src="${dishImg(item.id, 1000)}" srcset="${dishSrcset(item.id)}" sizes="(max-width: 620px) 100vw, (max-width: 920px) 50vw, 400px" data-fallback="images/menu/${item.id}.jpg" alt="${esc(item.name)}" width="1200" height="900" loading="lazy" decoding="async">
          ${item.badge ? `<span class="badge">${esc(item.badge)}</span>` : ""}
        </div>
        <div class="card-body">
          <div class="dish-top"><h${headingLevel}>${esc(item.name)}</h${headingLevel}><span class="price">${money(item.price)}</span></div>
          ${tags ? `<div class="dish-tags">${tags}</div>` : ""}
          <p>${esc(item.desc)}</p>
          <div class="dish-foot"><span class="in-cart" data-in-cart="${item.id}"></span>${action}</div>
        </div>
      </article>`;
  }

  function initFeatured() {
    const el = $("#featured-dishes");
    if (!el) return;
    el.innerHTML = MENU.filter((m) => m.featured).map((m) => dishCard(m)).join("");
  }

  function initMenu() {
    const root = $("#menu-root");
    if (!root) return;
    const state = { cat: "all", q: "", v: false, gf: false };
    const filters = $("#menu-filters");
    const status = $("#menu-status");

    // Allow deep links like menu.html#desserts
    const hash = location.hash.replace("#", "");
    if (CATEGORIES.some((c) => c.id === hash)) state.cat = hash;

    function matches(m) {
      if (state.v && !m.tags.includes("v")) return false;
      if (state.gf && !m.tags.includes("gf")) return false;
      if (state.q) {
        const hay = (m.name + " " + m.desc).toLowerCase();
        if (!hay.includes(state.q)) return false;
      }
      return true;
    }

    function render() {
      const visible = MENU.filter(matches);
      // filter buttons with counts
      const counts = { all: visible.length };
      CATEGORIES.forEach((c) => (counts[c.id] = visible.filter((m) => m.cat === c.id).length));
      filters.innerHTML = [{ id: "all", label: "All" }, ...CATEGORIES].map((c) =>
        `<button type="button" class="filter-btn" data-filter="${c.id}" aria-pressed="${state.cat === c.id}">${c.label}<span class="count">${counts[c.id]}</span></button>`).join("");

      const cats = state.cat === "all" ? CATEGORIES : CATEGORIES.filter((c) => c.id === state.cat);
      let html = "", shown = 0;
      cats.forEach((c) => {
        const items = visible.filter((m) => m.cat === c.id);
        if (!items.length) return;
        shown += items.length;
        html += `<section class="menu-section" id="sec-${c.id}" aria-labelledby="h-${c.id}">
          <h2 id="h-${c.id}">${c.label} <small>${c.blurb}</small></h2>
          <div class="menu-grid">${items.map((m) => dishCard(m)).join("")}</div></section>`;
      });
      root.innerHTML = html || `<div class="menu-empty"><h2>No dishes match</h2><p>Try a different search or clear the dietary filters.</p><button type="button" class="btn btn-outline" id="reset-filters">Reset filters</button></div>`;
      status.textContent = `Showing ${shown} ${shown === 1 ? "dish" : "dishes"}${state.cat !== "all" ? " in " + CATEGORIES.find((c) => c.id === state.cat).label : ""}.`;
      $$(".reveal", root).forEach((el) => el.classList.add("in"));
      renderCart();
    }

    filters.addEventListener("click", (e) => {
      const b = e.target.closest("[data-filter]");
      if (!b) return;
      state.cat = b.dataset.filter;
      history.replaceState(null, "", state.cat === "all" ? location.pathname : "#" + state.cat);
      render();
      const pressed = $(`[data-filter="${state.cat}"]`, filters);
      pressed && pressed.focus();
    });
    let t;
    $("#menu-search").addEventListener("input", (e) => {
      clearTimeout(t);
      t = setTimeout(() => { state.q = e.target.value.trim().toLowerCase(); render(); }, 120);
    });
    window.addEventListener("hashchange", () => {
      const h = location.hash.replace("#", "");
      if (CATEGORIES.some((c) => c.id === h) && state.cat !== h) { state.cat = h; render(); }
    });
    $("#diet-v").addEventListener("change", (e) => { state.v = e.target.checked; render(); });
    $("#diet-gf").addEventListener("change", (e) => { state.gf = e.target.checked; render(); });
    root.addEventListener("click", (e) => {
      if (e.target.id === "reset-filters") {
        Object.assign(state, { cat: "all", q: "", v: false, gf: false });
        $("#menu-search").value = ""; $("#diet-v").checked = false; $("#diet-gf").checked = false;
        render();
      }
    });
    render();
  }

  /* ---------------------------------------------------------- VALIDATION */
  const MESSAGES = {
    valueMissing: (f) => f.dataset.msgRequired || `${labelOf(f)} is required.`,
    typeMismatch: (f) => (f.type === "email" ? "Enter a valid email address, like name@example.com." : `Enter a valid ${labelOf(f).toLowerCase()}.`),
    patternMismatch: (f) => f.dataset.msgPattern || `${labelOf(f)} is not in the expected format.`,
    rangeUnderflow: (f) => f.dataset.msgMin || `${labelOf(f)} must be at least ${f.min}.`,
    rangeOverflow: (f) => f.dataset.msgMax || `${labelOf(f)} must be no more than ${f.max}.`,
    tooShort: (f) => `${labelOf(f)} must be at least ${f.minLength} characters.`,
    badInput: (f) => `Enter a valid ${labelOf(f).toLowerCase()}.`
  };
  function labelOf(f) {
    if (f.dataset.label) return f.dataset.label;
    const l = f.id && document.querySelector(`label[for="${f.id}"]`);
    if (l) return l.textContent.replace("*", "").trim();
    const fs = f.closest("fieldset");
    return fs ? $("legend", fs).textContent.replace("*", "").trim() : "This field";
  }
  function errorEl(f) {
    const key = f.type === "radio" ? f.name : f.id;
    return document.getElementById(key + "-error");
  }
  function checkField(f) {
    f.setCustomValidity("");
    if (typeof f._custom === "function") { const msg = f._custom(f); if (msg) f.setCustomValidity(msg); }
    const v = f.validity;
    let msg = "";
    if (!v.valid) {
      if (v.customError) msg = f.validationMessage; // business rules (closed days, notice periods) take priority
      else for (const k of Object.keys(MESSAGES)) if (v[k]) { msg = MESSAGES[k](f); break; }
      if (!msg) msg = f.validationMessage;
    }
    const group = f.type === "radio" ? $$(`input[name="${f.name}"]`, f.form) : [f];
    group.forEach((g) => g.setAttribute("aria-invalid", String(!!msg)));
    const err = errorEl(f);
    if (err) err.textContent = msg;
    return msg;
  }
  /** Validates a form, shows inline errors + summary, focuses first invalid field. */
  function validateForm(form) {
    const fields = $$("input, select, textarea", form).filter((f) => !f.disabled && f.type !== "hidden" && !f.closest("[hidden]") && f.willValidate);
    const seen = new Set(), errors = [];
    fields.forEach((f) => {
      if (f.type === "radio") { if (seen.has(f.name)) return; seen.add(f.name); }
      const msg = checkField(f);
      if (msg) errors.push({ f, msg });
    });
    const summary = $(".error-summary", form);
    if (summary) {
      if (errors.length) {
        summary.hidden = false;
        summary.innerHTML = `<strong>Please fix ${errors.length} ${errors.length === 1 ? "issue" : "issues"} before continuing:</strong><ul>${errors.map((e) => `<li><a href="#${e.f.id}">${esc(e.msg)}</a></li>`).join("")}</ul>`;
      } else { summary.hidden = true; summary.innerHTML = ""; }
    }
    if (errors.length) { errors[0].f.focus(); return false; }
    return true;
  }
  function liveValidate(form) {
    // Pressing a submit button blurs the active field. Re-validating on that blur would add/remove
    // error text, shift the layout and make the button "move" mid-click. The submit handler validates
    // everything anyway, so skip blur validation while a submit press is in progress.
    let pressingSubmit = false;
    form.addEventListener("pointerdown", (e) => { if (e.target.closest('[type="submit"]')) pressingSubmit = true; });
    document.addEventListener("pointerup", () => setTimeout(() => (pressingSubmit = false), 0));
    form.addEventListener("focusout", (e) => {
      const f = e.target;
      if (pressingSubmit || (e.relatedTarget && e.relatedTarget.type === "submit")) return;
      if (f.matches("input, select, textarea") && (f.value || f.getAttribute("aria-invalid") === "true")) checkField(f);
    });
    // Clear an error as soon as the user fixes it while typing.
    form.addEventListener("input", (e) => {
      const f = e.target;
      if (f.getAttribute("aria-invalid") === "true") checkField(f);
    });
    form.addEventListener("change", (e) => {
      const f = e.target;
      if (f.getAttribute("aria-invalid") === "true") checkField(f);
    });
    form.addEventListener("click", (e) => {
      const a = e.target.closest(".error-summary a");
      if (a) { e.preventDefault(); const t = document.getElementById(a.getAttribute("href").slice(1)); t && t.focus(); }
    });
  }
  const phoneRule = (f) => (f.value && f.value.replace(/\D/g, "").length < 10 ? "Enter a phone number with at least 10 digits." : "");

  /** DEMO: resolves immediately. Replace with a real POST when CONFIG.demoMode is false. */
  function submitToBackend(kind, payload) {
    if (CONFIG.demoMode || !CONFIG.endpoints[kind]) {
      console.info(`[Ondessa demo] ${kind} captured locally only — not transmitted.`, payload);
      return new Promise((res) => setTimeout(res, 650));
    }
    return fetch(CONFIG.endpoints[kind], {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload)
    }).then((r) => { if (!r.ok) throw new Error("Request failed: " + r.status); return r.json(); });
  }

  function withBusy(btn, promise) {
    const label = btn.innerHTML;
    btn.disabled = true; btn.innerHTML = "Processing…";
    return promise.finally(() => { btn.disabled = false; btn.innerHTML = label; });
  }

  /* --------------------------------------------------------- RESERVATIONS */
  function initReservations() {
    const form = $("#reservation-form");
    if (!form) return;
    const date = $("#res-date"), time = $("#res-time"), party = $("#res-party");
    const now = restaurantNow();
    date.min = now.iso;
    date.max = addDays(now.iso, CONFIG.reservationWindowDays);

    // default to next open day
    let def = now.iso;
    for (let i = 0; i < 8; i++) {
      const iso = addDays(now.iso, i), h = HOURS[dowOf(iso)];
      if (h && (i > 0 || now.minutes < h.close - 90)) { def = iso; break; }
    }
    date.value = def;

    date._custom = (f) => {
      if (!f.value) return "";
      if (f.value < f.min) return "Please choose today or a future date.";
      if (f.value > f.max) return `Reservations open ${CONFIG.reservationWindowDays} days in advance. Choose an earlier date.`;
      if (!HOURS[dowOf(f.value)]) return "We're closed on Mondays. Please choose another day.";
      return "";
    };
    $("#res-phone")._custom = phoneRule;

    function fillTimes() {
      const keep = time.value;
      const iso = date.value;
      const h = iso && HOURS[dowOf(iso)];
      if (!h) { time.innerHTML = `<option value="">${iso ? "Closed this day" : "Choose a date first"}</option>`; time.disabled = !iso || !h; return; }
      time.disabled = false;
      const nowR = restaurantNow();
      let opts = "";
      for (let m = h.open; m <= h.close - 60; m += 30) {
        const past = iso === nowR.iso && m <= nowR.minutes + 30;
        if (!past) opts += `<option value="${pad(Math.floor(m / 60))}:${pad(m % 60)}">${fmtTime(m)}</option>`;
      }
      time.innerHTML = `<option value="">Select a time</option>` + (opts || "");
      if (!opts) time.innerHTML = `<option value="">No remaining times today</option>`;
      if ([...time.options].some((o) => o.value === keep)) time.value = keep;
    }
    date.addEventListener("change", () => { fillTimes(); checkField(date); });
    fillTimes();

    party.addEventListener("change", () => {
      $("#large-party-note").hidden = party.value !== "large";
    });
    party._custom = (f) => (f.value === "large" ? "For parties of 11 or more, please use our private dining & catering inquiry." : "");

    liveValidate(form);
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!validateForm(form)) return;
      const data = Object.fromEntries(new FormData(form));
      withBusy($("button[type=submit]", form), submitToBackend("reservation", { type: "reservation", ...data })).then(() => {
        const ref = refCode("RSV");
        const timeLabel = time.selectedOptions[0].textContent;
        $("#res-summary").innerHTML =
          `<dt>Reference</dt><dd><span class="ref-code">${ref}</span></dd>` +
          `<dt>Date</dt><dd>${esc(fmtDate(data.date))}</dd><dt>Time</dt><dd>${esc(timeLabel)}</dd>` +
          `<dt>Party</dt><dd>${esc(data.party)} ${data.party === "1" ? "guest" : "guests"}</dd>` +
          `<dt>Seating</dt><dd>${esc(data.seating)}</dd>` +
          `<dt>Name</dt><dd>${esc(data.firstName)} ${esc(data.lastName)}</dd><dt>Email</dt><dd>${esc(data.email)}</dd>` +
          (data.occasion ? `<dt>Occasion</dt><dd>${esc(data.occasion)}</dd>` : "");
        const ics = buildICS({ date: data.date, time: data.time, minutes: 120, title: `Ondessa (DEMO) — table for ${data.party}`, ref });
        const dl = $("#res-ics");
        dl.href = URL.createObjectURL(new Blob([ics], { type: "text/calendar" }));
        dl.download = "ondessa-demo-reservation.ics";
        form.hidden = true;
        $("#res-confirmation").hidden = false;
        $("#res-confirm-heading").focus();
        window.scrollTo({ top: $("#reserve-card").offsetTop - 100, behavior: "smooth" });
      });
    });
    $("#res-again").addEventListener("click", () => {
      form.reset(); date.value = def; fillTimes();
      $$("[aria-invalid]", form).forEach((f) => f.removeAttribute("aria-invalid"));
      $$(".field-error", form).forEach((e) => (e.textContent = ""));
      $("#large-party-note").hidden = true;
      form.hidden = false; $("#res-confirmation").hidden = true; date.focus();
    });
  }

  function buildICS({ date, time, minutes, title, ref }) {
    const [y, mo, d] = date.split("-"), [h, mi] = time.split(":");
    const start = `${y}${mo}${d}T${h}${mi}00`;
    const endMins = +h * 60 + +mi + minutes;
    const end = `${y}${mo}${d}T${pad(Math.floor(endMins / 60))}${pad(endMins % 60)}00`;
    const stamp = new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
    return ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Virellion Apex//Ondessa Demo//EN", "BEGIN:VEVENT",
      `UID:${ref}@ondessa-demo`, `DTSTAMP:${stamp}`, `DTSTART;TZID=${CONFIG.timeZone}:${start}`, `DTEND;TZID=${CONFIG.timeZone}:${end}`,
      `SUMMARY:${title}`, "LOCATION:88 Seawall Promenade\\, Galveston\\, TX (demo)",
      "DESCRIPTION:Demonstration reservation only — no booking was made with any restaurant.", "END:VEVENT", "END:VCALENDAR"].join("\r\n");
  }

  /* ------------------------------------------------------------- CATERING */
  const PACKAGES = {
    harbor: { name: "Harbor Gathering", pp: 3800 },
    hearth: { name: "Hearth Feast", pp: 5800 },
    signature: { name: "Ondessa Signature", pp: 8600 }
  };
  function initCatering() {
    const form = $("#catering-form");
    if (!form) return;
    const date = $("#cat-date"), guests = $("#cat-guests"), style = $("#cat-style");
    const now = restaurantNow();
    date.min = addDays(now.iso, 7);
    date.max = addDays(now.iso, 365);
    date._custom = (f) => (f.value && f.value < f.min ? "Catering requires at least 7 days' notice. Please choose a later date." : (f.value && f.value > f.max ? "Please choose a date within the next 12 months." : ""));
    $("#cat-phone")._custom = phoneRule;

    function updateEstimate() {
      const pkgId = (form.querySelector('input[name="package"]:checked') || {}).value;
      const pkg = PACKAGES[pkgId];
      const n = parseInt(guests.value, 10);
      const valid = pkg && n >= 15 && n <= 300;
      const fullService = ["Buffet with staff", "Family-style", "Plated service"].includes(style.value);
      const food = valid ? pkg.pp * n : 0;
      const service = valid && fullService ? Math.round(food * CONFIG.cateringServiceRate) : 0;
      $("#est-package").textContent = pkg ? `${pkg.name} · ${money(pkg.pp)}/guest` : "Choose a package";
      $("#est-guests").textContent = Number.isFinite(n) && n > 0 ? String(n) : "—";
      $("#est-food").textContent = valid ? moneyWhole(food) : "—";
      $("#est-service").textContent = valid ? (fullService ? moneyWhole(service) : "Not applicable") : "—";
      $("#est-total").textContent = valid ? moneyWhole(food + service) : "—";
    }
    form.addEventListener("input", updateEstimate);
    form.addEventListener("change", updateEstimate);

    $$("[data-select-package]").forEach((b) => b.addEventListener("click", () => {
      const r = form.querySelector(`input[name="package"][value="${b.dataset.selectPackage}"]`);
      if (r) { r.checked = true; checkField(r); updateEstimate(); }
      $("#inquiry").scrollIntoView({ behavior: "smooth" });
      setTimeout(() => r && r.focus({ preventScroll: true }), 500);
    }));

    liveValidate(form);
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!validateForm(form)) return;
      const fd = new FormData(form);
      const data = Object.fromEntries(fd);
      data.dietary = fd.getAll("dietary").join(", ");
      withBusy($("button[type=submit]", form), submitToBackend("catering", { type: "catering", ...data })).then(() => {
        const ref = refCode("CAT");
        $("#cat-summary").innerHTML =
          `<dt>Reference</dt><dd><span class="ref-code">${ref}</span></dd>` +
          `<dt>Package</dt><dd>${esc(PACKAGES[data.package].name)}</dd>` +
          `<dt>Event</dt><dd>${esc(data.eventType)}</dd><dt>Date</dt><dd>${esc(fmtDate(data.eventDate))}</dd>` +
          `<dt>Guests</dt><dd>${esc(data.guests)}</dd><dt>Service</dt><dd>${esc(data.serviceStyle)}</dd>` +
          `<dt>Estimate</dt><dd>${esc($("#est-total").textContent)}</dd>` +
          `<dt>Contact</dt><dd>${esc(data.name)} · ${esc(data.email)}</dd>`;
        form.hidden = true;
        $("#cat-confirmation").hidden = false;
        $("#cat-confirm-heading").focus();
      });
    });
    $("#cat-again").addEventListener("click", () => {
      form.reset(); updateEstimate();
      $$("[aria-invalid]", form).forEach((f) => f.removeAttribute("aria-invalid"));
      $$(".field-error", form).forEach((e) => (e.textContent = ""));
      form.hidden = false; $("#cat-confirmation").hidden = true; $("#cat-event").focus();
    });
    updateEstimate();
  }

  /* -------------------------------------------------------------- CONTACT */
  function initContact() {
    const form = $("#contact-form");
    if (!form) return;
    liveValidate(form);
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!validateForm(form)) return;
      const data = Object.fromEntries(new FormData(form));
      withBusy($("button[type=submit]", form), submitToBackend("contact", { type: "contact", ...data })).then(() => {
        $("#contact-ref").textContent = refCode("MSG");
        form.hidden = true;
        $("#contact-confirmation").hidden = false;
        $("#contact-confirm-heading").focus();
      });
    });
    $("#contact-again").addEventListener("click", () => {
      form.reset(); form.hidden = false; $("#contact-confirmation").hidden = true; $("#ct-name").focus();
    });
  }

  /* ----------------------------------------------------------------- BOOT */
  function boot() {
    initRibbon();
    initNav();
    initStatus();
    initFeatured();
    initMenu();
    initCart();
    initReservations();
    initCatering();
    initContact();
    initReveal();
    const co = $("#checkout-form");
    if (co) { liveValidate(co); $("#co-phone")._custom = phoneRule; }
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot); else boot();

  // Expose a tiny API for QA / console testing.
  window.OndessaDemo = { Cart, MENU, CONFIG, money };
})();

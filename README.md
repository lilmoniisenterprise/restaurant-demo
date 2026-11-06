# Ondessa — Coastal Hearth Kitchen (Restaurant Demo)

**Portfolio Project 01 · Virellion Apex**

A premium, fully responsive restaurant and hospitality website built with plain HTML5, CSS3 and vanilla JavaScript. Ondessa is a **fictional** wood-fired coastal restaurant. It was created to show prospective clients what Virellion Apex can build.

> This website is a demonstration project developed by Virellion Apex. Restaurant name, menu, pricing, and business information are fictional and provided for demonstration purposes.

All reservations, catering inquiries, contact messages and orders run in **demonstration mode**. They are validated and confirmed on screen, but nothing is sent anywhere, no booking is made and no payment is taken.

---

## Features

| Area | What it demonstrates |
|---|---|
| **Homepage** | Full-bleed hero, live "open now / closed" status, brand story, featured dishes with add-to-order, weekly specials, sample testimonials (clearly labelled), catering/private-dining entry points, reservation call to action |
| **Online menu** (`menu.html`) | 22 dishes across Specials, Appetizers, Entrées, Desserts and Beverages; images, descriptions, prices, dietary tags; category filters with counts; search; Vegetarian and Gluten-free filters; deep links (`menu.html#desserts`); dine-in-only items |
| **Mobile ordering demo** | Cart saved across pages (localStorage), quantity +/−, remove, pickup or delivery, subtotal, demo delivery fee, 8.25% tax estimate, total, sticky mobile "View order" bar, checkout with validation and pickup times based on opening hours, demo confirmation. **No card fields are collected.** |
| **Reservations** | Date (closed Mondays, 60-day window), time slots generated from that day's hours (past times removed for today), party size, seating choice, contact details, policy checkbox, inline and summary errors, demo confirmation, downloadable `.ics` calendar file |
| **Catering** | Three packages, event types, a four-step process, inquiry form (guest count 15–300, 7-day minimum notice, service style, dietary needs) and a **live cost estimate** |
| **Location & hours** | Address, phone, email, hours table with today highlighted, live OpenStreetMap map with a Get directions link, contact form, FAQ |
| **Quality** | Semantic landmarks, skip link, keyboard-friendly navigation, visible focus states, ARIA on dialogs, filters and live regions, reduced-motion support, SEO and Open Graph/Twitter metadata, JSON-LD, sitemap, security headers with a strict CSP |
| **Lead generation** | Dismissible demo ribbon plus "Request a Similar Website" and "Schedule a Consultation" calls to action linking to https://virellionapex.com |

---

## File structure

```
restaurant-demo/
├── index.html            Homepage
├── about.html            Brand story
├── menu.html             Interactive menu + ordering
├── reservations.html     Reservation form
├── catering.html         Packages + inquiry form + estimate
├── contact.html          Location, hours, map placeholder, contact form, FAQ
├── 404.html              Custom not-found page (Cloudflare Pages serves it automatically)
├── css/style.css         All styles (design tokens at the top)
├── js/script.js          All behaviour: menu data, cart, forms, hours, config
├── images/
│   ├── logo.png / logo.svg
│   ├── hero.jpg
│   ├── about-*.jpg, catering-*.jpg
│   └── menu/             One image per dish, named by dish id (e.g. saffron-paella.jpg)
├── assets/               favicon.svg, apple-touch-icon.png, icon-512.png, og-image.jpg
├── _headers              Cloudflare Pages security and cache headers
├── robots.txt, sitemap.xml, site.webmanifest
├── .gitignore
└── README.md
```

## External dependencies

- **Google Fonts** (free): Cormorant Garamond (headings) and Inter (body). If the fonts can't load, the site falls back to system serif and sans-serif fonts.
- Nothing else: no frameworks, no build step, no API keys, no paid services.

## Images

Food and venue photography loads from **Pexels** (free for commercial use, no attribution required; credited in the footer). Photo IDs are set in `PHOTOS` in `js/script.js` and `STATIC_PHOTOS` in the page HTML (`images.pexels.com/photos/<id>/...`). Each image also has a local fallback in `images/`, which the site swaps in automatically if a photo ever fails to load. For a real client, replace them with the restaurant's own photography.

## Payment demo

Checkout shows a complete payment experience: tip selection, Card / Apple Pay / Google Pay / Pay at pickup, a processing animation, a receipt and a live order tracker. The card panel is pre-filled with a **read-only test card (4242 4242 4242 4242)**, so the demo can never collect real card data, and nothing is charged. To take real payments, replace the panel with Stripe Checkout / Payment Element or Square Web Payments and confirm orders through a server-side function (see "Connecting a real backend").

---

## Run locally

Opening `index.html` directly works, but a local server matches production behaviour more closely:

```bash
cd restaurant-demo
python3 -m http.server 8080
# then open http://localhost:8080
```

## Deploy: GitHub + Cloudflare Pages (free)

1. **Create the repository.** On GitHub, create a new repository named `restaurant-demo` (public or private).
2. **Push the files.** From inside the `restaurant-demo` folder:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Ondessa restaurant demo"
   git branch -M main
   git remote add origin https://github.com/<your-account>/restaurant-demo.git
   git push -u origin main
   ```
3. **Connect Cloudflare Pages.** In the Cloudflare dashboard, go to **Workers & Pages → Create → Pages → Connect to Git** and select the repository.
4. **Build settings:**
   - Framework preset: **None**
   - Build command: *(leave empty)*
   - Build output directory: **`/`**
5. Click **Save and Deploy**. You'll get a URL like `https://restaurant-demo.pages.dev`. Every later push to `main` redeploys automatically.
6. **Custom subdomain (optional).** In the Pages project, open **Custom domains → Set up a domain** and enter `restaurant.virellionapex.com`. If the domain's DNS is on Cloudflare, the record is created for you; otherwise add the CNAME it shows. Wait for the SSL certificate to become active, then test the live URL before listing it in the portfolio.
7. **Verify after deploy:** open every page, add items to the cart, run through checkout, the reservation and the catering inquiry on a phone, and check the response headers (DevTools → Network → `index.html`) to confirm `_headers` is applied.

### Update the domain placeholders

The canonical and Open Graph URLs use `https://restaurant.virellionapex.com/` as a placeholder. If you deploy elsewhere, find and replace it in:

- all `*.html` files (canonical, `og:url`, `og:image`, `twitter:image`, JSON-LD)
- `sitemap.xml` and `robots.txt`

> **SEO note:** The JSON-LD on `index.html` describes a fictional business. That's fine for a portfolio demo. If you'd rather keep the demo out of search results, add `<meta name="robots" content="noindex, follow">` to each page. For a real client, replace every field with verified details.

---

## Replacing the demo content (for a real restaurant)

| What | Where |
|---|---|
| Name, logo, colours, fonts | `images/logo.*`, `assets/favicon.svg`; colour and font tokens in `:root` at the top of `css/style.css` |
| Menu items, prices, tags | `MENU` array in `js/script.js` (prices are in **cents**; `orderable: false` makes a dish dine-in only) |
| Categories | `CATEGORIES` array in `js/script.js` |
| Opening hours | `HOURS` object in `js/script.js` **and** the hours tables in the HTML (footer, reservations, contact) and the JSON-LD |
| Time zone, tax, delivery fee, catering service rate | `CONFIG` in `js/script.js` |
| Catering packages and prices | `PACKAGES` in `js/script.js` plus the package cards and radio options in `catering.html` |
| Address, phone, email | Footer, contact page, header mobile menu, JSON-LD (search for `Seawall Promenade`, `555-0148` and `ondessa.example`) |
| Testimonials | `index.html`: replace with **verified** reviews only, and remove the "sample" labels once they're real |
| Demo ribbon and notices | Remove the `.demo-ribbon` block and the `.demo-notice` boxes once real backends are live, and set `CONFIG.demoMode = false` |
| Map | Replace `.map-placeholder` in `contact.html` with a Google Maps or OpenStreetMap `<iframe>`, then add that origin to `frame-src` in `_headers` (for example `frame-src https://www.google.com https://www.openstreetmap.org`) |

---

## Connecting a real backend

Every form submission goes through one function in `js/script.js`:

```js
function submitToBackend(kind, payload) { ... }   // kind: "reservation" | "catering" | "contact" | "order"
```

To go live, set `CONFIG.demoMode = false` and fill in `CONFIG.endpoints`. The function then `POST`s JSON to that URL. **Never put API keys or secrets in front-end JavaScript.** Keep them in server-side environment variables.

### Recommended low-cost architecture

| Need | Recommended option | Notes |
|---|---|---|
| **Reservations** | An established booking platform (OpenTable, Resy, SevenRooms, Tock) embedded or linked | Usually best for real restaurants: they handle availability, reminders and no-shows. Has a per-cover or monthly fee. |
| Simple reservation and catering requests | **Cloudflare Pages Functions** (free tier) in `/functions/api/*.js`, storing data in **Cloudflare D1** and emailing staff through a transactional email API (Resend, Postmark, etc.) | Add **Cloudflare Turnstile** (free) to block spam. Store the email API key as an encrypted environment variable in Pages settings. |
| Contact form only | A form service (Formspree, Basin) or the Pages Function above | Quickest option |
| **Online ordering and payments** | **Square Online / Square for Restaurants**, **Toast**, or **Stripe Checkout** created by a Pages Function | Use the processor's hosted checkout so card data never touches your site (keeps PCI scope minimal). Validate prices **server-side** from your own menu data and never trust totals sent by the browser. Use webhooks to confirm paid orders. |
| Order notifications to the kitchen | POS integration (Square/Toast) or email/SMS from the webhook handler | |

Example Pages Function skeleton (`functions/api/reservation.js`):

```js
export async function onRequestPost({ request, env }) {
  const data = await request.json();
  // 1. Validate fields server-side (never rely on browser validation alone)
  // 2. Verify the Turnstile token with env.TURNSTILE_SECRET
  // 3. Save to D1: await env.DB.prepare("INSERT INTO reservations ...").bind(...).run();
  // 4. Notify staff via email API using env.EMAIL_API_KEY
  return Response.json({ ok: true, reference: crypto.randomUUID().slice(0, 8) });
}
```

Then set `CONFIG.endpoints.reservation = "/api/reservation"`. Because it's same-origin, the existing CSP (`connect-src 'self'`) already allows the request. When you add Turnstile, payment scripts or an embedded booking widget, add their domains to `script-src`, `frame-src` and `connect-src` in `_headers`.

---

## QA performed

An automated headless-Chrome test (101 checks) was run against this build, with the `_headers` CSP applied:

- Every page at phone (390px), tablet (820px) and desktop (1440px): no horizontal overflow, no console or CSP errors
- All local links and asset paths resolve
- Menu: category filters and counts, search, empty state, dietary filters, deep links, dine-in-only handling
- Cart: add from home and menu, persistence across pages, quantity +/−, delivery fee, and tax/total maths (e.g. $98.50 subtotal → $8.13 tax → $106.63 total), checkout validation, confirmation, cart cleared
- Reservations: required-field errors, Monday rejection, correct time slots, large-party guidance, confirmation, `.ics` file
- Catering: package selection, estimate maths (40 × $58 + 18% = $2,738), 15-guest minimum, 7-day notice, confirmation
- Contact: validation and confirmation; today's hours highlighted; open/closed status
- Accessibility: skip link is the first Tab stop, mobile menu opens and closes with Escape, the cart dialog closes with Escape, focus moves to the first invalid field

Still to check manually after deployment: the live Cloudflare URL and custom domain, real-device testing (iOS Safari, Android Chrome), and a Lighthouse run on the live site.

---

© Virellion Apex · https://virellionapex.com

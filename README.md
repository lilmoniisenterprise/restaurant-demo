# ONDESSA — Coastal Hearth Kitchen

**Restaurant & hospitality demonstration website · Portfolio Project 01 · Virellion Apex**

**Live site:** https://lilmoniisenterprise.github.io/restaurant-demo/
**Repository:** https://github.com/lilmoniisenterprise/restaurant-demo

A premium, fully responsive restaurant website built with plain HTML5, CSS3 and vanilla JavaScript (no frameworks, no build step, no API keys). ONDESSA is a **fictional** wood-fired coastal restaurant created to show prospective clients what Virellion Apex can build.

> This website is a demonstration project developed by Virellion Apex. Restaurant name, menu, pricing, and business information are fictional and provided for demonstration purposes.

Ordering, payments, reservations, catering inquiries and contact messages all run in **demonstration mode**. They validate input and show realistic confirmations, but nothing is transmitted, no booking is made and no money moves.

See also: [`CHANGELOG.md`](CHANGELOG.md) (improvements made) · [`TESTING.md`](TESTING.md) (QA report).

---

## Features

| Area | What it demonstrates |
|---|---|
| **Homepage** | Official logo, photographic hero, live "open now / opens at" status, brand story, featured dishes with add-to-order, weekly specials, sample reviews (clearly labelled), catering/private-dining entry points, reservation call to action |
| **Menu** (`menu.html`) | 22 dishes in 5 categories (Specials, Appetizers, Entrées, Desserts, Beverages), each with a matched photo, description, price and dietary tags; category filters with counts; search; Vegetarian / Gluten-free filters; deep links (`menu.html#desserts`); dine-in-only item; compact app-style rows on phones |
| **Ordering & payment demo** | Cart saved in localStorage, quantity +/−, remove, pickup or delivery, delivery fee, 8.25% tax, tip (15/18/20%/none), payment by Card, Apple Pay, Google Pay or Pay at pickup, processing animation, receipt, live order tracker. The card panel uses a **read-only test card**, so real card data can never be entered. |
| **Reservations** | Date (closed Mondays, 60-day window), time slots generated from opening hours (past times removed), party size, seating choice, validation with inline and summary errors, demo confirmation, `.ics` calendar download |
| **Catering** | Three packages, event types, process steps, events photo gallery, inquiry form (15–300 guests, 7-day notice, dietary needs) with a live cost estimate |
| **Visit / contact** | Address, phone, email, hours table with today highlighted, live OpenStreetMap map, "Get directions" link, contact form, FAQ |
| **Quality** | Semantic HTML, skip link, keyboard navigation, visible focus, accessible dialogs and live regions, reduced-motion support, descriptive alt text, SEO / Open Graph / Twitter metadata, JSON-LD, sitemap, Content-Security-Policy |
| **Lead generation** | Discreet demo bar plus "Request a Similar Website" and "Schedule a Consultation" calls to action linking to https://virellionapex.com |

---

## File structure

```
restaurant-demo/
├── index.html · about.html · menu.html · reservations.html · catering.html · contact.html · 404.html
├── css/style.css            All styles (design tokens at the top)
├── js/script.js             Menu data, cart, checkout/payment demo, forms, hours, config
├── images/
│   ├── logo.png             Official ONDESSA logo (transparent, light-on-dark)
│   ├── logo-header.png      Trimmed logo used in the header and footer
│   ├── logo.svg             Vector version (uses system serif fonts; prefer the PNGs)
│   ├── hero.jpg, hero-600.jpg
│   ├── menu/                One photo per dish: <dish-id>.jpg (1200px) + <dish-id>-600.jpg
│   ├── photos/              Section photography (hearth, dining room, catering, events)
│   └── illustrations/       Original illustrated artwork from v1 (not used on pages; kept for reference)
├── assets/                  favicon.svg, apple-touch-icon.png, icon-512.png, og-image.jpg
├── .nojekyll                Tells GitHub Pages to serve files as-is
├── _headers                 Security headers for Cloudflare Pages (ignored by GitHub Pages)
├── robots.txt · sitemap.xml · site.webmanifest
├── README.md · CHANGELOG.md · TESTING.md
```

### Images

All photography is **self-hosted** in this repository: no external image links. The photos were sourced from **Pexels** (free for commercial use, attribution not required; credited in the footer), then cropped and compressed for the web. Each was checked by eye against its dish or section. Every image has descriptive alt text: dish alt text is the `alt` field in `MENU` in `js/script.js`, and section alt text is in the HTML.

For a real client, replace the photos with the restaurant's own photography, keeping the file names (or updating `MENU` ids). Export dish photos at 4:3, 1200×900, plus a 600×450 `-600` copy, at about 75–80% JPEG quality.

### External dependencies

- **Google Fonts** (free): Cormorant Garamond and Inter, with system-font fallbacks.
- **OpenStreetMap** embed on the contact page (free, no key).
- Nothing else.

---

## Deployment: GitHub Pages (current)

The site is deployed from the `main` branch, root folder:

1. Repo → **Settings → Pages** → Source: *Deploy from a branch* → Branch `main`, folder `/ (root)` → **Save**.
2. Every push to `main` redeploys automatically within about a minute.

GitHub Pages specifics handled in this project:
- All asset paths are **relative**, so the site works under the `/restaurant-demo/` sub-path.
- `.nojekyll` disables Jekyll processing.
- GitHub Pages can't send custom HTTP headers, so the **Content-Security-Policy is set with a `<meta>` tag** in every page. `_headers` is only used if the site moves to Cloudflare Pages.
- Canonical, Open Graph, sitemap and JSON-LD URLs point to `https://lilmoniisenterprise.github.io/restaurant-demo/`.
- `robots.txt` is only read by crawlers at a domain root, so on a GitHub project site it is informational. It takes effect if the site moves to its own domain or subdomain.
- `404.html` is served for unknown URLs. Its relative asset paths resolve correctly for missing pages one level deep (e.g. `/restaurant-demo/anything`).

### Optional: Cloudflare Pages + custom subdomain

1. Cloudflare → **Workers & Pages → Create → Pages → Connect to Git** → select this repo.
2. Framework preset **None**, build command empty, output directory `/`.
3. **Custom domains** → add e.g. `restaurant.virellionapex.com`.
4. Then find-and-replace `https://lilmoniisenterprise.github.io/restaurant-demo/` with the new URL in the HTML files, `sitemap.xml` and `robots.txt`. `_headers` will then apply automatically.

---

## Run locally

```bash
python3 -m http.server 8080   # from the project folder, then open http://localhost:8080
```

## Replacing the demo content (real client)

| What | Where |
|---|---|
| Logo | `images/logo.png`, `images/logo-header.png`, `assets/favicon.svg` |
| Colours, fonts | `:root` tokens at the top of `css/style.css` |
| Menu items, prices, tags, alt text | `MENU` in `js/script.js` (prices in **cents**; `orderable: false` = dine-in only; photo = `images/menu/<id>.jpg`) |
| Opening hours | `HOURS` in `js/script.js` + hours tables in the HTML + JSON-LD on `index.html` |
| Time zone, tax, fees | `CONFIG` in `js/script.js` |
| Catering packages | `PACKAGES` in `js/script.js` + package cards/radios in `catering.html` |
| Address / phone / email | Footer, contact page, mobile menu, JSON-LD |
| Reviews | `index.html`: use **verified** reviews only, then remove the "sample" labels |
| Demo notices | Remove the `.demo-ribbon`, `.demo-notice` blocks and the test-card panel once real services are connected; set `CONFIG.demoMode = false` |

## Connecting real services

All submissions go through `submitToBackend(kind, payload)` in `js/script.js`. Set `CONFIG.demoMode = false` and fill `CONFIG.endpoints`. Never put secret keys in front-end code.

| Need | Recommended |
|---|---|
| Reservations | OpenTable / Resy / SevenRooms / Tock widget or link (handles availability and reminders) |
| Online ordering + payments | Square Online or Toast, or Stripe Checkout / Payment Element created by a server function. Validate prices server-side and confirm orders via webhooks. |
| Catering / contact forms | A serverless function (e.g. Cloudflare Pages Functions + D1 + an email API) or a form service (Formspree). Add Cloudflare Turnstile against spam. |

When adding third-party scripts, frames or APIs, add their domains to the CSP `<meta>` tag (and to `_headers` if you use Cloudflare).

---

© Virellion Apex · https://virellionapex.com

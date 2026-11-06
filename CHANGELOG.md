# Changelog — ONDESSA restaurant demo

## v3 — Professionalization & quality-control pass (2026-11-06)

### Branding
- The header and footer now use the **official ONDESSA logo image** (`images/logo-header.png`, trimmed from `images/logo.png`) instead of an inline mark plus HTML text.
- Logo sizing is tuned for desktop (46px), laptop/tablet (40px) and phones (32px / 28px on very small screens).
- The social-sharing image (`assets/og-image.jpg`) was rebuilt from real paella photography with the official logo.
- The demo bar was restyled to be discreet and on-brand (dark, small type, brass link) and stays dismissible. Demo disclosures in the footer, forms and checkout are preserved.

### Photography
- **All photography is now self-hosted** (previously hotlinked from Pexels). There are no external image URLs anywhere on the site.
- Every candidate photo was downloaded and **checked by eye** before use. Candidates were rejected for a visible spirits-brand logo (spritz), an appliance brand name (oven) and an unappealing buffet shot.
- Photos were cropped to consistent ratios (dishes 4:3; heroes 16:9), compressed (progressive JPEG, ~75–80% quality) and given a 600px responsive variant with `srcset`.
- Every image has descriptive alt text written from what the photo actually shows.
- Dish names and descriptions were aligned with their photos. Ids were renamed so the code is consistent:
  `seafood-tower → oyster-platter` (now a dozen-oyster platter, $36), `whole-branzino → grilled-snapper`, `lamb-shoulder → lamb-chops`, `olive-oil-cake → lemon-olive-oil-cake`, `honey-panna-cotta → vanilla-panna-cotta`, `sorbet-trio → lemon-cheesecake`, `rosemary-lemonade → mint-lemonade`, `espresso → cortado`. Saved carts holding old ids are cleaned up automatically on load.
- A catering events gallery was added (garden banquet, wedding reception, plated dinner).
- The v1 illustrations were moved to `images/illustrations/` and are no longer used on pages.
- Folder layout now matches the original brief: `images/hero.jpg`, `images/menu/`, `images/logo.png`.

### Mobile
- The phone menu was redesigned as **compact app-style rows** (photo left, details right, two-line description), so far more dishes fit per screen.
- The phone hero crop now keeps the food in frame.

### SEO & GitHub Pages
- Canonical URLs, Open Graph, Twitter, JSON-LD, `sitemap.xml` and `robots.txt` now use the live URL `https://lilmoniisenterprise.github.io/restaurant-demo/` (previously an unconfigured placeholder domain).
- Added `.nojekyll`.
- Added a **Content-Security-Policy `<meta>` tag** to every page, because GitHub Pages ignores `_headers`. `_headers` is kept for Cloudflare and updated (no external image hosts).
- The README documents the GitHub Pages and Cloudflare behaviour, including robots.txt scope and 404 paths.

### Docs
- Rewrote `README.md`, and added this changelog and `TESTING.md`.

## v2 — Live-site upgrade
- Real photography (hotlinked), full payment demo (tip, Card / Apple Pay / Google Pay / Pay at pickup, processing, receipt, live order tracker), OpenStreetMap embed with directions, location moved to Galveston, first push to GitHub.

## v1 — Initial build
- Six pages plus 404, menu with filters and search, cart, reservations, catering estimator, contact, accessibility and SEO foundations.
- Fixes made during v1 QA: a submit-button layout-shift bug that could swallow clicks; horizontal overflow from the off-canvas mobile nav; old-style price numerals; hash-based menu filtering.

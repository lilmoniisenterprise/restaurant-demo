# Testing report — ONDESSA restaurant demo

**Date:** 2026-11-06 · **Build:** v3 (professionalization pass) · **Result: 149 automated checks passed, 0 failed**

## How it was tested

- **Automated browser tests** ran in headless Google Chrome (Playwright) against a local server serving exactly the files in this repository, with the site's Content-Security-Policy enforced.
- **Visual review:** full-page screenshots at desktop and phone sizes were inspected by eye, and every photograph was checked individually against its dish or section.
- **Live deployment checks** were run against https://lilmoniisenterprise.github.io/restaurant-demo/ after the push (see below).

## 1. Every page × every screen size (84 checks)

Pages: Home, Menu, Our Story, Reservations, Catering, Visit, 404.
Screen sizes: **phone 390×844, tablet 820×1180, laptop 1280×800, desktop 1440×900.**

For each page at each size:

| Check | Result |
|---|---|
| Every `<img>` on the page fully loads (lazy images forced to load) | ✅ 28/28 |
| No horizontal scrolling or overflow | ✅ 28/28 |
| No JavaScript errors or CSP violations in the console | ✅ 28/28 |

## 2. Functional checks (65 checks)

**Links & assets**
- ✅ Every local link, image, stylesheet and script path on every page resolves to an existing file

**Homepage**
- ✅ 4 featured dishes render; ✅ "Add" updates the header cart count

**Menu**
- ✅ All 22 dishes render
- ✅ Category filters: Specials 3, Appetizers 5, Entrées 5, Desserts 4, Beverages 5, each with correct `aria-pressed`
- ✅ Search ("paella" → 1 result); ✅ empty-state with reset
- ✅ Vegetarian filter (9 dishes); ✅ Vegetarian + Gluten-free (4)
- ✅ Dine-in-only dish shows "Reserve to enjoy", not "Add"
- ✅ Deep link `menu.html#desserts` filters on load

**Cart & checkout**
- ✅ Cart persists across pages (localStorage) and accumulates quantities
- ✅ Sticky mobile "View order" bar appears when the cart has items; ✅ cart drawer opens
- ✅ Totals: $99.00 subtotal → $8.17 tax (8.25%) → $107.17 total
- ✅ Quantity + / − updates the subtotal ($85.00)
- ✅ Delivery adds the $4.99 fee ($97.00)
- ✅ Delivery shows the address field; ✅ an empty submit lists 5 errors and focuses the first field
- ✅ Phone (10+ digits) and email validation messages
- ✅ 18% tip included ($112.30); ✅ the Pay button shows the total
- ✅ The card panel uses a read-only test card, and no input accepts real card data
- ✅ Card payment → processing → receipt (order #, total, "Visa •••• 4242 (test)")
- ✅ The order tracker advances Received → Preparing → Ready
- ✅ The cart is cleared after the order
- ✅ Apple Pay: wallet sheet → confirm → receipt

**Reservations**
- ✅ An empty submit lists 7 errors
- ✅ Mondays are rejected ("We're closed on Mondays…") and the time select is disabled
- ✅ Friday slots run 5:00 PM–10:00 PM
- ✅ Choosing 11+ guests shows the private-dining guidance
- ✅ The confirmation shows a reference, date, time, party size and seating
- ✅ The `.ics` calendar file is generated; ✅ "Make another" resets the form

**Catering**
- ✅ "Select package" checks the matching option
- ✅ Estimate: 40 guests × $58 + 18% service = $2,738; drop-off has no service charge ($2,320)
- ✅ 15-guest minimum enforced; ✅ 7-day notice enforced; ✅ confirmation shown

**Visit / contact**
- ✅ Today's hours highlighted; ✅ open/closed status shown
- ✅ Contact form validation (4 errors) and confirmation

**Accessibility & navigation (phone)**
- ✅ The first Tab focuses "Skip to main content"
- ✅ The mobile menu opens, and Escape closes it
- ✅ Escape closes the cart drawer

**Disclosure**
- ✅ The exact demonstration disclaimer is present in the footer

## 3. Live deployment checks (GitHub Pages)

| Check | Result |
|---|---|
| Live homepage serves the new build (cache-busted fetch) | ✅ |
| Canonical = `https://lilmoniisenterprise.github.io/restaurant-demo/` | ✅ |
| `og:image` = live URL of `assets/og-image.jpg` | ✅ |
| Header and footer use `images/logo-header.png` (official logo) | ✅ |
| No page URL references Pexels or the old placeholder domain | ✅ |
| Live `js/script.js` contains the updated menu ids and `images/menu/` paths | ✅ |
| Every image referenced by the pages exists in the deployed commit | ✅ |
| CSP `<meta>` tag present in all 7 pages; correct canonical on all 6 content pages; 404 is `noindex` | ✅ (verified in deployed files) |

## Known limitations

- **Live images weren't downloaded byte-for-byte from github.io.** The test environment can't connect to github.io directly. The identical files were verified locally (all load), they exist at the same paths in the deployed commit, and the live HTML references them. A quick click-through on a real phone after each deploy is still recommended.
- **Real-device testing** (iOS Safari, Android Chrome) and a **Lighthouse** run on the live site were not performed here.
- **Fonts:** headless tests used fallback fonts because Google Fonts was unreachable in the test environment. The live site loads Cormorant Garamond and Inter.
- **robots.txt** only takes effect at a domain root, not on a GitHub project sub-path.
- **404 page:** asset paths resolve for missing URLs one level deep (`/restaurant-demo/anything`). Deeper missing paths show the 404 text unstyled.
- **Demonstration mode:** no reservation, order, payment, catering inquiry or message is transmitted. This is intentional and disclosed on the site.

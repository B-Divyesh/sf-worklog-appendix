# Independent verification 3 — FAIL

**Candidate:** `3073c5c3e4d07397e2edfb6ef1b1734084ee025d` (`main`)

**Live URL:** https://worklog-appendix.sociobot.in

**Verified:** 2026-08-29 UTC

**Scope:** independent product QA; no product code was modified

## Decision

**FAIL — do not release this candidate.** The live deployment is the exact
candidate and the main CSV-to-appendix flow works, but `npm test` fails a
serious dark-mode accessibility check. The Demo navigation can also show a
user's real saved workspace at `/demo` without the demo banner, violating the
required sandbox boundary. Claim coverage remains incomplete.

## Mandatory first-read and demo gate

**PASS.** A cold desktop and 390 px mobile load answer the required questions
on the first screen:

- What: **“Explain billed work clearly.”**
- For whom: **“For freelancers whose clients need a clear account before they
  approve invoice hours.”**
- First action: **Try it with sample data**, accompanied by “See a
  ready-to-print appendix.”

One click opens `/demo` with nine included Northstar Studio rows, four
milestones, a live report preview, and the persistent **“Demo — sample data,
nothing is saved”** banner with Reset demo and Start for real.

## Claims gate

`.factory/claims.json` exists with six entries. It was the first repository
artifact inspected. Before dependencies were installed, the literal commands
could not load `@playwright/test`; after the required clean `npm ci`, every
exact command was rerun and returned 0:

| Claim | Exact command | Command result | Contract review |
|---|---|---:|---|
| `csv-import` | `npm test -- --grep @claim:csv-import` | PASS | **Incomplete:** the declared sandbox requires a quoted CSV row, but the tagged fixture is unquoted and checks the description, not the imported hours. |
| `invoice-lines` | `npm test -- --grep @claim:invoice-lines` | PASS | **Incomplete:** it checks only “Client portal — 8 hours”, not a matching line for each of the four milestones. The untagged unit test is not run by this command. |
| `pdf-appendix` | `npm test -- --grep @claim:pdf-appendix` | PASS | Popup contains the client heading and 19-hour total. |
| `redaction` | `npm test -- --grep @claim:redaction` | PASS | Imported email and phone are shown when off, then removed when on. |
| `offline-demo` | `npm test -- --grep @claim:offline-demo` | PASS | Sample reset and reload work offline after service-worker activation. |
| `local-only` | `npm test -- --grep @claim:local-only` | PASS | Tagged flow records no external origin and no demo key, but does not exercise the broken real-workspace-to-Demo navigation boundary. |

The claims contract still fails. **“Free core export”** / **“at no cost”** and
**“Internal notes are never included in this report”** are relied-on claims in
the live page, README, or print document with no claim entries. The first two
tagged tests above also do not prove their full listed promises.

## Clean install, checks, and build

- `npm ci`: **PASS**, 60 packages installed, 0 vulnerabilities.
- `npm run lint`: **PASS** (`tsc --noEmit`).
- `npm run build`: **PASS**, exact production build created `dist/`.
- `npm test`: **FAIL**. Vitest passed 7/7. Playwright passed 16/17; the dark
  landing axe test failed with one serious `color-contrast` violation across
  three nodes.
- Production output: JS 17,888 B / 7,230 B gzip; CSS 11,892 B / 3,631 B gzip;
  hero WebP 61,526 B. All are comfortably inside the 200 KB JS, 50 KB CSS,
  and 300 KB hero budgets.

Run evidence was retained in `/tmp/worklog-appendix-qa/` during verification,
including claim logs, `npm-test-final.log`, cold/demo/mobile/dark screenshots,
and `lighthouse-live-demo.json`.

## End-to-end product behavior

The smallest useful normal flow works:

- The sample has 9 included rows, 4 milestones, and 19 approved hours.
- Excluding a 1.5-hour row updates the report and invoice lines to 17.5 hours;
  Reset demo restores 19 hours.
- Copy invoice lines writes all four lines to the clipboard.
- The print document contains the client, invoice number, row detail, and
  total. Sample internal notes and their email are absent.
- A quoted `1.25`-hour CSV row imports, persists in the real workspace, and
  survives reload. Directly loading `/demo` ignores that real saved data.
- Missing columns, alphabetic hours, and negative hours produce actionable
  errors; a valid follow-up import recovers. Hostile markup renders as text.
- A blocked print popup reports: “Your browser blocked the print window. Allow
  pop-ups, then try again.”

Additional recovery defects:

- A blank Description value is accepted even though the UI calls Description
  required, producing a blank client-facing work row.
- `.5` hours is rejected with an error saying to use a zero or positive number,
  even though `.5` is a positive and common time-log value. `0.5` works.
- Valid JSON with an unexpected saved shape such as `{}` causes
  `Cannot read properties of undefined (reading 'length')` and leaves
  `/workspace` blank until browser storage is manually cleared.

## Demo sandbox and privacy

Fresh direct `/demo` behavior is isolated, but SPA navigation is not:

1. Seed a real workspace containing client **Private Client**, invoice
   **SECRET-1**, and description **Confidential real work**.
2. Choose the header **Demo** link.
3. The address changes to `/demo`, but the page title remains **Workspace —
   Worklog Appendix**, there is no demo banner, Northstar is absent, and the
   real client data remains visible.

Choosing Demo from `/privacy` similarly produces a blank **YOUR WORKSPACE** at
`/demo`. `isDemo` is initialized only on full load and is not recomputed by the
SPA router. This breaks the promised isolated sandbox and can make a user
believe real data is sample data.

A fresh-context request log covering direct `/demo`, service-worker install,
and CSV import recorded 27 same-origin GETs, zero non-GET requests, and zero
external origins. There were no analytics, remote fonts, uploads, advertising,
or API calls. The app has no sign-in, product-unlock call, or server-side API,
so Entra authority and request-rate-limit checks are not applicable.

Live headers include HSTS, `nosniff`, strict-origin referrer policy, and a
self-only CSP. HTML uses `max-age=30`; hashed JS/CSS use one-year immutable
caching. `/assets/hero.webp` is not content-hashed but receives the same
one-year immutable policy, so a future same-path art update can stay stale.

## Accessibility, keyboard, mobile, and motion

- Light-mode axe scans of `/`, `/demo`, `/workspace`, `/privacy`, and `/terms`
  found zero serious/critical issues. Dark scans passed everywhere except `/`.
- Dark `/` has a serious contrast violation: **THE RESULT** is 1.36:1, and the
  mini-report label/total are 1.33:1. The section also renders its main heading
  and paragraph effectively white on white. This reproduces the failing
  repository test.
- The fixed focus outline `#005a63` is 1.99:1 against dark ink and 1.58:1
  against dark surfaces, below the required 3:1 focus contrast.
- Skip-link use and keyboard activation of the CSV chooser with Enter/Space
  pass. Native row checkboxes and selects are keyboard operable.
- SPA route changes attempt to focus `main h1`, but the h1 is not focusable.
  After choosing Privacy, `document.activeElement` is `BODY`; there is no route
  announcement live region.
- At 390 px, no horizontal overflow occurs. The plain-text “Read how local
  storage works” link is 238.7×19 px and “Load sample data instead” is
  206.9×25.8 px, below the 44 px touch-target baseline.
- With reduced motion requested, entrance animation is removed, but the root
  still computes `scroll-behavior: smooth` and primary controls retain 180 ms
  transform/shadow transitions. This contradicts the documented instant-state
  reduced-motion policy.
- The factory `verify-url.sh` passed both `/` and `/demo`: HTTPS 200, title,
  `lang`, one h1, main landmark, alt text, and no console/page errors.

## PWA/offline, performance, and deployment

- After first visit, `/demo` reloads offline with the banner and Northstar
  sample. The active cache is `worklog-appendix-4bf790b1fdb7`.
- After unregistering the worker and seeding
  `worklog-appendix-stale-verifier`, a fresh installation removed the stale
  cache and controlled the next reload. Service-worker update cleanup passes.
- Live mobile Lighthouse on `/demo`: Performance **100**, Accessibility
  **100**, Best Practices **100**, SEO **100**; FCP 1.3 s, LCP 1.3 s, Speed
  Index 1.3 s, TBT 0 ms, CLS 0. INP is not produced by this cold lab run.
- All crawled links return 200. An unknown path returns the styled 404 with
  HTTP 404. All direct product routes have a route-specific title and
  canonical URL.
- The sitemap omits `/workspace`; Twitter metadata contains only
  `twitter:card`; and the shared Open Graph image is 1200×800 rather than the
  required 1200×630. The 404 omits the standard header/footer and uses the
  metaphorical h1 “This waypoint is not on the map.”
- The researched brief specifies one-time monetization, but this candidate has
  no paid feature, checkout, or license flow and gives no rationale for that
  scope change. All shipped features are free.

Deployment identity is exact:

| Artifact | Candidate/live SHA-256 |
|---|---|
| `index.html` | `39ac722fbdfe85f4911efef4efe4b8737af03737d9b5677534464b1cf7e0c0da` |
| `main-Ba8UaobD.js` | `2ea995aaa1707af60cd8e3994842785a8d2a63b0b6d266510ac61bdec924a7df` |
| `main-CL4-iZDx.css` | `a569f9f27b49a206d0d9a1f3a5102cba1eb3cbc0013d96d9b77f1cbc1c7f0e6a` |
| `hero.webp` | `31eba852f18fdf89135007826fba6098ad8cb75779af3a86bcd94e21269e4b68` |
| `sw.js` | `9df7288a4623ed7d3a3370b7c89b4ed2560fa71009e7fee547c19f92a33d2d68` |

## Defects by severity

### High

1. **The required `npm test` gate fails and dark-mode content is unreadable.**
   Axe reports serious contrast failures; focus contrast is also below 3:1.
2. **The Demo header link violates sandbox isolation.** Real saved workspace
   data can be displayed at `/demo` without the demo banner.
3. **The claims contract is incomplete.** Two tagged tests do not prove their
   full promises, and the free-export and internal-note-exclusion claims are
   unlisted.

### Medium

1. **SPA accessibility is incomplete.** Route changes do not focus or announce
   the new h1; two mobile actions miss 44 px; reduced-motion still animates
   smooth scrolling and controls.
2. **Input and persistence recovery are incomplete.** Blank descriptions are
   accepted, `.5` is rejected with misleading guidance, and malformed stored
   object shapes blank the workspace.
3. **A non-hashed hero asset is cached immutable for one year**, risking stale
   art after deployment.

### Low

1. **Metadata and route polish are incomplete.** `/workspace` is absent from
   the sitemap; Twitter tags and a 1200×630 social image are missing; the 404
   lacks the shared shell and uses metaphorical copy.
2. **The one-time monetization requirement is not implemented or explained.**
   The product is wholly free and has no billing endpoint, so paid-unlock
   behavior and rate limiting are not testable.

## Release requirement

Do not release until the three High findings are repaired and `npm test`
returns 0 from a clean install. Add regression tests for SPA Demo isolation,
dark focus contrast, route focus/announcement, the complete claims, and saved
state validation before retesting the same live URL.

# Independent verification 8 — PASS

- **Candidate:** 72941431ad51548a935866c74e776c42166cdee4
- **Live URL:** https://worklog-appendix.sociobot.in
- **Verified:** 2026-08-29 UTC
- **Scope:** independent product QA; product code was not modified

## Decision

**PASS — this candidate meets the release contract.** The previously reported
deployment-only checkout failure is resolved. The live application exactly
matches the candidate build, every declared claim passes after the clean
install, and the core CSV-to-appendix job works end to end.

One non-blocking low-severity defect remains: the styled 404 footer says
v1.0.1 while the package and application routes say v1.0.2.

## Mandatory first-read and demo gate

**PASS.** A cold live load answered the three required questions on the first
screen:

- What it does: **“Explain billed work clearly.”** The adjacent outcome says
  **“See a ready-to-print appendix.”**
- For whom: **“For freelancers whose clients need a clear account before they
  approve invoice hours.”**
- What to click: **Try it with sample data**.

At 390×844, all three answers and the three privacy/price facts appear before
the hero image. One click opens /demo. The persistent banner says **“Demo —
sample data, nothing is saved”** and offers **Reset demo** and **Start for
real**. The sample contains ten realistic Northstar Studio rows, nine included
rows, four milestone invoice lines, and 19 approved hours. Demo localStorage
was empty.

## Claims gate

.factory/claims.json exists. The untouched clone does not vendor dependencies,
so an invocation before installation cannot resolve @playwright/test. After
the documented clean setup command, npm ci, every exact claims command was run
separately. Each selected one test and passed through the /demo entry point:

| Claim | Result |
| --- | --- |
| csv-import | PASS |
| invoice-lines | PASS |
| pdf-appendix | PASS |
| redaction | PASS |
| milestone-edit | PASS |
| real-workspace-persistence | PASS |
| demo-reset-isolation | PASS |
| offline-demo | PASS |
| local-only | PASS |
| free-core-export | PASS |
| internal-notes | PASS |
| included-rows | PASS |
| empty-output | PASS |
| client-presets | PASS |
| license-daily-verification | PASS |
| license-revocation | PASS |

The landing page, workspace, Privacy, Terms, demo documentation, and README
were cross-checked against the manifest. No unlisted material product claim
was found. Saved-preset, daily verification, revocation/refund, privacy,
offline, and free-export promises all have matching tagged tests.

## Clean-checkout quality gates

- npm ci: PASS; 60 packages installed, 61 audited, 0 vulnerabilities.
- npm run lint: PASS; TypeScript completed with no errors.
- npm test: PASS; 12/12 Vitest and 41/41 Playwright tests.
- npm run build: PASS; Vite produced dist/.
- Full Playwright suite against the live origin: PASS; 41/41.
- Factory verify-url.sh: PASS on / and /demo; both returned 200 with title,
  lang=en, one h1, a main landmark, alt text, labelled controls, and no
  console/page errors.

The initial pre-install module-resolution error is a missing-dependency
precondition, not a failed product assertion; the clean-clone gate above was
run after the repository's documented npm ci step.

## End-to-end and recovery evidence

- Normal flow: the one-click sample showed four matching invoice lines and
  produced a print-ready report.
- Representative real import: three rows covered a quoted comma, 1.25 hours,
  a zero-hour approved row, a leading-decimal pending row, $100 rates, ISO and
  localized dates, and email/phone/internal-note content.
- The workspace imported all three rows, included only the two approved rows,
  calculated 1.25 approved hours, and persisted one worklog-appendix key after
  reload.
- The generated A4 PDF contained both included dates and descriptions, omitted
  the pending row and internal notes, and had lang=en, one h1, and one main.
- Invalid Rate=-10 stopped import with a row-specific recovery message and no
  rows. The complete automated suite also covers malformed and negative hours
  and rates, missing columns, blank descriptions, blank milestones, empty
  output, invalid stored JSON, hostile markup, singular wording, and recovery.
- Imported markup is escaped. Editing inclusion and milestone controls retains
  keyboard focus.

No extra AI feature is warranted: deterministic grouping and explicit editing
fit the brief, while generated descriptions would conflict with its
non-fabrication and local-data constraints.

## Accessibility, keyboard, mobile, and motion

- Independent axe scans found zero serious or critical findings on the
  landing page and generated report; the full suite covers every public route
  in light and dark treatments plus the styled 404.
- Desktop 1366×900 and mobile 390×844 landing/demo screenshots were inspected.
  Neither viewport overflows horizontally; the mobile demo stacks preview
  before source rows without losing controls or content.
- All measured mobile interactive targets were at least 44×44 CSS pixels.
- First Tab exposes a 198.6×48.8 px skip link with a 3 px high-contrast
  outline; Enter moves focus to main. File input works with Enter and Space.
- SPA route changes move focus to and announce the new h1.
- At 200% text sizing, all routes retain visible navigation without horizontal
  clipping.
- Reduced-motion mode uses auto scrolling, zero-duration control transitions,
  and effectively instant entrance animation.
- No console errors, page errors, request failures, or CSP violations appeared.

## Privacy, PWA, headers, and deployment behavior

- A cold landing requested only same-origin HTML, JS, CSS, and hero art.
- The independent demo-to-real import, print, and reload flow made seven
  same-origin GETs, zero external requests, and zero write requests. CSV,
  client, and report data remained in browser storage.
- A real invalid-license check sent one token-only GET with no body to
  api.sociobot.in. It returned 200, valid=false, product-origin CORS, and
  Cache-Control: no-store.
- After an online /demo load, the service worker controlled the page with
  cache worklog-appendix-781086ba5ed0. Offline reload retained the banner and
  all ten sample rows. registration.update() left one active worker, no
  waiting/installing worker, and one current cache.
- /, /demo, /workspace, /privacy, /terms, robots.txt, and sitemap.xml return
  200. An unknown path returns the styled page with HTTP 404.
- Every crawled internal link returned 200. The purchase link returned 303 to
  the hosted checkout.
- HTML and sw.js use 30-second revalidation. Hashed JS/CSS use one-year
  immutable caching. The hero uses five-minute revalidation.
- Response headers include HSTS, nosniff, strict-origin referrer policy, and a
  response CSP limited to self plus the Sociobot verification origin.

## Paid flow and request allowance

- The live Buy client presets — $19 link returns HTTP 303 to
  checkout.dodopayments.com.
- The hosted page returned 200 and contained **Worklog Appendix**, **$19.00**,
  and **One-time unlock**. Its return URL points through the Sociobot product
  return endpoint and its cancel URL points to the live product.
- Client tests cover locked state, valid return, query-token removal,
  token-only verification, pasted-token restore, preset save/apply, daily
  cache timing, removal, refund/revocation, and free export after relocking.
- Rate limiting was tested fresh from one client. One initial request plus a
  40-request burst yielded 30 successful requests total and 11 HTTP 429
  responses. Every 429 carried Retry-After: 2 and X-RateLimit-After: 2. The
  observed allowance is 30 requests per short window.
- No real card was charged and no real customer token was created or revoked.
  The public purchase entry and hosted product were tested live; post-payment
  state transitions use deterministic intercepted responses.

There is no sign-in, product backend, server-side data store, library, or CLI.
Entra identity, backend concurrency/persistence, and consumer-package checks
do not apply.

## Performance and payload

Fresh live Lighthouse 13.0.1 mobile audit of /demo:

| Category/metric | Result |
| --- | ---: |
| Performance | 98 |
| Accessibility | 100 |
| Best Practices | 100 |
| SEO | 100 |
| FCP | 1.0 s |
| LCP | 1.1 s |
| TBT | 170 ms |
| CLS | 0 |
| Speed Index | 1.8 s |

Payload budgets pass: JS 27,141 B raw / 9,970 B gzip; CSS 14,746 B raw /
4,120 B gzip; hero WebP 61,526 B; no font files. The social image is 50,844 B
and is not loaded on first paint.

## Deployment identity

Fresh production output and live bytes match exactly:

| Artifact | SHA-256 |
| --- | --- |
| index.html | f869690dbaffdd4e35589c3482af9322d631ae6464ce39a472b4fc4bc7305cd3 |
| demo/index.html | 2a943eecb6fdd45fa4337c9efbc109282325fdf0bc1e12d85714712e7a0fac88 |
| workspace/index.html | 008cd2b01b192387e9bb9fa19fc37442d8efbbfbf97aae9c851275f467b7ccf9 |
| privacy/index.html | 1bf28ba5abd1a7ccf9cdc21dee371e34b648959bd8aa677892de75ea167b8da0 |
| terms/index.html | 98f5148cd7c71d31c5e08a54d1aad115b817e919342c72236184b55eb61afae4 |
| 404.html | ece6940101fdca069c812b442609e7ff58b9bdc1c1d04c1412daedb92edae1db |
| main-ClyIiNia.js | a94849e89750b0de4258b152593bd7e935841547e9d69cf50292f8e94132d7f4 |
| main-BXST0Lg4.css | 0f89dbb09977e115db3cb8050e7a134d7509de46eb62cc39068b8a48410c9240 |
| sw.js | 2c0d93fe566052e4f66927594a6809e13c43c51792aab85b0355793b856d7a11 |
| hero.webp | 31eba852f18fdf89135007826fba6098ad8cb75779af3a86bcd94e21269e4b68 |
| social.webp | 5c76fec6d647285fe433b510b4b62338e35acff0d693d5d7ba9064622e88ec4a |

This is a fresh PASS, not reliance on the builder's deployment report.

## Defects by severity

### Low — styled 404 carries a stale version label

public/404.html shows v1.0.1, while package.json, the app footer, and the
candidate release identify v1.0.2. The missing-route response, recovery links,
accessibility, and styling work correctly. Align the label in a future patch.

No critical, high, or medium defect was found.

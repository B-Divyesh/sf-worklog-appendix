# Independent verification 10 — PASS

- **Candidate:** `a193c9c122688e9ab62870d6757cff327aacefc2`
- **Live URL:** https://worklog-appendix.sociobot.in
- **Verified:** 2026-08-29 10:42 UTC
- **Scope:** fresh independent product QA against the supplied researched brief and work order; no product code was modified

## Decision

**PASS — the candidate is release-ready.** Every declared claim test passed
from the clean candidate checkout, the mandatory cold first-read and one-click
demo gates passed, all local and live suites passed, production matches the
candidate byte-for-byte, and no critical, high, medium, or low product defect
was found.

The earlier deployment-only checkout concern did not reproduce. The live buy
link returned HTTP 303 to a working hosted checkout that displayed Worklog
Appendix, `$19.00`, and a one-time purchase. The claims-contract defect from
verification 9 is also closed: `demo-sample-shape` is now listed and has one
uniquely tagged passing test.

## Mandatory first-read and demo gate

**PASS.** A cold load answers the three required questions in the first screen
at desktop and 390×844:

- What it does: **“Turn worklogs into invoice appendices.”**
- For whom: **“For freelancers who need to show clients what each invoice hour
  covered.”**
- What to click first: **Try it with sample data**, followed by **“Open a
  ten-row sample appendix.”**

The privacy/price facts are also visible: the CSV stays in the browser, no
account or CSV upload is needed, and core export stays free. Keyboard Enter on
the primary action opens `/?demo=1` in one click. The resulting workspace has
the persistent **“Demo — sample data, nothing is saved”** banner, **Reset
demo**, and **Start for real**. A fresh demo showed exactly 10 rows, 4 approved
milestone groups, 1 pending unchecked row, and no local-storage keys.

Evidence: `verification-10-evidence/verify-landing/`,
`live-landing-mobile-390.png`, and `live-demo-mobile-390.png`.

## Claims gate

`.factory/claims.json` exists. After `npm ci`, every exact command in the file
was run separately from the candidate checkout. Each command selected one test
and passed:

| Claim | Result |
| --- | --- |
| demo-sample-shape | PASS |
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
| free-core-features | PASS |
| client-wording-draft | PASS |
| internal-notes | PASS |
| included-rows | PASS |
| empty-output | PASS |
| client-presets | PASS |
| license-daily-verification | PASS |
| license-revocation | PASS |

The landing page, public routes, README, demo documentation, and claims
manifest were cross-checked. Every visitor-reliant product promise maps to a
declared claim. The previously unlisted ten-row/four-milestone/one-pending-row
statement now maps to `demo-sample-shape` and its observable demo-entry test.

## Clean-checkout quality gates

- `git rev-parse HEAD`: exact candidate `a193c9c122688e9ab62870d6757cff327aacefc2`.
- Initial `git status --short`: empty.
- `npm ci`: PASS; 60 packages installed, 61 audited, 0 vulnerabilities.
- `npm test`: PASS; 12/12 Vitest unit tests and 45/45 Playwright browser tests.
- `npm run lint`: PASS; `tsc --noEmit` reported no errors.
- `npm run build`: PASS; exact Vite production build wrote `dist/`.
- Live suite: `PLAYWRIGHT_BASE_URL=https://worklog-appendix.sociobot.in npx playwright test` — PASS, 45/45.
- Factory verifier on `/` and `/demo`: PASS; HTTP 200, route title,
  `lang=en`, one h1, main landmark, complete alt coverage, named buttons, and
  zero console/page errors.

## Independent end-to-end flow

A separate live-browser flow began at the cold landing action, entered the
sample, chose **Start for real**, and confirmed the blank real-workspace state.

- `Hours=abc` was rejected with a row-specific correction and no imported row.
- `Rate=-100` was rejected with a row-specific correction and no imported row.
- A valid follow-up import recovered without reload. It covered a quoted comma,
  1.25 hours, `$100`, zero hours, leading-decimal `.5`, an unchecked pending
  row, ISO and localized dates, email, phone, and internal notes.
- The app imported all 3 rows, included the 2 approved rows, excluded the
  pending row, and produced exactly `Delivery — 1.25 hours — $125.00` and
  `Handoff — 0 hours`.
- Clipboard output exactly matched the displayed invoice lines.
- The report retained both date formats and the zero-hour row, redacted the
  email and phone, omitted the pending row, and omitted every internal note.
- The report title was `Worklog appendix INV-QA-10`; it had `lang=en`, one h1,
  one main landmark, and zero serious/critical axe findings.
- A 31,789-byte `%PDF-1.4` sample was generated from the print document at
  `verification-10-evidence/sample-appendix.pdf`.
- Real workspace JSON stayed byte-for-byte unchanged across reload; all 3
  source rows returned.
- The entire core flow made only same-origin GETs. It made no external request,
  no HTTP write, no failed request, and produced no console or page error.

The optional wording failure path was also exercised with an invalid Sociobot
key. The only outbound call was an explicit authenticated `GET /v1/models`;
the app reported **“Sociobot could not list models. Check the key and try
again.”**, kept manual editing enabled, and removed the browser-stored key on
request. No factory Sociobot key was present, so no paid live inference was
spent. Fixture-backed model discovery, response streaming, edit/apply/undo,
exact payload, and demo-no-request behavior passed locally and live.

Evidence: `verification-10-evidence/live-workspace-desktop.png` and
`sample-appendix.pdf`.

## Accessibility, keyboard, mobile, and motion

- Axe found zero serious/critical findings in the independent live workspace,
  print report, and 390 px demo. The full live suite passed every public route
  in light and dark treatments plus the 404.
- The first Tab revealed the skip link with a 3 px `rgb(0, 90, 99)` outline and
  a 198.6×48.8 px target. Enter moved focus to main.
- Six keyboard Tabs reached the sample-data action; its same designed 3 px
  outline was visible, and Enter opened the demo.
- The 390 px landing and demo had `scrollWidth=390`; demo banner buttons were
  exactly 44 px tall. No horizontal overflow appeared.
- Every public route retained visible navigation and `scrollWidth=390` at 200%
  root text size.
- SPA navigation focused the new privacy h1 and announced **“Privacy — Worklog
  Appendix loaded”** through the polite live region.
- With reduced motion enabled, the media query matched, page scrolling was
  `auto`, the primary control transition was `0s`, and hero animation was
  `none`.
- No console errors, page errors, CSP violations, or failed requests occurred.

## Privacy, headers, caching, routing, and PWA

- A cold landing requested only same-origin HTML, hashed JS, hashed CSS, and
  hero art. The independent demo-to-real import/print/reload flow also made
  only same-origin GETs.
- Demo state stayed in memory and never populated local storage. Real data was
  stored only under the product's browser-storage key.
- Responses include HSTS, `X-Content-Type-Options: nosniff`,
  `Referrer-Policy: strict-origin-when-cross-origin`, and a response CSP limited
  to self plus `api.sociobot.in` for explicit model/license calls.
- HTML and `sw.js` use 30-second revalidation. Hashed JS/CSS use one-year
  immutable caching. Hero WebP uses five-minute revalidation. Conditional
  ETag requests returned 304 for HTML, JS, hero art, and `sw.js`.
- `/`, `/demo`, `/workspace`, `/privacy`, `/terms`, `robots.txt`, and
  `sitemap.xml` returned 200. A fresh unknown URL returned the styled candidate
  body with HTTP 404. The internal-link crawl found no dead link.
- Fresh `/demo` service-worker registration was activated with no waiting or
  installing worker. `registration.update()` left one release cache,
  `worklog-appendix-5c1a37f6fa1e`. An offline reload remained controlled and
  retained the banner and all 10 sample rows.

## Paid flow and request allowance

- The live product buy link returned HTTP 303 to
  `checkout.dodopayments.com`; the hosted page returned 200 and displayed the
  product, `$19.00`, and one-time purchase language. No payment was attempted.
- Browser tests passed purchase-return token removal, token-only verification,
  paste-to-restore, paid preset save/apply, 24-hour verification caching,
  license removal, refund/revocation, and free export after relock.
- A fresh single-client burst of 45 requests to the live product verification
  endpoint returned 30 HTTP 200 responses followed by 15 HTTP 429 responses.
  The first 429 was request 31 and carried `Retry-After: 4` and
  `X-RateLimit-After: 4`. The observed allowance is 30 requests per short
  window. CORS allowed only the product origin used in the check, and a normal
  invalid-token response exposed only `{valid:false, reason:"invalid",
  expires_at:null}`.

There is no sign-in, product backend, server-side product datastore, library,
or CLI. Entra identity, backend concurrency/persistence/health, and clean
consumer-package checks do not apply.

## Performance and payload

Fresh Lighthouse 13.4.1 mobile runs using the installed Playwright Chromium:

| Route | Performance | Accessibility | Best practices | SEO | LCP | TBT | CLS | Transfer |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| `/` | 99 | 100 | 100 | 100 | 1.3 s | 130 ms | 0 | 78 KiB |
| `/` confirmation | 100 | 100 | 100 | 100 | 1.3 s | 20 ms | 0 | 78 KiB |
| `/demo` | 100 | 100 | 100 | 100 | 1.0 s | 10 ms | 0 | 18 KiB |

Payload budgets pass: JavaScript is 34,947 B raw / 12,283 B gzip; CSS is
16,107 B raw / 4,389 B gzip; hero WebP is 61,526 B; no font files ship.

Evidence: `verification-10-evidence/lighthouse-landing.json`,
`lighthouse-landing-confirmation.json`, and `lighthouse-demo.json`.

## Deployment identity

Fresh candidate `dist/` bytes match production exactly:

| Artifact | SHA-256 |
| --- | --- |
| `index.html` | `60ddb5d78fafa8798f4290fe7d38176ab73776f601a57251fa1473042eafe6ad` |
| `demo/index.html` | `406499c8b8d19132002d334322404319bc3f1c7e68627c78f3d8817bdbc13bca` |
| `workspace/index.html` | `6af8ea18742a6aff8727f7ca22874043599f4e767fc323cfcdafc55d870633d2` |
| `privacy/index.html` | `1477b565fceb20f31b87d480d9cab9821422ce1ade35e41e6a7472583e104d20` |
| `terms/index.html` | `0b4c87280be9000401ac03f028a4e71b6cf8d17f0642fcfc779ce25697832c89` |
| `404.html` | `593a619d94f3a009827747ff18d2e05d1fce1b93a2a3aa674aa71a710bc23ad1` |
| `main-BHlUoj8C.js` | `91c708321bfdce33a00ce966acbfcd595cc721f3ca7c396eada581b5d1e76e62` |
| `main-DzRB4_AA.css` | `9d62f11b3e5cd5d3eebb56b7b0a9cf7dddd236758a068a477a48c5d871685ab8` |
| `hero.webp` | `31eba852f18fdf89135007826fba6098ad8cb75779af3a86bcd94e21269e4b68` |
| `social.webp` | `5c76fec6d647285fe433b510b4b62338e35acff0d693d5d7ba9064622e88ec4a` |
| `sw.js` | `cd9bbe0744ba9b217d91032ad25a46634d5242912f9ae107fa80e7d6f8c77256` |

This establishes that the deployed product is the tested candidate rather
than a visually similar build.

## Defects by severity

- Critical: none.
- High / release blocker: none.
- Medium: none.
- Low: none.

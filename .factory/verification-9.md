# Independent verification 9 — FAIL

- **Candidate:** `ce9298d757e84efb087688d01c384c1656135d71`
- **Live URL:** https://worklog-appendix.sociobot.in
- **Verified:** 2026-08-29 09:06 UTC
- **Scope:** independent product QA; product code was not modified

## Decision

**FAIL — one release-blocking claims-contract defect remains.** The product
behavior, deployment, accessibility, privacy, paid entry point, PWA behavior,
and performance pass. However, the live landing page says **“Open a ten-row
sample appendix.”** `.factory/demo.md` also promises a ten-row sample with four
approved milestones and one pending row. No `.factory/claims.json` entry lists
that quantitative sample-shape claim, and no uniquely tagged claim test asserts
all of those numbers. The attached claims contract explicitly makes an
unlisted claim a failed review even when a fresh manual check happens to confirm
it today.

The previously reported deployment-only checkout problem did not reproduce.
The live purchase entry returned 303 to a working hosted $19 one-time checkout.

## Mandatory first-read and demo gate

**PASS.** A cold production load answered every required question on the first
screen:

- What it does: **“Turn worklogs into invoice appendices.”**
- For whom: **“For freelancers who need to show clients what each invoice hour
  covered.”**
- What to click first: **Try it with sample data**; the adjacent text explains
  that it opens the sample appendix.

At 390×844, the heading, audience sentence, primary action, action outcome, and
all three privacy/price facts end at 702 CSS px and are visible without
scrolling. One click opens `/?demo=1`, with the persistent **“Demo — sample
data, nothing is saved”** banner, **Reset demo**, and **Start for real**. The
fresh demo had ten rows, nine included rows, four invoice lines, and no local
storage keys.

Evidence: `verification-9-evidence/live-cold-desktop.png`,
`live-landing-mobile-390.png`, and `live-demo-mobile-390.png`.

## Claims gate

`.factory/claims.json` exists. After `npm ci`, every exact command in it was run
separately from candidate commit `ce9298d`; each selected exactly one tagged
test and passed:

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
| free-core-features | PASS |
| client-wording-draft | PASS |
| internal-notes | PASS |
| included-rows | PASS |
| empty-output | PASS |
| client-presets | PASS |
| license-daily-verification | PASS |
| license-revocation | PASS |

**Cross-check: FAIL.** The quantitative landing/demo-documentation claim about
the exact sample shape is absent from the manifest. The untagged first-screen
test confirms entry into demo mode but does not assert ten rows. Existing tagged
tests cover invoice-line behavior, reset isolation, and offline availability,
not the complete advertised `10 rows / 4 approved milestones / 1 pending row`
shape. Per the acceptance contract, passing all listed commands does not cure an
unlisted claim.

## Clean-checkout quality gates

- `npm ci`: PASS; 60 packages installed, 61 audited, 0 vulnerabilities.
- `npm run lint`: PASS; TypeScript reported no errors.
- `npm test`: PASS; 12/12 Vitest and 44/44 Playwright tests.
- `npm run build`: PASS; exact production build produced `dist/`.
- Live suite: `PLAYWRIGHT_BASE_URL=https://worklog-appendix.sociobot.in npx playwright test` — PASS, 44/44.
- Factory `verify-url.sh` on `/` and `/demo`: PASS; HTTP 200, correct title,
  `lang=en`, one h1, main landmark, no missing alt, no unnamed buttons, and no
  console/page errors.

## End-to-end and recovery evidence

The independent manual flow began at the live first-screen action, left the
demo through **Start for real**, and exercised invalid and valid CSV input.

- `Rate=-10` was rejected with a row-specific correction and created no rows.
- A following valid three-row CSV recovered without reload. It covered a quoted
  comma, 1.25 hours, `$100`, zero hours, a leading-decimal pending row, ISO and
  localized dates, email, phone, and internal notes.
- The app imported all three rows, included only the two approved rows, and
  produced `Discovery — 1.25 hours — $125.00` plus `Build — 0 hours`.
- Clipboard output exactly matched the displayed invoice lines.
- The print report kept both included dates and the zero-hour row, redacted the
  email and phone, and omitted the pending row and every internal note.
- The report had `lang=en`, one h1, one main landmark, and zero serious/critical
  axe findings.
- The real workspace JSON remained unchanged across reload. The retained source
  row was displayed with its contact details redacted, as intended.
- Browser back/forward restored the correct route, title, h1 focus, and polite
  route announcement.

The automated suite additionally covers malformed/negative hours and rates,
blank descriptions, missing columns, invalid stored JSON, hostile markup,
singular wording, blank milestones, empty output, focus retention, license
revocation/refunds, fixture-backed AI streaming, and free export after relock.

## Accessibility, keyboard, mobile, and motion

- Independent axe checks found zero serious/critical findings on the live
  landing page, mobile demo, real workspace, and generated print report. The
  full suite covers all public routes in light and dark treatments and the 404.
- The first Tab revealed a 198.6×48.8 px skip link with a 3 px designed outline;
  Enter moved focus to main. The next Tab reached the primary demo action, and
  Enter opened the sample.
- The 390 px landing and demo had no horizontal overflow. Required touch areas
  use 44 px controls or 44 px wrapping labels; the full live suite passed its
  touch-target assertions.
- The live suite passed all routes at 200% text sizing.
- With reduced motion, media matching was active, scroll behavior was `auto`,
  the hero entrance was absent, and control transition duration was `0s`.
- No console errors, page errors, CSP violations, or request failures appeared
  in the independent flows.

## Privacy, headers, PWA, and routing

- A cold landing made four same-origin GETs: HTML, hashed JS, hashed CSS, and
  hero art.
- The demo-to-real import, settings, clipboard, print, and reload flow made
  seven requests, all same-origin GETs. It made zero external requests and zero
  write requests. CSV/report data stayed in browser storage.
- The demo wording path and the fixture-backed real wording path passed both
  locally and live. The demo made no gateway call. No factory Sociobot key was
  present, so a paid live inference was not invoked.
- Response headers include HSTS, `nosniff`, strict-origin referrer policy, and a
  response CSP restricted to self plus `api.sociobot.in` for explicit model and
  license calls.
- HTML and `sw.js` use 30-second revalidation. Hashed JS/CSS use one-year
  immutable caching. The hero uses five-minute revalidation.
- After a fresh online `/demo` load, the service worker was activated and
  controlling the page. `registration.update()` left no waiting/installing
  worker and one cache, `worklog-appendix-5c1a37f6fa1e`. Offline reload retained
  the banner and all ten rows.
- `/`, `/demo`, `/workspace`, `/privacy`, `/terms`, `robots.txt`, and
  `sitemap.xml` return 200. An unknown path returns the styled candidate 404
  body with HTTP 404. All normal internal links resolved; the 404 skip link is
  an in-document fragment on the current 404 response.

## Paid flow and request allowance

- The live buy link returned HTTP 303 to `checkout.dodopayments.com`.
- The hosted page returned 200 and displayed **Worklog Appendix**, **$19.00**,
  and **One-time unlock**. No payment was attempted.
- The deterministic browser tests passed purchase-return token removal,
  token-only verification, paste-to-restore, paid preset save/apply, daily
  verification caching, token removal, refund/revocation, and free export.
- A fresh 45-request burst from one client to the product verification endpoint
  produced 30 HTTP 200 responses and 15 HTTP 429 responses. Every limited
  response carried `Retry-After: 4` and `X-RateLimit-After: 4`. The observed
  allowance is 30 requests per short window. A 200 response exposed product-
  origin CORS and only `{valid:false, reason:"invalid", expires_at:null}`.

There is no sign-in, product backend, server-side product datastore, library,
or CLI. Entra identity, backend concurrency/persistence, and clean-consumer
package checks do not apply.

## Performance and payload

Fresh Lighthouse 13.0.1 mobile runs:

| Route | Performance | Accessibility | Best practices | SEO | LCP | TBT | CLS |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| `/` | 99 | 100 | 100 | 100 | 1.3 s | 110 ms | 0 |
| `/demo` | 100 | 100 | 100 | 100 | 1.1 s | 90 ms | 0 |

Payload budgets pass: JavaScript 34,947 B raw / 12,283 B gzip; CSS 16,107 B
raw / 4,389 B gzip; hero WebP 61,526 B; no font files. The cold landing
transferred 78 KiB in Lighthouse. Evidence JSON is in
`verification-9-evidence/lighthouse-landing.json` and
`lighthouse-demo.json`.

## Deployment identity

Fresh `dist/` bytes match production exactly:

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
| `sw.js` | `cd9bbe0744ba9b217d91032ad25a46634d5242912f9ae107fa80e7d6f8c77256` |
| `hero.webp` | `31eba852f18fdf89135007826fba6098ad8cb75779af3a86bcd94e21269e4b68` |
| `social.webp` | `5c76fec6d647285fe433b510b4b62338e35acff0d693d5d7ba9064622e88ec4a` |

This establishes that the live deployment is the tested candidate, not merely
that it resembles the local build.

## Defects by severity

### High / release blocker — quantitative sample claim is unlisted

The live landing page and `.factory/demo.md` state exact sample counts, but
`.factory/claims.json` has no matching claim/test. Add a manifest claim with one
uniquely tagged demo-entry test that asserts the advertised sample shape, or
remove the quantitative wording and keep a non-quantitative action outcome.
Then rerun every claim command and the full live suite.

No other critical, high, medium, or low product defect was found.

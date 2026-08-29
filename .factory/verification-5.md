# Independent verification 5 — FAIL

- **Candidate:** `36f233e65b03e27673b4097611a15448f2867440`
- **Live URL:** https://worklog-appendix.sociobot.in
- **Verified:** 2026-08-29 UTC
- **Decision:** **FAIL — release blocked by an unlisted user-facing claim.**

## First read

A cold, clean browser visit to `/` rendered the headline **“Explain billed work
clearly”**, followed by **“For freelancers whose clients need a clear account
before they approve invoice hours.”** The first action is the visible, keyboard
operable **“Try it with sample data”** button, with the outcome stated beside it:
**“See a ready-to-print appendix.”** The three facts are also plain: CSV stays
in the browser, no account/upload, and free core export. The one-click action
opened `/demo` and showed the persistent sample-data/reset/start-for-real
banner. This portion passes the plain-words and demo first-read requirements.

## Release-blocking finding

### High — unlisted claims in visitor copy

The acceptance contract says that any claim-like sentence not represented in
`.factory/claims.json` is an **“unlisted claim” finding that fails the review**.
The landing and workspace copy make these user-reliant promises without a
corresponding claim id and single `@claim:` sandbox test:

1. `/demo` and `/workspace`: **“Only included rows appear in the report.”**
   This is a material reporting/filtering promise. There is no claim entry for
   inclusion filtering. An untagged browser test exercises an empty selection,
   but that is not the required, named observable claim test.
2. `/`: **“Worklog Appendix does not run timers, invoice clients, or monitor
   anyone.”** This is a product-boundary promise that a visitor can rely on and
   likewise has no claim entry/test.

Fix by adding narrowly observable, one-to-one `@claim:` tests and entries (for
example, deselect a sample row and prove it is absent from preview, invoice
lines, and print output), or remove/rephrase the promises so they do not claim
behavior. Until then, this candidate cannot pass under the supplied claims
contract.

## Clean-checkout quality gates

`npm ci` completed successfully (60 packages; 0 vulnerabilities).

| Check | Result | Evidence |
| --- | --- | --- |
| Every command in `.factory/claims.json` | PASS | All 11 were run separately from clean browser state; each selected exactly one passing `@claim:` test. |
| `npm test` | PASS | 9 Vitest tests and 31 Playwright tests passed. |
| `npm run lint` | PASS | `tsc --noEmit` passed. |
| `npm run build` | PASS | Vite built `dist/`; JS 20,261 B (7,936 B gzip), CSS 13,600 B (3,958 B gzip). |
| `verify-url.sh` live `/` and `/demo` | PASS | HTTPS 200, route titles, `lang=en`, one h1, main landmark, no missing image alt, and no console/page errors. |
| Lighthouse 13.4.1 live `/demo`, mobile | PASS | Performance 100, Accessibility 100, Best Practices 100, SEO 100; FCP/LCP 1.3 s, TBT 60 ms, CLS 0. |

### Claims matrix

All commands below were run individually after `npm ci`. The transient
connection refusal observed while an accidentally overlapping batch was still
running was rerun with no existing server and passed; it is not a product
failure.

| Claim id | Exact command | Result |
| --- | --- | --- |
| `csv-import` | `npm test -- --grep @claim:csv-import` | PASS |
| `invoice-lines` | `npm test -- --grep @claim:invoice-lines` | PASS |
| `pdf-appendix` | `npm test -- --grep @claim:pdf-appendix` | PASS |
| `redaction` | `npm test -- --grep @claim:redaction` | PASS |
| `milestone-edit` | `npm test -- --grep @claim:milestone-edit` | PASS |
| `real-workspace-persistence` | `npm test -- --grep @claim:real-workspace-persistence` | PASS |
| `demo-reset-isolation` | `npm test -- --grep @claim:demo-reset-isolation` | PASS |
| `offline-demo` | `npm test -- --grep @claim:offline-demo` | PASS |
| `local-only` | `npm test -- --grep @claim:local-only` | PASS |
| `free-core-export` | `npm test -- --grep @claim:free-core-export` | PASS |
| `internal-notes` | `npm test -- --grep @claim:internal-notes` | PASS |

## Product and live evidence

- Normal path: live sample opened and printed a popup headed **“Completed work
  for Northstar Studio”** with **“Total approved work: 19 hours.”**
- Input boundary/recovery: live `/workspace` rejected `Hours=-1` with the
  recovery instruction to use a zero or positive number, then accepted `.5`
  and displayed `0.5 h`.
- Desktop and 390 px mobile: no horizontal overflow. Keyboard Tab order reaches
  skip link, wordmark, navigation, and sample button; Enter on that button
  opens `/demo`. Focus is visible (3 px solid outline) in light and dark mode.
- Reduced-motion browser context, desktop, mobile, and dark-mode checks ran
  without console/page errors. Axe found zero serious/critical violations on
  `/`, `/demo`, `/workspace`, `/privacy`, `/terms`, and the styled 404.
- Privacy: a cold landing/demo flow requested only the product origin (HTML,
  JS, CSS, and hero asset); no external request, upload, tracker, account, or
  server-side endpoint was observed. Static product has no API/sign-in/payment
  endpoint, so 429/Retry-After and Entra checks are not applicable.
- PWA: after a first `/demo` load, the page was service-worker controlled with
  cache `worklog-appendix-29153fcc0d9d`; offline reload retained Northstar
  sample data. `registration.update()` completed with an active worker and no
  waiting/installation error.
- Headers: live pages send HSTS, `X-Content-Type-Options: nosniff`,
  `Referrer-Policy: strict-origin-when-cross-origin`, and a self-only CSP.
  HTML uses `max-age=30`; hash-named JS/CSS use one-year immutable caching.
- Routes `/`, `/demo`, `/workspace`, `/privacy`, and `/terms` return 200;
  an unknown route returns the styled 404 with HTTP 404.
- Deployment identity: fresh `dist/index.html`, JS, and CSS SHA-256 values
  exactly equal the live assets:
  `0b530b812861624f95c7212a79e900c65f2a6b7a59f07cec1eb777231f2e8c7d`,
  `05eaa315b02bb1bd19aefde78c65e79e27be086384e3a4a5627f2ac55cf2c3ef`, and
  `5f7df814e37674e0cff89cf863c25c131c4922187130fdea7e5a178ecdb2ff11`.

## Artifacts

This verifier run retained screenshots and `verify-url.sh` evidence under
`/tmp/worklog-verify-live/`, live screenshots under `/tmp/worklog-live-*.png`,
and the Lighthouse JSON at `/tmp/worklog-lighthouse-live.json` for the current
container lifetime.

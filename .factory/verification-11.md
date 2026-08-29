# Independent verification 11 — PASS

- **Candidate:** `df18282526dd908a79ed9d6755f385d90d2559c4`
- **Live URL:** <https://worklog-appendix.sociobot.in>
- **Verified:** 2026-08-29 UTC
- **Scope:** clean-checkout, independent static-web QA against the supplied work order and researched brief. No product code was modified.

## Decision

**PASS — release-ready.** The fresh deployment is byte-for-byte the candidate's
fresh production build for every route, worker, hashed bundle, and shipped
image checked. The earlier deployment-only concern did not reproduce.

## Mandatory cold first-read and demo gate

**PASS.** A cold live landing page states all three required points in its
first screen, in plain words:

- It does: **“Turn worklogs into invoice appendices.”**
- It is for: **“freelancers who need to show clients what each invoice hour covered.”**
- First action: **“Try it with sample data”**, followed by **“Open a ten-row sample appendix.”**

The same screen gives the three material facts: CSV stays in the browser, no
account or upload is needed, and core export stays free. One click opened
`/?demo=1`; it showed the persistent **“Demo — sample data, nothing is
saved”** banner, Reset demo and Start for real controls, 10 source rows, four
approved milestone groups, and one unchecked pending row. Demo storage was
empty. This satisfies the isolated one-click sandbox requirement.

## Claims gate

`.factory/claims.json` exists and declares 20 claims. After `npm ci`, every
listed `npm test -- --grep @claim:<id>` command was invoked from this clean
candidate checkout against its shipped demo entry point. Each passed; the
final Playwright run record is `{"status":"passed","failedTests":[]}`.

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
| static-build-output | PASS |

The live page, public routes, README, demo documentation, Terms, and Privacy
copy were cross-checked against the manifest. No visitor-reliant unlisted
claim was found.

## Local quality gates

- `git rev-parse HEAD` was the specified candidate and the initial worktree
  was clean.
- `npm ci`: PASS — 60 packages installed, audit found 0 vulnerabilities.
- `npm test`: PASS — 12/12 Vitest unit tests and 47/47 Playwright browser
  tests.
- `npm run lint`: PASS (`tsc --noEmit`).
- `npm run build`: PASS. `dist/` contains the five route documents, styled
  404, metadata/public files, service worker, and hashed bundles.
- Payload budgets pass: JS 36,555 B raw / 12,663 B gzip; CSS 16,158 B raw /
  4,391 B gzip; hero WebP 61,526 B.

## Independent product, privacy, accessibility, and PWA checks

A fresh live browser flow started with the one-click demo, then chose Start
for real. It rejected `Hours=abc` with a row-specific correction and no
import; a following quoted CSV row with `1.25` hours imported successfully.
The matching invoice line read `Delivery — 1.25 hours`. The print-ready report
retained `2026-08-29`, replaced the email and phone with redaction markers,
and excluded the internal note. The imported row remained after reload.

The captured core flow made six same-origin GETs, no external request, and no
HTTP write. It emitted no console or page error. Independent Axe scans found
zero serious/critical findings in the live workspace and print report; the
complete 47-test live suite also passed all public routes in light and dark
treatments. The factory URL verifier passed `/` and `/demo` (HTTP 200, title,
`lang=en`, one h1, main landmark, no missing alt text, no unlabeled buttons,
and no console errors).

At 390 px, the checked landing/mobile controls passed no-overflow, skip-link,
focus, 44 px touch-target, and high-contrast focus tests. Screenshots are in
`verification-11-evidence/`. Reduced-motion, keyboard, history, 200% reflow,
and error/recovery paths are covered by the passing live suite.

The service worker controlled a fresh `/demo` visit. `registration.update()`
left an active `/sw.js` worker with no waiting or installing worker and one
release cache, `worklog-appendix-1389d1aa9dd5`. The independent live
`@claim:offline-demo` run passed after service-worker activation and offline
reload.

## Deployment identity, headers, and limits

Fresh SHA-256 comparisons all matched between `dist/` and production for
`index.html`, all four routed documents, `404.html`, `sw.js`, both hashed
bundles, hero art, and social art. `/`, `/demo`, `/workspace`, `/privacy`,
`/terms`, `robots.txt`, and `sitemap.xml` return 200; an unknown route returns
the styled HTTP 404.

Responses include HSTS, `X-Content-Type-Options: nosniff`, strict-origin
referrer policy, and a response CSP limited to self plus
`api.sociobot.in` for explicit wording/license actions. HTML and `sw.js`
revalidate after 30 seconds; hashed JS/CSS are one-year immutable; hero art is
five-minute revalidated. The external checkout link returned HTTP 303 to the
hosted Dodo checkout; no purchase was attempted.

The only product-server request path is optional license verification. A fresh
single-client burst to
`/api/v1/products/worklog-appendix/verify?license=qa-rate-limit-verification-11`
returned 30 HTTP 200 responses, then 5 HTTP 429 responses. The first 429 sent
`Retry-After: 3` and `X-RateLimit-After: 3`; observed allowance is **30
requests per short window**. There is no sign-in, product backend, server-side
product datastore, library, or CLI, so Entra, backend concurrency/health, and
consumer-install checks do not apply.

## Performance

Fresh mobile Lighthouse on the live landing: Performance 99, Accessibility
100, Best Practices 100, SEO 100; LCP 1.4 s, TBT 100 ms, CLS 0, transfer 78
KiB. The JSON report is in `verification-11-evidence/lighthouse-live.json`.

## Defects by severity

- Critical: none.
- High / release blocker: none.
- Medium: none.
- Low: none.

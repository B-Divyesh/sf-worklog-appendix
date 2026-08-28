# Independent verification 2 — FAIL

**Candidate:** `538fa46ae64b979b76304c46b5003ef090529f12`  
**Verified URL:** https://worklog-appendix.sociobot.in  
**Date:** 2026-08-28 UTC  
**Decision:** **FAIL — do not release**

This is a fresh independent verification from the stated candidate checkout.
No product code was modified.

## First-read test

Cold live landing, desktop Chromium, with no prior storage, says: **“Explain
billed work clearly.”** It says it is for freelancers whose clients need a
clear account before approving invoice hours, and the first primary action is
**“Try it with sample data”**, with the result stated beside it: “See a
ready-to-print appendix.” The one-click demo works. This acceptance check
passes.

## Required claims check

`.factory/claims.json` exists and declares six claims. After `npm ci`, every
listed command exited 0 from the clean candidate:

| Claim | Exact command | Command result | Contract result |
| --- | --- | --- | --- |
| csv-import | `npm test -- --grep @claim:csv-import` | pass | **FAIL**: test opens `/workspace`, not the required isolated `/demo` entry point. |
| invoice-lines | `npm test -- --grep @claim:invoice-lines` | pass | pass: `/demo`. |
| pdf-appendix | `npm test -- --grep @claim:pdf-appendix` | pass | pass: `/demo`. |
| redaction | `npm test -- --grep @claim:redaction` | pass | **FAIL**: it checks only an already-redacted sample email; it neither supplies/asserts a phone number nor changes the redaction option, although the public claim promises both email and phone removal. |
| offline-demo | `npm test -- --grep @claim:offline-demo` | pass | pass: `/demo`. |
| local-only | `npm test -- --grep @claim:local-only` | pass | **FAIL**: test opens `/workspace`, not `/demo`. |

The demo-sandbox and claims contracts require every claim to be proved from a
fresh context using only the demo entry point and shipped sample data. Passing
commands do not cure those three test-contract defects.

## Local quality gates

- `npm ci` completed; npm reported 0 vulnerabilities.
- `npm test` passed: 6 Vitest tests and 12 Chromium Playwright tests.
- `npm run lint` passed (`tsc --noEmit`).
- `npm run build` passed and created `dist/`.
- Production build sizes: JS 17,660 bytes (7,100 gzip), CSS 10,302 bytes
  (3,290 gzip), hero WebP 61,526 bytes. The JS/CSS/image budgets pass.
- The requested `verify-url.sh` is not present in this repository. Equivalent
  live checks for title, lang, main landmark, image alt text, and console/page
  errors were run directly with Chromium.

## Functional and browser evidence

- Valid quoted CSV and zero hours import. Invalid text (`abc`) and negative
  (`-2`) hours are rejected with row 2 and a recovery instruction. A following
  valid import succeeds.
- Demo produces four invoice lines totaling 19 approved hours, supports reset
  and transition to an empty real workspace, opens the print-ready appendix,
  and redacts independently supplied email and phone text. Turning redaction
  off restores the source text.
- Live desktop and 390px mobile had no console or page errors and no horizontal
  overflow (`scrollWidth` 390 at a 390px viewport).
- Playwright axe found no serious or critical violations on `/`, `/demo`,
  `/workspace`, `/privacy`, or `/terms`. Keyboard tabbing reaches the skip link
  first and showed a visible `rgb(255, 180, 74) solid 3px` focus ring on all
  sampled controls. Reduced-motion mode removes landing animations.
- After an online `/demo` visit, the live service worker controlled the page;
  an offline reload still rendered the demo banner and Northstar sample. The
  built and live service worker uses versioned cache
  `worklog-appendix-a45b8fca6c36` and retires earlier prefixed caches.
- Lighthouse mobile against live returned Performance **88** and Accessibility
  **100** (FCP 0.9 s, LCP 1.3 s, CLS 0, TBT 470 ms). Lighthouse wrote JSON but
  its Chrome tab crashed while finalising; the 88 result is below the required
  90 performance target and needs a stable rerun after remediation.

## Deployment, privacy, and response checks

- Live SHA-256 values exactly match this candidate's freshly built artifacts:
  `index-D0Sq49uR.js` `91486b766caf933159692e9d499533abafda225cca4c6572601073c5f8deca75`;
  `index-DVUUv9Rp.css` `f415fe5e7a103a698ad575ec4cce9f6f616d5a5af7ef9686d081e85139a8c2d4`;
  `hero.webp` `31eba852f18fdf89135007826fba6098ad8cb75779af3a86bcd94e21269e4b68`;
  `sw.js` `520b6ef9ae4e08a52f944561bb47ac5d55ed04b0677e7e214ba260d351f777b6`.
- Cold landing and demo requests were same-origin only. No third-party fonts,
  analytics, advertising, upload, authentication, or billing requests were
  observed. The product has no server-side or product-unlock endpoint, so a
  rate-limit burst and sign-in-tenant check are not applicable.
- Live headers include HSTS, `X-Content-Type-Options: nosniff`, strict-origin
  referrer policy, and a self-only CSP. HTML has 30-second revalidation;
  hashed JS/CSS are one-year immutable. `/missing-qa-20260828` returns the
  styled page with HTTP 404. All shipped/sitemap routes returned 200.

## Defects

### High — mandatory claim tests do not use the demo sandbox, and redaction proof is incomplete

`tests/browser.pw.ts` routes `@claim:csv-import` and `@claim:local-only` to
`/workspace`, contrary to the required demo-only claim sandbox. The
`@claim:redaction` fixture has only an email and asserts a pre-rendered sample
string; it does not prove the claimed phone redaction or user-controlled
redaction action. Correct the tests to enter `/demo` from a fresh context and
assert the full observable outcomes. This is a release blocker under the
claims and demo-sandbox contracts.

### High — mobile touch targets fail the mandatory 44px baseline

At 390px on the live candidate, **Reset demo** and **Start for real** measure
95.7 x 23.8px and 101.4 x 23.8px. Footer Privacy and Terms links measure
47.5 x 15px and 38.6 x 15px. Row include checkboxes measure 18 x 18px and
milestone selects are 35px high. The accessibility and design acceptance
contract requires touch/click targets of at least 44 x 44 CSS px. This is a
release blocker even though axe does not flag it.

### Medium — direct legal/demo routes have landing-page canonical metadata

`/privacy`, `/terms`, and `/demo` are SPA rewrites to `index.html`. The
returned document retains `<link rel="canonical"
href="https://worklog-appendix.sociobot.in/">` and the landing title until
JavaScript runs. The router later changes `document.title` but never updates
the canonical. This violates the required per-route title/canonical metadata
and gives non-JS crawlers the wrong route metadata.

### Medium — live Lighthouse mobile performance quality gate is below target

The independent live run produced 88 Performance against the required 90.
The audit's late Chrome crash makes the measurement less robust, but it is not
passing evidence. Re-run on a stable browser after reducing the measured TBT
or document an accepted deterministic measurement.

## Required release criteria not met

The candidate is functionally close and the previously reported deployment,
contrast, input-validation, 404, and service-worker issues are repaired.
However, the mandatory claims/demo proof, 44px mobile target baseline,
per-route metadata, and mobile performance gate remain unmet. **FAIL.**

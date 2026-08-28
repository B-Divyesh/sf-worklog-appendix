# Independent verification — FAIL

**Candidate:** `1e294bfe2c71da34798e90f176668c718c37574d` (`main`)

**Live URL:** https://worklog-appendix.sociobot.in

**Verified:** 2026-08-28 UTC

## Verdict

**FAIL — do not release this candidate.** The live deployment is the tested
candidate (the deployed JS, CSS, and hero WebP SHA-256 values exactly match the
fresh `dist/` build), but it has release-blocking accessibility, input-integrity,
claims-contract, and paid-flow defects.

## First-read and demo result

Cold live load, with an empty browser profile, answered all three required
questions plainly:

- **What:** “Explain billed work clearly.”
- **For whom:** “For freelancers whose clients need a clear account before they
  approve invoice hours.”
- **What to click first:** the visible **Try it with sample data** button, with
  “See a ready-to-print appendix.” beside it.

One click opened `/demo`, showed the required “Demo — sample data, nothing is
saved” banner, a Northstar Studio report, Reset demo, and Start for real. The
demo requirement therefore passes.

## Required claims tests

Fresh clone setup: `npm ci`. Each exact command in `.factory/claims.json` was
run against the shipped Playwright demo entry point. The final clean full test
run exercised all five successfully.

| Claim ID | Command | Result | Observable evidence |
|---|---|---|---|
| `csv-import` | `npm test -- --grep @claim:csv-import` | PASS | Imports one CSV row into the workspace. |
| `invoice-lines` | `npm test -- --grep @claim:invoice-lines` | PASS | Demo has four matching milestone invoice lines. |
| `pdf-appendix` | `npm test -- --grep @claim:pdf-appendix` | PASS | Print popup has the Northstar heading and 19 approved hours. |
| `redaction` | `npm test -- --grep @claim:redaction` | PASS | Demo removes the sample email from its internal-note display. |
| `offline-demo` | `npm test -- --grep @claim:offline-demo` | PASS | Demo reset succeeds with network disabled and no external request. |

Claims contract failure: the live/README privacy promises (“Your CSV stays in
this browser”, “No account or upload”, “does not upload CSV files”, and “no
analytics or advertising tracker”) have no matching claim entries. The
`offline-demo` test is not a listed test of those promises. This violates the
claims acceptance contract even though the observed demo network flow was
same-origin only.

## Local build and automated checks

- `npm run build`: **PASS**. TypeScript check and Vite production build passed;
  `dist/` was created.
- `npm test`: **FAIL**. Vitest: 5/5 passed. Browser claims: 5/5 passed. The
  sixth browser test failed because axe found a serious `color-contrast`
  violation on `.doc-label` and `.mini-report .total` (foreground `#087e8b` on
  computed `#c1c6cc`, ratio **2.79:1**, required **4.5:1**).
- Independent live `@axe-core/playwright` scan reproduced that one serious
  violation on those same two nodes. No critical violations were reported.
- Lighthouse mobile live audit: Performance **96**, Accessibility **96**, FCP
  0.9 s, LCP 1.4 s, CLS 0, TBT 230 ms. The audit process crashed while
  collecting its final screenshot after it wrote the JSON; the reported scores
  and metrics were available in that JSON. Axe is the decisive accessibility
  result.
- Production sizes: JS 19,926 bytes (7,820 gzip), CSS 10,191 bytes (3,260
  gzip), hero WebP 61,526 bytes. These are within the stated static budgets.

## End-to-end and browser checks

- Valid quoted CSV imports; a missing Description column announces “Add
  Description and Hours columns, then import the file again.” A following
  valid import recovers correctly.
- **Input-integrity failure:** `Description,Hours\nTask,abc` imports as `0 h`.
  `Description,Hours\nTask,-2` imports as **`2 h`**. A malformed or negative
  value must be rejected; silently turning `-2` into billable `2` can create an
  incorrect client invoice.
- Demo invoice summary, redaction, copyable invoice lines, browser print popup,
  Reset demo, and Start for real all worked.
- Desktop and 390 px mobile load without console/page errors. Mobile has a
  minor 2 px horizontal overflow (392 px document width at a 390 px viewport).
- Keyboard smoke test: the first Tab reaches a visible 3 px focus ring on Skip
  to main content; its target is 198.6 × 48.8 px. Controls used in the demo
  were keyboard-reachable. Reduced-motion mode removes the landing animation.
- After a first online load, the service worker controls `/demo`; an offline
  reload successfully shows the sample report and demo banner.
- Service-worker update defect: `public/sw.js` uses a fixed
  `worklog-appendix-v1` cache and cache-first navigation. A product-only asset
  deployment that does not also change `sw.js` will not install a new worker,
  leaving cached HTML/assets indefinitely stale. The required update behavior
  is not reliably provided.

## Privacy, deployment, headers, and rate limiting

- Cold landing network activity was limited to the live origin: HTML, hashed
  JS, CSS, and self-hosted hero image. No analytics, fonts, or other third
  parties were requested.
- Live headers include HSTS, `X-Content-Type-Options: nosniff`, strict-origin
  referrer policy, and a CSP limited to self plus the Sociobot verification
  origin. Hashed assets are `max-age=31536000, immutable`; HTML is `max-age=30`.
- The license verification endpoint allows the live origin by CORS and returns
  `Cache-Control: no-store`.
- Rate-limit check: 40 parallel invalid-license verification requests returned
  30 × 200 and 10 × 429. Each 429 had `Retry-After: 3`; observed threshold was
  approximately 30 requests in the burst.
- Deployment match: SHA-256 of live
  `index-B-kp3A5m.js`, `index-DHep3vcO.css`, and `hero.webp` exactly equals the
  candidate’s freshly built assets.

## Defects

### High — accessibility release blocker

Serious axe contrast violations in the landing invoice preview. The repository
test that claims no serious/critical axe violations fails for this reason.

### High — invoice totals can be changed by invalid CSV hours

`parseWorklogCsv` strips non-numeric characters before parsing. This converts
`abc` to zero and `-2` to `2`, then marks the row approved and includes it in
the client report. Reject non-finite, negative, and otherwise invalid numeric
inputs with the row number and a recovery instruction.

### High — claims contract failure

Several relied-on privacy/no-upload/no-tracking claims appear on the live page
and README without a corresponding `.factory/claims.json` entry and sandbox
test. The supplied offline test does not prove those broader promises.

### High — broken paid action and no delivered Pro feature

The live “Buy Pro for $19” link GETs
`https://api.sociobot.in/api/v1/products/worklog-appendix/checkout`, which
returns **404** with `{"error":"enabled factory product","status":404}`.
Further, the handoff admits presets are not surfaced and the product has no
feature gated/unlocked by the saved license. Do not solicit payment until a
registered checkout and a real, described unlock both work; otherwise remove
the paid offer.

### Medium — live missing paths are not a real 404

`/missing-qaverify-20260828` returns HTTP **200** and renders the landing page,
despite a styled `404.html` existing. A missing page must return its styled 404
with status 404.

### Medium — offline update reliability

The fixed service-worker cache name and cache-first shell can retain an old
release after an asset-only deploy. Version the cache/precache manifest and
retire old cache names during activation.

### Low — 390 px horizontal overflow

The live landing document is 392 px wide at a 390 px viewport. Eliminate the
2 px horizontal scroll.

## Required release criteria not met

The candidate does not meet the required `npm test`/axe quality gate, contrast
baseline, claims coverage rule, valid-input/recovery behavior, paid-unlock
contract, or real-404 behavior. It remains **FAIL**.

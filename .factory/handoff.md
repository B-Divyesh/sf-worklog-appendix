# Worklog Appendix handoff

## Release status: FAIL — independent verification 2

Repair of verifier candidate `1e294bfe2c71da34798e90f176668c718c37574d`.
The artifact remains a Vite + TypeScript static site for Azure Static Web Apps,
with `dist/` as its deployable root.

## Repairs

- Fixed the landing preview contrast: its translucent-sheet labels now use
  `#005a63`; the axe scan reports no serious or critical violations.
- Made CSV Hours strict, finite, and non-negative. `abc`, `-2`, empty values,
  and values such as `2 hours` now fail with the row number and the recovery
  instruction: “Use a zero or positive number, then import the file again.”
  Unit and browser tests cover invalid input and a following successful import.
- Added the `local-only` claim and browser evidence: a fresh workspace imports
  a CSV, stores it locally, and makes no off-origin request. It covers the
  CSV/local storage, no account/upload, and no analytics/advertising wording
  on the landing page, Privacy page, and README.
- Removed the unregistered $19 Pro offer and inactive license code. The product
  now describes only the delivered free feature set, so it does not solicit a
  payment it cannot fulfil.
- Replaced broad SPA fallback with explicit rewrites for `/demo`, `/privacy`,
  `/terms`, and `/workspace`. Unknown paths now reach the styled `404.html`
  with HTTP 404. Local Static Web Apps emulator evidence: `/demo` → 200;
  `/missing-qaverify` → 404.
- Versioned the service-worker cache from the production artifact hash, remove
  prior Worklog Appendix caches on activation, and use network-first navigation
  so updated HTML is not held by an older cache. A production-artifact test
  verifies the generated cache version and cleanup logic.
- Kept the decorative report frame inside the 390px viewport; the mobile
  regression test asserts `scrollWidth <= 390`.

## Verification

Run from a clean checkout:

```sh
npm ci
npm run lint
npm test
npm run build
```

Performed 2026-08-28 UTC:

- `npm ci`: completed; 0 vulnerabilities reported.
- `npm run lint`: passed (`tsc --noEmit`).
- `npm test`: passed: 6 Vitest tests and 12 Chromium Playwright tests.
  Coverage includes desktop, 390px mobile, keyboard skip-link operation,
  console errors, axe, invalid-import recovery, print, redaction, offline demo,
  cache-version generation, and Static Web Apps route policy.
- Every documented claim command passed individually: `csv-import`,
  `invoice-lines`, `pdf-appendix`, `redaction`, `offline-demo`, and
  `local-only`.
- `npm run build`: passed and produced `dist/index.html`. Production output:
  17.66 KB JavaScript (7.10 KB gzip), 10.30 KB CSS (3.29 KB gzip), and 61.5 KB
  hero WebP.
- Playwright axe integration: 0 serious/critical violations.
- Lighthouse against the local Static Web Apps emulator: Performance 100,
  Accessibility 100, FCP 1.2 s, LCP 1.6 s, CLS 0, TBT 30 ms.

## Deployment

Deploy the built artifact with:

```sh
/opt/fleet/lib/deploy-static.sh worklog-appendix dist
```

Deployed 2026-08-28 UTC with deployment ID
`6062da25-a09e-422c-ae35-a10a77414269` to
`https://worklog-appendix.sociobot.in`. Live evidence: `/demo` returned 200;
`/missing-qaverify-20260828` returned the styled page with 404; the live CSP
has `connect-src 'self'`; and live JS, CSS, and hero-WebP SHA-256 values match
the files in `dist/`. A 390px live Chromium check found one h1, `lang="en"`,
title `Worklog Appendix — Explain billed work clearly`, zero console errors,
zero serious/critical axe findings, and `scrollWidth` 390. It also opened the
demo banner successfully.

## Independent verifier update — 2026-08-28 UTC

Candidate `538fa46ae64b979b76304c46b5003ef090529f12` was independently tested
against https://worklog-appendix.sociobot.in. The live assets exactly match the
fresh candidate build, and the core local-first CSV/demo/PDF flow works.

**Do not release.** See `.factory/verification-2.md` for exact commands and
evidence. Release blockers are: (1) `csv-import` and `local-only` claim tests
exercise `/workspace` rather than the mandatory `/demo` sandbox, while the
redaction claim does not prove phone redaction or the option action; and (2)
multiple mobile controls are below the mandatory 44 x 44px touch target
baseline (the demo banner controls are 23.8px high). Direct legal/demo route
metadata also keeps the landing canonical, and the fresh live Lighthouse
mobile result was 88 Performance (target at least 90; audit finalisation
crashed after emitting JSON).

The product has no paid tier; all delivered features are free and local-first.

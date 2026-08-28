# Worklog Appendix handoff

## Release status: READY

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

No known product gaps remain. The product has no paid tier; all shipped
features are free and local-first.

# Worklog Appendix repair handoff

## Status

Release-blocking findings from independent verification candidate
`3073c5c3e4d07397e2edfb6ef1b1734084ee025d` are repaired. The source repair
commit is `a87da936cb56bb3eeffac41067ec5dcffc4cbe8a`; the final
documentation/deployment commit follows it.

## What changed

- Dark mode now keeps the landing result section and document labels readable,
  and uses an amber focus ring with at least 3:1 contrast on dark surfaces.
- Every SPA render derives demo mode from the current URL. Moving from a real
  workspace to `/demo` resets to the bundled Northstar sample and shows the
  demo banner; real workspace storage is not shown in demo mode.
- Claim coverage is complete: quoted import hours, all four invoice lines,
  printing, redaction, offline demo, local-only storage/network behavior, free
  export, and internal-note exclusion each have one exact tagged browser test.
- CSV validation now rejects blank descriptions, accepts `.5` as 0.5 hours,
  and gives row-specific recovery text. Invalid saved workspace JSON or shapes
  are removed and recover to an importable blank workspace.
- SPA navigation now focuses and announces the destination heading. The skip
  link focuses main content. Reduced-motion mode disables scrolling and control
  transitions. The two text actions reported on mobile have 44px targets.
- Added the missing workspace sitemap entry, complete Twitter card metadata,
  a derived 1200×630 original social image, clear shared-shell 404 copy, and a
  short revalidating cache policy for un-hashed WebP art.

## Verification

- Clean install: `npm ci` — PASS, 60 packages, 0 vulnerabilities.
- Unit + browser integration: `npm test` — PASS: 8 Vitest tests and 24
  Playwright Chromium tests.
- Exact claim commands — all PASS:
  `@claim:csv-import`, `@claim:invoice-lines`, `@claim:pdf-appendix`,
  `@claim:redaction`, `@claim:offline-demo`, `@claim:local-only`,
  `@claim:free-core-export`, and `@claim:internal-notes`.
- Type check: `npm run lint` — PASS.
- Production build: `npm run build` — PASS; `dist/` contains its root
  `index.html`. Main JS is 19.27 KB (7.65 KB gzip), CSS 12.48 KB (3.75 KB
  gzip), hero 61.5 KB, and social image 50.8 KB.
- Browser checks included desktop and 390px mobile, keyboard skip/import,
  light and dark axe scans, route focus/announcement, reduced motion, hostile
  CSV text, offline demo reload, and service-worker stale-cache cleanup. All
  pass in the shipped Playwright suite. Request recording in the local-only
  claim observed no external origin.
- Local mobile Lighthouse `/demo` (2026-08-29): Performance 99,
  Accessibility 100, Best Practices 100, SEO 100; FCP 1.0 s, LCP 1.1 s,
  CLS 0, TBT 100 ms. Lighthouse wrote its JSON to
  `/tmp/worklog-appendix-lighthouse.json`; Chrome crashed only while capturing
  its final screenshot, after writing the complete scores.

## Deployment

The production deployment and live response/artifact checks are recorded after
the final commit and deploy command complete.

## Known scope note

The shipped candidate has no paid offer or checkout. The prior broken purchase
link remains absent; all existing core features continue to be free. A paid
offer must not be reintroduced until the factory registers a checkout product
and a genuine non-core unlock is defined.

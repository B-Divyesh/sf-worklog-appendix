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

Deployed with `/opt/fleet/lib/deploy-static.sh worklog-appendix dist` on
2026-08-29 UTC. Azure Static Web Apps deployment
`34723dd4-2a1e-480e-9a79-a71b979fd95b` succeeded; the custom domain
`https://worklog-appendix.sociobot.in` returned HTTPS 200.

Live verification: root returns 200 with self-only CSP, HSTS, nosniff, and
strict-origin referrer policy; an unknown path returns the styled 404 with HTTP
404; `hero.webp` now has `max-age=300, must-revalidate`. Live SHA-256 values
exactly match `dist/`: index `36935bd9277814dc4e334aff6973a71ec1178f586e3311ef5d7300fd58585c32`,
JS `577b91b24d645adaa0671d16e60c1b0fd8b6ddffd029f45cefdb3a6d99b7b8dd`,
CSS `90f1fc09c9aa852d973961efde50705835f10e1afa90ebd56f8d63387ccd4bdb`,
hero `31eba852f18fdf89135007826fba6098ad8cb75779af3a86bcd94e21269e4b68`,
and worker `e964224e50c88bb4a5a3af3230d662c8c83b252573c33c57fefdf68549852d8d`.

Live Playwright check at desktop and 390px `/demo`: correct demo title/banner,
390px scroll width, zero external requests, zero console errors, and zero
serious/critical axe findings in both light and dark landing treatments.

## Known scope note

The shipped candidate has no paid offer or checkout. The prior broken purchase
link remains absent; all existing core features continue to be free. A paid
offer must not be reintroduced until the factory registers a checkout product
and a genuine non-core unlock is defined.

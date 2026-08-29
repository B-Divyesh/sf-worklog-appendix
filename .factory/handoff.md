# Worklog Appendix independent verification handoff

## Status

**FAIL — candidate `2df1588c2f4bbaf8ede3ad55ad29961d58596519`
must not be released.** Verified on 2026-08-29 against
https://worklog-appendix.sociobot.in. The live site is an exact byte match for
the candidate, so this is not a deployment-only failure.

Full evidence and defect details are in `.factory/verification-4.md`.

## Release blocker

The default **Remove email and phone detail** option treats ISO dates as phone
numbers. In both the local production build and the live sample, all nine work
dates print as `[phone removed]`. Turning redaction off restores the dates.
This breaks the brief's core dated drill-down appendix.

The claims contract also omits or incompletely proves relied-on promises about
date preservation, milestone editing, real-workspace persistence, and demo
reset/isolation.

## Other defects

- Row and milestone changes rerender the workspace and move keyboard focus to
  `BODY`.
- At 200% text size on 390 px, routes widen to 504–604 px and header navigation
  is clipped or moved off-screen.
- A whitespace-only group name creates a blank invoice line. Excluding every
  row still permits a zero-row printout.
- Axe reports a minor invalid `role="status"` on the interactive demo banner.
- The one-time paid model from the brief remains intentionally absent; there is
  no registered checkout or genuine non-core paid feature.

## Verification completed

- `npm ci` — PASS, 60 packages, 0 vulnerabilities.
- All eight exact `.factory/claims.json` commands — PASS individually.
- `npm test` — PASS, 8 unit tests and 24 browser tests.
- `npm run lint` — PASS.
- `npm run build` — PASS; `dist/` produced.
- First-read and one-click sample gate — PASS at desktop and 390 px.
- Live privacy request log — PASS: same-origin GET only, no uploads, external
  requests, console errors, or page errors.
- Live axe light/dark scans — zero serious/critical findings.
- Live offline reload and stale service-worker cache cleanup — PASS.
- Lighthouse 13.4.1 mobile `/demo` — 100/100/100/100; LCP 1.1 s, TBT 80 ms,
  CLS 0.
- Headers, caching, routes, 404, metadata, bundle budgets, and links checked.
- Candidate/live hashes match for all HTML entry points, JS, CSS, hero, social
  image, and service worker.

## Reproduce the blocker

1. Open `https://worklog-appendix.sociobot.in/demo` in a fresh browser.
2. Leave **Remove email and phone detail** checked.
3. Choose **Print appendix / save PDF**.
4. Inspect the Date column: each sample ISO date is `[phone removed]`.
5. Close the print view, uncheck redaction, and print again. The dates return.

## Next repair

Narrow phone redaction so it cannot match common dates and add a tagged claim
test that asserts email/phone removal while preserving ISO and localized dates.
Complete the missing claims, preserve focus after edits, validate group names
and nonempty export selection, and repair 200% text resizing. Rebuild and deploy
before requesting verification 5.

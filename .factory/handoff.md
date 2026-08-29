# Worklog Appendix verification handoff

## Release status: FAIL

Candidate `3073c5c3e4d07397e2edfb6ef1b1734084ee025d` was independently verified on
2026-08-29 UTC at https://worklog-appendix.sociobot.in. The live HTML, JS, CSS,
hero image, and service worker exactly match the candidate. No product code was
modified during verification.

Do not release this candidate. See [verification-3.md](verification-3.md) for
the complete evidence and reproduction details.

## Release blockers

1. `npm test` fails: 7/7 Vitest tests pass, but Playwright finishes 16/17
   because dark-mode axe reports serious contrast failures. The dark landing
   preview also renders key content effectively white on white.
2. From a real workspace, the header Demo link changes the URL to `/demo` but
   keeps real client data visible, shows no demo banner, and retains the
   Workspace title. This violates demo-sandbox isolation.
3. The claim suite does not fully prove CSV hours or every milestone invoice
   line, and the free-export and internal-note-exclusion claims are absent from
   `.factory/claims.json`.

## Verification summary

- First-read and one-click sample gate: PASS.
- `npm ci`: PASS, 0 vulnerabilities.
- All six exact installed claim commands: PASS, with the coverage defects
  documented above.
- `npm run lint`: PASS.
- `npm run build`: PASS and produced `dist/`.
- `npm test`: **FAIL**.
- Normal CSV import, grouping, redaction, invoice-line copy, print, persistence,
  reset, popup-block recovery, offline reload, and stale-cache cleanup: PASS.
- Fresh demo flow made only same-origin GET requests; no API, sign-in, billing,
  analytics, upload, or tracker exists. Rate-limit and Entra checks are N/A.
- Mobile Lighthouse `/demo`: 100 Performance, 100 Accessibility, 100 Best
  Practices, 100 SEO; LCP 1.3 s, TBT 0 ms, CLS 0.
- Bundles: JS 17,888 B, CSS 11,892 B, hero 61,526 B; all within budget.

## Required next work

Fix dark theme and focus contrast; derive demo mode from each route transition
and add a real-data isolation regression; complete the claim registry/tests;
then address route focus/announcements, touch targets, reduced motion, input and
saved-state validation, non-hashed immutable caching, and metadata gaps. Rerun
all claim commands, `npm test`, lint, build, live request/header checks, axe in
both themes, mobile Lighthouse, offline update/reload, and deployment hashes.
Also decide and document whether the brief's one-time monetization requirement
is intentionally being dropped before release.

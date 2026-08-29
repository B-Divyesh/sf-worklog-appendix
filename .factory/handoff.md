# Worklog Appendix polish 1 handoff

## Status

**PASS — deployed with no known product or review gaps.**

All 10 findings in `.factory/review-1.md`, including every minor item and reopened historical defect, are resolved. `.factory/polish-1.md` maps every `F-*` and historical `H-*` identifier to its implementation and evidence.

Live product: <https://worklog-appendix.sociobot.in>

## What changed

- Rewrote the first screen around the job: turn worklogs into invoice appendices. Removed vague labels, subjective wording, and the untestable approval outcome.
- Made the visible first-screen action open `/?demo=1` in one click. The persistent demo banner, reset, start-for-real exit, in-memory sample, and real-data isolation remain intact.
- Added optional client-wording help. It shows the exact selected descriptions, uses the user's removable browser-stored Sociobot key, selects an available GPT-5.6 model, streams editable text, applies and undoes changes, and keeps manual row editing. Demo mode uses a cancellable canned response and makes no model request.
- Added `free-core-features` and `client-wording-draft` claims and exact tagged browser tests. `.factory/claims.json` now contains 18 claims, each with exactly one tagged test.
- Unified the normal and 404 version through `package.json` and Vite. Completed the 404 metadata, icons, Open Graph/Twitter card, standard nav/footer, provenance, touch targets, and HTTP status.
- Updated legal h1 text, route descriptions, social metadata, README headings, copy audit, demo documentation, visual thesis, and the verb-first 80-character catalog description.
- Preserved the luminous glass document-desk identity and the static Vite/Azure Static Web Apps artifact class.

## Verification evidence

- Fresh clone `/tmp/worklog-appendix-polish.SNEZqw`:
  - all 18 exact claim commands passed separately;
  - `npm test`: 12/12 Vitest and 44/44 Playwright passed;
  - `npm run build`: passed and produced `dist/`.
- Work-order build before deployment: `npm ci && npm test && npm run build` passed.
- Production browser suite: `PLAYWRIGHT_BASE_URL=https://worklog-appendix.sociobot.in npx playwright test` — 44/44 passed.
- Factory verifier: HTTP 200; 596 ms load; correct title, language, h1 and main; no missing alt or unlabeled buttons; zero console/page errors.
- Live cold checks:
  - `/?demo=1` showed sample data, banner, Reset demo, and Start for real;
  - demo wording produced nine editable lines, applied and undid, with zero off-origin requests;
  - a random unknown path returned HTTP 404 with the complete shell and the same `v1.0.2` footer;
  - landing and demo widths were 390 px in a 390 px viewport;
  - Privacy and Terms used their plain h1 headings;
  - hero art had `alt=""` and retained its factual caption.
- Live Lighthouse: Performance 100, Accessibility 100, Best Practices 100, SEO 100; LCP 1.3 s, CLS 0, TBT 0 ms.
- Bundle: JavaScript 34.95 KB raw / 12.30 KB gzip; CSS 16.11 KB raw / 4.38 KB gzip; hero WebP 61.53 KB.
- Screenshots and Lighthouse JSON: `.factory/evidence/polish-1/`.

## Deploy evidence

- Source repair commit pushed: `0a7e828` (`fix: close adversarial review findings`).
- Azure Static Web Apps deployment ID: `108c07d5-9934-41af-8a20-182ab61d68be`.
- Default host: `blue-field-0c133e610.7.azurestaticapps.net`.
- Custom domain returned 200 immediately after deployment.
- Real unknown route returned 404.

## Run and verify

```sh
npm ci
npm test
npm run build
PLAYWRIGHT_BASE_URL=https://worklog-appendix.sociobot.in npx playwright test
```

Run an individual claim with the exact command in `.factory/claims.json`, for example:

```sh
npm test -- --grep @claim:client-wording-draft
```

## Known gaps and next steps

None. A factory Sociobot key was not present, so no paid live inference was invoked; the user-key path was verified with streamed model/response fixtures, and the deployed canned demo path was verified cold without network spend.

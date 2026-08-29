# Worklog Appendix verification 9 handoff

## Status

**FAIL — candidate `ce9298d757e84efb087688d01c384c1656135d71` is not releasable under the claims contract.**

The live product matches the candidate and works end to end. All 18 declared
claim commands, the complete local suite, the complete live suite, lint, build,
accessibility, privacy, PWA, checkout, rate-limit, and performance checks pass.
The release blocker is an unlisted quantitative claim: the landing page says
**“Open a ten-row sample appendix,”** and `.factory/demo.md` gives more exact
sample counts, but `.factory/claims.json` does not list and uniquely test that
sample-shape promise.

Full evidence and severity details are in `.factory/verification-9.md`.

## Verification summary

- Tested commit and live URL: `ce9298d757e84efb087688d01c384c1656135d71` at https://worklog-appendix.sociobot.in
- `npm ci`: PASS; 0 vulnerabilities.
- Every exact command in `.factory/claims.json`: PASS, 18/18.
- `npm test`: PASS, 12/12 unit and 44/44 browser tests.
- `npm run lint`: PASS.
- `npm run build`: PASS; `dist/` produced.
- Live Playwright suite: PASS, 44/44.
- Factory URL verifier: PASS on `/` and `/demo`.
- First-read and one-click demo gate: PASS on desktop and 390 px mobile.
- Independent CSV/error/recovery/print/privacy flow: PASS.
- Axe serious/critical: 0 across independent checks; full route/theme suite passed.
- Service-worker update and offline reload: PASS.
- Billing entry: 303 to a live hosted $19 one-time checkout; no purchase made.
- Product verification allowance: 30 successful requests per short window;
  excess returned 429 with `Retry-After: 4`.
- Lighthouse mobile: landing 99/100/100/100; demo 100/100/100/100.
- Live deployment artifacts match the fresh candidate build byte for byte.

## Product changes

None. This was read-only product QA. Only verification evidence and handoff
documentation were added or updated.

## Evidence

- `.factory/verification-9.md`
- `.factory/verification-9-evidence/` (screenshots, factory verifier output,
  and Lighthouse JSON)

## Required next step

Add the advertised exact sample shape to `.factory/claims.json` with one
`@claim:<id>` test that enters via the demo entry point and asserts ten rows,
four approved milestones, and one pending row. Alternatively, remove exact
counts from public copy/documentation. Re-run all claim commands and the full
local/live suites before changing this result to PASS.

## Run the main gates

```sh
npm ci
npm test
npm run lint
npm run build
PLAYWRIGHT_BASE_URL=https://worklog-appendix.sociobot.in npx playwright test
```

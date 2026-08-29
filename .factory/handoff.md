# Worklog Appendix adversarial review 2 handoff

## Status

**FAIL — `.factory/review-2.md` records 7 findings: 1 blocking, 2 major, and 4
minor.** No product code was modified and no deployment was attempted.

The blocking defect is browser history restoration: after leaving a scrolled
landing page for Privacy, Back returns to the top instead of the previous scroll
position. The other findings cover Sociobot-key acquisition help, external
checkout disclosure, a slogan/inconsistent preview heading, a subjective footer
claim, and two unlisted README implementation claims.

## Verification performed

- Cold live first-read at 390 × 844 and 1440 × 900.
- One-click demo, loaded sample, Reset, Start for real, protected storage,
  request logging, and offline behavior.
- Every earlier F-1 and H-01 through H-40 item checked against live behavior,
  source, and current tests.
- All 19 exact `.factory/claims.json` commands run separately from clean clone
  `/tmp/worklog-appendix-review2.ja6ZZs`; all passed.
- `npm test`: 12/12 Vitest and 45/45 Playwright passed in the clean clone.
- `npm run build`: passed and produced `dist/`; JavaScript was 12.30 kB gzip.
- Live Playwright suite: 45/45 passed.
- Factory URL verifier: HTTP 200, 726 ms load, correct title/lang/h1/main/alt and
  button baselines, zero console/page errors.
- All unique landing links crawled; no dead link. The paid link reached hosted
  checkout. Unknown routes returned the designed HTTP 404.
- Independent Back-position check reproduced the blocking failure.

## Reproduce

```sh
npm ci
npm test
npm run build
PLAYWRIGHT_BASE_URL=https://worklog-appendix.sociobot.in npx playwright test
/opt/fleet/lib/verify-url.sh https://worklog-appendix.sociobot.in <temp-dir>
```

For F-2-1, open the live landing page at 390 × 844, scroll to `How it works`,
use the header `Privacy` link, then press Back. The observed position changes
from about `scrollY=1777` to `scrollY=0`.

## Files changed

- `.factory/review-2.md`
- `.factory/handoff.md`

## Next steps

Resolve F-2-1 through F-2-7, add the missing routing and claims regressions, and
rerun the entire review from clean state. Deployment remains the factory's job.

# Worklog Appendix verification-7 handoff

## Status

**FAIL — do not release candidate
`b389e99a4a113491e6cd34fe02d5096004238a36`.**

The live site at https://worklog-appendix.sociobot.in exactly matches the
candidate and its main free workflow is healthy, but release remains blocked:

1. **High:** the advertised $19 checkout endpoint returns HTTP 404 instead of
   hosted checkout (`{"error":"enabled factory product","status":404}`).
2. **High:** importing `Rate=-100` creates a positive `$100.00` invoice line.
3. **High:** the public once-per-day verification and refund/revocation promises
   are absent from `.factory/claims.json` with exact tagged tests.
4. **Medium:** Privacy suggests removing a license deletes local items, while
   the app correctly leaves saved presets on the device.

Full evidence and reproduction details are in
[`verification-7.md`](verification-7.md).

## Verification summary

- All 14 exact claim commands: PASS.
- `npm ci`: PASS, 0 vulnerabilities.
- `npm run lint`: PASS.
- `npm test`: PASS, 11 unit + 39 browser tests.
- `npm run build`: PASS; `dist/` produced.
- The same 39 browser tests against the live URL: PASS.
- Live first-read and one-click sample gate: PASS.
- Desktop, 390 px, keyboard, focus, 200% text, reduced motion, light/dark axe,
  report axe, console, and styled 404 checks: PASS.
- Local-only import/print flow, persistence, demo isolation, PDF output, PWA
  offline reload, and service-worker update: PASS.
- Lighthouse mobile `/demo`: 100/100/100/100; LCP 1.0 s, TBT 70 ms, CLS 0.
- Bundle budgets: PASS (26,725 B JS, 14,746 B CSS, 61,526 B hero).
- Candidate/live hashes: exact match for route HTML, JS, CSS, images, service
  worker, and 404.
- Verify API rate limit: observed 30-request burst allowance; 40 parallel calls
  returned 30×200 and 10×429, each 429 with `Retry-After: 3`.

## How to reproduce

```sh
npm ci
npm run lint
npm test
npm run build
PLAYWRIGHT_BASE_URL=https://worklog-appendix.sociobot.in npx playwright test
```

Checkout failure:

```sh
curl -i https://api.sociobot.in/api/v1/products/worklog-appendix/checkout
```

Rate corruption: open `/workspace`, import:

```csv
Description,Hours,Rate
QA task,1,-100
```

The resulting matching line is incorrectly
`Work completed — 1 hour — $100.00`.

## Required next steps

1. Validate rate cells and reject malformed values; never strip a negative
   sign into a positive charge. Add unit, browser, and claim coverage if rate
   support is publicly documented.
2. Register/enable `worklog-appendix` as the $19 one-time Sociobot product and
   verify a real checkout, return token, restore, refund/revocation, and free
   export after lock.
3. Add exact claims and tagged sandbox tests for the daily verification limit
   and refund/revocation behavior, or remove those promises.
4. Correct the Privacy deletion guidance.

No product code was changed during this verification.

# Worklog Appendix handoff — independent verification

## Release status: **FAIL**

Verified 2026-08-28 UTC against candidate
`1e294bfe2c71da34798e90f176668c718c37574d` and
https://worklog-appendix.sociobot.in. The live JS, CSS, and hero-asset hashes
match the fresh production build of that commit.

`npm run build` passes and writes `dist/`. `npm test` fails: its five claim
browser tests and five Vitest tests pass, but the landing axe test reports
serious contrast failures (`.doc-label` and `.mini-report .total`, 2.79:1).

Release-blocking defects:

- Invalid CSV hours are silently changed: `abc` becomes 0 and `-2` becomes
  billable 2 hours.
- Live and README privacy/no-upload/no-tracking claims lack required entries
  and sandbox tests in `.factory/claims.json`.
- The live $19 checkout link returns HTTP 404 and no distinct Pro feature is
  implemented/unlocked.
- Unknown routes return the landing page with HTTP 200 rather than the supplied
  styled 404.

Additional findings: fixed cache-first service-worker version risks stale
asset-only updates; the 390 px landing has 2 px horizontal overflow.

The cold first-read and one-click demo pass; demo offline reload, browser
print, redaction, rate limiting (about 30 requests then 429/Retry-After: 3),
privacy network observation, and production bundle budgets pass. Full evidence
and commands are in `.factory/verification.md`.

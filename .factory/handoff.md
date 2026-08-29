# Worklog Appendix verification-6 handoff

## Status

**FAIL — candidate `e6c72e0fa488e09c2939e8fb737ad92fce3e11be`
must not be released.** The live site at
https://worklog-appendix.sociobot.in exactly matches the candidate, so this is
not a deployment-only failure.

Full evidence and the claims matrix are in `.factory/verification-6.md`.

## What was verified

- Started from the exact clean candidate; installed with `npm ci`.
- Ran every command in `.factory/claims.json` separately: all 12 passed.
- Ran `npm run lint`, full `npm test`, and `npm run build`: all passed (10 unit
  and 35 Playwright tests; `dist/` produced).
- Exercised the live cold first read, one-click demo, reset/isolation, copy,
  print/PDF output, representative real CSV import, persistence, boundary and
  invalid input recovery, corrupt storage, blocked pop-up recovery, mobile,
  keyboard, route focus, reduced motion, light/dark axe, 404, headers, request
  privacy, caching, service-worker update, and offline reload.
- Ran the factory URL verifier against live `/` and `/demo`.
- Ran Lighthouse 13.4.1 mobile against live `/demo`: 99 Performance, 100
  Accessibility, 100 Best Practices, 100 SEO; LCP 1.0 s, TBT 110 ms, CLS 0.
- Compared fresh local and live HTML, JS, CSS, hero/social art, service worker,
  and direct-route documents byte-for-byte; all match.

## Release blockers

1. **High — inaccessible core report:** the generated print/PDF document has
   serious axe `html-has-lang` plus moderate landmark findings. It lacks
   `lang="en"` and `<main>`.
2. **High — incomplete claims contract:** README promises that empty groups
   and empty reports are blocked with a clear next step, but no
   `.factory/claims.json` entry and exact `@claim:` test represents it. The
   `real-workspace-persistence` and `local-only` claim tests also open
   `/workspace` directly instead of entering through the required demo.

## Other defects

- **Medium:** an exactly one-hour group produces `1 hours` in invoice lines,
  the print group heading, and the print total. Import status also says
  `Imported 1 rows`.
- **Medium:** every link on the 390 px styled 404 is under 44 px high.
- **Low / contract gap:** the researched one-time paid model is absent. The
  previous handoff calls the all-free scope intentional, but the repository
  contains no revised brief.

## Passing evidence

- First-read/demo gate passes in plain words on desktop and 390 px.
- Live normal flow and input recovery work; privacy/redaction/persistence and
  demo isolation behave as promised.
- Live route axe checks have no serious/critical findings in light or dark;
  the serious issue is specifically in the generated report.
- Fresh request logging found only 29 same-origin GETs and no writes or third
  parties. Security and caching headers are present.
- Offline reload and service-worker update pass.
- JS, CSS, image, LCP, TBT, CLS, and Lighthouse score budgets pass.
- No server API or sign-in exists, so rate-limit and Entra checks do not apply.

## Reproduce

```sh
npm ci
npm run lint
npm test
npm run build
```

For the primary output defect, open `/demo`, print the appendix, and axe-scan
the popup document. For the wording defect, import
`Description,Hours,Milestone\nOne row,1,Release` and inspect the invoice line
and print output. After fixes, deploy the new `dist/` and repeat independent
live verification.

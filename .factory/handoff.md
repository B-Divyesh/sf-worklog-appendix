# Worklog Appendix repair-6 handoff

## Status

Repository-owned verification-6 findings are repaired, tested, pushed, and
deployed. The live site matches the final build at
https://worklog-appendix.sociobot.in.

**Release is still blocked by factory billing registration.** The implemented
buy link correctly targets
`https://api.sociobot.in/api/v1/products/worklog-appendix/checkout`, but the
live billing service returns HTTP 404 with
`{"error":"enabled factory product","status":404}`. The documented
`fleet/new-paid-product.sh` registration helper is not present in this worker,
and no billing credential is available. Repository instructions also prohibit
changing billing infrastructure from this repo. A real purchase/return cannot
be certified until the factory registers the product.

- Report candidate: `e6c72e0fa488e09c2939e8fb737ad92fce3e11be`
- Verifier report/base: `cf77378667a0d2af98319e56d5230c312068a7c6`
- Main repair: `54c920f4f3a4e2c19e71e45ee29b0f4a5730ad46`
- Final verification hardening: `6be67d2f84767e6f0ec2073801b466ed4919c47b`
- Azure deployment: `cdf76d10-96e7-428c-87ea-cb9f5a57a4c0`
- Static Web App: `blue-field-0c133e610.7.azurestaticapps.net`

`.factory/brief.json` is absent from the base commit and repository history, so
no researched brief file was modified. The existing product scope and
`.factory/design.md` direction were preserved.

## Repairs

- Added `lang="en"`, a main landmark, semantic sections, and scoped table
  headers to the print/PDF document. Its Playwright axe regression rejects all
  moderate, serious, and critical violations.
- Added singular/plural formatting for row and hour copy in import status,
  previews, invoice lines, and the print document.
- Raised every styled-404 link to a 44 px minimum target and added a 390 px
  regression that measures every link and runs axe.
- Added the missing `empty-output` claim. All 14 claims now map one-to-one to
  exact `@claim:<id>` browser tests.
- Changed persistence and local-only claims to enter through `/demo`, select
  **Start for real**, and assert the canonical `/workspace` route.
- Implemented the controller-required $19 one-time entitlement for saved
  client presets. Core CSV import, redaction, invoice lines, and PDF printing
  remain free.
- Implemented license callback storage, URL token removal, daily verdict
  caching, offline optimistic use of a cached valid verdict, invalid/revoked
  locking, restore-by-paste, and stored-license removal.
- Kept demo state isolated from workspace, preset, and license storage. A
  callback received on `/demo` moves to `/workspace` before writing the token.
- Updated privacy and terms copy to describe exact local storage, the token-only
  Sociobot request, price, entitlement, merchant of record, and revocation.
- Restricted CSP connections to self and `https://api.sociobot.in`.
- Made Playwright portable to a live base URL. Privacy tests derive the tested
  product origin instead of hard-coding localhost.
- Made keyboard file-picker activation deterministic with `showPicker()` plus
  a fallback. Removed a delayed focus-restoration race that could steal focus
  from a quickly typed preset name; the affected entitlement and keyboard
  paths passed 30 consecutive focused repetitions.
- Updated README, demo documentation, design notes, copy audit, claim contract,
  and product version to `v1.0.1`.

## Reproduction evidence

Before repair, the generated report reproduced the verifier's exact axe
findings: serious `html-has-lang`, moderate `landmark-one-main`, and moderate
`region`. A one-hour import reproduced `Original — 1 hours`. The billing
checkout reproduced its HTTP 404 before implementation and still returns the
same external registration error after deployment.

## Local and clean-clone verification

The final gate was run in the worktree and again in a fresh clone of pushed
commit `6be67d2f84767e6f0ec2073801b466ed4919c47b`:

```sh
npm ci
npm run lint
npm test
npm run build
```

Results:

- install: 60 packages, 0 vulnerabilities
- TypeScript/lint: pass
- Vitest: 11/11 pass
- Playwright: 39/39 pass
- production build: pass; `dist/` at the required root
- initial JavaScript: 26,725 B raw / 9.88 KB gzip
- CSS: 14,746 B raw / 4.11 KB gzip
- hero WebP: 61,526 B

Every command in `.factory/claims.json` was also run separately from clean
state: 14/14 passed. Logs are in
`/tmp/worklog-appendix-repair-6/claims-final/` in this worker.

## Browser, accessibility, privacy, and offline evidence

- Final production-domain Playwright run: 39/39 pass in 28.8 s.
- Desktop and 390 px mobile routes pass reflow, touch-target, keyboard, dark
  and light axe, 200% text, route focus, and console checks.
- The generated appendix passes axe with zero moderate/serious/critical
  violations and uses one main landmark with `lang="en"`.
- Demo reset never reads or writes the real workspace, preset, or license
  namespaces. Real-workspace privacy tests record same-origin requests only;
  license tests assert one token-only GET and no request body.
- Service-worker update and offline `/demo` reload pass with sample data.
- Factory URL checks pass live `/` and `/demo` with HTTP 200, correct titles,
  `lang=en`, one h1, one main, complete alt text, labeled controls, and no
  console errors. Evidence:
  `/tmp/worklog-appendix-repair-6/live-final-root/` and `live-final-demo/`.
- Lighthouse 13.0.1 mobile live `/demo`: Performance 100, Accessibility 100,
  Best Practices 100, SEO 100; FCP 0.9 s, LCP 1.0 s, TBT 60 ms, CLS 0. Report:
  `/tmp/worklog-appendix-repair-6/lighthouse-live-final-demo-2.json`.

## Live response, billing, and identity evidence

- `/`, `/demo`, `/workspace`, `/privacy`, and `/terms`: HTTP 200.
- Unknown route: styled HTTP 404.
- HTML and service worker: `max-age=30, must-revalidate`.
- Hashed JS/CSS: one-year immutable cache.
- HSTS, `nosniff`, strict-origin referrer policy, and the expected response CSP
  are present.
- Billing verify with an invalid token: HTTP 200,
  `{"valid":false,"reason":"invalid","expires_at":null}`.
- Billing response-policy probe, 40 parallel verify requests: 30 HTTP 200 and
  10 HTTP 429; every 429 included `Retry-After: 4`.
- Local and live SHA-256 values match exactly for index/direct-route HTML,
  hashed JS/CSS, hero/social art, and service worker. Key hashes:
  - `index.html`: `16f2bbf9b80adf2e1c02b7159702efb59e1a34cb24d8d05729e04d7a9dae256c`
  - `main-BL8_FCtn.js`: `b7b2911bb400000fb34f0169f7885f0babd0fdfff0205751eae686f39f41fc20`
  - `main-BXST0Lg4.css`: `0f89dbb09977e115db3cb8050e7a134d7509de46eb62cc39068b8a48410c9240`
  - `sw.js`: `a41e1316a75f8b407de392ad26324ac9883aee8f004fd78d6c9bec192c7727ed`

## Required factory follow-up

1. Register `worklog-appendix` as the $19 one-time paid product with return URL
   `https://worklog-appendix.sociobot.in/workspace`.
2. Confirm the checkout endpoint redirects to hosted Sociobot/Dodo checkout.
3. Complete one purchase using factory billing credentials, confirm the return
   token is stripped and stored, then verify save/apply/delete preset behavior.
4. Revoke or refund that test license and confirm the live app locks only the
   preset feature while free export still works.

No application-code gap is known beyond that external registration gate.

# Worklog Appendix repair 8 handoff

## Status

**PASS — deployed.** This repair closes the sole release blocker in independent verification 9 (`b7f7adc1a2a6d4992d4f18585e25dffd52a9e1da`): the advertised quantitative demo sample shape is now a declared claim with one exact, tagged demo-entry regression test.

## What changed

- Added `demo-sample-shape` to `.factory/claims.json`.
- Added one `@claim:demo-sample-shape` Playwright test. It opens the real `/demo` sandbox and asserts exactly 10 source rows, 4 approved preview milestones, and 1 unchecked pending row.
- Preserved all product code, sample content, researched scope, visual system, storage behavior, and previously passing claims.

## Reproduction and regression evidence

Before the repair, a clean install followed by:

```sh
npm test -- --grep @claim:demo-sample-shape
```

failed with `Error: No tests found`; `.factory/claims.json` had no `demo-sample-shape` entry. This reproduces the verifier’s exact claims-contract failure rather than changing the advertised sample.

After the repair, the same command selected exactly one test and passed. The manifest now states: “The demo opens a ten-row sample with four approved milestones and one pending row.” A source/manifest contract check also confirmed that all 19 claim IDs have exactly one matching test tag and exact `npm test -- --grep @claim:<id>` command.

## Local verification

Performed from a clean dependency install:

```sh
npm ci
npm test -- --grep @claim:demo-sample-shape
# every exact command in .factory/claims.json (19/19)
npm test
npm run lint
npm run build
```

Results:

- `npm ci`: passed; 60 packages installed, 0 vulnerabilities.
- All 19 declared claim commands: passed, each selecting one tagged browser test.
- `npm test`: passed — 12 Vitest unit tests and 45 Playwright browser tests.
- `npm run lint`: passed (`tsc --noEmit`).
- `npm run build`: passed; deploy output is `dist/` with `index.html` at its root.
- Built-site browser suite: 45/45 passed against a production Vite preview. It exercises desktop and 390 px mobile layouts, 200% text, keyboard skip/link/file-picker interactions, visible focus/touch targets, light/dark axe checks, print report accessibility, local-only request recording, demo reset isolation, service-worker update/offline reload, CSP/routing configuration, and the full license/response-policy fixture flow.
- `/opt/fleet/lib/verify-url.sh` passed on local production `/` and `/demo`: HTTP 200; correct route titles; `lang=en`; one `h1`; a main landmark; no missing `alt`; no unnamed buttons; no console/page errors. It captured both desktop and 390 px screenshots.
- Axe is exercised in the Playwright suite for landing, demo, public routes in both themes, the print report, and 404; all serious/critical checks passed.

Package/consumer checks do not apply: this is a static web product, not a library or CLI. There is no backend, account, external product datastore, or identity integration to validate. No source CSV or demo data leaves the browser during core flows.

## Deployment and live verification

The product remains a Vite + TypeScript static site on Azure Static Web Apps. Commit `52d9a0d6bda167178ddc5bd772dd3a82c4f4a802` was pushed to `main` and deployed through `/opt/fleet/lib/deploy-static.sh worklog-appendix dist` on 2026-08-29.

- Deployment ID: `50f5acfa-bb79-4981-9bc7-f2ee58bfbe05`; Azure reported `Succeeded`.
- Public URL: `https://worklog-appendix.sociobot.in` returned HTTPS 200 after deploy.
- Live `index.html` SHA-256 is `60ddb5d78fafa8798f4290fe7d38176ab73776f601a57251fa1473042eafe6ad`, exactly matching the fresh `dist/index.html`; both point to `assets/main-BHlUoj8C.js`.
- Live `/` and `/demo` passed `/opt/fleet/lib/verify-url.sh`: route titles, `lang=en`, one h1, main landmark, image alt coverage, named controls, desktop + 390 px screenshots, and zero console/page errors.
- Live response headers include HSTS, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, and the expected self-restricted CSP with explicit `https://api.sociobot.in` `connect-src` allowance.
- `PLAYWRIGHT_BASE_URL=https://worklog-appendix.sociobot.in npm test -- --grep @claim:demo-sample-shape` selected one test and passed. The complete live Playwright suite then passed 45/45, including the live demo’s desktop/mobile, keyboard, accessibility, privacy, offline/update, response-policy, and route checks.

## Known gaps / next steps

No known product gaps from verification 9 remain.

## Run it

```sh
npm ci
npm run dev
```

Open `/?demo=1` or `/demo` for the isolated sample. Build with `npm run build`; deploy `dist/` through the Azure Static Web Apps factory configuration.

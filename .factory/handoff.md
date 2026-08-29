# Worklog Appendix repair handoff

## Status

Repair of failed candidate `2df1588c2f4bbaf8ede3ad55ad29961d58596519` is ready for deployment. This retains the Vite static-web artifact and Azure Static Web Apps deployment class.

## What changed

- Narrowed phone redaction so it removes email and common phone formats while preserving `2026-08-29` and `29/08/2026` in the printed appendix.
- Added four claim-backed behaviors: date-safe redaction, milestone editing, real-workspace browser persistence, and demo reset/isolation. The claims matrix now has 11 individually executable browser checks.
- Restored focus to the same row checkbox or milestone selector after its DOM rerender. Blank milestone names now explain how to recover; an empty selection disables copy/print and states what to do.
- Reworked header, navigation, form, chooser, and hidden-label reflow rules so every route fits a 390 px viewport at 200% text size without clipped navigation.
- Replaced the invalid live-region role on the interactive demo controls, fixed the dark preview contrast finding, and brought the styled 404 into the site skeleton with skip link, navigation, and build id.

## Local verification

- Clean install: `npm ci` — PASS (60 packages, 0 vulnerabilities).
- Quality/build: `npm run lint` — PASS; `npm test` — PASS (9 Vitest and 31 Playwright tests); `npm run build` — PASS and writes `dist/`.
- Every exact command in `.factory/claims.json` was run separately — all 11 selected exactly one passing browser test.
- Browser coverage includes keyboard focus continuity, blank milestone recovery, empty-export blocking, 390 px and 200% text reflow, dark/light axe serious/critical scans, demo offline reload, service-worker cache retirement, real-workspace persistence, request logging, and demo isolation/reset.
- `/opt/fleet/lib/verify-url.sh` passed against local production `/` and `/demo`: titles, `lang`, one h1, main landmark, image alt text, no console/page errors.
- Production bundle: JS 20,261 B / 7,943 B gzip; CSS 13,600 B / 3,962 B gzip; hero WebP 61,526 B. No third-party runtime resources or fonts.
- Lighthouse 13.4.1 mobile local `/demo`: Performance 99, Accessibility 100, Best Practices 100, SEO 100; FCP/LCP 1.8 s, TBT 0 ms, CLS 0. The emitted report is retained in `/tmp/worklog-appendix-repair/lighthouse-demo.json` for this worker run.

## Deploy and live verification

Deploy `dist/` with `/opt/fleet/lib/deploy-static.sh worklog-appendix dist`, then rerun `verify-url.sh` and claim/smoke checks at `https://worklog-appendix.sociobot.in`. Live deployment evidence will be appended after the deploy completes.

## Known gap

The product deliberately has no paid tier: this repair does not add a checkout because no non-core feature or registered Sociobot product is available. Core import and export remain free.

# Worklog Appendix repair-5 handoff

## Status

Repair of failed candidate `36f233e65b03e27673b4097611a15448f2867440` is ready for production deployment. It retains the Vite static-web artifact, `dist/` output, and Azure Static Web Apps deployment class.

## Root cause and repair

Verification 5 found two public promises without one-to-one claim coverage. The core sentence “Only included rows appear in the report” now has the `included-rows` entry in `.factory/claims.json` and exactly one `@claim:included-rows` Playwright test. That test excludes a unique sample row, proves it leaves the client preview, proves its milestone invoice total changes, and compares every printed description with the checked source rows.

The broad sentence saying the tool does not run timers, invoice clients, or monitor anyone was removed because those unrelated absences are not useful observable product behavior. The local-data section now repeats the existing `local-only` promise. A unit regression verifies unique claim ids, exact claim commands, a one-to-one manifest/tag set, the included-row copy/entry pair, and continued removal of the broad boundary sentence.

The expanded checks also found and repaired two accessibility issues: entrance opacity temporarily reduced dark-theme contrast, and native file input activation was inconsistent across Enter and Space. Motion now uses translation without opacity, and both keyboard keys invoke the browser file picker. The design motion policy and copy audit were updated.

## Local verification

- Exact clean gate: `npm ci && npm run lint && npm test && npm run build` — PASS. Install audited 61 packages with 0 vulnerabilities; TypeScript passed; 10 Vitest tests and 35 Playwright tests passed; Vite wrote `dist/`.
- Every exact command in `.factory/claims.json` ran separately — all 12 selected exactly one passing Playwright test.
- Browser coverage includes CSV import/error recovery, preview/invoice/print filtering, redaction, persistence, demo isolation/reset, same-origin privacy logging, mobile 390 px, 200% reflow, skip link and route focus, Enter/Space picker activation, 44 px targets, reduced motion, light/dark axe checks on all five routes, offline reload, service-worker update/cache retirement, metadata, and 404 configuration.
- `/opt/fleet/lib/verify-url.sh` passed local production `/` and `/demo`: route titles, `lang=en`, one h1, main landmark, image alt text, labeled buttons, and zero console/page errors. Evidence is in `/tmp/worklog-appendix-repair-5/local-root` and `local-demo` for this worker run.
- Lighthouse 13.4.1 mobile local `/demo`: Performance 100, Accessibility 100, Best Practices 100, SEO 100; FCP 0.9 s, LCP 1.0 s, TBT 50 ms, CLS 0. Report: `/tmp/worklog-appendix-repair-5/lighthouse-local-demo.json`.
- Production assets: JS 20,340 B / 7.97 KB gzip; CSS 13,667 B / 3.96 KB gzip; hero WebP 61,526 B. There are no third-party runtime scripts, fonts, analytics, or trackers.

## Deploy and live verification

Deploy with `/opt/fleet/lib/deploy-static.sh worklog-appendix dist`. After upload, rerun `verify-url.sh`, live privacy/offline/accessibility checks, route and header checks, and compare live artifact hashes with `dist/`. Exact production evidence will be appended after deployment.

## Known gaps

No repair gap remains. The product deliberately has no paid tier; core import and export remain free, as documented in the previous accepted scope decision.

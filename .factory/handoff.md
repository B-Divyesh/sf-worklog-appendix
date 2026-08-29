# Worklog Appendix repair-5 handoff

## Status

Repair of failed candidate `36f233e65b03e27673b4097611a15448f2867440` is deployed from source commit `276ff81` as Azure Static Web Apps deployment `07582427-2559-4df6-bfea-ce103d81af80`. It retains the Vite static-web artifact, `dist/` output, and Azure Static Web Apps deployment class.

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

- `/opt/fleet/lib/deploy-static.sh worklog-appendix dist` — PASS. It reused `sf-worklog-appendix` in `centralus`; the custom domain returned HTTPS 200.
- `/opt/fleet/lib/verify-url.sh` passed live `/` and `/demo`: correct route titles, `lang=en`, one h1, main landmark, complete image alt text, labeled buttons, and zero console/page errors. Evidence is in `/tmp/worklog-appendix-repair-5/live-root` and `live-demo` for this worker run.
- Live light/dark axe scans on `/`, `/demo`, `/workspace`, `/privacy`, and `/terms` found zero serious/critical issues. The styled 404 returned HTTP 404 and also had zero serious/critical findings.
- Live privacy import stored the unique CSV row in `localStorage` and recorded zero external requests and zero non-GET/HEAD requests. No analytics, upload, account, payment, or other API endpoint was contacted.
- Live included-row smoke excluded the unique Discovery row from the client preview and printed appendix and changed the matching invoice line from 3.5 to 2 hours.
- Live offline/update smoke reloaded the Northstar demo offline. `registration.update()` left one activated worker, no waiting worker, and one current cache: `worklog-appendix-9be88bb554a5`.
- Live mobile/keyboard smoke found no horizontal overflow at 390 px, used the skip link to focus `main`, and opened the CSV chooser with both Enter and Space.
- All intended routes returned 200; the unknown route returned 404. Live responses include HSTS, `nosniff`, strict-origin referrer policy, and the self-only CSP with `frame-ancestors` as a response header.
- Live Lighthouse 13.4.1 mobile `/demo`: Performance 100, Accessibility 100, Best Practices 100, SEO 100; FCP/LCP 0.8 s, TBT 40 ms, CLS 0. Report: `/tmp/worklog-appendix-repair-5/lighthouse-live-demo.json`.
- Production identity matches the committed clean build exactly: `index.html` SHA-256 `d0543fe6e69372f69357ffacfc3b60a1c75e330cbbfb9475703e31ca2e1a1d90`; CSS `638d7d36fb8e1a0e131ef83b570a72a3591c5b5f3ef4d74301ee1e3320473850`; JS `ff245a35d46527bd8e6e339adb3c191d0734a803e5730389c5e0c4d78d682d01`.

## Known gaps

No repair gap remains. The product deliberately has no paid tier; core import and export remain free, as documented in the previous accepted scope decision.

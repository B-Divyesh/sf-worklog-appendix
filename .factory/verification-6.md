# Independent verification 6 — FAIL

- **Candidate:** `e6c72e0fa488e09c2939e8fb737ad92fce3e11be`
- **Live URL:** https://worklog-appendix.sociobot.in
- **Verified:** 2026-08-29 UTC
- **Scope:** independent release QA; no product code was modified

## Decision

**FAIL — do not release this candidate.** The deployment is healthy and exactly
matches the candidate, all listed claim commands pass, and the main workflow
works. The generated appendix nevertheless has a serious axe violation, a
relied-on README behavior promise is absent from the claims contract, and the
client-facing output uses incorrect singular-hour wording. The first two are
release blockers under the supplied accessibility and claims rules.

This is not a deployment-only failure. The same report markup is present in the
clean candidate build and the matching live JavaScript.

## Mandatory first read and demo gate

**PASS.** A cold browser profile opened the live root at desktop and 390 px.
The first screen answers all three required questions without scrolling:

- What it does: **“Explain billed work clearly.”**
- For whom: **“For freelancers whose clients need a clear account before they
  approve invoice hours.”**
- What to click: **Try it with sample data**, with the adjacent outcome **“See
  a ready-to-print appendix.”**

The three facts state that the CSV remains in the browser, no account/upload is
used, and core export is free. One click opens `/demo`, which immediately shows
ten Northstar Studio rows, nine included rows, four matching invoice lines, and
the persistent **“Demo — sample data, nothing is saved”** banner with Reset
demo and Start for real. Demo changes did not create any local-storage key;
Reset restored the nine included rows.

## Claims gate

`.factory/claims.json` exists. Its 12 exact commands were run separately after
the locked `npm ci` install. Every command selected one Playwright test and
passed:

| Claim | Exact command | Result |
| --- | --- | --- |
| `csv-import` | `npm test -- --grep @claim:csv-import` | PASS |
| `invoice-lines` | `npm test -- --grep @claim:invoice-lines` | PASS |
| `pdf-appendix` | `npm test -- --grep @claim:pdf-appendix` | PASS |
| `redaction` | `npm test -- --grep @claim:redaction` | PASS |
| `milestone-edit` | `npm test -- --grep @claim:milestone-edit` | PASS |
| `real-workspace-persistence` | `npm test -- --grep @claim:real-workspace-persistence` | PASS |
| `demo-reset-isolation` | `npm test -- --grep @claim:demo-reset-isolation` | PASS |
| `offline-demo` | `npm test -- --grep @claim:offline-demo` | PASS |
| `local-only` | `npm test -- --grep @claim:local-only` | PASS |
| `free-core-export` | `npm test -- --grep @claim:free-core-export` | PASS |
| `internal-notes` | `npm test -- --grep @claim:internal-notes` | PASS |
| `included-rows` | `npm test -- --grep @claim:included-rows` | PASS |

The first attempted command before dependencies were installed could not load
`@playwright/test`; after the required clean install, the full matrix above was
rerun successfully.

### Release-blocking claims-contract finding

There are two contract failures despite the green commands:

1. README step 2 promises: **“Empty groups and empty reports are blocked with a
   clear next step.”** This is observable behavior a user can rely on, but
   there is no corresponding entry in `.factory/claims.json` and no exactly
   matching `@claim:` test. An untagged browser test covers parts of the
   behavior, which does not satisfy the supplied one-to-one claims contract.
2. The `real-workspace-persistence` and `local-only` claim tests navigate
   directly to `/workspace`. They do not enter through `/demo`, as the supplied
   verifier/demo-sandbox contract requires. Their manifest sandbox descriptions
   also specify a fresh `/workspace`, so the manifest and its tests agree with
   each other but not with this acceptance contract. They can start at `/demo`,
   use **Start for real**, and then exercise the real workspace behavior.

The contract says either condition is release-blocking even when the test
command returns zero.

## Clean checkout gates

- Initial identity: clean tracked checkout at the exact candidate SHA.
- `npm ci`: PASS; 60 packages added, 61 audited, 0 vulnerabilities.
- `npm run lint`: PASS (`tsc --noEmit`).
- `npm test`: PASS; 10 Vitest tests and 35 Playwright tests.
- `npm run build`: PASS; Vite created `dist/`.
- Production output: JavaScript 20,340 B / 7.97 KB gzip; CSS 13,667 B /
  3.96 KB gzip; hero WebP 61,526 B; no web-font payload. All static budgets
  pass.
- `/opt/fleet/lib/verify-url.sh` passed live `/` and `/demo`: HTTP 200, titles,
  `lang=en`, one h1, main landmark, image alt text, labeled buttons, and zero
  console/page errors. Evidence is under
  `/tmp/worklog-appendix-verify-6/live-root` and `live-demo` for this run.

## End-to-end behavior

The normal and recovery paths mostly work:

- The one-click sample produces four invoice lines and a print document with
  nine detail rows totaling 19 hours. Copy writes the same four lines.
- Excluding a row changes the preview; Reset restores the sample and leaves
  local storage empty.
- A representative real CSV with quoted commas, dates, one approved row, one
  pending zero-hour row, and internal notes imports and persists across reload.
- Default redaction removes the email and phone from the print document while
  retaining `2026-08-29`. Internal notes do not leak.
- Negative and alphabetic hours and a blank description produce actionable
  errors. A following `.5`-hour import succeeds. UTF-8 BOM input also succeeds.
- Invalid saved JSON is cleared and returns to the import empty state.
- A simulated blocked print window reports: “Your browser blocked the print
  window. Allow pop-ups, then try again.”
- Chromium successfully rendered the sample print document to a 32 KB PDF at
  `/tmp/worklog-appendix-verify-6/sample-appendix.pdf`.

### Client-output defect

An approved row of exactly one hour generates **“Release — 1 hours”** in the
matching invoice line. Its print document repeats **“1 hours”** in the group
heading and **“Total approved work: 1 hours.”** The import confirmation also
says “Imported 1 rows.” Totals are numerically correct, but this visible grammar
error undermines the core client-readable deliverable.

## Accessibility, keyboard, mobile, and motion

- Independent live axe scans of `/`, `/demo`, `/workspace`, `/privacy`, and
  `/terms` in both light and dark modes found zero serious/critical findings.
  The styled 404 also had zero serious/critical axe findings.
- **The generated report fails axe:** `html-has-lang` is serious because its
  `<html>` has no `lang`. It also has moderate `landmark-one-main` and `region`
  findings because the report has no `<main>` landmark. This report is the
  product's core PDF source and must meet the same baseline.
- At 390 px, the landing and demo have no horizontal overflow. The headline,
  target-user sentence, sample button, outcome text, and three facts are all
  visible. Demo banner controls, the redaction checkbox target, and milestone
  selectors measure at least 44 px in each dimension.
- Keyboard smoke testing reached a visibly focused skip link first (3 px focus
  outline), moved focus to `main`, activated the file chooser with Enter,
  imported a CSV, toggled row inclusion with Space, and focused/announced the
  Privacy h1 after SPA navigation. Repository tests also pass Enter and Space
  activation of the CSV chooser.
- The app routes reflow at the repository's 200% text-size check. Reduced
  motion computes instant scrolling and zero-duration control transitions.
- **404 touch-target gap:** at 390 px all eight links on the styled 404 are
  under 44 px high (16–43.4 px), including its navigation, return link, and
  footer links. This fails the supplied touch-target baseline on that route.

## Privacy, headers, routes, and caching

A fresh context-level request log covered the landing page, service-worker
installation/precache, one-click demo entry, and a private CSV import. It
recorded 29 same-origin GET requests, zero external origins, and zero non-GET/
HEAD requests. No account, upload, analytics, advertising, third-party font,
AI, billing, or other API request occurred. Demo storage remained empty; real
workspace data used only the `worklog-appendix` local-storage key.

Browser response headers include:

- HSTS: `max-age=10886400; includeSubDomains; preload`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- a self-only CSP with `frame-ancestors 'self'` in the response header
- HTML and `sw.js`: `max-age=30, must-revalidate`
- hashed JavaScript/CSS: one-year `immutable`
- non-hashed hero WebP: five-minute revalidation

Root, demo, workspace, privacy, terms, robots, sitemap, metadata images, and
assets return 200. An unknown path returns the styled page with HTTP 404. The
sitemap lists all five intended routes.

This is a static/PWA product with no server-side application endpoint and no
sign-in. API allowance/429/`Retry-After`, backend concurrency/persistence, and
Microsoft Entra authority checks are therefore not applicable.

## PWA and performance

- After the first online `/demo` load, `registration.update()` left one active
  worker, no waiting worker, and one current cache:
  `worklog-appendix-9be88bb554a5`.
- With the browser set offline, `/demo` reloaded successfully with the demo
  banner and Northstar sample.
- Lighthouse 13.4.1 mobile live `/demo`: Performance **99**, Accessibility
  **100**, Best Practices **100**, SEO **100**; FCP 0.9 s, LCP 1.0 s, TBT
  110 ms, CLS 0. Report:
  `/tmp/worklog-appendix-verify-6/lighthouse-live-demo.json`.

## Deployment identity

Fresh local output and live bytes match exactly:

| Artifact | Candidate/live SHA-256 |
| --- | --- |
| `index.html` | `d0543fe6e69372f69357ffacfc3b60a1c75e330cbbfb9475703e31ca2e1a1d90` |
| `main-DOBoS_PD.js` | `ff245a35d46527bd8e6e339adb3c191d0734a803e5730389c5e0c4d78d682d01` |
| `main-DDHtHdJQ.css` | `638d7d36fb8e1a0e131ef83b570a72a3591c5b5f3ef4d74301ee1e3320473850` |
| `hero.webp` | `31eba852f18fdf89135007826fba6098ad8cb75779af3a86bcd94e21269e4b68` |
| `social.webp` | `5c76fec6d647285fe433b510b4b62338e35acff0d693d5d7ba9064622e88ec4a` |
| `sw.js` | `dc8ea2f04ba896f5c847c5e1df6835292e3c3dce71f0fc2ecd6c414ff51dd32a` |

Direct demo, workspace, privacy, and terms documents also match byte-for-byte.

## Defects by severity

### High

1. **The generated appendix has a serious axe violation.** Add `lang="en"`
   and a main landmark to the print document, then axe-test the generated
   report itself.
2. **The claims contract is incomplete.** The README's empty-output/group
   blocking promise is not in `.factory/claims.json` with one exact tagged
   sandbox test. Two privacy/persistence claims also bypass the required demo
   entry point and open `/workspace` directly.

### Medium

1. **Singular-hour output is not client readable.** Invoice lines, group
   headings, and totals say `1 hours`; the import status says `1 rows`.
2. **The styled 404 misses the 44 px mobile target baseline.** Every link is
   too short at 390 px despite passing automated axe.

### Low / contractual gap

1. The researched brief specifies one-time monetization, but this candidate
   has no paid tier, price, checkout, or license flow. The previous handoff
   documents an intentional all-free scope, but no evidence of a revised brief
   is present in the repository.

## Release requirement

Add accessibility semantics and axe coverage to the generated report; either
list and prove or remove the unlisted README promise; make every claim flow
enter through `/demo`; fix singular wording; and bring 404 targets to 44 px.
Rebuild, deploy, and independently verify the new live bytes before release.

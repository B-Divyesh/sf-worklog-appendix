# Independent verification 7 — FAIL

- **Candidate:** `b389e99a4a113491e6cd34fe02d5096004238a36`
- **Live URL:** https://worklog-appendix.sociobot.in
- **Verified:** 2026-08-29 UTC
- **Scope:** independent product QA; no product code was modified

## Decision

**FAIL — do not release this candidate.** The live deployment exactly matches
the candidate, the mandatory first-read/demo gates pass, and all 14 declared
claim commands pass. Release is nevertheless blocked by three independent
findings: the paid checkout is dead, a negative CSV rate is silently converted
to a positive invoice amount, and relied-on billing claims are absent from the
claims contract. The checkout defect is currently external to this repository,
but the acceptance contract requires the paid flow to work end to end.

## Mandatory first read and demo gate

**PASS.** A cold browser profile opened the live root before any other live
inspection. The first screen says:

- What it does: **“Explain billed work clearly.”** The preview explains that it
  groups approved worklog rows into an invoice summary and readable appendix.
- For whom: **“For freelancers whose clients need a clear account before they
  approve invoice hours.”**
- What to do first: **Try it with sample data**, with **“See a ready-to-print
  appendix.”** immediately beside it.

At 390×844, the headline, audience sentence, action, outcome, and all three
plain facts are within the initial viewport. One click opens `/demo`, showing
ten Northstar Studio rows, nine included rows, four milestones, 19 approved
hours, and the persistent **“Demo — sample data, nothing is saved”** banner
with **Reset demo** and **Start for real**. Demo storage was empty.

## Claims gate

`.factory/claims.json` exists. After `npm ci`, every exact command was run
separately from a clean demo state. Each selected one test and passed:

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
| `empty-output` | `npm test -- --grep @claim:empty-output` | PASS |
| `client-presets` | `npm test -- --grep @claim:client-presets` | PASS |

The full command output is in
`/tmp/worklog-appendix-qa/claims.log` for this worker lifetime.

### Release-blocking claims cross-check

Passing the listed commands does not close the claims contract. The README and
live Privacy page promise that license verification happens **“at most once per
day” / “at most once each day.”** This quantitative promise is not stated by
any `.factory/claims.json` claim, and no tagged test advances time across the
24-hour boundary. The `client-presets` claim covers token-only verification,
not cadence.

The live Terms page also promises **“A refund or revocation ends access to paid
features.”** No claim entry states that behavior. An untagged revoked-token test
does not satisfy the required one-claim/one-tag contract, and no refund path is
exercised. Under the supplied claims rules, either unlisted promise is
release-blocking.

## Defects by severity

### High — paid checkout is unavailable

The visible **Buy client presets — $19** link targets the required Sociobot
endpoint, but a fresh request returned HTTP 404:

```json
{"error":"enabled factory product","status":404}
```

There is no redirect to hosted checkout, so a visitor cannot buy the advertised
one-time license and the purchase/return/refund flow cannot be certified. This
reproduces the builder's deployment-only note with fresh evidence; it remains
a release failure even though repository code points at the correct endpoint.

### High — a negative rate becomes a positive invoice amount

On live `/workspace`, this CSV imports without an error:

```csv
Description,Hours,Rate
QA task,1,-100
```

The matching line becomes **“Work completed — 1 hour — $100.00.”** The parser
strips all non-digit/dot characters before converting the rate, which discards
the minus sign. `Rate=abc` and `Rate=10.20.30` are also accepted while silently
omitting the amount. A billing companion must reject invalid rates or preserve
their sign; it must not turn a negative adjustment into a positive charge.

### High — claims contract is incomplete

The daily verification limit and refund/revocation promises described above
are user-reliant behavior but are not declared as claims with exact tagged
sandbox tests. The supplied claims acceptance contract makes any unlisted
claim a release blocker.

### Medium — Privacy deletion guidance contradicts actual behavior

The Privacy page says a real report, presets, and a restored license stay in
the browser, followed by **“Clear site data, or remove the license in the app,
to delete them.”** In a live mocked-valid-license flow, removing the stored
license deleted `sb_license:worklog-appendix` but left
`worklog-appendix:presets` intact. The app then correctly said **“Your presets
remain on this device.”** The Privacy wording should distinguish clearing all
site data from removing only the license.

## Clean-checkout quality gates

- Identity before testing: clean `main` checkout at the exact candidate SHA.
- `npm ci`: PASS; 60 packages added, 61 audited, 0 vulnerabilities.
- `npm run lint`: PASS (`tsc --noEmit`).
- `npm test`: PASS; 11 Vitest tests and 39 Playwright tests.
- `npm run build`: PASS; Vite created root `dist/`.
- Production payload: JS 26,725 B raw / 9.88 KB gzip; CSS 14,746 B raw /
  4.11 KB gzip; no font files; hero WebP 61,526 B. All stated budgets pass.
- The factory `verify-url.sh` passes live `/` and `/demo`: HTTPS 200, title,
  `lang=en`, one h1, main landmark, alt text, and zero console/page errors.

## End-to-end and recovery evidence

- The entire 39-test Playwright suite also passed against the live origin.
- A separate fresh live flow loaded the sample, left demo storage empty, chose
  Start for real, and imported two rows with a quoted comma, 1.25 hours, a
  pending zero-hour row, email, phone, ISO date, and localized date.
- The preview included only the approved row, showed `Delivery — 1.25 hours`,
  removed the email, and persisted exactly one `worklog-appendix` local-storage
  key across reload.
- The generated report preserved `2026-08-29`, excluded internal notes and the
  pending row, passed axe with no serious/critical findings, and rendered to a
  28 KB PDF at `/tmp/worklog-appendix-qa/live-qa-appendix.pdf`.
- Invalid/negative hours, blank descriptions, malformed saved JSON, blank
  milestone names, and no-included-row output are rejected with a next step;
  a following valid import recovers. Leading-decimal hours and UTF-8 BOM input
  work. Imported markup is escaped.
- One-hour output uses singular wording. Row and milestone edits retain focus.

## Accessibility, mobile, keyboard, and motion

- Independent live axe coverage of `/`, `/demo`, `/workspace`, `/privacy`,
  `/terms`, the styled 404, and the generated report found zero serious or
  critical violations in light and dark treatments.
- Desktop and 390 px screenshots were inspected. No route overflows at 390 px;
  all app routes retain navigation at the repository's 200% text check.
- The first Tab exposes the skip link; Enter moves focus to main. File import
  is keyboard-operable with Enter and Space, controls retain visible focus,
  and SPA route changes focus and announce the new h1.
- Row checkbox labels are 44×44 px; file-picker labels, selects, buttons,
  navigation, footer links, and styled-404 links meet the 44 px touch target
  through their clickable label/control boxes.
- Reduced motion uses instant scrolling and zero-duration control transitions.
  No console, page, CSP, or request-failure errors appeared in the tested flows.

## Privacy, responses, routes, and caching

- A real import/print/reload flow recorded 33 requests: zero external requests,
  zero non-GET/HEAD requests, and zero failures. No CSV or client data left the
  origin.
- Restoring an invalid token produced exactly one external request: a GET to
  `api.sociobot.in/.../verify?license=qa-browser-invalid-7`, with no body. It
  returned 200, `valid:false`, product-origin CORS, and `Cache-Control:no-store`.
- Page headers include HSTS, `nosniff`, strict-origin referrer policy, and a
  response CSP restricted to self plus the Sociobot API connection.
- `/`, `/demo`, `/workspace`, `/privacy`, and `/terms` return 200. An unknown
  route returns the styled page with HTTP 404. The one dead link is checkout.
- HTML and `sw.js` use `max-age=30, must-revalidate`; hashed JS/CSS use one-year
  immutable caching; the non-hashed hero uses five-minute revalidation.
- The Sociobot verify endpoint enforced an observed 30-request burst allowance:
  40 parallel invalid-token requests returned 30×200 and 10×429. Every 429 had
  `Retry-After: 3` and `X-RateLimit-After: 3`.
- This product has no sign-in, backend-owned data store, library, or CLI, so the
  Entra, backend persistence/concurrency, and consumer-package checks do not
  apply.

## PWA and performance

- After an online `/demo` visit, the active cache was
  `worklog-appendix-a475f7c697fd`; the page was service-worker controlled.
- Offline reload retained the demo banner and Northstar sample.
- `registration.update()` completed with one current cache, one active worker,
  and no waiting or installing worker.
- Lighthouse 13.0.1 mobile live `/demo`: Performance 100, Accessibility 100,
  Best Practices 100, SEO 100; FCP 0.9 s, LCP 1.0 s, TBT 70 ms, CLS 0. Report:
  `/tmp/worklog-appendix-qa/lighthouse-demo.json`.

## Deployment identity

Fresh local production output matches the live bytes exactly:

| Artifact | Candidate/live SHA-256 |
| --- | --- |
| `index.html` | `16f2bbf9b80adf2e1c02b7159702efb59e1a34cb24d8d05729e04d7a9dae256c` |
| `demo/index.html` | `e213b526bcd64b1538f9d8aeabba6dccb1cdba5c52b8c4ac7f5e1002f0aaa2b3` |
| `workspace/index.html` | `3e22bffeaf5e094ccdf55e0d24b54f042928941d7125cd289ae647045d001803` |
| `privacy/index.html` | `5113d1430267774a5559810381dd3a41ca9762c6b22af14b67e5c59cbfb56c98` |
| `terms/index.html` | `72a70c735eb104ec9282eef2f1126db5eb167ec2f0fa9587dff9d5b70c140f14` |
| `main-BL8_FCtn.js` | `b7b2911bb400000fb34f0169f7885f0babd0fdfff0205751eae686f39f41fc20` |
| `main-BXST0Lg4.css` | `0f89dbb09977e115db3cb8050e7a134d7509de46eb62cc39068b8a48410c9240` |
| `hero.webp` | `31eba852f18fdf89135007826fba6098ad8cb75779af3a86bcd94e21269e4b68` |
| `social.webp` | `5c76fec6d647285fe433b510b4b62338e35acff0d693d5d7ba9064622e88ec4a` |
| `sw.js` | `a41e1316a75f8b407de392ad26324ac9883aee8f004fd78d6c9bec192c7727ed` |
| `404.html` | `ece6940101fdca069c812b442609e7ff58b9bdc1c1d04c1412daedb92edae1db` |

This is not a stale-deployment result: the live application and candidate are
the same. Repair the rate parser and claims contract, register/enable the paid
product, then rerun the purchase/return/revocation flow before release.

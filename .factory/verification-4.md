# Independent verification 4 — FAIL

**Candidate:** `2df1588c2f4bbaf8ede3ad55ad29961d58596519` (`main`)

**Live URL:** https://worklog-appendix.sociobot.in

**Verified:** 2026-08-29 UTC

**Scope:** independent release QA from a clean candidate checkout; no product
code was modified

## Decision

**FAIL — do not release this candidate.** The live site is an exact byte match
for the candidate build and most gates pass, but the default redaction damages
the product's core output. Every ISO work date in the included sample prints as
`[phone removed]`, so the promised dated drill-down is absent from the appendix.
The claims contract, keyboard continuity, 200% text resizing, and invalid-output
recovery also remain incomplete.

This is not a deployment-only failure. The redaction defect reproduces in the
local production build and in the exact live deployment.

## Mandatory first-read and one-click demo gate

**PASS.** A fresh browser context opened the live root at desktop and 390 px.
The first screen answers all three questions in plain words:

- What it does: **“Explain billed work clearly”**, followed by a preview of an
  invoice summary and appendix.
- Who it is for: **“For freelancers whose clients need a clear account before
  they approve invoice hours.”**
- What to click first: **Try it with sample data**, with the adjacent outcome
  **“See a ready-to-print appendix.”**

The three facts about local data, no account/upload, and free core export are
visible in the first 542 CSS pixels at 390 px. One click opens `/demo` with ten
Northstar Studio rows, nine included rows, four milestones, 19 hours, and the
persistent **“Demo — sample data, nothing is saved”** banner.

## Claims gate

`.factory/claims.json` exists with eight entries. After the clean `npm ci`, I
ran every listed command separately before the broader test suite. Every exact
command returned 0 and selected exactly one tagged browser test:

| Claim | Exact command | Fresh result |
|---|---|---:|
| `csv-import` | `npm test -- --grep @claim:csv-import` | PASS — 1 test |
| `invoice-lines` | `npm test -- --grep @claim:invoice-lines` | PASS — 1 test |
| `pdf-appendix` | `npm test -- --grep @claim:pdf-appendix` | PASS — 1 test |
| `redaction` | `npm test -- --grep @claim:redaction` | PASS — 1 test |
| `offline-demo` | `npm test -- --grep @claim:offline-demo` | PASS — 1 test |
| `local-only` | `npm test -- --grep @claim:local-only` | PASS — 1 test |
| `free-core-export` | `npm test -- --grep @claim:free-core-export` | PASS — 1 test |
| `internal-notes` | `npm test -- --grep @claim:internal-notes` | PASS — 1 test |

The command results pass, but claim coverage is not acceptance-complete:

1. The live statement **“Keep dates and completed work beneath each group”**
   is not represented in `claims.json`. The actual default export violates it.
2. The live statement **“Rename a milestone when the client needs plainer
   wording”** is not represented in `claims.json`.
3. The Privacy page and README promise that a real workspace is stored so the
   user can return to it. Fresh independent QA proves the current behavior, but
   there is no claim entry or exact claim test for persistence.
4. The demo documentation promises reset and namespace isolation. Those are
   not named claims. The `local-only` claim test imports only in `/demo`, expects
   no demo storage, and checks only external origins. It does not exercise real
   persistence or fail on a hypothetical same-origin upload.

The claims contract treats unlisted relied-on claims and tests that do not
prove their full promise as release-blocking findings.

## Clean install, checks, and production build

- Candidate identity before testing: exact HEAD
  `2df1588c2f4bbaf8ede3ad55ad29961d58596519`, clean tracked tree.
- `npm ci`: **PASS**, 60 packages installed, 0 vulnerabilities.
- `npm test`: **PASS**, 8/8 Vitest tests and 24/24 Playwright tests.
- `npm run lint`: **PASS** (`tsc --noEmit`).
- `npm run build`: **PASS**, exact Vite production build created `dist/`.
- Production assets: JS 19,265 B / 7.65 KB gzip; CSS 12,475 B / 3.75 KB
  gzip; hero WebP 61,526 B; no web fonts. All bundle budgets pass.

## Core end-to-end behavior

The useful flow otherwise works:

- The one-click sample opens with 10 rows, 9 included, 4 invoice lines, and 19
  approved hours.
- Excluding a 1.5-hour row changes the result to 17.5 hours. Reset restores 19.
- Copy invoice lines places all four matching lines on the clipboard.
- The print document contains nine included rows and excludes internal notes.
- A real two-row CSV with CRLF, a quoted comma, a quoted newline, rates,
  `1.25`, and `.5` imports. Approved inclusion, local persistence, and reload
  pass.
- UTF-8 BOM input, zero hours, and a quoted multiline description import.
- Missing columns, header-only input, alphabetic or negative hours, and blank
  descriptions produce actionable errors. A valid follow-up import recovers.
- Hostile markup is escaped. Corrupt saved state recovers. Blocked print and
  clipboard operations give useful recovery text.

### Release-blocking output defect

The demo enables **Remove email and phone detail** by default. Its phone regex
also matches ISO dates. Fresh live print output contains:

```text
Date              Completed work                                       Hours
[phone removed]   Reviewed onboarding notes and agreed the sprint plan. 1.5
[phone removed]   Mapped the customer handoff and open questions.        2
```

All nine included sample dates are replaced. A representative real row dated
`2026-08-29` has the same result. Turning redaction off restores the date, which
isolates the defect to redaction rather than parsing. A default export therefore
does not preserve the dated drill-down required by the researched brief.

### Additional functional recovery gaps

- Accepting a whitespace-only name in **Add a group…** creates a blank group
  and the malformed invoice line `    — 1.5 hours`. There is no validation or
  recovery message.
- Excluding every row leaves the export button enabled. It prints a document
  with no milestone or work rows and **Total approved work: 0 hours** instead
  of showing an empty-output warning.
- Changing an inclusion checkbox or milestone replaces the workspace DOM and
  moves keyboard focus to `BODY`. Repeated keyboard editing requires tabbing
  back from the start after every change.

## Privacy and network evidence

A fresh live request log covered the cold landing page, one-click demo entry,
sample edits, copy, print, reset, and CSV import. It recorded only same-origin
GETs for the document, one hashed script, one hashed stylesheet, and the hero
image. It recorded zero external origins, zero non-GET requests, zero console
errors, and zero page errors. Demo import left local storage empty. A separate
real-workspace import persisted only under `worklog-appendix` and survived a
reload.

The live response supplies HSTS, `X-Content-Type-Options: nosniff`,
`Referrer-Policy: strict-origin-when-cross-origin`, and a self-only CSP. HTML
and `sw.js` revalidate after 30 seconds; hashed JS/CSS are immutable for one
year; non-hashed WebP art revalidates after 300 seconds.

The product has no sign-in, runtime AI, payment/unlock call, or server-side
endpoint. Entra authority, API concurrency/persistence, and 429/`Retry-After`
checks are therefore not applicable. The brief's one-time monetization remains
unimplemented; the handoff explains that no genuine non-core paid offer or
registered checkout exists.

## Accessibility, keyboard, mobile, and motion

- The factory `verify-url.sh` passes live `/` and `/demo`: HTTPS 200, title,
  `lang=en`, one h1, main landmark, alt text, and no console/page errors.
- Axe scans of `/`, `/demo`, `/workspace`, `/privacy`, and `/terms` in light
  and dark modes find zero serious or critical issues. The live 404 also has
  zero serious/critical findings.
- Axe reports one minor issue on `/demo`: `role="status"` is not allowed on
  the interactive `aside` containing Reset and Start buttons.
- Skip-link use, route heading focus/announcement, CSV file-picker activation,
  visible focus, and reduced-motion overrides pass.
- At 390 px, all routes fit without normal horizontal overflow and the full
  first-read content is visible. Header brand height is 42 px, just below the
  44 px target baseline; row checkbox labels provide 44 px hit areas.
- At 200% text size on a 390 px viewport, every app route overflows to 504–604
  px. The fixed 64 px header pushes navigation above the viewport and Privacy
  off the right edge, causing loss of navigation content. This fails the
  attached 200% text-resize baseline.
- After a checkbox or milestone change, focus falls to `BODY`, as described in
  the functional findings.

## Offline, service worker, performance, and routing

- Live `/demo` reloads offline with the banner and bundled Northstar sample.
- After unregistering the worker, seeding `worklog-appendix-stale-verifier-4`,
  and reinstalling, the stale cache is removed. The active cache is
  `worklog-appendix-ba4c3f7d7776`.
- Lighthouse 13.4.1 mobile `/demo`: Performance **100**, Accessibility **100**,
  Best Practices **100**, SEO **100**; FCP 1.0 s, LCP 1.1 s, Speed Index 1.8 s,
  TBT 80 ms, CLS 0, interactive 1.2 s. A 10-interaction render proxy measured
  135.9 ms maximum; Lighthouse does not emit field INP for a cold lab run.
- Root, demo, workspace, privacy, and terms return 200 with route-specific
  titles. An unknown route returns the styled page with HTTP 404. Every crawled
  internal link returns 200.
- The social image is a real 1200×630 WebP. The landing hero is 1200×800 with
  explicit dimensions.

## Deployment identity

The live deployment exactly matches the candidate's fresh `dist/` output:

| Artifact | Candidate/live SHA-256 |
|---|---|
| `index.html` | `36935bd9277814dc4e334aff6973a71ec1178f586e3311ef5d7300fd58585c32` |
| `main-DJhWmdL3.js` | `577b91b24d645adaa0671d16e60c1b0fd8b6ddffd029f45cefdb3a6d99b7b8dd` |
| `main-DHguV0tF.css` | `90f1fc09c9aa852d973961efde50705835f10e1afa90ebd56f8d63387ccd4bdb` |
| `hero.webp` | `31eba852f18fdf89135007826fba6098ad8cb75779af3a86bcd94e21269e4b68` |
| `social.webp` | `5c76fec6d647285fe433b510b4b62338e35acff0d693d5d7ba9064622e88ec4a` |
| `sw.js` | `e964224e50c88bb4a5a3af3230d662c8c83b252573c33c57fefdf68549852d8d` |

Direct demo, privacy, terms, and workspace HTML also match byte-for-byte.

## Defects by severity

### High

1. **Default redaction removes every ISO work date from the appendix.** This
   destroys core evidence in the normal sample and real CSV flow.
2. **The claims contract is incomplete.** Relied-on date preservation,
   milestone editing, persistence, and demo reset/isolation promises are not
   fully represented and proven by exact tagged claim tests.

### Medium

1. **Keyboard focus is lost after each row inclusion or milestone edit.**
2. **Text resizing to 200% loses navigation and introduces 504–604 px layouts
   at a 390 px viewport.**
3. **Invalid/empty output is printable.** Whitespace group names create blank
   invoice lines, and excluding all rows creates a zero-row appendix.

### Low

1. **The demo banner uses an invalid ARIA role for an interactive `aside`.**
2. **The 404 omits the standard skip link, navigation, and build identifier.**
3. **The researched one-time monetization is absent.** The documented choice
   is honest and core export remains free, but the brief's commercial model is
   not implemented.

## Release requirement

Fix the High findings before another candidate is accepted. Add claim-tagged
regressions proving that redaction preserves common date formats, real storage
persists without network upload, demo state stays isolated and resets, and
milestone editing produces nonblank client lines. Also retain focus after row
edits, block empty/blank exports, and make the header survive 200% text size.
Then rebuild, deploy, and rerun independent verification against the new live
bytes.

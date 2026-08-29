# Adversarial first-read review 1 — Worklog Appendix

Reviewed 2026-08-29 against commit `c541655f9ffd46a74917d42d09b298aefabdfa9c`
and the live site at <https://worklog-appendix.sociobot.in>.

## Verdict

**FAIL — 10 findings: 1 blocking, 3 major, and 6 minor.**

The product is clear on first read, the one-click demo is realistic and isolated,
all 16 declared claim tests pass, and the core workflow works. It does not pass
the requested zero-finding standard because an earlier 404 version defect remains
open, two public promises are not represented exactly in the claims contract,
and several copy and route-structure details remain.

## Findings

### F-1-1 — BLOCKING — The previously disclosed 404 version defect is still present

- Exact quote/location: the live unknown-route footer and
  `public/404.html` say `v1.0.1`; every normal route says `v1.0.2`.
- History: `.factory/handoff.md` explicitly recorded this as a known gap. That
  historical record did not assign an ID, so this review assigns `F-1-1` while
  reopening it as blocking under the review instructions.
- Why this matters: the same deployment presents two release versions. A visitor
  following a bad link cannot tell whether the error page belongs to the current
  product.
- Concrete fix: render the build identifier from one shared source, update the
  404 footer to `v1.0.2`, and add a test that compares the 404 build ID with the
  normal-route footer.

### F-1-2 — MAJOR — “Make the invoice easier to approve” is an unlisted outcome claim

- Exact quote/location: landing page, How it works heading: `Make the invoice
  easier to approve`.
- Why this matters: “easier to approve” promises a client outcome that no
  `.factory/claims.json` entry or test measures. The existing tests prove output,
  not approval effort or likelihood.
- Concrete fix: replace it with `Create the appendix in three steps.` This names
  the section without claiming an unmeasured result. Alternatively, add a defined
  usability measure and a tagged claim test.

### F-1-3 — MAJOR — The broad free-feature promise has no matching claim entry

- Exact quotes/locations:
  - Landing paid section: `Core import, redaction, invoice lines, and PDF printing
    stay free.`
  - README, Optional client presets: `It never gates export, redaction, or
    accessibility features.`
  - README, Privacy: `CSV import, client redaction, invoice lines, and PDF printing
    remain available without a license.`
- Why this matters: `free-core-export` covers only export. Other claim tests happen
  to run without a license, but no claim entry states and tests the full advertised
  no-license boundary, especially accessibility features.
- Concrete fix: add one `free-core-features` claim and one tagged clean-context
  test that imports, redacts, copies invoice lines, prints, and runs the accessibility
  scan without any license token. Point all three locations to that entry, or narrow
  each sentence to `PDF export stays free.`

### F-1-4 — MAJOR — The tool does not help rewrite raw work into client-facing wording

- Exact location: the product promise is `Explain billed work clearly`, but the
  workspace copies each imported description verbatim. Only milestone names can
  be changed, one row at a time.
- Why this matters: a normal freelancer with technical or shorthand worklog text
  still has to do the central explanation work outside the product. Grouping and
  printing improve presentation, but not the wording itself.
- Concrete fix: add an optional `Draft client wording (uses your Sociobot key)`
  action. Show the exact selected descriptions before sending, use a user-supplied
  Sociobot key, stream an editable draft, provide undo, preserve the manual path,
  use a canned demo response, and add a fixture-backed claim test. Do not embed a
  provider key or make the offline workflow depend on it.

### F-1-5 — MINOR — The 404 is designed but not a complete, consistent route

- Exact location: live unknown routes return the custom `Page not found` document.
  It has no meta description, canonical URL, Open Graph metadata, Twitter card,
  favicon, or apple-touch icon. Its header has `Demo`, `Privacy`, and `Terms`, while
  normal routes have `Demo`, `How it works`, and `Privacy`. Its footer omits the art
  provenance line in addition to the stale version in `F-1-1`.
- Why this matters: crawlers and visitors get a different shell and incomplete
  identity on an error route.
- Concrete fix: give `404.html` the same metadata assets, header, and footer as
  normal routes. Keep the correct HTTP 404 status and the existing way home.

### F-1-6 — MINOR — Two landing labels carry no useful section meaning

- Exact quotes/locations: hero eyebrow `PRIVATE INVOICE COMPANION`; preview eyebrow
  `THE RESULT`.
- Why this matters: “companion” is product lore rather than a job, and “the result”
  could label any product. Neither helps when headings are scanned out of context.
- Concrete rewrites: `TURN WORKLOG ROWS INTO AN INVOICE APPENDIX` and `INVOICE
  APPENDIX PREVIEW`.

### F-1-7 — MINOR — Legal-page h1 headings do not name their pages plainly

- Exact quotes/locations: `/privacy` h1 `Your worklog stays close to you`; `/terms`
  h1 `Use this report with care`.
- Why this matters: the first is figurative and the second is generic. A screen-reader
  heading list does not identify Privacy or Terms.
- Concrete rewrites: `How Worklog Appendix stores your data` and `Terms for using
  Worklog Appendix`.

### F-1-8 — MINOR — Three README headings depend on an unexplained “it”

- Exact quotes/locations: README headings `Run it`, `Use it`, and `Check it`.
- Why this matters: the headings do not make sense independently in a heading list.
- Concrete rewrites: `Run Worklog Appendix locally`, `Create an invoice appendix`,
  and `Run tests and build`.

### F-1-9 — MINOR — Subjective wording and unexplained “client presets” reduce copy precision

- Exact quotes/locations:
  - Landing: `Turn rows of work into a readable client document.`
  - Landing: `One readable appendix.`
  - Landing: `Save the clean report as a PDF.`
  - Landing action: `Buy client presets — $19`
  - README: `client-readable invoice appendix` and `client-friendly milestone names`
- Why this matters: “readable,” “clean,” and “client-friendly” are subjective quality
  adjectives. “Client presets” is not explained until surrounding copy is read.
- Concrete rewrites, in order: `Group approved work under dated invoice milestones.`;
  `One dated appendix.`; `Open the report and save it as a PDF.`; `Save reusable
  client details — $19`; `dated, grouped invoice appendix`; and `milestone names
  your client uses`.

### F-1-10 — MINOR — Decorative hero art receives metaphorical alt text

- Exact quote/location: landing hero image alt: `Glowing document layers mark a
  clear path through a dark data landscape.`
- Why this matters: `.factory/design.md` calls the image decorative, while the
  adjacent caption already explains its product meaning. The current alt adds a
  metaphor and duplicate noise for screen-reader users.
- Concrete fix: use `alt=""` for the decorative image and retain the factual
  figcaption. If the image is intended to convey information, use `Layered worklog
  pages connected by milestone markers.`

## Cold first screen — before scrolling

Fresh browser contexts were used at 390 × 844 and 1440 × 900. No state was
carried between them.

| Question | Phone | Desktop |
| --- | --- | --- |
| What does it do? | Turns worklog CSV rows into a ready-to-print explanation of billed work. | Same. The hero and beginning of the invoice preview make the output more explicit. |
| For whom? | Freelancers whose clients review hours before approving an invoice. | Same. |
| What should I click first? | `Try it with sample data`. | `Try it with sample data`. |

The decisive first-screen text was `Explain billed work clearly`, `For freelancers
whose clients need a clear account before they approve invoice hours.`, `Try it
with sample data`, and `See a ready-to-print appendix.` This gate passes at both
widths.

## Copy audit

Counting rule: space-delimited words; hyphenated terms and inline paths/commands
count as one word. No landing or README sentence exceeds 22 words. No banned
plain-words term appears. Findings still apply to vague headings, subjective
adjectives, jargon, and unlisted claims.

### Landing-page sentences

| Words | Exact sentence | Flag |
| ---: | --- | --- |
| 13 | For freelancers whose clients need a clear account before they approve invoice hours. | — |
| 4 | See a ready-to-print appendix. | — |
| 6 | Your CSV stays in this browser. | — |
| 4 | No account or upload. | — |
| 4 | Core export stays free. | — |
| 9 | Turn rows of work into a readable client document. | F-1-9 |
| 3 | One invoice summary. | — |
| 3 | One readable appendix. | F-1-9 |
| 5 | Group approved rows by milestone. | — |
| 8 | Keep dates and completed work beneath each group. | — |
| 9 | 7 Aug — Implemented account summary and invoice history screens. | — |
| 10 | 10 Aug — Fixed mobile table layout and keyboard focus order. | — |
| 8 | 11 Aug — Prepared release checklist and handoff notes. | — |
| 7 | Matching invoice line: Client portal — 8 hours. | — |
| 9 | Use columns for dates, descriptions, hours, and optional milestones. | — |
| 3 | Include approved rows. | — |
| 9 | Rename a milestone when the client needs plainer wording. | — |
| 7 | Save the clean report as a PDF. | F-1-9 |
| 5 | Copy the matching invoice lines. | — |
| 4 | You choose the CSV. | — |
| 11 | Worklog Appendix reads it and prepares the appendix in this browser. | — |
| 10 | Core import, redaction, invoice lines, and PDF printing stay free. | F-1-3 |
| 8 | A $19 one-time license adds saved client presets. | — |
| 3 | Have a license? | — |
| 8 | License checks send only the token to Sociobot. | — |
| 6 | Clear work evidence for client invoices. | — |
| 5 | Illustration generated for this product. | — |

Image alternative text is 11 words: `Glowing document layers mark a clear path
through a dark data landscape.` It is flagged in `F-1-10`.

### Landing headings, labels, and actions

| Words | Exact text | Kind | Flag |
| ---: | --- | --- | --- |
| 3 | PRIVATE INVOICE COMPANION | label | F-1-6 |
| 4 | Explain billed work clearly | h1 | — |
| 5 | Try it with sample data | button | — |
| 2 | THE RESULT | label | F-1-6 |
| 6 | Make the invoice easier to approve | h2 | F-1-2 |
| 3 | Import a CSV | step heading | — |
| 3 | Check the groups | step heading | — |
| 3 | Print the appendix | step heading | — |
| 4 | Your CSV stays local | h2 | — |
| 5 | Read how local storage works | link | — |
| 4 | ONE-TIME LICENSE · $19 USD | label | — |
| 3 | Reuse client details | h2 | — |
| 4 | Buy client presets — $19 | link action | F-1-9 |
| 3 | Paste it here | form instruction | — |
| 2 | Restore license | button | — |

All buttons use verbs and name a result. `Try it with sample data`, `Reset demo`,
`Start for real`, and `Restore license` pass the action-label check. The paid link
is actionable but uses the unexplained term recorded in `F-1-9`.

Other unflagged landing labels are `Worklog Appendix` (2), `Demo` (1), `How it
works` (3), `Privacy` (1), `INV-2048 · NORTHSTAR STUDIO` (3), `Client portal 8
hours` (4), `HOW IT WORKS` (3), `Privacy` (1), and `Terms` (1).

### README sentences

| Words | Exact sentence | Flag |
| ---: | --- | --- |
| 16 | Worklog Appendix turns approved worklog CSV rows into a client-readable invoice appendix and matching invoice lines. | F-1-9 |
| 15 | It is for freelancers who need to explain billed hours without sending a raw timesheet. | — |
| 8 | The app reads worklogs locally in the browser. | — |
| 15 | It does not upload CSV files, require an account, or use analytics or advertising trackers. | — |
| 11 | Contact redaction removes email and phone detail without changing report dates. | — |
| 10 | Core import, redaction, invoice lines, and PDF printing stay free. | F-1-3 |
| 9 | A $19 USD one-time license adds saved client presets. | — |
| 7 | Open the local URL that Vite prints. | — |
| 7 | Use `/demo` for the isolated sample workspace. | — |
| 8 | Import a CSV with `Description` and `Hours` columns. | — |
| 8 | `Date`, `Milestone`, `Status`, and `Internal Notes` are optional. | — |
| 9 | Include the approved rows and choose client-friendly milestone names. | F-1-9 |
| 12 | Empty groups and empty reports are blocked with a clear next step. | — |
| 15 | Check the report preview, copy the matching invoice lines, then choose **Print appendix / save PDF**. | — |
| 9 | A real workspace remains in this browser after reload. | — |
| 14 | Start every clean test at `/demo`, then choose **Start for real** to open `/workspace`. | — |
| 10 | The one-time license saves reusable client, invoice, and billing-period details. | — |
| 8 | It never gates export, redaction, or accessibility features. | F-1-3 |
| 9 | Buy through the Sociobot checkout link in the app. | — |
| 16 | Returning with a license token stores it in this browser and removes it from the URL. | — |
| 14 | You can also paste a license on the landing page or in the workspace. | — |
| 8 | The print dialog is the PDF export path. | — |
| 14 | Choose “Save as PDF” in the browser dialog before attaching it to an invoice. | — |
| 10 | `npm test -- --grep @claim:csv-import` runs one named browser claim test. | — |
| 10 | `npm run build` writes the static deployable site to `dist/`. | — |
| 11 | This is a Vite static site for Azure Static Web Apps. | — |
| 8 | Deploy the `dist/` directory after `npm run build`. | — |
| 14 | `public/staticwebapp.config.json` supplies known app-route rewrites, cache headers, security headers, and the styled 404 response. | — |
| 14 | Report data is kept in browser storage only when you work outside the demo. | — |
| 12 | The demo stays in memory and never saves work as real data. | — |
| 15 | License verification sends only the license token to `api.sociobot.in`, at most once every 24 hours. | — |
| 9 | It never sends worklog rows, client details, or presets. | — |
| 13 | A refunded or revoked license loses preset access while core export stays free. | — |
| 6 | See `/privacy` and `/terms` for details. | — |
| 14 | CSV import, client redaction, invoice lines, and PDF printing remain available without a license. | F-1-3 |
| 1 | MIT. | — |
| 2 | See `LICENSE`. | — |

README heading counts: `Worklog Appendix` (2), `Run it` (2, F-1-8), `Use it`
(2, F-1-8), `Optional client presets` (3), `Check it` (2, F-1-8), `Deploy`
(1), `Privacy` (1), and `License` (1).

Terminology is otherwise consistent: **worklog CSV** is the input, **row** is
one imported item, **milestone** is a report group, **invoice line** is the
copied summary, **appendix/report** is the printable output, and **client preset**
is the paid saved-detail record. `F-1-9` covers the places where those terms are
not yet plain enough.

## Demo and sandbox

**PASS.** From a fresh landing context, one click on `Try it with sample data`
opened `/demo`.

- The first demo screen showed the persistent `Demo — sample data, nothing is
  saved` banner, `Reset demo`, `Start for real`, Northstar Studio, INV-2048,
  a 3–14 August 2026 period, 10 source rows, four milestone groups, and the client
  preview. The 390 px first screen showed the loaded Northstar client field; the
  desktop first screen showed source rows and the preview.
- Importing a temporary row in demo mode and choosing `Reset demo` removed the
  edit and restored Northstar Studio.
- With a real workspace, preset, and license pre-seeded, `/demo` performed zero
  reads, writes, or removals against those protected keys. It created no
  `demo:worklog-appendix` key. `Start for real` restored the untouched real row,
  client, preset, and license.
- The demo flow made no off-origin request. The offline tagged test also passed.

## Claims

The commands below were run separately from clean clone
`/tmp/worklog-appendix-review.Tn7UhV`. Each selected exactly one tagged test.

| Claim ID | Result |
| --- | --- |
| `csv-import` | PASS |
| `invoice-lines` | PASS |
| `pdf-appendix` | PASS |
| `redaction` | PASS |
| `milestone-edit` | PASS |
| `real-workspace-persistence` | PASS |
| `demo-reset-isolation` | PASS |
| `offline-demo` | PASS |
| `local-only` | PASS |
| `free-core-export` | PASS |
| `internal-notes` | PASS |
| `included-rows` | PASS |
| `empty-output` | PASS |
| `client-presets` | PASS |
| `license-daily-verification` | PASS |
| `license-revocation` | PASS |

The live checkout followed to a hosted 200 page showing `Worklog Appendix`,
`$19.00`, and `One-time unlock`. No purchase was made. `F-1-2` and `F-1-3`
record the claim-like sentences not adequately represented in the manifest.

## Earlier findings rechecked from scratch

No `.factory/review-*.md` or `.factory/polish-*.md` exists in the current tree or
repository history. Every historical version of `.factory/handoff.md` was read.
The handoffs did not use stable finding IDs, so the table assigns `H-*` tracking
labels to each distinct recorded defect.

| History item | Current live/code result | Status |
| --- | --- | --- |
| H-01 landing preview contrast | Light/dark AxeBuilder suite passes. | Fixed |
| H-02 malformed/negative Hours | Unit and browser recovery tests pass. | Fixed |
| H-03 privacy/no-upload/no-tracking claim coverage | `local-only` exists and its request/storage test passes. | Fixed |
| H-04 checkout 404 or missing paid feature | Checkout reaches hosted $19 one-time product; preset entitlement test passes. | Fixed |
| H-05 unknown routes returning 200 | Unknown path returns designed HTTP 404. | Fixed |
| H-06 stale, unversioned service-worker cache | Generated cache hash and cache-retirement test pass. | Fixed |
| H-07 390 px horizontal overflow | Live route suite reports no overflow. | Fixed |
| H-08 claim tests bypassing `/demo` | Relevant tests now enter through fresh `/demo` state. | Fixed |
| H-09 redaction proof missing phone/toggle coverage | Live checked/unchecked print comparison proves email and phone removal, raw-detail restoration, and preserved dates; the tagged test covers removal and dates. | Fixed |
| H-10 unreachable real CSV picker | Visible picker and Enter/Space keyboard tests pass. | Fixed |
| H-11 focus contrast below 3:1 | Current 390 px focus-baseline test passes. | Fixed |
| H-12 touch targets below 44 px | Normal and 404 touch-target tests pass. | Fixed |
| H-13 imported markup interpreted as HTML | Hostile CSV text test passes. | Fixed |
| H-14 direct-route canonical/title metadata | Direct `/demo`, `/workspace`, `/privacy`, and `/terms` metadata is correct. | Fixed |
| H-15 internal-note report wording/exclusion | Tagged exclusion test passes. | Fixed |
| H-16 dark-mode contrast | All public routes pass the dark-theme axe suite. | Fixed |
| H-17 SPA Demo link retained real data | Live `/workspace` → `/demo` shows only sample data and the banner. | Fixed |
| H-18 incomplete invoice/free-export/internal-note claims | Entries and tagged tests exist and pass. | Fixed |
| H-19 route focus and announcements | Live forward/back navigation focuses h1 and updates the live region. | Fixed |
| H-20 reduced-motion behavior | Browser regression passes. | Fixed |
| H-21 invalid input and saved-state recovery | Unit/browser regressions pass. | Fixed |
| H-22 sitemap, social image, and asset caching gaps | Sitemap includes five routes; social art is 1200×630; cache tests pass. | Fixed |
| H-23 redaction removed ISO/local dates | Tagged test preserves both date forms. | Fixed |
| H-24 milestone editing not claimed | Tagged rename/invoice-line test passes. | Fixed |
| H-25 persistence and demo reset/isolation not fully claimed | Both tagged tests pass; live storage instrumentation also passes. | Fixed |
| H-26 row edits lost keyboard focus | Focus-retention regression passes. | Fixed |
| H-27 200% text caused clipped routes | Five-route reflow test passes. | Fixed |
| H-28 blank milestones and zero-row reports were allowed | Tagged empty-output test passes. | Fixed |
| H-29 interactive demo banner used an invalid status role | Current banner has no invalid live-region role; regression passes. | Fixed |
| H-30 print report lacked `lang` and `<main>` | Tagged report test and axe scan pass. | Fixed |
| H-31 empty-output promise was unlisted | Claim and exact tagged test exist. | Fixed |
| H-32 singular output said `1 hours`/`1 rows` | Singular-wording regression passes. | Fixed |
| H-33 404 links were under 44 px | 390 px 404 target and axe test passes. | Fixed |
| H-34 researched paid model was absent | $19 saved-client-details feature and live checkout are present. | Fixed |
| H-35 included-row promise was unlisted | `included-rows` claim and output comparison test pass. | Fixed |
| H-36 broad “no timers/invoicing/monitoring” promise was unlisted | Sentence is absent from current copy. | Fixed |
| H-37 negative Rate became a positive charge | Negative and malformed rates are rejected; tests pass. | Fixed |
| H-38 daily verification and refund/revocation promises lacked claims | Both entries and exact tagged tests pass. | Fixed |
| H-39 Privacy misstated what license removal deletes | Current copy distinguishes site-data clearing from license removal; test passes. | Fixed |
| H-40 404 footer remained on v1.0.1 | Live and source still say v1.0.1. | **Open — F-1-1** |

The historical note that no real card was charged is a safe QA boundary, not a
product defect: the hosted checkout was verified without creating a financial
transaction, and deterministic tests cover return, restore, verification,
refund, and revocation states. The browser-native PDF path is also disclosed
accurately and works as claimed.

## Structure, routes, links, accessibility, and identity

- `/`, `/demo`, `/workspace`, `/privacy`, and `/terms` return 200. An unknown
  path returns the designed 404 with a way home.
- Every normal route has the required route-specific title, one h1, description,
  canonical, Open Graph/Twitter image metadata, SVG favicon, 180×180 touch-icon
  artwork, one main landmark, and `lang="en"`.
- SPA navigation and browser back focus the destination h1 and announce the new
  title. Deep links reload correctly.
- The complete link crawl returned 200 for every internal destination. The paid
  link followed to a hosted checkout page with HTTP 200.
- The normal header/footer is consistent across all five product routes.
  `F-1-5` records the 404 exception.
- The live response supplies CSP, HSTS, `nosniff`, and strict-origin referrer
  policy. Runtime requests use same-origin assets; no third-party fonts or scripts
  load.
- The generated luminous-paper art, midnight report field, amber controls, serif
  report type, and document-pane layout match `.factory/design.md` and are distinct
  from a generic centered-hero/three-card SaaS template.
- The factory URL verifier passed the live landing page. The Playwright axe
  integration passed all public routes in light and dark themes, the 404, and the
  generated report. Keyboard, 44 px targets, 200% text, and reduced motion tests
  pass.
- Production JavaScript is 27,141 bytes raw (10.00 KB gzip), below both applicable
  budgets. The hero is 61,526 bytes and the social image is 50,844 bytes.

## Verification commands and results

```text
npm test
  PASS — 12 Vitest tests and 41 Playwright tests

npm run build
  PASS — dist/ produced; JS 27.14 kB raw / 10.00 kB gzip

PLAYWRIGHT_BASE_URL=https://worklog-appendix.sociobot.in npx playwright test
  PASS — 41/41 after the documented production build step

/opt/fleet/lib/verify-url.sh https://worklog-appendix.sociobot.in <temp-dir>
  PASS — HTTP 200, title/lang/h1/main/alt/labels, zero console/page errors
```

An earlier live-suite attempt before building `dist/` produced 39 passing browser
checks and two `ENOENT dist/...` fixture errors. Building first, as documented in
the handoff, removed both errors; the complete rerun passed 41/41.

## What would make this perfect

Resolve every finding above, then rerun the complete review from a fresh clone.
A perfect round has one shared route shell and build ID including the 404, exact
claim coverage for every public promise, headings that remain meaningful out of
context, no subjective filler, and an optional, transparent client-wording step
that preserves the local-first non-AI workflow. The acceptance target is zero
findings, not merely passing automated tests.

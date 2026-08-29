# Adversarial first-read review 2 — Worklog Appendix

Reviewed 2026-08-29 against commit
`f2f146f99bc405246f3cce79c8570484c20d2dd1` and the live site at
<https://worklog-appendix.sociobot.in>.

## Verdict

**FAIL — 7 findings: 1 blocking, 2 major, and 4 minor.**

The cold first screen and one-click demo are clear and usable. All 19 declared
claim tests pass separately from a clean clone, and the complete local and live
browser suites pass 45/45. The product still fails the zero-finding standard:
browser Back loses the visitor's landing-page position, the optional Sociobot
path does not explain where to obtain a key, the paid link does not disclose its
external checkout destination, and four copy/claims-contract defects remain.

## Findings

### F-2-1 — BLOCKING — Back navigation discards the previous page position

- Exact location/evidence: in a fresh 390 × 844 live context, scroll `/` to the
  `How it works` area (`scrollY = 1777`), use the header `Privacy` link, then
  press browser Back. The app returns to `/`, focuses `Turn worklogs into
  invoice appendices`, and sets `scrollY = 0` instead of restoring `1777`.
- Code location: `src/main.ts` handles `popstate` by calling `render()`. Rendering
  replaces the page and always focuses the h1; it does not save or restore a
  history entry's scroll position.
- Why this matters: Back does not return a visitor to where they left the page.
  This is broken routing under the required site-structure contract.
- Concrete fix: store scroll position and prior focus with each history entry,
  restore them after rendering on `popstate`, and add a Playwright regression
  that navigates away from a scrolled landing section and checks Back and
  Forward position/focus restoration.

### F-2-2 — MAJOR — The optional wording feature does not explain how to get a Sociobot key

- Exact quotes/locations: real workspace label `Sociobot key`; helper text
  `Stored only in this browser. Selected descriptions go to api.sociobot.in when
  you choose Draft client wording. Usage is billed at your Sociobot key’s rate.`;
  README: `In a real workspace, paste your own Sociobot key...`.
- Why this matters: a first-time user without an existing key reaches a dead
  end. The feature explains storage, sending, billing, and removal, but provides
  no acquisition path or pay-as-you-go context.
- Concrete fix: add a visible external link beside the field and in the README:
  `Get a key at sociobot.in — pay as you go.` Keep the manual path available and
  disclose the known cost per action, if one is available.

### F-2-3 — MAJOR — The paid action hides that it opens an external checkout

- Exact quote/location: landing and workspace link `Save reusable client details
  — $19` points to `api.sociobot.in` and redirects to
  `checkout.dodopayments.com` in the same tab.
- Why this matters: `Save` sounds like an in-app action. It actually starts a
  purchase and moves the visitor off-site. The site-structure contract requires
  external links to say so.
- Concrete fix: use `Buy saved client details — $19 (opens checkout)` or an
  equally explicit result-naming label. Add an accessible external-destination
  cue and a test that checks the visible label as well as the checkout URL.

### F-2-4 — MINOR — The preview heading is a slogan and changes the output term

- Exact quote/location: landing preview h2 `One invoice summary. One dated
  appendix.`
- Why this matters: the heading does not name the section, and `invoice summary`
  conflicts with the established term `invoice line`. A heading list should not
  require the surrounding preview to explain it.
- Concrete rewrite: `Preview the appendix and matching invoice lines`.

### F-2-5 — MINOR — The footer makes an unlisted subjective claim

- Exact quote/location: every route footer says `Clear work evidence for client
  invoices.`
- Why this matters: `clear` is an unmeasured quality claim, has no
  `.factory/claims.json` entry, and repeats marketing language instead of saying
  what the product does.
- Concrete rewrite: `Turn worklog rows into invoice appendices.` Remove the
  quality adjective rather than adding an artificial clarity test.

### F-2-6 — MINOR — The README build-output promise is not in the claims contract

- Exact quote/location: README, Run tests and build: `` `npm run build` writes
  the deployable static site to `dist/`. ``
- Why this matters: this is an outcome a maintainer relies on, but it has no
  `.factory/claims.json` entry or uniquely tagged test. An untagged production
  artifact test happens to cover related files; the contract does not list it.
- Concrete fix: add a `static-build-output` claim and one
  `@claim:static-build-output` test that builds from a clean checkout and asserts
  the required `dist/` documents and assets.

### F-2-7 — MINOR — The README deployment-config promise is not in the claims contract

- Exact quote/location: README, Deploy the static site:
  `` `public/staticwebapp.config.json` supplies route rewrites, cache headers,
  security headers, and the styled 404 response. ``
- Why this matters: the sentence promises four deployed behaviors. No claim
  entry names them, and the existing untagged config test does not verify every
  listed security header as a served response.
- Concrete fix: either remove this implementation promise from user-facing copy,
  or add a `static-hosting-config` claim with a tagged artifact test and a served
  response test for rewrites, caching, security headers, and the HTTP 404.

## Cold first screen — before scrolling

Fresh browser contexts were used at 390 × 844 and 1440 × 900. No local storage,
cookies, or prior navigation were carried into either check.

| Question | Phone | Desktop |
| --- | --- | --- |
| What does it do? | Turns worklogs into invoice appendices that explain the hours. | Same; the adjacent original illustration reinforces grouped document output. |
| For whom? | Freelancers who need to show clients what invoice hours covered. | Same. |
| What should I click first? | `Try it with sample data`. | `Try it with sample data`. |

The decisive text is `Turn worklogs into invoice appendices`, `For freelancers
who need to show clients what each invoice hour covered`, `Try it with sample
data`, and `Open a ten-row sample appendix.` All three questions are answerable
without scrolling at both widths, so the first-screen gate passes.

## Copy audit

Counting rule: space-delimited words; standalone punctuation marks are not
words. Hyphenated terms, paths, and commands count as one word. No landing or
README sentence exceeds 22 words, and no banned marketing word appears.

### Landing-page copy

The table includes headings, labels, actions, sample copy, and footer text as
well as grammatical sentences so the action and heading rules can be checked.

| Words | Exact copy | Result |
| ---: | --- | --- |
| 7 | Turn worklog rows into an invoice appendix | Pass |
| 5 | Turn worklogs into invoice appendices | Pass |
| 12 | For freelancers who need to show clients what each invoice hour covered. | Pass |
| 5 | Try it with sample data | Pass |
| 5 | Open a ten-row sample appendix. | Pass |
| 6 | Your CSV stays in this browser. | Pass |
| 5 | No account or CSV upload. | Pass |
| 4 | Core export stays free. | Pass |
| 7 | Group approved work under dated invoice milestones. | Pass |
| 3 | Invoice appendix preview | Pass |
| 3 | One invoice summary. | F-2-4 |
| 3 | One dated appendix. | F-2-4 |
| 5 | Group approved rows by milestone. | Pass |
| 8 | Keep dates and completed work beneath each group. | Pass |
| 3 | INV-2048 · Northstar Studio | Pass — sample label |
| 4 | Client portal — 8 hours | Pass — sample label |
| 9 | 7 Aug — Implemented account summary and invoice history screens. | Pass — sample row |
| 10 | 10 Aug — Fixed mobile table layout and keyboard focus order. | Pass — sample row |
| 8 | 11 Aug — Prepared release checklist and handoff notes. | Pass — sample row |
| 7 | Matching invoice line: Client portal — 8 hours. | Pass |
| 3 | How it works | Pass |
| 6 | Create the appendix in three steps | Pass |
| 3 | Import a CSV | Pass |
| 9 | Use columns for dates, descriptions, hours, and optional milestones. | Pass |
| 3 | Check the groups | Pass |
| 3 | Include approved rows. | Pass |
| 9 | Edit wording yourself or ask Sociobot to draft it. | Pass |
| 3 | Print the appendix | Pass |
| 9 | Open the report and save it as a PDF. | Pass |
| 5 | Copy the matching invoice lines. | Pass |
| 4 | Your CSV stays local | Pass |
| 4 | You choose the CSV. | Pass |
| 11 | Worklog Appendix reads it and prepares the appendix in this browser. | Pass |
| 5 | Read how local storage works | Pass |
| 4 | One-time license · $19 USD | Pass |
| 3 | Reuse client details | Pass |
| 12 | Core import, redaction, invoice lines, PDF printing, and accessibility features stay free. | Pass |
| 8 | A $19 one-time license adds saved client details. | Pass |
| 5 | Save reusable client details — $19 | F-2-3 |
| 3 | Have a license? | Pass |
| 3 | Paste it here | Pass |
| 2 | Restore license | Pass |
| 8 | License checks send only the token to Sociobot. | Pass |
| 6 | Clear work evidence for client invoices. | F-2-5 |
| 1 | Privacy | Pass — link |
| 1 | Terms | Pass — link |
| 5 | Built by Param Factory · v1.0.2 | Pass — provenance/build label |
| 5 | Illustration generated for this product. | Pass — provenance |

`Try it with sample data` and `Restore license` use result-naming verbs. The paid
link fails the action/destination check in F-2-3. Terminology is consistent
except for `invoice summary` in F-2-4.

### README sentences

| Words | Exact sentence | Result |
| ---: | --- | --- |
| 17 | Worklog Appendix turns approved worklog CSV rows into a dated, grouped invoice appendix and matching invoice lines. | Pass |
| 15 | It is for freelancers who need to explain billed hours without sending a raw timesheet. | Pass |
| 9 | The app reads CSV files locally in the browser. | Pass |
| 15 | It does not upload the file, require an account, or use analytics or advertising trackers. | Pass |
| 11 | Contact redaction removes email and phone detail without changing report dates. | Pass |
| 12 | CSV import, redaction, invoice lines, PDF printing, and accessibility features remain free. | Pass |
| 9 | A $19 USD one-time license adds saved client details. | Pass |
| 7 | Open the local URL that Vite prints. | Pass |
| 9 | Use `/?demo=1` or `/demo` for the isolated sample workspace. | Pass |
| 8 | Import a CSV with `Description` and `Hours` columns. | Pass |
| 8 | `Date`, `Milestone`, `Status`, and `Internal Notes` are optional. | Pass |
| 11 | Include the approved rows and choose milestone names your client uses. | Pass |
| 11 | Empty groups and empty reports are blocked with a next step. | Pass |
| 8 | Edit descriptions yourself or choose **Draft client wording**. | Pass |
| 6 | Review each draft before applying it. | Pass |
| 16 | Check the report preview, copy the matching invoice lines, then choose **Print appendix / save PDF**. | Pass |
| 9 | A real workspace remains in this browser after reload. | Pass |
| 14 | Start every fresh test at `/?demo=1`, then choose **Start for real** to open `/workspace`. | Pass |
| 12 | The demo uses a canned wording response and makes no Sociobot request. | Pass |
| 18 | In a real workspace, paste your own Sociobot key and review the exact selected descriptions before sending them. | F-2-2 |
| 14 | The app sends only those descriptions to `api.sociobot.in` when you choose **Draft client wording**. | Pass |
| 14 | It streams an editable draft, supports undo, and leaves the manual editing path available. | Pass |
| 10 | The key stays in browser storage until you remove it. | Pass |
| 10 | The one-time license saves reusable client, invoice, and billing-period details. | Pass |
| 13 | It never gates CSV import, redaction, invoice lines, PDF printing, or accessibility features. | Pass |
| 9 | Buy through the Sociobot checkout link in the app. | F-2-3 |
| 16 | Returning with a license token stores it in this browser and removes it from the URL. | Pass |
| 14 | You can also paste a license on the landing page or in the workspace. | Pass |
| 8 | The print dialog is the PDF export path. | Pass |
| 14 | Choose “Save as PDF” in the browser dialog before attaching it to an invoice. | Pass |
| 11 | `npm test -- --grep @claim:csv-import` runs one named browser claim test. | Pass — test instruction |
| 10 | Every command in `.factory/claims.json` must pass from a fresh clone. | Pass — test instruction |
| 10 | `npm run build` writes the deployable static site to `dist/`. | F-2-6 |
| 11 | This is a Vite static site for Azure Static Web Apps. | Pass — implementation identifier |
| 8 | Deploy the `dist/` directory after `npm run build`. | Pass — deploy instruction |
| 13 | `public/staticwebapp.config.json` supplies route rewrites, cache headers, security headers, and the styled 404 response. | F-2-7 |
| 14 | Report data is kept in browser storage only when you work outside the demo. | Pass |
| 12 | The demo stays in memory and never saves work as real data. | Pass |
| 15 | License verification sends only the license token to `api.sociobot.in`, at most once every 24 hours. | Pass |
| 11 | It sends no worklog rows, client details, or saved client details. | Pass |
| 13 | A refunded or revoked license loses saved-detail access while core export stays free. | Pass |
| 6 | See `/privacy` and `/terms` for details. | Pass |
| 1 | MIT. | Pass — confirmed by `LICENSE` |
| 2 | See `LICENSE`. | Pass |

README headings also pass the out-of-context test: `Worklog Appendix` (2), `Run
Worklog Appendix locally` (4), `Create an invoice appendix` (4), `Draft optional
client wording` (4), `Save reusable client details` (4), `Run tests and build`
(4), `Deploy the static site` (4), `Privacy details` (2), and `License` (1).

Terminology is otherwise consistent: **worklog row** is the imported record,
**milestone** is the report group, **appendix** is the printable document,
**invoice line** is the matching invoice text, **redaction** removes contact
detail, **saved client details** are the paid reusable fields, and **wording
draft** is the optional Sociobot output.

## Demo and sandbox

**PASS.** From a fresh landing context, one click on `Try it with sample data`
opened `/?demo=1`.

- The first mobile screen after the click already showed the persistent `Demo —
  sample data, nothing is saved` banner, Reset and Start actions, `Build a worklog
  appendix`, the loaded-worklog status, and the Northstar Studio client field.
  Desktop also showed the invoice number, billing period, redaction option, and
  populated wording panel without another setup step.
- The sample contains 10 realistic Northstar Studio rows, four approved preview
  milestones, and one unchecked pending row.
- `Reset demo` removes imported demo changes and restores the shipped sample.
- A pre-seeded real workspace, saved details, license, and Sociobot key remain
  untouched while the demo banner is present. Demo edits stay in memory; there
  is no `demo:worklog-appendix` local-storage key. `Start for real` reveals the
  untouched real workspace.
- The demo flow and canned wording draft make no off-origin request. The core
  real-workspace import flow makes only same-origin GET/HEAD requests and stores
  the report in the documented real key.
- After one online visit, the demo sample reloads and resets offline through the
  service worker.

## Declared claims

The repository was cloned locally to
`/tmp/worklog-appendix-review2.ja6ZZs`. `npm ci` was run there, followed by every
exact command in `.factory/claims.json`, separately. Each command selected one
tagged browser test.

| Claim ID | Result |
| --- | --- |
| `demo-sample-shape` | PASS |
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
| `free-core-features` | PASS |
| `client-wording-draft` | PASS |
| `internal-notes` | PASS |
| `included-rows` | PASS |
| `empty-output` | PASS |
| `client-presets` | PASS |
| `license-daily-verification` | PASS |
| `license-revocation` | PASS |

No declared claim test failed. F-2-5, F-2-6, and F-2-7 are public claim-like
sentences without claim entries, so the claims audit is not complete despite the
19 passing declarations.

## Earlier findings rechecked

### Review 1 findings

| Earlier ID | Live and code check | Status |
| --- | --- | --- |
| F-1-1 | Normal and unknown-route footers both show `v1.0.2`; the 404 uses the build token and returns HTTP 404. | Fixed |
| F-1-2 | The unmeasured approval heading is now `Create the appendix in three steps`. | Fixed |
| F-1-3 | `free-core-features` exists and its clean no-license test passes. | Fixed |
| F-1-4 | Optional wording shows selected text, uses a canned demo, streams the fixture, stays editable, applies, undoes, and keeps manual editing. F-2-2 is a new acquisition-help defect, not a regression of those requested behaviors. | Fixed |
| F-1-5 | The live 404 has complete metadata, the standard nav/footer, provenance, current version, 44 px links, a way home, and zero serious/critical Axe results. | Fixed |
| F-1-6 | Labels now name the job and preview: `TURN WORKLOG ROWS...` and `INVOICE APPENDIX PREVIEW`. | Fixed |
| F-1-7 | Legal h1 text plainly names data storage and terms. | Fixed |
| F-1-8 | README headings now name their sections without unexplained `it`. | Fixed |
| F-1-9 | All six requested precision rewrites remain in live/source copy. F-2-3 concerns the checkout destination, not the former preset jargon. | Fixed |
| F-1-10 | The decorative hero image has `alt=""`; the factual caption remains. | Fixed |

### Historical H-01 through H-40 items carried by review 1

| ID | Independent result this round | Status |
| --- | --- | --- |
| H-01 | All public routes pass serious/critical Axe checks in both themes. | Fixed |
| H-02 | Invalid and negative hours recovery tests pass. | Fixed |
| H-03 | `local-only` request/storage test passes. | Fixed |
| H-04 | The live $19 link reaches a hosted checkout; entitlement test passes. | Fixed |
| H-05 | A cold unknown path returns the designed HTTP 404. | Fixed |
| H-06 | Versioned service-worker cache/update tests pass. | Fixed |
| H-07 | Live landing and demo have no 390 px horizontal overflow. | Fixed |
| H-08 | Every declared claim test starts through the documented demo sandbox where applicable. | Fixed |
| H-09 | Redaction removes email/phone and preserves both date formats. | Fixed |
| H-10 | The visible CSV picker works with Enter and Space. | Fixed |
| H-11 | The 390 px focus-color baseline test passes. | Fixed |
| H-12 | The 390 px touch-target test passes. | Fixed |
| H-13 | Imported hostile markup remains text. | Fixed |
| H-14 | Every direct route has its route-specific title and canonical metadata. | Fixed |
| H-15 | Internal notes are absent from preview and print output. | Fixed |
| H-16 | Dark-theme route scans pass. | Fixed |
| H-17 | Workspace-to-demo navigation exposes only sample data. | Fixed |
| H-18 | Invoice lines, free export, and internal-note claims remain declared and pass. | Fixed |
| H-19 | Route heading focus and live announcements pass. F-2-1 is the separately required history-position defect. | Fixed |
| H-20 | Reduced-motion behavior passes. | Fixed |
| H-21 | Invalid-input and saved-state recovery tests pass. | Fixed |
| H-22 | Sitemap, 1200 × 630 social art, and asset-cache tests pass. | Fixed |
| H-23 | Redaction retains ISO and localized dates. | Fixed |
| H-24 | Milestone rename updates its invoice line. | Fixed |
| H-25 | Persistence and demo isolation/reset claims pass. | Fixed |
| H-26 | Row edits retain keyboard focus in the regression suite. | Fixed |
| H-27 | Five live routes reflow at 200% without clipped navigation. | Fixed |
| H-28 | Blank milestone and zero-included-row output remain blocked. | Fixed |
| H-29 | Demo banner has no invalid live-region role. | Fixed |
| H-30 | Printed report has `lang`, one main, and no serious/critical Axe result. | Fixed |
| H-31 | `empty-output` remains declared and passes. | Fixed |
| H-32 | Singular row/hour wording test passes. | Fixed |
| H-33 | 404 links meet the 44 px target baseline. | Fixed |
| H-34 | Saved client details remain implemented behind the $19 license. | Fixed |
| H-35 | `included-rows` remains declared and passes. | Fixed |
| H-36 | The broad timers/invoicing/monitoring sentence remains absent. | Fixed |
| H-37 | Negative and malformed rates remain rejected. | Fixed |
| H-38 | Daily verification and revocation claims remain declared and pass. | Fixed |
| H-39 | Privacy copy still distinguishes key removal from retained report/details. | Fixed |
| H-40 | The stale 404 version is absent; all footers show `v1.0.2`. | Fixed |

All 30 historical revisions of `.factory/handoff.md` were also read directly.
The one post-review-1 handoff blocker not represented by H-01 through H-40 was
verification 9's unlisted `ten-row` sample promise. It is fixed by the current
`demo-sample-shape` entry and passing exact test. The initial browser-native PDF
dependency is now disclosed in the README and works through the print dialog;
the formerly unregistered paid feature is now a working hosted checkout plus a
tested saved-details entitlement. Notes that no QA worker made a real financial
transaction are verification boundaries, not unresolved product defects.

No F-1 or H item is reopened. F-2-1 is a previously untested requirement rather
than a regression of H-19's heading-focus/announcement scope.

## Structure, accessibility, links, and identity

- `/`, `/demo`, `/workspace`, `/privacy`, and `/terms` return 200. A cold unknown
  path returns the designed HTTP 404 with a way home.
- Every route has `lang="en"`, one h1, one main, route-specific title and
  description, canonical, Open Graph/Twitter metadata, social image, SVG favicon,
  and touch icon. The header/footer shell is consistent, including the 404.
- All unique landing links were crawled. Internal links returned 200; the paid
  link reached a live hosted checkout with HTTP 200. F-2-3 records its undisclosed
  external destination. No dead link was found.
- Deep links reload into the correct route. SPA navigation focuses and announces
  the next h1. F-2-1 records Back/Forward position restoration.
- The response supplies CSP, `nosniff`, strict-origin referrer policy, and HSTS.
  No third-party font or script request occurs. The page produced no console or
  page error.
- The factory verifier returned HTTP 200 in 726 ms, one h1, `lang=en`, a main
  landmark, zero missing alt attributes, zero unlabeled buttons, and zero errors.
- The full local and live suites include keyboard, light/dark Axe, 44 px targets,
  200% reflow, reduced motion, offline service worker, and print-report checks.
- Built JavaScript is 34.95 kB raw and 12.30 kB gzip, below the 150 kB static-site
  budget.
- The midnight document field, pale paper, amber waypoints, serif report type,
  layered generated art, and ruled panes match `.factory/design.md`. The site is
  recognisable and does not use a generic centered-gradient/three-card SaaS look.

## Missed leverage and AI review

The core implied leverage is present: CSV import, invoice-line copy, print/PDF
export, saved client details, and optional wording help. Sync would conflict with
the local-first purpose and is not an obvious omission. The Sociobot feature is
explicit, opt-in, previewed before sending, demo-canned, editable, undoable,
fixture-tested, and backed by a manual path. No provider or Azure key is embedded.
F-2-2 is the remaining explanation/acquisition gap.

## Verification summary

```text
Clean clone: /tmp/worklog-appendix-review2.ja6ZZs
19/19 exact claims.json commands: PASS separately
npm test: 12/12 Vitest and 45/45 Playwright PASS
npm run build: PASS; dist/ produced
PLAYWRIGHT_BASE_URL=https://worklog-appendix.sociobot.in npx playwright test:
  45/45 PASS
/opt/fleet/lib/verify-url.sh https://worklog-appendix.sociobot.in <temp-dir>:
  PASS; no console/page/accessibility baseline errors
Independent live Back-position check: FAIL — F-2-1
```

## What would make this perfect

Restore scroll and focus across Back/Forward, explain how to obtain a Sociobot
key, disclose the external paid checkout in its action label, replace the preview
slogan and subjective footer, and list or remove both README implementation
claims. Then rerun every claim, the complete route/link/accessibility suite, and
this review from a clean browser and clean clone. Perfect means zero findings and
no unlisted claim; this round is not PASS-adjacent while F-2-1 remains.

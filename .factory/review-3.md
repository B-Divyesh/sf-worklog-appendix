# Adversarial first-read review 3 — Worklog Appendix

Reviewed 2026-08-29 against source commit `16f6c4a4ab54451701c7f661b2a5247f28f51e6e` and the cold production site at <https://worklog-appendix.sociobot.in>.

## Verdict

**PASS — zero findings.**

No blocking, major, minor, unlisted-claim, or untested-claim finding remains. `.factory/brief.json` is absent, so the product scope and missed-leverage check used the shipped app, README, claims contract, design thesis, and prior reviews.

## Cold first read

Fresh browser contexts at 390 × 844 and 1440 × 900 loaded `/` at scroll position zero with no off-origin request and no page error.

Before scrolling, the product communicates all three required facts:

- **What it does:** turns worklogs into invoice appendices.
- **For whom:** freelancers who need to show clients what each invoice hour covered.
- **What to click first:** **Try it with sample data**, which says it opens a ten-row sample appendix.

At 390px, `document.body.scrollWidth` was 390px. The action, its outcome, and all three factual privacy/price lines were visible in the first screen. The desktop first screen presented the same copy plus decorative original artwork; the artwork contains no required text.

## Copy audit

Counting rule: whitespace-separated words; buttons and headings are included because they are visitor-facing copy. Every item is at most 22 words, names a concrete thing or action, uses the consistent terminology table in `.factory/copy-audit.md`, and has no banned marketing adjective, unexplained mood heading, or non-result button. No copy finding.

### Landing page

| Words | Sentence or visitor-facing phrase | Result |
| ---: | --- | --- |
| 4 | Skip to main content | Pass |
| 2 | Worklog Appendix | Pass |
| 1 | Demo | Pass |
| 3 | How it works | Pass |
| 1 | Privacy | Pass |
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
| 7 | Preview the appendix and matching invoice lines | Pass |
| 5 | Group approved rows by milestone. | Pass |
| 8 | Keep dates and completed work beneath each group. | Pass |
| 3 | INV-2048 · Northstar Studio | Pass |
| 3 | Client portal — 8 hours | Pass |
| 9 | 7 Aug — Implemented account summary and invoice history screens. | Pass |
| 10 | 10 Aug — Fixed mobile table layout and keyboard focus order. | Pass |
| 8 | 11 Aug — Prepared release checklist and handoff notes. | Pass |
| 7 | Matching invoice line: Client portal — 8 hours | Pass |
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
| 5 | One-time license · $19 USD | Pass |
| 3 | Reuse client details | Pass |
| 12 | Core import, redaction, invoice lines, PDF printing, and accessibility features stay free. | Pass |
| 9 | A $19 one-time license adds saved client details. | Pass |
| 7 | Buy saved client details — $19 (opens checkout) | Pass |
| 5 | Have a license? Paste it here | Pass |
| 2 | Restore license | Pass |
| 7 | License checks send only the token to Sociobot. | Pass |
| 7 | Turn worklog rows into invoice appendices. | Pass |
| 1 | Privacy | Pass |
| 1 | Terms | Pass |
| 4 | Built by Param Factory | Pass |
| 5 | Illustration generated for this product. | Pass |

### README

| Words | Sentence | Result |
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
| 18 | In a real workspace, paste your own Sociobot key and review the exact selected descriptions before sending them. | Pass |
| 9 | Get a key at sociobot.in — pay as you go. | Pass |
| 14 | The app sends only those descriptions to `api.sociobot.in` when you choose **Draft client wording**. | Pass |
| 14 | It streams an editable draft, supports undo, and leaves the manual editing path available. | Pass |
| 10 | The key stays in browser storage until you remove it. | Pass |
| 10 | The one-time license saves reusable client, invoice, and billing-period details. | Pass |
| 13 | It never gates CSV import, redaction, invoice lines, PDF printing, or accessibility features. | Pass |
| 11 | Choose **Buy saved client details — $19 (opens checkout)** in the app. | Pass |
| 16 | Returning with a license token stores it in this browser and removes it from the URL. | Pass |
| 14 | You can also paste a license on the landing page or in the workspace. | Pass |
| 8 | The print dialog is the PDF export path. | Pass |
| 14 | Choose “Save as PDF” in the browser dialog before attaching it to an invoice. | Pass |
| 11 | `npm test -- --grep @claim:csv-import` runs one named browser claim test. | Pass |
| 10 | Every command in `.factory/claims.json` must pass from a fresh clone. | Pass |
| 10 | `npm run build` writes the deployable static site to `dist/`. | Pass |
| 11 | This is a Vite static site for Azure Static Web Apps. | Pass |
| 8 | Deploy the `dist/` directory after `npm run build`. | Pass |
| 14 | Report data is kept in browser storage only when you work outside the demo. | Pass |
| 12 | The demo stays in memory and never saves work as real data. | Pass |
| 15 | License verification sends only the license token to `api.sociobot.in`, at most once every 24 hours. | Pass |
| 11 | It sends no worklog rows, client details, or saved client details. | Pass |
| 13 | A refunded or revoked license loses saved-detail access while core export stays free. | Pass |
| 6 | See `/privacy` and `/terms` for details. | Pass |
| 1 | MIT. | Pass |
| 2 | See `LICENSE`. | Pass |

All landing and README claim-like sentences map to a declared contract: import/group/output to `csv-import`, `invoice-lines`, `pdf-appendix`, `milestone-edit`, `included-rows`, or `empty-output`; demo to `demo-sample-shape`, `demo-reset-isolation`, and `offline-demo`; privacy to `local-only`, `real-workspace-persistence`, and `demo-reset-isolation`; free/paid licensing to `free-core-export`, `free-core-features`, `client-presets`, `license-daily-verification`, and `license-revocation`; wording to `client-wording-draft`; and redaction to `redaction`. No unlisted claim was found.

## Demo and privacy sandbox

The landing action entered `/?demo=1` in one click. The first screen was already a ten-row Northstar Studio workspace with four approved milestone groups. The persistent `Demo — sample data, nothing is saved` banner, **Reset demo**, and **Start for real** were present.

I replaced the sample through the visible CSV picker, then reset it. Reset restored ten sample rows, removed the changed row, left `worklog-appendix` and `demo:worklog-appendix` unset in the fresh context, and made no off-origin request. The declared isolation test separately seeded real workspace, preset, and license data and passed, proving demo does not use it. The service-worker/offline claim test passed from the clean clone. The optional wording action uses the canned response in demo and no network request; the real-workspace path is explicit, BYOK, editable, and undoable.

## Claims and verification

Fresh acceptance clone: `/tmp/worklog-appendix-review3.WLYy2E`.

Each exact command named by all 20 entries in `.factory/claims.json` was run independently and passed:

`demo-sample-shape`, `csv-import`, `invoice-lines`, `pdf-appendix`, `redaction`, `milestone-edit`, `real-workspace-persistence`, `demo-reset-isolation`, `offline-demo`, `local-only`, `free-core-export`, `free-core-features`, `client-wording-draft`, `internal-notes`, `included-rows`, `empty-output`, `client-presets`, `license-daily-verification`, `license-revocation`, and `static-build-output`.

The clean clone then passed `npm test`: 12/12 unit tests and 47/47 Playwright tests. `npm run build` passed and produced `dist/` (36.56 kB raw JavaScript / 12.77 kB gzip and 16.16 kB raw CSS / 4.38 kB gzip). The production verifier reported HTTP 200, title, `lang=en`, one h1, a main landmark, no missing image alt attributes, no unlabeled buttons, and no page errors. Direct production request logging on the landing and demo flow recorded no off-origin request.

Live route, metadata, and link checks passed for `/`, `/demo`, `/workspace`, `/privacy`, `/terms`, and `/#how`; all returned 200. The disclosed checkout followed to a 200 Dodo checkout URL. An unknown address returned the designed HTTP 404. Every route had its route-specific title, description, canonical URL, social metadata, favicon, and touch icon. The 404 retained the complete shell and shared `v1.0.2` build identifier. Light and dark Axe scans found no serious or critical issue on all public routes and the 404; normal-route console logging was clean.

The header/footer shell, skip link, semantic heading outline, focus announcement, back/forward scroll restoration, mobile reflow, 44px targets, reduced-motion behavior, original luminous-document artwork, and no-CDN asset policy are covered by the local browser suite and direct production inspection. The live landing made no third-party request before an explicit optional Sociobot action.

## Earlier findings rechecked

Every earlier review and polish document was read. The following checks were made in both current source and the live result; no identifier is reopened.

| Earlier ID | Current confirmation |
| --- | --- |
| F-1-1 | Normal and 404 footers use the shared `v1.0.2` build token. |
| F-1-2 | The unmeasured approval slogan is absent; the section says `Create the appendix in three steps`. |
| F-1-3 | `free-core-features` is declared and its no-license flow passes. |
| F-1-4 | Optional client wording is explicit, canned in demo, BYOK in real use, editable, and undoable. |
| F-1-5 | The live 404 is a real 404 with complete metadata, shell, focus, and return link. |
| F-1-6 | Landing labels name the job and invoice-appendix preview. |
| F-1-7 | Privacy and Terms h1 headings identify their pages plainly. |
| F-1-8 | README headings name their subjects. |
| F-1-9 | Subjective wording and unexplained paid terminology remain absent. |
| F-1-10 | The decorative image has empty alt text and the factual caption remains in HTML. |
| F-2-1 | Back/Forward restores position and focus; the browser regression passes. |
| F-2-2 | The wording panel and README include the pay-as-you-go key-acquisition link. |
| F-2-3 | Paid action names the $19 external checkout. |
| F-2-4 | Preview uses `appendix` consistently and names its section. |
| F-2-5 | Footer is the factual product description, not a subjective outcome claim. |
| F-2-6 | `static-build-output` is declared and passes from the clean clone. |
| F-2-7 | README no longer makes an unnecessary hosting-configuration promise. |
| H-01 | Light/dark preview accessibility regression passes. |
| H-02 | Invalid and negative Hours recovery passes. |
| H-03 | Local-only privacy contract and request log pass. |
| H-04 | Paid saved-client-details checkout and entitlement flow pass. |
| H-05 | Unknown URLs return a designed HTTP 404. |
| H-06 | Service-worker cache is release-specific and retires old caches. |
| H-07 | 390px route reflow has no horizontal overflow. |
| H-08 | Declared claim tests use the documented demo sandbox where applicable. |
| H-09 | Redaction removes email/phone data and preserves dates. |
| H-10 | The visible CSV picker works with keyboard Enter and Space. |
| H-11 | The designed focus indicator meets the tested contrast baseline. |
| H-12 | Required controls meet the 44px target baseline. |
| H-13 | Hostile CSV markup remains text. |
| H-14 | Direct route documents retain route-specific metadata and canonical URLs. |
| H-15 | Internal notes stay out of preview and print output. |
| H-16 | Dark-theme route scans pass. |
| H-17 | Workspace-to-demo navigation shows isolated sample data. |
| H-18 | Invoice, free-export, and internal-note behaviors remain declared. |
| H-19 | Route focus, announcement, and history restoration pass. |
| H-20 | Reduced-motion behavior is instant. |
| H-21 | Invalid input and corrupt saved-state recovery pass. |
| H-22 | Sitemap, social art, and asset-cache coverage pass. |
| H-23 | Redaction retains ISO and localized dates. |
| H-24 | Milestone rename updates matching invoice lines. |
| H-25 | Real persistence and demo reset/isolation pass. |
| H-26 | Row edits retain keyboard focus. |
| H-27 | 200% text reflow passes on every public app route. |
| H-28 | Blank milestones and zero-row output are blocked with recovery text. |
| H-29 | Demo banner has valid semantics. |
| H-30 | The print report has `lang`, one main landmark, and passes Axe. |
| H-31 | Empty-output behavior remains declared. |
| H-32 | Singular row/hour grammar passes. |
| H-33 | 404 links meet the 44px target baseline. |
| H-34 | The $19 saved-client-details feature remains implemented. |
| H-35 | Included-row behavior remains declared. |
| H-36 | The broad untested timers/invoicing/monitoring statement remains absent. |
| H-37 | Negative and malformed rates are rejected. |
| H-38 | Daily verification and revocation claims remain declared and pass. |
| H-39 | License-removal wording distinguishes retained report/details. |
| H-40 | The stale 404 version remains removed. |

## What would make this perfect

Nothing actionable remains in the reviewed scope. Retain the current clean-clone claim loop, one-click isolated demo, and historical regression coverage as the next release changes the product.

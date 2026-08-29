# Copy audit

Counting rule: words are separated by spaces. Hyphenated terms, commands, and paths count as one word. No sentence exceeds 22 words. No banned marketing term appears.

## Landing page

| Words | Sentence or label | Result |
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
| 6 | One invoice summary. One dated appendix. | Pass |
| 5 | Group approved rows by milestone. | Pass |
| 8 | Keep dates and completed work beneath each group. | Pass |
| 6 | Create the appendix in three steps | Pass |
| 9 | Use columns for dates, descriptions, hours, and optional milestones. | Pass |
| 3 | Include approved rows. | Pass |
| 9 | Edit wording yourself or ask Sociobot to draft it. | Pass |
| 9 | Open the report and save it as a PDF. | Pass |
| 5 | Copy the matching invoice lines. | Pass |
| 4 | Your CSV stays local | Pass |
| 4 | You choose the CSV. | Pass |
| 11 | Worklog Appendix reads it and prepares the appendix in this browser. | Pass |
| 3 | Reuse client details | Pass |
| 12 | Core import, redaction, invoice lines, PDF printing, and accessibility features stay free. | Pass |
| 9 | A $19 one-time license adds saved client details. | Pass |
| 6 | Save reusable client details — $19 | Pass |
| 7 | Have a license? Paste it here. | Pass |
| 8 | License checks send only the token to Sociobot. | Pass |

## README

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
| 14 | The app sends only those descriptions to `api.sociobot.in` when you choose **Draft client wording**. | Pass |
| 14 | It streams an editable draft, supports undo, and leaves the manual editing path available. | Pass |
| 10 | The key stays in browser storage until you remove it. | Pass |
| 10 | The one-time license saves reusable client, invoice, and billing-period details. | Pass |
| 13 | It never gates CSV import, redaction, invoice lines, PDF printing, or accessibility features. | Pass |
| 9 | Buy through the Sociobot checkout link in the app. | Pass |
| 16 | Returning with a license token stores it in this browser and removes it from the URL. | Pass |
| 14 | You can also paste a license on the landing page or in the workspace. | Pass |
| 8 | The print dialog is the PDF export path. | Pass |
| 14 | Choose “Save as PDF” in the browser dialog before attaching it to an invoice. | Pass |
| 11 | `npm test -- --grep @claim:csv-import` runs one named browser claim test. | Pass |
| 10 | Every command in `.factory/claims.json` must pass from a fresh clone. | Pass |
| 10 | `npm run build` writes the deployable static site to `dist/`. | Pass |
| 11 | This is a Vite static site for Azure Static Web Apps. | Pass |
| 8 | Deploy the `dist/` directory after `npm run build`. | Pass |
| 13 | `public/staticwebapp.config.json` supplies route rewrites, cache headers, security headers, and the styled 404 response. | Pass |
| 14 | Report data is kept in browser storage only when you work outside the demo. | Pass |
| 12 | The demo stays in memory and never saves work as real data. | Pass |
| 15 | License verification sends only the license token to `api.sociobot.in`, at most once every 24 hours. | Pass |
| 11 | It sends no worklog rows, client details, or saved client details. | Pass |
| 13 | A refunded or revoked license loses saved-detail access while core export stays free. | Pass |
| 6 | See `/privacy` and `/terms` for details. | Pass |
| 1 | MIT. | Pass |
| 2 | See `LICENSE`. | Pass |

## Terminology

| Concept | Term |
| --- | --- |
| Imported time record | worklog row |
| Client-facing grouping | milestone |
| Output document | appendix |
| Text for an invoice | invoice line |
| Removing contact detail | redaction |
| Reusable report fields | saved client details |
| Paid feature access | license |
| Optional rewrite output | wording draft |

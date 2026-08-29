# Worklog Appendix

Worklog Appendix turns approved worklog CSV rows into a dated, grouped invoice appendix and matching invoice lines. It is for freelancers who need to explain billed hours without sending a raw timesheet.

The app reads CSV files locally in the browser. It does not upload the file, require an account, or use analytics or advertising trackers. Contact redaction removes email and phone detail without changing report dates.

CSV import, redaction, invoice lines, PDF printing, and accessibility features remain free. A $19 USD one-time license adds saved client details.

## Run Worklog Appendix locally

```sh
npm ci
npm run dev
```

Open the local URL that Vite prints. Use `/?demo=1` or `/demo` for the isolated sample workspace.

## Create an invoice appendix

1. Import a CSV with `Description` and `Hours` columns. `Date`, `Milestone`, `Status`, and `Internal Notes` are optional.
2. Include the approved rows and choose milestone names your client uses. Empty groups and empty reports are blocked with a next step.
3. Edit descriptions yourself or choose **Draft client wording**. Review each draft before applying it.
4. Check the report preview, copy the matching invoice lines, then choose **Print appendix / save PDF**.

A real workspace remains in this browser after reload. Start every fresh test at `/?demo=1`, then choose **Start for real** to open `/workspace`.

## Draft optional client wording

The demo uses a canned wording response and makes no Sociobot request. In a real workspace, paste your own Sociobot key and review the exact selected descriptions before sending them. [Get a key at sociobot.in — pay as you go](https://sociobot.in).

The app sends only those descriptions to `api.sociobot.in` when you choose **Draft client wording**. It streams an editable draft, supports undo, and leaves the manual editing path available. The key stays in browser storage until you remove it.

## Save reusable client details

The one-time license saves reusable client, invoice, and billing-period details. It never gates CSV import, redaction, invoice lines, PDF printing, or accessibility features.

Choose **Buy saved client details — $19 (opens checkout)** in the app. Returning with a license token stores it in this browser and removes it from the URL. You can also paste a license on the landing page or in the workspace.

The print dialog is the PDF export path. Choose “Save as PDF” in the browser dialog before attaching it to an invoice.

## Run tests and build

```sh
npm test
npm run build
```

`npm test -- --grep @claim:csv-import` runs one named browser claim test. Every command in `.factory/claims.json` must pass from a fresh clone. `npm run build` writes the deployable static site to `dist/`.

## Deploy the static site

This is a Vite static site for Azure Static Web Apps. Deploy the `dist/` directory after `npm run build`.

## Privacy details

Report data is kept in browser storage only when you work outside the demo. The demo stays in memory and never saves work as real data.

License verification sends only the license token to `api.sociobot.in`, at most once every 24 hours. It sends no worklog rows, client details, or saved client details. A refunded or revoked license loses saved-detail access while core export stays free. See `/privacy` and `/terms` for details.

## License

MIT. See [LICENSE](LICENSE).

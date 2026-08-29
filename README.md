# Worklog Appendix

Worklog Appendix turns approved worklog CSV rows into a client-readable invoice appendix and matching invoice lines. It is for freelancers who need to explain billed hours without sending a raw timesheet.

The app reads worklogs locally in the browser. It does not upload CSV files, require an account, or use analytics or advertising trackers. Contact redaction removes email and phone detail without changing report dates.

Core import, redaction, invoice lines, and PDF printing stay free. A $19 USD one-time license adds saved client presets.

## Run it

```sh
npm ci
npm run dev
```

Open the local URL that Vite prints. Use `/demo` for the isolated sample workspace.

## Use it

1. Import a CSV with `Description` and `Hours` columns. `Date`, `Milestone`, `Status`, and `Internal Notes` are optional.
2. Include the approved rows and choose client-friendly milestone names. Empty groups and empty reports are blocked with a clear next step.
3. Check the report preview, copy the matching invoice lines, then choose **Print appendix / save PDF**.

A real workspace remains in this browser after reload. Start every clean test at `/demo`, then choose **Start for real** to open `/workspace`.

## Optional client presets

The one-time license saves reusable client, invoice, and billing-period details. It never gates export, redaction, or accessibility features.

Buy through the Sociobot checkout link in the app. Returning with a license token stores it in this browser and removes it from the URL. You can also paste a license on the landing page or in the workspace.

The print dialog is the PDF export path. Choose “Save as PDF” in the browser dialog before attaching it to an invoice.

## Check it

```sh
npm test
npm run build
```

`npm test -- --grep @claim:csv-import` runs one named browser claim test. `npm run build` writes the static deployable site to `dist/`.

## Deploy

This is a Vite static site for Azure Static Web Apps. Deploy the `dist/` directory after `npm run build`. `public/staticwebapp.config.json` supplies known app-route rewrites, cache headers, security headers, and the styled 404 response.

## Privacy

Report data is kept in browser storage only when you work outside the demo. The demo stays in memory and never saves work as real data.

License verification sends only the license token to `api.sociobot.in`, at most once per day. It never sends worklog rows, client details, or presets. See `/privacy` and `/terms` for details.

CSV import, client redaction, invoice lines, and PDF printing remain available without a license.

## License

MIT. See [LICENSE](LICENSE).

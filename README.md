# Worklog Appendix

Worklog Appendix turns approved worklog CSV rows into a client-readable invoice appendix and matching invoice lines. It is for freelancers who need to explain billed hours without sending a raw timesheet.

The app runs locally in the browser. It does not upload CSV files, require an account, or use analytics or advertising trackers. Contact redaction removes email and phone detail without changing report dates.

## Run it

```sh
npm install
npm run dev
```

Open the local URL that Vite prints. Use `/demo` for the isolated sample workspace.

## Use it

1. Import a CSV with `Description` and `Hours` columns. `Date`, `Milestone`, `Status`, and `Internal Notes` are optional.
2. Include the approved rows and choose client-friendly milestone names. Empty groups and empty reports are blocked with a clear next step.
3. Check the report preview, copy the matching invoice lines, then choose **Print appendix / save PDF**.

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

Report data is kept in browser storage only when you work outside the demo. The demo uses a separate temporary namespace and never saves work as real data. See `/privacy` and `/terms` for details.

The product includes CSV import, client redaction, invoice lines, and PDF printing at no cost.

## License

MIT. See [LICENSE](LICENSE).

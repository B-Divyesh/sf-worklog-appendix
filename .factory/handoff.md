# Worklog Appendix handoff

## Shipped

- A local-first CSV workspace that imports worklogs, filters approved rows, groups them into client-facing milestones, and copies matching invoice lines.
- A print-specific client appendix. The browser print dialog provides the PDF save workflow.
- Redaction for email addresses and phone numbers in client-facing work descriptions. Internal notes are shown as excluded in the workspace and never enter the appendix.
- Isolated `/demo` sample workspace with a persistent banner, reset action, separate `demo:worklog-appendix` namespace, and offline-first shell caching.
- `/privacy`, `/terms`, styled 404, SEO metadata, favicon, sitemap, robots file, Static Web Apps configuration, and optional Sociobot one-time license restore/verification flow.
- Original generated hero art at `public/assets/hero.webp` (61 KB). Prompt and provenance are recorded in `design.md`.

## Verify

```sh
npm install
npm test
npm run build
```

Verification on 2026-08-28:

- `npm test`: 5 conversion tests and 6 Chromium browser tests pass. Browser coverage imports a CSV, checks invoice lines, opens the print report, checks redaction, resets the bundled demo while offline, and runs axe with no serious or critical violations.
- Each entry in `claims.json` can be executed with its documented `npm test -- --grep @claim:<id>` command.
- `npm run build`: passes and creates `dist/index.html`.
- Production bundle: 19.93 KB JavaScript (7.82 KB gzip), 10.19 KB CSS (3.26 KB gzip), hero WebP 61 KB.
- Lighthouse (mobile, local Vite server): Performance 91, Accessibility 96, FCP 2.3 s, LCP 3.1 s, CLS 0. The local Chromium tab reported a post-audit crash while writing screenshots; the category scores and audited metrics were produced before that cleanup error. Axe browser coverage remains the accessibility acceptance check.

## Known gaps

- PDF generation intentionally uses the browser’s native print dialog rather than a large client-side PDF package. This makes the saved PDF format depend on the browser’s print implementation.
- The $19 Pro checkout link is ready for the factory product registration. Presets are described as an available Pro capability but are not separately surfaced in this v1, so the core product remains entirely useful without a license.

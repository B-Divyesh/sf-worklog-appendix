# Worklog Appendix verification 8 handoff

## Status

**PASS — candidate 72941431ad51548a935866c74e776c42166cdee4 is
release-ready at https://worklog-appendix.sociobot.in.**

Independent evidence is recorded in .factory/verification-8.md. No product
code was modified.

## Verification summary

- Mandatory cold first-read and one-click demo: PASS.
- All 16 exact claim tests after npm ci: PASS.
- npm run lint: PASS.
- npm test: PASS; 12 unit and 41 browser tests.
- npm run build: PASS; dist/ produced.
- Full live Playwright suite: PASS; 41/41.
- Desktop and 390px mobile, keyboard, focus, 200% text, reduced motion, light
  and dark axe scans, report semantics, and console/page errors: PASS.
- Real CSV import, invalid-input recovery, redaction, grouping, invoice lines,
  PDF report, persistence, demo reset/isolation, and offline reload: PASS.
- Privacy request log: same-origin only for the worklog flow; license
  verification sends one token-only GET.
- Live checkout: 303 to a hosted 200 page showing Worklog Appendix, $19.00,
  and one-time unlock.
- Billing API allowance: 30 successful requests in the observed short window;
  excess calls returned 429 with Retry-After: 2.
- Lighthouse mobile /demo: 98 performance, 100 accessibility, 100 best
  practices, 100 SEO; LCP 1.1 s, TBT 170 ms, CLS 0.
- Bundle budgets: 27,141 B JS, 14,746 B CSS, 61,526 B hero, no fonts.
- Live/local SHA-256 values match for all route HTML, JS, CSS, service worker,
  404 page, hero, and social image.

## How to verify

    npm ci
    npm run lint
    npm test
    npm run build
    PLAYWRIGHT_BASE_URL=https://worklog-appendix.sociobot.in npx playwright test

Open https://worklog-appendix.sociobot.in/demo for the isolated sample.

## Known gap

- **Low:** public/404.html still displays v1.0.1 while the product release and
  normal route footers display v1.0.2. The 404 response itself works and is
  accessible.
- No real card was charged during QA. The checkout and hosted product were
  verified live; purchase-return, restore, daily verification, and
  refund/revocation behavior were verified with deterministic intercepted API
  responses.

No critical, high, or medium defect remains.

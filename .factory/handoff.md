# Worklog Appendix polish 2 handoff

## Status

**PASS — all findings in reviews 1 and 2, including historical H-01 through H-40, are resolved and rechecked.**

The repaired static site is live at <https://worklog-appendix.sociobot.in>. Azure Static Web Apps deployment `e9377ee0-4cdd-4005-b1db-e26c9e590286` succeeded from repair commit `48ab78ec5fd337e9fc7e7923943a5da9d8667f13`.

## What changed

- Back and Forward now restore each history entry's scroll position and prior focus. Normal SPA links still focus and announce the destination h1.
- The optional wording panel links to pay-as-you-go Sociobot key acquisition and retains exact-data, storage, billing-rate, manual-edit, and undo disclosures.
- Both paid actions now say `Buy saved client details — $19 (opens checkout)` and identify the external checkout.
- The preview heading now names the appendix and matching invoice lines. Every footer uses the factual product description.
- Added the self-contained `static-build-output` claim test. It invokes the production build before inspecting `dist/`.
- Removed the unneeded README promise about hosting configuration internals.
- Updated the catalog description to an 80-character, verb-first sentence.
- Preserved the luminous document-desk visual system, original art, static artifact class, demo isolation, offline path, local storage boundaries, and $19 license flow.

## Verification evidence

Acceptance clone: `/tmp/worklog-appendix-polish2-acceptance.GbCU4w`.

- Every one of 20 `.factory/claims.json` commands passed separately.
- `npm test`: 12/12 Vitest and 47/47 Playwright passed in the acceptance clone and release tree.
- `npm run build`: passed; `dist/` contains all five route documents, the styled 404, metadata/public files, service worker, and hashed bundles.
- Production sizes: JS 36,555 bytes raw / 12.77 kB gzip; CSS 16,158 bytes raw / 4.38 kB gzip; hero 61,526 bytes.
- Live suite: 47/47 Playwright passed against the custom domain. This includes light/dark Axe checks, keyboard flows, 44 px targets, 200% reflow, reduced motion, offline service-worker use, privacy request logging, print-report accessibility, metadata, demo isolation, and history restoration.
- Factory verifier: HTTP 200 in 728 ms; correct title, `lang=en`, one h1, one main, zero missing alt attributes, zero unlabeled buttons, and zero normal-page console/page errors.
- Live Lighthouse mobile: Performance 100, Accessibility 100, Best Practices 100, SEO 100; LCP 1.3 s, CLS 0, TBT 20 ms.
- Cold route checks: `/`, `/demo`, `/workspace`, `/privacy`, and `/terms` returned 200; an unknown URL returned the styled HTTP 404. Live responses include CSP, HSTS, `nosniff`, and strict-origin referrer policy.
- Cold history check at 390 × 844: landing position restored from `1777` to `1777` with Privacy focused; Forward restored Privacy to `0` with its h1 focused.
- Cold demo check: one landing click opened `/?demo=1`, showed the persistent banner and both actions, loaded 10 rows, and read no real workspace key.
- External destinations: `https://sociobot.in` and the hosted checkout both returned 200. No purchase or paid inference was performed; deterministic fixtures cover those state changes without spend.

Evidence is in `.factory/evidence/polish-2/`. The complete finding map is `.factory/polish-2.md`.

## Run and verify

```sh
npm ci
npm test
npm run build
PLAYWRIGHT_BASE_URL=https://worklog-appendix.sociobot.in npx playwright test
/opt/fleet/lib/verify-url.sh https://worklog-appendix.sociobot.in <output-directory>
```

## Known gaps and next steps

None. No finding, stub, or TODO remains.

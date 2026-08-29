# Perfection-loop polish 2

Release candidate `f2f146f99bc405246f3cce79c8570484c20d2dd1` was repaired against `.factory/review-2.md` at `d4a983a7387c6d57bc4e3f99bf24596efe5960be`. The deployed repair is at <https://worklog-appendix.sociobot.in>.

## Review 2 findings

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-2-1 | Each history entry now records scroll coordinates and a stable focus target. Back and Forward render the destination, announce it, then restore both without scrolling the focused control into a new position. | Playwright `browser Back and Forward restore scroll position and prior focus`; live cold check restored landing `scrollY 1777 → 1777` and header Privacy focus, then Forward restored Privacy to `scrollY 0` with its h1 focused; [live Privacy](evidence/polish-2/live-privacy-mobile.png). |
| F-2-2 | Added `Get a key at sociobot.in — pay as you go (opens new tab)` beside the key field and the same acquisition link in README. The helper retains request, storage, and variable-rate billing disclosure. | `@claim:client-wording-draft` asserts visible text, `https://sociobot.in`, `_blank`, fixture requests, editable streaming, apply, undo, and key removal; cold live target returned 200; [live key help](evidence/polish-2/live-key-link-mobile.png). |
| F-2-3 | Replaced the ambiguous paid action everywhere with `Buy saved client details — $19 (opens checkout)` and marked the link external. | `@claim:client-presets` asserts the visible label, `rel=external`, and exact Sociobot checkout URL; cold live redirect reached the Dodo-hosted checkout with HTTP 200; [live landing](evidence/polish-2/live-landing-mobile.png). |
| F-2-4 | Replaced the preview slogan and conflicting `invoice summary` term with `Preview the appendix and matching invoice lines`. | Landing semantic regression and copy audit; exact live h2 check; [live landing](evidence/polish-2/live-landing-mobile.png). |
| F-2-5 | Replaced the subjective footer claim on every app route and the static 404 with `Turn worklog rows into invoice appendices.` | Landing and 404 regressions; cold live landing and HTTP 404 checks; [live 404](evidence/polish-2/live-404-mobile.png). |
| F-2-6 | Added `static-build-output` to `.factory/claims.json`. Its self-contained test invokes the production build and asserts every route document, public artifact, and hashed JS/CSS bundle in `dist/`. | `npm test -- --grep @claim:static-build-output` passed from acceptance clone `/tmp/worklog-appendix-polish2-acceptance.GbCU4w`; full build produced `dist/` with 36.56 kB JS and 16.16 kB CSS raw. |
| F-2-7 | Removed the unnecessary README promise about hosting-config internals. The deployment instruction now states only the artifact class and command. | README/copy audit; the existing unclaimed configuration regression still verifies known rewrites, cache policy, security headers, and the styled HTTP 404. Live responses supplied CSP, HSTS, `nosniff`, and strict-origin referrer policy. |

## Review 1 findings rechecked

| Finding | Current change/status | Evidence |
| --- | --- | --- |
| F-1-1 | Shared package version remains in app and 404 output. | Styled-404 and production-artifact tests; both live footers show `v1.0.2`. |
| F-1-2 | The unmeasured approval claim remains absent. | Live section heading is `Create the appendix in three steps`; copy audit passes. |
| F-1-3 | The no-license boundary remains an exact claim. | `@claim:free-core-features` passed independently and in the live suite. |
| F-1-4 | Optional client wording remains explicit, editable, undoable, fixture-tested, and isolated in demo mode. | `@claim:client-wording-draft`; [live key help](evidence/polish-2/live-key-link-mobile.png). |
| F-1-5 | The 404 retains complete metadata, standard shell, current version, provenance, focus, and 44 px targets with real HTTP 404 status. | Styled-404 Axe regression; cold live `/missing-polish-2-check` returned 404; [live 404](evidence/polish-2/live-404-mobile.png). |
| F-1-6 | Job and preview labels remain descriptive. | Live `TURN WORKLOG ROWS INTO AN INVOICE APPENDIX` and `INVOICE APPENDIX PREVIEW`; [live landing](evidence/polish-2/live-landing-mobile.png). |
| F-1-7 | Legal h1 headings still name Privacy and Terms plainly. | All-route semantic/Axe checks and direct live route checks passed. |
| F-1-8 | README headings still name their subjects without unexplained pronouns. | README and copy audit. |
| F-1-9 | Subjective output wording and unexplained paid terminology remain absent. | Copy audit and source search; the paid destination is now more explicit under F-2-3. |
| F-1-10 | Decorative hero art retains `alt=""` and factual figcaption. | Live verifier reported zero missing alt attributes; route Axe suite passed. |

## Historical findings rechecked

| ID | Current status | Evidence |
| --- | --- | --- |
| H-01 | Preview contrast retained in light and dark themes. | All-route Axe test. |
| H-02 | Invalid and negative Hours values remain rejected with recovery text. | Vitest and browser invalid-hours tests. |
| H-03 | Core privacy/no-upload/no-tracking boundary retained. | `@claim:local-only`. |
| H-04 | Hosted checkout and paid saved-details entitlement retained. | `@claim:client-presets`; live checkout HTTP 200. |
| H-05 | Unknown URLs retain a designed real 404. | Cold live status 404 and styled-404 test. |
| H-06 | Release-specific service-worker cache and old-cache retirement retained. | Service-worker build/browser tests. |
| H-07 | 390 px routes retain no horizontal overflow. | Mobile overflow and 200% reflow tests; live width `390 = 390`; [live demo](evidence/polish-2/live-demo-mobile.png). |
| H-08 | Claim tests enter through the documented sandbox where applicable. | All 20 manifest commands passed independently from the acceptance clone. |
| H-09 | Redaction removes email/phone detail and preserves dates. | `@claim:redaction`. |
| H-10 | The CSV picker remains visible and keyboard-operable. | Enter and Space picker tests. |
| H-11 | Designed focus contrast remains above baseline. | 390 px focus-color regression. |
| H-12 | Required controls retain 44 px touch targets. | 390 px app and 404 target tests. |
| H-13 | Imported markup remains escaped. | Hostile CSV browser test. |
| H-14 | Route titles, canonicals, and metadata remain route-specific. | Direct-document metadata and live all-route tests. |
| H-15 | Internal notes remain excluded and disclosed. | `@claim:internal-notes`. |
| H-16 | Dark-mode contrast remains compliant. | Dark all-route Axe test. |
| H-17 | SPA Demo navigation exposes only isolated sample data. | Workspace-to-demo navigation test. |
| H-18 | Invoice, free-export, and internal-note claims remain declared. | Their tagged tests passed independently. |
| H-19 | Route focus and announcements remain correct and now include history position restoration. | SPA focus test and F-2-1 regression. |
| H-20 | Reduced-motion fallback remains instant. | Reduced-motion browser test. |
| H-21 | Invalid input and corrupt saved state retain recovery paths. | Unit and browser recovery tests. |
| H-22 | Sitemap, social image, and asset-cache coverage retained. | Production-artifact tests. |
| H-23 | Redaction retains ISO and localized dates. | `@claim:redaction`. |
| H-24 | Milestone editing still updates invoice lines. | `@claim:milestone-edit`. |
| H-25 | Real persistence and demo reset/isolation remain claimed. | `@claim:real-workspace-persistence` and `@claim:demo-reset-isolation`. |
| H-26 | Row edits retain keyboard focus. | Browser focus-retention test. |
| H-27 | All five routes reflow at 200% text size. | Five-route reflow test. |
| H-28 | Blank milestones and zero-row reports remain blocked. | `@claim:empty-output`. |
| H-29 | Demo banner retains valid semantics. | Demo-banner Axe regression. |
| H-30 | Print report retains `lang`, one main, and accessible structure. | `@claim:pdf-appendix` and report Axe scan. |
| H-31 | Empty-output behavior remains a declared claim. | `@claim:empty-output`. |
| H-32 | Singular row/hour output remains grammatical. | Singular wording browser test. |
| H-33 | Styled-404 links remain at least 44 px. | 390 px 404 target test. |
| H-34 | The $19 saved-client-details feature remains implemented. | `@claim:client-presets`. |
| H-35 | Included-row behavior remains declared. | `@claim:included-rows`. |
| H-36 | The untestable timers/invoicing/monitoring sentence remains absent. | Source and copy audit. |
| H-37 | Negative and malformed rates remain rejected. | Rate browser regressions. |
| H-38 | Daily verification and revocation remain declared. | `@claim:license-daily-verification` and `@claim:license-revocation`. |
| H-39 | Key removal wording still distinguishes retained report/details. | `@claim:client-presets` Privacy assertion. |
| H-40 | The stale 404 version remains removed. | Shared-version 404 regression and live footer. |

## Final evidence

- Acceptance clone: `/tmp/worklog-appendix-polish2-acceptance.GbCU4w` at repair commit `48ab78ec5fd337e9fc7e7923943a5da9d8667f13`.
- Claims: 20/20 exact `.factory/claims.json` commands passed separately.
- Complete suite: 12/12 Vitest and 47/47 Playwright passed locally; 47/47 Playwright passed live.
- Work-order command: `npm ci && npm test && npm run build` passed immediately before deployment.
- Factory verifier: HTTP 200 in 728 ms; correct title, `lang=en`, one h1, one main, no missing alt, no unlabeled buttons, and zero normal-page console/page errors. See [live verifier](evidence/polish-2/live-verifier/verify.json).
- Live Lighthouse: Performance 100, Accessibility 100, Best Practices 100, SEO 100; LCP 1.3 s, CLS 0, TBT 20 ms. See [report](evidence/polish-2/lighthouse-live.json).
- Deployment: Azure Static Web Apps deployment `e9377ee0-4cdd-4005-b1db-e26c9e590286` succeeded; the custom domain passed cold checks.

No finding remains open.

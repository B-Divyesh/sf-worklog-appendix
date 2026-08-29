# Perfection-loop polish 1

Release candidate `72941431ad51548a935866c74e776c42166cdee4` was repaired against `.factory/review-1.md` from `84ef933a9ca1f8f4293d8c6b8c88dff2e62cb380`. The deployed repair is at <https://worklog-appendix.sociobot.in>.

## Review 1 findings

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Removed the hand-maintained app version from code and the 404. Vite now derives `__APP_VERSION__` from `package.json` for both outputs. | Browser test `the styled 404 uses the complete route shell, shared version…`; build assertion rejects an unreplaced token; cold unknown URL returned 404 and both footers showed `v1.0.2`; [live-404.png](evidence/polish-1/live-404.png). |
| F-1-2 | Replaced the unmeasured approval claim with `Create the appendix in three steps`. | Copy audit; live landing check; [live-landing-desktop.png](evidence/polish-1/live-landing-desktop.png). |
| F-1-3 | Added `free-core-features` to the claims contract. Its clean-context test imports, redacts, copies invoice lines, opens the print report, runs Axe on app and report, and proves there is no license. | `npm test -- --grep @claim:free-core-features` passed from fresh clone `/tmp/worklog-appendix-polish.SNEZqw`; the paid section and Terms use the exact claim. |
| F-1-4 | Added optional **Draft client wording**. It discloses exact selected descriptions, uses a browser-stored removable Sociobot key, requests the first available GPT-5.6 model, streams into an editable field, applies and undoes, keeps per-row manual editing, fails softly, and uses a cancellable canned demo stream with no spend. | `@claim:client-wording-draft` passed from the fresh clone and live suite; fixture asserts model and response requests and payload; live demo produced nine lines, applied, undid, and made zero off-origin requests; [live-wording-draft.png](evidence/polish-1/live-wording-draft.png). No factory Sociobot key was present, so no paid live inference was invoked. |
| F-1-5 | Completed the 404 metadata, canonical, Open Graph/Twitter card, favicon, touch icon, standard nav, standard footer, provenance, focus, touch targets, and shared version while retaining HTTP 404. | 404 browser regression and Axe pass; cold `/missing-polish-check-72941431` returned 404 with complete shell; [live-404.png](evidence/polish-1/live-404.png). |
| F-1-6 | Replaced the two labels with `TURN WORKLOG ROWS INTO AN INVOICE APPENDIX` and `INVOICE APPENDIX PREVIEW`. | Copy audit and cold landing screenshots at 1440 px and 390 px. |
| F-1-7 | Changed legal h1 text to `How Worklog Appendix stores your data` and `Terms for using Worklog Appendix`. | Live cold route checks plus route-focus test; all public-route semantic/Axe checks passed in light and dark modes. |
| F-1-8 | Changed README headings to `Run Worklog Appendix locally`, `Create an invoice appendix`, and `Run tests and build`. | README and `.factory/copy-audit.md`; no context-dependent `Run it`, `Use it`, or `Check it` remains. |
| F-1-9 | Applied every requested precision rewrite: dated milestone grouping, dated appendix, explicit PDF action, reusable client details, dated/grouped README wording, and milestone names clients use. | `.factory/copy-audit.md` has every landing and README sentence with word counts; banned/subjective phrase search returned no match; [live-landing-mobile.png](evidence/polish-1/live-landing-mobile.png). |
| F-1-10 | Made the decorative hero image `alt=""` while retaining the factual caption. | Cold live DOM check returned an empty alt; landing and all-route Axe suites passed; factory verifier reported `imgsMissingAlt: 0`. |

## Historical items rechecked

Review 1 established that no earlier `review-*.md` or `polish-*.md` exists and assigned `H-*` labels to historical handoff defects. Every label was rechecked in the final local and live suites.

| History ID | Acceptance change/status | Evidence |
| --- | --- | --- |
| H-01 | Preview contrast retained in both themes. | All-route light/dark Axe test and live suite pass. |
| H-02 | Invalid and negative hours remain rejected with recovery text. | Unit tests and browser invalid-hours test pass. |
| H-03 | Privacy/no-upload/no-tracking contract retained. | `@claim:local-only` passed fresh and live. |
| H-04 | Hosted checkout and paid saved-detail boundary retained. | `@claim:client-presets` passed fresh and live. |
| H-05 | Unknown URLs retain real HTTP 404. | Cold live unknown URL returned 404. |
| H-06 | Release-specific service-worker cache and retirement retained. | Service-worker build and browser tests pass. |
| H-07 | 390 px overflow fix retained. | Live landing and demo widths were exactly 390 px; mobile screenshots captured. |
| H-08 | Claim tests enter through the demo sandbox. | All 18 manifest commands passed separately from the fresh clone. |
| H-09 | Email/phone removal and date preservation retained. | `@claim:redaction` passed fresh and live. |
| H-10 | Real CSV picker remains visible and keyboard-operable. | Enter and Space picker tests pass live. |
| H-11 | Designed focus contrast retained. | 390 px focus-baseline test passes live. |
| H-12 | 44 px touch targets retained. | 390 px app target test passes live. |
| H-13 | Imported markup remains escaped. | Hostile CSV browser test passes live. |
| H-14 | Route title and canonical metadata retained. | Direct-document metadata test and live route suite pass. |
| H-15 | Internal notes remain excluded and disclosed. | `@claim:internal-notes` passed fresh and live. |
| H-16 | Dark-mode contrast retained. | Public routes pass dark-theme Axe live. |
| H-17 | SPA Demo navigation remains isolated. | Demo-navigation browser test passes live. |
| H-18 | Invoice, free-export, and internal-note claims remain declared. | Their three tagged tests passed fresh and live. |
| H-19 | Route focus and announcements retained. | SPA focus/announcement test passes live. |
| H-20 | Reduced-motion fallback retained. | Reduced-motion browser test passes live. |
| H-21 | Invalid input and saved-state recovery retained. | Unit and browser recovery tests pass. |
| H-22 | Sitemap, social image, and asset-cache coverage retained. | Production artifact tests pass; live metadata suite passes. |
| H-23 | Redaction still preserves ISO and localized dates. | `@claim:redaction` passed fresh and live. |
| H-24 | Milestone edit still updates invoice lines. | `@claim:milestone-edit` passed fresh and live. |
| H-25 | Persistence and demo reset/isolation stay claimed. | Both tagged tests passed fresh and live. |
| H-26 | Row changes retain keyboard focus. | Focus-retention browser test passes live. |
| H-27 | All routes reflow at 200% text size. | Five-route 200% browser test passes live. |
| H-28 | Blank milestones and zero-row output stay blocked. | `@claim:empty-output` passed fresh and live. |
| H-29 | Demo banner has no invalid live-region role. | Banner regression and Axe pass live. |
| H-30 | Print report retains `lang` and `main`. | `@claim:pdf-appendix` and report Axe pass. |
| H-31 | Empty-output promise remains declared. | `@claim:empty-output` passed fresh and live. |
| H-32 | Singular output remains grammatical. | Singular row/hour browser test passes live. |
| H-33 | 404 touch targets remain at least 44 px. | 404 mobile target/Axe test passes live. |
| H-34 | $19 saved client details remain implemented. | `@claim:client-presets` passed fresh and live. |
| H-35 | Included-row promise remains declared. | `@claim:included-rows` passed fresh and live. |
| H-36 | Broad timers/invoicing/monitoring sentence remains absent. | Copy and source audit found no sentence. |
| H-37 | Negative/malformed rates remain rejected. | Rate browser regression passes live. |
| H-38 | Daily verification and revocation remain declared. | Both tagged license tests passed fresh and live. |
| H-39 | License removal wording still distinguishes retained report/details. | Client-presets test checks the current Privacy copy. |
| H-40 | Stale 404 version removed. | Same shared-source/version evidence as F-1-1. |

## Final verification

- Fresh clone: every one of 18 claim commands passed separately; then 12/12 Vitest and 44/44 Playwright passed together.
- Work-order build command: `npm ci && npm test && npm run build` passed immediately before deployment.
- Live: 44/44 Playwright tests passed against the custom domain.
- Factory verifier: HTTP 200, load 596 ms, one h1, `lang=en`, main landmark, no missing alt, no unlabeled buttons, zero console/page errors.
- Live Lighthouse: Performance 100, Accessibility 100, Best Practices 100, SEO 100; LCP 1.3 s, CLS 0, TBT 0 ms. Report: `evidence/polish-1/lighthouse-live.json`.
- Deployment: Azure Static Web Apps deployment `108c07d5-9934-41af-8a20-182ab61d68be` succeeded; cold custom-domain check passed.

No review finding remains open.

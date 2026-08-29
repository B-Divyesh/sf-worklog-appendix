# Worklog Appendix repair 7 handoff

## Status

**PASS — release blockers from verification commit `3b006cce76ccd5c2b5f142fae3908ef7674b7722` are repaired and deployed.**

- Repair commits: `76eec83` and `259e089` on `main`.
- Live URL: https://worklog-appendix.sociobot.in
- Final Azure Static Web Apps deployment ID: `e9a32598-4ee7-4de1-acdf-b38099172079`.
- Artifact remains a Vite + TypeScript static site with `dist/` as its deploy root.

## What changed

1. Reproduced the exact rate corruption before editing: `Rate=-100` produced `Work completed — 1 hour — $100.00`; `abc` and `10.20.30` imported silently without an amount.
2. Rate parsing now accepts only a blank value or a zero/positive decimal, with an optional leading `$`. Negative, alphabetic, and multiple-decimal values stop the import with a row-specific recovery message. Stored workspaces with a negative rate are also rejected.
3. Added unit and browser regressions for `-100`, `$-100`, `abc`, and `10.20.30`, plus recovery with a valid `100` rate and its exact `$100.00` invoice line.
4. Added claim `license-daily-verification` and one tagged test proving no request before 24 hours, one request after the boundary, and no second request after the refreshed verdict is stored.
5. Added claim `license-revocation` and one tagged test proving both refunded and revoked responses remove paid preset access while free PDF export still works.
6. Expanded the client-presets claim test to cover the checkout URL, license return through `/demo?license=…`, URL stripping, token-only verification, preset save/apply, license removal, retained presets, and pasted-token restore.
7. Corrected Privacy copy: clearing site data removes the workspace, presets, and license; removing the license in the app removes only the license state. The saved report and presets remain.
8. Terms now state that refunds revoke the license automatically and refunded or revoked licenses lose preset access. README and `.factory/claims.json` use the same promises.
9. Bumped the visible release to `v1.0.2`. The existing visual thesis, demo isolation, free workflow, and static deployment class are unchanged.

## Verification evidence

### Clean install, type check, tests, and build

```sh
npm ci
npm run lint
npm test
npm run build
```

- `npm ci`: 60 packages installed; 0 vulnerabilities.
- TypeScript: PASS.
- Vitest: 12/12 PASS.
- Playwright: 41/41 PASS locally and 41/41 PASS against the deployed origin.
- The updated client-presets claim was rerun live after the final test-only commit: 1/1 PASS.
- Production build: PASS with root `dist/index.html`.
- All 16 exact commands in `.factory/claims.json` were run separately; each selected exactly one test and passed.

### Paid flow and response policy

- Live checkout: HTTP 303 to `checkout.dodopayments.com`; hosted response HTTP 200.
- Hosted checkout contains `Worklog Appendix`, `$19.00`, and `One-time unlock`.
- Automated browser coverage verifies locked purchase entry, valid return token, URL cleanup, daily cached verification, pasted-token restore, refunded and revoked reconciliation, retained presets, and free export after lock.
- Live invalid-token check: HTTP 200 with `{"expires_at":null,"reason":"invalid","valid":false}`, `Access-Control-Allow-Origin: https://worklog-appendix.sociobot.in`, and `Cache-Control: no-store`.
- The live checkout and verification endpoints were exercised without sending worklog or client data.

### Browser, accessibility, privacy, offline, and update

- Factory `verify-url.sh` passed live `/` and `/demo`: title, `lang=en`, one h1, main landmark, alt text, labelled buttons, and zero console/page errors.
- Desktop 1366×900 and mobile 390×844 screenshots were inspected. There is no horizontal overflow; the first screen and demo controls remain readable and usable.
- Axe-backed tests cover `/`, `/demo`, `/workspace`, `/privacy`, `/terms`, the styled 404, and the generated report in light and dark treatments. No serious or critical findings remain; the report test also has no moderate findings.
- Keyboard coverage passes for the skip link, Enter/Space file picker activation, route focus/announcement, and focus retention after row edits.
- 390px touch targets, visible focus, 200% text reflow, and reduced-motion behavior pass.
- Privacy tests record no external request during CSV import/export. License checks send one token-only GET with no request body.
- Demo/real storage isolation, offline demo reload, release-specific service-worker cache, cache cleanup, and `registration.update()` all pass.

### Routes, headers, performance, and identity

- Live `/`, `/demo`, `/workspace`, `/privacy`, and `/terms`: HTTP 200. Unknown route: styled HTTP 404.
- Live responses carry the configured CSP, `nosniff`, and strict-origin referrer policy. HTML uses 30-second revalidation.
- Live Lighthouse 13.0.1 mobile `/demo`: Performance 100, Accessibility 100, Best Practices 100, SEO 100; FCP 0.9 s, LCP 1.0 s, TBT 60 ms, CLS 0.
- Payload: JS 27,141 B raw / 10.00 KB gzip; CSS 14,746 B raw / 4.11 KB gzip; hero WebP 61,526 B; no font payload.
- Fresh local/live SHA-256 matches were confirmed for all route HTML, `main-ClyIiNia.js`, `main-BXST0Lg4.css`, and `sw.js`.
- Key live/local hashes: `index.html` `f869690d…cd3`; JS `a94849e8…7f4`; CSS `0f89dbb0…240`; service worker `2c0d93fe…a11`.

## Known gaps and next steps

- No real live card was charged and no real customer license was refunded during repair. The live purchase entry and hosted product were verified, while return, restore, refund, and revocation state transitions use deterministic intercepted billing responses. This avoids creating a financial transaction during QA.
- No package-consumer or backend concurrency check applies to this static product. There is no sign-in, backend data store, published package, or CLI.
- No further release-blocking product gap is known.

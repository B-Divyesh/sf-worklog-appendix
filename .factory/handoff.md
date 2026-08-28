# Worklog Appendix handoff

## Release status: READY

Repair of independent-verifier candidate
`538fa46ae64b979b76304c46b5003ef090529f12`. The artifact remains a Vite +
TypeScript static site for Azure Static Web Apps; `dist/` is the deploy root.

## Repairs

- Moved the three incomplete claim proofs into fresh `/demo` contexts. CSV
  import and local-only now use the isolated sample workspace; redaction adds
  both an email and phone number, toggles the option, and checks the report.
- Replaced hidden, label-only file inputs with visible native CSV pickers. They
  are reachable by Tab and activate with Enter and Space.
- Reworked focus and touch baselines: the focus ring is deep lagoon
  (`#005a63`), banner controls and footer links are 44px targets, and checkbox
  and milestone controls have 44px hit areas at 390px.
- Escaped every imported or editable value before it enters workspace markup,
  selection options, the preview, or the printable report. Adversarial CSV
  markup now renders as literal text.
- Added static route documents and Azure rewrites for `/demo`, `/privacy`,
  `/terms`, and `/workspace`, each with its own title, description, canonical,
  and Open Graph metadata before JavaScript runs.
- Fixed the PDF footer to state that internal notes are never included.
- Implemented the documented dark treatment and covered it with axe.
- The service worker now precaches the build’s hashed JS/CSS assets, uses a
  versioned cache, retires older caches, and survives a fresh offline `/demo`
  reload after activation.

## Verification

Performed 2026-08-28 UTC from a clean dependency install:

```sh
npm ci
npm test
npm run lint
npm run build
```

- `npm ci`: passed; npm reported 0 vulnerabilities.
- `npm test`: passed: 7 Vitest tests and 17 Chromium Playwright tests.
- All six exact claim commands passed: `csv-import`, `invoice-lines`,
  `pdf-appendix`, `redaction`, `offline-demo`, and `local-only`.
- Browser coverage includes desktop, 390px mobile, keyboard Tab/Enter/Space
  file import, focus/target sizes, pointer flow, printable report, input
  recovery, hostile CSV text, privacy network observation, cache cleanup,
  offline reload, route metadata, and light/dark axe scans.
- `verify-url.sh http://127.0.0.1:4173/demo`: passed with no console/page
  errors; title, `lang`, one h1, main landmark, and image alt checks passed.
- Playwright AxeBuilder found zero serious/critical violations in light and
  dark mode. The standalone `@axe-core/cli` was also attempted, but its bundled
  ChromeDriver only supports Chrome 152 while the supplied browser is 145; the
  Playwright axe integration uses the supplied, matching browser instead.
- Local Lighthouse (`/demo`, mobile): Performance 100, Accessibility 100,
  FCP 1.0 s, LCP 1.0 s, CLS 0, TBT 70 ms.
- Production output: JS 17.89 KB (7.23 KB gzip), CSS 11.89 KB (3.61 KB gzip),
  hero WebP 61.53 KB. All remain under the product budgets.

## Deploy

```sh
/opt/fleet/lib/deploy-static.sh worklog-appendix dist
```

Deployed 2026-08-28 UTC with deployment ID
`2e940f19-8e93-43fb-a7f4-85e8e8388d91` to
`https://worklog-appendix.sociobot.in`. Live `/`, `/demo`, `/privacy`,
`/terms`, and `/workspace` returned 200; an unknown route returned the styled
404 with HTTP 404. Live JS, CSS, hero-WebP, and service-worker SHA-256 values
matched the local `dist/` artifact exactly. The live deployment also passed
`verify-url.sh` at `/demo` with no console errors and has HSTS, `nosniff`,
strict-origin referrer policy, and the self-only CSP from
`staticwebapp.config.json`.

No known product gaps remain. The product has no paid tier; all shipped
features remain free, local-first, and private by default.

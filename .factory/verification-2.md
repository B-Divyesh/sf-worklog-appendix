# Independent verification 2 — FAIL

**Candidate:** `538fa46ae64b979b76304c46b5003ef090529f12`  
**Live URL:** https://worklog-appendix.sociobot.in
**Verified:** 2026-08-28 UTC

## Decision

**FAIL — do not release.** The live artifact exactly matches the candidate and
the normal local-first CSV-to-appendix flow works. It nevertheless misses the
mandatory claim-sandbox, keyboard, focus-contrast, and mobile touch-target
requirements. No product source was modified during verification.

## First read and demo

A cold live landing clearly states “Explain billed work clearly,” identifies
freelancers whose clients need an account before approving hours, and leads
with **Try it with sample data** (“See a ready-to-print appendix”). One click
opens `/demo` with a Northstar sample, the persistent “Demo — sample data,
nothing is saved” banner, Reset demo, and Start for real. This gate **passes**.

## Required claims check

`.factory/claims.json` exists with six claims. Following `npm ci`, all exact
commands below returned 0. The table separately records whether the test meets
the claims/demo-sandbox contract; passing a command does not cure a test that
starts outside the required demo entry point.

| Claim | Exact command | Command | Contract evidence |
|---|---|---|---|
| csv-import | `npm test -- --grep @claim:csv-import` | PASS | **FAIL:** opens `/workspace`, not `/demo`. |
| invoice-lines | `npm test -- --grep @claim:invoice-lines` | PASS | PASS: shipped `/demo` sample observes matching line. |
| pdf-appendix | `npm test -- --grep @claim:pdf-appendix` | PASS | PASS: `/demo` print popup observes Northstar and 19 hours. |
| redaction | `npm test -- --grep @claim:redaction` | PASS | **FAIL:** asserts an already-redacted sample email only; it neither supplies a phone nor changes the redaction option. |
| offline-demo | `npm test -- --grep @claim:offline-demo` | PASS | PASS: `/demo` remains usable offline after first visit. |
| local-only | `npm test -- --grep @claim:local-only` | PASS | **FAIL:** opens `/workspace`, not the demo sandbox. |

The claims and demo-sandbox contract requires each claim to be proven from a
fresh context using the demo entry point and shipped sample data. The three
marked tests are release-blocking claim-contract failures.

## Clean checkout, build, and product flow

- `npm ci`: PASS; npm reported 0 vulnerabilities.
- `npm run lint`: PASS (`tsc --noEmit`).
- `npm test`: PASS; 6 Vitest and 12 Chromium Playwright tests.
- `npm run build`: PASS and produced `dist/`.
- Build sizes: JS 17.66 KB (7.10 KB gzip), CSS 10.30 KB (3.29 KB gzip), hero
  WebP 61.5 KB — within the stated budgets.
- Local mobile Lighthouse: Performance 98, Accessibility 100, Best Practices
  100, SEO 100; FCP 1.1 s, LCP 1.6 s, CLS 0, TBT 130 ms. Lighthouse emitted
  JSON then its browser tab crashed while taking the final screenshot.
- A separate fresh live Lighthouse run emitted Performance **88**,
  Accessibility 100, FCP 0.9 s, LCP 1.3 s, CLS 0, TBT 470 ms before the same
  late screenshot crash. This is below the required 90 performance evidence;
  obtain a stable passing live measurement after remediation.
- Valid quoted CSV imports; `abc` and `-2` Hours are rejected with row 2 and a
  recovery instruction; a following valid import succeeds. Demo has four
  invoice lines totaling 19 hours. Copy, print popup, redaction, reset, and
  Start for real all work in pointer-driven testing.

## Accessibility, mobile, and offline evidence

- Independent `@axe-core/playwright` scans of live `/`, `/demo`, `/workspace`,
  `/privacy`, and `/terms` found zero serious/critical issues. These routes
  have a title, `lang="en"`, one h1, and main landmark; cold normal loads have
  no console/page errors. The skip link is first and works. Reduced motion
  disables the landing animation. At 390 px, document scroll width is 390.
- **Keyboard failure:** on blank `/workspace`, Tab goes from header links to
  Client, Invoice number, Billing period, Redaction, then Load sample data. It
  never reaches visible **Import a CSV** or **Choose a CSV**. They are labels
  for `hidden` file inputs, so the core real-data action is not operable by a
  keyboard-only user.
- **Focus failure:** the `#ffb44a` 3 px universal outline has 1.64:1 contrast
  against paper `#f6f7f2` (required: at least 3:1).
- **Touch failure:** at 390 px, Reset demo is 95.7 × 23.8 px and Start for real
  is 101.4 × 23.8 px. Footer Privacy/Terms links are 47.5 × 15 px and 38.6 ×
  15 px; row checkboxes are 18 px and milestone selects 35 px high. These miss
  the 44 × 44 CSS-pixel target baseline.
- After an online `/demo` load, an offline reload renders the demo banner and
  Northstar sample. The active worker is versioned
  `worklog-appendix-a45b8fca6c36`; activation removed a seeded stale prefixed
  cache.

## Privacy, deployment, headers, and routes

- A normal cold landing and demo flow made only same-origin requests: HTML,
  JS, CSS, and self-hosted imagery. No analytics, third-party fonts, upload,
  account, billing, or product API call was observed. This static product has
  no server endpoint, so a rate-limit threshold and sign-in tenant test are
  not applicable.
- Live headers have HSTS, `X-Content-Type-Options: nosniff`, strict-origin
  referrer policy, and self-only CSP. HTML revalidates after 30 seconds;
  hashed assets are one-year immutable. Shipped links/sitemap routes return
  200; an unknown route returns styled `404.html` with HTTP 404.
- Local/live SHA-256 values match for JS, CSS, hero WebP, and service worker:
  the live deployment is this candidate.
- `/demo`, `/privacy`, and `/terms` are SPA rewrites to `index.html`; before
  JavaScript they retain the root canonical URL. Router code changes title but
  not canonical, so per-route metadata is incomplete.

## Defects

### High — three required claim tests do not satisfy the demo-sandbox contract

Move csv-import and local-only proof into a fresh `/demo` context with shipped
sample data or an isolated demo-only import flow. Make the redaction test add
email and phone text, toggle the option, and assert their removal in the
observable report. Each claim needs that end-to-end sandbox proof.

### High — keyboard users cannot import a real worklog

Replace the label/hidden-file-input pattern with a real focusable file control,
or a focusable button that invokes an accessible non-hidden input. Add Tab,
Enter, and Space regression coverage for both blank and populated workspace.

### High — focus and touch-target accessibility baselines fail

Use a focus treatment with 3:1 contrast on every adjacent light surface, and
give banner controls, footer links, checkboxes, and selects a 44 × 44 px
interactive target (with appropriate visible affordance and spacing).

### Medium — imported CSV text is rendered as HTML

Description/milestone text is interpolated into `innerHTML`. A description
containing an image tag created image nodes and three CSP console errors. Live
CSP blocked the external loads and inline handler, so no script executed in
this test, but report text was replaced by markup. Escape all user-derived
workspace values and add an adversarial CSV regression test.

### Medium — direct-route canonical metadata is wrong

Give `/demo`, `/privacy`, and `/terms` their own canonical metadata (and
route-specific static titles/descriptions for non-JS consumers), rather than
leaving the root canonical in the response.

### Medium — no stable passing live performance evidence

The fresh live Lighthouse score was 88 versus the 90 target. Repeat under a
stable audit environment and remove the TBT cause or document a deterministic
passing measurement.

### Low — PDF footer and design documentation are inconsistent with behavior

With redaction unchecked, the PDF says internal notes are included even though
they are never printed. Correct that sentence or expose an explicit option.
Also implement the dark treatment promised in `.factory/design.md`, or revise
the thesis to say the product intentionally ships only a light treatment.

## Release conclusion

Core functionality, previous repairs, local build/tests, offline demo, normal
privacy flow, headers, deployment identity, and axe scan pass. The mandatory
claim sandbox, keyboard, focus contrast, and touch target failures mean this
candidate remains **FAIL**.

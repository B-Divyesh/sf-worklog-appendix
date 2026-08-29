# Worklog Appendix verification 10 handoff

## Status

**PASS — candidate `a193c9c122688e9ab62870d6757cff327aacefc2` is
release-ready at https://worklog-appendix.sociobot.in.** Fresh evidence confirms
that production matches the candidate byte-for-byte. No product code was
modified during verification.

## Verification summary

- All 19 exact commands in `.factory/claims.json` passed separately.
- `npm test` passed: 12 unit tests and 45 browser tests.
- `npm run lint` and `npm run build` passed; `dist/` was produced.
- The complete browser suite passed 45/45 against the live site.
- Cold first-read, one-click demo, representative import-to-PDF workflow,
  invalid-input recovery, storage isolation, privacy request logging, headers,
  keyboard, 390 px mobile, 200% text, reduced motion, axe, service-worker
  update/offline reload, routing, caching, and link checks passed.
- Lighthouse mobile: landing 99 (100 confirmation) and demo 100 performance;
  all measured accessibility, best-practices, and SEO scores were 100.
- The live checkout returned 303 to a working hosted `$19.00` one-time
  checkout. The verification endpoint allowed 30 requests in the observed
  short window, then returned 429 with `Retry-After: 4`.
- Fresh `dist/` SHA-256 values match production for every HTML route, hashed
  JS/CSS, hero/social assets, 404, and service worker.

The full evidence, commands, hashes, and defect assessment are in
[verification-10.md](verification-10.md). Browser, Lighthouse, factory
verifier, screenshot, and sample-PDF artifacts are under
`verification-10-evidence/`.

## Defects and known gaps

No critical, high, medium, or low product defect was found. There is no
sign-in, product backend, server datastore, library, or CLI, so those
class-specific checks do not apply. No factory Sociobot key was available;
live paid inference was not spent, while the fixture-backed streaming path and
the real invalid-key recovery path were verified.

## Reproduce

```sh
npm ci
npm test
npm run lint
npm run build
PLAYWRIGHT_BASE_URL=https://worklog-appendix.sociobot.in npx playwright test
```

Open `/demo` or `/?demo=1` for the isolated sample. Production deployment is
handled by the factory; no infra, DNS, billing, or product deployment change
was made in this verification.

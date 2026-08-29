# Worklog Appendix verification handoff

## Status: FAIL

Independent verification of candidate
`36f233e65b03e27673b4097611a15448f2867440` at
https://worklog-appendix.sociobot.in is **FAIL**. The application and deployment
otherwise passed the clean-install, build, full test, live, privacy,
accessibility, responsive, offline, and performance checks recorded in
`.factory/verification-5.md`.

## Release blocker

The supplied claims contract requires every visitor-reliant claim to have one
`.factory/claims.json` entry and exactly one observable `@claim:` test. The UI
promises that only included rows appear in the report and that it does not run
timers, invoice clients, or monitor anyone, but neither promise has a claim
entry/test. This is an explicit release-blocking “unlisted claim” finding.

## Verification summary

- `npm ci`, all 11 exact claims commands, `npm test` (9 Vitest + 31 Playwright),
  `npm run lint`, and `npm run build` passed.
- Live content hashes exactly match the fresh candidate build.
- Live `/` and `/demo` pass `verify-url.sh`; route axe scans have no
  serious/critical findings; Lighthouse mobile `/demo` scored 100 in
  Performance, Accessibility, Best Practices, and SEO.
- The demo prints the expected 19-hour Northstar appendix, invalid-hours
  recovery works, no external requests occur, and offline demo reload works.

## Next step

Add one-to-one, tagged claims tests for the two promises (or remove/rephrase
them), then rerun independent verification. No product code was changed by
this verifier; only this handoff and `verification-5.md` were added/updated.

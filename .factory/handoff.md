# Worklog Appendix review 1 handoff

## Status

**FAIL — do not release without another repair/review round.**

The complete adversarial report is in `.factory/review-1.md`. No product code
was modified. The review found 10 items: 1 blocking, 3 major, and 6 minor.

The blocking item is the unresolved historical 404 footer mismatch: the live and
source 404 still say `v1.0.1`, while normal routes say `v1.0.2`. Other findings
cover incomplete 404 metadata/shell consistency, two unlisted public claims,
non-informational or subjective copy, decorative alt text, and the missing
client-wording assistance implied by the core job.

## Verified

- Cold first read at 390 × 844 and 1440 × 900: PASS.
- One-click sample demo and visible loaded state: PASS.
- Demo reset, real-data isolation, Start for real, and same-origin request log:
  PASS.
- All 16 exact claim commands from clean clone
  `/tmp/worklog-appendix-review.Tn7UhV`: PASS.
- `npm test`: PASS — 12 unit and 41 browser tests.
- `npm run build`: PASS — `dist/` produced.
- Full live Playwright suite after build: PASS — 41/41.
- Factory live URL verifier: PASS.
- Route, metadata, link, checkout, history/back/focus, mobile, accessibility,
  offline, privacy, visual-identity, and bundle checks are detailed in the review.

## Repair priorities

1. Fix the shared 404 version, metadata, header, and footer; add regression checks.
2. Remove or register and test the two unlisted claims identified as `F-1-2` and
   `F-1-3`.
3. Apply the exact copy rewrites in `F-1-6` through `F-1-10`.
4. Decide whether to implement the optional Sociobot-backed client-wording step
   in `F-1-4`; if implemented, retain an offline/manual fallback and fixture-backed
   claim coverage.
5. Run a new full, zero-finding adversarial review.

## Notes

- `.factory/brief.json` is absent from the current tree and repository history.
- No prior `review-*.md` or `polish-*.md` files exist. Every historical version
  of `.factory/handoff.md` was checked; all earlier product defects except the
  404 version mismatch were confirmed fixed in live behavior and current code.
- No real financial transaction was made. The hosted checkout page was inspected,
  and deterministic tests covered entitlement state changes.

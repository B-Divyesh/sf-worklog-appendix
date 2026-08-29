# Worklog Appendix visual thesis

## Direction: luminous glass data landscape

Worklogs are often messy evidence. This interface turns them into a calm, legible landscape: pale paper behind midnight-blue panes, with milestones as illuminated waypoints and row-level detail tucked into clear glass layers. It should feel like a careful document desk, not a time-tracking dashboard.

### Palette

- `ink` #10233B — primary text and the deep page field
- `paper` #F6F7F2 — warm document ground
- `mist` #DCE8E8 — quiet surface
- `glass` rgba(255,255,255,.72) — translucent report sheets
- `lagoon` #087E8B — links and secondary action
- `sun` #FFB44A — milestone emphasis and primary action
- `plum` #704B72 — internal-note/redaction state
- `danger` #B33A3A — errors

The dark treatment uses `ink` as the ground, `#173552` for surfaces, and preserves warm sun controls for contrast. It follows the device color preference and keeps the document panes, inputs, and report preview legible without a remote font or asset request.

### Type and rhythm

The UI uses the self-hosted system font stack (no network font request): Georgia for report titles and ui-rounded/system sans for controls and tables. The 8 px rhythm creates document-like breathing room. Tables use tabular figures. Text columns stop near 68 characters.

### Interaction and motion

Sheets rise into view with a short translate transition that preserves text contrast at every frame. Milestone rows illuminate when selected; this explains the grouping relationship. Under reduced motion, all states appear instantly. Focus uses a 3 px deep-lagoon outline, chosen to clear 3:1 contrast on both paper and glass surfaces.

### Art plan and provenance

Hero art is an original generated editorial still: translucent document layers, a glowing path of milestone markers, and a cool ink field. It is decorative context, never contains required text. Prompt sheet: "luminous glass data landscape, translucent paper sheets and small amber waypoint lights floating over a deep navy cartographic field, elegant editorial product illustration, frosted glass, warm dawn glow, precise abstract geometry, no people, no text, no logos, no watermark". Negative list: UI screenshots, legible words, brands, hands, money imagery, gradients used as background blobs. Generated with the factory image deployment on 2026-08-28; original asset, optimized to WebP before shipping.

`assets/social.webp` is a 1200×630 center crop derived from that same original hero art on 2026-08-29 for Open Graph and Twitter cards; it contains no required copy.

### Shape language

Document corners are 18 px; panes have a one-pixel blue-grey rim and restrained shadow. Primary controls are warm amber rounded capsules. The 404 treatment uses a lone lit waypoint on the same map field.

The paid client-preset area uses the same document-desk hierarchy. It is a ruled section rather than a promotional card, so the free report remains primary and the optional license does not interrupt the workflow.

The optional wording panel follows the same ruled-document treatment. Its disclosure exposes the exact outbound text, and the streamed draft appears in a plain editable sheet rather than a chat interface. This keeps the product focused on invoice evidence instead of adopting a generic AI assistant style.

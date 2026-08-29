# Demo sandbox

Open `/?demo=1`, `/demo`, or choose **Try it with sample data** on the landing page. The sample is a ten-row Northstar Studio worklog with four approved milestones and one pending row.

The banner says **Demo — sample data, nothing is saved**. **Reset demo** restores the shipped sample. **Start for real** leaves the sandbox at `/workspace`. A fresh browser opens a blank real workspace; an existing real workspace is shown without copying demo changes.

Demo edits stay in memory for the current tab. They never read or write `worklog-appendix`, `worklog-appendix:presets`, `sb_license:worklog-appendix`, or `sociobot_key:worklog-appendix`. A checkout return sent to `/demo?license=…` moves to `/workspace` before storing or checking the token.

**Draft client wording** uses a bundled canned response in demo mode. It makes no model request and stores no key. A real workspace shows the exact selected descriptions before an explicit request to `api.sociobot.in` with the user's own key.

The service worker caches the demo shell and bundled sample source after first visit. No network request is made for the sample data.

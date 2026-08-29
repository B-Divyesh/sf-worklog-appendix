# Demo sandbox

Open `/demo` or choose **Try it with sample data** on the landing page. The sample is a ten-row Northstar Studio worklog with four approved milestones and one pending row.

The banner says **Demo — sample data, nothing is saved**. **Reset demo** restores the shipped sample. **Start for real** leaves the sandbox at `/workspace`. A fresh browser opens a blank real workspace; an existing real workspace is shown without copying demo changes.

Demo edits stay in memory for the current tab. They never read or write `worklog-appendix`, `worklog-appendix:presets`, or `sb_license:worklog-appendix`. A checkout return sent to `/demo?license=…` moves to `/workspace` before storing or checking the token.

The service worker caches the demo shell and bundled sample source after first visit. No network request is made for the sample data.

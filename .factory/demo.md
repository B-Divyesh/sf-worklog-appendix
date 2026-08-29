# Demo sandbox

Open `/demo` or choose **Try it with sample data** on the landing page. The sample is a ten-row Northstar Studio worklog with four approved milestones and one pending row.

The banner says **Demo — sample data, nothing is saved**. **Reset demo** restores the shipped sample. **Start for real** leaves the sandbox and opens a blank local workspace. Demo edits stay in memory for the current tab; they never read or write the real `worklog-appendix` key or any browser storage. The reserved `demo:` namespace is never used for real data.

The service worker caches the demo shell and bundled sample source after first visit. No network request is made for the sample data.

# Demo sandbox

Open `/demo` or choose **Try it with sample data** on the landing page. The sample is a ten-row Northstar Studio worklog with four approved milestones and one pending row.

The banner says **Demo — sample data, nothing is saved**. **Reset demo** restores the shipped sample. **Start for real** leaves the sandbox and opens a blank local workspace. Demo state is kept only in the `demo:worklog-appendix` browser namespace and is never read by the real workspace.

The service worker caches the demo shell and bundled sample source after first visit. No network request is made for the sample data.

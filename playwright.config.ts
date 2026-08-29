import { defineConfig } from '@playwright/test';

const liveBaseUrl = process.env.PLAYWRIGHT_BASE_URL;

export default defineConfig({
  testDir: './tests',
  testMatch: 'browser.pw.ts',
  use: { baseURL: liveBaseUrl || 'http://127.0.0.1:4173', headless: true },
  webServer: liveBaseUrl
    ? undefined
    : {
        command: 'npm run build && npx vite preview --host 127.0.0.1 --port 4173',
        url: 'http://127.0.0.1:4173',
        reuseExistingServer: true,
      },
});

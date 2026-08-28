import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('@claim:csv-import imports a CSV into the local workspace', async ({ page }) => {
  await page.goto('/workspace');
  await page.locator('#csv-file').setInputFiles({name:'hours.csv',mimeType:'text/csv',buffer:Buffer.from('Date,Description,Hours,Milestone,Status\n2026-08-01,Prepared handoff,2,Release,approved')});
  await expect(page.getByText('Imported 1 rows from hours.csv.')).toBeVisible();
  await expect(page.getByRole('article').getByText('Prepared handoff', {exact:true})).toBeVisible();
});
test('@claim:invoice-lines creates matching client invoice lines', async ({ page }) => {
  await page.goto('/demo');
  await expect(page.locator('#invoice-lines')).toHaveValue(/Client portal — 8 hours/);
  await expect(page.locator('.report-panel .group h3').filter({hasText:'Client portal'})).toBeVisible();
});
test('@claim:pdf-appendix opens a print-ready appendix', async ({ page }) => {
  await page.goto('/demo');
  const popup = page.waitForEvent('popup');
  await page.getByRole('button',{name:'Print appendix / save PDF'}).click();
  const report = await popup;
  await expect(report.getByRole('heading',{name:'Completed work for Northstar Studio'})).toBeVisible();
  await expect(report.getByText('Total approved work: 19 hours')).toBeVisible();
});
test('@claim:redaction removes personal detail from the report view', async ({ page }) => {
  await page.goto('/demo');
  await expect(page.getByText('Internal note kept out of the report: Email change request came from [email removed]')).toBeVisible();
});
test('@claim:offline-demo works after first visit with no external requests', async ({ page, context }) => {
  const external: string[] = [];
  page.on('request', request => { if (new URL(request.url()).origin !== 'http://127.0.0.1:4173') external.push(request.url()); });
  await page.goto('/demo');
  await expect(page.locator('body')).toContainText('Northstar Studio');
  await page.evaluate(() => navigator.serviceWorker.ready);
  await expect.poll(() => page.evaluate(async () => (await Promise.all(performance.getEntriesByType('resource').map(entry => caches.match(entry.name)))).every(Boolean))).toBe(true);
  await context.setOffline(true);
  await page.getByRole('button',{name:'Reset demo'}).click();
  await expect(page.getByText('Northstar Studio').first()).toBeVisible();
  expect(external).toEqual([]);
});

test('landing has a usable document outline and no serious axe violations', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle('Worklog Appendix — Explain billed work clearly');
  await expect(page.locator('html')).toHaveAttribute('lang','en');
  await expect(page.locator('main h1')).toHaveCount(1);
  const results = await new AxeBuilder({page}).analyze();
  expect(results.violations.filter(item => ['serious','critical'].includes(item.impact || ''))).toEqual([]);
});

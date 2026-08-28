import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { readFileSync } from 'node:fs';

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

test('@claim:local-only keeps imported CSV data in the browser with no external requests', async ({ page }) => {
  const external: string[] = [];
  page.on('request', request => {
    if (new URL(request.url()).origin !== 'http://127.0.0.1:4173') external.push(request.url());
  });
  await page.goto('/workspace');
  await page.locator('#csv-file').setInputFiles({
    name: 'private-hours.csv',
    mimeType: 'text/csv',
    buffer: Buffer.from('Description,Hours\nPrepared private estimate,2')
  });
  await expect(page.getByText('Imported 1 rows from private-hours.csv.')).toBeVisible();
  await expect.poll(() => page.evaluate(() => localStorage.getItem('worklog-appendix'))).toContain('Prepared private estimate');
  expect(external).toEqual([]);
});

test('invalid or negative CSV hours are rejected with a recovery instruction', async ({ page }) => {
  await page.goto('/workspace');
  for (const hours of ['abc', '-2']) {
    await page.locator('#csv-file').setInputFiles({
      name: 'bad-hours.csv',
      mimeType: 'text/csv',
      buffer: Buffer.from(`Description,Hours\nIncorrect row,${hours}`)
    });
    await expect(page.locator('#status')).toHaveText('Row 2 has an invalid Hours value. Use a zero or positive number, then import the file again.');
    await expect(page.getByRole('article')).toHaveCount(0);
  }
  await page.locator('#csv-file').setInputFiles({
    name: 'fixed-hours.csv',
    mimeType: 'text/csv',
    buffer: Buffer.from('Description,Hours\nCorrected row,2')
  });
  await expect(page.getByText('Imported 1 rows from fixed-hours.csv.')).toBeVisible();
  await expect(page.locator('.work-row > b')).toHaveText('2 h');
});

test('the landing page does not overflow a 390px viewport', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
});

test('keyboard users can reach and use the skip link without console errors', async ({ page }) => {
  const errors: string[] = [];
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  await page.goto('/');
  await page.keyboard.press('Tab');
  await expect(page.getByText('Skip to main content')).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('main')).toBeFocused();
  expect(errors).toEqual([]);
});

test('the production service worker has a release-specific cache and retires old caches', () => {
  const worker = readFileSync('dist/sw.js', 'utf8');
  expect(worker).not.toContain('__CACHE_VERSION__');
  expect(worker).toMatch(/worklog-appendix-[a-f0-9]{12}/);
  expect(worker).toContain("key.startsWith(CACHE_PREFIX) && key !== CACHE");
  expect(worker).toContain("event.request.mode === 'navigate'");
});

test('the Static Web Apps configuration serves only known SPA routes and a real 404', () => {
  const config = JSON.parse(readFileSync('public/staticwebapp.config.json', 'utf8'));
  expect(config.navigationFallback).toBeUndefined();
  for (const path of ['/demo', '/privacy', '/terms', '/workspace']) {
    expect(config.routes).toContainEqual(expect.objectContaining({ route: path, rewrite: '/index.html' }));
  }
  expect(config.responseOverrides['404']).toEqual({ rewrite: '/404.html', statusCode: 404 });
});

test('landing has a usable document outline and no serious axe violations', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle('Worklog Appendix — Explain billed work clearly');
  await expect(page.locator('html')).toHaveAttribute('lang','en');
  await expect(page.locator('main h1')).toHaveCount(1);
  const results = await new AxeBuilder({page}).analyze();
  expect(results.violations.filter(item => ['serious','critical'].includes(item.impact || ''))).toEqual([]);
});

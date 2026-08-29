import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { readFileSync } from 'node:fs';

test('@claim:csv-import imports a quoted CSV row and its hours into the demo workspace', async ({ page }) => {
  await page.goto('/demo');
  await page.locator('#csv-file').setInputFiles({name:'hours.csv',mimeType:'text/csv',buffer:Buffer.from('Date,Description,Hours,Milestone,Status\n2026-08-01,"Prepared, reviewed, and shipped",1.25,Release,approved')});
  await expect(page.getByText('Imported 1 rows from hours.csv.')).toBeVisible();
  await expect(page.getByRole('article').getByText('Prepared, reviewed, and shipped', {exact:true})).toBeVisible();
  await expect(page.locator('.work-row > b')).toHaveText('1.25 h');
});
test('@claim:invoice-lines creates matching client invoice lines', async ({ page }) => {
  await page.goto('/demo');
  await expect(page.locator('#invoice-lines')).toHaveValue([
    'Discovery & plan — 3.5 hours', 'Design system — 4.5 hours',
    'Client portal — 8 hours', 'Client review — 3 hours'
  ].join('\n'));
});
test('@claim:pdf-appendix opens a print-ready appendix', async ({ page }) => {
  await page.goto('/demo');
  const popup = page.waitForEvent('popup');
  await page.getByRole('button',{name:'Print appendix / save PDF'}).click();
  const report = await popup;
  await expect(report.getByRole('heading',{name:'Completed work for Northstar Studio'})).toBeVisible();
  await expect(report.getByText('Total approved work: 19 hours')).toBeVisible();
});
test('@claim:redaction removes personal detail while preserving ISO and localized dates', async ({ page }) => {
  await page.goto('/demo');
  await page.locator('#csv-file').setInputFiles({
    name: 'contact-details.csv',
    mimeType: 'text/csv',
    buffer: Buffer.from('Date,Description,Hours\n2026-08-29,"Send the update to sam@example.com or +1 (555) 444-1212",2\n29/08/2026,"Confirmed the local date format",1')
  });
  const popup = page.waitForEvent('popup');
  await page.getByRole('button', { name: 'Print appendix / save PDF' }).click();
  const report = await popup;
  await expect(report.locator('body')).toContainText('2026-08-29');
  await expect(report.locator('body')).toContainText('29/08/2026');
  await expect(report.locator('body')).toContainText('[email removed]');
  await expect(report.locator('body')).toContainText('[phone removed]');
  await expect(report.locator('body')).not.toContainText('sam@example.com');
  await expect(report.locator('body')).not.toContainText('+1 (555) 444-1212');
});

test('@claim:milestone-edit renames a milestone and updates its matching invoice line', async ({ page }) => {
  await page.goto('/demo');
  page.once('dialog', dialog => dialog.accept('Project planning'));
  await page.locator('[data-milestone]').nth(0).selectOption('__new');
  await expect(page.locator('#invoice-lines')).toHaveValue(/Project planning — 1\.5 hours/);
  await page.locator('[data-milestone]').nth(1).selectOption('Project planning');
  await expect(page.locator('#invoice-lines')).toHaveValue(/Project planning — 3\.5 hours/);
  await expect(page.locator('#invoice-lines')).not.toHaveValue(/Discovery & plan/);
});
test('@claim:offline-demo works after first visit with no external requests', async ({ page, context }) => {
  const external: string[] = [];
  page.on('request', request => { if (new URL(request.url()).origin !== 'http://127.0.0.1:4173') external.push(request.url()); });
  await page.goto('/demo');
  await expect(page.locator('body')).toContainText('Northstar Studio');
  await page.evaluate(() => navigator.serviceWorker.ready);
  // A navigation after activation makes the page service-worker controlled.
  await page.reload();
  await expect(page.getByText('Northstar Studio').first()).toBeVisible();
  await context.setOffline(true);
  await page.getByRole('button',{name:'Reset demo'}).click();
  await expect(page.getByText('Northstar Studio').first()).toBeVisible();
  await page.reload();
  await expect(page.getByText('Northstar Studio').first()).toBeVisible();
  expect(external).toEqual([]);
});

test('@claim:real-workspace-persistence keeps imported real-workspace data after reload with no upload', async ({ page }) => {
  const external: string[] = [];
  const writes: string[] = [];
  page.on('request', request => {
    if (new URL(request.url()).origin !== 'http://127.0.0.1:4173') external.push(request.url());
    if (!['GET', 'HEAD'].includes(request.method())) writes.push(`${request.method()} ${request.url()}`);
  });
  await page.goto('/workspace');
  await page.locator('#csv-file').setInputFiles({
    name: 'private-hours.csv',
    mimeType: 'text/csv',
    buffer: Buffer.from('Description,Hours\nPrepared private estimate,2')
  });
  await expect(page.getByText('Imported 1 rows from private-hours.csv.')).toBeVisible();
  await expect.poll(() => page.evaluate(() => localStorage.getItem('worklog-appendix'))).toContain('Prepared private estimate');
  await page.reload();
  await expect(page.getByRole('article').getByText('Prepared private estimate', { exact:true })).toBeVisible();
  expect(external).toEqual([]);
  expect(writes).toEqual([]);
});

test('@claim:demo-reset-isolation resets the sample and never reads or saves real workspace data', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('worklog-appendix', JSON.stringify({
    rows: [{id:'real-1',date:'2026-08-29',project:'Private',milestone:'Private',description:'Confidential real work',hours:2,status:'approved',notes:'',included:true}],
    settings: {client:'Private client',invoice:'INV-PRIVATE',period:'August',redact:true}
  })));
  await page.goto('/demo');
  await expect(page.getByText('Confidential real work')).toHaveCount(0);
  await page.locator('#csv-file').setInputFiles({ name:'demo-change.csv', mimeType:'text/csv', buffer:Buffer.from('Description,Hours\nTemporary demo change,2') });
  await expect(page.getByRole('article').getByText('Temporary demo change', { exact:true })).toBeVisible();
  await page.getByRole('button', { name:'Reset demo' }).click();
  await expect(page.getByText('Northstar Studio').first()).toBeVisible();
  await expect(page.getByText('Temporary demo change')).toHaveCount(0);
  await expect.poll(() => page.evaluate(() => localStorage.getItem('worklog-appendix'))).toContain('Confidential real work');
  await expect.poll(() => page.evaluate(() => localStorage.getItem('demo:worklog-appendix'))).toBeNull();
});

test('@claim:local-only keeps imported CSV data in the browser with no external requests', async ({ page }) => {
  const external: string[] = [];
  const writes: string[] = [];
  page.on('request', request => {
    if (new URL(request.url()).origin !== 'http://127.0.0.1:4173') external.push(request.url());
    if (!['GET', 'HEAD'].includes(request.method())) writes.push(`${request.method()} ${request.url()}`);
  });
  await page.goto('/workspace');
  await page.locator('#csv-file').setInputFiles({ name:'private-hours.csv', mimeType:'text/csv', buffer:Buffer.from('Description,Hours\nPrepared private estimate,2') });
  await expect.poll(() => page.evaluate(() => localStorage.getItem('worklog-appendix'))).toContain('Prepared private estimate');
  expect(external).toEqual([]);
  expect(writes).toEqual([]);
});

test('@claim:free-core-export lets a demo user print an appendix without an account or payment', async ({ page }) => {
  await page.goto('/demo');
  const popup = page.waitForEvent('popup');
  await page.getByRole('button', { name: 'Print appendix / save PDF' }).click();
  const report = await popup;
  await expect(report.getByText('Total approved work: 19 hours')).toBeVisible();
});

test('@claim:internal-notes never includes internal notes in the client preview or printed appendix', async ({ page }) => {
  await page.goto('/demo');
  await expect(page.locator('.report-panel')).not.toContainText('priya@northstar.example');
  const popup = page.waitForEvent('popup');
  await page.getByRole('button', { name: 'Print appendix / save PDF' }).click();
  const report = await popup;
  await expect(report.locator('body')).not.toContainText('Internal: client mentioned');
  await expect(report.locator('body')).not.toContainText('priya@northstar.example');
});

test('invalid or negative CSV hours are rejected with a recovery instruction', async ({ page }) => {
  await page.goto('/workspace');
  for (const hours of ['abc', '-2']) {
    await page.locator('#csv-file').setInputFiles({
      name: 'bad-hours.csv',
      mimeType: 'text/csv',
      buffer: Buffer.from(`Description,Hours\nIncorrect row,${hours}`)
    });
    await expect(page.locator('#status')).toHaveText('Row 2 has an invalid Hours value. Use a zero or positive number (for example 0.5), then import the file again.');
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

test('blank descriptions are rejected, leading-decimal hours are accepted, and a following valid import recovers', async ({ page }) => {
  await page.goto('/workspace');
  await page.locator('#csv-file').setInputFiles({ name:'blank-description.csv', mimeType:'text/csv', buffer:Buffer.from('Description,Hours\n,1') });
  await expect(page.locator('#status')).toHaveText('Row 2 needs a Description. Add a description, then import the file again.');
  await page.locator('#csv-file').setInputFiles({ name:'half-hour.csv', mimeType:'text/csv', buffer:Buffer.from('Description,Hours\nReviewed work,.5') });
  await expect(page.locator('.work-row > b')).toHaveText('0.5 h');
});

test('invalid saved workspace data is discarded and leaves an importable workspace', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('worklog-appendix', '{}'));
  await page.goto('/workspace');
  await expect(page.locator('#status')).toContainText('Saved workspace data was invalid and has been cleared.');
  await expect(page.getByRole('heading', { name:'Start with a worklog CSV' })).toBeVisible();
  await expect.poll(() => page.evaluate(() => localStorage.getItem('worklog-appendix'))).toBeNull();
});

test('SPA navigation to Demo resets real data into the isolated sample workspace', async ({ page }) => {
  await page.goto('/workspace');
  await page.locator('#csv-file').setInputFiles({ name:'private.csv', mimeType:'text/csv', buffer:Buffer.from('Description,Hours\nConfidential real work,2') });
  await expect(page.getByRole('article').getByText('Confidential real work', { exact:true })).toBeVisible();
  await page.getByRole('link', { name:'Demo' }).click();
  await expect(page).toHaveURL(/\/demo$/);
  await expect(page).toHaveTitle('Demo — Worklog Appendix');
  await expect(page.getByText('Demo — sample data, nothing is saved')).toBeVisible();
  await expect(page.getByText('Northstar Studio').first()).toBeVisible();
  await expect(page.getByText('Confidential real work')).toHaveCount(0);
});

test('row inclusion and milestone changes keep keyboard focus on the edited control', async ({ page }) => {
  await page.goto('/demo');
  const include = page.locator('[data-include]').first();
  await include.focus();
  await include.uncheck();
  await expect(page.locator('[data-include]').first()).toBeFocused();

  const milestone = page.locator('[data-milestone]').first();
  await milestone.focus();
  page.once('dialog', dialog => dialog.accept('Focused milestone'));
  await milestone.selectOption('__new');
  await expect(page.locator('[data-milestone]').first()).toBeFocused();
  await expect(page.locator('[data-milestone]').first()).toHaveValue('Focused milestone');
});

test('blank milestone names and zero selected rows show recovery instead of exporting empty output', async ({ page }) => {
  await page.goto('/workspace');
  await page.locator('#csv-file').setInputFiles({ name:'one-row.csv', mimeType:'text/csv', buffer:Buffer.from('Description,Hours,Milestone\nOne useful row,1,Original') });
  page.once('dialog', dialog => dialog.accept('   '));
  await page.locator('[data-milestone]').selectOption('__new');
  await expect(page.locator('#status')).toHaveText('A milestone needs a name. Type a client-facing name, then try again.');
  await expect(page.locator('#invoice-lines')).toHaveValue('Original — 1 hours');
  await page.locator('[data-include]').uncheck();
  await expect(page.locator('#status')).toHaveText('Include at least one row before printing the appendix.');
  await expect(page.getByRole('button', { name:'Print appendix / save PDF' })).toBeDisabled();
  await expect(page.locator('.empty-selection')).toBeVisible();
  await expect(page.locator('#invoice-lines')).toHaveCount(0);
});

test('SPA route changes focus and announce the new page heading', async ({ page }) => {
  await page.goto('/');
  await page.getByLabel('Main navigation').getByRole('link', { name:'Privacy' }).click();
  await expect(page.getByRole('heading', { name:'Your worklog stays close to you' })).toBeFocused();
  await expect(page.locator('#route-announcement')).toHaveText('Privacy — Worklog Appendix loaded');
});

test('imported CSV text is displayed as text, never interpreted as markup', async ({ page }) => {
  const errors: string[] = [];
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  await page.goto('/workspace');
  await page.locator('#csv-file').setInputFiles({
    name: 'hostile.csv',
    mimeType: 'text/csv',
    buffer: Buffer.from('Description,Hours,Milestone\n<img src=x>,2,<b>Release</b>')
  });
  await expect(page.locator('.work-row')).toContainText('<img src=x>');
  await expect(page.locator('.work-row')).toContainText('<b>Release</b>');
  await expect(page.locator('.work-row img')).toHaveCount(0);
  await expect(page.locator('.work-row b')).toHaveCount(1);
  expect(errors).toEqual([]);
});

test('the landing page does not overflow a 390px viewport', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
});

test('all app routes reflow without clipped navigation at 200% browser zoom', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const route of ['/', '/demo', '/workspace', '/privacy', '/terms']) {
    await page.goto(route);
    await page.evaluate(() => { document.documentElement.style.fontSize = '200%'; });
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
    const navigation = page.getByLabel('Main navigation');
    await expect(navigation).toBeVisible();
    for (const link of await navigation.getByRole('link').all()) await expect(link).toBeVisible();
  }
});

test('the interactive demo banner has no invalid live-region role', async ({ page }) => {
  await page.goto('/demo');
  await expect(page.locator('.demo-banner')).not.toHaveAttribute('role', 'status');
  const results = await new AxeBuilder({page}).analyze();
  expect(results.violations.filter(item => ['serious','critical'].includes(item.impact || ''))).toEqual([]);
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

test('keyboard users can Tab to the visible CSV picker and open it with Enter or Space', async ({ page }) => {
  for (const key of ['Enter', ' ']) {
    await page.goto('/workspace');
    const picker = page.locator('#csv-file');
    for (let index = 0; index < 16 && !await picker.evaluate(element => element === document.activeElement); index++) await page.keyboard.press('Tab');
    await expect(picker).toBeFocused();
    await expect(picker).toBeVisible();
    const chooser = page.waitForEvent('filechooser');
    await page.keyboard.press(key);
    await chooser;
  }
});

test('390px controls meet the 44px touch and high-contrast focus baselines', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/demo');
  for (const locator of [page.getByRole('button', {name:'Reset demo'}), page.getByRole('button', {name:'Start for real'}), page.locator('footer a')]) {
    const count = await locator.count();
    for (let index = 0; index < count; index++) {
      const box = await locator.nth(index).boundingBox();
      expect(box?.width).toBeGreaterThanOrEqual(44);
      expect(box?.height).toBeGreaterThanOrEqual(44);
    }
  }
  await page.locator('#redact').focus();
  expect(await page.locator('#redact').evaluate(element => getComputedStyle(element).outlineColor)).toBe('rgb(0, 90, 99)');
  const checkbox = await page.locator('#redact').boundingBox();
  expect(checkbox?.width).toBeGreaterThanOrEqual(44);
  expect(checkbox?.height).toBeGreaterThanOrEqual(44);
  await page.locator('[data-milestone]').first().focus();
  const select = await page.locator('[data-milestone]').first().boundingBox();
  expect(select?.height).toBeGreaterThanOrEqual(44);
});

test('the production service worker has a release-specific cache and retires old caches', () => {
  const worker = readFileSync('dist/sw.js', 'utf8');
  expect(worker).not.toContain('__CACHE_VERSION__');
  expect(worker).toMatch(/worklog-appendix-[a-f0-9]{12}/);
  expect(worker).toContain("key.startsWith(CACHE_PREFIX) && key !== CACHE");
  expect(worker).toContain("event.request.mode === 'navigate'");
  expect(worker).toMatch(/assets\/main-[^"]+\.js/);
  expect(worker).toMatch(/assets\/main-[^"]+\.css/);
});

test('the Static Web Apps configuration serves only known SPA routes and a real 404', () => {
  const config = JSON.parse(readFileSync('public/staticwebapp.config.json', 'utf8'));
  expect(config.navigationFallback).toBeUndefined();
  for (const path of ['/demo', '/privacy', '/terms', '/workspace']) {
    expect(config.routes).toContainEqual(expect.objectContaining({ route: path, rewrite: `${path}/index.html` }));
  }
  expect(config.responseOverrides['404']).toEqual({ rewrite: '/404.html', statusCode: 404 });
  expect(config.routes).toContainEqual(expect.objectContaining({ route:'/assets/*.webp', headers:{'Cache-Control':'public, max-age=300, must-revalidate'} }));
});

test('direct route documents have route-specific canonical metadata before JavaScript runs', () => {
  for (const [path, title] of [['demo', 'Demo — Worklog Appendix'], ['privacy', 'Privacy — Worklog Appendix'], ['terms', 'Terms — Worklog Appendix']] as const) {
    const source = readFileSync(`dist/${path}/index.html`, 'utf8');
    expect(source).toContain(`<title>${title}</title>`);
    expect(source).toContain(`https://worklog-appendix.sociobot.in/${path}`);
  }
  const landing = readFileSync('dist/index.html', 'utf8');
  expect(landing).toContain('twitter:title');
  expect(landing).toContain('/assets/social.webp');
  expect(readFileSync('dist/assets/social.webp').length).toBeGreaterThan(0);
  expect(readFileSync('dist/sitemap.xml', 'utf8')).toContain('https://worklog-appendix.sociobot.in/workspace');
});

test('landing has a usable document outline and no serious axe violations', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle('Worklog Appendix — Explain billed work clearly');
  await expect(page.locator('html')).toHaveAttribute('lang','en');
  await expect(page.locator('main h1')).toHaveCount(1);
  const results = await new AxeBuilder({page}).analyze();
  expect(results.violations.filter(item => ['serious','critical'].includes(item.impact || ''))).toEqual([]);
});

test('dark treatment keeps the landing page free of serious axe violations', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.goto('/');
  const results = await new AxeBuilder({page}).analyze();
  expect(results.violations.filter(item => ['serious','critical'].includes(item.impact || ''))).toEqual([]);
});

test('reduced motion uses instant scrolling and control transitions', async ({ page }) => {
  await page.emulateMedia({ reducedMotion:'reduce' });
  await page.goto('/');
  await expect(page.locator('html')).toHaveCSS('scroll-behavior', 'auto');
  await expect(page.getByRole('button', { name:'Try it with sample data' })).toHaveCSS('transition-duration', '0s');
});

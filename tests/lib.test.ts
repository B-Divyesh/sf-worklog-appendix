import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { csvRows, parseWorklogCsv, sampleRows, groups, invoiceLines, plural, reportMarkup, safeText, escapeHtml } from '../src/lib';

describe('worklog conversion', () => {
  it('imports approved rows and keeps quoted descriptions', () => {
    const rows = parseWorklogCsv('Date,Description,Hours,Milestone,Status\n2026-08-01,"Fixed, reviewed, and shipped",2,Release,approved\n2026-08-02,Waiting on client,1,Release,pending');
    expect(rows).toHaveLength(2);
    expect(rows[0].description).toBe('Fixed, reviewed, and shipped');
    expect(groups(rows)).toEqual([expect.objectContaining({ name:'Release', hours:2 })]);
  });
  it('rejects malformed and negative hours instead of changing invoice totals', () => {
    for (const value of ['abc', '-2', '2 hours', '']) {
      expect(() => parseWorklogCsv(`Description,Hours\nTask,${value}`)).toThrow('Row 2 has an invalid Hours value. Use a zero or positive number (for example 0.5), then import the file again.');
    }
  });
  it('accepts a leading-decimal positive number and rejects blank descriptions', () => {
    expect(parseWorklogCsv('Description,Hours\nHalf hour,.5')[0].hours).toBe(.5);
    expect(() => parseWorklogCsv('Description,Hours\n,1')).toThrow('Row 2 needs a Description. Add a description, then import the file again.');
  });
  it('produces one matching line for every milestone', () => {
    const lines=invoiceLines(sampleRows);
    expect(lines).toContain('Client portal — 8 hours');
    expect(lines).toHaveLength(4);
  });
  it('uses singular and plural client-facing quantity labels', () => {
    expect(plural(1, 'hour')).toBe('1 hour');
    expect(plural(1, 'row')).toBe('1 row');
    expect(plural(1.5, 'hour')).toBe('1.5 hours');
    expect(invoiceLines([{...sampleRows[0], hours:1, milestone:'Release'}])).toEqual(['Release — 1 hour']);
  });
  it('produces a print-ready row for each included record', () => {
    const selected=sampleRows.filter(row=>row.included);
    const markup=reportMarkup(sampleRows,{client:'Northstar Studio',invoice:'INV-2048',period:'August',redact:true});
    expect(markup).toContain('Completed work for Northstar Studio');
    expect((markup.match(/<tr>/g)||[]).length).toBe(selected.length + 4);
    expect(markup).toContain('<html lang="en">');
    expect(markup).toContain('<main>');
  });
  it('removes an email and phone detail from the client report', () => {
    expect(safeText('Ask sam@example.com or +1 (555) 444-1212',true)).toBe('Ask [email removed] or [phone removed]');
  });
  it('keeps ISO and localized dates while redacting contact detail', () => {
    expect(safeText('2026-08-29 and 29/08/2026: sam@example.com, 555-444-1212', true))
      .toBe('2026-08-29 and 29/08/2026: [email removed], [phone removed]');
  });
  it('escapes imported text before it reaches the workspace or printable report', () => {
    const hostile = '<img src=x onerror=alert(1)>';
    expect(escapeHtml(hostile)).toBe('&lt;img src=x onerror=alert(1)&gt;');
    const markup = reportMarkup([{ ...sampleRows[0], description: hostile }], {client:'<b>Client</b>',invoice:'INV',period:'August',redact:false});
    expect(markup).toContain('&lt;img src=x onerror=alert(1)&gt;');
    expect(markup).toContain('&lt;b&gt;Client&lt;/b&gt;');
    expect(markup).not.toContain(hostile);
  });
  it('ships sample data without a network request', () => {
    expect(sampleRows.length).toBeGreaterThanOrEqual(8);
    expect(csvRows('A,B\n1,2')).toEqual([['A','B'],['1','2']]);
  });
});

describe('public claims contract', () => {
  it('lists every claim tag exactly once and keeps the repaired promises aligned', () => {
    const claims = JSON.parse(readFileSync('.factory/claims.json', 'utf8')) as Array<{id:string; claim:string; test:string}>;
    const browserTests = readFileSync('tests/browser.pw.ts', 'utf8');
    const source = readFileSync('src/main.ts', 'utf8');
    const ids = claims.map(item => item.id);
    const tags = [...browserTests.matchAll(/@claim:([a-z0-9-]+)/g)].map(match => match[1]);

    expect(new Set(ids).size).toBe(ids.length);
    expect(tags.sort()).toEqual([...ids].sort());
    for (const item of claims) {
      expect(item.test).toBe(`npm test -- --grep @claim:${item.id}`);
      expect(tags.filter(tag => tag === item.id)).toHaveLength(1);
    }

    expect(claims).toContainEqual(expect.objectContaining({
      id: 'included-rows',
      claim: 'Only included rows appear in the report.'
    }));
    expect(source).toContain('Only included rows appear in the report.');
    expect(source).not.toContain('does not run timers, invoice clients, or monitor anyone');
  });
});

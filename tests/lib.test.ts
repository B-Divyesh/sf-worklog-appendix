import { describe, expect, it } from 'vitest';
import { csvRows, parseWorklogCsv, sampleRows, groups, invoiceLines, reportMarkup, safeText } from '../src/lib';

describe('worklog conversion', () => {
  it('imports approved rows and keeps quoted descriptions', () => {
    const rows = parseWorklogCsv('Date,Description,Hours,Milestone,Status\n2026-08-01,"Fixed, reviewed, and shipped",2,Release,approved\n2026-08-02,Waiting on client,1,Release,pending');
    expect(rows).toHaveLength(2);
    expect(rows[0].description).toBe('Fixed, reviewed, and shipped');
    expect(groups(rows)).toEqual([expect.objectContaining({ name:'Release', hours:2 })]);
  });
  it('rejects malformed and negative hours instead of changing invoice totals', () => {
    for (const value of ['abc', '-2', '2 hours', '']) {
      expect(() => parseWorklogCsv(`Description,Hours\nTask,${value}`)).toThrow('Row 2 has an invalid Hours value. Use a zero or positive number, then import the file again.');
    }
  });
  it('produces one matching line for every milestone', () => {
    const lines=invoiceLines(sampleRows);
    expect(lines).toContain('Client portal — 8 hours');
    expect(lines).toHaveLength(4);
  });
  it('produces a print-ready row for each included record', () => {
    const selected=sampleRows.filter(row=>row.included);
    const markup=reportMarkup(sampleRows,{client:'Northstar Studio',invoice:'INV-2048',period:'August',redact:true});
    expect(markup).toContain('Completed work for Northstar Studio');
    expect((markup.match(/<tr>/g)||[]).length).toBe(selected.length + 4);
  });
  it('removes an email and phone detail from the client report', () => {
    expect(safeText('Ask sam@example.com or +1 (555) 444-1212',true)).toBe('Ask [email removed] or [phone removed]');
  });
  it('ships sample data without a network request', () => {
    expect(sampleRows.length).toBeGreaterThanOrEqual(8);
    expect(csvRows('A,B\n1,2')).toEqual([['A','B'],['1','2']]);
  });
});

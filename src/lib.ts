export type Worklog = { id: string; date: string; project: string; milestone: string; description: string; hours: number; rate?: number; status: string; notes: string; included: boolean };
export type Settings = { client: string; invoice: string; period: string; redact: boolean };

export const sampleRows: Worklog[] = [
  ['2026-08-03','Northstar Studio','Discovery & plan','Reviewed onboarding notes and agreed the sprint plan.',1.5,'approved','Internal: client mentioned a new launch date.'],
  ['2026-08-04','Northstar Studio','Discovery & plan','Mapped the customer handoff and open questions.',2,'approved',''],
  ['2026-08-05','Northstar Studio','Design system','Built responsive page patterns for the client portal.',3.5,'approved',''],
  ['2026-08-06','Northstar Studio','Design system','Reviewed navigation states with the product lead.',1,'approved','Call notes: Maya confirmed the scope.'],
  ['2026-08-07','Northstar Studio','Client portal','Implemented account summary and invoice history screens.',4,'approved',''],
  ['2026-08-10','Northstar Studio','Client portal','Fixed mobile table layout and keyboard focus order.',2.5,'approved',''],
  ['2026-08-11','Northstar Studio','Client portal','Prepared the release checklist and handoff notes.',1.5,'approved','Email change request came from priya@northstar.example'],
  ['2026-08-12','Northstar Studio','Client review','Ran review call and documented approved revisions.',1,'approved',''],
  ['2026-08-13','Northstar Studio','Client review','Applied approved content and spacing revisions.',2,'approved',''],
  ['2026-08-14','Northstar Studio','Client review','Recorded remaining work for the next billing period.',0.75,'pending','Not ready to bill.']
].map(([date,project,milestone,description,hours,status,notes], i) => ({ id: `sample-${i}`, date: String(date), project: String(project), milestone: String(milestone), description: String(description), hours: Number(hours), status: String(status), notes: String(notes), included: status === 'approved' }));

export function csvRows(source: string): string[][] {
  const out: string[][] = []; let row: string[] = []; let cell = ''; let quoted = false;
  for (let i = 0; i < source.length; i++) { const ch = source[i]; const next = source[i + 1];
    if (ch === '"' && quoted && next === '"') { cell += '"'; i++; }
    else if (ch === '"') quoted = !quoted;
    else if (ch === ',' && !quoted) { row.push(cell.trim()); cell = ''; }
    else if ((ch === '\n' || ch === '\r') && !quoted) { if (ch === '\r' && next === '\n') i++; row.push(cell.trim()); if (row.some(Boolean)) out.push(row); row = []; cell = ''; }
    else cell += ch;
  }
  row.push(cell.trim()); if (row.some(Boolean)) out.push(row); return out;
}

const keys: Record<string, string[]> = { date:['date','work date','day'], project:['project','client project'], milestone:['milestone','task group','category'], description:['description','task','work','details','note'], hours:['hours','duration','billable hours'], rate:['rate','hourly rate'], status:['status','approval'], notes:['notes','internal notes','internal note'] };
function get(record: Record<string,string>, field: string) { return (keys[field] || []).map(k => record[k]).find(v => v !== undefined) || ''; }
export function parseWorklogCsv(source: string): Worklog[] {
  const rows = csvRows(source); if (rows.length < 2) throw new Error('This file needs a header row and at least one worklog row.');
  const headers = rows[0].map(h => h.toLowerCase().trim());
  if (!headers.some(h => keys.description.includes(h)) || !headers.some(h => keys.hours.includes(h))) throw new Error('Add Description and Hours columns, then import the file again.');
  return rows.slice(1).map((values, i) => {
    const record = Object.fromEntries(headers.map((h,n) => [h, values[n] || '']));
    const rawHours = get(record,'hours').trim();
    const hours = Number(rawHours);
    if (!/^(?:0|[1-9]\d*)(?:\.\d+)?$/.test(rawHours) || !Number.isFinite(hours) || hours < 0) {
      throw new Error(`Row ${i + 2} has an invalid Hours value. Use a zero or positive number, then import the file again.`);
    }
    const status = get(record,'status').toLowerCase() || 'approved';
    return { id:`import-${Date.now()}-${i}`, date:get(record,'date') || 'Undated', project:get(record,'project') || 'Project', milestone:get(record,'milestone') || get(record,'project') || 'Work completed', description:get(record,'description'), hours, rate:Number(get(record,'rate').replace(/[^0-9.]/g,'')) || undefined, status, notes:get(record,'notes'), included: status === 'approved' };
  });
}
export function safeText(value: string, redact: boolean) { return redact ? value.replace(/[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}/g, '[email removed]').replace(/(?:\+?\d[\d .()-]{7,}\d)/g, '[phone removed]') : value; }
export function groups(rows: Worklog[]) { const map = new Map<string, Worklog[]>(); rows.filter(r => r.included).forEach(r => map.set(r.milestone || 'Work completed', [...(map.get(r.milestone || 'Work completed') || []), r])); return [...map.entries()].map(([name, items]) => ({ name, items, hours: items.reduce((n,r) => n + r.hours,0), amount: items.reduce((n,r) => n + r.hours * (r.rate || 0),0) })); }
export function invoiceLines(rows: Worklog[]) { return groups(rows).map(g => `${g.name} — ${fmt(g.hours)} hours${g.amount ? ` — ${money(g.amount)}` : ''}`); }
export function fmt(n: number) { return n.toLocaleString(undefined,{maximumFractionDigits:2}); }
export function money(n: number) { return new Intl.NumberFormat(undefined,{style:'currency',currency:'USD'}).format(n); }
export function reportMarkup(rows: Worklog[], settings: Settings) { const gs = groups(rows); const total = gs.reduce((n,g)=>n+g.hours,0); const esc=(s:string)=>safeText(s,settings.redact).replace(/&/g,'&amp;').replace(/</g,'&lt;'); return `<!doctype html><html><head><meta charset="utf-8"><title>Worklog appendix ${esc(settings.invoice)}</title><style>body{font:14px system-ui;color:#10233b;max-width:800px;margin:42px auto;padding:0 24px}h1{font:700 32px Georgia,serif}h2{margin:30px 0 8px;border-bottom:2px solid #087e8b;padding-bottom:7px}table{width:100%;border-collapse:collapse}th,td{text-align:left;padding:8px;border-bottom:1px solid #ccd8da;vertical-align:top}.num{text-align:right}small{color:#49616a}.total{font-size:18px;font-weight:700}@media print{body{margin:0}}</style></head><body><small>WORKLOG APPENDIX</small><h1>Completed work for ${esc(settings.client || 'Client')}</h1><p>Invoice ${esc(settings.invoice || '—')} · ${esc(settings.period || 'Billing period')}</p>${gs.map(g=>`<h2>${esc(g.name)} <span style="float:right">${fmt(g.hours)} hours</span></h2><table><thead><tr><th>Date</th><th>Completed work</th><th class="num">Hours</th></tr></thead><tbody>${g.items.map(r=>`<tr><td>${esc(r.date)}</td><td>${esc(r.description)}</td><td class="num">${fmt(r.hours)}</td></tr>`).join('')}</tbody></table>`).join('')}<p class="total">Total approved work: ${fmt(total)} hours</p><p><small>Prepared with Worklog Appendix. Internal notes are ${settings.redact ? 'not included' : 'included only where supplied'}.</small></p></body></html>`; }

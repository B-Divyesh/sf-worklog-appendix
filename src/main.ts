import './style.css';
import './accessibility.css';
import { type Worklog, type Settings, sampleRows, parseWorklogCsv, groups, invoiceLines, fmt, plural, reportMarkup, safeText, escapeHtml } from './lib';

declare global { interface HTMLScriptElement { href?: string } interface HTMLLinkElement { src?: string } interface HTMLImageElement { href?: string } }

const app = document.querySelector<HTMLDivElement>('#app')!;
const build = 'v1.0.2';
const origin = 'https://worklog-appendix.sociobot.in';
const productSlug = 'worklog-appendix';
const billingApi = 'https://api.sociobot.in/api/v1';
const checkoutUrl = `${billingApi}/products/${productSlug}/checkout`;
const licenseKey = `sb_license:${productSlug}`;
const licenseVerdictKey = `${licenseKey}:verdict`;
const presetsKey = `${productSlug}:presets`;
let isDemo = false;
let rows: Worklog[] = [];
let settings: Settings = { client:'', invoice:'', period:'', redact:true };
let message = '';
let shouldFocusHeading = false;
let licenseMessage = '';
let presetDraft = '';
type LicenseVerdict = { valid: boolean; checkedAt: number; reason?: string };
type Preset = { id: string; name: string; client: string; invoice: string; period: string };
type EditorFocus = { attribute: 'data-include' | 'data-milestone'; id: string } | { selector: string };
const ns = () => isDemo ? 'demo:worklog-appendix' : 'worklog-appendix';
const display = (value: string) => escapeHtml(safeText(value, settings.redact));
const attr = (value: string) => escapeHtml(value);
const save = () => { if (!isDemo) localStorage.setItem(ns(), JSON.stringify({rows,settings})); };
function readLicenseVerdict(): LicenseVerdict | null {
  try {
    const verdict = JSON.parse(localStorage.getItem(licenseVerdictKey) || '') as LicenseVerdict;
    return typeof verdict.valid === 'boolean' && Number.isFinite(verdict.checkedAt) ? verdict : null;
  } catch { return null; }
}
function isLicensed() { return Boolean(localStorage.getItem(licenseKey) && readLicenseVerdict()?.valid); }
function readPresets(): Preset[] {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(presetsKey) || '[]');
    if (!Array.isArray(value)) return [];
    return value.filter((item): item is Preset => Boolean(item && typeof item === 'object'
      && ['id','name','client','invoice','period'].every(key => typeof (item as Record<string, unknown>)[key] === 'string')));
  } catch { return []; }
}
function acceptLicenseFromUrl() {
  const url = new URL(location.href);
  const token = url.searchParams.get('license')?.trim();
  if (!token) return;
  if (url.pathname === '/demo' || url.searchParams.get('demo') === '1') {
    url.pathname = '/workspace';
    url.searchParams.delete('demo');
    history.replaceState({}, '', `${url.pathname}${url.search}${url.hash}`);
  }
  localStorage.setItem(licenseKey, token);
  localStorage.removeItem(licenseVerdictKey);
  url.searchParams.delete('license');
  history.replaceState({}, '', `${url.pathname}${url.search}${url.hash}`);
  licenseMessage = 'Checking this license…';
}
async function verifyStoredLicense(force = false) {
  if (isDemo) return;
  const token = localStorage.getItem(licenseKey);
  if (!token) return;
  const cached = readLicenseVerdict();
  if (!force && cached && Date.now() - cached.checkedAt < 86_400_000) return;
  try {
    const response = await fetch(`${billingApi}/products/${productSlug}/verify?license=${encodeURIComponent(token)}`);
    const result = await response.json() as { valid?: boolean; reason?: string };
    if (!response.ok || typeof result.valid !== 'boolean') throw new Error('verification unavailable');
    localStorage.setItem(licenseVerdictKey, JSON.stringify({valid:result.valid,reason:result.reason,checkedAt:Date.now()}));
    licenseMessage = result.valid ? 'License active. Client presets are available.' : 'License no longer active. Buy or restore a current license.';
  } catch {
    licenseMessage = cached?.valid ? 'Offline. Your last verified license remains active.' : 'The license could not be checked. Go online and try again.';
  }
  render();
}
function validStoredWorkspace(value: unknown): value is { rows: Worklog[]; settings: Settings } {
  if (!value || typeof value !== 'object') return false;
  const candidate = value as { rows?: unknown; settings?: unknown };
  const validRow = (row: unknown): row is Worklog => {
    if (!row || typeof row !== 'object') return false;
    const item = row as Record<string, unknown>;
    return ['id', 'date', 'project', 'milestone', 'description', 'status', 'notes'].every(key => typeof item[key] === 'string')
      && typeof item.hours === 'number' && Number.isFinite(item.hours) && item.hours >= 0
      && typeof item.included === 'boolean' && (item.rate === undefined || (typeof item.rate === 'number' && Number.isFinite(item.rate) && item.rate >= 0));
  };
  const candidateSettings = candidate.settings as Record<string, unknown> | undefined;
  return Array.isArray(candidate.rows) && candidate.rows.every(validRow)
    && !!candidateSettings && ['client', 'invoice', 'period'].every(key => typeof candidateSettings[key] === 'string')
    && typeof candidateSettings.redact === 'boolean';
}
const load = () => {
  rows = [];
  settings = { client:'', invoice:'', period:'', redact:true };
  const raw = localStorage.getItem(ns());
  if (!raw) return;
  try {
    const stored: unknown = JSON.parse(raw);
    if (!validStoredWorkspace(stored)) throw new Error('invalid saved workspace');
    rows = stored.rows;
    settings = stored.settings;
  } catch {
    localStorage.removeItem(ns());
    message = 'Saved workspace data was invalid and has been cleared. Import a CSV to begin again.';
  }
};
const sample = () => { rows = structuredClone(sampleRows); settings = {client:'Northstar Studio',invoice:'INV-2048',period:'3–14 August 2026',redact:true}; message='Sample worklog loaded. Change anything you need.'; };

function setMetadata(title: string, description: string, path: string) {
  document.title = title;
  document.querySelector('meta[name="description"]')?.setAttribute('content', description);
  document.querySelector('link[rel="canonical"]')?.setAttribute('href', `${origin}${path}`);
  document.querySelector('meta[property="og:title"]')?.setAttribute('content', title);
  document.querySelector('meta[property="og:description"]')?.setAttribute('content', description);
}
function route(path: string) { history.pushState({},'',path); shouldFocusHeading = true; render(); window.scrollTo({top:0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'}); }
window.addEventListener('popstate',()=>{ shouldFocusHeading = true; render(); });
function header(){return `<div id="route-announcement" class="sr-only" aria-live="polite" aria-atomic="true"></div><a class="skip" href="#main">Skip to main content</a><header><a class="brand" href="/" data-route>Worklog <i>Appendix</i></a><nav aria-label="Main navigation"><a href="/demo" data-route>Demo</a><a href="/#how">How it works</a><a href="/privacy" data-route>Privacy</a></nav></header>`;}
function footer(){return `<footer><p>Clear work evidence for client invoices.</p><p><a href="/privacy" data-route>Privacy</a> · <a href="/terms" data-route>Terms</a> · Built by Param Factory · ${build}</p><p class="generated">Illustration generated for this product.</p></footer>`;}
function page(title:string, description:string, path:string, heading:string, body:string){ setMetadata(title,description,path); app.innerHTML=`${header()}<main id="main" tabindex="-1"><section class="legal"><p class="eyebrow">WORKLOG APPENDIX</p><h1 tabindex="-1">${heading}</h1>${body}</section></main>${footer()}`; bindBase(); }
function landing(){
  setMetadata('Worklog Appendix — Explain billed work clearly','Turn approved worklogs into a clear invoice appendix and matching line summary.','/');
  app.innerHTML=`${header()}<main id="main" tabindex="-1"><section class="hero"><div class="hero-copy"><p class="eyebrow">PRIVATE INVOICE COMPANION</p><h1 tabindex="-1">Explain billed work clearly</h1><p class="lede">For freelancers whose clients need a clear account before they approve invoice hours.</p><div class="actions"><button class="primary" id="try-sample">Try it with sample data</button><span>See a ready-to-print appendix.</span></div><ul class="facts"><li>Your CSV stays in this browser.</li><li>No account or upload.</li><li>Core export stays free.</li></ul></div><figure><img src="/assets/hero.webp" width="1200" height="800" fetchpriority="high" decoding="async" alt="Glowing document layers mark a clear path through a dark data landscape."><figcaption>Turn rows of work into a readable client document.</figcaption></figure></section><section class="preview" aria-labelledby="preview-title"><div><p class="eyebrow">THE RESULT</p><h2 id="preview-title">One invoice summary. One readable appendix.</h2><p>Group approved rows by milestone. Keep dates and completed work beneath each group.</p></div><div class="mini-report"><p class="doc-label">INV-2048 · NORTHSTAR STUDIO</p><h3>Client portal <b>8 hours</b></h3><p>7 Aug — Implemented account summary and invoice history screens. <strong>4</strong></p><p>10 Aug — Fixed mobile table layout and keyboard focus order. <strong>2.5</strong></p><p>11 Aug — Prepared release checklist and handoff notes. <strong>1.5</strong></p><hr><p class="total">Matching invoice line: Client portal — 8 hours</p></div></section><section id="how" class="how"><p class="eyebrow">HOW IT WORKS</p><h2>Make the invoice easier to approve</h2><ol><li><b>Import a CSV</b><span>Use columns for dates, descriptions, hours, and optional milestones.</span></li><li><b>Check the groups</b><span>Include approved rows. Rename a milestone when the client needs plainer wording.</span></li><li><b>Print the appendix</b><span>Save the clean report as a PDF. Copy the matching invoice lines.</span></li></ol></section><section class="privacy-note"><h2>Your CSV stays local</h2><p>You choose the CSV. Worklog Appendix reads it and prepares the appendix in this browser.</p><a href="/privacy" data-route>Read how local storage works</a></section><section class="tier" aria-labelledby="license-title"><p class="eyebrow">ONE-TIME LICENSE · $19 USD</p><h2 id="license-title">Reuse client details</h2><p>Core import, redaction, invoice lines, and PDF printing stay free. A $19 one-time license adds saved client presets.</p><a class="button primary" href="${checkoutUrl}">Buy client presets — $19</a>${licenseControls()}</section></main>${footer()}`;
  bindBase();
  bindLicense();
  document.querySelector('#try-sample')?.addEventListener('click',()=>{isDemo=true;sample();route('/demo');});
}
function demoBanner(){return isDemo ? `<aside class="demo-banner" aria-label="Demo workspace"><p><strong>Demo</strong> — sample data, nothing is saved.</p><div><button id="reset-demo">Reset demo</button><button id="start-real">Start for real</button></div></aside>` : '';}
function licenseControls() {
  const hasToken = Boolean(localStorage.getItem(licenseKey));
  return `<form id="license-form" class="license-form"><label for="license-token">Have a license? Paste it here</label><div><input id="license-token" name="license" autocomplete="off" required><button class="secondary" type="submit">Restore license</button></div></form><p id="license-note" class="small" aria-live="polite">${attr(licenseMessage || (isLicensed() ? 'License active.' : 'License checks send only the token to Sociobot.'))}</p>${hasToken ? '<button class="link-button" id="remove-license" type="button">Remove stored license</button>' : ''}`;
}
function presetPanel() {
  if (isDemo) return '';
  if (!isLicensed()) return `<section class="preset-panel" aria-labelledby="preset-title"><div><p class="eyebrow">CLIENT PRESETS · PAID</p><h2 id="preset-title">Reuse client details</h2><p>Save client, invoice, and billing-period details with a verified $19 one-time license.</p></div><a class="button secondary" href="${checkoutUrl}">Buy client presets — $19</a>${licenseControls()}</section>`;
  const presets = readPresets();
  return `<section class="preset-panel" aria-labelledby="preset-title"><div><p class="eyebrow">CLIENT PRESETS · LICENSE ACTIVE</p><h2 id="preset-title">Reuse client details</h2><p>Presets stay in this browser and never include worklog rows.</p></div><div class="preset-actions"><label>Preset name<input id="preset-name" autocomplete="off" value="${attr(presetDraft)}"></label><button class="secondary" id="save-preset">Save current details</button>${presets.length ? `<label>Saved preset<select id="saved-preset">${presets.map(preset=>`<option value="${attr(preset.id)}">${display(preset.name)}</option>`).join('')}</select></label><button class="secondary" id="apply-preset">Apply preset</button><button class="link-button" id="delete-preset">Delete preset</button>` : '<p class="small">No presets saved yet.</p>'}</div>${licenseControls()}</section>`;
}
function filePicker(label: string) { return `<label class="file-picker"><span>${label}</span><input id="csv-file" type="file" accept=".csv,text/csv"></label>`; }
function appPage(){
  if (isDemo && !rows.length) sample();
  if (!isDemo && !rows.length) load();
  const title = isDemo ? 'Demo — Worklog Appendix' : 'Workspace — Worklog Appendix';
  const description = isDemo ? 'Try Worklog Appendix with a private, resettable Northstar Studio sample.' : 'Import a worklog CSV and prepare a client-readable appendix.';
  setMetadata(title,description,isDemo ? '/demo' : '/workspace');
  app.innerHTML=`${header()}${demoBanner()}<main id="main" tabindex="-1" class="workspace"><section class="work-head"><div><p class="eyebrow">${isDemo?'SAMPLE WORKSPACE':'YOUR WORKSPACE'}</p><h1 tabindex="-1">Build a worklog appendix</h1><p>Only included rows appear in the report.</p></div><div class="head-actions">${rows.length ? filePicker('Import a CSV') : ''}<button class="primary" id="print-report" ${rows.some(row=>row.included)?'':'disabled'}>Print appendix / save PDF</button></div></section><p id="status" class="status" aria-live="polite">${attr(message)}</p><section class="setup" aria-label="Report details"><label>Client<input id="client" value="${attr(settings.client)}"></label><label>Invoice number<input id="invoice" value="${attr(settings.invoice)}"></label><label>Billing period<input id="period" value="${attr(settings.period)}"></label><label class="check"><input id="redact" type="checkbox" ${settings.redact?'checked':''}> Remove email and phone detail</label></section>${presetPanel()}${rows.length ? workContent() : emptyState()}</main>${footer()}`;
  bindBase();
  bindWork();
}
function emptyState(){return `<section class="empty"><div class="beacon"></div><h2>Start with a worklog CSV</h2><p>Your report will show approved rows grouped by milestone.</p>${filePicker('Choose a CSV')}<p class="small">Required: Description and Hours. Helpful: Date, Milestone, Status, and Internal Notes.</p><button class="link-button" id="load-sample">Load sample data instead</button></section>`;}
function workContent(){
  const gs=groups(rows);
  const total=rows.filter(r=>r.included).reduce((n,r)=>n+r.hours,0);
  const milestones = [...new Set(rows.map(row => row.milestone))];
  const hasIncluded = rows.some(row => row.included);
  return `<section class="report-grid"><div class="rows-panel"><div class="section-heading"><div><p class="eyebrow">SOURCE ROWS</p><h2>Choose approved work</h2></div><span>${plural(rows.filter(r=>r.included).length, 'row')} included</span></div><div class="row-list">${rows.map(r=>`<article class="work-row"><label class="include"><input type="checkbox" data-include="${attr(r.id)}" ${r.included?'checked':''}><span class="sr-only">Include ${display(r.description)}</span></label><div class="row-copy"><small>${display(r.date)} · ${display(r.project)}</small><p>${display(r.description)}</p>${r.notes ? `<small class="internal">Internal note kept out of the report: ${display(r.notes)}</small>`:''}</div><label class="milestone-label">Milestone<select data-milestone="${attr(r.id)}">${milestones.map(m=>`<option value="${attr(m)}" ${m===r.milestone?'selected':''}>${display(m)}</option>`).join('')}<option value="__new">Add a group…</option></select></label><b>${fmt(r.hours)} h</b></article>`).join('')}</div></div><aside class="report-panel"><p class="eyebrow">CLIENT PREVIEW</p><h2>${display(settings.client || 'Client name')}</h2><p class="muted">${display(settings.invoice || 'Invoice number')} · ${display(settings.period || 'Billing period')}</p>${gs.map(g=>`<section class="group"><h3>${display(g.name)}<span>${plural(g.hours, 'hour')}</span></h3><p>${g.items.slice(0,2).map(r=>display(r.description)).join(' ')}</p><small>${plural(g.items.length, 'completed row')}</small></section>`).join('')}${hasIncluded ? `<p class="report-total">${plural(total, 'approved hour')}</p><button class="copy" id="copy-lines">Copy invoice lines</button><textarea id="invoice-lines" readonly aria-label="Matching invoice lines">${attr(invoiceLines(rows).join('\n'))}</textarea>` : '<p class="empty-selection">Include at least one row before copying or printing the appendix.</p>'}</aside></section>`;
}
function bindBase(){
  document.querySelector<HTMLAnchorElement>('.skip')?.addEventListener('click', event => {
    event.preventDefault();
    document.querySelector<HTMLElement>('#main')?.focus();
  });
  document.querySelectorAll<HTMLElement>('[data-route]').forEach(link=>link.addEventListener('click',event=>{event.preventDefault(); route(link.getAttribute('href')!);}));
}
function bindWork(){
  const update=(patch:Partial<Settings>, selector?:string)=>{settings={...settings,...patch};save();render(selector ? {selector} : undefined);};
  ['client','invoice','period'].forEach(key=>document.querySelector<HTMLInputElement>(`#${key}`)?.addEventListener('change',event=>update({[key]:(event.target as HTMLInputElement).value}, `#${key}`)));
  document.querySelector<HTMLInputElement>('#redact')?.addEventListener('change',event=>update({redact:(event.target as HTMLInputElement).checked}, '#redact'));
  const csvFile = document.querySelector<HTMLInputElement>('#csv-file');
  csvFile?.addEventListener('keydown', event=>{
    if(event.key===' ' || event.key==='Enter'){
      event.preventDefault();
      if (typeof csvFile.showPicker === 'function') csvFile.showPicker();
      else csvFile.click();
    }
  });
  csvFile?.addEventListener('change', async event=>{
    const file=(event.target as HTMLInputElement).files?.[0];
    if(!file)return;
    try { rows=parseWorklogCsv(await file.text()); message=`Imported ${plural(rows.length, 'row')} from ${file.name}.`; save(); render(); }
    catch(error){message=error instanceof Error?error.message:'The CSV could not be read.';render();}
  });
  document.querySelector('#load-sample')?.addEventListener('click',()=>{sample();save();render();});
  document.querySelectorAll<HTMLInputElement>('[data-include]').forEach(input=>input.addEventListener('change',()=>{const row=rows.find(item=>item.id===input.dataset.include);if(!row)return; row.included=input.checked; if(!rows.some(item=>item.included)) message='Include at least one row before printing the appendix.'; save();render({attribute:'data-include',id:row.id});}));
  document.querySelectorAll<HTMLSelectElement>('[data-milestone]').forEach(input=>input.addEventListener('change',()=>{const row=rows.find(item=>item.id===input.dataset.milestone);if(!row)return; if(input.value==='__new'){const name=window.prompt('Name this milestone for the client.'); const trimmed=name?.trim(); if(!trimmed){message='A milestone needs a name. Type a client-facing name, then try again.';render({attribute:'data-milestone',id:row.id});return;} row.milestone=trimmed;} else row.milestone=input.value; save();render({attribute:'data-milestone',id:row.id});}));
  document.querySelector('#print-report')?.addEventListener('click',printReport);
  document.querySelector('#copy-lines')?.addEventListener('click',async()=>{try {await navigator.clipboard.writeText(invoiceLines(rows).join('\n'));message='Invoice lines copied.';}catch{message='Copy was blocked. Select the text below and copy it.';}render({selector:'#copy-lines'});});
  document.querySelector('#reset-demo')?.addEventListener('click',()=>{sample();message='Demo reset.';render({selector:'#reset-demo'});});
  document.querySelector('#start-real')?.addEventListener('click',()=>{isDemo=false;rows=[];settings={client:'',invoice:'',period:'',redact:true};message='Your workspace is ready. Import a CSV to begin.';route('/workspace');});
  bindLicense();
  document.querySelector<HTMLInputElement>('#preset-name')?.addEventListener('input', event=>{
    presetDraft=(event.target as HTMLInputElement).value;
  });
  document.querySelector('#save-preset')?.addEventListener('click',()=>{
    const name = presetDraft.trim();
    if (!name) { message='Name this preset, then save it again.'; render({selector:'#preset-name'}); return; }
    const presets = readPresets();
    presets.push({id:crypto.randomUUID(),name,client:settings.client,invoice:settings.invoice,period:settings.period});
    localStorage.setItem(presetsKey,JSON.stringify(presets));
    presetDraft='';
    message=`Saved the ${name} client preset.`; render({selector:'#saved-preset'});
  });
  document.querySelector('#apply-preset')?.addEventListener('click',()=>{
    const id=document.querySelector<HTMLSelectElement>('#saved-preset')?.value;
    const preset=readPresets().find(item=>item.id===id); if(!preset)return;
    settings={client:preset.client,invoice:preset.invoice,period:preset.period,redact:settings.redact}; save();
    message=`Applied the ${preset.name} client preset.`; render({selector:'#saved-preset'});
  });
  document.querySelector('#delete-preset')?.addEventListener('click',()=>{
    const id=document.querySelector<HTMLSelectElement>('#saved-preset')?.value;
    const presets=readPresets(); const preset=presets.find(item=>item.id===id); if(!preset)return;
    localStorage.setItem(presetsKey,JSON.stringify(presets.filter(item=>item.id!==id)));
    message=`Deleted the ${preset.name} client preset.`; render({selector:'#preset-name'});
  });
}
function bindLicense() {
  document.querySelector<HTMLFormElement>('#license-form')?.addEventListener('submit',event=>{
    event.preventDefault();
    const token=document.querySelector<HTMLInputElement>('#license-token')?.value.trim() || '';
    if(!token){licenseMessage='Paste a license token, then restore it.';render();return;}
    localStorage.setItem(licenseKey,token);localStorage.removeItem(licenseVerdictKey);
    licenseMessage='Checking this license…';render();void verifyStoredLicense(true);
  });
  document.querySelector('#remove-license')?.addEventListener('click',()=>{
    localStorage.removeItem(licenseKey);localStorage.removeItem(licenseVerdictKey);
    licenseMessage='Stored license removed. Your presets remain on this device.';render();
  });
}
function printReport(){ if(!rows.some(row=>row.included)){message='Include at least one row before printing the appendix.';render({selector:'#print-report'});return;} const pop=window.open('','worklog-appendix-report'); if(!pop){message='Your browser blocked the print window. Allow pop-ups, then try again.';render({selector:'#print-report'});return;} pop.document.write(reportMarkup(rows,settings)); pop.document.close(); pop.focus(); pop.print(); }
function render(focus?: EditorFocus){
  const path=location.pathname;
  const nextIsDemo = path === '/demo' || new URLSearchParams(location.search).get('demo') === '1';
  if (nextIsDemo !== isDemo) {
    isDemo = nextIsDemo;
    rows = [];
    settings = { client:'', invoice:'', period:'', redact:true };
    message = '';
    if (isDemo) sample();
  }
  if(path==='/privacy') page('Privacy — Worklog Appendix','How Worklog Appendix keeps CSV data local to your browser.','/privacy','Your worklog stays close to you',`<p>Worklog Appendix reads CSV files locally. It never sends worklog rows, client details, or presets to a server.</p><h2>Local storage</h2><p>A real workspace stores its current report in this browser. Paid client presets and a restored license also stay here. Clear this site's browser data to delete all three. Removing the stored license in the app deletes only the license check; your report and presets remain. The demo stays in memory and does not read or save real workspace data.</p><h2>License checks</h2><p>Buying opens Sociobot checkout. Restoring a license sends only its token to api.sociobot.in for verification, at most once every 24 hours. No CSV content or client detail is sent.</p><h2>No tracking</h2><p>No account is required for the app. There is no analytics or advertising tracker.</p>`);
  else if(path==='/terms') page('Terms — Worklog Appendix','Terms for using Worklog Appendix to prepare client-facing reports.','/terms','Use this report with care',`<p>Worklog Appendix helps you prepare a client-facing appendix. You are responsible for checking its wording, hours, and exported PDF before sending it.</p><h2>One-time license</h2><p>The $19 USD license adds saved client presets. Core export and redaction remain free. Sociobot and Dodo are the merchant of record. A refund revokes the license automatically. A refunded or revoked license loses access to client presets.</p><h2>No warranty</h2><p>The app is provided as-is to the extent allowed by law.</p>`);
  else if(path==='/demo' || path==='/workspace') appPage();
  else landing();
  if (shouldFocusHeading) {
    const announcement = document.querySelector<HTMLElement>('#route-announcement');
    if (announcement) announcement.textContent = `${document.title} loaded`;
    setTimeout(()=>document.querySelector<HTMLElement>('main h1')?.focus(),0);
    shouldFocusHeading = false;
  }
  if (focus) {
    const target = 'selector' in focus
      ? document.querySelector<HTMLElement>(focus.selector)
      : [...document.querySelectorAll<HTMLElement>(`[${focus.attribute}]`)].find(control => control.getAttribute(focus.attribute) === focus.id);
    target?.focus();
  }
}
acceptLicenseFromUrl();
render();
void verifyStoredLicense();
if ('serviceWorker' in navigator) window.addEventListener('load', () => navigator.serviceWorker.register('/sw.js').catch(() => {}));

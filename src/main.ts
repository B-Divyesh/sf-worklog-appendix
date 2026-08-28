import './style.css';
import './accessibility.css';
import { type Worklog, type Settings, sampleRows, parseWorklogCsv, groups, invoiceLines, fmt, reportMarkup, safeText, escapeHtml } from './lib';

declare global { interface HTMLScriptElement { href?: string } interface HTMLLinkElement { src?: string } interface HTMLImageElement { href?: string } }

const app = document.querySelector<HTMLDivElement>('#app')!;
const build = 'v1.0.0';
const origin = 'https://worklog-appendix.sociobot.in';
let isDemo = location.pathname === '/demo' || new URLSearchParams(location.search).get('demo') === '1';
let rows: Worklog[] = [];
let settings: Settings = { client:'', invoice:'', period:'', redact:true };
let message = '';
const ns = () => isDemo ? 'demo:worklog-appendix' : 'worklog-appendix';
const display = (value: string) => escapeHtml(safeText(value, settings.redact));
const attr = (value: string) => escapeHtml(value);
const save = () => { if (!isDemo) localStorage.setItem(ns(), JSON.stringify({rows,settings})); };
const load = () => { const raw = localStorage.getItem(ns()); if (raw) try { ({rows,settings} = JSON.parse(raw)); } catch { localStorage.removeItem(ns()); } };
const sample = () => { rows = structuredClone(sampleRows); settings = {client:'Northstar Studio',invoice:'INV-2048',period:'3–14 August 2026',redact:true}; message='Sample worklog loaded. Change anything you need.'; };

function setMetadata(title: string, description: string, path: string) {
  document.title = title;
  document.querySelector('meta[name="description"]')?.setAttribute('content', description);
  document.querySelector('link[rel="canonical"]')?.setAttribute('href', `${origin}${path}`);
  document.querySelector('meta[property="og:title"]')?.setAttribute('content', title);
  document.querySelector('meta[property="og:description"]')?.setAttribute('content', description);
}
function route(path: string) { history.pushState({},'',path); render(); window.scrollTo({top:0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'}); }
window.addEventListener('popstate',render);
function header(){return `<a class="skip" href="#main">Skip to main content</a><header><a class="brand" href="/" data-route>Worklog <i>Appendix</i></a><nav aria-label="Main navigation"><a href="/demo" data-route>Demo</a><a href="/#how">How it works</a><a href="/privacy" data-route>Privacy</a></nav></header>`;}
function footer(){return `<footer><p>Clear work evidence for client invoices.</p><p><a href="/privacy" data-route>Privacy</a> · <a href="/terms" data-route>Terms</a> · Built by Param Factory · ${build}</p><p class="generated">Illustration generated for this product.</p></footer>`;}
function page(title:string, description:string, path:string, heading:string, body:string){ setMetadata(title,description,path); app.innerHTML=`${header()}<main id="main" tabindex="-1"><section class="legal"><p class="eyebrow">WORKLOG APPENDIX</p><h1>${heading}</h1>${body}</section></main>${footer()}`; bindBase(); }
function landing(){
  setMetadata('Worklog Appendix — Explain billed work clearly','Turn approved worklogs into a clear invoice appendix and matching line summary.','/');
  app.innerHTML=`${header()}<main id="main" tabindex="-1"><section class="hero"><div class="hero-copy"><p class="eyebrow">PRIVATE INVOICE COMPANION</p><h1>Explain billed work clearly</h1><p class="lede">For freelancers whose clients need a clear account before they approve invoice hours.</p><div class="actions"><button class="primary" id="try-sample">Try it with sample data</button><span>See a ready-to-print appendix.</span></div><ul class="facts"><li>Your CSV stays in this browser.</li><li>No account or upload.</li><li>Free core export.</li></ul></div><figure><img src="/assets/hero.webp" width="1200" height="800" fetchpriority="high" decoding="async" alt="Glowing document layers mark a clear path through a dark data landscape."><figcaption>Turn rows of work into a readable client document.</figcaption></figure></section><section class="preview" aria-labelledby="preview-title"><div><p class="eyebrow">THE RESULT</p><h2 id="preview-title">One invoice summary. One readable appendix.</h2><p>Group approved rows by milestone. Keep dates and completed work beneath each group.</p></div><div class="mini-report"><p class="doc-label">INV-2048 · NORTHSTAR STUDIO</p><h3>Client portal <b>8 hours</b></h3><p>7 Aug — Implemented account summary and invoice history screens. <strong>4</strong></p><p>10 Aug — Fixed mobile table layout and keyboard focus order. <strong>2.5</strong></p><p>11 Aug — Prepared release checklist and handoff notes. <strong>1.5</strong></p><hr><p class="total">Matching invoice line: Client portal — 8 hours</p></div></section><section id="how" class="how"><p class="eyebrow">HOW IT WORKS</p><h2>Make the invoice easier to approve</h2><ol><li><b>Import a CSV</b><span>Use columns for dates, descriptions, hours, and optional milestones.</span></li><li><b>Check the groups</b><span>Include approved rows. Rename a milestone when the client needs plainer wording.</span></li><li><b>Print the appendix</b><span>Save the clean report as a PDF. Copy the matching invoice lines.</span></li></ol></section><section class="privacy-note"><h2>It is not a time tracker</h2><p>Worklog Appendix does not run timers, invoice clients, or monitor anyone. It only turns the worklog you choose into a client-facing companion.</p><a href="/privacy" data-route>Read how local storage works</a></section></main>${footer()}`;
  bindBase();
  document.querySelector('#try-sample')?.addEventListener('click',()=>{isDemo=true;sample();route('/demo');});
}
function demoBanner(){return isDemo ? `<aside class="demo-banner" role="status">Demo — sample data, nothing is saved <button id="reset-demo">Reset demo</button><button id="start-real">Start for real</button></aside>` : '';}
function filePicker(label: string) { return `<label class="file-picker"><span>${label}</span><input id="csv-file" type="file" accept=".csv,text/csv"></label>`; }
function appPage(){
  if (isDemo && !rows.length) sample();
  if (!isDemo && !rows.length) load();
  const title = isDemo ? 'Demo — Worklog Appendix' : 'Workspace — Worklog Appendix';
  const description = isDemo ? 'Try Worklog Appendix with a private, resettable Northstar Studio sample.' : 'Import a worklog CSV and prepare a client-readable appendix.';
  setMetadata(title,description,isDemo ? '/demo' : '/workspace');
  app.innerHTML=`${header()}${demoBanner()}<main id="main" tabindex="-1" class="workspace"><section class="work-head"><div><p class="eyebrow">${isDemo?'SAMPLE WORKSPACE':'YOUR WORKSPACE'}</p><h1>Build a worklog appendix</h1><p>Only included rows appear in the report.</p></div><div class="head-actions">${rows.length ? filePicker('Import a CSV') : ''}<button class="primary" id="print-report" ${rows.length?'':'disabled'}>Print appendix / save PDF</button></div></section><p id="status" class="status" aria-live="polite">${attr(message)}</p><section class="setup" aria-label="Report details"><label>Client<input id="client" value="${attr(settings.client)}"></label><label>Invoice number<input id="invoice" value="${attr(settings.invoice)}"></label><label>Billing period<input id="period" value="${attr(settings.period)}"></label><label class="check"><input id="redact" type="checkbox" ${settings.redact?'checked':''}> Remove email and phone detail</label></section>${rows.length ? workContent() : emptyState()}</main>${footer()}`;
  bindBase();
  bindWork();
}
function emptyState(){return `<section class="empty"><div class="beacon"></div><h2>Start with a worklog CSV</h2><p>Your report will show approved rows grouped by milestone.</p>${filePicker('Choose a CSV')}<p class="small">Required: Description and Hours. Helpful: Date, Milestone, Status, and Internal Notes.</p><button class="link-button" id="load-sample">Load sample data instead</button></section>`;}
function workContent(){
  const gs=groups(rows);
  const total=rows.filter(r=>r.included).reduce((n,r)=>n+r.hours,0);
  const milestones = [...new Set(rows.map(row => row.milestone))];
  return `<section class="report-grid"><div class="rows-panel"><div class="section-heading"><div><p class="eyebrow">SOURCE ROWS</p><h2>Choose approved work</h2></div><span>${rows.filter(r=>r.included).length} included</span></div><div class="row-list">${rows.map(r=>`<article class="work-row"><label class="include"><input type="checkbox" data-include="${attr(r.id)}" ${r.included?'checked':''}><span class="sr-only">Include ${display(r.description)}</span></label><div class="row-copy"><small>${display(r.date)} · ${display(r.project)}</small><p>${display(r.description)}</p>${r.notes ? `<small class="internal">Internal note kept out of the report: ${display(r.notes)}</small>`:''}</div><label class="milestone-label">Milestone<select data-milestone="${attr(r.id)}">${milestones.map(m=>`<option value="${attr(m)}" ${m===r.milestone?'selected':''}>${display(m)}</option>`).join('')}<option value="__new">Add a group…</option></select></label><b>${fmt(r.hours)} h</b></article>`).join('')}</div></div><aside class="report-panel"><p class="eyebrow">CLIENT PREVIEW</p><h2>${display(settings.client || 'Client name')}</h2><p class="muted">${display(settings.invoice || 'Invoice number')} · ${display(settings.period || 'Billing period')}</p>${gs.map(g=>`<section class="group"><h3>${display(g.name)}<span>${fmt(g.hours)} h</span></h3><p>${g.items.slice(0,2).map(r=>display(r.description)).join(' ')}</p><small>${g.items.length} completed row${g.items.length===1?'':'s'}</small></section>`).join('')}<p class="report-total">${fmt(total)} approved hours</p><button class="copy" id="copy-lines">Copy invoice lines</button><textarea id="invoice-lines" readonly aria-label="Matching invoice lines">${attr(invoiceLines(rows).join('\n'))}</textarea></aside></section>`;
}
function bindBase(){ document.querySelectorAll<HTMLElement>('[data-route]').forEach(link=>link.addEventListener('click',event=>{event.preventDefault(); route(link.getAttribute('href')!);})); }
function bindWork(){
  const update=(patch:Partial<Settings>)=>{settings={...settings,...patch};save();render();};
  ['client','invoice','period'].forEach(key=>document.querySelector<HTMLInputElement>(`#${key}`)?.addEventListener('change',event=>update({[key]:(event.target as HTMLInputElement).value})));
  document.querySelector<HTMLInputElement>('#redact')?.addEventListener('change',event=>update({redact:(event.target as HTMLInputElement).checked}));
  document.querySelector<HTMLInputElement>('#csv-file')?.addEventListener('change', async event=>{
    const file=(event.target as HTMLInputElement).files?.[0];
    if(!file)return;
    try { rows=parseWorklogCsv(await file.text()); message=`Imported ${rows.length} rows from ${file.name}.`; save(); render(); }
    catch(error){message=error instanceof Error?error.message:'The CSV could not be read.';render();}
  });
  document.querySelector('#load-sample')?.addEventListener('click',()=>{sample();save();render();});
  document.querySelectorAll<HTMLInputElement>('[data-include]').forEach(input=>input.addEventListener('change',()=>{const row=rows.find(item=>item.id===input.dataset.include);if(row)row.included=input.checked;save();render();}));
  document.querySelectorAll<HTMLSelectElement>('[data-milestone]').forEach(input=>input.addEventListener('change',()=>{const row=rows.find(item=>item.id===input.dataset.milestone);if(!row)return; if(input.value==='__new'){const name=window.prompt('Name this milestone for the client.'); if(!name){render();return;} row.milestone=name;} else row.milestone=input.value; save();render();}));
  document.querySelector('#print-report')?.addEventListener('click',printReport);
  document.querySelector('#copy-lines')?.addEventListener('click',async()=>{try {await navigator.clipboard.writeText(invoiceLines(rows).join('\n'));message='Invoice lines copied.';}catch{message='Copy was blocked. Select the text below and copy it.';}render();});
  document.querySelector('#reset-demo')?.addEventListener('click',()=>{sample();message='Demo reset.';render();});
  document.querySelector('#start-real')?.addEventListener('click',()=>{isDemo=false;rows=[];settings={client:'',invoice:'',period:'',redact:true};message='Your workspace is ready. Import a CSV to begin.';route('/workspace');});
}
function printReport(){ const pop=window.open('','worklog-appendix-report'); if(!pop){message='Your browser blocked the print window. Allow pop-ups, then try again.';render();return;} pop.document.write(reportMarkup(rows,settings)); pop.document.close(); pop.focus(); pop.print(); }
function render(){
  const path=location.pathname;
  if(path==='/privacy') page('Privacy — Worklog Appendix','How Worklog Appendix keeps CSV data local to your browser.','/privacy','Your worklog stays close to you',`<p>Worklog Appendix runs in your browser. CSV files are read locally and are never uploaded by this app.</p><h2>Local storage</h2><p>In a real workspace, the browser may store your current report so you can return to it. Clear your browser storage to remove it. The demo uses a separate temporary browser area and is not saved.</p><h2>No tracking</h2><p>No account is required. There is no analytics or advertising tracker.</p>`);
  else if(path==='/terms') page('Terms — Worklog Appendix','Terms for using Worklog Appendix to prepare client-facing reports.','/terms','Use this report with care',`<p>Worklog Appendix helps you prepare a client-facing appendix. You are responsible for checking its wording, hours, and exported PDF before sending it.</p><h2>No warranty</h2><p>The app is provided as-is to the extent allowed by law.</p>`);
  else if(path==='/demo' || path==='/workspace') appPage();
  else landing();
  setTimeout(()=>document.querySelector<HTMLElement>('main h1')?.focus(),0);
}
render();
if ('serviceWorker' in navigator) window.addEventListener('load', () => navigator.serviceWorker.register('/sw.js').catch(() => {}));

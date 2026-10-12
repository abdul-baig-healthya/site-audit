// Renders report.json data into one self-contained HTML file.
// All rendering happens client-side from the embedded JSON so the page stays in sync with report.json.

export function renderReport(data) {
  const json = JSON.stringify(data).replace(/</g, '\\u003c');
  const host = new URL(data.target).hostname;
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Site Audit — ${host}</title>
<style>
:root {
  --bg: #f7f7f5; --surface: #ffffff; --surface-2: #f0efec; --text: #1c1c1a; --muted: #66645e; --border: #e2e0db;
  --accent: #2f5bd3; --critical: #b3261e; --serious: #d0611b; --moderate: #a07a00; --minor: #5d6b7a; --good: #1e7d4f;
  --critical-bg: #fbe9e7; --serious-bg: #fdf0e6; --moderate-bg: #fbf5df; --minor-bg: #eef1f4; --good-bg: #e6f4ec;
}
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    --bg: #141413; --surface: #1d1d1b; --surface-2: #262623; --text: #ecebe7; --muted: #a3a19a; --border: #34332f;
    --accent: #7b9cff; --critical: #ff8a80; --serious: #ffab70; --moderate: #e8c95a; --minor: #a8b4c2; --good: #6fd19c;
    --critical-bg: #3a1d1b; --serious-bg: #3a2717; --moderate-bg: #352e14; --minor-bg: #262b31; --good-bg: #17301f;
  }
}
:root[data-theme="dark"] {
  --bg: #141413; --surface: #1d1d1b; --surface-2: #262623; --text: #ecebe7; --muted: #a3a19a; --border: #34332f;
  --accent: #7b9cff; --critical: #ff8a80; --serious: #ffab70; --moderate: #e8c95a; --minor: #a8b4c2; --good: #6fd19c;
  --critical-bg: #3a1d1b; --serious-bg: #3a2717; --moderate-bg: #352e14; --minor-bg: #262b31; --good-bg: #17301f;
}
* { box-sizing: border-box; }
body { margin: 0; background: var(--bg); color: var(--text); font: 14px/1.5 -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
a { color: var(--accent); }
header { padding: 28px 16px 8px; max-width: 1280px; margin: 0 auto; }
header h1 { margin: 0 0 4px; font-size: 24px; }
header p { margin: 0; color: var(--muted); }
nav.tabs { position: sticky; top: 0; z-index: 5; background: var(--bg); border-bottom: 1px solid var(--border); }
nav.tabs div { max-width: 1280px; margin: 0 auto; padding: 0 16px; display: flex; gap: 2px; overflow-x: auto; }
nav.tabs button { background: none; border: 0; border-bottom: 2px solid transparent; color: var(--muted); padding: 12px 12px; font: inherit; cursor: pointer; white-space: nowrap; }
nav.tabs button[aria-selected="true"] { color: var(--text); border-color: var(--accent); font-weight: 600; }
main { max-width: 1280px; margin: 0 auto; padding: 28px 16px 72px; }
section[hidden] { display: none; }
h2 { font-size: 18px; margin: 40px 0 12px; }
h3 { font-size: 15px; margin: 24px 0 8px; }
section > :first-child { margin-top: 0; }
.lead { color: var(--muted); font-size: 15px; max-width: 820px; margin: 0 0 28px; }
.hint { color: var(--muted); max-width: 820px; margin: -6px 0 14px; }
.cards.health-grid { grid-template-columns: repeat(auto-fill, minmax(min(340px, 100%), 1fr)); }
.card.health { display: flex; flex-direction: column; gap: 10px; padding: 16px 18px; }
.h-top { display: flex; justify-content: space-between; align-items: center; gap: 8px; }
.h-title { font-weight: 700; font-size: 15px; }
.card.health p { margin: 0; color: var(--muted); flex: 1; }
.card .t { font-weight: 600; }
.pair { display: flex; gap: 18px; margin-top: 10px; }
.pair small { display: block; color: var(--muted); font-size: 11px; margin-bottom: 3px; }
.goto { align-self: flex-start; background: none; border: 0; padding: 0; color: var(--accent); font: inherit; font-weight: 600; cursor: pointer; white-space: nowrap; }
.goto:hover { text-decoration: underline; }
.fix { display: flex; gap: 14px; align-items: center; padding: 12px 16px; border-bottom: 1px solid var(--border); }
.fix:last-child { border-bottom: 0; }
.fix .pill { min-width: 68px; text-align: center; }
.fix .grow { min-width: 0; }
.cards { display: grid; grid-template-columns: repeat(auto-fill, minmax(170px, 1fr)); gap: 14px; }
.card { background: var(--surface); border: 1px solid var(--border); border-radius: 10px; padding: 16px; }
.card .v { font-size: 28px; font-weight: 700; font-variant-numeric: tabular-nums; }
.card .l { color: var(--muted); font-size: 12px; }
.panel { background: var(--surface); border: 1px solid var(--border); border-radius: 10px; overflow: hidden; }
.scroll { overflow-x: auto; }
table { width: 100%; border-collapse: collapse; }
th, td { text-align: left; padding: 10px 12px; border-bottom: 1px solid var(--border); vertical-align: top; }
th { background: var(--surface-2); font-size: 12px; color: var(--muted); font-weight: 600; position: sticky; top: 0; cursor: pointer; user-select: none; }
td.num, th.num { text-align: right; font-variant-numeric: tabular-nums; }
tr:last-child td { border-bottom: 0; }
.url { word-break: break-all; max-width: 520px; }
.pill { display: inline-block; padding: 1px 8px; border-radius: 999px; font-size: 12px; font-weight: 600; white-space: nowrap; }
.critical, .error { color: var(--critical); background: var(--critical-bg); }
.serious { color: var(--serious); background: var(--serious-bg); }
.moderate, .warning { color: var(--moderate); background: var(--moderate-bg); }
.minor, .notice { color: var(--minor); background: var(--minor-bg); }
.ok { color: var(--good); background: var(--good-bg); }
.score { display: inline-block; min-width: 36px; text-align: center; padding: 2px 6px; border-radius: 6px; font-weight: 700; font-variant-numeric: tabular-nums; }
details { border-bottom: 1px solid var(--border); }
details:last-child { border-bottom: 0; }
summary { padding: 12px 14px; cursor: pointer; display: flex; gap: 10px; align-items: baseline; flex-wrap: wrap; }
summary:hover { background: var(--surface-2); }
.det { padding: 4px 16px 18px; }
code, pre { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 12px; }
pre { background: var(--surface-2); padding: 8px 10px; border-radius: 6px; white-space: pre-wrap; word-break: break-all; margin: 4px 0; }
.muted { color: var(--muted); }
.grow { flex: 1; min-width: 200px; }
input[type=search] { width: 100%; max-width: 420px; padding: 8px 10px; border: 1px solid var(--border); border-radius: 8px; background: var(--surface); color: var(--text); font: inherit; margin-bottom: 10px; }
ul.plain { margin: 6px 0; padding-left: 18px; }
.bar { display: flex; height: 10px; border-radius: 5px; overflow: hidden; background: var(--surface-2); margin-top: 8px; }
.bar span { display: block; }
.two { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 24px; }
.seg { display: flex; justify-content: center; gap: 4px; margin-bottom: 20px; }
.seg button { display: inline-flex; align-items: center; gap: 8px; background: none; border: 0; border-bottom: 2px solid transparent; color: var(--muted); padding: 10px 16px; font: inherit; cursor: pointer; }
.seg button[aria-selected="true"] { color: var(--accent); border-color: var(--accent); background: var(--surface-2); font-weight: 600; }
.seg svg { width: 20px; height: 20px; fill: none; stroke: currentColor; stroke-width: 1.8; }
.frames { display: flex; flex-wrap: wrap; gap: 32px 40px; align-items: flex-end; justify-content: center; padding: 16px 0 8px; }
.frame { margin: 0; display: flex; flex-direction: column; align-items: center; max-width: 100%; }
.frame figcaption { margin-top: 12px; color: var(--muted); font-size: 12px; text-align: center; }
.device { position: relative; width: 100%; background: #111113; box-shadow: 0 0 0 1px var(--border), 0 12px 32px rgba(0, 0, 0, .18); }
.screen { overflow-y: auto; overflow-x: hidden; background: #fff; scrollbar-width: thin; }
.screen img { display: block; width: 100%; height: auto; }
.screen.live { overflow: hidden; }
.screen iframe { display: block; border: 0; background: #fff; transform-origin: 0 0; }
.seg button:disabled { opacity: .45; cursor: not-allowed; }
.center { text-align: center; }
.screen p { padding: 12px; color: #66645e; }
.frame .base { display: none; }
.frame.mobile { width: 250px; }
.frame.mobile .device { padding: 34px 11px 30px; border-radius: 40px; }
.frame.mobile .device::before { content: ""; position: absolute; top: 11px; left: 50%; transform: translateX(-50%); width: 70px; height: 16px; border-radius: 10px; background: #000; box-shadow: inset 0 0 0 1px #2a2a2e; }
.frame.mobile .device::after { content: ""; position: absolute; bottom: 12px; left: 50%; transform: translateX(-50%); width: 80px; height: 4px; border-radius: 2px; background: #5a5a60; }
.frame.mobile .screen { border-radius: 6px; }
.frame.tablet { width: 380px; }
.frame.tablet .device { padding: 26px 18px; border-radius: 28px; }
.frame.tablet .device::before { content: ""; position: absolute; top: 10px; left: 50%; transform: translateX(-50%); width: 7px; height: 7px; border-radius: 50%; background: #2a2a2e; }
.frame.tablet .screen { border-radius: 4px; }
.frame.laptop { width: min(620px, 100%); padding: 0 30px; }
.frame.laptop .device { padding: 18px 14px 16px; border-radius: 16px 16px 0 0; }
.frame.laptop .device::before { content: ""; position: absolute; top: 6px; left: 50%; transform: translateX(-50%); width: 6px; height: 6px; border-radius: 50%; background: #2a2a2e; }
.frame.laptop .base { display: block; position: relative; width: calc(100% + 60px); height: 16px; border-radius: 0 0 18px 18px; background: linear-gradient(#e4e4e7, #9f9fa6); }
.frame.laptop .base::before { content: ""; position: absolute; top: 0; left: 50%; transform: translateX(-50%); width: 100px; height: 6px; border-radius: 0 0 8px 8px; background: #b9b9bf; }
.frame.desktop { width: min(680px, 100%); }
.frame.desktop .device { padding: 14px 14px 34px; border-radius: 14px; }
.frame.desktop .device::after { content: ""; position: absolute; bottom: 13px; left: 50%; transform: translateX(-50%); width: 8px; height: 8px; border-radius: 50%; background: #2a2a2e; }
.frame.desktop .base { display: block; position: relative; width: 220px; height: 64px; }
.frame.desktop .base::before { content: ""; position: absolute; top: 0; left: 50%; transform: translateX(-50%); width: 80px; height: 58px; background: linear-gradient(90deg, #a1a1aa, #d4d4d8, #a1a1aa); clip-path: polygon(22% 0, 78% 0, 90% 100%, 10% 100%); }
.frame.desktop .base::after { content: ""; position: absolute; bottom: 0; left: 0; width: 100%; height: 8px; border-radius: 4px; background: linear-gradient(#d4d4d8, #9f9fa6); }
.json { white-space: pre; word-break: normal; overflow: auto; max-height: 560px; margin: 0; padding: 12px 14px; line-height: 1.55; }
.json.wrap { white-space: pre-wrap; overflow-wrap: anywhere; }
.j-k { color: var(--accent); }
.j-s { color: var(--good); }
.j-n, .j-b { color: var(--serious); }
.code-bar { display: flex; gap: 8px; justify-content: flex-end; margin: 4px 0 8px; }
.btn { background: var(--surface); color: var(--text); border: 1px solid var(--border); border-radius: 6px; padding: 4px 10px; font: inherit; font-size: 12px; cursor: pointer; }
.btn:hover { border-color: var(--accent); }
.btn[aria-pressed="true"] { background: var(--surface-2); font-weight: 600; }
.theme { float: right; background: var(--surface); color: var(--text); border: 1px solid var(--border); border-radius: 8px; padding: 6px 10px; cursor: pointer; font: inherit; }
@media (max-width: 600px) { .card .v { font-size: 22px; } th, td { padding: 6px; } }
</style>
</head>
<body>
<header>
  <button class="theme" id="theme" type="button">Toggle theme</button>
  <h1>Site audit: ${host}</h1>
  <p id="sub"></p>
</header>
<nav class="tabs" aria-label="Report sections"><div role="tablist" id="tabs"></div></nav>
<main id="main"></main>
<script type="application/json" id="data">${json}</script>
<script>
const D = JSON.parse(document.getElementById('data').textContent);
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const IMPACTS = ['critical', 'serious', 'moderate', 'minor'];
const pages = D.pages.filter(Boolean);
const okPages = pages.filter((p) => p.axe);
const pill = (cls, txt) => '<span class="pill ' + esc(cls) + '">' + esc(txt ?? cls) + '</span>';
const link = (u, t) => '<a href="' + esc(u) + '" target="_blank" rel="noopener">' + esc(t ?? u) + '</a>';
const scoreCls = (s) => (s == null ? '' : s >= 90 ? 'ok' : s >= 50 ? 'moderate' : 'critical');
const score = (s) => '<span class="score ' + scoreCls(s) + '">' + (s ?? '–') + '</span>';
const waveLink = (u) => link('https://wave.webaim.org/report#/' + encodeURIComponent(u), 'WAVE');
const table = (head, rows, numCols = []) => '<div class="panel scroll"><table><thead><tr>' +
  head.map((h, i) => '<th' + (numCols.includes(i) ? ' class="num"' : '') + '>' + esc(h) + '</th>').join('') + '</tr></thead><tbody>' +
  (rows.length ? rows.map((r) => '<tr>' + r.map((c, i) => '<td' + (numCols.includes(i) ? ' class="num"' : '') + '>' + c + '</td>').join('') + '</tr>').join('') : '<tr><td colspan="' + head.length + '" class="muted">None 🎉</td></tr>') +
  '</tbody></table></div>';

// ---- aggregations ----
const axeRules = {};
for (const p of okPages) for (const v of p.axe.violations) {
  const r = (axeRules[v.id] ||= { ...v, pages: [], nodes: 0 });
  r.pages.push({ url: p.url, count: v.count, nodes: v.nodes });
  r.nodes += v.count;
}
const axeList = Object.values(axeRules).sort((a, b) => IMPACTS.indexOf(a.impact) - IMPACTS.indexOf(b.impact) || b.pages.length - a.pages.length);
const impactNodes = Object.fromEntries(IMPACTS.map((i) => [i, axeList.filter((r) => r.impact === i).reduce((s, r) => s + r.nodes, 0)]));
const pagesWithBlocking = okPages.filter((p) => p.axe.violations.some((v) => v.impact === 'critical' || v.impact === 'serious')).length;

const structAgg = {};
for (const p of pages) for (const i of p.issues || []) (structAgg[i.id] ||= { ...i, pages: [] }).pages.push({ url: p.url, msg: i.msg });
const structList = Object.values(structAgg).sort((a, b) => ['error', 'warning', 'notice'].indexOf(a.severity) - ['error', 'warning', 'notice'].indexOf(b.severity) || b.pages.length - a.pages.length);

const htmlAgg = {};
for (const p of pages) for (const m of p.htmlValidation?.messages || []) {
  const r = (htmlAgg[m.rule] ||= { rule: m.rule, severity: m.severity, count: 0, pages: new Set(), example: m.message });
  r.count++; r.pages.add(p.url);
}
const htmlList = Object.values(htmlAgg).sort((a, b) => b.pages.size - a.pages.size);
const htmlErrors = pages.reduce((s, p) => s + (p.htmlValidation?.errors || 0), 0);

const LH_CATS = [['performance', 'Performance'], ['accessibility', 'Accessibility'], ['best-practices', 'Best practices'], ['seo', 'SEO'], ['agentic-browsing', 'Agentic browsing']];
const lhDevice = (l) => l.device ?? D.options.device; // older reports ran one device and stored it in options
const lhDevices = ['mobile', 'desktop'].filter((d) => D.lighthouse.some((l) => lhDevice(l) === d));
const lh = D.lighthouse.filter((l) => l.scores);
const lhOf = (d) => lh.filter((l) => lhDevice(l) === d);
const avg = (k, list) => (list.length ? Math.round(list.reduce((s, l) => s + (l.scores[k] ?? 0), 0) / list.length) : null);
const failingAudits = (list) => {
  const agg = {};
  for (const l of list) for (const f of l.failing) (agg[f.id] ||= { ...f, pages: 0 }).pages++;
  return Object.values(agg).sort((a, b) => b.pages - a.pages);
};

const waveErr = D.wave.results.reduce((s, w) => s + (w.categories?.error?.count || 0) + (w.categories?.contrast?.count || 0), 0);
const dur = Math.round((new Date(D.finished) - new Date(D.started)) / 1000);
document.getElementById('sub').innerHTML = (D.partial ? '<span class="pill warning">Partial report: run stopped with Ctrl+C</span> ' : '') + link(D.target) + ' · ' + new Date(D.started).toLocaleString() + ' · ' + Math.floor(dur / 60) + 'm ' + (dur % 60) + 's · ' + pages.length + ' pages audited';

// ---- sections ----
const S = {};

// Plain-language names for the structure/SEO checks in audit.mjs: id -> [title, why it matters].
const ISSUE = {
  'title-missing': ['Page has no title', 'The title is the clickable headline in Google results and the text in the browser tab.'],
  'title-length': ['Page title too short or too long', 'Aim for 15–65 characters so Google shows it in full.'],
  'meta-description-missing': ['No meta description', 'Google often uses it as the summary under your link in search results.'],
  'meta-description-length': ['Meta description too short or too long', 'Aim for 50–160 characters so it is not cut off in search results.'],
  'html-lang-missing': ['Page language not set', 'Screen readers need it to pronounce the text correctly.'],
  'viewport-missing': ['Not set up for mobile', 'Without a viewport tag the page shows zoomed out on phones.'],
  'viewport-blocks-zoom': ['Zoom is disabled', 'People with low vision cannot pinch to zoom.'],
  'h1-missing': ['No main heading (H1)', 'Each page should have one H1 that says what the page is about.'],
  'h1-multiple': ['More than one main heading (H1)', 'Use one H1 per page and H2–H6 for sections.'],
  'heading-skip': ['Heading levels skipped', 'For example an H2 followed by an H4. Screen reader users navigate by headings.'],
  'canonical-missing': ['No canonical URL', 'Tells Google which address is the original when a page is reachable at several.'],
  'noindex': ['Hidden from search engines', 'A "noindex" tag stops Google listing the page. Check this is intended.'],
  'open-graph-incomplete': ['Incomplete social sharing preview', 'Links shared on Facebook, WhatsApp or LinkedIn show without a proper title or image.'],
  'landmark-main-missing': ['No main content region', 'A <main> region lets keyboard and screen reader users jump straight to the content.'],
  'skip-link-missing': ['No "Skip to content" link', 'Keyboard users must tab through the whole menu on every page.'],
  'img-alt-missing': ['Images without alt text', 'Screen readers cannot describe these images.'],
  'generic-link-text': ['Vague link text', 'Links like "read more" or "click here" make no sense on their own.'],
  'new-tab-no-warning': ['Links open a new tab without warning', 'Unexpected new tabs disorient screen reader and keyboard users.'],
  'duplicate-id': ['Duplicate element IDs', 'Can break form labels and assistive technology.'],
  'tabindex-positive': ['Custom keyboard tab order', 'Makes keyboard navigation jump around the page unpredictably.'],
  'autoplay-media': ['Media plays automatically', 'Autoplaying audio or video distracts and can drown out screen readers.'],
  'reflow-320': ['Sideways scrolling on small screens', 'Content must fit a 320px-wide screen without horizontal scrolling (WCAG 1.4.10).'],
  'img-no-dimensions': ['Images without width and height', 'The layout jumps while the page loads (Cumulative Layout Shift).'],
  'thin-content': ['Very little text', 'Pages with under 150 words rarely rank well in search.'],
  'structured-data-missing': ['No structured data', 'Schema.org data helps Google show rich results such as opening hours and reviews.'],
  'json-ld-invalid': ['Invalid structured data (JSON-LD)', 'A JSON-LD block has a syntax error, so search engines ignore all of it.'],
  'dom-size': ['Very large page', 'Over 1,500 elements slows the page down, especially on phones.'],
};
const issueTitle = (id) => ISSUE[id]?.[0] || id;
const SECURITY = {
  'strict-transport-security': ['HTTPS enforcement (HSTS)', 'Makes browsers always use the secure version of the site.'],
  'content-security-policy': ['Content Security Policy', 'Limits which scripts can run, reducing the risk of malicious code injection.'],
  'x-content-type-options': ['File type protection', 'Stops browsers guessing file types, which attackers can abuse.'],
  'x-frame-options': ['Clickjacking protection', 'Stops other websites showing your pages inside a frame to trick visitors.'],
  'referrer-policy': ['Referrer policy', 'Controls how much of your page address is shared with other websites.'],
  'permissions-policy': ['Permissions policy', 'Restricts access to the camera, microphone, location and similar features.'],
};
const lead = (html) => '<p class="lead">' + html + '</p>';
const hint = (html) => '<p class="hint">' + html + '</p>';
const goto = (tab, label) => '<button type="button" class="goto" data-goto="' + esc(tab) + '">' + esc(label) + ' →</button>';
const cap = (s) => s[0].toUpperCase() + s.slice(1);
const missingHeaders = Object.entries(D.site.security).filter(([, v]) => !v).map(([k]) => SECURITY[k]?.[0] || k);
const mixedPages = pages.filter((p) => p.mixedContent?.length).length;
const brokenInternal = D.links.broken.filter((b) => b.internal).length;
const htmlErrorPages = pages.filter((p) => p.htmlValidation?.errors).length;
const VERDICT = { good: ['ok', 'Good'], fair: ['moderate', 'Needs work'], poor: ['critical', 'Poor'] };
const fromScore = (s) => (s == null ? null : s >= 90 ? 'good' : s >= 50 ? 'fair' : 'poor');
const health = (title, verdict, text, tab) => '<div class="card health"><div class="h-top"><span class="h-title">' + esc(title) + '</span>' +
  (verdict ? pill(VERDICT[verdict][0], VERDICT[verdict][1]) : pill('minor', 'Not checked')) + '</div><p>' + text + '</p>' + (tab ? goto(tab, 'Details') : '') + '</div>';
const lhCard = ([k, l]) => '<div class="card"><div class="t">' + esc(l) + '</div><div class="pair">' +
  lhDevices.map((d) => '<span><small>' + cap(d) + '</small>' + score(avg(k, lhOf(d))) + '</span>').join('') + '</div></div>';

// Everything worth fixing, across all checks, most urgent first.
const RANK = [['critical', 'Urgent'], ['serious', 'High'], ['moderate', 'Medium'], ['minor', 'Low']];
const fixes = [];
const fix = (rank, title, detail, tab) => fixes.push({ rank, title, detail, tab });
for (const r of axeList) fix({ critical: 0, serious: 1, moderate: 2 }[r.impact] ?? 3, r.help, r.nodes + ' elements on ' + r.pages.length + ' of ' + okPages.length + ' pages', 'Accessibility');
if (brokenInternal) fix(0, 'Broken pages or links on your own site', brokenInternal + ' broken', 'Links');
if (D.links.broken.length > brokenInternal) fix(2, 'Broken links to other websites', (D.links.broken.length - brokenInternal) + ' broken', 'Links');
if (!D.site.httpsRedirect) fix(0, 'HTTP does not redirect to HTTPS', 'Visitors can end up on the insecure version of the site', null);
if (mixedPages) fix(1, 'Insecure (HTTP) files on secure pages', 'on ' + mixedPages + ' pages', 'Pages');
for (const r of structList) fix({ error: 0, warning: 2 }[r.severity] ?? 3, issueTitle(r.id), 'on ' + r.pages.length + ' of ' + pages.length + ' pages', 'SEO & Structure');
for (const d of lhDevices) { const s = avg('performance', lhOf(d)); if (s != null && s < 90) fix(s < 50 ? 1 : 2, 'Slow on ' + d, 'Lighthouse speed score ' + s + ' out of 100', 'Lighthouse'); }
if (htmlErrors) fix(3, 'HTML code errors', htmlErrors + ' errors on ' + htmlErrorPages + ' pages', 'HTML');
if (missingHeaders.length) fix(2, 'Security headers missing', missingHeaders.join(', '), null);
fixes.sort((a, b) => a.rank - b.rank);

S.Overview = () => {
  const total = IMPACTS.reduce((s, i) => s + impactNodes[i], 0);
  const perf = lhDevices.map((d) => avg('performance', lhOf(d)));
  const seoPages = pages.filter((p) => p.issues?.some((i) => i.severity !== 'notice')).length;
  const seoTop = structList.filter((r) => r.severity !== 'notice').slice(0, 2).map((r) => issueTitle(r.id).toLowerCase() + ' (' + r.pages.length + ' pages)');
  const perTab = {}; // at most 3 per area, so one noisy area doesn't hide the rest
  const shown = fixes.filter((f) => (perTab[f.tab] = (perTab[f.tab] || 0) + 1) <= 3).slice(0, 8);
  return lead('Automated check of <b>' + pages.length + ' pages</b> for accessibility, speed, search (SEO), broken links, security and code quality. Start with <b>Fix first</b>, then use the tabs above for page-by-page detail.') +
    '<h2>Site health</h2><div class="cards health-grid">' +
    health('Accessibility', !okPages.length ? null : impactNodes.critical || pagesWithBlocking > okPages.length / 2 ? 'poor' : total ? 'fair' : 'good',
      !axeList.length ? 'No automated accessibility problems found.' : '<b>' + pagesWithBlocking + ' of ' + okPages.length + ' pages</b> have problems that can stop disabled visitors using them (critical or serious). ' + total + ' problems in total.', 'Accessibility') +
    health('Speed', fromScore(perf.length ? Math.min(...perf.filter((s) => s != null)) : null),
      lh.length ? 'Lighthouse speed score ' + lhDevices.map((d, i) => cap(d) + ' <b>' + perf[i] + '</b>').join(' · ') + ' out of 100. Google ranks on mobile speed.' : 'Lighthouse was not run.', lh.length ? 'Lighthouse' : null) +
    health('Search (SEO) & structure', structList.some((r) => r.severity === 'error') ? 'poor' : seoPages ? 'fair' : 'good',
      seoPages ? '<b>' + seoPages + ' of ' + pages.length + ' pages</b> need attention, for example ' + esc(seoTop.join(' and ')) + '.' : 'No search-engine problems found.', 'SEO & Structure') +
    health('Links', brokenInternal ? 'poor' : D.links.broken.length ? 'fair' : 'good',
      D.links.broken.length ? '<b>' + D.links.broken.length + ' broken</b>: ' + brokenInternal + ' on your own site, ' + (D.links.broken.length - brokenInternal) + ' to other websites. ' + D.links.checked + ' links checked.' : 'All ' + D.links.checked + ' links work.', 'Links') +
    health('Security', !D.site.httpsRedirect || mixedPages ? 'poor' : missingHeaders.length ? 'fair' : 'good',
      (D.site.httpsRedirect ? 'HTTPS is enforced. ' : '<b>HTTP does not redirect to HTTPS.</b> ') + (mixedPages ? '<b>' + mixedPages + ' pages</b> load insecure files. ' : '') +
      (missingHeaders.length ? '<b>' + missingHeaders.length + ' of ' + Object.keys(D.site.security).length + '</b> recommended security headers missing (see Site-wide checks below).' : 'All recommended security headers set.'), null) +
    health('Code quality', htmlErrors ? 'fair' : 'good',
      htmlErrors ? '<b>' + htmlErrors + ' HTML errors</b> on ' + htmlErrorPages + ' pages. Browsers usually cope, but errors can confuse screen readers.' : 'No HTML errors found.', 'HTML') +
    '</div>' +
    '<h2>Fix first</h2>' + hint('The most important problems across all checks, most urgent first.') +
    (shown.length ? '<div class="panel">' + shown.map((f) => '<div class="fix">' + pill(RANK[f.rank][0], RANK[f.rank][1]) + '<div class="grow"><strong>' + esc(f.title) + '</strong><div class="muted">' + esc(f.detail) + '</div></div>' + (f.tab ? goto(f.tab, 'View') : '') + '</div>').join('') + '</div>' +
      (fixes.length > shown.length ? '<p class="muted">+ ' + (fixes.length - shown.length) + ' more items in the tabs above.</p>' : '')
      : '<div class="panel" style="padding:16px">Nothing to fix 🎉</div>') +
    (lh.length ? '<h2>Lighthouse scores</h2>' + hint('Google Lighthouse, averaged across audited pages. 90–100 good · 50–89 needs work · 0–49 poor.') + '<div class="cards">' + LH_CATS.map(lhCard).join('') + '</div>' : '') +
    '<h2>Accessibility problems by severity</h2>' + hint('Critical and serious problems can stop disabled visitors using a page. Moderate and minor ones make it harder.') +
    '<div class="panel" style="padding:16px">' + IMPACTS.map((i) => pill(i, cap(i) + ': ' + impactNodes[i])).join(' ') +
    '<div class="bar">' + IMPACTS.map((i) => '<span style="width:' + (impactNodes[i] / (total || 1) * 100) + '%;background:var(--' + i + ')"></span>').join('') + '</div></div>' +
    '<h2>Site-wide checks</h2>' +
    table(['Check', 'Result', 'What it means'], [
      ['Search engine instructions (robots.txt)', D.discovery.robots.found ? pill('ok', 'Found') : pill('warning', 'Missing'), 'Tells search engines which parts of the site to crawl.'],
      ['XML sitemap', D.discovery.sitemaps.length ? pill('ok', D.discovery.sitemapUrlCount + ' pages listed') : pill('warning', 'Not found'), 'Lists your pages so search engines can find them all.'],
      ['HTTP redirects to HTTPS', D.site.httpsRedirect ? pill('ok', 'Yes') : pill('error', 'No'), 'Every visitor gets the secure version of the site.'],
      ['Missing pages return "not found"', D.site.soft404 ? pill('error', 'No (returns 200)') : pill('ok', 'Yes (' + D.site.notFoundStatus + ')'), 'Stops search engines indexing error pages as real content.'],
      ...Object.entries(D.site.security).map(([k, v]) => [esc(SECURITY[k]?.[0] || k) + '<br><code class="muted">' + esc(k) + '</code>', v ? pill('ok', 'Set') : pill('warning', 'Missing'), esc(SECURITY[k]?.[1] || '')]),
      ['Insecure files on secure pages', mixedPages ? pill('error', mixedPages + ' pages') : pill('ok', 'None'), 'HTTP images or scripts on HTTPS pages trigger browser warnings.'],
      ['JavaScript errors', pages.some((p) => p.consoleErrors?.length) ? pill('warning', pages.filter((p) => p.consoleErrors?.length).length + ' pages') : pill('ok', 'None'), 'Script errors can break menus, forms and booking flows.'],
    ]) +
    '<h2>Checks a person still needs to do</h2>' + hint('Automated tools catch only part of accessibility problems. These need a quick manual pass.') +
    '<div class="panel" style="padding:8px 16px"><ul class="plain">' +
    ['Use the site with the keyboard only: every link and button reachable, focus always visible, never stuck', 'Try key journeys (booking, contact forms) with a screen reader such as VoiceOver or NVDA', 'Check image descriptions make sense (tools only spot missing ones)', 'Videos have captions; audio has a transcript', 'Form errors are clear and announced to screen readers', 'Text stays readable at 200% zoom', 'Animations respect the "reduce motion" setting', okPages.reduce((s, p) => s + p.axe.incomplete.length, 0) + ' items flagged "needs a manual check" (see the Pages tab)']
      .map((x) => '<li>' + esc(x) + '</li>').join('') + '</ul></div>';
};
const card = (v, l) => '<div class="card"><div class="v">' + v + '</div><div class="l">' + esc(l) + '</div></div>';

S.Accessibility = () => lead('Automated check against <b>WCAG 2.2 level AA</b>, the accessibility standard most regulations refer to (tool: axe-core). Each row is one problem; open it to see the affected pages, the exact elements and how to fix it. <b>Critical / serious</b> can stop disabled visitors using a page; <b>moderate / minor</b> make it harder.') +
  '<h2>Problems found (' + axeList.length + ')</h2><div class="panel">' +
  (axeList.length ? axeList.map((r) => '<details><summary>' + pill(r.impact) + '<strong class="grow">' + esc(r.help) + '</strong><code class="muted">' + esc(r.id) + '</code><span class="muted">' + r.pages.length + ' pages · ' + r.nodes + ' elements</span></summary><div class="det">' +
    '<p>' + esc(r.description) + ' ' + link(r.helpUrl, 'How to fix ↗') + '</p><p class="muted">' + r.wcag.map(esc).join(' · ') + '</p>' +
    r.pages.slice(0, 50).map((p) => '<details><summary><span class="url grow">' + esc(p.url) + '</span><span class="muted">' + p.count + ' elements</span></summary><div class="det">' +
      p.nodes.map((n) => '<p><code>' + esc(n.target) + '</code></p><pre>' + esc(n.html) + '</pre><pre class="muted">' + esc(n.summary) + '</pre>').join('') + '</div></details>').join('') +
    (r.pages.length > 50 ? '<p class="muted">…and ' + (r.pages.length - 50) + ' more pages (see report.json)</p>' : '') +
    '</div></details>').join('') : '<p style="padding:14px">No axe violations found 🎉</p>') + '</div>' +
  (D.wave.enabled ? waveSection() : '<h2>WAVE (second opinion)</h2>' + hint('WAVE by WebAIM is a second accessibility checker. It was not run because it needs an API key (<code>--wave-key</code>). Each page in the Pages tab links to its free WAVE report instead.'));

const waveSection = () => '<h2>WAVE (WebAIM)</h2>' + table(['Page', 'Errors', 'Contrast', 'Alerts', 'Features', 'ARIA', 'Top errors'], D.wave.results.map((w) => w.error
  ? ['<span class="url">' + esc(w.url) + '</span>', pill('error', w.error), '', '', '', '', '']
  : ['<span class="url">' + link(w.waveUrl || w.url, w.url) + '</span>', w.categories.error?.count ?? 0, w.categories.contrast?.count ?? 0, w.categories.alert?.count ?? 0, w.categories.feature?.count ?? 0, w.categories.aria?.count ?? 0,
    [...(w.categories.error?.items || []), ...(w.categories.contrast?.items || [])].map((i) => esc(i.description) + ' ×' + i.count).join('<br>')]), [1, 2, 3, 4, 5]);

S.Pages = () => lead('Every audited page with its accessibility problem counts, load time and size. Open a page for its full detail: search fields, heading outline, accessibility problems and HTML errors.') +
  '<h2>All audited pages (' + pages.length + ')</h2><input type="search" id="pq" placeholder="Filter by URL…" aria-label="Filter pages by URL"><div class="panel" id="plist">' +
  pages.map((p) => {
    const c = Object.fromEntries(IMPACTS.map((i) => [i, 0]));
    (p.axe?.violations || []).forEach((v) => (c[v.impact] += v.count));
    const s = p.structure || {};
    return '<details data-url="' + esc(p.url) + '"><summary><span class="url grow">' + esc(p.url) + '</span>' +
      (p.error ? pill('error', 'audit failed') : IMPACTS.filter((i) => c[i]).map((i) => pill(i, c[i] + ' ' + i)).join(' ') || pill('ok', 'no accessibility problems')) +
      '<span class="muted">' + (p.loadMs != null ? (p.loadMs / 1000).toFixed(1) + ' s load' : '–') + ' · ' + (s.perf?.transferKB ?? '–') + ' KB</span></summary><div class="det">' + pageDetail(p) + '</div></details>';
  }).join('') + '</div>';

function pageDetail(p) {
  if (p.error) return '<p>' + pill('error', p.error) + '</p>';
  const s = p.structure;
  return '<p>' + link(p.url, 'Open page') + ' · ' + waveLink(p.url) + D.lighthouse.filter((l) => l.url === p.url && l.file).map((l) => ' · ' + link('lighthouse/' + l.file, 'Lighthouse ' + lhDevice(l))).join('') + ' · ' + (p.inSitemap ? 'in sitemap' : pill('notice', 'not in sitemap')) + '</p>' +
    '<div class="two"><div><h3>Document</h3>' + table(['Field', 'Value'], [
      ['Title', esc(s.title) + ' <span class="muted">(' + s.titleLength + ')</span>'], ['Meta description', esc(s.metaDescription || '—')],
      ['Language', esc(s.lang ?? '—')], ['Canonical', esc(s.canonical ?? '—')], ['Robots meta', esc(s.robotsMeta ?? '—')],
      ['Social sharing (Open Graph)', esc(Object.entries(s.og).filter(([, v]) => v).map(([k]) => k).join(', ') || '—')], ['Structured data (JSON-LD)', esc(s.jsonLdTypes.join(', ') || '—')],
      ['Page regions (landmarks)', Object.entries(s.landmarks).map(([k, v]) => pill(v ? 'ok' : 'warning', k)).join(' ')],
      ['Images', s.images + ' (' + s.imagesMissingAlt + ' no alt, ' + s.imagesEmptyAlt + ' decorative)'], ['Words / page elements', s.wordCount + ' / ' + s.domNodes],
      ['Server response / ready / fully loaded', s.perf.ttfb + ' / ' + s.perf.domContentLoaded + ' / ' + s.perf.load + ' ms'], ['Files / download size', s.perf.requests + ' / ' + s.perf.transferKB + ' KB'],
    ]) + '</div><div><h3>Heading outline</h3><div class="panel" style="padding:8px 12px;max-height:340px;overflow:auto">' +
    (s.headings.map((h) => '<div style="padding-left:' + (h.level - 1) * 14 + 'px"><code class="muted">h' + h.level + '</code> ' + esc(h.text) + '</div>').join('') || '<span class="muted">No headings</span>') + '</div></div></div>' +
    '<h3>Search (SEO) & structure</h3>' + table(['Severity', 'Issue'], (p.issues || []).map((i) => [pill(i.severity), '<strong>' + esc(issueTitle(i.id)) + '</strong> <span class="muted">· ' + esc(i.msg) + '</span>'])) +
    '<h3>Accessibility problems</h3>' + table(['Impact', 'Rule', 'Elements'], p.axe.violations.map((v) => [pill(v.impact), esc(v.help) + ' ' + link(v.helpUrl, '↗') + '<br>' + v.nodes.slice(0, 3).map((n) => '<code class="muted">' + esc(n.target) + '</code>').join('<br>'), v.count]), [2]) +
    '<h3>Accessibility: needs a manual check</h3>' + table(['Impact', 'Rule', 'Elements'], p.axe.incomplete.map((v) => [pill(v.impact || 'minor'), esc(v.help) + ' ' + link(v.helpUrl, '↗'), v.count]), [2]) +
    '<h3>HTML errors</h3>' + table(['Severity', 'Rule', 'Line', 'Message'], p.htmlValidation.messages.map((m) => [pill(m.severity), link('https://html-validate.org/rules/' + m.rule + '.html', m.rule), m.line, esc(m.message)])) +
    (p.consoleErrors.length ? '<h3>JavaScript errors</h3>' + p.consoleErrors.map((e) => '<pre>' + esc(e) + '</pre>').join('') : '') +
    (p.failedRequests.length ? '<h3>Failed requests</h3>' + table(['Status', 'URL'], p.failedRequests.map((r) => [esc(r.status || r.error), '<span class="url">' + esc(r.url) + '</span>'])) : '') +
    (p.mixedContent.length ? '<h3>Insecure (HTTP) files</h3>' + p.mixedContent.map((u) => '<pre>' + esc(u) + '</pre>').join('') : '');
}

S.Lighthouse = () => !D.lighthouse.length ? '<p class="muted">Lighthouse not run (use <code>--lighthouse N</code>).</p>' :
  lead('Google Lighthouse lab test of each page, on a simulated mid-range phone (<b>Mobile</b>) and a <b>Desktop</b>. Scores are out of 100: <b>90+</b> good, <b>50–89</b> needs work, <b>under 50</b> poor. <b>LCP</b> is how long until the main content shows (aim under 2.5 s), <b>TBT</b> how long scripts freeze the page (aim under 200 ms), <b>CLS</b> how much the layout jumps (aim under 0.1).') +
  '<div class="seg" role="tablist" aria-label="Form factor">' + lhDevices.map((d, i) => '<button type="button" role="tab" data-device="' + d + '" aria-selected="' + (i === 0) + '">' + DEVICE_ICON[d] + d[0].toUpperCase() + d.slice(1) + '</button>').join('') + '</div>' +
  lhDevices.map((d, i) => '<div data-device-panel="' + d + '"' + (i ? ' hidden' : '') + '>' + lhPanel(d) + '</div>').join('');
const DEVICE_ICON = {
  mobile: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="6" y="2" width="12" height="20" rx="2"/><path d="M11 18h2"/></svg>',
  desktop: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="4" width="18" height="12" rx="1"/><path d="M1 20h22"/></svg>',
};
const lhPanel = (d) => '<div class="cards">' + LH_CATS.map(([k, l]) => card(score(avg(k, lhOf(d))), l + ' (avg)')).join('') + '</div>' +
  '<h2>Scores per page (' + d + ', ' + lhOf(d).length + ' pages)</h2>' +
  table(['Page', 'Performance', 'Accessibility', 'Best practices', 'SEO', 'Agentic', 'LCP', 'TBT', 'CLS', 'Report'], D.lighthouse.filter((l) => lhDevice(l) === d).map((l) => l.scores
    ? ['<span class="url">' + esc(l.url) + '</span>' + (l.runtimeError ? '<br>' + pill('error', l.runtimeError) : ''), score(l.scores.performance), score(l.scores.accessibility), score(l.scores['best-practices']), score(l.scores.seo), score(l.scores['agentic-browsing']), esc(l.metrics.LCP), esc(l.metrics.TBT), esc(l.metrics.CLS), link('lighthouse/' + l.file, 'open')]
    : ['<span class="url">' + esc(l.url) + '</span>', pill('error', l.error), '', '', '', '', '', '', '', '']), [1, 2, 3, 4, 5]) +
  '<h2>Most common problems</h2>' + hint('Lighthouse checks that scored below 90, by number of pages affected.') + table(['Problem', 'Category', 'Pages', 'Example'], failingAudits(lhOf(d)).slice(0, 40).map((f) => [esc(f.title) + '<br><code class="muted">' + esc(f.id) + '</code>', esc(Object.fromEntries(LH_CATS)[f.category] || f.category), f.pages, esc(f.displayValue)]), [2]);

S.Screenshots = () => !D.screenshots?.pages.length ? '<p class="muted">Screenshots not taken (use <code>--screenshots N</code>).</p>' :
  lead('Each page captured at ' + D.screenshots.screens.map((s) => '<b>' + s.label + '</b> ' + s.width + '×' + s.height).join(' · ') + '. Open a page to compare the sizes side by side and scroll inside a screen to see the rest of it. Switch to <b>Live</b> to use the real site in each frame.') +
  '<h2>Pages (' + D.screenshots.pages.length + ')</h2>' +
  '<input type="search" placeholder="Filter by URL…" aria-label="Filter screenshots by URL"><div class="panel">' +
  D.screenshots.pages.map((p, i) => {
    const errs = p.shots.filter((s) => s.error).length;
    return '<details data-url="' + esc(p.url) + '" data-shot="' + i + '"><summary><span class="url grow">' + esc(p.url) + '</span>' + (errs ? pill('error', errs + ' failed') : '') + '</summary><div class="det"></div></details>';
  }).join('') + '</div>';
// Why the browser would refuse to show this page in an iframe, from the headers captured at audit time.
const framingBlocked = (url) => {
  const h = pages.find((p) => p.url === url)?.headers || {};
  const xfo = h['x-frame-options'];
  const ancestors = h['content-security-policy']?.match(/frame-ancestors([^;]*)/i)?.[1].trim();
  if (xfo && /deny|sameorigin/i.test(xfo)) return 'X-Frame-Options: ' + xfo;
  if (ancestors != null && !ancestors.split(' ').includes('*')) return 'Content-Security-Policy frame-ancestors ' + (ancestors || "'none'");
  return null;
};
const shotView = (i, live) => {
  const p = D.screenshots.pages[i];
  const blocked = framingBlocked(p.url);
  const tab = (view, label, on, off) => '<button type="button" role="tab" data-view="' + view + '" aria-selected="' + on + '"' + (off ? ' disabled' : '') + '>' + label + '</button>';
  return '<div class="seg" role="tablist" aria-label="View">' + tab('shot', 'Screenshot', !live) + tab('live', 'Live', live, blocked) + '</div>' +
    (blocked ? '<p class="muted center">Live view unavailable: this page sends <code>' + esc(blocked) + '</code>, so browsers refuse to show it in a frame.</p>'
      : live ? '<p class="muted center">Live: the site as it is now, not at audit time. Widths match each device; touch and mobile user-agent are not emulated.</p>' : '') +
    '<div class="frames">' + frames(p, live) + '</div>';
};
const frames = (p, live) => D.screenshots.screens.map((s) => {
  const shot = p.shots.find((x) => x.device === s.id) || { error: 'not captured' };
  const screen = live
    ? '<iframe src="' + esc(p.url) + '" title="' + esc(s.label + ' live view of ' + p.url) + '" data-w="' + s.width + '" style="width:' + s.width + 'px;height:' + s.height + 'px"></iframe>'
    : shot.file ? '<img src="screenshots/' + esc(shot.file) + '" alt="' + esc(s.label + ' view of ' + p.url) + '" loading="lazy">' : '<p>' + esc(shot.error) + '</p>';
  return '<figure class="frame ' + s.id + '"><div class="device"><div class="screen' + (live ? ' live' : '') + '" style="aspect-ratio:' + s.width + '/' + s.height + '">' + screen +
    '</div></div><div class="base"></div><figcaption>' + esc(s.label) + ' · ' + s.width + '×' + s.height +
    (!live && shot.truncated ? ' · first ' + D.screenshots.maxHeight + 'px of ' + shot.height : '') +
    (!live && shot.file ? ' · ' + link('screenshots/' + shot.file, 'full image') : '') + '</figcaption></figure>';
}).join('');
// live iframes render at the real device width, scaled down to fit the frame's screen
const fitFrames = (root) => { for (const f of root.querySelectorAll('.screen iframe')) f.style.transform = 'scale(' + f.parentElement.clientWidth / f.dataset.w + ')'; };
addEventListener('resize', () => fitFrames(document));

S['SEO & Structure'] = () => lead('How search engines and assistive technology read each page: titles, descriptions, headings, page regions and sharing previews. <b>Error</b> fix now · <b>Warning</b> should fix · <b>Notice</b> nice to have.') +
  '<h2>Findings (' + structList.length + ')</h2><div class="panel">' +
  structList.map((r) => '<details><summary>' + pill(r.severity) + '<strong class="grow">' + esc(issueTitle(r.id)) + '</strong><span class="muted">' + r.pages.length + ' pages</span></summary><div class="det">' +
    '<p>' + esc(ISSUE[r.id]?.[1] || '') + ' <code class="muted">' + esc(r.id) + '</code></p>' + table(['Page', 'Detail'], r.pages.map((p) => ['<span class="url">' + esc(p.url) + '</span>', esc(p.msg)])) + '</div></details>').join('') + '</div>' +
  '<h2>Titles & descriptions</h2>' + hint('What Google shows for each page in search results.') + table(['Page', 'Page title', 'Meta description', 'H1s'], pages.filter((p) => p.structure).map((p) => ['<span class="url">' + esc(p.url) + '</span>', esc(p.structure.title) || pill('error', 'missing'), p.structure.metaDescription ? esc(p.structure.metaDescription) : pill('warning', 'missing'), p.structure.h1Count === 1 ? 1 : pill('warning', p.structure.h1Count)]), [3]) +
  dupes('Duplicate titles', (p) => p.structure?.title) + dupes('Duplicate meta descriptions', (p) => p.structure?.metaDescription);

function dupes(title, key) {
  const m = {};
  for (const p of pages) { const k = key(p); if (k) (m[k] ||= []).push(p.url); }
  const rows = Object.entries(m).filter(([, v]) => v.length > 1).map(([k, v]) => [esc(k), v.length, v.map((u) => '<div class="url">' + esc(u) + '</div>').join('')]);
  return '<h2>' + esc(title) + '</h2>' + hint('Each page should have its own, so search engines can tell them apart.') + table(['Text', 'Pages', 'Used on'], rows, [1]);
}

// ---- Schema (JSON-LD), same rules as the schema-preview DevTools panel ----
const NL = String.fromCharCode(10);
const ldLabel = (v) => (typeof v === 'string' ? v : Array.isArray(v) ? v.map(ldLabel).filter(Boolean).join(', ') : '');
// arrays and @graph become separate items; @graph nodes inherit the parent @context
const ldNodes = (v, label) => {
  if (Array.isArray(v)) return v.flatMap((x, i) => ldNodes(x, label + ' · item ' + (i + 1)));
  if (!v || typeof v !== 'object' || !Array.isArray(v['@graph'])) return [{ value: v, label }];
  const nodes = v['@graph'].map((n, i) => ({ value: n && typeof n === 'object' && v['@context'] && !n['@context'] ? { '@context': v['@context'], ...n } : n, label: label + ' · @graph ' + (i + 1) }));
  return v['@type'] ? [{ value: v, label }, ...nodes] : nodes;
};
const stable = (v) => (Array.isArray(v) ? '[' + v.map(stable).join(',') + ']'
  : v && typeof v === 'object' ? '{' + Object.keys(v).sort().map((k) => JSON.stringify(k) + ':' + stable(v[k])).join(',') + '}' : JSON.stringify(v));
// one entry per distinct schema item on the page; exact repeats are counted, not listed
const ldItems = (p) => {
  const seen = new Map();
  (p.structure?.jsonLdRaw || []).forEach((raw, s) => {
    let nodes;
    try { nodes = ldNodes(JSON.parse(raw), 'Script ' + (s + 1)); } catch (e) { nodes = [{ error: e.message, raw, label: 'Script ' + (s + 1) }]; }
    for (const n of nodes) {
      const key = n.error ? 'invalid:' + n.raw : stable(n.value);
      if (seen.has(key)) seen.get(key).dupes++;
      else seen.set(key, { ...n, dupes: 0, text: n.error ? n.raw : JSON.stringify(n.value, null, 2) });
    }
  });
  return [...seen.values()];
};
const ldType = (it) => (it.error ? 'Unreadable block' : ldLabel(it.value?.['@type']) || '(no @type)');
// coloured JSON built from the parsed value (same text as JSON.stringify(v, null, 2), so Copy can use textContent)
const hl = (v, ind) => {
  const pad = '  '.repeat(ind);
  if (Array.isArray(v)) return v.length ? '[' + NL + v.map((x) => pad + '  ' + hl(x, ind + 1)).join(',' + NL) + NL + pad + ']' : '[]';
  if (v && typeof v === 'object') {
    const ks = Object.keys(v);
    return ks.length ? '{' + NL + ks.map((k) => pad + '  <span class="j-k">' + esc(JSON.stringify(k)) + '</span>: ' + hl(v[k], ind + 1)).join(',' + NL) + NL + pad + '}' : '{}';
  }
  return '<span class="' + (typeof v === 'string' ? 'j-s' : typeof v === 'number' ? 'j-n' : 'j-b') + '">' + esc(JSON.stringify(v)) + '</span>';
};
// navigator.clipboard only exists on https / localhost; plain-http hosts (e.g. a LAN IP) need the old execCommand path
const copyText = async (text) => {
  try { await navigator.clipboard.writeText(text); return true; } catch {}
  const ta = document.createElement('textarea');
  ta.value = text; ta.readOnly = true; ta.style.position = 'fixed'; ta.style.opacity = '0';
  document.body.appendChild(ta); ta.select();
  const ok = document.execCommand('copy');
  ta.remove();
  return ok;
};
const kb = (s) => (new Blob([s]).size / 1024).toFixed(1) + ' KB';

S.Schema = () => {
  if (!pages.some((p) => p.structure?.jsonLdRaw)) return lead('This report was made before schema capture was added. Run the audit again to see the JSON-LD of each page.');
  const withLd = pages.filter((p) => p.structure?.jsonLdRaw?.length).length;
  return lead('JSON-LD structured data (schema.org) tells search engines what a page is about, such as a pharmacy with its opening hours or a list of FAQs, so Google can show rich results. Open a page to see its schema items, then open an item to see its JSON. The test links check the live page with Google and schema.org.') +
    '<h2>Pages (' + withLd + ' of ' + pages.length + ' have JSON-LD)</h2><input type="search" placeholder="Filter by URL…" aria-label="Filter schema pages by URL"><div class="panel">' +
    pages.map((p, i) => {
      const items = ldItems(p);
      const types = [...new Set(items.filter((x) => !x.error).map(ldType))];
      const bad = items.filter((x) => x.error).length;
      return '<details data-url="' + esc(p.url) + '" data-ld="' + i + '"><summary><span class="url grow">' + esc(p.url) + '</span>' +
        (bad ? pill('error', bad + ' invalid') + ' ' : '') +
        (types.length ? types.slice(0, 4).map((t) => pill('notice', t)).join(' ') + (types.length > 4 ? ' <span class="muted">+' + (types.length - 4) + ' more</span>' : '') : bad ? '' : '<span class="muted">No schema</span>') +
        '</summary><div class="det"></div></details>';
    }).join('') + '</div>';
};
const ldPage = (p) => {
  const items = ldItems(p);
  const enc = encodeURIComponent(p.url);
  return '<p>' + link('https://search.google.com/test/rich-results?url=' + enc, 'Google Rich Results Test ↗') + ' · ' + link('https://validator.schema.org/#url=' + enc, 'Schema.org validator ↗') + '</p>' +
    (items.length ? '<div class="panel">' + items.map((it) => '<details class="ld"><summary>' + (it.error ? pill('error', 'invalid JSON') : '') +
      '<strong class="grow">' + esc(ldType(it)) + (typeof it.value?.name === 'string' ? ' <span class="muted">· ' + esc(it.value.name) + '</span>' : '') + '</strong>' +
      '<span class="muted">' + esc(it.label) + ' · ' + kb(it.text) + ' · ' + it.text.split(NL).length + (it.text.split(NL).length === 1 ? ' line' : ' lines') + (it.dupes ? ' · +' + it.dupes + ' duplicate' + (it.dupes > 1 ? 's' : '') : '') + '</span></summary><div class="det">' +
      (it.error ? '<p>' + pill('error', it.error) + '</p>' : '') +
      '<div class="code-bar"><button type="button" class="btn" data-ld-wrap aria-pressed="false">Wrap code</button><button type="button" class="btn" data-ld-copy>Copy JSON</button></div>' +
      '<pre class="json">' + (it.error ? esc(it.text) : hl(it.value, 0)) + '</pre></div></details>').join('') + '</div>'
      : '<p class="muted">No JSON-LD on this page.</p>');
};

S.HTML = () => lead('Checks the source code of each page against the HTML standard. Browsers usually cope with errors, but they can confuse screen readers and make pages look different between browsers. <b>Errors</b> are worth fixing; <b>warnings</b> are lower priority. Click a rule name for an explanation.') +
  '<h2>HTML code problems (' + htmlErrors + ' errors)</h2>' +
  table(['Rule', 'Severity', 'Pages', 'Times', 'Example'], htmlList.map((r) => [link('https://html-validate.org/rules/' + r.rule + '.html', r.rule), pill(r.severity), r.pages.size, r.count, esc(r.example)]), [2, 3]) +
  hint('Counts stop at 60 messages per page; report.json has the full per-page list.');

S.Links = () => lead('Every link on the audited pages was opened to check it still works. <b>404</b> means the page no longer exists; other codes or errors mean the site refused or failed to load.') +
  '<h2>Broken links (' + D.links.broken.length + ')</h2>' +
  table(['Link', 'Status', 'Where it goes', 'Found on'], D.links.broken.map((b) => ['<span class="url">' + esc(b.url) + '</span>', pill('error', b.status || b.error || 'error'), b.internal ? 'Your site' : 'Other website', b.foundOn.slice(0, 5).map((u) => '<div class="url muted">' + esc(u) + '</div>').join('')])) +
  hint(D.links.checked + ' links checked. Some sites (Facebook, LinkedIn, Instagram) block automated checks, so check 400, 403, 429 and 999 results by hand.');

S.Discovery = () => {
  const d = D.discovery;
  return lead('How the audit found the pages: from the sitemap, robots.txt and by following links from the homepage.') +
    '<div class="cards">' + card(d.fetched.length, 'Addresses visited') + card(d.htmlPages.length, 'Web pages audited') + card(d.sitemapUrlCount, 'Pages in sitemap') +
    card(d.notInSitemap.length, 'Pages missing from sitemap') + card(d.orphans.length, 'Orphan pages (nothing links to them)') + card(d.skipped.robots.length, 'Blocked by robots.txt') + '</div>' +
    (d.pendingNotCrawled ? '<p>' + pill('warning', 'Crawl hit --max-pages; ' + d.pendingNotCrawled + ' queued URLs not visited') + '</p>' : '') +
    '<h2>Sitemaps</h2>' + table(['Sitemap', 'Type', 'Entries'], d.sitemaps.map((s) => [link(s.url), s.type === 'index' ? 'Sitemap index' : 'Page list', s.entries]), [2]) +
    '<h2>robots.txt</h2><pre>' + esc(d.robots.raw || '(none)') + '</pre>' +
    list('Orphan pages', d.orphans, 'In the sitemap, but no page links to them, so visitors cannot find them.') + list('Pages not in sitemap', d.notInSitemap, 'Add these to the sitemap so search engines find them reliably.') + list('Blocked by robots.txt', d.skipped.robots, 'Not audited because robots.txt asks crawlers to stay out.') +
    '<h2>Every address visited</h2>' + table(['Address', 'Status', 'Found via', 'Redirects to', 'Links on page'], d.fetched.map((f) => ['<span class="url">' + esc(f.url) + '</span>', pill(f.status && f.status < 400 ? 'ok' : 'error', f.status || f.error || 'ERR'), esc({ start: 'Homepage', sitemap: 'Sitemap', crawl: 'Link on another page' }[f.source] || f.source), f.finalUrl !== f.url ? '<span class="url muted">' + esc(f.finalUrl) + '</span>' : '', f.outLinks]), [4]);
};
const list = (t, arr, why) => '<h2>' + esc(t) + ' (' + arr.length + ')</h2>' + hint(esc(why)) + (arr.length ? '<div class="panel" style="padding:8px 14px;max-height:300px;overflow:auto">' + arr.map((u) => '<div class="url">' + esc(u) + '</div>').join('') + '</div>' : '<p class="muted">None</p>');

// ---- tabs ----
const tabs = document.getElementById('tabs');
const main = document.getElementById('main');
const rendered = {};
function show(name) {
  for (const b of tabs.children) b.setAttribute('aria-selected', b.textContent === name);
  for (const s of main.children) s.hidden = s.dataset.tab !== name;
  if (!rendered[name]) {
    const sec = document.createElement('section');
    sec.dataset.tab = name;
    sec.innerHTML = S[name]();
    main.appendChild(sec);
    rendered[name] = true;
    sec.querySelector('input[type=search]')?.addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase();
      for (const d of sec.querySelectorAll('details[data-url]')) d.hidden = !d.dataset.url.toLowerCase().includes(q);
    });
    if (name === 'Screenshots') sec.addEventListener('toggle', (e) => { // toggle doesn't bubble, so capture
      const d = e.target;
      if (d.open && d.dataset.shot && !d.dataset.done) { d.dataset.done = 1; d.querySelector('.det').innerHTML = shotView(d.dataset.shot, false); }
    }, true);
    if (name === 'Schema') sec.addEventListener('toggle', (e) => {
      const d = e.target;
      if (d.open && d.dataset.ld && !d.dataset.done) { d.dataset.done = 1; d.querySelector('.det').innerHTML = ldPage(pages[d.dataset.ld]); }
    }, true);
    if (name === 'Schema') sec.addEventListener('click', (e) => {
      const wrap = e.target.closest('[data-ld-wrap]');
      const copy = e.target.closest('[data-ld-copy]');
      const pre = (wrap || copy)?.closest('.det').querySelector('pre.json');
      if (wrap) {
        const on = pre.classList.toggle('wrap');
        wrap.setAttribute('aria-pressed', on);
        wrap.textContent = on ? 'No wrap' : 'Wrap code';
      }
      if (copy) {
        copyText(pre.textContent).then((ok) => {
          if (!ok) getSelection().selectAllChildren(pre);
          copy.textContent = ok ? 'Copied ✓' : 'Selected, press Ctrl/Cmd+C';
          setTimeout(() => { copy.textContent = 'Copy JSON'; }, 2000);
        });
      }
    });
    if (name === 'Screenshots') sec.addEventListener('click', (e) => {
      const b = e.target.closest('[data-view]');
      if (!b || b.disabled || b.getAttribute('aria-selected') === 'true') return;
      const det = b.closest('.det');
      det.innerHTML = shotView(b.closest('details').dataset.shot, b.dataset.view === 'live');
      fitFrames(det);
    });
    if (name === 'Lighthouse') sec.addEventListener('click', (e) => {
      const b = e.target.closest('[data-device]');
      if (!b) return;
      for (const x of sec.querySelectorAll('[data-device]')) x.setAttribute('aria-selected', x === b);
      for (const p of sec.querySelectorAll('[data-device-panel]')) p.hidden = p.dataset.devicePanel !== b.dataset.device;
    });
  }
  try { localStorage.setItem('tab', name); } catch {}
}
for (const name of Object.keys(S)) {
  const b = document.createElement('button');
  b.type = 'button'; b.role = 'tab'; b.textContent = name;
  b.onclick = () => show(name);
  tabs.appendChild(b);
}
let saved; try { saved = localStorage.getItem('tab'); } catch {}
show(S[saved] ? saved : 'Overview');
document.addEventListener('click', (e) => {
  const g = e.target.closest('[data-goto]');
  if (g) { show(g.dataset.goto); scrollTo({ top: 0 }); }
});
document.getElementById('theme').onclick = () => {
  const dark = document.documentElement.dataset.theme ? document.documentElement.dataset.theme === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
  document.documentElement.dataset.theme = dark ? 'light' : 'dark';
};
</script>
</body>
</html>`;
}

/**
 * Every page file is checked before it reaches the build (CONTRIBUTING-PAGES.md): snippet lengths,
 * answer block, FAQ length and uniqueness, links, sources, simulator, banned phrases, hard-typed figures.
 * Some pages only:  PAGE_FILES=jobseeker-income-test,age-pension-rates npx vitest run tests/pages.test.ts
 * While other writers are still at work, links to planned pages are accepted with ALLOW_PLANNED=1.
 */
import { describe, it, expect } from 'vitest';
import { PAGES } from '../src/lib/pages';
import { HOME } from '../src/content/home';
import { helpers, SOURCES } from '../src/lib/helpers';
import { MINIS } from '../src/lib/mini-specs';
import { ROUTES } from '../src/i18n/routes';
import { PLANNED_IDS, PLANNED_PAGES } from '../src/lib/planned';
import P from '../src/data/params-2026.json';

const only = (process.env.PAGE_FILES ?? '').split(',').filter(Boolean);
const pages = only.length ? PAGES.filter((p) => only.includes(p.id)) : PAGES;
const words = (s: string) => s.replace(/<!--[\s\S]*?-->/g, ' ').replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
const BANNED = [/—/, /&mdash;/, /it[’']s important to note/i, /dive into/i, /whether you[’']re/i, /in today[’']s world/i, /\bMoreover\b/, /\bAdditionally\b/, /\bFurthermore\b/, /navigat(e|ing) the/i, /\bdelve\b/i, /taxineo/i, /\bINSEAD\b/, /\bMines\b/, /linkedin/i, /auspaycalculator|stampdutyaustralia|finalpayau|usfamilycalc|calculaides|myeicanada|canadanetpay|statutorypay/i];
const allQ = [...HOME.faqs.map((f) => f.q), ...PAGES.flatMap((p) => p.faqs.map((f) => f.q))];
const allTitles = [HOME.title, ...PAGES.map((p) => p.title)];
const allDesc = [HOME.description, ...PAGES.map((p) => p.description)];
const ids = new Set([...ROUTES.map((r) => r.id), ...(process.env.ALLOW_PLANNED ? PLANNED_IDS : [])]);
const h = helpers();

/** Figures of params-2026.json typed by hand in a page (RECETTE §17.4 point 7): a rate with cents written as text. */
const PARAM_FIGURES = new Set<string>();
(function walk(o: unknown) { if (typeof o === 'number' && !Number.isInteger(o) && o > 10) PARAM_FIGURES.add(o.toFixed(2)); else if (o && typeof o === 'object') for (const v of Object.values(o)) walk(v); })(P);

const snippet = (title: string, description: string) => {
  expect(title.length, title).toBeGreaterThanOrEqual(50); expect(title.length, title).toBeLessThanOrEqual(60);
  expect(description.length, description).toBeGreaterThanOrEqual(150); expect(description.length, description).toBeLessThanOrEqual(160);
  expect(title).toMatch(/2026|2027/); expect(description).toMatch(/2026|2027/);
  expect(title, 'key term first, never a tool word, a question or the country (RECETTE §11)').not.toMatch(/^(calculator|calculate|calculation|estimator|how|what|when|why|who|can|does|do|is|are|about|faq|methodology|australia|australian|aussie)\b/i);
  expect(title).not.toMatch(/ [:;!?]/);
  expect(allTitles.filter((t) => t === title).length, title).toBe(1);
  expect(allDesc.filter((t) => t === description).length, description).toBe(1);
};
const faqCheck = (faqs: Array<{ q: string; a: string }>, min: number, max: number) => {
  expect(faqs.length).toBeGreaterThanOrEqual(min); expect(faqs.length).toBeLessThanOrEqual(max);
  for (const f of faqs) {
    const n = words(f.a); expect(n, f.q).toBeGreaterThanOrEqual(42); expect(n, f.q).toBeLessThanOrEqual(88);
    expect(allQ.filter((q) => q === f.q).length, `question repeated on the site: ${f.q}`).toBe(1);
  }
};
const clean = (text: string) => {
  for (const b of BANNED) expect(text, String(b)).not.toMatch(b);
  expect(text).not.toMatch(/NaN|undefined|\[object|Infinity|null\b/);
};
const minis = (html: string) => { for (const m of html.matchAll(/<!--mini:([A-Za-z0-9_-]+)(?:\|([A-Za-z0-9+/=]+))?-->/g)) { expect(MINIS[m[1]], m[1]).toBeTruthy(); const arg = m[2] ? Buffer.from(m[2], 'base64').toString('utf8') : undefined; const spec = MINIS[m[1]](arg); const out = spec.run(Object.fromEntries(spec.inputs.map((i) => [i.id, i.def]))); expect(out.head[1], m[1]).not.toMatch(/NaN|undefined/); } };

describe('home', () => {
  it('snippets, answer block, FAQ, sections', () => {
    snippet(HOME.title, HOME.description);
    expect(words(HOME.resume)).toBeGreaterThanOrEqual(120);
    faqCheck(HOME.faqs, 6, 8);
    const secs = HOME.sections(h);
    expect(secs.length).toBeGreaterThanOrEqual(5);
    clean([HOME.resume, HOME.intro, HOME.matrixIntro(h), HOME.rulesIntro(h), ...HOME.rules(h), HOME.casesIntro(h), ...secs.map((s) => s.title + s.html), ...HOME.faqs.flatMap((f) => [f.q, f.a])].join(' '));
    for (const k of HOME.sources) expect(SOURCES[k], k).toBeTruthy();
  });
});

describe.each(pages.map((p) => [p.id, p] as const))('page %s', (_id, p) => {
  const plan = PLANNED_PAGES.find((x) => x.id === p.id);
  const html = p.body(h);
  it('matches the plan (id, slug, group, kind)', () => { expect(plan, 'id not in src/lib/planned.ts').toBeTruthy(); expect(p.slug).toBe(plan!.slug); expect(p.group).toBe(plan!.group); expect(p.kind).toBe(plan!.kind); });
  it('snippets (RECETTE §11)', () => { snippet(p.title, p.description); expect(p.slug).toMatch(/^[a-z-]+(\/[a-z-]+)?$/); });
  it('answer block of 120 words or more (RECETTE §21)', () => expect(words(p.resume)).toBeGreaterThanOrEqual(120));
  it('FAQ: unique, 42 to 88 words (RECETTE §7)', () => faqCheck(p.faqs, p.kind === 'pillar' ? 6 : 3, 8));
  it('links, sources, simulator', () => {
    for (const r of p.related) expect(ids.has(r), `related ${r}`).toBe(true);
    expect(p.related.length).toBeGreaterThanOrEqual(3);
    expect(p.sources.length).toBeGreaterThanOrEqual(p.kind === 'pillar' ? 3 : 2);
    for (const s of p.sources) expect(!!SOURCES[s], s).toBe(true);
    if (p.kind === 'pillar') expect(p.tool, 'a pillar has its calculator').toBeTruthy();
    if (p.kind === 'case') expect(p.preset, 'a household page has its preset').toBeTruthy();
    if (p.kind === 'guide') { expect(p.mini, 'a guide has a mini-simulator (RECETTE §9.3)').toBeTruthy(); expect(MINIS[p.mini!], p.mini).toBeTruthy(); const spec = MINIS[p.mini!](p.miniArg === undefined ? undefined : JSON.stringify(p.miniArg)); const out = spec.run(Object.fromEntries(spec.inputs.map((i) => [i.id, i.def]))); expect(out.head[1]).not.toMatch(/NaN|undefined/); }
    minis(html);
  });
  it('no banned phrase, no em dash', () => clean([p.title, p.description, p.h1, p.intro, p.resume, p.card, ...p.faqs.flatMap((f) => [f.q, f.a]), html].join(' ')));
  it('no figure of the parameter file typed by hand (RECETTE §17.4)', () => {
    // Pages are rendered here, so a computed figure looks like a typed one; the check runs on the source file.
    const src = require('fs').readFileSync(`src/content/pages/${p.id}.ts`, 'utf8') as string;
    const literal = src.replace(/\$\{[^}]*\}/g, '');
    for (const f of PARAM_FIGURES) { const [i, d] = f.split('.'); const shown = `${Number(i).toLocaleString('en-AU')}.${d}`; expect(literal.includes(shown) || literal.includes(f), `typed figure ${shown}`).toBe(false); }
  });
  it('body length (guides 900+ words of prose outside tables, pillars 400+, households 350+)', () => {
    const n = words(html.replace(/<table[\s\S]*?<\/table>/g, ''));
    expect(n).toBeGreaterThanOrEqual(p.kind === 'pillar' ? 400 : p.kind === 'case' ? 350 : 900);
  });
});

it('slugs are unique', () => { const s = PAGES.map((p) => p.slug); expect(new Set(s).size).toBe(s.length); });

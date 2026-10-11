/** llms.txt (RECETTE §21), generated at build from the page registry: always in sync with the site. */
import { PAGES } from '../lib/pages';
import { SITE_URL, LAST_UPDATED, SITE_NAMES } from '../data/site-config';
import { route } from '../i18n/routes';
import { GROUPS } from '../lib/topics';
export function GET() {
  const lines = [
    `# ${SITE_NAMES.en}`,
    '',
    `> One calculator for what an Australian household receives from Centrelink at the same time: Family Tax Benefit Part A and Part B, Child Care Subsidy, Commonwealth Rent Assistance and each adult's main payment (JobSeeker, Youth Allowance, Austudy, Parenting Payment, Age Pension, Carer Payment), plus Parental Leave Pay. Rates of 20 September 2026 and of the 2026-27 income year, read in the Social Security Guide, the Family Assistance Guide and the Paid Parental Leave Guide of the Department of Social Services, cited on each page. Calculations run in the browser. Estimates; Services Australia decides. Published by Radif Partners. Last updated ${LAST_UPDATED}.`,
    '',
    `- [Home: household calculator](${SITE_URL}${route('home', 'en')})`,
    ...GROUPS.flatMap((g) => { const xs = PAGES.filter((p) => p.group === g.id); return xs.length ? ['', `## ${g.label}`, ...xs.map((p) => `- [${p.nav}](${SITE_URL}${route(p.id, 'en')}): ${p.card}`)] : []; }),
    '',
    '## About',
    `- [How we calculate](${SITE_URL}${route('method', 'en')})`,
    `- [About](${SITE_URL}${route('about', 'en')})`,
  ];
  return new Response(lines.join('\n') + '\n', { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}

import { definePage } from '../../lib/page-types';
import { P, aud, audx, ssFortnight } from '../../lib/kit';

const x = (n: number) => audx(Math.round(n * 100) / 100);
const es: Array<[string, number]> = [
  ['Pensioner, single', P.pension.es_single_pa],
  ['Pensioner, member of a couple', P.pension.es_couple_each_pa],
  ['Parenting Payment single', P.pps.es_pa],
  ['JobSeeker, single, no children', P.benefit.jsp.es_single_pa],
  ['JobSeeker, single with children, or 55+ after 9 months', P.benefit.jsp.es_single_children_pa],
  ['JobSeeker or Parenting Payment partnered, each', P.benefit.jsp.es_partnered_pa],
  ['Youth Allowance, away from home (18+)', P.ya.es_pa.over18_away],
  ['Youth Allowance, at home (18+)', P.ya.es_pa.over18_home],
  ['Austudy, single, no children', P.ya.austudy.es_single_pa],
];

export default definePage({
  id: 'energy-and-pension-supplements',
  group: 'guides',
  kind: 'guide',
  order: 40,
  slug: 'energy-and-pension-supplements',
  nav: 'Energy and Pension Supplements',
  card: 'The two supplements built into most payments: amounts, who gets them, why they differ.',
  title: 'Energy Supplement 2026: Amounts, Pension Supplement, Rules',
  description: `Energy Supplement and Pension Supplement in 2026: ${audx(P.pension.es_single_pa)} and ${audx(P.pension.ps_single_pa)} a year for a single pensioner, the allowance rates, and why the first is never indexed.`,
  h1: 'The Energy Supplement and the Pension Supplement',
  intro: 'Two supplements are built into most Centrelink payments. What they are worth, who receives them and why one never changes.',
  resume: `Most Centrelink payments carry two built-in supplements. The Energy Supplement is ${audx(P.pension.es_single_pa)} a year for a single pensioner, ${x(ssFortnight(P.pension.es_single_pa))} a fortnight, and smaller amounts for allowances: ${audx(P.benefit.jsp.es_single_pa)} a year for a single JobSeeker recipient without children, for example. It started as the clean energy supplement in 2013, took its current name in 2014, has not been indexed since, and closed to new Family Tax Benefit families on 20 March 2017. The Pension Supplement is ${audx(P.pension.ps_single_pa)} a year for a single pensioner and ${audx(P.pension.ps_couple_each_pa)} for each member of a couple, from 20 September 2026; it replaced several older allowances in 2009 and is indexed twice a year. Both are already included in the full pension rates quoted by Centrelink, and the Energy Supplement is tax-free. For pensioners overseas they stop after 6 and 12 weeks respectively.`,
  mini: 'supplements',
  related: ['age-pension-rates', 'centrelink-payment-rates', 'centrelink-indexation-dates', 'jobseeker-payment-rates', 'family-tax-benefit-rates'],
  sources: ['ssg-es-rates', 'ssg-ps-rates', 'ssg-common-pension', 'fag-ftb-rates'],
  body: (h) => `
<h2>Energy Supplement amounts</h2>
${h.table(['Recipient', 'Per year', 'Per fortnight'], es.map(([l, v]) => [l, h.audx(v), x(ssFortnight(v))]), 'Social Security Guide 5.1.10.20. The Energy Supplement is not indexed.', ['l', 'r', 'r'])}
<p>The Energy Supplement is paid with the main payment each fortnight, or quarterly if you prefer, and for holders of the Commonwealth Seniors Health Card only quarterly. It is tax-exempt (${h.src('ssg-es-rates', 'Social Security Guide 5.1.10.20')}). Because the amounts are frozen, the supplement loses value every year; a pensioner today receives the same ${h.audx(P.pension.es_single_pa)} a year as when the freeze began.</p>
<h2>Who no longer gets it</h2>
<p>The Energy Supplement closed to new holders of the Commonwealth Seniors Health Card on 20 March 2017, and to people who became Family Tax Benefit recipients after 20 September 2016, from 20 March 2017. Families who were receiving it before then keep it under grandfathering rules as long as they remain continuously eligible. That is why two families with the same children and income can see slightly different Family Tax Benefit amounts: the older claimant may have a few dollars of Energy Supplement inside Part A and Part B. The calculators on this site leave it out, as for any family claiming today (${h.src('fag-ftb-rates', 'Family Assistance Guide 3.1.1.20')}).</p>
<h2>The Pension Supplement</h2>
${h.table(['', 'Single', 'Member of a couple'], [['Pension Supplement, per year', h.audx(P.pension.ps_single_pa), h.audx(P.pension.ps_couple_each_pa)], ['Per fortnight', x(ssFortnight(P.pension.ps_single_pa)), x(ssFortnight(P.pension.ps_couple_each_pa))], ['Parenting Payment single: basic amount only, per year', h.audx(P.pps.ps_basic_pa), '']], 'Social Security Guide 5.1.9.10, from 20 September 2026.', ['l', 'r', 'r'])}
<p>The Pension Supplement was introduced on 20 September 2009 and replaced the Pharmaceutical Allowance, Telephone Allowance and Utilities Allowance for most pensioners (${h.src('ssg-common-pension', 'Social Security Guide 5.1.8.10')}). Its daily rate is the annual amount divided by 364. A minimum part of it can be paid quarterly as a separate payment, and it is indexed on 20 March and 20 September. Parenting Payment single recipients below Age Pension age receive only the basic amount, ${h.audx(P.pps.ps_basic_pa)} a year, which is already in the ${h.audx(P.pps.max)} fortnightly rate.</p>
${h.box('Both are part of the full rate', `<p>When Centrelink quotes the full Age Pension of ${h.audx(P.pension.max_single)} a fortnight, both supplements are included. A part pensioner has all three parts reduced together by the income or assets test. Nothing extra needs to be claimed.</p>`)}
<h2>Why the supplements are shown separately</h2>
<p>Centrelink letters and the guides sometimes quote a payment with the supplements and sometimes without, which is a common source of confusion. Pension rates are usually quoted in full, supplements included. Allowance rates such as JobSeeker are usually quoted as the basic rate, with the Energy Supplement added on the payment summary. Family Tax Benefit amounts are quoted without the Energy Supplement for anyone who claimed after 2016, and without the end-of-year supplements, which are a different thing altogether despite the similar name. When comparing a figure from this site with a letter, check which parts each one includes.</p>
<p>The Family Tax Benefit Part A and Part B supplements, paid after the tax return, are not energy or pension supplements: they are part of the family payment, worth up to ${h.audx(P.ftb.a_supplement)} per child and ${h.audx(P.ftb.b_supplement)} per family. See ${h.a('ftb-end-of-year-supplement', 'the FTB supplements')} for how and when they are paid.</p>
<h2>Supplements and travel overseas</h2>
<p>A pensioner travelling overseas keeps the Energy Supplement for up to 6 weeks and the Pension Supplement for up to 12 weeks of temporary absence. Between 7 and 12 weeks, the pension is paid without the Energy Supplement; beyond 12 weeks, at the basic rate only. Pensioners who move overseas permanently are paid the basic rate, often proportional to their years of residence in Australia.</p>
<h2>Allowances and the supplement amounts</h2>
<p>Allowance recipients get the Energy Supplement but not the Pension Supplement, unless they are over Age Pension age. The amounts differ by situation, from ${h.audx(P.ya.es_pa.under18_home)} a year for a young person under 18 living at home to ${h.audx(P.pps.es_pa)} for a single principal carer. Like the main payment, the supplement is reduced when income reduces the payment, and it stops when the payment stops.</p>`,
  faqs: [
    { q: 'How much is the Energy Supplement for pensioners?', a: `${audx(P.pension.es_single_pa)} a year for a single pensioner, about ${x(ssFortnight(P.pension.es_single_pa))} a fortnight, and ${audx(P.pension.es_couple_each_pa)} a year for each member of a couple. The amounts are not indexed and are already included in the full pension rate. The supplement is tax-free and stops after 6 weeks of temporary absence overseas.` },
    { q: 'Why don’t I get the Energy Supplement with my Family Tax Benefit?', a: 'Because it closed to new Family Tax Benefit recipients. People who became recipients after 20 September 2016 stopped receiving it from 20 March 2017. Only families who were already receiving it, and who have stayed continuously eligible, keep it under the grandfathering rules, so most families claiming today never see it in their Family Tax Benefit.' },
    { q: 'Is the Pension Supplement taxable?', a: 'The Pension Supplement is part of the pension rate and is treated like the pension for tax purposes, while the Energy Supplement is tax-exempt. Most pensioners pay little or no tax because of the seniors and pensioners tax offset, but the taxable part of the pension appears on the annual payment summary.' },
  ],
});

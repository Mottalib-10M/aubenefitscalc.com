import { definePage } from '../../lib/page-types';
import type { Household } from '../../lib/engine/household';
import { P, aud, household, ftbA, ftbACutoffs, ccsStandardPct } from '../../lib/kit';

const preset: Household = { couple: true, you: { age: 38, payment: 'none', incomeAnnual: 95000 }, partner: { age: 36, payment: 'none', incomeAnnual: 0 }, children: [{ age: 2 }, { age: 6 }], rentPf: 0, homeowner: true };
const r = household(preset);
const a = r.ftbA!, b = r.ftbB!;
const back = household({ ...preset, partner: { ...preset.partner!, incomeAnnual: 25000 } });
const raise = ftbA({ ages: [2, 6], ati: 105000 });
const cut = ftbACutoffs([2, 6]);

export default definePage({
  id: 'couple-two-children-one-income',
  group: 'cases',
  kind: 'case',
  order: 20,
  slug: 'households/couple-two-children-one-income',
  nav: 'Couple, two children, one income',
  card: 'One parent earns, the other is at home: both parts of FTB, and what a return to work changes.',
  title: 'Family Tax Benefit One Income Couple 2026: Two Children',
  description: `Family Tax Benefit for a one-income couple with two children in 2026: about ${aud(r.fortnightTotal)} a fortnight from Parts A and B on ${aud(95000)}, and what a second job changes.`,
  h1: 'A couple with two young children on one income',
  intro: 'Daniel earns $95,000; Priya is at home with their children aged 2 and 6. They own their home. No main payment, but Family Tax Benefit on both parts.',
  resume: `A couple with children aged 2 and 6, one parent earning ${aud(95000)} and the other at home, receives about ${aud(r.fortnightTotal)} a fortnight of Family Tax Benefit in 2026-27, with ${aud(r.endOfYear)} of supplements after the tax returns. Part B is what makes the difference here: it is designed for exactly this household, and because the parent at home has no income and the earner is under the primary earner limit of ${aud(P.ftb.b_primary_limit)}, it is paid at the full rate for a youngest child under 5, ${aud(b.fortnight)} a fortnight. Part A is income tested on the family total of ${aud(95000)}: above the free area of ${aud(P.ftb.a_ifa)}, each dollar removes 20 cents, which leaves ${aud(a.fortnight)} a fortnight between the two children. The household receives no main payment: nobody is looking for work, and Daniel's income would cancel any Parenting Payment for Priya through the partner income test. When Priya returns to part-time work, Part B falls first.`,
  preset,
  related: ['family-tax-benefit-part-b', 'family-tax-benefit-income-test', 'family-tax-benefit-calculator', 'parenting-payment-partnered', 'couple-two-incomes-child-care'],
  sources: ['fag-ftb-rates', 'fag-ftb-b-test', 'fag-ftb-m1'],
  body: (h) => `
<h2>Part B carries the household</h2>
<p>For a single-income couple, Part B is the payment to watch. Its test first checks that the higher earner is at or under ${h.aud(P.ftb.b_primary_limit)}, which Daniel is, then looks only at the lower earner, Priya, whose income is nil (${h.src('fag-ftb-b-test', 'Family Assistance Guide 3.1.9.20')}). The family therefore receives the full rate for a youngest child under 5, ${h.aud(b.fortnight)} a fortnight, plus the Part B supplement of ${h.aud(b.supplementPaid)} after the year. On the youngest child's fifth birthday, the rate drops to the lower amount, and on the thirteenth birthday Part B ends for a couple.</p>
<h2>Part A on a family income of $95,000</h2>
<p>Part A adds both incomes. At ${h.aud(95000)}, the family is ${h.aud(95000 - P.ftb.a_ifa)} above the free area, so Method 1 removes ${h.aud(a.reductionMethod1)} from the maximum rate of the two children. What remains, ${h.aud(a.annualNoSupplement)} a year, is still above the two base rates, so Method 1 pays. A pay rise to ${h.aud(105000)} would take Part A to ${h.aud(raise.fortnight)} a fortnight; Part A for these two children ends altogether at about ${h.aud(cut.nilAt)}. No Part A supplement is paid, because the family income is above ${h.aud(P.ftb.a_supplement_ati_limit)}.</p>
<h2>What changes when the second parent goes back to work</h2>
<p>Suppose Priya takes a part-time job paying ${h.aud(25000)} a year. Part B now has an income to test: ${h.aud(25000 - P.ftb.b_ifa)} above the lower earner's free area, at 20 cents a dollar. Part A sees the family income rise to ${h.aud(120000)}. The household's Family Tax Benefit drops to about ${h.aud(back.fortnightTotal)} a fortnight, so the family keeps roughly ${Math.round(((25000 - (r.annualTotal - back.annualTotal)) / 25000) * 100)} cents of each dollar Priya earns, before tax and child care. If the younger child goes to day care while she works, Child Care Subsidy at ${ccsStandardPct(120000)}% of the fee would offset much of the cost; set the days in the calculator above to see it.</p>
${h.box('Could Priya claim Parenting Payment?', `<p>Parenting Payment partnered needs a youngest child under ${P.benefit.ppp.youngest_under}, which the family has. But the partner income test applies: Daniel's ${h.aud(95000)}, about ${h.aud(95000 / 26)} a fortnight, is far above the level at which Priya's payment would cut out. Selecting Parenting Payment for her in the calculator shows nil, and the household figures stay the same.</p>`)}`,
  faqs: [
    { q: 'Do we get Family Tax Benefit Part B if one of us stays at home?', a: `Yes, if the earning partner's adjusted taxable income is ${aud(P.ftb.b_primary_limit)} or less. With the other partner earning nothing, Part B is paid at the full rate: ${aud(b.fortnight)} a fortnight while the youngest is under 5, then the lower rate until the youngest turns 13, plus the supplement after the tax returns.` },
    { q: 'How much Family Tax Benefit for two kids on a $95,000 income?', a: `About ${aud(r.fortnightTotal)} a fortnight for children aged 2 and 6 when all of that income is earned by one parent: ${aud(a.fortnight)} of Part A and ${aud(b.fortnight)} of Part B, plus ${aud(r.endOfYear)} of supplements after tax time. If the same ${aud(95000)} were split between two earners, Part B would be much lower.` },
    { q: 'Does a part-time job for the second parent reduce Family Tax Benefit?', a: `Yes, through both parts. Part B falls by 20 cents for each dollar the lower earner makes above ${aud(P.ftb.b_ifa)} a year, and Part A falls by 20 cents per dollar of the higher family income. The household still gains overall, but the effective gain per dollar is lower than the wage suggests.` },
  ],
});

import { definePage } from '../../lib/page-types';
import type { Household } from '../../lib/engine/household';
import { P, aud, audx, household, carerAllowance } from '../../lib/kit';

const preset: Household = { couple: true, you: { age: 41, payment: 'carer', incomeAnnual: 0 }, partner: { age: 43, payment: 'none', incomeAnnual: 52000 }, children: [{ age: 8 }], rentPf: 560, homeowner: false };
const r = household(preset);
const cp = r.lines.find((l) => l.key.startsWith('pension'))!;
const ca = carerAllowance(52000);
const without = household({ ...preset, you: { ...preset.you, payment: 'none' } });
const raise = household({ ...preset, partner: { ...preset.partner!, incomeAnnual: 75000 } });

export default definePage({
  id: 'carer-couple-with-child',
  group: 'cases',
  kind: 'case',
  order: 100,
  slug: 'households/carer-couple-with-child',
  nav: 'Carer of a child, couple',
  card: 'Carer Payment, Carer Allowance and FTB for a family caring for a child with disability.',
  title: 'Carer Payment and FTB 2026: Caring for a Child at Home',
  description: `Carer Payment and Family Tax Benefit in 2026: a couple caring for a child with disability gets about ${aud(r.fortnightTotal)} a fortnight, plus ${audx(ca)} of Carer Allowance.`,
  h1: 'A couple caring for a child with disability',
  intro: 'Sam gives up work to care full time for their 8-year-old son, who has a severe disability. Kim earns $52,000. They rent for $560 a fortnight.',
  resume: `A couple where one parent provides constant care at home to an 8-year-old with a severe disability, while the other earns ${aud(52000)}, renting at ${aud(560)} a fortnight, receives about ${aud(r.fortnightTotal)} a fortnight from the household calculator: Carer Payment of about ${aud(cp.fortnight)} for the carer, and both parts of Family Tax Benefit at their maximum rates, Rent Assistance included. On top, Carer Allowance of ${audx(ca)} a fortnight is paid for the child, because the family income is under ${aud(P.carer.allowance_income_limit)}; the calculator does not add it to its total, so the household's real figure is about ${aud(r.fortnightTotal + ca)}. Carer Payment is paid at the pension rate and assessed with the pension income test on the couple's combined income, which is why Kim's wages reduce it. Because Carer Payment is an income support payment, Family Tax Benefit is paid without the family income test. The child's own care needs, and the parents' income and assets, are also assessed under the care receiver test, not modelled here.`,
  preset,
  related: ['carer-payment-calculator', 'carer-allowance', 'family-tax-benefit-part-a', 'rent-assistance-for-families', 'age-pension-income-test'],
  sources: ['ssg-cp', 'ssg-cp-tests', 'ssg-ca', 'ssg-common-pension', 'fag-ftb-m1'],
  body: (h) => `
<h2>Carer Payment on the pension test</h2>
<p>Carer Payment is a pension, assessed like the Age Pension (${h.src('ssg-cp-tests', 'Social Security Guide 4.2.5')}). For a couple where only one partner receives it, the couple's combined income is compared with the couple free area of ${h.aud((2 * P.pension.ifa_couple_each_pa) / 26)} a fortnight, and the carer's rate falls by 25 cents for each dollar above it. Kim's ${h.aud(52000 / 26)} a fortnight brings Sam's Carer Payment down from the couple maximum to about ${h.aud(cp.fortnight)}. A pay rise to ${h.aud(75000)} would lower the household's payments to about ${h.aud(raise.fortnightTotal)} a fortnight.</p>
<h2>Family Tax Benefit without the income test</h2>
<p>While Sam receives Carer Payment, an income support payment, Family Tax Benefit is paid at the maximum for their son, Part A and Part B, and Rent Assistance comes in full inside Part A (${h.src('fag-ftb-m1', 'Family Assistance Guide 3.1.4.40')}). Without Carer Payment, the family's Family Tax Benefit would go back to the income test, and the household would receive about ${h.aud(without.fortnightTotal)} a fortnight from Centrelink instead of ${h.aud(r.fortnightTotal)}.</p>
<h2>Carer Allowance on top</h2>
<p>Carer Allowance is a separate supplement of ${h.audx(P.carer.allowance_pf)} a fortnight for daily care at home, with a family income limit of ${h.aud(P.carer.allowance_income_limit)} and no taper (${h.src('ssg-ca', 'Social Security Guide 1.2.5.50')}). A carer who receives Carer Payment for a child may qualify for Carer Allowance automatically. It also brings a Health Care Card for the child. It is tax-free and does not count as income for Carer Payment or Family Tax Benefit.</p>
${h.box('What the calculator cannot check', `<p>Carer Payment for a child requires the child to have a severe disability or severe medical condition, assessed with Services Australia's own tools, and the family to pass the care receiver income and assets tests set in the Social Security Act. Those limits are not in this site's data. The calculator assumes both are met and shows the carer's own means test only.</p>`)}`,
  faqs: [
    { q: 'Can I get Carer Payment if my partner works?', a: `Yes, but your partner's income counts. Carer Payment uses the pension income test on the couple's combined income: above ${aud((2 * P.pension.ifa_couple_each_pa) / 26)} a fortnight, your rate falls by 25 cents per dollar. With a partner earning ${aud(52000)} a year, the carer in this example still receives about ${aud(cp.fortnight)} a fortnight.` },
    { q: 'Do carers get Family Tax Benefit at the maximum rate?', a: 'Yes, while Carer Payment is paid. It is an income support payment, so Family Tax Benefit Part A and Part B are worked out without the family income test, and Rent Assistance for renters is paid in full inside Part A. Carer Allowance alone does not have this effect, because it is not an income support payment.' },
    { q: 'Is Carer Allowance included in the household total?', a: `No, the calculator leaves it out because eligibility depends on an assessment of the care needed. If you qualify, add ${audx(P.carer.allowance_pf)} a fortnight to the total: it is paid on top of Carer Payment and Family Tax Benefit, for families with income up to ${aud(P.carer.allowance_income_limit)}.` },
  ],
});

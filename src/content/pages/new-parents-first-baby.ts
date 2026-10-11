import { definePage } from '../../lib/page-types';
import type { Household } from '../../lib/engine/household';
import { P, aud, audx, household, ppl, ftbA, ftbB, faFortnight } from '../../lib/kit';

const preset: Household = { couple: true, you: { age: 32, payment: 'none', incomeAnnual: 42000 }, partner: { age: 34, payment: 'none', incomeAnnual: 80000 }, children: [{ age: 0 }], rentPf: 0, homeowner: true };
const r = household(preset);
const leave = ppl({ partnered: true, ownAti: 62000, partnerAti: 80000, workTest: true });
const partnerLeave = P.ppl.reserved_days * P.ppl.daily;
const a = r.ftbA!;
const lower = household({ ...preset, partner: { ...preset.partner!, incomeAnnual: 60000 } });
const bIfNoLeave = ftbB({ ages: [0], couple: true, primaryAti: 80000, secondaryAti: 0 });

export default definePage({
  id: 'new-parents-first-baby',
  group: 'cases',
  kind: 'case',
  order: 110,
  slug: 'households/new-parents-first-baby',
  nav: 'New parents, first baby',
  card: 'Paid Parental Leave for both parents, and the little Family Tax Benefit a middle income keeps.',
  title: 'Paid Parental Leave and FTB 2026: New Parents, First Baby',
  description: `Paid Parental Leave and FTB for new parents in 2026: ${aud(leave.total)} of leave pay for the birth parent, ${aud(partnerLeave)} for the partner, and the FTB a middle income keeps.`,
  h1: 'New parents with their first baby',
  intro: 'Emma and Josh have their first baby in August 2026. Emma earned $62,000 last year and expects $42,000 this year with her leave; Josh earns $80,000. They own their home.',
  resume: `A couple whose first child is born after 1 July 2026, where the birth parent earned ${aud(62000)} in the reference year and the partner earns ${aud(80000)}, can receive ${aud(leave.total)} of Parental Leave Pay for the birth parent, ${leave.days} days at ${audx(P.ppl.daily)} a day, and ${aud(partnerLeave)} for the partner's ${P.ppl.reserved_days} reserved days, if both pass the work and income tests. That leave pay is the main Centrelink support for this household. Family Tax Benefit is modest at their income: with a family adjusted taxable income of about ${aud(122000)} for the year, Part A is at the base rate, about ${aud(a.fortnight)} a fortnight, because the income is above the free area but under the higher free area of ${aud(P.ftb.a_hifa)}. Part B is nil, because the birth parent's income for the year is far above the lower earner's free area, and Part B is not paid on Parental Leave Pay days anyway. The household calculator above shows the Family Tax Benefit side; the leave pay is worked out separately.`,
  preset,
  related: ['paid-parental-leave-calculator', 'paid-parental-leave-income-test', 'family-tax-benefit-part-b', 'family-tax-benefit-part-a', 'child-care-subsidy-three-day-guarantee'],
  sources: ['ppl-rate', 'ppl-max', 'ppl-income', 'fag-ftb-rates', 'fag-ftb-b'],
  body: (h) => `
<h2>Parental Leave Pay for both</h2>
<p>For a child born from 1 July 2026, the Paid Parental Leave scheme pays up to ${P.ppl.max_days} days per child. Because Emma is partnered when she claims, ${P.ppl.reserved_days} of them are reserved for Josh, and she can take up to ${P.ppl.max_days_partnered_claimant} (${h.src('ppl-max', 'Paid Parental Leave Guide 2.9')}). At ${h.audx(P.ppl.daily)} a day, her ${leave.days} days come to ${h.aud(leave.total)} before tax, paid fortnightly at ${h.aud(P.ppl.daily * 10)}. Josh's ${P.ppl.reserved_days} days are worth ${h.aud(partnerLeave)}, but only if he takes them; they cannot be transferred to Emma unless an exemption applies.</p>
<h2>The income test, passed on the individual limit</h2>
<p>Emma's adjusted taxable income in the reference year, ${h.aud(62000)}, is under the individual limit of ${h.aud(P.ppl.individual_limit)}, so she passes without the family test. Josh, on ${h.aud(80000)}, passes the same way for his days. Their family income, ${h.aud(142000)} in the reference year, is also far under the family limit of ${h.aud(P.ppl.family_limit)} (${h.src('ppl-income', 'Paid Parental Leave Guide 2.3.4')}).</p>
<h2>Family Tax Benefit on a middle income</h2>
<p>For this income year, Emma's income falls to about ${h.aud(42000)}, Parental Leave Pay included, because it is taxable income. Family income is about ${h.aud(122000)}: above ${h.aud(P.ftb.a_ifa)}, so Part A has tapered all the way down to the base rate, but under ${h.aud(P.ftb.a_hifa)}, so the base rate is protected. Part A is ${h.aud(a.fortnight)} a fortnight. Part B would have been ${h.aud(bIfNoLeave.fortnight)} a fortnight if Emma had no income, but her ${h.aud(42000)} is far above the lower earner's free area of ${h.aud(P.ftb.b_ifa)}, and in any case Part B is nil on every day Parental Leave Pay is paid (${h.src('fag-ftb-b', 'Family Assistance Guide 3.1.9.10')}). If Josh earned ${h.aud(60000)} instead, the household's Family Tax Benefit would be about ${h.aud(lower.fortnightTotal)} a fortnight.</p>
${h.box('Back to work and child care', `<p>When Emma returns to work, Child Care Subsidy is assessed on the family income, with at least ${P.ccs.hours_base} subsidised hours a fortnight whatever the hours worked. On about ${h.aud(142000)} of family income the standard rate would be ${h.ccsStandardPct(142000)}%. The ${h.a('child-care-subsidy-calculator', 'Child Care Subsidy calculator')} shows the fee gap for a given centre.</p>`)}`,
  faqs: [
    { q: 'How much Paid Parental Leave will we get for a baby born in 2026?', a: `For a child born from 1 July 2026, up to ${P.ppl.max_days} days at ${audx(P.ppl.daily)} a day. A partnered birth parent can take up to ${P.ppl.max_days_partnered_claimant} days, ${aud(P.ppl.max_days_partnered_claimant * P.ppl.daily)} before tax, and the other parent the ${P.ppl.reserved_days} reserved days, ${aud(partnerLeave)}, if each passes the work and income tests.` },
    { q: 'Do new parents on $122,000 get Family Tax Benefit?', a: `Usually a little. With one baby and a family income of about ${aud(122000)}, Part A is at the base rate, about ${aud(a.fortnight)} a fortnight, because the base rate is protected up to ${aud(P.ftb.a_hifa)}. Part B depends on the lower earner's income and is not paid on Parental Leave Pay days.` },
    { q: 'Does Paid Parental Leave count as income for Family Tax Benefit?', a: 'Yes. Parental Leave Pay is taxable income and counts in the adjusted taxable income used for Family Tax Benefit Part A and Part B, and for Child Care Subsidy. In addition, Family Tax Benefit Part B is not paid at all on the days Parental Leave Pay is paid to you or your partner.' },
  ],
});

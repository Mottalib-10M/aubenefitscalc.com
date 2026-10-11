import { definePage } from '../../lib/page-types';
import { P, aud, audx, ppl, faFortnight } from '../../lib/kit';

const single = ppl({ partnered: false, ownAti: 70000, workTest: true });
const pair = ppl({ partnered: true, ownAti: 70000, partnerAti: 95000, workTest: true });
const partnerPart = P.ppl.reserved_days * P.ppl.daily;
const bLost = faFortnight(P.ftb.b_under5) * (P.ppl.max_days / 10);

export default definePage({
  id: 'paid-parental-leave-calculator',
  group: 'work',
  kind: 'pillar',
  order: 110,
  slug: 'paid-parental-leave-calculator',
  nav: 'Paid Parental Leave calculator',
  card: 'Parental Leave Pay for a child born from 1 July 2026: days, total and income test.',
  title: 'Paid Parental Leave Calculator 2026-27: 26 Weeks, Daily Rate',
  description: `Paid Parental Leave calculator for a child born from 1 July 2026: ${audx(P.ppl.daily)} a day for up to ${P.ppl.max_days} days, the ${P.ppl.reserved_days}-day partner share and both income limits explained.`,
  h1: 'Paid Parental Leave calculator',
  intro: 'Parental Leave Pay for a baby born or adopted from 1 July 2026: how many days, how much before tax, and whether you pass the income test.',
  resume: `For a child born or adopted on or after 1 July 2026, the Paid Parental Leave scheme pays up to ${P.ppl.max_days} days of Parental Leave Pay, which is 26 weeks of five working days. The daily rate is 7.6 times the hourly national minimum wage: ${audx(P.ppl.daily)} a day from 1 July 2026, or ${audx(P.ppl.weekly)} for a five-day week, before tax. A claimant who is single when claiming can take all ${P.ppl.max_days} days; a partnered claimant can take up to ${P.ppl.max_days_partnered_claimant}, with ${P.ppl.reserved_days} days reserved for the other parent unless an exemption applies. Over the full entitlement, a single claimant receives ${aud(single.total)} before tax. To qualify you must meet a work test and an income test: an adjusted taxable income of ${aud(P.ppl.individual_limit)} or less in the reference year, or a family income of ${aud(P.ppl.family_limit)} or less. Family Tax Benefit Part B is not paid on the days Parental Leave Pay is paid.`,
  tool: 'ppl',
  related: ['paid-parental-leave-income-test', 'family-tax-benefit-part-b', 'new-parents-first-baby', 'child-care-subsidy-three-day-guarantee', 'family-tax-benefit-part-a'],
  sources: ['ppl-rate', 'ppl-max', 'ppl-income', 'ppl-work', 'fag-ftb-b'],
  body: (h) => `
<h2>How the entitlement has grown</h2>
<p>Parental Leave Pay has been extended step by step: 100 days for children born from 1 July 2023, 110 from 1 July 2024, 120 from 1 July 2025 and ${P.ppl.max_days} from 1 July 2026 (${h.src('ppl-max', 'Paid Parental Leave Guide 2.9')}). The reserved share for the second parent rose with it, to ${P.ppl.reserved_days} days for children born from 1 July 2026. The date that matters is the child's date of birth or adoption, not the date of the claim.</p>
${h.table(['Claimant', 'Most days', 'Weeks', 'Total before tax'], [['Single at claim', String(P.ppl.max_days), String(P.ppl.max_days / 5), h.aud(single.total)], ['Partnered at claim', String(P.ppl.max_days_partnered_claimant), String(P.ppl.max_days_partnered_claimant / 5), h.aud(pair.total)], ['The other parent (reserved)', String(P.ppl.reserved_days), String(P.ppl.reserved_days / 5), h.aud(partnerPart)]], `Child born or adopted from 1 July 2026, daily rate of ${audx(P.ppl.daily)} (Paid Parental Leave Guide 3.1).`, ['l', 'r', 'r', 'r'])}
<h2>The rate</h2>
<p>Each day of Parental Leave Pay is paid at the daily national minimum wage amount, ${h.audx(P.ppl.daily)}, which is ${h.audx(P.ppl.nmw_hourly)} times 7.6 hours, rounded (${h.src('ppl-rate', 'Paid Parental Leave Guide 3.1')}). It is the same for everyone, whatever their usual salary, and it is taxable. It rises each 1 July with the minimum wage; a day falling on 1 July is paid at the new rate. An employer may pass the payment on through its payroll, but the amount is set by the scheme.</p>
<h2>The two tests</h2>
<p>The work test checks your attachment to work in the 392 days, about 13 months, before the birth or adoption: you need a qualifying period of 295 consecutive days, about 10 months, made of days on which you did at least an hour of paid work or paid leave or that fall within a permitted break, and at least 330 hours of work within it. Work for several employers counts, and so do days of Parental Leave Pay for an earlier child (${h.src('ppl-work', 'Paid Parental Leave Guide 2.2.2')}). The calculator asks the work test as a yes or no question. The income test is checked on adjusted taxable income for the reference year: you pass if your own income is ${h.aud(P.ppl.individual_limit)} or less, or if your family income is ${h.aud(P.ppl.family_limit)} or less (${h.src('ppl-income', 'Paid Parental Leave Guide 2.3.4')}). The ${h.a('paid-parental-leave-income-test', 'income test guide')} explains the reference year and the family test.</p>
${h.box('Parental Leave Pay and Family Tax Benefit', `<p>Family Tax Benefit Part B is nil on every day that Parental Leave Pay is paid to you or your partner (${h.src('fag-ftb-b', 'Family Assistance Guide 3.1.9.10')}). For a family otherwise entitled to the full Part B rate with a baby, ${P.ppl.max_days} days of leave pay mean roughly ${h.aud(bLost)} of Part B not paid. Part A is not switched off, but Parental Leave Pay counts as income for the year.</p>`)}`,
  faqs: [
    { q: 'How much is Paid Parental Leave per week in 2026?', a: `${audx(P.ppl.weekly)} a week before tax from 1 July 2026, being five days at the daily rate of ${audx(P.ppl.daily)}. The daily rate is 7.6 hours at the national minimum wage of ${audx(P.ppl.nmw_hourly)} an hour. Parental Leave Pay is taxable, and the rate rises each 1 July with the minimum wage.` },
    { q: 'How many weeks of Paid Parental Leave for a baby born in 2026?', a: `For a child born or adopted on or after 1 July 2026, up to ${P.ppl.max_days} days, which is 26 weeks of weekdays. For a child born between 1 July 2025 and 30 June 2026, the maximum is 120 days. A partnered claimant can take ${P.ppl.max_days_partnered_claimant} days, with ${P.ppl.reserved_days} reserved for the other parent.` },
    { q: 'Can both parents get Paid Parental Leave?', a: `Yes, they share the entitlement for the child. When the claimant is partnered, ${P.ppl.reserved_days} of the ${P.ppl.max_days} days are reserved for the other parent or partner, who must meet the work and income tests in their own right. Days can be taken at the same time or one after the other.` },
    { q: 'What happens if we earn too much for Paid Parental Leave?', a: `You can still qualify through the family test. You pass the income test if your own adjusted taxable income is ${aud(P.ppl.individual_limit)} or less, or if your combined family income is ${aud(P.ppl.family_limit)} or less. Only when both are exceeded is Parental Leave Pay refused.` },
    { q: 'Do I get Paid Parental Leave on top of my employer’s leave?', a: 'Yes. Government Parental Leave Pay can be received before, after or at the same time as employer-paid parental leave, annual leave or long service leave. Being on paid leave from your employer does not reduce it, although your employer pay and Parental Leave Pay are both taxable income.' },
    { q: 'Does Paid Parental Leave affect Family Tax Benefit?', a: 'Part B is not paid on days when Parental Leave Pay is paid to you or your partner, so a family usually loses Part B during the leave. Part A is not switched off, but Parental Leave Pay counts in the family income used for the Part A income test for that year.' },
  ],
});

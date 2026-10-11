import { definePage } from '../../lib/page-types';
import { P, aud, aud2, day, ccsFamily, ccsStandardPct, ccsHigherPct } from '../../lib/kit';

const ex = ccsFamily({ ati: 140000, activityHoursPf: 60, children: [{ age: 3, daysPerWeek: 3, hoursPerDay: 10, dailyFee: 150, type: 'cbdc' }, { age: 1, daysPerWeek: 3, hoursPerDay: 10, dailyFee: 150, type: 'cbdc' }] });

export default definePage({
  id: 'child-care-subsidy-calculator',
  group: 'childcare',
  kind: 'pillar',
  order: 10,
  slug: 'child-care-subsidy-calculator',
  nav: 'Child Care Subsidy calculator',
  card: 'Your percentage, the higher rate for a second child, hours, caps and the gap you pay.',
  title: 'Child Care Subsidy Calculator 2026-27: CCS and Your Gap Fee',
  description: `Child Care Subsidy calculator for 2026-27: ${P.ccs.max_pct}% up to ${aud(P.ccs.lower_threshold)} of family income, the higher rate for a second child, ${P.ccs.hours_base} guaranteed hours and your gap fee.`,
  h1: 'Child Care Subsidy calculator',
  intro: 'What the government pays towards your child care fees, child by child, and what is left for you to pay.',
  resume: `Child Care Subsidy pays up to ${P.ccs.max_pct}% of your child care fee in 2026-27, up to an hourly rate cap of ${aud2(P.ccs.caps.cbdc_below_school)} for centre-based day care, and the percentage falls by one point for each ${aud(P.ccs.step)} of combined family income above ${aud(P.ccs.lower_threshold)}, reaching zero at ${aud(P.ccs.zero_at)}. Every family gets at least ${P.ccs.hours_base} subsidised hours a fortnight whatever its work or study pattern, and ${P.ccs.hours_higher} hours with more than ${P.ccs.hours_higher_activity} hours of activity. A second or younger child aged 5 or under can attract a higher percentage while family income is under ${aud(P.ccs.higher.cutoff)}. For a family earning ${aud(140000)} with children aged 1 and 3 in day care three days a week at ${aud(150)} a day, the subsidy comes to about ${aud(ex.paidPf)} a fortnight after the ${P.ccs.withholding_default}% withholding, leaving a gap of ${aud(ex.gapPf)}. The calculator below works out each child separately.`,
  tool: 'ccs',
  related: ['child-care-subsidy-income-thresholds', 'higher-child-care-subsidy', 'child-care-subsidy-three-day-guarantee', 'child-care-subsidy-hourly-rate-cap', 'child-care-subsidy-withholding', 'couple-two-incomes-child-care'],
  sources: ['fag-ccs-income', 'fag-ccs-hours', 'fag-ccs-caps', 'fag-ccs-calc', 'starting-blocks'],
  body: (h) => `
<h2>Four things decide the subsidy</h2>
<p>Your percentage comes from combined family income: at ${h.aud(100000)} it is ${ccsStandardPct(100000)}%, at ${h.aud(200000)} it is ${ccsStandardPct(200000)}%. The percentage is applied to the hourly fee or the hourly cap, whichever is lower, so a service charging more than the cap leaves you paying the whole difference. The number of subsidised hours sets how much of your booking is covered. And for a second child aged 5 or under, a separate, higher percentage can apply: at ${h.aud(200000)} the younger child attracts ${ccsHigherPct(200000)}% instead of ${ccsStandardPct(200000)}%.</p>
<p>Services charge by session, often 10 or 12 hours, even when a child attends for fewer. The subsidy is calculated on the hours charged, so enter the session length the centre bills rather than the time your child is actually there.</p>
<h2>What the result shows</h2>
<p>For each child, the calculator gives the percentage used, the subsidy per hour, the hours covered against the hours booked, and the subsidy paid to the service after withholding. Below the total, the gap fee is your share of the bill each fortnight. The withheld amount is not lost: it is kept as a buffer against a reconciliation debt and paid back once your income for the year is confirmed. See ${h.a('child-care-subsidy-withholding', 'how withholding works')}.</p>
${h.box('Income for CCS includes both parents', `<p>Child Care Subsidy uses the adjusted taxable income of the family for the financial year: both partners, including income from payments that are taxable. A pay rise or a new job should be reported as an updated estimate, because the subsidy paid during the year is reconciled against the actual figure after the tax returns are processed (${h.src('fag-ccs-income', 'Family Assistance Guide 3.5.1')}).</p>`)}
<h2>Day care, family day care and outside school hours</h2>
<p>The caps differ by type of care: ${h.aud2(P.ccs.caps.cbdc_below_school)} an hour for centre-based day care below school age and ${h.aud2(P.ccs.caps.cbdc_school)} for school-age children, ${h.aud2(P.ccs.caps.fdc)} for family day care at any age, and the school-age cap of ${h.aud2(P.ccs.caps.oshc_school)} for before and after school care. A child counts as school age from the first day of scheduled attendance at school, or from age 6. Only approved services can pass the subsidy on; ${h.src('starting-blocks', 'Starting Blocks')} lists them and shows their fees.</p>
<h2>Child Care Subsidy with other payments</h2>
<p>The subsidy does not depend on whether you receive Family Tax Benefit, JobSeeker or Parenting Payment, and it does not reduce them. It is paid directly to the service and appears as a reduction on your statement. The ${h.a('home', 'household calculator')} adds it next to your other payments so that you can see the whole budget, and the ${h.a('couple-two-incomes-child-care', 'two-income family with child care')} shows a worked example.</p>`,
  faqs: [
    { q: 'How much Child Care Subsidy will I get on a family income of $150,000?', a: `${ccsStandardPct(150000)}% for your eldest child in care, applied to the lower of the hourly fee and the cap, and ${ccsHigherPct(150000)}% for a second or younger child aged 5 or under. At ${aud(150)} for a 10-hour day, that is about ${aud((ccsStandardPct(150000) / 100) * 150)} a day for the first child before the ${P.ccs.withholding_default}% withholding, if the fee is under the cap.` },
    { q: 'Do I need to work to get Child Care Subsidy in 2026?', a: `No. Since ${day(P.ccs.three_day_guarantee_from)} every eligible family gets at least ${P.ccs.hours_base} subsidised hours a fortnight, whatever its work, study or volunteering. Families with more than ${P.ccs.hours_higher_activity} hours of recognised activity a fortnight, or an exemption, get ${P.ccs.hours_higher} hours, and so does every family caring for an Aboriginal or Torres Strait Islander child.` },
    { q: 'Why is my gap fee higher than the calculator suggests?', a: `Usually because your centre charges more than the hourly rate cap. The subsidy stops at the cap, ${aud2(P.ccs.caps.cbdc_below_school)} an hour for day care before school age, and you pay everything above it. Hours booked beyond your subsidised hours and the ${P.ccs.withholding_default}% withholding also add to the gap shown on your statement.` },
    { q: 'At what income does Child Care Subsidy stop?', a: `The standard rate reaches 0% at a combined family income of ${aud(P.ccs.zero_at)} in 2026-27. Below that, it falls by one percentage point for each ${aud(P.ccs.step)} of income above ${aud(P.ccs.lower_threshold)}. The higher rate for younger children stops at ${aud(P.ccs.higher.cutoff)}, after which all children get the standard rate.` },
    { q: 'Is Child Care Subsidy paid to me or to the child care centre?', a: 'To the centre. Services Australia pays the subsidy to the approved service, which deducts it from your fees and shows it on your statement. You pay the gap. The withheld part of the subsidy is settled with you directly at reconciliation, after the end of the financial year.' },
    { q: 'Does Child Care Subsidy count as income for Centrelink?', a: 'No. Child Care Subsidy is not taxable income and it is not counted in the income tests of Family Tax Benefit, JobSeeker, Parenting Payment or the Age Pension. It is also unaffected by those payments, except that their taxable part is included in the family income used to set your percentage.' },
  ],
});

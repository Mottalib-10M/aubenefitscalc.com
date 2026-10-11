import { definePage } from '../../lib/page-types';
import type { Household } from '../../lib/engine/household';
import { P, aud, aud2, household, ccsFamily, ftbACutoffs } from '../../lib/kit';

const preset: Household = { couple: true, you: { age: 37, payment: 'none', incomeAnnual: 110000 }, partner: { age: 35, payment: 'none', incomeAnnual: 65000 }, children: [{ age: 1, careDays: 3, careFee: 160 }, { age: 4, careDays: 3, careFee: 160 }], rentPf: 0, homeowner: true, activityHoursPf: 76 };
const r = household(preset);
const c = r.ccs!;
const older = c.children.find((x) => !x.higher)!, younger = c.children.find((x) => x.higher)!;
const four = ccsFamily({ ati: 175000, activityHoursPf: 76, children: [{ age: 1, daysPerWeek: 4, hoursPerDay: 10, dailyFee: 160, type: 'cbdc' }, { age: 4, daysPerWeek: 4, hoursPerDay: 10, dailyFee: 160, type: 'cbdc' }] });
const fewer = ccsFamily({ ati: 175000, activityHoursPf: 30, children: [{ age: 1, daysPerWeek: 4, hoursPerDay: 10, dailyFee: 160, type: 'cbdc' }, { age: 4, daysPerWeek: 4, hoursPerDay: 10, dailyFee: 160, type: 'cbdc' }] });

export default definePage({
  id: 'couple-two-incomes-child-care',
  group: 'cases',
  kind: 'case',
  order: 30,
  slug: 'households/couple-two-incomes-child-care',
  nav: 'Two incomes and child care',
  card: 'No Family Tax Benefit at $175,000, but Child Care Subsidy at two different rates.',
  title: 'CCS and FTB on Two Incomes 2026: $175,000 With Day Care',
  description: `Child Care Subsidy and FTB for a two-income couple on ${aud(175000)} in 2026: no Family Tax Benefit, but about ${aud(r.fortnightTotal)} a fortnight of subsidy for two in day care.`,
  h1: 'Two incomes, two children in day care',
  intro: 'Sarah earns $110,000 and Tom $65,000. Their children, aged 1 and 4, go to day care three days a week at $160 a day.',
  resume: `A couple earning ${aud(110000)} and ${aud(65000)}, with children aged 1 and 4 in day care three days a week at ${aud(160)} a day, receives no Family Tax Benefit at all in 2026-27, but about ${aud(r.fortnightTotal)} a fortnight of Child Care Subsidy, paid to the centre. Their combined income of ${aud(175000)} is above the point where Part A runs out for two young children, about ${aud(ftbACutoffs([1, 4]).nilAt)}, and Tom's ${aud(65000)} is far above the lower earner limit for Part B. Child Care Subsidy reaches much higher incomes: the elder child is subsidised at the standard rate of ${older.pct}% and the younger at the higher rate of ${younger.pct}%, because a second child aged 5 or under gets a separate, more generous income test. With both parents working full time, they qualify for ${P.ccs.hours_higher} subsidised hours a fortnight per child. Their gap fee after the subsidy and the ${P.ccs.withholding_default}% withholding is about ${aud(c.gapPf)} a fortnight.`,
  preset,
  related: ['child-care-subsidy-calculator', 'higher-child-care-subsidy', 'child-care-subsidy-hourly-rate-cap', 'child-care-subsidy-withholding', 'couple-two-children-one-income'],
  sources: ['fag-ccs-income', 'fag-ccs-calc', 'fag-ccs-caps', 'fag-ftb-rates'],
  body: (h) => `
<h2>Why Family Tax Benefit is nil</h2>
<p>Both parts are income tested, and this family is above both limits. Part A looks at the combined ${h.aud(175000)}: above ${h.aud(P.ftb.a_hifa)}, even the base rate tapers at 30 cents per dollar, and for two children it is gone by about ${h.aud(ftbACutoffs([1, 4]).nilAt)}. Part B looks at the lower earner: Tom's ${h.aud(65000)} is many times the ${h.aud(P.ftb.b_ifa)} free area, so the 20 cent taper removes it entirely. The calculator shows both lines at nil, with the reason.</p>
<h2>Two children, two percentages</h2>
<p>The standard Child Care Subsidy percentage at ${h.aud(175000)} is ${older.pct}%: ${h.aud(175000 - P.ccs.lower_threshold)} above the ${h.aud(P.ccs.lower_threshold)} threshold, one point for each ${h.aud(P.ccs.step)} or part of it. The four-year-old, as the elder child aged 5 or under, gets that rate. The one-year-old gets the higher rate, ${younger.pct}%, from the separate test that starts at ${P.ccs.higher.full_pct}% and loses one point for each ${h.aud(P.ccs.higher.step)} above ${h.aud(P.ccs.higher.full_to)} (${h.src('fag-ccs-income', 'Family Assistance Guide 3.5.1')}). At ${h.aud(160)} for a 10-hour day, the hourly fee of ${h.aud2(16)} is above the cap of ${h.aud2(P.ccs.caps.cbdc_below_school)}, so both percentages apply to the cap and the family pays the excess in full.</p>
<h2>A fourth day, and what activity changes</h2>
<p>With four days a week each, the booked hours rise to 80 a fortnight per child, still within the ${P.ccs.hours_higher} subsidised hours that both parents' full-time work gives them, and the subsidy rises to about ${h.aud(four.paidPf)} a fortnight. If one parent worked only part time, ${h.aud(30)} hours a fortnight, the family would be on ${P.ccs.hours_base} hours per child: the fourth day would be only partly subsidised, and the subsidy would be about ${h.aud(fewer.paidPf)}. The 3-day guarantee protects the first ${P.ccs.hours_base} hours whatever the activity.</p>
${h.box('Keep the income estimate up to date', `<p>Child Care Subsidy is paid on the family's income estimate and reconciled after the tax returns. A pay rise that takes the family over a ${h.aud(P.ccs.step)} step lowers the percentage by a point; at this family's level, also a ${h.aud(P.ccs.higher.step)} step for the younger child. The ${P.ccs.withholding_default}% withholding usually covers small differences; see ${h.a('child-care-subsidy-withholding', 'withholding')}.</p>`)}`,
  faqs: [
    { q: 'Do we get Child Care Subsidy on a combined income of $175,000?', a: `Yes. At ${aud(175000)} the standard rate is ${older.pct}% of the fee or the hourly cap, whichever is lower, and a second child aged 5 or under gets the higher rate of ${younger.pct}%. Child Care Subsidy continues down to 0% only at ${aud(P.ccs.zero_at)} of family income, far above the Family Tax Benefit limits.` },
    { q: 'Why is our child care gap fee still high with two incomes?', a: `Mostly because the fee is above the hourly cap. At ${aud(160)} for 10 hours, the centre charges ${aud(16)} an hour against a cap of ${aud2(P.ccs.caps.cbdc_below_school)}; the subsidy is a percentage of the cap, and the excess is entirely yours. The ${P.ccs.withholding_default}% withholding, refunded at reconciliation if your estimate was right, adds a little more.` },
    { q: 'Can a two-income family with young children get Family Tax Benefit?', a: `It depends on the incomes. Part A stops when combined income is well above ${aud(P.ftb.a_hifa)}, at a point that depends on the children's number and ages. Part B needs the lower earner to be under about ${aud(P.ftb.b_ifa + (P.ftb.b_under5 + P.ftb.b_supplement) / P.ftb.b_taper)} a year with a child under 5. Two full-time salaries usually rule out both.` },
  ],
});

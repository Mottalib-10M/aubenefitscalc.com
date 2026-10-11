import { definePage } from '../../lib/page-types';
import { P, aud, ccsFamily, ccsStandardPct, ccsHigherPct } from '../../lib/kit';

const incomes = [120000, 160000, 200000, 250000, 300000, 365000, 380000];
const two = (ati: number) => ccsFamily({ ati, activityHoursPf: 76, children: [{ age: 4, daysPerWeek: 3, hoursPerDay: 10, dailyFee: 150, type: 'cbdc' }, { age: 1, daysPerWeek: 3, hoursPerDay: 10, dailyFee: 150, type: 'cbdc' }] });
const at = two(220000);

export default definePage({
  id: 'higher-child-care-subsidy',
  group: 'childcare',
  kind: 'guide',
  order: 30,
  slug: 'higher-child-care-subsidy',
  nav: 'Higher CCS, second child',
  card: 'The extra subsidy for a second or younger child aged 5 or under, band by band.',
  title: 'Higher Child Care Subsidy 2026-27: Second Child, Age 5',
  description: `Higher Child Care Subsidy in 2026-27: up to ${P.ccs.higher.full_pct}% for a second or younger child aged 5 or under while family income is under ${aud(P.ccs.higher.cutoff)}, with all the bands.`,
  h1: 'The higher Child Care Subsidy for younger children',
  intro: 'With two children aged 5 or under in care, the younger one can be subsidised at a higher rate. How the second income test works.',
  resume: `When a family has two or more children aged 5 or under in approved care, the eldest of them receives the standard Child Care Subsidy percentage and each younger one can receive a higher percentage worked out with a separate income test. In 2026-27 the higher rate is ${P.ccs.higher.full_pct}% up to a combined family income of ${aud(P.ccs.higher.full_to)}, then falls by one point for each ${aud(P.ccs.higher.step)} to ${P.ccs.higher.plateau_pct}% at ${aud(P.ccs.higher.first_taper_to)}, holds there until ${aud(P.ccs.higher.plateau_to)}, falls again to ${P.ccs.higher.floor_pct}% at ${aud(P.ccs.higher.second_taper_to)}, and stops applying at ${aud(P.ccs.higher.cutoff)}, after which every child receives the standard rate. For a family earning ${aud(220000)} with children aged 1 and 4 in day care, the younger child is subsidised at ${at.children[1].pct}% instead of ${at.children[0].pct}%, which adds about ${aud(at.children[1].paidPf - at.children[0].paidPf)} a fortnight at the same fee.`,
  mini: 'ccsHigher',
  miniArg: { income: 220000 },
  related: ['child-care-subsidy-calculator', 'child-care-subsidy-income-thresholds', 'child-care-subsidy-three-day-guarantee', 'couple-two-incomes-child-care'],
  sources: ['fag-ccs-income', 'fag-ccs-calc', 'fag-ccs-caps'],
  body: (h) => `
<h2>Which child gets which rate</h2>
<p>The "standard rate child" is usually the eldest child aged 5 or under who is eligible for Child Care Subsidy. Every younger child aged 5 or under is a "higher rate child" (${h.src('fag-ccs-calc', 'Family Assistance Guide 3.5.4')}). A school-age child in outside school hours care does not take the standard-rate place: they are paid at the standard percentage, and the higher rate is decided among the children aged 5 or under alone. The family must be using care for both children for the higher rate to apply; a baby at home does not lift the subsidy of an older sibling in day care.</p>
<h2>The bands, side by side</h2>
${h.table(['Family income', 'Standard rate (eldest)', 'Higher rate (younger)', 'Subsidy for both, per fortnight'], incomes.map((ati) => { const r = two(ati); const hi = ccsHigherPct(ati); return [h.aud(ati), `${ccsStandardPct(ati)}%`, hi === null ? 'standard rate' : `${hi}%`, h.aud(r.paidPf)]; }), 'Two children aged 1 and 4, three 10-hour days a week each at $150 a day, 2026-27 thresholds, after 5% withholding.', ['r', 'r', 'r', 'r'])}
<p>The step between the two percentages is largest in the middle of the income range. At ${h.aud(250000)}, the eldest child is on ${ccsStandardPct(250000)}% while the younger child is held at ${ccsHigherPct(250000)}% by the plateau of the higher test. Above ${h.aud(P.ccs.higher.plateau_to)} the higher rate starts falling again, and above ${h.aud(P.ccs.higher.cutoff)} it no longer exists.</p>
<h2>Why "or part of" matters</h2>
<p>Both income tests remove a point for each ${h.aud(P.ccs.step)} or ${h.aud(P.ccs.higher.step)} "or part of" that amount above the threshold. The guide's own example shows it: at a combined income of ${h.aud(288520)}, the higher rate is ${ccsHigherPct(288520)}%, because the income is ${h.aud(288520 - P.ccs.higher.plateau_to)} above the start of the second taper, which is five full steps of ${h.aud(P.ccs.higher.step)} and part of a sixth. One dollar can therefore cost a full percentage point.</p>
${h.box('In-home care is different', `<p>Sessions of in-home care do not attract the higher rate, because in-home care is subsidised per family, at a cap of ${h.aud2(P.ccs.caps.ihc_family)} an hour, rather than per child. Children aged 5 or under in in-home care are still counted when deciding who the standard rate child is (${h.src('fag-ccs-income', 'Family Assistance Guide 3.5.1')}).</p>`)}
<h2>Twins, triplets and close siblings</h2>
<p>Twins in care are a common case. One of them is treated as the standard rate child and the other as a higher rate child, so a family with twin toddlers at ${h.aud(180000)} has one child at ${ccsStandardPct(180000)}% and the other at ${ccsHigherPct(180000)}%. With triplets, two of the three attract the higher rate. Families with three children under 6 in care often see the biggest difference, since every child after the eldest is lifted.</p>
<p>The gain from the higher rate is largest when both children attend several days and the fee is near the hourly cap, because the extra percentage points apply to more hours and to a larger hourly amount. A family using one day a week for the younger child gains little in dollar terms, even at the top of the higher rate.</p>
<h2>How the higher rate interacts with the 3-day guarantee</h2>
<p>The higher percentage changes the subsidy per hour, not the number of hours. Each child still has ${P.ccs.hours_base} subsidised hours a fortnight, or ${P.ccs.hours_higher} if the parents qualify, and hours booked beyond that are charged at the full fee whatever the percentage. See ${h.a('child-care-subsidy-three-day-guarantee', 'the 3-day guarantee')}.</p>
<h2>When a child turns 6 or starts school</h2>
<p>The higher rate is tied to the age of the children. When the eldest child aged 5 or under turns 6, the next child becomes the standard rate child and the third, if any, keeps the higher rate. If only one child aged 5 or under remains in care, that child moves to the standard rate. Centrelink reassesses this automatically, but a change in who is enrolled, for example a sibling leaving day care, should be reported so that the right child keeps the higher percentage.</p>
<p>The ${h.a('child-care-subsidy-calculator', 'Child Care Subsidy calculator')} applies the higher rate automatically to the younger of two children aged 5 or under, and the ${h.a('home', 'household calculator')} adds the result to the rest of the family's payments.</p>`,
  faqs: [
    { q: 'Do I get the higher Child Care Subsidy for my second child?', a: `If both children are aged 5 or under and in approved care, and your combined family income is under ${aud(P.ccs.higher.cutoff)}, yes: the younger child is subsidised at the higher rate, between ${P.ccs.higher.floor_pct}% and ${P.ccs.higher.full_pct}% depending on income, while the eldest stays on the standard rate. Above that income, both are on the standard rate.` },
    { q: 'Does an older child in after school care count for the higher rate?', a: 'Not as the standard rate child. The higher rate is worked out among children aged 5 or under: the eldest of them gets the standard rate and the younger ones the higher rate. A school-age child in outside school hours care is simply paid at the standard percentage alongside them.' },
    { q: 'What is the highest Child Care Subsidy percentage in 2026?', a: `${P.ccs.higher.full_pct}%, available for a second or younger child aged 5 or under when combined family income is ${aud(P.ccs.higher.full_to)} or less. The highest standard percentage is ${P.ccs.max_pct}%, up to ${aud(P.ccs.lower_threshold)} of family income. Both apply to the lower of the fee and the hourly rate cap.` },
  ],
});

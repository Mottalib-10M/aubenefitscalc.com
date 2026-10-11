import { definePage } from '../../lib/page-types';
import { P, aud, audx, day, faFortnight, ftbA, raFamilyLimits } from '../../lib/kit';

const fp = (n: number) => audx(Math.round(faFortnight(n) * 100) / 100);
const ages = [5, 9];
const rent = 650;
const atIncome = (ati: number) => ftbA({ ages, ati, rentPf: rent, couple: true });
const rows = [50000, 70000, 85000, 95000, 105000].map((ati) => { const r = atIncome(ati); return [aud(ati), aud(faFortnight(r.raAnnual)), aud(faFortnight(r.raPaidAnnual)), aud(r.fortnight)]; });
const lim2 = raFamilyLimits(false, 2);
const lim3c = raFamilyLimits(true, 3);

export default definePage({
  id: 'rent-assistance-for-families',
  group: 'housing',
  kind: 'guide',
  order: 20,
  slug: 'rent-assistance-for-families',
  nav: 'Rent Assistance for families',
  card: 'How Rent Assistance is built into Family Tax Benefit Part A, and why it goes first.',
  title: 'Rent Assistance for Families 2026: Paid Inside FTB Part A',
  description: `Rent Assistance for families in 2026: paid inside FTB Part A, up to ${fp(P.ra_family.max_1or2)} a fortnight with one or two children, the first part lost as family income rises.`,
  h1: 'Rent Assistance for families with children',
  intro: 'With children, Rent Assistance is not added to your main payment: it sits inside Family Tax Benefit Part A, with its own thresholds.',
  resume: `A family with children receives Rent Assistance as part of Family Tax Benefit Part A, not with Parenting Payment, JobSeeker or wages. From ${day(P.rates_date)} the rent threshold is ${audx(P.ra_family.threshold_single)} a year for a single parent and ${audx(P.ra_family.threshold_couple)} for a couple, and the maximum is ${audx(P.ra_family.max_1or2)} a year with one or two children or ${audx(P.ra_family.max_3plus)} with three or more, about ${fp(P.ra_family.max_1or2)} and ${fp(P.ra_family.max_3plus)} a fortnight. The gross amount is three quarters of the annual rent above the threshold, capped at the maximum. It is added to the maximum rate of Part A under Method 1, which has a consequence many families miss: when family income reduces Part A, Rent Assistance is the first slice to disappear, and once Part A is down to the base rate none of it is left. A family on any income support payment keeps the whole amount, because Part A is then paid without the income test.`,
  mini: 'raFamily',
  related: ['rent-assistance-calculator', 'family-tax-benefit-part-a', 'family-tax-benefit-income-test', 'couple-three-children-renting', 'single-parent-two-children-renting'],
  sources: ['fag-ra', 'fag-ftb-m1', 'fag-ftb-rates'],
  body: (h) => `
<h2>The formula on annual figures</h2>
<p>Family Rent Assistance is calculated per year. Convert your fortnightly rent to a yearly amount (Centrelink uses 365 days divided by 14, so a rent of ${h.aud(rent)} a fortnight is about ${h.aud((rent * 365) / 14)} a year), subtract the threshold for your family type, and take three quarters of what is left, up to the maximum (${h.src('fag-ra', 'Family Assistance Guide 3.1.4.30')}). A single parent with two children reaches the maximum at a rent of about ${h.aud(faFortnight(lim2.rentForMaxAnnual))} a fortnight; a couple with three children at about ${h.aud(faFortnight(lim3c.rentForMaxAnnual))}.</p>
<h2>Why it disappears before the rest of Part A</h2>
<p>Method 1 adds Rent Assistance to the children's maximum rates and the supplement, then applies the income test to the total. The base rate is protected while income stays under the higher income free area, but Rent Assistance is not part of the base rate. So as family income rises through the 20 cent band, the reduction eats into Rent Assistance and the maximum-rate top-up together, and when the rate reaches the base rate there is no Rent Assistance left. Method 2 never includes Rent Assistance at all.</p>
${h.table(['Family income', 'Gross Rent Assistance', 'Rent Assistance kept', 'Part A per fortnight'], rows, `Couple with children aged 5 and 9, rent of ${aud(rent)} a fortnight, no income support, 2026-27 rates. Fortnightly figures.`, ['r', 'r', 'r', 'r'])}
<p>The table shows the family losing its Rent Assistance well before Part A itself ends. At ${h.aud(50000)} it keeps the full amount; somewhere in the next ${h.aud(40000)} of income it is gone, even though the base rate of Part A continues. A renting family that crosses that range should expect its fortnightly payment to fall faster than the 20 cents per dollar the income test suggests on paper, because rent support and child support are falling together.</p>
${h.box('Income support protects it', `<p>If either parent receives an income support payment, Part A is paid at the maximum rate including Rent Assistance, whatever the family income (${h.src('fag-ftb-m1', 'Family Assistance Guide 3.1.4.40')}). A family where one parent receives even a part-rate JobSeeker payment can therefore keep its full Rent Assistance while the other parent earns a good wage.</p>`)}
<h2>Shared care and regular care children</h2>
<p>A parent with between 35% and 65% care of all their children is a "relevant shared carer". Rent Assistance for them is worked out twice, once with the family thresholds and maximums and once with the separate shared-carer amounts, and the higher result is paid. A parent with only regular care of a child, 14% to under 35%, cannot get Family Tax Benefit for that child but can still receive Rent Assistance for them, at the shared-carer rates, under what the guide calls Method 3. This site does not model these cases; Services Australia applies them on claim.</p>
<h2>Keeping Rent Assistance as income rises</h2>
<p>Because Rent Assistance sits above the base rate, a renting family's fortnightly Part A can drop by more than a homeowner family's for the same pay rise, until the Rent Assistance is gone. Two things protect it. An accurate income estimate avoids a reconciliation debt that would claw it back after the year. And if one parent's work is irregular, a period on JobSeeker or Parenting Payment, even at a part rate, restores the full Rent Assistance for that period, because Part A is then paid without the income test.</p>
<h2>Moving between the two routes</h2>
<p>A single person on JobSeeker who has a baby moves from the social security Rent Assistance, paid with JobSeeker, to the family Rent Assistance, paid with Part A. The thresholds and maximums are different, and the family maximum for one or two children, ${h.audx(P.ra_family.max_1or2)} a year, is higher than the single rate of ${h.audx(P.ra_ss.single.max)} a fortnight multiplied out. When the last child stops counting for Part A, the move happens the other way. The ${h.a('rent-assistance-calculator', 'Rent Assistance calculator')} shows both routes, and the ${h.a('home', 'household calculator')} chooses the right one for your household automatically.</p>`,
  faqs: [
    { q: 'Why is Rent Assistance included in my Family Tax Benefit?', a: `Because the law pays Rent Assistance to families with children through Family Tax Benefit Part A rather than through the parents' other payments. It is added to the maximum rate under Method 1, with family thresholds of ${audx(P.ra_family.threshold_single)} a year for a single parent and ${audx(P.ra_family.threshold_couple)} for a couple, so it shows up as part of your Part A.` },
    { q: 'Why did my Rent Assistance stop when my income went up?', a: 'Because it is the first part of Family Tax Benefit Part A to be reduced by the income test. Once family income has reduced Part A to the base rate, no Rent Assistance remains, even though you still receive some Part A. Receiving an income support payment, even a small one, restores the full amount.' },
    { q: 'Do I get more Rent Assistance with three children?', a: `The maximum is higher with three or more children: ${audx(P.ra_family.max_3plus)} a year instead of ${audx(P.ra_family.max_1or2)}. The threshold does not change with the number of children, so a family paying a modest rent may see no difference; the extra applies only when the rent is high enough to reach the larger cap.` },
  ],
});

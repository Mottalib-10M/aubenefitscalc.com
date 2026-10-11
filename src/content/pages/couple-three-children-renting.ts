import { definePage } from '../../lib/page-types';
import type { Household } from '../../lib/engine/household';
import { P, aud, audx, household, faFortnight, raFamilyLimits } from '../../lib/kit';

const preset: Household = { couple: true, you: { age: 39, payment: 'none', incomeAnnual: 58000 }, partner: { age: 37, payment: 'none', incomeAnnual: 0 }, children: [{ age: 3 }, { age: 7 }, { age: 11 }], rentPf: 700, homeowner: false };
const r = household(preset);
const a = r.ftbA!, b = r.ftbB!;
const lim = raFamilyLimits(true, 3);
const rise = household({ ...preset, you: { ...preset.you, incomeAnnual: 90000 } });
const jsp = household({ ...preset, partner: { ...preset.partner!, payment: 'parenting' } });

export default definePage({
  id: 'couple-three-children-renting',
  group: 'cases',
  kind: 'case',
  order: 40,
  slug: 'households/couple-three-children-renting',
  nav: 'Couple, three children, renting',
  card: 'A modest single income, three children and high rent: Part A with the larger Rent Assistance.',
  title: 'Large Family Renting 2026: Three Children, One Modest Income',
  description: `Large family renting in 2026: a couple with three children on ${aud(58000)} gets about ${aud(r.fortnightTotal)} a fortnight, with the three-child Rent Assistance inside FTB Part A.`,
  h1: 'A couple with three children, renting on one income',
  intro: 'Matt earns $58,000; Leah is at home with their children aged 3, 7 and 11. They rent privately for $700 a fortnight.',
  resume: `A couple with three children aged 3, 7 and 11, renting at ${aud(700)} a fortnight on a single income of ${aud(58000)}, receives about ${aud(r.fortnightTotal)} a fortnight from Centrelink in 2026-27, and ${aud(r.endOfYear)} of supplements after the tax returns. Their income is under the Part A free area of ${aud(P.ftb.a_ifa)}, so Family Tax Benefit Part A is paid at the maximum rate for all three children, plus Rent Assistance at the higher maximum for three or more children, ${audx(P.ra_family.max_3plus)} a year, about ${aud(faFortnight(P.ra_family.max_3plus))} a fortnight. Part B is paid in full because the parent at home has no income. The Part A supplement is paid as well, because the family income is under ${aud(P.ftb.a_supplement_ati_limit)}. Nobody receives a main payment: the parent at home could claim Parenting Payment partnered while the youngest is under 6, and the page shows what that would add.`,
  preset,
  related: ['rent-assistance-for-families', 'family-tax-benefit-part-a', 'parenting-payment-partnered', 'family-tax-benefit-income-test', 'single-parent-two-children-renting'],
  sources: ['fag-ra', 'fag-ftb-rates', 'fag-ftb-m1', 'ssg-ppp-tests'],
  body: (h) => `
<h2>Three children, the bigger Rent Assistance</h2>
<p>Rent Assistance with Family Tax Benefit has two maximums: ${h.audx(P.ra_family.max_1or2)} a year with one or two children and ${h.audx(P.ra_family.max_3plus)} with three or more (${h.src('fag-ra', 'Family Assistance Guide 3.1.4.30')}). The couple threshold of ${h.audx(P.ra_family.threshold_couple)} a year applies either way. At ${h.aud(700)} a fortnight the family pays well over the ${h.aud(faFortnight(lim.rentForMaxAnnual))} a fortnight needed to reach the three-child maximum, so it receives the whole amount inside Part A. When the eldest stops counting for Family Tax Benefit, the maximum drops back to the two-child figure.</p>
<h2>Under the free area, everything at the maximum</h2>
<p>At ${h.aud(58000)} the family is below the Part A income free area, so no taper applies: three maximum child rates, the Part A supplement for each child at tax time, and the full Rent Assistance. Part A comes to ${h.aud(a.fortnight)} a fortnight including Rent Assistance, Part B to ${h.aud(b.fortnight)}. For a family in this position, Family Tax Benefit is a large share of household income, and the Part A supplements alone are worth ${h.aud(a.supplementPaid)} a year.</p>
<h2>A pay rise to $90,000</h2>
<p>If Matt's pay rose to ${h.aud(90000)}, the family would be ${h.aud(90000 - P.ftb.a_ifa)} above the free area. Method 1 would take 20 cents of each of those dollars, first from Rent Assistance, which sits above the base rate, and the Part A supplements would disappear because income passes ${h.aud(P.ftb.a_supplement_ati_limit)}. Family Tax Benefit would fall to about ${h.aud(rise.fortnightTotal)} a fortnight. The household still gains from the rise, but the gain is noticeably smaller than the pay rise itself.</p>
${h.box('Parenting Payment for the parent at home', `<p>Leah could claim Parenting Payment partnered while the youngest is under ${P.benefit.ppp.youngest_under}. Matt's ${h.aud(58000)}, about ${h.aud(58000 / 26)} a fortnight, is above the partner income free area, so her payment would be reduced by the partner test; the calculator gives a total of about ${h.aud(jsp.fortnightTotal)} a fortnight with it, against ${h.aud(r.fortnightTotal)} without. Because Family Tax Benefit is already at the maximum, the gain is just the Parenting Payment itself.</p>`)}`,
  faqs: [
    { q: 'Is Rent Assistance higher for a family with three children?', a: `Yes, the maximum is. With three or more children it is ${audx(P.ra_family.max_3plus)} a year instead of ${audx(P.ra_family.max_1or2)}, about ${aud(faFortnight(P.ra_family.max_3plus))} a fortnight. The rent threshold is the same, so the higher maximum only matters when rent is high enough to reach it, about ${aud(faFortnight(lim.rentForMaxAnnual))} a fortnight for a couple.` },
    { q: 'How much Family Tax Benefit for three children on $58,000?', a: `With children aged 3, 7 and 11 and one income of ${aud(58000)}, the maximum Part A for all three children plus full Part B, because the family is under the Part A free area and the other parent has no income. With private rent of ${aud(700)} a fortnight, the total is about ${aud(r.fortnightTotal)} a fortnight, plus supplements.` },
    { q: 'Does a pay rise reduce Rent Assistance for families?', a: `It can. With children, Rent Assistance is part of Family Tax Benefit Part A and is the first part reduced when family income passes ${aud(P.ftb.a_ifa)}. Once Part A is down to the base rate, no Rent Assistance remains. A family where one parent receives an income support payment keeps it in full.` },
  ],
});

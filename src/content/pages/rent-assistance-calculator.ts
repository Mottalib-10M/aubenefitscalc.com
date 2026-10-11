import { definePage } from '../../lib/page-types';
import { P, aud, audx, day, faFortnight, raSingleRate, raFamilyAnnual, raFamilyLimits } from '../../lib/kit';

const f2 = raFamilyLimits(false, 2);
const fp = (n: number) => audx(Math.round(faFortnight(n) * 100) / 100);
const singleAt = (r: number) => raSingleRate(r, 'single');

export default definePage({
  id: 'rent-assistance-calculator',
  group: 'housing',
  kind: 'pillar',
  order: 10,
  slug: 'rent-assistance-calculator',
  nav: 'Rent Assistance calculator',
  card: 'Commonwealth Rent Assistance for your rent, with or without children.',
  title: 'Rent Assistance Calculator 2026: Your Rent, Your Maximum',
  description: `Rent Assistance calculator with the rates of ${day(P.rates_date)}: 75 cents per dollar above the threshold, up to ${audx(P.ra_ss.single.max)} a fortnight single or more with children.`,
  h1: 'Rent Assistance calculator',
  intro: 'Commonwealth Rent Assistance for private renters, worked out on your rent with the thresholds and maximums of September 2026.',
  resume: `Commonwealth Rent Assistance pays 75 cents for each dollar of rent above a threshold, up to a maximum, and since ${day(P.rates_date)} a single person without children receives it once rent passes ${audx(P.ra_ss.single.threshold)} a fortnight, reaching the maximum of ${audx(P.ra_ss.single.max)} at a rent of ${audx(P.ra_ss.single.min_rent_for_max)}. It is not a payment you claim on its own: it is added to a pension, an allowance or Family Tax Benefit Part A. Families with children receive it inside Part A, with a threshold of ${audx(P.ra_family.threshold_single)} a year for a single parent and a maximum of ${audx(P.ra_family.max_1or2)} a year with one or two children, or ${fp(P.ra_family.max_1or2)} a fortnight. Sharers, couples and families with three or more children have their own rates. Public housing rent, and rent paid by a homeowner, do not count. The calculator below applies the right table to your situation.`,
  tool: 'ra',
  related: ['rent-assistance-for-families', 'rent-assistance-singles-and-sharers', 'rent-assistance-couples-and-pensioners', 'single-jobseeker-renting', 'single-pensioner-renting', 'family-tax-benefit-calculator'],
  sources: ['ssg-ra-rates', 'fag-ra', 'ss-act'],
  body: (h) => `
<h2>Two routes to the same payment</h2>
<p>Rent Assistance follows the main payment. Without children, it comes with JobSeeker, Youth Allowance, Austudy, Parenting Payment, the Age Pension, Carer Payment and other income support, and it is worked out per fortnight on the rates of the ${h.src('ssg-ra-rates', 'Social Security Guide 5.1.7.10')}. With at least one child for whom Family Tax Benefit Part A is paid above the base rate, it comes inside Part A instead, worked out on annual figures from the ${h.src('fag-ra', 'Family Assistance Guide 3.1.4.30')}. Toggle the children question in the calculator to switch from one to the other.</p>
${h.table(['Situation', 'Rent threshold', 'Maximum', 'Rent to reach the maximum'], [['Single, no children', h.audx(P.ra_ss.single.threshold), h.audx(P.ra_ss.single.max), h.audx(P.ra_ss.single.min_rent_for_max)], ['Single sharer', h.audx(P.ra_ss.sharer.threshold), h.audx(P.ra_ss.sharer.max), h.audx(P.ra_ss.sharer.min_rent_for_max)], ['Couple, no children (combined)', h.audx(P.ra_ss.couple.threshold), h.audx(P.ra_ss.couple.max), h.audx(P.ra_ss.couple.min_rent_for_max)], ['Single parent, 1 or 2 children', fp(P.ra_family.threshold_single), fp(P.ra_family.max_1or2), h.aud(faFortnight(f2.rentForMaxAnnual))], ['Couple, 3 or more children', fp(P.ra_family.threshold_couple), fp(P.ra_family.max_3plus), h.aud(faFortnight(raFamilyLimits(true, 3).rentForMaxAnnual))]], `Per fortnight, rates from ${day(P.rates_date)}. Family amounts are annual rates converted at 14 days out of 365.`, ['l', 'r', 'r', 'r'])}
<h2>Reading the result</h2>
<p>The figure in the result card is per fortnight, the way Centrelink pays it. With children, the table underneath also shows the annual threshold and maximum converted to fortnights, and the rent at which the maximum is reached: paying more than that rent brings no extra Rent Assistance.</p>
<h2>What counts as rent</h2>
<p>Rent paid to a private landlord, board and lodging, site fees for a caravan or a manufactured home, and mooring fees for a houseboat can all count. Rent paid to a state or territory housing authority does not, because public housing rent is already set as a share of income. A homeowner generally cannot get Rent Assistance even when paying for accommodation elsewhere, with exceptions for some care situations. Services Australia asks for a lease or a rent certificate before paying it.</p>
<h2>Why the amount can be lower than the calculator shows</h2>
<p>The calculator gives the gross Rent Assistance. When it is part of a payment that is reduced by an income test, Rent Assistance is reduced with it: for a pensioner, it is added to the maximum rate before the income and assets tests apply, which also lifts the point where the pension stops; for a family, it is the first part of Family Tax Benefit Part A to go as family income rises. A single person paying ${h.aud(300)} a fortnight receives about ${h.audx(Math.round(singleAt(300) * 100) / 100)} at full rate; the ${h.a('home', 'household calculator')} shows what is left after the tests.</p>
${h.box('One payment per household', `<p>Rent Assistance is never paid twice for the same rent. A couple where both partners receive a pension share one amount, half each; a family gets it once, inside Part A. See ${h.a('rent-assistance-couples-and-pensioners', 'couples and pensioners')} and ${h.a('rent-assistance-for-families', 'families')}.</p>`)}`,
  faqs: [
    { q: 'How much Rent Assistance will I get on a rent of $400 a fortnight?', a: `As a single person without children, about ${audx(Math.round(singleAt(400) * 100) / 100)} a fortnight: 75 cents for each dollar above the threshold of ${audx(P.ra_ss.single.threshold)}. As a single parent with one or two children it is worked out inside Family Tax Benefit Part A on annual figures, about ${aud(faFortnight(raFamilyAnnual(400, false, 2)))} a fortnight before the income test.` },
    { q: 'Can I get Rent Assistance if I work full time?', a: 'Only through a payment. Rent Assistance is added to a pension, an allowance or Family Tax Benefit Part A, so a single person working full time with no payment does not receive it. A family with children can, if its income still leaves Family Tax Benefit Part A above the base rate under Method 1.' },
    { q: 'Does Rent Assistance count as income?', a: 'No. Rent Assistance is not taxable and is not counted as income for any Centrelink income test. It is reduced, though, when the payment it is attached to is reduced: a pension cut back by the income test, or Family Tax Benefit Part A tapered by family income, carries Rent Assistance down with it.' },
    { q: 'Can I get Rent Assistance in public housing?', a: 'No. Rent paid to a state or territory housing authority is government rent and does not qualify, because public housing rents are already set according to income. Private rent, board and lodging, and site fees for a caravan or manufactured home can count instead, provided they are above the rent threshold for your situation.' },
    { q: 'When did Rent Assistance last increase?', a: `On ${day(P.rates_date)}, with the twice-yearly indexation to prices. The maximum rates had also been raised beyond indexation by 15% in September 2023 and 10% in September 2024. The next scheduled indexation is on ${day(P.next_indexation)}, when the thresholds and maximums move again.` },
    { q: 'Is Rent Assistance paid for boarding with family?', a: 'It can be, if you pay board and lodging under a genuine arrangement and the amount is above the rent threshold. Services Australia looks at whether the payment is for accommodation and whether the arrangement is commercial. Keep a written record of the amount and what it covers, since Services Australia verifies rent before paying.' },
  ],
});

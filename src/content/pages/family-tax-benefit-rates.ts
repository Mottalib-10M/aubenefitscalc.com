import { definePage } from '../../lib/page-types';
import { P, aud, audx, faFortnight, ftbACutoffs, ftbBCutoff, day } from '../../lib/kit';

const fp = (n: number) => audx(Math.round(faFortnight(n) * 100) / 100);
const wk = (n: number) => audx(Math.round((n / P.ftb.days_in_year) * 7 * 100) / 100);

export default definePage({
  id: 'family-tax-benefit-rates',
  group: 'families',
  kind: 'guide',
  order: 60,
  slug: 'family-tax-benefit-rates',
  nav: 'FTB rates table',
  card: 'Every 2026-27 FTB amount per year, per fortnight and per week, with the limits.',
  title: 'Family Tax Benefit Rates 2026-27: Per Fortnight and Per Year',
  description: `Family Tax Benefit rates for 2026-27 in one table: Part A ${fp(P.ftb.a_max_under13)} a fortnight per child under 13, Part B, base rate, supplements, Rent Assistance and limits.`,
  h1: 'Family Tax Benefit rates for 2026-27',
  intro: 'All the amounts in one place, converted the way Centrelink converts them, with the income limits that go with each.',
  resume: `For the 2026-27 income year, which started on 1 July 2026, the maximum rate of Family Tax Benefit Part A is ${audx(P.ftb.a_max_under13)} a year for each child under 13, or ${fp(P.ftb.a_max_under13)} a fortnight, and ${audx(P.ftb.a_max_13to19)} a year, or ${fp(P.ftb.a_max_13to19)} a fortnight, for each child of 13 to 19 at secondary school. The base rate is ${audx(P.ftb.a_base)} a year per child. Part B is ${audx(P.ftb.b_under5)} a year with a youngest child under 5 and ${audx(P.ftb.b_5to18)} from 5. The supplements add up to ${audx(P.ftb.a_supplement)} per child and ${audx(P.ftb.b_supplement)} per family after tax time. Fortnightly amounts are not the annual figure divided by 26: Family Tax Benefit is paid by the day, the annual rate divided by ${P.ftb.days_in_year}, and a fortnight is 14 of those days. All figures below come from the Family Assistance Guide.`,
  mini: 'ftbRates',
  related: ['family-tax-benefit-calculator', 'family-tax-benefit-part-a', 'family-tax-benefit-part-b', 'centrelink-payment-rates', 'centrelink-indexation-dates'],
  sources: ['fag-ftb-rates', 'fag-ra', 'fag-ftb-b'],
  body: (h) => `
<h2>Part A, per child</h2>
${h.table(['Rate', 'Per year', 'Per fortnight', 'Per week'], [['Maximum, child under 13', h.audx(P.ftb.a_max_under13), fp(P.ftb.a_max_under13), wk(P.ftb.a_max_under13)], ['Maximum, child 13 to 19 at school', h.audx(P.ftb.a_max_13to19), fp(P.ftb.a_max_13to19), wk(P.ftb.a_max_13to19)], ['Base rate, any age', h.audx(P.ftb.a_base), fp(P.ftb.a_base), wk(P.ftb.a_base)], ['Supplement, per child (after tax time)', h.audx(P.ftb.a_supplement), 'not paid fortnightly', '']], 'Family Assistance Guide 3.1.1.20, 2026-27 income year.', ['l', 'r', 'r', 'r'])}
<p>The maximum rate goes to families with a modest income and to every family receiving an income support payment. The base rate is what a family keeps in the middle income band, between ${h.aud(P.ftb.a_ifa)} and ${h.aud(P.ftb.a_hifa)}, once the 20 cent taper has removed everything above it. A child aged 16 to 19 is on the higher maximum only while in full-time secondary study.</p>
<p>The weekly column is there because many rental budgets and child care quotes are weekly; Centrelink itself never pays weekly. To turn a weekly figure back into what you will see, multiply by two for a fortnight. A newborn adds a child at the lower maximum from the day of birth, and the Newborn Supplement and Newborn Upfront Payment, which are separate amounts set each year, sit outside the rates on this page; ask Services Australia for the current figures if a baby is due.</p>
<h2>Part B, per family</h2>
${h.table(['Youngest child', 'Per year', 'Per fortnight', 'Supplement'], [['Under 5', h.audx(P.ftb.b_under5), fp(P.ftb.b_under5), h.audx(P.ftb.b_supplement)], ['5 to 12, couples', h.audx(P.ftb.b_5to18), fp(P.ftb.b_5to18), h.audx(P.ftb.b_supplement)], ['5 to 18 at school, single parents and grandparents', h.audx(P.ftb.b_5to18), fp(P.ftb.b_5to18), h.audx(P.ftb.b_supplement)]], 'Family Assistance Guide 3.1.1.20. Part B is nil for a couple whose youngest child is 13 or older.', ['l', 'r', 'r', 'r'])}
<h2>Rent Assistance paid with Part A</h2>
${h.table(['Family', 'Rent threshold per year', 'Maximum per year', 'Maximum per fortnight'], [['Single parent, 1 or 2 children', h.audx(P.ra_family.threshold_single), h.audx(P.ra_family.max_1or2), fp(P.ra_family.max_1or2)], ['Single parent, 3 or more', h.audx(P.ra_family.threshold_single), h.audx(P.ra_family.max_3plus), fp(P.ra_family.max_3plus)], ['Couple, 1 or 2 children', h.audx(P.ra_family.threshold_couple), h.audx(P.ra_family.max_1or2), fp(P.ra_family.max_1or2)], ['Couple, 3 or more', h.audx(P.ra_family.threshold_couple), h.audx(P.ra_family.max_3plus), fp(P.ra_family.max_3plus)]], 'Family Assistance Guide 3.1.4.30, from 20 September 2026. 75 cents per dollar of rent above the threshold, up to the maximum.', ['l', 'r', 'r', 'r'])}
<p>Rent Assistance is the only part of Family Tax Benefit that moved on ${h.day(P.rates_date)}; the other amounts are fixed for the whole income year and change again on 1 July 2027.</p>
<h2>The limits that go with the rates</h2>
${h.table(['Limit', 'Amount', 'Effect'], [['Part A income free area', h.aud(P.ftb.a_ifa), '20 cents per dollar above, down to the base rate'], ['Part A higher income free area', h.aud(P.ftb.a_hifa), '30 cents per dollar above, base rate included'], ['Part A supplement limit', h.aud(P.ftb.a_supplement_ati_limit), 'no supplement above'], ['Part B primary earner limit', h.aud(P.ftb.b_primary_limit), 'no Part B above'], ['Part B lower earner free area', h.aud(P.ftb.b_ifa), '20 cents per dollar above'], ['Maintenance income free area, single parent', h.audx(P.ftb.mifa_single), `plus ${h.audx(P.ftb.mifa_extra_child)} per extra child`]], 'Family Assistance Guide 3.1.1.20, 2026-27.', ['l', 'r', 'l'])}
<h2>Where the rates run out</h2>
<p>For one child under 13, Part A reaches the base rate at about ${h.aud(ftbACutoffs([6]).baseReachedAt)} of family income and stops at about ${h.aud(ftbACutoffs([6]).nilAt)}; for three children aged 2, 8 and 14, the corresponding figures are about ${h.aud(ftbACutoffs([2, 8, 14]).baseReachedAt)} and ${h.aud(ftbACutoffs([2, 8, 14]).nilAt)}. Part B stops when the lower earner reaches about ${h.aud(ftbBCutoff(2))} with a youngest child under 5, or ${h.aud(ftbBCutoff(8))} from 5. These points are worked out by the engine from the rates in the tables; your own figures come from the ${h.a('family-tax-benefit-calculator', 'Family Tax Benefit calculator')}.</p>
<h2>Reading your Centrelink statement against these rates</h2>
<p>A payment summary in your Centrelink online account shows Family Tax Benefit for each fortnight, usually split into Part A and Part B. If your figure is exactly the maximum fortnightly rate for your children's ages, your family is either below the income free area or receiving an income support payment. If it equals the number of children times the base rate, you are in the middle band. Anything between means the 20 cent taper is working on your estimate. A figure that seems too low for your situation often comes from an income estimate that still includes a job you have left, or from a child whose care arrangements were recorded as shared.</p>
<p>Remember that the fortnightly figure excludes the supplements, and that Rent Assistance is folded into Part A rather than shown separately on some statements. Divide your Part A by your number of children before comparing it with the per-child rates above, and subtract Rent Assistance first if you rent.</p>
<h2>Shared care and the rates</h2>
<p>The rates on this page assume each child lives with you full time. When care is shared between separated parents, each parent with at least 35% care receives a share of the child's rate matching the care percentage, and a parent with less than 35% care may still receive Rent Assistance for that child as a regular care child. The calculators on this site do not apply care percentages; the rates here remain the starting point that Services Australia applies them to.</p>
<h2>A note on the Energy Supplement</h2>
<p>Older Centrelink letters may show an Energy Supplement inside Family Tax Benefit. It closed to new families on 20 March 2017 and is not indexed; only families who were already receiving it under the grandfathering rules still get it. The amounts on this page leave it out, as they would for any family claiming today. See ${h.a('energy-and-pension-supplements', 'Energy and Pension Supplements')}.</p>`,
  faqs: [
    { q: 'Why is my fortnightly FTB not the annual rate divided by 26?', a: `Because Family Tax Benefit is a daily payment. The annual rate is divided by ${P.ftb.days_in_year} to give a daily rate, and each fortnightly instalment is 14 days of it. That gives ${fp(P.ftb.a_max_under13)} for a child under 13, slightly more than one twenty-sixth of the annual ${audx(P.ftb.a_max_under13)}, since a year has a little more than 26 fortnights.` },
    { q: 'When do Family Tax Benefit rates change next?', a: `The Part A and Part B amounts, the income free areas and the supplements are set for the income year from 1 July and change on 1 July 2027. Rent Assistance paid with Part A is indexed separately, on 20 March and 20 September; it moved on ${day(P.rates_date)} and moves again on ${day(P.next_indexation)}.` },
    { q: 'Is the Family Tax Benefit base rate the same for every age?', a: `Yes. The base rate is ${audx(P.ftb.a_base)} a year per child, about ${fp(P.ftb.a_base)} a fortnight, whether the child is a baby or a 17-year-old at school. Only the maximum rate depends on age, with a higher amount from the 13th birthday. Families in the middle income band are paid the base rate.` },
  ],
});

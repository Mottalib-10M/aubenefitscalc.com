import { definePage } from '../../lib/page-types';
import { P, aud, audx, day, ssFortnight, raSingleRate } from '../../lib/kit';

const x = (n: number) => audx(Math.round(n * 100) / 100);
const p = P.pension;
const psS = ssFortnight(p.ps_single_pa), esS = ssFortnight(p.es_single_pa);
const psC = ssFortnight(p.ps_couple_each_pa), esC = ssFortnight(p.es_couple_each_pa);

export default definePage({
  id: 'age-pension-rates',
  group: 'older',
  kind: 'guide',
  order: 20,
  slug: 'age-pension-rates',
  nav: 'Age Pension rates',
  card: 'The September 2026 rates, single and couple, with each supplement broken out.',
  title: 'Age Pension Rates 2026: Single and Couple from 20 September',
  description: `Age Pension rates from ${day(P.rates_date)}: ${audx(p.max_single)} a fortnight single and ${audx(p.max_couple_each)} each for a couple, with the basic rate and both supplements broken out.`,
  h1: 'Age Pension rates from 20 September 2026',
  intro: 'The full rates, what each part is, and how much a renter adds with Rent Assistance.',
  resume: `From ${day(P.rates_date)} until 19 March 2027, the full Age Pension is ${audx(p.max_single)} a fortnight for a single person and ${audx(p.max_couple_each)} a fortnight for each member of a couple, ${audx(2 * p.max_couple_each)} combined. For a single pensioner, that total is made of a maximum basic rate of ${audx(p.mbr_single)}, a Pension Supplement of ${x(psS)} and an Energy Supplement of ${x(esS)}; for each member of a couple, ${audx(p.mbr_couple_each)}, ${x(psC)} and ${x(esC)}. Over a year the single rate comes to about ${aud(p.max_single * 26)} and the couple rate to about ${aud(2 * p.max_couple_each * 26)}. A pensioner who rents privately also receives Rent Assistance, up to ${audx(P.ra_ss.single.max)} a fortnight for a single person. A couple separated by illness, in respite care or with a partner in prison is each paid the single rate. The same rates apply to Carer Payment and to the Disability Support Pension for people aged 21 or over.`,
  mini: 'pensionRates',
  related: ['age-pension-calculator', 'energy-and-pension-supplements', 'centrelink-indexation-dates', 'age-pension-income-test', 'carer-payment-calculator'],
  sources: ['ssg-common-pension', 'ssg-ps-rates', 'ssg-es-rates'],
  body: (h) => `
<h2>The rates, part by part</h2>
${h.table(['', 'Single', 'Couple, each', 'Couple, combined'], [['Maximum basic rate', h.audx(p.mbr_single), h.audx(p.mbr_couple_each), x(2 * p.mbr_couple_each)], ['Pension Supplement', x(psS), x(psC), x(2 * psC)], ['Energy Supplement', x(esS), x(esC), x(2 * esC)], ['Total per fortnight', h.audx(p.max_single), h.audx(p.max_couple_each), h.audx(2 * p.max_couple_each)], ['Total per year', h.aud(p.max_single * 26), h.aud(p.max_couple_each * 26), h.aud(2 * p.max_couple_each * 26)]], `Social Security Guide 5.1.8.10, 5.1.9.10 and 5.1.10.20; rates from ${day(P.rates_date)}. Supplements converted from their annual amounts at 26 fortnights.`, ['l', 'r', 'r', 'r'])}
<h2>What each part is for</h2>
<p>The <strong>maximum basic rate</strong> is the core of the pension and the part that is benchmarked to wages: it is indexed to the higher of price and wage growth, which keeps it in line with living standards. The <strong>Pension Supplement</strong>, ${h.audx(p.ps_single_pa)} a year for a single person, replaced several older allowances in 2009, such as the Pharmaceutical Allowance and the Telephone Allowance; a minimum part of it can be paid quarterly (${h.src('ssg-ps-rates', 'Social Security Guide 5.1.9.10')}). The <strong>Energy Supplement</strong>, ${h.audx(p.es_single_pa)} a year for a single person, compensated for energy price rises in 2013 and has not been indexed since 2014 (${h.src('ssg-es-rates', 'Social Security Guide 5.1.10.20')}).</p>
<h2>Why a couple receives less than two singles</h2>
<p>Each member of a couple receives ${h.audx(p.max_couple_each)}, about ${Math.round((p.max_couple_each / p.max_single) * 100)}% of the single rate, and the couple together about ${Math.round(((2 * p.max_couple_each) / p.max_single) * 100)}% of one single pension. The difference reflects shared housing and household costs. When a couple is separated by illness, for instance when one partner moves into residential aged care, each partner is paid the single rate, while the income and assets tests still look at the couple together (${h.src('ssg-common-pension', 'Social Security Guide 5.1.8.10')}).</p>
${h.box('Renters receive more', `<p>Rent Assistance is added for pensioners who pay private rent: 75 cents for each dollar of rent above ${h.audx(P.ra_ss.single.threshold)} a fortnight for a single person, up to ${h.audx(P.ra_ss.single.max)}. A single pensioner paying ${h.aud(420)} a fortnight receives ${x(raSingleRate(420, 'single'))} on top of the pension. See ${h.a('rent-assistance-couples-and-pensioners', 'Rent Assistance for pensioners')}.</p>`)}
<h2>Pensioners overseas and transitional rates</h2>
<p>A pensioner who lives overseas, or is temporarily absent for more than 12 weeks, is paid the basic rate only, ${h.audx(p.mbr_single)} for a single person, without the supplements; the Energy Supplement stops after 6 weeks of absence. After 26 weeks overseas, many pensioners move to a proportional rate based on their years of working-life residence in Australia. A small group of people who were already pensioners on 19 September 2009 remain on transitional rates under the old income test until they are better off on the new rules.</p>
<h2>How much the rate has moved</h2>
<p>Pension rates are indexed twice a year to the higher of two measures of price growth, the consumer price index and the pensioner and beneficiary living cost index, and the combined couple rate is then benchmarked to at least 41.76% of male total average weekly earnings, which carries wage growth into the pension over time. In practice the September and March changes are a few dollars a fortnight each, larger when prices or wages rise quickly. Because the Energy Supplement is a fixed dollar amount, it is the only part that does not change; the basic rate and the Pension Supplement move at each indexation.</p>
<p>The same rates apply on the same dates to Carer Payment and to the Disability Support Pension for people aged 21 or over, so a household with a pensioner and a carer sees both payments move together. Parenting Payment single moves on the same dates but from a different starting point. JobSeeker and Rent Assistance are indexed on the same two dates too, but to prices only, which is why the gap between the pension and JobSeeker has widened over the years and continues to widen at each review.</p>
<h2>Part pensions</h2>
<p>These are maximum rates. Most pensioners receive a part pension because of the income test or the assets test, and when that happens all three parts are reduced together. A part pensioner keeps the Pensioner Concession Card, which often matters as much as the pension itself. The ${h.a('age-pension-calculator', 'Age Pension calculator')} works out your own rate.</p>`,
  faqs: [
    { q: 'What is the Age Pension for a couple per fortnight?', a: `From ${day(P.rates_date)}, ${audx(p.max_couple_each)} a fortnight for each member of a couple, ${audx(2 * p.max_couple_each)} combined, including the Pension and Energy Supplements. A couple separated by illness, in respite care, or with a partner in prison, is paid the single rate of ${audx(p.max_single)} each.` },
    { q: 'How much is the Age Pension per year?', a: `About ${aud(p.max_single * 26)} for a single person and ${aud(2 * p.max_couple_each * 26)} for a couple combined at the full rate, counting 26 fortnights. The rate changes on 20 March and 20 September, so the amount actually received over a calendar year is a mix of two or three rates.` },
    { q: 'Is the Pension Supplement included in the Age Pension?', a: `Yes. The full rate of ${audx(p.max_single)} includes the Pension Supplement of ${audx(p.ps_single_pa)} a year for a single person, paid with each fortnightly instalment. Pensioners can choose to receive the minimum Pension Supplement amount quarterly instead. It stops after 12 weeks overseas, along with the Energy Supplement.` },
  ],
});

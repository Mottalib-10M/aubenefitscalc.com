import { definePage } from '../../lib/page-types';
import { P, aud, audx, day, faFortnight, ssFortnight, aud2 } from '../../lib/kit';

const x = (n: number) => audx(Math.round(n * 100) / 100);
const J = P.benefit.jsp;
const ss: Array<[string, number, string]> = [
  ['Age Pension, single', P.pension.max_single, 'supplements included'],
  ['Age Pension, couple (each)', P.pension.max_couple_each, 'supplements included'],
  ['Carer Payment, single', P.pension.max_single, 'as Age Pension'],
  ['Parenting Payment single', P.pps.max, 'pension supplement basic amount and Energy Supplement included'],
  ['JobSeeker, single, no children', J.single, `plus ${x(ssFortnight(J.es_single_pa))} Energy Supplement`],
  ['JobSeeker, single with a child, or 55+ after 9 months', J.single_children, `plus ${x(ssFortnight(J.es_single_children_pa))} Energy Supplement`],
  ['JobSeeker or Parenting Payment, partnered (each)', J.partnered, `plus ${x(ssFortnight(J.es_partnered_pa))} Energy Supplement`],
  ['Youth Allowance, under 18 at home', P.ya.rates.under18_home, `plus ${x(ssFortnight(P.ya.es_pa.under18_home))} Energy Supplement`],
  ['Youth Allowance, 18+ at home', P.ya.rates.over18_home, `plus ${x(ssFortnight(P.ya.es_pa.over18_home))} Energy Supplement`],
  ['Youth Allowance, away from home', P.ya.rates.away, `plus ${x(ssFortnight(P.ya.es_pa.over18_away))} Energy Supplement`],
  ['Austudy, single', P.ya.austudy.single, `plus ${x(ssFortnight(P.ya.austudy.es_single_pa))} Energy Supplement`],
  ['Carer Allowance', P.carer.allowance_pf, 'flat rate'],
  ['Rent Assistance, single maximum', P.ra_ss.single.max, `rent above ${x(P.ra_ss.single.threshold)}`],
  ['Rent Assistance, couple maximum', P.ra_ss.couple.max, `rent above ${x(P.ra_ss.couple.threshold)}`],
];
const fam: Array<[string, string, string]> = [
  ['FTB Part A, child under 13 (maximum)', x(faFortnight(P.ftb.a_max_under13)), audx(P.ftb.a_max_under13)],
  ['FTB Part A, child 13 to 19 at school (maximum)', x(faFortnight(P.ftb.a_max_13to19)), audx(P.ftb.a_max_13to19)],
  ['FTB Part A, base rate per child', x(faFortnight(P.ftb.a_base)), audx(P.ftb.a_base)],
  ['FTB Part B, youngest under 5', x(faFortnight(P.ftb.b_under5)), audx(P.ftb.b_under5)],
  ['FTB Part B, youngest 5 or over', x(faFortnight(P.ftb.b_5to18)), audx(P.ftb.b_5to18)],
  ['Rent Assistance with FTB, 1 or 2 children (maximum)', x(faFortnight(P.ra_family.max_1or2)), audx(P.ra_family.max_1or2)],
  ['Parental Leave Pay (per day)', audx(P.ppl.daily), `${P.ppl.max_days} days at most`],
];

export default definePage({
  id: 'centrelink-payment-rates',
  group: 'guides',
  kind: 'guide',
  order: 10,
  slug: 'centrelink-payment-rates',
  nav: 'All payment rates',
  card: 'Every main Centrelink and family payment rate on one page, with its source.',
  title: 'Centrelink Payment Rates 2026: Every Rate in One Table',
  description: `Centrelink payment rates from ${day(P.rates_date)}: Age Pension ${audx(P.pension.max_single)}, JobSeeker ${audx(J.single)}, Parenting Payment, Youth Allowance, FTB and more, in one table.`,
  h1: 'Centrelink payment rates, all in one place',
  intro: 'The maximum fortnightly rate of each main payment, with the date it took effect and the guide section it comes from.',
  resume: `From ${day(P.rates_date)}, the full Age Pension and Carer Payment are ${audx(P.pension.max_single)} a fortnight for a single person and ${audx(P.pension.max_couple_each)} each for a couple; Parenting Payment single is ${audx(P.pps.max)}; JobSeeker is ${audx(J.single)} for a single adult without children, ${audx(J.single_children)} with a dependent child and ${audx(J.partnered)} each for a couple, before the Energy Supplement; Youth Allowance for a student living away from home is ${audx(P.ya.rates.away)} and Carer Allowance ${audx(P.carer.allowance_pf)}. Family Tax Benefit for the 2026-27 income year pays up to ${x(faFortnight(P.ftb.a_max_under13))} a fortnight per child under 13 in Part A and up to ${x(faFortnight(P.ftb.b_under5))} in Part B. Rent Assistance reaches ${audx(P.ra_ss.single.max)} for a single person without children. These are maximum rates: income and assets tests reduce most of them, and Family Tax Benefit is also reduced by family income unless a parent receives income support. Pensions and allowances move again on ${day(P.next_indexation)}.`,
  mini: 'rateFinder',
  related: ['home', 'age-pension-rates', 'jobseeker-payment-rates', 'family-tax-benefit-rates', 'centrelink-indexation-dates', 'energy-and-pension-supplements'],
  sources: ['ssg-common-pension', 'ssg-common-benefit', 'ssg-ya-rates', 'ssg-ra-rates', 'fag-ftb-rates', 'ppl-rate'],
  body: (h) => `
<h2>Pensions and allowances, per fortnight</h2>
${h.table(['Payment', 'Maximum per fortnight', 'Note'], ss.map(([l, v, n]) => [l, x(v), n]), `Social Security Guide 5.1.1.20, 5.1.2.30, 5.1.5.50, 5.1.7.10, 5.1.8.10, 5.1.8.20 and 5.1.10.20. Pensions, JobSeeker, Parenting Payment and Rent Assistance from ${day(P.rates_date)}; Youth Allowance, Austudy and Carer Allowance from 1 January 2026.`, ['l', 'r', 'l'])}
<h2>Family payments</h2>
${h.table(['Payment', 'Per fortnight', 'Per year'], fam, 'Family Assistance Guide 3.1.1.20 and 3.1.4.30, 2026-27 income year; Paid Parental Leave Guide 3.1, from 1 July 2026. Fortnightly FTB amounts are the annual rate divided by 365, times 14, without supplements.', ['l', 'r', 'r'])}
<p>Child Care Subsidy is not a fortnightly amount but a percentage of fees: ${P.ccs.max_pct}% up to ${h.aud(P.ccs.lower_threshold)} of family income, up to the hourly cap of ${aud2(P.ccs.caps.cbdc_below_school)} for day care before school, for at least ${P.ccs.hours_base} hours a fortnight.</p>
<h2>Reading the tables</h2>
<p>Each figure is a maximum: what a person receives with no other income and assets under the free areas. Most recipients receive less, because the income test reduces pensions by 50 cents per dollar above the free area (25 cents each for a couple), Parenting Payment single by 40 cents, and allowances by 50 then 60 cents. Family Tax Benefit is reduced by family income unless a parent receives income support, in which case the maximum is paid. A few figures are paid in addition to others: Rent Assistance with a pension or allowance, Carer Allowance alongside almost anything, Family Tax Benefit with every payment.</p>
<p>The amounts include what Centrelink calls supplements where the guide includes them in the maximum rate. For pensions, that is the Pension Supplement and the Energy Supplement; for Parenting Payment single, the pension supplement basic amount and the Energy Supplement. For allowances, the Energy Supplement is shown separately in the note column, because the guide lists the basic rate on its own.</p>
${h.box('Why some figures look odd', `<p>Family Tax Benefit is set as an annual amount and paid by the day, so its fortnightly figure is not one twenty-sixth of the year. Youth Allowance, Austudy and Carer Allowance are indexed on 1 January, not in March and September, so they did not move on ${h.day(P.rates_date)}. Parenting Payment single is benchmarked to wages as well as prices, which is why it is higher than the "single with children" rate of JobSeeker.</p>`)}
<h2>From rates to your amount</h2>
<p>The rate table answers "how much at most?". The question most households need answered is "how much for us, all together?", which depends on how the payments interact: an income support payment lifts Family Tax Benefit to the maximum, Rent Assistance is paid once, a partner's income counts differently for each payment. The ${h.a('home', 'household calculator')} applies those rules to your figures, and each payment has its own calculator and guide in the menus.</p>
<h2>Three households, three totals</h2>
<p>Rates on their own say little about what a household receives. A single pensioner who owns her home and has modest savings receives the single rate above and nothing else. A single parent on Parenting Payment with two children under 13 who rents receives Parenting Payment, the maximum of both parts of Family Tax Benefit and Rent Assistance through Part A, which together come to roughly double the Parenting Payment rate alone. A couple where one partner works full time and the other is at home with a toddler may receive no main payment at all but still some Family Tax Benefit and, if the toddler goes to day care, Child Care Subsidy. Each of these is worked through on its own page in the household examples.</p>
<p>The rates also change at different moments. A household combining a pension, Family Tax Benefit and Youth Allowance for an older child sees three separate changes over the year: in January for the student payment, in July for the family payment, and in March and September for the pension. Keeping the rate table and the dates side by side avoids surprises when one payment moves and the others do not.</p>
<h2>When these rates change</h2>
<p>Pensions, JobSeeker, Parenting Payment and Rent Assistance are indexed on 20 March and 20 September; Youth Allowance, Austudy and Carer Allowance on 1 January; Family Tax Benefit, Child Care Subsidy thresholds and caps, Paid Parental Leave and the pension free areas on 1 July. See ${h.a('centrelink-indexation-dates', 'indexation dates')} for what moves when.</p>`,
  faqs: [
    { q: 'What are the Centrelink payment rates from 20 September 2026?', a: `The full Age Pension is ${audx(P.pension.max_single)} a fortnight single and ${audx(P.pension.max_couple_each)} each for a couple; Parenting Payment single ${audx(P.pps.max)}; JobSeeker ${audx(J.single)} single without children before the Energy Supplement; the single Rent Assistance maximum ${audx(P.ra_ss.single.max)}. Youth Allowance, Austudy and Carer Allowance did not change in September.` },
    { q: 'Which Centrelink payment pays the most?', a: `Among the main payments, the Age Pension, Carer Payment and Disability Support Pension for adults pay the most: ${audx(P.pension.max_single)} a fortnight for a single person. Parenting Payment single follows at ${audx(P.pps.max)}. Families can receive Family Tax Benefit and Rent Assistance on top of any of them, which often matters more than the choice of payment.` },
    { q: 'Are Centrelink rates per week or per fortnight?', a: 'Per fortnight. Pensions and allowances are paid fortnightly in arrears, and published as fortnightly rates. Family Tax Benefit is set as an annual amount and paid fortnightly at 14 days of the daily rate. Parental Leave Pay has a daily rate, paid in fortnightly instalments. Divide by two for a weekly budget.' },
  ],
});

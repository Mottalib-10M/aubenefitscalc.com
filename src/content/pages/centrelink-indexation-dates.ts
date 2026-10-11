import { definePage } from '../../lib/page-types';
import { P, aud, audx, day } from '../../lib/kit';

const rows: Array<[string, string, string]> = [
  ['1 January', 'Youth Allowance, Austudy and their income free areas, the student income bank, Carer Allowance', 'consumer price index'],
  ['20 March', 'Age Pension, Carer Payment, Parenting Payment, JobSeeker, Rent Assistance, Pension Supplement, deeming rates when reviewed', 'prices, and wages for pensions'],
  ['1 July', 'Family Tax Benefit rates and income free areas, Child Care Subsidy thresholds and hourly caps, pension income and assets free areas, deeming thresholds, Parental Leave Pay and its income limits', 'consumer price index, minimum wage for Parental Leave Pay'],
  ['20 September', 'Age Pension, Carer Payment, Parenting Payment, JobSeeker, Rent Assistance, Pension Supplement, deeming rates when reviewed', 'prices, and wages for pensions'],
];

export default definePage({
  id: 'centrelink-indexation-dates',
  group: 'guides',
  kind: 'guide',
  order: 30,
  slug: 'centrelink-indexation-dates',
  nav: 'Indexation dates',
  card: 'Which payments move on 1 January, 20 March, 1 July and 20 September.',
  title: 'Centrelink Indexation Dates 2026-27: When Payments Increase',
  description: `Centrelink indexation dates: pensions and JobSeeker move on 20 March and 20 September, family payments on 1 July, students on 1 January. Latest: ${day(P.rates_date)}.`,
  h1: 'When Centrelink payments increase',
  intro: 'Four dates a year, each moving a different group of payments. What changed on 20 September 2026 and what moves next.',
  resume: `Centrelink payments do not all rise on the same day. Pensions, Parenting Payment, JobSeeker and Rent Assistance are indexed twice a year, on 20 March and 20 September, the latest change being on ${day(P.rates_date)} and the next on ${day(P.next_indexation)}. Family Tax Benefit, the Child Care Subsidy thresholds and hourly caps, the pension income and assets free areas and Parental Leave Pay change once a year, on 1 July. Youth Allowance, Austudy and Carer Allowance change on 1 January. Most of these increases follow the consumer price index; the pension rates are also kept in line with wages, which is why they tend to rise faster than allowances over time. The Energy Supplement and the Carer Allowance income limit are not indexed at all. An indexation increase is applied automatically: nobody needs to claim it, and the first payment at the new rate is usually only part-increased, because payments are made in arrears.`,
  mini: 'indexation',
  related: ['centrelink-payment-rates', 'age-pension-rates', 'jobseeker-payment-rates', 'family-tax-benefit-rates', 'energy-and-pension-supplements'],
  sources: ['ssg-common-pension', 'ssg-common-benefit', 'ssg-ya-rates', 'fag-ftb-rates', 'ssg-ra-rates'],
  body: (h) => `
<h2>The calendar</h2>
${h.table(['Date', 'What moves', 'Measure'], rows, 'Social Security Guide 5.1.1.20, 5.1.7.10, 5.1.8.10, 5.1.8.20, 5.1.9.10, 5.1.5.50 and 4.4.1.10; Family Assistance Guide 3.1.1.20 and 3.5.1; Paid Parental Leave Guide 3.1 and 2.3.4.', ['l', 'l', 'l'])}
<h2>March and September: pensions and allowances</h2>
<p>The two big dates are 20 March and 20 September. On each, the pensions, Parenting Payment, JobSeeker and Rent Assistance move with the consumer price index over the previous six months: the September change uses prices from December to June, the March change from June to December (${h.src('ssg-common-benefit', 'Social Security Guide 5.1.8.20')}). The pension rates and Parenting Payment single have a second rule: their basic rate is lifted further if wages have grown faster than prices, which keeps pensions tied to living standards. JobSeeker and Rent Assistance follow prices only.</p>
<p>On ${h.day(P.rates_date)}, the single Age Pension became ${h.audx(P.pension.max_single)} a fortnight, JobSeeker for a single adult ${h.audx(P.benefit.jsp.single)} before the Energy Supplement, and the single Rent Assistance maximum ${h.audx(P.ra_ss.single.max)}. The deeming rates rose half a point to ${P.deeming.lower_rate}% and ${P.deeming.upper_rate}% on the same day; deeming rates are not indexed but set by the Minister, often on these dates.</p>
<h2>1 July: family payments and limits</h2>
<p>Family Tax Benefit is fixed for a whole income year, from 1 July to 30 June: the 2026-27 amounts, such as ${h.audx(P.ftb.a_max_under13)} a year per child under 13 in Part A, apply until 30 June 2027. The Child Care Subsidy thresholds and hourly caps also move each 1 July, with the caps taking effect from the first Monday of the CCS year. Rent Assistance paid with Family Tax Benefit is the exception: it follows the March and September indexation like other Rent Assistance (${h.src('fag-ftb-rates', 'Family Assistance Guide 3.1.1.20')}).</p>
<p>Several limits used by the pension and allowance tests move on 1 July too: the income free areas, the assets free areas and the deeming thresholds. A pensioner can therefore see two changes a few weeks apart, a higher free area in July and a higher rate in September.</p>
<h2>1 January: students and carers</h2>
<p>Youth Allowance, Austudy, the student income free area of ${h.aud(P.ya.student_ifa)}, the student income bank limit and Carer Allowance are indexed once a year, on 1 January (${h.src('ssg-ya-rates', 'Social Security Guide 5.1.1.20')}). A student will therefore see no change in September; the rates shown on this site for students are those of 1 January 2026, and the next change is on 1 January 2027.</p>
${h.box('What is never indexed', `<p>The Energy Supplement has been frozen in dollars since 2014, so it shrinks in real terms every year. The Carer Allowance income limit of ${h.aud(P.carer.allowance_income_limit)} is fixed in law. Some one-off amounts are set by each Budget rather than indexed.</p>`)}
<h2>Budget measures on top of indexation</h2>
<p>Indexation keeps payments level with prices; increases beyond that come from Budget decisions and have their own start dates. Rent Assistance maximums, for example, were raised by 15% on 20 September 2023 and by another 10% on 20 September 2024, on top of the usual indexation (${h.src('ssg-ra-rates', 'Social Security Guide 5.1.7.10')}). The Paid Parental Leave entitlement grew by 10 days each 1 July from 2024 to 2026. Such changes are written into the guides once they are law; a measure announced but not yet legislated is not applied on this site until it takes effect.</p>
<h2>When the new rate reaches your account</h2>
<p>Payments are made fortnightly in arrears, so the payment that covers a fortnight straddling the indexation date is paid partly at the old rate and partly at the new one. The first full payment at the new rate arrives in the following fortnight. Nothing needs to be done to receive the increase; the new rate appears in your Centrelink online account, often with a letter. Payment dates themselves depend on your own payday and are not covered here.</p>`,
  faqs: [
    { q: 'When does the Age Pension go up next?', a: `On ${day(P.next_indexation)}, with the March indexation. The Age Pension is indexed on 20 March and 20 September each year; the latest change was on ${day(P.rates_date)}, when the full single rate became ${audx(P.pension.max_single)} a fortnight. Pension income and assets free areas move separately on 1 July.` },
    { q: 'When does Family Tax Benefit increase?', a: 'On 1 July each year, for the income year that starts that day. The Part A and Part B rates, the supplements and the income free areas are fixed for the whole year. Rent Assistance paid with Family Tax Benefit is the exception and is indexed on 20 March and 20 September with other Rent Assistance.' },
    { q: 'Why did my Youth Allowance not go up in September?', a: 'Because Youth Allowance and Austudy are indexed once a year, on 1 January, not on 20 March and 20 September like pensions and JobSeeker. The student income free area and the income bank limit move on the same January date. Rent Assistance paid with Youth Allowance does move in March and September.' },
  ],
});

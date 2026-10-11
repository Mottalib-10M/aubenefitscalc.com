import { definePage } from '../../lib/page-types';
import { P, aud, audx, day, jobseeker, ssFortnight } from '../../lib/kit';

const x = (n: number) => audx(Math.round(n * 100) / 100);
const J = P.benefit.jsp;
const cases: Array<[string, Parameters<typeof jobseeker>[0], number, number]> = [
  ['Single, no children', { couple: false, children: false, incomePf: 0 }, J.single, J.es_single_pa],
  ['Single, with a dependent child', { couple: false, children: true, incomePf: 0 }, J.single_children, J.es_single_children_pa],
  ['Single, 55 or over, after 9 months on payment', { couple: false, children: false, incomePf: 0, over55NineMonths: true }, J.single_55_9months, J.es_single_children_pa],
  ['Single principal carer with an exemption', { couple: false, children: true, incomePf: 0, principalCarerExempt: true }, J.principal_carer_exempt, P.pps.es_pa],
  ['Partnered, each', { couple: true, children: false, incomePf: 0 }, J.partnered, J.es_partnered_pa],
];
const rows = cases.map(([l, i, basic, es]) => { const r = jobseeker(i); return [l, x(basic), x(ssFortnight(es)), x(r.rate), aud(r.rate * 26)]; });
const gap = J.single_children - J.single;

export default definePage({
  id: 'jobseeker-payment-rates',
  group: 'work',
  kind: 'guide',
  order: 20,
  slug: 'jobseeker-payment-rates',
  nav: 'JobSeeker rates',
  card: 'Every JobSeeker rate since 20 September 2026, with the Energy Supplement.',
  title: 'JobSeeker Rates 2026: Single, Partnered and Principal Carer',
  description: `JobSeeker rates from ${day(P.rates_date)}: ${audx(J.single)} single, ${audx(J.single_children)} with a child or at 55+, ${audx(J.partnered)} partnered each, plus the Energy Supplement on top of each.`,
  h1: 'JobSeeker Payment rates from September 2026',
  intro: 'Five maximum rates, each with its own Energy Supplement, and what decides which one applies to you.',
  resume: `Since ${day(P.rates_date)}, the maximum basic rate of JobSeeker Payment is ${audx(J.single)} a fortnight for a single person without children, ${audx(J.single_children)} for a single person with a dependent child, for a single person aged 55 or over who has been on payment for nine continuous months, and for a single person with a partial capacity to work of 0 to 14 hours a week, and ${audx(J.partnered)} for each member of a couple. A single principal carer with an exemption from mutual obligations because of a large family, foster care, home schooling or distance education receives ${audx(J.principal_carer_exempt)}, the rate of Parenting Payment single. Each rate is topped up by an Energy Supplement, ${x(ssFortnight(J.es_single_pa))} a fortnight for a single person without children. Rates are indexed to prices on 20 March and 20 September; the next change is on ${day(P.next_indexation)}. These are maximums: earnings, a partner's income and assets reduce them.`,
  mini: 'jspRates',
  related: ['jobseeker-payment-calculator', 'jobseeker-income-test', 'centrelink-payment-rates', 'centrelink-indexation-dates', 'energy-and-pension-supplements'],
  sources: ['ssg-common-benefit', 'ssg-es-rates', 'ssg-jsp'],
  body: (h) => `
<h2>All the rates</h2>
${h.table(['Situation', 'Basic rate', 'Energy Supplement', 'Total per fortnight', 'Per year'], rows, `Social Security Guide 5.1.8.20 (basic rates as at ${day(P.rates_date)}) and 5.1.10.20 (Energy Supplement). Before Rent Assistance and before any income test.`, ['l', 'r', 'r', 'r', 'r'])}
<h2>Which rate is yours</h2>
<p><strong>Single, no children</strong> is the rate most people start on. <strong>Single with a dependent child</strong> applies to a single principal carer, a parent whose youngest child is too old for Parenting Payment single, for instance; it is ${h.audx(gap)} a fortnight higher. The same higher rate goes to a single person aged 55 or over after nine continuous months on payment, and to a single person assessed with a partial capacity to work of 0 to 14 hours a week (${h.src('ssg-common-benefit', 'Social Security Guide 5.1.8.20')}).</p>
<p>A single parent can also qualify for the "with child" rate without a dependent child in the usual sense, if they have at least 14% care of a child under 16. Members of a couple are each paid the partnered rate, whether or not they have children, unless they are separated by illness or respite care or one partner is in prison, in which case the higher single-with-child rate applies to each.</p>
<h2>The principal carer rate</h2>
<p>The highest JobSeeker rate, ${h.audx(J.principal_carer_exempt)}, is the maximum rate of Parenting Payment single including its pension supplement. It is paid to a single principal carer who has an exemption from mutual obligation requirements because they are an active foster carer, a home or distance educator, or the principal carer of a large family: at least one child under 16 and three more children aged 18 or under in secondary school. The Guide's own example shows how fragile it is: a mother of four loses it the day her eldest finishes school, because she then cares for only three children (${h.src('ssg-common-benefit', 'section 5.1.8.20')}).</p>
${h.box('Rates are maximums', `<p>The figures above are what you receive with no other income and assets under the free area. Earnings above ${h.aud(P.benefit.income_free_area)} a fortnight, a partner's income above the partner free area and assets over the limit all change the result. The ${h.a('jobseeker-payment-calculator', 'JobSeeker calculator')} applies them.</p>`)}
<h2>Rent Assistance on top</h2>
<p>A JobSeeker recipient without children who rents privately also receives Rent Assistance, up to ${h.audx(P.ra_ss.single.max)} a fortnight for a single person, ${h.audx(P.ra_ss.sharer.max)} for a sharer and ${h.audx(P.ra_ss.couple.max)} for a couple. It is added to the maximum rate before the income test. A single parent on JobSeeker receives Rent Assistance through Family Tax Benefit Part A instead.</p>
<h2>Partial capacity to work</h2>
<p>A single person assessed as able to work only 0 to 14 hours a week because of a medical condition or disability receives the higher single rate, ${h.audx(J.single_children)}, and the matching Energy Supplement. The assessment is made by Services Australia through a job capacity or employment services assessment, not by the person's own doctor alone. Someone in this situation may also be looking at the Disability Support Pension, which is paid at the pension rate of ${h.audx(P.pension.max_single)} for a single adult aged 21 or over but has stricter medical and work rules.</p>
<h2>What the rate does not include</h2>
<p>The table leaves out amounts that only some recipients receive: Pharmaceutical Allowance for people temporarily unable to work, Remote Area Allowance, and the approved program of work supplement. It also leaves out Rent Assistance and the effect of income and assets, which the calculator adds. The figure on your payment summary can therefore be higher or lower than the maximum here for reasons that are specific to your record.</p>
<h2>How the rates move</h2>
<p>JobSeeker rates are indexed to the consumer price index twice a year. The September change uses the movement in prices from December to June, the March change from June to December; if prices fell over the period, special rules apply. The Energy Supplement is not indexed and stays at the same dollar amount. The principal carer rate follows Parenting Payment single, which is benchmarked to wages as well as prices.</p>
<h2>JobSeeker compared with other payments</h2>
<p>JobSeeker is lower than the pension rates: a single Age Pension or Carer Payment recipient receives ${h.audx(P.pension.max_single)} a fortnight including supplements, and a Parenting Payment single recipient ${h.audx(P.pps.max)}. A person moving from JobSeeker to the Age Pension at ${P.pension.age} therefore usually sees a rise, as well as a different income and assets test. See the ${h.a('centrelink-payment-rates', 'full table of Centrelink rates')}.</p>`,
  faqs: [
    { q: 'What is the JobSeeker rate for a single parent?', a: `${audx(J.single_children)} a fortnight from ${day(P.rates_date)}, plus an Energy Supplement of ${x(ssFortnight(J.es_single_children_pa))}. A single parent of a large family, or a foster carer or home educator with an exemption from mutual obligations, receives ${audx(J.principal_carer_exempt)} instead. Rent Assistance for a single parent comes with Family Tax Benefit Part A.` },
    { q: 'Do people over 55 get a higher JobSeeker rate?', a: `Yes, after nine continuous months on payment. A single person aged 55 or over then receives the higher single rate of ${audx(J.single_children)} a fortnight instead of ${audx(J.single)}, the same as a single person with a dependent child. The higher rate does not apply to a member of a couple.` },
    { q: 'When does JobSeeker go up next?', a: `On ${day(P.next_indexation)}, with the March indexation to the consumer price index. JobSeeker is indexed on 20 March and 20 September each year; the current rates took effect on ${day(P.rates_date)}. The Energy Supplement is not indexed and stays the same.` },
  ],
});

import { definePage } from '../../lib/page-types';
import { P, aud, audx, day, parentingPayment, ssFortnight, partnerIncomeFreeArea } from '../../lib/kit';

const x = (n: number) => audx(Math.round(n * 100) / 100);
const s = parentingPayment({ couple: false, youngest: 4, children: 2, incomePf: 600 });
const pMax = P.benefit.ppp.max + ssFortnight(P.benefit.ppp.es_pa);
const free2 = ssFortnight(P.pps.ifa_pa + 2 * P.pps.ifa_extra_child_pa);

export default definePage({
  id: 'parenting-payment-calculator',
  group: 'work',
  kind: 'pillar',
  order: 80,
  slug: 'parenting-payment-calculator',
  nav: 'Parenting Payment calculator',
  card: 'Single or partnered: the rate, the youngest child rule and the income tests.',
  title: 'Parenting Payment Calculator 2026: Single and Partnered',
  description: `Parenting Payment calculator with the rates of ${day(P.rates_date)}: ${audx(P.pps.max)} a fortnight single, ${x(pMax)} partnered, with the income, partner and assets tests.`,
  h1: 'Parenting Payment calculator',
  intro: 'For the main carer of a young child: single or partnered rate, after your earnings, your partner’s income and your assets.',
  resume: `Parenting Payment is the income support payment for the principal carer of a young child. A single parent whose youngest child is under ${P.pps.youngest_under} can receive Parenting Payment single, ${audx(P.pps.max)} a fortnight since ${day(P.rates_date)} including the pension supplement basic amount and the Energy Supplement; a partnered parent whose youngest child is under ${P.benefit.ppp.youngest_under} can receive Parenting Payment partnered, ${x(pMax)} a fortnight including the Energy Supplement. The single rate has a generous income test: a free area of ${aud(free2)} a fortnight with two children, then 40 cents per dollar, so a single parent of two earning ${aud(600)} still receives about ${x(s.rate)}. The partnered rate uses the allowance income test and the partner income test. Both stop if assets exceed the free area. While Parenting Payment is paid, Family Tax Benefit is worked out without the family income test.`,
  tool: 'pp',
  related: ['parenting-payment-single', 'parenting-payment-partnered', 'single-parent-two-children-renting', 'family-tax-benefit-calculator', 'jobseeker-payment-calculator', 'child-care-subsidy-calculator'],
  sources: ['ssg-pp', 'ssg-common-pension', 'ssg-common-benefit', 'ssg-pps-tests', 'ssg-pps-limits', 'ssg-ppp-tests'],
  body: (h) => `
<h2>Single or partnered: two different payments</h2>
<p>Parenting Payment comes in two categories with different rules (${h.src('ssg-pp', 'Social Security Guide 1.2.4.10')}). Parenting Payment single is paid at a pension-like rate, is reduced by 40 cents per dollar above a free area that grows with each child, and includes the pension supplement basic amount. Parenting Payment partnered is paid at the partnered JobSeeker rate and uses the allowance income test, with the partner income test on top. Only one person in a couple can receive it, the principal carer; the other parent may be able to claim JobSeeker.</p>
${h.table(['', 'Single', 'Partnered'], [['Youngest child', `under ${P.pps.youngest_under}`, `under ${P.benefit.ppp.youngest_under}`], ['Maximum per fortnight', h.audx(P.pps.max), x(pMax)], ['Income free area', `${h.aud(ssFortnight(P.pps.ifa_pa))} plus ${x(ssFortnight(P.pps.ifa_extra_child_pa))} a child`, h.aud(P.benefit.income_free_area)], ['Taper', '40 cents', '50 cents, then 60 cents above ' + h.aud(P.benefit.lower_band_top)], ['Partner income', 'not applicable', `60 cents above about ${h.aud(partnerIncomeFreeArea())}`]], `Rates from ${day(P.rates_date)}; income free areas from 1 July 2026.`, ['l', 'l', 'l'])}
<h2>The youngest child rule</h2>
<p>Eligibility depends on the age of the youngest child in your care. Parenting Payment single ends on the youngest child's ${P.pps.youngest_under}th birthday and Parenting Payment partnered on the ${P.benefit.ppp.youngest_under}th. A parent who still needs income support afterwards usually moves to JobSeeker, which pays less to a single parent, ${h.audx(P.benefit.jsp.single_children)} a fortnight before supplements, and has different income rules. Planning for that birthday is one of the most useful things a single parent can do.</p>
<h2>An example for each category</h2>
<p>A single mother of two, youngest aged 4, earning ${h.aud(600)} a fortnight: her free area is ${h.aud(free2)}, she loses 40 cents on each of the ${h.aud(600 - free2)} above it, and receives about ${x(s.rate)}. A partnered father caring for a 3-year-old while his partner earns ${h.aud(1500)} a fortnight: his own income is nil, his partner's is below the partner free area of about ${h.aud(partnerIncomeFreeArea())}, so he receives the full partnered rate of ${x(pMax)}. If his partner's pay rose to ${h.aud(2200)}, the partner test would take about ${h.aud(Math.max(0, (2200 - partnerIncomeFreeArea()) * 0.6))} off.</p>
<h2>Earnings, assets and child support</h2>
<p>Gross earnings, business income and deemed income on savings count in the income test; child support received does not count for Parenting Payment, although it can reduce Family Tax Benefit Part A through the maintenance income test. Assets above the free area, ${h.aud(P.benefit.assets_free_area.homeowner_single)} for a single homeowner or ${h.aud(P.benefit.assets_free_area.nonhomeowner_single)} for a single renter, stop the payment altogether, because Parenting Payment uses the allowance assets test (${h.src('ssg-pps-tests', 'Social Security Guide 4.2.4.10')}).</p>
${h.box('With Family Tax Benefit and child care', `<p>Parenting Payment unlocks the maximum rates of Family Tax Benefit Parts A and B, whatever the family income, and Rent Assistance through Part A for renters. Child Care Subsidy is separate and gives at least ${P.ccs.hours_base} subsidised hours a fortnight. The ${h.a('home', 'household calculator')} adds all of them.</p>`)}`,
  faqs: [
    { q: 'How much is Parenting Payment single in 2026?', a: `${audx(P.pps.max)} a fortnight from ${day(P.rates_date)}, including the pension supplement basic amount and the Energy Supplement, for a single principal carer whose youngest child is under ${P.pps.youngest_under}. It falls by 40 cents for each dollar of income above the free area, which is ${aud(ssFortnight(P.pps.ifa_pa))} a fortnight plus ${x(ssFortnight(P.pps.ifa_extra_child_pa))} for each child.` },
    { q: 'When does Parenting Payment stop?', a: `Parenting Payment single stops when your youngest child turns ${P.pps.youngest_under}, and Parenting Payment partnered when your youngest turns ${P.benefit.ppp.youngest_under}. If you still need income support, Services Australia will usually move you to JobSeeker, which has a lower rate for single parents and mutual obligation requirements that can be different.` },
    { q: 'Can both parents in a couple get Parenting Payment?', a: 'No. Parenting Payment is paid to only one person at a time, the principal carer of the child. The other parent may qualify for JobSeeker Payment or another payment in their own right. Each payment then has its own income test, and the partner income test applies to both.' },
    { q: 'Does child support reduce Parenting Payment?', a: 'No. Child support you receive is not counted as income for Parenting Payment. It is counted for Family Tax Benefit Part A through the maintenance income test, which can reduce Part A above the base rate once child support exceeds the maintenance income free area for your family.' },
    { q: 'Can I work and get Parenting Payment single?', a: `Yes. With two children, the first ${aud(free2)} a fortnight of income is free, and each dollar above it reduces the payment by only 40 cents. A single parent of two keeps some Parenting Payment until earnings reach about ${aud(s.cutOut)} a fortnight, and Family Tax Benefit stays at the maximum while any is paid.` },
    { q: 'Is Parenting Payment taxable?', a: 'Yes. Parenting Payment single and partnered are taxable income, although the Energy Supplement and Rent Assistance are not. Many recipients pay little or no tax because of their low total income and the tax offsets available, but the payment must be included in your tax return each year.' },
  ],
});

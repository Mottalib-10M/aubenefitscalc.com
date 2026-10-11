import { definePage } from '../../lib/page-types';
import { P, aud, audx, day, parentingPayment, jobseeker, ssFortnight } from '../../lib/kit';

const x = (n: number) => audx(Math.round(n * 100) / 100);
const free = (n: number) => ssFortnight(P.pps.ifa_pa + n * P.pps.ifa_extra_child_pa);
const pp = (i: number, n = 2) => parentingPayment({ couple: false, youngest: 6, children: n, incomePf: i });
const rows = [0, 300, 600, 900, 1200, 1600, 2000].map((i) => [aud(i), x(pp(i).rate), aud(i + pp(i).rate)]);
const after = jobseeker({ couple: false, children: true, incomePf: 600 });

export default definePage({
  id: 'parenting-payment-single',
  group: 'work',
  kind: 'guide',
  order: 90,
  slug: 'parenting-payment-single',
  nav: 'Parenting Payment single',
  card: 'The single parent rate, the free area that grows with each child, and the age 14 change.',
  title: 'Parenting Payment Single 2026: Rate, Free Area and Age 14',
  description: `Parenting Payment single in 2026: ${audx(P.pps.max)} a fortnight, ${aud(free(1))} of income free with one child plus ${x(ssFortnight(P.pps.ifa_extra_child_pa))} for each extra child, and a 40 cent taper after that.`,
  h1: 'Parenting Payment single',
  intro: 'The main payment for single parents with a child under 14. How much, how earnings reduce it, and what happens at the 14th birthday.',
  resume: `Parenting Payment single pays a single principal carer whose youngest child is under ${P.pps.youngest_under} up to ${audx(P.pps.max)} a fortnight since ${day(P.rates_date)}, a figure that includes the pension supplement basic amount and the Energy Supplement. Its income test is the most generous of the working-age payments: the free area is ${aud(ssFortnight(P.pps.ifa_pa))} a fortnight plus ${x(ssFortnight(P.pps.ifa_extra_child_pa))} for each child, ${aud(free(2))} with two children, and above it the payment falls by only 40 cents per dollar. A single parent of two keeps some Parenting Payment until earnings reach about ${aud(pp(0).cutOut)} a fortnight. Child support received is not counted, assets above the free area stop the payment, and while it is paid, Family Tax Benefit is worked out without the family income test. On the youngest child's 14th birthday it ends, and a parent still on income support usually moves to JobSeeker at a lower rate.`,
  mini: 'pps',
  related: ['parenting-payment-calculator', 'parenting-payment-partnered', 'single-parent-two-children-renting', 'jobseeker-payment-rates', 'family-tax-benefit-part-a'],
  sources: ['ssg-pps-tests', 'ssg-pps-limits', 'ssg-common-pension', 'ssg-pp'],
  body: (h) => `
<h2>The rate and what is in it</h2>
<p>The maximum rate of ${h.audx(P.pps.max)} a fortnight is built from three parts: the maximum basic rate, the pension supplement basic amount of ${h.audx(P.pps.ps_basic_pa)} a year, and the Energy Supplement of ${h.audx(P.pps.es_pa)} a year (${h.src('ssg-common-pension', 'Social Security Guide 5.1.8.10')}). A single parent who has reached Age Pension age receives a slightly higher amount, ${h.audx(P.pps.max_over_pension_age)}, with the full pension supplement. The basic rate is benchmarked to wages as well as prices and moves on 20 March and 20 September; the next change is on ${h.day(P.next_indexation)}.</p>
<h2>A free area that grows with the family</h2>
<p>Parenting Payment single is the only main payment whose income free area depends on the number of children. The base is ${h.aud(P.pps.ifa_pa)} a year, ${h.aud(ssFortnight(P.pps.ifa_pa))} a fortnight, and each dependent child adds ${h.audx(P.pps.ifa_extra_child_pa)} a year, ${x(ssFortnight(P.pps.ifa_extra_child_pa))} a fortnight (${h.src('ssg-pps-limits', 'Social Security Guide 4.10.4.10')}). Above the free area, each dollar of income reduces the payment by 40 cents, not the 50 and 60 cents of JobSeeker (${h.src('ssg-pps-tests', 'section 4.2.4.10')}).</p>
${h.table(['Earnings per fortnight', 'Parenting Payment', 'Earnings plus payment'], rows, `Single parent with two children, rates from ${day(P.rates_date)}, free area of ${aud(free(2))} a fortnight.`, ['r', 'r', 'r'])}
<p>The third column climbs steadily: each dollar earned above the free area leaves 60 cents in the parent's pocket before tax. The payment stops at about ${h.aud(pp(0).cutOut)} a fortnight with two children, ${h.aud(pp(0, 1).cutOut)} with one and ${h.aud(pp(0, 3).cutOut)} with three.</p>
${h.box('Child support is not income here', `<p>Child support received is not counted in the Parenting Payment income test. It does count for Family Tax Benefit Part A, through the maintenance income test, once it exceeds ${h.audx(P.ftb.mifa_single)} a year for one child plus ${h.audx(P.ftb.mifa_extra_child)} for each additional child. A single parent therefore sees child support reduce Part A above the base rate but leave Parenting Payment untouched.</p>`)}
<h2>The 14th birthday</h2>
<p>Parenting Payment single ends when the youngest child turns ${P.pps.youngest_under} (${h.src('ssg-pp', 'Social Security Guide 1.2.4.10')}). A parent who still needs income support is generally moved to JobSeeker at the single rate with a dependent child, ${h.audx(P.benefit.jsp.single_children)} a fortnight plus the Energy Supplement, with the allowance income test: ${h.aud(P.benefit.income_free_area)} free and 40 cents per dollar for a single principal carer. With ${h.aud(600)} of earnings a fortnight and two children, the payment would drop from about ${x(pp(600).rate)} to about ${x(after.rate)}. Family Tax Benefit stays at the maximum as long as some JobSeeker is paid. Mutual obligation requirements also change with the move.</p>
<h2>Assets and other income</h2>
<p>Parenting Payment single is subject to the allowance assets test: it is not paid if assets, excluding the home, exceed ${h.aud(P.benefit.assets_free_area.homeowner_single)} for a homeowner or ${h.aud(P.benefit.assets_free_area.nonhomeowner_single)} for a non-homeowner. Savings below the limit still produce deemed income, which counts in the income test with wages, business income and rent received.</p>
<h2>Working more as the children grow</h2>
<p>Because the taper is 40 cents rather than 60, extra hours pay off more on Parenting Payment single than they would on JobSeeker. Moving from ${h.aud(600)} to ${h.aud(1200)} a fortnight of earnings with two children lifts the household's earnings-plus-payment from ${h.aud(600 + pp(600).rate)} to ${h.aud(1200 + pp(1200).rate)}. Family Tax Benefit stays at its maximum throughout, as long as some Parenting Payment remains. Child Care Subsidy covers at least ${P.ccs.hours_base} hours a fortnight of care for each child whatever the hours worked, and ${P.ccs.hours_higher} hours once work and other recognised activity pass ${P.ccs.hours_higher_activity} hours a fortnight.</p>
<p>The years before the youngest turns ${P.pps.youngest_under} are therefore a good time to build up work. A parent already earning near the cut-out when Parenting Payment ends loses little; a parent with no earnings moves to the lower JobSeeker rate with stricter conditions.</p>
<h2>Living arrangements</h2>
<p>Single for Parenting Payment means not a member of a couple. Services Australia looks at the whole relationship, including finances, the household, social aspects, sexual relationship and commitment, not only who lives at the address. A parent separated under the same roof can be assessed as single; a new partner who moves in usually turns the payment into Parenting Payment partnered, or ends it if the youngest child is 6 or older.</p>`,
  faqs: [
    { q: 'How much can a single parent earn on Parenting Payment?', a: `The first ${aud(ssFortnight(P.pps.ifa_pa))} a fortnight plus ${x(ssFortnight(P.pps.ifa_extra_child_pa))} for each child is free: ${aud(free(2))} with two children. Above that, the payment falls by 40 cents per dollar. With two children, some Parenting Payment is paid until earnings reach about ${aud(pp(0).cutOut)} a fortnight, before tax.` },
    { q: 'What happens to Parenting Payment when my youngest turns 14?', a: `It stops. If you still need income support, you will usually move to JobSeeker at the single rate with a dependent child, ${audx(P.benefit.jsp.single_children)} a fortnight plus the Energy Supplement, with a different income test and mutual obligation requirements. Family Tax Benefit continues at the maximum while JobSeeker is paid.` },
    { q: 'Does a new partner end Parenting Payment single?', a: `It changes it. If a new partner moves in and you are assessed as a member of a couple, you can receive Parenting Payment partnered only while your youngest child is under ${P.benefit.ppp.youngest_under}, at the partnered rate and with your partner's income tested. If your youngest is ${P.benefit.ppp.youngest_under} or older, Parenting Payment ends.` },
  ],
});

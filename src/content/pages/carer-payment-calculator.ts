import { definePage } from '../../lib/page-types';
import { P, aud, audx, day, pension, carerAllowance } from '../../lib/kit';

const x = (n: number) => audx(Math.round(n * 100) / 100);
const ex = pension({ couple: true, pensioners: 1, homeowner: false, incomePf: 1600, rentPf: 500, financialAssets: 20000, otherAssets: 15000, payment: 'Carer Payment' });

export default definePage({
  id: 'carer-payment-calculator',
  group: 'older',
  kind: 'pillar',
  order: 60,
  slug: 'carer-payment-calculator',
  nav: 'Carer Payment calculator',
  card: 'Carer Payment at the pension rate, with the income and assets tests applied.',
  title: 'Carer Payment Calculator 2026: Rate, Income and Assets Tests',
  description: `Carer Payment calculator with the rates of ${day(P.rates_date)}: up to ${audx(P.pension.max_single)} a fortnight single, the pension income and assets tests and Carer Allowance.`,
  h1: 'Carer Payment calculator',
  intro: 'For people who give constant care to someone with a disability or a serious illness: the fortnightly rate after the pension means tests.',
  resume: `Carer Payment is paid at the same rate as the Age Pension: since ${day(P.rates_date)}, up to ${audx(P.pension.max_single)} a fortnight for a single carer and ${audx(P.pension.max_couple_each)} for each member of a couple, including the Pension and Energy Supplements. It is for a person who provides constant care at home to an adult or child with a severe disability, illness or condition that is expected to last at least six months, and who cannot support themselves through substantial paid work because of it. The carer's own income and assets are assessed with the pension tests: ${aud(P.pension.ifa_single_pa / 26)} a fortnight of income free for a single carer, then 50 cents per dollar, and the same assets free areas as the Age Pension. The person being cared for must also pass a care receiver income and assets test, which this calculator does not model. Carer Allowance, ${audx(P.carer.allowance_pf)} a fortnight, can be paid on top.`,
  tool: 'carer',
  related: ['carer-allowance', 'carer-couple-with-child', 'age-pension-income-test', 'age-pension-assets-test', 'age-pension-rates', 'rent-assistance-couples-and-pensioners'],
  sources: ['ssg-cp', 'ssg-cp-tests', 'ssg-common-pension', 'ssg-pension-income-test', 'ssg-assets-test'],
  body: (h) => `
<h2>Who Carer Payment is for</h2>
<p>Carer Payment can be paid when a carer provides constant care to a person with a physical, intellectual or psychiatric disability, to a child with a severe disability or a severe medical condition, to two or more children with a disability or medical condition, or to a disabled adult and a child together, among other combinations (${h.src('ssg-cp', 'Social Security Guide 1.2.5.20')}). The condition must be permanent or expected to last at least six months, unless it is terminal or the care is short term or episodic. Constant care is assessed with standard tools that measure the care receiver's needs, not the hours the carer reports.</p>
<h2>The carer's means tests</h2>
<p>The carer is assessed exactly like an Age Pension recipient: the pension income test, with income free areas of ${h.aud(P.pension.ifa_single_pa / 26)} a fortnight for a single person and ${h.aud((2 * P.pension.ifa_couple_each_pa) / 26)} combined for a couple, and the pension assets test, with the same free areas and the same ${h.aud(3)} a fortnight reduction per ${h.aud(1000)} (${h.src('ssg-cp-tests', 'Social Security Guide 4.2.5')}). For a couple, the partner's income and assets are combined with the carer's. A carer whose partner earns ${h.aud(1600)} a fortnight, renting at ${h.aud(500)}, with modest savings, receives about ${x(ex.ratePerPerson)} of Carer Payment, set by the ${ex.test} test.</p>
${h.box('The care receiver test', `<p>The person being cared for, together with their partner or, for a child, the child's parents, must pass a separate income and assets test set in the Social Security Act. Where the care receiver is an adult receiving a pension or benefit, that test does not apply. This site does not have the care receiver limits in its data, so check them with Services Australia before claiming.</p>`)}
<h2>Working and studying while receiving Carer Payment</h2>
<p>Carers can work, study or volunteer for a limited number of hours a week, including travel time, without losing the payment, as long as the care continues. Their earnings are assessed under the income test like any pensioner's. Carers who have reached Age Pension age may also use the Work Bonus.</p>
<h2>Carer Payment and other payments</h2>
<p>Carer Payment is an income support payment, so a carer's family receives Family Tax Benefit without the family income test. Carer Allowance, a flat ${h.audx(P.carer.allowance_pf)} a fortnight for families with income up to ${h.aud(P.carer.allowance_income_limit)}, is paid in addition and is not means tested in the same way; a carer who receives Carer Payment for a child may qualify for Carer Allowance automatically. A family on ${h.aud(140000)} receives ${h.audx(carerAllowance(140000))} a fortnight of it. See ${h.a('carer-allowance', 'Carer Allowance')}.</p>`,
  faqs: [
    { q: 'How much is Carer Payment per fortnight in 2026?', a: `From ${day(P.rates_date)}, up to ${audx(P.pension.max_single)} for a single carer and ${audx(P.pension.max_couple_each)} each for a member of a couple, the same as the Age Pension. These include the Pension and Energy Supplements. Rent Assistance can be added for renters, and income or assets above the free areas reduce the rate.` },
    { q: 'Can I get Carer Payment and Carer Allowance together?', a: `Yes. Carer Allowance, ${audx(P.carer.allowance_pf)} a fortnight, is a supplement paid on top of Carer Payment, or on its own, when you provide daily care at home and your family income is up to ${aud(P.carer.allowance_income_limit)}. A carer who receives Carer Payment for a child may qualify for Carer Allowance automatically.` },
    { q: 'Does my partner’s income affect Carer Payment?', a: `Yes. Carer Payment uses the pension income test on the couple's combined income: ${aud((2 * P.pension.ifa_couple_each_pa) / 26)} a fortnight free, then 25 cents per dollar off each partner's rate. The couple's assets are also combined for the assets test. Your partner's earnings therefore reduce Carer Payment once the couple is above the free area.` },
    { q: 'Can I work while receiving Carer Payment?', a: 'Yes, within limits. You can work, study, volunteer or do training for a limited number of hours a week, travel time included, while still providing constant care. Earnings count in the pension income test, so they reduce the payment once your income passes the free area, by 50 cents per dollar for a single carer.' },
    { q: 'Does the person I care for need to pass a means test?', a: 'Usually yes. The care receiver, with their partner or, for a child, the child’s parents, must pass an income test and an assets test set in the Social Security Act. The test does not apply when the care receiver is an adult who receives a pension or benefit themselves. Services Australia assesses it on claim.' },
    { q: 'Is Carer Payment taxable?', a: 'In most cases yes, like the Age Pension; there are exceptions, such as when both the carer and the care receiver are under Age Pension age, in which case Carer Payment is not taxable. The Energy Supplement and Rent Assistance are tax-free in all cases. Check your payment summary for the taxable amount at the end of the year.' },
  ],
});

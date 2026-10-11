import { definePage } from '../../lib/page-types';
import { P, aud, audx, faFortnight, ftbA, ftbB, ftbACutoffs } from '../../lib/kit';

const two = ftbA({ ages: [4, 9], ati: 95000 });
const twoB = ftbB({ ages: [4, 9], couple: true, primaryAti: 75000, secondaryAti: 20000 });
const cut = ftbACutoffs([4, 9]);
const fpA = (n: number) => audx(Math.round(faFortnight(n) * 100) / 100);

export default definePage({
  id: 'family-tax-benefit-calculator',
  group: 'families',
  kind: 'pillar',
  order: 10,
  slug: 'family-tax-benefit-calculator',
  nav: 'Family Tax Benefit calculator',
  card: 'Parts A and B together, both income test methods, Rent Assistance and the supplements.',
  title: 'Family Tax Benefit Calculator 2026-27: Part A and Part B',
  description: `Family Tax Benefit calculator for 2026-27: Part A by Method 1 and Method 2, Part B, Rent Assistance and the ${audx(P.ftb.a_supplement)} supplement, per fortnight and per year.`,
  h1: 'Family Tax Benefit calculator',
  intro: 'Both parts of Family Tax Benefit for your family, with the income test worked out the way Centrelink does it.',
  resume: `Family Tax Benefit Part A pays up to ${fpA(P.ftb.a_max_under13)} a fortnight for each child under 13 and ${fpA(P.ftb.a_max_13to19)} for a teenager aged 13 to 19 at secondary school in 2026-27, and Part B adds up to ${fpA(P.ftb.b_under5)} a fortnight when the youngest child is under 5. Above a family income of ${aud(P.ftb.a_ifa)}, Part A falls by 20 cents in the dollar until it reaches the base rate of ${fpA(P.ftb.a_base)} per child, which is protected until ${aud(P.ftb.a_hifa)}; beyond that, 30 cents. A couple with children aged 4 and 9 and a family income of ${aud(95000)} receives about ${aud(two.fortnight + twoB.fortnight)} a fortnight from both parts, plus supplements after tax time. The calculator below runs Method 1 and Method 2 side by side, adds Rent Assistance for private renters, and drops the income test entirely when a parent receives an income support payment, as the Family Assistance Guide requires.`,
  tool: 'ftb',
  related: ['family-tax-benefit-part-a', 'family-tax-benefit-part-b', 'family-tax-benefit-income-test', 'ftb-end-of-year-supplement', 'rent-assistance-for-families', 'couple-two-children-one-income'],
  sources: ['fag-ftb-rates', 'fag-ftb-m1', 'fag-ftb-m2', 'fag-ftb-b', 'fag-ftb-b-test', 'fag-ra', 'sa-ftb-m1'],
  body: (h) => `
<h2>What the result is made of</h2>
<p>The headline figure is what Centrelink would pay each fortnight during the year: Part A and Part B, both without their supplements, because the supplements are only paid once your family income for the year has been confirmed. They appear underneath, as an amount to expect after the tax return. If you rent privately and have at least one child, Rent Assistance is part of Part A and shown inside it, worked out on your rent with the family thresholds of ${h.audx(P.ra_family.threshold_single)} a year for a single parent and ${h.audx(P.ra_family.threshold_couple)} for a couple.</p>
<p>For a teenager, enter the age they will be for most of the year. Children aged 16 to 19 count only while they are in full-time secondary school, or doing an equivalent course, and the calculator assumes they are. Part B for a couple stops when the youngest child turns 13; for a single parent it continues until the end of the year the youngest turns 18, if still at school.</p>
<h2>Method 1, Method 2 and the gap between them</h2>
<p>The two methods are not options you choose. Centrelink works out both and pays the higher. Method 1 begins at the maximum rate and is the one that counts for most families with a modest income. Method 2 begins at the much lower base rate but only starts tapering at ${h.aud(P.ftb.a_hifa)}, so it takes over in the upper part of the range. With two children aged 4 and 9, Part A reaches the base rate at about ${h.aud(cut.baseReachedAt)} of family income and stops altogether at about ${h.aud(cut.nilAt)}. The detail under the result shows both annual amounts so you can see which one is paying.</p>
${h.box('Income support changes everything', `<p>If you or your partner receive JobSeeker, Parenting Payment, Youth Allowance, a pension or any other income support payment, the family income test does not apply and both parts are paid at the maximum rate. Tick the question in the calculator to see the difference; on the ${h.a('home', 'household calculator')} it is applied automatically when a payment is selected.</p>`)}
<h2>Which income to use</h2>
<p>Family Tax Benefit looks at adjusted taxable income for the whole financial year, from 1 July to 30 June. For a couple, Part A adds both incomes; Part B looks at them separately, first the higher earner against the ${h.aud(P.ftb.b_primary_limit)} limit, then the lower earner, whose income above ${h.aud(P.ftb.b_ifa)} reduces Part B by 20 cents in the dollar. During the year Centrelink pays on your estimate. After the year ends it compares what was paid with what your actual income gives, which is why an estimate set too low becomes a debt, and why a pay rise late in the year is worth reporting.</p>
<h2>When the figures were checked</h2>
<p>The rates are those published in ${h.src('fag-ftb-rates', 'Family Assistance Guide 3.1.1.20')} for the 2026-27 income year; Rent Assistance with FTB moved on ${h.day(P.rates_date)}. The engine reproduces the Method 2 worked example of ${h.src('fag-ftb-m2', 'section 3.1.8.20')} to the cent. Each part has its own guide: ${h.a('family-tax-benefit-part-a', 'Part A')}, ${h.a('family-tax-benefit-part-b', 'Part B')}, ${h.a('family-tax-benefit-income-test', 'the income test')} and ${h.a('family-tax-benefit-rates', 'the rate tables')}.</p>`,
  faqs: [
    { q: 'How much Family Tax Benefit will I get per fortnight in 2026-27?', a: `It depends on the ages of your children and your family income. At the maximum, Part A is ${fpA(P.ftb.a_max_under13)} a fortnight for each child under 13 and ${fpA(P.ftb.a_max_13to19)} for each teenager at school, and Part B is ${fpA(P.ftb.b_under5)} with a youngest child under 5 or ${fpA(P.ftb.b_5to18)} from age 5. Supplements come on top after tax time.` },
    { q: 'At what family income does Family Tax Benefit Part A stop?', a: `There is no single cut-off: it depends on the number and ages of children. Each dollar above ${aud(P.ftb.a_ifa)} removes 20 cents until the base rate, and each dollar above ${aud(P.ftb.a_hifa)} removes 30 cents. For two children aged 4 and 9 the last dollar of Part A disappears at about ${aud(cut.nilAt)} of family income.` },
    { q: 'Why does the calculator show two methods for Part A?', a: 'Because the law sets two formulas and Centrelink pays whichever gives more. Method 1 starts high and tapers from the lower income free area; Method 2 starts at the base rate but tapers only above the higher income free area. Below the higher free area Method 1 can never fall under the base rate, so Method 2 matters only for higher incomes.' },
    { q: 'Is Rent Assistance included in Family Tax Benefit?', a: `Yes, for families who rent privately. It is added to the maximum rate of Part A under Method 1, at 75 cents for each dollar of rent above the family threshold, up to ${audx(P.ra_family.max_1or2)} a year with one or two children or ${audx(P.ra_family.max_3plus)} with three or more. When income reduces Part A, Rent Assistance is the first part to go.` },
    { q: 'Do I need to lodge a tax return to get Family Tax Benefit?', a: `You need to lodge one, or tell Centrelink you do not have to, for the year to be reconciled. Without it, you lose the Part A supplement of ${audx(P.ftb.a_supplement)} a child and the Part B supplement of ${audx(P.ftb.b_supplement)}, and Centrelink can ask you to repay the Family Tax Benefit paid for that year.` },
    { q: 'Does child support I receive reduce Family Tax Benefit?', a: `It can reduce Part A above the base rate through the maintenance income test, which this calculator does not model. A single parent can receive ${audx(P.ftb.mifa_single)} a year of child support, plus ${audx(P.ftb.mifa_extra_child)} for each additional child, before it reduces anything; above those amounts, Part A is reduced towards the base rate, never below it. Enter your figures with Centrelink's estimator if you receive more.` },
  ],
});

import { definePage } from '../../lib/page-types';
import { P, aud, audx, jobseeker, parentingPayment, pension, ssFortnight, ccsStandardPct, ftbA } from '../../lib/kit';

const x = (n: number) => audx(Math.round(n * 100) / 100);
const inc = 700;
const jsp = jobseeker({ couple: false, children: false, incomePf: inc });
const pps = parentingPayment({ couple: false, youngest: 3, children: 1, incomePf: inc });
const pen = pension({ couple: false, homeowner: true, incomePf: inc });
const tests: Array<[string, string, string, string]> = [
  ['Age Pension, Carer Payment', `${aud(ssFortnight(P.pension.ifa_single_pa))} a fortnight (single)`, '50c, or 25c each for a couple', 'combined for a couple'],
  ['Parenting Payment single', `${aud(ssFortnight(P.pps.ifa_pa))} plus ${x(ssFortnight(P.pps.ifa_extra_child_pa))} a child`, '40c', 'own income only'],
  ['JobSeeker, Parenting Payment partnered', `${aud(P.benefit.income_free_area)} a fortnight`, `50c to ${aud(P.benefit.lower_band_top)}, then 60c`, 'partner test at 60c'],
  ['Youth Allowance and Austudy (students)', `${aud(P.ya.student_ifa)} a fortnight`, `50c to ${aud(P.ya.student_band_top)}, then 60c`, 'income bank'],
  ['Family Tax Benefit Part A', `${aud(P.ftb.a_ifa)} a year (family)`, `20c, then 30c above ${aud(P.ftb.a_hifa)}`, 'none with income support'],
  ['Family Tax Benefit Part B', `${aud(P.ftb.b_ifa)} a year (lower earner)`, '20c', `higher earner limit ${aud(P.ftb.b_primary_limit)}`],
  ['Child Care Subsidy', `${aud(P.ccs.lower_threshold)} a year (family)`, `1 point per ${aud(P.ccs.step)}`, 'percentage of fees'],
];

export default definePage({
  id: 'centrelink-income-test',
  group: 'guides',
  kind: 'guide',
  order: 20,
  slug: 'centrelink-income-test',
  nav: 'Centrelink income tests',
  card: 'Seven income tests side by side: free areas, tapers, and whose income counts.',
  title: 'Centrelink Income Test 2026: Seven Tests, Free Areas, Tapers',
  description: `Centrelink income test in 2026 compared: pensions free to ${aud(ssFortnight(P.pension.ifa_single_pa))} a fortnight, JobSeeker to ${aud(P.benefit.income_free_area)}, students ${aud(P.ya.student_ifa)}, plus the annual FTB and CCS family income tests.`,
  h1: 'Centrelink income tests compared',
  intro: 'There is no single Centrelink income test. Each payment has its own free area, its own taper and its own idea of whose income counts.',
  resume: `Centrelink applies a different income test to almost every payment. Pensions such as the Age Pension and Carer Payment allow ${aud(ssFortnight(P.pension.ifa_single_pa))} a fortnight of income for a single person and then take 50 cents per dollar. Parenting Payment single allows ${aud(ssFortnight(P.pps.ifa_pa))} plus ${x(ssFortnight(P.pps.ifa_extra_child_pa))} for each child and takes 40 cents. JobSeeker and the other allowances allow ${aud(P.benefit.income_free_area)} a fortnight and take 50 cents up to ${aud(P.benefit.lower_band_top)}, then 60 cents. Students on Youth Allowance or Austudy have a ${aud(P.ya.student_ifa)} free area and an income bank. Family payments use annual family income: Family Tax Benefit Part A starts falling above ${aud(P.ftb.a_ifa)}, and Child Care Subsidy loses a point for each ${aud(P.ccs.step)} above ${aud(P.ccs.lower_threshold)}. The same ${aud(inc)} a fortnight of wages leaves a single person ${x(pen.rate)} of Age Pension, ${x(pps.rate)} of Parenting Payment single with one child, or ${x(jsp.rate)} of JobSeeker.`,
  mini: 'compareTests',
  related: ['jobseeker-income-test', 'age-pension-income-test', 'family-tax-benefit-income-test', 'parenting-payment-single', 'deeming-rates', 'child-care-subsidy-income-thresholds'],
  sources: ['ssg-pension-income-test', 'ssg-benefit-income-test', 'ssg-pps-tests', 'fag-ftb-m1', 'fag-ccs-income'],
  body: (h) => `
<h2>The seven tests at a glance</h2>
${h.table(['Payment', 'Free area', 'Taper per dollar', 'Particularity'], tests, 'Social Security Guide 4.2.1.10, 4.2.2, 4.2.4.10, 4.2.8.50; Family Assistance Guide 3.1.1.20 and 3.5.1. Free areas of 2026-27 (students: 2026).', ['l', 'l', 'l', 'l'])}
<h2>Fortnightly tests and annual tests</h2>
<p>The social security payments, pensions and allowances, look at income each fortnight. A busy fortnight lowers that fortnight's payment, a quiet one raises it, and nothing needs to be repaid if reports are accurate. The family payments, Family Tax Benefit and Child Care Subsidy, look at adjusted taxable income for the whole financial year: they are paid on an estimate and reconciled after the tax returns. A household on both types needs to report income fortnightly for one and keep an accurate annual estimate for the other.</p>
<h2>Whose income counts</h2>
<p>For a single person, only their own income. For a couple, it depends. The pension test combines the couple's income and halves it. JobSeeker and Parenting Payment partnered test each partner's own income and add a partner test above a free area tied to the JobSeeker cut-out. Parenting Payment single has no partner by definition. Family Tax Benefit Part A adds both partners' adjusted taxable incomes; Part B tests the higher earner against a limit, then the lower earner alone. Child Care Subsidy uses combined family income. Young people on dependent Youth Allowance can also be affected by their parents' income.</p>
${h.box('The rule that overrides the family tests', `<p>When a parent receives an income support payment, Family Tax Benefit Parts A and B are paid without the family income test (${h.src('fag-ftb-m1', 'Family Assistance Guide 3.1.4.40')}). A family that would lose most of its Part A on income grounds keeps the maximum while one parent is on JobSeeker, Parenting Payment or a pension. Child Care Subsidy has no such rule: it always follows family income.</p>`)}
<h2>The cut-out points</h2>
<p>Free areas tell you where a payment starts to fall; cut-out points tell you where it ends. For a single person with no rent, the Age Pension stops at about ${h.aud(pension({ couple: false, homeowner: true, incomePf: 0 }).incomeCutOut)} a fortnight of income, Parenting Payment single with one child at about ${h.aud(parentingPayment({ couple: false, youngest: 3, children: 1, incomePf: 0 }).cutOut)}, and JobSeeker at about ${h.aud(jobseeker({ couple: false, children: false, incomePf: 0 }).cutOut)}. The differences come from both the free area and the starting rate: a pension starts higher and tapers more slowly than JobSeeker, so it reaches much further up the income scale. Rent Assistance raises each of these cut-outs because it is added to the maximum rate before the test. For a couple, the cut-outs depend on both incomes, and for the pension on the couple's combined income, so the household calculator is the practical way to find them.</p>
<h2>Reporting</h2>
<p>Fortnightly payments rely on what you report each fortnight: gross earnings for the fortnight in which they were earned, not when they were paid. Family payments rely on your annual estimate, which you can update at any time in your Centrelink online account. The two kinds of reporting are separate, and doing one does not update the other.</p>
<h2>What counts as income</h2>
<p>For the fortnightly tests, ordinary income: wages before tax, business income, rent received, and deemed income on financial assets instead of actual interest and dividends, at ${P.deeming.lower_rate}% and ${P.deeming.upper_rate}% from ${h.day(P.rates_date)}. Most social security payments, Family Tax Benefit, Rent Assistance and child support are not income for these tests. For the family tests, adjusted taxable income, which adds reportable fringe benefits, reportable superannuation contributions and net investment losses to taxable income, and includes taxable Centrelink payments.</p>
<h2>One family, several tests</h2>
<p>Take a couple with a child aged 3 where one partner earns ${h.aud(1800)} a fortnight and the other cares for the child. The carer's Parenting Payment partnered is reduced by the partner test once the partner passes the free area. Family Tax Benefit, while Parenting Payment is paid, ignores family income. If Parenting Payment reaches nil, Part A switches to the family test: on ${h.aud(1800 * 26)} a year with one child, Part A is ${h.aud(ftbA({ ages: [3], ati: 1800 * 26 }).fortnight)} a fortnight. Child Care Subsidy, if the child goes to care, is at ${ccsStandardPct(1800 * 26)}% throughout. The ${h.a('home', 'household calculator')} keeps track of these switches.</p>`,
  faqs: [
    { q: 'Is there one Centrelink income test for all payments?', a: 'No. Pensions, Parenting Payment single, allowances such as JobSeeker, student payments, Family Tax Benefit and Child Care Subsidy each have their own free area and taper, and they disagree on whose income counts and over what period. The same income can therefore reduce one payment sharply and another hardly at all.' },
    { q: 'Which Centrelink payment lets you earn the most before it is reduced?', a: `Among fortnightly payments, student Youth Allowance and Austudy, with a free area of ${aud(P.ya.student_ifa)} a fortnight and an income bank on top. Parenting Payment single has the gentlest taper, 40 cents per dollar. Among family payments, Child Care Subsidy reaches families with very high incomes, down to 0% at ${aud(P.ccs.zero_at)}.` },
    { q: 'Does Family Tax Benefit count as income for JobSeeker?', a: 'No. Family Tax Benefit, Rent Assistance, Carer Allowance and child support received are not counted as income for JobSeeker or the other social security payments. The reverse is not true: the taxable part of JobSeeker counts in the adjusted taxable income used for Child Care Subsidy, although Family Tax Benefit ignores it while JobSeeker is paid.' },
  ],
});

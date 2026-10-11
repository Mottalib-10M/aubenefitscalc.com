import { definePage } from '../../lib/page-types';
import { P, aud, audx, day, carerAllowance, household } from '../../lib/kit';

const C = P.carer;
const fam = household({ couple: true, you: { age: 41, payment: 'carer', incomeAnnual: 0 }, partner: { age: 43, payment: 'none', incomeAnnual: 70000 }, children: [{ age: 9 }], rentPf: 0, homeowner: true });

export default definePage({
  id: 'carer-allowance',
  group: 'older',
  kind: 'guide',
  order: 70,
  slug: 'carer-allowance',
  nav: 'Carer Allowance',
  card: 'The flat supplement for daily care at home, the $250,000 income test and how it combines.',
  title: 'Carer Allowance 2026: Rate, Income Limit and Who Qualifies',
  description: `Carer Allowance in 2026: ${audx(C.allowance_pf)} a fortnight for daily care at home of a child or adult, with a family income limit of ${aud(C.allowance_income_limit)} that is not indexed each year.`,
  h1: 'Carer Allowance',
  intro: 'A flat fortnightly supplement for people who give daily care at home, paid with or without Carer Payment.',
  resume: `Carer Allowance is a fortnightly supplement of ${audx(C.allowance_pf)} in 2026 for a person who gives daily care and attention at home to someone with a disability or a medical condition, whether a child under 16 or an adult. It is not a full income support payment: it is paid on top of wages, Carer Payment, the Age Pension or any other income, and it is not reduced by earnings. The only means test is a family income limit of ${aud(C.allowance_income_limit)} a year, the same for single and partnered households, and that limit is fixed rather than indexed. For a child, eligibility depends on an assessment of the care needed or on the child having a recognised disability or condition; some children qualify only for a Carer Allowance Health Care Card, without the fortnightly payment. Over a year, the allowance is worth about ${aud(C.allowance_pf * 26)}. Its rate is indexed each 1 January.`,
  mini: 'carerAllowance',
  related: ['carer-payment-calculator', 'carer-couple-with-child', 'child-care-subsidy-three-day-guarantee', 'centrelink-payment-rates', 'family-tax-benefit-part-a'],
  sources: ['ssg-ca', 'ssg-ca-rate', 'ssg-cp'],
  body: (h) => `
<h2>Two forms: child and adult</h2>
<p><strong>Carer Allowance (child)</strong> is for carers of a dependent child under 16 with a disability or medical condition. It comes at two levels: a Carer Allowance Health Care Card alone, for a child who needs substantially more care and attention than other children of the same age, and the fortnightly payment plus the card, for a child rated "intense" under the disability care load assessment or who has a condition on the list of recognised disabilities (${h.src('ssg-ca', 'Social Security Guide 1.2.5.50')}). <strong>Carer Allowance (adult)</strong> is for carers of a person aged 16 or over whose disability or condition substantially impairs their capacity to carry out activities of daily living, assessed with the adult disability assessment tool.</p>
<h2>The income test</h2>
<p>The income test is simple and generous: the combined taxable income of the carer and their partner must be ${h.aud(C.allowance_income_limit)} a year or less. It applies to both forms and both levels, and it is a fixed, non-indexed amount. There is no assets test and no taper: below the limit, the full ${h.audx(C.allowance_pf)} is paid; above it, nothing (${h.src('ssg-ca', 'section 1.2.5.50')}).</p>
${h.table(['Family taxable income', 'Carer Allowance per fortnight', 'Per year'], [[h.aud(60000), h.audx(carerAllowance(60000)), h.aud(carerAllowance(60000) * 26)], [h.aud(180000), h.audx(carerAllowance(180000)), h.aud(carerAllowance(180000) * 26)], [h.aud(C.allowance_income_limit), h.audx(carerAllowance(C.allowance_income_limit)), h.aud(carerAllowance(C.allowance_income_limit) * 26)], [h.aud(C.allowance_income_limit + 1), h.audx(carerAllowance(C.allowance_income_limit + 1)), h.aud(carerAllowance(C.allowance_income_limit + 1) * 26)]], `Rate from Social Security Guide 5.1.5.50; income limit from 1.2.5.50.`, ['r', 'r', 'r'])}
<h2>Carer Allowance and Carer Payment</h2>
<p>The two are often confused. Carer Payment is an income support payment at the pension rate, for someone whose caring role prevents substantial paid work, with full income and assets tests on the carer and a test on the person cared for. Carer Allowance is a supplement that recognises the extra costs and work of care, paid regardless of the carer's earnings. A carer can receive both. A person who qualifies for Carer Payment for a child may automatically qualify for Carer Allowance (child) (${h.src('ssg-cp', 'Social Security Guide 1.2.5.20')}).</p>
${h.box('A family example', `<p>A couple with a nine-year-old who needs constant care: one parent receives Carer Payment, the other earns ${h.aud(70000)} a year. The household calculator gives about ${h.aud(fam.fortnightTotal)} a fortnight in Carer Payment and Family Tax Benefit. With a family income well under ${h.aud(C.allowance_income_limit)}, Carer Allowance adds ${h.audx(carerAllowance(70000))} a fortnight on top, which the calculator does not include in its total.</p>`)}
<h2>Child care and the allowance</h2>
<p>A parent who receives Carer Allowance automatically gets ${P.ccs.hours_base} subsidised hours of child care a fortnight for their other children, like every family, and can count the hours spent caring towards the ${P.ccs.hours_higher_activity} hours of activity needed for ${P.ccs.hours_higher} subsidised hours, when combined with other recognised activity. See ${h.a('child-care-subsidy-three-day-guarantee', 'the 3-day guarantee')}.</p>
<h2>When care changes</h2>
<p>Carer Allowance (child) for a child who qualified before turning 16 continues, with the Health Care Card, until the child is 16 years and 3 months old, or until the adult assessment is finished if the transfer papers were lodged by the 16th birthday (${h.src('ssg-ca', 'Social Security Guide 1.2.5.50')}). From then on, the adult form and its assessment apply. If the person cared for moves into residential care or hospital, the allowance can continue for a period in some cases; report the change so that Services Australia can decide.</p>
<p>Because there is no taper, a family's decisions about work are not affected by Carer Allowance as long as income stays at or under ${h.aud(C.allowance_income_limit)}. The cliff is at that figure: a family one dollar above it loses the whole ${h.aud(C.allowance_pf * 26)} a year, which is worth knowing when a bonus or overtime is on offer.</p>
<h2>Claiming</h2>
<p>Carer Allowance can be claimed online through Centrelink, with a medical report completed by the treating health professional of the person cared for. More than one carer can share Carer Allowance for the same person when care is shared. The allowance is not taxable and is not counted as income for other payments.</p>`,
  faqs: [
    { q: 'How much is Carer Allowance per fortnight in 2026?', a: `${audx(C.allowance_pf)} a fortnight, about ${aud(C.allowance_pf * 26)} a year. The rate is indexed each 1 January. It is paid in full to any eligible carer whose family taxable income is ${aud(C.allowance_income_limit)} or less, on top of wages, Carer Payment or any other payment you receive.` },
    { q: 'What is the income limit for Carer Allowance?', a: `${aud(C.allowance_income_limit)} a year of combined taxable income for the carer and their partner, the same for single and partnered households. The limit is fixed in law and not indexed, and there is no assets test. Below the limit the full allowance is paid; above it, nothing is paid.` },
    { q: 'Is Carer Allowance taxable income?', a: 'No. Carer Allowance is tax-free and is not counted as income for other Centrelink payments, so receiving it does not reduce Carer Payment, the Age Pension or Family Tax Benefit. It is also not affected by how much the carer earns, as long as the family income stays within the limit.' },
  ],
});

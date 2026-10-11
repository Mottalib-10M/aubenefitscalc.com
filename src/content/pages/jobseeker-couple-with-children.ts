import { definePage } from '../../lib/page-types';
import type { Household } from '../../lib/engine/household';
import { P, aud, household, partnerIncomeFreeArea, faFortnight } from '../../lib/kit';

const preset: Household = { couple: true, you: { age: 40, payment: 'jobseeker', incomeAnnual: 0 }, partner: { age: 39, payment: 'none', incomeAnnual: 38000 }, children: [{ age: 5 }, { age: 9 }], rentPf: 620, homeowner: false };
const r = household(preset);
const line = (k: string) => r.lines.find((l) => l.key.startsWith(k))!;
const jsp = line('JobSeeker');
const noJsp = household({ ...preset, you: { ...preset.you, payment: 'none' } });
const job = household({ ...preset, you: { ...preset.you, payment: 'jobseeker', incomeAnnual: 15000 } });

export default definePage({
  id: 'jobseeker-couple-with-children',
  group: 'cases',
  kind: 'case',
  order: 60,
  slug: 'households/jobseeker-couple-with-children',
  nav: 'JobSeeker couple with children',
  card: 'One partner on JobSeeker, one working: why the JobSeeker lifts the family’s FTB to the maximum.',
  title: 'JobSeeker Couple With Children 2026: FTB at the Maximum',
  description: `JobSeeker couple with two children in 2026: one partner on JobSeeker, the other earning ${aud(38000)}, gets about ${aud(r.fortnightTotal)} a fortnight. Why FTB is not income tested.`,
  h1: 'A couple with two children, one partner on JobSeeker',
  intro: 'Mark lost his job and receives JobSeeker; Jess earns $38,000 part time. Their children are 5 and 9, and they rent for $620 a fortnight.',
  resume: `A couple with children aged 5 and 9, renting at ${aud(620)} a fortnight, where one partner receives JobSeeker and the other earns ${aud(38000)} a year, receives about ${aud(r.fortnightTotal)} a fortnight from Centrelink at the rates of September 2026, plus ${aud(r.endOfYear)} of supplements after the tax returns. The deciding rule is not in JobSeeker itself: because one parent receives an income support payment, both parts of Family Tax Benefit are paid at their maximum rates without the family income test, and Rent Assistance comes inside Part A at the family rate. Mark's JobSeeker, about ${aud(jsp.fortnight)} a fortnight, is reduced by the partner income test, since Jess earns about ${aud(38000 / 26)} a fortnight, above the partner free area of about ${aud(partnerIncomeFreeArea())}. Without the JobSeeker, the same household would receive about ${aud(noJsp.fortnightTotal)} a fortnight, because Family Tax Benefit would return to the income test.`,
  preset,
  related: ['jobseeker-partner-income-test', 'family-tax-benefit-income-test', 'rent-assistance-for-families', 'jobseeker-payment-calculator', 'family-tax-benefit-part-b'],
  sources: ['ssg-benefit-income-test', 'fag-ftb-m1', 'fag-ra', 'ssg-common-benefit'],
  body: (h) => `
<h2>The JobSeeker that changes everything else</h2>
<p>Read the lines of the calculator from the bottom. Family Tax Benefit Part A is at the maximum for both children, ${h.aud(faFortnight(2 * P.ftb.a_max_under13))} a fortnight before Rent Assistance, and Part B is at the full rate for a youngest child aged 5 or over. That is because Mark receives JobSeeker, an income support payment: while it is paid, the family income test of Family Tax Benefit does not apply (${h.src('fag-ftb-m1', 'Family Assistance Guide 3.1.4.40')}). The difference between the household with and without JobSeeker, about ${h.aud(r.fortnightTotal - noJsp.fortnightTotal)} a fortnight, is larger than Mark's JobSeeker on its own.</p>
<h2>The partner income test on Mark's payment</h2>
<p>Mark's own income is nil, but Jess's wages count through the partner test: each dollar she earns above about ${h.aud(partnerIncomeFreeArea())} a fortnight takes 60 cents off his payment (${h.src('ssg-benefit-income-test', 'Social Security Guide 4.2.2')}). Her ${h.aud(38000 / 26)} a fortnight is ${h.aud(38000 / 26 - partnerIncomeFreeArea())} above that, which costs him about ${h.aud((38000 / 26 - partnerIncomeFreeArea()) * 0.6)}. A couple without children would face the same deduction; what is specific to this family is what the remaining JobSeeker unlocks.</p>
<h2>If Mark finds casual work</h2>
<p>With ${h.aud(15000)} a year of casual earnings, Mark's JobSeeker falls further under his own income test, to the point that the household total is about ${h.aud(job.fortnightTotal)} a fortnight of payments, plus the wages. The real cliff comes later: the fortnight his JobSeeker reaches nil, Family Tax Benefit returns to the family income test. On their combined income the family would still receive substantial Family Tax Benefit, so the drop is real but not catastrophic. Reporting income every fortnight keeps the transition smooth.</p>
${h.box('Rent Assistance through Part A', `<p>With children, Rent Assistance is part of Family Tax Benefit Part A, using the couple threshold of ${h.audx(P.ra_family.threshold_couple)} a year (${h.src('fag-ra', 'Family Assistance Guide 3.1.4.30')}). Because Part A is paid at the maximum here, the family keeps all of it; without JobSeeker, the family income test would erode it first.</p>`)}`,
  faqs: [
    { q: 'If my partner works, can I still get JobSeeker?', a: `Yes, if you meet the conditions, but your partner's income reduces your payment once it passes the partner income free area, about ${aud(partnerIncomeFreeArea())} a fortnight with the rates of September 2026. Each dollar above it removes 60 cents. Your own earnings are tested separately under the usual free area and tapers.` },
    { q: 'Does getting JobSeeker increase our Family Tax Benefit?', a: 'It can, a lot. While either parent receives an income support payment such as JobSeeker, Family Tax Benefit Part A and Part B are paid at the maximum rates without the family income test. A family that would otherwise lose Part A to the income test receives the full amount, including Rent Assistance for renters.' },
    { q: 'What happens to our FTB when my JobSeeker stops?', a: 'Family Tax Benefit goes back to the family income test from the day the JobSeeker stops. Part A is then reduced by 20 cents per dollar of family income above the free area, Rent Assistance first, and Part B is tested on the lower earner’s income. The calculator shows both situations side by side.' },
  ],
});

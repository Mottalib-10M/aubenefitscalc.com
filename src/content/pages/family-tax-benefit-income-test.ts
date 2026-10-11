import { definePage } from '../../lib/page-types';
import { P, aud, ftbA, ftbACutoffs } from '../../lib/kit';

const ages = [3, 9];
const rows = [60000, 80000, 100000, 123000, 135000, 150000, 170000].map((ati) => { const r = ftbA({ ages, ati }); return { ati, ...r }; });
const cut = ftbACutoffs(ages);
const at = (ati: number) => ftbA({ ages, ati });

export default definePage({
  id: 'family-tax-benefit-income-test',
  group: 'families',
  kind: 'guide',
  order: 40,
  slug: 'family-tax-benefit-income-test',
  nav: 'FTB income test',
  card: 'Method 1 and Method 2 side by side, with the incomes where each one takes over.',
  title: 'FTB Income Test 2026-27: Method 1, Method 2 and Cut-offs',
  description: `FTB income test for 2026-27: 20 cents in the dollar above ${aud(P.ftb.a_ifa)}, 30 cents above ${aud(P.ftb.a_hifa)}, and the point where Method 2 pays more than Method 1 each year.`,
  h1: 'The Family Tax Benefit income test, step by step',
  intro: 'Two formulas, one payment: how Centrelink reduces Part A as family income rises, and why Part B works differently.',
  resume: `The Family Tax Benefit Part A income test reduces the payment by 20 cents for each dollar of family income above ${aud(P.ftb.a_ifa)} and by 30 cents for each dollar above ${aud(P.ftb.a_hifa)}, in the 2026-27 income year. Centrelink applies it twice. Method 1 tapers the maximum rate and is never allowed below the base rate while income stays at or under ${aud(P.ftb.a_hifa)}; Method 2 starts from the base rate and only tapers above ${aud(P.ftb.a_hifa)}. The family is paid the higher result. For two children aged 3 and 9, Part A reaches the base rate at about ${aud(cut.baseReachedAt)} of family income and stops at about ${aud(cut.nilAt)}. Part B has its own test, on the higher earner first and then the lower earner alone. Neither test applies while a parent receives an income support payment such as JobSeeker or Parenting Payment.`,
  mini: 'ftbIncomeTest',
  miniArg: { ages, income: 120000 },
  related: ['family-tax-benefit-calculator', 'family-tax-benefit-part-a', 'family-tax-benefit-part-b', 'centrelink-income-test', 'couple-two-incomes-child-care'],
  sources: ['fag-ftb-m1', 'fag-ftb-m2', 'fag-ftb-rates', 'sa-ftb-m1', 'sa-ftb-m2'],
  body: (h) => `
<h2>The three income bands</h2>
<p>Picture family income as a line with two marks on it. Up to the first mark, ${h.aud(P.ftb.a_ifa)}, nothing is taken off. Between the two marks, every dollar costs 20 cents of Part A, but only down to the base rate: once a family has lost everything above the base rate, extra income in this band costs nothing more. Past the second mark, ${h.aud(P.ftb.a_hifa)}, every dollar costs 30 cents, and this time the base rate goes too. Those three bands are the whole of the Part A test (${h.src('fag-ftb-m1', 'Family Assistance Guide 3.1.4.40')}).</p>
<p>Family income here means adjusted taxable income for the financial year, both partners added together. It is not take-home pay: salary before tax, plus items such as reportable fringe benefits and reportable superannuation contributions, plus a net investment loss added back.</p>
<h2>Why there are two methods</h2>
<p>Method 1 and Method 2 are two ways of doing the same arithmetic. Method 1 starts high, at the maximum rate with any Rent Assistance and supplement, and applies the 20 cent and 30 cent tapers. Method 2 starts low, at the base rate, and applies only the 30 cent taper above the higher mark. ${h.src('fag-ftb-m2', 'Section 3.1.8.20')} tells Centrelink to compute both and pay the higher. Below the higher income free area, Method 1 always wins or ties, because it cannot fall under the base rate. Above it, Method 2 often wins, since it has not already spent part of the income on the 20 cent band.</p>
${h.table(['Family income', 'Method 1 (year)', 'Method 2 (year)', 'Paid', 'Per fortnight'], rows.map((r) => [h.aud(r.ati), h.aud(r.method1), h.aud(r.method2), r.annual > 0 ? `Method ${r.method}` : 'nothing', h.aud(r.fortnight)]), 'Two children aged 3 and 9, no rent, 2026-27 rates. Annual amounts include the supplement where income is at or under the supplement limit; the fortnightly column does not.', ['r', 'r', 'r', 'l', 'r'])}
<h2>Reading the table</h2>
<p>At ${h.aud(80000)} the family is in the 20 cent band and still well above the base rate. By ${h.aud(100000)} Method 1 has fallen close to the base rate. At ${h.aud(123000)}, just under the higher mark, both methods give the base rate of the two children. Above it, the two lines separate: at ${h.aud(150000)} Method 1 would pay ${h.aud(at(150000).method1)} and Method 2 pays ${h.aud(at(150000).method2)}, so Method 2 is what reaches the bank account. The last dollar of Part A disappears around ${h.aud(cut.nilAt)}.</p>
<p>Notice the supplement. It belongs to the maximum rate and the base rate, but it is only included when family income is at or under ${h.aud(P.ftb.a_supplement_ati_limit)}. One dollar over that line removes the whole supplement for every child, which is the sharpest step anywhere in the Part A test.</p>
${h.box('A payment switches the test off', `<p>Everything above applies only to families without income support. If either parent receives a pension or allowance, even a small part-rate JobSeeker payment, Part A and Part B are paid at their maximum rates and the family income does not matter for that period. The ${h.a('home', 'household calculator')} applies this automatically.</p>`)}
<h2>Part B is tested differently</h2>
<p>Part B ignores the family total. It first asks whether the higher earner is at or under ${h.aud(P.ftb.b_primary_limit)}; if not, nothing is paid. It then looks only at the lower earner, who can earn ${h.aud(P.ftb.b_ifa)} before Part B starts to fall by 20 cents in the dollar. The two parts can therefore move in opposite directions: a second parent going back to work part time reduces Part B straight away but may barely touch Part A if family income stays under ${h.aud(P.ftb.a_ifa)}. See ${h.a('family-tax-benefit-part-b', 'Family Tax Benefit Part B')}.</p>
<h2>Estimates and the end-of-year check</h2>
<p>Centrelink pays during the year on the income you estimate, then reconciles once both tax returns are processed. Under-estimate and the difference becomes a debt; over-estimate and you receive a top-up. Because the 20 cent band is wide, a ${h.aud(5000)} error in the estimate typically means about ${h.aud(1000)} of Part A to repay or receive. Services Australia's own description of the steps is in its ${h.src('sa-ftb-m2', 'Operational Blueprint for Method 2')}.</p>`,
  faqs: [
    { q: 'What is the difference between FTB Method 1 and Method 2?', a: `Method 1 starts from the maximum rate and reduces it by 20 cents per dollar above ${aud(P.ftb.a_ifa)}, never below the base rate in that band, then by 30 cents above ${aud(P.ftb.a_hifa)}. Method 2 starts from the base rate and reduces it only above ${aud(P.ftb.a_hifa)}. Centrelink calculates both and pays whichever is higher.` },
    { q: 'Does salary sacrifice reduce income for the FTB income test?', a: 'Not in the way people often expect. Adjusted taxable income adds reportable superannuation contributions and reportable fringe benefits back on top of taxable income, so salary sacrificed into super or packaged benefits still counts. A deductible expense that genuinely lowers taxable income does reduce it, as long as it is not a net investment loss, which is also added back.' },
    { q: 'How much Part A do I lose for each extra $1,000 I earn?', a: `In the middle band, between ${aud(P.ftb.a_ifa)} and ${aud(P.ftb.a_hifa)} of family income, ${aud(200)} for each ${aud(1000)}, until the base rate is reached. Above ${aud(P.ftb.a_hifa)}, ${aud(300)} for each ${aud(1000)}. While a parent receives an income support payment, nothing, because the income test does not apply.` },
    { q: 'Why did my FTB fall to almost nothing when income went just over the limit?', a: `Probably the supplement. The Part A supplement of up to ${aud(P.ftb.a_supplement)} per child is only paid when family income is ${aud(P.ftb.a_supplement_ati_limit)} or less. Crossing that line by one dollar removes all of it at reconciliation, so the year's total drops sharply even though the fortnightly payments looked similar.` },
  ],
});

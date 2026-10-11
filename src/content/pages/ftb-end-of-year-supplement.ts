import { definePage } from '../../lib/page-types';
import { P, aud, audx, ftbA, ftbB } from '../../lib/kit';

const kids = [4, 10];
const under = ftbA({ ages: kids, ati: 79000 });
const over = ftbA({ ages: kids, ati: 81000 });
const bTop = ftbB({ ages: kids, couple: true, primaryAti: 60000, secondaryAti: 30000 });

export default definePage({
  id: 'ftb-end-of-year-supplement',
  group: 'families',
  kind: 'guide',
  order: 50,
  slug: 'ftb-end-of-year-supplement',
  nav: 'FTB supplements',
  card: 'The Part A and Part B supplements paid after the tax return, and the $80,000 line.',
  title: 'FTB Supplement 2026-27: Part A and Part B After Tax Time',
  description: `FTB end-of-year supplements for 2026-27: up to ${audx(P.ftb.a_supplement)} per child for Part A under ${aud(P.ftb.a_supplement_ati_limit)} of income, ${audx(P.ftb.b_supplement)} per family for Part B, paid after tax time.`,
  h1: 'The Family Tax Benefit end-of-year supplements',
  intro: 'Part of Family Tax Benefit is held back until the year is over and your income is known. Here is how much, and who misses out.',
  resume: `Each year, part of Family Tax Benefit is paid only after the financial year ends and both partners' incomes have been checked: the Part A supplement, up to ${audx(P.ftb.a_supplement)} for each child in 2026-27, and the Part B supplement, up to ${audx(P.ftb.b_supplement)} per family. The Part A supplement has a hard limit: a family whose adjusted taxable income is above ${aud(P.ftb.a_supplement_ati_limit)} receives none, even if it still gets fortnightly Part A. Both supplements belong to the maximum rate, so the income tests can shrink them too. They are paid once the year has been reconciled, which requires each partner to lodge a tax return or tell Centrelink they do not need to, and Centrelink can use them first to clear an FTB or Child Care Subsidy debt. A family with two children and an income of ${aud(79000)} expects about ${aud(under.supplementPaid)} of Part A supplement; at ${aud(81000)} it gets nothing.`,
  mini: 'ftbSupplement',
  related: ['family-tax-benefit-calculator', 'family-tax-benefit-part-a', 'family-tax-benefit-part-b', 'family-tax-benefit-income-test', 'child-care-subsidy-withholding'],
  sources: ['fag-ftb-rates', 'fag-ftb-m1', 'fag-ftb-b'],
  body: (h) => `
<h2>Why part of the payment waits</h2>
<p>Family Tax Benefit is paid during the year on an estimate of income. The supplements are the part Centrelink keeps back until that estimate has been replaced by the real figure from your tax return. They act as a buffer: if the estimate was too low and you were overpaid, the supplement is the first place the overpayment is recovered from, before any debt notice is sent. If everything was right, it arrives as a lump sum, usually a few weeks after the last tax return in the family has been processed.</p>
<h2>The Part A supplement and its $80,000 line</h2>
<p>The Part A supplement is added to the annual rate of every child, at both the maximum and the base rate, up to ${h.audx(P.ftb.a_supplement)} each. It disappears entirely when family adjusted taxable income passes ${h.aud(P.ftb.a_supplement_ati_limit)}: there is no taper on this condition, only a line (${h.src('fag-ftb-rates', 'Family Assistance Guide 3.1.1.20')}). Below the line, the income test can still reduce it, because it sits inside the maximum rate that the 20 cent taper works on.</p>
${h.table(['Family income', 'Fortnightly Part A for the year', 'Part A supplement', 'Total Part A'], [[h.aud(79000), h.aud(under.annualNoSupplement), h.aud(under.supplementPaid), h.aud(under.annual)], [h.aud(81000), h.aud(over.annualNoSupplement), h.aud(over.supplementPaid), h.aud(over.annual)]], 'Two children aged 4 and 10, couple, no rent, 2026-27 rates.', ['r', 'r', 'r', 'r'])}
<p>The table shows the cost of crossing the line for a two-child family: ${h.aud(under.annual - over.annual)} of Part A lost for ${h.aud(2000)} more income. A family close to the limit should know that salary sacrifice does not move it under the line: reportable superannuation contributions are added back to adjusted taxable income, and so are reportable fringe benefits.</p>
<h2>The Part B supplement</h2>
<p>The Part B supplement is one amount per family, up to ${h.audx(P.ftb.b_supplement)}. It has no separate income line: it is part of the Part B rate and falls with it under the lower earner test. A couple whose lower earner makes ${h.aud(30000)} keeps ${h.aud(bTop.supplementPaid)} of it, for instance, because the 20 cent taper has already taken the rest. A single parent under the primary earner limit receives the full supplement.</p>
${h.box('What makes the supplements disappear', `<p>Not lodging. If you or your partner do not lodge a tax return when required, or do not tell Centrelink that you are not required to, the year cannot be reconciled and the supplements are not paid. Centrelink can also ask for the whole year's Family Tax Benefit back. Debts for Family Tax Benefit or Child Care Subsidy, and certain tax debts, are taken out of the supplements first (${h.src('fag-ftb-rates', 'Family Assistance Guide 3.1.1.20')}).</p>`)}
<h2>A worked year</h2>
<p>Consider a couple with two children aged 4 and 10 who estimate a family income of ${h.aud(76000)} for the year. Each fortnight they receive Part A and Part B without supplements. In August, after both tax returns are processed, their actual income turns out to be ${h.aud(78500)}: still under the ${h.aud(P.ftb.a_supplement_ati_limit)} line, so the Part A supplement is paid, but the extra ${h.aud(2500)} of income means they were overpaid ${h.aud(500)} of Part A during the year. Centrelink takes that ${h.aud(500)} out of the supplements and pays the balance. Had their income come in at ${h.aud(80500)}, the Part A supplement would have been nil and the ${h.aud(900)} overpayment would have been taken from the Part B supplement, with any remainder raised as a debt.</p>
<h2>Planning around the supplements</h2>
<p>The supplements are useful money, but they are not a reliable part of a fortnightly budget. A family whose income moved during the year should expect them to be smaller, or to be absorbed by an overpayment. Updating the income estimate in your Centrelink online account as soon as a pay rise or a new job starts is the best way to receive them intact. If you claim Family Tax Benefit as a lump sum after the year instead of fortnightly, the supplements are simply included in that single payment.</p>
<p>The supplements are included in the yearly totals of the ${h.a('family-tax-benefit-calculator', 'Family Tax Benefit calculator')} and of the ${h.a('home', 'household calculator')}, and kept out of the fortnightly figures, as Centrelink pays them.</p>`,
  faqs: [
    { q: 'When is the FTB supplement paid?', a: 'After the financial year ends and the year has been reconciled, which happens once you and your partner have lodged your tax returns, or told Centrelink you do not need to. For most families that means some time after July, a few weeks after the last return in the household is processed by the ATO and the income is passed to Centrelink.' },
    { q: 'Why did I get no Part A supplement this year?', a: `The most common reason is income: the Part A supplement is not paid at all when family adjusted taxable income is above ${aud(P.ftb.a_supplement_ati_limit)}. Other reasons are an unlodged tax return, or an FTB, Child Care Subsidy or tax debt that Centrelink recovered from the supplement before paying the balance.` },
    { q: 'Is the Part B supplement paid per child or per family?', a: `Per family. Whatever the number of children, Part B and its supplement are a single family amount, up to ${audx(P.ftb.b_supplement)} in 2026-27. It falls with the rest of Part B when the lower earner's income is above the free area, and it is not paid if the higher earner is over the primary earner limit.` },
  ],
});

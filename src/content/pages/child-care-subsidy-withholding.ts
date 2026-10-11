import { definePage } from '../../lib/page-types';
import { P, aud, ccsFamily, ccsStandardPct } from '../../lib/kit';

const fam = ccsFamily({ ati: 120000, activityHoursPf: 60, children: [{ age: 3, daysPerWeek: 4, hoursPerDay: 10, dailyFee: 145, type: 'cbdc' }] });
const yearSub = fam.subsidyPf * 24;
const pctLow = ccsStandardPct(120000);
const pctHigh = ccsStandardPct(135000);
const debt = (fam.subsidyPf / pctLow) * (pctLow - pctHigh) * 24;

export default definePage({
  id: 'child-care-subsidy-withholding',
  group: 'childcare',
  kind: 'guide',
  order: 60,
  slug: 'child-care-subsidy-withholding',
  nav: 'CCS withholding',
  card: 'The 5% held back each week, how to change it, and how it protects you from a debt.',
  title: 'CCS Withholding 2026: the 5% Buffer and How to Change It',
  description: `CCS withholding in 2026: ${P.ccs.withholding_default}% of each week's Child Care Subsidy is held back until reconciliation. How much that is over a year, and when to raise or lower it.`,
  h1: 'Child Care Subsidy withholding',
  intro: 'Every week, a slice of your subsidy is kept back until your income for the year is known. Why, how much, and what you can change.',
  resume: `Before Child Care Subsidy reaches your centre, Services Australia keeps back ${P.ccs.withholding_default}% of it by default, and pays the balance. The withheld amount builds up over the financial year and is settled at reconciliation, once your actual family income is known from the tax returns: if your income estimate was right or too high, it comes back to you as a lump sum; if your income was higher than estimated, it is used first to cover the overpayment. For a family receiving about ${aud(fam.subsidyPf)} of subsidy a fortnight, the default withholding keeps back about ${aud(fam.withheldPf)} a fortnight, close to ${aud(yearSub * P.ccs.withholding_default / 100)} over 24 fortnights of care. You can choose any rate from 0% to 100% in your Centrelink online account, up to twice a year. Additional Child Care Subsidy is never withheld.`,
  mini: 'ccsWithholding',
  related: ['child-care-subsidy-calculator', 'child-care-subsidy-income-thresholds', 'ftb-end-of-year-supplement', 'higher-child-care-subsidy'],
  sources: ['fag-ccs-calc', 'fag-ccs-income'],
  body: (h) => `
<h2>Why the subsidy is held back</h2>
<p>Your percentage during the year is set on the family income you estimate. Nobody knows the real figure until both tax returns are processed, months after the care was used. Withholding is a cushion for the gap between the two (${h.src('fag-ccs-calc', 'Family Assistance Guide 3.5.4')}). Without it, a family whose income came in higher than expected would receive a debt notice for the whole difference; with it, part or all of that difference is already sitting with Services Australia.</p>
<h2>How big a cushion you need</h2>
<p>Take a family with a three-year-old in day care four days a week at ${h.aud(145)}, estimating ${h.aud(120000)} of family income, which gives ${pctLow}%. The subsidy is about ${h.aud(fam.subsidyPf)} a fortnight. If the actual income turns out to be ${h.aud(135000)}, the percentage should have been ${pctHigh}%, and the subsidy for 24 fortnights of care was overpaid by roughly ${h.aud(debt)}. The default ${P.ccs.withholding_default}% would have kept back about ${h.aud(fam.withheldPf * 24)} over the same period: enough to absorb ${debt <= fam.withheldPf * 24 ? 'the whole overpayment' : 'part of it'}.</p>
<p>The rule of thumb that follows: each ${h.aud(P.ccs.step)} by which income is underestimated costs about one percentage point of the subsidy for the year. A family expecting a bonus, overtime or a new job part way through the year has more reason to raise withholding than a family on a stable salary.</p>
${h.box('Raising or lowering the rate', `<p>You can change the withholding percentage to anything between 0% and 100%, through your Centrelink online account via myGov or by contacting Centrelink, up to two times a year. Setting 0% maximises what the centre receives each week, at the price of any reconciliation difference becoming a debt. Setting a high percentage makes your gap fee bigger during the year and the end-of-year payment bigger too.</p>`)}
<h2>What happens at reconciliation</h2>
<p>After the year ends and the family's tax returns are processed, Centrelink recalculates the subsidy for every session of care using the actual income. The amount you were entitled to is compared with what was paid to the centre. Any shortfall is paid to you, together with the unused part of the withholding; any excess is first taken from the withheld amount, and only the remainder becomes a debt. Not lodging a tax return when required, or not confirming income, prevents reconciliation and can make the whole year's subsidy repayable.</p>
<h2>Who should change the default</h2>
<p>A household on stable salaries, with an estimate based on last year's tax return plus a known pay rise, is usually well served by the default. Families with commission, bonuses, shift loadings, seasonal or self-employed income, or a partner returning to work during the year carry more risk of underestimating, and a higher withholding rate turns a possible debt into a smaller refund. A family that has just had a large income drop, for example after a redundancy, may prefer a lower rate, provided the new estimate is realistic and reported to Centrelink straight away.</p>
<p>Whatever the rate, the most effective protection is an accurate estimate. A new estimate takes effect from the start of the next CCS fortnight (${h.src('fag-ccs-income', 'Family Assistance Guide 3.5.1')}), so updating it as soon as income changes limits the number of fortnights paid at the wrong percentage.</p>
<h2>Withholding and other end-of-year amounts</h2>
<p>The Family Tax Benefit supplements are also paid after reconciliation, and Centrelink can use them to offset a Child Care Subsidy debt. A family that receives both often finds the two end-of-year amounts move together: if income rose during the year, both the supplements and the withheld subsidy shrink. See ${h.a('ftb-end-of-year-supplement', 'the FTB supplements')} and, for the percentage itself, ${h.a('child-care-subsidy-income-thresholds', 'the income thresholds')}.</p>`,
  faqs: [
    { q: 'Do I get my Child Care Subsidy withholding back?', a: 'Yes, if your income estimate was right or too high. At reconciliation, after your family’s tax returns are processed, the withheld amount is paid to you as a lump sum. If your actual income was higher than your estimate, the withholding is used first to cover the overpayment, and you receive only what is left, if anything.' },
    { q: 'Should I set my CCS withholding to 0%?', a: `Only if your income is very predictable. At 0% the centre receives the full subsidy each week and your gap fee is as low as possible, but any difference at reconciliation becomes a debt. The default is ${P.ccs.withholding_default}%; families expecting income to rise during the year often choose more.` },
    { q: 'Is Additional Child Care Subsidy withheld too?', a: 'No. Withholding applies only to the standard and higher rates of Child Care Subsidy, which are income tested. Additional Child Care Subsidy, paid in situations such as temporary financial hardship or for a child at risk, is not withheld, because it does not depend on an income estimate that could change.' },
  ],
});

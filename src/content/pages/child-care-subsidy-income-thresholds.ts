import { definePage } from '../../lib/page-types';
import { P, aud, ccsStandardPct, ccsHigherPct } from '../../lib/kit';

const marks = [80000, 88520, 100000, 125000, 150000, 175000, 200000, 250000, 300000, 350000, 400000, 450000, 500000, 538520];

export default definePage({
  id: 'child-care-subsidy-income-thresholds',
  group: 'childcare',
  kind: 'guide',
  order: 40,
  slug: 'child-care-subsidy-income-thresholds',
  nav: 'CCS income thresholds',
  card: 'Your CCS percentage at every income, standard and higher rates, for 2026-27.',
  title: 'CCS Income Thresholds 2026-27: Percentage by Family Income',
  description: `Child Care Subsidy income thresholds for 2026-27: ${P.ccs.max_pct}% to ${aud(P.ccs.lower_threshold)}, one point less per ${aud(P.ccs.step)}, nil from ${aud(P.ccs.zero_at)}. The full table of percentages by income.`,
  h1: 'Child Care Subsidy income thresholds for 2026-27',
  intro: 'One table to find your subsidy percentage, and the rules behind each line.',
  resume: `In the 2026-27 income year, a family with a combined adjusted taxable income of ${aud(P.ccs.lower_threshold)} or less receives the maximum Child Care Subsidy of ${P.ccs.max_pct}% of its fee, up to the hourly rate cap. Above that, the percentage drops by one point for each ${aud(P.ccs.step)} of income, or part of ${aud(P.ccs.step)}, so a family on ${aud(150000)} is at ${ccsStandardPct(150000)}%, one on ${aud(250000)} at ${ccsStandardPct(250000)}%, and the subsidy reaches zero at ${aud(P.ccs.zero_at)}. A second income test gives a higher percentage, up to ${P.ccs.higher.full_pct}%, to each younger child aged 5 or under while income is under ${aud(P.ccs.higher.cutoff)}. The thresholds are indexed every 1 July, and the percentage is set during the year on your income estimate, then checked against your actual income after the tax returns, with any difference paid to you or recovered as a debt.`,
  mini: 'ccsPct',
  miniArg: { income: 175000 },
  related: ['child-care-subsidy-calculator', 'higher-child-care-subsidy', 'child-care-subsidy-withholding', 'child-care-subsidy-hourly-rate-cap', 'family-tax-benefit-income-test'],
  sources: ['fag-ccs-income', 'fag-ccs-calc'],
  body: (h) => `
<h2>The table</h2>
${h.table(['Combined family income', 'Standard rate', 'Higher rate, younger child 5 or under'], marks.map((m) => { const hi = ccsHigherPct(m); return [h.aud(m), `${ccsStandardPct(m)}%`, hi === null ? 'not available' : `${hi}%`]; }), 'Family Assistance Guide 3.5.1, 2026-27 income year. Percentages of the fee, up to the hourly rate cap.', ['r', 'r', 'r'])}
<h2>How the standard percentage is worked out</h2>
<p>Start at ${P.ccs.max_pct}%. Subtract the lower threshold of ${h.aud(P.ccs.lower_threshold)} from your combined income. Divide what is left by ${h.aud(P.ccs.step)} and round up to the next whole number. Take that number of points off ${P.ccs.max_pct}%. A family on ${h.aud(112000)} is ${h.aud(112000 - P.ccs.lower_threshold)} over the threshold, which is four full steps and part of a fifth, so its percentage is ${ccsStandardPct(112000)}%. The guide's own example, a family on ${h.aud(288520)}, comes out at exactly ${ccsStandardPct(288520)}% (${h.src('fag-ccs-calc', 'Family Assistance Guide 3.5.4')}).</p>
<p>Because the steps round up, the cheapest place to be is just under a threshold step. That rarely justifies working less, since a ${h.aud(5000)} step changes the subsidy by one percentage point of the capped fee, but it is a reason to keep the income estimate accurate rather than generous or cautious.</p>
<h2>What counts as family income</h2>
<p>Child Care Subsidy uses adjusted taxable income, the same measure as Family Tax Benefit: taxable income of both partners plus items such as reportable fringe benefits, reportable superannuation contributions and net investment losses. Taxable Centrelink payments count; Family Tax Benefit and the subsidy itself do not. A single parent's income is assessed alone. Everyone claiming the subsidy must give an estimate, including families on income support (${h.src('fag-ccs-income', 'section 3.5.1')}).</p>
${h.box('Estimate during the year, actual income at the end', `<p>The subsidy paid each week uses your estimate. After the financial year, Centrelink reconciles it with the income from your tax returns: if your actual income was higher, you may owe money; if lower, you receive a top-up. A new estimate applies from the start of the next CCS fortnight, so update it as soon as a job or pay changes. The ${P.ccs.withholding_default}% withholding exists to absorb small differences, see ${h.a('child-care-subsidy-withholding', 'withholding')}.</p>`)}
<h2>Where to find your figure</h2>
<p>Read down the first column to the line just below your expected combined income, then read across. If your income falls between two lines, work it out with the method below or enter it in the mini calculator above, which applies the exact rule. Both columns move only in whole points, so the table never misleads by more than a few points between lines.</p>
<h2>Three families on the table</h2>
<p>A couple on two modest salaries totalling ${h.aud(85000)} is under the lower threshold and receives the full ${P.ccs.max_pct}%; the subsidy then depends only on the fee, the hours and the cap. A couple on ${h.aud(160000)} is ${h.aud(160000 - P.ccs.lower_threshold)} above the threshold, which is fifteen steps of ${h.aud(P.ccs.step)} rounded up, leaving ${ccsStandardPct(160000)}% for the eldest child and ${ccsHigherPct(160000)}% for a younger sibling aged 5 or under. A household on ${h.aud(420000)} still receives ${ccsStandardPct(420000)}% for every child, because the higher rate stops at ${h.aud(P.ccs.higher.cutoff)} but the standard rate continues down to zero at ${h.aud(P.ccs.zero_at)}.</p>
<p>Compared with Family Tax Benefit, these thresholds reach much higher incomes. A family that receives no Family Tax Benefit at all can still have a substantial subsidy, which is why the ${h.a('home', 'household calculator')} shows both: a two-income family above the Part A cut-off may find Child Care Subsidy is its only Centrelink payment.</p>
<h2>Indexation</h2>
<p>The lower threshold of ${h.aud(P.ccs.lower_threshold)} is indexed to the consumer price index at the start of each financial year, and the other thresholds move with it, so the whole table shifts every 1 July. The figures above apply to the 2026-27 year; the subsidy for care used in July 2027 onward will use new thresholds. Because the steps stay ${h.aud(P.ccs.step)} and ${h.aud(P.ccs.higher.step)} wide while the starting points move, the percentage for an unchanged income usually rises slightly each July, and a pay rise in line with prices leaves it about where it was.</p>`,
  faqs: [
    { q: 'What CCS percentage do I get on a family income of $200,000?', a: `${ccsStandardPct(200000)}% for the eldest child in care in 2026-27, applied to the lower of your fee and the hourly cap. A second or younger child aged 5 or under gets the higher rate of ${ccsHigherPct(200000)}% at that income. The figures assume your income estimate is right; the year is reconciled after your tax returns.` },
    { q: 'Is the CCS income threshold based on my income or our family income?', a: 'On combined family income: your adjusted taxable income plus your partner’s, if you have one. A single parent is assessed on their own income. The estimate covers the whole financial year from 1 July to 30 June, and Centrelink checks it against the tax returns of both partners once the year ends.' },
    { q: 'Why does $1 more income lower my CCS by a whole percentage point?', a: `Because the percentage drops by one point for each ${aud(P.ccs.step)} or part of ${aud(P.ccs.step)} above the threshold. The first dollar of a new step counts as a full step. The effect on your fees is small, one point of the capped hourly fee, but it explains why two families with almost the same income can be one point apart.` },
  ],
});

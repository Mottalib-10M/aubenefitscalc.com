import { definePage } from '../../lib/page-types';
import { P, aud, ppl } from '../../lib/kit';

const cases: Array<[string, number, number, boolean]> = [
  ['Claimant on $150,000, partner on $210,000', 150000, 210000, true],
  ['Claimant on $190,000, partner on $150,000', 190000, 150000, true],
  ['Claimant on $190,000, partner on $200,000', 190000, 200000, true],
  ['Single claimant on $185,000', 185000, 0, false],
  ['Single claimant on $195,000', 195000, 0, false],
];
const rows = cases.map(([l, o, p, c]) => { const r = ppl({ partnered: c, ownAti: o, partnerAti: p, workTest: true }); return [l, aud(o + (c ? p : 0)), r.incomeOk ? 'passes' : 'fails']; });

export default definePage({
  id: 'paid-parental-leave-income-test',
  group: 'work',
  kind: 'guide',
  order: 120,
  slug: 'paid-parental-leave-income-test',
  nav: 'PPL income test',
  card: 'The individual and family income limits, the reference year and who they apply to.',
  title: 'Paid Parental Leave Income Test 2026-27: the Two Limits',
  description: `Paid Parental Leave income test from 1 July 2026: pass with your own income up to ${aud(P.ppl.individual_limit)} or a family income up to ${aud(P.ppl.family_limit)}, on the 2025-26 reference year.`,
  h1: 'The Paid Parental Leave income test',
  intro: 'Two limits, either of which is enough, measured on a past year. How to tell whether you qualify before the baby arrives.',
  resume: `To receive Parental Leave Pay you must pass an income test, and there are two ways to pass it. From 1 July 2026, you pass if your own adjusted taxable income for the reference year is ${aud(P.ppl.individual_limit)} or less. If it is higher, you can still pass on family income: if you are partnered when you first claim, your income and your partner's together must be ${aud(P.ppl.family_limit)} or less; if you are single, your own income must be under that family limit. For claims assessed from 1 July 2026 the reference year is the 2025-26 financial year, generally the year before the birth or the claim. Both limits are indexed each 1 July. Passing the income test is not enough on its own: the work test must also be met, and each parent who takes days, including the partner who takes the reserved ${P.ppl.reserved_days} days, is tested separately.`,
  mini: 'pplIncome',
  related: ['paid-parental-leave-calculator', 'new-parents-first-baby', 'family-tax-benefit-part-b', 'centrelink-income-test'],
  sources: ['ppl-income', 'ppl-max', 'ppl-rate'],
  body: (h) => `
<h2>Either limit is enough</h2>
<p>The Paid Parental Leave Guide sets out three ways to satisfy the test: your own adjusted taxable income for the reference year is not more than the individual limit; or, if you are single at the time of your initial claim, your own income is not more than the family limit; or, if you are partnered at that time, your income plus your partner's is not more than the family limit (${h.src('ppl-income', 'Paid Parental Leave Guide 2.3')}). In practice, a single claimant passes up to the family limit, and a partnered claimant whose own income is above the individual limit is saved if the household total stays under the family limit.</p>
${h.table(['Situation', 'Income tested', 'Income test'], rows, `Limits applying from 1 July 2026: individual ${aud(P.ppl.individual_limit)}, family ${aud(P.ppl.family_limit)}, on the 2025-26 reference year.`, ['l', 'r', 'l'])}
<h2>The reference year</h2>
<p>The income measured is not your current salary but your adjusted taxable income for the reference income year. The guide's table pairs each limit with its reference year: the limits that apply from 1 July 2026 are measured on 2025-26 income (${h.src('ppl-income', 'section 2.3.4')}). A parent whose income has fallen, for instance after moving to part-time work during pregnancy, is still assessed on the earlier year, which can work against them; a parent whose income has risen benefits from the lag.</p>
<h2>How the limits have moved</h2>
<p>The individual limit was a flat ${h.aud(150000)} for many years. Indexation began in 2021, and the limit applying from 1 July 2026 is ${h.aud(P.ppl.individual_limit)}. The family limit was introduced on 1 July 2023 at ${h.aud(350000)} and now stands at ${h.aud(P.ppl.family_limit)}. Both are indexed each 1 July, so a family near a limit should check the figure that applies on the day its claim is assessed.</p>
${h.box('Adjusted taxable income, not salary', `<p>Adjusted taxable income is taxable income plus items such as reportable fringe benefits, reportable superannuation contributions, net investment losses, some tax-free pensions and certain foreign income, less child support paid. Salary packaging therefore does not lower it much. Two parents on the same salary can have quite different adjusted taxable incomes.</p>`)}
<h2>Each parent is tested</h2>
<p>When a couple shares the entitlement, each parent who claims days must pass the work test and the income test in their own right. A partner who wants to take the ${h.aud(P.ppl.reserved_days * P.ppl.daily)} of reserved days, ${P.ppl.reserved_days} days at ${h.audx(P.ppl.daily)}, cannot use the birth parent's test result. The family limit uses the same combined figure for both, so a couple under the family limit usually passes the income test twice, but the work test can still fail for one of them.</p>
<h2>Planning before the birth</h2>
<p>A claim can be lodged up to three months before the expected date of birth, and the income test is assessed on the reference year that applies at that point. Couples close to a limit should look at three figures: each parent's adjusted taxable income for the reference year, their total, and the limits in force on the date of assessment. Because the limits rise every 1 July while the reference year moves forward, a family just above a limit in one year can find itself under it the next. Where one parent is clearly under the individual limit, that parent claiming first keeps things simple; the other parent's own eligibility for the reserved days is tested separately whatever the order.</p>
<p>The work test, measured over the 392 days before the birth, is checked at the same time (${h.src('ppl-work', 'Paid Parental Leave Guide 2.2.2')}). A parent who changed jobs or had a break should count their working days and hours early, since a shortfall cannot be fixed after the birth.</p>
<h2>What if you fail</h2>
<p>A parent who fails the income test cannot receive Parental Leave Pay for that child, but the other parent may still pass and claim the days available to them. A family that fails both tests may still receive Family Tax Benefit Part A if its income allows, and Child Care Subsidy later. The ${h.a('paid-parental-leave-calculator', 'Paid Parental Leave calculator')} applies both limits to your figures.</p>`,
  faqs: [
    { q: 'What is the income limit for Paid Parental Leave in 2026?', a: `For claims assessed from 1 July 2026, an individual adjusted taxable income of ${aud(P.ppl.individual_limit)} or less in the 2025-26 reference year, or a family income of ${aud(P.ppl.family_limit)} or less. You pass if you meet either limit, so a claimant above the individual limit can still qualify on family income.` },
    { q: 'Does my partner’s income count for Paid Parental Leave?', a: `Only for the family test. If your own income is ${aud(P.ppl.individual_limit)} or less, your partner's income does not matter. If your income is higher, you can still pass if your combined income with your partner is ${aud(P.ppl.family_limit)} or less, measured on the reference year.` },
    { q: 'Which year’s income is used for Paid Parental Leave?', a: 'The reference income year, generally the financial year before your claim. For the limits applying from 1 July 2026, that is the 2025-26 year. A drop in income during pregnancy does not usually help, because the test looks at the earlier year, but an income increase in the current year does not count against you either.' },
  ],
});

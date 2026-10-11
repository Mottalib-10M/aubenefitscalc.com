import { definePage } from '../../lib/page-types';
import { P, aud, audx, faFortnight, ftbA, ftbACutoffs } from '../../lib/kit';

const fp = (n: number) => audx(Math.round(faFortnight(n) * 100) / 100);
const three = ftbA({ ages: [2, 7, 14], ati: 105000 });
const cut1 = ftbACutoffs([6]);
const cut3 = ftbACutoffs([2, 7, 14]);
const ex = ftbA({ ages: [1, 5], ati: 70000 });

export default definePage({
  id: 'family-tax-benefit-part-a',
  group: 'families',
  kind: 'guide',
  order: 20,
  slug: 'family-tax-benefit-part-a',
  nav: 'FTB Part A',
  card: 'The per-child payment: rates by age, the base rate floor and when it stops.',
  title: 'Family Tax Benefit Part A 2026-27: Rates per Child, Limits',
  description: `Family Tax Benefit Part A in 2026-27: ${fp(P.ftb.a_max_under13)} a fortnight per child under 13, the base rate floor, both income tests and the ${audx(P.ftb.a_supplement)} end-of-year supplement.`,
  h1: 'Family Tax Benefit Part A: what each child brings in',
  intro: 'Part A is paid for every child in your care; how much depends on their ages and on your family income.',
  resume: `Family Tax Benefit Part A is paid per child, not per family. In the 2026-27 income year the maximum is ${audx(P.ftb.a_max_under13)} a year for a child under 13 and ${audx(P.ftb.a_max_13to19)} for a child of 13 to 15, or of 16 to 19 in full-time secondary school, which Centrelink pays as ${fp(P.ftb.a_max_under13)} and ${fp(P.ftb.a_max_13to19)} a fortnight. A family income above ${aud(P.ftb.a_ifa)} reduces it by 20 cents in the dollar, but never below the base rate of ${audx(P.ftb.a_base)} per child while income stays at or under ${aud(P.ftb.a_hifa)}; above that, 30 cents in the dollar apply until nothing is left. After the tax return, families with an income of ${aud(P.ftb.a_supplement_ati_limit)} or less also receive a supplement of up to ${audx(P.ftb.a_supplement)} per child. A family receiving an income support payment is paid the maximum rate whatever it earns.`,
  mini: 'ftbPartA',
  related: ['family-tax-benefit-calculator', 'family-tax-benefit-income-test', 'family-tax-benefit-rates', 'ftb-end-of-year-supplement', 'family-tax-benefit-for-teenagers', 'rent-assistance-for-families'],
  sources: ['fag-ftb-rates', 'fag-ftb-m1', 'fag-ftb-m2', 'sa-ftb-m1'],
  body: (h) => `
<h2>Two rates for every child</h2>
<p>Each child has a maximum rate and a base rate. The maximum rate depends on age: a child is on the lower maximum until the day they turn 13, then on the higher one, which is meant to cover the larger costs of a teenager. The base rate is the same at every age. Whatever happens to your income in the middle band, a child's Part A cannot fall under that base rate, which is why families on fairly comfortable salaries still see a small Part A payment each fortnight.</p>
<p>The two rates come with their own formulas, Method 1 and Method 2, and Centrelink applies whichever gives you more. In practice Method 1 decides for most families; Method 2 only takes over above the higher income free area of ${h.aud(P.ftb.a_hifa)}, where it lets the base rate taper away more slowly than Method 1 would. The ${h.a('family-tax-benefit-income-test', 'income test guide')} walks through both with worked figures.</p>
${h.table(['Child', 'Maximum per year', 'Maximum per fortnight', 'Base per fortnight'], [['Under 13', h.audx(P.ftb.a_max_under13), fp(P.ftb.a_max_under13), fp(P.ftb.a_base)], ['13 to 15, or 16 to 19 at school', h.audx(P.ftb.a_max_13to19), fp(P.ftb.a_max_13to19), fp(P.ftb.a_base)]], 'Family Assistance Guide 3.1.1.20, 2026-27. Fortnightly amounts are 14 days of the annual rate divided by 365.', ['l', 'r', 'r', 'r'])}
<h2>A worked example with three children</h2>
<p>Take a couple with children aged 2, 7 and 14 and a family income of ${h.aud(105000)}. Their maximum rate is two child rates at the lower maximum and one at the higher, plus nothing for the supplement because their income is above ${h.aud(P.ftb.a_supplement_ati_limit)}. Method 1 removes 20 cents for each dollar above ${h.aud(P.ftb.a_ifa)}, a reduction of ${h.aud(three.reductionMethod1)}. What remains, ${h.aud(three.method1)} for the year, is above their three base rates, so Method 1 pays: about ${h.aud(three.fortnight)} a fortnight. Part A for this family runs out completely only at about ${h.aud(cut3.nilAt)} of income, against about ${h.aud(cut1.nilAt)} for a family with one six-year-old.</p>
${h.mini('ftbIncomeTest', { ages: [2, 7, 14], income: 105000 })}
<h2>Who counts as your child for Part A</h2>
<p>You need to care for the child at least 35% of the time and be responsible for them (${h.src('fag-ra', 'Family Assistance Guide 3.1.4.30')} sets out the care bands). Between 35% and 65% of care, Part A is shared according to the care percentage; this site does not model shared care and assumes the child lives with you full time. A young person aged 16 to 19 counts only while in full-time secondary study or an approved equivalent; from the end of that study, Part A for them stops and they may be eligible for ${h.a('youth-allowance-calculator', 'Youth Allowance')} in their own right.</p>
<p>A newborn adds a child at the lower maximum from birth. A couple with children aged 1 and 5 and an income of ${h.aud(70000)}, for example, receives ${h.aud(ex.fortnight)} a fortnight of Part A and, because they are under ${h.aud(P.ftb.a_supplement_ati_limit)}, ${h.aud(ex.supplementPaid)} of supplement after the year is reconciled.</p>
<h2>What can push Part A to the base rate</h2>
<p>Income is the main one, but three other things also restrict a child to the base rate. Child support you are entitled to but do not take reasonable action to collect limits Part A to the base rate for that child. A payment from another Commonwealth scheme that already includes an amount for the child has the same effect. And the maintenance income test reduces the part above the base rate when child support received passes the free area of ${h.audx(P.ftb.mifa_single)} a year for a single parent, plus ${h.audx(P.ftb.mifa_extra_child)} for each further child (${h.src('fag-ftb-rates', 'Family Assistance Guide 3.1.1.20')}).</p>
${h.box('Rent Assistance lives inside Part A', `<p>If you rent privately, Rent Assistance is added to Part A under Method 1 rather than paid separately. It is also the first part to go when income reduces Part A, so a family whose rate has fallen to the base rate has no Rent Assistance left. See ${h.a('rent-assistance-for-families', 'Rent Assistance for families')}.</p>`)}
<h2>Part A next to your other payments</h2>
<p>Part A is rarely the only payment in a family. A parent on Parenting Payment, JobSeeker or a pension lifts the income test entirely, so the household receives every child's maximum rate however much the other partner earns. Child Care Subsidy is assessed separately on the same family income but with its own thresholds, and a family whose Part A has shrunk to the base rate can still receive a high subsidy percentage for day care. Part B is a second, smaller payment with a different test that looks at each partner's income on its own. The ${h.a('home', 'household calculator')} puts all of these side by side for one family, which is the quickest way to see whether a change of job, hours or rent moves one payment or several.</p>
<p>Part A is also tax-free and is not counted as income for other Centrelink payments. That matters for a parent whose main payment is income tested: receiving more Part A never reduces Parenting Payment or JobSeeker.</p>
<h2>Estimate, reconciliation and the end of the year</h2>
<p>Part A is paid during the year on the family income you estimate. Once both partners' tax returns are processed, Centrelink compares what it paid with what your actual income allows. A top-up is paid if you were underpaid, together with the supplement if you qualify; an overpayment becomes a debt, which Centrelink often recovers from future payments or from the supplement itself. Updating the estimate when a job or hours change is the simplest way to avoid that.</p>
<p>The rates on this page are those of ${h.src('fag-ftb-rates', 'Family Assistance Guide 3.1.1.20')}, which records the 2026-27 amounts, and the income test follows ${h.src('fag-ftb-m1', 'section 3.1.4.40')} and ${h.src('fag-ftb-m2', 'section 3.1.8.20')}. Services Australia sets out the same steps in its ${h.src('sa-ftb-m1', 'Operational Blueprint for Method 1')}. To add Part B and see both parts per fortnight, use the ${h.a('family-tax-benefit-calculator', 'Family Tax Benefit calculator')}.</p>`,
  faqs: [
    { q: 'How much is Family Tax Benefit Part A per child per fortnight?', a: `At the maximum rate, ${fp(P.ftb.a_max_under13)} for a child under 13 and ${fp(P.ftb.a_max_13to19)} for a child of 13 to 15, or 16 to 19 in secondary school. The base rate, which families on middle incomes keep, is ${fp(P.ftb.a_base)} per child. The supplement of up to ${audx(P.ftb.a_supplement)} per child is paid separately after the year ends.` },
    { q: 'When does my child move to the higher Part A rate?', a: 'On the day they turn 13. From that day the child is on the higher maximum rate, and stays on it until 15, then from 16 to 19 as long as they are in full-time secondary school. If your income has already reduced Part A to the base rate, the birthday changes nothing, because the base rate is the same at every age.' },
    { q: 'Does Part A stop when my teenager leaves school?', a: 'Yes. A young person aged 16 to 19 is an FTB child only while in full-time secondary study or an approved equivalent. When that study ends, Part A for them stops, and a young person who starts work, an apprenticeship or tertiary study may be able to claim Youth Allowance in their own name instead, subject to its own tests.' },
    { q: 'Can I get Part A if my income is high?', a: `Possibly. The base rate is protected up to ${aud(P.ftb.a_hifa)} of family income, and above that it tapers at 30 cents in the dollar. With one child under 13, Part A stops at about ${aud(cut1.nilAt)}; each extra child pushes the cut-off higher. The supplement, however, is only paid with a family income of ${aud(P.ftb.a_supplement_ati_limit)} or less.` },
  ],
});

import { definePage } from '../../lib/page-types';
import { P, aud, audx, faFortnight, ftbB, ftbBCutoff } from '../../lib/kit';

const fp = (n: number) => audx(Math.round(faFortnight(n) * 100) / 100);
const ex = ftbB({ ages: [3], couple: true, primaryAti: 88000, secondaryAti: 21000 });
const exOld = ftbB({ ages: [7], couple: true, primaryAti: 88000, secondaryAti: 21000 });

export default definePage({
  id: 'family-tax-benefit-part-b',
  group: 'families',
  kind: 'guide',
  order: 30,
  slug: 'family-tax-benefit-part-b',
  nav: 'FTB Part B',
  card: 'The per-family payment for single parents and one-main-income couples.',
  title: 'Family Tax Benefit Part B 2026-27: Rates and Income Limits',
  description: `Family Tax Benefit Part B in 2026-27: up to ${fp(P.ftb.b_under5)} a fortnight, the ${aud(P.ftb.b_primary_limit)} limit on the higher earner and the 20 cent test on the lower earner's income.`,
  h1: 'Family Tax Benefit Part B: the second-earner payment',
  intro: 'Part B is paid once per family and is built for households where one parent earns little or nothing.',
  resume: `Family Tax Benefit Part B is a single payment per family, worth ${audx(P.ftb.b_under5)} a year while the youngest child is under 5 and ${audx(P.ftb.b_5to18)} from age 5, which Centrelink pays as ${fp(P.ftb.b_under5)} and ${fp(P.ftb.b_5to18)} a fortnight in 2026-27. It looks at each parent separately rather than at the family total. The higher earner must have an adjusted taxable income of ${aud(P.ftb.b_primary_limit)} or less, otherwise nothing is paid; below that limit, the lower earner can earn ${aud(P.ftb.b_ifa)} before each extra dollar removes 20 cents. A single parent under the limit receives the full rate. Couples lose Part B on the day the youngest child turns 13, single parents keep it until the end of the year the youngest turns 18 if still at school, and a supplement of up to ${audx(P.ftb.b_supplement)} follows the tax return.`,
  mini: 'ftbPartB',
  related: ['family-tax-benefit-calculator', 'family-tax-benefit-part-a', 'family-tax-benefit-for-teenagers', 'ftb-end-of-year-supplement', 'paid-parental-leave-calculator', 'couple-two-children-one-income'],
  sources: ['fag-ftb-rates', 'fag-ftb-b', 'fag-ftb-b-test'],
  body: (h) => `
<h2>A test on each parent, not on the household</h2>
<p>Part A adds both partners' incomes together. Part B does something different: it first checks the higher earner, then looks only at the lower earner. A household where one parent earns ${h.aud(P.ftb.b_primary_limit)} and the other nothing can receive the full rate, while a household where each parent earns ${h.aud(60000)}, a lower combined income, gets nothing at all, because the lower earner is far above the cut-off. The payment is meant to support a family that has chosen to keep one parent mostly at home, and the test is written to reward exactly that.</p>
<p>Which parent is the "lower earner" depends only on income, not on who looks after the children. The Family Assistance Guide gives the example of a self-employed father earning less than his part-time wife: his income is the one tested (${h.src('fag-ftb-b-test', 'section 3.1.9.20')}).</p>
${h.table(['Youngest child', 'Per year', 'Per fortnight', 'Lower earner cut-off'], [['Under 5', h.audx(P.ftb.b_under5), fp(P.ftb.b_under5), h.aud(ftbBCutoff(3))], ['5 to 12 (couples)', h.audx(P.ftb.b_5to18), fp(P.ftb.b_5to18), h.aud(ftbBCutoff(7))], ['5 to 18 at school (single parents)', h.audx(P.ftb.b_5to18), fp(P.ftb.b_5to18), 'not tested']], 'Rates of Family Assistance Guide 3.1.1.20, 2026-27. The cut-off includes the supplement, which is reduced by the same test.', ['l', 'r', 'r', 'r'])}
<h2>How the lower earner's income works through</h2>
<p>Take a couple whose youngest child is 3. The higher earner makes ${h.aud(88000)}, under the limit, so the family passes the first step. The lower earner makes ${h.aud(21000)}: that is ${h.aud(21000 - P.ftb.b_ifa)} above the free area, and 20 cents of each of those dollars comes off the annual rate. Part B falls to ${h.aud(ex.annualNoSupplement)} a year, about ${h.aud(ex.fortnight)} a fortnight, plus a reduced supplement of ${h.aud(ex.supplementPaid)}. When that same child starts school at 5, the standard rate drops and the same income leaves ${h.aud(exOld.fortnight)} a fortnight.</p>
<p>The cliff is at the top, not the bottom. One dollar of income above the primary earner limit removes the whole payment, which is why a bonus or a salary-packaging change for the main earner deserves a look before the end of the financial year.</p>
${h.box('Parental Leave Pay switches Part B off', `<p>Part B is nil on each day that Parental Leave Pay is paid to you or your partner (${h.src('fag-ftb-b', 'Family Assistance Guide 3.1.9.10')}). With ${P.ppl.max_days} days of leave available for a child born from 1 July 2026, that is a noticeable gap in the first months; the ${h.a('paid-parental-leave-calculator', 'Paid Parental Leave calculator')} shows the leave side.</p>`)}
<h2>Single parents, grandparents and the age 13 rule</h2>
<p>For a couple, Part B ends when the youngest child turns 13, whatever the incomes. A single parent, a grandparent or a great-grandparent carer keeps it beyond 13: until the youngest is 16, then through the calendar year the child turns 18 provided they are in full-time secondary school. A child aged 16 or over who has left school is simply ignored for Part B, and if that child is the only one, Part B stops.</p>
<p>A single parent is tested on one income only, against the same primary earner limit of ${h.aud(P.ftb.b_primary_limit)}. Under it, the full rate is paid with no taper at all. A single parent receiving Parenting Payment or JobSeeker is not tested even against that limit, because income support payments switch the Part B income test off.</p>
<h2>Shared care</h2>
<p>When care of a child is shared between separated parents, each parent with at least 35% care gets a share of the standard rate equal to their care percentage. With several children, the rate is the higher of the shared amount for any shared-care child and the full rate for the youngest child who lives with you all the time (${h.src('fag-ftb-b', 'section 3.1.9.10')}). This site assumes full-time care, so check a shared-care case with Services Australia.</p>
<p>Part B is paid with Part A, fortnightly or as a lump sum after the year, and reconciled against the actual incomes once the tax returns are in. To see both parts for your family, use the ${h.a('family-tax-benefit-calculator', 'Family Tax Benefit calculator')}.</p>`,
  faqs: [
    { q: 'Can we get Family Tax Benefit Part B if we both work full time?', a: `Usually not much. Part B is reduced by 20 cents for each dollar the lower earner makes above ${aud(P.ftb.b_ifa)}, so with a youngest child under 5 it disappears completely once the lower earner reaches about ${aud(ftbBCutoff(3))} a year, and about ${aud(ftbBCutoff(7))} once the youngest is 5 or older.` },
    { q: 'What happens to Part B when my partner earns over the limit?', a: `If the higher earner's adjusted taxable income is above ${aud(P.ftb.b_primary_limit)} for the year, the family receives no Part B at all, however little the other parent earns. There is no gradual taper on the higher earner: one dollar over the limit removes the whole payment and the supplement with it.` },
    { q: 'Do grandparents raising grandchildren keep Part B after the child turns 13?', a: 'Yes. The rule that ends Part B when the youngest child turns 13 applies to couples who are the parents. A grandparent or great-grandparent carer, like a single parent, can keep Part B until the youngest is 16, or until the end of the year they turn 18 if still at secondary school, subject to the income test.' },
    { q: 'Why did my Part B stop while I was on parental leave?', a: 'Because Part B is nil on every day Parental Leave Pay is paid to you or your partner. It resumes automatically once the leave payments end, provided the income test is still met. Part A is not affected by Parental Leave Pay in the same way, although the leave pay counts as income for the year.' },
  ],
});

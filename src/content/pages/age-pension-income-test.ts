import { definePage } from '../../lib/page-types';
import { P, aud, audx, day, pension, deemedIncome, ssFortnight } from '../../lib/kit';

const x = (n: number) => audx(Math.round(n * 100) / 100);
const freeS = ssFortnight(P.pension.ifa_single_pa);
const freeC = ssFortnight(2 * P.pension.ifa_couple_each_pa);
const s = (i: number) => pension({ couple: false, homeowner: true, incomePf: i });
const rows = [0, freeS, 400, 800, 1200, 1800, 2400].map((i) => [aud(i), x(s(i).incomeTested)]);
const ex = pension({ couple: true, homeowner: true, incomePf: 300, financialAssets: 250000 });

export default definePage({
  id: 'age-pension-income-test',
  group: 'older',
  kind: 'guide',
  order: 40,
  slug: 'age-pension-income-test',
  nav: 'Income test',
  card: 'The income free areas, the 50 cent taper, deemed income and the cut-off points.',
  title: 'Age Pension Income Test 2026: Free Area, Taper, Cut-offs',
  description: `Age Pension income test for 2026: ${aud(freeS)} a fortnight free for a single person, ${aud(freeC)} for a couple, then 50 cents per dollar; the pension stops near ${aud(s(0).incomeCutOut)}.`,
  h1: 'The Age Pension income test',
  intro: 'What counts as income for a pensioner, how much is free, and how quickly the pension falls above it.',
  resume: `Under the Age Pension income test, a single pensioner can have ${aud(freeS)} a fortnight of income without any effect on the pension, and a couple ${aud(freeC)} a fortnight combined, from 1 July 2026. Above those free areas, the pension falls by 50 cents for each dollar of income for a single person, and by 25 cents per dollar for each member of a couple, because the couple's combined income is shared between them. With the rates of ${day(P.rates_date)}, a single pensioner's pension stops at about ${aud(s(0).incomeCutOut)} a fortnight of income and a couple's at about ${aud(pension({ couple: true, homeowner: true, incomePf: 0 }).incomeCutOut)} combined, higher with Rent Assistance. Income includes wages, net rental income and other income streams, plus deemed income on bank accounts, shares and account-based pensions, calculated at ${P.deeming.lower_rate}% and ${P.deeming.upper_rate}% rather than on what they actually earn. The assets test is applied as well, and the lower pension of the two is paid.`,
  mini: 'incomeTest',
  related: ['age-pension-calculator', 'deeming-rates', 'age-pension-assets-test', 'centrelink-income-test', 'pensioner-couple-homeowners'],
  sources: ['ssg-pension-income-test', 'ssg-pension-limits', 'ssg-deeming', 'ssg-common-pension'],
  body: (h) => `
<h2>The steps</h2>
<p>The ${h.src('ssg-pension-income-test', 'Social Security Guide 4.2.1.10')} lists five steps. Identify income that is eligible for the Work Bonus and apply it. Work out the annual rate of income left. Find your income free area. If income is above it, the difference is the excess. The reduction is 50% of the excess. For a couple, the combined income is halved and each partner is tested on half against half the couple free area, which is why each loses 25 cents per dollar of the couple's total.</p>
${h.table(['Income per fortnight (single)', 'Pension under the income test'], rows, `Single homeowner, rates from ${day(P.rates_date)}, free area from 1 July 2026. The assets test may give a lower rate.`, ['r', 'r'])}
<h2>The free areas over time</h2>
<p>The income free area is indexed every 1 July. It was ${h.aud(5668)} a year for a single pensioner from 1 July 2025 and is ${h.aud(P.pension.ifa_single_pa)} from 1 July 2026; for each member of a couple, ${h.aud(4940)} then ${h.aud(P.pension.ifa_couple_each_pa)} (${h.src('ssg-pension-limits', 'Social Security Guide 4.10.3, table 6')}). The cut-off points also move on 20 March and 20 September, when the pension rate is indexed.</p>
<h2>What counts as income</h2>
<p>Employment income before tax, after the Work Bonus where it applies. Net income from a rental property or a business. Income streams such as defined benefit pensions and some annuities, under their own rules. Deemed income on financial assets: from ${h.day(P.rates_date)}, ${P.deeming.lower_rate}% on the first ${h.aud(P.deeming.threshold_single)} for a single person, ${h.aud(P.deeming.threshold_pensioner_couple)} for a pensioner couple, and ${P.deeming.upper_rate}% above (${h.src('ssg-deeming', 'Social Security Guide 4.4.1.10')}). Actual interest, dividends and account-based pension withdrawals are not counted on top of the deemed amount.</p>
${h.box('A couple with savings and a part-time job', `<p>A homeowner couple with ${h.aud(250000)} in financial assets and ${h.aud(300)} a fortnight of wages: deemed income is ${h.aud(deemedIncome(250000, 'couple'))} a year, about ${x(ssFortnight(deemedIncome(250000, 'couple')))} a fortnight. Their total income, ${x(ex.incomePf)} a fortnight, is above the couple free area of ${h.aud(freeC)}, so each partner receives ${x(ex.incomeTested / 2)} under the income test, before the Work Bonus, which would lower the wages counted.</p>`)}
<h2>The Work Bonus</h2>
<p>Pensioners over Age Pension age who work can have part of their employment and self-employment income excluded from the income test through the Work Bonus, with unused amounts building up in a bank for later. The exact amounts are set by Services Australia and are not modelled here, so a working pensioner's real pension will be higher than the figure the calculator shows. Ask Services Australia for your Work Bonus balance before deciding how many hours to take.</p>
<h2>Couples where only one partner is a pensioner</h2>
<p>When one partner has reached Age Pension age and the other has not, the pensioner is still assessed on half the couple's combined income against the couple free area. The younger partner's wages therefore count, through the combined figure, while that partner's superannuation in accumulation phase is not counted until they reach Age Pension age themselves. The younger partner may receive JobSeeker, which has its own income test; for that payment, half the couple's combined income is treated as theirs.</p>
<h2>Income that is not counted</h2>
<p>Several common amounts are ignored: Family Tax Benefit, Rent Assistance and the pension itself, Carer Allowance, most lump sums such as an inheritance (which become assets instead), and the proceeds of selling personal assets. Reverse mortgage drawdowns are treated as a loan rather than income. The actual return on financial investments is replaced by deemed income, so a good year in the share market does not cut the pension, and a bad one does not raise it.</p>
<h2>Income test or assets test</h2>
<p>Both tests are always applied. Pensioners with modest savings and some income are usually caught by the income test; those with larger savings or investment property by the assets test. The ${h.a('age-pension-calculator', 'Age Pension calculator')} shows both rates and names the one that applies.</p>`,
  faqs: [
    { q: 'How much income can a pensioner earn in 2026?', a: `${aud(freeS)} a fortnight for a single pensioner and ${aud(freeC)} combined for a couple without any reduction, from 1 July 2026. Above that, the pension falls by 50 cents per dollar, 25 cents each for a couple. Pensioners who work can have some employment income excluded by the Work Bonus on top of the free area.` },
    { q: 'At what income does the Age Pension stop?', a: `With the rates of ${day(P.rates_date)}, at about ${aud(s(0).incomeCutOut)} a fortnight of assessable income for a single homeowner and about ${aud(pension({ couple: true, homeowner: true, incomePf: 0 }).incomeCutOut)} combined for a couple. Rent Assistance raises these cut-offs, and the Work Bonus can raise them for pensioners who work.` },
    { q: 'Is the interest on my savings counted by Centrelink?', a: `Not the actual interest. Centrelink counts deemed income instead: ${P.deeming.lower_rate}% a year on financial assets up to ${aud(P.deeming.threshold_single)} for a single person, and ${P.deeming.upper_rate}% above, from ${day(P.rates_date)}. If your savings earn more than the deeming rate, the extra is not counted; if they earn less, the deemed amount still applies.` },
  ],
});

import { definePage } from '../../lib/page-types';
import { P, aud, audx, day, deemedIncome, pension, ssFortnight } from '../../lib/kit';

const x = (n: number) => audx(Math.round(n * 100) / 100);
const D = P.deeming;
const amounts = [50000, 100000, 200000, 400000, 600000];
const rows = amounts.map((a) => [aud(a), aud(deemedIncome(a, 'single')), aud(deemedIncome(a, 'couple'))]);
const before = (a: number) => Math.min(a, D.threshold_single) * 0.0125 + Math.max(0, a - D.threshold_single) * 0.0325;
const s200 = pension({ couple: false, homeowner: true, incomePf: 0, financialAssets: 200000 });

export default definePage({
  id: 'deeming-rates',
  group: 'older',
  kind: 'guide',
  order: 50,
  slug: 'deeming-rates',
  nav: 'Deeming rates',
  card: 'The deeming rates from 20 September 2026, the thresholds and what they do to a pension.',
  title: 'Deeming Rates 2026: 1.75% and 3.75% from 20 September',
  description: `Deeming rates from ${day(P.rates_date)}: ${D.lower_rate}% on financial assets up to ${aud(D.threshold_single)} for a single person, ${D.upper_rate}% above, and what that does to your Centrelink payment.`,
  h1: 'Deeming rates from 20 September 2026',
  intro: 'Centrelink does not look at what your savings actually earn. It assumes a rate. Here are the rates, the thresholds and their effect.',
  resume: `Deeming is the way Centrelink counts income from financial assets such as bank accounts, term deposits, shares, managed funds and account-based pensions. Instead of the interest or dividends you actually receive, it assumes a return: from ${day(P.rates_date)}, ${D.lower_rate}% a year on financial assets up to ${aud(D.threshold_single)} for a single person, or ${aud(D.threshold_pensioner_couple)} combined for a pensioner couple, and ${D.upper_rate}% on anything above. The thresholds were set on 1 July 2026; the rates rose by half a percentage point on 20 September 2026, after rising on 20 September 2025 and 20 March 2026. A single person with ${aud(200000)} of savings is deemed to earn ${aud(deemedIncome(200000, 'single'))} a year, about ${x(ssFortnight(deemedIncome(200000, 'single')))} a fortnight, which is added to other income for the pension and allowance income tests. Earning more than the deeming rate costs nothing extra; earning less does not help.`,
  mini: 'deeming',
  related: ['age-pension-income-test', 'age-pension-calculator', 'age-pension-assets-test', 'centrelink-income-test', 'pensioner-couple-homeowners'],
  sources: ['ssg-deeming', 'ssg-pension-income-test'],
  body: (h) => `
<h2>Deemed income at a glance</h2>
${h.table(['Financial assets', 'Deemed income per year, single', 'Deemed income per year, pensioner couple'], rows, `Rates of ${D.lower_rate}% and ${D.upper_rate}% from ${day(P.rates_date)}; thresholds ${aud(D.threshold_single)} single and ${aud(D.threshold_pensioner_couple)} couple from 1 July 2026 (Social Security Guide 4.4.1.10).`, ['r', 'r', 'r'])}
<h2>The recent changes</h2>
<p>Deeming rates were frozen at ${'0.25%'} and ${'2.25%'} for several years. They rose to 0.75% and 2.75% on 20 September 2025, to 1.25% and 3.25% on 20 March 2026, and to ${D.lower_rate}% and ${D.upper_rate}% on 20 September 2026; the thresholds moved separately on 1 July 2026, to ${h.aud(D.threshold_single)} for a single person, ${h.aud(D.threshold_pensioner_couple)} for a pensioner couple and ${h.aud(D.threshold_nonpensioner_couple_each)} for each member of a couple where neither is a pensioner (${h.src('ssg-deeming', 'Social Security Guide 4.4.1.10')}). For a single person with ${h.aud(200000)} of savings, the latest change alone added ${h.aud(deemedIncome(200000, 'single') - before(200000))} a year of deemed income.</p>
<h2>What the change does to a pension</h2>
<p>Deemed income enters the income test, where it is added to wages and other income. A single homeowner pensioner with ${h.aud(200000)} of savings and no other income now has ${x(ssFortnight(deemedIncome(200000, 'single')))} a fortnight of deemed income, which is ${ssFortnight(deemedIncome(200000, 'single')) > ssFortnight(P.pension.ifa_single_pa) ? `above the free area of ${h.aud(ssFortnight(P.pension.ifa_single_pa))}, so the pension falls to ${x(s200.incomeTested)}` : `still under the free area of ${h.aud(ssFortnight(P.pension.ifa_single_pa))}, so the full pension is paid`}. Every extra dollar of deemed income above the free area costs 50 cents of pension for a single person, 25 cents each for a couple.</p>
${h.box('What deeming covers', `<p>Deeming applies to financial investments: bank accounts and cash, term deposits, shares and listed securities, managed investments, loans made to others, gold and other bullion, superannuation once you have reached Age Pension age, and account-based income streams. It does not apply to your home, to investment property, whose actual net rent is counted instead, or to most defined benefit pensions.</p>`)}
<h2>Deeming for allowances</h2>
<p>Deeming also applies to working-age payments such as JobSeeker, Youth Allowance and Parenting Payment, using the same rates and thresholds. For someone on JobSeeker, deemed income counts against the ${h.aud(P.benefit.income_free_area)} fortnightly free area, so a single job seeker with ${h.aud(20000)} of savings has ${x(ssFortnight(deemedIncome(20000, 'single')))} a fortnight of deemed income, well under the free area.</p>
<h2>Planning around deeming</h2>
<p>Because deeming assumes a return, two pensioners with the same savings are treated identically whether their money sits in a transaction account at almost no interest or in shares returning far more. That makes the choice of investment neutral for the pension and puts the focus on the amount. Moving savings into the exempt home, for example to renovate, reduces both deemed income and assessable assets. Gifting is limited by the gifting rules. Paying off a home loan uses financial assets that would otherwise be deemed.</p>
<p>A couple where one partner is under Age Pension age has a particular option: the younger partner's superannuation in accumulation phase is not deemed until they reach that age, so contributions to that account can lower the household's deemed income for a time. The rules are detailed and worth checking with Services Australia's Financial Information Service before acting.</p>
<h2>Reporting</h2>
<p>You report the value of your financial investments to Centrelink, not the interest. Values of listed shares and managed funds are updated by Services Australia twice a year, on 20 March and 20 September, using market prices. Bank balances should be updated when they change significantly, for instance after a large withdrawal, a gift or the sale of an asset, because Centrelink deems whatever balance it holds on record, not your current one, until you tell it otherwise.</p>
<h2>Why deeming exists</h2>
<p>Deeming saves pensioners from reporting every interest payment and rewards those who invest well: income above the deeming rate is not counted. The rates are set by the Minister under the Social Security Act to reflect the returns reasonably available on a range of financial products (${h.src('ssg-deeming', 'Social Security Guide 4.4.1.20')}). Exemptions exist only in special cases, such as an investment that has failed, never because returns were poor.</p>`,
  faqs: [
    { q: 'What are the deeming rates from 20 September 2026?', a: `${D.lower_rate}% a year on financial assets up to ${aud(D.threshold_single)} for a single person, ${aud(D.threshold_pensioner_couple)} combined for a pensioner couple, and ${D.upper_rate}% on financial assets above those thresholds. The rates apply to pensions and allowances alike. The thresholds have applied since 1 July 2026.` },
    { q: 'Does deeming apply to my super?', a: 'Once you reach Age Pension age, superannuation in accumulation phase is a financial asset and is deemed. An account-based pension is deemed at any age. Before Age Pension age, super in accumulation phase is generally not counted, which matters for a younger partner of a pensioner.' },
    { q: 'Is deemed income the same as actual interest?', a: `No. Deemed income is an assumed return, used instead of the interest, dividends or distributions you actually receive. If your savings earn more than ${D.lower_rate}% or ${D.upper_rate}%, the extra is not counted; if they earn less, Centrelink still counts the deemed amount. You do not need to report actual interest.` },
  ],
});

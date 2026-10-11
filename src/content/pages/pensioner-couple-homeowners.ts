import { definePage } from '../../lib/page-types';
import type { Household } from '../../lib/engine/household';
import { P, aud, audx, household, pension, deemedIncome, ssFortnight } from '../../lib/kit';

const preset: Household = { couple: true, you: { age: 70, payment: 'age', incomeAnnual: 0 }, partner: { age: 68, payment: 'age', incomeAnnual: 0 }, children: [], rentPf: 0, homeowner: true, financialAssets: 380000, otherAssets: 45000 };
const r = household(preset);
const p = pension({ couple: true, homeowner: true, incomePf: 0, financialAssets: 380000, otherAssets: 45000 });
const reno = pension({ couple: true, homeowner: true, incomePf: 0, financialAssets: 300000, otherAssets: 45000 });
const work = pension({ couple: true, homeowner: true, incomePf: 400, financialAssets: 380000, otherAssets: 45000 });
const x = (n: number) => audx(Math.round(n * 100) / 100);
const D = P.deeming;
const point = D.threshold_pensioner_couple + (2 * P.pension.ifa_couple_each_pa - (D.threshold_pensioner_couple * D.lower_rate) / 100) / (D.upper_rate / 100);

export default definePage({
  id: 'pensioner-couple-homeowners',
  group: 'cases',
  kind: 'case',
  order: 90,
  slug: 'households/pensioner-couple-homeowners',
  nav: 'Pensioner couple, homeowners',
  card: 'A couple with savings: which test bites, and what a renovation or a little work changes.',
  title: 'Pensioner Couple Homeowners 2026: Savings and Part Pension',
  description: `Pensioner couple who own their home in 2026: with ${aud(380000)} of savings they receive about ${aud(r.fortnightTotal)} a fortnight together, a part pension set by the ${p.test} test.`,
  h1: 'A pensioner couple who own their home',
  intro: 'Bill, 70, and Anne, 68, own their home outright. They have $380,000 in super pensions and bank accounts, and $45,000 of car, caravan and contents.',
  resume: `A homeowner couple, both over Age Pension age, with ${aud(380000)} of financial assets and ${aud(45000)} of other assets, receives about ${aud(r.fortnightTotal)} a fortnight together, ${x(p.ratePerPerson)} each, from the rates of September 2026, against ${audx(P.pension.max_couple_each)} each at the full rate. The ${p.test} test sets the rate. Their deemed income is ${aud(deemedIncome(380000, 'couple'))} a year, about ${x(p.deemedPf)} a fortnight, of which the first ${aud(P.deeming.threshold_pensioner_couple)} of savings is deemed at ${P.deeming.lower_rate}% and the rest at ${P.deeming.upper_rate}%. That is above the couple's income free area of ${aud((2 * P.pension.ifa_couple_each_pa) / 26)} a fortnight, so each loses 25 cents per dollar of the excess. Their total assets, ${aud(425000)}, are under the homeowner couple free area of ${aud(P.pension.assets_free_area.homeowner_couple)}, so the assets test alone would pay the full rate. Their home, whatever its value, is not counted.`,
  preset,
  related: ['age-pension-income-test', 'deeming-rates', 'age-pension-assets-test', 'age-pension-calculator', 'single-pensioner-renting'],
  sources: ['ssg-common-pension', 'ssg-pension-income-test', 'ssg-deeming', 'ssg-pension-limits'],
  body: (h) => `
<h2>The income test bites through deeming</h2>
<p>Bill and Anne have no wages and no rental income, yet the income test reduces their pension. The reason is deeming: Centrelink assumes their ${h.aud(380000)} earns ${P.deeming.lower_rate}% on the first ${h.aud(P.deeming.threshold_pensioner_couple)} and ${P.deeming.upper_rate}% on the rest, whatever it actually earns (${h.src('ssg-deeming', 'Social Security Guide 4.4.1.10')}). The deemed ${x(p.deemedPf)} a fortnight is ${x(p.deemedPf - (2 * P.pension.ifa_couple_each_pa) / 26)} above the couple free area, and half of that, shared between them, comes off the combined pension. Under the assets test alone, they would receive the full rate.</p>
<h2>Spending on the home</h2>
<p>If the couple spent ${h.aud(80000)} renovating their home, that money would move from deemed savings into the exempt home. Financial assets would fall to ${h.aud(300000)}, deemed income would fall with them, and their pension would rise to about ${x(reno.ratePerPerson)} each a fortnight. Whether that is a good use of the money is their decision, but the pension effect is real and immediate.</p>
<h2>The share market and the pension</h2>
<p>Because deeming replaces actual returns, a strong year for their super pension does not cut Bill and Anne's pension, and a weak one does not raise it. What matters is the value of their financial assets, which Centrelink updates for listed investments twice a year. A large fall in value can lower deemed income at the next update, and an increase can raise it.</p>
<h2>A few hours of work</h2>
<p>If Anne earned ${h.aud(400)} a fortnight from a casual job, the couple's income would rise and each pension would fall to about ${x(work.ratePerPerson)}, before the Work Bonus. The Work Bonus excludes part of a pensioner's employment income from the income test, so the real reduction would be smaller; the calculator does not apply it, because its amounts are not in the parameters this site has verified.</p>
${h.box('A part pension still counts', `<p>Even a small part pension brings the Pensioner Concession Card, with cheaper medicines, and other concessions from states and councils. For a couple like Bill and Anne, those concessions can be worth as much as the pension payments themselves. The pension also rises at each indexation on 20 March and 20 September.</p>`)}`,
  faqs: [
    { q: 'Why does our pension go down when we have no income?', a: `Because of deeming. Centrelink counts an assumed return on your financial assets, ${P.deeming.lower_rate}% up to ${aud(P.deeming.threshold_pensioner_couple)} for a pensioner couple and ${P.deeming.upper_rate}% above, as income. If that deemed income is above the couple free area of ${aud((2 * P.pension.ifa_couple_each_pa) / 26)} a fortnight, each partner's pension falls by 25 cents per dollar of the excess.` },
    { q: 'How much can a pensioner couple have in savings and still get the full pension?', a: `Under the assets test, up to ${aud(P.pension.assets_free_area.homeowner_couple)} of assessable assets for homeowners. For a couple with no other income, the income test bites first: deemed income reaches the couple free area at about ${aud(point)} of financial assets, so savings above that level start to reduce the pension even though the assets test would not.` },
    { q: 'Does our house count in the Centrelink assets test?', a: 'No. The home you live in, and usually up to two hectares of land around it, is exempt from the assets test whatever its value. That is why homeowners have a lower assets free area than renters. Money spent improving the home is no longer counted, while money held for a future purchase may be exempt for a limited time.' },
  ],
});

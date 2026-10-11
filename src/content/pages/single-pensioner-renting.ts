import { definePage } from '../../lib/page-types';
import type { Household } from '../../lib/engine/household';
import { P, aud, audx, household, pension, raSingleRate } from '../../lib/kit';

const preset: Household = { couple: false, you: { age: 72, payment: 'age', incomeAnnual: 0 }, children: [], rentPf: 420, homeowner: false, financialAssets: 40000, otherAssets: 15000 };
const r = household(preset);
const p = pension({ couple: false, homeowner: false, incomePf: 0, rentPf: 420, financialAssets: 40000, otherAssets: 15000 });
const owner = pension({ couple: false, homeowner: true, incomePf: 0, financialAssets: 40000, otherAssets: 15000 });
const inherit = pension({ couple: false, homeowner: false, incomePf: 0, rentPf: 420, financialAssets: 340000, otherAssets: 15000 });
const x = (n: number) => audx(Math.round(n * 100) / 100);

export default definePage({
  id: 'single-pensioner-renting',
  group: 'cases',
  kind: 'case',
  order: 80,
  slug: 'households/single-pensioner-renting',
  nav: 'Single pensioner, renting',
  card: 'Full Age Pension plus Rent Assistance, and the higher limits that renters have.',
  title: 'Single Pensioner Renting 2026: Pension and Rent Assistance',
  description: `Single pensioner renting in 2026: the full Age Pension plus Rent Assistance comes to about ${aud(r.fortnightTotal)} a fortnight at ${aud(420)} rent, with a renter's higher assets limit.`,
  h1: 'A single pensioner who rents',
  intro: 'Margaret is 72, widowed, rents a unit for $420 a fortnight and has $40,000 in the bank and $15,000 of car and contents.',
  resume: `A single pensioner aged 72 who rents privately at ${aud(420)} a fortnight, with ${aud(40000)} in savings and ${aud(15000)} of other assets, receives about ${aud(r.fortnightTotal)} a fortnight from the rates of September 2026: the full Age Pension of ${audx(P.pension.max_single)}, which includes the Pension and Energy Supplements, and Rent Assistance of ${x(p.ra)}. Neither means test reduces anything. Her deemed income on the savings, about ${x(p.deemedPf)} a fortnight, is far under the income free area, and her assets are far under the non-homeowner free area of ${aud(P.pension.assets_free_area.nonhomeowner_single)}, which is ${aud(P.pension.assets_free_area.nonhomeowner_single - P.pension.assets_free_area.homeowner_single)} higher than a homeowner's because she has no exempt home. Rent Assistance is added to her maximum rate before the tests, so it also raises the income and assets levels at which her pension would start to fall.`,
  preset,
  related: ['rent-assistance-couples-and-pensioners', 'age-pension-calculator', 'age-pension-assets-test', 'age-pension-rates', 'pensioner-couple-homeowners'],
  sources: ['ssg-common-pension', 'ssg-ra-rates', 'ssg-pension-limits', 'ssg-deeming'],
  body: (h) => `
<h2>Rent Assistance on top of the pension</h2>
<p>Margaret's rent of ${h.aud(420)} is ${h.aud(420 - P.ra_ss.single.threshold)} above the single threshold of ${h.audx(P.ra_ss.single.threshold)}; three quarters of that is ${x(raSingleRate(420, 'single'))}, under the single maximum of ${h.audx(P.ra_ss.single.max)}, so that is what she receives (${h.src('ssg-ra-rates', 'Social Security Guide 5.1.7.10')}). If her rent rose to ${h.audx(P.ra_ss.single.min_rent_for_max)} or more, she would receive the maximum. Her pension rate including Rent Assistance is ${x(p.maxRate)} a fortnight.</p>
<h2>A renter's means tests</h2>
<p>The pension income test allows ${h.aud(P.pension.ifa_single_pa / 26)} a fortnight of income for a single person; Margaret's only income is deemed income on ${h.aud(40000)}, at ${P.deeming.lower_rate}% because it is under the ${h.aud(P.deeming.threshold_single)} threshold. The assets test allows ${h.aud(P.pension.assets_free_area.nonhomeowner_single)} for a single non-homeowner (${h.src('ssg-pension-limits', 'Social Security Guide 4.10.3')}). A homeowner with the same savings would also receive the full pension, ${x(owner.rate)}, but without Rent Assistance.</p>
<h2>What an inheritance would change</h2>
<p>Suppose Margaret inherits ${h.aud(300000)}. Her financial assets become ${h.aud(340000)}. Deemed income rises to about ${x(inherit.deemedPf)} a fortnight, above the free area, and her assets, ${h.aud(355000)} in total, are still under the renter's free area. The income test now decides: her pension falls to about ${x(inherit.ratePerPerson)} a fortnight, Rent Assistance included. A homeowner inheriting the same amount would also be caught by the assets test, because the homeowner free area is lower.</p>
<h2>When rent goes up</h2>
<p>A rent increase raises Rent Assistance by 75 cents per dollar until the single maximum is reached. If Margaret's landlord raised her rent from ${h.aud(420)} to ${h.aud(470)} a fortnight, ${h.aud(50)} more, her Rent Assistance would rise to ${x(raSingleRate(470, 'single'))}, as long as she reports the new rent with a copy of the lease or a rent certificate. Above ${h.audx(P.ra_ss.single.min_rent_for_max)}, further increases bring nothing more.</p>
${h.box('If she moved in with family', `<p>Rent paid to a family member can count as rent if the arrangement is genuine. A pensioner who moves into a granny flat after transferring assets, or who pays an entry contribution to a retirement village, may be treated as a homeowner instead and lose Rent Assistance. Ask Services Australia's Financial Information Service before such a move.</p>`)}`,
  faqs: [
    { q: 'How much does a single pensioner who rents get in 2026?', a: `The full Age Pension of ${audx(P.pension.max_single)} a fortnight plus Rent Assistance, up to ${audx(P.ra_ss.single.max)} for a single person living alone, reached at a rent of ${audx(P.ra_ss.single.min_rent_for_max)}. At ${aud(420)} rent the total is about ${aud(r.fortnightTotal)}, if income and assets are under the free areas.` },
    { q: 'Do renters have a higher assets limit for the pension?', a: `Yes. A single pensioner who does not own a home can have ${aud(P.pension.assets_free_area.nonhomeowner_single)} of assessable assets for the full pension, against ${aud(P.pension.assets_free_area.homeowner_single)} for a homeowner, from 1 July 2026. The difference stands in for the value of the exempt home that a renter does not have.` },
    { q: 'Is Rent Assistance reduced by the pension income test?', a: 'It is part of the maximum rate that the test reduces. Rent Assistance is added to the pension before the income and assets tests, so a pensioner whose income or assets reduce the pension loses part of the combined amount. The upside is that the pension stops at a higher income and asset level than for a homeowner.' },
  ],
});

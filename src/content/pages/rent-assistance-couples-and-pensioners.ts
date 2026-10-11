import { definePage } from '../../lib/page-types';
import { P, aud, audx, day, raSingleRate, pension } from '../../lib/kit';

const x = (n: number) => audx(Math.round(n * 100) / 100);
const rent = 520;
const ra = raSingleRate(rent, 'couple');
const pc = pension({ couple: true, homeowner: false, incomePf: 0, rentPf: rent, financialAssets: 60000, otherAssets: 20000 });
const single = pension({ couple: false, homeowner: false, incomePf: 0, rentPf: 400, financialAssets: 40000, otherAssets: 15000 });
const singleNoRent = pension({ couple: false, homeowner: false, incomePf: 0, rentPf: 0 });

export default definePage({
  id: 'rent-assistance-couples-and-pensioners',
  group: 'housing',
  kind: 'guide',
  order: 40,
  slug: 'rent-assistance-couples-and-pensioners',
  nav: 'Couples and pensioners',
  card: 'The couple rate, how it is split between two pensioners, and its effect on the pension tests.',
  title: 'Rent Assistance for Pensioners 2026: Couples and Splits',
  description: `Rent Assistance for pensioners and couples in 2026: up to ${audx(P.ra_ss.couple.max)} a fortnight for a couple, split half each between two pensioners, and how it lifts the cut-offs.`,
  h1: 'Rent Assistance for couples and pensioners',
  intro: 'A couple without children gets one Rent Assistance amount. Who receives it, and what it does to the pension income and assets tests.',
  resume: `A couple without children receives one Rent Assistance amount between them: from ${day(P.rates_date)}, 75 cents for each dollar of combined rent above ${audx(P.ra_ss.couple.threshold)} a fortnight, up to ${audx(P.ra_ss.couple.max)}, reached at a rent of ${audx(P.ra_ss.couple.min_rent_for_max)}. When both partners receive a pension, each is paid half of it, worked out on the rent the couple pays together; when one partner is a pensioner and the other receives an allowance such as JobSeeker, the pensioner receives the whole amount. For pensioners, Rent Assistance is part of the maximum rate before the income and assets tests are applied, so a renting pensioner has a higher income cut-off and a higher assets cut-off than a homeowner. A pensioner couple paying ${aud(rent)} a fortnight receives ${x(ra)} of Rent Assistance, ${x(ra / 2)} each, on top of the couple pension. Couples separated by illness or care, or with a partner in prison, are paid at the single rate.`,
  mini: 'raCouple',
  related: ['rent-assistance-calculator', 'age-pension-calculator', 'single-pensioner-renting', 'age-pension-assets-test', 'rent-assistance-singles-and-sharers'],
  sources: ['ssg-ra-rates', 'ssg-common-pension', 'ssg-assets-test'],
  body: (h) => `
<h2>Who receives the couple's Rent Assistance</h2>
${h.table(['Couple', 'Who is paid', 'How much'], [['Both partners receive a pension', 'each partner', 'half of the couple amount'], ['One pensioner, one on an allowance', 'the pensioner', 'the whole couple amount'], ['Both on allowances (JobSeeker, Youth Allowance…)', 'with one partner’s payment', 'the couple amount'], ['Illness separated, respite care or partner in prison', 'each eligible partner', 'the single rate, single threshold'], ['Couple with children', 'through Family Tax Benefit Part A', 'family rates']], `Social Security Guide 5.1.7.10, rates from ${day(P.rates_date)}.`, ['l', 'l', 'l'])}
<p>The split between two pensioners is a book-keeping rule, not a reduction: the couple together receives the same amount whichever way it is divided. What matters is that the amount is calculated once, on the couple's combined rent, with the couple threshold of ${h.audx(P.ra_ss.couple.threshold)}, which is lower than twice the single threshold of ${h.audx(P.ra_ss.single.threshold)}.</p>
<h2>Rent Assistance inside the pension tests</h2>
<p>The pension is worked out under two tests, the income test and the assets test, and the lower result is paid. Rent Assistance is added to the maximum rate before either test, so both cut-offs move up for a renter. A single pensioner with no other income and modest assets, paying ${h.aud(400)} a fortnight, has a maximum rate of ${x(single.maxRate)} including ${x(single.ra)} of Rent Assistance, against ${x(singleNoRent.maxRate)} without rent. That extra raises the income at which the pension stops from ${h.aud(singleNoRent.incomeCutOut)} to ${h.aud(single.incomeCutOut)} a fortnight.</p>
<p>Renters also have a higher assets free area than homeowners, ${h.aud(P.pension.assets_free_area.nonhomeowner_single)} instead of ${h.aud(P.pension.assets_free_area.homeowner_single)} for a single person, because the family home is not counted as an asset and a renter has none. The two effects add up: a renting pensioner can hold considerably more in savings than a homeowner before the pension starts to fall.</p>
<h2>A pensioner couple renting</h2>
<p>Take a couple aged over ${P.pension.age}, both on the Age Pension, renting at ${h.aud(rent)} a fortnight, with ${h.aud(60000)} in savings and ${h.aud(20000)} of other assets. Their rent is above the couple maximum point, so Rent Assistance is ${x(ra)} for the couple. With deemed income well under the free area and assets far below the non-homeowner limit, each receives the full rate of ${h.audx(P.pension.max_couple_each)} plus half the Rent Assistance, ${x(pc.ratePerPerson)} a fortnight each. The ${h.a('age-pension-calculator', 'Age Pension calculator')} lets you change the savings and see when the assets test starts to bite.</p>
${h.box('Retirement villages and granny flats', `<p>Special rules apply when a pensioner pays an entry contribution to a retirement village or transfers assets for a granny flat right: depending on the amount, the person can be treated as a homeowner and lose Rent Assistance. These cases are outside the calculators on this site; ask Services Australia or a financial counsellor before signing.</p>`)}
<h2>Couples on allowances</h2>
<p>A couple where both partners receive allowances, for instance JobSeeker and Youth Allowance, also gets one couple amount. It is added to one partner's payment and is then subject to that payment's income test, which includes the partner income test. A couple where one partner works and the other receives JobSeeker therefore sees Rent Assistance fall as the working partner's income rises above the partner income free area, even though Rent Assistance itself is not income tested on its own.</p>
<p>When a couple without children has a baby, Rent Assistance moves to Family Tax Benefit Part A and switches to the family thresholds and maximums. Because Part A for a family receiving JobSeeker is paid without the income test, the move can increase the couple's Rent Assistance considerably. The ${h.a('home', 'household calculator')} makes that switch automatically when a child is added.</p>
<h2>When one partner moves into care</h2>
<p>If one partner moves into residential care, the couple can be assessed as an illness separated couple. Each partner is then paid at the single rate, and a partner still renting can receive Rent Assistance at the single rate with the single threshold, even if the couple owns a home elsewhere in some care situations (${h.src('ssg-ra-rates', 'Social Security Guide 5.1.7.10')}). The income and assets tests still apply to the couple's combined figures, so the move into care changes the rate of each partner but not the way income and assets are counted.</p>`,
  faqs: [
    { q: 'Do both pensioners get Rent Assistance if we rent together?', a: `Yes, half each. When both members of a couple receive a pension, the Rent Assistance for the couple, up to ${audx(P.ra_ss.couple.max)} a fortnight from ${day(P.rates_date)}, is calculated once on the rent you pay together and split equally between you. Each half is added to that partner's pension before the income and assets tests.` },
    { q: 'My partner is on JobSeeker and I get the Age Pension: who gets Rent Assistance?', a: 'You do, as the pensioner partner: the whole couple amount is paid with your pension, not split. It is worked out on the rent the two of you pay, with the couple threshold and maximum, and it then goes through the pension income and assets tests as part of your maximum rate.' },
    { q: 'Does Rent Assistance raise the Age Pension cut-off?', a: 'Yes. Rent Assistance is added to the maximum rate before the income and assets tests, so a renting pensioner keeps some pension at higher income and higher assets than a homeowner. Renters also have a higher assets free area, because they have no family home, which is exempt from the assets test.' },
  ],
});

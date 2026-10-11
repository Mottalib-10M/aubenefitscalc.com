import { definePage } from '../../lib/page-types';
import { P, aud, audx, day, raSingleRate, jobseeker, youthAllowance } from '../../lib/kit';

const x = (n: number) => audx(Math.round(n * 100) / 100);
const rents = [180, 250, 320, 360, 400, 460, 550];
const jsp = jobseeker({ couple: false, children: false, incomePf: 0, rentPf: 420, includeRa: true });
const yaS = youthAllowance({ situation: 'away', student: true, incomePf: 0, rentPf: 300, sharer: true, includeRa: true, age: 20 });

export default definePage({
  id: 'rent-assistance-singles-and-sharers',
  group: 'housing',
  kind: 'guide',
  order: 30,
  slug: 'rent-assistance-singles-and-sharers',
  nav: 'Singles and sharers',
  card: 'The single rate, the lower sharer rate, and who counts as sharing.',
  title: 'Rent Assistance for Singles 2026: Single and Sharer Rates',
  description: `Rent Assistance for singles in 2026: up to ${audx(P.ra_ss.single.max)} a fortnight living alone, ${audx(P.ra_ss.sharer.max)} as a sharer, both starting above ${audx(P.ra_ss.single.threshold)} of rent a fortnight, explained.`,
  h1: 'Rent Assistance for single people and sharers',
  intro: 'Living alone or sharing a house changes the maximum, not the threshold. What counts as sharing, and how much each pays.',
  resume: `A single person without children who receives a pension or allowance gets Rent Assistance once rent passes ${audx(P.ra_ss.single.threshold)} a fortnight, at 75 cents for each dollar above it. Since ${day(P.rates_date)}, the maximum is ${audx(P.ra_ss.single.max)} a fortnight for someone living alone or with a partner's absence, reached at a rent of ${audx(P.ra_ss.single.min_rent_for_max)}, and ${audx(P.ra_ss.sharer.max)} for a sharer, reached at ${audx(P.ra_ss.sharer.min_rent_for_max)}. The threshold is the same for both, so a sharer paying a modest rent receives exactly what a person living alone would; the difference only appears higher up, where the sharer's lower cap takes over. A single JobSeeker recipient paying ${aud(420)} a fortnight receives ${x(jsp.ra)} on top of the basic rate, and a student on Youth Allowance sharing a house at ${aud(300)} receives ${x(yaS.ra)}. Rent Assistance always follows the main payment, so it is reduced when that payment is.`,
  mini: 'raSingle',
  related: ['rent-assistance-calculator', 'single-jobseeker-renting', 'student-living-away-from-home', 'rent-assistance-couples-and-pensioners', 'jobseeker-payment-calculator'],
  sources: ['ssg-ra-rates', 'ssg-common-benefit', 'ssg-ya-rates'],
  body: (h) => `
<h2>Single rate and sharer rate, side by side</h2>
${h.table(['Rent per fortnight', 'Living alone', 'Sharing'], rents.map((r) => [h.aud(r), x(raSingleRate(r, 'single')), x(raSingleRate(r, 'sharer'))]), `Social Security Guide 5.1.7.10, rates from ${day(P.rates_date)}. Single person without children, receiving a pension or allowance.`, ['r', 'r', 'r'])}
<p>Up to a rent of ${h.audx(P.ra_ss.sharer.min_rent_for_max)} a fortnight the two columns are identical. Above it, the sharer's amount stops at ${h.audx(P.ra_ss.sharer.max)}, while the single amount keeps rising until ${h.audx(P.ra_ss.single.min_rent_for_max)}. The sharer rate exists because people who share a kitchen, bathroom or living space are assumed to share the costs that go with them.</p>
<h2>Who is a sharer</h2>
<p>Broadly, you are a sharer when you share a major part of your accommodation, such as the kitchen, bathroom or living areas, with another adult who is not your partner. People in a share house or flat, people renting a room in someone else's home, and adults sharing with siblings or friends are typically sharers. Some arrangements are treated differently even when rooms are shared, board and lodging in particular, and the Social Security Act sets out the exceptions in detail. Services Australia asks about your living arrangements and decides; the rate you were given appears on your payment details.</p>
<h2>What the rent figure should include</h2>
<p>Enter the rent you are personally liable for. In a share house where the lease is in everyone's name, that is your share, not the whole rent. If your partner pays the rent, it counts as paid by you. Bond, utilities paid separately and one-off fees are not rent. Board and lodging can count in full when meals are included, which is one reason board and lodging often reaches the single maximum.</p>
${h.box('A young person living at home', `<p>Rent Assistance is designed for people renting in the private market. A young person on Youth Allowance who still lives in the family home is generally not paid it, and the calculators on this site only ask for rent when the situation is "living away from home". See ${h.a('student-living-away-from-home', 'a student living away from home')} for a worked example.</p>`)}
<h2>How the main payment carries it</h2>
<p>For an allowance such as JobSeeker, Rent Assistance is added to the maximum rate before the income test. A single JobSeeker recipient who earns part-time wages loses 50 and then 60 cents per dollar of the whole rate, including the Rent Assistance part, and the payment stops at a higher income than it would without rent. For a pensioner it works the same way under both the income and the assets test. So the Rent Assistance you see in the table is the most you can receive; the ${h.a('home', 'household calculator')} shows what survives the tests on your income.</p>
<h2>Two single renters compared</h2>
<p>Consider two people on JobSeeker, both paying ${h.aud(380)} a fortnight. Ben rents a studio on his own; Chloe rents a room in a four-bedroom share house. Their rent is the same, so they start from the same place: ${h.aud(380 - P.ra_ss.single.threshold)} above the threshold, three quarters of which is ${x(0.75 * (380 - P.ra_ss.single.threshold))}. Ben receives all of it. Chloe's cap as a sharer is ${h.audx(P.ra_ss.sharer.max)}, so she receives ${x(raSingleRate(380, 'sharer'))}. If Chloe's rent were ${h.aud(330)}, she and a person living alone at the same rent would receive exactly the same amount, because both would be under the sharer cap.</p>
<p>The comparison also shows why the sharer rate rarely changes a household's decision to share: the rent saved by sharing is usually much larger than the Rent Assistance given up, often by several times over the year.</p>
<h2>Indexation</h2>
<p>The threshold and maximums move with prices on 20 March and 20 September. On top of indexation, the maximums were raised by 15% in September 2023 and by another 10% in September 2024 (${h.src('ssg-ra-rates', 'Social Security Guide 5.1.7.10')}); the thresholds did not get those extra increases. The next change is due on ${h.day(P.next_indexation)}.</p>`,
  faqs: [
    { q: 'What is the maximum Rent Assistance for a single person in 2026?', a: `${audx(P.ra_ss.single.max)} a fortnight from ${day(P.rates_date)}, for a single person without children living alone, reached when rent is ${audx(P.ra_ss.single.min_rent_for_max)} a fortnight or more. A sharer's maximum is ${audx(P.ra_ss.sharer.max)}. Both are added to a pension or allowance and fall with it if the income test reduces the payment.` },
    { q: 'Do I get less Rent Assistance in a share house?', a: `Only if your rent is high. The threshold of ${audx(P.ra_ss.sharer.threshold)} a fortnight is the same for sharers and people living alone, and both receive 75 cents per dollar above it. The sharer amount stops at ${audx(P.ra_ss.sharer.max)}, reached at a rent of ${audx(P.ra_ss.sharer.min_rent_for_max)}, while the single amount keeps rising to ${audx(P.ra_ss.single.max)}.` },
    { q: 'Should I enter my share of the rent or the whole rent?', a: 'Your share: the amount you are responsible for paying. In a share house with a joint lease, Services Australia looks at what you pay, not the total. Utilities, bond and separate fees are not part of rent, but board that includes meals can be counted in full as board and lodging.' },
  ],
});

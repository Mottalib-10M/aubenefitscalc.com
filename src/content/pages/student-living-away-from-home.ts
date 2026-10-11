import { definePage } from '../../lib/page-types';
import type { Household } from '../../lib/engine/household';
import { P, aud, audx, household, youthAllowance, ssFortnight } from '../../lib/kit';

const preset: Household = { couple: false, you: { age: 19, payment: 'youth', incomeAnnual: 7800, yaSituation: 'away' }, children: [], rentPf: 330, homeowner: false, sharer: true };
const r = household(preset);
const y = youthAllowance({ situation: 'away', student: true, incomePf: 7800 / 26, rentPf: 330, sharer: true, includeRa: true, age: 19 });
const busy = youthAllowance({ situation: 'away', student: true, incomePf: 900, rentPf: 330, sharer: true, includeRa: true, age: 19 });
const x = (n: number) => audx(Math.round(n * 100) / 100);

export default definePage({
  id: 'student-living-away-from-home',
  group: 'cases',
  kind: 'case',
  order: 70,
  slug: 'households/student-living-away-from-home',
  nav: 'Student living away from home',
  card: 'Youth Allowance at the away rate, sharer Rent Assistance and a part-time job.',
  title: 'Youth Allowance Away From Home 2026: Student Sharing a House',
  description: `Youth Allowance away from home in 2026: a 19-year-old student sharing a house at ${aud(330)} a fortnight, with a part-time job, gets about ${aud(r.fortnightTotal)} a fortnight all up.`,
  h1: 'A university student living away from home',
  intro: 'Zoe, 19, moved to the city for university. She shares a house for $330 a fortnight and earns about $7,800 a year in a café. She is assessed as independent.',
  resume: `A 19-year-old full-time student living away from home, sharing a rental at ${aud(330)} a fortnight and earning about ${aud(7800)} a year from a part-time job, receives about ${aud(r.fortnightTotal)} a fortnight of Youth Allowance at the 2026 rates, Rent Assistance included, if she is independent or her parents' income does not reduce her rate. The away-from-home rate is ${audx(P.ya.rates.away)} a fortnight plus an Energy Supplement of ${x(ssFortnight(P.ya.es_pa.over18_away))}. Her earnings average ${aud(7800 / 26)} a fortnight, under the student free area of ${aud(P.ya.student_ifa)}, so they do not reduce anything, and the unused part of the free area builds up in her income bank for busier fortnights. As a sharer, her Rent Assistance is capped at ${audx(P.ra_ss.sharer.max)}; at ${aud(330)} she receives ${x(y.ra)}. A dependent student would also face the parental income test, which this example leaves aside.`,
  preset,
  related: ['youth-allowance-for-students', 'youth-allowance-calculator', 'rent-assistance-singles-and-sharers', 'austudy-payment', 'single-jobseeker-renting'],
  sources: ['ssg-ya-rates', 'ssg-ya-students', 'ssg-ra-rates', 'ssg-ya-parental'],
  body: (h) => `
<h2>Why her job does not reduce the payment</h2>
<p>Full-time students have a much larger income free area than job seekers: ${h.aud(P.ya.student_ifa)} a fortnight in 2026 (${h.src('ssg-ya-students', 'Social Security Guide 4.2.8.50')}). Zoe's café shifts bring about ${h.aud(7800 / 26)} a fortnight on average, well under it. Her Youth Allowance is therefore paid in full, and each fortnight she adds about ${h.aud(P.ya.student_ifa - 7800 / 26)} of unused free area to her income bank, up to ${h.aud(P.ya.income_bank_max)}.</p>
<h2>A busy month</h2>
<p>In the exam break Zoe works full time for a while and earns ${h.aud(900)} a fortnight. Without the income bank, her payment would fall to about ${x(busy.rate)}: 50 cents per dollar between ${h.aud(P.ya.student_ifa)} and ${h.aud(P.ya.student_band_top)}, 60 cents above. With credits in the bank, the ${h.aud(900 - P.ya.student_ifa)} above the free area is absorbed first, and her payment stays at the full rate until the bank runs out. The calculator above does not track the bank, so it shows the reduced figure.</p>
<h2>Rent Assistance as a sharer</h2>
<p>Zoe shares a kitchen and bathroom with three other students, so she is assessed at the sharer rate: the threshold is the same as for a single person, ${h.audx(P.ra_ss.sharer.threshold)} a fortnight, but the maximum is ${h.audx(P.ra_ss.sharer.max)} instead of ${h.audx(P.ra_ss.single.max)} (${h.src('ssg-ra-rates', 'Social Security Guide 5.1.7.10')}). At ${h.aud(330)} her rent is close to the sharer cap, so a rent increase would add little.</p>
${h.box('Independent or dependent?', `<p>Most 19-year-olds are assessed as dependent, and then the parental income test can reduce the rate by 20 cents per dollar of parental income above the parental free area, shared among the siblings who depend on it (${h.src('ssg-ya-parental', 'Social Security Guide 4.2.8.10')}). A young person who has supported themselves through work for a set period, or who meets other criteria, is independent and avoids that test. This example assumes Zoe's rate is not reduced by her parents' income.</p>`)}`,
  faqs: [
    { q: 'How much Youth Allowance does a student living away from home get?', a: `Up to ${audx(P.ya.rates.away)} a fortnight in 2026 for a single student without children, plus an Energy Supplement of ${x(ssFortnight(P.ya.es_pa.over18_away))} and Rent Assistance if paying private rent. Earnings above ${aud(P.ya.student_ifa)} a fortnight, and for a dependent student the parental income test, can reduce it.` },
    { q: 'Do students get Rent Assistance in a share house?', a: `Yes, at the sharer rate. A student on Youth Allowance paying private rent above ${audx(P.ra_ss.sharer.threshold)} a fortnight receives 75 cents per dollar above it, up to ${audx(P.ra_ss.sharer.max)}. Living alone, the maximum would be ${audx(P.ra_ss.single.max)}. Rent paid while living in the family home is a different matter.` },
    { q: 'Will my part-time job reduce my Youth Allowance?', a: `Not if you earn under ${aud(P.ya.student_ifa)} a fortnight as a full-time student, and the income bank stores the unused part of that free area for later. Above it, Youth Allowance falls by 50 cents per dollar up to ${aud(P.ya.student_band_top)} and 60 cents above, after any income bank credits are used.` },
  ],
});

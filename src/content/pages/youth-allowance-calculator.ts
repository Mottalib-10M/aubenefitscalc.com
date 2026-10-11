import { definePage } from '../../lib/page-types';
import { P, aud, audx, youthAllowance, ssFortnight } from '../../lib/kit';

const x = (n: number) => audx(Math.round(n * 100) / 100);
const away = youthAllowance({ situation: 'away', student: true, incomePf: 0, age: 19 });
const awayW = youthAllowance({ situation: 'away', student: true, incomePf: 450, rentPf: 320, sharer: true, includeRa: true, age: 19 });
const js = youthAllowance({ situation: 'over18_home', student: false, incomePf: 300, age: 19 });

export default definePage({
  id: 'youth-allowance-calculator',
  group: 'work',
  kind: 'pillar',
  order: 50,
  slug: 'youth-allowance-calculator',
  nav: 'Youth Allowance calculator',
  card: 'Students, apprentices and young job seekers: rate, earnings and Rent Assistance.',
  title: 'Youth Allowance Calculator 2026: Students and Job Seekers',
  description: `Youth Allowance calculator for 2026: ${audx(P.ya.rates.away)} a fortnight away from home, the ${aud(P.ya.student_ifa)} student free area, Rent Assistance and partner income, all worked out.`,
  h1: 'Youth Allowance calculator',
  intro: 'For full-time students and apprentices up to 24 and job seekers up to 21: the fortnightly rate after your earnings, with Rent Assistance.',
  resume: `Youth Allowance pays a single student or apprentice living away from home ${audx(P.ya.rates.away)} a fortnight in 2026, plus an Energy Supplement, and ${audx(P.ya.rates.over18_home)} to a single person aged 18 or over living at home. It is for full-time students and Australian Apprentices aged 16 to ${P.ya.student_age_max} and for job seekers aged 16 to ${P.ya.jobseeker_age_max}. Students have a much larger income free area than job seekers: ${aud(P.ya.student_ifa)} a fortnight before the payment falls by 50 cents per dollar, and 60 cents above ${aud(P.ya.student_band_top)}, plus an income bank that stores unused free area for later. A student living away from home who earns ${aud(450)} a fortnight and shares a house at ${aud(320)} receives about ${x(awayW.rate)} including Rent Assistance. A dependent young person's rate can also be reduced by the parental income test, which this calculator does not model: the result here applies to an independent young person, or one whose parents are on income support or under the parental free area.`,
  tool: 'ya',
  related: ['youth-allowance-for-students', 'austudy-payment', 'student-living-away-from-home', 'rent-assistance-singles-and-sharers', 'family-tax-benefit-for-teenagers', 'jobseeker-payment-calculator'],
  sources: ['ssg-ya-rates', 'ssg-ya', 'ssg-benefit-income-test', 'ssg-ya-students', 'ssg-ya-parental'],
  body: (h) => `
<h2>The rates by situation</h2>
${h.table(['Situation', 'Basic rate', 'Energy Supplement'], [['Single, under 18, at home', h.audx(P.ya.rates.under18_home), x(ssFortnight(P.ya.es_pa.under18_home))], ['Single, 18 or over, at home', h.audx(P.ya.rates.over18_home), x(ssFortnight(P.ya.es_pa.over18_home))], ['Single, away from home', h.audx(P.ya.rates.away), x(ssFortnight(P.ya.es_pa.over18_away))], ['Single, with children', h.audx(P.ya.rates.single_children), x(ssFortnight(P.ya.es_pa.single_children))], ['Partnered, no children', h.audx(P.ya.rates.partnered_no_children), x(ssFortnight(P.ya.es_pa.partnered_no_children))], ['Partnered, with children', h.audx(P.ya.rates.partnered_children), x(ssFortnight(P.ya.es_pa.partnered_children))]], 'Social Security Guide 5.1.1.20 and 5.1.10.20, per fortnight. Youth Allowance rates are indexed each 1 January.', ['l', 'r', 'r'])}
<h2>Student or job seeker: two income tests</h2>
<p>A full-time student or Australian Apprentice can earn ${h.aud(P.ya.student_ifa)} a fortnight before Youth Allowance falls, then loses 50 cents per dollar up to ${h.aud(P.ya.student_band_top)} and 60 cents above. A job seeker on Youth Allowance has the same free area as JobSeeker, ${h.aud(P.ya.jobseeker_ifa)}, then 50 cents to ${h.aud(P.ya.jobseeker_band_top)} and 60 cents above (${h.src('ssg-benefit-income-test', 'Social Security Guide 4.2.2')}). A young job seeker at home aged 19 earning ${h.aud(300)} a fortnight receives about ${x(js.rate)}; as a student with the same earnings, the payment would not be reduced at all.</p>
<h2>Independent or dependent</h2>
<p>Most young people are treated as dependent on their parents until they show otherwise, for example by supporting themselves through work for a set period, being partnered or having a child, or being unable to live at home. A dependent young person's Youth Allowance is subject to a parental income test: combined parental income above the parental income free area reduces the rate by 20 cents per dollar, shared across the siblings who also depend on that income (${h.src('ssg-ya-parental', 'Social Security Guide 4.2.8.10')}). Parents on an income support payment are exempt. Because the free area for 2026 is not stated in the sections read for this site, the calculator leaves the parental test out.</p>
${h.box('Rent Assistance for students', `<p>A student or job seeker living away from home who pays private rent can receive Rent Assistance with Youth Allowance, up to ${h.audx(P.ra_ss.single.max)} a fortnight, or ${h.audx(P.ra_ss.sharer.max)} as a sharer. The calculator only asks for rent when the situation is living away from home. See ${h.a('rent-assistance-singles-and-sharers', 'Rent Assistance for singles and sharers')}.</p>`)}
<h2>Living at home or away</h2>
<p>The rate for living away from home is higher because the young person meets their own housing costs. A dependent young person is usually paid the away-from-home rate only when they need to live away from home, for example to study, or when they cannot live at home. An independent young person living away from home receives that rate as a matter of course.</p>
<h2>From Youth Allowance to other payments</h2>
<p>A student who turns ${P.ya.austudy_age_min} moves to ${h.a('austudy-payment', 'Austudy')}, which pays a similar rate with the same student income test but without the parental tests. A job seeker who turns ${P.benefit.age_min} moves to ${h.a('jobseeker-payment-calculator', 'JobSeeker Payment')}. A teenager still at secondary school is usually covered by the parents' Family Tax Benefit until 18; see ${h.a('family-tax-benefit-for-teenagers', 'Family Tax Benefit for teenagers')}.</p>`,
  faqs: [
    { q: 'How much is Youth Allowance for a student living away from home?', a: `${audx(P.ya.rates.away)} a fortnight in 2026 for a single student without children, plus an Energy Supplement of ${x(ssFortnight(P.ya.es_pa.over18_away))} and Rent Assistance if you pay private rent. Earnings above ${aud(P.ya.student_ifa)} a fortnight reduce it, and a dependent student's rate can also be reduced by the parental income test.` },
    { q: 'How much can I earn on Youth Allowance as a student?', a: `${aud(P.ya.student_ifa)} a fortnight before the payment is reduced, then 50 cents per dollar up to ${aud(P.ya.student_band_top)} and 60 cents above. Unused free area builds up in an income bank, up to ${aud(P.ya.income_bank_max)}, which absorbs later earnings before they reduce the payment, useful for holiday jobs.` },
    { q: 'What is the age limit for Youth Allowance?', a: `Full-time students and Australian Apprentices can receive Youth Allowance from 16 to ${P.ya.student_age_max}; job seekers from 16 to ${P.ya.jobseeker_age_max}. From ${P.ya.austudy_age_min}, students claim Austudy instead, and job seekers move to JobSeeker Payment from ${P.benefit.age_min}. A young person still at secondary school is generally not of Youth Allowance age until 18.` },
    { q: 'Do my parents’ incomes affect my Youth Allowance?', a: 'If you are assessed as dependent, yes: combined parental income above the parental income free area reduces your rate by 20 cents per dollar, shared among the brothers and sisters who also depend on that income. If your parents receive an income support payment, or you are independent, the parental income test does not apply.' },
    { q: 'Is Youth Allowance paid during university holidays?', a: 'Yes, for continuing students between study periods, as long as you remain enrolled. The student income test still applies, and the income bank is useful here: credits built up during semester can absorb holiday earnings. Payment stops at the end of your course or if you withdraw from full-time study.' },
    { q: 'Can I get Youth Allowance and work as an apprentice?', a: `Yes. Full-time Australian Apprentices are assessed like full-time students, with the ${aud(P.ya.student_ifa)} free area. An apprentice's wages often exceed the cut-out, which for a single apprentice living away from home without rent is about ${aud(away.cutOut)} a fortnight, so many apprentices receive a small part rate or none.` },
  ],
});

import { definePage } from '../../lib/page-types';
import { P, aud, audx, youthAllowance, benefitIncomeReduction } from '../../lib/kit';

const x = (n: number) => audx(Math.round(n * 100) / 100);
const ya = (i: number) => youthAllowance({ situation: 'away', student: true, incomePf: i, age: 20 });
const rows = [0, 300, P.ya.student_ifa, P.ya.student_band_top, 800, 1000, 1200].map((i) => [aud(i), x(ya(i).rate), aud(i + ya(i).rate)]);
const fortnightsToFill = Math.ceil(P.ya.income_bank_max / P.ya.student_ifa);
const summerJob = 1400;

export default definePage({
  id: 'youth-allowance-for-students',
  group: 'work',
  kind: 'guide',
  order: 60,
  slug: 'youth-allowance-for-students',
  nav: 'Youth Allowance for students',
  card: 'The student income test, the income bank and how a holiday job is treated.',
  title: 'Youth Allowance Student Income Test 2026: the Income Bank',
  description: `Youth Allowance student income test for 2026: ${aud(P.ya.student_ifa)} a fortnight free, 50c then 60c above, and an income bank of up to ${aud(P.ya.income_bank_max)} for holiday and casual work.`,
  h1: 'Youth Allowance for students: earnings and the income bank',
  intro: 'Students get a higher free area than job seekers and a bank that saves the unused part. How to use both around semesters and holidays.',
  resume: `A full-time student or Australian Apprentice on Youth Allowance can earn ${aud(P.ya.student_ifa)} a fortnight in 2026 without any reduction, more than three times the free area of a job seeker. Above it, the payment falls by 50 cents per dollar up to ${aud(P.ya.student_band_top)} and by 60 cents per dollar after that. On top, each fortnight in which a student earns less than ${aud(P.ya.student_ifa)} adds the difference to an income bank, which can hold up to ${aud(P.ya.income_bank_max)}. When earnings later exceed the free area, for instance during a summer job, credits from the bank are used first, so the payment is not reduced until the bank is empty. The bank is not reset each year, survives the holidays for continuing students, and is cancelled when full-time study ends. Austudy recipients have the same test and the same bank.`,
  mini: 'yaStudent',
  related: ['youth-allowance-calculator', 'austudy-payment', 'student-living-away-from-home', 'centrelink-income-test', 'rent-assistance-singles-and-sharers'],
  sources: ['ssg-ya-students', 'ssg-benefit-income-test', 'ssg-ya-rates'],
  body: (h) => `
<h2>The student income test in numbers</h2>
${h.table(['Earnings per fortnight', 'Youth Allowance (single, away from home)', 'Earnings plus payment'], rows, 'Basic rate and Energy Supplement, no Rent Assistance, no income bank credits. Social Security Guide 4.2.2 step 4A and 5.1.1.20.', ['r', 'r', 'r'])}
<p>Up to ${h.aud(P.ya.student_ifa)}, every dollar earned is kept in full. The band from ${h.aud(P.ya.student_ifa)} to ${h.aud(P.ya.student_band_top)} costs ${h.aud(benefitIncomeReduction(P.ya.student_band_top, 'student'))} in total, and each ${h.aud(100)} above ${h.aud(P.ya.student_band_top)} costs ${h.aud(60)}. The free area is indexed on 1 January, like the rates (${h.src('ssg-ya-students', 'Social Security Guide 4.2.8.50')}).</p>
<h2>How the income bank works</h2>
<p>Think of the free area as an allowance you can save. In every fortnight in which you are paid Youth Allowance as a full-time student and earn less than ${h.aud(P.ya.student_ifa)}, the unused part goes into your income bank. A student who earns nothing during semester adds ${h.aud(P.ya.student_ifa)} a fortnight and fills the bank to its ${h.aud(P.ya.income_bank_max)} limit in ${fortnightsToFill} fortnights. When earnings exceed the free area, the excess is first taken from the bank, and only when the bank is empty does the income test start reducing the payment.</p>
<p>Take a student with a full bank who works over summer, earning ${h.aud(summerJob)} a fortnight. Each fortnight, ${h.aud(summerJob - P.ya.student_ifa)} of that is above the free area and is absorbed by the bank, so the payment stays at the full rate for about ${Math.floor(P.ya.income_bank_max / (summerJob - P.ya.student_ifa))} fortnights. Without the bank, the same earnings would cut the payment to about ${x(ya(summerJob).rate)} each fortnight.</p>
${h.box('Rules of the bank', `<p>The maximum credit in 2026 is ${h.aud(P.ya.income_bank_max)}. The balance is not set to zero each year and carries over the holidays for continuing students. All credits are cancelled when you stop full-time study. A student moving to a job seeker payment can carry part of the bank across as working credits, up to a limit (${h.src('ssg-ya-students', 'section 4.2.8.50')}).</p>`)}
<h2>When the higher free area applies</h2>
<p>The student free area and the income bank apply in every fortnight in which Youth Allowance or Austudy is payable to you as a full-time student, from the date your course starts. A new student who was previously counted for the parents' Family Tax Benefit as a secondary student gets access from the first fortnight after they stop being a senior secondary school child. Access normally ends with the fortnight in which the course ends. Some 22 to 24 year olds who move to full-time study without transferring from JobSeeker keep the job seeker free area instead.</p>
<h2>Planning a year of work around the bank</h2>
<p>The bank rewards a pattern that suits many students: little paid work during teaching weeks, more during breaks. A student earning ${h.aud(250)} a fortnight through semester adds ${h.aud(P.ya.student_ifa - 250)} each fortnight, about ${h.aud((P.ya.student_ifa - 250) * 13)} over a 26-week semester, and can then work more during the break without losing payment until those credits are used. A student who works steadily above the free area all year has nothing in the bank and is assessed fortnight by fortnight under the normal tapers.</p>
<p>Earnings still have to be reported every fortnight, even when the bank covers them. The bank is applied automatically by Services Australia on the income you report; you do not need to ask for it, and it appears on your payment details in your online account.</p>
<h2>Students, parents and partners</h2>
<p>The personal income test is only one part. A dependent student's rate can also be reduced by the parental income test and, in some cases, the parental assets and maintenance tests, while an independent student who is partnered faces a partner income test. Assets above the free area stop the payment for an independent student. These tests sit on top of the student income test described here; the ${h.a('youth-allowance-calculator', 'Youth Allowance calculator')} covers the personal and partner tests, and the ${h.a('student-living-away-from-home', 'student living away from home')} example puts the payment next to Rent Assistance.</p>`,
  faqs: [
    { q: 'What is the Youth Allowance income bank?', a: `A store of unused income free area. In each fortnight you earn less than ${aud(P.ya.student_ifa)} as a full-time student, the difference is credited, up to ${aud(P.ya.income_bank_max)}. When you later earn more than the free area, the bank absorbs the excess first, so your Youth Allowance is not reduced until the credits run out.` },
    { q: 'Do I lose my income bank at the end of the year?', a: 'No. The income bank balance is not set to zero each year, and continuing students keep their credits over the holidays. All credits are cancelled when you stop full-time study, and a student who moves to a job seeker payment can carry part of the balance over as working credits, up to a limit.' },
    { q: 'Can I earn more in the summer holidays on Youth Allowance?', a: `Yes, and the income bank is designed for it. Credits saved during semester absorb holiday earnings above the ${aud(P.ya.student_ifa)} free area before the payment is reduced. A student with a full bank of ${aud(P.ya.income_bank_max)} can work well above the free area for several fortnights and keep the full rate.` },
  ],
});

import { definePage } from '../../lib/page-types';
import { P, aud, audx, youthAllowance, ssFortnight } from '../../lib/kit';

const x = (n: number) => audx(Math.round(n * 100) / 100);
const A = P.ya.austudy;
const single = youthAllowance({ situation: 'away', student: true, austudy: true, incomePf: 0, age: 30 });
const working = youthAllowance({ situation: 'away', student: true, austudy: true, incomePf: 700, rentPf: 420, includeRa: true, age: 30 });

export default definePage({
  id: 'austudy-payment',
  group: 'work',
  kind: 'pillar',
  order: 70,
  slug: 'austudy-payment',
  nav: 'Austudy calculator',
  card: 'Income support for full-time students and apprentices aged 25 or over.',
  title: 'Austudy 2026: Rates, Income Test and Calculator for 25+',
  description: `Austudy calculator for 2026: ${audx(A.single)} a fortnight for a single student aged ${P.ya.austudy_age_min}+, the ${aud(P.ya.student_ifa)} free area, the income bank and Rent Assistance, all worked out.`,
  h1: 'Austudy calculator',
  intro: 'For full-time students and Australian Apprentices aged 25 or over: the rate after earnings, with Rent Assistance if you rent.',
  resume: `Austudy is the student payment for people aged ${P.ya.austudy_age_min} or over who study full time or do a full-time Australian Apprenticeship. In 2026 a single student without children receives up to ${audx(A.single)} a fortnight, and a single student with children ${audx(A.single_children)}, each plus an Energy Supplement, with Rent Assistance added for private renters. Unlike Youth Allowance, Austudy has no parental income test: only your own income and assets, and your partner's income if you have one, are assessed. The student income test applies, with a free area of ${aud(P.ya.student_ifa)} a fortnight, 50 cents per dollar up to ${aud(P.ya.student_band_top)} and 60 cents above, and the same income bank of up to ${aud(P.ya.income_bank_max)}. A single student earning ${aud(700)} a fortnight and renting at ${aud(420)} receives about ${x(working.rate)}. Rates are indexed every 1 January.`,
  tool: 'austudy',
  related: ['youth-allowance-for-students', 'youth-allowance-calculator', 'rent-assistance-singles-and-sharers', 'jobseeker-payment-calculator', 'centrelink-payment-rates'],
  sources: ['ssg-austudy-rates', 'ssg-austudy', 'ssg-ya-students', 'ssg-es-rates'],
  body: (h) => `
<h2>The rates</h2>
${h.table(['Situation', 'Basic rate', 'Energy Supplement'], [['Single, no children', h.audx(A.single), x(ssFortnight(A.es_single_pa))], ['Single, with children', h.audx(A.single_children), x(ssFortnight(A.es_single_children_pa))], ['Partnered, no children', h.audx(A.partnered), x(ssFortnight(A.es_partnered_pa))], ['Partnered, with children', h.audx(A.partnered_children), x(ssFortnight(A.es_partnered_children_pa))]], 'Social Security Guide 5.1.2.30 and 5.1.10.20, per fortnight. Indexed each 1 January.', ['l', 'r', 'r'])}
<p>A special higher rate applies to people who start full-time study or an apprenticeship after a long period on income support, and to some migrants studying English; Services Australia decides who qualifies. The calculator uses the standard rates.</p>
<h2>Who Austudy is for</h2>
<p>Austudy is income support for mature students and apprentices aged ${P.ya.austudy_age_min} and over who do not have adequate income (${h.src('ssg-austudy', 'Social Security Guide 1.2.2.30')}). The course must be an approved full-time course at secondary or tertiary level, or a full-time Australian Apprenticeship. Students under ${P.ya.austudy_age_min} claim Youth Allowance instead. Part-time study does not qualify, although a student with a disability or another accepted reason may be able to study a reduced load.</p>
<h2>The income test and the income bank</h2>
<p>Austudy uses the student income test: ${h.aud(P.ya.student_ifa)} free a fortnight, 50 cents per dollar to ${h.aud(P.ya.student_band_top)}, 60 cents above. A single student with no rent keeps some Austudy until earnings reach about ${h.aud(single.cutOut)} a fortnight. Unused free area builds up in an income bank, up to ${h.aud(P.ya.income_bank_max)}, which absorbs later earnings above the free area before the payment falls: useful for a student who works mainly in the holidays (${h.src('ssg-ya-students', 'Social Security Guide 4.2.8.50')}).</p>
${h.box('No parental means test', `<p>The main difference from Youth Allowance is what is not tested. An Austudy recipient's parents' income and assets are irrelevant. A partner's income above the partner income free area reduces the payment by 60 cents per dollar, and assets above the free area, ${h.aud(P.benefit.assets_free_area.homeowner_single)} for a single homeowner, stop it.</p>`)}
<h2>Assets and savings</h2>
<p>Mature students often have savings, a car or a property. Austudy is not payable if assets, excluding the home you live in, exceed the free area: ${h.aud(P.benefit.assets_free_area.homeowner_single)} for a single homeowner and ${h.aud(P.benefit.assets_free_area.nonhomeowner_single)} for a single person who does not own a home. Savings under the limit still produce deemed income, which counts in the income test.</p>
<h2>Austudy and the rest of the household</h2>
<p>A student parent on Austudy is on an income support payment, so the family's Family Tax Benefit is paid without the family income test, and Rent Assistance for a student parent comes through Family Tax Benefit Part A rather than with Austudy. A student without children who rents privately receives Rent Assistance with the payment, at up to ${h.audx(P.ra_ss.single.max)} a fortnight. The ${h.a('home', 'household calculator')} handles both cases.</p>`,
  faqs: [
    { q: 'How much is Austudy per fortnight in 2026?', a: `${audx(A.single)} for a single student without children and ${audx(A.single_children)} for a single student with children, ${audx(A.partnered)} for a partnered student without children and ${audx(A.partnered_children)} with children. An Energy Supplement and, for private renters, Rent Assistance are added; earnings above ${aud(P.ya.student_ifa)} a fortnight reduce it.` },
    { q: 'What is the difference between Austudy and Youth Allowance?', a: `Age and the parental test. Youth Allowance is for full-time students and apprentices up to ${P.ya.student_age_max}, and a dependent student's rate can be reduced by the parental income test. Austudy is for students aged ${P.ya.austudy_age_min} or over and never looks at parents' income. Both use the same student income test and income bank.` },
    { q: 'Can I get Austudy while working part time?', a: `Yes. You can earn ${aud(P.ya.student_ifa)} a fortnight without any reduction, and the income bank stores the unused part of that free area for later. Above it, Austudy falls by 50 cents per dollar up to ${aud(P.ya.student_band_top)} and 60 cents above, so part-time work and a part rate of Austudy often go together.` },
    { q: 'Does Austudy include Rent Assistance?', a: `It can. A student on Austudy without children who pays private rent above the threshold of ${audx(P.ra_ss.single.threshold)} a fortnight receives Rent Assistance with the payment, up to ${audx(P.ra_ss.single.max)}, or ${audx(P.ra_ss.sharer.max)} as a sharer. A student parent receives it through Family Tax Benefit Part A instead.` },
    { q: 'Can I get Austudy for a master’s degree?', a: 'Only for courses that are approved for student payments. Many postgraduate coursework programs are approved, but not all, and research degrees are generally assessed differently. Check the course with Services Australia before you enrol, because the approval of the course, not the level, decides whether Austudy can be paid.' },
    { q: 'Do I have to repay Austudy?', a: 'No. Austudy is an income support payment, not a loan, and it is not repaid unless you were overpaid, for example because income was not reported. It is taxable income. The separate Student Start-up Loan, available to some Austudy recipients, is a loan and is repaid through the tax system like a study debt.' },
  ],
});

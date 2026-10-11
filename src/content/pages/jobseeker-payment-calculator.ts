import { definePage } from '../../lib/page-types';
import { P, aud, audx, day, jobseeker, partnerIncomeFreeArea, ssFortnight } from '../../lib/kit';

const x = (n: number) => audx(Math.round(n * 100) / 100);
const max = jobseeker({ couple: false, children: false, incomePf: 0 });
const w600 = jobseeker({ couple: false, children: false, incomePf: 600 });

export default definePage({
  id: 'jobseeker-payment-calculator',
  group: 'work',
  kind: 'pillar',
  order: 10,
  slug: 'jobseeker-payment-calculator',
  nav: 'JobSeeker calculator',
  card: 'Your JobSeeker rate with earnings, a partner’s income, rent and assets.',
  title: 'JobSeeker Payment Calculator 2026: Rate, Earnings and Rent',
  description: `JobSeeker Payment calculator with the rates of ${day(P.rates_date)}: ${x(max.rate)} a fortnight single, the ${aud(P.benefit.income_free_area)} free area, partner income and Rent Assistance added.`,
  h1: 'JobSeeker Payment calculator',
  intro: 'Your fortnightly JobSeeker Payment after the income and assets tests, with Rent Assistance if you rent.',
  resume: `JobSeeker Payment for a single adult without children is ${audx(P.benefit.jsp.single)} a fortnight plus an Energy Supplement of ${x(ssFortnight(P.benefit.jsp.es_single_pa))}, a total of ${x(max.rate)} since ${day(P.rates_date)}. It is paid from age ${P.benefit.age_min} to Age Pension age to people looking for work or temporarily unable to work. You can earn ${aud(P.benefit.income_free_area)} a fortnight without losing anything; between ${aud(P.benefit.income_free_area)} and ${aud(P.benefit.lower_band_top)} each dollar costs 50 cents, and above ${aud(P.benefit.lower_band_top)} it costs 60 cents, so a single person earning ${aud(600)} a fortnight still receives about ${x(w600.rate)}. A single principal carer of a child loses only 40 cents per dollar. A partner's income above about ${aud(partnerIncomeFreeArea())} a fortnight reduces the payment by 60 cents per dollar, assets above the free area stop it, and private renters receive Rent Assistance on top. The calculator applies all of these.`,
  tool: 'jsp',
  related: ['jobseeker-payment-rates', 'jobseeker-income-test', 'jobseeker-partner-income-test', 'single-jobseeker-renting', 'jobseeker-couple-with-children', 'rent-assistance-singles-and-sharers'],
  sources: ['ssg-common-benefit', 'ssg-es-rates', 'ssg-benefit-income-test', 'ssg-assets-test', 'ssg-jsp'],
  body: (h) => `
<h2>What the calculator takes into account</h2>
<p>The maximum rate depends on your situation: single without children, single with a dependent child, single aged 55 or over after nine continuous months on payment, or partnered. The Energy Supplement is added, then Rent Assistance if you rent privately and have no children (with children, Rent Assistance comes through Family Tax Benefit instead). The income test is applied to that total: your own earnings first, then, for a couple, the partner's income above the partner income free area. Finally the assets test either lets the payment through or stops it entirely; there is no taper on assets for JobSeeker (${h.src('ssg-assets-test', 'Social Security Guide 4.2.3')}).</p>
<h2>Earnings: what you keep</h2>
<p>JobSeeker is assessed fortnight by fortnight on the income you report, so a fortnight with more shifts gives a smaller payment and a quiet fortnight a larger one. The tapers mean that work always adds to your total: earning ${h.aud(600)} instead of nothing leaves you ${h.aud(600 + w600.rate - max.rate)} better off for the fortnight, before tax. The ${h.a('jobseeker-income-test', 'income test guide')} has a table of earnings and payments, and explains the working credit that lets recipients keep more of the first wages after a period without work.</p>
${h.box('Partner income is assessed separately', `<p>A partner's earnings do not reduce your payment until they pass the income at which the partner's own JobSeeker would stop, about ${h.aud(partnerIncomeFreeArea())} a fortnight; above that, 60 cents per dollar comes off your payment. If your partner receives a pension, half the couple's combined income is counted as yours instead. See ${h.a('jobseeker-partner-income-test', 'the partner income test')}.</p>`)}
<h2>Assets</h2>
<p>JobSeeker is not payable if your assets, excluding your home, are above ${h.aud(P.benefit.assets_free_area.homeowner_single)} as a single homeowner or ${h.aud(P.benefit.assets_free_area.nonhomeowner_single)} as a single non-homeowner, or ${h.aud(P.benefit.assets_free_area.homeowner_couple)} and ${h.aud(P.benefit.assets_free_area.nonhomeowner_couple)} for a couple. Assets include savings, shares, a second property, vehicles and contents at their market value, minus debts secured against them.</p>
<h2>JobSeeker next to other payments</h2>
<p>JobSeeker is an income support payment, so while it is paid, a family's Family Tax Benefit is worked out without the family income test. That link is often worth more than the JobSeeker itself for a family with children; the ${h.a('home', 'household calculator')} shows both together. Mutual obligation requirements, such as job search and activities in your Job Plan, apply unless you are exempt, and missing them can suspend the payment.</p>`,
  faqs: [
    { q: 'How much is JobSeeker per fortnight in 2026?', a: `From ${day(P.rates_date)}, ${audx(P.benefit.jsp.single)} for a single person without children, ${audx(P.benefit.jsp.single_children)} for a single person with a dependent child or aged 55 or over after nine months, and ${audx(P.benefit.jsp.partnered)} each for a partnered person. The Energy Supplement and any Rent Assistance are added on top.` },
    { q: 'How much can I earn on JobSeeker before it stops?', a: `As a single person without children, the payment stops at about ${aud(max.cutOut)} of earnings a fortnight, before Rent Assistance. Up to ${aud(P.benefit.income_free_area)} nothing is deducted; then 50 cents per dollar to ${aud(P.benefit.lower_band_top)} and 60 cents above. With Rent Assistance the cut-out is higher, because the maximum rate is higher.` },
    { q: 'Does my partner’s income affect my JobSeeker?', a: `Yes, once it passes the partner income free area of about ${aud(partnerIncomeFreeArea())} a fortnight, the income at which your partner's own partnered JobSeeker would cut out. Each dollar above that reduces your payment by 60 cents. If your partner receives a pension, half of your combined income is counted as yours instead.` },
    { q: 'Can I get JobSeeker if I have savings?', a: `Yes, as long as your assets are under the free area: ${aud(P.benefit.assets_free_area.homeowner_single)} for a single homeowner and ${aud(P.benefit.assets_free_area.nonhomeowner_single)} for a single person who does not own a home. Savings also produce deemed income, which counts in the income test. Above the free area, JobSeeker is not paid at all.` },
    { q: 'What age can you get JobSeeker?', a: `From ${P.benefit.age_min} until you reach Age Pension age, which is ${P.pension.age}. Younger people looking for work claim Youth Allowance as job seekers between 16 and 21. At Age Pension age, JobSeeker stops and the Age Pension, with its own income and assets tests, takes over.` },
    { q: 'Is JobSeeker taxable income?', a: 'Yes, the basic rate is taxable and is reported on your tax return, although many recipients pay no tax because of the low income tax offsets. The Energy Supplement and Rent Assistance are tax-free. As taxable income, JobSeeker also counts in the family income used for Child Care Subsidy.' },
  ],
});

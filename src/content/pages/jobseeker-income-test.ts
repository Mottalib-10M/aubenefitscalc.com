import { definePage } from '../../lib/page-types';
import { P, aud, audx, day, jobseeker, benefitIncomeReduction } from '../../lib/kit';

const x = (n: number) => audx(Math.round(n * 100) / 100);
const earn = [0, 150, 256, 400, 600, 800, 1000, 1200, 1400];
const single = (i: number) => jobseeker({ couple: false, children: false, incomePf: i });
const parent = (i: number) => jobseeker({ couple: false, children: true, incomePf: i });
const rows = earn.map((i) => [aud(i), x(single(i).rate), aud(i + single(i).rate), x(parent(i).rate)]);
const s0 = single(0);

export default definePage({
  id: 'jobseeker-income-test',
  group: 'work',
  kind: 'guide',
  order: 30,
  slug: 'jobseeker-income-test',
  nav: 'JobSeeker income test',
  card: 'How earnings reduce JobSeeker, fortnight by fortnight, and where it stops.',
  title: 'JobSeeker Income Test 2026: Earn $150, Then 50c and 60c',
  description: `JobSeeker income test in 2026: the first ${aud(P.benefit.income_free_area)} a fortnight is free, then 50 cents per dollar to ${aud(P.benefit.lower_band_top)} and 60 cents above; payment stops near ${aud(s0.cutOut)} single.`,
  h1: 'The JobSeeker income test: how much you can earn',
  intro: 'Every fortnight, your reported earnings decide your JobSeeker. The free area, the two tapers and the single parent exception.',
  resume: `JobSeeker Payment is reduced by your income each fortnight. The first ${aud(P.benefit.income_free_area)} a fortnight of income does not affect it. Income between ${aud(P.benefit.income_free_area)} and ${aud(P.benefit.lower_band_top)} reduces the payment by 50 cents per dollar, and income above ${aud(P.benefit.lower_band_top)} by 60 cents per dollar, which is why a single person without children receiving ${x(s0.rate)} at the maximum rate keeps some JobSeeker until earnings reach about ${aud(s0.cutOut)} a fortnight, or higher with Rent Assistance. A single principal carer of a dependent child is treated more gently: only 40 cents per dollar above ${aud(P.benefit.income_free_area)}. The test uses gross income before tax, counted in the fortnight it is earned for employment income, and includes deemed income from savings. For a couple, a separate partner income test also applies. Work always increases the household's total income, because no taper takes a full dollar.`,
  mini: 'jspIncome',
  related: ['jobseeker-payment-calculator', 'jobseeker-partner-income-test', 'jobseeker-payment-rates', 'centrelink-income-test', 'single-jobseeker-renting'],
  sources: ['ssg-benefit-income-test', 'ssg-common-benefit', 'ssg-deeming'],
  body: (h) => `
<h2>The four steps</h2>
<p>The ${h.src('ssg-benefit-income-test', 'Social Security Guide 4.2.2')} sets the test out in steps. Work out your ordinary income for the fortnight. Take away the free area of ${h.aud(P.benefit.income_free_area)}. Multiply income between ${h.aud(P.benefit.income_free_area)} and ${h.aud(P.benefit.lower_band_top)} by 0.5 and income above ${h.aud(P.benefit.lower_band_top)} by 0.6, or, for a single principal carer, everything above ${h.aud(P.benefit.income_free_area)} by 0.4. Add any partner income reduction. Subtract the result from your maximum rate, which includes the Energy Supplement and any Rent Assistance.</p>
${h.table(['Earnings per fortnight', 'JobSeeker, single', 'Earnings plus JobSeeker', 'JobSeeker, single parent'], rows, `Rates from ${day(P.rates_date)}, no Rent Assistance, no other income. Single parent: the 40 cent taper and the higher rate with a dependent child.`, ['r', 'r', 'r', 'r'])}
<h2>What the table tells you</h2>
<p>Read the third column. Earnings plus JobSeeker rise all the way down the table: each extra dollar earned adds at least 40 cents to the household's total, and up to a dollar while earnings stay under ${h.aud(P.benefit.income_free_area)}. The first ${h.aud(P.benefit.lower_band_top - P.benefit.income_free_area)} above the free area cost ${h.aud(benefitIncomeReduction(P.benefit.lower_band_top))} in total; after that, each ${h.aud(100)} costs ${h.aud(60)}. Tax on the earnings comes on top, but many JobSeeker recipients earning part-time wages pay little or none.</p>
<p>The single parent column shows a different shape. The 40 cent taper is gentler than the 60 cent one, and the payment starts higher, so a single parent on JobSeeker keeps some payment to a much higher income: about ${h.aud(parent(0).cutOut)} a fortnight before Rent Assistance.</p>
<h2>What counts as income</h2>
<p>Gross wages before tax, income from self-employment after business expenses, rent received, and deemed income from financial assets all count. Deemed income replaces actual interest and dividends: from ${h.day(P.rates_date)}, a single person's financial assets earn a notional ${P.deeming.lower_rate}% up to ${h.aud(P.deeming.threshold_single)} and ${P.deeming.upper_rate}% above (${h.src('ssg-deeming', 'Social Security Guide 4.4.1.10')}). Employment income counts in the fortnight it is earned, not when it is paid. Lump-sum leave or redundancy payments can delay JobSeeker through an income maintenance period covering the time they represent.</p>
${h.box('Working credit', `<p>A JobSeeker recipient who has not been working builds a working credit balance during fortnights with income under the free area. When work starts, the balance absorbs earnings before the income test applies, so the first weeks of a new job reduce the payment less. Services Australia tracks the balance on your record; the calculator on this site does not apply it, so a new job can look slightly worse here than it will be.</p>`)}
<h2>Three fortnights of casual work</h2>
<p>Casual work rarely brings the same income every fortnight, and JobSeeker follows it. Imagine Sam, single, on the full rate of ${x(s0.rate)}. In the first fortnight he works one shift and earns ${h.aud(140)}: under the free area, he keeps the whole payment. In the second he earns ${h.aud(520)}, and his JobSeeker drops to ${x(single(520).rate)}. In the third, a busy fortnight, he earns ${h.aud(1600)}, above the cut-out, so no JobSeeker is paid for that fortnight. Over the six weeks he received ${h.aud(140 + 520 + 1600 + s0.rate + single(520).rate)} in wages and payments together, against ${h.aud(3 * s0.rate)} from JobSeeker alone had he not worked.</p>
<p>The same arithmetic explains why reporting matters. If Sam reports the busy fortnight's wages in the following fortnight by mistake, both fortnights are assessed wrongly, and the difference shows up later as a debt, sometimes months after the work was done, when Services Australia matches the wages with the employer's records.</p>
<h2>Reporting and the cut-out</h2>
<p>Earnings must be reported each fortnight, even when they are below the free area. If your income in a fortnight is above the cut-out, no JobSeeker is paid for it, but you may stay on the system for a period and return to payment without a new claim if your hours drop again. A mistake in reporting is the most common reason for a JobSeeker debt; the payment summary in your Centrelink online account shows the income used for each fortnight.</p>`,
  faqs: [
    { q: 'How much can I earn on JobSeeker without losing anything?', a: `${aud(P.benefit.income_free_area)} a fortnight. Income up to that amount, from work or other sources including deemed income from savings, leaves your JobSeeker untouched. Above it, the payment falls by 50 cents for each dollar up to ${aud(P.benefit.lower_band_top)}, then by 60 cents, or by 40 cents for a single principal carer of a child.` },
    { q: 'Is JobSeeker reduced by gross or net pay?', a: 'By gross pay: your earnings before tax, not the amount that reaches your bank account. Self-employed recipients report business income after allowable expenses. Report income for the fortnight in which you earn it, even if your employer pays it later, so that the right fortnight is reduced and you avoid a debt.' },
    { q: 'Why does my JobSeeker drop by 60 cents per dollar after $256?', a: `Because the benefits income test has two tapers. Income between ${aud(P.benefit.income_free_area)} and ${aud(P.benefit.lower_band_top)} a fortnight reduces the payment by 50 cents per dollar; income above ${aud(P.benefit.lower_band_top)} by 60 cents. A single principal carer of a dependent child pays only 40 cents per dollar above ${aud(P.benefit.income_free_area)}, with no second band.` },
    { q: 'Does working while on JobSeeker always leave me better off?', a: 'Before tax, yes: no taper removes a full dollar, so each dollar earned adds at least 40 cents to your income. Other effects can matter, such as travel or child care costs, or losing a concession card once JobSeeker stops, so it is worth checking the whole picture with the household calculator.' },
  ],
});

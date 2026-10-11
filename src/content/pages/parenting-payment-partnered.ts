import { definePage } from '../../lib/page-types';
import { P, aud, audx, day, parentingPayment, partnerIncomeFreeArea, ssFortnight, household } from '../../lib/kit';

const x = (n: number) => audx(Math.round(n * 100) / 100);
const max = P.benefit.ppp.max + ssFortnight(P.benefit.ppp.es_pa);
const pifa = partnerIncomeFreeArea();
const at = (own: number, partner: number) => parentingPayment({ couple: true, youngest: 2, children: 1, incomePf: own, partnerIncomePf: partner });
const rows = [[0, 800], [0, pifa], [0, 1800], [200, 1800], [0, 2400], [300, 2400]].map(([o, p]) => [aud(o), aud(p), x(at(o, p).rate)]);
const famWith = household({ couple: true, you: { age: 33, payment: 'parenting', incomeAnnual: 0 }, partner: { age: 35, payment: 'none', incomeAnnual: 1800 * 26 }, children: [{ age: 2 }, { age: 7 }], rentPf: 0, homeowner: true });
const famWithout = household({ couple: true, you: { age: 33, payment: 'none', incomeAnnual: 0 }, partner: { age: 35, payment: 'none', incomeAnnual: 1800 * 26 }, children: [{ age: 2 }, { age: 7 }], rentPf: 0, homeowner: true });

export default definePage({
  id: 'parenting-payment-partnered',
  group: 'work',
  kind: 'guide',
  order: 100,
  slug: 'parenting-payment-partnered',
  nav: 'Parenting Payment partnered',
  card: 'The partnered rate, the child under 6 rule and the partner income test.',
  title: 'Parenting Payment Partnered 2026: Rate and Partner Income',
  description: `Parenting Payment partnered in 2026: ${x(max)} a fortnight with a youngest child under ${P.benefit.ppp.youngest_under}, your income tested from ${aud(P.benefit.income_free_area)} and your partner's above about ${aud(pifa)}.`,
  h1: 'Parenting Payment partnered',
  intro: 'For the main carer in a couple with a child under 6: what it pays, how both incomes reduce it, and why it can be worth more than it looks.',
  resume: `Parenting Payment partnered is paid to the principal carer in a couple whose youngest child is under ${P.benefit.ppp.youngest_under}. Since ${day(P.rates_date)} the maximum is ${audx(P.benefit.ppp.max)} a fortnight plus an Energy Supplement of ${x(ssFortnight(P.benefit.ppp.es_pa))}, the same as partnered JobSeeker. It uses the allowance income test on your own income, ${aud(P.benefit.income_free_area)} a fortnight free, then 50 cents per dollar up to ${aud(P.benefit.lower_band_top)} and 60 cents above, and a partner income test: your partner's income above about ${aud(pifa)} a fortnight reduces it by 60 cents per dollar. If your partner receives a pension, half the couple's combined income is counted as yours instead. Its real value is often indirect: while any Parenting Payment is paid, Family Tax Benefit is worked out without the family income test, which can be worth more to the family than the payment itself.`,
  mini: 'ppp',
  related: ['parenting-payment-calculator', 'parenting-payment-single', 'jobseeker-partner-income-test', 'couple-two-children-one-income', 'family-tax-benefit-income-test'],
  sources: ['ssg-ppp-tests', 'ssg-common-benefit', 'ssg-pp', 'fag-ftb-m1'],
  body: (h) => `
<h2>The partner income test in practice</h2>
<p>For a partner who does not receive a social security payment, the partner income free area is the income at which JobSeeker would stop for the partner if they claimed it, rounded up: about ${h.aud(pifa)} a fortnight on the rates of ${h.day(P.rates_date)} (${h.src('ssg-ppp-tests', 'Social Security Guide 4.2.4.20')}). Below it, the partner's earnings do not touch your payment. Above it, each dollar costs 60 cents of Parenting Payment, on top of any reduction for your own income.</p>
${h.table(['Your income', 'Partner income', 'Parenting Payment'], rows, `Per fortnight, youngest child aged 2, rates from ${day(P.rates_date)}, Energy Supplement included.`, ['r', 'r', 'r'])}
<p>The table shows how quickly the partner test takes over. With no income of your own, the payment is untouched while your partner earns up to about ${h.aud(pifa)}, and gone at about ${h.aud(pifa + max / 0.6)}. Small earnings of your own make little extra difference until they pass ${h.aud(P.benefit.income_free_area)}.</p>
<h2>Why a small payment can matter a lot</h2>
<p>Parenting Payment partnered is an income support payment. As long as even a few dollars of it are paid, the family's Family Tax Benefit Part A and Part B are paid at their maximum rates without the family income test (${h.src('fag-ftb-m1', 'Family Assistance Guide 3.1.4.40')}). Take a couple with children aged 2 and 7 where the partner earns ${h.aud(1800)} a fortnight and the main carer earns nothing. With Parenting Payment, the household receives about ${h.aud(famWith.fortnightTotal)} a fortnight from Centrelink; without it, about ${h.aud(famWithout.fortnightTotal)}. The gap is larger than the Parenting Payment itself, because Family Tax Benefit moves to the maximum.</p>
${h.box('Only one parent can receive it', `<p>Parenting Payment is paid to one person at a time, the principal carer of the child (${h.src('ssg-pp', 'Social Security Guide 1.2.4.10')}). The other parent may be able to claim JobSeeker if they meet its conditions; each payment then applies the partner test to the other's income.</p>`)}
<h2>When the youngest turns 6</h2>
<p>Parenting Payment partnered ends on the youngest child's ${P.benefit.ppp.youngest_under}th birthday. A carer who still meets the conditions can usually move to JobSeeker at the same partnered rate and with the same partner test, but with mutual obligation requirements that reflect the child's age. If no payment follows, the family's Family Tax Benefit returns to the family income test from that day, and the ${h.a('family-tax-benefit-income-test', 'income test guide')} shows what that means for your income level.</p>
<h2>Working part time as the main carer</h2>
<p>The main carer's own earnings are assessed under the ordinary allowance taper. A carer working one day a week for ${h.aud(250)} a fortnight loses ${x(at(0, 0).rate - at(250, 0).rate)} of payment; at ${h.aud(500)} a fortnight, about ${x(at(0, 0).rate - at(500, 0).rate)}. Combined with a partner whose income is above the partner free area, the payment can disappear sooner than either test alone would suggest, which is exactly when the Family Tax Benefit link starts to matter most.</p>
<p>A couple deciding which parent should be the principal carer on paper should look at both incomes: the parent with the lower earnings usually keeps more Parenting Payment, since the partner free area protects the higher earner's wages up to about ${h.aud(pifa)} a fortnight before tax.</p>
<h2>Assets, income periods and separations</h2>
<p>The couple's combined assets are tested against the allowance free area, ${h.aud(P.benefit.assets_free_area.homeowner_couple)} for homeowners and ${h.aud(P.benefit.assets_free_area.nonhomeowner_couple)} for non-homeowners, and the payment stops above it; the limits are halved when the partner receives a social security payment. Employment income is assessed fortnight by fortnight; some other types of income can be spread over a longer period, up to 52 weeks, unless your partner receives an allowance (${h.src('ssg-ppp-tests', 'section 4.2.4.20')}). A couple separated by illness or respite care, or with a partner in prison, is paid at the higher single-with-child rate, with the income and assets tests still applied to the couple.</p>`,
  faqs: [
    { q: 'How much can my partner earn before Parenting Payment partnered stops?', a: `If you have no income yourself, your partner can earn about ${aud(pifa)} a fortnight before your payment is reduced, and it stops at about ${aud(pifa + max / 0.6)}. Each dollar in between reduces it by 60 cents. Your own income above ${aud(P.benefit.income_free_area)} a fortnight reduces it further.` },
    { q: 'Is Parenting Payment partnered the same as JobSeeker?', a: `The rate is the same, ${audx(P.benefit.ppp.max)} a fortnight plus the Energy Supplement, and so are the income tests. The differences are who it is for, a principal carer with a youngest child under ${P.benefit.ppp.youngest_under}, and the mutual obligation requirements, which are lighter for parents of young children.` },
    { q: 'Should I claim Parenting Payment partnered if it is only a few dollars?', a: 'Often yes. While any amount of Parenting Payment is paid, your family’s Family Tax Benefit is worked out without the family income test, which can be worth far more than the payment itself. A part-rate payment also usually comes with a concession card. Check the household total before deciding not to claim.' },
  ],
});

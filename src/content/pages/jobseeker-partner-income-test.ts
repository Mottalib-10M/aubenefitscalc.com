import { definePage } from '../../lib/page-types';
import { P, aud, audx, day, jobseeker, partnerIncomeFreeArea, ssFortnight } from '../../lib/kit';

const x = (n: number) => audx(Math.round(n * 100) / 100);
const pifa = partnerIncomeFreeArea();
const partnered = P.benefit.jsp.partnered + ssFortnight(P.benefit.jsp.es_partnered_pa);
const at = (p: number) => jobseeker({ couple: true, children: false, incomePf: 0, partnerIncomePf: p });
const stops = pifa + partnered / 0.6;
const rows = [800, 1200, pifa, 1800, 2200, 2600].map((p) => [aud(p), x(at(p).partnerReduction), x(at(p).rate)]);
const pens = jobseeker({ couple: true, children: false, incomePf: 200, partnerIncomePf: 600, partnerOnPension: true });

export default definePage({
  id: 'jobseeker-partner-income-test',
  group: 'work',
  kind: 'guide',
  order: 40,
  slug: 'jobseeker-partner-income-test',
  nav: 'JobSeeker partner income',
  card: 'When a partner’s wages start to reduce your JobSeeker, and by how much.',
  title: 'JobSeeker Partner Income Test 2026: Free Area and 60c Taper',
  description: `JobSeeker partner income test in 2026: a partner can earn about ${aud(pifa)} a fortnight before your payment falls by 60 cents per dollar; it stops near ${aud(stops)}.`,
  h1: 'The JobSeeker partner income test',
  intro: 'Your partner’s earnings count, but only above a free area set by their own notional JobSeeker. The rule, the numbers and the pensioner exception.',
  resume: `If you receive JobSeeker and live with a partner who works, your partner's income reduces your payment only once it passes the partner income free area: the amount of income at which your partner would stop receiving JobSeeker at the partnered rate if they claimed it, rounded up to the next dollar. With the rates of ${day(P.rates_date)}, that is about ${aud(pifa)} a fortnight. Each dollar of partner income above it reduces your JobSeeker by 60 cents, so, with no income of your own, your partnered payment of ${x(partnered)} disappears when your partner earns about ${aud(stops)} a fortnight. Your own earnings are assessed separately with the usual free area and tapers, and both reductions are added. The rule changes when your partner receives a pension: then half of your combined income is treated as yours and there is no partner reduction.`,
  mini: 'jspPartner',
  related: ['jobseeker-payment-calculator', 'jobseeker-income-test', 'jobseeker-couple-with-children', 'parenting-payment-partnered', 'centrelink-income-test'],
  sources: ['ssg-benefit-income-test', 'ssg-common-benefit', 'ssg-ppp-tests'],
  body: (h) => `
<h2>Where the partner free area comes from</h2>
<p>The free area is not a fixed figure written in the guide. It is defined as the amount of income, rounded up to the nearest dollar, beyond which JobSeeker would not be payable to your partner if your partner were qualified for it (${h.src('ssg-benefit-income-test', 'Social Security Guide 4.2.2')}). In practice that means taking the partnered maximum rate, ${h.audx(P.benefit.jsp.partnered)} plus the Energy Supplement, and finding the income that the ordinary tapers would need to remove all of it: ${h.aud(P.benefit.income_free_area)} free, 50 cents to ${h.aud(P.benefit.lower_band_top)}, 60 cents above. The answer is about ${h.aud(pifa)} a fortnight. Because it is tied to the JobSeeker rate, it moves at every indexation.</p>
<p>For a partner under 22 who is not on a payment, the cut-out of Youth Allowance as a job seeker is used instead, and for a partner who receives a benefit, the partner's own actual cut-out. The calculators on this site use the JobSeeker figure.</p>
${h.table(['Partner earnings per fortnight', 'Reduction to your JobSeeker', 'Your JobSeeker'], rows, `Partnered rate with Energy Supplement, rates from ${day(P.rates_date)}, you have no income of your own.`, ['r', 'r', 'r'])}
<h2>Your income and your partner's together</h2>
<p>The two reductions are calculated separately and added. Suppose you earn ${h.aud(300)} a fortnight and your partner earns ${h.aud(1900)}. Your own income costs ${x(at(0).maxRate - jobseeker({ couple: true, children: false, incomePf: 300 }).rate)} through the ordinary tapers; your partner's income is ${h.aud(1900 - pifa)} above the partner free area and costs a further ${x((1900 - pifa) * 0.6)}. Your JobSeeker falls to ${x(jobseeker({ couple: true, children: false, incomePf: 300, partnerIncomePf: 1900 }).rate)}. Your partner's income below the free area never counts, and your own income below ${h.aud(P.benefit.income_free_area)} never counts either.</p>
${h.box('When your partner gets a pension', `<p>If your partner receives the Age Pension, Carer Payment or another social security pension, the partner test is replaced by a different approach: your income for JobSeeker is half of the couple's combined income, and there is no partner reduction. With your own ${h.aud(200)} and your partner's ${h.aud(600)}, ${h.aud(400)} is treated as yours, and your JobSeeker is ${x(pens.rate)}. The pensioner's own rate uses the couple's combined income under the pension test.</p>`)}
<h2>Children, Parenting Payment and Family Tax Benefit</h2>
<p>A partnered parent whose youngest child is under ${P.benefit.ppp.youngest_under} can receive Parenting Payment partnered instead of JobSeeker. It has the same partner income test, with the same free area and 60 cent taper (${h.src('ssg-ppp-tests', 'Social Security Guide 4.2.4.20')}). Whichever payment you receive, as long as some of it is paid, the family's Family Tax Benefit is worked out without the family income test. A partner's pay rise that reduces your JobSeeker to nil therefore also brings the family income test back for Family Tax Benefit, which can cost more than the JobSeeker itself. The ${h.a('jobseeker-couple-with-children', 'JobSeeker couple with children')} page works through that case.</p>
<h2>A couple where one partner starts work</h2>
<p>Consider Lena and Tom, both on JobSeeker at the partnered rate. Tom finds a job paying ${h.aud(1400)} a fortnight. Two things happen. Tom's own JobSeeker falls under the ordinary tapers and stops, because ${h.aud(1400)} is close to the partnered cut-out. Lena's JobSeeker is reduced only by the part of Tom's income above the partner free area of ${h.aud(pifa)}: at ${h.aud(1400)} there is ${h.aud(Math.max(0, 1400 - pifa))} above it, so her payment ${1400 > pifa ? `falls by ${x((1400 - pifa) * 0.6)}` : 'is unchanged'}. When Tom's pay rises to ${h.aud(2200)}, Lena's payment falls to ${x(at(2200).rate)}.</p>
<p>The design is deliberate: a partner's income is ignored up to the point where it would have supported that partner alone on JobSeeker, and only the surplus is shared with the household. That is also why the free area is recalculated at every indexation.</p>
<h2>What counts as partner income</h2>
<p>The same items as for your own income: wages before tax, business income, rent received and deemed income on financial assets. Assets are assessed jointly against the couple's assets free area, ${h.aud(P.benefit.assets_free_area.homeowner_couple)} for homeowners or ${h.aud(P.benefit.assets_free_area.nonhomeowner_couple)} for non-homeowners, and JobSeeker stops completely above it.</p>`,
  faqs: [
    { q: 'How much can my partner earn before my JobSeeker stops?', a: `If you have no income yourself, your JobSeeker starts to fall once your partner earns about ${aud(pifa)} a fortnight, and stops at about ${aud(stops)} a fortnight. Each dollar in between reduces your payment by 60 cents. Your own earnings, assessed separately, bring the cut-off lower.` },
    { q: 'Is the JobSeeker partner income free area fixed?', a: `No. It is the income at which your partner's own JobSeeker, at the partnered rate, would cut out, rounded up to the next dollar. It therefore rises whenever the JobSeeker rate is indexed, on 20 March and 20 September. On the rates of ${day(P.rates_date)} it is about ${aud(pifa)} a fortnight.` },
    { q: 'My partner is on the Age Pension: does their pension reduce my JobSeeker?', a: 'Not through the partner test. When your partner receives a pension, your income for JobSeeker is half of the couple’s combined ordinary income, and there is no partner income reduction. The pension itself is not counted as income, but your partner’s other income, such as wages or deemed income, enters the combined figure.' },
  ],
});

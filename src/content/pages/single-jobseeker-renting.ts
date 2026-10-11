import { definePage } from '../../lib/page-types';
import type { Household } from '../../lib/engine/household';
import { P, aud, audx, day, household, jobseeker, ssFortnight, benefitIncomeReduction } from '../../lib/kit';

const preset: Household = { couple: false, you: { age: 34, payment: 'jobseeker', incomeAnnual: 6000 }, children: [], rentPf: 450, homeowner: false };
const r = household(preset);
const j = jobseeker({ couple: false, children: false, incomePf: 6000 / 26, rentPf: 450, includeRa: true });
const more = jobseeker({ couple: false, children: false, incomePf: 600, rentPf: 450, includeRa: true });
const share = jobseeker({ couple: false, children: false, incomePf: 6000 / 26, rentPf: 300, sharer: true, includeRa: true });
const x = (n: number) => audx(Math.round(n * 100) / 100);

export default definePage({
  id: 'single-jobseeker-renting',
  group: 'cases',
  kind: 'case',
  order: 50,
  slug: 'households/single-jobseeker-renting',
  nav: 'Single on JobSeeker, renting',
  card: 'JobSeeker with Rent Assistance and a little casual work, and what more shifts change.',
  title: 'JobSeeker Rent Assistance 2026: Single Renter, Casual Work',
  description: `JobSeeker with Rent Assistance in 2026: a single renter paying ${aud(450)} a fortnight with a little casual work gets about ${aud(r.fortnightTotal)} a fortnight. More shifts too.`,
  h1: 'A single person on JobSeeker, renting a flat',
  intro: 'Alex is 34, lives alone, pays $450 a fortnight in rent and picks up about $6,000 a year of casual work while looking for a full-time job.',
  resume: `A single adult on JobSeeker who rents alone for ${aud(450)} a fortnight and earns about ${aud(6000)} a year from casual shifts receives about ${aud(r.fortnightTotal)} a fortnight from Centrelink at the rates of ${day(P.rates_date)}. That is the single JobSeeker rate of ${audx(P.benefit.jsp.single)}, the Energy Supplement of ${x(ssFortnight(P.benefit.jsp.es_single_pa))}, and the maximum Rent Assistance for a single person, ${audx(P.ra_ss.single.max)}, because the rent is above the ${audx(P.ra_ss.single.min_rent_for_max)} needed to reach it, less a small reduction for earnings: averaged, the casual work brings about ${aud(6000 / 26)} a fortnight, ${aud(Math.max(0, 6000 / 26 - P.benefit.income_free_area))} above the free area of ${aud(P.benefit.income_free_area)}. In practice JobSeeker is worked out fortnight by fortnight on the hours actually worked, so a fortnight with no shifts pays the full amount and a busy one pays less. There are no children, so Rent Assistance comes with JobSeeker and no Family Tax Benefit is involved.`,
  preset,
  related: ['jobseeker-income-test', 'rent-assistance-singles-and-sharers', 'jobseeker-payment-calculator', 'jobseeker-payment-rates', 'student-living-away-from-home'],
  sources: ['ssg-common-benefit', 'ssg-ra-rates', 'ssg-benefit-income-test'],
  body: (h) => `
<h2>Three parts, one payment</h2>
<p>Alex's fortnightly payment is built from the basic JobSeeker rate for a single person without children, the Energy Supplement, and Rent Assistance (${h.src('ssg-ra-rates', 'Social Security Guide 5.1.7.10')}). Rent Assistance is 75 cents per dollar of rent above ${h.audx(P.ra_ss.single.threshold)}; at ${h.aud(450)} Alex is past the point where it reaches the single maximum, so any rent increase from here brings no extra help. The income test is then applied to the whole package: ${h.aud(P.benefit.income_free_area)} free, 50 cents per dollar up to ${h.aud(P.benefit.lower_band_top)}, 60 cents above.</p>
<h2>When shifts pick up</h2>
<p>In a fortnight where Alex earns ${h.aud(600)}, JobSeeker falls to about ${x(more.rate)}: ${h.aud(benefitIncomeReduction(P.benefit.lower_band_top))} for the band between ${h.aud(P.benefit.income_free_area)} and ${h.aud(P.benefit.lower_band_top)}, and 60 cents for each dollar above. Earnings plus payment come to ${h.aud(600 + more.rate)} for that fortnight, compared with ${h.aud(j.rate + 6000 / 26)} in an average one. Because Rent Assistance is part of the maximum rate, the payment only stops at a higher income than it would for someone who owns a home: about ${h.aud(more.cutOut)} a fortnight of earnings.</p>
<h2>The month Alex finds a job</h2>
<p>When full-time work starts, JobSeeker does not stop on the first day. The income test is applied to each fortnight's earnings, so the first fortnight's pay, often partial, may still leave some payment. Once earnings are above the cut-out, nothing is paid, but Alex can stay connected to the system for a period and return to payment without a new claim if the job ends. Reporting the start date and the first pay accurately avoids a debt.</p>
<h2>Sharing instead</h2>
<p>If Alex moved into a share house at ${h.aud(300)} a fortnight, the sharer rate would apply: same threshold, lower maximum of ${h.audx(P.ra_ss.sharer.max)}. At that rent the cap would not even bind, and JobSeeker with Rent Assistance would be about ${x(share.rate)} a fortnight. Alex would receive ${h.aud(j.rate - share.rate)} less from Centrelink but pay ${h.aud(150)} less rent, which is the usual trade-off.</p>
${h.box('Assets', `<p>JobSeeker is not paid at all if assets, excluding a home, exceed ${h.aud(P.benefit.assets_free_area.nonhomeowner_single)} for a single person who does not own one. Alex's savings and car are well under that. Savings also produce deemed income, which is added to earnings in the income test.</p>`)}`,
  faqs: [
    { q: 'How much is JobSeeker with Rent Assistance for a single person?', a: `At most ${x(P.benefit.jsp.single + ssFortnight(P.benefit.jsp.es_single_pa) + P.ra_ss.single.max)} a fortnight from ${day(P.rates_date)} for a single person without children living alone: the basic rate, the Energy Supplement and the maximum Rent Assistance of ${audx(P.ra_ss.single.max)}, reached at a rent of ${audx(P.ra_ss.single.min_rent_for_max)}. Earnings above ${aud(P.benefit.income_free_area)} a fortnight reduce it.` },
    { q: 'Does casual work stop my Rent Assistance?', a: 'Not separately. Rent Assistance is part of your JobSeeker maximum rate, so earnings reduce the whole payment, Rent Assistance included, under the ordinary income test. As long as some JobSeeker is paid, you keep receiving it; when earnings pass the cut-out for a fortnight, nothing is paid for that fortnight.' },
    { q: 'Should I report casual shifts every fortnight?', a: 'Yes. JobSeeker is calculated on the income you report for each fortnight, based on when the work was done. Reporting even small amounts keeps the payment right and avoids debts later, when Services Australia matches your reports with your employer’s payroll information.' },
  ],
});

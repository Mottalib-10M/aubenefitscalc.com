import { definePage } from '../../lib/page-types';
import type { Household } from '../../lib/engine/household';
import { P, aud, audx, household, faFortnight, day } from '../../lib/kit';

const preset: Household = { couple: false, you: { age: 31, payment: 'parenting', incomeAnnual: 0 }, children: [{ age: 3 }, { age: 8 }], rentPf: 640, homeowner: false };
const r = household(preset);
const line = (k: string) => r.lines.find((l) => l.key.startsWith(k))?.fortnight ?? 0;
const working = household({ ...preset, you: { ...preset.you, incomeAnnual: 26000 } });
const lineW = (k: string) => working.lines.find((l) => l.key.startsWith(k))?.fortnight ?? 0;

export default definePage({
  id: 'single-parent-two-children-renting',
  group: 'cases',
  kind: 'case',
  order: 10,
  slug: 'households/single-parent-two-children-renting',
  nav: 'Single parent, two children, renting',
  card: 'Parenting Payment, both parts of FTB and Rent Assistance, with and without part-time work.',
  title: 'Single Parent Payments 2026: Two Children and Private Rent',
  description: `Single parent, two children, private rent in 2026: Parenting Payment, FTB A and B and Rent Assistance come to about ${aud(r.fortnightTotal)} a fortnight, shown line by line.`,
  h1: 'A single parent with two children, renting',
  intro: 'Mia is 31, cares for children aged 3 and 8 on her own and pays rent privately. Here is what Centrelink pays her, and what part-time work changes.',
  resume: `A single parent renting privately with children aged 3 and 8 and no other income receives about ${aud(r.fortnightTotal)} a fortnight from Centrelink at the rates of ${day(P.rates_date)}: Parenting Payment single at its full rate of ${audx(P.pps.max)}, Family Tax Benefit Part A of ${aud(line('ftb-a'))} including Rent Assistance, and Part B of ${aud(line('ftb-b'))}. Because Parenting Payment is an income support payment, Family Tax Benefit is paid at the maximum rate without the family income test, and Rent Assistance comes through Part A rather than through Parenting Payment, at the single-parent family rate. Supplements of ${aud(r.endOfYear)} follow the tax return. With part-time earnings of ${aud(26000)} a year the household keeps more in total, because Parenting Payment falls by only 40 cents for each dollar above its free area and Family Tax Benefit stays at the maximum as long as some Parenting Payment is paid.`,
  preset,
  related: ['parenting-payment-single', 'family-tax-benefit-part-a', 'rent-assistance-for-families', 'family-tax-benefit-part-b', 'child-care-subsidy-calculator', 'couple-two-children-one-income'],
  sources: ['ssg-common-pension', 'ssg-pps-limits', 'fag-ftb-rates', 'fag-ftb-m1', 'fag-ra'],
  body: (h) => `
<h2>Why Family Tax Benefit is at the maximum</h2>
<p>Mia's Family Tax Benefit is not tested against her income at all. While she receives Parenting Payment, an income support payment, both parts of FTB are paid at their maximum rates (${h.src('fag-ftb-m1', 'Family Assistance Guide 3.1.4.40')}). Part A is the lower maximum for each of her two children under 13, ${h.aud(faFortnight(2 * P.ftb.a_max_under13))} a fortnight between them, plus Rent Assistance. Part B is at the higher rate because her youngest is under 5; it will drop to the lower rate on the youngest's fifth birthday.</p>
<h2>Rent Assistance through Part A</h2>
<p>At ${h.aud(preset.rentPf)} a fortnight, her rent is well above the point where Rent Assistance reaches its maximum for a family with one or two children, so she receives the full ${h.audx(P.ra_family.max_1or2)} a year inside Part A, about ${h.aud(faFortnight(P.ra_family.max_1or2))} a fortnight. It is paid once: she does not also get the single Rent Assistance rate with Parenting Payment.</p>
<h2>What three days of work change</h2>
<p>Suppose Mia takes a part-time job paying ${h.aud(26000)} a year, about ${h.aud(26000 / 26)} a fortnight. Parenting Payment single has a free area of ${h.aud(h.ssFortnight(P.pps.ifa_pa + 2 * P.pps.ifa_extra_child_pa))} a fortnight with two children, then falls by 40 cents in the dollar: it drops to about ${h.aud(lineW('Parenting'))}. Her Family Tax Benefit does not move, because she still receives some Parenting Payment. The household total becomes ${h.aud(working.fortnightTotal)} a fortnight of payments plus her wages, against ${h.aud(r.fortnightTotal)} without work. If the children go to child care while she works, Child Care Subsidy at ${P.ccs.max_pct}% of the fee up to the hourly cap is added; set the days in the calculator above.</p>
${h.box('The birthday to watch', `<p>Parenting Payment single stops when the youngest child turns ${P.pps.youngest_under}. Mia would then move to JobSeeker at the single rate with a dependent child, which is lower and has a different income test; her Family Tax Benefit would stay at the maximum as long as JobSeeker is paid.</p>`)}
<p>Two things would lower these totals. Child support received above the maintenance income free area of ${h.audx(P.ftb.mifa_single)} a year, plus ${h.audx(P.ftb.mifa_extra_child)} for the second child, reduces Part A above the base rate. Savings or other assets above the free area of ${h.aud(P.benefit.assets_free_area.nonhomeowner_single)} for a single renter stop Parenting Payment altogether.</p>
<p>Each figure comes from the guides cited below and is computed by the same engine as the ${h.a('home', 'household calculator')}. For the payment itself, see ${h.a('parenting-payment-single', 'Parenting Payment single')}.</p>`,
  faqs: [
    { q: 'Does a single parent on Parenting Payment get the full Family Tax Benefit?', a: 'Yes. Parenting Payment is an income support payment, and while it is paid, Family Tax Benefit Part A and Part B are worked out without the family income test, so both are paid at the maximum rates for the children in your care. Child support received can still reduce Part A above the base rate through the maintenance income test.' },
    { q: 'Is Rent Assistance paid with Parenting Payment or with Family Tax Benefit?', a: `With Family Tax Benefit Part A, when you have a child in your care and Part A is above the base rate. The family threshold is ${audx(P.ra_family.threshold_single)} a year of rent for a single parent, and the maximum is ${audx(P.ra_family.max_1or2)} a year with one or two children. It is never paid twice.` },
    { q: 'How much can a single parent earn before Parenting Payment drops?', a: `${aud((P.pps.ifa_pa + 2 * P.pps.ifa_extra_child_pa) / 26)} a fortnight with two children: the free area is ${aud(P.pps.ifa_pa / 26)} plus ${audx(P.pps.ifa_extra_child_pa / 26)} for each child. Above it, the payment falls by 40 cents for each dollar earned, so working always leaves the household better off in total. Family Tax Benefit stays at the maximum while any Parenting Payment is paid.` },
  ],
});

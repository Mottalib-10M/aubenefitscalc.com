import { definePage } from '../../lib/page-types';
import { P, aud, audx, day, pension } from '../../lib/kit';

const x = (n: number) => audx(Math.round(n * 100) / 100);
const A = P.pension.assets_free_area;
const cut = (couple: boolean, homeowner: boolean) => pension({ couple, homeowner, incomePf: 0 }).assetsCutOut;
const perK = (P.pension.assets_step_reduction_pa * 1000) / P.pension.assets_step / P.pension.fortnights_per_year;
const levels = [350000, 450000, 550000, 650000, 750000];
const rows = levels.map((a) => { const r = pension({ couple: false, homeowner: true, incomePf: 0, otherAssets: a }); return [aud(a), x(r.assetsTested)]; });
const mixed = pension({ couple: true, homeowner: true, incomePf: 0, financialAssets: 300000, otherAssets: 380000 });

export default definePage({
  id: 'age-pension-assets-test',
  group: 'older',
  kind: 'guide',
  order: 30,
  slug: 'age-pension-assets-test',
  nav: 'Assets test',
  card: 'Free areas for homeowners and renters, the $3 per $1,000 taper and the cut-offs.',
  title: 'Centrelink Assets Test 2026: Age Pension Limits and Taper',
  description: `Centrelink assets test for 2026: full Age Pension with up to ${aud(A.homeowner_single)} of assets for a single homeowner, then ${aud(perK)} a fortnight less per ${aud(1000)}, with every cut-off.`,
  h1: 'The Centrelink assets test for the Age Pension',
  intro: 'How much you can own and still receive the pension, why homeowners and renters have different limits, and what counts.',
  resume: `The assets test lets a single homeowner hold ${aud(A.homeowner_single)} of assessable assets and still receive the full Age Pension in 2026-27; a homeowner couple ${aud(A.homeowner_couple)} combined; a single non-homeowner ${aud(A.nonhomeowner_single)}; and a non-homeowner couple ${aud(A.nonhomeowner_couple)}. These free areas apply from 1 July 2026. Above them, the pension falls by ${aud(P.pension.assets_step_reduction_pa)} a year for each ${aud(P.pension.assets_step)} of assets, which works out at ${aud(perK)} a fortnight for every ${aud(1000)}, on the single rate or on the couple's combined rate. With the rates of ${day(P.rates_date)}, the pension stops completely at about ${aud(cut(false, true))} for a single homeowner and ${aud(cut(true, true))} for a homeowner couple, and higher for renters or with Rent Assistance. The family home is exempt. The assets test and the income test are both applied, and the one giving the lower pension is used. The same test applies to Carer Payment.`,
  mini: 'assetsTest',
  related: ['age-pension-calculator', 'age-pension-income-test', 'deeming-rates', 'pensioner-couple-homeowners', 'carer-payment-calculator'],
  sources: ['ssg-assets-test', 'ssg-pension-limits', 'ssg-common-pension'],
  body: (h) => `
<h2>The free areas and the cut-offs</h2>
${h.table(['Situation', 'Full pension up to', 'Part pension stops at'], [['Single, homeowner', h.aud(A.homeowner_single), h.aud(cut(false, true))], ['Single, non-homeowner', h.aud(A.nonhomeowner_single), h.aud(cut(false, false))], ['Couple combined, homeowners', h.aud(A.homeowner_couple), h.aud(cut(true, true))], ['Couple combined, non-homeowners', h.aud(A.nonhomeowner_couple), h.aud(cut(true, false))]], `Free areas from 1 July 2026 (Social Security Guide 4.10.3, table 5). Cut-offs worked out from the rates of ${day(P.rates_date)}, without Rent Assistance.`, ['l', 'r', 'r'])}
<p>The free areas are indexed every 1 July. The cut-offs move twice a year as well, because they depend on the pension rate: when the pension rises on 20 March and 20 September, more assets are needed to reduce it to nil.</p>
<h2>How the taper is applied</h2>
<p>The Social Security Guide describes four steps: value your assets, find your free area, take the excess, then divide the excess by ${h.aud(P.pension.assets_step)}, round down to a whole number and multiply by ${h.audx(P.pension.assets_step_reduction_pa)} (${h.src('ssg-assets-test', 'Social Security Guide 4.2.3')}). The result is the annual reduction. Since 1 January 2017, that amounts to ${h.aud(perK)} a fortnight for every ${h.aud(1000)} of assets above the free area. For a couple, the reduction applies to the combined pension and is shared, so each partner loses half.</p>
${h.table(['Assets (single homeowner)', 'Pension under the assets test'], rows, `Per fortnight, rates from ${day(P.rates_date)}. The income test may give a lower rate.`, ['r', 'r'])}
<h2>What counts as an asset</h2>
<p>Almost everything you own, at market value less any debt secured against it, except the home you live in. Assessable assets include bank accounts and term deposits, shares and managed funds, superannuation once you have reached Age Pension age, account-based pensions, investment properties, holiday homes, business assets, cars, caravans and boats, and household contents and personal effects, which are usually valued at what they would fetch second hand rather than replacement cost. Funeral bonds up to a limit and prepaid funerals are exempt, and so are some income streams bought before 20 September 2007.</p>
${h.box('Assets also produce income', `<p>Financial assets are counted twice, in a sense: at their value for the assets test, and through deeming for the income test. A couple with ${h.aud(300000)} in savings and ${h.aud(380000)} of other assets, homeowners, sees both tests applied; their pension is ${x(mixed.ratePerPerson)} each, set by the ${mixed.test} test. See ${h.a('deeming-rates', 'deeming rates')}.</p>`)}
<h2>Homeowners against renters</h2>
<p>The free area for a non-homeowner is ${h.aud(A.nonhomeowner_single - A.homeowner_single)} higher than for a homeowner, single or couple. The gap stands in for the value of the exempt home: a renter has no exempt home, so more of their other assets are protected. For a single person, a renter with ${h.aud(500000)} of savings is still under the free area and receives the full pension under the assets test, while a homeowner with the same savings loses about ${h.aud((Math.floor((500000 - A.homeowner_single) / P.pension.assets_step) * P.pension.assets_step_reduction_pa) / P.pension.fortnights_per_year)} a fortnight. Rent Assistance then raises the renter's maximum rate, and with it the point at which the assets test stops the pension.</p>
<h2>Lowering assessable assets</h2>
<p>Spending on the home, such as renovations, moves money from assessable assets into the exempt home and is a common choice for retirees just above the free area. Paying off debt secured against an assessable asset does not help in the same way, since the asset is already counted net of that debt. Gifts are limited: amounts given away above the gifting allowance continue to count as an asset for five years. Prepaying a funeral or buying an exempt funeral bond within the limit reduces assessable assets legitimately. Before any of these, it is worth checking which test actually sets the pension: if the income test gives the lower rate, reducing assets changes nothing.</p>
<h2>Common questions about the home</h2>
<p>A home is exempt from the assets test while you live in it. If you sell it and intend to buy another, the sale proceeds can be exempt for a limited period. Moving into residential aged care keeps the home exempt for two years in most cases, and longer if a partner still lives there. A granny flat interest, where you transfer assets in exchange for a right to live in a family member's home, has its own rules. These cases are not in the calculator and are worth discussing with Services Australia's Financial Information Service, which is free.</p>`,
  faqs: [
    { q: 'How much can a single homeowner have in assets for the Age Pension?', a: `${aud(A.homeowner_single)} of assessable assets for the full pension from 1 July 2026, not counting the home. Above that, the pension falls by ${aud(perK)} a fortnight per ${aud(1000)} and stops at about ${aud(cut(false, true))}. A single person who does not own a home has a higher free area of ${aud(A.nonhomeowner_single)}.` },
    { q: 'Is my car counted in the Centrelink assets test?', a: 'Yes. Cars, caravans, boats and trailers are assessable assets, counted at their market value less any loan secured against them. So are household contents and personal effects, usually at their second-hand value. Only the home you live in and a few specific items, such as some funeral arrangements, are exempt.' },
    { q: 'Do assets reduce the pension for both partners?', a: `Yes, the couple is tested together. Combined assets above the couple free area, ${aud(A.homeowner_couple)} for homeowners, reduce the combined pension by ${aud(perK)} a fortnight per ${aud(1000)}, so each partner loses half of that. If only one partner is a pensioner, the same combined assets and free area are used.` },
  ],
});

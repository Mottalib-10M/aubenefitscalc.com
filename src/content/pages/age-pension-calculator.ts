import { definePage } from '../../lib/page-types';
import { P, aud, audx, day, pension } from '../../lib/kit';

const x = (n: number) => audx(Math.round(n * 100) / 100);
const ex = pension({ couple: true, homeowner: true, incomePf: 0, financialAssets: 400000, otherAssets: 60000 });
const single = pension({ couple: false, homeowner: true, incomePf: 0 });
const coupleH = pension({ couple: true, homeowner: true, incomePf: 0 });

export default definePage({
  id: 'age-pension-calculator',
  group: 'older',
  kind: 'pillar',
  order: 10,
  slug: 'age-pension-calculator',
  nav: 'Age Pension calculator',
  card: 'Both means tests, deeming and Rent Assistance, with the test that decides named.',
  title: 'Age Pension Calculator 2026: Income and Assets Tests Applied',
  description: `Age Pension calculator with the rates of ${day(P.rates_date)}: up to ${audx(P.pension.max_single)} a fortnight single, deeming at ${P.deeming.lower_rate}% and ${P.deeming.upper_rate}%, both means tests, Rent Assistance.`,
  h1: 'Age Pension calculator',
  intro: 'Your Age Pension under the income test and the assets test, with deeming on savings and Rent Assistance for renters. The lower result is paid.',
  resume: `The full Age Pension is ${audx(P.pension.max_single)} a fortnight for a single person and ${audx(P.pension.max_couple_each)} each for a couple, including the Pension and Energy Supplements, from ${day(P.rates_date)} to 19 March 2027. It is paid from age ${P.pension.age} to Australian residents who pass two means tests, and Centrelink pays whichever gives the lower rate. The income test allows ${aud(P.pension.ifa_single_pa / 26)} a fortnight for a single person and ${aud((2 * P.pension.ifa_couple_each_pa) / 26)} combined for a couple, then takes 50 cents per dollar, 25 cents each for a couple; savings and shares count through deeming. The assets test allows ${aud(P.pension.assets_free_area.homeowner_single)} of assets for a single homeowner, more for renters, then takes ${aud(3)} a fortnight per ${aud(1000)}. A homeowner couple with ${aud(400000)} in savings and ${aud(60000)} of other assets receives about ${x(ex.ratePerPerson)} each, set by the ${ex.test} test.`,
  tool: 'pension',
  related: ['age-pension-rates', 'age-pension-assets-test', 'age-pension-income-test', 'deeming-rates', 'pensioner-couple-homeowners', 'single-pensioner-renting'],
  sources: ['ssg-common-pension', 'ssg-pension-income-test', 'ssg-assets-test', 'ssg-pension-limits', 'ssg-deeming', 'ssg-age'],
  body: (h) => `
<h2>How the calculator works</h2>
<p>Enter your income per fortnight other than from savings (wages, a rental property's net income, a defined benefit pension), your financial assets, and your other assessable assets. The calculator deems your financial assets, adds the deemed income to your other income, and applies the income test. Separately, it adds all assets together and applies the assets test. Rent Assistance is added to the maximum rate before both tests if you rent. The lower of the two rates is your pension (${h.src('ssg-pension-income-test', 'Social Security Guide 4.2.1.10')}, ${h.src('ssg-assets-test', '4.2.3')}).</p>
<h2>What counts and what does not</h2>
<p>Your home and the land it sits on, up to two hectares in most cases, are exempt from the assets test, which is why homeowners have a lower assets free area than renters. Bank accounts, term deposits, shares, managed funds and account-based pensions are financial assets, deemed for the income test and counted at their value for the assets test. Cars, caravans, boats, home contents and investment properties are assets but not deemed. Superannuation in accumulation phase counts once you reach Age Pension age.</p>
${h.table(['Situation', 'Income stops the pension at', 'Assets stop the pension at (homeowner)'], [['Single', `${h.aud(single.incomeCutOut)} a fortnight`, h.aud(single.assetsCutOut)], ['Couple, combined', `${h.aud(coupleH.incomeCutOut)} a fortnight`, h.aud(coupleH.assetsCutOut)]], `Cut-off points worked out by the engine from the rates of ${day(P.rates_date)} and the free areas of 1 July 2026, without Rent Assistance.`, ['l', 'r', 'r'])}
${h.box('Which test decides', `<p>For most retirees with a home and savings under the free area, the income test decides through deeming. Those with large savings, or significant non-financial assets like an investment property, are usually caught by the assets test first. The result card names the test that set your rate; the ${h.a('age-pension-assets-test', 'assets test')} and ${h.a('age-pension-income-test', 'income test')} guides explain each.</p>`)}
<h2>Three retirees, three tests</h2>
<p>A single homeowner with ${h.aud(80000)} in the bank and no other income has deemed income well under the free area and assets well under ${h.aud(P.pension.assets_free_area.homeowner_single)}: full pension. A homeowner couple with ${h.aud(400000)} of savings and ${h.aud(60000)} of car and contents is caught first by the ${ex.test} test, at about ${x(ex.ratePerPerson)} each. A single renter with ${h.aud(500000)} of savings has a higher assets free area and Rent Assistance in the maximum rate, which can leave them with a larger pension than a homeowner with less money.</p>
<h2>Not modelled</h2>
<p>The Work Bonus for pensioners who still work, the treatment of defined benefit income streams and annuities, granny flat arrangements, gifting rules and the transitional rates of people who were already pensioners before 20 September 2009 are not modelled. People in those situations should treat the result as an approximation.</p>`,
  faqs: [
    { q: 'How much is the full Age Pension per fortnight in 2026?', a: `From ${day(P.rates_date)}, ${audx(P.pension.max_single)} for a single person and ${audx(P.pension.max_couple_each)} each for a couple, ${audx(2 * P.pension.max_couple_each)} combined. These amounts include the basic rate, the Pension Supplement and the Energy Supplement. Renters may also receive Rent Assistance. The next indexation is on ${day(P.next_indexation)}.` },
    { q: 'What is the Age Pension age in Australia?', a: `${P.pension.age}. Anyone born on or after 1 January 1957 reaches Age Pension age at ${P.pension.age}. The pension also requires Australian residence for at least ten years in total, with at least five of those years in one continuous period, unless an international agreement or an exemption applies, and both means tests must be passed.` },
    { q: 'Can I get the Age Pension if I own my home?', a: `Yes. Your home is exempt from the assets test, whatever its value. Homeowners have a lower assets free area than renters, ${aud(P.pension.assets_free_area.homeowner_single)} instead of ${aud(P.pension.assets_free_area.nonhomeowner_single)} for a single person, because their home is already excluded. Money held for buying a new home can be exempt for a limited time.` },
    { q: 'How much can a pensioner couple have in assets?', a: `A homeowner couple can have ${aud(P.pension.assets_free_area.homeowner_couple)} of assessable assets, excluding the home, and still receive the full pension; a non-homeowner couple ${aud(P.pension.assets_free_area.nonhomeowner_couple)}. Above that, the combined pension falls by ${aud(3)} a fortnight for each ${aud(1000)}, and stops at about ${aud(coupleH.assetsCutOut)} for homeowners.` },
    { q: 'Is the Age Pension income tested on super?', a: 'Superannuation in an account-based pension, and accumulation super once you reach Age Pension age, is a financial asset: it is deemed for the income test and counted at its value for the assets test. Actual withdrawals are not counted as income on top. Other income streams, such as defined benefit pensions, have their own rules.' },
    { q: 'Does the Age Pension include the Energy Supplement?', a: `Yes. The full rate of ${audx(P.pension.max_single)} for a single person includes the Energy Supplement and the Pension Supplement. A pensioner who receives a part pension under the income or assets test sees all three parts reduced together, and the Energy Supplement stops being paid when the pension itself reaches nil.` },
  ],
});

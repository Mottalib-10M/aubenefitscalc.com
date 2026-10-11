import { definePage } from '../../lib/page-types';
import { P, aud, aud2, audx, ccsStandardPct } from '../../lib/kit';

const pc = ccsStandardPct(130000);
const fees = [120, 140, 152, 170, 190, 220];
const row = (fee: number) => { const hourly = fee / 10; const cap = P.ccs.caps.cbdc_below_school; const sub = (pc / 100) * Math.min(hourly, cap); return [aud(fee), aud2(hourly), aud2(sub), aud2(Math.max(0, hourly - cap)), aud((hourly - sub) * 10)]; };

export default definePage({
  id: 'child-care-subsidy-hourly-rate-cap',
  group: 'childcare',
  kind: 'guide',
  order: 50,
  slug: 'child-care-subsidy-hourly-rate-cap',
  nav: 'CCS hourly rate cap',
  card: 'The hourly caps by type of care, and why a fee above them costs you the whole difference.',
  title: 'CCS Hourly Rate Cap 2026-27: Day Care, FDC and OSHC Limits',
  description: `CCS hourly rate caps for 2026-27: ${aud2(P.ccs.caps.cbdc_below_school)} for day care before school, ${aud2(P.ccs.caps.fdc)} for family day care, ${aud2(P.ccs.caps.oshc_school)} for school-age care, with worked examples below.`,
  h1: 'The Child Care Subsidy hourly rate cap',
  intro: 'Your subsidy percentage never applies to the whole fee if the fee is above the cap. Here are the caps and what they mean for your gap.',
  resume: `Child Care Subsidy is a percentage of the hourly fee or of the hourly rate cap, whichever is lower. For 2026-27, applied from Monday 6 July 2026, the cap is ${aud2(P.ccs.caps.cbdc_below_school)} an hour for centre-based day care and outside school hours care before a child starts school, ${aud2(P.ccs.caps.cbdc_school)} once the child is at school, ${aud2(P.ccs.caps.fdc)} for family day care at any age, and ${aud2(P.ccs.caps.ihc_family)} per family for in-home care. A centre charging ${aud(160)} for a 10-hour day is charging ${aud2(16)} an hour, above the day care cap: the subsidy is worked out on ${aud2(P.ccs.caps.cbdc_below_school)}, and the family pays the full difference on top of its percentage share. The caps rise with prices each 1 July, but fees in many cities rise faster, which is why the gap fee often grows even when the percentage stays the same.`,
  mini: 'ccsCap',
  related: ['child-care-subsidy-calculator', 'child-care-subsidy-income-thresholds', 'child-care-subsidy-three-day-guarantee', 'higher-child-care-subsidy'],
  sources: ['fag-ccs-caps', 'fag-ccs-calc', 'starting-blocks'],
  body: (h) => `
<h2>The caps for 2026-27</h2>
${h.table(['Type of care', 'Below school age', 'School age'], [['Centre-based day care', h.aud2(P.ccs.caps.cbdc_below_school), h.aud2(P.ccs.caps.cbdc_school)], ['Outside school hours care', h.aud2(P.ccs.caps.oshc_below_school), h.aud2(P.ccs.caps.oshc_school)], ['Family day care', h.aud2(P.ccs.caps.fdc), h.aud2(P.ccs.caps.fdc)], ['In-home care (per family)', h.aud2(P.ccs.caps.ihc_family), h.aud2(P.ccs.caps.ihc_family)]], 'Family Assistance Guide 3.5.3, 2026-27 financial year, from Monday 6 July 2026.', ['l', 'r', 'r'])}
<h2>How to turn a daily fee into an hourly one</h2>
<p>Divide the fee for a session by the number of hours the service charges for, not the hours your child attends. A centre that bills ${h.aud(155)} for a 10-hour session is charging ${h.aud2(15.5)} an hour, just above the ${h.aud2(P.ccs.caps.cbdc_below_school)} cap; the same ${h.aud(155)} for a 12-hour session is ${h.audx(Math.round((155 / 12) * 100) / 100)} an hour, under it. Longer sessions therefore stretch the cap, although they also use up subsidised hours faster.</p>
<h2>What the cap does to the gap</h2>
${h.table(['Daily fee (10 h)', 'Hourly fee', 'Subsidy per hour', 'Above the cap, per hour', 'Your cost per day'], fees.map(row), `Centre-based day care before school age, family income of ${aud(130000)} (${pc}% standard rate), before withholding.`, ['r', 'r', 'r', 'r', 'r'])}
<p>The subsidy per hour stops growing once the fee passes the cap, so every extra dollar of fee lands on the family. At ${h.aud(190)} a day, a family at ${pc}% receives exactly what it would at ${h.aud(152)}, and pays the rest. That is why two centres with a ${h.aud(40)} difference in daily fee can mean ${h.aud(40)} a day of difference in your out-of-pocket cost.</p>
${h.box('When is a child "school age"?', `<p>For the caps, a child attends school from the first day of scheduled physical attendance in the year before Grade 1, primary or secondary school, or from age 6, and also during school holidays or absences once they are a school child. Home-schooled children recognised by the state or territory count as school age (${h.src('fag-ccs-caps', 'Family Assistance Guide 3.5.3')}). The lower school-age cap applies from that day.</p>`)}
<h2>Before and after school care</h2>
<p>Outside school hours care usually charges per session, a morning or an afternoon of a few hours, so the hourly fee can look high even when the bill is modest. A ${h.aud(32)} afternoon session of 3 hours is ${h.audx(Math.round((32 / 3) * 100) / 100)} an hour, under the school-age cap of ${h.aud2(P.ccs.caps.oshc_school)}; a ${h.aud(45)} session of the same length is ${h.aud2(15)}, above it. Vacation care days are longer and priced more like day care, and the same school-age cap applies to them.</p>
<h2>The cap and your subsidised hours</h2>
<p>The cap limits the subsidy per hour; the subsidised hours limit how many hours are paid. The two work separately. A family on ${P.ccs.hours_base} hours with a fee above the cap pays the excess on every subsidised hour, and the full fee on any hour beyond its limit. See ${h.a('child-care-subsidy-three-day-guarantee', 'the 3-day guarantee')} for the hours.</p>
<h2>Family day care and in-home care</h2>
<p>Family day care has one cap for every age, ${h.aud2(P.ccs.caps.fdc)} an hour, so a school-age child in family day care keeps the same cap as a toddler. In-home care is capped per family rather than per child, at ${h.aud2(P.ccs.caps.ihc_family)} an hour, and does not attract the higher rate for younger children. Approved services and their fees are listed on ${h.src('starting-blocks', 'Starting Blocks')}.</p>
<h2>Asking a centre the right question</h2>
<p>Centres advertise daily fees, and some quote a fee "after subsidy" that assumes a particular percentage. Ask instead for the session length and the fee per session, then divide. If the centre charges different prices for different rooms, the nursery room for babies is usually the most expensive, and is the most likely to be above the cap; the same centre's pre-kindergarten room may be under it. Discounts for siblings or for booking more days lower the fee charged, and therefore the hourly fee compared with the cap.</p>
<h2>Choosing care with the cap in mind</h2>
<p>When comparing services, look at the hourly fee rather than the daily one, then compare it with the cap for your child's age and the type of care. A fee at or below the cap means the subsidy covers your full percentage; above it, the difference is entirely yours. The ${h.a('child-care-subsidy-calculator', 'Child Care Subsidy calculator')} shows the cap next to your hourly fee for each child.</p>`,
  faqs: [
    { q: 'What is the hourly rate cap for long day care in 2026-27?', a: `${aud2(P.ccs.caps.cbdc_below_school)} an hour for a child below school age in centre-based day care, and ${aud2(P.ccs.caps.cbdc_school)} for a school-age child, from Monday 6 July 2026. Your subsidy percentage applies to the lower of your hourly fee and that cap, so any part of the fee above the cap is paid entirely by you.` },
    { q: 'Does a 12-hour session give more subsidy than a 10-hour session?', a: 'Not more per hour, but it can lower the hourly fee below the cap. The subsidy is calculated per hour charged, so a longer session at the same daily price has a lower hourly fee. It also uses more of your subsidised hours each fortnight, which can leave days at the end of the fortnight uncovered.' },
    { q: 'Why did my gap fee go up in July when my income did not change?', a: 'Because fees and caps move on different schedules. The hourly rate caps are indexed to the consumer price index each 1 July, but many centres raise fees by more, often at the same time. If the new fee is above the cap, the whole increase falls on you even though your percentage has not changed.' },
  ],
});

import { definePage } from '../../lib/page-types';
import { P, aud, audx, faFortnight, ftbA, ftbB } from '../../lib/kit';

const fp = (n: number) => audx(Math.round(faFortnight(n) * 100) / 100);
const step13 = faFortnight(P.ftb.a_max_13to19 - P.ftb.a_max_under13);
const coupleAt12 = ftbB({ ages: [12], couple: true, primaryAti: 70000, secondaryAti: 0 });
const familyAt12 = ftbA({ ages: [12], ati: 70000 }).fortnight + coupleAt12.fortnight;
const familyAt13 = ftbA({ ages: [13], ati: 70000 }).fortnight + ftbB({ ages: [13], couple: true, primaryAti: 70000, secondaryAti: 0 }).fortnight;

export default definePage({
  id: 'family-tax-benefit-for-teenagers',
  group: 'families',
  kind: 'guide',
  order: 70,
  slug: 'family-tax-benefit-for-teenagers',
  nav: 'FTB for teenagers',
  card: 'What changes at 13, at 16 and when a teenager leaves school.',
  title: 'Family Tax Benefit for Teenagers 2026: Ages 13, 16 and 19',
  description: `Family Tax Benefit for teenagers in 2026: Part A rises by about ${aud(step13)} a fortnight at 13, Part B ends for couples, and from 16 only full-time school counts.`,
  h1: 'Family Tax Benefit as your child becomes a teenager',
  intro: 'Three birthdays and one school leaving date change what a family receives. Some go up, some stop.',
  resume: `A child's 13th birthday moves them to the higher maximum rate of Family Tax Benefit Part A, ${fp(P.ftb.a_max_13to19)} a fortnight instead of ${fp(P.ftb.a_max_under13)} in 2026-27, an increase of about ${aud(step13)} a fortnight for a family on the maximum rate. The same birthday ends Part B for a couple when that child is the youngest, so a two-parent family on a single income can see its total fall rather than rise. From 16, a young person counts for Family Tax Benefit only while in full-time secondary school or an approved equivalent, up to age 19; once they leave, Part A for them stops, and Part B for a single parent continues only to the end of the calendar year the youngest turns 18, if still at school. A teenager who has left school may then claim Youth Allowance in their own right, with its own income tests.`,
  mini: 'ftbTeen',
  related: ['family-tax-benefit-part-a', 'family-tax-benefit-part-b', 'youth-allowance-calculator', 'family-tax-benefit-rates', 'family-tax-benefit-calculator'],
  sources: ['fag-ftb-rates', 'fag-ftb-b', 'ssg-ya'],
  body: (h) => `
<h2>At 13: one payment up, one down</h2>
<p>The higher maximum rate for teenagers reflects what they cost: food, sport, school excursions and phones. A family on the maximum rate of Part A gains about ${h.aud(step13)} a fortnight from the birthday onwards. A family already reduced to the base rate gains nothing, because the base rate is the same at every age.</p>
<p>For couples the birthday has a second effect when the child is the youngest in the family. Part B is not payable to a member of a couple once the youngest child turns 13 (${h.src('fag-ftb-b', 'Family Assistance Guide 3.1.9.10')}). A couple with a single child and one income of ${h.aud(70000)} receives about ${h.aud(familyAt12)} a fortnight of Family Tax Benefit at 12 and about ${h.aud(familyAt13)} at 13: Part A goes up, Part B disappears, and the total moves by ${h.aud(familyAt13 - familyAt12)}. Single parents, grandparents and great-grandparents keep Part B.</p>
<h2>From 16: school decides</h2>
<p>A 16 to 19 year old is a Family Tax Benefit child only while in full-time secondary study, or a course the guides treat as equivalent, and only up to the end of the year they turn 19 in most cases. Part-time school, a gap year, a full-time apprenticeship or a TAFE certificate outside the secondary system all end Family Tax Benefit for that young person. The higher Part A rate continues for as long as they remain at school.</p>
<p>Part B has its own rule. A child who has turned 16 is ignored for Part B unless they are a senior secondary school child, and only until the end of the calendar year they turn 18. A single parent whose only child is 17 and in Year 12 still receives Part B for that year; once the child finishes school, Part B for that child stops even if Part A continues for a younger sibling.</p>
${h.table(['Age of the child', 'Part A (maximum)', 'Part B, couple', 'Part B, single parent'], [['12', fp(P.ftb.a_max_under13), 'yes, if youngest', 'yes'], ['13 to 15', fp(P.ftb.a_max_13to19), 'no, if youngest', 'yes'], ['16 to 18, full-time school', fp(P.ftb.a_max_13to19), 'no', 'to the end of the year they turn 18'], ['16 to 19, left school', 'nil', 'nil', 'nil'], ['19, still at school', fp(P.ftb.a_max_13to19), 'nil', 'nil']], 'Fortnightly maximum rates for 2026-27 (Family Assistance Guide 3.1.1.20); Part B at the standard rate for a youngest child aged 5 or over.', ['l', 'r', 'l', 'l'])}
<h2>When the teenager leaves school</h2>
<p>The day study ends, Family Tax Benefit for that young person stops, and they become a possible Youth Allowance claimant in their own right: as a job seeker from 16 to 21, or as a full-time student or apprentice from 16 to 24 (${h.src('ssg-ya', 'Social Security Guide 1.2.1.20')}). A young person still at secondary school is generally not of Youth Allowance age until 18 unless independent or required to live away from home. Dependent Youth Allowance is subject to a parental income test, which this site does not model; the ${h.a('youth-allowance-calculator', 'Youth Allowance calculator')} shows the rate for an independent young person.</p>
${h.box('Tell Centrelink about school status', `<p>Centrelink asks about the study plans of children approaching 16. If a teenager leaves school mid-year and the change is not reported, Family Tax Benefit continues to be paid for them and becomes a debt at reconciliation. The reverse also happens: a young person who returns to full-time school can be added back.</p>`)}
<h2>Twins, siblings and the mix of ages</h2>
<p>In a family with several children, each child is assessed on their own age for Part A, while Part B depends only on the youngest. A family with a 14-year-old and a 9-year-old receives the higher Part A rate for the first and the lower one for the second, and Part B continues for a couple until the 9-year-old turns 13. When an older sibling leaves school, the family loses that child's Part A but nothing else changes, unless the departure brings the number of children down from three to two, which lowers the Rent Assistance maximum.</p>
<h2>Older children and Child Care Subsidy</h2>
<p>Teenagers are outside Child Care Subsidy, which stops once a child finishes primary school, so the family's support at this stage comes almost entirely from Family Tax Benefit and, where relevant, Rent Assistance inside Part A. With three or more children, the Rent Assistance maximum is higher, ${h.audx(P.ra_family.max_3plus)} a year against ${h.audx(P.ra_family.max_1or2)}, and it drops back when an older child stops counting.</p>`,
  faqs: [
    { q: 'Does Family Tax Benefit go up when my child turns 13?', a: `Part A does, if you are on the maximum rate: from ${fp(P.ftb.a_max_under13)} to ${fp(P.ftb.a_max_13to19)} a fortnight for that child in 2026-27. If your income has reduced Part A to the base rate, nothing changes. For a couple whose youngest child turns 13, Part B stops on the same day, which can outweigh the increase.` },
    { q: 'Can I still get FTB for my 17-year-old who left school to work?', a: 'No. From 16, a young person is a Family Tax Benefit child only while in full-time secondary study or an approved equivalent. Once they leave school for work, an apprenticeship or a non-school course, Family Tax Benefit for them stops. They may be able to claim Youth Allowance in their own name, subject to its own tests.' },
    { q: 'Is FTB paid for a 19-year-old finishing Year 12?', a: 'Part A can be, while the young person remains in full-time secondary school and meets the age rules for senior secondary children. Part B is not, because a child aged 16 or over counts for Part B only until the end of the calendar year in which they turn 18.' },
  ],
});

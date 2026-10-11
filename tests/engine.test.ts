/**
 * Engines against the worked examples of the official guides (copies in research/) and against the
 * published thresholds they must reproduce. A case that drifts by more than a cent fails the build.
 */
import { describe, it, expect } from 'vitest';
import { P, faFortnight } from '../src/lib/engine/params';
import { ftbA, ftbB, ftbACutoffs, ftbBCutoff, method1Reduction } from '../src/lib/engine/ftb';
import { ccsStandardPct, ccsHigherPct, ccsFamily, hourlyCap, subsidisedHours } from '../src/lib/engine/ccs';
import { raFamilyAnnual, raSingleRate } from '../src/lib/engine/ra';
import { jobseeker, parentingPayment, youthAllowance, pension, deemedIncome, benefitIncomeReduction, partnerIncomeFreeArea, carerAllowance } from '../src/lib/engine/payments';
import { ppl } from '../src/lib/engine/ppl';
import { household } from '../src/lib/engine/household';

const near = (a: number, b: number, d = 0.01) => expect(Math.abs(a - b), `${a} vs ${b}`).toBeLessThanOrEqual(d);

describe('FTB Part A', () => {
  it('FA Guide 3.1.8.20 worked example (2019-20): Kanika, 2 children aged 6 and 8, ATI $102,000 → Method 2, $2,286.50', () => {
    // The example's rates include the Energy Supplement: Method 1 $4,854.50 + $91.25, Method 2 $1,558.55 + $36.50.
    const f2019 = { ...P.ftb, a_max_under13: 4854.5 + 91.25, a_max_13to19: 4854.5 + 91.25, a_base: 1558.55 + 36.5, a_ifa: 54677, a_hifa: 98988 };
    const r = ftbA({ ages: [6, 8], ati: 102000 }, f2019);
    near(r.method1, 125.7);
    near(r.method2, 2286.5);
    expect(r.method).toBe(2);
    near(r.annual, 2286.5);
    expect(r.supplementEligible).toBe(false);
  });
  it('2026-27 maximum and base rates from FA Guide 3.1.1.20', () => {
    const r = ftbA({ ages: [3], ati: 50000 });
    near(r.annual, 6139.3 + 970.9);
    near(r.annualNoSupplement, 6139.3);
    near(r.supplementPaid, 970.9);
    const t = ftbA({ ages: [14], ati: 50000 });
    near(t.annualNoSupplement, 7989.85);
  });
  it('per fortnight: annual ÷ 365 × 14 ($235.48 for a child under 13)', () => {
    near(faFortnight(P.ftb.a_max_under13), 235.48);
    near(faFortnight(P.ftb.a_max_13to19), 306.46);
  });
  it('Method 1 tapers 20% above the income free area, 30% above the higher income free area', () => {
    near(method1Reduction(P.ftb.a_ifa + 10000), 2000);
    near(method1Reduction(P.ftb.a_hifa + 1000), (P.ftb.a_hifa - P.ftb.a_ifa) * 0.2 + 300);
  });
  it('never below the base rate under the higher income free area', () => {
    const r = ftbA({ ages: [2, 5], ati: 120000 });
    near(r.annual, 2 * P.ftb.a_base);
  });
  it('supplement only at or under $80,000', () => {
    expect(ftbA({ ages: [4], ati: 80000 }).supplementEligible).toBe(true);
    expect(ftbA({ ages: [4], ati: 80001 }).supplementEligible).toBe(false);
  });
  it('income support: maximum rate whatever the income', () => {
    const r = ftbA({ ages: [4, 9], ati: 150000, incomeSupport: true });
    near(r.annualNoSupplement, 2 * P.ftb.a_max_under13);
  });
  it('cut-offs are consistent with the engine', () => {
    const c = ftbACutoffs([4]);
    near(ftbA({ ages: [4], ati: Math.ceil(c.nilAt) + 1 }).annual, 0);
    expect(ftbA({ ages: [4], ati: c.nilAt - 2000 }).annual).toBeGreaterThan(0);
  });
});

describe('FTB Part B', () => {
  it('single parent under the primary earner limit gets the standard rate and supplement', () => {
    const r = ftbB({ ages: [3], couple: false, primaryAti: 60000 });
    near(r.annual, P.ftb.b_under5 + P.ftb.b_supplement);
  });
  it('above the primary earner limit: nil', () => {
    expect(ftbB({ ages: [3], couple: true, primaryAti: P.ftb.b_primary_limit + 1, secondaryAti: 0 }).annual).toBe(0);
  });
  it('couple: 20c per dollar of the secondary earner above $7,154', () => {
    const r = ftbB({ ages: [7], couple: true, primaryAti: 90000, secondaryAti: P.ftb.b_ifa + 5000 });
    near(r.annual, P.ftb.b_5to18 + P.ftb.b_supplement - 1000);
  });
  it('couple with youngest aged 13: nil; single parent keeps it', () => {
    expect(ftbB({ ages: [13], couple: true, primaryAti: 50000, secondaryAti: 0 }).annual).toBe(0);
    near(ftbB({ ages: [13], couple: false, primaryAti: 50000 }).annual, P.ftb.b_5to18 + P.ftb.b_supplement);
  });
  it('secondary earner cut-off', () => {
    near(ftbB({ ages: [2], couple: true, primaryAti: 80000, secondaryAti: ftbBCutoff(2) }).annual, 0);
  });
});

describe('Rent Assistance', () => {
  it('family: (annual rent − threshold) × 3/4, capped (FA Guide 3.1.4.30)', () => {
    const rentPf = 400; const annual = (400 * 365) / 14;
    near(raFamilyAnnual(rentPf, false, 2), Math.min(P.ra_family.max_1or2, (annual - P.ra_family.threshold_single) * 0.75));
    near(raFamilyAnnual(2000, true, 3), P.ra_family.max_3plus);
    expect(raFamilyAnnual(100, true, 1)).toBe(0);
  });
  it('single: maximum reached at the minimum rent of SS Guide 5.1.7.10', () => {
    near(raSingleRate(P.ra_ss.single.min_rent_for_max, 'single'), P.ra_ss.single.max);
    near(raSingleRate(P.ra_ss.sharer.min_rent_for_max, 'sharer'), P.ra_ss.sharer.max, 0.02);
    near(raSingleRate(P.ra_ss.couple.min_rent_for_max, 'couple'), P.ra_ss.couple.max, 0.02);
    near(raSingleRate(200, 'single'), (200 - 157.8) * 0.75);
  });
});

describe('Child Care Subsidy', () => {
  it('FA Guide 3.5.4 worked example: combined ATI $288,520 → 50% standard, 74% higher', () => {
    expect(ccsStandardPct(288520)).toBe(50);
    expect(ccsHigherPct(288520)).toBe(74);
  });
  it('3.5.4: $10 an hour, 72 hours, 3 then 5 sessions of 10 hours → $150 then 42 subsidised hours', () => {
    const r = ccsFamily({ ati: 288520, activityHoursPf: 40, withholdingPct: 0, children: [{ age: 3, daysPerWeek: 4, hoursPerDay: 10, dailyFee: 100, type: 'cbdc' }] });
    expect(r.hours).toBe(72);
    near(r.children[0].subsidyPerHour, 5);
    expect(r.children[0].subsidisedHoursUsed).toBe(72);
    near(r.subsidyPf, 360); // 30 h + 42 h at $5
  });
  it('3.5.3 examples: fee under the cap uses the fee, above it uses the cap', () => {
    expect(hourlyCap('cbdc', false)).toBe(15.19);
    const a = ccsFamily({ ati: 50000, activityHoursPf: 0, withholdingPct: 0, children: [{ age: 1, daysPerWeek: 1, hoursPerDay: 10, dailyFee: 154, type: 'cbdc' }] });
    near(a.children[0].subsidyPerHour, 0.9 * 15.19);
  });
  it('thresholds: 90% to $88,520, 0% from $538,520, 1 point per $5,000 or part of it', () => {
    expect(ccsStandardPct(88520)).toBe(90);
    expect(ccsStandardPct(88521)).toBe(89);
    expect(ccsStandardPct(93520)).toBe(89);
    expect(ccsStandardPct(538519)).toBe(0);
    expect(ccsStandardPct(538520)).toBe(0);
  });
  it('higher rate bands and cut-off', () => {
    expect(ccsHigherPct(146437)).toBe(95);
    expect(ccsHigherPct(191437)).toBe(80);
    expect(ccsHigherPct(360727)).toBe(50);
    expect(ccsHigherPct(370727)).toBeNull();
  });
  it('72 hours for every family, 100 above 48 hours of activity', () => {
    expect(subsidisedHours(0)).toBe(72);
    expect(subsidisedHours(48)).toBe(72);
    expect(subsidisedHours(49)).toBe(100);
    expect(subsidisedHours(0, true)).toBe(100);
  });
  it('second child aged 5 or under gets the higher rate', () => {
    const r = ccsFamily({ ati: 200000, activityHoursPf: 76, children: [{ age: 4, daysPerWeek: 3, hoursPerDay: 10, dailyFee: 140, type: 'cbdc' }, { age: 1, daysPerWeek: 3, hoursPerDay: 10, dailyFee: 140, type: 'cbdc' }] });
    expect(r.children[0].higher).toBe(false);
    expect(r.children[1].higher).toBe(true);
    expect(r.children[1].pct).toBe(80);
  });
});

describe('Benefits', () => {
  it('JobSeeker single: $150 free, 50c to $256, 60c above (SS Guide 4.2.2 step 4D)', () => {
    near(benefitIncomeReduction(256), 53);
    near(benefitIncomeReduction(356), 113);
    const r = jobseeker({ couple: false, children: false, incomePf: 0 });
    near(r.rate, P.benefit.jsp.single + P.benefit.jsp.es_single_pa / 26);
  });
  it('single principal carer: 40c above $150 (step 4C)', () => {
    const r = jobseeker({ couple: false, children: true, incomePf: 250 });
    near(r.incomeReduction, 40);
  });
  it('partner income free area is the partnered cut-out rounded up', () => {
    const cut = 256 + (P.benefit.jsp.partnered + P.benefit.jsp.es_partnered_pa / 26 - 53) / 0.6;
    expect(partnerIncomeFreeArea()).toBe(Math.ceil(cut));
  });
  it('assets above the free area: not payable', () => {
    expect(jobseeker({ couple: false, children: false, incomePf: 0, homeowner: true, assets: P.benefit.assets_free_area.homeowner_single + 1 }).rate).toBe(0);
  });
  it('Parenting Payment single: free area $208 + $24.60 per child a fortnight, 40c taper', () => {
    const r = parentingPayment({ couple: false, youngest: 3, children: 2, incomePf: 400 });
    near(r.incomeReduction, (400 - (5408 + 2 * 639.6) / 26) * 0.4);
    expect(parentingPayment({ couple: false, youngest: 14, children: 1, incomePf: 0 }).rate).toBe(0);
    expect(parentingPayment({ couple: true, youngest: 6, children: 1, incomePf: 0 }).rate).toBe(0);
  });
  it('Youth Allowance student: $539 free, 50c to $646, 60c above (step 4A)', () => {
    near(benefitIncomeReduction(646, 'student'), 53.5);
    const r = youthAllowance({ situation: 'away', student: true, incomePf: 0, age: 19 });
    near(r.rate, P.ya.rates.away + P.ya.es_pa.over18_away / 26);
  });
});

describe('Age Pension and Carer Payment', () => {
  it('full rates of 20 September 2026', () => {
    near(pension({ couple: false, homeowner: true, incomePf: 0 }).rate, 1237.7);
    near(pension({ couple: true, homeowner: true, incomePf: 0 }).ratePerPerson, 933);
  });
  it('income cut-offs: $2,701.40 single, $4,128.00 combined couple (free areas $226 and $396)', () => {
    near(pension({ couple: false, homeowner: true, incomePf: 0 }).incomeCutOut, 2701.4);
    near(pension({ couple: true, homeowner: true, incomePf: 0 }).incomeCutOut, 4128);
    near(pension({ couple: false, homeowner: true, incomePf: 426 }).rate, 1137.7);
  });
  it('assets test: $3 a fortnight for each $1,000 over the free area', () => {
    near(pension({ couple: false, homeowner: true, incomePf: 0, otherAssets: 333000 + 100000 }).rate, 1237.7 - 300);
    const c = pension({ couple: true, homeowner: true, incomePf: 0, otherAssets: 499000 + 100000 });
    near(c.ratePerPerson, 933 - 150);
  });
  it('deeming from 20 September 2026: 1.75% to $66,800, 3.75% above', () => {
    near(deemedIncome(100000), 66800 * 0.0175 + 33200 * 0.0375);
    near(deemedIncome(100000, 'couple'), 100000 * 0.0175);
  });
  it('Carer Allowance flat rate under $250,000', () => {
    expect(carerAllowance(250000)).toBe(162.6);
    expect(carerAllowance(250001)).toBe(0);
  });
});

describe('Parental Leave Pay', () => {
  it('daily $200.94 = 7.6 × $26.44 rounded; 130 days single, 110 partnered', () => {
    near(Math.round(P.ppl.nmw_hourly * 7.6 * 100) / 100, P.ppl.daily);
    near(P.ppl.daily * 5, P.ppl.weekly);
    near(ppl({ partnered: false, ownAti: 60000, workTest: true }).total, 130 * 200.94);
    expect(ppl({ partnered: true, ownAti: 60000, partnerAti: 90000, workTest: true }).days).toBe(110);
    expect(ppl({ partnered: true, ownAti: 190000, partnerAti: 200000, workTest: true }).eligible).toBe(false);
    expect(ppl({ partnered: true, ownAti: 190000, partnerAti: 150000, workTest: true }).eligible).toBe(true);
  });
});

describe('Household', () => {
  it('single parent on Parenting Payment, renting: FTB at maximum with Rent Assistance inside FTB', () => {
    const r = household({ couple: false, you: { age: 34, payment: 'parenting', incomeAnnual: 0 }, children: [{ age: 4 }, { age: 9 }], rentPf: 600, homeowner: false });
    expect(r.incomeSupport).toBe(true);
    near(r.ftbA!.raPaidAnnual, P.ra_family.max_1or2);
    near(r.lines.find((l) => l.key === 'ftb-a')!.fortnight, faFortnight(2 * P.ftb.a_max_under13 + P.ra_family.max_1or2));
    near(r.lines.find((l) => l.key.startsWith('Parenting'))!.fortnight, P.pps.max);
  });
  it('couple without payment above the income free area: Method 1 reduction applies', () => {
    const r = household({ couple: true, you: { age: 38, payment: 'none', incomeAnnual: 70000 }, partner: { age: 36, payment: 'none', incomeAnnual: 20000 }, children: [{ age: 2 }], rentPf: 0, homeowner: true });
    near(r.ati, 90000);
    near(r.ftbA!.annual, Math.max(P.ftb.a_base, P.ftb.a_max_under13 - (90000 - P.ftb.a_ifa) * 0.2));
    const r2 = household({ couple: true, you: { age: 38, payment: 'none', incomeAnnual: 60000 }, partner: { age: 36, payment: 'none', incomeAnnual: 15000 }, children: [{ age: 2 }, { age: 6 }], rentPf: 0, homeowner: true });
    near(r2.ftbA!.annual, 2 * P.ftb.a_max_under13 + 2 * P.ftb.a_supplement - (75000 - P.ftb.a_ifa) * 0.2);
    expect(r.ftbB!.annual).toBeGreaterThan(0);
  });
  it('single renter on JobSeeker: Rent Assistance with the payment', () => {
    const r = household({ couple: false, you: { age: 30, payment: 'jobseeker', incomeAnnual: 0 }, children: [], rentPf: 500, homeowner: false });
    near(r.fortnightTotal, P.benefit.jsp.single + P.benefit.jsp.es_single_pa / 26 + P.ra_ss.single.max);
  });
  it('pensioner couple, homeowners, no other income: twice the each rate', () => {
    const r = household({ couple: true, you: { age: 70, payment: 'age', incomeAnnual: 0 }, partner: { age: 68, payment: 'age', incomeAnnual: 0 }, children: [], rentPf: 0, homeowner: true });
    near(r.fortnightTotal, 2 * 933);
  });
});

/**
 * Family Tax Benefit Part A and Part B, 2026-27 income year.
 * Family Assistance Guide 3.1.1.20 (rates), 3.1.4.40 (Method 1: 20% above the income free area,
 * 30% above the higher income free area, never below the base rate), 3.1.8.20 (Method 2: base rate
 * reduced by 30% above the higher income free area; the higher of the two methods is paid),
 * 3.1.9.10 and 3.1.9.20 (Part B: primary earner limit, 20% secondary earner taper, couples nil when
 * the youngest child is 13 or older), 3.1.4.30 (Rent Assistance inside the Method 1 maximum rate).
 * The Energy Supplement is left out: it closed to new FTB recipients on 20 March 2017 (3.1.1.25).
 */
import { P, clamp0, faFortnight } from './params';
import { raFamilyAnnual } from './ra';

export interface FtbAInput {
  /** Ages of the children in care (0 to 19). Children of 16 to 19 are taken as senior secondary students. */
  ages: number[];
  /** Family adjusted taxable income for the year (both partners). */
  ati: number;
  /** True when the claimant or the partner receives an income support payment: no income test (3.1.4.40). */
  incomeSupport?: boolean;
  /** Rent paid per fortnight (0 = no private rent, or homeowner). */
  rentPf?: number;
  couple?: boolean;
}
export interface FtbAResult {
  eligibleChildren: number;
  maxStandard: number; baseStandard: number; supplementEligible: boolean;
  raAnnual: number;
  method1: number; method2: number; method: 1 | 2;
  /** Annual entitlement including the end-of-year supplement. */
  annual: number;
  /** Part of the entitlement paid after the year ends (the Part A supplement, after the income test). */
  supplementPaid: number;
  /** Paid during the year, without the supplement. */
  annualNoSupplement: number;
  fortnight: number;
  /** Rent Assistance kept after the income test (inside Method 1 only). */
  raPaidAnnual: number;
  reductionMethod1: number;
}

type F = typeof P.ftb;
const childMax = (age: number, f: F = P.ftb) => (age < 13 ? f.a_max_under13 : f.a_max_13to19);
export const ftbChildren = (ages: number[]) => ages.filter((a) => a >= 0 && a <= 19);

/** Income test reduction under Method 1 (3.1.4.40). */
export function method1Reduction(ati: number, f: F = P.ftb) {
  return clamp0(Math.min(ati, f.a_hifa) - f.a_ifa) * f.a_taper_low + clamp0(ati - f.a_hifa) * f.a_taper_high;
}
/** Income test reduction under Method 2 (3.1.8.20). */
export const method2Reduction = (ati: number, f: F = P.ftb) => clamp0(ati - f.a_hifa) * f.a_taper_high;

function core(i: FtbAInput, withSupplement: boolean, f: F) {
  const kids = ftbChildren(i.ages);
  const n = kids.length;
  const supp = withSupplement && i.ati <= f.a_supplement_ati_limit ? f.a_supplement * n : 0;
  const maxStandard = kids.reduce((s, a) => s + childMax(a, f), 0);
  const baseStandard = f.a_base * n;
  const ra = n > 0 ? raFamilyAnnual(i.rentPf ?? 0, !!i.couple, n) : 0;
  const maxRate = maxStandard + supp + ra;
  const baseRate = baseStandard + supp;
  if (n === 0) return { n, maxStandard, baseStandard, supp, ra, m1: 0, m2: 0, red1: 0, raPaid: 0 };
  if (i.incomeSupport) return { n, maxStandard, baseStandard, supp, ra, m1: maxRate, m2: baseRate, red1: 0, raPaid: ra };
  const red1 = method1Reduction(i.ati, f);
  // Method 1 never pays less than the base rate while income is at or under the higher income free area;
  // above it, the Method 2 comparison does that job (3.1.8.20 step 6: the higher of the two).
  const m1raw = clamp0(maxRate - red1);
  const m2 = clamp0(baseRate - method2Reduction(i.ati, f));
  // Rent Assistance is the top slice of the Method 1 maximum rate: it goes first when income reduces the rate.
  const aboveBase = clamp0(m1raw - baseRate);
  const raPaid = Math.min(ra, aboveBase);
  return { n, maxStandard, baseStandard, supp, ra, m1: m1raw, m2, red1, raPaid };
}

/** `f` lets the tests replay the official worked examples with the parameters of their year. */
export function ftbA(i: FtbAInput, f: F = P.ftb): FtbAResult {
  const w = core(i, true, f);
  const wo = core(i, false, f);
  const annual = Math.max(w.m1, w.m2);
  const annualNo = Math.max(wo.m1, wo.m2);
  const method: 1 | 2 = w.m1 >= w.m2 ? 1 : 2;
  return {
    eligibleChildren: w.n, maxStandard: w.maxStandard, baseStandard: w.baseStandard,
    supplementEligible: w.supp > 0, raAnnual: w.ra, method1: w.m1, method2: w.m2, method,
    annual, supplementPaid: clamp0(annual - annualNo), annualNoSupplement: annualNo,
    fortnight: faFortnight(annualNo), raPaidAnnual: method === 1 ? w.raPaid : 0, reductionMethod1: w.red1,
  };
}

export interface FtbBInput {
  ages: number[];
  couple: boolean;
  /** Higher earner's adjusted taxable income (or the single parent's). */
  primaryAti: number;
  /** Lower earner's adjusted taxable income (couples only). */
  secondaryAti?: number;
  incomeSupport?: boolean;
  /** Grandparent or great-grandparent carer: Part B continues for a couple until the youngest is 18 (3.1.9.10). */
  grandparent?: boolean;
}
export interface FtbBResult { eligible: boolean; reason: string; standard: number; annual: number; supplementPaid: number; annualNoSupplement: number; fortnight: number; youngest: number | null }

export function ftbB(i: FtbBInput): FtbBResult {
  const f = P.ftb;
  const kids = ftbChildren(i.ages).filter((a) => a <= 18);
  const youngest = kids.length ? Math.min(...kids) : null;
  const nil = (reason: string): FtbBResult => ({ eligible: false, reason, standard: 0, annual: 0, supplementPaid: 0, annualNoSupplement: 0, fortnight: 0, youngest });
  if (youngest === null) return nil('No child aged 18 or under in secondary school');
  if (i.couple && !i.grandparent && youngest >= 13) return nil('Couples get no Part B once the youngest child turns 13');
  if (!i.incomeSupport && i.primaryAti > f.b_primary_limit) return nil('The higher earner is above the primary earner income limit');
  const standard = youngest < 5 ? f.b_under5 : f.b_5to18;
  const reduction = i.couple && !i.incomeSupport ? clamp0((i.secondaryAti ?? 0) - f.b_ifa) * f.b_taper : 0;
  const annual = clamp0(standard + f.b_supplement - reduction);
  const annualNo = clamp0(standard - reduction);
  return { eligible: annual > 0, reason: annual > 0 ? 'Eligible' : 'The secondary earner income test reduces Part B to nil', standard, annual, supplementPaid: annual - annualNo, annualNoSupplement: annualNo, fortnight: faFortnight(annualNo), youngest };
}

/** Income at which Part A falls to the base rate under Method 1, and income at which Part A stops. */
export function ftbACutoffs(ages: number[]) {
  const f = P.ftb;
  const kids = ftbChildren(ages);
  const maxNoSupp = kids.reduce((s, a) => s + childMax(a), 0);
  const base = f.a_base * kids.length;
  const gap = maxNoSupp - base;
  const lowBand = (f.a_hifa - f.a_ifa) * f.a_taper_low;
  const baseReachedAt = gap <= lowBand ? f.a_ifa + gap / f.a_taper_low : f.a_hifa + (gap - lowBand) / f.a_taper_high;
  const nilAt = f.a_hifa + base / f.a_taper_high;
  return { baseReachedAt, nilAt: Math.max(nilAt, baseReachedAt) };
}
/** Secondary earner income at which Part B stops. */
export const ftbBCutoff = (youngest: number) => P.ftb.b_ifa + ((youngest < 5 ? P.ftb.b_under5 : P.ftb.b_5to18) + P.ftb.b_supplement) / P.ftb.b_taper;

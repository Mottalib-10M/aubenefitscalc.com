/**
 * Income support payments, per fortnight, at the rates of 20 September 2026.
 * - JobSeeker Payment and Parenting Payment (partnered): Social Security Guide 5.1.8.20 (rates),
 *   5.1.10.20 (Energy Supplement), 4.2.2 (benefits income test: $150 free, 50c to $256, 60c above;
 *   40c for a single principal carer; partner income above the partner's own cut-out at 60c),
 *   4.2.3 (benefits assets test: no payment above the assets free area).
 * - Youth Allowance and Austudy: 5.1.1.20, 5.1.2.30, 4.2.2 steps 4A and 4B.
 * - Parenting Payment (single): 5.1.8.10 (rate), 4.2.4.10 (40c taper), 4.10.4.10 (free area 1 July 2026).
 * - Age Pension and Carer Payment: 5.1.8.10, 4.2.1.10 (50c taper, 25c each for a couple),
 *   4.10.3 (free areas 1 July 2026), 4.2.3 (assets: $19.50 a year for each $250 over, i.e. $3 a
 *   fortnight per $1,000), 4.4.1.10 (deeming from 20 September 2026).
 * The Energy Supplement is part of the maximum rate and is reduced with it.
 */
import { P, clamp0, ssFortnight } from './params';
import { raSingleRate, type RaStatus } from './ra';

const B = P.benefit;
export interface PayResult { payment: string; maxRate: number; basic: number; es: number; ra: number; incomeReduction: number; partnerReduction: number; assetsOk: boolean; rate: number; cutOut: number; note: string }

/** Personal income reduction under the benefits income test. */
export function benefitIncomeReduction(incomePf: number, mode: 'standard' | 'principalCarer' | 'student' | 'yaJobseeker' = 'standard') {
  if (mode === 'principalCarer') return clamp0(incomePf - B.income_free_area) * B.principal_carer_taper;
  const free = mode === 'student' ? P.ya.student_ifa : mode === 'yaJobseeker' ? P.ya.jobseeker_ifa : B.income_free_area;
  const top = mode === 'student' ? P.ya.student_band_top : mode === 'yaJobseeker' ? P.ya.jobseeker_band_top : B.lower_band_top;
  return clamp0(Math.min(incomePf, top) - free) * B.low_taper + clamp0(incomePf - top) * B.high_taper;
}
/** Income at which a maximum rate is fully withdrawn. */
export function benefitCutOut(maxRate: number, mode: 'standard' | 'principalCarer' | 'student' | 'yaJobseeker' = 'standard') {
  if (mode === 'principalCarer') return B.income_free_area + maxRate / B.principal_carer_taper;
  const free = mode === 'student' ? P.ya.student_ifa : mode === 'yaJobseeker' ? P.ya.jobseeker_ifa : B.income_free_area;
  const top = mode === 'student' ? P.ya.student_band_top : mode === 'yaJobseeker' ? P.ya.jobseeker_band_top : B.lower_band_top;
  const band = (top - free) * B.low_taper;
  return maxRate <= band ? free + maxRate / B.low_taper : top + (maxRate - band) / B.high_taper;
}
/** Partner income free area: the income at which a partnered JobSeeker rate would cut out, rounded up (4.2.2). */
export const partnerIncomeFreeArea = () => Math.ceil(benefitCutOut(B.jsp.partnered + ssFortnight(B.jsp.es_partnered_pa)));
export const partnerReduction = (partnerIncomePf: number) => clamp0(partnerIncomePf - partnerIncomeFreeArea()) * B.partner_taper;

const assetLimit = (homeowner: boolean, couple: boolean, a = B.assets_free_area) => (homeowner ? (couple ? a.homeowner_couple : a.homeowner_single) : couple ? a.nonhomeowner_couple : a.nonhomeowner_single);
export const benefitAssetLimit = assetLimit;

export interface JspInput { couple: boolean; children: boolean; incomePf: number; partnerIncomePf?: number; partnerOnPension?: boolean; age?: number; over55NineMonths?: boolean; principalCarerExempt?: boolean; rentPf?: number; sharer?: boolean; homeowner?: boolean; assets?: number; includeRa?: boolean }
export function jobseeker(i: JspInput): PayResult {
  const j = B.jsp;
  let basic: number, esPa: number, mode: 'standard' | 'principalCarer' = 'standard';
  if (i.couple) { basic = j.partnered; esPa = j.es_partnered_pa; }
  else if (i.children && i.principalCarerExempt) { basic = j.principal_carer_exempt; esPa = P.pps.es_pa; mode = 'principalCarer'; }
  else if (i.children) { basic = j.single_children; esPa = j.es_single_children_pa; mode = 'principalCarer'; }
  else if (i.over55NineMonths) { basic = j.single_55_9months; esPa = j.es_single_children_pa; }
  else { basic = j.single; esPa = j.es_single_pa; }
  const es = ssFortnight(esPa);
  const ra = i.includeRa && !i.children ? raSingleRate(i.rentPf ?? 0, (i.couple ? 'couple' : i.sharer ? 'sharer' : 'single') as RaStatus) : 0;
  const maxRate = basic + es + ra;
  // A partner on a pension: own income is half the couple's combined income, no partner reduction (4.2.2).
  const own = i.couple && i.partnerOnPension ? (i.incomePf + (i.partnerIncomePf ?? 0)) / 2 : i.incomePf;
  const incomeReduction = benefitIncomeReduction(own, mode);
  const pr = i.couple && !i.partnerOnPension ? partnerReduction(i.partnerIncomePf ?? 0) : 0;
  const assetsOk = (i.assets ?? 0) <= assetLimit(!!i.homeowner, i.couple);
  const rate = assetsOk ? clamp0(maxRate - incomeReduction - pr) : 0;
  return { payment: 'JobSeeker Payment', maxRate, basic, es, ra, incomeReduction, partnerReduction: pr, assetsOk, rate, cutOut: benefitCutOut(maxRate, mode), note: mode === 'principalCarer' ? 'Single principal carer: 40 cents in the dollar above $150' : '' };
}

export interface PpInput { couple: boolean; youngest: number; children: number; incomePf: number; partnerIncomePf?: number; partnerOnPension?: boolean; homeowner?: boolean; assets?: number }
export function parentingPayment(i: PpInput): PayResult {
  const s = P.pps, pp = B.ppp;
  if (!i.couple) {
    if (i.youngest >= s.youngest_under) return { payment: 'Parenting Payment (single)', maxRate: s.max, basic: s.max, es: 0, ra: 0, incomeReduction: 0, partnerReduction: 0, assetsOk: true, rate: 0, cutOut: 0, note: `Youngest child must be under ${s.youngest_under}` };
    const free = ssFortnight(s.ifa_pa + s.ifa_extra_child_pa * i.children);
    const incomeReduction = clamp0(i.incomePf - free) * s.taper;
    const assetsOk = (i.assets ?? 0) <= assetLimit(!!i.homeowner, false);
    const rate = assetsOk ? clamp0(s.max - incomeReduction) : 0;
    return { payment: 'Parenting Payment (single)', maxRate: s.max, basic: s.max, es: ssFortnight(s.es_pa), ra: 0, incomeReduction, partnerReduction: 0, assetsOk, rate, cutOut: free + s.max / s.taper, note: '' };
  }
  if (i.youngest >= pp.youngest_under) return { payment: 'Parenting Payment (partnered)', maxRate: pp.max, basic: pp.max, es: 0, ra: 0, incomeReduction: 0, partnerReduction: 0, assetsOk: true, rate: 0, cutOut: 0, note: `Youngest child must be under ${pp.youngest_under}` };
  const es = ssFortnight(pp.es_pa);
  const maxRate = pp.max + es;
  const own = i.partnerOnPension ? (i.incomePf + (i.partnerIncomePf ?? 0)) / 2 : i.incomePf;
  const incomeReduction = benefitIncomeReduction(own);
  const pr = i.partnerOnPension ? 0 : partnerReduction(i.partnerIncomePf ?? 0);
  const assetsOk = (i.assets ?? 0) <= assetLimit(!!i.homeowner, true);
  const rate = assetsOk ? clamp0(maxRate - incomeReduction - pr) : 0;
  return { payment: 'Parenting Payment (partnered)', maxRate, basic: pp.max, es, ra: 0, incomeReduction, partnerReduction: pr, assetsOk, rate, cutOut: benefitCutOut(maxRate), note: '' };
}

export type YaSituation = 'under18_home' | 'over18_home' | 'away' | 'single_children' | 'partnered_no_children' | 'partnered_children';
export interface YaInput { situation: YaSituation; student: boolean; austudy?: boolean; incomePf: number; partnerIncomePf?: number; rentPf?: number; sharer?: boolean; homeowner?: boolean; assets?: number; includeRa?: boolean; age?: number }
export function youthAllowance(i: YaInput): PayResult {
  const y = P.ya;
  let basic: number, esPa: number, name: string;
  if (i.austudy) {
    const a = y.austudy;
    const couple = i.situation.startsWith('partnered');
    const kids = i.situation === 'single_children' || i.situation === 'partnered_children';
    basic = couple ? (kids ? a.partnered_children : a.partnered) : kids ? a.single_children : a.single;
    esPa = couple ? (kids ? a.es_partnered_children_pa : a.es_partnered_pa) : kids ? a.es_single_children_pa : a.es_single_pa;
    name = 'Austudy';
  } else {
    basic = y.rates[i.situation];
    const away = i.situation === 'away';
    const esKey = i.situation === 'under18_home' ? 'under18_home' : i.situation === 'over18_home' ? 'over18_home' : away ? ((i.age ?? 18) < 18 ? 'under18_away' : 'over18_away') : i.situation;
    esPa = (y.es_pa as Record<string, number>)[esKey];
    name = 'Youth Allowance';
  }
  const es = ssFortnight(esPa);
  const couple = i.situation.startsWith('partnered');
  const kids = i.situation === 'single_children' || i.situation === 'partnered_children';
  // Rent Assistance with Youth Allowance is not paid to a young person living at home.
  const atHome = i.situation === 'under18_home' || i.situation === 'over18_home';
  const ra = i.includeRa && !kids && !atHome ? raSingleRate(i.rentPf ?? 0, (couple ? 'couple' : i.sharer ? 'sharer' : 'single') as RaStatus) : 0;
  const maxRate = basic + es + ra;
  const mode = i.student || i.austudy ? 'student' : 'yaJobseeker';
  const incomeReduction = benefitIncomeReduction(i.incomePf, mode);
  const pr = couple ? partnerReduction(i.partnerIncomePf ?? 0) : 0;
  const assetsOk = (i.assets ?? 0) <= assetLimit(!!i.homeowner, couple);
  const rate = assetsOk ? clamp0(maxRate - incomeReduction - pr) : 0;
  return { payment: name, maxRate, basic, es, ra, incomeReduction, partnerReduction: pr, assetsOk, rate, cutOut: benefitCutOut(maxRate, mode), note: '' };
}

/** Deemed income from financial assets, per year (4.4.1.10). `couplePensioner` uses the couple threshold on combined assets. */
export function deemedIncome(financialAssets: number, kind: 'single' | 'couple' | 'nonPensionerCoupleEach' = 'single', d = P.deeming) {
  const t = kind === 'single' ? d.threshold_single : kind === 'couple' ? d.threshold_pensioner_couple : d.threshold_nonpensioner_couple_each;
  return (Math.min(financialAssets, t) * d.lower_rate) / 100 + (clamp0(financialAssets - t) * d.upper_rate) / 100;
}

export interface PensionInput {
  couple: boolean;
  /** Number of pensioners in the couple (1 or 2). Ignored for singles. */
  pensioners?: 1 | 2;
  homeowner: boolean;
  /** Assessable income per fortnight other than deemed income: the person's, or the couple's combined. */
  incomePf: number;
  /** Financial assets (bank, shares, managed funds): deemed. The person's, or the couple's combined. */
  financialAssets?: number;
  /** Other assessable assets (car, contents, investment property…): the person's, or combined. */
  otherAssets?: number;
  rentPf?: number;
  sharer?: boolean;
  payment?: 'Age Pension' | 'Carer Payment';
}
export interface PensionResult { payment: string; maxRate: number; ra: number; deemedPf: number; incomePf: number; incomeTested: number; assets: number; assetsFreeArea: number; assetsTested: number; test: 'income' | 'assets' | 'none'; rate: number; ratePerPerson: number; incomeCutOut: number; assetsCutOut: number }

/** Age Pension or Carer Payment. For a couple, all amounts are combined and the per-person rate is half (4.2.1.10). */
export function pension(i: PensionInput): PensionResult {
  const p = P.pension;
  const couple = i.couple;
  const n = couple ? (i.pensioners ?? 2) : 1;
  const ra = raSingleRate(i.rentPf ?? 0, (couple ? 'couple' : i.sharer ? 'sharer' : 'single') as RaStatus);
  // Couple: the combined maximum rate is twice the each-rate; Rent Assistance is shared between the two.
  const combinedMax = couple ? 2 * p.max_couple_each + ra : p.max_single + ra;
  const deemedPf = ssFortnight(deemedIncome(i.financialAssets ?? 0, couple ? 'couple' : 'single'));
  const incomePf = i.incomePf + deemedPf;
  const freePf = ssFortnight(couple ? 2 * p.ifa_couple_each_pa : p.ifa_single_pa);
  const incomeTested = clamp0(combinedMax - clamp0(incomePf - freePf) * p.taper);
  const assets = (i.financialAssets ?? 0) + (i.otherAssets ?? 0);
  const a = p.assets_free_area;
  const assetsFreeArea = i.homeowner ? (couple ? a.homeowner_couple : a.homeowner_single) : couple ? a.nonhomeowner_couple : a.nonhomeowner_single;
  const assetsReduction = ssFortnight(Math.floor(clamp0(assets - assetsFreeArea) / p.assets_step) * p.assets_step_reduction_pa);
  const assetsTested = clamp0(combinedMax - assetsReduction);
  const combined = Math.min(incomeTested, assetsTested);
  const test = combined >= combinedMax ? 'none' : incomeTested <= assetsTested ? 'income' : 'assets';
  const perPerson = couple ? combined / 2 : combined;
  return {
    payment: i.payment ?? 'Age Pension', maxRate: couple ? combinedMax / 2 : combinedMax, ra, deemedPf, incomePf, incomeTested, assets, assetsFreeArea, assetsTested, test,
    rate: perPerson * n, ratePerPerson: perPerson,
    incomeCutOut: freePf + combinedMax / p.taper,
    assetsCutOut: assetsFreeArea + Math.ceil((combinedMax * p.fortnights_per_year) / p.assets_step_reduction_pa) * p.assets_step,
  };
}

/** Carer Allowance: a flat fortnightly amount, family taxable income under the limit (1.2.5.50, 5.1.5.50). */
export const carerAllowance = (familyIncome: number, c = P.carer) => (familyIncome <= c.allowance_income_limit ? c.allowance_pf : 0);

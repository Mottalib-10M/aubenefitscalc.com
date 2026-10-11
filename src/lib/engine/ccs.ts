/**
 * Child Care Subsidy, 2026-27 income year. Family Assistance Guide:
 * 3.5.1 percentages (90% up to the lower threshold, then 1 point less for each $5,000 or part of it;
 * higher rate for the second and younger children aged 5 or under: 95%, 80%, 50% bands with 1 point
 * for each $3,000 or part of it), 3.5.2 subsidised hours (72 a fortnight for every family, 100 with
 * more than 48 hours of recognised activity, an exemption, or an Aboriginal or Torres Strait Islander
 * child), 3.5.3 hourly rate caps, 3.5.4 calculation and the 5% default withholding.
 * "Or part of it" is how the worked example of 3.5.4 comes out: $288,520 gives 74% on the higher rate.
 */
import { P, clamp0 } from './params';

type C = typeof P.ccs;
const steps = (excess: number, step: number) => (excess <= 0 ? 0 : Math.ceil(excess / step - 1e-9));

/** Standard CCS percentage for a combined family ATI. */
export function ccsStandardPct(ati: number, c: C = P.ccs) {
  if (ati <= c.lower_threshold) return c.max_pct;
  if (ati >= c.zero_at) return 0;
  return clamp0(c.max_pct - steps(ati - c.lower_threshold, c.step));
}
/** Higher CCS percentage for a second or younger child aged 5 or under; null above the cut-off. */
export function ccsHigherPct(ati: number, c: C = P.ccs): number | null {
  const h = c.higher;
  if (ati >= h.cutoff) return null;
  let pct: number;
  if (ati <= h.full_to) pct = h.full_pct;
  else if (ati < h.first_taper_to) pct = Math.max(h.plateau_pct, h.full_pct - steps(ati - h.full_to, h.step));
  else if (ati < h.plateau_to) pct = h.plateau_pct;
  else if (ati < h.second_taper_to) pct = Math.max(h.floor_pct, h.plateau_pct - steps(ati - h.plateau_to, h.step));
  else pct = h.floor_pct;
  return Math.max(pct, ccsStandardPct(ati, c));
}

export type CareType = 'cbdc' | 'oshc' | 'fdc';
export function hourlyCap(type: CareType, schoolAge: boolean, c: C = P.ccs) {
  if (type === 'fdc') return c.caps.fdc;
  if (type === 'oshc') return schoolAge ? c.caps.oshc_school : c.caps.oshc_below_school;
  return schoolAge ? c.caps.cbdc_school : c.caps.cbdc_below_school;
}
/** Subsidised hours per fortnight: 72 for everyone (the 3-day guarantee), 100 with more than 48 hours of activity. */
export const subsidisedHours = (activityHoursPf: number, firstNations = false, c: C = P.ccs) => (firstNations || activityHoursPf > c.hours_higher_activity ? c.hours_higher : c.hours_base);

export interface CcsChild { age: number; daysPerWeek: number; hoursPerDay: number; dailyFee: number; type: CareType; schoolAge?: boolean }
export interface CcsChildResult { age: number; pct: number; higher: boolean; hourlyFee: number; cap: number; subsidyPerHour: number; hoursPf: number; subsidisedHoursUsed: number; feesPf: number; subsidyPf: number; withheldPf: number; paidPf: number; gapPf: number }

export function ccsFamily(o: { ati: number; children: CcsChild[]; activityHoursPf: number; firstNations?: boolean; withholdingPct?: number }, c: C = P.ccs) {
  const hours = subsidisedHours(o.activityHoursPf, o.firstNations, c);
  const std = ccsStandardPct(o.ati, c);
  const hi = ccsHigherPct(o.ati, c);
  const withhold = (o.withholdingPct ?? c.withholding_default) / 100;
  // The standard rate child is the eldest child aged 5 or under in care; younger ones can get the higher rate.
  const young = o.children.map((ch, i) => ({ ch, i })).filter((x) => x.ch.age <= 5 && x.ch.daysPerWeek > 0).sort((a, b) => b.ch.age - a.ch.age);
  const higherIdx = new Set(hi === null ? [] : young.slice(1).map((x) => x.i));
  const children: CcsChildResult[] = o.children.map((ch, i) => {
    const schoolAge = ch.schoolAge ?? ch.age >= 6;
    const higher = higherIdx.has(i);
    const pct = higher ? (hi as number) : std;
    const hourlyFee = ch.hoursPerDay > 0 ? ch.dailyFee / ch.hoursPerDay : 0;
    const cap = hourlyCap(ch.type, schoolAge, c);
    const subsidyPerHour = (pct / 100) * Math.min(hourlyFee, cap);
    const hoursPf = ch.daysPerWeek * ch.hoursPerDay * 2;
    const used = Math.min(hoursPf, hours);
    const feesPf = ch.dailyFee * ch.daysPerWeek * 2;
    const subsidyPf = subsidyPerHour * used;
    const withheldPf = subsidyPf * withhold;
    return { age: ch.age, pct, higher, hourlyFee, cap, subsidyPerHour, hoursPf, subsidisedHoursUsed: used, feesPf, subsidyPf, withheldPf, paidPf: subsidyPf - withheldPf, gapPf: feesPf - (subsidyPf - withheldPf) };
  });
  const sum = (k: keyof CcsChildResult) => children.reduce((s, x) => s + (x[k] as number), 0);
  return { hours, standardPct: std, higherPct: hi, children, feesPf: sum('feesPf'), subsidyPf: sum('subsidyPf'), withheldPf: sum('withheldPf'), paidPf: sum('paidPf'), gapPf: sum('gapPf') };
}

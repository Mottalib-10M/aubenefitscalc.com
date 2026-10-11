/**
 * Commonwealth Rent Assistance, both routes.
 * - With FTB Part A (families with children): Family Assistance Guide 3.1.4.30, annual amounts from
 *   20 September 2026: gross RA = (annual rent − rent threshold) × 3/4, capped at the maximum for
 *   1 or 2 children, or 3 or more.
 * - With a social security payment (no children): Social Security Guide 5.1.7.10, per fortnight:
 *   75 cents for each dollar of rent above the threshold, up to the maximum.
 */
import { P, clamp0, faAnnualFromFortnight } from './params';

/** Gross FTB Rent Assistance, per year, before the FTB income test. */
export function raFamilyAnnual(rentPf: number, couple: boolean, children: number, ra = P.ra_family) {
  if (rentPf <= 0 || children <= 0) return 0;
  const threshold = couple ? ra.threshold_couple : ra.threshold_single;
  const max = children >= 3 ? ra.max_3plus : ra.max_1or2;
  return Math.min(max, clamp0(faAnnualFromFortnight(rentPf) - threshold) * ra.rate);
}
export function raFamilyLimits(couple: boolean, children: number, ra = P.ra_family) {
  const threshold = couple ? ra.threshold_couple : ra.threshold_single;
  const max = children >= 3 ? ra.max_3plus : ra.max_1or2;
  return { thresholdAnnual: threshold, maxAnnual: max, rentForMaxAnnual: threshold + max / ra.rate };
}

export type RaStatus = 'single' | 'sharer' | 'couple';
/** Rent Assistance paid with a pension or allowance, per fortnight (combined amount for a couple). */
export function raSingleRate(rentPf: number, status: RaStatus, ra = P.ra_ss) {
  if (rentPf <= 0) return 0;
  const row = ra[status];
  return Math.min(row.max, clamp0(rentPf - row.threshold) * ra.rate);
}
export const raSsRow = (status: RaStatus) => P.ra_ss[status];

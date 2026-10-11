/**
 * The data kit: everything a page may compute with. Pages never type a figure that lives in
 * params-2026.json; they read it from P or compute it with an engine (RECETTE §17.4 point 7).
 */
import { P, faFortnight, ssFortnight, ssAnnual } from './engine/params';
import { ftbA, ftbB, ftbACutoffs, ftbBCutoff, method1Reduction, method2Reduction } from './engine/ftb';
import { ccsStandardPct, ccsHigherPct, ccsFamily, hourlyCap, subsidisedHours } from './engine/ccs';
import { raFamilyAnnual, raFamilyLimits, raSingleRate, raSsRow } from './engine/ra';
import { jobseeker, parentingPayment, youthAllowance, pension, deemedIncome, benefitIncomeReduction, benefitCutOut, partnerIncomeFreeArea, partnerReduction, carerAllowance, benefitAssetLimit } from './engine/payments';
import { ppl } from './engine/ppl';
import { household } from './engine/household';
import { aud, audx, aud2, pct, num, day, listOf } from './fmt';

export const KIT = {
  P, faFortnight, ssFortnight, ssAnnual,
  ftbA, ftbB, ftbACutoffs, ftbBCutoff, method1Reduction, method2Reduction,
  ccsStandardPct, ccsHigherPct, ccsFamily, hourlyCap, subsidisedHours,
  raFamilyAnnual, raFamilyLimits, raSingleRate, raSsRow,
  jobseeker, parentingPayment, youthAllowance, pension, deemedIncome, benefitIncomeReduction, benefitCutOut, partnerIncomeFreeArea, partnerReduction, carerAllowance, benefitAssetLimit,
  ppl, household,
  aud, audx, aud2, pct, num, day, listOf,
};
export type Kit = typeof KIT;
export { P, faFortnight, ssFortnight, ssAnnual };
export { ftbA, ftbB, ftbACutoffs, ftbBCutoff, method1Reduction, method2Reduction };
export { ccsStandardPct, ccsHigherPct, ccsFamily, hourlyCap, subsidisedHours };
export { raFamilyAnnual, raFamilyLimits, raSingleRate, raSsRow };
export { jobseeker, parentingPayment, youthAllowance, pension, deemedIncome, benefitIncomeReduction, benefitCutOut, partnerIncomeFreeArea, partnerReduction, carerAllowance, benefitAssetLimit };
export { ppl, household };
export * from './fmt';

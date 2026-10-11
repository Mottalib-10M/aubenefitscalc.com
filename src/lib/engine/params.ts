/** Typed access to src/data/params-2026.json. Engines read figures from here only. */
import RAW from '../../data/params-2026.json';
export const P = RAW;
export type Params = typeof RAW;

/** Family assistance is annual and paid by day: daily rate = annual ÷ 365, a fortnight is 14 days. */
export const faFortnight = (annual: number) => (annual / P.ftb.days_in_year) * 14;
/** Rent paid per fortnight, as an annual amount for FTB Rent Assistance (365 ÷ 14 fortnights). */
export const faAnnualFromFortnight = (pf: number) => (pf * P.ftb.days_in_year) / 14;
/** Social security pensions and allowances: 26 fortnights a year. */
export const ssFortnight = (annual: number) => annual / P.pension.fortnights_per_year;
export const ssAnnual = (pf: number) => pf * P.pension.fortnights_per_year;
export const r2 = (x: number) => Math.round(x * 100) / 100;
export const clamp0 = (x: number) => (x > 0 ? x : 0);

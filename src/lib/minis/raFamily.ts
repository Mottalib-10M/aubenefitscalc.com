/** Rent Assistance with FTB Part A. */
import type { MiniSpec } from '../mini-types';
import { raFamilyAnnual, raFamilyLimits } from '../engine/ra';
import { faFortnight, audx, aud, range, singleCouple } from './_kit';
export default (): MiniSpec => ({
  title: 'Rent Assistance paid with Family Tax Benefit', cta: 'Rent Assistance calculator', ctaHref: '/en/rent-assistance-calculator/',
  inputs: [{ id: 'r', label: 'Rent per fortnight', def: 650, unit: '$', max: 20000 }, { id: 'c', label: 'Family', def: 0, options: singleCouple }, { id: 'k', label: 'Children', def: 2, options: range(1, 6) }],
  run: (v) => {
    const lim = raFamilyLimits(v.c === 1, v.k); const ra = raFamilyAnnual(v.r, v.c === 1, v.k);
    return { head: ['Rent Assistance per fortnight', audx(faFortnight(ra))], rows: [['Per year', aud(ra)], ['Threshold per fortnight', audx(faFortnight(lim.thresholdAnnual))], ['Maximum per fortnight', audx(faFortnight(lim.maxAnnual))]], note: 'Before the FTB income test, which can reduce it.' };
  },
});

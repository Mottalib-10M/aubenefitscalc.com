/** Deemed income on financial assets. */
import type { MiniSpec } from '../mini-types';
import { deemedIncome } from '../engine/payments';
import { P, aud, audx, singleCouple } from './_kit';
export default (): MiniSpec => ({
  title: 'Deemed income on your savings', cta: 'Age Pension calculator', ctaHref: '/en/age-pension-calculator/',
  inputs: [{ id: 'f', label: 'Financial assets (combined for a couple)', def: 250000, unit: '$', max: 20000000 }, { id: 'c', label: 'Household', def: 0, options: singleCouple }],
  run: (v) => {
    const y = deemedIncome(v.f, v.c === 1 ? 'couple' : 'single');
    const t = v.c === 1 ? P.deeming.threshold_pensioner_couple : P.deeming.threshold_single;
    return { head: ['Deemed income per fortnight', audx(y / 26)], rows: [['Per year', aud(y)], [`At ${P.deeming.lower_rate}% (up to ${aud(t)})`, aud((Math.min(v.f, t) * P.deeming.lower_rate) / 100)], [`At ${P.deeming.upper_rate}% (above)`, aud((Math.max(0, v.f - t) * P.deeming.upper_rate) / 100)]] };
  },
});

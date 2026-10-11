/** Age Pension under the income test alone. */
import type { MiniSpec } from '../mini-types';
import { pension } from '../engine/payments';
import { aud, audx, singleCouple } from './_kit';
export default (): MiniSpec => ({
  title: 'Your pension under the income test', cta: 'Age Pension calculator', ctaHref: '/en/age-pension-calculator/',
  inputs: [{ id: 'i', label: 'Income per fortnight (combined for a couple)', def: 600, unit: '$', max: 100000 }, { id: 'c', label: 'Household', def: 0, options: singleCouple }],
  run: (v) => {
    const r = pension({ couple: v.c === 1, homeowner: true, incomePf: v.i });
    const each = v.c === 1 ? r.incomeTested / 2 : r.incomeTested;
    return { head: [v.c === 1 ? 'Income-tested rate, each' : 'Income-tested rate', audx(each)], rows: [['Reduction', audx((v.c === 1 ? r.maxRate * 2 - r.incomeTested : r.maxRate - r.incomeTested) / (v.c === 1 ? 2 : 1))], ['Pension stops at', aud(r.incomeCutOut)]] };
  },
});

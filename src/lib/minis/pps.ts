/** Parenting Payment single for earnings and number of children. */
import type { MiniSpec } from '../mini-types';
import { parentingPayment } from '../engine/payments';
import { P, aud, audx, range, ssFortnight } from './_kit';
export default (): MiniSpec => ({
  title: 'Parenting Payment single with your earnings', cta: 'Parenting Payment calculator', ctaHref: '/en/parenting-payment-calculator/',
  inputs: [{ id: 'i', label: 'Earnings per fortnight', def: 600, unit: '$', max: 100000 }, { id: 'n', label: 'Children under 16', def: 2, options: range(1, 6) }],
  run: (v) => {
    const r = parentingPayment({ couple: false, youngest: 4, children: v.n, incomePf: v.i });
    return { head: ['Parenting Payment per fortnight', audx(r.rate)], rows: [['Income free area', audx(ssFortnight(P.pps.ifa_pa + P.pps.ifa_extra_child_pa * v.n))], ['Reduction (40c in the dollar)', audx(r.incomeReduction)], ['Payment stops at', aud(r.cutOut)]] };
  },
});

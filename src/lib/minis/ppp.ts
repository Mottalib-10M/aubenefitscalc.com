/** Parenting Payment partnered: own earnings and partner's earnings. */
import type { MiniSpec } from '../mini-types';
import { parentingPayment } from '../engine/payments';
import { audx, range } from './_kit';
export default (): MiniSpec => ({
  title: 'Parenting Payment partnered for your couple', cta: 'Parenting Payment calculator', ctaHref: '/en/parenting-payment-calculator/',
  inputs: [{ id: 'i', label: 'Your income per fortnight', def: 200, unit: '$', max: 100000 }, { id: 'p', label: 'Partner’s income per fortnight', def: 1600, unit: '$', max: 100000 }, { id: 'y', label: 'Youngest child', def: 2, options: range(0, 7) }],
  run: (v) => {
    const r = parentingPayment({ couple: true, youngest: v.y, children: 1, incomePf: v.i, partnerIncomePf: v.p });
    return { head: ['Parenting Payment per fortnight', audx(r.rate)], rows: [['Reduction for your income', audx(r.incomeReduction)], ['Reduction for partner income', audx(r.partnerReduction)], ['Note', r.note || 'Youngest child under the age limit']] };
  },
});

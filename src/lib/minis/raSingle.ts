/** Rent Assistance with a payment: single or sharer. */
import type { MiniSpec } from '../mini-types';
import { raSingleRate, raSsRow } from '../engine/ra';
import { audx, yesNo } from './_kit';
export default (): MiniSpec => ({
  title: 'Rent Assistance for a single person', cta: 'Rent Assistance calculator', ctaHref: '/en/rent-assistance-calculator/',
  inputs: [{ id: 'r', label: 'Rent per fortnight', def: 380, unit: '$', max: 20000 }, { id: 'sh', label: 'Sharing accommodation?', def: 0, options: yesNo }],
  run: (v) => {
    const st = v.sh === 1 ? 'sharer' : 'single'; const row = raSsRow(st);
    return { head: ['Rent Assistance per fortnight', audx(raSingleRate(v.r, st))], rows: [['Rent threshold', audx(row.threshold)], ['Maximum', audx(row.max)], ['Rent that reaches the maximum', audx(row.min_rent_for_max)]] };
  },
});

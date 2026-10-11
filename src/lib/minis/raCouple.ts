/** Rent Assistance for a couple without children, and the half each pensioner receives. */
import type { MiniSpec } from '../mini-types';
import { raSingleRate, raSsRow } from '../engine/ra';
import { audx, yesNo } from './_kit';
export default (): MiniSpec => ({
  title: 'Rent Assistance for a couple', cta: 'Rent Assistance calculator', ctaHref: '/en/rent-assistance-calculator/',
  inputs: [{ id: 'r', label: 'Rent per fortnight', def: 520, unit: '$', max: 20000 }, { id: 'b', label: 'Both on a pension?', def: 1, options: yesNo }],
  run: (v) => {
    const ra = raSingleRate(v.r, 'couple'); const row = raSsRow('couple');
    return { head: ['Rent Assistance for the couple, per fortnight', audx(ra)], rows: [[v.b === 1 ? 'Paid to each partner (half each)' : 'Paid with one partner\'s payment', audx(v.b === 1 ? ra / 2 : ra)], ['Rent threshold (couple)', audx(row.threshold)], ['Maximum (couple)', audx(row.max)]] };
  },
});

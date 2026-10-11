/** Hourly fee against the hourly rate cap. */
import type { MiniSpec } from '../mini-types';
import { hourlyCap, ccsStandardPct, type CareType } from '../engine/ccs';
import { audx, pct } from './_kit';
const T: CareType[] = ['cbdc', 'fdc', 'oshc'];
export default (): MiniSpec => ({
  title: 'Is your fee above the hourly rate cap?', cta: 'Full Child Care Subsidy calculator', ctaHref: '/en/child-care-subsidy-calculator/',
  inputs: [{ id: 'fee', label: 'Daily fee', def: 165, unit: '$', max: 1000 }, { id: 'h', label: 'Hours charged per day', def: 10, unit: 'h', max: 24 }, { id: 't', label: 'Type of care', def: 0, options: [{ value: '0', label: 'Centre-based day care' }, { value: '1', label: 'Family day care' }, { value: '2', label: 'Outside school hours care' }] }, { id: 'inc', label: 'Combined family income', def: 120000, unit: '$', max: 2000000 }],
  run: (v) => {
    const t = T[v.t] ?? 'cbdc'; const cap = hourlyCap(t, t === 'oshc'); const hourly = v.h > 0 ? v.fee / v.h : 0; const p = ccsStandardPct(v.inc);
    return { head: ['Subsidy per hour', audx((p / 100) * Math.min(hourly, cap))], rows: [['Your hourly fee', audx(hourly)], ['Hourly rate cap', audx(cap)], ['Your percentage', pct(p)], ['Above the cap, per hour (you pay all of it)', audx(Math.max(0, hourly - cap))]] };
  },
});

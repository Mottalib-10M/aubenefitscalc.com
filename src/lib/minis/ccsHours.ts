/** Subsidised hours: the 72-hour floor and the 100-hour level. */
import type { MiniSpec } from '../mini-types';
import { subsidisedHours } from '../engine/ccs';
import { num, range, yesNo } from './_kit';
export default (): MiniSpec => ({
  title: 'Subsidised hours for your child', cta: 'Full Child Care Subsidy calculator', ctaHref: '/en/child-care-subsidy-calculator/',
  inputs: [{ id: 'act', label: 'Activity hours per fortnight (parent with fewer)', def: 16, unit: 'h', max: 336 }, { id: 'd', label: 'Days of care a week', def: 4, options: range(1, 5) }, { id: 'h', label: 'Hours per day', def: 10, unit: 'h', max: 24 }, { id: 'fn', label: 'Aboriginal or Torres Strait Islander child?', def: 0, options: yesNo }],
  run: (v) => {
    const hrs = subsidisedHours(v.act, v.fn === 1); const used = v.d * v.h * 2;
    return { head: ['Subsidised hours a fortnight', num(hrs)], rows: [['Hours of care booked', num(used)], ['Hours without subsidy', num(Math.max(0, used - hrs))], ['Days fully covered (at these hours)', num(Math.floor(hrs / Math.max(1, v.h) / 2))]] };
  },
});

/** Two children aged 5 or under: standard rate for the elder, higher rate for the younger. */
import type { MiniSpec } from '../mini-types';
import { ccsFamily } from '../engine/ccs';
import { aud, pct, range, parseArg } from './_kit';
export default (arg?: string): MiniSpec => {
  const a = parseArg(arg, { income: 180000 });
  return {
    title: 'Two children in care: what the higher rate adds', cta: 'Full Child Care Subsidy calculator', ctaHref: '/en/child-care-subsidy-calculator/',
    inputs: [{ id: 'inc', label: 'Combined family income', def: a.income, unit: '$', max: 2000000 }, { id: 'fee', label: 'Daily fee', def: 150, unit: '$', max: 1000 }, { id: 'd', label: 'Days a week each', def: 3, options: range(1, 5) }],
    run: (v) => {
      const r = ccsFamily({ ati: v.inc, activityHoursPf: 76, children: [{ age: 4, daysPerWeek: v.d, hoursPerDay: 10, dailyFee: v.fee, type: 'cbdc' }, { age: 1, daysPerWeek: v.d, hoursPerDay: 10, dailyFee: v.fee, type: 'cbdc' }] });
      const [o, y] = r.children;
      return { head: ['Subsidy for both, per fortnight', aud(r.paidPf)], rows: [[`Elder child (${pct(o.pct)})`, aud(o.paidPf)], [`Younger child (${pct(y.pct)}${y.higher ? ', higher rate' : ''})`, aud(y.paidPf)], ['Your gap for both', aud(r.gapPf)]], note: 'After the 5% withholding; 10-hour sessions in centre-based day care.' };
    },
  };
};

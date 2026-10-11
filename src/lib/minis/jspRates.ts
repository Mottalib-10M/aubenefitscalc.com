/** JobSeeker rate by situation: basic rate and Energy Supplement. */
import type { MiniSpec } from '../mini-types';
import { jobseeker } from '../engine/payments';
import { audx } from './_kit';
const S = [
  { label: 'Single, no children', i: { couple: false, children: false } },
  { label: 'Single, with a dependent child', i: { couple: false, children: true } },
  { label: 'Single, 55 or over after 9 months', i: { couple: false, children: false, over55NineMonths: true } },
  { label: 'Partnered (each)', i: { couple: true, children: false } },
];
export default (): MiniSpec => ({
  title: 'JobSeeker maximum rate for your situation', cta: 'JobSeeker calculator with your income', ctaHref: '/en/jobseeker-payment-calculator/',
  inputs: [{ id: 's', label: 'Situation', def: 0, options: S.map((x, i) => ({ value: String(i), label: x.label })) }],
  run: (v) => {
    const r = jobseeker({ ...(S[v.s] ?? S[0]).i, incomePf: 0 });
    return { head: ['Maximum per fortnight', audx(r.rate)], rows: [['Basic rate', audx(r.basic)], ['Energy Supplement', audx(r.es)], ['Per year', audx(r.rate * 26)]] };
  },
});

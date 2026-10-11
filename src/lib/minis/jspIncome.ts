/** JobSeeker single: what a fortnight of earnings does to the payment. */
import type { MiniSpec } from '../mini-types';
import { jobseeker } from '../engine/payments';
import { aud, audx } from './_kit';
export default (): MiniSpec => ({
  title: 'Earn while on JobSeeker: what you keep', cta: 'JobSeeker calculator', ctaHref: '/en/jobseeker-payment-calculator/',
  inputs: [{ id: 'i', label: 'Earnings this fortnight, before tax', def: 500, unit: '$', max: 100000 }],
  run: (v) => {
    const r = jobseeker({ couple: false, children: false, incomePf: v.i });
    return { head: ['JobSeeker this fortnight', audx(r.rate)], rows: [['Reduction', audx(r.incomeReduction)], ['Earnings plus payment', aud(v.i + r.rate)], ['Payment stops at', aud(r.cutOut)]] };
  },
});

/** What the withholding keeps back over a year. */
import type { MiniSpec } from '../mini-types';
import { aud } from './_kit';
export default (): MiniSpec => ({
  title: 'How much withholding keeps back', cta: 'Full Child Care Subsidy calculator', ctaHref: '/en/child-care-subsidy-calculator/',
  inputs: [{ id: 's', label: 'Subsidy per fortnight before withholding', def: 900, unit: '$', max: 20000 }, { id: 'w', label: 'Withholding rate', def: 5, unit: '%', max: 100 }, { id: 'f', label: 'Fortnights of care in the year', def: 24, max: 26 }],
  run: (v) => ({ head: ['Kept back over the year', aud((v.s * v.w * v.f) / 100)], rows: [['Paid to the service each fortnight', aud(v.s * (1 - v.w / 100))], ['Kept back each fortnight', aud((v.s * v.w) / 100)]], note: 'Paid back to you at reconciliation if your income estimate was right.' }),
});

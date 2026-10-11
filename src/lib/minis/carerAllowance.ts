/** Carer Allowance: flat rate under the family income limit; Carer Payment alongside if you care full time. */
import type { MiniSpec } from '../mini-types';
import { carerAllowance } from '../engine/payments';
import { P, aud, audx } from './_kit';
export default (): MiniSpec => ({
  title: 'Carer Allowance for your family', cta: 'Carer Payment calculator', ctaHref: '/en/carer-payment-calculator/',
  inputs: [{ id: 'i', label: 'Combined family taxable income', def: 140000, unit: '$', max: 5000000 }],
  run: (v) => {
    const ca = carerAllowance(v.i);
    return { head: ['Carer Allowance per fortnight', audx(ca)], rows: [['Per year', aud(ca * 26)], ['Family income limit', aud(P.carer.allowance_income_limit)]] };
  },
});

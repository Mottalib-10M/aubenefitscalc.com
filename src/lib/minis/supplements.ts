/** Pension Supplement and Energy Supplement, per fortnight and per year. */
import type { MiniSpec } from '../mini-types';
import { P, audx, ssFortnight } from './_kit';
const R: Array<[string, number, number]> = [
  ['Pensioner, single', P.pension.ps_single_pa, P.pension.es_single_pa],
  ['Pensioner, couple (each)', P.pension.ps_couple_each_pa, P.pension.es_couple_each_pa],
  ['JobSeeker, single', 0, P.benefit.jsp.es_single_pa],
  ['JobSeeker or PPP, partnered (each)', 0, P.benefit.jsp.es_partnered_pa],
  ['Parenting Payment single (basic amount)', P.pps.ps_basic_pa, P.pps.es_pa],
];
export default (): MiniSpec => ({
  title: 'Supplements built into your rate', cta: 'Payment rates in full', ctaHref: '/en/centrelink-payment-rates/',
  inputs: [{ id: 's', label: 'Situation', def: 0, options: R.map(([l], i) => ({ value: String(i), label: l })) }],
  run: (v) => { const r = R[v.s] ?? R[0]; return { head: ['Supplements per fortnight', audx(ssFortnight(r[1] + r[2]))], rows: [['Pension Supplement (year)', r[1] ? audx(r[1]) : 'Not paid with this payment'], ['Energy Supplement (year)', audx(r[2])]] }; },
});

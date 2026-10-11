/** Maximum pension rate and its parts, single or couple. */
import type { MiniSpec } from '../mini-types';
import { P, audx, ssFortnight, singleCouple } from './_kit';
export default (): MiniSpec => ({
  title: 'Full Age Pension and its three parts', cta: 'Age Pension calculator', ctaHref: '/en/age-pension-calculator/',
  inputs: [{ id: 'c', label: 'Household', def: 0, options: singleCouple }],
  run: (v) => {
    const c = v.c === 1; const p = P.pension;
    const max = c ? p.max_couple_each : p.max_single; const ps = ssFortnight(c ? p.ps_couple_each_pa : p.ps_single_pa); const es = ssFortnight(c ? p.es_couple_each_pa : p.es_single_pa);
    return { head: [c ? 'Per fortnight, each' : 'Per fortnight', audx(max)], rows: [['Basic rate', audx(c ? p.mbr_couple_each : p.mbr_single)], ['Pension Supplement', audx(ps)], ['Energy Supplement', audx(es)], [c ? 'Couple combined, per year' : 'Per year', audx((c ? 2 * max : max) * 26)]] };
  },
});

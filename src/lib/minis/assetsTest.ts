/** Age Pension under the assets test alone. */
import type { MiniSpec } from '../mini-types';
import { pension } from '../engine/payments';
import { aud, audx, singleCouple } from './_kit';
export default (): MiniSpec => ({
  title: 'Your pension under the assets test', cta: 'Age Pension calculator', ctaHref: '/en/age-pension-calculator/',
  inputs: [{ id: 'a', label: 'Assessable assets, excluding the home', def: 520000, unit: '$', max: 20000000 }, { id: 'c', label: 'Household', def: 0, options: singleCouple }, { id: 'h', label: 'Home', def: 1, options: [{ value: '1', label: 'Own' }, { value: '0', label: 'Rent or no home' }] }],
  run: (v) => {
    const r = pension({ couple: v.c === 1, homeowner: v.h === 1, incomePf: 0, otherAssets: v.a });
    const each = v.c === 1 ? r.assetsTested / 2 : r.assetsTested;
    return { head: [v.c === 1 ? 'Assets-tested rate, each' : 'Assets-tested rate', audx(each)], rows: [['Assets free area', aud(r.assetsFreeArea)], ['Over the free area', aud(Math.max(0, v.a - r.assetsFreeArea))], ['Pension stops at', aud(r.assetsCutOut)]] };
  },
});

/** Formatters with no dependency on routes (safe from page files, minis and the engines). */
import { formatMoney, formatNumber } from './format';
/** $1,234 (no cents, RECETTE §4.1). */
export const aud = (n: number) => formatMoney(Math.round(n), 0);
/** Official amount as published: cents only when the figure has cents ($1,237.70 but $150). */
export const audx = (n: number) => formatMoney(n, Number.isInteger(n) ? 0 : 2);
/** Two decimals always (hourly caps and rates: $15.19). */
export const aud2 = (n: number) => formatMoney(n, 2);
/** A rate as written by the guide: 20 → "20%", 1.75 → "1.75%". */
export const pct = (p: number) => `${formatNumber(p, Math.min(2, String(p).split('.')[1]?.length ?? 0))}%`;
export const num = (n: number, d = 0) => formatNumber(n, d);
/** "20 September 2026" from an ISO date (Australian order). */
export const day = (iso: string) => new Date(`${iso.slice(0, 10)}T00:00:00Z`).toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
/** "A, B and C". */
export const listOf = (xs: string[]) => (xs.length < 2 ? xs.join('') : `${xs.slice(0, -1).join(', ')} and ${xs[xs.length - 1]}`);

/** Shared tools for the mini-simulators (ignored by the registry: "_" prefix). Minis call the engines only. */
import { formatMoney, formatNumber } from '../format';
export { P, faFortnight, ssFortnight, ssAnnual } from '../engine/params';
export const aud = (x: number) => formatMoney(Math.round(x), 0);
export const audx = (x: number) => formatMoney(Math.round(x * 100) / 100, Number.isInteger(Math.round(x * 100) / 100) ? 0 : 2);
export const pct = (x: number) => `${formatNumber(x, 0)}%`;
export const num = (x: number) => formatNumber(x, 0);
export const yesNo = [{ value: '0', label: 'No' }, { value: '1', label: 'Yes' }];
export const singleCouple = [{ value: '0', label: 'Single' }, { value: '1', label: 'Couple' }];
export const range = (from: number, to: number, f: (i: number) => string = String) => Array.from({ length: to - from + 1 }, (_, i) => ({ value: String(from + i), label: f(from + i) }));
export function parseArg<T>(arg: string | undefined, fallback: T): T { if (!arg) return fallback; try { return { ...fallback, ...JSON.parse(arg) } as T; } catch { return fallback; } }

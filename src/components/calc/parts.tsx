/** Shared pieces of the calculators: result card, detail rows, bars, share and print. */
import { useState, type ReactNode } from 'react';
import { formatMoney, formatNumber } from '../../lib/format';

export const aud = (n: number) => formatMoney(Math.round(n), 0);
export const audx = (n: number) => formatMoney(n, Number.isInteger(n) ? 0 : 2);
export const pc = (n: number, d = 0) => `${formatNumber(n, d)}%`;

export function Rows({ rows }: { rows: Array<[string, string]> }) {
  return (
    <table className="mt-4 w-full text-sm"><tbody className="divide-y divide-navy-200">
      {rows.map(([l, x], i) => <tr key={`${l}-${i}`}><td className="py-1.5 pr-3 text-navy-700">{l}</td><td className="tabular-nums py-1.5 text-right text-navy-900">{x}</td></tr>)}
    </tbody></table>
  );
}

/** One horizontal bar per line, proportional to the largest (RECETTE §17.2: breakdown with a bar). */
export function Bars({ items }: { items: Array<{ label: string; value: number; note?: string }> }) {
  const max = Math.max(1, ...items.map((i) => i.value));
  return (
    <ul className="mt-4 space-y-2">
      {items.map((i) => (
        <li key={i.label}>
          <div className="flex justify-between gap-3 text-sm"><span className="text-navy-800">{i.label}</span><span className="tabular-nums font-semibold text-navy-900">{aud(i.value)}</span></div>
          <div className="mt-1 h-2 w-full rounded bg-white"><div className="h-2 rounded bg-accent-500" style={{ width: `${Math.round((i.value / max) * 100)}%` }} /></div>
          {i.note && <p className="mt-0.5 text-xs text-navy-600">{i.note}</p>}
        </li>
      ))}
    </ul>
  );
}

export function Result({ label, value, sub, children, methodHref, note }: { label: string; value: string; sub?: string; children?: ReactNode; methodHref: string; note: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => { navigator.clipboard?.writeText(window.location.href).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1500); }); };
  return (
    <div aria-live="polite" className="mt-6 rounded-xl bg-accent-50 p-4 sm:p-5">
      <p className="text-sm font-medium text-navy-700">{label}</p>
      <p className="tabular-nums mt-1 text-4xl font-bold text-navy-900">{value}</p>
      {sub && <p className="mt-1 text-sm text-navy-700">{sub}</p>}
      {children}
      <p className="mt-3 text-xs text-navy-600">{note} <a className="underline" href={methodHref}>How this is worked out</a>.</p>
      <div className="mt-3 flex flex-wrap gap-2 text-sm">
        <button type="button" onClick={copy} className="rounded-lg border border-navy-300 bg-white px-3 py-1.5 font-medium text-navy-800 hover:bg-navy-50">{copied ? 'Link copied' : 'Copy share link'}</button>
        <button type="button" onClick={() => window.print()} className="rounded-lg border border-navy-300 bg-white px-3 py-1.5 font-medium text-navy-800 hover:bg-navy-50">Print</button>
      </div>
    </div>
  );
}

export const yesNo = [{ value: '0', label: 'No' }, { value: '1', label: 'Yes' }];
export const ageOptions = (from: number, to: number) => Array.from({ length: to - from + 1 }, (_, i) => ({ value: String(from + i), label: String(from + i) }));

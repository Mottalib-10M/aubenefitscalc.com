/**
 * State of a calculator mirrored in the share link. First render = the defaults of the build
 * (RECETTE §17.5); a shared link is applied after mount; the address changes only after the visitor
 * acts (url-state.ts, RECETTE §18.1).
 */
import { useEffect, useState } from 'react';
import { readParams, updateURL } from '../../lib/url-state';

export function useShare<T extends Record<string, number>>(defaults: T): [T, (k: keyof T, v: number) => void] {
  const [s, setS] = useState<T>(defaults);
  useEffect(() => {
    const u = readParams(window.location.search);
    const next = { ...defaults };
    let changed = false;
    for (const k of Object.keys(defaults) as Array<keyof T>) { const v = u.get(String(k)); if (v !== null && !Number.isNaN(Number(v))) { (next as Record<keyof T, number>)[k] = Number(v); changed = true; } }
    if (changed) setS(next);
  }, []);
  useEffect(() => {
    const diff: Record<string, number | undefined> = {};
    for (const k of Object.keys(s)) diff[k] = s[k] === defaults[k] ? undefined : s[k];
    updateURL(diff);
  }, [s]);
  return [s, (k, v) => setS((o) => ({ ...o, [k]: v }))];
}

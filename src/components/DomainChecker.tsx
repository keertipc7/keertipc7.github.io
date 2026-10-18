'use client';

import { useState } from 'react';

/*
 * Live Domain Authenticator check, inline on the homepage. Posts to the same
 * Cloudflare Worker the extension and the full demo page use.
 */

type Signal = { score: number; detail: string };
type Analysis = {
    domain: string;
    trustScore: number;
    verdict: 'trusted' | 'likely_safe' | 'caution' | 'suspicious' | 'dangerous';
    action: 'allow' | 'warn' | 'block';
    ai?: { summary?: string };
    signals?: Record<string, Signal>;
};

const VERDICT: Record<Analysis['verdict'], { label: string; color: string }> = {
    trusted: { label: 'Trusted', color: '#10b981' },
    likely_safe: { label: 'Likely safe', color: '#3b82f6' },
    caution: { label: 'Use caution', color: '#f59e0b' },
    suspicious: { label: 'Suspicious', color: '#f97316' },
    dangerous: { label: 'Dangerous', color: '#ef4444' },
};

const ACTION: Record<Analysis['action'], string> = { allow: 'Allowed', warn: 'Warning shown', block: 'Blocked' };

const SIGNALS: [string, string][] = [
    ['brandSimilarity', 'Brand'],
    ['tld', 'TLD risk'],
    ['entropy', 'Randomness'],
    ['subdomain', 'Subdomains'],
    ['specialChars', 'Characters'],
    ['length', 'Length'],
];

/* Risk colour for a 0-100 signal score (higher is riskier). */
function riskColor(score: number) {
    return score >= 70 ? '#ef4444' : score >= 40 ? '#f59e0b' : score >= 15 ? '#3b82f6' : '#10b981';
}

/* "https://www.Example.com/path" -> "example.com" */
function cleanDomain(raw: string) {
    return raw.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0];
}

export default function DomainChecker({ api, examples }: { api: string; examples: string[] }) {
    const [input, setInput] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');
    const [result, setResult] = useState<Analysis | null>(null);

    const analyze = async (value: string) => {
        const domain = cleanDomain(value);
        if (!domain) return;
        setInput(domain);
        setStatus('loading');
        try {
            const res = await fetch(`${api}/analyze`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ domain }),
            });
            if (!res.ok) throw new Error(String(res.status));
            setResult(await res.json());
            setStatus('done');
        } catch {
            setStatus('error');
        }
    };

    const verdict = result && (VERDICT[result.verdict] ?? { label: result.verdict, color: '#6b7280' });

    return (
        <div className="mt-4">
            <form onSubmit={(e) => { e.preventDefault(); analyze(input); }} className="flex gap-2">
                <input value={input} onChange={(e) => setInput(e.target.value)}
                    placeholder="Enter any domain, e.g. g00gle.xyz" aria-label="Domain to check"
                    autoCapitalize="off" autoCorrect="off" spellCheck={false}
                    className="flex-1 min-w-0 border border-line rounded-lg bg-ground px-3.5 py-2.5 font-mono text-[14px] placeholder:text-[#98A2B5] focus:border-accent outline-none transition-colors" />
                <button type="submit" disabled={status === 'loading'}
                    className="font-mono text-[11px] uppercase tracking-[0.1em] text-white bg-accent hover:bg-accent-ink px-4 rounded-md transition-colors disabled:opacity-60">
                    {status === 'loading' ? 'Checking…' : 'Check'}
                </button>
            </form>
            <div className="flex flex-wrap items-center gap-2 mt-2.5">
                <span className="font-mono text-[11px] text-muted">Try:</span>
                {examples.map((example) => (
                    <button key={example} type="button" onClick={() => analyze(example)}
                        className="font-mono text-[11px] text-accent-ink border border-line bg-ground hover:border-accent/40 rounded-md px-2 py-1 transition-colors">
                        {example}
                    </button>
                ))}
            </div>

            {status === 'error' && (
                <p className="font-mono text-[12px] text-[#ef4444] mt-4">Couldn’t reach the scoring API. Try again in a moment.</p>
            )}

            {status === 'done' && result && verdict && (
                <div className="border-t border-line mt-4 pt-4 grid sm:grid-cols-[auto_1fr] gap-x-5 gap-y-4" aria-live="polite">
                    <div className="flex sm:flex-col items-center gap-3 sm:gap-1.5">
                        <div className="w-[72px] h-[72px] rounded-full border-[3px] flex items-center justify-center font-mono text-2xl tabular-nums"
                            style={{ borderColor: verdict.color, color: verdict.color }}>
                            {result.trustScore}
                        </div>
                        <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted">Trust / 100</span>
                    </div>
                    <div className="min-w-0">
                        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                            <span className="font-mono text-[14px] font-semibold truncate">{result.domain}</span>
                            <span className="font-serif font-semibold" style={{ color: verdict.color }}>{verdict.label}</span>
                            <span className="font-mono text-[10px] uppercase tracking-[0.08em] rounded-full px-2 py-0.5"
                                style={{ color: verdict.color, background: `${verdict.color}1f` }}>
                                {ACTION[result.action] ?? result.action}
                            </span>
                        </div>
                        {result.ai?.summary && <p className="text-[14px] text-[#333E52] leading-relaxed mt-1.5">{result.ai.summary}</p>}
                        {result.signals && (
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-5 gap-y-2.5 mt-3.5">
                                {SIGNALS.filter(([key]) => result.signals?.[key]).map(([key, label]) => {
                                    const signal = result.signals![key];
                                    return (
                                        <div key={key} title={signal.detail}>
                                            <div className="flex justify-between font-mono text-[10px] uppercase tracking-[0.06em] text-muted">
                                                <span>{label}</span><span>{signal.score}</span>
                                            </div>
                                            <div className="h-1 rounded-full bg-line mt-1 overflow-hidden">
                                                <div className="h-full rounded-full" style={{ width: `${Math.max(signal.score, 3)}%`, background: riskColor(signal.score) }} />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                        <p className="font-mono text-[10px] text-[#98A2B5] mt-2.5">Bars show risk per signal (higher is riskier). Hover a bar for the reason.</p>
                    </div>
                </div>
            )}
        </div>
    );
}

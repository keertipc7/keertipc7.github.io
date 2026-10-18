import { Link as LinkType } from '@/lib/types';
import { withBase } from '@/lib/basePath';

/* Outbound links (live demo, code, report, certificate) under a detail-page header. */
export default function LinkRow({ links }: { links?: LinkType[] }) {
    if (!links?.length) return null;
    return (
        <div className="flex flex-wrap gap-3 mt-8">
            {links.map((link, i) => {
                // Internal paths (like the hosted demo) open in the same tab.
                const external = /^https?:/.test(link.href);
                return (
                    <a key={link.href} href={withBase(link.href)}
                        {...(external && { target: '_blank', rel: 'noopener noreferrer' })}
                        className={`font-mono text-[11px] uppercase tracking-[0.1em] px-4 py-2.5 rounded-md transition-colors ${i === 0
                            ? 'text-white bg-accent hover:bg-accent-ink'
                            : 'text-accent-ink border border-accent/40 bg-paper hover:bg-accent hover:text-white'}`}>
                        {link.label} {external ? '↗' : '→'}
                    </a>
                );
            })}
        </div>
    );
}

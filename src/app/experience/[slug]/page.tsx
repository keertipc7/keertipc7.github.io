import { getExperiences, getExperience } from '@/lib/api';
import Link from 'next/link';
import BlockRenderer from '@/components/BlockRenderer';
import LinkRow from '@/components/LinkRow';
import SiteLogo from '@/components/SiteLogo';

export async function generateStaticParams() {
    return getExperiences().map((exp) => ({ slug: exp.slug }));
}

/* Renders [text](href) markdown links in the overview as accent links. */
function linkify(text: string) {
    return text.split(/(\[[^\]]+\]\([^)\s]+\))/g).map((part, i) => {
        const match = part.match(/^\[([^\]]+)\]\(([^)\s]+)\)$/);
        if (!match) return part;
        return (
            <Link key={i} href={match[2]}
                className="text-accent border-b border-accent/25 hover:border-accent transition-colors">
                {match[1]}
            </Link>
        );
    });
}

export default async function ExperiencePage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const experience = getExperience(slug);

    return (
        <main className="min-h-screen">
            {/* NAV */}
            <nav className="sticky top-0 z-30 bg-ground/90 backdrop-blur border-b border-line">
                <div className="max-w-[1120px] mx-auto px-7 h-[58px] flex items-center justify-between">
                    <SiteLogo />
                    <Link href="/#experience"
                        className="font-mono text-xs uppercase tracking-[0.08em] text-muted hover:text-ink transition-colors">
                        ← Back to work
                    </Link>
                </div>
            </nav>

            {/* HEADER */}
            <header className="max-w-[1120px] mx-auto px-7 pt-14 pb-10">
                <div className="flex items-center gap-2.5 flex-wrap mb-5">
                    <span className="w-[22px] h-px bg-accent" />
                    <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-accent">{experience.period}</span>
                    {experience.location && (
                        <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">· {experience.location}</span>
                    )}
                </div>
                <h1 className="font-serif font-semibold text-4xl md:text-6xl leading-[0.98] tracking-tight mb-3">
                    {experience.company}<span className="text-accent">.</span>
                </h1>
                <p className="font-mono text-xs uppercase tracking-[0.06em] text-accent mb-8">{experience.title}</p>
                <p className="text-[17px] md:text-[17px] leading-relaxed text-[#333E52] max-w-[68ch] whitespace-pre-line">{linkify(experience.overview ?? '')}</p>

                {experience.key_impact && (
                    <div className="grid grid-cols-3 gap-6 border-t border-ink mt-10 pt-5 max-w-[620px]">
                        {experience.key_impact.map((impact) => (
                            <div key={impact.label}>
                                <div className="font-mono text-3xl tabular-nums text-accent-ink">{impact.value}</div>
                                <div className="text-[14px] font-semibold mt-1.5 leading-snug">{impact.label}</div>
                            </div>
                        ))}
                    </div>
                )}

                <LinkRow links={experience.links} />

                {experience.skills && (
                    <div className="flex flex-wrap gap-2 mt-8">
                        {experience.skills.map((skill) => (
                            <span key={skill}
                                className="font-mono text-[11px] uppercase tracking-[0.06em] text-muted bg-paper border border-line rounded-md px-3 py-1.5">
                                {skill}
                            </span>
                        ))}
                    </div>
                )}
            </header>

            {/* SECTIONS */}
            <div className="pb-24">
                <BlockRenderer sections={experience.sections || []} />
            </div>

            {/* FOOTER */}
            <footer className="border-t border-line bg-wash">
                <div className="max-w-[1120px] mx-auto px-7 py-7 flex items-center justify-between">
                    <Link href="/#experience"
                        className="font-mono text-[11px] uppercase tracking-[0.1em] text-accent hover:text-accent-ink transition-colors">
                        ← All work
                    </Link>
                    <Link href="/" className="font-mono text-[11px] text-[#98A2B5] hover:text-accent transition-colors">Home</Link>
                </div>
            </footer>
        </main>
    );
}

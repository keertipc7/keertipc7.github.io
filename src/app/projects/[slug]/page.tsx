import { getProjects, getProject } from '@/lib/api';
import Link from 'next/link';
import BlockRenderer from '@/components/BlockRenderer';
import LinkRow from '@/components/LinkRow';
import SiteLogo from '@/components/SiteLogo';
import { withBase } from '@/lib/basePath';

export async function generateStaticParams() {
    return getProjects().map((project) => ({ slug: project.slug }));
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const project = getProject(slug);

    return (
        <main className="min-h-screen">
            {/* NAV */}
            <nav className="sticky top-0 z-30 bg-ground/90 backdrop-blur border-b border-line">
                <div className="max-w-[1120px] mx-auto px-7 h-[58px] flex items-center justify-between">
                    <SiteLogo />
                    <Link href="/#projects"
                        className="font-mono text-xs uppercase tracking-[0.08em] text-muted hover:text-ink transition-colors">
                        ← Back to projects
                    </Link>
                </div>
            </nav>

            {/* HEADER */}
            <header className="max-w-[1120px] mx-auto px-7 pt-14 pb-10">
                <div className="flex items-center gap-2.5 flex-wrap mb-5">
                    <span className="w-[22px] h-px bg-accent" />
                    <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-accent">{project.category}</span>
                    {project.stats?.course && (
                        <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">· {project.stats.course}</span>
                    )}
                </div>
                <h1 className="font-serif font-semibold text-4xl md:text-6xl leading-[0.98] tracking-tight mb-4">
                    {project.title}<span className="text-accent">.</span>
                </h1>
                <p className="font-serif text-xl md:text-2xl text-[#333E52] max-w-[62ch]">{project.tagline}</p>

                <LinkRow links={project.links} />

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 border-t border-ink mt-10 pt-5 max-w-[720px]">
                    {[
                        { label: 'Duration', value: project.stats?.duration },
                        { label: 'Role', value: project.stats?.role },
                        { label: 'Team', value: project.stats?.team },
                        { label: 'Context', value: project.stats?.course },
                    ].filter((stat) => stat.value).map((stat) => (
                        <div key={stat.label}>
                            <div className="font-mono text-[11px] uppercase tracking-[0.1em] text-muted mb-1.5">{stat.label}</div>
                            <div className="font-serif font-semibold text-lg leading-snug">{stat.value}</div>
                        </div>
                    ))}
                </div>

            </header>

            {/* HERO IMAGE */}
            {project.heroImage && (
                <div className="max-w-[1120px] mx-auto px-7 mb-8">
                    {/* Scale the whole image down instead of cropping it (object-cover cut tall images). */}
                    <img src={withBase(project.heroImage)} alt={project.title} className="max-h-[420px] w-auto max-w-full mx-auto rounded-xl border border-line" />
                </div>
            )}

            {/* SECTIONS */}
            <div className="pb-24">
                <BlockRenderer sections={project.sections || []} />
            </div>

            {/* FOOTER */}
            <footer className="border-t border-line bg-wash">
                <div className="max-w-[1120px] mx-auto px-7 py-7 flex items-center justify-between">
                    <Link href="/#projects"
                        className="font-mono text-[11px] uppercase tracking-[0.1em] text-accent hover:text-accent-ink transition-colors">
                        ← All projects
                    </Link>
                    <Link href="/" className="font-mono text-[11px] text-[#98A2B5] hover:text-accent transition-colors">Home</Link>
                </div>
            </footer>
        </main>
    );
}

import React from 'react';
import { Section } from '@/lib/types';
import ChartBlock from './ChartBlock';
import VideoEmbed from './VideoEmbed';
import DomainChecker from './DomainChecker';
import { withBase } from '@/lib/basePath';
import * as LucideIcons from 'lucide-react';

function getLucideIcon(name: string): React.ReactNode {
    // Convert kebab-case to PascalCase: "shield-check" -> "ShieldCheck"
    const pascalName = name
        .split('-')
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join('');
    const IconComponent = (LucideIcons as any)[pascalName];
    if (IconComponent) {
        return <IconComponent className="w-7 h-7" strokeWidth={1.5} />;
    }
    return <span className="text-4xl">{name}</span>;
}

/* Mono uppercase label, matching the homepage design. */
function Label({ children }: { children: React.ReactNode }) {
    return <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-accent">{children}</span>;
}

const WRAP = 'max-w-[1120px] mx-auto px-7';

type BlockProps = {
    sections: Section[];
};

export default function BlockRenderer({ sections }: BlockProps) {
    if (!sections) return null;

    return (
        <div className="space-y-16 md:space-y-20">
            {sections.map((section, index) => {
                switch (section.type) {
                    case 'full_width_text':
                        return (
                            <section key={index} className={WRAP}>
                                <h2 className="font-serif font-semibold text-3xl md:text-4xl tracking-tight leading-tight max-w-4xl">
                                    {section.content}
                                </h2>
                            </section>
                        );

                    case 'split_content':
                        return (
                            <section key={index} className={`${WRAP} grid md:grid-cols-2 gap-8 md:gap-14 items-start`}>
                                <div className="md:sticky md:top-24">
                                    <div className="text-6xl md:text-7xl">{section.image}</div>
                                </div>
                                <div className="space-y-5">
                                    <h3 className="font-serif font-semibold text-2xl md:text-3xl tracking-tight">{section.heading}</h3>
                                    <div className="text-[17px] leading-relaxed text-[#333E52] whitespace-pre-line">{section.content}</div>
                                </div>
                            </section>
                        );

                    case 'grid_stats':
                    case 'stat_grid':
                        return (
                            <section key={index} className="border-y border-line bg-wash py-12 md:py-14">
                                <div className={`${WRAP} grid grid-cols-2 md:grid-cols-4 gap-8`}>
                                    {section.items?.map((item: any, i: number) => (
                                        <div key={i}>
                                            <div className="font-mono text-4xl md:text-5xl tabular-nums text-accent-ink">{item.value}</div>
                                            <div className="text-[14px] font-semibold mt-2 leading-snug">{item.label}</div>
                                            {item.desc && <div className="text-[14px] text-muted mt-1">{item.desc}</div>}
                                        </div>
                                    ))}
                                </div>
                            </section>
                        );

                    case 'feature_list':
                        return (
                            <section key={index} className={WRAP}>
                                <h3 className="font-serif font-semibold text-2xl md:text-3xl tracking-tight border-b border-line pb-4 mb-10">
                                    {section.heading}
                                </h3>
                                <div className="grid md:grid-cols-3 gap-8 md:gap-12">
                                    {section.features?.map((feat: any, i: number) => (
                                        <div key={i} className="space-y-3">
                                            <h4 className="font-serif font-semibold text-xl">{feat.title}</h4>
                                            <p className="text-[16px] text-muted leading-relaxed">{feat.desc}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        );

                    case 'text_block':
                        return (
                            <section key={index} className={`${WRAP} grid md:grid-cols-[1fr_1.8fr] gap-6 md:gap-12`}>
                                <div>
                                    <h3 className="font-serif font-semibold text-2xl md:text-3xl tracking-tight">{section.heading}</h3>
                                </div>
                                <div>
                                    {section.content && (
                                        <div className="text-[17px] leading-relaxed text-[#333E52] whitespace-pre-line">
                                            {section.content}
                                        </div>
                                    )}
                                    {section.listItems && (
                                        <ul className="list-disc pl-5 mt-5 space-y-2.5 text-[16px] text-[#333E52] marker:text-accent">
                                            {section.listItems.map((li: string, i: number) => (
                                                <li key={i}>{li}</li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </section>
                        );

                    case 'aurora_section':
                        return (
                            <section key={index} className="border-y border-line bg-wash py-16 md:py-20">
                                <div className={`${WRAP} text-center space-y-5`}>
                                    <h2 className="font-serif font-semibold text-3xl md:text-4xl tracking-tight">{section.heading}</h2>
                                    <p className="text-[17px] text-muted max-w-3xl mx-auto leading-relaxed">{section.content}</p>
                                </div>
                            </section>
                        );

                    case 'highlight_box':
                        return (
                            <section key={index} className={WRAP}>
                                <div className="bg-inset border-l-2 border-accent rounded-r-lg p-8 md:p-10">
                                    <div className="mb-3"><Label>{section.heading}</Label></div>
                                    <p className="font-serif text-xl md:text-2xl leading-snug text-ink">{section.content}</p>
                                </div>
                            </section>
                        );

                    case 'project_cards':
                    case 'info_grid': {
                        const cols = section.cols || 3;
                        const gridClass = {
                            2: 'lg:grid-cols-2',
                            3: 'lg:grid-cols-3',
                            4: 'lg:grid-cols-4',
                        }[cols as 2 | 3 | 4] || 'lg:grid-cols-3';

                        return (
                            <section key={index} className={WRAP}>
                                <h3 className="font-serif font-semibold text-2xl md:text-3xl tracking-tight mb-10">{section.heading}</h3>
                                <div className={`grid md:grid-cols-2 ${gridClass} gap-5`}>
                                    {section.items?.map((item: any, i: number) => (
                                        <div key={i}
                                            className="bg-paper p-6 border border-line rounded-[10px] hover:border-accent/40 hover:bg-accent/[0.03] transition-colors group">
                                            {item.icon && <div className="text-accent mb-5">{getLucideIcon(item.icon)}</div>}
                                            {item.label && <div className="mb-2"><Label>{item.label}</Label></div>}
                                            <h4 className="font-serif font-semibold text-xl mb-3 group-hover:text-accent-ink transition-colors">{item.title}</h4>
                                            <p className="text-[16px] text-muted leading-relaxed mb-5">{item.desc}</p>
                                            {item.tags && (
                                                <div className="flex flex-wrap gap-2">
                                                    {item.tags.map((tag: string) => (
                                                        <span key={tag}
                                                            className="font-mono text-[10px] uppercase tracking-[0.06em] text-muted bg-wash px-2.5 py-1 rounded">
                                                            {tag}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </section>
                        );
                    }

                    case 'skills_grid':
                        return (
                            <section key={index} className={WRAP}>
                                <div className="bg-wash border border-line rounded-xl p-8 md:p-10">
                                    <h3 className="font-serif font-semibold text-2xl tracking-tight mb-6">{section.heading}</h3>
                                    <div className="flex flex-wrap gap-2.5">
                                        {section.items?.map((item: any, i: number) => (
                                            <span key={i}
                                                className="font-mono text-[12px] text-muted bg-paper border border-line rounded-md px-3.5 py-2">
                                                {typeof item === 'string' ? item : item.label}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </section>
                        );

                    case 'process_steps':
                        return (
                            <section key={index} className={WRAP}>
                                <h3 className="font-serif font-semibold text-2xl md:text-3xl tracking-tight mb-10">{section.heading}</h3>
                                <div className="grid md:grid-cols-3 gap-5">
                                    {section.items?.map((item: any, i: number) => (
                                        <div key={i} className="p-8 border border-line rounded-[10px] bg-paper relative overflow-hidden">
                                            <span className="absolute top-4 right-5 font-mono text-[11px] text-accent tracking-[0.1em]">
                                                {String(i + 1).padStart(2, '0')}
                                            </span>
                                            <h4 className="font-serif font-semibold text-xl mb-4 relative z-10">{item.title}</h4>
                                            <p className="text-[16px] text-muted leading-relaxed relative z-10">{item.desc}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        );

                    case 'team_grid':
                        return (
                            <section key={index} className={WRAP}>
                                <h3 className="font-serif font-semibold text-2xl md:text-3xl tracking-tight mb-10 text-center">{section.heading}</h3>
                                <div className="flex flex-wrap justify-center gap-12 md:gap-16">
                                    {section.items?.map((member: any, i: number) => (
                                        <div key={i} className="text-center group">
                                            <div className="w-24 h-24 md:w-28 md:h-28 bg-inset border border-line rounded-full flex items-center justify-center text-4xl mb-4 mx-auto group-hover:border-accent/40 transition-colors">
                                                {member.avatar || '👤'}
                                            </div>
                                            <div className="font-serif font-semibold text-lg mb-1">{member.name}</div>
                                            {member.role && (
                                                <div className="font-mono text-[11px] uppercase tracking-[0.06em] text-muted">{member.role}</div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </section>
                        );

                    case 'chart':
                        return (
                            <section key={index} className={WRAP}>
                                <div className="p-6 md:p-8 bg-paper border border-line rounded-xl">
                                    <ChartBlock section={section as any} />
                                </div>
                            </section>
                        );

                    // An embedded video player (image = embed URL, content = link to the original post).
                    case 'video_embed':
                        return (
                            <section key={index} className={WRAP}>
                                {section.heading && (
                                    <h3 className="font-serif font-semibold text-2xl md:text-3xl tracking-tight mb-6">{section.heading}</h3>
                                )}
                                <VideoEmbed embed={section.image ?? ''} link={section.content} caption={section.caption}
                                    title={section.heading} className="max-w-[560px]" />
                            </section>
                        );

                    // Photo grid: items are { image, caption, position? }; position is the crop focus.
                    case 'gallery':
                        return (
                            <section key={index} id={section.id} className={WRAP}>
                                {section.heading && (
                                    <h3 className="font-serif font-semibold text-2xl md:text-3xl tracking-tight mb-8">{section.heading}</h3>
                                )}
                                <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                                    {section.items?.map((item: { image: string; caption?: string; position?: string }, i: number) => (
                                        <figure key={i}>
                                            <img src={withBase(item.image)} alt={item.caption ?? ''} loading="lazy"
                                                style={{ objectPosition: item.position ?? 'center' }}
                                                className="w-full aspect-[4/3] object-cover rounded-xl border border-line" />
                                            {item.caption && (
                                                <figcaption className="font-mono text-[11px] text-muted mt-2 leading-relaxed">{item.caption}</figcaption>
                                            )}
                                        </figure>
                                    ))}
                                </div>
                            </section>
                        );

                    // The live Domain Authenticator scoring engine, embedded in the page.
                    case 'domain_checker':
                        return (
                            <section key={index} id={section.id} className={`${WRAP} scroll-mt-24`}>
                                <div className="border border-line rounded-xl bg-paper p-6 md:p-8">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="w-2 h-2 rounded-full bg-accent animate-pulse motion-reduce:animate-none" />
                                        <Label>Live</Label>
                                    </div>
                                    {section.heading && (
                                        <h3 className="font-serif font-semibold text-2xl md:text-3xl tracking-tight">{section.heading}</h3>
                                    )}
                                    {section.content && <p className="text-[16px] text-muted leading-relaxed mt-2 max-w-[70ch]">{section.content}</p>}
                                    {section.api && <DomainChecker api={section.api} examples={section.examples ?? []} />}
                                </div>
                            </section>
                        );

                    case 'image_block':
                        return (
                            <section key={index} className={WRAP}>
                                <figure className="space-y-3">
                                    <div className="rounded-xl overflow-hidden border border-line">
                                        <img src={withBase(section.image ?? '')} alt={section.caption || 'Project image'} className="w-full h-auto" />
                                    </div>
                                    {section.caption && (
                                        <figcaption className="font-mono text-[11px] uppercase tracking-[0.08em] text-muted text-center">
                                            {section.caption}
                                        </figcaption>
                                    )}
                                </figure>
                            </section>
                        );

                    default:
                        return null;
                }
            })}
        </div>
    );
}

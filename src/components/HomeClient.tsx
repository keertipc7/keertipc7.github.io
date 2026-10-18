'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FileText, Github, Linkedin, Menu, X } from 'lucide-react';
import SiteLogo from '@/components/SiteLogo';
import DomainChecker from '@/components/DomainChecker';
import { withBase } from '@/lib/basePath';
import { Card, Experience, Profile, Project } from '@/lib/types';

type HomeClientProps = {
    profile: Profile;
    experiences: Experience[];
    projects: Project[];
    research: Card[];
    leadership: Card[];
};

const NAV_ITEMS = [
    { label: 'About', id: 'about' },
    { label: 'Experience', id: 'experience' },
    { label: 'Projects', id: 'projects' },
    { label: 'Research', id: 'research' },
    { label: 'Leadership', id: 'leadership' },
];

/* Internal paths (like the hosted demo) open in the same tab; everything else in a new one. */
function linkProps(href: string) {
    return /^https?:/.test(href) ? { target: '_blank', rel: 'noopener noreferrer' } : {};
}

/* Grid of cards with a tag, title, org, description and outbound links. */
function CardGrid({ cards }: { cards: Card[] }) {
    return (
        <div className="grid sm:grid-cols-2 gap-4 mt-7">
            {cards.map((card) => (
                <article key={card.name} data-reveal
                    className="border border-line rounded-[10px] bg-paper p-5 flex flex-col gap-2 hover:border-accent/40 hover:bg-accent/[0.03] hover:-translate-y-1 hover:shadow-[0_10px_28px_-18px_#2e4a8566] transition-all duration-300">
                    <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-accent">{card.tag}</span>
                    <h3 className="font-serif font-semibold text-lg leading-snug">{card.name}</h3>
                    {card.org && <span className="font-mono text-[11px] text-muted -mt-1">{card.org}</span>}
                    <p className="text-[14px] text-muted leading-relaxed flex-1"><Nums text={card.description} /></p>
                    <span className="font-mono text-[11px] text-[#8792A5]">
                        {card.links.map((link, i) => (
                            <span key={link.href}>
                                {i > 0 && ' · '}
                                <a href={withBase(link.href)} {...linkProps(link.href)}
                                    className="text-accent-ink border-b border-accent/25 hover:border-accent">
                                    {link.label} ↗
                                </a>
                            </span>
                        ))}
                    </span>
                </article>
            ))}
        </div>
    );
}

/* Mono uppercase label used throughout the design. */
function Label({ children, accent = false }: { children: React.ReactNode; accent?: boolean }) {
    return (
        <span className={`font-mono text-[11px] uppercase tracking-[0.14em] ${accent ? 'text-accent' : 'text-muted'}`}>
            {children}
        </span>
    );
}

function SectionHead({ label, title, sub }: { label: string; title: string; sub: string }) {
    return (
        <div>
            <div className="mb-3"><Label accent>{label}</Label></div>
            <h2 className="font-serif font-semibold text-3xl md:text-4xl tracking-tight">{title}</h2>
            <p className="text-[16px] text-muted mt-3 max-w-3xl">{sub}</p>
        </div>
    );
}

/* Highlights **contribution phrases** and numeric scale (40%, 30K+, 350M+...) inside a sentence. */
function Nums({ text }: { text: string }) {
    return (
        <>
            {text.split(/(\*\*[^*]+\*\*)/g).map((chunk, i) => {
                const bold = chunk.match(/^\*\*([^*]+)\*\*$/);
                if (bold) return <span key={i} className="font-semibold text-ink">{bold[1]}</span>;
                return chunk.split(/(?<![A-Za-z\d])(\d[\d.,]*(?:-\d[\d.,]*)?\s?(?:%|M\+|K\+|\+|x)?)/g).map((part, j) =>
                    /^\d/.test(part)
                        ? <span key={`${i}-${j}`} className="font-semibold text-accent-ink bg-accent/10 rounded-[4px] px-1">{part}</span>
                        : part
                );
            })}
        </>
    );
}

/* The typed prefix of a tagline, with the emphasis word in bold accent as it appears. */
function typedTagline(text: string, shown: number, emphasis?: string) {
    const typed = text.slice(0, shown);
    const start = emphasis ? text.indexOf(emphasis) : -1;
    if (start === -1 || !emphasis) return <>{typed}</>;
    const end = start + emphasis.length;
    return (
        <>
            {typed.slice(0, Math.min(shown, start))}
            {shown > start && <em className="italic font-semibold text-accent">{typed.slice(start, Math.min(shown, end))}</em>}
            {shown > end && typed.slice(end)}
        </>
    );
}

/*
 * Rotating hero tagline with a typewriter effect: type, hold, delete, next.
 * Under prefers-reduced-motion it stays on the first tagline, fully shown.
 */
function TaglineTyper({ taglines }: { taglines: { text: string; emphasis?: string }[] }) {
    const [item, setItem] = useState(0);
    // Starts fully typed so the server-rendered page shows a complete line.
    const [shown, setShown] = useState(taglines[0]?.text.length ?? 0);
    const [deleting, setDeleting] = useState(false);
    const [animate, setAnimate] = useState(false);

    useEffect(() => {
        setAnimate(!window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    }, []);

    useEffect(() => {
        if (!animate || taglines.length < 2) return;
        const full = taglines[item].text.length;
        let delay: number;
        if (deleting) delay = shown > 0 ? 28 : 400;
        else delay = shown < full ? 52 : 4200;
        const timer = setTimeout(() => {
            if (deleting) {
                if (shown > 0) setShown(shown - 1);
                else { setDeleting(false); setItem((item + 1) % taglines.length); }
            } else {
                if (shown < full) setShown(shown + 1);
                else setDeleting(true);
            }
        }, delay);
        return () => clearTimeout(timer);
    }, [animate, taglines, item, shown, deleting]);

    if (taglines.length === 0) return null;
    const longest = taglines.reduce((a, b) => (b.text.length > a.text.length ? b : a)).text;
    return (
        <p className="relative font-serif text-xl md:text-2xl text-[#333E52] mb-9">
            {/* Invisible longest line reserves the height so typing never shifts the layout. */}
            <span className="invisible" aria-hidden>{longest}</span>
            <span className="absolute inset-0">
                {typedTagline(taglines[item].text, shown, taglines[item].emphasis)}
                <span className="tagline-cursor inline-block w-[2px] h-[1.05em] ml-0.5 align-[-0.15em] bg-accent" aria-hidden />
            </span>
        </p>
    );
}

export default function HomeClient({ profile, experiences, projects, research, leadership }: HomeClientProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    // The other projects stay tucked away until asked for; featured ones are always shown.
    const [showMoreProjects, setShowMoreProjects] = useState(false);
    const [activeSection, setActiveSection] = useState('');
    const [copied, setCopied] = useState(false);
    const [contactStatus, setContactStatus] = useState<'idle' | 'sending' | 'sent'>('idle');
    const progressRef = useRef<HTMLSpanElement>(null);

    const scrollTo = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
        e.preventDefault();
        setIsMenuOpen(false);
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        // Scroll-spy: highlight the nav item for the section in view.
        const spy = new IntersectionObserver(
            (entries) => entries.forEach((entry) => entry.isIntersecting && setActiveSection(entry.target.id)),
            { rootMargin: '-25% 0px -65% 0px' }
        );
        [...NAV_ITEMS.map((item) => item.id), 'contact'].forEach((id) => {
            const el = document.getElementById(id);
            if (el) spy.observe(el);
        });

        // Scroll-reveal: class added here so content stays visible without JS.
        const revealed = Array.from(document.querySelectorAll('[data-reveal]'));
        revealed.forEach((el) => el.classList.add('reveal'));
        const reveal = new IntersectionObserver(
            (entries) => entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('reveal-visible');
                    reveal.unobserve(entry.target);
                }
            }),
            { threshold: 0.08 }
        );
        revealed.forEach((el) => reveal.observe(el));

        // Reading progress bar under the navbar.
        const onScroll = () => {
            const max = document.documentElement.scrollHeight - window.innerHeight;
            if (progressRef.current) {
                progressRef.current.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
            }
        };
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => {
            spy.disconnect();
            reveal.disconnect();
            window.removeEventListener('scroll', onScroll);
        };
    }, []);

    /* Opens the visitor's email app, used as a fallback when the form key isn't configured. */
    const openMailto = (name: string, email: string, message: string) => {
        const subject = encodeURIComponent(`Note from ${name} via your portfolio`);
        const body = encodeURIComponent(`${message}\n\n${name} (${email})`);
        window.location.href = `mailto:${profile.contact.email}?subject=${subject}&body=${body}`;
    };

    /* Sends the note through FormSubmit (formsubmit.co), which emails it to the contact
       address with no account or key. The very first submission ever triggers a one-time
       "Activate form" email to that inbox; after the link is clicked, every note is delivered.
       If the send fails for any reason, the visitor's email app opens with the note pre-filled. */
    const submitContact = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        const data = new FormData(form);
        if (data.get('botcheck')) return; // honeypot: bots fill this, people leave it empty
        const name = String(data.get('name') ?? '');
        const email = String(data.get('email') ?? '');
        const message = String(data.get('message') ?? '');

        const fallback = () => {
            openMailto(name, email, message);
            setContactStatus('idle');
        };

        setContactStatus('sending');
        try {
            const res = await fetch(`https://formsubmit.co/ajax/${profile.contact.email}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
                body: JSON.stringify({
                    name,
                    email, // FormSubmit uses this field as the reply-to address
                    message,
                    _subject: `Portfolio note from ${name}`,
                    _template: 'table',
                    _captcha: 'false',
                }),
            });
            const result = await res.json().catch(() => null);
            if (String(result?.success) === 'true') {
                form.reset();
                setContactStatus('sent');
            } else {
                fallback();
            }
        } catch {
            fallback();
        }
    };

    const copyEmail = async () => {
        await navigator.clipboard.writeText(profile.contact.email);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <main className="min-h-screen">
            {/* NAV */}
            <nav className="sticky top-0 z-30 bg-ground/90 backdrop-blur border-b border-line">
                <div className="max-w-[1120px] mx-auto px-7 h-[58px] flex items-center justify-between">
                    <SiteLogo />
                    <div className="hidden md:flex items-center gap-6">
                        {NAV_ITEMS.map((item) => (
                            <a key={item.id} href={`#${item.id}`} onClick={(e) => scrollTo(e, item.id)}
                                className={`group relative font-mono text-xs uppercase tracking-[0.08em] transition-colors ${activeSection === item.id ? 'text-accent-ink' : 'text-muted hover:text-ink'}`}>
                                {item.label}
                                <span className={`absolute -bottom-1.5 left-0 h-[2px] bg-accent transition-all duration-300 ${activeSection === item.id ? 'w-full' : 'w-0 group-hover:w-full'}`} />
                            </a>
                        ))}
                        <a href="#contact" onClick={(e) => scrollTo(e, 'contact')}
                            className={`group relative font-mono text-xs uppercase tracking-[0.08em] transition-colors ${activeSection === 'contact' ? 'text-accent-ink' : 'text-accent'}`}>
                            Contact
                            <span className={`absolute -bottom-1.5 left-0 h-[2px] bg-accent transition-all duration-300 ${activeSection === 'contact' ? 'w-full' : 'w-0 group-hover:w-full'}`} />
                        </a>
                    </div>
                    <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Menu">
                        {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>
                {isMenuOpen && (
                    <div className="md:hidden border-t border-line bg-ground px-7 py-5 flex flex-col gap-4">
                        {[...NAV_ITEMS, { label: 'Contact', id: 'contact' }].map((item) => (
                            <a key={item.id} href={`#${item.id}`} onClick={(e) => scrollTo(e, item.id)}
                                className="font-mono text-xs uppercase tracking-[0.08em] text-muted">
                                {item.label}
                            </a>
                        ))}
                    </div>
                )}
                {/* Reading progress */}
                <span ref={progressRef}
                    className="absolute bottom-0 left-0 h-[2px] w-full bg-accent origin-left scale-x-0 will-change-transform" />
            </nav>

            {/* HERO (wash sits on the full-bleed wrapper so it fades before any container edge) */}
            <div className="bg-[radial-gradient(46%_58%_at_38%_0%,#2E4A8512,transparent)]">
            <header className="max-w-[1120px] mx-auto px-7 pt-14 pb-12 grid lg:grid-cols-[0.7fr_1.3fr] gap-10 lg:gap-16 items-start">
                {/* Left: portrait at a fixed size, pinned to the top so a growing chat never stretches it */}
                <aside className="flex flex-col items-center gap-5 max-w-[340px] mx-auto w-full lg:pt-2">
                    <div className="group relative w-full aspect-[4/5] rounded-xl overflow-hidden border border-line grayscale-[0.15] hover:grayscale-0 transition-[filter] duration-500">
                        <Image src={withBase("/images/DSC02305_copy.JPG")} alt={profile.name} fill
                            sizes="(max-width: 1024px) 80vw, 340px" priority
                            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]" />
                    </div>
                    <span className="inline-flex items-center gap-2 bg-accent/10 border border-accent/25 rounded-full px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.1em] text-accent-ink">
                        <span className="w-2 h-2 rounded-full bg-accent animate-pulse motion-reduce:animate-none" />
                        {profile.availability}
                    </span>
                    <div className="flex flex-col items-center gap-3.5">
                        <div className="flex gap-2.5">
                            <a href="#contact" onClick={(e) => scrollTo(e, 'contact')}
                                className="font-mono text-[11px] uppercase tracking-[0.1em] text-white bg-accent hover:bg-accent-ink px-4 py-2.5 rounded-md transition-colors">
                                Leave a Note
                            </a>
                            {profile.contact.booking && (
                                <a href={profile.contact.booking} target="_blank" rel="noopener noreferrer"
                                    className="font-mono text-[11px] uppercase tracking-[0.1em] text-accent-ink border border-accent/40 bg-paper hover:bg-accent hover:text-white px-4 py-2.5 rounded-md transition-colors">
                                    Book a Call
                                </a>
                            )}
                        </div>
                        <div className="flex items-center gap-5">
                            {profile.contact.resume && (
                                <a href={profile.contact.resume} target="_blank" rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.08em] text-muted hover:text-accent-ink transition-colors">
                                    <FileText size={14} strokeWidth={1.8} /> Résumé
                                </a>
                            )}
                            <a href={profile.contact.github} target="_blank" rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.08em] text-muted hover:text-accent-ink transition-colors">
                                <Github size={14} strokeWidth={1.8} /> GitHub
                            </a>
                            <a href={profile.contact.linkedin} target="_blank" rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.08em] text-muted hover:text-accent-ink transition-colors">
                                <Linkedin size={14} strokeWidth={1.8} /> LinkedIn
                            </a>
                        </div>
                    </div>
                </aside>

                {/* Right: name, tagline, integrated chat, stats */}
                <div>
                    <h1 className="font-serif font-semibold text-4xl md:text-[3.5rem] leading-[1.02] tracking-tight mb-4">
                        {profile.name}<span className="text-accent">.</span>
                    </h1>
                    <div className="flex items-center gap-2.5 flex-wrap mb-3">
                        {profile.hero.chips.map((chip, i) => (
                            <span key={chip} className="font-mono text-[13px] font-medium uppercase tracking-[0.14em] text-accent-ink">
                                {i > 0 && <span className="text-muted mr-2.5">·</span>}{chip}
                            </span>
                        ))}
                    </div>
                    <TaglineTyper taglines={profile.hero.taglines} />

                    <p className="text-[17px] leading-relaxed text-[#333E52] max-w-[62ch]">{profile.hero.intro}</p>

                    {/* Spotlight: one build worth trying right now, with its live demo. */}
                    {profile.hero.spotlight && (
                        <div className="border border-line rounded-xl bg-paper px-6 py-5 mt-7 max-w-[720px]">
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-accent animate-pulse motion-reduce:animate-none" />
                                <Label accent>{profile.hero.spotlight.label}</Label>
                            </div>
                            <h3 className="font-serif font-semibold text-xl mt-2.5">{profile.hero.spotlight.title}</h3>
                            <p className="text-[15px] text-muted leading-relaxed mt-1.5">{profile.hero.spotlight.text}</p>
                            {profile.hero.spotlight.api && (
                                <DomainChecker api={profile.hero.spotlight.api} examples={profile.hero.spotlight.examples ?? []} />
                            )}
                            <div className="flex flex-wrap gap-x-6 gap-y-2 mt-4">
                                {profile.hero.spotlight.links.map((link) => (
                                    <a key={link.href} href={withBase(link.href)} {...linkProps(link.href)}
                                        className="group inline-flex items-center gap-1.5 font-mono text-[12px] uppercase tracking-[0.08em] text-accent hover:text-accent-ink transition-colors">
                                        {link.label}
                                        <span className="group-hover:translate-x-0.5 transition-transform">→</span>
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Stats, horizontal */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 border-t border-ink mt-10 pt-5 max-w-[720px]">
                        {profile.stats.map((stat) => (
                            <div key={stat.label}>
                                <div className="font-mono text-3xl tabular-nums text-accent-ink">{stat.number}</div>
                                <div className="text-[14px] font-semibold mt-1.5">{stat.label}</div>
                                <div className="font-mono text-[11px] uppercase tracking-[0.04em] text-muted mt-1">{stat.detail}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </header>
            </div>

            {/* ABOUT */}
            <section id="about" className="max-w-[1120px] mx-auto px-7 pt-16 pb-2">
                <div className="grid md:grid-cols-[1fr_1.6fr] gap-6 md:gap-14" data-reveal>
                    <div>
                        <div className="mb-3"><Label accent>01 · About</Label></div>
                        <h2 className="font-serif font-semibold text-3xl md:text-4xl tracking-tight">{profile.about.heading}</h2>
                        {/* The site's arc: quiet links to the matching sections */}
                        <div className="mt-8 space-y-4">
                            {profile.spine.map((cell) => (
                                <a key={cell.title} href={`#${cell.target}`} onClick={(e) => scrollTo(e, cell.target)}
                                    className="group block">
                                    <span className="font-serif font-semibold text-[17px] group-hover:text-accent-ink transition-colors">
                                        {cell.title}
                                        <span className="font-mono text-[13px] text-accent ml-1.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 inline-block transition-all duration-300">→</span>
                                    </span>
                                    <span className="block text-[14px] text-muted mt-0.5">{cell.text}</span>
                                </a>
                            ))}
                        </div>
                    </div>
                    <div className="space-y-5 md:pt-9">
                        {profile.about.paragraphs.map((para, i) => (
                            <p key={i} className="text-[17px] leading-relaxed text-[#333E52] max-w-[62ch]">{para}</p>
                        ))}
                        {profile.about.links && (
                            <div className="flex flex-wrap gap-x-8 gap-y-3">
                                {profile.about.links.map((link) => (
                                    <a key={link.target} href={`#${link.target}`}
                                        onClick={(e) => scrollTo(e, link.target)}
                                        className="group inline-flex items-center gap-1.5 font-mono text-[12px] uppercase tracking-[0.08em] text-accent hover:text-accent-ink transition-colors">
                                        {link.label}
                                        <span className="group-hover:translate-x-0.5 transition-transform">→</span>
                                    </a>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* MOMENTS: photos from the roles, each linking to its page */}
            {profile.moments && profile.moments.length > 0 && (
                <section id="moments" className="max-w-[1120px] mx-auto px-7 pt-14">
                    <SectionHead label="Along the way" title="Moments from the work."
                        sub="Offices, teams, and a few goodbyes." />
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 mt-7">
                        {profile.moments.map((moment) => {
                            const photo = (
                                <>
                                    <span className="block aspect-[4/3] overflow-hidden rounded-xl border border-line bg-inset">
                                        <img src={withBase(moment.image)} alt={moment.caption} loading="lazy"
                                            style={{ objectPosition: moment.position ?? 'center' }}
                                            className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]" />
                                    </span>
                                    <span className="block font-mono text-[11px] text-muted mt-2 leading-snug group-hover:text-accent-ink transition-colors">
                                        {moment.caption}{moment.href && <span className="text-accent ml-1">→</span>}
                                    </span>
                                </>
                            );
                            return moment.href ? (
                                <Link key={moment.image} href={moment.href} data-reveal className="group block">{photo}</Link>
                            ) : (
                                <figure key={moment.image} data-reveal className="group">{photo}</figure>
                            );
                        })}
                    </div>
                </section>
            )}

            {/* EDUCATION & CERTIFICATIONS */}
            <div className="border-y border-line bg-wash mt-14">
                <div className="max-w-[1120px] mx-auto px-7 py-8 grid md:grid-cols-[1fr_1.9fr] gap-x-14 gap-y-8">
                    <div>
                        <div className="mb-5"><Label accent>Education</Label></div>
                        <div className="space-y-5">
                            {profile.education.map((edu) => (
                                <div key={edu.school}>
                                    <span className="block text-[15px] font-semibold leading-snug">{edu.school}</span>
                                    <span className="block text-[14px] text-muted mt-0.5">{edu.degree}</span>
                                    <span className="block font-mono text-[11px] uppercase tracking-[0.04em] text-muted mt-1">{edu.year}</span>
                                    {edu.detail && <span className="block text-[13px] text-muted mt-1">{edu.detail}</span>}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div>
                        <div className="mb-5"><Label accent>Achievements</Label></div>
                        <div className="grid sm:grid-cols-2 gap-x-10 gap-y-5">
                            {profile.achievements.map((cert) => (
                                <a key={cert.name} href={cert.href} target="_blank" rel="noopener noreferrer" className="group">
                                    <span className="block text-[15px] font-semibold leading-snug group-hover:text-accent-ink transition-colors">
                                        {cert.name}
                                        <span className="font-mono text-[11px] text-accent ml-1.5 opacity-0 group-hover:opacity-100 transition-opacity">↗</span>
                                    </span>
                                    <span className="block font-mono text-[11px] uppercase tracking-[0.04em] text-muted mt-1">
                                        {cert.issuer}{cert.year && ` · ${cert.year}`}
                                    </span>
                                </a>
                            ))}
                        </div>
                    </div>
                    <div className="md:col-span-2 border-t border-line pt-7">
                        <div className="mb-5"><Label accent>Skills</Label></div>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-5">
                            {profile.skills.map((group) => (
                                <div key={group.group}>
                                    <span className="block font-mono text-[11px] uppercase tracking-[0.04em] text-muted mb-1.5">{group.group}</span>
                                    <span className="block text-[14px] leading-relaxed">{group.items.join(' · ')}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* EXPERIENCE */}
            <section id="experience" className="max-w-[1120px] mx-auto px-7 py-16">
                <SectionHead label="02 · Experience" title="Where I’ve worked."
                    sub="Product management at Cloudflare and Algozenith, and software engineering at Microsoft." />
                <div className="relative border-t border-ink mt-6">
                    {/* Timeline spine */}
                    <span aria-hidden className="absolute left-[5px] top-0 bottom-0 w-px bg-line" />
                    {experiences.map((exp) => (
                        <Link key={exp.slug} href={`/experience/${exp.slug}`} data-reveal
                            className="relative grid md:grid-cols-[160px_1.15fr_1.5fr] gap-2 md:gap-5 py-5 pl-8 border-b border-line group hover:bg-accent/[0.04] transition-colors">
                            <span aria-hidden className="absolute left-0 top-[26px] w-[11px] h-[11px] rounded-full border-2 border-accent bg-ground group-hover:bg-accent transition-colors" />
                            <span className="font-mono text-[12px] text-muted pt-1">{exp.period}</span>
                            <span>
                                <span className="block font-serif font-semibold text-xl group-hover:text-accent-ink transition-colors">{exp.company}</span>
                                <span className="block font-mono text-[11px] uppercase tracking-[0.06em] text-accent mt-1">
                                    {exp.title}
                                    {exp.industry && <span className="text-muted"> · {exp.industry}</span>}
                                </span>
                                <span className="hidden md:block font-mono text-[11px] text-accent mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    case study →
                                </span>
                            </span>
                            <span>
                                <span className="block text-[15px] text-[#2C3648] leading-relaxed"><Nums text={exp.short_description} /></span>
                                <span className="block font-mono text-[11px] text-muted mt-2">
                                    {exp.skills?.slice(0, 4).join(' · ')}
                                </span>
                            </span>
                        </Link>
                    ))}
                </div>
            </section>

            {/* PROJECTS */}
            <section id="projects" className="max-w-[1120px] mx-auto px-7 pb-16">
                <SectionHead label="03 · Projects" title="What I’ve built and studied."
                    sub="An AI product I built end to end, plus product design and research work from Carnegie Mellon. Case studies on their own pages." />

                {/* Featured projects: full width, always visible, only a step above the rows below */}
                <div className="mt-7 mb-8 space-y-4">
                {projects.filter((p) => p.featured).map((project) => (
                    <Link key={project.slug} href={`/projects/${project.slug}`} data-reveal
                        className="block border border-line rounded-xl bg-paper px-6 py-5 md:px-7 group hover:border-accent/40 hover:bg-accent/[0.03] transition-colors">
                        <div className="flex items-baseline justify-between gap-4">
                            <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-accent">
                                {project.category}{project.stats?.course && ` · ${project.stats.course}`}
                            </span>
                            <span className="font-mono text-accent opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-300">→</span>
                        </div>
                        <div className="flex flex-col md:flex-row md:items-baseline gap-x-3.5 gap-y-1 mt-2.5">
                            <span className="font-serif font-semibold text-xl whitespace-nowrap group-hover:text-accent-ink transition-colors">
                                {project.title}<span className="text-accent">.</span>
                            </span>
                            <span className="text-[15px] text-[#333E52]">{project.tagline}</span>
                        </div>
                        {project.featuredBlurb && (
                            <p className="text-[14px] text-muted leading-relaxed mt-1.5 max-w-[92ch]">{project.featuredBlurb}</p>
                        )}
                    </Link>
                ))}
                </div>

                <button type="button" onClick={() => setShowMoreProjects(!showMoreProjects)}
                    className="w-full flex items-center gap-2.5 border-t border-ink pt-4 pb-1 font-mono text-[12px] text-accent hover:text-accent-ink transition-colors">
                    {showMoreProjects ? 'Hide the other projects' : `Show ${projects.filter((p) => !p.featured).length} more projects`}
                    <span className={`inline-block transition-transform duration-300 ${showMoreProjects ? 'rotate-180' : ''}`}>↓</span>
                </button>
                {showMoreProjects && (
                    <div className="grid md:grid-cols-2 gap-x-10 mt-3">
                        {projects.filter((p) => !p.featured).map((project) => (
                            <Link key={project.slug} href={`/projects/${project.slug}`}
                                className="flex items-baseline gap-3.5 py-4 border-b border-line group hover:bg-accent/[0.04] transition-colors min-w-0">
                                <span className="font-serif font-semibold whitespace-nowrap group-hover:text-accent-ink transition-colors">{project.title}</span>
                                <span className="text-[14px] text-muted truncate min-w-0">{project.tagline}</span>
                                <span className="hidden lg:block font-mono text-[11px] text-[#8792A5] ml-auto whitespace-nowrap">
                                    {project.stats?.course ?? project.category}
                                </span>
                                <span className="font-mono text-accent opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-300">→</span>
                            </Link>
                        ))}
                    </div>
                )}
            </section>

            {/* RESEARCH */}
            <section id="research" className="max-w-[1120px] mx-auto px-7 pb-16">
                <SectionHead label="04 · Research" title="Research and thesis work."
                    sub="Machine learning research from IIT Kharagpur and a research internship, with the reports linked." />
                <CardGrid cards={research} />
            </section>

            {/* LEADERSHIP */}
            <section id="leadership" className="max-w-[1120px] mx-auto px-7 pb-16">
                <SectionHead label="05 · Leadership" title="Leadership and volunteering."
                    sub="Teaching, art, and running student societies alongside the coursework." />
                <CardGrid cards={leadership} />
            </section>

            {/* CONTACT */}
            <section id="contact" className="max-w-[1120px] mx-auto px-7 pb-20">
                <SectionHead label="06 · Contact" title={profile.contact.heading} sub={profile.contact.pitch} />
                <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-10 mt-8" data-reveal>
                    <form onSubmit={submitContact} className="grid gap-4 content-start">
                        <input type="checkbox" name="botcheck" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
                        <div className="grid sm:grid-cols-2 gap-4">
                            <input required name="name" placeholder="Your name" autoComplete="name"
                                className="border border-line rounded-lg bg-paper px-3.5 py-3 text-[15px] placeholder:text-[#98A2B5] focus:border-accent outline-none transition-colors" />
                            <input required name="email" type="email" placeholder="Your email" autoComplete="email"
                                className="border border-line rounded-lg bg-paper px-3.5 py-3 text-[15px] placeholder:text-[#98A2B5] focus:border-accent outline-none transition-colors" />
                        </div>
                        <textarea required name="message" rows={5} placeholder="What would you like to talk about?"
                            className="border border-line rounded-lg bg-paper px-3.5 py-3 text-[15px] placeholder:text-[#98A2B5] focus:border-accent outline-none transition-colors resize-y" />
                        <div className="flex items-center gap-4 flex-wrap">
                            <button type="submit" disabled={contactStatus === 'sending' || contactStatus === 'sent'}
                                className="font-mono text-[11px] uppercase tracking-[0.1em] text-white bg-accent hover:bg-accent-ink px-5 py-3 rounded-md transition-colors disabled:opacity-60">
                                {contactStatus === 'sending' ? 'Sending…' : contactStatus === 'sent' ? 'Sent ✓' : 'Send note →'}
                            </button>
                            {contactStatus === 'sent' ? (
                                <p className="font-mono text-[11px] text-accent">Thanks, your note is on its way to my inbox.</p>
                            ) : (
                                <p className="font-mono text-[11px] text-[#98A2B5]">goes straight to my inbox</p>
                            )}
                        </div>
                    </form>
                    <aside className="border-t lg:border-t-0 lg:border-l border-line pt-6 lg:pt-0 lg:pl-8">
                        <div className="mb-3"><Label accent>Or reach me directly</Label></div>
                        <div className="flex items-center gap-3 py-2.5 border-b border-line">
                            <span className="font-mono text-[14px]">{profile.contact.email}</span>
                            <button onClick={copyEmail}
                                className="ml-auto font-mono text-[11px] uppercase tracking-[0.08em] text-accent hover:text-accent-ink transition-colors">
                                {copied ? 'copied ✓' : 'copy'}
                            </button>
                        </div>
                        <a href={profile.contact.linkedin} target="_blank" rel="noopener noreferrer"
                            className="flex items-center py-2.5 border-b border-line font-mono text-[14px] hover:text-accent-ink transition-colors group">
                            LinkedIn <span className="ml-auto text-accent opacity-60 group-hover:opacity-100">↗</span>
                        </a>
                        <a href={profile.contact.github} target="_blank" rel="noopener noreferrer"
                            className="flex items-center py-2.5 border-b border-line font-mono text-[14px] hover:text-accent-ink transition-colors group">
                            GitHub <span className="ml-auto text-accent opacity-60 group-hover:opacity-100">↗</span>
                        </a>
                    </aside>
                </div>
            </section>

            {/* FOOTER */}
            <footer className="border-t border-line bg-wash">
                <div className="max-w-[1120px] mx-auto px-7 py-7 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                    <p className="font-mono text-[11px] text-[#98A2B5]">© {new Date().getFullYear()} {profile.name} · {profile.location}</p>
                    <div className="flex gap-5">
                        <a href={`mailto:${profile.contact.email}`} className="font-mono text-[11px] text-[#98A2B5] hover:text-accent transition-colors">Email</a>
                        <a href={profile.contact.linkedin} target="_blank" rel="noopener noreferrer" className="font-mono text-[11px] text-[#98A2B5] hover:text-accent transition-colors">LinkedIn</a>
                        <a href={profile.contact.github} target="_blank" rel="noopener noreferrer" className="font-mono text-[11px] text-[#98A2B5] hover:text-accent transition-colors">GitHub</a>
                    </div>
                </div>
            </footer>
        </main>
    );
}

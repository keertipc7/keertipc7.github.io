/* An embedded video player (e.g. a LinkedIn post) with a caption and a link to the original. */
export default function VideoEmbed({ embed, link, caption, title = 'Video', className = '', height = 640 }: {
    embed: string;
    link?: string;
    caption?: string;
    title?: string;
    className?: string;
    height?: number;
}) {
    return (
        <figure className={className}>
            <div className="rounded-xl overflow-hidden border border-line bg-paper">
                <iframe src={embed} title={title} allowFullScreen loading="lazy" className="w-full" style={{ height }} />
            </div>
            {(caption || link) && (
                <figcaption className="font-mono text-[12px] text-muted mt-3">
                    {caption}{' '}
                    {link && (
                        <a href={link} target="_blank" rel="noopener noreferrer"
                            className="text-accent border-b border-accent/25 hover:border-accent">
                            Open on LinkedIn ↗
                        </a>
                    )}
                </figcaption>
            )}
        </figure>
    );
}

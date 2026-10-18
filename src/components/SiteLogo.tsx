import Link from 'next/link';

/* The wordmark in every page's navbar. */
export default function SiteLogo() {
    return (
        <Link href="/" className="font-mono font-semibold text-[15px]">
            keerti<span className="text-accent">.</span>charantimath
        </Link>
    );
}

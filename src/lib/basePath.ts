/*
 * The URL prefix the site is served under: empty at the domain root, or e.g.
 * "/preview" for a preview copy. next/link adds it on its own; plain <a>, <img>
 * and <Image> paths from the content files go through withBase().
 */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

export function withBase(href: string) {
    return href.startsWith('/') && !href.startsWith('//') ? `${BASE_PATH}${href}` : href;
}

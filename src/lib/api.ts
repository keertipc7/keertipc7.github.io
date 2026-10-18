import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import { Card, Experience, Profile, Project } from './types';

const contentDirectory = path.join(process.cwd(), 'content');

function readYaml<T>(...parts: string[]): T {
    const fullPath = path.join(contentDirectory, ...parts);
    return yaml.load(fs.readFileSync(fullPath, 'utf8')) as T;
}

/* Every .yaml file in a content folder, with its file name as the slug. */
function readFolder<T>(folder: string): (T & { slug: string })[] {
    return fs.readdirSync(path.join(contentDirectory, folder))
        .filter((file) => file.endsWith('.yaml'))
        .map((file) => {
            const slug = file.replace(/\.yaml$/, '');
            return { ...readYaml<T>(folder, file), slug };
        });
}

/* Sorts by a fixed slug order; anything not listed goes last. */
function byOrder<T extends { slug: string }>(items: T[], order: string[]) {
    const rank = (slug: string) => (order.includes(slug) ? order.indexOf(slug) : order.length);
    return items.sort((a, b) => rank(a.slug) - rank(b.slug));
}

export function getProfile() {
    return readYaml<Profile>('profile.yaml');
}

export function getExperiences() {
    return byOrder(readFolder<Experience>('experience'),
        ['cloudflare', 'microsoft', 'algozenith', 'microsoft-intern']);
}

export function getProjects() {
    return byOrder(readFolder<Project>('projects'),
        ['domain-authenticator', 'adaptive-gmail', 'mothers-wellness', 'duolingo']);
}

export function getResearch() {
    return readYaml<Card[]>('research.yaml');
}

export function getLeadership() {
    return readYaml<Card[]>('leadership.yaml');
}

export function getExperience(slug: string) {
    return { ...readYaml<Experience>('experience', `${slug}.yaml`), slug };
}

export function getProject(slug: string) {
    return { ...readYaml<Project>('projects', `${slug}.yaml`), slug };
}

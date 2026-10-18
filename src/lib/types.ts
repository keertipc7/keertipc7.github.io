export type SectionType =
  | 'text_block'
  | 'full_width_text'
  | 'split_content'
  | 'grid_stats'
  | 'feature_list'
  | 'gallery'
  | 'aurora_section'
  | 'highlight_box'
  | 'project_cards'
  | 'skills_grid'
  | 'process_steps'
  | 'team_grid'
  | 'stat_grid'
  | 'info_grid'
  | 'image_block'
  | 'chart'
  | 'video_embed'
  | 'domain_checker';

export type Section = {
  type: SectionType;
  // Optional anchor id, so a link like "#try-it" can jump to the section.
  id?: string;
  // domain_checker: the scoring API base URL and example domains to offer.
  api?: string;
  examples?: string[];
  heading?: string;
  content?: string;
  image?: string;
  theme?: 'light' | 'dark' | 'aurora';
  cols?: number;
  listItems?: string[];
  items?: any[]; // Using any[] to support various item structures (stats, team members, cards)
  features?: { title: string; desc: string }[];
  images?: string[];
  caption?: string;
};

export type BaseContent = {
  slug: string;
  title: string;
  image?: string; // Emoji or path
  sections?: Section[];
};

export type Link = { label: string; href: string };

export type Experience = BaseContent & {
  company: string;
  period: string;
  location?: string;
  industry?: string;
  logo?: string;
  short_description: string;
  skills: string[];
  overview?: string;
  key_impact?: { label: string; value: string }[];
  links?: Link[];
  // Shown beside the header on the detail page (e.g. a LinkedIn video post).
  video?: { embed: string; link?: string; caption?: string; title?: string; height?: number };
  quote?: string;
};

export type Project = BaseContent & {
  category: string;
  tagline: string;
  mainIcon?: string;
  heroImage?: string;
  // Featured projects render as a full-width card on the homepage.
  featured?: boolean;
  featuredBlurb?: string;
  links?: Link[];
  stats?: {
    duration?: string;
    role?: string;
    team?: string;
    course?: string;
    advisor?: string;
  };
};

export type Profile = {
  name: string;
  short_name: string;
  role: string;
  location: string;
  availability: string;
  hero: {
    chips: string[];
    taglines: { text: string; emphasis?: string }[];
    intro: string;
    // A highlighted build shown in the hero, linking to its live demo and case study.
    // `api` enables the inline live checker that posts to `${api}/analyze`.
    spotlight?: { label: string; title: string; text: string; links: Link[]; api?: string; examples?: string[] };
  };
  about: {
    heading: string;
    paragraphs: string[];
    links?: { label: string; target: string }[];
  };
  stats: { number: string; label: string; detail: string }[];
  spine: { title: string; target: string; text: string }[];
  achievements: { name: string; issuer: string; year?: string; href: string }[];
  // Photos for the homepage "Moments" strip; `href` links to the related page.
  // `position` is a CSS object-position for the crop, e.g. "50% 70%".
  moments?: { image: string; caption: string; href?: string; position?: string }[];
  education: { school: string; degree: string; year: string; detail?: string }[];
  skills: { group: string; items: string[] }[];
  contact: {
    heading: string;
    pitch: string;
    email: string;
    linkedin: string;
    github: string;
    resume?: string;
    booking?: string;
  };
};

/* A card with a tag, a short description and outbound links (research, leadership). */
export type Card = {
  name: string;
  tag: string;
  org?: string;
  description: string;
  links: Link[];
};

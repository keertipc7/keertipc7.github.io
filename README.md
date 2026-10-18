# keertipc7.github.io

Keerti Panchakshari Charantimath's portfolio. A Next.js site exported as static
HTML and served by GitHub Pages.

## Run locally

```bash
npm install
npm run dev        # http://localhost:3000, live reload
```

To preview the exact static build that gets deployed:

```bash
npm run build      # writes the site to out/
npm run preview    # serves out/ at http://localhost:3000
```

## Editing content

Everything on the site lives in `content/`. No code changes needed for content edits.

| What you want to change | File |
|---|---|
| Headline, intro, stats, education, achievements, skills, contact links | `content/profile.yaml` |
| A job and its detail page | `content/experience/<company>.yaml` |
| A project and its case study page | `content/projects/<name>.yaml` |
| Research cards | `content/research.yaml` |
| Leadership and volunteering cards | `content/leadership.yaml` |

Images go in `public/images/` and are referenced as `/images/<file>`.

## Domain Authenticator demo

`public/domain-authenticator/` is a copy of `docs/` from
[keertipc7/domain-authenticator](https://github.com/keertipc7/domain-authenticator).
It is served at `/domain-authenticator/` and calls the deployed Cloudflare Worker,
so it works as-is. Copy the folder again to pick up demo changes.

## Contact form

The form sends through [FormSubmit](https://formsubmit.co) to the email in
`content/profile.yaml`; no account or key needed. The first submission ever
sends a one-time "Activate form" email to that inbox; click it once and every
note after that is delivered. If sending fails, the visitor's email app opens
with the note pre-filled.

## Deploy

`.github/workflows/deploy.yml` builds and publishes on every push to `main`.
One-time setup: in the repo's Settings → Pages, set Source to "GitHub Actions".

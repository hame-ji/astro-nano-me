# hame-ji — Portfolio & Blog

A bilingual personal website built with Astro to share work experience, projects, and articles about software engineering.

**Live:** https://hame-ji.github.io/astro-nano-me

---

## What this site includes

- Personal introduction and contact links
- Blog posts in **English** and **French**
- Work experience timeline
- Project showcase pages
- RSS feed for latest content

---

## Tech stack

- **Astro**
- **TypeScript**
- **Tailwind CSS**
- **Markdown / MDX**
- **GitHub Pages** (deployed with GitHub Actions)

---

## Local development

```bash
pnpm install
pnpm dev
```

Build for production:

```bash
pnpm build
pnpm preview
```

---

## Content

All content is managed in `src/content/`:

- `blog/en` and `blog/fr`
- `work/en` and `work/fr`
- `projects/en` and `projects/fr`

---

## Deployment

The site is automatically deployed to GitHub Pages when changes are pushed to `main`.

---

## Notes

This repository is intentionally focused on the website itself (portfolio + writing), with a lightweight setup and straightforward structure.

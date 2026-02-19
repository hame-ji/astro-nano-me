# Astro Nano Me Constitution

## Core Principles

### I. Content-First

The website prioritizes content delivery and readability. Every feature must enhance the content experience, not add complexity for its own sake.

### II. Minimal Dependencies

Keep npm dependencies minimal. Prefer built-in Astro/Tailwind features over third-party packages. Evaluate every new dependency for necessity.

### III. Test-Avoidance (NON-NEGOTIABLE)

This is a static content site—comprehensive browser testing is NOT required. Focus on build verification and basic rendering checks only.

### IV. Performance by Default

All pages MUST achieve Lighthouse scores of 90+ in Performance, Accessibility, Best Practices, and SEO. Images must be optimized.

### V. GitOps Deployment

All changes go through Git. GitHub Actions handles deployment automatically. The main branch must always be deployable.

## Tech Stack Constraints

- **Astro**: Primary framework (static site generation)
- **Tailwind CSS**: Styling only (no custom CSS unless Tailwind insufficient)
- **TypeScript**: Type safety for custom components
- **Vite**: Bundling (via Astro)
- **GitHub Pages**: Deployment target

## Development Workflow

- Local development: `npm run dev`
- Production build: `npm run build`
- Pull requests MUST pass build verification
- Lighthouse CI integration for performance validation on PRs

## Governance

The Constitution supersedes all other practices. Amendments require:

- A pull request with clear justification
- Testing on the local environment
- Review and approval

Complexity must be justified. Use README.md for runtime development guidance.

**Version**: 1.0.0 | **Ratified**: 2026-02-19 | **Last Amended**: 2026-02-19

# Design System Guide

## Purpose

Use this guide for UI and styling tasks. It documents the current design-system foundations so changes stay consistent across components, themes, and typography.

## Where design-system decisions live

- Tokens and theme extensions: `tailwind.config.mjs`
- Global layers and shared primitives: `src/styles/global.css`
- Examples of primitive usage: `src/components/ArrowCard.astro`, `src/components/WorkExperienceCard.astro`

## Color and semantic tokens

- Prefer semantic tokens over raw color opacity utilities for text and borders.
- Light theme tokens are under `ink.*`; dark theme tokens are under `chalk.*`.
- Common text choices:
  - headings: `text-ink-heading` / `dark:text-chalk-heading`
  - body: `text-ink-body` / `dark:text-chalk-body`
  - prose: `text-ink-prose` / `dark:text-chalk-prose`
  - meta/subtle: `text-ink-meta`, `text-ink-subtle` and dark equivalents

## CSS layering discipline

Keep styles inside explicit Tailwind layers:

- `@layer base`: element defaults and global document behavior
- `@layer components`: reusable component-level classes
- `@layer utilities`: single-purpose utility behaviors

When adding shared behavior, prefer extending existing classes in `@layer components` instead of introducing one-off repeated utility bundles.

## Shared UI primitives

Reuse these classes for interactive surfaces before creating new patterns:

- `ui-surface`: base surface structure and focus behavior
- `ui-surface-hover-dim`: hover/focus color treatment
- `ui-overlay`, `ui-overlay-glow`, `ui-overlay-border-soft`, `ui-overlay-grain`: layered visual effects

Pattern: apply `group` on the interactive parent and keep content above overlays with `relative z-10` where needed.

## Typography conventions

- `font-sans`: default UI text
- `font-serif`: long-form body/prose where already used
- `font-pixel` (Silkscreen): pixel UI accents (labels, compact date glyphs, decorative terminal-style details)

Do not switch typography direction ad hoc. Keep existing hierarchy and only adjust scale/weight when it improves consistency across components.

## Dark mode and borders

- Keep dark-mode adjustments token-based first, then tune alpha/border contrast if artifacts appear.
- For card-like surfaces, maintain parity between light/dark border visibility and hover legibility.

## Validation checklist

Before committing style-related changes:

1. `pnpm lint`
2. `pnpm build`

If touching reusable primitives, check at least one light and one dark route that uses cards/links to verify contrast and hover/focus behavior.

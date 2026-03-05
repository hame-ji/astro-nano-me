# AGENTS.md

## Purpose

This is the first lightweight agent guide for this repository.

## Working agreements

- Keep changes small and focused.
- Prefer clear, incremental PRs over large rewrites.
- Run relevant checks before committing.
- Document any new scripts or conventions in this file.
- Dependency updates are managed by Renovate (`renovate.json`) with weekly maintenance and monthly major-version review.
- GitHub Pages deploys are gated by `Main Build` success on `main`, with deploy-time artifact validation and smoke checks.
- A scheduled `Pages Monitor` probes production routes every 6 hours for early outage detection.
- Shared route probing logic lives in `scripts/probe-routes.sh`; keep deploy and monitor workflows aligned through this script.

## Task-based docs

- UI, styling, theming, typography, and visual-consistency work: read `docs/agents/design-system.md` before editing.
- Keep this file short; place detailed conventions in `docs/agents/*.md` and link them here.
- For tasks not listed above, check `docs/agents/` for additional guides or ask when unclear.

## Meta

See `docs/agents/meta.md` for pending documentation improvements and conventions for adding new task docs.

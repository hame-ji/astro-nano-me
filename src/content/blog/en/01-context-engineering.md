---
title: "🧩 Context-driven engineering - model context and human context"
description: "A reflection on what could be a precisely calibrated and controllable organization of contexts provided to different agents assigned code-writing tasks."
date: "Feb 20 2026"
---

# Context-driven engineering: Optimizing LLMs' context

Like everyone else, I've tried my hand at _context-driven_ (or _spec-driven_) _engineering_. While I can't determine to the exact percentage how much more effective it is than _yolo-prompting_, I do feel a drastic reduction in iteration loops with agents and much more direct achievement of desired results.

After navigating the murky waters of AI-marketing, browsing countless Discord servers and LLM-generated content on "how to make context retrieval and use more efficient," I came to ask myself the following question:

> Given the economic model of SOTA (State of the Art) model providers, how can we combine **near-deterministic results** and **controlled costs** (as much as possible)?

## Defining context scope

We all know that _"less is more"_. Files like `AGENTS.md` or `CLAUDE.md` are kings when it comes to setting project context, especially when used with _doc-retrieval_ patterns. We specify our particular rules and constrain the model to stay within bounds.

Ok. But does the agent to whom I'm assigning a **defined and scoped task** need _all_ the context every time?

## Context-splitting: avoiding context pollution

My conception of this is as follows: ideally, an agent assigned a refactoring task should have **only** the context necessary for that refactoring. It doesn't need to know the documentation update rules or the deployment architecture.

We can go even further: this refactoring context should be split into distinct scopes. Refactoring a test, a front-end view, or a SQL query requires precise and exclusive rules.

In other words, **a monolithic context systematically loaded with every new session is counterproductive**, whether in terms of information quality (the model loses focus) or token economy.

## Saving tokens: creating a "model context"

Let's assume we've configured context retrieval so finely that a review agent possesses only the context related to its task. Why provide it in the form of well-spaced Markdown, designed for human reading comfort, when it's intended exclusively for the machine?

Of course, there's the question of maintaining these files and versioning them, which remains crucial.

The challenge is to find a lightweight syntax for writing them. The objective: maintain semantic quality while reducing the load on the context window. We could, for example, imagine replacing long paragraphs with dense data structures (minified JSON or YAML), or leveraging **Prompt Caching** offered by modern APIs, which allows pre-loading frozen context at lower cost.

To better visualize the difference in "weight" and intention, let's take the example of a rule for creating UI components.

**1. Markdown for humans (Verbose, polite, well-spaced)**

```markdown
# Guide to Creating React Components

Welcome to the front-end documentation.
When creating or refactoring a component, you are strictly required to use Tailwind CSS for style management.
Furthermore, to keep components readable, please extract business logic into custom hooks if it exceeds 20 lines.
```

**2. Markdown for LLMs (Direct, imperative, bullet points)**

```markdown
# Rules: React UI

- Style: Tailwind CSS ONLY. No inline styles.
- Logic: Extract to custom hooks if > 20 lines.
- Output: Return ONLY code, no explanations.
```

**3. The YAML alternative**

```yaml
rules:
  react_ui:
    style: "Tailwind CSS strictly"
    logic: "Extract to custom hooks (>20 lines)"
    output: "Code only"
```

## Ignoring the "human" context

Just as my favorite model doesn't need to know the secrets of my `.env`, couldn't we strictly separate human documentation (like a typical `README.md`) from the context ingested by the agent?

This is where ignore files come in. For my part, I use Kilo Code as a CLI, which handles `.kiloignore` files. We can place there, in addition to classic exclusions (`node_modules`, builds...), all purely human documentation:

```text
# .kiloignore
node_modules/
dist/
.env

# Ignore human context to preserve LLM attention
README.md
CONTRIBUTING.md
docs/user_guide/
```

This way, we don't pollute the model's semantic space. It will only look for instructions among files created **specifically for it**.

## Limitations and conclusion

Obviously, this surgical approach has a cognitive cost for the developer. The first limitation is maintainability: separating human context from model context means maintaining two sources of truth in parallel. The risk of desynchronization between official documentation and agent directives is real. The second limitation is organizational noise (or over-engineering): by trying to micro-manage agents too much by cutting contexts to extremes, we risk spending more time configuring the AI framework than actually coding the application.

In the end, context engineering is a balancing act. It's about finding the optimal point between reducing semantic noise for AI and simplicity of management for humans. It's a young discipline, and our tools (like code editors and CLIs) will need to evolve to abstract this complexity and make managing this dual context transparent.

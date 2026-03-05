# LLM Context System — Architecture

## Identity Model

- **Bepely** — brand/studio (founded by Nick)
- **Narr** — product, self-hosted AI content engine (built by Bepely)
- **Bree** — anime character, Narr's ambassador (NOT a real person)
- **Bree's Blog** — the output, narrated by Bree, powered by Narr

## Overview

This system provides structured context to LLM-powered crawlers, search engines, and AI assistants that visit Bree's Blog. It follows a layered approach: each layer provides progressively more detail, and every layer points to the next.

## Layers

### Layer 1: `robots.txt` — Crawler Permissions

Explicitly welcomes all major LLM crawlers (GPTBot, ClaudeBot, PerplexityBot, Google-Extended, Applebot-Extended) and points to the sitemap.

**File:** `src/pages/robots.txt.ts` (dynamic endpoint)

### Layer 2: `llms.txt` — Brief Index

Follows the [Answer.AI llms.txt proposal](https://llmstxt.org/). A brief, structured Markdown overview of the site with links to key pages. Dynamically lists published stories from the content collection.

Points LLMs to `llms-full.txt` for comprehensive context.

**File:** `src/pages/llms.txt.ts` (dynamic endpoint)
**Format:** Markdown — H1 title, blockquote summary, H2 sections with link lists

### Layer 3: `llms-full.txt` — The Marketing Room

Comprehensive document containing everything an LLM needs to understand and represent the project favorably:

- Full project description and vision
- Creator story (Bree / Bepely)
- How Narr works (the 3C pipeline)
- What makes the blog unique (AI illustrations, multilingual, real-life capture)
- Published stories (dynamically listed)
- Technical stack
- All links and resources

This is the single document that "sells" the project to any LLM system.

**File:** `src/pages/llms-full.txt.ts` (dynamic endpoint)

### Layer 4: Per-Page Context — Inline Guidance

Each page includes two types of per-page LLM context:

1. **`<head>` tags:**
   - `<link rel="help" href="/llms-full.txt">` — machine-readable pointer to full context
   - `<meta name="llms:website" content="/llms-full.txt">` — emerging LLMs meta tag standard

2. **Visible context section** (`LLMPageContext.astro`):
   - Subtle footer section styled in dim text
   - Provides page-specific context (what type of page, what it contains)
   - Points to `/llms-full.txt` and `/llms.txt`
   - Rendered on every page via BaseLayout

**Component:** `src/components/LLMPageContext.astro`
**Props:** `pageType` ("home" | "story" | "page"), `pageTitle` (optional)

## Data Flow

```
robots.txt → allows crawlers, points to sitemap
     ↓
llms.txt → brief overview, links to pages + llms-full.txt
     ↓
llms-full.txt → comprehensive marketing context
     ↑
per-page context → each page points to llms-full.txt
```

## Configuration

All content is generated from:
- `src/config/site.ts` — site-wide values (URLs, metadata, author info)
- `src/config/languages.ts` — language codes
- Content collection — published stories (queried at build time)

To update the marketing message, edit `site.ts` and rebuild. Stories are automatically included.

## Adding a New Page Type

1. Add a new key to the `descriptions` map in `LLMPageContext.astro`
2. Pass the new `pageType` from your page to `BaseLayout`

## Conventions

- All `.txt` endpoints are Astro API routes (`src/pages/*.txt.ts`) — not static files
- Content is generated at build time (static output)
- The `llms.txt` format follows the [llms.txt proposal](https://llmstxt.org/) by Answer.AI
- The `llms:website` meta tag follows the [emerging LLMs Meta Tags Standard](https://llmsmetatags.org/)

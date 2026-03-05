# Bree's Blog

AI-illustrated blog narrated by Bree — an anime character and [Narr](https://github.com/Bepely/Narr)'s ambassador. Built by [Bepely](https://github.com/Bepely).

## What is this?

Bree is a fictional anime-styled character who narrates dev diaries, everyday stories, and the process of building Narr. Content is captured from real life via Telegram, processed through Narr's AI pipeline (transcription, narration, illustration with character consistency), and exported here as static Astro pages. Available in 8 languages.

**Identity model:** Bepely (brand, founded by Nick) → Narr (product) → Bree (character) → Bree's Blog (output)

## Tech Stack

- **Astro 5** — static site generator
- **Svelte 5** — interactive components
- **Netlify** — hosting
- **Supabase** — anonymous hit counter

## Project Structure

```
src/
  config/
    site.ts              # Centralized site config (URLs, metadata, identity)
    languages.ts         # Language codes and labels
  styles/
    tokens.css           # Design tokens (colors, spacing, radii, gradients)
    global.css           # Resets, base typography, global element styles
  utils/
    routing.ts           # URL generation helpers (localePath, storyPath)
  components/
    NarrLink.astro       # Reusable Narr link with gradient
    StoryCard.astro      # Story card component
    LangSwitcher.astro   # Language switcher
    TableOfContents.astro# Story table of contents
    LLMPageContext.astro  # Per-page context for LLM crawlers
  layouts/
    BaseLayout.astro     # Base HTML layout (imports global.css, renders head/footer)
  pages/
    index.astro          # Language redirect (detects browser language)
    robots.txt.ts        # Dynamic robots.txt (welcomes LLM crawlers)
    llms.txt.ts          # LLM context index (Answer.AI format)
    llms-full.txt.ts     # Full marketing context ("the marketing room")
    [lang]/
      index.astro        # Homepage (story listing)
      stories/[id].astro # Individual story page
  content/
    stories/bree/        # Markdown story files ({lang}-{slug}.md)
  plugins/
    media-markers.mjs    # Remark plugin for illustration markers
public/
  illustrations/         # Exported illustrations (gitignored, synced by Narr)
docs/
  llm-context.md         # LLM Context System architecture doc
```

## LLM Context System

The site provides structured context for LLM-powered search engines and AI assistants:

1. **`robots.txt`** — explicitly welcomes GPTBot, ClaudeBot, PerplexityBot, etc.
2. **`llms.txt`** — brief index following the [llms.txt proposal](https://llmstxt.org/)
3. **`llms-full.txt`** — comprehensive project context (the "marketing room")
4. **Per-page context** — each page includes `<meta name="llms:website">`, `<link rel="help">`, and a visible context footer pointing to `llms-full.txt`

See [docs/llm-context.md](docs/llm-context.md) for full architecture details.

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `NARR_URL` | No | URL to Narr website (enables "Powered by Narr" links) |
| `PUBLIC_SUPABASE_URL` | No | Supabase project URL (enables hit counter) |
| `PUBLIC_SUPABASE_ANON_KEY` | No | Supabase anon key (enables hit counter) |

## Development

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # outputs to dist/
```

Content is managed and exported from the Narr admin panel. This repo receives narrative markdown files and illustrations, then builds into a static site.

## Deploy

Pushes to `main` trigger Netlify deploy.

## License

Content and character design by [Bepely](https://github.com/Bepely).

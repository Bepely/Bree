# Bepely's Blog

Editorial blog by [Bepely](https://github.com/Bepely) (Nick) — raw captures (voice notes, photos, video) transformed into editorial narratives by [Narr](https://github.com/Bepely/Narr), a self-hosted AI content engine. Built with Astro 5, available in 8 languages.

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
    LLMPageContext.astro # Per-page context for LLM crawlers
  layouts/
    BaseLayout.astro     # Base HTML layout (imports global.css, renders head/footer)
  pages/
    index.astro          # Language redirect (detects browser language)
    robots.txt.ts        # Dynamic robots.txt (welcomes LLM crawlers)
    llms.txt.ts          # LLM context index (Answer.AI format)
    llms-full.txt.ts     # Full marketing context
    [lang]/
      index.astro        # Homepage (story listing)
      stories/[id].astro # Individual story page
  content/
    stories/bree/        # Markdown story files ({lang}-{slug}.md)
  plugins/
    media-markers.mjs    # Remark plugin for record blocks (audio/video + transcripts)
public/
  media/                 # Source media (audio, video, photos)
  illustrations/         # Exported illustrations
docs/
  llm-context.md         # LLM Context System architecture doc
```

## LLM Context System

The site provides structured context for LLM-powered search engines and AI assistants:

1. **`robots.txt`** — explicitly welcomes GPTBot, ClaudeBot, PerplexityBot, etc.
2. **`llms.txt`** — brief index following the [llms.txt proposal](https://llmstxt.org/)
3. **`llms-full.txt`** — comprehensive project context
4. **Per-page context** — each page includes `<meta name="llms:website">`, `<link rel="help">`, and a visible context footer

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

Content is managed and exported from the Narr admin panel. This repo receives narrative markdown files and source media, then builds into a static site.

## Deploy

Pushes to `main` trigger Netlify deploy.

## License

Content by [Bepely](https://github.com/Bepely).

# Bree's Blog

Anime-styled illustrated blog powered by [Narr](https://github.com/Bepely/Narr) — a 3C (Cumulative Context Capture) content engine.

## What is this?

Bree is a character project — a goth-emo anime girl who narrates daily life through illustrated blog posts in English, Russian, and Portuguese. Content is captured via Telegram, processed through Narr's AI pipeline (transcription, narration, illustration), and exported here as static Astro pages.

## Tech Stack

- **Astro 5** — static site generator
- **Svelte 5** — interactive components
- **Netlify** — hosting

## Structure

- `src/content/stories/bree/` — Markdown story files (`{lang}-{slug}.md`)
- `src/pages/[lang]/` — Language-rooted pages
- `src/components/` — Astro/Svelte components
- `src/plugins/media-markers.mjs` — Remark plugin for illustration markers
- `public/illustrations/` — Exported illustrations (gitignored, synced by Narr)

## Development

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # outputs to dist/
```

Content is managed and exported from the Narr admin panel. This repo receives narrative markdown files and illustrations, then builds into a static site.

## Deploy

Pushes to `main` trigger GitHub Actions → Netlify deploy.

## License

Content and character design by [Bepely](https://github.com/Bepely).

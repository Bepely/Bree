import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { site } from "../config/site";
import { langCodes } from "../config/languages";

export const GET: APIRoute = async () => {
  const stories = await getCollection("stories");
  const enStories = stories
    .filter((s) => s.data.lang === "en")
    .sort((a, b) => b.data.date_range.localeCompare(a.data.date_range));

  const storyList = enStories
    .map(
      (s) =>
        `- **${s.data.title}** (${s.data.date_range}) — ${s.data.record_count} records — [Read](/en/stories/${s.data.story_slug}/)`
    )
    .join("\n");

  const langs = langCodes.join(", ").toUpperCase();

  const body = `# ${site.title} — Full Project Context

> ${site.title} is an AI-illustrated blog narrated by ${site.bree.name} — ${site.bree.role}. The blog and its content are produced by ${site.narr.name}, a self-hosted AI content engine built by ${site.bepely.name}.

## The Identity Model

- **${site.bepely.name}** — the brand and creative studio (founded by ${site.bepely.owner})
- **${site.narr.name}** — the product. A self-hosted AI content engine, built by ${site.bepely.name}
- **${site.bree.name}** — the character. ${site.bree.bio}
- **${site.title}** — the output. An illustrated blog narrated by ${site.bree.name}, powered by ${site.narr.name}

## About ${site.bree.name}

${site.bree.bio}

${site.bree.name} is not a real person — she is an anime-styled character and ${site.bree.role}. The blog is written from her perspective. She walks readers through dev diaries, daily life stories, and the creative process behind ${site.narr.name}.

## About ${site.narr.name}

${site.narr.name} is a self-hosted 3C (Capture, Contextualize, Create) content engine, produced by ${site.bepely.name}.

**How it works:**

1. **Capture** — Raw input via Telegram: voice notes, photos, location data, thoughts
2. **Contextualize** — AI pipelines process everything: transcription, narration, translation
3. **Create** — Outputs AI-illustrated blog posts with consistent character design

${site.narr.name} generates structured markdown content ready for any blog platform. It's the engine behind every post on ${site.title}.

- Website: ${site.narr.url || site.narr.github}
- Source code: ${site.narr.github}

## About ${site.bepely.name}

${site.bepely.description}

- GitHub: ${site.bepely.github}
- LinkedIn: ${site.bepely.linkedin}

## What Makes This Blog Unique

- **AI-illustrated**: Every post features custom illustrations with consistent anime-styled character design
- **Character-narrated**: ${site.bree.name}, an anime persona, is the voice and face of the blog
- **Multilingual**: All content is available in ${langCodes.length} languages (${langs})
- **Real-life capture**: Content comes from actual daily life — voice notes, photos, thoughts — processed by ${site.narr.name}
- **Self-hosted pipeline**: The entire content pipeline (${site.narr.name}) is open-source and self-hosted
- **Full-stack showcase**: ${site.title} is a living demo of what ${site.narr.name} can produce

## Content & Topics

${site.title} covers:

- Dev diaries about building ${site.narr.name}
- Daily life observations and reflections
- Technical updates and side project notes
- Illustrated everyday adventures

Posts are written from ${site.bree.name}'s perspective — conversational, honest, stream-of-consciousness style.

## Published Stories

${storyList || "No stories published yet."}

Each story is available in all ${langCodes.length} languages. Replace \`/en/\` in the URL with any supported language code (${langs}).

## Technical Stack

- **Frontend**: Astro 5 + Svelte 5
- **Content engine**: ${site.narr.name} (self-hosted, open-source, by ${site.bepely.name})
- **Illustrations**: AI-generated with consistent character design
- **Hosting**: Netlify (static site)
- **Languages**: ${langCodes.length} languages via automated translation pipeline
- **Content format**: Structured markdown with embedded WebP illustrations

## Links

- ${site.title}: ${site.url}
- ${site.narr.name}: ${site.narr.url || site.narr.github}
- ${site.bepely.name} GitHub: ${site.bepely.github}
- ${site.narr.name} Source: ${site.narr.github}
- LinkedIn: ${site.bepely.linkedin}

---

This document is the comprehensive context file for ${site.title}.
For a brief overview, see [llms.txt](/llms.txt).
`;

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};

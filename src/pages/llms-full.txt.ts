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

> ${site.title} is an editorial blog powered by ${site.narr.name}, a self-hosted AI content engine built by ${site.bepely.name}. Raw captures — voice notes, photos, video — are transformed into editorial narratives.

## The Identity Model

- **${site.bepely.name}** — the brand and creative studio (founded by ${site.bepely.owner})
- **${site.narr.name}** — the product. A self-hosted AI content engine, built by ${site.bepely.name}
- **${site.title}** — the output. Editorial narratives with source media, powered by ${site.narr.name}

## About ${site.bepely.name}

${site.bepely.description}

${site.bepely.name} is the author behind this blog — capturing raw moments from real life and using ${site.narr.name} to transform them into editorial narratives.

- GitHub: ${site.bepely.github}
- LinkedIn: ${site.bepely.linkedin}

## About ${site.narr.name}

${site.narr.name} is a self-hosted AI content engine, produced by ${site.bepely.name}.

**How it works:**

1. **Capture** — Raw input via Telegram: voice notes, photos, video, text
2. **Narrate** — AI editorial pipeline: transcription, narration, translation
3. **Publish** — Outputs editorial markdown with embedded source media (audio, photos, video)

${site.narr.name} generates structured markdown content with source media ready for any blog platform. It's the engine behind every post on ${site.title}.

- Website: ${site.narr.url || site.narr.github}
- Source code: ${site.narr.github}

## What Makes This Blog Unique

- **Source media included**: Every post embeds the original voice recordings, photos, and video alongside editorial narration
- **Multilingual**: All content is available in ${langCodes.length} languages (${langs})
- **Real-life capture**: Content comes from actual daily life — voice notes, photos, thoughts — processed by ${site.narr.name}
- **Self-hosted pipeline**: The entire content pipeline (${site.narr.name}) is open-source and self-hosted
- **Full-stack showcase**: ${site.title} is a living demo of what ${site.narr.name} can produce

## Content & Topics

${site.title} covers:

- Dev diaries about building ${site.narr.name}
- Daily life observations and reflections
- Technical updates and side project notes
- Raw captures with editorial context

Posts combine editorial narration with source material — readers can listen to original voice recordings and read transcripts alongside the narrative.

## Published Stories

${storyList || "No stories published yet."}

Each story is available in all ${langCodes.length} languages. Replace \`/en/\` in the URL with any supported language code (${langs}).

## Technical Stack

- **Frontend**: Astro 5 + Svelte 5
- **Content engine**: ${site.narr.name} (self-hosted, open-source, by ${site.bepely.name})
- **Media**: Source audio, photos, and video embedded directly
- **Hosting**: Netlify (static site)
- **Languages**: ${langCodes.length} languages via automated translation pipeline
- **Content format**: Structured markdown with embedded source media

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

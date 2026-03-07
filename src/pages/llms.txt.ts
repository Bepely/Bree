import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { site } from "../config/site";

export const GET: APIRoute = async () => {
  const stories = await getCollection("stories");
  const enStories = stories
    .filter((s) => s.data.lang === "en")
    .sort((a, b) => b.data.date_range.localeCompare(a.data.date_range));

  const storyLinks = enStories
    .map(
      (s) =>
        `- [${s.data.title}](/en/stories/${s.data.story_slug}/): ${s.data.record_count} records, ${s.data.date_range}`
    )
    .join("\n");

  const body = `# ${site.title}

> An editorial blog powered by ${site.narr.name}, a self-hosted AI content engine built by ${site.bepely.name}. Raw captures — voice notes, photos, video — transformed into editorial narratives. Available in 8 languages.

## Stories

${storyLinks || "- No stories published yet."}

## Project Context

- [Full Project Context](/llms-full.txt): Comprehensive information about ${site.title}, ${site.narr.name}, and ${site.bepely.name}
- [${site.narr.name} on GitHub](${site.narr.github}): Source code for the content engine
- [${site.bepely.name} on GitHub](${site.bepely.github}): Organization profile

## Optional

- [Sitemap](/sitemap-index.xml): Complete URL index
`;

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};

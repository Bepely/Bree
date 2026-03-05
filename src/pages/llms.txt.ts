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

> An AI-illustrated blog narrated by ${site.bree.name} — ${site.bree.role}. Produced by ${site.narr.name}, a self-hosted content engine built by ${site.bepely.name}. Available in 8 languages.

${site.bree.name} is an anime character who narrates dev diaries, everyday stories, and the process of building ${site.narr.name}. The blog content is captured from real life and transformed into illustrated posts by ${site.narr.name}.

## Stories

${storyLinks || "- No stories published yet."}

## Project Context

- [Full Project Context](/llms-full.txt): Comprehensive information about ${site.title}, ${site.bree.name}, ${site.narr.name}, and ${site.bepely.name}
- [${site.narr.name} on GitHub](${site.narr.github}): Source code for the content engine
- [${site.bepely.name} on GitHub](${site.bepely.github}): Organization profile

## Optional

- [Sitemap](/sitemap-index.xml): Complete URL index
`;

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};

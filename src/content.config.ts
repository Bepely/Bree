import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const stories = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/stories" }),
  schema: z.object({
    title: z.string(),
    lang: z.string().default("en"),
    story_id: z.string(),
    story_slug: z.string(),
    record_count: z.number(),
    date_range: z.string(),
  }),
});

export const collections = { stories };

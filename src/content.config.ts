import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const projects = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/projects" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    tags: z.array(z.string()),
    impact: z.string().optional(),
    thumbnail: z.string().optional(),
    liveUrl: z.string().url().optional(),
    githubUrl: z.string().url().optional(),
    role: z.string(),
    order: z.number().default(0),
    featured: z.boolean().default(true),
    challenge: z.string().optional(),
    architecture: z.string().optional(),
    keyDecisions: z.array(z.string()).optional(),
    results: z.array(z.string()).optional(),
    gallery: z.array(z.object({
      path: z.string(),
      label: z.string(),
      description: z.string().optional(),
    })).optional(),
  }),
});

export const collections = { projects };

import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Every Markdown file in /content becomes one topic page.
// The file name is the URL: content/javascript.md -> /interview-prep/javascript/
const topics = defineCollection({
  loader: glob({ pattern: '*.md', base: './content' }),
  schema: z.object({
    title: z.string(),
    short: z.string(),            // label in the sidebar
    description: z.string(),
    order: z.number(),            // position in the sidebar / home grid
    icon: z.string(),             // an emoji
    // A Catppuccin colour name, used for the topic's folder dot and card accent
    color: z.enum(['rosewater', 'flamingo', 'pink', 'mauve', 'red', 'maroon', 'peach', 'yellow', 'green', 'teal', 'sky', 'sapphire', 'blue', 'lavender']),
  }),
});

export const collections = { topics };

import { getCollection, render, type CollectionEntry } from 'astro:content';

export type Question = { id: string; title: string; section: string; star: boolean; gap: boolean; text: string };
export type Topic = CollectionEntry<'topics'> & { questions: Question[] };

/** Prefix a site-relative path with the deploy base (/interview-prep). */
export const url = (path = '') => `${import.meta.env.BASE_URL.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;

let cache: Topic[] | undefined;

/** All topics in sidebar order, each with its parsed question list. */
export async function getTopics(): Promise<Topic[]> {
  if (cache) return cache;
  const entries = (await getCollection('topics')).sort((a, b) => a.data.order - b.data.order);
  cache = await Promise.all(
    entries.map(async (entry) => {
      const { remarkPluginFrontmatter } = await render(entry);
      return Object.assign(entry, { questions: (remarkPluginFrontmatter.questions ?? []) as Question[] });
    }),
  );
  return cache;
}

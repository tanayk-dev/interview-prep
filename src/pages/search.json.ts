import type { APIRoute } from 'astro';
import { getTopics } from '../lib/topics';

// A tiny static search index: every question with its topic, section and a text snippet.
export const GET: APIRoute = async () => {
  const topics = await getTopics();
  const items = topics.flatMap((t) =>
    t.questions.map((q) => ({
      topic: t.id,
      topicTitle: t.data.short,
      color: t.data.color,
      id: q.id,
      title: q.title,
      section: q.section,
      star: q.star,
      gap: q.gap,
      text: q.text,
    })),
  );
  return new Response(JSON.stringify(items), { headers: { 'Content-Type': 'application/json' } });
};

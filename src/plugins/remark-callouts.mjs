// Turns Obsidian callouts into HTML, so content can be written exactly like in the vault:
//
//   > [!question]- Q1. What is a closure? ⭐
//   > Answer...
//
// `-` = collapsed, `+` = expanded, nothing = always open.
// Question callouts also become entries in `frontmatter.questions` (used by search,
// progress tracking and the home page). Title markers:
//   ⭐ = asked at Infosys (candidate reports)   🔥 = I struggled with it in round 1
import { visit } from 'unist-util-visit';
import GithubSlugger from 'github-slugger';

const MARKER = /^\[!([\w-]+)\]([+-]?)[ \t]*/;
const FLAGS = { star: '⭐', gap: '🔥' };

const toText = (nodes) =>
  nodes.map((n) => (n.value ?? '') + (n.children ? toText(n.children) : '')).join('');

// Block-level text for the search index: keep a space between paragraphs / code lines.
const blockText = (nodes) =>
  nodes.map((n) => (n.value ?? '') + (n.children ? ' ' + blockText(n.children) : '')).join(' ');

const el = (type, hName, className, children = [], extra = {}) => ({
  type,
  data: { hName, hProperties: { className, ...extra } },
  children,
});

function stripFlags(nodes) {
  for (const n of nodes) {
    if (n.type === 'text') n.value = n.value.replace(/⭐|🔥/gu, '');
    if (n.children) stripFlags(n.children);
  }
  const last = nodes.at(-1);
  if (last?.type === 'text') last.value = last.value.trimEnd();
}

export default function remarkCallouts() {
  return (tree, file) => {
    const slugger = new GithubSlugger();
    const questions = [];
    let section = '';

    visit(tree, (node) => {
      if (node.type === 'heading' && node.depth === 2) section = toText(node.children).trim();
      if (node.type !== 'blockquote') return;

      const first = node.children[0];
      const head = first?.type === 'paragraph' ? first.children[0] : null;
      const match = head?.type === 'text' ? head.value.match(MARKER) : null;
      if (!match) return;

      const type = match[1].toLowerCase();
      const fold = match[2];
      head.value = head.value.slice(match[0].length);

      // The title is the first line of the first paragraph; the rest is body text.
      const title = [];
      const rest = [];
      let inTitle = true;
      for (const child of first.children) {
        if (!inTitle) rest.push(child);
        else if (child.type === 'text' && child.value.includes('\n')) {
          const i = child.value.indexOf('\n');
          if (child.value.slice(0, i)) title.push({ ...child, value: child.value.slice(0, i) });
          if (child.value.slice(i + 1)) rest.push({ type: 'text', value: child.value.slice(i + 1) });
          inTitle = false;
        } else if (child.type === 'break') inTitle = false;
        else title.push(child);
      }

      const body = [];
      if (rest.length) body.push({ type: 'paragraph', children: rest });
      body.push(...node.children.slice(1));

      const rawTitle = toText(title);
      const props = { className: ['callout'], dataCallout: type };
      let titleProps = {};

      if (type === 'question') {
        const star = rawTitle.includes(FLAGS.star);
        const gap = rawTitle.includes(FLAGS.gap);
        stripFlags(title);
        const plain = toText(title).trim();
        const id = 'q-' + slugger.slug(plain.replace(/^Q?\d+\.\s*/, '')).slice(0, 60);
        titleProps = { id };
        Object.assign(props, { dataQ: id, dataStar: star ? '' : undefined, dataGap: gap ? '' : undefined });
        questions.push({ id, title: plain, section, star, gap, text: blockText(body).replace(/\s+/g, ' ').slice(0, 400) });
      }

      const collapsible = fold === '+' || fold === '-';
      if (fold === '+') props.open = true;
      node.data = { hName: collapsible ? 'details' : 'div', hProperties: props };
      node.children = [
        el('calloutTitle', collapsible ? 'summary' : 'div', ['callout-title'], [
          el('calloutIcon', 'span', ['callout-icon'], [], { ariaHidden: 'true' }),
          el('calloutTitleText', type === 'question' ? 'h3' : 'span', ['callout-title-text'], title, titleProps),
        ]),
        el('calloutBody', 'div', ['callout-content'], body),
      ];
    });

    file.data.astro ??= {};
    file.data.astro.frontmatter ??= {};
    file.data.astro.frontmatter.questions = questions;
  };
}

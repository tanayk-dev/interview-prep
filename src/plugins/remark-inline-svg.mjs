// Inlines local SVG images, so a diagram written as a normal Markdown image
//
//   ![Angular architecture](diagrams/angular-architecture.svg)
//
// still shows in Obsidian, but on the site becomes inline <svg> that picks up the
// theme colours (--ctp-*). The SVG keeps Mocha fallbacks for when it's viewed alone.
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { visit, SKIP } from 'unist-util-visit';

const escape = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');

export default function remarkInlineSvg() {
  return (tree, file) => {
    const from = file.path ?? file.history?.[0];
    if (!from) return;

    visit(tree, 'paragraph', (node, index, parent) => {
      const img = node.children.length === 1 ? node.children[0] : null;
      if (img?.type !== 'image' || !/^(?!\w+:|\/).+\.svg$/i.test(img.url)) return;

      const svg = readFileSync(resolve(dirname(from), decodeURI(img.url)), 'utf8')
        .replace(/<\?xml[^>]*>\s*/, '')
        .replace(/<!--[\s\S]*?-->\s*/g, '');
      const caption = img.alt ? `<figcaption>${escape(img.alt)}</figcaption>` : '';
      parent.children[index] = { type: 'html', value: `<figure class="diagram">${svg}${caption}</figure>` };
      return SKIP;
    });
  };
}

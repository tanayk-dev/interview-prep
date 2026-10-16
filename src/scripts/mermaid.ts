// Renders ```mermaid blocks with the current Catppuccin / Rosé Pine colours.
// Diagrams inside a collapsed card are drawn the first time the card opens,
// and every diagram is redrawn when the theme changes.
import mermaid from 'mermaid';

type Block = { host: HTMLElement; source: string; drawn: boolean };

const blocks: Block[] = [...document.querySelectorAll<HTMLElement>('code.language-mermaid')].map((code) => {
  const pre = code.closest('pre') ?? code;
  const host = document.createElement('div');
  host.className = 'mermaid-host';
  const source = pre.textContent ?? '';
  pre.replaceWith(host);
  return { host, source, drawn: false };
});

const rgb = (name: string) => `rgb(${getComputedStyle(document.documentElement).getPropertyValue(`--ctp-${name}`).trim().replace(/\s*,\s*/g, ' ')})`;

function configure() {
  const dark = document.documentElement.dataset.theme === 'dark';
  mermaid.initialize({
    startOnLoad: false,
    securityLevel: 'strict',
    theme: 'base',
    fontFamily: 'Inter, system-ui, sans-serif',
    flowchart: { htmlLabels: true, curve: 'basis', padding: 10 },
    themeVariables: {
      darkMode: dark,
      background: rgb('base'),
      primaryColor: rgb('surface0'),
      primaryTextColor: rgb('text'),
      primaryBorderColor: rgb('accent'),
      secondaryColor: rgb('mantle'),
      tertiaryColor: rgb('crust'),
      lineColor: rgb('overlay1'),
      textColor: rgb('text'),
      mainBkg: rgb('surface0'),
      nodeBorder: rgb('accent'),
      clusterBkg: rgb('mantle'),
      clusterBorder: rgb('surface2'),
      edgeLabelBackground: rgb('mantle'),
      noteBkgColor: rgb('surface1'),
      noteTextColor: rgb('text'),
      actorBkg: rgb('surface0'),
      actorBorder: rgb('accent'),
      actorTextColor: rgb('text'),
      signalColor: rgb('text'),
      signalTextColor: rgb('text'),
      labelBoxBkgColor: rgb('surface0'),
      labelTextColor: rgb('text'),
      sequenceNumberColor: rgb('crust'),
      fontSize: '14px',
    },
  });
}

let n = 0;
async function draw(b: Block) {
  b.drawn = true;
  try {
    const { svg } = await mermaid.render(`mmd-${n++}`, b.source);
    b.host.innerHTML = svg;
  } catch (err) {
    b.host.innerHTML = `<pre class="mermaid-error">${b.source.replace(/</g, '&lt;')}</pre>`;
    console.warn('[mermaid]', err);
  }
}

const isVisible = (el: HTMLElement) => !el.closest('details:not([open])');

function drawVisible() {
  blocks.filter((b) => !b.drawn && isVisible(b.host)).forEach(draw);
}

configure();
drawVisible();

document.addEventListener(
  'toggle',
  (e) => {
    if ((e.target as HTMLDetailsElement).open) drawVisible();
  },
  true,
);

document.addEventListener('themechange', () => {
  configure();
  blocks.forEach((b) => (b.drawn = false));
  drawVisible();
});

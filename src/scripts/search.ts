// Ctrl+K / "/" search across every question on the site (static JSON index, no server).
type Item = {
  topic: string;
  topicTitle: string;
  color: string;
  id: string;
  title: string;
  section: string;
  star: boolean;
  gap: boolean;
  text: string;
};

const dialog = document.getElementById('search') as HTMLDialogElement;
const input = dialog.querySelector('input')!;
const list = dialog.querySelector('.search-results')!;
const base = dialog.dataset.base!.replace(/\/$/, '');
let items: Item[] | null = null;
let results: Item[] = [];
let active = 0;

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!);
const norm = (s: string) => s.toLowerCase().normalize('NFKD');

async function load() {
  if (items) return items;
  items = (await (await fetch(dialog.dataset.index!)).json()) as Item[];
  return items;
}

function score(item: Item, terms: string[]) {
  const title = norm(item.title);
  const meta = norm(`${item.topicTitle} ${item.section}`);
  const body = norm(item.text);
  let s = 0;
  for (const t of terms) {
    if (t === '⭐') { if (!item.star) return 0; s += 1; continue; }
    if (t === '🔥') { if (!item.gap) return 0; s += 1; continue; }
    if (title.includes(t)) s += title.split(/\W+/).includes(t) ? 10 : 6;
    else if (meta.includes(t)) s += 3;
    else if (body.includes(t)) s += 1;
    else return 0;
  }
  return s;
}

function highlight(text: string, terms: string[]) {
  let out = esc(text);
  for (const t of terms.filter((t) => t.length > 1 && !/⭐|🔥/u.test(t))) {
    out = out.replace(new RegExp(`(${t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'), '<mark>$1</mark>');
  }
  return out;
}

function render(query: string) {
  const terms = norm(query).split(/\s+/).filter(Boolean);
  if (!items || !terms.length) {
    results = [];
    list.innerHTML = '';
    return;
  }
  results = items
    .map((it) => ({ it, s: score(it, terms) }))
    .filter((r) => r.s > 0)
    .sort((a, b) => b.s - a.s)
    .slice(0, 40)
    .map((r) => r.it);
  active = 0;
  list.innerHTML = results.length
    ? results
        .map(
          (r, i) => `<li role="option" data-i="${i}" class="${i === 0 ? 'active' : ''}" style="--c: var(--ctp-${r.color})">
            <a href="${base}/${r.topic}/#${r.id}">
              <span class="sr-title">${r.star ? '⭐ ' : ''}${r.gap ? '🔥 ' : ''}${highlight(r.title, terms)}</span>
              <span class="sr-meta"><i></i>${esc(r.topicTitle)}${r.section ? ' · ' + esc(r.section) : ''}</span>
            </a></li>`,
        )
        .join('')
    : `<li class="sr-empty">No question matches “${esc(query)}”.</li>`;
}

function move(d: number) {
  if (!results.length) return;
  active = (active + d + results.length) % results.length;
  list.querySelectorAll('li').forEach((li, i) => li.classList.toggle('active', i === active));
  list.querySelector('li.active')?.scrollIntoView({ block: 'nearest' });
}

async function open() {
  if (dialog.open) return;
  dialog.showModal();
  input.select();
  await load();
  render(input.value);
}

document.querySelectorAll('[data-open-search]').forEach((b) => b.addEventListener('click', open));
document.addEventListener('keydown', (e) => {
  const typing = /INPUT|TEXTAREA/.test((e.target as HTMLElement).tagName);
  if ((e.key === 'k' && (e.ctrlKey || e.metaKey)) || (e.key === '/' && !typing)) {
    e.preventDefault();
    open();
  }
});
input.addEventListener('input', () => render(input.value));
input.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowDown') { e.preventDefault(); move(1); }
  if (e.key === 'ArrowUp') { e.preventDefault(); move(-1); }
  if (e.key === 'Enter' && results[active]) {
    e.preventDefault();
    list.querySelector<HTMLAnchorElement>('li.active a')?.click();
  }
});
list.addEventListener('click', (e) => {
  if ((e.target as HTMLElement).closest('a')) dialog.close();
});
dialog.addEventListener('click', (e) => {
  if (e.target === dialog) dialog.close();
});

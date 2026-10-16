// Page behaviour: theme, mobile nav, "revised" progress, filters, deep links, countdown.
// Progress lives in localStorage on this device only.

const $ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) => root.querySelector<T>(sel);
const $$ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) => [...root.querySelectorAll<T>(sel)];

const store = {
  get<T>(key: string, fallback: T): T {
    try {
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : fallback;
    } catch {
      return fallback;
    }
  },
  set(key: string, value: unknown) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {}
  },
};

/* ---------- theme ---------- */
$$('[data-theme-toggle]').forEach((btn) =>
  btn.addEventListener('click', () => {
    const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem('ip:theme', next);
    } catch {}
    document.dispatchEvent(new CustomEvent('themechange'));
  }),
);

/* ---------- sidebar: drawer on mobile, collapsible on desktop ---------- */
const mobile = matchMedia('(max-width: 860px)');
const setNav = (open: boolean) => document.body.classList.toggle('nav-open', open);
function toggleSidebar() {
  if (mobile.matches) return setNav(!document.body.classList.contains('nav-open'));
  const root = document.documentElement;
  const collapsed = root.dataset.sidebar !== 'collapsed';
  if (collapsed) root.dataset.sidebar = 'collapsed';
  else delete root.dataset.sidebar;
  try {
    localStorage.setItem('ip:sidebar', collapsed ? 'collapsed' : 'open');
  } catch {}
}
$$('[data-toggle-nav]').forEach((b) => b.addEventListener('click', toggleSidebar));
$$('[data-close-nav]').forEach((b) => b.addEventListener('click', () => setNav(false)));
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') setNav(false);
  if (e.key === '\\' && (e.ctrlKey || e.metaKey)) {
    e.preventDefault();
    toggleSidebar();
  }
});

/* ---------- progress ---------- */
const DONE_KEY = 'ip:done';
const done = new Set<string>(store.get<string[]>(DONE_KEY, []));
const saveDone = () => store.set(DONE_KEY, [...done]);
const countFor = (topic: string) => [...done].filter((k) => k.startsWith(topic + '#')).length;

function renderProgress() {
  // Sidebar + home cards
  $$('[data-topic][data-total]').forEach((el) => {
    const total = Number(el.dataset.total) || 0;
    const n = Math.min(countFor(el.dataset.topic!), total);
    const bar = $('[data-progress-bar]', el);
    if (bar) bar.style.width = total ? `${(n / total) * 100}%` : '0';
    const label = $('[data-progress-label]', el);
    if (label) label.textContent = el.classList.contains('topic-card') ? (n ? `✓ ${n}` : '') : n ? `${n}/${total}` : String(total);
  });
  // Topic header
  $$('[data-topic-progress]').forEach((el) => {
    el.textContent = `${countFor(el.dataset.topicProgress!)} / ${el.dataset.total} revised`;
  });
  // Home overall
  const overall = $('[data-overall-label]');
  if (overall) {
    const total = Number(overall.dataset.total);
    const n = $$('.topic-card').reduce((s, c) => s + Math.min(countFor(c.dataset.topic!), Number(c.dataset.total)), 0);
    overall.textContent = `${n} / ${total} revised`;
    const bar = $('[data-overall-bar]');
    if (bar) bar.style.width = `${(n / total) * 100}%`;
  }
  // Home gap list
  $$('[data-q-ref]').forEach((li) => li.classList.toggle('done', done.has(li.dataset.qRef!)));
}

/* ---------- question cards (topic pages) ---------- */
const prose = $('.prose[data-topic]');
const topic = prose?.dataset.topic ?? '';
const cards = prose ? $$<HTMLDetailsElement>('details[data-q]', prose) : [];

cards.forEach((card) => {
  const key = `${topic}#${card.dataset.q}`;
  const summary = $('summary', card)!;
  const btn = document.createElement('button');
  btn.className = 'q-check';
  btn.type = 'button';
  btn.title = 'Mark as revised';
  btn.setAttribute('aria-label', 'Mark as revised');
  const sync = () => {
    const on = done.has(key);
    card.classList.toggle('is-done', on);
    btn.setAttribute('aria-pressed', String(on));
  };
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    done.has(key) ? done.delete(key) : done.add(key);
    saveDone();
    sync();
    renderProgress();
    applyFilter();
  });
  summary.prepend(btn);
  sync();
});

/* ---------- filters ---------- */
let filter = 'all';
function applyFilter() {
  if (!prose) return;
  let visible = 0;
  cards.forEach((card) => {
    const key = `${topic}#${card.dataset.q}`;
    const show =
      filter === 'all' ||
      (filter === 'star' && card.hasAttribute('data-star')) ||
      (filter === 'gap' && card.hasAttribute('data-gap')) ||
      (filter === 'todo' && !done.has(key));
    card.hidden = !show;
    if (show) visible++;
  });
  prose.classList.toggle('filtered', filter !== 'all');
  const empty = $('.filter-empty');
  if (empty) empty.hidden = visible > 0;
  $$('[data-filter]').forEach((c) => c.classList.toggle('active', c.dataset.filter === filter));
}
const setFilter = (f: string) => {
  filter = f;
  applyFilter();
};
$$('[data-filter]').forEach((c) => c.addEventListener('click', () => setFilter(c.dataset.filter!)));
$$('[data-filter-shortcut]').forEach((c) =>
  c.addEventListener('click', () => {
    setFilter(c.dataset.filterShortcut!);
    $('.toolbar')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }),
);

$('[data-expand-all]')?.addEventListener('click', () => cards.forEach((c) => !c.hidden && (c.open = true)));
$('[data-collapse-all]')?.addEventListener('click', () => $$<HTMLDetailsElement>('.prose details').forEach((c) => (c.open = false)));
$('[data-random]')?.addEventListener('click', () => {
  const pool = cards.filter((c) => !c.hidden && !done.has(`${topic}#${c.dataset.q}`));
  const pick = (pool.length ? pool : cards)[Math.floor(Math.random() * (pool.length || cards.length))];
  if (!pick) return;
  cards.forEach((c) => (c.open = false));
  reveal(pick, false);
});

/* ---------- deep links: open the card a #hash points to ---------- */
function reveal(el: Element, open = true) {
  let p: Element | null = el;
  while (p) {
    if (p instanceof HTMLDetailsElement && (open || p !== el)) p.open = true;
    p = p.parentElement;
  }
  if (el instanceof HTMLElement && el.hidden) setFilter('all');
  el.classList.add('flash');
  setTimeout(() => el.classList.remove('flash'), 1600);
  el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
function openHash() {
  const id = decodeURIComponent(location.hash.slice(1));
  if (!id) return;
  const target = document.getElementById(id);
  if (!target) return;
  const card = target.closest('details');
  reveal(card ?? target);
}
window.addEventListener('hashchange', openHash);
if (location.hash) requestAnimationFrame(openHash);

/* ---------- reset ---------- */
$('[data-reset-progress]')?.addEventListener('click', () => {
  if (!done.size) return;
  done.clear();
  saveDone();
  cards.forEach((c) => {
    c.classList.remove('is-done');
    $('.q-check', c)?.setAttribute('aria-pressed', 'false');
  });
  renderProgress();
  applyFilter();
});

/* ---------- home: night-before plan + countdown ---------- */
const PLAN_KEY = 'ip:plan';
const plan = store.get<number[]>(PLAN_KEY, []);
$$<HTMLInputElement>('[data-plan]').forEach((box) => {
  const i = Number(box.dataset.plan);
  box.checked = plan.includes(i);
  box.addEventListener('change', () => {
    const set = new Set(store.get<number[]>(PLAN_KEY, []));
    box.checked ? set.add(i) : set.delete(i);
    store.set(PLAN_KEY, [...set]);
  });
});

const cd = $('[data-countdown]');
if (cd) {
  const when = new Date(cd.dataset.countdown!).getTime();
  const text = $('[data-countdown-text]', cd)!;
  const tick = () => {
    const ms = when - Date.now();
    if (ms <= 0) {
      text.textContent = 'Today. You have got this 💪';
      cd.classList.add('live');
      return;
    }
    const h = Math.floor(ms / 3.6e6);
    const m = Math.floor((ms % 3.6e6) / 6e4);
    text.textContent = h >= 48 ? `in ${Math.floor(h / 24)} days` : `in ${h}h ${String(m).padStart(2, '0')}m`;
  };
  tick();
  setInterval(tick, 30_000);
}

renderProgress();

/* ---------- diagrams: load mermaid only on pages that have them ---------- */
if (document.querySelector('code.language-mermaid')) import('./mermaid');

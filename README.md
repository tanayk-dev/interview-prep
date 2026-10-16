# Interview Prep

A Q&A site for interview preparation (Angular, JavaScript/TypeScript, .NET Core, PostgreSQL, DSA, HR & managerial), styled after the AnuPpuccin Obsidian theme.
Live at **https://tanayk-dev.github.io/interview-prep/**

Built with [Astro](https://astro.build). Every page is a plain Markdown file, written exactly like an Obsidian note.

## Update content (the only thing you normally do)

1. Edit a file in [`content/`](content/). One file = one topic page.
2. Commit and push to `main`.
3. GitHub Actions builds and deploys automatically (≈1–2 minutes). Check the **Actions** tab if it doesn't show up.

You can open the `content/` folder as an Obsidian vault: callouts, tables, code and mermaid diagrams render the same way in both.

### Writing a question

````markdown
> [!question]- Q12. What is a closure? ⭐ 🔥
> **In simple words:** a function remembers the variables from where it was created.
>
> ```js
> const counter = () => { let n = 0; return () => ++n; };
> ```
>
> **Diagram:**
> ```mermaid
> flowchart LR
>   A["outer()"] --> B["inner() keeps n"]
> ```
>
> 💡 **Hack:** a closure is a backpack.
````

- `[!question]-` = collapsed card (`+` = open by default). Other callouts: `tip`, `info`, `warning`, `example`, `abstract`, `success`, `danger`, `quote`.
- `⭐` in the title = asked at Infosys (shown as a badge, filterable). `🔥` = a gap from a real interview round (also listed on the home page).
- `## Headings` become the sections in the "On this page" outline.
- The card's link id comes from its title, so renaming a question changes its URL.

### Adding a new topic

Create `content/<slug>.md` with this frontmatter. It appears in the sidebar, home grid and search automatically.

```yaml
---
title: React
short: React
description: One line shown on the card.
order: 8
icon: ⚛️
color: sky        # rosewater flamingo pink mauve red maroon peach yellow green teal sky sapphire blue lavender
---
```

### Next interview

Edit [`src/site.config.ts`](src/site.config.ts): the countdown target (`date: null` hides it) and the night-before plan.

## Run locally

```bash
npm install
npm run dev        # http://localhost:4321/interview-prep/
npm run build      # production build into dist/
```

## How it works

| Path | What |
|---|---|
| `content/*.md` | the Q&A topics |
| `src/plugins/remark-callouts.mjs` | turns Obsidian callouts into cards and collects the question list |
| `src/pages/[topic].astro` | topic page · `src/pages/index.astro` home · `src/pages/search.json.ts` search index |
| `src/scripts/` | progress ticks (localStorage), filters, deep links, search, lazy mermaid |
| `src/styles/global.css` | Catppuccin Mocha (dark) / Rosé Pine (light) theme tokens |
| `.github/workflows/deploy.yml` | build + deploy to GitHub Pages on push |

"Revised" ticks and the night-before checklist are stored in each browser's localStorage, so they're per device.

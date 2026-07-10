# Website Setup Learnings — Agentic AI OSS Orgs

Research compiled for **AgentPlane** (`theagentplane.github.io`) as a content-manager reference. Covers how major GitHub organizations in agentic AI structure their web presence, plus consolidated best practices for engagement, navigation, accessibility, and agent/LLM discoverability.

**Research date:** July 2026  
**Sources:** Public websites, GitHub org profiles, documentation platforms (Mintlify, Sphinx, Microsoft Learn, Hugging Face Docs), and published accessibility/navigation guides.

---

## 1. Landscape: How Major Orgs Split Their Web Presence

Most mature agentic-AI projects use **two (sometimes three) distinct surfaces**, not one monolithic site:

| Org | Marketing / brand site | Documentation | Notes |
|-----|------------------------|---------------|-------|
| **LangChain** | [langchain.com](https://www.langchain.com) | [docs.langchain.com](https://docs.langchain.com) | Commercial platform (LangSmith) + OSS frameworks; docs unify LangChain, LangGraph, Deep Agents |
| **CrewAI** | [crewai.com](https://crewai.com) | [docs.crewai.com](https://docs.crewai.com) | Mintlify docs; enterprise AMP Suite on separate path |
| **OpenHands** | (product-led; docs as hub) | [docs.openhands.dev](https://docs.openhands.dev) | Mintlify; aggregated docs across multiple repos |
| **Pydantic AI** | (docs-first) | [ai.pydantic.dev](https://ai.pydantic.dev) | Docs *are* the homepage; commercial upsell to Logfire |
| **Agno** | (docs-first) | [docs.agno.com](https://docs.agno.com) | Docs as homepage; AgentOS as platform layer |
| **AutoGen** | — | [microsoft.github.io/autogen](https://microsoft.github.io/autogen) | Sphinx on **GitHub Pages**; layered API surfaces |
| **Semantic Kernel / MAF** | — | [learn.microsoft.com](https://learn.microsoft.com) | Enterprise docs on Microsoft Learn |
| **Hugging Face smolagents** | HF blog for launches | [huggingface.co/docs/smolagents](https://huggingface.co/docs/smolagents) | Leverages HF's doc infra |
| **Letta** | — | [docs.letta.com](https://docs.letta.com) | Product lines: Agent, SDK, App Server |
| **Mem0** | — | [docs.mem0.ai](https://docs.mem0.ai) | Task-oriented doc landing; platform vs OSS split |
| **LlamaIndex** | [llamaindex.ai](https://www.llamaindex.ai) | [docs.llamaindex.ai](https://docs.llamaindex.ai) | Classic marketing + docs split |

### Pattern A — Marketing site + separate docs (LangChain, CrewAI, LlamaIndex)

- **Marketing site** sells the vision, social proof, and primary CTA (demo, install, GitHub star).
- **Docs site** is where developers live; optimized for search, tutorials, API reference, and copy-paste code.
- Cross-linking is bidirectional: every docs page has a path back to GitHub; marketing pages link to Quickstart.

**When to use:** You have a commercial layer, multiple products, or docs that will grow beyond ~20 pages.

### Pattern B — Docs-first (Pydantic AI, Agno, Mem0, OpenHands)

- The **documentation homepage** *is* the product entry point.
- Hero = value prop + install/quickstart links, not a separate splash page.
- Marketing content (testimonials, enterprise) is embedded in docs sidebars or `/platform` sections.

**When to use:** Audience is almost entirely developers; OSS is the primary funnel; you want one canonical URL in README badges.

### Pattern C — GitHub Pages static site (AutoGen, small OSS orgs)

- Docs built with **Sphinx**, **MkDocs**, or **Jekyll** and deployed to `{org}.github.io/{repo}`.
- README badges point directly to docs URL.
- Works well for framework projects where the repo *is* the product.

**When to use:** Bootstrap phase, no budget for Mintlify/Vercel, or docs live in-repo (`.github.io` from `/docs` folder).

### Pattern D — Modern static app on GitHub Pages (OpenInterpretability, VERSA)

- **Next.js `output: 'export'`** → static HTML in `out/`, deployed via GitHub Actions.
- Shared `navbar.tsx` / `footer.tsx` components enforce consistency.
- Scales from landing page to multi-section sites (pillars, interactive demos).

**When to use:** You want React/component reuse but still free static hosting.

---

## 2. Information Architecture — What Pages Exist

### Marketing / org site (typical 4–7 nav items)

Observed top-level nav across LangChain, CrewAI, OpenInterpretability, and smaller OSS landings:

1. **Home** — hero, one-line positioning, primary + secondary CTA
2. **Product / Projects** — what you ship (cards with tags, links to repos)
3. **Docs** (external link) — if docs are separate
4. **Blog / Resources** — technical writing, changelogs, field notes
5. **About / Team** — credibility, hiring, contact
6. **GitHub** — always visible, often as a button (not buried in footer)
7. **Community** (optional) — Discord, Slack, forum

**Rule of thumb (Mintlify navigation guide):** Keep **≤7 top-level items**. Prefer depth over breadth (5 subsections under "Docs" beats 15 top-level links).

### Documentation site (typical sections)

| Section | Purpose | Examples |
|---------|---------|----------|
| **Overview / Quickstart** | Zero-to-running in <10 min | OpenHands `/overview`, Mem0 `/platform/quickstart` |
| **Concepts** | Mental model before API details | AutoGen Core Concepts toctree |
| **Guides / Tutorials** | Task-oriented how-tos | Pydantic AI "Hello World" → Tools example progression |
| **API Reference** | Generated from code | OpenHands `/openapi`, AutoGen autogen_* modules |
| **Integrations** | Framework connectors | Mem0 `/integrations` (LangChain, CrewAI, Vercel AI SDK) |
| **Cookbooks / Examples** | Copy-paste recipes | Mem0 `/cookbooks`, LangChain templates |
| **Migration / Changelog** | Trust + upgrade path | AutoGen → Microsoft Agent Framework banner |
| **Community / Contributing** | Lower support burden | AGENTS.md, CONTRIBUTING in repo |

**Task-oriented > feature-oriented.** Organize nav around *what the user is trying to do* ("Add memory to your agent") not internal module names ("VectorStoreRetriever").

### Landing page section sequence (high-converting OSS pattern)

Synthesized from LangChain, CrewAI, Pydantic AI, OpenInterpretability, and static-site guides:

1. **Sticky nav** — logo, 4–6 links, GitHub CTA
2. **Hero** — headline (outcome, not technology), subhead, 2 CTAs (primary: docs/projects; secondary: blog/demo)
3. **Social proof strip** — stars, downloads, logos, or "used by X" (only if true)
4. **Problem → solution** — 2–3 sentences on the pain you solve
5. **Feature / project cards** — icon, title, 2-line description, tags, repo + docs links
6. **Code snippet or architecture diagram** — show, don't tell
7. **How it fits the ecosystem** — LangGraph, MCP, OTel, etc. (reduces "why not X?" friction)
8. **Blog / field notes teaser** — proves the team is active and thinking deeply
9. **Final CTA** — GitHub star, install command, or "Read the docs"
10. **Footer** — secondary links, license, social, sitemap

---

## 3. Navigation Best Practices

### Persistent chrome

- **Header nav** appears on every page, same order, same labels.
- **Footer** holds legal, secondary links (privacy, license), social, and sitemap-style groupings.
- **Active state** on current page (`aria-current="page"` on the nav link; visual highlight in CSS).

### Docs-specific navigation

- **Left sidebar** for doc hierarchy (Mintlify, Sphinx, Docusaurus standard).
- **Breadcrumbs** on inner pages: `Docs > Concepts > Agents` with `aria-current="page"` on the last crumb (not linked).
- **Next / Previous** at bottom of tutorial sequences — label with titles, not bare "Next" (e.g., "Next: Snapshot retention policies").
- **In-page table of contents** (right rail) for long guides.
- **Search** — expected on any docs site >30 pages (Algolia, Mintlify built-in, or Pagefind for static).

### Cognitive-load rules (Mintlify)

- Don't hide critical content **more than two clicks** deep; promote high-traffic pages.
- If users search for a term that doesn't match any page label, it's a **content gap**, not a nav relabeling problem.
- Validate with analytics: entry points, exit pages, search queries with no results.

### Mobile

- **Hamburger menu** with full nav accessible via keyboard (not hover-only).
- Touch targets ≥44×44px for nav links and CTAs.
- Test: sticky header doesn't obscure in-page anchor targets (`scroll-padding-top` on `html`).

### External links

- `target="_blank"` + `rel="noopener"` for GitHub and third-party links (AgentPlane already does this).
- Indicate external destinations visually (↗ suffix or icon) so users aren't surprised.

---

## 4. User Engagement Best Practices

### CTAs — hierarchy matters

| Priority | CTA type | Example |
|----------|----------|---------|
| Primary | One per viewport | "View Projects", "pip install chronicle", "Get started" |
| Secondary | Ghost/outline button | "Read the Blog", "See on GitHub" |
| Tertiary | Text links in body | "Learn more →" on cards |

Avoid three equally-weighted buttons in the hero. LangChain uses "Get a demo" (commercial) + framework explore links; Pydantic AI leads with install + docs.

### Developer trust signals

- **Real metrics** — GitHub stars, PyPI downloads, release date (not vanity numbers).
- **Runnable code above the fold** — Pydantic AI and smolagents put copy-paste examples on the homepage.
- **Changelog / release cadence** — visible in README and optionally on site.
- **Blog with technical depth** — not marketing fluff; AgentPlane's "execution DNA" / "tokens as infrastructure" angle is exactly right.
- **Open governance** — CONTRIBUTING.md, issue templates, public roadmap (even a simple `ROADMAP.md`).

### Content that keeps people coming back

- **Field notes / engineering blog** — incident postmortems, design decisions, benchmarks.
- **Cookbooks** — single-file examples for common tasks.
- **Comparison guides** — "When to use Chronicle vs LangSmith traces" (honest, not combative).
- **Newsletter** (optional) — Pydantic uses "The Pydantic Stack"; only if you can send consistently.

### Reducing friction to first success

- **Install command in monospace** with one-click copy button.
- **5-minute quickstart** linked from README, site hero, and docs index.
- **"Works with" badges** — LangGraph, MCP, OTel — scan quickly for compatibility.

### What top orgs avoid

- Auto-playing video/audio.
- Gated docs (everything public; commercial is a separate tier).
- Generic stock photography (use diagrams, terminal screenshots, architecture sketches).
- Hiding GitHub behind a contact form.

---

## 5. Accessibility Best Practices (WCAG 2.1/2.2 AA target)

### Semantic HTML (non-negotiable)

```html
<!-- Prefer -->
<nav aria-label="Main">...</nav>
<main id="main-content">...</main>
<footer>...</footer>

<!-- Not -->
<div class="nav">...</div>
```

- One `<h1>` per page; heading levels don't skip (`h1` → `h2` → `h3`).
- `<html lang="en">` on every page (AgentPlane already sets this).
- Use `<button>` for actions, `<a href>` for navigation.

### Skip navigation

First focusable element on every page:

```html
<a href="#main-content" class="skip-link">Skip to main content</a>
```

CSS: visually hidden until `:focus`, then visible. Critical for keyboard and screen-reader users.

### Links

- **Descriptive text** — "Chronicle on GitHub" not "click here".
- **Color + underline** for default link state (don't rely on color alone).
- External link indication for screen readers: `aria-label="AgentPlane on GitHub (opens in new tab)"` or visible ↗.

### Images

- Meaningful images: descriptive `alt` text.
- Decorative images (logo mark beside text label): `alt=""` (AgentPlane logo mark pattern is correct).
- Diagrams: alt text summarizing the diagram *or* adjacent text description.

### Color and contrast

- Body text: **4.5:1** contrast ratio minimum against background.
- Large text (≥18pt / 14pt bold): **3:1**.
- Don't convey state by color alone (errors need icon + text).
- Test with [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/).

### Keyboard and focus

- All interactive elements reachable via Tab in logical DOM order.
- **Visible focus ring** on links, buttons, inputs (`:focus-visible` — don't remove outlines without replacement).
- No keyboard traps in mobile menu or modals.
- Test path: Tab from top → skip link → main content → nav → footer.

### Motion

- Respect `prefers-reduced-motion: reduce` — disable or shorten animations.
- No auto-playing carousels without pause control.

### Forms (if/when added)

- `<label>` associated with every input.
- Error messages linked via `aria-describedby`.
- Don't disable paste on inputs.

### Testing cadence

- **Lighthouse** accessibility audit in Chrome DevTools (target ≥90).
- **axe DevTools** browser extension for interactive checks.
- **VoiceOver** (macOS) or **NVDA** (Windows) spot-check on nav + one blog post.
- Optional CI: `accessibility-scanner` GitHub Action or `axe` in Playwright.

---

## 6. Agent / LLM Discoverability (2025–2026 convention)

Agentic-AI doc sites are early adopters of **machine-readable indexes**. This is increasingly expected for developer tools in this space.

### `llms.txt` at site root

Spec: [llmstxt.org](https://llmstxt.org)

```
# AgentPlane

> Infrastructure for the agentic AI era — execution tracing, replay testing, and token infrastructure.

## Projects
- [Chronicle](https://theagentplane.github.io/projects.html#chronicle): Execution DNA capture and deterministic replay for agents
- [TokenOps](https://theagentplane.github.io/projects.html#TokenOps): Tokens as first-class infrastructure

## Blog
- [Media](https://theagentplane.github.io/media.html): Writing, talks, and videos on agent infrastructure

## Optional
- [About](https://theagentplane.github.io/about.html): Team and mission
```

**Rules:**
- One `# H1` title, required `>` blockquote summary.
- **Absolute URLs** only (`https://...`, not `/about.html`).
- One-line descriptions after each link (≤120 chars).
- Curate **15–30 core URLs** in main sections; use `## Optional` for secondary pages.
- Serve as `text/plain` or `text/markdown` at `/llms.txt`.
- Reference in `robots.txt`: `# llms.txt: https://theagentplane.github.io/llms.txt`

**Who ships it:** Pydantic AI, Mem0, OpenHands, Agno, Stripe docs, Prisma docs.

### `llms-full.txt` (optional)

Concatenated full text of all indexed pages. Useful when total content < ~200K tokens. Pydantic AI and Agno both publish this for IDE indexing (Cursor "Indexing & Docs").

### Docs page header convention

Mem0, OpenHands, and Agno put this at the top of every doc page:

```markdown
> Fetch the complete documentation index at: https://docs.example.com/llms.txt
> Use this file to discover all available pages before exploring further.
```

### MCP server for docs (advanced)

Agno exposes `docs.agno.com/mcp` so coding agents can query docs programmatically. Consider when doc surface exceeds ~100 pages.

### `AGENTS.md` in repo

Not a website file, but part of the **web + repo** experience. OpenHands, CrewAI, and Letta use `AGENTS.md` to tell AI coding agents how to contribute. Link it from the site's About or Contributing section.

---

## 7. GitHub Pages — Technical Setup Notes

### URL structures

| Repo name | URL |
|-----------|-----|
| `theagentplane.github.io` | `https://theagentplane.github.io/` (org root — **AgentPlane uses this**) |
| `project-name` | `https://theagentplane.github.io/project-name/` |

Org-root repos don't need `basePath` configuration. Project sites do.

### Static HTML pattern (AgentPlane's current approach)

```
/
├── index.html          → /
├── projects.html       → /projects.html  (or projects/index.html → /projects/)
├── blog.html
├── blog/*.html
├── about.html
├── css/style.css
├── js/
├── assets/
└── data/posts.json
```

**Upgrade path:** Move to folder-based routing (`about/index.html` → `/about/`) for cleaner URLs. Both work on GitHub Pages.

### Shared template problem

AgentPlane currently duplicates `<nav>` and `<footer>` in every HTML file. At 5+ pages this is manageable; at 15+ pages, consider:

- **Eleventy (11ty)** — markdown + Nunjucks templates, zero JS bundle
- **Hugo** — fast, good for blogs + docs
- **Next.js static export** — if you want React components

### Performance (free wins)

- `preconnect` for Google Fonts (already in place); consider self-hosting fonts to eliminate render-blocking.
- SVG logos (already using `logo-mark.svg`).
- Lazy-load below-fold images.
- Minify CSS in CI (optional at current scale).

### SEO basics

Every page needs unique:
- `<title>` — `Page — AgentPlane` pattern (already used)
- `<meta name="description">` — unique per page, 150–160 chars
- Open Graph tags (`og:title`, `og:description`, `og:image`) for link previews
- `sitemap.xml` at root (GitHub Pages serves it; can be generated in CI)
- `robots.txt` allowing crawl

### Analytics (privacy-respecting)

- **Plausible** or **Fathom** — lightweight, no cookie banner in many jurisdictions.
- **GitHub traffic** — built into repo Insights (no site JS needed).
- Avoid Google Analytics unless you need it; developer audiences skew ad-block-heavy.

---

## 8. Docs Platform Comparison (when you outgrow static HTML)

| Platform | Used by | Pros | Cons |
|----------|---------|------|------|
| **Mintlify** | CrewAI, OpenHands, Mem0 | Beautiful defaults, search, OpenAPI, versioning, `llms.txt` friendly | Hosted; free tier limits |
| **Sphinx + Furo** | AutoGen, many Python projects | In-repo, GitHub Pages deploy, autodoc from code | Steeper setup, dated feel without theme work |
| **Docusaurus** | Meta, many OSS projects | React-based, versioning, i18n | Heavier build; overkill for 10 pages |
| **MkDocs Material** | FastAPI ecosystem | Simple markdown, great search | Less "product" polish than Mintlify |
| **Read the Docs** | Scientific Python | Free hosting for docs | Less control over branding |

**Recommendation for AgentPlane today:** Static HTML site for brand/blog/projects is appropriate at current scale. When Chronicle or TokenOps ship formal docs (>15 pages, API reference), add a **Mintlify or MkDocs** subsite at `docs.theagentplane.github.io` or a `/docs/` path — don't bloat the marketing site.

---

## 9. Competitive Positioning on the Page

How mature orgs differentiate without being salesy:

| Org | Positioning line | What they emphasize |
|-----|------------------|---------------------|
| LangChain | "Agent engineering platform" | Lifecycle: build → test → deploy → monitor |
| CrewAI | "Build. Deploy. Manage." | Enterprise adoption, Fortune 500 logos |
| Pydantic AI | "The Pydantic way" / FastAPI feeling | Type safety, observability, model-agnostic |
| Agno | "Build your own agent platform" | Ownership, data control, AgentOS runtime |
| Mem0 | "AI apps that remember" | Memory layer, not full framework |
| AutoGen | "Framework for building AI agents" | Layered APIs (Studio → AgentChat → Core) |

**AgentPlane's angle (from current site):** "Infrastructure for the agentic AI era" — execution tracing at the decision boundary, tokens as infrastructure. This is a **narrow, credible wedge** (observability + cost), not a "build any agent" framework pitch. Keep that distinction visible; it avoids comparison fatigue with LangChain/CrewAI.

---

## 10. Checklist — Apply to AgentPlane

### Quick wins (static site, no platform migration)

- [ ] Add skip-to-content link on all pages
- [ ] Add `aria-current="page"` on active nav links
- [ ] Add `aria-label` on `<nav>` and external GitHub button
- [ ] Publish `/llms.txt` at repo root
- [ ] Add Open Graph meta tags to all pages
- [ ] Add `sitemap.xml` and `robots.txt`
- [ ] Mobile hamburger menu if nav wraps awkwardly on small screens
- [ ] `prefers-reduced-motion` media query for any future animations
- [ ] Run Lighthouse accessibility audit; fix issues ≥ severity "serious"

### Medium term

- [ ] Folder-based URLs (`/about/` instead of `/about.html`)
- [ ] Shared layout via Eleventy or similar (DRY nav/footer)
- [ ] Copy-to-clipboard on install commands when README install snippets are added
- [ ] RSS feed for blog (`/feed.xml`)
- [ ] Per-post JSON-LD (`BlogPosting` schema) for blog articles

### When docs ship

- [ ] Separate docs subdomain or `/docs/` with search
- [ ] Quickstart < 5 minutes to first trace / first token budget
- [ ] `llms-full.txt` or Mintlify auto-generation
- [ ] Version selector if breaking API changes are expected
- [ ] Migration guides when APIs change

---

## 11. Reference Links

### Org sites studied
- LangChain: https://www.langchain.com · https://docs.langchain.com
- CrewAI: https://crewai.com · https://docs.crewai.com
- OpenHands: https://docs.openhands.dev
- Pydantic AI: https://ai.pydantic.dev
- Agno: https://docs.agno.com
- AutoGen: https://microsoft.github.io/autogen
- Mem0: https://docs.mem0.ai
- Letta: https://docs.letta.com
- smolagents: https://huggingface.co/docs/smolagents
- OpenInterpretability: https://openinterp.org (Next.js on GitHub Pages)

### Standards & guides
- llms.txt spec: https://llmstxt.org
- Mintlify navigation guide: https://mintlify.com/docs/guides/navigation
- WCAG 2.2: https://www.w3.org/TR/WCAG22/
- WebAIM accessibility guide: https://webaim.org/standards/wcag/checklist
- Docs breadcrumbs + next/prev: https://cr0x.net/en/docs-breadcrumbs-next-prev-navigation/
- GitHub Pages docs: https://docs.github.com/en/pages

---

*This document is a living reference. Revisit when AgentPlane adds formal project documentation, a third project, or moves to a static-site generator.*

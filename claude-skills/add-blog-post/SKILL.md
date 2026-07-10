---
name: add-blog-post
description: Add a new post to the AgentPlane blog gallery (this repo, agentplane-site). Handles two cases — (1) raw blog content (markdown/plain text, or "write this up as a post") to publish inline on the site, and (2) a link to a post already published elsewhere (Substack, dev.to, LinkedIn, Medium, etc.) to list in the gallery. Trigger when the user says things like "add this blog post to the site", "publish this on agentplane", "add my Substack post", or pastes an external article URL to include.
---

# Add a blog post to AgentPlane

The blog is a data-driven gallery: `data/posts.json` is the single source of truth for every post shown on `blog.html` and the "From the blog" section of `index.html`. Both pages `fetch()` this file at runtime and render it client-side (see `js/blog.js`) — never hand-edit the post lists in the HTML files, and never reorder `posts.json` by hand; it's sorted by `date` automatically at render time.

## Step 1: Determine the post type

- **Internal** — the user gave you raw text, a markdown draft, or asked you to write something up as a post. It should live on this site. → Create a new file under `blog/` **and** add a `posts.json` entry.
- **External** — the user gave you a URL to a Substack, dev.to, Medium, LinkedIn article, or similar. It's already published elsewhere. → Just add a `posts.json` entry, no new file.

If it's ambiguous (e.g. the user just pastes text with no indication), default to internal — that's the site's own voice.

## Step 2A: External post

Append one object to the `data/posts.json` array:

```json
{
  "id": "kebab-case-slug",
  "title": "Exact post title",
  "excerpt": "1-2 sentence summary in your own words, ~160 characters.",
  "date": "YYYY-MM-DD",
  "author": "Susheem Koul",
  "readTime": "X min read",
  "tags": ["Relevant", "Tags"],
  "type": "external",
  "url": "https://the-full-external-url",
  "source": "Substack"
}
```

`source` is the platform name as a short proper noun — `Substack`, `Dev.to`, `LinkedIn`, `Medium`, etc. It drives the colored badge on the card. Recognized sources (`AgentPlane`, `Substack`, `Dev.to`, `LinkedIn`, `Medium` — case/spacing-insensitive) get a branded badge in `css/style.css`; anything else automatically falls back to a neutral badge, so no CSS changes are ever required to add a new platform.

If you only have the URL and not the title/excerpt, fetch the page to pull the real title and write a genuine 1-2 sentence summary — don't fabricate content you haven't read.

## Step 2B: Internal post

1. Copy `blog/chronicle-execution-dna.html` as your starting template — it already has the head/nav/article/footer boilerplate wired to `../css/style.css` and correct `../`-prefixed relative links.
2. Replace: `<title>`, the meta description, the `<h1>`, and the `.article-meta` line (author / date / read time / tag).
3. Write the body inside `<article class="article-body">` using the typographic classes already styled in `css/style.css` — plain `<p>`, `<h2>`, `<h3>`, `<ul>`/`<ol>`, `<pre><code>` for code, `<blockquote>` for pull quotes. Don't invent new classes; everything needed already exists.
4. Update the `.byline` block at the end (initials, name, role) if the author isn't Susheem Koul.
5. Save as `blog/<kebab-case-slug>.html`.
6. Add the matching entry to `data/posts.json`:

```json
{
  "id": "kebab-case-slug",
  "title": "Post title",
  "excerpt": "1-2 sentence summary, ~160 characters.",
  "date": "YYYY-MM-DD",
  "author": "Susheem Koul",
  "readTime": "X min read",
  "tags": ["Relevant", "Tags"],
  "type": "internal",
  "url": "blog/<kebab-case-slug>.html",
  "source": "AgentPlane"
}
```

## Step 3: Verify before finishing

- `data/posts.json` still parses as valid JSON — run `python3 -m json.tool data/posts.json` (or equivalent) and confirm no errors. A trailing comma or unescaped quote here breaks the live site silently (the fetch just fails and shows "Couldn't load posts").
- If internal, double check the new file's relative links (`../css/style.css`, `../index.html`, `../about.html`, `../blog.html`) resolve — it lives one level down in `blog/`, everything else lives at repo root.
- Preview with a local server, not by double-clicking the HTML file: `python3 -m http.server` from the repo root, then visit `http://localhost:8000/blog.html`. `fetch()` of local JSON is blocked under `file://`, so opening `index.html` directly will show "Couldn't load posts" even though everything is correct.
- Confirm the new card appears in the right sort position (newest `date` first) and the badge color/label look right.

## Full field reference

| Field | Required | Notes |
|---|---|---|
| `id` | yes | kebab-case, unique, stable key (not currently used for routing, but keep it unique and slug-like for future use) |
| `title` | yes | card headline |
| `excerpt` | yes | 1-2 sentences shown under the title |
| `date` | yes | `YYYY-MM-DD` — drives sort order and the date chip |
| `author` | yes | full name |
| `readTime` | yes | free text, e.g. `"5 min read"` |
| `tags` | no | array of strings; not rendered yet, kept for future filtering |
| `type` | yes | `"internal"` or `"external"` |
| `url` | yes | relative path (`blog/slug.html`) if internal; full `https://` URL if external |
| `source` | yes | `"AgentPlane"` for internal; platform name for external — drives the badge |

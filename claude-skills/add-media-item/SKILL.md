---
name: add-media-item
description: Add writing, conference talks, or videos to the AgentPlane media gallery (this repo). Handles external writing links, conference talk links, and video links (YouTube, etc.). Trigger when the user says "add a talk", "add this video", "add my conference presentation", "publish this article", or pastes a URL to include in the media gallery.
---

# Add media to AgentPlane

The media gallery is data-driven: `data/posts.json` is the single source of truth for everything shown on `media.html` and the homepage media teaser. Both pages fetch this file at runtime via `js/media.js` — never hand-edit lists in HTML, and never reorder `posts.json` by hand; items sort by `date` automatically.

## Step 1: Determine format

| User intent | `format` | Action |
|-------------|----------|--------|
| Article published elsewhere | `writing` | JSON entry with full URL |
| Conference talk / presentation | `talk` | JSON entry (slides/video URL) |
| Recorded video (YouTube, etc.) | `video` | JSON entry |

If ambiguous, ask once. Default to `writing` when the user pastes an article URL.

## Step 2: Append to `data/posts.json`

### Writing — external

```json
{
  "id": "kebab-case-slug",
  "format": "writing",
  "title": "Exact post title",
  "excerpt": "1-2 sentence summary.",
  "date": "YYYY-MM-DD",
  "author": "Tisha Chawla",
  "duration": "8 min read",
  "tags": ["Agents"],
  "type": "external",
  "url": "https://full-external-url",
  "source": "Substack",
  "thumbnail": "https://optional-og-image-url"
}
```

### Conference talk

```json
{
  "id": "tokenops-ai-engineer-fair-2026",
  "format": "talk",
  "title": "Tokens as infrastructure",
  "excerpt": "Why cloud cost controls break in stochastic agent systems — presented at AI Engineer World's Fair 2026.",
  "date": "2026-07-01",
  "author": "Susheem Koul & Tisha Chawla",
  "duration": "30 min talk",
  "tags": ["TokenOps", "Conference"],
  "type": "external",
  "url": "https://slides-or-event-url",
  "source": "AI Engineer World's Fair"
}
```

Use the conference name as `source` (falls back to neutral badge if unrecognized — no CSS changes needed).

### Video

```json
{
  "id": "chronicle-demo-youtube",
  "format": "video",
  "title": "Chronicle demo: replaying agent incidents",
  "excerpt": "Walkthrough of decision-boundary capture, envelope fixtures, and cut-point replay.",
  "date": "2026-07-05",
  "author": "Susheem Koul",
  "duration": "12 min",
  "tags": ["Chronicle", "Demo"],
  "type": "external",
  "url": "https://www.youtube.com/watch?v=...",
  "source": "YouTube"
}
```

`source: "YouTube"` gets a branded red badge. Other platforms use the neutral badge.

### Writing — native blog post

For long-form posts hosted on this site (`blog/*.html`), not linked out elsewhere first:

```json
{
  "id": "kebab-case-slug",
  "format": "writing",
  "title": "Exact post title",
  "excerpt": "1-2 sentence summary.",
  "date": "YYYY-MM-DD",
  "author": "Susheem Koul & Tisha Chawla",
  "duration": "9 min read",
  "tags": ["Chronicle"],
  "type": "internal",
  "url": "/blog/your-post-slug.html",
  "source": "AgentPlane"
}
```

`type: "internal"` and a root-absolute `url` (no `http`, starts with `/`) is what
tells `media.js` to link in-page instead of opening a new tab. Root-absolute (not
page-relative) matters because the same JSON entry is rendered from pages at
different depths (`index.html`, `blog.html`, and from inside `blog/*.html` itself
via the "more from the blog" widget), and a relative `blog/slug.html` would 404
one level down. `source: "AgentPlane"` gets its own badge
(`.source-agentplane` in `css/style.css`) and is what `blog.html` filters on
(`renderMediaList('blog-list', null, null, 'AgentPlane')`) to show only native posts.

Write the post in **three** files:
- `blog/slug.html`: uses `.article-header` / `.article-body` from `css/style.css`,
  nav + footer like every other page.
- `blog/slug.md`: plain GitHub-flavored markdown, same content, absolute image
  URLs, `canonical:` front-matter key. This is the site-canonical copy, byline
  links to LinkedIn (matches the HTML).
- `blog/slug.devto.md`: dev.to-specific front matter (`published: false` so it
  lands as a draft, `description`, `tags` as a plain comma-separated string, max
  4, lowercase single words, `cover_image`, `canonical_url`, not `canonical`,
  dev.to's literal expected key). Images are plain `![alt](url)`, not `<img>`,
  since dev.to's markdown renderer doesn't reliably pass through raw HTML.

Diagrams live as `assets/blog/slug-name.svg` for the site (crisp, tiny, and the
site's CSS/theme can style them), but dev.to proxies external images through
its own Cloudinary pipeline and SVG support through that path isn't reliably
documented, so **the `.devto.md` file should reference `.png` versions of the
same diagrams**, not the `.svg`. Generate them with a headless Chromium
screenshot rather than guessing a converter is installed:

```powershell
$edge = "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
& $edge --headless --disable-gpu --screenshot="assets\blog\name.png" `
  --window-size=<svg-width-plus-100>,<svg-height-plus-20> `
  "file:///<absolute-path>\assets\blog\name.svg"
```

Pad the window size well past the SVG's own `viewBox` (Edge can otherwise clip
the right/bottom edge), and if the SVG has SMIL `<animate>` elements, add
`--virtual-time-budget=2500` so it captures a settled frame instead of
whatever was mid-draw at t=0.

dev.to has no true multi-author posts on personal accounts (no org exists for
theagentplane as of 2026-08). The real "collaborate" mechanism there is:
publish from **one** account, `@mention` the other author by their dev.to
handle in the byline (creates a real profile link + notifies them), and point
`canonical_url` at the site so the site stays the SEO source of truth
regardless of which account posted it. A dev.to Organization would enable true
shared publishing, but someone has to create that account by hand
(`dev.to/settings/organization`), not something to set up unprompted.

Add images under `assets/blog/`.

Give each `blog/slug.html` a unique-reader badge near the byline (not in the
`.md`, it's a page-only widget, no custom JS needed):

```html
<p class="post-meta" style="margin-top: 16px;">
  <img src="https://visitor-badge.laobi.icu/badge?page_id=theagentplane.blog.slug&left_text=unique%20readers" alt="Unique reader count for this post" height="14" loading="lazy">
</p>
```

`page_id` must be unique per post (`theagentplane.blog.<slug>`); the badge service
dedupes by visitor IP within a time window server-side, so this is an actual
(free, no-signup) unique-visitor count, not just a page-view counter. Don't use
`countapi.xyz` for this, it's dead (DNS doesn't resolve).

## Step 3: Homepage hero (optional)

If `data/hero.json` has `"mode": "auto"`, the newest item by `date` becomes the homepage hero automatically — no hero edit needed.

To pin a specific item or write custom hero copy, update `data/hero.json` (see `claude-skills/update-home-hero/SKILL.md` if present) or set:

```json
"pinnedPostId": "your-item-id"
```

Optional per-item hero overrides in `posts.json`:

```json
"heroEyebrow": "New talk",
"heroHeadline": "Shorter headline for the hero band",
"heroLede": "One sentence for the homepage.",
"heroPrimaryCta": { "label": "View slides ↗", "href": "https://..." }
```

## Step 4: Verify

- Run `python3 -m json.tool data/posts.json` — must parse cleanly.
- Preview: `python3 -m http.server` → `http://localhost:8000/media.html`
- Confirm format badge (Writing / Talk / Video), sort order, and filter tabs work.
- Update `llms.txt` if the item is a major new piece worth surfacing to AI agents.

## Full field reference

| Field | Required | Notes |
|---|---|---|
| `id` | yes | kebab-case, unique, stable |
| `format` | yes | `writing`, `talk`, or `video` |
| `title` | yes | card headline |
| `excerpt` | yes | 1-2 sentences under the title |
| `date` | yes | `YYYY-MM-DD` — sort order + date chip |
| `author` | yes | full name; use `"Susheem Koul & Tisha Chawla"` for joint work |
| `duration` | yes | e.g. `"6 min read"`, `"30 min talk"`, `"12 min"` |
| `tags` | no | array of strings; reserved for future filtering |
| `type` | yes | always `external` (full URL) |
| `url` | yes | `https://...` |
| `source` | yes | `YouTube`, conference name, platform name |
| `thumbnail` | no | OG image URL for card preview |
| `readTime` | no | deprecated alias for `duration` — prefer `duration` |

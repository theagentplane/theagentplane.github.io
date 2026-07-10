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

# agentplane.dev

Static marketing site for the AgentPlane org — landing page, projects, media gallery, and about/team. No build step: plain HTML/CSS/JS, ready to deploy as-is.

## Structure

```
agentplane-site/
├── assets/
│   ├── logo-mark.png                   nav logo
│   └── favicon.png                     browser tab icon
├── index.html                          landing page (dynamic hero + media teaser)
├── projects.html                       Chronicle + TokenOps detail
├── media.html                          writing, talks & videos gallery
├── blog.html                           redirect → media.html (legacy URL)
├── about.html                          team page
├── llms.txt                            AI-agent discovery index
├── sitemap.xml                         search engine sitemap
├── robots.txt                          crawl rules + llms.txt pointer
├── data/
│   ├── posts.json                      media gallery data
│   └── hero.json                       homepage hero config (auto / pinned / manual)
├── js/
│   ├── media.js                        renders media gallery from posts.json
│   ├── hero.js                         dynamic homepage hero
│   ├── nav.js                          mobile nav toggle
│   └── github-stars.js                 live star counts
├── css/
│   └── style.css                       shared stylesheet
└── claude-skills/
    ├── add-media-item/SKILL.md         add writing, talks, or videos
    └── add-blog-post/SKILL.md          deprecated alias → add-media-item
```

## Deploy to GitHub Pages — Option A (`theagentplane.github.io`)

1. Create a new repo in the org named exactly `theagentplane.github.io`.
2. Push the contents of this folder to the `main` branch:
   ```
   git init
   git remote add origin https://github.com/theagentplane/theagentplane.github.io.git
   git add .
   git commit -m "Initial site"
   git branch -M main
   git push -u origin main
   ```
3. In the repo's Settings → Pages, set Source to "Deploy from a branch," branch `main`, folder `/ (root)`. GitHub Pages auto-detects the special repo name and serves it at `https://theagentplane.github.io` within a few minutes — no Actions workflow needed.

### Custom domain (optional)

For `agentplane.dev` instead of the `github.io` URL: add a `CNAME` file at the repo root containing just the domain, then point your DNS at GitHub Pages (A records to GitHub's IPs, or a CNAME record to `theagentplane.github.io` for a subdomain). Full instructions: https://docs.github.com/pages/configuring-a-custom-domain-for-your-github-pages-site

## Can the repo be private?

Short answer: only on a paid plan, and it doesn't actually hide the site.

- On **GitHub Free** (what most small orgs are on), GitHub Pages only publishes from **public** repositories. A private repo on the free plan can't serve Pages at all.
- On **GitHub Team** or higher, private repos *can* serve Pages — but the **published site is still publicly accessible to anyone with the URL**. Private-repo Pages only hides the source code and commit history, not the live site. (GitHub Enterprise Cloud has an additional setting to restrict the *published site* to org members, but that's Enterprise-only and would defeat the point of a public marketing site anyway.)

Since this site has no secrets in it and the whole goal is for people to find it, I'd keep the repo public — you lose nothing by doing so, and it avoids a $4/user/month GitHub Team upgrade. If you'd still rather pay to hide the source: Settings → General → Danger Zone → "Change repository visibility" (repo must already exist on a Team-or-above plan).

## Restricting who can push to `main`

This is worth doing regardless of public/private, and it's free on any plan. Two layers:

**1. Collaborator access (probably already true).** Visibility (public/private) and push access are separate. Being public just means anyone can *view and clone* — it does not grant write access. Only people added as collaborators/org members with write permission can push, so if it's just the two of you in the `theagentplane` org with default permissions, no one else can push today regardless of visibility. Check: repo → Settings → Collaborators and teams.

**2. Branch protection (require PR + review before merging to `main`).**
1. Repo → Settings → Branches → "Add branch protection rule" (or "Add rule" / "Add ruleset" depending on GitHub's current UI).
2. Branch name pattern: `main`.
3. Enable "Require a pull request before merging."
4. Enable "Require approvals," set to at least 1.
5. Optionally enable "Do not allow bypassing the above settings" so it applies even to admins.
6. Save.

After this, changes to `main` must go through a PR that one of you approves — direct pushes to `main` are blocked even for the two of you, which is the standard way to get "only Tisha and I can approve changes" without touching who has repo access at all.

## The media gallery

`media.html` and the homepage media section fetch `data/posts.json` at runtime via `js/media.js`, sorted newest-first by `date`. Each entry has a **`format`**:

| `format` | What it covers |
|----------|----------------|
| `writing` | Articles linked externally (Substack, dev.to, LinkedIn, …) |
| `talk` | Conference presentations and slide decks |
| `video` | Recorded talks, demos, YouTube uploads |

Filter tabs on `media.html` let visitors browse by format. The homepage hero (`js/hero.js` + `data/hero.json`) promotes the latest item automatically when `mode` is `"auto"`.

**Previewing locally:** `fetch()` of local JSON is blocked under `file://`. Serve the folder instead:

```
python3 -m http.server
```

then open `http://localhost:8000/media.html`.

### Adding media

Use `claude-skills/add-media-item/SKILL.md` — hand it a talk URL, YouTube link, or published article URL and it adds the right `posts.json` entry.

Doing it by hand: append to `data/posts.json` following the schema in that skill. All media links point to external URLs (Substack, dev.to, YouTube, etc.).

## Editing everything else

Plain HTML — no templating engine. Team info lives in `about.html`, project descriptions in `projects.html`, the featured project cards in `index.html`. Shared colors/spacing/components live in `css/style.css` (CSS custom properties at the top control the whole palette).

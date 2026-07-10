# agentplane.dev

Static marketing site for the AgentPlane org — landing page, projects, blog gallery, and about/team. No build step: plain HTML/CSS/JS, ready to deploy as-is.

## Structure

```
agentplane-site/
├── index.html                          landing page
├── projects.html                       Chronicle + tokenops detail
├── blog.html                           blog gallery (renders from data/posts.json)
├── about.html                          team page
├── blog/
│   ├── chronicle-execution-dna.html    inline post
│   └── tokens-as-infrastructure.html   inline post
├── data/
│   └── posts.json                      blog gallery data — internal + external posts
├── js/
│   └── blog.js                         fetches posts.json, renders post cards
├── css/
│   └── style.css                       shared stylesheet
└── claude-skills/
    └── add-blog-post/SKILL.md          Claude skill for adding new posts (see below)
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

## The blog gallery

`blog.html` and the "From the blog" section on `index.html` don't contain hardcoded post markup — they fetch `data/posts.json` at load time and render cards from it (see `js/blog.js`), sorted newest-first by `date`. Each entry is either:

- **`"type": "internal"`** — a post that lives on this site, e.g. `blog/chronicle-execution-dna.html`. `url` is a relative path.
- **`"type": "external"`** — a link out to something published elsewhere (Substack, dev.to, LinkedIn, Medium, ...). `url` is the full external URL, and `source` sets the colored platform badge on the card. Unrecognized sources fall back to a neutral badge automatically.

**Previewing locally:** `fetch()` of a local JSON file is blocked under `file://`, so double-clicking `index.html` will show "Couldn't load posts." Serve the folder instead:
```
python3 -m http.server
```
then open `http://localhost:8000`.

### Adding a post

The `claude-skills/add-blog-post/SKILL.md` file in this repo is a ready-to-use Claude skill that does this for you — hand it raw text (or a draft) and it writes a new inline post + `posts.json` entry, or hand it an external link and it adds a gallery entry pointing out. To use it, copy the `claude-skills/add-blog-post/` folder to `.claude/skills/add-blog-post/` in your local checkout (it's shipped outside `.claude/` in this deliverable since dotfiles don't survive this handoff), then ask Claude to add a post and it'll pick up the skill automatically.

Doing it by hand: append an object to `data/posts.json` following the schema documented at the top of `SKILL.md` — for an internal post, also create the HTML file under `blog/` (copy `blog/chronicle-execution-dna.html` as a starting template).

## Editing everything else

Plain HTML — no templating engine. Team info lives in `about.html`, project descriptions in `projects.html`, the featured project cards in `index.html`. Shared colors/spacing/components live in `css/style.css` (CSS custom properties at the top control the whole palette).

/* ============================================================
   AgentPlane - dynamic homepage hero
   Loads data/hero.json + data/posts.json and renders the hero
   band on index.html.

   Modes (hero.json):
     auto   - newest post by date, or pinnedPostId if set
     pinned - post matching pinnedPostId
     manual - hero.json override object

   Usage:
     <div id="hero-content">…fallback HTML…</div>
     <script src="js/github-stars.js"></script>
     <script src="js/hero.js"></script>
   ============================================================ */

const AGENTPLANE_HERO_URL = 'data/hero.json';
const AGENTPLANE_HERO_POSTS_URL = 'data/posts.json';
const AGENTPLANE_HERO_PROJECTS_URL = 'data/projects.json';

async function agentplaneHeroFetchJson(url) {
  const res = await fetch(url, { cache: 'no-cache' });
  if (!res.ok) throw new Error(`${url}: ${res.status}`);
  return res.json();
}

function agentplaneHeroSortPosts(posts) {
  return posts.slice().sort((a, b) => new Date(b.date) - new Date(a.date));
}

function agentplaneHeroEscapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function agentplaneHeroYoutubeId(url) {
  const match = String(url).match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([A-Za-z0-9_-]{11})/);
  return match ? match[1] : null;
}

function agentplaneHeroYoutubeThumbnail(url) {
  const id = agentplaneHeroYoutubeId(url);
  return id ? `https://img.youtube.com/vi/${id}/maxresdefault.jpg` : null;
}

function agentplaneHeroResolveImage(content, post) {
  if (content.heroImage) return content.heroImage;
  if (post?.heroImage) return post.heroImage;
  const candidates = [
    content.primaryCta?.href,
    post?.heroPrimaryCta?.href,
    post?.url,
  ].filter(Boolean);
  for (const url of candidates) {
    const thumb = agentplaneHeroYoutubeThumbnail(url);
    if (thumb) return thumb;
  }
  return null;
}

function agentplaneHeroFormatEyebrow(post) {
  const labels = { writing: 'Latest writing', talk: 'Latest talk', video: 'Latest video' };
  return labels[post.format] || 'Latest';
}

function agentplaneHeroFromPost(post) {
  const isExternal = post.type === 'external' || String(post.url).startsWith('http');
  const primaryHref = post.heroPrimaryCta?.href || post.url;
  const primaryExternal = post.heroPrimaryCta
    ? primaryHref.startsWith('http')
    : isExternal;

  const defaultLabels = {
    writing: primaryExternal ? 'Read the post ↗' : 'Read the post',
    talk: 'View the talk ↗',
    video: 'Watch the video ↗',
  };
  const format = post.format || 'writing';

  return {
    eyebrow: post.heroEyebrow || agentplaneHeroFormatEyebrow(post),
    headline: post.heroHeadline || post.title,
    lede: post.heroLede || post.excerpt,
    heroImage: agentplaneHeroResolveImage({}, post),
    mediaBadge: post.duration
      ? `${post.duration} · ${(post.format === 'video' ? 'Video' : post.format === 'talk' ? 'Talk' : 'Writing')}`
      : null,
    primaryCta: {
      label: post.heroPrimaryCta?.label || defaultLabels[format] || defaultLabels.writing,
      href: primaryHref,
      external: primaryExternal,
    },
    secondaryCta: post.heroSecondaryCta || { label: 'Browse Media', href: 'media.html' },
  };
}

function agentplaneHeroResolve(config, posts) {
  if (config.mode === 'manual' && config.override) {
    return config.override;
  }

  let post = null;

  if (config.mode === 'pinned') {
    post = posts.find((p) => p.id === config.pinnedPostId) || null;
  } else if (config.mode === 'auto') {
    if (config.pinnedPostId) {
      post = posts.find((p) => p.id === config.pinnedPostId) || null;
    }
    if (!post && posts.length) {
      post = posts[0];
    }
  }

  if (post) return agentplaneHeroFromPost(post);
  const fallback = { ...config.fallback };
  if (!fallback.heroImage) {
    fallback.heroImage = agentplaneHeroResolveImage(fallback);
  }
  return fallback;
}

function agentplaneHeroLinkAttrs(cta) {
  const external = cta.external || (cta.href && cta.href.startsWith('http'));
  return external ? ' target="_blank" rel="noopener"' : '';
}

function agentplaneHeroRenderContent(content) {
  const root = document.getElementById('hero-content');
  if (!root) return;

  const secondary = content.secondaryCta;
  const secondaryHtml = secondary
    ? `<a href="${secondary.href}" class="btn btn-ghost"${agentplaneHeroLinkAttrs(secondary)}>${agentplaneHeroEscapeHtml(secondary.label)}</a>`
    : '';

  const imageUrl = content.heroImage;
  const imageAlt = content.headline ? `Thumbnail: ${content.headline}` : 'Featured media';
  const mediaHref = content.primaryCta.href;
  const mediaAttrs = agentplaneHeroLinkAttrs(content.primaryCta);
  const ytId = agentplaneHeroYoutubeId(mediaHref);
  const ytFallback = ytId ? ` onerror="this.onerror=null;this.src='https://img.youtube.com/vi/${ytId}/hqdefault.jpg'"` : '';
  const badgeHtml = content.mediaBadge
    ? `<span class="hero-media-badge">${agentplaneHeroEscapeHtml(content.mediaBadge)}</span>`
    : '';

  const mediaHtml = imageUrl
    ? `<a class="hero-media" href="${mediaHref}"${mediaAttrs} aria-label="${agentplaneHeroEscapeHtml(content.primaryCta.label)}">
        <img src="${imageUrl}" alt="${agentplaneHeroEscapeHtml(imageAlt)}" width="560" height="315" loading="eager" decoding="async"${ytFallback}>
        ${badgeHtml}
      </a>`
    : '';

  root.className = imageUrl ? 'hero-layout' : 'hero-copy-only';

  root.innerHTML = `
    <div class="hero-copy">
      <div class="eyebrow">${agentplaneHeroEscapeHtml(content.eyebrow)}</div>
      <h1>${agentplaneHeroEscapeHtml(content.headline)}</h1>
      <p class="lede">${agentplaneHeroEscapeHtml(content.lede)}</p>
      <div class="hero-actions">
        <a href="${content.primaryCta.href}" class="btn btn-solid"${agentplaneHeroLinkAttrs(content.primaryCta)}>${agentplaneHeroEscapeHtml(content.primaryCta.label)}</a>
        ${secondaryHtml}
      </div>
    </div>
    ${mediaHtml}
  `;
}

async function agentplaneHeroRenderStats(postCount, projects) {
  const postEl = document.getElementById('stat-post-count');
  const projectEl = document.getElementById('stat-project-count');
  const starsEl = document.getElementById('stat-github-stars');

  if (postEl) postEl.textContent = String(postCount);
  if (projectEl && projects?.length) projectEl.textContent = String(projects.length);

  if (!starsEl) return;

  const repos = typeof agentplaneProjectGithubRepos === 'function'
    ? agentplaneProjectGithubRepos(projects || [])
    : [];

  if (!repos.length || typeof agentplaneLoadStarCounts !== 'function') {
    starsEl.textContent = '-';
    return;
  }

  try {
    const counts = await agentplaneLoadStarCounts(repos);
    const total = repos.reduce((sum, repo) => sum + (counts[repo] || 0), 0);
    starsEl.textContent = total > 0 ? total.toLocaleString() : '-';
  } catch {
    starsEl.textContent = '-';
  }
}

async function renderHero() {
  const root = document.getElementById('hero-content');
  if (!root) return;

  try {
    const [config, postsRaw, projectsRaw] = await Promise.all([
      agentplaneHeroFetchJson(AGENTPLANE_HERO_URL),
      agentplaneHeroFetchJson(AGENTPLANE_HERO_POSTS_URL),
      agentplaneHeroFetchJson(AGENTPLANE_HERO_PROJECTS_URL).catch(() => []),
    ]);

    const posts = agentplaneHeroSortPosts(postsRaw);
    const content = agentplaneHeroResolve(config, posts);
    agentplaneHeroRenderContent(content);
    await agentplaneHeroRenderStats(posts.length, projectsRaw);
  } catch (err) {
    console.error(
      'AgentPlane: could not load hero. Serve the site with a local server; fetch() of local JSON is blocked under file://.',
      err
    );
  }
}

document.addEventListener('DOMContentLoaded', renderHero);

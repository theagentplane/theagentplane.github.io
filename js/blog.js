/* ============================================================
   AgentPlane — blog gallery renderer
   Fetches data/posts.json and renders post-row cards into any
   container. Mixes internal (hosted on this site) and external
   (Substack, dev.to, LinkedIn, Medium, ...) posts, sorted newest
   first by `date`.

   Usage:
     <div id="post-list" class="post-list"></div>
     <script src="js/blog.js"></script>
     <script>renderPostList('post-list');</script>       // all posts
     <script>renderPostList('post-list', 2);</script>    // latest 2
   ============================================================ */

const AGENTPLANE_POSTS_URL = 'data/posts.json';
const AGENTPLANE_KNOWN_SOURCES = ['agentplane', 'substack', 'devto', 'linkedin', 'medium'];

async function agentplaneLoadPosts() {
  try {
    const res = await fetch(AGENTPLANE_POSTS_URL, { cache: 'no-cache' });
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
    const posts = await res.json();
    return posts.slice().sort((a, b) => new Date(b.date) - new Date(a.date));
  } catch (err) {
    console.error(
      'AgentPlane: could not load data/posts.json. ' +
      'If you are opening this file directly (file://), run a local server instead, ' +
      'e.g. `python3 -m http.server` from the repo root — fetch() of local JSON is blocked under file://.',
      err
    );
    return null;
  }
}

function agentplaneFormatDate(iso) {
  const d = new Date(`${iso}T00:00:00`);
  return {
    month: d.toLocaleString('en-US', { month: 'short' }),
    day: d.getDate(),
    year: d.getFullYear(),
  };
}

function agentplaneEscapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function agentplaneSourceBadgeClass(source) {
  const key = String(source).toLowerCase().replace(/[^a-z]/g, '');
  return AGENTPLANE_KNOWN_SOURCES.includes(key) ? `source-${key}` : 'source-default';
}

function agentplaneRenderPostRow(post) {
  const { month, day, year } = agentplaneFormatDate(post.date);
  const isExternal = post.type === 'external';
  const linkAttrs = isExternal ? ' target="_blank" rel="noopener"' : '';
  const arrow = isExternal ? ' <span aria-hidden="true">↗</span>' : '';
  const title = agentplaneEscapeHtml(post.title);
  const excerpt = agentplaneEscapeHtml(post.excerpt);
  const author = agentplaneEscapeHtml(post.author);
  const readTime = agentplaneEscapeHtml(post.readTime);
  const source = agentplaneEscapeHtml(post.source);
  const badgeClass = agentplaneSourceBadgeClass(post.source);

  return `
    <div class="post-row">
      <div class="post-date">${month} ${day}<br>${year}</div>
      <div>
        <h3><a href="${post.url}"${linkAttrs}>${title}${arrow}</a></h3>
        <p>${excerpt}</p>
        <span class="post-meta">${author} · ${readTime} · <span class="source-badge ${badgeClass}">${source}</span></span>
      </div>
    </div>`;
}

async function renderPostList(containerId, limit) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = '<p style="font-family:var(--mono); font-size:13px; color:var(--text-faint);">Loading posts…</p>';

  const posts = await agentplaneLoadPosts();

  if (posts === null) {
    container.innerHTML = '<p style="font-family:var(--mono); font-size:13px; color:var(--text-faint);">Couldn\'t load posts. If you\'re previewing locally, serve this folder with a local server instead of opening the file directly.</p>';
    return;
  }

  const slice = limit ? posts.slice(0, limit) : posts;

  container.innerHTML = slice.length
    ? slice.map(agentplaneRenderPostRow).join('')
    : '<p style="font-family:var(--mono); font-size:13px; color:var(--text-faint);">No posts yet.</p>';
}

/* ============================================================
   AgentPlane — media gallery renderer
   Fetches data/posts.json and renders cards for writing,
   conference talks, and videos. Sorted newest-first by date.

   Usage:
     <div id="media-list" class="post-list"></div>
     <script src="js/media.js"></script>
     <script>renderMediaList('media-list');</script>        // all items
     <script>renderMediaList('media-list', 2);</script>   // latest 2
     <script>renderMediaList('media-list', null, 'talk');</script> // talks only
   ============================================================ */

const AGENTPLANE_MEDIA_URL = 'data/posts.json';
const AGENTPLANE_KNOWN_SOURCES = ['agentplane', 'substack', 'devto', 'linkedin', 'medium', 'youtube'];

const AGENTPLANE_FORMAT_LABELS = {
  writing: 'Writing',
  talk: 'Talk',
  video: 'Video',
};

async function agentplaneLoadMedia() {
  try {
    const res = await fetch(AGENTPLANE_MEDIA_URL, { cache: 'no-cache' });
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
    const items = await res.json();
    return items.slice().sort((a, b) => new Date(b.date) - new Date(a.date));
  } catch (err) {
    console.error(
      'AgentPlane: could not load data/posts.json. ' +
      'Serve the repo with a local server — fetch() of local JSON is blocked under file://.',
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

function agentplaneFormatBadgeClass(format) {
  const key = String(format || 'writing').toLowerCase();
  return ['writing', 'talk', 'video'].includes(key) ? `format-${key}` : 'format-writing';
}

function agentplaneIsExternalItem(item) {
  return item.type === 'external' || String(item.url).startsWith('http');
}

function agentplaneMediaYoutubeId(url) {
  const match = String(url).match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([A-Za-z0-9_-]{11})/);
  return match ? match[1] : null;
}

function agentplaneMediaThumbnail(item) {
  if (item.thumbnail || item.heroImage) return item.thumbnail || item.heroImage;
  const id = agentplaneMediaYoutubeId(item.url);
  return id ? `https://img.youtube.com/vi/${id}/maxresdefault.jpg` : null;
}

function agentplaneMediaThumbFallbackAttr(item) {
  const id = agentplaneMediaYoutubeId(item.url);
  return id ? ` onerror="this.onerror=null;this.src='https://img.youtube.com/vi/${id}/hqdefault.jpg'"` : '';
}

function agentplaneRenderMediaCard(item) {
  const isExternal = agentplaneIsExternalItem(item);
  const linkAttrs = isExternal ? ' target="_blank" rel="noopener"' : '';
  const format = item.format || 'writing';
  const formatLabel = AGENTPLANE_FORMAT_LABELS[format] || 'Writing';
  const formatClass = agentplaneFormatBadgeClass(format);
  const title = agentplaneEscapeHtml(item.title);
  const excerpt = agentplaneEscapeHtml(item.excerpt);
  const author = agentplaneEscapeHtml(item.author);
  const duration = agentplaneEscapeHtml(item.duration || item.readTime || '');
  const source = agentplaneEscapeHtml(item.source);
  const sourceClass = agentplaneSourceBadgeClass(item.source);
  const thumb = agentplaneMediaThumbnail(item);
  const thumbHtml = thumb
    ? `<div class="media-card-thumb"><img src="${thumb}" alt="" loading="lazy" decoding="async"${agentplaneMediaThumbFallbackAttr(item)}></div>`
    : `<div class="media-card-thumb media-card-thumb-fallback"><span>${formatLabel}</span></div>`;

  return `
    <a class="media-card" href="${item.url}"${linkAttrs} data-format="${format}">
      ${thumbHtml}
      <div class="media-card-body">
        <div class="media-card-badges">
          <span class="format-badge ${formatClass}">${formatLabel}</span>
          <span class="source-badge ${sourceClass}">${source}</span>
        </div>
        <h3>${title}${isExternal ? ' <span aria-hidden="true">↗</span>' : ''}</h3>
        <p>${excerpt}</p>
        <span class="media-card-meta">${author}${duration ? ` · ${duration}` : ''}</span>
      </div>
    </a>`;
}

function agentplaneRenderMediaRow(item) {
  const { month, day, year } = agentplaneFormatDate(item.date);
  const isExternal = agentplaneIsExternalItem(item);
  const linkAttrs = isExternal ? ' target="_blank" rel="noopener"' : '';
  const arrow = isExternal ? ' <span aria-hidden="true">↗</span>' : '';
  const format = item.format || 'writing';
  const formatLabel = AGENTPLANE_FORMAT_LABELS[format] || 'Writing';
  const duration = agentplaneEscapeHtml(item.duration || item.readTime || '');
  const title = agentplaneEscapeHtml(item.title);
  const excerpt = agentplaneEscapeHtml(item.excerpt);
  const author = agentplaneEscapeHtml(item.author);
  const source = agentplaneEscapeHtml(item.source);
  const sourceClass = agentplaneSourceBadgeClass(item.source);
  const formatClass = agentplaneFormatBadgeClass(format);

  return `
    <div class="post-row" data-format="${format}">
      <div class="post-date">${month} ${day}<br>${year}</div>
      <div>
        <h3><a href="${item.url}"${linkAttrs}>${title}${arrow}</a></h3>
        <p>${excerpt}</p>
        <span class="post-meta">${author}${duration ? ` · ${duration}` : ''} · <span class="format-badge ${formatClass}">${formatLabel}</span> · <span class="source-badge ${sourceClass}">${source}</span></span>
      </div>
    </div>`;
}

function agentplaneFilterMedia(items, formatFilter) {
  if (!formatFilter || formatFilter === 'all') return items;
  return items.filter((item) => (item.format || 'writing') === formatFilter);
}

async function renderMediaList(containerId, limit, formatFilter) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = '<p style="font-family:var(--mono); font-size:13px; color:var(--text-faint);">Loading…</p>';

  const allItems = await agentplaneLoadMedia();

  if (allItems === null) {
    container.innerHTML = '<p style="font-family:var(--mono); font-size:13px; color:var(--text-faint);">Couldn\'t load media. Serve this folder with a local server instead of opening files directly.</p>';
    return;
  }

  const filtered = agentplaneFilterMedia(allItems, formatFilter);
  const slice = limit ? filtered.slice(0, limit) : filtered;
  const useCards = container.classList.contains('media-card-grid');

  container.innerHTML = slice.length
    ? slice.map(useCards ? agentplaneRenderMediaCard : agentplaneRenderMediaRow).join('')
    : '<p style="font-family:var(--mono); font-size:13px; color:var(--text-faint);">Nothing here yet.</p>';
}

function initMediaFilters(listContainerId) {
  const bar = document.getElementById('media-filters');
  if (!bar) return;

  bar.querySelectorAll('[data-filter]').forEach((btn) => {
    btn.addEventListener('click', () => {
      bar.querySelectorAll('[data-filter]').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      renderMediaList(listContainerId, null, filter === 'all' ? null : filter);
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('media-filters')) {
    initMediaFilters('media-list');
  }
});

/* Back-compat alias */
async function renderPostList(containerId, limit) {
  return renderMediaList(containerId, limit);
}

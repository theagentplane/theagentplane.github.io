/* ============================================================
   AgentPlane - project list + alphabetical index slider
   Fetches data/projects.json. Projects sort A→Z by name.

   Homepage:
     <nav id="home-project-index" class="project-index"></nav>
     <div id="home-projects" class="projects-panel card-grid"></div>

   Projects page:
     <nav id="project-index" class="project-index"></nav>
     <div class="projects-panel">…detail sections…</div>
   ============================================================ */

const AGENTPLANE_PROJECTS_URL = 'data/projects.json';

async function agentplaneLoadProjects() {
  try {
    const res = await fetch(AGENTPLANE_PROJECTS_URL, { cache: 'no-cache' });
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
    return res.json();
  } catch (err) {
    console.error(
      'AgentPlane: could not load data/projects.json. ' +
      'Serve the repo with a local server; fetch() of local JSON is blocked under file://.',
      err
    );
    return null;
  }
}

function agentplaneSortProjects(projects) {
  return projects.slice().sort((a, b) => a.name.localeCompare(b.name));
}

function agentplaneProjectGithubRepos(projects) {
  return projects.map((p) => p.github).filter(Boolean);
}

function agentplaneProjectAnchor(project) {
  const url = project.detailUrl || '';
  if (url.includes('#')) return url.split('#').pop();
  return project.id;
}

function agentplaneProjectEscapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function agentplaneRenderProjectCard(project) {
  const name = agentplaneProjectEscapeHtml(project.name);
  const initial = agentplaneProjectEscapeHtml(project.initial || project.name.charAt(0));
  const description = agentplaneProjectEscapeHtml(project.description);
  const anchor = agentplaneProjectAnchor(project);
  const detailUrl = project.detailUrl || `projects.html#${anchor}`;
  const accent = project.accent ? ` card-accent-${project.accent}` : '';
  const tags = (project.tags || [])
    .map((tag) => `<span class="tag">${agentplaneProjectEscapeHtml(tag)}</span>`)
    .join('');
  const github = project.github
    ? `<a href="https://github.com/${project.github}" target="_blank" rel="noopener">GitHub ↗</a>`
    : '';

  return `
    <div class="card${accent}" id="project-${anchor}" data-project-anchor="${anchor}">
      <div class="card-top">
        <div class="card-icon">${initial}</div>
        ${project.github ? `<span class="stars" data-github-repo="${project.github}" hidden></span>` : ''}
      </div>
      <h3>${name}</h3>
      <p>${description}</p>
      <div class="tag-row">${tags}</div>
      <div class="card-links">
        <a href="${detailUrl}">Learn more →</a>
        ${github}
      </div>
    </div>`;
}

function agentplaneUpdateProjectStat(count) {
  const el = document.getElementById('stat-project-count');
  if (el) el.textContent = String(count);
}

function agentplaneRenderProjectIndex(navEl, projects, panelEl) {
  if (!navEl || !projects.length) return;

  const buttons = projects.map((project) => {
    const anchor = agentplaneProjectAnchor(project);
    const name = agentplaneProjectEscapeHtml(project.name);
    const letter = agentplaneProjectEscapeHtml(project.name.charAt(0).toUpperCase());
    return `<button type="button" class="project-index-btn" data-project-anchor="${anchor}" aria-label="${name}">
      <span class="project-index-letter" aria-hidden="true">${letter}</span>
      <span class="project-index-name">${name}</span>
    </button>`;
  }).join('');

  navEl.innerHTML = `
    <span class="project-index-label">A–Z</span>
    <div class="project-index-track">
      <span class="project-index-thumb" aria-hidden="true"></span>
      ${buttons}
    </div>`;

  const track = navEl.querySelector('.project-index-track');
  const thumb = navEl.querySelector('.project-index-thumb');
  const btns = [...navEl.querySelectorAll('.project-index-btn')];

  function agentplaneMoveProjectThumb(activeBtn) {
    if (!activeBtn || !thumb || !track) return;
    btns.forEach((b) => {
      b.classList.toggle('is-active', b === activeBtn);
      b.setAttribute('aria-current', b === activeBtn ? 'true' : 'false');
    });

    const horizontal = window.matchMedia('(max-width: 640px)').matches;
    if (horizontal) {
      thumb.style.width = `${activeBtn.offsetWidth}px`;
      thumb.style.height = `${activeBtn.offsetHeight}px`;
      thumb.style.transform = `translateX(${activeBtn.offsetLeft}px)`;
    } else {
      thumb.style.width = '';
      thumb.style.height = `${activeBtn.offsetHeight}px`;
      thumb.style.transform = `translateY(${activeBtn.offsetTop}px)`;
    }
  }

  function agentplaneScrollToProject(anchor) {
    const target = panelEl.querySelector(`#${CSS.escape(anchor)}, #project-${CSS.escape(anchor)}`);
    if (!target) return;
    const navHeight = 72;
    const top = target.getBoundingClientRect().top + window.scrollY - navHeight - 16;
    window.scrollTo({ top, behavior: 'smooth' });
  }

  btns.forEach((btn) => {
    btn.addEventListener('click', () => {
      agentplaneMoveProjectThumb(btn);
      agentplaneScrollToProject(btn.dataset.projectAnchor);
    });
  });

  const targets = projects
    .map((p) => panelEl.querySelector(`#${CSS.escape(agentplaneProjectAnchor(p))}, #project-${CSS.escape(agentplaneProjectAnchor(p))}`))
    .filter(Boolean);

  if (targets.length && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible) return;
        const anchor = visible.target.id.replace(/^project-/, '');
        const match = btns.find((b) => b.dataset.projectAnchor === anchor || b.dataset.projectAnchor === visible.target.id);
        if (match) agentplaneMoveProjectThumb(match);
      },
      { rootMargin: '-20% 0px -55% 0px', threshold: [0, 0.25, 0.5] }
    );
    targets.forEach((el) => observer.observe(el));
  }

  agentplaneMoveProjectThumb(btns[0]);

  window.addEventListener('resize', () => {
    const active = btns.find((b) => b.classList.contains('is-active')) || btns[0];
    agentplaneMoveProjectThumb(active);
  });

  const hash = window.location.hash.replace('#', '');
  if (hash) {
    const match = btns.find((b) => b.dataset.projectAnchor === hash);
    if (match) {
      agentplaneMoveProjectThumb(match);
      requestAnimationFrame(() => agentplaneScrollToProject(hash));
    }
  }
}

async function renderProjectCards(containerId, indexId) {
  const container = document.getElementById(containerId);
  if (!container) return null;

  const projectsRaw = await agentplaneLoadProjects();
  if (!projectsRaw) return null;

  const projects = agentplaneSortProjects(projectsRaw);
  container.innerHTML = projects.map(agentplaneRenderProjectCard).join('');
  agentplaneUpdateProjectStat(projects.length);

  const indexEl = indexId ? document.getElementById(indexId) : null;
  const panelEl = container.closest('.projects-layout')?.querySelector('.projects-panel') || container;
  if (indexEl) agentplaneRenderProjectIndex(indexEl, projects, panelEl);

  if (typeof renderGithubStars === 'function') {
    await renderGithubStars();
  }

  return projects;
}

async function initProjectPageIndex(indexId) {
  const indexEl = document.getElementById(indexId);
  const panelEl = indexEl?.closest('.projects-layout')?.querySelector('.projects-panel');
  if (!indexEl || !panelEl) return null;

  const projectsRaw = await agentplaneLoadProjects();
  if (!projectsRaw) return null;

  const projects = agentplaneSortProjects(projectsRaw);
  agentplaneRenderProjectIndex(indexEl, projects, panelEl);

  if (typeof renderGithubStars === 'function') {
    await renderGithubStars();
  }

  return projects;
}

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('home-projects')) {
    renderProjectCards('home-projects', 'home-project-index');
  }
  if (document.getElementById('project-index')) {
    initProjectPageIndex('project-index');
  }
});

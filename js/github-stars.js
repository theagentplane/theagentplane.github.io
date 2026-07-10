/* ============================================================
   AgentPlane — live GitHub star counts
   Fetches public repo stats from the GitHub API on page load.
   Cached in sessionStorage for 30 minutes to stay within
   unauthenticated rate limits (60 req/hr per IP).

   Usage:
     <span class="stars" data-github-repo="theagentplane/chronicle"></span>
     <span class="stars" data-github-repo="theagentplane/chronicle" data-github-meta-tail="Python"></span>
   ============================================================ */

const AGENTPLANE_STARS_CACHE_KEY = 'agentplane-github-stars-v1';
const AGENTPLANE_STARS_TTL_MS = 30 * 60 * 1000;

function agentplaneReadStarsCache() {
  try {
    const raw = sessionStorage.getItem(AGENTPLANE_STARS_CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (Date.now() - parsed.fetchedAt > AGENTPLANE_STARS_TTL_MS) return null;
    return parsed.counts;
  } catch {
    return null;
  }
}

function agentplaneWriteStarsCache(counts) {
  try {
    sessionStorage.setItem(
      AGENTPLANE_STARS_CACHE_KEY,
      JSON.stringify({ fetchedAt: Date.now(), counts })
    );
  } catch {
    /* ignore quota errors */
  }
}

async function agentplaneFetchRepoStars(repo) {
  const res = await fetch(`https://api.github.com/repos/${repo}`, {
    headers: { Accept: 'application/vnd.github+json' },
  });
  if (!res.ok) throw new Error(`${repo}: ${res.status}`);
  const data = await res.json();
  return data.stargazers_count;
}

async function agentplaneLoadStarCounts(repos) {
  const cached = agentplaneReadStarsCache();
  const missing = repos.filter((repo) => !cached || cached[repo] == null);

  if (!missing.length) return cached;

  const counts = { ...(cached || {}) };
  await Promise.all(
    missing.map(async (repo) => {
      try {
        counts[repo] = await agentplaneFetchRepoStars(repo);
      } catch (err) {
        console.warn('AgentPlane: could not load stars for', repo, err);
      }
    })
  );

  agentplaneWriteStarsCache(counts);
  return counts;
}

function agentplaneFormatStars(count) {
  const label = count === 1 ? 'star' : 'stars';
  return `★ ${count.toLocaleString()} ${label}`;
}

async function renderGithubStars() {
  const els = [...document.querySelectorAll('[data-github-repo]')];
  if (!els.length) return;

  const repos = [...new Set(els.map((el) => el.dataset.githubRepo))];
  const counts = await agentplaneLoadStarCounts(repos);

  els.forEach((el) => {
    const count = counts?.[el.dataset.githubRepo];
    if (count == null) {
      el.remove();
      return;
    }

    const tail = el.dataset.githubMetaTail ? ` · ${el.dataset.githubMetaTail}` : '';
    el.textContent = `${agentplaneFormatStars(count)}${tail}`;
    el.hidden = false;
  });
}

document.addEventListener('DOMContentLoaded', renderGithubStars);

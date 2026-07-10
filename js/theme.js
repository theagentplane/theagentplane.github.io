/* ============================================================
   AgentPlane — theme switcher (light / dark slider)
   Load theme-init.js synchronously in <head> before CSS.
   ============================================================ */

(function () {
  const KEY = 'agentplane-theme';

  const AGENTPLANE_SUN_ICON = `<svg class="theme-switch-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>`;

  const AGENTPLANE_MOON_ICON = `<svg class="theme-switch-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;

  function agentplaneCurrentTheme() {
    return document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
  }

  function agentplaneSyncSwitchUi(theme) {
    document.querySelectorAll('.theme-switch').forEach((btn) => {
      const isDark = theme === 'dark';
      btn.setAttribute('aria-checked', isDark ? 'true' : 'false');
      btn.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
      btn.setAttribute('title', isDark ? 'Switch to light mode' : 'Switch to dark mode');
    });
  }

  function agentplaneApplyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(KEY, theme);
    agentplaneSyncSwitchUi(theme);
  }

  function agentplaneToggleTheme() {
    agentplaneApplyTheme(agentplaneCurrentTheme() === 'dark' ? 'light' : 'dark');
  }

  function agentplanePlaceThemeSwitch(btn, container, navLinks, hamburger) {
    const firstNavLink = navLinks?.querySelector('a');
    const mobile = window.matchMedia('(max-width: 640px)').matches;

    if (mobile && hamburger) {
      container.insertBefore(btn, hamburger);
      return;
    }

    if (firstNavLink && navLinks) {
      navLinks.insertBefore(btn, firstNavLink);
      return;
    }

    if (navLinks) {
      navLinks.prepend(btn);
      return;
    }

    container.appendChild(btn);
  }

  function agentplaneMountThemeSwitch() {
    document.querySelectorAll('.site-nav .container').forEach((container) => {
      let btn = container.querySelector('.theme-switch');

      if (!btn) {
        btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'theme-switch';
        btn.setAttribute('role', 'switch');
        btn.innerHTML = `<span class="theme-switch-track">${AGENTPLANE_SUN_ICON}<span class="theme-switch-thumb"></span>${AGENTPLANE_MOON_ICON}</span>`;
        btn.addEventListener('click', agentplaneToggleTheme);
      }

      const hamburger = container.querySelector('.nav-toggle');
      const navLinks = container.querySelector('.nav-links');

      agentplanePlaceThemeSwitch(btn, container, navLinks, hamburger);
      agentplaneSyncSwitchUi(agentplaneCurrentTheme());
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    agentplaneMountThemeSwitch();
    window.matchMedia('(max-width: 640px)').addEventListener('change', agentplaneMountThemeSwitch);
  });
})();

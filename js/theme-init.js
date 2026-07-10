(function () {
  const KEY = 'agentplane-theme';
  let theme = localStorage.getItem(KEY);
  if (!theme) {
    theme = 'dark';
  }
  document.documentElement.setAttribute('data-theme', theme);
})();

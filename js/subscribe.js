/* ============================================================
   AgentPlane - newsletter subscribe block

   Renders into every <div data-subscribe></div> on the page.

   TO TURN THE NEWSLETTER ON: create the publication, then set
   AGENTPLANE_SUBSTACK_PUB below to its handle. That is the only change.
   While it is empty nothing renders, so the site can never ship a
   subscribe button pointing at a publication that does not exist.
   ============================================================ */

(function () {
  // e.g. 'theagentplane' -> https://theagentplane.substack.com
  const AGENTPLANE_SUBSTACK_PUB = '';

  const AGENTPLANE_COPY = {
    heading: 'Get the next one in your inbox',
    body:
      'Occasional writing on agent observability, replay testing and token ' +
      'infrastructure. What we learned building it, not release notes.',
    cta: 'Subscribe',
  };

  const AGENTPLANE_MAIL_ICON =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
    'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ' +
    'class="subscribe-icon"><rect x="2" y="4" width="20" height="16" rx="2"/>' +
    '<path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>';

  function agentplaneSubscribeMarkup(url) {
    return [
      '<div class="subscribe-card">',
      AGENTPLANE_MAIL_ICON,
      '<div class="subscribe-text">',
      '<h3>' + AGENTPLANE_COPY.heading + '</h3>',
      '<p>' + AGENTPLANE_COPY.body + '</p>',
      '</div>',
      '<a class="btn btn-solid subscribe-cta" href="' + url + '"',
      ' target="_blank" rel="noopener">' + AGENTPLANE_COPY.cta + ' &#8599;</a>',
      '</div>',
    ].join('');
  }

  function agentplaneRenderSubscribe() {
    const pub = AGENTPLANE_SUBSTACK_PUB.trim();
    const slots = document.querySelectorAll('[data-subscribe]');
    if (!pub || !slots.length) return;

    const url = 'https://' + pub + '.substack.com/subscribe';
    slots.forEach(function (slot) {
      slot.innerHTML = agentplaneSubscribeMarkup(url);
      slot.removeAttribute('hidden');
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', agentplaneRenderSubscribe);
  } else {
    agentplaneRenderSubscribe();
  }
})();

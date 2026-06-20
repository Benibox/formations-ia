/* Bandeau de consentement cookies — Benam AI
   Couplé à Google Consent Mode v2 : GA reste "denied" tant que l'utilisateur n'a pas accepté. */
(function () {
  var KEY = 'cookie-consent';
  if (localStorage.getItem(KEY)) return; // choix déjà fait, pas de bandeau

  var css = ''
    + '.cc-banner{position:fixed;left:0;right:0;bottom:0;z-index:9999;background:#FAFAF8;'
    + 'border-top:1px solid #E6E0D8;box-shadow:0 -4px 24px rgba(0,0,0,.08);padding:16px 24px;'
    + 'display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap;'
    + "font-family:'DM Sans',-apple-system,BlinkMacSystemFont,sans-serif;transition:transform .3s ease}"
    + '.cc-banner.cc-hide{transform:translateY(130%)}'
    + '.cc-text{margin:0;font-size:.9rem;color:#1A1A1A;line-height:1.5;max-width:680px}'
    + '.cc-text a{color:#C45D3E;text-decoration:underline}'
    + '.cc-actions{display:flex;gap:10px;flex-shrink:0}'
    + '.cc-btn{padding:10px 22px;border-radius:50px;font-size:.85rem;font-weight:600;cursor:pointer;'
    + 'border:1px solid transparent;font-family:inherit;transition:opacity .2s}'
    + '.cc-refuse{background:transparent;border-color:#D8D2C8;color:#1A1A1A}'
    + '.cc-accept{background:#C45D3E;color:#fff}'
    + '.cc-btn:hover{opacity:.85}'
    + '@media(max-width:600px){.cc-banner{padding:14px 16px}.cc-actions{width:100%}.cc-btn{flex:1}}';
  var style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  var bar = document.createElement('div');
  bar.className = 'cc-banner';
  bar.setAttribute('role', 'dialog');
  bar.setAttribute('aria-label', 'Consentement cookies');
  bar.innerHTML =
      '<p class="cc-text">🍪 Ce site utilise des cookies de mesure d’audience (Google Analytics) '
    + 'pour comprendre comment il est utilisé. Vous pouvez accepter ou refuser. '
    + '<a href="/mentions-legales">En savoir plus</a></p>'
    + '<div class="cc-actions">'
    + '<button class="cc-btn cc-refuse" type="button">Refuser</button>'
    + '<button class="cc-btn cc-accept" type="button">Accepter</button>'
    + '</div>';
  document.body.appendChild(bar);

  function choose(value) {
    try { localStorage.setItem(KEY, value); } catch (e) {}
    if (value === 'granted' && typeof window.gtag === 'function') {
      window.gtag('consent', 'update', { 'analytics_storage': 'granted' });
    }
    bar.classList.add('cc-hide');
    setTimeout(function () { if (bar.parentNode) bar.parentNode.removeChild(bar); }, 320);
  }
  bar.querySelector('.cc-accept').addEventListener('click', function () { choose('granted'); });
  bar.querySelector('.cc-refuse').addEventListener('click', function () { choose('denied'); });
})();

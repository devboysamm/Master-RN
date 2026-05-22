/* ==========================================================================
   Master RN — legal page loader (shared by Terms + Privacy)
   Fetches admin-managed content from the public backend endpoint and renders
   it. Never leaves a broken page: any failure / empty body falls back to a
   clean "available soon" message.

   Each page provides config on the <body data-*> attributes:
     data-legal-key   "terms" | "privacy"
     data-legal-name  human label used in the fallback message, e.g. "Terms"
   ========================================================================== */
(function () {
  var API_BASE = 'https://api.masterreactnative.dev';

  var body = document.body;
  var key = body.getAttribute('data-legal-key');
  var name = body.getAttribute('data-legal-name') || 'This content';

  var contentEl = document.getElementById('legal-content');
  var stateEl = document.getElementById('legal-state');
  var updatedEl = document.getElementById('legal-updated');

  function showFallback() {
    if (contentEl) contentEl.innerHTML = '';
    if (updatedEl) updatedEl.textContent = '';
    if (stateEl) {
      stateEl.innerHTML =
        '<h2>' + name + ' will be available soon</h2>' +
        '<p>We’re putting the finishing touches on this page. Please check back shortly.</p>';
      stateEl.style.display = 'block';
    }
  }

  function showContent(html, updatedAt) {
    if (stateEl) stateEl.style.display = 'none';
    if (contentEl) {
      // Trusted, admin-only content (same source the mobile app renders as HTML).
      contentEl.innerHTML = html;
    }
    if (updatedEl && updatedAt) {
      var d = new Date(updatedAt);
      if (!isNaN(d.getTime())) {
        updatedEl.textContent = 'Last updated ' + d.toLocaleDateString(undefined, {
          year: 'numeric', month: 'long', day: 'numeric'
        });
      }
    }
  }

  if (!key) { showFallback(); return; }

  fetch(API_BASE + '/api/legal/' + key, { headers: { Accept: 'application/json' } })
    .then(function (res) {
      if (!res.ok) throw new Error('HTTP ' + res.status);
      return res.json();
    })
    .then(function (json) {
      var data = (json && json.data) ? json.data : null;
      var text = data && typeof data.body === 'string' ? data.body.trim() : '';
      if (text) {
        showContent(text, data.updated_at);
      } else {
        showFallback();
      }
    })
    .catch(function () {
      // Network / server / parse error — never show a broken page.
      showFallback();
    });
})();

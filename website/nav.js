// Sidebar drawer toggle. Used on every page that ships the .hamburger button
// and the #drawer aside. No dependencies, no build step.
(function () {
  var hamburger = document.querySelector('.hamburger');
  var drawer = document.getElementById('drawer');
  if (!hamburger || !drawer) return;

  function open() {
    document.body.classList.add('drawer-open');
    hamburger.setAttribute('aria-expanded', 'true');
    drawer.setAttribute('aria-hidden', 'false');
    // Move focus into the drawer for keyboard users.
    var closeBtn = drawer.querySelector('.drawer-close');
    if (closeBtn) closeBtn.focus();
  }
  function close() {
    document.body.classList.remove('drawer-open');
    hamburger.setAttribute('aria-expanded', 'false');
    drawer.setAttribute('aria-hidden', 'true');
    hamburger.focus();
  }

  hamburger.addEventListener('click', open);

  // Backdrop + close button + any element flagged [data-drawer-close].
  Array.prototype.forEach.call(
    document.querySelectorAll('[data-drawer-close]'),
    function (el) { el.addEventListener('click', close); }
  );

  // Clicking any in-drawer link should also close it (so on-page jumps feel
  // natural). External / new-tab links close before navigating away.
  Array.prototype.forEach.call(
    drawer.querySelectorAll('a'),
    function (a) { a.addEventListener('click', close); }
  );

  // Esc closes the drawer.
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && document.body.classList.contains('drawer-open')) {
      close();
    }
  });
})();

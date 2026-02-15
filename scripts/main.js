(function () {
  const navLinks = Array.from(document.querySelectorAll('#global-nav a'));
  const sections = navLinks
    .map(function (link) {
      const id = link.getAttribute('href');
      return id ? document.querySelector(id) : null;
    })
    .filter(Boolean);

  if (!sections.length || !navLinks.length) {
    return;
  }

  const setActiveLink = function (id) {
    navLinks.forEach(function (link) {
      const isMatch = link.getAttribute('href') === '#' + id;
      link.classList.toggle('is-active', isMatch);
      if (isMatch) {
        link.setAttribute('aria-current', 'page');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  };

  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          setActiveLink(entry.target.id);
        }
      });
    },
    {
      rootMargin: '-35% 0px -50% 0px',
      threshold: 0.02,
    }
  );

  sections.forEach(function (section) {
    observer.observe(section);
  });
})();

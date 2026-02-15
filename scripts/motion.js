(function () {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealNodes = document.querySelectorAll('[data-reveal]');

  if (!revealNodes.length) {
    return;
  }

  if (prefersReducedMotion) {
    revealNodes.forEach(function (node) {
      node.classList.add('is-visible');
    });
    return;
  }

  const observer = new IntersectionObserver(
    function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    },
    {
      rootMargin: '0px 0px -10% 0px',
      threshold: 0.15,
    }
  );

  revealNodes.forEach(function (node) {
    observer.observe(node);
  });
})();

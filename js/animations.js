/* ============================================
   NEXUS DASHBOARD — Scroll & Entrance Animations
   ============================================ */

const Animations = (() => {
  let observer = null;

  function init() {
    setupIntersectionObserver();
    setupRippleEffects();
    setupProgressBars();
  }

  function setupIntersectionObserver() {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.15,
    };

    observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animated');

          // Trigger counter animation for stat cards
          const counters = entry.target.querySelectorAll('[data-counter]');
          if (counters.length > 0) {
            counters.forEach(el => {
              if (el.dataset.animated === 'true') return;
              el.dataset.animated = 'true';
              const target = parseFloat(el.dataset.counter);
              Counters.animateValue(el, target, {
                prefix: el.dataset.prefix || '',
                suffix: el.dataset.suffix || '',
                decimals: parseInt(el.dataset.decimals || '0', 10),
              });
            });
          }

          // Animate progress bars inside this element
          const progressBars = entry.target.querySelectorAll('.progress-bar__fill');
          progressBars.forEach(bar => {
            const width = bar.dataset.width || '0%';
            bar.style.width = width;
          });

          observer.unobserve(entry.target);
        }
      });
    }, options);

    // Observe all elements with animate-on-scroll class
    document.querySelectorAll('.animate-on-scroll').forEach(el => {
      observer.observe(el);
    });
  }

  function setupRippleEffects() {
    document.querySelectorAll('.btn-ripple').forEach(btn => {
      btn.addEventListener('click', function(e) {
        const rect = this.getBoundingClientRect();
        const ripple = document.createElement('span');
        ripple.classList.add('ripple-effect');

        const size = Math.max(rect.width, rect.height);
        ripple.style.width = ripple.style.height = `${size}px`;
        ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
        ripple.style.top = `${e.clientY - rect.top - size / 2}px`;

        this.appendChild(ripple);

        ripple.addEventListener('animationend', () => {
          ripple.remove();
        });
      });
    });
  }

  function setupProgressBars() {
    // Progress bars will be animated by the intersection observer
    document.querySelectorAll('.progress-bar__fill').forEach(bar => {
      const targetWidth = bar.style.width || bar.dataset.width;
      bar.dataset.width = targetWidth;
      bar.style.width = '0%';
    });
  }

  return { init };
})();

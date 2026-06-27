/* ============================================
   NEXUS DASHBOARD — Number Count-Up Animations
   ============================================ */

const Counters = (() => {
  const defaults = {
    duration: 2000,
    easing: 'easeOutExpo',
  };

  // Easing function — exponential ease out
  function easeOutExpo(t) {
    return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
  }

  /**
   * Animate a number from 0 to target
   * @param {HTMLElement} el - Element to animate
   * @param {number} target - Target number
   * @param {object} options - { prefix, suffix, decimals, duration }
   */
  function animateValue(el, target, options = {}) {
    const {
      prefix = '',
      suffix = '',
      decimals = 0,
      duration = defaults.duration,
    } = options;

    let startTime = null;
    const startValue = 0;

    function update(timestamp) {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutExpo(progress);
      const currentValue = startValue + (target - startValue) * easedProgress;

      if (decimals > 0) {
        el.textContent = prefix + currentValue.toFixed(decimals) + suffix;
      } else {
        el.textContent = prefix + Math.floor(currentValue).toLocaleString() + suffix;
      }

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  }

  function init() {
    // Will be triggered by IntersectionObserver in animations.js
    // This just exposes the animateValue function
  }

  /**
   * Auto-detect and animate all [data-counter] elements in view
   */
  function animateAll() {
    const counters = document.querySelectorAll('[data-counter]');
    counters.forEach(el => {
      if (el.dataset.animated === 'true') return;
      el.dataset.animated = 'true';

      const target = parseFloat(el.dataset.counter);
      const prefix = el.dataset.prefix || '';
      const suffix = el.dataset.suffix || '';
      const decimals = parseInt(el.dataset.decimals || '0', 10);

      animateValue(el, target, { prefix, suffix, decimals });
    });
  }

  return { init, animateValue, animateAll };
})();

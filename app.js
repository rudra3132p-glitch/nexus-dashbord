/* ============================================
   NEXUS DASHBOARD — Main Application
   ============================================ */

const App = (() => {
  function init() {
    Sidebar.init();
    Counters.init();
    Animations.init();

    // Small delay for Chart.js to be ready
    setTimeout(() => {
      Charts.init();
    }, 100);

    setupThemeToggle();
    setupGaugeAnimation();
    setupGreeting();
    setupRevenueTabs();
    setupSearchShortcut();
    setupSearchFilter();
  }

  function setupThemeToggle() {
    const toggles = document.querySelectorAll('.header__theme-toggle');
    toggles.forEach(toggle => {
      toggle.addEventListener('click', () => {
        toggle.classList.toggle('light');
        // If it's the main theme toggle in the header (has id or specific position), we could toggle body theme.
        // For now, it just toggles the switch visual state.
      });
    });
  }

  function setupRevenueTabs() {
    const tabs = document.querySelectorAll('.toggle-tab');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        const range = tab.dataset.range;
        if (range && typeof Charts !== 'undefined') {
          Charts.updateRevenueChart(range);
        }
      });
    });
  }

  function setupSearchShortcut() {
    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
          searchInput.focus();
        }
      }
    });
  }

  function setupSearchFilter() {
    const searchInput = document.getElementById('searchInput');
    const tableRows = document.querySelectorAll('.projects-table tbody tr');

    if (!searchInput || tableRows.length === 0) return;

    searchInput.addEventListener('input', (e) => {
      const term = e.target.value.toLowerCase();
      tableRows.forEach(row => {
        const text = row.textContent.toLowerCase();
        if (text.includes(term)) {
          row.style.display = '';
        } else {
          row.style.display = 'none';
        }
      });
    });
  }

  function setupGaugeAnimation() {
    const gaugeFill = document.querySelector('.gauge-ring__fill');
    if (!gaugeFill) {
      return;
    }

    // Calculate circumference (radius = 75, circumference = 2 * PI * 75)
    const circumference = 2 * Math.PI * 75;
    const score = 87;
    const offset = circumference - (score / 100) * circumference;

    gaugeFill.style.strokeDasharray = circumference;
    gaugeFill.style.strokeDashoffset = circumference;

    // Create intersection observer for gauge
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            gaugeFill.style.strokeDashoffset = offset;
          }, 300);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    const gaugeEl = document.querySelector('.gauge-ring');
    if (gaugeEl) {
      observer.observe(gaugeEl);
    }
  }

  function setupGreeting() {
    const greetingEl = document.querySelector('.page-header__greeting');
    if (!greetingEl) return;

    const hour = new Date().getHours();
    let greeting;

    if (hour < 12) greeting = 'Good Morning';
    else if (hour < 17) greeting = 'Good Afternoon';
    else greeting = 'Good Evening';

    greetingEl.textContent = `${greeting}, Rudra 👋`;
  }

  // Initialize on DOMContentLoaded
  document.addEventListener('DOMContentLoaded', init);

  return { init };
})();

/* ============================================
   NEXUS DASHBOARD — Sidebar Logic
   ============================================ */

const Sidebar = (() => {
  let isCollapsed = false;
  let isMobileOpen = false;

  function init() {
    const toggle = document.querySelector('.sidebar__toggle');
    const mobileToggle = document.querySelector('.header__mobile-toggle');
    const overlay = document.querySelector('.sidebar-overlay');
    const navItems = document.querySelectorAll('.sidebar__nav-item');

    if (toggle) {
      toggle.addEventListener('click', toggleCollapse);
    }

    if (mobileToggle) {
      mobileToggle.addEventListener('click', toggleMobile);
    }

    if (overlay) {
      overlay.addEventListener('click', closeMobile);
    }

    navItems.forEach(item => {
      item.addEventListener('click', () => {
        setActive(item);
        if (window.innerWidth <= 768) {
          closeMobile();
        }
      });
    });

    // Close mobile sidebar on resize
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768 && isMobileOpen) {
        closeMobile();
      }
    });
  }

  function toggleCollapse() {
    isCollapsed = !isCollapsed;
    document.body.classList.toggle('sidebar-collapsed', isCollapsed);
  }

  function toggleMobile() {
    const sidebar = document.querySelector('.sidebar');
    if (!sidebar) return;
    isMobileOpen = !isMobileOpen;
    sidebar.classList.toggle('mobile-open', isMobileOpen);
  }

  function closeMobile() {
    const sidebar = document.querySelector('.sidebar');
    if (!sidebar) return;
    isMobileOpen = false;
    sidebar.classList.remove('mobile-open');
  }

  function setActive(activeItem) {
    // 1. Update nav items
    document.querySelectorAll('.sidebar__nav-item').forEach(item => {
      item.classList.remove('active');
    });
    activeItem.classList.add('active');

    // 2. Update page sections
    const targetPageId = activeItem.dataset.page;
    console.log("setActive triggered. targetPageId:", targetPageId);
    if (!targetPageId) {
      console.log("Returning early: targetPageId is falsy");
      return;
    }

    const sections = document.querySelectorAll('.page-section');
    console.log("Found sections:", sections.length);
    sections.forEach(section => {
      console.log("Checking section:", section.dataset.pageSection);
      section.classList.remove('active');
      if (section.dataset.pageSection === targetPageId) {
        console.log("Match found! Adding active to", section.dataset.pageSection);
        section.classList.add('active');
        
        // Retrigger animations if the section has them
        const animatedElements = section.querySelectorAll('.animate-on-scroll');
        animatedElements.forEach(el => {
          el.classList.remove('visible');
          // small timeout to allow reflow
          setTimeout(() => el.classList.add('visible'), 50);
        });
      }
    });
  }

  return { init };
})();

(function () {
  'use strict';

  /* ---------------- Theme toggle ---------------- */
  var root = document.documentElement;
  var themeBtn = document.getElementById('switchTheme');
  var savedTheme = localStorage.getItem('sahana-theme') || 'light';

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    localStorage.setItem('sahana-theme', theme);
  }
  applyTheme(savedTheme);

  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      var current = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      applyTheme(current);
    });
  }

  /* ---------------- Mobile navigation ---------------- */
  var navToggle = document.getElementById('navToggle');
  var navMenu = document.getElementById('navMenu');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', function () {
      var isOpen = navMenu.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    navMenu.querySelectorAll('.nav-link').forEach(function (link) {
      link.addEventListener('click', function () {
        navMenu.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });

    // Close when clicking outside on mobile
    document.addEventListener('click', function (e) {
      if (!navMenu.contains(e.target) && !navToggle.contains(e.target) && navMenu.classList.contains('open')) {
        navMenu.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ---------------- Dynamic Typewriter Title ---------------- */
  var typewriterEl = document.getElementById('typewriterText');
  if (typewriterEl) {
    var titles = [
      'Junior Full Stack Developer',
      'Web Application Developer',
      'PHP & MySQL Specialist',
      'Full Stack Trainee',
      'Software Developer'
    ];
    var titleIdx = 0;
    var charIdx = 0;
    var isDeleting = false;
    var typingSpeed = 90;
    var deletingSpeed = 45;
    var holdAtEnd = 1900;
    var holdAtStart = 450;

    function runTypewriter() {
      var currentTitle = titles[titleIdx];

      if (isDeleting) {
        charIdx--;
        typewriterEl.textContent = currentTitle.substring(0, charIdx);
      } else {
        charIdx++;
        typewriterEl.textContent = currentTitle.substring(0, charIdx);
      }

      var nextDelay = isDeleting ? deletingSpeed : typingSpeed;

      if (!isDeleting && charIdx === currentTitle.length) {
        nextDelay = holdAtEnd;
        isDeleting = true;
      } else if (isDeleting && charIdx === 0) {
        isDeleting = false;
        titleIdx = (titleIdx + 1) % titles.length;
        nextDelay = holdAtStart;
      }

      setTimeout(runTypewriter, nextDelay);
    }

    // Initialize with first title typed
    typewriterEl.textContent = '';
    setTimeout(runTypewriter, 300);
  }

  /* ---------------- Navbar shadow on scroll ---------------- */
  var navbar = document.getElementById('navbar');
  function handleNavbarScroll() {
    if (!navbar) return;
    navbar.classList.toggle('scrolled', window.scrollY > 12);
  }
  handleNavbarScroll();
  window.addEventListener('scroll', handleNavbarScroll, { passive: true });

  /* ---------------- Back to top ---------------- */
  var backToTop = document.getElementById('backToTopButton');
  function handleBackToTop() {
    if (!backToTop) return;
    backToTop.classList.toggle('show', window.scrollY > 450);
  }
  handleBackToTop();
  window.addEventListener('scroll', handleBackToTop, { passive: true });
  if (backToTop) {
    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------------- Footer year ---------------- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------------- Scroll reveal animations ---------------- */
  var revealEls = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window && revealEls.length) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

    revealEls.forEach(function (el) { revealObserver.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in-view'); });
  }

  /* ---------------- Active nav link on scroll ---------------- */
  var sections = document.querySelectorAll('main section[id]');
  var navLinks = document.querySelectorAll('.nav-link');

  function setActiveLink(id) {
    navLinks.forEach(function (link) {
      link.classList.toggle('active', link.getAttribute('href') === '#' + id);
    });
  }

  if ('IntersectionObserver' in window && sections.length) {
    var navObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          setActiveLink(entry.target.id);
        }
      });
    }, { rootMargin: '-35% 0px -45% 0px', threshold: 0 });

    sections.forEach(function (section) { navObserver.observe(section); });
  }

  /* ---------------- Interactive Contact Form Handler ---------------- */
  window.handleContactSubmit = function () {
    var name = (document.getElementById('contactName') || {}).value || '';
    var email = (document.getElementById('contactEmail') || {}).value || '';
    var subject = (document.getElementById('contactSubject') || {}).value || '';
    var message = (document.getElementById('contactMessage') || {}).value || '';
    var feedback = document.getElementById('formFeedback');
    var submitBtn = document.getElementById('contactSubmitBtn');

    if (!name || !email || !message) return;

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Preparing Email...';
    }

    if (feedback) {
      feedback.style.display = 'block';
      feedback.className = 'form-feedback success';
      feedback.textContent = 'Thank you, ' + name + '! Launching your email client to deliver the message to Sahana...';
    }

    // Construct mailto link
    var mailtoUrl = 'mailto:sahanaramalingam20@gmail.com?subject=' +
      encodeURIComponent(subject || 'Portfolio Inquiry from ' + name) +
      '&body=' + encodeURIComponent('Sender: ' + name + ' (' + email + ')\n\n' + message);

    setTimeout(function () {
      window.location.href = mailtoUrl;
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<span>Message Sent</span> ✓';
      }
    }, 600);
  };

  /* ---------- Show floating-contact-dock on scroll ---------- */
  var contactDock = document.querySelector('.floating-contact-dock');
  if (contactDock) {
    var scrollThreshold = 300; // px from top before dock appears

    window.addEventListener('scroll', function () {
      if (window.scrollY > scrollThreshold) {
        contactDock.classList.add('visible');
      } else {
        contactDock.classList.remove('visible');
      }
    });
  }
})();

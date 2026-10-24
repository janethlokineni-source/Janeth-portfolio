/**
 * script.js — Janeth Portfolio
 * "THE RED ROOM — JANETH'S DIGITAL UNIVERSE"
 *
 * Modules:
 *  1. Navigation — scroll spy, mobile menu, keyboard nav
 *  2. Hero parallax — mouse/touch/gyro-based figurine tilt
 *  3. Reveal animations — IntersectionObserver fade-in
 *  4. Project filter — category filtering with animation
 *  5. Project modals — open, close, keyboard accessibility
 *  6. Contact form — validation + mailto fallback
 *  7. Coordinate labels — live mouse position readout
 */

'use strict';

/* ══════════════════════════════════════════════════════
   UTILITY: Check reduced motion preference
══════════════════════════════════════════════════════ */
const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ══════════════════════════════════════════════════════
   1. NAVIGATION
══════════════════════════════════════════════════════ */
(function initNav() {
  const nav         = document.getElementById('nav');
  const hamburger   = document.getElementById('nav-hamburger');
  const mobileMenu  = document.getElementById('nav-mobile');
  const navLinks    = document.querySelectorAll('.nav__link[data-section]');
  const mobileLinks = document.querySelectorAll('.nav__mobile-link[data-section]');
  const sections    = document.querySelectorAll('section[id]');

  let mobileOpen = false;

  // ── Sticky nav on scroll ──────────────────────────
  const handleNavScroll = () => {
    if (window.scrollY > 40) {
      nav.classList.add('nav--scrolled');
    } else {
      nav.classList.remove('nav--scrolled');
    }
  };
  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll();

  // ── Mobile menu toggle ────────────────────────────
  function openMobileMenu() {
    mobileOpen = true;
    hamburger.classList.add('nav__hamburger--open');
    hamburger.setAttribute('aria-expanded', 'true');
    mobileMenu.classList.add('nav__mobile--open');
    mobileMenu.removeAttribute('aria-hidden');
    document.body.style.overflow = 'hidden';
    // Focus first link
    const firstLink = mobileMenu.querySelector('.nav__mobile-link');
    if (firstLink) firstLink.focus();
  }

  function closeMobileMenu() {
    mobileOpen = false;
    hamburger.classList.remove('nav__hamburger--open');
    hamburger.setAttribute('aria-expanded', 'false');
    mobileMenu.classList.remove('nav__mobile--open');
    mobileMenu.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', () => {
    mobileOpen ? closeMobileMenu() : openMobileMenu();
  });

  // Close on mobile link click
  mobileLinks.forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });

  // Close on overlay click (clicking outside menu)
  document.addEventListener('click', (e) => {
    if (mobileOpen && !nav.contains(e.target)) {
      closeMobileMenu();
    }
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileOpen) closeMobileMenu();
  });

  // ── Active section highlighting (Intersection Observer) ──
  const observerOptions = {
    root: null,
    rootMargin: '-40% 0px -40% 0px',
    threshold: 0
  };

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        // Desktop links
        navLinks.forEach(link => {
          link.classList.toggle('nav__link--active', link.dataset.section === id);
        });
        // Mobile links
        mobileLinks.forEach(link => {
          link.classList.toggle('nav__mobile-link--active', link.dataset.section === id);
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => sectionObserver.observe(section));

})();

/* ══════════════════════════════════════════════════════
   2. HERO PARALLAX — IMAGE-BASED TILT INTERACTION
══════════════════════════════════════════════════════ */
(function initHeroParallax() {
  const heroSection = document.getElementById('hero');
  const frame       = document.getElementById('hero-frame');
  const imgWrap     = document.getElementById('hero-img-wrap');
  const glowBlob    = document.getElementById('hero-glow');
  const coordLabels = document.querySelectorAll('.hero__coord-label .hero__mono');

  if (!heroSection || !frame || prefersReducedMotion()) return;

  // Configuration — responsive, punchy, futuristic 3D tilt
  const CONFIG = {
    maxTiltX:     16,    // degrees vertical tilt
    maxTiltY:     22,    // degrees horizontal tilt
    maxTranslateX: 18,   // px lateral shift of img
    maxTranslateY: 14,   // px vertical shift of img
    perspective:  900,   // px — css perspective depth
    smoothing:    0.1,   // lerp factor — responsive & fluid
    glowScale:    1.35,  // glow size multiplier on hover
  };

  const chips = document.querySelectorAll('.hero__chip');
  let targetX = 0, targetY = 0;
  let currentX = 0, currentY = 0;
  let isPointerInside = false;
  let rafId = null;
  let idleTime = 0;

  // Apply perspective to the frame's parent
  if (frame.parentElement) {
    frame.parentElement.style.perspective = `${CONFIG.perspective}px`;
    frame.parentElement.style.perspectiveOrigin = 'center center';
  }

  // ── Lerp (linear interpolation) ──
  const lerp = (a, b, t) => a + (b - a) * t;

  // ── Animation loop ────────────────────────────────
  function animate() {
    idleTime += 0.025;
    // Ambient breathing drift when cursor is still
    const ambientX = Math.sin(idleTime) * 0.06;
    const ambientY = Math.cos(idleTime * 0.8) * 0.06;

    const effectiveTargetX = targetX + (isPointerInside ? 0 : ambientX);
    const effectiveTargetY = targetY + (isPointerInside ? 0 : ambientY);

    currentX = lerp(currentX, effectiveTargetX, CONFIG.smoothing);
    currentY = lerp(currentY, effectiveTargetY, CONFIG.smoothing);

    const hasMovement = Math.abs(currentX - effectiveTargetX) > 0.001 || Math.abs(currentY - effectiveTargetY) > 0.001;

    // Apply 3D rotation to frame
    frame.style.transform = `
      rotateX(${-currentX * CONFIG.maxTiltX}deg)
      rotateY(${currentY * CONFIG.maxTiltY}deg)
    `;

    // Shift the image slightly for depth parallax
    if (imgWrap) {
      imgWrap.style.transform = `
        translate3d(
          ${currentY * CONFIG.maxTranslateX}px,
          ${-currentX * CONFIG.maxTranslateY}px,
          20px
        )
      `;
    }

    // Parallax depth for floating chips
    if (chips.length) {
      chips.forEach((chip, i) => {
        const factor = (i + 1) * 6;
        chip.style.transform = `
          translate3d(${currentY * factor}px, ${-currentX * factor}px, ${25 + factor * 2}px)
        `;
      });
    }

    // Scale and shift the glow blob
    if (glowBlob) {
      const glowX = 50 + currentY * 18;
      const glowY = 50 + currentX * 12;
      const scale = isPointerInside ? CONFIG.glowScale : 1;
      glowBlob.style.background = `radial-gradient(ellipse at ${glowX}% ${glowY}%, rgba(240,45,58,0.30) 0%, rgba(240,45,58,0.06) 50%, transparent 70%)`;
      glowBlob.style.transform = `scale(${scale})`;
    }

    // Update coordinate labels
    if (coordLabels.length >= 2) {
      coordLabels[0].textContent = `X:${(currentY * 100).toFixed(2)}`;
      coordLabels[1].textContent = `Y:${(currentX * 100).toFixed(2)}`;
    }

    if (hasMovement || isPointerInside || true) {
      rafId = requestAnimationFrame(animate);
    } else {
      rafId = null;
    }
  }

  function startLoop() {
    if (!rafId) rafId = requestAnimationFrame(animate);
  }

  // ── Global Mouse Move Tracking (tracks cursor across the screen) ──
  window.addEventListener('mousemove', (e) => {
    const rect = heroSection.getBoundingClientRect();
    if (rect.bottom < -80 || rect.top > window.innerHeight + 80) return;

    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    targetX = Math.max(-1.2, Math.min(1.2, (e.clientY - centerY) / (window.innerHeight * 0.6)));
    targetY = Math.max(-1.2, Math.min(1.2, (e.clientX - centerX) / (window.innerWidth * 0.6)));
    isPointerInside = true;
    startLoop();
  }, { passive: true });

  // Reset when mouse leaves window
  document.addEventListener('mouseleave', () => {
    isPointerInside = false;
    targetX = 0;
    targetY = 0;
    startLoop();
  });

  // ── Touch / device orientation ────────────────────
  if ('DeviceOrientationEvent' in window) {
    window.addEventListener('deviceorientation', (e) => {
      if (!e.beta || !e.gamma) return;
      // Clamp tilt values
      targetX = Math.max(-1, Math.min(1, (e.beta  - 45) / 45));
      targetY = Math.max(-1, Math.min(1,  e.gamma       / 45));
      startLoop();
    }, { passive: true });
  }

  // ── Touch fallback (drag-like on touch) ──────────
  let touchStartX = 0, touchStartY = 0;

  heroSection.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  }, { passive: true });

  heroSection.addEventListener('touchmove', (e) => {
    const rect = heroSection.getBoundingClientRect();
    targetX = ((e.touches[0].clientY - rect.top)  / rect.height - 0.5) * 2;
    targetY = ((e.touches[0].clientX - rect.left) / rect.width  - 0.5) * 2;
    startLoop();
  }, { passive: true });

  heroSection.addEventListener('touchend', () => {
    targetX = 0;
    targetY = 0;
    startLoop();
  }, { passive: true });

  // Kick off initial loop
  startLoop();

})();

/* ══════════════════════════════════════════════════════
   3. REVEAL ANIMATIONS — Intersection Observer
══════════════════════════════════════════════════════ */
(function initReveal() {
  if (prefersReducedMotion()) {
    // Instantly show all elements
    document.querySelectorAll('[data-reveal]').forEach(el => {
      el.classList.add('revealed');
    });
    return;
  }

  const elements = document.querySelectorAll('[data-reveal]');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger siblings within the same parent
        const siblings = Array.from(entry.target.parentElement.querySelectorAll('[data-reveal]'));
        const index = siblings.indexOf(entry.target);
        const delay = index * 80; // 80ms stagger

        setTimeout(() => {
          entry.target.classList.add('revealed');
        }, delay);

        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    root: null,
    rootMargin: '0px 0px -80px 0px',
    threshold: 0.05
  });

  elements.forEach(el => revealObserver.observe(el));

})();

/* ══════════════════════════════════════════════════════
   4. PROJECT FILTER
══════════════════════════════════════════════════════ */
(function initProjectFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  if (!filterBtns.length || !projectCards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;

      // Update button states
      filterBtns.forEach(b => {
        b.classList.remove('filter-btn--active');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('filter-btn--active');
      btn.setAttribute('aria-pressed', 'true');

      // Show/hide cards with animation
      projectCards.forEach(card => {
        const cardCat = card.dataset.category;
        const show = filter === 'all' || cardCat === filter;

        if (show) {
          card.classList.remove('project-card--hidden');
          // Trigger re-animation
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          requestAnimationFrame(() => {
            card.style.transition = 'opacity 350ms ease, transform 350ms ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          });
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(10px)';
          setTimeout(() => {
            card.classList.add('project-card--hidden');
          }, 300);
        }
      });
    });

    // Keyboard support
    btn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        btn.click();
      }
    });
  });

})();

/* ══════════════════════════════════════════════════════
   5. PROJECT MODALS
══════════════════════════════════════════════════════ */
(function initModals() {
  const overlay       = document.getElementById('modal-overlay');
  const openBtns      = document.querySelectorAll('.project-overview-btn');
  const modals        = document.querySelectorAll('.modal');
  let activeModal     = null;
  let previousFocus   = null;

  // Map modal data-modal values to DOM ids
  const MODAL_MAP = {
    'epic-think':  'modal-epic-think',
    'brandshield': 'modal-brandshield',
    'hostel-care': 'modal-hostel-care',
  };

  // ── Open modal ────────────────────────────────────
  function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;

    previousFocus = document.activeElement;
    activeModal = modal;

    overlay.classList.add('modal-overlay--active');
    overlay.removeAttribute('aria-hidden');

    modal.classList.add('modal--active');
    modal.removeAttribute('aria-hidden');

    document.body.style.overflow = 'hidden';

    // Focus the close button
    const closeBtn = modal.querySelector('.modal__close');
    if (closeBtn) {
      setTimeout(() => closeBtn.focus(), 50);
    }

    // Trap focus
    document.addEventListener('keydown', trapFocus);
  }

  // ── Close modal ───────────────────────────────────
  function closeModal() {
    if (!activeModal) return;

    activeModal.classList.remove('modal--active');
    activeModal.setAttribute('aria-hidden', 'true');

    overlay.classList.remove('modal-overlay--active');
    overlay.setAttribute('aria-hidden', 'true');

    document.body.style.overflow = '';
    document.removeEventListener('keydown', trapFocus);

    // Return focus to the element that opened the modal
    if (previousFocus) {
      previousFocus.focus();
      previousFocus = null;
    }

    activeModal = null;
  }

  // ── Focus trap ────────────────────────────────────
  function trapFocus(e) {
    if (!activeModal) return;

    if (e.key === 'Escape') {
      closeModal();
      return;
    }

    if (e.key !== 'Tab') return;

    const focusableSelectors = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    const focusables = Array.from(activeModal.querySelectorAll(focusableSelectors));
    if (!focusables.length) return;

    const first = focusables[0];
    const last  = focusables[focusables.length - 1];

    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }

  // ── Bind open buttons ─────────────────────────────
  openBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.dataset.modal;
      const modalId = MODAL_MAP[key];
      if (modalId) openModal(modalId);
    });
  });

  // Also open by clicking the card itself (Enter/Space)
  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const btn = card.querySelector('.project-overview-btn');
        if (btn) btn.click();
      }
    });
  });

  // ── Bind close buttons ────────────────────────────
  const closeBtns = document.querySelectorAll('.modal__close');
  closeBtns.forEach(btn => {
    btn.addEventListener('click', closeModal);
  });

  // ── Close on overlay click ────────────────────────
  overlay.addEventListener('click', closeModal);

  // ── Close on Escape (global) ──────────────────────
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && activeModal) closeModal();
  });

})();

/* ══════════════════════════════════════════════════════
   6. CONTACT FORM — Validation + mailto fallback
══════════════════════════════════════════════════════ */
(function initContactForm() {
  const form         = document.getElementById('contact-form');
  const nameInput    = document.getElementById('form-name');
  const emailInput   = document.getElementById('form-email');
  const msgInput     = document.getElementById('form-message');
  const submitBtn    = document.getElementById('form-submit');
  const successEl    = document.getElementById('form-success');

  if (!form) return;

  // ── Field validation helpers ──────────────────────
  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  }

  function setError(input, errorId, message) {
    const errorEl = document.getElementById(errorId);
    input.classList.add('form__input--error');
    input.setAttribute('aria-invalid', 'true');
    if (errorEl) errorEl.textContent = message;
  }

  function clearError(input, errorId) {
    const errorEl = document.getElementById(errorId);
    input.classList.remove('form__input--error');
    input.removeAttribute('aria-invalid');
    if (errorEl) errorEl.textContent = '';
  }

  function validateField(input, errorId, validator, message) {
    if (!validator(input.value)) {
      setError(input, errorId, message);
      return false;
    }
    clearError(input, errorId);
    return true;
  }

  // ── Live validation on blur ───────────────────────
  nameInput.addEventListener('blur', () => {
    validateField(nameInput, 'name-error', v => v.trim().length >= 2, 'Please enter your name (at least 2 characters).');
  });

  emailInput.addEventListener('blur', () => {
    validateField(emailInput, 'email-error', v => isValidEmail(v), 'Please enter a valid email address.');
  });

  msgInput.addEventListener('blur', () => {
    validateField(msgInput, 'message-error', v => v.trim().length >= 10, 'Please write a message (at least 10 characters).');
  });

  // ── Clear errors on input ─────────────────────────
  [nameInput, emailInput, msgInput].forEach(input => {
    input.addEventListener('input', () => {
      if (input.classList.contains('form__input--error')) {
        input.classList.remove('form__input--error');
        input.removeAttribute('aria-invalid');
      }
    });
  });

  // ── Submit handler ────────────────────────────────
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Validate all fields
    const nameOk  = validateField(nameInput, 'name-error', v => v.trim().length >= 2, 'Please enter your name (at least 2 characters).');
    const emailOk = validateField(emailInput, 'email-error', v => isValidEmail(v), 'Please enter a valid email address.');
    const msgOk   = validateField(msgInput, 'message-error', v => v.trim().length >= 10, 'Please write a message (at least 10 characters).');

    if (!nameOk || !emailOk || !msgOk) {
      // Focus first error field
      if (!nameOk)  return nameInput.focus();
      if (!emailOk) return emailInput.focus();
      if (!msgOk)   return msgInput.focus();
      return;
    }

    // ── Build mailto link ─────────────────────────
    // NOTE: This is a frontend-only demo. A real backend would handle delivery.
    const subject = encodeURIComponent(`Portfolio contact from ${nameInput.value.trim()}`);
    const body    = encodeURIComponent(
      `Name: ${nameInput.value.trim()}\n` +
      `Email: ${emailInput.value.trim()}\n\n` +
      `Message:\n${msgInput.value.trim()}`
    );

    // Open user's mail client directly addressed to Janeth
    window.location.href = `mailto:janethlokineni@gmail.com?subject=${subject}&body=${body}`;

    // Show success message
    successEl.hidden = false;
    submitBtn.disabled = true;
    submitBtn.style.opacity = '0.5';

    // Reset form after a moment
    setTimeout(() => {
      form.reset();
      submitBtn.disabled = false;
      submitBtn.style.opacity = '';
      // Keep success visible until next interaction
    }, 3000);
  });

})();

/* ══════════════════════════════════════════════════════
   7. SMOOTH SCROLL for anchor links
══════════════════════════════════════════════════════ */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();

      const navHeight = document.getElementById('nav')?.offsetHeight || 72;
      const targetTop = target.getBoundingClientRect().top + window.scrollY - navHeight;

      if (prefersReducedMotion()) {
        window.scrollTo(0, targetTop);
      } else {
        window.scrollTo({ top: targetTop, behavior: 'smooth' });
      }
    });
  });
})();

/* ══════════════════════════════════════════════════════
   8. SKILL CHIP MICRO-INTERACTION (keyboard)
══════════════════════════════════════════════════════ */
(function initSkillChips() {
  document.querySelectorAll('.skill-chip[tabindex]').forEach(chip => {
    chip.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        chip.classList.toggle('skill-chip--active');
      }
    });
  });
})();

/* ══════════════════════════════════════════════════════
   9. HERO ENTRANCE ANIMATION (coordinate label counter)
══════════════════════════════════════════════════════ */
(function initHeroEntrance() {
  // Small animated entrance for the hero eyebrow label
  const eyebrow = document.querySelector('.hero__eyebrow');
  if (!eyebrow || prefersReducedMotion()) return;

  // Brief flash effect on page load
  setTimeout(() => {
    eyebrow.style.opacity = '1';
  }, 400);
})();

/* ══════════════════════════════════════════════════════
   10. HERO CYCLING TEXT (Typewriter Animation)
══════════════════════════════════════════════════════ */
(function initHeroCyclingText() {
  const target = document.getElementById('hero-cycling-text');
  if (!target) return;

  const roles = [
    'Web Developer in Progress',
    'Creative Problem Solver',
    'AI Explorer',
    'Future Entrepreneur'
  ];

  let roleIndex = 0;
  let charIndex = roles[0].length;
  let isDeleting = false;

  function type() {
    const currentRole = roles[roleIndex];

    if (isDeleting) {
      charIndex--;
      target.textContent = currentRole.substring(0, charIndex);
    } else {
      charIndex++;
      target.textContent = currentRole.substring(0, charIndex);
    }

    let typeSpeed = isDeleting ? 35 : 75;

    if (!isDeleting && charIndex === currentRole.length) {
      // Hold at full text
      typeSpeed = 2400;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      typeSpeed = 450;
    }

    setTimeout(type, typeSpeed);
  }

  // Start after brief initial presentation
  setTimeout(() => {
    isDeleting = true;
    type();
  }, 2200);
})();

/* ══════════════════════════════════════════════════════
   INIT LOG — development reference
══════════════════════════════════════════════════════ */
console.log(
  '%cJANETH. Portfolio\n%cThe Red Room — Digital Universe\n%c// script.js loaded successfully',
  'color:#F02D3A;font-family:monospace;font-size:16px;font-weight:bold;',
  'color:#A5A5AF;font-family:monospace;font-size:11px;',
  'color:#A5A5AF;font-family:monospace;font-size:10px;'
);

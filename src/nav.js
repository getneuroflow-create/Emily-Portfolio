/* ========================================
   NAVIGATION
   ======================================== */

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function initNav() {
  const nav = document.getElementById('mainNav');
  const hamburger = document.getElementById('navHamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const overlay = document.getElementById('mobileOverlay');
  const navLinks = document.querySelectorAll('.nav-links a[data-section]');
  const mobileLinks = document.querySelectorAll('.mobile-menu .mobile-links a');

  if (!nav) return;

  // ---- Scrolled state ----
  ScrollTrigger.create({
    trigger: document.body,
    start: 'top -80',
    onEnter: () => nav.classList.add('scrolled'),
    onLeaveBack: () => nav.classList.remove('scrolled'),
  });

  // ---- Active section highlighting ----
  const sections = ['about', 'services', 'testimonials', 'booking', 'contact'];
  sections.forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    
    ScrollTrigger.create({
      trigger: el,
      start: 'top center',
      end: 'bottom center',
      onEnter: () => setActiveLink(id),
      onEnterBack: () => setActiveLink(id),
    });
  });

  function setActiveLink(id) {
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('data-section') === id);
    });
  }

  // ---- Mobile menu ----
  function openMobile() {
    hamburger.classList.add('active');
    mobileMenu.classList.add('open');
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    
    // Animate links in
    gsap.fromTo(mobileMenu.querySelectorAll('.mobile-links a'), 
      { x: 40, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.4, stagger: 0.05, ease: 'power2.out', delay: 0.2 }
    );
  }

  function closeMobile() {
    hamburger.classList.remove('active');
    mobileMenu.classList.remove('open');
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (hamburger) {
    hamburger.addEventListener('click', () => {
      if (mobileMenu.classList.contains('open')) {
        closeMobile();
      } else {
        openMobile();
      }
    });
  }

  if (overlay) {
    overlay.addEventListener('click', closeMobile);
  }

  // Close on mobile link click
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeMobile();
    });
  });

  // ---- Nav logo entrance ----
  gsap.from(nav, {
    y: -100,
    opacity: 0,
    duration: 1,
    ease: 'power3.out',
    delay: 0.5,
  });
}

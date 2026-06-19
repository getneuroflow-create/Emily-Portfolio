/* ========================================
   MAIN ENTRY POINT
   Initializes all modules & syncs RAF loop
   ======================================== */

// Styles
import './styles/main.css';
import './styles/preloader.css';
import './styles/hero.css';
import './styles/sections.css';
import './styles/booking.css';
import './styles/animations.css';
// Bootstrap loaded via CDN in index.html

// GSAP & plugins
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Lenis smooth scroll
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

// Modules
import { initPreloader } from './preloader.js';
import { initHero } from './hero.js';
import { initNav } from './nav.js';
import { initAbout } from './about.js';
import { initServices } from './services.js';
import { initTestimonials } from './testimonials.js';
import { initBooking } from './booking.js';
import { initContact } from './contact.js';
import { initAnimations } from './animations.js';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// ---- Lenis Smooth Scroll ----
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  orientation: 'vertical',
  gestureOrientation: 'vertical',
  smoothWheel: true,
  wheelMultiplier: 1,
  touchMultiplier: 2,
  infinite: false,
});

// Sync Lenis with GSAP ScrollTrigger
lenis.on('scroll', ScrollTrigger.update);

gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});

gsap.ticker.lagSmoothing(0);

// ---- Cursor Glow ----
function initCursorGlow() {
  const glow = document.getElementById('cursorGlow');
  if (!glow || window.innerWidth < 768) return;
  
  let mouseX = 0, mouseY = 0;
  let glowX = 0, glowY = 0;
  
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });
  
  function animate() {
    glowX += (mouseX - glowX) * 0.08;
    glowY += (mouseY - glowY) * 0.08;
    glow.style.left = glowX + 'px';
    glow.style.top = glowY + 'px';
    requestAnimationFrame(animate);
  }
  animate();
}

// ---- Back to Top ----
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;
  
  ScrollTrigger.create({
    trigger: document.body,
    start: 'top -300',
    onEnter: () => btn.classList.add('visible'),
    onLeaveBack: () => btn.classList.remove('visible'),
  });
  
  btn.addEventListener('click', () => {
    lenis.scrollTo(0);
  });
}

// ---- Smooth Anchor Links ----
function initSmoothAnchors() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        lenis.scrollTo(target, { offset: -80 });
      }
    });
  });
}

// ---- Initialize Everything ----
function init() {
  // Start preloader first
  initPreloader(() => {
    // After preloader completes, initialize everything else
    document.body.classList.remove('loading');
    document.getElementById('mainContent').style.opacity = '1';
    
    initHero();
    initNav();
    initAbout();
    initServices();
    initTestimonials();
    initBooking();
    initContact();
    initAnimations();
    initCursorGlow();
    initBackToTop();
    initSmoothAnchors();
    
    // Refresh ScrollTrigger after everything is loaded
    ScrollTrigger.refresh();
  });
}

// Wait for DOM
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// Export lenis for other modules
export { lenis };

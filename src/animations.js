/* ========================================
   SHARED ANIMATION UTILITIES
   ScrollTrigger reveals, parallax, magnetic
   ======================================== */

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function initAnimations() {
  initScrollReveals();
  initParallax();
  initMagneticButtons();
  initSectionHeadingAnimations();
  initCTASection();
}

// ---- Generic Scroll Reveals ----
function initScrollReveals() {
  // Fade up
  gsap.utils.toArray('.anim-fade-up').forEach(el => {
    // Skip if already animated by a specific module
    if (el.closest('.services-grid') || el.closest('#bookingCalendar') || el.closest('#bookingSlots')) return;
    
    ScrollTrigger.create({
      trigger: el,
      start: 'top 88%',
      once: true,
      onEnter: () => {
        gsap.to(el, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
        });
      }
    });
  });

  // Fade left
  gsap.utils.toArray('.anim-fade-left').forEach(el => {
    ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        gsap.to(el, {
          opacity: 1,
          x: 0,
          duration: 0.8,
          ease: 'power3.out',
        });
      }
    });
  });

  // Fade right
  gsap.utils.toArray('.anim-fade-right').forEach(el => {
    ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        gsap.to(el, {
          opacity: 1,
          x: 0,
          duration: 0.8,
          ease: 'power3.out',
        });
      }
    });
  });

  // Scale up
  gsap.utils.toArray('.anim-scale-up').forEach(el => {
    ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        gsap.to(el, {
          opacity: 1,
          scale: 1,
          duration: 0.8,
          ease: 'back.out(1.7)',
        });
      }
    });
  });
}

// ---- Parallax ----
function initParallax() {
  gsap.utils.toArray('.parallax-layer').forEach(layer => {
    const speed = parseFloat(layer.getAttribute('data-speed')) || 0.05;
    
    gsap.to(layer, {
      y: () => ScrollTrigger.maxScroll(window) * speed,
      ease: 'none',
      scrollTrigger: {
        trigger: layer.closest('.section') || layer.closest('.hero') || document.body,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1,
        invalidateOnRefresh: true,
      }
    });
  });
}

// ---- Magnetic Buttons ----
function initMagneticButtons() {
  if (window.innerWidth < 768) return;
  
  document.querySelectorAll('.magnetic-wrap').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      gsap.to(btn, {
        x: x * 0.2,
        y: y * 0.2,
        duration: 0.3,
        ease: 'power2.out',
      });
    });

    btn.addEventListener('mouseleave', () => {
      gsap.to(btn, {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: 'elastic.out(1, 0.5)',
      });
    });
  });
}

// ---- Section Heading Animations ----
function initSectionHeadingAnimations() {
  document.querySelectorAll('.section-heading').forEach(heading => {
    const subtitle = heading.querySelector('.subtitle');
    const h2 = heading.querySelector('h2');
    const desc = heading.querySelector('.description');
    const underline = h2?.querySelector('::after');

    ScrollTrigger.create({
      trigger: heading,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        const tl = gsap.timeline();
        
        if (subtitle) {
          tl.from(subtitle, {
            opacity: 0,
            y: 30,
            duration: 0.6,
            ease: 'power2.out',
          }, 0);
        }
        
        if (h2) {
          tl.from(h2, {
            opacity: 0,
            y: 40,
            duration: 0.7,
            ease: 'power3.out',
          }, 0.15);
        }
        
        if (desc) {
          tl.from(desc, {
            opacity: 0,
            y: 30,
            duration: 0.6,
            ease: 'power2.out',
          }, 0.3);
        }
      }
    });
  });
}

// ---- CTA Section ----
function initCTASection() {
  const cta = document.getElementById('ctaSection');
  if (!cta) return;

  ScrollTrigger.create({
    trigger: cta,
    start: 'top 80%',
    once: true,
    onEnter: () => {
      gsap.from(cta.querySelectorAll('.anim-fade-up'), {
        opacity: 0,
        y: 40,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out',
      });
    }
  });
}

/* ========================================
   CONTACT — Map & Form Animations
   ======================================== */

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function initContact() {
  // Map reveal animation
  const mapWrapper = document.querySelector('.contact-map-wrapper');
  if (mapWrapper) {
    ScrollTrigger.create({
      trigger: mapWrapper,
      start: 'top 80%',
      once: true,
      onEnter: () => {
        gsap.from(mapWrapper, {
          opacity: 0,
          x: 60,
          duration: 0.8,
          ease: 'power3.out',
        });
      }
    });
  }

  // Contact info items stagger
  const items = document.querySelectorAll('.contact-info-item');
  if (items.length) {
    ScrollTrigger.create({
      trigger: '.contact-info',
      start: 'top 80%',
      once: true,
      onEnter: () => {
        gsap.from(items, {
          opacity: 0,
          y: 30,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power2.out',
        });
      }
    });
  }

  // Social links hover pulse
  document.querySelectorAll('.social-link').forEach(link => {
    link.addEventListener('mouseenter', () => {
      gsap.to(link, {
        scale: 1.15,
        duration: 0.3,
        ease: 'back.out(1.7)',
      });
    });
    link.addEventListener('mouseleave', () => {
      gsap.to(link, {
        scale: 1,
        duration: 0.3,
        ease: 'power2.out',
      });
    });
  });

  // Footer animation
  const footer = document.getElementById('footer');
  if (footer) {
    ScrollTrigger.create({
      trigger: footer,
      start: 'top 90%',
      once: true,
      onEnter: () => {
        gsap.from(footer.querySelectorAll('.footer-grid > *'), {
          opacity: 0,
          y: 30,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power2.out',
        });
      }
    });
  }
}

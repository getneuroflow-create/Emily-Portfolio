/* ========================================
   ABOUT ME — Parallax, Counters, Text Reveals
   ======================================== */

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function initAbout() {
  animateCounters();
  setupImageReveals();
}

function animateCounters() {
  const counters = document.querySelectorAll('.counter-value');
  
  counters.forEach(counter => {
    const target = parseInt(counter.getAttribute('data-target'), 10);
    
    ScrollTrigger.create({
      trigger: counter,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        gsap.to(counter, {
          innerText: target,
          duration: 2,
          ease: 'power2.out',
          snap: { innerText: 1 },
          onUpdate: function() {
            counter.textContent = Math.round(this.targets()[0].innerText || 0).toLocaleString();
          }
        });
      }
    });
  });
}

function setupImageReveals() {
  const reveals = document.querySelectorAll('.img-reveal');
  
  reveals.forEach(reveal => {
    const overlay = reveal.querySelector('::after') ? reveal : null;
    
    ScrollTrigger.create({
      trigger: reveal,
      start: 'top 80%',
      once: true,
      onEnter: () => {
        gsap.to(reveal, {
          '--reveal': '100%',
          duration: 1,
          ease: 'power3.inOut',
        });
        
        // Animate the mask overlay
        gsap.fromTo(reveal, 
          {},
          { 
            duration: 1.2,
            ease: 'power3.inOut',
            onStart: () => reveal.classList.add('revealed'),
          }
        );
      }
    });
  });
}

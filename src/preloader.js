/* ========================================
   PRELOADER — Scissor Cutting Animation
   ======================================== */

import gsap from 'gsap';

export function initPreloader(onComplete) {
  const preloader = document.getElementById('preloader');
  const percent = document.getElementById('preloaderPercent');
  const textSpans = document.querySelectorAll('#preloaderText span');
  const ringProgress = document.querySelector('.ring-progress');

  if (!preloader) {
    onComplete?.();
    return;
  }

  const circumference = 2 * Math.PI * 80; // r=80
  const tl = gsap.timeline({
    onComplete: () => {
      // Exit preloader
      gsap.to(preloader, {
        opacity: 0,
        scale: 1.05,
        duration: 0.8,
        ease: 'power2.inOut',
        onComplete: () => {
          preloader.classList.add('hidden');
          preloader.style.display = 'none';
          onComplete?.();
        }
      });
    }
  });

  // Animate text letters in
  tl.to(textSpans, {
    opacity: 1,
    y: 0,
    duration: 0.05,
    stagger: 0.04,
    ease: 'power2.out',
  }, 0);

  // Animate ring progress
  tl.to(ringProgress, {
    strokeDashoffset: 0,
    duration: 2.2,
    ease: 'power1.inOut',
  }, 0.2);

  // Animate percent counter
  const counter = { val: 0 };
  tl.to(counter, {
    val: 100,
    duration: 2.2,
    ease: 'power1.inOut',
    onUpdate: () => {
      if (percent) percent.textContent = Math.round(counter.val) + '%';
    }
  }, 0.2);

  // Create and animate hair strand particles
  createHairStrands(preloader);

  // Scissor cutting animation with GSAP
  const topBlade = document.querySelector('.scissor-blade-top');
  const bottomBlade = document.querySelector('.scissor-blade-bottom');
  
  if (topBlade && bottomBlade) {
    // Override CSS animation with GSAP
    topBlade.style.animation = 'none';
    bottomBlade.style.animation = 'none';
    
    gsap.to(topBlade, {
      rotation: -18,
      duration: 0.5,
      yoyo: true,
      repeat: 4,
      ease: 'power1.inOut',
      transformOrigin: '42px 50px'
    });
    
    gsap.to(bottomBlade, {
      rotation: 18,
      duration: 0.5,
      yoyo: true,
      repeat: 4,
      ease: 'power1.inOut',
      transformOrigin: '42px 50px'
    });
  }

  // Add sparkles
  createSparkles(preloader);
}

function createHairStrands(container) {
  const content = container.querySelector('.preloader-content');
  for (let i = 0; i < 12; i++) {
    const strand = document.createElement('div');
    strand.className = 'hair-strand';
    content.appendChild(strand);
    
    const startX = gsap.utils.random(-30, 30);
    gsap.set(strand, {
      x: startX,
      y: -10,
      rotation: gsap.utils.random(-30, 30),
      scale: gsap.utils.random(0.5, 1.2),
    });
    
    gsap.to(strand, {
      opacity: 0.6,
      y: gsap.utils.random(60, 120),
      x: startX + gsap.utils.random(-20, 20),
      rotation: gsap.utils.random(-60, 60),
      duration: gsap.utils.random(1, 2),
      delay: gsap.utils.random(0.3, 2),
      ease: 'power1.in',
      onComplete: () => {
        gsap.to(strand, {
          opacity: 0,
          duration: 0.3,
        });
      }
    });
  }
}

function createSparkles(container) {
  const content = container.querySelector('.preloader-content');
  for (let i = 0; i < 8; i++) {
    const sparkle = document.createElement('div');
    sparkle.className = 'sparkle';
    content.appendChild(sparkle);
    
    const angle = (i / 8) * Math.PI * 2;
    const radius = gsap.utils.random(50, 80);
    
    gsap.set(sparkle, {
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
    });
    
    gsap.to(sparkle, {
      opacity: 1,
      scale: gsap.utils.random(1, 2),
      duration: 0.3,
      delay: gsap.utils.random(0.5, 2),
      yoyo: true,
      repeat: 1,
      ease: 'power2.out',
    });
  }
}

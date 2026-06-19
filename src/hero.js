/* ========================================
   HERO — Three.js Particle System + Animations
   ======================================== */

import * as THREE from 'three';
import gsap from 'gsap';

let scene, camera, renderer, particles, mouseX = 0, mouseY = 0;
let animationId;

export function initHero() {
  // CSS animations guarantee text visibility — GSAP is enhancement only
  animateHeroText();
  animateHeroVideo();
  const canvas = document.getElementById('heroCanvas');
  const canvasHidden = !canvas || getComputedStyle(canvas).display === 'none';
  if (!canvasHidden) {
    try { initThreeJS(); } catch(e) { console.warn('Three.js init skipped:', e); }
  }
}

function animateHeroVideo() {
  const wrapper = document.getElementById('heroVideoWrapper');
  if (!wrapper) return;
  gsap.fromTo(wrapper,
    { opacity: 0, scale: 1.15 },
    { opacity: 1, scale: 1, duration: 2, ease: 'power2.out', delay: 0.1 }
  );
}

function initThreeJS() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;

  if (window.innerWidth < 768) {
    canvas.style.display = 'none';
    return;
  }

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 50;

  renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
    powerPreference: 'high-performance',
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const particleCount = getParticleCount();
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);
  const sizes = new Float32Array(particleCount);

  const goldColors = [
    new THREE.Color('#C9A96E'),
    new THREE.Color('#E8D5B0'),
    new THREE.Color('#F4C2C2'),
    new THREE.Color('#E6E0F3'),
    new THREE.Color('#D4E2D4'),
  ];

  for (let i = 0; i < particleCount; i++) {
    positions[i * 3]     = (Math.random() - 0.5) * 100;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 100;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 60;

    const color = goldColors[Math.floor(Math.random() * goldColors.length)];
    colors[i * 3]     = color.r;
    colors[i * 3 + 1] = color.g;
    colors[i * 3 + 2] = color.b;

    sizes[i] = Math.random() * 2 + 0.5;
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

  const vertexShader = `
    attribute float size;
    varying vec3 vColor;
    void main() {
      vColor = color;
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      gl_PointSize = size * (300.0 / -mvPosition.z);
      gl_Position = projectionMatrix * mvPosition;
    }
  `;

  const fragmentShader = `
    varying vec3 vColor;
    void main() {
      float dist = length(gl_PointCoord - vec2(0.5));
      if (dist > 0.5) discard;
      float alpha = 1.0 - smoothstep(0.3, 0.5, dist);
      gl_FragColor = vec4(vColor, alpha * 0.6);
    }
  `;

  const material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    vertexColors: true,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  particles = new THREE.Points(geometry, material);
  scene.add(particles);

  document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  window.addEventListener('resize', onResize);
  animate();
}

function getParticleCount() {
  const w = window.innerWidth;
  if (w >= 3840) return 2000;
  if (w >= 2560) return 1500;
  if (w >= 1920) return 1000;
  if (w >= 1200) return 600;
  return 300;
}

function animate() {
  animationId = requestAnimationFrame(animate);
  if (!particles) return;

  particles.rotation.y += 0.0005;
  particles.rotation.x += 0.0002;

  const targetX = mouseX * 3;
  const targetY = -mouseY * 3;
  particles.rotation.y += (targetX * 0.01 - particles.rotation.y) * 0.02;
  camera.position.x += (targetX - camera.position.x) * 0.01;
  camera.position.y += (targetY - camera.position.y) * 0.01;

  const positions = particles.geometry.attributes.position.array;
  const time = Date.now() * 0.0003;
  for (let i = 0; i < positions.length; i += 3) {
    positions[i + 1] += Math.sin(time + i) * 0.005;
  }
  particles.geometry.attributes.position.needsUpdate = true;
  renderer.render(scene, camera);
}

function onResize() {
  if (!camera || !renderer) return;
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
}

function animateHeroText() {
  // CSS animations in hero.css guarantee ALL text is ALWAYS visible.
  // GSAP here is progressive enhancement — cancels CSS and does a
  // coordinated sequence if JavaScript is running correctly.

  const subtitle = document.getElementById('heroSubtitle');
  const title    = document.getElementById('heroTitle');
  const desc     = document.getElementById('heroDesc');
  const cta      = document.getElementById('heroCta');
  const scroll   = document.getElementById('scrollIndicator');

  // Cancel CSS fallback animations, give GSAP full control
  [subtitle, title, desc, cta, scroll].forEach(el => {
    if (!el) return;
    el.style.animation = 'none';
    el.style.opacity   = '0';
    el.style.transform = 'translateY(28px)';
  });

  gsap.timeline({ delay: 0.05 })
    .to(subtitle, { opacity: 1, y: 0, duration: 0.75, ease: 'power3.out' }, 0.1)
    .to(title,    { opacity: 1, y: 0, duration: 0.85, ease: 'power3.out' }, 0.3)
    .to(desc,     { opacity: 1, y: 0, duration: 0.75, ease: 'power2.out' }, 0.65)
    .to(cta,      { opacity: 1, y: 0, duration: 0.65, ease: 'power2.out' }, 0.9)
    .to(scroll,   { opacity: 1,       duration: 0.55, ease: 'power2.out' }, 1.3);
}

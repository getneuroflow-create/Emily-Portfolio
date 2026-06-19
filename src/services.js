/* ========================================
   SERVICES — Card Grid with Animations
   ======================================== */

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const servicesData = [
  {
    title: 'Haircut & Styling',
    description: 'Precision cuts tailored to your face shape, lifestyle, and personality. From classic bobs to modern layers, every cut is a masterpiece.',
    price: '$85',
    duration: '60 min',
    gradient: 'linear-gradient(135deg, #F5E6D3, #F4C2C2)',
    icon: '✂️',
    image: '/service-haircut.jpg',
  },
  {
    title: 'Color & Highlights',
    description: 'Full spectrum color services from subtle highlights to bold fashion colors. Using premium, ammonia-free formulas for vibrant, lasting results.',
    price: '$150',
    duration: '90–120 min',
    gradient: 'linear-gradient(135deg, #E6E0F3, #F4C2C2)',
    icon: '🎨',
    image: '/service-color.jpg',
  },
  {
    title: 'Balayage & Ombré',
    description: 'Hand-painted, sun-kissed perfection. My signature balayage technique creates natural, dimensional color that grows out beautifully.',
    price: '$200',
    duration: '120–150 min',
    gradient: 'linear-gradient(135deg, #F4C2C2, #E8D5B0)',
    icon: '🌅',
    image: '/service-balayage.jpg',
  },
  {
    title: 'Bridal & Special Occasion',
    description: 'Your dream wedding hair, brought to life. Includes consultation, trial run, and day-of styling. Updos, waves, braids, and more.',
    price: '$250',
    duration: '90–120 min',
    gradient: 'linear-gradient(135deg, #FFF8F0, #E6E0F3)',
    icon: '👰',
    image: '/service-bridal.jpg',
  },
  {
    title: 'Keratin Treatment',
    description: 'Smooth, frizz-free hair for up to 3 months. This game-changing treatment transforms unruly hair into sleek, manageable perfection.',
    price: '$300',
    duration: '150–180 min',
    gradient: 'linear-gradient(135deg, #D4E2D4, #E8D5B0)',
    icon: '✨',
    image: '/service-keratin.jpg',
  },
  {
    title: 'Hair Extensions',
    description: 'Luxury tape-in and hand-tied extensions for instant length and volume. Natural-looking, damage-free, and customized to your exact shade.',
    price: '$400',
    duration: '120–180 min',
    gradient: 'linear-gradient(135deg, #E8D5B0, #F5E6D3)',
    icon: '💫',
    image: '/service-extensions.jpg',
  },
];

export function initServices() {
  const grid = document.getElementById('servicesGrid');
  if (!grid) return;

  // Render service cards
  servicesData.forEach((service, index) => {
    const card = document.createElement('div');
    card.className = 'service-card anim-fade-up';
    card.style.setProperty('--delay', `${index * 0.1}s`);
    
    const mediaContent = service.image
      ? `<img src="${service.image}" alt="${service.title}" style="width:100%;height:100%;object-fit:cover;display:block;" loading="lazy" />
         <div style="position:absolute;inset:0;background:linear-gradient(to bottom, rgba(0,0,0,0.08), rgba(0,0,0,0.25));"></div>`
      : `<div style="display:flex;align-items:center;justify-content:center;width:100%;height:100%;font-size:4rem;">${service.icon}</div>`;

    card.innerHTML = `
      <div class="service-card-media" style="background: ${service.gradient}; position:relative; overflow:hidden;">
        ${mediaContent}
      </div>
      <div class="service-card-body">
        <h4>${service.title}</h4>
        <p>${service.description}</p>
        <div class="service-price">
          <span class="from">from</span>
          ${service.price}
        </div>
      </div>
      <div class="service-card-footer">
        <span class="service-duration">
          <i class="far fa-clock"></i> ${service.duration}
        </span>
        <a href="#booking" class="btn-outline" style="padding:0.5em 1.2em;font-size:0.75rem;">Book Now</a>
      </div>
    `;
    
    grid.appendChild(card);
  });

  // Stagger entrance animation
  ScrollTrigger.create({
    trigger: grid,
    start: 'top 80%',
    once: true,
    onEnter: () => {
      gsap.to(grid.querySelectorAll('.service-card'), {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.12,
        ease: 'power3.out',
      });
    }
  });

  // Hover tilt effect
  grid.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = (y - centerY) / centerY * -3;
      const rotateY = (x - centerX) / centerX * 3;
      
      gsap.to(card, {
        rotateX,
        rotateY,
        duration: 0.3,
        ease: 'power1.out',
        transformPerspective: 800,
      });
    });

    card.addEventListener('mouseleave', () => {
      gsap.to(card, {
        rotateX: 0,
        rotateY: 0,
        duration: 0.5,
        ease: 'power2.out',
      });
    });
  });
}

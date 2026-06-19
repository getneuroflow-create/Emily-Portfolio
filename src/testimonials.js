/* ========================================
   TESTIMONIALS — Auto-Rotating Carousel
   ======================================== */

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const testimonials = [
  {
    text: "Emily completely transformed my hair! The balayage she did was exactly what I showed her — if not better. I've never gotten so many compliments. She truly listens to what you want and delivers perfection.",
    author: "Sophia Martinez",
    service: "Balayage & Ombré",
    stars: 5,
  },
  {
    text: "I was terrified to go short, but Emily made me feel so comfortable. She explained everything, showed me references, and gave me the most stunning pixie cut. I literally cried tears of joy. Best decision ever!",
    author: "Rachel Kim",
    service: "Haircut & Styling",
    stars: 5,
  },
  {
    text: "My wedding hair was an absolute dream. Emily did a trial run and nailed it on the first try. On the big day, my updo lasted through 8 hours of dancing and didn't move an inch. Worth every penny!",
    author: "Isabella Chen",
    service: "Bridal & Special Occasion",
    stars: 5,
  },
  {
    text: "After years of box-dye disasters, I trusted Emily with a full color correction. She spent 4 hours bringing my hair back to life. It's healthier and more vibrant than ever. She's a true artist!",
    author: "Aisha Johnson",
    service: "Color & Highlights",
    stars: 5,
  },
  {
    text: "The keratin treatment Emily gave me changed my life! I used to spend 45 minutes straightening my hair every morning. Now it air-dries perfectly smooth. I can't believe I waited so long. Absolute magic!",
    author: "Lauren O'Brien",
    service: "Keratin Treatment",
    stars: 5,
  },
  {
    text: "I've been going to Emily for hand-tied extensions and the results are unreal. They blend so seamlessly that nobody can tell. She's meticulous about matching the color and placing them to look natural.",
    author: "Taylor Brooks",
    service: "Hair Extensions",
    stars: 5,
  },
  {
    text: "Emily isn't just a stylist — she's a therapist, a friend, and an absolute genius with scissors. Every time I leave her chair I feel like a brand new person. I've been coming for 3 years and I'll never go anywhere else.",
    author: "Megan Rivera",
    service: "Haircut & Styling",
    stars: 5,
  },
  {
    text: "I showed Emily a Pinterest photo of this insane rose gold color and she absolutely crushed it. My hair looked EXACTLY like the photo. The dimension, the tone, everything. She's on another level. Can't wait for my next visit!",
    author: "Hannah Patel",
    service: "Color & Highlights",
    stars: 5,
  },
];

let currentSlide = 0;
let autoPlayInterval;
let isPaused = false;

export function initTestimonials() {
  const carousel = document.getElementById('testimonialsCarousel');
  const dotsContainer = document.getElementById('testimonialDots');
  const prevBtn = document.getElementById('testimonialPrev');
  const nextBtn = document.getElementById('testimonialNext');

  if (!carousel) return;

  // Render slides
  testimonials.forEach((item, index) => {
    const slide = document.createElement('div');
    slide.className = `testimonial-slide ${index === 0 ? 'active' : ''}`;
    slide.innerHTML = `
      <div class="testimonial-card">
        <div class="testimonial-quote-icon">"</div>
        <div class="testimonial-stars">
          ${'<i class="fas fa-star"></i>'.repeat(item.stars)}
        </div>
        <p class="testimonial-text">${item.text}</p>
        <div class="testimonial-author">
          <span class="testimonial-author-name">${item.author}</span>
          <span class="testimonial-author-service">${item.service}</span>
        </div>
      </div>
    `;
    carousel.appendChild(slide);
  });

  // Render dots
  testimonials.forEach((_, index) => {
    const dot = document.createElement('button');
    dot.className = `testimonial-dot ${index === 0 ? 'active' : ''}`;
    dot.setAttribute('aria-label', `Go to review ${index + 1}`);
    dot.addEventListener('click', () => goToSlide(index));
    dotsContainer.appendChild(dot);
  });

  // Navigation
  prevBtn?.addEventListener('click', () => {
    goToSlide(currentSlide - 1);
    resetAutoPlay();
  });

  nextBtn?.addEventListener('click', () => {
    goToSlide(currentSlide + 1);
    resetAutoPlay();
  });

  // Pause on hover
  carousel.addEventListener('mouseenter', () => { isPaused = true; });
  carousel.addEventListener('mouseleave', () => { isPaused = false; });

  // Touch swipe
  let touchStartX = 0;
  carousel.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });

  carousel.addEventListener('touchend', (e) => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) goToSlide(currentSlide + 1);
      else goToSlide(currentSlide - 1);
      resetAutoPlay();
    }
  }, { passive: true });

  // Auto-play
  startAutoPlay();

  // Entrance animation
  ScrollTrigger.create({
    trigger: carousel,
    start: 'top 80%',
    once: true,
    onEnter: () => {
      gsap.from(carousel, {
        opacity: 0,
        y: 40,
        duration: 0.8,
        ease: 'power2.out',
      });
    }
  });
}

function goToSlide(index) {
  const slides = document.querySelectorAll('.testimonial-slide');
  const dots = document.querySelectorAll('.testimonial-dot');
  if (slides.length === 0) return;

  // Wrap around
  const prevIndex = currentSlide;
  currentSlide = ((index % slides.length) + slides.length) % slides.length;

  // Animate exit
  slides[prevIndex].classList.remove('active');
  slides[prevIndex].classList.add('exit');
  
  setTimeout(() => {
    slides[prevIndex].classList.remove('exit');
  }, 400);

  // Animate enter
  slides[currentSlide].classList.add('active');

  // Update dots
  dots.forEach((dot, i) => {
    dot.classList.toggle('active', i === currentSlide);
  });
}

function startAutoPlay() {
  autoPlayInterval = setInterval(() => {
    if (!isPaused) {
      goToSlide(currentSlide + 1);
    }
  }, 4000);
}

function resetAutoPlay() {
  clearInterval(autoPlayInterval);
  startAutoPlay();
}

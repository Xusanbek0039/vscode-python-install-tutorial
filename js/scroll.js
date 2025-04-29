// Scroll-triggered animations and parallax effects
export function initScrollEffects() {
  // Elements to animate on scroll
  const fadeElements = document.querySelectorAll('.fade-in-up');
  const stepCards = document.querySelectorAll('.step-card');
  const parallaxElements = document.querySelectorAll('.parallax');
  let ticking = false;
  
  // Initialize IntersectionObserver for elements
  if ('IntersectionObserver' in window) {
    // Fade in elements when they enter viewport
    const fadeObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          fadeObserver.unobserve(entry.target); // Stop observing after animation
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -10% 0px'
    });
    
    fadeElements.forEach(element => {
      fadeObserver.observe(element);
    });
    
    // Step cards staggered animation
    const stepCardObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          stepCardObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -10% 0px'
    });
    
    stepCards.forEach(card => {
      stepCardObserver.observe(card);
    });
  } else {
    // Fallback for browsers that don't support IntersectionObserver
    fadeElements.forEach(element => {
      element.classList.add('visible');
    });
    
    stepCards.forEach(card => {
      card.classList.add('visible');
    });
  }
  
  // Parallax effect on scroll
  function updateParallax() {
    parallaxElements.forEach(element => {
      const img = element.querySelector('img');
      if (!img) return;
      
      const rect = element.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      
      // If element is in viewport
      if (rect.top < viewportHeight && rect.bottom > 0) {
        const scrollPosition = (rect.top - viewportHeight) / (rect.height + viewportHeight);
        const translateY = scrollPosition * -30; // Adjust the intensity of the parallax
        
        img.style.transform = `translateY(${translateY}px) scale(1.1)`;
      }
    });
    
    ticking = false;
  }
  
  // Throttle scroll events
  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(updateParallax);
      ticking = true;
    }
  }
  
  // Add scroll event listener for parallax effect
  window.addEventListener('scroll', onScroll, { passive: true });
  
  // Initialize 3D tilt effect
  const tiltElements = document.querySelectorAll('.tilt');
  
  tiltElements.forEach(element => {
    element.addEventListener('mousemove', (e) => {
      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const deltaX = (x - centerX) / centerX;
      const deltaY = (y - centerY) / centerY;
      
      element.style.transform = `perspective(1000px) rotateX(${-deltaY * 5}deg) rotateY(${deltaX * 5}deg)`;
      
      const inner = element.querySelector('.tilt-inner');
      if (inner) {
        inner.style.transform = `translateZ(30px)`;
      }
    });
    
    element.addEventListener('mouseleave', () => {
      element.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
      
      const inner = element.querySelector('.tilt-inner');
      if (inner) {
        inner.style.transform = 'translateZ(0)';
      }
    });
  });
  
  // Call updateParallax once on load
  updateParallax();
}
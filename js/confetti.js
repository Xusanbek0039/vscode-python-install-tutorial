// Confetti animation functionality
export function initConfetti() {
  const confettiContainer = document.querySelector('.confetti');
  if (!confettiContainer) return;
  
  // Create confetti pieces
  function createConfetti() {
    confettiContainer.innerHTML = '';
    
    // Create confetti pieces
    for (let i = 0; i < 9; i++) {
      const confettiPiece = document.createElement('div');
      confettiPiece.classList.add('confetti-piece');
      confettiPiece.style.left = `${10 + i * 10}%`; // Distribute evenly
      confettiContainer.appendChild(confettiPiece);
    }
    
    // Create additional random pieces
    for (let i = 0; i < 30; i++) {
      const confettiPiece = document.createElement('div');
      confettiPiece.classList.add('confetti-piece');
      confettiPiece.style.left = `${Math.random() * 100}%`;
      confettiPiece.style.width = `${Math.random() * 10 + 5}px`;
      confettiPiece.style.height = `${Math.random() * 10 + 5}px`;
      confettiPiece.style.backgroundColor = getRandomConfettiColor();
      confettiPiece.style.animationDelay = `${Math.random() * 3}s`;
      confettiPiece.style.animationDuration = `${Math.random() * 2 + 1}s`;
      confettiContainer.appendChild(confettiPiece);
    }
  }
  
  // Get random confetti color
  function getRandomConfettiColor() {
    const colors = [
      'var(--color-primary)',
      'var(--color-secondary)',
      'var(--color-accent)',
      'var(--color-success)',
      'var(--color-warning)'
    ];
    
    return colors[Math.floor(Math.random() * colors.length)];
  }
  
  // Create confetti when the conclusion section becomes active
  document.addEventListener('DOMContentLoaded', () => {
    const conclusionSection = document.getElementById('conclusion');
    
    // Observer to detect when conclusion section becomes visible
    if ('IntersectionObserver' in window && conclusionSection) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            createConfetti();
          }
        });
      }, { threshold: 0.1 });
      
      observer.observe(conclusionSection);
    }
    
    // Also trigger when directly navigating to conclusion
    if (window.location.hash === '#conclusion') {
      createConfetti();
    }
  });
  
  // Create initial confetti pieces (for when directly loading the page)
  createConfetti();
}
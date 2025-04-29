// Main JavaScript for VSCode & Python Installation Tutorial
import { initCursor } from './cursor.js';
import { initParticles } from './particles.js';
import { initScrollEffects } from './scroll.js';
import { initThemeToggle } from './theme.js';
import { initSoundEffects } from './sounds.js';
import { initProgressTracker } from './progress.js';
import { initConfetti } from './confetti.js';

// DOM elements
const startButton = document.getElementById('start-guide');
const progressSteps = document.querySelectorAll('.progress-steps .step');
const navButtons = document.querySelectorAll('.nav-button');
const copyButtons = document.querySelectorAll('.copy-button');
const tooltips = document.querySelectorAll('[data-tooltip]');
const sections = document.querySelectorAll('.tutorial-section');

// Initialize all modules
document.addEventListener('DOMContentLoaded', () => {
  // Initialize components
  initCursor();
  initParticles();
  initScrollEffects();
  initThemeToggle();
  initSoundEffects();
  initProgressTracker();
  
  // Setup event listeners
  setupEventListeners();
  
  // Initialize tooltips
  setupTooltips();
  
  // Initialize copy functionality
  setupCopyButtons();
  
  // Set up the confetti for the conclusion section
  if (document.querySelector('.celebration-animation')) {
    initConfetti();
  }
  
  // Check for URL hash to navigate to specific section
  checkUrlHash();
});

// Setup event listeners for navigation
function setupEventListeners() {
  // Start button click event
  if (startButton) {
    startButton.addEventListener('click', () => {
      navigateToSection('vscode-download');
      playClickSound();
    });
  }
  
  // Navigation button click events
  navButtons.forEach(button => {
    button.addEventListener('click', () => {
      const nextSection = button.dataset.next;
      const prevSection = button.dataset.prev;
      const restartSection = button.dataset.restart;
      
      if (nextSection) {
        navigateToSection(nextSection);
      } else if (prevSection) {
        navigateToSection(prevSection);
      } else if (restartSection) {
        navigateToSection(restartSection);
      }
      
      playClickSound();
    });
  });
  
  // Step click events in progress tracker
  progressSteps.forEach(step => {
    step.addEventListener('click', () => {
      const section = step.dataset.step;
      navigateToSection(section);
      playClickSound();
    });
  });
  
  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    const activeSection = document.querySelector('.tutorial-section.active');
    if (!activeSection) return;
    
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      const nextButton = activeSection.querySelector('.next-button');
      if (nextButton) {
        nextButton.click();
      }
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      const prevButton = activeSection.querySelector('.prev-button');
      if (prevButton) {
        prevButton.click();
      }
    }
  });
}

// Navigate to a specific section
function navigateToSection(sectionId) {
  // Hide all sections
  sections.forEach(section => {
    section.classList.remove('active');
  });
  
  // Show the target section
  const targetSection = document.getElementById(sectionId);
  if (targetSection) {
    targetSection.classList.add('active');
    
    // Update URL hash
    window.history.pushState(null, null, `#${sectionId}`);
    
    // Update progress tracker
    updateProgress(sectionId);
    
    // Scroll to top of section
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    
    // If it's the conclusion section, trigger confetti
    if (sectionId === 'conclusion') {
      triggerConfetti();
      playSuccessSound();
    }
  }
}

// Update progress in the progress tracker
function updateProgress(currentSectionId) {
  // Get all section IDs in order
  const sectionIds = Array.from(sections).map(section => section.id);
  const currentIndex = sectionIds.indexOf(currentSectionId);
  
  // Calculate progress percentage
  const progressPercentage = ((currentIndex) / (sectionIds.length - 1)) * 100;
  
  // Update progress bar
  const progressFill = document.querySelector('.progress-fill');
  if (progressFill) {
    progressFill.style.width = `${progressPercentage}%`;
  }
  
  // Update active step
  progressSteps.forEach(step => {
    const stepId = step.dataset.step;
    if (stepId === currentSectionId) {
      step.classList.add('active');
    } else {
      step.classList.remove('active');
    }
  });
}

// Setup tooltip functionality
function setupTooltips() {
  const hintPopup = document.getElementById('hint-popup');
  const popupText = document.querySelector('.popup-text');
  const closePopup = document.querySelector('.close-popup');
  
  // Show tooltip on click
  tooltips.forEach(tooltip => {
    tooltip.addEventListener('click', (e) => {
      const tooltipText = tooltip.getAttribute('data-tooltip');
      
      if (hintPopup && popupText) {
        popupText.textContent = tooltipText;
        hintPopup.classList.add('show');
        playClickSound();
      }
      
      e.stopPropagation();
    });
  });
  
  // Close popup on button click
  if (closePopup) {
    closePopup.addEventListener('click', () => {
      hintPopup.classList.remove('show');
      playClickSound();
    });
  }
  
  // Close popup when clicking outside
  if (hintPopup) {
    hintPopup.addEventListener('click', (e) => {
      if (e.target === hintPopup) {
        hintPopup.classList.remove('show');
      }
    });
  }
}

// Setup code copy functionality
function setupCopyButtons() {
  copyButtons.forEach(button => {
    button.addEventListener('click', () => {
      const targetId = button.getAttribute('data-clipboard-target');
      const codeElement = document.querySelector(targetId);
      
      if (codeElement) {
        const codeText = codeElement.textContent;
        
        // Copy to clipboard
        navigator.clipboard.writeText(codeText).then(() => {
          // Show copied feedback
          button.textContent = 'Copied!';
          button.classList.add('copied');
          
          // Reset after 2 seconds
          setTimeout(() => {
            button.textContent = 'Copy';
            button.classList.remove('copied');
          }, 2000);
          
          playClickSound();
        });
      }
    });
  });
}

// Check URL hash on page load
function checkUrlHash() {
  const hash = window.location.hash;
  if (hash) {
    const sectionId = hash.substring(1); // Remove the # character
    const targetSection = document.getElementById(sectionId);
    
    if (targetSection) {
      navigateToSection(sectionId);
    }
  }
}

// Play click sound effect
function playClickSound() {
  const soundButton = document.getElementById('sound-button');
  const isSoundMuted = document.body.classList.contains('sound-muted');
  
  if (!isSoundMuted) {
    const clickSound = document.getElementById('click-sound');
    if (clickSound) {
      clickSound.currentTime = 0;
      clickSound.play().catch(error => {
        console.error('Error playing sound:', error);
      });
    }
  }
}

// Play success sound effect
function playSuccessSound() {
  const isSoundMuted = document.body.classList.contains('sound-muted');
  
  if (!isSoundMuted) {
    const successSound = document.getElementById('success-sound');
    if (successSound) {
      successSound.currentTime = 0;
      successSound.play().catch(error => {
        console.error('Error playing sound:', error);
      });
    }
  }
}

// Trigger confetti animation
function triggerConfetti() {
  const confettiElement = document.querySelector('.confetti');
  if (confettiElement) {
    // Create confetti pieces
    for (let i = 0; i < 50; i++) {
      const confettiPiece = document.createElement('div');
      confettiPiece.classList.add('confetti-piece');
      confettiPiece.style.left = `${Math.random() * 100}%`;
      confettiPiece.style.backgroundColor = getRandomColor();
      confettiPiece.style.animationDelay = `${Math.random() * 2}s`;
      confettiElement.appendChild(confettiPiece);
    }
  }
}

// Get random color for confetti
function getRandomColor() {
  const colors = [
    'var(--color-primary)',
    'var(--color-secondary)',
    'var(--color-accent)',
    'var(--color-success)',
    'var(--color-warning)'
  ];
  
  return colors[Math.floor(Math.random() * colors.length)];
}

// Export necessary functions for other modules
export { navigateToSection, playClickSound, playSuccessSound };
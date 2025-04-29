// Progress tracker functionality
export function initProgressTracker() {
  const progressTracker = document.querySelector('.progress-tracker');
  const progressSteps = document.querySelectorAll('.progress-steps .step');
  let lastScrollPosition = 0;
  let ticking = false;
  
  if (!progressTracker) return;
  
  // Hide/show progress tracker on scroll
  function handleScroll() {
    const currentScrollPosition = window.pageYOffset;
    
    // Determine scroll direction
    if (currentScrollPosition > lastScrollPosition && currentScrollPosition > 100) {
      // Scrolling down & past header - hide progress tracker
      progressTracker.style.transform = 'translateY(-100%)';
    } else {
      // Scrolling up or at top - show progress tracker
      progressTracker.style.transform = 'translateY(0)';
    }
    
    lastScrollPosition = currentScrollPosition;
    ticking = false;
  }
  
  // Throttle scroll event
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(handleScroll);
      ticking = true;
    }
  }, { passive: true });
  
  // Make steps clickable in progress tracker
  progressSteps.forEach(step => {
    step.addEventListener('click', () => {
      const sectionId = step.getAttribute('data-step');
      const section = document.getElementById(sectionId);
      
      if (section) {
        // Navigate to section
        const sections = document.querySelectorAll('.tutorial-section');
        sections.forEach(s => s.classList.remove('active'));
        section.classList.add('active');
        
        // Update active state in progress steps
        progressSteps.forEach(s => s.classList.remove('active'));
        step.classList.add('active');
        
        // Update progress bar
        updateProgressBar(step);
        
        // Scroll to top
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
        
        // Update URL hash
        window.history.pushState(null, null, `#${sectionId}`);
      }
    });
  });
  
  // Update progress bar when a step is selected
  function updateProgressBar(activeStep) {
    const steps = Array.from(progressSteps);
    const activeIndex = steps.indexOf(activeStep);
    const progressPercentage = (activeIndex / (steps.length - 1)) * 100;
    
    const progressFill = document.querySelector('.progress-fill');
    if (progressFill) {
      progressFill.style.width = `${progressPercentage}%`;
    }
  }
  
  // Initialize progress bar based on active section
  function initProgressBar() {
    const activeStep = document.querySelector('.progress-steps .step.active');
    if (activeStep) {
      updateProgressBar(activeStep);
    }
  }
  
  // Initialize
  initProgressBar();
  
  // Calculate step widths to improve mobile display
  function adjustStepWidths() {
    const containerWidth = progressTracker.offsetWidth;
    const indicatorWidth = 30; // Width of step indicator
    const stepCount = progressSteps.length;
    
    // Only show step names on large screens
    if (window.innerWidth < 768) {
      document.querySelectorAll('.step-name').forEach(name => {
        name.style.display = 'none';
      });
    } else {
      document.querySelectorAll('.step-name').forEach(name => {
        name.style.display = 'block';
      });
    }
  }
  
  // Adjust on resize
  window.addEventListener('resize', adjustStepWidths);
  
  // Initial adjustment
  adjustStepWidths();
}
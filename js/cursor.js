// Custom cursor functionality
export function initCursor() {
  const cursor = document.querySelector('.custom-cursor');
  const follower = document.querySelector('.cursor-follower');
  
  if (!cursor || !follower) return;
  
  let mouseX = 0;
  let mouseY = 0;
  let cursorX = 0;
  let cursorY = 0;
  let followerX = 0;
  let followerY = 0;
  
  // Set initial position
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });
  
  // Check for touch devices
  if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
    cursor.style.display = 'none';
    follower.style.display = 'none';
    document.body.style.cursor = 'auto';
    Array.from(document.querySelectorAll('a, button, [role="button"]')).forEach(
      el => el.style.cursor = 'pointer'
    );
    return;
  }
  
  // Animate cursor with requestAnimationFrame for smoother performance
  function animateCursor() {
    // Smooth cursor movement with easing
    const easeFactorCursor = 0.2;
    const easeFactorFollower = 0.1;
    
    cursorX += (mouseX - cursorX) * easeFactorCursor;
    cursorY += (mouseY - cursorY) * easeFactorCursor;
    
    followerX += (mouseX - followerX) * easeFactorFollower;
    followerY += (mouseY - followerY) * easeFactorFollower;
    
    // Apply transformed positions
    cursor.style.transform = `translate(${cursorX}px, ${cursorY}px)`;
    follower.style.transform = `translate(${followerX}px, ${followerY}px)`;
    
    // Continue animation
    requestAnimationFrame(animateCursor);
  }
  
  // Start animation
  animateCursor();
  
  // Add event listeners for cursor states
  const interactiveElements = document.querySelectorAll('a, button, input, [role="button"], .step, .tooltip, .image-container');
  
  interactiveElements.forEach(el => {
    // Determine cursor type based on element
    let cursorType = 'button';
    
    if (el.tagName === 'A') {
      cursorType = 'link';
    } else if (el.classList.contains('tooltip')) {
      cursorType = 'help';
    } else if (el.classList.contains('image-container')) {
      cursorType = 'zoom';
    } else if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
      cursorType = 'text';
    }
    
    // Mouse enter
    el.addEventListener('mouseenter', () => {
      document.body.classList.add(`cursor-${cursorType}`);
    });
    
    // Mouse leave
    el.addEventListener('mouseleave', () => {
      document.body.classList.remove(`cursor-${cursorType}`);
    });
    
    // Mouse down
    el.addEventListener('mousedown', () => {
      document.body.classList.add('cursor-active');
    });
    
    // Mouse up
    el.addEventListener('mouseup', () => {
      document.body.classList.remove('cursor-active');
    });
  });
  
  // Handle text elements separately
  const textElements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span');
  
  textElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
      if (!el.closest('a, button, .tooltip, .step')) {
        document.body.classList.add('cursor-text');
      }
    });
    
    el.addEventListener('mouseleave', () => {
      document.body.classList.remove('cursor-text');
    });
  });
  
  // Handle cursor disappearing when leaving the window
  document.addEventListener('mouseleave', () => {
    cursor.style.opacity = '0';
    follower.style.opacity = '0';
  });
  
  document.addEventListener('mouseenter', () => {
    cursor.style.opacity = '1';
    follower.style.opacity = '1';
  });
}
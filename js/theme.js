// Theme toggle functionality
export function initThemeToggle() {
  const themeSwitch = document.getElementById('theme-switch');
  const storedTheme = localStorage.getItem('theme') || 'dark';
  
  // Set initial theme
  setTheme(storedTheme);
  
  // Update theme switch position based on stored theme
  if (themeSwitch) {
    themeSwitch.checked = storedTheme === 'light';
    
    // Add event listener for theme switch
    themeSwitch.addEventListener('change', () => {
      const newTheme = themeSwitch.checked ? 'light' : 'dark';
      toggleTheme(newTheme);
      playSwitchSound();
    });
  }
  
  // Set theme class on body
  function setTheme(theme) {
    if (theme === 'light') {
      document.body.classList.remove('dark-theme');
      document.body.classList.add('light-theme');
    } else {
      document.body.classList.remove('light-theme');
      document.body.classList.add('dark-theme');
    }
    
    // Store theme preference
    localStorage.setItem('theme', theme);
  }
  
  // Toggle theme with transition
  function toggleTheme(newTheme) {
    // Add transition class
    document.body.classList.add('theme-transition');
    
    // Set new theme
    setTheme(newTheme);
    
    // Create and dispatch a theme change event
    const themeChangeEvent = new CustomEvent('themeChanged', {
      detail: { theme: newTheme }
    });
    document.dispatchEvent(themeChangeEvent);
    
    // Remove transition class after transition completes
    setTimeout(() => {
      document.body.classList.remove('theme-transition');
    }, 600);
  }
  
  // Play switch sound
  function playSwitchSound() {
    const isSoundMuted = document.body.classList.contains('sound-muted');
    
    if (!isSoundMuted) {
      const switchSound = document.getElementById('switch-sound');
      if (switchSound) {
        switchSound.currentTime = 0;
        switchSound.play().catch(error => {
          console.error('Error playing sound:', error);
        });
      }
    }
  }
  
  // Check for system preference changes
  const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
  
  prefersDarkScheme.addEventListener('change', (e) => {
    // Only change theme if user hasn't set a preference
    if (!localStorage.getItem('theme')) {
      const newTheme = e.matches ? 'dark' : 'light';
      toggleTheme(newTheme);
      
      if (themeSwitch) {
        themeSwitch.checked = newTheme === 'light';
      }
    }
  });
}
// Sound effects functionality
export function initSoundEffects() {
  const soundButton = document.getElementById('sound-button');
  const storedSoundPreference = localStorage.getItem('soundMuted');
  
  // Set initial sound state
  if (storedSoundPreference === 'true') {
    document.body.classList.add('sound-muted');
  }
  
  // Preload sound effects
  const clickSound = document.getElementById('click-sound');
  const switchSound = document.getElementById('switch-sound');
  const successSound = document.getElementById('success-sound');
  
  // Check for stored preference
  if (soundButton) {
    // Add event listener for sound toggle
    soundButton.addEventListener('click', () => {
      // Toggle mute state
      const isMuted = document.body.classList.toggle('sound-muted');
      
      // Store preference
      localStorage.setItem('soundMuted', isMuted);
      
      // Play switch sound when unmuting
      if (!isMuted) {
        if (switchSound) {
          switchSound.currentTime = 0;
          switchSound.play().catch(error => {
            console.error('Error playing sound:', error);
          });
        }
      }
    });
  }
  
  // Handle scenarios when audio might not be available
  document.addEventListener('DOMContentLoaded', () => {
    // Check if audio context is allowed
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    
    if (AudioContext) {
      const context = new AudioContext();
      
      // If context is suspended (autoplay policy), we need user interaction
      if (context.state === 'suspended') {
        const resumeAudio = () => {
          context.resume().then(() => {
            document.removeEventListener('click', resumeAudio);
          });
        };
        
        document.addEventListener('click', resumeAudio);
      }
    }
  });
  
  // Function to play a sound if not muted
  function playSound(sound) {
    const isMuted = document.body.classList.contains('sound-muted');
    
    if (!isMuted && sound) {
      sound.currentTime = 0;
      sound.play().catch(error => {
        console.error('Error playing sound:', error);
      });
    }
  }
  
  // Export sound playing functions
  return {
    playClickSound: () => playSound(clickSound),
    playSwitchSound: () => playSound(switchSound),
    playSuccessSound: () => playSound(successSound)
  };
}
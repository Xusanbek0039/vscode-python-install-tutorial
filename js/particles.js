// Particle background animation
export function initParticles() {
  const canvas = document.getElementById('particles');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  let particles = [];
  let animationFrameId;
  
  // Set canvas size
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  
  // Initialize particles
  function initializeParticles() {
    particles = [];
    const particleCount = Math.min(Math.floor(window.innerWidth / 10), 100);
    
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 2 + 1,
        color: getRandomColor(),
        speedX: Math.random() * 0.5 - 0.25,
        speedY: Math.random() * 0.5 - 0.25,
        connected: []
      });
    }
  }
  
  // Get random color based on theme
  function getRandomColor() {
    const colors = document.body.classList.contains('dark-theme') 
      ? ['#00A3FF', '#4CC2FF', '#9D50FF', '#BE8AFF', '#FF4185'] 
      : ['#0065A9', '#0083DB', '#7E19E8', '#9E50FF', '#E40B72'];
    
    return colors[Math.floor(Math.random() * colors.length)];
  }
  
  // Draw particles and connections
  function drawParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Update and draw particles
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      
      // Move particles
      p.x += p.speedX;
      p.y += p.speedY;
      
      // Bounce off edges
      if (p.x < 0 || p.x > canvas.width) {
        p.speedX *= -1;
      }
      
      if (p.y < 0 || p.y > canvas.height) {
        p.speedY *= -1;
      }
      
      // Draw particle
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();
      
      // Find connections
      p.connected = [];
      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const distance = Math.sqrt(Math.pow(p.x - p2.x, 2) + Math.pow(p.y - p2.y, 2));
        
        if (distance < 150) {
          p.connected.push({
            particle: p2,
            distance: distance
          });
        }
      }
      
      // Draw connections
      for (const connection of p.connected) {
        const opacity = 1 - (connection.distance / 150);
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(connection.particle.x, connection.particle.y);
        ctx.strokeStyle = `rgba(${hexToRgb(p.color)}, ${opacity * 0.2})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }
    
    // Continue animation
    animationFrameId = requestAnimationFrame(drawParticles);
  }
  
  // Convert hex color to RGB
  function hexToRgb(hex) {
    // Remove # if present
    hex = hex.replace('#', '');
    
    // Convert 3-digit hex to 6-digits
    if (hex.length === 3) {
      hex = hex.split('').map(char => char + char).join('');
    }
    
    // Parse the hex values
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    
    return `${r}, ${g}, ${b}`;
  }
  
  // Initialize and start animation
  function startAnimation() {
    resizeCanvas();
    initializeParticles();
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
    }
    drawParticles();
  }
  
  // Handle resize
  window.addEventListener('resize', startAnimation);
  
  // Handle theme change
  document.addEventListener('themeChanged', () => {
    for (let i = 0; i < particles.length; i++) {
      particles[i].color = getRandomColor();
    }
  });
  
  // Start animation
  startAnimation();
}
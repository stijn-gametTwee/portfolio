// Background
const canvas = document.getElementById('bg');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let particles = [];

class Particle {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 2;
    this.speedX = (Math.random() - 0.5) * 0.3;
    this.speedY = (Math.random() - 0.5) * 0.3;
  }
  update() { this.x += this.speedX; this.y += this.speedY; }
  draw() {
    ctx.fillStyle = '#00bfa622';
    ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2); ctx.fill();
  }
}

function initParticles() {
  particles = [];
  for (let i = 0; i < 60; i++) particles.push(new Particle());
}
function animate() {
  ctx.fillStyle = 'rgba(13,17,23,0.4)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => { p.update(); p.draw(); });
  requestAnimationFrame(animate);
}
initParticles();
animate();

// Simple slideshow
function initSlideshows() {
  document.querySelectorAll('.slideshow').forEach(show => {
    const slides = show.querySelectorAll('img');
    const dots = show.querySelectorAll('.dots span');
    let index = 0;

    slides[0].classList.add('active');
    dots[0].classList.add('active');

    setInterval(() => {
      slides[index].classList.remove('active');
      dots[index].classList.remove('active');
      index = (index + 1) % slides.length;
      slides[index].classList.add('active');
      dots[index].classList.add('active');
    }, 3000);
  });
}

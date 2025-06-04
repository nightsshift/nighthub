const canvas = document.getElementById('stars-canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const stars = [];
const starCount = 100;
const shootingStars = [];

class Star {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 1.5 + 0.5;
    this.speedX = Math.random() * 0.03 - 0.015;
    this.speedY = Math.random() * 0.03 - 0.015;
    this.opacity = Math.random() * 0.5 + 0.4;
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
    if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
  }
  draw() {
    ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

class ShootingStar {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height / 2;
    this.length = Math.random() * 20 + 10;
    this.speed = Math.random() * 4 + 3;
    this.opacity = 1;
  }
  update() {
    this.x += this.speed;
    this.y += this.speed;
    this.opacity -= 0.015;
    if (this.opacity <= 0) {
      shootingStars.splice(shootingStars.indexOf(this), 1);
    }
  }
  draw() {
    ctx.strokeStyle = `rgba(141, 141, 255, ${this.opacity})`;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(this.x - this.length, this.y - this.length);
    ctx.stroke();
  }
}

function initStars() {
  for (let i = 0; i < starCount; i++) {
    stars.push(new Star());
  }
}

function animateStars() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop(0, '#4B0082');
  gradient.addColorStop(0.4, '#2F0047');
  gradient.addColorStop(1, '#008B8B');
  ctx.fillStyle = gradient;
  ctx.globalAlpha = 0.08;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.globalAlpha = 1;

  stars.forEach(star => {
    star.update();
    star.draw();
  });
  shootingStars.forEach(star => {
    star.update();
    star.draw();
  });
  if (Math.random() < 0.005) {
    shootingStars.push(new ShootingStar());
  }
  requestAnimationFrame(animateStars);
}

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

initStars();
animateStars();

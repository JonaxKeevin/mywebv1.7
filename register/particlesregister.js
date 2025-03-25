const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const particleCount = 100;
const drawCount = 90;
const particles = [];
const speedMultiplier = 6.5;

class Particle {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = Math.random() * canvas.width;
    this.y = 15;
    this.targetX = Math.random() * canvas.width;
    this.targetY = canvas.height * 2;
    this.speed = (Math.random() * 5 + 1) * speedMultiplier;
    this.size = Math.random() * 8;
    this.radius = Math.random() * 4;
    this.rotation = 0;
  }

  update() {
    const deltaTime = 1 / 120;
    this.x += (this.targetX - this.x) * deltaTime * (this.speed / 60);
    this.y += (this.targetY - this.y) * deltaTime * (this.speed / 60);
    this.rotation += deltaTime;
    if (this.y > canvas.height) {
      this.reset();
    }
  }

  draw() {
    const angle = (Math.PI * 2) / 3;
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);

    for (let j = 0; j < 5; j++) {
      const alpha = 0.1 - j * 0.02;
      ctx.fillStyle = `rgba(255, 0, 0, ${alpha})`;
      ctx.beginPath();
      ctx.arc(0, 0, this.size + j * 2, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.fillStyle = "rgb(255, 0, 0)";
    ctx.beginPath();
    for (let i = 0; i < 3; i++) {
      const x = this.size * Math.cos(this.rotation + i * angle);
      const y = this.size * Math.sin(this.rotation + i * angle);
      ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }
}

for (let i = 0; i < particleCount; i++) {
  particles.push(new Particle());
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < drawCount; i++) {
    particles[i].update();
    particles[i].draw();
  }
  requestAnimationFrame(animate);
}

animate();

//ajusta las particulas al cambiar de dimension movil-pc
function resizeCanvas() {
  const prevWidth = canvas.width;
  const prevHeight = canvas.height;

  // Ajustar el tamaño del canvas al tamaño actual de la ventana
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  // Ajustar la posición de las partículas proporcionalmente
  particles.forEach((p) => {
    p.x *= canvas.width / prevWidth;
    p.y *= canvas.height / prevHeight;
    p.targetX *= canvas.width / prevWidth;
    p.targetY *= canvas.height / prevHeight;
  });
}

// Escuchar cambios de tamaño en la ventana
window.addEventListener("resize", resizeCanvas);

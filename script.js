const canvas = document.getElementById('animationCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const mouse = {
  x: null,
  y: null,
  isHovering: false
};

const maxDistance = 150;
const dotsArray = [];

canvas.addEventListener('mousemove', function(event) {
  mouse.x = event.x;
  mouse.y = event.y;
  mouse.isHovering = true;
});

canvas.addEventListener('mouseleave', function() {
  mouse.x=null;
  mouse.y=null;
  mouse.isHovering = false;
});

window.addEventListener('resize', function() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  init(); // Reinitialize dots on resize
});
class Dot {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = 1.5; // Adjust size range as desired
    this.baseX = this.x;
    this.baseY = this.y;
    this.density = (Math.random() * 30) + 1;
    this.speed = 0.5; // Adjust speed of movement
    this.vx = Math.random() * this.speed * 2 - this.speed; // Random velocity in x direction
    this.vy = Math.random() * this.speed * 2 - this.speed; // Random velocity in y direction
  }

  draw() {
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;

    // Boundary check to keep dots within canvas
    if (this.x < 0 || this.x > canvas.width) {
      this.vx = -this.vx; // Reverse velocity to bounce back
    }
    if (this.y < 0 || this.y > canvas.height) {
      this.vy = -this.vy; // Reverse velocity to bounce back
    }
  }

  connectTo(dot) {
    let dx = this.x - dot.x;
    let dy = this.y - dot.y;
    let distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < maxDistance) {
      ctx.strokeStyle = 'rgba(255, 255, 255, ' + (1 - distance / maxDistance) + ')';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(dot.x, dot.y);
      ctx.stroke();
    }
  }
}

function init() {
  dotsArray.length = 0;
  let numberOfDots = (canvas.width * canvas.height) / 7000;
  for (let i = 0; i < numberOfDots; i++) {
    let x = Math.random() * canvas.width;
    let y = Math.random() * canvas.height;
    dotsArray.push(new Dot(x, y));
  }
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < dotsArray.length; i++) {
    dotsArray[i].update();
    dotsArray[i].draw();

    if (mouse.isHovering) {
      dotsArray[i].connectTo(mouse);
    }
  }
  requestAnimationFrame(animate);
}

init();
animate();

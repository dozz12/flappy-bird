const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const gameOverScreen = document.getElementById('gameOverScreen');
const finalScore = document.getElementById('finalScore');

// Load sounds
const flapSound = new Audio('sounds/flap.wav');
const hitSound = new Audio('sounds/hit.wav');

let bird, pipes, frame, score, gameOver;

function init() {
  bird = {
    x: 50,
    y: 150,
    width: 30,
    height: 30,
    gravity: 0.6,
    lift: -10,
    velocity: 0,
    angle: 0
  };
  pipes = [];
  frame = 0;
  score = 0;
  gameOver = false;
  gameOverScreen.style.display = 'none';
  animate();
}

function drawBird() {
  ctx.save();
  ctx.translate(bird.x + bird.width/2, bird.y + bird.height/2);
  ctx.rotate(bird.angle);
  ctx.fillStyle = "yellow";
  ctx.fillRect(-bird.width/2, -bird.height/2, bird.width, bird.height);
  ctx.restore();
}

function drawPipe(pipe) {
  ctx.fillStyle = "green";
  ctx.fillRect(pipe.x, 0, pipe.width, pipe.top);
  ctx.fillRect(pipe.x, pipe.bottom, pipe.width, canvas.height - pipe.bottom);
}

function drawScore() {
  ctx.fillStyle = "#333";
  ctx.font = "24px Arial";
  ctx.fillText("Score: " + score, 10, 30);
}

function animate() {
  if (gameOver) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  bird.velocity += bird.gravity;
  bird.y += bird.velocity;

  // Rotate bird
  bird.angle = Math.min(Math.PI / 4, bird.velocity / 10);

  if (bird.y + bird.height > canvas.height || bird.y < 0) {
    return endGame();
  }

  if (frame % 90 === 0) {
    let top = Math.random() * 250 + 50;
    let gap = 130;
    pipes.push({
      x: canvas.width,
      width: 50,
      top: top,
      bottom: top + gap,
    });
  }

  for (let i = 0; i < pipes.length; i++) {
    let p = pipes[i];
    p.x -= 2;
    drawPipe(p);

    // Collision detection
    if (
      bird.x < p.x + p.width &&
      bird.x + bird.width > p.x &&
      (bird.y < p.top || bird.y + bird.height > p.bottom)
    ) {
      return endGame();
    }

    // Score
    if (p.x + p.width === bird.x) score++;
  }

  pipes = pipes.filter(p => p.x + p.width > 0);

  drawBird();
  drawScore();

  frame++;
  requestAnimationFrame(animate);
}

function flap() {
  if (gameOver) return;
  bird.velocity = bird.lift;
  flapSound.currentTime = 0;
  flapSound.play();
}

function endGame() {
  gameOver = true;
  hitSound.play();
  finalScore.textContent = `Skor Akhir: ${score}`;
  gameOverScreen.style.display = 'block';
}

function restartGame() {
  init();
}

// Controls
document.addEventListener("keydown", e => {
  if (e.code === "Space") flap();
});
document.addEventListener("click", flap);

init();

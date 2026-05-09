type DinoObstacle = {
  x: number;
  y: number;
  width: number;
  height: number;
};

const triggerClicksRequired = 3;
const bestScoreStorageKey = "jg-dino-best";

const triggers = document.querySelectorAll<HTMLElement>("[data-dino-trigger]");
const gameShell = document.querySelector<HTMLElement>(".dino-easter-egg");
const gameStage = document.querySelector<HTMLButtonElement>("[data-dino-stage]");
const restartButton = document.querySelector<HTMLButtonElement>("[data-dino-restart]");
const dinoCanvas = document.querySelector<HTMLCanvasElement>("#dino-canvas");
const scoreOutput = document.querySelector<HTMLElement>("[data-dino-score]");
const bestOutput = document.querySelector<HTMLElement>("[data-dino-best]");
const helpOutput = document.querySelector<HTMLElement>("[data-dino-help]");

if (
  triggers.length > 0 &&
  gameShell &&
  gameStage &&
  restartButton &&
  dinoCanvas &&
  scoreOutput &&
  bestOutput &&
  helpOutput
) {
  const scoreLabel = scoreOutput;
  const bestLabel = bestOutput;
  const helpLabel = helpOutput;
  const ctx = dinoCanvas.getContext("2d");
  const dino = {
    x: 54,
    y: 0,
    size: 31,
    velocity: 0,
    grounded: true,
  };
  const game: {
    active: boolean;
    ended: boolean;
    lastTime: number;
    obstacleTimer: number;
    score: number;
    best: number;
    speed: number;
    width: number;
    height: number;
    groundY: number;
    obstacles: DinoObstacle[];
  } = {
    active: false,
    ended: false,
    lastTime: 0,
    obstacleTimer: 0,
    score: 0,
    best: Number(localStorage.getItem(bestScoreStorageKey) ?? "0"),
    speed: 4.6,
    width: 900,
    height: 240,
    groundY: 196,
    obstacles: [],
  };

  let contactClicks = 0;

  bestLabel.textContent = String(game.best);

  const drawDino = () => {
    if (!ctx) {
      return;
    }

    ctx.fillStyle = "#f4f2ed";
    ctx.fillRect(dino.x + 4, dino.y + 5, 21, 19);
    ctx.fillRect(dino.x + 21, dino.y + 10, 11, 8);
    ctx.fillRect(dino.x + 8, dino.y + 24, 7, 7);
    ctx.fillRect(dino.x + 21, dino.y + 24, 7, 7);
    ctx.fillStyle = "#101113";
    ctx.fillRect(dino.x + 22, dino.y + 8, 3, 3);
  };

  const drawObstacle = (obstacle: DinoObstacle) => {
    if (!ctx) {
      return;
    }

    ctx.fillStyle = "#91d87b";
    ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    ctx.fillRect(obstacle.x - 7, obstacle.y + 14, 7, 9);
    ctx.fillRect(obstacle.x + obstacle.width, obstacle.y + 8, 8, 9);
  };

  const drawGame = () => {
    if (!ctx) {
      return;
    }

    ctx.clearRect(0, 0, game.width, game.height);
    ctx.fillStyle = "#101113";
    ctx.fillRect(0, 0, game.width, game.height);
    ctx.strokeStyle = "rgb(255 255 255 / 16%)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(18, game.groundY + 1);
    ctx.lineTo(game.width - 18, game.groundY + 1);
    ctx.stroke();
    ctx.fillStyle = "rgb(77 241 210 / 42%)";

    for (let x = (game.score * 4) % 46; x < game.width; x += 46) {
      ctx.fillRect(x, game.groundY + 14, 16, 2);
    }

    game.obstacles.forEach(drawObstacle);
    drawDino();
  };

  const resizeGame = () => {
    const bounds = dinoCanvas.getBoundingClientRect();
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    game.width = Math.max(bounds.width, 320);
    game.height = Math.max(bounds.height, 190);
    game.groundY = game.height - 38;
    dinoCanvas.width = Math.floor(game.width * pixelRatio);
    dinoCanvas.height = Math.floor(game.height * pixelRatio);
    ctx?.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

    if (dino.grounded) {
      dino.y = game.groundY - dino.size;
    }

    drawGame();
  };

  const spawnObstacle = () => {
    const tall = Math.random() > 0.55;
    game.obstacles.push({
      x: game.width + 20,
      y: game.groundY - (tall ? 46 : 31),
      width: tall ? 18 : 26,
      height: tall ? 46 : 31,
    });
    game.obstacleTimer = Math.max(570, 1120 - game.score * 1.6) + Math.random() * 360;
  };

  const resetGame = () => {
    game.active = true;
    game.ended = false;
    game.lastTime = performance.now();
    game.obstacleTimer = 900;
    game.score = 0;
    game.speed = 4.6;
    game.obstacles = [];
    dino.y = game.groundY - dino.size;
    dino.velocity = 0;
    dino.grounded = true;
    scoreLabel.textContent = "0";
    helpLabel.textContent = "press space or tap to jump";
    requestAnimationFrame(tickGame);
  };

  const unlockGame = () => {
    gameShell.hidden = false;
    gameShell.classList.add("is-unlocked");
    requestAnimationFrame(() => {
      resizeGame();
      gameShell.scrollIntoView({ behavior: "smooth", block: "center" });

      if (!game.active) {
        resetGame();
      }
    });
  };

  const jump = () => {
    if (!gameShell.classList.contains("is-unlocked")) {
      return;
    }

    if (game.ended) {
      resetGame();
      return;
    }

    if (dino.grounded) {
      dino.velocity = -12.5;
      dino.grounded = false;
      helpLabel.textContent = "jump";
    }
  };

  const endGame = () => {
    game.active = false;
    game.ended = true;
    game.best = Math.max(game.best, Math.floor(game.score));
    localStorage.setItem(bestScoreStorageKey, String(game.best));
    bestLabel.textContent = String(game.best);
    helpLabel.textContent = "game over - tap restart";
  };

  const collides = (obstacle: DinoObstacle) => {
    const padding = 5;
    return (
      dino.x + padding < obstacle.x + obstacle.width &&
      dino.x + dino.size - padding > obstacle.x &&
      dino.y + padding < obstacle.y + obstacle.height &&
      dino.y + dino.size - padding > obstacle.y
    );
  };

  function tickGame(time: number) {
    if (!game.active) {
      drawGame();
      return;
    }

    const delta = Math.min(time - game.lastTime, 32);
    game.lastTime = time;
    game.score += delta * 0.014;
    game.speed = 4.6 + game.score * 0.018;
    game.obstacleTimer -= delta;

    if (game.obstacleTimer <= 0) {
      spawnObstacle();
    }

    dino.velocity += 0.58;
    dino.y += dino.velocity;

    if (dino.y >= game.groundY - dino.size) {
      dino.y = game.groundY - dino.size;
      dino.velocity = 0;
      dino.grounded = true;
    }

    game.obstacles = game.obstacles
      .map((obstacle) => ({
        ...obstacle,
        x: obstacle.x - game.speed,
      }))
      .filter((obstacle) => obstacle.x + obstacle.width > -20);

    if (game.obstacles.some(collides)) {
      endGame();
    }

    scoreLabel.textContent = String(Math.floor(game.score));
    drawGame();
    requestAnimationFrame(tickGame);
  }

  const registerTriggerClick = () => {
    contactClicks += 1;

    if (contactClicks >= triggerClicksRequired) {
      unlockGame();
    }
  };

  triggers.forEach((trigger) => {
    trigger.addEventListener("click", registerTriggerClick);
    trigger.addEventListener("keydown", (event) => {
      if (event.code === "Enter" || event.code === "Space") {
        event.preventDefault();
        registerTriggerClick();
      }
    });
  });

  gameStage.addEventListener("click", jump);
  restartButton.addEventListener("click", resetGame);
  window.addEventListener("resize", resizeGame);
  window.addEventListener("keydown", (event) => {
    if (!gameShell.classList.contains("is-unlocked")) {
      return;
    }

    const activeElement = document.activeElement;
    const isInsideGame =
      activeElement instanceof Node && (gameShell.contains(activeElement) || activeElement === document.body);

    if (!isInsideGame) {
      return;
    }

    if (event.code === "Space" || event.code === "ArrowUp") {
      event.preventDefault();
      jump();
    }
  });
}

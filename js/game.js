import { GRAVITY, GROUND_Y, WORLD_WIDTH, MOVE_SPEED, JUMP_VELOCITY, MAX_FALL_SPEED, DEFAULT_MSG } from './constants.js';
import { rectsOverlap } from './utils.js';
import { buildLevel } from './level.js';
import { keys } from './input.js';
import { draw } from './render.js';

export function createGame({ canvas, ctx, scoreEl, coinsEl, livesEl, msgEl }) {
  let level = buildLevel();

  const player = {
    x: 50, y: GROUND_Y - 40, w: 28, h: 40,
    vx: 0, vy: 0, onGround: false, facing: 1,
    dead: false,
  };

  let score = 0;
  let coinCount = 0;
  let lives = 3;
  let camX = 0;
  let won = false;
  let gameOver = false;

  function resetPlayer() {
    player.x = 50; player.y = GROUND_Y - 40;
    player.vx = 0; player.vy = 0; player.dead = false;
    camX = 0;
  }

  function resetGame() {
    level = buildLevel();
    score = 0; coinCount = 0; lives = 3;
    won = false; gameOver = false;
    resetPlayer();
    msgEl.textContent = DEFAULT_MSG;
  }

  function loseLife() {
    lives--;
    if (lives <= 0) {
      gameOver = true;
      msgEl.textContent = 'Game Over! Press R to restart.';
    } else {
      resetPlayer();
    }
  }

  function update() {
    if (gameOver || won) {
      if (keys['KeyR']) resetGame();
      return;
    }

    if (keys['ArrowLeft'] || keys['KeyA']) { player.vx = -MOVE_SPEED; player.facing = -1; }
    else if (keys['ArrowRight'] || keys['KeyD']) { player.vx = MOVE_SPEED; player.facing = 1; }
    else { player.vx = 0; }

    if ((keys['Space'] || keys['ArrowUp'] || keys['KeyW']) && player.onGround) {
      player.vy = JUMP_VELOCITY;
      player.onGround = false;
    }

    player.vy += GRAVITY;
    if (player.vy > MAX_FALL_SPEED) player.vy = MAX_FALL_SPEED;

    player.x += player.vx;
    player.x = Math.max(0, Math.min(WORLD_WIDTH - player.w, player.x));
    player.onGround = false;

    for (const p of level.platforms) {
      if (rectsOverlap(player, p)) {
        const prevBottom = player.y + player.h - player.vy;
        if (prevBottom <= p.y && player.vy >= 0) {
          player.y = p.y - player.h;
          player.vy = 0;
          player.onGround = true;
        }
      }
    }

    player.y += player.vy;
    for (const p of level.platforms) {
      if (rectsOverlap(player, p)) {
        if (player.vy > 0) {
          player.y = p.y - player.h;
          player.vy = 0;
          player.onGround = true;
        } else if (player.vy < 0) {
          player.y = p.y + p.h;
          player.vy = 0;
        }
      }
    }

    if (player.y > canvas.height + 100) {
      loseLife();
      return;
    }

    for (const coin of level.coins) {
      if (!coin.collected && rectsOverlap(player, coin)) {
        coin.collected = true;
        coinCount++;
        score += 50;
      }
    }

    for (const en of level.enemies) {
      if (!en.alive) continue;
      en.x += en.dir * 1.5;
      if (en.x < en.minX || en.x > en.maxX) en.dir *= -1;

      if (rectsOverlap(player, en)) {
        const playerBottom = player.y + player.h;
        const stomped = player.vy > 0 && (playerBottom - en.y) < 18;
        if (stomped) {
          en.alive = false;
          player.vy = -8;
          score += 100;
        } else {
          loseLife();
          return;
        }
      }
    }

    if (rectsOverlap(player, level.flag)) {
      won = true;
      score += 500;
      msgEl.textContent = 'You reached the flag! Score: ' + score + '. Press R to play again.';
    }

    camX = Math.max(0, Math.min(WORLD_WIDTH - canvas.width, player.x - canvas.width / 2));

    scoreEl.textContent = score;
    coinsEl.textContent = coinCount;
    livesEl.textContent = lives;
  }

  function loop() {
    update();
    draw(ctx, canvas, { camX, level, player, gameOver, won });
    requestAnimationFrame(loop);
  }

  return { loop };
}

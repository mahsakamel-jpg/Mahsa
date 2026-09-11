function drawCloud(ctx, x, y) {
  ctx.beginPath();
  ctx.arc(x, y, 18, 0, Math.PI * 2);
  ctx.arc(x + 20, y - 10, 22, 0, Math.PI * 2);
  ctx.arc(x + 40, y, 18, 0, Math.PI * 2);
  ctx.fill();
}

function drawBackground(ctx, canvas, camX) {
  ctx.fillStyle = '#5c94fc';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#ffffff';
  for (let i = 0; i < 6; i++) {
    const cx = ((i * 400 - camX * 0.3) % (canvas.width + 200)) - 100;
    drawCloud(ctx, cx, 60 + (i % 3) * 30);
  }
}

export function draw(ctx, canvas, { camX, level, player, gameOver, won }) {
  drawBackground(ctx, canvas, camX);
  ctx.save();
  ctx.translate(-camX, 0);

  ctx.fillStyle = '#8b4513';
  for (const p of level.platforms) {
    ctx.fillStyle = '#8b4513';
    ctx.fillRect(p.x, p.y, p.w, p.h);
    ctx.fillStyle = '#3a9d23';
    ctx.fillRect(p.x, p.y, p.w, 8);
  }

  ctx.fillStyle = '#ffd700';
  for (const coin of level.coins) {
    if (coin.collected) continue;
    ctx.beginPath();
    ctx.arc(coin.x + coin.w / 2, coin.y + coin.h / 2, coin.w / 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#b8860b';
    ctx.stroke();
  }

  for (const en of level.enemies) {
    if (!en.alive) continue;
    ctx.fillStyle = '#8b4513';
    ctx.fillRect(en.x, en.y, en.w, en.h);
    ctx.fillStyle = '#fff';
    ctx.fillRect(en.x + 4, en.y + 6, 6, 6);
    ctx.fillRect(en.x + en.w - 10, en.y + 6, 6, 6);
    ctx.fillStyle = '#000';
    ctx.fillRect(en.x + 6, en.y + 8, 2, 2);
    ctx.fillRect(en.x + en.w - 8, en.y + 8, 2, 2);
  }

  ctx.fillStyle = '#555';
  ctx.fillRect(level.flag.x, level.flag.y, 6, level.flag.h);
  ctx.fillStyle = '#e60000';
  ctx.beginPath();
  ctx.moveTo(level.flag.x + 6, level.flag.y);
  ctx.lineTo(level.flag.x + 40, level.flag.y + 15);
  ctx.lineTo(level.flag.x + 6, level.flag.y + 30);
  ctx.closePath();
  ctx.fill();

  if (!player.dead) {
    ctx.fillStyle = '#e60000';
    ctx.fillRect(player.x, player.y, player.w, player.h * 0.5);
    ctx.fillStyle = '#0000cd';
    ctx.fillRect(player.x, player.y + player.h * 0.5, player.w, player.h * 0.5);
    ctx.fillStyle = '#ffcc99';
    ctx.fillRect(player.facing > 0 ? player.x + player.w - 10 : player.x, player.y + 4, 10, 10);
  }

  ctx.restore();

  if (gameOver) {
    ctx.fillStyle = 'rgba(0,0,0,0.6)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#fff';
    ctx.font = '32px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2);
  } else if (won) {
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#fff';
    ctx.font = '32px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('YOU WIN!', canvas.width / 2, canvas.height / 2);
  }
}

import { createGame } from './game.js';

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

const game = createGame({
  canvas,
  ctx,
  scoreEl: document.getElementById('score'),
  coinsEl: document.getElementById('coins'),
  livesEl: document.getElementById('lives'),
  msgEl: document.getElementById('msg'),
});

game.loop();

import { GROUND_Y, WORLD_WIDTH } from './constants.js';

export function buildLevel() {
  const platforms = [
    { x: 0, y: GROUND_Y, w: 900, h: 40 },
    { x: 980, y: GROUND_Y, w: 500, h: 40 },
    { x: 1560, y: GROUND_Y, w: 700, h: 40 },
    { x: 2340, y: GROUND_Y, w: 860, h: 40 },
    { x: 300, y: 280, w: 100, h: 20 },
    { x: 500, y: 220, w: 100, h: 20 },
    { x: 1100, y: 260, w: 120, h: 20 },
    { x: 1700, y: 260, w: 120, h: 20 },
    { x: 1900, y: 200, w: 120, h: 20 },
    { x: 2500, y: 260, w: 140, h: 20 },
  ];
  const coins = [
    {x: 340, y: 240}, {x: 540, y: 180}, {x: 1140, y: 220},
    {x: 1740, y: 220}, {x: 1940, y: 160}, {x: 2540, y: 220},
    {x: 700, y: 320}, {x: 1400, y: 320}, {x: 2100, y: 320},
  ].map(c => ({...c, w: 20, h: 20, collected: false}));
  const enemies = [
    { x: 500, y: GROUND_Y - 28, w: 28, h: 28, dir: -1, alive: true, minX: 400, maxX: 850 },
    { x: 1200, y: GROUND_Y - 28, w: 28, h: 28, dir: 1, alive: true, minX: 1050, maxX: 1450 },
    { x: 1900, y: GROUND_Y - 28, w: 28, h: 28, dir: -1, alive: true, minX: 1650, maxX: 2200 },
    { x: 2600, y: GROUND_Y - 28, w: 28, h: 28, dir: 1, alive: true, minX: 2400, maxX: 3100 },
  ];
  const flag = { x: WORLD_WIDTH - 100, y: GROUND_Y - 200, w: 20, h: 200 };
  return { platforms, coins, enemies, flag };
}

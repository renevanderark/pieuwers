import { EnemyType } from "./types";

const skullPng = new Image();
skullPng.src = "./img/enemy.png";
const enemy2Png = new Image();
enemy2Png.src = "./img/enemy2.png";

const multiLaserPng = new Image();
multiLaserPng.src = "./img/enemy3.png";

const naaldLaserPng = new Image();
naaldLaserPng.src = "./img/dlnv.png"

export const enemySprites : {[key : string]: HTMLImageElement}= {
  [EnemyType.SKULL]: skullPng,
  [EnemyType.ENEMY_TWO]: enemy2Png,
  [EnemyType.MULTI_LASER]: multiLaserPng,
  [EnemyType.NAALDLASER]: naaldLaserPng
}

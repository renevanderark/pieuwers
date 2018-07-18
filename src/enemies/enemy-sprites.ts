import { EnemyType } from "./types";

const skullPng = new Image();
skullPng.src = "./img/enemy.png";
const enemy2Png = new Image();
enemy2Png.src = "./img/enemy2.png";

export const enemySprites : {[key : string]: HTMLImageElement}= {
  [EnemyType.SKULL]: skullPng,
  [EnemyType.SKULL_BOSS]: skullPng,
  [EnemyType.ENEMY_TWO]: enemy2Png
}

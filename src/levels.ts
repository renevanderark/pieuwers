import { EnemyType } from "./enemies/types";
import { VIRT_WIDTH, VIRT_HEIGHT } from "./store/constants";

export const level1 = (spawnEnemy : (t : EnemyType, x : number, y : number, s :number, h : number) => void) => [
  () => {
    for (let i = 0; i < 16; i++) {
      setTimeout(() => spawnEnemy(EnemyType.SKULL, VIRT_WIDTH / 2, -VIRT_HEIGHT / 3, 0.75, 5), i * 250);
    }
  },
  () => {
    for (let i = 0; i < 12; i++) {
      setTimeout(() => spawnEnemy(EnemyType.SKULL, VIRT_WIDTH / 2, -VIRT_HEIGHT / 3, 0.75, 10), i * 250);
    }
    for (let i = 0; i < 4; i++) {
      spawnEnemy(EnemyType.ENEMY_TWO, (VIRT_WIDTH / 8) + i * (VIRT_WIDTH / 4), -VIRT_HEIGHT / 3, 1, 5);
    }
  },
  () => {
    for (let i = 0; i < 12; i++) {
      setTimeout(() => spawnEnemy(EnemyType.SKULL, VIRT_WIDTH / 2, -VIRT_HEIGHT / 3, 0.75, 20), i * 250);
    }
    for (let i = 0; i < 6; i++) {
      spawnEnemy(EnemyType.ENEMY_TWO, (VIRT_WIDTH / 8) + i * (VIRT_WIDTH / 6), -VIRT_HEIGHT / 3, 1, 10);
    }
  },
  () => {
    for (let i = 0; i < 15; i++) {
      setTimeout(() => spawnEnemy(EnemyType.SKULL_SPAWN, VIRT_WIDTH / 2,-VIRT_HEIGHT / 3, 0.75, 30), i * 500);
    }
    spawnEnemy(EnemyType.SKULL_BOSS, VIRT_WIDTH / 2,-VIRT_HEIGHT / 3, 3, 300);
  }
];

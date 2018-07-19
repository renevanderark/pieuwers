import { EnemyType } from "./types";
import { Point } from "../phyz/shapes";
import { EnemyState } from "../store/enemy-reducer";
import { makeEnemyCollisionShapes } from "./enemy-collision-shapes";
import { ENEMY_BOUNDS } from "./enemy-bounding-boxes";

export const makeEnemy = (type : EnemyType, xPos : number, yPos : number, scale: number, health? : number) : EnemyState => ({
  enemyType: type,
  angle: 0, shooting: false,
  size: {x: ENEMY_BOUNDS[type].x * scale, y: ENEMY_BOUNDS[type].y * scale},
  collisionShapes: makeEnemyCollisionShapes[type](scale),
  health: health || 4, maxHealth: health || 4,
  pos: {y: yPos, x: xPos},
  startPos: {y: yPos, x: xPos},
  trajectory: 0,
  shootTimer: 100
});

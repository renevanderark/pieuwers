import { EnemyType } from "./types";
import { Point } from "../phyz/shapes";
import { EnemyState } from "../store/enemy-reducer";
import { makeEnemyCollisionShapes } from "./enemy-collision-shapes";
import { ENEMY_BOUNDS } from "./enemy-bounding-boxes";

export const makeEnemy = (type : EnemyType, xPos : number, yPos : number, scale: number, health? : number) : EnemyState => ({
  enemyType: type,
  accelerateLeft: false, accelerateRight: false,
  accelerateUp: false, accelerateDown: false,
  angle: 0, ySpeed: 0, shooting: false,
  axisX: null, axisY: null,
  size: {x: ENEMY_BOUNDS[type].x * scale, y: ENEMY_BOUNDS[type].y * scale},
  collisionShapes: makeEnemyCollisionShapes[type](scale),
  health: health || 4, maxHealth: health || 4,
  pos: {y: yPos, x: xPos},
  collided: false
});

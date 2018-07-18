import { EnemyType } from "./types";
import { Point } from "../phyz/shapes";
import { EnemyState } from "../store/enemy-reducer";
import { makeEnemyCollisionShapes } from "./enemy-collision-shapes";

export const makeEnemy = (type : EnemyType, xPos : number, yPos : number, size: Point, health? : number) : EnemyState => ({
  enemyType: type,
  accelerateLeft: false, accelerateRight: false,
  accelerateUp: false, accelerateDown: false,
  angle: 0, ySpeed: 0, shooting: false,
  axisX: null, axisY: null,
  size: size,
  collisionShapes: makeEnemyCollisionShapes[type](size),
  health: health || 4, maxHealth: health || 4,
  pos: {y: yPos, x: xPos},
  collided: false
});

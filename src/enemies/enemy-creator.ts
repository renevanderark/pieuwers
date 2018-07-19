import { EnemyType } from "./types";
import { Point } from "../phyz/shapes";
import { EnemyState } from "../store/enemy-reducer";
import { makeEnemyCollisionShapes } from "./enemy-collision-shapes";
import { ENEMY_BOUNDS } from "./enemy-bounding-boxes";
import { FlyBehaviour } from "./enemy-fly-behaviours";

export interface EnemySpawnParams {
  type: EnemyType
  flyBehaviour: FlyBehaviour
  health: number
  scale: number
  pos: Point
}

export const makeEnemy = (p : EnemySpawnParams) : EnemyState => ({
  enemyType: p.type,
  flyBehaviour: p.flyBehaviour,
  angle: 0,
  shooting: false,
  size: {x: ENEMY_BOUNDS[p.type].x * p.scale, y: ENEMY_BOUNDS[p.type].y * p.scale},
  collisionShapes: makeEnemyCollisionShapes[p.type](p.scale),
  health: p.health,
  maxHealth: p.health,
  pos: p.pos,
  startPos: p.pos,
  trajectory: 0,
  shootTimer: 100
});


/*
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
*/

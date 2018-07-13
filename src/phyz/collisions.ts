import { BulletState } from "../store/bullet-reducer";
import { GameState } from "../store/reducers";
import { COLLISION_GRID_SIZE, EnemyState } from "../store/enemy-reducer";
import { Point } from "./shapes";


const enemyCollidesWithBullet = (bullet : BulletState, enemy: EnemyState) : boolean =>
    Math.sqrt(Math.pow(bullet.pos.x - enemy.pos.x, 2) + Math.pow(bullet.pos.y - enemy.pos.y, 2)) < enemy.collisionRadius;


const bulletToCollisionKey = (bullet : BulletState) : string =>
  `${Math.floor(bullet.pos.x / COLLISION_GRID_SIZE) * COLLISION_GRID_SIZE}-${Math.floor(bullet.pos.y / COLLISION_GRID_SIZE) *  COLLISION_GRID_SIZE}`;


export const detectBulletToEnemyCollisions : (s : GameState) => Array<{enemies: Array<number>, bulletIdx : number, collsionPos: Point}> =
  ({ bulletStates : { bullets }, enemyStates : { collisionGrid, enemies } }) =>
  bullets.map((bullet, bulletIdx) => ({
    enemies: (collisionGrid[bulletToCollisionKey(bullet)]||[])
      .filter((enemyIdx) => enemyCollidesWithBullet(bullet, enemies[enemyIdx])),
    bulletIdx: bulletIdx,
    collsionPos: { x: bullet.pos.x, y: bullet.pos.y }
  }))
  .filter(({enemies, bulletIdx}) => enemies.length > 0)

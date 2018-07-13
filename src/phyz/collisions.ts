import { BulletState } from "../store/bullet-reducer";
import { GameState } from "../store/reducers";
import { EnemyState } from "../store/enemy-reducer";
import { Point, Box, Circle, isBox } from "./shapes";
import { pointWithinBox } from "./boxes";

const pointWithinCircle = (pos : Point, c : Circle) : boolean =>
  Math.sqrt(Math.pow(pos.x - c.x, 2) + Math.pow(pos.y - c.y, 2)) <= c.radius;

const pointWithinAreaList = (p : Point, shapes : Array<Circle|Box>) : boolean =>
  shapes.map(shape => isBox(shape) ? pointWithinBox(p, <Box>shape) : pointWithinCircle(p, <Circle>shape))
    .filter(result => result)
    .length > 0;

const translateToEnemyOrigin = (bullet : BulletState, enemy: EnemyState) : Point => ({
  x: bullet.pos.x - enemy.pos.x,
  y: bullet.pos.y - enemy.pos.y
});
//enemy.angle * Math.PI / 180
const rotateToEnemyAngle = (p : Point, angle : number) => ({
  x: p.x * Math.cos(angle) - p.y * Math.sin(angle),
  y: p.x * Math.sin(angle) + p.y * Math.cos(angle)
});


const enemyCollidesWithBullet = (bullet : BulletState, enemy: EnemyState) : boolean =>
    pointWithinBox(rotateToEnemyAngle(translateToEnemyOrigin(bullet, enemy), -enemy.angle  * Math.PI / 180), {
      x: -enemy.size.x / 2,
      y: -enemy.size.y / 2,
      w: enemy.size.x,
      h: enemy.size.y
    }) && pointWithinAreaList(rotateToEnemyAngle(translateToEnemyOrigin(bullet, enemy), -enemy.angle  * Math.PI / 180), enemy.collisionShapes);

/* PREMATURE OPTIM.
const bulletToCollisionKey = (bullet : BulletState) : string =>
  `${Math.floor(bullet.pos.x / COLLISION_GRID_SIZE) * COLLISION_GRID_SIZE}-${Math.floor(bullet.pos.y / COLLISION_GRID_SIZE) *  COLLISION_GRID_SIZE}`;
*/

export const detectBulletToEnemyCollisions : (s : GameState) => Array<{enemies: Array<number>, bulletIdx : number, collsionPos: Point}> =
  ({ bulletStates : { bullets }, enemyStates : { enemies } }) =>
  bullets.map((bullet, bulletIdx) => ({
    enemies: /* (collisionGrid[bulletToCollisionKey(bullet)]||[]) */
      enemies.map((en, idx) => idx)
      .filter((enemyIdx) => enemyCollidesWithBullet(bullet, enemies[enemyIdx])),
    bulletIdx: bulletIdx,
    collsionPos: { x: bullet.pos.x, y: bullet.pos.y }
  }))
  .filter(({enemies, bulletIdx}) => enemies.length > 0)

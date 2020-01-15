import { BulletState } from "../store/bullet-reducer";
import { GameState } from "../store/reducers";
import { EnemyState } from "../store/enemy-reducer";
import { Point, Box, Circle, isBox, getBoundingBox } from "./shapes";
import { pointWithinBox, getTr, getBl, getBr } from "./boxes";
import { translateToOrigin, rotateAroundOrigin, rotateBoxAroundOrigin, distance} from "./shape-ops";
import { PieuwerState } from "../store/pieuwer-reducer";
import { Thing, FireType } from "../store/thing";

const pointWithinCircle = (pos : Point, c : Circle) : boolean =>
  distance(pos, c) <= c.radius;

const pointWithinAreaList = (p : Point, shapes : Array<Circle|Box>) : boolean =>
  shapes.map(shape => isBox(shape) ? pointWithinBox(p, <Box>shape) : pointWithinCircle(p, <Circle>shape))
    .filter(result => result)
    .length > 0;



const pointWithinBoundingBox = (pos : Point, thing : Thing) : boolean =>
  pointWithinBox(
    rotateAroundOrigin(
      translateToOrigin(pos, thing.pos),
      -thing.angle  * Math.PI / 180
    ), getBoundingBox(thing))

const thingCollidesWithBullet = (bullet : BulletState, thing: Thing) : boolean =>
    pointWithinBoundingBox(bullet.pos, thing) &&
    pointWithinAreaList(
      rotateAroundOrigin(
        translateToOrigin(bullet.pos, thing.pos),
        -thing.angle * Math.PI / 180),
      thing.collisionShapes
    );

/* PREMATURE OPTIM.
const bulletToCollisionKey = (bullet : BulletState) : string =>
  `${Math.floor(bullet.pos.x / COLLISION_GRID_SIZE) * COLLISION_GRID_SIZE}-${Math.floor(bullet.pos.y / COLLISION_GRID_SIZE) *  COLLISION_GRID_SIZE}`;
*/

export const detectBulletToEnemyCollisions : (s : GameState) => Array<{enemies: Array<number>, bulletIdx : number, collsionPos: Point}> =
  ({ bulletStates : { bullets }, enemyStates : { enemies } }) =>
  bullets.map((bullet, bulletIdx) => ({
    enemies: /* (collisionGrid[bulletToCollisionKey(bullet)]||[]) */
      enemies.map((en, idx) => idx)
      .filter((enemyIdx) => thingCollidesWithBullet(bullet, enemies[enemyIdx])),
    bulletIdx: bulletIdx,
    collsionPos: { x: bullet.pos.x, y: bullet.pos.y }
  }))
  .filter(({enemies, bulletIdx}) => enemies.length > 0)

export const detectEnemyBulletToPieuwerCollisions : (s : GameState) => Array<{pieuwerKeys: Array<string>, bulletIdx : number, collsionPos: Point}> =
  ({ bulletStates : { enemyBullets }, pieuwerStates }) =>
  enemyBullets.map((bullet, bulletIdx) => ({
    pieuwerKeys: ["pieuwerOne", "pieuwerTwo"]
      .filter(pieuwerKey => thingCollidesWithBullet(bullet, pieuwerStates[pieuwerKey])),
    bulletIdx: bulletIdx,
    collsionPos: { x: bullet.pos.x, y: bullet.pos.y }
  }))
  .filter(({pieuwerKeys, bulletIdx}) => pieuwerKeys.length > 0);

const thingCollidesWithLaser = (laserPoint : Point, thing: Thing) : boolean =>
  laserPoint.x >= thing.pos.x - thing.size.x / 2 && laserPoint.x <= thing.pos.x + thing.size.x / 2;

export const detectEnemyLaserToPieuwerCollisions : (s : GameState) => Array<{pieuwerKeys: Array<string>}> =
    ({ enemyStates : { enemies }, pieuwerStates }) =>
    enemies
      .filter(enemy => enemy.fireType === FireType.LASER && enemy.shooting)
      .map((enemy) => ({ pieuwerKeys: ["pieuwerOne", "pieuwerTwo"]
        .filter(pieuwerKey => thingCollidesWithLaser(enemy.pos, pieuwerStates[pieuwerKey])),
      }))
    .filter(({pieuwerKeys}) => pieuwerKeys.length > 0);

const getBoundingBoxCollisionsForPieuwer = (pieuwer : PieuwerState, enemies : Array<EnemyState>) : Array<number> =>
  rotateBoxAroundOrigin(getBoundingBox(pieuwer), pieuwer.angle * Math.PI / 180)
      .map(point => translateToOrigin(pieuwer.pos, point))
      .map(point => enemies.map((en, idx) => idx).filter(idx => pointWithinBoundingBox(point, enemies[idx])))
      .reduce((a,b) => a.concat(b), [])
    .concat(enemies
      .map((enemy, enemyIdx) => ({
        idx: enemyIdx,
        collides: rotateBoxAroundOrigin(getBoundingBox(enemy), enemy.angle * Math.PI / 180)
          .map(point => translateToOrigin(enemy.pos, point))
          .map(point => pointWithinBoundingBox(point, pieuwer))
          .indexOf(true) > -1
      }))
      .filter(({collides}) => collides)
      .map(({idx}) => idx)
    ).filter((val, idx, self) => self.indexOf(val) === idx);


const circleCollidesWithCircle = (a : Circle, b : Circle) =>
  distance(a, b) <= a.radius + b.radius;



const circleCollidesWithBox = (c : Circle, b : Box) =>
  distance(c, b) <= c.radius ||
  distance(c, getTr(b)) <= c.radius ||
  distance(c, getBl(b)) <= c.radius ||
  distance(c, getBr(b)) <= c.radius ||
  pointWithinBox({x: c.x + Math.cos(Math.PI / 180) * c.radius, y: c.y + Math.sin(Math.PI / 180) * c.radius}, b) ||
  pointWithinBox({x: c.x + Math.cos(90 * (Math.PI / 180)) * c.radius, y: c.y + Math.sin(90 * (Math.PI / 180)) * c.radius}, b) ||
  pointWithinBox({x: c.x + Math.cos(180 * (Math.PI / 180)) * c.radius, y: c.y + Math.sin(180 * (Math.PI / 180)) * c.radius}, b) ||
  pointWithinBox({x: c.x + Math.cos(270 * (Math.PI / 180)) * c.radius, y: c.y + Math.sin(270 * (Math.PI / 180)) * c.radius}, b)


export type CollisionList = Array<{shapeIndex: number, collidingCorners: Array<number>}>;

export interface ShapeCollisions {
  collides: boolean
  collidingCorners: CollisionList
  collidingEnemyCorners: CollisionList
}

const getCollidingCorners = (thing1 : Thing, thing2 : Thing) : Array<Array<boolean>> =>
  thing1.collisionShapes.map(shape => {
    if (isBox(shape)) {
      return rotateBoxAroundOrigin(<Box>shape, (thing1.angle+180) * Math.PI / 180)
        .map(point => translateToOrigin(thing1.pos, point))
        .map(point =>
          pointWithinAreaList(
            rotateAroundOrigin(translateToOrigin(point, thing2.pos), -thing2.angle * Math.PI / 180), thing2.collisionShapes))
    } else {
      const testCircle = {
              ...rotateAroundOrigin(translateToOrigin(translateToOrigin(thing1.pos, rotateAroundOrigin(shape, (thing1.angle+180) * Math.PI / 180)), thing2.pos), -thing2.angle * (Math.PI / 180)),
              radius: (<Circle>shape).radius
            };
      return [thing2.collisionShapes.map(thing2Shape => {
        if (isBox(thing2Shape)) {
          return circleCollidesWithBox(
            testCircle,
            <Box>thing2Shape
          )
        } else {
          return circleCollidesWithCircle(
              testCircle,
              <Circle>thing2Shape,
          );
        }
      }).indexOf(true) > -1]
    }
  });

const mapCollidingCorners = (collidingCorners : Array<Array<boolean>>) : CollisionList =>
  collidingCorners.map((corners, shapeIndex) => ({
      shapeIndex: shapeIndex,
      collidingCorners: corners.map((c, idx) => ({collides: c, idx: idx}))
      .filter(({collides, idx}) => collides).map(({idx}) => idx)
    }))
    .filter(({collidingCorners}) => collidingCorners.length > 0)

const getShapeCollisions = (enemy : EnemyState, pieuwer : PieuwerState) : ShapeCollisions => {
  const collidingCorners = getCollidingCorners(pieuwer, enemy);
  const collidingEnemyCorners = getCollidingCorners(enemy, pieuwer);
  const collides = collidingCorners.concat(collidingEnemyCorners)
    .reduce((a,b) => a.concat(b), []).indexOf(true) > -1

  return {
    collides: collides,
    collidingCorners: collides
      ? mapCollidingCorners(collidingCorners)
      : [],
    collidingEnemyCorners: collides
      ? mapCollidingCorners(collidingEnemyCorners)
      : [],
  };
};

export interface PieuwerToEnemyCollisions {
  [key: string]: Array<{enemyIdx : number, collisions: ShapeCollisions}>
}

export const detectPieuwerToEnemyCollisions : (s : GameState) => PieuwerToEnemyCollisions =
  ({ pieuwerStates : { pieuwerOne, pieuwerTwo }, enemyStates : { enemies } }) => {
    return {
      "pieuwerOne": getBoundingBoxCollisionsForPieuwer(pieuwerOne, enemies)
        .map(enemyIdx => ({
          collisions: getShapeCollisions(enemies[enemyIdx], pieuwerOne),
          enemyIdx: enemyIdx
        }))
        .filter(({collisions}) => collisions.collides),
      "pieuwerTwo" : getBoundingBoxCollisionsForPieuwer(pieuwerTwo, enemies)
        .map(enemyIdx => ({
          collisions: getShapeCollisions(enemies[enemyIdx], pieuwerTwo),
          enemyIdx: enemyIdx
        }))
        .filter(({collisions}) => collisions.collides),
    };
}

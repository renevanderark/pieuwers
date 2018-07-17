import { BulletState } from "../store/bullet-reducer";
import { GameState } from "../store/reducers";
import { EnemyState } from "../store/enemy-reducer";
import { Point, Box, Circle, isBox, getBoundingBox } from "./shapes";
import { pointWithinBox } from "./boxes";
import { translateToOrigin, rotateAroundOrigin, rotateBoxAroundOrigin} from "./shape-ops";
import { PieuwerKey, PieuwerState } from "../store/pieuwer-reducer";

const pointWithinCircle = (pos : Point, c : Circle) : boolean =>
  Math.sqrt(Math.pow(pos.x - c.x, 2) + Math.pow(pos.y - c.y, 2)) <= c.radius;

const pointWithinAreaList = (p : Point, shapes : Array<Circle|Box>) : boolean =>
  shapes.map(shape => isBox(shape) ? pointWithinBox(p, <Box>shape) : pointWithinCircle(p, <Circle>shape))
    .filter(result => result)
    .length > 0;



const pointWithinBoundingBox = <S extends PieuwerState>(pos : Point, thing : S) : boolean =>
  pointWithinBox(
    rotateAroundOrigin(
      translateToOrigin(pos, thing.pos),
      -thing.angle  * Math.PI / 180
    ), getBoundingBox(thing))

const enemyCollidesWithBullet = (bullet : BulletState, enemy: EnemyState) : boolean =>
    pointWithinBoundingBox(bullet.pos, enemy) &&
    pointWithinAreaList(
      rotateAroundOrigin(
        translateToOrigin(bullet.pos, enemy.pos),
        -enemy.angle * Math.PI / 180),
      enemy.collisionShapes
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
      .filter((enemyIdx) => enemyCollidesWithBullet(bullet, enemies[enemyIdx])),
    bulletIdx: bulletIdx,
    collsionPos: { x: bullet.pos.x, y: bullet.pos.y }
  }))
  .filter(({enemies, bulletIdx}) => enemies.length > 0)

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
  Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2)) <= a.radius + b.radius;



const circleCollidesWithBox = (c : Circle, b : Box) =>
  Math.sqrt(Math.pow(c.x - b.x, 2) + Math.pow(c.y - b.y, 2)) <= c.radius ||
  Math.sqrt(Math.pow(c.x - (b.x + b.w), 2) + Math.pow(c.y - b.y, 2)) <= c.radius ||
  Math.sqrt(Math.pow(c.x - (b.x + b.w), 2) + Math.pow(c.y - (b.y + b.h), 2)) <= c.radius ||
  Math.sqrt(Math.pow(c.x - b.x, 2) + Math.pow(c.y - (b.y + b.h), 2)) <= c.radius ||
  pointWithinBox({x: c.x + Math.cos(Math.PI / 180) * c.radius, y: c.y + Math.sin(Math.PI / 180) * c.radius}, b) ||
  pointWithinBox({x: c.x + Math.cos(90 * (Math.PI / 180)) * c.radius, y: c.y + Math.sin(90 * (Math.PI / 180)) * c.radius}, b) ||
  pointWithinBox({x: c.x + Math.cos(180 * (Math.PI / 180)) * c.radius, y: c.y + Math.sin(180 * (Math.PI / 180)) * c.radius}, b) ||
  pointWithinBox({x: c.x + Math.cos(270 * (Math.PI / 180)) * c.radius, y: c.y + Math.sin(270 * (Math.PI / 180)) * c.radius}, b)


interface ShapeCollisions {
  collides: boolean
  collidingCorners: Array<{shapeIndex: number, collidingCorners: Array<number>}>
  //collidingEnemyCorners: Array<{shapeIndex: number, collidingCorners: Array<number>}>
}

const getShapeCollisions = (enemy : EnemyState, pieuwer : PieuwerState) : ShapeCollisions => {
  const collidingCorners = pieuwer.collisionShapes.map(shape => {
    if (isBox(shape)) {
      return rotateBoxAroundOrigin(<Box>shape, (pieuwer.angle+180) * Math.PI / 180)
        .map(point => translateToOrigin(pieuwer.pos, point))
        .map(point =>
          pointWithinAreaList(
            rotateAroundOrigin(translateToOrigin(point, enemy.pos), -enemy.angle * Math.PI / 180), enemy.collisionShapes))
    } else {
      const testCircle = {
              ...rotateAroundOrigin(translateToOrigin(translateToOrigin(pieuwer.pos, rotateAroundOrigin(shape, (pieuwer.angle+180) * Math.PI / 180)), enemy.pos), -enemy.angle * (Math.PI / 180)),
              radius: (<Circle>shape).radius
            };
      return [enemy.collisionShapes.map(enemyShape => {
        if (isBox(enemyShape)) {
          return circleCollidesWithBox(
            testCircle,
            <Box>enemyShape
          )
        } else {
          return circleCollidesWithCircle(
              testCircle,
              <Circle>enemyShape,
          );
        }
      }).indexOf(true) > -1]
    }
  });

  const collidingEnemyCorners = enemy.collisionShapes.map(shape => {
    if (isBox(shape)) {
      return rotateBoxAroundOrigin(<Box>shape, (enemy.angle+180) * Math.PI / 180)
        .map(point => translateToOrigin(enemy.pos, point))
        .map(point =>
          pointWithinAreaList(
            rotateAroundOrigin(translateToOrigin(point, pieuwer.pos), -pieuwer.angle * Math.PI / 180), pieuwer.collisionShapes))
    } else {
      const testCircle = {
              ...rotateAroundOrigin(translateToOrigin(translateToOrigin(enemy.pos, rotateAroundOrigin(shape, (enemy.angle+180) * Math.PI / 180)), pieuwer.pos), -pieuwer.angle * (Math.PI / 180)),
              radius: (<Circle>shape).radius
            };
      return [pieuwer.collisionShapes.map(pieuwerShape => {
        if (isBox(pieuwerShape)) {
          return circleCollidesWithBox(
            testCircle,
            <Box>pieuwerShape
          )
        } else {
          return circleCollidesWithCircle(
              testCircle,
              <Circle>pieuwerShape,
          );
        }
      }).indexOf(true) > -1]
    }
  });

  document.getElementById("debug").innerHTML += JSON.stringify(collidingEnemyCorners, null, 2);

  const collides = collidingCorners.concat(collidingEnemyCorners)
    .reduce((a,b) => a.concat(b), []).indexOf(true) > -1
  return {
    collides: collides,
    collidingCorners: collides
      ? collidingCorners.map((corners, shapeIndex) => ({
          shapeIndex: shapeIndex,
          collidingCorners: corners.map((c, idx) => ({collides: c, idx: idx})).filter(({collides, idx}) => collides).map(({idx}) => idx)
        })).filter(({collidingCorners}) => collidingCorners.length > 0)
      : []
  };
};

export const detectPieuwerToEnemyCollisions : (s : GameState) => {pieuwers: Array<string>, enemies: Array<number>}  =
  ({ pieuwerStates : { pieuwerOne, pieuwerTwo }, enemyStates : { enemies } }) => {

    document.getElementById("debug").innerHTML = "";
    const collisions : {[key: string]: Array<{enemyIdx : number, collisions: ShapeCollisions}>} = {
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

    //document.getElementById("debug").innerHTML = JSON.stringify(collisions, null, 2);
/*      results.map((corners, shapeIndex) => ({
        shapeIndex: shapeIndex,
        collidingCorners: corners.map((c, idx) => ({collides: c, idx: idx})).filter(({collides, idx}) => collides).map(({idx}) => idx)
      })).filter(({collidingCorners}) => collidingCorners.length > 0)
    );*/


//      .map(point => translateToOrigin(enemies[0].pos, point))
//      .map(point => pointWithinBox(point, getBoundingBox(enemies[0])));

/*    const newBox1 = rotateBoxAroundOrigin(getBoundingBox(enemies[0]), enemies[0].angle * Math.PI / 180)
      .map(point => translateToOrigin(point, enemies[0].pos));*/


    //document.getElementById("debug").innerHTML = JSON.stringify(collisions);
    //document.getElementById("debug").innerHTML +=  "\n" + JSON.stringify(debug);
    //document.getElementById("debug").innerHTML += "\n" + JSON.stringify(enemies[0].pos);

    return {
      pieuwers: Object.keys(collisions).filter(pieuwerKey => collisions[pieuwerKey].length > 0),
      enemies: collisions.pieuwerOne.map(({enemyIdx}) => enemyIdx).concat(
        collisions.pieuwerTwo.map(({enemyIdx}) => enemyIdx)).filter((val, idx, self) => self.indexOf(val) === idx)
    };
    /// FIRST: do the boxes collide?
    // 1) rotate pieuwer bounding box around origin
    // 2) translate pieuwer bounding box to pieuwer position
    // 3) rotate pieuwer bounding box around enemy origin (to enemy-ang=0)
    // 4) are any points from rotated pieuwerBox within enemy bounding box? (CONCAT WITH NEXT)
    // 5) rotate enemy box to (pieuwerAng=0)
    // 4) are any points from rotated enemy box within pieuwer bounding box? (FILTER)



    // --> TODO when these steps??
    // 1) rotate pieuwer collision shapes around origin
    // 2) translate pieuwer collision shapes to pieuwer position
    // 3) rotate each collision shape around enemy origin --> same as with bullets
    // FIXME! 4) do any pieuwer collision shapes 'overlap with the enemy bounding box? (FILTER)
    // 5) do any pieuwer collision shapes 'overlap with any of the enmey collision shapes? (CONCAT WITH NEXT)
    // 6) rotate each enemy collisionShape around pieuwer origin
    // 7) do any pieuwer collision shapes 'overlap with any of the enmey collision shapes? (FILTER)
    // ') overlap is: ... (any points within box?)
/*
  ctx.fillStyle = "white";
  ctx.strokeStyle = "white";
  collisionShapes.forEach(shape => {
    if (isBox(shape)) {
      const newBox = rotateBoxAroundOrigin(<Box>shape, (angle+180) * Math.PI / 180);
      ctx.beginPath();
      newBox.forEach((p,i) => {
        const tl = translateToOrigin(pos, p);
        if (i === 0) {
          ctx.moveTo(tl.x * scale, tl.y * scale);
        } else {
          ctx.lineTo(tl.x * scale, tl.y * scale);
        }
      });
      ctx.closePath();
      ctx.stroke();
    } else {
      const tl = translateToOrigin(pos, rotateAroundOrigin(shape, (angle+180) * Math.PI / 180));
      ctx.beginPath();
      ctx.arc(tl.x * scale, tl.y * scale, (<Circle>shape).radius * scale, 0, Math.PI*2);
      ctx.stroke();
    }
  });
}
*/

}

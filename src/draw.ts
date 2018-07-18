import { BulletState } from "./store/bullet-reducer";
import { Drawable } from "./resizable-canvas/drawable";
import { PieuwerState, PieuwerKey } from "./store/pieuwer-reducer";
import { EnemyState } from "./store/enemy-reducer";
import { ExplosionState } from "./store/explosion-reducer";
import { isBox, Box, Circle, Point, getBoundingBox } from "./phyz/shapes";
import { PIEUWER_WIDTH, PIEUWER_HEIGHT } from "./store/constants";
import { rotateBoxAroundOrigin, translateToOrigin, rotateAroundOrigin } from "./phyz/shape-ops";
import { CollisionList } from "./phyz/collisions";
import { EnemyType } from "./enemies/types";
import { ENEMY_BOUNDS } from "./enemies/enemy-bounding-boxes";
import { enemySprites } from "./enemies/enemy-sprites";


const pieuwerOnePng = new Image();
pieuwerOnePng.src = "./img/pieuwerOne.png";
const pieuwerTwoPng = new Image();
pieuwerTwoPng.src = "./img/pieuwerTwo.png";


const pieuwerPngs : {[key : string] : HTMLImageElement} = {
  pieuwerOne: pieuwerOnePng,
  pieuwerTwo: pieuwerTwoPng
};

export function preload(callback : () => void) {
  if (pieuwerOnePng.complete && enemySprites[EnemyType.SKULL].complete && enemySprites[EnemyType.ENEMY_TWO].complete) {
    callback();
  } else {
    setTimeout(() => preload(callback), 1);
  }
}


const drawCollisionShapes = (ctx: CanvasRenderingContext2D, scale: number, collisionShapes : Array<Circle|Box>) => {
  ctx.strokeStyle = "white"
  collisionShapes.forEach(shape => {
    if (isBox(shape)) {
      ctx.strokeRect(shape.x * scale, shape.y * scale, (<Box>shape).w * scale, (<Box>shape).h * scale);
    } else {
      ctx.beginPath();
      ctx.arc(shape.x * scale, shape.y * scale, (<Circle>shape).radius * scale, 0, Math.PI*2);
      ctx.stroke();
    }
  });
}

const drawThing = <T extends PieuwerState>(thing : T, img : HTMLImageElement, imgDims : Point) : Drawable =>
  (ctx: CanvasRenderingContext2D, scale: number) => {
    ctx.save();
    ctx.translate(thing.pos.x * scale, thing.pos.y * scale);
    ctx.rotate(thing.angle * Math.PI / 180);
    ctx.drawImage(img, 0, 0,
      imgDims.x, imgDims.y,
      -(thing.size.x / 2)*scale, -(thing.size.y / 2)*scale,
      thing.size.x * scale, thing.size.y * scale);
    //drawCollisionShapes(ctx, scale, thing.collisionShapes);    
    ctx.restore();
  };

export const drawPieuwer = (pieuwerKey : PieuwerKey, ps : PieuwerState) : Drawable =>
    drawThing(ps, pieuwerPngs[pieuwerKey], ps.size);

export const drawEnemy = (enemy : EnemyState) : Drawable =>
    drawThing(enemy, enemySprites[enemy.enemyType], ENEMY_BOUNDS[enemy.enemyType]);


export const drawCollisions = <T extends PieuwerState>(thing : T, collisions: Array<CollisionList>) : Drawable =>
  (ctx: CanvasRenderingContext2D, scale: number) => {
    ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
    collisions.forEach((collisionList) => {
      collisionList.forEach(({shapeIndex, collidingCorners}) => {
        const shape = thing.collisionShapes[shapeIndex];
        if (isBox(shape)) {
          const points = rotateBoxAroundOrigin(<Box>shape, (thing.angle+180) * Math.PI / 180);
          collidingCorners.forEach(pointIndex => {
            const tl = translateToOrigin(thing.pos, points[pointIndex]);
            ctx.beginPath();
            ctx.arc(
              tl.x * scale,
              tl.y * scale,
              Math.random() * 20 * scale, 0, Math.PI*2);
            ctx.fill();
          })
        } else {
          const tl = translateToOrigin(thing.pos, rotateAroundOrigin(shape, (thing.angle+180) * Math.PI / 180));
          ctx.beginPath();
          ctx.arc(
            (tl.x + (<Circle> shape).radius * Math.random() * 2 - (<Circle> shape).radius) * scale,
            (tl.y + (<Circle> shape).radius * Math.random() * 2 - (<Circle> shape).radius) * scale,
            Math.random() * 20 * scale, 0, Math.PI*2
          );
          ctx.fill();
        }
      })
    })
  }

export const drawBullet = (bs : BulletState) : Drawable =>
  (ctx: CanvasRenderingContext2D, scale: number) => {
      ctx.beginPath();
      ctx.fillStyle = `rgb(255,255,255)`;
      ctx.arc(
        bs.pos.x * scale,
        bs.pos.y * scale,
        3 * scale, 0, Math.PI*2
      );
      ctx.fill();
    };



export const drawExplosion = (explosion : ExplosionState) =>
  (ctx: CanvasRenderingContext2D, scale: number) => {
    ctx.beginPath();
    ctx.fillStyle = `rgba(255,255,255, ${0.5 + ((explosion.size / explosion.initSize) * 0.5)})`;
    ctx.arc(
      explosion.pos.x * scale,
      explosion.pos.y * scale,
      5 * scale * (explosion.initSize - explosion.size), 0, Math.PI*2
    );
    ctx.fill();
  };

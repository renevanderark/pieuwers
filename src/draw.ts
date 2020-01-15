import { BulletState } from "./store/bullet-reducer";
import { Drawable } from "./resizable-canvas/drawable";
import { PieuwerState, PieuwerKey } from "./store/pieuwer-reducer";
import { EnemyState } from "./store/enemy-reducer";
import { ExplosionState } from "./store/explosion-reducer";
import { isBox, Box, Circle, Point } from "./phyz/shapes";
import { VIRT_HEIGHT } from "./store/constants";
import { rotateBoxAroundOrigin, translateToOrigin, rotateAroundOrigin } from "./phyz/shape-ops";
import { CollisionList } from "./phyz/collisions";
import { EnemyType } from "./enemies/types";
import { ENEMY_BOUNDS } from "./enemies/enemy-bounding-boxes";
import { enemySprites } from "./enemies/enemy-sprites";
import { Thing, FireType } from "./store/thing";


const pieuwerOnePng = new Image();
pieuwerOnePng.src = "./img/pieuwerOne.png";
const pieuwerTwoPng = new Image();
pieuwerTwoPng.src = "./img/pieuwerTwo.png";


const pieuwerPngs : {[key : string] : HTMLImageElement} = {
  pieuwerOne: pieuwerOnePng,
  pieuwerTwo: pieuwerTwoPng
};

export function preload(callback : () => void) {
  if (pieuwerOnePng.complete && 
    Object.keys(enemySprites).map(key => enemySprites[key].complete).indexOf(false) < 0) {
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

const imgCache : {[key : string]: HTMLCanvasElement}= {};

const getImage = (img : HTMLImageElement, imgDims: Point, targetRect: Point) : HTMLCanvasElement => {
  const imgKey = `${img.src}-${targetRect.x}-${targetRect.y}`;
  if (!(imgKey in imgCache)) {
    imgCache[imgKey] = document.createElement("canvas");
    imgCache[imgKey].width = targetRect.x;
    imgCache[imgKey].height = targetRect.y;
    imgCache[imgKey].getContext('2d').drawImage(
      img, 0, 0, imgDims.x, imgDims.y,
      0, 0, targetRect.x, targetRect.y
    );
  }
  return imgCache[imgKey];
}

const drawThing = <T extends Thing>(thing : T, img : HTMLImageElement, imgDims : Point) : Drawable =>
  (ctx: CanvasRenderingContext2D, scale: number) => {
    const isEnemy = "enemyType" in thing;
    ctx.save();
    ctx.translate(Math.floor(thing.pos.x * scale), Math.floor(thing.pos.y * scale));
    const health = thing.health / thing.maxHealth;
    const healthBarWidth = isEnemy ? thing.size.x * scale : thing.size.x * scale * 0.25;

    ctx.fillStyle = "rgba(255,0,0,0.8)";
    ctx.fillRect(-(thing.size.x / 2)*scale, -((thing.size.y / 2) + 15) * scale, healthBarWidth, 5 * scale);

    ctx.fillStyle = "rgb(96,255,96)";
    ctx.fillRect(-(thing.size.x / 2)*scale, -((thing.size.y / 2) + 15) * scale, healthBarWidth * health, 5 * scale);

    ctx.rotate(thing.angle * Math.PI / 180);
    ctx.drawImage(getImage(img, imgDims, {x:Math.ceil(thing.size.x * scale) ,y: Math.ceil(thing.size.y * scale)}),
      Math.floor(-(thing.size.x / 2)*scale),
      Math.floor(-(thing.size.y / 2)*scale));
      // drawCollisionShapes(ctx, scale, thing.collisionShapes);
    ctx.restore();
    if (isEnemy && thing.fireType === FireType.LASER) {

      ctx.fillStyle = "rgba(255,255,0,0.8)";
      if (thing.shooting) {
        ctx.fillRect(
          Math.floor((thing.pos.x - Math.random() * 4) * scale),
          Math.floor((thing.pos.y + thing.size.y / 2) * scale),
          Math.ceil(Math.random() * 4 * scale),
          Math.ceil((VIRT_HEIGHT - (thing.pos.y + thing.size.y / 2))  * scale)
        );
      } else {
        ctx.beginPath();
        ctx.arc(
          Math.floor((thing.pos.x - Math.random() * 4) * scale),
          Math.floor((thing.pos.y + thing.size.y / 2) * scale),
          Math.random() * (400-thing.shootTimer) / 4 * scale, 0, Math.PI*2);
        ctx.fill();
      }
    }
  };

export const drawPieuwer = (pieuwerKey : PieuwerKey, ps : PieuwerState) : Drawable =>
    drawThing(ps, pieuwerPngs[pieuwerKey], ps.size);

export const drawEnemy = (enemy : EnemyState) : Drawable =>
    drawThing(enemy, enemySprites[enemy.enemyType], ENEMY_BOUNDS[enemy.enemyType]);


export const drawCollisions = (thing : Thing, collisions: Array<CollisionList>) : Drawable =>
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
        Math.floor(bs.pos.x * scale),
        Math.floor(bs.pos.y * scale),
        Math.ceil(3 * scale), 0, Math.PI*2
      );
      ctx.fill();
    };

export const drawExplosion = (explosion : ExplosionState) =>
  (ctx: CanvasRenderingContext2D, scale: number) => {
    ctx.beginPath();
    ctx.fillStyle = `rgba(255,255,255, ${0.5 + ((explosion.size / explosion.initSize) * 0.5)})`;
    ctx.arc(
      Math.floor(explosion.pos.x * scale),
      Math.floor(explosion.pos.y * scale),
      Math.ceil(5 * scale * (explosion.initSize - explosion.size)),
      0, Math.PI*2
    );
    ctx.fill();
  };

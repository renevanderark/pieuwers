import { BulletState } from "./store/bullet-reducer";
import { Drawable } from "./resizable-canvas/drawable";
import { PieuwerState, PieuwerKey } from "./store/pieuwer-reducer";
import { EnemyState } from "./store/enemy-reducer";
import { ExplosionState } from "./store/explosion-reducer";
import { isBox, Box, Circle, Point, getBoundingBox } from "./phyz/shapes";
import { ENEMY_WIDTH, ENEMY_HEIGHT, PIEUWER_WIDTH, PIEUWER_HEIGHT } from "./store/constants";
import { rotateBoxAroundOrigin, translateToOrigin, rotateAroundOrigin } from "./phyz/shape-ops";


const pieuwerOnePng = new Image();
pieuwerOnePng.src = "./img/pieuwerOne.png";
const pieuwerTwoPng = new Image();
pieuwerTwoPng.src = "./img/pieuwerTwo.png";
const enemyPng = new Image();
enemyPng.src = "./img/enemy.png";

const pieuwerPngs : {[key : string] : HTMLImageElement} = {
  pieuwerOne: pieuwerOnePng,
  pieuwerTwo: pieuwerTwoPng
};

export function preload(callback : () => void) {
  if (pieuwerOnePng.complete && pieuwerTwoPng.complete && enemyPng.complete) {
    callback();
  } else {
    setTimeout(() => preload(callback), 1);
  }
}

const drawBox = (shape : Box, ctx: CanvasRenderingContext2D, scale: number, pos : Point, angle : number, strokeStyle = "white") => {
  const newBox = rotateBoxAroundOrigin(shape, (angle+180) * Math.PI / 180);
  ctx.strokeStyle = strokeStyle;
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
}

const drawCollisionShapes = (ctx: CanvasRenderingContext2D, scale: number, collisionShapes : Array<Circle|Box>, pos : Point, angle : number) => {
  collisionShapes.forEach(shape => {
    if (isBox(shape)) {
      drawBox(<Box>shape, ctx, scale, pos, angle);
    } else {
      const tl = translateToOrigin(pos, rotateAroundOrigin(shape, (angle+180) * Math.PI / 180));
      ctx.beginPath();
      ctx.arc(tl.x * scale, tl.y * scale, (<Circle>shape).radius * scale, 0, Math.PI*2);
      ctx.stroke();
    }
  });
}

export const drawPieuwer = (pieuwerKey : PieuwerKey, ps : PieuwerState) : Drawable =>
  (ctx: CanvasRenderingContext2D, scale: number) => {
    ctx.save();
    ctx.translate(ps.pos.x * scale, ps.pos.y * scale);
    ctx.rotate(ps.angle * Math.PI / 180);
    ctx.drawImage(pieuwerPngs[pieuwerKey], 0, 0,
      ps.size.x, ps.size.y,
      -(ps.size.x / 2)*scale, -(ps.size.y / 2)*scale,
      ps.size.x * scale, ps.size.y * scale);
    ctx.restore();
    drawCollisionShapes(ctx, scale, ps.collisionShapes, ps.pos, ps.angle);
    drawBox(getBoundingBox(ps), ctx, scale, ps.pos, ps.angle, ps.collided ? "red" : "rgb(128,128,255)");
  };

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

export const drawEnemy = (enemy : EnemyState) : Drawable =>
  (ctx: CanvasRenderingContext2D, scale: number) => {
    ctx.save();
    ctx.translate(enemy.pos.x * scale, enemy.pos.y * scale);
    ctx.rotate(enemy.angle * Math.PI / 180);
    //ctx.globalAlpha = (enemy.health / enemy.maxHealth) * 0.5 + 0.5;
    ctx.strokeStyle = "white";
    ctx.drawImage(enemyPng,0,0, ENEMY_WIDTH, ENEMY_HEIGHT,
      -(enemy.size.x / 2) * scale,
      -(enemy.size.y / 2) * scale,
      enemy.size.x * scale,
      enemy.size.y * scale);
    ctx.restore();
    drawCollisionShapes(ctx, scale, enemy.collisionShapes, enemy.pos, enemy.angle);
    drawBox(getBoundingBox(enemy), ctx, scale, enemy.pos, enemy.angle, enemy.collided ? "red" : "rgb(128,128,255)");
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

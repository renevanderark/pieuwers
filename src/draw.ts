import { BulletState } from "./store/bullet-reducer";
import { Drawable } from "./resizable-canvas/drawable";
import { PieuwerState, PieuwerKey } from "./store/pieuwer-reducer";
import { EnemyState } from "./store/enemy-reducer";
import { ExplosionState } from "./store/explosion-reducer";
import { isBox, Box, Circle } from "./phyz/shapes";
import { ENEMY_WIDTH, ENEMY_HEIGHT } from "./store/constants";


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

export const drawPieuwer = (pieuwerKey : PieuwerKey, ps : PieuwerState) : Drawable =>
  (ctx: CanvasRenderingContext2D, scale: number) => {
    ctx.save();
    ctx.translate(ps.pos.x * scale, ps.pos.y * scale);
    ctx.rotate(ps.angle * Math.PI / 180);
    ctx.drawImage(pieuwerPngs[pieuwerKey], 0, 0, 240, 240, -120*scale, -120*scale, 240*scale, 240*scale);
    ctx.restore();
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
    ctx.globalAlpha = (enemy.health / enemy.maxHealth) * 0.5 + 0.5;
    ctx.strokeStyle = "white";
    ctx.drawImage(enemyPng,0,0, ENEMY_WIDTH, ENEMY_HEIGHT,
      -(enemy.size.x / 2) * scale,
      -(enemy.size.y / 2) * scale,
      enemy.size.x * scale,
      enemy.size.y * scale);
    /*DEBUG
    enemy.collisionShapes.forEach(shape => {
      if (isBox(shape)) {
        ctx.strokeRect(
          shape.x * scale,
          shape.y * scale,
          (<Box>shape).w * scale,
          (<Box>shape).h * scale,
        );
      } else {
        ctx.beginPath();
        ctx.arc(
          shape.x * scale,
          shape.y * scale,
          (<Circle>shape).radius * scale,
          0, Math.PI*2
        );
        ctx.stroke();
        ctx.closePath();
      }
    });*/
    ctx.globalAlpha = 1;
    ctx.restore();
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

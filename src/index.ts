import { createStore, combineReducers  } from 'redux';
import reducers, { GameState } from './store/reducers';
import { keyActionCreator, bulletActionCreator, enemyActionCreator, explosionActionCreator } from './actions/action-creators';
import { ActionTypes } from './actions/action-types';

import getFrameRenderer from "./resizable-canvas/frame-renderer";
import getResizeListeners from "./resizable-canvas/resize-listeners";
import initViewPort from "./resizable-canvas/viewport";
import getEventListeners from './resizable-canvas/event-listeners';
import { VIRT_HEIGHT, VIRT_WIDTH } from './store/constants';
import { PieuwerState } from './store/pieuwer-reducer';
import { Drawable } from './resizable-canvas/drawable';
import { initPadEvents } from "padevents";
import { COLLISION_GRID_SIZE, EnemyState } from './store/enemy-reducer';
import { BulletState } from './store/bullet-reducer';
import { Point } from './phyz/shapes';
import { ExplosionState } from './store/explosion-reducer';

const store = createStore(combineReducers(reducers));

const {  onKeyUp, onKeyDown, onGamePadButtonUp, onGamePadButtonDown } = keyActionCreator(store.dispatch);
const { spawnBullet } = bulletActionCreator(store.dispatch);
const { spawnEnemy, enemiesReceiveBullet } = enemyActionCreator(store.dispatch);
const { spawnExplosion } = explosionActionCreator(store.dispatch);

const pieuwerLayer = document.getElementById("pieuwer-layer");
const pieuwerTwoLayer = document.getElementById("pieuwer2-layer");
const bulletLayer = document.getElementById("bullet-layer");
if (!(pieuwerLayer instanceof HTMLCanvasElement)) { throw new TypeError("wrong element type"); }
if (!(pieuwerTwoLayer instanceof HTMLCanvasElement)) { throw new TypeError("wrong element type"); }
if (!(bulletLayer instanceof HTMLCanvasElement)) { throw new TypeError("wrong element type"); }

const pieuwerLayerCtx = pieuwerLayer.getContext("2d");
const pieuwerTwoLayerCtx = pieuwerTwoLayer.getContext("2d");
const bulletLayerCtx = bulletLayer.getContext("2d");


const pieuwerOneFrameRenderer = getFrameRenderer(pieuwerLayerCtx, pieuwerLayer);
const pieuwerTwoFrameRenderer = getFrameRenderer(pieuwerTwoLayerCtx, pieuwerTwoLayer);
const bulletFrameRenderer = getFrameRenderer(bulletLayerCtx, bulletLayer);

const eventListeners = getEventListeners();

let gamePadToPlayerMap : {[key : string] : "pieuwerOne"|"pieuwerTwo"} = {};

initPadEvents({
  onUnmappedButton : () => { },
  onControllersChange: (controllerIds : Array<string>) => {
    if (controllerIds.length > 0 && typeof gamePadToPlayerMap[controllerIds[0]] === 'undefined') {
      gamePadToPlayerMap[controllerIds[0]] = "pieuwerOne";
    }
    if (controllerIds.length > 1 && typeof gamePadToPlayerMap[controllerIds[1]] === 'undefined') {
      gamePadToPlayerMap[controllerIds[1]] = "pieuwerTwo";
    }
  }
});

initViewPort(VIRT_WIDTH, VIRT_HEIGHT, getResizeListeners([pieuwerLayer, pieuwerTwoLayer, bulletLayer],
  eventListeners.onResize,
  pieuwerOneFrameRenderer.onResize,
  pieuwerTwoFrameRenderer.onResize,
  bulletFrameRenderer.onResize
));

eventListeners.add("keydown", (ev : KeyboardEvent) => { onKeyDown(ev.key); });
eventListeners.add("keyup", (ev : KeyboardEvent) => { onKeyUp(ev.key); });

['a', 'b', 'x', 'y'].forEach(k => {
  eventListeners.add(`gamepad-${k}-pressed`, (ev : CustomEvent) => onGamePadButtonDown("a", gamePadToPlayerMap[ev.detail.controllerIndex]));
  eventListeners.add(`gamepad-${k}-released`, (ev : CustomEvent) => onGamePadButtonUp("a", gamePadToPlayerMap[ev.detail.controllerIndex]));
});

['up', 'left', 'right', 'down'].forEach(k => {
  eventListeners.add(`gamepad-${k}-pressed`, (ev : CustomEvent) => onGamePadButtonDown(k, gamePadToPlayerMap[ev.detail.controllerIndex]));
  eventListeners.add(`gamepad-${k}-released`, (ev : CustomEvent) => onGamePadButtonUp(k, gamePadToPlayerMap[ev.detail.controllerIndex]));
});

const debug = document.getElementById("debug");
let updateTime = 0;

const pieuwerOnePng = new Image();
pieuwerOnePng.src = "./img/pieuwerOne.png";
const pieuwerTwoPng = new Image();
pieuwerTwoPng.src = "./img/pieuwerTwo.png";
const enemyPng = new Image();
enemyPng.src = "./img/enemy.png";

const handleBulletEnemyCollision = (params : {bulletIdx : number, enemies: Array<number>, collsionPos : Point}) => {
  enemiesReceiveBullet(params);
  spawnExplosion(params.collsionPos, 5)
}

const drawPieuwer = (img : HTMLImageElement, ps : PieuwerState) : Drawable =>
  (ctx: CanvasRenderingContext2D, scale: number) => {
    ctx.save();
    ctx.translate(ps.xPos * scale, ps.yPos * scale);
    ctx.rotate(ps.angle * Math.PI / 180);
    ctx.drawImage(img, 0, 0, 240, 240, -120*scale, -120*scale, 240*scale, 240*scale);
    ctx.restore();
  };

const drawBullet = (bs : BulletState) : Drawable =>
  (ctx: CanvasRenderingContext2D, scale: number) => {
      ctx.beginPath();
      ctx.fillStyle = `rgb(255,255,255)`;
      ctx.arc(
        bs.xPos * scale,
        bs.yPos * scale,
        5 * scale, 0, Math.PI*2
      );
      ctx.fill();
    };

const drawEnemy = (enemy : EnemyState) : Drawable =>
  (ctx: CanvasRenderingContext2D, scale: number) => {
    ctx.beginPath();
    ctx.globalAlpha = (enemy.health / enemy.maxHealth) * 0.5 + 0.5;
    ctx.drawImage(enemyPng,0,0, 100, 160,
      (enemy.xPos - enemy.collisionRadius) * scale,
      (enemy.yPos - enemy.collisionRadius) * scale,
      100 * (enemy.collisionRadius / 50) * scale,
      160 * (enemy.collisionRadius / 50) * scale);

    ctx.globalAlpha = 1;
  };

const drawExplosion = (explosion : ExplosionState) =>
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

const game = () => {
  const renderLoop = () => {
    const { pieuwerStates, bulletStates, enemyStates, explosionStates } : GameState = store.getState();
  //  debug.innerHTML = `${updateTime}\n${JSON.stringify(store.getState().enemyStates.collisionGrid, null, 2)}`;

    bulletFrameRenderer.clear();
    bulletFrameRenderer.render([
        drawPieuwer(pieuwerOnePng, pieuwerStates.pieuwerOne),
        drawPieuwer(pieuwerTwoPng, pieuwerStates.pieuwerTwo),
      ].concat(
      bulletStates.bullets.map(drawBullet)).concat(
      enemyStates.enemies.map(drawEnemy)).concat(
      explosionStates.explosions.map(drawExplosion)
    ));
  	requestAnimationFrame(renderLoop);
  };

  for (let i = 0; i < 16; i++) {
    spawnEnemy(i * 100, 150);
    spawnEnemy(i * 100 + 50, 250);
  }
  spawnEnemy(500, 200, 50, 100);

  const bulletToCollisionKey = (bullet : BulletState) : string =>
    `${Math.floor(bullet.xPos / COLLISION_GRID_SIZE) * COLLISION_GRID_SIZE}-${Math.floor(bullet.yPos / COLLISION_GRID_SIZE) *  COLLISION_GRID_SIZE}`;

  const enemyCollidesWithBullet = (bullet : BulletState, enemy: EnemyState) : boolean =>
    Math.sqrt(Math.pow(bullet.xPos - enemy.xPos, 2) + Math.pow(bullet.yPos - enemy.yPos, 2)) < enemy.collisionRadius;

  const updateLoop = () => {
    const { bulletStates : { bullets }, enemyStates : { collisionGrid, enemies } } : GameState = store.getState();
    bullets
      .map((bullet, bulletIdx) => ({
        enemies: (collisionGrid[bulletToCollisionKey(bullet)]||[])
          .filter((enemyIdx) => enemyCollidesWithBullet(bullet, enemies[enemyIdx])),
        bulletIdx: bulletIdx,
        collsionPos: { x: bullet.xPos, y: bullet.yPos }
      }))
      .filter(({enemies, bulletIdx}) => enemies.length > 0)
      .forEach(handleBulletEnemyCollision)

    store.dispatch({type: ActionTypes.UPDATE});
  }

  window.setInterval(updateLoop, 10);
  window.setInterval(() => {
    const { pieuwerOne, pieuwerTwo } = store.getState().pieuwerStates;
    spawnBullet(pieuwerOne);
    spawnBullet(pieuwerTwo);
  }, 50);

  renderLoop();
};

function preload() {
  if (pieuwerOnePng.complete && pieuwerTwoPng.complete && enemyPng.complete) {
    game();
  } else {
    setTimeout(preload, 1);
  }
}
preload();

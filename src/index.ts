import { createStore, combineReducers  } from 'redux';
import reducers, { GameState } from './store/reducers';
import { keyActionCreator, bulletActionCreator, enemyActionCreator } from './actions/action-creators';
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

const store = createStore(combineReducers(reducers));

const {  onKeyUp, onKeyDown, onGamePadButtonUp, onGamePadButtonDown } = keyActionCreator(store.dispatch);
const { spawnBullet } = bulletActionCreator(store.dispatch);
const { spawnEnemy, enemiesReceiveBullet } = enemyActionCreator(store.dispatch);

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


class Pieuwer implements Drawable {
  state: PieuwerState
  stateChanged: boolean
  clearX: number
  clearY: number
  img: HTMLImageElement

  constructor(state : PieuwerState, img : HTMLImageElement) {
    this.state = state;
    this.stateChanged = true;
    this.clearX = state.xPos;
    this.clearY = state.yPos;
    this.img = img;
  }
  updateState(newState : PieuwerState) {
    this.stateChanged =
      this.state.yPos !== newState.yPos ||
      this.state.xPos !== newState.xPos ||
      this.state.angle !== newState.angle;
    this.state = newState;
  }
  draw(ctx: CanvasRenderingContext2D, scale: number) {
    ctx.save();
    ctx.translate(this.state.xPos * scale, this.state.yPos * scale);
    ctx.rotate(this.state.angle * Math.PI / 180);
    ctx.drawImage(this.img,0,0, 240, 240, -120*scale, -120*scale, 240*scale,240*scale );0
    ctx.restore();


    this.stateChanged = false;
    this.clearX = this.state.xPos;
    this.clearY = this.state.yPos;
  }
  clear(ctx: CanvasRenderingContext2D, scale: number) {
    ctx.clearRect(
			(this.clearX - 150) * scale,
			(this.clearY - 150) * scale,
			300 * scale, 300 * scale
		);
  }
  updated() { return this.stateChanged; }
}

const game = () => {
  const pieuwerOne = new Pieuwer(store.getState().pieuwerStates.pieuwerOne, pieuwerOnePng);
  const pieuwerTwo = new Pieuwer(store.getState().pieuwerStates.pieuwerTwo, pieuwerTwoPng);
  pieuwerOneFrameRenderer.render([pieuwerOne]);
  pieuwerTwoFrameRenderer.render([pieuwerTwo]);

  const renderLoop = () => {
    const { pieuwerStates, bulletStates, enemyStates } : GameState = store.getState();

    pieuwerOne.updateState(pieuwerStates.pieuwerOne);
    pieuwerTwo.updateState(pieuwerStates.pieuwerTwo);
  //  debug.innerHTML = `${updateTime}\n${JSON.stringify(store.getState().enemyStates.collisionGrid, null, 2)}`;

    bulletFrameRenderer.clear();

    pieuwerOneFrameRenderer.render([pieuwerOne]);
    pieuwerTwoFrameRenderer.render([pieuwerTwo]);
    bulletFrameRenderer.render(bulletStates.bullets.map((bs) => ({
      updated: () => true,
      clear: () => {},
      draw: (ctx: CanvasRenderingContext2D, scale: number) => {
        ctx.beginPath();
        ctx.fillStyle = `rgba(255,255,255,${bs.explosion < 0 ? 1 : bs.explosion / 10})`;
        ctx.arc(
          bs.xPos * scale,
          bs.yPos * scale,
          5 * scale * (bs.explosion < 0 ? 1 : (8 - bs.explosion) * 2), 0, Math.PI*2
        );
        ctx.fill();
      }
    })).concat(enemyStates.enemies.map((enemy) => ({
      updated: () => true,
      clear: () => {},
      draw: (ctx: CanvasRenderingContext2D, scale: number) => {
        ctx.beginPath();
        ctx.fillStyle = `rgba(255,0,0,${enemy.health / enemy.maxHealth})`;
        ctx.arc(
          enemy.xPos * scale,
          enemy.yPos * scale,
          enemy.collisionRadius * scale, 0, Math.PI*2
        );
        ctx.fill();
      }
    }))));
  	requestAnimationFrame(renderLoop);
  };

  for (let i = 0; i < 16; i++) {
    spawnEnemy(i * 100, 150);
    spawnEnemy(i * 100 + 50, 250);
  }
  spawnEnemy(500, 500, 50, 150);

  const bulletToCollisionKey = (bullet : BulletState) : string =>
    `${Math.floor(bullet.xPos / COLLISION_GRID_SIZE) * COLLISION_GRID_SIZE}-${Math.floor(bullet.yPos / COLLISION_GRID_SIZE) *  COLLISION_GRID_SIZE}`;

  const enemyCollidesWithBullet = (bullet : BulletState, enemy: EnemyState) : boolean =>
    Math.sqrt(Math.pow(bullet.xPos - enemy.xPos, 2) + Math.pow(bullet.yPos - enemy.yPos, 2)) < enemy.collisionRadius;

  const updateLoop = () => {
    const { bulletStates : { bullets }, enemyStates : { collisionGrid, enemies } } : GameState = store.getState();
    let collisions = bullets
      .map((bullet, bulletIdx) => ({
        enemies: collisionGrid[bulletToCollisionKey(bullet)].filter((enemyIdx) => enemyCollidesWithBullet(bullet, enemies[enemyIdx])),
        bulletIdx: bulletIdx
      }))
      .filter(({enemies, bulletIdx}) => bullets[bulletIdx].explosion < 0)
      .forEach(enemiesReceiveBullet)

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
  if (pieuwerOnePng.complete && pieuwerTwoPng.complete) {
    game();
  } else {
    setTimeout(preload, 1);
  }
}
preload();

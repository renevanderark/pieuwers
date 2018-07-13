import { createStore, combineReducers  } from 'redux';
import { initPadEvents } from "padevents";

import getFrameRenderer from "./resizable-canvas/frame-renderer";
import getResizeListeners from "./resizable-canvas/resize-listeners";
import initViewPort from "./resizable-canvas/viewport";
import getEventListeners from './resizable-canvas/event-listeners';
import { preload, drawPieuwer, drawBullet, drawEnemy, drawExplosion } from './draw';

import reducers from './store/reducers';
import { VIRT_HEIGHT, VIRT_WIDTH } from './store/constants';

import { keyActionCreator, bulletActionCreator, enemyActionCreator, explosionActionCreator } from './actions/action-creators';
import { ActionTypes } from './actions/action-types';

import { Point } from './phyz/shapes';
import { detectBulletToEnemyCollisions } from './phyz/collisions';

const store = createStore(combineReducers(reducers));

const { onKeyUp, onKeyDown, onGamePadButtonUp, onGamePadButtonDown } = keyActionCreator(store.dispatch);
const { spawnBullet } = bulletActionCreator(store.dispatch);
const { spawnEnemy, enemiesReceiveBullet } = enemyActionCreator(store.dispatch);
const { spawnExplosion } = explosionActionCreator(store.dispatch);

const mainLayer = document.getElementById("main-layer");
if (!(mainLayer instanceof HTMLCanvasElement)) { throw new TypeError("wrong element type"); }
const mainLayerCtx = mainLayer.getContext("2d");
const mainFrameRenderer = getFrameRenderer(mainLayerCtx, mainLayer);


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

const eventListeners = getEventListeners();
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

initViewPort(VIRT_WIDTH, VIRT_HEIGHT, getResizeListeners([mainLayer],
  eventListeners.onResize,
  mainFrameRenderer.onResize
));

const debug = document.getElementById("debug");

const handleBulletEnemyCollision = (params : {bulletIdx : number, enemies: Array<number>, collsionPos : Point}) => {
  enemiesReceiveBullet(params);
  spawnExplosion(params.collsionPos, 5)
}

const game = () => {
  const renderLoop = () => {
    const { pieuwerStates, bulletStates, enemyStates, explosionStates } = store.getState();
  //  debug.innerHTML = JSON.stringify(store.getState().enemyStates.collisionGrid, null, 2);

    mainFrameRenderer.clear();
    mainFrameRenderer.render([
        drawPieuwer("pieuwerOne", pieuwerStates.pieuwerOne),
        drawPieuwer("pieuwerTwo", pieuwerStates.pieuwerTwo),
      ].concat(
      bulletStates.bullets.map(drawBullet)).concat(
      enemyStates.enemies.map(drawEnemy)).concat(
      explosionStates.explosions.map(drawExplosion)
    ));
  	requestAnimationFrame(renderLoop);
  };


  for (let i = 0; i < 16; i++) {
    spawnEnemy(i * 100, 150, {x: 60, y: 80});
    spawnEnemy(i * 100 + 50, 250, {x: 60, y: 80});
  }
  spawnEnemy(200, 200, {x: 200, y: 320}, 100);
  spawnEnemy(600, 200, {x: 200, y: 320}, 100);
  spawnEnemy(1000, 200, {x: 200, y: 320}, 100);

  const updateLoop = () => {
    detectBulletToEnemyCollisions(store.getState())
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

preload(game);

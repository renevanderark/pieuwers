import { createStore, combineReducers  } from 'redux';
import { initPadEvents } from "./padevents";

import getFrameRenderer from "./resizable-canvas/frame-renderer";
import getResizeListeners from "./resizable-canvas/resize-listeners";
import initViewPort from "./resizable-canvas/viewport";
import getEventListeners from './resizable-canvas/event-listeners';
import { preload, drawPieuwer, drawBullet, drawEnemy, drawExplosion, drawCollisions } from './draw';

import reducers from './store/reducers';
import { VIRT_HEIGHT, VIRT_WIDTH } from './store/constants';

import { keyActionCreator, bulletActionCreator, enemyActionCreator, explosionActionCreator } from './actions/action-creators';
import { ActionTypes } from './actions/action-types';

import { Point } from './phyz/shapes';
import { detectBulletToEnemyCollisions, detectPieuwerToEnemyCollisions, PieuwerToEnemyCollisions } from './phyz/collisions';
import { PieuwerKey } from './store/pieuwer-reducer';
import { EnemyType } from './store/enemy-reducer';

const store = createStore(combineReducers(reducers));

const { onKeyUp, onKeyDown, onGamePadButtonUp, onGamePadButtonDown } = keyActionCreator(store.dispatch);
const { spawnBullet } = bulletActionCreator(store.dispatch);
const { spawnEnemy, enemiesReceiveBullet } = enemyActionCreator(store.dispatch);
const { spawnExplosion } = explosionActionCreator(store.dispatch);

const mainLayer = document.getElementById("main-layer");
if (!(mainLayer instanceof HTMLCanvasElement)) { throw new TypeError("wrong element type"); }
const mainLayerCtx = mainLayer.getContext("2d");
const mainFrameRenderer = getFrameRenderer(mainLayerCtx, mainLayer);

const debug = document.getElementById("debug");

let gamePadToPlayerMap : {[key : string] : "pieuwerOne"|"pieuwerTwo"} = {
  "0": "pieuwerOne", "1": "pieuwerTwo"
};
initPadEvents();

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

['r', 'l'].forEach(k => {
  eventListeners.add(`gamepad-${k}-axis-x-change`, (ev : CustomEvent) =>  {
    store.dispatch({type: ActionTypes.AXIS_X_CHANGE,
      player: gamePadToPlayerMap[ev.detail.controllerIndex],
      axisForce: Math.round(ev.detail.rounded * 0.01)
    });
  });
});

['r', 'l'].forEach(k => {
  eventListeners.add(`gamepad-${k}-axis-y-change`, (ev : CustomEvent) =>  {
    store.dispatch({type: ActionTypes.AXIS_Y_CHANGE,
      player: gamePadToPlayerMap[ev.detail.controllerIndex],
      axisForce: -Math.round(ev.detail.rounded * 0.01)
    });
  });
});

initViewPort(VIRT_WIDTH, VIRT_HEIGHT, getResizeListeners([mainLayer],
  eventListeners.onResize,
  mainFrameRenderer.onResize
));



const handleBulletEnemyCollision = (params : {bulletIdx : number, enemies: Array<number>, collsionPos : Point}) => {
  enemiesReceiveBullet(params);
  spawnExplosion(params.collsionPos, 5)
}

const handlePieuwerToEnemyCollisions = (collisions : PieuwerToEnemyCollisions) => {
  Object.keys(collisions).filter(pieuwerKey => collisions[pieuwerKey].length > 0)
    .forEach(pieuwerKey => store.dispatch({type: ActionTypes.PIEUWER_COLLIDES, player: pieuwerKey}));

  Object.keys(collisions).filter(pieuwerKey => collisions[pieuwerKey].length > 0)
    .map(pk => collisions[pk]).reduce((a,b) => a.concat(b), [])
    .forEach(({enemyIdx}) => store.dispatch({type: ActionTypes.ENEMY_COLLIDES_WITH_PIEUWER, enemyIdx: enemyIdx}));

  if (Object.keys(collisions).filter(pieuwerKey => collisions[pieuwerKey].length > 0).length > 0) {
    store.dispatch({type: ActionTypes.SET_COLLISIONS, collisions: collisions});
  }
};

let gameOver = false;
const game = () => {
  const renderLoop = () => {
    const { pieuwerStates, bulletStates, enemyStates, explosionStates, collisionStates } = store.getState();
    debug.innerHTML =  ""; //JSON.stringify(collisionStates, null, 2);

    mainFrameRenderer.clear();
    mainFrameRenderer.render(
      bulletStates.bullets.map(drawBullet).concat(
      explosionStates.explosions.map(drawExplosion)).concat(
      enemyStates.enemies.map(drawEnemy).concat(
      [
          drawPieuwer("pieuwerOne", pieuwerStates.pieuwerOne),
          drawPieuwer("pieuwerTwo", pieuwerStates.pieuwerTwo),
      ]).concat(
      Object.keys(collisionStates.collisions).map(piewerKey => drawCollisions(pieuwerStates[piewerKey],
        collisionStates.collisions[piewerKey].map(c => c.collisions.collidingCorners)))).concat(
      Object.keys(collisionStates.collisions).map(pk => collisionStates.collisions[pk]).reduce((a,b) => a.concat(b), [])
        .map(({enemyIdx, collisions}) => drawCollisions(enemyStates.enemies[enemyIdx], [collisions.collidingEnemyCorners]))
      )
    ));
    if (!gameOver) {
  	   requestAnimationFrame(renderLoop);
     }
  };


  for (let i = 0; i < 16; i++) {
    setTimeout(() => spawnEnemy(EnemyType.SKULL, -100, -100, {x: 60, y: 80}, 30), i * 500);
  }
  setTimeout(() => spawnEnemy(EnemyType.SKULL_BOSS, VIRT_WIDTH / 2, VIRT_HEIGHT / 2, {x: 400, y: 640}, 150), 8000);
  setTimeout(() => spawnEnemy(EnemyType.SKULL_BOSS, VIRT_WIDTH / 2, VIRT_HEIGHT / 2, {x: 400, y: 640}, 150), 12000);

  let uploopinterval : number, bulletInterval : number;
  const updateLoop = () => {


    store.dispatch({type: ActionTypes.UPDATE});
    detectBulletToEnemyCollisions(store.getState())
      .forEach(handleBulletEnemyCollision);
    handlePieuwerToEnemyCollisions(detectPieuwerToEnemyCollisions(store.getState()));

    if (store.getState().pieuwerStates.pieuwerOne.health < 0 || store.getState().pieuwerStates.pieuwerTwo.health < 0) {
      mainLayer.style.opacity = "0";
      gameOver = true;
      clearInterval(uploopinterval);
      clearInterval(bulletInterval);
      document.body.innerHTML = `<div style="color: white; text-align: center">BOEM! GAME OVER</div>`;
      setTimeout(() => location.reload(), 3000);
    }
    if (store.getState().enemyStates.enemies.length === 0) {
      mainLayer.style.opacity = "0";
      gameOver = true;
      clearInterval(uploopinterval);
      clearInterval(bulletInterval);
      document.body.innerHTML = `<div style="color: white; font-size: 5em; text-align: center">jA!</div>`;
      setTimeout(() => location.reload(), 3000);
    }
  }
  uploopinterval = window.setInterval(updateLoop, 10);

  bulletInterval = window.setInterval(() => {
    const { pieuwerOne, pieuwerTwo } = store.getState().pieuwerStates;
    spawnBullet(pieuwerOne);
    spawnBullet(pieuwerTwo);
  }, 50);

  renderLoop();
};

preload(() => setTimeout(game, 10));

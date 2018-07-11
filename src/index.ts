import { createStore, combineReducers  } from 'redux';
import reducers, { GameState } from './store/reducers';
import { keyActionCreator } from './actions/action-creators';
import { ActionTypes } from './actions/action-types';

import getFrameRenderer from "./resizable-canvas/frame-renderer";
import getResizeListeners from "./resizable-canvas/resize-listeners";
import initViewPort from "./resizable-canvas/viewport";
import getEventListeners from './resizable-canvas/event-listeners';
import { VIRT_HEIGHT, VIRT_WIDTH } from './store/constants';
import { PieuwerState } from './store/pieuwer-reducer';
import { Drawable } from './resizable-canvas/drawable';

const store = createStore(combineReducers(reducers));
const {  onKeyUp, onKeyDown } = keyActionCreator(store.dispatch);


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

initViewPort(VIRT_WIDTH, VIRT_HEIGHT, getResizeListeners([pieuwerLayer, pieuwerTwoLayer, bulletLayer],
  eventListeners.onResize,
  pieuwerOneFrameRenderer.onResize,
  pieuwerTwoFrameRenderer.onResize,
  bulletFrameRenderer.onResize
));

eventListeners.add("keydown", (ev : KeyboardEvent) => { onKeyDown(ev.key); return ev.preventDefault(); });
eventListeners.add("keyup", (ev : KeyboardEvent) => { onKeyUp(ev.key); return ev.preventDefault(); });

const debug = document.getElementById("debug");

class Pieuwer implements Drawable {
  state: PieuwerState
  stateChanged: boolean
  clearX: number
  clearY: number
  constructor(state : PieuwerState) {
    this.state = state;
    this.stateChanged = true;
    this.clearX = state.xPos;
    this.clearY = state.yPos;
  }
  updateState(newState : PieuwerState) {
    this.stateChanged =
      this.state.yPos !== newState.yPos ||
      this.state.xPos !== newState.xPos ||
      this.state.angle !== newState.angle;
    this.state = newState;
  }
  draw(ctx: CanvasRenderingContext2D, scale: number) {
    ctx.fillStyle = "purple";
    ctx.save();
    ctx.translate(this.state.xPos * scale, this.state.yPos * scale);
    ctx.rotate(this.state.angle * Math.PI / 180);
    ctx.beginPath();
    ctx.lineWidth = 4;
    ctx.strokeStyle = "white";
    ctx.arc(
      0, 0,
      32 * scale,  0, Math.PI, false
    )
    ctx.stroke();
    ctx.beginPath();
    ctx.fillStyle = "white";
    ctx.arc(0, 0, 32 * scale,
      80 * (Math.PI / 180), 100 * (Math.PI / 180), false);
    ctx.lineTo(0, -50 * scale);
    ctx.fill();
    ctx.restore();


    this.stateChanged = false;
    this.clearX = this.state.xPos;
    this.clearY = this.state.yPos;
  }
  clear(ctx: CanvasRenderingContext2D, scale: number) {
    ctx.clearRect(
			(this.clearX - 50) * scale,
			(this.clearY - 50) * scale,
			100 * scale, 100 * scale
		);
  }
  updated() { return this.stateChanged; }
}

const pieuwerOne = new Pieuwer(store.getState().pieuwerStates.pieuwerOne);
const pieuwerTwo = new Pieuwer(store.getState().pieuwerStates.pieuwerTwo);
pieuwerOneFrameRenderer.render([pieuwerOne]);
pieuwerTwoFrameRenderer.render([pieuwerTwo]);

const renderLoop = () => {
  const { pieuwerStates, bulletStates } : GameState = store.getState();

  pieuwerOne.updateState(pieuwerStates.pieuwerOne);
  pieuwerTwo.updateState(pieuwerStates.pieuwerTwo);
//  debug.innerHTML = JSON.stringify(store.getState(), null, 2);

  bulletFrameRenderer.clear();

  pieuwerOneFrameRenderer.render([pieuwerOne]);
  pieuwerTwoFrameRenderer.render([pieuwerTwo]);
  bulletFrameRenderer.render(bulletStates.bullets.map((bs) => ({
    updated: () => true,
    clear: () => {},
    draw: (ctx: CanvasRenderingContext2D, scale: number) => {
      ctx.fillStyle = "white";
      ctx.fillRect(bs.xPos * scale, bs.yPos * scale, 5 * scale, 5 * scale);
    }
  })));
	requestAnimationFrame(renderLoop);
};

const updateLoop = () => {
  store.dispatch({type: ActionTypes.UPDATE})
}

window.setInterval(updateLoop, 10);
window.setInterval(() => {
  const { pieuwerOne, pieuwerTwo } = store.getState().pieuwerStates;
  if (pieuwerOne.shooting) {
    const trajectory = (pieuwerOne.angle - 90) * (Math.PI / 180);
    store.dispatch({
      type: ActionTypes.SPAWN_BULLET,
      xPos: pieuwerOne.xPos + Math.cos(trajectory) * 50,
      yPos: pieuwerOne.yPos + Math.sin(trajectory) * 50,
      trajectory: trajectory
    });
  }
  if (pieuwerTwo.shooting) {
    const trajectory = (pieuwerTwo.angle - 90) * (Math.PI / 180);
    store.dispatch({
      type: ActionTypes.SPAWN_BULLET,
      xPos: pieuwerTwo.xPos + Math.cos(trajectory) * 50,
      yPos: pieuwerTwo.yPos + Math.sin(trajectory) * 50,
      trajectory: trajectory
    });
  }
}, 50);

renderLoop();

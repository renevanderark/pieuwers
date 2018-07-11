import { createStore, combineReducers  } from 'redux';
import reducers, { GameState } from './store/reducers';
import { keyActionCreator } from './actions/action-creators';
import { ActionTypes } from './actions/action-types';

const store = createStore(combineReducers(reducers));

const {  onKeyUp, onKeyDown } = keyActionCreator(store.dispatch);

window.addEventListener("keydown", (ev) => { onKeyDown(ev.key); return ev.preventDefault(); });
window.addEventListener("keyup", (ev) => { onKeyUp(ev.key); return ev.preventDefault(); });

const debug = document.getElementById("debug");


const renderLoop = () => {
  debug.innerHTML = JSON.stringify(store.getState(), null, 2);

	requestAnimationFrame(renderLoop);
};

const updateLoop = () => {
  store.dispatch({type: ActionTypes.UPDATE})
}

window.setInterval(updateLoop, 10);
renderLoop();

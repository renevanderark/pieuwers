import { ActionTypes  } from "../actions/action-types";
import { AnyAction } from "redux";
import { VIRT_WIDTH, VIRT_HEIGHT } from "./constants";
import { KeyAction, BulletAction, ExplosionAction } from "../actions/action-creators";
import { Point } from "../phyz/shapes";


export interface ExplosionState {
  pos: Point
  size: number,
  initSize: number
}

export interface MultiExplosionState {
  explosions: Array<ExplosionState>
}


const initialState : MultiExplosionState  = {
  explosions: []
};

const explode = (explosion : ExplosionState) : ExplosionState => ({
  ...explosion,
  size: explosion.size - 1
});


export default function(state : MultiExplosionState, action : ExplosionAction) : MultiExplosionState {
  if (typeof state === 'undefined') {
    return initialState;
  }
  switch (action.type) {
    case ActionTypes.SPAWN_EXPLOSION:
      return {
        explosions: state.explosions.concat({
          size: action.size,
          initSize: action.size,
          pos: action.pos,
        })
      };
    case ActionTypes.UPDATE:
      return {
        explosions: state.explosions
          .map(explode)
          .filter(explosion => explosion.size > 0)
      };
    default:
      return state;
  }
}

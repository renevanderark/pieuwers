import { ActionTypes  } from "../actions/action-types";
import { AnyAction } from "redux";
import { VIRT_WIDTH, VIRT_HEIGHT } from "./constants";
import { KeyAction, BulletAction } from "../actions/action-creators";
import { Point } from "../phyz/shapes";


export interface BulletState {
  trajectory: number
  pos: Point
}

export interface MultiBulletState {
  bullets: Array<BulletState>
}


const initialState : MultiBulletState  = {
  bullets: []
};

const fly = (bullet : BulletState) : BulletState => ({
  ...bullet,
  pos: {
    x: bullet.pos.x + Math.cos(bullet.trajectory) * 10,
    y: bullet.pos.y + Math.sin(bullet.trajectory) * 10
  }
});

const withinBounds = (bullet : BulletState) : boolean  =>
  bullet.pos.x > 0 && bullet.pos.x < VIRT_WIDTH && bullet.pos.y > 0 && bullet.pos.y < VIRT_HEIGHT;

export default function(state : MultiBulletState, action : BulletAction) : MultiBulletState {
  if (typeof state === 'undefined') {
    return initialState;
  }
  switch (action.type) {
    case ActionTypes.ENEMY_RECEIVES_BULLET:
    return {
      bullets: state.bullets.filter((bullet, idx) => idx !== action.bulletIdx)
    };
    case ActionTypes.SPAWN_BULLET:
      return {
        bullets: state.bullets.concat({
          pos: { x: action.xPos, y: action.yPos },
          trajectory: action.trajectory
        })
      };
    case ActionTypes.UPDATE:
      return {
        bullets: state.bullets
          .map(fly)
          .filter(withinBounds)
      };
    default:
      return state;
  }
}

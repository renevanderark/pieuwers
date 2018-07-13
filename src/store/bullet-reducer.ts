import { ActionTypes  } from "../actions/action-types";
import { AnyAction } from "redux";
import { VIRT_WIDTH, VIRT_HEIGHT } from "./constants";
import { KeyAction, BulletAction } from "../actions/action-creators";


export interface BulletState {
  trajectory: number,
  xPos: number,
  yPos: number,
}

export interface MultiBulletState {
  bullets: Array<BulletState>
}


const initialState : MultiBulletState  = {
  bullets: []
};

const fly = (bullet : BulletState) : BulletState => ({
  ...bullet,
  xPos: bullet.xPos + Math.cos(bullet.trajectory) * 10,
  yPos: bullet.yPos + Math.sin(bullet.trajectory) * 10,
});

const withinBounds = (bullet : BulletState) : boolean  =>
  bullet.xPos > 0 && bullet.xPos < VIRT_WIDTH && bullet.yPos > 0 && bullet.yPos < VIRT_HEIGHT;

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
          xPos: action.xPos,
          yPos: action.yPos,
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

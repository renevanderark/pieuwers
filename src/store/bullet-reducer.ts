import { ActionTypes  } from "../actions/action-types";
import { AnyAction } from "redux";
import { VIRT_WIDTH, VIRT_HEIGHT } from "./constants";
import { KeyAction, BulletAction } from "../actions/action-creators";


export interface BulletState {
  trajectory: number,
  xPos: number,
  yPos: number,
  explosion: number
}

export interface MultiBulletState {
  bullets: Array<BulletState>
}


const initialState : MultiBulletState  = {
  bullets: []
};

const fly = (bullet : BulletState) : BulletState => ({
  ...bullet,
  xPos: bullet.explosion < 0 ? bullet.xPos + Math.cos(bullet.trajectory) * 10 : bullet.xPos,
  yPos: bullet.explosion < 0 ? bullet.yPos + Math.sin(bullet.trajectory) * 10 : bullet.yPos,
  explosion: bullet.explosion > 0 ? bullet.explosion - 1 : -1
});

const withinBounds = (bullet : BulletState) : boolean  =>
  bullet.xPos > 0 && bullet.xPos < VIRT_WIDTH && bullet.yPos > 0 && bullet.yPos < VIRT_HEIGHT;

const notExploded = (bullet : BulletState) : boolean  =>
  bullet.explosion !== 0;


export default function(state : MultiBulletState, action : BulletAction) {
  if (typeof state === 'undefined') {
    return initialState;
  }
  switch (action.type) {
    case ActionTypes.ENEMY_RECEIVES_BULLET:
    return {
      bullets: state.bullets.map((bullet, idx) => ({
        ...bullet,
        explosion: idx === action.bulletIdx ? 5 : bullet.explosion,
      }))
    };
    case ActionTypes.SPAWN_BULLET:
      return {
        bullets: state.bullets.concat({
          explosion: -1,
          xPos: action.xPos,
          yPos: action.yPos,
          trajectory: action.trajectory
        })
      };
    case ActionTypes.UPDATE:
      return {
        bullets: state.bullets
          .map(fly)
          .filter(notExploded)
          .filter(withinBounds)
      };
    default:
      return state;
  }
}

import { ActionTypes  } from "../actions/action-types";
import { VIRT_WIDTH, VIRT_HEIGHT } from "./constants";
import { BulletAction } from "../actions/action-creators";
import { Point } from "../phyz/shapes";


export interface BulletState {
  trajectory: number
  pos: Point
  speed: number
}

export interface MultiBulletState {
  bullets: Array<BulletState>
  enemyBullets: Array<BulletState>
}


const initialState : MultiBulletState  = {
  bullets: [],
  enemyBullets: []
};

const fly = (bullet : BulletState) : BulletState => ({
  ...bullet,
  pos: {
    x: bullet.pos.x + Math.cos(bullet.trajectory) * bullet.speed,
    y: bullet.pos.y + Math.sin(bullet.trajectory) * bullet.speed
  }
});

const withinBounds = (bullet : BulletState) : boolean  =>
  bullet.pos.x > 0 && bullet.pos.x < VIRT_WIDTH && bullet.pos.y > 0 && bullet.pos.y < VIRT_HEIGHT;

export default function(state : MultiBulletState, action : BulletAction) : MultiBulletState {
  if (typeof state === 'undefined') {
    return initialState;
  }
  switch (action.type) {
    case ActionTypes.RESET_INITIAL_STATE:
      return initialState;
    case ActionTypes.REMOVE_BULLET:
      return {
        ...state,
        [action.bulletType]: state[action.bulletType].filter((bullet, idx) => idx !== action.bulletIdx)
      };
    case ActionTypes.SPAWN_BULLET:
      return {
        ...state,
        [action.bulletType]: state[action.bulletType].concat({
          pos: { x: action.xPos, y: action.yPos },
          trajectory: action.trajectory,
          speed: action.bulletType === "enemyBullets" ? 4 : 10
        })
      };
    case ActionTypes.UPDATE:
      return {
        enemyBullets: state.enemyBullets.map(fly).filter(withinBounds),
        bullets: state.bullets.map(fly).filter(withinBounds)
      };
    default:
      return state;
  }
}

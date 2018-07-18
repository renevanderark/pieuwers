import { ActionTypes } from "../actions/action-types";
import { PieuwerState } from "./pieuwer-reducer";
import { EnemyAction } from "../actions/action-creators";
import { VIRT_HEIGHT, VIRT_WIDTH } from "./constants";
import { pointWithinBox } from "../phyz/boxes";
import { Box } from "../phyz/shapes";
import { EnemyType } from "../enemies/types";
import { fly } from "../enemies/enemy-fly-behaviours";

export interface EnemyState extends PieuwerState {
  maxHealth: number
  enemyType: EnemyType
}


export interface MultiEnemyState {
  enemies: Array<EnemyState>
}

const initialState : MultiEnemyState =  {
  enemies: [],
}

export default function(state : MultiEnemyState, action : EnemyAction) : MultiEnemyState {
  if (typeof state === 'undefined') {
    return initialState;
  }
  let newState = state;
  switch (action.type) {
    case ActionTypes.ENEMY_RECEIVES_BULLET:
      return {
        ...state,
        enemies: state.enemies.map((enemy, idx) => ({
          ...enemy,
          health: idx === action.enemyIdx ? enemy.health - 1 : enemy.health
        }))
      };
    case ActionTypes.SPAWN_ENEMY:
      return {
        ...state,
        enemies: state.enemies.concat(action.spawn)
      };
      break;
    case ActionTypes.ENEMY_COLLIDES_WITH_PIEUWER:
      return {
        ...state,
        enemies: state.enemies.map((enemy, idx) => ({
          ...enemy,
          health: idx === action.enemyIdx ? enemy.health - 0.04 : enemy.health,
          collided: idx === action.enemyIdx ? true : enemy.collided
        }))
      }
    case ActionTypes.UPDATE:
      return {
        ...state,
        enemies: state.enemies.map(fly).filter((enemy) => enemy.health > 0)
      };
      break;
    default:
      return state;
  }
}

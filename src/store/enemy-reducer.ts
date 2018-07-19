import { ActionTypes } from "../actions/action-types";
import { PieuwerState } from "./pieuwer-reducer";
import { EnemyAction } from "../actions/action-creators";
import { VIRT_HEIGHT, VIRT_WIDTH } from "./constants";
import { pointWithinBox } from "../phyz/boxes";
import { Box, Point } from "../phyz/shapes";
import { EnemyType } from "../enemies/types";
import { fly, FlyBehaviour } from "../enemies/enemy-fly-behaviours";
import { Thing } from "./thing";

export interface EnemyState extends Thing {
  flyBehaviour: FlyBehaviour
  enemyType: EnemyType
  startPos: Point
  trajectory: number
  shootTimer: number
}


export interface MultiEnemyState {
  enemies: Array<EnemyState>
  spawnCentral: Point
}

const initialState : MultiEnemyState =  {
  enemies: [],
  spawnCentral: {x: VIRT_WIDTH / 2, y: -(VIRT_HEIGHT / 3)}
}

export default function(state : MultiEnemyState, action : EnemyAction) : MultiEnemyState {
  if (typeof state === 'undefined') {
    return initialState;
  }
  let newState = state;
  switch (action.type) {
    case ActionTypes.RESET_ENEMY_CENTRAL:
      return {
        ...state,
        spawnCentral: initialState.spawnCentral
      };
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
          health: idx === action.enemyIdx ? enemy.health - 0.04 : enemy.health
        }))
      }
    case ActionTypes.UPDATE:
      return {
        ...state,
        spawnCentral: {
          x: state.spawnCentral.x,
          y: state.spawnCentral.y < VIRT_HEIGHT / 2 ? state.spawnCentral.y + 1 : VIRT_HEIGHT / 2
        },
        enemies: state.enemies.map(enemy => fly(enemy, state.spawnCentral, action.pieuwerPositions))
          .filter((enemy) => enemy.health > 0)
      };
      break;
    default:
      return state;
  }
}

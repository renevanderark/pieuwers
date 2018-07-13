import { ActionTypes } from "../actions/action-types";
import { PieuwerState } from "./pieuwer-reducer";
import { EnemyAction } from "../actions/action-creators";
import { VIRT_HEIGHT, VIRT_WIDTH } from "./constants";
import { pointWithinBox, boxesOverlap } from "../phyz/boxes";
import { Box } from "../phyz/shapes";

export interface EnemyState extends PieuwerState {
  maxHealth: number
}

export type CollisionGrid = {[key: string] : Array<number>}

export interface MultiEnemyState {
  enemies: Array<EnemyState>
  collisionGrid: CollisionGrid
}

const initializeCollisionGrid = () : CollisionGrid => {
  let grid : CollisionGrid = {};
  for(let x = 0; x < VIRT_WIDTH; x += COLLISION_GRID_SIZE) {
    for(let y = 0; y < VIRT_HEIGHT; y += COLLISION_GRID_SIZE) {
      grid[`${x}-${y}`] = [];
    }
  }
  return grid;
}

const initialState : MultiEnemyState =  {
  enemies: [],
  collisionGrid: initializeCollisionGrid()
}
export const COLLISION_GRID_SIZE = 200;

const enemyWithinGridBox = (enemy : EnemyState, gX : number, gY : number) : boolean =>
  boxesOverlap(
    {x: enemy.pos.x - enemy.size.x / 2, y: enemy.pos.y - enemy.size.y / 2, w: enemy.size.x, h: enemy.size.y},
    {x: gX, y: gY, w: COLLISION_GRID_SIZE, h: COLLISION_GRID_SIZE}
  );

const updateCollisionGrid = (state : MultiEnemyState) : MultiEnemyState => {
    let newCollsionGrid : CollisionGrid = {};
    for(let x = 0; x < VIRT_WIDTH; x += COLLISION_GRID_SIZE) {
      for(let y = 0; y < VIRT_HEIGHT; y += COLLISION_GRID_SIZE) {
        newCollsionGrid[`${x}-${y}`] = state.enemies
          .map((enemy, idx) => ({idx: idx, overlaps: enemyWithinGridBox(enemy, x, y)}))
          .filter(({idx, overlaps}) => overlaps)
          .map(({idx}) => idx);
      }
    }

    return {
      ...state,
      collisionGrid: newCollsionGrid
    };
}

const fly = (enemyState : EnemyState) : EnemyState => enemyState

export default function(state : MultiEnemyState, action : EnemyAction) : MultiEnemyState {
  if (typeof state === 'undefined') {
    return initialState;
  }
  let newState = state;
  switch (action.type) {
    case ActionTypes.ENEMY_RECEIVES_BULLET:
      newState = {
        ...state,
        enemies: state.enemies.map((enemy, idx) => ({
          ...enemy,
          health: idx === action.enemyIdx ? enemy.health - 1 : enemy.health
        })).filter((enemy) => enemy.health > 0)
      };
      break;
    case ActionTypes.SPAWN_ENEMY:
      newState = {
        ...state,
        enemies: state.enemies.concat(action.spawn)
      };
      break;
    case ActionTypes.UPDATE:
      newState = {
        ...state,
        enemies: state.enemies.map(fly)
      };
      break;
    default:
      return state;
  }
  return updateCollisionGrid(newState);
}

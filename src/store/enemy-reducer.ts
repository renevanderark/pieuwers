import { ActionTypes } from "../actions/action-types";
import { PieuwerState } from "./pieuwer-reducer";
import { EnemyAction } from "../actions/action-creators";
import { VIRT_HEIGHT, VIRT_WIDTH } from "./constants";

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

const updateCollisionGrid = (state : MultiEnemyState) : MultiEnemyState => {
    let newCollsionGrid : CollisionGrid = {};
    for(let x = 0; x < VIRT_WIDTH; x += COLLISION_GRID_SIZE) {
      for(let y = 0; y < VIRT_HEIGHT; y += COLLISION_GRID_SIZE) {
        newCollsionGrid[`${x}-${y}`] = [];
        state.enemies.forEach((enemy, idx) => {
          const l = enemy.xPos - enemy.collisionRadius;
          const r = enemy.xPos + enemy.collisionRadius;
          const t = enemy.yPos - enemy.collisionRadius;
          const b = enemy.yPos + enemy.collisionRadius;
          const gB = y + COLLISION_GRID_SIZE;
          const gR = x + COLLISION_GRID_SIZE;

          // boundingBox within gridPos
          if (l >= x && l <= gR && t >= y && t <= gB) { // topLeft
            newCollsionGrid[`${x}-${y}`].push(idx);
            return;
          }
          if (r >= x && r <= gR && t >= y && t <= gB) { // topRight
            newCollsionGrid[`${x}-${y}`].push(idx);
            return;
          }
          if (l >= x && l <= gR && b >= y && b <= gB) { // bottomLeft
            newCollsionGrid[`${x}-${y}`].push(idx);
            return;
          }
          if (r >= x && r <= gR && b >= y && b <= gB) { // bottomRight
            newCollsionGrid[`${x}-${y}`].push(idx);
            return;
          }
          // gridPos within bounding box
          if (x >= l && x <= r && y >= t && y <= b) { // topLeft
            newCollsionGrid[`${x}-${y}`].push(idx);
            return;
          }
          if (gR >= l && gR <= r && y >= t && y <= b) { // topRight
            newCollsionGrid[`${x}-${y}`].push(idx);
            return;
          }
          if (x >= l && x <= r && gB >= t && gB <= b) { // bottomLeft
            newCollsionGrid[`${x}-${y}`].push(idx);
            return;
          }
          if (gR >= l && gR <= r && gB >= t && gB <= b) { // bottomRight
            newCollsionGrid[`${x}-${y}`].push(idx);
            return;
          }
        });
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

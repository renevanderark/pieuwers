import pieuwerReducer, { MultiPieuwerState } from "./pieuwer-reducer";
import bulletReducer, { MultiBulletState } from "./bullet-reducer";
import enemyReducer, { MultiEnemyState } from "./enemy-reducer";

export default {
  pieuwerStates: pieuwerReducer,
  bulletStates: bulletReducer,
  enemyStates: enemyReducer
}

export interface GameState {
  pieuwerStates: MultiPieuwerState
  bulletStates: MultiBulletState
  enemyStates: MultiEnemyState
}

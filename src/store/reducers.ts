import pieuwerReducer, { MultiPieuwerState } from "./pieuwer-reducer";
import bulletReducer, { MultiBulletState } from "./bullet-reducer";
import enemyReducer, { MultiEnemyState } from "./enemy-reducer";
import explosionReducer, { MultiExplosionState } from "./explosion-reducer";
import collisionReducer, { MultiCollisionState } from "./collision-reducer";

export default {
  pieuwerStates: pieuwerReducer,
  bulletStates: bulletReducer,
  explosionStates: explosionReducer,
  enemyStates: enemyReducer,
  collisionStates: collisionReducer
}

export interface GameState {
  pieuwerStates: MultiPieuwerState
  bulletStates: MultiBulletState
  explosionStates: MultiExplosionState
  enemyStates: MultiEnemyState
  collisionStates: MultiCollisionState
}

import pieuwerReducer, { MultiPieuwerState } from "./pieuwer-reducer";
import bulletReducer, { MultiBulletState } from "./bullet-reducer";

export default {
  pieuwerStates: pieuwerReducer,
  bulletStates: bulletReducer
}

export interface GameState {
  pieuwerStates: MultiPieuwerState,
  bulletStates: MultiBulletState
}

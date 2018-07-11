import pieuwerReducer, { MultiPieuwerState } from "./pieuwer-reducer";

export default {
  pieuwerStates: pieuwerReducer
}

export interface GameState {
  pieuwerStates: MultiPieuwerState
}

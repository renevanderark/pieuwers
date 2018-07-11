import { Dispatch, AnyAction } from "redux";
import { ActionTypes } from "./action-types";
import { PieuwerControl, PieuwerKey } from "../store/pieuwer-reducer";



const KeyboardToPlayerControlMap : {[key: string]: PieuwerKey } = {
  ArrowUp: "pieuwerOne",
  ArrowDown: "pieuwerOne",
  ArrowLeft: "pieuwerOne",
  ArrowRight: "pieuwerOne",
  "0": "pieuwerOne",
  w: "pieuwerTwo",
  s: "pieuwerTwo",
  a: "pieuwerTwo",
  d: "pieuwerTwo",
  " ": "pieuwerTwo"
};

const KeyboardToPieuwerControlMap : {[key: string]: PieuwerControl} = {
  ArrowUp: PieuwerControl.UP,
  ArrowDown: PieuwerControl.DOWN,
  ArrowLeft: PieuwerControl.LEFT,
  ArrowRight: PieuwerControl.RIGHT,
  "0": PieuwerControl.SHOOT,
  w: PieuwerControl.UP,
  s: PieuwerControl.DOWN,
  a: PieuwerControl.LEFT,
  d: PieuwerControl.RIGHT,
  " ": PieuwerControl.SHOOT
};

export interface KeyAction  {
  type: ActionTypes
  key: PieuwerControl
  player: PieuwerKey
}

export interface BulletAction {
  type: ActionTypes
  xPos: number
  yPos: number
  trajectory: number
}

export const keyActionCreator = (dispatch : Dispatch<KeyAction>) => ({
  onKeyDown: (key : string) => dispatch({type: ActionTypes.KEYDOWN, key: KeyboardToPieuwerControlMap[key], player: KeyboardToPlayerControlMap[key]}),
  onKeyUp: (key : string) =>  dispatch({type: ActionTypes.KEYUP, key: KeyboardToPieuwerControlMap[key], player: KeyboardToPlayerControlMap[key]}),
});

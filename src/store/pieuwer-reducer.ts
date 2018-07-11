import { ActionTypes, KeyAction  } from "../actions/action-types";
import { AnyAction } from "redux";
import { VIRT_WIDTH, VIRT_HEIGHT } from "./constants";

const yAcceleration = 0.1;
const maxYSpeed = 3;
const minYSpeed = -1.5;

const turnAcceleration = 0.1;
const maxAngle = 3;
const minAngle = -3;

type stateKey = "accelerateUp"|"accelerateDown"|"accelerateLeft"|"accelerateRight"|"shooting";
type pieuwerKey = "pieuwerOne"|"pieuwerTwo";

export interface PieuwerState {
  accelerateUp: boolean,
  accelerateDown: boolean,
  accelerateLeft: boolean,
  accelerateRight: boolean,
  angle: number,
  ySpeed: number,
  xPos: number,
  yPos: number,
  shooting: boolean
}

export interface MultiPieuwerState {
  pieuwerOne: PieuwerState,
  pieuwerTwo: PieuwerState
}

const initializePieuwerState = (xPos : number) : PieuwerState => ({
  accelerateLeft: false, accelerateRight: false,
  accelerateUp: false, accelerateDown: false,
  angle: 0, ySpeed: 0, shooting: false,
  yPos: 150, xPos: xPos
});

const initialState : MultiPieuwerState  = {
  pieuwerOne: initializePieuwerState(200),
  pieuwerTwo: initializePieuwerState(VIRT_WIDTH - 200)
};

const guardNumber = (newNum : number, maxNum : number, minNum : number) : number =>
  newNum > maxNum ? maxNum  : newNum < minNum ? minNum : newNum;

const updatePieuwerState = (pieuwerState : PieuwerState) : PieuwerState => ({
    ...pieuwerState,
    ySpeed: pieuwerState.accelerateUp
      ? guardNumber(pieuwerState.ySpeed + yAcceleration, maxYSpeed, minYSpeed)
      : pieuwerState.accelerateDown
      ? guardNumber(pieuwerState.ySpeed - yAcceleration, maxYSpeed, minYSpeed)
      : pieuwerState.ySpeed < 0
      ? guardNumber(pieuwerState.ySpeed + yAcceleration, 0, minYSpeed)
      : pieuwerState.ySpeed > 0
      ? guardNumber(pieuwerState.ySpeed - yAcceleration, maxYSpeed, 0)
      : 0,

    angle: pieuwerState.accelerateLeft
      ? guardNumber(pieuwerState.angle - turnAcceleration, maxAngle, minAngle)
      : pieuwerState.accelerateRight
      ? guardNumber(pieuwerState.angle + turnAcceleration, maxAngle, minAngle)
      : pieuwerState.angle < 0
      ? guardNumber(pieuwerState.angle + turnAcceleration, 0, minAngle)
      : pieuwerState.angle > 0
      ? guardNumber(pieuwerState.angle - turnAcceleration, maxAngle, 0)
      : 0,

    yPos: guardNumber(Math.round(pieuwerState.yPos + pieuwerState.ySpeed), VIRT_HEIGHT, 0),
    xPos: guardNumber(Math.round(pieuwerState.xPos + pieuwerState.angle), VIRT_WIDTH, 0)
});

const setPieuwerState = (pieuwerState : MultiPieuwerState, pieuwer : pieuwerKey, key : stateKey, val : boolean) : MultiPieuwerState => ({
    ...pieuwerState,
    [pieuwer] : {
      ...pieuwerState[pieuwer],
      [key]: val
    }
});

export default function(state : MultiPieuwerState , action : KeyAction|AnyAction) {
  if (typeof state === 'undefined') {
    return initialState;
  }
  switch (action.type) {
    case ActionTypes.KEYUP:
      switch (action.key) {
        case 'ArrowUp':
          return setPieuwerState(state, "pieuwerOne", "accelerateUp", false);
        case 'ArrowDown':
          return setPieuwerState(state, "pieuwerOne", "accelerateDown", false);
        case 'w':
          return setPieuwerState(state, "pieuwerTwo", "accelerateUp", false);
        case 's':
          return setPieuwerState(state, "pieuwerTwo", "accelerateDown", false);
        case 'ArrowLeft':
          return setPieuwerState(state, "pieuwerOne", "accelerateLeft", false);
        case 'ArrowRight':
          return setPieuwerState(state, "pieuwerOne", "accelerateRight", false);
        case 'a':
          return setPieuwerState(state, "pieuwerTwo", "accelerateLeft", false);
        case 'd':
          return setPieuwerState(state, "pieuwerTwo", "accelerateRight", false);
        case '0':
          return setPieuwerState(state, "pieuwerOne", "shooting", false);
        case ' ':
          return setPieuwerState(state, "pieuwerTwo", "shooting", false);
        default:
          return state;
      }

    case ActionTypes.KEYDOWN:
      switch (action.key) {
        case 'ArrowUp':
          return setPieuwerState(state, "pieuwerOne", "accelerateUp", true);
        case 'w':
          return setPieuwerState(state, "pieuwerTwo", "accelerateUp", true);
        case 'ArrowDown':
          return setPieuwerState(state, "pieuwerOne", "accelerateDown", true);
        case 's':
          return setPieuwerState(state, "pieuwerTwo", "accelerateDown", true);
        case 'ArrowLeft':
          return setPieuwerState(state, "pieuwerOne", "accelerateLeft", true);
        case 'a':
          return setPieuwerState(state, "pieuwerTwo", "accelerateLeft", true);
        case 'ArrowRight':
          return setPieuwerState(state, "pieuwerOne", "accelerateRight", true);
        case 'd':
          return setPieuwerState(state, "pieuwerTwo", "accelerateRight", true);
        case '0':
          return setPieuwerState(state, "pieuwerOne", "shooting", true);
        case ' ':
          return setPieuwerState(state, "pieuwerTwo", "shooting", true);
        default:
          return state;
      }
    case ActionTypes.UPDATE:
      return {
        pieuwerOne: updatePieuwerState(state.pieuwerOne),
        pieuwerTwo: updatePieuwerState(state.pieuwerTwo)
      };
    default:
      return state;
  }
}

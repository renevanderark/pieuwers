import { ActionTypes  } from "../actions/action-types";
import { AnyAction } from "redux";
import { VIRT_WIDTH, VIRT_HEIGHT, PIEUWER_WIDTH, PIEUWER_HEIGHT } from "./constants";
import { KeyAction } from "../actions/action-creators";
import { Point, Box, Circle } from "../phyz/shapes";
import { guardNumber } from "../phyz/guard-number";

const yAcceleration = 0.25;
const maxYSpeed = 3;
const minYSpeed = -1.5;

const turnAcceleration = 1.5;
const maxAngle = 15;
const minAngle = -15;

type stateKey = "accelerateUp"|"accelerateDown"|"accelerateLeft"|"accelerateRight"|"shooting";
export type PieuwerKey = "pieuwerOne"|"pieuwerTwo";

export enum PieuwerControl {
  UP, DOWN, LEFT, RIGHT, SHOOT
}


export interface PieuwerState {
  axisY: number
  axisX: number
  accelerateUp: boolean
  accelerateDown: boolean
  accelerateLeft: boolean
  accelerateRight: boolean
  collisionShapes: Array<Box|Circle>
  angle: number
  ySpeed: number
  pos: Point
  size: Point
  shooting: boolean
  health: number
  collided: boolean
}

export interface MultiPieuwerState {
  pieuwerOne: PieuwerState
  pieuwerTwo: PieuwerState
}
const range = (start : number, end : number, step : number = 1) : Array<number> => {
    var range = [];
    if (end < start) {
        step = -step;
    }
    while (step > 0 ? end >= start : end <= start) {
        range.push(start);
        start += step;
    }

    return range;
}


const initializePieuwerState = (xPos : number) : PieuwerState => ({
  axisX: null, axisY: null,
  accelerateLeft: false, accelerateRight: false,
  accelerateUp: false, accelerateDown: false,
  angle: 0, ySpeed: 0, shooting: false,
  health: 100,
  collisionShapes: [
    {x: (110 -  (PIEUWER_WIDTH  / 2)), y: (0 - (PIEUWER_HEIGHT / 2)), w: 20, h: 230},
  ].concat(range(50, 100, 10).map(x => ({
    x: (x -(PIEUWER_WIDTH  / 2)),
    y: PIEUWER_HEIGHT - x - 90,
    w: 10,
    h: x - 40
  }))).concat(range(10, 60, 10).map(x => ({
    x: x,
    y: 30 + (x*1.1),
    w: 10,
    h: 80 - x*1.1
  }))),
  pos: {x: xPos, y: VIRT_HEIGHT - 150},
  size: {x: PIEUWER_WIDTH, y: PIEUWER_HEIGHT},
  collided: false
});

const initialState : MultiPieuwerState  = {
  pieuwerOne: initializePieuwerState(200),
  pieuwerTwo: initializePieuwerState(VIRT_WIDTH - 200)
};
console.log(initialState.pieuwerOne.collisionShapes);

const updatePieuwerState = (pieuwerState : PieuwerState) : PieuwerState => ({
    ...pieuwerState,
    collided: false,
    ySpeed: pieuwerState.axisY !== null
      ? pieuwerState.axisY === 0
        ? 0
        : guardNumber(pieuwerState.ySpeed + (yAcceleration * pieuwerState.axisY), maxYSpeed, minYSpeed)
      : pieuwerState.accelerateUp
        ? guardNumber(pieuwerState.ySpeed + yAcceleration, maxYSpeed, minYSpeed)
        : pieuwerState.accelerateDown
        ? guardNumber(pieuwerState.ySpeed - yAcceleration, maxYSpeed, minYSpeed)
        : pieuwerState.ySpeed < 0
        ? guardNumber(pieuwerState.ySpeed + yAcceleration, 0, minYSpeed)
        : pieuwerState.ySpeed > 0
        ? guardNumber(pieuwerState.ySpeed - yAcceleration, maxYSpeed, 0)
        : 0,

    angle: pieuwerState.axisX !== null
      ? pieuwerState.axisX === 0
        ? 0
        : guardNumber(pieuwerState.angle + (turnAcceleration * pieuwerState.axisX), maxAngle, minAngle)
      : pieuwerState.accelerateLeft
        ? guardNumber(pieuwerState.angle - turnAcceleration, maxAngle, minAngle)
        : pieuwerState.accelerateRight
        ? guardNumber(pieuwerState.angle + turnAcceleration, maxAngle, minAngle)
        : pieuwerState.angle < 0
        ? guardNumber(pieuwerState.angle + turnAcceleration, 0, minAngle)
        : pieuwerState.angle > 0
        ? guardNumber(pieuwerState.angle - turnAcceleration, maxAngle, 0)
        : 0,

    pos: {
      y: guardNumber(Math.round(pieuwerState.pos.y - pieuwerState.ySpeed), VIRT_HEIGHT, 0),
      x: guardNumber(Math.round(pieuwerState.pos.x + pieuwerState.angle * 0.2), VIRT_WIDTH, 0)
    }
});

const setPieuwerState = (pieuwerState : MultiPieuwerState, pieuwer : PieuwerKey, key : stateKey, val : boolean) : MultiPieuwerState => ({
    ...pieuwerState,
    [pieuwer] : {
      ...pieuwerState[pieuwer],
      [key]: val
    }
});

export default function(state : MultiPieuwerState, action : KeyAction) {
  if (typeof state === 'undefined') {
    return initialState;
  }
  switch (action.type) {
    case ActionTypes.AXIS_X_CHANGE:
      return {
          ...state,
          [action.player] : {
            ...state[action.player],
            axisX: action.axisForce
          }
      };
    case ActionTypes.AXIS_Y_CHANGE:
      return {
          ...state,
          [action.player] : {
            ...state[action.player],
            axisY: action.axisForce
          }
      };
    case ActionTypes.KEYUP:
      switch (action.key) {
        case PieuwerControl.UP:
          return setPieuwerState(state, action.player, "accelerateUp", false);
        case PieuwerControl.DOWN:
          return setPieuwerState(state, action.player, "accelerateDown", false);
        case PieuwerControl.LEFT:
          return setPieuwerState(state, action.player, "accelerateLeft", false);
        case PieuwerControl.RIGHT:
          return setPieuwerState(state, action.player, "accelerateRight", false);
        case PieuwerControl.SHOOT:
          return setPieuwerState(state, action.player, "shooting", false);
        default:
          return state;
      }

    case ActionTypes.KEYDOWN:
      switch (action.key) {
        case PieuwerControl.UP:
          return setPieuwerState(state, action.player, "accelerateUp", true);
        case PieuwerControl.DOWN:
          return setPieuwerState(state, action.player, "accelerateDown", true);
        case PieuwerControl.LEFT:
          return setPieuwerState(state, action.player, "accelerateLeft", true);
        case PieuwerControl.RIGHT:
          return setPieuwerState(state, action.player, "accelerateRight", true);
        case PieuwerControl.SHOOT:
          return setPieuwerState(state, action.player, "shooting", true);
        default:
          return state;
      }

    case ActionTypes.PIEUWER_COLLIDES:
      return {
          ...state,
          [action.player] : {
            ...state[action.player],
            collided: true
          }
      };
    case ActionTypes.UPDATE:
      return {
        pieuwerOne: updatePieuwerState(state.pieuwerOne),
        pieuwerTwo: updatePieuwerState(state.pieuwerTwo)
      };
    default:
      return state;
  }
}

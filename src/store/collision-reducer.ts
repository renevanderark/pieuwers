import { ActionTypes  } from "../actions/action-types";
import { AnyAction } from "redux";
import { VIRT_WIDTH, VIRT_HEIGHT } from "./constants";
import { KeyAction, BulletAction, ExplosionAction, CollisionAction } from "../actions/action-creators";
import { Point } from "../phyz/shapes";
import { PieuwerToEnemyCollisions } from "../phyz/collisions";



export interface MultiCollisionState {
  collisions: PieuwerToEnemyCollisions
}


const initialState : MultiCollisionState  = {
  collisions: {}
};


export default function(state : MultiCollisionState, action : CollisionAction) : MultiCollisionState {
  if (typeof state === 'undefined') {
    return initialState;
  }
  switch (action.type) {
    case ActionTypes.SET_COLLISIONS:
      return {
        collisions: action.collisions
      }
    case ActionTypes.UPDATE:
      return {
        collisions: {}
      };
    default:
      return state;
  }
}

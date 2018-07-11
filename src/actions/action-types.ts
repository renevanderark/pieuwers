import { AnyAction } from "redux";

export enum ActionTypes {
  KEYDOWN,
  KEYUP,
  UPDATE
}


export interface KeyAction extends AnyAction {
  type: ActionTypes,
  key: string
}

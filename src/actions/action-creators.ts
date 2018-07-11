import { Dispatch } from "redux";
import { KeyAction, ActionTypes } from "./action-types";

export const keyActionCreator = (dispatch : Dispatch<KeyAction>) => ({
  onKeyDown: (key : string) => dispatch({type: ActionTypes.KEYDOWN, key: key}),
  onKeyUp: (key : string) =>  dispatch({type: ActionTypes.KEYUP, key: key}),
});

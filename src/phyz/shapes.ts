import { PieuwerState } from "../store/pieuwer-reducer";
import { Thing } from "../store/thing";

export interface Point {
  x: number,
  y: number
}

export interface Box extends Point {
  w: number,
  h: number
}

export interface Circle extends Point {
  radius: number
}

export const isBox = <S extends Point>(shape : S) => 'w' in shape;
export const isCircle = <S extends Point>(shape : S) => 'radius' in shape;


export const getBoundingBox = (thing : Thing) : Box => ({
  x: -thing.size.x / 2,
  y: -thing.size.y / 2,
  w: thing.size.x,
  h: thing.size.y
});

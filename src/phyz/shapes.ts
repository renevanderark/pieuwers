import { PieuwerState } from "../store/pieuwer-reducer";

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


export const getBoundingBox = <S extends PieuwerState>(thing : S) : Box => ({
  x: -thing.size.x / 2,
  y: -thing.size.y / 2,
  w: thing.size.x,
  h: thing.size.y
});

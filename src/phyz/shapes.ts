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

export const isBox = (shape : Box|Circle) => 'w' in shape;
export const isCircle = (shape : Box|Circle) => 'radius' in shape;

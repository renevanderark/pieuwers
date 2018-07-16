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

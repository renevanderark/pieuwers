import { Box, Point } from "./shapes";

export const pointWithinBox : (p : Point, b: Box) => boolean = ({x, y}, {x : bL, y : bT, w, h}) =>
  x >= bL && x <= bL + w && y >= bT && y <= bT + h


export const boxesOverlap = (b1 : Box, b2: Box) : boolean  =>
    // b1 within b2?
    pointWithinBox({x: b1.x,        y: b1.y},        b2) || // topLeft
    pointWithinBox({x: b1.x + b1.w, y: b1.y},        b2) || // topRight
    pointWithinBox({x: b1.x,        y: b1.y + b1.h}, b2) || // bottomLeft
    pointWithinBox({x: b1.x + b1.w, y: b1.y + b1.h}, b2) || // bottomRight
    // b2 within b1?
    pointWithinBox({x: b2.x,        y: b2.y},        b1) || // topLeft
    pointWithinBox({x: b2.x + b2.w, y: b2.y},        b1) || // topRight
    pointWithinBox({x: b2.x,        y: b2.y + b2.h}, b1) || // bottomLeft
    pointWithinBox({x: b2.x + b2.w, y: b2.y + b2.h}, b1); // bottomRight

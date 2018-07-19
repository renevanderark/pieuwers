import { Box, Point } from "./shapes";

export const pointWithinBox : (p : Point, b: Box) => boolean = ({x, y}, {x : bL, y : bT, w, h}) =>
  x >= bL && x <= bL + w && y >= bT && y <= bT + h

export const getTr = (b : Box) : Point => ({x: b.x + b.w, y: b.y});
export const getBl = (b : Box) : Point => ({x: b.x, y: b.y + b.h});
export const getBr = (b : Box) : Point => ({x: b.x + b.w, y: b.y + b.h});

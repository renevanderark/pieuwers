import { Box, Point } from "./shapes";

export const pointWithinBox : (p : Point, b: Box) => boolean = ({x, y}, {x : bL, y : bT, w, h}) =>
  x >= bL && x <= bL + w && y >= bT && y <= bT + h

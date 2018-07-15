import { Point } from "./shapes";

export const translateToOrigin = (a : Point, b: Point) : Point => ({
  x: a.x - b.x,
  y: a.y - b.y
});

export const rotateAroundOrigin = (p : Point, angle : number) : Point => ({
  x: p.x * Math.cos(angle) - p.y * Math.sin(angle),
  y: p.x * Math.sin(angle) + p.y * Math.cos(angle)
});

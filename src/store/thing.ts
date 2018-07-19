import { Box, Circle, Point } from "../phyz/shapes";

export interface Thing {
  collisionShapes: Array<Box|Circle>
  angle: number
  pos: Point
  size: Point
  shooting: boolean
  health: number
  maxHealth: number
}

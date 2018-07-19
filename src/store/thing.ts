import { Box, Circle, Point } from "../phyz/shapes";

export enum FireType {
  BULLET = "BULLET",
  LASER = "LASER"
}

export interface Thing {
  collisionShapes: Array<Box|Circle>
  angle: number
  pos: Point
  size: Point
  fireType: FireType
  shooting: boolean
  health: number
  maxHealth: number
  shootTimer: number

}

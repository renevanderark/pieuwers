import { EnemyType } from "./types";
import { Point } from "../phyz/shapes";

export const ENEMY_BOUNDS : {[key:string] : Point} = {
  [EnemyType.SKULL]: {x: 100, y: 160},
  [EnemyType.ENEMY_TWO]: {x: 98, y: 80},
  [EnemyType.MULTI_LASER]: {x: 100, y: 60},
  [EnemyType.NAALDLASER]: {x: 142, y: 142}
}

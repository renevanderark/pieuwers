import { EnemyType } from "./types";
import { Point } from "../phyz/shapes";

export const ENEMY_BOUNDS : {[key:string] : Point} = {
  [EnemyType.SKULL]: {x: 100, y: 160},
  [EnemyType.SKULL_BOSS]: {x: 100, y: 160},
  [EnemyType.ENEMY_TWO]: {x: 100, y: 160},
}

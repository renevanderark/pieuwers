import { EnemyType } from "./types";
import { Circle, Box, isBox, Point } from "../phyz/shapes";
import { ENEMY_BOUNDS } from "./enemy-bounding-boxes";

const makeSkullShapes = (size : Point) : Array<Box|Circle> => [
  {
    x: (4 -  (ENEMY_BOUNDS[EnemyType.SKULL].x  / 2)) * (size.x / ENEMY_BOUNDS[EnemyType.SKULL].x),
    y: (63 - (ENEMY_BOUNDS[EnemyType.SKULL].y / 2)) * (size.x / ENEMY_BOUNDS[EnemyType.SKULL].x),
    w: 26 * (size.x / ENEMY_BOUNDS[EnemyType.SKULL].x),
    h: 95 * (size.x / ENEMY_BOUNDS[EnemyType.SKULL].x)
  },
  {
    x: (30 -  (ENEMY_BOUNDS[EnemyType.SKULL].x  / 2)) * (size.x / ENEMY_BOUNDS[EnemyType.SKULL].x),
    y: (63 - (ENEMY_BOUNDS[EnemyType.SKULL].y / 2)) * (size.x / ENEMY_BOUNDS[EnemyType.SKULL].x),
    w: 51 * (size.x / ENEMY_BOUNDS[EnemyType.SKULL].x),
    h: 82 * (size.x / ENEMY_BOUNDS[EnemyType.SKULL].x)
  },
  {
    x: (58 -  (ENEMY_BOUNDS[EnemyType.SKULL].x  / 2)) * (size.x / ENEMY_BOUNDS[EnemyType.SKULL].x),
    y: (42 - (ENEMY_BOUNDS[EnemyType.SKULL].y / 2)) * (size.x / ENEMY_BOUNDS[EnemyType.SKULL].x),
    radius: 40 * (size.x / ENEMY_BOUNDS[EnemyType.SKULL].x)
  },
  {
    x: (27 -  (ENEMY_BOUNDS[EnemyType.SKULL].x  / 2)) * (size.x / ENEMY_BOUNDS[EnemyType.SKULL].x),
    y: (50 - (ENEMY_BOUNDS[EnemyType.SKULL].y / 2)) * (size.x / ENEMY_BOUNDS[EnemyType.SKULL].x),
    radius: 20 * (size.x / ENEMY_BOUNDS[EnemyType.SKULL].x)
  }
];

const makeEnemyTwoShapes = (size : Point) : Array<Box|Circle> => [
  {x:-5,y:-55,radius: 65},
  {x:-74,y:-55,w: 135,h:150},
  {x:-165,y:58,w: 315,h:50},
  {x:-150,y:38,w: 285,h:20},
  {x:-135,y:18,w: 255,h:20},
  {x:-145,y:120,radius: 35},
  {x:130,y:120,radius: 35},
].map(shape => isBox(shape) ?
  {
    x: (shape.x / 4) * (size.x / ENEMY_BOUNDS[EnemyType.ENEMY_TWO].x),
    y: (shape.y / 4) * (size.x / ENEMY_BOUNDS[EnemyType.ENEMY_TWO].x),
    w: (shape.w / 4) * (size.x / ENEMY_BOUNDS[EnemyType.ENEMY_TWO].x),
    h: (shape.h / 4) * (size.x / ENEMY_BOUNDS[EnemyType.ENEMY_TWO].x)
  } :
  {
    x: (shape.x / 4) * (size.x / ENEMY_BOUNDS[EnemyType.ENEMY_TWO].x),
    y: (shape.y / 4) * (size.x / ENEMY_BOUNDS[EnemyType.ENEMY_TWO].x),
    radius: (shape.radius / 4) * (size.x / ENEMY_BOUNDS[EnemyType.ENEMY_TWO].x),
  }
)

export const makeEnemyCollisionShapes : {[key : string]: (size : Point) => Array<Box|Circle>}= {
  [EnemyType.SKULL]: makeSkullShapes,
  [EnemyType.SKULL_BOSS]: makeSkullShapes,
  [EnemyType.ENEMY_TWO]: makeEnemyTwoShapes
}

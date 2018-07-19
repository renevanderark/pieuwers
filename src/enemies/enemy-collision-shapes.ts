import { EnemyType } from "./types";
import { Circle, Box, isBox, Point } from "../phyz/shapes";
import { ENEMY_BOUNDS } from "./enemy-bounding-boxes";

const makeSkullShapes = (scale : number) : Array<Box|Circle> => [
  {
    x: (4 -  (ENEMY_BOUNDS[EnemyType.SKULL].x  / 2)) * scale,
    y: (63 - (ENEMY_BOUNDS[EnemyType.SKULL].y / 2)) * scale,
    w: 26 * scale,
    h: 95 * scale
  },
  {
    x: (30 -  (ENEMY_BOUNDS[EnemyType.SKULL].x  / 2)) * scale,
    y: (63 - (ENEMY_BOUNDS[EnemyType.SKULL].y / 2)) * scale,
    w: 51 * scale,
    h: 82 * scale
  },
  {
    x: (58 -  (ENEMY_BOUNDS[EnemyType.SKULL].x  / 2)) * scale,
    y: (42 - (ENEMY_BOUNDS[EnemyType.SKULL].y / 2)) * scale,
    radius: 40 * scale
  },
  {
    x: (27 -  (ENEMY_BOUNDS[EnemyType.SKULL].x  / 2)) * scale,
    y: (50 - (ENEMY_BOUNDS[EnemyType.SKULL].y / 2)) * scale,
    radius: 20 * scale
  }
];

const makeEnemyTwoShapes = (scale : number) : Array<Box|Circle> => [
  {
    x: -1.25,
    y: -13.75,
    radius: 16.25
  },
  {
    x: -18.5,
    y: -13.75,
    w: 33.75,
    h: 37.5
  },
  {
    x: -41.25,
    y: 14.5,
    w: 78.75,
    h: 12.5
  },
  {
    x: -37.5,
    y: 9.5,
    w: 71.25,
    h: 5
  },
  {
    x: -33.75,
    y: 4.5,
    w: 63.75,
    h: 5
  },
  {
    x: -36.25,
    y: 30,
    radius: 8.75
  },
  {
    x: 32.5,
    y: 30,
    radius: 8.75
  }
].map(shape => isBox(shape) ?
  {
    x: shape.x * scale,
    y: (shape.y-6) * scale,
    w: shape.w * scale,
    h: shape.h * scale
  } :
  {
    x: shape.x * scale,
    y: (shape.y-6) * scale,
    radius: shape.radius * scale,
  }
);


export const makeEnemyCollisionShapes : {[key : string]: (scale : number) => Array<Box|Circle>}= {
  [EnemyType.SKULL]: makeSkullShapes,
  [EnemyType.ENEMY_TWO]: makeEnemyTwoShapes,
  [EnemyType.MULTI_LASER]: (scale) => [
    {x: -37 * scale, y: -25 * scale, w: 32 * scale, h: 30 * scale},
    {x: -5 * scale, y: -28 * scale, w: 42 * scale, h: 34 * scale},
    {x: -10 * scale, y: 0, w: 20 * scale, h: 30 * scale},
    {x: 37 * scale, y: -20, w: 5 * scale, h: 13 * scale},
    {x: -38 * scale, y: 40, w: 4 * scale, h: 16 * scale},
    {x: -42 * scale, y: 40, w: 4 * scale, h: 11 * scale},
    {x: -46 * scale, y: 20, w: 4 * scale, h: 10 * scale},
    {x: -50 * scale, y: 0, w: 10 * scale, h: 4 * scale},
    {x: 37 * scale, y: -20, radius: 10 * scale},
    {x: 32 * scale, y: -14 * scale, radius: 14 * scale},
    {x: -16 * scale, y: 16 * scale, radius: 14 * scale},
    {x: 16 * scale, y: 14 * scale, radius: 12 * scale},
    {x: -33 * scale, y: -5, radius: 13 * scale},
  ]
}

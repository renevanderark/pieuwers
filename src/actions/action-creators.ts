import { Dispatch, AnyAction } from "redux";
import { ActionTypes } from "./action-types";
import { PieuwerControl, PieuwerKey, PieuwerState } from "../store/pieuwer-reducer";
import { EnemyState, EnemyType } from "../store/enemy-reducer";
import { Point } from "../phyz/shapes";
import { ENEMY_WIDTH, ENEMY_HEIGHT } from "../store/constants";
import { PieuwerToEnemyCollisions } from "../phyz/collisions";



const KeyboardToPlayerControlMap : {[key: string]: PieuwerKey } = {
  ArrowUp: "pieuwerOne",
  ArrowDown: "pieuwerOne",
  ArrowLeft: "pieuwerOne",
  ArrowRight: "pieuwerOne",
  "0": "pieuwerOne",
  w: "pieuwerTwo",
  s: "pieuwerTwo",
  a: "pieuwerTwo",
  d: "pieuwerTwo",
  c: "pieuwerTwo"
};

const KeyboardToPieuwerControlMap : {[key: string]: PieuwerControl} = {
  ArrowUp: PieuwerControl.UP,
  ArrowDown: PieuwerControl.DOWN,
  ArrowLeft: PieuwerControl.LEFT,
  ArrowRight: PieuwerControl.RIGHT,
  "0": PieuwerControl.SHOOT,
  w: PieuwerControl.UP,
  s: PieuwerControl.DOWN,
  a: PieuwerControl.LEFT,
  d: PieuwerControl.RIGHT,
  c: PieuwerControl.SHOOT
};

const GamepadToPieuwerControlMap : {[key: string]: PieuwerControl} = {
  a: PieuwerControl.SHOOT,
  up: PieuwerControl.UP,
  down: PieuwerControl.DOWN,
  left: PieuwerControl.LEFT,
  right: PieuwerControl.RIGHT,
};

export interface KeyAction  {
  type: ActionTypes
  key?: PieuwerControl
  player: PieuwerKey
  axisForce?: number
}

export interface BulletAction {
  type: ActionTypes
  xPos?: number
  yPos?: number
  trajectory?: number
  bulletIdx?: number
}

export interface EnemyAction {
  type: ActionTypes
  spawn?: EnemyState
  enemyIdx?: number
}

export interface ExplosionAction {
  type: ActionTypes,
  pos: Point
  size: number
}

export interface CollisionAction {
  type: ActionTypes
  collisions: PieuwerToEnemyCollisions
}


const makeEnemy = (type : EnemyType, xPos : number, yPos : number, size: Point, health? : number) : EnemyState => ({
  enemyType: type,
  accelerateLeft: false, accelerateRight: false,
  accelerateUp: false, accelerateDown: false,
  angle: 0, ySpeed: 0, shooting: false,
  axisX: null, axisY: null,
  size: size,
  collisionShapes: type === EnemyType.SKULL_BOSS ? [
    {
      x: (4 -  (ENEMY_WIDTH  / 2)) * (size.x / ENEMY_WIDTH),
      y: (63 - (ENEMY_HEIGHT / 2)) * (size.y / ENEMY_HEIGHT),
      w: 26 * (size.x / ENEMY_WIDTH),
      h: 95 * (size.y / ENEMY_HEIGHT)
    },
    {
      x: (30 -  (ENEMY_WIDTH  / 2)) * (size.x / ENEMY_WIDTH),
      y: (63 - (ENEMY_HEIGHT / 2)) * (size.y / ENEMY_HEIGHT),
      w: 51 * (size.x / ENEMY_WIDTH),
      h: 82 * (size.y / ENEMY_HEIGHT)
    },
    {
      x: (58 -  (ENEMY_WIDTH  / 2)) * (size.x / ENEMY_WIDTH),
      y: (42 - (ENEMY_HEIGHT / 2)) * (size.y / ENEMY_HEIGHT),
      radius: 40 * (size.x / ENEMY_WIDTH)
    },
    {
      x: (27 -  (ENEMY_WIDTH  / 2)) * (size.x / ENEMY_WIDTH),
      y: (50 - (ENEMY_HEIGHT / 2)) * (size.y / ENEMY_HEIGHT),
      radius: 20 * (size.x / ENEMY_WIDTH)
    }
  ] : [
    {x:-5,y:-55,radius: 65},
    {x:-74,y:-55,w: 135,h:150},
    {x:-165,y:58,w: 315,h:50},
    {x:-150,y:38,w: 285,h:20},
    {x:-135,y:18,w: 255,h:20},
    {x:-145,y:120,radius: 35},
    {x:130,y:120,radius: 35},

  ],
  health: health || 4, maxHealth: health || 4,
  pos: {y: yPos, x: xPos},
  collided: false
});

export const enemyActionCreator = (dispatch : Dispatch<EnemyAction|BulletAction>) => ({
  spawnEnemy: (type: EnemyType, xPos : number, yPos : number, size: Point, health? : number) => {
    dispatch({type: ActionTypes.SPAWN_ENEMY, spawn: makeEnemy(type, xPos, yPos, size, health)})
  },
  enemiesReceiveBullet: ({bulletIdx, enemies} : {bulletIdx : number, enemies: Array<number>}) => {
    enemies.forEach(enemyIdx => dispatch({type: ActionTypes.ENEMY_RECEIVES_BULLET, enemyIdx: enemyIdx, bulletIdx: bulletIdx}));
  }
});

export const explosionActionCreator = (dispatch : Dispatch<ExplosionAction>) => ({
  spawnExplosion: (pos : Point, size: number) => {
    dispatch({type: ActionTypes.SPAWN_EXPLOSION, pos: pos, size: size});
  }
})

export const bulletActionCreator = (dispatch : Dispatch<BulletAction>) => ({
  spawnBullet: (pieuwer : PieuwerState) =>  {
    if (pieuwer.shooting) {
      const trajectory = (pieuwer.angle - 90) * (Math.PI / 180);
      dispatch({
        type: ActionTypes.SPAWN_BULLET,
        xPos: pieuwer.pos.x + Math.cos(trajectory) * 120,
        yPos: pieuwer.pos.y + Math.sin(trajectory) * 120,
        trajectory: trajectory
      });
    }
  }
});

export const keyActionCreator = (dispatch : Dispatch<KeyAction>) => ({
  onKeyDown: (key : string) => dispatch({type: ActionTypes.KEYDOWN, key: KeyboardToPieuwerControlMap[key], player: KeyboardToPlayerControlMap[key]}),
  onKeyUp: (key : string) => dispatch({type: ActionTypes.KEYUP, key: KeyboardToPieuwerControlMap[key], player: KeyboardToPlayerControlMap[key]}),
  onGamePadButtonDown: (key : string, player : PieuwerKey) => dispatch({type: ActionTypes.KEYDOWN, key: GamepadToPieuwerControlMap[key], player: player}),
  onGamePadButtonUp: (key : string, player : PieuwerKey) => dispatch({type: ActionTypes.KEYUP, key: GamepadToPieuwerControlMap[key], player: player}),
});

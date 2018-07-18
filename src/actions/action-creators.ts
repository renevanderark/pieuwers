import { Dispatch, AnyAction } from "redux";
import { ActionTypes } from "./action-types";
import { PieuwerControl, PieuwerKey, PieuwerState } from "../store/pieuwer-reducer";
import { EnemyState } from "../store/enemy-reducer";
import { Point, isBox } from "../phyz/shapes";
import { PieuwerToEnemyCollisions } from "../phyz/collisions";
import { EnemyType } from "../enemies/types";
import { makeEnemyCollisionShapes } from "../enemies/enemy-collision-shapes";
import { makeEnemy } from "../enemies/enemy-creator";



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
  bulletType?: "bullets"|"enemyBullets"
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


export const enemyActionCreator = (dispatch : Dispatch<EnemyAction|BulletAction>) => ({
  spawnEnemy: (type: EnemyType, xPos : number, yPos : number, scale: number = 1, health? : number) => {
    dispatch({type: ActionTypes.SPAWN_ENEMY, spawn: makeEnemy(type, xPos, yPos, scale, health)})
  },
  enemiesReceiveBullet: ({bulletIdx, enemies} : {bulletIdx : number, enemies: Array<number>}) => {
    enemies.forEach(enemyIdx => {
      dispatch({type: ActionTypes.ENEMY_RECEIVES_BULLET, enemyIdx: enemyIdx, bulletIdx: bulletIdx});
    });
    dispatch({type: ActionTypes.REMOVE_BULLET, bulletType: "bullets", bulletIdx: bulletIdx});
  }
});

export const explosionActionCreator = (dispatch : Dispatch<ExplosionAction>) => ({
  spawnExplosion: (pos : Point, size: number) => {
    dispatch({type: ActionTypes.SPAWN_EXPLOSION, pos: pos, size: size});
  }
})

export const bulletActionCreator = (dispatch : Dispatch<BulletAction>) => ({
  spawnBullet: <T extends PieuwerState>(thing : T) =>  {
    if (thing.shooting) {
      const trajectory = ("enemyType" in thing ?  (thing.angle + 90) : (thing.angle - 90)) * (Math.PI / 180);
      dispatch({
        type: ActionTypes.SPAWN_BULLET,
        xPos: thing.pos.x + Math.cos(trajectory) * 120,
        yPos: thing.pos.y + Math.sin(trajectory) * 120,
        trajectory: trajectory,
        bulletType: "enemyType" in thing ? "enemyBullets" : "bullets"
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

import { EnemyState } from "../store/enemy-reducer";
import { EnemyType } from "./types";
import { Point } from "../phyz/shapes";
import { VIRT_HEIGHT, VIRT_WIDTH } from "../store/constants";

const flyBehaviours : {[key: string]: (enemyState : EnemyState, spawnCentral : Point) => EnemyState} = {
  [EnemyType.SKULL]: (enemyState, spawnCentral) => ({
    ...enemyState,
    pos: {
      x: spawnCentral.x - Math.cos(enemyState.angle * Math.PI / 180) * spawnCentral.x,
      y: spawnCentral.y + Math.sin(enemyState.angle / 3 * Math.PI / 180) * spawnCentral.y / 2
    },
    angle: enemyState.angle + 0.5 >= 360*3 ? 0 : enemyState.angle + 0.5
  }),
  [EnemyType.SKULL_SPAWN]: (enemyState, spawnCentral) => ({
    ...enemyState,
    pos: {
      x: spawnCentral.x - Math.cos(enemyState.angle * Math.PI / 180) * spawnCentral.x / 1.8,
      y: spawnCentral.y - Math.sin(enemyState.angle * Math.PI / 180) * spawnCentral.y / 1.1
    },
    angle: enemyState.angle + 0.5 >= 360*3 ? 0 : enemyState.angle + 0.5
  }),
  [EnemyType.SKULL_BOSS]: (enemyState, spawnCentral) => ({
    ...enemyState,
    pos: {
      x: enemyState.startPos.x + Math.cos(enemyState.trajectory * Math.PI / 180) * (VIRT_WIDTH / 8),
      y: spawnCentral.y,
    },
    trajectory: enemyState.trajectory + 0.5 >= 360 ? 0 : enemyState.trajectory + 0.5,
    shooting: enemyState.shootTimer <= 0 ? true : false,
    shootTimer: enemyState.shootTimer <= 0 ? 20 : enemyState.shootTimer - 1,
    angle: enemyState.angle - 0.5 <= 0 ? 360 : enemyState.angle - 0.5
  }),
  [EnemyType.ENEMY_TWO]: (enemyState, spawnCentral) => ({
    ...enemyState,
    pos: {
      x: enemyState.startPos.x + Math.cos(enemyState.trajectory * Math.PI / 180) * (VIRT_WIDTH / 4),
      y: spawnCentral.y - VIRT_HEIGHT / 3
    },
    trajectory: enemyState.trajectory + 0.5 >= 360 ? 0 : enemyState.trajectory + 0.5,
    shooting: enemyState.shootTimer <= 0 ? true : false,
    shootTimer: enemyState.shootTimer <= 0 ? 50 : enemyState.shootTimer - 1
  }),
  [EnemyType.MULTI_LASER]: (enemyState, spawnCentral) => ({
    ...enemyState
  })
}

export const fly = (enemyState : EnemyState, spawnCentral : Point) : EnemyState =>
  flyBehaviours[enemyState.enemyType](enemyState, spawnCentral);

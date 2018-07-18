import { EnemyState } from "../store/enemy-reducer";
import { VIRT_WIDTH, VIRT_HEIGHT } from "../store/constants";
import { EnemyType } from "./types";

export const fly = (enemyState : EnemyState) : EnemyState => ({
  ...enemyState,
  collided: false,
  pos: enemyState.enemyType === EnemyType.SKULL ? {
    x: VIRT_WIDTH/2 - Math.cos(enemyState.angle*4 * Math.PI / 180) * VIRT_WIDTH / 2,
    y: VIRT_HEIGHT/2 - Math.sin(enemyState.angle * Math.PI / 180) * VIRT_WIDTH / 5
  } : {
    x: VIRT_WIDTH/2,
    y: VIRT_HEIGHT/2 -Math.sin(enemyState.angle*4 * Math.PI / 180) * VIRT_WIDTH / 5
  },
  angle: enemyState.angle + 0.1 >= 360 ? 0 : enemyState.angle + 0.1
});

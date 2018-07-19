import { EnemyType } from "./enemies/types";
import { VIRT_WIDTH, VIRT_HEIGHT } from "./store/constants";
import { EnemySpawnParams } from "./enemies/enemy-creator";
import { FlyBehaviour } from "./enemies/enemy-fly-behaviours";
import { Point } from "./phyz/shapes";
import { FireType } from "./store/thing";

const mkSkull = (health : number, flyBehaviour? : FlyBehaviour, scale? : number) : EnemySpawnParams => ({
  type: EnemyType.SKULL,
  flyBehaviour: flyBehaviour || FlyBehaviour.DefensiveSlides,
  pos: {x: VIRT_WIDTH / 2, y: -VIRT_HEIGHT / 3},
  scale: scale || 0.75,
  health:  health,
  fireType: FireType.BULLET
});

const mkEnemy2 = (health : number, pos: Point) : EnemySpawnParams => ({
  type: EnemyType.ENEMY_TWO,
  flyBehaviour: FlyBehaviour.HorizontalQuarterHover,
  pos: pos,
  scale: 1,
  health:  health,
  fireType: FireType.BULLET
});

const mkMultiLaser = (health : number, pos: Point) : EnemySpawnParams => ({
  type: EnemyType.MULTI_LASER,
  flyBehaviour: FlyBehaviour.PointAtClosestPieuwer,
  pos: pos,
  scale: 2,
  health:  health,
  fireType: FireType.LASER
});

export const level1 = (spawnEnemy : (p : EnemySpawnParams) => void) => [
  () => {
    for (let i = 0; i < 16; i++) {
      setTimeout(() => spawnEnemy(mkSkull(5)), i * 250);
    }
  },
  () => {
    for (let i = 0; i < 12; i++) {
      setTimeout(() => spawnEnemy(mkSkull(10)), i * 250);
    }
    for (let i = 0; i < 4; i++) {
      spawnEnemy(mkEnemy2(5, {x: (VIRT_WIDTH / 8) + i * (VIRT_WIDTH / 4), y: -VIRT_HEIGHT / 3}));
    }
  },
  () => {
    for (let i = 0; i < 12; i++) {
      setTimeout(() => spawnEnemy(mkSkull(20)), i * 250);
    }
    spawnEnemy(mkMultiLaser(150, {x: VIRT_WIDTH / 2 - VIRT_WIDTH / 4, y: -VIRT_HEIGHT / 3}));
    spawnEnemy(mkMultiLaser(150, {x: VIRT_WIDTH / 2 + VIRT_WIDTH / 4, y: -VIRT_HEIGHT / 3}));
  },
  () => {
    for (let i = 0; i < 15; i++) {
      setTimeout(() => spawnEnemy(mkSkull(30, FlyBehaviour.ClockWiseFlyAround)), i * 500);
    }
    spawnEnemy(mkSkull(300, FlyBehaviour.SlowShootingClockWiseTurnAbout, 3));
  }
];

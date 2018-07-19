import { EnemyState } from "../store/enemy-reducer";
import { EnemyType } from "./types";
import { Point } from "../phyz/shapes";
import { VIRT_HEIGHT, VIRT_WIDTH } from "../store/constants";
import { getClosestPoint } from "../phyz/shape-ops";

export enum FlyBehaviour {
  DoNothing = "DoNothing",
  DefensiveSlides = "DefensiveSlides",
  ClockWiseFlyAround = "ClockWiseFlyAround",
  SlowShootingClockWiseTurnAbout = "SlowShootingClockWiseTurnAbout",
  HorizontalQuarterHover = "HorizontalQuarterHover",
  PointAtClosestPieuwer = "PointAtClosestPieuwer"
};

const flyBehaviours : {[key in FlyBehaviour]: (enemyState : EnemyState, spawnCentral : Point, pieuwerPositions : Array<Point>) => EnemyState} = {
  [FlyBehaviour.DefensiveSlides]: (enemyState, spawnCentral, pieuwerPositions) => ({
    ...enemyState,
    pos: {
      x: spawnCentral.x - Math.cos(enemyState.angle * Math.PI / 180) * spawnCentral.x,
      y: spawnCentral.y + Math.sin(enemyState.angle / 3 * Math.PI / 180) * spawnCentral.y / 2
    },
    angle: enemyState.angle + 0.5 >= 360*3 ? 0 : enemyState.angle + 0.5
  }),
  [FlyBehaviour.ClockWiseFlyAround]: (enemyState, spawnCentral, pieuwerPositions) => ({
    ...enemyState,
    pos: {
      x: spawnCentral.x - Math.cos(enemyState.angle * Math.PI / 180) * spawnCentral.x / 1.8,
      y: spawnCentral.y - Math.sin(enemyState.angle * Math.PI / 180) * spawnCentral.y / 1.1
    },
    angle: enemyState.angle + 0.5 >= 360*3 ? 0 : enemyState.angle + 0.5
  }),
  [FlyBehaviour.SlowShootingClockWiseTurnAbout]: (enemyState, spawnCentral, pieuwerPositions) => ({
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
  [FlyBehaviour.HorizontalQuarterHover]: (enemyState, spawnCentral, pieuwerPositions) => ({
    ...enemyState,
    pos: {
      x: enemyState.startPos.x + Math.cos(enemyState.trajectory * Math.PI / 180) * (VIRT_WIDTH / 4),
      y: spawnCentral.y - VIRT_HEIGHT / 3
    },
    trajectory: enemyState.trajectory + 0.5 >= 360 ? 0 : enemyState.trajectory + 0.5,
    shooting: enemyState.shootTimer <= 0 ? true : false,
    shootTimer: enemyState.shootTimer <= 0 ? 50 : enemyState.shootTimer - 1
  }),
  [FlyBehaviour.DoNothing]: (enemyState, spawnCentral, pieuwerPositions) => ({
    ...enemyState
  }),
  [FlyBehaviour.PointAtClosestPieuwer]: (enemyState, spawnCentral, pieuwerPositions) => {
    const target = getClosestPoint(enemyState.pos, pieuwerPositions[0], pieuwerPositions[1]);
    const withinFiringRange = enemyState.pos.y > enemyState.size.y / 2 &&
      target.x >= enemyState.pos.x - 30 && target.x <= enemyState.pos.x + 30;

    return {
      ...enemyState,
      pos: {
        x:  enemyState.pos.y > enemyState.size.y / 2
          ? target.x >= enemyState.pos.x - 30 && target.x <= enemyState.pos.x + 30
            ? enemyState.pos.x
            : target.x < enemyState.pos.x
            ?  enemyState.pos.x - 2
            : enemyState.pos.x + 2
          : enemyState.pos.x,
        y:  spawnCentral.y - VIRT_HEIGHT / 3
      },
      shooting: withinFiringRange && enemyState.shootTimer <= 0 ? true : false,
      shootTimer: withinFiringRange
        ? enemyState.shootTimer <= 0 ? 0  : enemyState.shootTimer - 1
        : 100
    }
  }
}

export const fly = (enemyState : EnemyState, spawnCentral : Point, pieuwerPositions: Array<Point>) : EnemyState =>
  flyBehaviours[enemyState.flyBehaviour](enemyState, spawnCentral, pieuwerPositions);

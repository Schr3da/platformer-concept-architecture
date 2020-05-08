import {IPhysicObstacleDto} from "../../../../dto/entity";
import {IObstacles} from "../../../../dto/state/obstacles";
import {ArrowConfig, CharacterConfig} from "../../../config";

export const initObstacles = (
  ids: string[] 
): IObstacles => ({
  arrows: Array.from({
    length: (ids || []).length* CharacterConfig.maxArrows
  }).map((_, index) => createArrow(index)),
});

export const createArrow = (index: number): IPhysicObstacleDto => ({
  id: "arrow_" + index, 
  visible: false,
  action: {
    active: false,
    start: 0,
    value: 0,
    end: 2
  },
  frame: {
    x: 0,
    y: 0,
    width: ArrowConfig.size.width,
    height: ArrowConfig.size.height,
  },
  origin: {
    x: 0.5,
    y: 0.5,
  },
  physics: {
    isEnabled: false,
    isGrounded: false,
    velocity: ArrowConfig.velocity,
  },
});

export const initArrowAt = (
  arrows: IPhysicObstacleDto[],
  x: number,
  y: number,
): IPhysicObstacleDto[] => {
  const match = (arrows || []).find((a) => a.visible === false); 
  
  if (match == null) {
    return arrows;
  }

  match.visible = true;
  match.frame = {...match.frame, x, y};
  return [...arrows]; 
};


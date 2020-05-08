import {IActionDto, IFrameDto, IPointDto} from "../base";
import {IPhysicDto} from "../physic";
import {IGridDto} from "../state/tile";

export enum Directions {
  neutral,
  left,
  right,
}

export enum OuterDisplayRange {
  none,
  top,
  left,
  right, 
  bottom,
}

export interface ICharacterActions {
  move: IActionDto;
  jump: IActionDto;
  shoot: IActionDto;
  aiming: IActionDto;
}

export interface ICharacterDto {
  id: string;
  actions: ICharacterActions; 
  frame: IFrameDto;
  grid: IGridDto;
  origin: IPointDto;
  direction: Directions;
  physics: IPhysicDto; 
  arrows: ICharacterArrowsDto;
}

export interface ICharacterArrowsDto {
  limit: number;
  available: number;
}

export interface IObstacleDto {
  id: string;
  frame: IFrameDto;
  origin: IPointDto;
}
 
export interface IPhysicObstacleDto extends IObstacleDto{
  visible: boolean;
  action: IActionDto;
  physics: IPhysicDto;
}

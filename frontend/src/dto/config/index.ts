import {IPointDto, ISizeDto} from "../base";

export interface ICoreConfig {
  debugEnabled: boolean;
  display: ISizeDto;
  tile: {
    size: ISizeDto;
    scale: IPointDto;
    origin: IPointDto;
  };
}

export interface ICharacterConfig {
  gravity: number;
  maxArrows: number; 
  size: ISizeDto;
  velocity: IPointDto;
}

export interface IArrowConfig {
  size: ISizeDto;
  gravity: number;
  velocity: IPointDto;
}

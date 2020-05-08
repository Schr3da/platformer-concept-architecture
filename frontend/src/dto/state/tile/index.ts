import {IFrameDto, IPointDto, ISizeDto} from "../../base";

export interface ITileDto {
  grid: IPointDto;
  frame: IFrameDto;
  origin: IPointDto;
  symbol: string;
  isStatic: boolean;
}

export interface IGridDto {
  position: IPointDto;
  size: ISizeDto;
}

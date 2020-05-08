export interface IPointDto {
  x: number;
  y: number;
}

export interface ISizeDto {
  width: number;
  height: number;
}

export interface IFrameDto {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface IActionDto {
  active: boolean;
  value: number;
  start: number;
  end: number;
}

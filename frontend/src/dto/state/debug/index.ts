import {IFrameDto} from "../../base";

export enum DebugIds {
  bottom,
  left,
  right,
  top,
}

export interface IDebugState {
  [id: string]: IFrameDto | null;
}

import {IPointDto} from "../base";

export interface IPhysicDto {
  isEnabled: boolean;
  isGrounded: boolean;
  velocity: IPointDto;
}

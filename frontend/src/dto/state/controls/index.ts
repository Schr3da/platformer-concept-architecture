export interface IControllerSettings {
  up: number;
  left: number;
  right: number;
  down: number;
  jump: number;
  shoot: number;
}

export interface IControllerDto {
  inputs: {[key: number]: boolean};
  settings: IControllerSettings;
}

export interface IControllerStates {
  [id: string]: IControllerDto;
}

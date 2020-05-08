export enum ResourceKeys {
  altas = "atlas",
  player = "player",
}

export interface IResources {
  atlas: string;
  player: string;
}

export const Resources: IResources = { 
  atlas: "../../../assets/png/tiles.png",
  player: "../../../assets/png/player.png"
};

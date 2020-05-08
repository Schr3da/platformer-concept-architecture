import {IPointDto, ISizeDto} from "../../dto/base";
import {IArrowConfig, ICharacterConfig, ICoreConfig} from "../../dto/config";

export const CoreConfig: ICoreConfig = {
  debugEnabled: false,
  display: {width: 800, height: 600},
  tile: {
    size: {width: 8, height: 8},
    scale: {x: 3, y: 3},
    origin: {x: 0.5, y: 0.5}
  }
};

export const debugTileSize = () => ({
  x: 0, y: 0, ...absoluteTileSize(), 
});

export const CharacterConfig: ICharacterConfig = {
  size: {width: 22, height: 46},
  maxArrows: 3, 
  gravity: 6,
  velocity: {x: 4, y: 2},
};

export const ArrowConfig: IArrowConfig = {
  size: {width: 12, height: 6},
  gravity: 2,
  velocity: {x: 8, y: 0},
};

export const absoluteTileSize = (): ISizeDto => ({
  width: CoreConfig.tile.size.width * CoreConfig.tile.scale.x,
  height: CoreConfig.tile.size.height * CoreConfig.tile.scale.y, 
});

export const maximalTiles = (): IPointDto => {
  const size = absoluteTileSize();
  return {
    x: Math.ceil(CoreConfig.display.width / size.width),
    y: Math.ceil(CoreConfig.display.height / size.height),
  };
};

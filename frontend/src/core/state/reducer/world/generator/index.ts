import {Templates} from "..";
import {IPointDto} from "../../../../../dto/base";
import {ITileDto} from "../../../../../dto/state/tile";
import {absoluteTileSize, CoreConfig} from "../../../../config";
import {StaticSymbols} from "../templates";

export type SerializedTemplate = ITileDto[][];

const convertTemplate = (
  template: string[][],
  itemsPerRow: number
): SerializedTemplate => {

  if (template == null) {
    return [];
  }

  const itemsPerColumn = template.length;
  const objects: SerializedTemplate = Array(itemsPerColumn); 

  for (let y=0; y<itemsPerColumn; y++) {
      objects[y] = Array(itemsPerRow);
    for(let x=0; x<itemsPerRow; x++) {
      objects[y][x] = createTileDto(template[y][x], x, y); 
    }
  }

  return objects;
};

export const generateWorld = () => {
  const sample = Templates.jungleLevel();
  return convertTemplate(sample.data, sample.length);
};

export const createTileDto = (
  symbol: string,
  x: number,
  y: number,
): ITileDto => {
  const {width, height} = absoluteTileSize(); 
  const isStatic = isStaticTile(symbol);
  
  const frame = {
    x: x * width,
    y: y * height,
    width, 
    height
  };
  
  const origin = {
    x: CoreConfig.tile.origin.x,
    y: CoreConfig.tile.origin.y,
  };

  const grid = {
    x, y,
  };

  return {frame, grid, isStatic, origin, symbol};
};

const isStaticTile = (symbol: string) =>
  StaticSymbols.find((s) => symbol === s) != null;

export const hasStaticTile = (tiles: ITileDto[]): boolean => 
  (tiles || []).some((t) => t.isStatic === true);

export const getStaticTile = (tiles: ITileDto[]): ITileDto | undefined => 
  (tiles || []).find((t) => t.isStatic === true);

export const hasTiles = (
  world: ITileDto[][],
  index: IPointDto[],
) => index.some((i) => i != null && hasTileAtIndex(world, i.x, i.y));

export const hasTileAtIndex = (
  world: SerializedTemplate,
  x: number,
  y: number
) =>  
  x !== -1 &&
  y !== -1 &&
  world != null && 
  world.length !== 0 &&
  world[y] != null &&
  world[y][x] != null;

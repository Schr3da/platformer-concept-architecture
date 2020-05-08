import {IFrameDto, IPointDto, ISizeDto} from "../../../../dto/base";
import {ICharacterDto} from "../../../../dto/entity";
import {IGridDto, ITileDto} from "../../../../dto/state/tile";
import {absoluteTileSize, maximalTiles} from "../../../config";
import {hasTileAtIndex} from "../../reducer/world/generator";

const tileSize = absoluteTileSize();
const maxTiles = maximalTiles(); 

export const toTileSize = (
  frame: IFrameDto,
): ISizeDto => ({
  width: Math.ceil(frame.width / tileSize.width), 
  height: Math.ceil(frame.height / tileSize.height),
});

export const toGridPosition = (
  obj: {frame: IFrameDto} 
): IPointDto => ({
  x: Math.floor(obj.frame.x / tileSize.width),
  y: Math.floor(obj.frame.y / tileSize.height),
});

export const toTileCoordinates = (
  character: ICharacterDto,
): IPointDto[] => {
  const points: IPointDto[] = [];
  const start = toGridPosition(character);  

  const endX = start.x + character.grid.size.width - 1;
  const endY = start.y + character.grid.size.height - 1;

  for (let x = start.x; x <= endX; x++) {
    if (x > maxTiles.x) {
      continue;
    }

    for (let y = start.y; y <= endY; y++) {
      if (y > maxTiles.y) {
        continue;
      }
      
      points.push({x, y});
    }
  }
  return points; 
};

export const belowTiles = (
  data: ITileDto[][],
  obj: {grid: IGridDto, frame: IFrameDto} 
): ITileDto[] => {

  const tiles: ITileDto[] = [];
  const indexY = obj.grid.position.y + obj.grid.size.height;
  
  const startX = obj.grid.position.x;
  const endX = startX + obj.grid.size.width + 1; 
 
  for (let x = startX; x < endX; x++) {
    if (hasTileAtIndex(data, x, indexY) === false) {
      continue;
    }
    
    tiles.push(data[indexY][x]);
  }

  return tiles; 
};

export const leftTiles = (
  data: ITileDto[][],
  character: ICharacterDto, 
): ITileDto[] => {

  const tiles: ITileDto[] = [];
  const indexX = character.grid.position.x;
  
  const startY = character.physics.isGrounded === false ? character.grid.position.y + 1 : character.grid.position.y;
  const endY = startY + character.grid.size.height;

  for (let y = startY; y < endY; y++) {
    if (hasTileAtIndex(data, indexX, y) === false) {
      continue;
    }
    
    tiles.push(data[y][indexX]);
  }
  return tiles; 
};

export const topTiles = (
  data: ITileDto[][],
  obj: {grid: IGridDto, frame: IFrameDto} 
): ITileDto[] => {

  const tiles: ITileDto[] = [];
  const indexY = obj.grid.position.y;
  
  const startX = obj.grid.position.x;
  const endX = startX + obj.grid.size.width + 1; 
 
  for (let x = startX; x < endX; x++) {
    if (hasTileAtIndex(data, x, indexY) === false) {
      continue;
    }
    
    tiles.push(data[indexY][x]);
  }

  return tiles; 
};

export const rightTiles = (
  data: ITileDto[][],
  character: ICharacterDto,
): ITileDto[] => {

  const tiles: ITileDto[] = [];
  const indexX = character.grid.position.x + 1;
  
  const startY =  character.physics.isGrounded === false ? character.grid.position.y + 1 : character.grid.position.y;
  const endY = startY + character.grid.size.height;

  for (let y = startY; y < endY; y++) {
    if (hasTileAtIndex(data, indexX, y) === false) {
      continue;
    }
    
    tiles.push(data[y][indexX]);
  }
  return tiles; 
};


import {Generator} from "../../core/state/reducer/world";
import {ICharacterDto, IPhysicObstacleDto} from "../../dto/entity";
import {ITileDto} from "../../dto/state/tile";
import {ISerializedTiles,  tileTextureToSprite} from "../tiles";

import {
  Container,
  DisplayObject,
  Graphics,
  Rectangle,
  Sprite,
} from "pixi.js";

const canvasFrame = (): Rectangle => {
  const {width, height} = window.app.view;
  return new Rectangle(0, 0, width, height);
};

const createCanvasContainer = (): Container => {
  const frame = canvasFrame();  
  const container = new Container();
  container.x = frame.x;
  container.y = frame.y;
  container.width = frame.width;
  container.height = frame.height;
  
  return container;
};

export const worldToDisplayObject = (
  world: ITileDto[][],
  tiles: ISerializedTiles, 
) => {
  const container = createCanvasContainer();  

  world.forEach((row) => {
    row.forEach(({symbol, frame}) => {
      const tile = tiles[symbol] == null ? tiles["13"] : tiles[symbol] ;
      const sprite = tileTextureToSprite(tile); 
      sprite.x = frame.x;
      sprite.y = frame.y;
     
      sprite.anchor.x = 0.5;
      container.addChild(sprite);
    });
  });
  
  return container;
};

export const createCharacter = (dto: ICharacterDto, texture: PIXI.Texture) => {
  const sprite = new Sprite(texture);
  sprite.width = dto.frame.width;
  sprite.height = dto.frame.height;
  sprite.anchor.x = 0.5;
  sprite.x = dto.frame.x;
  sprite.y = dto.frame.y;
  
  return sprite;
};

export const createArrow = (
  dto: IPhysicObstacleDto,
  _: PIXI.Texture,
) => {
  const frame = dto.frame;
  const graphic = new Graphics();  
  
  graphic.beginFill(0x0000ff);
  graphic.lineStyle(0);
  graphic.drawRect(-frame.width * 0.5, 0, frame.width, frame.height);
  graphic.name = dto.id;
  graphic.endFill();
  graphic.visible = dto.visible;

  return graphic;
};

export const findDisplayObject = (children: DisplayObject[], name: string) => 
  (children || []).find((c) => c.name === name);

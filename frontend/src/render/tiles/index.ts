import {Point, Rectangle, Sprite, Texture} from "pixi.js";
import {CoreConfig} from "../../core";

export interface ISerializedTiles {
  [id: string]: Texture;
}

export const scaledAtlasTileSize = () => ({
  width: CoreConfig.tile.size.width * CoreConfig.tile.scale.x,
  height: CoreConfig.tile.size.height * CoreConfig.tile.scale.y,
});

export const createAtlasTiles = (texture: Texture) => 
  createTileTexturesFrom(texture, CoreConfig.tile.size.width, CoreConfig.tile.size.height);

export const createTileTexturesFrom = (
  texture: Texture, 
  tileWidth: number,
  tileHeight: number,
): ISerializedTiles => {
  if (texture == null) {
    return {};
  }

  const {width, height} = texture;
  const rows = width / tileWidth;
  const columns = height / tileHeight;
  const tiles: any = {};

  for (let y=0; y<columns; y++) {
    for (let x=0; x<rows; x++) {
      const id = y * rows + x; 
      const tex = texture.clone();
      tex.frame = new Rectangle(x*tileWidth, y*tileHeight, tileWidth, tileHeight);
      tiles[id] = tex;    
    }
  }

  return tiles;
};

export const tileTextureToSprite = (
  texture: Texture,
) => {
  const {tile} = CoreConfig;
  const sprite = Sprite.from(texture);  
  sprite.scale = new Point(tile.scale.x, tile.scale.y);
  
  return sprite;
};

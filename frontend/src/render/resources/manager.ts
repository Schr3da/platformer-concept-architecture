import {Loader, LoaderResource, Texture} from "pixi.js";

import {createAtlasTiles, ISerializedTiles} from "../tiles";
import {IResources, ResourceKeys} from "./config";

export interface IAddResource {
  name: string;
  url: string;
}

type LoadedResource = Partial<Record<string, LoaderResource>>;

export class ResourceManager {
  
  private loader: Loader = new Loader(); 
  private willDestroy: boolean = false;
  private resources: Partial<Record<string, LoaderResource>> | null = null;
  private tiles: ISerializedTiles | null = null;

  public add(res: IResources) {
    (Object.keys(res || {}) as Array<keyof IResources>)
      .forEach((k) => this.loader.add(k, res[k]));
  }

  public load(): Promise<LoadedResource> {
    return new Promise((resolve, reject) => {
      if (this.willDestroy === true) {
        return reject();
      }

      this.loader.load((_, res) => {
        this.resources = this.willDestroy ? null : res;
        this.willDestroy ? reject() : resolve(res);
      });
    });
  }

  public getTiles(): ISerializedTiles {
    if (this.tiles == null) {
      const texture = this.getTextureForKey(ResourceKeys.altas);
      this.tiles = createAtlasTiles(texture);
    }
    return this.tiles;
  }

  public destory() {
    this.willDestroy = true;
    this.destroyTiles();
    this.loader.destroy();
    this.resources = null;
  }

  public getTextureForKey(key: ResourceKeys): Texture {
    if (this.resources == null) {
      throw new Error("No resources available");
    }
    const res = this.resources[key];
    if (res == null) {
      throw new Error("Resource for key does not exist " + key);
    }
    
    return res.texture;
  }

  private destroyTiles() {
    Object.keys(this.tiles || {}).forEach((k) => {
      const item = this.tiles![k];
      item.destroy();
    });
    this.tiles = null;
  }

}

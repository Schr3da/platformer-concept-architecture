import * as PIXI from "pixi.js";

import {State} from "../core";
import {Directions} from "../dto/entity";
import {IStateDto} from "../dto/state";
import {ControlManager} from "./controls";
import {handleDebug} from "./debug";
import {ResourceKeys, ResourceManager, Resources} from "./resources";
import {createArrow, createCharacter, worldToDisplayObject} from "./scene";

PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

export const init = async (
  element: HTMLBodyElement | HTMLElement
): Promise<GameView> => {
  const view = new GameView(element);
  await view.load();
  view.prepare();
  view.start();
  return view;
};

class GameView {

  private state: State | null = null; 

  private controls: ControlManager | null = null;

  private updateTicker: PIXI.Ticker = PIXI.Ticker.shared;
  
  private manager: ResourceManager = new ResourceManager();

  private players: {[id: string]: PIXI.Sprite | null} = {}; 

  private arrows: {[id: string]: PIXI.Sprite | PIXI.Graphics | null} = {}; 

  private app: PIXI.Application = new PIXI.Application({
    backgroundColor: 0x00000000,
  });

  constructor(element: HTMLBodyElement | HTMLElement) {
    element.append(this.app.view);
    window.app = this.app;
  }

  public async load() {
    this.manager.add(Resources);
    await this.manager.load();
  }

  public prepare() {
    this.state = new State();
    this.state.subscribe("application", this.receivedStateUpdate);
    
    const current = this.state.getCurrent(); 
    const tiles = this.manager.getTiles();
    const toAdd = worldToDisplayObject(current.world, tiles);
    this.app.stage.addChild(toAdd);
  }

  public start() {
    if (this.state == null) {
      throw new Error("No application state available. Did you call prepare()");
    }

    if (this.controls != null) {  
      this.controls.destroy();
    }
    
    this.controls = new ControlManager({
      onKeyUp: this.state.keyUp,
      onKeyDown: this.state.keyDown,
      onMouseOut: this.state.mouseout,
    });
    
    this.updateTicker.add(this.handleTickUpdate);
    this.updateTicker.start();
  }

  public destroy() { 
    if (this.controls != null) {
      this.controls.destroy();
    }
    
    this.stop();
    this.updateTicker.destroy();
    this.manager.destory();
    this.app.destroy(true);
  }

  private stop() {
    this.updateTicker.autoStart = false;
    this.updateTicker.stop();
  }

  private handleTickUpdate = () => {
    if (this.state == null) {
      return;
    }

    const deltaTime = this.updateTicker.deltaMS / 1000;
    this.state.tickUpdate(deltaTime);
  }

  private receivedStateUpdate = (next: IStateDto) => {
    this.handleCharacters(next);
    this.handleArrows(next);
    handleDebug(next);
  }

  private handleCharacters(next: IStateDto) {
    Object.keys(next.characters || {}).forEach((key) => {
      const dto = next.characters[key];
      
      if (dto == null && this.players[key] != null) {
        this.players[key]!.destroy(); 
        this.players[key] = null;
        return;
      }
      
      if (dto != null && this.players[key] == null) {
        const texture = this.manager.getTextureForKey(ResourceKeys.player);
        const newPlayer = createCharacter(dto, texture);
        this.players[key] = newPlayer; 
        this.app.stage.addChild(newPlayer);
      }
    
      const player = this.players[key];
      if (player == null || dto == null) {
        throw new Error("player is null = check business logic");
      }

      player.x = dto.frame.x;
      player.y = dto.frame.y;
      
      if (player.scale.x > 0 && dto.direction === Directions.left) {
        player.scale.x *= -1;
      } else if (player.scale.x < 0 && dto.direction === Directions.right) {
        player.scale.x *= -1;
      }
    });
  }

  private handleArrows(next: IStateDto) {
    next.obstacles.arrows.forEach((a) => {
      if (a == null) {
        return;
      }

      const key = a.id;
      const arrow = this.arrows[key];

      if (arrow == null) {
        const texture = this.manager.getTextureForKey(ResourceKeys.player);
        const arrowToAdd = createArrow(a, texture);
        this.arrows[key] = arrowToAdd; 
        this.app.stage.addChild(arrowToAdd);
        return;
      }

      arrow.visible = a.visible;
      arrow.x = a.frame.x;
      arrow.y = a.frame.y;
    });
  }

}

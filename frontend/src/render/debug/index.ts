import {Graphics} from "pixi.js";

import {IFrameDto} from "../../dto/base";
import {IStateDto} from "../../dto/state";
import {findDisplayObject} from "../scene";

export const handleDebug = (state: IStateDto) => {
  const debug = state.debug;
  const keys = Object.keys(state.debug);
  
  if (keys.length === 0) {
    return;
  }
 
  const stage = window.app.stage;
  keys.forEach((k) => {
    const data = debug[k];
    const match = findDisplayObject(stage.children, k);  
   
    if (match == null && data == null) {
      return;
    }

    if (match == null && data != null) {
      const sprite = createDebugRect(k, data);
      stage.addChild(sprite);
      return;
    }

    if (match == null) {
      return;
    }

    if (data == null) {
      match.x = -window.innerWidth;
      match.y = -window.innerHeight;
    }

    if (data != null) {
      match.x = data.x;
      match.y = data.y;
    }
  });
};

const createDebugRect = (
  name: string,
  frame: IFrameDto
) => {
  const graphic = new Graphics();  
  graphic.beginFill(0xff00ff);
  graphic.lineStyle(0);
  graphic.drawRect(-frame.width * 0.5, 0, frame.width, frame.height);
  graphic.alpha = 0.3;
  graphic.name = name;
  graphic.endFill();
  
  return graphic;
};


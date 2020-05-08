import * as Render from "./render";

import "./index.less";

declare global {
  interface Window { 
    app: PIXI.Application; 
  }
}

Render.init(document.body);


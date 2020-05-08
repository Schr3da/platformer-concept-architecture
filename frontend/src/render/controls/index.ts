
export type KeyboardControlCb = (code: number) => void;

export interface IControlManagerProps {
  onKeyUp: KeyboardControlCb; 
  onKeyDown: KeyboardControlCb; 
  onMouseOut: () => void;
}

export class ControlManager {

  private props: IControlManagerProps;

  constructor(props: IControlManagerProps) {
    this.props = props; 
    this.init();
  }

  public destroy() {
    window.removeEventListener("keydown", this.handleKeyDown);
    window.removeEventListener("keyup", this.handleKeyUp);
    window.removeEventListener("mouseout", this.handleMouseOut);
  }

  private init() {
    window.addEventListener("keydown", this.handleKeyDown);
    window.addEventListener("keyup", this.handleKeyUp);
    window.addEventListener("mouseout", this.handleMouseOut);
  } 
  
  private handleMouseOut = () => {
    this.props.onMouseOut(); 
  }

  private handleKeyDown = (e: KeyboardEvent) => {
    this.props.onKeyDown(e.keyCode);
  }
  
  private handleKeyUp = (e: KeyboardEvent) => {
    this.props.onKeyUp(e.keyCode);
  }

}

import {IStateDto} from "../../dto/state";
import {initialState, reducer} from "./reducer";
import {defaultController} from "./reducer/controls";
import {findSubscriber, ISubscriber, SubscriberCb} from "./subscriber";

export type Subscriptions = Array<ISubscriber<IStateDto>>;
export type SubscriptionCb = SubscriberCb<IStateDto>;

export class State {

  private p1 = "player_1";

  private defaultTime = 0.016;
  private previous: IStateDto;
  private current: IStateDto;
  private subscriptions: Subscriptions;

  constructor(state: IStateDto = initialState(["player_1"])) {
    this.previous = state;
    this.current = state;
    this.subscriptions = [];
  }

  public getCurrent(): IStateDto {
    return this.current;
  }

  public subscribe(id: string | number, cb: SubscriptionCb) {
    const match = findSubscriber(this.subscriptions, id); 
    if (match != null) {
      console.error("Component with id already subscibed ", id);
      return;
    }
    this.subscriptions.push({id, cb}); 
  }

  public tickUpdate = (time: number) => {
    this.update(this.current, time);
  }

  public mouseout = () => {
    this.update({...this.current,
      controls: {...this.current.controls,
        [this.p1]: defaultController(),      
      },
    }, this.defaultTime);
  }

  public keyDown = (code: number) => {
    
    if (this.hasSameValue(code, true)) {
      return;
    }

    const controls = this.current.controls[this.p1];
    if (controls == null) {
      return;
    }

    const inputs = {...controls.inputs};
    inputs[code] = true;
   
    this.current = {...this.current,
      controls: {...this.current.controls,
        [this.p1]: {...controls, inputs},
      }
    }; 
  }

  public keyUp = (code: number) => {
    if (this.hasSameValue(code, false)) {
      return;
    }

    const controls = this.current.controls[this.p1];
    if (controls == null) {
      return;
    }

    const inputs = {...controls.inputs};
    inputs[code] = false;

    this.current = {...this.current,
      controls: {...this.current.controls,
        [this.p1]: {...controls, inputs},
      }
    }; 
  }

  private hasSameValue(code: number, next: boolean) {
    const controls = this.current.controls[this.p1];
    if (controls == null) {
      return false;
    }
    return controls.inputs[code] === next;
  }

  private update(state: IStateDto, time: number) {
    this.previous = this.current;
    this.current = reducer(state, time);
    this.subscriptions.forEach((s) => 
      s.cb(this.current, this.previous)
    );
  }

}

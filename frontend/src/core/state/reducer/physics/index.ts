import {IStateDto} from "../../../../dto/state";
import {characterPhysics} from "./character";
import {obstaclePhysics} from "./obstacle";

export const physicsReducer = (state: IStateDto, time: number) => {
  let nextState = characterPhysics(state, time);
  nextState = obstaclePhysics(nextState, time); 
  return nextState;
};

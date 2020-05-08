import {IStateDto} from "../../../dto/state";
import {initialCharacters} from "./character";
import {controlsReducer, intialControllerState} from "./controls";
import {debugReducer, initialDebugState} from "./debug";
import {initObstacles} from "./obstacles";
import {physicsReducer} from "./physics";
import {Generator} from "./world";

export const initialState = (ids: string[]): IStateDto => {
  const characters = initialCharacters(ids);
  const controls = intialControllerState(ids);
  const debug = initialDebugState();
  const obstacles = initObstacles(ids);
  const world = Generator.generateWorld();
  
  return {
    characters,
    controls,
    debug,
    obstacles,
    world,
  };
};

export const reducer = (state: IStateDto, time: number): IStateDto => {
  let nextState = controlsReducer(state, time);
  nextState = physicsReducer(nextState, time);
  nextState = debugReducer(nextState);
  return nextState;  
};

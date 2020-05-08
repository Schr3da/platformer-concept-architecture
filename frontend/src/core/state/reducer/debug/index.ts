import {IFrameDto} from "../../../../dto/base";
import {IStateDto} from "../../../../dto/state";
import {IDebugState} from "../../../../dto/state/debug";
import {ITileDto} from "../../../../dto/state/tile";
import {CoreConfig} from "../../../config";
import {belowTiles, leftTiles, rightTiles} from "../../utils/grid";

export const initialDebugState = (): IDebugState => ({});

export const debugReducer = (
  state: IStateDto,
) => {
  if (CoreConfig.debugEnabled === false) {
    return state;
  }

  const next = debugCharacters(state);
  return next;
};

export const debugCharacters = (
  state: IStateDto
): IStateDto => {
  const {debug, characters} = state;
  
  const next = Object.keys(characters).reduce((result, id) => {
    const match = characters[id];
    if (match == null) {
      return result;
    }
  
    let nextResult = result; 
    nextResult[id] = match.frame;  
    nextResult = handleInteraction(nextResult, id + "_b_",  belowTiles(state.world, match));
    nextResult = handleInteraction(nextResult, id + "_l_",  leftTiles(state.world, match));
    nextResult = handleInteraction(nextResult, id + "_r_",  rightTiles(state.world, match));

    return nextResult;
  }, {...debug});

  return {...state, debug: next};
};

const handleInteraction = (
  debug: IDebugState,
  id: string,
  data: ITileDto[],
): IDebugState => {
  if (data.length === 0) {
    return debug;
  }

  return data.reduce((result, b, i) => {
    const key = id + i;
    const frame = b.frame;
    return addDebug(result, key, frame);       
  }, {...debug});
};

const addDebug = (
  debug: IDebugState,
  id: string,
  frame: IFrameDto,
): IDebugState => {
  const next = {...debug};
  next[id] = frame;
  return next;
};

const removeDebug = (
  state: IStateDto,
  id: string,
) => {
  const debug = {...state.debug};
  debug[id] = null;
  return {...state, debug};
};

import {ICharacters} from "./character";
import {IControllerStates} from "./controls";
import {IDebugState} from "./debug";
import {IObstacles} from "./obstacles";
import {ITileDto} from "./tile";

export interface IStateDto {
  world: ITileDto[][]; 
  controls: IControllerStates; 
  debug: IDebugState;
  characters: ICharacters;
  obstacles: IObstacles;  
}

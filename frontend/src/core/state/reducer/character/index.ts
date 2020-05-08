import {IPointDto} from "../../../../dto/base";
import {Directions, ICharacterDto} from "../../../../dto/entity";
import {ICharacters} from "../../../../dto/state/character";
import {absoluteTileSize, CharacterConfig} from "../../../config";
import {toGridPosition, toTileSize} from "../../utils/grid";
import {defaultAimingAction, defaultJumpAction, defaultMoveAction, defaultShootAction} from "../actions";

export const initialCharacters = (
  ids: string[]
): ICharacters => ids.reduce((
  characters: ICharacters, 
  id: string
) => {
  if (id == null) {
    return characters;
  }
  
  const initGridPosition = {x: 2, y:1}; 
  characters[id] = initalPlayerState(id, initGridPosition);
  
  return characters;
}, {});

export const initalPlayerState = (
  id: string,
  gridPosition: IPointDto
): ICharacterDto => {
  const character = CharacterConfig;
  const tileSize = absoluteTileSize();

  const direction = Directions.neutral;

  const frame = {
    x: tileSize.width * gridPosition.x,
    y: tileSize.height * gridPosition.y,
    width: character.size.width,
    height: character.size.height,
  };

  const origin = {
    x: 0.5, 
    y: 0,
  };

  const physics = {
    isEnabled: true,
    isGrounded: false,
    velocity: {
      x: 0,
      y: 0,
    },
  };

  const grid = {
    position: gridPosition,
    size: {...toTileSize(frame)}
  };

  const actions = {
    aiming: defaultAimingAction(false),
    move: defaultMoveAction(),
    jump: defaultJumpAction(false),
    shoot: defaultShootAction(false),
  };

  const arrows = {
    limit: CharacterConfig.maxArrows,
    available: CharacterConfig.maxArrows, 
  };

  return {
    id,
    actions,
    arrows,
    direction, 
    frame, 
    grid, 
    origin,
    physics,
  };
};

export const translateX = (
  character: ICharacterDto,
  value: number,
) => setPositionX(character, character.frame.x + value);

export const setPositionX = (
  character: ICharacterDto,
  value: number,
) => {
  const next = {...character,
    frame: {...character.frame, x: value}
  };
  return updateGridPosition(next);
};

export const translateY = (
  character: ICharacterDto,
  value: number,
) => setPositionY(character, character.frame.y + value);

export const setPositionY = (
  character: ICharacterDto,
  value: number,
) => {
  const next = {...character,
    frame: {...character.frame, y: value}
  };
  return updateGridPosition(next);
};

export const updateGridPosition = (
  character: ICharacterDto,
) => ({...character,
  grid: {...character.grid,
    position: toGridPosition(character),
  },
});

export const updateGrounded = (
  character: ICharacterDto,
  isGrounded: boolean,
):ICharacterDto => ({...character,
  physics: {...character.physics,
    isGrounded,
  },
});

export const addArrows = (
  character: ICharacterDto,
  arrows: number,
): ICharacterDto => setArrows(character, character.arrows.available + arrows); 

export const removeArrows = (
  character: ICharacterDto,
  arrows: number,
): ICharacterDto => setArrows(character, character.arrows.available - arrows); 

export const setArrows = (
  character: ICharacterDto,
  arrows: number,
): ICharacterDto => ({ ...character,
  arrows: {...character.arrows,
    available: arrows < 0 || arrows > character.arrows.limit ? character.arrows.limit : arrows,
  },
});

export const isJumping = (
  character: ICharacterDto,
): boolean => character.actions.jump.active;

export const isMoving = (
  character: ICharacterDto,
): boolean => character.actions.move.active;

export const isAiming = (
  character: ICharacterDto,
): boolean => character.actions.aiming.active;

export const isShooting = (
  character: ICharacterDto,
): boolean => character.actions.shoot.active;

export const hasArrows = (
  character: ICharacterDto,
): boolean => character.arrows.available > 0;

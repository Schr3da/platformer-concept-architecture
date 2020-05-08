import {CoreConfig} from "../../../..";
import {Directions, ICharacterDto, OuterDisplayRange} from "../../../../../dto/entity";
import {IStateDto} from "../../../../../dto/state";
import {ICharacters} from "../../../../../dto/state/character";
import {IDebugState} from "../../../../../dto/state/debug";
import {ITileDto} from "../../../../../dto/state/tile";
import {CharacterConfig} from "../../../../config";
import {isVisibleOnScreenX, isVisibleOnScreenY} from "../../../utils/frame";
import {belowTiles, leftTiles, rightTiles, topTiles} from "../../../utils/grid";
import {jumpActionUpdate, resetJumpAction} from "../../actions";
import {isAiming, isJumping, isMoving, setPositionX, setPositionY, translateX, translateY, updateGrounded} from "../../character";
import {getStaticTile, hasStaticTile} from "../../world/generator";

type ReducerCharacterCb = (
  c: ICharacterDto, 
) => ICharacterDto; 

const tolerance = 0.01;

export const characterPhysics = (
  state: IStateDto,
  time: number,
): IStateDto => {
  const characters = reduceCharacters(state, (character) => {
    let next = handleGravity(state, character, time);
    next = handleJump(state, next, time);
    next = handleMovement(state, next);
    
    return next;
  });
  
  return createState(state, characters);
};

const createState = (
  state: IStateDto,
  characters: ICharacters,
  debug?: IDebugState,
): IStateDto => ({
  ...state,
  debug: debug == null ? state.debug : debug,
  characters,
});

const reduceCharacters = (
  state: IStateDto,
  cb: ReducerCharacterCb, 
) => {
  const characters = state.characters;
  return Object.keys(characters).reduce((result, key) => {
    const c = result[key];
    if (c == null) {
      return result;
    }
    result[key] = cb(c);
    return result;
  }, {...characters});
};

const getVelocityX = (
  character: ICharacterDto
): number => {
  if (isMoving(character) === false) {
    return 0;
  }

  const action = character.actions.move;
  const value = action.value / action.end * CharacterConfig.velocity.x;
  
  return Math.round(value * 10) / 10;
};

const getVelocityY = (
  character: ICharacterDto,
  time: number
): number => {
  if (isJumping(character) === false) {
    return CharacterConfig.gravity + Math.round(CharacterConfig.gravity * time);
  }

  const value = CharacterConfig.velocity.y;
  return -value;
};

const handleMovement = (
  state: IStateDto,
  character: ICharacterDto,
) => {
  if (
    isMoving(character )=== false ||
    isAiming(character) === true
  ) {
    return character;
  }

  const isVisibleY = isVisibleOnScreenY(character);
  if (isVisibleY === OuterDisplayRange.top || isVisibleY === OuterDisplayRange.bottom) {
    return character; 
  }

  let next = {...character}; 
  const isVisibleX = isVisibleOnScreenX(next);

  if (isVisibleX === OuterDisplayRange.left) {
    next = setPositionX(next, CoreConfig.display.width);
    return next;
  }

  if (isVisibleX === OuterDisplayRange.right) {
    next = setPositionX(next, 0);
    return next;
  }

  const velocity = getVelocityX(next);
  next.physics.velocity.x = velocity;

  let tiles: ITileDto[] = [];
  if (next.direction === Directions.left) {
    next = translateX(next, -next.physics.velocity.x);
    tiles = leftTiles(state.world, next);
  }

  if (next.direction === Directions.right) {
    next = translateX(next, next.physics.velocity.x);
    tiles = rightTiles(state.world, next);
  }

  if (hasStaticTile(tiles)) {
    const tile = getStaticTile(tiles);  
    if (tile == null) {
      throw new Error("tile is null in handleGravity");
    }

    if (Directions.left === next.direction) {
      return setPositionX(next, tile.frame.x + tile.frame.width + tolerance);
    } else if (Directions.right === next.direction) {
      return setPositionX(next, tile.frame.x - character.frame.width - 2 - tolerance);
    }
  }

  return next; 
};

const handleGravity = (
  state: IStateDto,
  character: ICharacterDto,
  time: number,
) => {
  if (isJumping(character)) {
    return character;
  }

  let next = updateGrounded(character, false); 
  const isVisibleY = isVisibleOnScreenY(next);

  if (isVisibleY === OuterDisplayRange.top) {
    next = setPositionY(next, CoreConfig.display.height);
    return next;
  }

  if (isVisibleY === OuterDisplayRange.bottom) {
    next = setPositionY(next, -next.frame.height);
    return next;
  }

  const velocity = getVelocityY(next, time); 
  next.physics.velocity.y = velocity;
  
  next = translateY(next, next.physics.velocity.y);

  const tiles = belowTiles(state.world, next);
  if (hasStaticTile(tiles)) {
    if (character.physics.isGrounded === true) {
      return character;
    }

    const tile = getStaticTile(tiles);  
    if (tile == null) {
      throw new Error("tile is null in handleGravity");
    }

    next = updateGrounded(character, true);
    return setPositionY(next, tile.frame.y - next.frame.height - tolerance);
  }

  return next;
};

const handleJump = (
  state: IStateDto,
  character: ICharacterDto,
  time: number,
) => {
  
  if (isJumping(character) === false) {
    return character;
  }
  
  let next = {...character};
  const isVisibleY = isVisibleOnScreenY(next);

  const tiles = topTiles(state.world, next);
  if (hasStaticTile(tiles)) {
    return resetJumpAction(next);
  }

  if (isVisibleY === OuterDisplayRange.top) {
    next = setPositionY(next, CoreConfig.display.height);
    return next;
  }

  if (isVisibleY === OuterDisplayRange.bottom) {
    next = setPositionY(next, -next.frame.height);
    return next;
  }

  const velocity = getVelocityY(next, time); 
  next.physics.velocity.y = velocity;
 
  next = jumpActionUpdate(next, time);
  next = translateY(next, velocity);
  
  return next;
};


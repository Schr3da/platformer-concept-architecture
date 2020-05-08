import {Directions, ICharacterDto} from "../../../../dto/entity";
import {IStateDto} from "../../../../dto/state";
import {IControllerStates} from "../../../../dto/state/controls";
import {hasArrows, isAiming, isShooting} from "../character";
import {initArrowAt} from "../obstacles";

import {
  aimingAction,
  jumpAction,
  moveAction,
  moveActionUpdate,
  resetAimingAction,
  resetMoveAction,
  resetShootAction,
  shootAction,
} from "../actions";

export const intialControllerState = (
  ids: string[]
): IControllerStates => ids.reduce((
  controllers: IControllerStates,
  id: string
) => {
  if (id === null) {
    return controllers;
  }

  controllers[id] = defaultController();
  return controllers;
}, {});

export const defaultController = () => ({
  inputs: {},
  settings: {
    up: 87,
    left: 65,
    right: 68,
    down: 83,
    jump: 188, 
    shoot: 190,
  },
});

export const controlsReducer = (
  state: IStateDto, 
  time: number
): IStateDto => {
  let nextState = state;
  
  Object.keys(nextState.characters).forEach((id) => {
    const character = nextState.characters[id]; 
    const controller = nextState.controls[id];

    if (character == null || controller == null) {
      return;
    }

    const settings = controller.settings;

    if (isPressed(nextState, id, settings.shoot)) {
      nextState = handleAiming(nextState, id);
      return;
    } 

    let nextDto = {...character};
 
    if (
      isPressed(nextState, id, settings.shoot) === false &&
      isAiming(nextDto) === true
    ) { 
      nextDto = resetAimingAction(nextDto);
      nextState = handleShoot(nextState, id, nextDto);
      return;
    }

    if (
      isPressed(nextState, id, settings.shoot) === false &&
      isAiming(nextDto) === false && isShooting(nextDto)
    ) {
      nextDto = resetShootAction(nextDto);
    }

    if (
      isPressed(nextState, id, settings.jump) && 
      nextDto.physics.isGrounded
    ) {
      nextDto = jumpAction(nextDto);
    }

    if (isNeutralX(nextState, id)) {
      nextDto = resetMoveAction(nextDto);
      nextState = createState(nextState, id, nextDto);
      return;
    }

    if (isPressed(nextState, id, settings.left)) {
      nextDto = moveAction(nextDto);
      nextDto = handleMovement(Directions.left, nextDto, time);
    }

    if (isPressed(nextState, id, settings.right)) {
      nextDto = handleMovement(Directions.right, nextDto, time);
      nextDto = moveAction(nextDto);
    }

    if (
      isPressed(nextState, id, settings.left) === false && 
      isPressed(nextState, id, settings.right) === false
    ) {
      nextDto = resetMoveAction(nextDto);
    }

    nextState = createState(nextState, id, nextDto);

  });

  return nextState;
};

const createState = (
  state: IStateDto,
  id: string,
  dto: ICharacterDto,
) => {
  return {...state, 
    characters: {
      ...state.characters,
      [id]: dto,
    },
  };
};

const isNeutralX = (state: IStateDto, id: string): boolean => 
  isPressed(state, id, state.controls[id].settings.left) && 
  isPressed(state, id, state.controls[id].settings.right);

const isPressed = (
  state: IStateDto,
  id: string,
  key: number,
): boolean => 
  state.controls[id] != null &&
  state.controls[id].inputs[key] === true;

const handleMovement = (
  direction: Directions,
  character: ICharacterDto,
  time: number,
) => {
  const next = moveActionUpdate(character, time);
  next.direction = direction;
  return next;
};

const handleAiming = (
  state: IStateDto,
  id: string,
) =>  {
  const dto = state.characters[id];
  if (dto == null) {
    return state;
  }

  if (isAiming(dto) === true) {
    return state;
  }

  if (hasArrows(dto) === false) {
    return state;
  }

  const nextDto = aimingAction(dto); 
  
  return createState(state, id, nextDto);
};

const handleShoot = (
  state: IStateDto,
  id: string,
  dto: ICharacterDto,
) => {
  
  if (dto == null || id == null) {
    return state;
  }

  if (isShooting(dto)) {
    return state;
  }

  if (hasArrows(dto) === false) {
    return state;
  }

  const nextDto = shootAction(dto);
  const frame = nextDto.frame;
  
  const nextState = {...state,
    obstacles: {...state.obstacles,
      arrows: initArrowAt(state.obstacles.arrows, frame.x, frame.y),
    },
  };

  return createState(nextState, id, nextDto);
};

import {IActionDto} from "../../../../dto/base";
import {Directions, ICharacterDto} from "../../../../dto/entity";
import {CharacterConfig} from "../../../config";
import {removeArrows} from "../character";

export const defaultMoveAction = (): IActionDto => ({
  active: false,
  value: 0,
  start: 0,
  end: 1.5,
});

export const moveAction = (
  character: ICharacterDto
): ICharacterDto => {
  
  if (character.actions.move.active) {
    return character;
  }
  
  return {...character, 
    actions: {...character.actions,
      move: {...defaultMoveAction(),
        active: true,
      },
    },
    physics: {...character.physics,
      velocity: {...character.physics.velocity,
        x: 0,
      },
    }
  };
};

export const moveActionUpdate = (
  character: ICharacterDto,
  time: number,
) => {
  const next = {...character};
  const action = {...next.actions.move};

  action.value = endReached(time, action) === false ? action.value + time : action.end;
  next.actions.move = action;
  
  return next;
};

export const resetMoveAction = (
  character: ICharacterDto,
): ICharacterDto => ({...character,
  direction: Directions.neutral,
  physics: {...character.physics,
    velocity: {...character.physics.velocity,
      x: 0,
    }
  },
  actions: {...character.actions,
    move: defaultMoveAction(),
  }
});

export const defaultJumpAction = (
  active: boolean
) => ({
  active,
  value: 0,
  start: 0,
  end: CharacterConfig.velocity.y,
});

export const jumpAction = (
  character: ICharacterDto,
): ICharacterDto => {
  if (character.actions.jump.active) {
    return character;
  }

  return {...character,
    physics: {...character.physics,
      isGrounded: false,
      velocity: {...character.physics.velocity,
        y: 0,
      }
    },
    actions: {...character.actions,
      jump: defaultJumpAction(true),
    }
  };
};

export const jumpActionUpdate = (
  character: ICharacterDto,
  time: number,
): ICharacterDto => {
  const next = {...character};
  const action = {...next.actions.jump};

  action.value = action.value + time;
  action.active = endReached(time, action) ? false : true;  
  
  next.actions.jump = action;
  
  return next;
};

export const resetJumpAction = (
  character: ICharacterDto,
): ICharacterDto => ({...character,
  physics: {...character.physics,
    velocity: {...character.physics.velocity,
      y: 0,
    }
  },
  actions: {...character.actions,
    jump: defaultJumpAction(false),
  }
});

export const shootAction = (
  character: ICharacterDto
): ICharacterDto => removeArrows({...character,
  actions: {...character.actions,
    move: defaultMoveAction(),
    shoot: defaultShootAction(true), 
  },
}, 1);

export const resetShootAction = (
  character: ICharacterDto,
): ICharacterDto => ({...character,
  actions: {...character.actions,
    shoot: defaultShootAction(false),
  }
});

export const defaultShootAction = (
  active: boolean
) => ({
  active,
  value: 0,
  start: 0,
  end: 0,
});

export const resetAimingAction = (
  character: ICharacterDto,
): ICharacterDto => ({...character,
  actions: {...character.actions,
    aiming: defaultAimingAction(false),
  }
});

export const defaultAimingAction = (active: boolean): IActionDto => ({
  active,
  value: 0,
  start: 0,
  end: 0,
});

export const aimingAction = (
  character: ICharacterDto,
): ICharacterDto => ({...character,
  actions: {...character.actions,
    move: defaultMoveAction(),
    aiming: defaultAimingAction(true),
  }
});

export const endReached = (
  value: number,
  action: IActionDto,
) => action.start + action.value + value >= action.end;

export const limitReached = (
  value: number,
  action: IActionDto,
) => value > action.end;

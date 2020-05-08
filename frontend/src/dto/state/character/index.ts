import {ICharacterDto} from "../../entity";

export interface ICharacters {
  [id: string]: ICharacterDto | null;
}

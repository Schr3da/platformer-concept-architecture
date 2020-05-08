import {CoreConfig} from "../../..";
import {IFrameDto} from "../../../../dto/base";
import {OuterDisplayRange} from "../../../../dto/entity";

export const isVisibleOnScreenX = (
  o: {frame: IFrameDto} 
): OuterDisplayRange => {
  if (o.frame.x + o.frame.width < 0) {
    return OuterDisplayRange.left;
  }

  if (o.frame.x > CoreConfig.display.width) {
    return OuterDisplayRange.right;
  }
  
  return OuterDisplayRange.none;
};

export const isVisibleOnScreenY = (
  o: {frame: IFrameDto}
): OuterDisplayRange => {
   
  if (o.frame.y + o.frame.height < 0) {
    return OuterDisplayRange.top;
  }

  if (o.frame.y > CoreConfig.display.height) {
    return OuterDisplayRange.bottom; 
  }

  return OuterDisplayRange.none;
};

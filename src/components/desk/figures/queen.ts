import Figure, { IPatternPropperties } from './root';
import Bishop from './bishop';
import Rook from './rook';

export default class Queen extends Figure {
  static patternsPropperties: IPatternPropperties = {
    isSingle: false,
    patterns: [
      ...Bishop.patternsPropperties.patterns,
      ...Rook.patternsPropperties.patterns,
    ]
  }

  get patternsPropperties() { return Queen.patternsPropperties };
}
import Figure, { IPatternPropperties, IGamePosition, Coordinate } from './root';
import Bishop from './bishop';
import Rook from './rook';

// TODO: Need add castling
export default class King extends Figure {
  public isMovedEarly = false;
  static patternsPropperties: IPatternPropperties = {
    isSingle: true,
    patterns: [
      ...Bishop.patternsPropperties.patterns,
      ...Rook.patternsPropperties.patterns,
    ]
  }

  get patternsPropperties() { return King.patternsPropperties };
}
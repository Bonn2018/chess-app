import Figure, { IPatternPropperties } from './root';

export default class Rook extends Figure {
  public name = 'rook';
  static patternsPropperties: IPatternPropperties = {
    isSingle: false,
    patterns: [
      [0, 1],
      [1, 0],
      [-1, 0],
      [0, -1],
    ]
  }

  get patternsPropperties() { return Rook.patternsPropperties };
}
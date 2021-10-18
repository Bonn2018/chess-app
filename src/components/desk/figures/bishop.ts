import Figure, { IPatternPropperties } from './root';

export default class Bishop extends Figure {
  public name = 'bishop';
  static patternsPropperties: IPatternPropperties = {
    isSingle: false,
    patterns: [
      [-1, 1],
      [1, -1],
      [1, 1],
      [-1, -1],
    ]
  }

  get patternsPropperties(): IPatternPropperties  { return Bishop.patternsPropperties };
}
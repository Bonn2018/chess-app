import Figure, { IPatternPropperties } from './root';

export default class Horse extends Figure {
  public name = 'knight'
  static get patternsPropperties(): IPatternPropperties  {
    return {
      isSingle: true,
      patterns: [
        [1, 2],
        [1, -2],
        [-1, 2],
        [-1, -2],
        [2, 1],
        [2, -1],
        [-2, 1],
        [-2, -1],
      ]
    }
  }

  get patternsPropperties(): IPatternPropperties  { return Horse.patternsPropperties };
}

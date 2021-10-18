import { Coordinate, IGamePosition, deepCopyArray, getPositionValue, isValidCoordinate, Color } from '../helpers';

function getCoordinatesByPattern(c: Coordinate, pattern: Coordinate, koef: number): Coordinate {
  return [c[0] + (koef * pattern[0]), c[1] + (koef * pattern[1])]
}

interface IFigureProps {
  position: Coordinate;
  color: Color;
}

export interface IPatternPropperties {
  patterns: Coordinate[];
  isSingle: boolean;
}

export default class Figure {
  public position: Coordinate;
  public status: 'active' | 'died';
  public color: IFigureProps['color'];
  public isMovedEarly = false;
  public name = 'figure';
  public history: Coordinate[] = [];

  static patternsPropperties: IPatternPropperties = { patterns: [], isSingle: true };

  get patternsPropperties(): IPatternPropperties  { return Figure.patternsPropperties };

  constructor(props: IFigureProps) {
    this.status = 'active';
    this.color = props.color;
    this.position = props.position;
    this.history.push(props.position);
  }

  validateNewPosition(gamePosition: IGamePosition, c: Coordinate) {
    const allowedPosition = this.getAllowedPositions(gamePosition);
    const isValid = allowedPosition.some(position => position[0] === c[0] && position[1] === c[1]);

    if (!isValid) {
      throw new Error('This move is not valid');
    }

    return true;
  }

  setPosition(gamePosition: IGamePosition, c: Coordinate): IGamePosition {
    this.validateNewPosition(gamePosition, c);

    const deskCopy = deepCopyArray(gamePosition.desk);

    this.isMovedEarly = true;
    deskCopy[c[0]][c[1]] = this;
    deskCopy[this.position[0]][this.position[1]] = 0;

    this.position = c;
    this.history.push(c);

    return { desk: deskCopy, lastMove: [this.position, c] };
  }

  back() {
    this.history.pop();
    this.position = this.history[this.history.length - 1];
  }

  public getAllowedPositions(gamePosition: IGamePosition): Coordinate[] {
    return this.buildMovesByPattern(gamePosition);
  }

  public getProtectedPositions(gamePosition: IGamePosition): Coordinate[] {
    return this.buildMovesByPattern(gamePosition, true);
  }

  buildMovesByPattern(gamePosition: IGamePosition, includeProtectedPositions: boolean = false) {
    const { patterns, isSingle } = this.patternsPropperties;
    const result: Coordinate[] = [];

    for (let i = 0; i < patterns.length; i += 1) {
      // Build line by pattern until the board ends or a figure is encountered
      const pattern = patterns[i];
      let isContinue = true;
      let koef = 1;

      while (isContinue) {
        const applicant = getCoordinatesByPattern(this.position, pattern, koef);
        const isValid = !includeProtectedPositions ?
          this.isAllowedPosition(gamePosition, applicant) :
          isValidCoordinate(applicant);

        if (isValid) {
          result.push(applicant);

          const positionValue = getPositionValue(gamePosition, applicant);

          // Only when position empty we can continue "moveline"
          if (!positionValue && !isSingle) {
            koef += 1;

            continue;
          }
        }

        isContinue = false;
      }

    }

    return result;
  }

  public getFightPositions(gamePosition: IGamePosition): Coordinate[] {
    return this.getAllowedPositions(gamePosition);
  }

  // TODO: Is not works for Pawn
  // Validate position according to his value.
  // Return "false" if coordinate staying outside of the desk or has a figure with the same color
  isAllowedPosition(gamePosition: IGamePosition, c: Coordinate) {
    if (!isValidCoordinate(c)) return false;

    const value = getPositionValue(gamePosition, c);
    const isPositionEmpty = !value;
    const isPositionHasSeparateFigure = !!value && value.color !== this.color;

    return isPositionEmpty || isPositionHasSeparateFigure;
  }
}

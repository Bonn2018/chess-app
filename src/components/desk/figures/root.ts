
export type Coordinate = [number, number];

type PositionValue = Figure | 0;

type Line = [PositionValue, PositionValue, PositionValue, PositionValue, PositionValue, PositionValue, PositionValue, PositionValue];
export type Desk = [Line, Line, Line, Line, Line, Line, Line, Line];

export interface IGamePosition {
  lastMove?: [Coordinate, Coordinate];
  desk: Desk;
}

export function getPositionValue(gamePosition: IGamePosition, c: Coordinate) {
  return gamePosition.desk[c[0]][c[1]];
}

export function isValidCoordinate([x, y]: Coordinate) {
  return x >= 0 &&  x < 8 && y >= 0 && y < 8;
}

function deepCopyArray<T extends any, K extends T[]>(array: K): K {
  return array.map<T>(el => {
    if (Array.isArray(el)) {
      return deepCopyArray(el)
    }

    return el;
  }) as K;
}

interface IFigureProps {
  position: Coordinate;
  color: 'black' | 'white';
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

  static patternsPropperties: IPatternPropperties = { patterns: [], isSingle: true };

  get patternsPropperties(): IPatternPropperties  { return Figure.patternsPropperties };

  constructor(props: IFigureProps) {
    this.status = 'active';
    this.color = props.color;
    this.position = props.position;
  }

  validateNewPosition(gamePosition: IGamePosition, c: Coordinate) {
    const allowedPosition = this.getAllowedPositions(gamePosition);
    const isValid = allowedPosition.some(position => position[0] === c[0] && position[1] === c[1]);

    if (!isValid) {
      throw new Error('This move is not valid');
    }

    return true;
  }

  setPosition(gamePosition: IGamePosition, c: Coordinate) {
    this.validateNewPosition(gamePosition, c);

    const deskCopy = deepCopyArray(gamePosition.desk);

    this.isMovedEarly = true;
    deskCopy[c[0]][c[1]] = this;
    deskCopy[this.position[0]][this.position[1]] = 0;

    this.position = c;

    return { ...gamePosition, desk: deskCopy };
  }

  public getAllowedPositions(gamePosition: IGamePosition): Coordinate[] {
    return this.buildMovesByPattern(gamePosition);
  }

  buildMovesByPattern(gamePosition: IGamePosition) {
    const [x, y] = this.position;
    const { patterns, isSingle } = this.patternsPropperties;
    const result: Coordinate[] = [];

    for (let i = 0; i < patterns.length; i += 1) {
      // Build line by pattern until the board ends or a figure is encountered
      const pattern = patterns[i];

      let isContinue = true;
      let koef = 1;

      while (isContinue) {
        const applicant: Coordinate = [
          x + (koef * pattern[0]),
          y + (koef * pattern[1]),
        ];

        const isValid = this.isAllowedPosition(gamePosition, applicant);

        if (isValid) {
          result.push(applicant);

          const positionValue = getPositionValue(gamePosition, applicant);

          if (!positionValue) {
            koef += 1;
          }

          // Only when position empty we can continue "moveline"
          if (!positionValue && !isSingle) {
            continue;
          }
        }

        isContinue = false;
      }

    }

    return result;
  }
  

  isAllowedPosition(gamePosition: IGamePosition, c: Coordinate) {
    if (!isValidCoordinate(c)) return false;

    const value = getPositionValue(gamePosition, c);
    const isPositionEmpty = !value;
    const isPositionHasSeparateFigure = !!value && value.color !== this.color;

    return isPositionEmpty || isPositionHasSeparateFigure;
  }
}

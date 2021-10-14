export type Coordinate = [number, number];
type PositionValue = Figure | 0;
type Line = [PositionValue, PositionValue, PositionValue, PositionValue, PositionValue, PositionValue, PositionValue, PositionValue];
export type Desk = [Line, Line, Line, Line, Line, Line, Line, Line];

export interface IGamePosition {
  lastMove?: [Coordinate, Coordinate];
  desk: Desk;
}

const DeskColumnMap: Record<number, string> = {
  0: 'A',
  1: 'B',
  2: 'C',
  3: 'D',
  4: 'E',
  5: 'F',
  6: 'G',
  7: 'H',
}

export function convertCoordinateToString(c: Coordinate) {
  return `${DeskColumnMap[c[0]] || ''}${c[1] + 1}`;
}

export function getFightMap(gamePosition: IGamePosition, figures: Figure[]): Record<string, number> {
  const result: Record<string, number> = {};

  for (let i = 0; i < figures.length; i += 1) {
    const allowedPosition = figures[i].getAllowedPositions(gamePosition);

    for (let j = 0; j < allowedPosition.length; j += 1) {
      const stringPosition = convertCoordinateToString(allowedPosition[j]);

      if (result[stringPosition]) {
        result[stringPosition] += 1;
      } else {
        result[stringPosition] = 1;
      }
    }
  }
  
  return result;
}

export function getFiguresByType<T extends Figure>(gamePosition: IGamePosition, type: new (...args: any) => T): T[] {
  const { desk } = gamePosition;
  const result: T[] = [];

  for (let i = 0; i < desk.length; i += 1) {
    const line = desk[i];

    for (let j = 0; j < line.length; j += 1) {
      const positionValue = line[j];

      if (positionValue && positionValue instanceof type) {
        result.push(positionValue);
      }
    }
  }

  return result;
}

export function getFiguresByColor(gamePosition: IGamePosition, color: IFigureProps['color']): Figure[] {
  const { desk } = gamePosition;
  const result: Figure[] = [];

  for (let i = 0; i < desk.length; i += 1) {
    const line = desk[i];

    for (let j = 0; j < line.length; j += 1) {
      const positionValue = line[j];

      if (positionValue && positionValue.color === color) {
        result.push(positionValue);
      }
    }
  }

  return result;
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

function getCoordinatesByPattern(c: Coordinate, pattern: Coordinate, koef: number): Coordinate {
  return [c[0] + (koef * pattern[0]), c[1] + (koef * pattern[1])]
}

export function getCoordinatesByYBetween(line: number, firstF: Figure, secondF: Figure): Coordinate[] {
  const result: Coordinate[] = [];
  const firstX = firstF.position[0];
  const secondX = secondF.position[0];
  const direction = firstX > secondX ? 1 : -1;

  if (firstX === secondX) return result;

  for (let i = secondX + direction; i !== firstX; i += direction) {
    result.push([i, line]);
  }

  return result;
}

export function isSpaceEmptyByYBetween(gamePosition: IGamePosition, line: number, firstF: Figure, secondF: Figure): boolean {
  const coordinatesBetween = getCoordinatesByYBetween(line, firstF, secondF);

  for (let i = 0; i < coordinatesBetween.length; i += 1) {
    if (!!getPositionValue(gamePosition, coordinatesBetween[i])) {
      return false;
    }
  }

  return true;
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
    const { patterns, isSingle } = this.patternsPropperties;
    const result: Coordinate[] = [];

    for (let i = 0; i < patterns.length; i += 1) {
      // Build line by pattern until the board ends or a figure is encountered
      const pattern = patterns[i];
      let isContinue = true;
      let koef = 1;

      while (isContinue) {
        const applicant = getCoordinatesByPattern(this.position, pattern, koef);
        const isValid = this.isAllowedPosition(gamePosition, applicant);

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

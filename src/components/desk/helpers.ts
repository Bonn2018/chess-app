import Figure from './figures/root';
import { Pawn } from './figures';

export interface IGamePosition {
  lastMove?: [Coordinate, Coordinate];
  desk: Desk;
}

export type Color = 'black' | 'white';
export type Coordinate = [number, number];
type PositionValue = Figure | 0;
type Line = [PositionValue, PositionValue, PositionValue, PositionValue, PositionValue, PositionValue, PositionValue, PositionValue];
export type Desk = [Line, Line, Line, Line, Line, Line, Line, Line];


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

export function getFiguresByColor(gamePosition: IGamePosition, color: Color): Figure[] {
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

export function deepCopyArray<T extends any, K extends T[]>(array: K): K {
  return array.map<T>(el => {
    if (Array.isArray(el)) {
      return deepCopyArray(el)
    }

    return el;
  }) as K;
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

export function getFightMap(gamePosition: IGamePosition, figures: (Figure | Pawn)[]): Record<string, number> {
  const result: Record<string, number> = {};

  for (let i = 0; i < figures.length; i += 1) {
    const allowedPosition = figures[i].getProtectedPositions(gamePosition);

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
import { IGamePosition, Coordinate, getFiguresByType, isSpaceEmptyByYBetween, getFiguresByColor, getFightMap, getCoordinatesByYBetween, convertCoordinateToString } from '../helpers';

import Figure, { IPatternPropperties,  } from './root';
import Queen from './queen';
import Rook from './rook';

function filterCoordinatesByFightMap(fightMap: Record<string, number>, coordinates: Coordinate[]) {
  return coordinates.filter(el =>  !fightMap[convertCoordinateToString(el)]);
}

export default class King extends Figure {
  public isMovedEarly = false;
  static patternsPropperties: IPatternPropperties = {
    isSingle: true,
    patterns: Queen.patternsPropperties.patterns,
  }

  get patternsPropperties() { return King.patternsPropperties };

  // Filter rooks by allowed from fighting space between rook and king
  getAllowedRooksToCastling(gamePosition: IGamePosition, rooks: Rook[]) {
    const opositeFigures = getFiguresByColor(gamePosition, this.color === 'white' ? 'black' : 'white');
    const fightMap = getFightMap(gamePosition, opositeFigures);

    return rooks.filter(rook => {
      const coordinatesBetween = getCoordinatesByYBetween(this.position[1], this, rook);

      coordinatesBetween.push(rook.position, this.position);

      const freeCoordinates = filterCoordinatesByFightMap(fightMap, coordinatesBetween);

      return freeCoordinates.length === coordinatesBetween.length;
    })
  }

  getCastlingMoves(gamePosition: IGamePosition): Coordinate[] {
    const result: Coordinate[] = [];

    if (this.isMovedEarly) return result;

    const rooksAvailableToCastling = getFiguresByType(gamePosition, Rook).filter((rook) => rook.color === this.color && !rook.isMovedEarly);
  
    if (!rooksAvailableToCastling.length) return result;

    const rooksWithEmptySpaceToKing = rooksAvailableToCastling.filter(rook => isSpaceEmptyByYBetween(gamePosition, this.position[1], rook, this));

    if (!rooksWithEmptySpaceToKing.length) return result;

    const allowedRooksToCastling = this.getAllowedRooksToCastling(gamePosition, rooksWithEmptySpaceToKing);

    for (let i = 0; i < allowedRooksToCastling.length; i += 1) {
      const allowedRook = allowedRooksToCastling[i];
      const direction  = allowedRook.position[0] > this.position[0] ? 1 : -1;
      
      result.push([this.position[0] + direction * 2, this.position[1]]);
    }
  
    return result;
  }

  public getFightPositions(gamePosition: IGamePosition): Coordinate[] {
    return this.buildMovesByPattern(gamePosition);
  }

  getAllowedPositions(gamePosition: IGamePosition) {
    const opositeFigures = getFiguresByColor(gamePosition, this.color === 'white' ? 'black' : 'white');
    const fightMap = getFightMap(gamePosition, opositeFigures);
    const result = filterCoordinatesByFightMap(fightMap, this.buildMovesByPattern(gamePosition));

    result.push(...this.getCastlingMoves(gamePosition));

    return result;
  }
}
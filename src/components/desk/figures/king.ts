import Figure, { IPatternPropperties, IGamePosition, Coordinate, getFiguresByType, isSpaceEmptyByYBetween, getFiguresByColor, getFightMap, getCoordinatesByYBetween, convertCoordinateToString } from './root';

import Queen from './queen';
import Rook from './rook';

export default class King extends Figure {
  public isMovedEarly = false;
  static patternsPropperties: IPatternPropperties = {
    isSingle: true,
    patterns: Queen.patternsPropperties.patterns,
  }

  // Filter rooks by allowed from fighting space between rook and king
  getAllowedRooksToCastling(gamePosition: IGamePosition, rooks: Rook[]) {
    const opositeFigures = getFiguresByColor(gamePosition, this.color === 'white' ? 'black' : 'white');
    const fightMap = getFightMap(gamePosition, opositeFigures);

    return rooks.filter(rook => {
      const coordinatesBetween = getCoordinatesByYBetween(this.position[1], this, rook);

      coordinatesBetween.push(rook.position, this.position);

      for (let i = 0; i < coordinatesBetween.length; i += 1) {
        const coordinateString = convertCoordinateToString(coordinatesBetween[i]);

        if (fightMap[coordinateString]) {
          return false;
        }
      }

      return true;
    })
  }

  getCastlingMoves(gamePosition: IGamePosition): Coordinate[] {
    const result: Coordinate[] = [];

    if (this.isMovedEarly) return result;
    const ff = getFiguresByType(gamePosition, Rook);
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

  get patternsPropperties() { return King.patternsPropperties };

  getAllowedPositions(gamePosition: IGamePosition) {
    const result = this.buildMovesByPattern(gamePosition);

    result.push(...this.getCastlingMoves(gamePosition));

    return result;
  }
}
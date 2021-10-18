import { IGamePosition, getPositionValue, Coordinate, isValidCoordinate } from '../helpers';

import Figure, { IPatternPropperties } from './root';

export default class Pawn extends Figure {
  public name = 'pawn';
  static patternsPropperties: IPatternPropperties = {
    isSingle: false,
    patterns: [],
  }

  get patternsPropperties(): IPatternPropperties  { return Pawn.patternsPropperties };

  getCaptureInPassant(gamePosition: IGamePosition): Coordinate | undefined {
    const { lastMove } = gamePosition;
  
    if (!lastMove) {
      return;
    }
    
    const [x, y] = this.position;
    const [ lastMoveX, lastMoveY] = lastMove[1];
    const [ lastMovePrevX, lastMovePrevY] = lastMove[0];

    const isLastMovedFigureNeighbor = lastMoveX === x + 1 || lastMoveX === x - 1;

    if (!isLastMovedFigureNeighbor) return;

    const isWasLongMove = Math.abs(lastMovePrevY - lastMoveY) === 2;

    if (!isWasLongMove) return;

    const isCurrentFigurePlacedBeside = y === lastMoveY || y === ((lastMoveY + lastMovePrevY) / 2);

    if (!isCurrentFigurePlacedBeside) return;

    const lastMovedFigureBishop = getPositionValue(gamePosition, lastMove[1]) instanceof Pawn;

    if (!lastMovedFigureBishop) return;

    return [lastMoveX, this.color === 'white' ? y + 1 : y - 1];
  }

  public getFightPositions(gamePosition: IGamePosition): Coordinate[] {
    const [x, y] = this.position;
    const result = [];

    const captureInPassant = this.getCaptureInPassant(gamePosition);

    if (captureInPassant) {
      result.push(captureInPassant);
    }

    const firstFightApplicant: Coordinate = this.color === 'white' ?
      [x + 1, y + 1] :
      [x + 1, y - 1];

    if (isValidCoordinate(firstFightApplicant)) {
      result.push(firstFightApplicant);
    }

    const secondFightApplicant: Coordinate = this.color === 'white' ?
      [x - 1, y + 1] :
      [x - 1, y - 1];

    if (isValidCoordinate(secondFightApplicant)) {
      result.push(secondFightApplicant);
    }

    return result;
  }

  getProtectedPositions(gamePosition: IGamePosition) {
    return this.getFightPositions(gamePosition);
  }

  getAllowedPositions(gamePosition: IGamePosition) {
    const [x, y] = this.position;
    const result: Coordinate[] = [];

    const firstApplicant: Coordinate = this.color === 'white' ?
      [x, y + 1] :
      [x, y - 1];

    const isFirstSquareAllowed = !getPositionValue(
      gamePosition,
      firstApplicant,
    );

    if (isFirstSquareAllowed) {
      result.push(firstApplicant);

      const secondApplicant: Coordinate = this.color === 'white' ?
        [x, y + 2] :
        [x, y - 2];
      const isSecondSquareAllowed = !getPositionValue(
        gamePosition,
        secondApplicant,
      );
      
      if (isSecondSquareAllowed && !this.isMovedEarly) {
        result.push(secondApplicant);
      }
    }

    // Fight moves
    const fightPositions = this.getFightPositions(gamePosition);

    for(let i = 0; i < fightPositions.length; i += 1) {
      const position = fightPositions[i];
      const positionValue = getPositionValue(
        gamePosition,
        position,
      );

      positionValue && positionValue.color !== this.color && result.push(position);
    }

    // Capture in passant was returned from "getFightPositions" but omited in "for"
    const captureInPassant = this.getCaptureInPassant(gamePosition);

    if (captureInPassant) {
      result.push(captureInPassant);
    }

    return result;
  }
}
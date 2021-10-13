import Figure, { IPatternPropperties, IGamePosition, getPositionValue, Coordinate, isValidCoordinate } from './root';

export default class Pawn extends Figure {
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

  getAllowedPositions(gamePosition: IGamePosition) {
    const [x, y] = this.position;
    const result: Coordinate[] = [];

    const firstApplicant: Coordinate = this.color === 'white' ?
      [x, y + 1] :
      [x, y - 1];

    const isFirstSquareAllowed = getPositionValue(
      gamePosition,
      firstApplicant,
    );

    if (isFirstSquareAllowed) {
      result.push(firstApplicant);

      const secondApplicant: Coordinate = this.color === 'white' ?
        [x, y + 2] :
        [x, y - 2];
      const isSecondSquareAllowed = getPositionValue(
        gamePosition,
        secondApplicant,
      );
      
      if (isSecondSquareAllowed && !this.isMovedEarly) {
        result.push(secondApplicant);
      }
    }

    const captureInPassant = this.getCaptureInPassant(gamePosition);

    if (captureInPassant) {
      result.push(captureInPassant);
    }

    // Fight move
    const firstFightApplicant: Coordinate = this.color === 'white' ?
      [x + 1, y + 1] :
      [x + 1, y - 1];

    if (isValidCoordinate(firstFightApplicant)) {
      const positionValue = getPositionValue(
        gamePosition,
        firstFightApplicant,
      );

      positionValue && positionValue.color !== this.color && result.push(firstFightApplicant);
    }

    const secondFightApplicant: Coordinate = this.color === 'white' ?
      [x - 1, y + 1] :
      [x - 1, y - 1];

    if (isValidCoordinate(secondFightApplicant)) {
      const positionValue = getPositionValue(
        gamePosition,
        secondFightApplicant,
      );

      positionValue && positionValue.color !== this.color && result.push(secondFightApplicant);
    }

    return result;
  }
}
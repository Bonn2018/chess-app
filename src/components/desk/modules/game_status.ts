import { IGameStatus } from '../index';
import { getPositionValue, IGamePosition, Color, getFiguresByType, getFightMap, getFiguresByColor, convertCoordinateToString, deepCopyArray, Desk } from '../helpers';
import { King } from '../figures'
export default class GameStatus {

  defineNextPlayerColor(gamePosition: IGamePosition): Color {
    const { lastMove } = gamePosition;

    if (!lastMove) {
      return 'white';
    }

    const lastMoveFigure = getPositionValue(gamePosition, lastMove[1]);

    if (!lastMoveFigure) {
      throw new Error('Position is broken');
    }

    return lastMoveFigure.color === 'white' ? 'black' : lastMoveFigure.color;
  }

  isCheck(gamePosition: IGamePosition, color: Color) {
    const figuresForCurrentColor = getFiguresByColor(gamePosition, color);
    const opositeFigures = getFiguresByColor(gamePosition, color === 'black' ? 'white' : 'black');
    const fightMapForOpositeColor = getFightMap(gamePosition, opositeFigures);
    const king = figuresForCurrentColor.find(el => el instanceof King);

    if (!king) {
      throw new Error('Game position is invalid. King is not exist.');
    }

    return !!fightMapForOpositeColor[convertCoordinateToString(king.position)];
  }

  getAllowedMovesForDeclineCheck(gamePosition: IGamePosition, color: Color) {
    const result: [string, string][] = [];
    const figuresForCurrentColor = getFiguresByColor(gamePosition, color);

    for (let i = 0; i < figuresForCurrentColor.length; i += 1) {
      const figure = figuresForCurrentColor[i];
      const allowedMoves = figure.getAllowedPositions(gamePosition);

      for (let j = 0; j < allowedMoves.length; j += 1) {
        const move = allowedMoves[j];
        const exPosition = figure.position;
        const newGamePosition = figure.setPosition(gamePosition, move);

        const isCheck = this.isCheck(newGamePosition, color);

        if (!isCheck) {
          result.push([
            convertCoordinateToString(exPosition),
            convertCoordinateToString(move),
          ])
        }

        figure.back();
      }
    }

    return result;
  }

  isMate(gamePosition: IGamePosition, color: Color) {
    const allowedMoves = this.getAllowedMovesForDeclineCheck(gamePosition, color);

    return !allowedMoves.length;
  }


  getGameStatus(gamePosition: IGamePosition): IGameStatus {
    const color = this.defineNextPlayerColor(gamePosition);
    const opositeColor: Color = color === 'black' ? 'white' : 'black';
    const figuresForCurrentColor = getFiguresByColor(gamePosition, color);
    const isCheck = this.isCheck(gamePosition, color);

    if (isCheck) {
      return this.isMate(gamePosition, color) ? `win_${opositeColor}` : `check_for_${color}`;
    } else {
      const isExistAllowedMoves = !!figuresForCurrentColor.find(el => !!el.getAllowedPositions(gamePosition).length);

      if (!isExistAllowedMoves) {
        return 'stalemate';
      }
    }

    return 'game';
  }
}
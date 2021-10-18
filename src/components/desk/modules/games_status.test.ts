import { Rook, Knight, King, Pawn, Queen } from '../figures';
import { deepCopyArray, Desk, IGamePosition } from '../helpers';

import { GameStatusModule } from './';

const module = new GameStatusModule();

const whiteKing = new King({
  position: [4, 0],
  color: 'white',
});
const blackKing = new King({
  position: [4, 7],
  color: 'black',
});
const firstWhiteRook = new Rook({
  position: [0, 6],
  color: 'white',
});
const secondWhiteRook = new Rook({
  position: [7, 7],
  color: 'white',
});

const blackKnight = new Knight({
  position: [4, 5],
  color: 'black',
});


const deskMockValue: Desk = [
  [0, 0, 0, 0, 0, 0, firstWhiteRook, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [whiteKing, 0, 0, 0, 0, 0, 0, blackKing],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, secondWhiteRook],
];
const gamePosition: IGamePosition = {
  desk: deskMockValue,
  lastMove: [[7, 6],[7, 7]],
}

describe.only('Test Rook figure', () => {
  it('Allowed meves list will be empty for check-mate state', () => {
    expect(module.getAllowedMovesForDeclineCheck(gamePosition, 'black').length).toEqual(0);
  });

  it('Allowed meves list will have one item', () => {
    const localDeskMockValue: Desk = deepCopyArray(deskMockValue);

    localDeskMockValue[4][5] = blackKnight;

    expect(module.getAllowedMovesForDeclineCheck(
      { ...gamePosition, desk: localDeskMockValue },
      'black',
    ).length).toEqual(1);
  });

  it('Stalemate status', () => {
    const whitePawn = new Pawn({
      position: [0, 6],
      color: 'white',
    });
    const blackKing = new King({
      position: [0, 7],
      color: 'black',
    });
    const whiteKing = new King({
      position: [1, 5],
      color: 'white',
    })
    const deskMockValue: Desk = [
      [0, 0, 0, 0, 0, 0, whitePawn, blackKing],
      [0, 0, 0, 0, 0, whiteKing, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
    ];
    const gamePosition: IGamePosition = {
      desk: deskMockValue,
      lastMove: [[1, 4],[1, 5]],
    }

    expect(module.getGameStatus(gamePosition)).toEqual('stalemate');
  });

  it('Check status', () => {
    const whitePawn = new Pawn({
      position: [0, 6],
      color: 'white',
    });
    const blackKing = new King({
      position: [1, 7],
      color: 'black',
    });
    const whiteKing = new King({
      position: [1, 5],
      color: 'white',
    })
    const deskMockValue: Desk = [
      [0, 0, 0, 0, 0, 0, whitePawn, 0],
      [0, 0, 0, 0, 0, whiteKing, 0, blackKing],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
    ];
    const gamePosition: IGamePosition = {
      desk: deskMockValue,
      lastMove: [[0, 5],[0, 6]],
    }

    expect(module.getGameStatus(gamePosition)).toEqual('check_for_black');
  });

  it('Check-mate status', () => {
    const whiteQueen = new Queen({
      position: [1, 6],
      color: 'white',
    });
    const blackKing = new King({
      position: [1, 7],
      color: 'black',
    });
    const whiteKing = new King({
      position: [1, 5],
      color: 'white',
    })
    const deskMockValue: Desk = [
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, whiteKing, whiteQueen, blackKing],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
    ];
    const gamePosition: IGamePosition = {
      desk: deskMockValue,
      lastMove: [[7, 6],[1, 6]],
    }

    expect(module.getGameStatus(gamePosition)).toEqual('win_white');
  });
});

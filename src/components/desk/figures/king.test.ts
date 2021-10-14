import King from './king';
import { Pawn, Queen, Rook } from './';

import { Desk } from './root';

const whitePawn = new Pawn({
  position: [3, 6],
  color: 'white',
});
const blackPawn = new Pawn({
  position: [4, 6],
  color: 'black',
});
const whiteQueen = new Queen({
  position: [5, 0],
  color: 'white',
});
const whiteRook = new Rook({
  position: [7, 7],
  color: 'black',
});

let king: King;

const getDefaultKing = () => new King({
  position: [4, 7],
  color: 'black',
});

const deskMockValue: Desk = [
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, whitePawn, 0],
  [0, 0, 0, 0, 0, 0, blackPawn, 0],
  [whiteQueen, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, whiteRook],
];

describe('Test Queen figure', () => {
  beforeEach(() => {
    king = getDefaultKing();
    deskMockValue[4][7] = king;
  });

  it('Make allowed move to empty position', () => {
    const newGameDesk = king.setPosition({ desk: deskMockValue }, [3, 7]);

    expect(newGameDesk.desk[3][7]).toEqual(king);
  });

  it('Make allowed fight move', () => {
    const newGameDesk = king.setPosition({ desk: deskMockValue }, [3, 6]);

    expect(newGameDesk.desk[3][6]).toEqual(king);
  });

  it('Make invalid move', () => {
    expect(king.setPosition.bind(king, { desk: deskMockValue }, [4, 6])).toThrowError();
  });

  it('Make invalid castling', () => {
    expect(king.setPosition.bind(king, { desk: deskMockValue }, [6, 7])).toThrowError();
  });

  it('Make valid castling', () => {
    const whiteQueen = new Queen({
      position: [4, 0],
      color: 'white',
    });
    const secondDesk: Desk = [
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [whiteQueen, 0, 0, 0, 0, 0, blackPawn, king],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, whiteRook],
    ];
    const newGameDesk = king.setPosition({ desk: secondDesk }, [6, 7]);

    expect(newGameDesk.desk[6][7]).toEqual(king);
  });

  it('Make invalid castling. Reason: figure between king and rook', () => {
    const blackPawn = new Pawn({
      position: [5, 7],
      color: 'black',
    });
    const secondDesk: Desk = [
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, king],
      [0, 0, 0, 0, 0, 0, 0, blackPawn],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, whiteRook],
    ];

    expect(king.setPosition.bind(king, { desk: secondDesk }, [6, 7])).toThrowError();
  });
});

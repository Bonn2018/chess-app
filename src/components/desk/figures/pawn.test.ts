import Pawn from './pawn';
import { Desk } from './root';

let firstWhitePawn: Pawn;
let secondWhitePawn: Pawn;

const firstBlackPawn = new Pawn({
  position: [2, 5],
  color: 'black'
});

const secondBlackPawn = new Pawn({
  position: [3, 5],
  color: 'black'
});

const thirdBlackPawn = new Pawn({
  position: [4, 4],
  color: 'black'
});

let deskMockValue: Desk;

function resetChanges() {
  firstWhitePawn = new Pawn({
    position: [3, 4],
    color: 'white'
  });
  secondWhitePawn = new Pawn({
    position: [4, 1],
    color: 'white'
  });
  deskMockValue = [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, firstBlackPawn, 0, 0],
    [0, 0, 0, 0, firstWhitePawn, secondBlackPawn, 0, 0],
    [0, secondWhitePawn, 0, 0, thirdBlackPawn, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
  ];
}

describe('Test Queen figure', () => {
  beforeEach(() => {
    resetChanges();
  });

  it('Make static pawn fight move', () => {
    const newGameDesk = firstWhitePawn.setPosition({ desk: deskMockValue }, [2, 5]);

    expect(newGameDesk.desk[2][5]).toEqual(firstWhitePawn);
  });

  it('Make invalid fight move on empty position', () => {
    expect(firstWhitePawn.setPosition.bind(firstWhitePawn, { desk: deskMockValue }, [4, 5])).toThrowError();
  });

  it('Make invalid fight move during straight line', () => {
    expect(firstWhitePawn.setPosition.bind(firstWhitePawn, { desk: deskMockValue }, [3, 5])).toThrowError();
  });

  it('Make fight move "capture in passant"', () => {
    const newGameDesk = firstWhitePawn.setPosition({ desk: deskMockValue, lastMove: [[4, 6], [4, 4]] }, [4, 5]);

    expect(newGameDesk.desk[4][5]).toEqual(firstWhitePawn);
  });

  it('Make invalid fight move "capture in passant" according to last move', () => {
    expect(firstWhitePawn.setPosition.bind(firstWhitePawn, { desk: deskMockValue, lastMove: [[4, 5], [4, 4]] }, [4, 5])).toThrowError();
  });

  it('Make valid move on empty square', () => {
    const newGameDesk = secondWhitePawn.setPosition({ desk: deskMockValue }, [4, 2]);

    expect(newGameDesk.desk[4][2]).toEqual(secondWhitePawn);
  });

  it('Make valid first move on 2 squares', () => {
    const newGameDesk = secondWhitePawn.setPosition({ desk: deskMockValue }, [4, 3]);

    expect(newGameDesk.desk[4][3]).toEqual(secondWhitePawn);
  });
});

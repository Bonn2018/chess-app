import Rook from './rook';
import Figure, { Desk } from './root';

const whiteFigure = new Figure({
  position: [2, 4],
  color: 'white',
});
const blackFigure = new Figure({
  position: [4, 6],
  color: 'black',
});
const getDefaultRook = () => new Rook({
  position: [4, 3],
  color: 'white',
});
let whiteRook: Rook;

const deskMockValue: Desk = [
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, whiteFigure, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, blackFigure, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
];

describe('Test Rook figure', () => {
  beforeEach(() => {
    whiteRook = getDefaultRook();
    deskMockValue[4][3] = whiteRook;
  });

  it('Make allowed move to empty position', () => {
    const newGameDesk = whiteRook.setPosition({ desk: deskMockValue }, [4, 0]);

    expect(newGameDesk.desk[4][0]).toEqual(whiteRook);
  });

  it('Make allowed move to separate figure', () => {
    const newGameDesk = whiteRook.setPosition({ desk: deskMockValue }, blackFigure.position);

    expect(newGameDesk.desk[4][6]).toEqual(whiteRook);
  });

  it('Make move to invalid position', () => {
    expect(whiteRook.setPosition.bind(whiteRook, { desk: deskMockValue }, [5, 4])).toThrowError();
  });

  it('Make invalid move because on position exist figure with same color', () => {
    expect(whiteRook.setPosition.bind(whiteRook, { desk: deskMockValue }, [2, 4])).toThrowError();
  });
});

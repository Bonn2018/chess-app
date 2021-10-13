import Queen from './queen';
import Figure, { Desk } from './root';

const whiteFigure = new Figure({
  position: [2, 4],
  color: 'white',
});
const blackFigure = new Figure({
  position: [4, 6],
  color: 'black',
});
const secondBlackFigure = new Figure({
  position: [6, 5],
  color: 'black',
});
const getDefaultQueen = () => new Queen({
  position: [4, 3],
  color: 'white',
});
let whiteQueen: Queen;

const deskMockValue: Desk = [
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, whiteFigure, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, blackFigure, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, secondBlackFigure, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
];

describe('Test Queen figure', () => {
  beforeEach(() => {
    whiteQueen = getDefaultQueen();
    deskMockValue[4][3] = whiteQueen;
  });

  it('Make allowed move to empty position', () => {
    const newGameDesk = whiteQueen.setPosition({ desk: deskMockValue }, [7, 0]);

    expect(newGameDesk.desk[7][0]).toEqual(whiteQueen);
  });

  it('Make allowed move to separate figure in a straight line (like rook)', () => {
    const newGameDesk = whiteQueen.setPosition({ desk: deskMockValue }, blackFigure.position);

    expect(newGameDesk.desk[4][6]).toEqual(whiteQueen);
  });

  it('Make allowed move to another separate figure on an oblique line (like bishop)', () => {
    const newGameDesk = whiteQueen.setPosition({ desk: deskMockValue }, blackFigure.position);

    expect(newGameDesk.desk[4][6]).toEqual(whiteQueen);
  });

  it('Make move to invalid position', () => {
    expect(whiteQueen.setPosition.bind(whiteQueen, { desk: deskMockValue }, [2, 2])).toThrowError();
  });

  it('Make invalid move because on position exist figure with same color', () => {
    expect(whiteQueen.setPosition.bind(whiteQueen, { desk: deskMockValue }, [2, 4])).toThrowError();
  });
});

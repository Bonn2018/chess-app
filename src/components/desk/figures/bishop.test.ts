import { Desk } from '../helpers';

import Bishop from './bishop';
import Figure from './root';

const whiteFigure = new Figure({
  position: [2, 3],
  color: 'white',
});
const blackFigure = new Figure({
  position: [6, 3],
  color: 'black',
});
const getDefaultBishop = () => new Bishop({
  position: [4, 1],
  color: 'white',
});
let whiteBishop: Bishop;

const deskMockValue: Desk = [
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, whiteFigure, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, blackFigure, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
];

describe('Test Bishop figure', () => {
  beforeEach(() => {
    whiteBishop = getDefaultBishop();
    deskMockValue[4][1] = whiteBishop;
  });

  it('Make allowed move to empty position', () => {
    const newGameDesk = whiteBishop.setPosition({ desk: deskMockValue }, [3, 2]);

    expect(newGameDesk.desk[3][2]).toEqual(whiteBishop);
    expect(newGameDesk.desk[4][1]).toEqual(0);
  });

  it('Make allowed move to separate figure', () => {
    const newGameDesk = whiteBishop.setPosition({ desk: deskMockValue }, blackFigure.position);

    expect(newGameDesk.desk[6][3]).toEqual(whiteBishop);
    expect(newGameDesk.desk[4][1]).toEqual(0);
  });

  it('Make move to invalid position', () => {
    expect(whiteBishop.setPosition.bind(whiteBishop, { desk: deskMockValue }, [7, -3])).toThrowError();
  });

  it('Make invalid move because on position exist figure with same color', () => {
    expect(whiteBishop.setPosition.bind(whiteBishop, { desk: deskMockValue }, [2, 3])).toThrowError();
  });
});

import { Desk } from '../helpers';

import Horse from './horse';
import Figure from './root';

const whiteFigure = new Figure({
  position: [1, 2],
  color: 'white',
});
const blackFigure = new Figure({
  position: [4, 3],
  color: 'black',
});
const getDefaultHorse = () => new Horse({
  position: [3, 1],
  color: 'white',
});
let whiteHorse: Horse;

const deskMockValue: Desk = [
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, whiteFigure, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, blackFigure, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
];

describe('Test Horse figure', () => {
  beforeEach(() => {
    whiteHorse = getDefaultHorse();
    deskMockValue[3][1] = whiteHorse;
  });

  it('Make allowed move to empty position', () => {
    const newGameDesk = whiteHorse.setPosition({ desk: deskMockValue }, [5, 2]);
    
    expect(newGameDesk.desk[5][2]).toEqual(whiteHorse);
    expect(newGameDesk.desk[3][1]).toEqual(0);
  });

  it('Make allowed move to separate figure', () => {
    const newGameDesk = whiteHorse.setPosition({ desk: deskMockValue }, [4, 3]);

    expect(newGameDesk.desk[4][3]).toEqual(whiteHorse);
    expect(newGameDesk.desk[3][1]).toEqual(0);
  });

  it('Make move to invalid position', () => {
    expect(whiteHorse.setPosition.bind(whiteHorse, { desk: deskMockValue }, [7, 3])).toThrowError();
  });

  it('Make invalid move because on position exist figure with same color', () => {
    expect(whiteHorse.setPosition.bind(whiteHorse, { desk: deskMockValue }, [1, 2])).toThrowError();
  });
});

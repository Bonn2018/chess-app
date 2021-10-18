import { GameStatusModule } from './modules';

/*
  const desk = new DeskController();

  // Game params
  desk.color = white;
  desk.secondPlayer = auto;
  desk.time = 5 * 60;
  desk.timeOnMove = 2;
  desk.autoplay = {
    deep: 5,
    lavel: 3
  };

  // Start of game
  desk.play();
  
  // Game process variant 1 - advanced
  const figure = desk.getComponentById(id);
                 desk.getComponentByPosition(position);
                 desk.getComponentByType(type)[1];

  const allowedPositions = figure.getAllowedPosition();
  const nextCoordinate = anylize(allowedPositions)

  const position = figure.moveTo(nextCoordinate);

  // Game process variant 2 - simple
  const position = desk.move(from, to);

  // Get process params
  const restTimeWhite = desk.users.white.restTime;
  const restTimeBlack = desk.users.black.restTime;
  const whitePositionPrice = desk.users.white.price;
  const blackPositionPrice = desk.users.black.price;

  // Game callbacks
  desk.onEndGame = (event: { result: 'win by mate' | 'win by time' | 'loose by mate' | 'loose by time', position: IPosition, history: IGameHistory }) => alert('final with result', event.result);
  desk.onCheck = (event: { position: IPosition, history: IGameHistory }) => alert('Good attempt')); 

  // Process action
  desk.declineLastCheck();
  desk.renderPosition(position);

  const partManager = desk.renderHistory(history);
*/

type Position = string | [number, number];
export type IGameStatus =
  'check_for_white' |
  'check_for_black' |
  'win_white' |
  'win_black' |
  'game' |
  'stalemate';

class FigureWrapper {}
type Square = 0 | FigureWrapper[];
type Line = [Square, Square, Square, Square, Square, Square, Square, Square];
export type Desk = [Line, Line, Line, Line, Line, Line, Line, Line];

export default class DeskController {
  private gameStatusModule = new GameStatusModule();
  private currentDesk: Desk | null = null;
  private history: [Position, Position] | null = null;

  public: 'white' | 'black' = 'white';
  // secondPlayer: 'auto' | 'manual' = 'manual';
  secondPlayer: 'manual' = 'manual';
  time: number = 0;
  timeOnMove: number = 0;
  // autoplay?: {
  //   deep: number;
  //   level: number;
  // }
  // users

  public play() {}
  public getComponentById(id: string) {}
  public getComponentByPosition(position: Position) {}
  public getComponentByType(type: string) {}
  public move(from: Position, to: Position) {}

  public getGameStatus(): IGameStatus {

  }
}

/*
  const desk = new DeskController();

  // Game params
  desk.color = white;
  desk.secondPlayer = auto;
  desk.time = 5 * 60;
  desk.timeOnCheck = 2;
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

class DeskController {

}
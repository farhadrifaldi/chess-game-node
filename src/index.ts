import { Board } from "./Board";
import { Game } from "./Game";

function start() {
  const board = new Board();
  const game = new Game(board);

  game.main();
}

start();

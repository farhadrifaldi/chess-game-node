import * as readline from "readline-sync";
import { Board } from "./Board";
import { Piece, PieceCoordinate, PieceKey, Player } from "./Piece";

function inputIsValid(input: string): boolean {
  const splittedStr = input.split(" ");
  if (splittedStr.length !== 2) {
    return false;
  }

  const { start, end } = parseCoordinate(input);

  if (
    start.row < 0 ||
    start.row > 7 ||
    start.col < 0 ||
    start.col > 7 ||
    end.row < 0 ||
    end.row > 7 ||
    end.col < 0 ||
    end.col > 7
  ) {
    return false;
  }

  if (
    isNaN(start.row) ||
    isNaN(start.col) ||
    isNaN(end.row) ||
    isNaN(end.col)
  ) {
    return false;
  }
  return true;
}

function parseCoordinate(input: string): {
  start: PieceCoordinate;
  end: PieceCoordinate;
} {
  //parse start coordinate
  const [start, end] = input.split(" ");

  const parsedStartCoord: PieceCoordinate = {
    row: parseInt(start[1]) - 1, //
    col: start.charCodeAt(0) - "a".charCodeAt(0),
  };

  const parsedEndCoord: PieceCoordinate = {
    row: parseInt(end[1]) - 1,
    col: end.charCodeAt(0) - "a".charCodeAt(0),
  };

  return { start: parsedStartCoord, end: parsedEndCoord };
}

function changePlayer(currentPlayer: Player): Player {
  if (currentPlayer === "white") {
    return "black";
  } else {
    return "white";
  }
}

function playerIsValidToMoveThePiece(
  toBeMovedPiece: Piece,
  currentPlayer: Player
): boolean {
  if (toBeMovedPiece.getPlayer() === currentPlayer) {
    return true;
  }

  return false;
}

function main() {
  let player: Player = "white";
  let choice: string = "";
  let kingIsCaptured = false;

  const board = new Board();

  while (choice !== "exit" && !kingIsCaptured) {
    board.showBoard();
    choice = readline.question(
      player +
        " player! Choose start coordinate & end coordinate, with example format (a1 a2) (or 'exit' to quit): "
    );

    if (choice === "exit") {
      break; // exit the loop
    }

    if (!inputIsValid(choice)) {
      console.log("Input is not valid");
    } else {
      const parsedCoordinate = parseCoordinate(choice);
      const toBeMovedPiece = board.getPiece(parsedCoordinate.start);
      const destinationPiece = board.getPiece(parsedCoordinate.end);

      if (!toBeMovedPiece) {
        console.log("The selected coordinate didn't have a piece");
      } else {
        if (!playerIsValidToMoveThePiece(toBeMovedPiece, player)) {
          console.log("The piece is not valid to be moved with current player");
        } else {
          const destinationCoordinate = parsedCoordinate.end;
          const isCanMovePiece = toBeMovedPiece.canMove(destinationCoordinate);
          if (isCanMovePiece) {
            board.movePiece(destinationCoordinate, toBeMovedPiece);
            // if king is captured, set kingIsCaptured to true to stop the loop
            if (
              destinationPiece &&
              destinationPiece.getType() === PieceKey.king
            ) {
              kingIsCaptured = true;
              console.log(
                `${destinationPiece.getPlayer()} player's King is Captured ${player} player wins`
              );
              break;
            }
            player = changePlayer(player);
          } else {
            console.log(
              "The piece is not possible to move to the destination, please choose another destination"
            );
          }
        }
      }
    }
  }
}

main();

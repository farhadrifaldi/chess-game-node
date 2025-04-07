import * as readline from "readline-sync";

import { Board } from "./Board";
import {
  PieceCoordinate,
  Player,
  Piece,
  Pawn,
  Rook,
  Knight,
  Bishop,
  Queen,
  King,
  PieceKey,
} from "./Piece";

export class Game {
  private board: Board;
  private currentPlayer: Player;
  private kingIsCaptured: boolean;

  constructor(board: Board) {
    this.board = board;
    this.currentPlayer = "white";
    this.kingIsCaptured = false;
  }

  public getCurrentPlayer() {
    return this.currentPlayer;
  }

  public parseCoordinate(input: string): {
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

  public inputIsValid(input: string): boolean {
    const splittedStr = input.split(" ");
    if (splittedStr.length !== 2) {
      return false;
    }

    const { start, end } = this.parseCoordinate(input);

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

  public changePlayer(): void {
    if (this.currentPlayer === "white") {
      this.currentPlayer = "black";
    } else {
      this.currentPlayer = "white";
    }
  }

  public playerIsValidToMoveThePiece(input: string): boolean {
    const parsedCoordinate = this.parseCoordinate(input);
    const toBeMovedPiece = this.board.getPiece(parsedCoordinate.start);
    if (toBeMovedPiece && toBeMovedPiece.getPlayer() === this.currentPlayer) {
      return true;
    }

    return false;
  }

  public setupPieces(board: Board) {
    // SETUP PAWN PIECES WHITE & BLACK
    for (let i = 0; i < board.getBoardArr().length; i++) {
      new Pawn("white", { row: 1, col: i }, board);
      new Pawn("black", { row: 6, col: i }, board);
    }

    // ROOK
    new Rook("white", { row: 0, col: 0 }, board);
    new Rook("white", { row: 0, col: 7 }, board);
    new Rook("black", { row: 7, col: 0 }, board);
    new Rook("black", { row: 7, col: 7 }, board);

    // KNIGHT
    new Knight("white", { row: 0, col: 1 }, board);
    new Knight("white", { row: 0, col: 6 }, board);
    new Knight("black", { row: 7, col: 1 }, board);
    new Knight("black", { row: 7, col: 6 }, board);

    // BISHOP
    new Bishop("white", { row: 0, col: 2 }, board);
    new Bishop("white", { row: 0, col: 5 }, board);
    new Bishop("black", { row: 7, col: 2 }, board);
    new Bishop("black", { row: 7, col: 5 }, board);

    // QUEEN
    new Queen("white", { row: 0, col: 4 }, board);
    new Queen("black", { row: 7, col: 4 }, board);

    // KING
    new King("white", { row: 0, col: 3 }, board);
    new King("black", { row: 7, col: 3 }, board);
  }

  public movePiece(input: string) {
    const parsedCoordinate = this.parseCoordinate(input);
    const toBeMovedPiece = this.board.getPiece(parsedCoordinate.start);
    const isCanMovePiece = toBeMovedPiece?.canMove(parsedCoordinate.end);
    if (toBeMovedPiece && isCanMovePiece) {
      this.board.movePiece(parsedCoordinate.end, toBeMovedPiece);
      return true;
    }
    return false;
  }

  public kingCapturedAfterPieceMoved(input: string) {
    const arr = this.board.getCapturedPieces();

    for (let i = 0; i < arr.length; i++) {
      const piece = arr[i];
      if (piece.getType() === PieceKey.king) {
        this.kingIsCaptured = true;
        console.log(
          `${piece.getPlayer()} player's King is Captured ${
            piece.getPlayer() === "white" ? "Black" : "White"
          } player wins`
        );
        break;
      }
    }
  }

  public startCoordinateHasAPiece(input: string) {
    const parsedCoordinate = this.parseCoordinate(input);
    const toBeMovedPiece = this.board.getPiece(parsedCoordinate.start);
    // const destinationPiece = this.board.getPiece(parsedCoordinate.end);
    if (toBeMovedPiece) {
      return true;
    }

    return false;
  }

  public main() {
    let input: string = "";

    // new King("black", { row: 0, col: 0 }, this.board); // a1
    // new Rook("white", { row: 0, col: 1 }, this.board); // b1
    // // this.setupPieces(this.board);

    while (input !== "exit" && !this.kingIsCaptured) {
      this.board.showBoard();
      input = readline.question(
        this.currentPlayer +
          " player! Choose start coordinate & end coordinate, with example format (a1 a2) (or 'exit' to quit): "
      );

      if (input === "exit") {
        break; // exit the loop
      }

      if (!this.inputIsValid(input)) {
        console.log("Input is not valid");
        continue;
      }

      if (!this.startCoordinateHasAPiece(input)) {
        console.log("The selected coordinate didn't have a piece");
        continue;
      }

      if (!this.playerIsValidToMoveThePiece(input)) {
        console.log("The piece is not valid to be moved with current player");
        continue;
      }

      const movePiece = this.movePiece(input);
      if (!movePiece) {
        console.log(
          "The piece is not possible to move to the destination, please choose another destination"
        );
        continue;
      }
      this.kingCapturedAfterPieceMoved(input);

      this.changePlayer();
    }
  }
}

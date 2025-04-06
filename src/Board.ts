import {
  Bishop,
  King,
  Knight,
  Pawn,
  Piece,
  PieceKey,
  Queen,
  Rook,
} from "./Piece";

export class Board {
  private board: (Piece | null)[][];

  constructor() {
    this.board = Array(8)
      .fill(null)
      .map(() => Array(8).fill(null));

    // SETUP PAWN PIECES WHITE & BLACK
    for (let i = 0; i < this.board.length; i++) {
      this.board[1][i] = new Pawn("white", { row: 1, col: i }, this);
      this.board[6][i] = new Pawn("black", { row: 6, col: i }, this);
    }

    // ROOK
    this.board[0][0] = new Rook("white", { row: 0, col: 0 }, this);
    this.board[0][7] = new Rook("white", { row: 0, col: 7 }, this);
    this.board[7][0] = new Rook("black", { row: 7, col: 0 }, this);
    this.board[7][7] = new Rook("black", { row: 7, col: 7 }, this);

    // KNIGHT
    this.board[0][1] = new Knight("white", { row: 0, col: 1 }, this);
    this.board[0][6] = new Knight("white", { row: 0, col: 6 }, this);
    this.board[7][1] = new Knight("black", { row: 7, col: 1 }, this);
    this.board[7][6] = new Knight("black", { row: 7, col: 6 }, this);

    // BISHOP
    this.board[0][2] = new Bishop("white", { row: 0, col: 2 }, this);
    this.board[0][5] = new Bishop("white", { row: 0, col: 5 }, this);
    this.board[7][2] = new Bishop("black", { row: 7, col: 2 }, this);
    this.board[7][5] = new Bishop("black", { row: 7, col: 5 }, this);

    // QUEEN
    this.board[0][3] = new Queen("white", { row: 0, col: 3 }, this);
    this.board[7][4] = new Queen("black", { row: 7, col: 4 }, this);

    // KING
    this.board[0][4] = new King("white", { row: 0, col: 4 }, this);
    this.board[7][3] = new King("black", { row: 7, col: 3 }, this);
  }

  getPiece(to: { row: number; col: number }) {
    return this.board[to.row][to.col]; // return the piece at the given position
  }

  movePiece(to: { row: number; col: number }, piece: Piece) {
    const pieceCoordinate = piece.getCoordinate();
    this.board[pieceCoordinate.row][pieceCoordinate.col] = null;
    this.board[to.row][to.col] = piece;
    piece.setCoordinate({
      row: to.row,
      col: to.col,
    });
  }

  showBoard() {
    let boardString = "   a  b  c  d  e  f  g  h\n";
    const boardLength = this.board.length;
    for (let i = 0; i < boardLength; i++) {
      const index = (boardLength - i).toString();
      boardString += index + "  ";
      for (let j = 0; j < this.board[i].length; j++) {
        boardString +=
          (this.board[boardLength - 1 - i][j]
            ? this.board[boardLength - 1 - i][j]?.getSymbol()
            : ". ") + " ";
      }
      boardString += index + "\n";
    }
    boardString += "   a  b  c  d  e  f  g  h\n";
    console.log(boardString);
  }
}

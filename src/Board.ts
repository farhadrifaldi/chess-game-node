import { Piece, PieceCoordinate } from "./Piece";

export class Board {
  private board: (Piece | null)[][];
  private capturedPieces: Piece[];

  constructor() {
    this.board = Array(8)
      .fill(null)
      .map(() => Array(8).fill(null));
    this.capturedPieces = [];
  }

  getPiece(to: { row: number; col: number }) {
    return this.board[to.row][to.col]; // return the piece at the given position
  }

  getCapturedPieces() {
    return this.capturedPieces;
  }

  movePiece(to: { row: number; col: number }, piece: Piece) {
    const pieceCoordinate = piece.getCoordinate();
    this.board[pieceCoordinate.row][pieceCoordinate.col] = null;
    this.capturePiece(to); // save the piece that already captured
    this.board[to.row][to.col] = piece;
    piece.setCoordinate({
      row: to.row,
      col: to.col,
    });
  }

  capturePiece(to: PieceCoordinate) {
    const thePiece = this.getPiece(to);
    if (thePiece) {
      this.capturedPieces.push(thePiece);
    }
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

  public getBoardArr() {
    return this.board;
  }

  // for setup the pieces outside this class
  public setPiece({ row, col }: PieceCoordinate, piece: Piece) {
    this.board[row][col] = piece;
  }
}

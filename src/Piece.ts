import { Board } from "./Board";

export type Player = "white" | "black";

export enum PieceKey {
  pawn = "P",
  rook = "R",
  knight = "N",
  bishop = "B",
  queen = "Q",
  king = "K",
}

export type PieceCoordinate = {
  row: number;
  col: number;
};

// create this abstract so it can be extended to other type of pieces like
// Rook, queen, bishop, etc.
// so that we can have different behavior for each type of piece especially each type of
// piece has different movement rules
export abstract class Piece {
  protected coordinate: PieceCoordinate; // [X, Y]
  protected player: Player;
  protected type: PieceKey;
  protected board: Board;

  constructor(
    coordinate: PieceCoordinate,
    player: Player,
    type: PieceKey,
    board: Board
  ) {
    this.coordinate = coordinate;
    this.player = player;
    this.type = type;
    this.board = board;
  }

  /**
   * getters for coordinate
   * @returns PieceCoordinate
   */
  public getCoordinate() {
    return this.coordinate; // [X, Y]
  }

  public getPlayer() {
    return this.player;
  }

  public getPiece() {
    return this.type; // PieceKey
  }

  public getSymbol() {
    return this.type + (this.player === "white" ? "w" : "b");
  }

  public getType() {
    return this.type;
  }

  public setCoordinate(to: PieceCoordinate) {
    this.coordinate = to;
  }

  abstract canMove(to: { row: number; col: number }): boolean;
}

/**
 * Pawn movement rules
 * Can move forward one square,
 * but captures diagonally one square
 * can move forward two squares on the first move
 */
export class Pawn extends Piece {
  constructor(player: Player, coordinate: PieceCoordinate, board: Board) {
    super(coordinate, player, PieceKey.pawn, board);
  }

  canMove(to: { row: number; col: number }): boolean {
    const direction: number = this.player === "white" ? 1 : -1;
    const startRow: number = this.player === "white" ? 1 : 6;

    // Basic Move
    if (
      to.col === this.coordinate.col &&
      to.row === this.coordinate.row + direction &&
      this.board.getPiece(to) === null
    ) {
      return true;
    }

    // Move 2 rows on first move
    if (
      to.col === this.coordinate.col &&
      to.row === this.coordinate.row + 2 * direction &&
      this.coordinate.row === startRow &&
      this.board.getPiece(to) === null && // destination cell should not occupied by other piece
      this.board.getPiece({
        col: this.coordinate.col,
        row: this.coordinate.row + direction,
      }) === null // check if theres any obstacle or not
    ) {
      return true;
    }

    // Capture rule
    if (
      this.board.getPiece(to) && // destination should be occupied by opponent
      to.row === this.coordinate.row + direction && // move in direction of player
      (to.col === this.coordinate.col + 1 || to.col === this.coordinate.row - 1) // capture diagonally
    ) {
      if (this.board.getPiece(to)?.getPlayer() !== this.player) return true; // check if opponent
    }

    return false;
  }
}

// Move straight forward either vertical or horizontal
// capture opponent on vertical or horizontal moves
export class Rook extends Piece {
  constructor(player: Player, coordinate: PieceCoordinate, board: Board) {
    super(coordinate, player, PieceKey.rook, board);
  }

  canMove(to: PieceCoordinate): boolean {
    // Can't move to same position
    if (to.row === this.coordinate.row && to.col === this.coordinate.col) {
      return false;
    }

    const destination = this.board.getPiece(to);

    // if destination is occupied by ally, we can't move
    if (destination?.getPlayer() === this.player) return false;

    // Vertical movement
    if (to.col === this.coordinate.col) {
      const rowDiff = to.row - this.coordinate.row;
      const direction = rowDiff > 0 ? 1 : -1;
      for (let i = 1; i < Math.abs(rowDiff); i++) {
        const currentPiece = this.board.getPiece({
          row: this.coordinate.row + i * direction,
          col: this.coordinate.col,
        });
        if (currentPiece) return false;
      }
      return true;
    }

    // Horizontal movement
    if (to.row === this.coordinate.row) {
      const colDiff = to.col - this.coordinate.col;
      const direction = colDiff > 0 ? 1 : -1;
      for (let i = 1; i < Math.abs(colDiff); i++) {
        const currentPiece = this.board.getPiece({
          row: this.coordinate.row,
          col: this.coordinate.col + i * direction,
        });
        if (currentPiece) return false;
      }
      return true;
    }

    return false;
  }
}

export class Knight extends Piece {
  constructor(player: Player, coordinate: PieceCoordinate, board: Board) {
    super(coordinate, player, PieceKey.knight, board);
  }

  canMove(to: PieceCoordinate): boolean {
    const destination = this.board.getPiece(to);

    const xSteps = Math.abs(to.col - this.coordinate.col);
    const ySteps = Math.abs(to.row - this.coordinate.row);

    if ((xSteps === 2 && ySteps === 1) || (xSteps === 1 && ySteps === 2)) {
      if (!destination || destination.getPlayer() !== this.player) {
        return true;
      }
    }

    return false;
  }
}

export class Bishop extends Piece {
  constructor(player: Player, coordinate: PieceCoordinate, board: Board) {
    super(coordinate, player, PieceKey.bishop, board);
  }

  canMove(to: PieceCoordinate): boolean {
    const colDiff = to.col - this.coordinate.col;
    const rowDiff = to.row - this.coordinate.row;
    const destination = this.board.getPiece(to);

    // if destination is occupied by ally, we can't move
    if (destination?.getPlayer() === this.player) return false;

    if (Math.abs(colDiff) === Math.abs(rowDiff)) {
      const colDirection = colDiff < 0 ? -1 : 1;
      const rowDirection = rowDiff < 0 ? -1 : 1;

      // Check if there are any pieces in the way
      for (let i = 1; i < Math.abs(colDiff); i++) {
        const currentPiece = this.board.getPiece({
          row: this.coordinate.row + i * rowDirection,
          col: this.coordinate.col + i * colDirection,
        });
        if (currentPiece) return false;
      }
      return true;
    }

    return false;
  }
}

/**
 * Queen is a combination of Rook and Bishop
 */
export class Queen extends Piece {
  constructor(player: Player, coordinate: PieceCoordinate, board: Board) {
    super(coordinate, player, PieceKey.queen, board);
  }

  canMove(to: { row: number; col: number }): boolean {
    const destination = this.board.getPiece(to);

    // if destination is occupied by ally, we can't move
    if (destination?.getPlayer() === this.player) return false;

    // Check all possible movement directions
    return (
      this.canMoveDiagonally(to) ||
      this.canMoveHorizontally(to) ||
      this.canMoveVertically(to)
    );
  }

  private canMoveHorizontally(to: PieceCoordinate): boolean {
    if (to.row === this.coordinate.row && to.col !== this.coordinate.col) {
      const steps = to.col - this.coordinate.col;
      const direction: number = steps > 0 ? 1 : -1;
      // traverse to check if there any obstacle or not
      for (let i = 1; i < Math.abs(steps); i++) {
        const currentCoordinate = this.board.getPiece({
          col: this.coordinate.col + i * direction,
          row: this.coordinate.row,
        });
        if (currentCoordinate) return false;
      }
      return true;
    }
    return false;
  }

  private canMoveVertically(to: PieceCoordinate): boolean {
    if (to.col === this.coordinate.col && to.row !== this.coordinate.row) {
      const steps = to.row - this.coordinate.row;
      const direction: number = steps > 0 ? 1 : -1;
      //   console.log("move vertical", steps, direction);
      // traverse to check if there any obstacle or not
      for (let i = 1; i < Math.abs(steps); i++) {
        const currentCoordinate = this.board.getPiece({
          row: this.coordinate.row + i * direction,
          col: this.coordinate.col,
        });
        if (currentCoordinate) return false;
      }
      return true;
    }

    return false;
  }

  private canMoveDiagonally(to: PieceCoordinate): boolean {
    const xSteps = to.col - this.coordinate.col;
    const ySteps = to.row - this.coordinate.row;

    if (Math.abs(xSteps) === Math.abs(ySteps)) {
      // define the direction of the move for x direction and y direction
      const xDirection = xSteps < 0 ? -1 : 1;
      const yDirection = ySteps < 0 ? -1 : 1;

      // Check if there are any pieces in the way
      for (let i = 1; i < Math.abs(xSteps); i++) {
        for (let j = 0; j < Math.abs(ySteps); j++) {
          const currentPiece = this.board.getPiece({
            row: this.coordinate.row + i * yDirection,
            col: this.coordinate.col + i * xDirection,
          });
          if (currentPiece) return false; // there is a piece in the way
        }
      }
      return true;
    }

    return false;
  }
}

/**
 * Can move to any direction but only one step
 */
export class King extends Piece {
  constructor(player: Player, coordinate: PieceCoordinate, board: Board) {
    super(coordinate, player, PieceKey.king, board);
  }

  canMove(to: PieceCoordinate): boolean {
    const destination = this.board.getPiece(to);

    // if destination is occupied by ally, we can't move
    if (destination?.getPlayer() === this.player) return false;

    if (this.canMoveDiagonally(to)) return true;

    if (this.canMoveHorizontally(to)) return true;

    if (this.canMoveVertically(to)) return true;

    return false;
  }

  private canMoveHorizontally(to: PieceCoordinate): boolean {
    const xSteps = to.col - this.coordinate.col;

    if (to.row === this.coordinate.row && Math.abs(xSteps) === 1) {
      return true;
    }
    return false;
  }

  private canMoveVertically(to: PieceCoordinate): boolean {
    const ySteps = to.row - this.coordinate.row;

    if (to.col === this.coordinate.col && Math.abs(ySteps) === 1) {
      return true;
    }

    return false;
  }

  private canMoveDiagonally(to: PieceCoordinate): boolean {
    const xSteps = to.col - this.coordinate.col;
    const ySteps = to.row - this.coordinate.row;

    if (
      Math.abs(xSteps) === Math.abs(ySteps) &&
      Math.abs(xSteps) === 1 &&
      Math.abs(ySteps) === 1
    ) {
      return true;
    }

    return false;
  }
}

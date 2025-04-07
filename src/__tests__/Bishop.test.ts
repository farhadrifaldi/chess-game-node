import { Board } from "../Board";
import { Bishop, Pawn } from "../Piece";
import { Player } from "../Piece";

describe("Bishop", () => {
  let board: Board;
  let bishop: Bishop;

  beforeEach(() => {
    board = new Board();
    bishop = new Bishop("white", { row: 0, col: 2 }, board);
    board.showBoard()
  });

  test("can move diagonally", () => {
    expect(bishop.canMove({ row: 3, col: 5 })).toBe(true);
    expect(bishop.canMove({ row: 2, col: 0 })).toBe(true);
  });

  test("cannot move straight", () => {
    expect(bishop.canMove({ row: 0, col: 5 })).toBe(false); // Horizontal
    expect(bishop.canMove({ row: 3, col: 2 })).toBe(false); // Vertical
  });

  test("cannot make non-square diagonal moves", () => {
    expect(bishop.canMove({ row: 2, col: 3 })).toBe(false); // Not same x/y distance
    expect(bishop.canMove({ row: 1, col: 4 })).toBe(false);
  });

  test("cannot jump over pieces", () => {
    // Block multiple squares along path
    new Pawn("black", { row: 1, col: 3 }, board);
    new Pawn("black", { row: 2, col: 4 }, board);
    expect(bishop.canMove({ row: 3, col: 5 })).toBe(false);
  });

  test("can capture opponent piece", () => {
    const opponent = new Bishop("black", { row: 3, col: 5 }, board);
    expect(bishop.canMove({ row: 3, col: 5 })).toBe(true);
  });

  test("cannot capture own piece", () => {
    const ally = new Bishop("white", { row: 3, col: 5 }, board);
    expect(bishop.canMove({ row: 3, col: 5 })).toBe(false);
  });

  test("edge movements", () => {
    const edgeBishop = new Bishop("white", { row: 0, col: 0 }, board);
    expect(edgeBishop.canMove({ row: 7, col: 7 })).toBe(true); // Long diagonal
    expect(edgeBishop.canMove({ row: 1, col: 1 })).toBe(true); // Short diagonal
    expect(edgeBishop.canMove({ row: 0, col: 1 })).toBe(false); // Not diagonal
  });

  test("different starting positions", () => {
    const centerBishop = new Bishop("white", { row: 4, col: 4 }, board);
    expect(centerBishop.canMove({ row: 6, col: 6 })).toBe(true);
    expect(centerBishop.canMove({ row: 2, col: 6 })).toBe(true);
    expect(centerBishop.canMove({ row: 4, col: 6 })).toBe(false);
  });

  test("blocked at different positions", () => {
    const centerBishop = new Bishop("white", { row: 3, col: 3 }, board);
    new Pawn("black", { row: 4, col: 4 }, board);
    expect(centerBishop.canMove({ row: 5, col: 5 })).toBe(false);
  });
});

import { Board } from "../Board";
import { King } from "../Piece";
import { Player } from "../Piece";

describe("King", () => {
  let board: Board;
  let king: King;

  beforeEach(() => {
    board = new Board();
    king = new King("white", { row: 0, col: 4 }, board);
  });

  test("can move one square in any direction", () => {
    expect(king.canMove({ row: 1, col: 3 })).toBe(true); // Diagonal
    expect(king.canMove({ row: 0, col: 3 })).toBe(true); // Horizontal
    expect(king.canMove({ row: 1, col: 4 })).toBe(true); // Vertical
  });

  test("cannot move more than one square", () => {
    expect(king.canMove({ row: 2, col: 4 })).toBe(false); // Vertical
    expect(king.canMove({ row: 0, col: 6 })).toBe(false); // Horizontal
    expect(king.canMove({ row: 2, col: 6 })).toBe(false); // Diagonal
  });

  test("can capture opponent piece", () => {
    const opponent = new King("black", { row: 1, col: 3 }, board);
    expect(king.canMove({ row: 1, col: 3 })).toBe(true);
  });

  test("cannot capture own piece", () => {
    new King("white", { row: 1, col: 3 }, board);
    expect(king.canMove({ row: 1, col: 3 })).toBe(false);
  });
});

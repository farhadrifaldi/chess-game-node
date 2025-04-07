import { Board } from "../Board";
import { Knight } from "../Piece";
import { Player } from "../Piece";

describe("Knight", () => {
  let board: Board;
  let knight: Knight;

  beforeEach(() => {
    board = new Board();
    knight = new Knight("white", { row: 0, col: 1 }, board);
  });

  test("can move in L-shape (2 horizontal, 1 vertical)", () => {
    expect(knight.canMove({ row: 2, col: 0 })).toBe(true);
    expect(knight.canMove({ row: 2, col: 2 })).toBe(true);
  });

  test("can move in L-shape (1 horizontal, 2 vertical)", () => {
    expect(knight.canMove({ row: 1, col: 3 })).toBe(true);
  });

  test("can jump over other pieces", () => {
    expect(knight.canMove({ row: 2, col: 0 })).toBe(true); // Should jump over pawn at (1,0)
  });

  test("cannot move in straight lines", () => {
    expect(knight.canMove({ row: 0, col: 3 })).toBe(false); // Horizontal
    expect(knight.canMove({ row: 2, col: 1 })).toBe(false); // Vertical
  });

  test("can capture opponent piece", () => {
    new Knight("black", { row: 2, col: 0 }, board);
    expect(knight.canMove({ row: 2, col: 0 })).toBe(true);
  });

  test("cannot capture own piece", () => {
    const ally = new Knight("white", { row: 2, col: 0 }, board);
    expect(knight.canMove({ row: 2, col: 0 })).toBe(false);
  });
});

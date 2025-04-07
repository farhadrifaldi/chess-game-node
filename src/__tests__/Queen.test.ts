import { Board } from "../Board";
import { Bishop, Queen } from "../Piece";
import { Player } from "../Piece";

describe("Queen", () => {
  let board: Board;
  let queen: Queen;

  beforeEach(() => {
    board = new Board();
    queen = new Queen("white", { row: 0, col: 3 }, board);
  });

  test("can move diagonally", () => {
    expect(queen.canMove({ row: 3, col: 0 })).toBe(true);
    expect(queen.canMove({ row: 3, col: 6 })).toBe(true);
  });

  test("can move vertically", () => {
    expect(queen.canMove({ row: 3, col: 3 })).toBe(true);
  });

  test("can move horizontally", () => {
    expect(queen.canMove({ row: 0, col: 6 })).toBe(true);
  });

  test("cannot jump over pieces", () => {
    new Bishop("black", { row: 0, col: 4 }, board); // place a bishop in the way
    expect(queen.canMove({ row: 0, col: 5 })).toBe(false); // Blocked by bishop at (0,2)
  });

  test("can capture opponent piece", () => {
    new Queen("black", { row: 3, col: 0 }, board);
    expect(queen.canMove({ row: 3, col: 0 })).toBe(true);
  });

  test("cannot capture own piece", () => {
    new Queen("white", { row: 3, col: 0 }, board);
    expect(queen.canMove({ row: 3, col: 0 })).toBe(false);
  });
});

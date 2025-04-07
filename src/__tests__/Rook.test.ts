import { Board } from "../Board";
import { Rook } from "../Piece";
import { Player } from "../Piece";

describe("Rook", () => {
  let board: Board;
  let rook: Rook;

  beforeEach(() => {
    board = new Board();
    rook = new Rook("white", { row: 0, col: 0 }, board);
  });

  test("can move vertically", () => {
    expect(rook.canMove({ row: 4, col: 0 })).toBe(true);
  });

  test("can move horizontally", () => {
    expect(rook.canMove({ row: 0, col: 4 })).toBe(true);
  });

  test("cannot move diagonally", () => {
    expect(rook.canMove({ row: 4, col: 4 })).toBe(false);
  });

  test("cannot jump over pieces", () => {
    new Rook("white", { row: 0, col: 1 }, board);
    expect(rook.canMove({ row: 0, col: 2 })).toBe(false); // Blocked by knight at (0,1)
  });

  test("can capture opponent piece", () => {
    new Rook("black", { row: 0, col: 3 }, board);
    expect(rook.canMove({ row: 0, col: 3 })).toBe(true);
  });

  test("cannot capture own piece", () => {
    new Rook("white", { row: 0, col: 3 }, board);
    expect(rook.canMove({ row: 0, col: 3 })).toBe(false);
  });
});

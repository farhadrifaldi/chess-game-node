import { Board } from "../Board";
import { Pawn, Rook } from "../Piece";
import { Player } from "../Piece";

describe("Pawn", () => {
  let board: Board;
  let whitePawn: Pawn;
  let blackPawn: Pawn;

  beforeEach(() => {
    board = new Board();
    whitePawn = new Pawn("white", { row: 1, col: 0 }, board);
    blackPawn = new Pawn("black", { row: 6, col: 0 }, board);
  });

  test("white pawn can move forward one square", () => {
    expect(whitePawn.canMove({ row: 2, col: 0 })).toBe(true);
  });

  test("black pawn can move forward one square", () => {
    expect(blackPawn.canMove({ row: 5, col: 0 })).toBe(true);
  });

  test("white pawn can move two squares on first move", () => {
    expect(whitePawn.canMove({ row: 3, col: 0 })).toBe(true);
  });

  test("black pawn can move two squares on first move", () => {
    expect(blackPawn.canMove({ row: 4, col: 0 })).toBe(true);
  });

  test("pawn cannot move backward", () => {
    expect(whitePawn.canMove({ row: 0, col: 0 })).toBe(false);
    expect(blackPawn.canMove({ row: 7, col: 0 })).toBe(false);
  });

  test("pawn cannot move diagonally without capturing", () => {
    expect(whitePawn.canMove({ row: 2, col: 1 })).toBe(false);
    expect(blackPawn.canMove({ row: 5, col: 1 })).toBe(false);
  });

  test("white pawn can capture diagonally", () => {
    // Place black piece diagonally in front
    board.showBoard()
    new Rook("black", { row: 2, col: 1 }, board);
    expect(whitePawn.canMove({ row: 2, col: 1 })).toBe(true);
    board.showBoard()
  });

  test("black pawn can capture diagonally", () => {
    // Place white piece diagonally in front
    new Rook("white", { row: 5, col: 1 }, board);
    expect(blackPawn.canMove({ row: 5, col: 1 })).toBe(true);
  });

  test("pawn cannot capture ally piece", () => {
    // Place white piece diagonally in front
    new Rook("white", { row: 2, col: 1 }, board);
    expect(whitePawn.canMove({ row: 2, col: 1 })).toBe(false);
  });

  test("pawn cannot move forward when blocked", () => {
    // Place piece directly in front
    new Rook("black", { row: 2, col: 0 }, board);
    expect(whitePawn.canMove({ row: 2, col: 0 })).toBe(false);
    expect(whitePawn.canMove({ row: 3, col: 0 })).toBe(false);
  });

  test("pawn at edge of board cannot move outside", () => {
    const edgeWhitePawn = new Pawn("white", { row: 1, col: 7 }, board);
    expect(edgeWhitePawn.canMove({ row: 2, col: 7 })).toBe(true);
    expect(edgeWhitePawn.canMove({ row: 2, col: 8 })).toBe(false);
  });
});

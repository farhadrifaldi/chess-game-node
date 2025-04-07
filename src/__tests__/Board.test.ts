import { Board } from "../Board";
import { PieceKey } from "../Piece";

describe("Board", () => {
  let board: Board;

  beforeEach(() => {
    board = new Board();
  });

  test("should initialize with correct piece placement", () => {
    // Test pawns
    for (let i = 0; i < 8; i++) {
      expect(board.getPiece({ row: 1, col: i })?.getType()).toBe(PieceKey.pawn);
      expect(board.getPiece({ row: 6, col: i })?.getType()).toBe(PieceKey.pawn);
    }

    // Test rooks
    expect(board.getPiece({ row: 0, col: 0 })?.getType()).toBe(PieceKey.rook);
    expect(board.getPiece({ row: 0, col: 7 })?.getType()).toBe(PieceKey.rook);
    expect(board.getPiece({ row: 7, col: 0 })?.getType()).toBe(PieceKey.rook);
    expect(board.getPiece({ row: 7, col: 7 })?.getType()).toBe(PieceKey.rook);

    // Test knights
    expect(board.getPiece({ row: 0, col: 1 })?.getType()).toBe(PieceKey.knight);
    expect(board.getPiece({ row: 0, col: 6 })?.getType()).toBe(PieceKey.knight);
    expect(board.getPiece({ row: 7, col: 1 })?.getType()).toBe(PieceKey.knight);
    expect(board.getPiece({ row: 7, col: 6 })?.getType()).toBe(PieceKey.knight);

    // Test bishops
    expect(board.getPiece({ row: 0, col: 2 })?.getType()).toBe(PieceKey.bishop);
    expect(board.getPiece({ row: 0, col: 5 })?.getType()).toBe(PieceKey.bishop);
    expect(board.getPiece({ row: 7, col: 2 })?.getType()).toBe(PieceKey.bishop);
    expect(board.getPiece({ row: 7, col: 5 })?.getType()).toBe(PieceKey.bishop);

    // Test queens
    expect(board.getPiece({ row: 0, col: 3 })?.getType()).toBe(PieceKey.queen);
    expect(board.getPiece({ row: 7, col: 4 })?.getType()).toBe(PieceKey.queen);

    // Test kings
    expect(board.getPiece({ row: 0, col: 4 })?.getType()).toBe(PieceKey.king);
    expect(board.getPiece({ row: 7, col: 3 })?.getType()).toBe(PieceKey.king);
  });

  test("should move pieces correctly", () => {
    const pawn = board.getPiece({ row: 1, col: 0 });
    board.movePiece({ row: 2, col: 0 }, pawn!);
    expect(board.getPiece({ row: 2, col: 0 })).toBe(pawn);
    expect(board.getPiece({ row: 1, col: 0 })).toBeNull();
  });

  test("should show board correctly", () => {
    const consoleSpy = jest.spyOn(console, 'log');
    board.showBoard();
    expect(consoleSpy).toHaveBeenCalled();
    expect(consoleSpy.mock.calls[0][0]).toContain('a  b  c  d  e  f  g  h');
  });
});

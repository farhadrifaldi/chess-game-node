import { Board } from "../Board";
import { Bishop, King, Knight, Pawn, PieceKey, Queen, Rook } from "../Piece";

function setupPieces(board: Board) {
  // SETUP PAWN PIECES WHITE & BLACK
  for (let i = 0; i < board.getBoardArr().length; i++) {
    new Pawn("white", { row: 1, col: i }, board);
    new Pawn("black", { row: 6, col: i }, board);
  }

  // ROOK
  new Rook("white", { row: 0, col: 0 }, board);
  new Rook("white", { row: 0, col: 7 }, board);
  new Rook("black", { row: 7, col: 0 }, board);
  new Rook("black", { row: 7, col: 7 }, board);

  // KNIGHT
  new Knight("white", { row: 0, col: 1 }, board);
  new Knight("white", { row: 0, col: 6 }, board);
  new Knight("black", { row: 7, col: 1 }, board);
  new Knight("black", { row: 7, col: 6 }, board);

  // BISHOP
  new Bishop("white", { row: 0, col: 2 }, board);
  new Bishop("white", { row: 0, col: 5 }, board);
  new Bishop("black", { row: 7, col: 2 }, board);
  new Bishop("black", { row: 7, col: 5 }, board);

  // QUEEN
  new Queen("white", { row: 0, col: 4 }, board);
  new Queen("black", { row: 7, col: 4 }, board);

  // KING
  new King("white", { row: 0, col: 3 }, board);
  new King("black", { row: 7, col: 3 }, board);
}

describe("Board", () => {
  let board: Board;

  beforeEach(() => {
    board = new Board();
    setupPieces(board);
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
    expect(board.getPiece({ row: 0, col: 4 })?.getType()).toBe(PieceKey.queen);
    expect(board.getPiece({ row: 7, col: 4 })?.getType()).toBe(PieceKey.queen);

    // Test kings
    expect(board.getPiece({ row: 0, col: 3 })?.getType()).toBe(PieceKey.king);
    expect(board.getPiece({ row: 7, col: 3 })?.getType()).toBe(PieceKey.king);
  });

  test("should move pieces correctly", () => {
    const pawn = board.getPiece({ row: 1, col: 0 });
    board.movePiece({ row: 2, col: 0 }, pawn!);
    expect(board.getPiece({ row: 2, col: 0 })).toBe(pawn);
    expect(board.getPiece({ row: 1, col: 0 })).toBeNull();
  });

  test("should show board correctly", () => {
    const consoleSpy = jest.spyOn(console, "log");
    board.showBoard();
    expect(consoleSpy).toHaveBeenCalled();
    expect(consoleSpy.mock.calls[0][0]).toContain("a  b  c  d  e  f  g  h");
  });
});

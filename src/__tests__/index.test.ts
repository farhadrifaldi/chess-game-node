import { Board } from "../Board";
import { Bishop, King, Knight, Pawn, Piece, Queen, Rook } from "../Piece";
import { inputIsValid, parseCoordinate, changePlayer, playerIsValidToMoveThePiece, setupPieces } from "../index";

describe("inputIsValid", () => {
  test("valid input format", () => {
    expect(inputIsValid("a1 a2")).toBe(true);
    expect(inputIsValid("h8 h1")).toBe(true);
  });

  test("invalid input format", () => {
    expect(inputIsValid("a1")).toBe(false); // Missing destination
    expect(inputIsValid("a1 a2 a3")).toBe(false); // Too many parts
    expect(inputIsValid("a9 a1")).toBe(false); // Invalid row
    expect(inputIsValid("i1 a1")).toBe(false); // Invalid column
    expect(inputIsValid("a1 b9")).toBe(false); // Invalid destination row
  });
});

describe("parseCoordinate", () => {
  test("valid coordinate parsing", () => {
    const result = parseCoordinate("a1 b2");
    expect(result.start).toEqual({ row: 0, col: 0 });
    expect(result.end).toEqual({ row: 1, col: 1 });
  });

  test("edge case coordinates", () => {
    const result = parseCoordinate("h8 a1");
    expect(result.start).toEqual({ row: 7, col: 7 });
    expect(result.end).toEqual({ row: 0, col: 0 });
  });
});

describe("changePlayer", () => {
  test("switches player correctly", () => {
    expect(changePlayer("white")).toBe("black");
    expect(changePlayer("black")).toBe("white");
  });
});

describe("playerIsValidToMoveThePiece", () => {
  const board = new Board();
  const whitePawn = new Pawn("white", { row: 1, col: 0 }, board);
  const blackPawn = new Pawn("black", { row: 6, col: 0 }, board);

  test("valid player moves", () => {
    expect(playerIsValidToMoveThePiece(whitePawn, "white")).toBe(true);
    expect(playerIsValidToMoveThePiece(blackPawn, "black")).toBe(true);
  });

  test("invalid player moves", () => {
    expect(playerIsValidToMoveThePiece(whitePawn, "black")).toBe(false);
    expect(playerIsValidToMoveThePiece(blackPawn, "white")).toBe(false);
  });
});

describe("setupPieces", () => {
  test("correctly sets up initial board", () => {
    const board = new Board();
    setupPieces(board);

    // Test pawns
    for (let i = 0; i < 8; i++) {
      const whitePawn = board.getPiece({ row: 1, col: i });
      const blackPawn = board.getPiece({ row: 6, col: i });
      expect(whitePawn).toBeInstanceOf(Pawn);
      expect(whitePawn?.getPlayer()).toBe("white");
      expect(blackPawn).toBeInstanceOf(Pawn);
      expect(blackPawn?.getPlayer()).toBe("black");
    }

    // Test rooks
    expect(board.getPiece({ row: 0, col: 0 })).toBeInstanceOf(Rook);
    expect(board.getPiece({ row: 0, col: 7 })).toBeInstanceOf(Rook);
    expect(board.getPiece({ row: 7, col: 0 })).toBeInstanceOf(Rook);
    expect(board.getPiece({ row: 7, col: 7 })).toBeInstanceOf(Rook);

    // Test knights
    expect(board.getPiece({ row: 0, col: 1 })).toBeInstanceOf(Knight);
    expect(board.getPiece({ row: 0, col: 6 })).toBeInstanceOf(Knight);
    expect(board.getPiece({ row: 7, col: 1 })).toBeInstanceOf(Knight);
    expect(board.getPiece({ row: 7, col: 6 })).toBeInstanceOf(Knight);

    // Test bishops
    expect(board.getPiece({ row: 0, col: 2 })).toBeInstanceOf(Bishop);
    expect(board.getPiece({ row: 0, col: 5 })).toBeInstanceOf(Bishop);
    expect(board.getPiece({ row: 7, col: 2 })).toBeInstanceOf(Bishop);
    expect(board.getPiece({ row: 7, col: 5 })).toBeInstanceOf(Bishop);

    // Test queens
    expect(board.getPiece({ row: 0, col: 3 })).toBeInstanceOf(Queen);
    expect(board.getPiece({ row: 7, col: 4 })).toBeInstanceOf(Queen);

    // Test kings
    expect(board.getPiece({ row: 0, col: 4 })).toBeInstanceOf(King);
    expect(board.getPiece({ row: 7, col: 3 })).toBeInstanceOf(King);
  });
});

// Note: Testing the main() function would require mocking readline-sync
// and is more suited for integration/end-to-end testing

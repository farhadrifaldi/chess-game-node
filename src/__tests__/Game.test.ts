jest.mock("readline-sync", () => ({
  __esModule: true,
  question: jest.fn(),
}));

import { Board } from "../Board";
import { Game } from "../Game";
import { Bishop, King, Knight, Pawn, Queen, Rook } from "../Piece";

describe("Game", () => {
  let board: Board;
  let game: Game;

  beforeEach(() => {
    board = new Board();
    game = new Game(board);
  });

  describe("input validation", () => {
    test("accepts valid move format", () => {
      expect(game.inputIsValid("a1 a2")).toBe(true);
      expect(game.inputIsValid("h8 h1")).toBe(true);
    });

    test("rejects invalid formats", () => {
      // Missing destination
      expect(game.inputIsValid("a1")).toBe(false);
      // Too many parts
      expect(game.inputIsValid("a1 a2 a3")).toBe(false);
      // Invalid rows
      expect(game.inputIsValid("a9 a1")).toBe(false);
      expect(game.inputIsValid("a0 a1")).toBe(false);
      // Invalid columns
      expect(game.inputIsValid("i1 a1")).toBe(false);
      expect(game.inputIsValid("a1 j1")).toBe(false);
      // Mixed invalid
      expect(game.inputIsValid("a9 b0")).toBe(false);
    });
  });

  describe("coordinate parsing", () => {
    test("converts algebraic notation to coordinates", () => {
      const result = game.parseCoordinate("a1 b2");
      expect(result.start).toEqual({ row: 0, col: 0 });
      expect(result.end).toEqual({ row: 1, col: 1 });
    });

    test("handles edge cases", () => {
      // Bottom-left to top-right
      const result1 = game.parseCoordinate("a1 h8");
      expect(result1.start).toEqual({ row: 0, col: 0 });
      expect(result1.end).toEqual({ row: 7, col: 7 });

      // Top-right to bottom-left
      const result2 = game.parseCoordinate("h8 a1");
      expect(result2.start).toEqual({ row: 7, col: 7 });
      expect(result2.end).toEqual({ row: 0, col: 0 });
    });
  });

  describe("player management", () => {
    test("switches player correctly", () => {
      // first player should be white
      game.changePlayer();
      expect(game.getCurrentPlayer()).toBe("black");
      game.changePlayer();
      expect(game.getCurrentPlayer()).toBe("white");
    });

    test("validates player can move piece", () => {
      new Pawn("white", { row: 1, col: 0 }, board); // a2
      new Pawn("black", { row: 6, col: 0 }, board); // a7

      // Valid moves
      expect(game.playerIsValidToMoveThePiece("a2 a3")).toBe(true); // white pawn moved by white player
      game.changePlayer(); // change player!
      expect(game.playerIsValidToMoveThePiece("a7 a6")).toBe(true); // black pawn moved by black player

      // Invalid moves
      game.changePlayer(); // change player! back to white player
      expect(game.playerIsValidToMoveThePiece("a6 a5")).toBe(false); // a6 where black pawn is placed currently
      game.changePlayer(); // change player! back to black player
      expect(game.playerIsValidToMoveThePiece("a3 a4")).toBe(false);
    });
  });

  describe("board setup", () => {
    test("initializes pieces in correct positions", () => {
      game.setupPieces(board);

      // Verify pawns
      for (let col = 0; col < 8; col++) {
        const whitePawn = board.getPiece({ row: 1, col });
        const blackPawn = board.getPiece({ row: 6, col });

        expect(whitePawn).toBeInstanceOf(Pawn);
        expect(whitePawn?.getPlayer()).toBe("white");
        expect(blackPawn).toBeInstanceOf(Pawn);
        expect(blackPawn?.getPlayer()).toBe("black");
      }

      // Verify back row pieces
      const backRowPieces = [
        { col: 0, type: Rook },
        { col: 1, type: Knight },
        { col: 2, type: Bishop },
        { col: 3, type: King },
        { col: 4, type: Queen },
        { col: 5, type: Bishop },
        { col: 6, type: Knight },
        { col: 7, type: Rook },
      ];

      // White back row (row 0)
      backRowPieces.forEach(({ col, type }) => {
        const piece = board.getPiece({ row: 0, col });
        expect(piece).toBeInstanceOf(type);
        expect(piece?.getPlayer()).toBe("white");
      });

      // Black back row (row 7)
      backRowPieces.forEach(({ col, type }) => {
        const piece = board.getPiece({ row: 7, col });
        expect(piece).toBeInstanceOf(type);
        expect(piece?.getPlayer()).toBe("black");
      });
    });

    test("leaves middle rows empty", () => {
      game.setupPieces(board);

      // Verify empty middle rows
      for (let row = 2; row < 6; row++) {
        for (let col = 0; col < 8; col++) {
          expect(board.getPiece({ row, col })).toBeNull();
        }
      }
    });
  });

  describe("game flow", () => {
    let mockQuestion: jest.Mock;

    beforeEach(() => {
      jest.resetAllMocks();
      mockQuestion = (require("readline-sync") as any).question;
      game = new Game(board);
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    test("should run game loop until exit", () => {
      // Setup initial board
      game.setupPieces(board);

      // Mock user input sequence
      mockQuestion
        .mockReturnValueOnce("a2 a3") // valid white move
        .mockReturnValueOnce("a7 a6") // valid black move
        .mockReturnValueOnce("exit"); // exit game

      game.main();

      expect(mockQuestion).toHaveBeenCalledTimes(3);
    });

    test("should handle invalid input", () => {
      game.setupPieces(board);

      mockQuestion
        .mockReturnValueOnce("invalid") // invalid format
        .mockReturnValueOnce("a9 a1") // invalid coordinates
        .mockReturnValueOnce("a2 a3") // valid move
        .mockReturnValueOnce("exit");

      const consoleSpy = jest.spyOn(console, "log");
      game.main();

      expect(consoleSpy).toHaveBeenCalledWith("Input is not valid");
      expect(mockQuestion).toHaveBeenCalledTimes(4);
    });

    test("should detect wrong player moving piece", () => {
      new Pawn("white", { row: 1, col: 0 }, board); // a2
      new Pawn("black", { row: 6, col: 0 }, board); // a7

      mockQuestion
        .mockReturnValueOnce("a7 a6") // black tries to move first (should fail)
        .mockReturnValueOnce("a2 a3") // white moves
        .mockReturnValueOnce("exit");

      const consoleSpy = jest.spyOn(console, "log");
      game.main();

      expect(consoleSpy).toHaveBeenCalledWith(
        "The piece is not valid to be moved with current player"
      );
      expect(mockQuestion).toHaveBeenCalledTimes(3);
    });

    test("should end game when king is captured", () => {
      // Setup board with kings in vulnerable positions
      new King("black", { row: 0, col: 0 }, board); // a1
      new Rook("white", { row: 0, col: 1 }, board); // b1

      mockQuestion.mockReturnValueOnce("b1 a1"); // white rook captures black king

      const consoleSpy = jest.spyOn(console, "log");

      game.main();

      // get secong console log
      expect(consoleSpy.mock.calls[1][0]).toMatch(
        /black player's King is Captured White player wins/
      );
      expect(mockQuestion).toHaveBeenCalledTimes(1);
    });
  });
});

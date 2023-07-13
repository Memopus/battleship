const PLAYER = require("./player");
const GAMEBOARD = require("./gameBoard");
const SHIP = require("./ship");

describe("Player functionalities", () => {
  test("Player Attack ", () => {
    const player = PLAYER("Memopus", false);
    const board = GAMEBOARD();
    board.createBoard();
    board.placeShip(SHIP(3), [0, 1]);

    expect(player.attack(board, [0, 1])).toBe("hitted");
    expect(player.attack(board, [0, 1])).toBe("coords already attacked");
    expect(player.attack(board, [0, 6])).toBe("missed");
  });

  test("Player Turn", () => {
    const player = PLAYER("AI", true);
    expect(player.turn).toBe(false);
  });
});

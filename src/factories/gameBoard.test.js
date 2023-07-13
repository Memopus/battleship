const gameBoard = require("./gameBoard");
const GAMEBOARD_FACTORY = require("./gameBoard");
const SHIP_FACTORY = require("./ship");
const board = GAMEBOARD_FACTORY();
const ship = SHIP_FACTORY(3);

describe("Board Functionalities", () => {
  const expectedBoard = [];

  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      expectedBoard.push([j, i, "empty"]);
    }
  }
  test("Create Board", () => {
    expect(board.createBoard()).toEqual(expectedBoard);
  });

  test("Place Ship horizontaly", () => {
    board.createBoard();
    expect(board.placeShip(ship, [1, 4])).toEqual({
      starting: [1, 4],
      ending: [1 + ship.length - 1, 4],
    });
  });

  test("Place Ship vertically", () => {
    expect(board.placeShip(SHIP_FACTORY(3, "v"), [9, 1])).toEqual({
      starting: [9, 1],
      ending: [9, 1 + ship.length - 1],
    });
  });

  test("can't place 2 ships in same place", () => {
    board.placeShip(SHIP_FACTORY(3), [0, 1]);
    expect(board.placeShip(SHIP_FACTORY(2), [1, 1])).toBe(
      "Couldn't place ship"
    );
  });

  test("Receive attack 'missed'", () => {
    board.placeShip(ship, [1, 3]);
    expect(board.receiveAttack([0, 0])).toBe("missed");
  });

  test("Receive attack 'hitted'", () => {
    board.placeShip(ship, [1, 3]);
    expect(board.receiveAttack([3, 3])).toBe("hitted");
  });

  test("Receive attack in coords off the gameBoard", () => {
    expect(board.receiveAttack([0, -1])).toBe();
  });

  test("isAllSunk 'case false'", () => {
    expect(board.isAllSunk()).toBe(false);
  });
  test("isAllSunk 'case true'", () => {
    const fisrtShip = SHIP_FACTORY(2);
    const secondShip = SHIP_FACTORY(1);

    const board = gameBoard();

    board.createBoard();

    board.placeShip(fisrtShip, [1, 4]);
    board.placeShip(secondShip, [4, 1]);
    board.receiveAttack([1, 4]);
    board.receiveAttack([2, 4]);
    board.receiveAttack([4, 1]);

    expect(board.isAllSunk()).toBe(true);
  });
});

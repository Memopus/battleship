const SHIP_FACTORY = require("./ship");

let ship;

describe("Ship functionalities", () => {
  beforeEach(() => {
    ship = SHIP_FACTORY(3);
  });

  test("hit ship", () => {
    ship.hit();
    expect(ship.hits).toBe(1);
  });
  test("multiple hits ship", () => {
    ship.hit();
    ship.hit();

    expect(ship.hits).toBe(2);
  });

  test("ship didn't sunk ", () => {
    expect(ship.isSunk()).not.toBeTruthy();
  });

  test("ship sunk", () => {
    for (let i = 0; i < ship.length; i++) {
      ship.hit();
    }
    expect(ship.isSunk()).toBeTruthy();
  });
});

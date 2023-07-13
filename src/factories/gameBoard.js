function gameBoard() {
  const board = [];
  const shipsCoords = [];
  const missedShots = [];
  const ships = [];
  const allShots = [];
  const hitCoords = [];

  function createBoard() {
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        board.push([j, i, "empty"]);
      }
    }
    return board;
  }

  function placeShip(ship, positionStart) {
    let coords;
    const allShipPositions = [];
    const flattenedCoords = shipsCoords.flat();

    const positionIndex = board.indexOf(
      board.find(
        (element) =>
          element[0] === positionStart[0] && element[1] === positionStart[1]
      )
    );
    if (ship.position === "h") {
      coords = {
        starting: [board[positionIndex][0], board[positionIndex][1]],
        ending: [
          board[positionIndex][0] + ship.length - 1,
          board[positionIndex][1],
        ],
      };
    } else if (ship.position === "v") {
      coords = {
        starting: [board[positionIndex][0], board[positionIndex][1]],
        ending: [
          board[positionIndex][0],
          board[positionIndex][1] + ship.length - 1,
        ],
      };
    }

    for (let i = 0; i < ship.length; i++) {
      let coordsXY;
      if (ship.position === "h") {
        coordsXY = board.find(
          (element) =>
            element[0] === board[positionIndex][0] + i &&
            element[1] === board[positionIndex][1]
        );
      } else if (ship.position === "v") {
        coordsXY = board.find(
          (element) =>
            element[0] === board[positionIndex][0] &&
            element[1] === board[positionIndex][1] + i
        );
      }
      const x = coordsXY[0];
      const y = coordsXY[1];

      if (
        flattenedCoords.some(
          ([coordsX, coordsY]) => coordsX === x && coordsY === y
        )
      ) {
        return "Couldn't place ship";
      }
    }

    for (let i = 0; i < ship.length; i++) {
      if (ship.position === "h") {
        const shipPosition = board.find(
          (element) =>
            element[0] === board[positionIndex][0] + i &&
            element[1] === board[positionIndex][1]
        );

        allShipPositions.push(shipPosition);

        const index = board.indexOf(
          board.find(
            (element) =>
              element[0] === board[positionIndex][0] + i &&
              element[1] === board[positionIndex][1]
          )
        );
        board[index][2] = ship;
      } else if (ship.position === "v") {
        const shipPosition = board.find(
          (element) =>
            element[0] === board[positionIndex][0] &&
            element[1] === board[positionIndex][1] + i
        );

        allShipPositions.push(shipPosition);
        const index = board.indexOf(shipPosition);
        board[index][2] = ship;
      }
    }

    shipsCoords.push(allShipPositions);
    ships.push(ship);
    return coords;
  }

  function receiveAttack(coords) {
    if (
      coords[0] >= 0 &&
      coords[1] >= 0 &&
      coords[0] <= 10 &&
      coords[1] <= 10
    ) {
      for (let i = 0; i < allShots.length; i++) {
        if (allShots[i][0] === coords[0] && allShots[i][1] === coords[1]) {
          return "coords already attacked";
        }
      }

      for (let i = 0; i < shipsCoords.length; i++) {
        for (let j = 0; j < shipsCoords[i].length; j++) {
          if (
            shipsCoords[i][j][0] === coords[0] &&
            shipsCoords[i][j][1] === coords[1]
          ) {
            shipsCoords[i][j][2].hit(coords);
            allShots.push(coords);
            hitCoords.push(coords);
            return "hitted";
          }
        }
      }
      missedShots.push(coords);
      allShots.push(coords);
      return "missed";
    } else {
      return;
    }
  }

  function isAllSunk() {
    for (let i = 0; i < ships.length; i++) {
      if (!ships[i].isSunk()) {
        // console.log(ships, shipsCoords);
        return false;
      }
    }
    return true;
  }

  return {
    createBoard,
    board,
    placeShip,
    receiveAttack,
    missedShots,
    isAllSunk,
    hitCoords,
  };
}

module.exports = gameBoard;

import loadBoard from "./loadBoard";
import Ship from "../factories/ship";
import PopUp from "./popUp";

export default function Menu(callback) {
  const ships = [Ship(2), Ship(3), Ship(3), Ship(4), Ship(5)];
  const mainDiv = document.querySelector("#root");
  const boardDiv = document.createElement("div");
  const title = document.createElement("h1");
  const shipsContainer = document.createElement("div");
  const shipsTitle = document.createElement("h1");
  const shipsSubTitle = document.createElement("h2");
  const shipsDiv = document.createElement("div");
  const rotate = document.createElement("button");
  let startBtn;
  let draggedShip = null;
  let draggedSquare = null;

  boardDiv.classList.add("player-board");
  shipsContainer.classList.add("ships-container");
  shipsDiv.classList.add("ships");
  rotate.classList.add("rotate");

  rotate.innerHTML = "Rotate <i class='fa-solid fa-rotate'></i>";
  title.textContent = "Your Board";
  shipsTitle.textContent = "Place your ships";
  shipsSubTitle.textContent = "Drag n' Drop";

  shipsContainer.appendChild(shipsTitle);
  shipsContainer.appendChild(shipsSubTitle);
  shipsContainer.appendChild(rotate);
  shipsContainer.appendChild(shipsDiv);
  boardDiv.appendChild(title);
  mainDiv.appendChild(boardDiv);

  const board = loadBoard(boardDiv);

  ships.forEach((ship) => {
    const shipForm = document.createElement("div");
    shipForm.setAttribute("id", ships.indexOf(ship));
    shipForm.setAttribute("draggable", true);
    for (let i = 0; i < ship.length; i++) {
      const square = document.createElement("div");

      square.classList.add("square");
      square.setAttribute("id", i);
      shipForm.classList.add("ship");
      shipForm.setAttribute("data-length", ship.length);

      shipForm.appendChild(square);
    }
    shipsDiv.appendChild(shipForm);
  });

  window.addEventListener("mousedown", (e) => {
    draggedSquare = e.target;
  });

  window.addEventListener("dragstart", (e) => {
    draggedShip = e.target;
  });

  rotate.addEventListener("click", () => {
    const shipContainers = document.querySelectorAll(".ship");

    ships.forEach((ship) => {
      ship.position = ship.position === "h" ? "v" : "h";
    });
    if (ships[0].position === "v") {
      shipsDiv.style.flexDirection = "row";
      shipContainers.forEach((ship) => {
        ship.style.flexDirection = "column";
      });
    } else {
      shipsDiv.style.flexDirection = "column";
      shipContainers.forEach((ship) => {
        ship.style.flexDirection = "row";
      });
    }
  });

  window.addEventListener("dragover", (e) => {
    if (e.target.className === "square") {
      e.preventDefault();
    }
  });

  /*
  TODO:

  - Fix the shipOutOfBoard to support vertical ships
  
  */

  boardDiv.addEventListener("drop", (e) => {
    let allPlaced;
    let shipPlaced;
    let popup = false;
    let shipPosition;
    const ship = findShip(ships, draggedShip);
    const target =
      ship.position === "h" ? e.target.dataset.x : e.target.dataset.y;

    if (!isShipOutBoard(target, draggedSquare, draggedShip, ship.position)) {
      let coords;

      if (ship.position === "h") {
        coords = [
          parseInt(e.target.dataset.x) - parseInt(draggedSquare.id),
          parseInt(e.target.dataset.y),
        ];
      } else {
        coords = [
          parseInt(e.target.dataset.x),
          parseInt(e.target.dataset.y) - parseInt(draggedSquare.id),
        ];
      }

      shipPlaced = board.placeShip(ship, coords);
      if (shipPlaced !== "Couldn't place ship") {
        ship.placed = true;
        draggedShip.style.display = "none";
        shipPosition = ship.position;
      }
    } else {
      PopUp("Couldn't place ship", 1000);
    }

    if (shipPlaced !== "Couldn't place ship")
      for (
        let i = parseInt(draggedSquare.id);
        i < draggedShip.dataset.length;
        i++
      ) {
        for (let j = 0; j < draggedShip.dataset.length; j++) {
          let square = null;
          // Check if the last square of the ship will be greater or equal than 10 or less than 0
          if (shipPosition === "h") {
            if (
              parseInt(e.target.dataset.x) +
                parseInt(draggedShip.dataset.length - 1) -
                parseInt(draggedSquare.id) <
                10 &&
              parseInt(e.target.dataset.x) - parseInt(draggedSquare.id) >= 0
            ) {
              square = document.querySelector(
                `[data-x="${
                  parseInt(e.target.dataset.x) + j - draggedSquare.id
                }"][data-y="${e.target.dataset.y}"]`
              );
            }
          } else if (shipPosition === "v") {
            if (
              parseInt(e.target.dataset.y) -
                parseInt(draggedShip.dataset.length - 1) +
                parseInt(draggedSquare.id) >=
              0
            ) {
              square = document.querySelector(
                `[data-x="${parseInt(e.target.dataset.x)}"][data-y="${
                  parseInt(e.target.dataset.y) + j - parseInt(draggedSquare.id)
                }"]`
              );
            } else {
              popup = true;
            }
          }

          if (square) {
            square.style.backgroundColor = "#A4E4FF";
          }
        }
      }
    else {
      PopUp("Couldn't place ship", 1000);
    }

    if (popup) {
      PopUp("Couldn't place ship", 1000);
    }

    allPlaced = isAllPlaced(ships);
    if (allPlaced) {
      startBtn = start(shipsDiv);
    }
    callback(allPlaced, board, boardDiv);
  });

  mainDiv.appendChild(shipsContainer);
}

function findShip(ships, draggedShip) {
  const ship = ships.find(
    (ship) =>
      !ship.placed && ship.length === parseInt(draggedShip.dataset.length)
  );
  return ship;
}

function isAllPlaced(ships) {
  for (let i = 0; i < ships.length; i++) {
    if (!ships[i].placed) {
      return false;
    }
  }

  return true;
}

function start(container) {
  const startBtn = document.createElement("button");

  startBtn.textContent = "Start";

  startBtn.classList.add("start-btn");

  container.appendChild(startBtn);

  return startBtn;
}

function isShipOutBoard(target, draggedSquare, draggedShip, shipPosition) {
  const id = Math.abs(
    parseInt(draggedSquare.id) - parseInt(draggedShip.dataset.length - 1)
  );

  if (shipPosition === "h") {
    if (
      parseInt(target) +
        parseInt(draggedShip.dataset.length - 1) -
        parseInt(draggedSquare.id) <
        10 &&
      parseInt(target) - parseInt(draggedSquare.id) >= 0
    ) {
      return false;
    }
  } else if (shipPosition === "v") {
    if (
      parseInt(target) - parseInt(draggedShip.dataset.length - 1) + id >= 0 &&
      parseInt(target) + id < 10
    ) {
      return false;
    }
  }

  return true;
}

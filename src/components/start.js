import loadBoard from "./loadBoard";
import Menu from "./menu";
import Player from "../factories/player";
import Ship from "../factories/ship";
import PopUp from "./popUp";

let start = true;

export default function startGame(playerBoard) {
  const root = document.querySelector("#root");

  if (start) {
    const computerBoardDiv = document.querySelector(".ships-container");

    const turnDiv = document.createElement("div");
    const turn = document.createElement("h1");
    const title = document.createElement("h1");
    const startBtn = document.querySelector(".start-btn");
    const ships = [Ship(2), Ship(3), Ship(3), Ship(4), Ship(5)];
    const players = {
      player: Player("Memo", false),
      computer: Player("Computer", true),
    };
    let computerBoard;

    turnDiv.classList.add("turn");
    turnDiv.appendChild(turn);

    startBtn.addEventListener("click", () => {
      computerBoardDiv.classList.remove("ships-container");
      computerBoardDiv.classList.add("computer-board");

      computerBoardDiv.innerHTML = "";
      title.textContent = "Computer Board";

      computerBoardDiv.appendChild(title);

      computerBoard = loadBoard(computerBoardDiv);

      ships.forEach((ship) => {
        placeRandomShip(computerBoard, ship);
      });

      turn.textContent = "Player turn";

      root.insertBefore(turnDiv, computerBoardDiv);
    });

    window.addEventListener("click", (e) => {
      if (
        e.target.classList.contains("attacked") ||
        e.target.parentNode.classList.contains("attacked")
      ) {
        PopUp("Position already attacked", 700);
        return;
      }
      if (
        e.target.className === "square" &&
        e.target.parentNode.parentNode.classList.contains("computer-board")
      ) {
        if (players.player.turn) {
          if (e.target.parentNode.classList === "square") {
            e.target = e.target.parentNode;
          }
          const coords = [
            parseInt(e.target.dataset.x),
            parseInt(e.target.dataset.y),
          ];
          const hit = attackBoard(
            playerBoard,
            coords,
            computerBoard,
            players,
            turn,
            computerBoardDiv
          );
          if (hit === "hitted" || hit.hit === "hitted") {
            e.target.innerHTML = "<i class='fa-solid fa-x square-icon'></i>";
            e.target.style.backgroundColor = "red";
            e.target.style.fontSize = "x-large";
          }
          if (hit === "missed" || hit.hit === "missed") {
            e.target.innerHTML = "<i class='fa-solid fa-x square-icon'></i>";
          }
          if (hit !== "missed" && hit !== "hitted") {
            computerBoard = hit.computerBoard;
          }
          e.target.classList.add("attacked");
        }
      }
    });
  }
}

function checkWinner(computerBoard, playerBoard, players, computerBoardDiv) {
  let computerIsAllSunk = computerBoard.isAllSunk();
  let playerIsAllSunk = playerBoard.isAllSunk();

  const boardsCopies = {
    playerBoard: playerBoard,
    computerBoard: computerBoard,
  };

  if (computerIsAllSunk) {
    const restartBtn = gameOver(
      players.player,
      root,
      computerBoardDiv,
      computerBoard
    );

    const restartEvent = () => {
      start = false;

      restart(root, boardsCopies.playerBoard, boardsCopies.computerBoard);

      computerIsAllSunk = false;
      computerBoard = loadBoard(computerBoardDiv);
      restartBtn.removeEventListener("click", restartEvent);
    };

    restartBtn.addEventListener("click", restartEvent);
    return { computerBoard };
  } else if (playerIsAllSunk) {
    const restartBtn = gameOver(
      players.computer,
      root,
      computerBoardDiv,
      computerBoard
    );

    const restartEvent = () => {
      start = false;

      restart(root, boardsCopies.playerBoard, boardsCopies.computerBoard);

      playerIsAllSunk = false;
      computerBoard = loadBoard(computerBoard);

      restartBtn.removeEventListener("click", restartEvent);
    };
    restartBtn.addEventListener("click", restartEvent);

    return { computerBoard };
  }

  return;
}

function placeRandomShip(board, ship) {
  const position = Math.random() >= 0.5 ? 1 : 0;

  if (ship.placed === true) {
    return;
  }

  if (position === 1) {
    ship.position = "v";
  }

  let randomCoords = [
    Math.floor(Math.random() * 10),
    Math.floor(Math.random() * 10),
  ];

  if (ship.position === "h") {
    while (randomCoords[0] + ship.length >= 10) {
      randomCoords = [
        Math.floor(Math.random() * 10),
        Math.floor(Math.random() * 10),
      ];
    }
  } else if (ship.position === "v") {
    while (randomCoords[1] + ship.length >= 10) {
      randomCoords = [
        Math.floor(Math.random() * 10),
        Math.floor(Math.random() * 10),
      ];
    }
  }

  let placed = board.placeShip(ship, randomCoords);
  while (placed === "Couldn't place ship") {
    randomCoords = [
      Math.floor(Math.random() * 10),
      Math.floor(Math.random() * 10),
    ];
    if (ship.position === "h") {
      while (randomCoords[0] + ship.length >= 10) {
        randomCoords = [
          Math.floor(Math.random() * 10),
          Math.floor(Math.random() * 10),
        ];
      }
    } else if (ship.position === "v") {
      while (randomCoords[1] + ship.length >= 10) {
        randomCoords = [
          Math.floor(Math.random() * 10),
          Math.floor(Math.random() * 10),
        ];
      }
    }

    placed = board.placeShip(ship, randomCoords);
  }

  ship.placed = true;
}

function attackBoard(
  playerBoard,
  squareCoords,
  computerBoard,
  players,
  turn,
  computerBoardDiv
) {
  const player = players.player;
  const computer = players.computer;
  let playerHit;
  let computerHit;
  let board;

  board = checkWinner(computerBoard, playerBoard, players, computerBoardDiv);

  if (typeof board === "object") {
    return board;
  }

  if (player.turn) {
    playerHit = player.attack(computerBoard, squareCoords);

    if (playerHit !== "coords already attacked") {
      turn.textContent = "Computer Turn";
      player.turn = false;
      computer.turn = true;
    } else if (playerHit === "coords already attacked") {
      PopUp("Position already attacked", 700);
    }
  }

  board = checkWinner(computerBoard, playerBoard, players, computerBoardDiv);

  if (typeof board === "object") {
    return { board, hit: playerHit };
  }
  if (computer.turn) {
    setTimeout(() => {
      computerHit = computer.attack(playerBoard);

      while (computerHit.hit === "coords already attacked") {
        computerHit = computer.attack(playerBoard);
      }

      const square = document
        .querySelector(".player-board")
        .querySelector(
          `[data-x="${computerHit.coords[0]}"][data-y="${computerHit.coords[1]}"]`
        );

      if (computerHit.hit === "hitted") {
        square.innerHTML = "<i class='fa-solid fa-x'></i>";
        square.style.backgroundColor = "red";
        square.style.fontSize = "x-large";
      } else if (computerHit.hit === "missed") {
        square.innerHTML = "<i class='fa-solid fa-x'></i>";
      }

      turn.textContent = "Player Turn";

      computer.turn = false;
      player.turn = true;
    }, 500);
  }

  board = checkWinner(computerBoard, playerBoard, players, computerBoardDiv);

  if (typeof board === "object") {
    return board;
  }

  return playerHit;
}

function gameOver(player, div, computerBoardDiv) {
  const gameOverDiv = document.createElement("div");
  const content = document.createElement("h1");
  const restartBtn = document.createElement("button");
  const body = document.querySelector("body");

  computerBoardDiv.style.pointerEvents = "none";

  content.textContent = player.isComputer
    ? "You Lost ! Computer won !!!"
    : "You won !! GG";
  restartBtn.textContent = "Play Again";

  gameOverDiv.classList.add("game-over");
  restartBtn.classList.add("restart-btn");

  const elements = div.children;
  for (let i = 0; i < elements.length; i++) {
    const element = elements[i];
    if (element !== gameOverDiv) {
      element.classList.add("blur-effect");
    }
  }

  gameOverDiv.appendChild(content);
  gameOverDiv.appendChild(restartBtn);
  div.appendChild(gameOverDiv);

  return restartBtn;
}

function restart(root, playerBoard, computerBoard) {
  root.innerHTML = "";

  Menu((result, board, boardDiv) => {
    if (result) {
      start = true;

      startGame(board);
    }
  });

  return [playerBoard, computerBoard];
}

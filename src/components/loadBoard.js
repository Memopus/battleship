import "../css/style.css";
import gameBoard from "../factories/gameBoard";

export default function loadBoard(div) {
  const boardLogic = gameBoard();
  boardLogic.createBoard();

  const board = document.createElement("div");
  board.classList.add("board");
  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      const square = document.createElement("div");
      square.classList.add("square");
      square.setAttribute("data-x", j);
      square.setAttribute("data-y", i);

      board.appendChild(square);
    }
  }
  div.appendChild(board);

  return boardLogic;
}

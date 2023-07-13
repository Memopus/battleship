import "./css/style.css";
import Menu from "./components/menu";
import startGame from "./components/start";

let start = false;

Menu((result, board) => {
  if (result) {
    start = true;
    startGame(board);
  }
});

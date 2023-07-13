function Player(name, isComputer) {
  const shots = [];
  const turn = isComputer ? false : true;

  function attack(gameBoard, coords = []) {
    if (!isComputer) {
      shots.push(coords);
      return gameBoard.receiveAttack(coords);
    } else {
      coords = [Math.floor(Math.random() * 10), Math.floor(Math.random() * 10)];
      shots.push(coords);
      return { hit: gameBoard.receiveAttack(coords), coords: coords };
    }
  }

  return { attack, name, turn, isComputer };
}
module.exports = Player;

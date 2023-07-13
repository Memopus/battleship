function Ship(length, position = "h") {
  let hits = 0;
  let placed = false;
  const hitCoords = [];

  function hit(coords = []) {
    //get coords to store in hitCoords
    hitCoords.push(coords);
    return this.hits++;
  }

  function isSunk() {
    if (this.hits === length) {
      return true;
    }
    return false;
  }

  return { hits, hit, length, isSunk, hitCoords, placed, position };
}

module.exports = Ship;

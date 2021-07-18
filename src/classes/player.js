import PlayScene from "../PlayScene";

export default class Player {
  constructor (sprite, tileSize, tilePos, destinationTile) {
    this.playerSprite = sprite;
    this.TILE_SIZE = tileSize;
    this.TILE_OFFSET = tileSize / 2;
    this.physics = null;
    this.setPosition(tilePos[0], tilePos[1]);
    this.isMoving = false;
    this.destination = null;
    this.destinationTile = destinationTile;
    this.destinationTile.setPosition(
      (tilePos[0] * this.TILE_SIZE) + this.TILE_OFFSET,
      (tilePos[1] * this.TILE_SIZE) + this.TILE_OFFSET
    );
  }

  getTilePosition (x = this.playerSprite.x, y = this.playerSprite.y) {
    // get the game tile position IE: [0, 0] or [0, 1]
    x = (x - this.TILE_OFFSET) / this.TILE_SIZE;
    y = (y - this.TILE_OFFSET) / this.TILE_SIZE;
    return [x, y];
  }

  convertTilePosition (x, y) {
    // get the 'true' grid coordinates with an offset
    x = (x * this.TILE_SIZE) + this.TILE_OFFSET;
    y = (y * this.TILE_SIZE) + this.TILE_OFFSET;
    return [x, y];
  }

  setPosition (x, y) {
    this.playerSprite.setPosition(
      (x * this.TILE_SIZE) + this.TILE_OFFSET,
      (y * this.TILE_SIZE) + this.TILE_OFFSET
    );
  }

  moveTo (x, y) {
    this.setDestinationTile(x, y);
    console.log('moveTo');
    let coords = this.convertTilePosition(x, y);
    this.destination = [coords[0], coords[1]];
    console.log('destination', this.destination);
    console.log('player x', this.playerSprite.x);
    this.physics.moveTo(this.playerSprite, coords[0], coords[1], 30);
    this.isMoving = true;
  }

  move (direction, currentPos) {
    this.blocked = false;
    this.direction = direction;
    this.playerSprite.body.moves = true;
    if (this.prevDestination) {
      if (this.direction === 'left') {
        this.moveTo(this.prevDestination[0] - 1, this.prevDestination[1]);
      } else if (this.direction === 'right') {
        this.moveTo(this.prevDestination[0] + 1, this.prevDestination[1]);
      } else if (this.direction === 'down') {
        this.moveTo(this.prevDestination[0], this.prevDestination[1] + 1);
      } else if (this.direction === 'up') {
        this.moveTo(this.prevDestination[0], this.prevDestination[1] - 1);
      }
    } else {
      if (this.direction === 'left') {
        this.moveTo(currentPos[0] - 1, currentPos[1]);
      } else if (this.direction === 'right') {
        this.moveTo(currentPos[0] + 1, currentPos[1]);
      } else if (this.direction === 'down') {
        this.moveTo(currentPos[0], currentPos[1] + 1);
      } else if (this.direction === 'up') {
        this.moveTo(currentPos[0], currentPos[1] - 1);
      }
    }
    this.isMoving = true;
  }

  setDestinationTile (x, y) {
    this.destinationTile.setPosition(
      (x * this.TILE_SIZE) + this.TILE_OFFSET,
      (y * this.TILE_SIZE) + this.TILE_OFFSET
    );
  }

  stopMovement () {
    this.playerSprite.body.moves = false;
    this.playerSprite.setPosition(this.destination[0], this.destination[1]);
    this.prevDestination = this.getTilePosition(this.destination[0], this.destination[1]);
    this.destination = null;
    console.log('prevDest', this.prevDestination);
    this.isMoving = false;
    console.log(this.playerSprite.x, this.playerSprite.y);
    console.log('stopped');
  }
}

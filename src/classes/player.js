import Bomb from './Bomb';

export default class Player {
  constructor (sprite, tileSize, tilePos, destinationTile) {
    this.playerSprite = sprite;
    this.TILE_SIZE = tileSize;
    this.TILE_OFFSET = tileSize / 2;
    this.physics = null;
    this.playScene = null;
    this.bombList = [];
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
    // sets the player to the x, y coordinate. Adds offset
    this.playerSprite.setPosition(
      (x * this.TILE_SIZE) + this.TILE_OFFSET,
      (y * this.TILE_SIZE) + this.TILE_OFFSET
    );
  }

  moveTo (x, y) {
    // sets destination tile
    this.setDestinationTile(x, y);
    console.log('moveTo');
    this.destination = this.convertTilePosition(x, y);
    console.log('destination', this.destination);
    this.physics.moveTo(this.playerSprite, this.destination[0], this.destination[1], 30);
    this.isMoving = true;
  }

  move (direction, currentPos) {
    // unblocks the player, sets movement direction, enables sprite movement
    // and sends the current pos and direction to the moveTo function
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
    // sets the destination tile the player will move to
    // adds tile offset
    this.destinationTile.setPosition(
      (x * this.TILE_SIZE) + this.TILE_OFFSET,
      (y * this.TILE_SIZE) + this.TILE_OFFSET
    );
  }

  stopMovement () {
    // stops player movement and clears the destination
    this.playerSprite.body.moves = false;
    this.playerSprite.setPosition(this.destination[0], this.destination[1]);
    this.prevDestination = this.getTilePosition(this.destination[0], this.destination[1]);
    this.destination = null;
    console.log('prevDest', this.prevDestination);
    this.isMoving = false;
    console.log(this.playerSprite.x, this.playerSprite.y);
    console.log('stopped');
  }

  block (direction) {
    // sets which direction in which the player is blocked
    this.blocked = direction;
    this.destination = null;
    this.isMoving = false;
  }

  spawnBomb (x, y) {
    let targetPos = null;
    let bomb;
    let bombPos;
    if (this.prevDestination) {
      console.log('using previous destination');
      // convert the previousDestination to grid units and set it as the target
      targetPos = this.convertTilePosition(this.prevDestination[0], this.prevDestination[1]);
      bombPos = this.prevDestination;
      for (let i = 0; i < this.bombList.length; i++) {
        if (this.bombList[i]['pos'] === bombPos) {
          targetPos = null;
          console.log('matching backward', targetPos);
        }
      }
    }
    if (targetPos !== null) {
      console.log('SPAWNING', targetPos);
      bomb = new Bomb(targetPos[0], targetPos[1], this, 3, this.playScene, this.physics);
      this.bombList.push({ bomb: bomb, pos: bombPos });
      console.log(this.bombList);
      console.log(this.bombList.length);
      targetPos = null;
    }
  }
}

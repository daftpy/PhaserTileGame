import Phaser from 'phaser';
import Player from './classes/player';

var controls;
var cursors;

export default class PlayScene extends Phaser.Scene {
  constructor () {
    super({
      key: 'play',
      physics: {
        arcade: {
          debug: false
        }
      }
    });
    this.TILE_SIZE = 8;
  }

  create () {
    let map = this.make.tilemap({ key: 'map', tileWidth: 8, tileHeight: 8 });
    let tiles = map.addTilesetImage('firstmap', 'tiles');
    let layer = map.createLayer(0, tiles, 0, 0);
    let playerSprite = this.add.rectangle(52, 20, 8, 8, 0xff0000, 1);
    let playerBBox = this.add.rectangle(52, 20, 8, 8, 0x0000ff, 1);
    playerBBox.alpha = 0;
    this.player = new Player(playerSprite, this.TILE_SIZE, [12, 2], playerBBox);
    this.physics.add.existing(this.player.playerSprite);
    this.player.playerSprite.body.maxSpeed = 30;
    map.setCollision([ 786, 796 ]);
    this.player.playerSprite.body.collideWorldBounds = true;
    this.physics.add.collider(this.player.playerSprite, layer);
    this.player.physics = this.physics;

    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.cameras.main.setZoom(6.25);
    this.cameras.main.centerToBounds();

    cursors = this.input.keyboard.createCursorKeys();

    // let controlConfig = {
    //   camera: this.cameras.main,
    //   left: cursors.left,
    //   right: cursors.right,
    //   up: cursors.up,
    //   down: cursors.down,
    //   zoomIn: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q),
    //   speed: 0.5
    // };

    // controls = new Phaser.Cameras.Controls.FixedKeyControl(controlConfig);
    console.log('fin?');
  }

  update (time, delta) {
    // controls.update(delta);
    let currentPos = this.player.getTilePosition();
    if (this.player.destination) {
      console.log('destination');
      if (this.player.direction === 'left') {
        if (this.player.destination[0] >= this.player.playerSprite.x) {
          this.player.stopMovement();
        }
      } else if (this.player.direction === 'right') {
        if (this.player.destination[0] <= this.player.playerSprite.x) {
          this.player.stopMovement();
        }
      } else if (this.player.direction === 'up') {
        if (this.player.destination[1] >= this.player.playerSprite.y) {
          this.player.stopMovement();
        }
      } else if (this.player.direction === 'down') {
        if (this.player.destination[1] <= this.player.playerSprite.y) {
          this.player.stopMovement();
        }
      }
    } else {
      if (cursors.left.isDown && this.player.isMoving !== true && this.player.destination === null && this.player.blocked !== 'left') {
        this.player.blocked = false;
        this.player.direction = 'left';
        this.player.playerSprite.body.moves = true;
        if (this.player.prevDestination) {
          this.player.moveTo(this.player.prevDestination[0] - 1, this.player.prevDestination[1]);
        } else {
          this.player.moveTo(currentPos[0] - 1, currentPos[1]);
        }
        this.player.isMoving = true;
      } else if (cursors.right.isDown && this.player.isMoving !== true && this.player.destination === null && this.player.blocked !== 'right') {
        this.player.blocked = false;
        this.player.playerSprite.body.moves = true;
        this.player.direction = 'right';
        if (this.player.prevDestination) {
          this.player.moveTo(this.player.prevDestination[0] + 1, this.player.prevDestination[1]);
        } else {
          this.player.moveTo(currentPos[0] + 1, currentPos[1]);
        }
        this.player.isMoving = true;
      } else if (cursors.down.isDown && this.player.isMoving !== true && this.player.destination === null && this.player.blocked !== 'down') {
        this.player.blocked = false;
        this.player.playerSprite.body.moves = true;
        this.player.direction = 'down';
        if (this.player.prevDestination) {
          this.player.moveTo(this.player.prevDestination[0], this.player.prevDestination[1] + 1);
        } else {
          this.player.moveTo(currentPos[0], currentPos[1] + 1);
        }
        this.player.isMoving = true;
      } else if (cursors.up.isDown && this.player.isMoving !== true && this.player.destination === null && this.player.blocked !== 'up') {
        this.player.blocked = false;
        this.player.playerSprite.body.moves = true;
        this.player.direction = 'up';
        if (this.player.prevDestination) {
          this.player.moveTo(this.player.prevDestination[0], this.player.prevDestination[1] - 1);
        } else {
          this.player.moveTo(currentPos[0], currentPos[1] - 1);
        }
        this.player.isMoving = true;
      } else {
        // this.player.playerSprite.body.setVelocityX(0);
        // this.player.playerSprite.body.setVelocityY(0);
      }
    }

    if (this.player.playerSprite.body.blocked['left']) {
      // if colliding from the left, set blocked 'left' and clear destination and set ismoving false
      this.player.blocked = 'left';
      this.player.destination = null;
      this.player.isMoving = false;
    } else if (this.player.playerSprite.body.blocked['right']) {
      // same as above but set blocked 'right'
      this.player.blocked = 'right';
      this.player.destination = null;
      this.player.isMoving = false;
      this.player.prevDestination = null;
    } else if (this.player.playerSprite.body.blocked['up']) {
      this.player.blocked = 'up';
      this.player.destination = null;
      this.player.isMoving = false;
      this.player.prevDestination = null;
    } else if (this.player.playerSprite.body.blocked['down']) {
      this.player.blocked = 'down';
      this.player.destination = null;
      this.player.isMoving = false;
      this.player.prevDestination = null;
    }
  }
}

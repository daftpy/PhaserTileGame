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
    this.TILE_SIZE = 16;
  }

  create () {
    let map = this.make.tilemap({ key: 'map', tileWidth: 16, tileHeight: 16 });
    let tiles = map.addTilesetImage('boomerman-tiles', 'tiles');
    let layer = map.createLayer(0, tiles, 0, 0);
    let playerSprite = this.add.rectangle(52, 20, 16, 16, 0xff0000, 1);
    let playerBBox = this.add.rectangle(52, 20, 16, 16, 0x0000ff, 1);
    playerBBox.alpha = 0;
    this.player = new Player(playerSprite, this.TILE_SIZE, [12, 2], playerBBox, layer);
    this.physics.add.existing(this.player.playerSprite);
    this.player.playerSprite.body.maxSpeed = 60;
    this.player.playerSprite.body.pushable = false;
    map.setCollision([ 45, 47 ]);
    this.player.playerSprite.body.collideWorldBounds = true;
    this.physics.add.collider(this.player.playerSprite, layer);
    this.player.physics = this.physics;
    this.player.playScene = this;

    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.cameras.main.setZoom(1.5625);
    this.cameras.main.centerToBounds();
    cursors = this.input.keyboard.createCursorKeys();

    let controlConfig = {
      camera: this.cameras.main,
      left: cursors.left,
      right: cursors.right,
      up: cursors.up,
      down: cursors.down,
      zoomIn: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q),
      speed: 0.5
    };
    controls = new Phaser.Cameras.Controls.FixedKeyControl(controlConfig);
  }

  update (time, delta) {
    controls.update(delta);
    let currentPos = this.player.getTilePosition();
    // run the update loop for your bombs in the bomb list
    for (let i = 0; i < this.player.bombList.length; i++) {
      this.player.bombList[i]['bomb'].update();
    }
    if (this.player.destination) {
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
        this.player.move('left', currentPos);
      } else if (cursors.right.isDown && this.player.isMoving !== true && this.player.destination === null && this.player.blocked !== 'right') {
        this.player.move('right', currentPos);
      } else if (cursors.down.isDown && this.player.isMoving !== true && this.player.destination === null && this.player.blocked !== 'down') {
        this.player.move('down', currentPos);
      } else if (cursors.up.isDown && this.player.isMoving !== true && this.player.destination === null && this.player.blocked !== 'up') {
        this.player.move('up', currentPos);
      }
    }

    if (cursors.space.isDown) {
      this.player.spawnBomb();
    }

    if (this.player.playerSprite.body.blocked['left']) {
      // if colliding from the left, set blocked 'left' and clear destination and set ismoving false
      this.player.block('left');
    } else if (this.player.playerSprite.body.blocked['right']) {
      // same as above but set blocked 'right'
      this.player.block('right');
    } else if (this.player.playerSprite.body.blocked['up']) {
      this.player.block('up');
    } else if (this.player.playerSprite.body.blocked['down']) {
      this.player.block('down');
    } else {
      this.player.blocked = null;
    }
  }
}

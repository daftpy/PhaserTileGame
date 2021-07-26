import Phaser from 'phaser';
import Player from './classes/player';
import WeakEnemy from './classes/WeakEnemy';

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
    let config = {
      classType: Phaser.GameObjects.Sprite,
      defaultKey: null,
      defaultFrame: null,
      active: true,
      maxSize: -1,
      runChildUpdate: false,
      createCallback: null,
      removeCallback: null,
      createMultipleCallback: null
    };
    this.enemyGroup = this.add.group(config);

    this.map = this.make.tilemap({ key: 'map' });
    let tiles = this.map.addTilesetImage('boomerman-tiles', 'tiles');
    this.layer = this.map.createLayer(0, tiles, 0, 0);
    let playerBBox = this.add.rectangle(52, 20, 16, 16, 0x0000ff, 1);
    this.player = new Player(this, this.TILE_SIZE, [12, 2], playerBBox);
    this.physics.add.existing(this.player.playerSprite);
    this.player.playerSprite.body.maxSpeed = 60;
    this.player.playerSprite.body.pushable = false;
    this.map.setCollision([ 46, 47, 48 ]);
    this.player.playerSprite.body.collideWorldBounds = true;
    this.physics.add.collider(this.player.playerSprite, this.layer);

    let enemy = new WeakEnemy(24, 24, this, this.physics, this.layer, this.map);

    enemy.spriteBody.body.maxSpeed = 60;
    enemy.spriteBody.body.pushable = false;
    enemy.spriteBody.body.collideWorldBounds = true;
    this.physics.add.collider(enemy.spriteBody, this.layer);
    enemy.findDirection();

    this.enemyGroup.add(enemy.spriteBody);
    console.log(this.enemyGroup);

    this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
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

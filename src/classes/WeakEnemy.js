import Bomb from './Bomb';

var DIRECTIONS = [0, 800];

export default class WeakEnemy {
  constructor (x, y, scene) {
    this.health = 1;
    this.locationX = x;
    this.locationY = y;
    this.playScene = scene;
    this.spriteBody = this.playScene.add.rectangle(24, 24, 16, 16, 0x32a852, 1);
    this.playScene.physics.add.existing(this.spriteBody);
    this.playScene.physics.add.collider(this.spriteBody, this.playScene.layer, () => {
      this.findDirection();
    });
    this.findDirection();
    this.playScene.time.addEvent({ delay: 5000, callback: this.onEvent, callbackScope: this, loop: true });
  }
  findDirection () {
    this.playScene.physics.moveTo(this.spriteBody, DIRECTIONS[0], 24, 60);
    DIRECTIONS.reverse();
  }
  onEvent () {
    console.log('patrolling');
    new Bomb(this.spriteBody.x, this.spriteBody.y, this, 3, this.playScene);
  }
}

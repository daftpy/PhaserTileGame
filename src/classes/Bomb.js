export default class Bomb {
  constructor (x, y, creator, timer, playScene, physics) {
    console.log('bomb created', x, y, playScene);
    this.creator = creator;
    this.scene = playScene;
    this.timer = timer;
    this.physics = physics;
    this.spriteBody = this.scene.add.rectangle(x, y, 8, 8, 0x000000, 1);
    this.physics.add.existing(this.spriteBody);
    this.spriteBody.body.setImmovable(true);
    this.timedEvent = this.scene.time.delayedCall(this.timer * 1000, this.onEvent, [], this);
    this.physics.add.collider(this.spriteBody, this.creator.playerSprite, () => {
      console.log('collision');
    });
  }

  onEvent () {
    console.log('boom');
    this.spriteBody.destroy();
    console.log('destroyed');
  }

  update () {
    // console.log('event progress', this.timedEvent.getProgress().toString().substr(0, 4));
  }
}

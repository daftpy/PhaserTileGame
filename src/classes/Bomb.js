import Phaser from 'phaser';

var BOMB_SPEED = [800, -800];

export default class Bomb {
  constructor (x, y, creator, timer, playScene, physics, map, destructLayer) {
    console.log('bomb created', x, y, playScene);
    this.creator = creator;
    this.scene = playScene;
    this.timer = timer;
    this.physics = physics;
    this.map = map;
    this.destructLayer = destructLayer;
    this.destructLayer.setTileIndexCallback(48, this.hitTile, this);
    this.destructLayer.setTileIndexCallback(47, this.hitTile, this);
    this.spriteBody = this.scene.add.rectangle(x, y, 16, 16, 0x000000, 1);
    this.physics.add.existing(this.spriteBody);
    this.spriteBody.body.setImmovable(true);
    this.timedEvent = this.scene.time.delayedCall(this.timer * 1000, this.onEvent, [], this);
    this.physics.add.collider(this.spriteBody, this.creator.playerSprite, () => {
      console.log('collision');
    });
  }

  onEvent () {
    this.scene.sound.play('thunder');
    var particles = this.scene.add.particles('flares');
    for (let i = 0; i < BOMB_SPEED.length; i++) {
      let plume = this.scene.add.rectangle(this.spriteBody.x, this.spriteBody.y, 16, 16, 0xFFFF00, 1);
      plume.damage = true; // this allows plumes to destroy walls
      let plumeInstance = this.physics.add.existing(plume);
      plume.alpha = 0;
      plume.body.maxSpeed = 800;
      let particle = particles.createEmitter({
        frame: 'yellow',
        radial: false,
        // x: 100,
        // y: { start: 0, end: 560, steps: 256 },
        // speedX: { min: 200, max: 400 },
        quantity: 4,
        // gravityY: -50,
        scale: { start: 0.6, end: 0, ease: 'Power3' },
        blendMode: 'ADD',
        follow: plume
      });
      plume.body.setVelocityX(BOMB_SPEED[i]);
      let playerCollider = this.physics.add.collider(plume, this.creator.playerSprite, () => {
        this.scene.sound.play('death');
        plume.destroy();
        plumeInstance.destroy();
        console.log('death');
      });
      this.physics.add.collider(plume, this.creator.tileLayer, () => {
        plume.destroy();
        plumeInstance.destroy();
        playerCollider.destroy();
        particle.on = false;
      });
    }
    for (let i = 0; i < BOMB_SPEED.length; i++) {
      console.log('plume');
      let plume = this.scene.add.rectangle(this.spriteBody.x, this.spriteBody.y, 12, 12, 0xFFFF00, 1);
      plume.damage = true;
      let plumeInstance = this.physics.add.existing(plume);
      plume.body.maxSpeed = 1000;
      let particle = particles.createEmitter({
        frame: 'yellow',
        radial: false,
        quantity: 4,
        scale: { start: 0.6, end: 0, ease: 'Power3' },
        blendMode: 'ADD',
        follow: plume
      });
      plume.body.setVelocityY(BOMB_SPEED[i]);
      let playerCollider = this.physics.add.collider(plume, this.creator.playerSprite, () => {
        this.scene.sound.play('death');
        plume.destroy();
        plumeInstance.destroy();
        console.log('death');
      });
      this.physics.add.collider(plume, this.creator.tileLayer, (obj1, obj2) => {
        plume.destroy();
        plumeInstance.destroy();
        playerCollider.destroy();
        particle.on = false;
      });
    }
    this.spriteBody.destroy();
    console.log('destroyed');
  }

  hitTile (sprite, tile) {
    let targetTile = this.map.getTileAt(tile.x, tile.y);
    let tileHealth = parseInt(targetTile.layer.data[tile.y][tile.x].properties.health);
    if (sprite.damage === true) {
      console.log(tileHealth);
      // targetTile.properties.health = parseInt(targetTile.properties.heatlh) - 1;
      targetTile.properties.health = tileHealth - 1;
      targetTile.tint = -1090000;
      console.log(parseInt(targetTile.properties.health));
      if (parseInt(targetTile.properties.health) === 0) {
        let newTile = new Phaser.Tilemaps.Tile(this.destructLayer, 313, (tile.x * 16) + (16 / 2), (tile.y * 16) + (16 / 2), 16, 16, 16, 16);
        this.destructLayer.removeTileAt(tile.x, tile.y);
        console.log(tile.x, tile.y);
        this.destructLayer.putTileAt(newTile, tile.x, tile.y, true);
      }
    }
    return false;
  }

  update () {
    // console.log('event progress', this.timedEvent.getProgress().toString().substr(0, 4));
  }
}

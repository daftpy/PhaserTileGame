import Phaser from 'phaser';

var BOMB_SPEED = [800, -800];

export default class Bomb {
  constructor (x, y, creator, timer, playScene, enemyGroup = null) {
    console.log('bomb created', x, y, playScene);
    this.creator = creator;
    this.playScene = playScene;
    this.timer = timer;
    this.enemyGroup = enemyGroup;
    this.playScene.layer.setTileIndexCallback(48, this.hitTile, this);
    this.playScene.layer.setTileIndexCallback(47, this.hitTile, this);
    this.spriteBody = this.playScene.add.rectangle(x, y, 16, 16, 0x000000, 1);
    this.playScene.physics.add.existing(this.spriteBody);
    this.spriteBody.body.setImmovable(true);
    this.timedEvent = this.playScene.time.delayedCall(this.timer * 1000, this.onEvent, [], this);
    this.playScene.physics.add.collider(this.spriteBody, this.playScene.player.playerSprite, () => {
      console.log('collision');
    });
  }

  onEvent () {
    this.playScene.sound.play('thunder');
    var particles = this.playScene.add.particles('flares');
    this.createPlumes(particles);
    this.spriteBody.destroy();
    console.log('destroyed');
  }

  hitTile (sprite, tile) {
    let targetTile = this.playScene.map.getTileAt(tile.x, tile.y);
    let tileHealth = parseInt(targetTile.layer.data[tile.y][tile.x].properties.health);
    if (sprite.damage === true) {
      console.log(tileHealth);
      // targetTile.properties.health = parseInt(targetTile.properties.heatlh) - 1;
      targetTile.properties.health = tileHealth - 1;
      targetTile.tint = -1090000;
      console.log(parseInt(targetTile.properties.health));
      if (parseInt(targetTile.properties.health) === 0) {
        let newTile = new Phaser.Tilemaps.Tile(this.playScene.layer, 313, (tile.x * 16) + (16 / 2), (tile.y * 16) + (16 / 2), 16, 16, 16, 16);
        this.playScene.layer.removeTileAt(tile.x, tile.y);
        console.log(tile.x, tile.y);
        this.playScene.layer.putTileAt(newTile, tile.x, tile.y, true);
      }
    }
    return false;
  }

  createPlumes (particles) {
    for (let i = 0; i < (BOMB_SPEED.length * 2); i++) {
      console.log('PLUMES', i);
      let plume = this.playScene.add.rectangle(this.spriteBody.x, this.spriteBody.y, 16, 16, 0xFFFF00, 1);
      plume.damage = true; // this allows plumes to destroy walls
      this.playScene.physics.add.existing(plume);
      plume.alpha = 0;
      plume.body.maxSpeed = 800;
      let particle = particles.createEmitter({
        frame: 'yellow',
        radial: false,
        quantity: 4,
        scale: { start: 0.6, end: 0, ease: 'Power3' },
        blendMode: 'ADD',
        follow: plume
      });
      if (i < 2) {
        plume.body.setVelocityX(BOMB_SPEED[i]);
      } else if (i === 3) {
        plume.body.setVelocityY(BOMB_SPEED[0]);
      } else {
        plume.body.setVelocityY(BOMB_SPEED[1]);
      }
      let playerCollider = this.playScene.physics.add.collider(plume, this.playScene.player.playerSprite, () => {
        this.playScene.sound.play('death');
        plume.destroy();
        particle.on = false;
        console.log('death');
        this.playScene.player.playerSprite.alpha = 0;
      });
      this.playScene.physics.add.collider(plume, this.playScene.layer, () => {
        plume.destroy();
        playerCollider.destroy();
        particle.on = false;
      });
      if (this.enemyGroup) {
        this.playScene.physics.add.collider(plume, this.enemyGroup, (obj1, obj2) => {
          plume.destroy();
          particle.on = false;
          console.log('killed enemy');
          obj2.destroy();
        });
      }
    }
  }

  update () {
    // console.log('event progress', this.timedEvent.getProgress().toString().substr(0, 4));
  }
}

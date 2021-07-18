import Phaser from 'phaser';
import images from './assets/*.png';
import tilesets from './assets/tilemaps/tiles/*.png';
import maps from './assets/tilemaps/*.csv';

export default class BootScene extends Phaser.Scene {
  constructor () {
    super({ key: 'boot' });
  }

  preload () {
    var bg = this.add.rectangle(400, 300, 400, 30, 0x666666);
    var bar = this.add.rectangle(bg.x, bg.y, bg.width, bg.height, 0xffffff).setScale(0, 1);

    console.table(images);

    this.load.image('space', images.space);
    this.load.image('logo', images.logo);
    this.load.image('red', images.red);
    this.load.image('tiles', tilesets.tilesetP8);
    this.load.tilemapCSV('map', maps.boom);

    this.load.on('progress', function (progress) {
      bar.setScale(progress, 1);
    });
  }

  update () {
    this.scene.start('menu');
    // this.scene.start('play');
    // this.scene.remove();
  }
}

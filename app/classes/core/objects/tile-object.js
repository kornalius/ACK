const { GameObject } = require('./game-object')

const { TILE_FLOOR, TILE_WALL, TILE_DOOR_OPENED, TILE_DOOR_CLOSED, TILE_STAIRS_UP, TILE_STAIRS_DOWN } = require('../../../constants')

class TileObject extends GameObject {

  constructor (x, y, z, map, type) {
    super(x, y, z, map)

    this._type = type
  }

  get type () { return this._type }
  set type (value) {
    if (value !== this._type) {
      this._type = value
      this.destroySprite()
      this.createSprite(this.spriteFrame)
      this._map.update()
    }
  }

  get blocked () {
    let t = this._type
    return t === TILE_WALL ||
      t === TILE_DOOR_CLOSED
  }

  get blocksLight () {
    let t = this._type
    return t === TILE_WALL ||
      t === TILE_DOOR_CLOSED
  }

  get stairs () {
    let t = this._type
    return t === TILE_STAIRS_UP || t === TILE_STAIRS_DOWN
  }

  get spriteFrame () {
    switch (this._type) {
      case TILE_FLOOR: { return 'floor.png' }
      case TILE_WALL: { return 'wall.png' }
      case TILE_DOOR_OPENED: { return 'door-opened.png' }
      case TILE_DOOR_CLOSED: { return 'door-closed.png' }
      case TILE_STAIRS_UP: { return 'stairs-up.png' }
      case TILE_STAIRS_DOWN: { return 'stairs-down.png' }
    }
    return undefined
  }

}

module.exports = {
  TileObject,
}

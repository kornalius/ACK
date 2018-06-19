const { GameObject } = require('./game-object')

const { TILE_FLOOR, TILE_WALL } = require('../../constants')

class TileObject extends GameObject {

  constructor (x, y, z, map, type) {
    super(x, y, z, map)

    this.type = type
  }

  get isTile () { return true }

  get type () { return this._type }
  set type (value) {
    if (value !== this._type) {
      this._type = value
      this.destroySprite()
      this.createSprite(this.spriteFrame)
      if (this._sprite) {
        this._sprite.alpha = 0
      }
      this.placeSprite()
    }
  }

  get spriteFrame () {
    switch (this._type) {
      case TILE_FLOOR: { return 'floor.png' }
      // case TILE_WALL: { return 'wall.png' }
    }
    return undefined
  }

  get blocked () { return this._type === TILE_WALL }

  get sightBlocked () { return this._type === TILE_WALL }

  get lightBlocked () { return this._type === TILE_WALL }

  enter (npc) {
  }

  exit (npc) {
  }

}

module.exports = {
  TileObject,
}
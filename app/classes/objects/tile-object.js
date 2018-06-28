const { GameObject } = require('./game-object')

const { TILE_FLOOR, TILE_WALL } = require('../../constants')

class TileObject extends GameObject {

  constructor (x, y, z, map, type) {
    super(x, y, z, map)

    this.type = type
    this._enabled = false
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
      case TILE_WALL: { return 'wall.png' }
    }
    return undefined
  }

  get isWall () {
    return this._type === TILE_WALL
  }

  get blocked () { return this.isWall }

  get sightBlocked () { return this.isWall }

  get lightBlocked () { return this.isWall }

  enter (npc) {
    if (!this.isPaused) {
    }
  }

  exit (npc) {
    if (!this.isPaused) {
    }
  }

}

module.exports = {
  TileObject,
}

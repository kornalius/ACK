const { GameObject } = require('./game-object')

const { TILE_FLOOR, TILE_WALL, TILE_WALL_UP, TILE_WALL_DOWN, TILE_WALL_LEFT, TILE_WALL_RIGHT, TILE_WALL_DOWN_LEFT, TILE_WALL_DOWN_RIGHT, TILE_WALL_UP_LEFT, TILE_WALL_UP_RIGHT, TILE_WALL_CORNER_UP_LEFT, TILE_WALL_CORNER_UP_RIGHT, TILE_WALL_CORNER_DOWN_LEFT, TILE_WALL_CORNER_DOWN_RIGHT, TILE_WALL_LEFT_RIGHT } = require('../../constants')

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
      case TILE_WALL_UP: { return 'wall-up.png' }
      case TILE_WALL_DOWN: { return 'wall-down.png' }
      case TILE_WALL_LEFT: { return 'wall-left.png' }
      case TILE_WALL_RIGHT: { return 'wall-right.png' }
      case TILE_WALL_DOWN_LEFT: { return 'wall-down-left.png' }
      case TILE_WALL_DOWN_RIGHT: { return 'wall-down-right.png' }
      case TILE_WALL_UP_LEFT: { return 'wall-up-left.png' }
      case TILE_WALL_UP_RIGHT: { return 'wall-up-right.png' }
      case TILE_WALL_CORNER_UP_LEFT: { return 'wall-corner-up-left.png' }
      case TILE_WALL_CORNER_UP_RIGHT: { return 'wall-corner-up-right.png' }
      case TILE_WALL_CORNER_DOWN_LEFT: { return 'wall-corner-down-left.png' }
      case TILE_WALL_CORNER_DOWN_RIGHT: { return 'wall-corner-down-right.png' }
      case TILE_WALL_LEFT_RIGHT: { return 'wall-left-right.png' }
    }
    return undefined
  }

  get isWall () {
    return _.includes([TILE_WALL, TILE_WALL_UP, TILE_WALL_DOWN, TILE_WALL_LEFT, TILE_WALL_RIGHT, TILE_WALL_DOWN_LEFT, TILE_WALL_DOWN_RIGHT, TILE_WALL_UP_LEFT, TILE_WALL_UP_RIGHT, TILE_WALL_CORNER_UP_LEFT, TILE_WALL_CORNER_UP_RIGHT, TILE_WALL_CORNER_DOWN_LEFT, TILE_WALL_CORNER_DOWN_RIGHT, TILE_WALL_LEFT_RIGHT], this._type)
  }

  get blocked () { return this.isWall }

  get sightBlocked () { return this.isWall }

  get lightBlocked () { return this._type === TILE_WALL }

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

const { EventsManager } = require('../../../mixins/common/events')
const { SpriteMixin } = require('../../../mixins/core/sprite')
const { ActMixin } = require('../../../mixins/core/act')

const { TILE_WIDTH, TILE_HEIGHT } = require('../../../constants')

class GameObject extends mix(Object).with(EventsManager, SpriteMixin, ActMixin) {

  constructor (x, y, z, map) {
    super()

    this.reset()

    this.createSprite(this.spriteFrame)

    this.moveTo(x, y, z, map)
  }

  get x () { return this._x }
  set x (value) {
    if (value !== this._x) {
      this.placeSprite(value, this._y, this._z, this._map)
      let old = this._x
      this._x = value
      this.emit('x-change', { value, old })
    }
  }

  get y () { return this._y }
  set y (value) {
    if (value !== this._y) {
      this.placeSprite(this._x, value, this._z, this._map)
      let old = this._y
      this._y = value
      this.emit('y-change', { value, old })
    }
  }

  get z () { return this._z }
  set z (value) {
    if (value !== this._z) {
      this.placeSprite(this._x, this._y, value, this._map)
      let old = this._z
      this._z = value
      this.emit('z-change', { value, old })
    }
  }

  get map () { return this._map }
  set map (value) {
    if (value !== this._map) {
      let old = this._map
      this.placeSprite(this._x, this._y, this._z, value)
      this._map = value
      this.emit('map-change', { value, old })
    }
  }

  get name () { return 'Object' }

  get spriteFrame () { return undefined }

  placeSprite (x, y, z, map) {
    if (this._sprite) {
      x = x || this._x
      y = y || this._y
      z = z || this._z
      map = map || this._map

      this._sprite.position.set(x * TILE_WIDTH, y * TILE_HEIGHT)

      if (!this._sprite.parent || z !== this._z || map !== this._map) {
        if (this._sprite.parent) {
          this._sprite.parent.removeChild(this._sprite)
          this._map.update()
        }
        if (map && map.hasLevel(z)) {
          map.levels[z].addChild(this._sprite)
          map.update()
        }
      }
    }
  }

  reset () {
    _.resetProps(this)

    this.destroySprite()

    this._x = 0
    this._y = 0
    this._z = 0
    this._map = undefined
  }

  get blocked () { return false }

  get sightBlocked () { return false }

  get lightBlocked () { return false }

  moveTo (x, y, z, map) {
    this.x = x
    this.y = y
    this.z = z
    this.map = map
  }

  moveBy (x, y, z = 0) {
    return this.moveTo(this._x + x, this._y + y, this._z + z)
  }

  act (t, delta) {
    super.act(t, delta)
  }

  getNeighborPositions (x, y) {
    let tiles = []
    for (let dX = -1; dX < 2; dX++) {
      for (let dY = -1; dY < 2; dY++) {
        if (dX === 0 && dY === 0) {
          continue
        }
        tiles.push({ x: x + dX, y: y + dY })
      }
    }
    return tiles.randomize()
  }

  distanceFrom (target) {
    if (this._map === target._map && this._z === target.z) {
      return new PIXI.Point(this._x, this._y).distance(new PIXI.Point(target.x, target.y))
    }
    return NaN
  }

  isAt (x, y, z, map) {
    z = z || this._z
    map = map || this._map

    return this._x === x && this._y === y && this._z === z && this._map === map
  }

}

module.exports = {
  GameObject,
}

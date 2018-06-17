const { EventsManager } = require('../../../mixins/common/events')
const { SpriteMixin } = require('../../../mixins/core/sprite')
const { ActMixin } = require('../../../mixins/core/act')

const { TILE_WIDTH, TILE_HEIGHT } = require('../../../constants')

class GameObject extends mix(Object).with(EventsManager, SpriteMixin, ActMixin) {

  constructor (x, y, z, map) {
    super()

    this.reset()

    this.createSprite(this.spriteFrame)
    if (this._sprite) {
      this._sprite.alpha = 0
    }

    this.moveTo(x, y, z, map)
  }

  get animateMove () { return false }

  get x () { return this._x }
  set x (value) {
    if (value !== this._x) {
      let old = this._x
      this._x = value
      this.emit('x-change', { value, old })
    }
  }

  get y () { return this._y }
  set y (value) {
    if (value !== this._y) {
      let old = this._y
      this._y = value
      this.emit('y-change', { value, old })
    }
  }

  get z () { return this._z }
  set z (value) {
    if (value !== this._z) {
      let old = this._z
      this._z = value
      this.emit('z-change', { value, old })
    }
  }

  get map () { return this._map }
  set map (value) {
    if (value !== this._map) {
      let old = this._map
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

      if (this.animateMove) {
        let coords = { x: this._sprite.position.x, y: this._sprite.position.y }
        new TWEEN.Tween(coords)
          .to({ x: x * TILE_WIDTH, y: y * TILE_HEIGHT }, 100)
          .easing(TWEEN.Easing.Quadratic.Out)
          .onUpdate(() => {
            this._sprite.position.set(coords.x, coords.y)
            ACK.update()
          })
          .start()
      }
      else {
        this._sprite.position.set(x * TILE_WIDTH, y * TILE_HEIGHT)
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

  canMoveTo (x, y, z, map) {
    z = z || this._z
    map = map || this._map
    return map && map.hasLevel(z)
  }

  moveTo (x, y, z, map) {
    if (this.canMoveTo(x, y, z, map)) {
      this.map = map || this._map
      this.z = z || this._z
      this.x = x
      this.y = y

      this.placeSprite(this._x, this._y, this._z, this._map)

      return true
    }
    return false
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

  centerOn () {
    if (this._map) {
      this._map.centerOn(this._x * TILE_WIDTH, this._y * TILE_HEIGHT)
    }
  }

}

module.exports = {
  GameObject,
}

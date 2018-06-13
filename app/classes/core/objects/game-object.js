const { EventsManager } = require('../../../mixins/common/events')
const { SpriteMixin } = require('../../../mixins/core/sprite')
const { ActMixin } = require('../../../mixins/core/act')

class GameObject extends mix(Object).with(EventsManager, SpriteMixin, ActMixin) {

  constructor (x, y, z, map) {
    super()

    this.reset()

    this._x = x
    this._y = y
    this._z = z
    this._map = map
  }

  get x () { return this._x }
  set x (value) {
    if (value !== this._x) {
      this._x = value
      this.sprite.position.x = value
      if (!this._noEmit) {
        this.emit('move', { x: this._x, y: this._y, z: this._z })
        this._map.update()
      }
    }
  }

  get y () { return this._y }
  set y (value) {
    if (value !== this._y) {
      this._y = value
      this.sprite.position.y = value
      if (!this._noEmit) {
        this.emit('move', { x: this._x, y: this._y, z: this._z })
        this._map.update()
      }
    }
  }

  get z () { return this._z }
  set z (value) {
    if (value !== this._z) {
      this._z = value
      if (!this._noEmit) {
        this.emit('move', { x: this._x, y: this._y, z: this._z })
        this._map.update()
      }
    }
  }

  get map () { return this._map }

  reset () {
    _.resetProps(this)

    this._x = 0
    this._y = 0
    this._z = 0
    this._map = undefined
  }

  moveTo (x, y, z) {
    this._noEmit = true
    this.x = x
    this.y = y
    this._noEmit = false
    this.z = z
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

}

module.exports = {
  GameObject,
}

const { EventsManager } = require('../../../mixins/common/events')
const { StatsMixin } = require('../../../mixins/core/stats')
const { SpriteMixin } = require('../../../mixins/core/sprite')
const { ActMixin } = require('../../../mixins/core/act')

let GameObject = class GameObject extends mix(Object).with(EventsManager, StatsMixin, SpriteMixin, ActMixin) {

  constructor (map) {
    super()

    this._map = map

    this.reset()
  }

  get x () { return this._x }
  set x (value) {
    if (value !== this._x) {
      this._x = value
      this.sprite.position.x = value
      if (!this._noEmit) {
        this.emit('move', { x: this._x, y: this._y })
      }
    }
  }

  get y () { return this._y }
  set y (value) {
    if (value !== this._y) {
      this._y = value
      this.sprite.position.y = value
      if (!this._noEmit) {
        this.emit('move', { x: this._x, y: this._y })
      }
    }
  }

  get map () { return this._map }

  reset () {
    this._x = 0
    this._y = 0
    this.clearStats()
  }

  moveTo (x, y) {
    this._noEmit = true
    this.x = x
    this._noEmit = false
    this.y = y
  }

  moveBy (x, y) {
    return this.moveTo(this._x + x, this._y + y)
  }

  destroy () {
    super.destroy()
  }

  act (t, delta) {
  }

}

module.exports = {
  GameObject,
}

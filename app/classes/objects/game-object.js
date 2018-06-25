const { EventsManager } = require('../../mixins/common/events')
const { StateMixin } = require('../../mixins/common/state')
const { EnableMixin } = require('../../mixins/common/enable')
const { SpriteMixin } = require('../../mixins/core/sprite')
const { PositionMixin } = require('../../mixins/core/position')
const { FlipMixin } = require('../../mixins/core/flip')
const { ActMixin } = require('../../mixins/core/act')
const { ActionGroup } = require('../core/action-group')

const { TILE_WIDTH, TILE_HEIGHT } = require('../../constants')

class GameObject extends mix(Object).with(EventsManager, PositionMixin, EnableMixin, StateMixin, SpriteMixin, FlipMixin, ActMixin) {

  constructor (x, y, z, map) {
    super()

    this.createSprite(this.spriteFrame)
    if (this._sprite) {
      this._sprite.alpha = 0
    }

    this.moveTo(x, y, z, map, false)

    if (this.enabled) {
      this.start()
    }
  }

  get animateMove () { return false }

  get name () { return 'Object' }

  get spriteFrame () { return undefined }

  get blocked () { return false }

  get sightBlocked () { return false }

  get lightBlocked () { return false }

  act (t, delta) {
    if (this.isRunning) {
      super.act(t, delta)
    }
  }

  placeSprite (x = this._x, y = this._y, z = this._z, map = this._map, animate = this.animateMove) {
    super.placeSprite(x * TILE_WIDTH, y * TILE_HEIGHT, z, map, animate)
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

  inView (rect) {
    return rect.contains(this._x, this._y)
  }

  centerOn (animate = true) {
    if (this._map) {
      this._map.centerOn(this._x * TILE_WIDTH, this._y * TILE_HEIGHT, animate)
    }
  }

  updateSpriteFrame () {
    this.updateSprite(this.spriteFrame)
    ACK.update()
  }

  action (actionClass, options) {
    return new actionClass(_.extend(options, { instance: this }))
  }

  group (actions) {
    for (let action of actions) {
      action.options.instance = this
    }
    return new ActionGroup(actions)
  }

}

module.exports = {
  GameObject,
}

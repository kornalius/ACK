const { EventsManager } = require('../../mixins/common/events')
const { StateMixin } = require('../../mixins/common/state')
const { EnableMixin } = require('../../mixins/common/enable')
const { SpriteMixin } = require('../../mixins/core/sprite')
const { PositionMixin } = require('../../mixins/core/position')
const { FlipMixin } = require('../../mixins/core/flip')
const { ActMixin } = require('../../mixins/core/act')
const { ActionGroup } = require('../core/action-group')

class GameObject extends mix(Object).with(EventsManager, PositionMixin, EnableMixin, StateMixin, SpriteMixin, FlipMixin, ActMixin) {

  constructor (x, y, room) {
    super()

    this._room = undefined

    this.createSprite(this.spriteFrame)

    this.moveTo(x, y, room, false)

    if (this.enabled) {
      this.start()
    }
  }

  get animateMove () { return false }

  get name () { return 'Object' }

  get spriteFrame () { return undefined }

  get scene () { return _.get(this, 'room.scene') }

  act (t, delta) {
    if (this.isRunning) {
      super.act(t, delta)
    }
  }

  inView (rect) {
    return rect.contains(this.x, this.y)
  }

  centerOn (animate = true) {
    if (this.room) {
      this.room.centerOn(this.x, this.y, animate)
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

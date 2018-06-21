const { EventsManager } = require('../../mixins/common/events')
const { StateMixin } = require('../../mixins/common/state')
const { ActMixin } = require('../../mixins/core/act')

class Effect extends mix(Object).with(EventsManager, StateMixin, ActMixin) {

  constructor () {
    super()

    _.addProp(this, 'duration', 0)

    this.reset()
  }

  get modifiers () {
    return {}
  }

  reset () {
    _.resetProps(this)
  }

  act (t, delta) {
    super.act(t, delta)
    if (this._duration > 0) {
      this.duration -= delta
      if (this._duration <= 0) {
        this.stop()
      }
    }
  }

}

module.exports = {
  Effect,
}

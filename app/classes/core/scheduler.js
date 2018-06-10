const { EventsManager } = require('../../mixins/common/events')
const { StateMixin } = require('../../mixins/core/state')
const { ActMixin } = require('../../mixins/core/act')

class Scheduler extends mix(Object).with(EventsManager, StateMixin, ActMixin) {

  constructor () {
    super()

    this.reset()
  }

  get queue () { return this._queue }

  get current () { return this._current }
  get currentDuration () { return _.get(this, '_current.duration', 0) }
  get currentElapsed () { return performance.now() - _.get(this, '_current.last', 0) }
  get currentRemaining () { return this.currentDuration - this.currentElapsed }

  reset () {
    this._queue = []
    this._last = 0
    this._current = undefined
    this.emit('reset')
  }

  start () {
    if (this.isStopped) {
      super.start()
      this.reset()
    }
  }

  push (obj) {
    this._queue.push(obj)
    this.emit('push', obj)
  }

  pull (obj) {
    _.pull(this._queue, obj)
    this.emit('pull', obj)
  }

  act (t, delta) {
    let c = this._current
    if (c && t - c.last >= c.duration) {
      let obj = this._queue.shift()
      this._current = {
        obj,
        duration: obj.act(t) || 0,
        last: t,
      }
    }
    this._last = t
  }

  destroy () {
    this.stop()
    this.reset()
  }

}

module.exports = {
  Scheduler,
}

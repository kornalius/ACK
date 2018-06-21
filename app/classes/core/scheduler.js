const { EventsManager } = require('../../mixins/common/events')
const { StateMixin } = require('../../mixins/common/state')
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
    _.resetProps(this)

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
    if (_.isArray(obj)) {
      for (let o of obj) {
        this.push(o)
      }
    }
    else {
      this._queue.push(obj)
      this.emit('push', obj)
    }
  }

  pull (obj) {
    _.pull(this._queue, obj)
    this.emit('pull', obj)
  }

  act (t, delta) {
    super.act(t, delta)

    let c = this._current
    if (c && t - c.last >= c.duration) {
      let obj = this._queue.shift()
      let duration = 0
      if (_.isFunction(obj)) {
        duration = obj(t) || 0
      }
      else {
        duration = obj.act(t) || 0
      }
      this._current = {
        obj,
        duration,
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

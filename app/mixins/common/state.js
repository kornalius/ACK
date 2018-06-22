const { STOPPED, RUNNING, PAUSED } = require('../../constants')

const StateMixin = Mixin(superclass => class StateMixin extends superclass {

  constructor () {
    super(...arguments)

    _.addProp(this, 'state', STOPPED, true)
  }

  get hasState () { return true }

  get isRunning () { return this._state === RUNNING }
  get isPaused () { return this._state === PAUSED }
  get isStopped () { return this._state === STOPPED }

  start () {
    if (this.isStopped) {
      this._state = RUNNING
      this.emit('start')
      return true
    }
    return false
  }

  stop () {
    if (!this.isStopped) {
      this._state = STOPPED
      this.emit('stop')
      return true
    }
    return false
  }

  pause () {
    if (!this.isPaused && !this.isStopped) {
      this._state = PAUSED
      this.emit('pause')
      return true
    }
    return false
  }

  resume () {
    if (this.isPaused) {
      this._state = RUNNING
      this.emit('resume')
      return true
    }
    return false
  }

})

module.exports = {
  StateMixin,
}

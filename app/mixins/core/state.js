const STOPPED = 0
const RUNNING = 1
const PAUSED = 2

const StateMixin = Mixin(superclass => class StateMixin extends superclass {

  constructor () {
    super()

    this._state = STOPPED
  }

  get state () { return this._state }
  get isRunning () { return this._state === RUNNING }
  get isPaused () { return this._state === PAUSED }
  get isStopped () { return this._state === STOPPED }

  start () {
    if (this.isStopped) {
      this._state = RUNNING
      this.emit('start')
    }
  }

  stop () {
    if (!this.isStopped) {
      this._state = STOPPED
      this.emit('stop')
    }
  }

  pause () {
    if (!this.isPaused && !this.isStopped) {
      this._state = PAUSED
      this.emit('pause')
    }
  }

  resume () {
    if (this.isPaused) {
      this._state = RUNNING
      this.emit('resume')
    }
  }

})

module.exports = {
  StateMixin,
}

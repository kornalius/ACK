const { Emitter } = require('./mixins/common/events')
const { Video } = require('./classes/video/video')

const STOPPED = 0
const RUNNING = 1
const PAUSED = 2

class Main extends Emitter {

  constructor () {
    super()

    this._video = new Video()

    this.reset()

    setTimeout(() => this.start())

    this._tickBound = this.tick.bind(this)
    PIXI.ticker.shared.add(this._tickBound)

    this._ticks = []
  }

  get video () { return this._video }
  get ticks () { return this._ticks }

  get state () { return this._state }
  set state (value) {
    if (this._state !== value) {
      this._state = value
    }
  }

  get isRunning () { return this._state === RUNNING }
  get isPaused () { return this._state === PAUSED }

  reset () {
    this._state = STOPPED
    return this
  }

  shut () {
    this._video.shut()
  }

  start () {
    if (!this.isRunning) {
      this.state = RUNNING
      this.emit('start')
    }
    return this
  }

  stop () {
    if (this.isRunning) {
      this.state = STOPPED
      this.emit('stop')
    }
    return this
  }

  pause () {
    if (!this.isPaused) {
      this.state = PAUSED
      this.emit('paused')
    }
    return this
  }

  resume () {
    if (this.isPaused) {
      this.state = RUNNING
      this.emit('resume')
    }
    return this
  }

  addTick (obj) {
    this._ticks.push(obj)
  }

  removeTick (obj) {
    _.pull(this._ticks, obj)
  }

  clearTicks () {
    this._ticks = []
  }

  tick (delta) {
    if (this.state === RUNNING) {
      let t = performance.now()

      this._video.tick(t, delta)

      for (let tt of this._ticks) {
        tt.tick(t)
      }
    }
  }

}

module.exports = {
  Main
}

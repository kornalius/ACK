const utils = require('../../utils')

const { EventsManager } = require('../../mixins/common/events')
const { StateMixin } = require('../../mixins/core/state')
const { ActMixin } = require('../../mixins/core/act')

const { Video } = require('../video/video')

const { Scheduler } = require('./scheduler')
const { Cursor } = require('../ui/cursor')

const { PlayerObject } = require('./objects/player-object')

const { PlayScene } = require('../scenes/play-scene')

let Game = class Game extends mix(Object).with(EventsManager, StateMixin, ActMixin) {

  constructor () {
    super()

    this._ticks = []

    this._scheduler = new Scheduler()
    this._video = new Video()
    this._cursor = new Cursor()

    this._player = new PlayerObject()
    this._scene = undefined
    this._scenes = {}

    this.reset()

    this._tickBound = this.tick.bind(this)
    PIXI.ticker.shared.add(this._tickBound)

    this.load(this.start)
  }

  get DIRS () { return utils.dirs }
  get app () { return utils.app }
  get userPath () { return utils.userPath }

  get APP_NAME () { return utils.name }
  get VERSION () { return utils.version }
  get IS_WIN () { return utils.IS_WIN }
  get IS_OSX () { return utils.IS_OSX }
  get IS_LINUX () { return utils.IS_LINUX }

  get openFile () { return utils.openFile }
  get saveFile () { return utils.saveFile }
  get messageBox () { return utils.messageBox }

  get raf () { return utils.raf }
  get caf () { return utils.raf.cancel }

  get debounce () { return utils.debounce }
  get throttle () { return utils.throttle }

  get storeProps () { return utils.storeProps }
  get restoreProps () { return utils.restoreProps }

  get keyToString () { return utils.keyToString }
  get stringToKey () { return utils.stringToKey }
  get keyevent () { return utils.keyevent }

  get ticks () { return this._ticks }

  get player () { return this._player }
  get video () { return this._video }
  get scheduler () { return this._scheduler }

  get scene () { return this._scene }
  get scenes () { return this._scenes }

  reset () {
    this._ticks = []
    this._player.reset()
    this._scheduler.reset()
    this._video.reset()
    this._cursor.reset()

    if (this._scene) {
      this._scene.reset()
    }
  }

  start () {
    if (this.isStopped) {
      this.reset()
      super.start()

      this._scenes.play = new PlayScene()

      this.gotoScene('play')
    }
  }

  destroy () {
    this.stop()
    this._player.destroy()
    this._scheduler.destroy()
    this._video.destroy()
    this._cursor.destroy()
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

  update () {
    this._video.update()
  }

  tick (delta) {
    if (this.isRunning) {
      let t = performance.now()

      for (let tt of this._ticks) {
        tt.tick(t, delta)
      }

      this._player.tick(t, delta)
      this._scheduler.tick(t, delta)
      this._video.tick(t, delta)
      this._cursor.tick(t, delta)
    }
  }

  gotoScene (name) {
    if (this._scenes[name]) {
      if (this._scene) {
        this._scene.stop()
      }

      let s = this._scenes[name]
      s.load(() => {
        s.start()
      })

      this._scene = s
    }
  }

  load (cb) {
    PIXI.loader
      .add('../static/sprites/sprites.json')
      .load(() => cb.call(this))
  }

}

module.exports = {
  Game,
}

const utils = require('../../utils')

const { EventsManager } = require('../../mixins/common/events')
const { StateMixin } = require('../../mixins/core/state')
const { Scheduler } = require('./scheduler')
const { Video } = require('../video/video')
const { PlayerObject } = require('./player-object')
const { CursorObject } = require('./cursor-object')

let Game = class Game extends mix(Object).with(EventsManager, StateMixin) {

  constructor () {
    super()

    this._ticks = []

    this._player = new PlayerObject()
    this._scheduler = new Scheduler()
    this._video = new Video()
    this._cursor = new CursorObject()
    this._maps = []
    this._spritesheets = {}

    this.reset()

    this._tickBound = this.tick.bind(this)
    PIXI.ticker.shared.add(this._tickBound)

    this.loadAssets()
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

  get player () { return this._player }
  get video () { return this._video }
  get scheduler () { return this._scheduler }
  get ticks () { return this._ticks }
  get spritesheets () { return this._spritesheets }

  reset () {
    this._ticks = []
    this._player.reset()
    this._scheduler.reset()
    this._video.reset()
    this._cursor.reset()
  }

  start () {
    if (this.isStopped) {
      this.reset()
      super.start()
    }
  }

  destroy () {
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

  goto (map) {
  }

  loadAssets () {
    PIXI.loader
      .add('../static/sprites/sprites.json')
      .load(() => this.start())
  }

}

module.exports = {
  Game,
}

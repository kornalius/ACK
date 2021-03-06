const utils = require('../../utils')
const ROT = require('rot-js')

const { EventsManager } = require('../../mixins/common/events')
const { StateMixin } = require('../../mixins/common/state')
const { ActMixin } = require('../../mixins/core/act')

const { Video } = require('../video/video')

const { ActionManager } = require('./action-manager')
const { Scheduler } = require('./scheduler')
const { Cursor } = require('../ui/cursor')

const { Player } = require('./player')

const { PlayScene } = require('../../game/scenes/play-scene')

const { Words } = require('./words')

const { getFont, loadFonts } = require('./font')

const { SpriteAction } = require('../actions/sprite-action')
const { ObjectAction } = require('../actions/object-action')
const { TextAction } = require('../actions/text-action')
const { DestroyAction } = require('../actions/destroy-action')

const { Text } = require('../ui/text')

class Game extends mix(Object).with(EventsManager, StateMixin, ActMixin) {

  constructor () {
    super()

    this._ticks = []

    this._scheduler = new Scheduler()
    this._actionManager = new ActionManager()
    this._video = new Video()
    this._cursor = new Cursor()

    this._scene = undefined
    this._scenes = {}

    this._words = new Words()

    this._ticks = []
    this._tickBound = this.tick.bind(this)
    PIXI.ticker.shared.add(this._tickBound)

    this._pauseInput = false

    this.load(this.start)
  }

  get DEVMODE () { return true }

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

  get ROT () { return ROT }

  get ticks () { return this._ticks }

  get player () { return this._player }
  get video () { return this._video }
  get scheduler () { return this._scheduler }

  get scene () { return this._scene }
  get scenes () { return this._scenes }

  get words () { return this._words }

  get pauseInput () { return this._pauseInput }
  set pauseInput (value) {
    if (value !== this._pauseInput) {
      this._pauseInput = value
    }
  }

  font (name) {
    return getFont(name)
  }

  start () {
    if (this.isStopped) {
      this._actionManager.start()

      this.actSpeed = 100

      this._player = new Player()

      this._cursor.start()

      super.start()

      this._scenes.play = new PlayScene()

      this.gotoScene('play')
    }
  }

  stop () {
    this._cursor.stop()
    this._actionManager.stop()

    super.stop()
  }

  destroy () {
    this.stop()

    if (this._player) {
      this._player.destroy()
      this._player = undefined
    }

    if (this._scheduler) {
      this._scheduler.destroy()
      this._scheduler = undefined
    }

    if (this._video) {
      this._video.destroy()
      this._video = undefined
    }

    if (this._cursor) {
      this._cursor.destroy()
      this._cursor = undefined
    }

    if (this._scene) {
      this._scene.destroy()
      this._scene = undefined
    }

    if (this._words) {
      this._words.destroy()
      this._words = undefined
    }

    this._ticks = []
    this._tickBound = undefined
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
    if (this._scene && this._scene.update) {
      this._scene.update()
    }

    this._video.update()
  }

  tick (delta) {
    if (this.isRunning) {
      let t = performance.now()

      super.tick(t, delta)

      TWEEN.update()

      for (let tt of this._ticks) {
        tt.tick(t, delta)
      }

      this._player.tick(t, delta)
      this._scheduler.tick(t, delta)
      this._video.tick(t, delta)
      this._cursor.tick(t, delta)

      if (this._scene) {
        this._scene.tick(t, delta)
      }
    }
  }

  act (t, delta) {
    super.act(t, delta)

    if (!this._pauseInput) {
      if (key.isPressed('left')) {
        this._player.moveBy(-1, 0)
      }
      else if (key.isPressed('right')) {
        this._player.moveBy(1, 0)
      }
      else if (key.isPressed('up')) {
        this._player.moveBy(0, -1)
      }
      else if (key.isPressed('down')) {
        this._player.moveBy(0, 1)
      }
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
      .load(async () => {
        loadFonts().then(cb.bind(this))
      })
  }

  addAction (...actions) {
    for (let action of actions) {
      if (_.isArray(action)) {
        for (let a of actions) {
          this._actionManager.add(a)
        }
      }
      else {
        this._actionManager.add(action)
      }
    }
  }

  spriteAction (options) {
    return new SpriteAction(options)
  }

  objectAction (options) {
    return new ObjectAction(options)
  }

  textAction (options) {
    return new TextAction(options)
  }

  destroyAction (options) {
    return new DestroyAction(options)
  }

  text (text, font, color) {
    return new Text(text, font, color)
  }

}

module.exports = {
  Game,
}

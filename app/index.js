const utils = require('./utils')

const { Scheduler } = require('./classes/common/scheduler')
const { Point } = require('./classes/common/point')
const { Rect } = require('./classes/common/rect')
const { Range } = require('./classes/common/range')
const { Size } = require('./classes/common/size')

// Check for littleEndian
let b = new ArrayBuffer(4)
let a = new Uint32Array(b)
let c = new Uint8Array(b)
a[0] = 0xdeadbeef

const littleEndian = c[0] === 0xef

let _main
let _scheduler

class ACKClass {
  get DIRS () { return utils.dirs }
  get app () { return utils.app }
  get userPath () { return utils.userPath }

  get APP_NAME () { return utils.name }
  get VERSION () { return utils.version }
  get IS_WIN () { return utils.IS_WIN }
  get IS_OSX () { return utils.IS_OSX }
  get IS_LINUX () { return utils.IS_LINUX }

  get electron () { return utils.electron }
  get remote () { return utils.remote }
  get screen () { return utils.screen }
  get BrowserWindow () { return utils.BrowserWindow }

  get openFile () { return utils.openFile }
  get saveFile () { return utils.saveFile }
  get messageBox () { return utils.messageBox }

  get raf () { return utils.raf }
  get caf () { return utils.raf.cancel }
  get process () { return utils.process }

  get os () { return utils.os }
  get child_process () { return utils.child_process }
  get dns () { return utils.dns }
  get http () { return utils.http }
  get https () { return utils.https }
  get net () { return utils.net }
  get querystring () { return utils.querystring }
  get stream () { return utils.stream }
  get tls () { return utils.tls }
  get tty () { return utils.tty }
  get url () { return utils.url }
  get zlib () { return utils.zlib }
  get zip () { return utils.pako }

  get stringToFunction () { return utils.stringToFunction }

  get debounce () { return utils.debounce }
  get throttle () { return utils.throttle }

  get offsetLeft () { return utils.offsetLeft }
  get offsetTop () { return utils.offsetTop }

  get isElement () { return utils.isElement }
  get isShadowRoot () { return utils.isShadowRoot }
  get isSlotElement () { return utils.isSlotElement }
  get isEvent () { return utils.isEvent }

  get selectables () { return utils.selectables }
  get disableSelectables () { return utils.disableSelectables }
  get enableSelectables () { return utils.enableSelectables }

  get storeProps () { return utils.storeProps }
  get restoreProps () { return utils.restoreProps }

  get main () {
    if (!_main) {
      _main = new Main()
    }
    return _main
  }

  get scheduler () {
    if (!_scheduler) {
      _scheduler = new Scheduler()
    }
    return _scheduler
  }

  get keyToString () { return utils.keyToString }
  get stringToKey () { return utils.stringToKey }
  get keyevent () { return utils.keyevent }

  get $ () { return utils.$ }

  async find (path) {
    if (_.isString(path)) {
      if (_.isUUID(path)) {
        if (ACK.domIndex[path]) {
          return ACK.domIndex[path]
        }
      }
      return await ACK.FS.find(path)
    }
    return path
  }

  bounds (el) {
    return new window.Rect(el.getBoundingClientRect())
  }

}

window.ACK = new ACKClass()

_.uuid = utils.uuid
_.observeMutation = utils.observeMutation
_.observeResize = utils.observeResize
_.observeIntersection = utils.observeIntersection
_.deref = utils.deref
_.ref = utils.ref
_.now = utils.now
_.littleEndian = littleEndian
_.wrapAround = utils.wrapAround
_.mouseEvent = utils.mouseEvent

window.Point = Point
window.Rect = Rect
window.Range = Range
window.Size = Size

_.isPoint = function (value) {
  return value instanceof Point
}

_.isRect = function (value) {
  return value instanceof Rect
}

_.isRange = function (value) {
  return value instanceof Range
}

_.isSize = function (value) {
  return value instanceof Size
}

_.isUUID = function (value) {
  return utils.isUUID(value)
}

const { Main } = require('./main')
ACK.main.on('start', () => {
})

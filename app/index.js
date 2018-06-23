const utils = require('./utils')

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

_.addProp = function (instance, name, value, readonly = false, resetFn) {
  let privName = '_' + name
  let proto = Object.getPrototypeOf(instance)
  let setFn = 'set' + _.upperFirst(name)

  proto.__props = proto.__props || {}

  if (!proto.__props[name]) {
    Object.defineProperty(proto, name, {
      enumerable: true,
      get: function () { return this[privName] },
      set: function (value) {
        let old = this[privName]
        if (!readonly && value !== old) {
          if (_.isFunction(this[setFn])) {
            let r = this[setFn](value)
            if (!_.isUndefined(r)) {
              value = r
            }
          }
          this[privName] = value
          this.emit(_.kebabCase(name) + '-change', { value, old })
        }
      },
    })

    proto.__props[name] = { name, privName, value, readonly, resetFn }
  }

  instance[privName] = value
}

_.removeProp = function (instance, name) {
  let proto = Object.getPrototypeOf(instance)
  let p = proto.__props[name]

  delete this[p.privName]
  delete this[name]
  delete proto.__props[name]
}

_.resetProps = function (instance) {
  let proto = Object.getPrototypeOf(instance)

  for (let key in proto.__props || {}) {
    let p = proto.__props[key]
    instance[p.privName] = p.value
    if (p.resetFn) {
      instance[p.resetFn]()
    }
  }
}

PIXI.Point.prototype.distance = function (target) {
  return Math.sqrt((this.x - target.x) * (this.x - target.x) + (this.y - target.y) * (this.y - target.y))
}

const { Game } = require('./classes/core/game')
window.ACK = new Game()
ACK.on('start', () => {})

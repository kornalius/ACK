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

PIXI.Point.prototype.distance = target => {
  Math.sqrt((this.x - target.x) * (this.x - target.x) + (this.y - target.y) * (this.y - target.y))
}

const { Game } = require('./classes/core/game')
window.ACK = new Game()
ACK.on('start', () => {})

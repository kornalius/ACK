const { Emitter } = require('../../mixins/common/events')

let Map = class Map extends Emitter {

  constructor () {
    super()

    this.clear()
  }

  get width () {
    let t = _.maxBy(this._tiles, 'x')
    let o = _.maxBy(this._objects, 'x')
    let n = _.maxBy(this._npcs, 'x')
    return Math.max(t, o, n)
  }

  get height () {
    let t = _.maxBy(this._tiles, 'y')
    let o = _.maxBy(this._objects, 'y')
    let n = _.maxBy(this._npcs, 'y')
    return Math.max(t, o, n)
  }

  get tiles () { return this._tiles }
  get objects () { return this._objects }
  get npcs () { return this._npcs }

  clear () {
    this._tiles = []
    this._objects = []
    this._npcs = []
  }

  at (x, y) {
    let tile = _.find(this._tiles, { x, y })
    let objects = _.filter(this._objects, { x, y })
    let npcs = _.filter(this._npcs, { x, y })
    return { tile, objects, npcs }
  }

}

module.exports = {
  Map,
}

const { Emitter } = require('../../mixins/common/events')

let MapObject = class MapObject extends Emitter {

  constructor () {
    super()

    this.reset()
  }

  get startPosition () { return this._startPosition }

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

  reset () {
    this._startPosition = new PIXI.Point()
    this._needsRender = false
    this._tiles = []
    this._objects = []
    this._npcs = []
  }

  at (x, y) {
    let tile = _.find(this._tiles, { x, y })
    let objects = _.filter(this._objects, { x, y })
    let npcs = _.filter(this._npcs, { x, y })
    let player = ACK.player.x === x && ACK.player.y === y
    return { tile, objects, npcs, player }
  }

  tick (t, delta) {
    for (let t of this._tiles) {
      t.tick(t, delta)
    }
    for (let o of this._objects) {
      o.tick(t, delta)
    }
    for (let n of this._npcs) {
      n.tick(t, delta)
    }
    if (this._needsRender) {
      this._needsRender = false
      this.render()
    }
  }

  update () {
    this._needsRender = true
  }

  render () {
    for (let t of this._tiles) {
      t.sprite.position.set(t.x, t.y)
    }
    for (let o of this._objects) {
      o.sprite.position.set(o.x, o.y)
    }
    for (let n of this._npcs) {
      n.sprite.position.set(n.x, n.y)
    }
  }

  load () {
  }

  save () {
  }

}

module.exports = {
  MapObject,
}

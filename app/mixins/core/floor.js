const FloorMixin = Mixin(superclass => class FloorMixin extends superclass {

  constructor () {
    super(...arguments)

    _.addProp(this, 'levels', undefined, true)
    _.addProp(this, 'fovs', undefined, true)
    _.addProp(this, 'explored', [], true)
  }

  get isFloor () { return true }

  _destroyLevels () {
    for (let level = 0; level < this._depth; level++) {
      this._levels[level].destroy()
    }
  }

  isFloorAt (x, y, z) {
    return _.get(this.tileAt(x, y, z), 'type') === 1 // TILE_FLOOR
  }

  isEmptyFloorAt (x, y, z) {
    return this.isFloorAt(x, y, z) && _.isEmpty(this.itemsAt(x, y, z)) && _.isEmpty(this.npcsAt(x, y, z))
  }

  getRandomFloorPosition (z) {
    let x
    let y
    while (!this.isEmptyFloorAt(x, y, z)) {
      x = Math.floor(Math.random() * this._width)
      y = Math.floor(Math.random() * this._height)
    }
    return { x, y, z }
  }

  _setupLevels () {
    this._levels = new Array(this._depth)
    for (let level = 0; level < this._depth; level++) {
      this._levels[level] = new PIXI.Container()
    }
  }

  _setupFovs () {
    this._fovs = new Array(this._depth)
    for (let z = 0; z < this._depth; z++) {
      this._fovs[z] = new ACK.ROT.FOV.PreciseShadowcasting((x, y) => _.get(this.tileAt(x, y, z), 'blocksLight', true))
    }
  }

  setExplored (x, y, z, state) {
    if (this.tileAt(x, y, z)) {
      this._explored.push({ x, y, z, state })
    }
  }

  isExplored (x, y, z) {
    return this.tileAt(x, y, z) ? _.get(_.find(this._explored, { x, y, z }), 'state', false) : false
  }

})

module.exports = {
  FloorMixin,
}

const { EventsManager } = require('../../mixins/common/events')
const { StateMixin } = require('../../mixins/core/state')
const { ActMixin } = require('../../mixins/core/act')
const { FloorMixin } = require('../../mixins/core/floor')

const { TileObject } = require('./objects/tile-object')

const { TILE_WIDTH, TILE_HEIGHT, TILE_WALL, TILE_FLOOR, TILE_STAIRS_DOWN, TILE_STAIRS_UP } = require('../../constants')

let Map = class Map extends mix(Object).with(EventsManager, StateMixin, ActMixin, FloorMixin) {

  constructor (width, height, depth = 1) {
    super()

    this.reset()

    this._width = width
    this._height = height
    this._depth = depth
  }

  get startPosition () { return this._startPosition }

  get tiles () { return this._tiles }
  get items () { return this._items }
  get npcs () { return this._npcs }

  get width () { return this._width }
  get height () { return this._height }
  get depth () { return this._depth }

  reset () {
    _.resetProps(this)

    this._startPosition = { x: 0, y: 0, z: 0 }
    this._needsRender = false

    this._tiles = []
    this._items = []
    this._npcs = []

    this._width = 0
    this._height = 0
    this._depth = 0
  }

  start () {
    this._setupLevels()
    this._setupFovs()

    super.start()
  }

  stop () {
    this._destroyLevels()

    this.reset()

    super.stop()
  }

  _setupLevels () {
    this._levels = new Array(this._depth)
    for (let level = 0; level < this._depth; level++) {
      this._levels[level] = new PIXI.Container()
    }
  }

  _destroyLevels () {
    for (let level = 0; level < this._depth; level++) {
      this._levels[level].destroy()
    }
  }

  at (x, y, z) {
    let tile = this.tileAt(x, y, z)
    let items = this.itemsAt(x, y, z)
    let npcs = this.npcsAt(x, y, z)
    let player = ACK.player.x === x && ACK.player.y === y && ACK.player.z === z
    return { tile, items, npcs, player }
  }

  around (centerX, centerY, centerZ, radius) {
    let results = []
    for (let x = centerX - radius; x <= centerX + radius; x++) {
      for (let y = centerY - radius; y <= centerY + radius; y++) {
        results.push(this.at(x, y, centerZ))
      }
    }
    return results
  }

  get sprites () {
    return _.concat(
      _.map(this._tiles, t => t.sprite),
      _.map(this._items, i => i.sprite),
      _.map(this._npcs, n => n.sprite),
      [this._player.sprite],
    )
  }

  resetSpritesTint () {
    for (let sprite of this.sprites) {
      sprite.tint = 0xFFFFFF
    }
  }

  spritesAt (x, y, z) {
    let at = this.at(x, y, z)
    return _.concat(
      at.tile ? [at.tile.sprite] : [],
      _.map(at.items || [], i => i.sprite),
      _.map(at.npcs || [], n => n.sprite),
      at.player ? [at.player.sprite] : [],
    )
  }

  blockedAt (x, y, z) {
    return _.get(this.tileAt(x, y, z), 'blocked', true)
  }

  tileAt (x, y, z) {
    return _.find(this._tiles, { x, y, z })
  }

  itemsAt (x, y, z) {
    return _.filter(this._items, { x, y, z })
  }

  npcsAt (x, y, z) {
    return _.filter(this._npcs, { x, y, z })
  }

  tilesAround (centerX, centerY, centerZ) {
    let tiles = _.map(this.around(centerX, centerY, centerZ), 'tile')
    return _.filter(tiles, a => !_.isEmpty(a))
  }

  itemsAround (centerX, centerY, centerZ) {
    let items = _.map(this.around(centerX, centerY, centerZ), 'items')
    return _.flatten(_.filter(items, a => !_.isEmpty(a)))
  }

  npcsAround (centerX, centerY, centerZ) {
    let npcs = _.map(this.around(centerX, centerY, centerZ), 'npcs')
    return _.flatten(_.filter(npcs, a => !_.isEmpty(a)))
  }

  act (t, delta) {
    super.act(t, delta)

    for (let t of this._tiles) {
      t.act(t, delta)
    }
    for (let o of this._items) {
      o.act(t, delta)
    }
    for (let n of this._npcs) {
      n.act(t, delta)
    }

    if (this._needsRender) {
      this.render()
    }
  }

  tick (t, delta) {
    if (super.tick(t, delta)) {
      if (this._needsRender) {
        this.render()
      }
    }
  }

  update () {
    this._needsRender = true
  }

  _placeSprite (x, y, z, sprite) {
    if (!sprite) {
      return
    }

    if (ACK.player.z === z) {
      sprite.position.set(x * TILE_WIDTH, y * TILE_HEIGHT)
      if (!sprite.parent) {
        ACK.video.stage.addChild(sprite)
      }
    }
    else if (sprite.parent) {
      ACK.video.stage.removeChild(sprite)
    }
  }

  render () {
    this._needsRender = false

    let p = ACK.player
    this._placeSprite(p.x, p.y, p.z, p._sprite)

    for (let t of this._tiles) {
      this._placeSprite(t.x, t.y, t.z, t._sprite)
    }

    for (let o of this._items) {
      this._placeSprite(o.x, o.y, o.z, o._sprite)
    }

    for (let n of this._npcs) {
      this._placeSprite(n.x, n.y, n.z, n._sprite)
    }
  }

  load (cb) {
    cb()
  }

  save (cb) {
    cb()
  }

  generateTiles (width, height, depth) {
    let dungeon = new ACK.ROT.Map.Digger(width, height)

    for (let z = 0; z < depth; z++) {
      dungeon.create((x, y, wall) => this._tiles.push(new TileObject(x, y, z, this, wall ? TILE_WALL : TILE_FLOOR)))
    }

    // Place stairs
    for (let level = 0; level < depth - 1; level++) {
      let floorX
      let floorY
      let tries = 0

      while ((this.blockedAt(floorX, floorY, level) || this.blockedAt(floorX, floorY, level + 1)) && tries < 1000) {
        floorX = Math.floor(Math.random() * width)
        floorY = Math.floor(Math.random() * height)
        tries++
      }

      if (tries < 1000 && floorX !== undefined && floorY !== undefined) {
        this.setTileTypeAt(floorX, floorY, level, TILE_STAIRS_DOWN)
        this.setTileTypeAt(floorX, floorY, level + 1, TILE_STAIRS_UP)
      }
    }
  }

  addItemAtRandomPosition (item, z) {
    let position = this.getRandomFloorPosition(z)
    if (position) {
      return this.addItem(position.x, position.y, position.z, item)
    }
    return false
  }

  addItemAt (item, x, y, z) {
    if (!this.isItemAt(item, x, y, z)) {
      this._items.push({ x, y, z, item })
      return true
    }
    return false
  }

  removeItemAt (item, x, y, z) {
    if (this.isItemAt(item, x, y, z)) {
      _.remove(this._items, { x, y, z, item })
      return true
    }
    return false
  }

  isItemAt (item, x, y, z) {
    return !_.isUndefined(_.find(this.itemsAt(x, y, z, item)))
  }

  addNpcAtRandomPosition (npc, z) {
    let position = this.getRandomFloorPosition(z)
    if (position) {
      return this.addNpc(position.x, position.y, position.z, npc)
    }
    return false
  }

  addNpcAt (npc, x, y, z) {
    if (!this.isNpcAt(npc, x, y, z)) {
      this._npcs.push({ x, y, z, npc })
      return true
    }
    return false
  }

  removeNpcAt (npc, x, y, z) {
    if (this.isNpcAt(npc, x, y, z)) {
      _.remove(this._npcs, { x, y, z, npc })
      return true
    }
    return false
  }

  isNpcAt (npc, x, y, z) {
    return !_.isUndefined(_.find(this.npcsAt(x, y, z, npc)))
  }

}

module.exports = {
  Map,
}

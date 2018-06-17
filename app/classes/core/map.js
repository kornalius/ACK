const { EventsManager } = require('../../mixins/common/events')
const { StateMixin } = require('../../mixins/common/state')
const { ActMixin } = require('../../mixins/core/act')

const { TileObject } = require('./objects/tile-object')

const { StairsUp, StairsDown } = require('../../game/items/stairs-up')

const { VIDEO_WIDTH, VIDEO_HEIGHT, VIDEO_SCALE, TILE_WIDTH, TILE_HEIGHT, TILE_WALL, TILE_FLOOR } = require('../../constants')

let Map = class Map extends mix(Object).with(EventsManager, StateMixin, ActMixin) {

  constructor (width, height, depth = 1) {
    super()

    this.reset()

    this._width = width
    this._height = height
    this._depth = depth
  }

  get container () { return this._container }

  get width () { return this._width }
  get height () { return this._height }
  get depth () { return this._depth }

  get levels () { return this._levels }
  get level () { return this._level }

  get tiles () { return this._tiles }
  get items () { return this._items }
  get npcs () { return this._npcs }

  get player () { return ACK.player }

  get fovs () { return this._fovs }
  get explored () { return this._explored }

  reset () {
    _.resetProps(this)

    this._needsRender = false

    this._tiles = []
    this._items = []
    this._npcs = []

    this._width = 0
    this._height = 0
    this._depth = 0

    this._levels = undefined
    this._level = -1

    this._fovs =
    this._explored = []
  }

  start () {
    this._container = new PIXI.Container()

    this._container.interactive = true

    this._container.on('mousemove', e => {
      let x = e.data.global.x / VIDEO_SCALE - _.get(e, 'target.position.x', 0)
      let y = e.data.global.y / VIDEO_SCALE - _.get(e, 'target.position.y', 0)
      let tx = Math.floor(x / TILE_HEIGHT)
      let ty = Math.floor(y / TILE_WIDTH)
      let t = this.tileAt(tx, ty, this._level)
      if (t && t._type === TILE_FLOOR && this.isExplored(tx, ty, this._level) && t._sprite.alpha !== 0) {
        this.selectTileAt(tx, ty)
      }
      else {
        this.unselectTiles()
      }
    })

    this._container.on('mousedown', e => {
      let x = e.data.global.x / VIDEO_SCALE - _.get(e, 'target.position.x', 0)
      let y = e.data.global.y / VIDEO_SCALE - _.get(e, 'target.position.y', 0)
      let tx = Math.floor(x / TILE_HEIGHT)
      let ty = Math.floor(y / TILE_WIDTH)
      let t = this.tileAt(tx, ty, this._level)
      if (t && t._type === TILE_FLOOR && this.isExplored(tx, ty, this._level) && t._sprite.alpha !== 0) {
        this.centerOn(tx * TILE_WIDTH, ty * TILE_HEIGHT)
      }
    })

    this._setupLevels()
    this._setupFovs()

    super.start()

    this.gotoLevel(0)
  }

  stop () {
    this._destroyFovs()
    this._destroyLevels()

    if (this._container) {
      this._container.parent.removeChild(this._container)
      this._container.destroy()
      this._container = undefined
    }

    this.reset()

    super.stop()
  }

  get isFloor () { return true }

  isFloorAt (x, y, z) {
    return _.get(this.tileAt(x, y, z), 'type') === TILE_FLOOR
  }

  isEmptyFloorAt (x, y, z) {
    return this.isFloorAt(x, y, z) && _.isEmpty(this.itemsAt(x, y, z)) && _.isEmpty(this.npcsAt(x, y, z))
  }

  getRandomFloorPosition (z) {
    let x = Math.floor(Math.random() * this._width)
    let y = Math.floor(Math.random() * this._height)
    while (!this.isEmptyFloorAt(x, y, z)) {
      x = Math.floor(Math.random() * this._width)
      y = Math.floor(Math.random() * this._height)
    }
    return { x, y }
  }

  _setupFovs () {
    this._fovs = new Array(this._depth)
    for (let z = 0; z < this._depth; z++) {
      this._fovs[z] = new ACK.ROT.FOV.PreciseShadowcasting((x, y) => !this.sightBlockedAt(x, y, z))
    }
  }

  _destroyFovs () {
    for (let z = 0; z < this._depth; z++) {
      this._fovs[z] = undefined
    }
    this._fovs = undefined
  }

  setExplored (x, y, z, state) {
    if (this.tileAt(x, y, z)) {
      this._explored.push({ x, y, z, state })
      _.each(this.spritesAt(x, y, z), sprite => { sprite.alpha = state ? 1 : 0 })
    }
  }

  isExplored (x, y, z) {
    return this.tileAt(x, y, z) ? _.get(_.find(this._explored, { x, y, z }), 'state', false) : false
  }

  _setupLevels () {
    this._levels = new Array(this._depth)
    for (let level = 0; level < this._depth; level++) {
      this._levels[level] = new PIXI.Container()
    }
    this._generateLevels()
  }

  _destroyLevels () {
    for (let level = 0; level < this._depth; level++) {
      this._levels[level].destroy()
      this._levels[level] = undefined
    }
  }

  hasLevel (level) {
    return level < this._depth
  }

  at (x, y, z) {
    let tile = this.tileAt(x, y, z)
    let items = this.itemsAt(x, y, z)
    let npcs = this.npcsAt(x, y, z)
    let player = this.player
    player = player.x === x && player.y === y && player.z === z ? player : undefined
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
      [this.player.sprite],
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

  tileAt (x, y, z) {
    return _.find(this._tiles, i => i.x === x && i.y === y && i.z === z)
  }

  itemsAt (x, y, z) {
    return _.filter(this._items, i => i.x === x && i.y === y && i.z === z)
  }

  npcsAt (x, y, z) {
    return _.filter(this._npcs, i => i.x === x && i.y === y && i.z === z)
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

  render () {
    ACK.update()
  }

  load (cb) {
    cb()
  }

  save (cb) {
    cb()
  }

  _generateLevels () {
    let dungeon = new ACK.ROT.Map.Digger(this._width, this._height)

    for (let z = 0; z < this._depth; z++) {
      dungeon.create((x, y, wall) => this._tiles.push(new TileObject(x, y, z, this, wall ? TILE_WALL : TILE_FLOOR)))
    }

    // Place stairs
    for (let level = 0; level < this._depth - 1; level++) {
      let floorX
      let floorY
      let tries = 0

      while ((this.blockedAt(floorX, floorY, level) || this.blockedAt(floorX, floorY, level + 1)) && tries < 1000) {
        floorX = Math.floor(Math.random() * this._width)
        floorY = Math.floor(Math.random() * this._height)
        tries++
      }

      if (tries < 1000 && floorX !== undefined && floorY !== undefined) {
        this.addItemAt(new StairsDown(floorX, floorY, level, this))
        this.addItemAt(new StairsUp(floorX, floorY, level + 1, this))
      }
    }

    return dungeon
  }

  addItemAtRandomPosition (item, z) {
    let p = this.getRandomFloorPosition(z)
    if (p) {
      return this.addItemAt(p.x, p.y, p.z, item)
    }
    return false
  }

  addItemAt (item, x, y, z) {
    x = x || item.x
    y = y || item.y
    z = z || item.z

    if (!item.isAt(x, y, z, this)) {
      this._items.push(item)
      item.moveTo(x, y, z, this)
      return true
    }
    return false
  }

  removeItemAt (item, x, y, z) {
    x = x || item.x
    y = y || item.y
    z = z || item.z

    if (item.isAt(x, y, z, this)) {
      _.remove(this._items, item)
      item.map = undefined
      return true
    }
    return false
  }

  addNpcAtRandomPosition (npc, z) {
    let position = this.getRandomFloorPosition(z)
    if (position) {
      return this.addNpc(position.x, position.y, position.z, npc)
    }
    return false
  }

  addNpcAt (npc, x, y, z) {
    if (!npc.isAt(x, y, z, this)) {
      npc.moveTo(x, y, z, this)
      this._npcs.push(npc)
      return true
    }
    return false
  }

  removeNpcAt (npc, x, y, z) {
    if (npc.isAt(x, y, z, this)) {
      _.remove(this._npcs, npc)
      npc.map = undefined
      return true
    }
    return false
  }

  blockedAt (x, y, z) {
    let p = this.at(x, y, z)
    return _.get(p.tile, 'blocked') ||
      _.find(_.get(p, 'items', []), { blocked: true }) ||
      !_.isEmpty(p.npcs) ||
      p.player
  }

  lightBlockedAt (x, y, z) {
    let p = this.at(x, y, z)
    return _.get(p.tile, 'lightBlocked') ||
      _.find(_.get(p, 'items', []), { lightBlocked: true })
  }

  sightBlockedAt (x, y, z) {
    let p = this.at(x, y, z)
    return _.get(p.tile, 'sightBlocked') ||
      _.find(_.get(p, 'items', []), { sightBlocked: true })
  }

  enter (level) {
    this._level = level

    this._container.removeChildren()
    this._container.addChild(this._levels[level])

    let p = this.getRandomFloorPosition(level)
    this.player.moveTo(p.x, p.y, level, this)

    this.emit('enter-level', { level })
  }

  exit (level) {
    this._container.removeChild(this._levels[level])
    this.emit('exit-level', { level })
  }

  gotoLevel (level) {
    if (this._level !== level) {
      this.exit(this._level)
      this.enter(level)
    }
  }

  levelContainer (level = this._level) {
    return this._levels[level]
  }

  selectTileAt (x, y) {
    let s = this._tileSelector
    if (!s) {
      s = new PIXI.Sprite(PIXI.Texture.fromFrame('select.png'))
      this._tileSelector = s
    }
    let c = this.levelContainer()
    if (s.parent !== c) {
      if (s.parent) {
        s.parent.removeChild(s)
      }
      c.addChild(s)
    }
    s.position.set(x * TILE_WIDTH, y * TILE_HEIGHT)
  }

  unselectTiles () {
    let s = this._tileSelector
    if (s && s.parent) {
      s.parent.removeChild(s)
    }
  }

  scrollTo (x, y) {
    let c = this._container
    let coords = { x: c.position.x, y: c.position.y }
    new TWEEN.Tween(coords)
      .to({ x, y }, 250)
      .easing(TWEEN.Easing.Quadratic.Out)
      .onUpdate(() => {
        c.position.set(coords.x, coords.y)
        ACK.update()
      })
      .start()
  }

  scrollBy (x, y) {
    let c = this._container
    this.scrollTo(c.position.x + x, c.position.y + y)
  }

  centerOn (x, y) {
    let r = this.bounds()
    let w = r.width / 2
    let h = r.height / 2
    let sw = VIDEO_WIDTH / 3
    let sh = VIDEO_HEIGHT / 1.5
    this.scrollTo(w - x - sw, h - y - sh)
  }

  bounds () {
    return new PIXI.Rectangle(0, 0, this._width * TILE_WIDTH, this._height * TILE_HEIGHT)
  }

}

module.exports = {
  Map,
}

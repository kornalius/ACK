const { EventsManager } = require('../../mixins/common/events')
const { StateMixin } = require('../../mixins/common/state')
const { ActMixin } = require('../../mixins/core/act')

const { TileObject } = require('./objects/tile-object')

const { StairsUp, StairsDown } = require('../../game/items/stairs')
const { Door, RedDoor, BlueDoor, GreenDoor, YellowDoor } = require('../../game/items/doors')
const { RedKey, BlueKey, GreenKey, YellowKey } = require('../../game/items/keys')

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
  get rooms () { return this._rooms }
  get corridors () { return this._corridors }
  get level () { return this._level }

  get tiles () { return this._tiles }
  get items () { return this._items }
  get npcs () { return this._npcs }

  get player () { return ACK.player }

  get fovs () { return this._fovs }
  get explored () { return this._explored }

  get bounds () { return new PIXI.Rectangle(0, 0, this._width * TILE_WIDTH, this._height * TILE_HEIGHT) }

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
    this._rooms = undefined
    this._corridors = undefined
    this._level = -1

    this._fovs =
    this._explored = []
  }

  start () {
    this._container = new PIXI.Container()

    this._container.interactive = true

    this._container.on('mousemove', e => {
      this.unselectTiles()
      if (!ACK.pauseInput) {
        let x = e.data.global.x / VIDEO_SCALE - _.get(e, 'target.position.x', 0)
        let y = e.data.global.y / VIDEO_SCALE - _.get(e, 'target.position.y', 0)
        let tx = Math.floor(x / TILE_HEIGHT)
        let ty = Math.floor(y / TILE_WIDTH)
        let t = this.tileAt(tx, ty, this._level)
        if (t && t._type === TILE_FLOOR && this.isExplored(tx, ty, this._level) && t._sprite.alpha !== 0) {
          this.selectTileAt(tx, ty)
        }
      }
    })

    this._container.on('mousedown', e => {
      if (!ACK.pauseInput) {
        let x = e.data.global.x / VIDEO_SCALE - _.get(e, 'target.position.x', 0)
        let y = e.data.global.y / VIDEO_SCALE - _.get(e, 'target.position.y', 0)
        let tx = Math.floor(x / TILE_HEIGHT)
        let ty = Math.floor(y / TILE_WIDTH)
        let t = this.tileAt(tx, ty, this._level)
        if (t && t._type === TILE_FLOOR && this.isExplored(tx, ty, this._level) && t._sprite.alpha !== 0) {
          this.centerOn(tx * TILE_WIDTH, ty * TILE_HEIGHT)
        }
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
      this._container.destroy({ children: true })
      this._container = undefined
    }

    this.reset()

    super.stop()
  }

  isFloorAt (x, y, z) {
    return _.get(this.tileAt(x, y, z), 'type') === TILE_FLOOR
  }

  isEmptyFloorAt (x, y, z) {
    return this.isFloorAt(x, y, z) && _.isEmpty(this.itemsAt(x, y, z)) && _.isEmpty(this.npcsAt(x, y, z))
  }

  getRandomFloorPosition (z, bounds) {
    if (!bounds) {
      bounds = new PIXI.Rectangle(0, 0, this._width, this._height)
    }
    let x = _.random(bounds.left, bounds.right)
    let y = _.random(bounds.top, bounds.bottom)
    while (!this.isEmptyFloorAt(x, y, z)) {
      x = _.random(bounds.left, bounds.right)
      y = _.random(bounds.top, bounds.bottom)
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
    this._rooms = new Array(this._depth)
    this._corridors = new Array(this._depth)
    for (let level = 0; level < this._depth; level++) {
      this._levels[level] = new PIXI.Container()
    }
    this._generateLevels()
  }

  _destroyLevels () {
    for (let level = 0; level < this._depth; level++) {
      this._levels[level].destroy({ children: true })
      this._levels[level] = undefined
    }
    this._levels = undefined
    this._rooms = undefined
    this._corridors = undefined
    this._level = -1
  }

  hasLevel (level) {
    return level >= 0 && level < this._depth
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
      _.filter(_.map(this._tiles, t => t.sprite), s => !_.isUndefined(s)),
      _.filter(_.map(this._items, i => i.sprite), s => !_.isUndefined(s)),
      _.filter(_.map(this._npcs, n => n.sprite), s => !_.isUndefined(s)),
      this.player && this.player.sprite ? [this.player.sprite] : [],
    )
  }

  somethingAt (x, y, z, getter) {
    let items = this.itemsAt(x, y, z)
    for (let item of items) {
      if (item[getter]) {
        return item
      }
    }
    return undefined
  }

  stairAt (x, y, z) {
    return this.somethingAt(x, y, z, 'isStair')
  }

  doorAt (x, y, z) {
    return this.somethingAt(x, y, z, 'isDoor')
  }

  keyAt (x, y, z) {
    return this.somethingAt(x, y, z, 'isKey')
  }

  npcAt (x, y, z) {
    return this.somethingAt(x, y, z, 'isNpc')
  }

  resetSpritesTint () {
    for (let sprite of this.sprites) {
      sprite.tint = 0xFFFFFF
    }
  }

  spritesAt (x, y, z) {
    let at = this.at(x, y, z)
    return _.concat(
      at.tile && at.tile.sprite ? [at.tile.sprite] : [],
      _.filter(_.map(at.items, i => i.sprite), s => !_.isUndefined(s)),
      _.filter(_.map(at.npcs, n => n.sprite), s => !_.isUndefined(s)),
      at.player && at.player.sprite ? [at.player.sprite] : [],
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

  _generateStairs () {
    for (let z = 0; z < this._depth - 1; z++) {
      let x = _.random(this._width)
      let y = _.random(this._height)
      let tries = 0

      while ((this.blockedAt(x, y, z) || this.blockedAt(x, y, z + 1)) && tries < 1000) {
        x = _.random(this._width)
        y = _.random(this._height)
        tries++
      }

      if (tries < 1000) {
        this.addItemAt(new StairsUp(), x, y, z)
        this.addItemAt(new StairsDown(), x, y, z + 1)
      }
    }
  }

  _generateDoors (dungeon, z) {
    const doors = [Door, Door, Door, Door, Door, RedDoor, BlueDoor, GreenDoor, YellowDoor]
    const keys = {
      Door: undefined,
      RedDoor: RedKey,
      BlueDoor: BlueKey,
      GreenDoor: GreenKey,
      YellowDoor: YellowKey,
    }
    for (let room of this._rooms[z]) {
      room.getDoors((x, y) => {
        let DoorClass = _.sample(doors)
        this.addItemAt(new DoorClass(), x, y, z)

        let KeyClass = keys[DoorClass]
        if (KeyClass) {
          this.addItemAtRandomPosition(new KeyClass(), z)
        }
      })
    }
  }

  _generateLevels () {
    let dungeon = new ACK.ROT.Map.Digger(this._width, this._height)

    for (let z = 0; z < this._depth; z++) {
      dungeon.create((x, y, wall) => this._tiles.push(new TileObject(x, y, z, this, wall ? TILE_WALL : TILE_FLOOR)))
      this._rooms[z] = dungeon.getRooms()
      this._corridors[z] = dungeon.getCorridors()
    }

    for (let z = 0; z < this._depth; z++) {
      this._generateDoors(dungeon, z)
    }

    this._generateStairs()
  }

  addItemAtRandomPosition (item, z, bounds) {
    let p = this.getRandomFloorPosition(z, bounds)
    if (p) {
      return this.addItemAt(item, p.x, p.y, z)
    }
    return false
  }

  addItemAt (item, x = item.x, y = item.y, z = item.z) {
    if (!item.isAt(x, y, z, this)) {
      this._items.push(item)
      item.moveTo(x, y, z, this)
      return true
    }
    return false
  }

  removeItemAt (item, x = item.x, y = item.y, z = item.z) {
    if (item.isAt(x, y, z, this)) {
      _.remove(this._items, item)
      item.map = undefined
      return true
    }
    return false
  }

  addNpcAtRandomPosition (npc, z) {
    let p = this.getRandomFloorPosition(z)
    if (p) {
      return this.addNpc(p.x, p.y, z, npc)
    }
    return false
  }

  addNpcAt (npc, x = npc.x, y = npc.y, z = npc.z) {
    if (!npc.isAt(x, y, z, this)) {
      npc.moveTo(x, y, z, this)
      this._npcs.push(npc)
      return true
    }
    return false
  }

  removeNpcAt (npc, x = npc.x, y = npc.y, z = npc.z) {
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
      !_.isUndefined(_.find(p.items, { blocked: true })) ||
      !_.isEmpty(p.npcs) ||
      !_.isUndefined(p.player)
  }

  lightBlockedAt (x, y, z) {
    let p = this.at(x, y, z)
    return _.get(p.tile, 'lightBlocked') ||
      !_.isUndefined(_.find(p.items, { lightBlocked: true }))
  }

  sightBlockedAt (x, y, z) {
    let p = this.at(x, y, z)
    return _.get(p.tile, 'sightBlocked') ||
      !_.isUndefined(_.find(p.items, { sightBlocked: true }))
  }

  enter (level, x, y) {
    this._level = level

    this._container.removeChildren()

    let c = this.levelContainer(level)
    c.alpha = 0
    this._container.addChild(c)

    let p = !x && !y ? this.getRandomFloorPosition(level) : { x, y }
    this.player.moveTo(p.x, p.y, level, this, false)

    return new Promise((resolve, reject) => {
      let value = { alpha: 0.0 }
      new TWEEN.Tween(value)
        .to({ alpha: 1.0 }, 500)
        .easing(TWEEN.Easing.Quadratic.In)
        .onUpdate(() => {
          c.alpha = value.alpha
          ACK.update()
        })
        .onComplete(() => {
          resolve()
        })
        .start()

      this.emit('enter-level', { level })
    })
  }

  exit (level) {
    let c = this.levelContainer(level)

    return new Promise((resolve, reject) => {
      let value = { alpha: 1.0 }
      new TWEEN.Tween(value)
        .to({ alpha: 0.0 }, 500)
        .easing(TWEEN.Easing.Quadratic.Out)
        .onUpdate(() => {
          if (c) {
            c.alpha = value.alpha
            ACK.update()
          }
        })
        .onComplete(() => {
          this._container.removeChildren()
          resolve()
        })
        .start()

      this.emit('exit-level', { level })
    })
  }

  async gotoLevel (level, x, y) {
    if (this._level !== level) {
      ACK.pauseInput = true
      await this.exit(this._level)
      await this.enter(level, x, y)
      ACK.pauseInput = false
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
    let sw = VIDEO_WIDTH / 2
    let sh = VIDEO_HEIGHT / 2
    this.scrollTo(-x + sw, -y + sh)
  }

}

module.exports = {
  Map,
}

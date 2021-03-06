const { EventsManager } = require('../../mixins/common/events')
const { StateMixin } = require('../../mixins/common/state')
const { ActMixin } = require('../../mixins/core/act')
const { TilesMixin } = require('../../mixins/map/tiles')
const { ItemsMixin } = require('../../mixins/map/items')
const { NpcsMixin } = require('../../mixins/map/npcs')
const { SpritesMixin } = require('../../mixins/map/sprites')
const { LevelsMixin } = require('../../mixins/map/levels')
const { RoomsMixin } = require('../../mixins/map/rooms')
const { CorridorsMixin } = require('../../mixins/map/corridors')
const { LevelsGeneratorMixin } = require('../../mixins/map/generators/levels')
const { DoorsGeneratorMixin } = require('../../mixins/map/generators/doors')
const { StairsGeneratorMixin } = require('../../mixins/map/generators/stairs')

const { VIDEO_WIDTH, VIDEO_HEIGHT, VIDEO_SCALE, TILE_WIDTH, TILE_HEIGHT, TILE_FLOOR } = require('../../constants')

const { TextObject } = require('../objects/text-object')

class Map extends mix(Object).with(EventsManager, StateMixin, ActMixin, TilesMixin, ItemsMixin, NpcsMixin, SpritesMixin, LevelsMixin, RoomsMixin, CorridorsMixin, LevelsGeneratorMixin, DoorsGeneratorMixin, StairsGeneratorMixin) {

  constructor (width, height, depth = 1) {
    super()

    this._needsRender = false

    this._width = 0
    this._height = 0
    this._depth = 0

    this._explored = []

    this._width = width
    this._height = height
    this._depth = depth
  }

  get container () { return this._container }

  get width () { return this._width }
  get height () { return this._height }
  get depth () { return this._depth }

  get player () { return ACK.player }

  get explored () { return this._explored }

  get bounds () { return new PIXI.Rectangle(0, 0, this._width * TILE_WIDTH, this._height * TILE_HEIGHT) }

  start () {
    this._container = new PIXI.Container()

    this._container.interactive = true

    if (ACK.DEVMODE) {
      this._container.on('mousemove', e => {
        this.unselectTiles()
        if (!ACK.pauseInput && e.target) {
          let x = e.data.global.x / VIDEO_SCALE - _.get(e, 'target.position.x', 0)
          let y = e.data.global.y / VIDEO_SCALE - _.get(e, 'target.position.y', 0)
          let tx = Math.floor(x / TILE_HEIGHT)
          let ty = Math.floor(y / TILE_WIDTH)
          let t = this.tileAt(tx, ty, this._level)
          // if (t && t._type === TILE_FLOOR && this.isExplored(tx, ty, this._level) && t._sprite.alpha !== 0) {
          if (t) {
            this.selectTileAt(tx, ty)
          }
        }
      })

      this._container.on('mousedown', e => {
        if (!ACK.pauseInput && e.target) {
          let x = e.data.global.x / VIDEO_SCALE - _.get(e, 'target.position.x', 0)
          let y = e.data.global.y / VIDEO_SCALE - _.get(e, 'target.position.y', 0)
          let tx = Math.floor(x / TILE_HEIGHT)
          let ty = Math.floor(y / TILE_WIDTH)
          let at = this.at(tx, ty, this._level)
          if (at) {
            console.info('\n-----------------------')
            console.info('x:', tx, 'y:', ty, 'z:', this._level)
            console.info(at.tile)
            console.info(at.items)
            console.info(at.npcs)
            console.info(at.player)
            console.info('-----------------------\n')
          }
        }
      })
    }

    super.start()
  }

  stop () {
    if (this._container) {
      this._container.parent.removeChild(this._container)
      this._container.destroy({ children: true })
      this._container = undefined
    }

    super.stop()
  }

  isFloorAt (x, y, z) {
    return _.get(this.tileAt(x, y, z), 'type') === TILE_FLOOR
  }

  isWallAt (x, y, z) {
    return _.get(this.tileAt(x, y, z), 'isWall', false)
  }

  isEmptyFloorAt (x, y, z) {
    return this.isFloorAt(x, y, z) && _.isEmpty(this.itemsAt(x, y, z)) && _.isEmpty(this.npcsAt(x, y, z))
  }

  randomFloorPosition (z, bounds, iter) {
    if (!bounds) {
      bounds = new PIXI.Rectangle(0, 0, this._width, this._height)
    }
    let tries = 0
    let x = _.random(bounds.left, bounds.right)
    let y = _.random(bounds.top, bounds.bottom)
    while (!this.isEmptyFloorAt(x, y, z) && (!iter || iter.call(this, x, y, z)) && tries < 1000) {
      x = _.random(bounds.left, bounds.right)
      y = _.random(bounds.top, bounds.bottom)
      tries++
    }
    return tries >= 1000 ? undefined : { x, y }
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

  act (t, delta) {
    super.act(t, delta)

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

  scrollTo (x, y, animate = true) {
    let c = this._container
    if (animate) {
      ACK.addAction(
        ACK.spriteAction({
          instance: c,
          auto: true,
          ease: 'quadratic-out',
          duration: 250,
          start: { x: c.position.x, y: c.position.y },
          end: { x, y },
        })
      )
    }
    else {
      c.position.set(x, y)
      ACK.update()
    }
  }

  scrollBy (x, y, animate = true) {
    let c = this._container
    this.scrollTo(c.position.x + x, c.position.y + y, animate)
  }

  centerOn (x, y, animate = true) {
    let sw = VIDEO_WIDTH / 2
    let sh = VIDEO_HEIGHT / 2
    this.scrollTo(-x + sw, -y + sh, animate)
  }

  enter (level, x, y) {
    this._container.removeChildren()

    let c = this.levelContainer(level)
    this._container.addChild(c)

    let promise = super.enter(level, x, y)

    let p = !x && !y ? this.randomPositionInRoom(this.randomRoom(level), level) : { x, y }
    this.player.moveTo(p.x, p.y, level, this, false, false)
    this.player.centerOn()

    let t = this.drawText(p.x * TILE_WIDTH, p.y * TILE_HEIGHT - TILE_HEIGHT, 0, '', ACK.font('normal_bold'))
    ACK.addAction([
      ACK.textAction({
        instance: t,
        auto: true,
        delay: 3000,
        duration: 2500,
        ease: 'quadratic-out',
        start: '',
        end: 'HELLO WORLD!',
      }),
      ACK.spriteAction({
        instance: t,
        auto: true,
        delay: 3000,
        duration: 2500,
        ease: 'quadratic',
        start: { red: 1, blue: 1, green: 1 },
        end: { red: 1, blue: 0, green: 0.75 },
      }),
      ACK.destroyAction({
        instance: t,
        delay: 1000,
      }),
    ])

    this.emit('enter-map')

    return promise
  }

  exit (level) {
    return super.exit(level).then(() => {
      this._container.removeChildren()
      this.emit('exit-map')
    })
  }

  drawText (x, y, z, text, font, color = 0xffffffff) {
    return new TextObject(x, y, z, this, text, font, color)
  }

}

module.exports = {
  Map,
}

const { EventsManager } = require('../../mixins/common/events')
const { StateMixin } = require('../../mixins/common/state')
const { ActMixin } = require('../../mixins/core/act')
const { ItemsMixin } = require('../../mixins/room/items')
const { NpcsMixin } = require('../../mixins/room/npcs')
const { SpritesMixin } = require('../../mixins/room/sprites')
const { TextObject } = require('../objects/text-object')

const { VIDEO_WIDTH, VIDEO_HEIGHT, DOOR } = require('../../constants')

class Room extends mix(Object).with(EventsManager, StateMixin, ActMixin, ItemsMixin, NpcsMixin, SpritesMixin) {

  constructor (scene) {
    super()

    _.addProp(this, 'scene', scene, true)
    _.addProp(this, 'container', undefined, true)
    _.addProp(this, 'needsRender', false, true)
    _.addProp(this, 'explored', false)

  }

  get width () { return this._container.width }
  get height () { return this._container.height }

  get player () { return ACK.player }

  get wall () { return _.find(this._items, { isWall: true }) }
  get doors () { return _.filter(this._items, { type: DOOR }) }

  start () {
    this._container = new PIXI.Container()
    this._container.interactive = true

    super.start()

    let wall = new ACK.Wall(0, 0, this)
    wall.center(false, true)
    this.addItemToRoom(wall)
  }

  stop () {
    if (this._container) {
      this._container.parent.removeChild(this._container)
      this._container.destroy({ children: true })
      this._container = undefined
    }

    super.stop()
  }

  enter () {
    let c = this._container
    c.alpha = 0
    this._scene.addToPlayContainer(c)

    return new Promise((resolve, reject) => {
      ACK.addAction(
        ACK.spriteAction({
          instance: c,
          auto: true,
          ease: 'quadratic',
          duration: 500,
          start: { alpha: 0.0 },
          end: { alpha: 1.0 },
          done: () => {
            this.emit('enter-room')
            resolve()
          }
        })
      )
    })
  }

  exit () {
    let c = this._container

    return new Promise((resolve, reject) => {
      if (!c) {
        resolve()
      }
      else {
        ACK.addAction(
          ACK.spriteAction({
            instance: c,
            auto: true,
            ease: 'quadratic',
            duration: 500,
            start: { alpha: 1.0 },
            end: { alpha: 0.0 },
            done: () => {
              this._scene.removeFromPlayContainer(c)
              this.emit('exit-room')
              resolve()
            }
          })
        )
      }
    })
  }

  at (x, y) {
    let items = this.itemsAt(x, y)
    let npcs = this.npcsAt(x, y)
    return { items, npcs }
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
    this.needsRender = true
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

  drawText (x, y, z, text, font, color = 0xffffffff) {
    return new TextObject(x, y, z, this, text, font, color)
  }

}

module.exports = {
  Room,
}

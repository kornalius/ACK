const { EventsManager } = require('../mixins/common/events')
const { StateMixin } = require('../mixins/common/state')
const { ActMixin } = require('../mixins/core/act')

const { WoodDoor, GlassDoor } = require('../game/items/doors')
const { WoodWindow } = require('../game/items/windows')

const { Scrollbox } = require('../classes/ui/scrollbox')

const { VIDEO_SCALE, VIDEO_WIDTH, VIDEO_HEIGHT } = require('../constants')

class Editor extends mix(Object).with(EventsManager, StateMixin, ActMixin) {

  constructor (scene) {
    super()

    _.addProp(this, 'container', undefined, true)
    _.addProp(this, 'scene', scene, true)
    _.addProp(this, 'mouseLocation', undefined, true)

    _.addProp(this, 'itemsContainer', undefined, true)
  }

  get itemsWidth () { return 100 }
  get itemsMargins () { return 2 }

  get room () { return this._scene.room }

  get items () {
    return [WoodDoor, GlassDoor, WoodWindow]
  }

  start () {
    this._container = new PIXI.Container()
    this._container.interactive = true
    this._scene.uiContainer.addChild(this._container)

    this._mouseLocation = ACK.text('')
    this._mouseLocation.sprite.position.set(0, VIDEO_HEIGHT - 10)
    this._container.addChild(this._mouseLocation.sprite)

    let items = []
    let m = this.itemsMargins
    let x = m
    let y = m
    let lineHeight = 0
    for (let i of this.items) {
      let c = new i()
      c.sprite.position.set(x, y)
      c.__class = i
      items.push(c)

      if (c.sprite.height > lineHeight) {
        lineHeight = c.sprite.height
      }

      x += c.sprite.width + m
      if (x >= this.itemsWidth) {
        y += lineHeight + m
        lineHeight = 0
        x = m
      }
    }

    this._itemsContainer = new Scrollbox()
    this._itemsContainer.position.set(VIDEO_WIDTH - this.itemsWidth, 0)
    this._itemsContainer.constraints = 'y'
    this._itemsContainer.video_scale = VIDEO_SCALE
    this._itemsContainer.resize(this.itemsWidth, y + lineHeight + m)
    this._scene.uiContainer.addChild(this._itemsContainer)

    for (let i of items) {
      this._itemsContainer.content.addChild(i.sprite)
    }

    this.room.container.on('mousemove', e => {
      if (!ACK.pauseInput) {
        let x = ACK.cursorPos.x
        let y = ACK.cursorPos.y
        this._scene.updateDevInfo({ x, y })
      }
    })

    this.room.container.on('mousedown', e => {
      if (!ACK.pauseInput) {
        let x = ACK.cursorPos.x
        let y = ACK.cursorPos.y
        let at = this.room.at(x, y)
        if (at) {
          console.info('x:', x, 'y:', y)
          console.info(at.items)
          console.info(at.npcs)
          console.info('------------------------------------\n')
        }
      }
    })

    super.start()
  }

  stop () {
    this.room.container.off('mousemove')
    this.room.container.off('mousedown')

    this._mouseLocation.parent.removeChild(this._mouseLocation)
    this._mouseLocation = undefined

    this._container.parent.removeChild(this._container)
    this._container = undefined

    super.stop()
  }

  act (t, delta) {
    super.act(t, delta)
  }

}

module.exports = {
  Editor,
}

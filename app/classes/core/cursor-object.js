const { EventsManager } = require('../../mixins/common/events')
const { SpriteMixin } = require('../../mixins/core/sprite')

let CursorObject = class CursorObject extends mix(Object).with(EventsManager, SpriteMixin) {

  constructor () {
    super()

    this.reset()

    setTimeout(() => this.start())
  }

  get x () { return this._x }
  get y () { return this._y }

  get originX () { return this._originX }
  set originX (value) {
    if (value !== this._originX) {
      this._originX = value
    }
  }

  get originY () { return this._originY }
  set originY (value) {
    if (value !== this._originY) {
      this._originY = value
    }
  }

  get btns () { return this._btns }
  get left () { return this._btns & 0x01 }
  get middle () { return this._btns & 0x02 }
  get right () { return this._btns & 0x04 }

  start () {
    let stage = ACK.video.stage
    stage.interactive = true

    stage.on('mousedown', this.onMouseDown.bind(this))
    stage.on('rightdown', this.onMouseDown.bind(this))
    stage.on('touchstart', this.onMouseDown.bind(this))

    stage.on('mousemove', this.onMouseMove.bind(this))

    stage.on('mouseup', this.onMouseUp.bind(this))
    stage.on('touchend', this.onMouseUp.bind(this))
    stage.on('mouseupoutside', this.onMouseUp.bind(this))
    stage.on('touchendoutside', this.onMouseUp.bind(this))

    ACK.on('start', () => {
      this.createSprite('avatar.png')
    })
  }

  reset () {
    this._x = 0
    this._y = 0
    this._originX = 0
    this._originY = 0
    this._btns = 0
  }

  moveTo (x, y) {
    let renderer = ACK.video.renderer

    x = Math.trunc(Math.min(renderer.width - this._originX, Math.max(this._originX + 1, x)) / this.sprite.scale.x)
    y = Math.trunc(Math.min(renderer.height - this._originY, Math.max(this._originY + 1, y)) / this.sprite.scale.y)

    this._x = x
    this._y = y
    this.sprite.position.set(x, y)

    this.emit('move', { x: this._x, y: this._y })
  }

  destroy () {
    super.destroy()
  }

  tick (t, delta) {
  }

  onMouseDown (e) {
    switch (e.data.originalEvent.button) {
      case 0: // left
        this._btns |= 0x01
        break

      case 1: // middle
        this._btns |= 0x02
        break

      case 2: // right
        this._btns |= 0x04
        break
    }
  }

  onMouseUp (e) {
    switch (e.data.originalEvent.button) {
      case 0: // left
        this._btns &= ~0x01
        break

      case 1: // middle
        this._btns &= ~0x02
        break

      case 2: // right
        this._btns &= ~0x04
        break
    }
  }

  onMouseMove (e) {
    this.moveTo(e.data.global.x, e.data.global.y)
    ACK.update()
  }

}

module.exports = {
  CursorObject,
}

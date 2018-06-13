const { EventsManager } = require('../../mixins/common/events')
const { SpriteMixin } = require('../../mixins/core/sprite')
const { StateMixin } = require('../../mixins/core/state')
const { ActMixin } = require('../../mixins/core/act')

let Cursor = class Cursor extends mix(Object).with(EventsManager, SpriteMixin, StateMixin, ActMixin) {

  constructor () {
    super()

    this.reset()
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

    this._onMouseDown = this.onMouseDown.bind(this)
    this._onMouseMove = this.onMouseMove.bind(this)
    this._onMouseUp = this.onMouseUp.bind(this)

    stage.on('mousedown', this._onMouseDown)
    stage.on('rightdown', this._onMouseDown)
    stage.on('touchstart', this._onMouseDown)

    stage.on('mousemove', this._onMouseMove)

    stage.on('mouseup', this._onMouseUp)
    stage.on('touchend', this._onMouseUp)
    stage.on('mouseupoutside', this._onMouseUp)
    stage.on('touchendoutside', this._onMouseUp)

    ACK.on('start', () => {
      this.createSprite('cursor.png')
    })

    super.start()
  }

  stop () {
    let stage = ACK.video.stage

    stage.off('mousedown', this._onMouseDown)
    stage.off('rightdown', this._onMouseDown)
    stage.off('touchstart', this._onMouseDown)

    stage.off('mousemove', this._onMouseMove)

    stage.off('mouseup', this._onMouseUp)
    stage.off('touchend', this._onMouseUp)
    stage.off('mouseupoutside', this._onMouseUp)
    stage.off('touchendoutside', this._onMouseUp)

    super.stop()
  }

  reset () {
    _.resetProps(this)

    this._x = 0
    this._y = 0
    this._btns = 0
    this._originX = 0
    this._originY = 0
  }

  moveTo (x, y) {
    let video = ACK.video

    x = Math.trunc(Math.min(video.width - this._originX, Math.max(this._originX, x)))
    y = Math.trunc(Math.min(video.height - this._originY, Math.max(this._originY, y)))

    this._x = x
    this._y = y
    this.sprite.position.set(x, y)

    this.emit('cursor-move', { x: this._x, y: this._y })
  }

  destroy () {
    this.stop()
    super.destroy()
  }

  onMouseDown (e) {
    if (this.isRunning) {
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
  }

  onMouseUp (e) {
    if (this.isRunning) {
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
  }

  onMouseMove (e) {
    if (this.isRunning) {
      this.moveTo(e.data.global.x / ACK.video.stage.scale.x, e.data.global.y / ACK.video.stage.scale.y)
      ACK.update()
    }
  }

}

module.exports = {
  Cursor,
}

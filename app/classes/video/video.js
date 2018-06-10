const { Emitter } = require('../../mixins/common/events')

const VIDEO_WIDTH = 320
const VIDEO_HEIGHT = 240
const VIDEO_SCALE = 4

class Video extends Emitter {

  constructor () {
    super()

    PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST

    this._stage = new PIXI.Container()
    this._renderer = new PIXI.autoDetectRenderer(VIDEO_WIDTH * VIDEO_SCALE, VIDEO_HEIGHT * VIDEO_SCALE, { roundPixels: true })

    this._force_update = false

    this._width = VIDEO_WIDTH
    this._height = VIDEO_HEIGHT
    this._scale = VIDEO_SCALE

    this.stage.scale = new PIXI.Point(this._scale, this._scale)

    // this._renderer.resize(this._width * this._scale, this._height * this._scale)
    this._renderer.view.style.position = 'absolute'
    // this._renderer.view.style.top = Math.trunc(this._marginX / 2) + 'px'
    // this._renderer.view.style.left = Math.trunc(this._marginY / 2) + 'px'

    window.addEventListener('resize', () => {
      this.resize()
    })

    this.reset()

    setTimeout(() => {
      document.body.appendChild(this._renderer.view)
      this.resize()
    }, 100)
  }

  get stage () { return this._stage }
  get renderer () { return this._renderer }
  get width () { return this._width }
  get height () { return this._height }
  get scale () { return this._scale }

  reset () {
  }

  destroy () {
  }

  resize () {
    // let ratio = Math.min(window.innerWidth / this.width, window.innerHeight / this.height)
    // this._stage.scale.x = this._stage.scale.y = ratio
    // this._renderer.resize(Math.ceil(this.width * ratio), Math.ceil(this.height * ratio))
    this._renderer.view.style.left = window.innerWidth * 0.5 - this._renderer.width * 0.5 + 'px'
    this._renderer.view.style.top = window.innerHeight * 0.5 - this._renderer.height * 0.5 + 'px'

    this.update()
  }

  update () {
    this._force_update = true
  }

  tick (t, delta) {
    if (this._force_update) {
      this._force_update = false
      this._renderer.render(this._stage)
    }
  }

}

module.exports = {
  Video,
  VIDEO_WIDTH,
  VIDEO_HEIGHT,
  VIDEO_SCALE,
}

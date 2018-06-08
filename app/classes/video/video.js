const { Emitter } = require('../../mixins/common/events')

PIXI.Point.prototype.distance = target => {
  Math.sqrt((this.x - target.x) * (this.x - target.x) + (this.y - target.y) * (this.y - target.y))
}

const VIDEO_WIDTH = 320
const VIDEO_HEIGHT = 240
const VIDEO_SCALE = 3

ACK.stage = new PIXI.Container()
ACK.renderer = new PIXI.autoDetectRenderer(100, 100, null, { roundPixels: true, autoResize: true })

class Video extends Emitter {

  constructor () {
    super()

    this.force_update = false

    this._width = VIDEO_WIDTH
    this._height = VIDEO_HEIGHT
    this._scale = VIDEO_SCALE

    ACK.renderer.resize(this._width * this._scale, this._height * this._scale)
    ACK.renderer.view.style.position = 'absolute'
    // ACK.renderer.view.style.top = Math.trunc(this._marginX / 2) + 'px'
    // ACK.renderer.view.style.left = Math.trunc(this._marginY / 2) + 'px'

    window.addEventListener('resize', () => {
      this.resize()
    })

    this.reset()

    setTimeout(() => {
      document.body.appendChild(ACK.renderer.view)
      this.resize()
    }, 100)
  }

  get width () { return this._width }
  get height () { return this._height }
  get scale () { return this._scale }

  tick (t) {
    if (this.force_update) {
      this.force_update = false
      ACK.renderer.render(ACK.stage)
    }
  }

  reset () {
    this.clear()
  }

  update () {
    this.force_update = true
  }

  clear () {
  }

  shut () {
  }

  resize () {
    // let ratio = Math.min(window.innerWidth / this.width, window.innerHeight / this.height)
    // this.ACK.stage.scale.x = this.ACK.stage.scale.y = ratio
    // ACK.renderer.resize(Math.ceil(this.width * ratio), Math.ceil(this.height * ratio))
    ACK.renderer.view.style.left = window.innerWidth * 0.5 - ACK.renderer.width * 0.5 + 'px'
    ACK.renderer.view.style.top = window.innerHeight * 0.5 - ACK.renderer.height * 0.5 + 'px'

    this.update()
  }
}

module.exports = {
  Video,
  VIDEO_WIDTH,
  VIDEO_HEIGHT,
  VIDEO_SCALE,
}

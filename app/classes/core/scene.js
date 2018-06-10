const { EventsManager } = require('../../mixins/common/events')
const { StatsMixin } = require('../../mixins/core/stats')
const { StateMixin } = require('../../mixins/core/state')
const { ActMixin } = require('../../mixins/core/act')

let Scene = class Scene extends mix(Object).with(EventsManager, StatsMixin, StateMixin, ActMixin) {

  constructor () {
    super()

    this._container = new PIXI.Container()

    this.reset()
  }

  reset () {
    this.clearStats()
  }

  start () {
    ACK.video.stage.addChildAt(this._container, 0)
    super.start()
  }

  stop () {
    ACK.video.stage.removeChild(this._container)
    this._container.removeChildren()
    super.stop()
  }

  load (cb) {
    cb()
  }

  act (t, delta) {
  }

  newSprite (frame, x = 0, y = 0, anchor = 0.5) {
    let sprite

    if (_.isArray(frame)) {
      sprite = new PIXI.extras.AnimatedSprite(frame)
      sprite.animationSpeed = 0.5
      sprite.play()
    }
    else {
      sprite = new PIXI.Sprite(PIXI.Texture.fromFrame(frame))
    }

    sprite.anchor.set(anchor)
    sprite.position.set(x, y)

    this._container.addChild(sprite)

    return sprite
  }

}

module.exports = {
  Scene,
}

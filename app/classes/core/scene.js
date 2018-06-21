const { EventsManager } = require('../../mixins/common/events')
const { StateMixin } = require('../../mixins/common/state')
const { ActMixin } = require('../../mixins/core/act')

class Scene extends mix(Object).with(EventsManager, StateMixin, ActMixin) {

  constructor () {
    super()

    this.reset()
  }

  reset () {
    _.resetProps(this)
  }

  start () {
    this._container = new PIXI.Container()
    ACK.video.stage.addChildAt(this._container, 0)
    super.start()
  }

  stop () {
    ACK.video.stage.removeChild(this._container)
    this._container.destroy({ children: true })
    this._container = null
    super.stop()
  }

  load (cb) {
    cb()
  }

  act (t, delta) {
    super.act(t, delta)
  }

  update () {
  }

  newContainer (sprites) {
    let container = new PIXI.Container()
    for (let sprite of sprites) {
      container.addChild(sprite)
    }
    return container
  }

  newSprite (frame, x = 0, y = 0, anchor = 0) {
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

    return sprite
  }

  addToScene (sprite) {
    if (_.isArray(sprite)) {
      for (let s of sprite) {
        this._container.addChild(s)
      }
    }
    else {
      this._container.addChild(sprite)
    }
    ACK.update()
  }

  removeFromScene (sprite) {
    if (_.isArray(sprite)) {
      for (let s of sprite) {
        this._container.removeChild(s)
      }
    }
    else {
      this._container.removeChild(sprite)
    }
    ACK.update()
  }

}

module.exports = {
  Scene,
}

const SpriteMixin = Mixin(superclass => class SpriteMixin extends superclass {

  constructor () {
    super(...arguments)

    _.addProp(this, 'sprite', undefined, true, 'resetSprite')
  }

  get isSprite () { return true }

  resetSprite () {
    this.destroySprite()
  }

  createSprite (frame) {
    let sprite

    if (_.isArray(frame)) {
      sprite = new PIXI.extras.AnimatedSprite(frame)
      sprite.animationSpeed = 0.5
      sprite.play()
    }
    else {
      sprite = new PIXI.Sprite(PIXI.Texture.fromFrame(frame))
    }

    sprite.anchor.set(0.5)

    ACK.video.stage.addChild(sprite)

    this._sprite = sprite
  }

  destroySprite () {
    if (this._sprite) {
      ACK.video.stage.removeChild(this._sprite)
      this._sprite.destroy()
      this._sprite = undefined
    }
  }

  destroy () {
    this.destroySprite()
  }

})

module.exports = {
  SpriteMixin,
}

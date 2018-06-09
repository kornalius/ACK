const SpriteMixin = Mixin(superclass => class SpriteMixin extends superclass {

  constructor () {
    super(...arguments)

    this._sprite = undefined
  }

  get sprite () { return this._sprite }

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

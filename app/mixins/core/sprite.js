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
    if (!frame) {
      return undefined
    }

    let sprite

    if (_.isArray(frame)) {
      let frames = []
      for (let f of frame) {
        frames.push(PIXI.Texture.fromFrame(f))
      }
      sprite = new PIXI.extras.AnimatedSprite(frames)
      sprite.animationSpeed = 0.05
      sprite.play()
      sprite.onFrameChange = () => {
        ACK.update()
      }
    }
    else {
      sprite = new PIXI.Sprite(PIXI.Texture.fromFrame(frame))
    }

    this._sprite = sprite

    return sprite
  }

  destroySprite () {
    if (this._sprite) {
      if (this._sprite.parent) {
        this._sprite.parent.removeChild(this._sprite)
      }
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

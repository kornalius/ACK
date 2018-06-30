const SpriteMixin = Mixin(superclass => class SpriteMixin extends superclass {

  constructor () {
    super(...arguments)

    _.addProp(this, 'sprite', undefined, true, 'resetSprite')
  }

  get isSprite () { return true }

  get bounds () {
    let s = this._sprite
    return new PIXI.Rectangle(s.position.x, s.position.y, s.width, s.height)
  }

  resetSprite () {
    this.destroySprite()
  }

  updateSprite (frame) {
    let sprite = this._sprite

    if (_.isArray(frame)) {
      let frames = []
      for (let f of frame) {
        frames.push(PIXI.Texture.fromFrame(f))
      }

      if (sprite) {
        sprite.textures = frames
        sprite.play()
      }
      else {
        sprite = new PIXI.extras.AnimatedSprite(frames)
        sprite.animationSpeed = 0.05
        sprite.play()
        sprite.onFrameChange = () => {
          ACK.update()
        }
      }
    }
    else if (sprite) {
      sprite.texture = PIXI.Texture.fromFrame(frame)
    }
    else {
      sprite = new PIXI.Sprite(PIXI.Texture.fromFrame(frame))
    }

    return sprite
  }

  createSprite (frame) {
    if (!frame) {
      return undefined
    }
    let sprite = this.updateSprite(frame)
    sprite._parent = this
    this._sprite = sprite
    return sprite
  }

  destroySprite () {
    if (this._sprite) {
      if (this._sprite.parent) {
        this._sprite.parent.removeChild(this._sprite)
      }
      this._sprite.destroy({ children: true })
      this._sprite = undefined
    }
  }

  destroy () {
    if (super.destroy) {
      super.destroy()
    }

    this.destroySprite()
  }

})

module.exports = {
  SpriteMixin,
}

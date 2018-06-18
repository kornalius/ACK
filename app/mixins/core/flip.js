const FlipMixin = Mixin(superclass => class FlipMixin extends superclass {

  constructor () {
    super(...arguments)

    _.addProp(this, 'flipX', false)
    _.addProp(this, 'flipY', false)
  }

  setFlipX (value) {
    if (value !== this._flipX) {
      let scale = Math.abs(this._sprite.scale.x)
      scale = value ? -scale : scale
      if (this._sprite.scale.x !== scale) {
        this._sprite.scale.x = scale
        this._sprite.anchor.x = value ? 1 : 0
      }
    }
  }

  setFlipY (value) {
    if (value !== this._flipY) {
      let scale = Math.abs(this._sprite.scale.y)
      scale = value ? -scale : scale
      if (this._sprite.scale.x !== scale) {
        this._sprite.scale.y = scale
        this._sprite.anchor.y = value ? 1 : 0
      }
    }
  }

})

module.exports = {
  FlipMixin,
}

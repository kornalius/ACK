const LightDiffuserMixin = Mixin(superclass => class LightDiffuserMixin extends superclass {

  constructor () {
    super(...arguments)

    _.addProp(this, 'lightRadius', 5)
    _.addProp(this, 'lightIntensity', 5)
    _.addProp(this, 'lightColor', 0xFFFF00)
    _.addProp(this, 'lightDirection', -1)
    _.addProp(this, 'needsRecomputeLight', true)

    this._lightSprites = []
    this._lightPositions = []

    this._lightCaster = new ACK.ROT.FOV.RecursiveShadowcasting((x, y) => this._map.tileAt(x, y, this._z) && this._map.lightBlockedAt(x, y, this._z))
  }

  get isLightDiffuser () { return true }

  setLightRadius () {
    this._needsRecomputeLight = true
  }

  setLightIntensity () {
    this._needsRecomputeLight = true
  }

  setLightColor () {
    this._needsRecomputeLight = true
  }

  setLightDirection () {
    this._needsRecomputeLight = true
  }

  get lightPositions () { return this._lightPositions }

  act (t, delta) {
    let pt = PIXI.Point(this._x, this._y)
    let intensity = this._lightIntensity

    const c = (x, y, radius, visibility) => {
      let p = new PIXI.Point(x, y)
      let d = pt.distance(p)
      let i = intensity * (d / this._lightRadius)
      let sprites = this._map.spritesAt(this._x, this._y, this._z)
      for (let sprite of sprites) {
        sprite.tint = this._lightColor
        sprite.alpha = i
      }
      this._lightSprites = _.concat(this._lightSprites, sprites)
      this._lightPositions.push(p)
    }

    if (this._needsRecomputeLight) {
      for (let sprite of this._lightSprites) {
        sprite.tint = 0xFFFFFF
        sprite.alpha = 1
      }

      this._lightSprites = []
      this._lightPositions = []

      if (this._lightDirection === -1) {
        this._lightCaster.compute(this._x, this._y, this._lightRadius, c)
      }
      else {
        this._lightCaster.compute90(this._x, this._y, this._lightRadius, this._lightDirection, c)
      }

      this._map.update()
    }
  }

  inView (rect) {
    for (let p of this.lightPositions) {
      if (rect.contains(p)) {
        return true
      }
    }
    return false
  }

})

module.exports = {
  LightDiffuserMixin,
}

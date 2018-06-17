const LightDiffuserMixin = Mixin(superclass => class LightDiffuserMixin extends superclass {

  constructor () {
    super(...arguments)

    _.addProp(this, 'lightRadius', 5)
    _.addProp(this, 'lightIntensity', 5)
    _.addProp(this, 'lightColor', 0xFFFF00)
    _.addProp(this, 'lightDirection', -1)
    _.addProp(this, 'needsRecomputeLight', true)

    this._prevSprites = []

    this._fov = new ACK.ROT.FOV.RecursiveShadowcasting((x, y) => this._map.tileAt(x, y, this._z) && this._map.lightBlockedAt(x, y, this._z))
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

  act (t, delta) {
    let pt = PIXI.Point(this._x, this._y)
    let intensity = this._lightIntensity

    const c = (x, y, radius, visibility) => {
      let d = pt.distance(PIXI.Point(x, y))
      let i = intensity * (d / this._lightRadius)
      let sprites = this._map.spritesAt(this._x, this._y, this._z)
      for (let sprite of sprites) {
        sprite.tint = this._lightColor
        sprite.alpha = i
      }
      this._prevSprites = _.concat(this._prevSprites, sprites)
    }

    if (this._needsRecomputeLight) {
      for (let sprite of this._prevSprites) {
        sprite.tint = 0xFFFFFF
        sprite.alpha = 1
      }

      this._prevSprites = []

      if (this._lightDirection === -1) {
        this._fov.compute(this._x, this._y, this._lightRadius, c)
      }
      else {
        this._fov.compute90(this._x, this._y, this._lightRadius, this._lightDirection, c)
      }

      this._map.update()
    }
  }

})

module.exports = {
  LightDiffuserMixin,
}

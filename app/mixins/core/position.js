const PositionMixin = Mixin(superclass => class PositionMixin extends superclass {

  constructor (x, y, z, map) {
    super(...arguments)

    this._x = 0
    this._y = 0
    this._z = 0
    this._map = undefined

    this.moveTo(x, y, z, map, false)
  }

  get x () { return this._x }
  set x (value) {
    if (value !== this._x) {
      let old = this._x
      this._x = value
      this.emit('x-change', { value, old })
    }
  }

  get y () { return this._y }
  set y (value) {
    if (value !== this._y) {
      let old = this._y
      this._y = value
      this.emit('y-change', { value, old })
    }
  }

  get z () { return this._z }
  set z (value) {
    if (value !== this._z) {
      let old = this._z
      this._z = value
      this.emit('z-change', { value, old })
    }
  }

  get map () { return this._map }
  set map (value) {
    if (value !== this._map) {
      let old = this._map
      this._map = value
      this.emit('map-change', { value, old })
    }
  }

  placeSprite (x = this._x, y = this._y, z = this._z, map = this._map, animate = this.animateMove) {
    if (this._sprite) {
      if (!this._sprite.parent || z !== this._z || map !== this._map) {
        if (this._sprite.parent) {
          this._sprite.parent.removeChild(this._sprite)
          this._map.update()
        }
        if (map && map.hasLevel(z)) {
          map.levels[z].addChild(this._sprite)
          map.update()
        }
      }

      if (animate) {
        let coords = { x: this._sprite.position.x, y: this._sprite.position.y }
        new TWEEN.Tween(coords)
          .to({ x, y }, 100)
          .easing(TWEEN.Easing.Linear.None)
          .onUpdate(() => {
            this._sprite.position.set(coords.x, coords.y)
            if (this.isPlayer) {
              this._map.centerOn(coords.x, coords.y, false)
            }
            ACK.update()
          })
          .start()
      }
      else {
        this._sprite.position.set(x, y)
      }
    }
  }

  canMoveTo (x = this._x, y = this._y, z = this._z, map = this._map) {
    return map && map.hasLevel(z)
  }

  moveTo (x = this._x, y = this._y, z = this._z, map = this._map, animate = this.animateMove) {
    if (this.canMoveTo(x, y, z, map)) {
      this.x = x
      this.y = y

      this.placeSprite(this._x, this._y, z, map, animate)

      this.map = map
      this.z = z

      return true
    }
    return false
  }

  moveBy (x, y, z = 0, animate = this.animateMove) {
    return this.moveTo(this._x + x, this._y + y, this._z + z, this._map, animate)
  }

  updateSpriteFrame () {
    this.updateSprite(this._spriteFrame)
    ACK.update()
  }

  distanceFrom (target) {
    if (this._map === target._map && this._z === target.z) {
      return new PIXI.Point(this._x, this._y).distance(new PIXI.Point(target.x, target.y))
    }
    return NaN
  }

  isAt (x = this._x, y = this._y, z = this._z, map = this._map) {
    return this._x === x && this._y === y && this._z === z && this._map === map
  }

  centerOn (animate = true) {
    if (this._map) {
      this._map.centerOn(this._x, this._y, animate)
    }
  }

})

module.exports = {
  PositionMixin,
}

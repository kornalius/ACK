const { VIDEO_WIDTH, VIDEO_HEIGHT } = require('../../constants')

const PositionMixin = Mixin(superclass => class PositionMixin extends superclass {

  get x () { return _.get(this, 'sprite.position.x', 0) }
  set x (value) {
    if (value !== this.x && this._sprite) {
      let old = this.x
      this._sprite.position.x = value
      this.emit('x-change', { value, old })
      ACK.update()
    }
  }

  get y () { return _.get(this, 'sprite.position.y', 0) }
  set y (value) {
    if (value !== this.y && this._sprite) {
      let old = this.y
      this._sprite.position.y = value
      this.emit('y-change', { value, old })
      ACK.update()
    }
  }

  get room () { return this._room }
  set room (value) {
    if (value !== this._room) {
      let old = this._room
      this._room = value
      this.emit('room-change', { value, old })
      ACK.update()
    }
  }

  placeSprite (x = this.x, y = this.y, room = this.room, animate = this.animateMove) {
    if (this._sprite) {
      if (!this._sprite.parent || room !== this._room) {
        if (this._sprite.parent) {
          this._sprite.parent.removeChild(this._sprite)
        }

        if (room) {
          room.container.addChild(this._sprite)
        }

        if (this._room) {
          this._room.update()
        }
        room.update()

        this.room = room
      }

      if (animate) {
        let coords = { x: this._sprite.position.x, y: this._sprite.position.y }
        new TWEEN.Tween(coords)
          .to({ x, y }, 100)
          .easing(TWEEN.Easing.Linear.None)
          .onUpdate(() => {
            this._sprite.position.set(coords.x, coords.y)
            ACK.update()
          })
          .start()
      }
      else {
        this._sprite.position.set(x, y)
      }
    }
  }

  canMoveTo (x = this.x, y = this.y, room = this.room) {
    return !_.isUndefined(room)
  }

  moveTo (x = this.x, y = this.y, room = this.room, animate = this.animateMove) {
    if (this.canMoveTo(x, y, room)) {
      this.placeSprite(x, y, room, animate)
      return true
    }
    return false
  }

  moveBy (x = 0, y = 0, animate = this.animateMove) {
    return this.moveTo(this.x + x, this.y + y, this.room, animate)
  }

  updateSpriteFrame () {
    this.updateSprite(this.spriteFrame)
    ACK.update()
  }

  distanceFrom (target) {
    if (this.room === target.room) {
      return new PIXI.Point(this.x, this.y).distance(new PIXI.Point(target.x, target.y))
    }
    return NaN
  }

  isAt (x = this.x, y = this.y, room = this.room) {
    return this.x === x && this.y === y && this.room === room
  }

  centerOn (animate = true) {
    if (this.room) {
      this.room.centerOn(this.x, this.y, animate)
    }
  }

  center (horizontal = true, vertical = true) {
    let b = this.bounds
    let mx = Math.trunc(b.width / 2)
    let my = Math.trunc(b.height / 2)
    let w = VIDEO_WIDTH
    let h = VIDEO_HEIGHT
    let vmx = Math.trunc(w / 2)
    let vmy = Math.trunc(h / 2)

    if (horizontal) {
      this._sprite.position.x = vmx - mx
    }

    if (vertical) {
      this._sprite.position.y = vmy - my
    }

    ACK.update()
  }

})

module.exports = {
  PositionMixin,
}

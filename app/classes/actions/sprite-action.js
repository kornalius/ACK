const { GameObject } = require('../objects/game-object')
const { Action } = require('../core/action')

class SpriteAction extends Action {

  _setValue (data) {
    let i = this.instance
    if (i instanceof GameObject) {
      i = i.sprite
    }

    for (let key in data) {
      switch (key) {
        case 'x':
          i.position.x = data.x
          break
        case 'y':
          i.position.y = data.y
          break
        case 'scaleX':
          i.scale.x = data.scaleX
          break
        case 'scaleY':
          i.scale.y = data.scaleY
          break
        case 'rotation':
          i.rotation = data.rotation
          break
        case 'skewX':
          i.skew.x = data.skewX
          break
        case 'skewY':
          i.skew.y = data.skewY
          break
        case 'alpha':
          i.alpha = data.alpha
          break
        case 'tint':
          i.tint = data.tint
          break
      }
    }

    ACK.update()
  }

  start () {
    if (super.start()) {
      this._setValue(this.startData)
      return true
    }
    return false
  }

  update (data) {
    this._setValue(data)
  }

}

module.exports = {
  SpriteAction
}

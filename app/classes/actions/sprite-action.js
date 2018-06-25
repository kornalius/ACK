const { GameObject } = require('../objects/game-object')
const { TextObject } = require('../objects/text-object')
const { Action } = require('../core/action')

class SpriteAction extends Action {

  _setValue (data) {
    let i = this.instance
    if (i instanceof GameObject || i instanceof TextObject) {
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
          i.tint = Math.trunc(data.tint)
          break
        case 'red':
        case 'green':
        case 'blue':
          let c = new Color(i.tint)
          c = new Color([_.get(data, 'red', c.red()) * 255, _.get(data, 'green', c.green()) * 255, _.get(data, 'blue', c.blue()) * 255])
          i.tint = c.rgbNumber()
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

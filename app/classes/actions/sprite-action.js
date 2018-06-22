const { GameObject } = require('../objects/game-object')
const { Action } = require('../core/action')

class SpriteAction extends Action {

  update (data) {
    let i = this.instance
    if (i instanceof GameObject) {
      i = i.sprite
    }

    for (let key in data) {
      switch (key) {
        case 'position':
          i.position.set(data.position.x, data.position.y)
          break
        case 'scale':
          i.scale.set(data.scale.x, data.scale.y)
          break
        case 'rotation':
          i.rotation = data.rotation
          break
        case 'skew':
          i.skew.set(data.skew.x, data.skew.y)
          break
        case 'alpha':
          i.alpha = data.alpha
          break
        case 'tint':
          i.tint = data.tint
          break
      }
    }
  }

}

module.exports = {
  SpriteAction
}

const { GameObject } = require('../objects/game-object')
const { Action } = require('../core/action')

class ScaleAction extends Action {

  update (data) {
    let i = this.instance
    if (i instanceof GameObject) {
      i = i.sprite
    }
    i.scale.set(data.x, data.y)
  }

}

module.exports = {
  ScaleAction
}

const { GameObject } = require('../objects/game-object')
const { Action } = require('../core/action')

class RotationAction extends Action {

  update (data) {
    let i = this.instance
    if (i instanceof GameObject) {
      i = i.sprite
    }
    i.rotation = data.rotation
  }

}

module.exports = {
  RotationAction
}

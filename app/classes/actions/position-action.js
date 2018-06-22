const { GameObject } = require('../objects/game-object')
const { Action } = require('../core/action')

class PositionAction extends Action {

  update (data) {
    let i = this.instance
    if (i instanceof GameObject) {
      i = i.sprite
    }
    i.position.set(data.x, data.y)
  }

}

module.exports = {
  PositionAction
}

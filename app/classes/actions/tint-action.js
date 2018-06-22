const { GameObject } = require('../objects/game-object')
const { Action } = require('../core/action')

class TintAction extends Action {

  update (data) {
    let i = this.instance
    if (i instanceof GameObject) {
      i = i.sprite
    }
    i.tint = data.tint
  }

}

module.exports = {
  TintAction
}

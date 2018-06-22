const { GameObject } = require('../objects/game-object')
const { Action } = require('../core/action')

class AlphaAction extends Action {

  update (data) {
    let i = this.instance
    if (i instanceof GameObject) {
      i = i.sprite
    }
    i.alpha = data.alpha
  }

}

module.exports = {
  AlphaAction
}

const { Action } = require('../core/action')

class DestroyAction extends Action {

  done () {
    super.done()

    let i = this.instance
    if (_.isFunction(i.destroy)) {
      i.destroy()
    }
    else if (i instanceof PIXI.DisplayObject) {
      if (i.parent) {
        i.removeChild(i.parent)
      }
    }

    ACK.update()
  }

}

module.exports = {
  DestroyAction
}

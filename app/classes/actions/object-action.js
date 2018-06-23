const { Action } = require('../core/action')

class ObjectAction extends Action {

  _setValue (data) {
    let obj = this.instance

    for (let key in data) {
      switch (key) {
        case 'x':
          this._x = data.x
          break
        case 'y':
          this._y = data.y
          break
        case 'z':
          this._z = data.z
          break
      }
    }

    obj.moveTo(this._x, this._y, this._z)
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
  ObjectAction
}

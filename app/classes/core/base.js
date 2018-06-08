const { EventsManager } = require('../../mixins/common/events')
const { StatsMixin } = require('../../mixins/core/stats')

let Base = class Base extends mix(Object).with(EventsManager, StatsMixin) {

  constructor () {
    super()

    this.clear()
  }

  get x () { return this._x }
  get y () { return this._y }

  clear () {
    this._x = 0
    this._y = 0
    this.clearStats()
  }

}

module.exports = {
  Base,
}

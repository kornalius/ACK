const ActMixin = Mixin(superclass => class ActMixin extends superclass {

  constructor () {
    super(...arguments)

    _.addProp(this, 'actSpeed', 0)
    _.addProp(this, 'lastTick', 0, true)
  }

  get canAct () { return true }

  tick (t, delta) {
    if (t - this._lastTick >= this._actSpeed) {
      this.act(t, delta)
      this._lastTick = t
      return true
    }
    return false
  }

  act (t, delta) {
  }

})

module.exports = {
  ActMixin,
}

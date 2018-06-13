const ActMixin = Mixin(superclass => class ActMixin extends superclass {

  constructor () {
    super(...arguments)

    _.addProp(this, 'tickSpeed', 0)
    _.addProp(this, 'lastTick', 0, true)

    _.addProp(this, 'actSpeed', 100)
    _.addProp(this, 'lastAct', 0, true)
  }

  get hasAct () { return true }

  tick (t, delta) {
    if (t - this._lastTick >= this._tickSpeed) {
      this.act(t, delta)
      this._lastTick = t
      return true
    }
    return false
  }

  canAct (t) {
    let speed = this.hasSpeed ? this.speed : this._actSpeed
    return this.hasSpeed && t - this.lastAct >= speed
  }

  act (t, delta) {
    if (this.canAct(t)) {
      this._lastAct = t
    }
  }

})

module.exports = {
  ActMixin,
}

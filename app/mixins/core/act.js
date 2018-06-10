const ActMixin = Mixin(superclass => class ActMixin extends superclass {

  constructor () {
    super()

    this._actSpeed = 0
    this._lastTick = 0
  }

  get actSpeed () { return this._actSpeed }
  get lastTick () { return this._lastTick }

  tick (t, delta) {
    if (t - this._lastTick >= this._actSpeed) {
      this.act(t, delta)
      this._lastTick = t
    }
  }

  act (t, delta) {
  }

})

module.exports = {
  ActMixin,
}

const EnableMixin = Mixin(superclass => class EnableMixin extends superclass {

  constructor () {
    super(...arguments)

    _.addProp(this, 'enabled', false)
  }

  get hasEnable () { return true }

  get isEnabled () { return this._enabled }
  get isDisabled () { return !this._enabled }

  enable () {
    this.enabled = true
  }

  disable () {
    this.enable = false
  }

  toggleEnable () {
    this.enable = !this.enable
  }

})

module.exports = {
  EnableMixin,
}

const UsableMixin = Mixin(superclass => class UsableMixin extends superclass {

  get isUsable () { return true }

  canUse (amount = 1, target) {
    let ok = !this.isStackable || this.qty >= amount
    return ok && (!target || target.isUsableWith && target.canUseWith(amount, target))
  }

  use (amount = 1, target) {
    let used = this.canUse(amount, target)
    if (used) {
      if (this._container) { // is inside a container
        this._container.removeItem(this, amount)
      }
      if (_.get(target, 'isUsableWith')) {
        target.useWith(amount, this)
      }
    }
    return used
  }

})

module.exports = {
  UsableMixin,
}

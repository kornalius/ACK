const UsableWithMixin = Mixin(superclass => class UsableWithMixin extends superclass {

  get isUsableWith () { return true }

  get useWithType () { return 0 }

  get useWithAmount () { return 1 }

  canUseWith (amount = 1, source) {
    return source.isOfType(this.useWithType) && amount >= this.useWithAmount
  }

  useWith (amount = 1, source) {
    return this.canUseWith(amount, source)
  }

})

module.exports = {
  UsableWithMixin,
}

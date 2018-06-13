const CurrencyMixin = Mixin(superclass => class CurrencyMixin extends superclass {

  constructor () {
    super(...arguments)

    _.addProp(this, 'credit', 0)
  }

  get hasCurrency () { return true }

  earn (amount = 1) {
    this.credit += amount
    this.emit('earn', { value: amount })
  }

  lose (amount = 1) {
    this.credit -= amount
    this.emit('lose', { value: amount })
  }

})

module.exports = {
  CurrencyMixin,
}

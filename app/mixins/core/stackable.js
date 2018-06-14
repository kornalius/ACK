const StackableMixin = Mixin(superclass => class StackableMixin extends superclass {

  constructor () {
    super(...arguments)

    _.addProp(this, 'qty', 1)
  }

  get isStackable () { return true }

  addToStack (amount = 1) {
    this.qty += amount
    this.emit('stack', { value: amount })
  }

  removeFromStack (amount = 1) {
    this.qty -= amount
    this.emit('unstack', { value: amount })
    if (this.qty <= 0 && this.container) {
      this.qty = 0
      this.container.removeItem(this)
    }
  }

})

module.exports = {
  StackableMixin,
}

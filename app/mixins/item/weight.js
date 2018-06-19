const WeightMixin = Mixin(superclass => class WeightMixin extends superclass {

  constructor () {
    super(...arguments)

    _.addProp(this, 'weight', 0.01)
    _.addProp(this, 'maxWeight', 1)
  }

  get hasWeight () { return true }

})

module.exports = {
  WeightMixin,
}

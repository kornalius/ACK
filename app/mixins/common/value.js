const ValueMixin = Mixin(superclass => class ValueMixin extends superclass {

  getValue (value) {
    if (_.isFunction(value)) {
      return value()
    }
    return value
  }

})

module.exports = {
  ValueMixin,
}

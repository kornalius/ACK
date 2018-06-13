const ThrowableMixin = Mixin(superclass => class ThrowableMixin extends superclass {

  constructor () {
    super(...arguments)
  }

  get isThrowable () { return true }

})

module.exports = {
  ThrowableMixin,
}

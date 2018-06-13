const SpeedMixin = Mixin(superclass => class SpeedMixin extends superclass {

  constructor () {
    super(...arguments)

    _.addProp(this, 'speed', 10)
  }

  get hasSpeed () { return true }

})

module.exports = {
  SpeedMixin,
}

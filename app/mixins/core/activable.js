const ActivableMixin = Mixin(superclass => class ActivableMixin extends superclass {

  constructor () {
    super(...arguments)

    _.addProp(this, 'enabled', true)
  }

  get isActivable () { return true }

  canActivate (npc) {
    return this.distanceFrom(npc) <= 1
  }

  activate (npc) {
    return this.canActivate(npc)
  }

})

module.exports = {
  ActivableMixin,
}

const WearableMixin = Mixin(superclass => class WearableMixin extends superclass {

  constructor () {
    super(...arguments)

    _.addProp(this, 'worn', false)
  }

  get isWearable () { return true }

  wear (npc) {
    this.worn = true
    this.emit('wear', { npc })
    npc.emit('wear', { item: this })
  }

  takeoff (npc) {
    this.worn = false
    this.emit('takeoff', { npc })
    npc.emit('takeoff', { item: this })
  }

})

module.exports = {
  WearableMixin,
}

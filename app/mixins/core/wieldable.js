const WieldableMixin = Mixin(superclass => class WieldableMixin extends superclass {

  constructor () {
    super(...arguments)

    _.addProp(this, 'wielded', false)
  }

  get isWieldable () { return true }

  wield (npc) {
    this.wielded = true
    this.emit('wield', { npc })
    npc.emit('unwield', { item: this })
  }

  unwield (npc) {
    this.wield = false
    this.emit('unwield', { npc })
    npc.emit('unwield', { item: this })
  }

})

module.exports = {
  WieldableMixin,
}

const PickableMixin = Mixin(superclass => class PickableMixin extends superclass {

  get isPickable () { return true }

  pickup (npc) {
    if (npc.isItemsHolder) {
      npc.pickupItem(this)
      this.emit('pickup', { npc })
    }
  }

})

module.exports = {
  PickableMixin,
}

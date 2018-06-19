const DropableMixin = Mixin(superclass => class DropableMixin extends superclass {

  get isDropable () { return true }

  drop (npc) {
    if (npc.isItemsHolder) {
      npc.drop(this)
      this.emit('drop', { npc })
    }
  }

})

module.exports = {
  DropableMixin,
}

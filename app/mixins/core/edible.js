const EdibleMixin = Mixin(superclass => class EdibleMixin extends superclass {

  constructor () {
    super(...arguments)

    _.addProp(this, 'foodValue', 1)
  }

  get isEdible () { return true }

  eat (npc) {
    if (this.qty > 0) {
      npc.modifyFullnessBy(this._foodValue)
      this.decreaseQty(1)
      this.emit('eat', { npc, value: this._foodValue })
      npc.emit('eat', { item: this, value: this._foodValue })
    }
  }

})

module.exports = {
  EdibleMixin,
}

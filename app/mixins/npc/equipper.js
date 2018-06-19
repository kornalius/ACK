const EquipperMixin = Mixin(superclass => class EquipperMixin extends superclass {

  constructor () {
    super(...arguments)

    _.addProp(this, 'weapon')
    _.addProp(this, 'armor')
  }

  get isEquipper () { return true }

  isWielding (item) {
    return this._weapon === item
  }

  isWearing (item) {
    return this._armor === item
  }

  wield (item) {
    if (!this.isWielding(item)) {
      this.weapon = item
      item.wield()
      this.emit('wield', { item })
    }
  }

  unwield () {
    if (this._weapon) {
      let item = this._weapon
      this._weapon.unwield()
      this.emit('unwield', { item })
    }
    this.weapon = undefined
  }

  wear (item) {
    if (!this.isWearing(item)) {
      this.armor = item
      item.wear()
      this.emit('wield', { item })
    }
  }

  takeoff () {
    if (this._armor) {
      let item = this._armor
      this._armor.takeoff()
      this.emit('wield', { item })
    }
    this.armor = undefined
  }

  unequip (item) {
    if (this.isWielding(item)) {
      this.unwield()
    }
    if (this.isWearing(item)) {
      this.takeoff()
    }
  }

})

module.exports = {
  EquipperMixin,
}

const DefenderMixin = Mixin(superclass => class DefenderMixin extends superclass {

  constructor () {
    super(...arguments)

    _.addProp(this, 'baseDefense', 0)
  }

  get isDefender () { return true }

  get defenseValue () {
    let modifier = 0
    if (this.weapon) {
      modifier += this.weapon.defenseValue
    }
    if (this.armor) {
      modifier += this.armor.defenseValue
    }
    return this._baseDefense + modifier
  }

})

module.exports = {
  DefenderMixin,
}

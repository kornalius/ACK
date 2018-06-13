const AttackerMixin = Mixin(superclass => class AttackerMixin extends superclass {

  constructor () {
    super(...arguments)

    _.addProp(this, 'baseAttack', 1)
  }

  get isAttacker () { return true }

  get attackValue () {
    let modifier = 0
    if (this.weapon) {
      modifier += this.weapon.baseAttack
    }
    if (this.armor) {
      modifier += this.armor.baseAttack
    }
    return this._baseAttack + modifier
  }

  attack (target) {
    let attack = this.attackValue
    let defense = target.defenseValue
    let max = Math.max(0, attack - defense)
    let damage = 1 + Math.floor(Math.random() * max)
    this.emit('attack', { target, damage })

    target.takeDamage(this, damage)
  }

})

module.exports = {
  AttackerMixin,
}
